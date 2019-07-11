import re
import json
import click
import os
import platform
from bs4 import BeautifulSoup
from selenium.webdriver import Firefox, FirefoxOptions

from .patterns import SERVERS_SCRIPT_PATTERN, EPISODE_SCRIPT_PATTERN, EPISODE_LIST_PATTERN, RELATION_TEXT_PATTERN, ANIME_LINK_PATTERN
from .utils import make_request, replace_html_entities, get_script_gata

class AnimeFactory:

    url = 'https://www.animeflv.net'

    @staticmethod
    def start_page_scraping(page=1):
        list_anime_links = []
        rute = f'/browse?order=title&page={page}'
        response = make_request(AnimeFactory.url + rute)
        soup = BeautifulSoup(response.content, 'html.parser')
        listAnimes = soup.find_all('article', {'class': 'Anime'})

        for i in listAnimes:
            link = i.find('a')['href']
            list_anime_links.append(link)

        return list_anime_links

    @staticmethod
    def get_total_pages():
        rute = '/browse'
        response = make_request(AnimeFactory.url + rute)
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
            print(f"Analizando pagina: {i}")
            tmpl = AnimeFactory.start_page_scraping(i)
            list_anime_links += tmpl
        return list_anime_links

    @staticmethod
    def get_anime(url):
        print('Analizando: ', url)
        rute = url
        response = make_request(AnimeFactory.url + rute)
        if response.status_code != 200:
            return None
        soup = BeautifulSoup(response.content, 'html.parser')
        containers = soup.find_all('div', {'class': 'Container'})

        scripts = soup.find_all('script')
        scripts.reverse()
        anime_data, episodes = get_script_gata(scripts)
        aid, name, *tail = anime_data
        slug = tail[0]

        # Type
        typea = containers[1].find('span', {'class': 'Type'}).string
        image = containers[2].find(
            'div', {'class': 'AnimeCover'}).find('img')['src']
        state = containers[2].find(
            'p', {'class': 'AnmStts'}).find('span').string

        # Synopsis
        synopsis = containers[2].find(
            'div', {'class': 'Description'}).find('p')
        synopsis = synopsis.string or synopsis.get_text()
        try:
            synopsis = synopsis.split(';')[6][23:]
        except Exception:
            pass

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
                float(e[0]),
                f'/ver/{e[1]}/{slug}-{e[0]}'.lower(),
                f'/screenshots/{aid}/{e[0]}/th_3.jpg'
            ))

        listAnmRel = containers[2].find('ul', {'class': 'ListAnmRel'})
        if listAnmRel:
            cont_listAnmRel = listAnmRel.find_all('li')
            listAnmRel = []
            for i in cont_listAnmRel:
                link = i.find('a')['href']
                rel = RELATION_TEXT_PATTERN.search(i.get_text()).group(0)[1:-1]
                if ANIME_LINK_PATTERN.search(link):
                    listAnmRel.append(AnimeReltionScraping(link, rel))
            del cont_listAnmRel
        else:
            listAnmRel = []

        return AnimeScraping(aid, url, slug, name, image, typea, state, synopsis, genres, episode_list, listAnmRel)

    @staticmethod
    def get_episode_data(ep_url):
        response = make_request(
            AnimeFactory.url + AnimeFactory.get_animeUrl_by_ep(ep_url))
        if response.status_code != 200:
            return None
        soup = BeautifulSoup(response.content, 'html.parser')

        scripts = soup.find_all('script')
        scripts.reverse()
        anime_data, episodes = get_script_gata(scripts)
        aid, name, *tail = anime_data
        slug = tail[0]

        for e in episodes:
            if f'/ver/{e[1]}/{slug}-{e[0]}'.lower() == ep_url.lower():
                return EpisodeScraping(
                    float(e[0]),
                    ep_url,
                    f'/screenshots/{aid}/{e[0]}/th_3.jpg'
                )

    @staticmethod
    def check_recents():
        response = make_request(AnimeFactory.url)
        if response.status_code != 200 or response == None:
            return []
        soup = BeautifulSoup(response.content, 'html.parser')
        lis = (soup.find('ul', {'class': 'ListEpisodios'}) or soup.find(
            'ul', {'class': 'List-Episodes'})).find_all('li')
        episodes = []
        for element in lis:
            episode_url = element.a['href']
            episode_text = (element.find('span', {'class': 'Capi'}) or element.find(
                'h2', {'class': 'Title'})).text
            eid = episode_url.split('/')[2]
            episodes.append({
                'url': episode_url,
                'episodeText': episode_text,
                'id': eid,
            })

        return episodes

    @staticmethod
    def get_animeUrl_by_ep(ep_url):
        response = make_request(AnimeFactory.url + ep_url)
        soup = BeautifulSoup(response.content, 'html.parser')
        return soup.find('a', {'class': 'CapNvLs'})['href']


class EpisodeScraping:
    def __init__(self, number, url, image, *las, **kwargs):
        self.number = number
        self.url = url
        self.image = image

    def __str__(self):
        return str(self.number)


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
        string = f"""
aid: {self.aid}
url: {self.url}
slug: {self.slug}
name: {self.name}
image: {self.image}
typea: {self.typea}
state: {self.state}
synopsis: {self.synopsis}
genres: {self.genres}
episode_list: {str([str(i) for i in self.episode_list])}
listAnmRel: {str([str(i) for i in self.listAnmRel])}
        """
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
                'number': i.number,
                'url': i.url,
                'image': i.image,
            }
            query_list.append(query)
        return query_list
