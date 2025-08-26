<template>
  <div class="login-container">
    <div class="loginbox">

        <div class="rights"  v-if="!isRegistry">

            <p class="title"><span :class="flag?'':'active'" class="username" @click="goAccount">账户密码登录</span><span class="tel" :class="flag?'active':''" @click="goPhone">手机号登录</span></p>
            <el-form
            ref="loginForm"
            :model="loginForm"
            class="login-form"
            autocomplete="on"
            label-position="left"
            v-if="!flag"
          >

            <el-form-item prop="usernames">
              <el-input
                ref="username"
                name="username"
                v-model="loginForm.usernames"
                type="text"
                autocomplete="on"
                placeholder="手机号/用户名"
                 :disabled="false" 
                :readonly="false" 
                @focus="console.log('用户名输入框获取焦点')" 
              />
                <div style="margin-top: 5px; color: #666;">当前输入：{{ loginForm.usernames }}</div>

            </el-form-item>

            <el-form-item prop="password">
              <el-input
                :key="passwordType"
                ref="password"
                :type="passwordType"
                v-model="loginForm.password"
                placeholder="请输入密码"
                name="password"
                autocomplete="on":disabled="false"
                :readonly="false"
                @focus="console.log('密码输入框获取焦点')"
                @keyup.enter.native="handleLogin"
              />
            </el-form-item>

            <el-button
              type="primary"
              style="width:100%; margin-top:24px;height:56px"
              @click.native.prevent="handleLogin"
            >
              登录
            </el-button>
          </el-form>
          <el-form
            ref="loginForm"
            :model="loginForm"
            class="login-form"
            autocomplete="on"
            label-position="left"
            v-if="flag"
          >

            <el-form-item prop="usernames">
              <el-input
                ref="username"
                name="username"
                v-model="loginForms.phone"
                type="text"
                autocomplete="on"
                placeholder="请输入手机号"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                :key="passwordType"
                ref="password"
                :type="passwordType"
                v-model="loginForms.code"
                placeholder="请输入验证码"
                name="password"
                autocomplete="on"
              />
              <span class="getCodes" @click="getCodes">{{codes}}</span>
            </el-form-item>

            <el-button
              type="primary"
              style="width:100%; margin-top:24px;height:56px"
              @click.native.prevent="handleLogins"
            >
              登录
            </el-button>
          </el-form>
          <p class="bottom" v-if="!isRegistry"><span @click="registry">注册账号</span></p>
        </div>
          <div class="registryFrom"  v-if="isRegistry">
            <p class="registrys">注册账户</p>
            <el-form
              label-position="left"
              v-if="isRegistry"
            >
              <el-form-item>
                <el-input
                  v-model="registryForm.username"
                  type="text"
                  placeholder="请输入用户名"
                />
              </el-form-item>

              <el-form-item>
                <el-input
                  v-model="registryForm.password"
                  placeholder="请输入密码"
                  type="password"
                />
              </el-form-item>

              <el-form-item>
                <el-input
                  v-model="registryForm.mobile"
                  placeholder="请输入手机号"
                />
              </el-form-item>

              <el-form-item>
                <el-input
                  v-model="registryForm.verifiyCode"
                  placeholder="请输入验证码"
                />
                <span class="getCode" @click="getCode">{{content}}</span>
              </el-form-item>

              <el-button
                type="primary"
                style="width:100%; margin-top:24px;height:56px"
                @click.native.prevent="goRegistry"
              >
                注册
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
import { userStore } from '@/store/modules/user' // 导入Pinia的user store

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const userStoreInstance = userStore() // 使用Pinia的user store，避免变量名冲突
    
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
    // 监听路由变化
    watch(() => route, (newRoute) => {
      const query = newRoute.query
      if (query) {
        redirect.value = query.redirect
        otherQuery.value = getOtherQuery(query)
      }
    }, { immediate: true, deep: true })
    
    onMounted(() => {
      // 聚焦逻辑需要模板中绑定ref
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
      // 聚焦逻辑需要模板中绑定ref
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
// References: https://www.zhangxinxu.com/wordpress/2018/01/css-caret-color-first-line/


.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 65%;
    input {
      height: 47px;
      border-radius: 0px;
      border: 0;
      padding: 12px 5px 12px 15px;
      appearance: none;
      -webkit-appearance: none;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #385d8e inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item:nth-child(2) {
    border-bottom: 1px solid rgb(238, 230, 230);
    color: #454545;
  }
  .el-form-item:nth-child(3) {
    border-bottom: 1px solid rgb(238, 230, 230);
    color: #454545;
  }
  .el-form-item:nth-child(4) {
    border-bottom: 1px solid rgb(238, 230, 230);
    color: #454545;
  }
  .el-form-item:nth-child(1) {
    border-bottom: 1px solid rgb(238, 230, 230);
    color: #454545;
    margin-top:15px;

    .code {
      color: #1565d5;
    }
  }
}
</style>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #385d8e;
  background: #212121 url('../../../public/img/denglu.jpg') no-repeat center center;
  .loginbox {
    width:100%;
    height: 100%;


    .rights {
      width:450px;
      height: 435px;
      background:#fff;
      margin:0 auto;
      margin-top:245px;
      padding:47px 40px;
      .bottom {
        margin-top:51px;
        span{
          float: left;
          font-size:16px;
          cursor:pointer;
        }

      }
      .title {
        .active {
          color:#1989FA;
        }
        .username {
          display:inline-block;
          width:108px;
          height:25px;
          margin-left:50px;
          font-size:18px;
        }

        .tel {
          display:inline-block;
          width:108px;
          height:25px;
          margin-left:66px;
          font-size:18px;
        }
      }
    }

    .registryFrom {
        width:450px;
        height: 510px;
        background:#fff;
        margin:0 auto;
        margin-top:245px;
        padding:47px 40px;
        p {
          text-align:center;
          color:#1989FA;
          font-size:20px;
        }

        .getCode {
          margin-left:10px;
          cursor:pointer;
          outline: none;
          border: 0;
          background-color: transparent;
        }
    }
  }
  .login-form {
    width: 100%;
    max-width: 100%;
    margin-top:45px;
    overflow: hidden;

    .getCodes {
      margin-left:30px;
      cursor: pointer;
    }
  }



  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #889aa4;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    .imgbox {
      width:100%;
      height: 100%;
      margin-left:85px;
      margin-bottom:10px;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }
}
</style>
