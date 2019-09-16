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
        exclude = ['url', 'anime']


class EpisodeSerializer(serializers.ModelSerializer):

    anime_aid = serializers.ReadOnlyField(source='anime.aid')

    class Meta:
        model = Episode
        exclude = ['id', 'anime']


class AnimeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Anime
        fields = '__all__'
        depth = 1
        lookup_field = 'aid'
        extra_kwargs = {
            'url': {'lookup_field': 'aid'}
        }

    episodes = serializers.SerializerMethodField()
    relations = serializers.SerializerMethodField()

    def get_episodes(self, obj):
        return EpisodeSerializer(obj.episode_set, many=True, context=self.context).data

    def get_relations(self, obj):
        return RelationSerializer(obj.relation_set, many=True, context=self.context).data
