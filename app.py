from flask import Flask, json, request, redirect, render_template, jsonify
from helper_functions import get_mine_positions, NUMBER_OF_TILES

app = Flask(__name__)

@app.route('/', methods=['POST', 'GET'])
def index():
    if request.method == 'POST':
        try:
            game_difficulty = request.form['difficulty_button']
            return redirect(f'play_{game_difficulty}')
        except:
            return "Something went wrong!"
    else:
        return render_template('index.html')

@app.route('/play_<difficulty>')
def choose_difficulty(difficulty):
    global DIFFICULTY
    DIFFICULTY = difficulty
    data_body = {
        "difficulty" : difficulty.title(),
        "field_size" : NUMBER_OF_TILES[difficulty],
    }
    return render_template('game.html', data_body=data_body)

@app.route('/postMoveData', methods=['POST'])
def postMoveData():
    if not request.json:
        print("Error: 400")
    return jsonify(request.json)

@app.route('/setMines', methods=['GET'])
def setMines():
    return get_mine_positions(DIFFICULTY)

@app.route('/getNumberOfTiles', methods=['GET'])
def getNumberOfTiles():
    return NUMBER_OF_TILES

if __name__ == '__main__':
    app.run(debug=True)