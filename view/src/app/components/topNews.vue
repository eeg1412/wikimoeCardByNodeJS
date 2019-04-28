<template>
<div class="wm_topnews_body">
    <div class="wm_topnews_box">
        <marquee-text :repeat="30" :duration="3">
            <div class="wm_topnews_item">Short text</div>
        </marquee-text>
    </div>
    
</div>
</template>

<script>
import {authApi} from "../api";
import MarqueeText from 'vue-marquee-text-component'

export default {
  data() {
    return {
    }
  },
  components: {
    MarqueeText
  },
  mounted(){
  },
  methods:{
    
  }
}
</script>

<style lang="stylus" scoped>
</style>
