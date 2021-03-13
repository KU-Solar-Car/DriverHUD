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
    "temp": 0,
    "pvolt": 0,
    "svolt": 0,
    "speed": 0,
    "error": []
}

error_messages = [
    # DTC #1 Status
    "Discharge Limit Enforcement Fault",
    "Charger Safety Relay Fault",
    "Internal Hardware Fault",
    "Internal Heatsink Thermistor Fault",
    "Internal Software Fault",
    "High Cell Voltage Too High Fault",
    "Low Cell Voltage Too Low Fault",
    "Pack Too Hot Fault",
    # Reserved
    # DTC #2 Status
    "Internal Communication Fault",
    "Cell Balancing Stuck Off Fault",
    "Weak Cell Fault",
    "Low Cell Voltage Fault",
    "Open Wiring Fault",
    "Current Sensor Fault",
    "Highest Cell Voltage Over 5 Volts Fault",
    "Cell ASIC Fault",
    "Weak Pack Fault",
    "Fan Monitor Fault",
    "Thermistor Fault",
    "External Communication Fault",
    "Redundant Power Supply Fault",
    "High Voltage Isolation Fault",
    "Input Power Supply Fault",
    "Charge Limit Enforcement Fault"
]

app = Flask(__name__)
ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1) 
handler = logging.FileHandler('/home/pi/log/hud.log')
handler.setLevel(logging.ERROR)
app.logger.addHandler(handler)

@app.route('/get-data')
def get_data():
    line = ser.readline().decode("ascii")
    ser.flush()
    if line:
        line = line.strip()
        if len(line.split()) == 6:
            line_parts = line.split()
            stats["soc"] = line_parts[0]
            stats["temp"] = line_parts[1]
            stats["pvolt"] = line_parts[2]
            stats["svolt"] = line_parts[3]
            stats["speed"] = line_parts[4]
            error_str = bin(int(line_parts[5], 16))[2:].zfill(24)
            stats["error"] = [
                error_messages[i] for i, val in enumerate(error_str[::-1]) if val == "1"
            ]
        else:
            app.logger.error(line)
    return json.dumps(stats)

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)

