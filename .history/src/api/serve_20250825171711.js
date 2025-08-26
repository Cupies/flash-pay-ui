import request from '@/utils/request'
import { useUserStore } from '@/store/modules/user'


//支付渠道查询
export const channelList = () =>
  request({
    url: `/operation/m/paychannels/list?tenantId=${userStore.tenantId}`,
    method: 'get'
  })