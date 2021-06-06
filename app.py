from flask import Flask, request, redirect, render_template
import requests

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
    data_body = {
        "difficulty" : difficulty,
    }
    return render_template('game.html', data_body=data_body)

if __name__ == '__main__':
    app.run(debug=True)