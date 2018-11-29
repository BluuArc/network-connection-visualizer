<template>
  <v-layout row wrap justify-center>
    <v-flex xs12>
      <top-toolbar @startcapture="startCapture" @stopcapture="stopCapture"/>
    </v-flex>
    <v-flex xs8 class="pb-2" id="map-container">
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
    <v-flex xs4 id="packet-list-container">
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
      packets: 'packets',
    }),
  },
  methods: {
    ...mapActions('PacketCaptureApi', ['startCapture', 'stopCapture']),
    ...mapMutations('PacketCaptureApi', ['setCoordinates']),
    updateCoordinates: debounce(function () {
      this.setCoordinates({ lat: this.latitude, lng: this.longitude });
    }, 500),
    syncStateToLocalCoords () {
      this.latitude = this.mapLocation.latitude;
      this.longitude = this.mapLocation.longitude;
    },
    updateMaxHeight: debounce(function () {
      const mapContainer = this.$el.querySelector('#map-container');
      const mapContainerHeight = Array.from(mapContainer.children).reduce((acc, val) => acc + val.clientHeight, 0);
      const packetListHeight = mapContainerHeight - (this.$el.querySelector('#packet-list-header').clientHeight);

      const packetList = this.$el.querySelector('#packet-list');
      if (packetList.clientHeight !== packetListHeight) {
        packetList.style.maxHeight = `${packetListHeight}px`;
      }
    }, 500),
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
    this.updateMaxHeight();
    window.addEventListener('resize', this.updateMaxHeight);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.updateMaxHeight);
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
    packets () {
      this.updateMaxHeight();
    },
  },
};
</script>
