<template>
<p>home-view work!</p>
</template>

<script>
import {authApi} from "../api";
export default {
  data() {
    return {
    }
  },
  mounted() {
    this.tryLogin();
  },
  methods: {
    tryLogin(){
      authApi.login({formId: '123'}).then(res => {
          console.log(res);
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
