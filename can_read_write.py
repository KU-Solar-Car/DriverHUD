# This scipt must run on Pi startup

import can
import time
import os
import sys
import json
from threading import Thread

# info handled; specified by https://docs.google.com/document/d/1kUU54jQZAB9nwCM-iA96Kj0fXJ6RNw9nAcBffzji5cU/edit
# full list of PIDs at https://en.wikipedia.org/wiki/OBD-II_PIDs
PIDS = {'VEHICLE_CHARGE': 0x2F,
        'VEHICLE_SPEED': 0x0D,
}


PID_REQUEST = 0x7DF
PID_REPLY = 0x7E8

OUTPUT_PATH = os.path.join(sys.path[0], 'data.json')


class FilteredBufferReader(can.BufferedReader):
    def __init__(self):
        can.BufferedReader.__init__(self)

    def on_message_received(self, msg):
        if msg.arbitration_id == PID_REPLY and msg.data[2] in PIDS.keys():
            self.buffer.put(msg)


def request_task():
    """
    defines and sends messages to request vehicle info
    :return: None
    """
    requests = [can.Message(arbitration_id=PID_REQUEST,
                            data=[0x02, 0x01, PIDS['VEHICLE_SPEED'], 0x00, 0x00, 0x00, 0x00, 0x00],
                            extended_id=False),
                can.Message(arbitration_id=PID_REQUEST,
                            data=[0x02, 0x01, PIDS['VEHICLE_CHARGE'], 0x00, 0x00, 0x00, 0x00, 0x00])]

    while True:
        for req_msg in requests:
            bus.send(req_msg)
            time.sleep(0.05)


def process_message(message):
    """
    write data from msg to json file in script parent directory
    :param message: Message instance
    :return: None
    """
    if message.data[2] == PIDS['VEHICLE_CHARGE']:
        data['charge'] = message.data[3]  # TODO: will sensors return value as percent (as expected?)
    if message.data[2] == PIDS['VEHICLE_SPEED']:
        data['speed'] = message.data[3] / 1.609  # convert km/h to miles/h

    with open(OUTPUT_PATH, 'w') as f:
        json.dump(data, f)


# Bring up can0 interface at 500kbps
os.system("sudo /sbin/ip link set can0 up type can bitrate 500000")
time.sleep(0.1)

# establish interface w CAN BUS
try:
    bus = can.interface.Bus(channel='can0')
except OSError:
    print('Cannot find PiCan board')
    sys.exit()

# initialize data
data = {'speed': 0,
        'charge': 0}

# create thread for sending requests
rt = Thread(target=request_task)
rt.start()

reader = FilteredBufferReader()

# main loop
try:
    while True:
        msg = reader.get_message()
        if msg:
            process_message(msg)

except Exception as e:
    os.system("sudo /sbin/ip link set can0 down")
    print(e)
