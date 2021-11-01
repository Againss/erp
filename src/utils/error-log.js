/**
 * @Description: 错误捕获功能
 * @author Roman
 * @date 2020/5/28
*/
import Vue from 'vue'
import store from '@/store'
import { isString, isArray } from '@/utils/validate'
import settings from '@/settings'
import request from '@/utils/request'
import { parseTime } from '@/utils'

// you can set in settings.js
// errorLog:'production' | ['production', 'development']
const { errorLog: needErrorLog } = settings

function checkNeed() {
  const env = process.env.NODE_ENV
  if (isString(needErrorLog)) {
    return env === needErrorLog
  }
  if (isArray(needErrorLog)) {
    return needErrorLog.includes(env)
  }
  return false
}

if (checkNeed()) {
  Vue.config.errorHandler = function(err, vm, info, a) {
  // Don't ask me why I use Vue.nextTick, it just a hack.
  // detail see https://forum.vuejs.org/t/dispatch-in-vue-config-errorhandler-has-some-problem/23500
    Vue.nextTick(() => {
      store.dispatch('errorLog/addErrorLog', {
        err,
        vm,
        info,
        url: window.location.href
      })
      const infos = `${decodeURI('erp2.0%E4%B8%9A%E5%8A%A1%E4%BB%A3%E7%A0%81%E9%94%99%E8%AF%AF%E6%8F%90%E9%86%92')}：\n${decodeURI('%E4%BF%A1%E6%81%AF')}：${err.message}\n${decodeURI('%E7%94%A8%E6%88%B7')}：${store.getters.name}/${store.getters.realName}\n${decodeURI('%E6%8F%8F%E8%BF%B0')}：${vm.$vnode.tag} error in ${info}\n${decodeURI('%E5%9C%B0%E5%9D%80')}：${window.location.href}\n${decodeURI('%E5%88%86%E6%94%AF')}：${process.env.envData.branch}\n${decodeURI('%E6%97%B6%E9%97%B4')}：${parseTime(new Date().getTime())}`
      const url = `/errormsg/cgi-bin/webhook/send?key=21fb156b-f2cf-429a-ae58-8ef64f2d3e88`
      const data = {
        'msgtype': 'text',
        'text': {
          'content': infos,
          'mentioned_list': ['@all']
        }
      }

      if (process.env.NODE_ENV === 'production') {
        request({
          method: 'post',
          url,
          data
        })
      }
      console.error(err, infos)
    })
  }
}
