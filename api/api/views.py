import os
import json
import shutil

from peewee import DoesNotExist
from flask import jsonify, send_file, abort, request

from utils import json_response
from db.actions import DataBase
from db.models import Episode
from scrape.utils import make_request as rq
from scrape.episode_videos import scrape_episode, get_natsuki_video, get_fembed_video

from api.utils import ImageSource, VideoServer, serve_image

BASE_DIR = os.environ.get(
    'BASE_DIR', os.path.dirname(os.path.dirname(__file__)))
DRIRECTORY_PATH = os.path.join(BASE_DIR, 'directory.json')
AVAILABLE_SERVERS = [
    VideoServer('natsuki', get_natsuki_video),
    VideoServer('fembed', get_fembed_video)
]


def recent():
    try:
        recents = DataBase.update_recents()
        if len(recents) > 0:
            return json_response(recents)
    except:
        # TODO Logger in the future
        pass
    abort(404)


def search():
    name = request.args.get('name', '', type=str)
    response = {}
    animes = DataBase.search(name)
    animes = [anime.to_json() for anime in animes]
    response['animes'] = animes
    return json_response(response)


def anime(aid):
    relations = {}
    try:
        anime = DataBase.get_by_aid(aid)
    except DoesNotExist:
        abort(500)
    for rel in anime.listAnmRel:
        a = DataBase.get_by_url(rel.url)
        relations[a.url] = {
            'aid': a.aid,
            'url': a.url,
            'name': a.name,
            'image': a.image,
            'rel': rel.rel
        }
    anime = anime.to_json()
    response = {
        'relations': relations,
        'anime': anime
    }
    return json_response(response)


def uploads(image, ext):
    return serve_image(ImageSource.UPLOADS, image=image, ext=ext)


def screenshots(aid, episode, th, ext):
    return serve_image(ImageSource.SCREENSHOTS, aid=aid, episode=episode, th=th, ext=ext)


def directory():
    if os.path.exists(DRIRECTORY_PATH):
        return send_file(os.path.join(BASE_DIR, 'directory.json'), 'application/json')
    return json_response(DataBase.all())


def episode_videos_data(eid):
    episode_querry = Episode.select().where(Episode.url.contains(f"/{eid}/"))
    episode = episode_querry[0] if episode_querry.count() == 1 else None
    if episode is None:
        abort(404)
    data = scrape_episode(episode.url)
    data.update(
        {'available_servers': [s.name.lower() for s in AVAILABLE_SERVERS]})
    return json_response(data)


def episode_video_server(eid, server, lang):
    try:
        for s in AVAILABLE_SERVERS:
            if s.name.lower() == server.lower():
                return json_response(s.controller(json.loads(request.data), lang))
    except Exception as e:
        print(e)
    abort(404)
