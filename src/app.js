const path = require('path');
const { RaspiIO } = require('raspi-io');
const five = require('johnny-five');
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const { uri } = require('./config.json');
const { Scale } = require('./helper/getCurrWeight.js');
const handleError = require('./helper/handleError.js');

const app = express();

const isDeveloping = process.env.NODE_ENV !== 'production';
const PORT = isDeveloping ? 3000 : process.env.PORT;
const HOST = isDeveloping ? 'localhost' : '0.0.0.0';

const PUBLIC_PATH = path.resolve('./public');
app.use(express.static(PUBLIC_PATH));

const OPTIONS = {
	poolSize: 20,
	socketTimeoutMS: 480000,
	keepAlive: 300000,
	ssl: true,
	sslValidate: false,
};

const client = new MongoClient(uri, OPTIONS);

let state = {
	isMaintenenceMode: false,
};

const board = new five.Board({
	io: new RaspiIO(),
});

board.on('ready', () => {
	client.connect(err => {
		if (err) {
			handleError(err);
		}

		const scale = new Scale(client);

		// perform actions on the collection object
		const spdt = new five.Switch('GPIO16');

		spdt.on('open', () => {
			console.log('open');
			state.isMaintenenceMode = true;
		});

		spdt.on('close', () => {
			console.log('close');
			state.isMaintenenceMode = false;
		});
	});
});

board.on('fail', error => {
	handleError(error);
});

const onStart = err => {
	if (err) {
		handleError(err);
	}
	console.info(
		`==> 🌎 Listening on port ${PORT}. ` +
			`Open up http://${HOST}:${PORT}/ in your browser.`
	);
};

app.listen(PORT, HOST, onStart);
