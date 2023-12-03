import csv
from time import sleep
from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests


base_url = 'http://api.nbp.pl/api/exchangerates/rates/'
accepted_curiences = ['PLN', 'EUR', 'USD']


def get_new_rates():
    csv_info = accepted_curiences
    curr_dict = {}
    for curr in accepted_curiences:
        if curr != 'PLN':
            rate = requests.get(f'{base_url}A/{curr}').json().get('rates')[0].get('mid')
        else:
            rate = 1
        curr_dict[curr] = rate
    with open('rates.csv', 'w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=csv_info)
        writer.writeheader()
        writer.writerows([curr_dict])


def get_rates_dict():
    with open('rates.csv', 'r') as csvfile:
        csv_reader = csv.DictReader(csvfile)
        data = [row for row in csv_reader]
    return data[0]


sched = BackgroundScheduler(daemon=True)
sched.add_job(get_new_rates, 'interval', seconds=60)
sched.start()

app = Flask(__name__)
CORS(app)


@app.route('/exchange/')
def index():
    from_curr = request.args.get('from_curr')
    to_curr = request.args.get('to_curr')
    value = float(request.args.get('value'))
    rates = get_rates_dict()
    sleep(1)  # to check loading indicator :)
    if from_curr is None or to_curr is None or value is None:
        return {'message': 'Missing parameter'}, 400

    if from_curr not in accepted_curiences or to_curr not in accepted_curiences:
        return {'message': 'Wrong currency'}, 400

    from_rate = float(rates[from_curr])
    to_rate = float(rates[to_curr])
    rate = from_rate/to_rate
    exchanged_value = rate * value

    return {'exchanged_value': exchanged_value, 'rate': rate}


get_new_rates()
app.run(port=8080)
