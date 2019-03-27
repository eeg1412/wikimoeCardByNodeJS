<template>
<div>挖矿
  <router-link to="/">去首页</router-link>
  <div @click="send">发送</div>
</div>
</template>

<script>
import io from 'socket.io-client';
export default {
  data() {
    return {
      socket:null
    }
  },
  mounted() {
    this.socket = io.connect('http://localhost:3000');
    this.socket.on('demining',(data)=>{
      // this.socket.emit('demining',{time:new Date()});
      console.log(data);
    });
    this.socket.on('connect', () => {
      this.$message({
        message: '已连接服务器！',
        type: 'success'
      });
      this.socket.emit('demining',{time:new Date()});
    });
    this.socket.on('disconnect', () => {
      this.$message.error('服务器连接已断开！');
    });
  },
  methods: {
    send(){
      this.socket.emit('demining',{time:new Date()});
    }
  },
  beforeDestroy(){
    this.socket.close();
  }
}
</script>

<style lang="stylus" scoped>
</style>
