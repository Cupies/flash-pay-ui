import request from '@/utils/request'
import { useUserStore } from '@/store/modules/userStore'

// 创建应用
export const createApp = (data) =>
  request({
    url: `/merchant/my/apps?tenantId=${userStore.tenantId}`,
    method: 'post',
    data
  })

// 获取商户下应用列表
export const getAppList = () =>
  request({
    url: `/merchant/my/apps?tenantId=${userStore.tenantId}`,
    method: 'get'
  })

// 修改应用
export const updateApp = (data) =>
  request({
    url: `/merchant/my/apps?tenantId=${userStore.tenantId}`,
    method: 'put',
    data
  })

// 获取某应用，根据应用的业务主键appId
export const getAppFromId = (appId) =>
  request({
    url: `/merchant/my/apps/${appId}?tenantId=${userStore.tenantId}`,
    method: 'get'
  })

// 商户生成应用二维码
export const createCode = (appId, totalAmount) =>
  request({
    url: `/merchant/my/apps/${appId}?tenantId=${userStore.tenantId}&totalAmount=${totalAmount}`,
    method: 'get'
  })

// 查询app下绑定的服务类型（或者叫平台支付渠道）
export const getServiceType = (appId) =>
  request({
    url: `/merchant/my/apps/${appId}/platform-channels?tenantId=${userStore.tenantId}`,
    method: 'get'
  })

// 为应用绑定平台支付渠道
export const boundRoad = (appId, platformChannelCodes) =>
  request({
    url: `/merchant/my/apps/${appId}/platform-channels?platformChannelCodes=${platformChannelCodes}&tenantId=${userStore.tenantId}`,
    method: 'post'
  })

// 商户修改某应用的Webhooks
export const updateWebhooks = (data, id, notifyUrl) =>
  request({
    url: `/merchant/my/apps/${id}/notify-url/${notifyUrl}?tenantId=${userStore.tenantId}`,
    method: 'put',
    data
  })

// 为应用解绑平台支付渠道
export const delPayChannel = (appId, platformChannelCode) =>
  request({
    url: `/merchant/my/apps/${appId}/platform-channels/${platformChannelCode}?tenantId=${userStore.tenantId}`,
    method: 'DELETE'
  })

// 生成商户应用门店二维码
export const getStoresDataCode = (appId, storeId, body, totalAmount) =>
  request({
    url: `/merchant/my/apps/${appId}/stores/${storeId}/app-store-qrcode?tenantId=${userStore.tenantId}&body=${body}&totalAmount=${totalAmount}`,
    method: 'get'
  })

// 查询应用是否绑定了某个服务类型
export const searchIsBindService = (appId, platformChannel) =>
  request({
    url: `/merchant/my/merchants/apps/platform-channels?tenantId=${userStore.tenantId}&appId=${appId}&platformChannel=${platformChannel}`,
    method: 'get'
  })

// 某商户下所有应用的交易汇总
export const getDealCollect = (data) =>
  request({
    url: `/merchant/my/merchants/transactions?tenantId=${userStore.tenantId}`,
    method: 'post',
    data
  })

// 商户下所有交易按照应用分类汇总
export const getAllDealFromAppType = () =>
  request({
    url: `/merchant/my/merchants/transactions/apps?tenantId=${userStore.tenantId}`,
    method: 'post'
  })

// 商户下所有交易按渠道汇总
export const getAllDealFromChannel = () =>
  request({
    url: `/merchant/my/merchants/transactions/channels?tenantId=${userStore.tenantId}`,
    method: 'post'
  })

// 查询某个订单交易明细
export const getOrderDeal = (data, tradeNumber) =>
  request({
    url: `/merchant/my/merchants/transactions/${tradeNumber}?tenantId=${userStore.tenantId}`,
    method: 'post',
    data
  })

// B扫C支付接口
export const BscanC = (data) =>
  request({
    url: `/merchant/createOrderBCscanPay?tenantId=${userStore.tenantId}`,
    method: 'post',
    data
  })

// 获取客户端信息，展示开启的支付
export const getPayParams = (appId) =>
  request({
    url: `/merchant/my/apps/clientdetails/${appId}?tenantId=${userStore.tenantId}`,
    method: 'get'
  })
