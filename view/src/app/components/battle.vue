<template>
  <div id="battleView"
       class="wm_battle_body">
    <div class="wm_battle_box"
         @click="closeBattle()"
         v-show="canClose"></div>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { PrefixInteger, randomNum } from "../../utils/utils";

export default {
  props: {
    battleData: {
      type: Object
    },
  },
  data () {
    return {
      app: null,
      canClose: false,
    }
  },
  mounted () {
    this.drawBattle();
  },
  methods: {
    seeMyInfo (sprite, e) {
      console.log(sprite);
      console.log(e.data.getLocalPosition(sprite.parent));
    },
    closeBattle () {
      if (this.canClose) {
        this.$emit('gameover');
        console.log('关闭战斗');
      }
    },
    MergeArray (arr1, arr2) {
      var _arr = new Array();
      for (var i = 0; i < arr1.length; i++) {
        _arr.push(arr1[i]);
      }
      for (var i = 0; i < arr2.length; i++) {
        var flag = true;
        for (var j = 0; j < arr1.length; j++) {
          if (arr2[i] == arr1[j]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          _arr.push(arr2[i]);
        }
      }
      return _arr;
    },
    drawBattle () {
      let loadingAlphUp = false;
      let that = this;
      let senceChangeFlag = false;//场景切换标记
      let timerCount = 0;//动画延时计算用
      const loader = new PIXI.Loader();
      const app = new PIXI.Application({
        width: 720, height: 1280, backgroundColor: 0x000000, resolution: window.devicePixelRatio || 1,
      });
      this.app = app;
      document.getElementById('battleView').appendChild(app.view);
      // 三个场景读取、战斗、结算
      const loadingSence = new PIXI.Container();
      const battleStartSence = new PIXI.Container();
      let battleSence = new PIXI.Container();
      battleSence.sortableChildren = true;
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
      // 特效们
      let animeSheetJson = {};
      // 绘制加载画面
      let loadingText = new PIXI.Text('少女祈祷中...', { fontFamily: 'Arial', fontSize: 36, fill: 0xffffff, align: 'center' });
      loadingText.anchor.set(0.5);
      loadingText.position.set(360, 640);
      loadingSence.addChild(loadingText);
      // 卡牌属性
      let myCardRightType = [];
      let emCardRightType = [];
      for (let i = 0; i < this.battleData.MyBattleCard.length; i++) {
        console.log(this.battleData.MyBattleCard[i]);
        let cardRightType = this.battleData.cardOtherData[this.battleData.MyBattleCard[i]].rightType;
        myCardRightType.push(cardRightType);
      } for (let i = 0; i < this.battleData.EmBattleCard.length; i++) {
        let cardRightType = this.battleData.cardOtherData[this.battleData.EmBattleCard[i]].rightType;
        emCardRightType.push(cardRightType);
      }
      // 加载资源
      let cardList_ = this.MergeArray(this.battleData.MyBattleCard, this.battleData.EmBattleCard);
      for (let i = 0; i < cardList_.length; i++) {
        loader.add(cardList_[i], '/card/' + this.battleData.cardOtherData[cardList_[i]].packageId + '/' + cardList_[i] + '.jpg');
      }
      loader.add('myAvatar', '/api/gravatar.png?md5=' + this.battleData.MyMD5);
      if (this.battleData.EmMD5) {
        loader.add('emAvatar', '/api/gravatar.png?md5=' + this.battleData.EmMD5);
      } else {
        loader.add('emAvatar', '/static/robotTx/' + Number(this.battleData.EmName.replace(/[^0-9]/ig, '')) + '.jpg');
      }
      loader.add('battle_bg', '/static/img/battle_bg.jpg');
      // 加载动画
      loader.add('/static/otherImg/animation/0.json');
      loader.add('/static/otherImg/animation/2.json');
      loader.add('/static/otherImg/animation/3.json');
      loader.add('/static/otherImg/animation/4.json');
      loader.add('/static/otherImg/animation/5.json');
      loader.add('/static/otherImg/animation/6.json');
      // 资源加载完毕
      loader.load((loader, resources) => {
        let myCardList = this.battleData.MyBattleCard;
        let emCardList = this.battleData.EmBattleCard;
        sprites['animation'] = {};
        sprites['animation']['em'] = {};
        sprites['animation']['my'] = {};
        // 扣血信息
        sprites['myHPText'] = new PIXI.Text('0', { fontSize: 36, fill: 0xffffff, align: 'right' });
        sprites['emHPText'] = new PIXI.Text('0', { fontSize: 36, fill: 0xffffff, align: 'right' });
        sprites['emHPText'].anchor.set(1, 0);
        sprites['myHPText'].anchor.set(1, 0);
        sprites['emHPText'].alpha = 0;
        sprites['myHPText'].alpha = 0;
        sprites['emHPText'].position.set(700, 48);
        sprites['myHPText'].position.set(700, 1188);
        // 卡组
        sprites['mycard'] = {};
        sprites['emcard'] = {};
        // 特效动画
        animeSheetJson['0'] = loader.resources["/static/otherImg/animation/0.json"].spritesheet;
        animeSheetJson['2'] = loader.resources["/static/otherImg/animation/2.json"].spritesheet;
        animeSheetJson['3'] = loader.resources["/static/otherImg/animation/3.json"].spritesheet;
        animeSheetJson['4'] = loader.resources["/static/otherImg/animation/4.json"].spritesheet;
        animeSheetJson['5'] = loader.resources["/static/otherImg/animation/5.json"].spritesheet;
        animeSheetJson['6'] = loader.resources["/static/otherImg/animation/6.json"].spritesheet;
        for (let i = 0; i < myCardList.length; i++) {
          sprites['mycard'][myCardList[i]] = new PIXI.Sprite(resources[myCardList[i]]['texture']);
        }
        for (let i = 0; i < emCardList.length; i++) {
          sprites['emcard'][emCardList[i]] = new PIXI.Sprite(resources[emCardList[i]]['texture']);
        }
        sprites['battle_bg'] = new PIXI.Sprite(resources['battle_bg']['texture']);
        initBattleSence(resources);
        initGameStartSence(resources);
        initGameEndSdence(resources);
        senceChangeFlag = true;

      });
      // 战斗结算
      function initGameEndSdence (resources) {
        let myEndNickname = new PIXI.Text(that.battleData.MyName, { fontSize: 36, fill: 0xffffff, align: 'center' });//昵称
        let myEndAvatarSprite = new PIXI.Sprite(resources['myAvatar']['texture']);//我的头像
        let winText = '平局'
        if (that.battleData.win === 1) {
          winText = '胜利';
        } else if (that.battleData.win === 0) {
          winText = '战败';
        }
        let myEndWin = new PIXI.Text(winText, { fontSize: 48, fill: 0xffffff, align: 'center' });//战败与否
        // 结算竞技点
        let myScore = that.battleData.score + that.battleData.getScore;
        if (myScore < 0) {
          myScore = 0;
        }
        let getScore = new PIXI.Text('我的竞技点：' + myScore + '（' + (that.battleData.getScore >= 0 ? '+' + that.battleData.getScore : that.battleData.getScore) + '）', { fontSize: 36, fill: 0xffffff, align: 'center' });//竞技点
        let getExp = new PIXI.Text('获得经验值：' + that.battleData.getExp, { fontSize: 36, fill: 0xffffff, align: 'center' });//经验
        let tips = new PIXI.Text('点击画面可立即关闭战斗窗口！', { fontSize: 22, fill: 0xffffff, align: 'center' });//经验
        // 提示
        let overChance = new PIXI.Text(that.battleData.battleOverChance ? '您已超过今天的最大胜利次数，将不会获得竞技点与经验值。' : '', { fontSize: 22, fill: 0xffffff, align: 'center' });//经验
        // 布局
        getScore.anchor.set(0.5);
        getExp.anchor.set(0.5);
        myEndNickname.anchor.set(0.5);
        myEndAvatarSprite.anchor.set(0.5);
        myEndWin.anchor.set(0.5);
        overChance.anchor.set(0.5);
        tips.anchor.set(0.5);

        myEndAvatarSprite.position.set(360, 425);
        myEndNickname.position.set(360, 516);
        getScore.position.set(360, 582);
        getExp.position.set(360, 648);
        myEndWin.position.set(360, 300);
        overChance.position.set(360, 766);
        tips.position.set(360, 726);
        // 插入场景
        battleEndSence.addChild(getScore);
        battleEndSence.addChild(getExp);
        battleEndSence.addChild(myEndNickname);
        battleEndSence.addChild(myEndAvatarSprite);
        battleEndSence.addChild(myEndWin);
        battleEndSence.addChild(overChance);
        battleEndSence.addChild(tips);
      }
      // 战斗场景初始化
      let battleSenceItem = {
        bg: null,
        myAvatarSprite: null,
        myNickname: null,
        mySAN: null,
        myBgSanB: null,
        myBgSanA: null,
        emAvatarSprite: null,
        emNickname: null,
        emSAN: null,
        emBgSanB: null,
        emBgSanA: null,
        battleMyInfo: new PIXI.Container(),
        battleEmInfo: new PIXI.Container(),
      }
      function initBattleSence (resources) {
        battleSenceItem.bg = sprites['battle_bg'];//战斗背景
        // 我的信息
        battleSenceItem.myNickname = new PIXI.Text(that.battleData.MyName, { fontSize: 24, fill: 0xffffff, align: 'left' });//昵称
        battleSenceItem.myAvatarSprite = new PIXI.Sprite(resources['myAvatar']['texture']);//我的头像
        // Opt-in to interactivity
        // battleSenceItem.myAvatarSprite.interactive = true;
        // battleSenceItem.myAvatarSprite.on('pointermove', seeMyInfo_);
        battleSenceItem.mySAN = new PIXI.Text('SAN:' + that.battleData.MyADSHP[3], { fontSize: 36, fill: 0xffffff, align: 'left' });//SAN
        // 画我的血条背景
        battleSenceItem.myBgSanB = new PIXI.Graphics();
        battleSenceItem.myBgSanB.beginFill(0x890606);
        battleSenceItem.myBgSanB.drawRect(136, 1233, 564, 27);
        battleSenceItem.myBgSanB.endFill();
        // 画我的血条
        battleSenceItem.myBgSanA = new PIXI.Graphics();
        battleSenceItem.myBgSanA.beginFill(0xfee140);
        battleSenceItem.myBgSanA.drawRect(136, 1233, 564, 27);
        battleSenceItem.myBgSanA.endFill();
        // 对方的信息
        battleSenceItem.emAvatarSprite = new PIXI.Sprite(resources['emAvatar']['texture']);//他的头像
        battleSenceItem.emNickname = new PIXI.Text(that.battleData.EmName, { fontSize: 24, fill: 0xffffff, align: 'left' });//他的昵称
        battleSenceItem.emSAN = new PIXI.Text('SAN:' + that.battleData.EmADSHP[3], { fontSize: 36, fill: 0xffffff, align: 'left' });//SAN
        // 画他的血条背景
        battleSenceItem.emBgSanB = new PIXI.Graphics();
        battleSenceItem.emBgSanB.beginFill(0x890606);
        battleSenceItem.emBgSanB.drawRect(136, 94, 564, 27);
        battleSenceItem.emBgSanB.endFill();
        // 画他的血条
        battleSenceItem.emBgSanA = new PIXI.Graphics();
        battleSenceItem.emBgSanA.beginFill(0xfee140);
        battleSenceItem.emBgSanA.drawRect(136, 94, 564, 27);
        battleSenceItem.emBgSanA.endFill();
        // 设定我的坐标
        battleSenceItem.myAvatarSprite.position.set(20, 1160);
        battleSenceItem.myNickname.position.set(136, 1160);
        battleSenceItem.mySAN.position.set(136, 1188);
        // 设定他的坐标
        battleSenceItem.emAvatarSprite.position.set(20, 20);
        battleSenceItem.emNickname.position.set(136, 20);
        battleSenceItem.emSAN.position.set(136, 48);
        // 插入背景
        battleSence.addChild(battleSenceItem.bg);
        // 将我的信息插入容器
        battleSenceItem.battleMyInfo.addChild(battleSenceItem.myAvatarSprite);
        battleSenceItem.battleMyInfo.addChild(battleSenceItem.myNickname);
        battleSenceItem.battleMyInfo.addChild(battleSenceItem.mySAN);
        battleSenceItem.battleMyInfo.addChild(battleSenceItem.myBgSanB);
        battleSenceItem.battleMyInfo.addChild(battleSenceItem.myBgSanA);
        // 将他的信息插入容器
        battleSenceItem.battleEmInfo.addChild(battleSenceItem.emAvatarSprite);
        battleSenceItem.battleEmInfo.addChild(battleSenceItem.emNickname);
        battleSenceItem.battleEmInfo.addChild(battleSenceItem.emSAN);
        battleSenceItem.battleEmInfo.addChild(battleSenceItem.emBgSanB);
        battleSenceItem.battleEmInfo.addChild(battleSenceItem.emBgSanA);
        // 将卡牌插入到场景
        for (let i = 0; i < that.battleData.MyBattleCard.length; i++) {
          sprites['mycard'][that.battleData.MyBattleCard[i]].width = 300;
          sprites['mycard'][that.battleData.MyBattleCard[i]].height = 422;
          sprites['mycard'][that.battleData.MyBattleCard[i]].anchor.set(0.5);
          sprites['mycard'][that.battleData.MyBattleCard[i]].position.set(-180, 922);
          // battleSence.addChild(sprites['mycard'][that.battleData.MyBattleCard[i]]);
        }
        for (let i = 0; i < that.battleData.EmBattleCard.length; i++) {
          sprites['emcard'][that.battleData.EmBattleCard[i]].width = 300;
          sprites['emcard'][that.battleData.EmBattleCard[i]].height = 422;
          sprites['emcard'][that.battleData.EmBattleCard[i]].anchor.set(0.5);
          sprites['emcard'][that.battleData.EmBattleCard[i]].position.set(900, 360);
          // battleSence.addChild(sprites['emcard'][that.battleData.EmBattleCard[i]]);
        }
        // 将第一张卡插入场景
        battleSence.addChild(sprites['mycard'][that.battleData.MyBattleCard[0]]);
        battleSence.addChild(sprites['emcard'][that.battleData.EmBattleCard[0]]);
        // 将容器插入场景
        battleSence.addChild(battleSenceItem.battleMyInfo);
        battleSence.addChild(battleSenceItem.battleEmInfo);
        battleSence.addChild(sprites['emHPText']);
        battleSence.addChild(sprites['myHPText']);
      }
      // 画战斗
      let battleInfo = {
        turn: 0,
        battleUser: that.battleData.speed,//当前是谁在打
        turnEndFlag: 0,//打两回合意味着回合结束
        cardEnter: true,//是否在卡牌入场阶段
        gameOver: false,//是否游戏结束
        turnStep: {
          attacked: false
        },
        indexCache: null,
      }
      //显示我的信息弹框
      function seeMyInfo_ (e) {
        that.seeMyInfo(battleSenceItem.myAvatarSprite, e);
      }
      function drawBattle () {
        if (battleInfo.gameOver) {
          timerCount++;
          if (timerCount > 30) {
            senceChangeFlag = true;
            timerCount = 0;
          }
        } else if (battleInfo.turnEndFlag <= 1) {
          if (battleInfo.cardEnter) {//卡牌入场阶段
            cardEnter();
          } else {//使用技能阶段
            cardUseSkill();
          }
        } else if (battleInfo.turnEndFlag > 1 && !battleInfo.gameOver) {
          battleInfo.turn++
          if (battleInfo.turn > 19) {
            battleInfo.gameOver = true;
            drawBattle();
          }
          battleInfo.turnEndFlag = 0;
          battleInfo.turnStep.attacked = false;
          battleInfo.cardEnter = true;
        }
      }
      // 过度动画
      function cardAnime (card, params, to, step) {
        let paramStep = card[params] + step;
        if (step < 0) {
          if (paramStep <= to) {
            paramStep = to;
            card[params] = paramStep;
            return true;
          }
          card[params] = paramStep;
        } else {
          if (paramStep >= to) {
            paramStep = to;
            card[params] = paramStep;
            return true;
          }
          card[params] = paramStep;
        }
        return false;
      }
      function creatEffAnime (id, x, y, w, h, z, who, speed = 0.4) {
        sprites['animation'][who][id] = new PIXI.AnimatedSprite(animeSheetJson[id].animations[id]);
        sprites['animation'][who][id].width = w;
        sprites['animation'][who][id].height = h;
        sprites['animation'][who][id].x = x;
        sprites['animation'][who][id].y = y;
        sprites['animation'][who][id].anchor.set(0.5);
        sprites['animation'][who][id].animationSpeed = speed;
        sprites['animation'][who][id].loop = false;
        sprites['animation'][who][id].onComplete = () => {
          let id_ = id;
          sprites['animation'][who][id_].alpha = 0;
          sprites['animation'][who][id_].destroy();
        };
        battleSence.addChild(sprites['animation'][who][id]);
        sprites['animation'][who][id].zIndex = z;
        sprites['animation'][who][id].alpha = 1;
        sprites['animation'][who][id].play();
      }
      function setEffanime () {
        let myEffect = myCardRightType[battleInfo.turn]
        let emEffect = emCardRightType[battleInfo.turn]
        // 特7
        // 魔2
        // 物1
        // 防3
        // 治4
        // 支6
        // 妨5
        if (battleInfo.battleUser == 1) {//我
          creatEffAnime('0', 360, 360, 320, 320, 100, 'em');
          // { fontSize: 36, fill : 0xffffff, align : 'right'}
          let AttackPow = that.battleData.MyBattleData[battleInfo.turn][0];
          let DefendPow = that.battleData.MyBattleData[battleInfo.turn][2];
          let AttackAddHP = that.battleData.MyBattleData[battleInfo.turn][4];
          const AttackCanSkill = that.battleData.MyBattleData[battleInfo.turn][9];
          const DefendCanSkill = that.battleData.MyBattleData[battleInfo.turn][10];
          if (DefendPow || AttackAddHP) {
            let myText = AttackAddHP - DefendPow;
            let textColor = 0xff4c4c;
            if (myText > 0) {
              textColor = 0x14a774;
            }
            if (myText !== 0) {
              let fuhao = '';
              if (myText > 0) {
                fuhao = '+';
              }
              sprites['myHPText'].style = { fontSize: 36, fill: textColor, align: 'right' };
              sprites['myHPText'].text = fuhao + myText;
              sprites['myHPText'].alpha = 1;
            }
          }
          sprites['emHPText'].style = { fontSize: 36, fill: 0xff4c4c, align: 'right' };
          sprites['emHPText'].text = '-' + AttackPow;
          sprites['emHPText'].alpha = 1;

          // 我方攻击前
          if (AttackCanSkill) {
            if (myEffect === 1) {
              creatEffAnime('4', 360, 360, 320, 320, 100, 'em', 0.65);
            } else if (myEffect === 7) {
              creatEffAnime('4', 360, 360, 320, 320, 100, 'em', 0.65);
            }
          }
          // 防守方接受攻击前
          if (DefendCanSkill) {
            if (emEffect === 3) {
              creatEffAnime('2', 360, 360, 320, 320, 99, 'em');
            } else if (emEffect === 7) {
              creatEffAnime('2', 360, 360, 320, 320, 99, 'em');
            } else if (emEffect === 6) {
              creatEffAnime('5', 360, 360, 320, 320, 99, 'em', 0.65);
            }
            // else if (emEffect === 2) {
            //   creatEffAnime('3', 70, 1210, 140, 140, 99, 'my', 0.3);
            // }
          }
          if (DefendPow > 0) {
            creatEffAnime('3', 70, 1210, 140, 140, 99, 'my', 0.3);
          }
          if (AttackAddHP > 0) {
            creatEffAnime('6', 70, 1210, 140, 140, 100, 'my', 0.3);
          }
        } else {
          creatEffAnime('0', 360, 931, 320, 320, 100, 'my');
          let AttackPow = that.battleData.EmBattleData[battleInfo.turn][0];
          let DefendPow = that.battleData.EmBattleData[battleInfo.turn][2];
          let AttackAddHP = that.battleData.EmBattleData[battleInfo.turn][4];
          const AttackCanSkill = that.battleData.EmBattleData[battleInfo.turn][9];
          const DefendCanSkill = that.battleData.EmBattleData[battleInfo.turn][10];
          if (DefendPow || AttackAddHP) {
            let myText = AttackAddHP - DefendPow;
            let textColor = 0xff4c4c;
            if (myText > 0) {
              textColor = 0x14a774;
            }
            if (myText !== 0) {
              let fuhao = '';
              if (myText > 0) {
                fuhao = '+';
              }
              sprites['emHPText'].style = { fontSize: 36, fill: textColor, align: 'right' };
              sprites['emHPText'].text = fuhao + myText;
              sprites['emHPText'].alpha = 1;
            }
          }
          sprites['myHPText'].style = { fontSize: 36, fill: 0xff4c4c, align: 'right' };
          sprites['myHPText'].text = '-' + AttackPow;
          sprites['myHPText'].alpha = 1;

          if (AttackCanSkill) {
            if (emEffect === 1) {
              creatEffAnime('4', 360, 931, 320, 320, 100, 'my', 0.65, 0.3);
            } else if (emEffect === 7) {
              creatEffAnime('4', 360, 931, 320, 320, 100, 'my', 0.65);
            }
            // else if (emEffect === 4) {
            //   creatEffAnime('6', 70, 70, 140, 140, 100, 'em');
            // }
          }
          if (DefendCanSkill) {
            if (myEffect === 3) {
              creatEffAnime('2', 360, 931, 320, 320, 99, 'my');
            } else if (myEffect === 7) {
              creatEffAnime('2', 360, 931, 320, 320, 99, 'my');
            } else if (myEffect === 6) {
              creatEffAnime('5', 360, 931, 320, 320, 99, 'my', 0.65);
            }
            // else if (myEffect === 2) {
            //   creatEffAnime('3', 70, 70, 140, 140, 99, 'em', 0.3);
            // }
          }
          if (DefendPow > 0) {
            creatEffAnime('3', 70, 70, 140, 140, 99, 'em', 0.3);
          }
          if (AttackAddHP > 0) {
            creatEffAnime('6', 70, 70, 140, 140, 100, 'em');
          }
        }
        // // 我方攻击前
        //     if(emEffect!==5){
        //         if(myEffect===1){
        //             creatEffAnime('4',360,360,192,192,100,'em');
        //         }else if(myEffect===7){
        //             creatEffAnime('4',360,360,192,192,100,'em');
        //         }else if(myEffect===4){
        //             creatEffAnime('6',70,1210,140,140,100,'my');
        //         }
        //     }
        //     // 防守方接受攻击前
        //     if(myEffect!==5){
        //         if(emEffect===3){
        //             creatEffAnime('2',360,360,192,192,99,'em');
        //         }else if(emEffect===7){
        //             creatEffAnime('2',360,360,192,192,99,'em');
        //         }else if(emEffect===6){
        //             creatEffAnime('5',360,360,192,192,99,'em');
        //         }else if(emEffect===2){
        //             creatEffAnime('3',70,1210,140,140,99,'my');
        //         }
        //     }
        // }else{
        //     if(myEffect!==5){
        //         if(emEffect===1){
        //             creatEffAnime('4',360,931,192,192,100,'my');
        //         }else if(emEffect===7){
        //             creatEffAnime('4',360,931,192,192,100,'my');
        //         }else if(emEffect===4){
        //             creatEffAnime('6',70,70,140,140,100,'em');
        //         }
        //     }
        //     if(emEffect!==5){
        //         if(myEffect===3){
        //             creatEffAnime('2',360,931,192,192,99,'my');
        //         }else if(myEffect===7){
        //             creatEffAnime('2',360,931,192,192,99,'my');
        //         }else if(myEffect===6){
        //             creatEffAnime('5',360,931,192,192,99,'my');
        //         }else if(myEffect===2){
        //             creatEffAnime('3',70,70,140,140,99,'em');
        //         }
        //     }
        // }
      }
      // 减SAN
      let mySANW = 1;
      let emSANW = 1;
      function SANCount () {
        let hpFullWidth = 564;//血条长度;
        setEffanime();
        if (battleInfo.battleUser == 1) {
          battleSenceItem.mySAN.text = 'SAN:' + that.battleData.MyBattleData[battleInfo.turn][1];
          battleSenceItem.emSAN.text = 'SAN:' + that.battleData.MyBattleData[battleInfo.turn][3];

          mySANW = hpFullWidth * (that.battleData.MyBattleData[battleInfo.turn][1] / that.battleData.MyADSHP[3]);
          if (mySANW > hpFullWidth) {
            mySANW = hpFullWidth;
          }

          emSANW = hpFullWidth * (that.battleData.MyBattleData[battleInfo.turn][3] / that.battleData.EmADSHP[3]);
          if (emSANW > hpFullWidth) {
            emSANW = hpFullWidth;
          }
          // 画我的血条
          battleSenceItem.myBgSanA.clear();
          battleSenceItem.myBgSanA.beginFill(0xfee140);
          battleSenceItem.myBgSanA.drawRect(136, 1233, mySANW, 27);
          battleSenceItem.myBgSanA.endFill();
          // 画他的血条
          battleSenceItem.emBgSanA.clear();
          battleSenceItem.emBgSanA.beginFill(0xfee140);
          battleSenceItem.emBgSanA.drawRect(136, 94, emSANW, 27);
          battleSenceItem.emBgSanA.endFill();

        } else {
          battleSenceItem.mySAN.text = 'SAN:' + that.battleData.EmBattleData[battleInfo.turn][3];
          battleSenceItem.emSAN.text = 'SAN:' + that.battleData.EmBattleData[battleInfo.turn][1];

          mySANW = hpFullWidth * (that.battleData.EmBattleData[battleInfo.turn][3] / that.battleData.MyADSHP[3]);
          if (mySANW > hpFullWidth) {
            mySANW = hpFullWidth;
          }

          emSANW = hpFullWidth * (that.battleData.EmBattleData[battleInfo.turn][1] / that.battleData.EmADSHP[3]);
          if (emSANW > hpFullWidth) {
            emSANW = hpFullWidth;
          }
          // 画我的血条
          battleSenceItem.myBgSanA.clear();
          battleSenceItem.myBgSanA.beginFill(0xfee140);
          battleSenceItem.myBgSanA.drawRect(136, 1233, mySANW, 27);
          battleSenceItem.myBgSanA.endFill();
          // 画他的血条
          battleSenceItem.emBgSanA.clear();
          battleSenceItem.emBgSanA.beginFill(0xfee140);
          battleSenceItem.emBgSanA.drawRect(136, 94, emSANW, 27);
          battleSenceItem.emBgSanA.endFill();
        }
      }
      function cardUseSkill () {
        let myCard = sprites['mycard'][that.battleData.MyBattleCard[battleInfo.turn]];
        let emCard = sprites['emcard'][that.battleData.EmBattleCard[battleInfo.turn]];
        if (battleInfo.battleUser == 1) {
          if (battleInfo.indexCache === null) {
            battleInfo.indexCache = myCard.zIndex;
            myCard.zIndex = 99;
          }
          if (!battleInfo.turnStep.attacked) {
            let animed = cardAnime(myCard, 'y', 360, -50);
            if (animed) {
              battleInfo.turnStep.attacked = animed;
              SANCount();
            }
          } else {
            let animed = cardAnime(myCard, 'y', 922, 50);
            if (animed) {
              myCard.zIndex = battleInfo.indexCache;
              battleInfo.indexCache = null;
              if (mySANW == 0 || emSANW == 0) {
                battleInfo.gameOver = true;
                return false;
              }
              battleInfo.turnEndFlag++;
              if (battleInfo.battleUser == 1) {
                battleInfo.battleUser = 0;
              } else {
                battleInfo.battleUser = 1;
              }
              battleInfo.turnStep.attacked = false;
            }
          }
        } else {
          if (battleInfo.indexCache === null) {
            battleInfo.indexCache = emCard.zIndex;
            emCard.zIndex = 99;
          }
          if (!battleInfo.turnStep.attacked) {
            let animed = cardAnime(emCard, 'y', 922, 50);
            if (animed) {
              battleInfo.turnStep.attacked = animed;
              SANCount();
            }
          } else {
            let animed = cardAnime(emCard, 'y', 360, -50);
            if (animed && !battleInfo.gameOver) {
              emCard.zIndex = battleInfo.indexCache;
              battleInfo.indexCache = null;
              if (mySANW == 0 || emSANW == 0) {
                battleInfo.gameOver = true;
                return false;
              }
              battleInfo.turnEndFlag++;
              if (battleInfo.battleUser == 1) {
                battleInfo.battleUser = 0;
              } else {
                battleInfo.battleUser = 1;
              }
              battleInfo.turnStep.attacked = false;
            }
          }
        }
      }
      function cardEnter () {
        let myCard = sprites['mycard'][that.battleData.MyBattleCard[battleInfo.turn]];
        let emCard = sprites['emcard'][that.battleData.EmBattleCard[battleInfo.turn]];
        myCard.zIndex = battleInfo.turn;
        emCard.zIndex = battleInfo.turn;
        if (myCard.x != 360) {
          myCard.x += 20;
          emCard.x -= 20;
        } else {
          timerCount++
          if (timerCount > 30) {
            timerCount = 0;
            if (battleInfo.turn >= 2) {
              // 缓解精灵太多卡顿
              sprites['mycard'][that.battleData.MyBattleCard[battleInfo.turn - 2]].destroy();
              sprites['emcard'][that.battleData.EmBattleCard[battleInfo.turn - 2]].destroy();
            }
            if (battleInfo.turn < (that.battleData.MyBattleCard.length - 1) || battleInfo.turn < (that.battleData.EmBattleCard.length - 1)) {
              // 准备下一回合的卡牌
              battleSence.addChild(sprites['mycard'][that.battleData.MyBattleCard[battleInfo.turn + 1]]);
              battleSence.addChild(sprites['emcard'][that.battleData.EmBattleCard[battleInfo.turn + 1]]);
            }
            battleInfo.cardEnter = false;
          }
        }
      }
      // 切换场景的淡入淡出
      function sencenChange (a, b) {
        if (a.visible && !b.visible) {
          a.alpha -= 0.05;
          if (a.alpha <= 0) {
            b.visible = true;
          }
        } else if (b.visible) {
          if (b.alpha < 1) {
            b.alpha += 0.05;
          } else {
            a.visible = false;
            a.destroy();
            senceChangeFlag = false;
          }
        }
      }
      let myInfoContainer = new PIXI.Container();//我信息组容器
      let emInfoContainer = new PIXI.Container();//他信息组容器
      function initGameStartSence (resources) {
        let battleVS = new PIXI.Text('VS', { fontFamily: 'Arial', fontSize: 56, fill: 0xffffff, align: 'center' });//VS字体
        let myAvatarSprite = new PIXI.Sprite(resources['myAvatar']['texture']);//我的头像
        let myNickname = new PIXI.Text(that.battleData.MyName, { fontFamily: 'Arial', fontSize: 26, fill: 0xffffff, align: 'center' });//昵称
        // 对方的头像和信息
        let emAvatarSprite = new PIXI.Sprite(resources['emAvatar']['texture']);//我的头像
        let emNickname = new PIXI.Text(that.battleData.EmName, { fontFamily: 'Arial', fontSize: 26, fill: 0xffffff, align: 'center' });//昵称
        // 头像和昵称中心点
        myAvatarSprite.anchor.set(0.5);
        myNickname.anchor.set(0.5);
        myNickname.position.set(0, 80);
        // 将头像和昵称塞入容器
        myInfoContainer.addChild(myAvatarSprite);
        myInfoContainer.addChild(myNickname);
        // 设置容器坐标
        myInfoContainer.alpha = 0;
        myInfoContainer.position.set(0, 810);
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
        emInfoContainer.position.set(720, 440);
        // 插入到场景
        battleStartSence.addChild(emInfoContainer);

      }
      function gameStartAnime () {
        if (timerCount >= 30) {
          senceChangeFlag = true;
          timerCount = 0;
        }
        if (myInfoContainer.alpha < 1) {
          myInfoContainer.alpha += 0.1;
          emInfoContainer.alpha += 0.1;
        }
        if (emInfoContainer.position.x === 360 || myInfoContainer.position.x === 360) {
          timerCount += 1;
          return false;
        }
        emInfoContainer.position.x -= 10;
        myInfoContainer.position.x += 10;
      }
      // 动画
      app.ticker.add((delta) => {
        // 如果还在加载则使用加载动画
        if (loadingSence.visible) {
          if (loadingText.alpha >= 1) {
            loadingText.alpha -= 0.01 * delta;
            loadingAlphUp = false;
          } else if (loadingText.alpha <= 0.5) {
            loadingText.alpha += 0.01 * delta;
            loadingAlphUp = true;
          } else {
            if (loadingAlphUp) {
              loadingText.alpha += 0.01 * delta;
            } else {
              loadingText.alpha -= 0.01 * delta;
            }
          }
        } else if (battleStartSence.visible) {
          // 战斗开始动画
          gameStartAnime();
          // app.destroy(true);
        } else if (battleSence.visible) {
          // 战斗动画
          drawBattle();
        } else if (battleEndSence.visible) {
          this.canClose = true;
          timerCount++
          if (timerCount > 180) {
            this.canClose = false;
            this.$emit('gameover');
            timerCount = 0;
          }
        }
        // 换场
        if (senceChangeFlag) {
          if (loadingSence.visible) {
            sencenChange(loadingSence, battleStartSence);
          } else if (battleStartSence.visible) {
            sencenChange(battleStartSence, battleSence);
          } else if (battleSence.visible) {
            sencenChange(battleSence, battleEndSence);
          }
        }

      });
    }
  },
  beforeDestroy () {
    this.app.destroy(true);
  }
}
</script>

<style lang="stylus">
.wm_battle_body {
  height: 100vh;
  width: 100vw;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9998;
  background: #000;
}

.wm_battle_body canvas {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  margin: 0 auto;
}

.wm_battle_box {
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  z-index: 2;
}
</style>
