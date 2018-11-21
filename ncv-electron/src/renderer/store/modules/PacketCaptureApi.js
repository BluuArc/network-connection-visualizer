export default {
  namespaced: true,
  state: {
    deviceList: [],
  },
  mutations: {
    setDeviceList (state, list) {
      state.deviceList = list.slice();
      console.debug(list);
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
    async getActiveDevice () {
      const data = await fetch('http://localhost:3000/device')
        .then(res => res.json());

      return data;
    },
  },
}
