<template>
  <div class="order-materials">
    <!-- 物料计划搜索 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" />
    </div>
    <!-- <div class="tab-group">
      <el-tabs v-model="activeName" class="commonTabs" @tab-click="handleClick">
        <el-tab-pane label="待划扣" name="0" />
        <el-tab-pane label="已划扣" name="1" />
      </el-tabs>
    </div> -->
    <!-- 自定义表单分页列表 -->
    <formDetailsDisplay :option="formDetailsOptions" />
  </div>
</template>

<script>
import formDetailsDisplay from './components/form-details-display.vue'
// import stockInput from './components/stock-input.vue'
import { OrderMaterials } from './components/index.js'
// import logMethods from '@/views/product-center/mixin/log-methods'
export default {
  components: { formDetailsDisplay },
  mixins: [OrderMaterials],
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
      '_salesTeamName': {
        prop: 'salesTeamName',
        itemType: 'input',
        label: '销售团队',
        itemStyle: { width: '25%' },
        placeholder: '请输入销售团队'
      },
      '_clothType': {
        prop: 'clothType',
        itemType: 'input',
        label: '布类',
        itemStyle: { width: '25%' },
        placeholder: '请输入布类'
      },
      '_yarnAllName': {
        prop: 'yarnAllName',
        itemType: 'input',
        label: '纱名',
        itemStyle: { width: '25%' },
        placeholder: '请输入纱名'
      },
      '_yarnAttributes': {
        prop: 'yarnAttributes',
        itemType: 'input',
        label: '纱属性',
        itemStyle: { width: '25%' },
        placeholder: '请输入纱属性'
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
          this.orderMaterielPage({ ...params, planStatus: this.activeName, startTime, endTime })
          this.searchFormDatas = params
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    }

    // 自定义表单头部列表
    const headerList = {
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
      '_yarnAllName': {
        label: '纱名: ',
        prop: 'yarnAllName'
      },
      '_yarnAttributes': {
        label: '纱属性: ',
        prop: 'yarnAttributes'
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
        prop: 'completedNum',
        formater: (scope) => {
          if (!scope.completedNum && scope.completedNum !== 0) {
            return '-'
          } else {
            return !isNaN(scope.completedNum) ? Number(scope.completedNum).toFixed(2) + 'kg' : ''
          }
        }
      }
    }
    // 自定义表单表头
    const contentHead = {
      '_id': {
        label: '序号',
        width: '60',
        prop: 'id',
        formater: (scope, form, formDatas, setFormDatas) => {
          return scope.row.index + 1
        }
      },
      '_process': {
        label: '任务',
        minWidth: '70',
        prop: 'process',
        // showOverflowTooltip: true,
        formater: (scope, form, formDatas, setFormDatas) => {
          return scope.row.process
        }
      },
      '_produceCode': {
        label: '成品编码',
        minWidth: '120',
        prop: 'produceCode',
        showOverflowTooltip: true
        // formater: (scope) => {
        //   return `<span title="${scope.row.process === '采购' ? scope.row.yarnName || '' : ''}">${scope.row.process === '采购' && scope.row.yarnColor ? scope.row.code + '-' + scope.row.yarnColor : scope.row.code}</span>`
        // }
      },
      '_orderRequireNum': {
        label: '成品重量(KG)',
        prop: 'orderRequireNum',
        minWidth: '100',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          // return !isNaN(scope.row.orderRequireNum) ? scope.row.orderRequireNum + 'kg' : ''
          if (!scope.row.orderRequireNum && scope.row.orderRequireNum !== 0) {
            return '-'
          } else {
            return !isNaN(scope.row.orderRequireNum) ? Number(scope.row.orderRequireNum).toFixed(2) : ''
          }
        }

      },
      '_whetherDyed': {
        label: '是否染色',
        prop: 'whetherDyed',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          const obj = {
            1: '是',
            0: '否'
          }
          return obj[scope.row.whetherDyed] || '-'
        }
      },
      '_yarnColor': {
        label: '染纱颜色',
        prop: 'yarnColor',
        width: '80',
        showOverflowTooltip: true
      },
      '_needProductNum': {
        label: '需生产量(KG)',
        prop: 'needProductNum',
        minWidth: '100',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          if (!scope.row.needProductNum && scope.row.needProductNum !== 0) {
            return '-'
          } else {
            return !isNaN(scope.row.needProductNum) ? Number(scope.row.needProductNum).toFixed(2) : ''
          }
        }
      },
      '_materielCode': {
        label: '原料编码',
        prop: 'materielCode',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => {
          const resultArr = scope.row.surceDetails ? scope.row.surceDetails.map(item => item.materielCode) : []
          let str = `<span>`
          resultArr.forEach((item, index) => {
            if (index === resultArr.length - 1) {
              str += `${item}</span>`
            } else {
              str += `${item}</br>`
            }
          })
          return str
        }
      },
      '_materielNum': {
        label: '原料重量(KG)',
        prop: 'materielNum',
        minWidth: '80',
        align: 'right',
        showOverflowTooltip: true,
        formater: scope => {
          const resultArr = scope.row.surceDetails ? scope.row.surceDetails.map(item => !isNaN(item.materielNum) ? Number(item.materielNum).toFixed(2) : '') : []
          let str = `<span>`
          resultArr.forEach((item, index) => {
            if (index === resultArr.length - 1) {
              str += `${item}</span>`
            } else {
              str += `${item}</br>`
            }
          })
          return str
        }
      },
      '_materielSource': {
        label: '原料来源',
        prop: 'materielSource',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          const resultArr = scope.row.surceDetails ? scope.row.surceDetails.map(item => item.materielSource) : []
          let str = `<span>`
          resultArr.forEach((item, index) => {
            if (index === resultArr.length - 1) {
              str += `${item}</span>`
            } else {
              str += `${item}</br>`
            }
          })
          return str
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
        // console.log('currentChange', val, this.formDetailsPagination)
        this.orderMaterielPage({ pageSize: this.formDetailsPagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        // console.log('sizeChange', val, this.formDetailsPagination)
        this.$set(this.formDetailsPagination, 'currentPage', 1)
        this.orderMaterielPage({ pageNum: 1, pageSize: val })
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
      // rightButtonShow: true, // 右边button是否显示
      // rightButtonText: '确定', // 右边button文字内容
      // rightButtonClick: (scope, index) => {
      //   console.log(scope, index)
      //   this.$confirm(' 您要确认该数量吗？', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   })
      //     .then(() => {
      //       this.confirmQuantity({ id: scope.id })
      //     })
      //     .catch(() => {
      //       this.$message({
      //         type: 'info',
      //         message: '已取消'
      //       })
      //     })
      // },
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
    this.orderMaterielPage()
  },
  methods: {
    // handleClick() {
    //   this.$refs.searchForm.form.resetFields()
    //   this.searchFormDatas = {}
    //   this.$set(this.formDetailsOptions, 'rightButtonShow', this.activeName === '0')
    //   this.orderMaterielPage({ })
    // }
  }
}
</script>

<style lang='scss'>
  .order-materials {
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
