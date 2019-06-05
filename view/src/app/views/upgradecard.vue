<template>
    <div class="common_body">
        <userTop ref="userTop" />
        <h5 class="common_title type_shop">升级对战卡牌</h5>
        <div class="wm_battle_cry_body">
            <el-row :gutter="20">
                <el-col :sm="12" class="tc mb20">
                    <el-card class="box-card" :body-style="{ padding: '4%' }">
                        <table class="wm_levle_card_table">
                            <tbody>
                                <td>
                                    <div class="wm_level_card_img_body mb10">
                                        <img src="/static/img/3033.jpg" class="w_10 wm_level_card_img">
                                    </div>
                                </td>
                                <td>
                                    <h5 class="mb5 f18">Lv.1</h5>
                                    <p class="cRed mb20">
                                        <el-tooltip placement="top">
                                            <div slot="content" class="tc">
                                                <p class="mb5">每升一级攻击力+100、防御力+50</p>
                                                <p class="mb5">当前攻击+5000</p>
                                                <p class="mb5">当前防御+2500</p>
                                                <p class="mb5">下一级攻击+5100</p>
                                                <p class="mb5">下一级防御+2550</p>
                                            </div>
                                            <span class="wm_set_pointer">查看属性加成</span>
                                        </el-tooltip>
                                    </p>
                                    <p class="mb10 f18">升级需要</p>
                                    <p class="mb10"><el-tooltip content="需要100个火攻水晶，可通过抽卡挖矿获得。" placement="top"><img class="wm_level_card_item_img wm_set_pointer" src="/static/otherImg/item/12.png"/></el-tooltip>×100(100)</p>
                                    <div class="mb20"><div class="wm_level_card_ico_img_body"><el-tooltip content="需要100张小木曾雪菜，可通过抽卡或者市场交易获得。" placement="top"><img class="wm_level_card_ico_img wm_set_pointer" src="/static/img/3033.jpg"/></el-tooltip></div><span>×1(1)</span></div>
                                    <p class="mb10">成功率:100%</p>
                                    <div class="mt20">
                                        <el-button type="primary">升级</el-button>
                                    </div>
                                </td>
                            </tbody>
                        </table>
                    </el-card>
                </el-col>
                <el-col :sm="12" class="tc mb20">
                    <el-card class="box-card" :body-style="{ padding: '4%' }">
                        <table class="wm_levle_card_table">
                            <tbody>
                                <td>
                                    <div class="wm_level_card_img_body mb10">
                                        <img src="/static/img/3033.jpg" class="w_10 wm_level_card_img">
                                    </div>
                                </td>
                                <td>
                                    <h5 class="mb5 f18">Lv.1</h5>
                                    <p class="cRed mb20">
                                        <el-tooltip placement="top">
                                            <div slot="content" class="tc">
                                                <p class="mb5">每升一级攻击力+100</p>
                                                <p class="mb5">当前攻击+5000</p>
                                                <p class="mb5">下一级攻击+5100</p>
                                            </div>
                                            <span class="wm_set_pointer">查看属性加成</span>
                                        </el-tooltip>
                                    </p>
                                    <p class="mb10 f18">升级需要</p>
                                    <p class="mb10"><el-tooltip content="需要100个火攻水晶，可通过抽卡挖矿获得。" placement="top"><img class="wm_level_card_item_img wm_set_pointer" src="/static/otherImg/item/12.png"/></el-tooltip>×100(100)</p>
                                    <div class="mb20"><div class="wm_level_card_ico_img_body"><el-tooltip content="需要100张小木曾雪菜，可通过抽卡或者市场交易获得。" placement="top"><img class="wm_level_card_ico_img wm_set_pointer" src="/static/img/3033.jpg"/></el-tooltip></div><span>×1(1)</span></div>
                                    <p class="mb10">成功率:100%</p>
                                    <div class="mt20">
                                        <el-button type="primary">升级</el-button>
                                    </div>
                                </td>
                            </tbody>
                        </table>
                    </el-card>
                </el-col>
            </el-row>
            <div class="mt20 tc">
                <el-button>返回</el-button>
                <el-button type="primary">组卡</el-button>
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
import itemData from '../../../../server/data/item';
import cardData from '../../utils/cardData';

export default {
  data() {
    return {
        token:sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token"),
        battleData:null,
        battleSence:false,
        myBattleTimes:'--',
        battleOverTimes:'--',
        itemData_:itemData,
        cardDatas:cardData['cardData']
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
.wm_levle_card_table{
    width: 100%;
}
.wm_levle_card_table td{
    width: 50%;
    padding: 0px;
}
.wm_level_card_ico_img{
    height: 100%;
    width: auto;
}
.wm_level_card_ico_img_body{
    height: 24px;
    width: 24px;
    display: inline-block;
    text-align: center;
}
.wm_level_card_img_body{
    padding-bottom: calc(100% * 1.4);
    position: relative;
    z-index: 1;
}
.wm_level_card_img_body .wm_level_card_img{
    position: absolute;
    left: 0;
    top: 0;
}
.wm_battle_cry_body{
    padding: 50px 0;
}
.wm_level_card_item_img{
    width: 24px;
    height: 24px;
}
@media (max-width: 768px){
    .wm_battle_cry_body{
        padding: 30px 0;
    }
}
</style>
