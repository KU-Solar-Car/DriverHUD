#!/usr/bin/env/ python3
# This script must run on Pi startup

import can
import json
import logging
import sys

from flask import Flask

# info handled specified by https://docs.google.com/document/d/1kUU54jQZAB9nwCM-iA96Kj0fXJ6RNw9nAcBffzji5cU/edit

stats = {
    "batteryCurrent": 0,
    "motorCurrent": 0,
    "solarVolt": 0,
    "minCellVolt": 0,
    "soc": 0,
    "speed": 0,
    "packVolt": 0,
    "minPackTemp": 0,
    "maxPackTemp": 0,
    "motorTemp": 0,
    "maxCellVolt": 0,
    "error": []
}

error_messages = [
    # DTC #1 Status
    "Discharge Limit Enforcement", # Discharge Limit 
    "Charger Safety Relay", # Charger Relay
    "Internal Hardware", # Int Hardware
    "Internal Heatsink Thermistor", # Int HS Therm
    "Internal Software", # Int Software
    "High Cell Voltage Too High", # Max Cell V High"
    "Low Cell Voltage Too Low", # Min Cell V Low"
    "Pack Too Hot", # Pack Too Hot # Reserved
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

def handleTwoBytes(b):
    return (int(b[0]) << 8) + int(b[1])

class DataListener(can.Listener):
    def __init__(self):
        pass

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
        elif msg.arbitration_id == 0x700:
            stats["speed"] = int(msg.data[0]) 
            stats["motorTemp"] = int(msg.data[7]) 
            stats["batteryCurrent"] = round(handleTwoBytes(msg.data[1:3]) / 10000, 2)
            stats["motorCurrent"] = round(handleTwoBytes(msg.data[3:5]) / 10000, 2)
            stats["solarVoltage"] = round(handleTwoBytes(msg.data[5:7]) / 10000, 2)

app = Flask(__name__)
handler = logging.FileHandler('/home/pi/log/hud.log')
handler.setLevel(logging.ERROR)
app.logger.addHandler(handler)

@app.route('/get-data')
def get_data():
    return json.dumps(stats)

if __name__ == '__main__':
    try:
        bus = can.interface.Bus(channel='can0', bustype='socketcan_native', bitrate=250000)
        # establish interface w CAN BUS
        reader = DataListener()
        notifier = can.Notifier(bus,
                                listeners=[reader],
                                timeout=5.0)

        app.logger.error("Started can network")

    except Error as e:
        app.logger.error('Cannot find PiCan board')
        app.logger.error(e)
        sys.exit("Cannot find PiCAN board")

    app.run()

