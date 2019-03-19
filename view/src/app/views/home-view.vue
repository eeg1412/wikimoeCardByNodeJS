<template>
<div>
  <h5 class="wm_card_chiose_title">每天一次神抽</h5>
  <div class="wm_card_email_body">
    <el-input v-model="email" placeholder="请先输入邮箱地址再点击卡片" class="wm_card_email"></el-input>
  </div>
  <div class="cardList">
    <div class="cardList_body" ref="cardListBody">
      <div class="card_list" :class="seled?'selectedcard':''" @click="getDailyCard(0)">
        <rotate3DCard trigger="custom" v-model="cardIsRotate[0]" direction="row" :cardSrc="getCardList[0]">
          <slot name="cz"></slot>
          <slot name="cf"></slot>
        </rotate3DCard>
      </div>
      <div class="card_list" :class="seled?'selectedcard':''" @click="getDailyCard(1)">
        <rotate3DCard trigger="custom" v-model="cardIsRotate[1]" direction="row" :cardSrc="getCardList[1]">
          <slot name="cz"></slot>
          <slot name="cf"></slot>
        </rotate3DCard>
      </div>
      <div class="card_list" :class="seled?'selectedcard':''" @click="getDailyCard(2)">
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
      email:'abc@abc.com',//邮箱地址
      getCardList:['','',''],//卡牌图片地址
      cardIsRotate:[false,false,false],//卡牌翻牌
      seled:false//已经翻过了
    }
  },
  components: {
    rotate3DCard
  },
  mounted() {
    console.log(this.$refs.cardListBody.children);
  },
  methods: {
    tryGetCard(){
      authApi.dailycard({email: this.email}).then(res => {
          console.log(res);
      })
    },
    getDailyCard(Num){
      if(this.seled){
        return false;
      }
      console.log(Num);
      authApi.dailycard({email: this.email,sel:Num}).then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            this.seled = true;
            let resData = res.data;
            this.$set(this.getCardList, 0, '/static/img/'+resData.cardChoiseList[0]+'.jpg');
            this.$set(this.getCardList, 1, '/static/img/'+resData.cardChoiseList[1]+'.jpg');
            this.$set(this.getCardList, 2, '/static/img/'+resData.cardChoiseList[2]+'.jpg');
            this.$set(this.cardIsRotate, resData.choiseIndex, true);
            for(let i=0;i<3;i++){
              if(i!==resData.choiseIndex){
                setTimeout(()=>{
                  this.$refs.cardListBody.children[i].classList.add("no-selectedcard");
                },950);
                setTimeout(()=>{
                  this.$set(this.cardIsRotate, i, true);
                },800)
              }
            }
          }else if(res.data.code==2){
            this.$confirm('您尚未注册，是否进入注册页？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$message({
                type: 'success',
                message: '去注册!'
              });
            }).catch(() => {         
            });
          }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
