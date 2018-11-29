<template>
  <svg
    width="800" height="375"
    class="network-map"
    :viewBox="`0 0 ${viewBoxDimensions.join(' ')}`"
    style="width: 100%; height: auto;"/>
</template>

<script>
/* global d3 */
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState('PacketCaptureApi', ['packets']),
    ...mapState('PacketCaptureApi', {
      mapLocation: 'location',
    }),
    ...mapGetters('PacketCaptureApi', ['getPacketId']),
    viewBoxDimensions: () => [1920, 960],
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
        .attr('id', this.getPacketId)
        .attr('fill', p => p.srcloc ? 'red' : 'blue') // red = them to me, blue = me to them
        .attr('cx', p => this.projection((p.srcloc || p.dstloc).ll.slice().reverse())[0])
        .attr('cy', p => this.projection((p.srcloc || p.dstloc).ll.slice().reverse())[1]);

      packetPoints
        .enter().append('circle')
        .classed('packet-point', true)
        .attr('id', this.getPacketId)
        .attr('fill', p => p.srcloc ? 'red' : 'blue') // red = them to me, blue = me to them
        .attr('r', 5)
        .attr('cx', p => this.projection((p.srcloc || p.dstloc).ll.slice().reverse())[0]) // packet has [lat,lng], so convert to [lng]
        .attr('cy', p => this.projection((p.srcloc || p.dstloc).ll.slice().reverse())[1]);

      packetPoints.exit().remove();
    },
    drawPacketPaths () {
      const packetPaths = this.svg.selectAll('.packet-path').data(this.packets);

      // path code based on http://www.tnoda.com/blog/2014-04-02
      const myLocation = [this.mapLocation.longitude, this.mapLocation.latitude];
      const generatePath = (p) => {
        let coordinates;
        if (p.dstloc) { // from me to them
          coordinates = [
            myLocation,
            p.dstloc.ll.slice().reverse(),
          ];
        } else {
          coordinates = [
            p.srcloc.ll.slice().reverse(),
            myLocation,
          ];
        }
        return this.path({
          type: 'LineString',
          coordinates,
        });
      };

      packetPaths
        .attr('id', this.getPacketId)
        .attr('d', generatePath);

      packetPaths
        .enter().append('path')
        .classed('route', true)
        .classed('exit-route', p => !!p.dstloc)
        .classed('enter-route', p => !!p.srcloc)
        .attr('id', this.getPacketId)
        .attr('d', generatePath);

      packetPaths.exit().remove();
    }
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
        this.drawPacketPaths();
      }
    },
    readyForPackets (newValue) {
      if (newValue && this.packets.length > 0) {
        this.drawPackets();
        this.drawPacketPaths();
      }
    }
  },
};
</script>

<style>
svg.network-map {
  border: 1px solid white;

}
svg.network-map path.route {
  fill: transparent;
}

svg.network-map path.route.exit-route {
  stroke: cornflowerblue;
}

svg.network-map path.route.enter-route {
  stroke: orange;
}
</style>
