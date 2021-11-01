/**
 * @Description: 功能权限验证
 * @author Roman
 * @date 2020/5/28
*/
import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const permits = store.getters && store.getters.permits
    const permissionRoles = value

    const hasPermission = permits.some(role => {
      return permissionRoles.includes(role)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`参数有误"`)
    return false
  }
}
export function filterPermission(arr) {
  return arr.filter(v => v.permitTag ? checkPermission(v.permitTag) : true)
}

