#!/usr/bin/env python3
# This script must run on Pi startup

import os
import serial
import time
from datetime import datetime
import json
#import logging
from math import pi
import sys
import glob
import random
import json
import gzip

from flask import Flask, redirect, request, Response, make_response

# info handled specified by https://docs.google.com/document/d/1kUU54jQZAB9nwCM-iA96Kj0fXJ6RNw9nAcBffzji5cU/edit

def connect_serial():
    global ser
    print("Connecting to serial")
    tries = 0
    while tries < 3:
        tries += 1
        port_name = glob.glob('/dev/ttyACM*')
        if len(port_name) == 0:
            print("Serial port not found...")
            time.sleep(1) # Wait 1 sec then try again
            continue

        print("Serial port found:", port_name[0])
        try:
            ser = serial.Serial(port_name[0], 115200, timeout=3)
            print("Serial connected")
            return
        except serial.serialutil.SerialException:
            print("Serial connection failed")
            time.sleep(1)
    print("Giving up on serial connection")

LOG_FILE = "/home/pi/data.xml"

cache = "No cached data yet"
cache_id = 0

app = Flask(__name__)
# handler = logging.FileHandler('/home/pi/log/hud.log')
# handler.setLevel(logging.ERROR)
# app.logger.addHandler(handler)

@app.route('/update-clock', methods=['POST'])
def update_clock():
    datetime_str = request.get_json()["datetime_str"]
    os.system("timedatectl set-ntp 0")
    os.system(f"timedatectl set-time '{datetime_str}'")
    os.system("timedatectl set-ntp 1")
    print(f" Updated clock to {datetime_str} ".center(80, "*"))
    return f"Updated clock to {datetime_str}"

@app.route('/log')
def tail_log():
    # Read the last 1 MB of the log file
    # Takes roughly 3 seconds to transfer over WiFi when close
    # This function will not work when the log file is too small
    with open(LOG_FILE, 'rb') as f:
        f.seek(-1024 * 1024 * 2, os.SEEK_END)
        data = f.read()
    # text/xml won't render in the browser with broken tags
    #return Response(data, mimetype="text/plain")

    # gzip drastically reduces size
    compressed = gzip.compress(data, 5)
    res = make_response(compressed)
    res.headers["Content-Type"] = "text/plain"
    res.headers["Content-Length"] = len(compressed)
    res.headers["Content-Encoding"] = "gzip"
    return res

@app.route('/')
def index():
    return redirect("/static/index.html", code=302)

@app.route('/get-data')
def get_data():
    try:
        print("---Serial transmitting---")
        ser.write(bytes('d', encoding='utf8'))
        time.sleep(0.05)
        stats = ser.read_all().decode('utf8')
        print("---Serial response---")
        print(stats)
        if len(stats) > 0:
            with open(LOG_FILE, "a+") as data:
                data.write('<entry dt="' + datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f") + '">' + stats + '</entry>\n')
            global cache
            global cache_id
            cache = stats
            cache_id += 1
        return stats
        """
        print("---Read all---")
        print(ser.read_all().decode('utf8'))
        #ser.reset_input_buffer()
        ser.write(bytes('d', encoding='utf8'))
        time.sleep(0.1) #(0.05)
        for _ in range(2): # XBEE sends a sendSerialStats message before the actual data, we are checking to see if there is a '{', for us to get the data
            print("---Stats---")
            stats = ser.readline().decode('utf8')
            print(stats)
            if len(stats) > 0 and stats[0] == '{':
                print("---Valid stats found---")
                with open(LOG_FILE, "a+") as data:
                    data.write(time.strftime("%Y-%m-%d %H:%M:%S ") + stats)
                return stats
        return stats
        """
    except Exception as e: # Possibly an issue with the serial connection
        print("Exception!", e)
        connect_serial()
        return "{}"

@app.route("/get-cached-data")
def get_cached_data():
    # Cache-ID is used so that new cache data can be noticed by if the string differs
    return f"Cache-ID: {cache_id}\n" + cache

@app.route("/get-dummy-data")
def get_dummy_data():
    data = {
        "pack_current": round(random.uniform(0, 60), 2),
        "motor_current": round(random.uniform(0, 40), 2),
        "solar_voltage": round(random.uniform(0, 140), 2),
        "min_cell_voltage": round(random.uniform(2.8, 4.2), 4),
        "pack_soc": round(random.uniform(0, 100), 1),
        "gps_speed": round(random.uniform(0, 60), 2),
        "gps_time": datetime.utcnow().strftime("%H%M%S%f"),
        "gps_date": datetime.utcnow().strftime("%d%m%y"),
        "pack_voltage": round(random.uniform(70, 110), 2),
        "min_pack_temp": round(random.uniform(0, 100), 2),
        "max_pack_temp": round(random.uniform(0, 100), 2),
        "motor_temp": round(random.uniform(0, 100), 2),
        "max_cell_voltage": round(random.uniform(2.8, 4.2), 4),
        "bms_fault": 0 if random.random() < 0.9 else random.randint(0, 2**32-1), # Not great but something
        "input_voltage": round(random.uniform(9, 14), 2),
    }
    return "Random data\n" + json.dumps(data)

@app.route("/shutdown")
def shutdown():
    try:
        print("---Serial transmitting---")
        ser.write(bytes('s', encoding='utf8'))
        time.sleep(122)
        res = ser.read_all().decode('utf8')
        print("---Serial response---")
        print(res)
        return res
    except Exception as e:
        return "Exception occured"

@app.route("/is-connected")
def is_connected():
    try:
        print("---Serial transmitting---")
        ser.write(bytes('?', encoding='utf8'))
        time.sleep(5.5)
        res = ser.read_all().decode('utf8')
        print("---Serial response---")
        print(res)
        return res
    except Exception as e:
        return "Exception occured"

@app.route("/is-shutdown")
def is_shutdown():
    try:
        print("---Serial transmitting---")
        ser.write(bytes('x', encoding='utf8'))
        time.sleep(5.5)
        res = ser.read_all().decode('utf8')
        print("---Serial response---")
        print(res)
        return res
    except Exception as e:
        return "Exception occured"

@app.route("/restart-data", methods=['POST'])
def restart_data():
	os.system("service driverhud-flask restart")

@app.route("/restart-wifi", methods=['POST'])
def restart_wifi():
	os.system("service hostapd restart")

@app.after_request
def after_request(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

if __name__ == '__main__':
    connect_serial()
    app.run(host="0.0.0.0", threaded=False)
    #connect_serial()

