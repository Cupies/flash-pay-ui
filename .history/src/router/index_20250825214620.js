import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import financeRouter from './modules/finance'
import payRouter from './modules/pay'
import organizationRouter from './modules/organization'
import firmRouter from './modules/firm'
import serveRouter from './modules/serve'
import systemRouter from './modules/system'

/**
 * 静态路由
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true, title: '闪聚支付' }
  },
  {
    path: '/operationLogin',
    component: () => import('@/views/backlogin/index.vue'),
    meta: { hidden: true, title: '闪聚支付' }
  },
  {
    path: '/404',
    component: () => import('@/views/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: () => import('@/views/workbench/index.vue'),
    meta: { hidden: true, title: '工作台' }
  }
]

/**
 * 动态路由
 */
export const asyncRoutes = [
  financeRouter,
  payRouter,
  organizationRouter,
  firmRouter,
  serveRouter,
  systemRouter,
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

/**
 * 创建路由
 */
const initRouter = () => createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // 修正环境变量
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, left: 0 }
    }
  },
  routes: constantRoutes
})

// 修正路由实例化方式
const router = initRouter()

/**
 * 重置路由
 */
export function resetRouter() {
  const newRouter = initRouter() // 修正新路由实例创建方式
  router.matcher = newRouter.matcher
}

/**
 * 导出路由
 */
export default router