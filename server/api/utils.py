import re
import os
import django
import click
import time
import json
import codecs
from collections import OrderedDict
from django.db import transaction
from scrape.constants import BASE_DIR
from scrape.main import get_anime, scrape_page, get_all_animes, get_animes_info, get_animeUrl_by_ep
from scrape.models import AnimeScrape
from api.models import Anime, Episode, Relation, State, Type, Genre
from api.serializers import AnimeSerializer


def create_directory():
    links = get_all_animes()

    with click.progressbar(links, label='Getting and save animes') as bar, transaction.atomic():
        for l in bar:
            try:
                if not l in Anime.objects.all().values_list('animeflv_url', flat=True):
                    anime = get_anime(l)
                    Anime.create_or_update(anime)
            except Exception as e:
                click.secho(
                    f'Error saving anime "{e}": {l}', fg='red', err=e)


def verify_recents(recent_links):
    def format_data(tmpe):
        # tmpe is Temporal episode
        assert isinstance(
            tmpe, Episode), 'tmpe must be a api.models.Episode instance'
        anime = tmpe.anime
        tmpe_data = vars(tmpe)
        del tmpe_data['_state'], tmpe_data['id'], tmpe_data['anime_id'], tmpe_data['cover']
        tmpe_data.update(
            {'anime': {'name': anime.name, 'cover': anime.cover, 'aid': anime.aid}})
        return tmpe_data
    recents = []
    for r in recent_links:
        try:
            tmpe = Episode.objects.get(animeflv_url=r)
            recents.append(format_data(tmpe))
        except Episode.DoesNotExist:
            anime_url = get_animeUrl_by_ep(r)
            if anime_url is None:
                continue
            try:
                anime = Anime.objects.get(animeflv_url=anime_url)
                anime.update(get_anime(anime_url))
                tmpe = anime.episode_set.get(animeflv_url=r)
                recents.append(format_data(tmpe))
            except Anime.DoesNotExist:
                anime = Anime.create(get_anime(anime_url))
                tmpe = anime.episode_set.get(animeflv_url=r)
                recents.append(format_data(tmpe))
                with transaction.atomic():
                    for url in anime.relation_set.all().values_list('animeflv_url', flat=True):
                        if url in Anime.objects.all().values_list('animeflv_url', flat=True):
                            Anime.objects.get(animeflv_url=url).update(
                                get_anime(url))
                        else:
                            Anime.create(get_anime(url))
    return recents


def cache_directory():
    animes = Anime.objects.all().order_by('aid')
    list_ = []
    with open(os.path.join(BASE_DIR, 'directory.json'), 'w') as f, click.progressbar(animes, label='Generatting directory') as bar:
        for anime in bar:
            list_.append((anime.aid, AnimeSerializer(
                anime, context={'request': None}).data))
        dict_ = OrderedDict(list_)
        directory = json.dumps(dict_, indent=None)
        f.write(directory)


ESCAPE_SEQUENCE_RE = re.compile(
    r''' ( \\U........ # 8-digit hex escapes
    | \\u.... # 4-digit hex escapes
    | \\x.. # 2-digit hex escapes
    | \\[0-7]{1,3} # Octal escapes
    | \\N\{[^}]+\} # Unicode characters by name
    # | \\[\\'"abfnrtv] # Single-character escapes
)''', re.UNICODE | re.VERBOSE)


def decode_unicode(s):
    def decode_match(match):
        return codecs.decode(match.group(0), 'unicode-escape')
    return ESCAPE_SEQUENCE_RE.sub(decode_match, s)


def cache_directory_soft():
    animes = Anime.objects.all().order_by('aid')
    data = ""
    with click.progressbar(animes, label='Generatting directory') as bar:
        for anime in bar:
            data += json.dumps({
                anime.aid: AnimeSerializer(
                    anime,
                    context={'request': None}).data
            }, separators=(',', ':'))[1:-1] + ","
    click.secho("Saving", fg='blue')
    data = decode_unicode('{' + data[:-1] + '}')
    with open(os.path.join(BASE_DIR, 'directory.json'),
              'w', encoding='utf-8') as f:
        f.write(data)


def load_directory(json_path='directory.json'):
    if os.path.exists(json_path):
        with open(json_path, 'r') as f:
            try:
                data = []
                d = json.loads(f.read())
                if type(d) is dict:
                    for a in d.values():
                        tmp = AnimeScrape.load_from_dict(a)
                        if tmp:
                            data.append(tmp)
                with click.progressbar(data, label='Saving animes') as bar, transaction.atomic():
                    errors = []
                    for anime in bar:
                        try:
                            Anime.create_or_update(anime, False)
                        except Exception as e:
                            errors.append(
                                f'Error saving anime "{e}": {anime.animeflv_url}')
                    for e in errors:
                        click.secho(e, fg='red')
            except Exception as e:
                print(e)
