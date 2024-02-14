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
                'users': {user_id},
                'symbol_class_names': ["cross", "circle"],
                'points': [0, 0],
                'moves': [],
                'won': False,
                'current_player': 0,
                'scores': {},
                'game': game
            }

            emit('room_created', {'room_id': room_id, 'user_id': user_id}, room=room_id)
            emit('room_joined', {'room_id': room_id, 'user_id': user_id, 'users': list(rooms_dict[room_id]['users'])}, room=room_id)
        else:
            handle_join_room({'user_id': user_id, 'room_id': room_id, 'game': game})

    @socketio.on('join_room')
    def handle_join_room(data):
        game = data['game']
        user_id = data['user_id']
        room_id = data['room_id']

        room_length = len(rooms_dict[room_id]['users'])

        if room_length < 2:
            rooms_dict[room_id]['users'].add(user_id)
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
        
        cell_id = data['cell_id']
        user_id = data['user_id']

        if not won:
            if user_id == rooms_dict['users'][current_player]:
                emit('updateBoard', {"cell_id" : cell_id,  "symbol_class" : get_current_symbol()}, broadcast=True) 
                current_player = (current_player + 1) % 2
                moves.append(cell_id)
                emit('checkWin')
    
    @socketio.on('resetBoard')
    def handle_resetBoard():
        emit('resetBoard', broadcast=True)

        global moves
        global won
        
        moves = []     
        won = False

    @socketio.on('undo')
    def handle_undo():
        global current_player

        if len(moves) > 0 and not won:
            emit('undo',  moves[-1], broadcast=True)
            moves.pop()
            current_player = (current_player - 1) % 2

    @socketio.on('showWinner')
    def handle_showWinner(data):
        emit('highlightWinner', data, broadcast=True)
        global won
        won = True

    @socketio.on('updatePlayerPoints')
    def handle_updatePlayerPoints(data):
        scores[data['user_id']] += 1
        emit('updatePlayerPoints', {"scores": list(scores.values())}, broadcast=True)
