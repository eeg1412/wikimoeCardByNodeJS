<template>
<div>
  <div class="wm_card_menu_body">
    <div class="wm_card_menu_box" @click="goHome()" v-if="$route.path!='/'" @mouseover="remTips('回到首页')">
      <div class="wm_card_menu_ico">
        <img src="../../assets/images/menu/home.jpg" width="100%" height="100%" />
      </div>
      <div class="wm_card_menu_text">首页</div>
    </div>
    <div class="wm_card_menu_box" @click="goCouse()" @mouseover="remTips('查看游戏教程，推荐新手玩家必读！')">
      <div class="wm_card_menu_ico">
        <img src="../../assets/images/menu/course.png" width="100%" height="100%" />
      </div>
      <div class="wm_card_menu_text">教程</div>
    </div>
    <router-link tag="div" to="/reg" class="wm_card_menu_box" v-if="$route.path!='/reg' && !token">
      <div class="wm_card_menu_ico" @mouseover="remTips('注册了账号才能抽卡哦！')">
        <img src="../../assets/images/menu/reg.png" width="100%" height="100%" />
      </div>
      <div class="wm_card_menu_text">注册</div>
    </router-link>
    <div class="wm_card_menu_box" @click="login('/demining')" v-if="$route.path!='/demining'" @mouseover="remTips('矿场可以挖到商店抽卡用到的星星和升级卡牌所需要的材料哦！')">
      <div class="wm_card_menu_ico">
        <img src="../../assets/images/menu/kuangchang.jpg" width="100%" height="100%" />
      </div>
      <div class="wm_card_menu_text">矿场</div>
    </div>
    <div class="wm_card_menu_box" @click="login('/battle')" v-if="$route.path!='/battle'" @mouseover="remTips('通过对战来增加每日抽卡的机会吧！')">
      <div class="wm_card_menu_ico">
        <img src="../../assets/images/menu/battle.png" width="100%" height="100%" />
      </div>
      <div class="wm_card_menu_text">对战</div>
    </div>
    <div class="wm_card_menu_box" @click="login('/star/shop')" v-if="$route.path!='/star/shop'" @mouseover="remTips('商店可以增加额外的抽卡机会，推荐新手玩家务必来逛逛！')">
      <div class="wm_card_menu_ico">
        <img src="../../assets/images/menu/shop.png" width="100%" height="100%" />
      </div>
      <div class="wm_card_menu_text">商店</div>
    </div>
    <div class="wm_card_menu_box" @click="login('/star/market')" v-if="$route.path.indexOf('/star/market')==-1" @mouseover="remTips('市场可以自由买卖卡牌哦！')">
      <div class="wm_card_menu_ico">
        <img src="../../assets/images/menu/market.png" width="100%" height="100%" />
      </div>
      <div class="wm_card_menu_text">市场</div>
    </div>
    <div class="wm_card_menu_box" @click="login('/decompose')" v-if="$route.path.indexOf('/decompose')==-1" @mouseover="remTips('可以分解各种不需要的卡牌和道具！')">
      <div class="wm_card_menu_ico">
        <img src="../../assets/images/menu/decompose.png" width="100%" height="100%" />
      </div>
      <div class="wm_card_menu_text">分解</div>
    </div>
    <div class="wm_card_menu_box" @click="openNews" @mouseover="remTips('可以查看游戏内的公告！')">
      <div class="wm_card_menu_ico">
        <img src="../../assets/images/menu/news.png" width="100%" height="100%" />
      </div>
      <div class="wm_card_menu_text">公告</div>
    </div>
    <div class="wm_card_menu_box" @click="login('/handbook')" v-if="$route.path.indexOf('/handbook')==-1" @mouseover="remTips('可以查看自己的卡牌收集情况！')">
      <div class="wm_card_menu_ico">
        <img src="../../assets/images/menu/handbook.png" width="100%" height="100%" />
      </div>
      <div class="wm_card_menu_text">图鉴</div>
    </div>
    <div class="wm_card_menu_box" @click="watchMyCard()" v-if="token" @mouseover="remTips('点击可以查看自己的卡牌信息。')">
      <div class="wm_card_menu_ico">
        <img :src="'https://cdn.v2ex.com/gravatar/'+getCardMd5()+'?s=100&amp;d=mm&amp;r=g&amp;d=robohash&days='+txDays" class="wm_card_menu_ico_my" width="100%" height="100%" />
      </div>
      <div class="wm_card_menu_text">我的</div>
    </div>
    <div class="wm_card_menu_box" @click="openDonate" @mouseover="remTips('呜呜呜，开发者现在穷的没饭吃了，求捐赠！')">
      <div class="wm_card_menu_ico">
        <img src="../../assets/images/menu/zanzhu.png" width="100%" height="100%" />
      </div>
      <div class="wm_card_menu_text">捐赠</div>
    </div>
  </div>
  <el-dialog
    title="新闻公告"
    :visible.sync="newsDialog"
    :lock-scroll="false"
    :append-to-body="true"
    class="reg_code_dialog"
    width="100%">
    <div class="wm_menu_news_body" v-if="newsList">
      <el-collapse accordion>
        <el-collapse-item :title="item.title" :name="index" v-for="(item,index) in newsList" v-bind:key="index">
          <div class="wm_menu_news_time">发布于：{{item.time | capitalize}}</div>
          <div class="wm_menu_news_text">{{item.text}}</div>
        </el-collapse-item>
      </el-collapse>
      <el-pagination
        small
        layout="prev, pager, next"
        :total="totle"
        @current-change="pageChange"
        :current-page.sync="page"
        :page-size="20"
        class="wm_menu_news_page">
      </el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="newsDialog=false">关闭</el-button>
    </span>
  </el-dialog>
  <el-dialog
    title="请登录"
    :before-close="cancelLoginShow"
    :visible.sync="loginShow"
    :append-to-body="true"
    :close-on-click-modal="false"
    class="reg_code_dialog"
    width="100%">
    <el-form ref="form" :model="form" label-width="80px" @keyup.enter.native="goLogin()">
    <el-form-item label="账号">
      <el-input v-model="form.email" @input="emailToLowerCase" placeholder="请输入邮箱地址"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="form.password" show-password placeholder="请输入密码"></el-input>
    </el-form-item>
    <el-form-item label="验证码">
      <el-input placeholder="请输入验证码" v-model="form.captcha" type="tel">
        <template slot="append"><img class="reg_code_img" :src="captchaSrc" @click="captchaUpdata"></template>
      </el-input>
    </el-form-item>
    <el-form-item label="记住密码">
      <el-switch v-model="form.remPass"></el-switch>
      <router-link class="wm_find_ps_link" to="/find">找回密码</router-link>
    </el-form-item>
  </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelLoginShow()">取消</el-button>
      <el-button @click="goLogin()" type="primary">登录</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import {authApi} from "../api";
import {mailCheck,passwordCheck} from "../../utils/utils";
import md5_ from 'js-md5';

export default {
  data() {
    return {
      txDays:new Date().getDate(),
      token:sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token"),
      captchaSrc:'/api/captcha?time='+new Date().getTime(),
      routPath:null,
      loginShow:false,
      newsDialog:false,
      newsList:null,
      page:1,
      totle:0,
      form: {
          email: '',
          password: '',
          captcha:'',
          remPass:false
        }
    }
  },
  mounted() {
    this.getRememberEmail();
  },
  filters:{
    capitalize: function (value) {
      var date = new Date(parseInt(value));
        var tt = [date.getFullYear(), ((date.getMonth()+1)<10?'0'+(date.getMonth()+1):date.getMonth()+1), (date.getDate()<10?'0'+date.getDate():date.getDate())].join('-') + '  ' +[(date.getHours()<10?'0'+date.getHours():date.getHours()), (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()), (date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds())].join(':');
        return tt;
    }
  },
  methods: {
    remTips(text){
      $l2dMassage(text);
    },
    goCouse(){
      window.open('https://www.wikimoe.com/?post=228','_blank');
    },
    getCardMd5(){
      let md5 = '';
      try {
          let tokenUserInfo = this.token.split('.')[1];
          let email = JSON.parse(atob(tokenUserInfo)).email;
          md5 = md5_(email);
      }
      catch(err) {
          md5 = '';
      }
      return md5;
    },
    openNews(){
      this.page = 1;
      this.newsDialog = true;
      this.getNews();
    },
    pageChange(p){
      this.page = p;
      this.getNews();
    },
    getNews(){
      let params = {
        page:this.page
      }
      authApi.news(params).then(res => {
        console.log(res);
        if(res.data.code==1){
          this.newsList = res.data.data;
          this.totle = res.data.total;
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    openDonate(){
      this.$alert('<div class="watch_img"><img src="/static/otherImg/donate.jpg" /></div>', '捐赠', {
        dangerouslyUseHTMLString: true
      });
    },
    watchMyCard(){
      let md5 = this.getCardMd5();
      console.log(md5);
      this.$router.push({ 
        path:'/',
        query:{md5:md5}
      });
    },
    goHome(){
      this.$router.push({ path:'/'});
    },
    cancelLoginShow(){
      this.loginShow =false;
      this.routPath = null;
      this.form =  {
          email: '',
          password: '',
          captcha:'',
          remPass:false
        }
      this.getRememberEmail();
    },
    goLogin(){
      //检查格式
      if(!mailCheck(this.form.email)){
          this.$message.error('邮箱格式有误！');
          return false;
      }
      if(this.form.password==''){
          this.$message.error('请输入密码！');
          return false;
      }
      if(this.form.captcha==''){
          this.$message.error('请输入验证码！');
          return false;
      }
      let params = {
        email: this.form.email,
        password:this.form.password,
        captcha:this.form.captcha,
        remPass:Number(this.form.remPass)
      };
      authApi.login(params).then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
            this.captchaUpdata();
          }else if(res.data.code==1){
            let resData = res.data;
            if(this.form.remPass){
              localStorage.setItem("token", resData.token);
            }else{
              sessionStorage.setItem("token",resData.token);
            }
            this.goLink();
          }
      })
    },
    getRememberEmail(){
      var storage=window.localStorage;
      if(storage.getItem("wikimoeEmail")){
        this.form.email = storage.getItem("wikimoeEmail");
      }
    },
    emailToLowerCase(){
      this.form.email = this.form.email.toLowerCase();
    },
    captchaUpdata(){
      this.captchaSrc = '/api/captcha?time='+new Date().getTime();
    },
    login(p){
      this.routPath = p;
      let token = sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token");
      if(token){
        this.goLink();
      }else{
        this.getRememberEmail();
        this.loginShow = true;
        this.captchaSrc= '/api/captcha?time='+new Date().getTime();
      }
    },
    goLink(){
      console.log(this.routPath);
      if(!this.routPath){
        return false;
      }
      this.$router.push({ path:this.routPath});
    }
  }
}
</script>

