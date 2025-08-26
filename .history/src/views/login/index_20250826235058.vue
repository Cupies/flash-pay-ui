<template>
  <div class="login-container">
    <!-- 背景装饰层 -->
    <div class="login-bg-decoration">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>

    <div class="loginbox">
      <!-- 登录表单区 -->
      <div class="rights" v-if="!isRegistry" :class="{ 'scale-in': true }">
        <!-- 标题切换栏 -->
        <div class="title-bar">
          <span 
            class="title-tab" 
            :class="{ active: !flag }" 
            @click="goAccount"
          >
            账户密码登录
          </span>
          <span 
            class="title-tab" 
            :class="{ active: flag }" 
            @click="goPhone"
          >
            手机号登录
          </span>
        </div>

        <!-- 账户密码登录表单 -->
        <el-form
          ref="loginFormAccount"
          :model="loginForm"
          class="login-form"
          autocomplete="on"
          label-position="left"
          v-if="!flag"
        >
          <el-form-item 
            prop="usernames" 
            class="form-item"
            :error="formErrors.username"
          >
            <div class="input-wrapper">
              <i class="icon el-icon-user"></i>
              <el-input
                ref="username"
                name="username"
                v-model="loginForm.usernames"
                type="text"
                autocomplete="on"
                placeholder="手机号/用户名"
                class="form-input"
                @focus="clearError('username')"
              />
            </div>
          </el-form-item>

          <el-form-item 
            prop="password" 
            class="form-item"
            :error="formErrors.password"
          >
            <div class="input-wrapper">
              <i class="icon el-icon-lock"></i>
              <el-input
                :key="passwordType"
                ref="password"
                :type="passwordType"
                v-model="loginForm.password"
                placeholder="请输入密码"
                name="password"
                autocomplete="on"
                class="form-input"
                @keyup.enter.native="handleLogin"
                @focus="clearError('password')"
              />
              <i 
                class="show-pwd-icon" 
                :class="{ 'el-icon-view': passwordType === 'password', 'el-icon-view-off': passwordType === 'text' }"
                @click="showPwd"
              ></i>
            </div>
          </el-form-item>

          <el-button
            type="primary"
            class="login-btn"
            :loading="loading"
            @click.native.prevent="handleLogin"
          >
            登录
          </el-button>
        </el-form>

        <!-- 手机号登录表单 -->
        <el-form
          ref="loginFormPhone"
          :model="loginForms"
          class="login-form"
          autocomplete="on"
          label-position="left"
          v-if="flag"
        >
          <el-form-item 
            prop="phone" 
            class="form-item"
            :error="formErrors.phone"
          >
            <div class="input-wrapper">
              <i class="icon el-icon-phone"></i>
              <el-input
                ref="username"
                name="phone"
                v-model="loginForms.phone"
                type="tel"
                autocomplete="on"
                placeholder="请输入手机号"
                class="form-input"
                @focus="clearError('phone')"
              />
            </div>
          </el-form-item>

          <el-form-item 
            prop="code" 
            class="form-item"
            :error="formErrors.code"
          >
            <div class="input-wrapper code-input-wrapper">
              <i class="icon el-icon-sms"></i>
              <el-input
                :key="passwordType"
                ref="password"
                type="text"
                v-model="loginForms.code"
                placeholder="请输入验证码"
                name="code"
                autocomplete="on"
                class="form-input code-input"
                @focus="clearError('code')"
              />
              <button
                type="button"
                class="get-code-btn"
                :disabled="!canClicks"
                @click="getCodes"
              >
                {{ codes }}
              </button>
            </div>
          </el-form-item>

          <el-button
            type="primary"
            class="login-btn"
            :loading="loading"
            @click.native.prevent="handleLogins"
          >
            登录
          </el-button>
        </el-form>

        <!-- 注册入口 -->
        <div class="form-footer">
          <span 
            class="registry-link" 
            @click="registry"
          >
            还没有账号？立即注册
          </span>
        </div>
      </div>

      <!-- 注册表单区 -->
      <div class="registry-form" v-if="isRegistry" :class="{ 'scale-in': true }">
        <div class="form-header">
          <h3 class="registry-title">注册账户</h3>
          <span 
            class="back-login" 
            @click="isRegistry = false"
          >
            <i class="el-icon-arrow-left"></i> 返回登录
          </span>
        </div>

        <el-form
          label-position="left"
          class="login-form registry-inner-form"
        >
          <el-form-item 
            class="form-item"
            :error="formErrors.regUsername"
          >
            <div class="input-wrapper">
              <i class="icon el-icon-user"></i>
              <el-input
                v-model="registryForm.username"
                type="text"
                placeholder="请输入用户名"
                class="form-input"
                @focus="clearError('regUsername')"
              />
            </div>
          </el-form-item>

          <el-form-item 
            class="form-item"
            :error="formErrors.regPassword"
          >
            <div class="input-wrapper">
              <i class="icon el-icon-lock"></i>
              <el-input
                v-model="registryForm.password"
                placeholder="请输入密码（6-16位字符）"
                type="password"
                class="form-input"
                @focus="clearError('regPassword')"
              />
            </div>
          </el-form-item>

          <el-form-item 
            class="form-item"
            :error="formErrors.regMobile"
          >
            <div class="input-wrapper">
              <i class="icon el-icon-phone"></i>
              <el-input
                v-model="registryForm.mobile"
                placeholder="请输入手机号"
                type="tel"
                class="form-input"
                @focus="clearError('regMobile')"
              />
            </div>
          </el-form-item>

          <el-form-item 
            class="form-item"
            :error="formErrors.regCode"
          >
            <div class="input-wrapper code-input-wrapper">
              <i class="icon el-icon-sms"></i>
              <el-input
                v-model="registryForm.verifiyCode"
                placeholder="请输入验证码"
                class="form-input code-input"
                @focus="clearError('regCode')"
              />
              <button
                type="button"
                class="get-code-btn"
                :disabled="!canClick"
                @click="getCode"
              >
                {{ content }}
              </button>
            </div>
          </el-form-item>

          <el-button
            type="primary"
            class="login-btn registry-btn"
            :loading="loading"
            @click.native.prevent="goRegistry"
          >
            注册并登录
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login, getLoginCode, getMsgCode, registryData } from '@/api/users'
import { userStore } from '@/store/modules/user'

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const userStoreInstance = userStore()

    // 表单数据
    const loginForm = ref({ usernames: '', password: '' })
    const loginForms = ref({ phone: '', code: '', smsKey: '' })
    const registryForm = ref({
      mobile: '',
      username: '',
      password: '',
      verifiykey: '',
      verifiyCode: ''
    })

    // 状态管理
    const passwordType = ref('password')
    const loading = ref(false)
    const redirect = ref('')
    const otherQuery = ref({})
    const flag = ref(false) // 切换登录方式
    const isRegistry = ref(false) // 切换登录/注册
    const content = ref('获取验证码') // 注册验证码文本
    const codes = ref('获取验证码') // 登录验证码文本
    const canClick = ref(true) // 注册验证码按钮状态
    const totalTime = ref(60) // 注册倒计时
    const canClicks = ref(true) // 登录验证码按钮状态
    const totalTimes = ref(60) // 登录倒计时
    const formErrors = ref({}) // 表单错误提示
    let cloak = null // 定时器

    // 路由参数处理
    const getOtherQuery = (query) => {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') acc[cur] = query[cur]
        return acc
      }, {})
    }

    // 监听路由变化
    watch(() => route, (newRoute) => {
      const query = newRoute.query
      if (query) {
        redirect.value = query.redirect
        otherQuery.value = getOtherQuery(query)
      }
    }, { immediate: true, deep: true })

    // 清除表单错误
    const clearError = (key) => {
      formErrors.value[key] = ''
    }

    // 切换登录方式
    const goAccount = () => { flag.value = false }
    const goPhone = () => { flag.value = true }

    // 切换注册/登录
    const registry = () => {
      isRegistry.value = true
      // 重置注册表单错误
      formErrors.value = {}
    }

    // 登录验证码倒计时
    const getCodes = async () => {
      if (!loginForms.value.phone) {
        formErrors.value.phone = '手机号不能为空'
        return
      }
      if (!/^1[3-9]\d{9}$/.test(loginForms.value.phone)) {
        formErrors.value.phone = '请输入正确的手机号'
        return
      }

      if (!canClicks.value) return
      canClicks.value = false
      codes.value = `${totalTimes.value}s后重新发送`

      // 倒计时逻辑
      cloak = setInterval(() => {
        totalTimes.value--
        if (totalTimes.value > 0) {
          codes.value = `${totalTimes.value}s后重新发送`
        } else {
          clearInterval(cloak)
          codes.value = '重新发送验证码'
          totalTimes.value = 60
          canClicks.value = true
        }
      }, 1000)

      // 请求验证码
      try {
        const res = await getLoginCode(loginForms.value.phone)
        loginForms.value.smsKey = res
        ElMessage.success('验证码已发送，请注意查收')
      } catch (error) {
        console.error(error)
        ElMessage.error('获取验证码失败，请稍后重试')
        // 失败后重置按钮
        clearInterval(cloak)
        codes.value = '重新发送验证码'
        totalTimes.value = 60
        canClicks.value = true
      }
    }

    // 注册验证码倒计时
    const getCode = async () => {
      if (!registryForm.value.mobile) {
        formErrors.value.regMobile = '手机号不能为空'
        return
      }
      if (!/^1[3-9]\d{9}$/.test(registryForm.value.mobile)) {
        formErrors.value.regMobile = '请输入正确的手机号'
        return
      }

      if (!canClick.value) return
      canClick.value = false
      content.value = `${totalTime.value}s后重新发送`

      // 倒计时逻辑
      cloak = setInterval(() => {
        totalTime.value--
        if (totalTime.value > 0) {
          content.value = `${totalTime.value}s后重新发送`
        } else {
          clearInterval(cloak)
          content.value = '重新发送验证码'
          totalTime.value = 60
          canClick.value = true
        }
      }, 1000)

      // 请求验证码
      try {
        const res = await getMsgCode(registryForm.value.mobile)
        registryForm.value.verifiykey = res
        ElMessage.success('验证码已发送，请注意查收')
      } catch (error) {
        console.error(error)
        ElMessage.error('获取验证码失败，请稍后重试')
        // 失败后重置按钮
        clearInterval(cloak)
        content.value = '重新发送验证码'
        totalTime.value = 60
        canClick.value = true
      }
    }

    // 注册逻辑
    const goRegistry = async () => {
      // 表单验证
      const errors = {}
      if (!registryForm.value.username) errors.regUsername = '用户名不能为空'
      if (!registryForm.value.password) {
        errors.regPassword = '密码不能为空'
      } else if (registryForm.value.password.length < 6 || registryForm.value.password.length > 16) {
        errors.regPassword = '密码长度需为6-16位'
      }
      if (!registryForm.value.mobile) {
        errors.regMobile = '手机号不能为空'
      } else if (!/^1[3-9]\d{9}$/.test(registryForm.value.mobile)) {
        errors.regMobile = '请输入正确的手机号'
      }
      if (!registryForm.value.verifiyCode) errors.regCode = '验证码不能为空'
      
      // 存在错误则提示
      if (Object.keys(errors).length > 0) {
        formErrors.value = errors
        return
      }

      try {
        loading.value = true
        const res = await registryData(registryForm.value)
        if (res) {
          ElMessage.success('注册成功，即将跳转登录')
          setTimeout(() => {
            isRegistry.value = false
            // 重置注册表单
            registryForm.value = {
              mobile: '',
              username: '',
              password: '',
              verifiykey: '',
              verifiyCode: ''
            }
          }, 1500)
        } else {
          ElMessage.error('注册失败，请检查信息后重试')
        }
      } catch (error) {
        console.error(error)
        ElMessage.error('注册失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }

    // 显示/隐藏密码
    const showPwd = () => {
      passwordType.value = passwordType.value === 'password' ? 'text' : 'password'
    }

    // 账户密码登录
    const handleLogin = async () => {
      // 表单验证
      const errors = {}
      if (!loginForm.value.usernames) errors.username = '账号不能为空'
      if (!loginForm.value.password) errors.password = '密码不能为空'
      
      if (Object.keys(errors).length > 0) {
        formErrors.value = errors
        return
      }

      try {
        loading.value = true
        // 存储账号（密码建议加密存储或不存储，此处保留原逻辑）
        localStorage.setItem('username', loginForm.value.usernames)
        localStorage.setItem('password', loginForm.value.password)
        
        await userStoreInstance.Login(loginForm.value)
        router.push({
          path: redirect.value || '/',
          query: otherQuery.value
        })
        ElMessage.success('登录成功')
      } catch (error) {
        console.error(error)
        ElMessage.error('账号或密码错误，请重新输入')
      } finally {
        loading.value = false
      }
    }

    // 手机号登录
    const handleLogins = async () => {
      // 表单验证
      const errors = {}
      if (!loginForms.value.phone) {
        errors.phone = '手机号不能为空'
      } else if (!/^1[3-9]\d{9}$/.test(loginForms.value.phone)) {
        errors.phone = '请输入正确的手机号'
      }
      if (!loginForms.value.code) errors.code = '验证码不能为空'
      
      if (Object.keys(errors).length > 0) {
        formErrors.value = errors
        return
      }

      try {
        loading.value = true
        await userStoreInstance.Logins(loginForms.value)
        router.push({
          path: redirect.value || '/',
          query: otherQuery.value
        })
        ElMessage.success('登录成功')
      } catch (error) {
        console.error(error)
        ElMessage.error('验证码错误或已过期，请重新获取')
      } finally {
        loading.value = false
      }
    }

    // 组件卸载时清除定时器
    onUnmounted(() => {
      if (cloak) clearInterval(cloak)
    })

    return {
      loginForm,
      loginForms,
      registryForm,
      passwordType,
      loading,
      redirect,
      otherQuery,
      flag,
      isRegistry,
      content,
      codes,
      canClick,
      totalTime,
      canClicks,
      totalTimes,
      formErrors,
      goAccount,
      goPhone,
      registry,
      getCodes,
      getCode,
      goRegistry,
      showPwd,
      handleLogin,
      handleLogins,
      clearError
    }
  }
})
</script>

<style lang="scss">


// 全局样式变量
$primary-color: #409eff;
$primary-light: #66b1ff;
$primary-dark: #337ecc;
$bg-color: #f5f7fa;
$text-primary: #333;
$text-secondary: #666;
$text-placeholder: #999;
$border-color: #e5e6eb;
$error-color: #f56c6c;
$white: #fff;
$shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
$transition: all 0.3s ease;

// 全局样式重置
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background-color: $bg-color;
}

// 图标基础样式
.icon {
  color: $text-placeholder;
  font-size: 16px;
  transition: $transition;
}

// 输入框聚焦时图标颜色变化
.form-input:focus + .show-pwd-icon,
.form-input:focus ~ .icon {
  color: $primary-color;
}
</style>

<style lang="scss" scoped>
// 导入变量
$primary-color: #409eff;
$primary-light: #66b1ff;
$primary-dark: #337ecc;
$bg-color: #f5f7fa;
$text-primary: #333;
$text-secondary: #666;
$text-placeholder: #999;
$border-color: #e5e6eb;
$error-color: #f56c6c;
$white: #fff;
$shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
$transition: all 0.3s ease;

// 登录容器主样式
.login-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4eaf5 100%);

  // 背景装饰圆
  .login-bg-decoration {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    .bg-circle {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba($primary-color, 0.1) 0%, rgba($primary-light, 0) 100%);
      transition: $transition;
    }

    .circle-1 {
      width: 600px;
      height: 600px;
      top: -200px;
      right: -200px;
    }

    .circle-2 {
      width: 400px;
      height: 400px;
      bottom: -150px;
      left: -150px;
    }

    .circle-3 {
      width: 200px;
      height: 200px;
      top: 30%;
      left: 10%;
    }
  }

  // 登录框外层容器
  .loginbox {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;

    // 登录表单卡片
    .rights,
    .registry-form {
      width: 100%;
      max-width: 420px;
      background: $white;
      border-radius: 16px;
      box-shadow: $shadow;
      padding: 40px;
      position: relative;
      z-index: 2;
      transition: $transition;

      // 入场动画
      &.scale-in {
        animation: scaleIn 0.4s ease forwards;
      }

      // 登录标题栏
      .title-bar {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 30px;

        .title-tab {
          font-size: 18px;
          font-weight: 500;
          color: $text-secondary;
          margin: 0 25px;
          cursor: pointer;
          position: relative;
          padding-bottom: 8px;
          transition: $transition;

          &:hover {
            color: $primary-color;
          }

          // 激活状态
          &.active {
            color: $primary-color;
            font-weight: 600;
          }

          // 激活下划线
          &.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, $primary-light, $primary-color);
            border-radius: 3px;
          }
        }
      }

      // 表单底部链接
      .form-footer {
        margin-top: 24px;
        text-align: center;

        .registry-link {
          color: $primary-color;
          font-size: 14px;
          cursor: pointer;
          transition: $transition;

          &:hover {
            color: $primary-dark;
            text-decoration: underline;
          }
        }
      }
    }

    // 注册表单卡片
    .registry-form {
      max-width: 480px;
      padding: 40px;

      // 注册表单头部
      .form-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;

        .registry-title {
          font-size: 22px;
          font-weight: 600;
          color: $primary-color;
        }

        .back-login {
          color: $text-secondary;
          font-size: 14px;
          cursor: pointer;
          transition: $transition;

          &:hover {
            color: $primary-color;
          }

          i {
            margin-right: 4px;
          }
        }
      }

      // 注册表单内部间距
      .registry-inner-form {
        margin-top: 10px;
      }
    }

    // 表单样式
    .login-form {
      width: 100%;
      margin-top: 10px;

      // 表单项样式
      .form-item {
        margin-bottom: 22px;
        border-radius: 8px;
        transition: $transition;

        // 错误状态
        &.is-error {
          .input-wrapper {
            border-color: $error-color;

            .icon {
              color: $error-color;
            }
          }
        }

        // 输入框容器
        .input-wrapper {
          display: flex;
          align-items: center;
          border: 1px solid $border-color;
          border-radius: 8px;
          padding: 0 16px;
          transition: $transition;

          &:hover {
            border-color: $primary-light;
            box-shadow: 0 0 0 2px rgba($primary-color, 0.08);
          }

          // 验证码输入框特殊样式
          &.code-input-wrapper {
            justify-content: space-between;
            padding-right: 8px;
          }

          // 输入框样式
          .form-input {
            flex: 1;
            height: 52px;
            border: none;
            outline: none;
            font-size: 15px;
            color: $text-primary;
            background: transparent;
            padding: 0;

            &::placeholder {
              color: $text-placeholder;
              font-size: 14px;
            }
          }

          // 验证码输入框
          .code-input {
            padding-right: 8px;
          }

          // 显示密码图标
          .show-pwd-icon {
            color: $text-placeholder;
            font-size: 18px;
            cursor: pointer;
            transition: $transition;

            &:hover {
              color: $primary-color;
            }
          }

          // 获取验证码按钮
          .get-code-btn {
            height: 40px;
            padding: 0 16px;
            border: none;
            border-radius: 6px;
            background: $primary-color;
            color: $white;
            font-size: 14px;
            cursor: pointer;
            transition: $transition;

            // 禁用状态
            &:disabled {
              background: #e6e6e6;
              color: #999;
              cursor: not-allowed;
            }

            &:not(:disabled):hover {
              background: $primary-dark;
              box-shadow: 0 2px 8px rgba($primary-color, 0.2);
            }
          }
        }
      }

      // 登录按钮
      .login-btn {
        width: 100%;
        height: 54px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        background: linear-gradient(90deg, $primary-light, $primary-color);
        border: none;
        transition: $transition;

        &:hover {
          background: linear-gradient(90deg, $primary-color, $primary-dark);
          box-shadow: 0 4px 12px rgba($primary-color, 0.2);
        }

        &:active {
          box-shadow: 0 2px 6px rgba($primary-color, 0.2);
          transform: translateY(1px);
        }

        // 注册按钮特殊样式
        &.registry-btn {
          margin-top: 8px;
        }
      }
    }
  }
}

// 入场动画
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

// 响应式适配
@media (max-width: 768px) {
  .login-container {
    .loginbox {
      .rights,
      .registry-form {
        padding: 30px 20px;
        max-width: 100%;
      }

      .title-bar {
        .title-tab {
          margin: 0 15px;
          font-size: 16px;
        }
      }

      .login-form {
        .form-item {
          margin-bottom: 18px;

          .input-wrapper {
            padding: 0 12px;

            .form-input {
              height: 48px;
              font-size: 14px;
            }

            .get-code-btn {
              height: 36px;
              padding: 0 12px;
              font-size: 13px;
            }
          }
        }

        .login-btn {
          height: 50px;
          font-size: 15px;
        }
      }

      .registry-form {
        .form-header {
          .registry-title {
            font-size: 20px;
          }
        }
      }
    }
  }
}
</style>
