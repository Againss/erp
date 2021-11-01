<template>
  <div class="purchase-demand-list">
    <!-- 采购需求列表搜索 -->
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
        <el-button v-if="activeName === '0' && $permission(['aps-center:requireList:purchaseRequire:send'])" class="process-button" size="small" type="primary" @click="down">下发</el-button>
        <!-- 生产下发 -->
        <!-- <el-button v-if="produceOrPurchase === 'produce' && activeName === '0' && $permission(['aps-center:requireList:produceRequire:send'])" class="process-button" size="small" type="primary" @click="down">下发</el-button> -->
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
    <!-- <div v-if="produceOrPurchase === 'produce'">
      <formDetailsDisplay :option="formDetailsOptions" />
    </div> -->

  </div>
</template>

<script>
// import formDetailsDisplay from './components/form-details-display.vue'
import { PurchaseDemandList } from './components/index.js'
// import logMethods from '@/views/product-center/mixin/log-methods'
export default {
  // components: { formDetailsDisplay },
  mixins: [PurchaseDemandList],
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
      // '_orderTime': {
      //   itemType: 'date',
      //   type: 'daterange',
      //   prop: 'orderTime',
      //   label: '下单日期',
      //   itemStyle: { width: '25%' },
      //   pickerOptions: pickerOptions,
      //   startPlaceholder: '开始日期',
      //   endPlaceholder: '结束日期',
      //   format: 'yyyy-MM-dd',
      //   valueFormat: 'timestamp',
      //   defaultTime: ['00:00:00', '23:59:59']
      // },
      '_deliveryDate': {
        itemType: 'date',
        type: 'daterange',
        prop: 'deliveryDate',
        label: '订单交期',
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
          // let orderTimeStartTime = ''
          // let orderTimeEndTime = ''
          // if (params.orderTime && params.orderTime.length === 2) {
          //   orderTimeStartTime = params.orderTime[0]
          //   orderTimeEndTime = params.orderTime[1]
          // }
          // if (this.produceOrPurchase === 'purchase') {
          this.purchaseRequirePage({ ...params, deliveryStartTime, deliveryEndTime })
          // } else {
          //   this.produceRequirePage({ ...params, deliveryStartTime, deliveryEndTime })
          // }
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
      '_orderNo': {
        prop: 'orderNo',
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
        minWidth: '110',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.delivery ? this.$filters.parseTime(scope.row.delivery, '{y}-{m}-{d}') : '-'
        }
      },
      '_purchaseNum': {
        prop: 'purchaseNum',
        label: '采购数量(KG)',
        minWidth: '120',
        align: 'right',
        showOverflowTooltip: true,
        formater: scope => {
          const purchaseNumArr = scope.row.purchaseNum ? (+scope.row.purchaseNum).toFixed(2) : ''
          // let str = '<span>'
          // purchaseNumArr.forEach((item, index) => {
          //   if (index !== purchaseNumArr.length) {
          //     str += (item ? this.$utils.getFloat(item) : 2) + 'kg' + '</br>'
          //   } else {
          //     str += (item ? this.$utils.getFloat(item) : 2) + 'kg' + '</span>'
          //   }
          // })
          return purchaseNumArr
        }
      },
      '_purchaseDelivery': {
        prop: 'purchaseDelivery',
        label: '采购交期',
        minWidth: '110',
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

      purchaseRequireIds: [],
      rowStyleIds: []
      // produceRequireIds: []
    }
  },
  created() {
    this.purchaseRequirePage()
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
      this.columns = flag ? this.noSentColumns : this.sentColumns
      this.purchaseRequirePage()
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
      if (this.purchaseRequireIds.length) {
        this.purchaseRequireSend({ purchaseRequireIds: this.purchaseRequireIds })
      } else {
        this.$message.warning('请选择记录')
      }
      // } else {
      //   const produceData = this.formDetailsOptions.dataSource
      //   const produceRequireIds = produceData.filter(item => item.checked).map(item => item.id)
      //   if (produceRequireIds.length) {
      //     this.produceRequireSend({ produceRequireIds: produceRequireIds })
      //   } else {
      //     this.$message.warning('请选择记录')
      //   }
      // }
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
  .purchase-demand-list {
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
  }
</style>
