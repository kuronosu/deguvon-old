import requests, json, os
from flask import Flask, jsonify, Response
from bs4 import BeautifulSoup
from db.actions import DataBase

PORT = 3000
DEBUG = True
PATH = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

DataBase.create_tables()

@app.route('/api/v1/recent')
def recent():
    return jsonify(DataBase.update_recents())

@app.route('/api/v1/search/<name>')
def search(name):
    response = {}
    name = name.replace('+', ' ')
    animes = DataBase.search(name)
    animes = [anime.to_json() for anime in animes]
    response['animes'] = animes
    return jsonify(response)

@app.route('/api/v1/anime/<aid>')
def anime(aid):
    relations = {}
    anime = DataBase.get_by_aid(aid)
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
    return jsonify(response)

if __name__ == '__main__':
    app.run(port = PORT, debug = DEBUG, host= '0.0.0.0')
