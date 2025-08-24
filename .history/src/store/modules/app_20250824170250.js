// ...existing code...
import { defineStore } from 'pinia'
import { getSidebarStatus, setSidebarStatus } from '@/utils/cookies'
im
// 设备类型常量
export const DeviceType = {
  Mobile: 0,
  Desktop: 1
}

export const useAppStore = defineStore('app', {
  state: () => ({
    sidebar: {
      opened: getSidebarStatus() !== 'closed',
      withoutAnimation: false
    },
    device: DeviceType.Desktop
  }),
  actions: {
    TOGGLE_SIDEBAR(withoutAnimation) {
      this.sidebar.opened = !this.sidebar.opened
      this.sidebar.withoutAnimation = withoutAnimation
      if (this.sidebar.opened) setSidebarStatus('opened')
      else setSidebarStatus('closed')
    },
    CLOSE_SIDEBAR(withoutAnimation) {
      this.sidebar.opened = false
      this.sidebar.withoutAnimation = withoutAnimation
      setSidebarStatus('closed')
    },
    TOGGLE_DEVICE(device) {
      this.device = device
    },
    ToggleSideBar(withoutAnimation) { this.TOGGLE_SIDEBAR(withoutAnimation) },
    CloseSideBar(withoutAnimation) { this.CLOSE_SIDEBAR(withoutAnimation) },
    ToggleDevice(device) { this.TOGGLE_DEVICE(device) }
  }
})


// 导出App模块
export const appStore = getModule(App)
export { DeviceType }