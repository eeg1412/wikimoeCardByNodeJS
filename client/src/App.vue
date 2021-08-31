<template>
  <div>
    <Toast />
    <router-view></router-view>
  </div>
</template>
<script>
import Toast from 'primevue/toast'
import { onBeforeMount } from 'vue'
import store from '@/store'
export default {
  components: { Toast },
  setup() {
    onBeforeMount(() => {
      const token = sessionStorage.getItem('token')
        ? sessionStorage.getItem('token')
        : localStorage.getItem('token')
      store.commit('setToken', token)
    })
  },
}
</script>
<style lang="stylus"></style>
<style>
@import url('https://fonts.loli.net/css?family=Noto+Sans+SC&display=swap');
</style>
