const svgns = "http://www.w3.org/2000/svg";

class FaultBox {
	constructor(config) {
        this.svgContainer = document.getElementById(config.svgId);

		this.errorMessages = [];

		this.cycleCurrent = 0;

		this.imgSrc = 'images/logo.png';
			if (this.errorMessages.length == 0) { 
				this.ctx.drawImage(this.img, 0, this.canvas.height - 96, 160, 96);
			}

		this.draw();
	}

	drawBox() {
		if (this.errorMessages.length != 0) { 
			this.ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
		} else {
			this.ctx.fillStyle = 'rgba(0, 255, 0, 0.4)';
		}
		this.ctx.fillRect(0, 0, 160, this.canvas.height);
		if (this.errorMessages.length == 0) { 
			this.ctx.drawImage(this.img, 0, this.canvas.height - 96, 160, 96);
		}
	}

	drawErrors() {
		if (this.errorMessages.length > 12) {
			this.intervalHandler = setInterval(this.cycleErrors.bind(this), 2000);
		}
		let i = 0;
		for (let err of this.errorMessages) {
			if (i >= 12) {
				continue;
			}

			this.ctx.textAlign = 'left';
			this.ctx.textBaseline = 'top';
			this.ctx.fillStyle = '#000';
			this.ctx.font = '20px arial';
			this.ctx.fillText(err, 10, i * 40 + 10);

			i++;
		}
	}

	cycleErrors() {
		this.ctx.clearRect(0, 0, 160, this.canvas.height);
		this.drawBox();
		for (let i = this.cycleCurrent; i < this.cycleCurrent + 12; i++) {
			this.ctx.textAlign = 'left';
			this.ctx.textBaseline = 'top';
			this.ctx.fillStyle = '#000';
			this.ctx.font = '20px arial';
			this.ctx.fillText(this.errorMessages[i % this.errorMessages.length], 10, (i - this.cycleCurrent) * 40 + 10);
		}

		this.cycleCurrent += 1;
		this.cycleCurrent = this.cycleCurrent % this.errorMessages.length;
		console.log(this.cycleCurrent);
	}

	draw() {
		clearInterval(this.intervalHandler);
		this.ctx.clearRect(0, 0, 160, this.canvas.height);
		this.drawBox();
		this.drawErrors();
	}

	setErrorMessages(errors) {
		this.errorMessages = errors;
		this.draw();
	}
}
