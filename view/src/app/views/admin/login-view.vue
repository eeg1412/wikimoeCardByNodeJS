<template>
  <div class="common_body">
    <h5 class="common_title">管理员登录</h5>
    <el-form ref="form"
             :model="form"
             label-width="80px"
             @keyup.enter.native="onSubmit()">
      <el-form-item label="账号">
        <el-input v-model="form.account"
                  placeholder="请输入管理员账号"></el-input>
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
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="onSubmit">登录</el-button>
        <el-button @click="backIndex">返回首页</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { authApi } from "../../api";
import { mailCheck, passwordCheck, nickNameCheck } from "../../../utils/utils";
export default {
  data () {
    return {
      captchaSrc: '/api/captcha?time=' + new Date().getTime(),
      form: {
        account: '',
        password: '',
        captcha: '',
        remPass: false
      }
    }
  },
  mounted () {
    let token = sessionStorage.getItem("adminToken") ? sessionStorage.getItem("adminToken") : localStorage.getItem("adminToken");
    if (token) {
      this.$router.replace({ path: '/cardadmin/center' });
    }
  },
  methods: {
    captchaUpdata () {
      this.captchaSrc = '/api/captcha?time=' + new Date().getTime();
    },
    onSubmit () {
      //检查格式
      for (var i in this.form) {
        if (!this.form[i] && i !== 'remPass') {
          this.$message.error('有数据为空，请检查！');
          return false;
        }
      }
      let params = this.form;
      authApi.adminLogin(params).then(res => {
        console.log(res);
        if (res.data.code == 1) {
          if (this.form.remPass) {
            localStorage.setItem("adminToken", res.data.token);
          } else {
            sessionStorage.setItem("adminToken", res.data.token);
          }
          this.$router.replace({ path: '/cardadmin/center' });
        } else {
          this.$message.error(res.data.msg);
          this.captchaUpdata();
        }
      })
    },
    backIndex () {
      this.$router.push({ path: '/' });
    }
  }
}
</script>

<style lang="stylus" scoped></style>
