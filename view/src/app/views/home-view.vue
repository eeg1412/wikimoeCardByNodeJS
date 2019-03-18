<template>
<div>
  <h5 class="wm_card_chiose_title">每天一次神抽</h5>
  <div class="wm_card_email_body">
    <el-input v-model="email" placeholder="请先输入邮箱地址再点击卡片" class="wm_card_email"></el-input>
  </div>
  <div class="cardList">
    <div class="cardList_body">
      <div class="card_list" @click="getCard(0)">
        <rotate3DCard trigger="custom" v-model="cardIsRotate[0]" direction="row" :cardSrc="getCardList[0]">
          <slot name="cz"></slot>
          <slot name="cf"></slot>
        </rotate3DCard>
      </div>
      <div class="card_list" @click="getCard(1)">
        <rotate3DCard trigger="custom" v-model="cardIsRotate[1]" direction="row" :cardSrc="getCardList[1]">
          <slot name="cz"></slot>
          <slot name="cf"></slot>
        </rotate3DCard>
      </div>
      <div class="card_list" @click="getCard(2)">
        <rotate3DCard trigger="custom" v-model="cardIsRotate[2]" direction="row" :cardSrc="getCardList[2]">
          <slot name="cz"></slot>
          <slot name="cf"></slot>
        </rotate3DCard>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {authApi} from "../api";
import rotate3DCard from '../components/rotateCard.vue';
export default {
  data() {
    return {
      email:'',
      getCardList:['','',''],
      cardIsRotate:[false,false,false],
    }
  },
  components: {
    rotate3DCard
  },
  mounted() {
  },
  methods: {
    tryGetCard(){
      authApi.login({email: this.email}).then(res => {
          console.log(res);
      })
    },
    getCard(Num){
      console.log(Num);
      this.tryGetCard();
      this.$set(this.cardIsRotate, Num, true);
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
