<template>
  <v-container fluid class="pa-0">
    <v-layout align-center>
      <v-flex>
        <v-select
          :items="addresses"
          v-model="activeIp"
          label="Selected IP"/>
      </v-flex>
      <v-flex>
        <v-btn :disabled="!activeIp" color="success" round small>
          Start
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data () {
    return {
      activeDevice: {},
      activeIp: '',
      addresses: [],
    };
  },
  methods: {
    ...mapActions('PacketCaptureApi', ['getActiveDevice', 'getDeviceList']),
    async initializeDeviceList () {
      let deviceList = await this.getDeviceList();
      const activeDevice = await this.getActiveDevice();
      const currentAddressEntry = activeDevice.addresses
        .find(entry => entry.netmask || entry.broadaddr);

      this.addresses = deviceList
        .filter(d => d.addresses && d.addresses.some(a => a.netmask || a.broadaddr))
        .map(d => d.addresses.find(a => a.netmask || a.broadaddr).addr);
      this.activeIp = currentAddressEntry && currentAddressEntry.addr;
    },
  },
  async mounted () {
    await this.initializeDeviceList();
  },
  watch: {
    activeIp (newValue, oldValue) {
      console.debug('changed ip', oldValue, newValue);
    },
  },
};
</script>
