<template>
<div class="wm_card_top_userinfo_body clearfix">
    <div class="fl">
        <img class="wm_top_info_avatar_pic" :src="'https://cdn.v2ex.com/gravatar/'+userData.md5+'?s=100&amp;d=mm&amp;r=g&amp;d=robohash'" @click="openMore()">
    </div>
    <div class="fl">
        <div>
            <span>{{userData.nickName||'获取中'}}</span>
            <span><span class="wm_top_info_star">★</span>{{userData.star||'0'}}</span>
        </div>
    </div>
    <div class="fr wm_topuserinfo_logout" @click="logout">登出</div>
    <el-dialog
        :title="userData.nickName+'的信息'"
        :visible.sync="dialogVisible"
        class="reg_code_dialog"
        :append-to-body="true"
        width="95%"
        >
        <div class="wm_top_info_more_body" v-if="userData.level!==undefined">
            <div><img class="wm_top_moreinfo_avatar_pic" :src="'https://cdn.v2ex.com/gravatar/'+userData.md5+'?s=100&amp;d=mm&amp;r=g&amp;d=robohash'"></div>
            <div class="wm_top_moreinfo_name">{{userData.nickName}}</div>
            <div class="wm_top_moreinfo_body clearfix">
                <div class="wm_top_moreinfo_box">
                    <div class="wm_top_moreinfo_label">星星：{{userData.star}}</div>
                </div>
                <div class="wm_top_moreinfo_box">
                    <div class="wm_top_moreinfo_label">等级：{{userData.level}}</div>
                </div>
                <div class="wm_top_moreinfo_box">
                    <div class="wm_top_moreinfo_label">经验：{{userData.exp}}/{{cardData.level[userData.level>5?5:userData.level]}}</div>
                </div>
                <div class="wm_top_moreinfo_box">
                    <div class="wm_top_moreinfo_label">竞技点：{{userData.score}}</div>
                </div>
                <div class="wm_top_moreinfo_box">
                    <div class="wm_top_moreinfo_label">累计挖矿：{{userData.deminingStarCount}}</div>
                </div>
                <div class="wm_top_moreinfo_box">
                    <div class="wm_top_moreinfo_label">收集率：{{userData.cardIndexCount}}/{{cardDataCount.length}}</div>
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import {authApi} from "../api";
import cardData from "../../utils/cardData";
export default {
  data() {
    return {
        userData:{},
        token:sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token"),
        dialogVisible:false,
        cardData:cardData,
        cardDataCount:Object.keys(cardData.cardData)
    }
  },
  mounted(){
      this.getUserInfo();
  },
  methods:{
    logout(){
        authApi.logout({token:this.token}).then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
                this.$message({
                    message: '成功登出！',
                    type: 'success'
                });
                sessionStorage.removeItem("token");
                localStorage.removeItem("token");
                this.$router.replace('/');
          }
        });
    },
    openMore(){
        if(this.userData.md5){
            this.dialogVisible = true;
        }
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
