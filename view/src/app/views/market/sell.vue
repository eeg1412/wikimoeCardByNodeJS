<template>
    <div class="wm_market_content_body">
        <div class="wm_market_selling_body">
            <h5 class="common_title type_shop">贩卖中的卡牌</h5>
            <div class="wm_mycard_list">
                <div class="wm_getcard_box">
                    <img class="wm_getcard_img" :src="'/static/img/'+PrefixInteger_(1,4)+'.jpg'">
                    <div class="wm_card_nums"><span class="wm_top_info_star">★</span>99999999</div>
                    <div>
                        <el-tag type="success">可收取星星</el-tag>
                        <el-tag type="danger">已过期</el-tag>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <h5 class="common_title type_shop">可卖的卡牌</h5>
            <div class="wm_market_tips" v-if="userCard.length<0">您暂时没有可以卖的卡牌！</div>
            <div class="wm_mycard_list" v-else>
                <div v-for="(item,index) in userCard" v-bind:key="index+1" class="wm_getcard_box" @click="upCard(item[0])">
                    <img class="wm_getcard_img" :src="'/static/img/'+PrefixInteger_(item[0],4)+'.jpg'">
                    <div class="wm_card_nums">可卖{{item[1]-1}}张</div>
                </div>
            </div>
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
    </div>
</template>

<script>
import {base64_,md5Check,PrefixInteger} from "../../../utils/utils";
import md5_ from 'js-md5';
import {authApi} from "../../api";
// 状态
// 0:未上架
// 1：可修改（可更新上架时间、价格、下架）
// 2：已售出（仅可收取星星）

export default {
  data() {
    return {
        token:sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token"),
        userCard:[],//用户当前页卡牌
        userCardCache:[],//用户卡牌
        cardPage:1,//当前卡牌页码
        cardTotle:0,//一共多少
    }
  },
  mounted() {
    this.getUserCard(); 
  },
  methods: {
    upCard(card){
        this.$router.push({ 
            name:'cardDetail',
            query: {
                    type:'sell',
                    card:card
                }
            });
    },
    PrefixInteger_(num,length){
      return PrefixInteger(num,length);
    },
    cardPageChange(val){
        let userCard_ = this.userCardCache.slice((val-1)*20,val*20);
        this.userCard = userCard_;
    },
    checkCanBuy(item) {
        console.log(item);
        return item[1]>1;
    },
    getUserCard(){
        let tokenUserInfo = this.token.split('.')[1];
        let base = new base64_();
        let email = JSON.parse(base.decode(tokenUserInfo)).email;
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

<style lang="stylus" scoped>
</style>
