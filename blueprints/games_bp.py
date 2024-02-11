from flask import Blueprint, render_template, request, url_for


games_bp = Blueprint('games', __name__, url_prefix='/games')

@games_bp.route('/')
def games():
    return render_template('games/games.html', title="insert game title")

@games_bp.route('/tictactoe')
def tictactoe():
    return render_template('games/tic_tac_toe.html')


@games_bp.route('/share_link/<random_key>', methods=['GET', 'POST'])
def share_link(random_key):
    if request.method == 'POST':
        pass
    else:
        return render_template('games/share_link.html', link=f"http://127.0.0.1:5000/games/share_link/{random_key}")
