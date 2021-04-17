<template>
  <div class="wm_card_top_userinfo_body clearfix">
    <div class="fl">
      <img class="wm_top_info_avatar_pic"
           :src="'/api/gravatar.png?md5=' + userData.md5"
           @click="openMore()" />
    </div>
    <div class="fl">
      <div>
        <span>{{ userData.nickName || "获取中" }}</span>
        <span><span class="wm_top_info_star">★</span>{{ userData.star || "0" }}</span>
      </div>
    </div>
    <div class="fr wm_topuserinfo_logout"
         @click="openMenu = true">导航</div>
    <div class="fr"><i class="el-icon-warning-outline"
         v-if="serverTimeCheckStatus === 0"
         key="0"></i><i class="el-icon-loading"
         v-else-if="serverTimeCheckStatus === 2"
         key="2"></i> {{serverTime}}<span class="pl5 pr5">|</span></div>
    <el-dialog :title="userData.nickName + '的信息'"
               :visible.sync="dialogVisible"
               class="reg_code_dialog"
               :append-to-body="true"
               top="8vh"
               width="95%">
      <div class="wm_top_info_more_body"
           v-if="userData.level !== undefined">
        <!-- <i class="el-icon-edit wm_avatar_edit_icon cRed"></i> -->
        <div @click="txDialogVisible = true"
             class="wm_top_moreinfo_avatar_pic_body wm_set_pointer">
          <img class="wm_top_moreinfo_avatar_pic"
               :src="'/api/gravatar.png?md5=' + userData.md5" />
        </div>

        <div class="wm_top_moreinfo_name">{{ userData.nickName }}</div>
        <div class="wm_top_moreinfo_body clearfix">
          <div class="wm_top_moreinfo_box">
            <div class="wm_top_moreinfo_label">星星：{{ userData.star }}</div>
          </div>
          <div class="wm_top_moreinfo_box">
            <div class="wm_top_moreinfo_label">等级：{{ userData.level }}</div>
          </div>
          <div class="wm_top_moreinfo_box">
            <div class="wm_top_moreinfo_label">
              经验：{{ userData.exp }}/{{
                cardData.level[userData.level > 5 ? 5 : userData.level]
              }}
            </div>
          </div>
          <div class="wm_top_moreinfo_box">
            <div class="wm_top_moreinfo_label">
              竞技点：{{ userData.score }}
            </div>
          </div>
          <div class="wm_top_moreinfo_box">
            <div class="wm_top_moreinfo_label">
              累计挖矿：{{ userData.deminingStarCount }}
            </div>
          </div>
          <div class="wm_top_moreinfo_box">
            <div class="wm_top_moreinfo_label">
              卡种量：{{ userData.cardIndexCount }}
            </div>
          </div>
          <div class="wm_top_moreinfo_box">
            <div class="wm_top_moreinfo_label">
              猜中卡牌：{{ userData.guessCardCount }}
            </div>
          </div>
          <div class="wm_top_moreinfo_box">
            <div class="wm_top_moreinfo_label">
              完成任务：{{ userData.questCount }}
            </div>
          </div>
          <div class="wm_top_moreinfo_box">
            <div class="wm_top_moreinfo_label">
              成功制卡：{{ userData.UCC }}
            </div>
          </div>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer tc">
        <el-button @click="shareUrl(userData.md5)"
                   type="primary">分享</el-button>
        <el-button @click="logout"
                   type="info">登出</el-button>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改头像"
               :visible.sync="txDialogVisible"
               class="reg_code_dialog wm_edit_tx_dialog"
               :close-on-click-modal="false"
               :append-to-body="true"
               :destroy-on-close="true"
               @opened="txOpened"
               @closed="txClosed"
               width="95%">
      <div class="wm_top_info_more_body">
        <div id="wmCreatTx"
             class="tc"></div>
        <div class="wm_edit_tx_slider_body">
          <el-slider v-model="txZoom"
                     :disabled="!txImageLoaded"
                     @change="zoomChange"
                     :show-tooltip="false"
                     :min="txMin"></el-slider>
        </div>
        <div>
          <el-upload action=""
                     :auto-upload="false"
                     :show-file-list="false"
                     accept="image/*"
                     :on-change="handleAvatarSuccess">
            <el-button size="small"
                       type="primary">{{
              txImageLoaded ? "重新导入" : "点击导入"
            }}</el-button>
          </el-upload>
          <h6 class="mt10">如遇无法导入头像，请检查浏览器是否支持WebGL!</h6>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="saveTx">保存</el-button>
        <el-button @click="txDialogVisible = false">放弃</el-button>
      </span>
    </el-dialog>

    <transition name="el-fade-in-linear">
      <div class="wm_top_moreinfo_menu_mask"
           @click="openMenu = false"
           v-show="openMenu"></div>
    </transition>
    <el-collapse-transition>
      <div class="wm_top_moreinfo_menu_box"
           v-show="openMenu">
        <div class="wm_top_moreinfo_menu_close">
          <i class="el-icon-close"
             @click="openMenu = false"></i>
        </div>
        <menuView :getInfoMode="false"></menuView>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import { authApi } from "../api";
import cardData from "../../utils/cardData";
import menuView from "./menu.vue";
import * as PIXI from "pixi.js";
import moment from "moment"

export default {
  data () {
    return {
      txMin: 0,
      txImageLoaded: false,
      txZoom: 100,
      imageUrl: "",
      app: null,
      txSprite: null,
      txDialogVisible: false,
      txDays: new Date().getDate(),
      userData: {},
      token: sessionStorage.getItem("token")
        ? sessionStorage.getItem("token")
        : localStorage.getItem("token"),
      dialogVisible: false,
      cardData: cardData,
      openMenu: false,
      serverTime: '',
      serverTimeTimer: null,
    };
  },
  components: {
    menuView
  },
  mounted () {
    this.getUserInfo();
    this.setTime();
  },
  computed: {
    serverDelay () { return this.$store.getters["app/serverDelay"] },
    serverTimeCheckStatus () { return this.$store.getters["app/serverTimeCheckStatus"] }
  },
  methods: {
    setTime () {
      const nowDate = new Date().getTime() + this.serverDelay;
      this.serverTime = moment(nowDate).format('HH:mm:ss')
      this.serverTimeTimer = setInterval(() => {
        const nowDateTimer = new Date().getTime() + this.serverDelay;
        this.serverTime = moment(nowDateTimer).format('HH:mm:ss')
      }, 1000)
    },
    shareUrl (md5) {
      this.$copyText(window.location.origin + "?md5=" + md5).then(
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
    saveTx () {
      const uploadBase64 = this.app.view.toDataURL("image/jpeg", 0.9);
      console.log(uploadBase64);
      authApi
        .uploadtx({ token: this.token, imgBase64: uploadBase64 })
        .then(res => {
          console.log(res);
          if (res.data.code == 0) {
            this.$message.error(res.data.msg);
          } else if (res.data.code == 1) {
            this.$alert(res.data.msg, "提示", {
              confirmButtonText: "确定",
              callback: action => {
                this.txDialogVisible = false;
                location.reload();
              }
            });
          }
        });
    },
    zoomChange () {
      this.txSprite.scale = new PIXI.Point(
        this.txZoom / 100,
        this.txZoom / 100
      );
      const x = this.txSprite.x;
      const y = this.txSprite.y;
      const width = this.txSprite.width;
      const height = this.txSprite.height;
      if (x > 0) {
        this.txSprite.x = 0;
      } else if (x < -width + 100) {
        this.txSprite.x = -width + 100;
      }
      if (y > 0) {
        this.txSprite.y = 0;
      } else if (y < -height + 100) {
        this.txSprite.y = -height + 100;
      }
    },
    txClosed () {
      this.app.destroy(true, true);
      this.txMin = 0;
      this.txImageLoaded = false;
      this.txZoom = 100;
      this.imageUrl = "";
      this.app = null;
      this.txSprite = null;
    },
    txOpened () {
      this.drawCard();
    },
    handleAvatarSuccess (file, fileList) {
      this.imageUrl = URL.createObjectURL(file.raw);
      let imageObj = new Image();
      imageObj.src = this.imageUrl;
      imageObj.onload = () => {
        const w = imageObj.width;
        const h = imageObj.height;
        if (w < 100 || h < 100) {
          this.$message.error("头像宽高必须大于100px，请重新选择！");
        } else {
          this.txZoom = 100;
          this.txSprite.texture = PIXI.Texture.from(this.imageUrl, { mipmap: PIXI.MIPMAP_MODES.ON });
          this.txSprite.position.set(0, 0);
          this.txSprite.scale = new PIXI.Point(1, 1);
          this.txSprite.rotation = 0;
          const minW = (100 / w) * 100;
          const minH = (100 / h) * 100;
          this.txMin = Math.ceil(Math.max(minW, minH));
          this.txImageLoaded = true;
        }
      };
    },
    drawCard () {
      let that = this;
      const loader = new PIXI.Loader();
      const app = new PIXI.Application({
        width: 100,
        height: 100,
        backgroundColor: 0xffffff,
        resolution: 1,
        preserveDrawingBuffer: true
      });
      this.app = app;
      const moveIco = "url('/static/cur/move.cur'),move";
      app.renderer.plugins.interaction.cursorStyles.move = moveIco;
      const container = new PIXI.Container();
      container.sortableChildren = true;
      app.stage.addChild(container);
      // Create a new texture
      // 初始化
      // 头像
      let txSprite = new PIXI.Sprite();
      this.txSprite = txSprite;
      this.txSprite.zIndex = 1;
      this.txSprite.interactive = true;
      this.txSprite.buttonMode = true;
      this.txSprite.cursor = "move";
      this.txSprite.anchor.set(0);
      this.txSprite
        .on("pointerdown", onDragStart)
        .on("pointerup", onDragEnd)
        .on("pointerupoutside", onDragEnd)
        .on("pointermove", onDragMove);
      function onDragStart (event) {
        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
        this.data = event.data;
        this.dragging = true;
        this.oldPosition = this.data.getLocalPosition(this.parent);
        this.oldX = this.x;
        this.oldY = this.y;
      }

      function onDragEnd () {
        this.alpha = 1;
        this.dragging = false;
        // set the interaction data to null
        this.data = null;
      }

      function onDragMove (event) {
        // event.defaultprevented;
        if (this.dragging) {
          const newPosition = this.data.getLocalPosition(this.parent);
          this.x = this.oldX - (this.oldPosition.x - newPosition.x);
          this.y = this.oldY - (this.oldPosition.y - newPosition.y);
          if (this.x > 0) {
            this.x = 0;
          } else if (this.x < -txSprite.width + 100) {
            this.x = -txSprite.width + 100;
          }
          if (this.y > 0) {
            this.y = 0;
          } else if (this.y < -txSprite.height + 100) {
            this.y = -txSprite.height + 100;
          }
        }
      }

      container.addChild(this.txSprite);
      app.ticker.maxFPS = 30;
      document.getElementById("wmCreatTx").appendChild(this.app.view);

      app.ticker.add(delta => { });
    },
    logout () {
      authApi.logout({ token: this.token }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.$message({
            message: "成功登出！",
            type: "success"
          });
          this.$store.dispatch('app/setToken', undefined)
          sessionStorage.removeItem("token");
          localStorage.removeItem("token");
          this.$emit("removeToken");
          this.$router.replace("/");
        } else if (res.data.code == 403) {
          this.$emit("removeToken");
        }
      });
    },
    openMore () {
      if (this.userData.md5) {
        this.dialogVisible = true;
      }
    },
    getUserInfo () {
      authApi.userinfo({ token: this.token }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.userData = res.data.data;
        } else if (res.data.code == 403) {
          this.$emit("removeToken");
        }
      });
    }
  },
  beforeDestroy () {
    clearInterval(this.serverTimeTimer)
  }
};
</script>

<style scoped>
.wm_top_moreinfo_menu_close {
  padding: 10px 10px 0px 5px;
  text-align: right;
  line-height: 15px;
}
.wm_top_moreinfo_menu_box {
  position: fixed;
  z-index: 9998;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 100vh;
  overflow-y: auto;
  background-color: #fff;
  box-shadow: 0 0px 5px #c5c5c5;
}
.wm_top_moreinfo_menu_mask {
  background-color: rgba(255, 255, 255, 0.8);
  position: fixed;
  z-index: 9997;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  cursor: url(/static/cur/pointer.cur), pointer;
}
</style>
<style>
.wm_edit_tx_dialog {
  -webkit-touch-callout: none; /*系统默认菜单被禁用*/
  -webkit-user-select: none; /*webkit浏览器*/
  -khtml-user-select: none; /*早期浏览器*/
  -moz-user-select: none; /*火狐*/
  -ms-user-select: none; /*IE10*/
  user-select: none;
}

#wmCreatTx {
  width: 100px;
  height: 100px;
  border: 2px solid #ccc;
  margin-left: auto;
  margin-right: auto;
}
.wm_edit_tx_slider_body {
  width: 100%;
  margin: 0 auto;
  max-width: 200px;
}
.wm_avatar_edit_icon {
  display: none;
}
.wm_top_moreinfo_avatar_pic_body:hover .wm_avatar_edit_icon {
  display: block;
}
.wm_top_moreinfo_avatar_pic_body {
  position: relative;
  width: 50px;
  height: 50px;
  margin: 0 auto;
}
.wm_avatar_edit_icon {
  position: absolute;
  right: 2px;
  bottom: 2px;
  text-shadow: 0 0 2px #ffffff, 0 0 2px #ffffff;
}
</style>
