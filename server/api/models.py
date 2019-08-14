import os
from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.core.validators import MaxValueValidator, MinValueValidator

from scrape.models import AnimeScrape
from scrape.utils import get_image


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

    @staticmethod
    def save_images(obj, data):
        assert isinstance(obj, Anime), 'obj must be a Anime instance'
        assert isinstance(
            data, AnimeScrape), 'data must be a AnimeScrape instance'
        anime_cover = get_image(f'https://animeflv.net{data.cover}')
        if anime_cover:
            os.makedirs(os.path.join(settings.BASE_DIR, *
                                     obj.cover.split('/')[:-1]), exist_ok=True)
            anime_cover.save(os.path.join(
                settings.BASE_DIR, *obj.cover.split('/')))
        anime_banner = get_image(f'https://animeflv.net{data.banner}')
        if anime_banner:
            os.makedirs(os.path.join(settings.BASE_DIR, *
                                     obj.banner.split('/')[:-1]), exist_ok=True)
            anime_banner.save(os.path.join(
                settings.BASE_DIR, *obj.banner.split('/')))
        for e in data.episodes:
            episode_cover = get_image(f'https://cdn.animeflv.net{e.cover}')
            if episode_cover:
                dir_ = os.path.join(
                    settings.BASE_DIR, settings.MEDIA_ROOT, *e.cover.split('/')[:-1])
                os.makedirs(dir_, exist_ok=True)
                episode_cover.save(os.path.join(
                    settings.BASE_DIR, settings.MEDIA_ROOT, *e.cover.split('/')))

    @classmethod
    def create(cls, anime_data, get_images=False):
        assert isinstance(
            anime_data, AnimeScrape), 'anime_data must be a AnimeScrape instance'

        data = anime_data.to_dict()
        data.update({'state': State.objects.get_or_create(name=anime_data.state)[0],
                     'typea': Type.objects.get_or_create(name=anime_data.typea)[0],
                     'cover': f'/{settings.MEDIA_ROOT}{data["cover"]}',
                     'banner': f'/{settings.MEDIA_ROOT}{data["banner"]}'})
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
            episode_dict = e.to_dict()
            episode_dict.update(
                {'cover': f'/{settings.MEDIA_ROOT}{episode_dict["cover"]}'})
            episodes.append(Episode.objects.create(
                anime=anime, **episode_dict))
        anime.episode_set.add(*episodes)

        # Download the images
        if get_images:
            cls.save_images(anime, anime_data)

        return anime

    def update(self, new_anime_data, get_images=False):
        assert isinstance(
            new_anime_data, AnimeScrape), 'new_anime_data must be a AnimeScrape instance'
        data = new_anime_data.to_dict()
        data.update({'state': State.objects.get_or_create(name=new_anime_data.state)[0],
                     'typea': Type.objects.get_or_create(name=new_anime_data.typea)[0],
                     'cover': f'/{settings.MEDIA_ROOT}{data["cover"]}',
                     'banner': f'/{settings.MEDIA_ROOT}{data["banner"]}'})

        for attr, value in data.items():
            setattr(self, attr, value)
        self.save()

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
            episode_dict = e.to_dict()
            episode_dict.update(
                {'cover': f'/{settings.MEDIA_ROOT}{episode_dict["cover"]}'})
            episodes.append(Episode.objects.create(anime=self, **episode_dict))
        self.episode_set.add(*episodes)

        # Update the images
        if get_images:
            self.save_images(self, new_anime_data)

    @classmethod
    def create_or_update(cls, data, get_images=False):
        assert isinstance(
            data, AnimeScrape), 'data must be a AnimeScrape instance'
        assert isinstance(data.aid, int), 'aid must be a integer'
        try:
            a = cls.objects.get(aid=data.aid)
            a.update(data, get_images=get_images)
            return True
        except:
            cls.create(data, get_images=get_image)
            return True
        return False


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
