const column1 = 80; // 32 + 80;
const column2 = 240; // 32 + 80;
const column3 = 400; // 32 + 160 + 32 + 80;
const column4 = 560; // 800 - column3;
const column5 = 720; // 800 - column2;

const row1 = 80;
const row2 = 240;
const row3 = 400;

const r1 = 55;
const r2 = 65;

let config = {
    "batteryCurrent": {
        "canvasId": "canvasId",
        "cx": column1,
        "cy": row1,
        "r1": r1,
        "r2": r2,
        "low": 0,
        "high": 10,
        "title": "Battery",
        "units": "A"
    },
    "motorCurrent": {
        "canvasId": "canvasId",
        "cx": column1,
        "cy": row2,
        "r1": r1,
        "r2": r2,
        "low": 0,
        "high": 10,
        "title": "Motor",
        "units": "A"
    },
    "solarCurrent": {
        "canvasId": "canvasId",
        "cx": column1,
        "cy": row3,
        "r1": r1,
        "r2": r2,
        "low": 0,
        "high": 10,
        "title": "Solar",
        "units": "A"
    },
    "minCellVolt": {
        "canvasId": "canvasId",
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
        "canvasId": "canvasId",
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
        "canvasId": "canvasId",
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
        "canvasId": "canvasId",
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
        "canvasId": "canvasId",
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
        "canvasId": "canvasId",
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
        "canvasId": "canvasId",
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
        "canvasId": "canvasId",
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
        "canvasId": "canvasId",
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
