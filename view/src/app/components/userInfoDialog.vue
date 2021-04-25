<template>
  <div>
    <el-dialog title="查看信息"
               @open="opened"
               @closed="closed"
               :visible.sync="isOpen"
               :lock-scroll="false"
               :append-to-body="true"
               class="reg_code_dialog"
               width="100%">
      <div v-if="nowUserInfo">
        <div class="wm_top_info_more_body"
             v-show="!cardMode">
          <div><img class="wm_top_moreinfo_avatar_pic"
                 :src="'/api/gravatar.png?md5='+nowUserInfo.md5"
                 :key="nowUserInfo.md5"></div>
          <div class="wm_top_moreinfo_name mt5">{{nowUserInfo.nickName}}</div>
          <div class="wm_top_moreinfo_body clearfix">
            <div class="wm_top_moreinfo_box">
              <div class="wm_top_moreinfo_label">等级：{{nowUserInfo.level}}</div>
            </div>
            <div class="wm_top_moreinfo_box">
              <div class="wm_top_moreinfo_label">卡种量：{{nowUserInfo.cardIndexCount}}</div>
            </div>
            <div class="wm_top_moreinfo_box">
              <div class="wm_top_moreinfo_label">竞技点：{{nowUserInfo.score}}</div>
            </div>
            <div class="wm_top_moreinfo_box">
              <div class="wm_top_moreinfo_label">累计挖矿：{{nowUserInfo.deminingStarCount}}</div>
            </div>
            <div class="wm_top_moreinfo_box">
              <div class="wm_top_moreinfo_label">成功制卡：{{nowUserInfo.UCC}}</div>
            </div>
            <div class="wm_top_moreinfo_box">
              <div class="wm_top_moreinfo_label">完成任务：{{nowUserInfo.questCount}}</div>
            </div>
            <div class="wm_top_moreinfo_box">
              <div class="wm_top_moreinfo_label">猜中卡牌：{{nowUserInfo.guessCardCount}}</div>
            </div>
          </div>
        </div>
        <div class="wm_top_info_more_body clearfix"
             v-show="cardMode">
          <div class="mb15">
            <el-select v-model="seledCardPackage"
                       placeholder="选择卡包"
                       class="wm_card_package_sel"
                       @change="getUserCard">
              <el-option v-for="item in cardPackage"
                         :key="item.packageId"
                         :label="item.name"
                         :value="item.packageId">
                <span>{{item.name}}({{playerCardCount[item.packageId] || 0}}/{{item.oneStar+item.twoStar+item.threeStar+item.fourStar+item.fiveStar+item.sixStar}})</span>
              </el-option>
            </el-select>
          </div>
          <div class="wm_userinfo_dialog_card_body">
            <div class="wm_market_card_datail_charts_empty"
                 v-if="userCard.length<=0">
              <span>该卡包下没有卡牌</span>
            </div>
            <div class="clearfix">
              <div class="wm_userinfo_dialog_user_card_item wm_set_pointer"
                   v-for="(item,index) in userCard"
                   v-bind:key="index"
                   @click="openImg($wikimoecard.url+(item.packageId||'0')+'/'+item.cardId+'.jpg')">
                <img :src="$wikimoecard.url+(item.packageId||'0')+'/'+item.cardId+'.jpg'"
                     :key="item.cardId">
                <div class="f12 mt5">×{{item.count}}</div>
              </div>
            </div>
            <div>
              <el-pagination small
                             layout="prev, pager, next"
                             :total="cardTotle"
                             @current-change="cardPageChange"
                             :current-page.sync="cardPage"
                             :page-size="10"
                             class="my_card_page">
              </el-pagination>
            </div>
          </div>

        </div>
      </div>
      <div class="wm_market_card_datail_charts_empty"
           v-else>
        <span>信息加载中...</span>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="cardMode=!cardMode">{{cardMode?'查看信息':'查看卡牌'}}</el-button>
        <el-button @click="copyUrl"
                   type="info">复制链接</el-button>
        <el-button @click="isOpen = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import { authApi } from "../api";
import { packageSort } from "../../utils/utils";
export default {
  props: {
    md5: {
      type: String,
      default: ""
    },
    userDialogOpen: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      playerCardCount: {},
      cardPackage: [],
      seledCardPackage: "0",
      cardMode: false,
      userCardCache: [],
      userCard: [],
      cardPage: 1,
      cardTotle: 0,
      userCardCount: 0,
      nowUserInfo: null
    };
  },
  computed: {
    isOpen: {
      get () {
        return this.userDialogOpen;
      },
      set (val) { // 当visible改变的时候，触发父组件的 updateVisible方法，在该方法中更改传入子组件的 centerDialogVisible的值
        this.$emit("updateVisible", val);
      }
    }
  },
  methods: {
    copyUrl () {
      this.$copyText(window.location.origin + "?md5=" + this.md5).then(
        e => {
          this.$message({
            message: "复制分享地址成功！",
            type: "success"
          });
        },
        function (e) {
          this.$message.error("复制分享链接失败！");
          console.log(e);
        }
      );
    },
    searchPlayerCardCount (md5) {
      this.playerCardCount = {}
      if (md5) {
        authApi.searchCardCount({ md5: md5 }).then(res => {
          console.log(res);
          if (res.data.code === 1) {
            this.playerCardCount = res.data.cardCount
          }
        });
      }
    },
    openImg (imgsrc) {
      this.$alert('<div class="watch_img"><img src="' + imgsrc + '" /></div>', '查看卡牌', {
        dangerouslyUseHTMLString: true,
        lockScroll: false
      });
    },
    closed () {
      this.cardPage = 1;
      this.cardTotle = 0;
      this.cardMode = false;
      this.nowUserInfo = null;
    },
    getUserCard () {
      this.getInfo()
    },
    getInfo () {
      authApi.searchcard({ md5: this.md5, packageId: this.seledCardPackage }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          let resData = res.data;
          if (resData.cardIndexCount > 0) {
            this.userCardCache = res.data.card || [];
            this.userCardCache.forEach((item, index) => {
              this.userCardCache[index]["count"] = resData.cardCount[this.userCardCache[index]["cardId"]] || 0
            });
            this.userCardCache = this.userCardCache.sort((a, b) => {
              if (b.star != a.star) {
                return b.star - a.star;
              } else {
                return b.cardId - a.cardId;
              }
            })
            this.cardPage = 1;
            this.cardTotle = this.userCardCache.length;
            this.userCardCount = res.data.cardCount;
            this.nowUserInfo = {
              score: resData.score,//竞技点
              level: resData.level,//等级
              cardIndexCount: resData.cardIndexCount,//收集卡牌
              nickName: resData.nickName,
              cardCount: resData.cardCount,

              deminingStarCount: resData.deminingStarCount,
              UCC: resData.UCC,
              questCount: resData.questCount,
              guessCardCount: resData.guessCardCount,

              md5: resData.md5,
            };//当前用户信息
            this.cardPageChange(this.cardPage);
            //this.userCard = res.data.card;
          }
        }
      });
    },
    opened () {
      this.searchPlayerCardCount(this.md5)
      authApi.searchcardpackage({ sortType: "open" }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.cardPackage = res.data.data;
          this.seledCardPackage = '';
          // 给卡包排序
          this.cardPackage = packageSort(this.cardPackage, res.data.sortData, "open");

          const openPackage = this.cardPackage.find((item) => {
            return item.open;
          })
          if (this.seledCardPackage === "" && openPackage) {
            // 如果没有默认选中的卡包则获取第一个卡包
            this.seledCardPackage = openPackage.packageId;
          }
          this.getInfo()
        }
      });
    },
    cardPageChange (val) {
      this.userCard = this.userCardCache.slice((val - 1) * 10, val * 10);
    },
  }
}
</script>

<style>
.wm_userinfo_dialog_user_card_item {
  width: 20%;
  display: inline-block;
  padding: 5px;
  box-sizing: border-box;
  overflow: hidden;
}
.wm_userinfo_dialog_user_card_item img {
  width: 100%;
  height: auto;
}
/* .wm_userinfo_dialog_card_body {
  max-height: 40vh;
  overflow: auto;
} */
</style>