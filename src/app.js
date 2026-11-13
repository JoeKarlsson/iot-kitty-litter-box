const { RaspiIO } = require('raspi-io');
const five = require('johnny-five');
const { MongoClient } = require('mongodb');
const { uri } = require('./config.json');
const insertTimeSeriesData = require('./helper/dbHelper.js');
const Scale = require('./helper/Scale.js');

const handleError = require('./helper/handleError.js');

const OPTIONS = {
	maxPoolSize: 20,
	socketTimeoutMS: 480000,
};

const client = new MongoClient(uri, OPTIONS);

const board = new five.Board({
	io: new RaspiIO(),
});

board.on('ready', async () => {
	try {
		await client.connect();
	} catch (err) {
		handleError(err);
		return;
	}

	console.log('==> 🌎 Connected correctly to MongoDB Atlas');

	const scale = new Scale(client);

	// perform actions on the collection object
	const spdt = new five.Switch('GPIO16');

	spdt.on('open', () => {
		console.log('open');
		insertTimeSeriesData('maintenance', client);
	});

	spdt.on('close', () => {
		console.log('close');
		//When the box has been closed again, wait 1 min for the box to settle and recalibrate a new base weight
		scale.calibrate();
	});
});

board.on('fail', error => {
	handleError(error);
});
