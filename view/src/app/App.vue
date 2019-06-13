<template>
<div id="app">
    <router-view @l2dMassage="l2dMassage"></router-view>
    <live2d ref="l2d"></live2d>
</div>
</template>

<script>
import live2d from './components/live2d.vue';

export default {
  data() {
    return {
    }
  },
  methods: {
    l2dMassage(text){
      this.$refs.l2d.showMessage(text);
    }
  },
  components: {
    live2d
  },
}
</script>

<style lang="stylus" scoped>
</style>
