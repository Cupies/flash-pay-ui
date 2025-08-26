import request from '@/utils/request'
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()

// 证件上传
export const upload = (data) =>
  request({
    url: `/merchant/upload?tenantId=${userStore.tenantId}`,
    method: 'post',
    data
  })

// 商户个人认证资料保存(申请)
export const setApprove = (data) =>
  request({
    url: `/merchant/my/merchants/save?tenantId=${userStore.tenantId}`,
    method: 'post',
    data
  })

// 根据租户获取商户信息
export const getList = () =>
  request({
    url: `/merchant/my/merchants?tenantId=${userStore.tenantId}`,
    method: 'get'
  })