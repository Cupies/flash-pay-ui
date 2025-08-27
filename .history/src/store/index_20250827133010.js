
import { createPinia } from 'pinia'

/**
 * 导出 Pinia 实例（在 main.js 中按需使用： app.use(pinia) 或 import store from '@/store'; app.use(store) ）
 */
const pinia = createPinia()
export default pinia


createApp(app).use(store) // 直接给他挂上边，就解决啦
// 全局注册 store
export function setupStore(app) {
  app.use(store); // 挂载pinia
}
export { store };
————————————————
版权声明：本文为CSDN博主「jsmeng626」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/jsmeng626/article/details/129835207

/**
 * 兼容层：部分旧代码可能调用 getModule(...)。
 */
export function getModule(storeFactory) {
  if (!storeFactory) {
    console.warn('getModule: storeFactory is undefined or null')
    return null
  }
  if (typeof storeFactory === 'function') {
    try {
      return storeFactory()
    } catch (e) {
      console.error('getModule: Failed to create store instance:', e)
      return null
    }
  }
  console.warn('getModule: storeFactory is not a function')
  return null
}

