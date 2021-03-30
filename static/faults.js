class FaultBox {
	constructor(config) {
        this.canvas = document.getElementById(config.canvasId);
        this.ctx = this.canvas.getContext('2d');

		this.errorMessages = [];
	}

	drawBox() {
		if (this.errorMessages.length != 0) { 
			this.ctx.fillStyle = 'rgba(255, 0, 0, 0)';
		} else {
		this.ctx.fillStyle = 'rgba(0, 0, 0, 0)';
		}
		this.ctx.fillRect(160, 0, 480, 160);
	}

	drawErrors() {
		let i = 0;
		let rowX = [160, 400];
		let rowY = [0, 40, 80, 120];
		for (let err of this.errorMessages) {
			if (i >= 8) {
				continue;
			}

			let coords = {
				"x": rowX[i % 2],
				"y": rowY[Math.floor(i / 2)]
			};

			this.ctx.textAlign = 'center';
			this.ctx.textBaseline = 'top';
			this.ctx.fillStyle = '#f00';
			this.ctx.font = '20px arial';
			this.ctx.fillText(err, coords.x + 130, coords.y + 10);

			console.log(err,i, coords);

			i++;
		}
	}

	draw() {
		this.ctx.clearRect(160, 0, 480, 160);
		this.drawBox();
		this.drawErrors();
	}

	setErrorMessages(errors) {
		this.errorMessages = errors;
		this.draw();
	}
}
