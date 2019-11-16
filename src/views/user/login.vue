<template>
  <div class="page-login">
    <van-nav-bar left-arrow @click-left="$router.back()" title="登 录"></van-nav-bar>
    <van-cell-group>
      <van-field
        @blur="checkMobile"
        :error-message="errMsg.mobile"
        v-model="loginForm.mobile"
        label="手机号"
        placeholder="请输入手机号"
      />
      <van-field
        @blur="checkCode"
        :error-message="errMsg.code"
        v-model="loginForm.code"
        label="验证码"
        placeholder="请输入验证码"
      >
        <van-button class="p10" slot="button" size="mini" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="btn_box">
      <van-button type="info" @click="login" block round>登 录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        mobile: '13911111111',
        code: '246810'
      },
      errMsg: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    checkMobile () {
      // 非空
      if (!this.loginForm.mobile) {
        this.errMsg.mobile = '请输入手机号'
        return false
      }
      // 格式
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errMsg.mobile = '请输入正确的手机号'
        return false
      }
      this.errMsg.mobile = ''
    },
    checkCode () {
      // 非空
      if (!this.loginForm.code) {
        this.errMsg.code = '请输入验证码'
        return false
      }
      // 格式
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errMsg.code = '请输入正确的验证码'
        return false
      }
      // 成功
      this.errMsg.code = ''
    },
    async login () {
    // 对整体表单进行校验
      this.checkMobile()
      this.checkCode()
      // 判断errMsg对象中是否有错误信息   校验失败
      if (this.errMsg.mobile || this.errMsg.code) {
        return false
      }
      // 如果校验成功进行登录
      try {
      // 基于request.js在api目录下封装一个调用接口的函数，当组件导入该函数使用即可。
        const data = await login(this.loginForm)
        // 登录成功
        // 1. 更新 vuex 和 本地存储 用户信息
        this.setUser(data)
        // 2. 跳转（如果地址栏有回跳地址哪就回跳，如果没有跳转到个人中心）
        const { redirectUrl } = this.$route.query
        // || && 短路或 短路与
        this.$router.push(redirectUrl || '/user')
      } catch (e) {
      // 登录失败
        this.$toast.fail('手机号或验证码错误')
      }
    },
    ...mapMutations(['setUser'])
  }
}
</script>

<style scoped lang='less'>
.p5 {
  padding: 0 5px;
}
.btn_box {
  padding: 10px;
  .van-button {
    height: 32px;
    line-height: 30px;
  }
}
</style>
