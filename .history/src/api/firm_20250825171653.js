import request from '@/utils/request'
import { useUserStore } from '@/store/modules/user'

// 商户个人认证审核
export const OneApprove = (auditStatus, id) =>
  request({
    url: `/operation/m/merchants/audit/${auditStatus}?tenantId=${id}`,
    method: 'post'
  })

// 商户列表
export const storeList = (data, pageNo, pageSize) =>
  request({
    url: `/operation/m/merchants/page?pageNo=${pageNo}&pageSize=${pageSize}&tenantId=${userStore.tenantId}`,
    method: 'post',
    data
  })

// 根据商户获取商户信息
export const getMsgFromMer = (id) =>
  request({
    url: `/operation/m/merchants?id=${id}`,
    method: 'get'
  })

// 查询某个员工的信息
export const SearchMsg = (id) =>
  request({
    url: `/operation/m/staffs/${id}?tenantId=${userStore.tenantId}`,
    method: 'get'
  })

// 删除某员工
export const delMember = (id) =>
  request({
    url: `/operation/m/staffs/${id}?tenantId=${userStore.tenantId}`,
    method: 'DELETE'
  })

// 分页条件查询会员信息
export const getMemberMsg = (pageNo, pageSize) =>
  request({
    url: `/operation/m/staffs/page?pageNo=${pageNo}&pageSize=${pageSize}&tenantId=${userStore.tenantId}`,
    method: 'get'
  })

// 删除某商户
export const delMerchants = (id) =>
  request({
    url: `/operation/m/merchants?tenantId=${userStore.tenantId}`,
    method: 'DELETE'
  })
