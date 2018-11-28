<template>
  <v-container fluid class="pr-0 pb-1 pl-1 pt-0" grid-list-md>
    <v-layout row>
      <v-flex>
        <h1 class="headline">Packets ({{ packets.length }})</h1>
      </v-flex>
    </v-layout>
    <v-layout row wrap style="max-height: 500px; overflow-y: auto;">
      <v-flex xs12 v-for="(p, i) in sortedPackets" :key="i">
        <v-card @click.native="onPacketCardClick(p)" :color="activePacket === p ? 'red' : undefined">
          <v-container fluid>
            <v-layout row>
              <v-flex>
                <h1 class="title light-blue--text" v-if="isExitPacket(p)">
                  <v-icon color="light-blue">arrow_forward_ios</v-icon>
                  Exit Packet
                </h1>
                <h1 class="title orange--text" v-else>
                  <v-icon color="orange">arrow_back_ios</v-icon>
                  Entry Packet
                </h1>
                <span>{{ new Date(p.time).toLocaleString() }}</span>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs6>
                <h3 class="subheading" style="text-transform: uppercase;" v-text="`From ${isExitPacket(p) ? 'Me' : 'Them'}`"/>
              </v-flex>
              <v-flex xs6>
                <h3 class="subheading" style="text-transform: uppercase;" v-text="`To ${!isExitPacket(p) ? 'Me' : 'Them'}`"/>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs6>
                <h2 class="subheading">
                  {{ getAddressPortString(p.srcaddr, p.srcport) }}
                </h2>
              </v-flex>
              <v-flex xs6>
                <h2 class="subheading">
                  {{ getAddressPortString(p.dstaddr, p.dstport) }}
                </h2>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs6>
                <span v-html="getLocationText(p.srcloc)"/>
              </v-flex>
              <v-flex xs6>
                <span v-html="getLocationText(p.dstloc)"/>
              </v-flex>
            </v-layout>
            <!-- {{ p }} -->
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState('PacketCaptureApi', ['packets', 'activePacket']),
    ...mapGetters('PacketCaptureApi', ['isExitPacket']),
    sortedPackets () {
      // sort by time sent by newest first
      return this.packets.slice().sort((a, b) => new Date(b.time) - new Date(a.time));
    },
  },
  methods: {
    ...mapMutations('PacketCaptureApi', ['setActivePacket']),
    getAddressPortString (address, port) {
      return `${address}:${port}`;
    },
    getLocationText (location) {
      if (!location) {
        return 'Current location';
      }

      return [
        `${location.city} ${location.country}`,
        `Lat: ${location.ll[0]}`,
        `Lng: ${location.ll[1]}`,
      ].join('<br>');
    },
    onPacketCardClick (packet) {
      if (this.activePacket !== packet) {
        this.setActivePacket(packet);
      } else {
        this.setActivePacket(null);
      }
    },
  },
};
</script>

<style>

</style>
