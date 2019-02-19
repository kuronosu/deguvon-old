import requests, json, os, io
from peewee import DoesNotExist
from flask import Flask, jsonify, Response, make_response, request
from bs4 import BeautifulSoup
from db.actions import DataBase
from scraping.utils import generate_tokens, load_tokens, make_request as rq

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
            'relations': None
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

@app.route('/uploads/animes/covers/<image>.<ext>')
def uploads(image, ext):
    r = rq(f'https://animeflv.net/uploads/animes/covers/{image}.{ext}')
    response = make_response(r.content)
    response.headers.set('Content-Type', f'image/{ext}')
    print(request.cookies, request.headers, sep="\n")
    return response

# @app.route('/screenshots/<image>.<ext>')

#     return 

if __name__ == '__main__':
    app.run(port = PORT, debug = DEBUG, host= '0.0.0.0')
