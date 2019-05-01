<template>
<div class="wm_market_content_body">
    <div class="wm_market_card_datail_body">
      <div class="wm_market_card_datail_img_body">
        <img class="wm_market_card_detail_img" :src="'/static/img/'+cardIdFormat+'.jpg'">
      </div>
      <div class="wm_market_card_datail_info_body">
        <div class="wm_market_card_datail_price">售价：99999999星星</div>
        <div class="wm_market_card_datail_info_box">
          <div><span class="fb">卡牌ID：</span>{{cardId}}</div>
          <div><span class="fb">卡牌人物：</span>{{cardData[cardIdFormat].name}}</div>
          <div><span class="fb">出自作品：</span>《{{cardData[cardIdFormat].title}}》</div>
          <div><span class="fb">星级：</span>{{cardData[cardIdFormat].star}}星</div>
          <div><span class="fb">上架时间：</span>2019-05-01 11:00:00</div>
        </div>
        <div>
          <el-button type="primary" class="wm_market_card_datail_buy_btn">购买</el-button>
        </div>
        <div class="wm_market_card_datail_set_body">
          <div class="wm_market_card_datail_tips">tips:将会收取售价的10%作为手续费。卡牌上架后会在7天后过期。</div>
          <div class="wm_market_card_datail_price_input">
            <el-input-number  class="wm_market_card_datail_price_input_box" size="medium" v-model="price" :precision="0" :step="1" :max="99999999" :min="minPrice"></el-input-number>
          </div>
          <div class="wm_market_card_datail_tips">您将获得：{{Math.floor(price*0.9)}} 星星</div>
          <div class="wm_market_card_datail_captcha">
            <el-input placeholder="请输入验证码" v-model="captcha">
              <template slot="append"><img class="reg_code_img" :src="captchaSrc" @click="captchaUpdata"></template>
            </el-input>
          </div>
          <div class="wm_market_card_datail_btn">
            <el-button type="primary" class="wm_market_card_datail_price_input_box">上架</el-button>
          </div>
          <div class="wm_market_card_datail_btn">
            <el-button type="primary" class="wm_market_card_datail_price_input_box">收取星星</el-button>
          </div>
          <div class="wm_market_card_datail_btn">
            <el-button type="primary" class="wm_market_card_datail_price_input_box">更新</el-button>
          </div>
          <div class="wm_market_card_datail_btn">
            <el-button class="wm_market_card_datail_price_input_box">下架</el-button>
          </div>
        </div>     
      </div>
    </div>
    <div class="wm_market_card_datail_charts">
      <ve-line :data="chartData" :settings="chartSettings"></ve-line>
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
      price:0,
      minPrice:0,
      chartSettings:{
        metrics: ['最低价', '最高价'],
        dimension: ['date']
      },
      chartData: {
        columns: ['date', 'PV'],
        rows: [
          { 'date': '01-01', '最低价': 1231 ,'最高价':5000 },
          { 'date': '01-02', '最低价': 1223 ,'最高价':5000 },
          { 'date': '01-03', '最低价': 2123 ,'最高价':5100 },
          { 'date': '01-04', '最低价': 4123 ,'最高价':7000 },
          { 'date': '01-05', '最低价': 3123 ,'最高价':5000 },
          { 'date': '01-06', '最低价': 7123 ,'最高价':8000 }
        ]
      }
    }
  },
  components: {
    VeLine
  },
  created() {
    let type = this.$route.query.type;
    let cardId = this.$route.query.card;
    if(!type||!cardId){
      this.$router.push({ path:'/' });
      return false;
    }
    this.cardId = cardId;
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
  },
  methods: {
    captchaUpdata(){
      this.captchaSrc = '/api/captcha?time='+new Date().getTime();
    },
    PrefixInteger_(num,length){
      return PrefixInteger(num,length);
    },
  }
}
</script>

<style lang="stylus" scoped>
</style>
