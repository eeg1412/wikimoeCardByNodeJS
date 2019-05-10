<template>
    <div id="battleView" class="wm_battle_body"></div>
</template>

<script>
import * as PIXI from 'pixi.js'
import {PrefixInteger} from "../../utils/utils";

export default {
  data() {
    return {
        battleData:{
            "MyBattleCard": [
                "2056",
                "2057",
                "2058",
                "2059",
                "2061",
                "2062",
                "2064",
                "2067",
                "2068",
                "3002",
                "3004",
                "3014",
                "3018",
                "3019",
                "3020",
                "3029",
                "3030",
                "3031",
                "3033",
                "3037"
            ],
            "MyADSHP": [
                12200,
                6100,
                0,
                24200
            ],
            "MyName": "广树",
            "MyMD5": "fbb31d99a24cf9a56c48b44dd0797d22",
            "EmBattleCard": [
                "1020",
                "1023",
                "1026",
                "1028",
                "1040",
                "1050",
                "1054",
                "1061",
                "2001",
                "2004",
                "2005",
                "2006",
                "2012",
                "2023",
                "2026",
                "2035",
                "2039",
                "3007",
                "3009",
                "3017"
            ],
            "EmADSHP": [
                10450,
                5225,
                3,
                21000
            ],
            "EmName": "mikusa",
            "EmMD5": "873b4d39ab9a34d5a15e43dde0958ced",
            "MyBattleData": [
                [
                    6975,
                    20025,
                    0,
                    14025
                ],
                [
                    6975,
                    15675,
                    0,
                    7050
                ],
                [
                    6975,
                    8885,
                    1395,
                    0
                ]
            ],
            "EmBattleData": [
                [
                    5395,
                    21000,
                    0,
                    18805
                ],
                [
                    4350,
                    14025,
                    0,
                    15675
                ],
                [
                    5395,
                    5971,
                    1079,
                    10280
                ]
            ],
            "win": 1,
            "speed": 0,
            "myBattleTimes": 2,
            "battleOverChance": false,
            "getScore": 10,
            "getExp": 20,
            "msg": "获取成功"
        }
    }
  },
  mounted() {
      this.drawBattle();
  },
  methods: {
      drawBattle(){
            let loadingAlphUp = false;
            let that = this;
            let senceChangeFlag = false;//场景切换标记
            let timerCount = 0;//动画延时计算用
            const loader = new PIXI.Loader();
            const app = new PIXI.Application({
                width: 720, height: 1280, backgroundColor: 0x000000, resolution: window.devicePixelRatio || 1,
            });
            document.getElementById('battleView').appendChild(app.view);
            // 三个场景读取、战斗、结算
            const loadingSence = new PIXI.Container();
            const battleStartSence = new PIXI.Container();
            const battleSence = new PIXI.Container();
            const battleEndSence = new PIXI.Container();
            app.stage.addChild(loadingSence);
            app.stage.addChild(battleStartSence);
            app.stage.addChild(battleSence);
            app.stage.addChild(battleEndSence);
            battleStartSence.visible = false;
            battleSence.visible = false;
            battleEndSence.visible = false;
            battleStartSence.alpha = 0;
            battleSence.alpha = 0;
            battleEndSence.alpha = 0;
            // 精灵们
            let sprites = {};
            // 绘制加载画面
            let loadingText = new PIXI.Text('资源读取中...',{fontFamily : 'Arial', fontSize: 36, fill : 0xffffff, align : 'center'});
            loadingText.anchor.set(0.5);
            loadingText.position.set(360, 640);
            loadingSence.addChild(loadingText);
            // 加载资源
            let myCardList = this.battleData.MyBattleCard;
            for(let i=0;i<myCardList.length;i++){
                loader.add(myCardList[i], '/static/img/'+PrefixInteger(myCardList[i],4)+'.jpg');
            }
            let emCardList = this.battleData.EmBattleCard;
            for(let i=0;i<emCardList.length;i++){
                loader.add(emCardList[i], '/static/img/'+PrefixInteger(emCardList[i],4)+'.jpg');
            }
            loader.add('myAvatar','/api/gravatar.png?md5='+this.battleData.MyMD5);
            if(this.battleData.EmMD5){
                loader.add('emAvatar','/api/gravatar.png?md5='+this.battleData.EmMD5);
            }else{
                loader.add('emAvatar','/api/gravatar.png?md5='+this.battleData.MyMD5);
            }
            // 资源加载完毕
            loader.load((loader, resources) => {
                for(var i in resources) {
                    sprites[i] = new PIXI.Sprite(resources[i]['texture']);
                }
                initGameStartSence();
                console.log(sprites);
                senceChangeFlag = true;

            });
            // 切换场景的淡入淡出
            function sencenChange(a,b){
                console.log(b.visible);
                if(a.visible&&!b.visible){
                    a.alpha -= 0.05;
                    if(a.alpha<=0){
                        b.visible = true;
                    }
                }else if(b.visible){
                    if(b.alpha<1){
                        b.alpha += 0.05;
                    }else{
                        a.visible = false;
                        senceChangeFlag = false;
                    }
                }
            }
            let myInfoContainer = new PIXI.Container();//我信息组容器
            let emInfoContainer = new PIXI.Container();//他信息组容器
            function initGameStartSence(){
                let battleVS = new PIXI.Text('VS',{fontFamily : 'Arial', fontSize: 56, fill : 0xffffff, align : 'center'});//VS字体
                let myAvatarSprite = sprites['myAvatar'];//我的头像
                let myNickname = new PIXI.Text(that.battleData.MyName,{fontFamily : 'Arial', fontSize: 26, fill : 0xffffff, align : 'center'});//昵称
                // 对方的头像和信息
                let emAvatarSprite = sprites['emAvatar'];//我的头像
                let emNickname = new PIXI.Text(that.battleData.EmName,{fontFamily : 'Arial', fontSize: 26, fill : 0xffffff, align : 'center'});//昵称
                // 头像和昵称中心点
                myAvatarSprite.anchor.set(0.5);
                myNickname.anchor.set(0.5);
                myNickname.position.set(0, 80);
                // 将头像和昵称塞入容器
                myInfoContainer.addChild(myAvatarSprite);
                myInfoContainer.addChild(myNickname);
                // 设置容器坐标
                myInfoContainer.alpha = 0;
                myInfoContainer.position.set(0, 440);
                // 插入到场景
                battleStartSence.addChild(myInfoContainer);
                // 设置VS字样坐标并插入场景
                battleVS.anchor.set(0.5);
                battleVS.position.set(360, 640);
                battleStartSence.addChild(battleVS);
                // 对方头像和昵称中心点
                emAvatarSprite.anchor.set(0.5);
                emNickname.anchor.set(0.5);
                emNickname.position.set(0, 80);
                // 将对方头像和昵称塞入容器
                emInfoContainer.addChild(emAvatarSprite);
                emInfoContainer.addChild(emNickname);
                // 设置容器坐标
                emInfoContainer.alpha = 0;
                emInfoContainer.position.set(720, 810);
                // 插入到场景
                battleStartSence.addChild(emInfoContainer);

            }
            function gameStartAnime(){
                if(timerCount>=30){
                    senceChangeFlag = true;
                    timerCount = 0;
                }
                if(myInfoContainer.alpha<1){
                    myInfoContainer.alpha += 0.1;
                    emInfoContainer.alpha += 0.1;
                }
                if(emInfoContainer.position.x===360||myInfoContainer.position.x===360){
                    timerCount += 1;
                    return false;
                }
                emInfoContainer.position.x -=10;
                myInfoContainer.position.x +=10;
            }
            // 动画
            app.ticker.add((delta) => {
                // 如果还在加载则使用加载动画
                if(loadingSence.visible){
                    if(loadingText.alpha>=1){
                        loadingText.alpha -=0.01*delta;
                        loadingAlphUp = false;
                    }else if(loadingText.alpha<=0.5){
                        loadingText.alpha +=0.01*delta;
                        loadingAlphUp = true;
                    }else{
                        if(loadingAlphUp){
                            loadingText.alpha +=0.01*delta;
                        }else{
                            loadingText.alpha -=0.01*delta;
                        }
                    }
                }else if(battleStartSence.visible){
                    // 战斗开始动画
                    gameStartAnime();
                    // app.destroy(true);
                }else if(battleSence.visible){
                    // 战斗动画
                }
                // 换场
                if(senceChangeFlag){
                    if(loadingSence.visible){
                        sencenChange(loadingSence,battleStartSence);
                    }else if(battleStartSence.visible){
                        sencenChange(battleStartSence,battleSence);
                    }else if(battleSence.visible){
                        sencenChange(battleSence,battleEndSence);
                    }else if(battleEndSence.visible){

                    }
                }
                
            });
      }
  }
}
</script>

<style lang="stylus">
.wm_battle_body{
    height 100vh
    width 100vw
}
.wm_battle_body canvas{
    max-width 100%
    max-height 100%
    width auto 
    height auto
}
</style>
