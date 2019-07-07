<template>
<div class="wm_market_content_body">
  <div class="tc">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="星级">
          <el-select v-model="searchForm.star" class="wm_market_buy_search_select">
            <el-option label="全部" value="0"></el-option>
            <el-option label="1星" value="1"></el-option>
            <el-option label="2星" value="2"></el-option>
            <el-option label="3星" value="3"></el-option>
            <el-option label="4星" value="4"></el-option>
            <el-option label="5星" value="5"></el-option>
            <el-option label="6星" value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="我的">
          <el-select v-model="searchForm.isMy" class="wm_market_buy_search_select">
            <el-option label="否" value="0"></el-option>
            <el-option label="是" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="wm_market_buy_search_btn_body">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="clearSearch">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="wm_market_card_datail_charts_empty" v-if="wantLog.length<=0">
        <span>暂无求购信息</span>
    </div>
    <div class="wm_card_get_list_item" v-for="(item,index) in wantLog" v-bind:key="index+1">
        <div class="wm_card_get_list_avatar">
        <el-tooltip class="item" effect="dark" :content="'查看'+item.nickName+'的卡牌'" placement="top" :hide-after="3000">
            <img class="wm_card_get_list_avatar_pic" :src="'https://gravatar.loli.net/avatar/'+item.md5+'?s=100&amp;d=mm&amp;r=g&amp;d=robohash&days='+txDays" width="45" height="45" @click="watchUserCard(item.md5)">
        </el-tooltip>
        </div>
        <div class="wm_card_get_list_comment">
        <p>
            <span class="wm_log_name">{{item.nickName}}</span>
            <span class="wm_log_time">{{item.time|capitalize}}</span>
        </p>
        <p>
            <span
            >我愿意用<span class="cOrange fb">{{item.wantPrice}}</span>颗左右的星星，去换购出自作品《{{item.title}}》的{{item.star}}星卡<span class="wm_card_get_list_card_link" @click="openImg($wikimoecard.url+item.packageId+'/'+item.cardId+'.jpg')">{{item.name}}</span>。不知道有没有大佬愿意在市场上架这张卡牌！
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
        :page-size="10"
        class="my_card_page">
        </el-pagination>
    </div>
    <div class="wm_marketwant_btn_body">
        <el-button type="primary" @click="qiugou">发布求购</el-button>
    </div>
</div>
</template>

<script>
import {PrefixInteger} from "../../../utils/utils";
import md5_ from 'js-md5';
import {authApi} from "../../api";

export default {
  data() {
    return {
        txDays:new Date().getDate(),
        logListTotal:0,
        logPage:Number(this.$route.query.page) || 1,
        wantLog:[],
        token:sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token"),
        searchForm:{
          star:this.$route.query.star || '0',
          isMy:this.$route.query.my || '0',
        }
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
    this.getWant();
  },
  mounted() {
    this.$emit('l2dMassage','这里可以查看大家的求卡信息，请注意求卡时间，如果过去太长时间，可能对方已经获得了这张卡！');
  },
  methods: {
    watchUserCard(md5){
      this.$router.push({ 
        path:'/',
        query:{md5:md5}
      });
    },
    PrefixInteger_(num,length){
      return PrefixInteger(num,length);
    },
    openImg(imgsrc){
      this.$alert('<div class="watch_img"><img src="'+imgsrc+'" /></div>', '查看卡牌', {
        dangerouslyUseHTMLString: true,
        lockScroll:false
      });
    },
    qiugou(){
      this.$router.push({ 
        name:'handbook',
        query: {
                have:'2',
            }
        });
    },
    clearSearch(){
      this.cardPage = 1;
      this.searchForm = {
        star:'0',
        isMy:'0'
      }
      this.getWant();
    },
    search(){
      this.cardPage = 1;
      this.getWant();
    },
    getWant(){
      let params = {
        cardId:this.cardId,
        page:this.logPage,
        token:this.token,
        type:'search',
        star:this.searchForm.star,
        my:this.searchForm.isMy
      }
      authApi.searchwantcard(params).then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            this.wantLog = res.data.data;
            this.logListTotal = res.data.total;
            if(res.data.data.length===0&&this.logPage!==1){
              this.logPage = 1;
              this.$router.replace({ 
                name:'wantCard',
                query: {
                  page:this.logPage,
                  star:this.searchForm.star,
                  my:this.searchForm.isMy
                }
              });
              this.getWant();
            }else{
              this.$router.replace({ 
                name:'wantCard',
                query: {
                  page:this.logPage,
                  star:this.searchForm.star,
                  my:this.searchForm.isMy
                }
              });
            }
          }
      })
    },
    logPageChange(val){
      this.logPage = val;
      this.getWant();
    },
  }
}
</script>

<style scoped>
.wm_marketwant_btn_body{
  text-align: center;
  margin: 20px 0;
}
</style>
