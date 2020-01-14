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

This project will help track your feline friend's health by measuring its weight every time it sets foot on the litter tray, and monitors its urination patterns. The equipment can be connected to a companion smartphone app that displays the relevant data in an easy-to-understand graph format, so that cat parents can quickly spot symptoms of unusual weight loss.

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

Sign up for [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). We will be using MongoDB Atlas to save all of our IoT Sensor data.

- More information about getting started with MongoDB Atlas can be found here: [https://docs.atlas.mongodb.com/getting-started/](https://docs.atlas.mongodb.com/getting-started/)

Download and unpack [IoT Kitty Litter Box](https://github.com/JoeKarlsson1/iot-kitty-litter-box). Or alternatively checkout from source:

    git clone https://github.com/JoeKarlsson/iot-kitty-litter-box
    cd iot-kitty-litter-box

Next, inside the project, you need to install the project's various NPM dependencies:

    npm install

Rename `src/example_config.json` to `src/config.json` and add your MongoDB Atlas URI connection string.

You should now be ready to spin up a development build of your new project:

```bash
npm start
```

Navigate to [http://localhost:3000](http://localhost:3000).

## Auto Starting IoT Kitty Litter Box

The methods below describe ways to automatically start you IoT Kitty Litter Box on boot, and even ways to keep it running in case of a failure.

### Using PM2

PM2 is a production process manager for Node.js applications with a built-in load balancer. It allows you to keep applications alive forever, to reload them without downtime and to facilitate common system admin tasks. In this case we will use it to keep a shell script running.

#### Install PM2

Install PM2 using NPM:

```
sudo npm install -g pm2
```

#### Starting PM2 on Boot

To make sure PM2 can do it's job when (re)booting your operating system, it needs to be started on boot. Luckily, PM2 has a handy helper for this.

```
pm2 startup
```

PM2 will now show you a command you need to execute.

#### Make a IoT Kitty Litter Box start script.

To use PM2 in combination with IoT Kitty Litter Box, we need to make a simple shell script. Preferable, we put this script outside the IoT Kitty Litter Box folder to make sure it won't give us any issues if we want to upgrade the mirror.

```shell
cd ~
nano iot-kitty-litter-box.sh
```

Add the following lines:

```shell
cd ~/iot-kitty-litter-box
DISPLAY=:0 npm start
```

Save and close, using the commands `CTRL-O` and `CTRL-X`.
Now make sure the shell script is executable by performing the following command:

```shell
chmod +x iot-kitty-litter-box.sh
```

You are now ready to the IoT Kitty Litter Box using this script using PM2.

#### Starting your IoT Kitty Litter Box with PM2

Simply start your mirror with the following command:

```shell
pm2 start iot-kitty-litter-box.sh
```

You mirror should now boot up and appear on your screen after a few seconds.

#### Enable restarting of the IoT Kitty Litter Box script.

To make sure the IoT Kitty Litter Box restarts after rebooting, you need to save the current state of all scripts running via PM2. To do this, execute the following command

```shell
pm2 save
```

And that's all there is! You IoT Kitty Litter Box should now reboot after start, and restart after any failure.

#### Controlling you IoT Kitty Litter Box via PM2.

With your IoT Kitty Litter Box running via PM2, you have some handy tools at hand:

##### Restarting your IoT Kitty Litter Box

```shell
pm2 restart iot-kitty-litter-box
```

##### Stopping your IoT Kitty Litter Box

```shell
pm2 stop iot-kitty-litter-box
```

##### Show the IoT Kitty Litter Box logs

```shell
pm2 logs iot-kitty-litter-box
```

##### Show the IoT Kitty Litter Box process information

```shell
pm2 show iot-kitty-litter-box
```

## Contributing

Please read [CONTRIBUTING.md](https://github.com/JoeKarlsson/iot-kitty-litter-box/blob/develop/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

### Contributing TLDR;

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

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

#### [Apache 2.0](./LICENSE)

## Related Links

- [IoT Cat Litter Box (with ESP32, Arduino IDE, Thingspeak and 3D Printing)(Major inspiration)](https://www.instructables.com/id/IoT-Cat-Litter-Box-with-ESP32-Arduino-IDE-Thingspe/)
- [IoT Reference Architecture](https://www.mongodb.com/collateral/iot-reference-architecture)
- [Time Series Data and MongoDB: Best Practices Guide](https://www.mongodb.com/collateral/time-series-best-practices)

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
