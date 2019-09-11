const { RaspiIO } = require('raspi-io');
const five = require('johnny-five');

const board = new five.Board({
    io: new RaspiIO()
});

board.on('ready', () => {
    const sensor = new five.Sensor.Digital({
        pin: "GPIO5",
        freq: 100,
        // threshold: 5,
    });

    // sensor.on("data", (output) => {
    //     console.log("sensor", sensor.raw);
    // });

    sensor.on("change", () => {
        console.log("change", sensor.raw);
        // this.value will reflect a scaling from 0-1023 to 0-180
        // console.log(sensor.scaleTo([0, 180])); // integer
    });


    const spdt = new five.Switch("GPIO16");

    spdt.on("open", () => {
        console.log('open');
    });

    spdt.on("close", () => {
        console.log('close');
    });
});
