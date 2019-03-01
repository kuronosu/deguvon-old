import os
from flask import Flask
from .defaults import *
from .settings import *
from .urls import BLUEPRINTS, URLS

__all__ = ['app', 'DEBUG', 'BASE_DIR', 'PORT']

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = JSON_AS_ASCII


for blueprint, kwargs in BLUEPRINTS:
    app.register_blueprint(blueprint, **kwargs)

for rule, kwargs in URLS:
    app.add_url_rule(rule, **kwargs)

os.environ['BASE_DIR'] = BASE_DIR
