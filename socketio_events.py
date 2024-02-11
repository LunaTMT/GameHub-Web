from flask import session, request
from flask_socketio import emit, join_room, leave_room


connected = []
symbol_class_names = ["cross", "circle"]
points = [0, 0]
moves = []
won = False
current_player = 0
scores = {}

def get_current_symbol():
    return symbol_class_names[current_player]

def register_socketio_events(socketio):
    
    @socketio.on('connect_user')
    def handle_connect_user(data):
        user_id = data.get('user_id')
        room = data.get('room')

        if not user_id or not room:
            socketio.emit('connection_error', {'message': 'Invalid user ID or room'})
            return

        # Check the number of clients in the room
        clients_in_room = len(socketio.server.manager.rooms[room])

        if clients_in_room > 2:
            socketio.emit('connection_error', {'message': 'Room is full'})
            return
        else:
            # Join the specified room
            join_room(room)
            socketio.emit('connected', {'user_id': user_id, 'room': room})


    @socketio.on('disconnect')
    def handle_disconnect():
        user_id = session.get('user_id', None)
        room = session.get('room', None)
        
        if user_id and room:
            # Disconnect from the joined room upon disconnection
            leave_room(room)
            session.pop('room', None)

    @socketio.on('create_room')
    def handle_create_room(data):
        print("creating room")
        user_id = data.get('user_id')
        if user_id:
            room = user_id
            join_room(room)
            emit('room_created', {'room': room})






    @socketio.on('setUserId')
    def handle_setUserId(data):
        connected.append(data['userId'])
        scores[data['userId']] = 0
        print(scores)

    @socketio.on('placeSymbol')
    def handle_placeSymbol(data):
        global current_player
        
        cell_id = data['cell_id']
        user_id = data['user_id']

        if not won:
            if user_id == connected[current_player]:
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

        
