const spawn = require('child_process').spawn;
const handleError = require('./handleError.js');
const insertTimeSeriesData = require('./dbHelper.js');
const { cat } = require('../config.json');

class Scale {
	constructor(client) {
		this.client = client;
		this.baseBoxWeight = null;
		this.bufferWeight = 50;
		this.currWeight = 0;
		this.avgWeight = 0;
		this.recentsWeights = [];

		this.process = spawn('python', ['./hx711py/scale.py'], {
			detached: true,
		});
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
			const sum = arr.reduce((a, b) => {
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

	calcCatsWeight(avgCatWeight, baseBoxWeight) {
		return avgCatWeight - baseBoxWeight;
	}

	handleCatInBoxEvent() {
		console.info('Cat has entered the box');
		// wait n seconds to wait for the cat to settle before taking the weight and logging it in the DB
		setTimeout(() => {
			const catsWeight = this.calcCatsWeight();
			insertTimeSeriesData(catsWeight, this.client);
		}, 100);
	}
}

module.exports = Scale;
