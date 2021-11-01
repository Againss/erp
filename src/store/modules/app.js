/**
 * @Description: 应用配置
 * @author Roman
 * @date 2020/6/18
 */
import Cookies from 'js-cookie'
import { log } from '@/api/app'
import Wss from 'wss'
const wsConfig = {
  url: process.env.VUE_APP_WSURL,
  debug: false,
  reconnectInterval: 3000
}

const baseURL = process.env.VUE_APP_ENV === 'mock' ? `${process.env.VUE_APP_BASE_API}/${process.env.VUE_APP_ENV}` : process.env.VUE_APP_BASE_API
const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  baseURL,
  ows: {},
  favicoNum: 0,
  logging: false,
  javaServiceConfig: [],
  size: Cookies.get('size') || 'medium'
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_JAVASERVICECONFIG: (state, javaServiceConfig) => {
    state.javaServiceConfig = javaServiceConfig
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_FAVICONUM: (state, msg) => {
    state.favicoNum = state.favicoNum + 1
  },
  SET_LOG: (state, status) => {
    state.logging = status
  },
  SET_OWS: (state, ows) => {
    state.ows = ows
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  setows({ commit, state }, res) {
    const { wst, uuid } = res
    const { url, debug, reconnectInterval } = wsConfig
    const params = `&connectId=${uuid}&token=${wst}`
    const newUrl = url + params
    if (process.env.VUE_APP_ENV !== 'back') {
      const ows = new Wss(newUrl, null, { debug: debug, reconnectInterval })
      commit('SET_OWS', ows)
      ows.onopen = function() {
        console.log('发送中...')
      }
      ows.onclose = function() {
        console.log('连接已关闭...')
      }
    }
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  fetchLog({ commit }, data) {
    commit('SET_LOG', true)
    return new Promise((resolve, reject) => {
      log(data).then(response => {
        commit('SET_LOG', false)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  fetchParamsLog({ dispatch, rootState }, options = {}) {
    const userInfo = rootState.user.userInfo
    const baseUrl = rootState.app.baseURL
    const topic = rootState.user.topic
    const des = options.description || {}
    const description = JSON.stringify({ beforeText: des.beforeText || '', beforeCode: des.beforeCode || '', afterText: des.afterText || '', afterCode: des.afterText || '' })
    const messages = {
      type: 'OP',
      appId: options.appId,
      handleResult: 'SUCCESS',
      userId: userInfo.userId,
      realName: userInfo.realName,
      userName: userInfo.name,
      topic,
      description: '',
      createdTime: new Date().getTime(),
      opratorType: options.opratorType,
      api: baseUrl + options.api
    }
    dispatch('fetchLog', { ...messages, params: JSON.stringify(options.params), description })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
