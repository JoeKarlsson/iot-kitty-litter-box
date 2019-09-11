const { RaspiIO } = require('raspi-io');
const five = require('johnny-five');
const board = new five.Board({
    io: new RaspiIO()
});

board.on('ready', () => {
    // Create an Led on pin 7 on header P1 (GPIO4) and strobe it on/off
    const led = new five.Led('P1-13');
    led.strobe(500);
});