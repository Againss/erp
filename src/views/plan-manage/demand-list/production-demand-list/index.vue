<template>
  <div class="production-demand-list">
    <!-- 物料计划搜索 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" />
    </div>
    <!-- <div class="tab-group">
      <el-tabs v-model="produceOrPurchase" class="commonTabs" @tab-click="handleClick">
        <el-tab-pane v-if="$permission(['aps-center:requireList:purchaseRequire:page'])" label="采购" name="purchase" />
        <el-tab-pane v-if="$permission(['aps-center:requireList:produceRequire:page'])" label="生产" name="produce" />
      </el-tabs>
    </div> -->
    <div class="tab-group">
      <el-tabs v-model="activeName" class="commonTabs" @tab-click="statusClick">
        <el-tab-pane label="未下发" name="0" />
        <el-tab-pane label="已下发" name="1" />
      </el-tabs>
      <div class="right-button">
        <!-- 采购下发 -->
        <!-- <el-button v-if="produceOrPurchase === 'purchase' && activeName === '0' && $permission(['aps-center:requireList:purchaseRequire:send'])" class="process-button" size="small" type="primary" @click="down">下发</el-button> -->
        <!-- 生产下发 -->
        <el-button v-if="activeName === '0' && $permission(['aps-center:requireList:produceRequire:send'])" class="process-button" size="small" type="primary" @click="down">下发</el-button>
      </div>
    </div>
    <!-- 列表 -->
    <!-- <div v-if="produceOrPurchase === 'purchase'" class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :table-scrollx="true"
        :row-style="rowStyleDisplay"
        :data-source="dataSource"
        :pagination="pagination"
        @selection-change="handleSelectionChange"
      />
    </div> -->
    <!-- 自定义表单分页列表 -->
    <div>
      <formDetailsDisplay :option="formDetailsOptions" />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop ref="popForm" :options="popOptions" />
    </div>

  </div>
</template>

<script>
import formDetailsDisplay from './components/form-details-display.vue'
import { ProductionDemandList } from './components/index.js'
// import logMethods from '@/views/product-center/mixin/log-methods'
export default {
  components: { formDetailsDisplay },
  mixins: [ProductionDemandList],
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
      '_orderNo': {
        prop: 'orderNo',
        itemType: 'input',
        label: '订单号',
        itemStyle: { width: '25%' },
        placeholder: '请输入订单号'
      },
      '_customerName': {
        prop: 'customerName',
        itemType: 'input',
        label: '客户',
        itemStyle: { width: '25%' },
        placeholder: '请输入客户名称'
      },
      '_yarnName': {
        prop: 'yarnName',
        itemType: 'input',
        label: '纱名',
        itemStyle: { width: '25%' },
        placeholder: '请输入纱名'
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
        placeholder: '请输入纱属性'
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
          // if (this.produceOrPurchase === 'purchase') {
          //   this.purchaseRequirePage({ ...params, deliveryStartTime, deliveryEndTime })
          // } else {
          this.produceRequirePage({ ...params, deliveryStartTime, deliveryEndTime })
          // }
          this.searchFormDatas = { ...params, deliveryStartTime, deliveryEndTime }
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    }

    // 未下发自定义表单头部列表
    const noSendHeaderList = {
      '_orderNo': {
        label: '订单号: ',
        prop: 'orderNo'
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
    const contentHead = {
      '_id': {
        label: '序号',
        prop: 'id',
        width: '60',
        // showOverflowTooltip: true,
        formater: (scope, index) => {
          // console.log(scope, index)
          return scope.row.index + 1
        }
      },
      '_process': {
        label: '任务',
        prop: 'process',
        minWidth: '70',
        // showOverflowTooltip: true,
        formater: (scope, index) => {
          // console.log(scope, index)
          return scope.row.process
        }
      },
      _produceCode: {
        label: '成品编码',
        prop: 'produceCode',
        minWidth: '100',
        showOverflowTooltip: true
      },
      _orderRequireNum: {
        label: '成品重量(KG)',
        prop: 'orderRequireNum',
        minWidth: '120',
        align: 'right',
        showOverflowTooltip: true,
        formater: scope => {
          if (!scope.row.orderRequireNum && scope.row.orderRequireNum !== 0) {
            return '-'
          } else {
            return !isNaN(scope.row.orderRequireNum) ? Number(scope.row.orderRequireNum).toFixed(2) : ''
          }
          // return !isNaN(scope.row.orderRequireNum) ? scope.row.orderRequireNum + 'kg' : '-'
        }
      },
      _needProductNum: {
        label: '需生产重量(KG)',
        prop: 'needProductNum',
        minWidth: '130',
        align: 'right',
        showOverflowTooltip: true,
        formater: scope => {
          if (!scope.row.needProductNum && scope.row.needProductNum !== 0) {
            return '-'
          } else {
            return !isNaN(scope.row.needProductNum) ? Number(scope.row.needProductNum).toFixed(2) : ''
          }
          // return !isNaN(scope.row.needProductNum) ? scope.row.needProductNum + 'kg' : '-'
        }
      },
      _materielCode: {
        label: '原料编码',
        prop: 'materielCode',
        minWidth: '100',
        className: 'cellBorderBottom',
        showOverflowTooltip: true,
        formater: scope => {
          const resultArr = scope.row.surceDetails ? scope.row.surceDetails.map(item => item.materielCode) : []
          let str = `<span>`
          resultArr.forEach((item, index) => {
            // if (index === resultArr.length - 1) {
            //   str += `${item}</span>`
            // } else {
            //   str += `${item}</br>`
            // }
            if (index !== resultArr.length - 1) {
              str += `<div title="${item || '-'}" class="cell-item-style">${item || '-'}</div>`
            } else {
              str += `<div title="${item || '-'}" class="cell-item-style">${item || '-'}</div>` + '</span>'
            }
          })
          return str
        }
      },
      _materielNum: {
        label: '原料重量(KG)',
        prop: 'materielNum',
        minWidth: '120',
        align: 'right',
        className: 'cellBorderBottom',
        showOverflowTooltip: true,
        handle: scope => {
          console.log('scope', scope, event)

          if (event.target.style.cursor) {
            this.popOptions.visible = true
            this.getProduceRequireGray({ sourceId: scope.row.sourceId })
          } else {
            // this.$message.warning('原料来源不是抽纱, 未有抽纱详情')
          }
        },
        // style: {
        //   color: '#1890ff',
        //   cursor: 'pointer'
        // },
        formater: scope => {
          // console.log(scope)
          // const isYarnFlag = scope.row.materielSource === '抽纱'
          const resultArr = scope.row.surceDetails ? scope.row.surceDetails.map(item => {
            return {
              isYarnFlag: item.materielSource === '抽纱',
              // materielNum: !isNaN(item.materielNum) ? item.materielNum + 'kg' : ''
              materielNum: !isNaN(item.materielNum) ? Number(item.materielNum).toFixed(2) : ''
            }
          }) : []
          console.log(resultArr)
          let str = `<span>`
          resultArr.forEach((item, index) => {
            const styleStartStr = item.isYarnFlag ? `<div class="cell-item-style" style="color: #1890ff;cursor: pointer;">` : '<div class="cell-item-style">'
            const styleEndStr = '</div>'
            if (index === resultArr.length - 1) {
              str += `${styleStartStr}${item.materielNum}${styleEndStr}</span>`
            } else {
              str += `${styleStartStr}${item.materielNum}${styleEndStr}`
            }
          })
          return str
        }
      },
      _materielSource: {
        label: '原料来源',
        prop: 'materielSource',
        minWidth: '80',
        className: 'cellBorderBottom',
        showOverflowTooltip: true,
        formater: scope => {
          const resultArr = scope.row.surceDetails ? scope.row.surceDetails.map(item => item.materielSource) : []
          let str = `<span>`
          resultArr.forEach((item, index) => {
            if (index !== resultArr.length - 1) {
              str += `<div title="${item || '-'}" class="cell-item-style">${item || '-'}</div>`
            } else {
              str += `<div title="${item || '-'}" class="cell-item-style">${item || '-'}</div>` + '</span>'
            }
          })
          return str
        }
      },
      _planStartTime: {
        label: '计划开始时间',
        prop: 'planStartTime',
        minWidth: '120',
        formater: scope => {
          return scope.row.planStartTime ? this.$filters.parseTime(scope.row.planStartTime, '{y}-{m}-{d}') : '-'
        }
      },
      _planCloseTime: {
        label: '计划结束时间',
        minWidth: '120',
        prop: 'planCloseTime',
        formater: scope => {
          return scope.row.planCloseTime ? this.$filters.parseTime(scope.row.planCloseTime, '{y}-{m}-{d}') : '-'
        }
      }
    }
    // 已下发自定义表单表头
    // const sendContentHead = {
    //   '_process': {
    //     label: '任务',
    //     prop: 'process',
    //     minWidth: '60',
    //     showOverflowTooltip: true,
    //     formater: (scope, index) => {
    //       // console.log(scope, index)
    //       return scope.row.index + 1 + '、' + scope.row.process
    //     }
    //   },
    //   _produceCode: {
    //     label: '成品编码',
    //     prop: 'produceCode',
    //     minWidth: '100',
    //     showOverflowTooltip: true
    //   },
    //   _orderRequireNum: {
    //     label: '成品重量(KG)',
    //     prop: 'orderRequireNum',
    //     minWidth: '120',
    //     showOverflowTooltip: true
    //   },
    //   _needProductNum: {
    //     label: '需生产重量(KG)',
    //     prop: 'needProductNum',
    //     minWidth: '130',
    //     showOverflowTooltip: true
    //   },
    //   _materielCode: {
    //     label: '原料编码',
    //     prop: 'materielCode',
    //     minWidth: '100',
    //     showOverflowTooltip: true,
    //     formater: scope => {
    //       const resultArr = scope.row.surceDetails ? scope.row.surceDetails.map(item => item.materielCode) : []
    //       let str = `<span>`
    //       resultArr.forEach((item, index) => {
    //         if (index === resultArr.length - 1) {
    //           str += `${item}</span>`
    //         } else {
    //           str += `${item}</br>`
    //         }
    //       })
    //       return str
    //     }
    //   },
    //   _materielNum: {
    //     label: '原料重量(KG)',
    //     prop: 'materielNum',
    //     minWidth: '120',
    //     showOverflowTooltip: true,
    //     handle: scope => {
    //       console.log('scope', scope)
    //     },
    //     style: {
    //       color: '#1890ff',
    //       cursor: 'pointer'
    //     },
    //     formater: scope => {
    //       const resultArr = scope.row.surceDetails ? scope.row.surceDetails.map(item => item.materielNum) : []
    //       let str = `<span>`
    //       resultArr.forEach((item, index) => {
    //         if (index === resultArr.length - 1) {
    //           str += `${item}</span>`
    //         } else {
    //           str += `${item}</br>`
    //         }
    //       })
    //       return str
    //     }
    //   },
    //   _materielSource: {
    //     label: '原料来源',
    //     prop: 'materielSource',
    //     minWidth: '80',
    //     showOverflowTooltip: true,
    //     formater: scope => {
    //       const resultArr = scope.row.surceDetails ? scope.row.surceDetails.map(item => item.materielSource) : []
    //       let str = `<span>`
    //       resultArr.forEach((item, index) => {
    //         if (index === resultArr.length - 1) {
    //           str += `${item}</span>`
    //         } else {
    //           str += `${item}</br>`
    //         }
    //       })
    //       return str
    //     }
    //   },
    //   '_planStartTime': {
    //     label: '计划开始时间',
    //     prop: 'planStartTime',
    //     formater: scope => {
    //       return scope.row.planStartTime ? this.$filters.parseTime(scope.row.planStartTime, '{y}-{m}-{d}') : '-'
    //     }
    //   },
    //   '_planCloseTime': {
    //     label: '计划结束时间',
    //     prop: 'planCloseTime',
    //     formater: scope => {
    //       return scope.row.planCloseTime ? this.$filters.parseTime(scope.row.planCloseTime, '{y}-{m}-{d}') : '-'
    //     }
    //   }
    // }
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
        columns: contentHead
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

    const columnsInfos = {
      '_id': {
        label: '序号',
        prop: 'id',
        width: '60',
        showOverflowTooltip: true,
        formater: (scope, index) => {
          // console.log(scope, index)
          return scope.row.index + 1
        }
      },
      _yarnCode: {
        label: '纱线编码',
        prop: 'yarnCode',
        minWidth: '100',
        showOverflowTooltip: true
      },
      _yarnName: {
        label: '纱名',
        prop: 'yarnName',
        minWidth: '80',
        showOverflowTooltip: true
      },
      _yarnAttr: {
        label: '纱属性',
        prop: 'yarnAttr',
        minWidth: '80',
        showOverflowTooltip: true
      },
      _yarnBrand: {
        label: '纱牌/纱批',
        prop: 'yarnBrand',
        minWidth: '100',
        showOverflowTooltip: true
      },
      _yarnOrderNo: {
        label: '备纱单号',
        prop: 'yarnOrderNo',
        minWidth: '100',
        showOverflowTooltip: true
      },
      _storeNum: {
        label: '可用库存(KG)',
        prop: 'storeNum',
        minWidth: '120',
        align: 'right',
        showOverflowTooltip: true,
        // handle: scope => {
        //   console.log('scope', scope)
        // },
        formater: scope => {
          return !isNaN(scope.row.storeNum) ? (+scope.row.storeNum).toFixed(2) : '-'
        }
        // style: {
        //   color: '#1890ff',
        //   cursor: 'pointer'
        // }
      },
      _storehouse: {
        label: '仓库',
        prop: 'storehouse',
        minWidth: '70',
        showOverflowTooltip: true
      },
      _supplier: {
        label: '供应商',
        prop: 'supplier',
        minWidth: '80',
        showOverflowTooltip: true
      },
      _yarnReport: {
        label: '纱线物测',
        prop: 'yarnReport',
        minWidth: '90',
        showOverflowTooltip: true
      },
      _tryOutReport: {
        label: '试纱',
        prop: 'tryOutReport',
        minWidth: '90',
        showOverflowTooltip: true
      },
      _salesTeamName: {
        label: '销售团队',
        prop: 'salesTeamName',
        minWidth: '80',
        showOverflowTooltip: true
      },
      _lockNum: {
        label: '本次抽用重量(KG)',
        prop: 'lockNum',
        minWidth: '140',
        align: 'right',
        showOverflowTooltip: true,
        style: { 'color': '#FE4949' },
        formater: scope => {
          return !isNaN(scope.row.lockNum) ? (+scope.row.lockNum).toFixed(2) : '-'
        }
      }
    }
    // 弹出框配置
    const popOptions = {
      itemType: 'dialog',
      visible: false,
      title: '抽纱详情',
      customClass: 'popOptionsClass',
      width: '1200px',
      size: '40%',
      ok: params => {
        console.log(params)
      },
      okHidden: true,
      cancelText: '我知道了',
      // okText: '保存',
      cancel: params => {
        this.popOptions.visible = false
      },
      formDatas: {},
      formOptions: {
        size: 'small',
        popError: true
      },
      content: {
        _tableForm: {
          prop: '_tableForm',
          headerCellStyle: { 'background-color': '#F5F7FA' },
          className: 'pop-table',
          itemType: 'table-form',
          label: '',
          labelWidth: '0',
          dataSource: [],
          columns: columnsInfos,
          tooltipEffect: 'dark'
        }
      }
    }
    return {
      searchData,
      formOtions: { inline: true, size: 'small', layout: true },

      searchFormDatas: {},

      // produceOrPurchase: this.$permission(['aps-center:requireList:purchaseRequire:page']) ? 'purchase' : 'produce',
      activeName: '0',

      formDetailsOptions,
      noSendHeaderList,
      sendHeaderList,
      // noSendContentHead,
      // sendContentHead,
      customFormData,
      formDetailsPagination,

      purchaseRequireIds: [],
      rowStyleIds: [],
      // produceRequireIds: []

      popOptions
    }
  },
  created() {
    this.produceRequirePage()
    // this.$permission(['aps-center:requireList:purchaseRequire:page']) ? this.purchaseRequirePage({}) : this.produceRequirePage({})
  },
  methods: {
    // 采购/生产切换
    // handleClick() {
    //   this.activeName = '0'
    //   // this.$refs.searchForm.form.resetFields()
    //   // this.searchFormDatas = {}
    //   this.statusClick()
    // },
    // 未下发/已下发切换
    statusClick() {
      const flag = this.activeName === '0'
      this.$set(this.formDetailsOptions, 'checkShow', flag)
      this.$set(this.formDetailsOptions, 'headerList', flag ? this.noSendHeaderList : this.sendHeaderList)
      // this.$set(this.customFormData._table, 'columns', flag ? this.noSendContentHead : this.sendContentHead)
      this.produceRequirePage()
      // if (this.activeName === '0') {
      //   if (this.produceOrPurchase === 'purchase') {
      //     this.columns = this.noSentColumns
      //     this.purchaseRequirePage()
      //   } else {
      //     // console.log('生产的未下发')
      //     this.$set(this.formDetailsOptions, 'checkShow', true)
      //     this.$set(this.formDetailsOptions, 'headerList', this.noSendHeaderList)
      //     this.$set(this.customFormData._table, 'columns', this.noSendContentHead)
      //     this.produceRequirePage()
      //   }
      // } else {
      //   if (this.produceOrPurchase === 'purchase') {
      //     this.columns = this.sentColumns
      //     this.purchaseRequirePage()
      //   } else {
      //     // console.log('生产的已下发')
      //     this.$set(this.formDetailsOptions, 'checkShow', false)
      //     this.$set(this.formDetailsOptions, 'headerList', this.sendHeaderList)
      //     this.$set(this.customFormData._table, 'columns', this.sendContentHead)
      //     this.produceRequirePage()
      //   }
      // }
    },

    // 下发
    down() {
      // if (this.produceOrPurchase === 'purchase') {
      //   if (this.purchaseRequireIds.length) {
      //     this.purchaseRequireSend({ purchaseRequireIds: this.purchaseRequireIds })
      //   } else {
      //     this.$message.warning('请选择记录')
      //   }
      // } else {
      const produceData = this.formDetailsOptions.dataSource
      const produceRequireIds = produceData.filter(item => item.checked).map(item => item.id)
      if (produceRequireIds.length) {
        debugger
        this.produceRequireSend({ produceRequireIds: produceRequireIds })
      } else {
        this.$message.warning('请选择记录')
      }
      // }
    },

    // handleSelectionChange(val) {
    //   console.log(val)
    //   if (val && val.length) {
    //     this.purchaseRequireIds = val.map(item => item.id)
    //   } else {
    //     this.purchaseRequireIds = []
    //   }
    // },

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
      padding: 20px 0 0;

      .el-tabs__nav-scroll {
        padding: 0 20px;
      }
      .el-tabs__item {
        line-height: 20px;
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
        top: 14px;
      }
    }

    .cell-item-style {
      // height: 49px;
      padding: 0px 10px;
      &:not(:last-child) {
        border-bottom: 1px solid #dfe6ec;
      }

      // line-height: 49px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    td.cellBorderBottom {
      .cell {
        width: 100%!important;
        padding: 0;
      }
    }
  }
</style>
