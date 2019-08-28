import json
from js2py import eval_js
import requests as rq
from bs4 import BeautifulSoup
from scrape.utils import make_request, remove_key
from scrape.patterns import SERVERS_SCRIPT_PATTERN


def servers_dict(script):
    match = SERVERS_SCRIPT_PATTERN.search(script)
    return eval_js(match.group(0)) if match else {}


def validate_script(script_text):
    return (
        'var anime_id' in script_text and
        'var episode_id' in script_text and
        'var episode_number' in script_text and
        'var videos' in script_text
    )


def scrape_episode(url):
    response = make_request(f"https://animeflv.net{url}")
    if response.status_code != 200:
        return {}
    soup = BeautifulSoup(response.content, 'html.parser')
    for script in reversed(soup.find_all('script')):
        if validate_script(script.get_text()):
            return servers_dict(script.get_text())


def get_server_list(servers, server, lang=None):
    lang = lang.upper() if isinstance(lang, str) and lang.upper() in [
        k.upper() for k in servers.keys()] else 'ALL'
    server_list = []
    for key, value in servers.items():
        if (key.upper() == lang or lang == 'ALL') and key != 'available_servers':
            for server_dict in value:
                if isinstance(server_dict, dict) and server_dict.get('server', None) == server:
                    server_list.append(dict(lang=key.upper(), **server_dict))
    return server_list


def get_natsuki_video(servers, lang):
    server_list = get_server_list(servers, 'natsuki', lang)

    video_url_list = []

    for natsuki_dict in server_list:
        r = make_request(natsuki_dict['code'].replace('embed', 'check'))
        if r.status_code == 200:
            video = r.json()
            if video.get('file', None):
                video.update(
                    {"lang": natsuki_dict['lang'], 'server_name': 'Natsuki'})
                video_url_list.append(video)

    return video_url_list


def get_fembed_video(servers, lang):
    server_list = get_server_list(servers, 'fembed', lang)

    video_url_list = []

    for server_dict in server_list:
        r = rq.post(server_dict['code'].replace('/v/', '/api/source/'))
        if r.status_code == 200:
            video = r.json()
            video.update(
                {"lang": server_dict['lang'], 'server_name': 'Fembed'})
            video = remove_key(video, 'player')
            video = remove_key(video, 'captions')
            video = remove_key(video, 'is_vr')
            video = remove_key(video, 'success')
            video_url_list.append(video)

    return video_url_list
