<template>
  <v-container fluid class="pa-0">
    <v-btn flat>
      Selected IP: {{ activeIp }}
      <v-icon right>arrow_drop_down</v-icon>
    </v-btn>
    <v-btn color="success" round small>
      Start
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data () {
    return {
      activeDevice: {},
      activeIp: '',
    };
  },
  methods: {
    ...mapActions('PacketCaptureApi', ['getActiveDevice']),
  },
  async mounted () {
    const device = await this.getActiveDevice();
    this.activeDevice = device;

    const currentAddressEntry = device.addresses
      .find(entry => entry.netmask || entry.broadaddr);
    this.activeIp = currentAddressEntry && currentAddressEntry.addr;
  },
};
</script>
