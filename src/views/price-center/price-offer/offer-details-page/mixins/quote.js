import { billInfo, billInfoExport, billUpdate } from '../../api/index.js'
import moreShow from '../../components/moreShow'
export const quote = {
  data() {
    // 公用验证正则
    const numberReg = this.$getRules({ type: 'number', pattern: /^[1-9]\d*$/, message: '请输入正整数（最多9位）', trigger: ['blur'] })
    // 基础表头
    const quoteColumns = [
      {
        prop: 'quotationDate',
        label: '报价日期',
        width: '160',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d}') : ''
        }
      },
      {
        prop: 'quotationValidityDate',
        label: '有效日期',
        width: '160',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d}') : ''
        }
      },
      {
        prop: 'customerName',
        label: '客户',
        minWidth: '120',
        showOverflowTooltip: true
        // formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''

      },
      {
        prop: 'brandName',
        label: '品牌',
        minWidth: '120',
        showOverflowTooltip: true
        // formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      },
      {
        prop: 'fabricName',
        label: '产品名称',
        minWidth: '220',
        showOverflowTooltip: true
      },
      {
        prop: 'shaming',
        label: '纱名',
        minWidth: '200',
        maxlength: 10,
        components: {
          moreShow
        },
        componentsOptions: {
          type: 'shaming'
        }
      },
      {
        prop: 'compositionName',
        label: '成份',
        minWidth: '160',
        components: {
          moreShow
        },
        componentsOptions: {
          type: 'compositionName'
        }
      },
      {
        prop: 'clothWidth',
        label: '幅宽（寸）',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'weightPerSquare',
        label: '克重（g/m²）',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'color',
        label: '颜色',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'moq',
        label: 'MOQ（KG）',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'mcq',
        label: 'MCQ（KG）',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'testRequirement',
        label: '测试要求',
        minWidth: '200',
        showOverflowTooltip: true

      },
      {
        prop: 'testRequirement1',
        label: '工艺要求',
        minWidth: '200',
        showOverflowTooltip: true,
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
            v.minorPrintingTechList && v.minorPrintingTechList.length && v.minorPrintingTechList.forEach(e => {
              str += e.printingName + ';'
            })
          })
          return str
        }
      },
      {
        prop: 'salePrice',
        label: '单价（含税 元/公斤）',
        minWidth: '200',
        showOverflowTooltip: true
      },
      {
        prop: 'remark',
        label: '备注',
        minWidth: '120',
        showOverflowTooltip: true

      }
    ]
    let handleConf = [
      {
        label: '编辑',
        permitTag: ['crm:quotationSheet:billUpdate'],
        isShow: true,
        handle: params => {
          this.$set(this.quotePopOptions, 'formDatas', { ...params.row })
          this.$set(this.quotePopOptions, 'visible', true)
        }
      }
    ]
    handleConf = this.$filterPermission(handleConf)
    // 表格操作栏里面的配置信息
    const popOperates = {
      label: '操作',
      width: '100',
      fixed: 'right',
      dataSource: handleConf
    }
    // 新增弹窗中的字段
    const quoteCommonContent = [
      {
        prop: 'quotationDate',
        itemType: 'date',
        label: '报价日期',
        popperClass: 'popperClassPrice',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        placeholder: '请选择报价日期'
      },
      {
        prop: 'quotationValidityDate',
        itemType: 'date',
        label: '有效日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        placeholder: '请选择有效日期'
      },
      {
        prop: 'fabricName',
        itemType: 'input',
        label: '产品名称',
        disabled: true,
        placeholder: '请输入产品名称'
      },
      {
        prop: 'color',
        itemType: 'input',
        label: '颜色',
        maxlength: 10,
        placeholder: '请输入颜色'
      },
      {
        prop: 'testRequirement',
        itemType: 'input',
        label: '测试要求',
        maxlength: 50,
        placeholder: '请输入测试要求'
      },
      {
        prop: 'moq',
        itemType: 'input',
        label: 'MOQ(KG)',
        maxlength: 9,
        rules: [numberReg],
        placeholder: '请输入MOQ(最多9位正整数)'
      },
      {
        prop: 'mcq',
        itemType: 'input',
        label: 'MCQ(KG)',
        clearable: true,
        maxlength: 9,
        rules: [numberReg],
        placeholder: '请输入MCQ(最多9位正整数)'
      },

      {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        label: '备注',
        maxlength: 200,
        placeholder: '请输入备注（最多200个字符）'
      }
    ]
    // 这是pop弹出层用的配置信息
    const quotePopOptions = {
      itemType: 'drawer',
      visible: false,
      title: '编辑报价单',
      okText: '保存',
      ok: params => {
        this.billUpdateSubmit(params)
      },
      cancel: (params) => {
        this.$set(this.quotePopOptions, 'visible', false)
      },
      formDatas: {},
      formOptions: {},
      content: quoteCommonContent
    }

    return {
      quotePopOptions,
      popOperates,
      handleConf,
      spanArr: [],
      quoteFormDatas: [],
      position: 0,
      quoteColumns,
      dialogVisible: false,
      checkList: [],
      command: ''
    }
  },
  mounted() {
    this.queryData()
  },
  methods: {
    // 点击下载
    handleCommand(command) {
      this.command = command
      this.dialogVisible = !this.dialogVisible
    },
    // 点击弹框确定按钮
    async dialogSubmit() {
      if (this.command === 'excel') {
        let excludeColumnFiledName = ''
        if (this.checkList.length > 1) {
          excludeColumnFiledName = ''
        } else if (this.checkList.length === 0) {
          excludeColumnFiledName = 'processRequirements,yarnName'
        } else {
          excludeColumnFiledName = this.checkList.length > 0 ? this.checkList.join('') : ''
          excludeColumnFiledName = excludeColumnFiledName === 'processRequirements' ? 'yarnName' : 'processRequirements'
        }
        const url = `quotationId=${this.quoteFormDatas[0].quotationId}&excludeColumnFiledName=${excludeColumnFiledName}`
        const res = await billInfoExport(url)
        this.$utils.downloadStream(res)
        this.dialogVisible = !this.dialogVisible
        this.$message.success('下载成功')
      } else {
        // 跳转到pdf下载页面
        // const checkList = this.checkList.length === 0 ? 'all' : this.checkList
        // this.$router.push(`/offer/offer-details-print-quote/${this.routeId}/${checkList}`)
        this.dialogVisible = !this.dialogVisible
        var printStr = `<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'><style></style></head><body style="width: 1300px;margin: 0 auto;">`
        var content = ''
        let str = null
        str = document.getElementById('csPrint').innerHTML // 获取需要打印的页面元素
        content = content + str
        printStr = printStr + content + '</body></html>'
        var pwin = window.open('Print.html', '_self', 'print')
        document.write(printStr)
        pwin.document.close()
        document.title = '报价单详情'
        pwin.print()
        window.location.reload()
      }
    },
    // 修改报价单提交
    async billUpdateSubmit(params = {}) {
      const pamraskey = ['quotationId', 'fabricId', 'quotationDate', 'quotationValidityDate', 'fabricName', 'moq', 'mcq', 'testRequirement', 'color', 'remark']
      const obj = {}
      pamraskey.forEach(v => {
        obj[v] = params[v]
      })

      await billUpdate({ ...obj })
      this.$set(this.quotePopOptions, 'visible', false)
      this.$message.success('修改成功')
      this.queryData()
    },
    // 报价详情列表数据
    async queryData() {
      const data = {
        quotationId: this.routeId
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
          ...item,
          shaming: item.yarnList && item.yarnList.reduce((str, v) => {
            // 短纤 纱支+成分+比例+纱类+梳棉方法+纺纱方法
            if (v.yarnType === 'S') {
              str += `<p class="yarnType-class">${v.yarnsBranchName || ''} ${v.compositionName || ''} ${v.compositionProportionName || ''} ${v.yarnsTypeName || ''}  ${v.cardingMethodName || ''} ${v.spinMethodName || ''}</p>`
            } else {
              // 长丝 细度+成份+品名
              str += `<p class="yarnType-class">${v.finenessName || ''} ${v.compositionName || ''} ${v.goodsName || ''}</p>`
            }
            return str
          }, '') || '',
          compositionName: item.yarnList && item.yarnList.reduce((str, v) => {
            str += `<p class="yarnType-class">${v.compositionName}</p>`
            return str
          }, '') || ''
        })
      }
      this.rowspan()
    },
    // 获取短纤长丝
    getYarnList(type) {
      return this.yarnList && this.yarnList.filter(item => item.yarnType === type) || []
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
