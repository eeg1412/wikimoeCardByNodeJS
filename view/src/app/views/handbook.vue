<template>
  <div class="common_body">
    <userTop ref="userTop" />
    <h5 class="common_title type_shop">卡牌图鉴</h5>
    <transition name="el-fade-in-linear">
      <div class="wm_market_tips"
           v-if="loading"><i class="el-icon-loading"></i> 读取中...</div>
    </transition>
    <div class="wm_handbook_cardlist">
      <div class="wm_cardlist_select_search_body">
        <el-form :inline="true"
                 :model="searchForm">
          <el-form-item label="选择卡包">
            <el-select v-model="seledCardPackage"
                       placeholder="选择卡包"
                       class="wm_cardlist_select type_120"
                       @change="changepackageId">
              <el-option v-for="item in cardPackage"
                         :key="item.packageId"
                         :label="item.name"
                         :value="item.packageId">
                <span>{{item.name}}({{myCardCount[item.packageId] || 0}}/{{item.oneStar+item.twoStar+item.threeStar+item.fourStar+item.fiveStar+item.sixStar}})</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出自作品">
            <el-input v-model="searchForm.title"
                      placeholder="请输入作品名"
                      class="wm_cardlist_search_input"
                      @keyup.enter.native="searchChanged"
                      clearable
                      @clear="searchChanged">
              <el-button slot="append"
                         icon="el-icon-search"
                         @click="searchChanged"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="角色名字">
            <el-input v-model="searchForm.name"
                      placeholder="请输入角色名"
                      class="wm_cardlist_search_input"
                      @keyup.enter.native="searchChanged"
                      clearable
                      @clear="searchChanged">
              <el-button slot="append"
                         icon="el-icon-search"
                         @click="searchChanged"></el-button>
            </el-input>
          </el-form-item>
          <div></div>
          <el-form-item label="星星等级">
            <el-select class="wm_cardlist_select"
                       @change="searchChanged"
                       v-model="searchForm.star"
                       placeholder="筛选星级">
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
          <el-form-item label="被动属性">
            <el-select class="wm_cardlist_select"
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
          <el-form-item label="是否拥有">
            <el-select class="wm_cardlist_select"
                       @change="searchChanged"
                       v-model="searchForm.have"
                       placeholder="筛选是否已有">
              <el-option label="全部"
                         value="0"></el-option>
              <el-option label="是"
                         value="1"></el-option>
              <el-option label="否"
                         value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <div class="tc"
             v-show="!wantCardManyMode">
          已收集：{{cardCountSum(cardCount)}}/{{cardBook.length}}
          <el-button type="text"
                     @click="wantCardManyMode = true">批量求卡</el-button>
        </div>
        <div v-show="wantCardManyMode">
          <div class="tc">
            <span>
              <el-button size="mini"
                         @click="wantCardDialog()"
                         type="primary">提交求卡（{{wantCardList.length}}/60）</el-button>
            </span>
            <span>
              <el-button size="mini"
                         @click="quitWantCardList">退出求卡</el-button>
            </span>
          </div>
          <div class="tc mt10">
            <span>
              <el-button size="mini"
                         type="info"
                         @click="selectPage">本页全选</el-button>
            </span>
            <span>
              <el-button size="mini"
                         type="info"
                         @click="clearWantCardList">清空选择</el-button>
            </span>

          </div>
        </div>
      </div>
      <el-collapse-transition>
        <div class="wm_mycard_list"
             v-if="userCard.length>0">
          <!-- openImg($wikimoecard.url+item.packageId+'/'+item.cardId+'.jpg',item.name,item.have,item.star,item.cardId,item.packageId) -->
          <div class="wm_market_mycard_item type_mobile"
               v-for="(item,index) in userCard"
               v-bind:key="index"
               @mouseover="$wikimoecard.l2dMassage('点击卡牌可以查看卡牌并且发起求购哦！')">
            <img class="wm_getcard_img"
                 :class="item.have?'have':''"
                 @click="openCardInfo(item)"
                 :src="$wikimoecard.url+item.packageId+'/'+item.cardId+'.jpg'">
            <el-collapse-transition>
              <div v-show="wantCardManyMode"
                   class="mt5">
                <el-checkbox :value="wantCardListSel(item.cardId)"
                             @change="checked =>tryWantCard(checked,item)">求卡</el-checkbox>
              </div>
            </el-collapse-transition>
          </div>
        </div>
      </el-collapse-transition>
      <el-collapse-transition>
        <div class="common_nocard_tips"
             v-show="userCard.length<=0&&!loading&&!pageChangeing">该条件下暂无卡牌！</div>
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
    <cardInfoDialog @cardInfoShow="cardInfoDiaShow"
                    :cardInfoDigShow="dialogCard"
                    :cardData="cardItemData"
                    @buyNewCard="updateMyCard"
                    @updateUserinfo="updateUserinfo"></cardInfoDialog>
    <marketCardList title="批量求卡"
                    tip="Tip:求购信息有效期为3天。"
                    :cardList="wantCardList"
                    :setStar="true"
                    :cardPackage="cardPackage"
                    @del="delWantCardList"
                    @send="wantCardSend"
                    ref="marketCardList"></marketCardList>
    <menuView></menuView>
  </div>
</template>

<script>
import menuView from '../components/menu.vue';
import cardInfoDialog from "../components/cardInfo"
import marketCardList from "../components/marketCardList"
import { authApi } from "../api";
import userTop from '../components/topUserInfo.vue';
import { PrefixInteger, md5Check, unique, packageSort } from "../../utils/utils";
import md5_ from 'js-md5';
import _ from 'lodash';

export default {
  data () {
    return {
      myCardCount: {},
      wantCardList: [],
      wantCardManyMode: false,
      cardItemData: null,
      txDays: new Date().getDate(),
      cardData: {},
      dialogCard: false,
      token: sessionStorage.getItem("token") ? sessionStorage.getItem("token") : localStorage.getItem("token"),
      cardBook: [],
      cardCount: {},
      cardPage: Number(this.$route.query.page) || 1,
      userCard: [],
      pageChangeing: false,
      cardTotle: 0,
      searchForm: {
        star: this.$route.query.star || '0',
        cry: this.$route.query.cry || '0',
        rightType: this.$route.query.rightType || '0',
        leftType: this.$route.query.leftType || '0',
        have: this.$route.query.have || '0',
        title: decodeURIComponent(this.$route.query.title || ''),
        name: decodeURIComponent(this.$route.query.name || ''),
      },
      loading: true,
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
    menuView,
    userTop,
    cardInfoDialog,
    marketCardList
  },
  created () {
    console.log(this.searchForm.title);
    this.getCardPackage();
    this.searchCardCount();
  },
  mounted () {
    this.$emit('l2dMassage', '这里可以查看自己已经收集到的卡牌。');
  },
  methods: {
    searchCardCount () {
      authApi.searchCardCount({ token: this.token }).then(res => {
        console.log(res);
        if (res.data.code === 1) {
          this.myCardCount = res.data.cardCount
        }
      });
    },
    wantCardSend (captcha) {
      if (this.wantCardList.length === 0) {
        this.$message.error("未选择卡牌！");
        return false;
      }
      // 求卡
      let params = {
        token: this.token,
        captcha: captcha,
        type: "list",
        cardList: _.map(this.wantCardList, _.partialRight(_.pick, ["cardId", "price"]))
      }
      authApi.wantcard(params).then(res => {
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          if (res.data.error.length === 0) {
            this.$message({
              message: `${res.data.success.length}张卡牌求卡成功！`,
              type: 'success'
            });
            this.$refs.marketCardList.closeDialog();
            this.wantCardList = [];
          } else {
            this.$message.error(`${res.data.error.length}张卡牌求卡失败！`);
            const errorCard = _.intersectionBy(this.wantCardList, res.data.error, 'cardId');
            this.wantCardList = errorCard;
            // this.$forceUpdate();
            this.$nextTick(() => {
              this.$refs.marketCardList.reloadData();
            });
          }
        }
        this.$refs.marketCardList.captchaUpdata();
      });
    },
    wantCardDialog () {
      if (this.wantCardList.length === 0) {
        this.$message.error("未选择卡牌！");
        return false;
      }
      this.$refs.marketCardList.openDialog();
    },
    quitWantCardList () {
      this.wantCardList = [];
      this.wantCardManyMode = false
    },
    clearWantCardList () {
      this.wantCardList = [];
    },
    selectPage () {
      let listCache = _.cloneDeep(this.wantCardList);
      this.userCard.forEach(card => {
        const cardInfo = {
          cardId: card.cardId,
          name: card.name,
          packageId: card.packageId,
          star: card.star,
          title: card.title,
          price: this.minPriceCal(card.star)
        };
        listCache.push(cardInfo);
      });
      listCache = _.uniqBy(listCache, 'cardId');
      if (listCache.length > 60) {
        this.$message.error("最多只能选择60张卡牌！");
      } else {
        this.wantCardList = _.cloneDeep(listCache);
        this.$forceUpdate();
      }
    },
    tryWantCard (v, card) {
      // console.log(v, card);
      if (v) {
        if (this.wantCardList.length >= 60) {
          this.$message.error("最多只能选择60张卡牌！");
          return false;
        }
        const cardInfo = {
          cardId: card.cardId,
          name: card.name,
          packageId: card.packageId,
          star: card.star,
          title: card.title,
          price: this.minPriceCal(card.star)
        };
        this.wantCardList.push(cardInfo);
        this.wantCardList = _.uniqBy(this.wantCardList, 'cardId');
        this.$forceUpdate();
      } else {
        // const i = this.wantCardList.indexOf(cardId);
        _.remove(this.wantCardList, { cardId: card.cardId });
        this.$forceUpdate();
      }
    },
    delWantCardList (id) {
      _.remove(this.wantCardList, { cardId: id });
      this.$forceUpdate();
    },
    wantCardListSel (cardId) {
      const i = _.findIndex(this.wantCardList, { 'cardId': cardId });
      if (i < 0) {
        return false;
      } else {
        return true;
      }
    },
    getPackageName (packageId) {
      const packageInfo = _.find(this.cardPackage, { 'packageId': packageId });
      if (packageInfo) {
        return packageInfo.name;
      } else {
        return "";
      }
    },
    minPriceCal (s) {
      // 计算最低售价
      if (s == 6) {
        return 600;
      } else if (s == 5) {
        return 200;
      } else if (s == 4) {
        return 90;
      } else {
        return 30;
      }
    },
    updateUserinfo () {
      this.$refs.userTop.getUserInfo();
    },
    updateMyCard () {
      this.getUserCard();
    },
    cardInfoDiaShow (v) {
      this.dialogCard = v;
    },
    cardCountSum (count) {
      const obj = count;
      let arr = [];
      for (let key in obj) {
        if (!obj.hasOwnProperty(key)) {
          continue;
        }
        const cardCount = obj[key];
        if (cardCount > 0) {
          let item = {};
          item[key] = obj[key];
          arr.push(item);
        }
      }
      return arr.length;
    },
    changepackageId () {
      this.searchForm = {
        star: '0',
        cry: '0',
        rightType: '0',
        leftType: '0',
        have: '0',
        title: '',
        name: '',
      }
      this.cardPage = 1;
      this.getUserCard();
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
          this.getUserCard();
        }
      });
    },
    openCardInfo (data) {
      this.dialogCard = true;
      this.cardItemData = data;
      this.cardData = data;
    },
    goMarket () {
      this.$router.push({
        name: 'buyCard',
        query: {
          name: 'cardId',
          text: this.cardData.cardId,
          want: 1,
          wantstar: this.cardData.star,
          wantid: this.cardData.cardId,
          packageId: this.cardData.packageId
        }
      });
    },
    // openImg(imgsrc,name,have,star,cardId,packageId){
    //     this.$confirm('<div class="watch_img"><img src="'+imgsrc+'" /></div>', '查看卡牌', {
    //         dangerouslyUseHTMLString: true,
    //         lockScroll:false,
    //         showCancelButton: false,
    //         confirmButtonText: '购卡或求购',
    //     }).then(() => {
    //         this.$router.push({ 
    //             name:'buyCard',
    //             query: {
    //                 name:'cardId',
    //                 text:cardId,
    //                 want:1,
    //                 wantstar:star,
    //                 wantid:cardId,
    //                 packageId:packageId
    //             }
    //         });
    //     }).catch(() => {

    //     });
    // },
    getUserCard () {
      authApi.handbook({ token: this.token, packageId: this.seledCardPackage }).then(res => {
        this.loading = false;
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.cardCount = res.data.cardCount;
          this.cardBook = res.data.card;
          for (let i = 0; i < this.cardBook.length; i++) {
            if (this.cardCount[this.cardBook[i].cardId]) {
              this.cardBook[i].have = this.cardCount[this.cardBook[i].cardId];
            }
          }
          this.cardPageChange(this.cardPage);
        }
      });
    },
    PrefixInteger_ (num, length) {
      return PrefixInteger(num, length);
    },
    searchChanged () {
      this.cardPage = 1;
      this.cardPageChange(1);
    },
    cardPageChange (val) {
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
      function setHave (item) {
        let p_ = that.searchForm.have;
        if (p_ === '0') {
          return true;
        } else if (p_ === '1') {
          if (item) {
            return true;
          } else {
            return false;
          }
        } else if (p_ === '2') {
          if (!item) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      }
      function setTitle (item) {
        let p_ = that.searchForm.title.toLowerCase();
        if (p_ == '') {
          return true;
        } else if (item.indexOf(p_) === -1) {
          return false;
        } else {
          return true;
        }
      }
      function setName (item) {
        let p_ = that.searchForm.name.toLowerCase();
        if (p_ == '') {
          return true;
        } else if (item.indexOf(p_) === -1) {
          return false;
        } else {
          return true;
        }
      }
      let userCardSearchRes = this.cardBook.filter(item => setStar(item.star) && setCry(item.cry) && setRightType(item.rightType) && setLeftType(item.leftType) && setHave(item.have) && setTitle(item.title.toLowerCase()) && setName(item.name.toLowerCase()));
      userCardSearchRes.sort((a, b) => {
        if (b.star != a.star) {
          return b.star - a.star;
        } else {
          return b.cardId - a.cardId;
        }
      })
      let userCard_ = userCardSearchRes.slice((val - 1) * 20, val * 20);
      this.cardTotle = userCardSearchRes.length;
      if (userCard_.length <= 0 && this.cardPage != 1) {
        this.cardPage = 1;
        this.searchForm = {
          star: '0',
          cry: '0',
          rightType: '0',
          leftType: '0'
        };
        this.$router.replace({
          name: 'handbook',
          query: {
            page: 1,
          }
        });
        this.getUserCard();
        return false;
      }
      if (userCard_.length > 0) {
        this.pageChangeing = true;
      }
      this.userCard = [];
      setTimeout(() => {
        this.pageChangeing = false;
        this.userCard = userCard_;
      }, 300)
      this.$router.replace({
        name: 'handbook',
        query: {
          page: this.cardPage,
          star: this.searchForm.star,
          cry: this.searchForm.cry,
          rightType: this.searchForm.rightType,
          leftType: this.searchForm.leftType,
          have: this.searchForm.have,
          title: encodeURIComponent(this.searchForm.title),
          name: encodeURIComponent(this.searchForm.name),
          packageId: this.seledCardPackage
        }
      });
    },
  },
  filters: {
    leftType (v) {
      let name = '';
      switch (v) {
        case 1:
          name = '全能';
          break;
        case 2:
          name = '兵攻';
          break;
        case 3:
          name = '盾防';
          break;
        case 4:
          name = '速度';
          break;
        case 5:
          name = '爱心';
          break;
      }
      return name;
    },
    cry (v) {
      let name = '';
      switch (v) {
        case 1:
          name = '红火';
          break;
        case 2:
          name = '蓝水';
          break;
        case 3:
          name = '绿风';
          break;
        case 4:
          name = '光';
          break;
        case 5:
          name = '暗';
          break;
      }
      return name;
    },
    rightType (v) {
      let name = '';
      switch (v) {
        case 1:
          name = '物';
          break;
        case 2:
          name = '魔';
          break;
        case 3:
          name = '防';
          break;
        case 4:
          name = '治';
          break;
        case 5:
          name = '妨';
          break;
        case 6:
          name = '支';
          break;
        case 7:
          name = '特';
          break;
      }
      return name;
    }
  },
}
</script>

<style scoped>
.wm_handbook_cardname {
  padding: 5px 15px;
}
.wm_handbook_cardinfo_body {
  border: 1px solid #ccc;
  padding: 10px 15px;
  border-radius: 5px;
  line-height: 24px;
  font-size: 16px;
}
.wm_handbook_cardinfo_item {
  margin-bottom: 10px;
}
.wm_handbook_auther_tx {
  width: 50px;
  height: 50px;
  border-radius: 2px;
}
.wm_handbook_info_img {
  max-width: 100%;
  width: 100%;
  height: auto;
}
</style>
