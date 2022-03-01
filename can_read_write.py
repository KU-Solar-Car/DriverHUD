#!/usr/bin/env python3
# This script must run on Pi startup

#import can
import serial
import time
import json
import logging
from math import pi
import sys

from flask import Flask

# info handled specified by https://docs.google.com/document/d/1kUU54jQZAB9nwCM-iA96Kj0fXJ6RNw9nAcBffzji5cU/edit

TIRE_DIAMETER = 21.3

ser = serial.Serial('/dev/ttyACM0', 115200)
#ser.open()

stats = {
    "batteryCurrent": 23,
    "motorCurrent": 18,
    "solarVolt": 83,
    "minCellVolt": 3.3,
    "soc": 62,
    "speed": 27,
    "packVolt": 68,
    "minPackTemp": 38,
    "maxPackTemp": 54,
    "motorTemp": 68,
    "maxCellVolt": 3.8,
    "motorControllerTemp": 45,
    "error": []
}

bms_errors1 = [
    # DTC #1 Status
    "Discharge Limit Enforcement", # Discharge Limit
    "Charger Safety Relay", # Charger Relay
    "Internal Hardware", # Int Hardware
    "Internal Heatsink Thermistor", # Int HS Therm
    "Internal Software", # Int Software
    "High Cell Voltage Too High", # Max Cell V High"
    "Low Cell Voltage Too Low", # Min Cell V Low"
    "Pack Too Hot", # Pack Too Hot # Reserved
]

bms_errors2 = [
    # DTC #2 Status
    "Internal Communication", # Int Comm
    "Cell Balancing Stuck Off", # Cell Balancing
    "Weak Cell", # Weak Cell
    "Low Cell Voltage", # Low Cell Voltage
    "Open Wiring", # Open Wiring
    "Current Sensor", # Current Sensor
    "Highest Cell Voltage Over 5 Volts", # Max Cell > 5V
    "Cell ASIC", # Cell ASIC
    "Weak Pack", # Weak Pack
    "Fan Monitor", # Fan Monitor
    "Thermistor", # Thermistor
    "External Communication", # Ext Comm
    "Redundant Power Supply", # Redundant PS
    "High Voltage Isolation", # High Volt Iso
    "Input Power Supply", # Input PS
    "Charge Limit Enforcement" # Charge Limit
]

motor_errors = [
    "Motor Angle ID",
    "Over Voltage",
    "Low Voltage",
    None,
    "Motor Stall",
    "Internal Volts Fault",
    "MC Over Temp",
    None,
    "Internal Reset",
    "Hall Throttle Error",
    "Angle Sensor Error",
    None,
    None,
    "Motor Over Temp",
    "Hall Galv Sensor Error"
]

def handleTwoBytes(b):
    return (int(b[0]) << 8) + int(b[1])

def handleTwoBytesLE(b):
    return (int(b[1]) << 8) + int(b[0])

#class DataListener(can.Listener):
 #   def __init__(self):
  #      pass

    def on_message_received(self, msg):
        if msg.arbitration_id == 0x6B0:
            stats["packVolt"] = round(handleTwoBytes(msg.data[4:6]) / 10, 1)
            stats["soc"] = round(int(msg.data[6]) / 2, 1)
        elif msg.arbitration_id == 0x6B1:
            stats["minPackTemp"] = int(msg.data[5]) 
            stats["maxPackTemp"] = int(msg.data[4])
        elif msg.arbitration_id == 0x6B2:
            stats["minCellVolt"] = round(handleTwoBytes(msg.data[0:2]) / 10000, 2)
            stats["maxCellVolt"] = round(handleTwoBytes(msg.data[3:5]) / 10000, 2)
        elif msg.arbitration_id == 0x6B6:
            stats["batteryCurrent"] = round(handleTwoBytes(msg.data[0:2]) / 10, 1)

            errorNum1 = int(msg.data[2])
            errors1 = [bms_errors1[i] for i in format(errorNum1, 'b') if i == '1']
            stats["error"].extend(errors1)

            errorNum2 = handleTwoBytes(msg.data[4:6])
            errors2 = [bms_errors2[i] for i in format(errorNum2, 'b') if i == '1']
            stats["error"].extend(errors2)

        elif msg.arbitration_id == 0x0CF11E05:
            rpm = handleTwoBytesLE(msg.data[0:2]) 
            stats["speed"] = rpm * pi * TIRE_DIAMETER / 12 / 5280 * 60 
            stats["motorCurrent"] = round(handleTwoBytesLE(msg.data[2:4]) / 10, 1)
            errorNum = handleTwoBytesLE(msg.data[6:8])
            errors = [motor_errors[i] for i in format(errorNum, 'b') if i == '1' and motor_errors[i] is not None]
            stats["error"].extend(errors)
        elif msg.arbitration_id == 0x0CF11F05:
            stats["motorControllerTemp"] = handleTwoBytesLE(msg.data[2:4]) - 40
            stats["motorTemp"] = handleTwoBytesLE(msg.data[4:6]) - 30
        elif msg.arbitration_id == 0b1110111001:
            stats["solarVolt"] = int((msg.data[4] & 0b11) << 8) + int(msg.data[5])
            if msg.data[0] & 0x80:
                stats["error"].append("Battery Volt Level Reached")
            if msg.data[0] & 0x40:
                stats["error"].append("Overtemperature")
            if msg.data[0] & 0x20:
                stats["error"].append("No Charge")
            if msg.data[0] & 0x10:
                stats["error"].append("Undervoltage")

app = Flask(__name__)
# handler = logging.FileHandler('/home/pi/log/hud.log')
# handler.setLevel(logging.ERROR)
# app.logger.addHandler(handler)

@app.route('/get-data')
def get_data():
	ser.write(bytes('d', encoding='utf8'))
	stats = ser.readline()
	#return json.dumps(stats)
	return stats

if __name__ == '__main__':
	try:
        #bus = can.interface.Bus(channel='can0', bustype='socketcan_native', bitrate=250000)
        # establish interface w CAN BUS
       #reader = DataListener()
        #notifier = can.Notifier(bus,
        #                        listeners=[reader],
         #                       timeout=5.0)

        #app.logger.error("Started can network")	
		time.sleep(3)
		ser.write(bytes('d', encoding='utf8'))
	except Exception as e:
		app.logger.error('Cannot Establish Serial Connection')
		app.logger.error(e)
		#sys.exit("Cannot find PiCAN board")
	app.run(host="0.0.0.0")

