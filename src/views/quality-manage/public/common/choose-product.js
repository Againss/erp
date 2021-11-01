// import radioButton from '@/views/quality-manage/public/components/radio-button.vue'
import { inOutDetail } from '@/views/quality-manage/common/basisApi.js'
export const chooseProduct = {
  data() {
    const itemStyle = { width: '28%', 'marginRight': 0, 'margin-bottom': '16px' }
    // dialog弹出框表格表头的配置信息
    const pickerOptions = {
      shortcuts: [
        {
          text: '今天',
          onClick(picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
            const start = new Date(new Date(new Date().toLocaleDateString()).getTime())
            start.setTime(start.getTime())
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '昨天',
          onClick(picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
            const start = new Date(new Date(new Date().toLocaleDateString()).getTime())
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '7天内',
          onClick(picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
            const start = new Date(new Date(new Date().toLocaleDateString()).getTime())
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '14天内',
          onClick(picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
            const start = new Date(new Date(new Date().toLocaleDateString()).getTime())
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 13)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '30天内',
          onClick(picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
            const start = new Date(new Date(new Date().toLocaleDateString()).getTime())
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '60天内',
          onClick(picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
            const start = new Date(new Date(new Date().toLocaleDateString()).getTime())
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 60)
            picker.$emit('pick', [start, end])
          }
        }
      ],
      disabledDate(time) {
        return time.getTime() > new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59).getTime() || time.getTime() < Date.now() - 3600 * 1000 * 24 * 91
      }
    }
    const columnsInfos = {
      _code: {
        prop: 'code',
        label: '序号',
        minWidth: '50'

      },
      _consigneeAddr: {
        prop: 'consigneeAddr',
        label: '收货方',
        minWidth: '100',
        showOverflowTooltip: true

      },
      _relationNo: {
        prop: 'relationNo',
        label: '关联单号',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _yarnCount: {
        prop: 'yarnCount',
        label: '纱支',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: (scope) => {
          // console.log('scope.row', scope.row)
          return scope.row.materielInfo && scope.row.materielInfo[scope.column.property] && scope.row.materielInfo[scope.column.property].name || ''
        }
      },
      _ingredients: {
        prop: 'ingredients',
        label: '成份',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.materielInfo && scope.row.materielInfo[scope.column.property] && scope.row.materielInfo[scope.column.property].name || ''
        }
      },
      _ratioEasy: {
        prop: 'ratioEasy',
        label: '比例',
        minWidth: '200',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.materielInfo && scope.row.materielInfo[scope.column.property] || ''
        }
      },
      _spinningMethod: {
        prop: 'spinningMethod',
        label: '纺纱方法',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.materielInfo && scope.row.materielInfo[scope.column.property] && scope.row.materielInfo[scope.column.property].name || ''
        }
      },
      _cardingMethod: {
        prop: 'cardingMethod',
        label: '梳棉方法',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.materielInfo && scope.row.materielInfo[scope.column.property] && scope.row.materielInfo[scope.column.property].name || ''
        }
      },
      _yarnType: {
        prop: 'yarnType',
        label: '纱类',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.materielInfo && scope.row.materielInfo[scope.column.property] && scope.row.materielInfo[scope.column.property].name || ''
        }
      },
      _supplierName: {
        prop: 'supplierName',
        label: '供应商',
        minWidth: '100',
        showOverflowTooltip: true
      },
      _yarnCard: {
        prop: 'yarnCard',
        label: '纱牌/批号',
        minWidth: '100',
        showOverflowTooltip: true
      },
      _batchNo: {
        prop: 'batchNo',
        label: '批次号',
        minWidth: '100',
        showOverflowTooltip: true
      },
      _status: {
        prop: 'status',
        label: '出入库存状态',
        minWidth: '130',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.status === 'I' ? '入库' : '出库'
        }
      },
      _materiel: {
        prop: 'materiel',
        label: '产品编号',
        minWidth: '180',
        showOverflowTooltip: true
      },
      _stockInFormNo: {
        prop: 'stockInFormNo',
        label: '入库单号',
        minWidth: '180',
        showOverflowTooltip: true
      },
      _stockOutFormNo: {
        prop: 'stockOutFormNo',
        label: '出库单号',
        minWidth: '180',
        showOverflowTooltip: true
      },
      _stockInDate: {
        prop: 'stockInDate',
        label: '实际入库时间',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.stockInDate ? this.$filters.parseTime(
            scope.row.stockInDate,
            '{y}-{m}-{d} {h}:{i}'
          ) : ''
        }
      },
      _stockInWeight: {
        prop: 'stockInWeight',
        label: '实际入库重量（KG）',
        minWidth: '160',
        showOverflowTooltip: true
      },
      _stockOutDate: {
        prop: 'stockOutDate',
        label: '实际出库时间',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.stockOutDate ? this.$filters.parseTime(
            scope.row.stockOutDate,
            '{y}-{m}-{d} {h}:{i}'
          ) : ''
        }
      }
    }
    const endTime = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
    const startTime = new Date(new Date(new Date().toLocaleDateString()).getTime())
    startTime.setTime(startTime.getTime() - 3600 * 1000 * 24 * 6)
    // 客样分析分页配置信息
    const customerPagination = {
      // currentPage: 1,
      pageSizes: [10, 20, 30, 100, 200],
      currentChange: val => {
        this.choosePageSize = this.customerPagination.pageSize
        this.choosePageNum = val
        this.getInOutData(this.searchFormDatas)
      },
      sizeChange: val => {
        // console.log('sizeChange', this.pagination)
        this.$set(this.customerPagination, 'currentPage', 1)
        this.choosePageSize = val
        this.choosePageNum = 10
        this.getInOutData(this.searchFormDatas)
      }
    }
    // 选择客户弹出框
    const productPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '产品列表',
      width: '1240px',
      ok: async params => {
        const item = this.infoRowData
        const info = item.materielInfo
        this.infoData = {
          ...this.infoData,
          skuId: item.materiel,
          skuName: item.materiel,
          supplier: item.supplierName ? { label: item.supplierName, value: item.supplierId } : '', // 供应商
          yarnBatch: item.yarnCard, // 纱牌/纱批
          batchNo: item.batchNo, // 批次号
          stockInNo: item.stockInFormNo || '', // 入库单号
          stockOutNo: item.stockOutFormNo || '', // 出库单号
          relationNo: item.relationNo || '', // 关联单号
          actualStorageWeight: item.stockInWeight, // 实际入库重量(KG)
          address: item.consigneeAddr || ''// 地址
        }
        const objectKeys = ['yarnCount', 'ingredients', 'spinningMethod', 'cardingMethod', 'yarnType']
        if (info) {
          objectKeys.forEach(key => {
            if (info[key]) {
              this.infoData[key] = {
                label: info[key].name,
                value: info[key].uuid
              }
            }
          })
          if (info.ratio && info.ratio.length > 0) {
            this.infoData.proportion = info.ratio.map((item) => {
              return item.ratio
            })
          } else {
            this.infoData.proportion = 100
          }
        }

        // 处理下拉框回显数据
        const dataSourceKey = ['_yarnCount', '_ingredients', '_spinningMethod', '_cardingMethod', '_yarnType', '_supplier']

        for (const key in this.infoCommon) {
          if (dataSourceKey.includes(key)) {
            if (key === '_supplier') {
              this.$set(this.infoCommon._supplier, 'dataSource', [{
                label: item.supplierName || '',
                value: item.supplierId || ''
              }])
            } else {
              if (item.materielInfo && item.materielInfo[key.split('_')[1]].name) {
                this.$set(this.infoCommon[key], 'dataSource', [{
                  label: item.materielInfo[key.split('_')[1]].name,
                  value: item.materielInfo[key.split('_')[1]].uuid
                }])
              } else {
                this.$set(this.infoCommon[key], 'dataSource', '')
              }
            }
          }
        }
        console.log('this.infoData', this.infoData)
        this.$set(this.productPopOptions, 'visible', false)
        if (this.yarnCalculationGrade) {
          if (item.materiel) {
            this.yarnCalculationGrade(this.infoData)
          }

          const tempLabel = this.infoData.ingredients && this.infoData.ingredients.label || ''
          const tempGroup = []
          for (let i = 0; i < tempLabel.split('/').length; i++) {
            tempGroup.push('')
          }
          this.changeProportion(tempGroup)
        }
      },
      cancel: params => {
        this.$set(this.productPopOptions, 'visible', false)
      },
      close: () => {
        this.$set(this.productPopOptions, 'visible', false)
      },
      formDatas: {
        status: 'I',
        stockInDateStart: [startTime, endTime],
        stockOutDateStart: []

      },
      formOptions: {
        labelWidth: '90px',
        // size: 'small',
        inline: true,
        // layout: true
      },
      content: {
        _materiel: {
          prop: 'materiel',
          itemType: 'input',
          label: '产品编号:',
          itemStyle,
          placeholder: '请输入产品编号'
        },
        _status: {
          prop: 'status',
          itemType: 'select',
          label: '库存状态:',
          itemStyle,
          placeholder: '请选择库存状态',
          dataSource: [
            {
              label: '入库',
              value: 'I'
            }, {
              label: '出库',
              value: 'O'
            }
          ],
          change: (value, form, formDatas, setFormDatas) => {
            if (value === 'O') {
              formDatas.stockInDateStart = []
              formDatas.stockOutDateStart = [startTime, endTime]
            } else {
              formDatas.stockInDateStart = [startTime, endTime]
              formDatas.stockOutDateStart = []
            }
          }
        },
        _yarnCard: {
          prop: 'yarnCard',
          itemType: 'input',
          label: '纱牌/批号:',
          itemStyle,
          placeholder: '请输入纱牌/批号'
        },
        _stockInDateStart: {
          prop: 'stockInDateStart',
          itemType: 'date',
          label: '入库时间:',
          itemStyle,
          type: 'daterange',
          format: 'yyyy-MM-dd',
          valueFormat: 'timestamp',
          pickerOptions: pickerOptions,
          defaultTime: ['00:00:00', '23:59:59'],
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          placeholder: '请选择入库时间'

        },
        _stockOutDateStart: {
          prop: 'stockOutDateStart',
          itemType: 'date',
          label: '出库时间:',
          itemStyle,
          type: 'daterange',
          format: 'yyyy-MM-dd',
          valueFormat: 'timestamp',
          pickerOptions: pickerOptions,
          defaultTime: ['00:00:00', '23:59:59'],
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          placeholder: '请选择出库时间'
        },
        _operate: {
          submitText: '查询',
          itemType: 'operate',
          itemStyle: { 'marginLeft': 'auto', 'marginRight': 0, 'position': 'absolute', 'right': 0, 'width': '180px' },
          submitHandle: (params, form, formDatas, setFormDatas) => {
            // 入库开始-结束时间
            this.choosePageSize = 10
            this.choosePageNum = 1
            let stockOutDateStart = params.stockOutDateStart && params.stockOutDateStart[0] || ''
            let stockOutDateEnd = params.stockOutDateStart && params.stockOutDateStart[1] || ''
            let stockInDateStart = params.stockInDateStart && params.stockInDateStart[0] || ''
            let stockInDateEnd = params.stockInDateStart && params.stockInDateStart[1] || ''

            if (stockOutDateStart && typeof (stockOutDateStart) === 'object') {
              stockOutDateStart = stockOutDateStart.getTime()
            }
            if (stockOutDateEnd && typeof (stockOutDateEnd) === 'object') {
              stockOutDateEnd = stockOutDateEnd.getTime()
            }
            if (stockInDateStart && typeof (stockInDateStart) === 'object') {
              stockInDateStart = stockInDateStart.getTime()
            }
            if (stockInDateEnd && typeof (stockInDateEnd) === 'object') {
              stockInDateEnd = stockInDateEnd.getTime()
            }

            this.searchFormDatas = { ...params, stockOutDateStart, stockOutDateEnd, stockInDateStart, stockInDateEnd }
            console.log(this.searchFormDatas)
            this.getInOutData(this.searchFormDatas)
          },
          resetHandle: (params) => {
            this.formDatas = {}
          }
        },
        _table: {
          prop: 'table',
          headerCellStyle: { 'background-color': '#F5F7FA' },
          rowClassName: 'quality-manage',
          highlightCurrentRow: true,
          className: 'pop-table',
          itemType: 'table-form',
          label: '',
          itemStyle: { width: '100%', 'margin-top': '10px' },
          labelWidth: '0',
          dataSource: [],
          columns: columnsInfos,
          tooltipEffect: 'light',
          pagination: customerPagination,
          rowClick: (scope) => {
            this.infoRowData = scope
          }
        }
      }
    }
    return {
      productPopOptions,
      columnsInfos,
      customerPagination,
      customerId: '',
      choosePageSize: 10,
      choosePageNum: 1,
      infoRowData: {},
      startTime,
      endTime,
      searchFormDatas: {}
    }
  },
  mounted() {

  },
  methods: {

    // 获取page
    async getInOutData(data = {}) {
      // debugger
      delete data.table
      const en = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
      const st = new Date(new Date(new Date().toLocaleDateString()).getTime())
      st.setTime(st.getTime() - 3600 * 1000 * 24 * 6)
      let time
      if (JSON.stringify(data) === '{}') {
        if (data.status && data.status === 'O') {
          // 出库时间
          if (data.stockOutDateEnd && typeof (data.stockOutDateEnd) === 'object') {
            data.stockOutDateEnd = data.stockOutDateEnd.getTime()
          }
          if (data.stockOutDateStart && typeof (data.stockOutDateStart) === 'object') {
            data.stockOutDateStart = data.stockOutDateStart.getTime()
          }
          time = {
            stockOutDateStart: st.getTime(),
            stockOutDateEnd: en.getTime()
          }
        } else {
          // 入库时间
          if (data.stockInDateStart && typeof (data.stockInDateStart) === 'object') {
            data.stockInDateStart = data.stockInDateStart.getTime()
          }
          if (data.stockInDateEnd && typeof (data.stockInDateEnd) === 'object') {
            data.stockInDateEnd = data.stockInDateEnd.getTime()
          }
          time = {
            stockInDateStart: st.getTime(),
            stockInDateEnd: en.getTime()
          }
        }
      }

      const res = await inOutDetail({ status: 'I', ...time, ...data, pageSize: this.choosePageSize, pageNum: this.choosePageNum })
      // console.log('getInOutData', res)
      const dataList = res.data && res.data.list || []

      dataList.map((item, index) => { item.code = (res.data.pageNum - 1) * res.data.pageSize + index + 1 })

      this.customerPagination = {
        ...this.customerPagination,
        dataTotal: res.data ? res.data.total : 0,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.productPopOptions.content._table.dataSource = dataList
      this.productPopOptions.content._table.pagination = this.customerPagination
    }
  }

}
