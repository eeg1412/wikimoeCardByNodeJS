<template>
    <div class="common_body">
        <userTop ref="userTop" />
        <h5 class="common_title type_shop">卡牌对战</h5>
        <transition name="el-fade-in-linear">
            <battle :battleData="battleData" v-if="battleSence" @gameover="gameover"></battle>
        </transition>
        <div class="wm_battle_btn_body">
            <el-button type="primary" icon="el-icon-search" @click="battle">搜索对手</el-button>
            <el-button type="primary" icon="el-icon-star-off" @click="goBattleCard">组建卡牌</el-button>
        </div>
        <menuView></menuView>
    </div>
</template>

<script>
import menuView from '../components/menu.vue';
import {authApi} from "../api";
import userTop from '../components/topUserInfo.vue';
import battle from '../components/battle.vue';

export default {
  data() {
    return {
        token:sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token"),
        battleData:null,
        battleSence:false,
    }
  },
  components: {
    menuView,
    userTop,
    battle
  },
  methods: {
      goBattleCard(){
          this.$router.push({
                path:'/battlecard'
          });
      },
      gameover(){
          this.battleSence = false;
          this.$refs.userTop.getUserInfo();
      },
      battle(){
        let params = {
            token:this.token
        }
        authApi.battle(params).then(res => {
            console.log(res);
            if(res.data.code==0){
                this.$message.error(res.data.msg);
            }else if(res.data.code==1){
                this.battleData = res.data;
                this.battleSence = true;
            }
        });
      }
  }
}
</script>

<style scoped>
.wm_battle_btn_body{
    text-align:center;
    padding: 100px 0;
}
</style>
