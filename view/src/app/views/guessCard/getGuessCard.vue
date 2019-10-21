<template>
<div class="wm_guesscard_content_body mt20">
    <transition name="el-fade-in-linear">
      <div v-if="pageChanging">
          <el-card class="wm_guesscard_content_card mb15" v-for="(item,index) in data" v-bind:key="index">
              <div>
                  <el-row :gutter="10">
                      <el-col :span="4" :xs="8" v-for="(items,indexs) in item.guessCardData" v-bind:key="indexs" class="mt5 mb5">
                        <div class="wm_guesscard_col">
                          <img :class="{wm_guesscard_nosel:items.attack===-1}" :src="$wikimoecard.url+items.packageId+'/'+items.cardId+'.jpg'" class="wm_guesscard_card_img" v-bind:key="item.cardId" />
                        </div>
                      </el-col>
                  </el-row>
              </div>
              <div class="wm_guesscard_header">
                  <el-row :gutter="0">
                      <el-col :span="16">
                          <el-tag type="info">{{item.time | capitalize}}</el-tag>
                          <el-tag type="success" v-if="item.guessData.attackIndex.length>0">兑换期</el-tag>
                          <el-tag type="danger" v-else>猜卡期</el-tag>
                      </el-col>
                      <el-col :span="8" class="tr">
                          <el-button size="small" type="primary" v-if="item.guessData.attackIndex.length>0&&item.geted===false" @click="get(item._id)">兑换</el-button>
                          <el-button size="small" type="primary" :disabled="true" v-else-if="item.geted===true" @click="get(item._id)">已兑换</el-button>
                      </el-col>
                  </el-row>
              </div>
          </el-card>
          <div class="wm_market_content_page" v-if="data.length>0">
              <el-pagination
              small
              layout="prev, pager, next"
              :total="total"
              @current-change="cardPageChange"
              :current-page.sync="page"
              :page-size="10"
              class="my_card_page">
              </el-pagination>
          </div>
          <el-card v-if="data.length===0" class="mt15 mb15"><div class="tc pt20 pb20"><span class="pl5">暂无猜卡记录，快去猜卡吧!</span></div></el-card>
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
      page:Number(this.$route.query.page) || 1,//当前卡牌页码,
      total:null,
      data:[],
      pageChanging:false
    }
  },
  created() {
      this.getUserGuessInfo();
  },
  mounted() {
    this.$emit('l2dMassage','这里可以将猜卡的结果兑换成奖励，祝您好运！');
  },
  filters: {
    capitalize(value) {
        var date = new Date(parseInt(value*3600*1000));
        var tt = ((date.getMonth()+1)<10?'0'+(date.getMonth()+1):date.getMonth()+1)+'月'+(date.getDate()<10?'0'+date.getDate():date.getDate())+'日'+(date.getHours()<10?'0'+date.getHours():date.getHours())+'时'
        return tt;
    },
  },
  methods: {
    get(_id){
        const params = {
        token:this.token,
        type:'get',
        id:_id
      }
      authApi.userguesscard(params).then(res => {
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            this.$message({
                message: res.data.msg,
                type: 'success'
            });
            this.getUserGuessInfo();
            this.$emit('updateUserinfo');
          }
      });
    },
    cardPageChange(val){
        this.page = val;
        this.$router.replace({ 
          name:'getGuessCard',
          query: {
            page:this.page,
          }
        });
        this.getUserGuessInfo();
    },
    getUserGuessInfo(){
      this.pageChanging = false;
      const params = {
        token:this.token,
        type:'search',
        page:this.page
      }
      authApi.userguesscard(params).then(res => {
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            this.total = res.data.total;
            const guessCardData = res.data.guessData;
            let rawData = res.data.data;
            // 组合数据
            for(let i=0;i<rawData.length;i++){
                // 根据时间筛选
                let thisGCData = guessCardData.filter(item => item._id === rawData[i].guessId);
                thisGCData = thisGCData[0];
                rawData[i].guessData = thisGCData;
                // 生成选卡卡组
                const cardIndexArr = rawData[i].selectIndex;
                let cardDataArr = [];
                for(let i=0;i<cardIndexArr.length;i++){
                    let thisCardArr = thisGCData.card[cardIndexArr[i]]
                    // 判断是否中奖
                    thisCardArr.attack = thisGCData.attackIndex.indexOf(cardIndexArr[i]);
                    cardDataArr.push(thisCardArr);
                }
                rawData[i].guessCardData = cardDataArr;
                rawData[i].guessCount = cardDataArr.filter(item => item.attack !== -1).length;
            }
            this.data = rawData;
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
.wm_guesscard_header{
    border-top: 1px dashed #ccc;
    padding-top: 15px;
    margin-top: 15px;
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