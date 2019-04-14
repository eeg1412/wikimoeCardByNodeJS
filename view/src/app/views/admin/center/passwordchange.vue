<template>
<div class="wmcard_admincenter_common_right_body">
  <el-form ref="form" :model="form" label-width="140px">
    <el-form-item label="旧密码">
      <el-input v-model="form.password" show-password placeholder="请输入旧密码"></el-input>
    </el-form-item>
    <el-form-item label="新密码">
      <el-input v-model="form.newPassword" show-password placeholder="请输入新密码"></el-input>
    </el-form-item>
    <el-form-item label="验证密码">
      <el-input v-model="form.newPassword_" show-password placeholder="请再次输入新密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">修改</el-button>
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
          password:'',
          newPassword:'',
          newPassword_:''
        },
      token:sessionStorage.getItem("adminToken")?sessionStorage.getItem("adminToken"):localStorage.getItem("adminToken"),
    }
  },
  mounted() {
  },
  methods: {
    onSubmit(){
      // 校验数据
      if(this.form.newPassword!==this.form.newPassword_){
          this.$message.error('两次输入的密码不一样！');
          return false;
      }
      if(this.form.newPassword==''||this.form.password==''){
        this.$message.error('密码不能为空！');
          return false;
      }
      let params = {
        token:this.token,
        password:this.form.password,
        newPassword:this.form.newPassword
      }
      authApi.adminpasswordchange(params).then(res => {
        console.log(res);
        if(res.data.code==1){
          this.$message({
            message: '修改成功！',
            type: 'success'
          });
          sessionStorage.removeItem("adminToken");
          localStorage.removeItem("adminToken");
          this.$router.replace('/cardadmin');
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
