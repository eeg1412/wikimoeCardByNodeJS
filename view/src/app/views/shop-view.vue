<template>
  <div class="common_body">
    <h5 class="common_title type_shop">星星商店</h5>
    <div v-if="userData">
      <div class="wm_card_chiose_title">
        <img class="wm_title_info_avatar_pic" :src="'https://cdn.v2ex.com/gravatar/'+userData.md5+'?s=100&amp;d=mm&amp;r=g&amp;d=robohash'" width="45" height="45">
        <br>
        <span class="wm_card_demining_star">{{userData.nickName}}的星星:{{userData.star}}</span>
      </div>
    </div>
    <div class="wm_shop_item_list_body">
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
        <div class="wm_shop_item_list_text">五十连抽<br />需要1250星星</div>
      </div>
      <div class="wm_shop_item_list_box">
        <div class="wm_shop_item_list_ico" @click="buy(0,4)"></div>
        <div class="wm_shop_item_list_text">一百连抽<br />需要2400星星</div>
      </div>
    </div>
    <div class="shop_card_list_body">
      <sequential-entrance delay="100" tag="div">
        <div v-for="(item,index) in cardList" v-bind:key="index+1" class="shop_card_list_box">
          <rotate3DCard trigger="click" direction="row" :cardSrc="'/static/img/'+PrefixInteger_(item,4)+'.jpg'">
            <slot name="cz"></slot>
            <slot name="cf"></slot>
          </rotate3DCard>
        </div>
      </sequential-entrance>
    </div>
    <menuView></menuView>
  </div>
</template>

<script>
import {PrefixInteger,loadingImg,showLoading,hideLoading} from "../../utils/utils";
import rotate3DCard from '../components/rotateCard.vue';
import menuView from '../components/menu.vue';
import {authApi} from "../api";

export default {
  data() {
    return {
      cardList:[],
      userData:null,
      token:sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token"),
    }
  },
  components: {
    rotate3DCard,
    menuView
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    PrefixInteger_(num,length){
      return PrefixInteger(num,length);
    },
    buy(t,g){
      let params = {
        type:t,
        goods:g,
        token:this.token
      }
      authApi.shop(params).then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            this.cardList = res.data.data;
            this.getUserInfo();
          }
      });
    },
    getUserInfo(){
      authApi.userinfo({token:this.token}).then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            this.userData = res.data.data;
          }
      });
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
