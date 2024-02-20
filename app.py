from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy


from socketio_events import register_socketio_events
from blueprints.main_bp import main_bp
from blueprints.games_bp import games_bp

import logging

app = Flask(__name__)
# Flask configuration for PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] =  'postgresql://taylor:yourpassword@localhost/gamehub'


db = SQLAlchemy(app)
socketio = SocketIO(app)

# Disable Flask's default access log
app.logger.disabled = True

# Disable logging of werkzeug (Flask's underlying WSGI library)
log = logging.getLogger('werkzeug')
log.disabled = True

# Register the Blueprints
app.register_blueprint(main_bp)
app.register_blueprint(games_bp)

from models.room import Room

# Use application context for creating database tables
with app.app_context():
    # Create the tables when the application context is pushed
    db.create_all()

    # Register SocketIO events after creating the tables
    register_socketio_events(socketio, db, Room)

if __name__ == '__main__':
    socketio.run(app, debug=True)
