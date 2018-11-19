<template>
  <svg
    width="800" height="480"
    viewBox="0 0 1920 1080"
    style="height: 100%; width: 100%;"/>
</template>

<script>
export default {
  mounted () {
    console.debug('map loaded');
  }
}
</script>

<style scoped>
svg {
  border: 1px solid white;
}
</style>
