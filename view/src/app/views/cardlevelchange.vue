<template>
  <div class="common_body">
    <userTop ref="userTop" />
    <h5 class="common_title type_shop">转换等级</h5>
    <div class="tc mb20">注意：只有被动属性和星级一样的卡牌才能相互转换！</div>
    <div class="clearfix tc wm_cardlvchange_top_body">
      <div class="wm_cardlvchange_body">
        <div class="wm_market_mycard_item type_mobile wm_cursor_default">
          <img class="wm_getcard_img"
               :src="$wikimoecard.url+fromPackageId+'/'+from+'.jpg'">
          <div>Lv.{{fromLevel+1}}</div>
        </div>
      </div>
      <i class="el-icon-sort f18 wm_cardlvchange_changeico"></i>
      <div class="wm_cardlvchange_body"
           v-if="!to">
        <div class="wm_market_mycard_item type_mobile wm_cursor_default">
          <div class="wm_cardlvchange_nocard">

          </div>
          <div>请选择卡牌</div>
        </div>
      </div>
      <div class="wm_cardlvchange_body"
           v-else>
        <div class="wm_market_mycard_item type_mobile">
          <img class="wm_getcard_img"
               :src="$wikimoecard.url+to.packageId+'/'+to.cardId+'.jpg'">
          <div>Lv.{{to.level?to.level+1:1}}</div>
        </div>
      </div>
      <div class="tc mt10 pb10">
        <el-button type="primary"
                   size="medium"
                   @click="goChange">
          <div>使用 <img :src="'/static/otherImg/item/200.png'"
                 width="24px"
                 height="24px" />×1 转换等级</div>
        </el-button>
      </div>
    </div>
    <div>
      <h5 class="common_title type_shop">点击选择卡牌</h5>
      <div class="wm_cardlist_select_search_body">
        <el-form :inline="true"
                 :model="searchForm">
          <el-form-item label="选择卡包">
            <el-select v-model="seledCardPackage"
                       placeholder="选择卡包"
                       class="wm_cardlist_select type_120"
                       @change="apiInit">
              <el-option v-for="item in cardPackage"
                         :key="item.packageId"
                         :label="item.name"
                         :value="item.packageId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="水晶属性">
            <el-select class="wm_cardlist_select"
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
          <el-form-item label="主动技能">
            <el-select class="wm_cardlist_select"
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
          <el-form-item label="设置排序">
            <el-select class="wm_cardlist_select"
                       @change="searchChanged"
                       v-model="searchForm.sort"
                       placeholder="设置排序">
              <el-option label="默认"
                         value="0"></el-option>
              <el-option label="等级从高到低"
                         value="1"></el-option>
              <el-option label="等级从低到高"
                         value="2"></el-option>
              <el-option label="星级从高到低"
                         value="3"></el-option>
              <el-option label="星级从低到高"
                         value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <el-collapse-transition>
        <div class="wm_mycard_list"
             v-if="userCard.length>0">
          <div class="wm_market_mycard_item type_mobile"
               v-for="(item,index) in userCard"
               v-bind:key="index"
               @click="changeToCard(item)">
            <img class="wm_getcard_img"
                 :src="$wikimoecard.url+item.packageId+'/'+item.cardId+'.jpg'">
            <div>Lv.{{item.level+1}}</div>
          </div>
        </div>
      </el-collapse-transition>
      <el-collapse-transition>
        <div v-show="userCard.length<=0&&!pageChangeing">
          <div class="common_nocard_tips">该条件下暂无卡牌！</div>
        </div>
      </el-collapse-transition>
      <div class="wm_market_content_page"
           v-if="userCard.length>0">
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
    <menuView></menuView>
  </div>
</template>

<script>
import menuView from '../components/menu.vue';
import { authApi } from "../api";
import userTop from '../components/topUserInfo.vue';
import { PrefixInteger, md5Check, scrollToTop, packageSort } from "../../utils/utils";
import md5_ from 'js-md5';
import itemData from '../../../../server/data/item';

export default {
  data () {
    return {
      fromLevel: Number(this.$route.query.fromLevel),
      from: this.$route.query.from || '1',
      fromPackageId: this.$route.query.packageId || '0',
      to: null,
      item: this.$route.query.item || '0',
      token: sessionStorage.getItem("token") ? sessionStorage.getItem("token") : localStorage.getItem("token"),
      userCardCache: null,
      cardPage: 1,
      cardTotle: 0,
      userCard: [],
      pageChangeing: false,
      searchForm: {
        star: this.$route.query.star || '0',
        cry: '0',
        rightType: '0',
        leftType: this.$route.query.leftType || '0',
        sort: '0'
      },
      myCardLevel: {},
      itemData_: itemData,
      seledCardPackage: '-1',
      cardPackage: [{
        name: "加载中...",
        packageId: "-1"
      }],
    }
  },
  components: {
    menuView,
    userTop,
  },
  mounted () {
    this.$wikimoecard.l2dMassage('请选择您想要转换的卡牌，只有被动属性和星级一样的卡牌才能相互转换！');
    this.getCardPackage();
  },
  methods: {
    apiInit () {
      console.log(this.searchForm);
      let mycard = new Promise((resolve, reject) => {
        this.getMycard(resolve, reject);
      });
      // 同时执行p1和p2，并在它们都完成后执行then:
      Promise.all([mycard]).then((results) => {
        this.initData();
      })
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
          this.apiInit();
        }
      });
    },
    goChange () {
      if (!this.to) {
        this.$message.error('请设置接收的卡牌！');
        return false;
      }
      this.$confirm('转换将会互换两张卡的等级，是否继续?', '提示', {
        confirmButtonText: '转换',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          token: this.token,
          fromCardId: this.from,
          toCardId: this.to.cardId
        }
        authApi.cardlevelchange(params).then(res => {
          console.log(res);
          if (res.data.code == 0) {
            this.$message.error(res.data.msg);
          } else if (res.data.code == 1) {
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            const upgradeData = this.$route.query.upgradeData;
            let backQuery = {};
            if (upgradeData) {
              const JSONSTR = atob(upgradeData);
              backQuery = JSON.parse(JSONSTR);
            }
            this.$router.replace({
              path: '/upgradecard',
              query: backQuery
            });
          }
        });
      }).catch(() => {
      });
    },
    changeToCard (id) {
      this.to = id;
      scrollToTop(50, 200);
    },
    searchChanged () {
      this.cardPage = 1;
      this.cardPageChange(1);
    },
    PrefixInteger_ (num, length) {
      return PrefixInteger(num, length);
    },
    cardPageChange (val) {
      this.pageChangeing = true;
      this.userCard = [];
      let that = this;
      // 筛选条件
      function setStar (item) {
        let p_ = that.searchForm.star;
        if (p_ === '0') {
          return true;
        } else if (item == p_) {
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
            if ((that.myCardLevel[a.cardId] || 0) < (that.myCardLevel[b.cardId] || 0)) {
              return 1;
            } else if ((that.myCardLevel[a.cardId] || 0) > (that.myCardLevel[b.cardId] || 0)) {
              return -1;
            } else {
              return b.cardId - a.cardId;
            }
          }
        } else if (sort_ === '1') {
          if ((that.myCardLevel[a.cardId] || 0) < (that.myCardLevel[b.cardId] || 0)) {
            return 1;
          } else if ((that.myCardLevel[a.cardId] || 0) > (that.myCardLevel[b.cardId] || 0)) {
            return -1;
          } else {
            return b.cardId - a.cardId;
          }
        } else if (sort_ === '2') {
          return (that.myCardLevel[a.cardId] || 0) - (that.myCardLevel[b.cardId] || 0);
        } else if (sort_ === '3') {
          if (a.star < b.star) {
            return 1;
          } else if (a.star > b.star) {
            return -1;
          } else {
            return b.cardId - a.cardId;
          }
        } else if (sort_ === '4') {
          return a.star - b.star;
        }
      }
      let userCardSearchRes = this.userCardCache.filter(item => setStar(item.star) && setCry(item.cry) && setRightType(item.rightType) && setLeftType(item.leftType) && item.cardId != this.from && item.level != this.fromLevel);
      userCardSearchRes = userCardSearchRes.sort(setSort);
      let userCard_ = userCardSearchRes.slice((val - 1) * 20, val * 20);
      this.cardTotle = userCardSearchRes.length;
      setTimeout(() => {
        this.userCard = userCard_;
        this.pageChangeing = false;
      }, 300);
    },
    searchcardlevel (resolve, reject) {
      let params = {
        token: this.token
      }
      authApi.searchcardlevel(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          reject({ msg: 'error' });
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          if (res.data.data) {
            this.myCardLevel = res.data.data;
          }
          resolve('ok');
        }
      });
    },
    getMycard (resolve, reject) {
      authApi.searchcardbytoken({ token: this.token, packageId: this.seledCardPackage }).then(res => {
        if (res.data.code == 0) {
          reject({ msg: 'error' });
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          resolve('ok');
          let resData = res.data;
          this.myCardLevel = res.data.cardLevelData || {};
          this.userCardCache = res.data.card || [];
          if (res.data.cardIndexCount <= 0) {
            this.$message({
              message: resData.nickName + '还没有获得过卡牌呢！',
              type: 'warning'
            });
          }
        }
      });
    },
    initData () {//初始化数据
      for (let i = 0; i < this.userCardCache.length; i++) {
        let cardlv = this.myCardLevel[this.userCardCache[i].cardId];
        this.userCardCache[i].level = 0;
        if (cardlv) {
          this.userCardCache[i].level = cardlv;
        }
      }
      // 0卡牌id、1卡牌数量、2卡牌等级、3卡牌信息
      this.cardPageChange(1);
    },
  },
}
</script>

<style scoped>
.wm_cardlvchange_body {
  display: inline-block;
}
.wm_cardlvchange_body .wm_cursor_default,
.wm_cardlvchange_body .wm_cursor_default .wm_getcard_img {
  cursor: url(/static/cur/default.cur), default;
}
.wm_cardlvchange_nocard {
  width: 180px;
  height: 253px;
  border: 1px dashed #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}
.wm_cardlvchange_top_body {
  padding-bottom: 20px;
  border-bottom: 1px dashed #ccc;
}
.wm_cardlvchange_changeico {
  transform: rotate(90deg);
}
@media (max-width: 768px) {
  .wm_cardlvchange_nocard {
    width: 88px;
    height: 124px;
  }
}
</style>
