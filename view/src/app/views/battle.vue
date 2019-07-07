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
            <div class="wm_battle_today_v">竞技点：{{myScore}}</div>
            <div class="wm_battle_today_v">今日已获胜：{{myBattleTimes}}/{{battleOverTimes}}</div>
            <div class="mt10"><el-checkbox v-model="skipBattle" @change="changeSkipBattle">跳过战斗动画</el-checkbox></div>
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
        <div class="wm_battle_logs_body" v-if="battleLogs.length>0">
            <h5 class="common_title type_shop">对战记录</h5>
            <div class="tc">Tip:仅记录最近一个月的对战记录。</div>
            <transition name="el-fade-in-linear">
            <div class="mb20 mt20 tc" v-if="logLoading">
                <div class="dib wm_battle_logs_item" v-for="(item,index) in battleLogs" v-bind:key="index">
                    <el-card shadow="always">
                        <div class="tc">
                            <div class="mb15">{{item.time | capitalize}}</div>
                            <div>
                                <el-tooltip class="item" effect="dark" :content="'查看【'+item.data.MyName+'】的对战信息'" placement="top">
                                    <div class="dib wm_set_pointer wm_battlelogs_content" @click="watchUserInfo(true,index)">
                                        <div class="mb5">
                                            <img class="radius5" :src="'https://gravatar.loli.net/avatar/'+item.data.MyMD5+'?s=100&amp;d=mm&amp;r=g&amp;d=robohash&days='+txDays" width="45" height="45">
                                        </div>
                                        <div :class="{'cRed':item.data.win==1,'cGreen1A7':item.data.win==0}">{{item.data.win | myWin}}<span v-if="item.data.getScore!=0">({{item.data.getScore | setScore}})</span></div>
                                    </div>
                                </el-tooltip>
                                <div class="f24 dib ml10 mr10 wm_battlelogs_content">VS</div>
                                <el-tooltip class="item" effect="dark" :content="'查看【'+item.data.EmName+'】的对战信息'" placement="top">
                                    <div class="dib wm_set_pointer wm_battlelogs_content" @click="watchUserInfo(false,index)">
                                        <div class="mb5">
                                            <img class="radius5" :src="item.data.EmMD5?'https://gravatar.loli.net/avatar/'+item.data.EmMD5+'?s=100&amp;d=mm&amp;r=g&amp;d=robohash&days='+txDays:'/static/robotTx/'+Number(item.data.EmName.replace(/[^0-9]/ig,''))%29+'.jpg'" width="45" height="45">
                                        </div>
                                        <div :class="{'cRed':item.data.win==0,'cGreen1A7':item.data.win==1}">{{item.data.win | emWin}}<span v-if="item.data.EmGetScore!=0">({{item.data.EmGetScore | setScore}})</span></div>
                                    </div>
                                </el-tooltip>
                            </div>
                            <div class="mt15"><el-button type="primary" icon="el-icon-video-play" size="mini" @click="replay(index)">播放回放</el-button></div>
                        </div>
                    </el-card>
                </div>
            </div>
            </transition>
            <div class="tc mb15">
                <el-pagination
                small
                layout="prev, pager, next"
                :total="logTotle"
                @current-change="logPageChange"
                :current-page.sync="logPage"
                :page-size="8"
                class="my_card_page">
                </el-pagination>
            </div>
        </div>
        <el-dialog
            :title="userBattleLogInfo.name+'的信息'"
            :visible.sync="dialogVisible"
            class="reg_code_dialog"
            :append-to-body="true"
            :lock-scroll="false"
            @closed="closeUserInfoDig"
            width="95%"
            >
            <div class="wm_top_info_more_body" v-show="!cardMode">
                <div><img class="wm_top_moreinfo_avatar_pic" :src="userBattleLogInfo.MD5?'https://gravatar.loli.net/avatar/'+userBattleLogInfo.MD5+'?s=100&amp;d=mm&amp;r=g&amp;d=robohash&days='+txDays:'/static/robotTx/'+Number(userBattleLogInfo.name.replace(/[^0-9]/ig,''))%29+'.jpg'"></div>
                <div class="wm_top_moreinfo_name mt5">{{userBattleLogInfo.name}}</div>
                <div class="wm_top_moreinfo_body clearfix">
                    <div class="wm_top_moreinfo_box">
                        <div class="wm_top_moreinfo_label">攻：{{userBattleLogInfo.ADSHP[0]}}</div>
                    </div>
                    <div class="wm_top_moreinfo_box">
                        <div class="wm_top_moreinfo_label">防：{{userBattleLogInfo.ADSHP[1]}}</div>
                    </div>
                    <div class="wm_top_moreinfo_box">
                        <div class="wm_top_moreinfo_label">速：{{userBattleLogInfo.ADSHP[2]}}</div>
                    </div>
                    <div class="wm_top_moreinfo_box">
                        <div class="wm_top_moreinfo_label">SAN：{{userBattleLogInfo.ADSHP[3]}}</div>
                    </div>
                    <div class="wm_top_moreinfo_box" v-if="userBattleLogInfo.MD5">
                        <div class="wm_top_moreinfo_label">收集率：{{userBattleLogInfo.cardIndex}}</div>
                    </div>
                </div>
            </div>
            <div class="wm_top_info_more_body clearfix" v-show="cardMode">
                <div class="wm_battle_user_card_item wm_set_pointer" v-for="(item,index) in userBattleLogInfo.cardArr" v-bind:key="index" @click="openImg($wikimoecard.url+(userBattleLogInfo.cardInfo[item].packageId||'0')+'/'+item+'.jpg')">
                    <img :src="$wikimoecard.url+(userBattleLogInfo.cardInfo[item].packageId||'0')+'/'+item+'.jpg'">
                    <div class="f12 mt5">Lv.{{userBattleLogInfo.cardLevel[item]+1}}</div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="cardMode=!cardMode">{{cardMode?'查看属性':'查看卡牌'}}</el-button>
                <el-button @click="dialogVisible = false">关闭</el-button>
            </span>
        </el-dialog>
        <menuView></menuView>
    </div>
</template>

<script>
import menuView from '../components/menu.vue';
import {authApi} from "../api";
import userTop from '../components/topUserInfo.vue';
import battle from '../components/battle.vue';
import {PrefixInteger} from "../../utils/utils";

export default {
  data() {
    return {
        cardMode:false,
        txDays:new Date().getDate(),
        dialogVisible:false,
        userBattleLogInfo:{
            name:'123',
            MD5:'',
            ADSHP:[0,0,0,0],
            cardIndex:0,
            cardArr:[],
            cardLevel:[],
            cardInfo:{},
        },
        logLoading:true,
        replayMode:false,
        battleLogs:[],
        logTotle:0,
        logPage:1,
        token:sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token"),
        battleData:null,
        battleSence:false,
        myBattleTimes:'--',
        battleOverTimes:'--',
        testWin:[0,0,0],
        userbattleinfoData:{win:0,lose:0,draw:0},
        myScore:'--',
        skipBattle:localStorage.getItem("skipBattle")==='true'
    }
  },
  components: {
    menuView,
    userTop,
    battle
  },
  filters: {
      capitalize(value) {
        var date = new Date(parseInt(value*1000));
        var tt = [date.getFullYear(), ((date.getMonth()+1)<10?'0'+(date.getMonth()+1):date.getMonth()+1), (date.getDate()<10?'0'+date.getDate():date.getDate())].join('-') + '  ' +[(date.getHours()<10?'0'+date.getHours():date.getHours()), (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()), (date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds())].join(':');
        return tt;
      },
      myWin(v){
          if(v==1){
              return '胜'
          }else if(v==0){
              return '负'
          }else{
              return '平'
          }
      },
      emWin(v){
          if(v==1){
              return '负'
          }else if(v==0){
              return '胜'
          }else{
              return '平'
          }
      },
      setScore(v){
          if(v>0){
              return '+'+v;
          }else{
              return v;
          }
      }
  },
  mounted() {
      this.$emit('l2dMassage','这里可以挑战大佬并获取竞技点！同时还可以组建自己的对战卡组和升级自己的卡牌！');
      this.searchBattleInfo();
      this.searchbattlelogs(1);
      //测试胜率
    //   for(let i=0;i<1000;i++){
    //       this.battle(false)
    //   }
  },
  methods: {
      closeUserInfoDig(){
          this.cardMode = false;
          this.userBattleLogInfo = {
            name:'123',
            MD5:'',
            ADSHP:[0,0,0,0],
            cardIndex:0,
            cardArr:[],
            cardLevel:[],
            cardInfo:{},
        }
      },
      openImg(imgsrc){
        this.$alert('<div class="watch_img"><img src="'+imgsrc+'" /></div>', '查看卡牌', {
            dangerouslyUseHTMLString: true,
            lockScroll:false
        });
      },
      PrefixInteger_(num,length){
        return PrefixInteger(num,length);
      },
      watchUserInfo(a,index){
          if(this.battleLogs[index].data.ver!==1){
              this.$message.error('该战斗数据版本过旧，无法查看。');
              return false;
          }
          if(a){
              this.userBattleLogInfo={
                    name:this.battleLogs[index].data.MyName,
                    MD5:this.battleLogs[index].data.MyMD5,
                    ADSHP:this.battleLogs[index].data.MyADSHP,
                    cardIndex:this.battleLogs[index].data.MyCardIndexCount,
                    cardArr:this.battleLogs[index].data.MyBattleCard,
                    cardLevel:this.battleLogs[index].data.myCardLevel || {},
                    cardInfo:this.battleLogs[index].data.cardOtherData || {},
                }
          }else{
              this.userBattleLogInfo={
                    name:this.battleLogs[index].data.EmName,
                    MD5:this.battleLogs[index].data.EmMD5,
                    ADSHP:this.battleLogs[index].data.EmADSHP,
                    cardIndex:this.battleLogs[index].data.EmCardIndexCount,
                    cardArr:this.battleLogs[index].data.EmBattleCard,
                    cardLevel:this.battleLogs[index].data.emCardLevel || {},
                    cardInfo:this.battleLogs[index].data.cardOtherData || {},
                }
          }
          this.dialogVisible = true;
      },
      replay(index){
          if(this.replayMode){
              return false;
          }
          if(this.battleLogs[index].data.ver!==1){
              this.$message.error('该回放版本过旧，无法回放。');
              return false;
          }
          this.battleData = this.battleLogs[index].data;
          this.battleSence = true;
          this.replayMode = true;
      },
      searchbattlelogs(page){
          let params = {
              token:this.token,
              page:page
          }
          authApi.searchbattlelogs(params).then(res => {
                console.log(res);
                if(res.data.code==0){
                    this.$message.error(res.data.msg);
                }else if(res.data.code==1){
                    this.logLoading = false;
                    this.battleLogs = res.data.data;
                    this.logTotle = res.data.total;
                    setTimeout(()=>{
                        this.logLoading = true;
                    },200)
                }
          });
      },
      logPageChange(){
          this.searchbattlelogs(this.logPage);
      },
      changeSkipBattle(val){
          localStorage.setItem("skipBattle",val);
      },
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
                this.myScore = res.data.score;
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
        if(this.replayMode){
            this.battleData = null;
            this.replayMode = false;
            return false;
        }
        if(!this.battleData.battleOverChance){
            this.searchbattlelogs(1);
            this.$refs.userTop.getUserInfo();
            this.searchBattleInfo();
        }
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
      winCheck(w){
          if(w==1){
              return '战胜了'
          }else if(w==0){
              return '败给了'
          }else{
              return '打平了'
          }
      },
      battle(advanced){
        if(this.battleSence){
            return false;
        }
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
                if(this.skipBattle){
                    let battleText = '您'+this.winCheck(this.battleData.win)+this.battleData.EmName+'，'+'获得了'+Math.abs(this.battleData.getScore)+'点竞技点和'+this.battleData.getExp+'点经验值。';
                    if(this.battleData.win===0){
                        battleText = '您'+this.winCheck(this.battleData.win)+this.battleData.EmName+'，'+'失去了'+Math.abs(this.battleData.getScore)+'点竞技点。';
                    }
                    this.$alert(battleText+(this.battleData.battleOverChance?'（由于已经超过今日最大胜利次数，此次战斗不结算竞技点和经验值。）':''), '战斗结果').then(() => {
                        this.gameover();
                    }).catch(action => {
                        this.gameover();
                    });
                }else{
                    this.battleSence = true;
                }
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
    padding: 35px 0;
}
.wm_battle_today_v{
    padding:10px 0;
    font-size: 16px;
}
.wm_battle_btn_box{
    margin: 20px 0;
}
.wm_battle_ueseinfo_body{
    max-width: 400px;
    margin: 0 auto;
}
.wm_battle_logs_item{
    margin: 10px;
    width: 220px;
}
.wm_battle_user_card_item{
    width: 20%;
    float: left;
    padding: 5px;
    box-sizing: border-box;
}
.wm_battle_user_card_item img{
    width: 100%;
    height: auto;
}
.wm_battle_usercard_no_fight{
    opacity: 0.4;
}
@media ( max-width : 768px) {
    .wm_battlelogs_content{
        display: block;
    }
    .wm_battle_logs_item{
        width: 150px;
    }
}
@media ( max-width : 370px) {
    .wm_battlelogs_content{
        display:inline-block;
    }
    .wm_battle_logs_item{
        width: 100%;
        margin: 0 0 10px 0;
    }
}
</style>
