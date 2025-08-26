import moment from 'moment'

moment.locale('zh-cn')
Vue.filter('dateTimeFormat', function(value) {
  return moment(value).format('YYYY-MM-DD HH:mm:ss')
})
