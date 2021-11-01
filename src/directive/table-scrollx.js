/**
 * @Description: 表格横向滚动条及全局滚动条样式
 * @author Roman
 * @date 2021-02-23 11:58:36
 * @edit 2021-02-23 11:58:36
 */
import { addListener } from 'resize-detector'
let init
let timer = null
let scrollTimer = null
let scrollBarEle = null
let childEle = null
const tableScrollx = {}
tableScrollx.install = function(Vue) {
  Vue.directive('tableScrollx', {

    inserted: function(el, binding) {
      const params = binding.value
      if (params) {
        init = () => {
          if (!el.offsetParent) {
            return
          }
          fixTabScrollbar(el)
        }

        addListener(document.querySelector('.app-main'), init)
        document.addEventListener('scroll', init)
        el.addEventListener('mouseover', function() {
          if (scrollBarEle) {
            scrollBarEle.style.opacity = 1
          }
        })
        el.addEventListener('mouseleave', function(event) {
          const target = event.relatedTarget
          if (scrollBarEle) {
            if (!target || (target && !/perfectScrollbar/.test(target.id))) {
              scrollBarEle.style.opacity = 0
            }
          }
        })
      }
    },
    componentUpdated: function(el, binding) {
      const params = binding.value
      if (params) {
        fixTabScrollbar(el)
      }
    }
  })
}

function fixTabScrollbar(tabEle, appEle) {
  clearTimeout(timer)
  timer = setTimeout(() => {
    tabEle = tabEle || document.querySelector('.el-table') // table
    appEle = appEle || document.getElementById('app') // 滚动容器
    if (!(tabEle && appEle)) return
    const appendContent = document.querySelector('.app-main').lastChild
    const tabContainer = tabEle.parentNode
    const bodyClientHeight = document.body.clientHeight
    const bodyScrollHeight = document.body.scrollHeight
    const thead = tabEle.querySelector('.el-table__header-wrapper')
    const tbody = tabEle.querySelector('.el-table__body-wrapper')
    const tabHeight = tabEle.offsetHeight
    const fixHeight = tabEle.offsetHeight - 8
    const tbodyWidth = tbody.clientWidth
    const tabWinWidth = thead.clientWidth // table可视宽度
    const tabWidth = thead.getElementsByTagName('table')[0].offsetWidth
    const headerHeight = thead.getElementsByTagName('table')[0].offsetHeight
    const appHeight = appEle.offsetHeight - getOffset(appEle, 'top') // 窗口高度
    const tabOffsetTop = getOffset(tabContainer, 'top')
    const appScrollTop = document.documentElement.scrollTop
    // console.log(tabOffsetTop, tabHeight, appScrollTop, appHeight, headerHeight)
    const bottom = tabOffsetTop + tabHeight - appScrollTop - appHeight + headerHeight
    const fixHeader = tabContainer.querySelectorAll('.el-table__header-wrapper')
    const fixHeaderFix = tabContainer.querySelectorAll('.el-table__fixed-header-wrapper')
    const reSetbodyWrapper = tabContainer.querySelectorAll('.el-table__fixed-body-wrapper')
    const headerTop = document.querySelector('.fixed-header').offsetHeight
    // console.log(appScrollTop, tabOffsetTop, headerTop)
    if (appScrollTop > tabOffsetTop - headerTop) {
      tabContainer.style.paddingTop = headerHeight + 'px'
      fixHeader.forEach(v => {
        v.style.position = 'fixed'
        v.style.top = headerTop + 'px'
        v.style.left = 'auto'
        v.style.zIndex = 7
        v.style.width = tbodyWidth + 'px'
      })

      fixHeaderFix.forEach(v => {
        const parent = v.parentNode
        // console.log(parent)
        if (parent) {
          // console.log(fixHeight)
          v.style.width = v.parentNode.offsetWidth + 'px'
          v.style.overflow = 'hidden'

          v.style.position = 'fixed'
          v.style.top = headerTop + 'px'
          setTimeout(() => { parent.style.height = fixHeight + 'px' }, 50)

          if (parent.classList.contains('el-table__fixed-right')) {
            v.style.right = 'auto'
            const firstChildWidth = parent.offsetWidth - v.firstChild.offsetWidth
            v.firstChild.style.marginLeft = firstChildWidth + 'px'
          } else {
            v.style.left = 'auto'
          }
        }
        v.style.position = 'fixed'
        v.style.top = headerTop + 'px'
        v.style.zIndex = 7
      })

      reSetbodyWrapper.forEach(v => {
        v.style.top = 'auto'
      })
    } else {
      tabContainer.style.paddingTop = 0 + 'px'
      fixHeader.forEach(v => {
        v.style.position = 'relative'
        v.style.top = 'auto'
        v.style.left = 'auto'
        v.style.zIndex = 'auto'
        v.style.width = 'auto'
      })
      fixHeaderFix.forEach(v => {
        const parent = v.parentNode
        // console.log(parent)
        // console.log(fixHeight)
        if (parent) {
          v.style.width = 'auto'
          v.style.top = '0px'
          setTimeout(() => { parent.style.height = fixHeight + 'px' }, 50)
          if (parent.classList.contains('el-table__fixed-right')) {
            v.style.right = 'inherit'
          } else {
            v.style.left = 'inherit'
          }
        }
        v.style.position = 'absolute'
        v.style.zIndex = 'auto'
      })
      reSetbodyWrapper.forEach(v => {
        v.style.top = headerHeight + 'px'
      })
    }
    // console.log(bottom, tabWidth, tabWinWidth, bodyClientHeight, appScrollTop, bodyScrollHeight)
    // console.log(bodyClientHeight, appScrollTop, bodyScrollHeight)
    if (bottom > 0 && tabWidth > tabWinWidth && bodyClientHeight + appScrollTop + 10 < bodyScrollHeight) {
      tabEle.classList.add('hide-scrollBar')
      if (document.getElementById('perfectScrollbar-div') == null) {
        scrollBarEle = document.createElement('div')
        scrollBarEle.id = 'perfectScrollbar-div'
        scrollBarEle.className = 'customScrollbar'
        scrollBarEle.style.opacity = 0
        // scrollBarEle.className = 'customScrollbar'
        childEle = document.createElement('p')
        childEle.id = 'perfectScrollbar-child'
        appendContent.appendChild(scrollBarEle)
        scrollBarEle.appendChild(childEle)
        scrollBarEle.style.display = 'block'
        childEle.style.width = tabWidth + 'px'
        childEle.style.height = '1px'
        childEle.style.padding = '0'
        childEle.style.margin = '0'
        scrollBarEle.style.position = 'fixed'
        scrollBarEle.style.overflowX = 'auto'
        scrollBarEle.style.width = tabWinWidth + 'px'
        scrollBarEle.style.bottom = '0px'
        scrollBarEle.style.left = getOffset(tabEle, 'left') + 'px'
        scrollBarEle.style.minHeight = '8px'
        scrollBarEle.style.zIndex = '999'
      // scrollBarEle.style.margin = 'auto'
      } else {
        scrollBarEle = document.getElementById('perfectScrollbar-div')
      }
      scrollBarEle.style.bottom = '0px'
      scrollBarEle.style.left = getOffset(tabEle, 'left') + 'px'
      scrollBarEle.style.width = tabWinWidth + 'px'
      if (childEle) {
        childEle.style.width = tabWidth + 'px'
      }
      tbody.addEventListener('scroll', function() {
        scrollBarEle.scrollLeft = tbody.scrollLeft
      })
      scrollBarEle.addEventListener('scroll', function(event) {
        clearTimeout(scrollTimer)
        scrollTimer = setTimeout(() => {
          const target = event.target
          const scrollLeft = target.scrollLeft
          tbody.scrollLeft = scrollLeft
        }, 10)
      })
    } else {
      tabEle.classList.remove('hide-scrollBar')
      const scrollBarEle = document.getElementById('perfectScrollbar-div')
      // if (scrollBarEle)scrollBarEle.parentNode.removeChild(scrollBarEle)
      if (scrollBarEle) {
        scrollBarEle.style.bottom = -100 + 'px'
      }
    }
  }, 18)
}

function getOffset(element, type) {
  const postion = type === 'top' ? 'offsetTop' : 'offsetLeft'
  let elPostion = element[postion]
  let parent = element.offsetParent
  while (parent !== null) {
    elPostion += parent[postion]
    parent = parent.offsetParent
  }
  return elPostion
}

export default tableScrollx
