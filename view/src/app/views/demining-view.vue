<template>
<div>
  <userTop ref="userTop" />
  <div class="common_body">
    <h5 class="common_title type_demining">
      <el-tooltip placement="bottom">
        <div slot="content">
          <div v-if="!mineInfo">
            <div class="wm_demining_hight_item_list_body tc">数据加载中...</div>
          </div>
          <div v-else>
            <div class="f14 tc">本矿场高产出宝石</div>
            <div class="mt10 tc wm_demining_hight_item_list_body">
              <img v-for="(item,index) in mapData_[mineInfo.data.mapType].high" v-bind:key="index" :src="'/static/otherImg/item/'+item+'.png'" width="24px" height="24px" class="wm_demining_hight_item_list_img" />
            </div>
          </div>
        </div>
        <span class="wm_set_pointer">星星矿场</span>
      </el-tooltip>
    </h5>
    <h6 class="common_title_tips type_dec type_demining">当前在线:{{onlineUser}}人</h6>
    <div class="wm_card_demining_tool_body" v-if="userData">
      <div @click="selPickChange(0)"><pickaxe :type="0" :sel="selPick" :timeNow="userData.timeNow" :timeEnd="Number(userData.deminingStamp[0])" ref="pick0"></pickaxe></div>
      <div @click="selPickChange(1)"><pickaxe :type="1" :sel="selPick" :timeNow="userData.timeNow" :timeEnd="Number(userData.deminingStamp[1])" ref="pick1"></pickaxe></div>
      <div @click="selPickChange(2)"><pickaxe :type="2" :sel="selPick" :timeNow="userData.timeNow" :timeEnd="Number(userData.deminingStamp[2])" ref="pick2"></pickaxe></div>
    </div>
    <div class="wm_card_demining_table_box">
      <div v-if="!mineInfo" class="wm_card_demining_table_loading">
        矿场数据加载中...如果长时间无反应请刷新。
      </div>
      <table class="wm_card_demining_table">
        <tbody>
          <tr v-for="(item,index) in mineMap" v-bind:key="index">
            <td v-for="(items,indexs) in item" v-bind:key="indexs">
              <div class="wm_demining_item" :class="deminingItemClass(items.num,indexs,index)" @click="openNode(indexs,index,items.num)" :style="'background-image:url(/static/otherImg/demining/bg'+mineInfo.data.mapType+'.png)'">
                <el-tooltip class="item" effect="dark" :content="items.num==9?'这里是一片星星矿':'探测器显示周围有'+items.num+'片星星矿！'" placement="top" v-if="items.num>=0" :enterable="false">
                  <div>
                    <span>{{items.num==9?'★':items.num}}</span>
                    <img class="wm_demining_img" :src="'https://gravatar.loli.net/avatar/'+items.md5+'?s=100&amp;d=mm&amp;r=g&amp;d=robohash&days='+txDays" width="50" height="50">
                  </div>
                </el-tooltip>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <menuView></menuView>
  </div>
  <captcha @captchaShow="captchaDigShow" @send="sendCaptcha" :codeDigShow="captchaShow" v-if="captchaShow" ref="captch"></captcha>
</div>
</template>

<script>
import io from 'socket.io-client';
import {showLoading,hideLoading} from "../../utils/utils";
import menuView from '../components/menu.vue';
import pickaxe from '../components/pickaxe.vue';
import userTop from '../components/topUserInfo.vue';
import captcha from '../components/captcha.vue';
import itemData from '../../../../server/data/item';
import mapData from '../../../../server/data/deminingMap';
import {authApi} from "../api";

export default {
  data() {
    return {
      openCache:{
        x:null,
        y:null,
        num:null
      },
      captchaShow:false,
      itemData_:itemData,
      mapData_:mapData,
      txDays:new Date().getDate(),
      backFlag:false,
      socket:null,
      mineMap:[],
      mineInfo:null,
      selBlock:null,
      token:sessionStorage.getItem("token")?sessionStorage.getItem("token"):localStorage.getItem("token"),
      userData:null,
      openTime:null,
      selPick:0,
      loading:false,
      onlineUser:0,
      nextPickFlag:true
    }
  },
  components: {
    menuView,
    pickaxe,
    userTop,
    captcha
  },
  mounted() {
    this.$emit('l2dMassage','这里挖到游戏的通货【星星】和升级卡牌所需要的材料。显示的数字暗示周围的星星数量。请注意每种镐的产出不一样哦！');
    let socketurl = window.location.hostname;
    let port = window.location.port;
    this.socket = io.connect('//'+socketurl+':'+port);
    // this.socket = io.connect('//'+socketurl+':3000');
    this.socket.on('userCount',(data)=>{
      this.onlineUser = data.userCount;
    });
    this.socket.on('demining',(data)=>{
      // this.socket.emit('demining',{time:new Date()});
      console.log(data);
      if(this.openTime===data.time){
        if(this.loading){
          hideLoading();
          this.loading = false;
        }
        this.openTime = null;
      }
      if(data.code==1){//一般性错误提示
        this.$message.error(data.msg);
      }else if(data.code==0){//获取地图
        this.mineInfo = data;
        this.creatMap(data.data)
      }else if(data.code==2){//挖到星星
        this.upDateMapData(data.x,data.y,data.md5,data.demNum);
        if(data.levelUpStar>0){
          this.$notify.info({
            title: '升级啦！',
            message: '恭喜您升级啦，作为奖励获得'+data.levelUpStar+'颗星星！',
            duration:13000
          });
        }
        this.$message({
          dangerouslyUseHTMLString: true,
          showClose: true,
          duration:10000,
          message: '恭喜您挖到了<span class="cOrange">'+data.star+'</span>颗星星！',
          type: 'success'
        });
        this.$refs.userTop.getUserInfo();
      }else if(data.code==301){//需要验证码
        this.captchaShow = true;
      }else if(data.code==201){//未挖到星星
        this.upDateMapData(data.x,data.y,data.md5,data.demNum)
        if(data.levelUpStar>0){
          this.$notify.info({
            title: '升级啦！',
            message: '恭喜您升级啦，作为奖励获得'+data.levelUpStar+'颗星星！',
            duration:13000
          });
          this.$refs.userTop.getUserInfo();
        }
        this.$message({
          dangerouslyUseHTMLString: true,
          showClose: true,
          duration:10000,
          message:'您挖到了<span class="cOrange">'+itemData[data.getItem].name+'×'+data.getItemNum+'</span>，同时探测器显示周围有<span class="cOrange">'+data.demNum+'</span>片星星矿！',
          type: 'success'
        });
      }else if(data.code==4){//您选择的工具还在制作中！
        this.$message(data.msg);
      }else if(data.code==3){//用户信息
        this.userData = data.userData;
        //自动选择可以使用的稿
        setTimeout(()=>{
          if(this.nextPickFlag){
            for(let i=0;i<3;i++){
              let refEl = this.$refs['pick'+i]
              console.log(this.$refs);
              if(refEl.min=='00'&&refEl.sec=='00'){
                this.selPick = i;
                break;
              }
            }
            this.nextPickFlag = false;
          }
        },50);
      }else if(data.code==5){//别人挖矿
      console.log('别人挖矿');
        this.upDateMapData(data.x,data.y,data.md5,data.demNum)
      }
      else if(data.code==403){//账号验证错误
        sessionStorage.removeItem("token");
        localStorage.removeItem("token");
        this.$alert(data.msg, '提示', {
          confirmButtonText: '确定',
          showClose:false,
          callback: action => {
            this.$router.push({ path:'/'});
          }
        });
      }

    });
    this.socket.on('connect', () => {
      if(this.loading){
        hideLoading();
        this.loading = false;
      }
      this.$message({
        message: '已连接服务器！',
        type: 'success',
        showClose: true,
      });
      let parmas = {
        type:'get',
        token:this.token
      }
      this.socket.emit('demining',parmas);
    });
    this.socket.on('disconnect', () => {
      if(!this.backFlag){
        this.$message.error('服务器连接已断开！');
      }
    });
  },
  methods: {
    captchaDigShow(v){
      this.captchaShow = v;
    },
    sendCaptcha(captcha){
      const params = {
        token:this.token,
        captcha:captcha
      }
      authApi.robotcheck(params).then(res => {
          console.log(res.data);
          this.$refs.captch.captchaUpdata();
          if(res.data.code==0){
            this.$message.error(res.data.msg);
          }else if(res.data.code==1){
            this.captchaShow = false;
            this.openNode(this.openCache.x,this.openCache.y,this.openCache.num,true)
            if(res.data.getStar>0){
              this.$notify({
                type: 'success',
                title: '恭喜',
                message: '通过验证，获得'+res.data.getStar+'颗星星！',
                duration:13000
              });
              this.$refs.userTop.getUserInfo();
            }else{
              this.$notify({
                type: 'success',
                title: '恭喜',
                message: res.data.msg,
                duration:13000
              });
            }

          }
      });
    },
    upDateMapData(x,y,md5,num){
      console.log('更新');
      this.mineMap[y][x] = {
        md5:md5,
        num:num,
      };
      this.$forceUpdate()
    },
    selPickChange(n){
      this.selPick = n;
    },
    deminingItemClass(num,indexs,index){
      var c = '';
      var x_y = indexs+'_'+index;
      if(num>=0){
        c = 'type_is_opened';
        if(num==9){
          c = c+' is_wmdmstar'
        }
      }else{
        if(x_y==this.selBlock){
          c = 'selected';
        }
      }
      return c;
    },
    openNode(x,y,num,openNow){
      if(num>=0){
        return false;
      }
      this.openCache = {
        x:x,
        y:y,
        num:num
      }
      let x_y = x+'_'+y;
      this.openTime = new Date().getTime();
      if(x_y == this.selBlock || openNow){
          let parmas = {
          type:'open',
          creatTime:this.mineInfo.data.creatTime,
          x:x,
          y:y,
          token:this.token,
          tool:this.selPick,
          time:this.openTime
        }
        showLoading();
        this.loading = true;
        this.nextPickFlag = true;
        this.socket.emit('demining',parmas);
        this.selBlock = null;
      }else{
        this.selBlock = x_y;
      }

    },
    creatMapInitData(i,j){
      this.mineMap[i][j] = {
        md5:null,
        num:-1,
      };
    },
    creatMap(data){
      this.mineMap = [];
      for(let i=0;i<data.rows;i++){
        this.mineMap[i] = [];
        for(let j=0;j<data.cols;j++){
          if(data.player){
            let playerData = data.player[i+'_'+j];
            if(playerData){
              this.mineMap[i][j] = playerData;
            }else{
              this.creatMapInitData(i,j);
            }
          }else{
            this.creatMapInitData(i,j);
          }
        }
      }
      this.$forceUpdate();
      console.log(this.mineMap);
    }
  },
  beforeDestroy(){
    this.backFlag = true;
    this.socket.close();
  }
}
</script>

<style scoped>
.common_title_tips.type_demining{
    padding-bottom: 5px;
    margin-top: -10px;
}
.wm_demining_hight_item_list_body{
  width:150px;
}
.wm_demining_hight_item_list_img{
  margin: 2px;
}
</style>
