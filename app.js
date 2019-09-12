const { RaspiIO } = require('raspi-io');
const five = require('johnny-five');
const express = require("express");
const bodyParser = require('body-parser');

const app = express();
var http = require('http').Server(app);


app.use(bodyParser.json());

app.post('/', function (req, res) {
    const msg = req.body.msg;
    console.log("python: " + req.body.value);
    res.json({ success: true });
});

http.listen(3000, function () {
    console.log('listening...');
});

const board = new five.Board({
    io: new RaspiIO()
});

board.on('ready', () => {
    const spdt = new five.Switch("GPIO16");

    spdt.on("open", () => {
        console.log('open');
    });

    spdt.on("close", () => {
        console.log('close');
    });
});
