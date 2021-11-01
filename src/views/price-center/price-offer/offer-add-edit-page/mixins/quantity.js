import inputWithSelect from '../../components/input-with-select.vue'
export const quantity = {
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 金额数字正则
    // const moneyReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/, message: '请输入最多9位整数或保留1到2位小数', trigger: ['blur'] })
    const moneyReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,8}))(\.\d{1,2})?$/, message: '请输入最多9位整数或保留1到2位小数', trigger: ['blur'] })
    // 为数字正则
    const numberReg = this.$getRules({ type: 'number', pattern: /^[1-9]\d*$/, message: '请输入正整数', trigger: ['blur'] })

    // 数量表格表头
    const quantityColumns = [
      {
        prop: 'ydweight',
        label: '数量(yd)',
        minWidth: '90',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property]
        }
      },
      {
        prop: 'lbweight',
        label: '数量(lb)',
        minWidth: '90',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property]
        }
      },
      {
        prop: 'weight',
        label: '数量(kg)',
        minWidth: '90',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property]
        }
      },
      {
        prop: 'clothWidth',
        label: '边至边幅宽(in)',
        minWidth: '90',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.numRecursion(scope.row[scope.column.property] * 1)
        }
      },
      {
        prop: 'weightPerSquare',
        label: '克重(g/㎡)',
        minWidth: '90',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.numRecursion(scope.row[scope.column.property] * 1)
        }
      }
    ]
    // 数量表格操作
    const quantityPopOperates = {
      label: '操作',
      width: '80',
      fixed: 'right',
      dataSource: [
        {
          label: '编辑',
          isShow: true,
          handle: params => {
            this.PopDialogHandle(this.quantityPopOptions, '编辑数量')
            this.quantityPopOptions.formDatas = this.getQuantityWeigtOption(params.row)
            this.quantityPopOptions.content[0].componentsOptions = this.getQuantityWeigtOption(params.row)
          }
        }
      ]
    }
    // 数量弹框
    const quantityPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      ok: params => {
        const obj = this.getQuantityWeight(params)
        this.quantityData = [obj]
        this.totalDataList[this.editableTabsValue].weight = params.weight
        this.totalDataList[this.editableTabsValue].unit = params.unit
        this.totalDataList[this.editableTabsValue].clothWidth = params.clothWidth
        this.totalDataList[this.editableTabsValue].weightPerSquare = params.weightPerSquare
        // weight改变，运输成本的运费系数重新计算
        if (this.freightList.length && this.freightList[0].priceClauseName === 'EXW') {
          this.freightList && this.freightList.forEach(item => {
            this.freightCoefficient = this.$utils.getFloat((this.copyaffordExpense || 0) / this.quantityData.weight, 4)
          })
        }
        // weight改变，运输成本的运费系数重新计算
        if (this.freightList.length && this.freightList[0].priceClauseName === 'EXW') {
          this.freightList && this.freightList.forEach(item => {
            this.freightCoefficient = this.$utils.getFloat((this.copyaffordExpense || 0) / this.totalDataList[this.editableTabsValue].weight, 4)
          })
        }
        this.closePopDialogHandle(this.quantityPopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.quantityPopOptions)
      },

      formDatas: {},
      formOptions: {},
      content: [
        {
          prop: 'weight',
          label: '数量',
          components: { inputWithSelect },
          componentsOptions: {
            weight: '',
            unit: ''
          },
          rules: [commonBlurReg, moneyReg],
          placeholder: '0.00（小数点前9位，后2位）'
        },
        {
          prop: 'clothWidth',
          itemType: 'input',
          label: '边至边幅宽(in)',
          maxlength: 3,
          rules: [commonBlurReg, numberReg],
          placeholder: '请输入正整数(最多3位)'
        },
        {
          prop: 'weightPerSquare',
          itemType: 'input',
          label: '克重(g/㎡)',
          maxlength: 3,
          rules: [commonBlurReg, numberReg],
          placeholder: '请输入正整数(最多3位)'
        }
      ]
    }
    return {
      quantityColumns,
      quantityPopOptions,
      quantityData: [],
      quantityPopOperates
    }
  },
  computed: {},
  methods: {
    // 添加数量弹框
    quantityPop() {
      if (this.quantityData.length !== 0) {
        this.$message.warning('数量最多可添加一个')
        return false
      }
      this.PopDialogHandle(this.quantityPopOptions, '添加数量')
      this.quantityPopOptions.formDatas = { unit: (/crm/.test(this.branch) ? 'kg' : 'yd') }
      this.quantityPopOptions.content[0].componentsOptions = { weight: '', unit: (/crm/.test(this.branch) ? 'kg' : 'yd') }
    },
    // 1.0.4根据数量单位 换算
    getQuantityWeight(data) {
      const obj = { ...data }
      // 这里后端存的数量 weight字段 是跟随单位的  弹窗里面的数据数量字段weight是跟随单位的 这里为了让其他用到数量计算的地方不动  所以将后端存的跟随单位的weight字段 换成kg的weight
      // 如果存了单位就是新数据  没有存单位的旧数据按照 kg算  以前是kg
      switch (data.unit) {
        case 'lb':
          obj.lbweight = data.weight
          obj.weight = this.$utils.getFloat(data.weight / 2.2046, 4)
          obj.ydweight = this.$utils.getFloat(this.$utils.getFloat(data.weight / data.clothWidth / data.weightPerSquare / 0.00081925, 4) * 16, 4)
          break
        case 'yd':
          obj.ydweight = data.weight
          obj.weight = this.$utils.getFloat(this.$utils.getFloat(this.$utils.getFloat(this.$utils.getFloat(data.weight * data.clothWidth * data.weightPerSquare, 4) * 0.00081925, 4) / 16, 4) / 2.2046, 4)
          obj.lbweight = this.$utils.getFloat(this.$utils.getFloat(this.$utils.getFloat(data.weight * data.clothWidth * data.weightPerSquare, 4) * 0.00081925, 4) / 16, 4)
          break
        default:
          obj.weight = data.weight
          obj.ydweight = this.$utils.getFloat(this.$utils.getFloat(data.weight / data.clothWidth / data.weightPerSquare / 0.00081925, 4) * 16 * 2.2046, 4)
          obj.lbweight = this.$utils.getFloat(data.weight * 2.2046, 4)
          break
      }
      return obj
    },
    getQuantityWeigtOption(data) {
      const obj = { ...data }
      obj.unit = obj.unit || (/crm/.test(this.branch) ? 'kg' : 'yd')
      switch (obj.unit) {
        case 'lb':
          obj.weight = obj.lbweight
          break
        case 'yd':
          obj.weight = obj.ydweight
          break
      }
      return obj
    }
  }

}
