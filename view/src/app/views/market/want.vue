<template>
<div class="wm_market_content_body">
    <div class="wm_market_card_datail_charts_empty" v-if="wantLog.length<=0">
        <span>暂无求购信息</span>
    </div>
    <div class="wm_card_get_list_item" v-for="(item,index) in wantLog" v-bind:key="index+1">
        <div class="wm_card_get_list_avatar">
        <el-tooltip class="item" effect="dark" :content="'查看'+item.nickName+'的卡牌'" placement="top" :hide-after="3000">
            <img class="wm_card_get_list_avatar_pic" :src="'https://cdn.v2ex.com/gravatar/'+item.md5+'?s=100&amp;d=mm&amp;r=g&amp;d=robohash&days='+txDays" width="45" height="45" @click="watchUserCard(item.md5)">
        </el-tooltip>
        </div>
        <div class="wm_card_get_list_comment">
        <p>
            <span class="wm_log_name">{{item.nickName}}</span>
            <span class="wm_log_time">{{item.time|capitalize}}</span>
        </p>
        <p>
            <span
            >我愿意用<span class="cRed">{{item.wantPrice}}</span>颗左右的星星，去换购出自作品《{{item.title}}》的{{item.name}}。不知道有没有大佬愿意在市场上架这张卡牌！
            </span>
        </p>
        </div>
    </div>
    <div class="log_page">
        <el-pagination
        small
        layout="prev, pager, next"
        :total="logListTotal"
        @current-change="logPageChange"
        :current-page.sync="logPage"
        :page-size="5"
        class="my_card_page">
        </el-pagination>
    </div>
    <div class="wm_battlecard_btn_body">
        <el-button type="primary">发布求购</el-button>
        <el-button type="primary">我的求购</el-button>
    </div>
</div>
</template>

<script>
import {PrefixInteger,scrollToTop,md5Check} from "../../../utils/utils";
import md5_ from 'js-md5';
import {authApi} from "../../api";

export default {
  data() {
    return {
        txDays:new Date().getDate(),
        logListTotal:0,
        logPage:1,
        wantLog:[{"cardId":2,"star":1,"wantPrice":30,"time":"1558934009","md5":"fbb31d99a24cf9a56c48b44dd0797d22","name":"键村叶月（崩）","nickName":"广树","title":"原书·原书使"},{"cardId":2,"star":1,"wantPrice":30,"time":"1558934009","md5":"fbb31d99a24cf9a56c48b44dd0797d22","name":"键村叶月（崩）","nickName":"广树","title":"原书·原书使"},{"cardId":2,"star":1,"wantPrice":30,"time":"1558934009","md5":"fbb31d99a24cf9a56c48b44dd0797d22","name":"键村叶月（崩）","nickName":"广树","title":"原书·原书使"},{"cardId":2,"star":1,"wantPrice":30,"time":"1558934009","md5":"fbb31d99a24cf9a56c48b44dd0797d22","name":"键村叶月（崩）","nickName":"广树","title":"原书·原书使"},{"cardId":2,"star":1,"wantPrice":30,"time":"1558934009","md5":"fbb31d99a24cf9a56c48b44dd0797d22","name":"键村叶月（崩）","nickName":"广树","title":"原书·原书使"},{"cardId":2,"star":1,"wantPrice":30,"time":"1558934009","md5":"fbb31d99a24cf9a56c48b44dd0797d22","name":"键村叶月（崩）","nickName":"广树","title":"原书·原书使"},{"cardId":2,"star":1,"wantPrice":30,"time":"1558934009","md5":"fbb31d99a24cf9a56c48b44dd0797d22","name":"键村叶月（崩）","nickName":"广树","title":"原书·原书使"}],
    }
  },
  filters:{
    capitalize(value) {
      var date = new Date(parseInt(value*1000));
      var tt = [date.getFullYear(), ((date.getMonth()+1)<10?'0'+(date.getMonth()+1):date.getMonth()+1), (date.getDate()<10?'0'+date.getDate():date.getDate())].join('-') + '  ' +[(date.getHours()<10?'0'+date.getHours():date.getHours()), (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()), (date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds())].join(':');
      return tt;
    }
  },
  created() {

  },
  methods: {
    logPageChange(val){
      this.logPage = val;
      this.getWant();
    },
  }
}
</script>

<style>

</style>
