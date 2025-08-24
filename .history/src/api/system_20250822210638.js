import request from '@/utils/request'
import { userStore } from '@/store/modules/userStore'

// 新建管理员
export const createAdmin = (data) =>
  request({
    url: `/operation/m/administrators?tenantId=${userStore.tenantId}`,
    method: 'post',
    data
  })

// 修改管理员
export const updataAdmin = (data) =>
  request({
    url: `/operation/m/administrators?tenantId=${userStore.tenantId}`,
    method: 'put',
    data
  })

// 分页查询管理员信息
export const getAdminList = (pageNo, pageSize) =>
  request({
    url: `/operation/m/administrators/page?pageNo=${pageNo}&pageSize=${pageSize}&tenantId=${userStore.tenantId}`,
    method: 'get'
  })

// 查询某个管理员信息
export const searchAdmin = (username) =>
  request({
    url: `/operation/m/administrators/${username}?tenantId=${userStore.tenantId}`,
    method: 'post'
  })

// 删除某管理员
export const delAdmin = (username) =>
  request({
    url: `/operation/m/administrators/${username}?tenantId=${userStore.tenantId}`,
    method: 'post'
  })

// 新建角色
export const createRoles = (data) =>
  request({
    url: `/operation/m/roles?tenantId=${userStore.tenantId}`,
    method: 'post',
    data
  })

// 修改角色
export const updataRoles = (data) =>
  request({
    url: `/operation/m/roles?tenantId=${userStore.tenantId}`,
    method: 'put',
    data
  })

// 分页查询角色信息
export const getRolesList = (pageNo, pageSize) =>
  request({
    url: `/operation/m/roles/page?pageNo=${pageNo}&pageSize=${pageSize}&tenantId=${userStore.tenantId}`,
    method: 'get'
  })

// 为角色分配权限
export const searchRoles = () =>
  request({
    url: `/operation/m/roles/privileges?tenantId=${userStore.tenantId}`,
    method: 'post'
  })

// 删除某角色
export const delRoles = (roleCode) =>
  request({
    url: `/operation/m/roles/${roleCode}?tenantId=${userStore.tenantId}`,
    method: 'post'
  })