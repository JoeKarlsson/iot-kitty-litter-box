const spawn = require("child_process").spawn; 
const process = spawn('python', ["./hx711py/scale.py"], {detached: true});

let currWeight = 0;
let avgWeight = 0;
let recentsWeights = [];

const getAvg = (arr) => {
    if (arr.length) {
        const sum = arr.reduce(function(a, b) { return a + b; }, 0);
        const avg = sum / arr.length;
        return avg;
    }
    return arr[0];
}

const updateAverageWeight = (currWeight) => {
    if (currWeight) {
        const maxArrLength = 10;
        if (recentsWeights.length >= maxArrLength) {
            recentsWeights.shift()
        }
        recentsWeights.push(currWeight);
        return getAvg(recentsWeights);
    }
}

// Takes stdout data from script which executed 
// with arguments and send this data to res object 
process.stdout.on('data', (data) => {
  currWeight = parseFloat(data);
  avgWeight = updateAverageWeight(currWeight);
});

process.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

process.on('close', (code, signal) => {
  console.log(`child process exited with code ${code} and signal ${signal}`);
});

module.exports = {
    currWeight,
    avgWeight,
};