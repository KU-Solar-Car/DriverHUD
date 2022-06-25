#!/usr/bin/env python3
# This script must run on Pi startup

#import can
import serial
import time
import json
import logging
from math import pi
import sys
import glob

from flask import Flask

# info handled specified by https://docs.google.com/document/d/1kUU54jQZAB9nwCM-iA96Kj0fXJ6RNw9nAcBffzji5cU/edit

def connect_serial():
    global ser
    print("Connecting to serial")
    while True:
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

LOG_FILE = "/home/pi/data.txt"


app = Flask(__name__)
# handler = logging.FileHandler('/home/pi/log/hud.log')
# handler.setLevel(logging.ERROR)
# app.logger.addHandler(handler)

@app.route('/get-data')
def get_data():
    try:
        ser.reset_input_buffer()
        ser.write(bytes('d', encoding='utf8'))
        time.sleep(0.05)
        for _ in range(2): # XBEE sends a sendSerialStats message before the actual data, we are checking to see if there is a '{', for us to get the data
            stats = ser.readline().decode('utf8')
            print("Stats:", stats)
            if len(stats) > 0 and stats[0] == '{':
                with open(LOG_FILE, "a+") as data:
                    data.write(stats)
                return stats
        return stats
    except Exception as e: # Possibly an issue with the serial connection
        print("Exception!", e)
        connect_serial()
        return "{}"

if __name__ == '__main__':
    connect_serial()
    app.run(host="0.0.0.0", threaded=False)

