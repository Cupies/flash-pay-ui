import request from '@/utils/request'
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()

// 商户配置实际支付参数
export const setParams = (data) =>
  request({
    url: `/merchant/my/pay-channel-params?tenantId=${userStore.tenantId}`,
    method: 'post',
    data
  })

// 获取所有平台支付渠道
export const getAllPayChannel = () =>
  request({
    url: `/merchant/my/platform-channels?tenantId=${userStore.tenantId}`,
    method: 'get'
  })

// 修改商户配置实际支付参数
export const updateRealPayParam = (data) =>
  request({
    url: `/merchant/my/pay-channel-params?tenantId=${userStore.tenantId}`,
    method: 'put',
    data
  })

// 获取某应用下平台支付渠道所包含的原始支付参数列表
export const getPayChannelIncludePayParams = (appId, platformChannel) =>
  request({
    url: `/merchant/my/pay-channel-params/apps/${appId}/platform-channels/${platformChannel}?tenantId=${userStore.tenantId}`,
    method: 'get'
  })

// 获取某应用下平台支付渠道所包含的某个原始支付参数
export const getPayChannelIncludeOnlyPayParams = (appId, platformChannel, payChannel) =>
  request({
    url: `/merchant/my/pay-channel-params/apps/${appId}/platform-channels/${platformChannel}/pay-channels/${payChannel}?tenantId=${userStore.tenantId}`,
    method: 'get'
  })

// 获取商户配置实际支付参数,用于快捷复制填写参数
export const getRealPayParamsUseCopy = (merchantId, payChannel) =>
  request({
    url: `/merchant/my/pay-channel-params/merchants/${merchantId}/pay-channels/${payChannel}?tenantId=${userStore.tenantId}`,
    method: 'get'
  })

// 获取商户配置实际支付参数
export const getRealPayParams = (id) =>
  request({
    url: `/merchant/my/pay-channel-params/${id}?tenantId=${userStore.tenantId}`,
    method: 'get'
  })

// 根据平台支付渠道(编码)获取原始支付渠道
export const getPayChannelFromPayCode = (platformChannelCode) =>
  request({
    url: `/merchant/my/pay-channels/platform-channel/${platformChannelCode}?tenantId=${userStore.tenantId}`,
    method: 'get'
  })