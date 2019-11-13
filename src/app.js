const { RaspiIO } = require('raspi-io');
const five = require('johnny-five');
const app = require('express')();
const http = require('http').Server(app);
const MongoClient = require('mongodb').MongoClient;
const { avgWeight, currWeight } = require('./helper/getCurrWeight.js');
const { db } = require('./config.json');

console.log(process.env.uri);
const client = new MongoClient(process.env.uri, { useNewUrlParser: true });

let state = {
	isMaintenenceMode: false,
};

const board = new five.Board({
	io: new RaspiIO(),
});

board.on('ready', () => {
	client.connect(err => {
		const collection = client.db(db.name).collection(db.collection);

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
		client.close();
	});
});

const port = 3000;

http.listen(port, () => {
	console.log(
		`==> 🌎 Listening on port ${port}. ` +
			`Open up http://localhost:${port}/ in your browser.`
	);
});
