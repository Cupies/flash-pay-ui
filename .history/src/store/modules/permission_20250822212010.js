import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { asyncRoutes, constantRoutes } from '@/router'

// 检查是否有权限
const hasPermission = (menus, route) => {
  if (route.meta && route.meta.code) {
    return menus.includes(route.meta.code)
  } else {
    return true
  }
}

// 过滤异步路由
export const filterAsyncRoutes = (routes, menus) => {
  const res = []
  routes.forEach(route => {
    const r = { ...route }
    if (hasPermission(menus, r)) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, menus)
      }
      res.push(r)
    }
  })
  return res
}

// 创建权限模块
@Module({ dynamic: true, store, name: 'permission' })
class Permission extends VuexModule {
  routes = []
  dynamicRoutes = []

  @Mutation
  SET_ROUTES(routes) {
    this.routes = [...constantRoutes, ...routes]
    this.dynamicRoutes = routes
  }

  @Action
  GenerateRoutes(menus) {
    const accessedRoutes = filterAsyncRoutes(asyncRoutes, menus)
    this.SET_ROUTES(accessedRoutes)
  }
}

// 导出权限模块
export const permissionStore = getModule(Permission)