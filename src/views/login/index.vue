<template>
  <div class="login-container">
    <!-- 背景蒙层 -->
    <div class="login-bg-mask"></div>
    <!-- 顶部导航：快速返回首页 -->
    <div class="login-header">
      <a href="/" class="back-home" @click.prevent="goHome">
        <i class="el-icon-arrow-left"></i>
        <span>返回首页</span>
      </a>
    </div>
    <div class="loginbox">
      <!-- 登录表单区域 -->
      <div class="rights" v-if="!isRegistry">
        <!-- 登录标题 + 场景化提示 -->
        <div class="login-header-group">
          <h2 class="login-title">欢迎回来</h2>
          <p class="login-desc">请使用账号信息登录系统，开始您的操作</p>
        </div>
        
        <p class="tab-title">
          <span 
            :class="flag?'':'active'" 
            class="tab-item account-tab" 
            @click="goAccount"
          >账户密码登录</span>
          <span 
            class="tab-item phone-tab" 
            :class="flag?'active':''" 
            @click="goPhone"
          >手机号登录</span>
        </p>
        
        <!-- 账户密码登录表单 -->
        <el-form
          ref="loginFormAccount"
          :model="loginForm"
          class="login-form"
          autocomplete="on"
          label-position="left"
          v-if="!flag"
        >
          <!-- 用户名输入框：带图标 + 错误提示 -->
          <el-form-item 
            prop="usernames" 
            class="form-item-custom"
            :error="loginForm.usernames ? '' : (isSubmitAccount ? '请输入手机号或用户名' : '')"
          >
            <div class="input-wrapper">
              <i class="el-icon-user input-icon"></i>
              <el-input
                ref="username"
                name="username"
                v-model="loginForm.usernames"
                type="text"
                autocomplete="on"
                placeholder="手机号/用户名"
                class="input-custom"
                @focus="isSubmitAccount = false"
              />
            </div>
          </el-form-item>

          <!-- 密码输入框：带图标 + 可见切换 + 错误提示 -->
          <el-form-item 
            prop="password" 
            class="form-item-custom"
            :error="loginForm.password ? '' : (isSubmitAccount ? '请输入密码' : '')"
          >
            <div class="input-wrapper">
              <i class="el-icon-lock input-icon"></i>
              <el-input
                :key="passwordType"
                ref="password"
                :type="passwordType"
                v-model="loginForm.password"
                placeholder="请输入密码"
                name="password"
                autocomplete="on"
                @keyup.enter.native="handleLogin"
                class="input-custom"
                @focus="isSubmitAccount = false"
              />
              <!-- 密码可见切换：带hover提示 -->
              <i 
                class="el-icon-view input-action-icon" 
                @click="showPwd"
                :class="passwordType === 'password' ? '' : 'el-icon-view-off'"
                :title="passwordType === 'password' ? '显示密码' : '隐藏密码'"
              ></i>
            </div>
            <!-- 辅助链接：忘记密码 -->
            <a href="#" class="forgot-pwd" @click.prevent="showForgotPwd">忘记密码？</a>
          </el-form-item>

          <!-- 登录按钮：加载状态 + 禁用状态 -->
          <el-button
            type="primary"
            class="login-btn"
            @click.native.prevent="handleLogin"
            :loading="loading"
            :disabled="!loginForm.usernames || !loginForm.password"
          >
            登录
          </el-button>

          <!-- 第三方登录：满足多场景需求 -->
          <div class="third-login">
            <p class="third-title">其他登录方式</p>
            <div class="third-icons">
              <a href="#" class="third-icon" title="微信登录">
                <i class="el-icon-wechat"></i>
              </a>
              <a href="#" class="third-icon" title="企业微信登录">
                <i class="el-icon-office-building"></i>
              </a>
              <a href="#" class="third-icon" title="账号绑定">
                <i class="el-icon-link"></i>
              </a>
            </div>
          </div>
        </el-form>

        <!-- 手机号登录表单 -->
        <el-form
          ref="loginFormPhone"
          :model="loginForm"
          class="login-form"
          autocomplete="on"
          label-position="left"
          v-if="flag"
        >
          <!-- 手机号输入框：带图标 + 格式校验提示 -->
          <el-form-item 
            prop="usernames" 
            class="form-item-custom"
            :error="
              loginForms.phone 
                ? (isPhoneValid(loginForms.phone) ? '' : '请输入11位有效手机号') 
                : (isSubmitPhone ? '请输入手机号' : '')
            "
          >
            <div class="input-wrapper">
              <i class="el-icon-phone input-icon"></i>
              <el-input
                ref="username"
                name="username"
                v-model="loginForms.phone"
                type="tel"
                autocomplete="on"
                placeholder="请输入手机号"
                class="input-custom"
                @input="formatPhone(loginForms.phone)"
                @focus="isSubmitPhone = false"
                maxlength="11"
              />
            </div>
          </el-form-item>

          <!-- 验证码输入框：带倒计时状态 -->
          <el-form-item 
            prop="password" 
            class="form-item-custom code-item"
            :error="loginForms.code ? '' : (isSubmitPhone ? '请输入验证码' : '')"
          >
            <div class="input-wrapper code-input-wrapper">
              <i class="el-icon-message input-icon"></i>
              <el-input
                :key="passwordType"
                ref="password"
                type="text"
                v-model="loginForms.code"
                placeholder="请输入6位验证码"
                name="password"
                autocomplete="on"
                @focus="isSubmitPhone = false"
                maxlength="6"
                class="input-custom"
              />
            </div>
            <button 
              type="button"
              class="get-code-btn" 
              @click="getCodes"
              :disabled="!canClicks || !loginForms.phone || !isPhoneValid(loginForms.phone)"
            >
              {{codes}}
            </button>
          </el-form-item>

          <!-- 登录按钮 -->
          <el-button
            type="primary"
            class="login-btn"
            @click.native.prevent="handleLogins"
            :loading="loading"
            :disabled="!loginForms.phone || !loginForms.code || !isPhoneValid(loginForms.phone)"
          >
            登录
          </el-button>

          <!-- 第三方登录 -->
          <div class="third-login">
            <p class="third-title">其他登录方式</p>
            <div class="third-icons">
              <a href="#" class="third-icon" title="微信登录">
                <i class="el-icon-wechat"></i>
              </a>
              <a href="#" class="third-icon" title="企业微信登录">
                <i class="el-icon-office-building"></i>
              </a>
              <a href="#" class="third-icon" title="账号绑定">
                <i class="el-icon-link"></i>
              </a>
            </div>
          </div>
        </el-form>

        <!-- 注册引导：突出且不突兀 -->
        <div class="register-guide">
          <span class="guide-text">还没有账号？</span>
          <button 
            type="button"
            class="register-btn" 
            @click="registry"
          >
            立即注册
          </button>
        </div>
      </div>

      <!-- 注册表单区域 -->
      <div class="registryFrom" v-if="isRegistry">
        <!-- 注册标题 + 返回登录 -->
        <div class="register-header">
          <h2 class="register-title">创建新账号</h2>
          <button 
            type="button"
            class="back-login-btn" 
            @click="isRegistry = false"
            title="返回登录"
          >
            <i class="el-icon-arrow-left"></i>
          </button>
        </div>

        <el-form
          label-position="left"
          v-if="isRegistry"
          class="registry-form"
        >
          <!-- 用户名输入框：带格式提示 -->
          <el-form-item 
            class="form-item-custom"
            :error="
              registryForm.username 
                ? (registryForm.username.length >= 4 && registryForm.username.length <= 20 ? '' : '用户名需4-20位字符') 
                : (isSubmitRegister ? '请输入用户名' : '')
            "
          >
            <div class="input-wrapper">
              <i class="el-icon-user input-icon"></i>
              <el-input
                v-model="registryForm.username"
                type="text"
                placeholder="请输入用户名（4-20位字符）"
                class="input-custom"
                @focus="isSubmitRegister = false"
                maxlength="20"
              />
            </div>
          </el-form-item>

          <!-- 密码输入框：带强度提示 -->
          <el-form-item 
            class="form-item-custom"
            :error="
              registryForm.password 
                ? (registryForm.password.length >= 6 && registryForm.password.length <= 20 ? '' : '密码需6-20位字符') 
                : (isSubmitRegister ? '请输入密码' : '')
            "
          >
            <div class="input-wrapper">
              <i class="el-icon-lock input-icon"></i>
              <el-input
                v-model="registryForm.password"
                placeholder="请输入密码（6-20位字符）"
                type="password"
                class="input-custom"
                @focus="isSubmitRegister = false"
                @input="checkPwdStrength(registryForm.password)"
                maxlength="20"
              />
              <i 
                class="el-icon-view input-action-icon" 
                @click="showPwd"
                :class="passwordType === 'password' ? '' : 'el-icon-view-off'"
                :title="passwordType === 'password' ? '显示密码' : '隐藏密码'"
              ></i>
            </div>
            <!-- 密码强度提示 -->
            <div class="pwd-strength" v-if="registryForm.password">
              <span class="strength-text">密码强度：</span>
              <div class="strength-bars">
                <div 
                  class="strength-bar" 
                  :class="{ 
                    weak: pwdStrength === 'weak',
                    medium: pwdStrength === 'medium',
                    strong: pwdStrength === 'strong',
                    active: pwdStrength !== ''
                  }"
                ></div>
                <div 
                  class="strength-bar" 
                  :class="{ 
                    medium: pwdStrength === 'medium',
                    strong: pwdStrength === 'strong',
                    active: pwdStrength !== '' && pwdStrength !== 'weak'
                  }"
                ></div>
                <div 
                  class="strength-bar" 
                  :class="{ 
                    strong: pwdStrength === 'strong',
                    active: pwdStrength === 'strong'
                  }"
                ></div>
                <span class="strength-level">
                  {{pwdStrength === 'weak' ? '弱' : pwdStrength === 'medium' ? '中' : pwdStrength === 'strong' ? '强' : ''}}
                </span>
              </div>
            </div>
          </el-form-item>

          <!-- 手机号输入框：带格式校验 -->
          <el-form-item 
            class="form-item-custom"
            :error="
              registryForm.mobile 
                ? (isPhoneValid(registryForm.mobile) ? '' : '请输入11位有效手机号') 
                : (isSubmitRegister ? '请输入手机号' : '')
            "
          >
            <div class="input-wrapper">
              <i class="el-icon-phone input-icon"></i>
              <el-input
                v-model="registryForm.mobile"
                placeholder="请输入手机号"
                type="tel"
                class="input-custom"
                @focus="isSubmitRegister = false"
                @input="formatPhone(registryForm.mobile)"
                maxlength="11"
              />
            </div>
          </el-form-item>

          <!-- 验证码输入框：带倒计时 -->
          <el-form-item 
            class="form-item-custom code-item"
            :error="registryForm.verifiyCode ? '' : (isSubmitRegister ? '请输入验证码' : '')"
          >
            <div class="input-wrapper code-input-wrapper">
              <i class="el-icon-message input-icon"></i>
              <el-input
                v-model="registryForm.verifiyCode"
                placeholder="请输入6位验证码"
                class="input-custom"
                @focus="isSubmitRegister = false"
                maxlength="6"
              />
            </div>
            <button 
              type="button"
              class="get-code-btn" 
              @click="getCode"
              :disabled="!canClick || !registryForm.mobile || !isPhoneValid(registryForm.mobile)"
            >
              {{content}}
            </button>
          </el-form-item>

          <!-- 注册协议：必须勾选 -->
          <el-form-item class="agreement-item">
            <label class="agreement-label">
              <input 
                type="checkbox" 
                v-model="isAgree"
                class="agreement-checkbox"
              >
              <span class="agreement-text">
                我已阅读并同意
                <a href="#" class="agreement-link">《用户服务协议》</a>
                和
                <a href="#" class="agreement-link">《隐私政策》</a>
              </span>
            </label>
          </el-form-item>

          <!-- 注册按钮：禁用状态控制 -->
          <el-button
            type="primary"
            class="login-btn"
            @click.native.prevent="handleRegisterSubmit"
            :loading="loading"
            :disabled="!registryForm.username || !registryForm.password || !registryForm.mobile || !registryForm.verifiyCode || !isAgree || !isPhoneValid(registryForm.mobile)"
          >
            注册并登录
          </el-button>
        </el-form>
      </div>
    </div>

    <!-- 忘记密码弹窗 -->
    <el-dialog
      title="找回密码"
      :visible.sync="showForgotDialog"
      width="400px"
      center
    >
      <div class="forgot-dialog-content">
        <el-form class="forgot-form">
          <el-form-item 
            label="手机号"
            :error="forgotPhone ? (isPhoneValid(forgotPhone) ? '' : '请输入11位有效手机号') : (isSubmitForgot ? '请输入手机号' : '')"
          >
            <el-input
              v-model="forgotPhone"
              type="tel"
              placeholder="请输入手机号"
              @input="formatPhone(forgotPhone)"
              maxlength="11"
            />
          </el-form-item>
          <el-form-item 
            label="验证码"
            :error="forgotCode ? '' : (isSubmitForgot ? '请输入验证码' : '')"
          >
            <div class="forgot-code-wrapper">
              <el-input
                v-model="forgotCode"
                placeholder="请输入6位验证码"
                maxlength="6"
              />
              <button 
                type="button"
                class="forgot-get-code"
                @click="getForgotCode"
                :disabled="!canClickForgot || !forgotPhone || !isPhoneValid(forgotPhone)"
              >
                {{forgotCodeText}}
              </button>
            </div>
          </el-form-item>
          <el-form-item 
            label="新密码"
            :error="forgotPwd ? (forgotPwd.length >= 6 && forgotPwd.length <= 20 ? '' : '密码需6-20位字符') : (isSubmitForgot ? '请输入新密码' : '')"
          >
            <el-input
              v-model="forgotPwd"
              type="password"
              placeholder="请输入新密码"
              maxlength="20"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showForgotDialog = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="handleForgotSubmit"
            :disabled="!forgotPhone || !forgotCode || !forgotPwd || !isPhoneValid(forgotPhone)"
          >
            确认重置
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>

import { defineComponent, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElDialog } from 'element-plus'
import { login, getLoginCode, getMsgCode, registryData } from '@/api/users'
import { userStore } from '@/store/modules/user' 

export default defineComponent({
  name: 'Login',
  components: { ElDialog }, // 新增弹窗组件
  setup() {
    const router = useRouter()
    const route = useRoute()
    const userStoreInstance = userStore() 
    
    const loginForm = ref({
      usernames: '',
      password: ''
    })

    watch(loginForm, (newVal) => {
      console.log('loginForm 变化：', newVal);
    }, { deep: true });

    const loginForms = ref({
      phone: '',
      code: '',
      smsKey: ''
    })
    
    const registryForm = ref({
      mobile: '',
      username: '',
      password: '',
      verifiykey: '',
      verifiyCode: ''
    })
    
    const passwordType = ref('password')
    const loading = ref(false)
    const showDialog = ref(false)
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
    let cloak = null

    // ---------------------- 新增人性化辅助变量 ----------------------
    const isSubmitAccount = ref(false) // 账户登录提交状态（控制错误提示）
    const isSubmitPhone = ref(false)   // 手机号登录提交状态
    const isSubmitRegister = ref(false) // 注册提交状态
    const isAgree = ref(false)         // 注册协议勾选状态
    const pwdStrength = ref('')        // 密码强度（weak/medium/strong）
    // 忘记密码相关
    const showForgotDialog = ref(false)
    const forgotPhone = ref('')
    const forgotCode = ref('')
    const forgotPwd = ref('')
    const forgotCodeText = ref('获取验证码')
    const canClickForgot = ref(true)
    const totalTimeForgot = ref(60)
    let cloakForgot = null
    // ---------------------- 新增辅助变量结束 ----------------------
        
    const getOtherQuery = (query) => {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    
    watch(() => route, (newRoute) => {
      const query = newRoute.query
      if (query) {
        redirect.value = query.redirect
        otherQuery.value = getOtherQuery(query)
      }
    }, { immediate: true, deep: true })
    
    onMounted(() => {
    })
    
    onUnmounted(() => {
      if (cloak) clearInterval(cloak)
      if (cloakForgot) clearInterval(cloakForgot) // 清除忘记密码倒计时
    })
    
    const goAccount = () => {
      flag.value = false
    }
    
    const goPhone = () => {
      flag.value = true
    }
    
    const registry = () => {
      isRegistry.value = true
    }
    
    const getCodes = async () => {
      if (loginForms.value.phone === '') {
        ElMessage({ message: "手机号不能为空", type: 'error', duration: 2000 })
        return
      }
      if (!isPhoneValid(loginForms.value.phone)) { // 新增手机号格式校验
        ElMessage({ message: "请输入11位有效手机号", type: 'error', duration: 2000 })
        return
      }
      
      if (!canClicks.value) return
      canClicks.value = false
      codes.value = totalTimes.value + 's后重新发送'
      
      cloak = setInterval(() => {
        totalTimes.value--
        if (totalTimes.value > 0) codes.value = totalTimes.value + 's后重新发送'
        if (totalTimes.value <= 0) {
          clearInterval(cloak)
          codes.value = '重新发送验证码'
          totalTimes.value = 60
          canClicks.value = true
        }
      }, 1000)
      
      try {
        const res = await getLoginCode(loginForms.value.phone)
        loginForms.value.smsKey = res
      } catch (error) {
        console.error(error)
        ElMessage.error('获取验证码失败')
      }
    }
    
    const getCode = async () => {
      if (registryForm.value.mobile === '') {
        ElMessage({ message: "手机号不能为空", type: 'error', duration: 2000 })
        return
      }
      if (!isPhoneValid(registryForm.value.mobile)) { // 新增手机号格式校验
        ElMessage({ message: "请输入11位有效手机号", type: 'error', duration: 2000 })
        return
      }
      
      if (!canClick.value) return
      canClick.value = false
      content.value = totalTime.value + 's后重新发送'
      
      cloak = setInterval(() => {
        totalTime.value--
        if (totalTime.value > 0) content.value = totalTime.value + 's后重新发送'
        if (totalTime.value <= 0) {
          clearInterval(cloak)
          content.value = '重新发送验证码'
          totalTime.value = 60
          canClick.value = true
        }
      }, 1000)
      
      try {
        const res = await getMsgCode(registryForm.value.mobile)
        registryForm.value.verifiykey = res
      } catch (error) {
        console.error(error)
        ElMessage.error('获取验证码失败')
      }
    }
    
    const goRegistry = async () => {
      isSubmitRegister.value = true // 标记为已提交，显示错误提示
      
      // 前置校验：避免无效请求
      if (!registryForm.value.username || registryForm.value.username.length < 4) {
        ElMessage({ message: "用户名需4-20位字符", type: 'error', duration: 2000 })
        return
      }
      if (!registryForm.value.password || registryForm.value.password.length < 6) {
        ElMessage({ message: "密码需6-20位字符", type: 'error', duration: 2000 })
        return
      }
      if (!isPhoneValid(registryForm.value.mobile)) {
        ElMessage({ message: "请输入11位有效手机号", type: 'error', duration: 2000 })
        return
      }
      if (!registryForm.value.verifiyCode) {
        ElMessage({ message: "请输入验证码", type: 'error', duration: 2000 })
        return
      }
      if (!isAgree.value) {
        ElMessage({ message: "请阅读并同意用户协议和隐私政策", type: 'error', duration: 2000 })
        return
      }
      
      try {
        const res = await registryData(registryForm.value)
        if (!res) {
          ElMessage({ message: "注册失败", type: 'error', duration: 2000 })
        } else {
          ElMessage({ message: "注册成功，即将跳转登录", type: 'success', duration: 2000 })
          setTimeout(() => {
            isRegistry.value = false
            // 注册成功后自动填充手机号到登录表单
            loginForms.value.phone = registryForm.value.mobile
            flag.value = true // 切换到手机号登录
          }, 2000)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error('注册失败')
      }
    }
    
    const showPwd = () => {
      passwordType.value = passwordType.value === 'password' ? '' : 'password'
    }
    
    const handleLogin = async () => {
      isSubmitAccount.value = true // 标记为已提交，显示错误提示
      if (!loginForm.value.usernames || !loginForm.value.password) {
        ElMessage({ message: "账号或密码不能为空", type: 'error', duration: 2000 })
        return
      }
      
      loading.value = true;
      localStorage.setItem('username', loginForm.value.usernames)
      localStorage.setItem('password', loginForm.value.password)
      
      try {
        await userStoreInstance.Login(loginForm.value)
        router.push({ path: '/', query: otherQuery.value })
        setTimeout(() => loading.value = false, 500)
      } catch (error) {
        console.error(error)
        ElMessage.error('登录失败，请检查账号密码是否正确') // 新增具体错误提示
        loading.value = false
      }
    }
    
    const handleLogins = async () => {
      isSubmitPhone.value = true // 标记为已提交，显示错误提示
      if (!loginForms.value.phone || !isPhoneValid(loginForms.value.phone)) {
        ElMessage({ message: "请输入11位有效手机号", type: 'error', duration: 2000 })
        return
      }
      if (!loginForms.value.code) {
        ElMessage({ message: "请输入验证码", type: 'error', duration: 2000 })
        return
      }
      
      try {
        loading.value = true
        await userStoreInstance.Logins(loginForms.value)
        router.push({ path: '/', query: otherQuery.value })
        setTimeout(() => loading.value = false, 500)
      } catch (error) {
        console.error(error)
        ElMessage.error('登录失败，请检查验证码是否正确') // 新增具体错误提示
        loading.value = false
      }
    }

    // 1. 返回首页
    const goHome = () => {
      router.push('/')
    }

    // 2. 手机号格式校验（11位数字）
    const isPhoneValid = (phone) => {
      return /^1[3-9]\d{9}$/.test(phone)
    }

    // 3. 手机号输入格式化（自动过滤非数字字符）
    const formatPhone = (phone) => {
      if (!phone) return
      // 只保留数字字符
      const formatted = phone.replace(/\D/g, '')
      // 分别更新对应表单的手机号
      if (flag.value) loginForms.value.phone = formatted
      if (isRegistry.value) registryForm.value.mobile = formatted
      if (showForgotDialog.value) forgotPhone.value = formatted
    }

    // 4. 密码强度检测（弱：纯数字/字母；中：数字+字母；强：数字+字母+特殊字符）
    const checkPwdStrength = (pwd) => {
      if (pwd.length < 6) {
        pwdStrength.value = ''
        return
      }
      if (/^[0-9]+$/.test(pwd) || /^[a-zA-Z]+$/.test(pwd)) {
        pwdStrength.value = 'weak' // 弱
      } else if (/^[0-9a-zA-Z]+$/.test(pwd)) {
        pwdStrength.value = 'medium' // 中
      } else {
        pwdStrength.value = 'strong' // 强
      }
    }

    // 5. 显示忘记密码弹窗
    const showForgotPwd = () => {
      showForgotDialog.value = true
      // 重置弹窗表单
      forgotPhone.value = ''
      forgotCode.value = ''
      forgotPwd.value = ''
      forgotCodeText.value = '获取验证码'
      canClickForgot.value = true
      totalTimeForgot.value = 60
      if (cloakForgot) clearInterval(cloakForgot)
    }

    // 6. 获取忘记密码验证码
    const getForgotCode = async () => {
      if (!forgotPhone.value) {
        ElMessage({ message: "请输入手机号", type: 'error', duration: 2000 })
        return
      }
      if (!isPhoneValid(forgotPhone.value)) {
        ElMessage({ message: "请输入11位有效手机号", type: 'error', duration: 2000 })
        return
      }
      if (!canClickForgot.value) return

      canClickForgot.value = false
      forgotCodeText.value = totalTimeForgot.value + 's后重新发送'

      cloakForgot = setInterval(() => {
        totalTimeForgot.value--
        if (totalTimeForgot.value > 0) {
          forgotCodeText.value = totalTimeForgot.value + 's后重新发送'
        }
        if (totalTimeForgot.value <= 0) {
          clearInterval(cloakForgot)
          forgotCodeText.value = '重新发送验证码'
          totalTimeForgot.value = 60
          canClickForgot.value = true
        }
      }, 1000)

      // 实际项目中需调用忘记密码验证码接口
      try {
        const res = await getMsgCode(forgotPhone.value)
        // 存储验证码key（实际项目中使用）
        // forgotSmsKey.value = res
        ElMessage({ message: "验证码已发送", type: 'success', duration: 2000 })
      } catch (error) {
        console.error(error)
        ElMessage.error('获取验证码失败')
      }
    }

    // 7. 忘记密码提交
    const handleForgotSubmit = () => {
      isSubmitForgot.value = true
      if (!forgotPhone.value || !isPhoneValid(forgotPhone.value)) {
        ElMessage({ message: "请输入11位有效手机号", type: 'error', duration: 2000 })
        return
      }
      if (!forgotCode.value) {
        ElMessage({ message: "请输入验证码", type: 'error', duration: 2000 })
        return
      }
      if (!forgotPwd.value || forgotPwd.value.length < 6) {
        ElMessage({ message: "新密码需6-20位字符", type: 'error', duration: 2000 })
        return
      }

      // 实际项目中调用重置密码接口
      ElMessage({ message: "密码重置成功，即将跳转登录", type: 'success', duration: 2000 })
      setTimeout(() => {
        showForgotDialog.value = false
        // 重置后自动填充手机号到登录表单
        loginForms.value.phone = forgotPhone.value
        flag.value = true // 切换到手机号登录
      }, 2000)
    }

    // 8. 注册提交（中转方法，保持原方法名不变）
    const handleRegisterSubmit = () => {
      goRegistry()
    }
    // ---------------------- 新增辅助方法结束 ----------------------
    
    return {
      loginForm,
      loginForms,
      registryForm,
      passwordType,
      loading,
      showDialog,
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
      goAccount,
      goPhone,
      registry,
      getCodes,
      getCode,
      goRegistry,
      showPwd,
      handleLogin,
      handleLogins,
      // 新增返回变量
      isSubmitAccount,
      isSubmitPhone,
      isSubmitRegister,
      isAgree,
      pwdStrength,
      showForgotDialog,
      forgotPhone,
      forgotCode,
      forgotPwd,
      forgotCodeText,
      canClickForgot,
      goHome,
      isPhoneValid,
      formatPhone,
      checkPwdStrength,
      showForgotPwd,
      getForgotCode,
      handleForgotSubmit,
      handleRegisterSubmit
    }
  }
})
</script>

<style lang="scss">
// 全局样式优化
.login-container {
  // 输入框基础样式
  .el-input {
    display: inline-block;
    height: 47px;
    width: 100%;
    input {
      height: 47px;
      border-radius: 4px;
      border: 2px solid #e5e7eb;
      padding: 12px 15px;
      appearance: none;
      -webkit-appearance: none;
      transition: all 0.3s;
      /* 优化字体和行高 */
      font-size: 14px;
      line-height: 24px;

      &:focus {
        border-color: #1989FA;
        box-shadow: 0 0 0 3px rgba(25, 137, 250, 0.2);
        outline: none;
      }

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: #333 !important;
      }
    }
  }

  // 表单项样式
  .form-item-custom {
    margin-bottom: 24px;
    border-bottom: none !important;
    color: #454545;
    position: relative;

    // 错误提示样式优化
    .el-form-item__error {
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 4px;
      font-size: 12px;
      color: #f56c6c;
      line-height: 1.2;
    }
  }

  // 输入框容器：带图标布局
  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    /* 添加背景过渡效果 */
    transition: all 0.3s;

    // 输入框图标
    .input-icon {
      position: absolute;
      left: 15px;
      color: #9ca3af;
      font-size: 18px;
      z-index: 1;
      transition: all 0.3s;
    }

    // 输入框操作图标（显示密码）
    .input-action-icon {
      position: absolute;
      right: 15px;
      color: #9ca3af;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.3s;
      z-index: 1;

      &:hover {
        color: #1989FA;
      }
    }

    /* 输入框聚焦时容器效果 */
    &:focus-within {
      transform: translateY(-1px);
      .input-icon {
        color: #1989FA;
        transform: scale(1.1);
      }
    }

    /* 输入框样式优化 */
    .el-input {
      input {
        padding-left: 45px;
        padding-right: 45px;
        border: 2px solid #e5e7eb;
        transition: all 0.3s;
        /* 优化字体和行高 */
        font-size: 14px;
        line-height: 24px;
      }
      
      input:focus {
        border-color: #1989FA;
        box-shadow: 0 0 0 3px rgba(25, 137, 250, 0.2);
      }
    }
  }

  // 验证码项布局
  .code-item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 24px !important; 
    position: relative; // 避免与其他元素重叠
  }
  .code-input-wrapper {
  flex: 1; 
}

  // 验证码输入框容器
  .code-input-wrapper .el-input {
    width: 100%;
    input {
      padding-right: 15px; // 验证码输入框不需要右侧操作图标空间
    }
  }

  // 验证码按钮样式
  .get-code-btn {
    width: 80px;
    height: 40px;
    border-radius: 4px;
    border: 1px solid #1989FA;
    background-color: #fff;
    color: #1989FA;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    &:hover:not(:disabled) {
      background-color: #f0f7ff;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(25, 137, 250, 0.2);
    }

    &:disabled {
      border-color: #dcdfe6;
      color: #c0c4cc;
      cursor: not-allowed;
      background-color: #f5f7fa;
    }
  }

  // 登录/注册按钮样式
  .login-btn {
    width: 100%;
    height: 56px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    transition: all 0.3s;
    /* 增加按钮质感 */
    position: relative;
    overflow: hidden;
    border: none;

    &:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  /* 为按钮添加渐变效果 */
  .login-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s;
  }

  .login-btn:hover::before {
    left: 100%;
  }

  // 密码强度提示样式
  .pwd-strength {
    display: flex;
    align-items: center;
    margin-top: 8px;
    font-size: 12px;

    .strength-text {
      color: #6b7280;
      margin-right: 8px;
    }

    .strength-bars {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .strength-bar {
      width: 60px;
      height: 6px;
      border-radius: 3px;
      background-color: #e5e7eb;
      transition: background-color 0.3s;

      &.active {
        background-color: #e5e7eb;
      }

      &.weak {
        background-color: #f56c6c;
      }

      &.medium {
        background-color: #e6a23c;
      }

      &.strong {
        background-color: #67c23a;
      }
    }

    .strength-level {
      margin-left: 8px;
      color: #6b7280;

      &.weak {
        color: #f56c6c;
      }

      &.medium {
        color: #e6a23c;
      }

      &.strong {
        color: #67c23a;
      }
    }
  }

  // 注册协议样式
  .agreement-item {
    margin-bottom: 24px;
    margin-top: 8px;
    text-align: left;

    .agreement-label {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #6b7280;
      cursor: pointer;
    }

    .agreement-checkbox {
      width: 14px;
      height: 14px;
      margin-right: 8px;
      cursor: pointer;
    }

    .agreement-link {
      color: #1989FA;
      text-decoration: underline;
      margin: 0 2px;

      &:hover {
        color: #0a66c2;
      }
    }
  }

  // 第三方登录样式
  .third-login {
    margin-top: 32px;
    text-align: center;

    .third-title {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 16px;
      position: relative;

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 100px;
        height: 1px;
        background-color: #e5e7eb;
      }

      &::before {
        left: 20px;
      }

      &::after {
        right: 20px;
      }
    }

    .third-icons {
      display: flex;
      justify-content: center;
      gap: 32px;

      .third-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #f9fafb;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7280;
        font-size: 20px;
        transition: all 0.3s;

        &:hover {
          background-color: #f0f7ff;
          color: #1989FA;
          transform: translateY(-2px);
        }
      }
    }
  }

  // 注册引导样式
  .register-guide {
    margin-top: 24px;
    text-align: center;
    font-size: 14px;

    .guide-text {
      color: #6b7280;
      margin-right: 8px;
    }

    .register-btn {
      border: none;
      background: transparent;
      color: #1989FA;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #0a66c2;
        text-decoration: underline;
      }
    }
  }

  // 忘记密码弹窗样式
  .forgot-dialog-content {
    padding: 16px 0;
  }

  .forgot-form {
    .el-form-item {
      margin-bottom: 16px;
    }

    .el-form-item__label {
      width: 80px;
      font-size: 14px;
    }

    .forgot-code-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .forgot-get-code {
      width: 100px;
      height: 40px;
      border-radius: 4px;
      border: 1px solid #1989FA;
      background-color: #fff;
      color: #1989FA;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;

      &:hover:not(:disabled) {
        background-color: #f0f7ff;
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(25, 137, 250, 0.2);
      }

      &:disabled {
        border-color: #dcdfe6;
        color: #c0c4cc;
        cursor: not-allowed;
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: center;
    gap: 16px;
  }
}
</style>

<style lang="scss" scoped>
// 核心布局样式
.login-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
  /* 优化背景图片显示效果 */
  background: url('../../../public/img/denglu.jpg') no-repeat center center fixed;
  background-size: cover;
  /* 添加平滑过渡效果 */
  transition: background-position 0.5s ease;

  /* 添加页面载入动画 */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translate3d(0, 30px, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, -15px, 0);
    }
  }

  // 背景蒙层
  .login-bg-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    /* 改进背景蒙层效果，使用更精致的渐变 */
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 100%);
    z-index: 1;
  }

  // 顶部返回首页导航
  .login-header {
    position: absolute;
    top: 24px;
    left: 24px;
    z-index: 3;

    .back-home {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #fff;
      font-size: 14px;
      text-decoration: none;
      transition: opacity 0.3s;

      &:hover {
        opacity: 0.8;
      }

      .el-icon-arrow-left {
        font-size: 16px;
      }
    }
  }

  // 表单容器外层
  .loginbox {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  // 登录表单容器
  .rights {
    width: 450px;
    background: #fff;
    border-radius: 12px;
    padding: 50px 40px;
    /* 提升阴影质量，增加层次感 */
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.15),
      0 8px 24px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
    transform: translateY(-15px);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;

    // 登录标题组
    .login-header-group {
        text-align: center;
        margin-bottom: 32px;
        animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;

        .login-title {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .login-desc {
          font-size: 14px;
          color: #6b7280;
        }
      }

    // 选项卡标题
    .tab-title {
        text-align: center;
        margin-bottom: 32px;
        position: relative;
        animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;

        .tab-item {
          font-size: 18px;
          font-weight: 500;
          color: #6b7280;
          padding: 0 8px 8px;
          margin: 0 20px;
          cursor: pointer;
          transition: color 0.3s;

          &:hover {
            color: #1989FA;
          }
        }

        .active {
          color: #1989FA;
          border-bottom: 2px solid #1989FA;
        }
      }

    // 忘记密码链接
  .forgot-pwd {
    position: absolute;
    right: 0;
    bottom: -24px;
    font-size: 12px;
    color: #1989FA;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: #0a66c2;
      text-decoration: underline;
    }
  }
  }

  // 注册表单容器
  .registryFrom {
    width: 450px;
    background: #fff;
    border-radius: 12px;
    padding: 50px 40px;
    /* 提升阴影质量，增加层次感 */
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.15),
      0 8px 24px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
    transform: translateY(-15px);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;

    // 注册标题 + 返回登录
    .register-header {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 32px;
      position: relative;

      .register-title {
        font-size: 24px;
        font-weight: 600;
        color: #1f2937;
      }

      .back-login-btn {
        position: absolute;
        left: 0;
        border: none;
        background: transparent;
        color: #6b7280;
        font-size: 18px;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #1989FA;
        }
      }
    }
  }

  /* 为表单容器添加悬停效果 */
  .rights:hover, .registryFrom:hover {
    transform: translateY(-10px);
    box-shadow: 
      0 25px 65px rgba(0, 0, 0, 0.18),
      0 12px 28px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }

  // 表单样式
  .login-form, .registry-form {
    width: 100%;
    max-width: 100%;
    margin-top: 0;
    overflow: hidden;
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
  }

  // 输入框统一样式
  .input-custom {
    width: 100%;
  }

  // 移除冗余样式
  .svg-container, .title-container, .show-pwd {
    display: none;
  }

  /* 完善响应式布局 */
  @media (max-width: 1200px) {
    /* 超大屏幕优化 */
    .rights, .registryFrom {
      transform: translateY(-10px) scale(0.98);
    }
  }

  @media (max-width: 768px) {
    /* 平板设备优化 */
    .rights, .registryFrom {
      width: 400px;
      padding: 45px 36px;
      transform: translateY(-5px) scale(0.96);
    }
    
    .tab-title .tab-item {
      margin: 0 15px;
    }
  }

  @media (max-width: 576px) {
    /* 移动设备优化 */
    .loginbox {
      padding: 15px;
    }
    
    .rights, .registryFrom {
      width: 100%;
      max-width: 350px;
      padding: 40px 24px;
      border-radius: 10px;
    }
    
    .login-header {
      top: 16px;
      left: 16px;
    }
    
    /* 优化验证码按钮 - 保持同行显示 */
    .code-item {
      flex-direction: row;
      align-items: center;
      gap: 10px;
    }
    
    .code-item .get-code-btn {
      width: 90px;
      height: 40px;
      font-size: 12px;
    }
  }

  @media (max-width: 360px) {
    /* 超小屏幕优化 */
    .rights, .registryFrom {
      padding: 32px 20px;
    }
    
    .login-header-group {
      margin-bottom: 24px !important;
    }
    
    .tab-title {
      margin-bottom: 24px !important;
    }
  }
}
</style>
