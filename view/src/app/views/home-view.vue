<template>
<div class="common_body">
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
  <div class="wm_user_info_body">
    <transition name="el-fade-in-linear">
      <h5 class="wm_card_chiose_title" v-if="nowUserInfo.tx!==''">
        <img class="wm_title_info_avatar_pic" :src="nowUserInfo.tx" width="45" height="45">
        <br>
        <span>{{nowUserInfo.nickName}}的当前信息</span>
      </h5>
      </transition>
      <transition name="el-fade-in-linear">
      <div class="wm_mycard_list" v-if="userCard">
        <table class="wm_user_info_table">
          <thead>
            <tr>
              <th>等级</th>
              <th>竞技点</th>
              <th>收集率</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="wm_user_level">{{nowUserInfo.level}}</td>
            <td class="wm_user_score">{{nowUserInfo.score}}</td>
              <td class="wm_user_getcard_count">{{nowUserInfo.cardCol}}</td>
            </tr>
          </tbody>
        </table>
        <sequential-entrance delay="100" tag="div">
          <div v-for="(item,index) in userCard" v-bind:key="index+1" class="wm_getcard_box">
            <img class="wm_getcard_img" :src="'https://wikimoesh.cn-sh2.ufileos.com/wmcard/'+PrefixInteger_(item[0],4)+'.jpg'" @click="openImg('https://wikimoesh.cn-sh2.ufileos.com/wmcard/'+PrefixInteger_(item[0],4)+'.jpg')">
            <br>
            <span class="wm_card_nums">×{{item[1]}}</span>
          </div>
        </sequential-entrance>
        <el-pagination
          layout="prev, pager, next"
          :total="cardTotle"
          @current-change="cardPageChange"
          :current-page.sync="cardPage"
          :page-size="20"
          class="my_card_page">
        </el-pagination>
      </div>
    </transition>
  </div>
</div>
</template>

<script>
import {authApi} from "../api";
import {mailCheck,PrefixInteger} from "../../utils/utils";
import rotate3DCard from '../components/rotateCard.vue';
import md5 from 'js-md5';
export default {
  data() {
    return {
      remEmail:false,//是否记住邮箱
      email:'',//邮箱地址
      getCardList:['','',''],//卡牌图片地址
      cardIsRotate:[false,false,false],//卡牌翻牌
      seled:false,//已经翻过了
      restartDisabled:true,//重启按钮是否可用
      userCard:null,//用户当前页卡牌
      userCardCache:null,//用户卡牌
      cardPage:1,//当前卡牌页码
      cardTotle:0,//一共多少
      nowUserInfo:{
        tx:'',//头像地址
        score:0,//竞技点
        level:0,//等级
        cardCol:0,//收集卡牌
        nickName:''
      }//当前用户信息
    }
  },
  components: {
    rotate3DCard
  },
  mounted() {
    this.getRememberEmail();
  },
  methods: {
    openImg(imgsrc){
      this.$alert('<div class="watch_img"><img src="'+imgsrc+'" /></div>', '查看卡牌', {
        dangerouslyUseHTMLString: true
      });
    },
    scrollToTop(number = 0, time){
        if (!time) {
            document.body.scrollTop = document.documentElement.scrollTop = number;
            return number;
        }
        const spacingTime = 20; // 设置循环的间隔时间  值越小消耗性能越高
        let spacingInex = time / spacingTime; // 计算循环的次数
        let nowTop = document.body.scrollTop + document.documentElement.scrollTop; // 获取当前滚动条位置
        let everTop = (number - nowTop) / spacingInex; // 计算每次滑动的距离
        let scrollTimer = setInterval(() => {
            if (spacingInex > 0) {
                spacingInex--;
                this.scrollToTop(nowTop += everTop);
            } else {
                clearInterval(scrollTimer); // 清除计时器
            }
        }, spacingTime);
    },
    cardPageChange(val){
      this.scrollToTop(420,200);
      this.userCard=null;
      setTimeout(()=>{
        this.userCard = this.userCardCache.slice((val-1)*20,val*20);
      },0);
    },
    PrefixInteger_(num,length){
      return PrefixInteger(num,length);
    },
    getUserCard(md5){
      authApi.searchcard({md5: md5}).then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            let resData = res.data;
            if(res.data.card){
              this.userCardCache = Object.entries(res.data.card);
              this.userCardCache.reverse();
              this.cardPage = 1;
              this.cardTotle = this.userCardCache.length;
              this.userCard = this.userCardCache.slice(0,20);
              this.nowUserInfo = {
                tx:'https://cdn.v2ex.com/gravatar/'+resData.md5+'?s=100&d=mm&r=g&d=robohash',//头像地址
                score:resData.score,//竞技点
                level:resData.level,//等级
                cardCol:this.cardTotle,//收集卡牌
                nickName:resData.nickName
              };//当前用户信息
              console.log(this.userCardCache);
              //this.userCard = res.data.card;
            }
          }
      });
    },
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
      this.userCard = null;//用户当前页卡牌
      this.userCardCache = null;//用户卡牌
      this.cardPage = 1;//当前卡牌页码
      this.cardTotle = 0;//一共多少
      this.nowUserInfo = {
        tx:'',//头像地址
        score:0,//竞技点
        level:0,//等级
        cardCol:0,//收集卡牌
        nickName:''
      };//当前用户信息
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
            let emailMD5 = md5(this.email);
            this.getUserCard(emailMD5);
            this.seled = true;
            let resData = res.data;
            this.$set(this.getCardList, 0, '/static/img/'+PrefixInteger(resData.cardChoiseList[0],4)+'.jpg');
            this.$set(this.getCardList, 1, '/static/img/'+PrefixInteger(resData.cardChoiseList[1],4)+'.jpg');
            this.$set(this.getCardList, 2, '/static/img/'+PrefixInteger(resData.cardChoiseList[2],4)+'.jpg');
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
