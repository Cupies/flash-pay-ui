<template>
  <div class="box-container">
    <div class="box">
        <div class="logos">
          <img src="../../public/img/logo/logo.png" alt="" class="imgs" @click="goHome">
        </div>
        <sidebar  class="sidebar-container"/>
         <div class="right-menu">
           <img src="../../public/img/head.png" alt="" >
           <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">账户中心</el-dropdown-item>
              <el-dropdown-item command="b">切换用户</el-dropdown-item>
              <el-dropdown-item command="c">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
    </div>
    <div
    :class="classObj"
    class="app-wrapper"
  >
    <div
      v-if="classObj.mobile && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    
    <div class="main-container">
      <navbar />
      <app-main />
    </div>
  </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { DeviceType, appStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import AppMain from './components/AppMain.vue'
import Navbar from './components/Navbar/index.vue'
import Sidebar from './components/Sidebar.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import ResizeMixin from './mixin/resize'

export default defineComponent({
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar,
    Hamburger
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const username = ref('')
    
    onMounted(() => {
      username.value = localStorage.getItem('username') || ''
    })
    
    const classObj = computed(() => {
      return {
        hideSidebar: !appStore.sidebar.opened,
        openSidebar: appStore.sidebar.opened,
        withoutAnimation: appStore.sidebar.withoutAnimation,
        mobile: appStore.device === DeviceType.Mobile
      }
    })
    
    const avatar = computed(() => {
      return userStore.avatar
    })
    
    const logout = async () => {
      // 登出逻辑
    }
    
    const toggleSideBar = () => {
      appStore.ToggleSideBar(false)
    }
    
    const handleClickOutside = () => {
      appStore.CloseSideBar(false)
    }
    
    const sidebar = computed(() => {
      return appStore.sidebar
    })
    
    const goHome = () => {
      router.push('/')
    }
    
    const handleCommand = async (value) => {
      if (value === 'c') {
        await userStore.LogOut()
        router.push(`/login?redirect=${route.fullPath}`)
      } else if (value === 'a') {
        router.push('/finance/index')
      } else {
        console.log(1)
      }
    }
    
    return {
      username,
      classObj,
      avatar,
      logout,
      toggleSideBar,
      handleClickOutside,
      sidebar,
      goHome,
      handleCommand
    }
  }
})
</script>

<style lang="scss" scoped>
.box-container {
  width: 100%;
  height: 100%;
}
.box {
  height: 60px;
  width: 100%;
  position: fixed;
  top:0;
  right: 0;
  z-index: 1999;
  background: #2A2669;

  .sidebar-container {
    width: auto;
    margin-left: 500px;
  }

  .logos {
    width: 350px;
    height: 100%;
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;

    span {
      color: white;
      margin-left: 5px;
      font-size: 22px;
      float: left;
      margin-top: 20px;
    }
  }
  .imgs {
   
    margin-left: 50px;
    margin-top: 12px;
    float: left;
  }

}
.title {
  float: left;
  color: white;
  font-size: 28px;
  line-height: 50px;
  margin-left: 40px;
  font-family: "Microsoft YaHei"
}
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.main-container {
  min-height: 100%;
  background-color: #f2f5fa;
}



.hideSidebar {
  .main-container {
    margin-left: 54px;
  }

  .sidebar-container {
    width: 54px !important;
  }
}

/* for mobile response 适配移动端 */
.mobile {
  .main-container {
    margin-left: 0px;
  }

  .sidebar-container {
    transition: transform .28s;
    width: 210px !important;
  }

  &.openSidebar {
    position: fixed;
    top: 0;
  }

  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-210px, 0, 0);
    }
  }
}

.withoutAnimation {
  .main-container,
  .sidebar-container {
    transition: none;
  }
}

.hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    padding: 0 20px;
    cursor: pointer;
    margin-left: 200px;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }
  
  .right-menu {
    white-space:nowrap;
    padding: 0 10px;
    position: absolute;
    right: 18px;
    top: 10px;;
    height: 100%;
    line-height: 60px;
    overflow: hidden;
    img {
      width: 30px;
      height: 30px;
      margin-right: 20px;
    }
    .el-dropdown-link {
      white-space:nowrap;
      position: relative;
      color: white;
      right: 15px;;
      z-index: 2500;
      display: inline-block;
      top: -10px;
      i {
        position: absolute;
        color: white;
        top: 25px;
        right: -15px;
        z-index: 2000;
      }
    }
    
  }

   
</style>
