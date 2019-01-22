import re, sys
import requests
from bs4 import BeautifulSoup

class AnimeFactory:
    
    url = 'animeflv.net'

    @staticmethod
    def start_page_scraping(page=1):
        list_anime_links = []
        rute = '/browse?order=title&page={}'.format(page)
        response = requests.get("https://" + AnimeFactory.url + rute)
        soup = BeautifulSoup(response.content, 'html.parser')
        listAnimes = soup.find_all('article', {'class':'Anime'})

        for i in listAnimes:
            link = i.find('a')['href']
            list_anime_links.append(link)

        return list_anime_links
    
    @staticmethod
    def get_total_pages():
        rute = '/browse'
        response = requests.get("https://" + AnimeFactory.url + rute)
        soup = BeautifulSoup(response.content, 'html.parser')
        pagination = soup.find('ul', {'class': 'pagination'}).find_all('a')
        last_page = pagination[len(pagination)-2]['href'].split('page=')[-1]
        print("La cantidad total de paginas es: ", last_page)
        return int(last_page)
    
    @staticmethod
    def get_all_animes():
        a = AnimeFactory.get_total_pages()
        list_anime_links = []
        for i in range(1, a+1):
            print("Analizando pagina: {}".format(i))
            tmpl = AnimeFactory.start_page_scraping(i)
            list_anime_links += tmpl
        return list_anime_links
    
    @staticmethod
    def get_anime(url):
        print('Analizando: ', url)
        rute = url
        response = requests.get("https://" + AnimeFactory.url + rute)
        soup = BeautifulSoup(response.content, 'html.parser')
        containers = soup.find_all('div', {'class': 'Container'})

        scripts = soup.find_all('script')
        scripts.reverse()
        script = None
        for i in scripts:
            if "var anime_info" in i.get_text() and "var episodes" in i.get_text():
                script = i
                break
        if script is None:
            print("Error en: " + url)
            sys.exit(1)
        script = script.get_text()

        # Type
        typea = containers[1].find('span', {'class': 'Type'}).string
        image = containers[2].find('div', {'class': 'AnimeCover'}).find('img')['src']
        state = containers[2].find('p', {'class': 'AnmStts'}).find('span').string

        # Informacion en el script
        anime_info = (
                re.compile(r'var anime_info = \[[0-9"]+,.*\];')
                    .search(script)
                    .group(0)
            )
        anime_info = (re.compile(r'[0-9"]+,.*').search(anime_info).group(0)
            .replace('"', '')
            .replace(']', '')
            .replace(';', '')
            .split(','))

        episodes = re.compile(r"var episodes = \[.*\];").search(script).group(0)
        episodes = re.compile(r'\[[0-9,.]+\]').findall(episodes)
        episodes = [s[1:-1].split(',') for s in episodes]

        aid = anime_info[0]
        name = anime_info[1]
        slug = anime_info[2]


        # Synopsis
        synopsis = containers[2].find('div', {'class': 'Description'}).find('p')
        synopsis = synopsis.string or synopsis.get_text()
        synopsis = synopsis.split(';')[6][23:]

        if 'idolmaster' in url or 'idolmster' in url:
            synopsis = synopsis.replace('[email protected]', 'iDOLM@STER')
        if '[email protected]' in synopsis:
            print("Revisar: ", url)

        # Genres
        genres = containers[2].find('nav', {'class': 'Nvgnrs'}).find_all('a')
        genres = [i.string for i in genres]

        # Episodes
        episode_list = []
        for e in episodes:
            episode_list.append(EpisodeScraping(
                'Episodio {}'.format(e[0]),
                '/ver/{}/{}-{}'.format(e[1], slug, e[0]),
                'https://cdn.animeflv.net/screenshots/{}/{}/th_3.jpg'.format(aid, e[0])
            ))

        listAnmRel = containers[2].find('ul', {'class': 'ListAnmRel'})
        if listAnmRel:
            cont_listAnmRel = listAnmRel.find_all('li')
            listAnmRel = []
            for i in cont_listAnmRel:
                link = i.find('a')['href']
                rel = re.compile(r'\([A-Za-z,\- ]+\)').search(i.get_text()).group(0)[1:-1]
                listAnmRel.append(AnimeReltionScraping(link, rel))
            del cont_listAnmRel
        else:
            listAnmRel = []

        return AnimeScraping(aid, url, slug, name, image, typea, state, synopsis, genres, episode_list, listAnmRel)
    
    @staticmethod
    def get_episode_data(ep_url):
        response = requests.get("https://" + AnimeFactory.url + AnimeFactory.get_animeUrl_by_ep(ep_url))
        soup = BeautifulSoup(response.content, 'html.parser')
        containers = soup.find_all('div', {'class': 'Container'})

        scripts = soup.find_all('script')
        scripts.reverse()
        script = None
        for i in scripts:
            if "var anime_info" in i.get_text() and "var episodes" in i.get_text():
                script = i.get_text()
                break
        
        anime_info = re.compile(r'var anime_info = \[[0-9"]+,.*\];').search(script).group(0)
        anime_info = (re.compile(r'[0-9"]+,.*').search(anime_info).group(0)
            .replace('"', '')
            .replace(']', '')
            .replace(';', '')
            .split(','))
        aid = anime_info[0]
        slug = anime_info[2]

        episodes = re.compile(r"var episodes = \[.*\];").search(script).group(0)
        episodes = re.compile(r'\[[0-9,.]+\]').findall(episodes)
        episodes = [s[1:-1].split(',') for s in episodes]

        for e in episodes:
            if '/ver/{}/{}-{}'.format(e[1], slug, e[0]) == ep_url:
                return EpisodeScraping(
                    'Episodio {}'.format(e[0]),
                    '/ver/{}/{}-{}'.format(e[1], slug, e[0]),
                    'https://cdn.animeflv.net/screenshots/{}/{}/th_3.jpg'.format(aid, e[0])
                )
    
    @staticmethod
    def check_recents():
        AnimeFactory.url
        response  = requests.get("https://" + AnimeFactory.url)
        soup = BeautifulSoup(response.content, 'html.parser')
        lis = soup.find('ul', {'class': 'ListEpisodios'}).find_all('li')

        episodes = []
        for element in lis:
            episode_url = element.a['href']
            episode_text = element.find('span', {'class': 'Capi'}).text
            eid = episode_url.split('/')[2]
            episodes.append({
                'url': episode_url,
                'episodeText': episode_text,
                'id': eid,
            })
            
        return episodes

    @staticmethod
    def get_animeUrl_by_ep(ep_url):
        response  = requests.get("https://" + AnimeFactory.url + ep_url)
        soup = BeautifulSoup(response.content, 'html.parser')
        return soup.find('a', {'class': 'CapNvLs'})['href']


class EpisodeScraping:
    def __init__(self, name, url, image, *las, **kwargs):
        self.name = name
        self.url = url
        self.image = image
    
    def __str__(self):
        return str(self.name)
    
class AnimeReltionScraping:
    def __init__(self, url, rel, *args, **kwargs):
        self.url = url
        self.rel = rel
    
    def to_json(self):
        return {
            'url': self.url,
            'rel': self.rel,
        }

    def __str__(self):
        return self.url + ":" + self.rel

class AnimeScraping:
    def __init__(self, aid, url, slug, name, image, typea, state, synopsis, genres, episode_list, listAnmRel, *args, **kwargs):
        self.aid = aid
        self.url = url
        self.slug = slug
        self.name = name
        self.image = image
        self.typea = typea
        self.state = state
        self.synopsis = synopsis
        self.genres = genres
        self.episode_list = episode_list
        self.listAnmRel = listAnmRel
    
    def __str__(self):
        string = """
aid: {}
url: {}
slug: {}
name: {}
image = {}
typea: {}
state: {}
synopsis: {}
genres: {}
episode_list: {}
listAnmRel: {}
        """.format(
                self.aid,
                self.url,
                self.slug,
                self.name,
                self.image,
                self.typea,
                self.state,
                self.synopsis,
                self.genres,
                str([str(i) for i in self.episode_list]),
                str([str(i) for i in self.listAnmRel])
            )
        return string

        
    def to_db(self):
        query = {
            'aid': self.aid,
            'url': self.url,
            'slug': self.slug,
            'name': self.name,
            'image': self.image,
            'typea': self.typea,
            'synopsis': self.synopsis,
        }
        return query
    
    def to_json(self):
        anime = self.to_db()
        anime['genres'] = self.genres
        anime.update({'listAnmRel': self.animeRel_to_json()})
        anime.update({'episodeList': self.episode_list_to_db()})
        anime.update({'episodeList': self.episode_list_to_db()})
        return anime
    
    def animeRel_to_json(self):
        query_list = []
        for i in self.listAnmRel:
            query = {
                'url': i.url,
                'rel': i.rel,
            }
            query_list.append(query)
        return query_list
    
    def animeRel_to_db(self):
        query_list = []
        for i in self.listAnmRel:
            query = {
                'url': i.url,
                'rel': i.rel,
            }
            query_list.append(query)
        return query_list
    
    def episode_list_to_db(self):
        query_list = []
        for i in self.episode_list:
            query = {
                'name': i.name,
                'url': i.url,
                'image': i.image,
            }
            query_list.append(query)
        return query_list
