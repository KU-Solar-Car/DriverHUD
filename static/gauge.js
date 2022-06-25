
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
        //this.units = config.units;
        this.format = config.format;
		this.noDraw = config.noDraw;

		this.svgns = "http://www.w3.org/2000/svg";
        let averageR = (this.r1 + this.r2) / 2;
        this.circumference = 2 * Math.PI * averageR;

        //this.value = this.low;
        this.svgContainer = document.getElementById(config.svgId);

        this.createElements();
        this.draw();
    }

    createElements() {
        let start = [this.r2 * Math.cos(this.startAngle) + this.cx, this.r2 * Math.sin(this.startAngle) + this.cy];
        let end = [this.r2 * Math.cos(this.endAngle) + this.cx, this.r2 * Math.sin(this.endAngle) + this.cy];

		if (!this.noDraw) {
			this.gaugeFill = document.createElementNS(this.svgns, "circle");
			this.gaugeFill.setAttribute('cx', this.cx);
			this.gaugeFill.setAttribute('cy', this.cy);
			this.gaugeFill.setAttribute('r', (this.r1 + this.r2) / 2);
			this.gaugeFill.setAttribute('stroke', '#0f0');
			this.gaugeFill.setAttribute('stroke-width', `${(this.r2 - this.r1)}px`);
			this.gaugeFill.setAttribute('stroke-dashoffset', `${this.circumference / 4}px`);
			this.gaugeFill.setAttribute('stroke-dasharray', `${this.circumference}px`);
			this.gaugeFill.setAttribute('transform-origin', `${this.cx}px ${this.cy}px`);
			this.gaugeFill.setAttribute('fill', 'transparent');
			this.gaugeFill.setAttribute('class', 'gaugePath');
			this.svgContainer.appendChild(this.gaugeFill);

			this.gaugeBorder = document.createElementNS(this.svgns, "path");
			this.gaugeBorder.setAttribute('stroke', 'black');
			this.gaugeBorder.setAttribute('fill', 'transparent');
			this.svgContainer.appendChild(this.gaugeBorder);
		}

        this.valueText = document.createElementNS(this.svgns, "text");
        this.valueText.setAttribute('x', this.cx);
        this.valueText.setAttribute('y', this.cy);
        this.valueText.setAttribute('fill', 'black');
        this.valueText.setAttribute('class', 'valueText');
        this.svgContainer.appendChild(this.valueText);

        this.labelSpan = document.createElementNS(this.svgns, "tspan");
        this.labelSpan.setAttribute('x', this.cx);
        this.labelSpan.setAttribute('y', this.cy - 5);
        this.labelSpan.setAttribute('fill', 'black');
        this.labelSpan.setAttribute('class', 'labelSpan');
        this.labelSpan.setAttribute('dominant-baseline', 'auto');
        this.valueText.appendChild(this.labelSpan);

        this.valueSpan = document.createElementNS(this.svgns, "tspan");
        this.valueSpan.setAttribute('x', this.cx);
        this.valueSpan.setAttribute('y', this.cy + 5);
        this.valueSpan.setAttribute('fill', 'black');
        this.valueSpan.setAttribute('class', 'valueSpan');
        this.valueSpan.setAttribute('dominant-baseline', 'hanging');
        this.valueSpan.textContent = "--";
        this.valueText.appendChild(this.valueSpan);

		if (!this.noDraw) {
			this.minText = document.createElementNS(this.svgns, "text");
			this.minText.setAttribute('x', start[0] - 5);
			this.minText.setAttribute('y', start[1] + 5);
			this.minText.setAttribute('fill', 'black');
			this.minText.setAttribute('class', 'minText');
			this.minText.setAttribute('dominant-baseline', 'hanging');
			this.svgContainer.appendChild(this.minText);

			this.maxText = document.createElementNS(this.svgns, "text");
			this.maxText.setAttribute('x', end[0] + 5);
			this.maxText.setAttribute('y', end[1] + 5);
			this.maxText.setAttribute('fill', 'black');
			this.maxText.setAttribute('class', 'maxText');
			this.maxText.setAttribute('dominant-baseline', 'hanging');
			this.svgContainer.appendChild(this.maxText);
		}
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

    computePercent(value) {
        let percent = (value - this.low) / (this.high - this.low);
        if (percent < 0) {
            percent = 0;
        }
        if (percent > 1) {
            percent = 1;
        }
        return percent;
    }

    drawBaseGauge() {
        let start1 = [this.r1 * Math.cos(this.startAngle) + this.cx, this.r1 * Math.sin(this.startAngle) + this.cy];
        let start2 = [this.r2 * Math.cos(this.startAngle) + this.cx, this.r2 * Math.sin(this.startAngle) + this.cy];
        let end1 = [this.r1 * Math.cos(this.endAngle) + this.cx, this.r1 * Math.sin(this.endAngle) + this.cy];
        let end2 = [this.r2 * Math.cos(this.endAngle) + this.cx, this.r2 * Math.sin(this.endAngle) + this.cy];

        let svgString = `M ${start1[0]} ${start1[1]} A ${this.r1} ${this.r1} 0 1 1 ${end1[0]} ${end1[1]} L ${end2[0] + 5} ${end2[1] + 5}
                         M ${end2[0]} ${end2[1]} A ${this.r2} ${this.r2} 0 1 0 ${start2[0]} ${start2[1]}
                         L ${start2[0] - 5} ${start2[1] + 5} L ${start1[0]} ${start1[1]}`;

        this.gaugeBorder.setAttribute('d', svgString);
    }

    getPath(value) {
        let angle = this.computeAngle(value);
        let start1 = [this.r1 * Math.cos(this.startAngle) + this.cx, this.r1 * Math.sin(this.startAngle) + this.cy];
        let start2 = [this.r2 * Math.cos(this.startAngle) + this.cx, this.r2 * Math.sin(this.startAngle) + this.cy];
        let end1 = [this.r1 * Math.cos(angle) + this.cx, this.r1 * Math.sin(angle) + this.cy];
        let end2 = [this.r2 * Math.cos(angle) + this.cx, this.r2 * Math.sin(angle) + this.cy];
        let startMiddle = [(start1[0] + start2[0]) / 2, (start1[1] + start2[1]) / 2];
        let endMiddle = [(end1[0] + end2[0]) / 2, (end1[1] + end2[1]) / 2];
        let r = (this.r1 + this.r2) / 2;
        let sweep = 0;
        if (angle > this.startAngle + Math.PI) {
            sweep = 1;
        }

        let svgString = `M ${startMiddle[0]} ${startMiddle[1]} A ${r} ${r} 0 ${sweep} 1 ${endMiddle[0]} ${endMiddle[1]}`;

        return svgString;
    }

    drawFilledGauge() {
        if(this.value != undefined)
        {
            let percent = this.computePercent(this.value);
            let offset = (1 - percent) * (this.circumference * 3 / 4) + (this.circumference / 4);
            this.gaugeFill.setAttribute('stroke-dashoffset', offset + 'px');
            this.gaugeFill.setAttribute('stroke', '#0f0');
        }
        else
        {
            //this.gaugeFill.setAttribute('stroke-dashoffset',  (this.circumference / 4) + 'px');
            this.gaugeFill.setAttribute('stroke', '#f00');
        }
    }

    drawText() {
        this.labelSpan.textContent = this.title;
        //this.valueSpan.textContent = this.value + this.units;
        if(this.value == undefined)
        {
            //this.valueSpan.textContent = "--"
        }
        else
        {
            this.valueSpan.textContent = this.format(this.value);
        }
    }

	drawMinMax() {
        this.minText.textContent = this.low;
        this.maxText.textContent = this.high;
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
        this.value = newVal;
		if (!this.noDraw) {
			this.drawFilledGauge();
			this.drawMinMax();
		}
        this.drawText();
    }
}
