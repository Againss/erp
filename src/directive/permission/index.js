/**
 * @Description: 注册权限指令
 * @author Roman
 * @date 2020/6/18
*/
import permission from './permission'

const install = function(Vue) {
  Vue.directive('permission', permission)
}

if (window.Vue) {
  window['permission'] = permission
  window.Vue.use(install); // eslint-disable-line
}

permission.install = install
export default permission
