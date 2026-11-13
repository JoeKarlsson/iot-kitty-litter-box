# IoT Kitty Litter Box

[![license][license]][license-url]

![Clips of the IoT Kitty Litter Box from 2019: the finished wooden cabinet on angled legs, my black cat sitting on top of it, me fitting the side panel with the wiring, a laptop printing load cell readings as weight is pressed onto the plate, and my cat chewing on the load cells and breadboard](.github/readme/2019-clips.gif)

My favorite things in life are cats, computers and crappy ideas, so I built an
internet-connected litter box. Every time my cat steps in, the box weighs him,
so I can follow his health over time without doing a thing. It sits right on the
border between completely ridiculous and kinda genius.

[Read the full statement](https://www.joekarlsson.com/work/iot-kitty-litter-box/)

## Hardware

- Raspberry Pi (I used a 3 Model B), breadboard and female-to-male wires
- HX711 load cell amplifier (DT on GPIO 5, SCK on GPIO 6) and 4 x 50kg load cells
- Magnetic door sensor, wired to `GPIO16`, so the box knows when the lid is off
- A litter box, and optionally a 3D-printed case for the electronics

![Wiring diagram: the HX711's VCC goes to Pi pin 2 (5V), GND to pin 6, DT to pin 29 (GPIO 5) and SCK to pin 31 (GPIO 6); the red signal wires of the upper left, lower left, upper right and lower right load cells go to the HX711's E-, A+, A- and E+ pins; and a reed switch connects to the Pi's GPIO header](https://user-images.githubusercontent.com/4650739/64828756-68fd9680-d58f-11e9-94e2-605d0d2efa70.png)

## Quick start

On the Pi you need Node.js, npm and Python 3, plus a
[MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster. Use the 32-bit
Raspberry Pi OS: `raspi-io`'s GPIO packages only install on 32-bit ARM.

```bash
git clone https://github.com/JoeKarlsson/iot-kitty-litter-box.git
cd iot-kitty-litter-box
npm install
npm run setup             # installs the Python HX711 library in hx711py/
cp src/example_config.json src/config.json
npm start                 # runs src/app.js with sudo for GPIO access
```

Put your Atlas connection string in `uri` in `src/config.json`, along with
your cat's name and weight and the database and collection to write to.

`hx711py/` is a git submodule pointer with no `.gitmodules` entry, so a fresh
clone gets an empty folder. Put an HX711 Python library there with a
`scale.py` that prints one weight reading per line; `src/helper/Scale.js` runs
it and reads its output.

To start it on boot, install PM2 (`sudo npm install -g pm2`) and run
`pm2 startup`. Then make a script outside the repo, `~/iot-kitty-litter-box.sh`,
containing `cd ~/iot-kitty-litter-box && npm start`, `chmod +x` it, and run
`pm2 start iot-kitty-litter-box.sh` and `pm2 save`.

## Development

```bash
npm run start:dev    # restart on changes with nodemon
npm run lint         # ESLint on src/ and remark on the markdown
```

The scale keeps a running average of the last 20 readings. When it passes the
empty box plus the cat's weight from the config, it waits 10 seconds for the
cat to settle, logs the weight and recalibrates. Opening the lid logs a
cleaning, and closing it recalibrates. That logic is in `src/helper/Scale.js`,
and the MongoDB writes are in `src/helper/dbHelper.js`.

## Credits

Inspired by the Instructables
[IoT Cat Litter Box (with ESP32, Arduino IDE, Thingspeak and 3D Printing)](https://www.instructables.com/id/IoT-Cat-Litter-Box-with-ESP32-Arduino-IDE-Thingspe/).

## License

Apache 2.0. See [LICENSE](LICENSE).

[license]: https://img.shields.io/github/license/JoeKarlsson/iot-kitty-litter-box.svg
[license-url]: LICENSE
