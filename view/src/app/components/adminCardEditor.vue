<template>
  <div class="disabled_select">
    <h6 class="common_title_tips type_dec">
      Tip:当前字体库为延时加载，请先确认字体是否有异样后再保存。
    </h6>
    <div class="mt20">
      <el-row>
        <el-col :sm="12">
          <div class="wm_creatcard_body">
            <div class="tc mb10"
                 v-show="!editPic">
              <img :src="
                  $wikimoecard.url +
                    cardSet.packageId +
                    '/' +
                    cardSet.cardId +
                    '.jpg?time=' +
                    timeStamp
                "
                   class="wm_admin_cardmanage_watchcard" />
            </div>
            <div id="wmCreatCard"
                 class="tc"
                 v-show="editPic"></div>
          </div>
          <div class="wm_creatcard_btn_body">
            <el-button size="mini"
                       type="primary"
                       @click="editPicMethods"
                       v-show="!editPic">更改立绘和属性</el-button>
            <el-button size="mini"
                       class="ml5"
                       @click="editPicCloseMethods"
                       v-show="editPic">取消更改</el-button>
          </div>
        </el-col>
        <el-col :sm="12"
                class="wm_admin_card_editor_form_body">
          <el-form class="wm_creatcard_form"
                   label-width="80px">
            <el-form-item label="立绘图片"
                          v-show="editPic">
              <el-upload action=""
                         :auto-upload="false"
                         :show-file-list="false"
                         accept="image/*"
                         :on-change="handleAvatarSuccess">
                <el-button size="small"
                           type="primary">{{
                  imageUrl ? "重新导入" : "点击导入"
                }}</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="原生图片"
                          v-show="editPic">
              <el-switch v-model="rawPicMode"
                         @change="rawPicModeChange">
              </el-switch>
            </el-form-item>
            <el-form-item label="立绘缩放"
                          v-show="editPic && !rawPicMode">
              <el-input-number v-model="cardSet.zoom"
                               :precision="2"
                               :step="1"
                               :min="minZoom"
                               :max="100"
                               @change="CGZoom"></el-input-number>
            </el-form-item>
            <el-form-item label="立绘柔化"
                          v-show="editPic && !rawPicMode">
              <el-switch v-model="cardSet.mipmap"
                         @change="mipmapChange">
              </el-switch>
            </el-form-item>
            <!-- <el-form-item label="立绘旋转"
                          v-show="editPic&&!rawPicMode">
              <el-input-number v-model="cardSet.rotation"
                               :precision="2"
                               :step="1"
                               :min="0"
                               :max="360"
                               @change="CGRotation "></el-input-number>
            </el-form-item> -->
            <el-form-item label="作者昵称">
              <el-input v-model="cardSet.auther"></el-input>
            </el-form-item>
            <el-form-item label="邮箱MD5">
              <el-input v-model="cardSet.md5"
                        @input="changeTitle"
                        class="wm_append_btn"
                        placeholder="点击生成，生成作者邮箱MD5"
                        readonly>
                <el-button slot="append"
                           @click="creatMD5">生成</el-button>
              </el-input>
            </el-form-item>
            <el-tooltip class="item"
                        effect="dark"
                        content="请尽量完整的输入作品全名！"
                        placement="top">
              <el-form-item label="作品全名">
                <el-input v-model="cardSet.title"
                          placeholder="请尽量完整的输入作品全名！"></el-input>
              </el-form-item>
            </el-tooltip>
            <el-tooltip class="item"
                        effect="dark"
                        content="用于卡框，如果和全名一样请点击同上"
                        placement="top">
              <el-form-item label="作品简称"
                            v-show="editPic && !rawPicMode">
                <el-input v-model="cardSet.titleS"
                          @input="changeTitle"
                          @blur="changeTitle"
                          class="wm_append_btn"
                          placeholder="用于卡框，如果和全名一样请点击同上">
                  <el-button slot="append"
                             @click="smallTitle">同上</el-button>
                </el-input>
              </el-form-item>
            </el-tooltip>
            <el-tooltip class="item"
                        effect="dark"
                        content="请尽量完整的输入角色全名！"
                        placement="top">
              <el-form-item label="角色全名">
                <el-input v-model="cardSet.name"
                          placeholder="请尽量完整的输入角色全名！"></el-input>
              </el-form-item>
            </el-tooltip>
            <el-tooltip class="item"
                        effect="dark"
                        content="用于卡框，如果和全名一样请点击同上"
                        placement="top">
              <el-form-item label="角色简称"
                            v-show="editPic && !rawPicMode">
                <el-input v-model="cardSet.nameS"
                          @input="changeName"
                          @blur="changeName"
                          class="wm_append_btn"
                          placeholder="用于卡框，如果和全名一样请点击同上">
                  <el-button slot="append"
                             @click="smallName">同上</el-button>
                </el-input>
              </el-form-item>
            </el-tooltip>
            <el-form-item label="星级">
              <el-select v-model="cardSet.star"
                         placeholder="请选择星级"
                         @change="changeStar"
                         :disabled="!editPic">
                <el-option label="1星"
                           :value="1"></el-option>
                <el-option label="2星"
                           :value="2"></el-option>
                <el-option label="3星"
                           :value="3"></el-option>
                <el-option label="4星"
                           :value="4"></el-option>
                <el-option label="5星"
                           :value="5"></el-option>
                <el-option label="6星"
                           :value="6"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="水晶">
              <el-select v-model="cardSet.cry"
                         placeholder="请选择水晶"
                         @change="changeCry"
                         :disabled="!editPic">
                <el-option label="火"
                           :value="1"></el-option>
                <el-option label="水"
                           :value="2"></el-option>
                <el-option label="风"
                           :value="3"></el-option>
                <el-option label="光"
                           :value="4"></el-option>
                <el-option label="暗"
                           :value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="被动属性">
              <el-select v-model="cardSet.leftType"
                         placeholder="请选择被动属性"
                         @change="changeLeftType"
                         :disabled="!editPic">
                <el-option label="全能"
                           :value="1"></el-option>
                <el-option label="兵攻"
                           :value="2"></el-option>
                <el-option label="盾防"
                           :value="3"></el-option>
                <el-option label="速度"
                           :value="4"></el-option>
                <el-option label="爱心"
                           :value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="主动技能">
              <el-select v-model="cardSet.rightType"
                         placeholder="请选择主动技能"
                         @change="changeRightType"
                         :disabled="!editPic">
                <el-option label="物"
                           :value="1"></el-option>
                <el-option label="魔"
                           :value="2"></el-option>
                <el-option label="防"
                           :value="3"></el-option>
                <el-option label="治"
                           :value="4"></el-option>
                <el-option label="妨"
                           :value="5"></el-option>
                <el-option label="支"
                           :value="6"></el-option>
                <el-option label="特"
                           :value="7"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import * as PIXI from "pixi.js";
import menuView from "../components/menu.vue";
import userTop from "../components/topUserInfo.vue";
import captcha from "../components/captcha";
import { authApi } from "../api";
import md5_ from "js-md5";

export default {
  props: {
    editorData: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      minZoom: 0,
      timeStamp: new Date().getTime(),
      editPic: false,
      rawPicMode: false,
      uploadCardUrl: "",
      captchaShow: false,
      token: sessionStorage.getItem("adminToken")
        ? sessionStorage.getItem("adminToken")
        : localStorage.getItem("adminToken"),
      app: null,
      cardSet: {
        _id: "",
        auther: "",
        md5: "",
        title: "",
        name: "",
        titleS: "",
        nameS: "",
        leftType: 1,
        rightType: 1,
        star: 3,
        cry: 1,
        zoom: 100,
        rotation: 0,
        mipmap: true
      },
      sprite: {
        starSprite: null,
        titleSprite: null,
        nameSprite: null,
        CGSprite: null,
        crySprite: null,
        leftTypeSprite: null,
        rightTypeSprite: null
      },
      imageUrl: ""
    };
  },
  mounted () {
    //this.drawCard();
    this.cardSet = Object.assign(this.cardSet, this.editorData);
  },
  watch: {
    editorData: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.cardSet = Object.assign(this.cardSet, newVal);
      }
    }
  },
  methods: {
    mipmapChange () {
      if (this.sprite.CGSprite.texture.textureCacheIds.length > 0) {
        this.sprite.CGSprite.texture.baseTexture.destroy()
        this.sprite.CGSprite.texture = PIXI.Texture.from(this.imageUrl, { mipmap: this.cardSet.mipmap ? PIXI.MIPMAP_MODES.ON : PIXI.MIPMAP_MODES.OFF });

      }
    },
    rawPicModeChange () {
      if (this.rawPicMode) {
        this.sprite.starSprite.destroy(true);
        this.sprite.titleSprite.destroy(true);
        this.sprite.nameSprite.destroy(true);
        this.sprite.crySprite.destroy(true);
        this.sprite.leftTypeSprite.destroy(true);
        this.sprite.rightTypeSprite.destroy(true);
      } else {
        this.app.destroy(true);
        this.drawCard();
      }
    },
    editPicCloseMethods () {
      this.editPic = false;
      if (this.app) {
        this.app.destroy(true);
        this.app = null;
        this.sprite = {
          starSprite: null,
          titleSprite: null,
          nameSprite: null,
          CGSprite: null,
          crySprite: null,
          leftTypeSprite: null,
          rightTypeSprite: null
        };
      }
    },
    editPicMethods () {
      this.editPic = true;
      this.drawCard();
    },
    creatMD5 () {
      this.$prompt("请输入邮箱地址", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: "邮箱格式不正确"
      })
        .then(({ value }) => {
          this.cardSet.md5 = md5_(value);
        })
        .catch(() => { });
    },
    creatCardNoText () {
      if (!this.cardSet.title) {
        this.$message.error("请输入作品全名");
        return false;
      }
      if (!this.cardSet.titleS && this.editPic && !this.rawPicMode) {
        this.$message.error("请输入作品简称");
        return false;
      }
      if (!this.cardSet.name) {
        this.$message.error("请输入角色全名");
        return false;
      }
      if (!this.cardSet.nameS && this.editPic && !this.rawPicMode) {
        this.$message.error("请输入角色简称");
        return false;
      }
      if (!this.imageUrl && this.editPic && !this.rawPicMode) {
        this.$message.error("请导入立绘");
        return false;
      }

      if (this.editPic) {
        if (!this.rawPicMode) {
          // 检测立绘位置是否合格
          const minWH = {
            width: 396,
            height: 556
          };
          const w = this.sprite.CGSprite.width;
          const h = this.sprite.CGSprite.height;
          const x = this.sprite.CGSprite.x;
          const y = this.sprite.CGSprite.y;
          if (w < minWH.width || h < minWH.height) {
            this.$message.error("立绘过小或者缩放过度，请检查！");
            return false;
          }
          // const centerPoint = { x: 198, y: 278 };
          // const w2 = w / 2 - centerPoint.x;
          // const h2 = h / 2 - centerPoint.y;
          // const pointLimt = {
          //   maxX: centerPoint.x + w2,
          //   minX: centerPoint.x - w2,
          //   maxY: centerPoint.y + h2,
          //   minY: centerPoint.y - h2
          // };
          // if (
          //   x > pointLimt.maxX ||
          //   x < pointLimt.minX ||
          //   y > pointLimt.maxY ||
          //   y < pointLimt.minY
          // ) {
          //   this.$message.error("立绘与卡牌之间有留白，请检查！");
          //   return false;
          // }
          //   检测出自简称字数有没有过多
          if (this.sprite.titleSprite.width > 128) {
            this.$message.error("作品简称字数过多，请检查！");
            return false;
          }
          //
          if (this.sprite.nameSprite.width > 318) {
            this.$message.error("角色简称字数过多，请检查！");
            return false;
          }
        }
        this.uploadCardUrl = this.app.view.toDataURL("image/jpeg", 0.9);
      }
      // let cardUrl = this.app.view.toDataURL("image/png");
      this.$confirm("<div>确认修改吗？</div>", "确认", {
        dangerouslyUseHTMLString: true,
        lockScroll: false,
        // distinguishCancelAndClose: true,
        customClass: "wm_crearchcard_watch",
        confirmButtonText: "修改",
        cancelButtonText: "关闭"
      })
        .then(() => {
          let params = {
            auther: this.cardSet.auther,
            md5: this.cardSet.md5,
            star: this.cardSet.star,
            leftType: this.cardSet.leftType,
            rightType: this.cardSet.rightType,
            cry: this.cardSet.cry,
            title: this.cardSet.title,
            name: this.cardSet.name,
            token: this.token,
            imgBase64: this.uploadCardUrl,
            id: this.cardSet._id,
            editPic: this.editPic
          };
          authApi.adminEditcard(params).then(res => {
            console.log(res);
            if (res.data.code == 0) {
              this.$message.error(res.data.msg);
            } else if (res.data.code == 1) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              // 更新指令
              this.$emit("cardUpdated", true);
            }
          });
        })
        .catch(action => { });
    },
    handleAvatarSuccess (file, fileList) {
      this.imageUrl = URL.createObjectURL(file.raw);
      let imageObj = new Image();
      imageObj.src = this.imageUrl;
      imageObj.onload = () => {
        const w = imageObj.width;
        const h = imageObj.height;
        if (w < 396 || h < 556) {
          this.$message.error('选择的立绘尺寸过小，请重新选择！立绘宽度不能小于396px，高度不能小于556px！');
        }
        const minWZoom = Math.ceil(396 / w * 100);
        const minHZoom = Math.ceil(556 / h * 100);
        this.minZoom = Math.max(minWZoom, minHZoom);

        this.sprite.CGSprite.texture = PIXI.Texture.from(this.imageUrl, { mipmap: this.cardSet.mipmap ? PIXI.MIPMAP_MODES.ON : PIXI.MIPMAP_MODES.OFF });
        this.sprite.CGSprite.position.set(0, 0);
        this.cardSet.zoom = this.minZoom;
        this.sprite.CGSprite.scale = new PIXI.Point(this.minZoom / 100, this.minZoom / 100);
        this.cardSet.rotation = 0;
        this.sprite.CGSprite.rotation = 0;
      };
    },
    changeStar () {
      if (!this.editPic || this.rawPicMode) {
        return false;
      }
      this.sprite.starSprite.texture = PIXI.Texture.from(
        "/static/otherImg/creatcard/star/" + this.cardSet.star + ".png"
      );
    },
    changeTitle () {
      this.sprite.titleSprite.text = this.cardSet.titleS;
    },
    smallTitle () {
      this.cardSet.titleS = this.cardSet.title;
      this.changeTitle();
    },
    changeName () {
      this.sprite.nameSprite.text = this.cardSet.nameS;
    },
    smallName () {
      this.cardSet.nameS = this.cardSet.name;
      this.changeName();
    },
    changeCry () {
      if (!this.editPic || this.rawPicMode) {
        return false;
      }
      this.sprite.crySprite.texture = PIXI.Texture.from(
        "/static/otherImg/creatcard/cry/" + this.cardSet.cry + ".png"
      );
    },
    changeLeftType () {
      if (!this.editPic || this.rawPicMode) {
        return false;
      }
      this.sprite.leftTypeSprite.texture = PIXI.Texture.from(
        "/static/otherImg/creatcard/leftType/" + this.cardSet.leftType + ".png"
      );
    },
    changeRightType () {
      if (!this.editPic || this.rawPicMode) {
        return false;
      }
      this.sprite.rightTypeSprite.texture = PIXI.Texture.from(
        "/static/otherImg/creatcard/rightType/" +
        this.cardSet.rightType +
        ".png"
      );
    },
    CGZoom () {
      this.sprite.CGSprite.scale = new PIXI.Point(
        this.cardSet.zoom / 100,
        this.cardSet.zoom / 100
      );
      const x = this.sprite.CGSprite.x;
      const y = this.sprite.CGSprite.y;
      const w = this.sprite.CGSprite.width;
      const h = this.sprite.CGSprite.height;
      const cW = 396;
      const cH = 556;
      const x2 = w + x - cW;
      if (x2 < 0) {
        this.sprite.CGSprite.x = x - x2
      }
      const y2 = h + y - cH;
      if (y2 < 0) {
        this.sprite.CGSprite.y = y - y2
      }
    },
    CGRotation () {
      this.sprite.CGSprite.rotation = (Math.PI / 180) * this.cardSet.rotation;
    },
    drawCard () {
      let that = this;
      const loader = new PIXI.Loader();
      const app = new PIXI.Application({
        width: 396,
        height: 556,
        backgroundColor: 0xffffff,
        resolution: 1,
        preserveDrawingBuffer: true
      });
      this.app = app;
      document.getElementById("wmCreatCard").appendChild(app.view);
      const moveIco = "url('/static/cur/move.cur'),move";
      app.renderer.plugins.interaction.cursorStyles.move = moveIco;
      const container = new PIXI.Container();
      container.sortableChildren = true;
      app.stage.addChild(container);
      // Create a new texture
      // 初始化
      // 星级
      let star = PIXI.Texture.from(
        "/static/otherImg/creatcard/star/" + this.cardSet.star + ".png"
      );
      this.sprite.starSprite = new PIXI.Sprite(star);
      this.sprite.starSprite.zIndex = 2;
      // 作品
      this.sprite.titleSprite = new PIXI.Text(this.cardSet.titleS, {
        fontFamily: "Noto Sans SC",
        fontSize: "18px",
        fill: 0xffffff,
        strokeThickness: 2,
        padding: 28
      });
      this.sprite.titleSprite.anchor.set(0.5, 0);
      this.sprite.titleSprite.position.set(202, 480);
      this.sprite.titleSprite.zIndex = 3;
      this.sprite.titleSprite.roundPixels = true;
      // 名字
      this.sprite.nameSprite = new PIXI.Text(this.cardSet.nameS, {
        fontFamily: "Noto Sans SC",
        fontSize: "22px",
        fill: 0xffffff,
        strokeThickness: 2,
        padding: 36
      });
      this.sprite.nameSprite.anchor.set(0.5, 0);
      this.sprite.nameSprite.position.set(202, 512);
      this.sprite.nameSprite.zIndex = 3;
      this.sprite.nameSprite.roundPixels = true;
      // 立绘
      this.sprite.CGSprite = new PIXI.Sprite();
      this.sprite.CGSprite.zIndex = 1;
      this.sprite.CGSprite.interactive = true;
      this.sprite.CGSprite.buttonMode = true;
      this.sprite.CGSprite.cursor = "move";
      this.sprite.CGSprite.anchor.set(0);
      this.sprite.CGSprite.on("pointerdown", onDragStart)
        .on("pointerup", onDragEnd)
        .on("pointerupoutside", onDragEnd)
        .on("pointermove", onDragMove);
      function onDragStart (event) {
        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
        this.data = event.data;
        this.dragging = true;
        this.oldPosition = this.data.getLocalPosition(this.parent);
        this.oldX = this.x;
        this.oldY = this.y;
      }

      function onDragEnd () {
        this.alpha = 1;
        this.dragging = false;
        // set the interaction data to null
        this.data = null;
      }

      function onDragMove () {
        if (this.dragging && !that.rawPicMode) {
          const newPosition = this.data.getLocalPosition(this.parent);
          this.x = this.oldX - (this.oldPosition.x - newPosition.x);
          this.y = this.oldY - (this.oldPosition.y - newPosition.y);
          if (this.x > 0) {
            this.x = 0;
          } else if (this.x < -that.sprite.CGSprite.width + 396) {
            this.x = -that.sprite.CGSprite.width + 396;
          }
          if (this.y > 0) {
            this.y = 0;
          } else if (this.y < -that.sprite.CGSprite.height + 556) {
            this.y = -that.sprite.CGSprite.height + 556;
          }
        }
      }
      // 水晶
      let cry = PIXI.Texture.from(
        "/static/otherImg/creatcard/cry/" + this.cardSet.cry + ".png"
      );
      this.sprite.crySprite = new PIXI.Sprite(cry);
      this.sprite.crySprite.position.set(9, 10);
      this.sprite.crySprite.zIndex = 3;
      // 被动属性
      let leftType = PIXI.Texture.from(
        "/static/otherImg/creatcard/leftType/" + this.cardSet.leftType + ".png"
      );
      this.sprite.leftTypeSprite = new PIXI.Sprite(leftType);
      this.sprite.leftTypeSprite.position.set(16, 17);
      this.sprite.leftTypeSprite.zIndex = 4;
      // 主动技能
      let rightType = PIXI.Texture.from(
        "/static/otherImg/creatcard/rightType/" +
        this.cardSet.rightType +
        ".png"
      );
      this.sprite.rightTypeSprite = new PIXI.Sprite(rightType);
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
      app.ticker.add(delta => {
        this.sprite.titleSprite.style = {
          fontFamily: "Noto Sans SC",
          fontSize: "18px",
          fill: 0xffffff,
          strokeThickness: 2,
          padding: 28
        };
        this.sprite.nameSprite.style = {
          fontFamily: "Noto Sans SC",
          fontSize: "22px",
          fill: 0xffffff,
          strokeThickness: 2,
          padding: 36
        };
      });
    }
  },
  beforeDestroy () {
    if (this.app) {
      this.app.destroy(true);
    }
  }
};
</script>

<style scoped>
.wm_admin_card_editor_form_body {
  max-height: 618px;
  overflow: auto;
}
.wm_creatcard_form {
  max-width: 500px;
  margin: 0 auto;
}
.wm_creatcard_btn_body {
  text-align: center;
  margin-bottom: 20px;
}
.common_body.type_creatcard {
  padding: 20px 10px;
}
.wm_crearcard_info_nopass {
  text-decoration: underline;
  cursor: url(/static/cur/pointer.cur), pointer;
}
.wm_admin_cardmanage_watchcard {
  border: 4px solid #000;
}
@media (max-width: 768px) {
  .common_body.type_creatcard {
    padding: 10px 10px 80px 10px;
  }
}
</style>
<style>
#wmCreatCard canvas {
  max-width: 95%;
  height: auto;
  display: inline-block;
  margin-bottom: 10px;
  border: 4px solid #000;
}
.wm_crearcard_info_body {
  border-top: 1px dashed #ccc;
}
</style>
<style>
@import url("https://fonts.loli.net/css?family=Noto+Sans+SC&display=swap");
</style>
