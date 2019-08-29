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
from api.utils import verify_recents, cache_directory
from api.serializers import (
    AnimeSerializer,
    EpisodeSerializer,
    RelationSerializer,
    StateSerializer,
    TypeSerializer,
    GenreSerializer
)


class AnimeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows animes to be viewed.
    """
    queryset = Anime.objects.all().order_by('aid')
    serializer_class = AnimeSerializer
    pagination_class = AnimeSetPagination
    lookup_field = 'aid'


class EpisodeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows episodes to be viewed.
    """
    queryset = Episode.objects.all().order_by('id')
    serializer_class = EpisodeSerializer


class RelationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows relations to be viewed.
    """
    queryset = Relation.objects.all().order_by('id')
    serializer_class = RelationSerializer


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
                cache_directory()
            with open(directory_path, 'r') as f:
                return Response(json.load(f))
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
        return serve_image(self.BANNERS_URL_PATH.format(file=file), Anime,
                           'banner', 'https://animeflv.net/')


class ServeVideoViewSet(RetrieveModelMixin,
                        ListModelMixin,
                        viewsets.GenericViewSet):
    # class ServeVideoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows genres to be viewed.
    """
    queryset = Episode.objects.all().order_by('anime')
    serializer_class = EpisodeSerializer
    lookup_field = 'eid'
    available_servers = {
        'natsuki': get_natsuki_video,
        'fembed': get_fembed_video
    }

    def get_object(self):
        return get_object_or_404(
            self.filter_queryset(self.get_queryset()),
            animeflv_url__contains=f'/{self.kwargs["eid"]}/')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = {'servers': self.get_servers_data(instance)}
        data.update(serializer.data)
        return Response(data)

    @action(detail=True,
            url_path='server/(?P<server>[^/.]+)')
    def _server(self, *args, **kwargs):
        return self.server(*args, **kwargs)

    @action(detail=True,
            url_path='server/(?P<server>[^/.]+)/(?P<lang>[^/.]+)')
    def _server_lang(self, *args, **kwargs):
        return self.server(*args, **kwargs)

    def server(self, request, eid, server, lang='ALL'):
        server = server.lower()
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        controller = self.available_servers.get(server, None)
        if not controller:
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
