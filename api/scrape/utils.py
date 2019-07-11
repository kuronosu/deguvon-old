import os
import cfscrape
import requests
import click
import platform
from http.cookies import SimpleCookie
from selenium.webdriver import Firefox, FirefoxOptions

from .patterns import (
    ANIME_SCRIPT_PATTERN,
    AID_PATTERN,
    SLUG_PATTERN,
    NEXT_EPISODE_DATE_PATTERN,
    NAME_PATTERN,
    HTML_ENTITIES_PATTERN,
    EPISODE_SCRIPT_PATTERN
)

BASE_DIR = os.environ.get('BASE_DIR', os.path.abspath(
    os.path.dirname(os.path.dirname(__file__))))
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36"

options = FirefoxOptions()
options.add_argument('-headless')
click.secho("Creando webdriver", fg='blue')
firefox_driver_path = os.path.join(
    BASE_DIR, 'webdrivers', 'geckodriver' + ('.exe' if platform.system() == 'Windows' else ''))
webdriver = Firefox(executable_path=firefox_driver_path, options=options)


def generate_cookies():
    cookies = cfscrape.get_cookie_string(
        "https://www.animeflv.net", user_agent=USER_AGENT)[0]
    save_cookies(cookies)
    return cookies


def cookies_to_dict(string_cookies):
    cookie = SimpleCookie()
    cookie.load(string_cookies)
    return {k: morsel.value for k, morsel in cookie.items()}


def save_cookies(cookies):
    with open(os.path.join(BASE_DIR, 'cookies'), 'w') as f:
        f.write(cookies)


def load_cookies():
    try:
        with open(os.path.join(BASE_DIR, 'cookies'), 'r') as f:
            return cookies_to_dict(f.read())
    except Exception:
        return cookies_to_dict(generate_cookies())


def make_request(url, stream=False):
    cookies = load_cookies()
    response = requests.Response()
    response.status_code = 404
    try:
        response = requests.get(
            url, headers={'user-agent': USER_AGENT}, cookies=cookies, stream=stream)
        if response.status_code == 404:
            return response
        if response.status_code != 200:
            cookies = cookies_to_dict(generate_cookies())
            response = requests.get(
                url, headers={'user-agent': USER_AGENT}, cookies=cookies, stream=stream)
    except Exception as e:
        print(e, "utils")
        cookies = cookies_to_dict(generate_cookies())
        response = requests.get(
            url, headers={'user-agent': USER_AGENT}, cookies=cookies, stream=stream)
    finally:
        return response


def replace_html_entities(text):
    scaracter = HTML_ENTITIES_PATTERN.search(text)
    if scaracter:
        with open('scaracter.txt', 'a') as file:
            file.write(f'{text}\n')
    return text


def get_script_gata(scripts):
    global webdriver
    script = None
    for i in scripts:
        if "var anime_info" in i.get_text() and "var episodes" in i.get_text():
            script = i.get_text()
            break
    if script == None:
        raise Exception("Anime Script not found")

    script = ANIME_SCRIPT_PATTERN.search(script).group(
        0) + EPISODE_SCRIPT_PATTERN.search(script).group(0)
    anime_info, episodes = webdriver.execute_script(
        script + "return [anime_info, episodes]")
    return anime_info, episodes
