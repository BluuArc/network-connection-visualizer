<template>
  <svg
    width="1500" height="250"
    class="packet-timeline"
    :viewBox="`0 0 ${viewBoxDimensions.join(' ')}`"
    style="width: 100%;"/>
</template>

<script>
import { mapState } from 'vuex';
/* global d3 */
export default {
  computed: {
    ...mapState('PacketCaptureApi', ['packetsByTime', 'activePacket']),
    viewBoxDimensions: () => [1500, 250],
    margins: () => ({ top: 30, right: 20, bottom: 30, left: 50 }),
    offsetDimensions () {
      const [width, height] = this.viewBoxDimensions;
      const margins = this.margins;
      return [
        width - margins.left - margins.right,
        height - margins.top - margins.bottom,
      ];
    },
  },
  data () {
    return {
      svg: null,
      readyForPackets: false,
      scale: {
        x: null,
        y: null,
      },
      line: null,
      graphGroup: null,
    };
  },
  mounted () {
    this.svg = d3.select(this.$el);
    this.initializeGraph();
    this.drawOverlay();
    this.readyForPackets = true;
    console.debug('timeline loaded');
  },
  methods: {
    initializeGraph () {
      const [offsetWidth, offsetHeight] = this.offsetDimensions;

      this.scale.x = d3.scaleTime().range([0, offsetWidth]);
      this.scale.y = d3.scaleLinear().range([offsetHeight, 0]);

      this.line = d3.line()
        .x((p, i) => this.scale.x(new Date(p.time)))
        .curve(d3.curveMonotoneX);

      this.graphGroup = this.svg.append('g')
        .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`);
    },
    updateScales () {
      this.scale.x.domain(d3.extent(this.packetsByTime.map(p => new Date(p.time))));
      console.debug(this.scale.x.domain());
      this.scale.y.domain([0, d3.max(this.packetsByTime.map(p => Math.max(p.count.in, p.count.out)))]);
    },
    drawOverlay () {
      // eslint-disable-next-line no-unused-vars
      const [offsetWidth, offsetHeight] = this.offsetDimensions;
      let xAxis = this.graphGroup.selectAll('#x-axis');
      if (xAxis.empty()) {
        xAxis = this.graphGroup.append('g')
          .attr('id', 'x-axis')
          .attr('transform', `translate(0, ${offsetHeight})`);
      }
      xAxis.call(d3.axisBottom(this.scale.x));

      let yAxis = this.graphGroup.selectAll('#y-axis');
      if (yAxis.empty()) {
        yAxis = this.graphGroup.append('g')
          .attr('id', 'y-axis');
      }
      yAxis.call(d3.axisLeft(this.scale.y));
    },
    drawLines () {
      const inLineFn = this.line.y(p => this.scale.y(p.count.in));
      let inLine = this.graphGroup.selectAll('path#in-line');
      if (inLine.empty()) {
        inLine = this.graphGroup.append('path')
          .attr('id', 'in-line')
          .style('stroke', 'orange')
          .style('fill', 'none');
      }
      inLine.datum(this.packetsByTime)
        .attr('d', inLineFn);

      const outLineFn = this.line.y(p => this.scale.y(p.count.out));
      let outLine = this.graphGroup.selectAll('path#out-line');
      if (outLine.empty()) {
        outLine = this.graphGroup.append('path')
          .attr('id', 'out-line')
          .style('stroke', 'cornflowerblue')
          .style('fill', 'none');
      }
      outLine.datum(this.packetsByTime)
        .attr('d', outLineFn);
    },
    drawTimeIndicator () {
      let line = this.graphGroup.selectAll('rect#time-indicator');
      if (line.empty()) {
        line = this.graphGroup.append('rect')
          .attr('id', 'time-indicator')
          .attr('height', this.offsetDimensions[1])
          .attr('width', 1)
          .attr('fill', 'white');
      }
      if (this.activePacket) {
        line.attr('x', this.scale.x(new Date(this.activePacket.time)));
        line.style('display', null);
      } else {
        line.style('display', 'none');
      }
    },
    updateGraph () {
      this.updateScales();
      this.drawOverlay();

      this.drawLines();
      this.drawTimeIndicator();
    },
  },
  watch: {
    readyForPackets (isReady) {
      if (isReady && this.packetsByTime.length > 0) {
        this.updateGraph();
      }
    },
    packetsByTime () {
      if (this.readyForPackets) {
        this.updateGraph();
      }
    },
    activePacket () {
      this.drawTimeIndicator();
    },
  },
};
</script>

<style scoped>
svg {
  border: 1px solid white;
}
</style>
