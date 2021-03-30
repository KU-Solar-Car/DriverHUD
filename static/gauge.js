class Gauge {
    startAngle = 3 * Math.PI / 4;
    endAngle = 1 * Math.PI / 4;

    constructor(config) {
        this.cx = config.cx;
        this.cy = config.cy;
        this.r1 = config.r1;
        this.r2 = config.r2;
        this.low = config.low;
        this.high = config.high;
        this.title = config.title;
        this.units = config.units;
		this.noDraw = config.noDraw;

        this.canvas = document.getElementById(config.canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.value = this.low;
    }

    computeAngle(value) {
        let percent = (value - this.low) / (this.high - this.low);
        if (percent < 0) {
            percent = 0;
        }
        if (percent > 1) {
            percent = 1;
        }
        return percent * (this.endAngle - this.startAngle + 2 * Math.PI) + this.startAngle;
    }

    drawBaseGauge() {
        let startPoint1 = [this.r1 * Math.cos(this.startAngle) + this.cx, this.r1 * Math.sin(this.startAngle) + this.cy];
        let startPoint2 = [this.r2 * Math.cos(this.startAngle) + this.cx, this.r2 * Math.sin(this.startAngle) + this.cy];
        let endPoint1 = [this.r1 * Math.cos(this.endAngle) + this.cx, this.r1 * Math.sin(this.endAngle) + this.cy];
        let endPoint2 = [this.r2 * Math.cos(this.endAngle) + this.cx, this.r2 * Math.sin(this.endAngle) + this.cy];

        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(this.cx, this.cy, this.r1, this.startAngle, this.endAngle, false);
        this.ctx.lineTo(endPoint2[0], endPoint2[1]);
        this.ctx.arc(this.cx, this.cy, this.r2, this.endAngle, this.startAngle, true);
        this.ctx.lineTo(startPoint1[0], startPoint1[1]);
        this.ctx.stroke();
    }

    drawFilledGauge() {
        let angle = this.computeAngle(this.value);
        let startPoint1 = [this.r1 * Math.cos(this.startAngle) + this.cx, this.r1 * Math.sin(this.startAngle) + this.cy];
        let startPoint2 = [this.r2 * Math.cos(this.startAngle) + this.cx, this.r2 * Math.sin(this.startAngle) + this.cy];
        let endPoint1 = [this.r1 * Math.cos(angle) + this.cx, this.r1 * Math.sin(angle) + this.cy];
        let endPoint2 = [this.r2 * Math.cos(angle) + this.cx, this.r2 * Math.sin(angle) + this.cy];

        this.ctx.fillStyle = '#0f0';
        this.ctx.beginPath();
        this.ctx.arc(this.cx, this.cy, this.r1, this.startAngle, angle, false);
        this.ctx.lineTo(endPoint2[0], endPoint2[1]);
        this.ctx.arc(this.cx, this.cy, this.r2, angle, this.startAngle, true);
        this.ctx.lineTo(startPoint1[0], startPoint1[1]);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawMinMax() {
        let startPoint2 = [this.r2 * Math.cos(this.startAngle) + this.cx, this.r2 * Math.sin(this.startAngle) + this.cy];
        this.ctx.beginPath();
        this.ctx.moveTo(startPoint2[0], startPoint2[1]);
        this.ctx.lineTo(startPoint2[0] - 5, startPoint2[1] + 5);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.font = this.r2 * 0.2 + 'px arial';
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'top';
        this.ctx.fillStyle = '#000';
        this.ctx.fillText(this.low, startPoint2[0] - 5, startPoint2[1] + 5);

        let endPoint2 = [this.r2 * Math.cos(this.endAngle) + this.cx, this.r2 * Math.sin(this.endAngle) + this.cy];
        this.ctx.beginPath();
        this.ctx.moveTo(endPoint2[0], endPoint2[1]);
        this.ctx.lineTo(endPoint2[0] + 5, endPoint2[1] + 5);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.font = this.r2 * 0.2 + 'px arial';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillStyle = '#000';
        this.ctx.fillText(this.high, endPoint2[0] + 5, endPoint2[1] + 5);
    }

    drawText() {
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'bottom';
        this.ctx.fillStyle = '#000';
        this.ctx.font = this.r2 * 0.25 + 'px arial';
        this.ctx.fillText(this.title, this.cx, this.cy - 10);
        this.ctx.font = this.r2 * 0.45 + 'px arial';
        this.ctx.textBaseline = 'top';
        let output = this.value + this.units;
        this.ctx.fillText(output, this.cx, this.cy);
    }

    draw() {
		if (!this.noDraw) {
			this.drawFilledGauge();
			this.drawBaseGauge();
			this.drawMinMax();
		}
        this.drawText();
    }

    setValue(newVal) {
        this.ctx.clearRect(this.cx - this.r2, this.cy - this.r2, this.r2 * 2, this.r2 * 2);
        this.value = newVal;
        this.draw();
    }
}

class TimeGauge {
    startAngle = 3 * Math.PI / 2;
    endAngle = 3 * Math.PI / 2;

    constructor(config) {
        this.cx = config.cx;
        this.cy = config.cy;
        this.r1 = config.r1;
        this.r2 = config.r2;
        this.low = config.low;
        this.high = config.high;
        this.title = config.title;
        this.units = config.units;

        this.canvas = document.getElementById(config.canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.value = this.low;
    }

    computeAngle(value) {
        let percent = (value - this.low) / (this.high - this.low);
        if (percent < 0) {
            percent = 0;
        }
        if (percent > 1) {
            percent = 1;
        }
        return percent * (this.endAngle - this.startAngle + 2 * Math.PI) + this.startAngle;
    }

    drawBaseGauge() {
        let startPoint1 = [this.r1 * Math.cos(this.startAngle) + this.cx, this.r1 * Math.sin(this.startAngle) + this.cy];
        let startPoint2 = [this.r2 * Math.cos(this.startAngle) + this.cx, this.r2 * Math.sin(this.startAngle) + this.cy];
        let endPoint1 = [this.r1 * Math.cos(this.endAngle) + this.cx, this.r1 * Math.sin(this.endAngle) + this.cy];
        let endPoint2 = [this.r2 * Math.cos(this.endAngle) + this.cx, this.r2 * Math.sin(this.endAngle) + this.cy];

        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(this.cx, this.cy, this.r1, this.startAngle, this.endAngle, false);
        this.ctx.moveTo(endPoint2[0], endPoint2[1]);
        this.ctx.arc(this.cx, this.cy, this.r2, this.endAngle, this.startAngle, true);
        this.ctx.moveTo(startPoint1[0], startPoint1[1]);
        this.ctx.stroke();
    }

    drawFilledGauge() {
        let angle = this.computeAngle(this.value);
        let startPoint1 = [this.r1 * Math.cos(this.startAngle) + this.cx, this.r1 * Math.sin(this.startAngle) + this.cy];
        let startPoint2 = [this.r2 * Math.cos(this.startAngle) + this.cx, this.r2 * Math.sin(this.startAngle) + this.cy];
        let endPoint1 = [this.r1 * Math.cos(angle) + this.cx, this.r1 * Math.sin(angle) + this.cy];
        let endPoint2 = [this.r2 * Math.cos(angle) + this.cx, this.r2 * Math.sin(angle) + this.cy];

        this.ctx.fillStyle = '#0fc';
        this.ctx.beginPath();
        this.ctx.arc(this.cx, this.cy, this.r1, this.startAngle, angle, false);
        this.ctx.lineTo(endPoint2[0], endPoint2[1]);
        this.ctx.arc(this.cx, this.cy, this.r2, angle, this.startAngle, true);
        this.ctx.lineTo(startPoint1[0], startPoint1[1]);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawMinMax() {
        let startPoint2 = [this.r2 * Math.cos(this.startAngle) + this.cx, this.r2 * Math.sin(this.startAngle) + this.cy];
        this.ctx.beginPath();
        this.ctx.moveTo(startPoint2[0], startPoint2[1]);
        this.ctx.lineTo(startPoint2[0] - 5, startPoint2[1] + 5);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.font = this.r2 * 0.2 + 'px arial';
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'top';
        this.ctx.fillStyle = '#000';
        this.ctx.fillText(this.low, startPoint2[0] - 5, startPoint2[1] + 5);

        let endPoint2 = [this.r2 * Math.cos(this.endAngle) + this.cx, this.r2 * Math.sin(this.endAngle) + this.cy];
        this.ctx.beginPath();
        this.ctx.moveTo(endPoint2[0], endPoint2[1]);
        this.ctx.lineTo(endPoint2[0] + 5, endPoint2[1] + 5);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.font = this.r2 * 0.2 + 'px arial';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillStyle = '#000';
        this.ctx.fillText(this.high, endPoint2[0] + 5, endPoint2[1] + 5);
    }

    drawText() {
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'bottom';
        this.ctx.fillStyle = '#000';
        this.ctx.font = this.r2 * 0.25 + 'px arial';
        let output = "Speed";
        this.ctx.fillText(this.title, this.cx, this.cy - 5);
        this.ctx.textBaseline = 'top';
        output = this.value + this.units;
        this.ctx.fillText(output, this.cx, this.cy + 5);
    }

    draw() {
        this.drawFilledGauge();
        this.drawBaseGauge();
        this.drawMinMax();
        this.drawText();
    }

    setValue(newVal) {
        this.ctx.clearRect(this.cx - this.r2, this.cy - this.r2, this.r2 * 2, this.r2 * 2);
        this.value = newVal;
        this.draw();
    }
}
