import os
import django
import click
from django.conf import settings
try:
    BASE_DIR = settings.BASE_DIR
except:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "deguvon.settings")
    django.setup()
    BASE_DIR = settings.BASE_DIR

ANIME_FLV_URL = 'https://animeflv.net'
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36"
COOKIES_PATH = os.path.join(BASE_DIR, 'cookies')
