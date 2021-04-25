<template>
  <div class="common_body">
    <userTop ref="userTop" />
    <decomposehead />
    <div class="wm_market_content_body type_dec">
      <h5 class="common_title type_shop type_dec">卡牌分解</h5>
      <h6 class="common_title_tips type_dec">系统已自动保留一张卡牌</h6>
      <div>
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
            <el-form-item label="是否参战">
              <el-select class="wm_cardlist_select type_120"
                         @change="searchChanged"
                         v-model="searchForm.battle"
                         placeholder="筛选是否参战">
                <el-option label="全部"
                           value="0"></el-option>
                <el-option label="不参战"
                           value="1"></el-option>
                <el-option label="参战"
                           value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设置排序">
              <el-select class="wm_cardlist_select type_120"
                         @change="searchChanged"
                         v-model="searchForm.sort"
                         placeholder="设置排序">
                <el-option label="星级从高到低"
                           value="0"></el-option>
                <el-option label="星级从低到高"
                           value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <transition name="el-fade-in-linear">
          <div class="wm_market_tips"
               v-if="userCard.length<=0&&!pageChangeing">您暂时没有可以分解的卡牌！</div>
        </transition>
        <transition name="el-fade-in-linear">
          <div class="wm_mycard_list type_dec"
               v-if="userCard.length>0">
            <div v-for="(item,index) in userCard"
                 v-bind:key="index+1"
                 class="wm_getcard_box type_mobile"
                 :class="{'type_locked':item.lock}">
              <div class="wm_dec_img_box">
                <div class="wm_dec_can_num">可解:{{item.count-1}}张</div>
                <el-tooltip class="item"
                            effect="dark"
                            :content="item.lock?'点击解锁':'点击锁定'"
                            :enterable="false"
                            :hide-after="1500"
                            placement="bottom">
                  <div class="wm_dec_lock wm_set_pointer"
                       @click="goLockCard(item,index)"><i class="el-icon-lock"
                       v-if="item.lock"></i><i class="el-icon-unlock"
                       v-else></i>{{item.lock?'已锁定':'未锁定'}}</div>
                </el-tooltip>
                <img class="wm_getcard_img"
                     :src="$wikimoecard.url+item.packageId+'/'+item.cardId+'.jpg'">
              </div>
              <div class="wm_dec_input_body">
                <el-input-number :precision="0"
                                 :step="1"
                                 :max="item.count-1"
                                 :min="0"
                                 size="mini"
                                 v-model="item.dec"
                                 class="wm_dec_input"
                                 :disabled="item.lock"
                                 @change="decChange"></el-input-number>
              </div>
            </div>
          </div>
        </transition>
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
      <div class="wm_dec_btn_body"
           v-if="userCardCache.length>0">
        <el-button @click="clear">清空</el-button>
        <el-button @click="dec"
                   type="primary">分解</el-button>
        <el-button @click="decAll"
                   type="primary">全页</el-button>
      </div>
    </div>
    <menuView></menuView>
  </div>
</template>

<script>
import { md5Check, PrefixInteger, packageSort } from "../../utils/utils";
import md5_ from 'js-md5';
import menuView from '../components/menu.vue';
import { authApi } from "../api";
import userTop from '../components/topUserInfo.vue';
import decomposehead from "../components/decomposehead";
import itemData from '../../../../server/data/item';

export default {
  data () {
    return {
      cardCount: {},
      battlecardId: [],
      lockCard: localStorage.getItem("wikimoeLockCard") ? JSON.parse(localStorage.getItem("wikimoeLockCard")) : {},
      token: sessionStorage.getItem("token") ? sessionStorage.getItem("token") : localStorage.getItem("token"),
      userCard: [],//用户当前页卡牌
      userCardCache: [],//用户卡牌
      cardPage: 1,//当前卡牌页码
      cardTotle: 0,//一共多少
      myMarket: [],//自己上架的卡牌
      serverTime: 0,//服务器时间
      pageChangeing: false,
      decCard: {},//待分解卡牌
      starCount: 0,//待分解卡牌价值
      seledCardPackage: '-1',
      cardPackage: [
        {
          name: "加载中...",
          packageId: "-1"
        }
      ],
      searchForm: {
        star: '0',
        cry: '0',
        rightType: '0',
        leftType: '0',
        sort: '0',
        battle: '1'
      },
    }
  },
  components: {
    menuView,
    userTop,
    decomposehead
  },
  created () {
    this.getCardPackage();
  },
  mounted () {
    this.$emit('l2dMassage', '这里可以分解多余的卡牌，但是感觉很不值得，推荐还是将卡牌寄售市场比较好！');
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
    //   锁卡
    goLockCard (card, index) {
      const cardId = card.cardId;
      const lock = card.lock;
      if (lock) {
        this.userCard[index].lock = false;
        delete this.lockCard[card.cardId];
      } else {
        this.userCard[index].lock = true;
        this.userCard[index].dec = 0;
        this.lockCard[card.cardId] = true;
      }
      localStorage.setItem("wikimoeLockCard", JSON.stringify(this.lockCard));
      this.$forceUpdate();
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
          };
          this.getMyBattleCard();
        }
      });
    },
    clear () {
      for (let i = 0; i < this.userCard.length; i++) {
        this.userCard[i].dec = 0;
      }
      this.$forceUpdate();
    },
    decChange () {
      this.$forceUpdate();
    },
    dec () {
      this.countCardStar();
      if (this.starCount <= 0) {
        this.$message.error('请设置要分解的卡牌数量！');
        return false;
      }
      this.$confirm('分解卡牌后将会获得<span class="cOrange">' + this.starCount + '</span>颗星星和对应的碎片，是否要继续分解？', '提示', {
        confirmButtonText: '分解',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.goDecCard();
      }).catch(() => {

      });
    },
    goDecCard () {
      let cardId = [];
      let cardCount = [];
      for (let i = 0; i < this.userCard.length; i++) {
        if (this.userCard[i].dec > 0) {
          cardId.push(this.userCard[i].cardId);
          cardCount.push(this.userCard[i].dec);
        }
      }
      let params = {
        token: this.token,
        cardId: cardId,
        packageId: this.seledCardPackage,
        cardCount: cardCount
      }
      authApi.decompose(params).then(res => {
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          let getItemArr = Object.entries(res.data.getItem);
          let geitItemHtml = '';
          for (let i = 0; i < getItemArr.length; i++) {
            geitItemHtml = geitItemHtml + '、<span class="cOrange">' + itemData[getItemArr[i][0]].name + '×' + getItemArr[i][1] + '</span>'
          }
          this.$message({
            message: '成功分解出<span class="cOrange">星星×' + res.data.star + '</span>' + geitItemHtml + '。',
            type: 'success',
            dangerouslyUseHTMLString: true
          });
          this.getUserCard();
          this.$refs.userTop.getUserInfo();
        }
      });
    },
    decAll () {
      for (let i = 0; i < this.userCard.length; i++) {
        if (!this.userCard[i].lock) {
          this.userCard[i].dec = this.userCard[i].count - 1;
        }
      }
      this.$forceUpdate();
      this.countCardStar();
      if (this.starCount <= 0) {
        this.$message.error('该页没有能分解的卡牌！');
        return false;
      }
      this.$confirm('分解卡牌后将会获得<span class="cOrange">' + this.starCount + '</span>颗星星和对应的碎片，是否要继续分解？', '提示', {
        confirmButtonText: '分解',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.goDecCard();
      }).catch(() => {

      });
    },
    countCardStar () {
      let cardObj = {};
      let star = 0;
      for (let i = 0; i < this.userCard.length; i++) {
        let num = this.userCard[i].dec;
        if (num > 0) {
          star = star + this.userCard[i].star * num;
          cardObj[this.userCard[i].cardId] = num;
        }
      }
      this.starCount = star;
      this.decCard = cardObj;
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
          if (a.star < b.star) {
            return 1;
          } else if (a.star > b.star) {
            return -1;
          } else {
            return b.cardId - a.cardId;
          }
        } else if (sort_ === '1') {
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
      function battle (item) {
        let p_ = that.searchForm.battle;
        if (p_ === '0') {
          return true;
        } else if (p_ === '1') {
          return that.battlecardId.indexOf(item) === -1;
        } else {
          return that.battlecardId.indexOf(item) !== -1;
        }
        return false;
      }
      console.log(this.userCardCache);
      let userCardSearchRes = this.userCardCache.filter(item => setStar(item) && setCry(item.cry) && setRightType(item.rightType) && setLeftType(item.leftType) && battle(item.cardId));
      userCardSearchRes = userCardSearchRes.sort(setSort);
      let userCard_ = userCardSearchRes.slice((val - 1) * 20, val * 20);
      this.cardTotle = userCardSearchRes.length;
      if (userCard_.length > 0) {
        this.pageChangeing = true;
      }
      this.userCard = [];
      if (val !== 1 && userCard_.length === 0) {
        let newPage = val - 1;
        if (newPage < 1) {
          newPage = 1;
        }
        this.cardPage = val - 1;
        this.cardPageChange(this.cardPage);
      } else {
        setTimeout(() => {
          this.pageChangeing = false;
          this.userCard = userCard_;
        }, 300);
      }
    },
    searchChanged () {
      this.cardPage = 1;
      this.cardPageChange(1);
    },
    changepackageId () {
      this.searchForm = {
        star: '0',
        cry: '0',
        rightType: '0',
        leftType: '0',
        sort: '0',
        battle: '1'
      }
      this.cardPage = 1;
      this.getUserCard();
    },
    checkCanBuy (item) {
      return item.count > 1;
    },
    getMyBattleCard () {
      let params = {
        token: this.token,
        type: 'search'
      }
      authApi.battlecard(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.battlecardId = res.data.cardId;
          this.getUserCard();
        }
      });
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
              this.userCardCache[i]['dec'] = 0;
              this.userCardCache[i]['lock'] = this.lockCard[this.userCardCache[i].cardId] || false;
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
.wm_dec_can_num,
.wm_dec_lock {
  position: absolute;
  z-index: 2;
  right: 5px;
  left: 5px;
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 12px;
}
.wm_dec_can_num {
  bottom: 28px;
  background-color: rgba(255, 255, 255, 0.85);
  color: #ff5364;
}
.wm_dec_lock {
  bottom: 5px;
  color: #ff5364;
  background-color: rgba(255, 255, 255, 0.85);
}
.wm_dec_lock:hover {
  background-color: rgba(255, 255, 255, 0.95);
}
.wm_getcard_box.type_locked .wm_dec_lock {
  background-color: #ff5364;
  color: #fff;
}
.wm_dec_img_box {
  position: relative;
  z-index: 1;
}
.wm_dec_input {
  width: 100%;
}
.wm_dec_input_body {
  margin: 10px 0 0 0;
  height: 28px;
}
.wm_mycard_list.type_dec .wm_getcard_box {
  height: 301px;
}
.wm_getcard_box.type_locked {
  opacity: 0.4;
}
.wm_mycard_list.type_dec .wm_getcard_img {
  cursor: url(/static/cur/default.cur), default;
}
.wm_dec_btn_body {
  padding: 20px 0;
  text-align: center;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}
@media (max-width: 768px) {
  .wm_mycard_list.type_dec .wm_getcard_box {
    height: 172px;
  }
}
</style>