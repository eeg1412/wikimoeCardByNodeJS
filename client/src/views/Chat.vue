<!-- chat -->
<template>
  <div>
    <ul>
      <li v-for="(item,index) in chatList"
          :key="index"
          class="mb10">
        {{item.account}}说：{{item.msg}}</li>
    </ul>
    <div>
      <input type="text"
             v-model="chat"><button type="button"
              @click="send">发送</button>
    </div>
    <div class="mt10">
      <button type="button"
              @click="quit">退出</button>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: 'chat',
  components: {},
  data () {
    return {
      chatList: [],
      chat: "",
      socket: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    quit () {
      sessionStorage.removeItem('token');
      this.$router.replace('/');
    },
    toSocket () {
      this.socket = io.connect("/socketchat", {
        query: {
          token: sessionStorage.getItem("token")
        }
      });
      this.socket.on('msg', (data) => {
        this.chatList.push(data);
      });
      this.socket.on('logout', () => {
        this.quit();
      });
      this.socket.on('connect', () => {
        console.log('已连接');
      });
      this.socket.on('disconnect', () => {
        console.log('已断开');
      });

    },
    send () {
      this.socket.emit('send', this.chat);
      this.chat = '';
    }
  },
  created () {
    this.toSocket();
  },
  mounted () {

  },
  beforeCreate () { },
  beforeMount () { },
  beforeUpdate () { },
  updated () { },
  beforeUnmount () {
    this.socket.close();
  },
  unmounted () { },
  activated () { },
}
</script>
<style>
</style>