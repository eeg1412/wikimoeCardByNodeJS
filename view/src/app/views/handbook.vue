<template>
    <div class="common_body">
        <userTop ref="userTop" />
        <h5 class="common_title type_shop">卡牌图鉴</h5>
        <transition name="el-fade-in-linear">
            <div class="wm_market_tips" v-if="loading"><i class="el-icon-loading"></i> 读取中...</div>
        </transition>
            <div class="wm_handbook_cardlist">
                <div class="wm_cardlist_select_search_body">
                    <el-form :inline="true" :model="searchForm">
                        <el-form-item label="星星等级">
                            <el-select class="wm_cardlist_select" @change="searchChanged" v-model="searchForm.star" placeholder="筛选星级">
                            <el-option label="全部" value="0"></el-option>
                            <el-option label="1星" value="1"></el-option>
                            <el-option label="2星" value="2"></el-option>
                            <el-option label="3星" value="3"></el-option>
                            <el-option label="4星" value="4"></el-option>
                            <el-option label="5星" value="5"></el-option>
                            <el-option label="6星" value="6"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="水晶属性">
                            <el-select class="wm_cardlist_select" @change="searchChanged" v-model="searchForm.cry" placeholder="筛选水晶属性">
                            <el-option label="全部" value="0"></el-option>
                            <el-option label="红火" value="1"></el-option>
                            <el-option label="蓝水" value="2"></el-option>
                            <el-option label="绿风" value="3"></el-option>
                            <el-option label="光" value="4"></el-option>
                            <el-option label="暗" value="5"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="被动属性">
                            <el-select class="wm_cardlist_select" @change="searchChanged" v-model="searchForm.leftType" placeholder="筛选被动属性">
                            <el-option label="全部" value="0"></el-option>
                            <el-option label="全能" value="1"></el-option>
                            <el-option label="兵攻" value="2"></el-option>
                            <el-option label="盾防" value="3"></el-option>
                            <el-option label="速度" value="4"></el-option>
                            <el-option label="爱心" value="5"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="主动技能">
                            <el-select class="wm_cardlist_select" @change="searchChanged" v-model="searchForm.rightType" placeholder="筛选主动技能">
                            <el-option label="全部" value="0"></el-option>
                            <el-option label="物" value="1"></el-option>
                            <el-option label="魔" value="2"></el-option>
                            <el-option label="防" value="3"></el-option>
                            <el-option label="治" value="4"></el-option>
                            <el-option label="妨" value="5"></el-option>
                            <el-option label="支" value="6"></el-option>
                            <el-option label="特" value="7"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否拥有">
                            <el-select class="wm_cardlist_select" @change="searchChanged" v-model="searchForm.have" placeholder="筛选是否已有">
                            <el-option label="全部" value="0"></el-option>
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <el-collapse-transition>
                    <div class="wm_mycard_list" v-if="userCard.length>0">
                        <div class="wm_market_mycard_item type_mobile" v-for="(item,index) in userCard" v-bind:key="index" :class="item.have?'have':''" @click="openImg('/static/img/'+item.cardId+'.jpg',item.info.name,item.have,item.info.star,item.cardId)">
                            <img class="wm_getcard_img" :src="'/static/img/'+item.cardId+'.jpg'">
                        </div>
                    </div>
                </el-collapse-transition>
                <el-collapse-transition>
                    <div class="common_nocard_tips" v-show="userCard.length<=0&&!loading&&!pageChangeing">该条件下暂无卡牌！</div>
                </el-collapse-transition>
                <div class="wm_market_content_page" v-if="userCard.length>0">
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
        pageChangeing:false,
        cardTotle:0,
        searchForm:{
            star:this.$route.query.star || '0',
            cry:this.$route.query.cry ||'0',
            rightType:this.$route.query.rightType || '0',
            leftType:this.$route.query.leftType || '0',
            have:this.$route.query.have || '0',
        },
        loading:true
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
    openImg(imgsrc,name,have,star,cardId){
        this.$confirm('<div class="watch_img"><img src="'+imgsrc+'" /></div>', '查看卡牌', {
            dangerouslyUseHTMLString: true,
            lockScroll:false,
            showCancelButton: false,
            confirmButtonText: '购卡或求购',
        }).then(() => {
            let want = 0;
            if(!have){
                want = 1
            }
            this.$router.push({ 
                name:'buyCard',
                query: {
                    name:'cardId',
                    text:cardId,
                    want:want,
                    wantstar:star,
                    wantid:cardId
                }
            });
        }).catch(() => {
                   
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
        this.loading = true;
        authApi.searchcard({md5: md5}).then(res => {
            this.loading = false;
            if(res.data.code==0){
                this.$message.error(res.data.msg);
            }else if(res.data.code==1){
                if(res.data.card){
                    let cardCache = [];
                    for(let i =0;i<this.card.length;i++){
                        let cardI = {
                            cardId:this.card[i],
                            have:res.data.card[Number(this.card[i])],
                            info:cardData.cardData[this.card[i]]
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
    searchChanged(){
        this.cardPage = 1;
        this.cardPageChange(1);
    },
    cardPageChange(val){
        let that = this;
        // 筛选条件
        function setStar(item){
            let p_ = that.searchForm.star;
            if(p_==='0'){
                return true;
            }else if(item==p_){
                return true;
            }
            return false;
        }
        function setCry(item){
            let p_ = that.searchForm.cry;
            if(p_==='0'){
                return true;
            }else if(item==p_){
                return true;
            }
            return false;
        }
        function setRightType(item){
            let p_ = that.searchForm.rightType;
            if(p_==='0'){
                return true;
            }else if(item==p_){
                return true;
            }
            return false;
        }
        function setLeftType(item){
            let p_ = that.searchForm.leftType;
            if(p_==='0'){
                return true;
            }else if(item==p_){
                return true;
            }
            return false;
        }
        function setHave(item){
            let p_ = that.searchForm.have;
            if(p_==='0'){
                return true;
            }else if(p_==='1'){
                if(item){
                    return true;
                }else{
                    return false;
                }
            }else if(p_==='2'){
                if(!item){
                    return true;
                }else{
                    return false;
                }
            }
            return true;
        }
        let userCardSearchRes = this.cardBook.filter(item => setStar(item.info.star) && setCry(item.info.cry) && setRightType(item.info.rightType) && setLeftType(item.info.leftType) && setHave(item.have));
        let userCard_ = userCardSearchRes.slice((val-1)*20,val*20);
        this.cardTotle = userCardSearchRes.length;
        if(userCard_.length<=0&&this.cardPage!=1){
            this.cardPage = 1;
            this.searchForm = {
                star:'0',
                cry:'0',
                rightType:'0',
                leftType:'0'
            };
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
        },300)
        this.$router.replace({ 
            name:'handbook',
            query: {
                page:this.cardPage,
                star:this.searchForm.star,
                cry:this.searchForm.cry,
                rightType:this.searchForm.rightType,
                leftType:this.searchForm.leftType,
                have:this.searchForm.have,
            }
        });
    },
  }
}
</script>

<style lang="stylus" scoped>
</style>
