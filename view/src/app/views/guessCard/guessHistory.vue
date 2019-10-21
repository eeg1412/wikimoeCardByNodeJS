<template>
  <div class="wm_guesscard_content_body">
    <transition name="el-fade-in-linear">
      <div v-if="pageChanging">
        <h6 class="tc mb15 mt15" v-if="data"><el-tag type="success" >猜卡生成时间：{{data.time | capitalize}}</el-tag></h6>
        <div class="wm_guesscard_card_body" v-if="data">
          <el-row :gutter="5">
            <el-col class="mb5" :span="4" :xs="8" v-for="(item,index) in data.card" v-bind:key="index">
              <div class="wm_guesscard_col">
                <img :class="{wm_guesscard_nosel:checkAttack(index)===-1}" :src="$wikimoecard.url+item.packageId+'/'+item.cardId+'.jpg'" class="wm_guesscard_card_img" v-bind:key="item.cardId" />
              </div>
            </el-col>
          </el-row>
        </div>
        <el-card v-if="!data" class="mt15 mb15"><div class="tc pt20 pb20"><span class="pl5">暂无记录</span></div></el-card>
        <div class="wm_market_content_page" v-if="total">
          <el-pagination
            small
            layout="prev, pager, next"
            :total="total"
            @current-change="cardPageChange"
            :current-page.sync="page"
            :page-size="1"
            class="my_card_page">
          </el-pagination>
        </div>
      </div>
    </transition>
    <el-card class="mt15 mb15" v-if="!pageChanging"><div class="tc pt20 pb20 cRed"><i class="el-icon-loading"></i><span class="pl5">读取中...</span></div></el-card>
  </div>
</template>

<script>
import {authApi} from "../../api";
import {scrollToTop} from "../../../utils/utils";

export default {
  data() {
    return {
      token:sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token"),
      data:null,
      page:Number(this.$route.query.page) || 1,//当前卡牌页码,
      total:null,
      pageChanging:false
    }
  },
  created() {
   this.searchGuessCard();
  },
  filters: {
    capitalize(value) {
        var date = new Date(parseInt(value*3600*1000));
        var tt = ((date.getMonth()+1)<10?'0'+(date.getMonth()+1):date.getMonth()+1)+'月'+(date.getDate()<10?'0'+date.getDate():date.getDate())+'日'+(date.getHours()<10?'0'+date.getHours():date.getHours())+'时'
        return tt;
    },
  },
  mounted() {
    this.$emit('l2dMassage','这里可以查看往期的猜卡结果！');
  },
  methods: {
    cardPageChange(val){
        this.page = val;
        this.$router.replace({ 
          name:'guessHistory',
          query: {
            page:this.page,
          }
        });
        this.searchGuessCard();
    },
    checkAttack(i){
      return this.data.attackIndex.indexOf(i);
    },
    searchGuessCard(){
      this.pageChanging = false;
      const params = {
        token:this.token,
        type:'history',
        page:this.page
      }
      this.time = new Date().getTime();
      authApi.searchguesscard(params).then(res => {
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            this.data = res.data.data[0];
            this.total = res.data.total;
          }
          scrollToTop(0,200);
          this.pageChanging = true;
      });
    },
  }
}
</script>

<style scoped>
.wm_guesscard_card_img{
  width: 100%;
  height: auto;
}
.wm_guesscard_nosel{
  opacity: 0.4;
}
.wm_guesscard_btn_body{
    padding: 20px 0;
    text-align: center;
    background-color: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 999;
}
.wm_guesscard_col{
  padding-bottom: 140%;
  position: relative;
  z-index: 1;
}
.wm_guesscard_col img{
  position: absolute;
  left: 0;
  top: 0;
}
</style>
