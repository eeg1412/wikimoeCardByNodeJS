<template>
<div class="wm_market_content_body">
    <div class="wm_market_buy_search_body">
      <div class="wm_market_buy_search_box">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="关键词">
            <el-select v-model="searchForm.name" placeholder="搜索名称">
              <el-option label="角色名" value="name"></el-option>
              <el-option label="作品" value="title"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchForm.text" placeholder="请输入搜索内容"></el-input>
          </el-form-item>
          <el-form-item label="星级">
            <el-select v-model="searchForm.star" placeholder="搜索星级">
              <el-option label="全部" value="0"></el-option>
              <el-option label="1星" value="1"></el-option>
              <el-option label="2星" value="2"></el-option>
              <el-option label="3星" value="3"></el-option>
              <el-option label="4星" value="4"></el-option>
              <el-option label="5星" value="5"></el-option>
              <el-option label="6星" value="6"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序">
            <el-select v-model="searchForm.sort" placeholder="排序">
              <el-option label="默认" value="0"></el-option>
              <el-option label="价格从低到高" value="1"></el-option>
              <el-option label="价格从高到低" value="2"></el-option>
              <el-option label="星级从低到高" value="3"></el-option>
              <el-option label="星级从高到底" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="wm_market_buy_search_btn_body">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="clearSearch">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div>
      <transition name="el-fade-in-linear">
        <div class="wm_market_card_datail_charts_empty" v-if="cardList.length<=0&&!pageChangeing">
          市场空空如也
        </div>
      </transition>
      <el-collapse-transition>
        <div class="wm_mycard_list" v-if="cardList.length>0">
            <div class="wm_market_mycard_item" v-for="(item,index) in cardList" v-bind:key="index+1" @click="buyCard(item.cardId,item.time,item.price,item._id)">
                <img class="wm_getcard_img" :src="'/static/img/'+PrefixInteger_(item.cardId,4)+'.jpg'">
                <div class="wm_card_nums"><span class="wm_top_info_star">★</span>{{item.price}}</div>
            </div>
        </div>
      </el-collapse-transition>
      <div class="wm_market_content_page" v-if="cardTotle">
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
import {PrefixInteger} from "../../../utils/utils";
import md5_ from 'js-md5';
import {authApi} from "../../api";

export default {
  data() {
    return {
      token:sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token"),
      cardList:[],
      cardPage:Number(this.$route.query.page) || 1,//当前卡牌页码
      cardTotle:0,//一共多少
      pageChangeing:false,
      searchForm:{
        name:this.$route.query.name || 'name',
        text:decodeURIComponent(this.$route.query.text||''),
        star:this.$route.query.star || '0',
        sort:this.$route.query.sort || '0'
      }
    }
  },
  created() {
    this.getUserMarket();
  },
  methods: {
    buyCard(cardId,time,price,id){
        this.$router.push({ 
          name:'cardDetail',
          query: {
            type:'buy',
            card:cardId,
            price:price,
            time:time,
            id:id
          }
        });
    },
    cardPageChange(val){
      this.cardPage = val;
      this.getUserMarket();
    },
    getUserMarket(){
        let params = {
            type:'search',
            token:this.token,
            page:this.cardPage,
            name:this.searchForm.name,
            text:this.searchForm.text,
            star:this.searchForm.star,
            sort:this.searchForm.sort,
        }
        authApi.marketbuy(params).then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            if(res.data.data.length===0&&this.cardPage!==1){
              this.cardPage = 1;
              this.$router.replace({ 
                name:'buyCard',
                query: {
                  page:this.cardPage,
                  name:this.searchForm.name,
                  text:encodeURIComponent(this.searchForm.text),
                  star:this.searchForm.star,
                  sort:this.searchForm.sort,
                }
              });
              this.getUserMarket();
            }
            if(res.data.data.length>0){
              this.pageChangeing = true;
            }
            this.cardList = [];
            setTimeout(()=>{
              this.pageChangeing = false;
              this.cardList = res.data.data;
            },300)
            this.cardTotle = res.data.totle;
          }
        });
    },
    search(){
      this.cardPage = 1;
      this.$router.replace({ 
        name:'buyCard',
        query: {
          page:this.cardPage,
          name:this.searchForm.name,
          text:encodeURIComponent(this.searchForm.text),
          star:this.searchForm.star,
          sort:this.searchForm.sort,
        }
      });
      this.getUserMarket();
    },
    clearSearch(){
      this.cardPage = 1;
      this.searchForm= {
        name:'name',
        text:'',
        star:'0',
        sort:'0'
      }
      this.$router.replace({ 
        name:'buyCard',
        query: {
          page:this.cardPage,
          name:this.searchForm.name,
          text:encodeURIComponent(this.searchForm.text),
          star:this.searchForm.star,
          sort:this.searchForm.sort,
        }
      });
      this.getUserMarket();
    },
    PrefixInteger_(num,length){
      return PrefixInteger(num,length);
    },
  }
}
</script>

<style lang="stylus" scoped>
</style>
