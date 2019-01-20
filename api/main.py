import requests, json, os
from flask import Flask, jsonify
from bs4 import BeautifulSoup

app = Flask(__name__)
PORT = 3000
DEBUG = True
PATH = os.path.dirname(os.path.abspath(__file__))

EPISODES = []
try:
    with open(os.path.join(PATH, 'recent.json'), 'r') as file:
        EPISODES = json.loads(file.read())
except Exception as e:
    EPISODES = []
    with open(os.path.join(PATH, 'recent.json'), 'w') as file:
        file.write(json.dumps(EPISODES))

get_list_url = lambda obj_list: [i['url'] for i in obj_list]

def get_anime_image_from_episode(episode_url):
    episode_response = requests.get('https://animeflv.net' + episode_url)
    episode_soup = BeautifulSoup(episode_response.content, 'html.parser')
    anime_link = episode_soup.find('a', {'class': 'CapNvLs'})['href']

    anime_response = requests.get('https://animeflv.net' + anime_link)
    anime_soup = BeautifulSoup(anime_response.content, 'html.parser')
    anime_image = anime_soup.find('div', {'class': 'AnimeCover'}).find('img')['src']
    return anime_image
    

@app.route('/api/')
def home():
    global EPISODES
    response  = requests.get("https://animeflv.net/")
    soup = BeautifulSoup(response.content, 'html.parser')
    soup = soup.find('ul', {'class': 'ListEpisodios'})
    lis = soup.find_all('li')
    url_list = []
    for element in lis:
        episode_url = element.a['href']
        url_list.append(episode_url)
        if not episode_url in get_list_url(EPISODES):
            episode_text = element.find('span', {'class': 'Capi'}).text
            anime_title = element.strong.text
            image = get_anime_image_from_episode(episode_url)
            eid = episode_url.split('/')[2]
            EPISODES.append({
                'url': episode_url,
                'image': 'https://animeflv.net/' + image,
                'episodeText': episode_text,
                'animeName': anime_title,
                'id': eid,
            })
    i = 0
    while i < len(EPISODES):
        if EPISODES[i]['url'] not in url_list:
            del EPISODES[i]
            i-=1
        EPISODES[i]['index'] = url_list.index(EPISODES[i]['url'])
        i+=1

    EPISODES = sorted(EPISODES, key=lambda k: k['index'])

    with open('recent.json', 'w') as file:
        file.write(json.dumps(EPISODES))

    return jsonify(EPISODES)

if __name__ == '__main__':
    app.run(port = PORT, debug = DEBUG, host= '0.0.0.0')
