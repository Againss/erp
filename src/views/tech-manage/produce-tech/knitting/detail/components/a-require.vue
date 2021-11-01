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
    <div v-if="naturalData&&naturalData.length>0" class="table-item">
      <div class="header-top">
        <span>天然纤维（短纤）</span>
        <!-- <el-button v-if="isEdit === 'edit'" type="primary" size="mini" @click="addNaturalClick">新增</el-button> -->
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
    <div v-if="chemicalData&&chemicalData.length>0" class="table-item">
      <div class="header-top">
        <span>化学纤维（长丝）</span>
        <!-- <el-button v-if="isEdit === 'edit'" type="primary" size="mini" @click="addChemicalClick">新增</el-button> -->
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
    <div class="table-item">
      <!-- composeYarns -->
      <div v-for="(item, index) in composeYarns" :key="index">
        <div class="header-top combination-top">
          <span>组合纱线</span>
          <!-- <el-button v-if="isEdit === 'edit' && index === 0" type="primary" size="mini" @click="addCombinationClick">新增</el-button> -->
          <!-- <el-button v-if="isEdit === 'edit' && index !== 0" type="danger" plain size="mini" @click="deleteCombinationClick(index)">删除</el-button> -->
        </div>
        <div :class="isEdit === 'detail' ? 'detail-box' : 'edit-box'" class="compose-yarns-item">
          <cs-custom-form
            :data-source="combinationData"
            :options="formOtions"
            :form-datas="{...item, index}"
          />
        </div>
        <template v-if="item.naturalFiberUpdateReqtList&&item.naturalFiberUpdateReqtList.length>0">
          <div class="header-top">
            <span>天然纤维（短纤）</span>
            <!-- <el-button v-if="isEdit === 'edit'" type="primary" size="mini" @click="addNaturalClick(index)">新增</el-button> -->
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
        </template>
        <template v-if="item.chemicalFiberUpdateReqtList&&item.chemicalFiberUpdateReqtList.length>0">
          <div class="header-top">
            <span>化学纤维（长丝）</span>
            <!-- <el-button v-if="isEdit === 'edit'" type="primary" size="mini" @click="addChemicalClick(index)">新增</el-button> -->
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
        </template>
      </div>
    </div>
    <!-- 主纱支、细度 -->
    <div class="mainYarn">
      <div :class="isEdit === 'detail' ? 'detail-box' : 'edit-box'" class="compose-yarns-item">
        <cs-custom-form
          ref="mainYarnFineness"
          :data-source="mainDataCopy"
          :options="formOtions"
          :form-datas="mainFormDatas"
        />
      </div>
    </div>
    <!-- 染纱/间条pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="dyeingSliverPopOptions" />
    </div>

    <!-- -->
    <div class="">
      <cs-custom-pop :options="popMachineYarnLength" />
    </div>
  </div>
</template>

<script>
import { getSelectData, getMiaoshu, getIngredient, getIngredientZh, colorColorManagePage } from '../api/index.js'
// import proCustom from './common/pro-ratio'
// import popProportion from './common/pop-proportion'
import { deepClone } from '@/utils/index.js'
import { dyeingSliver } from '../mixins/dyeingSliver.js'
export default {
  name: 'ARequire',
  mixins: [dyeingSliver],
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
    designDatas: {
      type: Array
    },
    rawMaterialDatas: {
      type: Array
    },
    stripeSpacingDatas: {
      type: Array
    },
    knitModeType: {
      type: [Array, Number],
      default: 0
    }
  },
  data() {
    const commonChangeReg = this.$getRules({ trigger: ['blur', 'change'] })
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
      // 'fontWeight': '600',
      'color': '#151222',
      'border-bottom': '1px #EEEFF0 solid',
      'margin': '0 20px 15px',
      'padding': '20px 0 15px'
    }
    const style3 = {
      'display': 'inline-block',
      'width': '96px',
      'fontSize': '14px',
      'marginTop': '25px',
      'textAlign': 'right',
      'padding-right': '10px',
      'color': '#888E9E'
    }
    const ylData = [
      {
        itemType: 'view',
        text: '原料要求',
        style: { ...style2, 'margin-bottom': '0' }
      }
    ]
    const naturalBaseColumns = [
      {
        prop: 'colorYarnCode',
        label: '纱线编码',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => scope.row.colorYarnCode || scope.row.colorYarnCode || scope.row.yarnCode || ''

      },
      {
        prop: 'yarnInfo',
        label: '纱支',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      },
      {
        prop: 'elementInfo',
        label: '成份/比例',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label + '/' + scope.row.elementRatio || ''
        // formater: scope => {
        //   let str=''
        //   if(scope.row.elementInfo&&scope.row.elementInfo.label){
        //     str=scope.row.elementInfo.label
        //     scope.row[scope.column.property] && scope.row[scope.column.property].label + '/' + scope.row.elementRatio || ''
        //   }
        // }
      },
      // {
      //   prop: 'elementRatio',
      //   label: '比例',
      //   showOverflowTooltip: true
      // },
      {
        prop: 'methodInfo',
        label: '梳棉方法',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      },
      {
        prop: 'spinningMethodsInfo',
        label: '纺纱方法',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      },
      {
        prop: 'yarnCategoryInfo',
        label: '纱类',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      },
      {
        prop: 'twistDirectionInfo',
        label: '捻向',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      },
      {
        prop: 'dyeingAdaptability',
        label: '染色适应性',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      }

    ]
    // 天然纤维
    const naturalColumns = [
      ...naturalBaseColumns,
      {
        prop: 'machineYarnLength',
        label: '上机纱长',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => this.getMachineYarn(scope.row)
      },
      {
        prop: 'yarnRatio',
        label: '纱比',
        minWidth: '100',
        showOverflowTooltip: true
      }
    ]
    // 组合天然纤维
    const composeNaturalColumns = [
      ...naturalBaseColumns,
      {
        prop: 'yarnRatio',
        label: '组合占比',
        minWidth: '100',
        showOverflowTooltip: true
      }
    ]
    const naturalOperatesData = [
      {
        label: '编辑',
        isShow: true,
        handle: (scope, form, formDatas, setFormDatas) => {
          // 区别组合天然纤维或天然纤维 1天然纤维 2组合天然纤维

          // 隐藏上机纱长
          this.naturalContent[this.naturalContent.length - 1].isShow = scope.row.yarnLengthType === '1'
          const naturalContent = scope.row.yarnLengthType === '1' ? [...this.generalContent] : []
          this.naturalPopHandle('编辑天然纤维')
          const lsit = this.naturalPopOptions.content
          lsit.forEach(v => {
            if (v.valueType === 'object') {
              const item = scope.row[v.prop]
              if (!item || !item.value || !item.label) {
                scope.row[v.prop] = ''
              }
            }
          })
          if (scope.row.yarnLengthType === '1') {
            this.setMachineYarn('edit', scope.row)
          }

          this.$set(this.naturalPopOptions, 'formDatas', { ...scope.row })
          this.$set(this.naturalPopOptions, 'content', [...this.naturalContent, ...deepClone(naturalContent)])
          this.$nextTick(() => {
            this.naturalIndex = scope.$index
            if (this.knitModeType === 0 && naturalContent.length) {
              this.$set(this.naturalPopOptions.content[this.naturalPopOptions.content.length - 1].columns[0].editOptions, 'itemType', 'select')
              this.$set(this.naturalPopOptions.content[this.naturalPopOptions.content.length - 1].columns[0].editOptions, 'valueType', 'object')
            } else if (this.knitModeType === 1 && scope.row.yarnLengthType === '1') {
              console.log(this.naturalPopOptions.content[this.naturalPopOptions.content.length - 1].columns[0].editOptions)
              this.$set(this.naturalPopOptions.content[this.naturalPopOptions.content.length - 1].columns[0].editOptions, 'itemType', 'input')
              this.$set(this.naturalPopOptions.content[this.naturalPopOptions.content.length - 1].columns[0].editOptions, 'maxlength', 20)
            }
            if (Number.isInteger(formDatas.index)) {
              this.$set(this.naturalPopOptions.formDatas, 'naturalIndex', formDatas.index)
              this.$set(this.naturalPopOptions.content[7], 'label', '组合占比%')
            } else {
              this.$set(this.naturalPopOptions.formDatas, 'naturalIndex', null)
              this.$set(this.naturalPopOptions.content[7], 'label', '纱比')
            }
            setTimeout(() => {
              form.clearValidate()
            }, 10)
          })
          // this.setMachineYarn('edit', scope.row)

          this.getData()
          this.getNaturalSelect()
        }
      },
      {
        label: '删除',
        isShow: false,
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
      width: '80',
      fixed: 'right',
      dataSource: naturalOperatesData
    }
    const popTableColumns = [
      {
        prop: 'desc',
        label: '描述',
        className: 'ruleTip',
        itemType: 'input',
        dataSource: [],
        maxlength: 20,
        rules: [
          {
            required: true,
            message: '描述不能为空',
            trigger: ['bulr', 'change']
          }
        ],
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          dataSource: [],
          maxlength: 20,
          rules: [
            {
              required: true,
              message: '描述不能为空',
              trigger: ['bulr', 'change']
            }
          ]
        }
      },
      {
        prop: 'len',
        label: '上机纱长(cm)',
        className: 'ruleTip',
        itemType: 'input',
        valueType: 'object',
        rules: [
          {
            required: true,
            message: '上机纱长不能为空',
            trigger: ['bulr', 'change']
          },
          { validator: checkVal, trigger: 'blur' }
        ],
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          valueType: 'object',
          rules: [
            {
              required: true,
              message: '上机纱长不能为空',
              trigger: ['bulr', 'change']
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
            desc: '',
            len: '',
            edit: true,
            descUuid: ''
          }
          const data = [...formDatas['tableForm']]
          data.splice(params.$index + 1, 0, popTableParams)
          if (this.popMachineYarnLength.visible) {
            this.$set(this.popMachineYarnLength.content[0], 'dataSource', data)
          } else if (this.naturalPopOptions.visible) {
            this.$set(this.naturalPopOptions.content[9], 'dataSource', data)
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
          this.$confirm('确认删除当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'customClass'
          })
            .then(() => {
              const data = [...formDatas['tableForm']]
              data.splice(params.$index, 1)
              if (this.popMachineYarnLength.visible) {
                this.$set(this.popMachineYarnLength.content[0], 'dataSource', data)
              } else if (this.naturalPopOptions.visible) {
                this.$set(this.naturalPopOptions.content[9], 'dataSource', data)
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
        desc: '',
        len: '',
        edit: true
      }
    ]
    const naturalContent = [
      {
        prop: 'yarnInfo',
        itemType: 'select',
        label: '纱支',
        valueType: 'object',
        disabled: true,
        dataSource: [],
        select: [getSelectData, { enabled: 'Y', categoryId: 9 }]
      },
      {
        prop: 'elementInfo',
        itemType: 'select',
        label: '成份/比例',
        disabled: true,
        valueType: 'object',
        className: 'commonRemoteSearch',
        dataSource: [],
        select: [this.getIngredients, { enabled: 'Y' }]
      },

      {
        prop: 'methodInfo',
        itemType: 'select',
        label: '梳棉方法',
        valueType: 'object',
        clearable: true,
        rules: [commonChangeReg, {
          required: true,
          message: '上机纱长不能为空',
          trigger: ['change']
        }],
        select: [getSelectData, { enabled: 'Y', categoryId: 3 }],
        dataSource: [],
        visibleChange: (flag) => {
          flag && getSelectData({ enabled: 'Y', categoryId: 3 }).then(res => {
            const dataList = res.data
            this.$set(this.naturalContent[2], 'dataSource', dataList.map(item => {
              return {
                label: item.name,
                value: item.uuid
              }
            }))
          })
        }
      },
      {
        prop: 'spinningMethodsInfo',
        itemType: 'select',
        label: '纺纱方法',
        valueType: 'object',
        clearable: true,
        rules: [commonChangeReg],
        select: [getSelectData, { enabled: 'Y', categoryId: 2 }],
        dataSource: [],
        visibleChange: (flag) => {
          flag && getSelectData({ enabled: 'Y', categoryId: 2 }).then(res => {
            const dataList = res.data
            this.$set(this.naturalContent[3], 'dataSource', dataList.map(item => {
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
        label: '捻向',
        valueType: 'object',
        clearable: true,
        rules: [commonChangeReg],
        select: [getSelectData, { enabled: 'Y', categoryId: 10 }],
        dataSource: [],
        visibleChange: (flag) => {
          flag && getSelectData({ enabled: 'Y', categoryId: 10 }).then(res => {
            const dataList = res.data
            this.$set(this.naturalContent[4], 'dataSource', dataList.map(item => {
              return {
                label: item.name,
                value: item.uuid
              }
            }))
          })
        }
      },
      {
        prop: 'yarnCategoryInfo',
        itemType: 'select',
        label: '纱类',
        valueType: 'object',
        rules: [commonChangeReg],
        select: [getSelectData, { enabled: 'Y', categoryId: 1 }],
        dataSource: [],
        visibleChange: (flag) => {
          flag && getSelectData({ enabled: 'Y', categoryId: 1 }).then(res => {
            const dataList = res.data
            this.$set(this.naturalContent[5], 'dataSource', dataList.map(item => {
              return {
                label: item.name,
                value: item.uuid
              }
            }))
          })
        }
      },
      {
        prop: 'dyeingAdaptability',
        itemType: 'select',
        valueType: 'object',
        label: '染色适应性',
        select: [getSelectData, { enabled: 'Y', categoryId: 6 }],
        dataSource: [],
        rules: [commonChangeReg],
        visibleChange: (flag) => {
          flag && getSelectData({ enabled: 'Y', categoryId: 6 }).then(res => {
            const dataList = res.data
            this.$set(this.naturalContent[6], 'dataSource', dataList.map(item => {
              return {
                label: item.name,
                value: item.uuid
              }
            }))
          })
        }
      },
      {
        prop: 'yarnRatio',
        itemType: 'input',
        label: '纱比',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg, { validator: checkValues, trigger: 'blur' }],
        dataSource: []
      },
      {
        itemType: 'view',
        text: '上机纱长',
        style: style1,
        isShow: false
      }
    ]
    const generalContent = [

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
    // 这是pop弹出层用的配置信息
    const popMachineYarnLength = {
      itemType: 'dialog',
      visible: false,
      title: '上机纱长',
      okText: '保存',
      ok: (params, checkValList) => {
        const yarnLeng = this.$utils.deepClone(params && params.tableForm || [])
        const dataYarn = []
        yarnLeng.forEach(v => {
          dataYarn.push({
            desc: (typeof v.desc === 'object' ? v.desc.label : v.desc) || '',
            edit: v.edit,
            len: v.len,
            descUuid: (typeof v.desc === 'object' ? v.desc.value : v.descUuid) || ''
          })
        })
        let str = ''
        if (yarnLeng.length) {
          for (let i = 0; i < yarnLeng.length; i++) {
            const item = yarnLeng[i]
            str += `${item.desc.label ? item.desc.label : item.desc}:${item.len}|`
          }
          str = str.substr(0, str.length - 1)
        }
        this.$nextTick(() => {
          this.$set(this.composeYarns[this.yarnLengthInex], 'machineYarnLength', JSON.stringify(dataYarn))
          this.$set(this.composeYarns[this.yarnLengthInex], 'machineYarnLengthView', str)
          this.$refs.mainYarnFineness.form.clearValidate()
        })
        this.popMachineYarnLength.visible = false
      },
      cancel: (params) => {
        this.popMachineYarnLength.visible = false
      },
      formDatas: {},
      formOptions: {},
      content: generalContent
    }
    const specialContent = [
      {
        prop: 'machineYarn',
        itemType: 'input',
        type: 'textarea',
        label: '',
        maxlength: 500,
        rules: [commonBlurReg],
        labelWidth: '10px',
        trim: value => {
          return value
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
        const machineYarnLength = this.setMachineYarn('submit', { ...params })
        let dataYarn = []
        if (machineYarnLength && machineYarnLength.indexOf('[') !== -1) {
          const yarnLeng = this.$utils.deepClone(JSON.parse(machineYarnLength) || [])
          yarnLeng.forEach(v => {
            dataYarn.push({
              desc: (typeof v.desc === 'object' ? v.desc.label : v.desc) || '',
              edit: v.edit,
              len: v.len,
              descUuid: (typeof v.desc === 'object' ? v.desc.value : v.descUuid) || ''
            })
          })
        }
        if (dataYarn.length > 0) {
          dataYarn = JSON.stringify(dataYarn)
        } else {
          dataYarn = ''
        }
        if (Number.isInteger(naturalIndex)) {
          if (this.naturalIndex > -1) {
            this.$set(this.composeYarns[naturalIndex].naturalFiberUpdateReqtList, this.naturalIndex, { ...params, comRatio: params.yarnRatio, machineYarnLength: dataYarn, yarnLengthType: '0' })
          } else {
            if (this.composeYarns[naturalIndex].naturalFiberUpdateReqtList) {
              this.composeYarns[naturalIndex].naturalFiberUpdateReqtList.push({ ...params, comRatio: params.yarnRatio, machineYarnLength: dataYarn, yarnLengthType: '0' })
            } else {
              this.$set(this.composeYarns[naturalIndex], 'naturalFiberUpdateReqtList', [{ ...params, comRatio: params.yarnRatio, machineYarnLength: dataYarn, yarnLengthType: '0' }])
            }
          }
        } else {
          if (this.naturalIndex > -1) {
            this.$set(this.naturalData, this.naturalIndex, { ...params, machineYarnLength: dataYarn, yarnLengthType: '1' })
          } else {
            this.naturalData.push({ ...params, machineYarnLength: dataYarn, yarnLengthType: '1' })
          }
        }
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
        prop: 'colorYarnCode',
        label: '纱线编码',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => scope.row.colorYarnCode || scope.row.colorYarnCode || scope.row.yarnCode || ''
      },
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
        prop: 'specialWireCategoryInfo',
        label: '特殊丝',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      },

      {
        prop: 'sectionShapeInfo',
        label: '截面形状',
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
        prop: 'elasticityDegreeInfo',
        label: '弹力程度',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      },
      {
        prop: 'functionsInfo',
        label: '功能',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      },
      {
        prop: 'colorInfo',
        label: '颜色',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      }
      // {
      //   prop: 'machineYarnLength',
      //   label: '上机纱长',
      //   minWidth: '160',
      //   showOverflowTooltip: true,
      //   formater: scope => this.getMachineYarn(scope.row),
      // }
    ]
    // 化学纤维
    const chemicalColumns = [
      ...chemicalBaseColumns,
      {
        prop: 'machineYarnLength',
        label: '上机纱长',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => this.getMachineYarn(scope.row)
      },
      {
        prop: 'yarnRatio',
        label: '纱比',
        showOverflowTooltip: true
      }
    ]
    // 组合化学纤维
    const composeChemicalColumns = [
      ...chemicalBaseColumns,
      {
        prop: 'yarnRatio',
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
          // 隐藏上机纱长
          this.chemicalContent[this.chemicalContent.length - 1].isShow = scope.row.yarnLengthType === '1'
          const chemicalContent = scope.row.yarnLengthType === '1' ? [...this.generalContent] : []
          const lsit = this.chemicalPopOptions.content
          lsit.forEach(v => {
            if (v.valueType === 'object') {
              const item = scope.row[v.prop]
              if (!item || !item.value || !item.label) {
                scope.row[v.prop] = null
              }
            }
          })
          if (scope.row.yarnLengthType === '1') {
            this.setMachineYarn('edit', scope.row)
          }

          this.$set(this.chemicalPopOptions, 'formDatas', { ...scope.row })
          this.$nextTick(() => {
            this.$set(this.chemicalPopOptions, 'content', [...this.chemicalContent, ...chemicalContent])
            this.chemicalIndex = scope.$index
            if (this.knitModeType === 0 && scope.row.yarnLengthType === '1') {
              this.$set(this.chemicalPopOptions.content[this.chemicalPopOptions.content.length - 1].columns[0].editOptions, 'itemType', 'select')
              this.$set(this.chemicalPopOptions.content[this.chemicalPopOptions.content.length - 1].columns[0].editOptions, 'valueType', 'object')
            } else if (this.knitModeType === 1 && scope.row.yarnLengthType !== '1') {
              this.$set(this.chemicalPopOptions.content[this.chemicalPopOptions.content.length - 1].columns[0].editOptions, 'itemType', 'input')
              this.$set(this.chemicalPopOptions.content[this.chemicalPopOptions.content.length - 1].columns[0].editOptions, 'maxlength', 20)
            }

            // debugger
            if (Number.isInteger(formDatas.index)) {
              this.$set(this.chemicalPopOptions.formDatas, 'chemicalIndex', formDatas.index)
              this.$set(this.chemicalPopOptions.content[11], 'label', '组合占比%')
            } else {
              this.$set(this.chemicalPopOptions.formDatas, 'chemicalIndex', null)
              this.$set(this.chemicalPopOptions.content[11], 'label', '纱比')
            }
            setTimeout(() => {
              form.clearValidate()
            }, 10)
          })

          this.getData()
          this.getChemicalSelect(scope.row)
        }
      },
      {
        label: '删除',
        isShow: false,
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
      width: '80',
      fixed: 'right',
      dataSource: chemicalOperatesData
    }
    const chemicalContent = [
      {
        prop: 'finenessInfo',
        itemType: 'select',
        label: '细度',
        valueType: 'object',
        disabled: true,
        maxlength: 20,
        dataSource: [],
        select: [getSelectData, { enabled: 'Y', categoryId: 12 }]
      },
      {
        prop: 'elementInfo',
        itemType: 'select',
        valueType: 'object',
        label: '成份',
        // clearable: true,
        // filterable: true,
        disabled: true,
        className: 'commonRemoteSearch',
        maxlength: 20,
        // rules: [commonBlurReg],
        dataSource: [],
        select: [this.getIngredients, { enabled: 'Y' }]
      },
      {
        prop: 'wireCategoryInfo',
        itemType: 'select',
        valueType: 'object',
        label: '丝类',
        clearable: true,
        maxlength: 20,
        rules: [commonChangeReg],
        dataSource: [],
        select: [getSelectData, { enabled: 'Y', categoryId: 4 }],
        visibleChange: (flag) => {
          flag && getSelectData({ enabled: 'Y', categoryId: 4 }).then(res => {
            const dataList = res.data
            this.$set(this.chemicalContent.[2], 'dataSource', dataList.map(item => {
              return {
                label: item.name,
                value: item.uuid
              }
            }))
          })
        }
      },
      {
        prop: 'specialWireCategoryInfo',
        itemType: 'select',
        valueType: 'object',
        label: '特殊丝',
        clearable: true,
        maxlength: 20,
        dataSource: [],
        rules: [commonChangeReg],
        select: [getSelectData, { enabled: 'Y', categoryId: 13 }],
        visibleChange: (flag) => {
          flag && getSelectData({ enabled: 'Y', categoryId: 13 }).then(res => {
            const dataList = res.data
            this.$set(this.chemicalContent.[3], 'dataSource', dataList.map(item => {
              return {
                label: item.name,
                value: item.uuid
              }
            }))
          })
        }
      },
      {
        prop: 'gridDegreeInfo',
        itemType: 'select',
        valueType: 'object',
        label: '网络度',
        clearable: true,
        maxlength: 20,
        rules: [commonChangeReg],
        // rules: [{ required: true, trigger: 'change', message: '必填项不能为空' }],
        dataSource: [],
        select: [getSelectData, { enabled: 'Y', categoryId: 15 }],
        visibleChange: (flag) => {
          flag && getSelectData({ enabled: 'Y', categoryId: 15 }).then(res => {
            const dataList = res.data
            this.$set(this.chemicalContent.[4], 'dataSource', dataList.map(item => {
              return {
                label: item.name,
                value: item.uuid
              }
            }))
          })
        }
      },
      {
        prop: 'lightDegreeInfo',
        itemType: 'select',
        valueType: 'object',
        label: '光泽度',
        clearable: true,
        maxlength: 20,
        rules: [commonChangeReg],
        dataSource: [],
        select: [getSelectData, { enabled: 'Y', categoryId: 5 }],
        visibleChange: (flag) => {
          flag && getSelectData({ enabled: 'Y', categoryId: 5 }).then(res => {
            const dataList = res.data
            this.$set(this.chemicalContent.[5], 'dataSource', dataList.map(item => {
              return {
                label: item.name,
                value: item.uuid
              }
            }))
          })
        }
      },
      {
        prop: 'sectionShapeInfo',
        itemType: 'select',
        valueType: 'object',
        label: '截面形状',
        clearable: true,
        maxlength: 20,
        rules: [commonChangeReg],
        dataSource: [],
        select: [getSelectData, { enabled: 'Y', categoryId: 16 }],
        visibleChange: (flag) => {
          flag && getSelectData({ enabled: 'Y', categoryId: 16 }).then(res => {
            const dataList = res.data
            this.$set(this.chemicalContent.[6], 'dataSource', dataList.map(item => {
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
        valueType: 'object',
        label: '捻向',
        clearable: true,
        maxlength: 20,
        rules: [commonChangeReg],
        dataSource: [],
        select: [getSelectData, { enabled: 'Y', categoryId: 17 }],
        visibleChange: (flag) => {
          flag && getSelectData({ enabled: 'Y', categoryId: 17 }).then(res => {
            const dataList = res.data
            this.$set(this.chemicalContent.[7], 'dataSource', dataList.map(item => {
              return {
                label: item.name,
                value: item.uuid
              }
            }))
          })
        }
      },
      {
        prop: 'elasticityDegreeInfo',
        itemType: 'select',
        valueType: 'object',
        label: '弹力程度',
        clearable: true,
        maxlength: 20,
        rules: [commonChangeReg],
        dataSource: [],
        select: [getSelectData, { enabled: 'Y', categoryId: 19 }],
        visibleChange: (flag) => {
          flag && getSelectData({ enabled: 'Y', categoryId: 19 }).then(res => {
            const dataList = res.data
            this.$set(this.chemicalContent.[8], 'dataSource', dataList.map(item => {
              return {
                label: item.name,
                value: item.uuid
              }
            }))
          })
        }
      },
      {
        prop: 'functionsInfo',
        itemType: 'select',
        valueType: 'object',
        label: '功能',
        clearable: true,
        maxlength: 20,
        rules: [commonChangeReg],
        dataSource: [],
        select: [getSelectData, { enabled: 'Y', categoryId: 14 }],
        visibleChange: (flag) => {
          flag && getSelectData({ enabled: 'Y', categoryId: 14 }).then(res => {
            const dataList = res.data
            this.$set(this.chemicalContent.[9], 'dataSource', dataList.map(item => {
              return {
                label: item.name,
                value: item.uuid
              }
            }))
          })
        }
      },
      {
        prop: 'colorInfo',
        itemType: 'select',
        valueType: 'object',
        label: '颜色',
        clearable: true,
        maxlength: 20,
        rules: [commonChangeReg],
        dataSource: [],
        select: [getSelectData, { enabled: 'Y', categoryId: 18 }],
        visibleChange: (flag) => {
          flag && getSelectData({ enabled: 'Y', categoryId: 18 }).then(res => {
            const dataList = res.data
            this.$set(this.chemicalContent.[10], 'dataSource', dataList.map(item => {
              return {
                label: item.name,
                value: item.uuid
              }
            }))
          })
        }
      },
      {
        prop: 'yarnRatio',
        itemType: 'input',
        label: '纱比',
        clearable: true,
        maxlength: 20,
        rules: [commonChangeReg, { validator: checkValues, trigger: 'blur' }],
        dataSource: []
      },
      {
        itemType: 'view',
        text: '上机纱长',
        style: style1
      }
    ]
    const chemicalPopOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增化学纤维',
      okText: '保存',
      ok: params => {
        debugger
        const chemicalIndex = this.chemicalPopOptions.formDatas.chemicalIndex
        const machineYarnLength = this.setMachineYarn('submit', { ...params })
        let dataYarn = []
        if (machineYarnLength && machineYarnLength.indexOf('[') !== -1) {
          const yarnLeng = this.$utils.deepClone(JSON.parse(machineYarnLength) || [])
          yarnLeng.forEach(v => {
            dataYarn.push({
              desc: (typeof v.desc === 'object' ? v.desc.label : v.desc) || '',
              edit: v.edit,
              len: v.len,
              descUuid: (typeof v.desc === 'object' ? v.desc.value : v.descUuid) || ''
            })
          })
        }
        if (dataYarn.length > 0) {
          dataYarn = JSON.stringify(dataYarn)
        } else {
          dataYarn = ''
        }

        if (Number.isInteger(chemicalIndex)) {
          if (this.chemicalIndex > -1) {
            this.$set(this.composeYarns[chemicalIndex].chemicalFiberUpdateReqtList, this.chemicalIndex, { ...params, comRatio: params.yarnRatio, machineYarnLength: dataYarn, yarnLengthType: '0' })
          } else {
            if (this.composeYarns[chemicalIndex].chemicalFiberUpdateReqtList) {
              this.composeYarns[chemicalIndex].chemicalFiberUpdateReqtList.push({ ...params, comRatio: params.yarnRatio, machineYarnLength: dataYarn, yarnLengthType: '0' })
            } else {
              this.$set(this.composeYarns[chemicalIndex], 'chemicalFiberUpdateReqtList', [{ ...params, comRatio: params.yarnRatio, machineYarnLength: dataYarn, yarnLengthType: '0' }])
            }
          }
        } else {
          params.yarnRatio = params.yarnRatio * 1
          if (this.chemicalIndex > -1) {
            this.$set(this.chemicalData, this.chemicalIndex, { ...params, machineYarnLength: dataYarn, yarnLengthType: '1' })
          } else {
            this.chemicalData.push({ ...params, machineYarnLength: dataYarn, yarnLengthType: '1' })
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
        prop: 'yarnLength',
        label: '纱长单位',
        rules: [commonBlurReg],
        trim: (value) => {
          if (/^[1-9]\d{0,2}$/.test(value)) {
            this.$set(this.mainData[0], 'error', '')
            return value
          } else {
            this.$set(this.mainData[0], 'error', '数/最大999')
          }
        },
        placeholder: '',
        // itemType: 'input',
        itemType: this.inputTypeChange,
        // disabled: true,
        itemStyle: { width: '23%', 'margin-bottom': '15px', 'margin-right': '1%', 'margin-top': '15px' }

      },
      {
        prop: 'unit',
        // itemType: 'select',
        itemType: this.selectTypeChange,
        itemStyle: { 'width': '7%', 'margin-bottom': '15px', 'margin-top': '15px', 'margin-right': '43px' },
        placeholder: '',
        rules: [commonChangeReg],
        // isShow: () => {
        //   if (this.isEdit === 'edit') {
        //     return true
        //   }
        //   return false
        // },
        dataSource: [
          {
            value: 'G',
            label: 'G'
          },
          {
            value: 'R',
            label: 'R'
          }
        ],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return ''
        }
      },
      {
        itemType: 'view',
        text: '染纱/间条：',
        style: { ...style3, 'color': '#151222' },
        isShow: false
      },
      {
        prop: 'attachmentName',
        itemType: 'view',
        itemStyle: { 'width': '50%', 'marginRight': 0, 'display': 'inline-block' },
        // title: true,
        showOverflowTooltip: true,
        readonly: true,
        text: '详情',
        isShow: false,
        style: {
          'width': 'auto',
          'color': '#0986FF',
          'font-size': '14px',
          'margin-top': '25px',
          'cursor': 'pointer'
        },
        handle: () => {
          console.log(this.$parent.$refs.product.formDatas, this.designData, this.rawMaterialData, this.stripeSpacingData, this.naturalData, this.chemicalData, this.composeYarns)
          let isDyedFlag = false

          // 判断是否为编辑页面
          if (this.isEdit === 'edit') {
            this.$set(this.dyeingSliverPopOptions.content._rawMaterialTable, 'operates', this.rawMaterialOperates)
            this.$set(this.dyeingSliverPopOptions.content._intervalStripTable, 'operates', this.intervalStripOperates)

            this.$set(this.dyeingSliverPopOptions, 'okHidden', false)
            this.$set(this.dyeingSliverPopOptions, 'cancelHidden', false)

            this.$set(this.rawMaterialColumnsInfos._colorPreview.componentsOptions, 'noJudgment', true)
            this.$set(this.intervalStripColumnsInfos._colorBlock.componentsOptions, 'noJudgment', true)
            isDyedFlag = true
          } else {
            console.log('detail')

            this.$set(this.dyeingSliverPopOptions.content._rawMaterialTable, 'operates', null)
            this.$set(this.dyeingSliverPopOptions.content._intervalStripTable, 'operates', null)

            this.$set(this.dyeingSliverPopOptions, 'okHidden', true)
            this.$set(this.dyeingSliverPopOptions, 'cancelHidden', true)

            this.$set(this.rawMaterialColumnsInfos._colorPreview.componentsOptions, 'noJudgment', false)
            this.$set(this.intervalStripColumnsInfos._colorBlock.componentsOptions, 'noJudgment', false)
            isDyedFlag = false
          }

          // 天然纤维数据处理
          const naturalData = this.naturalData.map(item => {
            const tempData = (item.dyeInfoInfoRespList && item.dyeInfoInfoRespList.length !== 0) ? item.dyeInfoInfoRespList.map(item => {
              let flag = false
              if (isDyedFlag) {
                if (item.isDyed === 0) {
                  flag = false
                } else {
                  flag = true
                }
              }
              return {
                edit: isDyedFlag,
                ...item,
                colorEdit: flag,
                colorRatioEdit: flag
              }
            }) : [{ edit: isDyedFlag, isDyed: 0, mainId: item.id, dyeInfoType: 1, colorEdit: false, colorRatioEdit: false }]
            // const zzz = [{ edit: true, isDyed: 0, isDyedEdit: true, colorEdit: false, colorRatioEdit: isDyedFlag }]
            return tempData.map(itemValue => {
              return {
                ...item,
                // dataId: 1,
                yarnFineness: item.yarnInfo ? item.yarnInfo.label : '',
                elementName: item.elementInfo ? item.elementInfo.label : '',
                ...itemValue
              }
            })
          }).flat()
          // 化学纤维数据处理
          const chemicalData = this.chemicalData.map(item => {
            const tempData = (item.dyeInfoInfoRespList && item.dyeInfoInfoRespList.length !== 0) ? item.dyeInfoInfoRespList.map(item => {
              let flag = false
              if (isDyedFlag) {
                if (item.isDyed === 0) {
                  flag = false
                } else {
                  flag = true
                }
              }
              return {
                edit: isDyedFlag,
                ...item,
                colorEdit: flag,
                colorRatioEdit: flag
              }
            }) : [{ edit: isDyedFlag, isDyed: 0, mainId: item.id, dyeInfoType: 2, colorEdit: false, colorRatioEdit: false }]
            return tempData.map(itemValue => {
              return {
                ...item,
                // dataId: 2,
                yarnFineness: item.finenessInfo ? item.finenessInfo.label : '',
                elementName: item.elementInfo ? item.elementInfo.label : '',
                ...itemValue
              }
            })
          }).flat()
          // 组合数据处理
          const composeYarnsData = this.composeYarns.map(item => {
            const yarnFinenessData = [...(item.naturalFiberUpdateReqtList || []).map(item => item.yarnInfo ? item.yarnInfo.label : ''), ...(item.chemicalFiberUpdateReqtList || []).map(item => item.finenessInfo ? item.finenessInfo.label : '')]

            const elementNameData = [...(item.naturalFiberUpdateReqtList || []), ...(item.chemicalFiberUpdateReqtList || [])].map(item => item.elementInfo ? item.elementInfo.label : '')

            const tempData = (item.dyeInfoInfoRespList && item.dyeInfoInfoRespList.length !== 0) ? item.dyeInfoInfoRespList.map(item => {
              let flag = false
              if (isDyedFlag) {
                if (item.isDyed === 0) {
                  flag = false
                } else {
                  flag = true
                }
              }
              return {
                edit: isDyedFlag,
                ...item,
                colorEdit: flag,
                colorRatioEdit: flag
              }
            }) : [{ edit: isDyedFlag, isDyed: 0, mainId: item.id, dyeInfoType: 3, colorEdit: false, colorRatioEdit: false }]
            return tempData.map(itemValue => {
              return {
                ...item,
                // dataId: 3,
                yarnFineness: yarnFinenessData.join('|'),
                elementName: elementNameData.join('|'),
                ...itemValue
              }
            })
          }).flat()
          console.log('组装数据', naturalData, chemicalData, composeYarnsData)
          const datas = [...naturalData, ...chemicalData, ...composeYarnsData]
          const newArr = []
          // debugger
          if (this.isEdit === 'edit') {
            const cache = {} // 下标
            const indices = [] // 数组
            datas.forEach((item, i) => {
              const mainId = item.mainId
              const index = cache[mainId]
              if (index !== undefined) {
                indices[index].push(item)
              } else {
                cache[mainId] = indices.length
                indices.push([item])
              }
            })
            for (let i = 0; i < indices.length; i++) {
              const item = indices[i]
              for (let k = 0; k < item.length; k++) {
                if (item.length > 1) {
                  item[k].isDyedType = 1
                  item[k].colorEdit = true
                  item[k].colorRatioEdit = true
                  item[k].edit = true
                } else {
                  if (item[k].isDyed === 0) {
                    item[k].isDyedType = 0
                    item[k].colorEdit = false
                    item[k].colorRatioEdit = false
                    item[k].edit = true
                  } else {
                    item[k].isDyedType = 1
                    item[k].colorEdit = true
                    item[k].colorRatioEdit = true
                    item[k].edit = true
                  }
                }
              }
            }

            for (let i = 0; i < indices.length; i++) {
              newArr.push(...indices[i])
            }
          }
          // debugger
          this.$set(this.dyeingSliverPopOptions.content._rawMaterialTable, 'dataSource', this.isEdit === 'detail' ? datas : newArr)

          // 判断条纹间距要求是否存在
          if (this.stripeSpacingData && this.stripeSpacingData.length) {
          // 获取颜色组
            const colorGroups = this.stripeSpacingData.map(item => {
              return {
                colorName: item.color.label,
                colorValue: item.colorValue,
                height: item.height,
                fabricColorNo: item.fabricColorNo
              }
            })
            // 导入进条纹间距颜色组
            this.$set(this.dyeingSliverPopOptions.content._request.componentsOptions, 'colorGroups', colorGroups)
            // 导入进原料信息颜色组
            this.$set(this.rawMaterialColumnsInfos._colorPreview.componentsOptions, 'colorGroups', colorGroups)

            // 判断间条信息是否存在
            if (!this.designData || this.designData.length === 0) {
              // debugger
              this.$set(this.dyeingSliverPopOptions.content._intervalStripTable, 'dataSource', [{ edit: isDyedFlag }])
            } else {
              const productData = this.$parent.$refs.product.$refs.proForm.dynamicValidateFormRuleForm
              // cpi没有发生更改
              // if (this.$parent.$refs.product.formDatas.cpi === productData.cpi) {}
              const productFormDatas = this.$parent.$refs.product.formDatas
              const cpiFlag = (productFormDatas ? productFormDatas.cpi : '') === (productData ? productData.cpi : '')
              const CPIData = productData.cpi || 0
              this.$set(this.dyeingSliverPopOptions.content._intervalStripTable, 'dataSource', this.designData.map(item => {
                return {
                  ...item,
                  edit: isDyedFlag,
                  height: item.height === 0 ? '' : item.height,
                  module: item.module === 0 ? '' : cpiFlag ? item.module : this.$utils.getFloat(CPIData * item.height / 2.54, 2),
                  yarnFineness: this.isEdit === 'edit' ? item.yarnFineness.split(',') : item.yarnFineness
                }
              }))
            }

            // 把原料信息的纱支细度放入到间条信息里面纱支细度下拉框去
            const yarnOrFinenessData = [...new Set([...naturalData, ...chemicalData, ...composeYarnsData].map(item => item.yarnFineness))].map(item => {
              return {
                label: item,
                value: item
              }
            })
            this.$set(this.intervalStripColumnsInfos._yarnFineness.editOptions, 'dataSource', yarnOrFinenessData)
          } else {
            // console.log(111)
            // 获取产品信息数据
            const productData = this.$parent.$refs.product.formDatas
            const fabricColorNo = productData.fabricColorNo
            const customerColor = productData.customerColor
            const colorValueData = this.getColorByFabric({ code: fabricColorNo })
            let colorValue = ''
            if (colorValueData.list && colorValueData.list.length !== 0) {
              // console.log(111)
              colorValue = `rgb(${colorValueData.list[0].dataColor.sr},${colorValueData.list[0].dataColor.sg},${colorValueData.list[0].dataColor.sb}`
            } else {
              colorValue = ''
            }
            this.$set(this.rawMaterialColumnsInfos._colorPreview.componentsOptions, 'colorGroups', [{ colorName: customerColor, colorValue: colorValue }])
          }

          // 将原料信息里面存在的颜色预览放入到间条信息的色块可选里面
          const colorDataList = [...naturalData, ...chemicalData, ...composeYarnsData].reduce((total, item) => {
            // console.log(total)
            if (item.colorPreview && !total.map(item => item.colorValue).includes(item.colorPreview)) {
              total.push({
                colorValue: item.colorPreview,
                height: item.height,
                colorName: item.color,
                fabricColorNo: item.fabricColorNo
              })
            }
            return total
          }, [])
          console.log('colorDataList', colorDataList)
          this.$set(this.intervalStripColumnsInfos._colorBlock.componentsOptions, 'colorGroups', colorDataList)

          // 打开弹出框
          this.$set(this.dyeingSliverPopOptions, 'visible', true)
        }
      }

    ]
    const combinationData = [

      {
        prop: 'composeWayInfo',
        itemType: this.selectTypeChange,
        valueType: 'object',
        label: '组合方式',
        itemStyle: { width: '30%', marginRight: 0, marginLeft: '20px', marginBottom: 0 },
        labelWidth: '100px',
        clearable: true,
        rules: [commonChangeReg],
        placeholder: '请选择组合方式',
        dataSource: [],
        change: (value, form, formDatas, setFormDatas) => {
          this.composeYarns[formDatas.index].composeWayInfo = formDatas.composeWayInfo
        },
        visibleChange: (flag) => {
          flag && getSelectData({ enabled: 'Y', categoryId: 21 }).then(res => {
            const dataList = res.data
            this.$set(this.combinationData[0], 'dataSource', dataList.map(item => {
              return {
                label: item.name,
                value: item.uuid
              }
            }))
          })
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value && value.label ? `<span title="${value.label}">${value.label}</span>` : ''
        }
      },
      {
        prop: 'coatedWayInfo',
        itemType: this.selectTypeChange,
        itemStyle: { width: '30%', marginRight: 0, marginLeft: '20px', marginBottom: '10px' },
        labelWidth: '100px',
        label: '包覆方式',
        clearable: true,
        rules: [commonChangeReg],
        valueType: 'object',
        placeholder: '请选择包覆方式',
        dataSource: [],
        change: (value, form, formDatas, setFormDatas) => {
          this.composeYarns[formDatas.index].coatedWayInfo = formDatas.coatedWayInfo
        },
        visibleChange: (flag) => {
          flag && getSelectData({ enabled: 'Y', categoryId: 20 }).then(res => {
            const dataList = res.data
            this.$set(this.combinationData[1], 'dataSource', dataList.map(item => {
              return {
                label: item.name,
                value: item.uuid
              }
            }))
          })
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value && value.label ? `<span title="${value.label}">${value.label}</span>` : ''
        }
      },
      {
        prop: 'twistDirectionInfo',
        itemType: this.selectTypeChange,
        itemStyle: { width: '30%', marginRight: 0, marginLeft: '20px', marginBottom: 0 },
        labelWidth: '100px',
        label: '捻向',
        rules: [commonChangeReg],
        clearable: true,
        valueType: 'object',
        placeholder: '请选择捻向',
        dataSource: [],
        change: (value, form, formDatas, setFormDatas) => {
          this.composeYarns[formDatas.index].twistDirectionInfo = formDatas.twistDirectionInfo
        },
        visibleChange: (flag) => {
          flag && getSelectData({ enabled: 'Y', categoryId: 10 }).then(res => {
            const dataList = res.data
            this.$set(this.combinationData[2], 'dataSource', dataList.map(item => {
              return {
                label: item.name,
                value: item.uuid
              }
            }))
          })
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value && value.label ? `<span title="${value.label}">${value.label}</span>` : ''
        }
      },
      {
        prop: 'yarnRatio',
        itemType: this.inputTypeChange,
        itemStyle: { width: '30%', marginRight: 0, marginLeft: '20px', marginBottom: 0 },
        label: '纱比',
        clearable: true,
        placeholder: '请输入纱比',
        rules: [commonBlurReg, { validator: checkValues, trigger: 'blur' }],
        dataSource: [],
        change: (value, form, formDatas, setFormDatas) => {
          this.composeYarns[formDatas.index].yarnRatio = formDatas.yarnRatio
        }
      },
      {
        prop: 'yarnCode',
        itemType: this.inputTypeChange,
        itemStyle: { width: '30%', marginRight: 0, marginLeft: '20px', marginBottom: 0 },
        label: '纱线编码',
        clearable: true,
        disabled: true,
        change: (value, form, formDatas, setFormDatas) => {
          this.composeYarns[formDatas.index].yarnCode = formDatas.yarnCode
        }
      },
      {
        prop: 'machineYarnLengthView',
        itemType: this.inputTypeChange,
        itemStyle: { width: '30%', marginRight: 0, marginLeft: '20px', marginBottom: 0 },
        label: '上机纱长',
        clearable: true,
        placeholder: '请输入上机纱长',
        rules: [commonChangeReg],
        focus: (params, form, formDatas) => {
          this.yarnLengthInex = formDatas.index
          if (this.knitModeType === 0) {
            this.$set(this.popMachineYarnLength.content[0].columns[0].editOptions, 'itemType', 'select')
            this.$set(this.popMachineYarnLength.content[0].columns[0].editOptions, 'valueType', 'object')
          } else if (this.knitModeType === 1) {
            this.$set(this.popMachineYarnLength.content[0].columns[0].editOptions, 'itemType', 'input')
            this.$set(this.popMachineYarnLength.content[0].columns[0].editOptions, 'maxlength', 20)
          }
          const lsit = this.composeYarns[this.yarnLengthInex].machineYarnLength
          let yarnLen = []
          if (lsit && lsit.indexOf('[') !== -1) {
            yarnLen = deepClone(JSON.parse(lsit))
            yarnLen.forEach(v => {
              v.desc = {
                value: v.descUuid,
                label: v.desc
              }
            })
          } else {
            yarnLen = [{ desc: '', edit: true, len: '', descUuid: '' }]
          }
          this.$set(this.popMachineYarnLength.content[0], 'dataSource', yarnLen)
          this.$set(this.popMachineYarnLength, 'visible', true)
        },
        clear: (value, form, setFormDatas) => {
          this.$set(this.composeYarns[form.index], 'machineYarnLength', '')
          this.$set(this.composeYarns[form.index], 'machineYarnLengthView', '')
        },
        change: (value, form, formDatas, setFormDatas) => {
          console.log(value)
        }
      }
    ]
    return {
      commonBlurReg,
      formOtions: {
        inline: true,
        labelWidth: '100px'
      },
      ylFormDatas: {
        checkboxs: [1, 2, 3]
      },
      formDatas: {},
      ylData,
      headerCellStyle,
      popTableData,
      popTableColumns,
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
      mainFormDatas: {
        yarnLength: '',
        unit: 'G'
      },
      combinationData,
      combinationFormDatas: {},
      naturalIndex: -1,
      chemicalIndex: -1,
      dataType: '',
      composeYarns: null,
      naturalData: null,
      chemicalData: null,
      designData: null,
      rawMaterialData: null,
      stripeSpacingData: null,
      popMachineYarnLength,
      yarnLengthInex: null,
      describeList: []

    }
  },
  computed: {
    mainDataCopy() {
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
    },
    getKnitModeType() {
      return this.knitModeType
    }
  },
  watch: {
    isEdit(n, o) {
      // console.log(n)
      this.setOption(n)
      if (n === 'edit') {
        this.$set(this.dyeingSliverPopOptions, 'customClass', 'editHeightPopOptionsClass')
      } else {
        this.$set(this.dyeingSliverPopOptions, 'customClass', 'detailHeightPopOptionsClass')
      }
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
    },
    designDatas: {
      handler(v) {
        if (v) {
          this.designData = v
        } else {
          this.designData = []
        }
      },
      deep: true,
      immediate: true
    },
    rawMaterialDatas: {
      handler(v) {
        if (v) {
          this.rawMaterialData = v
        } else {
          this.rawMaterialData = []
        }
      },
      deep: true,
      immediate: true
    },
    stripeSpacingDatas: {
      handler(v) {
        if (v) {
          this.stripeSpacingData = v
        } else {
          this.stripeSpacingData = []
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // 获取成品上机纱长描述下拉数据
    this.getMiaoshuFn()
    this.getCombinationSelectList()
    this.getData()
  },
  methods: {
    showDyeing() {
      let isDyedFlag = false
      debugger
      // 判断是否为编辑页面
      if (this.isEdit === 'edit') {
        this.$set(this.dyeingSliverPopOptions.content._rawMaterialTable, 'operates', this.rawMaterialOperates)
        this.$set(this.dyeingSliverPopOptions.content._intervalStripTable, 'operates', this.intervalStripOperates)

        this.$set(this.dyeingSliverPopOptions, 'okHidden', false)
        this.$set(this.dyeingSliverPopOptions, 'cancelHidden', false)

        this.$set(this.rawMaterialColumnsInfos._colorPreview.componentsOptions, 'noJudgment', true)
        this.$set(this.intervalStripColumnsInfos._colorBlock.componentsOptions, 'noJudgment', true)
        isDyedFlag = true
      } else {
        console.log('detail')

        this.$set(this.dyeingSliverPopOptions.content._rawMaterialTable, 'operates', null)
        this.$set(this.dyeingSliverPopOptions.content._intervalStripTable, 'operates', null)

        this.$set(this.dyeingSliverPopOptions, 'okHidden', true)
        this.$set(this.dyeingSliverPopOptions, 'cancelHidden', true)

        this.$set(this.rawMaterialColumnsInfos._colorPreview.componentsOptions, 'noJudgment', false)
        this.$set(this.intervalStripColumnsInfos._colorBlock.componentsOptions, 'noJudgment', false)
        isDyedFlag = false
      }

      // 天然纤维数据处理
      const naturalData = this.naturalData.map(item => {
        const tempData = (item.dyeInfoInfoRespList && item.dyeInfoInfoRespList.length !== 0) ? item.dyeInfoInfoRespList.map(item => {
          let flag = false
          if (isDyedFlag) {
            if (item.isDyed === 0) {
              flag = true
            } else {
              flag = true
            }
          }
          return {
            edit: isDyedFlag,
            ...item,
            colorEdit: flag,
            colorRatioEdit: flag
          }
        }) : [{ edit: isDyedFlag, isDyed: 0, mainId: item.id, dyeInfoType: 1, colorEdit: false, colorRatioEdit: false }]
        // const zzz = [{ edit: true, isDyed: 0, isDyedEdit: true, colorEdit: false, colorRatioEdit: isDyedFlag }]
        return tempData.map(itemValue => {
          return {
            ...item,
            // dataId: 1,
            yarnFineness: item.yarnInfo ? item.yarnInfo.label : '',
            elementName: item.elementInfo ? item.elementInfo.label : '',
            ...itemValue
          }
        })
      }).flat()
      // 化学纤维数据处理
      const chemicalData = this.chemicalData.map(item => {
        const tempData = (item.dyeInfoInfoRespList && item.dyeInfoInfoRespList.length !== 0) ? item.dyeInfoInfoRespList.map(item => {
          let flag = false
          if (isDyedFlag) {
            if (item.isDyed === 0) {
              flag = true
            } else {
              flag = true
            }
          }
          return {
            edit: isDyedFlag,
            ...item,
            colorEdit: flag,
            colorRatioEdit: flag
          }
        }) : [{ edit: isDyedFlag, isDyed: 0, mainId: item.id, dyeInfoType: 2, colorEdit: false, colorRatioEdit: false }]
        return tempData.map(itemValue => {
          return {
            ...item,
            // dataId: 2,
            yarnFineness: item.finenessInfo ? item.finenessInfo.label : '',
            elementName: item.elementInfo ? item.elementInfo.label : '',
            ...itemValue
          }
        })
      }).flat()
      // 组合数据处理
      const composeYarnsData = this.composeYarns.map(item => {
        const yarnFinenessData = [...(item.naturalFiberUpdateReqtList || []).map(item => item.yarnInfo ? item.yarnInfo.label : ''), ...(item.chemicalFiberUpdateReqtList || []).map(item => item.finenessInfo ? item.finenessInfo.label : '')]

        const elementNameData = [...(item.naturalFiberUpdateReqtList || []), ...(item.chemicalFiberUpdateReqtList || [])].map(item => item.elementInfo ? item.elementInfo.label : '')

        const tempData = (item.dyeInfoInfoRespList && item.dyeInfoInfoRespList.length !== 0) ? item.dyeInfoInfoRespList.map(item => {
          let flag = false
          if (isDyedFlag) {
            if (item.isDyed === 0) {
              flag = true
            } else {
              flag = true
            }
          }
          return {
            edit: isDyedFlag,
            ...item,
            colorEdit: flag,
            colorRatioEdit: flag
          }
        }) : [{ edit: isDyedFlag, isDyed: 0, mainId: item.id, dyeInfoType: 3, colorEdit: false, colorRatioEdit: false }]
        return tempData.map(itemValue => {
          return {
            ...item,
            // dataId: 3,
            yarnFineness: yarnFinenessData.join('|'),
            elementName: elementNameData.join('|'),
            ...itemValue
          }
        })
      }).flat()
      console.log('组装数据', naturalData, chemicalData, composeYarnsData)
      const datas = [...naturalData, ...chemicalData, ...composeYarnsData]
      const newArr = []
      // debugger
      if (this.isEdit === 'edit') {
        const cache = {} // 下标
        const indices = [] // 数组
        datas.forEach((item, i) => {
          const mainId = item.mainId
          const index = cache[mainId]
          if (index !== undefined) {
            indices[index].push(item)
          } else {
            cache[mainId] = indices.length
            indices.push([item])
          }
        })
        for (let i = 0; i < indices.length; i++) {
          const item = indices[i]
          for (let k = 0; k < item.length; k++) {
            if (item.length > 1) {
              item[k].isDyedType = 1
              item[k].colorEdit = true
              item[k].colorRatioEdit = true
              item[k].edit = true
            } else {
              if (item[k].isDyed === 0) {
                item[k].isDyedType = 1
                item[k].colorEdit = true
                item[k].colorRatioEdit = true
                item[k].edit = true
              } else {
                item[k].isDyedType = 1
                item[k].colorEdit = true
                item[k].colorRatioEdit = true
                item[k].edit = true
              }
            }
          }
        }

        for (let i = 0; i < indices.length; i++) {
          newArr.push(...indices[i])
        }
      }
      // debugger
      this.$set(this.dyeingSliverPopOptions.content._rawMaterialTable, 'dataSource', this.isEdit === 'detail' ? datas : newArr)

      // 判断条纹间距要求是否存在
      if (this.stripeSpacingData && this.stripeSpacingData.length) {
      // 获取颜色组
        const colorGroups = this.stripeSpacingData.map(item => {
          return {
            colorName: item.color.label,
            colorValue: item.colorValue,
            height: item.height,
            fabricColorNo: item.fabricColorNo
          }
        })
        // 导入进条纹间距颜色组
        this.$set(this.dyeingSliverPopOptions.content._request.componentsOptions, 'colorGroups', colorGroups)
        // 导入进原料信息颜色组
        this.$set(this.rawMaterialColumnsInfos._colorPreview.componentsOptions, 'colorGroups', colorGroups)

        // 判断间条信息是否存在
        if (!this.designData || this.designData.length === 0) {
          // debugger
          this.$set(this.dyeingSliverPopOptions.content._intervalStripTable, 'dataSource', [{ edit: isDyedFlag }])
        } else {
          const productData = this.$parent.$refs.product.$refs.proForm.dynamicValidateFormRuleForm
          // cpi没有发生更改
          // if (this.$parent.$refs.product.formDatas.cpi === productData.cpi) {}
          const productFormDatas = this.$parent.$refs.product.formDatas
          const cpiFlag = (productFormDatas ? productFormDatas.cpi : '') === (productData ? productData.cpi : '')
          const CPIData = productData.cpi || 0
          this.$set(this.dyeingSliverPopOptions.content._intervalStripTable, 'dataSource', this.designData.map(item => {
            return {
              ...item,
              edit: isDyedFlag,
              height: item.height === 0 ? '' : item.height,
              module: item.module === 0 ? '' : cpiFlag ? item.module : this.$utils.getFloat(CPIData * item.height / 2.54, 2),
              yarnFineness: this.isEdit === 'edit' ? item.yarnFineness.split(',') : item.yarnFineness
            }
          }))
        }

        // 把原料信息的纱支细度放入到间条信息里面纱支细度下拉框去
        const yarnOrFinenessData = [...new Set([...naturalData, ...chemicalData, ...composeYarnsData].map(item => item.yarnFineness))].map(item => {
          return {
            label: item,
            value: item
          }
        })
        this.$set(this.intervalStripColumnsInfos._yarnFineness.editOptions, 'dataSource', yarnOrFinenessData)
      } else {
        // console.log(111)
        // 获取产品信息数据
        const productData = this.$parent.$refs.product.formDatas
        const fabricColorNo = productData.fabricColorNo
        const customerColor = productData.customerColor
        const colorValueData = this.getColorByFabric({ code: fabricColorNo })
        let colorValue = ''
        if (colorValueData.list && colorValueData.list.length !== 0) {
          // console.log(111)
          colorValue = `rgb(${colorValueData.list[0].dataColor.sr},${colorValueData.list[0].dataColor.sg},${colorValueData.list[0].dataColor.sb}`
        } else {
          colorValue = ''
        }
        this.$set(this.rawMaterialColumnsInfos._colorPreview.componentsOptions, 'colorGroups', [{ colorName: customerColor, colorValue: colorValue }])
      }

      // 将原料信息里面存在的颜色预览放入到间条信息的色块可选里面
      const colorDataList = [...naturalData, ...chemicalData, ...composeYarnsData].reduce((total, item) => {
        // console.log(total)
        if (item.colorPreview && !total.map(item => item.colorValue).includes(item.colorPreview)) {
          total.push({
            colorValue: item.colorPreview,
            height: item.height,
            colorName: item.color,
            fabricColorNo: item.fabricColorNo
          })
        }
        return total
      }, [])
      console.log('colorDataList', colorDataList)
      this.$set(this.intervalStripColumnsInfos._colorBlock.componentsOptions, 'colorGroups', colorDataList)

      // 打开弹出框
      this.$set(this.dyeingSliverPopOptions, 'visible', true)
    },
    async getData() {
      this.setOption(this.isEdit)
    },
    // 设置操作项
    setOption(status) {
      const obj = JSON.parse(JSON.stringify(this.$refs.mainYarnFineness.dynamicValidateFormRuleForm))
      if (typeof (obj.yarnLength) === 'string') {
        obj.yarnLength = obj.yarnLength.indexOf('G') >= 0 ? obj.yarnLength.replace('G', '') : obj.yarnLength
      }
      if (status === 'detail') {
        obj.ieEdit = false
        this.$set(this, 'mainFormDatas', obj)
        this.$set(this.$refs.mainYarnFineness, 'dynamicValidateFormRuleForm', obj)
        this.naturalOperates = null
        this.chemicalOperates = null
      } else if (status === 'edit') {
        obj.ieEdit = true
        this.$set(this, 'mainFormDatas', obj)
        this.$set(this.$refs.mainYarnFineness, 'dynamicValidateFormRuleForm', obj)
        this.naturalOperates = {
          label: '操作',
          width: '80',
          fixed: 'right',
          dataSource: this.naturalOperatesData
        }
        this.chemicalOperates = {
          label: '操作',
          width: '80',
          fixed: 'right',
          dataSource: this.chemicalOperatesData
        }
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
      this.getNaturalSelect()
      const obj = this.setMachineYarn('add')
      this.$set(this.naturalPopOptions, 'formDatas', { ...obj })
      const naturalContent = [...this.naturalContent, ...deepClone(this.generalContent)]
      this.$set(this.naturalPopOptions, 'content', naturalContent)
      let count = this.naturalData.length || 0
      // 组合的天然走下面
      if (Number.isInteger(index)) {
        count = this.composeYarns[index].naturalFiberUpdateReqtList ? this.composeYarns[index].naturalFiberUpdateReqtList.length : 0
        this.$set(this.naturalPopOptions.formDatas, 'naturalIndex', index)
      } else {
        count = this.naturalData.length
        this.$set(this.naturalPopOptions.formDatas, 'naturalIndex', null)
      }
      if (count >= 5) {
        this.$message.warning('天然纤维最多添加五条')
      } else {
        this.naturalPopHandle('新增天然纤维')
      }
    },
    // 点击新增化学纤维
    addChemicalClick(index) {
      this.getChemicalSelect()
      const obj = this.setMachineYarn('add')
      this.$set(this.chemicalPopOptions, 'formDatas', { ...obj })
      const chemicalContent = [...this.chemicalContent, ...this.generalContent]
      this.$set(this.chemicalPopOptions, 'content', chemicalContent)
      let count = this.chemicalData.length || 0
      // 组合的化学走下面
      if (Number.isInteger(index)) {
        count = this.composeYarns[index].chemicalFiberUpdateReqtList ? this.composeYarns[index].chemicalFiberUpdateReqtList.length : 0
        this.$set(this.chemicalPopOptions.formDatas, 'chemicalIndex', index)
      } else {
        count = this.chemicalData.length
        this.$set(this.chemicalPopOptions.formDatas, 'chemicalIndex', null)
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
      // if (formDatas) {
      //   Object.keys(formDatas).forEach(ele => {
      //     if (formDatas[ele] && Object.prototype.toString.call(formDatas[ele]) === '[object Object]') {
      //       const i = arr.findIndex(e => e.prop === ele)
      //       const has = arr[i].dataSource.find(e => formDatas[ele].value === e.value)
      //       if (!has) {
      //         arr[i].dataSource.push({
      //           value: formDatas[ele].value,
      //           label: formDatas[ele].label,
      //           disabled: true
      //         })
      //       }
      //     }
      //   })
      // }
      this.$set(this.chemicalPopOptions, 'content', arr)
    },
    // 获取面料成份/比例下拉
    async getIngredient(val) {
      const data1 = await getIngredient({ enabled: 'Y', name: val })
      const data2 = await getIngredientZh({ enabled: 'Y', name: val })
      const res = [...data1.data, ...data2.data].map(e => ({
        value: e.uuid,
        label: e.name,
        type: e.ids ? 1 : 0
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
        name: e.name
      }))
      return { ...data2, data: res }
    },
    // 获取描述下拉选数据
    async getMiaoshuFn() {
      if (!this.popTableColumns[0].editOptions.dataSource.length) {
        const res = (await getMiaoshu({ enabled: 'Y' })).data || []
        this.describeList = res
        this.$set(this.popTableColumns[0].editOptions, 'dataSource', res.map(e => ({
          value: e.uuid,
          label: e.name
        })))
        this.$set(this.popTableColumns[0], 'dataSource', res.map(e => ({
          value: e.uuid,
          label: e.name
        })))
      }
    },
    // 上机纱长处理
    getMachineYarn(row) {
      if (row.machineYarnLength) {
        const obj = JSON.parse(row.machineYarnLength)
        let str1 = ''
        obj && obj.forEach(v => {
          str1 += `${v.desc.label ? v.desc.label : v.desc}:${v.len ? v.len + 'CM|' : ''}`
        })
        return str1.slice(0, -1)
      }
    },
    setMachineYarn(type, row) {
      const obj = [{ desc: '', edit: true, len: '', descUuid: '' }]
      if (type === 'add') {
        return obj
      } else if (type === 'edit') {
        if (row.machineYarnLength && row.machineYarnLength.indexOf('[' !== -1)) {
          const newArr = JSON.parse(row.machineYarnLength).map(v => {
            return {
              desc: v.desc,
              len: v.len,
              edit: true,
              descUuid: v.descUuid
            }
          })
          this.$set(this.generalContent[0], 'dataSource', newArr)
          return JSON.parse(row.machineYarnLength)
        } else {
          this.$set(this.generalContent[0], 'dataSource', [...obj])
          return JSON.stringify(obj)
        }
      } else {
        return JSON.stringify(row.tableForm)
      }
    },

    async getCombinationSelectList() {
      // 获取组合方式
      const res1 = ((await getSelectData({ enabled: 'Y', categoryId: 21 })).data || []).map(item => ({ label: item.name, value: item.uuid }))
      // 获取包覆方式
      const res2 = ((await getSelectData({ enabled: 'Y', categoryId: 20 })).data || []).map(item => ({ label: item.name, value: item.uuid }))

      // 获取
      const res3 = ((await getSelectData({ enabled: 'Y', categoryId: 17 })).data || []).map(item => ({ label: item.name, value: item.uuid }))
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
        if (!(item.composeWayInfo && item.composeWayInfo.value && item.coatedWayInfo && item.coatedWayInfo.value && item.twistDirectionInfo && item.twistDirectionInfo.value && item.yarnRatio && item.machineYarnLength)) {
          result += `第${index + 1}个组合纱线里组合方式/包覆方式/捻向/纱比/上机纱长未填写, `
        }

        // 判断一组里面天然和化学纤维相加最少等于2
        // const naturalCount = item.naturalFiberUpdateReqtList ? item.naturalFiberUpdateReqtList.length : 0
        // const chemicalCount = item.chemicalFiberUpdateReqtList ? item.chemicalFiberUpdateReqtList.length : 0
        // if ((naturalCount + chemicalCount) < 1) {
        //   result += `第${index + 1}个组合纱线里天然纤维加化学纤维最少2条, `
        // }

        // 判断一组里面天然和化学纤维组合占比相加等于100
        const naturalArrNum = (item.naturalFiberUpdateReqtList && item.naturalFiberUpdateReqtList.length !== 0) ? item.naturalFiberUpdateReqtList.map(item => isNaN(item.yarnRatio) ? 0 : item.yarnRatio * 1).reduce((total, item) => total + item) : 0
        const chemicalArrNum = (item.chemicalFiberUpdateReqtList && item.chemicalFiberUpdateReqtList.length !== 0) ? item.chemicalFiberUpdateReqtList.map(item => isNaN(item.yarnRatio) ? 0 : item.yarnRatio * 1).reduce((total, item) => total + item) : 0
        if (this.$utils.getFloat(naturalArrNum + chemicalArrNum) !== 100) {
          result += `第${index + 1}个组合纱线里天然纤维和化学纤维里面的组合占比相加不等于100 `
        }

        composeNum += (isNaN(item.yarnRatio) ? 0 : item.yarnRatio * 1)
      })
      // 判断纱比跟天然纤维和化学纤维相加等于100
      const naturalNum = (this.naturalData && this.naturalData.length !== 0) ? this.naturalData.map(item => isNaN(item.yarnRatio) ? 0 : item.yarnRatio * 1).reduce((total, item) => total + item) : 0
      const chemicalNum = (this.chemicalData && this.chemicalData.length !== 0) ? this.chemicalData.map(item => isNaN(item.yarnRatio) ? 0 : item.yarnRatio * 1).reduce((total, item) => total + item) : 0
      if (this.$utils.getFloat(composeNum + naturalNum + chemicalNum) !== 100) {
        result += '天然纤维,化学纤维和组合纤维的纱比相加不等于100'
      }

      return result
    },

    // 根据智布色号获取颜色
    async getColorByFabric(data = {}) {
      const res = await colorColorManagePage(data)
      const dataList = res.data.list || []
      if (dataList[0] && dataList[0].dataColor) {
        return dataList[0].dataColor
      } else {
        return null
      }
    },
    inputTypeChange() {
      return this.isEdit === 'edit' ? 'input' : 'itemview'
    },
    selectTypeChange() {
      return this.isEdit === 'edit' ? 'select' : 'itemview'
    }
  }
}
</script>

<style lang="less" scoped>
  .require{
    margin: 0;
  }
  /deep/ .require [disabled='disabled'] {
    color: red !important;
  }
</style>
<style lang="less">
.require {
  background: #ffffff;
  .el-form-item__content {
    line-height: 36px;
  }
  // margin: 0 20px;
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
      max-width: 100%;
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
    padding: 0 20px;
    .custom-form {
      // border-bottom: 1px solid #dfe6ec;
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
      max-width: 100%;
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
  .rawMaterialTable-table .el-table__body-wrapper .cell {
    padding-bottom: 16px;
  }

  .editHeightPopOptionsClass {
    margin: 30px auto;
    .el-dialog__body {
      max-height: calc(100vh - 192px);
    }
  }

  .detailHeightPopOptionsClass {
    margin: 30px auto;
    .el-dialog__body {
      max-height: calc(100vh - 115px);
    }
  }
}
</style>
