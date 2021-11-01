import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getStorageToken } from '@/utils/auth'
import axios from 'axios'
const baseURL = process.env.VUE_APP_ENV === 'mock' ? `${process.env.VUE_APP_BASE_API}-${process.env.VUE_APP_ENV}` : process.env.VUE_APP_BASE_API
const token = getStorageToken()
/* 确认框 */
export const confirmation = (opts = {}) => {
  MessageBox.confirm(
    opts.message || '确认要删除吗？', '提示',
    {
      confirmButtonText: opts.confirmBtn || '确定',
      cancelButtonText: opts.cancelBtn || '取消',
      type: 'warning',
      center: false,
      customClass: opts.customClass || 'customClass'
    }).then((event) => {
    if (event === 'confirm' && opts.callback) {
      opts.callback(event)
    }
  }).catch((ex) => {
    console.log(ex)
  })
}

export const createAxios = (params = {}) => {
  return axios({
    baseURL: baseURL,
    withCredentials: true,
    timeout: 30000,
    ...params,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
      'spathv': getStorageToken('serveChange') || ''
    }
  })
}

/* 验证 */
export const responseValidate = (res, tip = true) => {
  const statusCode = {
    401: '认证失败,请重新登录',
    402: 'Token非法,请重新授权',
    405: 'Token已失效,请重新授权',
    406: '用户信息不存在,请重新登录',
    407: '已在其他地方登录或已下线,请重新登录'
  }
  if (res.code !== 200) {
    const message = statusCode[res.code]
    if (message) {
      MessageBox.confirm(message, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/reAuth', res.code)
      })
    } else {
      if (tip) {
        Message({
          showClose: true,
          dangerouslyUseHTMLString: true,
          type: 'error',
          message: `<p>${res.message || '数据库错误！'}</p>`
        })
        return false
      }
    }
  }
  return true
}

/* 序号 */
export const getPageIndex = ({ index = 0, pageSize = 20, currentPage = 1 }) => {
  return index + (currentPage - 1) * pageSize + 1
}

/* 操作成功 */
export const handleSuccessfully = (opts) => {
  const { dialog, message, callback, callbackParams } = opts
  if (dialog) {
    Object.assign(dialog, { 'visible': false })
  }
  if (message) {
    Message({
      showClose: true,
      message,
      type: 'success'
    })
  }
  if (callback) {
    return callback(callbackParams)
  }
  /* this.$store.dispatch('app/printingLog', {
logParams,
opratorType: type,
appId: 'SRM',
api,
beforeText: ``
}) */
}
