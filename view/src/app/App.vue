<template>
  <div id="app">
    <router-view @l2dMassage="l2dMassage"></router-view>
    <live2d ref="l2d"></live2d>
    <div class="wm_bg_1"
         :style="{ 'background-position': 'center ' + scrollTop / 10 + 'px' }"></div>
    <div class="wm_bg_2"
         :style="{ 'background-position': 'center ' + scrollTop / 4 + 'px' }"></div>
    <footer class="tc powerdby">
      <div><span v-html="info"></span> {{ version }}</div>
    </footer>
    <!-- 在线用户开始 -->
    <el-dialog title="在线用户"
               @open="userDialogOpen"
               :visible.sync="userDialog"
               :lock-scroll="false"
               :append-to-body="true"
               class="reg_code_dialog"
               width="100%">
      <div class="wm_menu_news_body">
        <div v-if="userList.length <= 0"
             class="pt15 pb15 tc">暂无在线用户</div>
        <div v-else>
          <div v-for="(item, index) in userList"
               :key="index"
               class="wm_sys_ueser_item wm_set_pointer"
               @click="openInfo(item.md5)">
            <div class="wm_sys_ueser_img">
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
    <userInfoDialog :md5="userMd5"
                    :userDialogOpen="userInfoDialogOpen"
                    @updateVisible="updateVisible"></userInfoDialog>
  </div>
</template>

<script>
import live2d from "./components/live2d.vue";
import io from "socket.io-client";
import userInfoDialog from "./components/userInfoDialog.vue"

export default {
  data () {
    return {
      userMd5: "",
      userInfoDialogOpen: false,
      userTotal: 0,
      userPage: 1,
      userList: [],
      userDialog: false,
      checkTimeTimer: null,
      serverTime: 0,
      timeDelayList: [],
      sendTime: 0,
      endTime: 0,
      checkCount: 0,
      socket: null,
      scrollTop: 0,
      scrollChangeFlag: true,
      version: "(Ver.2.12.0)",
      info: atob(
        "UG93ZXJlZCBieSA8YSBjbGFzcz0nd21fc2V0X3BvaW50ZXInIGhyZWY9J2h0dHBzOi8vd3d3Lndpa2ltb2UuY29tLycgdGFyZ2V0PSdfYmxhbmsnPndpa2ltb2U8L2E+"
      )
    };
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
  computed: {
    token () { return this.$store.getters["app/token"] },
    showOnlieUserDialog () { return this.$store.getters["app/showOnlieUserDialog"] },
  },
  watch: {
    token () {
      this.initWsSystem();
    },
    showOnlieUserDialog (v) {
      if (this.userDialog !== v) {
        this.userDialog = v;
      }
    },
    userDialog (v) {
      if (this.showOnlieUserDialog !== v) {
        this.$store.dispatch('app/setShowOnlieUserDialog', v)
      }
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
    getOnlieUser () {
      this.socket.emit("searchUser", { page: this.userPage });
    },
    userDialogOpen () {
      this.userPage = 1;
      this.getOnlieUser()
    },
    userPageChange (p) {
      this.userPage = p;
      this.getOnlieUser()
    },
    average (arr) { return arr.reduce((acc, val) => acc + val, 0) },
    setDelay () {
      if (this.checkTimeTimer) {
        clearTimeout(this.checkTimeTimer)
        this.checkTimeTimer = null
      }
      this.timeDelayList = this.timeDelayList.filter((item) => {
        return item <= 175;
      })
      if (this.timeDelayList.length === 0) {
        this.$store.dispatch('app/setServerTimeCheckStatus', 0)
        // 如果检测服务器时间失败的话5秒后再次执行服务器时间校准
        setTimeout(() => {
          this.checkTime()
        }, 5000)
      } else {
        const delay = (this.serverTime - (this.endTime - Math.floor(this.average(this.timeDelayList))));
        this.$store.dispatch('app/setServerDelay', delay)
        this.$store.dispatch('app/setServerTimeCheckStatus', 1)
        this.checkTimeTimer = setTimeout(() => {
          this.checkTime()
        }, 600000)
        this.timeDelayList = [];
      }
    },
    checkTime () {
      if (this.socket) {
        this.$store.dispatch('app/setServerTimeCheckStatus', 2)
        this.sendTime = new Date().getTime();
        this.socket.emit("checkTime");
      }
    },
    initWsSystem () {
      if (this.token && !this.socket) {
        this.socket = io.connect("/wssystem?dt=" + this.token);
        this.socket.on("connect", () => {
          this.$store.dispatch('app/setServerTimeCheckStatus', 2)
          this.checkTime();
        })
        this.socket.on("searchUserRes", data => {
          // 查询用户
          this.userList = data.pageUser;
          this.userTotal = data.userTotal;
          if (this.page > 1 && this.userList.length === 0) {
            this.userPage = 1;
            this.getOnlieUser()
          }
        });
        this.socket.on("userCount", data => {
          this.$store.dispatch('app/setGameOnlineUser', data.userCount)
        });
        this.socket.on("getTime", (data) => {
          this.timeDelayList.push((new Date().getTime() - this.sendTime) / 2);
          if (this.checkCount < 5) {
            this.checkCount++
            setTimeout(() => {
              this.checkTime()
            }, 1000)
          } else {
            // 校对完5次时间
            this.endTime = new Date().getTime()
            this.serverTime = data;
            this.setDelay();
            this.checkCount = 0;
          }
        })
      } else if (!this.token) {
        if (this.socket) {
          this.socket.close();
          this.socket = null;
        }
      }
    },
    l2dMassage (text) {
      this.$refs.l2d.showMessage(text);
    },
    bgChange () {
      if (this.scrollChangeFlag) {
        console.log("change");
        this.scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop;
        this.scrollChangeFlag = false;
        setTimeout(() => {
          this.scrollChangeFlag = true;
        }, 100);
      }
    }
  },
  mounted () {
    document.title = window.$siteConfig.browserTitle;
    window.addEventListener("scroll", this.bgChange);
    this.initWsSystem();
    this.userDialog = this.showOnlieUserDialog
  },
  components: {
    live2d,
    userInfoDialog
  }
};
</script>

<style scoped>
.wm_sys_ueser_item {
  margin-bottom: 4px;
  border-bottom: 1px solid #ccc;
  padding: 5px 0 5px 55px;
  position: relative;
  z-index: 1;
  min-height: 50px;
  line-height: 16px;
  font-size: 12px;
}
.wm_sys_ueser_item .wm_card_get_list_avatar_pic {
  border-radius: 4px;
}
.wm_sys_ueser_img {
  position: absolute;
  left: 0;
  top: 6px;
  z-index: 1;
  background-color: #ccc;
}
</style>
