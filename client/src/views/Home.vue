<!-- home -->
<template>
  <div class="home">
    <router-link to="/register"
                 class="mr5"
                 v-if="!token">注册</router-link>
    <router-link to="/login"
                 class="mr5"
                 v-if="!token">登录</router-link>
    <router-link to="/chat"
                 v-if="token">聊天室</router-link>
  </div>
</template>

<script>

export default {
  name: '',
  components: {},
  data () {
    return {
      token: sessionStorage.getItem("token")
    };
  },
  computed: {},
  watch: {},
  methods: {

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