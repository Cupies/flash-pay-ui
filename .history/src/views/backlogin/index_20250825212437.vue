<template>
  <div class="login-container">
    <div class="loginbox">

        <div class="rights">
            <p class="title">账户密码登录</p>
            <el-form
            ref="loginForm"
            :model="loginForm"
            class="login-form"
            autocomplete="on"
            label-position="left"
            v-if="!flag"
          >
            <el-form-item prop="username">
              <el-input
                ref="username"
                name="username"
                v-model="loginForm.usernames"
                type="text"
                autocomplete="on"
                placeholder="手机号/用户名"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                :key="passwordType"
                ref="password"
                :type="passwordType"
                v-model="loginForm.password"
                placeholder="请输入密码"
                name="password"
                autocomplete="on"
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
        </div>

    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login, getLoginCode, getMsgCode, registryData } from '@/api/users'
import { useUserStore } from '@/store/modules/user'


export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter()
    const route = useRoute()
    
    const loginForm = ref({
      usernames: '',
      password: ''
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

    const showPwd = () => {
      if (passwordType.value === 'password') {
        passwordType.value = ''
      } else {
        passwordType.value = 'password'
      }
      // 聚焦逻辑需要模板中绑定ref
    }

    const handleLogin = async () => {
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
        await userStore.operationLogin(loginForm.value)
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

    const getOtherQuery = (query) => {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }

    return {
      loginForm,
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
      showPwd,
      handleLogin
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
        box-shadow: 0 0 0px 1000px $loginBg inset !important;
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
        text-align:center;
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
    margin: 0 auto;
    overflow: hidden;

    .getCodes {
      margin-left:30px;
      cursor: pointer;
    }
  }



  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $darkGray;
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
    color: $darkGray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
