from flask import Blueprint, render_template, request, url_for


games_bp = Blueprint('games', __name__)



@games_bp.route('/<game>/<room_id>')
def play_game(room_id, game):
    print(f'games/{game}.html')
    return render_template(f'games/{game}.html', title=game)

@games_bp.route('/<game>/settings')
def settings(game):
    return render_template('games/config/settings.html', title=game)


@games_bp.route('/<game>/share_link/<random_key>', methods=['GET', 'POST'])
def share_link(game, random_key):
    if request.method == 'POST':
        pass
    else:
        return render_template('games/config/share_link.html', link=f"http://127.0.0.1:5000/{game}/share_link/{random_key}")


@games_bp.route('/<game>/random/<random_key>', methods=['GET', 'POST'])
def random(game, random_key):
    if request.method == 'POST':
        pass
    else:
        return render_template('games/config/finding_random.html', link=f"http://127.0.0.1:5000/{game}/random/{random_key}")