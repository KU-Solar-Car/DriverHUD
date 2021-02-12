#!/usr/bin/env/ python3
# This script must run on Pi startup

from flask import Flask
import os
import queue
import re
import serial
from serial.threaded import LineReader, ReaderThread
import sys
from threading import Thread
import time

# info handled specified by https://docs.google.com/document/d/1kUU54jQZAB9nwCM-iA96Kj0fXJ6RNw9nAcBffzji5cU/edit

stats = {
    "soc": 0,
    "temp": 0
}

temp_re = re.compile(r'Temp: (\d+)')
soc_re = re.compile(r'SOC: (\d+)')

class ArduinoSerial(LineReader):
    def handle_line(self, line):
        sys.stdout.write(line)
        if temp_re.match(line):
            stats["temp"] = int(temp_re.match(line).group(1))
        
        if soc_re.match(line):
            stats["soc"] = int(soc_re.match(line).group(1))

app = Flask(__name__)

@app.route('/get-speed')
def get_speed():
    return str(0)

@app.route('/get-battery-percent')
def get_battery_percent():
    line = ser.readline()
    line = line.decode('utf-8').strip()
    if soc_re.match(line):
        stats["soc"] = int(soc_re.match(line).group(1))
    return str(stats["soc"])

@app.route('/get-temperature')
def get_temperature():
    return str(stats["temp"])

if __name__ == '__main__':
    ser = serial.Serial('/dev/ttyACM0', 115200) 
    """
    t2 = Thread(target=readSerial, args=(ser))
    t2.start()
    t1 = Thread(target=app.run)
    t1.start()
    """
    ReaderThread(ser, ArduinoSerial).run()
    #app.run(debug=False, use_reloader=False)
    #while True:
    #    print(ser.readline())
