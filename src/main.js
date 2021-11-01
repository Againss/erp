/**
 * @Description: 主入口文件
 * @author Roman
 * @date 2020/5/28
*/
import Vue from 'vue'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import './styles/element-variables.scss'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import plugins from '@/plugins'
import i18n from './lang' // internationalization
Vue.use(plugins)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
