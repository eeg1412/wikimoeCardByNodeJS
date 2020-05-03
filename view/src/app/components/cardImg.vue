<template>
  <div class="wm_cardimg_body"
       @click="cardClick(src,isSparkle)">
    <img class="wm_getcard_img"
         :src="src">
    <img class="wm_getcard_isSparkle"
         v-if="isSparkle"
         src="/static/img/isSparkle.png">
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ""
    },
    isSparkle: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  watch: {

  },
  methods: {
    cardClick (src, isSparkle) {
      this.$emit('cardClick', src, isSparkle);
    }
  }
}
</script>

<style scoped>
.wm_cardimg_body {
  position: relative;
  z-index: 1;
}
.wm_getcard_isSparkle {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: url(/static/cur/pointer.cur), pointer;
}
.wm_getcard_img {
  position: relative;
  z-index: 1;
}
</style>
