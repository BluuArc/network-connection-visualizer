'use strict';

const Boom = require('boom');
const express = require('express');
const app = express();
const port = 3000;

const PacketCatcher = require('./packet-catcher');

const packetCatcher = new PacketCatcher();

function sendBoom (res, boom) {
  const { statusCode, payload } = boom.output;
  res.status(statusCode).send(payload);
}

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.get('/devices', (req, res) => {
  res.send(PacketCatcher.deviceList);
});

app.route('/device')
  .get((req, res) => {
    res.send(packetCatcher.deviceInfo);
  });
// TODO: implement device picker
// .post('/device', (req, res) => {

// });

app.get('/startCapture', (req, res) => {
  try {
    console.log('starting capture');
    packetCatcher.startCapture();
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    sendBoom(res, Boom.internal('Error starting capture', err));
  }
});

app.get('/stopCapture', (req, res) => {
  if (packetCatcher.isRunning) {
    try {
      console.log('stopping capture');
      packetCatcher.stopCapture();
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      sendBoom(res, Boom.internal('Error stopping capture', err));
    }
  } else {
    sendBoom(res, Boom.badRequest('Already stopped'));
  }
});

app.get('/isRunning', (req, res) => {
  res.send({ isRunning: packetCatcher.isRunning });
});

app.get('/packets', (req, res) => {
  res.send(packetCatcher.sessionPackets);
});

app.listen(port, () => console.log(`Listening on port ${port}`));

const ip = '10.0.0.249';
packetCatcher.device = PacketCatcher.Cap.findDevice(ip);
console.warn(`using default IP [${ip}]`);
