from django.contrib.auth.models import User, Group
from rest_framework import serializers

from api.models import State, Type, Genre, Relation, Episode, Anime


class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = '__all__'


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'


class RelationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Relation
        exclude = ['anime', 'id']


class EpisodeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Episode
        exclude = ['id', 'anime']


class EpisodeSerializerWithAnime(EpisodeSerializer):

    anime_aid = serializers.ReadOnlyField(source='anime.aid')


class AnimeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Anime
        exclude = ['id']
        depth = 0
        lookup_field = 'aid'
        extra_kwargs = {
            'url': {'lookup_field': 'aid'}
        }

    episodes = serializers.SerializerMethodField()
    relations = serializers.SerializerMethodField()

    def get_episodes(self, obj):
        return EpisodeSerializer(obj.episode_set.order_by('number'), many=True,
                                 context=self.context).data

    def get_relations(self, obj):
        return RelationSerializer(obj.relation_set, many=True,
                                  context=self.context).data

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response.move_to_end('relations')
        response.move_to_end('episodes')
        return response
