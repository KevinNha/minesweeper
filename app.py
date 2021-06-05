from flask import Flask, request, redirect
import requests

app = Flask(__name__)

@app.route('/', methods=['POST', 'GET'])
def index():
    return app.send_static_file('index.html')

@app.route('/choose_difficulty')
def choose_difficulty():
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)