import * as priceApi from '../../api/price-index'
import radioButton from '../../components/radio-button.vue'
import recalculation from '../../components/recalculation.vue'
// import production from './production'
// import department from '../../components/department.vue'
export const cloth = {

  data() {
    const lineStyle = {
      'border-bottom': '1px solid #E9EFF2',
      'width': '100%',
      'margin-bottom': '20px'
    }
    // 坯布成本织工弹框表头
    const clothViewColumns = [
      // {
      //   prop: 'dyeMethodName',
      //   label: '染方式',
      //   minWidth: '120',
      //   showOverflowTooltip: true
      // },
      // {
      //   prop: 'damaskModellingName',
      //   label: '织花造型',
      //   minWidth: '120',
      //   showOverflowTooltip: true
      // },
      // {
      //   prop: 'stretchType',
      //   label: '弹力',
      //   minWidth: '120',
      //   showOverflowTooltip: true,
      //   formater: scope => {
      //     return scope.row[scope.column.property] === 1 ? '弹力' : scope.row[scope.column.property] === 0 ? '非弹力' : ''
      //   }
      // },
      {
        prop: 'fabricName',
        label: '布类',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'yarnsBranchName',
        label: '纱支/细度',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => {
          // return `<span>${scope.row[scope.column.property]}</span> ${scope.row.finenessName ? ('| <span>' + scope.row.finenessName + '</span>') : ''}`
          if (scope.row[scope.column.property] && scope.row.finenessName) {
            return `<span>${scope.row[scope.column.property]}</span> | <span>${scope.row.finenessName}</span>`
          } else {
            return scope.row[scope.column.property] || scope.row.finenessName
          }
        }
      },
      // {
      //   prop: 'wovenMiddleInfo',
      //   label: '纱支/细度',
      //   minWidth: '120',
      //   components: {
      //     department
      //   },
      //   componentsOptions: {
      //     key: 'wovenMiddleInfo',
      //     name: 'name'
      //   }
      // },
      // {
      //   prop: 'pinNumber',
      //   label: '针数',
      //   minWidth: '120',
      //   showOverflowTooltip: true,
      //   formater: scope => scope.row[scope.column.property] ? scope.row[scope.column.property] + 'G' : ''
      // },
      {
        prop: 'wovenTechPrice',
        label: '织工价格',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      }
    ]

    // 坯布成本织工基础表头
    const clothBaseColumns = [
      // {
      //   prop: 'dyeMethodName',
      //   label: '染方式',
      //   minWidth: '120',
      //   showOverflowTooltip: true
      // },
      // {
      //   prop: 'damaskModellingName',
      //   label: '织花造型',
      //   minWidth: '120',
      //   showOverflowTooltip: true
      // },
      // {
      //   prop: 'stretchType',
      //   label: '弹力',
      //   minWidth: '120',
      //   showOverflowTooltip: true,
      //   formater: scope => {
      //     return scope.row[scope.column.property] === 1 ? '弹力' : scope.row[scope.column.property] === 0 ? '非弹力' : ''
      //   }
      // },
      {
        prop: 'fabricName',
        label: '布类',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'yarnsBranchName',
        label: '纱支/细度',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => {
          if (scope.row[scope.column.property] && scope.row.finenessName) {
            return `<span>${scope.row[scope.column.property]}</span> | <span>${scope.row.finenessName}</span>`
          } else {
            return scope.row[scope.column.property] || scope.row.finenessName
          }
        }
      },
      // {
      //   prop: 'wovenMiddleInfo',
      //   label: '纱支/细度',
      //   minWidth: '120',
      //   components: {
      //     department
      //   },
      //   componentsOptions: {
      //     key: 'wovenMiddleInfo',
      //     name: 'name'
      //   }
      // },
      // {
      //   prop: 'pinNumber',
      //   label: '针数',
      //   minWidth: '120',
      //   showOverflowTooltip: true,
      //   formater: scope => scope.row[scope.column.property] ? scope.row[scope.column.property] + 'G' : ''
      // },
      {
        prop: 'wovenTechPrice',
        label: '织工价格',
        minWidth: '120',
        // showOverflowTooltip: true,
        components: {
          recalculation
        },
        componentsOptions: {
          isFlag: false,
          prop: 'wovenTechPrice',
          text: '底磨毛、面磨毛、底刷毛、面刷毛、单染，织工增加'
        }
        // formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      }
    ]
    // 坯布成本织工表格表头
    const clothColumns = [
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
          return (this.clothPagination.currentPage - 1) * this.clothPagination.pageSize + scope.$index + 1
        }
      },
      ...clothViewColumns
    ]
    // 坯布成本织工弹出框分页
    const clothPagination = {
      // currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getWovenTechInfoPage({ ...this.$refs.cloth.$children[0].formDatas, pageSize: this.clothPagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        //
        this.$set(this.spunPagination, 'currentPage', 1)
        this.getWovenTechInfoPage({ pageNum: 1, pageSize: val })
      }
    }
    // 坯布成本织工弹出框
    const clothPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1240px',
      ok: params => {
        if (this.clothColumns[0].componentsOptions.radio) {
          this.wovenTechList = [this.clothColumns[0].componentsOptions.radioData]

          this.totalDataList[this.editableTabsValue].wovenTechList = this.wovenTechList
        }
        this.closePopDialogHandle(this.clothPopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.clothPopOptions)
        // this.$set(this.columnsInfos[0].componentsOptions, 'radio', null)
      },
      close: () => {
        this.$set(this.clothColumns[0].componentsOptions, 'radio', null)
        this.$set(this.clothPopOptions.formDatas, 'radio', null)
      },
      formDatas: {
        // name: '1'
      },
      formOptions: {
        labelWidth: '100px',
        inline: true
      },
      content: [
        // {
        //   prop: 'dyeMethod',
        //   itemType: 'select',
        //   label: '染方式:',
        //   // clearable: true,
        //   valueType: 'object',
        //   itemStyle: { width: '25%', 'marginRight': 0 },
        //   placeholder: '请选择染方式',
        //   dataSource: [],
        //   change: (object, form, formDatas) => { this.getWovenTechInfoPage(formDatas) }
        // },
        // {
        //   prop: 'damaskModelling',
        //   itemType: 'select',
        //   label: '织花造型:',
        //   // clearable: true,
        //   itemStyle: { width: '25%', 'marginRight': 0 },
        //   valueType: 'object',
        //   placeholder: '请选择染方式',
        //   dataSource: [],
        //   change: (object, form, formDatas) => { this.getWovenTechInfoPage(formDatas) }
        // },
        // {
        //   prop: 'stretchType',
        //   itemType: 'select',
        //   // valueType: 'object',
        //   label: '弹力:',
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
        //   change: (object, form, formDatas) => { this.getWovenTechInfoPage(formDatas) }
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
        //   change: (object, form, formDatas) => { this.getWovenTechInfoPage(formDatas) }
        // },
        {
          prop: 'fabricName',
          itemType: 'select',
          label: '布类:',
          valueType: 'object',
          placeholder: '请选择布类',
          filterable: true,
          itemStyle: { width: '25%', 'marginRight': 0 },
          dataSource: [],
          change: (object, form, formDatas) => { this.getWovenTechInfoPage(formDatas) }
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
          columns: clothColumns,
          pagination: clothPagination
        }
      ]
    }
    return {
      // 这是坯布成本的
      wovenTechList: [],
      clothPopOptions,
      clothPagination,
      clothBaseColumns,
      clothColumns
    }
  },
  computed: {
    // 坯布成本小计
    fabricCostSubtotal() {
      // this.isCloth = false
      //
      let totalPrice = 0
      if (this.wovenTechList.length !== 0) {
        this.wovenTechList.forEach(item => {
          console.log(item.wovenTechPrice, 'item.wovenTechPrice')
          totalPrice += this.$utils.getFloat(this.materialCostSubtotal * 1 + (item.wovenTechPrice || 0), 4)
        })
      } else {
        totalPrice = 0
      }
      //
      if (this.isCloth) {
        totalPrice = totalPrice + 0.2

        // this.wovenTechList && this.wovenTechList.forEach(witem => {
        //   witem.wovenTechPrice = witem.wovenTechPrice + 0.2
        // })
      }
      this.$set(this.clothBaseColumns[2].componentsOptions, 'isFlag', this.isCloth)
      return totalPrice.toFixed(4)
    }
  },
  methods: {
    // 打开坯布成本织工弹出框
    clothPop() {
      this.type = 'add'
      this.PopDialogHandle(this.clothPopOptions, '请选择织工')
      this.getWovenTechInfoPage()
      this.getWovenTechInfoOptionsFilled()
    },
    // 获取织工page
    async getWovenTechInfoPage(data = {}) {
      const res = await priceApi.wovenTechInfoPage({ ...data, status: 1 })
      const dataList = res.data.list || []
      this.clothPagination = {
        ...this.clothPagination,
        dataTotal: res.data ? res.data.total : 0,
        // ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      dataList.forEach(item => {
        item.yarnsBranchName = item.wovenMiddleInfo ? item.wovenMiddleInfo.reduce((total, item) => {
          item.dyedYarnCategory === 'S' && total.push(item.dyedYarnName)
          return total
        }, []).join(',') : ''
        item.finenessName = item.wovenMiddleInfo ? item.wovenMiddleInfo.reduce((total, item) => {
          item.dyedYarnCategory === 'F' && total.push(item.dyedYarnName)
          return total
        }, []).join(',') : ''
      })
      this.$set(this.clothPopOptions.content[2], 'pagination', this.clothPagination)
      this.$set(this.clothPopOptions.content[2], 'dataSource', dataList)
    },
    // 获取织工下拉框数据
    async getWovenTechInfoOptionsFilled(data = {}) {
      const res = await priceApi.wovenTechInfoOptionsFilled({ ...data, status: 1 })
      this.completionData(res.data, this.clothPopOptions.content)
    }
  }
}
