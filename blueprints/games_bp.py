from flask import Blueprint, render_template

games_bp = Blueprint('games', __name__)

@games_bp.route('/games')
def games():
    return render_template('games.html')

@games_bp.route('/tictactoe')
def tictactoe():
    return render_template('tic_tac_toe.html')