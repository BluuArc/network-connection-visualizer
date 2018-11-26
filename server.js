'use strict';

const Boom = require('boom');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const PacketCatcher = require('./packet-catcher');

const packetCatcher = new PacketCatcher();

function sendBoom (res, boom) {
  const { statusCode, payload } = boom.output;
  res.status(statusCode).send(payload);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
    const deviceInfo = packetCatcher.deviceInfo;
    if (!deviceInfo) {
      sendBoom(res, Boom.notFound('No device found'));
    } else {
      res.send(packetCatcher.deviceInfo);
    }
  })
  .post((req, res) => {
    const ip = req.body.ip;
    console.debug('new ip', ip);
    try {
      packetCatcher.device = PacketCatcher.Cap.findDevice(ip);
      console.log('new device', packetCatcher.deviceInfo && packetCatcher.deviceInfo.name);
      res.sendStatus(200);
    } catch(err) {
      console.error(err);
      sendBoom(res, Boom.internal('Error changing device', err));
    }
  });

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

const ip = '127.0.0.1';
packetCatcher.device = PacketCatcher.Cap.findDevice(ip);
console.warn(`using default IP [${ip}]`);
