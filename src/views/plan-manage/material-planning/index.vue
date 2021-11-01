<template>
  <div class="material-planning">
    <!-- 物料计划搜索 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" />
    </div>
    <div class="tab-group">
      <el-tabs v-model="activeName" class="commonTabs" @tab-click="handleClick">
        <el-tab-pane label="待划扣" name="0" />
        <el-tab-pane label="已划扣" name="1" />
      </el-tabs>
    </div>
    <!-- 自定义表单分页列表 -->
    <formDetailsDisplay :option="formDetailsOptions" />
  </div>
</template>

<script>
import formDetailsDisplay from './components/form-details-display.vue'
import stockInput from './components/stock-input.vue'
import { MaterialPlanning } from './components/index.js'
import logMethods from './components/log-methods'
export default {
  components: { formDetailsDisplay },
  mixins: [MaterialPlanning, logMethods],
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

    // 搜索表单配置
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
      '_salesTeamName': {
        prop: 'salesTeamName',
        itemType: 'input',
        label: '销售团队',
        itemStyle: { width: '25%' },
        placeholder: '请输入'
      },
      '_clothType': {
        prop: 'clothType',
        itemType: 'input',
        label: '布类',
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
      '_yarnAttr': {
        prop: 'yarnAttr',
        itemType: 'input',
        label: '纱属性',
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
      '_operate': {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          console.log('查询', params)
          let startTime = ''
          let endTime = ''
          if (params.deliveryDate && params.deliveryDate.length === 2) {
            startTime = params.deliveryDate[0]
            endTime = params.deliveryDate[1]
          }
          this.materielPlanPage({ ...params, planStatus: this.activeName, startTime, endTime })
          this.searchFormDatas = params
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    }

    // 自定义表单头部列表
    const headerList = {
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
      '_customerName': {
        label: '客户: ',
        prop: 'customerName'
      },
      '_delivery': {
        label: '交期: ',
        prop: 'delivery',
        formater: scope => {
          return scope.delivery ? this.$filters.parseTime(scope.delivery, '{y}-{m}-{d}') : '-'
        }
      },
      '_yarnName': {
        label: '纱名: ',
        prop: 'yarnName'
      },
      '_yarnAttr': {
        label: '纱属性: ',
        prop: 'yarnAttr'
      },
      '_produceProcess': {
        label: '生产流程: ',
        prop: 'produceProcess'
      },
      '_salesTeamName': {
        label: '销售团队: ',
        prop: 'salesTeamName'
      },
      '_completedNum': {
        label: '数量: ',
        prop: 'completedNum'
      }
    }
    // 自定义表单表头
    const contentHead = {
      '_process': {
        label: '工序',
        prop: 'process',
        formater: (scope, form, formDatas, setFormDatas) => {
          // let num = 0
          // num++
          // console.log(scope, form, formDatas, setFormDatas)
          return scope.row.index + 1 + '、' + scope.row.process
        }
      },
      '_code': {
        label: '编码',
        prop: 'code',
        formater: (scope) => {
          return `<span title="${scope.row.process === '采购' ? scope.row.yarnName || '' : ''}">${scope.row.process === '采购' && scope.row.yarnColor ? scope.row.code + '-' + scope.row.yarnColor : scope.row.code}</span>`
        }
      },
      '_orderRequireNum': {
        label: '订单需求量',
        prop: 'orderRequireNum',
        formater: (scope) => {
          return scope.row.orderRequireNum ? this.$utils.getFloat(scope.row.orderRequireNum) + 'kg' : ''
        }
      },
      '_needProductNum': {
        label: '需生产量',
        prop: 'needProductNum',
        formater: (scope) => {
          return scope.row.needProductNum ? this.$utils.getFloat(scope.row.needProductNum) + 'kg' : ''
        }
      },
      '_num': {
        label: '可用库存',
        prop: 'num',
        customInput: true,
        components: {
          stockInput
        },
        componentsOptions: {}
        // customInput: true
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
        // console.log('currentChange', val, this.formDetailsPagination)
        this.materielPlanPage({ pageSize: this.formDetailsPagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        // console.log('sizeChange', val, this.formDetailsPagination)
        this.$set(this.formDetailsPagination, 'currentPage', 1)
        this.materielPlanPage({ pageNum: 1, pageSize: val })
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
        // spanMethod: spanMethod,
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
      headerList: headerList, // 头部list
      checkShow: false, // 是否显示多选框
      rightButtonShow: true, // 右边button是否显示
      rightButtonText: '确定', // 右边button文字内容
      rightButtonClick: (scope, index) => {
        console.log(scope, index)
        this.$confirm(' 您要确认该数量吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.confirmQuantity({ id: scope.id })
            // this.activeName === '2' ? this.deletePhysicalSurveyItems({ uuid: params.row.uuid }) : this.deleteExecutiveStandard({ uuid: params.row.uuid })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      },
      customFormData: customFormData, // 表单内容
      contentHead: contentHead, // 内容表头
      dataSource: formDetailsDataSource, // 内容
      pagination: formDetailsPagination // 分页内容
    }
    return {
      searchData,
      formOtions: { inline: true, size: 'small', layout: true },

      activeName: '0',

      formDetailsOptions,
      searchFormDatas: {},
      // emptyRowData: {
      //   date: '',
      //   name: '',
      //   title: '',
      //   edit: true
      // },
      formDetailsPagination
    }
  },
  created() {
    this.materielPlanPage({})
  },
  methods: {
    handleClick() {
      // if (this.activeName === '0') {

      // } else {}
      this.$refs.searchForm.form.resetFields()
      this.searchFormDatas = {}
      this.$set(this.formDetailsOptions, 'rightButtonShow', this.activeName === '0')
      this.materielPlanPage({ })
    }
  }
}
</script>

<style lang='scss'>
  .material-planning {
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
    // tr td:not([rowspan='1']) {
    //   padding-top: 3px;
    //   vertical-align: baseline;
    // }
  }
</style>
