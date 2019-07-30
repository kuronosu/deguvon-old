from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.validators import MaxValueValidator, MinValueValidator

from scrape.models import AnimeScrape


class State(models.Model):
    name = models.CharField(max_length=50, verbose_name=_('Nombre del estado'))

    def __str__(self):
        return self.name


class Type(models.Model):
    name = models.CharField(max_length=50, verbose_name=_('Nombre del tipo'))

    def __str__(self):
        return self.name


class Genre(models.Model):
    name = models.CharField(max_length=50, verbose_name=_('Nombre del genero'))

    def __str__(self):
        return self.name


class Anime(models.Model):
    aid = models.IntegerField(unique=True, verbose_name=_("Anime ID"))
    name = models.CharField(max_length=300, unique=True,
                            verbose_name=_('Nombre'))
    slug = models.SlugField(max_length=300, unique=True,
                            verbose_name=_('Slug'))
    animeflv_url = models.CharField(
        max_length=300, unique=True, verbose_name=_('AnimeFLV url'))
    state = models.ForeignKey(
        State, on_delete=models.CASCADE, verbose_name=_('Estado'))
    typea = models.ForeignKey(
        Type, on_delete=models.CASCADE, verbose_name=_('Tipo'))
    cover = models.CharField(
        max_length=300, verbose_name=_('Imagen de portada'))
    synopsis = models.TextField(verbose_name=_('Sinopsis'))
    banner = models.CharField(max_length=300, verbose_name=_('Banner'))
    score = models.FloatField(verbose_name=_('Puntaje'), validators=[
                              MinValueValidator(0), MaxValueValidator(5)])
    genres = models.ManyToManyField(Genre, verbose_name=_('Generos'))

    def __str__(self):
        return f'{self.name}: {self.animeflv_url}'

    @classmethod
    def create(cls, anime_data):
        assert isinstance(
            anime_data, AnimeScrape), 'anime_data must be a AnimeScrape instance'

        data = anime_data.to_dict()
        data.update({'state': State.objects.get_or_create(name=anime_data.state)[0],
                     'typea': Type.objects.get_or_create(name=anime_data.typea)[0]})
        anime = cls.objects.create(**data)
        genres = []
        for g in anime_data.genres:
            genres.append(Genre.objects.get_or_create(name=g)[0])
        anime.genres.add(*genres)

        relations = []
        for r in anime_data.relations:
            relations.append(Relation.objects.create(
                anime=anime, **r.to_dict()))
        anime.relation_set.add(*relations)

        episodes = []
        for e in anime_data.episodes:
            episodes.append(Episode.objects.create(anime=anime, **e.to_dict()))
        anime.episode_set.add(*episodes)

        return anime

    def update(self, new_anime_data):
        assert isinstance(
            new_anime_data, AnimeScrape), 'new_anime_data must be a AnimeScrape instance'
        data = new_anime_data.to_dict()
        data.update({'state': State.objects.get_or_create(name=new_anime_data.state)[0],
                     'typea': Type.objects.get_or_create(name=new_anime_data.typea)[0]})

        Anime.objects.filter(animeflv_url=self.animeflv_url).update(**data)

        genres = []
        for g in new_anime_data.genres:
            genres.append(Genre.objects.get_or_create(name=g)[0])
        self.genres.set(genres)

        self.relation_set.all().delete()
        relations = []
        for r in new_anime_data.relations:
            relations.append(Relation.objects.create(
                anime=self, **r.to_dict()))
        self.relation_set.add(*relations)

        self.episode_set.all().delete()
        episodes = []
        for e in new_anime_data.episodes:
            episodes.append(Episode.objects.create(anime=self, **e.to_dict()))
        self.episode_set.add(*episodes)


class Relation(models.Model):
    anime = models.ForeignKey(Anime, models.CASCADE)
    ra_name = models.CharField(max_length=300, verbose_name=_(
        'Nombre del anime relacionado'))  # Related anime name
    animeflv_url = models.CharField(
        max_length=300, verbose_name=_('Url del anime relacionado'))
    relation = models.CharField(max_length=100, verbose_name=_('Relación'))

    def __str__(self):
        return f'{self.ra_name} ({self.relation})'


class Episode(models.Model):
    anime = models.ForeignKey(Anime, on_delete=models.CASCADE)
    number = models.FloatField(verbose_name=_('Numero del episodio'))
    animeflv_url = models.CharField(
        max_length=300, unique=True, verbose_name=_('Url del episodio'))
    cover = models.CharField(
        max_length=300, verbose_name=_('Imagen'))

    def __str__(self):
        return f'{self.anime.name}: {self.number}'
