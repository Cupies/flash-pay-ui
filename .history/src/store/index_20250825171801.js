
import { createPinia } from 'pinia'

/**
 * 导出 Pinia 实例（在 main.js 中按需使用： app.use(pinia) 或 import store from '@/store'; app.use(store) ）
 */
const pinia = createPinia()
export default pinia

/**
 * 兼容层：部分旧代码可能调用 getModule(...)。
 * 使用方式推荐传入 useXxxStore（即 defineStore 生成的使用函数），
 * getModule 会调用该函数并返回 store 实例。
 *
 * 例：
 *   import { getModule } from '@/store'
 *   import { useUserStore } from '@/store/modules/user'
 *   const userStore = getModule(useUserStore) // 等同于 useUserStore()
 */
export function getModule(storeFactory) {
  if (!storeFactory) return null
  if (typeof storeFactory === 'function') {
    try {
      return storeFactory()
    } catch (e) {
      
      return null
    }
  }
  return null
}

