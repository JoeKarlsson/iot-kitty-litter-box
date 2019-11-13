<p align="center">
	<img width=100% src="https://user-images.githubusercontent.com/4650739/64831323-d6fb8b00-d59a-11e9-99ef-3ff40a5a70b1.png" />

</p>

<h1 align="center">IoT Kitty Litter Box</h1></h1>
<h2 align="center">Welcome to to world of IoT (Internet of Toilets 🚽).</h2>
<h3 align="center">This is the code you will need to setup your very own internet connect kitty litter box!😻</h3>

[![deps][deps]][deps-url]
[![Maintainability][maintainability]][maintainability-url]
[![stars][stars]][stars-url]
[![pr][pr]][pr-url]
[![license][license]][license-url]
[![twitter][twitter]][twitter-url]
[![bch compliance][bchcompliance]][bchcompliance-url]
[![first-timers-only](http://img.shields.io/badge/first--timers--only-friendly-blue.svg?style=flat-square)](http://www.firsttimersonly.com/)

My favorite things in life are cats 🐈, computers 🖥 and crappy ideas 💩, so I decided to combine all three and make an IoT (Internet of Things) litter box using a Raspberry Pi and JavaScript! If you have ever wanted to get build your own IoT project, but didn’t know how to start, then this is the project for you.

Together, we will go through how I setup my IoT Litter Box from start to finish. Including how to setup Node.js on a Raspberry Pi and how to connect sensors to a Raspberry Pi and how to read the sensor inputs with Node.js.

In this demo, we will be getting our hands dirty the Raspberry Pi and Nodejs. We will be writing a simple program in Node.js to turn a LED on and off. Then we will extend this logic to build a simple piece of embedded system that can take a piece of string and emit its morse code.

## Materials and Tools

- 1 x Raspberry Pi (We used a Raspberry Pi 3 Model B for this demo)
- 1 x Breadboard
- 2 x Female to male wires
- 1 x 3D printer [Optional] It was used for printing the case where the electronics are encloused.
- 1 x PLA filament [Optional] of any color you want.
- 1 x Solder iron and wire.
- 1 x Screwdriver.
- 8 x M2x6mm Bolts.
- HX711 module This works as a load cell amplifier.
- 4 x 50kg load cell (x4). They are used to measure the weight. Four of them were used for a maximum weight of 200kg.
- 1 x Magnetic door sensor. Used to detect that the litter box is opened.
- 1 x Micro USB cable.
- 1 x Cat litter box.

## Schematics

![iot-kitty-litter-box_bb](https://user-images.githubusercontent.com/4650739/64828756-68fd9680-d58f-11e9-94e2-605d0d2efa70.png)

## Prerequisites

- Node js should be installed on your Pi - [Check out this article for tips](https://www.losant.com/blog/how-to-install-nodejs-on-raspberry-pi)
- NPM should be installed on your Pi

## Setup Your Project

Download and unpack [Bechdel Test](https://github.com/JoeKarlsson1/bechdel-test). Or alternatively checkout from source:

    git clone https://github.com/JoeKarlsson/bechdel-test
    cd bechdel-test

Next, inside the project, you need to install the project's various NPM dependencies:

    npm install

Start up Docker, and you should now be ready to spin up a development build of your new project:

    npm run start:docker

Navigate to [http://localhost:3000](http://localhost:3000)

### Pre-reqs

- Install [Node.js](https://nodejs.org/en/)
- Install [MongoDB](https://docs.mongodb.com/manual/installation/) (Create a new database called `bechdelTest` in MongoDD.)

## Setup Your Project

* Sign up for [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). We will be using MongoDB Atlas to save all of our IoT Sensor data.

   - More information about getting started with MongoDB Atlas can be found here: [https://docs.atlas.mongodb.com/getting-started/](https://docs.atlas.mongodb.com/getting-started/)

* Download and unpack [IoT Kitty Litter Box](https://github.com/JoeKarlsson/iot-kitty-litter-box.git). Or alternatively checkout from source:

```bash
git clone https://github.com/JoeKarlsson/iot-kitty-litter-box.git
cd iot-kitty-litter-box
```

* Rename `.env_example` to `.env` and add your MongoDB Atlas URI connection string.

   - Additional information on how to get this can be found here: [https://docs.atlas.mongodb.com/driver-connection/](https://docs.atlas.mongodb.com/driver-connection/).

* Run `source .env`

* Next, inside the project, you need to install the project's various NPM dependencies:

```bash
npm install
```

* Quit out of the mongo shell, and you should now be ready to spin up a development build of your new project:

```bash
npm start
```

* Navigate to [http://localhost:3000](http://localhost:3000)

## Contributing

Please read [CONTRIBUTING.md](https://github.com/JoeKarlsson/iot-kitty-litter-box/blob/develop/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

### Contributing TLDR;

1. Fork it!
1. Create your feature branch: `git checkout -b my-new-feature`
1. Commit your changes: `git commit -am 'Add some feature'`
1. Push to the branch: `git push origin my-new-feature`
1. Submit a pull request :D

### Maintainers

<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150 height="150"
        src="https://avatars.githubusercontent.com/JoeKarlsson?v=3">
        <br />
        <a href="https://github.com/JoeKarlsson">Joe Karlsson</a>
      </td>
    <tr>
  <tbody>
</table>

### License

#### [MIT](./LICENSE)

## Related Links

- [IoT Cat Litter Box (with ESP32, Arduino IDE, Thingspeak and 3D Printing)(Major inspiration)](https://www.instructables.com/id/IoT-Cat-Litter-Box-with-ESP32-Arduino-IDE-Thingspe/)

### Resources

[deps]: https://david-dm.org/JoeKarlsson/iot-kitty-litter-box/status.svg
[deps-url]: https://david-dm.org/JoeKarlsson/iot-kitty-litter-box
[maintainability]: https://api.codeclimate.com/v1/badges/99092720d0089153661f/maintainability
[maintainability-url]: https://codeclimate.com/github/JoeKarlsson/iot-kitty-litter-box/maintainability
[pr]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[pr-url]: CONTRIBUTING.md
[stars]: https://img.shields.io/github/stars/JoeKarlsson/iot-kitty-litter-box.svg?style=flat-square
[stars-url]: https://github.com/JoeKarlsson/iot-kitty-litter-box/stargazers
[license]: https://img.shields.io/github/license/JoeKarlsson/iot-kitty-litter-box.svg
[license-url]: https://github.com/JoeKarlsson/iot-kitty-litter-box/blob/develop/LICENSE
[twitter]: https://img.shields.io/twitter/url/https/github.com/JoeKarlsson/iot-kitty-litter-box.svg?style=social&style=flat-square
[twitter-url]: https://twitter.com/intent/tweet?text=Checkout_this_awesome_IoT_Litter_Box:&url=https%3A%2F%2Fgithub.com%2FJoeKarlsson%2Fiot-kitty-litter-box
[greenkeeper]: https://badges.greenkeeper.io/JoeKarlsson/iot-kitty-litter-box.svg
[greenkeeper-url]: https://greenkeeper.io/
[snyk]: https://snyk.io/test/github/joekarlsson/iot-kitty-litter-box/badge.svg
[snyk-url]: https://snyk.io/test/github/joekarlsson/iot-kitty-litter-box
[bchcompliance]: https://bettercodehub.com/edge/badge/JoeKarlsson/iot-kitty-litter-box?branch=develop
[bchcompliance-url]: https://bettercodehub.com/
