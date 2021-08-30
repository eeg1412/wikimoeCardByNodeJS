<template>
  <div>
    <Toast />
    <router-view></router-view>
  </div>
</template>
<script>
import Toast from 'primevue/toast'
export default {
  components: { Toast },
}
</script>
<style lang="stylus"></style>
