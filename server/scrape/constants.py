import os
from django.conf import settings


ANIME_FLV_URL = 'https://www.animeflv.net'
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36"
COOKIES_PATH = os.path.join(settings.BASE_DIR, 'cookies')
