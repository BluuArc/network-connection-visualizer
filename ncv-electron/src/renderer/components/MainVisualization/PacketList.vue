<template>
  <v-container fluid class="pr-0 pb-1 pl-1 pt-0" grid-list-md>
    <v-layout row>
      <v-flex>
        <h1 class="headline">Packets</h1>
      </v-flex>
    </v-layout>
    <v-layout row wrap style="max-height: 500px; overflow-y: auto;">
      <v-flex xs12 v-for="(p, i) in sortedPackets" :key="i">
        <v-card>
          {{ sortedPackets[i] }}
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState('PacketCaptureApi', ['packets']),
    sortedPackets () {
      return this.packets.slice().sort((a, b) => new Date(a.time) - new Date(b.time));
    },
  },
};
</script>

<style>

</style>
