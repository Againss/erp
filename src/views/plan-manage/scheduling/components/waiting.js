import { unrepeatList } from '../api/index.js'
// 待复期
export const waiting = {
  data() {
    const itemStyle = { 'width': '32%', 'padding-right': '10px' }
    // 查询
    const searchData = {
      _orderNo: {
        prop: 'orderNo',
        itemType: 'input',
        label: '订单号',
        clearable: true,
        placeholder: '请输入订单号',
        itemStyle
      },

      _customerName: {
        prop: 'customerName',
        itemType: 'input',
        label: '客户',
        clearable: true,
        placeholder: '请输入客户',
        itemStyle
      },

      _salesTeamName: {
        prop: 'salesTeamName',
        itemType: 'input',
        label: '销售团队',
        clearable: true,
        placeholder: '请输入销售团队',
        itemStyle
      },
      _orderStartDate: {
        prop: 'orderStartDate',
        itemType: 'date',
        type: 'daterange',
        itemStyle,
        label: '下单日期',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59']

      },
      _orderStartDelivery: {
        prop: 'orderStartDelivery',
        label: '订单交期',
        itemType: 'date',
        type: 'daterange',
        itemStyle,
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59']
      },
      _clothType: {
        prop: 'clothType',
        itemType: 'input',
        label: '布类',
        clearable: true,
        placeholder: '请输入布类',
        itemStyle
      },
      _yarnName: {
        prop: 'yarnName',
        itemType: 'input',
        label: '纱名',
        clearable: true,
        placeholder: '请输入纱名',
        itemStyle
      },
      _yarnAttr: {
        prop: 'yarnAttr',
        itemType: 'input',
        label: '纱属性',
        clearable: true,
        placeholder: '请输入纱属性',
        itemStyle
      },
      _targetYarnVar: {
        prop: 'targetYarnVar',
        itemType: 'select',
        // valueType: 'object',
        label: '目标纱期',
        placeholder: '请选择',
        itemStyle: {
          'width': '16%',
          'padding-right': '5px'

        },
        dataSource: [
          {
            label: 'Y',
            value: 'Y'
          }, {
            label: 'N',
            value: 'N'
          }
        ]
      },
      _purchaseRepeatVar: {
        prop: 'purchaseRepeatVar',
        label: '采购复期',
        itemType: 'select',
        // valueType: 'object',
        placeholder: '请选择',
        itemStyle: {
          'width': '16%',
          'margin-left': '5px'
        },
        labelWidth: '70px',
        dataSource: [
          {
            label: 'Y',
            value: 'Y'
          }, {
            label: 'N',
            value: 'N'
          }
        ]
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          // this.formDatas = params
          // debugger
          const orderStartDate = params.orderStartDate && params.orderStartDate[0] || ''
          const orderEndDate = params.orderStartDate && params.orderStartDate[1] || ''

          const orderStartDelivery = params.orderStartDelivery && params.orderStartDelivery[0] || ''
          const orderEndDelivery = params.orderStartDelivery && params.orderStartDelivery[1] || ''

          this.formDatas = {
            ...params,
            orderStartDate,
            orderEndDate,
            orderStartDelivery,
            orderEndDelivery
          }
          this.getUnrepeatList()
        },
        resetHandle: () => {
          this.searchFormDatas = {}
          this.formDatas = {}
          this.formDatas.sorts = []// 自定义表格内排序
          this.formDatas.status = this.activeName// 自定义表格内排序
          this.$refs.tableList.$refs.table.clearSort()
        }
      }
    }
    const waitingColumns = [
      // {
      //   prop: 'code',
      //   label: '序号',
      //   width: '80'
      // },
      {
        prop: 'orderNo',
        label: '订单号',
        minWidth: '180',
        showOverflowTooltip: true,
        permitTag: ['techManage:tmKnitTech:page'],
        // handle: (scope) => {
        //   this.showRight = true
        //   this.currentId = scope.row.id
        //   this.suBpageList({ id: scope.row.id })
        //   if (this.showRight) {
        //     this.$nextTick(() => {
        //       this.initScreenWidth()
        //       this.detailTableHeight = this.$refs.detailTable.offsetHeight + ''
        //     })
        //   }
        // },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'orderTime',
        label: '开单日期',
        showOverflowTooltip: true,
        minWidth: '140',
        formater: (scope) => {
          return scope.row.orderTime ? this.$filters.parseTime(
            scope.row.orderTime,
            '{y}-{m}-{d} {h}:{i}'
          ) : ''
        }
      },

      {
        prop: 'salesTeamName',
        label: '销售团队',
        showOverflowTooltip: true,
        minWidth: '150'
        // formater: (scope) => {
        //   const type = {
        //     'B': '大货',
        //     'S': '样板',
        //     'R': '备坯',
        //     'C': '补布'
        //   }
        //   return type[scope.row.salesTeamName]
        // }
      },
      {
        prop: 'customerName',
        label: '客户',

        showOverflowTooltip: true
      }

    ]
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        debugger
        this.changePageCoreRecordData()
        this.formDatas.pageSize = this.pagination.pageSize || 20
        this.formDatas.pageNum = val
        this.getUnrepeatList()
      },
      sizeChange: val => {
        this.changePageCoreRecordData()
        this.formDatas.pageSize = val
        this.formDatas.pageNum = this.pagination.pageNum || 1
        this.getUnrepeatList()
      }
    }
    const selection = {
      selection: true,
      selectionLabel: '全部'
    }
    const detailColumns = {
      _code: {
        prop: 'code',
        label: '序号',
        width: '80',
        formater: scope => scope.$index + 1
      },
      _orderNo: {
        prop: 'orderNo',
        label: '订单号',
        minWidth: '180',
        showOverflowTooltip: true
      },
      _delivery: {
        prop: 'delivery',
        label: '交期',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => scope.row.delivery && this.$filters.parseTime(scope.row.delivery, '{y}-{m}-{d}') || ''
      },
      _targetYarnDate: {
        prop: 'targetYarnDate',
        label: '目标纱期',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.targetYarnDate && this.$filters.parseTime(scope.row.targetYarnDate, '{y}-{m}-{d}') || ''
      },
      _num: {
        prop: 'num',
        label: '数量kg',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _yarnName: {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '200',
        showOverflowTooltip: true,
        formater: (scope) => {
          let data = []
          let str = ''
          if (scope.row.yarnName) {
            data = scope.row.yarnName.split(',')
            data.forEach(v => {
              if (v !== 'null') {
                str += `<p style="margin: 0;">${v}</p>`
              }
            })
          }
          return str
        }
      },
      _yarnAttr: {
        prop: 'yarnAttr',
        label: '纱属性',
        minWidth: '200',
        showOverflowTooltip: true,
        formater: (scope) => {
          let data = []
          let str = ''
          if (scope.row.yarnAttr) {
            data = scope.row.yarnAttr.split(',')
            data.forEach(v => {
              if (v !== 'null') {
                str += `<p style="margin: 0;">${v}</p>`
              }
            })
          }
          return str
        }
      },
      _garmentPartName: {
        prop: 'garmentPartName',
        label: '成衣部位',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _clothType: {
        prop: 'clothType',
        label: '布类',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _colorType: {
        prop: 'colorType',
        label: '颜色分类',
        width: '80'
      },

      _productNo: {
        prop: 'productNo',
        label: '产品编码',
        minWidth: '190',
        showOverflowTooltip: true
      },
      _dyeCraft: {
        prop: 'dyeCraft',
        label: '工艺要求',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          let data = []
          let str = ''
          if (scope.row.dyeCraft) {
            data = JSON.parse(scope.row.dyeCraft)
            data.forEach(v => {
              str += `<span>${v.name}</span> `
            })
          }
          return str
        }
      },
      _element: {
        prop: 'element',
        label: '成份比例',
        minWidth: '200',
        showOverflowTooltip: true,
        formater: (scope) => {
          let data = []
          let str = ''
          if (scope.row.element) {
            data = JSON.parse(scope.row.element)
            data.forEach(v => {
              str += `<p style="margin: 0;">${v.ratio}%${v.elementName}</p>`
            })
          }
          return str
        }
      },
      _produceProcess: {
        prop: 'produceProcess',
        label: '生产流程',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _purchaseRepeatDate: {
        prop: 'purchaseRepeatDate',
        label: '采购复期',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.purchaseRepeatDate && this.$filters.parseTime(scope.row.purchaseRepeatDate, '{y}-{m}-{d}') || ''
      },
      _customerColor: {
        prop: 'customerColor',
        label: '客户颜色',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _planCloseColorYarnDate: {
        prop: 'planCloseColorYarnDate',
        label: '计划结束色纱期',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.planCloseColorYarnDate && this.$filters.parseTime(scope.row.planCloseColorYarnDate, '{y}-{m}-{d}') || ''
      },
      _planCloseGreyDate: {
        prop: 'planCloseGreyDate',
        label: '计划结束坯期',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.planCloseGreyDate && this.$filters.parseTime(scope.row.planCloseGreyDate, '{y}-{m}-{d}') || ''
      },
      _planClosePrintClothDate: {
        prop: 'planClosePrintClothDate',
        label: '计划结束印花布期',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && this.$filters.parseTime(scope.row.planClosePrintClothDate, '{y}-{m}-{d}') || ''
      },

      _theoryYarnDate: {
        prop: 'theoryYarnDate',
        label: '理论纱期',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.theoryYarnDate && this.$filters.parseTime(scope.row.theoryYarnDate, '{y}-{m}-{d}') || ''
      },
      _theoryYarnDateS: {
        prop: 'theoryYarnDateS',
        label: '理论色纱期_S',
        minWidth: '160',
        formater: scope => scope.row.theoryYarnDateS && this.$filters.parseTime(scope.row.theoryYarnDateS, '{y}-{m}-{d}') || ''
      },
      _theoryYarnDateE: {
        prop: 'theoryYarnDateE',
        label: '理论色纱期_E',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.theoryYarnDateE && this.$filters.parseTime(scope.row.theoryYarnDateE, '{y}-{m}-{d}') || ''
      },
      _theoryGreyDateS: {
        prop: 'theoryGreyDateS',
        label: '理论坯期_S',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.theoryGreyDateS && this.$filters.parseTime(scope.row.theoryGreyDateS, '{y}-{m}-{d}') || ''
      },
      _theoryGreyDateE: {
        prop: 'theoryGreyDateE',
        label: '理论坯期_E',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.theoryGreyDateE && this.$filters.parseTime(scope.row.theoryGreyDateE, '{y}-{m}-{d}') || ''
      },
      _theoryColorClothDateS: {
        prop: 'theoryColorClothDateS',
        label: '理论色布期_S',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.theoryColorClothDateS && this.$filters.parseTime(scope.row.theoryColorClothDateS, '{y}-{m}-{d}') || ''
      },
      _theoryColorClothDateE: {
        prop: 'theoryColorClothDateE',
        label: '理论色布期_E',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.theoryColorClothDateE && this.$filters.parseTime(scope.row.theoryColorClothDateE, '{y}-{m}-{d}') || ''
      },

      _theoryPrintClothDateS: {
        prop: 'theoryPrintClothDateS',
        label: '理论印花布期_S',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.theoryPrintClothDateS && this.$filters.parseTime(scope.row.theoryPrintClothDateS, '{y}-{m}-{d}') || ''
      },
      _theoryPrintClothDateE: {
        prop: 'theoryPrintClothDateE',
        label: '理论印花布期_E',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.theoryPrintClothDateE && this.$filters.parseTime(scope.row.theoryPrintClothDateE, '{y}-{m}-{d}') || ''
      },
      // _whetherRapid: {
      //   prop: 'whetherRapid',
      //   label: '急单',
      //   minWidth: '140',
      //   showOverflowTooltip: true
      // },
      _area: {
        prop: 'area',
        label: '区域',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _code41: {
        prop: '_code41',
        label: '销售员',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _planRemark: {
        prop: 'planRemark',
        label: '计划备注',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _styleNumber: {
        prop: 'styleNumber',
        label: '款号',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _sendYarnDate: {
        prop: 'sendYarnDate',
        label: '纱期送审',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.sendYarnDate && this.$filters.parseTime(scope.row.sendYarnDate, '{y}-{m}-{d}') || ''
      },
      _suggestWidth: {
        prop: 'suggestWidth',
        label: '幅宽',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => scope.row.suggestWidth && scope.row.suggestWidth + '"' || ''
      },
      _suggestWeight: {
        prop: 'suggestWeight',
        label: '克重',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property] + 'g/m²' || ''
      },

      _planDelivery: {
        prop: 'planDelivery',
        label: '计划复期',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.planDelivery && this.$filters.parseTime(scope.row.planDelivery, '{y}-{m}-{d}') || ''
      },
      _deliveryConfirm: {
        prop: 'deliveryConfirm',
        label: '交期确认',
        minWidth: '160',
        showOverflowTooltip: true
      },

      _planStartColorYarnDate: {
        prop: 'planStartColorYarnDate',
        label: '计划开始色纱期',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.planStartColorYarnDate && this.$filters.parseTime(scope.row.planStartColorYarnDate, '{y}-{m}-{d}') || ''
      },

      _planStartGreyDate: {
        prop: 'planStartGreyDate',
        label: '计划开始坯期',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.planStartGreyDate && this.$filters.parseTime(scope.row.planStartGreyDate, '{y}-{m}-{d}') || ''
      },

      _planStartColorClothDate: {
        prop: 'planStartColorClothDate',
        label: '计划开始色布期',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.planStartColorClothDate && this.$filters.parseTime(scope.row.planStartColorClothDate, '{y}-{m}-{d}') || ''
      },
      _planCloseColorClothDate: {
        prop: 'planCloseColorClothDate',
        label: '计划结束色布期',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.planCloseColorClothDate && this.$filters.parseTime(scope.row.planCloseColorClothDate, '{y}-{m}-{d}') || ''
      },
      _planStartPrintClothDate: {
        prop: 'planStartPrintClothDate',
        label: '计划开始印花布期',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && this.$filters.parseTime(scope.row.planStartPrintClothDate, '{y}-{m}-{d}') || ''
      },

      _rapidOrderRemark: {
        prop: 'rapidOrderRemark',
        label: '急单备注',
        minWidth: '140',
        showOverflowTooltip: true
      }

    }

    const topDetailColumns = {
      _id: {
        prop: 'id',
        type: 'selection',
        fixed: 'left',
        isShow: scope => {
          return true
        }
      },
      _code: {
        prop: 'code',
        label: '序号',
        fixed: 'left',
        width: '80',
        formater: scope => scope.$index + 1
      },
      _orderNo: {
        prop: 'orderNo',
        label: '订单号',
        minWidth: '180',
        showOverflowTooltip: true
      },
      _delivery: {
        prop: 'delivery',
        label: '交期',
        minWidth: '100',
        sortable: 'custom',
        showOverflowTooltip: true,
        formater: scope => scope.row.delivery && this.$filters.parseTime(scope.row.delivery, '{y}-{m}-{d}') || ''
      },
      _garmentId: {
        prop: 'garmentId',
        label: '成衣ID',
        minWidth: '100',
        sortable: 'custom',
        showOverflowTooltip: true
      },
      _garmentPartName: {
        prop: 'garmentPartName',
        label: '成衣部位',
        minWidth: '100',
        sortable: 'custom',
        showOverflowTooltip: true
      },
      _num: {
        prop: 'num',
        label: '数量kg',
        minWidth: '100',
        sortable: 'custom',
        showOverflowTooltip: true
      },
      _produceProcess: {
        prop: 'produceProcess',
        label: '生产流程',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _targetYarnDate: {
        prop: 'targetYarnDate',
        label: '目标纱期',
        minWidth: '120',
        sortable: 'custom',
        showOverflowTooltip: true,
        formater: scope => scope.row.targetYarnDate && this.$filters.parseTime(scope.row.targetYarnDate, '{y}-{m}-{d}') || ''
      },
      _purchaseRepeatDate: {
        prop: 'purchaseRepeatDate',
        label: '采购复期',
        minWidth: '120',
        sortable: 'custom',
        showOverflowTooltip: true,
        formater: scope => scope.row.purchaseRepeatDate && this.$filters.parseTime(scope.row.purchaseRepeatDate, '{y}-{m}-{d}') || ''
      },
      _planCloseColorYarnDate: {
        prop: 'planCloseColorYarnDate',
        label: '计划结束色纱期',
        minWidth: '140',
        sortable: 'custom',
        showOverflowTooltip: true,
        formater: scope => scope.row.planCloseColorYarnDate && this.$filters.parseTime(scope.row.planCloseColorYarnDate, '{y}-{m}-{d}') || ''
      },
      _planCloseGreyDate: {
        prop: 'planCloseGreyDate',
        label: '计划结束坯期',
        sortable: 'custom',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => scope.row.planCloseGreyDate && this.$filters.parseTime(scope.row.planCloseGreyDate, '{y}-{m}-{d}') || ''
      },
      _planCloseColorClothDate: {
        prop: 'planCloseColorClothDate',
        label: '计划结束色布期',
        minWidth: '140',
        sortable: 'custom',
        showOverflowTooltip: true,
        formater: scope => scope.row.planCloseColorClothDate && this.$filters.parseTime(scope.row.planCloseColorClothDate, '{y}-{m}-{d}') || ''
      },
      _planClosePrintClothDate: {
        prop: 'planClosePrintClothDate',
        label: '计划结束印花布期',
        sortable: 'custom',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && this.$filters.parseTime(scope.row.planClosePrintClothDate, '{y}-{m}-{d}') || ''
      },
      _planDelivery: {
        prop: 'planDelivery',
        label: '计划复期',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => scope.row.planDelivery && this.$filters.parseTime(scope.row.planDelivery, '{y}-{m}-{d}') || ''
      },

      _customerName: {
        prop: 'customerName',
        label: '客户',
        minWidth: '100',
        showOverflowTooltip: true
      },
      _customerServiceName: {
        prop: 'customerServiceName',
        label: '客服',
        minWidth: '100',
        showOverflowTooltip: true
      },

      _customerColor: {
        prop: 'customerColor',
        label: '客户颜色',
        minWidth: '100',
        showOverflowTooltip: true
      },

      _colorType: {
        prop: 'colorType',
        label: '色级',
        minWidth: '100',
        sortable: 'custom',
        showOverflowTooltip: true
      },

      _clothType: {
        prop: 'clothType',
        label: '布类',
        minWidth: '100',
        sortable: 'custom',
        showOverflowTooltip: true
      },

      _yarnName: {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '200',
        sortable: 'custom',
        showOverflowTooltip: true,
        formater: (scope) => {
          let data = []
          let str = ''
          if (scope.row.yarnName) {
            data = scope.row.yarnName.split(',')
            data.forEach(v => {
              if (v !== 'null') {
                str += `<p style="margin: 0;">${v}</p>`
              }
            })
          }
          return str
        }
      },
      _yarnAttr: {
        prop: 'yarnAttr',
        label: '纱属性',
        minWidth: '200',
        sortable: 'custom',
        showOverflowTooltip: true,
        formater: (scope) => {
          let data = []
          let str = ''
          if (scope.row.yarnAttr) {
            data = scope.row.yarnAttr.split(',')
            data.forEach(v => {
              if (v !== 'null') {
                str += `<p style="margin: 0;">${v}</p>`
              }
            })
          }
          return str
        }
      },

      // _productNo: {
      //   prop: 'productNo',
      //   label: '产品编码',
      //   minWidth: '190',
      //   showOverflowTooltip: true
      // },
      _element: {
        prop: 'element',
        label: '成份比例',
        minWidth: '200',
        showOverflowTooltip: true,
        formater: (scope) => {
          let data = []
          let str = ''
          if (scope.row.element) {
            data = JSON.parse(scope.row.element)
            data.forEach(v => {
              str += `<p style="margin: 0;">${v.ratio}%${v.elementName}</p>`
            })
          }
          return str
        }
      },
      _dyeCraft: {
        prop: 'dyeCraft',
        label: '工艺要求',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          let data = []
          let str = ''
          if (scope.row.dyeCraft) {
            data = JSON.parse(scope.row.dyeCraft)
            data.forEach(v => {
              str += `<span>${v.name}</span> `
            })
          }
          return str
        }
      },
      _deliveryConfirm: {
        prop: 'deliveryConfirm',
        label: '交期确认',
        minWidth: '160',
        showOverflowTooltip: true
      }

    }
    const bottomDetailColumns = {
      _id: {
        prop: 'id',
        type: 'selection',
        fixed: 'left',
        isShow: scope => {
          return true
        }
      },
      _code: {
        prop: 'code',
        label: '序号',
        fixed: 'left',
        width: '80',
        formater: scope => scope.$index + 1
      },
      _suggestWidth: {
        prop: 'suggestWidth',
        label: '幅宽',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => scope.row.suggestWidth && scope.row.suggestWidth + '"' || ''
      },
      _suggestWeight: {
        prop: 'suggestWeight',
        label: '克重',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property] + 'g/m²' || ''
      },
      _styleNumber: {
        prop: 'styleNumber',
        label: '款号',
        minWidth: '100',
        showOverflowTooltip: true
      },
      _area: {
        prop: 'area',
        label: '区域',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _code41: {
        prop: '_code41',
        label: '销售员',
        minWidth: '100',
        showOverflowTooltip: true
      },
      _whetherRapid: {
        prop: 'whetherRapid',
        label: '急单',
        minWidth: '100',
        showOverflowTooltip: true
      },
      _planRemark: {
        prop: 'planRemark',
        label: '计划备注',
        minWidth: '120',
        showOverflowTooltip: true
      },

      _sendYarnDate: {
        prop: 'sendYarnDate',
        label: '纱期送审',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.sendYarnDate && this.$filters.parseTime(scope.row.sendYarnDate, '{y}-{m}-{d}') || ''
      },
      _stitchNum: {
        prop: 'stitchNum',
        label: '针数',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _inch: {
        prop: 'inch',
        label: '寸数',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _totalStitchNum: {
        prop: 'totalStitchNum',
        label: '总针数',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _fabricColorNo: {
        prop: 'fabricColorNo',
        label: '智布色号',
        minWidth: '120',
        showOverflowTooltip: true
      },

      _theoryYarnDate: {
        prop: 'theoryYarnDate',
        label: '理论纱期',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.theoryYarnDate && this.$filters.parseTime(scope.row.theoryYarnDate, '{y}-{m}-{d}') || ''
      },
      _theoryYarnDateS: {
        prop: 'theoryYarnDateS',
        label: '理论色纱期_S',
        minWidth: '160',
        formater: scope => scope.row.theoryYarnDateS && this.$filters.parseTime(scope.row.theoryYarnDateS, '{y}-{m}-{d}') || ''
      },
      _theoryYarnDateE: {
        prop: 'theoryYarnDateE',
        label: '理论色纱期_E',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.theoryYarnDateE && this.$filters.parseTime(scope.row.theoryYarnDateE, '{y}-{m}-{d}') || ''
      },
      _theoryGreyDateS: {
        prop: 'theoryGreyDateS',
        label: '理论坯期_S',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.theoryGreyDateS && this.$filters.parseTime(scope.row.theoryGreyDateS, '{y}-{m}-{d}') || ''
      },
      _theoryGreyDateE: {
        prop: 'theoryGreyDateE',
        label: '理论坯期_E',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.theoryGreyDateE && this.$filters.parseTime(scope.row.theoryGreyDateE, '{y}-{m}-{d}') || ''
      },
      _theoryColorClothDateS: {
        prop: 'theoryColorClothDateS',
        label: '理论色布期_S',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.theoryColorClothDateS && this.$filters.parseTime(scope.row.theoryColorClothDateS, '{y}-{m}-{d}') || ''
      },
      _theoryColorClothDateE: {
        prop: 'theoryColorClothDateE',
        label: '理论色布期_E',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.theoryColorClothDateE && this.$filters.parseTime(scope.row.theoryColorClothDateE, '{y}-{m}-{d}') || ''
      },

      _theoryPrintClothDateS: {
        prop: 'theoryPrintClothDateS',
        label: '理论印花布期_S',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.theoryPrintClothDateS && this.$filters.parseTime(scope.row.theoryPrintClothDateS, '{y}-{m}-{d}') || ''
      },
      _theoryPrintClothDateE: {
        prop: 'theoryPrintClothDateE',
        label: '理论印花布期_E',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.theoryPrintClothDateE && this.$filters.parseTime(scope.row.theoryPrintClothDateE, '{y}-{m}-{d}') || ''
      },

      _planStartColorYarnDate: {
        prop: 'planStartColorYarnDate',
        label: '计划开始色纱期',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.planStartColorYarnDate && this.$filters.parseTime(scope.row.planStartColorYarnDate, '{y}-{m}-{d}') || ''
      },

      _planStartGreyDate: {
        prop: 'planStartGreyDate',
        label: '计划开始坯期',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.planStartGreyDate && this.$filters.parseTime(scope.row.planStartGreyDate, '{y}-{m}-{d}') || ''
      },

      _planStartColorClothDate: {
        prop: 'planStartColorClothDate',
        label: '计划开始色布期',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row.planStartColorClothDate && this.$filters.parseTime(scope.row.planStartColorClothDate, '{y}-{m}-{d}') || ''
      },

      _planStartPrintClothDate: {
        prop: 'planStartPrintClothDate',
        label: '计划开始印花布期',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && this.$filters.parseTime(scope.row.planStartPrintClothDate, '{y}-{m}-{d}') || ''
      }
      // _rapidOrderRemark: {
      //   prop: 'rapidOrderRemark',
      //   label: '急单备注',
      //   minWidth: '140',
      //   showOverflowTooltip: true
      // }

    }
    return {
      selection,
      searchData,
      waitingColumns,
      pagination,
      detailColumns,
      topDetailColumns,
      bottomDetailColumns
    }
  },
  methods: {
    // 待复期-列表数据
    async getUnrepeatList(data = {}) {
      const res = await unrepeatList({ ...this.formDatas, ...this.searchFormDatas })
      res.data.list && res.data.list.map((item, index) => { item.code = (res.data.pageNum - 1) * res.data.pageSize + index + 1 })
      const listData = res.data && res.data.list || []
      // debugger
      this.unrepeatDataSource = listData || []
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total || 0,
        ...data,
        currentPage: res.data.pageNum || 1,
        pageSize: res.data.pageSize || 20,
        page: res.data.pageNum || 1
      }
      // 初始化打开第一条分录
      // if (listData && this.activeName === '0') {
      //   this.currentId = listData[0].id
      //   this.suBpageList({ id: this.currentId })
      // }
      this.closeRight()
      setTimeout(() => {
        this.setSelectRow()
      }, 20)
    }

  }

}
