
import { createPinia } from 'pinia'

/**
 * 导出 Pinia 实例（在 main.js 中按需使用： app.use(pinia) 或 import store from '@/store'; app.use(store) ）
 */
const pinia = createPinia()
export default pinia

/**
 * 兼容层：部分旧代码可能调用 getModule(...)。
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

