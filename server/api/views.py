import os
import json
from collections import OrderedDict
from PIL import Image
from django.conf import settings
from django.http import HttpResponse, Http404
from rest_framework import viewsets, views
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from scrape.main import get_recents
from scrape.utils import get_image
from api.pagination import AnimeSetPagination
from api.models import Anime, Episode, Relation, State, Type, Genre
from api.serializers import AnimeSerializer, EpisodeSerializer, RelationSerializer, StateSerializer, TypeSerializer, GenreSerializer
from api.utils import verify_recents, cache_directory


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
    anime_serializer_class = AnimeSerializer


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
        # return Response(AnimeSerializer(Anime.objects.all().order_by('aid'), many=True, context={'request': None}).data)
        try:
            directory_path = os.path.join(settings.BASE_DIR, 'directory.json')
            if not os.path.exists(directory_path):
                cache_directory()
            with open(directory_path, 'r') as f:
                return Response(json.load(f))
        except Exception as e:
            print(e)  # TODO logger
        raise APIException('Could not be created the directory')
