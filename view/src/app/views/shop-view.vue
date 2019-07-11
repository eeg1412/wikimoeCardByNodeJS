<template>
  <div class="common_body">
    <userTop ref="userTop" />
    <h5 class="common_title type_shop">星星商店</h5>
    <div class="tc">
      <el-select v-model="seledCardPackage" placeholder="选择卡包" class="wm_card_package_sel">
        <el-option
          v-for="item in cardPackage"
          :key="item.packageId"
          :label="item.name"
          :value="item.packageId">
        </el-option>
      </el-select>
    </div>
    <el-collapse-transition>
      <div class="shop_card_list_body" v-if="openList">
        <div class="shop_card_list_btn_body" id="shopCardListBtnBody">
          <div class="shop_card_list_btn_box" :class="shopCardListBtnBodyFixed?'flex_mode':''">
            <el-button type="primary" @click="back()">返回购买</el-button>
            <el-button type="primary" @click="openAll()">全部翻开</el-button>
          </div>
        </div>
        <sequential-entrance delay="100" tag="div">
          <div v-for="(item,index) in cardList" v-bind:key="index+1" class="shop_card_list_box" :class="item.seled?'selectedcard':''" @click="openCard(index)">
            <rotate3DCard trigger="custom" v-model="item.seled" direction="row" :cardSrc="$wikimoecard.url+packageId+'/'+item.id+'.jpg'">
              <slot name="cz"></slot>
              <slot name="cf"></slot>
            </rotate3DCard>
          </div>
        </sequential-entrance>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div class="wm_shop_item_list_body" v-if="!openList">
        <div class="wm_shop_item_list_box">
          <div class="wm_shop_item_list_ico" @click="buy(0,0)"></div>
          <div class="wm_shop_item_list_text">单抽<br />需要30星星</div>
        </div>
        <div class="wm_shop_item_list_box">
          <div class="wm_shop_item_list_ico" @click="buy(0,1)"></div>
          <div class="wm_shop_item_list_text">十连抽<br />需要270星星</div>
        </div>
        <div class="wm_shop_item_list_box">
          <div class="wm_shop_item_list_ico" @click="buy(0,2)"></div>
          <div class="wm_shop_item_list_text">三十连抽<br />需要780星星</div>
        </div>
        <div class="wm_shop_item_list_box">
          <div class="wm_shop_item_list_ico" @click="buy(0,3)"></div>
          <div class="wm_shop_item_list_text">五十连抽(保底1张六星)<br />需要1250星星</div>
        </div>
        <div class="wm_shop_item_list_box">
          <div class="wm_shop_item_list_ico" @click="buy(0,4)"></div>
          <div class="wm_shop_item_list_text">一百连抽(保底2张六星)<br />需要2400星星</div>
        </div>
      </div>
    </el-collapse-transition>
    <menuView></menuView>
  </div>
</template>

<script>
import {scrollToTop,PrefixInteger,loadingImg,showLoading,hideLoading} from "../../utils/utils";
import rotate3DCard from '../components/rotateCard.vue';
import menuView from '../components/menu.vue';
import {authApi} from "../api";
import userTop from '../components/topUserInfo.vue';

export default {
  data() {
    return {
      seledCardPackage:'加载中',
      cardPackage:[],
      openList:false,
      cardList:[],
      userData:null,
      token:sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token"),
      shopCardListBtnBodyFixed:false,
      packageId:0,
    }
  },
  components: {
    rotate3DCard,
    menuView,
    userTop
  },
  mounted() {
    this.$emit('l2dMassage','这里可以购买额外的抽卡机会，希望你能抽到心仪的卡。');
    window.addEventListener('scroll', this.menuTop);
    this.getCardPackage();
  },
  methods: {
    rememberPackageId(){
      const packageId = this.seledCardPackage;
      localStorage.setItem("shopCardPackageId",packageId);
    },
    getCardPackage(){
      authApi.searchcardpackage().then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            this.cardPackage = res.data.data;
            this.seledCardPackage = localStorage.getItem("shopCardPackageId") || '0';
          }
      });
    },
    menuTop(){
      let el = document.getElementById('shopCardListBtnBody');
      if(!el){
        return false;
      }
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      let offsetTop = el.offsetTop;
      scrollTop > offsetTop ? this.shopCardListBtnBodyFixed = true : this.shopCardListBtnBodyFixed = false;
    },
    back(){
      this.cardList = [];
      this.openList = false;
    },
    openAll(){
      for(let i=0;i<this.cardList.length;i++){
        this.cardList[i].seled = true;
      }
    },
    openCard(i){
      if(this.cardList[i].seled){
        return false;
      }
      this.cardList[i].seled = true;
    },
    PrefixInteger_(num,length){
      return PrefixInteger(num,length);
    },
    buy(t,g){
      this.$confirm('确定要购买该卡包的抽卡次数吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            type:t,
            goods:g,
            token:this.token,
            packageId:this.seledCardPackage,
          }
          this.rememberPackageId();
          authApi.shop(params).then(res => {
              console.log(res);
              if(res.data.code==0){
                this.$message.error(res.data.msg);
              }else if(res.data.code==1){
                this.packageId = res.data.packageId;
                let cardResData = res.data.data;
                let cardData = [];
                let cardSrc = [];
                for(let i = 0;i<cardResData.length;i++){
                  // let CardSrcItem = this.$wikimoecard.url+res.data.packageId+'/'+cardResData[0]+'.jpg';
                  // cardSrc.push(CardSrcItem);

                  let cardId = cardResData[i];
                  let cardDataItem = {
                    id:cardId,
                    seled:false
                  }
                  cardData.push(cardDataItem);
                }
                this.cardList = cardData;
                this.$refs.userTop.getUserInfo();
                setTimeout(()=>{
                  scrollToTop(0,200);
                  this.openList = true;
                },120)
              }
          });
        }).catch(() => {});
    },
  },
  beforeDestroy(){
    window.removeEventListener('scroll', this.menuTop);
  }
}
</script>

<style lang="stylus" scoped>
</style>
