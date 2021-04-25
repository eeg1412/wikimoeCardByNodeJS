<template>
  <div class="wm_market_content_body">
    <div class="wm_market_buy_search_body">
      <div class="wm_market_buy_search_box">
        <el-form :inline="true"
                 :model="searchForm"
                 class="demo-form-inline">
          <el-form-item label="关键词">
            <el-input v-model="searchForm.text"
                      placeholder="请输入搜索内容"
                      @keyup.enter.native="search"
                      class="wm_market_buy_search_slot_input">
              <el-select v-model="searchForm.name"
                         placeholder="关键词"
                         class="wm_market_buy_search_slot_select"
                         slot="prepend">
                <el-option label="角色名"
                           value="name"></el-option>
                <el-option label="作品"
                           value="title"></el-option>
                <el-option label="卡牌ID"
                           value="cardId"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="选择卡包">
            <el-select v-model="seledCardPackage"
                       placeholder="选择卡包"
                       class="wm_market_buy_search_select">
              <el-option v-for="item in cardPackage"
                         :key="item.packageId"
                         :label="item.name"
                         :value="item.packageId">
                <span>{{item.name}}({{marketCount[item.packageId] || 0}})</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择星级">
            <el-select v-model="searchForm.star"
                       placeholder="星级"
                       class="wm_market_buy_search_select">
              <el-option label="全部"
                         value="0"></el-option>
              <el-option label="1星"
                         value="1"></el-option>
              <el-option label="2星"
                         value="2"></el-option>
              <el-option label="3星"
                         value="3"></el-option>
              <el-option label="4星"
                         value="4"></el-option>
              <el-option label="5星"
                         value="5"></el-option>
              <el-option label="6星"
                         value="6"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设置排序">
            <el-select v-model="searchForm.sort"
                       placeholder="排序"
                       class="wm_market_buy_search_select">
              <el-option label="默认"
                         value="0"></el-option>
              <el-option label="价格从低到高"
                         value="1"></el-option>
              <el-option label="价格从高到低"
                         value="2"></el-option>
              <el-option label="星级从低到高"
                         value="3"></el-option>
              <el-option label="星级从高到底"
                         value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-tooltip class="item"
                      effect="dark"
                      content="如果指定卡牌ID搜索，此筛选条件将失效。"
                      placement="top">
            <el-form-item label="是否拥有">
              <el-select v-model="searchForm.ihave"
                         placeholder="拥有"
                         class="wm_market_buy_search_select">
                <el-option label="全部"
                           value="0"></el-option>
                <el-option label="拥有"
                           value="1"></el-option>
                <el-option label="未拥有"
                           value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-tooltip>
          <el-form-item class="wm_market_buy_search_btn_body">
            <el-button type="primary"
                       @click="search">查询</el-button>
            <el-button @click="clearSearch">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div>
      <transition name="el-fade-in-linear">
        <div class="wm_market_card_datail_charts_empty"
             v-if="cardList.length<=0&&!pageChangeing">
          <span v-if="!loadingMarket">市场空空如也</span>
          <span v-else>市场加载中</span>
          <div class="wm_market_buy_want"
               v-if="want=='1'&&!loadingMarket">
            <el-button type="primary"
                       @click="wantDialog=true">发布求购</el-button>
          </div>
        </div>
      </transition>
      <transition name="el-fade-in-linear">
        <div class="wm_mycard_list"
             v-if="cardList.length>0">
          <div class="wm_market_mycard_item type_mobile"
               v-for="(item,index) in cardList"
               v-bind:key="index+1">
            <div class="wm_getcard_img_box"
                 @click="buyCard(item)">
              <div class="wm_getcard_img_checked"
                   v-if="haveCardCheck(item.cardId)>0"><i class="el-icon-check"></i></div>
              <img class="wm_getcard_img"
                   :src="$wikimoecard.url+item.packageId+'/'+item.cardId+'.jpg'">
            </div>
            <div class="wm_card_nums"><span class="wm_top_info_star">★</span>{{item.price}}</div>
          </div>
          <div class="wm_market_buy_want"
               v-if="want=='1'&&!loadingMarket">
            <el-button type="primary"
                       @click="wantDialog=true">发布求购</el-button>
          </div>
        </div>
      </transition>
      <div class="wm_market_content_page"
           v-if="cardTotle">
        <el-pagination small
                       layout="prev, pager, next"
                       :total="cardTotle"
                       @current-change="cardPageChange"
                       :current-page.sync="cardPage"
                       :page-size="20"
                       class="my_card_page">
        </el-pagination>
      </div>
    </div>
    <el-dialog v-if="wantDialog"
               title="发布求购"
               :visible.sync="wantDialog"
               :append-to-body="true"
               :close-on-click-modal="false"
               class="reg_code_dialog"
               width="100%">
      <div>
        <div class="wm_market_card_datail_captcha">
          <div class="tc mb15">Tip:求购信息有效期为3天。</div>
          <el-form ref="form"
                   label-width="80px">
            <el-form-item label="验证码">
              <el-input placeholder="请输入计算结果"
                        v-model="captcha"
                        type="tel">
                <template slot="append"><img class="reg_code_img"
                       :src="captchaSrc"
                       @click="captchaUpdata"></template>
              </el-input>
            </el-form-item>
            <el-form-item label="期望星星"
                          style="margin-bottom:0px">
              <el-input-number class="wm_market_card_datail_price_input_box"
                               size="medium"
                               v-model="price"
                               :precision="0"
                               :step="1"
                               :max="99999999"
                               :min="minPrice"></el-input-number>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="wantDialog = false">取消</el-button>
        <el-button type="primary"
                   @click="wantCard">求购</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { PrefixInteger, scrollToTop, md5Check, packageSort } from "../../../utils/utils";
import md5_ from 'js-md5';
import { authApi } from "../../api";

export default {
  data () {
    return {
      marketCount: {},
      price: 0,
      minPrice: 0,
      captcha: '',
      captchaSrc: '/api/captcha?time=' + new Date().getTime(),
      wantDialog: false,
      wantId: this.$route.query.wantid,
      want: this.$route.query.want,
      wantStar: this.$route.query.wantstar || '1',
      token: sessionStorage.getItem("token") ? sessionStorage.getItem("token") : localStorage.getItem("token"),
      cardList: [],
      myCard: {},
      cardPage: Number(this.$route.query.page) || 1,//当前卡牌页码
      cardTotle: 0,//一共多少
      pageChangeing: false,
      searchForm: {
        name: this.$route.query.name || 'name',
        text: decodeURIComponent(this.$route.query.text || ''),
        star: this.$route.query.star || '0',
        sort: this.$route.query.sort || '0',
        ihave: this.$route.query.ihave || '0'
      },
      loadingMarket: true,
      seledCardPackage: this.$route.query.packageId || '-1',
      cardPackage: [
        {
          name: "加载中...",
          packageId: "-1"
        }
      ],
    }
  },
  created () {
    this.getCardPackage();
    this.searchMarketCount()
    if (this.want == '1') {
      this.calMinPrice();
    }
  },
  mounted () {
    this.$emit('l2dMassage', '这里可以购买由玩家贩卖的卡牌，不知道有没有你心仪的卡呀！');
  },
  methods: {
    searchMarketCount () {
      this.marketCount = {}
      authApi.searchMarketCount({ token: this.token }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          const data = res.data.data
          const marketCountData = {}
          data.forEach(item => {
            marketCountData[item._id] = item.count
          });
          this.marketCount = marketCountData
        }
      });
    },
    getCardPackage () {
      authApi.searchcardpackage({ sortType: "default" }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.cardPackage = res.data.data;
          // 给卡包排序
          this.cardPackage = packageSort(this.cardPackage, res.data.sortData, "default");
          if (this.cardPackage.length > 0 && this.seledCardPackage === "-1") {
            this.seledCardPackage = this.cardPackage[0].packageId;
          }
          this.getUserCard();
        }
      });
    },
    wantCard () {
      let params = {
        token: this.token,
        price: this.price,
        captcha: this.captcha,
        cardId: this.wantId
      }
      authApi.wantcard(params).then(res => {
        console.log(res);
        this.captchaUpdata();
        this.loadingMarket = false;
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
          this.wantDialog = false;
        }
      });
    },
    calMinPrice () {
      // 计算最低售价
      if (this.wantStar == 6) {
        this.minPrice = 600;
      } else if (this.wantStar == 5) {
        this.minPrice = 200;
      } else if (this.wantStar == 4) {
        this.minPrice = 90;
      } else {
        this.minPrice = 30;
      }
    },
    captchaUpdata () {
      this.captchaSrc = '/api/captcha?time=' + new Date().getTime();
    },
    haveCardCheck (cardID) {
      let cardHave = this.myCard[cardID]
      if (cardHave) {
        return cardHave;
      } else {
        return 0;
      }
    },
    getUserCard () {
      authApi.searchcardbytoken({ token: this.token, packageId: this.seledCardPackage }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          let resData = res.data;
          if (res.data.card) {
            this.myCard = res.data.cardCount;
            console.log(this.myCard);
          }
          this.getUserMarket();
        }
      });
    },
    buyCard (data) {
      let cardHave = this.haveCardCheck(data.cardId);
      this.$router.push({
        name: 'cardDetail',
        query: {
          type: 'buy',
          have: cardHave,
          card: data.cardId,
          price: data.price,
          time: data.time,
          id: data._id,
          packageId: data.packageId,
          star: data.star,
          title: encodeURIComponent(data.title),
          name: encodeURIComponent(data.name)
        }
      });
    },
    cardPageChange (val) {
      this.cardPage = val;
      this.getUserMarket();
      this.$router.replace({
        name: 'buyCard',
        query: {
          page: val,
          name: this.searchForm.name,
          text: encodeURIComponent(this.searchForm.text),
          star: this.searchForm.star,
          sort: this.searchForm.sort,
          have: this.searchForm.ihave,
          packageId: this.seledCardPackage
        }
      });
    },
    getUserMarket () {
      let params = {
        type: 'search',
        token: this.token,
        page: this.cardPage,
        name: this.searchForm.name,
        text: this.searchForm.text,
        star: this.searchForm.star,
        sort: this.searchForm.sort,
        have: this.searchForm.ihave,
        packageId: this.seledCardPackage
      }
      authApi.marketbuy(params).then(res => {
        console.log(res);
        this.loadingMarket = false;
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          if (res.data.data.length === 0 && this.cardPage !== 1) {
            this.cardPage = 1;
            this.$router.replace({
              name: 'buyCard',
              query: {
                page: this.cardPage,
                name: this.searchForm.name,
                text: encodeURIComponent(this.searchForm.text),
                star: this.searchForm.star,
                sort: this.searchForm.sort,
                ihave: this.searchForm.ihave
              }
            });
            this.getUserMarket();
          }
          if (res.data.data.length > 0) {
            this.pageChangeing = true;
          }
          this.cardList = [];
          setTimeout(() => {
            this.pageChangeing = false;
            this.cardList = res.data.data;
            if (this.$route.query.page) {
              scrollToTop(250, 200)
            }
          }, 100)
          this.cardTotle = res.data.totle;
        }
      });
    },
    search () {
      this.searchMarketCount()
      this.cardPage = 1;
      this.$router.replace({
        name: 'buyCard',
        query: {
          page: this.cardPage,
          name: this.searchForm.name,
          text: encodeURIComponent(this.searchForm.text),
          star: this.searchForm.star,
          sort: this.searchForm.sort,
          ihave: this.searchForm.ihave,
          packageId: this.seledCardPackage
        }
      });
      this.getUserCard();
    },
    clearSearch () {
      this.cardPage = 1;
      this.searchForm = {
        name: 'name',
        text: '',
        star: '0',
        sort: '0'
      }
      this.$router.replace({
        name: 'buyCard',
        query: {
          page: this.cardPage,
          name: this.searchForm.name,
          text: encodeURIComponent(this.searchForm.text),
          star: this.searchForm.star,
          sort: this.searchForm.sort,
        }
      });
      this.getUserMarket();
    },
    PrefixInteger_ (num, length) {
      return PrefixInteger(num, length);
    },
  }
}
</script>

<style>
.wm_market_buy_want {
  margin-top: 10px;
}
.wm_market_buy_search_slot_select {
  width: 100px;
}
.wm_market_buy_search_slot_input {
  width: 240px;
}
.wm_market_buy_button_group {
  display: block;
  margin-top: 5px;
}
</style>
