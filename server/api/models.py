from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.validators import MaxValueValidator, MinValueValidator


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


class Relation(models.Model):
    anime = models.CharField(max_length=300, verbose_name=_(
        'Nombre del anime relacionado'))
    animeflv_url = models.CharField(
        max_length=300, verbose_name=_('Url del anime relacionado'))
    relation = models.CharField(max_length=100, verbose_name=_('Relación'))

    def __str__(self):
        return f'{self.anime} ({self.relation})'


class Episode(models.Model):
    number = models.FloatField(verbose_name=_('Numero del episodio'))
    anime_url = models.CharField(max_length=300, unique=True, verbose_name=_('Url del episodio'))
    cover = models.CharField(
        max_length=300, verbose_name=_('Imagen'))


class Anime(models.Model):
    aid = models.IntegerField(unique=True, verbose_name=_("Anime ID"))
    name = models.CharField(max_length=300, unique=True,
                            verbose_name=_('Nombre'))
    slug = models.SlugField(max_length=300, unique=True,
                            verbose_name=_('Slug'))
    animeflv_url = models.CharField(max_length=300, unique=True ,verbose_name=_('AnimeFLV url'))
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
    relations = models.ManyToManyField(Relation, blank=True, verbose_name=_(
        'Animes relacionados'), related_name='relations')
    episodes = models.ManyToManyField(
        Episode, blank=True, verbose_name=_('Episodios'))
