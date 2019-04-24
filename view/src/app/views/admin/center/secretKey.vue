<template>
<div class="wmcard_admincenter_common_right_body">
  <el-form :model="key" label-width="140px">
    <el-form-item label="key：">
      <p class="wm_admin_sk_copy">{{key.key || '您还未设置secret key，请重新生成！'}}</p>
    </el-form-item>
    <el-form-item>
      <p>注：开发者在使用接口时加上{secretkey:上面的key}可以避免验证码和邮箱验证。</p>
      <el-button type="primary" @click="onSubmit">重新生成</el-button>
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
      key:{
        key:'',
      },
      token:sessionStorage.getItem("adminToken")?sessionStorage.getItem("adminToken"):localStorage.getItem("adminToken")
    }
  },
  mounted() {
    this.getKey();
  },
  methods: {
    getKey(){
      let params = {
        type:'get',
        token:this.token
      }
      authApi.adminsecretkey(params).then(res => {
          console.log(res);
          if(res.data.code==1){
            this.key.key = res.data.secretkey || '';
          }else{
            this.$message.error(res.data.msg);
          }
        });
    },
    onSubmit(){
      this.$confirm('此操作将替换现有的key, 是否继续?', '提示', {
        confirmButtonText: '替换',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          type:'edit',
          token:this.token
        }
        authApi.adminsecretkey(params).then(res => {
          console.log(res);
          if(res.data.code==1){
            this.$message({
              message: '生成成功！',
              type: 'success'
            });
            this.key.key = res.data.secretkey;
          }else{
            this.$message.error(res.data.msg);
          }
        });
      }).catch(() => {

      });
    }
  },
}
</script>

<style>
.wm_admin_sk_copy{
  border-radius: 3px;
  border:1px solid #bebebe;
  padding: 5px 10px;
  height: 24px;
  line-height: 24px;
}
</style>
