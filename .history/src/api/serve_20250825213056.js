import request from '@/utils/request'
import { userStore } from '@/store/modules/user'
const userStore = useUserStore()


//支付渠道查询
export const channelList = () =>
  request({
    url: `/operation/m/paychannels/list?tenantId=${userStore.tenantId}`,
    method: 'get'
  })