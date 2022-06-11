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

    /*drawTextBox() {
        this.faultText = document.createElementNS(this.svgns, "text");
        this.faultText.setAttribute("x", 0);
        this.faultText.setAttribute("y", 0);
        this.faultText.setAttribute("height", 480);
        this.faultText.setAttribute("width", 160);
        this.faultText.setAttribute("fill", "black");
        this.faultText.setAttribute("class", "faultText");
        this.svgContainer.appendChild(this.faultText);

        this.errorSpans = []

        for (let i = 0; i < 12; i++) {
            this.errorSpans[i] = document.createElementNS(this.svgns, "tspan");
            this.errorSpans[i].setAttribute("x", 80);
            this.errorSpans[i].setAttribute("y", i * 40 + 20);
            this.errorSpans[i].setAttribute("fill", "black");
            this.errorSpans[i].setAttribute("class", "faultSpan");
            this.faultText.appendChild(this.errorSpans[i]);
        }
    }*/

	draw() {
        /*for (let i = 0; i < 12; i++) {
            this.errorSpans[i].textContent = "";
        }*/

        /*if (this.errorMessages.length != 0) {
            this.faultBox.setAttribute('class', 'faultBoxError');
            if (this.errorMessages.length <= 12) {
                for (let i = 0; i < this.errorMessages.length; i++) {
                    this.errorSpans[i] = this.errorMessages[i] + "\n\n";
                }
            } else {
                for (let i = 0; i < 12; i++) {
                    let indexToGet = (i + this.currentIndex) % this.errorMessages.length;
                    this.errorSpans[i].textContent = this.errorMessages[indexToGet] + "\n\n";
                }
            }
        } else {
            this.faultBox.setAttribute('class', 'faultBox');
        }*/
	
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
