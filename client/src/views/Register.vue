<template>
  <div>
    <div>账号：<input type="text"
             v-model="account"></div>
    <div>密码：<input type="password"
             v-model="password"></div>
    <div><button type="button"
              @click="register"
              class="mr5">注册</button>
      <router-link to="/">返回</router-link>
    </div>
  </div>
</template>

<script>
import { authApi } from "../api";
// @ is an alias to /src
export default {
  name: 'register',
  data () {
    return {
      account: '',
      password: '',
    }
  },
  methods: {
    register () {
      const params = {
        password: this.password,
        account: this.account
      }
      authApi.register(params).then(res => {
        alert(res.data.msg);
        if (res.data.code === 1) {
          this.$router.push({ name: 'home' });
        }
      });
    }
  }
}
</script>
