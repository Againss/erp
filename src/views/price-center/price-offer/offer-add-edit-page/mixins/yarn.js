import * as priceApi from '../../api/price-index'
import radioButton from '../../components/radio-button.vue'
// import yarnDyedOrNot from '../../components/yarn-dyed-or-not.vue'
import proportion from '../../components/proportion.vue'
import viewWithClear from '../../components/view-with-clear.vue'
import checkboxButton from '../../components/checkbox-button.vue'
export const yarn = {
  data() {
    const lineStyle = {
      'border-bottom': '1px solid #E9EFF2',
      'width': '100%',
      'margin-bottom': '20px'
    }

    // 短纤基础表头信息
    const spunBaseColumns = [
      {
        prop: 'yarnsBranchName',
        label: '纱支',
        minWidth: '90',
        showOverflowTooltip: true
      },
      {
        prop: 'yarnsTypeName',
        label: '纱类',
        minWidth: '90',
        showOverflowTooltip: true
      },
      {
        prop: 'compositionName',
        label: '成分/组合成份',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'compositionProportionName',
        label: '成分占比',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'spinMethodName',
        label: '纺纱方法',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'cardingMethodName',
        label: '梳棉方法',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'colorFlexibilityName',
        label: '染色适应性',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'colorMarkName',
        label: '色号',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'yarnBrandName',
        label: '品牌',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'yarnPrice',
        label: '纱价格',
        minWidth: '70',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
        }
      }
    ]
    // 添加纱线短纤表格
    const spunColumns = [
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

            // this.sampleAnalysisId = value
            // scope.row.status = scope.row.status === '0' ? '1' : '0'
            //
          }
        }
      },
      {
        prop: 'code',
        label: '序号',
        width: '60',
        showOverflowTooltip: true,
        formater: (scope) => {
          return (this.spunPagination.currentPage - 1) * this.spunPagination.pageSize + scope.$index + 1
        }
      },
      ...spunBaseColumns
    ]
    // 长丝基础表头信息
    const filamentBaseColumns = [
      {
        prop: 'finenessName',
        label: '细度',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'compositionName',
        label: '成分/组合成分',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'glossName',
        label: '光泽度',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'functionName',
        label: '功能',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'goodsName',
        label: '丝类',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'colorName',
        label: '颜色',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'yarnBrandName',
        label: '品牌',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'yarnPrice',
        label: '纱价格',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      }
    ]
    // 添加纱线长丝表格
    const filamentColumns = [
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
          return (this.filamentPagination.currentPage - 1) * this.filamentPagination.pageSize + scope.$index + 1
        }
      },
      ...filamentBaseColumns
    ]
    // 短纤分页
    const spunPagination = {
      currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        //
        this.getSpunyarnInfoPage({ ...this.$refs.yarn.$children[0].formDatas, pageSize: this.spunPagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        //
        this.$set(this.spunPagination, 'currentPage', 1)
        this.getSpunyarnInfoPage({ ...this.$refs.yarn.$children[0].formDatas, pageNum: 1, pageSize: val })
      }
    }
    // 长丝分页
    const filamentPagination = {
      currentPage: 1,
      pageSizes: [5],
      pageSize: 5,
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        //
        this.getFilamentInfoPage({ ...this.$refs.yarn.$children[0].formDatas, pageSize: this.filamentPagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        //
        this.$set(this.spunPagination, 'currentPage', 1)
        this.getFilamentInfoPage({ ...this.$refs.yarn.$children[0].formDatas, pageNum: 1, pageSize: val })
      }
    }
    // 纱线弹出框基础内容
    const yarnBaseContent = [
      {
        itemType: 'view',
        text: ``,
        // itemStyle: { width: '100%' },
        style: lineStyle
      },
      {
        prop: 'tabs',
        itemType: 'tabs',
        label: '',
        itemStyle: { 'width': '100%', 'marginRight': 0, 'marginBottom': 0 },
        change: (value, form, formDatas, setFormDatas) => {
          if (value === 'S') {
            // this.$set(this.yarnPopOptions, 'content', this.spunContent)
            this.$set(this.yarnBaseContent[2], 'columns', this.spunColumns)
            this.$set(this.yarnBaseContent[2], 'pagination', this.spunPagination)
            this.getSpunyarnInfoPage()
            this.getSpunyarnInfoOptionsFilled()
            this.$set(this.filamentColumns[0].componentsOptions, 'radio', null)
          } else if (value === 'F') {
            // this.$set(this.yarnPopOptions, 'content', this.filamentContent)
            this.$set(this.yarnBaseContent[2], 'columns', this.filamentColumns)
            this.$set(this.yarnBaseContent[2], 'pagination', this.filamentPagination)
            this.getFilamentInfoPage()
            this.getFilamentInfoOptionsFilled()
            this.$set(this.spunColumns[0].componentsOptions, 'radio', null)
          }
          this.$nextTick(() => {
            this.$set(this.yarnPopOptions, 'content', value === 'S' ? this.spunContent : this.filamentContent)
          })
        },
        dataSource: [
          {
            label: '短纤',
            value: 'S'
          }, {
            label: '长丝',
            value: 'F'
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
        columns: spunColumns,
        pagination: spunPagination
      }
    ]
    // 短纤
    const spunContent = [
      {
        prop: 'yarnsBranch',
        filterable: true,
        itemType: 'select',
        label: '纱支:',
        // clearable: true,
        itemStyle: { width: '25%', 'marginRight': 0 },
        placeholder: '请选择纱支',
        valueType: 'object',
        change: (object, form, formDatas) => { this.getSpunyarnInfoPage(formDatas) },
        dataSource: []
      },
      {
        filterable: true,
        prop: 'yarnsType',
        itemType: 'select',
        label: '纱类:',
        // clearable: true,
        itemStyle: { width: '25%', 'marginRight': 0 },
        placeholder: '请选择纱类',
        valueType: 'object',
        change: (object, form, formDatas) => { this.getSpunyarnInfoPage(formDatas) },
        dataSource: []
      },
      {
        filterable: true,
        prop: 'composition',
        itemType: 'select',
        label: '成分/组合成份:',
        valueType: 'object',
        // clearable: true,
        itemStyle: { width: '25%', 'marginRight': 0 },
        placeholder: '请选择成份',
        change: (object, form, formDatas) => { this.getSpunyarnInfoPage(formDatas) },
        dataSource: []
      },
      {
        prop: 'compositionProportion',
        itemType: 'select',
        filterable: true,
        label: '成分占比:',
        valueType: 'object',
        // clearable: true,
        itemStyle: { width: '25%', 'marginRight': 0 },
        placeholder: '请选择成分占比',
        change: (object, form, formDatas) => { this.getSpunyarnInfoPage(formDatas) },
        dataSource: []
      },
      {
        prop: 'spinMethod',
        filterable: true,
        itemType: 'select',
        label: '纺纱方法:',
        valueType: 'object',
        // clearable: true,
        itemStyle: { width: '25%', 'marginRight': 0 },
        placeholder: '请选择纺纱方法',
        change: (object, form, formDatas) => { this.getSpunyarnInfoPage(formDatas) },
        dataSource: []
      },
      {
        prop: 'cardingMethod',
        itemType: 'select',
        filterable: true,
        label: '梳棉方法:',
        valueType: 'object',
        // clearable: true,
        itemStyle: { width: '25%', 'marginRight': 0 },
        placeholder: '请选择梳棉方法',
        change: (object, form, formDatas) => { this.getSpunyarnInfoPage(formDatas) },
        dataSource: []
      },
      {
        prop: 'colorFlexibility',
        filterable: true,
        itemType: 'select',
        label: '染色适应性:',
        valueType: 'object',
        // clearable: true,
        itemStyle: { width: '25%', 'marginRight': 0 },
        placeholder: '请选择染色适应性',
        change: (object, form, formDatas) => { this.getSpunyarnInfoPage(formDatas) },
        dataSource: []
      },
      {
        prop: 'yarnBrand',
        itemType: 'select',
        filterable: true,
        label: '品牌:',
        valueType: 'object',
        itemStyle: { width: '25%', 'marginRight': 0 },
        placeholder: '请选择品牌',
        change: (object, form, formDatas) => { this.getSpunyarnInfoPage(formDatas) },
        dataSource: []
      },
      {
        prop: 'colorMark',
        filterable: true,
        itemType: 'select',
        label: '色号:',
        valueType: 'object',
        itemStyle: { width: '25%', 'marginRight': 0 },
        placeholder: '请选择色号',
        change: (object, form, formDatas) => { this.getSpunyarnInfoPage(formDatas) },
        dataSource: []
      },
      ...yarnBaseContent
    ]
    // 长丝
    const filamentContent = [
      {
        prop: 'fineness',
        itemType: 'select',
        filterable: true,
        label: '细度:',
        valueType: 'object',
        // clearable: true,
        itemStyle: { width: '25%', 'marginRight': 0 },
        placeholder: '请选择细度',
        dataSource: [],
        change: (object, form, formDatas) => { this.getFilamentInfoPage(formDatas) }
      },
      {
        prop: 'composition',
        itemType: 'select',
        filterable: true,
        label: '成分/组合成份:',
        valueType: 'object',
        // clearable: true,
        itemStyle: { width: '25%', 'marginRight': 0 },
        placeholder: '请选择成分/组合成份',
        dataSource: [],
        change: (object, form, formDatas) => { this.getFilamentInfoPage(formDatas) }
      },
      {
        prop: 'gloss',
        itemType: 'select',
        filterable: true,
        label: '光泽度:',
        // clearable: true,
        itemStyle: { width: '25%', 'marginRight': 0 },
        valueType: 'object',
        placeholder: '请选择光泽度',
        dataSource: [],
        change: (object, form, formDatas) => { this.getFilamentInfoPage(formDatas) }
      },
      {
        prop: 'function',
        filterable: true,
        itemType: 'select',
        label: '功能:',
        // clearable: true,
        itemStyle: { width: '25%', 'marginRight': 0 },
        valueType: 'object',
        placeholder: '请选择功能',
        dataSource: [],
        change: (object, form, formDatas) => { this.getFilamentInfoPage(formDatas) }
      },
      {
        prop: 'goods',
        itemType: 'select',
        filterable: true,
        label: '丝类:',
        // clearable: true,
        itemStyle: { width: '25%', 'marginRight': 0 },
        valueType: 'object',
        placeholder: '请选择丝类',
        dataSource: [],
        change: (object, form, formDatas) => { this.getFilamentInfoPage(formDatas) }
      },
      {
        prop: 'color',
        filterable: true,
        itemType: 'select',
        label: '颜色:',
        valueType: 'object',
        placeholder: '请选择颜色',
        itemStyle: { width: '25%', 'marginRight': 0 },
        dataSource: [],
        change: (object, form, formDatas) => { this.getFilamentInfoPage(formDatas) }
      },
      {
        prop: 'yarnBrand',
        filterable: true,
        itemType: 'select',
        label: '品牌:',
        valueType: 'object',
        placeholder: '请选择品牌',
        itemStyle: { width: '25%', 'marginRight': 0 },
        dataSource: [],
        change: (object, form, formDatas) => { this.getFilamentInfoPage(formDatas) }
      },
      ...yarnBaseContent
    ]
    // 添加纱线
    const yarnPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1240px',
      ok: params => {
        const tab = params.tabs === 'S' ? 'spunColumns' : 'filamentColumns'
        let hasYarn = false
        if (this.yarnList && this.yarnList.length) {
          hasYarn = true
        }
        if (this.type === 'add') {
          if (this[tab][0].componentsOptions.radio) {
            if (params.tabs === 'S') {
              this.yarnListS.push({ ...this[tab][0].componentsOptions.radioData, yarnType: params.tabs, isDyeing: 0, yarnPct: hasYarn ? '' : '100' })
            } else {
              this.yarnListF.push({ ...this[tab][0].componentsOptions.radioData, yarnType: params.tabs, isDyeing: 0, yarnPct: hasYarn ? '' : '100' })
            }
            this.yarnList = [...this.yarnListF, ...this.yarnListS]
            this.totalDataList[this.editableTabsValue].yarnList = this.yarnList
          }
        } else if (this.type === 'replace') {
          if (this.yarnList && this.yarnList.length === 1) {
            hasYarn = false
          }
          if (this[tab][0].componentsOptions.radio) {
            if (this.rowData.yarnType === 'S') {
              this.yarnListS.splice(this.rowIndex, 1)
            } else {
              this.yarnListF.splice(this.rowIndex, 1)
            }
            if (params.tabs === 'S') {
              this.yarnListS.push({ ...this[tab][0].componentsOptions.radioData, yarnType: params.tabs, isDyeing: 0, yarnPct: hasYarn ? '' : '100' })
            } else {
              this.yarnListF.push({ ...this[tab][0].componentsOptions.radioData, yarnType: params.tabs, isDyeing: 0, yarnPct: hasYarn ? '' : '100' })
            }
            this.yarnList = [...this.yarnListF, ...this.yarnListS]
            this.totalDataList[this.editableTabsValue].yarnList = this.yarnList
          }
        }
        this.closePopDialogHandle(this.yarnPopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.yarnPopOptions)
        // this.$set(this.columnsInfos[0].componentsOptions, 'radio', null)
      },
      close: () => {
        this.$set(this.filamentColumns[0].componentsOptions, 'radio', null)
        this.$set(this.spunColumns[0].componentsOptions, 'radio', null)
        this.$set(this.yarnPopOptions.formDatas, 'radio', null)
      },
      formDatas: {
        tabs: 'S'
      },
      formOptions: {
        labelWidth: '120px',
        inline: true
      },
      content: spunContent
    }
    // 纱线操作部分内容
    const yarnOperationColumns = [
      {
        prop: 'yarnCertList',
        label: '纱线证书',
        width: '80',
        components: { viewWithClear },
        handle: (scope, form, formDatas, setFormDatas) => {
          this.PopDialogHandle(this.yarnCertificatePopOptions, '请选择纱线证书')
          const newArray = scope.row.yarnCertList ? scope.row.yarnCertList.map(item => { return { ...item } }) : []
          this.$set(this.yarnCertificatePopOptions, 'formDatas', { ...formDatas, name: [...newArray], index: scope.$index })
          this.getYarnCertInfoPage({})
        },
        clearHandle: (scope) => {
          this.$confirm('此操作将删除纱线证书数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            scope.row.yarnCertList = []
            this.yarnList = [...this.yarnListF, ...this.yarnListS]
            this.totalDataList[this.editableTabsValue].yarnList = this.yarnList
          })
        },
        formater: (scope) => {
          return `<span >${(scope.row[scope.column.property] && scope.row[scope.column.property].length !== 0) ? scope.row[scope.column.property].map(item => item.yarnCertName).join(';') : '请选择'}</span>`
        }
      },
      {
        prop: 'yarnCertificate',
        label: '纱线证书价格合计',
        width: '150',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return (scope.row.yarnCertList && scope.row.yarnCertList.length !== 0) ? '￥' + scope.row.yarnCertList.map(item => item.yarnCertPrice).reduce((total, item) => total + item) : '￥' + 0
        }
      },
      {
        prop: 'yarnPct',
        label: '纱线占比',
        minWidth: '100',
        components: {
          proportion
        },
        componentsOptions: {
          type: 'yarnPct'
        }
      },
      {
        prop: 'yarnDyeingList',
        label: '染纱颜色',
        width: '80',
        components: { viewWithClear },
        handle: (scope, form, formDatas, setFormDatas) => {
          this.dyeingYarnPop(scope.row.yarnType, scope.$index)
        },
        clearHandle: (scope) => {
          this.$confirm('此操作将删除染纱数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            scope.row.yarnDyeingList = []
            this.yarnList = [...this.yarnListF, ...this.yarnListS]
            this.totalDataList[this.editableTabsValue].yarnList = this.yarnList
          })
        },
        formater: (scope) => {
          return `<span >${(scope.row[scope.column.property] && scope.row[scope.column.property].length !== 0) ? scope.row[scope.column.property].map(item => item.dyedYarnColorName).join(';') : '请选择'}</span>`
        }
      },
      {
        prop: 'dyedYarnPrice',
        label: '染纱价格',
        width: '150',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return (scope.row.yarnDyeingList && scope.row.yarnDyeingList.length !== 0) ? '￥' + scope.row.yarnDyeingList[0].dyedYarnPrice : '￥' + 0
        }
      },
      {
        prop: 'yarnDyeingLossList',
        label: '染纱损耗百分比',
        width: '120',
        components: { viewWithClear },
        handle: (scope, form, formDatas, setFormDatas) => {
          if (scope.row.yarnDyeingList && scope.row.yarnDyeingList.length) {
            this.yarnDyeingLossPop(scope.row.yarnType, scope.$index)
          } else {
            this.$message('请先选择染纱信息')
          }
        },
        clearHandle: (scope) => {
          this.$confirm('此操作将删除染纱损耗数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (scope.row.yarnDyeingList && scope.row.yarnDyeingList.length) {
              scope.row.yarnDyeingList[0].yarnDyeingLossList = []
              this.yarnList = [...this.yarnListF, ...this.yarnListS]
              this.totalDataList[this.editableTabsValue].yarnList = this.yarnList
            }
          })
        },
        formater: (scope) => {
          return `<span >${(scope.row.yarnDyeingList && scope.row.yarnDyeingList.length && scope.row.yarnDyeingList[0][scope.column.property] && scope.row.yarnDyeingList[0][scope.column.property].length !== 0) ? scope.row.yarnDyeingList[0][scope.column.property][0].dyedyarnLossPct + '%' : '请选择'}</span>`
        }
      }
    ]
    // 纱线显示短纤内容
    const yarnSpunColumns = [
      ...spunBaseColumns,
      ...yarnOperationColumns
    ]
    // 纱线显示长丝内容
    const yarnFilamentColumns = [
      ...filamentBaseColumns,
      ...yarnOperationColumns
    ]
    // 染纱表头内容
    const dyeingYarnColumns = [
      {
        prop: 'yarnsBranch',
        label: '纱支',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'composition',
        label: '成分/组合成分',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'dyedYarnColor',
        label: '染纱颜色',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'clothLevel',
        label: '布类等级',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'dyedYarnPrice',
        label: '染纱价格',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      }
    ]
    // 染纱损耗表头内容
    const yarnDyeingLossBaseColumns = [
      {
        prop: 'dyedYarnColorName',
        label: '染纱颜色',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'compositionName',
        label: '成分/组合成分',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'minWeight',
        label: '重量区间（千克）',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => {
          return `<span>${scope.row.minWeight !== null ? scope.row.minWeight : ''}${scope.row.minWeight !== null && scope.row.maxWeight !== null ? '~' : ''}${scope.row.maxWeight !== null ? scope.row.maxWeight : ''}</span>`
        }
        // formater: (scope) => {
        //   return (scope.row['minWeight'] || '') + '~' + (scope.row['maxWeight'] || '')
        // }
      },
      {
        prop: 'dyedyarnLossPct',
        label: '染纱损耗百分比',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? scope.row[scope.column.property] + '%' : 0 + '%'
      }
    ]
    // 纱线证书表头
    const yarnCertificateColumns = [
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
          return (this.yarnCertificatePagination.currentPage - 1) * this.yarnCertificatePagination.pageSize + scope.$index + 1
        }
      },
      {
        prop: 'yarnCertName',
        label: '纱线证书',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'certResourceType',
        label: '证书来源',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row[scope.column.property] ? (scope.row[scope.column.property] === 'S'
            ? '<span style="color: #2ac06d;">自开</span>'
            : '外采</span>') : ''
        }
      },
      {
        prop: 'yarnCertPrice',
        label: '证书价格',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      }
    ]
    // 纱线证书分页内容
    const yarnCertificatePagination = {
      // currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getYarnCertInfoPage({ pageSize: this.yarnCertificatePagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        //
        this.$set(this.spunPagination, 'currentPage', 1)
        this.getYarnCertInfoPage({ pageNum: 1, pageSize: val })
      }
    }
    // 纱线证书弹出框
    const yarnCertificatePopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1240px',
      ok: params => {
        this[params.flag[0]][params.index].yarnCertList = params.name
        this.yarnList = [...this.yarnListF, ...this.yarnListS]
        this.totalDataList[this.editableTabsValue].yarnList = this.yarnList
        this.closePopDialogHandle(this.yarnCertificatePopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.yarnCertificatePopOptions)
        // this.$set(this.columnsInfos[0].componentsOptions, 'radio', null)
      },
      close: () => {
        // this.$set(this.spunColumns[0].componentsOptions, 'radio', null)
        // this.$set(this.yarnPopOptions.formDatas, 'search', '')
      },
      formDatas: {
        name: []
      },
      formOptions: {
        // labelWidth: '120px',
        // inline: true
      },
      content: [
        {
          prop: 'yarnCertificate',
          itemType: 'table-form',
          className: 'pop-table',
          label: '',
          labelWidth: '0',
          headerCellStyle: { 'background-color': '#F5F7FA' },
          // itemStyle: { width: '100%', 'marginRight': 0 },
          dataSource: [],
          tooltipEffect: 'dark',
          columns: yarnCertificateColumns,
          pagination: yarnCertificatePagination
        },
        {
          prop: 'name',
          itemType: 'itemview',
          label: '已选择',
          itemStyle: { 'line-height': '36px' },
          renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
            return `<span style="color: #0986FF;">${value.map(item => item.yarnCertName).join(';')}</span>`
          }
        }
      ]
    }
    // 染纱短纤弹出框基础表头
    const dyeingYarnSpunBaseColumns = [
      {
        prop: 'yarnsBranchName',
        label: '纱支',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'compositionName',
        label: '成分/组合成分',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'dyedYarnColorName',
        label: '染纱颜色',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'fabricGradeName',
        label: '布类等级',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'dyedYarnPrice',
        label: '染纱价格',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      }
    ]
    // 染纱短纤弹出框表头
    const dyeingYarnSpunColumns = [
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
          return (this.dyeingYarnSpunPagination.currentPage - 1) * this.dyeingYarnSpunPagination.pageSize + scope.$index + 1
        }
      },
      ...dyeingYarnSpunBaseColumns
    ]
    // 染纱短纤弹出框分页
    const dyeingYarnSpunPagination = {
      // currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getDyedYarnInfoPage({ ...this.$refs.dyeingYarn.$children[0].formDatas, pageSize: this.dyeingYarnSpunPagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        //
        this.$set(this.dyeingYarnSpunPagination, 'currentPage', 1)
        this.getDyedYarnInfoPage({ pageNum: 1, pageSize: val })
      }
    }
    // 染纱短纤内容
    const dyeingYarnSpunContent = [
      {
        prop: 'yarnsBranch',
        itemType: 'select',
        label: '纱支:',
        filterable: true,
        // clearable: true,
        itemStyle: { width: '25%', 'marginRight': 0 },
        placeholder: '请选择纱支',
        dataSource: [],
        valueType: 'object',
        change: (object, form, formDatas) => { this.getDyedYarnInfoPage(formDatas) }
      },
      {
        prop: 'composition',
        itemType: 'select',
        label: '成分/组合成份:',
        filterable: true,
        // clearable: true,
        itemStyle: { width: '25%', 'marginRight': 0 },
        placeholder: '请选择成分/组合成份',
        dataSource: [],
        valueType: 'object',
        change: (object, form, formDatas) => { this.getDyedYarnInfoPage(formDatas) }
      },
      {
        prop: 'dyedYarnColor',
        itemType: 'select',
        filterable: true,
        label: '染纱颜色:',
        // clearable: true,
        itemStyle: { width: '25%', 'marginRight': 0 },
        placeholder: '请选择染纱颜色',
        dataSource: [],
        valueType: 'object',
        change: (object, form, formDatas) => { this.getDyedYarnInfoPage(formDatas) }
      },
      {
        prop: 'fabricGrade',
        filterable: true,
        itemType: 'select',
        label: '布类等级:',
        // clearable: true,
        itemStyle: { width: '25%', 'marginRight': 0 },
        placeholder: '请选择布类等级',
        dataSource: [],
        valueType: 'object',
        change: (object, form, formDatas) => { this.getDyedYarnInfoPage(formDatas) }
      },
      {
        itemType: 'view',
        text: ``,
        // itemStyle: { width: '100%' },
        style: lineStyle
      },
      {
        prop: 'dyedYarnType',
        itemType: 'tabs',
        label: '',
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        dataSource: [
          {
            label: '短纤',
            value: 'S'
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
        columns: dyeingYarnSpunColumns,
        pagination: dyeingYarnSpunPagination
      }
    ]
    // 染纱长丝弹出框基础表头
    const dyeingYarnFilamentBaseColumns = [
      {
        prop: 'finenessName',
        label: '细度',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'compositionName',
        label: '成分/组合成分',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'dyedYarnColorName',
        label: '染纱颜色',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'fabricGradeName',
        label: '布类等级',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'dyedYarnPrice',
        label: '染纱价格',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      }
    ]
    // 染纱长丝弹出框表头
    const dyeingYarnFilamentColumns = [
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
          return (this.dyeingYarnFilamentPagination.currentPage - 1) * this.dyeingYarnFilamentPagination.pageSize + scope.$index + 1
        }
      },
      ...dyeingYarnFilamentBaseColumns
    ]
    // 染纱长丝弹出框分页
    const dyeingYarnFilamentPagination = {
      // currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getDyedYarnInfoPage({ ...this.$refs.dyeingYarn.$children[0].formDatas, pageSize: this.dyeingYarnFilamentPagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        //
        this.$set(this.dyeingYarnFilamentPagination, 'currentPage', 1)
        this.getDyedYarnInfoPage({ pageNum: 1, pageSize: val })
      }
    }
    // 染纱长丝内容
    const dyeingYarnFilamentContent = [
      {
        prop: 'fineness',
        filterable: true,
        itemType: 'select',
        label: '细度:',
        // clearable: true,
        itemStyle: { width: '25%', 'marginRight': 0 },
        placeholder: '请选择细度',
        dataSource: [],
        valueType: 'object',
        change: (object, form, formDatas) => { this.getDyedYarnInfoPage(formDatas) }
      },
      {
        prop: 'composition',
        filterable: true,
        itemType: 'select',
        label: '成分/组合成份:',
        // clearable: true,
        itemStyle: { width: '25%', 'marginRight': 0 },
        placeholder: '请选择成分/组合成份',
        dataSource: [],
        valueType: 'object',
        change: (object, form, formDatas) => { this.getDyedYarnInfoPage(formDatas) }
      },
      {
        prop: 'dyedYarnColor',
        filterable: true,
        itemType: 'select',
        label: '染纱颜色:',
        // clearable: true,
        itemStyle: { width: '25%', 'marginRight': 0 },
        placeholder: '请选择染纱颜色',
        dataSource: [],
        valueType: 'object',
        change: (object, form, formDatas) => { this.getDyedYarnInfoPage(formDatas) }
      },
      {
        prop: 'fabricGrade',
        filterable: true,
        itemType: 'select',
        label: '布类等级:',
        // clearable: true,
        itemStyle: { width: '25%', 'marginRight': 0 },
        placeholder: '请选择布类等级',
        dataSource: [],
        valueType: 'object',
        change: (object, form, formDatas) => { this.getDyedYarnInfoPage(formDatas) }
      },
      {
        itemType: 'view',
        text: ``,
        // itemStyle: { width: '100%' },
        style: lineStyle
      },
      {
        prop: 'dyedYarnType',
        itemType: 'tabs',
        label: '',
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        dataSource: [
          {
            label: '长丝',
            value: 'F'
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
        columns: dyeingYarnFilamentColumns,
        pagination: dyeingYarnFilamentPagination
      }
    ]
    // 染纱弹出框
    const dyeingYarnPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1240px',
      ok: (params, form, formDatas, setFormDatas) => {
        console.log(params, 'params')
        const tab = params.dyedYarnType === 'S' ? 'dyeingYarnSpunColumns' : 'dyeingYarnFilamentColumns'

        if (this[tab][0].componentsOptions.radio) {
          if (params.dyedYarnType === 'S') {
            this.yarnListS[params.index].yarnDyeingList = [{ ...this[tab][0].componentsOptions.radioData, yarnType: params.tabs }]
          } else {
            this.yarnListF[params.index].yarnDyeingList = [{ ...this[tab][0].componentsOptions.radioData, yarnType: params.tabs }]
          }
          this.yarnList = [...this.yarnListF, ...this.yarnListS]
          this.totalDataList[this.editableTabsValue].yarnList = this.yarnList
        }
        this.closePopDialogHandle(this.dyeingYarnPopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.dyeingYarnPopOptions)
        // this.$set(this.columnsInfos[0].componentsOptions, 'radio', null)
      },
      close: () => {
        this.$set(this.dyeingYarnFilamentColumns[0].componentsOptions, 'radio', null)
        this.$set(this.dyeingYarnSpunColumns[0].componentsOptions, 'radio', null)
        this.$set(this.yarnPopOptions.formDatas, 'radio', null)
      },
      formDatas: {
        // tabs: 'S'
      },
      formOptions: {
        labelWidth: '120px',
        inline: true
      },
      content: dyeingYarnSpunContent
    }
    // 染纱损耗弹出框表头内容
    const yarnDyeingLossColumns = [
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
          return (this.yarnDyeingLossPagination.currentPage - 1) * this.yarnDyeingLossPagination.pageSize + scope.$index + 1
        }
      },
      ...yarnDyeingLossBaseColumns
    ]
    // 染色损耗弹出框分页
    const yarnDyeingLossPagination = {
      // currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getDyedYarnLossInfoPage({ ...this.$refs.yarnDyeingLoss.$children[0].formDatas, pageSize: this.yarnDyeingLossPagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        //
        this.$set(this.spunPagination, 'currentPage', 1)
        this.getDyedYarnLossInfoPage({ pageNum: 1, pageSize: val })
      }
    }
    // 染纱损耗弹出框
    const yarnDyeingLossPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1240px',
      ok: params => {
        if (this.yarnDyeingLossColumns[0].componentsOptions.radio) {
          if (params.tabs === 'S') {
            this.yarnListS[params.index].yarnDyeingList[0].yarnDyeingLossList = [{ ...this.yarnDyeingLossColumns[0].componentsOptions.radioData, yarnType: params.tabs }]
          } else {
            this.yarnListF[params.index].yarnDyeingList[0].yarnDyeingLossList = [{ ...this.yarnDyeingLossColumns[0].componentsOptions.radioData, yarnType: params.tabs }]
          }
          this.yarnList = [...this.yarnListF, ...this.yarnListS]
          this.totalDataList[this.editableTabsValue].yarnList = this.yarnList
        }
        this.closePopDialogHandle(this.yarnDyeingLossPopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.yarnDyeingLossPopOptions)
        // this.$set(this.columnsInfos[0].componentsOptions, 'radio', null)
      },
      close: () => {
        this.$set(this.yarnDyeingLossColumns[0].componentsOptions, 'radio', null)
        this.$set(this.yarnDyeingLossPopOptions.formDatas, 'radio', null)
      },
      formDatas: {
        // tabs: 'S'
      },
      formOptions: {
        labelWidth: '120px',
        inline: true
      },
      content: [
        {
          prop: 'dyedYarnColor',
          itemType: 'select',
          filterable: true,
          label: '染纱颜色:',
          valueType: 'object',
          // clearable: true,
          itemStyle: { width: '25%', 'marginRight': 0 },
          placeholder: '请选择染纱颜色',
          dataSource: [],
          change: (object, form, formDatas) => { this.getDyedYarnLossInfoPage(formDatas) }
        },
        {
          prop: 'composition',
          filterable: true,
          itemType: 'select',
          label: '成分/组合成份:',
          valueType: 'object',
          // clearable: true,
          itemStyle: { width: '25%', 'marginRight': 0 },
          placeholder: '请选择成分/组合成份',
          dataSource: [],
          change: (object, form, formDatas) => { this.getDyedYarnLossInfoPage(formDatas) }
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
          columns: yarnDyeingLossColumns,
          pagination: yarnDyeingLossPagination
        }
      ]
    }
    return {
      // 下面都是纱线的配置信息
      yarnList: [],
      yarnListF: [],
      yarnListS: [],
      yarnPopOptions,
      spunColumns,
      filamentColumns,
      spunPagination,
      filamentPagination,
      yarnBaseContent,
      spunContent,
      filamentContent,
      yarnSpunColumns,
      yarnFilamentColumns,
      yarnOperationColumns,
      dyeingYarnColumns,
      dyeingYarnSpunColumns,
      dyeingYarnSpunBaseColumns,
      dyeingYarnFilamentBaseColumns,
      dyeingYarnFilamentColumns,
      yarnDyeingLossBaseColumns,
      yarnDyeingLossPagination,
      yarnDyeingLossColumns,
      yarnCertificatePopOptions,
      yarnCertificatePagination,
      dyeingYarnPopOptions,
      dyeingYarnSpunContent,
      dyeingYarnFilamentContent,
      yarnDyeingLossPopOptions,
      dyeingYarnFilamentPagination,
      dyeingYarnSpunPagination
    }
  },
  computed: {
    // 纱成本小计
    yarnCostSubtotal() {
      let totalPrice = 0

      this.yarnList.length && this.yarnList.forEach(item => {
        const certPrice = (item.yarnCertList && item.yarnCertList.length !== 0) ? this.$utils.getFloat(item.yarnCertList.map(item => item.yarnCertPrice || 0).reduce((total, item) => total + item), 4) : 0
        let yarnPrice = this.$utils.getFloat((item.yarnPrice + certPrice) * (isNaN(item.yarnPct) ? 0 : item.yarnPct) / 100, 4)
        let dyedYarnPrice = 0
        let dyedyarnLossPct = 0
        if (item.yarnDyeingList && item.yarnDyeingList.length !== 0) {
          dyedYarnPrice = item.yarnDyeingList[0].dyedYarnPrice || 0
          dyedyarnLossPct = (item.yarnDyeingList[0].yarnDyeingLossList && item.yarnDyeingList[0].yarnDyeingLossList.length !== 0) ? item.yarnDyeingList[0].yarnDyeingLossList[0].dyedyarnLossPct : 0

          yarnPrice = this.$utils.getFloat(this.$utils.getFloat((item.yarnPrice + certPrice + dyedYarnPrice) / (1 - dyedyarnLossPct / 100), 4) * (isNaN(item.yarnPct) ? 0 : item.yarnPct) / 100, 4)
        } else {
          dyedYarnPrice = 0
          dyedyarnLossPct = 0
        }
        totalPrice += yarnPrice
      })
      return totalPrice.toFixed(4)
    }
  },
  methods: {
    // 添加纱线弹出框
    yarnPop(scope) {
      this.type = 'add'
      if (this.yarnList.length >= 15) {
        this.$message.warning('数量最多可添加十五个')
        return false
      }
      this.PopDialogHandle(this.yarnPopOptions, '请选择纱线')
      this.$set(this.yarnPopOptions, 'content', this.spunContent)
      this.$set(this.yarnBaseContent[2], 'columns', this.spunColumns)
      this.$set(this.yarnBaseContent[2], 'pagination', this.spunPagination)
      this.getSpunyarnInfoPage()
      this.getSpunyarnInfoOptionsFilled()
      //
      if (this.$refs.yarn && this.$refs.yarn.$refs.popComponents && this.$refs.yarn.$refs.popComponents.$refs.customform) {
        this.$refs.yarn.$refs.popComponents.$refs.customform.setDynamicValidateFormRuleForm({ tabs: 'S' })
      }
    },
    // 添加染纱弹出框
    dyeingYarnPop(type, index) {
      this.type = 'add'
      const tab = type === 'S' ? 'dyeingYarnSpun' : 'dyeingYarnFilament'
      this.PopDialogHandle(this.dyeingYarnPopOptions, '请选择染纱')
      this.getDyedYarnInfoPage({}, type)
      this.getDyedYarnInfoOptionsFilled({}, type)
      this.$set(this.dyeingYarnPopOptions, 'content', this[tab + 'Content'])
      this.$set(this.dyeingYarnPopOptions, 'formDatas', { ...this.dyeingYarnPopOptions.formDatas, index: index, dyedYarnType: type })
    },
    // 添加染纱损耗弹出框
    yarnDyeingLossPop(type, index) {
      this.type = 'add'
      this.PopDialogHandle(this.yarnDyeingLossPopOptions, '请选择染纱损耗')
      this.getDyedYarnLossInfoPage({}, type)
      this.getDyedYarnLossInfoOptionsFilled({}, type)
      this.$set(this.yarnDyeingLossPopOptions, 'formDatas', { ...this.yarnDyeingLossPopOptions.formDatas, index: index, dyedYarnLossType: type, tabs: type })
    },
    // 获取短纤page
    async getSpunyarnInfoPage(data = {}) {
      const res = await priceApi.spunyarnInfoPage({ ...data, status: 1 })
      const dataList = res.data.list || []
      this.spunPagination = {
        ...this.spunPagination,
        dataTotal: res.data ? res.data.total : 0,
        // ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.$set(this.yarnBaseContent[2], 'pagination', this.spunPagination)
      this.$set(this.yarnBaseContent[2], 'dataSource', dataList)
    },
    // 获取短纤下拉框数据
    async getSpunyarnInfoOptionsFilled(data = {}) {
      const res = await priceApi.spunyarnInfoOptionsFilled(data)
      this.completionData(res.data, this.spunContent)
    },
    // 获取长丝page
    async getFilamentInfoPage(data = {}) {
      const res = await priceApi.filamentInfoPage({ ...this.$refs.yarn.$children[0].formDatas, ...data, status: 1 })
      const dataList = res.data.list || []
      this.filamentPagination = {
        ...this.filamentPagination,
        dataTotal: res.data ? res.data.total : 0,
        // ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.$set(this.yarnBaseContent[2], 'pagination', this.filamentPagination)
      this.$set(this.yarnBaseContent[2], 'dataSource', dataList)
    },
    // 获取长丝下拉框数据
    async getFilamentInfoOptionsFilled(data = {}) {
      const res = await priceApi.filamentInfoOptionsFilled(data)
      this.completionData(res.data, this.filamentContent)
    },
    // 获取纱线证书分页
    async getYarnCertInfoPage(data = {}) {
      const res = await priceApi.yarnCertInfoPage({ ...data, status: 1 })
      const dataList = res.data.list || []
      this.yarnCertificatePagination = {
        ...this.yarnCertificatePagination,
        dataTotal: res.data ? res.data.total : 0,
        // ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      const checkedData = this.yarnCertificatePopOptions.formDatas.name || []
      dataList.forEach(item => {
        item.checked = false
        if (checkedData && checkedData.map(itemValue => itemValue.id).includes(item.id)) {
          item.checked = true
        }
      })
      this.$set(this.yarnCertificatePopOptions.content[0], 'pagination', this.yarnCertificatePagination)
      this.$set(this.yarnCertificatePopOptions.content[0], 'dataSource', dataList)
    },
    // 获取染纱短纤/长丝page
    async getDyedYarnInfoPage(data = {}, type) {
      const tab = type === 'S' ? 'dyeingYarnSpun' : 'dyeingYarnFilament'
      const res = await priceApi.dyedYarnInfoPage({ dyedYarnType: type, ...data, status: 1 })
      const dataList = res.data.list || []
      this[tab + 'Pagination'] = {
        ...this[tab + 'Pagination'],
        dataTotal: res.data ? res.data.total : 0,
        // ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.$set(this.dyeingYarnPopOptions.content[6], 'pagination', this[tab + 'Pagination'])
      this.$set(this.dyeingYarnPopOptions.content[6], 'dataSource', dataList)
    },
    // 获取染纱短纤/长丝下拉框数据
    async getDyedYarnInfoOptionsFilled(data = {}, type) {
      const tab = type === 'S' ? 'dyeingYarnSpun' : 'dyeingYarnFilament'
      const res = await priceApi.dyedYarnInfoOptionsFilled({ ...data, dyedYarnType: type, status: 1 })
      this.completionData(res.data, this[tab + 'Content'])
    },
    // 获取染纱损耗短纤/长丝page
    async getDyedYarnLossInfoPage(data = {}, type) {
      const res = await priceApi.dyedYarnLossInfoPage({ dyedYarnLossType: type, ...data, status: 1 })
      const dataList = res.data.list || []
      this.yarnDyeingLossPagination = {
        ...this.yarnDyeingLossPagination,
        dataTotal: res.data ? res.data.total : 0,
        // ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.$set(this.yarnDyeingLossPopOptions.content[3], 'pagination', this.yarnDyeingLossPagination)
      this.$set(this.yarnDyeingLossPopOptions.content[3], 'dataSource', dataList)
    },
    // 获取染纱损耗短纤/长丝下拉框数据
    async getDyedYarnLossInfoOptionsFilled(data = {}, type) {
      const res = await priceApi.dyedYarnLossInfoOptionsFilled({ ...data, dyedYarnLossType: type, status: 1 })
      this.completionData(res.data, this.yarnDyeingLossPopOptions.content)
    }
  }
}
