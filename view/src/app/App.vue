<template>
<div id="app">
    <router-view @l2dMassage="l2dMassage"></router-view>
    <live2d ref="l2d"></live2d>
    <div class="wm_bg_1" :style="{'background-position':'center ' + scrollTop/10 + 'px'}"></div>
    <div class="wm_bg_2" :style="{'background-position':'center ' + scrollTop/4 + 'px'}"></div>
    <footer class="tc powerdby">Powered by <a class="wm_set_pointer" title="访问维基萌主页" href="https://www.wikimoe.com/" target="_blank">wikimoe</a> (Ver.2.3.3)</footer>
</div>
</template>

<script>
import live2d from './components/live2d.vue';

export default {
  data() {
    return {
      scrollTop:0,
      scrollChangeFlag:true,
    }
  },
  methods: {
    l2dMassage(text){
      this.$refs.l2d.showMessage(text);
    },
    bgChange(){
      if(this.scrollChangeFlag){
        console.log("change");
        this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        this.scrollChangeFlag = false;
        setTimeout(()=>{
          this.scrollChangeFlag = true;
        },100);
      }
    }
  },
  mounted() {
    document.title = window.$siteConfig.browserTitle;
    window.addEventListener('scroll', this.bgChange);
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
