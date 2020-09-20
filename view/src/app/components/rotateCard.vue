//rotate3DCard.vue
<style lang="stylus">
.card-3d {
  width: 160px;
  height: 225px;
  border-radius: 6px;
  transition: all 0.2s;
  position: relative;
  perspective: 1500px;
  background-color: transparent;
  position: relative;

  .card-3d-newicon {
    position: absolute;
    left: 6px;
    bottom: 6px;
  }

  .card {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: all 0.8s;
    backface-visibility: hidden;
    border-radius: 6px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);

    &.card-z {
      background-image: url('../../assets/images/card/back.jpg');
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
    }

    &.card-f-y {
      transform: rotateY(-180deg);
    }

    &.card-f-x {
      transform: rotateX(-180deg);
    }
  }
}

.wm_getcard_img {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  overflow: hidden;
}
</style>
<template>
  <div class="card-3d"
       @click="eve_cardres_click"
       @mouseover="eve_cardres_msover"
       @mouseout="eve_cardres_msout">
    <div class="card card-z"
         ref="cardz">
      <slot name="cz"></slot>
    </div>
    <div :class="['card',direction=='row'?'card-f-y':'card-f-x']"
         ref="cardf">
      <slot name="cf">
        <img v-if="cardSrc!==''"
             class="wm_getcard_img"
             width="100%"
             height="100%"
             :src="cardSrc">
        <img v-if="isNew && value"
             src="/static/otherImg/newIcon.png"
             class="card-3d-newicon">
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    trigger: { //触发方式 hover click custom
      type: String,
      default: 'click' //默认点击触发
    },
    value: { //正反面
      type: Boolean,
      default: true
    },
    isNew: { //是否为新卡牌
      type: Boolean,
      default: false
    },
    direction: { //方向 row col
      type: String,
      default: 'row'
    },
    cardSrc: { //图片链接
      type: String,
      default: ''
    }
  },
  data () {
    return {
      surface: true
    }
  },
  watch: {
    value (bool) {//自定义触发方式
      console.log(this.value);
      if (this.trigger == 'custom') this.fn_reserve_action(bool)
    }
  },
  methods: {
    fn_reserve_action (bool) {
      var arr = this.direction == 'row' ? ['rotateY(180deg)', 'rotateY(0deg)', 'rotateY(-180deg)'] : ['rotateX(180deg)', 'rotateX(0deg)', 'rotateX(-180deg)']
      this.$refs.cardz.style.transform = bool ? arr[0] : arr[1]
      this.$refs.cardf.style.transform = !bool ? arr[2] : arr[1]
    },
    eve_cardres_click () {
      if (this.trigger == 'click') {
        this.fn_reserve_action(this.surface)
        this.surface = !this.surface
      }
    },
    eve_cardres_msover () {
      if (this.trigger == 'hover') this.fn_reserve_action(true)
    },
    eve_cardres_msout () {
      if (this.trigger == 'hover') this.fn_reserve_action(false)
    }
  }
}
</script>
