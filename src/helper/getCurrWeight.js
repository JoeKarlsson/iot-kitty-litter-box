const spawn = require('child_process').spawn;
const handleError = require('./handleError.js');
const { cat, db } = require('../config.json');

class Scale {
	constructor(client) {
		this.collection = client.db(db.name).collection(db.collection);
		this.process = spawn('python', ['./hx711py/scale.py'], { detached: true });

		this.baseBoxWeight = null;
		this.bufferWeight = 50;

		this.currWeight = 0;
		this.avgWeight = 0;
		this.recentsWeights = [];

		this.getWeight();
	}

	get weight() {
		return this.currWeight;
	}

	getWeight() {
		// Takes stdout data from script which executed
		// with arguments and send this data to res object
		this.process.stdout.on('data', data => {
			if (!this.baseBoxWeight) {
				this.calibrate();
			}
			this.currWeight = parseFloat(data);
			this.avgWeight = this.calculateNewAvgWeight(
				this.currWeight,
				this.recentsWeights
			);
			console.log('this.avgWeight :', this.avgWeight);

			if (this.isCatPresent(this.avgWeight, this.baseBoxWeight)) {
				this.handleCatInBoxEvent();
			}
		});

		this.process.stderr.on('data', err => {
			handleError(err);
		});

		this.process.on('close', (code, signal) => {
			console.log(
				`child process exited with code ${code} and signal ${signal}`
			);
		});
	}

	calculateArrAvg(arr) {
		if (arr.length) {
			const sum = arr.reduce(function(a, b) {
				return a + b;
			}, 0);
			const avg = sum / arr.length;
			return avg;
		}
		return arr[0];
	}

	calculateNewAvgWeight(currWeight, recentsWeights) {
		if (currWeight) {
			const maxArrLength = 20;
			if (recentsWeights.length >= maxArrLength) {
				recentsWeights.shift();
			}
			recentsWeights.push(currWeight);
			return this.calculateArrAvg(recentsWeights);
		}
	}

	calibrate() {
		this.baseBoxWeight = this.avgWeight;
	}

	isCatPresent(avgWeight, baseBoxWeight) {
		if (avgWeight - this.bufferWeight > baseBoxWeight + cat.weight) {
			return true;
		}
		return false;
	}

	handleCatInBoxEvent() {}
}

module.exports = {
	Scale,
};
