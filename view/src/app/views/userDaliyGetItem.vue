<template>
  <div class="common_body">
    <userTop ref="userTop" />
    <h5 class="common_title type_shop">本月签到</h5>
    <div class="tc mb20">
      <el-card shadow="never" class="wm_dailygetitem_list_item" v-if="thisDay">
        <div>签到{{thisDay.day+1}}天</div>
        <div class="mt10">{{thisDay.text}}</div>
        <div class="mt10" v-if="count>thisDay.day">
          <el-button type="primary" size="medium" :disabled="true">已领取</el-button>
        </div>
        <div class="mt10" v-else>
          <el-button type="primary" size="medium" @click="getItem(false)" v-if="count===thisDay.day&&!geted">领取</el-button>
          <el-button type="primary" size="medium" v-else-if="count===thisDay.day&&count<serverData&&canReissue>0" @click="getItem(true)">补签</el-button>
          <el-button type="primary" size="medium" :disabled="true" v-else-if="count===thisDay.day">明日领取</el-button>
          <el-button type="info" size="medium" :disabled="true" v-else>不可领取</el-button>
        </div>
      </el-card>
    </div>
    <div class="tc mb20">
      <el-card shadow="never" class="wm_dailygetitem_list_item" v-for="(item,index) in itemList" v-bind:key="index">
        <div>签到{{index+1}}天</div>
        <div class="mt10">{{item.text}}</div>
        <div class="mt10" v-if="count>index">
          <el-button type="primary" size="medium" :disabled="true">已领取</el-button>
        </div>
        <div class="mt10" v-else>
          <el-button type="primary" size="medium" @click="getItem(false)" v-if="count===index&&!geted">领取</el-button>
          <el-button type="primary" size="medium" v-else-if="count===index&&count<serverData&&canReissue>0" @click="getItem(true)">补签</el-button>
          <el-button type="primary" size="medium" :disabled="true" v-else-if="count===index">明日领取</el-button>
          <el-button type="info" size="medium" :disabled="true" v-else>不可领取</el-button>
        </div>
      </el-card>
    </div>
    <menuView></menuView>
    <captcha @captchaShow="captchaDigShow" @send="sendCaptcha" :codeDigShow="captchaShow" v-if="captchaShow" ref="captch"></captcha>
  </div>
</template>

<script>
import menuView from '../components/menu.vue';
import {authApi} from "../api";
import userTop from '../components/topUserInfo.vue';
import captcha from "../components/captcha"

export default {
  data() {
    return {
      canReissue:0,
      reissue:false,
      captchaShow:false,
      itemList:[],
      thisDay:null,
      serverData:0,
      count:0,
      geted:false,
      token:sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token"),
    }
  },
  components: {
    menuView,
    userTop,
    captcha
  },
  mounted() {
    this.dailygetitem();
    this.$wikimoecard.l2dMassage('这里每天可以进行一次签到，签到后可以获得奖励喔！')
  },
  methods: {
    captchaDigShow(v){
        this.captchaShow = v;
    },
    getThisDay(){
      let thisIndex = 0;
      this.thisDay = this.itemList.filter((item,index)=>{
        if(this.count===index){
          thisIndex = index;
          return true;
        }else{
          return false;
        }
      });
      this.thisDay = this.thisDay[0];
      if(this.thisDay){
        this.thisDay["day"] = thisIndex;
      }
    },
    dailygetitem(){
      let params = {
          token:this.token,
          type:'search'
      }
      authApi.dailygetitem(params).then(res => {
          console.log(res);
          if(res.data.code==0){
              this.$message.error(res.data.msg);
          }else if(res.data.code==1){
              this.itemList = res.data.daily.item;
              this.count = res.data.getCount;
              this.geted = res.data.geted;
              this.serverData = res.data.data;
              this.canReissue = res.data.canIssue;
              this.getThisDay();
          }
      });
    },
    getItem(reissue){
      this.reissue = reissue;
      this.captchaShow = true;
    },
    sendCaptcha(v){
      let params = {
          token:this.token,
          type:'get',
          reissue:this.reissue,
          captcha:v
      }
      authApi.dailygetitem(params).then(res => {
          this.$refs.captch.captchaUpdata();
          console.log(res);
          if(res.data.code==0){
              this.$message.error(res.data.msg);
          }else if(res.data.code==1){
              this.captchaShow = false;
              this.count = res.data.count;
              this.canReissue = res.data.canIssue;
              this.geted = true;
              this.getThisDay();
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              this.$refs.userTop.getUserInfo();
          }
      });
    }
  },
}
</script>

<style scoped>
.wm_dailygetitem_list_item{
  width: 180px;
  height: 140px;
  text-align: center;
  display: inline-block;
  margin: 5px;
  position: relative;
  z-index: 1;
}
@media ( max-width : 768px) {
  .wm_dailygetitem_list_item{
    width: 100%;
  }
}
</style>
