import { createApp } from 'vue'
import 'normalize.css'
import SvgIcon from '@/components/SvgIcon/index.vue';
import ElementPlus from 'element-plus'  
import 'element-plus/dist/index.css'  
import '@/styles/element-variables.scss'
import '@/styles/index.scss'
import { createPinia } from 'pinia'
import 'virtual:svg-icons-register'
import './registerServiceWorker'

import App from '@/App.vue'
import router from '@/router'
import directive from '@/directive' 
import '@/permission'
const app = createApp(App)
const pinia = createPinia()

// 导入并应用过滤器
import filter from '@/filter'
filter(app)

app.use(pinia)
app.use(ElementPlus)  
app.use(router)
app.use(directive) // directive 默认导出 install
// 生产环境下注册 service worker（registerServiceWorker 已改用 import.meta.env）
if (import.meta.env.PROD) {
  // registerServiceWorker 模块会做自己是否注册的判断
  // 如果是函数导出可直接调用，否则该 import 会执行内部注册逻辑
}
app.component("SvgIcon", SvgIcon);
app.mount('#app')