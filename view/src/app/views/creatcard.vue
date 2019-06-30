<template>
<div class="common_body type_creatcard">
    <h5 class="common_title type_shop type_dec">卡牌生成器</h5>
    <h6 class="common_title_tips type_dec">Tip:可能会因为系统字体缺失导致文字错位，当前使用字体为【Arial】。</h6>
    <div class="mt20">
        <el-row>
            <el-col :sm="12">
                <div class="wm_creatcard_body">
                    <div id="wmCreatCard" class="tc"></div>
                </div>
                <div class="wm_creatcard_btn_body">
                    <el-tooltip class="item" effect="dark" content="生成完整的卡牌，可以用于分享" placement="top">
                        <el-button size="mini" type="primary" @click="creatCard">生成分享卡牌</el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="生成不包含出自和名字的卡牌，生成后可以用于投稿" placement="top">
                        <el-button size="mini" type="primary" @click="creatCardNoText">生成投稿卡牌</el-button>
                    </el-tooltip>
                </div>
            </el-col>
            <el-col :sm="12">
                <el-form class="wm_creatcard_form" label-width="80px">
                    <el-form-item label="立绘图片">
                        <el-upload
                            action=""
                            :auto-upload="false"
                            :show-file-list="false"
                            accept="image/*"
                            :on-change="handleAvatarSuccess">
                            <el-button size="small" type="primary">{{imageUrl?'重新导入':'点击导入'}}</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="立绘缩放">
                        <el-input-number v-model="cardSet.zoom" :precision="2" :step="1" :min="0.01" :max="100" @change="CGZoom"></el-input-number>
                    </el-form-item>
                    <el-form-item label="立绘旋转">
                        <el-input-number v-model="cardSet.rotation" :precision="2" :step="1" :min="0" :max="360" @change="CGRotation "></el-input-number>
                    </el-form-item>
                    <el-form-item label="出自作品">
                        <el-input v-model="cardSet.title" @input="changeTitle" @blur="changeTitle"></el-input>
                    </el-form-item>
                    <el-form-item label="角色名字">
                        <el-input v-model="cardSet.name" @input="changeName" @blur="changeName"></el-input>
                    </el-form-item>
                    <el-form-item label="星级">
                        <el-select v-model="cardSet.star" placeholder="请选择星级" @change="changeStar">
                            <el-option label="3星" value="3"></el-option>
                            <el-option label="4星" value="4"></el-option>
                            <el-option label="5星" value="5"></el-option>
                            <el-option label="6星" value="6"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="水晶">
                        <el-select v-model="cardSet.cry" placeholder="请选择水晶" @change="changeCry">
                            <el-option label="火" value="1"></el-option>
                            <el-option label="水" value="2"></el-option>
                            <el-option label="风" value="3"></el-option>
                            <el-option label="光" value="4"></el-option>
                            <el-option label="暗" value="5"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="被动属性">
                        <el-select v-model="cardSet.leftType" placeholder="请选择被动属性" @change="changeLeftType">
                            <el-option label="全能" value="1"></el-option>
                            <el-option label="兵攻" value="2"></el-option>
                            <el-option label="盾防" value="3"></el-option>
                            <el-option label="速度" value="4"></el-option>
                            <el-option label="爱心" value="5"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="主动技能">
                        <el-select v-model="cardSet.rightType" placeholder="请选择主动技能" @change="changeRightType">
                            <el-option label="物" value="1"></el-option>
                            <el-option label="魔" value="2"></el-option>
                            <el-option label="防" value="3"></el-option>
                            <el-option label="治" value="4"></el-option>
                            <el-option label="妨" value="5"></el-option>
                            <el-option label="支" value="6"></el-option>
                            <el-option label="特" value="7"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
    <menuView></menuView>
</div>
</template>

<script>
import * as PIXI from 'pixi.js'
import menuView from '../components/menu.vue';
import userTop from '../components/topUserInfo.vue';

export default {
  data() {
    return {
        app:null,
        cardSet:{
            title:'',
            name:'',
            leftType:'1',
            rightType:'1',
            star:'3',
            cry:'1',
            zoom:100,
            rotation:0,
        },
        sprite:{
            starSprite:null,
            titleSprite:null,
            nameSprite:null,
            CGSprite:null,
            crySprite:null,
            leftTypeSprite:null,
            rightTypeSprite:null,
        },
        imageUrl: ''
    }
  },
  components: {
    menuView,
    userTop,
  },
  mounted() {
      this.drawCard();
  },
  methods: {
      creatCardNoText(){
        this.sprite.titleSprite.alpha = 0;
        this.sprite.nameSprite.alpha = 0;
        setTimeout(()=>{
            let cardUrl = this.app.view.toDataURL("image/png");
            this.$alert('<div class="watch_img"><img src="'+cardUrl+'" /></div><div class="tc mt10">PC用户可以右键另存为，手机用户请长按保存。<br />可以加群或联系站长进行投稿。</div>', '查看卡牌', {
                dangerouslyUseHTMLString: true,
                lockScroll:false
            });
            this.sprite.titleSprite.alpha  = 1;
            this.sprite.nameSprite.alpha = 1;
        },100)
      },
      creatCard(){
        let cardUrl = this.app.view.toDataURL("image/png");
        this.$alert('<div class="watch_img"><img src="'+cardUrl+'" /></div><div class="tc mt10">PC用户可以右键另存为，手机用户请长按保存。</div>', '查看卡牌', {
            dangerouslyUseHTMLString: true,
            lockScroll:false
        });
      },
      handleAvatarSuccess(file, fileList) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.sprite.CGSprite.texture = PIXI.Texture.from(this.imageUrl);
        this.sprite.CGSprite.position.set(198, 278);
        this.cardSet.zoom = 100;
        this.sprite.CGSprite.scale = new PIXI.Point(1,1);
        this.cardSet.rotation = 0;
        this.sprite.CGSprite.rotation = 0;
      },
      changeStar(){
          this.sprite.starSprite.texture = PIXI.Texture.from('/static/otherImg/creatcard/star/'+this.cardSet.star+'.png');
      },
      changeTitle(){
          this.sprite.titleSprite.text = this.cardSet.title;
      },
      changeName(){
           this.sprite.nameSprite.text = this.cardSet.name;
      },
      changeCry(){
          this.sprite.crySprite.texture = PIXI.Texture.from('/static/otherImg/creatcard/cry/'+this.cardSet.cry+'.png');
      },
      changeLeftType(){
          this.sprite.leftTypeSprite.texture = PIXI.Texture.from('/static/otherImg/creatcard/leftType/'+this.cardSet.leftType+'.png');
      },
      changeRightType(){
          this.sprite.rightTypeSprite.texture = PIXI.Texture.from('/static/otherImg/creatcard/rightType/'+this.cardSet.rightType+'.png');
      },
      CGZoom(){
          this.sprite.CGSprite.scale = new PIXI.Point(this.cardSet.zoom/100,this.cardSet.zoom/100);
      },
      CGRotation(){
          this.sprite.CGSprite.rotation = Math.PI/180*this.cardSet.rotation;
      },
      drawCard(){
            let that = this;
            const loader = new PIXI.Loader();
            const app = new PIXI.Application({
                width: 396, height: 556, backgroundColor: 0xffffff, resolution: 1,preserveDrawingBuffer:true,
            });
            this.app = app;
            document.getElementById('wmCreatCard').appendChild(app.view);
            const hoverIcon = "url('/static/cur/pointer.cur'),pointer";
            app.renderer.plugins.interaction.cursorStyles.hover = hoverIcon;
            const container = new PIXI.Container();
            container.sortableChildren = true;
            app.stage.addChild(container);
            // Create a new texture
            // 初始化
            // 星级
            let star = PIXI.Texture.from('/static/otherImg/creatcard/star/'+this.cardSet.star+'.png');
            this.sprite.starSprite  = new PIXI.Sprite(star);
            this.sprite.starSprite.zIndex = 2;
            // 作品
            this.sprite.titleSprite = new PIXI.Text(this.cardSet.title,{ fontFamily:'Arial' ,fontSize: '18px', fill : 0xffffff ,strokeThickness:2,padding:28,textBaseline:'ideographic' });
            this.sprite.titleSprite.anchor.set(0.5,0);
            this.sprite.titleSprite.position.set(202, 486);
            this.sprite.titleSprite.zIndex = 3;
            this.sprite.titleSprite.roundPixels = true;
            // 名字
            this.sprite.nameSprite = new PIXI.Text(this.cardSet.name,{ fontFamily:'Arial' ,fontSize: '22px', fill : 0xffffff ,strokeThickness:2,padding:36,textBaseline:'ideographic' });
            this.sprite.nameSprite.anchor.set(0.5,0);
            this.sprite.nameSprite.position.set(202, 518);
            this.sprite.nameSprite.zIndex = 3;
            this.sprite.nameSprite.roundPixels = true;
            // 立绘
            this.sprite.CGSprite  = new PIXI.Sprite();
            this.sprite.CGSprite.zIndex = 1;
            this.sprite.CGSprite.interactive = true;
            this.sprite.CGSprite.buttonMode = true;
            this.sprite.CGSprite.cursor = 'hover';
            this.sprite.CGSprite.anchor.set(0.5);
            this.sprite.CGSprite
                .on('pointerdown', onDragStart)
                .on('pointerup', onDragEnd)
                .on('pointerupoutside', onDragEnd)
                .on('pointermove', onDragMove);
            function onDragStart(event) {
                // store a reference to the data
                // the reason for this is because of multitouch
                // we want to track the movement of this particular touch
                this.data = event.data;
                this.dragging = true;
                this.oldPosition = this.data.getLocalPosition(this.parent);
                this.oldX = this.x;
                this.oldY = this.y;
            }

            function onDragEnd() {
                this.alpha = 1;
                this.dragging = false;
                // set the interaction data to null
                this.data = null;
            }

            function onDragMove() {
                if (this.dragging) {
                    const newPosition = this.data.getLocalPosition(this.parent);
                    this.x = this.oldX - (this.oldPosition.x - newPosition.x);
                    this.y = this.oldY - (this.oldPosition.y - newPosition.y);
                }
            }
            // 水晶
            let cry = PIXI.Texture.from('/static/otherImg/creatcard/cry/'+this.cardSet.cry+'.png');
            this.sprite.crySprite  = new PIXI.Sprite(cry);
            this.sprite.crySprite.position.set(9, 10);
            this.sprite.crySprite.zIndex = 3;
            // 被动属性
            let leftType = PIXI.Texture.from('/static/otherImg/creatcard/leftType/'+this.cardSet.leftType+'.png');
            this.sprite.leftTypeSprite  = new PIXI.Sprite(leftType);
            this.sprite.leftTypeSprite.position.set(16, 17);
            this.sprite.leftTypeSprite.zIndex = 4;
            // 主动技能
            let rightType = PIXI.Texture.from('/static/otherImg/creatcard/rightType/'+this.cardSet.rightType+'.png');
            this.sprite.rightTypeSprite  = new PIXI.Sprite(rightType);
            this.sprite.rightTypeSprite.position.set(342, 12);
            this.sprite.rightTypeSprite.zIndex = 4;
            // 写入场景
            container.addChild(this.sprite.starSprite);
            container.addChild(this.sprite.titleSprite);
            container.addChild(this.sprite.nameSprite);
            container.addChild(this.sprite.CGSprite);
            container.addChild(this.sprite.crySprite);
            container.addChild(this.sprite.leftTypeSprite);
            container.addChild(this.sprite.rightTypeSprite);
            app.ticker.maxFPS = 30;
            // app.ticker.add((delta) => {
            //     console.log(123);
            // });
      }
  },
  beforeDestroy(){
      this.app.destroy(true);
  }
}
</script>

<style scoped>
.wm_creatcard_form{
    max-width: 500px;
    margin: 0 auto;
}
.wm_creatcard_btn_body{
    text-align: center;
    margin-bottom: 20px;
}
.common_body.type_creatcard{
    padding: 20px 10px;
}
@media ( max-width : 768px) {
  .common_body.type_creatcard{
    padding: 10px 10px 80px 10px;
  }
}
</style>
<style>
#wmCreatCard canvas{
    max-width: 95%;
    height: auto;
    display: inline-block;
    margin-bottom: 10px;
}
</style>
