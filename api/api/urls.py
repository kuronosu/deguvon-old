from flask import Blueprint
from utils import path
from . import views

api_blueprint = Blueprint('api', 'api')

api_blueprint.add_url_rule('/recent', view_func=views.recent)
api_blueprint.add_url_rule('/search/<name>', view_func=views.search)
api_blueprint.add_url_rule('/anime/<aid>', view_func=views.anime)

urls = [
    path('/uploads/animes/covers/<image>.<ext>', view_func=views.uploads, endpoint='uploads'),
    path('/screenshots/<aid>/<episode>/th_<th>.<ext>', view_func=views.screenshots, endpoint='screenshots')
]
