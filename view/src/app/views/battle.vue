<template>
    <div class="common_body">
        <userTop ref="userTop" />
        <h5 class="common_title type_shop">卡牌对战</h5>
        <div class="tc">Tip:进阶匹配将会匹配到更强大的对手，同时收益也会更高。</div>
        <transition name="el-fade-in-linear">
            <battle :battleData="battleData" v-if="battleSence" @gameover="gameover"></battle>
        </transition>
        <div class="wm_battle_btn_body">
            <div class="wm_battle_ueseinfo_body">
                <table class="wm_user_info_table">
                    <thead>
                        <tr>
                        <th>胜利</th>
                        <th>战败</th>
                        <th>平局</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td class="wm_user_level">{{userbattleinfoData.win}}</td>
                        <td class="wm_user_score">{{userbattleinfoData.lose}}</td>
                        <td class="wm_user_getcard_count">{{userbattleinfoData.draw}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="wm_battle_today_v">今日已获胜：{{myBattleTimes}}/{{battleOverTimes}}</div>
            <div class="wm_battle_btn_box">
                <el-tooltip class="item" effect="dark" content="匹配与自己竞技点相近的对手。" placement="top" :enterable="false">
                    <el-button type="primary" icon="el-icon-search" @click="battle(false)">匹配对手（普通）</el-button>
                </el-tooltip>
            </div>
            <div class="wm_battle_btn_box">
                <el-tooltip class="item" effect="dark" content="匹配竞技点比自己高一些的对手。" placement="top" :enterable="false">
                    <el-button type="primary" icon="el-icon-search" @click="battle(true)">匹配对手（进阶）</el-button>
                </el-tooltip>
            </div>
            <div class="wm_battle_btn_box">
                <el-tooltip class="item" effect="dark" content="组建自己的对战卡牌。" placement="top" :enterable="false">
                    <el-button type="primary" icon="el-icon-star-off" @click="goBattleRoute('/battlecard')">组建我的对战卡牌</el-button>
                </el-tooltip>
            </div>
            <div class="wm_battle_btn_box">
                <el-tooltip class="item" effect="dark" content="升级自己的对战属性。" placement="top" :enterable="false">
                    <el-button type="primary" icon="el-icon-star-off" @click="goBattleRoute('/upgradecard')">升级我的对战卡牌</el-button>
                </el-tooltip>
            </div>
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
        myBattleTimes:'--',
        battleOverTimes:'--',
        testWin:[0,0,0],
        userbattleinfoData:{win:0,lose:0,draw:0}
    }
  },
  components: {
    menuView,
    userTop,
    battle
  },
  mounted() {
      this.searchBattleInfo();
      //测试胜率
    //   for(let i=0;i<1000;i++){
    //       this.battle(false)
    //   }
  },
  methods: {
      searchBattleInfo(){
        let params = {
            token:this.token
        }
        authApi.searchbattleinfo(params).then(res => {
            console.log(res);
            if(res.data.code==0){
                this.$message.error(res.data.msg);
            }else if(res.data.code==1){
                this.myBattleTimes = res.data.myBattleTimes;
                this.battleOverTimes = res.data.battleOverTimes;
                if(res.data.userbattleinfoData){
                    this.userbattleinfoData = res.data.userbattleinfoData;
                }
            }
        });
      },
      goBattleRoute(path){
          this.$router.push({
                path:path
          });
      },
      gameover(){
        this.battleSence = false;
        this.$refs.userTop.getUserInfo();
        this.searchBattleInfo();
        if(this.battleData.battleGetStar>0){
            this.$notify.info({
                title: '获得对战奖励！',
                duration: 10000,
                dangerouslyUseHTMLString: true,
                message: '您已达成今日的对战获胜次数，获得了<span class="cOrange">'+this.battleData.battleGetStar+'</span>颗星星！'
            });
        }else if(!this.battleData.battleOverChance&&this.battleData.win===1){
            this.$notify.info({
                title: '恭喜获胜！',
                duration: 10000,
                dangerouslyUseHTMLString: true,
                message: '今日已获胜<span class="cRed">'+this.battleData.myBattleTimes+'/'+this.battleData.battleOverTimes+'</span>次，再获胜<span class="cRed">'+(this.battleData.battleOverTimes-this.battleData.myBattleTimes)+'</span>次就可以获得星星奖励啦！'
            });
        }
      },
      battle(advanced){
        let params = {
            token:this.token,
            advanced:advanced,
        }
        authApi.battle(params).then(res => {
            console.log(res);
            if(res.data.code==0){
                this.$message.error(res.data.msg);
            }else if(res.data.code==1){
                if(res.data.levelUpStar>0){
                    this.$notify.info({
                        dangerouslyUseHTMLString: true,
                        title: '升级啦！',
                        message: '恭喜您升级啦，作为奖励获得<span class="cOrange">'+res.data.levelUpStar+'</span>颗星星！',
                        duration:3000,
                        customClass:'wm_battle_notify'
                    });
                    this.$refs.userTop.getUserInfo();
                }
                this.battleData = res.data;
                this.battleSence = true;
                //测试胜率
                // let testWin = [0,0,0]
                // this.testWin[res.data.win]++;
                // console.log(this.testWin);
            }
        });
      }
  }
}
</script>

<style scoped>
.wm_battle_btn_body{
    text-align:center;
    padding: 50px 0;
}
.wm_battle_today_v{
    padding:20px 0;
    font-size: 16px;
}
.wm_battle_btn_box{
    margin: 20px 0;
}
.wm_battle_ueseinfo_body{
    max-width: 400px;
    margin: 0 auto;
}
</style>
