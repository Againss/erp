import * as priceApi from '../../api/price-index'
import radioButton from '../../components/radio-button.vue'
import proportion from '../../components/proportion.vue'
import checkboxButton from '../../components/checkbox-button.vue'
import recalculation from '../../components/recalculation.vue'
import drogItem from '../../components/drogItem.vue'
import viewWithClear from '../../components/view-with-clear.vue'
// import cloth from './cloth'
export const production = {
  data() {
    const lineStyle = {
      'border-bottom': '1px solid #E9EFF2',
      'width': '100%',
      'margin-bottom': '20px'
    }
    // 生产成本染色工艺弹出框基础表头
    const productDyeingVieweColumns = [
      {
        prop: 'dyeingProcess',
        label: '染色工艺',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          const dyeingType = {
            'W': '洗水',
            'B': '漂白',
            'H': '半漂',
            'D': '染色'
          }
          // const type = 'W'
          return dyeingType[scope.row.dyeingProcess]
        }
      },
      {
        prop: 'singleDoubleDyeingName',
        label: '单双染',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'colorDepthName',
        label: '颜色深浅',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'fabricGradeName',
        label: '布类等级',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'dyeingPrice',
        label: '染色工艺价格',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      }
    ]
    // 生产成本染色工艺基础表头
    const productDyeingBaseColumns = [
      {
        prop: 'dyeingProcess',
        label: '染色工艺',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          const dyeingType = {
            'W': '洗水',
            'B': '漂白',
            'H': '半漂',
            'D': '染色'
          }
          // const type = 'W'
          return dyeingType[scope.row.dyeingProcess]
        }
      },
      {
        prop: 'singleDoubleDyeingName',
        label: '单双染',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'colorDepthName',
        label: '颜色深浅',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'fabricGradeName',
        label: '布类等级',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'dyeingPrice',
        label: '染色工艺价格',
        minWidth: '120',
        components: {
          recalculation
        },
        componentsOptions: {
          isFlag: false,
          prop: 'dyeingPrice',
          text: '拔印印花，染色价格增加'
        }
        // showOverflowTooltip: true,
        // formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      }
    ]
    // 生产成本染色工艺弹出框操作表头
    const productDyeingOperatesColumns = [
      {
        prop: 'dyeingAdditionalList',
        label: '附加内容',
        minWidth: '80',
        components: { viewWithClear },
        handle: (scope, from, formDatas, setFormDatas) => {
          if (scope.row.dyeingProcess === 'D') {
            this.PopDialogHandle(this.productDyeingAdditionPopOptions, '请选择染色附加')
            this.productDyeingAdditionPopOptions.formDatas = formDatas
            this.productDyeingAdditionPopOptions.formDatas.index = scope.$index
            this.getDyeingAdditionalInfoPage({}, scope.row.dyeingAdditionalList)
          }
        },
        clearHandle: (scope) => {
          this.$confirm('此操作将删除染色附加数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.$set(this.dyeingTechList[scope.$index], 'dyeingAdditionalList', [])
            this.totalDataList[this.editableTabsValue].dyeingTechList[scope.$index].dyeingAdditionalList = this.dyeingTechList[scope.$index].dyeingAdditionalList
          })
        },
        formater: (scope) => {
          return scope.row.dyeingProcess === 'D' ? `<span >${(scope.row[scope.column.property] && scope.row[scope.column.property].length !== 0) ? scope.row[scope.column.property][0].additionalContent : '请选择'}</span>` : `<span style="color: #666;">染色工艺为染色时才可选择</span>`
        }
      },
      {
        prop: 'additionalContentPrice',
        label: '附加内容价格',
        width: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return (scope.row.dyeingAdditionalList && scope.row.dyeingAdditionalList.length !== 0) ? '￥' + scope.row.dyeingAdditionalList[0].additionalContentPrice : '￥' + 0
        }
      },
      {
        prop: 'colorPct',
        label: '颜色占比',
        width: '100',
        components: {
          proportion
        },
        componentsOptions: {
          type: 'colorPct'
        }
      },
      {
        prop: 'dyeingLossList',
        label: '染色损耗百分比',
        width: '120',
        components: { viewWithClear },
        handle: (scope, form, formDatas, setFormDatas) => {
          this.productDyeingLossPop(scope.$index)
        },
        clearHandle: (scope) => {
          this.$confirm('此操作将删除染色损耗百分比数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.$set(this.dyeingTechList[scope.$index], 'dyeingLossList', [])
            this.totalDataList[this.editableTabsValue].dyeingTechList[scope.$index].dyeingLossList = []
          })
        },
        formater: (scope) => {
          return `<span >${(scope.row[scope.column.property] && scope.row[scope.column.property].length !== 0) ? scope.row[scope.column.property][0].dyeingFinishedLossPct + '%' : '请选择'}</span>`
        }
      }
    ]
    // 生产成本染色工艺弹出框表头
    const productDyeingColumns = [
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
          return (this.productDyeingPagination.currentPage - 1) * this.productDyeingPagination.pageSize + scope.$index + 1
        }
      },
      ...productDyeingVieweColumns
    ]
    // 生产成本染色工艺页面显示表头
    const productDyeingViewColumns = [
      ...productDyeingBaseColumns,
      ...productDyeingOperatesColumns
    ]
    // 生产成本染色工艺弹出框分页
    const productDyeingPagination = {
      currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getDyeingInfoPage({ ...this.$refs.dyeing.$children[0].formDatas, pageSize: this.productDyeingPagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        //
        this.$set(this.spunPagination, 'currentPage', 1)
        this.getDyeingInfoPage({ pageNum: 1, pageSize: val })
      }
    }
    // 生产成本染色工艺弹出框
    const productDyeingPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1240px',
      ok: params => {
        if (this.type === 'add') {
          if (this.productDyeingColumns[0].componentsOptions.radio) {
            this.dyeingTechList.push({ ...this.productDyeingColumns[0].componentsOptions.radioData, colorPct: '' })
            this.totalDataList[this.editableTabsValue].dyeingTechList = this.dyeingTechList
          }
        } else if (this.type === 'replace') {
          if (this.productDyeingColumns[0].componentsOptions.radio) {
            this.dyeingTechList.splice(this.rowIndex, 1, { ...this.productDyeingColumns[0].componentsOptions.radioData, colorPct: '' })
            this.totalDataList[this.editableTabsValue].dyeingTechList = this.dyeingTechList
          }
        }
        this.closePopDialogHandle(this.productDyeingPopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.productDyeingPopOptions)
        // this.$set(this.columnsInfos[0].componentsOptions, 'radio', null)
      },
      close: () => {
        this.$set(this.productDyeingColumns[0].componentsOptions, 'radio', null)
        this.$set(this.productDyeingPopOptions.formDatas, 'radio', null)
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
          prop: 'dyeingProcess',
          itemType: 'select',
          valueType: 'object',
          itemStyle: { width: '25%', 'marginRight': 0 },
          label: '染色工艺:',
          filterable: true,
          dataSource: [
            {
              label: '洗水',
              value: 'W'
            },
            {
              label: '漂白',
              value: 'B'
            },
            {
              label: '半漂',
              value: 'H'
            },
            {
              label: '染色',
              value: 'D'
            }
          ],
          change: (object, form, formDatas) => { this.getDyeingInfoPage(formDatas) }
        },
        {
          prop: 'singleDoubleDyeing',
          itemType: 'select',
          valueType: 'object',
          itemStyle: { width: '25%', 'marginRight': 0 },
          filterable: true,
          label: '单双染:',
          dataSource: [],
          change: (object, form, formDatas) => { this.getDyeingInfoPage(formDatas) }
        },
        {
          prop: 'colorDepth',
          itemType: 'select',
          valueType: 'object',
          itemStyle: { width: '25%', 'marginRight': 0 },
          label: '颜色深浅:',
          labelWidth: '100px',
          filterable: true,
          dataSource: [],
          change: (object, form, formDatas) => { this.getDyeingInfoPage(formDatas) }
        },
        {
          prop: 'fabricGrade',
          itemType: 'select',
          valueType: 'object',
          itemStyle: { width: '25%', 'marginRight': 0 },
          filterable: true,
          label: '布类等级:',
          dataSource: [],
          change: (object, form, formDatas) => { this.getDyeingInfoPage(formDatas) }
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
          columns: productDyeingColumns,
          pagination: productDyeingPagination
        }
      ]
    }
    // 生产成本染色附加弹出框基础表头
    const productDyeingAdditionBaseColumns = [
      {
        prop: 'dyeingTechType',
        label: '染色工艺',
        minWidth: '80',
        valueType: 'object',
        showOverflowTooltip: true,
        formater: scope => {
          const dyeingType = {
            'W': '洗水',
            'B': '漂白',
            'H': '半漂',
            'D': '染色'
          }
          // const type = 'D'
          return dyeingType[scope.row.dyeingTechType]
        }
      },
      {
        prop: 'additionalContent',
        label: '附加内容',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'additionalContentPrice',
        label: '附加内容价格',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      }
    ]
    // 生产成本染色附加弹出框表头
    const productDyeingAdditionColumns = [
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
          return (this.productDyeingAdditionPagination.currentPage - 1) * this.productDyeingAdditionPagination.pageSize + scope.$index + 1
        }
      },
      ...productDyeingAdditionBaseColumns
    ]
    // 生产成本染色附加弹出框分页
    const productDyeingAdditionPagination = {
      currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getDyeingAdditionalInfoPage({ pageSize: this.productDyeingPagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        //
        this.$set(this.spunPagination, 'currentPage', 1)
        this.getDyeingAdditionalInfoPage({ pageNum: 1, pageSize: val })
      }
    }
    // 生产成本染色附加弹出框
    const productDyeingAdditionPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1240px',
      ok: (params, form, formDatas, setFormDatas) => {
        if (this.productDyeingAdditionColumns[0].componentsOptions.radio) {
          this.$set(this.dyeingTechList[params.index], 'dyeingAdditionalList', [{ ...this.productDyeingAdditionColumns[0].componentsOptions.radioData }])
          this.totalDataList[this.editableTabsValue].dyeingTechList[params.index].dyeingAdditionalList = [{ ...this.productDyeingAdditionColumns[0].componentsOptions.radioData }]
        }
        this.closePopDialogHandle(this.productDyeingAdditionPopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.productDyeingAdditionPopOptions)
        // this.$set(this.columnsInfos[0].componentsOptions, 'radio', null)
      },
      close: () => {
        this.$set(this.productDyeingAdditionColumns[0].componentsOptions, 'radio', null)
        this.$set(this.productDyeingAdditionPopOptions.formDatas, 'radio', null)
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
          prop: 'tableForm',
          headerCellStyle: { 'background-color': '#F5F7FA' },
          className: 'pop-table',
          itemType: 'table-form',
          label: '',
          labelWidth: '0',
          itemStyle: { width: '100%', 'marginRight': 0 },
          dataSource: [],
          tooltipEffect: 'dark',
          columns: productDyeingAdditionColumns,
          pagination: productDyeingAdditionPagination
        }
      ]
    }
    // 生产成本染色损耗弹出框基础表头
    const productDyeingLossBaseColumns = [
      {
        prop: 'dyeingTechType',
        label: '染色工艺',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          const dyeingType = {
            'W': '洗水',
            'B': '漂白',
            'H': '半漂',
            'D': '染色'
          }
          return dyeingType[scope.row.dyeingTechType]
        }
      },
      {
        prop: 'colorDepthName',
        label: '颜色深浅',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'maxWeight',
        label: '重量区间（千克）',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          return `<span>${scope.row.minWeight !== null ? scope.row.minWeight : ''}${scope.row.minWeight !== null && scope.row.maxWeight !== null ? '~' : ''}${scope.row.maxWeight !== null ? scope.row.maxWeight : ''}</span>`
        }
      },
      {
        prop: 'dyeingFinishedLossPct',
        label: '染色损耗百分比',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? scope.row[scope.column.property] + '%' : 0 + '%'
      }
    ]
    // 生产成本染色损耗弹出框表头
    const productDyeingLossColumns = [
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
          return (this.productDyeingLossPagination.currentPage - 1) * this.productDyeingLossPagination.pageSize + scope.$index + 1
        }
      },
      ...productDyeingLossBaseColumns
    ]
    // 生产成本染色损耗弹出框分页
    const productDyeingLossPagination = {
      // currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getDyeingLossInfoPage({ ...this.$refs.dyeingLoss.$children[0].formDatas, pageSize: this.productDyeingPagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        //
        this.$set(this.spunPagination, 'currentPage', 1)
        this.getDyeingLossInfoPage({ pageNum: 1, pageSize: val })
      }
    }
    // 生产成本染色损耗弹出框
    const productDyeingLossPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1240px',
      ok: params => {
        if (this.productDyeingLossColumns[0].componentsOptions.radio) {
          this.$set(this.dyeingTechList[params.index], 'dyeingLossList', [{ ...this.productDyeingLossColumns[0].componentsOptions.radioData }])
          this.totalDataList[this.editableTabsValue].dyeingTechList[params.index].dyeingLossList = [{ ...this.productDyeingLossColumns[0].componentsOptions.radioData }]
        }
        this.closePopDialogHandle(this.productDyeingLossPopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.productDyeingLossPopOptions)
        // this.$set(this.columnsInfos[0].componentsOptions, 'radio', null)
      },
      close: () => {
        this.$set(this.productDyeingLossColumns[0].componentsOptions, 'radio', null)
        this.$set(this.productDyeingLossPopOptions.formDatas, 'radio', null)
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
          prop: 'dyeingTechType',
          itemType: 'select',
          label: '染色工艺:',
          filterable: true,
          valueType: 'object',
          itemStyle: { width: '25%', 'marginRight': 0 },
          dataSource: [
            {
              label: '洗水',
              value: 'W'
            },
            {
              label: '漂白',
              value: 'B'
            },
            {
              label: '半漂',
              value: 'H'
            },
            {
              label: '染色',
              value: 'D'
            }
          ],
          change: (object, form, formDatas) => { this.getDyeingLossInfoPage(formDatas) }
        },
        {
          prop: 'colorDepth',
          itemType: 'select',
          filterable: true,
          label: '颜色深浅:',
          valueType: 'object',
          itemStyle: { width: '25%', 'marginRight': 0 },
          dataSource: [],
          change: (object, form, formDatas) => { this.getDyeingLossInfoPage(formDatas) }
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
          columns: productDyeingLossColumns,
          pagination: productDyeingLossPagination
        }
      ]
    }
    // 生产成本后整/后整损耗弹出框基础表头
    const productPostIntegrationLossBaseColumns = [
      {
        prop: 'afterfinishTechName',
        label: '后整工艺',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'fabricGradeName',
        label: '布类等级',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'afterfinishTechPrice',
        label: '后整工艺价格',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      },
      {
        prop: 'afterfinishLossPct',
        label: '后整工艺损耗百分比',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? scope.row[scope.column.property] + '%' : 0 + '%'
      }
    ]
    // 生产成本后整/后整损耗弹出框表头
    const productPostIntegrationLossColumns = [
      {
        prop: 'id',
        label: '选择',
        width: '50',
        components: {
          checkboxButton
        },
        componentsOptions: {
          // radio: 1,
          changeMethods: (scope, formDatas) => {
            if (!formDatas.name) {
              formDatas.name = []
            }
            if (scope.row.checked) {
              if (formDatas.name.length < 10) {
                formDatas.name.push(scope.row)
              } else {
                this.$message.warning('最多显示10个')
                scope.row.checked = false
              }
            } else {
              formDatas.name.forEach((item, index) => {
                if (item.id === scope.row.id) {
                  formDatas.name.splice(index, 1)
                }
              })
            }
            this.productPostIntegrationLossPopOptions.content[4].componentsOptions.data = [...formDatas.name]
          }
        }
      },
      {
        prop: 'code',
        label: '序号',
        width: '60',
        showOverflowTooltip: true,
        formater: (scope) => {
          return (this.productPostIntegrationLossPagination.currentPage - 1) * this.productPostIntegrationLossPagination.pageSize + scope.$index + 1
        }
      },
      ...productPostIntegrationLossBaseColumns
    ]
    // 生产成本后整/后整损耗弹出框分页
    const productPostIntegrationLossPagination = {
      currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getAfterfinishLossPage({ ...this.$refs.after.$children[0].formDatas, pageSize: this.productPostIntegrationLossPagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        //
        this.$set(this.spunPagination, 'currentPage', 1)
        this.getAfterfinishLossPage({ pageNum: 1, pageSize: val })
      }
    }
    // 生产成本后整/后整损耗弹出框
    const productPostIntegrationLossPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1240px',
      ok: params => {
        if (this.type === 'add') {
          this.afterfinishLossList = []
          this.afterfinishLossList.push(...params.name)
          this.totalDataList[this.editableTabsValue].afterfinishLossList = this.afterfinishLossList
        } else if (this.type === 'replace') {
          if (this.productPostIntegrationLossColumns[0].componentsOptions.radio) {
            this.afterfinishLossList.splice(this.rowIndex, 1, this.productPostIntegrationLossColumns[0].componentsOptions.radioData)
            this.totalDataList[this.editableTabsValue].afterfinishLossList = this.afterfinishLossList
          }
        }
        this.closePopDialogHandle(this.productPostIntegrationLossPopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.productPostIntegrationLossPopOptions)
      },
      close: () => {
        this.$set(this.productPostIntegrationLossColumns[0].componentsOptions, 'radio', null)
        this.$set(this.productPostIntegrationLossPopOptions.formDatas, 'radio', null)
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
          prop: 'afterfinishTech',
          itemType: 'select',
          label: '后整工艺:',
          filterable: true,
          valueType: 'object',
          itemStyle: { width: '25%', 'marginRight': 0 },
          dataSource: [],
          change: (object, form, formDatas) => { this.getAfterfinishLossPage(formDatas) }
        },
        {
          prop: 'fabricGrade',
          itemType: 'select',
          label: '布类等级:',
          filterable: true,
          valueType: 'object',
          itemStyle: { width: '25%', 'marginRight': 0 },
          dataSource: [],
          change: (object, form, formDatas) => { this.getAfterfinishLossPage(formDatas) }
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
          columns: productPostIntegrationLossColumns,
          pagination: productPostIntegrationLossPagination
        },
        {
          prop: 'name',
          components: { drogItem },
          componentsOptions: {
            label: 'afterfinishTechName',
            data: [],
            isShow: 'add',
            onEnd: (data) => {
              this.productPostIntegrationLossPopOptions.formDatas.name = [...data]
              this.productPostIntegrationLossPopOptions.content[4].componentsOptions.data = [...data]
            },
            close: (data) => {
              this.productPostIntegrationLossPopOptions.formDatas.name = [...data]
              this.productPostIntegrationLossPopOptions.content[4].componentsOptions.data = [...data]
              this.productPostIntegrationLossPopOptions.content[3].dataSource.forEach(item => {
                item.checked = !!(data.find(itemA => {
                  return itemA.id === item.id
                }))
              })
            },
            handle: () => {

            }
          }
        }
      ]
    }
    // 生产成本功能/功能损耗弹出框基础表头
    const productFunctionLossBaseColumns = [
      {
        prop: 'functionName',
        label: '功能',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'tagsType',
        label: '吊牌',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          const type = { 'N': '无', 'D': '国内吊牌', 'T': '第三方吊牌' }
          return type[scope.row.tagsType]
        }
      },
      {
        prop: 'funTestMiddleInfo',
        label: '测试标准',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row[scope.column.property] ? scope.row[scope.column.property].map(item => item.testStandardName).join(',') : ''
        }
      },
      {
        prop: 'functionPrice',
        label: '功能价格',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      },
      {
        prop: 'functionLossPct',
        label: '功能损耗百分比',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? scope.row[scope.column.property] + '%' : 0 + '%'
      }
    ]
    // 生产成本功能/功能损耗弹出框表头
    const productFunctionLossColumns = [
      {
        prop: 'id',
        label: '选择',
        width: '50',
        components: {
          checkboxButton
        },
        componentsOptions: {
          changeMethods: (scope, formDatas) => {
            if (!formDatas.name) {
              formDatas.name = []
            }
            if (scope.row.checked) {
              if (formDatas.name.length < 6) {
                formDatas.name.push(scope.row)
              } else {
                this.$message.warning('最多显示6个')
                scope.row.checked = false
              }
            } else {
              formDatas.name.forEach((item, index) => {
                if (item.id === scope.row.id) {
                  formDatas.name.splice(index, 1)
                }
              })
            }
            this.productFunctionLossPopOptions.content[3].componentsOptions.data = [...formDatas.name]
          }
        }
      },
      {
        prop: 'code',
        label: '序号',
        width: '60',
        showOverflowTooltip: true,
        formater: (scope) => {
          return (this.productFunctionLossPagination.currentPage - 1) * this.productFunctionLossPagination.pageSize + scope.$index + 1
        }
      },
      ...productFunctionLossBaseColumns
    ]
    // 生产成本功能/功能损耗弹出框分页
    const productFunctionLossPagination = {
      // currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getFunctionLossInfoPage({ ...this.$refs.function.$children[0].formDatas, pageSize: this.productFunctionLossPagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        //
        this.$set(this.spunPagination, 'currentPage', 1)
        this.getFunctionLossInfoPage({ pageNum: 1, pageSize: val })
      }
    }
    // 生产成本功能/功能损耗弹出框
    const productFunctionLossPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1240px',
      ok: params => {
        if (this.type === 'add') {
          this.functionLossList = []
          this.functionLossList.push(...params.name)
          this.totalDataList[this.editableTabsValue].functionLossList = this.functionLossList
        } else if (this.type === 'replace') {
          if (this.productFunctionLossColumns[0].componentsOptions.radio) {
            this.functionLossList.splice(this.rowIndex, 1, this.productFunctionLossColumns[0].componentsOptions.radioData)
            this.totalDataList[this.editableTabsValue].functionLossList = this.functionLossList
          }
        }
        this.closePopDialogHandle(this.productFunctionLossPopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.productFunctionLossPopOptions)
      },
      close: () => {
        this.$set(this.productFunctionLossColumns[0].componentsOptions, 'radio', null)
        this.$set(this.productFunctionLossPopOptions.formDatas, 'radio', null)
      },
      formDatas: {
      },
      formOptions: {
        inline: true
      },
      content: [
        {
          prop: 'function',
          itemType: 'select',
          label: '功能:',
          filterable: true,
          valueType: 'object',
          itemStyle: { width: '25%', 'marginRight': 0 },
          dataSource: [],
          change: (object, form, formDatas) => { this.getFunctionLossInfoPage(formDatas) }
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
          columns: productFunctionLossColumns,
          pagination: productFunctionLossPagination
        },
        {
          prop: 'name',
          components: { drogItem },
          componentsOptions: {
            label: 'functionName',
            data: [],
            isShow: 'add',
            onEnd: (data) => {
              this.productFunctionLossPopOptions.formDatas.name = [...data]
              this.productFunctionLossPopOptions.content[3].componentsOptions.data = [...data]
            },
            close: (data) => {
              this.productFunctionLossPopOptions.formDatas.name = [...data]
              this.productFunctionLossPopOptions.content[3].componentsOptions.data = [...data]
              this.productFunctionLossPopOptions.content[2].dataSource.forEach(item => {
                item.checked = !!(data.find(itemA => {
                  return itemA.id === item.id
                }))
              })
            },
            handle: () => {
            }
          }
        }
      ]
    }
    // 生产成本主要印花带印花证书表头
    const productMainPrintingBaseColumns = [
      {
        prop: 'printingName',
        label: '印花工艺',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'minPrintingareaPercent',
        label: '印花面积百分比区间',
        minWidth: '180',
        showOverflowTooltip: true,
        formater: scope => {
          return `<span>${scope.row.minPrintingareaPct !== null ? scope.row.minPrintingareaPct + '%' : ''}${scope.row.minPrintingareaPct !== null && scope.row.maxPrintingareaPct !== null ? '~' : ''}${scope.row.maxPrintingareaPct !== null ? scope.row.maxPrintingareaPct + '%' : ''}</span>`
        }
      },
      {
        prop: 'additionalPrice',
        label: '印花颜色数量区间（个）',
        minWidth: '200',
        showOverflowTooltip: true,
        formater: scope => {
          return `<span>${scope.row.minPrintingNumber !== null ? scope.row.minPrintingNumber : ''}${scope.row.minPrintingNumber !== null && scope.row.maxPrintingNumber !== null ? '~' : ''}${scope.row.maxPrintingNumber !== null ? scope.row.maxPrintingNumber : ''}</span>`
        }
      },
      {
        prop: 'printingPrice',
        label: '印花工艺价格',
        minWidth: '120',
        components: {
          recalculation
        },
        componentsOptions: {
          isFlag: false,
          prop: 'printingPrice',
          text: '拔印印花，染色价格增加'
        },
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      }
    ]
    // 生产成本主要印花基础表头
    // 生产成本主要印花弹出框基础表头
    const otherProductMainPrintingViewColumns = [
      {
        prop: 'printingName',
        label: '印花工艺',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'minPrintingareaPercent',
        label: '印花面积百分比区间',
        minWidth: '180',
        showOverflowTooltip: true,
        formater: scope => {
          return `<span>${scope.row.minPrintingareaPct !== null ? scope.row.minPrintingareaPct + '%' : ''}${scope.row.minPrintingareaPct !== null && scope.row.maxPrintingareaPct !== null ? '~' : ''}${scope.row.maxPrintingareaPct !== null ? scope.row.maxPrintingareaPct + '%' : ''}</span>`
        }
      },
      {
        prop: 'additionalPrice',
        label: '印花颜色数量区间（个）',
        minWidth: '200',
        showOverflowTooltip: true,
        formater: scope => {
          return `<span>${scope.row.minPrintingNumber !== null ? scope.row.minPrintingNumber : ''}${scope.row.minPrintingNumber !== null && scope.row.maxPrintingNumber !== null ? '~' : ''}${scope.row.maxPrintingNumber !== null ? scope.row.maxPrintingNumber : ''}</span>`
        }
      },
      {
        prop: 'printingPrice',
        label: '印花工艺价格',
        minWidth: '120',
        components: {
          recalculation
        },
        componentsOptions: {
          isFlag: false,
          prop: 'printingPrice',
          text: '克重小于150，印花工艺价格增加'
        }
      },
      {
        prop: 'printingCertList',
        label: '印花证书',
        width: '80',
        components: { viewWithClear },
        clearHandle: (scope) => {
          this.$confirm('此操作将删除印花证书数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.$set(this.majorPrintingTechList[0], 'printingCertList', [])
            this.totalDataList[this.editableTabsValue].majorPrintingTechList[0].printingCertList = []
          })
        },
        handle: (scope, from, fromDatas, setFormDatas) => {
          this.PopDialogHandle(this.productPrintingCertificatePopOptions, '请选择印花证书')
          const newArray = scope.row.printingCertList ? scope.row.printingCertList.map(item => { return { ...item } }) : []
          this.$set(this.productPrintingCertificatePopOptions, 'formDatas', { ...fromDatas, name: [...newArray] })
          this.getPrintingCertInfoPage({})
        },
        formater: (scope) => {
          return `<span >${(scope.row[scope.column.property] && scope.row[scope.column.property].length !== 0) ? scope.row[scope.column.property].map(item => item.printingCertName).join(';') : '请选择'}</span>`
        }
      },
      {
        prop: 'yarnCertificate',
        label: '印花证书价格合计',
        width: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return (scope.row.printingCertList && scope.row.printingCertList.length !== 0) ? '￥' + scope.row.printingCertList.map(item => item.printingCertPrice).reduce((total, item) => total + item) : '￥' + 0
        }
      },
      {
        prop: 'printingLossList',
        label: '印花损耗百分比',
        width: '120',
        components: { viewWithClear },
        clearHandle: (scope) => {
          this.$confirm('此操作将删除印花损耗百分比数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.$set(this.majorPrintingTechList[0], 'printingLossList', [])
            this.totalDataList[this.editableTabsValue].majorPrintingTechList[0].printingLossList = []
          })
        },
        handle: (scope, from, fromDatas, setFormDatas) => {
          this.productPrintingLossPop()
        },
        formater: (scope) => {
          return `<span >${(scope.row[scope.column.property] && scope.row[scope.column.property].length !== 0) ? scope.row[scope.column.property][0].printingLossPct + '%' : '请选择'}</span>`
        }
      },
      {
        prop: 'printingAdditionalList',
        label: '闪粉价格',
        width: '120',
        components: { viewWithClear },
        clearHandle: (scope) => {
          this.$confirm('此操作将删除闪粉价格数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            const fIndex = this.majorPrintingTechList[0].printingAdditionalList.findIndex(item => {
              return item.printingAdditionalType === 'G'
            })
            this.majorPrintingTechList[0].printingAdditionalList.splice(fIndex, 1)
            this.totalDataList[this.editableTabsValue].majorPrintingTechList[0].printingAdditionalList = this.majorPrintingTechList[0].printingAdditionalList
          })
        },
        handle: (scope, from, fromDatas, setFormDatas) => {
          this.productPrintingFlashPowderPop()
        },
        formater: (scope) => {
          const item = this.majorPrintingTechList[0].printingAdditionalList && this.majorPrintingTechList[0].printingAdditionalList.find(item => {
            return item.printingAdditionalType === 'G'
          })
          return `<span >${item ? '￥' + item.additionalPrice : '请选择'}</span>`
        }
      },
      {
        prop: 'printingAdditionalList1',
        label: '荧光价格',
        width: '120',
        components: { viewWithClear },
        clearHandle: (scope) => {
          this.$confirm('此操作将删除荧光价格数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            const fIndex = this.majorPrintingTechList[0].printingAdditionalList.findIndex(item => {
              return item.printingAdditionalType === 'F'
            })
            this.majorPrintingTechList[0].printingAdditionalList.splice(fIndex, 1)
            this.totalDataList[this.editableTabsValue].majorPrintingTechList[0].printingAdditionalList = this.majorPrintingTechList[0].printingAdditionalList
          })
        },
        handle: (scope, from, fromDatas, setFormDatas) => {
          this.productPrintingFluorescencePop()
        },
        formater: (scope) => {
          const item = this.majorPrintingTechList[0].printingAdditionalList && this.majorPrintingTechList[0].printingAdditionalList.find(item => {
            return item.printingAdditionalType === 'F'
          })
          return `<span >${item ? '￥' + item.additionalPrice : '请选择'}</span>`
        }
      },
      {
        prop: 'additionalPrice2',
        label: '凸桨价格',
        width: '120',
        components: { viewWithClear },
        clearHandle: (scope) => {
          this.$confirm('此操作将删除凸桨价格数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            const fIndex = this.majorPrintingTechList[0].printingAdditionalList.findIndex(item => {
              return item.printingAdditionalType === 'C'
            })
            this.majorPrintingTechList[0].printingAdditionalList.splice(fIndex, 1)
            this.totalDataList[this.editableTabsValue].majorPrintingTechList[0].printingAdditionalList = this.majorPrintingTechList[0].printingAdditionalList
          })
        },
        handle: (scope, from, fromDatas, setFormDatas) => {
          this.productPrintingBumpPop()
        },
        formater: (scope) => {
          const item = this.majorPrintingTechList[0].printingAdditionalList && this.majorPrintingTechList[0].printingAdditionalList.find(item => {
            return item.printingAdditionalType === 'C'
          })
          return `<span >${item ? '￥' + item.additionalPrice : '请选择'}</span>`
        }
      },
      {
        prop: 'additionalPrice3',
        label: '夜光桨价格',
        width: '120',
        components: { viewWithClear },
        clearHandle: (scope) => {
          this.$confirm('此操作将删除夜光桨价格数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            const fIndex = this.majorPrintingTechList[0].printingAdditionalList.findIndex(item => {
              return item.printingAdditionalType === 'L'
            })
            this.majorPrintingTechList[0].printingAdditionalList.splice(fIndex, 1)
            this.totalDataList[this.editableTabsValue].majorPrintingTechList[0].printingAdditionalList = this.majorPrintingTechList[0].printingAdditionalList
          })
        },
        handle: (scope, from, fromDatas, setFormDatas) => {
          this.productPrintingNightGlowPulpPop()
        },
        formater: (scope) => {
          const item = this.majorPrintingTechList[0].printingAdditionalList && this.majorPrintingTechList[0].printingAdditionalList.find(item => {
            return item.printingAdditionalType === 'L'
          })
          return `<span >${item ? '￥' + item.additionalPrice : '请选择'}</span>`
        }
      }
    ]
    const productMainPrintingViewColumns = [
      ...productMainPrintingBaseColumns,
      {
        prop: 'printingCertList',
        label: '印花证书',
        width: '150',
        showOverflowTooltip: true,
        handle: (scope, from, fromDatas, setFormDatas) => {
          this.PopDialogHandle(this.productPrintingCertificatePopOptions, '请选择印花证书')
          const newArray = scope.row.printingCertList ? scope.row.printingCertList.map(item => { return { ...item } }) : []
          this.$set(this.productPrintingCertificatePopOptions, 'formDatas', { ...fromDatas, name: [...newArray] })
          this.getPrintingCertInfoPage({})
        },
        formater: (scope) => {
          return `<span >${(scope.row[scope.column.property] && scope.row[scope.column.property].length !== 0) ? scope.row[scope.column.property].map(item => item.printingCertName).join(';') : '请选择'}</span>`
        }
      },
      {
        prop: 'yarnCertificate',
        label: '印花证书价格合计',
        width: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return (scope.row.printingCertList && scope.row.printingCertList.length !== 0) ? '￥' + scope.row.printingCertList.map(item => item.printingCertPrice).reduce((total, item) => total + item) : '￥' + 0
        }
      }
    ]
    // 生产成本主要印花弹出框表头
    const productMainPrintingColumns = [
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
          return (this.productMainPrintingPagination.currentPage - 1) * this.productMainPrintingPagination.pageSize + scope.$index + 1
        }
      },
      {
        prop: 'printingName',
        label: '印花工艺',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'minPrintingareaPercent',
        label: '印花面积百分比区间',
        minWidth: '180',
        showOverflowTooltip: true,
        formater: scope => {
          return `<span>${scope.row.minPrintingareaPct !== null ? scope.row.minPrintingareaPct + '%' : ''}${scope.row.minPrintingareaPct !== null && scope.row.maxPrintingareaPct !== null ? '~' : ''}${scope.row.maxPrintingareaPct !== null ? scope.row.maxPrintingareaPct + '%' : ''}</span>`
        }
      },
      {
        prop: 'additionalPrice',
        label: '印花颜色数量区间（个）',
        minWidth: '200',
        showOverflowTooltip: true,
        formater: scope => {
          return `<span>${scope.row.minPrintingNumber !== null ? scope.row.minPrintingNumber : ''}${scope.row.minPrintingNumber !== null && scope.row.maxPrintingNumber !== null ? '~' : ''}${scope.row.maxPrintingNumber !== null ? scope.row.maxPrintingNumber : ''}</span>`
        }
      },
      {
        prop: 'printingPrice',
        label: '印花工艺价格',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      }
    ]
    // 生产成本主要印花弹出框分页
    const productMainPrintingPagination = {
      // currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getPrintingTechInfoInfoPage({ ...this.$refs.mainPrinting.$children[0].formDatas, pageSize: this.productMainPrintingPagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        //
        this.$set(this.spunPagination, 'currentPage', 1)
        this.getPrintingTechInfoInfoPage({ pageNum: 1, pageSize: val })
      }
    }
    // 生产成本主要印花工艺弹出框
    const productMainPrintingPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1240px',
      ok: params => {
        if (this.productMainPrintingColumns[0].componentsOptions.radio) {
          this.majorPrintingTechList = [{ ...this.productMainPrintingColumns[0].componentsOptions.radioData, printingAdditionalList: [] }]
          this.totalDataList[this.editableTabsValue].majorPrintingTechList = this.majorPrintingTechList
        }
        this.closePopDialogHandle(this.productMainPrintingPopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.productMainPrintingPopOptions)
      },
      close: () => {
        this.$set(this.productMainPrintingColumns[0].componentsOptions, 'radio', null)
        this.$set(this.productMainPrintingPopOptions.formDatas, 'radio', null)
      },
      formDatas: {
        tabs: '1',
        techType: 'M'
      },
      formOptions: {
        inline: true
      },
      content: [
        {
          prop: 'printing',
          itemType: 'select',
          filterable: true,
          label: '印花工艺:',
          itemStyle: { width: '25%', 'marginRight': 0 },
          dataSource: [],
          change: (object, form, formDatas) => { this.getPrintingTechInfoInfoPage(formDatas) },
          valueType: 'object',
          clearable: true
        },
        {
          itemType: 'view',
          text: ``,
          style: lineStyle
        },
        {
          prop: 'tabs',
          itemType: 'tabs',
          label: '',
          itemStyle: { 'width': '100%', 'marginRight': 0, 'marginBottom': 0 },
          dataSource: [
            {
              label: '主要',
              value: '1'
            }
          ]
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
          columns: productMainPrintingColumns,
          pagination: productMainPrintingPagination
        }
      ]
    }
    // 生产成本主要印花证书表头
    const printingCertificateColumns = [
      {
        prop: 'id',
        label: '选择',
        width: '50',
        components: {
          checkboxButton
        },
        componentsOptions: {
          // radio: 1,
          changeMethods: (scope, formDatas) => {
            if (scope.row.checked) {
              if (formDatas.name.length < 4) {
                formDatas.name.push(scope.row)
              } else {
                this.$message.warning('最多显示4个')
                scope.row.checked = false
              }
            } else {
              formDatas.name.forEach((item, index) => {
                if (item.id === scope.row.id) {
                  formDatas.name.splice(index, 1)
                }
              })
            }
          }
        }
      },
      {
        prop: 'code',
        label: '序号',
        width: '60',
        showOverflowTooltip: true,
        formater: (scope) => {
          return (this.printingCertificatePagination.currentPage - 1) * this.printingCertificatePagination.pageSize + scope.$index + 1
        }
      },
      {
        prop: 'printingCertName',
        label: '印花证书',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'printingCertPrice',
        label: '印花证书价格',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      }
    ]
    // 生产成本主要印花证书分页内容
    const printingCertificatePagination = {
      // currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getPrintingCertInfoPage({ pageSize: this.printingCertificatePagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        //
        this.$set(this.spunPagination, 'currentPage', 1)
        this.getPrintingCertInfoPage({ pageNum: 1, pageSize: val })
      }
    }
    // 生产成本染色工艺主要印花印花证书弹出框
    const productPrintingCertificatePopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1240px',
      ok: params => {
        this.$set(this.majorPrintingTechList[0], 'printingCertList', params.name)

        this.totalDataList[this.editableTabsValue].majorPrintingTechList[0].printingCertList = params.name
        this.closePopDialogHandle(this.productPrintingCertificatePopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.productPrintingCertificatePopOptions)
      },
      close: () => {
      },
      formDatas: {
        name: []
      },
      formOptions: {
      },
      content: [
        {
          prop: 'printingCertificate',
          itemType: 'table-form',
          className: 'pop-table',
          headerCellStyle: { 'background-color': '#F5F7FA' },
          label: '',
          labelWidth: '0',
          dataSource: [],
          tooltipEffect: 'dark',
          columns: printingCertificateColumns,
          pagination: printingCertificatePagination
        },
        {
          prop: 'name',
          itemType: 'itemview',
          label: '已选择',
          renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
            return `<span style="color: #0986FF;">${value.map(item => item.printingCertName).join(';')}</span>`
          }
        }
      ]
    }
    // 生产成本次要印花基础表头
    const otherProductSecondaryPrintingBaseColumns = [
      {
        prop: 'printingName',
        label: '印花工艺',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'printingPrice',
        label: '印花工艺价格',
        minWidth: '80',
        components: {
          recalculation
        },
        componentsOptions: {
          isFlag: false,
          prop: 'printingPrice',
          text: '克重小于150，印花工艺价格增加'
        }
        // showOverflowTooltip: true
        // formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      }
    ]
    // 生产成本次要印花弹出框基础表头
    const productSecondaryPrintingBaseColumns = [
      {
        prop: 'printingName',
        label: '印花工艺',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'printingPrice',
        label: '印花工艺价格',
        minWidth: '80',
        components: {
          recalculation
        },
        componentsOptions: {
          isFlag: false,
          prop: 'printingPrice',
          text: '拔印印花，染色价格增加'
        },
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      }
    ]
    // 生产成本次要印花弹出框表头
    const productSecondaryPrintingColumns = [
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
          return (this.productSecondaryPrintingPagination.currentPage - 1) * this.productSecondaryPrintingPagination.pageSize + scope.$index + 1
        }
      },
      {
        prop: 'printingName',
        label: '印花工艺',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'printingPrice',
        label: '印花工艺价格',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      }
    ]
    // 生产成本次要印花弹出框分页
    const productSecondaryPrintingPagination = {
      currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getPrintingTechInfoInfoPage({ ...this.$refs.secondaryPrinting.$children[0].formDatas, pageSize: this.productSecondaryPrintingPagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        //
        this.$set(this.spunPagination, 'currentPage', 1)
        this.getPrintingTechInfoInfoPage({ pageNum: 1, pageSize: val })
      }
    }
    // 生产成本次要印花工艺弹出框
    const productSecondaryPrintingPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1240px',
      ok: params => {
        if (this.type === 'add') {
          if (this.productSecondaryPrintingColumns[0].componentsOptions.radio) {
            (this.majorPrintingTechList[0].minorPrintingTechList && this.majorPrintingTechList[0].minorPrintingTechList.length !== 0) ? this.$set(this.majorPrintingTechList[0], 'minorPrintingTechList', [...this.majorPrintingTechList[0].minorPrintingTechList, this.productSecondaryPrintingColumns[0].componentsOptions.radioData]) : this.$set(this.majorPrintingTechList[0], 'minorPrintingTechList', [this.productSecondaryPrintingColumns[0].componentsOptions.radioData])
            this.totalDataList[this.editableTabsValue].majorPrintingTechList[0].minorPrintingTechList = this.majorPrintingTechList[0].minorPrintingTechList
          }
        } else if (this.type === 'replace') {
          this.majorPrintingTechList[0].minorPrintingTechList && this.majorPrintingTechList[0].minorPrintingTechList.forEach((item, index) => {
            if (this.rowData.id === item.id) {
              this.rowIndex = index
            }
          })
          if (this.productSecondaryPrintingColumns[0].componentsOptions.radio) {
            this.majorPrintingTechList[0].minorPrintingTechList.splice(this.rowIndex, 1, this.productSecondaryPrintingColumns[0].componentsOptions.radioData)
            this.totalDataList[this.editableTabsValue].majorPrintingTechList[0].minorPrintingTechList = this.majorPrintingTechList[0].minorPrintingTechList
          }
        }
        this.closePopDialogHandle(this.productSecondaryPrintingPopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.productSecondaryPrintingPopOptions)
        // this.$set(this.columnsInfos[0].componentsOptions, 'radio', null)
      },
      close: () => {
        this.$set(this.productSecondaryPrintingColumns[0].componentsOptions, 'radio', null)
        this.$set(this.productSecondaryPrintingPopOptions.formDatas, 'radio', null)
      },
      formDatas: {
        tabs: '1',
        techType: 'S'
      },
      formOptions: {
        labelWidth: '100px',
        inline: true
      },
      content: [
        {
          prop: 'printing',
          itemType: 'select',
          filterable: true,
          label: '印花工艺:',
          itemStyle: { width: '25%', 'marginRight': 0 },
          dataSource: [],
          change: (object, form, formDatas) => { this.getPrintingTechInfoInfoPage(formDatas) },
          valueType: 'object',
          clearable: true
        },
        {
          itemType: 'view',
          text: ``,
          style: lineStyle
        },
        {
          prop: 'tabs',
          itemType: 'tabs',
          label: '',
          itemStyle: { 'width': '100%', 'marginRight': 0, 'marginBottom': 0 },
          dataSource: [
            {
              label: '次要',
              value: '1'
            }
          ]
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
          columns: productSecondaryPrintingColumns,
          pagination: productSecondaryPrintingPagination
        }
      ]
    }
    // 生产成本印花附加闪粉弹出框基础表头
    const productPrintingFlashPowderBaseColumns = [
      {
        prop: 'minAreaPercent',
        label: '闪粉面积区间',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => {
          return `<span>${scope.row.minAreaPct ? scope.row.minAreaPct + '%' : ''}~${scope.row.maxAreaPct ? scope.row.maxAreaPct + '%' : ''}</span>`
        }
      },
      {
        prop: 'additionalPrice',
        label: '闪粉价格',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      }
    ]
    // 生产成本印花附加闪粉弹出框表头
    const productPrintingFlashPowderColumns = [
      {
        prop: 'id',
        label: '选择',
        width: '50',
        components: {
          radioButton
        },
        componentsOptions: {
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
          return (this.productPrintingFlashPowderPagination.currentPage - 1) * this.productPrintingFlashPowderPagination.pageSize + scope.$index + 1
        }
      },
      ...productPrintingFlashPowderBaseColumns
    ]
    // 生产成本印花附加闪粉弹出框分页
    const productPrintingFlashPowderPagination = {
      currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getPrintingAdditionalInfoPage({ pageSize: this.productPrintingFlashPowderPagination.pageSize || 5, pageNum: val, printingAdditionalType: 'G' })
      },
      sizeChange: val => {
        //
        this.$set(this.spunPagination, 'currentPage', 1)
        this.getPrintingAdditionalInfoPage({ pageNum: 1, pageSize: val, printingAdditionalType: 'G' })
      }
    }
    // 生产成本印花附加闪粉弹出框
    const productPrintingFlashPowderPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1240px',
      ok: params => {
        // if (this.type === 'add') {
        if (this.productPrintingFlashPowderColumns[0].componentsOptions.radio) {
          this.majorPrintingTechList[0].printingAdditionalList || (this.majorPrintingTechList[0].printingAdditionalList = [])
          const fIndex = this.majorPrintingTechList[0].printingAdditionalList.findIndex(item => {
            return this.productPrintingFlashPowderColumns[0].componentsOptions.radioData.printingAdditionalType === item.printingAdditionalType
          })
          fIndex === -1 ? this.majorPrintingTechList[0].printingAdditionalList.push(this.productPrintingFlashPowderColumns[0].componentsOptions.radioData)
            : this.majorPrintingTechList[0].printingAdditionalList.splice(fIndex, 1, this.productPrintingFlashPowderColumns[0].componentsOptions.radioData)
          this.totalDataList[this.editableTabsValue].majorPrintingTechList[0].printingAdditionalList = this.majorPrintingTechList[0].printingAdditionalList
          console.log(this.productPrintingFlashPowderColumns[0].componentsOptions.radioData, this.majorPrintingTechList[0].printingAdditionalList)
        }
        // } else if (this.type === 'replace') {
        //   if (this.productPrintingFlashPowderColumns[0].componentsOptions.radio) {
        //     let selectIndex = 0
        //     this.majorPrintingTechList[0].printingAdditionalList && this.majorPrintingTechList[0].printingAdditionalList.forEach((item, index) => {
        //       if (this.productPrintingFlashPowderColumns[0].componentsOptions.radioData.printingAdditionalType === item.printingAdditionalType) {
        //         selectIndex = index
        //       }
        //     })
        //     if (this.majorPrintingTechList && this.majorPrintingTechList[0] && this.majorPrintingTechList[0].printingAdditionalList) {
        //       this.majorPrintingTechList && this.majorPrintingTechList[0] && this.majorPrintingTechList[0].printingAdditionalList.splice(selectIndex, 1, this.productPrintingFlashPowderColumns[0].componentsOptions.radioData)
        //     }
        //     this.totalDataList[this.editableTabsValue].majorPrintingTechList[0].printingAdditionalList = this.majorPrintingTechList[0].printingAdditionalList
        //   }
        // }
        this.closePopDialogHandle(this.productPrintingFlashPowderPopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.productPrintingFlashPowderPopOptions)
      },
      close: () => {
        this.$set(this.productPrintingFlashPowderColumns[0].componentsOptions, 'radio', null)
        this.$set(this.productPrintingFlashPowderPopOptions.formDatas, 'radio', null)
      },
      formDatas: {
        tabs: '1'
      },
      formOptions: {
        labelWidth: '100px',
        inline: true
      },
      content: [
        {
          prop: 'tabs',
          itemType: 'tabs',
          label: '',
          itemStyle: { 'width': '100%', 'marginRight': 0, 'marginBottom': 0 },
          dataSource: [
            {
              label: '闪粉',
              value: '1'
            }
          ]
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
          columns: productPrintingFlashPowderColumns,
          pagination: productPrintingFlashPowderPagination
        }
      ]
    }
    // 生产成本印花附加荧光弹出框基础表头
    const productPrintingFluorescenceBaseColumns = [
      {
        prop: 'minAreaPercent',
        label: '荧光面积区间',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => {
          return `<span>${scope.row.minAreaPct ? scope.row.minAreaPct + '%' : ''}~${scope.row.maxAreaPct ? scope.row.maxAreaPct + '%' : ''}</span>`
        }
      },
      {
        prop: 'additionalPrice',
        label: '荧光价格',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      }
    ]
    // 生产成本印花附加荧光弹出框表头
    const productPrintingFluorescenceColumns = [
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
          return (this.productPrintingFluorescencePagination.currentPage - 1) * this.productPrintingFluorescencePagination.pageSize + scope.$index + 1
        }
      },
      ...productPrintingFluorescenceBaseColumns
    ]
    // 生产成本印花附加荧光弹出框分页
    const productPrintingFluorescencePagination = {
      currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getPrintingAdditionalInfoPage({ pageSize: this.productPrintingFluorescencePagination.pageSize || 5, pageNum: val, printingAdditionalType: 'F' })
      },
      sizeChange: val => {
        //
        this.$set(this.spunPagination, 'currentPage', 1)
        this.getPrintingAdditionalInfoPage({ pageNum: 1, pageSize: val, printingAdditionalType: 'F' })
      }
    }
    // 生产成本印花附加荧光弹出框
    const productPrintingFluorescencePopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1240px',
      ok: params => {
        if (this.productPrintingFluorescenceColumns[0].componentsOptions.radio) {
          this.majorPrintingTechList[0].printingAdditionalList || (this.majorPrintingTechList[0].printingAdditionalList = [])
          const fIndex = this.majorPrintingTechList[0].printingAdditionalList.findIndex(item => {
            return this.productPrintingFluorescenceColumns[0].componentsOptions.radioData.printingAdditionalType === item.printingAdditionalType
          })
          console.log(fIndex)
          fIndex === -1 ? this.majorPrintingTechList[0].printingAdditionalList.push(this.productPrintingFluorescenceColumns[0].componentsOptions.radioData)
            : this.majorPrintingTechList[0].printingAdditionalList.splice(fIndex, 1, this.productPrintingFluorescenceColumns[0].componentsOptions.radioData)
          this.totalDataList[this.editableTabsValue].majorPrintingTechList[0].printingAdditionalList = this.majorPrintingTechList[0].printingAdditionalList
        }
        console.log(this.majorPrintingTechList[0].printingAdditionalList)
        this.closePopDialogHandle(this.productPrintingFluorescencePopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.productPrintingFluorescencePopOptions)
      },
      close: () => {
        this.$set(this.productPrintingFluorescenceColumns[0].componentsOptions, 'radio', null)
        this.$set(this.productPrintingFluorescencePopOptions.formDatas, 'radio', null)
      },
      formDatas: {
        tabs: '1'
      },
      formOptions: {
        labelWidth: '100px',
        inline: true
      },
      content: [
        {
          prop: 'tabs',
          itemType: 'tabs',
          label: '',
          itemStyle: { 'width': '100%', 'marginRight': 0, 'marginBottom': 0 },
          dataSource: [
            {
              label: '荧光',
              value: '1'
            }
          ]
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
          columns: productPrintingFluorescenceColumns,
          pagination: productPrintingFluorescencePagination
        }
      ]
    }
    // 生产成本印花附加凸浆弹出框基础表头
    const productPrintingBumpBaseColumns = [
      {
        prop: 'minAreaPercent',
        label: '凸浆面积区间',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => {
          return `<span>${scope.row.minAreaPct ? scope.row.minAreaPct + '%' : ''}~${scope.row.maxAreaPct ? scope.row.maxAreaPct + '%' : ''}</span>`
        }
      },
      {
        prop: 'additionalPrice',
        label: '凸浆价格',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      }
    ]
    // 生产成本印花附加凸浆弹出框表头
    const productPrintingBumpColumns = [
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
          return (this.productPrintingBumpPagination.currentPage - 1) * this.productPrintingBumpPagination.pageSize + scope.$index + 1
        }
      },
      ...productPrintingBumpBaseColumns
    ]
    // 生产成本印花附加凸浆弹出框分页
    const productPrintingBumpPagination = {
      currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getPrintingAdditionalInfoPage({ pageSize: this.productPrintingBumpPagination.pageSize || 5, pageNum: val, printingAdditionalType: 'C' })
      },
      sizeChange: val => {
        //
        this.$set(this.spunPagination, 'currentPage', 1)
        this.getPrintingAdditionalInfoPage({ pageNum: 1, pageSize: val, printingAdditionalType: 'C' })
      }
    }
    // 生产成本印花附加凸浆弹出框
    const productPrintingBumpPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1240px',
      ok: params => {
        if (this.productPrintingBumpColumns[0].componentsOptions.radio) {
          this.majorPrintingTechList[0].printingAdditionalList || (this.majorPrintingTechList[0].printingAdditionalList = [])
          const fIndex = this.majorPrintingTechList[0].printingAdditionalList.findIndex(item => {
            return this.productPrintingBumpColumns[0].componentsOptions.radioData.printingAdditionalType === item.printingAdditionalType
          })
          fIndex === -1 ? this.majorPrintingTechList[0].printingAdditionalList.push(this.productPrintingBumpColumns[0].componentsOptions.radioData)
            : this.majorPrintingTechList[0].printingAdditionalList.splice(fIndex, 1, this.productPrintingBumpColumns[0].componentsOptions.radioData)
          this.totalDataList[this.editableTabsValue].majorPrintingTechList[0].printingAdditionalList = this.majorPrintingTechList[0].printingAdditionalList
        }
        this.closePopDialogHandle(this.productPrintingBumpPopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.productPrintingBumpPopOptions)
        // this.$set(this.columnsInfos[0].componentsOptions, 'radio', null)
      },
      close: () => {
        this.$set(this.productPrintingBumpColumns[0].componentsOptions, 'radio', null)
        this.$set(this.productPrintingBumpPopOptions.formDatas, 'radio', null)
      },
      formDatas: {
        tabs: '1'
      },
      formOptions: {
        // labelWidth: '100px',
        inline: true
      },
      content: [
        {
          prop: 'tabs',
          itemType: 'tabs',
          label: '',
          itemStyle: { 'width': '100%', 'marginRight': 0, 'marginBottom': 0 },
          dataSource: [
            {
              label: '凸浆',
              value: '1'
            }
          ]
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
          columns: productPrintingBumpColumns,
          pagination: productPrintingBumpPagination
        }
      ]
    }
    // 生产成本印花附加夜光浆弹出框基础表头
    const productPrintingNightGlowPulpBaseColumns = [
      {
        prop: 'minAreaPercent',
        label: '夜光浆面积区间',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => {
          return `<span>${scope.row.minAreaPct ? scope.row.minAreaPct + '%' : ''}~${scope.row.maxAreaPct ? scope.row.maxAreaPct + '%' : ''}</span>`
        }
      },
      {
        prop: 'additionalPrice',
        label: '夜光浆价格',
        minWidth: '90',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      }
    ]
    // 生产成本印花附加夜光浆弹出框表头
    const productPrintingNightGlowPulpColumns = [
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
          return (this.productPrintingNightGlowPulpPagination.currentPage - 1) * this.productPrintingNightGlowPulpPagination.pageSize + scope.$index + 1
        }
      },
      ...productPrintingNightGlowPulpBaseColumns
    ]
    // 生产成本印花附加夜光浆弹出框分页
    const productPrintingNightGlowPulpPagination = {
      currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getPrintingAdditionalInfoPage({ pageSize: this.productPrintingNightGlowPulpPagination.pageSize || 5, pageNum: val, printingAdditionalType: 'L' })
      },
      sizeChange: val => {
        //
        this.$set(this.spunPagination, 'currentPage', 1)
        this.getPrintingAdditionalInfoPage({ pageNum: 1, pageSize: val, printingAdditionalType: 'L' })
      }
    }
    // 生产成本印花附加夜光浆弹出框
    const productPrintingNightGlowPulpPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1240px',
      ok: params => {
        if (this.productPrintingNightGlowPulpColumns[0].componentsOptions.radio) {
          this.majorPrintingTechList[0].printingAdditionalList || (this.majorPrintingTechList[0].printingAdditionalList = [])
          const fIndex = this.majorPrintingTechList[0].printingAdditionalList.findIndex(item => {
            return this.productPrintingNightGlowPulpColumns[0].componentsOptions.radioData.printingAdditionalType === item.printingAdditionalType
          })
          fIndex === -1 ? this.majorPrintingTechList[0].printingAdditionalList.push(this.productPrintingNightGlowPulpColumns[0].componentsOptions.radioData)
            : this.majorPrintingTechList[0].printingAdditionalList.splice(fIndex, 1, this.productPrintingNightGlowPulpColumns[0].componentsOptions.radioData)
          this.totalDataList[this.editableTabsValue].majorPrintingTechList[0].printingAdditionalList = this.majorPrintingTechList[0].printingAdditionalList
        }
        this.closePopDialogHandle(this.productPrintingNightGlowPulpPopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.productPrintingNightGlowPulpPopOptions)
        // this.$set(this.columnsInfos[0].componentsOptions, 'radio', null)
      },
      close: () => {
        this.$set(this.productPrintingNightGlowPulpColumns[0].componentsOptions, 'radio', null)
        this.$set(this.productPrintingNightGlowPulpPopOptions.formDatas, 'radio', null)
      },
      formDatas: {
        tabs: '1'
      },
      formOptions: {
        labelWidth: '100px',
        inline: true
      },
      content: [
        {
          prop: 'tabs',
          itemType: 'tabs',
          label: '',
          itemStyle: { 'width': '100%', 'marginRight': 0, 'marginBottom': 0 },
          dataSource: [
            {
              label: '夜光浆',
              value: '1'
            }
          ]
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
          columns: productPrintingNightGlowPulpColumns,
          pagination: productPrintingNightGlowPulpPagination
        }
      ]
    }
    // 生产成本印花损耗弹出框基础表头
    const productPrintingLossBaseColumns = [
      {
        prop: 'printingTechName',
        label: '印花工艺',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'minWeight',
        label: '重量区间（千克）',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          return `<span>${scope.row.minWeight !== null ? scope.row.minWeight : ''}${scope.row.minWeight !== null && scope.row.maxWeight !== null ? '~' : ''}${scope.row.maxWeight !== null ? scope.row.maxWeight : ''}</span>`
        }
      },
      {
        prop: 'printingLossPct',
        label: '印花损耗百分比',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? scope.row[scope.column.property] + '%' : 0 + '%'
      }
    ]
    // 生产成本印花损耗弹出框表头
    const productPrintingLossColumns = [
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
          return (this.productPrintingLossPagination.currentPage - 1) * this.productPrintingLossPagination.pageSize + scope.$index + 1
        }
      },
      ...productPrintingLossBaseColumns
    ]
    // 生产成本印花损耗弹出框分页
    const productPrintingLossPagination = {
      // currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getPrintingLossInfoPage({ ...this.$refs.printingLoss.$children[0].formDatas, pageSize: this.productPrintingLossPagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        //
        this.$set(this.spunPagination, 'currentPage', 1)
        this.getPrintingLossInfoPage({ pageNum: 1, pageSize: val })
      }
    }
    // 生产成本印花损耗弹出框
    const productPrintingLossPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1240px',
      ok: params => {
        if (this.productPrintingLossColumns[0].componentsOptions.radio) {
          this.$set(this.majorPrintingTechList[0], 'printingLossList', [this.productPrintingLossColumns[0].componentsOptions.radioData])
          this.totalDataList[this.editableTabsValue].majorPrintingTechList[0].printingLossList = [this.productPrintingLossColumns[0].componentsOptions.radioData]
        }
        this.closePopDialogHandle(this.productPrintingLossPopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.productPrintingLossPopOptions)
        // this.$set(this.columnsInfos[0].componentsOptions, 'radio', null)
      },
      close: () => {
        this.$set(this.productPrintingLossColumns[0].componentsOptions, 'radio', null)
        this.$set(this.productPrintingLossPopOptions.formDatas, 'radio', null)
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
          prop: 'printingTech',
          itemType: 'select',
          filterable: true,
          label: '印花工艺:',
          valueType: 'object',
          change: (object, form, formDatas) => { this.getPrintingLossInfoPage(formDatas) },
          dataSource: []
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
          columns: productPrintingLossColumns,
          pagination: productPrintingLossPagination
        }
      ]
    }
    return {
      isCloth: false, // 后整/后整损耗中是否包含底磨毛，面磨毛，底刷毛，面刷毛或者染色工艺中是否包含单染
      isPrint: false, // 主要/次要印花工艺是拔印印花
      isWeight: false, // 当前布类克重是否小于150
      // 这是生产成本的
      dyeingTechList: [],
      afterfinishLossList: [],
      functionLossList: [],
      majorPrintingTechList: [],
      productDyeingPopOptions,
      productDyeingPagination,
      productDyeingColumns,
      productDyeingAdditionPopOptions,
      productDyeingAdditionColumns,
      productDyeingLossPopOptions,
      productDyeingLossColumns,
      productDyeingLossPagination,
      productDyeingLossBaseColumns,
      productPostIntegrationLossPopOptions,
      productPostIntegrationLossBaseColumns,
      productPostIntegrationLossColumns,
      productPostIntegrationLossPagination,
      productFunctionLossPopOptions,
      productFunctionLossBaseColumns,
      productFunctionLossColumns,
      productFunctionLossPagination,
      productMainPrintingPopOptions,
      productMainPrintingPagination,
      productMainPrintingViewColumns,
      productMainPrintingColumns,
      printingCertificatePagination,
      productPrintingCertificatePopOptions,
      productSecondaryPrintingPopOptions,
      productSecondaryPrintingColumns,
      productSecondaryPrintingBaseColumns,
      productSecondaryPrintingPagination,
      productPrintingFlashPowderPopOptions,
      productPrintingFlashPowderBaseColumns,
      productPrintingFlashPowderColumns,
      productPrintingFlashPowderPagination,
      productPrintingFluorescencePopOptions,
      productPrintingFluorescenceBaseColumns,
      productPrintingFluorescenceColumns,
      productPrintingFluorescencePagination,
      productPrintingBumpPopOptions,
      productPrintingBumpColumns,
      productPrintingBumpBaseColumns,
      productPrintingBumpPagination,
      productPrintingNightGlowPulpPopOptions,
      productPrintingNightGlowPulpBaseColumns,
      productPrintingNightGlowPulpColumns,
      productPrintingNightGlowPulpPagination,
      productPrintingLossPopOptions,
      productPrintingLossBaseColumns,
      productPrintingLossColumns,
      productPrintingLossPagination,
      productDyeingViewColumns,
      otherProductMainPrintingViewColumns, // 生产成本主要印花弹出框基础表头
      otherProductSecondaryPrintingBaseColumns // 生产成本次要印花基础表头
    }
  },
  computed: {
    // 生产成本小计
    productCostSubtotal() {
      this.isCloth = false
      this.isPrint = false
      this.isWeight = false
      let totalPrice = 0
      let dyeingPrice = 0
      let dyeingPct = 0
      let afterPrice = 0
      let afterPct = 0
      let functionPrice = 0
      let functionPct = 0
      let printingPrice = 0
      let printingPct = 0
      let isDye = false // 是否含有单染
      let isAfterfinish = false // 后整/后整损耗中是否包含底磨毛，面磨毛，底刷毛，面刷毛
      let isMinorPrint = false // 次要印花是否是拔印印花
      // 判断当前布类克重是否小于150

      if (this.quantityData.length && this.quantityData[0].weightPerSquare < 150) {
        this.isWeight = true
      }
      // 判断染色工艺中是否包含单染
      this.dyeingTechList && this.dyeingTechList.map(item => {
        // ;
        if (item.singleDoubleDyeingName === '单染') {
          // ;
          // dyeingPrice = dyeingPrice + 0.2
          isDye = true
          return isDye
        }
      })
      // ;
      if (this.afterfinishLossList.length !== 0) {
        this.afterfinishLossList.forEach(item => {
          afterPrice += (item.afterfinishTechPrice || 0)
          afterPct += (item.afterfinishLossPct || 0) / 100
        })
      } else {
        afterPrice = 0
        afterPct = 0
      }
      // ;
      // 判断后整/后整损耗中是否包含底磨毛，面磨毛，底刷毛，面刷毛
      this.afterfinishLossList && this.afterfinishLossList.map(item => {
        if (item.afterfinishTechName && item.afterfinishTechName.includes('底磨毛') || item.afterfinishTechName.includes('面磨毛') || item.afterfinishTechName.includes('底刷毛') || item.afterfinishTechName.includes('面刷毛')) {
          // afterPrice = afterPrice + 0.2
          isAfterfinish = true
          return isAfterfinish
        }
      })
      if (this.functionLossList.length !== 0) {
        this.functionLossList.forEach(item => {
          functionPrice += (item.functionPrice || 0)
          functionPct += (item.functionLossPct || 0) / 100
        })
      } else {
        functionPrice = 0
        functionPct = 0
      }
      if (this.majorPrintingTechList.length !== 0) {
        this.majorPrintingTechList.forEach(item => {
          const printingCertPrice = (item.printingCertList && item.printingCertList.length !== 0) ? item.printingCertList.map(item => item.printingCertPrice || 0).reduce((total, item) => total + item) : 0

          const additionalPrice = (item.printingAdditionalList && item.printingAdditionalList.length !== 0) ? item.printingAdditionalList.map(item => item.additionalPrice || 0).reduce((total, item) => total + item) : 0
          if (this.isWeight) {
            const printPrice = item.printingPrice * (1 + 0.15)

            const minorPrice = (item.minorPrintingTechList && item.minorPrintingTechList.length !== 0) ? item.minorPrintingTechList.map(item => item.printingPrice * (1 + 0.15) || 0).reduce((total, item) => total + item) : 0
            printingPrice = this.$utils.getFloat((printPrice || 0) + additionalPrice + minorPrice + printingCertPrice, 4)
          } else {
            const minorPrice = (item.minorPrintingTechList && item.minorPrintingTechList.length !== 0) ? item.minorPrintingTechList.map(item => item.printingPrice || 0).reduce((total, item) => total + item) : 0
            printingPrice = this.$utils.getFloat((item.printingPrice || 0) + additionalPrice + minorPrice + printingCertPrice, 4)
          }

          printingPct = (item.printingLossList && item.printingLossList.length !== 0) ? (item.printingLossList[0].printingLossPct || 0) / 100 : 0
        })
      } else {
        printingPrice = 0
        printingPct = 0
      }
      // 主要/次要印花工艺是拔印印花  染色工艺价格加2
      //
      this.majorPrintingTechList && this.majorPrintingTechList.map(item => {
        item.minorPrintingTechList && item.minorPrintingTechList.map(mitem => {
          if (mitem.printingName === '拔印印花') {
            isMinorPrint = true
          }
        })
        if (item.printingName === '拔印印花' || isMinorPrint) {
          this.isPrint = true
        }
      })
      this.$set(this.productDyeingViewColumns[4].componentsOptions, 'isFlag', this.isPrint)
      this.$set(this.otherProductMainPrintingViewColumns[3].componentsOptions, 'isFlag', this.isWeight)
      this.$set(this.otherProductSecondaryPrintingBaseColumns[1].componentsOptions, 'isFlag', this.isWeight)
      // 计算染色工艺的成本
      if (this.dyeingTechList.length !== 0) {
        this.dyeingTechList.forEach(item => {
          const additionalPrice = (item.dyeingAdditionalList && item.dyeingAdditionalList.length !== 0) ? this.$utils.getFloat(item.dyeingAdditionalList.map(item => item.additionalContentPrice || 0).reduce((total, item) => total + item), 4) : 0
          if (this.isPrint) {
            dyeingPrice += this.$utils.getFloat((((item.dyeingPrice + 2) || 0) + additionalPrice) * (isNaN(item.colorPct) ? 0 : item.colorPct / 100), 4)
          } else {
            dyeingPrice += this.$utils.getFloat(((item.dyeingPrice || 0) + additionalPrice) * (isNaN(item.colorPct) ? 0 : item.colorPct / 100), 4)
          }

          dyeingPct += (item.dyeingLossList && item.dyeingLossList.length !== 0) ? this.$utils.getFloat((item.dyeingLossList[0].dyeingFinishedLossPct || 0) * (isNaN(item.colorPct) ? 0 : item.colorPct) / 10000, 4) : 0
        })
      } else {
        dyeingPrice = 0
        dyeingPct = 0
      }
      // ;
      // 后整/后整损耗中是否包含底磨毛，面磨毛，底刷毛，面刷毛或者染色工艺中是否包含单染织工价格加0.2，生产成本加0.2
      if (isDye || isAfterfinish) {
        this.isCloth = true
        // totalPrice = totalPrice + 0.2
      }

      (dyeingPct + afterPct + functionPct + printingPct) !== 1 ? totalPrice += this.$utils.getFloat(this.fabricCostSubtotal * 1 + dyeingPrice + afterPrice + functionPrice + printingPrice, 4) / this.$utils.getFloat((1 - (dyeingPct + afterPct + functionPct + printingPct)), 4) : totalPrice = 0

      return this.$utils.getFloat(totalPrice, 4)
    },
    // 闪粉数据
    flashPowderData() {
      const majorPrintingTechList = this.majorPrintingTechList
      return (majorPrintingTechList[0].printingAdditionalList && majorPrintingTechList[0].printingAdditionalList.length !== 0) ? majorPrintingTechList[0].printingAdditionalList.filter(item => item.printingAdditionalType === 'G') : []
    },
    // 荧光数据
    fluorescenceData() {
      const majorPrintingTechList = this.majorPrintingTechList
      return (majorPrintingTechList[0].printingAdditionalList && majorPrintingTechList[0].printingAdditionalList.length !== 0) ? majorPrintingTechList[0].printingAdditionalList.filter(item => item.printingAdditionalType === 'F') : []
    },
    // 凸浆数据
    bumpData() {
      const majorPrintingTechList = this.majorPrintingTechList
      return (majorPrintingTechList[0].printingAdditionalList && majorPrintingTechList[0].printingAdditionalList.length !== 0) ? majorPrintingTechList[0].printingAdditionalList.filter(item => item.printingAdditionalType === 'C') : []
    },
    // 夜光浆数据
    nightGlowPulpData() {
      const majorPrintingTechList = this.majorPrintingTechList
      return (majorPrintingTechList[0].printingAdditionalList && majorPrintingTechList[0].printingAdditionalList.length !== 0) ? majorPrintingTechList[0].printingAdditionalList.filter(item => item.printingAdditionalType === 'L') : []
    }
  },
  methods: {
    // 添加染色工艺弹出框
    productDyeingPop() {
      this.type = 'add'
      if (this.dyeingTechList.length >= 15) {
        this.$message.warning('染色工艺最多添加15个')
        return false
      }
      this.PopDialogHandle(this.productDyeingPopOptions, '请选择染色工艺')
      this.getDyeingInfoPage()
      this.getDyeingInfoOptionsFilled()
    },
    // 获取染色工艺page
    async getDyeingInfoPage(data = {}) {
      const res = await priceApi.dyeingInfoPage({ ...data, status: 1 })
      const dataList = res.data.list || []
      this.productDyeingPagination = {
        ...this.productDyeingPagination,
        dataTotal: res.data ? res.data.total : 0,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.$set(this.productDyeingPopOptions.content[5], 'pagination', this.productDyeingPagination)
      this.$set(this.productDyeingPopOptions.content[5], 'dataSource', dataList)
    },
    // 获取染色工艺下拉框数据
    async getDyeingInfoOptionsFilled(data = {}) {
      const res = await priceApi.dyeingInfoOptionsFilled({ ...data, status: 1 })
      this.completionData(res.data, this.productDyeingPopOptions.content)
    },
    // 添加染色附加弹出框
    productDyeingAdditionPop(index) {
      this.type = 'add'
      this.PopDialogHandle(this.productDyeingAdditionPopOptions, '请选择染色附加')
      this.getDyeingAdditionalInfoPage()
    },
    // 获取染色附加page
    async getDyeingAdditionalInfoPage(data = {}, dataSource) {
      const res = await priceApi.dyeingAdditionalInfoPage({ ...data, status: 1 })
      const dataList = res.data.list || []
      this.productDyeingAdditionPagination = {
        ...this.productDyeingAdditionPagination,
        dataTotal: res.data ? res.data.total : 0,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      ;
      (dataSource && dataSource.length !== 0) && this.$set(this.productDyeingAdditionColumns[0].componentsOptions, 'radio', dataSource[0].id)
      this.$set(this.productDyeingAdditionPopOptions.content[0], 'dataSource', dataList)
    },
    // 添加染色损耗弹出框
    productDyeingLossPop(index) {
      this.type = 'add'
      this.PopDialogHandle(this.productDyeingLossPopOptions, '请选择染色损耗')
      this.getDyeingLossInfoPage()
      this.getDyeingLossInfoOptionsFilled()
      this.$set(this.productDyeingLossPopOptions.formDatas, 'index', index)
    },
    // 获取染色损耗page
    async getDyeingLossInfoPage(data = {}) {
      const res = await priceApi.dyeingLossInfoPage({ ...data, status: 1 })
      const dataList = res.data.list || []
      this.productDyeingLossPagination = {
        ...this.productDyeingLossPagination,
        dataTotal: res.data ? res.data.total : 0,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.$set(this.productDyeingLossPopOptions.content[3], 'pagination', this.productDyeingLossPagination)
      this.$set(this.productDyeingLossPopOptions.content[3], 'dataSource', dataList)
    },
    // 获取染色损耗下拉框数据
    async getDyeingLossInfoOptionsFilled(data = {}) {
      const res = await priceApi.dyeingLossInfoOptionsFilled({ ...data, status: 1 })
      this.completionData(res.data, this.productDyeingLossPopOptions.content)
    },
    // 添加后整/后整损耗弹出框
    productPostIntegrationLossPop(type = 'add') {
      this.type = type
      if (type === 'add') {
        if (this.afterfinishLossList.length >= 10) {
          this.$message.warning('后整/后整损耗最多添加10个')
          return false
        }
        this.productPostIntegrationLossColumns.splice(0, 1, {
          prop: 'id',
          label: '选择',
          width: '50',
          components: {
            checkboxButton
          },
          componentsOptions: {
            changeMethods: (scope, formDatas) => {
              if (!formDatas.name) {
                formDatas.name = []
              }
              if (scope.row.checked) {
                if (formDatas.name.length < 10) {
                  formDatas.name.push(scope.row)
                } else {
                  this.$message.warning('最多显示10个')
                  scope.row.checked = false
                }
              } else {
                formDatas.name.forEach((item, index) => {
                  if (item.id === scope.row.id) {
                    formDatas.name.splice(index, 1)
                  }
                })
              }
              this.productPostIntegrationLossPopOptions.content[4].componentsOptions.data = [...formDatas.name]
            }
          }
        },)
        const newArray = this.afterfinishLossList ? this.afterfinishLossList.map(item => {
          return { ...item }
        }) : []
        this.$set(this.productPostIntegrationLossPopOptions, 'formDatas', { name: [...newArray] })
        this.productPostIntegrationLossPopOptions.content[4].componentsOptions.data = [...newArray]
        this.productPostIntegrationLossPopOptions.content[4].componentsOptions.isShow = 'add'
      }
      if (type === 'replace') {
        this.productPostIntegrationLossColumns.splice(0, 1, {
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
        })
        this.productPostIntegrationLossPopOptions.content[4].componentsOptions.isShow = 'replace'
      }
      this.PopDialogHandle(this.productPostIntegrationLossPopOptions, '请选择后整/后整损耗')
      this.getAfterfinishLossPage()
      this.getAfterfinishLossOptionsFilled()
    },
    // 获取后整/后整损耗page
    async getAfterfinishLossPage(data = {}) {
      const res = await priceApi.afterfinishLossPage({ ...data, status: 1 })
      const dataList = res.data.list || []
      this.productPostIntegrationLossPagination = {
        ...this.productPostIntegrationLossPagination,
        dataTotal: res.data ? res.data.total : 0,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.$set(this.productPostIntegrationLossPopOptions.content[3], 'pagination', this.productPostIntegrationLossPagination)
      if (this.type === 'add') {
        dataList.forEach(item => {
          item.checked = !!(this.productPostIntegrationLossPopOptions.content[4].componentsOptions.data.find(itemA => {
            return itemA.id === item.id
          }))
        })
      }
      this.$set(this.productPostIntegrationLossPopOptions.content[3], 'dataSource', dataList)
    },
    // 获取后整/后整损耗下拉框数据
    async getAfterfinishLossOptionsFilled(data = {}) {
      const res = await priceApi.afterfinishLossOptionsFilled({ ...data, status: 1 })
      this.completionData(res.data, this.productPostIntegrationLossPopOptions.content)
    },
    // 添加功能/功能损耗弹出框
    productFunctionLossPop(type = 'add') {
      this.type = type
      if (type === 'add') {
        if (this.functionLossList.length >= 6) {
          this.$message.warning('功能/功能损耗最多添加6个')
          return false
        }
        this.productFunctionLossColumns.splice(0, 1, {
          prop: 'id',
          label: '选择',
          width: '50',
          components: {
            checkboxButton
          },
          componentsOptions: {
            changeMethods: (scope, formDatas) => {
              if (!formDatas.name) {
                formDatas.name = []
              }
              if (scope.row.checked) {
                if (formDatas.name.length < 6) {
                  formDatas.name.push(scope.row)
                } else {
                  this.$message.warning('最多显示6个')
                  scope.row.checked = false
                }
              } else {
                formDatas.name.forEach((item, index) => {
                  if (item.id === scope.row.id) {
                    formDatas.name.splice(index, 1)
                  }
                })
              }
              this.productFunctionLossPopOptions.content[3].componentsOptions.data = [...formDatas.name]
            }
          }
        },)
        const newArray = this.functionLossList ? this.functionLossList.map(item => {
          return { ...item }
        }) : []
        this.$set(this.productFunctionLossPopOptions, 'formDatas', { name: [...newArray] })
        this.productFunctionLossPopOptions.content[3].componentsOptions.data = [...newArray]
        this.productFunctionLossPopOptions.content[3].componentsOptions.isShow = 'add'
      }
      if (type === 'replace') {
        this.productFunctionLossColumns.splice(0, 1, {
          prop: 'id',
          label: '选择',
          width: '50',
          components: {
            radioButton
          },
          componentsOptions: {
            changeMethods: (value) => {

            }
          }
        })
        this.productFunctionLossPopOptions.content[3].componentsOptions.isShow = 'replace'
      }
      this.PopDialogHandle(this.productFunctionLossPopOptions, '请选择功能/功能损耗')
      this.getFunctionLossInfoPage()
      this.getFunctionLossInfoOptionsFilled()
    },
    // 获取功能/功能损耗page
    async getFunctionLossInfoPage(data = {}) {
      const res = await priceApi.functionLossInfoPage({ ...data, status: 1 })
      const dataList = res.data.list || []
      this.productFunctionLossPagination = {
        ...this.productFunctionLossPagination,
        dataTotal: res.data ? res.data.total : 0,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      if (this.type === 'add') {
        dataList.forEach(item => {
          item.checked = !!(this.productFunctionLossPopOptions.content[3].componentsOptions.data.find(itemA => {
            return itemA.id === item.id
          }))
        })
      }
      this.$set(this.productFunctionLossPopOptions.content[2], 'pagination', this.productFunctionLossPagination)
      this.$set(this.productFunctionLossPopOptions.content[2], 'dataSource', dataList)
    },
    // 获取功能/功能损耗下拉框数据
    async getFunctionLossInfoOptionsFilled(data = {}) {
      const res = await priceApi.functionLossInfoOptionsFilled({ ...data, status: 1 })
      this.completionData(res.data, this.productFunctionLossPopOptions.content)
    },
    // 添加主要印花弹出框
    productMainPrintingPop() {
      this.type = 'add'
      this.PopDialogHandle(this.productMainPrintingPopOptions, '请选择主要印花')
      this.getPrintingTechInfoInfoPage({ techType: 'M' })
      this.getPrintingTechInfoOptionsFilled({ techType: 'M' })
    },
    // 添加次要印花弹出框
    productSecondaryPrintingPop() {
      this.type = 'add'
      if (!this.isChangeProduct && this.majorPrintingTechList[0].minorPrintingTechList && this.majorPrintingTechList[0].minorPrintingTechList.length >= 3) {
        this.$message.warning('次要印花最多选择三个')
        return false
      }
      this.PopDialogHandle(this.productSecondaryPrintingPopOptions, '请选择次要印花')
      this.getPrintingTechInfoInfoPage({ techType: 'S' })
      this.getPrintingTechInfoOptionsFilled({ techType: 'S' })
      this.isChangeProduct = false
    },
    // 获取主要/次要印花page
    async getPrintingTechInfoInfoPage(data = {}) {
      const tab = data.techType === 'M' ? 'productMain' : 'productSecondary'
      const res = await priceApi.printingTechInfoInfoPage({ ...data, status: 1 })
      const dataList = res.data.list || []
      this[tab + 'PrintingPagination'] = {
        ...this[tab + 'PrintingPagination'],
        dataTotal: res.data ? res.data.total : 0,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.$set(this[tab + 'PrintingPopOptions'].content[3], 'pagination', this[tab + 'PrintingPagination'])
      this.$set(this[tab + 'PrintingPopOptions'].content[3], 'dataSource', dataList)
    },
    // 获取主要/次要印花下拉框数据
    async getPrintingTechInfoOptionsFilled(data = {}) {
      const tab = data.techType === 'M' ? 'productMain' : 'productSecondary'
      const res = await priceApi.printingTechInfoOptionsFilled({ ...data, status: 1 })
      this.completionData(res.data, this[tab + 'PrintingPopOptions'].content)
    },
    // 获取印花证书page
    async getPrintingCertInfoPage(data = {}) {
      const res = await priceApi.printingCertInfoPage({ ...data, status: 1 })
      const dataList = res.data.list || []
      this.printingCertificatePagination = {
        ...this.printingCertificatePagination,
        dataTotal: res.data ? res.data.total : 0,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      const checkedData = this.productPrintingCertificatePopOptions.formDatas.name || []
      dataList.forEach(item => {
        item.checked = false
        if (checkedData && checkedData.map(itemValue => itemValue.id).includes(item.id)) {
          item.checked = true
        }
      })
      this.$set(this.productPrintingCertificatePopOptions.content[0], 'pagination', this.printingCertificatePagination)
      this.$set(this.productPrintingCertificatePopOptions.content[0], 'dataSource', dataList)
    },
    // 添加印花闪粉弹出框
    productPrintingFlashPowderPop() {
      this.type = 'add'
      this.PopDialogHandle(this.productPrintingFlashPowderPopOptions, '请选择印花闪粉')
      this.getPrintingAdditionalInfoPage({ printingAdditionalType: 'G' })
    },
    // 添加印花荧光弹出框
    productPrintingFluorescencePop() {
      this.type = 'add'
      this.PopDialogHandle(this.productPrintingFluorescencePopOptions, '请选择印花荧光')
      this.getPrintingAdditionalInfoPage({ printingAdditionalType: 'F' })
    },
    // 添加印花凸浆弹出框
    productPrintingBumpPop() {
      this.type = 'add'
      this.PopDialogHandle(this.productPrintingBumpPopOptions, '请选择印花凸浆')
      this.getPrintingAdditionalInfoPage({ printingAdditionalType: 'C' })
    },
    // 添加印花夜光浆弹出框
    productPrintingNightGlowPulpPop() {
      this.type = 'add'
      this.PopDialogHandle(this.productPrintingNightGlowPulpPopOptions, '请选择印花夜光浆')
      this.getPrintingAdditionalInfoPage({ printingAdditionalType: 'L' })
    },
    // 获取印花附加page
    async getPrintingAdditionalInfoPage(data = {}) {
      let tab = ''
      switch (data.printingAdditionalType) {
        case 'G':
          tab = 'productPrintingFlashPowder'
          break
        case 'F':
          tab = 'productPrintingFluorescence'
          break
        case 'C':
          tab = 'productPrintingBump'
          break
        case 'L':
          tab = 'productPrintingNightGlowPulp'
          break
        default:
          break
      }
      const res = await priceApi.printingAdditionalInfoPage({ ...data, status: 1 })
      const dataList = res.data.list || []
      this[tab + 'Pagination'] = {
        ...this[tab + 'Pagination'],
        dataTotal: res.data ? res.data.total : 0,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.$set(this[tab + 'PopOptions'].content[1], 'pagination', this[tab + 'Pagination'])
      this.$set(this[tab + 'PopOptions'].content[1], 'dataSource', dataList)
    },

    // 添加印花损耗弹出框
    productPrintingLossPop() {
      this.type = 'add'
      this.PopDialogHandle(this.productPrintingLossPopOptions, '请选择印花损耗')
      this.getPrintingLossInfoPage()
      this.getPrintingLossInfoOptionsFilled()
    },
    // 获取印花损耗page
    async getPrintingLossInfoPage(data = {}) {
      const res = await priceApi.printingLossInfoPage({ ...data, status: 1 })
      const dataList = res.data.list || []
      this.productPrintingLossPagination = {
        ...this.productPrintingLossPagination,
        dataTotal: res.data ? res.data.total : 0,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.$set(this.productPrintingLossPopOptions.content[2], 'pagination', this.productPrintingLossPagination)
      this.$set(this.productPrintingLossPopOptions.content[2], 'dataSource', dataList)
    },
    // 获取印花损耗下拉框数据
    async getPrintingLossInfoOptionsFilled(data = {}) {
      const res = await priceApi.printingLossInfoOptionsFilled({ ...data, status: 1 })
      this.completionData(res.data, this.productPrintingLossPopOptions.content)
    }
  }
}
