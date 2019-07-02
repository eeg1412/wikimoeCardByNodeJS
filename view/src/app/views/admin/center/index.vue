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
          <el-menu-item index="10" @click="goLink('/cardadmin/center/adminpackage')">
            <i class="el-icon-copy-document"></i>
            <span slot="title">卡包管理</span>
          </el-menu-item>
          <el-menu-item index="5" @click="goLink('/cardadmin/center/newslist')">
            <i class="el-icon-news"></i>
            <span slot="title">新闻</span>
          </el-menu-item>
          <el-menu-item index="6" @click="goLink('/cardadmin/center/secretkey')">
            <i class="el-icon-key"></i>
            <span slot="title">设置Key</span>
          </el-menu-item>
          <el-menu-item index="7" @click="goLink('/cardadmin/center/adminlogs')">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">系统日志</span>
          </el-menu-item>
          <el-menu-item index="8" @click="goLink('/cardadmin/center/passwordchange')">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">密码修改</span>
          </el-menu-item>
          <el-menu-item index="9" @click="logout()">
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
