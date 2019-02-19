from gevent.pywsgi import WSGIServer
from main import app, PORT

if __name__ == '__main__':
    app.debug = False
    http_server = WSGIServer(('', PORT), app)
    http_server.serve_forever()
