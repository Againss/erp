import * as priceApi from '../../api/price-index'
import radioButton from '../../components/radio-button.vue'
export const finance = {
  data() {
    const lineStyle = {
      'border-bottom': '1px solid #E9EFF2',
      'width': '100%',
      'margin-bottom': '20px'
    }
    // 财务成本付款条件弹出框基础表头
    const financePaymentBaseColumns = [
      {
        prop: 'paymentMethodName',
        label: '付款条件',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'paymentPct',
        label: '付款条件百分比',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? scope.row[scope.column.property] + '%' : 0 + '%'
      }
    ]
    // 财务成本付款条件弹出框表头
    const financePaymentColumns = [
      {
        prop: 'id',
        label: '选择',
        width: '50',
        components: {
          radioButton
        },
        componentsOptions: {
          // radio: 1,
          changeMethods: (value) => {

          }
        }
      },
      {
        prop: 'code',
        label: '序号',
        width: '60',
        showOverflowTooltip: true,
        formater: (scope) => {
          return (this.financePaymentPagination.currentPage - 1) * this.financePaymentPagination.pageSize + scope.$index + 1
        }
      },
      ...financePaymentBaseColumns
    ]
    // 财务成本付款条件弹出框分页
    const financePaymentPagination = {
      currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getPaymentMethodPage({ ...this.$refs.finance.$children[0].formDatas, pageSize: this.financePaymentPagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        //
        this.$set(this.spunPagination, 'currentPage', 1)
        this.getPaymentMethodPage({ pageNum: 1, pageSize: val })
      }
    }
    // 财务成本付款条件弹出框
    const financePaymentPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1240px',
      ok: params => {
        if (this.financePaymentColumns[0].componentsOptions.radio) {
          this.paymentMethodList = [this.financePaymentColumns[0].componentsOptions.radioData]

          this.totalDataList[this.editableTabsValue].paymentMethodList = this.paymentMethodList
        }
        this.closePopDialogHandle(this.financePaymentPopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.financePaymentPopOptions)
        // this.$set(this.columnsInfos[0].componentsOptions, 'radio', null)
      },
      close: () => {
        this.$set(this.financePaymentColumns[0].componentsOptions, 'radio', null)
        this.$set(this.financePaymentPopOptions.formDatas, 'radio', null)
      },
      formDatas: {
        // name: '1'
      },
      formOptions: {
        labelWidth: '100px',
        inline: true
      },
      content: [
        {
          prop: 'paymentMethod',
          itemType: 'select',
          label: '付款条件:',
          filterable: true,
          valueType: 'object',
          itemStyle: { width: '25%', 'marginRight': 0 },
          dataSource: [],
          change: (object, form, formDatas) => { this.getPaymentMethodPage(formDatas) }
        },
        {
          itemType: 'view',
          text: ``,
          style: lineStyle
        },
        {
          prop: 'tableForm',
          headerCellStyle: { 'background-color': '#F5F7FA' },
          className: 'pop-table',
          itemType: 'table-form',
          label: '',
          labelWidth: '0',
          itemStyle: { width: '100%', 'marginRight': 0 },
          dataSource: [],
          tooltipEffect: 'dark',
          columns: financePaymentColumns,
          pagination: financePaymentPagination
        }
      ]
    }
    return {
      // 财务成本
      paymentMethodList: [],
      financePaymentPopOptions,
      financePaymentBaseColumns,
      financePaymentColumns,
      financePaymentPagination
    }
  },
  computed: {
    // 财务成本小计
    financeCostSubtotal() {
      let totalPrice = 0
      // debugger

      this.paymentMethodList.length !== 0 ? this.paymentMethodList.forEach(item => {
        totalPrice += this.$utils.getFloat(this.$utils.getFloat(this.productCostSubtotal * (1 + (this.areaData.targetProfitRate || 0) / 100), 4) * (item.paymentPct ? item.paymentPct / 100 : 0), 4)
      }) : totalPrice = 0
      return totalPrice.toFixed(4)
    }
  },
  methods: {
    // 添加财务成本付款条件弹出框
    financePaymentPop() {
      this.type = 'add'
      this.PopDialogHandle(this.financePaymentPopOptions, '请选择付款条件')
      this.getPaymentMethodPage()
      this.getPaymentMethodOptionsFilled()
    },
    // 获取付款条件下拉选项
    async getPaymentMethodOptionsFilled(data = {}) {
      const res = await priceApi.paymentMethodOptionsFilled({ ...data, status: 1 })
      this.completionData(res.data, this.financePaymentPopOptions.content)
    },
    // 获取财务成本付款条件page
    async getPaymentMethodPage(data = {}) {
      const res = await priceApi.paymentMethodPage({ ...data, status: 1 })
      const dataList = res.data.list || []
      this.financePaymentPagination = {
        ...this.financePaymentPagination,
        dataTotal: res.data ? res.data.total : 0,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.$set(this.financePaymentPopOptions.content[2], 'pagination', this.financePaymentPagination)
      this.$set(this.financePaymentPopOptions.content[2], 'dataSource', dataList)
    }
  }
}
