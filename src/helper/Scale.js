const spawn = require('child_process').spawn;
const handleError = require('./handleError.js');
const insertTimeSeriesData = require('./dbHelper.js');
const { cat } = require('../config.json');

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this,
			args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

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

			this.currWeight = Math.abs(parseFloat(data));
			console.log('Weight :', this.currWeight);

			this.avgWeight = this.calculateNewAvgWeight(
				this.currWeight,
				this.recentsWeights
			);

			if (this.isCatPresent(this.avgWeight, this.baseBoxWeight)) {
				debounce(() => {
					this.handleCatInBoxEvent();
				}, 10000);
			}
		});

		this.process.stderr.on('data', err => {
			handleError(String(err));
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
		if (!this.baseBoxWeight) {
			this.baseBoxWeight = 1;
		}
		setTimeout(() => {
			this.baseBoxWeight = this.avgWeight;
		}, 10000);
	}

	isCatPresent(avgWeight, baseBoxWeight) {
		console.log('baseBoxWeight', baseBoxWeight);
		if (
			Math.abs(avgWeight - this.bufferWeight) >
			Math.abs(baseBoxWeight + parseFloat(cat.weight))
		) {
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
			console.log('DB call');
			// insertTimeSeriesData('cat', this.client, catsWeight);
			this.calibrate();
		}, 10000);
	}
}

module.exports = Scale;
