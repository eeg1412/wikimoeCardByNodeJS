<template>
<div>
  <userTop ref="userTop" />
  <div class="common_body">
    <h5 class="common_title type_demining">星星矿场</h5>
    <div class="wm_card_demining_tool_body" v-if="userData">
      <div @click="selPickChange(0)"><pickaxe :type="0" :sel="selPick" :timeNow="userData.timeNow" :timeEnd="Number(userData.deminingStamp[0])"></pickaxe></div>
      <div @click="selPickChange(1)"><pickaxe :type="1" :sel="selPick" :timeNow="userData.timeNow" :timeEnd="Number(userData.deminingStamp[1])"></pickaxe></div>
      <div @click="selPickChange(2)"><pickaxe :type="2" :sel="selPick" :timeNow="userData.timeNow" :timeEnd="Number(userData.deminingStamp[2])"></pickaxe></div>
    </div>
    <div class="wm_card_demining_table_box">
      <div v-if="!mineInfo" class="wm_card_demining_table_loading">
        矿场数据加载中...
      </div>
      <table class="wm_card_demining_table">
        <tbody>
          <tr v-for="(item,index) in mineMap" v-bind:key="index">
            <td v-for="(items,indexs) in item" v-bind:key="indexs">
              <div class="wm_demining_item" :class="deminingItemClass(items.num,indexs,index)" @click="openNode(indexs,index,items.num)" :style="'background-image:url(/static/otherImg/demining/bg'+mineInfo.data.mapType+'.png)'">
                <el-tooltip class="item" effect="dark" :content="items.num==9?'这里是一片星星矿':'探测器显示周围有'+items.num+'片星星矿！'" placement="top" v-if="items.num>=0" :enterable="false">
                  <div>
                    <span>{{items.num==9?'★':items.num}}</span>
                    <img class="wm_demining_img" :src="'https://cdn.v2ex.com/gravatar/'+items.md5+'?s=100&amp;d=mm&amp;r=g&amp;d=robohash'" width="50" height="50">
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
</div>
</template>

<script>
import io from 'socket.io-client';
import {showLoading,hideLoading} from "../../utils/utils";
import menuView from '../components/menu.vue';
import pickaxe from '../components/pickaxe.vue';
import userTop from '../components/topUserInfo.vue';

export default {
  data() {
    return {
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
    }
  },
  components: {
    menuView,
    pickaxe,
    userTop
  },
  mounted() {
    let socketurl = window.location.hostname;
    let port = window.location.port;
    this.socket = io.connect('//'+socketurl+':'+port);
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
        this.upDateMapData(data.x,data.y,data.md5,data.demNum)
        this.$message({
          message: '恭喜您挖到了'+data.star+'颗星星！',
          type: 'success'
        });
        this.$refs.userTop.getUserInfo();
      }else if(data.code==201){//未挖到星星
        this.upDateMapData(data.x,data.y,data.md5,data.demNum)
        this.$message('很可惜并没有挖到星星，探测器显示周围有'+data.demNum+'片星星矿！');
      }else if(data.code==4){//您选择的工具还在制作中！
        this.$message(data.msg);
      }else if(data.code==3){//用户信息
        this.userData = data.userData;
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
        type: 'success'
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
    openNode(x,y,num){
      if(num>=0){
        return false;
      }
      let x_y = x+'_'+y;
      this.openTime = new Date().getTime();
      if(x_y == this.selBlock){
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
      console.log(this.mineMap);
    }
  },
  beforeDestroy(){
    this.backFlag = true;
    this.socket.close();
  }
}
</script>

<style lang="stylus" scoped>
</style>
