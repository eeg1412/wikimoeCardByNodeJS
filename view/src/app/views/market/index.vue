<template>
<div class="common_body">
    <userTop ref="userTop" />
    <h5 class="common_title type_shop">星星卡牌交易市场</h5>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="buyCard">买卡</el-menu-item>
        <el-menu-item index="sellCard">卖卡</el-menu-item>
        <el-menu-item index="wantCard">求卡</el-menu-item>
    </el-menu>
    <div>
        <router-view @updateUserinfo="updateUserinfo" @l2dMassage="l2dMassage"></router-view>
    </div>
    <menuView></menuView>
</div>
</template>

<script>
import userTop from '../../components/topUserInfo.vue';
import menuView from '../../components/menu.vue';

export default {
  data() {
    return {
        activeIndex:'buyCard'
    }
  },
  components: {
    menuView,
    userTop
  },
  watch:{
    $route(to,from){
      this.setMenuActive();
    }
  },
  mounted() {
    this.setMenuActive();
  },
  methods: {
    l2dMassage(text){
      this.$emit('l2dMassage',text);
    },
    setMenuActive(){
      this.activeIndex = this.$route.name
      if(this.activeIndex=='cardDetail'){
          let type = this.$route.query.type;
          if(type=='buy'){
              this.activeIndex = 'buyCard';
          }else{
              this.activeIndex = 'sellCard';
          }
      }
    },
    updateUserinfo(){
      this.$refs.userTop.getUserInfo();
    },
    handleSelect(key, keyPath) {
      this.$router.push({ name:key});
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
