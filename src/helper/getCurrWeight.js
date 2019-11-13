const spawn = require('child_process').spawn;
const handleError = require('./handleError.js');
const config = require('../config.json');

const process = spawn('python', ['./hx711py/scale.py'], { detached: true });

let baseBoxWeight = null;
const bufferWeight = 50;

let currWeight = 0;
let avgWeight = 0;
let recentsWeights = [];

const getAvg = arr => {
	if (arr.length) {
		const sum = arr.reduce(function(a, b) {
			return a + b;
		}, 0);
		const avg = sum / arr.length;
		return avg;
	}
	return arr[0];
};

const updateAverageWeight = (currWeight, recentsWeights) => {
	if (currWeight) {
		const maxArrLength = 20;
		if (recentsWeights.length >= maxArrLength) {
			recentsWeights.shift();
		}
		recentsWeights.push(currWeight);
		return getAvg(recentsWeights);
	}
};

const calibrate = () => {
	baseBoxWeight = avgWeight;
};

const checkIfCatIsPresent = (avgWeight, baseBoxWeight) => {
	if (avgWeight - bufferWeight > baseBoxWeight + config.cat.weight) {
		return true;
	}
	return false;
};

// Takes stdout data from script which executed
// with arguments and send this data to res object
process.stdout.on('data', data => {
	if (!baseBoxWeight) {
		calibrate();
	}
	currWeight = parseFloat(data);
	avgWeight = updateAverageWeight(currWeight, recentsWeights);
	console.log(avgWeight);
	const catPresent = checkIfCatIsPresent(avgWeight, baseBoxWeight);
	if (catPresent) {
	}
});

process.stderr.on('data', err => {
	handleError(err);
});

process.on('close', (code, signal) => {
	console.log(`child process exited with code ${code} and signal ${signal}`);
});

module.exports = {
	currWeight,
	avgWeight,
};
