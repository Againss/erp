import * as api from '../api/index.js'
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
    const itemStyle = { width: '32%', 'margin-right': '0' }

    // 检测项目
    const checkAgenciesPop = {
      _grade: {
        prop: 'grade',
        itemType: 'radio-group',
        label: '',
        rules: [commonChangeReg],
        itemStyle: { 'margin-let': '50px' },
        dataSource: [
          { label: '一级项目', value: 0 }, // 0：一级项目  1：二级项目
          { label: '二级项目', value: 1 }
        ],
        change: (value, form, formDatas, setFormDatas, scope) => {
          setFormDatas({
            grade: value,
            name1: '',
            name: '',
            nameEn: '',
            orders: '',
            remarks: '',
            parent: ''
          })
          this.checkGrade(value)
        }
      },
      // 二级项目的配置
      _parent: {
        prop: 'parent',
        itemType: 'select',
        valueType: 'object',
        label: '所属上级:',
        maxlength: 50,
        placeholder: '请选择所属上级',
        rules: [commonChangeReg],
        isShow: false,
        filterable: true,
        dataSource: [],
        visibleChange: (flag) => {
          flag && api.physicalTestItemsLsit1({ status: 'Y', parentId: 0, isEnabled: 1 }).then(res => {
            console.log(res)
            const resData = res.data || []
            this.$set(this.checkAgenciesPop._parent, 'dataSource', resData.map(v => {
              return {
                ...v,
                label: v.name,
                value: v.id
              }
            }))
          })
        },
        change: (value, form, formDatas, setFormDatas, scope) => {
          api.checkAgenciesList({ status: 'Y', parentId: value.id, isEnabled: 1 }).then(res => {
            setFormDatas({
              name1: res && res.data || ''
            })
            formDatas.name1 = res && res.data || ''
          })
          if (this.type === 'add') {
            this.ordersMax(value.id, formDatas)
          }
        }
      },
      _name1: { // 一级项目名称中文名
        prop: 'name1',
        itemType: 'input',
        label: '中文名(同级):',
        isShow: false,
        placeholder: '',
        disabled: true
      },
      _name: { // 一级项目名称中文名
        prop: 'name',
        itemType: 'input',
        label: '中文名:',
        maxlength: 50,
        isShow: true,
        rules: [commonBlurReg],
        placeholder: '请输入中文名称'
      },
      _nameEn: { // 一级项目名称英文名
        prop: 'nameEn',
        itemType: 'input',
        label: '英文名:',
        maxlength: 50,
        isShow: true,
        placeholder: '请输入英文名称'
      },
      _orders: {
        prop: 'orders',
        itemType: 'input',
        label: '顺序:',
        isShow: true,
        maxlength: 50,
        rules: [commonBlurReg, maxNumberReg],
        placeholder: '请输入1.0-999.9'
      },
      _remarks: {
        prop: 'remarks',
        itemType: 'input',
        label: '备注:',
        isShow: true,
        maxlength: 200,
        type: 'textarea',
        trim: (value) => {
          return value
        },
        autosize: { minRows: 2, maxRows: 4 },
        placeholder: '请输入'
      }

    }
    // 检测机构
    const testItemsPop = {
      _name: {
        prop: 'name',
        itemType: 'input',
        label: '中文名:',
        maxlength: 50,
        rules: [commonBlurReg],
        placeholder: '请输入中文名称'
      },
      _nameEn: {
        prop: 'nameEn',
        itemType: 'input',
        label: '英文名:',
        maxlength: 50,
        placeholder: '请输入英文名称'
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
        debugger
        this.addOrEdit(params)
      },
      okText: '保存',
      cancel: params => {
        this.PopDialogHandle()
      },
      formDatas: {
        grade: 0
      },
      formOptions: {
        labelWidth: '110px',
        size: 'small'
      },
      content: {}
    }
    return {
      itemStyle,
      commonChangeReg,
      commonBlurReg,
      maxNumberReg,
      formOtions: {
        size: 'small',
        inline: true
      },
      popOptions,
      checkAgenciesPop,
      testItemsPop
    }
  },
  methods: {
    checkGrade(grade, formDatas) {
      // flag true: 不清空数据 false:清空数据 编辑的时候不清空数据  新增的时候清空数据
      if (grade === 0) { // 一级项目, 把二级项目的字段隐藏并清空
        this.ordersMax()
        this.popOptions.content['_parent'].isShow = false
        this.popOptions.content['_name1'].isShow = false
      } else {
        this.popOptions.content['_parent'].isShow = true
        this.popOptions.content['_name1'].isShow = true
      }
    }
  }
}
