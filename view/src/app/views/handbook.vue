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
                         :key="item._id"
                         :label="item.name"
                         :value="item._id">
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
      <el-collapse-transition>
        <div class="wm_mycard_list"
             v-if="userCard.length>0">
          <!-- openImg($wikimoecard.url+item.packageId+'/'+item.cardId+'.jpg',item.name,item.have,item.star,item.cardId,item.packageId) -->
          <div class="wm_market_mycard_item type_mobile"
               v-for="(item,index) in userCard"
               v-bind:key="item._id + index"
               :class="isHave(item._id)?'have':''"
               @click="openCardInfo(item)"
               @mouseover="$wikimoecard.l2dMassage('点击卡牌可以查看卡牌并且发起求购哦！')">
            <img class="wm_getcard_img"
                 :src="$wikimoecard.url+item._id+'.jpg'">
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
    <el-dialog title="卡牌详情"
               :visible.sync="dialogCard"
               :lock-scroll="false"
               :append-to-body="true"
               class="wm_handbook_info_dialog"
               width="852px">
      <el-row :gutter="20">
        <el-col :sm="12"
                :xs="24">
          <div>
            <div @click="goMarket"
                 class="wm_handbook_info_img_body">
              <img class="wm_isSparkleMode"
                   v-if="isSparkleMode"
                   src="/static/img/isSparkle.png">
              <img class="wm_handbook_info_img wm_set_pointer"
                   :src="this.$wikimoecard.url+cardData._id+'.jpg'">
            </div>
            <div class="mt10 tc">
              <el-button type="primary"
                         @click="isSparkleMode = !isSparkleMode">{{isSparkleMode?"切换为普通卡":"切换为闪卡"}}</el-button>
            </div>
          </div>
        </el-col>
        <el-col :sm="12"
                :xs="24">
          <div class="f20 mb10 mt10 wm_handbook_cardname tc">{{cardData.name}}</div>
          <div class="wm_handbook_cardinfo_body">
            <div class="wm_handbook_cardinfo_item">出自作品：《{{cardData.title}}》</div>
            <div class="wm_handbook_cardinfo_item">星星等级：{{cardData.star}}星</div>
            <div class="wm_handbook_cardinfo_item">水晶属性：{{cardData.cry | cry}}</div>
            <div class="wm_handbook_cardinfo_item">被动属性：{{cardData.leftType | leftType}}</div>
            <div class="wm_handbook_cardinfo_item">主动技能：{{cardData.rightType | rightType}}</div>
            <div class="wm_handbook_cardinfo_item">拥有卡牌：{{haveCardCount(cardData._id)}}</div>
          </div>
          <div class="wm_handbook_cardinfo_body mt20 tc"
               v-if="myCardListByID.length>0">
            <el-table :data="myCardListByID"
                      height="135"
                      border>
              <el-table-column label="等级">
                <template slot-scope="scope">
                  <span>{{ scope.row.cardList.cardLevel + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column label="经验值">
                <template slot-scope="scope">
                  <span>{{ scope.row.cardList.cardEXP }}</span>
                </template>
              </el-table-column>
              <el-table-column label="闪卡">
                <template slot-scope="scope">
                  <span>{{ scope.row.cardList.isSparkle?"是":"否" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="对战">
                <template slot-scope="scope">
                  <span>{{ scope.row.cardList.isBattle?"是":"否"  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="生成时间"
                               width="190px">
                <template slot-scope="scope">
                  <span>{{ $moment(scope.row.cardList.creatDate).format('ll LTS') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="获取时间"
                               width="190px">
                <template slot-scope="scope">
                  <span>{{ $moment(scope.row.cardList.getDate).format('ll LTS') }}</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="mt5">
              <el-pagination small
                             layout="prev, pager, next"
                             @current-change="getCardListByID"
                             :current-page.sync="myCardListByIDPage"
                             :page-size="20"
                             :total="myCardListByIDTotal">
              </el-pagination>
            </div>

          </div>
          <div class="wm_handbook_cardinfo_body mt20">卡牌提供：<el-tooltip placement="top">
              <div slot="content"
                   class="tc"><img class="wm_handbook_auther_tx"
                     :src="'https://gravatar.loli.net/avatar/'+cardData.md5+'?s=100&amp;d=mm&amp;r=g&amp;d=robohash&days='+txDays" />
                <div class="mt5">{{cardData.auther}}</div>
              </div>
              <span class="dib">{{cardData.auther}}</span>
            </el-tooltip>
          </div>

          <el-button type="primary"
                     class="w_10 mt20"
                     @click="goMarket">购卡或求购</el-button>
        </el-col>
      </el-row>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogCard = false">关闭</el-button>
      </span>
    </el-dialog>
    <menuView></menuView>
  </div>
</template>

<script>
import menuView from '../components/menu.vue';
import { authApi } from "../api";
import userTop from '../components/topUserInfo.vue';
import { PrefixInteger, md5Check } from "../../utils/utils";
import md5_ from 'js-md5';

export default {
  data () {
    return {
      txDays: new Date().getDate(),
      cardData: {},
      dialogCard: false,
      token: sessionStorage.getItem("token") ? sessionStorage.getItem("token") : localStorage.getItem("token"),
      cardBook: [],
      cardPage: Number(this.$route.query.page) || 1,
      userCard: [],
      pageChangeing: false,
      cardTotle: 0,
      myCardList: [],
      myCardListByID: [],
      myCardListByIDPage: 1,
      myCardListByIDTotal: 0,
      isSparkleMode: false,
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
      seledCardPackage: this.$route.query.packageId || 'all',
      cardPackage: [
        {
          _id: "all",
          name: "全部卡包"
        }
      ],
    }
  },
  components: {
    menuView,
    userTop
  },
  created () {
    console.log(this.searchForm.title);
    this.getCardPackage();
    this.getUserCard();
  },
  mounted () {
    this.$emit('l2dMassage', '这里可以查看自己已经收集到的卡牌。');
  },
  methods: {
    haveCardCount (id) {
      let thisCard = null;
      thisCard = this.myCardList.find((el) => {
        return el.cardID === id;
      })
      if (thisCard) {
        let text = thisCard.count + "张";
        if (thisCard.isSparkle > 0) {
          text = text + `（内含闪卡${thisCard.isSparkle}张）`;
        }
        return text;
      } else {
        return "0张";
      }
    },
    changepackageId () {
      // this.searchForm={
      //     star:'0',
      //     cry:'0',
      //     rightType:'0',
      //     leftType:'0',
      //     have:'0',
      //     title:'',
      //     name:'',
      // }
      this.cardPage = 1;
      this.getUserCard();
    },
    getCardPackage () {
      authApi.searchcardpackage().then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.cardPackage = res.data.data;
          this.cardPackage.unshift(
            {
              _id: "all",
              name: "全部卡包"
            }
          )
        }
      });
    },
    getCardListByID () {
      authApi.searchcardlist({
        token: this.token,
        id: this.cardData._id,
        page: this.myCardListByIDPage
      }).then(res => {
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.myCardListByID = res.data.myCardList.cardList;
          this.myCardListByIDTotal = res.data.myCardList.cardCount;
        }
      });
    },
    openCardInfo (data) {
      this.isSparkleMode = false;
      this.dialogCard = true;
      this.cardData = data;
      this.myCardListByID = [];
      this.myCardListByIDPage = 1;
      this.getCardListByID();
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
      this.pageChangeing = true;
      this.userCard = [];
      authApi.handbook({
        token: this.token,
        packageId: this.seledCardPackage,
        page: this.cardPage,
        star: this.searchForm.star,
        cry: this.searchForm.cry,
        rightType: this.searchForm.rightType,
        leftType: this.searchForm.leftType,
        title: this.searchForm.title,
        name: this.searchForm.name,
        have: this.searchForm.have,
      }).then(res => {
        this.loading = false;
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.myCardList = res.data.myCardList;
          this.cardTotle = res.data.total;
          setTimeout(() => {
            this.userCard = res.data.card;
            this.pageChangeing = false;
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
        }
      });
    },
    isHave (cardID) {
      const have = this.myCardList.find((element) => {
        return element.cardID === cardID
      });
      if (have) {
        return true;
      } else {
        return false;
      }
    },
    PrefixInteger_ (num, length) {
      return PrefixInteger(num, length);
    },
    searchChanged () {
      this.cardPage = 1;
      this.cardPageChange(1);
    },
    cardPageChange (val) {
      this.getUserCard();

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
.wm_handbook_info_img_body {
  position: relative;
  z-index: 1;
}
.wm_isSparkleMode {
  cursor: url(/static/cur/pointer.cur), pointer;
}
</style>
<style>
.wm_handbook_cardinfo_body .el-table td,
.wm_handbook_cardinfo_body .el-table th {
  padding: 2px 0;
}
</style>
