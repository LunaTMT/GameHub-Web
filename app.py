
from flask import Flask
from flask_socketio import SocketIO
from socketio_events import register_socketio_events
from blueprints.main_bp import main_bp
from blueprints.games_bp import games_bp

import random
import string
import os
import logging

app = Flask(__name__)
socketio = SocketIO(app)


"""
# Disable Flask's default access log
app.logger.disabled = True

# Disable logging of werkzeug (Flask's underlying WSGI library)
log = logging.getLogger('werkzeug')
log.disabled = True
"""


# Register the Blueprints
app.register_blueprint(main_bp)
app.register_blueprint(games_bp)
register_socketio_events(socketio)


if __name__ == '__main__':
    socketio.run(app, debug=True)


