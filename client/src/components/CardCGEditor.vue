<template>
  <div>
    <Dialog
      header="编辑立绘"
      v-model:visible="display"
      @hide="onHide"
      :style="{ maxWidth: '90%' }"
    >
      <div class="wmCreatCard-body">
        <div ref="wmCreatCard" class="wmCreatCard"></div>
        <div class="pb20 pt20">
          <Slider
            v-model="cardSet.zoom"
            @change="CGZoom"
            :min="minZoom"
            :max="100"
          />
        </div>
        <div class="tc pt10 creat-card-star-input auto-number-input">
          <div class="p-grid p-ai-center">
            <div class="p-col-fixed creat-card-input-form-label">
              星级调整：
            </div>
            <div class="p-col">
              <InputNumber
                v-model.number="cardSet.star"
                showButtons
                buttonLayout="horizontal"
                :step="1"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
                :min="1"
                :max="6"
              />
            </div>
          </div>
          <div class="p-grid p-ai-center">
            <div class="p-col-fixed creat-card-input-form-label">
              柔化立绘：
            </div>
            <div class="p-col tl">
              <InputSwitch v-model="cardSet.mipmap" />
            </div>
          </div>
        </div>
        <div class="wmCreatCard-loading" v-show="cardLoading">
          <i class="pi pi-spin pi-spinner" style="fontSize: 2rem"></i>
        </div>
      </div>
      <template #footer>
        <Button
          label="关闭"
          icon="pi pi-times"
          @click="closeBasic"
          class="p-button-text"
        />
        <Button label="确认" icon="pi pi-check" @click="getImg" />
      </template>
    </Dialog>
  </div>
</template>
<script>
import Dialog from 'primevue/dialog'
import * as PIXI from 'pixi.js'
import { reactive, ref } from '@vue/reactivity'
import Button from 'primevue/button'
import Slider from 'primevue/slider'
import InputNumber from 'primevue/inputnumber'
import InputSwitch from 'primevue/inputswitch'
import { nextTick, onBeforeUnmount } from '@vue/runtime-core'
export default {
  components: { Dialog, Button, Slider, InputNumber, InputSwitch },
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
  setup(props, { emit }) {
    const display = ref(false)
    const wmCreatCard = ref(null)
    const closeBasic = () => {
      display.value = false
    }
    const openDialog = () => {
      cardLoading.value = true
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
    const cardSet = reactive({
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
    })
    const sprite = {
      starSprite: null,
      titleSprite: null,
      nameSprite: null,
      CGSprite: null,
      crySprite: null,
      leftTypeSprite: null,
      rightTypeSprite: null,
    }

    let minZoom = ref(0)
    const handleAvatarSuccess = () => {
      const imageUrl = props.imageUrl
      const imageObj = props.imageObj
      // 记得设置一个读取图片的loading flag
      const w = imageObj.width
      const h = imageObj.height
      const minWZoom = Math.ceil((396 / w) * 100)
      const minHZoom = Math.ceil((556 / h) * 100)
      minZoom.value = Math.max(minWZoom, minHZoom)
      sprite.CGSprite.texture = PIXI.Texture.from(imageUrl, {
        mipmap: cardSet.mipmap ? PIXI.MIPMAP_MODES.ON : PIXI.MIPMAP_MODES.OFF,
      })
      sprite.CGSprite.position.set(0, 0)
      cardSet.zoom = minZoom.value
      sprite.CGSprite.scale = new PIXI.Point(
        minZoom.value / 100,
        minZoom.value / 100
      )
      cardSet.rotation = 0
      sprite.CGSprite.rotation = 0
      cardLoading.value = false
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
      //   透明度
      sprite.starSprite.alpha = 1
      sprite.titleSprite.alpha = 1
      sprite.nameSprite.alpha = 1
      sprite.crySprite.alpha = 1
      sprite.leftTypeSprite.alpha = 1
      sprite.rightTypeSprite.alpha = 1

      handleAvatarSuccess()

      let oldStar = cardSet.star
      let oldImageUrl = props.imageUrl
      let oldMipmap = cardSet.mipmap

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
        if (oldImageUrl !== props.imageUrl) {
          console.log(123)
          oldImageUrl = props.imageUrl
          sprite.CGSprite.texture = PIXI.Texture.from(props.imageUrl, {
            mipmap: cardSet.mipmap
              ? PIXI.MIPMAP_MODES.ON
              : PIXI.MIPMAP_MODES.OFF,
          })
        }
        if (oldMipmap !== cardSet.mipmap) {
          oldMipmap = cardSet.mipmap
          sprite.CGSprite.texture.baseTexture.destroy()
          sprite.CGSprite.texture = PIXI.Texture.from(props.imageUrl, {
            mipmap: cardSet.mipmap
              ? PIXI.MIPMAP_MODES.ON
              : PIXI.MIPMAP_MODES.OFF,
          })
        }

        if (oldStar !== cardSet.star) {
          oldStar = cardSet.star
          sprite.starSprite.texture = PIXI.Texture.from(
            '/img/creatcard/star/' + cardSet.star + '.png'
          )
        }
      })
    }

    const CGZoom = () => {
      sprite.CGSprite.scale = new PIXI.Point(
        cardSet.zoom / 100,
        cardSet.zoom / 100
      )
      const x = sprite.CGSprite.x
      const y = sprite.CGSprite.y
      const w = sprite.CGSprite.width
      const h = sprite.CGSprite.height
      const cW = 396
      const cH = 556
      const x2 = w + x - cW
      if (x2 < 0) {
        sprite.CGSprite.x = x - x2
      }
      const y2 = h + y - cH
      if (y2 < 0) {
        sprite.CGSprite.y = y - y2
      }
    }

    const cardLoading = ref(false)
    const getImg = () => {
      //   console.log(sprite.starSprite)
      cardLoading.value = true
      sprite.starSprite.alpha = 0
      sprite.titleSprite.alpha = 0
      sprite.nameSprite.alpha = 0
      sprite.crySprite.alpha = 0
      sprite.leftTypeSprite.alpha = 0
      sprite.rightTypeSprite.alpha = 0
      setTimeout(() => {
        const uploadCardUrl = app.view.toDataURL('image/jpeg', 0.9)
        emit('image', uploadCardUrl, cardSet['star'])
        nextTick(() => {
          display.value = false
          nextTick(() => {
            cardLoading.value = false
          })
        })
      }, 1000)
    }

    onBeforeUnmount(() => {
      destroyApp()
    })

    return {
      display,
      cardSet,
      wmCreatCard,
      openDialog,
      onHide,
      closeBasic,
      getImg,
      cardLoading,
      CGZoom,
      minZoom,
    }
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
.wmCreatCard-loading {
  position: absolute;
  left: -1.2em;
  right: -1.2em;
  top: 0;
  bottom: 0;
  background: #ffffff;
  justify-content: center;
  align-items: center;
  display: flex;
}
.wmCreatCard-body {
  position: relative;
  z-index: 1;
}
</style>
