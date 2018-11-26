export default {
  namespaced: true,
  state: {
    deviceList: [],
    packets: [],
    isRunning: false,
    location: {
      latitude: 41.86,
      longitude: -87.64,
    },
  },
  mutations: {
    setDeviceList (state, list) {
      state.deviceList = list.slice();
    },
    setRunningStatus (state, isRunning) {
      state.isRunning = !!isRunning;
    },
    setPacketList (state, list) {
      state.packets = list.slice();
    },
    setCoordinates (state, { lat, lng }) {
      state.location.latitude = lat;
      state.location.longitude = lng;
    },
  },
  getters: {
    getPacketId: () => (packet) => [
      packet.time,
      packet.srcaddr, packet.srcport,
      packet.dstaddr, packet.dstport
    ].join('__'),
  },
  actions: {
    async getDeviceList ({ commit }) {
      const data = await fetch('http://localhost:3000/devices')
        .then(res => res.json());
      console.debug(data);
      commit('setDeviceList', data);
      return data;
    },
    async updateRunningStatus ({ commit }) {
      const data = await fetch('http://localhost:3000/isRunning')
        .then(res => res.json());
      commit('setRunningStatus', data.isRunning);
      return data.isRunning;
    },
    async getActiveDevice () {
      try {
        const data = await fetch('http://localhost:3000/device')
          .then(res => res.json());
        if (data && data.statusCode === 404) {
          throw data;
        }
        return data;
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    async startCapture ({ dispatch }, refreshRate) {
      await fetch('http://localhost:3000/startCapture');
      await dispatch('autoUpdatePacketData', refreshRate);
    },
    async stopCapture () {
      await fetch('http://localhost:3000/stopCapture');
    },
    async getPacketData ({ commit }) {
      const data = await fetch('http://localhost:3000/packets')
        .then(res => res.json());
      console.debug('packet data', data);
      commit('setPacketList', data);
      return data;
    },
    async autoUpdatePacketData ({ dispatch }, refreshRate = 500) {
      await dispatch('getPacketData');

      const isRunning = await dispatch('updateRunningStatus');
      if (isRunning) {
        setTimeout(() => dispatch('autoUpdatePacketData'), refreshRate);
      }
    },
    async changeDevice (context, ip) {
      await fetch('http://localhost:3000/device', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({ ip }),
      });
    },
  },
}
