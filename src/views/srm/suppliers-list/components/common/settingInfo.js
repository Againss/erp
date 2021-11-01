import * as api from '../../api/index'
import addLine from './addLine.vue'
export const settingInfo = {
  data() {
    const validateNum = (rule, value, callback) => {
      const reg = /^[1-9]\d{0,3}?$/
      if ((value && !reg.test(value)) || (!value)) {
        callback(new Error('请输入1-9999的正整数'))
      }
      callback()
    }
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const integerRegMast = (rule, value, callback) => {
      const reg = /^[1-9]\d*$/
      if ((value && !reg.test(value)) || !value) {
        return callback(new Error('请输入正整数'))
      }
      callback()
    }

    const regNum = (rule, value, callback) => {
      const reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/
      if (!value) {
        return callback(new Error('请输入'))
      } else if (value && !reg.test(value)) {
        return callback(new Error('请输入正数且最多两位小数'))
      }
      return callback()
    }
    const maxNumberReg = (rule, value, callback) => {
      const reg = /^(([1-9]{1}\d{0,7})|(0{1}))(\.\d{1})?$/
      if ((value && !reg.test(value))) {
        callback(new Error('请输入8位整数，或最多可保留1位小数'))
      }
      callback()
    }
    const yeaReg = this.$getRules({
      type: 'number',
      pattern: /^\d{4}$/,
      message: '请输入4位数字，如：2010',
      trigger: ['blur']
    })

    const column = {
      _speed: {
        prop: 'speed',
        label: '车速（m/min)',
        minWidth: '110',
        showOverflowTooltip: true
      },
      _monthOutput: {
        prop: 'monthOutput',
        label: '月产能（吨）',
        minWidth: '105',
        showOverflowTooltip: true
      },
      _controlPc: {
        prop: 'controlPc',
        label: '控制电脑品牌',
        minWidth: '130',
        showOverflowTooltip: true
      },
      _yearsProduction: {
        prop: 'yearsProduction',
        label: '出厂年限',
        minWidth: '105',
        showOverflowTooltip: true
      },
      _updatedTime: {
        prop: 'updatedTime',
        label: '更新时间',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(
            scope.row[scope.column.property], '{y}-{m}-{d} {h}:{i}') : ''
        }
      },
      _remark: {
        prop: 'remark',
        label: '备注',
        minWidth: '130',
        showOverflowTooltip: true
      }
    }

    const cont = [
      {
        prop: 'speed',
        itemType: 'input',
        label: '车速（m/min)',
        maxlength: 10,
        rules: [{ trigger: 'blur', validator: maxNumberReg }]
      },
      {
        prop: 'monthOutput',
        itemType: 'input',
        label: '月产能（吨）',
        maxlength: 10,
        rules: [{ trigger: 'blur', validator: maxNumberReg }]
      },
      {
        prop: 'controlPc',
        itemType: 'input',
        label: '控制电脑品牌',
        maxlength: 50
      },
      {
        prop: 'yearsProduction',
        itemType: 'input',
        label: '出厂年限',
        maxlength: 4,
        rules: [yeaReg]
      },
      {
        itemType: 'input',
        type: 'textarea',
        prop: 'remark',
        label: '备注:',
        rows: 3,
        maxlength: 50,
        placeholder: '请输入备注'
      }
    ]

    const columnsDefault = {
      _process: {
        prop: 'process',
        label: '工序',
        minWidth: '105'
      },
      _mainDevice: {
        prop: 'mainDevice',
        label: '主要生产设备',
        minWidth: '105'
      },
      _model: {
        prop: 'model',
        label: '型号',
        minWidth: '105'
      },
      _quantity: {
        prop: 'quantity',
        label: '数量',
        minWidth: '105'
      },
      _brand: {
        prop: 'brand',
        label: '品牌',
        minWidth: '105',
        showOverflowTooltip: true,
        formater: (scope) => (scope.row.brand ? scope.row.brand.label : '')
      },
      _dailyOutput: {
        prop: 'dailyOutput',
        label: '饱和日产量',
        minWidth: '105'
      }
    }
    const contentDefault = [
      {
        prop: 'process',
        itemType: 'input',
        label: '工序',
        maxlength: '50',
        rules: [commonBlurReg]
      },
      {
        prop: 'mainDevice',
        itemType: 'input',
        label: '主要生产设备',
        maxlength: '50',
        rules: [commonBlurReg]
      },
      {
        prop: 'model',
        itemType: 'input',
        label: '型号',
        maxlength: '50',
        rules: [commonBlurReg]
      },
      {
        prop: 'quantity',
        itemType: 'input',
        label: '数量',
        maxlength: '50',
        rules: [{ required: true, trigger: 'blur', validator: integerRegMast }]
      },
      {
        prop: 'brand',
        itemType: 'select',
        valueType: 'object',
        label: '品牌',
        filterable: true,
        rules: [commonBlurReg],
        dataSource: []
      },
      {
        prop: 'dailyOutput',
        itemType: 'input',
        label: '饱和日产量',
        maxlength: '50',
        rules: [commonBlurReg]
      }
    ]
    const columnsOther = {
      _code: {
        prop: 'code',
        label: '序号',
        width: '60',
        showOverflowTooltip: true,
        formater: scope => scope.$index + 1
      },
      _deviceType: {
        prop: 'deviceType',
        label: '设备类型',
        minWidth: '105',
        formater: scope => scope.row.deviceType && scope.row.deviceType.label || ''
      },
      _deviceName: {
        prop: 'deviceName',
        label: '设备名称',
        minWidth: '105',
        formater: scope => scope.row.deviceName && scope.row.deviceName.label || ''
      },
      _brand: {
        prop: 'brand',
        label: '品牌',
        minWidth: '105',
        showOverflowTooltip: true,
        formater: (scope) => (scope.row.brand ? scope.row.brand.label : '')
      },
      _model: {
        prop: 'model',
        label: '型号',
        minWidth: '105'
      },
      _number: {
        prop: 'number',
        label: '数量',
        minWidth: '105'
      },
      _monthOutput: {
        prop: 'monthOutput',
        label: '月产能（吨）',
        minWidth: '105',
        showOverflowTooltip: true
      },
      _updatedTime: {
        prop: 'updatedTime',
        label: '更新时间',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(
            scope.row[scope.column.property], '{y}-{m}-{d} {h}:{i}') : ''
        }
      },
      _remark: {
        prop: 'remark',
        label: '备注',
        minWidth: '130',
        showOverflowTooltip: true
      }
    }
    const contentOther = [
      {
        prop: 'deviceType',
        itemType: 'select',
        label: '设备类型',
        rules: [commonBlurReg],
        valueType: 'object',
        dataSource: [],
        change: (val, form, formDatas, setFormDatas) => {
          this.contentOther[1].dataSource = val.child
          const obj = { ...formDatas }
          obj.deviceType = val
          obj.deviceName = ''
          setFormDatas(obj)
          this.popOptions.formDatas = obj
        }
      },
      {
        prop: 'deviceName',
        itemType: 'select',
        label: '设备名称',
        valueType: 'object',
        rules: [commonBlurReg],
        dataSource: []
      },
      {
        prop: 'brand',
        itemType: 'select',
        valueType: 'object',
        filterable: true,
        label: '品牌',
        rules: [commonBlurReg],
        dataSource: []
      },
      {
        prop: 'model',
        itemType: 'input',
        label: '型号',
        maxlength: '50',
        rules: [commonBlurReg]
      },
      {
        prop: 'number',
        itemType: 'input',
        label: '数量',
        maxlength: '50',
        rules: [{ required: true, trigger: 'blur', validator: validateNum }]
      },
      {
        prop: 'monthOutput',
        itemType: 'input',
        label: '月产能（吨）',
        maxlength: '10',
        rules: [{ trigger: 'blur', validator: maxNumberReg }]
      },
      {
        itemType: 'input',
        type: 'textarea',
        prop: 'remark',
        label: '备注:',
        rows: 3,
        maxlength: 50,
        placeholder: '请输入备注'
      }
    ]
    const columnsKnit = {
      _code: {
        prop: 'code',
        label: '序号',
        width: '60',
        showOverflowTooltip: true,
        formater: scope => (this.pagination.currentPage - 1) * this.pagination.pageSize + scope.$index + 1
      },
      // _deviceNumber: {
      //   prop: 'deviceNumber',
      //   label: '机号',
      //   minWidth: '105',
      //   showOverflowTooltip: true
      // },
      _loomsTypeName: {
        prop: 'loomsTypeName',
        label: '织机种类',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _deviceName: {
        prop: 'deviceName',
        label: '品牌',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => scope.row.brand ? scope.row.brand.label : ''
      },
      _num: {
        prop: 'num',
        label: '数量',
        minWidth: '80',
        showOverflowTooltip: true
      },
      _inch: {
        prop: 'inch',
        label: '寸数',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => scope.row.inch ? scope.row.inch + '"' : ''
      },
      _approach: {
        prop: 'approach',
        label: '路数',
        minWidth: '80',
        showOverflowTooltip: true
      },
      _needles: {
        prop: 'needles',
        label: '针数',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          const str = (scope.row.supplierKnitNums || []).reduce((a, n) => {
            a += `<p>${n.needles && n.needles + 'G' || ''}</p>`
            return a
          }, '<div>')
          return str + '</div>'
        }
      },
      _syringes: {
        prop: 'syringes',
        label: '针筒数',
        minWidth: '90',
        showOverflowTooltip: true,
        formater: scope => {
          const str = (scope.row.supplierKnitNums || []).reduce((a, n) => {
            a += `<p>${n.syringes || ''}</p>`
            return a
          }, '<div>')
          return str + '</div>'
        }
      },
      _sumNeedles: {
        prop: 'sumNeedles',
        label: '总针数',
        minWidth: '105',
        showOverflowTooltip: true,
        formater: scope => {
          const str = (scope.row.supplierKnitNums || []).reduce((a, n) => {
            a += `<p>${n.sumNeedles && n.sumNeedles + 'N' || ''}</p>`
            return a
          }, '<div>')
          return str + '</div>'
        }
      },
      _suitableCloth: {
        prop: 'suitableCloth',
        label: '适宜布种',
        minWidth: '105',
        showOverflowTooltip: true
      },
      _monthOutput: {
        prop: 'monthOutput',
        label: '月产能（吨）',
        minWidth: '105',
        showOverflowTooltip: true
      },
      _processFlower: {
        prop: 'processFlower',
        label: '加工花型',
        minWidth: '105',
        showOverflowTooltip: true,
        formater: scope => {
          const type = {
            '1': '自动间',
            '2': '排间',
            '3': '净色',
            '4': '提花'
          }
          return type[scope.row.processFlower] || '无'
        }
      },
      _turn: {
        prop: 'turn',
        label: '转向',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => scope.row.turn === 1 ? '正转' : scope.row.turn === 2 ? '反转' : ''
      },
      ...column
    }
    const contentKnit = [
      {
        prop: 'departmentId',
        itemType: 'input',
        label: '设备ID',
        maxlength: '50',
        disabled: true,
        placeholder: '保存自动生成'
      },
      // {
      //   prop: 'deviceNumber',
      //   itemType: 'input',
      //   label: '机号',
      //   maxlength: '20',
      //   rules: commonBlurReg
      // },
      {
        prop: 'loomsTypeReq',
        itemType: 'select',
        label: '织机种类',
        rules: [commonBlurReg],
        valueType: 'object',
        dataSource: []
      },
      {
        prop: 'brand',
        itemType: 'select',
        valueType: 'object',
        filterable: true,
        label: '品牌',
        rules: [commonBlurReg],
        dataSource: []
      },
      {
        prop: 'num',
        itemType: 'input',
        label: '数量',
        rules: [{ required: true, trigger: 'blur', validator: validateNum }]
      },
      {
        prop: 'inch',
        itemType: 'input',
        label: '寸数',
        maxlength: '2',
        rules: [{ required: true, trigger: 'blur', validator: integerRegMast }]
      },
      {
        prop: 'approach',
        itemType: 'input',
        label: '路数',
        maxlength: '5',
        rules: [{ required: true, trigger: 'blur', validator: integerRegMast }]
      },
      {
        prop: 'supplierKnitNums',
        components: { addLine }
      },
      {
        prop: 'suitableCloth',
        itemType: 'input',
        label: '适宜布种',
        maxlength: '200'
      },
      {
        prop: 'processFlower',
        itemType: 'select',
        label: '加工花型',
        clearable: true,
        dataSource: [
          { label: '自动间', value: 1 },
          { label: '排间', value: 2 },
          { label: '净色', value: 3 },
          { label: '提花', value: 4 }
        ]
      },
      {
        prop: 'turn',
        itemType: 'select',
        label: '转向',
        clearable: true,
        dataSource: [
          { label: '正转', value: 1 },
          { label: '反转', value: 2 }
        ]
      },
      ...cont
    ]
    const columnsDye = {
      _code: {
        prop: 'code',
        label: '序号',
        width: '60',
        showOverflowTooltip: true,
        formater: scope => scope.$index + 1
      },
      _cylinderSerialNumber: {
        prop: 'cylinderSerialNumber',
        label: '缸序号',
        minWidth: '105',
        showOverflowTooltip: true
      },
      _specifications: {
        prop: 'specifications',
        label: '规格',
        minWidth: '105',
        showOverflowTooltip: true
      },
      _goWayOfFluid: {
        prop: 'goWayOfFluid',
        label: '走液方式',
        minWidth: '105',
        formater: scope => {
          const arr = ['气流', '溢流', '气液', '拉缸', '其他']
          return scope.row.goWayOfFluid && arr[scope.row.goWayOfFluid - 1] || ''
        }
      },
      _cylinderType: {
        prop: 'cylinderType',
        label: '缸型分类',
        minWidth: '105',
        formater: scope => {
          const arr = ['常温', '高温']
          return scope.row.cylinderType && arr[scope.row.cylinderType - 1] || ''
        }
      },
      _cylinderCapacity: {
        prop: 'cylinderCapacity',
        label: '缸容量',
        minWidth: '105',
        showOverflowTooltip: true
      },
      _brand: {
        prop: 'brand',
        label: '品牌',
        minWidth: '105',
        showOverflowTooltip: true,
        formater: scope => scope.row.brand ? scope.row.brand.label : ''
      },
      _number: {
        prop: 'number',
        label: '数量',
        minWidth: '80',
        showOverflowTooltip: true
      },
      _pipeNumber: {
        prop: 'pipeNumber',
        label: '管数',
        minWidth: '80',
        showOverflowTooltip: true
      },
      _deviceName: {
        prop: 'deviceName',
        label: '设备名称',
        minWidth: '105',
        showOverflowTooltip: true
      },
      _diameter: {
        prop: 'diameter',
        label: '直径(mm)',
        minWidth: '105',
        showOverflowTooltip: true
      },
      _bathRatio: {
        prop: 'bathRatio',
        label: '浴比',
        minWidth: '105',
        showOverflowTooltip: true
      },
      _latheSpeed: {
        prop: 'latheSpeed',
        label: '车速（m/min)',
        minWidth: '110',
        showOverflowTooltip: true
      },
      _monthlyProductionCapacity: {
        prop: 'monthlyProductionCapacity',
        label: '月产能（吨）',
        minWidth: '105',
        showOverflowTooltip: true
      },
      _computerBrand: {
        prop: 'computerBrand',
        label: '控制电脑品牌',
        minWidth: '130',
        showOverflowTooltip: true
      },
      _dateOfProduction: {
        prop: 'dateOfProduction',
        label: '出厂年限',
        minWidth: '105',
        showOverflowTooltip: true
      },
      _updatedTime: {
        prop: 'updatedTime',
        label: '更新时间',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(
            scope.row[scope.column.property], '{y}-{m}-{d} {h}:{i}') : ''
        }
      },
      _remark: {
        prop: 'remark',
        label: '备注',
        minWidth: '130',
        showOverflowTooltip: true
      }
    }
    const contentDye = [
      {
        prop: 'departmentId',
        itemType: 'input',
        label: '设备ID',
        maxlength: '50',
        disabled: true,
        placeholder: '保存自动生成'
      },
      {
        prop: 'cylinderSerialNumber',
        itemType: 'input',
        label: '缸序号',
        maxlength: '20'
      },
      // {
      //   prop: 'deviceNumber',
      //   itemType: 'input',
      //   label: '机号',
      //   maxlength: '20',
      //   rules: commonBlurReg
      // },
      {
        prop: 'specifications',
        itemType: 'input',
        label: '型号',
        maxlength: '50'
      },
      {
        prop: 'goWayOfFluid',
        itemType: 'select',
        label: '走液方式',
        dataSource: [
          { label: '气流', value: 1 },
          { label: '溢流', value: 2 },
          { label: '气液', value: 3 },
          { label: '拉缸', value: 4 },
          { label: '其他', value: 5 }
        ],
        rules: [commonBlurReg]
      },
      {
        prop: 'cylinderType',
        itemType: 'select',
        label: '缸型分类',
        rules: [commonBlurReg],
        dataSource: [
          { label: '常温', value: 1 },
          { label: '高温', value: 2 }
        ]
      },
      {
        prop: 'cylinderCapacity',
        itemType: 'input',
        label: '缸容量',
        rules: [{ required: true, trigger: 'blur', validator: regNum }]
      },
      {
        prop: 'brand',
        itemType: 'select',
        valueType: 'object',
        filterable: true,
        label: '品牌',
        rules: [commonBlurReg],
        dataSource: []
      },
      {
        prop: 'number',
        itemType: 'input',
        label: '数量',
        rules: [{ required: true, trigger: 'blur', validator: validateNum }]
      },
      {
        prop: 'pipeNumber',
        itemType: 'input',
        label: '管数',
        rules: [{ required: true, trigger: 'blur', validator: validateNum }]
      },
      {
        prop: 'deviceName',
        itemType: 'input',
        label: '设备名称',
        maxlength: 50
      },
      {
        prop: 'diameter',
        itemType: 'input',
        label: '直径(mm)',
        maxlength: 10,
        rules: [{ trigger: 'blur', validator: maxNumberReg }]
      },
      {
        prop: 'bathRatio',
        itemType: 'input',
        label: '浴比',
        maxlength: 10,
        rules: [{ trigger: 'blur', validator: maxNumberReg }]
      },
      {
        prop: 'latheSpeed',
        itemType: 'input',
        label: '车速（m/min)',
        maxlength: 10,
        rules: [{ trigger: 'blur', validator: maxNumberReg }]
      },
      {
        prop: 'monthlyProductionCapacity',
        itemType: 'input',
        label: '月产能（吨）',
        maxlength: 10,
        rules: [{ trigger: 'blur', validator: maxNumberReg }]
      },
      {
        prop: 'computerBrand',
        itemType: 'input',
        label: '控制电脑品牌',
        maxlength: 50
      },
      {
        prop: 'dateOfProduction',
        itemType: 'input',
        label: '出厂年限',
        maxlength: 4,
        rules: [yeaReg]
      },
      {
        itemType: 'input',
        type: 'textarea',
        prop: 'remark',
        label: '备注:',
        rows: 3,
        maxlength: 50,
        placeholder: '请输入备注'
      }
    ]
    const columnsPrint = {
      _code: {
        prop: 'code',
        label: '序号',
        width: '60',
        showOverflowTooltip: true,
        formater: scope => scope.$index + 1
      },
      // _deviceNumber: {
      //   prop: 'deviceNumber',
      //   label: '机号',
      //   minWidth: '105',
      //   showOverflowTooltip: true
      // },
      _deviceName: {
        prop: 'deviceName',
        label: '设备名称',
        minWidth: '105',
        showOverflowTooltip: true
      },
      _setOfNumber: {
        prop: 'setOfNumber',
        label: '套数',
        minWidth: '105',
        showOverflowTooltip: true
      },
      _frameWidth: {
        prop: 'frameWidth',
        label: '机架幅宽',
        minWidth: '105',
        showOverflowTooltip: true
      },
      _scrappingPrintingWay: {
        prop: 'scrappingPrintingWay',
        label: '刮印方式',
        minWidth: '105',
        showOverflowTooltip: true
      },
      _brand: {
        prop: 'brand',
        label: '品牌',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => scope.row.brand ? scope.row.brand.label : ''
      },
      _num: {
        prop: 'num',
        label: '数量',
        minWidth: '80',
        showOverflowTooltip: true
      },
      _countryOfOrigin: {
        prop: 'countryOfOrigin',
        label: '国别产地',
        minWidth: '80',
        showOverflowTooltip: true
      },
      _currentProcess: {
        prop: 'currentProcess',
        label: '目前在做工艺',
        minWidth: '130',
        showOverflowTooltip: true
      },
      // _printingType: {
      //   prop: 'printingType',
      //   label: '印花机类',
      //   minWidth: '120',
      //   showOverflowTooltip: true,
      //   formater: scope => {
      //     const type = {
      //       '1': '平网机',
      //       '2': '圆头机'
      //     }
      //     return type[scope.row.printingType] || ''
      //   }
      // },
      ...column
    }

    const contentPrint = [
      {
        prop: 'departmentId',
        itemType: 'input',
        label: '设备ID',
        maxlength: '50',
        disabled: true,
        placeholder: '保存自动生成'
      },
      // {
      //   prop: 'deviceNumber',
      //   itemType: 'input',
      //   label: '机号',
      //   maxlength: '20',
      //   rules: commonBlurReg
      // },
      {
        prop: 'deviceName',
        itemType: 'input',
        label: '设备名称',
        maxlength: 20,
        rules: [commonBlurReg]
      },
      {
        prop: 'setOfNumber',
        itemType: 'input',
        label: '套数',
        maxlength: '10',
        rules: [{ required: true, trigger: 'blur', validator: integerRegMast }]
      },
      {
        prop: 'frameWidth',
        itemType: 'input',
        label: '机架幅宽',
        maxlength: '20'
      },
      {
        prop: 'scrappingPrintingWay',
        itemType: 'input',
        label: '刮印方式',
        maxlength: '20'
      },
      {
        prop: 'brand',
        itemType: 'select',
        valueType: 'object',
        label: '品牌',
        filterable: true,
        rules: [commonBlurReg],
        dataSource: []
      },
      {
        prop: 'num',
        itemType: 'input',
        label: '数量',
        rules: [{ required: true, trigger: 'blur', validator: validateNum }]
      },
      {
        prop: 'countryOfOrigin',
        itemType: 'input',
        label: '国别产地',
        maxlength: '20'
      },
      {
        prop: 'currentProcess',
        itemType: 'input',
        label: '目前在做工艺',
        maxlength: '100'
      },
      // {
      //   prop: 'printingType',
      //   itemType: 'select',
      //   label: '印花机类',
      //   rules: [commonBlurReg],
      //   dataSource: [
      //     { label: '平网机', value: 1 },
      //     { label: '圆网机', value: 2 }
      //   ]
      // },
      ...cont
    ]

    return {
      columnsDefault,
      contentDefault,
      dataSourceDefault: [],
      columnsOther,
      contentOther,
      dataSourceOther: [],
      columnsKnit,
      contentKnit,
      dataSourceKnit: [],
      columnsDye,
      contentDye,
      dataSourceDye: [],
      columnsPrint,
      contentPrint,
      dataSourcePrint: [],
      supplierDevice: {}
    }
  },
  created() {
    this.getData()
  },
  methods: {
    bindAdd() {
      if (this.ableTabs === 'supplierDevice') {
        this.$refs.dyeworks.todo('add')
      } else {
        this.popOptions.formDatas = {}
        this.popOptions.visible = true
      }
    },
    async getSelectName() {
      const val = this.info.includes('supplierPrinting') ? 2 : this.info.includes('ranzheng') ? 1 : 0
      if (!val) return
      const res = await api.suppliersSetting('/supplier/deviceTypeList', {
        deviceCode: val
      })
      const arr = (res.data || []).map(e => ({
        ...e.device,
        child: (e.child || []).map(ele => ({
          ...ele,
          label: ele.deviceName,
          value: ele.id
        }))
      }))
      this.contentOther[0].dataSource = arr
    },
    async getData() {
      // 品牌 1染色2织机3特整4印花5纺纱
      this.contentKnit[1].dataSource = await api.getZhiJi()
      const resPin = await api.getPinPai()
      const arr = [
        { item: this.contentDefault[4], val: '5' },
        { item: this.contentOther[2], val: '3' },
        { item: this.contentKnit[2], val: '2' },
        { item: this.contentDye[6], val: '3' },
        { item: this.contentPrint[5], val: '4' }
      ]
      arr.forEach(e => {
        e.item.dataSource = [...resPin].filter(ele => e.val.includes(String(ele.equipmentType)))
      })
    },
    async delList(id) {
      const arr = {
        supplierDeviceInfos: '/supplierDevice/delete',
        supplierKnit: '/supplierKnit/delete',
        ranzheng: '/supplierDeviceInfo/dyeingAndFinishingPlant/delete',
        supplierPrinting: '/supplierDeviceInfo/printing/delete',
        supplierOther: '/supplierDeviceInfo/otherDevice/delete'
      }
      await api.suppliersSetting(arr[this.ableTabs], { id })
      this.$message.success('删除成功')
      const description = {
        beforeText: `在'供应商采购-供应商列表'删除了一条设备信息`,
        beforeCode: { supplierId: this.$route.query.id, id }
      }
      const opratorType = `DEL`
      this.$store.dispatch('app/fetchParamsLog', {
        params: { supplierId: this.$route.query.id, id },
        opratorType,
        api: 'srm/' + arr[this.ableTabs],
        description,
        appId: 'srm'
      })
      this.getList()
    },
    async saveData(row) {
      let arr = null
      if (row.typeIndex === undefined) {
        arr = {
          supplierDeviceInfos: '/supplierDevice/add',
          supplierKnit: '/supplierKnit/add',
          ranzheng: '/supplierDeviceInfo/dyeingAndFinishingPlant/add',
          supplierPrinting: '/supplierDeviceInfo/printing/add',
          supplierOther: '/supplierDeviceInfo/otherDevice/save'
        }
      } else {
        arr = {
          supplierDeviceInfos: '/supplierDevice/modify',
          supplierKnit: '/supplierKnit/modify',
          ranzheng: '/supplierDeviceInfo/dyeingAndFinishingPlant/modify',
          supplierPrinting: '/supplierDeviceInfo/printing/modify',
          supplierOther: '/supplierDeviceInfo/otherDevice/modify'
        }
      }
      const data = {
        serviceProviderId: this.$route.query.id,
        ...row,
        supplierId: this.$route.query.id
      }
      // if (this.ableTabs === 'two') {
      //   data.belongsType = this.info.settingType === 3 ? 1 : 2
      // }
      await api.suppliersSetting(arr[this.ableTabs], data)
      this.$message.success('保存成功')
      this.popOptions.visible = false
      const str = row.typeIndex === undefined ? '新增' : '修改'
      const description = {
        beforeText: `在'供应商采购-供应商列表'${str}了一条设备信息`,
        beforeCode: data
      }
      const opratorType = row.typeIndex === undefined ? 'INSERT' : `UPDATE`
      this.$store.dispatch('app/fetchParamsLog', {
        params: data,
        opratorType,
        api: 'srm/' + arr[this.ableTabs],
        description,
        appId: 'srm'
      })
      this.getList()
    },
    async getList() {
      if (!(this.ableTabs && this.info.includes(this.ableTabs))) return
      if (this.ableTabs === 'supplierKnit') {
        const obj = {
          supplierId: this.$route.query.id,
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.pageNum
        }
        const res = await api.suppliersSetting('/supplierKnit/page', obj)
        this.pagination = {
          ...this.pagination,
          dataTotal: res.data.total,
          currentPage: res.data.pageNum || 1,
          pageSize: res.data.pageSize || 10,
          pageNum: res.data.pageNum || 1
        }
        this.dataSourceKnit = res.data && res.data.list || []
      } else {
        const obj = {
          supplierDeviceInfos: '/supplierDevice/list',
          ranzheng: '/supplierDeviceInfo/dyeingAndFinishingPlant/list',
          supplierPrinting: '/supplierDeviceInfo/printing/list',
          supplierOther: '/supplierDeviceInfo/otherDevice/list',
          supplierDevice: '/supplierDeviceInfo/dyeingEquipment/list'
        }
        this[this.datas.flag] = (await api.suppliersSetting(obj[this.ableTabs], {
          supplierId: this.$route.query.id,
          serviceProviderId: this.$route.query.id
        })).data || (this.datas.flag === 'supplierDevice' ? {} : [])
      }
    }
  }
}
