<template>
  <div>
    <userTop ref="userTop" />
    <div class="common_body">
      <h5 class="common_title type_demining">
        <el-tooltip placement="bottom"
                    :enterable="false">
          <div slot="content">
            <div v-if="!mineInfo">
              <div class="wm_demining_hight_item_list_body tc">
                数据加载中...
              </div>
            </div>
            <div v-else>
              <div class="f14 tc">本矿场高产出宝石</div>
              <div class="mt10 tc wm_demining_hight_item_list_body">
                <img v-for="(item, index) in mapData_[mineInfo.data.mapType].high"
                     v-bind:key="index"
                     :src="'/static/otherImg/item/' + item + '.png'"
                     width="24px"
                     height="24px"
                     class="wm_demining_hight_item_list_img" />
              </div>
            </div>
          </div>
          <span class="wm_set_pointer">星星矿场</span>
        </el-tooltip>
      </h5>
      <h6 class="common_title_tips type_dec type_demining">
        <span>{{ onlineUser }}名玩家在挖矿
          <el-tooltip class="item"
                      effect="dark"
                      content="查看挖矿玩家"
                      :enterable="false"
                      placement="top"><i class="el-icon-notebook-2 wm_set_pointer"
               @click="openUserInfo"></i></el-tooltip>
        </span>
        |
        <el-button type="text"
                   class="wm_open_coin_dialog_btn"
                   @click="openMysteriousFragmentShopDialog">神秘碎片商店</el-button>
      </h6>
      <div class="wm_card_demining_tool_body"
           v-if="userData">
        <hooper class="wm_demin_tool_hooper">
          <slide>
            <div class="wm_demin_tool_hooper_item_body clearfix">
              <div @click="selPickChange(0)">
                <pickaxe :type="0"
                         :sel="selPick"
                         :timeNow="userData.timeNow"
                         :timeEnd="Number(userData.deminingStamp[0])"
                         ref="pick0"></pickaxe>
              </div>
              <div @click="selPickChange(1)">
                <pickaxe :type="1"
                         :sel="selPick"
                         :timeNow="userData.timeNow"
                         :timeEnd="Number(userData.deminingStamp[1])"
                         ref="pick1"></pickaxe>
              </div>
              <div @click="selPickChange(2)">
                <pickaxe :type="2"
                         :sel="selPick"
                         :timeNow="userData.timeNow"
                         :timeEnd="Number(userData.deminingStamp[2])"
                         ref="pick2"></pickaxe>
              </div>
            </div>
          </slide>
          <slide>
            <div class="wm_demin_tool_hooper_item_body clearfix">
              <div @click="selPickChange(3)">
                <pickaxe :type="3"
                         :sel="selPick"
                         ref="pick3"
                         :itemCount="userData.userItemTools[0]"></pickaxe>
              </div>
              <div @click="selPickChange(4)">
                <pickaxe :type="4"
                         :sel="selPick"
                         ref="pick4"
                         :itemCount="userData.userItemTools[1]"></pickaxe>
              </div>
              <div @click="selPickChange(5)">
                <pickaxe :type="5"
                         :sel="selPick"
                         ref="pick5"
                         :itemCount="userData.userItemTools[2]"></pickaxe>
              </div>
            </div>
          </slide>
          <hooper-navigation slot="hooper-addons"></hooper-navigation>
        </hooper>
      </div>
      <div class="wm_card_demining_table_box"
           :class="{ 'shake-hard': shakeCss }">
        <div v-if="!mineInfo"
             class="wm_card_demining_table_loading">
          矿场数据加载中...如果长时间无反应请刷新。
        </div>
        <table class="wm_card_demining_table">
          <tbody>
            <tr v-for="(item, index) in mineMap"
                v-bind:key="index">
              <td v-for="(items, indexs) in item"
                  v-bind:key="indexs">
                <div class="wm_demining_item"
                     :class="deminingItemClass(items.num, indexs, index)"
                     @click="openNode(indexs, index, items.num)"
                     :style="
                    'background-image:url(/static/otherImg/demining/bg' +
                      mineInfo.data.mapType +
                      '.png)'
                  ">
                  <el-tooltip class="item"
                              effect="dark"
                              :content="
                      items.num == 9
                        ? '这里是一片星星矿'
                        : '探测器显示周围有' + items.num + '片星星矿！'
                    "
                              placement="top"
                              v-if="items.num >= 0"
                              :enterable="false">
                    <div>
                      <span>{{ items.num == 9 ? "★" : items.num }}</span>
                      <img class="wm_demining_img"
                           :src="'/api/gravatar.png?md5=' + items.md5"
                           width="50"
                           height="50" />
                    </div>
                  </el-tooltip>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <menuView></menuView>
    </div>
    <captcha @captchaShow="captchaDigShow"
             @send="sendCaptcha"
             :codeDigShow="captchaShow"
             v-if="captchaShow"
             ref="captch"></captcha>
    <!-- 在线用户开始 -->
    <el-dialog title="挖矿玩家"
               :visible.sync="userDialog"
               :lock-scroll="false"
               :append-to-body="true"
               class="reg_code_dialog"
               width="100%">
      <div class="wm_menu_news_body">
        <div v-if="userList.length <= 0"
             class="pt15 pb15 tc">暂无挖矿玩家</div>
        <div v-else>
          <div v-for="(item, index) in userList"
               :key="index"
               class="wm_dem_ueser_item wm_set_pointer"
               @click="openInfo(item.md5)">
            <div class="wm_dem_ueser_img">
              <img class="wm_card_get_list_avatar_pic"
                   :src="'/api/gravatar.png?md5=' + item.md5"
                   width="45"
                   height="45" />
            </div>

            <div>
              <div>昵称：{{ item.nickName }}</div>
              <div>登陆时间：{{ item.loginTime | capitalize }}</div>
              <div>{{ item.deviceList.length }}窗口在线</div>
            </div>
          </div>
        </div>
        <el-pagination small
                       layout="prev, pager, next"
                       :total="userTotal"
                       @current-change="userPageChange"
                       :current-page.sync="userPage"
                       :page-size="5"
                       class="wm_menu_news_page">
        </el-pagination>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="userDialog = false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 在线用户结束 -->
    <!-- 神秘碎片商店开始 -->
    <el-dialog title="神秘碎片商店"
               :visible.sync="mysteriousFragmentShopDialog"
               :lock-scroll="false"
               :append-to-body="true"
               class="reg_code_dialog"
               width="100%">
      <div class="tc wm_demining_mf_count">
        神秘碎片×{{ myItem["501"] || 0 }}
      </div>
      <div class="wm_menu_news_body">
        <ul>
          <li class="wm_demining_mf_list"
              v-for="(item, index) in mysteriousFragmentShopItem"
              :key="index">
            <div class="wm_demining_mf_icon">
              <img :src="'/static/otherImg/item/' + item.id + '.png'"
                   width="32px"
                   height="32x" />
            </div>
            <div>
              <div>{{ itemData_[item.id].name }}×{{ item.get }}</div>
              <div>当前持有:{{ myItem[item.id] || 0 }}</div>
              <div>
                需要<span class="cRed">{{ item.price }}</span>个神秘碎片
              </div>
            </div>
            <div class="wm_demining_mf_btn">
              <el-button type="primary"
                         @keydown.enter.native.prevent
                         size="mini"
                         @click="mysteriousFragmentShopBuy(item.id)">兑换</el-button>
            </div>
          </li>
        </ul>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="mysteriousFragmentShopDialog = false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 神秘碎片商店结束 -->
    <userInfoDialog :md5="userMd5"
                    :userDialogOpen="userInfoDialogOpen"
                    @updateVisible="updateVisible"></userInfoDialog>
  </div>
</template>

<script>
import io from "socket.io-client";
import { showLoading, hideLoading } from "../../utils/utils";
import menuView from "../components/menu.vue";
import pickaxe from "../components/pickaxe.vue";
import userTop from "../components/topUserInfo.vue";
import captcha from "../components/captcha.vue";
import itemData from "../../../../server/data/item";
import mapData from "../../../../server/data/deminingMap";
import { authApi } from "../api";
import { Hooper, Slide, Navigation as HooperNavigation } from "hooper";
import "hooper/dist/hooper.css";
import mysteriousFragmentShopJson from "../../../../server/data/mysteriousFragmentShop.json";
import userInfoDialog from "../components/userInfoDialog.vue"

export default {
  data () {
    return {
      userMd5: "",
      userInfoDialogOpen: false,
      myItem: {},
      mysteriousFragmentShopDialog: false,
      mysteriousFragmentShopItem: mysteriousFragmentShopJson,
      openCache: {
        x: null,
        y: null,
        num: null
      },
      captchaShow: false,
      itemData_: itemData,
      mapData_: mapData,
      txDays: new Date().getDate(),
      backFlag: false,
      socket: null,
      mineMap: [],
      mineInfo: null,
      selBlock: [],
      selBlockCenter: null,
      token: sessionStorage.getItem("token")
        ? sessionStorage.getItem("token")
        : localStorage.getItem("token"),
      userData: null,
      openTime: null,
      selPick: 0,
      loading: false,
      onlineUser: 0,
      nextPickFlag: true,
      userPage: 1,
      userList: [],
      userTotal: 0,
      userDialog: false,
      shakeTimer: null,
      shakeCss: false
    };
  },
  components: {
    menuView,
    pickaxe,
    userTop,
    captcha,
    Hooper,
    Slide,
    HooperNavigation,
    userInfoDialog
  },
  mounted () {
    this.$emit(
      "l2dMassage",
      "这里挖到游戏的通货【星星】和升级卡牌所需要的材料。显示的数字暗示周围的星星数量。请注意每种镐的产出不一样哦！"
    );
    let socketurl = window.location.hostname;
    let port = window.location.port;
    this.socket = io.connect("/wsdemining?dt=" + this.token);
    // this.socket = io.connect("//" + socketurl + ":3000?dt=" + this.token);
    this.socket.on("userCount", data => {
      this.onlineUser = data.userCount;
    });
    this.socket.on("demining", data => {
      // this.socket.emit('demining',{time:new Date()});
      console.log(data);
      if (this.openTime === data.time) {
        if (this.loading) {
          hideLoading();
          this.loading = false;
        }
        this.openTime = null;
      }
      if (data.code == 1) {
        //一般性错误提示
        this.$message.error(data.msg);
      } else if (data.code == 0) {
        //获取地图
        this.mineInfo = data;
        this.creatMap(data.data);
      } else if (data.code == 2) {
        //挖到星星
        this.upDateMapData(data.x, data.y, data.md5, data.demNum);
        if (data.levelUpStar > 0) {
          this.$notify.info({
            title: "升级啦！",
            message:
              "恭喜您升级啦，作为奖励获得" + data.levelUpStar + "颗星星！",
            duration: 13000
          });
        }
        this.$message({
          dangerouslyUseHTMLString: true,
          showClose: true,
          duration: 10000,
          message:
            '恭喜您挖到了<span class="cOrange">' +
            data.star +
            "</span>颗星星！",
          type: "success"
        });
        this.$refs.userTop.getUserInfo();
      } else if (data.code == 301) {
        //需要验证码
        this.captchaShow = true;
      } else if (data.code == 201) {
        //未挖到星星
        this.upDateMapData(data.x, data.y, data.md5, data.demNum);
        if (data.levelUpStar > 0) {
          this.$notify.info({
            title: "升级啦！",
            message:
              "恭喜您升级啦，作为奖励获得" + data.levelUpStar + "颗星星！",
            duration: 13000
          });
          this.$refs.userTop.getUserInfo();
        }
        if (data.getItem) {
          this.$message({
            dangerouslyUseHTMLString: true,
            showClose: true,
            duration: 10000,
            message:
              '您挖到了<span class="cOrange">' +
              itemData[data.getItem].name +
              "×" +
              data.getItemNum +
              '</span>，同时探测器显示周围有<span class="cOrange">' +
              data.demNum +
              "</span>片星星矿！",
            type: "success"
          });
        } else {
          this.$message({
            dangerouslyUseHTMLString: true,
            showClose: true,
            duration: 10000,
            message: "很可惜，您什么都没有获得，请仔细观察下周围的数字吧！",
            type: "success"
          });
        }
      } else if (data.code == 205) {
        //使用炸弹
        //开地图
        const openList = data.openInfoList;
        for (let i = 0; i < openList.length; i++) {
          const thisOpenData = openList[i];
          this.upDateMapData(
            thisOpenData.x,
            thisOpenData.y,
            thisOpenData.md5,
            thisOpenData.num
          );
        }
        const itemList = Object.entries(data.boomItemList);
        let getHtml = "";
        for (let i = 0; i < itemList.length; i++) {
          getHtml =
            getHtml +
            '<span class="cOrange">' +
            itemData[itemList[i][0]].name +
            "×" +
            itemList[i][1] +
            "</span>、";
        }
        if (getHtml !== "") {
          getHtml = getHtml.substr(0, getHtml.length - 1);
          this.$message({
            dangerouslyUseHTMLString: true,
            showClose: true,
            duration: 10000,
            message: "您炸出了" + getHtml + "！",
            type: "success"
          });
        }
        if (data.levelUpStar > 0) {
          this.$notify.info({
            title: "升级啦！",
            message:
              "恭喜您升级啦，作为奖励获得" + data.levelUpStar + "颗星星！",
            duration: 13000
          });
          this.$refs.userTop.getUserInfo();
        }
        this.shake();
      } else if (data.code == 900) {
        // 查询用户
        this.userList = data.pageUser;
        this.userTotal = data.userTotal;
        if (this.page > 1 && this.userList.length === 0) {
          this.page = 1;
          this.searchUser();
        }
      } else if (data.code == 4) {
        //您选择的工具还在制作中！
        this.$message(data.msg);
      } else if (data.code == 3) {
        //用户信息
        this.userData = data.userData;
        //自动选择可以使用的稿
        setTimeout(() => {
          if (this.nextPickFlag) {
            for (let i = 0; i < 3; i++) {
              let refEl = this.$refs["pick" + i];
              console.log(this.$refs);
              if (refEl.min == "00" && refEl.sec == "00") {
                this.selPick = i;
                break;
              }
            }
            this.nextPickFlag = false;
          }
        }, 50);
      } else if (data.code == 5) {
        //别人挖矿
        console.log("别人挖矿");
        this.upDateMapData(data.x, data.y, data.md5, data.demNum);
      } else if (data.code == 6) {
        //有人炸矿
        this.shake();
      } else if (data.code == 403 || data.code == 406) {
        //账号验证错误
        if (data.code == 403) {
          sessionStorage.removeItem("token");
          localStorage.removeItem("token");
        }
        this.$alert(data.msg, "提示", {
          confirmButtonText: "确定",
          showClose: false,
          callback: action => {
            this.$router.push({ path: "/" });
          }
        });
      }
    });
    this.socket.on("connect", () => {
      if (this.loading) {
        hideLoading();
        this.loading = false;
      }
      this.$message({
        message: "已连接服务器！",
        type: "success",
        showClose: true
      });
      let parmas = {
        type: "get",
        token: this.token
      };
      this.socket.emit("demining", parmas);
    });
    this.socket.on("disconnect", () => {
      if (!this.backFlag) {
        this.$message.error("服务器连接已断开！");
      }
    });
  },
  filters: {
    capitalize (value) {
      var date = new Date(parseInt(value * 1000));
      var tt =
        [
          date.getFullYear(),
          date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1,
          date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
        ].join("-") +
        "  " +
        [
          date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
          date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
          date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
        ].join(":");
      return tt;
    }
  },
  methods: {
    openInfo (md5) {
      this.userMd5 = md5
      this.userInfoDialogOpen = true
    },
    updateVisible (open) {
      this.userInfoDialogOpen = open
    },
    mysteriousFragmentShopBuy (itemId) {
      this.$confirm("真的要兑换吗？", "确认", {
        lockScroll: false,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            token: this.token,
            itemId: itemId
          };
          authApi.mysteriousFragmentShop(params).then(res => {
            console.log(res);
            if (res.data.code == 0) {
              this.$message.error(res.data.msg);
            } else if (res.data.code == 1) {
              if (res.data.item) {
                this.myItem = res.data.item;
                this.$forceUpdate();
              }
            }
          });
        })
        .catch(() => { });
    },
    searchuseritem () {
      let params = {
        token: this.token
      };
      authApi.searchuseritem(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          if (res.data.data) {
            this.myItem = res.data.data;
            this.$forceUpdate();
          }
        }
      });
    },
    openMysteriousFragmentShopDialog () {
      this.searchuseritem();
      this.mysteriousFragmentShopDialog = true;
    },
    shake () {
      if (!this.shakeCss) {
        this.shakeCss = true;
        this.shakeTimer = setTimeout(() => {
          this.shakeCss = false;
        }, 400);
      }
    },
    userPageChange (p) {
      this.page = p;
      this.searchUser();
    },
    openUserInfo () {
      this.searchUser();
      this.userDialog = true;
    },
    searchUser () {
      this.openTime = new Date().getTime();
      let parmas = {
        type: "searchPlayer",
        page: this.page,
        token: this.token,
        time: this.openTime
      };
      showLoading();
      this.loading = true;
      this.socket.emit("demining", parmas);
    },
    captchaDigShow (v) {
      this.captchaShow = v;
    },
    sendCaptcha (captcha) {
      const params = {
        token: this.token,
        captcha: captcha
      };
      authApi.robotcheck(params).then(res => {
        console.log(res.data);
        this.$refs.captch.captchaUpdata();
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.captchaShow = false;
          this.openNode(
            this.openCache.x,
            this.openCache.y,
            this.openCache.num,
            true
          );
          if (res.data.getStar > 0) {
            this.$notify({
              type: "success",
              title: "恭喜",
              message: "通过验证，获得" + res.data.getStar + "个神秘碎片！",
              duration: 13000
            });
            this.$refs.userTop.getUserInfo();
          } else {
            this.$notify({
              type: "success",
              title: "恭喜",
              message: res.data.msg,
              duration: 13000
            });
          }
        }
      });
    },
    upDateMapData (x, y, md5, num) {
      console.log("更新");
      this.mineMap[y][x] = {
        md5: md5,
        num: num
      };
      this.$forceUpdate();
    },
    selPickChange (n) {
      this.selPick = n;
    },
    deminingItemClass (num, indexs, index) {
      var c = "";
      var x_y = indexs + "_" + index;
      if (num >= 0) {
        c = "type_is_opened";
        if (num == 9) {
          c = c + " is_wmdmstar";
        }
      } else {
        if (this.selBlock.indexOf(x_y) !== -1) {
          c = "selected";
        }
      }
      return c;
    },
    openNode (x, y, num, openNow) {
      if (this.loading) {
        return false;
      }
      if (num >= 0) {
        return false;
      }
      this.openCache = {
        x: x,
        y: y,
        num: num
      };
      let x_y = x + "_" + y;
      this.openTime = new Date().getTime();
      if (this.selBlockCenter === x_y || openNow) {
        let parmas = {
          type: "open",
          creatTime: this.mineInfo.data.creatTime,
          x: x,
          y: y,
          token: this.token,
          tool: this.selPick,
          time: this.openTime
        };
        showLoading();
        this.loading = true;
        this.nextPickFlag = this.selPick < 3;
        this.socket.emit("demining", parmas);
        this.selBlock = [];
        this.selBlockCenter = null;
      } else {
        if (this.selPick === 5) {
          const maxCol = this.mineInfo.data.cols - 1;
          const maxRow = this.mineInfo.data.rows - 1;
          const selBlockGroup = [
            (x - 1 >= 0 ? x - 1 : maxRow) + "_" + (y - 1 >= 0 ? y - 1 : maxCol),
            x + "_" + (y - 1 >= 0 ? y - 1 : maxCol),
            (x + 1 <= maxRow ? x + 1 : 0) + "_" + (y - 1 >= 0 ? y - 1 : maxCol),
            (x - 1 >= 0 ? x - 1 : maxRow) + "_" + y,
            x + "_" + y,
            (x + 1 <= maxRow ? x + 1 : 0) + "_" + y,
            (x - 1 >= 0 ? x - 1 : maxRow) + "_" + (y + 1 <= maxCol ? y + 1 : 0),
            x + "_" + (y + 1 <= maxCol ? y + 1 : 0),
            (x + 1 <= maxRow ? x + 1 : 0) + "_" + (y + 1 <= maxCol ? y + 1 : 0)
          ];
          this.selBlock = [];
          setTimeout(() => {
            this.selBlock = selBlockGroup;
          }, 40);
          this.selBlockCenter = x_y;
        } else {
          this.selBlock = [x_y];
          this.selBlockCenter = x_y;
        }
      }
    },
    creatMapInitData (i, j) {
      this.mineMap[i][j] = {
        md5: null,
        num: -1
      };
    },
    creatMap (data) {
      this.mineMap = [];
      for (let i = 0; i < data.rows; i++) {
        this.mineMap[i] = [];
        for (let j = 0; j < data.cols; j++) {
          if (data.player) {
            let playerData = data.player[i + "_" + j];
            if (playerData) {
              this.mineMap[i][j] = playerData;
            } else {
              this.creatMapInitData(i, j);
            }
          } else {
            this.creatMapInitData(i, j);
          }
        }
      }
      this.$forceUpdate();
      console.log(this.mineMap);
    }
  },
  beforeDestroy () {
    this.backFlag = true;
    this.socket.close();
    clearTimeout(this.shakeTimer);
  }
};
</script>

<style scoped>
.common_title_tips.type_demining {
  padding-bottom: 5px;
  margin-top: -10px;
}
.wm_demining_hight_item_list_body {
  width: 150px;
}
.wm_demining_hight_item_list_img {
  margin: 2px;
}
.wm_demin_tool_hooper_item_body {
  width: 216px;
  margin: 0 auto;
}
.wm_dem_ueser_item {
  margin-bottom: 4px;
  border-bottom: 1px solid #ccc;
  padding: 5px 0 5px 55px;
  position: relative;
  z-index: 1;
  min-height: 50px;
  line-height: 16px;
  font-size: 12px;
}
.wm_dem_ueser_item .wm_card_get_list_avatar_pic {
  border-radius: 4px;
}
.wm_dem_ueser_img {
  position: absolute;
  left: 0;
  top: 6px;
  z-index: 1;
  background-color: #ccc;
}
.shake-hard {
  animation-name: shake-hard;
  animation-duration: 300ms;
  animation-iteration-count: 1;
  animation-timing-function: ease-in-out;
  animation-delay: 0s;
}
.wm_demining_mf_list {
  border-bottom: 1px solid #ccc;
  padding-bottom: 4px;
  padding-left: 40px;
  padding-right: 54px;
  margin-bottom: 4px;
  line-height: 16px;
  font-size: 12px;
  position: relative;
  z-index: 1;
}
.wm_demining_mf_icon {
  top: 6px;
  left: 0px;
  position: absolute;
  z-index: 1;
}
.wm_demining_mf_btn {
  top: 10px;
  right: 0px;
  position: absolute;
  z-index: 1;
}
.wm_demining_mf_count {
  position: absolute;
  top: 52px;
  left: 0;
  width: 100%;
  z-index: 1;
}
@keyframes shake-hard {
  0% {
    transform: translate(0px, 0px) rotate(0deg);
  }
  2% {
    transform: translate(-4px, -9px) rotate(-0.5deg);
  }
  4% {
    transform: translate(-1px, -9px) rotate(-1.5deg);
  }
  6% {
    transform: translate(6px, -1px) rotate(-2.5deg);
  }
  8% {
    transform: translate(5px, 8px) rotate(-0.5deg);
  }
  10% {
    transform: translate(9px, 0px) rotate(2.5deg);
  }
  12% {
    transform: translate(5px, -7px) rotate(-0.5deg);
  }
  14% {
    transform: translate(0px, -1px) rotate(-2.5deg);
  }
  16% {
    transform: translate(-6px, 2px) rotate(-1.5deg);
  }
  18% {
    transform: translate(-5px, 7px) rotate(2.5deg);
  }
  20% {
    transform: translate(-8px, 7px) rotate(-1.5deg);
  }
  22% {
    transform: translate(-9px, 7px) rotate(0.5deg);
  }
  24% {
    transform: translate(-3px, -9px) rotate(3.5deg);
  }
  26% {
    transform: translate(-7px, 8px) rotate(3.5deg);
  }
  28% {
    transform: translate(1px, -2px) rotate(3.5deg);
  }
  30% {
    transform: translate(4px, -2px) rotate(-1.5deg);
  }
  32% {
    transform: translate(7px, -8px) rotate(-1.5deg);
  }
  34% {
    transform: translate(2px, 10px) rotate(-0.5deg);
  }
  36% {
    transform: translate(-1px, 4px) rotate(2.5deg);
  }
  38% {
    transform: translate(-6px, 7px) rotate(3.5deg);
  }
  40% {
    transform: translate(6px, -9px) rotate(3.5deg);
  }
  42% {
    transform: translate(-6px, 10px) rotate(2.5deg);
  }
  44% {
    transform: translate(3px, -5px) rotate(0.5deg);
  }
  46% {
    transform: translate(10px, 0px) rotate(-0.5deg);
  }
  48% {
    transform: translate(9px, -8px) rotate(0.5deg);
  }
  50% {
    transform: translate(9px, -7px) rotate(3.5deg);
  }
  52% {
    transform: translate(4px, 4px) rotate(1.5deg);
  }
  54% {
    transform: translate(-1px, 10px) rotate(0.5deg);
  }
  56% {
    transform: translate(-4px, 3px) rotate(2.5deg);
  }
  58% {
    transform: translate(-3px, 4px) rotate(3.5deg);
  }
  60% {
    transform: translate(-5px, 8px) rotate(2.5deg);
  }
  62% {
    transform: translate(5px, -2px) rotate(3.5deg);
  }
  64% {
    transform: translate(-6px, 8px) rotate(3.5deg);
  }
  66% {
    transform: translate(-2px, 1px) rotate(-2.5deg);
  }
  68% {
    transform: translate(-1px, 0px) rotate(-2.5deg);
  }
  70% {
    transform: translate(3px, -5px) rotate(-2.5deg);
  }
  72% {
    transform: translate(6px, 0px) rotate(-2.5deg);
  }
  74% {
    transform: translate(1px, 7px) rotate(-0.5deg);
  }
  76% {
    transform: translate(2px, -8px) rotate(2.5deg);
  }
  78% {
    transform: translate(6px, 10px) rotate(1.5deg);
  }
  80% {
    transform: translate(4px, 7px) rotate(2.5deg);
  }
  82% {
    transform: translate(-2px, -7px) rotate(1.5deg);
  }
  84% {
    transform: translate(4px, -6px) rotate(-2.5deg);
  }
  86% {
    transform: translate(-5px, -3px) rotate(3.5deg);
  }
  88% {
    transform: translate(8px, -4px) rotate(-1.5deg);
  }
  90% {
    transform: translate(7px, -2px) rotate(-0.5deg);
  }
  92% {
    transform: translate(-4px, 5px) rotate(3.5deg);
  }
  94% {
    transform: translate(-1px, -9px) rotate(2.5deg);
  }
  96% {
    transform: translate(8px, -5px) rotate(3.5deg);
  }
  98% {
    transform: translate(-4px, 8px) rotate(2.5deg);
  }
}
</style>
<style>
.wm_card_demining_tool_body .wm_demin_tool_hooper {
  height: 100%;
}
.wm_demin_tool_hooper .hooper-next,
.wm_demin_tool_hooper .hooper-prev {
  padding: 0px;
}
.hooper-liveregion {
  display: none;
}
.wm_open_coin_dialog_btn.el-button {
  padding: 0;
}
.wm_demining_mf_btn .el-button--mini {
  padding: 5px 10px;
}
</style>
