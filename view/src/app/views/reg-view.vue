<template>
  <div class="common_body">
    <h5 class="common_title">注册账号</h5>
    <el-form ref="form"
             :model="form"
             label-width="80px">
      <el-form-item label="邮箱地址">
        <el-input v-model="form.email"
                  @input="emailToLowerCase"
                  @blur="emailToLowerCase"
                  placeholder="请输入邮箱地址"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password"
                  show-password
                  placeholder="请输入4-16位英数字下划线减号"></el-input>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="form.nickName"
                  placeholder="昵称格式为2-8位中英日数字下划线"></el-input>
      </el-form-item>
      <el-form-item label="邮箱验证">
        <el-input v-model="form.code"
                  placeholder="请输入邮箱验证码"
                  type="tel">
          <el-button slot="append"
                     @click="openEmailDialog">发送验证码</el-button>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="onSubmit">注册抽卡</el-button>
        <el-button @click="backIndex">返回首页</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="请输入计算结果"
               :visible.sync="codeShow"
               class="reg_code_dialog"
               width="100%">
      <el-input placeholder="请输入计算结果"
                v-model="form.captcha"
                type="tel">
        <template slot="append"><img class="reg_code_img"
               :src="captchaSrc"
               @click="captchaUpdata"></template>
      </el-input>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="codeShow = false">取消</el-button>
        <el-button type="primary"
                   @click="sendEmailCode"
                   :disabled="sending">发送</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { authApi } from "../api";
import { mailCheck, passwordCheck, nickNameCheck } from "../../utils/utils";
export default {
  data () {
    return {
      captchaSrc: '/api/captcha?time=' + new Date().getTime(),
      sending: false,
      codeShow: false,
      form: {
        email: '',
        password: '',
        code: '',
        nickName: '',
        captcha: ''
      }
    }
  },
  mounted () {
    this.$emit('l2dMassage', '注册账号，享受抽卡吧！');
    if (this.$route.query.adr) {
      this.form.email = atob(this.$route.query.adr);
    }
  },
  methods: {
    captchaUpdata () {
      this.captchaSrc = '/api/captcha?time=' + new Date().getTime();
    },
    openEmailDialog () {
      //检查格式
      if (!mailCheck(this.form.email)) {
        this.$message.error('邮箱格式有误！');
        return false;
      }
      this.captchaSrc = '/api/captcha?time=' + new Date().getTime();
      this.codeShow = true;
    },
    sendEmailCode () {
      if (this.form.captcha == '') {
        this.$message.error('请输入图形验证码！');
        return false;
      }
      this.sending = true;
      let params = {
        email: this.form.email,
        captcha: this.form.captcha,
        type: 'reg'
      };
      authApi.sendmail(params).then(res => {
        console.log(res);
        this.captchaUpdata();
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
          this.codeShow = false;
        }
        setTimeout(() => {
          this.sending = false;
        }, 500);
      });
    },
    onSubmit () {
      //检查格式
      if (!mailCheck(this.form.email)) {
        this.$message.error('邮箱格式有误！');
        return false;
      }
      if (!passwordCheck(this.form.password)) {
        this.$message.error('密码必须为4-16位英数字下划线减号！');
        return false;
      }
      if (!nickNameCheck(this.form.nickName)) {
        this.$message.error('昵称只能允许为2-8位中英日数字与下划线！');
        return false;
      }
      if (this.form.code == '') {
        this.$message.error('请输入邮箱验证码！');
        return false;
      }
      let params = {
        email: this.form.email,
        password: this.form.password,
        nickName: this.form.nickName,
        emailCode: this.form.code,
      };
      authApi.reg(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.error(res.data.msg);
        } else if (res.data.code == 1) {
          let resData = res.data;
          sessionStorage.setItem("token", resData.token);
          this.$alert('恭喜您，注册成功并获得了新人福利！可以在【结缘】中进行抽卡！', '提示', {
            confirmButtonText: '确定',
            showClose: false,
            callback: action => {
              this.$router.push({ path: '/' });
            }
          });
        }
      })
    },
    backIndex () {
      this.$router.push({ path: '/' });
    },
    emailToLowerCase () {
      this.form.email = this.form.email.toLowerCase();
    }
  }
}
</script>

<style lang="stylus" scoped></style>
