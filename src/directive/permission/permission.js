/**
 * @Description: 权限指令配置
 * @author Roman
 * @date 2020/6/18
*/
import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const permits = store.getters && store.getters.permits

    if (value && value instanceof Array && value.length > 0) {
      const hasPermission = permits.some(role => {
        return value.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  }
}
