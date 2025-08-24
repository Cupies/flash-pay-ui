import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { login, checkToken } from '@/api/users'
import { getToken, setToken, removeToken, setTenantId, getTenantId } from '@/utils/cookies'
import store from '@/store'

// 创建User模块
@Module({ dynamic: true, store, name: 'userStore' })
class userStore extends VuexModule {
  token = getToken() || ''
  name = ''
  avatar = ''
  introduction = ''
  roles = []
  userId = 0
  tenantId = getTenantId() || 0
  userName = ''
  mobile = ''
  menus = []
  buttons = []
  hasLoaded = false

  @Mutation
  SET_TOKEN(token) {
    this.token = token
  }

  @Mutation
  SET_NAME(name) {
    this.name = name
  }

  @Mutation
  SET_AVATAR(avatar) {
    this.avatar = avatar
  }

  @Mutation
  SET_INTRODUCTION(introduction) {
    this.introduction = introduction
  }

  @Mutation
  SET_TENANTID(tenantId) {
    this.tenantId = tenantId
  }

  @Mutation
  SET_ROLES(roles) {
    this.roles = roles
  }

  @Mutation
  SET_USER_ID(userId) {
    this.userId = userId
  }

  @Mutation
  SET_USERNAME(userName) {
    this.userName = userName
  }

  @Mutation
  SET_MOBILE(mobile) {
    this.mobile = mobile
  }

  @Mutation
  SET_MENUS(menus) {
    this.menus = menus
  }

  @Mutation
  SET_BUTTONS(buttons) {
    this.buttons = buttons
  }

  @Mutation
  SET_HAS_LOADED(hasLoaded) {
    this.hasLoaded = hasLoaded
  }

  @Action
  async Login(userInfo) {
    let { usernames, password } = userInfo
    usernames = usernames.trim()
    const client_id = 'merchant-platform'
    const client_secret = '123456'
    const grant_type = 'password'
    const username = {
      username: usernames,
      authenticationType: 'password'
    }

    const params = new URLSearchParams()
    params.append('client_id', client_id)
    params.append('client_secret', client_secret)
    params.append('grant_type', grant_type)
    params.append('password', password)
    params.append('username', JSON.stringify(username))
    
    const arr = []
    const res = await login(params)
    const param = new URLSearchParams()
    param.append('token', res.access_token)
    const responses = await checkToken(param)
    
    for (const item in responses.payload) {
      arr.push(item)
    }
    
    setToken(res.access_token)
    setTenantId(arr[0])
    localStorage.setItem('username', responses.user_name)
    localStorage.setItem('mobile', responses.mobile)
    this.SET_TOKEN(res.access_token)
    this.SET_TENANTID(arr[0])
  }

  @Action
  async operationLogin(userInfo) {
    let { usernames, password } = userInfo
    usernames = usernames.trim()
    const client_id = 'operation-platform'
    const client_secret = '123456'
    const grant_type = 'password'
    const username = {
      username: usernames,
      authenticationType: 'password'
    }

    const params = new URLSearchParams()
    params.append('client_id', client_id)
    params.append('client_secret', client_secret)
    params.append('grant_type', grant_type)
    params.append('password', password)
    params.append('username', JSON.stringify(username))
    
    const arr = []
    const res = await login(params)
    const param = new URLSearchParams()
    param.append('token', res.access_token)
    const responses = await checkToken(param)
    
    for (const item in responses.payload) {
      arr.push(item)
    }
    
    setToken(res.access_token)
    setTenantId(arr[0])
    localStorage.setItem('username', responses.user_name)
    localStorage.setItem('mobile', responses.mobile)
    this.SET_TOKEN(res.access_token)
    this.SET_TENANTID(arr[0])
  }

  @Action
  async Logins(userInfo) {
    let { phone, code, smsKey } = userInfo
    phone = phone.trim()
    const client_id = 'merchant-platform'
    const client_secret = '123456'
    const grant_type = 'password'
    const username = {
      username: phone,
      authenticationType: 'sms',
      payload: {
        smsKey: smsKey
      }
    }

    const params = new URLSearchParams()
    params.append('client_id', client_id)
    params.append('client_secret', client_secret)
    params.append('grant_type', grant_type)
    params.append('password', code)
    params.append('username', JSON.stringify(username))
    
    const arr = []
    const res = await login(params) 
    const param = new URLSearchParams()
    param.append('token', res.access_token)
    const responses = await checkToken(param)

    for (const item in responses.payload) {
      arr.push(item)
    }
    
    setToken(res.access_token)
    setTenantId(arr[0])
    localStorage.setItem('username', responses.user_name)
    localStorage.setItem('mobile', responses.mobile)
    this.SET_TOKEN(res.access_token)
    this.SET_TENANTID(arr[0])
  }

  @Action
  ResetToken() {
    removeToken()
    this.SET_TOKEN('')
    this.SET_ROLES([])
    this.SET_USER_ID(0)
  }

  @Action
  async GetUserInfo() {
    this.SET_ROLES(['11'])
    this.SET_NAME(this.name)
    this.SET_AVATAR(
      'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    )
    this.SET_INTRODUCTION('I am a super administrator')
    this.SET_MENUS([
      'P001',
      'P001001',
      'P001002',
      'P002',
      'P002001',
      'P002002',
      'P002003',
      'P002004',
      'P003',
      'P003001',
      'P003002'
    ])
    this.SET_BUTTONS(['P001001001', 'P001001002', 'P001001003', 'P001001004'])
    this.SET_HAS_LOADED(true)
  }

  @Action
  async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    removeToken()
    this.SET_TOKEN('')
  }
}

export default userStore