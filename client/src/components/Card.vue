<template>
  <div class="card-canvas-body">
    <canvas ref="cardCanvas" class="card-canvas"></canvas>
    <img :src="imageUrl" v-if="imageUrl" class="card-image" />
  </div>
</template>
<script>
import { ref, onMounted } from 'vue'
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    name: {
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
    CG: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const cardCanvas = ref(null)
    const img = {
      star: null,
      cry: null,
      leftType: null,
      rightType: null,
      CG: null,
    }
    const creatImg = (url) => {
      const img = new Image()
      img.setAttribute('crossOrigin', 'anonymous')
      img.src = url
      return img
    }
    const readImg = (img) => {
      const promiseImg = new Promise((resolve, reject) => {
        img.onload = () => {
          resolve()
        }
        img.onerror = (e) => reject(e)
      })
      return promiseImg
    }
    const init = () => {
      img.star = creatImg(`/img/creatcard/star/${props.star}.png`)
      const starPromise = readImg(img.star)

      img.cry = creatImg(`/img/creatcard/cry/${props.cry}.png`)
      const cryPromise = readImg(img.cry)

      img.leftType = creatImg(`/img/creatcard/leftType/${props.leftType}.png`)
      const leftTypePromise = readImg(img.leftType)

      img.rightType = creatImg(
        `/img/creatcard/rightType/${props.rightType}.png`
      )
      const rightTypePromise = readImg(img.rightType)

      let CGPromise = null
      if (props.CG) {
        img.CG = creatImg(props.CG)
        CGPromise = readImg(img.CG)
      }

      const promiseArr = [
        starPromise,
        cryPromise,
        leftTypePromise,
        rightTypePromise,
      ]
      if (CGPromise) {
        promiseArr.push(CGPromise)
      }

      Promise.all(promiseArr)
        .then(() => {
          if (cardCanvas.value) {
            creatCard()
          }
        })
        .catch((e) => {
          console.error(e)
        })
    }
    const loadTextFont = async (fontSize, text) => {
      await document.fonts
        .load(`${fontSize}px Noto Sans SC`, text)
        .catch((e) => {
          console.error(e)
        })
    }
    const fontList = {
      title: {
        fontSize: 18,
      },
      name: {
        fontSize: 22,
      },
    }
    const writeText = (text, fontSize, color, shadow, x, y, context) => {
      context.fillStyle = color
      context.textBaseline = 'middle'
      context.textAlign = 'center'
      context.font = `${fontSize}px Noto Sans SC`
      const res = context.measureText(text)
      if (shadow) {
        context.shadowBlur = 3
        context.shadowColor = 'black'
        context.strokeText(text, x, y)
      }
      context.fillText(text, x, y)
      return res
    }

    const imageUrl = ref('')
    const creatCard = async () => {
      const canvas = cardCanvas.value
      canvas.width = 396
      canvas.height = 556
      const context = canvas.getContext('2d')

      if (img.CG) {
        context.drawImage(img.CG, 0, 0)
      }
      context.drawImage(img.star, 0, 0)
      context.drawImage(img.cry, 9, 10)
      context.drawImage(img.leftType, 16, 17)
      context.drawImage(img.rightType, 342, 12)

      await loadTextFont(fontList.title.fontSize, props.title)
      const titleRes = writeText(
        props.title,
        fontList.title.fontSize,
        '#ffffff',
        true,
        202,
        492,
        context
      )

      await loadTextFont(fontList.name.fontSize, props.name)
      console.log(props.name)
      const nameRes = writeText(
        props.name,
        fontList.name.fontSize,
        '#ffffff',
        true,
        202,
        526,
        context
      )
      console.log(titleRes, nameRes)
      emit('title-change', titleRes)
      emit('name-change', nameRes)

      imageUrl.value = canvas.toDataURL()
    }
    onMounted(() => {
      init()
    })
    return { cardCanvas, imageUrl }
  },
}
</script>
<style scoped>
.card-canvas-body {
  width: 100%;
  padding-bottom: 140.4040404040404%;
  position: relative;
  z-index: 1;
}
.card-canvas {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: none;
}
.card-image {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
}
</style>
