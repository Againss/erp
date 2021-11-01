<template>
  <div class="production-demand-list">
    <!-- 物料计划搜索 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" />
    </div>
    <div class="tab-group">
      <el-tabs v-model="produceOrPurchase" class="commonTabs" @tab-click="handleClick">
        <el-tab-pane v-if="$permission(['aps-center:requireList:purchaseRequire:page'])" label="采购" name="purchase" />
        <el-tab-pane v-if="$permission(['aps-center:requireList:produceRequire:page'])" label="生产" name="produce" />
      </el-tabs>
    </div>
    <div class="tab-group">
      <el-tabs v-model="activeName" class="commonTabs secondTabs" @tab-click="statusClick">
        <el-tab-pane label="未下发" name="0" />
        <el-tab-pane label="已下发" name="1" />
      </el-tabs>
      <div class="right-button">
        <!-- 采购下发 -->
        <el-button v-if="produceOrPurchase === 'purchase' && activeName === '0' && $permission(['aps-center:requireList:purchaseRequire:send'])" class="process-button" size="small" type="primary" @click="down">下发</el-button>
        <!-- 生产下发 -->
        <el-button v-if="produceOrPurchase === 'produce' && activeName === '0' && $permission(['aps-center:requireList:produceRequire:send'])" class="process-button" size="small" type="primary" @click="down">下发</el-button>
      </div>
    </div>
    <!-- 列表 -->
    <div v-if="produceOrPurchase === 'purchase'" class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :table-scrollx="true"
        :row-style="rowStyleDisplay"
        :data-source="dataSource"
        :pagination="pagination"
        @selection-change="handleSelectionChange"
      />
    </div>
    <!-- 自定义表单分页列表 -->
    <div v-if="produceOrPurchase === 'produce'">
      <formDetailsDisplay :option="formDetailsOptions" />
    </div>

  </div>
</template>

<script>
import formDetailsDisplay from './components/form-details-display.vue'
import { productionDemandList } from './components/index.js'
import logMethods from './components/log-methods'
export default {
  components: { formDetailsDisplay },
  mixins: [productionDemandList, logMethods],
  data() {
    const pickerOptions = {
      shortcuts: [
        {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }
      ]
      // disabledDate(time) {
      //   return time.getTime() > new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59).getTime() || time.getTime() < Date.now() - 3600 * 1000 * 24 * 91
      // }
    }

    // 搜索配置信息
    const searchData = {
      '_orderId': {
        prop: 'orderId',
        itemType: 'input',
        label: '订单号',
        itemStyle: { width: '25%' },
        placeholder: '请输入'
      },
      '_customerName': {
        prop: 'customerName',
        itemType: 'input',
        label: '客户',
        itemStyle: { width: '25%' },
        placeholder: '请输入'
      },
      '_yarnName': {
        prop: 'yarnName',
        itemType: 'input',
        label: '纱名',
        itemStyle: { width: '25%' },
        placeholder: '请输入'
      },
      '_deliveryDate': {
        itemType: 'date',
        type: 'daterange',
        prop: 'deliveryDate',
        label: '交期',
        // style: { width: '300px' },
        itemStyle: { width: '25%' },
        pickerOptions: pickerOptions,
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59']
        // change: timeChange
      },
      '_yarnAttr': {
        prop: 'yarnAttr',
        itemType: 'input',
        itemStyle: { width: '25%' },
        label: '纱属性',
        placeholder: '请输入'
      },
      '_operate': {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          console.log('查询', params)
          let deliveryStartTime = ''
          let deliveryEndTime = ''
          if (params.deliveryDate && params.deliveryDate.length === 2) {
            deliveryStartTime = params.deliveryDate[0]
            deliveryEndTime = params.deliveryDate[1]
          }
          if (this.produceOrPurchase === 'purchase') {
            this.purchaseRequirePage({ ...params, deliveryStartTime, deliveryEndTime })
          } else {
            this.produceRequirePage({ ...params, deliveryStartTime, deliveryEndTime })
          }
          this.searchFormDatas = { ...params, deliveryStartTime, deliveryEndTime }
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    }

    const purchaseCommonColums = {
      '_id': {
        prop: 'id',
        label: '序号',
        width: '60',
        formater: (scope) => {
          return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
        }
      },
      '_orderId': {
        prop: 'orderId',
        label: '订单号',
        width: '156',
        showOverflowTooltip: true
      },
      '_clothType': {
        prop: 'clothType',
        label: '布类',
        minWidth: '60',
        showOverflowTooltip: true
      },
      '_yarnName': {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => {
          const yarnNameArr = scope.row.yarnName ? scope.row.yarnName.split(',') : []
          let str = '<span>'
          yarnNameArr.forEach((item, index) => {
            if (index !== yarnNameArr.length) {
              str += item + '</br>'
            } else {
              str += item + '</span>'
            }
          })
          return str
        }
      },
      '_yarnAttr': {
        prop: 'yarnAttr',
        label: '纱属性',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => {
          const yarnAttrArr = scope.row.yarnAttr ? scope.row.yarnAttr.split(',') : []
          let str = '<span>'
          yarnAttrArr.forEach((item, index) => {
            if (index !== yarnAttrArr.length) {
              str += item + '</br>'
            } else {
              str += item + '</span>'
            }
          })
          return str
        }
      },
      '_yarnCode': {
        prop: 'yarnCode',
        label: '纱线编码',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          const yarnCodeArr = scope.row.yarnCode ? scope.row.yarnCode.split(',') : []
          let str = '<span>'
          yarnCodeArr.forEach((item, index) => {
            if (index !== yarnCodeArr.length) {
              str += item + '</br>'
            } else {
              str += item + '</span>'
            }
          })
          return str
        }
      },
      '_customerName': {
        prop: 'customerName',
        label: '客户',
        minWidth: '60',
        showOverflowTooltip: true
      },
      '_customerColor': {
        prop: 'customerColor',
        label: '客户颜色',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_salesTeamName': {
        prop: 'salesTeamName',
        label: '销售团队',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_delivery': {
        prop: 'delivery',
        label: '交期',
        minWidth: '70',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.delivery ? this.$filters.parseTime(scope.row.delivery, '{y}-{m}-{d}') : '-'
        }
      },
      '_purchaseNum': {
        prop: 'purchaseNum',
        label: '采购数量(kg)',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => {
          const purchaseNumArr = scope.row.purchaseNum ? scope.row.purchaseNum.split(',') : []
          let str = '<span>'
          purchaseNumArr.forEach((item, index) => {
            if (index !== purchaseNumArr.length) {
              str += (item ? this.$utils.getFloat(item) : 0) + 'kg' + '</br>'
            } else {
              str += (item ? this.$utils.getFloat(item) : 0) + 'kg' + '</span>'
            }
          })
          return str
        }
      },
      '_purchaseDelivery': {
        prop: 'purchaseDelivery',
        label: '采购交期',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.purchaseDelivery ? this.$filters.parseTime(scope.row.purchaseDelivery, '{y}-{m}-{d}') : '-'
        }
      }

    }
    // 已下发
    const sentColumns = {
      ...purchaseCommonColums,
      '_sendTime': {
        prop: 'sendTime',
        width: '100',
        label: '下发日期',
        formater: scope => {
          return scope.row.sendTime ? this.$filters.parseTime(scope.row.sendTime, '{y}-{m}-{d}') : '-'
        }
      }
    }
    // 未下发
    const noSentColumns = {
      '_select': {
        prop: 'select',
        type: 'selection',
        width: '50'
      },
      ...purchaseCommonColums
    }
    const pagination = {
      currentChange: val => {
        console.log('current', val)
        this.purchaseRequirePage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        console.log('size', val)
        this.$set(this.pagination, 'currentPage', 1)
        this.purchaseRequirePage({ pageNum: 1, pageSize: val })
      }
    }

    // 未下发自定义表单头部列表
    const noSendHeaderList = {
      '_orderId': {
        label: '订单号: ',
        prop: 'orderId'
        // formater: scope => {
        //   console.log(scope)
        // }
      },
      '_productCode': {
        label: '产品编码: ',
        prop: 'productCode'
      },
      '_clothType': {
        label: '布类: ',
        prop: 'clothType'
      },
      '_delivery': {
        label: '交期: ',
        prop: 'delivery',
        formater: scope => {
          return scope.delivery ? this.$filters.parseTime(scope.delivery, '{y}-{m}-{d}') : '-'
        }
      },
      '_customerName': {
        label: '客户: ',
        prop: 'customerName'
      },
      '_customerColor': {
        label: '客户颜色: ',
        prop: 'customerColor'
      },
      '_salesTeamName': {
        label: '销售团队: ',
        prop: 'salesTeamName'
      },
      '_yarnName': {
        label: '纱名: ',
        prop: 'yarnName'
      },
      '_yarnAttr': {
        label: '纱属性: ',
        prop: 'yarnAttr'
      }
      // '_produceProcess': {
      //   label: '生产流程: ',
      //   prop: 'produceProcess'
      // },
      // '_salesTeamName': {
      //   label: '销售团队: ',
      //   prop: 'salesTeamName'
      // },
      // '_completedNum': {
      //   label: '数量: ',
      //   prop: 'completedNum'
      // }
    }
    // 已下发自定义表单头部列表
    const sendHeaderList = {
      ...noSendHeaderList,
      '_sendTime': {
        label: '下发日期: ',
        prop: 'sendTime',
        formater: scope => {
          return scope.sendTime ? this.$filters.parseTime(scope.sendTime, '{y}-{m}-{d}') : '-'
        }
      }
    }
    // 未下发自定义表单表头
    const noSendContentHead = {
      '_process': {
        label: '工序',
        prop: 'process',
        formater: (scope, index) => {
          // console.log(scope, index)
          return scope.row.index + 1 + '、' + scope.row.process
        }
      },
      '_code': {
        label: '编码',
        prop: 'code'
      },
      '_needProductNum': {
        label: '排产数量kg',
        prop: 'needProductNum',
        formater: (scope) => {
          return scope.row.needProductNum ? this.$utils.getFloat(scope.row.needProductNum) + 'kg' : ''
        }
      },
      '_planStartTime': {
        label: '计划开始时间',
        prop: 'planStartTime',
        formater: scope => {
          return scope.row.planStartTime ? this.$filters.parseTime(scope.row.planStartTime, '{y}-{m}-{d}') : '-'
        }
      },
      '_planCloseTime': {
        label: '计划结束时间',
        prop: 'planCloseTime',
        formater: scope => {
          return scope.row.planCloseTime ? this.$filters.parseTime(scope.row.planCloseTime, '{y}-{m}-{d}') : '-'
        }
      }
    }
    // 已下发自定义表单表头
    const sendContentHead = {
      '_process': {
        label: '工序',
        prop: 'process',
        formater: (scope, index) => {
          // console.log(scope, index)
          return scope.row.index + 1 + '、' + scope.row.process
        }
      },
      '_needProductNum': {
        label: '排产数量kg',
        prop: 'needProductNum',
        formater: (scope) => {
          return scope.row.needProductNum ? this.$utils.getFloat(scope.row.needProductNum) + 'kg' : ''
        }
      },
      '_planStartTime': {
        label: '计划开始时间',
        prop: 'planStartTime',
        formater: scope => {
          return scope.row.planStartTime ? this.$filters.parseTime(scope.row.planStartTime, '{y}-{m}-{d}') : '-'
        }
      },
      '_planCloseTime': {
        label: '计划结束时间',
        prop: 'planCloseTime',
        formater: scope => {
          return scope.row.planCloseTime ? this.$filters.parseTime(scope.row.planCloseTime, '{y}-{m}-{d}') : '-'
        }
      }
    }
    // 所有数据内容
    const formDetailsDataSource = []
    // 分页配置信息
    const formDetailsPagination = {
      // currentPage: 1,
      // pageSize: 20,
      pageSizes: [5],
      dataTotal: formDetailsDataSource.length,
      currentChange: val => {
        console.log('currentChange', val, this.formDetailsPagination)
        this.produceRequirePage({ pageSize: this.formDetailsPagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        console.log('sizeChange', val, this.formDetailsPagination)
        this.$set(this.formDetailsPagination, 'currentPage', 1)
        this.produceRequirePage({ pageNum: 1, pageSize: val })
      }
    }
    // const tableFormColumns = {}
    // 定义基础组件表单内容
    const customFormData = {
      '_table': {
        prop: 'tableForm',
        itemType: 'table-form',
        className: 'pop-table',
        headerCellStyle: { 'background-color': '#F5F7FA', height: '44px' },
        // cellMouseEnter: (row, column, cell, event) => {
        //   console.log(row, column, cell, event)
        // },
        // label: '表格表单',
        dataSource: [],
        columns: noSendContentHead
      }
    }
    // 自定义表单分页列表配置项
    const formDetailsOptions = {
      headerList: noSendHeaderList, // 头部list
      checkShow: true, // 是否显示多选框
      checkboxButtonClick: value => {
        console.log(value)
      },
      rightButtonShow: false, // 右边button是否显示
      rightButtonText: '确认数量', // 右边button文字内容
      rightButtonClick: (scope, index) => {
        console.log(scope, index)
      },
      customFormData: customFormData, // 表单内容
      // contentHead: noSendContentHead, // 内容表头
      dataSource: formDetailsDataSource, // 内容
      pagination: formDetailsPagination // 分页内容
    }
    return {
      searchData,
      formOtions: { inline: true, size: 'small', layout: true },

      searchFormDatas: {},

      produceOrPurchase: this.$permission(['aps-center:requireList:purchaseRequire:page']) ? 'purchase' : 'produce',
      activeName: '0',

      sentColumns,
      noSentColumns,
      columns: noSentColumns,
      dataSource: [],
      pagination,

      formDetailsOptions,
      noSendHeaderList,
      sendHeaderList,
      noSendContentHead,
      sendContentHead,
      customFormData,
      formDetailsPagination,

      purchaseRequireIds: [],
      rowStyleIds: []
      // produceRequireIds: []
    }
  },
  created() {
    this.$permission(['aps-center:requireList:purchaseRequire:page']) ? this.purchaseRequirePage({}) : this.produceRequirePage({})
  },
  methods: {
    // 采购/生产切换
    handleClick() {
      this.activeName = '0'
      // this.$refs.searchForm.form.resetFields()
      // this.searchFormDatas = {}
      this.statusClick()
    },
    // 未下发/已下发切换
    statusClick() {
      if (this.activeName === '0') {
        if (this.produceOrPurchase === 'purchase') {
          this.columns = this.noSentColumns
          this.purchaseRequirePage({})
        } else {
          // console.log('生产的未下发')
          this.$set(this.formDetailsOptions, 'checkShow', true)
          this.$set(this.formDetailsOptions, 'headerList', this.noSendHeaderList)
          this.$set(this.customFormData._table, 'columns', this.noSendContentHead)
          this.produceRequirePage({})
        }
      } else {
        if (this.produceOrPurchase === 'purchase') {
          this.columns = this.sentColumns
          this.purchaseRequirePage({})
        } else {
          // console.log('生产的已下发')
          this.$set(this.formDetailsOptions, 'checkShow', false)
          this.$set(this.formDetailsOptions, 'headerList', this.sendHeaderList)
          this.$set(this.customFormData._table, 'columns', this.sendContentHead)
          this.produceRequirePage({})
        }
      }
    },

    // 下发
    down() {
      if (this.produceOrPurchase === 'purchase') {
        if (this.purchaseRequireIds.length) {
          this.purchaseRequireSend({ purchaseRequireIds: this.purchaseRequireIds })
        } else {
          this.$message.warning('请选择记录')
        }
      } else {
        const produceData = this.formDetailsOptions.dataSource
        const produceRequireIds = produceData.filter(item => item.checked).map(item => item.id)
        if (produceRequireIds.length) {
          this.produceRequireSend({ produceRequireIds: produceRequireIds })
        } else {
          this.$message.warning('请选择记录')
        }
      }
    },

    handleSelectionChange(val) {
      console.log(val)
      if (val && val.length) {
        this.purchaseRequireIds = val.map(item => item.id)
      } else {
        this.purchaseRequireIds = []
      }
    },

    // 行未下发成功红色样式显示
    rowStyleDisplay({ row, rowIndex }) {
      if (this.rowStyleIds.includes(row.id)) {
        return {
          'color': 'red'
          // 'background-color': 'red'
        }
      }
    }
  }
}
</script>

<style lang='scss'>
  .production-demand-list {
    padding: 20px;

    .commonTabs {
      background-color: #fff;
      padding: 5px 0 0;

      .el-tabs__nav-scroll {
        padding: 0 20px;
      }
      .el-tabs__item {
        line-height: 36px;
        font-size: 14px;
      }
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
      .el-tabs__header {
        margin-bottom: 0;
      }
    }

    .secondTabs {
      .el-tabs__nav-scroll {
        padding: 0 20px 0 40px;
      }
    }

    .tab-group {
      position: relative;
      padding-bottom: 1px;
      .right-button {
        position: absolute;
        right: 20px;
        top: 6px;
      }
    }
  }
</style>
