<template>
<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item index="decompose">卡牌</el-menu-item>
    <el-menu-item index="decomposeitem">道具</el-menu-item>
</el-menu>
</template>

<script>
export default {
  data() {
    return {
        activeIndex:this.$route.name
    }
  },
  methods: {
        handleSelect(key, keyPath) {
            this.$router.push({ name:key});
        }
  }
}
</script>

<style lang="stylus" scoped>
</style>
