import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { getSidebarStatus, setSidebarStatus } from '@/utils/cookies'
import store from '@/store'

// 设备类型常量
const DeviceType = {
  Mobile: 0,
  Desktop: 1
}

// 创建App模块
@Module({ dynamic: true, store, name: 'app' })
class App extends VuexModule {
  sidebar = {
    opened: getSidebarStatus() !== 'closed',
    withoutAnimation: false
  }
  
  device = DeviceType.Desktop

  @Mutation
  TOGGLE_SIDEBAR(withoutAnimation) {
    this.sidebar.opened = !this.sidebar.opened
    this.sidebar.withoutAnimation = withoutAnimation
    if (this.sidebar.opened) {
      setSidebarStatus('opened')
    } else {
      setSidebarStatus('closed')
    }
  }

  @Mutation
  CLOSE_SIDEBAR(withoutAnimation) {
    this.sidebar.opened = false
    this.sidebar.withoutAnimation = withoutAnimation
    setSidebarStatus('closed')
  }

  @Mutation
  TOGGLE_DEVICE(device) {
    this.device = device
  }

  @Action
  ToggleSideBar(withoutAnimation) {
    this.TOGGLE_SIDEBAR(withoutAnimation)
  }

  @Action
  CloseSideBar(withoutAnimation) {
    this.CLOSE_SIDEBAR(withoutAnimation)
  }

  @Action
  ToggleDevice(device) {
    this.TOGGLE_DEVICE(device)
  }
}

// 导出App模块
export const appStore = getModule(App)
export { DeviceType }