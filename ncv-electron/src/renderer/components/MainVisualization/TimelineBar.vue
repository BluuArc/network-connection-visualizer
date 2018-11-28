<template>
  <svg
    width="1500" height="250"
    class="packet-timeline"
    :viewBox="`0 0 ${viewBoxDimensions.join(' ')}`"
    style="width: 100%;"/>
</template>

<script>
/* global d3 */
export default {
  computed: {
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
    console.debug('timeline loaded');
  },
  methods: {
    initializeGraph () {
      const [offsetWidth, offsetHeight] = this.offsetDimensions;

      this.scale.x = d3.scaleTime().range([0, offsetWidth]);
      this.scale.y = d3.scaleLinear().range([offsetHeight, 0]);

      this.line = d3.line()
        .x((p, i) => this.scale.x(i))
        .y(p => this.scale.y(Math.round(Math.random() * 2) - 1));

      this.graphGroup = this.svg.append('g')
        .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`);
    },
    drawOverlay () {
      // eslint-disable-next-line no-unused-vars
      const [offsetWidth, offsetHeight] = this.offsetDimensions;
      // TODO: update x and y scales here
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
    }
  },
};
</script>

<style scoped>
svg {
  border: 1px solid white;
}
</style>
