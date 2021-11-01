<!--
 * @Descripttion:报价单添加弹窗
 * @version:
 * @Author: xj
 * @Date: 2020-11-17 10:53:03
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-03 11:16:15
-->
<template>
  <div ref="popOptionsCode" lass="pop">
    <cs-custom-popsearch
      ref="popOpForm"
      class="quotation_popOptions_codes"
      :options="popOptions"
      @close="popClose"
    />
  </div>
</template>

<script>
import { quotationSheet, exchangeRatemn } from '../api/index'
import { PublicCustomer } from '@/views/customer-order/public/index'
export default {
  name: 'CodePop',
  components: {},
  mixins: [PublicCustomer],
  props: {
    tab: {
      type: String
    },
    setParentDataHandle: {
      type: Function
    },
    deliFreshData: {
      type: Object
    },
    popGetData: {
      type: Object
    }
  },
  data() {
  // 纱线编码分页
    const pagination = {
      pageSizes: [10, 20, 50, 100],
      currentChange: val => {
        this.getData({ pageSize: this.popOptions.popTableOptions.pageSize || 10, pageNum: val, currentPage: val })
      },
      sizeChange: val => {
        this.$set(this.popOptions.popTableOptions.pagination, 'currentPage', 1)
        this.getData({ pageNum: 1, pageSize: val, currentPage: 1 })
      }
    }
    const columns = {
      _quotationId: {
        prop: 'quotationId',
        label: '报价单号',
        showOverflowTooltip: true
      },
      _customer: {
        prop: 'customer',
        label: '客户',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.customer || '-'
        }
      },
      _applyCode: {
        prop: 'applyCode',
        label: '品牌',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.applyCode || '-'
        }
      },
      _productInfo: {
        prop: 'productInfo',
        label: '单价（含税）',
        minWidth: '110',
        formater: (scope) => {
          return scope.row.productInfo || '-'
        }
      },
      _moq: {
        prop: 'moq',
        label: 'MOQ(KG）',
        minWidth: '110',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.moq || '-'
        }
      },
      _mcq: {
        prop: 'mcq',
        label: 'MCQ(KG）',
        minWidth: '110',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.mcq
        }
      },
      _proposerName: {
        prop: 'proposerName',
        label: '产品信息',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.proposerName || '-'
        }
      },
      _proposerName1: {
        prop: 'proposerName1',
        label: '纱名',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.proposerName || '-'
        }
      },
      _proposerName2: {
        prop: 'proposerName2',
        label: '纱属性',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.proposerName || '-'
        }
      },
      _proposerName3: {
        prop: 'proposerName3',
        label: '工艺要求',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.proposerName || '-'
        }
      },
      _testRequirement: {
        prop: 'testRequirement',
        label: '测试要求',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.testRequirement || '-'
        }
      },
      _sellerTeamName: {
        prop: 'sellerTeamName',
        label: '销售组织',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.sellerTeamName || '-'
        }
      },
      _remark: {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.remark || '-'
        }
      }
    }
    const coYarnNaturalFiberSearchReq = {// 天然纤维请求参数 ,CoYarnNaturalFiberSearchReq
      _quotationId: {
        prop: 'receiveCode',
        itemType: 'select',
        itemStyle: { width: '23%' },
        itemClassName: 'labeClassPadding',
        label: '报价单号',
        clearable: true
      },
      _customer: {
        prop: 'customer',
        itemType: 'select',
        itemStyle: { width: '23%' },
        itemClassName: 'labeClassPadding',
        label: '客户',
        visibleChange: (value, val) => {
          if (value) {
            this.getCustomerSelect('customer')
          }
        },
        dataSource: [],
        clearable: true
      },
      _salesTeam: {
        prop: 'salesTeam',
        itemType: 'select',
        itemStyle: { width: '23%' },
        itemClassName: 'labeClassPadding',
        label: '销售团队',
        visibleChange: (value, val) => {
          if (value) {
            this.getSellTeamSelect('salesTeam')
          }
        },
        dataSource: [],
        clearable: true
      },
      _quarter: {
        prop: 'quarter',
        itemType: 'select',
        itemStyle: { width: '23%' },
        itemClassName: 'labeClassPadding',
        label: '销售季度',
        visibleChange: (value, val) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '销售季度' }, 'baseData')
          }
        },
        dataSource: [],
        clearable: true
      },
      _yarnCertName: {
        prop: 'yarnCertName',
        itemType: 'select',
        itemStyle: { width: '23%' },
        itemClassName: 'labeClassPadding',
        label: '证书要求',
        visibleChange: value => {
          this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '证书要求' }, 'naturalFiber')
        },
        dataSource: [],
        clearable: true
      },
      _operate: {
        itemType: 'operate',
        submitHandle: params => {
          this.getData(params)
          this.popsearchFormDatas = params
        },
        submitText: '添加',
        resetHandle: (params) => {
          this.popsearchFormDatas = {}
        }
      }
    }
    // 纱线编码搜索组件
    const popOptions = {
      visible: false,
      title: '报价单检索',
      width: '1235px',
      footerOptions: {
        content: [
          {
            name: '确认',
            handle: (formDatas, form, table) => {
              if (!this.currentRow) {
                this.$message({
                  message: '请选择一条记录',
                  type: 'warning'
                })
                return
              }
              this.OkClick({ ...this.currentRow })
            }
          },
          {
            name: '取消',
            handle: (formDatas, form, table) => {
              this.popHandle()
            }
          }

        ]
      },
      popFormOptions: {
        content: coYarnNaturalFiberSearchReq,
        formOptions: {
          syncDataHandle: (syncData) => {
            // console.log('pm', syncData)
          },
          inline: true,
          layout: true,
          labelWidth: '80px'
        }
      },
      popTableOptions: {
        columns,
        highlightCurrentRow: true,
        currentRowKey: 'id',
        rowClick: (row, column, event) => {
          this.currentRow = row
        },
        dataSource: [],
        pagination
      }
    }
    return {

      activeName: '1',
      popOptions,
      pagination,
      popsearchFormDatas: {}, // /弹窗搜索组件
      coYarnNaturalFiberSearchReq // 天然纤维请求参数 ,CoYarnNaturalFiberSearchReq
    }
  },
  computed: {
    getPopForm() { // 表格数据
      return this.popOptions.popTableOptions.dataSource
    }
  },
  watch: {
    'popOptions.visible': {// 深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        if (val) {
          this.getData()
        }
      }
    },
    popGetData: {
      handler(val, oldVal) {},
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    popHandle(activeName) { // 纱线编码显隐
      this.popsearchFormDatas = {}
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
    },
    async getData2(data = {}) {
      const tableData = await exchangeRatemn()

      console.log('ommmmmmtableData', tableData)
    },

    async getData(data = {}) {
      this.getData2()
      const params = { ...data, ...this.popGetData }
      const tableData = await quotationSheet(params)

      const res = tableData.data || ''
      const pagination = {
        ...this.popOptions.popTableOptions.pagination,
        ...data,
        dataTotal: res.total || 0,
        currentPage: res.pageNum || 0,
        pageSize: res.pageSize || 1,
        pageNum: res.pageNum || 1
      }
      if (!res) {
        this.$message({ message: '查询无结果', type: 'warning' })
        return false
      } else {
        this.$set(this.popOptions.popTableOptions, 'dataSource', this.getPopForm)
        this.$set(this.popOptions.popTableOptions, 'pagination', pagination)
      }
    },
    popClose() {
      this.currentRow = null
      this.popsearchFormDatas = {}
      this.popOptions.popTableOptions.dataSource = []
    },
    async OkClick(data = {}) { // 确定按钮
      this.$emit('okHandleClick', data)
      this.popHandle()
    },
    getCloe() {
      this.popOptions.popTableOptions.dataSource = []
    },
    // 获取客户下拉
    getCustomerSelect(type) {
      this.getCustomer().then(res => {
        if (type === 'customer') {
          this.$set(this.coYarnNaturalFiberSearchReq._customer, 'dataSource', res)
        }
      })
    },
    // 获取销售团队下拉
    getSellTeamSelect(type) {
      this.getSellTeam({ functionTag: 'SAL' }).then(res => {
        if (type === 'salesTeam') {
          this.$set(this.coYarnNaturalFiberSearchReq._salesTeam, 'dataSource', res)
        }
      })
    },
    // 选项配置下拉
    getOptionConfigSelect(data, type) {
      this.getOptionConfig(data).then(res => {
        if (type === 'baseData') { // 销售季度
          this.$set(this.coYarnNaturalFiberSearchReq._quarter, 'dataSource', res)
        } else if (type === 'naturalFiber') { // 证书要求
          this.$set(this.coYarnNaturalFiberSearchReq._yarnCertName, 'dataSource', res)
        }
      }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .quotation_popOptions_codes {
  .labeClassPadding {
    margin-right: 15px !important;
    padding-right: 0 !important;
  }
  .custom-form{
    margin: 0!important;
  }
}
</style>
