<template>
<div class="common_body">
  <h5 class="common_title">初始化安装</h5>
  <el-form ref="form" :model="form" label-width="140px">
    <el-form-item label="管理员账号">
      <el-input v-model="form.account" placeholder="请设定管理员账号"></el-input>
    </el-form-item>
    <el-form-item label="管理员密码">
      <el-input v-model="form.password" show-password placeholder="请设定管理员密码"></el-input>
    </el-form-item>
    <el-form-item label="每日抽卡次数">
      <el-input v-model="form.dailyChance" placeholder="请设定每日抽卡次数" type="number"></el-input>
    </el-form-item>
    <el-form-item label="邮件发送host">
      <el-input v-model="form.smtpHost" placeholder="请设定邮件发送host地址"></el-input>
    </el-form-item>
    <el-form-item label="邮件发送端口">
      <el-input v-model="form.smtpPort" placeholder="请设定邮件发送端口" type="number"></el-input>
    </el-form-item>
    <el-form-item label="邮箱账户">
      <el-input v-model="form.smtpAuthUser" placeholder="请设定邮箱账户"></el-input>
    </el-form-item>
    <el-form-item label="邮箱密码">
      <el-input v-model="form.smtpAuthPass" show-password placeholder="请设定邮箱密码"></el-input>
    </el-form-item>
    <el-form-item label="session">
      <el-input v-model="form.sessionSecret" placeholder="用于session加密的字符串"></el-input>
    </el-form-item>
    <el-form-item label="JWTSecret">
      <el-input v-model="form.JWTSecret" placeholder="用于JWT加密字符串"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">安装</el-button>
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
      form: {
          account: '',
          password: '',
          dailyChance: '',
          smtpHost: '',
          smtpPort: '',
          smtpAuthUser: '',
          smtpAuthPass: '',
          sessionSecret: '',
          JWTSecret: '',
        }
    }
  },
  mounted() {
    this.chekInstall();
  },
  methods: {
    chekInstall(){
      authApi.admincheckinstall().then(res => {
        if(res.data.code!=1){
          this.$router.replace({ path:'/'});
        }
      });
    },
    onSubmit() {
      // 校验数据
      for(var i in this.form) {
          if(!this.form[i]){
              this.$message.error('有数据为空，请检查！');
              return false;
          }
      }
      this.form.dailyChance = Math.abs(Math.round(this.form.dailyChance));
      this.form.smtpPort = Math.abs(Math.round(this.form.smtpPort));
      if(isNaN(this.form.dailyChance)){
          this.$message.error('抽卡次数必须为数字');
          return false;
      }
      if(isNaN(this.form.smtpPort)){
          this.$message.error('端口必须为数字');
          return false;
      }
      let params = {config:this.form};
      authApi.admininstall(params).then(res => {
          console.log(res);
          if(res.data.code==1){
            this.$alert('恭喜您，安装成功！', '提示', {
              confirmButtonText: '确定',
              showClose:false,
              callback: action => {
                this.$router.push({ path:'/'});
              }
            });
          }else{
            this.$message.error(res.data.msg);
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
