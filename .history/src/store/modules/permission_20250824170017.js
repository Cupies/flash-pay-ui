// ...existing code...
import { defineStore } from 'pinia'
import { asyncRoutes, constantRoutes } from '@/router'

// 权限判断
const hasPermission = (menus, route) => {
  if (route.meta && route.meta.code) {
    return menus.includes(route.meta.code)
  } else {
    return true
  }
}

const filterAsyncRoutes = (routes, menus) => {
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

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    routes: [],
    dynamicRoutes: []
  }),
  actions: {
    SET_ROUTES(routes) {
      this.routes = [...constantRoutes, ...routes]
      this.dynamicRoutes = routes
    },
    GenerateRoutes(menus) {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, menus)
      this.SET_ROUTES(accessedRoutes)
      return accessedRoutes
    }
  }
})


// 导出权限模块
export const permissionStore = getModule(Permission)