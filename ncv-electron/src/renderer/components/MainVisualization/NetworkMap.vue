<template>
  <svg
    width="800" height="480"
    :viewBox="`0 0 ${viewBoxDimensions.join(' ')}`"
    style="width: 100%;"/>
</template>

<script>
/* global d3 */
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('PacketCaptureApi', ['packets']),
    ...mapState('PacketCaptureApi', {
      mapLocation: 'location',
    }),
    viewBoxDimensions: () => [1920, 1080],
  },
  data () {
    return {
      svg: null,
      projection: null,
      path: null,
      readyForPackets: false,
    };
  },
  async mounted () {
    this.svg = d3.select(this.$el);
    await this.drawMap();
    this.readyForPackets = true;
    this.drawCurrentLocation();
  },
  methods: {
    async drawMap () {
      const world = await fetch('http://enjalot.github.io/wwsd/data/world/world-110m.geojson').then(response => response.json());

      const [width, height] = this.viewBoxDimensions;

      // setup based on https://beta.observablehq.com/@mbostock/equal-earth-projection
      this.projection = d3.geoEqualEarth()
        .translate([width / 2, height / 2])
        .fitExtent([[1, 1], [width - 1, height - 1]], world)
        .precision(0.1)
      this.path = d3.geoPath().projection(this.projection);

      this.svg.append('path')
        .attr('id', 'world-map')
        .attr('d', this.path(world))
        .attr('fill', 'lightgray')
        .attr('stroke', 'white');
    },
    async drawCurrentLocation () {
      console.debug('drawing new location', this.mapLocation);
      const yourLocation = this.svg.selectAll('#current-location').data([this.mapLocation]);

      yourLocation
        .attr('cx', point => this.projection([point.longitude, point.latitude])[0])
        .attr('cy', point => this.projection([point.longitude, point.latitude])[1])

      yourLocation.enter()
        .append('circle')
        .attr('fill', 'purple')
        .attr('id', 'current-location')
        .attr('r', 5)
        .attr('cx', point => this.projection([point.longitude, point.latitude])[0])
        .attr('cy', point => this.projection([point.longitude, point.latitude])[1])

      yourLocation.exit().remove();
    },
    drawPackets () {
      const packetPoints = this.svg.selectAll('.packet-point').data(this.packets);

      packetPoints
        .attr('fill', p => p.srcloc ? 'red' : 'blue') // red = them to me, blue = me to them
        .attr('cx', p => this.projection((p.srcloc || p.dstloc).ll.slice().reverse())[0])
        .attr('cy', p => this.projection((p.srcloc || p.dstloc).ll.slice().reverse())[1]);

      packetPoints
        .enter().append('circle')
        .classed('packet-point', true)
        .attr('fill', p => p.srcloc ? 'red' : 'blue') // red = them to me, blue = me to them
        .attr('r', 5)
        .attr('cx', p => this.projection((p.srcloc || p.dstloc).ll.slice().reverse())[0])
        .attr('cy', p => this.projection((p.srcloc || p.dstloc).ll.slice().reverse())[1]);

      packetPoints.exit().remove();
    },
  },
  watch: {
    mapLocation: {
      deep: true,
      handler () {
        this.drawCurrentLocation();
      },
    },
    packets () {
      if (this.readyForPackets) {
        this.drawPackets();
      }
    },
  },
};
</script>

<style scoped>
svg {
  border: 1px solid white;
}
</style>
