<template>
  <el-dialog title="请输入计算结果"
             :visible.sync="codeShow"
             class="reg_code_dialog"
             width="100%"
             :lock-scroll="false"
             :close-on-click-modal="false">
    <el-input placeholder="请输入计算结果"
              v-model="captcha"
              type="tel"
              @keyup.enter.native="goto()">
      <template slot="append">
        <img class="reg_code_img"
             :src="captchaSrc"
             @click="captchaUpdata">
      </template>
    </el-input>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="codeShow = false">取消</el-button>
      <el-button type="primary"
                 @click="goto">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    codeDigShow: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      codeShow: this.codeDigShow,
      captcha: '',
      captchaSrc: '/api/captcha?time=' + new Date().getTime(),
    }
  },
  watch: {
    codeShow (v) {
      this.$emit('captchaShow', v);
    },
    codeDigShow (val) {
      this.codeShow = val;
    }
  },
  methods: {
    captchaUpdata () {
      this.captchaSrc = '/api/captcha?time=' + new Date().getTime();
    },
    goto () {
      this.$emit('send', this.captcha);
    }
  }
}
</script>

<style lang="stylus" scoped></style>
