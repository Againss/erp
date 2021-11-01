<template>
  <div class="require">
    <!-- 原料要求 -->
    <cs-custom-form
      ref="ylForm"
      :data-source="ylData"
      :options="formOtions"
      :form-datas="ylFormDatas"
    />
    <!-- 天然纤维 -->
    <div v-if="ylFormDatas.checkboxs.includes(1)" class="table-item">
      <div class="header-top">
        <span>天然纤维</span>
        <el-button v-if="isEdit === 'edit'" type="primary" size="mini" @click="addNaturalClick">新增</el-button>
      </div>
      <div class="page-table">
        <cs-custom-table
          tooltip-effect="dark"
          :header-cell-style="headerCellStyle"
          :columns="naturalColumns"
          :data-source="naturalData"
          :operates="naturalOperates"
          edit-type="pop"
        />
      </div>
    </div>
    <!-- 天然纤维侧边抽屉 -->
    <div class="pop">
      <cs-custom-pop ref="naturalPop" :options="naturalPopOptions" />
    </div>
    <!-- 化学纤维 -->
    <div v-if="ylFormDatas.checkboxs.includes(2)" class="table-item">
      <div class="header-top">
        <span>化学纤维</span>
        <el-button v-if="isEdit === 'edit'" type="primary" size="mini" @click="addChemicalClick">新增</el-button>
      </div>
      <div class="page-table">
        <cs-custom-table
          tooltip-effect="dark"
          :header-cell-style="headerCellStyle"
          :columns="chemicalColumns"
          :data-source="chemicalData"
          :operates="chemicalOperates"
          edit-type="pop"
        />
      </div>
    </div>
    <!-- 化学纤维侧边抽屉 -->
    <div class="pop">
      <cs-custom-pop ref="chemicalPop" :options="chemicalPopOptions" />
    </div>
    <!-- 组合纱线 -->
    <div v-if="ylFormDatas.checkboxs.includes(3)" class="table-item">
      <div v-for="(item, index) in composeYarns" :key="index">
        <div class="header-top combination-top">
          <span>组合纱线</span>
          <el-button v-if="isEdit === 'edit' && index === 0" type="primary" size="mini" @click="addCombinationClick">新增</el-button>
          <el-button v-if="isEdit === 'edit' && index !== 0" type="danger" plain size="mini" @click="deleteCombinationClick(index)">删除</el-button>
        </div>
        <div :class="isEdit === 'detail' ? 'detail-box' : 'edit-box'">
          <cs-custom-form
            :data-source="combinationData"
            :options="formOtions"
            :form-datas="{...item, index}"
          />
        </div>
        <div class="header-top">
          <span>天然纤维</span>
          <el-button v-if="isEdit === 'edit'" type="primary" size="mini" @click="addNaturalClick(index)">新增</el-button>
        </div>
        <div class="page-table">
          <cs-custom-table
            tooltip-effect="dark"
            :header-cell-style="headerCellStyle"
            :columns="composeNaturalColumns"
            :data-source="item.naturalFiberUpdateReqtList"
            :operates="naturalOperates"
            edit-type="pop"
            :form-datas="{index}"
          />
        </div>
        <div class="header-top">
          <span>化学纤维</span>
          <el-button v-if="isEdit === 'edit'" type="primary" size="mini" @click="addChemicalClick(index)">新增</el-button>
        </div>
        <div class="page-table">
          <cs-custom-table
            tooltip-effect="dark"
            :header-cell-style="headerCellStyle"
            :columns="composeChemicalColumns"
            :data-source="item.chemicalFiberUpdateReqtList"
            :operates="chemicalOperates"
            edit-type="pop"
            :form-datas="{index}"
          />
        </div>
      </div>
    </div>
    <!-- 主纱支、细度 -->
    <div class="mainYarn">
      <div :class="isEdit === 'detail' ? 'detail-box' : 'edit-box'">
        <cs-custom-form
          ref="mainYarnFineness"
          :data-source="mainDataCopy"
          :options="formOtions"
          :form-datas="mainFormDatas"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getSelectData, getMiaoshu, getIngredient, getIngredientZh } from '../api/index.js'
import proCustom from './common/pro-ratio'
import popProportion from './common/pop-proportion'
import { deepClone } from '@/utils/index.js'
export default {
  name: 'ARequire',
  props: {
    isEdit: {
      type: String
    },
    naturalDatas: {
      type: Array
    },
    chemicalDatas: {
      type: Array
    },
    composeData: {
      type: Array
    },
    knitModeType: {
      type: [Array, Number],
      default: 0
    }
  },
  data() {
    // const searchIngredient = value => {
    //   this.getIngredient(value)
    // }
    const commonChangeReg = this.$getRules({})
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const checkVal = (rule, value, callback) => {
      const reg = /^\d+\.?\d{0,2}$/
      if (value && !reg.test(value)) {
        return callback(new Error('0.01~999.99'))
      } else if (parseInt(value) > 999.99) {
        return callback(new Error('0.01~999.99'))
      } else {
        callback()
      }
    }
    const checkValNum = (rule, value, callback) => {
      const reg = /^[1-9]\d{0,2}$/
      if (value && !reg.test(value)) {
        return callback(new Error('小于999的正整数'))
      } else if (!value) {
        return callback(new Error('必填项不能为空'))
      } else {
        callback()
      }
    }
    const checkValues = (rule, value, callback) => {
      const reg = /^\d+\.?\d{0,2}$/
      if (value && !reg.test(value)) {
        return callback(new Error('输入最多两位小数有效数字'))
      } else if (parseInt(value) > 100) {
        return callback(new Error('最大值不能超过100'))
      } else if (!(value > 0)) {
        return callback(new Error('纱比请输入大于0的有效数值'))
      } else {
        callback()
      }
    }
    const headerCellStyle = {
      'background': '#F5F7FA'
    }
    const style1 = {
      'font-size': '14px',
      'color': '#333',
      'background-color': '#eee',
      'padding': '10px',
      'border-radius': '2px',
      'margin-bottom': '15px'
    }
    const style2 = {
      'width': '100%',
      'fontSize': '16px',
      'fontWeight': '600',
      'color': '#151222',
      'border-bottom': '1px #EEEFF0 solid',
      'margin': '0 20px 15px',
      'padding': '20px 0 15px'
    }
    const style3 = {
      'margin-left': '20px'
    }
    const ylData = [
      {
        itemType: 'view',
        text: '原料要求',
        style: style2
      },
      {
        itemType: 'checkbox-group',
        prop: 'checkboxs',
        disabled: true,
        style: style3,
        className: 'require-checkbox',
        rules: [{ required: true, message: '请选择原料要求' }],
        dataSource: [
          {
            value: 1,
            label: '天然纤维'
          },
          {
            value: 2,
            label: '化学纤维'
          },
          {
            value: 3,
            label: '组合纱线'
          }
        ],
        change: (val, form, formDatas, setFormDatas, scope) => {
          if (val.filter(item => item).length === 0) {
            setFormDatas({ checkboxs: this.ylFormDatas.checkboxs })
            this.$message.warning('必须有一个勾选')
            return false
          }

          if (!val.includes(2)) {
            this.$parent.detailObj.chemicalFibers = []
          }
          if (!val.includes(1)) {
            this.$parent.detailObj.naturalFibers = []
          }
          if (!val.includes(3)) {
            this.$parent.detailObj.composeYarns = []
          }
          const combinationTempObj = { naturalFiberUpdateReqtList: [], chemicalFiberUpdateReqtList: [] }
          if (val.includes(3)) {
            if (!this.composeYarns || !this.composeYarns.length) {
              this.composeYarns = [combinationTempObj]
            } else if (this.composeYarns.length === 0) {
              this.composeYarns.push(combinationTempObj)
            }
          }
          this.$set(this.ylFormDatas, 'checkboxs', val)
        }
      }
    ]
    const naturalBaseColumns = [
      {
        prop: 'yarnInfo',
        label: '纱支',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      },
      {
        prop: 'num',
        label: '条数',
        showOverflowTooltip: true
      },
      {
        prop: 'elementInfo',
        label: '成份',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      },
      {
        prop: 'elementRatio',
        label: '比例',
        showOverflowTooltip: true
      },
      {
        prop: 'methodInfo',
        label: '梳棉方法',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      },
      {
        prop: 'spinningMethodInfo',
        label: '纺纱方法',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      },
      {
        prop: 'twistDirectionInfo',
        label: '捻向',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      },
      {
        prop: 'yarnCategoryInfo',
        label: '纱类',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      },
      {
        prop: 'yarnLevel',
        label: '纱线等级',
        showOverflowTooltip: true
      },
      {
        prop: 'machineYarn',
        label: '成品/上机纱长',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => this.getMachineYarn(scope.row)
      }
    ]
    const naturalColumns = [
      ...naturalBaseColumns,
      {
        prop: 'yarnRato',
        label: '纱比',
        showOverflowTooltip: true
      }
    ]
    const composeNaturalColumns = [
      ...naturalBaseColumns,
      {
        prop: 'yarnRato',
        label: '组合占比',
        showOverflowTooltip: true
      }
    ]
    const naturalOperatesData = [
      {
        label: '编辑',
        isShow: true,
        handle: (scope, form, formDatas, setFormDatas) => {
          this.naturalPopHandle('编辑天然纤维')
          this.getNaturalSelect(scope.row)

          const obj = this.setMachineYarn('edit', scope.row)
          this.$nextTick(() => {
            // debugger

            // const naturalContent = scope.row.type === '1' ? [...this.specialContent] : [...this.generalContent]
            // this.$set(this.naturalPopOptions, 'content', [...this.naturalContent, ...deepClone(naturalContent)])
            const naturalContent = [...this.naturalContent, ...deepClone(this.generalContent)]
            this.$set(this.naturalPopOptions, 'content', naturalContent)

            if (this.knitModeType === 1) {
              scope.row.type = '1'
              this.$set(this.naturalPopOptions.content[this.naturalPopOptions.content.length - 1].columns[0].editOptions, 'itemType', 'select')
            } else if (this.knitModeType === 0) {
              scope.row.type = '0'
              this.$set(this.naturalPopOptions.content[this.naturalPopOptions.content.length - 1].columns[0].editOptions, 'itemType', 'input')
              this.$set(this.naturalPopOptions.content[this.naturalPopOptions.content.length - 1].columns[0].editOptions, 'maxlength', 20)
            }
            this.naturalIndex = scope.$index
            if (Number.isInteger(formDatas.index)) {
              this.$set(this.naturalPopOptions.formDatas, 'naturalIndex', formDatas.index)
              this.$set(this.naturalPopOptions.content[9], 'label', '组合占比')
            } else {
              this.$set(this.naturalPopOptions.formDatas, 'naturalIndex', null)
              this.$set(this.naturalPopOptions.content[9], 'label', '纱比')
            }

            this.$set(this.naturalPopOptions, 'formDatas', { ...scope.row, ...obj })
          })
        }
      },
      {
        label: '删除',
        isShow: true,
        style: { 'color': '#FE4949' },
        handle: (scope, form, formDatas, setFormDatas) => {
          this.$confirm('此操作将删除该条天然纤维, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (Number.isInteger(formDatas.index)) {
              this.composeYarns[formDatas.index].naturalFiberUpdateReqtList.splice(scope.$index, 1)
            } else {
              this.naturalData.splice(scope.$index, 1)
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        }
      }
    ]
    const naturalOperates = {
      label: '操作',
      width: '120',
      fixed: 'right',
      dataSource: naturalOperatesData
    }
    const popTableColumns = [
      {
        prop: 'description',
        label: '描述',
        // sortable: true,
        // width: '200',
        editOptions: {
          labelWidth: '0',
          itemType: 'select',
          dataSource: [],
          visibleChange: (flag) => {
            // this.getSelectDataFun(getMianClass, 'fabricCategoryInfo')
            flag && getMiaoshu({ enabled: 'Y', categoryId: 21 }).then(res => {
              const dataList = res.data
              this.$set(this.popTableColumns[0].editOptions, 'dataSource', dataList.map(item => {
                return {
                  value: item.name,
                  label: item.name
                }
              }))
            })
          }
        }
      },
      {
        prop: 'yarnLength',
        label: '成品纱长(cm)',
        className: 'ruleTip',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          rules: [
            {
              required: true,
              message: '成品纱长不能为空',
              trigger: ['bulr']
            },
            { validator: checkVal, trigger: 'blur' }
          ]
        }
      },
      {
        prop: 'machineYarnLength',
        label: '上机纱长(cm)',
        className: 'ruleTip',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          rules: [
            {
              required: true,
              message: '上机纱长不能为空',
              trigger: ['bulr']
            },
            { validator: checkVal, trigger: 'blur' }
          ]
        }
      }
    ]
    const specialPopTableColumns = [
      {
        prop: 'description',
        label: '描述',
        // sortable: true,
        // width: '200',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          maxlength: 20,
          rules: [
            {
              required: true,
              message: '描述不能为空',
              trigger: ['bulr']
            }
          ]
        }
      },
      {
        prop: 'yarnLength',
        label: '成品纱长(cm)',
        className: 'ruleTip',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          rules: [
            {
              required: true,
              message: '成品纱长不能为空',
              trigger: ['bulr']
            },
            { validator: checkVal, trigger: 'blur' }
          ]
        }
      },
      {
        prop: 'machineYarnLength',
        label: '上机纱长(cm)',
        className: 'ruleTip',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          rules: [
            {
              required: true,
              message: '上机纱长不能为空',
              trigger: ['bulr']
            },
            { validator: checkVal, trigger: 'blur' }
          ]
        }
      }
    ]
    const naturalPopOperates = [
      {
        label: '增加',
        isShow: true,
        handle: (params, form, formDatas, setformdatas) => {
          const popTableParams = {
            description: '',
            yarnLength: '',
            machineYarnLength: '',
            edit: true
          }
          const data = [...formDatas['tableForm']]
          data.splice(params.$index + 1, 0, popTableParams)
          if (this.naturalPopOptions.visible) {
            this.$set(this.naturalPopOptions.content[14], 'dataSource', data)
          } else if (this.chemicalPopOptions.visible) {
            this.$set(this.chemicalPopOptions.content[13], 'dataSource', data)
          }
        }
      },
      {
        label: '删除',
        isShow: true,
        style: { 'color': '#FE4949' },
        handle: (params, form, formDatas, setformdatas) => {
          if (formDatas.tableForm.length < 2) {
            this.$message({
              message: '至少保留一行数据',
              type: 'error'
            })
            return
          }
          this.$confirm('确认删除该条成品/上机数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
            customClass: 'customClass'
          })
            .then(() => {
              const data = [...formDatas['tableForm']]
              data.splice(params.$index, 1)
              if (this.naturalPopOptions.visible) {
                this.$set(this.naturalPopOptions.content[14], 'dataSource', data)
              } else if (this.chemicalPopOptions.visible) {
                this.$set(this.chemicalPopOptions.content[13], 'dataSource', data)
              }
            })
            .catch(() => {
              this.$message({ type: 'info', message: '已取消删除' })
            })
        }
      }
    ]
    const popTableData = [
      {
        description: '',
        yarnLength: '',
        machineYarnLength: '',
        edit: true
      }
    ]
    const naturalContent = [
      {
        prop: 'yarnInfo',
        itemType: 'select',
        label: '纱支',
        valueType: 'object',
        clearable: true,
        filterable: true,
        className: 'commonRemoteSearch',
        rules: [commonChangeReg],
        select: [getSelectData, { enabled: 'Y', categoryId: 9 }],
        dataSource: []
      },
      {
        prop: 'num',
        itemType: 'select',
        label: '条数',
        clearable: true,
        rules: [commonChangeReg],
        dataSource: [
          {
            label: 1,
            value: 1
          },
          {
            label: 2,
            value: 2
          },
          {
            label: 3,
            value: 3
          },
          {
            label: 4,
            value: 4
          },
          {
            label: 5,
            value: 5
          }
        ]
      },
      {
        prop: 'elementInfo',
        itemType: 'select',
        label: '成份',
        valueType: 'object',
        clearable: true,
        filterable: true,
        className: 'commonRemoteSearch',
        rules: [commonChangeReg],
        select: [this.getIngredients, { enabled: 'Y' }],
        change: (value, form, formDatas, setFormDatas) => {
          if (formDatas.elementInfo.names.split('/').length > 1) {
            setFormDatas({ elementRatio: '' })
          } else {
            setFormDatas({ elementRatio: '100' })
          }
        },
        dataSource: []
      },
      {
        prop: 'elementRatio',
        itemType: 'input',
        label: '比例',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg],
        components: {
          popProportion
        },
        dataSource: []
      },
      {
        prop: 'methodInfo',
        itemType: 'select',
        label: '梳棉方法',
        valueType: 'object',
        clearable: true,
        rules: [commonChangeReg],
        select: [getSelectData, { enabled: 'Y', categoryId: 3 }],
        dataSource: []
      },
      {
        prop: 'spinningMethodInfo',
        itemType: 'select',
        label: '纺纱方法',
        valueType: 'object',
        clearable: true,
        rules: [commonChangeReg],
        select: [getSelectData, { enabled: 'Y', categoryId: 2 }],
        dataSource: []
      },
      {
        prop: 'twistDirectionInfo',
        itemType: 'select',
        label: '捻向',
        valueType: 'object',
        clearable: true,
        rules: [commonChangeReg],
        select: [getSelectData, { enabled: 'Y', categoryId: 10 }],
        dataSource: []
      },
      {
        prop: 'yarnCategoryInfo',
        itemType: 'select',
        label: '纱类',
        valueType: 'object',
        clearable: true,
        select: [getSelectData, { enabled: 'Y', categoryId: 1 }],
        dataSource: []
      },
      {
        prop: 'yarnLevel',
        itemType: 'select',
        label: '纱线等级',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg],
        dataSource: [
          {
            label: 'A',
            value: 'A'
          },
          {
            label: 'B',
            value: 'B'
          },
          {
            label: 'C',
            value: 'C'
          },
          {
            label: 'D',
            value: 'D'
          },
          {
            label: 'E',
            value: 'E'
          }
        ]
      },
      {
        prop: 'yarnRato',
        itemType: 'input',
        label: '纱比',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg, { validator: checkValues, trigger: 'blur' }],
        dataSource: []
      },
      {
        itemType: 'view',
        text: '成品/上机纱长',
        style: style1
      },
      {
        prop: 'type',
        itemType: 'radio-group',
        label: '电脑提花',
        className: 'radioGroup',
        disabled: true,
        rules: [commonChangeReg],
        dataSource: [
          {
            label: '是',
            value: '1'
          },
          {
            label: '否',
            value: '0'
          }
        ]
      }
    ]
    const generalContent = [
      {
        prop: 'number',
        itemType: 'input',
        itemStyle: { width: '50%', display: 'inline-block', 'margin-bottom': '18px', 'margin-left': '-28px' },
        rules: [commonBlurReg, { validator: checkValNum, trigger: 'blur' }],
        label: '数量',
        clearable: true
      },
      {
        prop: 'unit',
        itemType: 'select',
        itemStyle: { width: '30%', display: 'inline-block', 'margin-bottom': '18px' },
        labelWidth: '10px',
        label: ' ',
        change: (value) => {
          // this.unitChange(value)
        },
        dataSource: [
          {
            label: 'G',
            value: 'G'
          },
          {
            label: 'R',
            value: 'R'
          }
        ]
      },
      {
        prop: 'tableForm',
        itemType: 'table-form',
        // label: '表格表单',
        className: 'popTableForm',
        props: { edit: 'edit' },
        border: true,
        dataSource: popTableData,
        columns: popTableColumns,
        operates: {
          label: '操作',
          dataSource: naturalPopOperates
        }
      }
    ]
    const specialContent = [
      {
        prop: 'number',
        itemType: 'input',
        itemStyle: { width: '50%', display: 'inline-block', 'margin-bottom': '18px', 'margin-left': '-28px' },
        rules: [commonBlurReg, { validator: checkValNum, trigger: 'blur' }],
        label: '数量',
        className: 'numberLabel',
        clearable: true
      },
      {
        prop: 'unit',
        itemType: 'select',
        itemStyle: { width: '30%', display: 'inline-block', 'margin-bottom': '18px' },
        labelWidth: '10px',
        label: ' ',
        change: (value) => {
          // this.unitChange(value)
        },
        dataSource: [
          {
            label: 'G',
            value: 'G'
          },
          {
            label: 'R',
            value: 'R'
          }
        ]
      },
      {
        prop: 'tableForm',
        itemType: 'table-form',
        // label: '表格表单',
        className: 'popTableForm',
        props: { edit: 'edit' },
        border: true,
        dataSource: popTableData,
        columns: specialPopTableColumns,
        operates: {
          label: '操作',
          dataSource: naturalPopOperates
        }
      }
    ]
    const naturalPopOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增天然纤维',
      okText: '保存',
      ok: params => {
        const naturalIndex = this.naturalPopOptions.formDatas.naturalIndex
        const yarnLength = this.setMachineYarn('submit', { ...params })

        if (Number.isInteger(naturalIndex)) {
          if (this.naturalIndex > -1) {
            this.$set(this.composeYarns[naturalIndex].naturalFiberUpdateReqtList, this.naturalIndex, { ...params, yarnLength })
          } else {
            if (this.composeYarns[naturalIndex].naturalFiberUpdateReqtList) {
              this.composeYarns[naturalIndex].naturalFiberUpdateReqtList.push({ ...params, yarnLength })
            } else {
              this.$set(this.composeYarns[naturalIndex], 'naturalFiberUpdateReqtList', [{ ...params, yarnLength }])
            }
          }
        } else {
          if (this.naturalIndex > -1) {
            this.$set(this.naturalData, this.naturalIndex, { ...params, yarnLength })
          } else {
            this.naturalData.push({ ...params, yarnLength })
          }
        }
        this.naturalIndex = -1
        this.naturalPopHandle()
      },
      cancel: params => {
        this.naturalPopHandle()
      },
      formDatas: {},
      formOptions: {},
      content: naturalContent
    }
    const chemicalBaseColumns = [
      {
        prop: 'finenessInfo',
        label: '细度',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      },
      {
        prop: 'elementInfo',
        label: '成份',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      },
      {
        prop: 'brandInfo',
        label: '品名',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      },
      {
        prop: 'wireCategoryInfo',
        label: '丝类',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      },
      {
        prop: 'gridDegreeInfo',
        label: '网络度',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      },
      {
        prop: 'lightDegreeInfo',
        label: '光泽度',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      },
      {
        prop: 'composeWay',
        label: '条数',
        showOverflowTooltip: true
      },
      {
        prop: 'yarnLevel',
        label: '纱线等级',
        showOverflowTooltip: true
      },
      {
        prop: 'machineYarn',
        label: '成品/上机纱长',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => this.getMachineYarn(scope.row)
      }
    ]
    const chemicalColumns = [
      ...chemicalBaseColumns,
      {
        prop: 'yarnRato',
        label: '纱比',
        showOverflowTooltip: true
      }
    ]
    const composeChemicalColumns = [
      ...chemicalBaseColumns,
      {
        prop: 'yarnRato',
        label: '组合占比',
        showOverflowTooltip: true
      }
    ]
    const chemicalOperatesData = [
      {
        label: '编辑',
        isShow: true,
        handle: (scope, form, formDatas, setFormDatas) => {
          this.chemicalPopHandle('编辑化学纤维')
          this.getChemicalSelect(scope.row)

          if (scope.row.elementInfo && scope.row.elementInfo.label === '氨纶') {
            this.$set(this.chemicalContent[2], 'rules', [])
          } else {
            this.$set(this.chemicalContent[2], 'rules', [commonBlurReg])
          }
          this.$nextTick(() => {
            // const chemicalContent = scope.row.type === '1' ? [...this.specialContent] : [...this.generalContent]
            // this.$set(this.chemicalPopOptions, 'content', [...this.chemicalContent, ...chemicalContent])
            const chemicalContent = [...this.chemicalContent, ...this.generalContent]
            this.$set(this.chemicalPopOptions, 'content', chemicalContent)
            if (this.knitModeType === 1) {
              scope.row.type = '1'
              this.$set(this.chemicalPopOptions.content[this.chemicalPopOptions.content.length - 1].columns[0].editOptions, 'itemType', 'select')
            } else {
              scope.row.type = '0'
              this.$set(this.chemicalPopOptions.content[this.chemicalPopOptions.content.length - 1].columns[0].editOptions, 'itemType', 'input')
              this.$set(this.chemicalPopOptions.content[this.chemicalPopOptions.content.length - 1].columns[0].editOptions, 'maxlength', 20)
            }

            this.chemicalIndex = scope.$index

            const obj = this.setMachineYarn('edit', scope.row)
            this.$set(this.chemicalPopOptions, 'formDatas', { ...scope.row, ...obj })

            if (Number.isInteger(formDatas.index)) {
              this.$set(this.chemicalPopOptions.formDatas, 'chemicalIndex', formDatas.index)
              this.$set(this.chemicalPopOptions.content[8], 'label', '组合占比')
            } else {
              this.$set(this.chemicalPopOptions.formDatas, 'chemicalIndex', null)
              this.$set(this.chemicalPopOptions.content[8], 'label', '纱比')
            }
          })
        }
      },
      {
        label: '删除',
        isShow: true,
        style: { 'color': '#FE4949' },
        handle: (scope, form, formDatas, setformdatas) => {
          // this.chemicalData.splice(scope.$index, 1)
          this.$confirm('此操作将删除该条化学纤维, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (Number.isInteger(formDatas.index)) {
              this.composeYarns[formDatas.index].chemicalFiberUpdateReqtList.splice(scope.$index, 1)
            } else {
              this.chemicalData.splice(scope.$index, 1)
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        }
      }
    ]
    const chemicalOperates = {
      label: '操作',
      width: '120',
      fixed: 'right',
      dataSource: chemicalOperatesData
    }
    const chemicalContent = [
      {
        prop: 'finenessInfo',
        itemType: 'select',
        label: '细度',
        valueType: 'object',
        clearable: true,
        filterable: true,
        className: 'commonRemoteSearch',
        maxlength: 20,
        rules: [commonBlurReg],
        dataSource: [],
        select: [getSelectData, { enabled: 'Y', categoryId: 12 }]
      },
      {
        prop: 'elementInfo',
        itemType: 'select',
        valueType: 'object',
        label: '成份',
        clearable: true,
        filterable: true,
        className: 'commonRemoteSearch',
        maxlength: 20,
        rules: [commonBlurReg],
        dataSource: [],
        select: [this.getIngredients, { enabled: 'Y' }],
        change: (value, form, formDatas, setFormDatas) => {
          if (value && value.label === '氨纶') {
            this.$set(this.chemicalContent[2], 'rules', [])
          } else {
            this.$set(this.chemicalContent[2], 'rules', [commonBlurReg])
          }
        }
      },
      {
        prop: 'brandInfo',
        itemType: 'select',
        valueType: 'object',
        label: '品名',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg],
        dataSource: [],
        select: [getSelectData, { enabled: 'Y', categoryId: 4 }]
      },
      {
        prop: 'wireCategoryInfo',
        itemType: 'select',
        valueType: 'object',
        label: '丝类',
        clearable: true,
        maxlength: 20,
        // rules: [commonBlurReg],
        dataSource: [],
        select: [getSelectData, { enabled: 'Y', categoryId: 13 }]
      },
      {
        prop: 'gridDegreeInfo',
        itemType: 'select',
        valueType: 'object',
        label: '网络度',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg],
        dataSource: [],
        select: [getSelectData, { enabled: 'Y', categoryId: 15 }]
      },
      {
        prop: 'lightDegreeInfo',
        itemType: 'select',
        valueType: 'object',
        label: '光泽度',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg],
        dataSource: [],
        select: [getSelectData, { enabled: 'Y', categoryId: 5 }]
      },
      {
        prop: 'composeWay',
        itemType: 'select',
        label: '条数',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg],
        dataSource: [
          {
            label: 1,
            value: '1'
          },
          {
            label: 2,
            value: '2'
          },
          {
            label: 3,
            value: '3'
          },
          {
            label: 4,
            value: '4'
          },
          {
            label: 5,
            value: '5'
          }
        ]
      },
      {
        prop: 'yarnLevel',
        itemType: 'select',
        label: '纱线等级',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg],
        dataSource: [
          {
            label: 'A',
            value: 'A'
          },
          {
            label: 'AA',
            value: 'AA'
          },
          {
            label: 'AAA',
            value: 'AAA'
          }
        ]
      },
      {
        prop: 'yarnRato',
        itemType: 'input',
        label: '纱比',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg, { validator: checkValues, trigger: 'blur' }],
        dataSource: []
      },
      {
        itemType: 'view',
        text: '成品/上机纱长',
        style: style1
      },
      {
        prop: 'type',
        itemType: 'radio-group',
        label: '电脑提花',
        className: 'radioGroup',
        disabled: true,
        dataSource: [
          {
            label: '是',
            value: '1'
          },
          {
            label: '否',
            value: '0'
          }
        ]
      }
    ]
    const chemicalPopOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增化学纤维',
      okText: '保存',
      ok: params => {
        const chemicalIndex = this.chemicalPopOptions.formDatas.chemicalIndex
        const yarnLength = this.setMachineYarn('submit', { ...params })

        if (Number.isInteger(chemicalIndex)) {
          if (this.chemicalIndex > -1) {
            this.$set(this.composeYarns[chemicalIndex].chemicalFiberUpdateReqtList, this.chemicalIndex, { ...params, yarnLength })
          } else {
            if (this.composeYarns[chemicalIndex].chemicalFiberUpdateReqtList) {
              this.composeYarns[chemicalIndex].chemicalFiberUpdateReqtList.push({ ...params, yarnLength })
            } else {
              this.$set(this.composeYarns[chemicalIndex], 'chemicalFiberUpdateReqtList', [{ ...params, yarnLength }])
            }
          }
        } else {
          if (this.chemicalIndex > -1) {
            this.$set(this.chemicalData, this.chemicalIndex, { ...params, yarnLength })
          } else {
            this.chemicalData.push({ ...params, yarnLength })
          }
        }
        this.chemicalIndex = -1
        this.chemicalPopHandle()
      },
      cancel: params => {
        this.chemicalPopHandle()
      },
      formDatas: {},
      formOptions: {},
      content: chemicalContent
    }
    const mainData = [
      {
        itemType: 'select',
        prop: 'mainInfo',
        label: '主纱支/细度',
        placeholder: '',
        disabled: true,
        readonly: true,
        valueType: 'object',
        rules: [{ required: true, message: '请选择主纱支/细度', trigger: 'change' }],
        itemStyle: {
          'margin': '20px 30px 0 0',
          'height': '36px'
        },
        dataSource: [],
        change: val => {
          // this.$set(this.ylFormDatas, 'materialRequirement', val)
        }
      },
      {
        prop: 'elementInfo',
        itemType: 'select',
        label: '面料成份/比例',
        valueType: 'object',
        disabled: true,
        readonly: true,
        filterable: true,
        clearable: true,
        remote: true,
        // remoteMethod: searchIngredient,
        className: 'commonRemoteSearch',
        rules: [commonChangeReg],
        itemStyle: {
          margin: '20px 30px 0',
          'height': '36px'
        },
        placeholder: '',
        dataSource: [],
        change: (value, form, formDatas, setFormDatas) => {
          if (formDatas.elementInfo.names.split('/').length > 1) {
            setFormDatas({ elementRatio: '' })
          } else {
            setFormDatas({ elementRatio: '100' })
          }
        },
        visibleChange: (flag) => {
          // this.getSelectDataFun(getMianClass, 'fabricCategoryInfo')
          flag && this.getIngredient().then(res => {
            this.$set(this.mainData[1], 'dataSource', res)
          })
        }
      },
      {
        components: {
          proCustom
        }
      }
    ]
    const combinationData = [
      {
        prop: 'yarnTypeInfo',
        itemType: 'select',
        itemStyle: { width: '18%', marginRight: 0, marginLeft: '20px', marginBottom: 0, cursor: 'pointer' },
        style: { width: '80%' },
        label: '纱线类型',
        clearable: true,
        disabled: true,
        rules: [commonChangeReg],
        readonly: true,
        valueType: 'object',
        change: (value, form, formDatas, setFormDatas) => {
          this.composeYarns[formDatas.index].yarnTypeInfo = formDatas.yarnTypeInfo
        },
        dataSource: [
          {
            label: '合捻纱',
            value: '合捻纱'
          },
          {
            label: '包覆纱',
            value: '包覆纱'
          }
        ]
      },
      {
        prop: 'composeWayInfo',
        itemType: 'select',
        itemStyle: { width: '18%', marginRight: 0, marginLeft: '20px', marginBottom: 0, cursor: 'pointer' },
        style: { width: '80%' },
        label: '组合方式',
        clearable: true,
        valueType: 'object',
        change: (value, form, formDatas, setFormDatas) => {
          this.composeYarns[formDatas.index].composeWayInfo = formDatas.composeWayInfo
        },
        disabled: true,
        rules: [commonChangeReg],
        readonly: true,
        dataSource: [],
        visibleChange: (flag) => {
          // this.getSelectDataFun(getMianClass, 'fabricCategoryInfo')
          flag && getSelectData({ enabled: 'Y', categoryId: 21 }).then(res => {
            const dataList = res.data
            this.$set(this.combinationData[1], 'dataSource', dataList.map(item => {
              return {
                label: item.name,
                value: item.uuid
              }
            }))
          })
        }
      },
      {
        prop: 'coatedWayInfo',
        itemType: 'select',
        itemStyle: { width: '18%', marginRight: 0, marginLeft: '20px', marginBottom: 0, cursor: 'pointer' },
        style: { width: '80%' },
        label: '包覆方式',
        clearable: true,
        change: (value, form, formDatas, setFormDatas) => {
          this.composeYarns[formDatas.index].coatedWayInfo = formDatas.coatedWayInfo
        },
        valueType: 'object',
        disabled: true,
        readonly: true,
        dataSource: [],
        visibleChange: (flag) => {
          flag && getSelectData({ enabled: 'Y', categoryId: 20 }).then(res => {
            const dataList = res.data
            this.$set(this.combinationData[2], 'dataSource', dataList.map(item => {
              return {
                label: item.name,
                value: item.uuid
              }
            }))
          })
        }
      },
      {
        prop: 'twistDirectionInfo',
        itemType: 'select',
        itemStyle: { width: '18%', marginRight: 0, marginLeft: '20px', marginBottom: 0, cursor: 'pointer' },
        style: { width: '80%' },
        label: '捻向',
        change: (value, form, formDatas, setFormDatas) => {
          this.composeYarns[formDatas.index].twistDirectionInfo = formDatas.twistDirectionInfo
        },
        clearable: true,
        valueType: 'object',
        disabled: true,
        readonly: true,
        dataSource: [],
        visibleChange: (flag) => {
          flag && getSelectData({ enabled: 'Y', categoryId: 17 }).then(res => {
            const dataList = res.data
            this.$set(this.combinationData[3], 'dataSource', dataList.map(item => {
              return {
                label: item.name,
                value: item.uuid
              }
            }))
          })
        }
      },
      {
        prop: 'yarnRato',
        itemType: 'input',
        itemStyle: { width: '18%', marginRight: 0, marginLeft: '20px', marginBottom: 0, cursor: 'pointer' },
        style: { width: '80%' },
        label: '纱比',
        change: (value, form, formDatas, setFormDatas) => {
          this.composeYarns[formDatas.index].yarnRato = formDatas.yarnRato
        },
        clearable: true,
        disabled: true,
        rules: [commonBlurReg],
        readonly: true,
        dataSource: []
      }
    ]
    return {
      formOtions: {
        inline: true
      },
      ylFormDatas: {
        checkboxs: [1, 2]
      },
      formDatas: {},
      ylData,
      headerCellStyle,
      popTableData,
      popTableColumns,
      specialPopTableColumns,
      naturalColumns,
      composeNaturalColumns,
      chemicalColumns,
      composeChemicalColumns,
      naturalOperates,
      naturalOperatesData,
      chemicalOperates,
      chemicalOperatesData,
      naturalContent,
      generalContent,
      specialContent,
      chemicalContent,
      naturalPopOptions,
      chemicalPopOptions,
      mainData,
      mainFormDatas: {},
      combinationData,
      combinationFormDatas: {},
      naturalIndex: -1,
      chemicalIndex: -1,
      dataType: '',
      composeYarns: null,
      naturalData: null,
      chemicalData: null
    }
  },
  computed: {
    mainDataCopy() {
      // const data = deepClone(this.mainData)
      const data = this.mainData
      const natural = this.naturalData.map(e => ({ ...e.yarnInfo, type: 0 }))
      const chemical = this.chemicalData.map(e => ({ ...e.finenessInfo, type: 1 }))
      const compose = []
      this.composeYarns.forEach(e => {
        const n = (e.naturalFiberUpdateReqtList || []).map(ele => ({ ...ele.yarnInfo, type: 0 }))
        const c = (e.chemicalFiberUpdateReqtList || []).map(ele => ({ ...ele.finenessInfo, type: 1 }))
        compose.push(...n, ...c)
      })
      const arr = [...natural, ...chemical, ...compose].reduce((all, next) => all.some((atom) => atom['value'] === next['value']) ? all : [...all, next], [])
      data[0].dataSource = arr
      const formDatas = this.$refs.mainYarnFineness && this.$refs.mainYarnFineness.dynamicValidateFormRuleForm
      if (formDatas && formDatas.mainInfo && (!arr.find(e => e.value === formDatas.mainInfo.value))) {
        this.$set(this.mainFormDatas, 'mainInfo', '')
      }
      return data
    }
  },
  watch: {
    isEdit(n, o) {
      this.setOption(n)
    },
    composeData: {
      handler(v) {
        if (v) {
          this.composeYarns = v
        } else {
          this.composeYarns = []
        }
      },
      deep: true,
      immediate: true
    },
    naturalDatas: {
      handler(v) {
        if (v) {
          this.naturalData = v
        } else {
          this.naturalData = []
        }
      },
      deep: true,
      immediate: true
    },
    chemicalDatas: {
      handler(v) {
        if (v) {
          this.chemicalData = v
        } else {
          this.chemicalData = []
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async getData() {
      this.setOption(this.isEdit)
      // 获取成品上机纱长描述下拉数据
      this.getMiaoshuFn()
    },
    // 设置操作项
    setOption(status) {
      const obj = JSON.parse(JSON.stringify(this.$refs.mainYarnFineness.dynamicValidateFormRuleForm))
      if (status === 'detail') {
        obj.ieEdit = false
        this.$set(this, 'mainFormDatas', obj)
        this.$set(this.$refs.mainYarnFineness, 'dynamicValidateFormRuleForm', obj)
        this.$set(this.ylData[1], 'disabled', true)
        this.naturalOperates = null
        this.chemicalOperates = null
        this.combinationData.forEach((e) => {
          e.readonly = true
          e.disabled = true
        })
        this.mainData.forEach((e) => {
          e.readonly = true
          e.disabled = true
        })
      } else if (status === 'edit') {
        obj.ieEdit = true
        this.$set(this, 'mainFormDatas', obj)
        this.$set(this.$refs.mainYarnFineness, 'dynamicValidateFormRuleForm', obj)
        this.$set(this.ylData[1], 'disabled', false)
        this.naturalOperates = {
          label: '操作',
          width: '120',
          fixed: 'right',
          dataSource: this.naturalOperatesData
        }
        this.chemicalOperates = {
          label: '操作',
          width: '120',
          fixed: 'right',
          dataSource: this.chemicalOperatesData
        }
        this.combinationData.forEach((e) => {
          e.readonly = false
          e.disabled = false
        })
        this.mainData.forEach((e) => {
          e.readonly = false
          e.disabled = false
        })
      }
    },
    // 点击编辑时处理数据
    setFormDatas(params, type) {
      setTimeout(() => {
        if (type === 'natural') {
          this.$set(this.naturalPopOptions, 'formDatas', params)
        } else if (type === 'chemical') {
          this.$set(this.chemicalPopOptions, 'formDatas', params)
        }
      }, 0)
    },
    // 天然纤维弹窗显隐
    naturalPopHandle(val) {
      this.$set(this.naturalPopOptions, 'visible', !this.naturalPopOptions.visible)
      if (val) {
        this.$set(this.naturalPopOptions, 'title', val)
      }
    },
    // 化学纤维弹窗显隐
    chemicalPopHandle(val) {
      this.$set(this.chemicalPopOptions, 'visible', !this.chemicalPopOptions.visible)
      if (val) {
        this.$set(this.chemicalPopOptions, 'title', val)
      }
    },
    // 点击新增天然纤维
    addNaturalClick(index) {
      this.naturalIndex = -1
      this.getNaturalSelect()
      const obj = this.setMachineYarn('add')
      obj.type = this.knitModeType + ''
      const naturalContent = [...this.naturalContent, ...deepClone(this.generalContent)]
      this.$set(this.naturalPopOptions, 'content', naturalContent)

      if (this.knitModeType === 1) {
        // scope.row.type = '0'
        this.$set(this.naturalPopOptions.content[this.naturalPopOptions.content.length - 1].columns[0].editOptions, 'itemType', 'select')
      } else if (this.knitModeType === 0) {
        // scope.row.type = '1'
        this.$set(this.naturalPopOptions.content[this.naturalPopOptions.content.length - 1].columns[0].editOptions, 'itemType', 'input')
        this.$set(this.naturalPopOptions.content[this.naturalPopOptions.content.length - 1].columns[0].editOptions, 'maxlength', 20)
      }
      this.$set(this.naturalPopOptions, 'formDatas', { ...obj })
      let count = this.naturalData.length || 0
      // 组合的天然走下面
      if (Number.isInteger(index)) {
        count = this.composeYarns[index].naturalFiberUpdateReqtList ? this.composeYarns[index].naturalFiberUpdateReqtList.length : 0
        this.$set(this.naturalPopOptions.formDatas, 'naturalIndex', index)
        this.$set(this.naturalPopOptions.content[9], 'label', '组合占比')
      } else {
        count = this.naturalData.length
        this.$set(this.naturalPopOptions.formDatas, 'naturalIndex', null)
        this.$set(this.naturalPopOptions.content[9], 'label', '纱比')
      }
      if (count >= 5) {
        this.$message.warning('天然纤维最多添加五条')
      } else {
        this.naturalPopHandle('新增天然纤维')
      }
    },
    // 点击新增化学纤维
    addChemicalClick(index) {
      this.chemicalIndex = -1
      this.getChemicalSelect()
      const obj = this.setMachineYarn('add')
      obj.type = this.knitModeType + ''
      this.$set(this.chemicalPopOptions, 'formDatas', { ...obj })
      const chemicalContent = [...this.chemicalContent, ...this.generalContent]
      this.$set(this.chemicalPopOptions, 'content', chemicalContent)
      if (this.knitModeType === 1) {
        this.$set(this.chemicalPopOptions.content[this.chemicalPopOptions.content.length - 1].columns[0].editOptions, 'itemType', 'select')
      } else if (this.knitModeType === 0) {
        this.$set(this.chemicalPopOptions.content[this.chemicalPopOptions.content.length - 1].columns[0].editOptions, 'itemType', 'input')
        this.$set(this.chemicalPopOptions.content[this.chemicalPopOptions.content.length - 1].columns[0].editOptions, 'maxlength', 20)
      }
      let count = this.chemicalData.length || 0
      // 组合的化学走下面
      if (Number.isInteger(index)) {
        count = this.composeYarns[index].chemicalFiberUpdateReqtList ? this.composeYarns[index].chemicalFiberUpdateReqtList.length : 0
        this.$set(this.chemicalPopOptions.formDatas, 'chemicalIndex', index)
        this.$set(this.chemicalPopOptions.content[8], 'label', '组合占比')
      } else {
        count = this.chemicalData.length
        this.$set(this.chemicalPopOptions.formDatas, 'chemicalIndex', null)
        this.$set(this.chemicalPopOptions.content[8], 'label', '纱比')
      }
      if (count >= 5) {
        this.$message.warning('化学纤维最多添加五条')
      } else {
        this.chemicalPopHandle('新增化学纤维')
      }
    },
    // 点击新增组合纱线
    addCombinationClick() {
      if (this.composeYarns.length >= 5) {
        this.$message.warning('组合纱线最多添加五条')
        return false
      }
      const combinationTempObj = { naturalFiberUpdateReqtList: [], chemicalFiberUpdateReqtList: [] }
      this.composeYarns.push(combinationTempObj)
    },
    // 点击删除组合纱线
    deleteCombinationClick(index) {
      this.$confirm('此操作将删除该条组合纱线, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.composeYarns.splice(index, 1)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 获取天然纤维下拉选数据
    getNaturalSelect(formDatas) {
      const arr = [...this.naturalPopOptions.content]
      arr.forEach(async ele => {
        if (ele.select && !ele.dataSource.length) {
          ele.dataSource = ((await ele.select[0](ele.select[1])).data || []).map(e => ({
            value: e.uuid ? e.uuid : String(e.id),
            label: e.name,
            names: e.names ? e.names : ''
          }))
        }
      })
      // 有禁用了的数据就push一条禁用数据
      if (formDatas) {
        Object.keys(formDatas).forEach(ele => {
          if (formDatas[ele] && Object.prototype.toString.call(formDatas[ele]) === '[object Object]') {
            const i = arr.findIndex(e => e.prop === ele)
            const has = arr[i].dataSource.find(e => formDatas[ele].value === e.value)
            if (!has) {
              arr[i].dataSource.push({
                value: formDatas[ele].value,
                label: formDatas[ele].label,
                names: formDatas[ele].names ? formDatas[ele].names : '',
                disabled: true
              })
            }
          }
        })
      }
      this.$set(this.naturalPopOptions, 'content', arr)
    },
    // 获取化学纤维下拉选数据
    getChemicalSelect(formDatas) {
      const arr = [...this.chemicalPopOptions.content]
      arr.forEach(async ele => {
        if (ele.select && !ele.dataSource.length) {
          ele.dataSource = ((await ele.select[0](ele.select[1])).data || []).map(e => ({
            value: e.uuid ? e.uuid : String(e.id),
            label: e.name
          }))
        }
      })
      // 有禁用了的数据就push一条禁用数据
      if (formDatas) {
        Object.keys(formDatas).forEach(ele => {
          if (formDatas[ele] && Object.prototype.toString.call(formDatas[ele]) === '[object Object]') {
            const i = arr.findIndex(e => e.prop === ele)
            const has = arr[i].dataSource.find(e => formDatas[ele].value === e.value)
            if (!has) {
              arr[i].dataSource.push({
                value: formDatas[ele].value,
                label: formDatas[ele].label,
                disabled: true
              })
            }
          }
        })
      }
      this.$set(this.chemicalPopOptions, 'content', arr)
    },
    // 获取面料成份/比例下拉
    async getIngredient(val) {
      const data1 = await getIngredient({ enabled: 'Y', name: val })
      const data2 = await getIngredientZh({ enabled: 'Y', name: val })
      const res = [...data1.data, ...data2.data].map(e => ({
        value: e.uuid,
        label: e.name,
        type: e.ids ? 1 : 0,
        names: e.ids ? e.names : e.name
      }))
      return res
      // this.$set(this.mainData[1], 'dataSource', res)
    },
    // 获取成份下拉
    async getIngredients(val) {
      const data1 = await getIngredient(val)
      const data2 = await getIngredientZh(val)
      const res = [...data1.data, ...data2.data].map(e => ({
        id: e.uuid,
        name: e.name,
        names: e.ids ? e.names : e.name
      }))
      return { ...data2, data: res }
    },
    // 获取描述下拉选数据
    async getMiaoshuFn() {
      if (!this.popTableColumns[0].editOptions.dataSource.length) {
        const res = (await getMiaoshu({ enabled: 'Y' })).data || []
        this.$set(this.popTableColumns[0].editOptions, 'dataSource', res.map(e => ({
          value: e.name,
          label: e.name
        })))
      }
    },
    // 成品/上机纱长处理
    getMachineYarn(row) {
      // if (row.type === '0') {
      //   const obj = JSON.parse(row.yarnLength)
      //   let str1 = ''
      //   let str2 = ''
      //   obj.tableForm && obj.tableForm.forEach(ele => {
      //     str1 += (ele.description && ele.description + ' ' || '') + obj.number + obj.unit + '=' + ele.yarnLength + 'CM/'
      //     str2 += (ele.description && ele.description + ' ' || '') + obj.number + obj.unit + '=' + ele.machineYarnLength + 'CM/'
      //   })
      //   return '成品:' + str1.slice(0, -1) + ',上机:' + str2.slice(0, -1)
      // }
      // return row.yarnLength || ''
      // debugger
      if (row.yarnLength.substr(0, 1) === '{') {
        const obj = JSON.parse(row.yarnLength)
        let str1 = ''
        let str2 = ''
        obj.tableForm && obj.tableForm.forEach(ele => {
          str1 += (ele.description && ele.description + ' ' || '') + obj.number + obj.unit + '=' + ele.yarnLength + 'CM/'
          str2 += (ele.description && ele.description + ' ' || '') + obj.number + obj.unit + '=' + ele.machineYarnLength + 'CM/'
        })
        return '成品:' + str1.slice(0, -1) + ',上机:' + str2.slice(0, -1)
      } else {
        return row.yarnLength
      }
    },
    setMachineYarn(type, row) {
      // type add新增 edit编辑 submit提交
      const obj = { type: '0', unit: 'G', number: '' }
      this.$set(this.generalContent[2], 'dataSource', [{ edit: true }])
      // this.$set(this.specialContent[2], 'dataSource', [{ edit: true }])
      if (type === 'add') {
        return obj
      } else if (type === 'edit') {
        if (row.type === '0' && row.yarnLength) {
          this.$set(this.generalContent[2], 'dataSource', JSON.parse(row.yarnLength).tableForm)
          return JSON.parse(row.yarnLength)
        }
        if (row.type === '1' && row.yarnLength) {
          this.$set(this.generalContent[2], 'dataSource', JSON.parse(row.yarnLength).tableForm)
          return JSON.parse(row.yarnLength)
        }
        // return row.type === '1' ? { machineYarn: row.yarnLength } : obj
      } else {
        // if (row.type === '0') {
        //   const val = {
        //     number: row.number,
        //     unit: row.unit,
        //     tableForm: row.tableForm
        //   }
        //   return JSON.stringify(val)
        // }
        // return row.machineYarn
        const val = {
          number: row.number,
          unit: row.unit,
          tableForm: row.tableForm
        }
        return JSON.stringify(val)
      }
    },

    async getCombinationSelectList() {
      // 获取组合方式
      const res1 = ((await getSelectData({ enabled: 'Y', categoryId: 21 })).data || []).map(item => ({ label: item.name, value: item.uuid }))
      // this.$set(this.combinationData[1], 'dataSource', res1.data.map(item => {
      //   return {
      //     label: item.name,
      //     value: item.uuid
      //   }
      // }))
      // 获取包覆方式
      const res2 = ((await getSelectData({ enabled: 'Y', categoryId: 20 })).data || []).map(item => ({ label: item.name, value: item.uuid }))
      // this.$set(this.combinationData[2], 'dataSource', res2.data.map(item => {
      //   return {
      //     label: item.name,
      //     value: item.uuid
      //   }
      // }))
      // 获取
      const res3 = ((await getSelectData({ enabled: 'Y', categoryId: 17 })).data || []).map(item => ({ label: item.name, value: item.uuid }))
      // this.$set(this.combinationData[3], 'dataSource', res3.data.map(item => ({
      //   label: item.name,
      //   value: item.uuid
      // })))
      this.$set(this.combinationData[1], 'dataSource', res1)
      this.$set(this.combinationData[2], 'dataSource', res2)
      this.$set(this.combinationData[3], 'dataSource', res3)
      return [res1, res2, res3]
    },
    // 校验组合纱线必填性及相加等于100之类的
    checkComposeContent() {
      let result = ''
      let composeNum = 0
      this.composeYarns.forEach((item, index) => {
        // 判断一组第一行表单必填项
        if (!(item.yarnTypeInfo && item.composeWayInfo && item.yarnRato)) {
          result += `第${index + 1}个组合纱线里纱线类型/组合方式/纱比未填写, `
        }

        // 判断一组里面天然和化学纤维相加最少等于2
        const naturalCount = item.naturalFiberUpdateReqtList ? item.naturalFiberUpdateReqtList.length : 0
        const chemicalCount = item.chemicalFiberUpdateReqtList ? item.chemicalFiberUpdateReqtList.length : 0
        if ((naturalCount + chemicalCount) < 2) {
          result += `第${index + 1}个组合纱线里天然纤维加化学纤维最少2条, `
        }

        // 判断一组里面天然和化学纤维组合占比相加等于100
        const naturalArrNum = (item.naturalFiberUpdateReqtList && item.naturalFiberUpdateReqtList.length !== 0) ? item.naturalFiberUpdateReqtList.map(item => isNaN(item.yarnRato) ? 0 : item.yarnRato * 1).reduce((total, item) => total + item) : 0
        const chemicalArrNum = (item.chemicalFiberUpdateReqtList && item.chemicalFiberUpdateReqtList.length !== 0) ? item.chemicalFiberUpdateReqtList.map(item => isNaN(item.yarnRato) ? 0 : item.yarnRato * 1).reduce((total, item) => total + item) : 0
        if (this.$utils.getFloat(naturalArrNum + chemicalArrNum) !== 100) {
          result += `第${index + 1}个组合纱线里天然纤维和化学纤维里面的组合占比相加不等于100, `
        }

        composeNum += (isNaN(item.yarnRato) ? 0 : item.yarnRato * 1)
      })

      // 判断纱比跟天然纤维和化学纤维相加等于100
      const naturalNum = (this.naturalData && this.naturalData.length !== 0) ? this.naturalData.map(item => isNaN(item.yarnRato) ? 0 : item.yarnRato * 1).reduce((total, item) => total + item) : 0
      const chemicalNum = (this.chemicalData && this.chemicalData.length !== 0) ? this.chemicalData.map(item => isNaN(item.yarnRato) ? 0 : item.yarnRato * 1).reduce((total, item) => total + item) : 0

      if (this.$utils.getFloat(composeNum + naturalNum + chemicalNum) !== 100) {
        result += '天然纤维,化学纤维和组合纤维的纱比相加不等于100.'
      }

      return result
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/ .require [disabled='disabled'] {
    color: red !important;
  }
</style>
<style lang="less">
.require {
  background: #ffffff;
  margin: 0 20px;
  .require-checkbox .el-checkbox__label {
    line-height: 36px!important;
    overflow: initial!important;
  }
  .table tr:nth-child(even) {
    background: #FFFFFF;
  }
  .table-item {
    background: #ffffff;
    .header-top {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 20px 20px 15px 20px;
      span {
        font-size: 16px;
        display: flex;
        font-weight: normal;
      }
      .el-button {
        display: flex;
        span {
          font-size: 14px;
        }
      }
    }
    .page-table {
      padding: 0 20px;
    }
    .detail-box .el-input__inner {
      padding: 0;
      border: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      background: #fff;
    }
    .detail-box .el-input__icon {
      display: none;
    }
    .detail-box .el-form-item__content > .el-input [readonly="readonly"] {
      padding: 0;
      border: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      background: #ffffff;
    }
    .edit-box .el-input__inner {
      max-width: 200px;
    }
  }
  .page-table tbody .el-table__row td {
    border-bottom: 1px solid #dfe6ec;
  }
  .el-table th.is-leaf {
    border-bottom: 0;
  }
  .popTableForm {
    .el-table--medium td {
      padding: 10px 0 0;
    }
    .el-table__body-wrapper .cell {
      padding-bottom: 16px;
    }
    .el-table__header .ruleTip .cell::before {
      display: block;
      content: '*';
      position: absolute;
      left: 4px;
      color: #FE4949;
    }
  }
  .popTableForm th.is-leaf {
    border-bottom: 1px solid #dfe6ec!important;
  }
  .mainYarn {
    padding: 0 40px;
    .custom-form {
      border-bottom: 1px solid #dfe6ec;
    }
    .el-form-item__label-wrap {
      margin-left: 0px!important;
    }
    .detail-box .el-input__inner {
      padding: 0;
      border: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      background: #fff;
    }
    .detail-box .el-input__icon {
      display: none;
    }
    .detail-box .el-form-item__content > .el-input [readonly="readonly"] {
      padding: 0;
      border: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      background: #ffffff;
    }
    .edit-box .el-input__inner {
      max-width: 200px;
    }
    // .el-input__suffix {
    //   display: none;
    // }
    // .el-input__inner {
    //   background-color: transparent;
    //   border: none;
    //   text-overflow: ellipsis;
    //   color: #777;
    // }
    // .el-input-group__append {
    //   background-color: transparent;
    //   border: none;
    //   color: #777;
    // }
  }
}
</style>
