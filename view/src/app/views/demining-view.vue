<template>
<div>
  <div class="common_body">
    <div v-if="userData">
      <div class="wm_card_chiose_title">
        <img class="wm_title_info_avatar_pic" :src="'https://cdn.v2ex.com/gravatar/'+userData.md5+'?s=100&amp;d=mm&amp;r=g&amp;d=robohash'" width="45" height="45">
        <br>
        <span class="wm_card_demining_star">{{userData.nickName}}的星星:{{userData.star}}</span>
        <div class="wm_card_demining_per_body">
          <div class="wm_card_demining_time_body"><span>冷却:</span><span class="wm_card_demining_time_num">{{min}}</span><span>分</span><span class="wm_card_demining_time_num">{{sec}}</span><span>秒</span></div>
        </div>
      </div>
    </div>
    <div class="wm_card_demining_table_box">
      <table class="wm_card_demining_table">
        <tbody>
          <tr v-for="(item,index) in mineMap" v-bind:key="index">
            <td v-for="(items,indexs) in item" v-bind:key="indexs">
              <div class="wm_demining_item" :class="deminingItemClass(items.num,indexs,index)" @click="openNode(indexs,index,items.num)">
                <div v-if="items.num>=0">
                  <span>{{items.num==9?'★':items.num}}</span>
                  <img class="wm_demining_img" :src="'https://cdn.v2ex.com/gravatar/'+items.md5+'?s=100&amp;d=mm&amp;r=g&amp;d=robohash'" width="50" height="50">
                </div>
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
import menuView from '../components/menu.vue';

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
      min:'--',
      sec:'--',
      counter:null
    }
  },
  components: {
    menuView
  },
  mounted() {
    let socketurl = window.location.hostname;
    this.socket = io.connect('//'+socketurl+':3000');
    this.socket.on('demining',(data)=>{
      // this.socket.emit('demining',{time:new Date()});
      console.log(data);
      if(data.code==1){//一般性错误提示
        this.$message.error(data.msg);
      }else if(data.code==0){//获取地图
        this.mineInfo = data;
        this.creatMap(data.data)
      }else if(data.code==2){//挖到星星
        this.$message({
          message: '恭喜您挖到了'+data.star+'颗星星！',
          type: 'success'
        });
      }else if(data.code==4){
        this.$message('挖矿尚在冷却中！还剩'+data.nextTime+'秒');
      }else if(data.code==3){
        console.log(123);
        this.userData = data.userData;
        clearInterval(this.counter)
        this.countdown();
      }else if(data.code==403){//账号验证错误
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
    countdown() {
      let nextTimeSec = Math.round(new Date().getTime() / 1000)+this.userData.nextTime;
      this.counter = setInterval(() => {
        let count =  nextTimeSec - Math.round(new Date().getTime() / 1000)
        if (count <= -1) {
          this.min = '00'
          this.sec = '00'
          clearInterval(this.counter)
          return
        }

        let seconds = count % 60
        let minutes = Math.floor(count / 60)
        let hours = Math.floor(minutes / 60)
        minutes %= 60
        hours %= 60

        if (minutes < 10) {
          minutes = `0${minutes}`
        }

        if (hours < 10) {
          hours = `0${hours}`
        }

        if (seconds < 10) {
          seconds = `0${seconds}`
        }
        this.min = minutes
        this.sec = seconds
      }, 1000)
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
      if(x_y == this.selBlock){
          let parmas = {
          type:'open',
          creatTime:this.mineInfo.data.creatTime,
          x:x,
          y:y,
          token:this.token
        }
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
    clearInterval(this.counter)
  }
}
</script>

<style lang="stylus" scoped>
</style>
