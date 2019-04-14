<template>
<div>
  <el-container class="wmcard_admin_center">
    <el-header class="wmcard_admin_header"><router-link to="/cardadmin/center" class="wmcard_admin_header_link">维基萌抽卡管理后台</router-link></el-header>

    <el-container>
      <el-aside width="160px">
        <el-menu>
          <el-menu-item index="1" @click="goLink('/cardadmin/center/setting')">
            <i class="el-icon-setting"></i>
            <span slot="title">设置</span>
          </el-menu-item>
          <el-menu-item index="2" @click="goLink('/cardadmin/center/givestar')">
            <i class="el-icon-star-off"></i>
            <span slot="title">赠与</span>
          </el-menu-item>
          <el-menu-item index="3" @click="goLink('/cardadmin/center/userlist')">
            <i class="el-icon-tickets"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>
          <el-menu-item index="4" @click="goLink('/cardadmin/center/passwordchange')">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">密码修改</span>
          </el-menu-item>
          <el-menu-item index="5" @click="logout()">
            <i class="el-icon-upload2"></i>
            <span slot="title">登出</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</div>
</template>

<script>
import {authApi} from "../../../api";

export default {
  data() {
    return {
      token:sessionStorage.getItem("adminToken")?sessionStorage.getItem("adminToken"):localStorage.getItem("adminToken")
    }
  },
  methods: {
    goLink(p){
      this.$router.push({ path:p});
    },
    logout(){
      let params = {
        token:this.token
      }
      authApi.adminlogout(params).then(res => {
        console.log(res);
        if(res.data.code==1){
          this.$message({
            message: '成功登出！',
            type: 'success'
          });
          sessionStorage.removeItem("adminToken");
          localStorage.removeItem("adminToken");
          this.$router.replace('/cardadmin');
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
  },
}
</script>

<style src="../../../../assets/styles/admin.css">
</style>
