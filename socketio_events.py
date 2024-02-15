from flask_socketio import emit, join_room, leave_room
from flask import url_for, request

symbol_class_names = ["cross", "circle"]
rooms_dict = {}
current_player = 0

def register_socketio_events(socketio):

    @socketio.on('create_room')
    def handle_create_room(data):
        game = data['game']
        user_id = data['user_id']
        room_id = data['room_id']

        if room_id not in rooms_dict:
            join_room(room_id)

            rooms_dict[room_id] = {
                'users': [user_id],
                'symbol_class_names': ["cross", "circle"],
                'points': {user_id : 0},
                'moves': [],
                'won': False,
                'current_player': 0,
                'game': game
            }

            print(rooms_dict)
            emit('room_created', {'room_id': room_id, 'user_id': user_id}, room=room_id)
            emit('room_joined', {'room_id': room_id, 'user_id': user_id, 'users': list(rooms_dict[room_id]['users'])}, room=room_id)
        else:
            handle_join_room({'user_id': user_id, 'room_id': room_id, 'game': game})

    @socketio.on('join_room')
    def handle_join_room(data):
        game = data['game']
        user_id = data['user_id']
        room_id = data['room_id']

        room = rooms_dict[room_id]
        users = room['users']

        if len(users) < 2 and user_id not in users:
            room['users'].append(user_id)
            room['points'][user_id] = 0

            join_room(room_id)

            emit('room_joined', {'room_id': room_id, 'users': list(rooms_dict[room_id]['users'])}, room=room_id)
            emit('play_game', {'game': game, 'room_id': room_id}, room=room_id)
        else:
            emit('room_maximum_capacity')

    @socketio.on('play_game')
    def play_game(data):
        game = data['game']
        room_id = data['room_id']

        room_url = url_for(f'games.play_game', game=game, room_id=room_id)
        socketio.emit('redirect', {'url': room_url}, room=room_id)



    def get_current_symbol():
        return symbol_class_names[current_player]
        
    @socketio.on('placeSymbol')
    def handle_placeSymbol(data):
        global current_player
        
        cell_id, user_id, room_id = data.values()

        room = rooms_dict[room_id]
        current_player = room['current_player']

        if not room['won']:
            if user_id == room['users'][current_player]:
                emit('updateBoard', {"cell_id" : cell_id,  "symbol_class" : get_current_symbol()}, broadcast=True) 
                room['current_player'] += 1
                room['current_player'] %= 2
                room['moves'].append(cell_id)
                emit('checkWin')
    
    @socketio.on('resetBoard')
    def handle_resetBoard(data):
        emit('resetBoard', broadcast=True)

        room_id = data['room_id']
        room = rooms_dict[room_id]

        room['moves'] = []
        room['won'] = False



    @socketio.on('showWinner')
    def handle_showWinner(data):
        room_id, cell_ids = data.values()
        room = rooms_dict[room_id]
        room['won'] = True
        room['current_player'] -= 1

        emit('highlightWinner', {"cell_ids" : cell_ids}, broadcast=True)
        

    @socketio.on('updatePlayerPoints')
    def handle_updatePlayerPoints(data):
        
        room_id, user_id = data.values()
        room = rooms_dict[room_id]

        room['points'][user_id] += 1
    
        emit('updatePlayerPoints', {"points": list(room['points'].values())}, broadcast=True)
