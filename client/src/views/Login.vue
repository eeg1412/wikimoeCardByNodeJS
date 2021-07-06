<!-- 登录 -->
<template>
  <div>
    <div>账号：<input type="text"
             v-model="account"></div>
    <div>密码：<input type="password"
             v-model="password"></div>
    <div><button type="button"
              @click="login"
              class="mr5">登录</button>
      <router-link to="/">返回</router-link>
    </div>
  </div>
</template>

<script>
import { authApi } from "../api";
const md5 = require('md5');
export default {
  name: 'login',
  components: {},
  data () {
    return {
      account: '',
      password: '',
    };
  },
  computed: {},
  watch: {},
  methods: {
    login () {
      const params = {
        password: md5(this.password),
        account: this.account
      }
      authApi.login(params).then(res => {
        alert(res.data.msg);
        if (res.data.code === 1) {
          sessionStorage.setItem("token", res.data.token);
          this.$router.push({ name: 'chat' });
        }
      });
    }
  },
  created () {

  },
  mounted () {

  },
  beforeCreate () { },
  beforeMount () { },
  beforeUpdate () { },
  updated () { },
  beforeUnmount () { },
  unmounted () { },
  activated () { },
}
</script>
<style>
</style>