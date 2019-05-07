<template>
    <div class="common_body">
        <userTop ref="userTop" />
        <h5 class="common_title type_shop">卡牌图鉴</h5>
        <transition name="el-fade-in-linear">
            <div class="wm_market_tips" v-if="userCard.length<=0&&!pageChangeing"><i class="el-icon-loading"></i> 读取中...</div>
        </transition>
            <div class="wm_handbook_cardlist">
                <transition name="el-fade-in-linear">
                    <div class="wm_mycard_list" v-if="userCard.length>0">
                        <div class="wm_market_mycard_item" v-for="(item,index) in userCard" v-bind:key="index" :class="item.have?'have':''" @click="openImg('/static/img/'+item.cardId+'.jpg')">
                            <img class="wm_getcard_img" :src="'/static/img/'+item.cardId+'.jpg'">
                        </div>
                    </div>
                </transition>
                <div class="wm_market_content_page" v-if="userCard.length>0">
                    <el-pagination
                    small
                    layout="prev, pager, next"
                    :total="card.length"
                    @current-change="cardPageChange"
                    :current-page.sync="cardPage"
                    :page-size="20"
                    class="my_card_page">
                    </el-pagination>
                </div>
            </div>
        <menuView></menuView>
    </div>
</template>

<script>
import menuView from '../components/menu.vue';
import {authApi} from "../api";
import userTop from '../components/topUserInfo.vue';
import cardData from "../../utils/cardData"
import {PrefixInteger,md5Check} from "../../utils/utils";
import md5_ from 'js-md5';

export default {
  data() {
    return {
        token:sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token"),
        card:Object.keys(cardData.cardData).sort(),
        cardBook:[],
        cardPage:Number(this.$route.query.page) || 1,
        userCard:[],
        pageChangeing:false
    }
  },
  components: {
    menuView,
    userTop
  },
  created() {
      this.getUserCard();
  },
  methods: {
    openImg(imgsrc){
      this.$alert('<div class="watch_img"><img src="'+imgsrc+'" /></div>', '查看卡牌', {
        dangerouslyUseHTMLString: true,
        lockScroll:false
      });
    },
    getUserCard(){
        if(!this.token){
            this.$router.replace({ path:'/'});
        }
        let tokenUserInfo = this.token.split('.')[1];
        let email = JSON.parse(atob(tokenUserInfo)).email;
        let md5 = md5_(email);
        if(!md5Check(md5)){
            this.$message.error('用户信息有误！');
            return false;
        }
        authApi.searchcard({md5: md5}).then(res => {
            if(res.data.code==0){
                this.$message.error(res.data.msg);
            }else if(res.data.code==1){
                if(res.data.card){
                    let cardCache = [];
                    for(let i =0;i<this.card.length;i++){
                        let cardI = {
                            cardId:this.card[i],
                            have:res.data.card[Number(this.card[i])]
                        }
                        cardCache.push(cardI);
                    }
                    this.cardBook = cardCache;
                    this.cardPageChange(this.cardPage);
                }
            }
        });
    },
    PrefixInteger_(num,length){
      return PrefixInteger(num,length);
    },
    cardPageChange(val){
        let userCard_ = this.cardBook.slice((val-1)*20,val*20);
        if(userCard_.length<=0&&this.cardPage!=1){
            this.cardPage = 1;
            this.$router.replace({ 
                name:'handbook',
                query: {
                    page:1,
                }
            });
            this.getUserCard();
            return false;
        }
        if(userCard_.length>0){
            this.pageChangeing = true;
        }
        this.userCard = [];
        setTimeout(()=>{
            this.pageChangeing = false;
            this.userCard = userCard_;
        },100)
        this.$router.replace({ 
            name:'handbook',
            query: {
                page:this.cardPage,
            }
        });
    },
  }
}
</script>

<style lang="stylus" scoped>
</style>
