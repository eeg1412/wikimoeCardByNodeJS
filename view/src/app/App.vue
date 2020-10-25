<template>
  <div id="app">
    <router-view @l2dMassage="l2dMassage"></router-view>
    <live2d ref="l2d"></live2d>
    <div class="wm_bg_1"
         :style="{'background-position':'center ' + scrollTop/10 + 'px'}"></div>
    <div class="wm_bg_2"
         :style="{'background-position':'center ' + scrollTop/4 + 'px'}"></div>
    <footer class="tc powerdby"><span v-html="info"></span> {{version}}
    </footer>
  </div>
</template>

<script>
import live2d from './components/live2d.vue';

export default {
  data () {
    return {
      scrollTop: 0,
      scrollChangeFlag: true,
      version: "(Ver.2.9.9)",
      info: atob("UG93ZXJlZCBieSA8YSBjbGFzcz0nd21fc2V0X3BvaW50ZXInIGhyZWY9J2h0dHBzOi8vd3d3Lndpa2ltb2UuY29tLycgdGFyZ2V0PSdfYmxhbmsnPndpa2ltb2U8L2E+")
    }
  },
  methods: {
    l2dMassage (text) {
      this.$refs.l2d.showMessage(text);
    },
    bgChange () {
      if (this.scrollChangeFlag) {
        console.log("change");
        this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        this.scrollChangeFlag = false;
        setTimeout(() => {
          this.scrollChangeFlag = true;
        }, 100);
      }
    }
  },
  mounted () {
    document.title = window.$siteConfig.browserTitle;
    window.addEventListener('scroll', this.bgChange);
  },
  components: {
    live2d
  },
}
</script>

<style scoped>
</style>
