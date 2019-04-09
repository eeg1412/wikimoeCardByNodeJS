<template>
<div>
  <div class="wm_card_menu_body">
    <div class="wm_card_menu_box" @click="goHome()" v-if="$route.path!='/'">
      <div class="wm_card_menu_ico">
        <img src="../../assets/images/menu/home.jpg" width="100%" height="100%" />
      </div>
      <div class="wm_card_menu_text">首页</div>
    </div>
    <div class="wm_card_menu_box" @click="login('/demining')" v-if="$route.path!='/demining'">
      <div class="wm_card_menu_ico">
        <img src="../../assets/images/menu/kuangchang.jpg" width="100%" height="100%" />
      </div>
      <div class="wm_card_menu_text">矿场</div>
    </div>
    <div class="wm_card_menu_box" @click="login('/star/shop')" v-if="$route.path!='/star/shop'">
      <div class="wm_card_menu_ico">
        <img src="../../assets/images/menu/shop.png" width="100%" height="100%" />
      </div>
      <div class="wm_card_menu_text">商店</div>
    </div>
    <div class="wm_card_menu_box" @click="openDonate">
      <div class="wm_card_menu_ico">
        <img src="../../assets/images/menu/zanzhu.png" width="100%" height="100%" />
      </div>
      <div class="wm_card_menu_text">捐赠</div>
    </div>
  </div>
  <el-dialog
    title="请登录"
    :before-close="cancelLoginShow"
    :visible.sync="loginShow"
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
      <el-input placeholder="请输入验证码" v-model="form.captcha">
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

export default {
  data() {
    return {
      captchaSrc:'/api/captcha?time='+new Date().getTime(),
      routPath:null,
      loginShow:false,
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
  methods: {
    openDonate(){
      this.$alert('<div class="watch_img"><img src="/static/otherImg/donate.jpg" /></div>', '捐赠', {
        dangerouslyUseHTMLString: true
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

