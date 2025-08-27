/* eslint-disable no-console */

import { register } from 'register-service-worker'

// 在生产环境中注册 Service Worker
if (import.meta.env.PROD) {
  register(`${import.meta.env.BASE_URL}service-worker.js`, {
    // Service Worker 准备就绪时触发
    ready() {
      console.log(
        '应用程序正在通过 Service Worker 从缓存提供服务。\n' +
        '有关详细信息，请访问 https://goo.gl/AFskqB'
      )
    },
    // Service Worker 注册成功时触发
    registered(registration) {
      console.log('Service Worker 已成功注册。')
      
      // 设置周期性更新检查（每12小时）
      registration.update()
      setInterval(() => {
        registration.update()
      }, 12 * 60 * 60 * 1000)
    },
    
    // 内容首次缓存成功时触发
    cached(registration) {
      console.log('内容已缓存以供离线使用。')
    },
    
    // 发现新内容开始下载时触发
    updatefound(registration) {
      console.log('正在下载新内容...')
      
      // 创建进度提示
      const showUpdateNotification = () => {
        if (confirm('有新的更新可用，是否立即刷新以应用更新？')) {
          window.location.reload()
        }
      }
      
      // 监听新的 Service Worker 状态变化
      if (registration.installing) {
        registration.installing.onstatechange = () => {
          if (registration.waiting) {
            // 新的 Service Worker 已下载完成并等待激活
            if (navigator.serviceWorker.controller) {
              // 有正在运行的 Service Worker，提示用户更新
              showUpdateNotification()
            } else {
              // 首次安装，无需提示
              console.log('内容已缓存以供离线使用。')
            }
          }
        }
      }
    },
    
    // Service Worker 更新成功时触发
    updated(registration) {
      console.log('新内容已可用，请刷新页面。')
    },
    
    // 离线状态时触发
    offline() {
      console.log('未找到网络连接。应用程序正在离线模式下运行。')
    },

    // 注册过程中发生错误时触发
    error(error) {
      console.error('Service Worker 注册过程中发生错误:', error)
    }
  })
  
  // 监听控制器变化，处理更新
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('Service Worker 控制器已变更')
    // 可选：自动刷新页面以使用新的 Service Worker
    // window.location.reload()
  })
}
