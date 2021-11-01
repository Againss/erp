import * as priceApi from '../../api/price-index'
import radioButton from '../../components/radio-button.vue'
import recalculation from '../../components/recalculation.vue'
import affordinput from '../../components/affordinput.vue'
export const transport = {
  data() {
    // const max999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/, message: '请输入最大9位整数或保留1到2位小数', trigger: ['blur'] })
    const lineStyle = {
      'border-bottom': '1px solid #E9EFF2',
      'width': '100%',
      'margin-bottom': '20px'
    }

    // 运输成本无运费表头
    const transportNoFreighColumns = [
      {
        prop: 'freightType',
        label: '运费类型',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => '免运费'
      },
      {
        prop: 'freightCoefficient',
        label: '运费系数',
        showOverflowTooltip: true

      }
    ]

    // 运输成本运费弹出框国内基础表头
    const transportFreighDomesticBaseColumns = [
      {
        prop: 'transportWayName',
        label: '运输方式',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'startPlaceName',
        label: '起运地',
        showOverflowTooltip: true
      },
      {
        prop: 'destinationPlaceName',
        label: '目的地',
        showOverflowTooltip: true
      },
      {
        prop: 'minWeight',
        label: '重量区间（千克）',
        showOverflowTooltip: true,
        formater: scope => {
          return `<span>${scope.row.minWeight !== null ? scope.row.minWeight : ''}${scope.row.minWeight !== null && scope.row.maxWeight !== null ? '~' : ''}${scope.row.maxWeight !== null ? scope.row.maxWeight : ''}</span>`
        }
      },
      {
        prop: 'freightCoefficient',
        label: '运费系数',
        showOverflowTooltip: true
      }
    ]
    // 运输成本运费国内基础表头
    const NtransportFreightDomesticViewColumns = [
      {
        prop: 'freightType',
        label: '运费类型',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => '国内运费'
      },
      {
        prop: 'transportWayName',
        label: '运输方式',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'startPlaceName',
        label: '起运地',
        showOverflowTooltip: true
      },
      {
        prop: 'destinationPlaceName',
        label: '目的地',
        showOverflowTooltip: true
      },
      {
        prop: 'minWeight',
        label: '重量区间（千克）',
        showOverflowTooltip: true,
        formater: scope => {
          return `<span>${scope.row.minWeight !== null ? scope.row.minWeight : ''}${scope.row.minWeight !== null && scope.row.maxWeight !== null ? '~' : ''}${scope.row.maxWeight !== null ? scope.row.maxWeight : ''}</span>`
        }
      },
      {
        prop: 'freightCoefficient',
        label: '运费系数',
        showOverflowTooltip: true
      }
    ]
    // 运输成本运费国内弹出框表头
    const transportFreightDomesticViewColumns = [
      {
        prop: 'freightType',
        label: '运费类型',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => '国内运费'
      },
      ...transportFreighDomesticBaseColumns
    ]
    // 运输成本运费国内弹出框表头
    const transportFreightDomesticColumns = [
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
          return (this.transportFreightDomesticPagination.currentPage - 1) * this.transportFreightDomesticPagination.pageSize + scope.$index + 1
        }
      },
      ...transportFreighDomesticBaseColumns
    ]
    // 运输成本运费国内弹出框分页
    const transportFreightDomesticPagination = {
      // currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getFreightPage({ ...this.$refs.freight.$children[0].formDatas, pageSize: this.transportFreightDomesticPagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        //
        this.$set(this.spunPagination, 'currentPage', 1)
        this.getFreightPage({ pageNum: 1, pageSize: val })
      }
    }
    const affordExpenseBurl = (val) => {
      const pattern = /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/

      if (pattern.test(val)) {
        this.isAffordExpense = true
        return false
      } else {
        this.isAffordExpense = false
        // this.priceErrorMessage = '数字且最大九位整数,最多两位小数'
        this.$message({
          type: 'warning',
          message: '数字且最大九位整数,最多两位小数'
        })
      }
    }
    const change = (value) => {
      if ((!value.includes('.')) && value.length > 9) {
        this.freightList[0].affordExpense = value.substr(0, 9)
      } else {
        this.freightList[0].affordExpense = value
      }
      this.freightList.splice(0, 1, ...this.freightList)
      this.totalDataList[this.editableTabsValue].freightList.splice(0, this.totalDataList[this.editableTabsValue].freightList.length, ...this.freightList)
      affordExpenseBurl(this.freightList[0].affordExpense)
      this.copyaffordExpense = this.freightList[0].affordExpense
      this.getFreightCoefficient(this.freightList[0].affordExpense)
    }
    const NexwColumn = [
      {
        prop: 'freightType',
        label: '运费类型',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => '国际运费'
      },
      {
        prop: 'priceClauseName',
        label: '价格条款',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'costBearMethod',
        label: '费用承担方式',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'affordExpense',
        label: '承担费用(RMB)',
        minWidth: '80',
        showOverflowTooltip: true,
        components: {
          affordinput
        },
        componentsOptions: {
          type: 'affordExpense',
          change
        }
        // rules: [max999Reg],
        // editOptions: {
        //   itemType: 'input',
        //   labelWidth: '0',
        //   // rules: [max999Reg],
        //   maxlength: 50,
        //   // blur: (scope) => {
        //   //   affordExpenseBurl(scope.target.value)
        //   // },
        //   change: (value) => {
        //     this.freightList[0].affordExpense = value
        //     //
        //     this.totalDataList[this.editableTabsValue].freightList = this.freightList
        //     affordExpenseBurl(value)
        //     this.copyaffordExpense = value
        //     this.getFreightCoefficient(value)
        //   }
        // }
      },
      {
        prop: 'freightCoefficient',
        label: '运费系数',
        minWidth: '80',
        placeholder: '自动计算',
        showOverflowTooltip: true,
        formater: (scope) => {
          if (this.freightCoefficient || this.freightCoefficient === 0) {
            return this.freightCoefficient
          } else {
            return '自动计算'
          }
        }
        // components: {
        //   recalculation
        // },
        // componentsOptions: {
        //   isFlag: 'isCloth',
        //   prop: 'freightCoefficient',
        //   text: '价格条款为CIF时，运费系数增加',
        //   productCostSubtotal: 'total',
        //   targetProfitRate: 0,
        //   priceClauseName: 'name',
        //   weight: 0
        // }
      }
    ]
    // 运输成本运费弹出框国际基础表头
    const transportFreighInternationalBaseColumns = [
      {
        prop: 'priceClauseName',
        label: '价格条款',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'transportWayName',
        label: '运输方式',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'startPlaceName',
        label: '起运港',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'destinationPlaceName',
        label: '目的港',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'transitDirectType',
        label: '中转/直航',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row[scope.column.property] === 'T' ? '中转' : scope.row[scope.column.property] === 'D' ? '直航' : ''
        }
      },
      {
        prop: 'tightnessType',
        label: '松/紧',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row[scope.column.property] === 'L' ? '松' : scope.row[scope.column.property] === 'T' ? '紧' : ''
        }
      },
      {
        prop: 'freightCoefficient',
        label: '运费系数',
        minWidth: '80',
        showOverflowTooltip: true
      }
    ]
    // 运输成本运费国际弹出框表头
    const NtransportFreightInternationalViewColumns = [
      {
        prop: 'freightType',
        label: '运费类型',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => '国际运费'
      },
      {
        prop: 'priceClauseName',
        label: '价格条款',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'transportWayName',
        label: '运输方式',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'startPlaceName',
        label: '起运港',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'destinationPlaceName',
        label: '目的港',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'transitDirectType',
        label: '中转/直航',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row[scope.column.property] === 'T' ? '中转' : scope.row[scope.column.property] === 'D' ? '直航' : ''
        }
      },
      {
        prop: 'tightnessType',
        label: '松/紧',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row[scope.column.property] === 'L' ? '松' : scope.row[scope.column.property] === 'T' ? '紧' : ''
        }
      },
      {
        prop: 'freightCoefficient',
        label: '运费系数',
        minWidth: '80',
        // showOverflowTooltip: true
        components: {
          recalculation
        },
        componentsOptions: {
          isFlag: false,
          prop: 'freightCoefficient',
          text: '价格条款为CIF时，运费系数增加',
          productCostSubtotal: 'total',
          targetProfitRate: 0,
          priceClauseName: 'name',
          weight: 0
        }
      }
    ]
    // 运输成本运费国际弹出框表头
    const transportFreightInternationalViewColumns = [
      {
        prop: 'freightType',
        label: '运费类型',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => '国际运费'
      },
      ...transportFreighInternationalBaseColumns
    ]
    // 运输成本运费国际弹出框表头
    const transportFreightInternationalColumns = [
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
          return (this.transportFreightInternationalPagination.currentPage - 1) * this.transportFreightInternationalPagination.pageSize + scope.$index + 1
        }
      },
      ...transportFreighInternationalBaseColumns
    ]
    // 运输成本运费国际弹出框分页
    const transportFreightInternationalPagination = {
      currentPage: 1,
      pageSizes: [5],
      pageSize: 5,
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        this.getFreightPage({ ...this.$refs.freight.$children[0].formDatas, pageSize: this.transportFreightInternationalPagination.pageSize || 5, pageNum: val })
      },
      sizeChange: val => {
        //
        this.$set(this.spunPagination, 'currentPage', 1)
        this.getFreightPage({ pageNum: 1, pageSize: val })
      }
    }
    // 运输成本运费弹框基础内容
    const transportFreightBaseContent = [
      {
        itemType: 'view',
        text: ``,
        // itemStyle: { width: '100%' },
        style: lineStyle
      },
      {
        prop: 'freightType',
        itemType: 'tabs',
        label: '',
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        change: value => {
          if (value === 'D') {
            // this.$set(this.transportFreightPopOptions, 'content', this.transportFreightDomesticContent)
            this.$set(this.transportFreightBaseContent[2], 'columns', this.transportFreightDomesticColumns)
            this.$set(this.transportFreightBaseContent[2], 'pagination', this.transportFreightDomesticPagination)
            this.$set(this.transportFreightInternationalColumns[0].componentsOptions, 'radio', null)
          } else if (value === 'I') {
            // this.$set(this.transportFreightPopOptions, 'content', this.transportFreightInternationalContent)
            this.$set(this.transportFreightBaseContent[2], 'columns', this.transportFreightInternationalColumns)
            this.$set(this.transportFreightBaseContent[2], 'pagination', this.transportFreightInternationalPagination)
            this.$set(this.transportFreightDomesticColumns[0].componentsOptions, 'radio', null)
          }
          this.$nextTick(() => {
            this.$set(this.transportFreightPopOptions, 'content', value === 'D' ? this.transportFreightDomesticContent : this.transportFreightInternationalContent)
          })
          this.getFreightPage({ freightType: value })
          this.getFreightOptionsFilled({ freightType: value })
        },
        dataSource: [
          {
            label: '国内运费',
            value: 'D'
          }, {
            label: '国际运费',
            value: 'I'
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
        columns: transportFreightDomesticColumns,
        pagination: transportFreightDomesticPagination
      }
    ]
    // 运输成本运费国内弹框内容
    const transportFreightDomesticContent = [
      {
        prop: 'startPlace',
        filterable: true,
        itemType: 'select',
        label: '起运地:',
        itemStyle: { 'width': '25%', 'marginRight': 0 },
        dataSource: [],
        valueType: 'object',
        change: (object, form, formDatas) => { this.getFreightPage(formDatas) }
      },
      {
        prop: 'destinationPlace',
        filterable: true,
        itemType: 'select',
        label: '目的地:',
        itemStyle: { 'width': '25%', 'marginRight': 0 },
        valueType: 'object',
        dataSource: [],
        change: (object, form, formDatas) => { this.getFreightPage(formDatas) }
      },
      {
        prop: 'transportWay',
        filterable: true,
        itemType: 'select',
        label: '运输方式:',
        itemStyle: { 'width': '25%', 'marginRight': 0 },
        valueType: 'object',
        dataSource: [],
        change: (object, form, formDatas) => { this.getFreightPage(formDatas) }
      },
      ...transportFreightBaseContent
    ]
    // 运输成本运费国内弹框内容
    const transportFreightInternationalContent = [
      {
        prop: 'priceClause',
        filterable: true,
        itemType: 'select',
        label: '价格条款:',
        labelWidth: '80px',
        valueType: 'object',
        itemStyle: { 'width': '25%', 'marginRight': 0 },
        dataSource: [],
        change: (object, form, formDatas) => { this.getFreightPage(formDatas) }
      },
      {
        prop: 'transportWay',
        filterable: true,
        itemType: 'select',
        label: '运输方式:',
        labelWidth: '80px',
        valueType: 'object',
        itemStyle: { 'width': '25%', 'marginRight': 0 },
        dataSource: [],
        change: (object, form, formDatas) => { this.getFreightPage(formDatas) }
      },
      {
        prop: 'startPlace',
        filterable: true,
        itemType: 'select',
        label: '起运地:',
        labelWidth: '80px',
        valueType: 'object',
        itemStyle: { 'width': '25%', 'marginRight': 0 },
        dataSource: [],
        change: (object, form, formDatas) => { this.getFreightPage(formDatas) }
      },
      {
        prop: 'destinationPlace',
        filterable: true,
        itemType: 'select',
        label: '目的地:',
        labelWidth: '80px',
        valueType: 'object',
        itemStyle: { 'width': '25%', 'marginRight': 0 },
        dataSource: [],
        change: (object, form, formDatas) => { this.getFreightPage(formDatas) }
      },
      {
        prop: 'transitDirectType',
        filterable: true,
        itemType: 'select',
        label: '中转/直航:',
        itemStyle: { 'width': '25%', 'marginRight': 0 },
        labelWidth: '80px',
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '中转',
            value: 'T'
          },
          {
            label: '直航',
            value: 'D'
          }
        ],
        change: (object, form, formDatas) => { this.getFreightPage(formDatas) }
      },
      {
        prop: 'tightnessType',
        filterable: true,
        itemType: 'select',
        label: '松/紧:',
        itemStyle: { 'width': '25%', 'marginRight': 0 },
        labelWidth: '80px',
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '松',
            value: 'L'
          },
          {
            label: '紧',
            value: 'T'
          }
        ],
        change: (object, form, formDatas) => { this.getFreightPage(formDatas) }
      },
      ...transportFreightBaseContent
    ]
    // 运输成本运费弹出框
    const transportFreightPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1240px',
      ok: (params, form, formDatas, setFormDatas) => {
        this.isExw = false
        this.isTransport = false
        //
        const tab = params.freightType === 'D' ? 'transportFreightDomesticColumns' : 'transportFreightInternationalColumns'
        //
        if (this[tab][0].componentsOptions.radio) {
          //
          if (this[tab][0].componentsOptions.radioData.priceClauseName === 'EXW') {
            this.freightCoefficient = null
            this[tab][0].componentsOptions.radioData.costBearMethod = '我方承担'
          }
          this.freightList = [{ ...this[tab][0].componentsOptions.radioData, freightType: params.freightType }]

          this.totalDataList[this.editableTabsValue].freightList = this.freightList
        }
        this.closePopDialogHandle(this.transportFreightPopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.transportFreightPopOptions)
      },
      close: () => {
        this.$set(this.transportFreightDomesticColumns[0].componentsOptions, 'radio', null)
        this.$set(this.transportFreightInternationalColumns[0].componentsOptions, 'radio', null)
        this.$set(this.transportFreightPopOptions.formDatas, 'radio', null)
      },
      formDatas: {
        freightType: 'D'
      },
      formOptions: {
        labelWidth: '80px',
        inline: true
      },
      content: transportFreightDomesticContent
    }
    return {
      isTransport: false, // 当价格条款为CIF时，计算运费系数
      isExw: false, // 当价格条款为EXW时，计算运费系数
      // 运输成本
      freightList: [],
      transportFreightPopOptions,
      transportFreightDomesticColumns,
      transportFreightInternationalColumns,
      transportFreightDomesticPagination,
      transportFreightInternationalPagination,
      transportFreightBaseContent,
      transportFreightDomesticContent,
      transportFreightInternationalContent,
      transportNoFreighColumns,
      transportFreightDomesticViewColumns,
      transportFreightInternationalViewColumns,
      NtransportFreightDomesticViewColumns,
      NtransportFreightInternationalViewColumns,
      NexwColumn,
      freightCoefficient: 0, // 当价格条款为EXW时，运费系数
      copyaFfordExpense: 0, // 承担费用change时将他的值备份给数量做计算
      isAffordExpense: false // 承担费用是否填写正确
    }
  },
  computed: {
    // 运输成本小计
    transportSubtotal() {
      this.isTransport = false
      this.isExw = false
      let CifFreightCoefficient = 0
      let totalPrice = 0

      if (this.freightList.length && this.freightList[0].priceClauseName === 'CIF') {
        CifFreightCoefficient = 0
        this.isTransport = true
        this.$set(this.NtransportFreightInternationalViewColumns[7].componentsOptions, 'priceClauseName', 'CIF')
        this.$set(this.NtransportFreightInternationalViewColumns[7].componentsOptions, 'productCostSubtotal', this.productCostSubtotal)
        this.$set(this.NtransportFreightInternationalViewColumns[7].componentsOptions, 'targetProfitRate', this.areaData && this.areaData.targetProfitRate)
        this.freightList && this.freightList.forEach(fitem => {
          CifFreightCoefficient = this.$utils.getFloat(fitem.freightCoefficient * 2 + this.$utils.getFloat(this.$utils.getFloat(0.5 / 100 * this.productCostSubtotal, 4) * this.$utils.getFloat((1 + this.areaData.targetProfitRate / 100), 4), 4), 4)
        })
      }
      //
      if (this.freightList.length && this.freightList[0].priceClauseName === 'EXW') {
        CifFreightCoefficient = 0
        this.isTransport = false
        this.isExw = true
        this.isAffordExpense = true
        // this.$set(this.NexwColumn[4].componentsOptions, 'priceClauseName', 'EXW')
        // this.$set(this.NexwColumn[4].componentsOptions, 'weight', this.quantityData && this.quantityData[0].weight)
        this.freightList && this.freightList.forEach(fitem => {
          this.isAffordExpense && this.getFreightCoefficient(fitem.affordExpense)
          // fitem.affordExpense = fitem.affordExpense
          if (this.quantityData[0] && this.quantityData[0].weight && fitem.affordExpense) {
            CifFreightCoefficient = fitem.affordExpense / (this.quantityData && this.quantityData[0] && this.quantityData[0].weight)
          }
        })
      }
      this.$set(this.NtransportFreightInternationalViewColumns[7].componentsOptions, 'isFlag', this.isTransport)
      this.freightList.length && this.freightList.forEach(item => {
        item.edit = true
        if (this.isTransport || this.isExw) {
          totalPrice += (CifFreightCoefficient || 0)
        } else {
          totalPrice += (item.freightCoefficient || 0)
        }
      })
      return this.$utils.getFloat(totalPrice, 4)
    }
  },
  methods: {
    change(value) {
      if ((!value.includes('.')) && value.length > 9) {
        this.freightList[0].affordExpense = value.substr(0, 9)
      } else {
        this.freightList[0].affordExpense = value
      }
      this.freightList.splice(0, 1)
      // dataList.fabricList[this.editableTabsValue][item] && this[item].push(...dataList.fabricList[this.editableTabsValue][item])
      // this.freightList.splice(0, 1, ...this.freightList)
      this.freightList.push(...this.freightList)
      //
      // this.totalDataList[this.editableTabsValue].freightList.splice(0, this.totalDataList[this.editableTabsValue].freightList.length, ...this.freightList)
      this.totalDataList[this.editableTabsValue].freightList = this.freightList
      this.affordExpenseBurl(this.freightList[0].affordExpense)
      this.copyaffordExpense = this.freightList[0].affordExpense
      this.getFreightCoefficient(this.freightList[0].affordExpense)
    },
    // affordExpenseBurl(val){
    //   const pattern = /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/
    //
    //   if (pattern.test(val)) {
    //     this.isAffordExpense = true
    //     return false
    //   } else {
    //     this.isAffordExpense = false
    //     // this.priceErrorMessage = '数字且最大九位整数,最多两位小数'
    //     this.$message({
    //       type: 'warning',
    //       message: '数字且最大九位整数,最多两位小数'
    //     })
    //   }
    // },
    getFreightCoefficient(value) {
      if (value) {
        if (this.isAffordExpense) {
          this.freightCoefficient = this.$utils.getFloat(value / (this.quantityData && this.quantityData[0] && this.quantityData[0].weight), 4)
        } else if (this.quantityData && this.quantityData[0] && this.quantityData[0].weight === '999999999.99') {
          this.freightCoefficient = 0
        } else {
          this.freightCoefficient = '自动计算'
        }
      } else {
        this.freightCoefficient = '自动计算'
      }
    },
    // 添加运输运费弹出框
    transportFreightPop(type) {
      this.type = 'add'
      this.PopDialogHandle(this.transportFreightPopOptions, '请选择运费')
      this.$set(this.transportFreightPopOptions, 'content', this.transportFreightDomesticContent)
      this.$set(this.transportFreightBaseContent[2], 'columns', this.transportFreightDomesticColumns)
      this.$set(this.transportFreightBaseContent[2], 'pagination', this.transportFreightDomesticPagination)
      this.getFreightPage({ freightType: type })
      this.getFreightOptionsFilled({ freightType: type })
      this.$nextTick(() => {
        this.$refs.freight.$refs.popComponents.$refs.customform.setDynamicValidateFormRuleForm({ freightType: 'D' })
      })
    },
    // 获取运输运费page
    async getFreightPage(data = {}) {
      const tab = data.freightType === 'D' ? 'transportFreightDomestic' : 'transportFreightInternational'
      const res = await priceApi.freightPage({ ...data, status: 1 })
      const dataList = res.data.list || []
      this[tab + 'Pagination'] = {
        ...this[tab + 'Pagination'],
        dataTotal: res.data ? res.data.total : 0,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.$set(this.transportFreightBaseContent[2], 'pagination', this[tab + 'Pagination'])
      this.$set(this.transportFreightBaseContent[2], 'dataSource', dataList)
    },
    // 获取运输运费下拉框数据
    async getFreightOptionsFilled(data = {}) {
      const tab = data.freightType === 'D' ? 'transportFreightDomestic' : 'transportFreightInternational'
      const res = await priceApi.freightOptionsFilled({ ...data, status: 1 })
      this.completionData(res.data, this[tab + 'Content'])
    },
    // 免运费
    freeFreight() {
      this.freightList = [{ freightType: 'N', freightCoefficient: 0 }]
      this.totalDataList[this.editableTabsValue].freightList = this.freightList
    }
  }
}
