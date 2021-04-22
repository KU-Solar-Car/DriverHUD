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
    "batteryCurrent": {
        "svgId": "svgId",
        "cx": column2,
        "cy": row1,
        "r1": r1,
        "r2": r2,
        "low": 0,
        "high": 10,
        "title": "Battery",
        "units": "A"
    },
    "motorCurrent": {
        "svgId": "svgId",
        "cx": column3,
        "cy": row1,
        "r1": r1,
        "r2": r2,
        "low": 0,
        "high": 10,
        "title": "Motor",
        "units": "A"
    },
    "solarCurrent": {
        "svgId": "svgId",
        "cx": column4,
        "cy": row1,
        "r1": r1,
        "r2": r2,
        "low": 0,
        "high": 10,
        "title": "Solar",
        "units": "A"
    },
    "minCellVolt": {
        "svgId": "svgId",
        "cx": column5,
        "cy": row1,
        "r1": r1,
        "r2": r2,
        "low": 2.8,
        "high": 4.2,
        "title": "Min Cell",
        "units": "V"
    },
    "soc": {
        "svgId": "svgId",
        "cx": column2,
        "cy": row2,
        "r1": r1,
        "r2": r2,
        "low": 0,
        "high": 100,
        "title": "SOC",
        "units": "%"
    },
    "speed": {
        "svgId": "svgId",
        "cx": column3,
        "cy": row2,
        "r1": r1,
        "r2": r2,
        "low": 0,
        "high": 60,
        "title": "Speed",
        "units": "mph"
    },
    "time": {
        "svgId": "svgId",
        "cx": column3,
        "cy": row3,
        "r1": r1,
        "r2": r2,
        "low": 0,
        "high": 1440,
        "title": "Time",
        "units": "",
        "noDraw": true
    },
    "packVolt": {
        "svgId": "svgId",
        "cx": column4,
        "cy": row2,
        "r1": r1,
        "r2": r2,
        "low": 70,
        "high": 110,
        "title": "Pack",
        "units": "V"
    },
    "minPackTemp": {
        "svgId": "svgId",
        "cx": column2,
        "cy": row3,
        "r1": r1,
        "r2": r2,
        "low": 0,
        "high": 100,
        "title": "Min Pack",
        "units": "°C"
    },
    "maxPackTemp": {
        "svgId": "svgId",
        "cx": column5,
        "cy": row2,
        "r1": r1,
        "r2": r2,
        "low": 0,
        "high": 100,
        "title": "Max Pack",
        "units": "°C"
    },
    "motorTemp": {
        "svgId": "svgId",
        "cx": column4,
        "cy": row3,
        "r1": r1,
        "r2": r2,
        "low": 0,
        "high": 100,
        "title": "Motor",
        "units": "°C"
    },
    "maxCellVolt": {
        "svgId": "svgId",
        "cx": column5,
        "cy": row3,
        "r1": r1,
        "r2": r2,
        "low": 2.8,
        "high": 4.2,
        "title": "Max Cell",
        "units": "V"
    },
}
