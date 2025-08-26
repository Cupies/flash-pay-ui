import moment from 'moment'

moment.locale('zh-cn')

// 创建一个导出函数，接收 app 实例
export default function(app) {
  // 在 Vue 3 中添加全局属性
  app.config.globalProperties.$filters = {
    dateTimeFormat(value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
