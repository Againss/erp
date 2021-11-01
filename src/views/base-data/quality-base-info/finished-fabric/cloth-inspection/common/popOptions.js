export const popOptions = {
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const maxNumberReg = this.$getRules({
      type: 'number',
      pattern: /^[1-9]\d{0,2}(?:\.\d{0,1})?$/,
      message: '请输入1.0-999.9',
      trigger: ['blur']
    })
    const itemStyle = { width: '100%' }
    // 扣分项目
    const deductPop = {
      _name: {
        prop: 'name',
        itemType: 'input',
        label: '中文名:',
        maxlength: 50,
        rules: [commonBlurReg],
        placeholder: '请输入中文名称',
        itemStyle
      },
      _nameEn: {
        prop: 'nameEn',
        itemType: 'input',
        label: '英文名:',
        maxlength: 50,
        placeholder: '请输入英文名称',
        itemStyle
      },
      _orders: {
        prop: 'orders',
        itemType: 'input',
        label: '顺序:',
        maxlength: 50,
        rules: [commonBlurReg, maxNumberReg],
        placeholder: '请输入1.0-999.9',
        itemStyle
      },
      _remarks: {
        prop: 'remarks',
        itemType: 'input',
        label: '备注:',
        maxlength: 200,
        type: 'textarea',
        itemStyle,
        trim: (value) => {
          return value
        },
        autosize: { minRows: 2, maxRows: 4 },
        placeholder: '请输入(最多200字)'
      }
    }
    // 其它项目
    const otherPop = {
      _name: {
        prop: 'name',
        itemType: 'input',
        label: '中文名:',
        maxlength: 50,
        rules: [commonBlurReg],
        placeholder: '请输入中文名称',
        itemStyle
      },
      _nameEn: {
        prop: 'nameEn',
        itemType: 'input',
        label: '英文名:',
        maxlength: 50,
        placeholder: '请输入英文名称',
        itemStyle
      },

      _unit: {
        prop: 'unit',
        itemType: 'radio-group',
        label: '单位:',
        rules: [commonChangeReg],
        dataSource: [
          { label: '"', value: 1 },
          { label: 'cm', value: 2 },
          { label: 'A/B/C', value: 3 }
        ],
        change: (e) => {
          console.log(e)
        }
      },
      // _grade: {
      //   prop: 'grade',
      //   itemType: 'radio-group',
      //   label: '等级:',
      //   rules: [commonChangeReg],
      //   dataSource: [
      //     { label: 'A/B/C', value: 'A/B/C' }
      //   ],
      //   change: (e) => {
      //     console.log(e)
      //   }
      // },
      _whetherRecorded: {
        prop: 'whetherRecorded',
        itemType: 'select',
        label: '是否必录',
        itemStyle,
        rules: [commonChangeReg],
        dataSource: [
          {
            label: '是',
            value: 1
          },
          {
            label: '否',
            value: 0
          }
        ]

      },
      _singleOrEntire: {
        prop: 'singleOrEntire',
        itemType: 'select',
        label: '单匹/整缸',
        itemStyle,
        rules: [commonChangeReg],
        dataSource: [
          {
            label: '单匹',
            value: 1
          },
          {
            label: '整缸',
            value: 2
          }
        ]
      },
      _orders: {
        prop: 'orders',
        itemType: 'input',
        label: '顺序:',
        maxlength: 50,
        rules: [commonBlurReg, maxNumberReg],
        placeholder: '请输入1.0-999.9',
        itemStyle
      },
      _remarks: {
        prop: 'remarks',
        itemType: 'input',
        label: '备注:',
        maxlength: 200,
        type: 'textarea',
        trim: (value) => {
          return value
        },
        autosize: { minRows: 2, maxRows: 4 },
        placeholder: '请输入',
        itemStyle
      }
    }

    const problemPop = {
      _name: {
        prop: 'name',
        itemType: 'input',
        label: '中文名:',
        maxlength: 50,
        rules: [commonBlurReg],
        placeholder: '请输入中文名称',
        itemStyle
      },
      _nameEn: {
        prop: 'nameEn',
        itemType: 'input',
        label: '英文名:',
        maxlength: 50,
        placeholder: '请输入英文名称',
        itemStyle
      },
      _remarks: {
        prop: 'remarks',
        itemType: 'input',
        label: '备注:',
        maxlength: 200,
        type: 'textarea',
        itemStyle,
        trim: (value) => {
          return value
        },
        autosize: { minRows: 2, maxRows: 4 },
        placeholder: '请输入'
      }
    }
    // 这是pop弹出层用的配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增',
      customClass: 'popOptionsClass',
      ok: params => {
        this.addOrEdit(params)
      },
      okText: '保存',
      cancel: params => {
        this.PopDialogHandle()
      },
      formDatas: {},
      formOptions: {
        labelWidth: '100px',
        inline: true

      },
      content: {
        ...deductPop
      }
    }
    return {
      commonChangeReg,
      commonBlurReg,
      maxNumberReg,
      formOtions: {
        size: 'small',
        inline: true
      },
      popOptions,
      deductPop,
      otherPop,
      problemPop
    }
  }
}
