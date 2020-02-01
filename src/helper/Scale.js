const spawn = require('child_process').spawn;
const handleError = require('./handleError.js');
const insertTimeSeriesData = require('./dbHelper.js');
const { cat } = require('../config.json');

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
const throttle = function(func, wait, options) {
	var timeout, context, args, result;
	var previous = 0;
	if (!options) options = {};

	var later = function() {
		previous = options.leading === false ? 0 : new Date().getTime();
		timeout = null;
		result = func.apply(context, args);
		if (!timeout) context = args = null;
	};

	var throttled = function() {
		var now = new Date().getTime();
		if (!previous && options.leading === false) previous = now;
		var remaining = wait - (now - previous);
		context = this;
		args = arguments;
		if (remaining <= 0 || remaining > wait) {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
			previous = now;
			result = func.apply(context, args);
			if (!timeout) context = args = null;
		} else if (!timeout && options.trailing !== false) {
			timeout = setTimeout(later, remaining);
		}
		return result;
	};

	throttled.cancel = function() {
		clearTimeout(timeout);
		previous = 0;
		timeout = context = args = null;
	};

	return throttled;
};

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
		this.handleCatInBoxEvent = this.handleCatInBoxEvent.bind(this);
		this.throttledHandleCatInBoxEvent = throttle(
			this.handleCatInBoxEvent,
			500000
		);
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
				this.throttledHandleCatInBoxEvent();
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
		// wait n seconds to wait for the cat to settle before taking the weight and logging it in the DB
		setTimeout(() => {
			const catsWeight = this.calcCatsWeight();
			console.log('DB call');
			insertTimeSeriesData('cat', this.client, catsWeight);
			this.calibrate();
		}, 10000);
	}
}

module.exports = Scale;
