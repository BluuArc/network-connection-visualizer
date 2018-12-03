<template>
  <v-container fluid class="pr-0 pb-1 pl-1 pt-0" grid-list-md>
    <v-layout row id="packet-list-header">
      <v-flex>
        <h1 class="headline">Packets ({{ packets.length }})</h1>
      </v-flex>
      <v-flex class="text-xs-right">
        <v-btn flat @click="showDialog = true" :disabled="isRunning">
          Import/Export
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap style="overflow-y: auto;" id="packet-list">
      <v-flex xs12 v-for="(p, i) in sortedPackets" :key="i">
        <v-card @click.native="onPacketCardClick(p)" :color="activePacket === p ? 'grey' : undefined">
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
            <v-layout row>
              <v-flex xs6>
                <a v-if="!isExitPacket(p)" @click="openPacketLink(p)">
                  WHOIS IP Link
                </a>
              </v-flex>
              <v-flex xs6>
                <a v-if="isExitPacket(p)" @click="openPacketLink(p)">
                  WHOIS IP Link
                </a>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog
      v-model="showDialog"
      width="750">
      <v-card class="packet-dialog">
        <v-container fluid class="pt-0">
          <v-tabs v-model="activeTab">
            <v-tab>
              Import
            </v-tab>
            <v-tab>
              Export
            </v-tab>
          </v-tabs>
        </v-container>

        <v-tabs-items v-model="activeTab">
          <v-tab-item>
            <v-card-text>
              <textarea v-model="inputText"/>
            </v-card-text>
            <v-divider/>
            <v-card-actions>
              <v-spacer/>
              <v-btn flat :disabled="!isParsableInput" @click="getPacketsFromInput">
                Import Packet List
              </v-btn>
            </v-card-actions>
          </v-tab-item>
          <v-tab-item>
            <v-card-text>
              <textarea
                id="export-text-area" readonly
                :value="JSON.stringify(packets, null, 2)"
                @click="selectTextArea"/>
            </v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn flat>
                Copy Packet List
              </v-btn>
            </v-card-actions>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import { shell } from 'electron';

export default {
  computed: {
    ...mapState('PacketCaptureApi', ['packets', 'activePacket', 'isRunning']),
    ...mapGetters('PacketCaptureApi', ['isExitPacket', 'getWhoIsLinkTo']),
    sortedPackets () {
      // sort by time sent by newest first
      return this.packets.slice().sort((a, b) => new Date(b.time) - new Date(a.time));
    },
    isParsableInput () {
      try {
        const input = JSON.parse(this.inputText);
        return Array.isArray(input) && input.length > 0;
      } catch (err) {
        return false;
      }
    },
  },
  data: () => ({
    showDialog: false,
    activeTab: 0,
    inputText: '',
  }),
  methods: {
    ...mapMutations('PacketCaptureApi', ['setActivePacket']),
    ...mapActions('PacketCaptureApi', ['setPacketData']),
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
    openPacketLink (p) {
      const link = this.getWhoIsLinkTo(this.isExitPacket(p) ? p.dstaddr : p.srcaddr);
      shell.openExternal(link);
    },
    selectTextArea () {
      const textArea = document.querySelector('textarea#export-text-area');
      console.debug(textArea);
      textArea.select();
    },
    getPacketsFromInput () {
      const newPackets = JSON.parse(this.inputText);
      this.setActivePacket(null);
      this.setPacketData(newPackets);
      this.showDialog = false;
      this.inputText = '';
    },
  },
};
</script>

<style>
.packet-dialog textarea {
  width: 100%;
  height: 200px;
  background: black;
}
</style>
