from flask import Blueprint
from utils import path
from . import views

api_blueprint = Blueprint('api', 'api')

api_blueprint.add_url_rule('/recent', view_func=views.recent)
api_blueprint.add_url_rule('/search/<name>', view_func=views.search)
api_blueprint.add_url_rule('/anime/<aid>', view_func=views.anime)
api_blueprint.add_url_rule('/directory', view_func=views.directory)
api_blueprint.add_url_rule('/episode/<eid>/videos', view_func=views.episode_videos_data)
api_blueprint.add_url_rule('/episode/<eid>/<server>', view_func=views.episode_video_server, methods=['POST',], defaults={'lang': 'all'})
api_blueprint.add_url_rule('/episode/<eid>/<server>/<lang>', view_func=views.episode_video_server, methods=['POST',])

urls = [
    path('/uploads/animes/covers/<image>.<ext>', view_func=views.uploads, endpoint='uploads'),
    path('/screenshots/<aid>/<episode>/th_<th>.<ext>', view_func=views.screenshots, endpoint='screenshots')
]
