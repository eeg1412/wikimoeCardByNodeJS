<template>
<div>
    <div class="l2d_body" v-show="showL2d" @mouseover="showCloseBtn=true" @mouseout="showCloseBtn=false">
        <transition name="el-fade-in-linear">
            <div class="l2d_message" v-show="messageDivShow">{{message}}</div>
        </transition>
        <div class="l2d_close_btn" v-show="showCloseBtn" @mouseover="showCloseBtnMeth" @click="closeSprite"><i class="el-icon-close"></i></div>
        <div id="l2d"></div>
    </div>
    <div class="l2d_open_btn" v-show="!showL2d&&loaded&&canShowL2d" @click="init">召唤雷姆</div>
</div>
</template>

<script>
import * as PIXI from 'pixi.js'
import '../../../static/lib/live2d.min'
import '../../utils/live2d/index'
import l2dModel from '../../../static/live2d/rem/11.json';
import {randomNum} from '../../utils/utils';

export default {
  data() {
    return {
        canShowL2d:false,
        loaded:false,
        showCloseBtn:false,
        l2dSprite:null,
        renderer:null,
        showL2d:false,
        message:'',
        messageDivShow:false,
        messageTimer:null,
    }
  },
  mounted() {
      this.$wikimoecard.l2dMassage = this.showMessage;
      this.$wikimoecard.l2dMassageClose = this.closeMassage;
      let pcW = window.screen.width;
      if(pcW>1366){
          this.canShowL2d = true;
          let closeL2d = localStorage.getItem("closeL2d") === 'true';
          if(closeL2d){
              this.loaded = true;
          }else{
              this.init();
          }
      }
  },
  methods: {
      closeSprite(){
          this.l2dSprite.destroy(true);
          this.renderer.destroy(true);
          this.showL2d = false;
          localStorage.setItem("closeL2d",'true');
      },
      showCloseBtnMeth(){
          this.showCloseBtn = true;
          this.showMessage('暂时隐藏雷姆，希望不久能再见面呢！')
      },
      closeMassage(){
          clearTimeout(this.messageTimer);
          if(this.showL2d){
            this.messageDivShow = false;
            this.l2dSprite.startRandomMotionOnce('idle');
          }
      },
      showMessage(text,noMotion){
          clearTimeout(this.messageTimer);
          if(this.showL2d){
            this.messageDivShow = true;
            if(!noMotion){
                this.l2dSprite.startRandomMotionOnce('random');
            }
            this.message = text;
            this.messageTimer = setTimeout(()=>{
                this.messageDivShow = false;
            },8000)
          }
      },
      init(){
          localStorage.setItem("closeL2d",'false');
          this.loaded = false;
          const renderer = new PIXI.Application({ width: 400, height: 520,transparent: true });
            document.getElementById('l2d').appendChild(renderer.view);
            const stage = new PIXI.Container();


            const loader = new PIXI.Loader();
            const live2dSprite = new PIXI.Live2DSprite(l2dModel, {
            debugLog: false,
            randomMotion: false,
            eyeBlink: false,
            // audioPlayer: (...args) => console.log(...args)
            });
            stage.addChild(live2dSprite);

            // live2dSprite.y = -150;
            live2dSprite.adjustScale(0,0,0.7);
            live2dSprite.adjustTranslate(0, 0);
            live2dSprite.startRandomMotion('idle');

            live2dSprite.on('pointerdown', (evt) => {
                const point = evt.data.global;
                let randomText = ["有什么事要吩咐吗？", "那个……如果太过强硬，雷姆会不自觉长出角的！","如果一直这样的话，雷姆可是会生气的哦！", "要是能再温柔一点的话……"];
                if (live2dSprite.hitTest('body', point.x, point.y)) {
                    this.showMessage(randomText[randomNum(0,randomText.length-1)],true);
                    live2dSprite.startRandomMotionOnce('tap_body');
                }else if (live2dSprite.hitTest('head', point.x, point.y)) {
                    this.showMessage(randomText[randomNum(0,randomText.length-1)],true);
                    live2dSprite.startRandomMotionOnce('tap_head');
                }
            });
            // live2dSprite.on('mousemove', (evt) => {
            //     const point = evt.data.global;
            //     live2dSprite.setViewPoint(point.x, point.y);
            // });
            this.l2dSprite = live2dSprite;
            // 资源加载完毕
            renderer.stage.addChild(stage);
            this.renderer = renderer;
            let loadTimer = setInterval(()=>{
                if(window.$l2dloaded){
                    clearInterval(loadTimer);
                    let now = (new Date()).getHours();
                    let text = '';
                    if (now > 23 || now <= 5) {
                        text = '夜深了，应该好好休息才是呀！';
                    } else if (now > 5 && now <= 7) {
                        text = '早上好！一日之计在于晨，美好的一天就要开始了呢！';
                    } else if (now > 7 && now <= 11) {
                        text = '上午好！今天也要努力抽到六星卡呢！';
                    } else if (now > 11 && now <= 14) {
                        text = '中午了，今天的午饭好吃吗？';
                    } else if (now > 14 && now <= 17) {
                        text = '午后很容易犯困呢！不过打起精神来六星卡正等着你呢！';
                    } else if (now > 17 && now <= 19) {
                        text = '傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~~';
                    } else if (now > 19 && now <= 21) {
                        text = '晚上好，今天过得怎么样？';
                    } else if (now > 21 && now <= 23) {
                        text = '已经这么晚了呀，早点休息吧，晚安~~';
                    } else {
                        text = '快来一起抽卡吧！';
                    }
                    setTimeout(()=>{
                        this.showMessage(text);
                    },100)
                    this.showL2d = true;
                    this.loaded = true;
                }
            },20)
      }
  },
}
</script>

<style>
.l2d_body{
    position: fixed;
    left: 8px;
    bottom: 0;
    z-index: 999;
}
.l2d_body canvas{
    width: 200px;
    height: 260px;
}
.l2d_message{
    color: #fff;
    box-sizing: border-box;
    width: 200px;
    height: auto;
    margin: auto;
    padding: 7px;
    bottom: 260px;
    left: 0px;
    text-align: center;
    border: 2px solid rgba(75,127,199,0.9);
    border-radius: 5px;
    background-color: rgba(74, 59, 114,0.9);
    font-size: 13px;
    font-weight: 400;
    text-overflow: ellipsis;
    text-transform: uppercase;
    overflow: hidden;
    position: absolute;
}
.l2d_close_btn{
    position: absolute;
    right: 0px;
    top: 5px;
    cursor: url(/static/cur/pointer.cur),pointer;
    font-size: 18px;
}
.l2d_open_btn{
    border: 2px solid rgba(75,127,199,0.9);
    border-radius: 2px;
    background-color: rgba(74, 59, 114,0.9);
    padding: 2px 10px;
    color: #fff;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    position: fixed;
    left: 5px;
    bottom: 5px;
    z-index: 999;
    cursor: url(/static/cur/pointer.cur),pointer;
}
</style>