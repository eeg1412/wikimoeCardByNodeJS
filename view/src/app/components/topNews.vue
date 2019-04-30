<template>
<div class="wm_topnews_body">
    <el-collapse-transition>
      <div class="wm_topnews_box" v-if="topNews">
          <marquee-text :repeat="30" :duration="topNews.length*3" :paused="isPaused">
              <div class="wm_topnews_item" @mouseenter="isPaused=true" @mouseleave="isPaused=false" v-for="(item,index) in topNews" v-bind:key="index" @click="opNews(item.title,item.text,item.time)">《{{item.title}}》</div>
          </marquee-text>
      </div>
    </el-collapse-transition>
</div>
</template>

<script>
import {authApi} from "../api";
import MarqueeText from 'vue-marquee-text-component'

export default {
  data() {
    return {
      isPaused:false,
      topNews:null
    }
  },
  components: {
    MarqueeText
  },
  mounted(){
    this.getNews();
  },
  methods:{
    capitalize(value) {
      var date = new Date(parseInt(value));
        var tt = [date.getFullYear(), ((date.getMonth()+1)<10?'0'+(date.getMonth()+1):date.getMonth()+1), (date.getDate()<10?'0'+date.getDate():date.getDate())].join('-') + '  ' +[(date.getHours()<10?'0'+date.getHours():date.getHours()), (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()), (date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds())].join(':');
        return tt;
    },
    opNews(title,text,time){
      let html = '<div class="wm_topnews_content_time">发布于：'+this.capitalize(time)+'</div><div class="wm_topnews_content">'+text.replace(/[<>&"]/g,function(c){return{'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];})+'</div>'
      this.$alert(html, title, {
        confirmButtonText: '关闭',
        dangerouslyUseHTMLString: true,
        lockScroll:false
      });
    },
    getNews(){
      let params = {
        type:'top'
      }
      authApi.news(params).then(res => {
        console.log(res);
        if(res.data.code==1){
          this.topNews = res.data.data;
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
  }
}
</script>

<style lang="stylus" scoped>
</style>
