<template>
  <div>
    <Dialog
      header="编辑立绘"
      v-model:visible="display"
      @hide="onHide"
      :style="{ maxWidth: '90%' }"
    >
      <div>
        <div ref="wmCreatCard" class="wmCreatCard"></div>
      </div>
    </Dialog>
  </div>
</template>
<script>
import Dialog from 'primevue/dialog'
import * as PIXI from 'pixi.js'
import { ref } from '@vue/reactivity'
import { nextTick, onBeforeUnmount } from '@vue/runtime-core'
export default {
  components: { Dialog },
  props: {
    imageObj: {
      required: true,
    },
    imageUrl: {
      required: true,
    },
    titleS: {
      type: String,
      default: '',
    },
    nameS: {
      type: String,
      default: '',
    },
    star: {
      default: 1,
    },
    cry: {
      type: String,
      required: true,
    },
    leftType: {
      type: String,
      required: true,
    },
    rightType: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const display = ref(false)
    const wmCreatCard = ref(null)
    const openDialog = () => {
      cardSet['titleS'] = props.titleS
      cardSet['nameS'] = props.nameS
      cardSet['star'] = props.star
      cardSet['cry'] = props.cry
      cardSet['leftType'] = props.leftType
      cardSet['rightType'] = props.rightType

      display.value = true
      destroyApp()
      nextTick(() => {
        drawCard()
      })
    }
    const destroyApp = () => {
      if (app) {
        app.destroy(true)
        app = null
      }
    }
    const onHide = () => {
      //   app.destroy(true)
    }

    let app = null
    const cardSet = {
      title: '',
      name: '',
      titleS: '',
      nameS: '',
      leftType: '1',
      rightType: '1',
      star: '1',
      cry: '1',
      zoom: 100,
      rotation: 0,
      mipmap: true,
    }
    const sprite = {
      starSprite: null,
      titleSprite: null,
      nameSprite: null,
      CGSprite: null,
      crySprite: null,
      leftTypeSprite: null,
      rightTypeSprite: null,
    }

    let minZoom = 0
    const handleAvatarSuccess = () => {
      const imageUrl = props.imageUrl
      const imageObj = props.imageObj

      //TEST IMAGE SIZE
      // 记得设置一个读取图片的loading flag
      const w = imageObj.width
      const h = imageObj.height
      const minWZoom = Math.ceil((396 / w) * 100)
      const minHZoom = Math.ceil((556 / h) * 100)
      minZoom = Math.max(minWZoom, minHZoom)
      sprite.CGSprite.texture = PIXI.Texture.from(imageUrl, {
        mipmap: cardSet.mipmap ? PIXI.MIPMAP_MODES.ON : PIXI.MIPMAP_MODES.OFF,
      })
      sprite.CGSprite.position.set(0, 0)
      cardSet.zoom = minZoom
      sprite.CGSprite.scale = new PIXI.Point(minZoom / 100, minZoom / 100)
      cardSet.rotation = 0
      sprite.CGSprite.rotation = 0
    }

    const drawCard = () => {
      //   const loader = new PIXI.Loader();
      app = new PIXI.Application({
        width: 396,
        height: 556,
        backgroundColor: 0xffffff,
        resolution: 1,
        preserveDrawingBuffer: true,
      })
      console.log(wmCreatCard.value)
      wmCreatCard.value.appendChild(app.view)
      const moveIco = "url('/cur/move.cur'),move"
      app.renderer.plugins.interaction.cursorStyles.move = moveIco
      const container = new PIXI.Container()
      container.sortableChildren = true
      app.stage.addChild(container)
      // Create a new texture
      // 初始化
      // 星级
      let star = PIXI.Texture.from(
        '/img/creatcard/star/' + cardSet.star + '.png'
      )
      sprite.starSprite = new PIXI.Sprite(star)
      sprite.starSprite.zIndex = 2
      // 作品
      sprite.titleSprite = new PIXI.Text(cardSet.titleS, {
        fontFamily: 'Noto Sans SC',
        fontSize: '18px',
        fill: 0xffffff,
        strokeThickness: 2,
        padding: 28,
      })
      sprite.titleSprite.anchor.set(0.5, 0)
      sprite.titleSprite.position.set(202, 480)
      sprite.titleSprite.zIndex = 3
      sprite.titleSprite.roundPixels = true
      // 名字
      sprite.nameSprite = new PIXI.Text(cardSet.nameS, {
        fontFamily: 'Noto Sans SC',
        fontSize: '22px',
        fill: 0xffffff,
        strokeThickness: 2,
        padding: 36,
      })
      sprite.nameSprite.anchor.set(0.5, 0)
      sprite.nameSprite.position.set(202, 512)
      sprite.nameSprite.zIndex = 3
      sprite.nameSprite.roundPixels = true
      // 立绘
      sprite.CGSprite = new PIXI.Sprite()
      sprite.CGSprite.zIndex = 1
      sprite.CGSprite.interactive = true
      sprite.CGSprite.buttonMode = true
      sprite.CGSprite.cursor = 'move'
      sprite.CGSprite.anchor.set(0)
      sprite.CGSprite.on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove)
      handleAvatarSuccess()
      function onDragStart(event) {
        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
        this.data = event.data
        this.dragging = true
        this.oldPosition = this.data.getLocalPosition(this.parent)
        this.oldX = this.x
        this.oldY = this.y
      }
      function onDragEnd() {
        this.alpha = 1
        this.dragging = false
        // set the interaction data to null
        this.data = null
      }
      function onDragMove() {
        if (this.dragging) {
          const newPosition = this.data.getLocalPosition(this.parent)
          this.x = this.oldX - (this.oldPosition.x - newPosition.x)
          this.y = this.oldY - (this.oldPosition.y - newPosition.y)
          if (this.x > 0) {
            this.x = 0
          } else if (this.x < -sprite.CGSprite.width + 396) {
            this.x = -sprite.CGSprite.width + 396
          }
          if (this.y > 0) {
            this.y = 0
          } else if (this.y < -sprite.CGSprite.height + 556) {
            this.y = -sprite.CGSprite.height + 556
          }
        }
      }
      // 水晶
      let cry = PIXI.Texture.from('/img/creatcard/cry/' + cardSet.cry + '.png')
      sprite.crySprite = new PIXI.Sprite(cry)
      sprite.crySprite.position.set(9, 10)
      sprite.crySprite.zIndex = 3
      // 被动属性
      let leftType = PIXI.Texture.from(
        '/img/creatcard/leftType/' + cardSet.leftType + '.png'
      )
      sprite.leftTypeSprite = new PIXI.Sprite(leftType)
      sprite.leftTypeSprite.position.set(16, 17)
      sprite.leftTypeSprite.zIndex = 4
      // 主动技能
      let rightType = PIXI.Texture.from(
        '/img/creatcard/rightType/' + cardSet.rightType + '.png'
      )
      sprite.rightTypeSprite = new PIXI.Sprite(rightType)
      sprite.rightTypeSprite.position.set(342, 12)
      sprite.rightTypeSprite.zIndex = 4
      // 写入场景
      container.addChild(sprite.starSprite)
      container.addChild(sprite.titleSprite)
      container.addChild(sprite.nameSprite)
      container.addChild(sprite.CGSprite)
      container.addChild(sprite.crySprite)
      container.addChild(sprite.leftTypeSprite)
      container.addChild(sprite.rightTypeSprite)
      app.ticker.maxFPS = 30
      app.ticker.add(() => {
        sprite.titleSprite.style = {
          fontFamily: 'Noto Sans SC',
          fontSize: '18px',
          fill: 0xffffff,
          strokeThickness: 2,
          padding: 28,
        }
        sprite.nameSprite.style = {
          fontFamily: 'Noto Sans SC',
          fontSize: '22px',
          fill: 0xffffff,
          strokeThickness: 2,
          padding: 36,
        }
      })
    }

    onBeforeUnmount(() => {
      destroyApp()
    })

    return { display, wmCreatCard, openDialog, onHide }
  },
}
</script>
<style>
.wmCreatCard {
  max-width: 100%;
}
.wmCreatCard canvas {
  max-width: 100%;
}
</style>
