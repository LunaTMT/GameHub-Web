from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

connected = []
symbol_class_names = ["cross", "circle"]
#connected : user IDs associated with their respective socket IDs.

points = [0, 0]
moves = []
won = False
current_player = 0

scores = {}

def get_current_symbol():
    return symbol_class_names[current_player]

@socketio.on('connect')
def handle_connect():
    print("connected")

@socketio.on('setUserId')
def handle_setUserId(data):
    connected.append(data['userId'])
    scores[data['userId']] = 0

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

    


@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    socketio.run(app, debug=True)
