<template>
<div class="wm_market_content_body">
    <div class="wm_market_card_datail_body">
      <div class="wm_market_card_datail_img_body">
        <img class="wm_market_card_detail_img" :src="'/static/img/'+cardIdFormat+'.jpg'">
      </div>
      <div class="wm_market_card_datail_info_body">
        <div class="wm_market_card_datail_price" v-if="sellPrice">售价：{{sellPrice}}星星</div>
        <div class="wm_market_card_datail_info_box">
          <div><span class="fb">卡牌ID：</span>{{cardId}}</div>
          <div><span class="fb">卡牌人物：</span>{{cardData[cardIdFormat].name}}</div>
          <div><span class="fb">出自作品：</span>《{{cardData[cardIdFormat].title}}》</div>
          <div><span class="fb">星级：</span>{{cardData[cardIdFormat].star}}星</div>
          <div v-if="uptime"><span class="fb">上架时间：</span>{{uptime | capitalize}}</div>
        </div>
        <div class="wm_market_card_datail_captcha" v-if="type=='buy'">
          <el-input placeholder="请输入验证码" v-model="captcha">
            <template slot="append"><img class="reg_code_img" :src="captchaSrc" @click="captchaUpdata"></template>
          </el-input>
        </div>
        <div v-if="type=='buy'">
          <el-button type="primary" class="wm_market_card_datail_buy_btn">购买</el-button>
        </div>
        <div class="wm_market_card_datail_set_body" v-if="type=='sell'">
          <div class="wm_market_card_datail_tips" v-if="stat==1 || stat==0">tips:将会收取售价的10%作为手续费。卡牌上架后会在7天后过期。</div>
          <div class="wm_market_card_datail_price_input" v-if="stat==1 || stat==0">
            <el-input-number  class="wm_market_card_datail_price_input_box" size="medium" v-model="price" :precision="0" :step="1" :max="99999999" :min="minPrice"></el-input-number>
          </div>
          <div class="wm_market_card_datail_tips" v-if="stat==1 || stat==0">您将获得：{{Math.floor(price*0.9)}} 星星</div>
          <div class="wm_market_card_datail_captcha">
            <el-input placeholder="请输入验证码" v-model="captcha">
              <template slot="append"><img class="reg_code_img" :src="captchaSrc" @click="captchaUpdata"></template>
            </el-input>
          </div>
          <div class="wm_market_card_datail_btn" v-if="stat==0">
            <el-button type="primary" class="wm_market_card_datail_price_input_box" @click="upCard()">上架</el-button>
          </div>
          <div class="wm_market_card_datail_btn" v-if="stat==1">
            <el-button type="primary" class="wm_market_card_datail_price_input_box" @click="update()">更新</el-button>
          </div>
          <div class="wm_market_card_datail_btn" v-if="stat==1">
            <el-button class="wm_market_card_datail_price_input_box" @click="downCard()">下架</el-button>
          </div>
        </div> 
        <div v-if="stat==2">
          <el-button type="primary" class="wm_market_card_datail_buy_btn" @click="getstar()">收取星星</el-button>
        </div>    
      </div>
    </div>
    <div class="wm_market_card_datail_charts">
      <ve-line :data="chartData" :settings="chartSettings" :extend="extend" v-if="chartData.rows.length>0"></ve-line>
      <div class="wm_market_card_datail_charts_empty" v-else>暂无价格历史数据</div>
    </div>
</div>
</template>

<script>
import {PrefixInteger} from "../../../utils/utils";
import {authApi} from "../../api";
import cardData from "../../../utils/cardData";
import VeLine from 'v-charts/lib/line.common'

export default {
  data() {
    return {
      captchaSrc:'/api/captcha?time='+new Date().getTime(),
      cardData:cardData['cardData'],
      token:sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token"),
      cardId:1,
      cardIdFormat:1,
      type:'buy',
      captcha:'',
      id:'',// 交易ID
      sellPrice:0,//售价
      price:0,//设定售价
      minPrice:0,//最小售价
      uptime:null,//上架时间
      stat:undefined,//卖卡状态
      extend:{
        'xAxis.0.axisLabel.rotate': 45
      },
      chartSettings:{
        labelMap: {
          'highPrice': '最高价',
          'lowPrice': '最低价'
        },
      },
      chartData: {
        columns: ['time' ,'highPrice' , 'lowPrice'],
        rows: [
        ]
      }
    }
  },
  components: {
    VeLine
  },
  filters:{
    capitalize(value) {
      var date = new Date(parseInt(value*1000));
      var tt = [date.getFullYear(), ((date.getMonth()+1)<10?'0'+(date.getMonth()+1):date.getMonth()+1), (date.getDate()<10?'0'+date.getDate():date.getDate())].join('-') + '  ' +[(date.getHours()<10?'0'+date.getHours():date.getHours()), (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()), (date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds())].join(':');
      return tt;
    }
  },
  created() {
    let type = this.$route.query.type;
    let cardId = this.$route.query.card;
    if(!type||!cardId){
      this.$router.push({ path:'/' });
      return false;
    }
    this.uptime = this.$route.query.time;
    this.stat = this.$route.query.stat;
    this.cardId = cardId;
    this.id = this.$route.query.id;
    this.sellPrice = this.$route.query.price;
    if(this.sellPrice){
      this.price = this.sellPrice;
    }
    this.cardIdFormat = PrefixInteger(cardId,4)
    this.type = type;
    // 计算最低售价
    if(this.cardData[this.cardIdFormat].star==6){
      this.minPrice = 1200;
    }else if(this.cardData[this.cardIdFormat].star==5){
      this.minPrice = 400;
    }else if(this.cardData[this.cardIdFormat].star==4){
      this.minPrice = 180;
    }else{
      this.minPrice = 60;
    }
    this.getChart();
  },
  methods: {
    getChart(){
      let params = {
        token:this.token,
        cardId:this.cardId
      }
      authApi.marketchart(params).then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            let chartDataRow = res.data.data.reverse();
            for(let i=0;i<chartDataRow.length;i++){
              chartDataRow[i].time = this.capitalize(chartDataRow[i].time);
            }
            this.chartData.rows = chartDataRow;
          }
      });
    },
    getstar(){
      let params = {
        type:'getstar',
        captcha:this.captcha,
        id:this.id,
        token:this.token
      }
      authApi.marketsell(params).then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.$emit('updateUserinfo');
            this.$router.replace({ path:'/star/market/sellcard'});
          }
          this.captchaUpdata();
      });
    },
    downCard(){
      let params = {
        type:'down',
        captcha:this.captcha,
        id:this.id,
        token:this.token
      }
      authApi.marketsell(params).then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.$router.replace({ path:'/star/market/sellcard'});
          }
          this.captchaUpdata();
      });
    },
    update(){
      let params = {
        type:'update',
        price:this.price,
        captcha:this.captcha,
        id:this.id,
        token:this.token
      }
      authApi.marketsell(params).then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.$router.replace({ path:'/star/market/sellcard'});
          }
          this.captchaUpdata();
      });
    },
    upCard(){
      let params = {
        type:'up',
        price:this.price,
        cardId:this.cardId,
        captcha:this.captcha,
        token:this.token
      }
      authApi.marketsell(params).then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.$router.replace({ path:'/star/market/sellcard'});
          }
          this.captchaUpdata();
      });
    },
    captchaUpdata(){
      this.captchaSrc = '/api/captcha?time='+new Date().getTime();
    },
    PrefixInteger_(num,length){
      return PrefixInteger(num,length);
    },
    capitalize(value) {
      var date = new Date(parseInt(value*1000));
      var tt = [((date.getMonth()+1)<10?'0'+(date.getMonth()+1):date.getMonth()+1), (date.getDate()<10?'0'+date.getDate():date.getDate())].join('-') + '  ' +[(date.getHours()<10?'0'+date.getHours():date.getHours()), (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()), (date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds())].join(':');
      return tt;
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
