class FaultBox {
	constructor(config) {
        this.svgContainer = document.getElementById(config.svgId);

		this.errorMessages = [];

	 	this.svgns = "http://www.w3.org/2000/svg";

		this.drawBox();
		this.draw();
	}

	drawBox() {
		this.faultBox = document.createElementNS(this.svgns, "rect");
		this.faultBox.setAttribute('x', 0);
		this.faultBox.setAttribute('y', 0);
		this.faultBox.setAttribute('height', 480);
		this.faultBox.setAttribute('width', 160);
		this.faultBox.setAttribute('class', 'faultBox');
		this.svgContainer.appendChild(this.faultBox);
	}

	draw() {
		//this.drawBox();
	}
}
