from flask import Flask, jsonify, send_file, request, url_for
import requests
import json
from datetime import date
from datetime import datetime
from werkzeug.utils import secure_filename
import os

from mock_db import merchants

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, 'images')

app = Flask(__name__)


# GET index
@app.route('/')
def index():  # put application's code here
    return jsonify(merchants)

# GET merchants/id
@app.route('/merchants/<string:m_id>', methods=['GET'])
def get_merchant(m_id):
    if m_id in merchants:
        merchant = merchants[m_id]
        print(merchant)
        return jsonify(merchant)
    else:
        return f"No merchant found with id: {m_id}", 404

# POST merchants/id
@app.route('/merchants/<string:m_id>', methods=['POST'])
def create_merchant(m_id):
    print("M_ID: ", m_id)
    data = json.loads(request.data)
    print("Get data: ", data)
    merchants[m_id] = data
    print(merchants)
    return jsonify(True)

# GET merchants/id/services
@app.route('/merchants/<string:m_id>/services/<string:s_id>', methods=['GET'])
def get_service(m_id, s_id):
    merchant = merchants[m_id]
    service = next(filter(lambda s: s["id"] == s_id,merchant["services"]))
    service["availability"] = calculateDailyAvailabilities(s_id)
    print("Retrieved Availability for service:", service["availability"])
    return jsonify(service)

# GET services/id/availability
@app.route('/services/<string:s_id>/availability', methods=['GET'])
def get_daily_availability(s_id):
    availability = calculateDailyAvailabilities(s_id)
    print("Retrieved Availability for service:", availability)
    return jsonify(availability)

# GET services/id/availability?date=...
@app.route('/services/<string:s_id>/availability/<string:date_str>', methods=['GET'])
def get_availability(s_id, date_str):
    availability = calculateAvailabilities(s_id, date_str)
    print("Retrieved Availability for service:", availability)
    return jsonify(availability)

# Calculate availabilities
def calculateAvailabilities(s_id, date):
    res = requests.get(f"http://appointments-service:4000/appointments/service/{s_id}/{date}")
    availability = [0 for i in range(24)]
    apps = json.loads(res.content)
    for app in apps:
        appResNum = app["amountOfReservations"]
        appTimeSlots = app["timeSlots"]
        print("TimeSlots: ", appTimeSlots)
        for timeSlot in appTimeSlots:
            availability[timeSlot] += appResNum
    return availability

# Calculate daily availabilities
def calculateDailyAvailabilities(s_id):
    today = date.today().strftime("%Y-%m-%d")

    res = requests.get(f"http://appointments-service:4000/appointments/service/{s_id}")
    availability = {today: [0 for i in range(24)]}
    apps = json.loads(res.content)
    print(apps)
    for app in apps:
        date_str = datetime.fromtimestamp(app["startAsTimestamp"]).strftime("%Y-%m-%d")
        if date_str not in availability:
            availability[date_str] = [0 for i in range(24)]
        appResNum = app["amountOfReservations"]
        appTimeSlots = app["timeSlots"]
        for timeSlot in appTimeSlots:
            availability[date_str][timeSlot] += appResNum
    print(availability)
    return availability

# GET images
@app.route('/images/<string:image_name>', methods=['GET'])
def get_image(image_name):
    return send_file("images/"+image_name, mimetype='image/jpg')

# POST images
@app.route('/images/<string:image_name>', methods=['POST'])
def upload_image(image_name):
    print("Hallo", request)
    files = request.files
    print("Files", files)
    if len(files) < 1:
        print("File empty")
        return ""
    else:
        file = files['files']
        if file.filename == '':
            print("Filename empty")
            return ""
        else:
            filename = secure_filename(file.filename)
            file_path = os.path.join(UPLOAD_DIR, filename)
            file.save(file_path)
            print("File uploaded to", file_path)
            return f"{filename}"