<template>
  <div class="common_body">
    <userTop ref="userTop" />
    <h5 class="common_title type_shop">升级对战卡牌</h5>
    <h6 class="common_title_tips type_dec">
      <el-checkbox v-model="battleMode"
                   @change="apiInit">仅显示对战卡牌</el-checkbox>
    </h6>
    <div class="wm_cardlist_select_search_body type_upgradcard"
         v-if="!battleMode">
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
              <span>{{item.name}}({{cardCount[item.packageId] || 0}}/{{item.oneStar+item.twoStar+item.threeStar+item.fourStar+item.fiveStar+item.sixStar}})</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="星星等级">
          <el-select class="wm_cardlist_select type_120"
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
            <el-option label="是"
                       value="0"></el-option>
            <el-option label="否"
                       value="1"></el-option>
            <el-option label="全部"
                       value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设置排序">
          <el-select class="wm_cardlist_select type_120"
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
    <div class="wm_battle_cry_body">
      <transition name="el-fade-in-linear">
        <div class="wm_market_tips"
             v-if="userCard.length<=0&&!pageChangeing">您暂时没有可升级的卡牌！</div>
      </transition>
      <transition name="el-fade-in-linear">
        <el-row :gutter="20"
                v-if="userCard.length>0">
          <el-col :sm="12"
                  class="tc mb20"
                  v-for="(item,index) in userCard"
                  v-bind:key="index">
            <el-card class="box-card"
                     :body-style="{ padding: '4%' }">
              <table class="wm_levle_card_table">
                <tbody>
                  <td>
                    <el-tooltip class="item"
                                effect="dark"
                                content="点击查看市场和卡牌信息！"
                                placement="top"
                                :enterable="false"
                                :disabled="tootipsDisabled">
                      <div class="wm_level_card_img_body mb10 wm_set_pointer"
                           @click="goMarket(item)">
                        <img :src="$wikimoecard.url+item.packageId+'/'+item.cardId+'.jpg'"
                             class="w_10 wm_level_card_img">
                      </div>
                    </el-tooltip>
                  </td>
                  <td>
                    <h5 class="mb5 f18">Lv.{{item.level+1}}</h5>
                    <p class="cRed mb20">
                      <el-tooltip placement="top">
                        <div slot="content"
                             class="tc"
                             v-if="item.leftType==1">
                          <p class="mb5">每升一级攻击力+50、防御力+25</p>
                          <p class="mb5">当前攻击+{{item.level*50}}</p>
                          <p class="mb5">当前防御+{{item.level*25}}</p>
                          <p class="mb5">下一级攻击+{{item.level*50+50}}</p>
                          <p class="mb5">下一级防御+{{item.level*25+25}}</p>
                        </div>
                        <div slot="content"
                             class="tc"
                             v-else-if="item.leftType==2">
                          <p class="mb5">每升一级攻击力+100</p>
                          <p class="mb5">当前攻击+{{item.level*100}}</p>
                          <p class="mb5">下一级攻击+{{item.level*100+100}}</p>
                        </div>
                        <div slot="content"
                             class="tc"
                             v-else-if="item.leftType==3">
                          <p class="mb5">每升一级防御力+50</p>
                          <p class="mb5">当前防御+{{item.level*50}}</p>
                          <p class="mb5">下一级防御+{{item.level*50+50}}</p>
                        </div>
                        <div slot="content"
                             class="tc"
                             v-else-if="item.leftType==4">
                          <p class="mb5">每升一级速度+1</p>
                          <p class="mb5">当前速度+{{item.level*1}}</p>
                          <p class="mb5">下一级速度+{{item.level*1+1}}</p>
                        </div>
                        <div slot="content"
                             class="tc"
                             v-else-if="item.leftType==5">
                          <p class="mb5">每升一级SAN+1150</p>
                          <p class="mb5">当前SAN+{{item.level*1150}}</p>
                          <p class="mb5">下一级SAN+{{item.level*1150+1150}}</p>
                        </div>
                        <span class="wm_set_pointer">查看属性加成</span>
                      </el-tooltip>
                    </p>
                    <p class="mb10 f18">升级需要</p>
                    <!-- 未勾选使用碎片 -->
                    <div class="mb20"
                         v-show="!item.usechip">
                      <p class="mb10">
                        <el-tooltip placement="top">
                          <div slot="content"
                               class="wm_upcard_tooltips">需要{{itemShould(item.leftType,item.level)}}个【{{itemData_[item.cry+''+item.leftType].name}}】，可通过挖矿获得。</div><img class="wm_level_card_item_img wm_set_pointer"
                               :src="'/static/otherImg/item/'+item.cry+''+item.leftType+'.png'" />
                        </el-tooltip>×{{itemShould(item.leftType,item.level)}}({{myItem[item.cry+''+item.leftType] || 0}})
                      </p>
                      <div class="mb10">
                        <div class="wm_level_card_ico_img_body">
                          <el-tooltip placement="top"
                                      :disabled="tootipsDisabled">
                            <div slot="content"
                                 class="wm_upcard_tooltips">需要{{setCardShould(item.star,item.level)}}张【{{item.name}}】，除了默认获取途径外还可以从市场交易获得。</div><img class="wm_level_card_ico_img wm_set_pointer"
                                 :src="$wikimoecard.url+item.packageId+'/'+item.cardId+'.jpg'"
                                 @click="goMarket(item)" />
                          </el-tooltip>
                        </div><span>×{{setCardShould(item.star,item.level)}}({{item.count}})</span>
                      </div>
                      <div class="mb10">
                        <div class="wm_level_card_ico_img_body">
                          <el-tooltip placement="top">
                            <div slot="content"
                                 class="wm_upcard_tooltips">您未使用碎片，升级将不会消耗【{{itemData_['1'+PrefixInteger_(item.star,2)].name}}】，<br />如果您需要使用碎片来替代缺少的卡牌可以勾选【使用碎片】。<br />碎片可以从【卡牌分解】中获得。</div><img class="wm_level_card_ico_img wm_set_pointer"
                                 :src="'/static/otherImg/item/'+'1'+PrefixInteger_(item.star,2)+'.png'" />
                          </el-tooltip>
                        </div><span>×0({{myItem['1'+PrefixInteger_(item.star,2)] || 0}})</span>
                      </div>
                    </div>
                    <!-- 勾选使用碎片 -->
                    <div class="mb20"
                         v-show="item.usechip">
                      <p class="mb10">
                        <el-tooltip placement="top">
                          <div slot="content"
                               class="wm_upcard_tooltips">需要{{itemShould(item.leftType,item.level)}}个【{{itemData_[item.cry+''+item.leftType].name}}】，可通过挖矿获得。</div><img class="wm_level_card_item_img wm_set_pointer"
                               :src="'/static/otherImg/item/'+item.cry+''+item.leftType+'.png'" />
                        </el-tooltip>×{{itemShould(item.leftType,item.level)}}({{myItem[item.cry+''+item.leftType] || 0}})
                      </p>
                      <div class="mb10">
                        <div class="wm_level_card_ico_img_body">
                          <el-tooltip placement="top">
                            <div slot="content"
                                 class="wm_upcard_tooltips">需要{{item.count>setCardShould(item.star,item.level)?setCardShould(item.star,item.level):item.count}}张【{{item.name}}】，可通过抽卡或者市场交易获得。</div><img class="wm_level_card_ico_img wm_set_pointer"
                                 :src="$wikimoecard.url+item.packageId+'/'+item.cardId+'.jpg'" />
                          </el-tooltip>
                        </div><span>×{{item.count>setCardShould(item.star,item.level)?setCardShould(item.star,item.level):item.count}}({{item.count}})</span>
                      </div>
                      <div class="mb10">
                        <div class="wm_level_card_ico_img_body">
                          <el-tooltip placement="top">
                            <div slot="content"
                                 class="wm_upcard_tooltips">需要{{item.count>setCardShould(item.star,item.level)?0:(setCardShould(item.star,item.level)-item.count)*3}}个【{{itemData_['1'+PrefixInteger_(item.star,2)].name}}】，<br />碎片可以从【卡牌分解】中获得。</div><img class="wm_level_card_ico_img wm_set_pointer"
                                 :src="'/static/otherImg/item/'+'1'+PrefixInteger_(item.star,2)+'.png'" />
                          </el-tooltip>
                        </div><span>×{{item.count>setCardShould(item.star,item.level)?0:(setCardShould(item.star,item.level)-item.count)*3}}({{myItem['1'+PrefixInteger_(item.star,2)] || 0}})</span>
                      </div>
                    </div>
                    <div class="mb20">
                      <el-checkbox v-model="item.usechip"
                                   @change="chipChange">使用碎片</el-checkbox>
                    </div>
                    <!-- <p class="mb10">成功率:{{[item.level,item.leftType] | setChenggolv}}%</p> -->
                    <div class="mt20 pb10">
                      <el-dropdown split-button
                                   type="primary"
                                   size="medium"
                                   trigger="click"
                                   @click="upgradecard(item.cardId,index,item.usechip)"
                                   @command="goChangeLevel">
                        升级
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item :command="item">转换等级</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </td>
                </tbody>
              </table>
            </el-card>
          </el-col>
        </el-row>
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
      <div class="mt20 tc wm_upgradecard_bt_btn_body">
        <el-button @click="goRouter('/battle')">返回</el-button>
        <el-button type="primary"
                   @click="goRouter('/battlecard')">组卡</el-button>
        <el-button type="info"
                   @click="openItemBag">物品</el-button>
      </div>
    </div>
    <menuView></menuView>
    <el-dialog title="我的物品"
               :visible.sync="itemDialog"
               class="reg_code_dialog"
               width="100%">
      <div class="tc">
        <el-tooltip v-for="(item,index) in myItem"
                    v-bind:key="index"
                    :enterable="false"
                    effect="dark"
                    :content="itemData_[index].name"
                    placement="top"
                    v-show="myItem[index]>0">
          <div class="wm_upcard_get_item wm_set_pointer">
            <img :src="'/static/otherImg/item/'+index+'.png'"
                 width="24px"
                 height="24px" />×{{myItem[index]}}
          </div>
        </el-tooltip>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="itemDialog = false">关闭</el-button>
      </span>
    </el-dialog>
    <cardInfoDialog @cardInfoShow="cardInfoDiaShow"
                    :cardInfoDigShow="cardInfoShow"
                    :cardData="cardData"
                    @buyNewCard="updateMyCard"
                    @updateUserinfo="updateUserinfo"></cardInfoDialog>
  </div>
</template>

<script>
import menuView from '../components/menu.vue';
import { authApi } from "../api";
import userTop from '../components/topUserInfo.vue';
import battle from '../components/battle.vue';
import cardInfoDialog from "../components/cardInfo"
import itemData from '../../../../server/data/item';
import { PrefixInteger, md5Check, packageSort } from "../../utils/utils";
import md5_ from 'js-md5';

export default {
  data () {
    return {
      cardCount: {},
      tootipsDisabled: false,
      cardData: null,
      cardInfoShow: false,
      itemDialog: false,
      token: sessionStorage.getItem("token") ? sessionStorage.getItem("token") : localStorage.getItem("token"),
      battleData: null,
      battleSence: false,
      myBattleTimes: '--',
      battleOverTimes: '--',
      itemData_: itemData,
      userCardCache: null,
      cardPage: Number(this.$route.query.page) || 1,
      cardTotle: 0,
      userCard: [],
      pageChangeing: false,
      searchForm: {
        star: this.$route.query.star || '0',
        cry: this.$route.query.cry || '0',
        rightType: this.$route.query.rightType || '0',
        leftType: this.$route.query.leftType || '0',
        battle: this.$route.query.battle || '2',
        sort: this.$route.query.sort || '0'
      },
      myBattleCard: [],
      myCardCount: {},
      myCardLevel: {},
      itemData_: itemData,
      myItem: {},
      seledCardPackage: this.$route.query.packageId || '-1',
      cardPackage: [
        {
          name: "加载中...",
          packageId: "-1"
        }
      ],
      battleMode: this.$route.query.battleMode === "false" ? false : true,
    }
  },
  components: {
    menuView,
    userTop,
    battle,
    cardInfoDialog
  },
  filters: {
    setChenggolv (v) {
      let lv = v[0];
      let leftType = v[1];
      let n = 100;
      let down = 5;
      if (lv < 5) {
        return n;
      }
      if (leftType === 3) {
        down = 2;
      } else if (leftType === 1) {
        down = 4;
      }
      n = 100 - (lv + 1 - 5) * down;
      if (n < 1) {
        n = 1;
      }
      return n;
    },
    setItemShould (v) {
      if (v == 1) {
        return 45;
      } else if (v == 2) {
        return 60;
      } else if (v == 3) {
        return 30;
      } else if (v == 4) {
        return 60;
      } else if (v == 5) {
        return 150;
      }
    }
  },
  mounted () {
    this.$emit('l2dMassage', '这里可以升级自己的卡牌，所需材料可以在挖矿中获得，卡牌可以通过抽卡、猜卡、结缘或者市场购买获得。如果卡牌不足可以通过卡牌碎片来替代卡牌，卡牌碎片可以通过分解卡牌获得。');
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
    itemShould (leftType, level = 0) {
      let addCoe = 0;
      if (level > 19) { //假如等级大于20则需要的矿石数量会增加
        addCoe = level - 19;
      }
      let itemCount = 0;
      if (leftType == 1) {
        const itemCountBase = 45;
        itemCount = itemCountBase + (itemCountBase / 5 * addCoe);
      } else if (leftType == 2) {
        const itemCountBase = 60;
        itemCount = itemCountBase + (itemCountBase / 5 * addCoe);
      } else if (leftType == 3) {
        const itemCountBase = 30;
        itemCount = itemCountBase + (itemCountBase / 5 * addCoe);
      } else if (leftType == 4) {
        const itemCountBase = 60;
        itemCount = itemCountBase + (itemCountBase / 5 * addCoe);
      } else if (leftType == 5) {
        const itemCountBase = 345;
        itemCount = itemCountBase + (itemCountBase / 5 * addCoe);
      }
      return Math.round(itemCount);
    },
    updateUserinfo () {
      this.$refs.userTop.getUserInfo();
    },
    updateMyCard () {
      let mycard = new Promise((resolve, reject) => {
        this.getMycard(resolve, reject);
      });
      Promise.all([mycard]).then((results) => {
        this.initData(this.cardPage);
      })
    },
    cardInfoDiaShow (v) {
      this.cardInfoShow = v;
    },
    apiInit () {
      let battlecard = new Promise((resolve, reject) => {
        this.getMyBattleCard(resolve, reject);
      });
      let mycard = new Promise((resolve, reject) => {
        this.getMycard(resolve, reject);
      });
      let myItem = new Promise((resolve, reject) => {
        this.searchuseritem(resolve, reject);
      });
      // 同时执行p1和p2，并在它们都完成后执行then:
      Promise.all([battlecard, mycard, myItem]).then((results) => {
        this.initData(this.cardPage);
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
    chipChange (v) {
      this.$forceUpdate();
    },
    goMarket (info) {
      console.log(info);
      this.cardData = {
        cardId: info.cardId,
        packageId: info.packageId,
        name: info.name,
        title: info.title,
        star: info.star,
        cry: info.cry,
        leftType: info.leftType,
        rightType: info.rightType,
        have: info.count,
        level: info.level
      }
      this.cardInfoShow = true;
      this.tootipsDisabled = true;
      setTimeout(() => {
        this.tootipsDisabled = false;
      }, 20)
    },
    goChangeLevel (c) {
      let changeCardLvel = c.level;
      let changeItem = this.myItem['200'];
      if (changeItem > 0) {
        const upgradeDataJSON = JSON.stringify({
          page: this.cardPage,
          star: this.searchForm.star,
          cry: this.searchForm.cry,
          rightType: this.searchForm.rightType,
          leftType: this.searchForm.leftType,
          battle: this.searchForm.battle,
          sort: this.searchForm.sort,
          packageId: this.seledCardPackage,
          battleMode: String(this.battleMode),
        })
        this.$router.push({
          path: '/cardlevelchange',
          query: {
            from: c.cardId,
            item: changeItem,
            packageId: c.packageId,
            leftType: c.leftType,
            star: c.star,
            fromLevel: c.level,
            upgradeData: btoa(upgradeDataJSON)
          }
        });
      } else {
        this.$message('您的等级转换道具不足！');
      }
    },
    setCardShould (v, l = 0) {
      let shouldCard = 0;
      let shouldCoe = 0;
      let shouldCardBase = 0;
      if (l > 19) {
        shouldCoe = l - 19;
      }
      switch (v) {
        case 1:
          shouldCardBase = 4;
          shouldCard = shouldCardBase + ((shouldCardBase - 1) * shouldCoe);
          break;
        case 2:
          shouldCardBase = 4;
          shouldCard = shouldCardBase + ((shouldCardBase - 1) * shouldCoe);
          break;
        case 3:
          shouldCardBase = 16;
          shouldCard = shouldCardBase + ((shouldCardBase - 1) * shouldCoe);
          break;
        case 4:
          shouldCardBase = 6;
          shouldCard = shouldCardBase + ((shouldCardBase - 1) * shouldCoe);
          break;
        case 5:
          shouldCardBase = 4;
          shouldCard = shouldCardBase + ((shouldCardBase - 1) * shouldCoe);
          break;
        case 6:
          shouldCardBase = 2;
          shouldCard = shouldCardBase + ((shouldCardBase - 1) * shouldCoe);
          break;
      }
      return Math.round(shouldCard);
    },
    openItemBag () {
      //查看有没有道具
      let MyItemArr = Object.values(this.myItem);
      MyItemArr = MyItemArr.filter(function (item) {
        return item > 0;
      });
      if (MyItemArr.length <= 0) {
        this.$message('您的仓库空空如也，快去挖矿吧！');
      } else {
        this.itemDialog = true;
      }
    },
    upgradecard (cardId, index, usePieces) {
      this.$confirm('升级将消耗卡牌和道具，是否继续?', '提示', {
        confirmButtonText: '升级',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).then(() => {
        let params = {
          token: this.token,
          cardId: cardId,
          usePieces: usePieces
        }
        authApi.upgradecard(params).then(res => {
          console.log(res);
          if (res.data.code == 0) {
            this.$message.error(res.data.msg);
          } else if (res.data.code == 1) {
            if (res.data.isSuccess) {
              this.$message({
                message: '卡牌成功升级到' + (res.data.myCardLevel + 1) + '级！',
                type: 'success'
              });

            } else {
              this.$message({
                dangerouslyUseHTMLString: true,
                message: '升级失败，您获得了<span class="cOrange">' + res.data.getStar + '</span>颗星星！'
              });
              this.$refs.userTop.getUserInfo();
            }
            this.userCard[index].count = res.data.cardNum;
            this.userCard[index].level = res.data.myCardLevel;
            this.myItem[res.data.itemId] = res.data.itemNum;
            if (usePieces) {
              this.myItem[res.data.pieceId] = res.data.myPieces;
            }
            this.$forceUpdate();
          }
        });
      }).catch(() => {
      });
    },
    searchChanged () {
      this.cardPage = 1;
      this.cardPageChange(1);
    },
    PrefixInteger_ (num, length) {
      return PrefixInteger(num, length);
    },
    initData (update) {//初始化数据
      for (let i = 0; i < this.userCardCache.length; i++) {
        this.userCardCache[i].usechip = false;
        this.userCardCache[i].battle = false;
        this.userCardCache[i].count = this.myCardCount[this.userCardCache[i].cardId]
        // 筛选卡牌是否已经出战
        for (let j = 0; j < this.myBattleCard.length; j++) {
          if (this.userCardCache[i].cardId === this.myBattleCard[j]) {
            this.userCardCache[i].battle = true;
          }
        }
        let cardlv = this.myCardLevel[this.userCardCache[i].cardId];
        this.userCardCache[i].level = 0;
        if (cardlv) {
          this.userCardCache[i].level = cardlv;
        }
      }
      // 0卡牌id、1卡牌数量、2卡牌是否出战、3卡牌等级、4卡牌信息、5是否使用碎片
      if (update) {
        this.cardPageChange(this.cardPage);
      } else {
        this.cardPageChange(1);
      }
    },
    cardPageChange (val) {
      console.log('page', val)
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
      function setBattle (item) {
        let p_ = that.searchForm.battle;
        if (p_ === '2') {
          return true;
        } else if (p_ === '0') {
          return item;
        } else {
          return !item;
        }
        return false;
      }
      function setSort (a, b) {
        let sort_ = that.searchForm.sort;
        if (that.battleMode) {
          if ((that.myCardLevel[a.cardId] || 0) < (that.myCardLevel[b.cardId] || 0)) {
            return 1;
          } else if ((that.myCardLevel[a.cardId] || 0) > (that.myCardLevel[b.cardId] || 0)) {
            return -1;
          } else {
            return b.cardId - a.cardId;
          }
        }
        else if (sort_ === '0') {
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

      let userCardSearchRes = [];
      if (this.battleMode) {
        userCardSearchRes = this.userCardCache;
      } else {
        userCardSearchRes = this.userCardCache.filter(item => setStar(item.star) && setCry(item.cry) && setRightType(item.rightType) && setLeftType(item.leftType) && setBattle(item.battle));
      }
      userCardSearchRes = userCardSearchRes.sort(setSort);
      let userCard_ = userCardSearchRes.slice((val - 1) * 20, val * 20);
      this.cardTotle = userCardSearchRes.length;
      setTimeout(() => {
        this.userCard = userCard_;
        this.pageChangeing = false;
      }, 300);
      this.routerReplace();
    },
    routerReplace () {
      this.$router.replace({
        name: 'upgradecard',
        query: {
          page: this.cardPage,
          star: this.searchForm.star,
          cry: this.searchForm.cry,
          rightType: this.searchForm.rightType,
          leftType: this.searchForm.leftType,
          battle: this.searchForm.battle,
          sort: this.searchForm.sort,
          packageId: this.seledCardPackage,
          battleMode: String(this.battleMode),
        }
      });
    },
    searchuseritem (resolve, reject) {
      let params = {
        token: this.token
      }
      authApi.searchuseritem(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          reject({ msg: 'error' });
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          if (res.data.data) {
            this.myItem = res.data.data;
          }
          resolve('ok');
        }
      });
    },
    getMyBattleCard (resolve, reject) {
      if (this.battleMode) {
        resolve('ok');
        return false;
      }
      let params = {
        token: this.token,
        type: 'search'
      }
      authApi.battlecard(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          reject({ msg: 'error' });
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.myBattleCard = res.data.cardId;
          resolve('ok');
        }
      });
    },
    getMycard (resolve, reject) {
      authApi.searchcardbytoken({ token: this.token, packageId: this.seledCardPackage, battleOnly: this.battleMode }).then(res => {
        if (res.data.code == 0) {
          reject({ msg: 'error' });
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          resolve('ok');
          let resData = res.data;
          this.myCardLevel = res.data.cardLevelData || {};
          this.myCardCount = res.data.cardCount || {};
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
    goRouter (path) {
      this.$router.push({
        path: path
      });
    },
  }
}
</script>

<style scoped>
.wm_levle_card_table {
  width: 100%;
}
.wm_levle_card_table td {
  width: 50%;
  padding: 0px;
}
.wm_level_card_ico_img {
  height: 100%;
  width: auto;
}
.wm_level_card_ico_img_body {
  height: 24px;
  width: 24px;
  display: inline-block;
  text-align: center;
}
.wm_level_card_img_body {
  padding-bottom: calc(100% * 1.4);
  position: relative;
  z-index: 1;
}
.wm_level_card_img_body .wm_level_card_img {
  position: absolute;
  left: 0;
  top: 0;
}
.wm_battle_cry_body {
  padding: 10px 0;
}
.wm_level_card_item_img {
  width: 24px;
  height: 24px;
}
.wm_upgradecard_bt_btn_body {
  padding: 15px 0;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.95);
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 999;
}
.wm_upcard_get_item {
  display: inline-block;
  white-space: nowrap;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 4px 7px;
}
.wm_upcard_tooltips {
  line-height: 140%;
  max-width: 90vw;
}
</style>
