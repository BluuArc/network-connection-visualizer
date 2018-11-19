'use strict';
const Cap = require('cap').Cap;
const geoip = require('geoip-lite');

// Cap setup based on https://github.com/mscdex/cap
const decoders = require('cap').decoders;
const PROTOCOL = decoders.PROTOCOL;

module.exports = class PacketCatcher {
  constructor (device = '', filter = '') {
    this._cap = new Cap();
    this._device = device;

    this._filter = '';
    this._bufSize = 10 * 1024 * 1024;
    this._buffer = Buffer.alloc(65535);

    this._linkType = '';

    this._isRunning = false;

    this._sessionPackets = [];

    this._cap.on('packet', () => {
      const packetData = this._getPacketData();
      if (this._isUsablePacket(packetData)) {
        this._sessionPackets.push(packetData);
      }
    })
  }

  static get Cap () {
    return Cap;
  }

  static get deviceList () {
    return Cap.deviceList();
  }

  set device (newDevice) {
    this._device = newDevice;
  }

  get device () {
    return this._device;
  }

  get deviceInfo () {
    return PacketCatcher.deviceList.find(v => v.name === this._device);
  }

  get isRunning () {
    return this._isRunning;
  }

  startCapture () {
    try {
      this._sessionPackets = [];
      this._linkType = this._cap.open(this._device, this._filter, this._bufSize, this._buffer);
      this._cap.setMinBytes && this._cap.setMinBytes(0);
      this._isRunning = true;
    } catch (err) {
      this._isRunning = false;
      throw err;
    }
  }

  stopCapture () {
    try {
      this._cap.close();
      this._isRunning = false;
    } catch (err) {
      this._isRunning = false;
      throw err;
    }
  }

  _getPacketData () {
    const packet = {
      time: new Date().toISOString(),
    };

    const buffer = this._buffer;
    // TODO: handle other link types
    if (this._linkType === 'ETHERNET') {
      let ret = decoders.Ethernet(buffer);
      // TODO: handle other types
      if (ret.info.type === PROTOCOL.ETHERNET.IPV4) {
        ret = decoders.IPV4(buffer, ret.offset);

        packet.srcaddr = ret.info.srcaddr;
        packet.dstaddr = ret.info.dstaddr;
        // geoip docs: https://github.com/bluesmoon/node-geoip
        packet.srcloc = geoip.lookup(packet.srcaddr);
        packet.dstloc = geoip.lookup(packet.dstaddr);

        // TODO: handle other types
        if (ret.info.protocol === PROTOCOL.IP.TCP) {
          ret = decoders.TCP(buffer, ret.offset);
          packet.srcport = ret.info.srcport;
          packet.dstport = ret.info.dstport;
        } else if (ret.info.protocol === PROTOCOL.IP.UDP) {
          ret = decoders.UDP(buffer, ret.offset);
          packet.srcport = ret.info.srcport;
          packet.dstport = ret.info.dstport;
        }
      }
    }

    return packet;
  }

  _isUsablePacket (packet = {}) {
    return !!packet.srcloc || !!packet.dstloc;
  }

  get sessionPackets () {
    return this._sessionPackets.slice();
  }
}
