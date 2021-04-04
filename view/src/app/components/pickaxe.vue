<template>
  <div class="wm_card_pickaxe_body"
       :class="type==sel?'active':''">
    <el-popover ref="popover"
                placement="top"
                :title="pickTitle()"
                width="200"
                trigger="hover"
                :content="pickContent()">
    </el-popover>
    <div v-popover:popover>
      <div class="wm_card_pickaxe_ico">
        <img :src="'/static/otherImg/pickaxe/Pickaxe'+type+'.png'" />
      </div>
      <div class="wm_card_pickaxe_par"
           v-if="type>=3">
        <div class="wm_card_demining_time_body">×{{itemCount}}</div>
      </div>
      <div class="wm_card_pickaxe_par"
           v-else>
        <div class="wm_card_demining_time_body"
             v-if="min=='00'&&sec=='00'">完成！</div>
        <div class="wm_card_demining_time_body"
             v-else><span class="wm_card_demining_time_num">{{min}}</span><span>:</span><span class="wm_card_demining_time_num">{{sec}}</span><span></span></div>
        <!-- <el-progress :percentage="70" :show-text="false" :stroke-width="2" :status="null"></el-progress> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: { //哪种稿
      type: Number,
      default: 0
    },
    sel: { //选了哪种稿
      type: Number,
      default: 0
    },
    timeEnd: {//CD截至
      type: Number,
      default: 0
    },
    timeNow: {//服务器时间
      type: Number,
      default: 0
    },
    itemCount: {//道具数量
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      counter: null,
      min: '--',
      sec: '--',
      nextTimeSec: 0,
    }
  },
  watch: {
    timeEnd: {
      deep: true,
      handler: function (newVal, oldVal) {
        clearInterval(this.counter);
        this.nextTimeSec = Math.round((new Date().getTime() + this.serverDelay) / 1000) + (this.timeEnd - this.timeNow);
        this.timeSet();
        this.countdown();
      }
    }
  },
  computed: {
    serverDelay () { return this.$store.getters["app/serverDelay"] },
  },
  mounted () {
    this.nextTimeSec = Math.round((new Date().getTime() + this.serverDelay) / 1000) + (this.timeEnd - this.timeNow);
    this.timeSet();
    this.countdown();
  },
  methods: {
    timeSet () {
      let count = this.nextTimeSec - Math.round((new Date().getTime() + this.serverDelay) / 1000)
      if (count <= -1) {
        this.min = '00'
        this.sec = '00'
        clearInterval(this.counter)
        return
      }

      let seconds = count % 60
      let minutes = Math.floor(count / 60)

      if (minutes < 10) {
        minutes = `0${minutes}`
      }

      if (seconds < 10) {
        seconds = `0${seconds}`
      }
      this.min = minutes
      this.sec = seconds
    },
    countdown () {
      this.counter = setInterval(() => {
        this.timeSet();
      }, 1000)
    },
    pickTitle () {
      if (this.type === 0) {
        return '铁镐';
      } else if (this.type === 1) {
        return '银镐';
      } else if (this.type === 2) {
        return '金镐';
      } else if (this.type === 3) {
        return '星星镐';
      } else if (this.type === 4) {
        return '宝石镐';
      } else if (this.type === 5) {
        return '保罗炸弹';
      }
    },
    pickContent () {
      if (this.type === 0) {
        return '一把简单的镐，十分钟就能做出来，但是能成功挖出来的星星矿和宝石并不多！';
      } else if (this.type === 1) {
        return '银质的镐，制作需要半小时，挖出来的星星矿和宝石至少比铁镐多！';
      } else if (this.type === 2) {
        return '制作工艺非常难的镐，制作需要一小时，金镐能最大程度减少挖掘对星星矿和宝石造成的破坏，所以挖出来的星星矿和宝石的产量非常高！';
      } else if (this.type === 3) {
        return '仅能挖出星星的镐，挖出来的星星略微比金镐多！';
      } else if (this.type === 4) {
        return '仅能挖出宝石的镐，挖出来的宝石略微比金镐多！';
      } else if (this.type === 5) {
        return '感受保罗的愤怒吧！能一次性轰开3×3片矿区，但是因为其爆炸力惊人，只能保留少量的宝石，星星则完全被炸毁！';
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.counter)
  }
}
</script>

<style lang="stylus" scoped></style>
