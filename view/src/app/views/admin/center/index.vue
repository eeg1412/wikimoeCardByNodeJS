<template>
<div>
  <el-container class="wmcard_admin_center">
    <el-header class="wmcard_admin_header"><router-link to="/cardadmin/center" class="wmcard_admin_header_link">维基萌抽卡管理后台</router-link></el-header>

    <el-container>
      <el-aside width="160px">
        <el-menu>
          <el-menu-item index="1">
            <i class="el-icon-setting"></i>
            <span slot="title">设置</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-star-off"></i>
            <span slot="title">赠与</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-tickets"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>
          <el-menu-item index="4">
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
export default {
  data() {
    return {
    }
  },
}
</script>

<style src="../../../../assets/styles/admin.css" scoped>
</style>
