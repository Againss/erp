
<template>
  <div class="guest-need">
    <!-- 搜索表单 -->
    <div class="search islayoutForm">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
      />
    </div>
    <!-- tab页签切换 -->
    <div class="tabchange">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(val,key) in statusList" :key="key" :name="val.value">
          <span slot="label" :tabindex="val.value" class="labelIndex">{{ `${val.label}(${val.count || 0})` }}</span>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :table-scrollx="true"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        highlight-current-row
      />
    </div>
    <!-- 右侧详情弹框 -->
    <div class="pop pop-class-name">
      <cs-custom-pop class="viewPopOptions" :options="viewPopOptions" />
    </div>
  </div>
</template>
<script>
import * as api from './api/index.js'
import logMethods from '@/views/product-center/mixin/log-methods'
import { popOptions } from './common/popOptions.js'
import prpoKey from './common/prpoKey.js'
export default {
  name: 'GuestNeed',
  mixins: [logMethods, popOptions],
  data() {
    // 弹框基本信息内容公共样式
    const contentStyle = {
      'width': '46%',
      // 'border-bottom': '1px #E9EFF2 solid',
      'display': 'inline-block',
      'margin': '0 2%',
      'height': '30px'
    }
    // 有取消原因时更新人的样式
    const updateStyle = {
      'width': '46%',
      'display': 'inline-block',
      'margin': '0 2%',
      'height': '30px',
      'margin-bottom': '160px'
    }
    // 需要取消原因样式
    const cancelStyle = {
      'width': '96%',
      'position': 'fixed',
      'bottom': '58px',
      'background-color': '#fff',
      'height': '160px',
      'border-top': '1px #E9EFF2 solid',
      'left': '60%'
    }
    const requireType = {
      'CUS': '客样分析',
      'MOD': '样板开发',
      'SAL': '销售生产',
      'GREY': '备坯申请',
      'YARN': '备纱申请'
    }
    // 查询数据
    const searchData = [
      {
        prop: 'id',
        itemType: 'input',
        label: '需求单号:'
      },
      {
        prop: 'requireType',
        itemType: 'select',
        label: '需求类型:',
        dataSource: [
          {
            label: '请选择',
            value: ''
          },
          {
            label: '客样分析',
            value: 'CUS'
          },
          {
            label: '样板开发',
            value: 'MOD'
          },
          {
            label: '销售生产',
            value: 'SAL'
          },
          {
            label: '备坯申请',
            value: 'GREY'
          },
          {
            label: '备纱申请',
            value: 'YARN'
          }
        ]
      },
      {
        itemType: 'date',
        type: 'daterange',
        prop: 'dateRange',
        label: '申请日期:',
        itemStyle: { width: '360px' },
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59']
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          if (params.dateRange) {
            params.createdStartTime = params.dateRange[0]
            params.createdEndTime = params.dateRange[1]
          } else {
            params.createdStartTime = null
            params.createdEndTime = null
          }
          this.getList(params)
          this.searchFormDatas = params
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    ]

    // 表格信息
    const columns = [
      {
        prop: 'index',
        label: '序号',
        minWidth: '60',
        showOverflowTooltip: true
      },
      {
        prop: 'id',
        label: '需求单号',
        minWidth: '140',
        showOverflowTooltip: true,
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        },
        handle: params => {
          this.oprateStatus = 3
          this.getDetail({ id: params.row.id }, params.row)
        }
      },
      {
        prop: 'requireType',
        label: '需求类型',
        minWidth: '80',
        formater: (scope) => {
          return scope.row.requireType ? this.requireType[scope.row.requireType] : ''
        }
      },
      {
        prop: 'requireFrom',
        label: '需求来源',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'createdTime',
        label: '申请时间',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.createdTime ? this.$filters.parseTime(scope.row.createdTime + '', '{y}-{m}-{d} {h}:{i}') : ''
        }
      },
      {
        prop: 'createdBy',
        label: '申请人',
        minWidth: '100',
        showOverflowTooltip: true
      },
      {
        prop: 'updatedTime',
        label: '更新时间',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.updatedTime ? this.$filters.parseTime(scope.row.updatedTime + '', '{y}-{m}-{d} {h}:{i}') : ''
        }
      },
      {
        prop: 'updatedBy',
        label: '更新人',
        minWidth: '100',
        showOverflowTooltip: true
      },
      {
        prop: 'status',
        label: '状态',
        width: '100',
        formater: (scope) => {
          // 页签查询状态（0-全部，1-待处理，2-已处理，3-待取消，4-已取消，5-已完结,6-hold单中）
          const obj = {
            0: `<span>全部</span>`,
            1: `<span style="color:#FF9214">待处理</span>`,
            2: `<span style="color:#00BCC5">已处理</span>`,
            3: `<span style="color:#FF9214">待取消</span>`,
            4: `<span style="color:#888E9E">已取消</span>`,
            5: `<span style="color:#00BCC5">已完结</span>`,
            6: `<span style="color:#FF9214">hold单中</span>`
          }
          if (scope.row.isHold) {
            return `<span style="color:#FF9214">hold单中</span>`
          } else {
            return scope.row.status ? obj[scope.row.status] : ''
          }
        }
      }
    ]

    // 分页配置
    const pagination = {
      currentChange: (val) => {
        // 切换页数
        this.getList({
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        // 切换条数
        this.getList({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    // 操作信息
    const popOperates = {
      label: '操作',
      width: '180',
      dataSource: [
        {
          label: '确认处理',
          permitTag: ['customerOrder:customerRequire:handle'],
          isShow: (scope) => {
            return scope.row.status === 1 && !scope.row.isHold
          },
          handle: async params => {
            this.oprateStatus = 2
            this.getDetail({ id: params.row.id }, params.row)
          }
        },
        {
          label: '查看详情',
          permitTag: ['customerOrder:customerRequire:handle'],
          isShow: (scope) => {
            return scope.row.status === 2 || scope.row.status === 4 || scope.row.status === 5
          },
          handle: async params => {
            this.oprateStatus = 3
            this.getDetail({ id: params.row.id }, params.row)
          }
        },
        {
          label: '取消需求',
          permitTag: ['customerOrder:customerRequire:handle'],
          isShow: (scope) => {
            if (scope.row.status === 1 && !scope.row.isHold) {
              return true
            } else if (scope.row.requireType === 'CUS' && scope.row.status === 2) {
              return true
            } else {
              return false
            }
          },
          handle: params => {
            this.oprateStatus = 1
            this.getDetail({ id: params.row.id }, params.row)
          }
        },
        {
          label: '确认取消',
          permitTag: ['customerOrder:customerRequire:handle'],
          isShow: (scope) => {
            return scope.row.status === 3 && !scope.row.isHold
          },
          handle: params => {
            this.oprateStatus = 4
            this.getDetail({ id: params.row.id }, params.row)
          }
        }
      ]
    }
    // 去ERP2.0处理
    const saveAndadd = async(params, form) => {
      let res
      if (params.requireType === 'MOD' || params.requireType === 'SAL') {
        res = await api.confirmDraft({ requirementId: params.customerRequireId })
      } else if (params.requireType === 'GREY') {
        res = await api.confirmDraftGrey({ requirementId: params.customerRequireId })
      } else if (params.requireType === 'YARN') {
        res = await api.confirmDraftYarn({ requirementId: params.customerRequireId })
      }
      // 类型( CUS 客样分析 MOD 样板申请 SAL 销售单 GREY 备坯申请 YARN 备纱申请)
      const obj = {
        'MOD': {
          'detail': `/customer-order/sample-orders/detail/${res.data}/edit`,
          'create': `/customer-order/sample-orders/create?requireId=${params.customerRequireId}`
        },
        'SAL': {
          'detail': `/customer-order/goods-orders/detail/${res.data}/edit`,
          'create': `/customer-order/goods-orders/create?requireId=${params.customerRequireId}`
        },
        'GREY': {
          'detail': `/customer-order/preform-preparation-orders/${res.data}?status=1`,
          'create': `/customer-order/preform-preparation-orders/create?requireId=${params.customerRequireId}`
        },
        'YARN': {
          'detail': `/customer-order/yarn-preparation/detail/${res.data}/edit`,
          'create': `/customer-order/yarn-preparation/create?requireId=${params.customerRequireId}`
        }
      }
      this.$set(this.viewPopOptions, 'visible', !this.viewPopOptions.visible)
      if (res.data) {
        this.$router.push(obj[this.changeInfo].detail)
        return false
      } else {
        this.$router.push(obj[this.changeInfo].create)
        return false
      }
    }
    return {
      saveAndadd,
      prpoKey,
      requireType,
      updateStyle,
      cancelStyle,
      contentStyle,
      popOperates,
      oprateStatus: null,
      activeName: '1',
      totalNum: {},
      formOtions: {
        size: 'small',
        inline: true
      },
      searchData,
      columns,
      dataSource: [],
      pagination,
      popDatalist: {},
      changeInfo: '',
      status: undefined,
      statusList: {
        'all': { value: '0', label: '全部', count: 0 },
        'pending': { value: '1', label: '待处理', count: 0 },
        'handled': { value: '2', label: '已处理', count: 0 },
        'toBeCancelled': { value: '3', label: '待取消', count: 0 },
        'cancelled': { value: '4', label: '已取消', count: 0 },
        'completed': { value: '5', label: '已完结', count: 0 },
        'holdNum': { value: '6', label: 'hold单中', count: 0 }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 弹窗显隐
    viewPopHandle(params) {
      // 显示字段
      const popOptions = this.viewPopOptions.content
      // settlement是否结算(是显示价格条款字段)
      const priceKey = ['_priceTermName', '_payConditionName', '_currency', '_totalAmount']
      for (const key in popOptions) {
        if (this.prpoKey[params.requireType].includes(key)) {
          if (priceKey.includes(key) && params.settlement !== 1 && params.requireType === 'MOD') {
            popOptions[key].isShow = false
          } else {
            popOptions[key].isShow = true
          }
        } else {
          popOptions[key].isShow = false
        }
      }
      if (this.oprateStatus === 2 || this.oprateStatus === 3) {
        this.$set(this.viewPopOptions.content._cancelReason, 'isShow', false)
        this.$set(this.viewPopOptions.content._tableForm, 'itemStyle', { ...this.logTableStyle, 'margin-bottom': '20px' })
      } else {
        this.$set(this.viewPopOptions.content._cancelReason, 'isShow', true)
        this.$set(this.viewPopOptions.content._tableForm, 'itemStyle', { ...this.logTableStyle, 'margin-bottom': '210px' })
        this.$set(this.viewPopOptions.content._cancelReason, 'disabled', this.oprateStatus === 4)
      }
      const oprateNum = {
        1: { 'title': '取消需求', 'cancelText': '取消', 'okText': '提交' },
        2: { 'title': '确认处理', 'cancelText': '取消', 'okText': '确认处理' },
        3: { 'title': '详情', 'cancelText': '关闭', 'okText': '' },
        4: { 'title': '确认取消', 'cancelText': '取消', 'okText': '确认取消' }
      }
      this.$set(this.viewPopOptions, 'okText', oprateNum[this.oprateStatus].okText || '')
      this.$set(this.viewPopOptions, 'visible', !this.viewPopOptions.visible)
      this.$set(this.viewPopOptions, 'cancelText', oprateNum[this.oprateStatus].cancelText)
      this.$set(this.viewPopOptions, 'okHidden', this.oprateStatus === 3)
      this.$set(this.viewPopOptions, 'title', this.requireType[params.requireType] + '需求-' + oprateNum[this.oprateStatus].title || '详情')
      if ((this.oprateStatus === 2 && params.requireType === 'MOD') || (this.oprateStatus === 2 && params.requireType === 'SAL')) {
        this.$set(this.viewPopOptions, 'okText', '去ERP1.0处理')
        this.$set(this.viewPopOptions, 'saveAndadd', this.saveAndadd)
      } else {
        this.$set(this.viewPopOptions, 'saveAndadd', null)
      }
    },
    // 切事tab事件
    handleClick() {
      this.getList()
    },
    // 列表状态数量
    async getStatusNum(data = {}) {
      const res = await api.ListNum({
        ...this.searchFormDatas,
        ...data
      })
      this.totalNum = res.data || {}
      for (const key in this.statusList) {
        this.statusList[key].count = this.totalNum[key] || 0
      }
    },
    // 获取列表
    async getList(data = {}) {
      const obj = { status: this.activeName - 0 }
      const res = await api.pageList({
        ...this.searchFormDatas,
        ...obj,
        ...data
      })
      this.dataSource = (res.data.list && res.data.list.map((item, index) => {
        item.index = ((res.data.pageNum - 1) * res.data.pageSize + index + 1)
        return item
      })) || []
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.getStatusNum({})
    },

    // 获取详情
    async getDetail(data = {}, params) {
      const res = await api.pageDetail({ ...data })
      const datas = res.data || {}
      this.popDatalist = datas
      this.changeInfo = datas.requireType
      // 请求文件地址
      this.fliePathFn(this.$utils.deepClone(datas || {}))
      // 显示弹框
      this.viewPopHandle(datas)
      // 请求日志
      this.getCustomerRequireLog({ orderNo: data.id })
    },
    // 请求文件
    async fliePathFn(datas) {
      let fileIds = []
      if (datas.filePath) {
        fileIds = [...fileIds, ...datas.filePath.split(',')]
      }
      if (datas.orderFilePath) {
        fileIds = [...fileIds, ...datas.orderFilePath.split(',')]
      }
      if (datas.styleFilePath) {
        fileIds = [...fileIds, ...datas.styleFilePath.split(',')]
      }
      if (datas.otherFilePath) {
        fileIds = [...fileIds, ...datas.otherFilePath.split(',')]
      }
      var resData = []
      if (fileIds && fileIds.length) {
        const res = await api.fileListArray({ 'ids': fileIds })
        if (res.code !== 200) { return false }
        resData = res.data && res.data.list || []
        const dataArr = this.$utils.deepClone(this.popDatalist || {})
        // 附件，文件名称
        if (dataArr.filePath) {
          this.popDatalist.filePath = this.getFilePath(dataArr.filePath, resData)
        }
        // 客户订单
        if (dataArr.orderFilePath) {
          this.popDatalist.orderFilePath = this.getFilePath(dataArr.orderFilePath, resData)
        }
        // 成衣款式
        if (dataArr.styleFilePath) {
          this.popDatalist.styleFilePath = this.getFilePath(dataArr.styleFilePath, resData)
        }
        // 其它
        if (dataArr.otherFilePath) {
          this.popDatalist.otherFilePath = this.getFilePath(dataArr.otherFilePath, resData)
        }
      }
      this.$set(this.viewPopOptions, 'formDatas', this.popDatalist)
    },
    // 组装文件数据
    getFilePath(data, resData = []) {
      const list = []
      data = data.split(',')
      for (let i = 0; i < data.length; i++) {
        resData.forEach(e => {
          if (e.id === data[i]) {
            list.push(e)
          }
        })
      }
      return list
    },
    // 关闭查看详情
    viewDetails() {
      this.$set(this.viewPopOptions, 'visible', false)
    },
    // 获取日志
    async getCustomerRequireLog(data = {}, fileIds) {
      const res = await api.customerRequireLog({ ...data })
      this.$set(this.viewPopOptions.content._tableForm, 'dataSource', res.data)
    },
    // 确认处理
    async Confirmation(data = {}) {
      await api.confirmProcess({ ...data }).then(() => {
        this.$set(this.viewPopOptions, 'visible', false)
        const dataun = { ...data }
        this.fetchLog(
          this.getLogMessages('UPDATE', '/customerOrder/customerRequire/handle', 'customerOrder'), { id: data.id }, JSON.stringify({
            beforeText: '在"客户订单-需求列表"确认处理了一条记录 ',
            beforeCode: dataun
          })
        )
        this.getList()
      })
    },
    // 取消需求
    async cancelNeed(data = {}) {
      await api.cancelDemand({ ...data }).then(() => {
        this.$set(this.viewPopOptions, 'visible', false)
        const dataun = { ...data }
        this.fetchLog(
          this.getLogMessages('UPDATE', '/customerOrder/customerRequire/cancel', 'customerOrder'), { id: data.id }, JSON.stringify({
            beforeText: '在"客户订单-需求列表"取消需求了一条记录',
            beforeCode: dataun
          })
        )
        this.getList()
      })
    },
    // 确认取消
    async confirmCancel(data = {}) {
      await api.confirmCancel({ ...data }).then(() => {
        this.$set(this.viewPopOptions, 'visible', false)
        const dataun = { ...data }
        this.fetchLog(
          this.getLogMessages('UPDATE', '/customerOrder/customerRequire/confirmCancel', 'customerOrder'), { id: data.id }, JSON.stringify({
            beforeText: '在"客户订单-需求列表"确认取消一条记录 ',
            beforeCode: dataun
          })
        )
        this.getList()
      })
    },
    moneyFormat(num) {
      if (!num) {
        return ''
      }
      num = num.split('.') // 分隔小数点
      var arr = num[0].split('').reverse() // 转换成字符数组并且倒序排列
      var res = []
      for (var i = 0, len = arr.length; i < len; i++) {
        if (i % 3 === 0 && i !== 0) {
          res.push(',') // 添加分隔符
        }
        res.push(arr[i])
      }
      res.reverse() // 再次倒序成为正确的顺序
      if (num[1]) { // 如果有小数的话添加小数部分
        res = res.join('').concat('.' + num[1])
      } else {
        res = res.join('')
      }
      return res
    }

  }
}
</script>
<style lang='scss' scoped>
.guest-need {
  padding: 20px;
  padding-bottom: 0;
}
</style>
<style lang='scss'>
.guest-need {
  .el-drawer.customDrawerclass .el-drawer__header {
    margin-bottom: 0px;
  }
  .el-drawer__container .el-drawer.customDrawerclass .content{
    height: calc(100% - 133px);
  }
  .el-table_1_column_1 span {
    /* color: #0000ff; */
  }

  .cancelExceed {
    .el-input__inner {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .el-form-item{
    margin-bottom: 0;
  }
  .tabchange {

    background-color: #FFFFFF;
    .el-tabs__header{
      margin: 0;
    }
    .el-tabs__item{
      height: 56px;
      line-height: 56px;
    }
    .el-tabs__nav-wrap{
      padding: 0 20px;
    }
    .el-tabs__nav-wrap::after{
      height: 1px;
    }
    .labelIndex{
      padding: 0 10px;
      border: 0 none;
      outline: none;
    }
  }
  .render-file-name{
    display: flex;
    align-items: center;
    .file-name{
      max-width: 80%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .el-form-item__label,.el-form-item__content{
    height: 30px;
    line-height: 30px;
  }
  .odd-number{
    /* color: #0986FF; */
  }
  .render-content-item{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .pop-class-name{
    color: #474747;
    .el-form-item__content{
      height: auto;
    }
    .el-table__header-wrapper{
      .cell{
        height: 40px;
        line-height: 40px;
      }
    }
    .el-table--medium td{
      padding: 8px 0;
    }
    .el-textarea__inner {
      resize: none;
      height: 100px;
    }
    .el-form-item__label{
      color: #888E9E;
    }
  }
  .footer{
    margin-top: 21px !important;
  }
  .cancelReason{
    width: 100%;
    margin-top: 10px;
  }
}
</style>
