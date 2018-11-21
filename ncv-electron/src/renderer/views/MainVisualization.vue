<template>
  <v-layout row wrap justify-center>
    <v-flex xs12>
      <top-toolbar @startcapture="startCapture" @stopcapture="stopCapture"/>
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
import { mapActions } from 'vuex';
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
  methods: {
    ...mapActions('PacketCaptureApi', ['startCapture', 'stopCapture']),
  },
  mounted () {
    console.debug(this);
  },
};
</script>
