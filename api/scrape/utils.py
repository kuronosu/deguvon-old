import cfscrape, requests, os
from http.cookies import SimpleCookie

from .patterns import (
    ANIME_SCRIPT_PATTERN,
    AID_PATTERN,
    SLUG_PATTERN,
    NEXT_EPISODE_DATE_PATTERN,
    NAME_PATTERN,
    HTML_ENTITIES_PATTERN
)

BASE_DIR = os.environ.get('BASE_DIR', os.path.abspath(os.path.dirname(os.path.dirname(__file__))))
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36"

def generate_cookies():
    cookies = cfscrape.get_cookie_string("https://www.animeflv.net", user_agent=USER_AGENT)[0]
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
        cookies =  load_cookies()
        response = requests.Response()
        response.status_code = 404
        try:
            response = requests.get(url, headers={'user-agent': USER_AGENT}, cookies=cookies, stream=stream)
            if response.status_code == 404:
                return response
            if response.status_code != 200:
                cookies =  cookies_to_dict(generate_cookies())
                response = requests.get(url, headers={'user-agent': USER_AGENT}, cookies=cookies, stream=stream)
        except Exception as e:
            print(e, "utils")
            cookies =  cookies_to_dict(generate_cookies())
            response = requests.get(url, headers={'user-agent': USER_AGENT}, cookies=cookies, stream=stream)
        finally:
            return response

def replace_html_entities(text):
    scaracter = HTML_ENTITIES_PATTERN.search(text)
    if scaracter:
        with open('scaracter.txt', 'a') as file:
            file.write(f'{text}\n')
    return text

def get_script_gata(scripts):
    script = ""
    for i in scripts:
            if "var anime_info" in i.get_text() and "var episodes" in i.get_text():
                script = i.get_text()
                break

    anime_info = (
        ANIME_SCRIPT_PATTERN
            .search(script)
            .group(0)
            .replace('var anime_info = [', '')[:-2]
        )
    aid = AID_PATTERN.search(anime_info).group(0)
    anime_info = anime_info.replace(aid, '')
    slug = SLUG_PATTERN.search(anime_info).group(0)
    anime_info = anime_info.replace(slug, '')
    next_episode_date = NEXT_EPISODE_DATE_PATTERN.search(anime_info)
    next_episode_date = next_episode_date.group(0) if next_episode_date else ""
    anime_info = anime_info.replace(next_episode_date, '')
    name = NAME_PATTERN.search(anime_info)
    name = (name.group(0) if name else slug)
    anime_info = anime_info.replace(name, '')

    aid = aid.replace('"', '')
    slug = slug.replace('"', '')
    next_episode_date = next_episode_date.replace('"', '')
    name = name[1:-1]
    name = replace_html_entities(name)
    name = name[0].upper() + name[1:]

    return aid, name, slug, next_episode_date, script
