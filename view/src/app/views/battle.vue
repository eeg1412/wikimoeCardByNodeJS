<template>
  <div class="common_body">
    <userTop ref="userTop" />
    <h5 class="common_title type_shop">卡牌对战</h5>
    <div class="tc">Tip:每小时能回复1次对战机会，最多累加{{battleOverTimes}}次机会！</div>
    <transition name="el-fade-in-linear">
      <battle :battleData="battleData"
              v-if="battleSence"
              @gameover="gameover"></battle>
    </transition>
    <div class="wm_battle_btn_body">
      <div class="wm_battle_ueseinfo_body">
        <table class="wm_user_info_table type_battle">
          <thead>
            <tr>
              <th>胜利</th>
              <th>战败</th>
              <th>平局</th>
              <th>胜率</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{userbattleinfoData.win}}</td>
              <td>{{userbattleinfoData.lose}}</td>
              <td>{{userbattleinfoData.draw}}</td>
              <td>
                <div v-if="userbattleinfoData.win>0">
                  {{(userbattleinfoData.win/(userbattleinfoData.win+userbattleinfoData.lose+userbattleinfoData.draw)*100).toFixed(2)+'%'}}
                </div>
                <div v-else>--</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="wm_battle_today_v">竞技点：{{myScore}}</div>
      <div class="wm_battle_today_v">对战机会：{{myBattleTimes}}/{{battleOverTimes}}</div>
      <div v-if="battleCD>0"
           class="wm_battle_cd_body">
        <el-progress :show-text="false"
                     :stroke-width="2"
                     :percentage="percentageSum(battleCD,timeNow)"
                     :color="customColorMethod"></el-progress>
      </div>
      <div v-if="battleCD>0"
           class="wm_battle_timedown">{{SumTimeMinSec(battleCD,timeNow)}}</div>
      <div class="mt10">
        <el-checkbox v-model="skipBattle"
                     @change="changeSkipBattle">跳过战斗动画</el-checkbox>
      </div>
      <div class="wm_battle_btn_box">
        <el-tooltip class="item"
                    effect="dark"
                    content="匹配与自己竞技点相近的对手。"
                    placement="top"
                    :enterable="false">
          <el-button type="primary"
                     icon="el-icon-search"
                     ref="battleBtnA"
                     @click="battle(false)">匹配对手（普通）</el-button>
        </el-tooltip>
      </div>
      <div class="wm_battle_btn_box">
        <el-tooltip class="item"
                    effect="dark"
                    content="匹配竞技点比自己高一些的对手。"
                    placement="top"
                    :enterable="false">
          <el-button type="primary"
                     icon="el-icon-search"
                     @click="battle(true)"
                     ref="battleBtnB">匹配对手（进阶）</el-button>
        </el-tooltip>
      </div>
      <div class="wm_battle_btn_box">
        <el-tooltip class="item"
                    effect="dark"
                    content="组建自己的对战卡牌。"
                    placement="top"
                    :enterable="false">
          <el-button type="primary"
                     icon="el-icon-star-off"
                     @click="goBattleRoute('/battlecard')">组建我的对战卡牌</el-button>
        </el-tooltip>
      </div>
      <div class="wm_battle_btn_box">
        <el-tooltip class="item"
                    effect="dark"
                    content="升级自己的对战属性。"
                    placement="top"
                    :enterable="false">
          <el-button type="primary"
                     icon="el-icon-star-off"
                     @click="goBattleRoute('/upgradecard')">升级我的对战卡牌</el-button>
        </el-tooltip>
      </div>
    </div>
    <div class="wm_battle_logs_body"
         v-if="chartData.rows.length>0">
      <h5 class="common_title type_shop">生涯统计</h5>
      <div>
        <ve-line :data="chartData"
                 :settings="chartSettings"
                 :extend="extend"
                 :colors="colors"></ve-line>
      </div>
    </div>
    <div class="wm_battle_logs_body"
         v-if="battleLogs.length>0">
      <h5 class="common_title type_shop">对战记录</h5>
      <div class="tc">Tip:对战记录会不定时删除。</div>
      <transition name="el-fade-in-linear">
        <div class="mb20 mt20 tc"
             v-if="logLoading">
          <div class="dib wm_battle_logs_item"
               v-for="(item,index) in battleLogs"
               v-bind:key="index">
            <el-card shadow="always">
              <div class="tc">
                <div class="mb15">{{item.time | capitalize}}</div>
                <div>
                  <el-tooltip class="item"
                              effect="dark"
                              :content="'查看【'+item.data.MyName+'】的对战信息'"
                              placement="top">
                    <div class="dib wm_set_pointer wm_battlelogs_content"
                         @click="watchUserInfo(true,index)">
                      <div class="mb5">
                        <img class="radius5"
                             :src="'/api/gravatar.png?md5='+item.data.MyMD5"
                             width="45"
                             height="45">
                      </div>
                      <div :class="{'cRed':item.data.win==1,'cGreen1A7':item.data.win==0}">{{item.data.win | myWin}}<span v-if="item.data.getScore!=0">({{item.data.getScore | setScore}})</span></div>
                    </div>
                  </el-tooltip>
                  <div class="f24 dib ml10 mr10 wm_battlelogs_content">VS</div>
                  <el-tooltip class="item"
                              effect="dark"
                              :content="'查看【'+item.data.EmName+'】的对战信息'"
                              placement="top">
                    <div class="dib wm_set_pointer wm_battlelogs_content"
                         @click="watchUserInfo(false,index)">
                      <div class="mb5">
                        <img class="radius5"
                             :src="item.data.EmMD5?'/api/gravatar.png?md5='+item.data.EmMD5:'/static/robotTx/'+Number(item.data.EmName.replace(/[^0-9]/ig,''))+'.jpg'"
                             width="45"
                             height="45">
                      </div>
                      <div :class="{'cRed':item.data.win==0,'cGreen1A7':item.data.win==1}">{{item.data.win | emWin}}<span v-if="item.data.EmGetScore!=0">({{item.data.EmGetScore | setScore}})</span></div>
                    </div>
                  </el-tooltip>
                </div>
                <div class="mt15">
                  <el-button type="primary"
                             icon="el-icon-video-play"
                             size="mini"
                             @click="replay(index)">播放回放</el-button>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </transition>
      <div class="tc mb15">
        <el-pagination small
                       layout="prev, pager, next"
                       :total="logTotle"
                       @current-change="logPageChange"
                       :current-page.sync="logPage"
                       :page-size="8"
                       class="my_card_page">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="userBattleLogInfo.name+'的信息'"
               :visible.sync="dialogVisible"
               class="reg_code_dialog"
               :append-to-body="true"
               :lock-scroll="false"
               @closed="closeUserInfoDig"
               width="95%">
      <div class="wm_top_info_more_body"
           v-show="!cardMode">
        <div><img class="wm_top_moreinfo_avatar_pic"
               :src="userBattleLogInfo.MD5?'/api/gravatar.png?md5='+userBattleLogInfo.MD5:'/static/robotTx/'+Number(userBattleLogInfo.name.replace(/[^0-9]/ig,''))+'.jpg'"></div>
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
          <div class="wm_top_moreinfo_box">
            <div class="wm_top_moreinfo_label">卡种：{{userBattleLogInfo.cardIndex}}</div>
          </div>
        </div>
      </div>
      <div class="wm_top_info_more_body clearfix"
           v-show="cardMode">
        <div class="wm_battle_user_card_item wm_set_pointer"
             v-for="(item,index) in userBattleLogInfo.cardArr"
             v-bind:key="index"
             @click="openImg($wikimoecard.url+(userBattleLogInfo.cardInfo[item].packageId||'0')+'/'+item+'.jpg')">
          <img :src="$wikimoecard.url+(userBattleLogInfo.cardInfo[item].packageId||'0')+'/'+item+'.jpg'">
          <div class="f12 mt5">Lv.{{userBattleLogInfo.cardLevel[item]+1}}</div>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="cardMode=!cardMode">{{cardMode?'查看属性':'查看卡牌'}}</el-button>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <menuView></menuView>
  </div>
</template>

<script>
import menuView from '../components/menu.vue';
import { authApi } from "../api";
import userTop from '../components/topUserInfo.vue';
import battle from '../components/battle.vue';
import { PrefixInteger } from "../../utils/utils";
import VeLine from 'v-charts/lib/line.common'

export default {
  data () {
    return {
      counter: null,
      battleCD: 0,
      timeNow: Math.round(new Date().getTime() / 1000),
      cardMode: false,
      txDays: new Date().getDate(),
      dialogVisible: false,
      userBattleLogInfo: {
        name: '',
        MD5: '',
        ADSHP: [0, 0, 0, 0],
        cardIndex: 0,
        cardArr: [],
        cardLevel: [],
        cardInfo: {},
      },
      logLoading: true,
      replayMode: false,
      battleLogs: [],
      logTotle: 0,
      logPage: 1,
      token: sessionStorage.getItem("token") ? sessionStorage.getItem("token") : localStorage.getItem("token"),
      battleData: null,
      battleSence: false,
      myBattleTimes: '--',
      battleOverTimes: '--',
      testWin: [0, 0, 0],
      userbattleinfoData: { win: 0, lose: 0, draw: 0 },
      myScore: '--',
      skipBattle: localStorage.getItem("skipBattle") === 'true',
      extend: {
        'xAxis.0.axisLabel.rotate': 45
      },
      chartSettings: {
        labelMap: {
          'score': '竞技点',
          'win': '胜利',
          'lose': '战败',
          'draw': '平局',
          'pre': '胜率'
        },
      },
      chartData: {
        columns: ['time', 'score', 'win', 'lose', 'draw', 'pre'],
        rows: [
        ]
      },
      colors: ['#FF4C4C', '#BF0B3B', '#238C2A', '#F2B90C', '#1835D9']
    }
  },
  components: {
    menuView,
    userTop,
    battle,
    VeLine
  },
  filters: {
    capitalize (value) {
      var date = new Date(parseInt(value * 1000));
      var tt = [date.getFullYear(), ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1), (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())].join('-') + '  ' + [(date.getHours() < 10 ? '0' + date.getHours() : date.getHours()), (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()), (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())].join(':');
      return tt;
    },
    myWin (v) {
      if (v == 1) {
        return '胜'
      } else if (v == 0) {
        return '负'
      } else {
        return '平'
      }
    },
    emWin (v) {
      if (v == 1) {
        return '负'
      } else if (v == 0) {
        return '胜'
      } else {
        return '平'
      }
    },
    setScore (v) {
      if (v > 0) {
        return '+' + v;
      } else {
        return v;
      }
    }
  },
  mounted () {
    this.$emit('l2dMassage', '这里可以挑战大佬并获取竞技点！同时还可以组建自己的对战卡组和升级自己的卡牌！');
    this.searchBattleInfo();
    this.searchbattlelogs(1);
    // 禁止按钮的回车事件
    this.$refs.battleBtnB.$el.onkeydown = (e) => {
      let _key = window.event.keyCode;
      if (_key === 13) {
        return false;
      }
    }
    this.$refs.battleBtnA.$el.onkeydown = (e) => {
      let _key = window.event.keyCode;
      if (_key === 13) {
        return false;
      }
    }
    //测试胜率
    //   for(let i=0;i<1000;i++){
    //       this.battle(false)
    //   }
  },
  computed: {
    serverDelay () { return this.$store.getters["app/serverDelay"] },
  },
  methods: {
    SumTimeMinSec (battleCD, timeNow) {
      const count = battleCD - timeNow;
      let minutes = '00';
      let seconds = '00'
      if (count <= -1 || this.myBattleTimes >= this.battleOverTimes) {
        return minutes + ':' + seconds;
      }
      seconds = count % 60
      minutes = Math.floor(count / 60)

      if (minutes < 10) {
        minutes = `0${minutes}`
      }
      if (seconds < 10) {
        seconds = `0${seconds}`
      }
      return minutes + ':' + seconds;
    },
    percentageSum (battleCD, timeNow) {
      let timeSum = (1 - ((battleCD - timeNow) / 3600)) * 100;
      if (this.myBattleTimes >= this.battleOverTimes) {
        timeSum = 100;
      } else if (timeSum > 100) {
        timeSum = 100;
      } else if (timeSum < 0) {
        timeSum = 0;
      }
      return timeSum;
    },
    customColorMethod (percentage) {
      if (percentage < 30) {
        return '#909399';
      } else if (percentage < 70) {
        return '#e6a23c';
      } else {
        return '#67c23a';
      }
    },
    closeUserInfoDig () {
      this.cardMode = false;
      this.userBattleLogInfo = {
        name: '',
        MD5: '',
        ADSHP: [0, 0, 0, 0],
        cardIndex: 0,
        cardArr: [],
        cardLevel: [],
        cardInfo: {},
      }
    },
    openImg (imgsrc) {
      this.$alert('<div class="watch_img"><img src="' + imgsrc + '" /></div>', '查看卡牌', {
        dangerouslyUseHTMLString: true,
        lockScroll: false
      });
    },
    PrefixInteger_ (num, length) {
      return PrefixInteger(num, length);
    },
    watchUserInfo (a, index) {
      if (this.battleLogs[index].data.ver !== 3) {
        this.$message.error('该战斗数据版本过旧，无法查看。');
        return false;
      }
      if (a) {
        this.userBattleLogInfo = {
          name: this.battleLogs[index].data.MyName,
          MD5: this.battleLogs[index].data.MyMD5,
          ADSHP: this.battleLogs[index].data.MyADSHP,
          cardIndex: this.battleLogs[index].data.MyCardIndexCount,
          cardArr: this.battleLogs[index].data.MyBattleCard,
          cardLevel: this.battleLogs[index].data.myCardLevel || {},
          cardInfo: this.battleLogs[index].data.cardOtherData || {},
        }
      } else {
        this.userBattleLogInfo = {
          name: this.battleLogs[index].data.EmName,
          MD5: this.battleLogs[index].data.EmMD5,
          ADSHP: this.battleLogs[index].data.EmADSHP,
          cardIndex: this.battleLogs[index].data.EmCardIndexCount,
          cardArr: this.battleLogs[index].data.EmBattleCard,
          cardLevel: this.battleLogs[index].data.emCardLevel || {},
          cardInfo: this.battleLogs[index].data.cardOtherData || {},
        }
      }
      this.dialogVisible = true;
    },
    replay (index) {
      if (this.replayMode) {
        return false;
      }
      if (this.battleLogs[index].data.ver !== 3) {
        this.$message.error('该回放版本过旧，无法回放。');
        return false;
      }
      this.battleData = this.battleLogs[index].data;
      this.battleSence = true;
      this.replayMode = true;
    },
    searchbattlelogs (page) {
      let params = {
        token: this.token,
        page: page
      }
      authApi.searchbattlelogs(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.logLoading = false;
          this.battleLogs = res.data.data;
          this.logTotle = res.data.total;
          setTimeout(() => {
            this.logLoading = true;
          }, 200)
        }
      });
    },
    logPageChange () {
      this.searchbattlelogs(this.logPage);
    },
    changeSkipBattle (val) {
      localStorage.setItem("skipBattle", val);
    },
    countdown () {
      this.counter = setInterval(() => {
        this.timeNow = Math.round((new Date().getTime() + this.serverDelay) / 1000);
        if (this.timeNow >= this.battleCD) {
          if (this.myBattleTimes >= this.battleOverTimes) {
            clearInterval(this.counter);
          } else {
            this.myBattleTimes++;
            this.battleCD = this.battleCD + 3600;
          }
        }
      }, 1000)
    },
    searchBattleInfo () {
      let params = {
        token: this.token
      }
      authApi.searchbattleinfo(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.myBattleTimes = res.data.myBattleTimes;
          this.battleOverTimes = res.data.battleOverTimes;
          this.myScore = res.data.score;
          this.battleCD = res.data.dailyBattleTime + 3600;
          this.timeNow = Math.round((new Date().getTime() + this.serverDelay) / 1000);
          clearInterval(this.counter);
          // 开始倒计时
          if (this.myBattleTimes < this.battleOverTimes) {
            this.countdown();
          }
          if (res.data.userbattleinfoData) {
            this.userbattleinfoData = res.data.userbattleinfoData;
            const battleScoreHistory = res.data.userbattleinfoData.battleScoreHistory;
            let preTime = 0;
            let timeCount = 1;
            this.chartData['rows'] = [];
            for (let i = 0; i < battleScoreHistory.length; i++) {
              const timeMonth = battleScoreHistory[i].time;
              const time = new Date(parseInt(timeMonth * 86400000));
              let timeStr = time.getFullYear() + '年' + (time.getMonth() + 1) + '月' + (time.getDate()) + '日'
              if (preTime === time.getMonth()) {
                timeCount++;
                timeStr = timeStr + '第' + timeCount + '轮'
              } else {
                timeCount = 1;
              }
              preTime = time.getMonth();
              let battleWinPre = (battleScoreHistory[i].win || 0) + (battleScoreHistory[i].lose || 0) + (battleScoreHistory[i].draw || 0);
              if (battleWinPre > 0) {
                battleWinPre = battleScoreHistory[i].win / battleWinPre;
              }
              const hisData = {
                time: timeStr,
                score: battleScoreHistory[i].score,
                win: battleScoreHistory[i].win || '-',
                lose: battleScoreHistory[i].lose || '-',
                draw: battleScoreHistory[i].draw || '-',
                pre: battleWinPre || '-',
              }
              this.chartData['rows'].push(hisData);
            }
            // this.chartData['rows'] = res.data.userbattleinfoData.battleScoreHistory;
          }
        }
      });
    },
    goBattleRoute (path) {
      this.$router.push({
        path: path
      });
    },
    gameover () {
      this.battleSence = false;
      if (this.replayMode) {
        this.battleData = null;
        this.replayMode = false;
        return false;
      }
      if (!this.battleData.battleOverChance) {
        this.searchbattlelogs(1);
        this.$refs.userTop.getUserInfo();
        this.searchBattleInfo();
      }
      if (this.battleData.battleGetStar > 0) {
        this.$notify.info({
          title: '恭喜获胜！',
          duration: 10000,
          dangerouslyUseHTMLString: true,
          message: '获得了<span class="cOrange">' + this.battleData.battleGetStar + '</span>颗星星！'
        });
      }
    },
    winCheck (w) {
      if (w == 1) {
        return '战胜了'
      } else if (w == 0) {
        return '败给了'
      } else {
        return '打平了'
      }
    },
    battle (advanced) {
      if (this.battleSence) {
        return false;
      }
      let params = {
        token: this.token,
        advanced: advanced,
      }
      authApi.battle(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          if (res.data.levelUpStar > 0) {
            this.$notify.info({
              dangerouslyUseHTMLString: true,
              title: '升级啦！',
              message: '恭喜您升级啦，作为奖励获得<span class="cOrange">' + res.data.levelUpStar + '</span>颗星星！',
              duration: 3000,
              customClass: 'wm_battle_notify'
            });
            this.$refs.userTop.getUserInfo();
          }
          this.battleData = res.data;
          if (this.skipBattle) {
            let battleText = '您' + this.winCheck(this.battleData.win) + this.battleData.EmName + '，' + '获得了' + Math.abs(this.battleData.getScore) + '点竞技点和' + this.battleData.getExp + '点经验值。';
            if (this.battleData.win === 0) {
              battleText = '您' + this.winCheck(this.battleData.win) + this.battleData.EmName + '，' + '失去了' + Math.abs(this.battleData.getScore) + '点竞技点。';
            }
            this.$alert(battleText + (this.battleData.battleOverChance ? '（由于已经没有对战机会了，此次战斗不结算竞技点和经验值。）' : ''), '战斗结果', { lockScroll: false }).then(() => {
              this.gameover();
            }).catch(action => {
              this.gameover();
            });
          } else {
            this.battleSence = true;
          }
          //测试胜率
          // let testWin = [0,0,0]
          // this.testWin[res.data.win]++;
          // console.log(this.testWin);
        }
      });
    }
  },
  beforeDestroy () {
    clearInterval(this.counter)
  }
}
</script>

<style scoped>
.wm_battle_btn_body {
  text-align: center;
  padding: 35px 0;
}
.wm_battle_today_v {
  padding: 10px 0;
  font-size: 16px;
}
.wm_battle_btn_box {
  margin: 20px 0;
}
.wm_battle_ueseinfo_body {
  max-width: 400px;
  margin: 0 auto;
}
.wm_battle_logs_item {
  margin: 10px;
  width: 220px;
}
.wm_battle_user_card_item {
  width: 20%;
  float: left;
  padding: 5px;
  box-sizing: border-box;
}
.wm_battle_user_card_item img {
  width: 100%;
  height: auto;
}
.wm_battle_usercard_no_fight {
  opacity: 0.4;
}
.wm_user_info_table.type_battle td,
.wm_user_info_table.type_battle th {
  width: 25%;
}
.wm_battle_cd_body {
  width: 130px;
  margin: -5px auto 3px auto;
}
.wm_battle_timedown {
  font-size: 10px;
}
@media (max-width: 768px) {
  .wm_battlelogs_content {
    display: block;
  }
  .wm_battle_logs_item {
    width: 150px;
  }
}
@media (max-width: 370px) {
  .wm_battlelogs_content {
    display: inline-block;
  }
  .wm_battle_logs_item {
    width: 100%;
    margin: 0 0 10px 0;
  }
}
</style>
