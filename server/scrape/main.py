import re
import json
import click
import os
import platform
import click
from bs4 import BeautifulSoup
from requests.exceptions import RequestException

from scrape.constants import ANIME_FLV_URL
from scrape.patterns import RELATION_TEXT_PATTERN, ANIME_LINK_PATTERN
from scrape.utils import make_request, replace_html_entities, get_script_gata
from scrape.models import EpisodeScrape, AnimeReltionScrape, AnimeScrape


def get_total_pages():
    rute = '/browse'
    response = make_request(ANIME_FLV_URL + rute)
    if response.status_code != 200:
        raise RequestException()
    soup = BeautifulSoup(response.content, 'html.parser')
    pagination = soup.find('ul', {'class': 'pagination'}).find_all('a')
    last_page = pagination[len(pagination)-2]['href'].split('page=')[-1]
    return int(last_page)


def scrape_page(page=1):
    list_anime_links = []
    rute = f'/browse?order=title&page={page}'
    response = make_request(ANIME_FLV_URL + rute)
    soup = BeautifulSoup(response.content, 'html.parser')
    listAnimes = soup.find_all('article', {'class': 'Anime'})

    for i in listAnimes:
        link = i.find('a')['href']
        list_anime_links.append(link)

    return list_anime_links


def get_all_animes():
    pages = get_total_pages()
    links = []
    with click.progressbar(range(1, pages + 1), label='Getting anime urls') as bar:
        for i in bar:
            links += scrape_page(i)
    return links


def get_anime(route):
    response = make_request(ANIME_FLV_URL + route)
    if response.status_code != 200:
        return None
    url = response.url.replace(ANIME_FLV_URL, '')

    soup = BeautifulSoup(response.content, 'html.parser')
    containers = soup.find_all('div', {'class': 'Container'})

    scripts = soup.find_all('script')
    scripts.reverse()

    banner = soup.find('div', {'class': 'Bg'})['style'].replace(
        'background-image:url(', '')[:-1]
    score = float(soup.find('span', {'id': 'votes_prmd'}).text)

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

    if 'idolmaster' in url or 'idolmster' in url or 'cinderella' in url:
        synopsis = synopsis.replace('[email protected]', 'iDOLM@STER')
    if '[email protected]' in synopsis:
        print("Revisar: ", url)

    # Genres
    genres = containers[2].find('nav', {'class': 'Nvgnrs'}).find_all('a')
    genres = [i.string for i in genres]

    # Episodes
    episode_list = []
    for e in episodes:
        episode_list.append(EpisodeScrape(
            float(e[0]),
            f'/ver/{e[1]}/{slug}-{e[0]}'.lower(),
            f'/screenshots/{aid}/{e[0]}/th_3.jpg'
        ))

    listAnmRel = containers[2].find('ul', {'class': 'ListAnmRel'})
    if listAnmRel:
        cont_listAnmRel = listAnmRel.find_all('li')
        listAnmRel = []
        for i in cont_listAnmRel:
            anmrel = i.find('a').text
            link = i.find('a')['href']
            rel = RELATION_TEXT_PATTERN.search(i.get_text()).group(0)[1:-1]
            if ANIME_LINK_PATTERN.search(link):
                listAnmRel.append(AnimeReltionScrape(anmrel, link, rel))
        del cont_listAnmRel
    else:
        listAnmRel = []

    return AnimeScrape(int(aid), name, slug, url, state, typea, image, synopsis, banner, score, genres, listAnmRel, episode_list)

def get_animes_info(links):
    animes = []
    with click.progressbar(links, label='Getting animes info') as bar:
        for link in bar:
            anime = get_anime(link)
            if anime:
                animes.append(anime)
    return animes

def get_episode_data(ep_url):
    response = make_request(
        ANIME_FLV_URL + get_animeUrl_by_ep(ep_url))
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
            return EpisodeScrape(
                float(e[0]),
                ep_url,
                f'/screenshots/{aid}/{e[0]}/th_3.jpg'
            )
    click.secho("Not anime episode match", fg='red')


def check_recents():
    response = make_request(ANIME_FLV_URL)
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


def get_animeUrl_by_ep(ep_url):
    response = make_request(ANIME_FLV_URL + ep_url)
    soup = BeautifulSoup(response.content, 'html.parser')
    return soup.find('a', {'class': 'CapNvLs'})['href']
