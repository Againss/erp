import * as priceApi from '../../api/price-index'
import radioButton from '../../components/radio-button.vue'
import affordinput from '../../components/affordinput.vue'
export const test = {
  data() {
    const lineStyle = {
      'border-bottom': '1px solid #E9EFF2',
      'width': '100%',
      'margin-bottom': '20px'
    }

    // 测试成本测试方式弹出框基础表头
    const testTestBaseColumns = [
      {
        prop: 'brandName',
        label: '品牌/最终买家',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'notaryIndustryName',
        label: '公证行',
        showOverflowTooltip: true
      },
      {
        prop: 'testWay',
        label: '测试方式',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row[scope.column.property] === 'F' ? '全套测试' : '附加测试'
        }
      },
      {
        prop: 'colorCount',
        label: '颜色个数',
        itemType: 'input',
        rules: [
          { required: true, message: '请输入颜色个数', trigger: ['change'] }
        ],
        components: {
          affordinput
        },
        componentsOptions: {
          type: 'colorCount',
          change: (value, scope) => {
            value = value.replace(/[^0-9]/g, '')
            if (value.length > 9) {
              value = value.substr(0, 9)
            }
            scope.row.colorCount = value
            this.testCostList[scope.$index].colorCount = value
          },
          blur: (e, scope) => {
            const value = e.target.value
            if (!isNaN(value) && (value - (scope.row.minColorCount || 0) > 0)) {
              scope.row.colorCount = value
              this.testCostList[scope.$index].colorCount = value
            } else {
              scope.row.colorCount = this.testCostList[scope.$index].minColorCount || 0
              this.testCostList[scope.$index].colorCount = scope.row.minColorCount || 0
            }
            this.totalDataList[this.editableTabsValue].testCostList = this.testCostList
          }
        }
      },
      {
        prop: 'testPrice',
        label: '测试价格',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      }
    ]
    // 测试成本测试方式弹出框表头
    const testTestColumns = [
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
          return (this.testTestPagination.currentPage - 1) * this.testTestPagination.pageSize + scope.$index + 1
        }
      },
      {
        prop: 'brandName',
        label: '品牌/最终买家',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'notaryIndustryName',
        label: '公证行',
        showOverflowTooltip: true
      },
      {
        prop: 'testWay',
        label: '测试方式',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row[scope.column.property] === 'F' ? '全套测试' : '附加测试'
        }
      },
      {
        prop: 'colorCount',
        label: '颜色个数',
        showOverflowTooltip: true
      },
      {
        prop: 'testPrice',
        label: '测试价格',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      }
    ]
    // 测试成本测试方式弹出框分页
    const testTestPagination = {
      currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getTestCostPage({ ...this.$refs.test.$children[0].formDatas, pageSize: this.testTestPagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        //
        this.$set(this.spunPagination, 'currentPage', 1)
        this.getTestCostPage({ pageNum: 1, pageSize: val })
      }
    }
    // 测试成本测试方式弹出框
    const testTestPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1240px',
      ok: params => {
        if (this.type === 'add') {
          if (this.testTestColumns[0].componentsOptions.radio) {
            // 第一次添加的颜色个数 可修改 默认值为选择的初始值  默认值为最小值
            this.testTestColumns[0].componentsOptions.radioData.minColorCount = this.testTestColumns[0].componentsOptions.radioData.colorCount
            console.log(this.testTestColumns[0].componentsOptions.radioData)
            this.testCostList.push(this.testTestColumns[0].componentsOptions.radioData)

            this.totalDataList[this.editableTabsValue].testCostList = this.testCostList
          }
        } else if (this.type === 'replace') {
          if (this.testTestColumns[0].componentsOptions.radio) {
            this.testCostList.splice(this.rowIndex, 1, this.testTestColumns[0].componentsOptions.radioData)

            this.totalDataList[this.editableTabsValue].testCostList = this.testCostList
          }
        }
        this.closePopDialogHandle(this.testTestPopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.testTestPopOptions)
      },
      close: () => {
        this.$set(this.testTestColumns[0].componentsOptions, 'radio', null)
        this.$set(this.testTestPopOptions.formDatas, 'radio', null)
      },
      formDatas: {
        // tabs: '1'
      },
      formOptions: {
        labelWidth: '120px',
        inline: true
      },
      content: [
        {
          prop: 'brand',
          itemType: 'select',
          filterable: true,
          label: '品牌/最终买家:',
          itemStyle: { width: '25%', 'marginRight': 0 },
          valueType: 'object',
          dataSource: [],
          change: (object, form, formDatas) => { this.getTestCostPage(formDatas) }
        },
        {
          prop: 'notaryIndustry',
          itemType: 'select',
          filterable: true,
          label: '公证行:',
          itemStyle: { width: '25%', 'marginRight': 0 },
          valueType: 'object',
          dataSource: [],
          change: (object, form, formDatas) => { this.getTestCostPage(formDatas) }
        },
        {
          prop: 'testWay',
          filterable: true,
          itemType: 'select',
          itemStyle: { width: '25%', 'marginRight': 0 },
          label: '测试方式:',
          dataSource: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '全套测试',
              value: 'F'
            },
            {
              label: '附加测试',
              value: 'A'
            }
          ],
          change: (object, form, formDatas) => { this.getTestCostPage(formDatas) }
        },
        {
          itemType: 'view',
          text: ``,
          // itemStyle: { width: '100%' },
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
          columns: testTestColumns,
          pagination: testTestPagination
        }
      ]
    }
    return {
      // 测试成本
      testCostList: [],
      testTestPopOptions,
      testTestBaseColumns,
      testTestColumns,
      testTestPagination
    }
  },
  computed: {
    // 测试成本小计
    testCostSubtotal() {
      let totalPrice = 0
      let countTotalPrice = 0
      if (this.testCostList.length !== 0) {
        this.testCostList.forEach(item => {
          totalPrice += (item.testPrice || 0) * (item.colorCount || 0)
        })
      } else {
        totalPrice = 0
      }
      //
      if (this.quantityData.length && this.quantityData[0].weight) {
        //
        countTotalPrice = totalPrice / (this.quantityData && this.quantityData[0].weight)
      }
      //
      // this.totalDataList[this.editableTabsValue].testCost = countTotalPrice.toFixed(4)
      return countTotalPrice.toFixed(4)
    }
  },
  methods: {
    // 添加测试成本测试方式弹出框
    testTestPop() {
      this.type = 'add'
      if (this.testCostList.length >= 15) {
        this.$message.warning('测试成本最多可以添加15个')
        return false
      }
      this.PopDialogHandle(this.testTestPopOptions, '请选择测试方式')
      this.getTestCostPage()
      this.getTestCostOptionsFilled()
    },
    // 获取测试成本page
    async getTestCostPage(data = {}) {
      const res = await priceApi.testCostPage({ ...data, status: 1 })
      const dataList = res.data.list || []
      this.testTestPagination = {
        ...this.testTestPagination,
        dataTotal: res.data ? res.data.total : 0,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.$set(this.testTestPopOptions.content[4], 'pagination', this.testTestPagination)
      this.$set(this.testTestPopOptions.content[4], 'dataSource', dataList)
    },
    // 获取测试成本下拉框数据
    async getTestCostOptionsFilled(data = {}) {
      const res = await priceApi.testCostOptionsFilled({ ...data, status: 1 })
      this.completionData(res.data, this.testTestPopOptions.content)
    }
  }
}
