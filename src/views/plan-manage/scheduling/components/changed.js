// import * as api from '../api/index.js'
// 已复期
import { planScheduleSend, cancelDeliveried } from '../api/index.js'
export const changed = {
  data() {
    const itemStyle = { 'width': '25%' }
    // 查询
    const changedSearchData = {
      _orderNo: {
        prop: 'orderNo',
        itemType: 'input',
        label: '订单号',
        clearable: true,
        placeholder: '请输入订单号',
        itemStyle
      },

      _salesTeamName: {
        prop: 'salesTeamName',
        itemType: 'input',
        label: '销售组织',
        clearable: true,
        placeholder: '请输入销售组织',
        itemStyle
      },
      _orderStartDelivery: {
        prop: 'orderStartDelivery',
        itemType: 'date',
        type: 'daterange',
        itemStyle,
        label: '交期',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59']

      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          const orderStartDelivery = params.orderStartDelivery && params.orderStartDelivery[0] || ''
          const orderEndDelivery = params.orderStartDelivery && params.orderStartDelivery[1] || ''

          this.formDatas = {
            ...params,
            orderStartDelivery,
            orderEndDelivery
          }
          console.log(this.formDatas)
          this.getPageList()
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
    const selection = {
      selection: true,
      selectionLabel: '全部'
    }
    // 分页配置信息
    const changedPagination = {
      currentChange: val => {
        this.changePageCoreRecordData()
        this.formDatas.pageSize = this.changedPagination.pageSize || 20
        this.formDatas.pageNum = val
        this.getPageList()
      },
      sizeChange: val => {
        this.changePageCoreRecordData()
        this.formDatas.pageSize = val
        this.formDatas.pageNum = this.changedPagination.pageNum || 1
        this.getPageList()
      }
    }
    const changedColumns = {
      _code: {
        prop: 'code',
        label: '序号',
        width: '80'
      },
      _orderNo: {
        prop: 'orderNo',
        label: '订单号',
        minWidth: '160',
        showOverflowTooltip: true,
        permitTag: ['techManage:tmKnitTech:page'],
        handle: (scope) => {
          // console.log(scope)
        }
        // style: {
        //   color: '#1890ff',
        //   cursor: 'pointer'
        // }
      },
      _delivery: {
        prop: 'delivery',
        label: '交期',
        showOverflowTooltip: true,
        minWidth: '140',
        formater: scope => scope.row[scope.column.property] && this.$filters.parseTime(scope.row.delivery, '{y}-{m}-{d}') || ''
        // formater: (scope) => {
        //   const type = {
        //     'B': '大货',
        //     'S': '样板',
        //     'R': '备坯',
        //     'C': '补布'
        //   }
        //   return type[scope.row.customerName]
        // }
      },
      _num: {
        prop: 'num',
        label: '数量',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _clothType: {
        prop: 'clothType',
        label: '布类',
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
      _element: {
        prop: 'element',
        label: '成份',
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
      _garmentPartName: {
        prop: 'garmentPartName',
        label: '成衣部位',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _purchaseRepeatDate: {
        prop: 'purchaseRepeatDate',
        label: '采购复期',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && this.$filters.parseTime(scope.row.purchaseRepeatDate, '{y}-{m}-{d}') || ''
      },
      _planStartColorYarnDate: {
        prop: 'planStartColorYarnDate',
        label: '计划开始色纱期',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && this.$filters.parseTime(scope.row.planStartColorYarnDate, '{y}-{m}-{d}') || ''
      },
      _planCloseColorYarnDate: {
        prop: 'planCloseColorYarnDate',
        label: '计划结束色纱期',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && this.$filters.parseTime(scope.row[scope.column.property], '{y}-{m}-{d}') || ''
      },
      _planStartGreyDate: {
        prop: 'planStartGreyDate',
        label: '计划开始坯期',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && this.$filters.parseTime(scope.row[scope.column.property], '{y}-{m}-{d}') || ''
      },
      _planCloseGreyDate: {
        prop: 'planCloseGreyDate',
        label: '计划结束坯期',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && this.$filters.parseTime(scope.row[scope.column.property], '{y}-{m}-{d}') || ''
      },
      _planStartColorClothDate: {
        prop: 'planStartColorClothDate',
        label: '计划开始色布期',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && this.$filters.parseTime(scope.row[scope.column.property], '{y}-{m}-{d}') || ''
      },
      _planCloseColorClothDate: {
        prop: 'planCloseColorClothDate',
        label: '计划结束色布期',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && this.$filters.parseTime(scope.row[scope.column.property], '{y}-{m}-{d}') || ''
      },
      _planStartPrintClothDate: {
        prop: 'planStartPrintClothDate',
        label: '计划开始印花布期',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && this.$filters.parseTime(scope.row[scope.column.property], '{y}-{m}-{d}') || ''
      },
      _planClosePrintClothDate: {
        prop: 'planClosePrintClothDate',
        label: '计划结束印花布期',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && this.$filters.parseTime(scope.row[scope.column.property], '{y}-{m}-{d}') || ''
      },
      _planDelivery: {
        prop: 'planDelivery',
        label: '计划复期',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && this.$filters.parseTime(scope.row[scope.column.property], '{y}-{m}-{d}') || ''
      },
      _styleNumber: {
        prop: 'styleNumber',
        label: '款号',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _suggestWidth: {
        prop: 'suggestWidth',
        label: '幅宽',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property] + '"' || ''
      },
      _suggestWeight: {
        prop: 'suggestWeight',
        label: '克重',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property] + 'g/m²' || ''
      },
      _customerColor: {
        prop: 'customerColor',
        label: '客户颜色',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _colorType: {
        prop: 'colorType',
        label: '颜色分类',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _produceProcess: {
        prop: 'produceProcess',
        label: '生产流程',
        minWidth: '140',
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
      _planRemark: {
        prop: 'planRemark',
        label: '采购备注',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _deliveryConfirm: {
        prop: 'deliveryConfirm',
        label: '交期确认',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _area: {
        prop: 'area',
        label: '区域',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _sellerName: {
        prop: 'sellerName',
        label: '销售员',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _repeatPlannerName: {
        prop: 'repeatPlannerName',
        label: '复期计划员',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _repeatDate: {
        prop: 'repeatDate',
        label: '复期时间',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && this.$filters.parseTime(scope.row[scope.column.property], '{y}-{m}-{d}') || ''
      }

    }

    return {
      changedPagination,
      changedSearchData,
      changedColumns,
      selection,
      multipleSelectionAll: [], // 所有选中的数据包含跨页数据
      multipleSelection: [], // 当前页选中的数据
      idKey: 'id' // 标识列表数据中每一行的唯一键的名称
    }
  },
  methods: {
    async issueSelectData(fuName) {
      // 批量下的已选数据
      // debugger
      this.changePageCoreRecordData()
      const ids = []
      // debugger
      if (this.multipleSelectionAll.length) {
        this.multipleSelectionAll.forEach(v => {
          ids.push(v.id)
        })
      } else {
        return this.$message.error('请选择记录!')
      }
      let res = null
      if (fuName === 'planScheduleSend') {
        res = await planScheduleSend({ apsPlanScheduleDetailIds: ids })
        this.fetchLog(this.getLogMessages('UPDATE', '/aps/planSchedule/send'), ids, JSON.stringify({ beforeText: `在'计划管理-计划排期-已复期-下发数据`, beforeCode: ids }))
      } else {
        res = await cancelDeliveried({ apsPlanScheduleDetailIds: ids })
        this.fetchLog(this.getLogMessages('UPDATE', '/aps/planSchedule/cancelDeliveried'), ids, JSON.stringify({ beforeText: `在'计划管理-计划排期-已复期-取消已复期`, beforeCode: ids }))
      }
      if (res.code === 200) {
        this.getPageList()
      }
      // console.log(this.multipleSelectionAll)
    },
    // 选择事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 设置选中的方法
    setSelectRow() {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return
      }
      // 标识当前行的唯一键的名称
      const idKey = this.idKey
      const selectAllIds = []
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey])
      })
      this.$refs.customTable.$refs.table.clearSelection()
      for (var i = 0; i < this.dataSource.length; i++) {
        if (selectAllIds.indexOf(this.dataSource[i][idKey]) >= 0) {
          this.$refs.customTable.$refs.table.toggleRowSelection(this.dataSource[i], true)
        }
      }
    },
    // 记忆选择核心方法
    changePageCoreRecordData() {
      const idKey = this.idKey
      if (this.multipleSelectionAll.length <= 0) {
        this.multipleSelectionAll = this.multipleSelection
        return
      }
      // 总选择里面的key集合
      const selectAllIds = []
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey])
      })
      const selectIds = []
      // 获取当前页选中的id
      this.multipleSelection.forEach(row => {
        selectIds.push(row[idKey])
        // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          this.multipleSelectionAll.push(row)
        }
      })
      const noSelectIds = []
      // 得到当前页没有选中的id
      this.dataSource.forEach(row => {
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey])
        }
      })
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < this.multipleSelectionAll.length; i++) {
            if (this.multipleSelectionAll[i][idKey] === id) {
              // 如果总选择中有未被选中的，那么就删除这条
              this.multipleSelectionAll.splice(i, 1)
              break
            }
          }
        }
      })
    }
  }

}
