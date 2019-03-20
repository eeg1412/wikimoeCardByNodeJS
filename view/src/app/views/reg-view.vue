<template>
<div class="reg_body">
  <h5 class="common_title">注册账号</h5>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="邮箱地址">
      <el-input v-model="form.email" @input="emailToLowerCase" placeholder="请输入邮箱地址"></el-input>
    </el-form-item>
    <el-form-item label="昵称">
      <el-input v-model="form.nickName" placeholder="昵称格式为2-8位中英日数字下划线"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="form.password" show-password placeholder="请输入4-8位纯数字"></el-input>
    </el-form-item>
    <el-form-item label="邮箱验证">
      <el-input v-model="form.code" placeholder="邮箱验证码功能未完成，留空">
        <el-button slot="append">发送验证码</el-button>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">注册抽卡</el-button>
      <el-button @click="backIndex">返回首页</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import {authApi} from "../api";
import {mailCheck,passwordCheck,nickNameCheck} from "../../utils/utils";
export default {
  data() {
    return {
      form: {
          email: '',
          password: '',
          code: '',
          nickName:''
        }
    }
  },
  methods: {
    onSubmit() {
      //检查格式
      if(!mailCheck(this.form.email)){
          this.$message.error('邮箱格式有误！');
          return false;
      }
      if(!passwordCheck(this.form.password)){
          this.$message.error('密码必须为4-8位纯数字！');
          return false;
      }
      if(!nickNameCheck(this.form.nickName)){
          this.$message.error('昵称只能允许为2-8位中英日数字与下划线！');
          return false;
      }
      authApi.reg({email: this.form.email,password:this.form.password,nickName:this.form.nickName}).then(res => {
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
    },
    emailToLowerCase(){
      this.form.email = this.form.email.toLowerCase();
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
