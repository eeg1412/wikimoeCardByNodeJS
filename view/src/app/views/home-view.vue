<template>
<div>
  <h5 class="wm_card_chiose_title">欢迎来到维基萌抽卡</h5>
  <div class="wm_card_email_body">
    <transition name="el-fade-in-linear">
      <div class="wm_card_email_input_body" v-show="!seled">
        <el-input v-model="email" placeholder="请先输入邮箱地址再点击卡片" class="wm_card_email"></el-input>
      </div>
    </transition>
    <transition name="el-fade-in-linear">
      <div class="wm_card_restart_body" v-show="seled">
        <el-button type="primary" @click="restart" :disabled="restartDisabled">重新抽卡</el-button>
      </div>
    </transition>
  </div>
  <transition name="el-fade-in-linear">
    <div class="wm_card_remember_body">
      <el-checkbox v-model="remEmail">抽卡并保存邮箱地址</el-checkbox>
    </div>
  </transition>
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
import {mailCheck} from "../../utils/utils";
import rotate3DCard from '../components/rotateCard.vue';
export default {
  data() {
    return {
      remEmail:false,//是否记住邮箱
      email:'',//邮箱地址
      getCardList:['','',''],//卡牌图片地址
      cardIsRotate:[false,false,false],//卡牌翻牌
      seled:false,//已经翻过了
      restartDisabled:true//重启按钮是否可用
    }
  },
  components: {
    rotate3DCard
  },
  mounted() {
    this.getRememberEmail();
  },
  methods: {
    getRememberEmail(){
      var storage=window.localStorage;
      if(storage.getItem("wikimoeEmail")){
        this.email = storage.getItem("wikimoeEmail");
        this.remEmail = true;
      }
    },
    rememberEmail(){
      var storage=window.localStorage;
      if(this.remEmail){
        storage.setItem("wikimoeEmail",this.email);
      }else{
        storage.removeItem("wikimoeEmail");
      }
    },
    restart(){
      this.restartDisabled = true;
      this.$refs.cardListBody.children[0].classList.remove("no-selectedcard");
      this.$refs.cardListBody.children[1].classList.remove("no-selectedcard");
      this.$refs.cardListBody.children[2].classList.remove("no-selectedcard");
      this.cardIsRotate = [false,false,false];
      setTimeout(()=>{
        this.getCardList = ['','',''];
        this.seled = false;
      },800)
    },
    getDailyCard(Num){
      if(this.seled){
        return false;
      }
      if(mailCheck(!this.email)){
        this.$message.error('邮箱格式不正确！');
        return false;
      }
      console.log(Num);
      authApi.dailycard({email: this.email,sel:Num}).then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            this.rememberEmail();
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
                  this.restartDisabled = false;
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
              this.$router.push({ path:'/reg'});
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
