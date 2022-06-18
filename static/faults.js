let equals = (arr1, arr2) => {
    if (arr1.length != arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] != arr2[i]) {
            return false;
        }
    }

    return true;
};

class FaultBox {
	constructor(config) {
        this.faultContainer = document.getElementById("faultSect");

		this.errorMessages = [];

	 	this.svgns = "http://www.w3.org/2000/svg";

		this.drawBox();
        //this.drawTextBox();
		this.draw();

        this.currentIndex = 0;
        this.changed = false;
	}

	drawBox() {
		this.faultBox = document.createElementNS(this.svgns, "rect");
		this.faultBox.setAttribute('x', 0);
		this.faultBox.setAttribute('y', 0);
		this.faultBox.setAttribute('height', 480);
		this.faultBox.setAttribute('width', 160);
		this.faultContainer.appendChild(this.faultBox);
	}

	draw() {
	this.faultContainer.setAttribute('class', (this.errorMessages.length ==0) ? 'faultBox': 'faultBoxError');
	//this.errorMessages.join("\n\n");
	this.faultContainer.innerText = this.errorMessages.join("\n\n");
}
    cycleErrors() {
        if (this.changed) {
            this.currentIndex = 0;
            this.changed = false;
        } else {
            this.currentIndex += 1;
        }
        this.draw();
        console.log(this.currentIndex);
    }

    setErrors(errorMessages) {
        if (!equals(this.errorMessages, errorMessages)) {
            this.changed = true;
            clearInterval(this.intervalHandler);
            if (errorMessages.length > 12) {
                this.intervalHandler = setInterval(this.cycleErrors.bind(this), 2000);
            }
        } else {
            this.changed = false;
        }
        this.errorMessages = errorMessages;
        console.log(this.errorMessages, this.changed);
        this.draw();
    }
}
