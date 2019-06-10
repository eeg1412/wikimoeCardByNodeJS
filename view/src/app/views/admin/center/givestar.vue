<template>
<div class="wmcard_admincenter_common_right_body">
  <el-form :model="giveStar" label-width="140px">
    <el-form-item label="全员">
      <el-switch v-model="giveStar.sendAll"></el-switch>
    </el-form-item>
    <el-form-item label="邮箱" v-if="!giveStar.sendAll">
      <el-input v-model="giveStar.email" placeholder="请填写邮箱地址" clearable></el-input>
    </el-form-item>
    <el-form-item label="星星">
      <el-input v-model="giveStar.star" placeholder="请填写星星" type="number" clearable></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">赠送</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import {authApi} from "../../../api";
import {mailCheck} from "../../../../utils/utils";
export default {
  data() {
    return {
      giveStar:{
        email:'',
        star:'',
        sendAll:false
      },
      token:sessionStorage.getItem("adminToken")?sessionStorage.getItem("adminToken"):localStorage.getItem("adminToken")
    }
  },
  methods: {
    onSubmit(){
      let star = Math.round(this.giveStar.star);
      let email = this.giveStar.email;
      let sendAll = this.giveStar.sendAll;
      if(isNaN(star)||star<=0){
          this.$message.error('请填入正确的数值！');
          return false;
      }
      if(!mailCheck(email)&&!this.giveStar.sendAll){
          this.$message.error('邮箱格式有误！');
          return false;
      }
      let params = {
        token:this.token,
        star:star,
        email:email,
        sendAll:sendAll
      }
      authApi.admingivestar(params).then(res => {
        console.log(res);
        if(res.data.code==1){
          this.$message({
            message: res.data.msg,
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
