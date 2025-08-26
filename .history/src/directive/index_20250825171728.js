import { getCurrentInstance } from 'vue'
import { useUserStore } from '@/store/modules/user'

// 权限指令
const hasDirective = {
  mounted: (el, binding) => {
    const instance = getCurrentInstance()
    if (!instance.appContext.config.globalProperties.$_has(binding.value)) {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el)
      }
    }
  }
}

// 权限检查方法
const hasPermission = (value) => {
  return userStore.buttons.includes(value)
}

// 导出指令和全局方法
export default {
  install: (app) => {
    app.directive('has', hasDirective)
    app.config.globalProperties.$_has = hasPermission
  }
}
