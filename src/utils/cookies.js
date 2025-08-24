import Cookies from 'js-cookie'

// App
const sidebarStatusKey = 'sidebar_status'
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey)
export const setSidebarStatus = (sidebarStatus) => Cookies.set(sidebarStatusKey, sidebarStatus)

// userStore
const tokenKey = 'vue_typescript_admin_access_token'
const id = 'tenantId'
export const getToken = () => Cookies.get(tokenKey)
export const getTenantId = () => Cookies.get(id)
export const setToken = (token) => Cookies.set(tokenKey, token)
export const setTenantId = (tenantId) => Cookies.set(id, String(tenantId))
export const removeToken = () => Cookies.remove(tokenKey)
 