import os
import django
import click
import time
from django.db import transaction
from scrape.main import get_anime, scrape_page, get_all_animes, get_animes_info
from scrape.models import AnimeScrape
from api.models import Anime, Episode, Relation, State, Type, Genre


def save_anime(anime_data):
    assert isinstance(
        anime_data, AnimeScrape), 'anime_data must be a AnimeScrape instance'

    data = anime_data.to_dict()
    data.update({'state': State.objects.get_or_create(name=anime_data.state)[0],
                 'typea': Type.objects.get_or_create(name=anime_data.typea)[0]})
    anime = Anime.objects.create(**data)
    genres = []
    for g in anime_data.genres:
        genres.append(Genre.objects.get_or_create(name=g)[0])
    anime.genres.add(*genres)

    relations = []
    for r in anime_data.relations:
        relations.append(Relation.objects.create(**r.to_dict()))
    anime.relations.add(*relations)

    episodes = []
    for e in anime_data.episodes:
        episodes.append(Episode.objects.create(**e.to_dict()))
    anime.episodes.add(*episodes)


def save_animes(animes):
    click.secho('Creating anime records', fg='blue')
    with click.progressbar(animes, label='Getting animes info') as bar:
        for anime in bar:
            try:
                save_anime(anime)
            except Exception as e:
                click.secho(
                    f'Error saving anime: {anime.animeflv_url}', fg='red', err=e)


def create_directory():
    links = get_all_animes()

    with click.progressbar(links, label='Getting and save animes') as bar, transaction.atomic():
        for l in bar:
            try:
                if not l in list(Anime.objects.all().values_list('animeflv_url', flat=True)):
                    anime = get_anime(l)
                    save_anime(anime)
            except Exception as e:
                click.secho(
                    f'Error saving anime: {l}', fg='red', err=e)
