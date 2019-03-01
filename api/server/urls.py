from api.urls import api_blueprint
from api.urls import urls as image_urls
from utils import path

# Use path func with 'url_prefix' key word argument (recommended)
BLUEPRINTS = [
    path(api_blueprint, url_prefix='/api/v1')
]

# Use path func with 'view_func' and 'endpoint' key word arguments (recommended)
URLS = []
URLS.extend(image_urls)
