export default {
  state: {
    deviceList: [],
  },
  mutations: {
    setDeviceList (state, list) {
      state.deviceList = list.slice();
    },
  },
  actions: {
    getDeviceList ({ commit }) {
      // fetch()
    }
  },
}
