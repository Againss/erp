/**
 * @Description: select  滚动加载更多
 * @author Roman
 * @date 2020/7/14
*/
const loadMore = {}

loadMore.install = function(Vue) {
  Vue.directive('loadmore', {
    bind(el, binding) {
      const dom = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
      dom.addEventListener('scroll', function() {
        const flag = this.scrollHeight - this.scrollTop <= this.clientHeight
        if (flag) {
          binding.value()
        }
      })
    }
  })
}

export default loadMore
