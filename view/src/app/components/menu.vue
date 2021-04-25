<template>
  <div>
    <div class="wm_card_menu_body">
      <div class="wm_card_menu_box"
           @click="goHome()"
           v-if="$route.path!='/'"
           @mouseenter="$wikimoecard.l2dMassage('回到首页')"
           @mouseleave="$wikimoecard.l2dMassageClose">
        <div class="wm_card_menu_ico">
          <img src="../../assets/images/menu/home.jpg"
               width="100%"
               height="100%" />
        </div>
        <div class="wm_card_menu_text">首页</div>
      </div>
      <div class="wm_card_menu_box"
           @click="goCouse()"
           @mouseenter="$wikimoecard.l2dMassage('查看游戏教程，推荐新手玩家必读！')"
           @mouseleave="$wikimoecard.l2dMassageClose">
        <div class="wm_card_menu_ico">
          <img src="../../assets/images/menu/course.png"
               width="100%"
               height="100%" />
        </div>
        <div class="wm_card_menu_text">教程</div>
      </div>
      <router-link tag="div"
                   to="/reg"
                   class="wm_card_menu_box"
                   v-if="$route.path!='/reg' && !token">
        <div class="wm_card_menu_ico"
             @mouseenter="$wikimoecard.l2dMassage('注册了账号才能抽卡哦！')"
             @mouseleave="$wikimoecard.l2dMassageClose">
          <img src="../../assets/images/menu/reg.png"
               width="100%"
               height="100%" />
        </div>
        <div class="wm_card_menu_text">注册</div>
      </router-link>
      <div class="wm_card_menu_box"
           @click="login('/')"
           v-if="!token"
           @mouseenter="$wikimoecard.l2dMassage('登录账号才能游戏哦！')"
           @mouseleave="$wikimoecard.l2dMassageClose">
        <div class="wm_card_menu_ico">
          <img src="../../assets/images/menu/login.png"
               width="100%"
               height="100%" />
        </div>
        <div class="wm_card_menu_text">登录</div>
      </div>
      <div class="wm_card_menu_box"
           @click="login('/dailygetitem')"
           v-if="$route.path!='/dailygetitem' && token"
           @mouseenter="$wikimoecard.l2dMassage('每日签到可以获得丰厚的奖励喔！')"
           @mouseleave="$wikimoecard.l2dMassageClose">
        <el-badge :is-dot="dailygeted?false:true">
          <div class="wm_card_menu_ico">
            <img src="../../assets/images/menu/qiandao.png"
                 width="100%"
                 height="100%" />
          </div>
          <div class="wm_card_menu_text">签到</div>
        </el-badge>
      </div>
      <div class="wm_card_menu_box"
           @click="login('/demining')"
           v-if="$route.path!='/demining'"
           @mouseenter="$wikimoecard.l2dMassage('矿场可以挖到商店抽卡用到的星星和升级卡牌所需要的材料哦！')"
           @mouseleave="$wikimoecard.l2dMassageClose">
        <div class="wm_card_menu_ico">
          <img src="../../assets/images/menu/kuangchang.jpg"
               width="100%"
               height="100%" />
        </div>
        <div class="wm_card_menu_text">矿场</div>
      </div>
      <div class="wm_card_menu_box"
           @click="login('/star/guesscard')"
           v-if="$route.path.indexOf('/star/guessCard')==-1"
           @mouseenter="$wikimoecard.l2dMassage('通过猜卡获得丰厚的奖励吧！')"
           @mouseleave="$wikimoecard.l2dMassageClose">
        <div class="wm_card_menu_ico">
          <img src="../../assets/images/menu/guesscard.png"
               width="100%"
               height="100%" />
        </div>
        <div class="wm_card_menu_text">猜卡</div>
      </div>
      <div class="wm_card_menu_box"
           @click="login('/battle')"
           v-if="$route.path!='/battle'"
           @mouseenter="$wikimoecard.l2dMassage('通过对战来增加每日抽卡的机会吧！')"
           @mouseleave="$wikimoecard.l2dMassageClose">
        <div class="wm_card_menu_ico">
          <img src="../../assets/images/menu/battle.png"
               width="100%"
               height="100%" />
        </div>
        <div class="wm_card_menu_text">对战</div>
      </div>
      <div class="wm_card_menu_box"
           @click="login('/quest')"
           v-if="$route.path.indexOf('/quest')==-1"
           @mouseenter="$wikimoecard.l2dMassage('可以通过完成任务获得丰厚奖励哦！')"
           @mouseleave="$wikimoecard.l2dMassageClose">
        <div class="wm_card_menu_ico">
          <img src="../../assets/images/menu/quest.png"
               width="100%"
               height="100%" />
        </div>
        <div class="wm_card_menu_text">任务</div>
      </div>
      <div class="wm_card_menu_box"
           @click="login('/star/shop')"
           v-if="$route.path!='/star/shop'"
           @mouseenter="$wikimoecard.l2dMassage('商店可以增加额外的抽卡机会，推荐新手玩家务必来逛逛！')"
           @mouseleave="$wikimoecard.l2dMassageClose">
        <div class="wm_card_menu_ico">
          <img src="../../assets/images/menu/shop.png"
               width="100%"
               height="100%" />
        </div>
        <div class="wm_card_menu_text">商店</div>
      </div>
      <div class="wm_card_menu_box"
           @click="login('/star/market')"
           v-if="$route.path.indexOf('/star/market')==-1"
           @mouseenter="$wikimoecard.l2dMassage('市场可以自由买卖卡牌哦！')"
           @mouseleave="$wikimoecard.l2dMassageClose">
        <div class="wm_card_menu_ico">
          <img src="../../assets/images/menu/market.png"
               width="100%"
               height="100%" />
        </div>
        <div class="wm_card_menu_text">市场</div>
      </div>
      <div class="wm_card_menu_box"
           @click="login('/decompose')"
           v-if="$route.path.indexOf('/decompose')==-1"
           @mouseenter="$wikimoecard.l2dMassage('可以分解各种不需要的卡牌和道具！')"
           @mouseleave="$wikimoecard.l2dMassageClose">
        <div class="wm_card_menu_ico">
          <img src="../../assets/images/menu/decompose.png"
               width="100%"
               height="100%" />
        </div>
        <div class="wm_card_menu_text">分解</div>
      </div>
      <div class="wm_card_menu_box"
           @click="openNews"
           @mouseenter="$wikimoecard.l2dMassage('可以查看游戏内的公告！')"
           @mouseleave="$wikimoecard.l2dMassageClose">
        <div class="wm_card_menu_ico">
          <img src="../../assets/images/menu/news.png"
               width="100%"
               height="100%" />
        </div>
        <div class="wm_card_menu_text">公告</div>
      </div>
      <div class="wm_card_menu_box"
           @click="login('/goen')"
           v-if="$route.path!='/goen'"
           @mouseenter="$wikimoecard.l2dMassage('通过竞技点获得的结缘币可以在这里进行结缘哦！')"
           @mouseleave="$wikimoecard.l2dMassageClose">
        <div class="wm_card_menu_ico">
          <img src="../../assets/images/menu/goen.png"
               width="100%"
               height="100%" />
        </div>
        <div class="wm_card_menu_text">结缘</div>
      </div>
      <div class="wm_card_menu_box"
           @click="postDialog=true"
           v-if="token"
           @mouseenter="$wikimoecard.l2dMassage('快来看看有没有新的邮件吧！说不定会有意外收获哦！')"
           @mouseleave="$wikimoecard.l2dMassageClose">
        <el-badge :hidden="!postTotle"
                  :value="postTotle">
          <div class="wm_card_menu_ico">
            <img src="../../assets/images/menu/post.png"
                 width="100%"
                 height="100%" />
          </div>
        </el-badge>
        <div class="wm_card_menu_text">邮件</div>
      </div>
      <div class="wm_card_menu_box"
           @click="login('/handbook')"
           v-if="$route.path.indexOf('/handbook')==-1"
           @mouseenter="$wikimoecard.l2dMassage('可以查看自己的卡牌收集情况！')"
           @mouseleave="$wikimoecard.l2dMassageClose">
        <div class="wm_card_menu_ico">
          <img src="../../assets/images/menu/handbook.png"
               width="100%"
               height="100%" />
        </div>
        <div class="wm_card_menu_text">图鉴</div>
      </div>
      <div class="wm_card_menu_box"
           v-if="token"
           @click="openOnlineUser"
           @mouseenter="$wikimoecard.l2dMassage('可以查看当前在线玩家！')"
           @mouseleave="$wikimoecard.l2dMassageClose">
        <el-badge :value="gameOnlineUser"
                  :max="99">
          <div class="wm_card_menu_ico">
            <img src="../../assets/images/menu/onlineUser.png"
                 width="100%"
                 height="100%" />
          </div>
        </el-badge>
        <div class="wm_card_menu_text">玩家</div>
      </div>
      <div class="wm_card_menu_box"
           @click="watchMyCard()"
           v-if="token"
           @mouseenter="$wikimoecard.l2dMassage('点击可以查看自己的卡牌信息。')"
           @mouseleave="$wikimoecard.l2dMassageClose">
        <div class="wm_card_menu_ico">
          <img :src="'/api/gravatar.png?md5='+getCardMd5()"
               class="wm_card_menu_ico_my"
               width="100%"
               height="100%" />
        </div>
        <div class="wm_card_menu_text">我的</div>
      </div>
      <div class="wm_card_menu_box"
           @click="login('/creatcard')"
           v-if="$route.path.indexOf('/creatcard')==-1"
           @mouseenter="$wikimoecard.l2dMassage('可以制作属于自己的卡牌哦！')"
           @mouseleave="$wikimoecard.l2dMassageClose">
        <div class="wm_card_menu_ico">
          <img src="../../assets/images/menu/creatcard.png"
               width="100%"
               height="100%" />
        </div>
        <div class="wm_card_menu_text">制卡</div>
      </div>
      <a class="wm_card_menu_box"
         :href="menuLink.QQunURL"
         v-if="menuLink.QQunURL"
         target="_blank"
         @mouseenter="$wikimoecard.l2dMassage('加入官方QQ群，和大佬们一起开心抽卡吧！')"
         @mouseleave="$wikimoecard.l2dMassageClose">
        <div class="wm_card_menu_ico">
          <img src="../../assets/images/menu/qun.png"
               width="100%"
               height="100%" />
        </div>
        <div class="wm_card_menu_text">Q群</div>
      </a>
      <div class="wm_card_menu_box"
           @click="openDonate"
           @mouseenter="$wikimoecard.l2dMassage('呜呜呜，开发者现在穷的没饭吃了，求捐赠！')"
           @mouseleave="$wikimoecard.l2dMassageClose"
           v-if="menuLink.donateImgUrl">
        <div class="wm_card_menu_ico">
          <img src="../../assets/images/menu/zanzhu.png"
               width="100%"
               height="100%" />
        </div>
        <div class="wm_card_menu_text">捐赠</div>
      </div>
    </div>
    <!-- 邮箱礼物开始 -->
    <el-dialog title="我的邮件"
               :visible.sync="postDialog"
               :lock-scroll="false"
               :append-to-body="true"
               class="reg_code_dialog"
               width="100%">
      <div class="wm_menu_news_body">
        <div v-if="postList.length<=0"
             class="pt15 pb15 tc">暂无邮件或没登陆账号</div>
        <el-collapse accordion
                     v-else>
          <el-collapse-item :title="item.title"
                            :name="index"
                            v-for="(item,index) in postList"
                            v-bind:key="item._id">
            <div class="wm_post_content_body">
              <div class="wm_menu_news_text">{{item.text}}</div>
            </div>
            <div class="mt5 mb5 fb">礼物：</div>
            <div class="wm_post_gift_body"
                 v-if="item.type==='card'">
              <img :src="$wikimoecard.url+item.packageId+'/'+item.itemId+'.jpg'"
                   width="200px" />
              <div>×{{item.itemNumber}}</div>
              <el-button size="mini"
                         type="primary"
                         @click="getPostItem(item._id)">领取</el-button>
            </div>
            <div class="wm_post_gift_body"
                 v-else-if="item.type==='item'">
              <img :src="'/static/otherImg/item/'+item.itemId+'.png'"
                   height="32px"
                   width="32px" />
              <div>{{itemData_[item.itemId].name}} × {{item.itemNumber}}</div>
              <el-button size="mini"
                         type="primary"
                         @click="getPostItem(item._id)">领取</el-button>
            </div>
            <div class="wm_post_gift_body"
                 v-else-if="item.type==='star'">
              <img src="/static/otherImg/item/star.png"
                   height="32px"
                   width="32px" />
              <div>星星 × {{item.itemNumber}}</div>
              <el-button size="mini"
                         type="primary"
                         @click="getPostItem(item._id)">领取</el-button>
            </div>
            <div class="mt10">
              <div class="wm_menu_news_time">发布时间：{{item.time*1000 | capitalize}}</div>
              <div class="wm_menu_news_time">过期时间：{{item.endTime*1000 | capitalize}}</div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-pagination small
                       layout="prev, pager, next"
                       :total="postTotle"
                       @current-change="postPageChange"
                       :current-page="postPage"
                       :page-size="20"
                       class="wm_menu_news_page">
        </el-pagination>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="postDialog=false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 邮箱礼物结束 -->
    <el-dialog title="新闻公告"
               :visible.sync="newsDialog"
               :lock-scroll="false"
               :append-to-body="true"
               class="reg_code_dialog"
               width="100%">
      <div class="wm_menu_news_body"
           v-if="newsList">
        <el-collapse accordion>
          <el-collapse-item :title="item.title"
                            :name="index"
                            v-for="(item,index) in newsList"
                            v-bind:key="index">
            <div class="wm_menu_news_time">发布于：{{item.time | capitalize}}</div>
            <div class="wm_menu_news_text">{{item.text}}</div>
          </el-collapse-item>
        </el-collapse>
        <el-pagination small
                       layout="prev, pager, next"
                       :total="totle"
                       @current-change="pageChange"
                       :current-page.sync="page"
                       :page-size="20"
                       class="wm_menu_news_page">
        </el-pagination>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="newsDialog=false">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="请登录"
               :before-close="cancelLoginShow"
               :visible.sync="loginShow"
               :append-to-body="true"
               :close-on-click-modal="false"
               class="reg_code_dialog"
               width="100%">
      <el-form ref="form"
               :model="form"
               label-width="80px"
               @keyup.enter.native="goLogin()">
        <el-form-item label="账号">
          <el-input v-model="form.email"
                    @input="emailToLowerCase"
                    placeholder="请输入邮箱地址"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"
                    show-password
                    placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="验证码">
          <el-input placeholder="请输入计算结果"
                    v-model="form.captcha"
                    type="tel">
            <template slot="append"><img class="reg_code_img"
                   :src="captchaSrc"
                   @click="captchaUpdata"></template>
          </el-input>
        </el-form-item>
        <el-form-item label="保持登录">
          <el-switch v-model="form.remPass"></el-switch>
          <router-link class="wm_find_ps_link"
                       to="/find">找回密码</router-link>
          <router-link class="wm_find_ps_link mr5"
                       to="/reg">注册</router-link>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="cancelLoginShow()">取消</el-button>
        <el-button @click="goLogin()"
                   type="primary">登录</el-button>
      </span>
    </el-dialog>
    <userInfoDialog v-if="token"
                    :md5="getCardMd5()"
                    :userDialogOpen="userInfoDialogOpen"
                    @updateVisible="updateVisible"></userInfoDialog>
  </div>
</template>

<script>
import { authApi } from "../api";
import { mailCheck, passwordCheck } from "../../utils/utils";
import md5_ from 'js-md5';
import itemData from '../../../../server/data/item';
import { mapState, mapActions, mapMutations } from "vuex"
import userInfoDialog from "../components/userInfoDialog.vue"

export default {
  props: {
    getInfoMode: {
      type: Boolean,
      default: true
    },
  },
  data () {
    return {
      userInfoDialogOpen: false,
      menuLink: {
        courseURL: window.$siteConfig.courseURL,
        QQunURL: window.$siteConfig.QQunURL,
        donateImgUrl: window.$siteConfig.donateImgUrl,
      },
      txDays: new Date().getDate(),
      captchaSrc: '/api/captcha?time=' + new Date().getTime(),
      routPath: null,
      loginShow: false,
      newsDialog: false,
      newsList: null,
      page: 1,
      totle: 0,
      postDialog: false,
      itemData_: itemData,
      form: {
        email: '',
        password: '',
        captcha: '',
        remPass: false
      }
    }
  },
  mounted () {
    this.getRememberEmail();
    if (this.getInfoMode) {
      this.getPost();
      this.dailygetedSearch();
    }
  },
  components: {
    userInfoDialog
  },
  computed: {
    ...mapState(
      "app",
      ["dailygeted", "postList", "postTotle", "postPage", "gameOnlineUser", "token"]
    ),
  },
  filters: {
    capitalize: function (value) {
      var date = new Date(parseInt(value));
      var tt = [date.getFullYear(), ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1), (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())].join('-') + '  ' + [(date.getHours() < 10 ? '0' + date.getHours() : date.getHours()), (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()), (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())].join(':');
      return tt;
    }
  },
  methods: {
    ...mapMutations(
      "app",
      {
        setDailygeted: "setDailygeted",
        setPostList: "setPostList",
        setPostTotle: "setPostTotle",
        setPostPage: "setPostPage"
      }
    ),
    updateVisible (open) {
      this.userInfoDialogOpen = open
    },
    openOnlineUser () {
      this.$store.dispatch('app/setShowOnlieUserDialog', true)
    },
    dailygetedSearch () {
      // 是否由Token
      if (!this.token) {
        console.log("无Token,当前无需查询每日任务！");
        return false;
      }
      // 查询是否需要查询每日任务已领取
      let nextTime = 0;
      const timeNow = new Date().getTime();
      let userMD5 = this.getCardMd5();
      let storageDailyDate = localStorage.getItem(userMD5 + 'dailygeted');
      if (storageDailyDate) {
        nextTime = Number(storageDailyDate);
      }
      if (nextTime > timeNow) {
        console.log("当前无需查询每日任务！");
        return false;
      }
      const params = {
        token: this.token,
      }
      authApi.dailygetitemmenu(params).then(res => {
        console.log(res);
        if (res.data.code == 1) {
          this.setDailygeted(res.data.geted);
          if (this.dailygeted) {
            // 写入缓存
            // this.token.split('.')
            localStorage.setItem(userMD5 + 'dailygeted', res.data.nextTime);
          }
        }
      });
    },
    getPostItem (id) {
      const params = {
        token: this.token,
        id: id,
        type: 'get'
      }
      authApi.userpost(params).then(res => {
        console.log(res);
        if (res.data.code == 1) {
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
          try {
            this.$parent.$refs.userTop.getUserInfo();
          } catch (e) { }
          this.getPost();
        } else {
          this.getPost();
          this.$message.error(res.data.msg);
        }
      });
    },
    getPost () {
      const params = {
        token: this.token,
        page: this.postPage,
        type: 'search'
      }
      authApi.userpost(params).then(res => {
        console.log(res);
        if (res.data.code == 1) {
          this.setPostList(res.data.data);
          this.setPostTotle(res.data.totle);
          if (this.postList.length <= 0 && this.postPage > 1) {
            this.setPostPage(1);
            this.getPost();
          }
        } else {
        }
      });
    },
    goCouse () {
      window.open(this.menuLink.courseURL || 'https://gitee.com/eeg1412/wikimoe-card-player-tutorial/blob/master/README.md', '_blank');
    },
    getCardMd5 () {
      let md5 = '';
      try {
        let tokenUserInfo = this.token.split('.')[1];
        let email = JSON.parse(atob(tokenUserInfo)).email;
        md5 = md5_(email);
      }
      catch (err) {
        md5 = '';
      }
      return md5;
    },
    openNews () {
      this.page = 1;
      this.newsDialog = true;
      this.getNews();
    },
    pageChange (p) {
      this.page = p;
      this.getNews();
    },
    postPageChange (p) {
      this.setPostPage(p);
      this.getPost();
    },
    getNews () {
      let params = {
        page: this.page
      }
      authApi.news(params).then(res => {
        console.log(res);
        if (res.data.code == 1) {
          this.newsList = res.data.data;
          this.totle = res.data.total;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    openDonate () {
      this.$alert('<div class="watch_img"><img src="' + this.menuLink.donateImgUrl + '" /></div>', '捐赠', {
        dangerouslyUseHTMLString: true
      });
    },
    watchMyCard () {
      this.userInfoDialogOpen = true
    },
    goHome () {
      this.$router.push({ path: '/' });
    },
    cancelLoginShow () {
      this.loginShow = false;
      this.routPath = null;
      this.form = {
        email: '',
        password: '',
        captcha: '',
        remPass: false
      }
      this.getRememberEmail();
    },
    goLogin () {
      //检查格式
      if (!mailCheck(this.form.email)) {
        this.$message.error('邮箱格式有误！');
        return false;
      }
      if (this.form.password == '') {
        this.$message.error('请输入密码！');
        return false;
      }
      if (this.form.captcha == '') {
        this.$message.error('请输入计算结果！');
        return false;
      }
      let params = {
        email: this.form.email,
        password: this.form.password,
        captcha: this.form.captcha,
        remPass: Number(this.form.remPass)
      };
      authApi.login(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
          this.captchaUpdata();
        } else if (res.data.code == 1) {
          let resData = res.data;
          if (this.form.remPass) {
            localStorage.setItem("token", resData.token);
          } else {
            sessionStorage.setItem("token", resData.token);
          }
          this.loginShow = false;
          // this.token = resData.token;
          this.$store.dispatch('app/setToken', resData.token)
          this.form.password = "";
          this.form.captcha = "";
          this.$emit('addToken');
          this.goLink();
        }
      })
    },
    getRememberEmail () {
      var storage = window.localStorage;
      if (storage.getItem("wikimoeEmail")) {
        this.form.email = storage.getItem("wikimoeEmail");
      }
    },
    emailToLowerCase () {
      this.form.email = this.form.email.toLowerCase();
    },
    captchaUpdata () {
      this.captchaSrc = '/api/captcha?time=' + new Date().getTime();
    },
    login (p) {
      this.routPath = p;
      let token = this.token;
      if (token) {
        this.goLink();
      } else {
        this.getRememberEmail();
        this.loginShow = true;
        this.captchaSrc = '/api/captcha?time=' + new Date().getTime();
      }
    },
    goLink () {
      console.log(this.routPath);
      if (!this.routPath) {
        return false;
      }
      if (this.routPath === '/') {
        this.getPost();
        this.dailygetedSearch();
      } else {
        this.$router.push({ path: this.routPath });
      }
    }
  }
}
</script>
<style scoped>
.wm_post_gift_body {
  text-align: center;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.wm_post_content_body {
  padding: 15px 0px;
  border-top: 1px dotted #cecece;
}
</style>
<style>
.wm_menu_news_body .el-collapse-item__header.is-active {
  color: #ff5364;
}
</style>
