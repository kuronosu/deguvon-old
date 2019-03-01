from server import app, PORT, DEBUG

if __name__ == '__main__':
    app.run(port=PORT, debug=DEBUG, host='0.0.0.0')
