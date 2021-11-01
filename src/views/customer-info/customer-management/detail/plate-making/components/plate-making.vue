<template>
  <div>
    <div
      v-show="isEdit"
      class="plate-making-button plate-making-pointer"
      style="position: absolute;top: 140px;right: 21px;"
      @click="handleAddRequire"
    >
      <span style="margin-left: 14px;font-size: 14px;">新增</span>
    </div>

    <!-- 表格 -->
    <cs-custom-table
      class="plate-making-table--no-stripe plate-making-table--fixed-right"
      tooltip-effect="dark"
      border
      header-cell-class-name="plate-making-table-header-cell"
      style="margin-top: 20px;"
      :columns="columns"
      :data-source="tableDataSource"
      :operates="operates"
      :span-method="spanMethod"
    />

    <!-- 新增弹窗 -->
    <cs-custom-pop ref="pop" :options="popOptions" />
  </div>
</template>

<script>
import {
  isObject,
  selectObjFormatter,
  updateSelectDataSource,
  getUUID,
  VALUE_KEY,
  SETTING_TYPE
} from '../common'
import { getTemplateParam } from '../api'
import { PublicCustomer } from '@/views/customer-info/public'

const itemStyle = { width: '100%' }
const DEF_PRIORITY = 0
const SPAN_PROPS = ['batchRequire', 'templateType', 'orderContain', 'charge'] // 有合并需求的字段
const CMP_PROPS = ['batchRequire', 'templateType', 'orderContain', 'charge', 'handoverType', 'standard'] // 重复性校验的字段
const YES_OR_NOT_PRIORITY = { 1: 1, 0: 2 }
const ID_PROP = 'templateRequirementId'

function floatValidator(rule, value, callback) {
  const reg = /^\d+\.?\d{0,2}$/
  if (!value) {
    return callback(new Error('数量单位不能为空'))
  } else if (parseFloat(value) === 0 || !reg.test(value)) {
    return callback(new Error('只能输入正数，两位小数'))
  } else if (value > 100) {
    return callback(new Error('最大值为100'))
  }
  return callback()
}

function intValidator(rule, value, callback) {
  const reg = /^[1-9]\d{0,9}?$/

  if (!value) {
    return callback(new Error('数量单位不能为空'))
  } else if ((parseInt(value) === 0 || !reg.test(value))) {
    return callback(new Error('请填写正整数'))
  } else if (value > 50) {
    return callback(new Error('最大值为50'))
  }

  return callback()
}

function unknownValidator(rule, value, callback) {
  return callback(new Error('单位类型不匹配'))
}

const RULES_MAP = {
  validFloat: { required: true, trigger: ['change'], validator: floatValidator },
  validInt: { required: true, trigger: ['change'], validator: intValidator },
  validUnknown: { required: true, trigger: ['change'], validator: unknownValidator }
}

export default {
  name: 'PlateMaking',

  mixins: [PublicCustomer],

  props: {
    dataSource: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      columns: {
        _batchRequire: {
          prop: 'batchRequire',
          label: '批次要求',
          showOverflowTooltip: true,
          formater: selectObjFormatter('batchRequire')
        },
        _templateType: {
          prop: 'templateType',
          label: '制板类型',
          showOverflowTooltip: true,
          formater: selectObjFormatter('templateType')
        },
        _orderContain: {
          prop: 'orderContain',
          label: '订单是否包含',
          minWidth: '110',
          formater: scope => {
            return {
              0: '否',
              1: '是'
            }[scope.row.orderContain] || '-'
          }
        },
        _charge: {
          prop: 'charge',
          label: '是否收费',
          formater: scope => {
            return {
              0: '否',
              1: '是'
            }[scope.row.charge] || '-'
          }
        },
        _handoverType: {
          prop: 'handoverType',
          label: '交接类型',
          showOverflowTooltip: true,
          formater: selectObjFormatter('handoverType')
        },
        _standard: {
          prop: 'standard',
          label: '规格',
          showOverflowTooltip: true,
          formater: selectObjFormatter('standard')
        },
        _quantity: {
          prop: 'quantity',
          label: '数量',
          showOverflowTooltip: true
        },
        _unit: {
          prop: 'unit',
          label: '单位',
          showOverflowTooltip: true,
          formater: selectObjFormatter('unit')
        },
        _remark: {
          prop: 'remark',
          label: '备注说明',
          showOverflowTooltip: true
        }
      },
      tableDataSource: [],
      operates: {
        label: '操作',
        fixed: 'right',
        width: '120',
        isShow: () => {
          return this.isEdit
        },
        dataSource: [
          {
            label: '编辑',
            isShow: true,
            handle: scope => {
              this.processRowData(scope.row)
              this.popEdit = true
              this.popOptions.formDatas = scope.row
              updateSelectDataSource(this.popOptions.content, this.popOptions.formDatas, true)
              this.setPopVisible(true)
            }
          },
          {
            label: '删除',
            isShow: true,
            style: { 'color': '#FE4949' },
            handle: scope => {
              this.$confirm('确认删除该条数据？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'btn-cancel'
              })
                .then(() => {
                  this.handleDelete(scope)
                  this.$message.success('删除成功')
                })
                .catch(() => {
                  this.$message({ type: 'info', message: '已取消删除' })
                })
            }
          }
        ]
      },

      // 原始数据
      rawData: [],

      popEdit: false, // 是否为表格编辑操作
      popOptions: {
        itemType: 'drawer',
        size: '480px',
        title: '新增制板要求',
        visible: false,
        okText: '保存',
        saveAndaddText: '继续添加',
        ok: params => {
          this.popEdit ? this.handleEdit(params) : this.handleAdd(params)
        },
        saveAndadd: this.handleSaveAndAdd,
        beforeClose: () => {
          this.setPopVisible()
        },
        cancel: () => {
          this.setPopVisible()
        },
        formDatas: {},
        formOptions: {
          labelWidth: '100px',
          inline: true,
          getForm: (form) => {
            this.popForm = form
          },
          syncDataHandle: (data) => {
            this.syncPopFormData = data
          }
        },
        content: {
          _batchRequire: {
            prop: 'batchRequire',
            itemType: 'select',
            itemStyle,
            label: '批次要求:',
            valueType: 'object',
            valueKey: 'value',
            dataSource: [],
            clearable: true,
            rules: [{ required: true, message: '批次要求不能为空', trigger: 'change' }],
            visibleChange: visible => {
              if (visible) {
                this.getOptionConfig({ fieldName: '批次要求' })
                  .then(res => {
                    this.popOptions.content._batchRequire.dataSource = res
                  })
              }
            },
            change: (value, form, formDatas, setFormDatas, scope) => {
              setFormDatas({
                templateType: null,
                standard: null,
                quantity: null,
                unit: null
              })
              !this.popEdit && this.$nextTick(() => {
                this.popForm.clearValidate()
              })
            }
          },
          _templateType: {
            prop: 'templateType',
            itemType: 'select',
            itemStyle,
            label: '制板类型:',
            valueType: 'object',
            valueKey: 'value',
            dataSource: [],
            clearable: true,
            rules: [{ required: true, message: '制板类型不能为空', trigger: 'change' }],
            visibleChange: visible => {
              if (visible) {
                getTemplateParam({
                  settingType: SETTING_TYPE.BATCH_TO_TEMPLATE,
                  sourceKey: this.syncPopFormData.batchRequire && this.syncPopFormData.batchRequire.value || ''
                }).then(res => {
                  this.popOptions.content._templateType.dataSource = res
                })
              }
            },
            change: (value, form, formDatas, setFormDatas, scope) => {
              setFormDatas({
                standard: null,
                quantity: null,
                unit: null
              })
              !this.popEdit && this.$nextTick(() => {
                this.popForm.clearValidate()
              })
            }
          },
          _orderContain: {
            prop: 'orderContain',
            itemType: 'select',
            itemStyle,
            label: '订单包含:',
            valueKey: 'value',
            dataSource: [
              { label: '是', value: 1 },
              { label: '否', value: 0 }
            ],
            clearable: true,
            rules: [{ required: true, message: '订单包含不能为空', trigger: 'change' }]
          },
          _charge: {
            prop: 'charge',
            itemType: 'select',
            itemStyle,
            label: '是否收费:',
            valueKey: 'value',
            dataSource: [
              { label: '是', value: 1 },
              { label: '否', value: 0 }
            ],
            clearable: true,
            rules: [{ required: true, message: '是否收费不能为空', trigger: 'change' }]
          },
          _handoverType: {
            prop: 'handoverType',
            itemType: 'select',
            itemStyle,
            label: '交接类型:',
            valueType: 'object',
            valueKey: 'value',
            dataSource: [],
            clearable: true,
            rules: [{ required: true, message: '交接类型不能为空', trigger: 'change' }],
            visibleChange: visible => {
              if (visible) {
                this.getOptionConfig({ fieldName: '寄送类型' })
                  .then(res => {
                    this.popOptions.content._handoverType.dataSource = res
                  })
              }
            }
          },
          _standard: {
            prop: 'standard',
            itemType: 'select',
            itemStyle,
            label: '规格:',
            valueType: 'object',
            valueKey: 'value',
            dataSource: [],
            clearable: true,
            rules: [{ required: true, message: '规格不能为空', trigger: 'change' }],
            visibleChange: visible => {
              if (visible) {
                getTemplateParam({
                  settingType: SETTING_TYPE.TEMPLATE_TO_STANDARD,
                  sourceKey: this.syncPopFormData.templateType && this.syncPopFormData.templateType.value || ''
                }).then(res => {
                  this.popOptions.content._standard.dataSource = res
                })
              }
            },
            change: (value, form, formDatas, setFormDatas, scope) => {
              setFormDatas({
                quantity: null,
                unit: null
              })
              !this.popEdit && this.$nextTick(() => {
                this.popForm.clearValidate()
              })
            }
          },
          _quantity: {
            prop: 'quantity',
            itemType: 'input',
            itemStyle: { width: 'calc(100% - 140px)' },
            label: '数量单位:',
            placeholder: '请输入数量单位',
            clearable: true,
            rules: [
              { required: true, trigger: ['change'], validator: intValidator }
            ]
          },
          _unit: {
            prop: 'unit',
            itemType: 'select',
            itemStyle: { width: '120px' },
            label: '',
            valueType: 'object',
            valueKey: 'value',
            dataSource: [],
            rules: [{ required: true, message: '单位不能为空', trigger: 'change' }],
            visibleChange: visible => {
              if (visible) {
                getTemplateParam({
                  settingType: SETTING_TYPE.STANDARD_TO_UNIT,
                  sourceKey: this.syncPopFormData.standard && this.syncPopFormData.standard.value || ''
                }).then(res => {
                  this.popOptions.content._unit.dataSource = res
                })
              }
            }
          },
          _remark: {
            prop: 'remark',
            itemType: 'input',
            type: 'textarea',
            rows: 3,
            itemStyle,
            label: '备注说明:',
            placeholder: '请输入'
          }
        }
      },
      popForm: null,
      syncPopFormData: {
        unit: { label: '', value: '', typeVal: '' }
      },

      unitTypeName: ''
    }
  },

  computed: {
    tableData() {
      return this.tableDataSource
    }
  },

  watch: {
    dataSource: {
      deep: true,
      handler(val) {
        this.rawData = val
      }
    },
    rawData: {
      deep: true,
      async handler(val) {
        this.tableDataSource = this.sortData(this.$utils.deepClone(val))
      }
    },
    popEdit(val) {
      this.popOptions.title = val ? '编辑制板要求' : '新增制板要求'
      this.popOptions.saveAndadd = val ? null : this.handleSaveAndAdd
    },
    unitTypeName(val) {
      let rulesName = 'validUnknown'

      if (['长度', '重量'].includes(val)) {
        rulesName = 'validFloat'
      } else if (val === '数量') {
        rulesName = 'validInt'
      }

      const rules = RULES_MAP[rulesName]

      this.$set(this.popOptions.content._quantity, 'rules', rules)
      this.$nextTick(() => {
        this.popForm && this.popForm.validateField(['quantity'], () => {})
      })
    },
    'syncPopFormData.unit': {
      deep: true,
      handler(val) {
        this.onUnitChange(val)
      }
    }
  },

  methods: {
    handleAddRequire() {
      this.popEdit = false
      this.popOptions.formDatas = {}

      this.setPopVisible(true)
    },

    dupCheck(newRow) {
      return this.tableData.some(cmpRow => this.sameSpan(newRow, cmpRow, 'standard', CMP_PROPS))
    },

    handleAdd(newRow) {
      this.addTableData(newRow)
      this.setPopVisible()
    },

    handleSaveAndAdd(newRow) {
      this.popForm.validate(async valid => {
        if (valid) {
          this.addTableData(newRow)
          this.$nextTick(() => {
            this.popForm.clearValidate()
          })
        }
      })
    },

    addTableData(newRow) {
      if (this.dupCheck(newRow)) {
        this.$message.error('存在相同类型的数据')
        return
      }

      // 新增数据的时候加一个id标识，方便编辑时找到对应数据
      newRow.$frontTempId = getUUID()

      this.rawData.push(newRow)
      this.popOptions.formDatas = {}
    },

    processRowData(row = {}) {
      const unit = row.unit
      const unitType = row.unitType

      // 新增的数据没有unitType这个字段
      if (unitType) {
        unit.typeVal = unitType.label
        unit.typeId = unitType.value
      }

      return row
    },

    handleEdit(row) {
      let editRowIdx = -1
      const id = row.id ? 'id' : '$frontTempId'

      // 重复性校验
      const dup = !this.rawData.every((cmpRow, idx) => {
        if (cmpRow[id] && (cmpRow[id] === row[id])) {
          editRowIdx = idx
          return true
        }

        return !this.sameSpan(row, cmpRow, 'standard', CMP_PROPS)
      })

      if (dup) {
        this.$message.error('存在相同类型的数据')
        return
      }

      this.rawData.splice(editRowIdx, 1, row)
      this.setPopVisible()
    },

    handleDelete(scope) {
      const row = scope.row
      let cmpFn = (cmpRow) => this.sameSpan(row, cmpRow, 'standard', CMP_PROPS)

      // 删除非新增的数据，直接比对id即可
      if (row[ID_PROP]) {
        cmpFn = (cmpRow) => (cmpRow[ID_PROP] === row[ID_PROP])
      }

      // 根据删除的表格数据，找到rawData中对应的那条数据
      const idx = this.rawData.findIndex(cmpFn)

      if (idx === -1) {
        return
      }

      this.rawData.splice(idx, 1)
    },

    spanMethod({ row, column, rowIndex, columnIndex }) {
      const prop = this.getPropByIndex(columnIndex)
      let colspan = 1
      let rowspan = 1

      // 不用合并的单元格不处理
      if (!SPAN_PROPS.includes(prop)) {
        return { rowspan, colspan }
      }

      if (rowIndex > 0 && this.sameSpan(rowIndex, rowIndex - 1, prop, SPAN_PROPS)) {
        rowspan = 0
        colspan = 0
      } else {
        rowspan = this.calcRowSpan(rowIndex, prop)
      }

      return { rowspan, colspan }
    },

    getPropByIndex(index) {
      const paramMap = Object.values(this.columns).map(item => item.prop || '')
      return paramMap[index]
    },

    /**
     * 比较两行数据的所有指定字段是否相等
     * @param {Number|Object} curIdx 比较行
     * @param {Number|Object} cmpIdx 比较行
     * @param {String} finalProp 最终比较的字段，该字段之后的所有字段将被忽略
     * @param {Array<String>} spanProps 比较字段集，索引靠前的优先级更高
     * @return {Boolean}
     */
    sameSpan(curIdx, cmpIdx, finalProp, spanProps = SPAN_PROPS) {
      const data = this.tableData
      const curRow = isObject(curIdx) ? curIdx : data[curIdx]
      const cmpRow = isObject(cmpIdx) ? cmpIdx : data[cmpIdx]

      if (!curRow || !cmpRow) {
        return false
      }

      for (let i = 0; i < spanProps.length; i++) {
        const prop = spanProps[i]
        let curVal = curRow[prop]
        let cmpVal = cmpRow[prop]

        if (isObject(curVal) && isObject(cmpVal)) {
          curVal = curVal[VALUE_KEY]
          cmpVal = cmpVal[VALUE_KEY]
        }

        if (curVal !== cmpVal) {
          return false
        }

        // 只比较到最终合并字段
        if (prop === finalProp) {
          break
        }
      }

      return true
    },

    calcRowSpan(idx, finalProp) {
      let rowSpan = 1
      const data = this.tableData

      for (let i = idx + 1; i < data.length; i++) {
        if (!this.sameSpan(idx, i, finalProp)) {
          break
        }

        rowSpan++
      }

      return rowSpan
    },

    sortData(data = []) {
      const props = [
        { name: 'batchRequire', priorityMap: {}},
        { name: 'templateType', priorityMap: {}},
        { name: 'orderContain', priorityMap: YES_OR_NOT_PRIORITY },
        { name: 'charge', priorityMap: YES_OR_NOT_PRIORITY }
      ]

      function updateMap(item, prop, map, priority) {
        let key = item[prop]

        key = isObject(key) ? key.value : key

        if (!map[key]) {
          map[key] = priority + 1
        }
      }

      data.forEach((item, idx) => {
        updateMap(item, 'batchRequire', props[0].priorityMap, idx)
        updateMap(item, 'templateType', props[1].priorityMap, idx)
      })

      const sortFnList = props.map(prop => this.getSortFn(prop.name, prop.priorityMap))

      return data.sort((a, b) => {
        for (let i = 0; i < sortFnList.length; i++) {
          const fn = sortFnList[i]
          const compareRes = fn(a, b)

          // 如果比较结果不相等，返回结果
          if (compareRes !== 0) {
            return compareRes
          }

          // 直接返回最后一项比较结果
          if (i === sortFnList.length - 1) {
            return compareRes
          }
        }
      })
    },

    getSortFn(paramName, priorityMap) {
      return (a, b) => {
        let key = a[paramName]
        let key1 = b[paramName]

        key = isObject(key) ? key.value : key
        key1 = isObject(key1) ? key1.value : key1

        const val = priorityMap[key] || DEF_PRIORITY
        const val1 = priorityMap[key1] || DEF_PRIORITY

        return val - val1
      }
    },

    setPopVisible(visible = false) {
      this.popOptions.visible = visible
      if (!visible) {
        this.popOptions.formDatas = {}
      }
    },

    setFormData(params) {
      this.$set(this.popOptions, 'formDatas', params)
    },

    onUnitChange(val) {
      if (!val) {
        return
      }
      this.unitTypeName = val.typeVal
    }
  }
}
</script>

<style scoped lang="scss">
</style>
