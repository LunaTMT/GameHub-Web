from flask import session, request
from flask_socketio import emit, join_room, leave_room
from collections import defaultdict

connected = []
symbol_class_names = ["cross", "circle"]
points = [0, 0]
moves = []
won = False
current_player = 0
scores = {}

rooms_dict = {}

def get_current_symbol():
    return symbol_class_names[current_player]

def register_socketio_events(socketio):

    @socketio.on('create_room')
    def handle_create_room(data):
        user_id = data['user_id']
        room_id = data['room_id']

        if room_id not in rooms_dict:
            join_room(room_id)  

            rooms_dict[room_id] =  {
                'users': {user_id},
                'symbol_class_names': ["cross", "circle"],
                'points': [0, 0],
                'moves': [],
                'won': False,
                'current_player': 0,
                'scores': {}
            }
            emit('room_created', {'room_id': room_id}, room=room_id)  # Use room parameter here
            emit('room_joined', {'room_id': room_id, 'users': list(rooms_dict[room_id]['users'])}, room=room_id)  # Use room parameter here
        else:
            handle_join_room({'user_id' : user_id, 'room_id': room_id })

    @socketio.on('join_room')
    def handle_join_room(data):
        user_id = data['user_id']
        room_id = data['room_id']

        room_length = len(rooms_dict[room_id]['users'])

        if room_length == 1:
            rooms_dict[room_id]['users'].add(user_id)
            join_room(room_id)  
            emit('room_joined', {'room_id': room_id, 'users': list(rooms_dict[room_id]['users'])}, room=room_id)  # Use room parameter here
            emit('play_game', room=room_id)  # Use room parameter here
        else:
            emit('room_maximum_capacity')


   


