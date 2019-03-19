<template>
<div class="reg_body">
  <h5 class="common_title">注册账号</h5>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="邮箱地址">
      <el-input v-model="form.email"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="form.password" show-password></el-input>
    </el-form-item>
    <el-form-item label="邮箱验证">
      <el-input v-model="form.code">
        <el-button slot="append">发送验证码</el-button>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">注册抽卡</el-button>
      <el-button>返回首页</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  data() {
    return {
      form: {
          email: '',
          password: '',
          code: ''
        }
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
