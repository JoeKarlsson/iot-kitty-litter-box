const { RaspiIO } = require('raspi-io');
const five = require('johnny-five');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const http = require('http').Server(app);

app.use(bodyParser.json());

app.post('/', (req, res) => {
  const { value } = req.body;
  console.log(`python: ${value}`);
  res.json({ success: true });
});

http.listen(3000, () => {
  console.log('listening...');
});

const board = new five.Board({
  io: new RaspiIO(),
});

board.on('ready', () => {
  const spdt = new five.Switch('GPIO16');

  spdt.on('open', () => {
    console.log('open');
  });

  spdt.on('close', () => {
    console.log('close');
  });
});
