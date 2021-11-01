import * as priceApi from '../../api/price-index'
import radioButton from '../../components/radio-button.vue'
export const material = {
  data() {
    const lineStyle = {
      'border-bottom': '1px solid #E9EFF2',
      'width': '100%',
      'margin-bottom': '20px'
    }

    // 原材料成本织损耗基础表头
    const materialBaseColumns = [
      // {
      //   prop: 'dyeMethodName',
      //   label: '染方式',
      //   minWidth: '70',
      //   showOverflowTooltip: true
      // },
      {
        prop: 'damaskModellingName',
        label: '织花造型',
        minWidth: '80',
        showOverflowTooltip: true
      },
      // {
      //   prop: 'stretchType',
      //   label: '弹力',
      //   minWidth: '60',
      //   showOverflowTooltip: true,
      //   formater: scope => {
      //     return scope.row[scope.column.property] === 1 ? '弹力' : scope.row[scope.column.property] === 0 ? '非弹力' : ''
      //   }
      // },
      // {
      //   prop: 'fabricTypeName',
      //   label: '布种',
      //   minWidth: '60',
      //   showOverflowTooltip: true
      // },
      // {
      //   prop: 'cardingMethodName',
      //   label: '梳棉方法',
      //   minWidth: '80',
      //   showOverflowTooltip: true
      // },
      // {
      //   prop: 'compositionName',
      //   label: '成分/组合成份',
      //   minWidth: '130',
      //   showOverflowTooltip: true
      // },
      // {
      //   prop: 'minWeight',
      //   label: '重量区间(千克)',
      //   minWidth: '130',
      //   showOverflowTooltip: true,
      //   formater: scope => {
      //     return (scope.row.minWeight || '') + '~' + (scope.row.maxWeight || '')
      //   }
      // },
      {
        prop: 'wavenLossPct',
        label: '织损耗百分比',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? scope.row[scope.column.property] + '%' : 0 + '%'
      }
    ]
    // 原材料成本织损耗表格表头
    const materialColumns = [
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
            console.log('组件', value)
          }
        }
      },
      {
        prop: 'code',
        label: '序号',
        width: '60',
        showOverflowTooltip: true,
        formater: (scope) => {
          return (this.materialPagination.currentPage - 1) * this.materialPagination.pageSize + scope.$index + 1
        }
      },
      ...materialBaseColumns
    ]
    // 原材料成本织损耗弹出框分页
    const materialPagination = {
      // currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getWavenLossInfoPage({ ...this.$refs.material.$children[0].formDatas, pageSize: this.materialPagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        // console.log('sizeChange', this.pagination)
        this.$set(this.spunPagination, 'currentPage', 1)
        this.getWavenLossInfoPage({ pageNum: 1, pageSize: val })
      }
    }
    // 原材料成本织损耗弹出框
    const materialPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1240px',
      ok: params => {
        console.log(params)
        if (this.materialColumns[0].componentsOptions.radio) {
          console.log('织损耗选中了')
          this.wovenLossList = [this.materialColumns[0].componentsOptions.radioData]

          this.totalDataList[this.editableTabsValue].wovenLossList = this.wovenLossList
        }
        this.closePopDialogHandle(this.materialPopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.materialPopOptions)
        // this.$set(this.columnsInfos[0].componentsOptions, 'radio', null)
      },
      close: () => {
        this.$set(this.materialColumns[0].componentsOptions, 'radio', null)
        this.$set(this.yarnDyeingLossPopOptions.formDatas, 'radio', null)
        // this.$set(this.yarnPopOptions.formDatas, 'search', '')
      },
      formDatas: {
        // name: '1'
      },
      formOptions: {
        labelWidth: '120px',
        inline: true
      },
      content: [
        // {
        //   prop: 'dyeMethod',
        //   itemType: 'select',
        //   label: '染方式:',
        //   // clearable: true,
        //   itemStyle: { width: '25%', 'marginRight': 0 },
        //   placeholder: '请选择染方式',
        //   valueType: 'object',
        //   dataSource: [],
        //   change: (object, form, formDatas) => { this.getWavenLossInfoPage(formDatas) }
        // },
        {
          prop: 'damaskModelling',
          itemType: 'select',
          label: '织花造型:',
          // clearable: true,
          filterable: true,
          itemStyle: { width: '25%', 'marginRight': 0 },
          valueType: 'object',
          placeholder: '请选择染方式',
          dataSource: [],
          change: (object, form, formDatas) => { this.getWavenLossInfoPage(formDatas) }
        },
        // {
        //   prop: 'stretchType',
        //   itemType: 'select',
        //   label: '弹力:',
        //   // valueType: 'object',
        //   // clearable: true,
        //   itemStyle: { width: '25%', 'marginRight': 0 },
        //   placeholder: '请选择弹力',
        //   dataSource: [
        //     {
        //       value: '',
        //       label: '全部'
        //     },
        //     {
        //       value: 1,
        //       label: '弹力'
        //     },
        //     {
        //       value: 0,
        //       label: '非弹力'
        //     }
        //   ],
        //   change: (object, form, formDatas) => { this.getWavenLossInfoPage(formDatas) }
        // },
        // {
        //   prop: 'fabricType',
        //   itemType: 'select',
        //   label: '布种:',
        //   // clearable: true,
        //   itemStyle: { width: '25%', 'marginRight': 0 },
        //   valueType: 'object',
        //   placeholder: '请选择布种',
        //   dataSource: [],
        //   change: (object, form, formDatas) => { this.getWavenLossInfoPage(formDatas) }
        // },
        // {
        //   prop: 'cardingMethod',
        //   itemType: 'select',
        //   label: '梳棉方法:',
        //   // clearable: true,
        //   itemStyle: { width: '25%', 'marginRight': 0 },
        //   valueType: 'object',
        //   placeholder: '请选择梳棉方法',
        //   dataSource: [],
        //   change: (object, form, formDatas) => { this.getWavenLossInfoPage(formDatas) }
        // },
        // {
        //   prop: 'composition',
        //   itemType: 'select',
        //   label: '成分/组合成份:',
        //   // clearable: true,
        //   itemStyle: { width: '25%', 'marginRight': 0 },
        //   valueType: 'object',
        //   placeholder: '请选择成分/组合成份',
        //   dataSource: [],
        //   change: (object, form, formDatas) => { this.getWavenLossInfoPage(formDatas) }
        // },
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
          columns: materialColumns,
          pagination: materialPagination
        }
      ]
    }
    return {
      // 这是原材料成本的
      wovenLossList: [],
      materialPopOptions,
      materialColumns,
      materialBaseColumns,
      materialPagination
    }
  },
  computed: {
    // 原材料成本小计
    materialCostSubtotal() {
      let totalPrice = 0
      this.wovenLossList.length !== 0 ? this.wovenLossList.forEach(item => {
        totalPrice += item.wavenLossPct * 1 === 100 ? 0 : this.$utils.getFloat(this.yarnCostSubtotal / (1 - (item.wavenLossPct || 0) / 100), 4)
      }) : totalPrice = 0
      return totalPrice.toFixed(4)
    }
  },
  methods: {
    // 打开原材料成本织损耗弹出框
    materialPop() {
      this.type = 'add'
      this.PopDialogHandle(this.materialPopOptions, '请选择织损耗')
      this.getWavenLossInfoPage()
      this.getWavenLossInfoOptionsFilled()
    },
    // 获取织损耗page
    async getWavenLossInfoPage(data = {}) {
      const res = await priceApi.wavenLossInfoPage({ ...data, status: 1 })
      console.log(res)
      const dataList = res.data.list || []
      this.materialPagination = {
        ...this.materialPagination,
        dataTotal: res.data ? res.data.total : 0,
        // ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.$set(this.materialPopOptions.content[2], 'pagination', this.materialPagination)
      this.$set(this.materialPopOptions.content[2], 'dataSource', dataList)
    },
    // 获取织损耗下拉框数据
    async getWavenLossInfoOptionsFilled(data = {}) {
      const res = await priceApi.wavenLossInfoOptionsFilled({ ...data, status: 1 })
      this.completionData(res.data, this.materialPopOptions.content)
    }
  }
}
