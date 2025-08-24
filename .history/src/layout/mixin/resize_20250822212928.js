import { onMounted, onBeforeUnmount, onBeforeMount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { AppModule, DeviceType } from '@/store/modules/app'

const WIDTH = 992 // refer to Bootstrap's responsive design

export default {
  computed: {
    device() {
      return AppModule.device
    },
    sidebar() {
      return AppModule.sidebar
    }
  },
  setup() {
    const route = useRoute()
    
    // 监听路由变化
    watch(() => route.path, () => {
      if (AppModule.device === DeviceType.Mobile && AppModule.sidebar.opened) {
        AppModule.CloseSideBar(false)
      }
    })
    
    // 组件挂载前添加事件监听
    onBeforeMount(() => {
      window.addEventListener('resize', resizeHandler)
    })
    
    // 组件挂载时初始化设备类型
    onMounted(() => {
      const isMobile = isMobileDevice()
      if (isMobile) {
        AppModule.ToggleDevice(DeviceType.Mobile)
        AppModule.CloseSideBar(true)
      }
    })
    
    // 组件卸载前移除事件监听
    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeHandler)
    })
    
    // 判断是否为移动设备
    const isMobileDevice = () => {
      const rect = document.body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    }
    
    // 窗口大小变化处理函数
    const resizeHandler = () => {
      if (!document.hidden) {
        const isMobile = isMobileDevice()
        AppModule.ToggleDevice(isMobile ? DeviceType.Mobile : DeviceType.Desktop)
        if (isMobile) {
          AppModule.CloseSideBar(true)
        }
      }
    }
    
    return {
      isMobileDevice,
      resizeHandler
    }
  }
}
