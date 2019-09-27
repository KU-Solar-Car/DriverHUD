import can
import time
import os
import sys
import queue

# info handled; specified by https://docs.google.com/document/d/1kUU54jQZAB9nwCM-iA96Kj0fXJ6RNw9nAcBffzji5cU/edit
# full list of PIDs at https://en.wikipedia.org/wiki/OBD-II_PIDs
VEHICLE_FUEL = 0x03
VEHICLE_CHARGE = 0X0D

PID_REQUEST = 0x7DF
PID_REPLY = 0x7E8

# Bring up can0 interface at 500kbps
os.system("sudo /sbin/ip link set can0 up type can bitrate 500000")
time.sleep(0.1)

try:
    bus = can.interface.Bus(channel='can0')
except OSError:
    print('Cannot find PiCan board')
    sys.exit()

speed = 0
charge = 0


class DataReader(can.BufferedReader):
    def __init__(self, pid, outfile_name):
        """

        :param pid: only handle messages containing this pid
        :param outfile_name: write received data to outfile_name.txt
        """
        can.BufferedReader.__init__(self)
        self.buffer = queue.Queue()
        self.pid = pid
        self.outfile_name = outfile_name

    def get_message_noblock(self):
        if not self.buffer.empty():
            return self.buffer.get_nowait()


class SpeedReader(DataReader):
    def __init__(self, pid, outfile_name):
        DataReader.__init__(self, pid, outfile_name)

    def on_message_received(self, msg):
        if msg.arbitration_id == PID_REPLY and msg.data[3] == self.pid:
            pass  # TODO
