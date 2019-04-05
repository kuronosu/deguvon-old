import json
from bs4 import BeautifulSoup
from .utils import make_request
from .patterns import SERVERS_SCRIPT_PATTERN

def servers_dict(script):
    return json.loads(SERVERS_SCRIPT_PATTERN.search(script).group(0).replace('var videos = ', '').replace(';', ''))

def validate_script(script_text):
    return (
        'var anime_id' in script_text and
        'var episode_id' in script_text and
        'var episode_number' in script_text and
        'var videos' in script_text
    )

def scrape_episode(url):
    response = make_request(f"https://animeflv.net{url}")
    soup = BeautifulSoup(response.content, 'html.parser')
    script = None
    for s in reversed(soup.find_all('script')):
        if validate_script(s.get_text()):
            script = s
            break
    return servers_dict(script.get_text())

def get_natsuki_video(servers, lang):
    lang = lang.upper() if lang.upper() in [k.upper() for k in servers.keys()] else 'ALL'
    natsuki_server_list = []
    for key, value in servers.items():
        if key.upper() == lang or lang == 'ALL':
            for server in value:
                if server['server'] == 'natsuki':
                    natsuki_server_list.append(dict(lang=key.upper(), **server))

    video_url_list = []

    for natsuki_dict in natsuki_server_list:
        r = make_request(natsuki_dict['code'].replace('embed', 'check'))
        if r.status_code == 200:
            video = r.json()
            video.update({"lang": natsuki_dict['lang'], 'servar_name': 'Natsuki'})
            video_url_list.append(video)

    return video_url_list
