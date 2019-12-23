<template>
<div id="app">
    <router-view @l2dMassage="l2dMassage"></router-view>
    <live2d ref="l2d"></live2d>
    <footer class="tc powerdby">Powered by <a class="wm_set_pointer" title="访问维基萌主页" href="https://www.wikimoe.com/" target="_blank">wikimoe</a> (Ver.2.2.4)</footer>
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
  mounted() {
    document.title = window.$siteConfig.browserTitle;
  },
  components: {
    live2d
  },
}
</script>

<style scoped>
.powerdby{
  margin: 30px 0 30px 0;
  height: 24px;
  line-height: 24px;
}
.powerdby a{
  color: inherit;
}
</style>
