/**
 * @Description: 用户数据配置
 * @author Roman
 * @date 2020/6/18
 */
import { getInfo, getPermitList } from '@/api/user'
import { sendLocalInfo } from '@/api/app'
import { userUnreadCount } from '@/views/user-center/message-center/api/index.js'
import { sysAppSystem } from '@/views/user-center/micro-services/api/index.js'
import { orgPage } from '@/views/user-center/department-management/api/index.js'
import { sysPermitPage } from '@/views/user-center/menu-management/api/index.js'
import { rolePageList } from '@/views/user-center/role-management/api/index.js'
import { userPageList } from '@/views/user-center/employee-management/api/index.js'
import { sysDataGroupPage } from '@/views/user-center/data-setting-range/api/index.js'
import { sysDataMaskingRulePage } from '@/views/user-center/business-field-encryption-settings/api/index.js'
import { sysUserLogpage } from '@/views/user-center/log-management/api/index.js'
import { getStorageToken, setToken, removeToken, setStorageToken, removeStorageToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { parseTime } from '@/utils'
import jwt from 'jsonwebtoken'
const state = {
  token: getStorageToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  userId: '',
  realName: '',
  permits: [],
  userInfo: {},
  unreadCount: 0,
  tokenObj: null,

  // 存储用户中心每个菜单第一页20条的数据
  microData: [],
  departmentData: [],
  menuData: [],
  roleData: [],
  employeeData: [],
  rangeData: [],
  encryptionData: [],
  logData: [],

  // 存储用户中心每个菜单分页查询的条件params
  microParams: {},
  departmentParams: {},
  menuParams: {},
  roleParams: {},
  employeeParams: {},
  rangeParams: {},
  encryptionParams: {},
  logParams: {},

  menuParamsAppSystemIds: [],

  topic: 'usercenter-redo-receive-6p3r'
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_TOKENOBJ: (state, tokenObj) => {
    state.tokenObj = tokenObj
  },
  SET_UNREADCOUNT: (state, data) => {
    state.unreadCount = data
  },
  ADD_UNREADCOUNT: (state, data) => {
    state.unreadCount++
  },

  // 以下8个都是设置菜单第一页数据的方法
  SET_MICROData: (state, data) => {
    state.microData = data
  },
  SET_DEPARTMENTData: (state, data) => {
    state.departmentData = data
  },
  SET_MENUData: (state, data) => {
    state.menuData = data
  },
  SET_ROLEData: (state, data) => {
    state.roleData = data
  },
  SET_EMPLOYEEData: (state, data) => {
    state.employeeData = data
  },
  SET_RANGEData: (state, data) => {
    state.rangeData = data
  },
  SET_ENCRYPTIONData: (state, data) => {
    state.encryptionData = data
  },
  SET_LOGData: (state, data) => {
    state.logData = data
  },

  SET_PERMITS: (state, list) => {
    state.permits = list
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERINFO: (state, info) => {
    state.userInfo = info
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_REALNAME: (state, realName) => {
    state.realName = realName
  },
  SET_MUNUPARAMSAPPSYSTEMIDS: (state, menuParamsAppSystemIds) => {
    state.menuParamsAppSystemIds = menuParamsAppSystemIds
  }
}

function setData(commit, dispatch, data) {
  const { roles, name, avatar, realName, userId } = data
  const tokenObj = JSON.parse(getStorageToken('tokenObj'))
  dispatch('app/setows', tokenObj, { root: true })
  commit('SET_ROLES', roles)
  commit('SET_USERINFO', data)
  commit('SET_NAME', name)
  commit('SET_AVATAR', avatar)
  commit('SET_USERID', userId)
  commit('SET_REALNAME', realName)
}
const actions = {
  // user login
  login({ commit, state, dispatch }, data) {
    const { access_token, res } = data
    const { address, mac } = process.env.getLocal || {}
    if (process.env.NODE_ENV === 'development') {
      const tokenInfo = jwt.decode(res.access_token)
      const info = `${decodeURI('%E7%99%BB%E5%BD%95erp2%E6%9C%AC%E5%9C%B0%E5%BC%80%E5%8F%91%E6%8F%90%E9%86%92')}：\n${decodeURI('%E7%94%A8%E6%88%B7')}：${tokenInfo.realname}/${tokenInfo.user_name}\nip：${address}\nmac：${mac}\n${decodeURI('%E6%97%B6%E9%97%B4')}：${parseTime(new Date().getTime())}`
      sendLocalInfo(info)
    }
    return new Promise((resolve, reject) => {
      commit('SET_TOKENOBJ', res)
      commit('SET_TOKEN', access_token)
      setStorageToken({ name: 'token', value: access_token })
      setStorageToken({ name: 'tokenObj', value: JSON.stringify(res) })
      setToken({ name: 'token', value: 'access_token' })
      const domain = document.domain.split('.').slice(-2).join('.')
      setToken({ name: 'staticToken', value: access_token, domain })
      resolve()
    })
  },

  // get user info
  getInfo({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      const userInfo = getStorageToken('userInfo')
      if (userInfo) {
        const data = JSON.parse(userInfo)
        setData(commit, dispatch, data)
        resolve(data)
      } else {
        getInfo().then(response => {
          const { data } = response
          if (!data) {
            reject('Verification failed, please Login again.')
          }
          // roles must be a non-empty array
          // if (!roles || roles.length <= 0) {
          //   reject('getInfo: roles must be a non-null array!')
          // }
          setStorageToken({ name: 'userInfo', value: JSON.stringify(data) })
          setData(commit, dispatch, data)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      }
    })
  },
  initData: async({ commit, state, dispatch }) => {
    setTimeout(() => {
      dispatch('getMunuData')
    }, 5000)
  },
  // 获取用户权限标识
  getPermits({ commit, state }) {
    return new Promise((resolve, reject) => {
      const permitListToken = getStorageToken('permitList')
      if (permitListToken) {
        const permitListArr = JSON.parse(permitListToken)
        const newList = permitListArr.map(v => v.permitTag)
        commit('SET_PERMITS', newList)
        resolve(permitListArr)
      } else {
        getPermitList().then(response => {
          const list = response.data || []
          const newList = list.map(v => v.permitTag)
          setStorageToken({ name: 'permitList', value: JSON.stringify(list) })
          commit('SET_PERMITS', newList)
          resolve(list)
        }).catch(error => {
          reject(error)
        })
      }
    })
  },

  // 获取未读数量
  getUnreadCount({ commit, state, dispatch }, data) {
    return new Promise((resolve, reject) => {
      userUnreadCount(data).then(response => {
        const { data } = response
        commit('SET_UNREADCOUNT', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取业务系统管理第一页数据
  getMicroData({ commit, state }) {
    return new Promise((resolve, reject) => {
      state.permits.includes('userCenter:sysAppSystem:list') && sysAppSystem().then(response => {
        const list = response.data.list || []
        commit('SET_MICROData', list)
        resolve(list)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取组织架构第一页数据
  getDepartmentData({ commit, state }) {
    return new Promise((resolve, reject) => {
      state.permits.includes('userCenter:sysOrg:list') && orgPage().then(response => {
        const list = response.data.list || []
        commit('SET_DEPARTMENTData', list)
        resolve(list)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取菜单管理第一页数据
  getMunuData({ commit, state }) {
    console.log(state, state.menuParamsAppSystemIds)
    return new Promise((resolve, reject) => {
      state.permits.includes('userCenter:sysPermit:list') && sysPermitPage({ appSystemIds: state.menuParamsAppSystemIds.length ? state.menuParamsAppSystemIds : state.userInfo.appSystemIds.length ? state.userInfo.appSystemIds : null }).then(response => {
        const list = response.data.list || []
        commit('SET_MENUData', list)
        resolve(list)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取角色管理第一页数据
  getRoleData({ commit, state }) {
    // console.log(state.permits)
    return new Promise((resolve, reject) => {
      state.permits.includes('userCenter:sysRole:list') && rolePageList().then(response => {
        const list = response.data.list || []
        commit('SET_ROLEData', list)
        resolve(list)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取员工管理第一页数据
  getEmployeeData({ commit, state }) {
    // console.log(state.permits)
    return new Promise((resolve, reject) => {
      state.permits.includes('userCenter:sysUser:list') && userPageList().then(response => {
        const list = response.data.list || []
        commit('SET_EMPLOYEEData', list)
        resolve(list)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取数据范围第一页数据
  getRangeData({ commit, state }) {
    // console.log(state.permits)
    return new Promise((resolve, reject) => {
      state.permits.includes('userCenter:sysDataGroup:list') && sysDataGroupPage().then(response => {
        response.data.list && response.data.list.map((item, index) => { item.id = (response.data.pageNum - 1) * response.data.pageSize + index + 1 })
        const list = response.data.list || []
        commit('SET_RANGEData', list)
        resolve(list)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取字段加密第一页数据
  getEncryptionData({ commit, state }) {
    // console.log(state.permits)
    return new Promise((resolve, reject) => {
      state.permits.includes('userCenter:sysDataMaskingRule:list') && sysDataMaskingRulePage().then(response => {
        response.data.list && response.data.list.map((item, index) => { item.id = (response.data.pageNum - 1) * response.data.pageSize + index + 1 })
        const list = response.data.list || []
        commit('SET_ENCRYPTIONData', list)
        resolve(list)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取日志管理第一页数据
  getLogData({ commit, state }) {
    // console.log(state.permits)
    return new Promise((resolve, reject) => {
      state.permits.includes('userCenter:sysUserLog:list') && sysUserLogpage().then(response => {
        response.data.list && response.data.list.map((item, index) => { item.id = (response.data.pageNum - 1) * response.data.pageSize + index + 1 })
        const list = response.data.list || []
        commit('SET_LOGData', list)
        resolve(list)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      location.href = process.env.VUE_APP_LOGOUT
      dispatch('tagsView/delAllViews', null, { root: true })
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      removeToken('staticToken')
      removeToken('JSESSIONID')
      removeToken('s_id')
      removeStorageToken('serveChange')
      removeStorageToken()
      removeStorageToken('userInfo')
      removeStorageToken('permitList')
      removeStorageToken('systemList')
      removeStorageToken('authLists')
      resetRouter()
    })
  },
  reAuth({ commit, state, dispatch }, code) {
    return new Promise((resolve, reject) => {
      dispatch('tagsView/delAllViews', null, { root: true })
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      removeToken('staticToken')
      removeToken('JSESSIONID')
      removeStorageToken()
      removeStorageToken('userInfo')
      removeStorageToken('permitList')
      removeStorageToken('systemList')
      removeStorageToken('authLists')
      resetRouter()
      location.href = code ? process.env.VUE_APP_LOGIN + `&status=${code}` : process.env.VUE_APP_LOGIN
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      removeToken('JSESSIONID')
      removeStorageToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken({ value: token })

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
