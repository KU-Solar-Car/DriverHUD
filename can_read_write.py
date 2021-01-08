#!/usr/bin/env/ python3
# This scipt must run on Pi startup

from flask import Flask
import can
import os
import sys
import queue

# info handled specified by https://docs.google.com/document/d/1kUU54jQZAB9nwCM-iA96Kj0fXJ6RNw9nAcBffzji5cU/edit

stats = {
    "soc": 0
}

class DataListener(can.Listener):
    def __init__(self):
        pass

    def on_message_received(self, msg):
        if msg.arbitration_id == 0x6B0:
            stats["soc"] = msg.data[6] / 2

# establish interface w CAN BUS
try:
    # os.system("sudo /sbin/ip link set can0 up type can bitrate 250000")
    bus = can.interface.Bus(channel='can0', bustype='socketcan_native')

except OSError:
    print('Cannot find PiCan board')
    sys.exit()

# BUS readers filter and queue messages for reading
reader = DataListener()

# notifier distributes messages to readers
notifier = can.Notifier(bus,
                        listeners=[reader],
                        timeout=5.0)

app = Flask(__name__)

@app.route('/get-speed')
def get_speed():
    bus.send(can.Message(arbitration_id=REQUEST_ID,
             data=[0x02, 0x01, PARAMETER_IDS['VEHICLE_SPEED'], 0x00, 0x00, 0x00, 0x00, 0x00],
             extended_id=False))

    rec_msg = speed_reader.get_message()  # returns None if timeout

    # for debug, TODO: remove for production
    if rec_msg:
        speed = rec_msg.data[3] / 1.609  # km/h to mi/h
        return str(speed)
    else:
        return str(-1)


@app.route('/get-battery-percent')
def get_battery_percent():
    return str(stats["soc"])

if __name__ == '__main__':
    app.run()
