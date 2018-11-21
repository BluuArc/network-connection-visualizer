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
      const data = fetch('http://localhost:3000/devices')
        .then(res => res.json());
      commit('setDeviceList', data);
    },
    async getActiveDevice () {
      const data = fetch('http://localhost:3000/device')
        .then(res => res.json());

      return data;
    },
  },
}
