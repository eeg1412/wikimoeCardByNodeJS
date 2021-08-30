<template>
  <div class="common_body">
    <h2 class="tc mb20">注册账号</h2>
    <div class="p-fluid">
      <div class="p-field">
        <h5 class="mb5">账号：</h5>
        <InputText
          type="text"
          v-model="account"
          placeholder="账号支持2-16位英数字下划线减号"
        />
      </div>
      <div class="p-field">
        <h5 class="mb5">昵称：</h5>
        <InputText
          type="text"
          v-model="nickName"
          placeholder="昵称支持2-8位中英日数字与下划线"
        />
      </div>
      <div class="p-field">
        <h5 class="mb5">密码：</h5>
        <Password
          v-model="password"
          toggleMask
          :feedback="false"
          placeholder="密码支持2-16位中英日数字与下划线"
        ></Password>
      </div>
      <div class="p-field">
        <h5 class="mb5">确认密码：</h5>
        <Password
          v-model="password2"
          toggleMask
          :feedback="false"
          placeholder="请再输入一次密码"
        ></Password>
      </div>
      <div class="p-field">
        <h5 class="mb5">验证码：</h5>
        <div class="p-inputgroup">
          <InputText
            type="text"
            v-model="captcha"
            placeholder="请计算右侧算式结果"
          />
          <img :src="captchaSrc" class="reg_code_img" @click="reflushCaptcha" />
        </div>
      </div>
    </div>
    <div class="tc">
      <Button label="注册" class="register-btn" @click="goRegister" />
      <Button
        label="返回"
        class="p-button-secondary register-btn"
        @click="back"
      />
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import { authApi } from '@/api'
import { useToast } from 'primevue/usetoast'
import store from '@/store'
import { useRouter } from 'vue-router'

export default {
  components: { InputText, Password, Button },
  setup() {
    const toast = useToast()

    const account = ref('')
    const nickName = ref('')
    const password = ref('')
    const password2 = ref('')
    const captcha = ref('')

    // captcha
    const captchaSrc = ref('/api/captcha?time=' + new Date().getTime())
    const reflushCaptcha = () => {
      captchaSrc.value = '/api/captcha?time=' + new Date().getTime()
    }

    const router = useRouter()
    // register
    const goRegister = () => {
      // 校验是否为空
      if (!account.value) {
        toast.add({
          severity: 'error',
          summary: '错误',
          detail: '账号不能为空',
          life: 3000,
        })
        return false
      }
      if (!nickName.value) {
        toast.add({
          severity: 'error',
          summary: '错误',
          detail: '昵称不能为空',
          life: 3000,
        })
        return false
      }
      if (!password.value) {
        toast.add({
          severity: 'error',
          summary: '错误',
          detail: '密码不能为空',
          life: 3000,
        })
        return false
      }
      if (!captcha.value) {
        toast.add({
          severity: 'error',
          summary: '错误',
          detail: '验证码不能为空',
          life: 3000,
        })
        return false
      }
      if (password.value !== password2.value) {
        toast.add({
          severity: 'error',
          summary: '错误',
          detail: '两次密码不一致',
          life: 3000,
        })
        return false
      }
      const params = {
        account: account.value,
        nickName: nickName.value,
        password: password.value,
        captcha: captcha.value,
      }
      authApi.register(params).then((res) => {
        reflushCaptcha()
        console.log(res)
        const { data } = res
        if (data.code === 1) {
          sessionStorage.setItem('token', res.data.token)
          store.commit('setToken', res.data.token)
          router.replace({
            name: 'Home',
          })
        } else {
          toast.add({
            severity: 'error',
            summary: '错误',
            detail: data.msg,
            life: 3000,
          })
        }
      })
    }

    const back = () => {
      router.replace({
        name: 'Home',
      })
    }

    return {
      account,
      nickName,
      password,
      password2,
      captcha,
      captchaSrc,
      reflushCaptcha,
      goRegister,
      back,
    }
  },
}
</script>
<style scoped>
.register-btn {
  margin-right: 10px;
}
</style>
