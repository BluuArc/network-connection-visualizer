<template>
  <v-layout row wrap justify-center>
    <v-flex xs12>
      <top-toolbar @startcapture="startCapture" @stopcapture="stopCapture"/>
    </v-flex>
    <v-flex xs8 class="pb-2">
      <network-map class="d-block"/>
      <v-layout align-center>
        <v-flex>
          <v-text-field
            label="Your Latitude"
            hide-details
            v-model="latitude"/>
        </v-flex>
        <v-spacer/>
        <v-flex>
          <v-text-field
            label="Your Longitude"
            hide-details
            v-model="longitude"/>
        </v-flex>
      </v-layout>
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
import { mapActions, mapState, mapMutations } from 'vuex';
import TopToolbar from '@/components/MainVisualization/TopToolbar';
import NetworkMap from '@/components/MainVisualization/NetworkMap';
import PacketList from '@/components/MainVisualization/PacketList';
import TimelineBar from '@/components/MainVisualization/TimelineBar';
import debounce from 'lodash/debounce';
export default {
  components: {
    TopToolbar,
    NetworkMap,
    PacketList,
    TimelineBar,
  },
  computed: {
    ...mapState('PacketCaptureApi', {
      mapLocation: 'location',
    }),
  },
  methods: {
    ...mapActions('PacketCaptureApi', ['startCapture', 'stopCapture']),
    ...mapMutations('PacketCaptureApi', ['setCoordinates']),
    updateCoordinates: debounce(function () {
      console.debug('updating coordinates');
      this.setCoordinates({ lat: this.latitude, lng: this.longitude });
    }, 500),
    syncStateToLocalCoords () {
      this.latitude = this.mapLocation.latitude;
      this.longitude = this.mapLocation.longitude;
    },
  },
  data () {
    return {
      latitude: 0,
      longitude: 0,
    };
  },
  mounted () {
    console.debug(this);
    this.syncStateToLocalCoords();
  },
  watch: {
    mapLocation: {
      deep: true,
      handler () {
        this.syncStateToLocalCoords();
      },
    },
    latitude () {
      this.updateCoordinates();
    },
    longitude () {
      this.updateCoordinates();
    },
  },
};
</script>
