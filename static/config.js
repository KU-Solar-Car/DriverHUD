const column1 = 80;
const column2 = 240;
const column3 = 400;
const column4 = 560;
const column5 = 720;

const row1 = 80;
const row2 = 240;
const row3 = 400;

const r1 = 55;
const r2 = 65;

let config = {
    "pack_current": {
        "svgId": "svgId",
        "cx": column2,
        "cy": row1,
        "r1": r1,
        "r2": r2,
        "low": 0,
        "high": 60,
        "title": "Battery",
        "units": "A",
        "format": (value) => value + " A"
    },
    "motor_current": {
        "svgId": "svgId",
        "cx": column3,
        "cy": row1,
        "r1": r1,
        "r2": r2,
        "low": 0,
        "high": 40,
        "title": "Motor",
        "units": "A",
        "format": (value) => value + " A"
    },
    "solar_voltage": {
        "svgId": "svgId",
        "cx": column4,
        "cy": row1,
        "r1": r1,
        "r2": r2,
        "low": 0,
        "high": 140,
        "title": "Solar",
        "units": "V",
        "format": (value) => value + " V"
    },
    "min_cell_voltage": {
        "svgId": "svgId",
        "cx": column5,
        "cy": row1,
        "r1": r1,
        "r2": r2,
        "low": 2.8,
        "high": 4.2,
        "title": "Min Cell",
        "units": "V",
        "format": (value) => value + " V"
    },
    "pack_soc": {
        "svgId": "svgId",
        "cx": column2,
        "cy": row2,
        "r1": r1,
        "r2": r2,
        "low": 0,
        "high": 100,
        "title": "SOC",
        "units": "%",
        "format": (value) => value + "%"
    },
    "gps_speed": {
        "svgId": "svgId",
        "cx": column3,
        "cy": row2,
        "r1": r1,
        "r2": r2,
        "low": 0,
        "high": 60,
        "title": "Speed",
        "units": "mph",
        "format": (value) => value + " mph"
    },
    "time": {
        "svgId": "svgId",
        "cx": column3,
        "cy": row3,
        "r1": r1,
        "r2": r2,
        "low": 0,
        "high": 1440,
        "title": "GPS Time",
        "units": "",
        "noDraw": true,
        "format": (value) => value
    },
    "pack_voltage": {
        "svgId": "svgId",
        "cx": column4,
        "cy": row2,
        "r1": r1,
        "r2": r2,
        "low": 70,
        "high": 110,
        "title": "Pack",
        "units": "V",
        "format": (value) => value + " V"
    },
    //"min_pack_temp": {
    "input_voltage": {
        "svgId": "svgId",
        "cx": column2,
        "cy": row3,
        "r1": r1,
        "r2": r2,
        //"low": 0,
        //"high": 100,
        //"title": "Min Pack",
        //"units": "°C",
        //"format": (value) => value + "°C"
        "low": 9,
        "high": 14,
        "title": "Aux Battery",
        "units": "V",
        "format": (value) => value + " V"
    },
    "max_pack_temp": {
        "svgId": "svgId",
        "cx": column5,
        "cy": row2,
        "r1": r1,
        "r2": r2,
        "low": 0,
        "high": 100,
        "title": "Max Pack",
        "units": "°C",
        "format": (value) => value + "°C"
    },
    "motor_temp": {
        "svgId": "svgId",
        "cx": column4,
        "cy": row3,
        "r1": r1,
        "r2": r2,
        "low": 0,
        "high": 100,
        "title": "Motor",
        "units": "°C",
        "format": (value) => value + "°C"
    },
    "max_cell_voltage": {
        "svgId": "svgId",
        "cx": column5,
        "cy": row3,
        "r1": r1,
        "r2": r2,
        "low": 2.8,
        "high": 4.2,
        "title": "Max Cell",
        "units": "V",
        "format": (value) => value + " V"
    },
}
