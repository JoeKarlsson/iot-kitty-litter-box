const { RaspiIO } = require('raspi-io');
const five = require('johnny-five');
const app = require('express')();
const http = require('http').Server(app);
const { avgWeight, currWeight } = require("./helper/getCurrWeight.js");

let state = {
  isMaintenenceMode: false,
};

const board = new five.Board({
  io: new RaspiIO(),
});

board.on('ready', () => {
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

http.listen(3000, () => {
  console.log('listening...');
});
