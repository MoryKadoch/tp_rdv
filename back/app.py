import os
import json
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello World'

@app.route('/save', methods=['POST'])
def save():
    data = request.get_json()

    print(data)

    if not os.path.exists('data'):
        os.makedirs('data')

    data_file_path = os.path.join('data', 'data.json')

    if os.path.exists(data_file_path):
        with open(data_file_path, 'r') as f:
            existing_data = json.load(f)
            data["id"] = existing_data[-1]["id"] + 1 if existing_data else 1
    else:
        existing_data = []
        data["id"] = 1

    existing_data.append(data)

    with open(data_file_path, 'w') as f:
        json.dump(existing_data, f)

    return jsonify({'success': True})

@app.route('/list', methods=['GET'])
def list():
    data_file_path = os.path.join('data', 'data.json')

    if os.path.exists(data_file_path):
        with open(data_file_path, 'r') as f:
            existing_data = json.load(f)
    else:
        existing_data = []

    return jsonify(existing_data)

@app.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    data_file_path = os.path.join('data', 'data.json')

    if os.path.exists(data_file_path):
        with open(data_file_path, 'r') as f:
            existing_data = json.load(f)
            for user in existing_data:
                if user["id"] == user_id:
                    return jsonify(user)
            return jsonify({"error": "User not found"}), 404
    else:
        return jsonify({"error": "No data available"}), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
