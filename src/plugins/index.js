/**
 * @Description: 公共插件
 * @author Roman
 * @date 2020/7/13
*/
import request from '@/utils/request'
import { getRules, regExp } from '@/utils/rules'
import * as utils from '@/utils/index'
import * as uiUtils from '@/utils/ui-utils'
import * as pub from '@/utils/public'
import * as filters from '@/filters' // global filters
import checkPermission, { filterPermission } from '@/utils/permission'

import permission from '@/directive/permission/index.js'

import CsCustomTable from '@/components/cs-custom-table'// 公共表格
import CsCustomForm from '@/components/cs-custom-form'// 公共表单
import CsCustomPop from '@/components/cs-custom-pop'// 公共弹框
import CsCustomPopsearch from '@/components/cs-custom-popsearch'// 公共搜索弹窗
import CsCustomPagination from '@/components/cs-custom-pagination'// 公共分页组件
import CsQrcode from '@/components/cs-qrcode'// 公共二维码组件
import CsBarcode from '@/components/cs-barcode'// 公共一维码组件
import CsCharts from '@/components/cs-echarts/charts'// 公共图表组件
import CsPrint from '@/components/cs-print'// 公共打印组件
import CsPrintjs from '@/components/cs-printjs'// 公共打印组件js
import CsFavico from '@/components/cs-favico' // 公共消息提醒图标组件
import CsFullscreen from '@/components/cs-fullscreen' // 公共指定元素全屏组件
import watermark from 'vue-watermark-directive'

import Element from 'element-ui'
import Cookies from 'js-cookie'
import i18n from '../lang'
import VueI18n from 'vue-i18n'
import Highlight from '@/directive/highlight'
import TableScrollx from '@/directive/table-scrollx'
import TableScrolly from '@/directive/table-scrolly'
// import DragResizeDialog from '@/directive/drag-resize-dialog'
import elDragDialog from '@/directive/el-drag-dialog'
import loadMore from '@/directive/loadmore'
import encrypt from '@/mixin/encrypt'

const plugins = {
  install: (Vue, options) => {
    Vue.myGlobalMethod = function() { }

    Vue.directive('my-directive', {
      bind(el, binding, vnode, oldVnode) { }
    })

    // 注册组件
    Vue.component('CsCustomTable', CsCustomTable)
    Vue.component('CsCustomForm', CsCustomForm)
    Vue.component('CsCustomPop', CsCustomPop)
    Vue.component('CsCustomPopsearch', CsCustomPopsearch)
    Vue.component('CsCustomPagination', CsCustomPagination)
    Vue.component('CsQrcode', CsQrcode)
    Vue.component('CsBarcode', CsBarcode)
    Vue.component('CsCharts', CsCharts)
    Vue.component('CsPrint', CsPrint)
    Vue.component('CsPrintjs', CsPrintjs)
    Vue.component('CsFavico', CsFavico)
    Vue.component('CsFullscreen', CsFullscreen)

    // Vue.use(ComSfabric)

    Vue.prototype.$request = request // 公共请求方法
    Vue.prototype.$getRules = getRules// 公共验证方法
    Vue.prototype.$regExp = regExp// 公共正则
    Vue.prototype.$filters = filters// 公共过滤器
    Vue.prototype.$utils = utils// 公共工具箱
    Vue.prototype.$uiUtils = uiUtils// UI公共工具箱
    Vue.prototype.$pub = pub // 系统公用方法
    Vue.prototype.$permission = checkPermission// 公共权限验证法
    Vue.prototype.$filterPermission = filterPermission// 公共权限过滤方法

    Object.keys(filters).forEach(key => {
      Vue.filter(key, filters[key])
    })

    utils.printEnvInfo()// 区分环境

    // 水印配置
    const config = {
      zIndex: 1000,
      font: '16px microsoft yahei',
      color: 'rgba(0,0,0,0.02)',
      content: '',
      rotate: 20,
      width: 150,
      height: 150,
      repeat: true
    }
    Vue.use(watermark, config)

    Vue.use(Element, {
      size: Cookies.get('size') || 'medium', // set element-ui default size
      i18n: (key, value) => i18n.t(key, value)
    })

    Vue.use(permission)
    Vue.use(window['vue-cropper'].default)
    Vue.use(Highlight)
    Vue.use(loadMore)
    Vue.use(TableScrollx)
    Vue.use(TableScrolly)
    // Vue.use(DragResizeDialog)
    Vue.use(elDragDialog)
    Vue.use(VueI18n)
    Vue.mixin(encrypt)

    // register global utility filters
    Vue.config.productionTip = false
    Vue.config.performance = process.env.NODE_ENV === 'development'

    if (process.env.NODE_ENV === 'production' && process.env.VUE_APP_ENV === 'mock') {
      const { mockXHR } = require('../../mock')
      mockXHR()
    }
  }
}
export default plugins
