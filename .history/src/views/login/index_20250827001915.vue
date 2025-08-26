<template>
  <div class="login-container">
    <!-- 新增背景蒙层，提升文字可读性 -->
    <div class="login-bg-mask"></div>
    <div class="loginbox">
      <!-- 登录表单区域 -->
      <div class="rights" v-if="!isRegistry">
        <p class="title">
          <span 
            :class="flag?'':'active'" 
            class="username" 
            @click="goAccount"
            :style="{cursor: 'pointer'}"
          >账户密码登录</span>
          <span 
            class="tel" 
            :class="flag?'active':''" 
            @click="goPhone"
            :style="{cursor: 'pointer'}"
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
          <el-form-item prop="usernames" class="form-item-custom">
            <el-input
              ref="username"
              name="username"
              v-model="loginForm.usernames"
              type="text"
              autocomplete="on"
              placeholder="手机号/用户名"
              class="input-custom"
            />
          </el-form-item>

          <el-form-item prop="password" class="form-item-custom">
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
            />
            <!-- 新增密码可见切换图标 -->
            <i 
              class="icon-eye" 
              @click="showPwd"
              :class="passwordType === 'password' ? 'el-icon-view' : 'el-icon-view-off'"
            ></i>
          </el-form-item>

          <el-button
            type="primary"
            style="width:100%; margin-top:32px; height:56px; border-radius: 8px; font-size: 16px;"
            @click.native.prevent="handleLogin"
            :loading="loading"
          >
            登录
          </el-button>
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
          <el-form-item prop="usernames" class="form-item-custom">
            <el-input
              ref="username"
              name="username"
              v-model="loginForms.phone"
              type="text"
              autocomplete="on"
              placeholder="请输入手机号"
              class="input-custom"
            />
          </el-form-item>

          <el-form-item prop="password" class="form-item-custom code-item">
            <el-input
              :key="passwordType"
              ref="password"
              type="text"
              v-model="loginForms.code"
              placeholder="请输入验证码"
              name="password"
              autocomplete="on"
              class="input-custom"
            />
            <span 
              class="getCodes" 
              @click="getCodes"
              :style="{cursor: canClicks ? 'pointer' : 'not-allowed', opacity: canClicks ? 1 : 0.6}"
            >{{codes}}</span>
          </el-form-item>

          <el-button
            type="primary"
            style="width:100%; margin-top:32px; height:56px; border-radius: 8px; font-size: 16px;"
            @click.native.prevent="handleLogins"
            :loading="loading"
          >
            登录
          </el-button>
        </el-form>

        <p class="bottom" v-if="!isRegistry">
          <span 
            @click="registry"
            :style="{cursor: 'pointer', color: '#1989FA', fontSize: '14px', transition: 'color 0.3s'}"
            @mouseenter="this.style.color='#0a66c2'"
            @mouseleave="this.style.color='#1989FA'"
          >注册账号</span>
        </p>
      </div>

      <!-- 注册表单区域 -->
      <div class="registryFrom" v-if="isRegistry">
        <p class="registrys" style="margin-bottom: 32px; font-weight: 500;">注册账户</p>
        <el-form
          label-position="left"
          v-if="isRegistry"
          class="registry-form"
        >
          <el-form-item class="form-item-custom">
            <el-input
              v-model="registryForm.username"
              type="text"
              placeholder="请输入用户名"
              class="input-custom"
            />
          </el-form-item>

          <el-form-item class="form-item-custom">
            <el-input
              v-model="registryForm.password"
              placeholder="请输入密码（6-20位字符）"
              type="password"
              class="input-custom"
            />
          </el-form-item>

          <el-form-item class="form-item-custom">
            <el-input
              v-model="registryForm.mobile"
              placeholder="请输入手机号"
              class="input-custom"
            />
          </el-form-item>

          <el-form-item class="form-item-custom code-item">
            <el-input
              v-model="registryForm.verifiyCode"
              placeholder="请输入验证码"
              class="input-custom"
            />
            <span 
              class="getCode" 
              @click="getCode"
              :style="{cursor: canClick ? 'pointer' : 'not-allowed', opacity: canClick ? 1 : 0.6}"
            >{{content}}</span>
          </el-form-item>

          <el-button
            type="primary"
            style="width:100%; margin-top:32px; height:56px; border-radius: 8px; font-size: 16px;"
            @click.native.prevent="goRegistry"
            :loading="loading"
          >
            注册
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// 保持原script代码完全不变
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
      if (cloak) {
        clearInterval(cloak)
      }
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
        ElMessage({
          message: "手机号不能为空",
          type: 'error',
          duration: 2 * 1000
        })
        return
      }
      
      if (!canClicks.value) return
      canClicks.value = false
      codes.value = totalTimes.value + 's后重新发送'
      
      cloak = setInterval(() => {
        totalTimes.value--
        if (totalTimes.value > 0) {
          codes.value = totalTimes.value + 's后重新发送'
        }
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
        ElMessage({
          message: "手机号不能为空",
          type: 'error',
          duration: 2 * 1000
        })
        return
      }
      
      if (!canClick.value) return
      canClick.value = false
      content.value = totalTime.value + 's后重新发送'
      
      cloak = setInterval(() => {
        totalTime.value--
        if (totalTime.value > 0) {
          content.value = totalTime.value + 's后重新发送'
        }
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
      try {
        const res = await registryData(registryForm.value)
        if (!res) {
          ElMessage({
            message: "注册失败",
            type: 'error',
            duration: 2 * 1000
          })
        } else {
          ElMessage({
            message: "注册成功",
            type: 'success',
            duration: 2 * 1000
          })
          
          setTimeout(() => {
            isRegistry.value = false
          }, 2000)
        }
      } catch (error) {
        console.error(error)
        ElMessage.error('注册失败')
      }
    }
    
    const showPwd = () => {
      if (passwordType.value === 'password') {
        passwordType.value = ''
      } else {
        passwordType.value = 'password'
      }
    }
    
    const handleLogin = async () => {
      loading.value = true;
      localStorage.setItem('username', loginForm.value.usernames)
      localStorage.setItem('password', loginForm.value.password)
      
      if (loginForm.value.usernames === '' || loginForm.value.password === '') {
        ElMessage({
          message: "账号或密码不能为空",
          type: 'error',
          duration: 2 * 1000
        })
        return
      }
      
      try {
        await userStoreInstance.Login(loginForm.value)
        router.push({
          path: '/',
          query: otherQuery.value
        })
        
        setTimeout(() => {
          loading.value = false
        }, 500)
      } catch (error) {
        console.error(error)
        loading.value = false
      }
    }
    
    const handleLogins = async () => {
      try {
        loading.value = true
        await userStoreInstance.Logins(loginForms.value)
        router.push({
          path: '/',
          query: otherQuery.value
        })
        
        setTimeout(() => {
          loading.value = false
        }, 500)
      } catch (error) {
        console.error(error)
        loading.value = false
      }
    }
    
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
      handleLogins
    }
  }
})
</script>

<style lang="scss">
// 全局样式优化
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 100%;
    input {
      height: 47px;
      border-radius: 4px;
      border: 1px solid #e5e7eb;
      padding: 12px 15px;
      appearance: none;
      -webkit-appearance: none;
      transition: border-color 0.3s, box-shadow 0.3s;

      &:focus {
        border-color: #1989FA;
        box-shadow: 0 0 0 2px rgba(25, 137, 250, 0.2);
        outline: none;
      }

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: #333 !important;
      }
    }
  }

  // 统一表单项样式
  .form-item-custom {
    margin-bottom: 20px;
    border-bottom: none !important;
    color: #454545;
  }

  // 验证码项特殊布局
  .code-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  // 验证码按钮样式
  .getCodes, .getCode {
    width: 120px;
    text-align: center;
    color: #1989FA;
    font-size: 14px;
    white-space: nowrap;
    transition: color 0.3s;

    &:hover {
      color: #0a66c2;
    }
  }

  // 密码眼睛图标
  .icon-eye {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    cursor: pointer;
    font-size: 18px;
    transition: color 0.3s;

    &:hover {
      color: #1989FA;
    }
  }
}
</style>

<style lang="scss" scoped>
// 核心样式：解决背景图覆盖问题 + 布局优化
.login-container {
  height: 100vh; // 改为视口高度，确保全屏
  width: 100vw;  // 改为视口宽度，确保全屏
  overflow: hidden;
  position: relative; // 为背景蒙层提供定位基准
  // 背景图优化：覆盖全屏 + 保持比例 + 居中显示
  background: url('../../../public/img/denglu.jpg') no-repeat center center;
  background-size: cover; // 关键属性：背景图完全覆盖容器
  background-attachment: fixed; // 防止滚动时背景偏移

  // 新增背景蒙层：降低背景亮度，提升表单可读性
  .login-bg-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4); // 黑色半透明蒙层，可调整透明度
    z-index: 1;
  }

  .loginbox {
    position: relative; // 确保表单在蒙层上方
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center; // 垂直居中，替代margin-top
    padding: 20px;

    // 登录表单容器
    .rights {
      width: 450px;
      background: #fff;
      border-radius: 12px; // 圆角优化
      padding: 50px 40px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); // 阴影提升层次感
      transform: translateY(-20px); // 轻微上移，视觉更舒适

      .title {
        text-align: center;
        margin-bottom: 36px; // 增加标题下方间距
        .username, .tel {
          font-size: 18px;
          font-weight: 500;
          color: #6b7280;
          transition: color 0.3s;
          cursor: pointer;

          &:hover {
            color: #1989FA;
          }
        }

        .username {
          margin-left: 0; // 重置margin，居中显示
          margin-right: 40px; // 与手机号登录保持间距
        }

        .tel {
          margin-left: 0; // 重置margin
        }

        .active {
          color: #1989FA;
          border-bottom: 2px solid #1989FA; // 下划线标识当前状态
          padding-bottom: 4px;
        }
      }

      .bottom {
        margin-top: 24px;
        text-align: center; // 注册链接居中
        span {
          float: none; // 重置浮动
          font-size: 14px;
          color: #1989FA;
          transition: color 0.3s;

          &:hover {
            color: #0a66c2;
            text-decoration: underline; //  hover时下划线
          }
        }
      }
    }

    // 注册表单容器
    .registryFrom {
      width: 450px;
      background: #fff;
      border-radius: 12px; // 圆角优化
      padding: 50px 40px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); // 阴影提升层次感
      transform: translateY(-20px); // 轻微上移

      p {
        text-align: center;
        color: #1989FA;
        font-size: 20px;
        font-weight: 500;
        margin-bottom: 36px;
      }

      .getCode {
        margin-left: 0; // 重置margin
        width: 120px;
      }
    }
  }

  // 表单样式优化
  .login-form, .registry-form {
    width: 100%;
    max-width: 100%;
    margin-top: 0; // 重置margin，使用标题间距控制
    overflow: hidden;
    position: relative; // 为密码眼睛图标提供定位基准
  }

  // 输入框统一样式
  .input-custom {
    width: 100%;
  }

  // 移除冗余样式
  .svg-container, .title-container, .show-pwd {
    display: none;
  }
}

// 响应式适配：小屏幕下优化表单宽度
@media (max-width: 576px) {
  .login-container .loginbox .rights,
  .login-container .loginbox .registryFrom {
    width: 100%;
    max-width: 350px;
    padding: 40px 24px;
  }

  .code-item .getCodes,
  .code-item .getCode {
    width: 100px;
    font-size: 13px;
  }
}
</style>
