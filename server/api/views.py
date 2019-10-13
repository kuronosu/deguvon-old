import os
import json
from pathlib import Path
from collections import OrderedDict
from PIL import Image
from django.conf import settings
from django.views.static import serve
from django.http import HttpResponse, Http404
from rest_framework import viewsets, views
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import APIException
from rest_framework.generics import get_object_or_404
from rest_framework.mixins import RetrieveModelMixin, ListModelMixin
from scrape.main import get_recents
from scrape.utils import get_image
from scrape.videos import scrape_episode, get_natsuki_video, get_fembed_video
from api.pagination import AnimeSetPagination
from api.models import Anime, Episode, Relation, State, Type, Genre
from api.utils import verify_recents, cache_directory_soft
from api.serializers import (
    AnimeSerializer,
    EpisodeSerializer,
    EpisodeSerializerWithAnime,
    RelationSerializer,
    StateSerializer,
    TypeSerializer,
    GenreSerializer
)


class AnimeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Punto final de API que muestra los animes.
    """
    queryset = Anime.objects.all().order_by('aid')
    serializer_class = AnimeSerializer
    pagination_class = AnimeSetPagination
    lookup_field = 'aid'
    episode_serializer_class = EpisodeSerializerWithAnime
    available_servers = {
        'natsuki': get_natsuki_video,
        'fembed': get_fembed_video
    }

    def get_episode_object(self):
        try:
            return self.get_object().episode_set.get(
                number=self.kwargs['episode'])
        except:
            raise Http404()

    @action(detail=True, url_path='episodes')
    def episode_list(self, request, *args, **kwargs):
        """
        Punto final de API que muestra los episodios de un anime.
        """
        instance = self.get_object().episode_set
        serializer = self.episode_serializer_class(instance, many=True)
        return Response(serializer.data)

    @action(detail=True,
            url_path='episodes/(?P<episode>[0-9]+(\.[0-9]+)?)')
    def episode(self, request, *args, **kwargs):
        """
        Punto final de API que muestra un episodio con los servidores disponibles.
        """
        instance = self.get_episode_object()
        serializer = self.episode_serializer_class(instance)
        servers = self.get_servers_data(instance)
        servers_filtered = {}
        for key, value in servers.items():
            tmp = []
            for i in value:
                if i.get('server', None) in self.available_servers.keys():
                    tmp.append({
                        'server': i.get('server', None),
                        'title': i.get('title', None),
                    })
            servers_filtered[key] = tmp
        data = {'servers': servers_filtered}
        data.update(serializer.data)
        return Response(data)

    @action(detail=True,
            url_path='episodes/(?P<episode>[0-9]+(\.[0-9]+)?)/(?P<server>[a-z]+)')
    def server(self, request, aid, episode, server):
        """
        Punto final de API que muestra un episodio con un servidor específico.
        """
        return self.serve_video(server)

    @action(detail=True,
            url_path='episodes/(?P<episode>[0-9]+(\.[0-9]+)?)/(?P<server>[^/.]+)/(?P<lang>\w{3})')
    def lang(self, request, aid, episode, server, lang):
        """
        Punto final de API que muestra un episodio con un servidor e idioma especifico.
        """
        if lang.upper() in ('LAT', 'SUB', 'ALL'):
            return self.serve_video(server, lang)
        raise APIException('Language not supported or invalid')

    def serve_video(self, server, lang='ALL'):
        server = server.lower()
        instance = self.get_episode_object()
        serializer = self.episode_serializer_class(instance)
        controller = self.available_servers.get(server, None)
        if controller is None:
            raise APIException("Server unsupported or invalid")
        video_url_list = controller(self.get_servers_data(instance), lang)
        data = {'videos': video_url_list}
        data.update(serializer.data)
        return Response(data)

    def get_servers_data(self, episode):
        data = scrape_episode(episode.animeflv_url)
        return json.loads(str(data)
                          .replace('True', "true")
                          .replace('False', 'false')
                          .replace("'", '"'))


class StateViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows states to be viewed.
    """
    queryset = State.objects.all().order_by('id')
    serializer_class = StateSerializer


class TypeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows types to be viewed.
    """
    queryset = Type.objects.all().order_by('id')
    serializer_class = TypeSerializer


class GenreViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows genres to be viewed.
    """
    queryset = Genre.objects.all().order_by('id')
    serializer_class = GenreSerializer


class RecentsViewSet(viewsets.ViewSet):
    """
    API endpoint that allows recent episodes to be viewed.
    """

    def list(self, request, format=None):
        try:
            r = get_recents()
            r = verify_recents(r)
            if len(r) > 0:
                return Response(r)
        except Exception as e:
            print(e)  # TODO logger
        raise APIException('Could not be obtained the recent episodes')


class DirectoryViewSet(viewsets.ViewSet):
    """
    API endpoint that allows directory to be viewed.
    """

    def list(self, request, format=None):
        try:
            directory_path = os.path.join(settings.BASE_DIR, 'directory.json')
            if not os.path.exists(directory_path):
                cache_directory_soft()
            return serve(request,
                         'directory.json',
                         document_root=settings.BASE_DIR)
        except Exception as e:
            print(e)  # TODO logger
        raise APIException('Could not be created the directory')


class ServeImagesViewSet(viewsets.ViewSet):

    SCREENSHOTS_URL_PATH = {
        'regex': r'screenshots/(?P<aid>[0-9]+)/(?P<episode>[0-9]+)/(?P<file>th_[0-9]+.jpg)',
        'url': 'screenshots/{aid}/{episode}/{file}'
    }
    COVERS_URL_PATH = {
        'regex': r'uploads/animes/covers/(?P<file>[0-9]+.jpg)',
        'url': 'uploads/animes/covers/{file}'
    }
    BANNERS_URL_PATH = {
        'regex': r'uploads/animes/banners/(?P<file>[0-9]+.jpg)',
        'url': 'uploads/animes/banners/{file}'
    }

    def serve_image(self, urlpath, Model, attr, req_url):
        if (f'{settings.MEDIA_URL}{urlpath}' in
                Model.objects.all().values_list(attr, flat=True)):
            fullpath = Path(os.path.join(settings.BASE_DIR,
                                         settings.MEDIA_ROOT,
                                         *urlpath.split('/')))
            if fullpath.is_dir():
                raise Http404()
            if fullpath.exists():
                return serve(self.request, urlpath,
                             document_root=settings.MEDIA_ROOT
                             )
            episode_cover = get_image(f'{req_url}{urlpath}')
            if episode_cover:
                dir_ = os.path.join(settings.BASE_DIR,
                                    settings.MEDIA_ROOT,
                                    *urlpath.split('/')[:-1])
                os.makedirs(dir_, exist_ok=True)
                episode_cover.save(os.path.join(
                                   settings.BASE_DIR,
                                   settings.MEDIA_ROOT,
                                   *urlpath.split('/')))
                return serve(self.request, urlpath,
                             document_root=settings.MEDIA_ROOT)
        raise Http404()

    @action(detail=False, url_path=SCREENSHOTS_URL_PATH['regex'])
    def screenshots(self, request, aid, episode, file):
        return self.serve_image(self.SCREENSHOTS_URL_PATH['url'].format(
                                aid=aid, episode=episode, file=file),
                                Episode, 'cover', 'https://cdn.animeflv.net/')

    @action(detail=False, url_path=COVERS_URL_PATH['regex'])
    def covers(self, request, file):
        return self.serve_image(self.COVERS_URL_PATH['url'].format(file=file),
                                Anime, 'cover', 'https://animeflv.net/')

    @action(detail=False, url_path=BANNERS_URL_PATH['regex'])
    def banners(self, request, file):
        return self.serve_image(self.BANNERS_URL_PATH['url'].format(file=file),
                                Anime, 'banner', 'https://animeflv.net/')
