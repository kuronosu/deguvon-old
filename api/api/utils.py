import os
import shutil
from enum import Enum
from flask import send_file, abort
from scrape.utils import make_request as rq

BASE_DIR = os.environ.get(
    'BASE_DIR', os.path.dirname(os.path.dirname(__file__)))


class ImageSource(Enum):
    UPLOADS = 0
    SCREENSHOTS = 1


class VideoServer:
    def __init__(self, name, controller):
        self.name = name
        self.controller = controller


def serve_image(source, image=None, aid=None, episode=None, th=None, ext=None):
    if source is ImageSource.UPLOADS and not (image is None or ext is None):
        path = os.path.join(BASE_DIR, 'images', 'covers')
        file_path = os.path.join(path, f'{image}.{ext}')
        url = f'https://animeflv.net/uploads/animes/covers/{image}.{ext}'
    elif source is ImageSource.SCREENSHOTS and not (aid is None or episode is None or th is None or ext is None):
        path = os.path.join(BASE_DIR, 'images', 'screenshots', aid, episode)
        file_path = os.path.join(path, f'th_{th}.{ext}')
        url = f'https://cdn.animeflv.net/screenshots/{aid}/{episode}/th_{th}.{ext}'
    else:
        abort(404)
    if not os.path.exists(file_path):
        r = rq(url, stream=True)
        if r is None or r.status_code != 200:
            abort(404)
        os.makedirs(path, exist_ok=True)
        with open(file_path, 'wb') as f:
            r.raw.decode_content = True
            shutil.copyfileobj(r.raw, f)
    return send_file(file_path, mimetype=f'image/{ext}')
