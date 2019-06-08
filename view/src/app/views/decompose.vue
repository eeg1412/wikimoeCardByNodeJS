<template>
<div class="common_body">
    <userTop ref="userTop" />
    <decomposehead />
    <div class="wm_market_content_body type_dec">
        <h5 class="common_title type_shop type_dec">卡牌分解</h5>
        <h6 class="common_title_tips type_dec">系统已自动保留一张卡牌</h6>
        <div>
            <transition name="el-fade-in-linear">
                <div class="wm_market_tips" v-if="userCard.length<=0&&!pageChangeing">您暂时没有可以分解的卡牌！</div>
            </transition>
            <transition name="el-fade-in-linear">
                <div class="wm_mycard_list type_dec" v-if="userCard.length>0">
                    <div v-for="(item,index) in userCard" v-bind:key="index+1" class="wm_getcard_box type_mobile">
                        <div class="wm_dec_img_box">
                            <div class="wm_dec_can_num">可解:{{item[1]-1}}张</div>
                            <img class="wm_getcard_img" :src="'/static/img/'+PrefixInteger_(item[0],4)+'.jpg'">
                        </div>
                        <div class="wm_dec_input_body"><el-input-number :precision="0" :step="1" :max="item[1]-1" :min="0" size="mini" v-model="item[2]" class="wm_dec_input"></el-input-number></div>
                    </div>
                </div>
            </transition>
            <div class="wm_market_content_page">
                <el-pagination
                small
                layout="prev, pager, next"
                :total="cardTotle"
                @current-change="cardPageChange"
                :current-page.sync="cardPage"
                :page-size="20"
                class="my_card_page">
                </el-pagination>
            </div>
        </div>
        <div class="wm_dec_btn_body" v-if="userCardCache.length>0">
            <el-button @click="clear">清空</el-button>
            <el-button @click="dec" type="primary">分解</el-button>
            <el-button @click="decAll" type="primary">全页</el-button>
        </div>
    </div>
    <menuView></menuView>
</div>
</template>

<script>
import {md5Check,PrefixInteger} from "../../utils/utils";
import md5_ from 'js-md5';
import menuView from '../components/menu.vue';
import {authApi} from "../api";
import userTop from '../components/topUserInfo.vue';
import cardData from "../../utils/cardData";
import decomposehead from "../components/decomposehead";

export default {
  data() {
    return {
        token:sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token"),
        userCard:[],//用户当前页卡牌
        userCardCache:[],//用户卡牌
        cardPage:1,//当前卡牌页码
        cardTotle:0,//一共多少
        myMarket:[],//自己上架的卡牌
        serverTime:0,//服务器时间
        pageChangeing:false,
        cardDatas:cardData['cardData'],
        decCard:{},//待分解卡牌
        starCount:0,//待分解卡牌价值
    }
  },
  components: {
    menuView,
    userTop,
    decomposehead
  },
  created() {
      this.getUserCard();
  },
  methods: {
    clear(){
        for(let i=0;i<this.userCard.length;i++){
            this.userCard[i][2] = 0;
        }
        this.$forceUpdate();
    },
    dec(){
        this.countCardStar();
        if(this.starCount<=0){
            this.$message.error('请设置要分解的卡牌数量！');
            return false;
        }
        this.$confirm('分解卡牌后将会获得<span class="cOrange">'+this.starCount+'</span>颗星星，是否分解？', '提示', {
          confirmButtonText: '分解',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.goDecCard();
        }).catch(() => {
                   
        });
    },
    goDecCard(){
        let cardId = [];
        let cardCount = [];
        for(let i=0;i<this.userCard.length;i++){
            if(this.userCard[i][2]>0){
                cardId.push(this.userCard[i][0]);
                cardCount.push(this.userCard[i][2]);
            }
        }
        let params = {
            token:this.token,
            cardId:cardId,
            cardCount:cardCount
        }
        authApi.decompose(params).then(res => {
            if(res.data.code==0){
                this.$message.error(res.data.msg);
            }else if(res.data.code==1){
                this.$message({
                    message: '成功分解出'+res.data.star+'颗星星。',
                    type: 'success'
                });
                this.getUserCard();
                this.$refs.userTop.getUserInfo();
            }
        });
    },
    decAll(){
        for(let i=0;i<this.userCard.length;i++){
            this.userCard[i][2] = this.userCard[i][1]-1;
        }
        this.$forceUpdate();
        this.countCardStar();
        this.$confirm('分解卡牌后将会获得<span class="cOrange">'+this.starCount+'</span>颗星星，是否分解？', '提示', {
          confirmButtonText: '分解',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.goDecCard();
        }).catch(() => {
                   
        });
    },
    countCardStar(){
        let cardObj = {};
        let star = 0;
        for(let i=0;i<this.userCard.length;i++){
            let num = this.userCard[i][2];
            if(num>0){
                star = star + this.cardDatas[PrefixInteger(this.userCard[i][0],4)].star*num;
                cardObj[this.userCard[i][0]] = num;
            }
        }
        this.starCount = star;
        this.decCard = cardObj;
    },
    PrefixInteger_(num,length){
      return PrefixInteger(num,length);
    },
    cardPageChange(val){
        let userCard_ = this.userCardCache.slice((val-1)*20,val*20);
        if(userCard_.length>0){
            this.pageChangeing = true;
        }
        console.log(userCard_);
        this.userCard = [];
        setTimeout(()=>{
            this.userCard = userCard_;
            this.pageChangeing = false;
        },300)
    },
    checkCanBuy(item) {
        return item[1]>1;
    },
    getUserCard(){
        let tokenUserInfo = this.token.split('.')[1];
        let email = JSON.parse(atob(tokenUserInfo)).email;
        let md5 = md5_(email);
        if(!md5Check(md5)){
            this.$message.error('用户信息有误！');
            return false;
        }
        authApi.searchcard({md5: md5}).then(res => {
            console.log(res);
            if(res.data.code==0){
                this.$message.error(res.data.msg);
            }else if(res.data.code==1){
                let resData = res.data;
                if(res.data.card){
                    this.userCardCache = Object.entries(res.data.card);
                    this.userCardCache = this.userCardCache.filter(this.checkCanBuy);
                    for(let i=0;i<this.userCardCache.length;i++){
                        this.userCardCache[i][2] = 0;
                    }
                    this.cardPage = 1;
                    this.cardTotle = this.userCardCache.length;
                    this.cardPageChange(1);
                    }else{
                    this.$message({
                        message: resData.nickName+'还没有获得过卡牌呢！',
                        type: 'warning'
                    });
                }
            }
        });
    }, 
  }
}
</script>

<style scoped>
.wm_dec_can_num{
    position: absolute;
    z-index: 2;
    right: 5px;
    bottom: 5px;
    background-color: rgba(255,255,255,0.85);
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 12px;
    color: #ff5364;
}
.wm_dec_img_box{
    position: relative;
    z-index: 1;
}
.wm_dec_input{
    width: 100%;
}
.wm_dec_input_body{
    margin: 10px 0 0 0;
    height: 28px;
}
.wm_mycard_list.type_dec .wm_getcard_box{
    height: 301px;
}
.wm_mycard_list.type_dec .wm_getcard_img{
    cursor: url(/static/cur/default.cur),default;
}
.wm_dec_btn_body{
    padding: 20px 0;
    text-align: center;
    background-color: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 999;
}
</style>