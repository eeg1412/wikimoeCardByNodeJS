<template>
  <div class="common_body">
    <userTop ref="userTop" />
    <h5 class="common_title type_shop">结缘神社</h5>
    <div class="tc">
      <el-select v-model="seledCardPackage"
                 placeholder="选择卡包"
                 class="wm_card_package_sel"
                 :disabled="openList">
        <el-option v-for="item in cardPackage"
                   :key="item.packageId"
                   :label="item.name"
                   :value="item.packageId">
          <span>{{item.name}}({{cardCount[item.packageId] || 0}}/{{item.oneStar+item.twoStar+item.threeStar+item.fourStar+item.fiveStar+item.sixStar}})</span>
        </el-option>
      </el-select>
    </div>
    <el-collapse-transition>
      <div class="shop_card_list_body"
           v-if="openList">
        <div class="shop_card_list_btn_body"
             id="shopCardListBtnBody">
          <div class="shop_card_list_btn_box"
               :class="shopCardListBtnBodyFixed?'flex_mode':''">
            <el-button type="primary"
                       @click="back()">返回结缘</el-button>
            <el-button type="primary"
                       @click="openAll()">全部翻开</el-button>
          </div>
        </div>
        <sequential-entrance delay="100"
                             tag="div">
          <div v-for="(item,index) in cardList"
               v-bind:key="index+1"
               class="shop_card_list_box"
               :class="item.seled?'selectedcard':''"
               @click="openCard(index)">
            <rotate3DCard trigger="custom"
                          v-model="item.seled"
                          :isNew="item.isNew"
                          direction="row"
                          :cardSrc="$wikimoecard.url+packageId+'/'+item.id+'.jpg'">
              <slot name="cz"></slot>
              <slot name="cf"></slot>
            </rotate3DCard>
          </div>
        </sequential-entrance>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div class="wm_shop_item_list_body type_goen"
           v-if="!openList">
        <div class="wm_shop_item_list_box">
          <div class="wm_goen_saiqian_box mb10">
            <!-- <img src="/static/otherImg/goen/goen0.jpg" class="wm_goen_saiqian_img type_a" />
            <img src="/static/otherImg/goen/goen1.jpg" class="wm_goen_saiqian_img type_b" /> -->
            <img src="/static/otherImg/goen/goen2.gif"
                 class="wm_goen_saiqian_img type_c" />
          </div>
          <div class="tc mb10">
            <el-button type="primary"
                       size="small"
                       @click="buy(1,0)">结缘1次</el-button>
            <el-button type="primary"
                       size="small"
                       @click="buy(1,1)">结缘10次</el-button>
            <el-button type="primary"
                       size="small"
                       @click="buy(1,2)">结缘30次</el-button>
          </div>
          <div class="wm_shop_item_list_text">每次结缘需要1枚<el-tooltip effect="dark"
                        content="【结缘币】通过每个月竞技点结算获得！"
                        placement="top"
                        :enterable="false"><span>【结缘币】</span></el-tooltip><br />(持有:{{myItem['300']||0}})</div>
        </div>
      </div>
    </el-collapse-transition>
    <menuView></menuView>
  </div>
</template>

<script>
import { scrollToTop, PrefixInteger, loadingImg, showLoading, hideLoading, packageSort } from "../../utils/utils";
import rotate3DCard from '../components/rotateCard.vue';
import menuView from '../components/menu.vue';
import { authApi } from "../api";
import userTop from '../components/topUserInfo.vue';

export default {
  data () {
    return {
      cardCount: {},
      seledCardPackage: '加载中',
      cardPackage: [],
      openList: false,
      cardList: [],
      userData: null,
      token: sessionStorage.getItem("token") ? sessionStorage.getItem("token") : localStorage.getItem("token"),
      shopCardListBtnBodyFixed: false,
      packageId: 0,
      myItem: {},
    }
  },
  components: {
    rotate3DCard,
    menuView,
    userTop
  },
  mounted () {
    this.$emit('l2dMassage', '这里可以使用结缘币来结缘，祝您结到一份好姻缘。');
    window.addEventListener('scroll', this.menuTop);
    this.searchCardCount();
    this.getCardPackage();
    this.searchuseritem();
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
    searchuseritem () {
      let params = {
        token: this.token
      }
      authApi.searchuseritem(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          if (res.data.data) {
            this.myItem = res.data.data;
          }
        }
      });
    },
    rememberPackageId () {
      const packageId = this.seledCardPackage;
      localStorage.setItem("goenCardPackageId", packageId);
    },
    getCardPackage () {
      authApi.searchcardpackage({ sortType: "starCoinOpen" }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.cardPackage = res.data.data.filter(item => { return item.starCoinOpen });
          // 给卡包排序
          this.cardPackage = packageSort(this.cardPackage, res.data.sortData, "starCoinOpen");

          let nowPackageId = localStorage.getItem("goenCardPackageId");
          this.cardPackage = this.cardPackage.filter(item => { return item.starCoinOpen });
          this.seledCardPackage = "";
          // 如果缓存中存在默认卡牌ID
          if (nowPackageId) {
            const seledCardPackageInfo = this.cardPackage.find((item) => {
              return item.packageId === nowPackageId && item.starCoinOpen;
            });
            if (seledCardPackageInfo) {
              this.seledCardPackage = seledCardPackageInfo.packageId;
            }
          }
          const openPackage = this.cardPackage.find((item) => {
            return item.starCoinOpen;
          })
          if (this.seledCardPackage === "" && openPackage) {
            // 如果没有默认选中的卡包则获取第一个卡包
            this.seledCardPackage = openPackage.packageId;
          }
        }
      });
    },
    menuTop () {
      let el = document.getElementById('shopCardListBtnBody');
      if (!el) {
        return false;
      }
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      let offsetTop = el.offsetTop;
      scrollTop > offsetTop ? this.shopCardListBtnBodyFixed = true : this.shopCardListBtnBodyFixed = false;
    },
    back () {
      this.cardList = [];
      this.openList = false;
    },
    openAll () {
      for (let i = 0; i < this.cardList.length; i++) {
        this.cardList[i].seled = true;
      }
    },
    openCard (i) {
      if (this.cardList[i].seled) {
        return false;
      }
      this.cardList[i].seled = true;
    },
    PrefixInteger_ (num, length) {
      return PrefixInteger(num, length);
    },
    buy (t, g) {
      this.$confirm('确定选择该卡包结缘吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).then(() => {
        let params = {
          type: t,
          goods: g,
          token: this.token,
          packageId: this.seledCardPackage,
        }
        this.rememberPackageId();
        authApi.shop(params).then(res => {
          console.log(res);
          if (res.data.code == 0) {
            this.$message.error(res.data.msg);
          } else if (res.data.code == 1) {
            this.packageId = res.data.packageId;
            let cardResData = res.data.data;
            let cardData = [];
            let cardSrc = [];
            for (let i = 0; i < cardResData.length; i++) {
              // let CardSrcItem = this.$wikimoecard.url+res.data.packageId+'/'+cardResData[0]+'.jpg';
              // cardSrc.push(CardSrcItem);

              let cardId = cardResData[i];
              let cardDataItem = {
                id: cardId,
                seled: false
              }
              cardData.push(cardDataItem);
            }
            res.data.newList.forEach(item => {
              const i = cardData.findIndex((card) => {
                return card.id === item;
              });
              cardData[i].isNew = true;
            });
            this.cardList = cardData;
            this.$refs.userTop.getUserInfo();
            this.searchuseritem();
            this.searchCardCount();
            setTimeout(() => {
              scrollToTop(0, 200);
              this.openList = true;
            }, 120)
          }
        });
      }).catch(() => { });
    },
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.menuTop);
  }
}
</script>

<style scoped>
.wm_goen_saiqian_img {
  max-width: 100%;
  height: auto;
}
.wm_goen_saiqian_box:hover .wm_goen_saiqian_img.type_b {
  display: block;
}
.wm_goen_saiqian_box:hover .wm_goen_saiqian_img.type_a {
  display: none;
}
.wm_goen_saiqian_img.type_b {
  display: none;
}
.wm_shop_item_list_body.type_goen {
  margin-top: 10px;
}
</style>
