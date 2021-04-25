<template>
  <div class="wm_market_content_body">
    <transition name="el-fade-in-linear">
      <div class="wm_market_selling_body"
           v-if="myMarket.length>0">
        <h5 class="common_title type_shop">贩卖中的卡牌</h5>
        <div class="wm_mycard_list">
          <div class="wm_market_mycard_item type_mobile"
               v-for="(item,index) in myMarket"
               v-bind:key="index+1"
               @click="editCard(item,item.time,item.selled,item.price,item._id)">
            <img class="wm_getcard_img"
                 :src="$wikimoecard.url+item.packageId+'/'+item.cardId+'.jpg'">
            <div class="wm_card_nums"><span class="wm_top_info_star">★</span>{{item.price}}</div>
            <div class="wm_market_selling_tag"
                 v-if="item.selled || serverTime-item.time>2592000">
              <!-- 更新点击事件记得更新标签 -->
              <el-tag type="success"
                      v-if="item.selled"
                      class="wm_market_selling_tag_item"
                      @click.stop="editCard(item,item.time,item.selled,item.price,item._id)">可收取星星</el-tag>
              <el-tag type="danger"
                      v-if="serverTime-item.time>2592000 && !item.selled"
                      class="wm_market_selling_tag_item"
                      @click.stop="editCard(item,item.time,item.selled,item.price,item._id)">过期请更新</el-tag>
            </div>
          </div>
        </div>
        <div class="wm_market_content_page">
          <el-pagination small
                         layout="prev, pager, next"
                         :total="sellCardTotle"
                         @current-change="sellCardPageChange"
                         :current-page.sync="sellCardPage"
                         :page-size="20"
                         class="my_card_page">
          </el-pagination>
        </div>
        <div class="wm_market_btn_body">
          <el-button type="primary"
                     @click="updataMany('getstarMany')">一键领取</el-button>
          <el-button type="primary"
                     @click="updataMany('updateMany')">一键更新</el-button>
        </div>
      </div>
    </transition>
    <div>
      <h5 class="common_title type_shop">可卖的卡牌</h5>
      <div class="tc">
        <el-form :inline="true"
                 :model="searchForm"
                 class="demo-form-inline">
          <el-form-item label="选择卡包">
            <el-select v-model="seledCardPackage"
                       placeholder="选择卡包"
                       class="wm_cardlist_select type_120"
                       @change="changepackageId">
              <el-option v-for="item in cardPackage"
                         :key="item.packageId"
                         :label="item.name"
                         :value="item.packageId">
                <span>{{item.name}}({{cardCount[item.packageId] || 0}}/{{item.oneStar+item.twoStar+item.threeStar+item.fourStar+item.fiveStar+item.sixStar}})</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择星级">
            <el-select v-model="searchForm.star"
                       class="wm_cardlist_select type_120"
                       @change="searchChanged">
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
          <el-form-item label="水晶属性">
            <el-select class="wm_cardlist_select type_120"
                       @change="searchChanged"
                       v-model="searchForm.cry"
                       placeholder="筛选水晶属性">
              <el-option label="全部"
                         value="0"></el-option>
              <el-option label="红火"
                         value="1"></el-option>
              <el-option label="蓝水"
                         value="2"></el-option>
              <el-option label="绿风"
                         value="3"></el-option>
              <el-option label="光"
                         value="4"></el-option>
              <el-option label="暗"
                         value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="被动属性">
            <el-select class="wm_cardlist_select type_120"
                       @change="searchChanged"
                       v-model="searchForm.leftType"
                       placeholder="筛选被动属性">
              <el-option label="全部"
                         value="0"></el-option>
              <el-option label="全能"
                         value="1"></el-option>
              <el-option label="兵攻"
                         value="2"></el-option>
              <el-option label="盾防"
                         value="3"></el-option>
              <el-option label="速度"
                         value="4"></el-option>
              <el-option label="爱心"
                         value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主动技能">
            <el-select class="wm_cardlist_select type_120"
                       @change="searchChanged"
                       v-model="searchForm.rightType"
                       placeholder="筛选主动技能">
              <el-option label="全部"
                         value="0"></el-option>
              <el-option label="物"
                         value="1"></el-option>
              <el-option label="魔"
                         value="2"></el-option>
              <el-option label="防"
                         value="3"></el-option>
              <el-option label="治"
                         value="4"></el-option>
              <el-option label="妨"
                         value="5"></el-option>
              <el-option label="支"
                         value="6"></el-option>
              <el-option label="特"
                         value="7"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否求购">
            <el-select v-model="searchForm.havewant"
                       class="wm_cardlist_select type_120"
                       @change="searchChanged">
              <el-option label="全部"
                         value="0"></el-option>
              <el-option label="有求购"
                         value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设置排序">
            <el-select class="wm_cardlist_select type_120"
                       @change="searchChanged"
                       v-model="searchForm.sort"
                       placeholder="设置排序">
              <el-option label="求购优先"
                         value="0"></el-option>
              <el-option label="星级高到低"
                         value="1"></el-option>
              <el-option label="星级低到高"
                         value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <transition name="el-fade-in-linear">
        <div class="wm_market_tips"
             v-if="userCard.length<=0&&!pageChangeing">该条件下暂时没有可以卖的卡牌！</div>
      </transition>
      <el-collapse-transition>
        <div class="wm_mycard_list"
             v-if="userCard.length>0">
          <div v-for="(item,index) in userCard"
               v-bind:key="index+1"
               class="wm_getcard_box type_mobile wm_market_cansell_card"
               @click="upCard(item)">
            <img class="wm_getcard_img"
                 :src="$wikimoecard.url+item.packageId+'/'+item.cardId+'.jpg'">
            <div class="wm_card_nums">可卖{{item.count-1}}张</div>
            <div class="wm_card_want_nums"
                 v-if="wantList[item.cardId]">{{wantList[item.cardId]}}人想要</div>
          </div>
        </div>
      </el-collapse-transition>
      <div class="wm_market_content_page">
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
    <captcha @captchaShow="captchaDigShow"
             @send="sendCaptcha"
             :codeDigShow="captchaShow"
             v-if="captchaShow"
             ref="captch"></captcha>
  </div>
</template>

<script>
import { md5Check, PrefixInteger, scrollToTop, packageSort } from "../../../utils/utils";
import md5_ from 'js-md5';
import { authApi } from "../../api";
import captcha from "../../components/captcha"
// 状态
// 0:未上架
// 1：可修改（可更新上架时间、价格、下架）
// 2：已售出（仅可收取星星）

export default {
  data () {
    return {
      cardCount: {},
      oneKeyType: '',
      captchaShow: false,
      token: sessionStorage.getItem("token") ? sessionStorage.getItem("token") : localStorage.getItem("token"),
      userCard: [],//用户当前页卡牌
      userCardCache: [],//用户卡牌
      cardPage: Number(this.$route.query.page) || 1,//当前卡牌页码
      cardTotle: 0,//一共多少
      myMarket: [],//自己上架的卡牌
      serverTime: 0,//服务器时间
      pageChangeing: false,
      wantList: {},//想要列表
      searchForm: {
        star: this.$route.query.star || '0',
        havewant: this.$route.query.havewant || '0',
        cry: this.$route.query.cry || '0',
        rightType: this.$route.query.rightType || '0',
        leftType: this.$route.query.leftType || '0',
        sort: this.$route.query.sort || '0'
      },
      sellCardTotle: 0,
      sellCardPage: Number(this.$route.query.sellPage) || 1,
      seledCardPackage: this.$route.query.packageId || '-1',
      cardPackage: [
        {
          name: "加载中...",
          packageId: "-1"
        }
      ],
    }
  },
  components: {
    captcha
  },
  mounted () {
    this.$emit('l2dMassage', '这里可以寄售多余的卡牌来换取星星。');
    this.getUserMarket(this.sellCardPage);
    this.getCardPackage();
    this.searchCardCount();
  },
  methods: {
    searchCardCount () {
      authApi.searchCardCount({ token: this.token }).then(res => {
        console.log(res);
        if (res.data.code === 1) {
          this.cardCount = res.data.cardCount
        }
      });
    },
    changepackageId () {
      this.searchForm = {
        star: '0',
        havewant: '0',
        cry: '0',
        rightType: '0',
        leftType: '0',
        sort: '0'
      }
      this.cardPage = 1;
      this.getWant();
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
          this.getWant();
        }
      });
    },
    sellCardPageChange (p) {
      this.getUserMarket(p);
      scrollToTop(180, 200)
    },
    searchChanged () {
      this.cardPage = 1;
      this.cardPageChange(1);
    },
    getWant () {
      let params = {
        token: this.token,
        packageId: this.seledCardPackage
      }
      authApi.searchwantcard(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          let wantListObj = {};
          for (let i = 0; i < res.data.data.length; i++) {
            wantListObj[res.data.data[i]['_id']] = res.data.data[i]['count'];
          }
          this.wantList = wantListObj;
          this.getUserCard();
        }
      })
    },
    updataMany (type) {
      this.oneKeyType = type;
      this.captchaShow = true;
    },
    sendCaptcha (v) {
      console.log(v);
      let params = {
        type: this.oneKeyType,
        token: this.token,
        captcha: v
      }
      authApi.marketsell(params).then(res => {
        console.log(res);
        this.$refs.captch.captchaUpdata();
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.captchaShow = false;
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
          this.sellCardPage = 1;
          this.getUserMarket(this.sellCardPage);
          this.$emit('updateUserinfo');
        }
      });
    },
    captchaDigShow (v) {
      this.captchaShow = v;
    },
    editCard (data, time, selled, price, id) {
      let stat = 1;
      if (selled) {
        stat = 2;
      }
      this.$router.push({
        name: 'cardDetail',
        query: {
          type: 'sell',
          card: data.cardId,
          stat: stat,
          price: price,
          time: time,
          id: id,
          packageId: data.packageId,
          star: data.star,
          title: encodeURIComponent(data.title),
          name: encodeURIComponent(data.name)
        }
      });
    },
    getUserMarket (page) {
      let params = {
        type: 'search',
        token: this.token,
        page: page
      }
      authApi.marketsell(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          if (res.data.data.length <= 0 && this.sellCardPage > 1) {
            this.sellCardPage = 1;
            this.getUserMarket(1);
            this.$router.replace({
              name: 'sellCard',
              query: {
                page: this.cardPage,
                star: this.searchForm.star,
                havewant: this.searchForm.havewant,
                sellPage: this.sellCardPage
              }
            });
            return false;
          }
          this.myMarket = [];
          setTimeout(() => {
            this.myMarket = res.data.data;
          }, 200)
          this.serverTime = res.data.time;
          this.sellCardTotle = res.data.totle;
          this.$router.replace({
            name: 'sellCard',
            query: {
              page: this.cardPage,
              star: this.searchForm.star,
              havewant: this.searchForm.havewant,
              sellPage: this.sellCardPage
            }
          });
        }
      });
    },
    upCard (data) {
      this.$router.push({
        name: 'cardDetail',
        query: {
          type: 'sell',
          card: data.cardId,
          stat: 0,
          packageId: data.packageId,
          star: data.star,
          title: encodeURIComponent(data.title),
          name: encodeURIComponent(data.name)
        }
      });
    },
    PrefixInteger_ (num, length) {
      return PrefixInteger(num, length);
    },
    cardPageChange (val) {
      let that = this;
      // 筛选条件
      function setStar (item) {
        let p_ = that.searchForm.star;
        if (p_ === '0') {
          return true;
        } else if (item.star == p_) {
          return true;
        }
        return false;
      }
      function setCry (item) {
        let p_ = that.searchForm.cry;
        if (p_ === '0') {
          return true;
        } else if (item == p_) {
          return true;
        }
        return false;
      }
      function setRightType (item) {
        let p_ = that.searchForm.rightType;
        if (p_ === '0') {
          return true;
        } else if (item == p_) {
          return true;
        }
        return false;
      }
      function setLeftType (item) {
        let p_ = that.searchForm.leftType;
        if (p_ === '0') {
          return true;
        } else if (item == p_) {
          return true;
        }
        return false;
      }
      function setSort (a, b) {
        let sort_ = that.searchForm.sort;
        if (sort_ === '0') {
          const aWant = that.wantList[a.cardId] || 0;
          const bWant = that.wantList[b.cardId] || 0;
          // 如果有求卡则排前
          if (aWant || bWant) {
            if (aWant === bWant) {
              return b.star - a.star;
            } else {
              return bWant - aWant;
            }
          } else if (a.star < b.star) {
            return 1;
          } else if (a.star > b.star) {
            return -1;
          } else {
            return b.cardId - a.cardId;
          }
        } else if (sort_ === '1') {
          if (a.star < b.star) {
            return 1;
          } else if (a.star > b.star) {
            return -1;
          } else {
            return b.cardId - a.cardId;
          }
        }
        else if (sort_ === '2') {
          return a.star - b.star;
        }
      }
      function setwant (item) {
        let p_ = that.searchForm.havewant;
        if (p_ === '0') {
          return true;
        } else if (that.wantList[item] > 0) {
          return true;
        }
        return false;
      }
      let userCardSearchRes = this.userCardCache.filter(item => setStar(item) && setCry(item.cry) && setRightType(item.rightType) && setLeftType(item.leftType) && setwant(item.cardId));
      userCardSearchRes = userCardSearchRes.sort(setSort);
      let userCard_ = userCardSearchRes.slice((val - 1) * 20, val * 20);
      this.cardTotle = userCardSearchRes.length;
      if (userCard_.length > 0) {
        this.pageChangeing = true;
      }
      this.userCard = [];
      setTimeout(() => {
        this.pageChangeing = false;
        this.userCard = userCard_;
      }, 300)
      console.log(this.seledCardPackage);
      this.$router.replace({
        name: 'sellCard',
        query: {
          page: this.cardPage,
          star: this.searchForm.star,
          cry: this.searchForm.cry,
          rightType: this.searchForm.rightType,
          leftType: this.searchForm.leftType,
          sort: this.searchForm.sort,
          havewant: this.searchForm.havewant,
          sellPage: this.sellCardPage,
          packageId: this.seledCardPackage
        }
      });
      console.log(this.$route.query.packageId);
    },
    checkCanBuy (item) {
      return item.count > 1;
    },
    getUserCard () {
      authApi.searchcardbytoken({ token: this.token, packageId: this.seledCardPackage }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          let resData = res.data;
          if (res.data.card) {
            this.userCardCache = res.data.card || [];
            let userCardCount = res.data.cardCount;
            for (let i = 0; i < this.userCardCache.length; i++) {
              this.userCardCache[i]['count'] = userCardCount[this.userCardCache[i].cardId] || 0;
            }
            this.userCardCache = this.userCardCache.filter(this.checkCanBuy);
            this.cardTotle = this.userCardCache.length;
            this.cardPageChange(this.cardPage);
          } else {
            this.$message({
              message: resData.nickName + '还没有获得过卡牌呢！',
              type: 'warning'
            });
          }
        }
      });
    },
  }
}
</script>

<style scoped>
.wm_market_cansell_card {
  position: relative;
  z-index: 1;
}
.wm_card_want_nums {
  position: absolute;
  z-index: 1;
  right: 10px;
  bottom: 46px;
  background-color: rgba(255, 255, 255, 0.85);
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 12px;
  color: #ff5364;
}
</style>
