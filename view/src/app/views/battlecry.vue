<template>
    <div class="common_body">
        <userTop ref="userTop" />
        <h5 class="common_title type_shop">升级对战属性</h5>
        <div class="wm_battle_cry_body">
            <el-row :gutter="20">
                <el-col :sm="6" class="tc mb20">
                    <el-card class="box-card">
                        <h5 class="mb10 f18">攻击Lv.1</h5>
                        <p class="mb10">当前攻击+5000</p>
                        <p class="mb20">升级攻击+5100</p>
                        <p class="mb10 f18">升级需要：</p>
                        <p class="mb10"><img src="/static/otherImg/item/0.png"/>×100（100）</p>
                        <p class="mb10"><img src="/static/otherImg/item/1000.png"/>×1（1）</p>
                        <div class="mt20">
                            <el-button type="primary">升级</el-button>
                        </div>
                    </el-card>
                </el-col>
                <el-col :sm="6" class="tc mb20">
                    <el-card class="box-card">
                        <h5 class="mb10 f18">防御Lv.1</h5>
                        <p class="mb10">当前攻击+5000</p>
                        <p class="mb20">升级攻击+5100</p>
                        <p class="mb10 f18">升级需要：</p>
                        <p class="mb10"><img src="/static/otherImg/item/1.png"/>×100（100）</p>
                        <p class="mb10"><img src="/static/otherImg/item/1001.png"/>×1（1）</p>
                        <div class="mt20">
                            <el-button type="primary">升级</el-button>
                        </div>
                    </el-card>
                </el-col>
                <el-col :sm="6" class="tc mb20">
                    <el-card class="box-card">
                        <h5 class="mb10 f18">速度Lv.1</h5>
                        <p class="mb10">当前攻击+5000</p>
                        <p class="mb20">升级攻击+5100</p>
                        <p class="mb10 f18">升级需要：</p>
                        <p class="mb10"><img src="/static/otherImg/item/2.png"/>×100（100）</p>
                        <p class="mb10"><img src="/static/otherImg/item/1002.png"/>×1（1）</p>
                        <div class="mt20">
                            <el-button type="primary">升级</el-button>
                        </div>
                    </el-card>
                </el-col>
                <el-col :sm="6" class="tc mb20">
                    <el-card class="box-card">
                        <h5 class="mb10 f18">生命(SAN)Lv.1</h5>
                        <p class="mb10">当前攻击+5000</p>
                        <p class="mb20">升级攻击+5100</p>
                        <p class="mb10 f18">升级需要：</p>
                        <p class="mb10"><img src="/static/otherImg/item/3.png"/>×100（100）</p>
                        <p class="mb10"><img src="/static/otherImg/item/1003.png"/>×1（1）</p>
                        <div class="mt20">
                            <el-button type="primary">升级</el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
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
        battleOverTimes:'--'
    }
  },
  components: {
    menuView,
    userTop,
    battle
  },
  mounted() {
      this.searchBattleInfo();
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
            }
        });
      },
      goBattleCard(){
          this.$router.push({
                path:'/battlecard'
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
            }
        });
      }
  }
}
</script>

<style scoped>
.wm_battle_cry_body{
    padding: 100px 0;
}
@media (max-width: 768px){
    .wm_battle_cry_body{
        padding: 30px 0;
    }
}
</style>
