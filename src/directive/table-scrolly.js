/**
 * @Description: 表格滚动加载数据
 * @author Roman
 * @date 2021-02-23 11:58:36
 * @edit 2021-02-23 11:58:36
 */
import { debounce } from '@/utils'

const tableScrolly = {}
tableScrolly.install = function(Vue) {
  Vue.directive('tableScrolly', {
    bind(el, binding) {
      if (Object.prototype.toString.call(binding.value) === '[object Function]') {
        const selectWrap = el.querySelector('.el-table__body-wrapper')
        let tableScrollyHandle = null
        selectWrap.addEventListener('scroll', function() {
          const bottom = 0
          const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
          if (scrollDistance <= bottom) {
            if (!tableScrollyHandle) {
              tableScrollyHandle = debounce(binding.value, 100)
            }
            tableScrollyHandle()
          }
        })
      }
    }
  })
}

export default tableScrolly
