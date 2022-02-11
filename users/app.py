from flask import Flask, jsonify, send_file, request
import json

app = Flask(__name__)

users = {
    "mama_africa": {
        "id": "d3bc94e8-16ca-4d2e-a711-0ee3e1e42856",
        'key': "mama1234",
        'isBusiness': True,
        'name': "Mama of Africa",
        'email': 'andorpunktat.minus@gmail.com',
        'phone': '0641 9838638'
    },
    "test_b": {
        "id": "b8082774-ebe2-4aa6-8572-53aa9550b5c2",
        'key': "1234",
        'isBusiness': True,
        'name': "Pastaholic",
        'email': 'andorpunktat.minus@gmail.com',
        'phone': '0641 7778698'
    },
    "basilico": {
        "id": "34527dc4-cf30-4851-ace1-b066d944f7e5",
        'key': "1234",
        'isBusiness': True,
        'name': "Basilico",
        'email': 'andorpunktat.minus@gmail.com',
        'phone': '0641 7778698'
    },
    "joshua": {
        "id": "joshua",
        'key': "1234",
        'isBusiness': False,
        'name': "Josh Test-Nutzer",
        'email': 'joshua.fett@mni.thm.de',
        'phone': '0641 9838638'
     },
    "andor": {
        "id": "andor",
        'key': "1234",
        'isBusiness': False,
        'name': "Andor Willared",
        'email': 'andorpunktat.minus@gmail.com',
        'phone': '0641 9838638'
     },
    "michi": {
        "id": "michi",
        'key': "1234",
        'isBusiness': False,
        'name': "Michaela Fischer",
        'email': 'fiela.mf@gmail.com',
        'phone': '0641 9838638'
     },
}


@app.route('/login/<string:account>/<string:pwd>', methods=['POST'])
def login(account, pwd):
    if account in users:
        # Check if pwd for business account is correct
        if users[account]['key'] == pwd:
            return users[account]['id'], 200
        else:
            return "0", 403
    else:
        # User not known
        return "0", 404



@app.route('/users/<string:account_id>', methods=['GET', 'POST'])
def get_user(account_id):
    if request.method == 'POST':
        print("POST")
    else:
        print("GET")
    user = list(filter(lambda u: u["id"] == account_id, users.values()))
    print(user)
    if len(user) == 1:
        return jsonify(user[0])
    else:
        return "not found", 404

@app.route('/users', methods=['POST'])
def create_user():
    data = json.loads(request.data)
    print("Get data: ", data)
    users[data["email"]] = data
    print(users)
    return jsonify(True)

@app.route('/images/<string:image_name>', methods=['GET'])
def get_image(image_name):
    return send_file("images/"+image_name, mimetype='image/jpg')


@app.route('/')
def index():  # put application's code here
    return 'Hello World!'
