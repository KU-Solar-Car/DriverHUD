#!/usr/bin/env/ python3
# This scipt must run on Pi startup

from flask import Flask
import can
import sys
import queue

# info handled specified by https://docs.google.com/document/d/1kUU54jQZAB9nwCM-iA96Kj0fXJ6RNw9nAcBffzji5cU/edit
# full list of Parameter IDs at https://en.wikipedia.org/wiki/OBD-II_PIDs
PARAMETER_IDS = {'VEHICLE_BATTERY_PERCENT': 0x2F,
                 'VEHICLE_SPEED': 0x0D,
                 }


REQUEST_ID = 0x7DF
REPLY_ID = 0x7E8


class FilteredBufferReader(can.BufferedReader):
    def __init__(self, filter_parameter):
        """
        :param filter_parameter: from PARAMETER_IDS
        """
        can.BufferedReader.__init__(self)
        self.buffer = queue.Queue(0)
        self.filter_parameter = filter_parameter

    def on_message_received(self, msg):
        if msg.arbitration_id == REPLY_ID and msg.data[2] == self.filter_parameter:
            self.buffer.put(msg)


# establish interface w CAN BUS
try:
    bus = can.interface.Bus(channel='can0', bustype='socketcan_native')

except OSError:
    print('Cannot find PiCan board')
    sys.exit()

# BUS readers filter and queue messages for reading
speed_reader = FilteredBufferReader([PARAMETER_IDS['VEHICLE_SPEED']])
battery_percent_reader = FilteredBufferReader(PARAMETER_IDS['VEHICLE_BATTERY_PERCENT'])

# notifier distributes messages to readers
notifier = can.Notifier(bus,
                        listeners=[speed_reader, battery_percent_reader],
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
    bus.send(can.Message(arbitration_id=REQUEST_ID,
                         data=[0x02, 0x01, PARAMETER_IDS['VEHICLE_BATTERY_PERCENT'], 0x00, 0x00, 0x00, 0x00, 0x00]))

    rec_msg = battery_percent_reader.get_message()

    # for debug, TODO: remove for production
    if rec_msg:
        return str(rec_msg.data[3])
    else:
        return str(-1)


if __name__ == '__main__':
    app.run()
