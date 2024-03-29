<template>
  <div class="login" :style="'background-image:url('+ Background +');'">
    <a-form-model ref="loginForm" :model="loginForm" :rules="loginRules" label-position="left" label-width="0px"
                  class="login-form">
      <h3 class="title">
        Huang Blog
      </h3>
      <a-form-model-item prop="username">
        <a-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
          <a-icon slot="prefix" style="color: rgba(0, 0, 0, 0.25)" type="user"/>
        </a-input>
      </a-form-model-item>
      <a-form-model-item prop="password">
        <a-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码"
                 @keyup.enter.native="handleLogin">
          <a-icon slot="prefix" style="color: rgba(0, 0, 0, 0.25)" type="lock"/>
        </a-input>
      </a-form-model-item>
      <a-form-model-item prop="code">
        <a-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%"
                 @keyup.enter.native="handleLogin">
          <a-icon slot="prefix" style="color: rgba(0, 0, 0, 0.25)" type="safety-certificate"/>
        </a-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode">
        </div>
      </a-form-model-item>
      <a-checkbox v-model="loginForm.rememberMe" style="margin:0 0 25px 0;">
        记住我
      </a-checkbox>
      <a-form-model-item style="width:100%;">
        <a-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </a-button>
      </a-form-model-item>
    </a-form-model>
    <!--  底部  -->
    <div class="footer" v-html="$store.state.settings.footerTxt">
    </div>
  </div>
</template>

<script>
import {encrypt} from '@/utils/rsaEncrypt'
import Config from '@/default-settings'
import {login, getCodeImg} from '@/api/login'
import {setToken} from '@/utils/auth'
import Cookies from 'js-cookie'
import qs from 'qs'
import Background from '@/assets/images/background.jpg'

export default {
  name: 'Login',
  data() {
    return {
      Background: Background,
      codeUrl: '',
      cookiePass: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        code: '',
        uuid: ''
      },
      loginRules: {
        username: [{required: true, trigger: 'blur', message: '用户名不能为空'}],
        password: [{required: true, trigger: 'blur', message: '密码不能为空'}],
        code: [{required: true, trigger: 'change', message: '验证码不能为空'}]
      },
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        const data = route.query
        if (data && data.redirect) {
          this.redirect = data.redirect
          delete data.redirect
          if (JSON.stringify(data) !== '{}') {
            this.redirect = this.redirect + '&' + qs.stringify(data, {indices: false})
          }
        }
      },
      immediate: true
    }
  },
  created() {
    // 获取验证码
    this.getCode()
    // 获取用户名密码等Cookie
    this.getCookie()
    // token 过期提示
    this.point()
  },
  methods: {
    getCode() {
      getCodeImg().then(response => {
        this.codeUrl = response.img
        this.loginForm.uuid = response.uuid
        this.loginForm.code = ''
      })
    },
    getCookie() {
      const username = Cookies.get('username')
      let password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      // 保存cookie里面的加密后的密码
      this.cookiePass = password === undefined ? '' : password
      password = password === undefined ? this.loginForm.password : password
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
        code: ''
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        const user = {
          username: this.loginForm.username,
          password: this.loginForm.password,
          rememberMe: this.loginForm.rememberMe,
          code: this.loginForm.code,
          uuid: this.loginForm.uuid
        }
        if (user.password !== this.cookiePass) {
          user.password = encrypt(user.password)
        }
        if (valid) {
          this.loading = true
          if (user.rememberMe) {
            Cookies.set('username', user.username, {expires: Config.passCookieExpires})
            Cookies.set('password', user.password, {expires: Config.passCookieExpires})
            Cookies.set('rememberMe', user.rememberMe, {expires: Config.passCookieExpires})
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          login(user)
              .then(response => {
                if (response.code === 1) {
                  this.loading = false
                  setToken(response.user.token, user.rememberMe)
                  this.$store.dispatch('user/setUser',response.user);
                  this.$router.push({path: this.redirect || '/'})
                } else {
                  this.loading = false
                  this.$message.error(response.msg)
                  this.getCode()
                }
              }).catch(() => {
            this.loading = false
            this.getCode()
          })
        } else {
          return false
        }
      })
    },
    point() {
      const point = Cookies.get('point') !== undefined
      if (point) {
        this.$notification.warn({
          title: '提示',
          message: '当前登录状态已过期，请重新登录！',
          type: 'warning',
          duration: 1
        })
        Cookies.remove('point')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-size: cover;
}

.title {
  margin: 0 auto 30px auto;
  font-size: 20px;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 385px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  display: inline-block;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle
  }
}
.footer {
  overflow: hidden;
  height: 33px;
  font-size: 0.7rem !important;
  font-family: Arial, sans-serif !important;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  a {
    color: white !important;
  }
}
</style>
