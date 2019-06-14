<template>
    <div class="wm_market_content_body">
        <transition name="el-fade-in-linear">
            <div class="wm_market_selling_body" v-if="myMarket.length>0">
                <h5 class="common_title type_shop">贩卖中的卡牌</h5>
                <div class="wm_mycard_list">
                    <div class="wm_market_mycard_item type_mobile" v-for="(item,index) in myMarket" v-bind:key="index+1" @click="editCard(item.cardId,item.time,item.selled,item.price,item._id)">
                        <img class="wm_getcard_img" :src="$wikimoecard.url+PrefixInteger_(item.cardId,4)+'.jpg'">
                        <div class="wm_card_nums"><span class="wm_top_info_star">★</span>{{item.price}}</div>
                        <div class="wm_market_selling_tag" v-if="item.selled || serverTime-item.time>2592000">
                            <!-- 更新点击事件记得更新标签 -->
                            <el-tag type="success" v-if="item.selled" class="wm_market_selling_tag_item" @click.stop="editCard(item.cardId,item.time,item.selled,item.price,item._id)">可收取星星</el-tag>
                            <el-tag type="danger" v-if="serverTime-item.time>2592000 && !item.selled" class="wm_market_selling_tag_item" @click.stop="editCard(item.cardId,item.time,item.selled,item.price,item._id)">过期请更新</el-tag>
                        </div>
                    </div>
                </div>
                <div class="wm_market_content_page">
                <el-pagination
                    small
                    layout="prev, pager, next"
                    :total="sellCardTotle"
                    @current-change="sellCardPageChange"
                    :current-page.sync="sellCardPage"
                    :page-size="20"
                    class="my_card_page">
                    </el-pagination>
                </div>
                <div class="wm_market_btn_body">
                    <el-button type="primary" @click="updataMany('getstarMany')">一键领取</el-button>
                    <el-button type="primary" @click="updataMany('updateMany')">一键更新</el-button>
                </div>
            </div>
        </transition>
        <div>
            <h5 class="common_title type_shop">可卖的卡牌</h5>
            <div class="tc">
                <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                    <el-form-item label="星级">
                    <el-select v-model="searchForm.star" class="wm_market_buy_search_select" @change="searchChanged">
                        <el-option label="全部" value="0"></el-option>
                        <el-option label="1星" value="1"></el-option>
                        <el-option label="2星" value="2"></el-option>
                        <el-option label="3星" value="3"></el-option>
                        <el-option label="4星" value="4"></el-option>
                        <el-option label="5星" value="5"></el-option>
                        <el-option label="6星" value="6"></el-option>
                    </el-select>
                    </el-form-item>
                    <el-form-item label="求购">
                    <el-select v-model="searchForm.havewant" class="wm_market_buy_search_select" @change="searchChanged">
                        <el-option label="全部" value="0"></el-option>
                        <el-option label="有求购" value="1"></el-option>
                    </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <transition name="el-fade-in-linear">
                <div class="wm_market_tips" v-if="userCard.length<=0&&!pageChangeing">该条件下暂时没有可以卖的卡牌！</div>
            </transition>
            <el-collapse-transition>
                <div class="wm_mycard_list" v-if="userCard.length>0">
                    <div v-for="(item,index) in userCard" v-bind:key="index+1" class="wm_getcard_box type_mobile wm_market_cansell_card" @click="upCard(item[0])">
                        <img class="wm_getcard_img" :src="$wikimoecard.url+PrefixInteger_(item[0],4)+'.jpg'">
                        <div class="wm_card_nums">可卖{{item[1]-1}}张</div>
                        <div class="wm_card_want_nums" v-if="wantList[item[0]]">{{wantList[item[0]]}}人想要</div>
                    </div>
                </div>
            </el-collapse-transition>
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
        <captcha @captchaShow="captchaDigShow" @send="sendCaptcha" :codeDigShow="captchaShow" v-if="captchaShow" ref="captch"></captcha>
    </div>
</template>

<script>
import {md5Check,PrefixInteger,scrollToTop} from "../../../utils/utils";
import md5_ from 'js-md5';
import {authApi} from "../../api";
import captcha from "../../components/captcha"
import cardData from "../../../utils/cardData"
// 状态
// 0:未上架
// 1：可修改（可更新上架时间、价格、下架）
// 2：已售出（仅可收取星星）

export default {
  data() {
    return {
        cardData_:cardData['cardData'],
        oneKeyType:'',
        captchaShow:false,
        token:sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token"),
        userCard:[],//用户当前页卡牌
        userCardCache:[],//用户卡牌
        cardPage:Number(this.$route.query.page) || 1,//当前卡牌页码
        cardTotle:0,//一共多少
        myMarket:[],//自己上架的卡牌
        serverTime:0,//服务器时间
        pageChangeing:false,
        wantList:{},//想要列表
        searchForm:{
          star:this.$route.query.star || '0',
          havewant:this.$route.query.havewant || '0',
        },
        sellCardTotle:0,
        sellCardPage:Number(this.$route.query.sellPage) || 1,
    }
  },
  components: {
      captcha
  },
  mounted() {
    this.$emit('l2dMassage','这里可以寄售多余的卡牌来换取星星。'); 
    this.getUserMarket(this.sellCardPage);
    this.getWant();
  },
  methods: {
    sellCardPageChange(p){
        this.getUserMarket(p);
        scrollToTop(180,200)
    },
    searchChanged(){
        this.cardPage = 1;
        this.cardPageChange(1);
    },
    getWant(){
      let params = {
          token:this.token
      }
      authApi.searchwantcard(params).then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
              let wantListObj = {};
              for(let i=0;i<res.data.data.length;i++){
                  wantListObj[res.data.data[i]['_id']] = res.data.data[i]['count'];
              }
              this.wantList = wantListObj;
              this.getUserCard();
          }
      })
    },
    updataMany(type){
        this.oneKeyType = type;
        this.captchaShow = true;
    },
    sendCaptcha(v){
        console.log(v);
        let params = {
            type:this.oneKeyType,
            token:this.token,
            captcha:v
        }
        authApi.marketsell(params).then(res => {
            console.log(res);
            this.$refs.captch.captchaUpdata();
            if(res.data.code==0){
                this.$message.error(res.data.msg);
            }else if(res.data.code==1){
                this.captchaShow = false;
                this.$message({
                    message: res.data.msg,
                    type: 'success'
                });
                this.getUserMarket();
                this.$emit('updateUserinfo');
            }
        });
    },
    captchaDigShow(v){
        this.captchaShow = v;
    },
    editCard(cardId,time,selled,price,id){
        let stat = 1;
        if(selled){
            stat = 2;
        }
        this.$router.push({ 
        name:'cardDetail',
        query: {
                type:'sell',
                card:cardId,
                stat:stat,
                price:price,
                time:time,
                id:id
            }
        });
    },
    getUserMarket(page){
        let params = {
            type:'search',
            token:this.token,
            page:page
        }
        authApi.marketsell(params).then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            if(res.data.data.length<=0&&this.sellCardPage>1){
                this.sellCardPage = 1;
                this.getUserMarket(1);
                this.$router.replace({ 
                    name:'sellCard',
                    query: {
                        page:this.cardPage,
                        star:this.searchForm.star,
                        havewant:this.searchForm.havewant,
                        sellPage:this.sellCardPage
                    }
                });
                return false;
            }
            this.myMarket = [];
            setTimeout(()=>{
                this.myMarket = res.data.data;
            },200)
            this.serverTime = res.data.time;
            this.sellCardTotle = res.data.totle;
            this.$router.replace({ 
                name:'sellCard',
                query: {
                    page:this.cardPage,
                    star:this.searchForm.star,
                    havewant:this.searchForm.havewant,
                    sellPage:this.sellCardPage
                }
            });
          }
        });
    },
    upCard(card){
        this.$router.push({ 
            name:'cardDetail',
            query: {
                    type:'sell',
                    card:card,
                    stat:0
                }
        });
    },
    PrefixInteger_(num,length){
      return PrefixInteger(num,length);
    },
    cardPageChange(val){
        let that = this;
        // 筛选条件
        function setStar(item){
            let p_ = that.searchForm.star;
            if(p_==='0'){
                return true;
            }else if(that.cardData_[PrefixInteger(item,4)].star==p_){
                return true;
            }
            return false;
        }
        function setwant(item){
            let p_ = that.searchForm.havewant;
            if(p_==='0'){
                return true;
            }else if(that.wantList[item]>0){
                return true;
            }
            return false;
        }
        let userCardSearchRes = this.userCardCache.filter(item => setStar(item[0]) && setwant(item[0]))
        let userCard_ = userCardSearchRes.slice((val-1)*20,val*20);
        this.cardTotle = userCardSearchRes.length;
        if(userCard_.length>0){
            this.pageChangeing = true;
        }
        this.userCard = [];
        setTimeout(()=>{
            this.pageChangeing = false;
            this.userCard = userCard_;
        },300)
        this.$router.replace({ 
            name:'sellCard',
            query: {
                page:this.cardPage,
                star:this.searchForm.star,
                havewant:this.searchForm.havewant,
                sellPage:this.sellCardPage
            }
        });
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
                    this.userCardCache.reverse();
                    this.userCardCache = this.userCardCache.filter(this.checkCanBuy);
                    this.cardTotle = this.userCardCache.length;
                    this.cardPageChange(this.cardPage);
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
.wm_market_cansell_card{
    position: relative;
    z-index: 1;
}
.wm_card_want_nums{
    position: absolute;
    z-index: 1;
    right: 10px;
    bottom: 46px;
    background-color: rgba(255,255,255,0.85);
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 12px;
    color: #ff5364;
}
</style>
