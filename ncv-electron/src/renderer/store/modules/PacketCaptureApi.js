export default {
  namespaced: true,
  state: {
    deviceList: [],
    packets: [],
    isRunning: false,
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
      const data = await fetch('http://localhost:3000/device')
        .then(res => res.json());

      return data;
    },
    async startCapture ({ dispatch }) {
      await fetch('http://localhost:3000/startCapture');
      await dispatch('autoUpdatePacketData');
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
    async autoUpdatePacketData ({ dispatch }) {
      await dispatch('getPacketData');

      const isRunning = await dispatch('updateRunningStatus');
      if (isRunning) {
        setTimeout(() => dispatch('autoUpdatePacketData'), 500);
      }
    },
  },
}
