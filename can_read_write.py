#!/usr/bin/env/ python3
# This script must run on Pi startup

from flask import Flask
import can
import os
import sys
import queue
import time

# info handled specified by https://docs.google.com/document/d/1kUU54jQZAB9nwCM-iA96Kj0fXJ6RNw9nAcBffzji5cU/edit

stats = {
    "soc": 0,
    "temp": 0
}

app = Flask(__name__)

class DataListener(can.Listener):
    def __init__(self):
        pass

    def on_message_received(self, msg):
        if msg.arbitration_id == 0x6B0:
            stats["soc"] = msg.data[6] / 2
        if msg.arbitration_id == 0x6B1:
            stats["temp"] = msg.data[6]

@app.route('/get-speed')
def get_speed():
    return str(0)

@app.route('/get-battery-percent')
def get_battery_percent():
    return str(stats["soc"])

@app.route('/get-temperature')
def get_temperature():
    return str(stats["temp"])

if __name__ == '__main__':
    # BUS readers filter and queue messages for reading
	try:
		bus = can.interface.Bus(channel='can0', bustype='socketcan_native', bitrate=250000)
		# establish interface w CAN BUS
		reader = DataListener()
		notifier = can.Notifier(bus,
						listeners=[reader],
						timeout=5.0)

		print("Started can network")

	except OSError:
		print('Cannot find PiCan board')
		sys.exit()

    app.run()
