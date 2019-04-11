<template>
<div class="wmcard_admincenter_common_right_body">
  <el-form ref="form" :model="form" label-width="140px">
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
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import {authApi} from "../../../api";
export default {
  data() {
    return {
      form: {
          sessionSecret:'',//session加密字符串
          JWTSecret:'',//JWT加密字符串
          dailyChance:1,//每日抽卡次数
          smtpHost: '',//邮件发送host
          smtpPort: 1,//邮件发送端口
          smtpAuthUser: '',
          smtpAuthPass:'',
        },
      token:sessionStorage.getItem("adminToken")?sessionStorage.getItem("adminToken"):localStorage.getItem("adminToken"),
    }
  },
  mounted() {
    this.getSettingInfo();
  },
  methods: {
    getSettingInfo(){
      let params = {
        token:this.token,
        type:'get'
      }
      authApi.adminsetting(params).then(res => {
        console.log(res);
        if(res.data.code==1){
          let resData = res.data.data;
          this.form.sessionSecret = resData.sessionSecret;//session加密字符串
          this.form.JWTSecret = resData.JWTSecret;//JWT加密字符串
          this.form.dailyChance = resData.dailyChance;//每日抽卡次数
          this.form.smtpHost = resData.smtpHost;//邮件发送host
          this.form.smtpPort = resData.smtpPort;//邮件发送端口
          this.form.smtpAuthUser = resData.smtpAuth.user;
          this.form.smtpAuthPass = resData.smtpAuth.pass;
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    onSubmit(){
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
      let params = {
        token:this.token,
        type:'edit',
        config:this.form
      }
      authApi.adminsetting(params).then(res => {
        console.log(res);
        if(res.data.code==1){
          this.$message({
            message: '修改成功！',
            type: 'success'
          });
        }else{
          this.$message.error(res.data.msg);
        }
      });
    }
  },
}
</script>

<style lang="stylus" scoped>
</style>
