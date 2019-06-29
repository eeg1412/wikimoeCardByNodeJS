<template>
<div class="common_body">
    <userTop ref="userTop" />
    <div class="wm_creatcard_body">
        <div id="wmCreatCard"></div>
    </div>
    <el-form label-width="80px">
        <el-form-item label="立绘图片">
            <el-upload
                action=""
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleAvatarSuccess">
                <el-button size="small" type="primary">点击导入</el-button>
            </el-upload>
        </el-form-item>
        <el-form-item label="出自作品">
            <el-input v-model="cardSet.title" @input="changeTitle" @blur="changeTitle"></el-input>
        </el-form-item>
        <el-form-item label="名字">
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
    </el-form>
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
        },
        sprite:{
            starSprite:null,
            titleSprite:null,
            nameSprite:null,
            CGSprite:null,
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
      handleAvatarSuccess(file, fileList) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.sprite.CGSprite.texture = PIXI.Texture.from(this.imageUrl);
        this.sprite.CGSprite.position.set(0, 0);
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
      drawCard(){
            let that = this;
            const loader = new PIXI.Loader();
            const app = new PIXI.Application({
                width: 396, height: 556, backgroundColor: 0xffffff, resolution: 1,
            });
            this.app = app;
            document.getElementById('wmCreatCard').appendChild(app.view);
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
            this.sprite.titleSprite = new PIXI.Text(this.cardSet.title,{ fontFamily:'PingFang SC' ,fontSize: '18px', fill : 0xffffff, align : 'center' ,strokeThickness:2,padding:3 });
            this.sprite.titleSprite.anchor.set(0.5,0);
            this.sprite.titleSprite.position.set(202, 481);
            this.sprite.titleSprite.zIndex = 3;
            // 名字
            this.sprite.nameSprite = new PIXI.Text(this.cardSet.name,{ fontFamily:'YouYuan' ,fontSize: '22px', fill : 0xffffff, align : 'center' ,strokeThickness:2,padding:3 });
            this.sprite.nameSprite.anchor.set(0.5,0);
            this.sprite.nameSprite.position.set(202, 518);
            this.sprite.nameSprite.zIndex = 3;
            // 立绘
            this.sprite.CGSprite  = new PIXI.Sprite();
            this.sprite.CGSprite.zIndex = 1;
            this.sprite.CGSprite.interactive = true;
            this.sprite.CGSprite.buttonMode = true;
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
            // 写入场景
            container.addChild(this.sprite.starSprite);
            container.addChild(this.sprite.titleSprite);
            container.addChild(this.sprite.nameSprite);
            container.addChild(this.sprite.CGSprite);
            app.ticker.add((delta) => {
                
            })
      }
  },
  beforeDestroy(){
      this.app.destroy(true);
  }
}
</script>

<style lang="stylus" scoped>
</style>
