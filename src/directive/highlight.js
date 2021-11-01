/**
 * @Description: 高亮指令
 * @author Roman
 * @date 2020/7/14
*/
import hljs from 'highlight.js'
// import hljs from 'highlight.js/lib/core'
// import javascript from 'highlight.js/lib/languages/javascript'
// import xml from 'highlight.js/lib/languages/xml'
// import css from 'highlight.js/lib/languages/css'
// import scss from 'highlight.js/lib/languages/scss'
// hljs.registerLanguage('javascript', javascript)
// hljs.registerLanguage('xml', xml)
// hljs.registerLanguage('css', css)
// hljs.registerLanguage('scss', scss)
import 'highlight.js/styles/github.css'

const Highlight = {}

Highlight.install = function(Vue) {
  Vue.directive('highlight', {
    inserted: function(el) {
      const TNODE = el.querySelectorAll('pre code')
      TNODE.forEach((block) => {
        hljs.highlightBlock(block)
      })
    },
    componentUpdated: function(el) {
      const TNODE = el.querySelectorAll('pre code')
      TNODE.forEach((block) => {
        hljs.highlightBlock(block)
      })
    }
  })
}

export default Highlight
