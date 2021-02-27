#!/usr/bin/env/ python3
# This script must run on Pi startup

import json
import logging
import os
import queue
import sys
import time

from flask import Flask
import serial

# info handled specified by https://docs.google.com/document/d/1kUU54jQZAB9nwCM-iA96Kj0fXJ6RNw9nAcBffzji5cU/edit

stats = {
    "soc": 0,
    "temp": 0
}

app = Flask(__name__)
ser = serial.Serial('/dev/ttyACM0', 115200, timeout=3) 
handler = logging.FileHandler('/home/pi/log/hud.log')
handler.setLevel(logging.ERROR)
app.logger.addHandler(handler)

@app.route('/get-data')
def get_data():
    line = ser.readline().decode("ascii")
    if line:
        line = line.strip()
        if len(line.split()) == 2:
            stats["soc"], stats["temp"] = line.split()
        else:
            app.logger.error(line)
    return json.dumps(stats)

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)
