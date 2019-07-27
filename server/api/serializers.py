from django.contrib.auth.models import User, Group
from rest_framework import serializers

from api.models import State, Type, Genre, Relation, Episode, Anime


class StateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = State
        fields = '__all__'


class TypeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'


class GenreSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'


class RelationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Relation
        fields = '__all__'


class EpisodeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Episode
        fields = '__all__'


class AnimeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Anime
        fields = '__all__'
        depth = 1
