# network-connection-visualizer

## Description

Made as the final project for my ART151 class (Intro to Creative Coding), the Network Connection Visualizer (NCV) is an network monitoring application.

More specifically, it is a visualization system that monitors the packets entering and leaving your network card and displays them using a map, a line chart, and an annotated listing of the packets.

The packet information that is stored only locally includes:

* time packet was processed
* Source and destination IPs and ports
* Locations of source and destination IPs (where applicable) based on results from `geoip-lite`

## Tech Stack
* Backend server (hosted locally)
  * Express JS - server framework to host data for a frontend to query
    * Boom - error handling
    * body-parser - POST handling  
  * [Cap](https://github.com/mscdex/cap) - capture and process packets from a specified device
  * [geoip-lite](https://github.com/bluesmoon/node-geoip) - basic geolocation using IP addresses
* Frontend
  * Electron
  * Vue
  * Vuetify
  * Greenlet - offloading some calculations to workers
  * d3 - very helpful in creating SVG visualizations
* **Note:** to my understanding, the processing of packets is done entirely locally and not sent anywhere beyond the electron frontend, which uses the packet information to populate the visualizations

## How to setup

* clone the repo and `cd` into the directory
* run `npm install` in the root of the repo
* run `npm install` in the `ncv-electron` folder

## How to run (Dev only)

* in one terminal, run `npm run start` from the root of the repo to start the server
* in another separate terminal, run `npm run dev` in the `ncv-electron` folder to start up electron

## Other Notes

* This is made as a proof of concept and isn't fully stable.
* The `example-data.json` is an example capture data set that can be used in the import function of the frontend application
