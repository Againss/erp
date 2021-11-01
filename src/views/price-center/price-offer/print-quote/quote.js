import { billInfo } from '../api/index.js'
export const quote = {
  data() {
    // 公用验证正则
    // 基础表头
    const quoteColumns = {
      _quotationDate: {
        prop: 'quotationDate',
        label: '报价日期',
        width: '100',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d}') : ''
        }
      },
      _quotationValidityDate: {
        prop: 'quotationValidityDate',
        label: '有效日期',
        width: '100',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d}') : ''
        }
      },
      _customerName: {
        prop: 'customerName',
        label: '客户',
        width: '100'
        // formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''

      },
      _brandName: {
        prop: 'brandName',
        label: '品牌',
        width: '100'
        // formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      },
      _fabricName: {
        prop: 'fabricName',
        label: '产品名称',
        width: '100'
        // showOverflowTooltip: true
      },
      _shaming: {
        prop: 'shaming',
        label: '纱名',
        width: '120',
        isShow: false,
        // showOverflowTooltip: true,
        formater: scope => {
          const list = scope.row.yarnList
          let str = ''
          if (list && list.length > 0) {
            list.forEach((v, i) => {
              // 短纤 纱支+成分+比例+纱类+梳棉方法+纺纱方法
              if (v.yarnType === 'S') {
                str += `<p class="yarnType-class">${v.yarnsBranchName || ''} ${v.compositionName || ''} ${v.compositionProportionName || ''} ${v.yarnsTypeName || ''}  ${v.cardingMethodName || ''} ${v.spinMethodName || ''}</p>`
              } else {
                // 长丝 细度+成份+品名
                str += `<p class="yarnType-class">${v.finenessName || ''} ${v.compositionName || ''} ${v.goodsName || ''}</p>`
              }
            })
          }

          return str
        }
      },
      _compositionName: {
        prop: 'compositionName',
        label: '成份',
        width: '100',
        // showOverflowTooltip: true,
        formater: scope => {
          const list = scope.row.yarnList
          let str = ''
          if (list && list.length > 0) {
            list.forEach(v => {
              str += `<p class="yarnType-class">${v.compositionName}</p>`
            })
          }
          return str
        }
      },
      _clothWidth: {
        prop: 'clothWidth',
        label: '幅宽（寸）',
        width: '100'
        // showOverflowTooltip: true
      },
      _weightPerSquare: {
        prop: 'weightPerSquare',
        label: '克重（g/m²）',
        width: '100'
        // showOverflowTooltip: true
      },
      _color: {
        prop: 'color',
        label: '颜色',
        width: '90'
        // showOverflowTooltip: true
      },
      _moq: {
        prop: 'moq',
        label: 'MOQ（KG）',
        width: '100'
        // showOverflowTooltip: true
      },
      _mcq: {
        prop: 'mcq',
        label: 'MCQ（KG）',
        width: '100'
        // showOverflowTooltip: true
      },
      _testRequirement: {
        prop: 'testRequirement',
        label: '工艺要求',
        width: '120',
        isShow: false,
        // 染色工艺+后整工艺+功能+印花工艺+次要印花工艺
        formater: scope => {
          let str = ''
          const s = scope.row
          const rs = { 'W': '水洗', 'B': '漂白', 'H': '半漂', 'D': '染色' }
          const dyeingProcess = s.dyeingTechList && s.dyeingTechList.length > 0 ? s.dyeingTechList : []
          const afterfinishLossList = s.afterfinishLossList && s.afterfinishLossList.length > 0 ? s.afterfinishLossList : []
          const functionLossList = s.functionLossList && s.functionLossList.length > 0 ? s.functionLossList : []
          const majorPrintingTechList = s.majorPrintingTechList && s.majorPrintingTechList.length > 0 ? s.majorPrintingTechList : []
          dyeingProcess.forEach(v => {
            str += rs[v.dyeingProcess] + ';'
          })
          str += '<p style="margin: 0;"></p>'
          afterfinishLossList.forEach(v => {
            str += v.afterfinishTechName + ';'
          })
          functionLossList.forEach(v => {
            str += v.functionName + ';'
          })
          str += '<p style="margin: 0;"></p>'
          majorPrintingTechList.forEach(v => {
            v.minorPrintingTechList && v.minorPrintingTechList.forEach(e => {
              str += e.printingName + ';'
            })
          })
          return str
        }
      },
      _salePrice: {
        prop: 'salePrice',
        label: '单价（含税 元/公斤）',
        width: '100'
        // showOverflowTooltip: true
      },
      _remark: {
        prop: 'remark',
        label: '备注'
        // width: '180'
        // showOverflowTooltip: true

      }
    }
    return {
      spanArr: [],
      quoteFormDatas: [],
      position: 0,
      quoteColumns
      // filteFields: ''

    }
  },
  computed: {
    getFielName() {
      return this.$route.params.name ? this.$route.params.name : ''
    }

  },
  mounted() {
    this.queryData()
  },
  methods: {
    initData() {
      if (this.getFielName === 'yarnName') {
        this.quoteColumns._testRequirement.isShow = true
        this.quoteColumns._shaming.isShow = false
      } else if (this.getFielName === 'processRequirements') {
        this.quoteColumns._shaming.isShow = true
        this.quoteColumns._testRequirement.isShow = false
      } else if (this.getFielName === 'yarnName,processRequirements' || this.getFielName === 'processRequirements,yarnName') {
        this.quoteColumns._shaming.isShow = true
        this.quoteColumns._testRequirement.isShow = true
      } else {
        this.quoteColumns._shaming.isShow = false
        this.quoteColumns._testRequirement.isShow = false
      }
    },
    qrPrintHandle() {
      this.printjs = true
    },
    // 报价详情列表数据
    async queryData() {
      const data = {
        quotationId: this.$route.params.id
      }
      const res = await billInfo({ ...data })
      const dataList = res.data || {}
      const fabricList = res.data && res.data.fabricList ? res.data.fabricList : []
      this.quoteFormDatas = []
      for (let i = 0; i < fabricList.length; i++) {
        const item = fabricList[i]
        this.quoteFormDatas.push({
          ...dataList,
          pid: dataList.id,
          ...item
        })
      }
      console.log(this.quoteFormDatas)
      this.rowspan()
      this.shwo = true
    },
    // 表格合并行
    rowspan() {
      this.quoteFormDatas.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1)
          this.position = 0
        } else {
          if (this.quoteFormDatas[index].brandName === this.quoteFormDatas[index - 1].brandName) {
            this.spanArr[this.position] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.position = index
          }
        }
      })
      this.initData()
    },
    // 表格合并行
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 2 || columnIndex === 3) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if (columnIndex === 1) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    }
  }
}
