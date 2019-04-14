import os, json, shutil

from peewee import DoesNotExist
from flask import jsonify, send_file, abort, request

from utils import json_response
from db.actions import DataBase
from db.models import Episode
from scrape.utils import make_request as rq
from scrape.episode_videos import scrape_episode, get_natsuki_video, get_fembed_video

from .utils import ImageSource

BASE_DIR = os.environ.get('BASE_DIR', os.path.dirname(os.path.dirname(__file__)))
DRIRECTORY_PATH = os.path.join(BASE_DIR, 'directory.json')
AVAILABLE_SERVERS = [
    {'server': 'natsuki', 'controller': get_natsuki_video},
    {'server': 'fembed', 'controller': get_fembed_video}
]


def recent():
    try:
        return json_response(DataBase.update_recents())
    except:
        return json_response([])

def search(name):
    response = {}
    name = name.replace('+', ' ')
    animes = DataBase.search(name)
    animes = [anime.to_json() for anime in animes]
    response['animes'] = animes
    return json_response(response)


def anime(aid):
    relations = {}
    try:
        anime = DataBase.get_by_aid(aid)
    except DoesNotExist:
        return jsonify({
            'anime': None,
            'relations': {}
        })
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


def serve_image(source, image=None, aid=None, episode=None, th=None, ext=None):
    if source is ImageSource.UPLOADS and not (image is None or ext is None) :
        path = os.path.join(BASE_DIR, 'images', 'covers')
        file_path = os.path.join(path, f'{image}.{ext}')
        url = f'https://animeflv.net/uploads/animes/covers/{image}.{ext}'
    elif source is ImageSource.SCREENSHOTS and not (aid is None or episode is None or th is None or ext is None):
        path = os.path.join(BASE_DIR, 'images', 'screenshots', aid, episode)
        file_path = os.path.join(path, f'th_{th}.{ext}')
        url = f'https://cdn.animeflv.net/screenshots/{aid}/{episode}/th_{th}.{ext}'
    else:
        abort(404)
    if not os.path.exists(file_path):
        r = rq(url, stream=True)
        if r is None or r.status_code != 200:
            abort(404)
        os.makedirs(path, exist_ok=True)
        with open(file_path, 'wb') as f:
            r.raw.decode_content = True
            shutil.copyfileobj(r.raw, f)
    return send_file(file_path, mimetype=f'image/{ext}')


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
    data.update({'available_servers': [s['server'].lower() for s in AVAILABLE_SERVERS] })
    return json_response(data)

def episode_video_server(eid, server, lang):
    try:
        for s in AVAILABLE_SERVERS:
            if s['server'].lower() == server.lower():
                return json_response(s['controller'](json.loads(request.data), lang))
    except Exception as e:
        print(e)
    abort(404)
