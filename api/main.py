import requests, json, os, shutil
from enum import Enum
from peewee import DoesNotExist
from flask import Flask, jsonify, Response, make_response, request, send_file, abort
from bs4 import BeautifulSoup
from db.actions import DataBase
from scraping.utils import generate_tokens, load_tokens, make_request as rq

class ImageSource(Enum):
    UPLOADS = 0
    SCREENSHOTS = 1

PORT = 8001
DEBUG = True
PATH = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

DataBase.create_tables()
# generate_tokens()

def json_response(data):
    return app.response_class(
        response=json.dumps(data, indent=1)
            .replace("\\\\\"", "\\\"")
            .replace("\\\\", "\\")
            ,
        status=200,
        mimetype='application/json'
    )

@app.route('/api/v1/recent')
def recent():
    try:
        return json_response(DataBase.update_recents())
    except:
        return json_response([])

@app.route('/api/v1/search/<name>')
def search(name):
    response = {}
    name = name.replace('+', ' ')
    animes = DataBase.search(name)
    animes = [anime.to_json() for anime in animes]
    response['animes'] = animes
    return json_response(response)

@app.route('/api/v1/anime/<aid>')
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
    if source == ImageSource.UPLOADS and not (image is None or ext is None) :
        path = os.path.join(PATH, 'images', 'covers')
        file_path = os.path.join(path, f'{image}.{ext}')
        url = f'https://animeflv.net/uploads/animes/covers/{image}.{ext}'
    elif source == ImageSource.SCREENSHOTS and not (aid is None or episode is None or th is None or ext is None):
        path = os.path.join(PATH, 'images', 'screenshots', aid, episode)
        file_path = os.path.join(path, f'th_{th}.{ext}')
        url = f'https://cdn.animeflv.net/screenshots/{aid}/{episode}/th_{th}.{ext}'
    else:
        abort(404)
    os.makedirs(path, exist_ok=True)
    if not os.path.exists(file_path):
        r = rq(url, stream=True)
        if r is None or r.status_code != 200:
            abort(404)
        with open(file_path, 'wb') as f:
            r.raw.decode_content = True
            shutil.copyfileobj(r.raw, f)
    return send_file(file_path, mimetype=f'image/{ext}')

@app.route('/uploads/animes/covers/<image>.<ext>')
def uploads(image, ext):
    return serve_image(ImageSource.UPLOADS, image=image, ext=ext)

@app.route('/screenshots/<aid>/<episode>/th_<th>.<ext>')
def screenshots(aid, episode, th, ext):
    return serve_image(ImageSource.UPLOADS, aid=aid, episode=episode, th=th, ext=ext)

if __name__ == '__main__':
    app.run(port = PORT, debug = DEBUG, host= '0.0.0.0')