<template>
  <div class="common_body">
    <userTop ref="userTop" />
    <h5 class="common_title type_shop">任务</h5>
    <div class="tc wm_set_pointer" @click="help">Tip:统计类任务只有接受后才会开始计数！<i class="el-icon-collection"></i></div>
    <div class="wm_quest_list_body mt20">
      <el-row :gutter="20">
        <transition-group name="list-complete" tag="div">
        <el-col :span="12" :xs="24" v-for="item in list" v-bind:key="item._id" class="mb10 list-complete-item">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span class="f15">{{item.title}}</span>
            </div>
            <div class="tc mb15">
              <p class="mb10">奖励:</p>
              <div>
                <div class="dib ml10 mr10" v-for="(items,indexs) in item.gift" v-bind:key="indexs">
                  <div v-if="items.type==='item'">
                    <div class="mb5">
                      <img :src="'/static/otherImg/item/'+items.itemId+'.png'" class="wm_quest_gift_ico" />
                    </div>
                    <div>{{itemData_[items.itemId].name}}×{{items.number}}</div>
                  </div>
                  <div v-if="items.type==='star'">
                    <div class="mb5">
                      <img :src="'/static/otherImg/item/star.png'" class="wm_quest_gift_ico" />
                    </div>
                    <div>星星×{{items.number}}</div>
                  </div>
                  <div v-if="items.type==='battle'">
                    <div class="mb5">
                      <img :src="'/static/otherImg/item/battle.png'" class="wm_quest_gift_ico" />
                    </div>
                    <div>对战次数+{{items.number}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div class="wm_quest_text">{{item.text}}</div>
              <div class="wm_quest_should_list">
                <div v-if="item.class==='cardToItem' || item.class==='cardToBattle'">
                  <div v-for="(items,indexs) in item.should" v-bind:key="indexs" class="dib ml5 mr5 tc wm_set_pointer wm_quest_cardlist" @click="openCardInfo(items.card)">
                    <div class="wm_quest_battlecard" v-if="battleCard.indexOf(items.card.cardId)!==-1">战</div>
                    <img class="wm_quest_should_card" :src="$wikimoecard.url+items.card.packageId+'/'+items.card.cardId+'.jpg'" />
                    <div><span :class="{'cRed':card[items.card.cardId]===0,'cOrange':(card[items.card.cardId]-1<items.number&&card[items.card.cardId]!==0),'cGreen1A7':card[items.card.cardId]-1>=items.number}">{{card[items.card.cardId] | cardCount}}</span>/{{items.number}}</div>
                  </div>
                </div>
                <div v-else>
                  <div v-if="item.lock">
                    <div v-if="item.class==='dataGuessCard'">
                      <div class="tc mb10">{{Number(gc) -(item.mark)}}/{{item.should[0].number}}</div>
                      <el-progress :text-inside="true" :stroke-width="26" :percentage="setGcP(item)"></el-progress>
                    </div>
                    <div v-else>
                      <div class="tc mb10">{{Number(dem) -(item.mark)}}/{{item.should[0].number}}</div>
                      <el-progress :text-inside="true" :stroke-width="26" :percentage="setDemP(item)"></el-progress>
                    </div>
                  </div>
                  <div v-else>
                    <div class="tc mb10">0/{{item.should[0].number}}</div>
                    <el-progress :text-inside="true" :stroke-width="26" :percentage="0"></el-progress>
                  </div>
                </div>
              </div>
            </div>
            <div class="clearfix wm_quest_bottom">
              <div class="fl wm_quest_time">
                <span v-if="!item.lock">过期:{{item.expired | capitalize}}</span>
                <span v-else>已接受，任务不会过期。</span>
              </div>
              <div class="fr">
                <el-button size="mini" type="info" @click="changeQuest(item._id)">{{item.lock?"放弃":"更换"}}</el-button><el-button size="mini" type="primary" @click="acceptQuest(item._id)" v-if="!item.lock" plain>接受</el-button><el-button size="mini" type="primary" @click="complete(item._id)" v-else>完成</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
        </transition-group>
      </el-row>
      <div class="mb20">
        <el-card shadow="hover">
          <div v-if="shouldQuest>0">
            <div class="tc mb10">完成{{shouldQuest}}次任务可以获得额外奖励哦！</div>
            <el-progress :text-inside="true" :stroke-width="26" :percentage="questProgress"></el-progress>
          </div>
          <div v-else>
            <div class="tc mb10">领取任务奖励！</div>
            <el-button type="primary" size="small" class="w_10" round @click="treasure">领取奖励</el-button>
          </div>
        </el-card>
      </div>
    </div>
    <menuView></menuView>
    <cardInfoDialog @cardInfoShow="cardInfoDiaShow" :cardInfoDigShow="cardInfoShow" :cardData="cardData" @buyNewCard="updateMyCard" @updateUserinfo="updateUserinfo"></cardInfoDialog>
  </div>
</template>

<script>
import {scrollToTop,PrefixInteger,loadingImg,showLoading,hideLoading} from "../../utils/utils";
import menuView from '../components/menu.vue';
import {authApi} from "../api";
import userTop from '../components/topUserInfo.vue';
import cardInfoDialog from "../components/cardInfo"
import itemData from '../../../../server/data/item';

export default {
  data() {
    return {
      cardData:null,
      cardInfoShow:false,
      token:sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token"),
      list:[],
      card:{},
      questCount:0,
      questTreasure:0,
      dem:"0",
      battleCard:[],
      gc:"0",
      itemData_:itemData,
    }
  },
  components: {
    menuView,
    userTop,
    cardInfoDialog
  },
  computed: {
    shouldQuest () {
      let q = (this.questTreasure+1)*30 - this.questCount;
      if(q<0){
        q = 0;
      }
      return q;
    },
    questProgress () {
      let q1 = 30 - ((this.questTreasure+1)*30 - this.questCount);
      let q = Math.floor(q1/30*100);
      console.log(q1+'test');
      if(q>100){
        q = 100;
      }
      return q;
    }
  },
  filters: {
    capitalize(value) {
        var date = new Date(parseInt(value*1000));
        var tt = [date.getFullYear(), ((date.getMonth()+1)<10?'0'+(date.getMonth()+1):date.getMonth()+1), (date.getDate()<10?'0'+date.getDate():date.getDate())].join('-') + '  ' +[(date.getHours()<10?'0'+date.getHours():date.getHours()), (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()), (date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds())].join(':');
        return tt;
      },
    cardCount(c){
      let cc = c;
      cc = cc - 1;
      if(cc<0){
        cc = '无';
      }
      if(cc>99){
        cc = '99+';
      }
      return cc;
    }
  },
  mounted() {
    this.$emit('l2dMassage','这里可以通过完成任务获取丰厚奖励哦!');
    this.goQuest();
  },
  methods: {
    treasure(){
      let params = {
          type:'treasure',
          token:this.token
      }
      authApi.quest(params).then(res => {
          console.log(res);
          if(res.data.code===1){
            this.questCount = Number(res.data.questCount);
            this.questTreasure = Number(res.data.questTreasure);
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
          }else if(res.data.code===0){
            this.$message.error(res.data.msg);
          }
      });
    },
    help(){
      this.$alert(`
        统计类任务只有接受后才会开始计数。<br />
        放弃任务将会消费150颗星星。<br />
        任务过期后将会刷新出新的任务来替代过期任务。<br />
        接受任务后任务会被锁定将不会过期。<br />
      `, {
        dangerouslyUseHTMLString: true,
        lockScroll:false
      });
    },
    setDemP(item){
      let p = (Number(this.dem) -Number(item.mark))/item.should[0].number*100;
      p = Math.floor(p);
      if(p>100){
        p=100
      }
      return p;
    },
    setGcP(item){
      let p = (Number(this.gc) -Number(item.mark))/item.should[0].number*100;
      p = Math.floor(p);
      if(p>100){
        p=100
      }
      return p;
    },
    openCardInfo(data_){
      this.cardData = data_;
      this.cardData["have"] = this.card[data_.cardId];
      this.cardInfoShow = true;
    },
    updateUserinfo(){
        this.$refs.userTop.getUserInfo();
    },
    updateMyCard(){
      this.goQuest();
    },
    cardInfoDiaShow(v){
        this.cardInfoShow = v;
    },
    complete(id){
        let params = {
            id:id,
            type:'complete',
            token:this.token
        }
        authApi.quest(params).then(res => {
            console.log(res);
            if(res.data.code===1){
              this.list = res.data.list;
              this.card = res.data.card;
              this.gc = res.data.gc;
              this.dem = res.data.dem;
              this.questCount = Number(res.data.questCount);
              this.questTreasure = Number(res.data.questTreasure);
              this.battleCard = res.data.battleCard;
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              this.updateUserinfo();
            }else if(res.data.code===0){
              this.$message.error(res.data.msg);
            }
        });
    },
    changeQuest(id){
      this.$confirm('确定要放弃或更换任务吗？将会花费150颗星星！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll:false,
        type: 'warning'
      }).then(() => {
        let params = {
            id:id,
            type:'change',
            token:this.token
        }
        authApi.quest(params).then(res => {
            console.log(res);
            if(res.data.code===1){
              this.list = res.data.list;
              this.card = res.data.card;
              this.gc = res.data.gc;
              this.dem = res.data.dem;
              this.questCount = Number(res.data.questCount);
              this.questTreasure = Number(res.data.questTreasure);
              this.battleCard = res.data.battleCard;
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              this.updateUserinfo();
            }else if(res.data.code===0){
              this.$message.error(res.data.msg);
            }
        });
      }).catch(() => {
                
      });
    },
    acceptQuest(id){
      this.$confirm('确定要接受任务吗？接受后任务将不会过期，但是只能通过放弃任务（消费150星星）来更换任务！另外统计类任务只能通过接受任务才会开始计数！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll:false,
        type: 'warning'
      }).then(() => {
        let params = {
            id:id,
            type:'accept',
            token:this.token
        }
        authApi.quest(params).then(res => {
            console.log(res);
            if(res.data.code===1){
              this.list = res.data.list;
              this.card = res.data.card;
              this.gc = res.data.gc;
              this.dem = res.data.dem;
              this.questCount = Number(res.data.questCount);
              this.questTreasure = Number(res.data.questTreasure);
              this.battleCard = res.data.battleCard;
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
            }else if(res.data.code===0){
              this.$message.error(res.data.msg);
            }
        });
      }).catch(() => {
                
      });
    },
    goQuest(){
        let params = {
            type:'search',
            token:this.token
        }
        authApi.quest(params).then(res => {
            console.log(res);
            if(res.data.code===1){
              this.list = res.data.list;
              this.card = res.data.card;
              this.gc = res.data.gc;
              this.dem = res.data.dem;
              this.questCount = Number(res.data.questCount);
              this.questTreasure = Number(res.data.questTreasure);
              this.battleCard = res.data.battleCard;
            }else if(res.data.code===0){
              this.$message.error(res.data.msg);
            }
        });
    },
  },
}
</script>

<style scoped>
.wm_quest_title{
  border-bottom: 1px solid #cecece;
}
.wm_quest_gift_ico{
  padding: 5px;
  border-radius: 5px;
  border:1px solid #cecece;
  height: 32px;
  height: 32px;
}
.wm_quest_text{
  padding: 15px 0;
  border-top: 1px dashed #cecece;
}
.wm_quest_should_list{
  min-height: 75px;
}
.wm_quest_should_card{
  height: 55px;
  width: auto;
}
.wm_quest_bottom{
  border-top: 1px dashed #cecece;
  padding-top: 15px;
  margin-top: 15px;
}
.wm_quest_time{
  font-size: 13px;
  padding-top: 6px;
}
.list-complete-item {
  transition: all 1s;
}
.list-complete-enter, .list-complete-leave-to{
  opacity: 0;
}
.list-complete-leave-active {
  position: absolute;
  bottom: 0;
  right: 0;
}
.wm_quest_list_body{
  position: relative;
  z-index: 1;
}
.wm_quest_cardlist{
  position: relative;
  z-index: 1;
}
.wm_quest_battlecard {
    position: absolute;
    font-size: 12px;
    line-height: 12px;
    padding: 3px;
    background: rgba(255, 76, 76, 0.75);
    color: #fff;
    top: 34px;
    left: 2px;
    z-index: 1;
    border-radius: 3px;
}
</style>
