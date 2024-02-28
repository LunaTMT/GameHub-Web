from sqlalchemy.dialects.postgresql import JSONB
from flask_sqlalchemy import SQLAlchemy
from app import db


class Room(db.Model):
    id = db.Column(db.String(64), primary_key=True)
    users = db.Column(JSONB)  # dict, list, or any JSON-serializable data
    symbol_class_names = db.Column(JSONB)  # dict, list, or any JSON-serializable data
    points = db.Column(JSONB)  # dict, list, or any JSON-serializable data
    moves = db.Column(JSONB)  # dict, list, or any JSON-serializable data
    won = db.Column(db.Boolean)
    current_player = db.Column(db.Integer)
    game = db.Column(db.String(64))

    def __repr__(self):
        return (f"Room(id={self.id},\n"
                f"     users={self.users},\n"
                f"     symbol_class_names={self.symbol_class_names},\n"
                f"     points={self.points},\n"
                f"     moves={self.moves},\n"
                f"     won={self.won},\n"
                f"     current_player={self.current_player},\n"
                f"     game={self.game})")
