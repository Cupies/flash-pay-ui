import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { ElMessage } from 'element-plus'

import { userStore } from '@/store/modules/user'
import { permissionStore } from '@/store/modules/permission'


NProgress.configure({ showSpinner: false })

const whiteList = ['/login','/operationLogin']

// router.beforeEach(async(to, _, next) => {

//   // 获取userStore实例
//   const userStoreInstance = userStore()
  
//   // Determine whether the userStore has logged in
//   if (userStoreInstance.token) {
//     if (to.path === '/login') {
//       // If is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       // Check whether the userStore has obtained his permission roles
//       if (!userStoreInstance.hasLoaded) {
//         try {
//           await userStoreInstance.GetUserInfo()
//           const menus = userStoreInstance.menus
//           // Generate accessible routes map based on role
//           const permissionStoreInstance = permissionStore()
//           permissionStoreInstance.GenerateRoutes(menus)
//           // Dynamically add accessible routes
//           permissionStoreInstance.dynamicRoutes.forEach(route => {
//             router.addRoute(route)
//           })
//           // Hack: ensure addRoutes is complete
//           // Set the replace: true, so the navigation will not leave a history record
//           next({ ...to, replace: true })
//         } catch (err) {
//           // Remove token and redirect to login page
//           userStoreInstance.ResetToken()
//           ElMessage.error(err || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       } else {
//         next()
//       }
//     }
//   } else {
//     // Has no token
//     if (whiteList.indexOf(to.path) !== -1) {
//       // In the free login whitelist, go directly
//       next()
//     } else {
//       // Other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })
router.beforeEach(async(to, _, next) => {
  // 临时跳过所有权限验证，直接放行
  next()
  return
})
router.afterEach((to) => {
  // Finish progress bar
  NProgress.done()

  // set page title
  document.title = to.meta.title
})
