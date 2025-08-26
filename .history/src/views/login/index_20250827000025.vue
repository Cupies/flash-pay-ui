<template>
  <div class="login-container">
    <div class="loginbox">
      <!-- 登录表单区 -->
      <div class="rights" v-if="!isRegistry" :class="{ 'scale-in': true }">
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
          <!-- 优化后输入框：带图标+悬浮边框+错误状态 -->
          <el-form-item 
            prop="usernames" 
            class="form-item"
            :error="formErrors.username"
            :class="{ 'form-item--error': formErrors.username }"
          >
            <div class="input-group">
              <div class="input-icon">
                <i class="el-icon-user"></i>
              </div>
              <el-input
                ref="username"
                name="username"
                v-model="loginForm.usernames"
                type="text"
                autocomplete="on"
                placeholder="手机号/用户名"
                class="custom-input"
                @focus="handleInputFocus($event)"
                @blur="handleInputBlur($event)"
                @input="clearError('username')"
              />
            </div>
          </el-form-item>

          <el-form-item 
            prop="password" 
            class="form-item"
            :error="formErrors.password"
            :class="{ 'form-item--error': formErrors.password }"
          >
            <div class="input-group">
              <div class="input-icon">
                <i class="el-icon-lock"></i>
              </div>
              <el-input
                :key="passwordType"
                ref="password"
                :type="passwordType"
                v-model="loginForm.password"
                placeholder="请输入密码"
                name="password"
                autocomplete="on"
                class="custom-input"
                @keyup.enter.native="handleLogin"
                @focus="handleInputFocus($event)"
                @blur="handleInputBlur($event)"
                @input="clearError('password')"
              />
              <!-- 密码可见性切换：优化图标位置与交互 -->
              <div 
                class="input-action"
                @click="showPwd"
                :title="passwordType === 'password' ? '显示密码' : '隐藏密码'"
              >
                <i 
                  :class="passwordType === 'password' ? 'el-icon-view' : 'el-icon-view-off'"
                ></i>
              </div>
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
            :class="{ 'form-item--error': formErrors.phone }"
          >
            <div class="input-group">
              <div class="input-icon">
                <i class="el-icon-phone"></i>
              </div>
              <el-input
                ref="username"
                name="phone"
                v-model="loginForms.phone"
                type="tel"
                autocomplete="on"
                placeholder="请输入手机号"
                class="custom-input"
                @focus="handleInputFocus($event)"
                @blur="handleInputBlur($event)"
                @input="clearError('phone')"
              />
            </div>
          </el-form-item>

          <el-form-item 
            prop="code" 
            class="form-item"
            :error="formErrors.code"
            :class="{ 'form-item--error': formErrors.code }"
          >
            <!-- 验证码输入框：优化按钮集成方式 -->
            <div class="input-group input-group--code">
              <div class="input-icon">
                <i class="el-icon-sms"></i>
              </div>
              <el-input
                ref="password"
                type="text"
                v-model="loginForms.code"
                placeholder="请输入验证码"
                name="code"
                autocomplete="on"
                class="custom-input custom-input--code"
                @focus="handleInputFocus($event)"
                @blur="handleInputBlur($event)"
                @input="clearError('code')"
              />
              <!-- 验证码按钮：优化样式与状态反馈 -->
              <button
                type="button"
                class="code-btn"
                :disabled="!canClicks"
                :class="{ 'code-btn--disabled': !canClicks }"
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
            :class="{ 'form-item--error': formErrors.regUsername }"
          >
            <div class="input-group">
              <div class="input-icon">
                <i class="el-icon-user"></i>
              </div>
              <el-input
                v-model="registryForm.username"
                type="text"
                placeholder="请输入用户名"
                class="custom-input"
                @focus="handleInputFocus($event)"
                @blur="handleInputBlur($event)"
                @input="clearError('regUsername')"
              />
            </div>
          </el-form-item>

          <el-form-item 
            class="form-item"
            :error="formErrors.regPassword"
            :class="{ 'form-item--error': formErrors.regPassword }"
          >
            <div class="input-group">
              <div class="input-icon">
                <i class="el-icon-lock"></i>
              </div>
              <el-input
                v-model="registryForm.password"
                placeholder="请输入密码（6-16位字符）"
                type="password"
                class="custom-input"
                @focus="handleInputFocus($event)"
                @blur="handleInputBlur($event)"
                @input="clearError('regPassword')"
              />
            </div>
          </el-form-item>

          <el-form-item 
            class="form-item"
            :error="formErrors.regMobile"
            :class="{ 'form-item--error': formErrors.regMobile }"
          >
            <div class="input-group">
              <div class="input-icon">
                <i class="el-icon-phone"></i>
              </div>
              <el-input
                v-model="registryForm.mobile"
                placeholder="请输入手机号"
                type="tel"
                class="custom-input"
                @focus="handleInputFocus($event)"
                @blur="handleInputBlur($event)"
                @input="clearError('regMobile')"
              />
            </div>
          </el-form-item>

          <el-form-item 
            class="form-item"
            :error="formErrors.regCode"
            :class="{ 'form-item--error': formErrors.regCode }"
          >
            <div class="input-group input-group--code">
              <div class="input-icon">
                <i class="el-icon-sms"></i>
              </div>
              <el-input
                v-model="registryForm.verifiyCode"
                placeholder="请输入验证码"
                class="custom-input custom-input--code"
                @focus="handleInputFocus($event)"
                @blur="handleInputBlur($event)"
                @input="clearError('regCode')"
              />
              <button
                type="button"
                class="code-btn"
                :disabled="!canClick"
                :class="{ 'code-btn--disabled': !canClick }"
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
    const flag = ref(false)
    const isRegistry = ref(false)
    const content = ref('获取验证码')
    const codes = ref('获取验证码')
    const canClick = ref(true)
    const totalTime = ref(60)
    const canClicks = ref(true)
    const totalTimes = ref(60)
    const formErrors = ref({})
    let cloak = null

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

    // 输入框聚焦处理：添加活跃状态
    const handleInputFocus = (e) => {
      const inputGroup = e.target.closest('.input-group')
      if (inputGroup) inputGroup.classList.add('input-group--focused')
    }

    // 输入框失焦处理：移除活跃状态
    const handleInputBlur = (e) => {
      const inputGroup = e.target.closest('.input-group')
      if (inputGroup) inputGroup.classList.remove('input-group--focused')
    }

    // 切换登录方式
    const goAccount = () => { flag.value = false }
    const goPhone = () => { flag.value = true }

    // 切换注册/登录
    const registry = () => {
      isRegistry.value = true
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

      try {
        const res = await getLoginCode(loginForms.value.phone)
        loginForms.value.smsKey = res
        ElMessage.success('验证码已发送，请注意查收')
      } catch (error) {
        console.error(error)
        ElMessage.error('获取验证码失败，请稍后重试')
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

      try {
        const res = await getMsgCode(registryForm.value.mobile)
        registryForm.value.verifiykey = res
        ElMessage.success('验证码已发送，请注意查收')
      } catch (error) {
        console.error(error)
        ElMessage.error('获取验证码失败，请稍后重试')
        clearInterval(cloak)
        content.value = '重新发送验证码'
        totalTime.value = 60
        canClick.value = true
      }
    }

    // 注册逻辑
    const goRegistry = async () => {
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
      const errors = {}
      if (!loginForm.value.usernames) errors.username = '账号不能为空'
      if (!loginForm.value.password) errors.password = '密码不能为空'
      
      if (Object.keys(errors).length > 0) {
        formErrors.value = errors
        return
      }

      try {
        loading.value = true
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
      clearError,
      handleInputFocus,
      handleInputBlur
    }
  }
})
</script>

<style lang="scss">
// 全局样式变量
$primary-color: #409eff;
$primary-light: #66b1ff;
$primary-dark: #337ecc;
$text-primary: #333;
$text-secondary: #666;
$text-placeholder: #999;
$border-color: #e5e6eb;
$border-color-focus: #c9e2ff;
$error-color: #f56c6c;
$error-border: #fbc4c4;
$white: #fff;
$shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
$shadow-input: 0 0 0 2px rgba($primary-color, 0.1);
$transition: all 0.25s ease;

// 全局样式重置
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
</style>

<style lang="scss" scoped>
$primary-color: #409eff;
$primary-light: #66b1ff;
$primary-dark: #337ecc;
$text-primary: #333;
$text-secondary: #666;
$text-placeholder: #999;
$border-color: #e5e6eb;
$border-color-focus: #c9e2ff;
$error-color: #f56c6c;
$error-border: #fbc4c4;
$white: #fff;
$shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
$shadow-input: 0 0 0 2px rgba($primary-color, 0.1);
$transition: all 0.25s ease;
// 登录容器主样式（保留原背景）
.login-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #385d8e;
  background: #212121 url('../../../public/img/denglu.jpg') no-repeat center center;
  background-size: cover;
  position: relative;

  // 背景遮罩（提升表单可读性）
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }

  .loginbox {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    position: relative;
    z-index: 2;

    // 表单卡片基础样式
    .rights,
    .registry-form {
      width: 100%;
      max-width: 450px;
      background: $white;
      border-radius: 16px;
      box-shadow: $shadow;
      padding: 47px 40px;
      transition: $transition;

      &.scale-in {
        animation: scaleIn 0.4s ease forwards;
      }

      // 标题栏
      .title-bar {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 45px;

        .title-tab {
          font-size: 18px;
          font-weight: 500;
          color: $text-secondary;
          margin: 0 33px;
          cursor: pointer;
          position: relative;
          padding-bottom: 8px;
          transition: $transition;

          &:hover {
            color: $primary-color;
          }

          &.active {
            color: $primary-color;
            font-weight: 600;
          }

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

      // 表单底部
      .form-footer {
        margin-top: 51px;
        text-align: left;

        .registry-link {
          color: $primary-color;
          font-size: 16px;
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
      height: 510px;
      max-width: 450px;
      padding: 47px 40px;

      .form-header {
        position: relative;
        margin-bottom: 30px;

        .registry-title {
          font-size: 20px;
          font-weight: 600;
          color: $primary-color;
          text-align: center;
        }

        .back-login {
          color: $text-secondary;
          font-size: 14px;
          cursor: pointer;
          transition: $transition;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);

          &:hover {
            color: $primary-color;
          }

          i {
            margin-right: 4px;
          }
        }
      }

      .registry-inner-form {
        margin-top: 15px;
      }
    }

    // 表单样式
    .login-form {
      width: 100%;
      margin-top: 0;

      // 表单项核心优化
      .form-item {
        margin-bottom: 0;
        margin-top: 15px;
        position: relative;
        transition: $transition;

        // 错误状态：独立样式，不影响输入框边框
        &.form-item--error {
          .input-group {
            border-color: $error-border;

            .input-icon i {
              color: $error-color;
            }

            &.input-group--focused {
              box-shadow: 0 0 0 2px rgba($error-color, 0.1);
            }
          }
        }

        // 输入框组：核心容器，整合图标、输入框、操作按钮
        .input-group {
          display: flex;
          align-items: center;
          width: 100%;
          height: 56px; // 优化高度，提升触摸体验
          border: 1px solid $border-color;
          border-radius: 8px; // 圆角设计，更现代
          padding: 0 16px;
          background-color: $white;
          transition: $transition;

          // 聚焦状态：高亮边框+轻微发光
          &.input-group--focused {
            border-color: $primary-color;
            box-shadow: $shadow-input;
            outline: none;
          }

          // 验证码输入框组：特殊布局
          &.input-group--code {
            padding-right: 12px;
            justify-content: space-between;
          }

          // 输入框图标：固定宽度，统一视觉
          .input-icon {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: $text-placeholder;
            transition: $transition;

            i {
              font-size: 18px;
              transition: $transition;
            }
          }

          // 自定义输入框：完全去边框，继承容器样式
          .custom-input {
            flex: 1;
            height: 100%;
            border: none;
            outline: none;
            font-size: 15px;
            color: $text-primary;
            background: transparent;
            padding: 0 12px;
            transition: $transition;

            // 占位符样式优化
            &::placeholder {
              color: $text-placeholder;
              font-size: 14px;
              opacity: 0.8;
            }

            // 自动填充样式：适配白色背景
            &:-webkit-autofill {
              box-shadow: 0 0 0px 1000px $white inset !important;
              -webkit-text-fill-color: $text-primary !important;
              transition: background-color 5000s ease-in-out 0s; // 解决自动填充背景闪烁
            }

            // 验证码输入框：限制最小宽度，防止按钮挤压
            &.custom-input--code {
              flex: 1;
              min-width: 120px;
              padding-right: 8px;
            }
          }

          // 输入框操作按钮：如密码显示/隐藏
          .input-action {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: $text-placeholder;
            cursor: pointer;
            transition: $transition;

            &:hover {
              color: $primary-color;
            }

            i {
              font-size: 18px;
            }
          }
        }

        // 验证码按钮：优化样式与状态
        .code-btn {
          min-width: 110px;
          height: 40px;
          border: none;
          border-radius: 6px;
          background-color: $primary-color;
          color: $white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: $transition;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 12px;

          // 禁用状态：显著区分，防止误触
          &.code-btn--disabled {
            background-color: #f5f7fa;
            color: #c0c4cc;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }

          //  hover状态：深色+轻微阴影
          &:not(.code-btn--disabled):hover {
            background-color: $primary-dark;
            box-shadow: 0 2px 8px rgba($primary-color, 0.2);
          }

          // 点击状态：轻微下沉，模拟物理反馈
          &:not(.code-btn--disabled):active {
            transform: translateY(1px);
            box-shadow: 0 1px 4px rgba($primary-color, 0.2);
          }
        }
      }

      // 登录按钮
      .login-btn {
        width: 100%;
        height: 56px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        background: linear-gradient(90deg, $primary-light, $primary-color);
        border: none;
        transition: $transition;
        margin-top: 24px;

        &:hover {
          background: linear-gradient(90deg, $primary-color, $primary-dark);
          box-shadow: 0 4px 12px rgba($primary-color, 0.2);
        }

        &:active {
          box-shadow: 0 2px 6px rgba($primary-color, 0.2);
          transform: translateY(1px);
        }

        &.registry-btn {
          margin-top: 24px;
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

// 响应式适配：优化小屏体验
@media (max-width: 768px) {
  .login-container {
    background-size: cover;
    background-position: center;

    .loginbox {
      .rights,
      .registry-form {
        padding: 30px 20px;
        max-width: 100%;
        margin-top: 50px;

        .title-bar {
          .title-tab {
            margin: 0 15px;
            font-size: 16px;
          }
        }
      }

      .login-form {
        .form-item {
          .input-group {
            height: 52px;
            padding: 0 12px;

            .input-icon i {
              font-size: 16px;
            }

            .custom-input {
              font-size: 14px;
              padding: 0 8px;
            }

            .code-btn {
              height: 36px;
              font-size: 13px;
              min-width: 90px;
            }
          }
        }

        .login-btn {
          height: 52px;
          font-size: 15px;
        }
      }
    }
  }
}
</style>
