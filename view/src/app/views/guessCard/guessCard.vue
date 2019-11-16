<template>
  <div class="wm_guesscard_content_body">
    <h6 class="mt20 tc f16"><span>每个整点更新一次猜卡！</span></h6>
    <h6 class="tc f14 mb15 mt5"><span v-if="myGuessTimes===0">本次猜卡<span class="cRed">免费</span>！</span><span v-else-if="myGuessTimes===1">本次猜卡消耗<span class="cRed">78</span>颗星星！</span><span v-else>本次猜卡消耗<span class="cRed">258</span>颗星星！</span><span>上次获取时间：{{time | capitalize}}
    <el-tooltip class="item" effect="dark" content="点击刷新" placement="top">
      <i class="el-icon-refresh wm_set_pointer pl5 cRed" @click="searchGuessCard()"></i>
    </el-tooltip>
    </span></h6>
    <div class="wm_guesscard_card_body" v-if="data.length>0">
      <el-row :gutter="5">
        <el-col class="mb5" :span="4" :xs="8" v-for="(item,index) in data" v-bind:key="index">
          <div class="wm_guesscard_col" @click="selCard(index)">
            <img :class="{wm_guesscard_nosel:!item.sel}" :src="$wikimoecard.url+item.packageId+'/'+item.cardId+'.jpg'" class="wm_guesscard_card_img" v-bind:key="item.cardId" />
            <div class="wm_guesscard_mark_box type_2 f12 cOrange ellipsis"><span class="wm_guesscard_mark_item">{{packageInfo[item.packageId]}}</span></div>
            <div class="wm_guesscard_mark_box f12 cRed ellipsis"><span class="wm_guesscard_mark_item" v-if="checkIndexOf(item.cardId,battleCard)!==-1">战</span> <span class="wm_guesscard_mark_item cGreen1A7">持:{{haveCard[item.cardId]}}</span></div>
          </div>
          <!-- <div class="tc mt5 mb5" :class="{wm_guesscard_nosel:!item.sel}">
            <div class="ellipsis f12 wm_guesscard_packageinfo">{{packageInfo[item.packageId]}}</div>
            <div class="ellipsis f12 wm_guesscard_cardhave">持有:{{haveCard[item.cardId]}}</div>
          </div> -->
        </el-col>
      </el-row>
      <div class="wm_guesscard_btn_body">
          <el-button @click="send" type="primary">猜卡</el-button>
          <el-button @click="help">说明</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {authApi} from "../../api";

export default {
  data() {
    return {
      id:null,
      token:sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token"),
      data:[],
      cardTime:0,
      time:0,
      packageInfo:{},
      haveCard:{},
      battleCard:[],
      myGuessTimes:0,
    }
  },
  created() {
   this.searchGuessCard();
  },
  filters: {
    capitalize(value) {
        var date = new Date(parseInt(value));
        var tt = [(date.getHours()<10?'0'+date.getHours():date.getHours()), (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()), (date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds())].join(':');
        return tt;
      },
  },
  mounted() {
    this.$emit('l2dMassage','这里可以进行猜卡，不仅可以获得猜中的卡，更可以获得丰厚的星星奖励！就算一张都没有猜中也可以获得宝石奖励！');
  },
  methods: {
    checkIndexOf(i,arr){
      return arr.indexOf(i);
    },
    send(){
      const seledCard = this.data.filter(item => item.sel);
      if(seledCard.length<6){
        this.$message.error('请选择6张卡牌！');
        return false;
      }
      let useStar = 258;
      if(this.myGuessTimes===0){
        useStar = 0;
      }else if(this.myGuessTimes===1){
        useStar = 78;
      }
      this.$confirm('猜卡将消耗'+useStar+'颗星星, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll:false,
        type: 'warning'
      }).then(() => {
        let cardIndex = [];
        for(let i=0;i<seledCard.length;i++){
          cardIndex.push(seledCard[i].index);
        }
        const params = {
          token:this.token,
          type:'buy',
          time:this.cardTime,
          id:this.id,
          cardIndex:cardIndex
        }
        authApi.userguesscard(params).then(res => {
            if(res.data.code==0){
              this.$message.error(res.data.msg);
            }else if(res.data.code==1){
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              this.$emit('updateUserinfo');
            }else if(res.data.code==201){
              this.$message.error(res.data.msg);
            }
            this.searchGuessCard();
        });
      }).catch(() => {
        
      });
    },
    help(){
      this.$alert('系统每个整点会自动生成30张卡牌并自动结算上个整点选中的6张卡牌。<br />每位大佬可以选择6张心仪的卡牌，点击【猜卡】按钮上传选中的卡牌。<br />当天第一次猜卡免费，第二次猜卡消耗78星星，第三次以后每次消耗258星星。<br />然后等下一个整点公布结果后在【兑换】选项卡中兑换奖品。<br />系统将会根据猜中卡牌的张数发放对应的星星，同时还会获得猜中的卡牌。<br />奖品如下：<br />猜中零张卡牌：随机宝石×2。<br />猜中一张卡牌：10颗星星+猜中的卡牌。<br />猜中两张卡牌：30颗星星+猜中的卡牌。<br />猜中三张卡牌：160颗星星+猜中的卡牌。<br />猜中四张卡牌：2000颗星星+猜中的卡牌。<br />猜中五张卡牌：50000颗星星+猜中的卡牌。<br />猜中六张卡牌：500万颗星星+猜中的卡牌。', {
        dangerouslyUseHTMLString: true,
        lockScroll:false
      });
    },
    selCard(i){
      const cardSel = this.data[i].sel;
      if(!cardSel){
        const seledCard = this.data.filter(item => item.sel);
        if(seledCard.length>=6){
          this.$message({
            message: '最多只能选择6张卡牌！',
            type: 'warning'
          });
          return false;
        }
      }
      this.data[i].sel = !this.data[i].sel;
      this.$forceUpdate();
    },
    searchGuessCard(){
      const params = {
        token:this.token
      }
      this.time = new Date().getTime();
      authApi.searchguesscard(params).then(res => {
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            this.haveCard = res.data.myCardCount;
            this.battleCard = res.data.battleCard;
            this.data = res.data.data.card;
            this.id = res.data.data._id;
            this.myGuessTimes = res.data.myGuessTimes;
            this.cardTime = Number(res.data.data.time);
            for(let i=0;i<this.data.length;i++){
              this.data[i].sel = false;
              this.data[i].index = i;
            }
            const packageInfo_ = res.data.packageInfo;
            for(let i=0;i<packageInfo_.length;i++){
              this.packageInfo[packageInfo_[i].packageId] = packageInfo_[i].name;
            }
          }
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
  cursor: url(/static/cur/pointer.cur),pointer;
}
.wm_guesscard_col img{
  position: absolute;
  left: 0;
  top: 0;
}
.wm_guesscard_mark_box{
  z-index: 2;
  position: absolute;
  bottom: 5px;
  left: 5px;
  right: 5px;
}
.wm_guesscard_mark_box.type_2{
  bottom: 24px;
}
.wm_guesscard_mark_item{
  background-color: rgba(255,255,255,0.8);
  padding: 0px 3px;
}
</style>
