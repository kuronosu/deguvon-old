from PIL import Image
from io import BytesIO
import os
import cfscrape
import requests
import click
import platform
import js2py
from http.cookies import SimpleCookie

from scrape.constants import USER_AGENT, ANIME_FLV_URL, COOKIES_PATH
from scrape.patterns import (
    ANIME_SCRIPT_PATTERN,
    NEXT_EPISODE_DATE_PATTERN,
    HTML_ENTITIES_PATTERN,
    EPISODE_SCRIPT_PATTERN
)


def generate_cookies():
    cookies = cfscrape.get_cookie_string(
        ANIME_FLV_URL, user_agent=USER_AGENT)[0]
    save_cookies(cookies)
    return cookies


def cookies_to_dict(string_cookies):
    cookie = SimpleCookie()
    cookie.load(string_cookies)
    return {k: morsel.value for k, morsel in cookie.items()}


def save_cookies(cookies):
    with open(COOKIES_PATH, 'w') as f:
        f.write(cookies)


def load_cookies():
    try:
        with open(COOKIES_PATH, 'r') as f:
            return cookies_to_dict(f.read())
    except IOError:
        return cookies_to_dict(generate_cookies())
    except Exception as e:
        click.secho(f'Error: {repr(e)}', fg='red')
        pass  # TODO logger


def make_request(url, stream=False):
    cookies = load_cookies()
    try:
        response = requests.get(
            url, headers={'user-agent': USER_AGENT}, cookies=cookies, stream=stream)
        if response.status_code == 503:
            cookies = cookies_to_dict(generate_cookies())
            response = requests.get(
                url, headers={'user-agent': USER_AGENT}, cookies=cookies, stream=stream)
        return response
    except Exception as e:
        print(e, "utils")
        response = requests.Response()
        response.status_code = 418
        return response


def get_script_gata(scripts):
    script = None
    for i in scripts:
        if "var anime_info" in i.get_text() and "var episodes" in i.get_text():
            script = i.get_text()
            break
    if script == None:
        raise Exception("Anime Script not found")

    anime_info = js2py.eval_js(ANIME_SCRIPT_PATTERN.search(script).group(0))
    episodes = js2py.eval_js(EPISODE_SCRIPT_PATTERN.search(script).group(0))
    return anime_info, episodes


def replace_html_entities(text):
    scaracter = HTML_ENTITIES_PATTERN.search(text)
    if scaracter:
        with open('scaracter.txt', 'a') as file:
            file.write(f'{text}\n')
    return text


def remove_key(dict_obj, key):
    if key in dict_obj:
        del dict_obj[key]
    return dict_obj


def get_image(url):
    response = make_request(url)
    if response.status_code is not 200:
        return None
    try:
        img = Image.open(BytesIO(response.content))
        return img
    except:
        return None
