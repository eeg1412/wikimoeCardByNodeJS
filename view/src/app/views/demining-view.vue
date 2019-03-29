<template>
<div>挖矿
  <router-link to="/">去首页</router-link>
  <div>
    <table class="wm_card_demining_table">
      <tbody>
        <tr v-for="(item,index) in mineMap" v-bind:key="index">
          <td v-for="(items,indexs) in item" v-bind:key="indexs">
            <div class="wm_demining_item" :class="deminingItemClass(items.num)" @click="openNode(indexs,index)">
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
</div>
</template>

<script>
import io from 'socket.io-client';
export default {
  data() {
    return {
      backFlag:false,
      socket:null,
      mineMap:[],
      mineInfo:null
    }
  },
  mounted() {
    this.socket = io.connect('http://localhost:3000');
    this.socket.on('demining',(data)=>{
      // this.socket.emit('demining',{time:new Date()});
      console.log(data);
      if(data.code==1){
        this.$message.error(data.msg);
      }else if(data.code==0){
        this.mineInfo = data;
        this.creatMap(data.data)
      }else if(data.code==2){
        this.$message({
          message: '恭喜您挖到了'+data.star+'颗星星！',
          type: 'success'
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
        email:'abc@abc.com',
        token:'123'
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
    deminingItemClass(num){
      var c = '';
      if(num>=0){
        c = 'type_is_opened';
        if(num==9){
          c = c+' is_wmdmstar'
        }
      }
      return c;
    },
    openNode(x,y){
      let parmas = {
        type:'open',
        creatTime:this.mineInfo.data.creatTime,
        x:x,
        y:y,
        email:'abc@abc.com',
        token:'123'
      }
      this.socket.emit('demining',parmas);
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
