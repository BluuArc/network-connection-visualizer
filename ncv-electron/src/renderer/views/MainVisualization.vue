<template>
  <v-layout row wrap justify-center>
    <v-flex xs12>
      <top-toolbar/>
    </v-flex>
    <v-flex xs8>
      <network-map/>
    </v-flex>
    <v-flex xs4>
      <packet-list/>
    </v-flex>
    <v-flex xs12>
      <timeline-bar/>
    </v-flex>
  </v-layout>
</template>

<script>
// import { mapActions, mapState } from 'vuex';
import TopToolbar from '@/components/MainVisualization/TopToolbar';
import NetworkMap from '@/components/MainVisualization/NetworkMap';
import PacketList from '@/components/MainVisualization/PacketList';
import TimelineBar from '@/components/MainVisualization/TimelineBar';
export default {
  components: {
    TopToolbar,
    NetworkMap,
    PacketList,
    TimelineBar,
  },
  mounted () {
    console.debug(this);
  },
};
</script>
