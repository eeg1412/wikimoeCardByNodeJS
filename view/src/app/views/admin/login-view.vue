<template>
<div class="common_body">
  <h5 class="common_title">管理员登录</h5>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="账号">
      <el-input v-model="form.account" placeholder="请输入管理员账号"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="form.password" show-password placeholder="请输入密码"></el-input>
    </el-form-item>
    <el-form-item label="验证码">
      <el-input placeholder="请输入验证码" v-model="form.captcha">
        <template slot="append"><img class="reg_code_img" :src="captchaSrc" @click="captchaUpdata"></template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">登录</el-button>
      <el-button @click="backIndex">返回首页</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import {authApi} from "../../api";
import {mailCheck,passwordCheck,nickNameCheck} from "../../../utils/utils";
export default {
  data() {
    return {
      captchaSrc:'/api/captcha?time='+new Date().getTime(),
      sending:false,
      codeShow:false,
      form: {
          account: '',
          password: '',
          captcha:''
        }
    }
  },
  mounted() {

  },
  methods: {
    captchaUpdata(){
      this.captchaSrc = '/api/captcha?time='+new Date().getTime();
    },
    onSubmit() {
      //检查格式
      if(this.form.captcha==''){
          this.$message.error('请输入邮箱验证码！');
          return false;
      }
      let params = {
      };
      authApi.reg(params).then(res => {
          console.log(res);
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            let resData = res.data;
            this.$alert('恭喜您，注册成功！', '提示', {
              confirmButtonText: '确定',
              showClose:false,
              callback: action => {
                this.$router.push({ path:'/'});
              }
            });
          }
      })
    },
    backIndex(){
      this.$router.push({ path:'/'});
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
