/**
 * @Description: 纱属性
 * @author ll
 * @date 2020/10/22
*/
<template>
  <div class="yarnAttribute">
    <!-- tab切换 -->
    <div class="tabs">
      <el-tabs v-model="fatherActiveName" @tab-click="fatherHandleClick">
        <el-tab-pane
          v-for="(item, index) in tabData"
          :key="index"
          :label="item.name"
          :name="item.name"
        />
      </el-tabs>
      <el-tabs v-model="activeName" @tab-click="sonHandleClick">
        <el-tab-pane
          v-for="(item, indexs) in sonTabOption"
          :key="`${indexs}${item}${activeName}`"
          :label="item.name"
          :name="item.name"
        />
      </el-tabs>
    </div>
    <!-- 搜索表单 -->
    <div
      v-if="
        activeName == '纱支' ||
          activeName == '纱类' ||
          activeName == '细度' ||
          activeName == '丝类' ||
          activeName == '功能' ||
          activeName == '颜色'
      "
      class="search"
    >
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
        :form-datas="formDatas"
      />
    </div>
    <!-- 新增 -->
    <div class="button">
      <el-button
        v-permission="['basic:yarnTypes:store']"
        size="small"
        icon="el-icon-plus"
        type="primary"
        @click="addClick"
      >新增</el-button>
    </div>
    <!-- 布种表格 -->
    <div v-if="activeName == '纱支' || activeName == '细度'" class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        table-scrollx
      />
    </div>
    <div
      v-else-if="
        activeName == '纺纱方法' ||
          activeName == '梳棉方法' ||
          activeName == '捻向' ||
          activeName == '特殊纱线'
      "
      class="page-table"
    >
      <cs-custom-table
        tooltip-effect="dark"
        :columns="shortColumns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        table-scrollx
      />
    </div>
    <div v-else-if="activeName == '属性组合'" class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="attributeCombiningColumns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        table-scrollx
      />
    </div>
    <div v-else-if="activeName == '纱线等级'" class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="yarnGradeColumns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        table-scrollx
      />
    </div>
    <div v-else class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="simpleColumns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        table-scrollx
      />
    </div>
    <!-- 导入纱布pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="yarnCountPopOptions" />
    </div>
    <!-- 导入细度pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="yarnFinenessPopOptions" />
    </div>
    <!-- 导入布种pop弹出层 -->
    <!-- <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div> -->
    <div class="pop">
      <cs-custom-pop :options="shortPopOptions" />
    </div>
    <!-- 属性组合 -->
    <div class="pop">
      <cs-custom-pop
        ref="attributeCombiningPopOp"
        :options="attributeCombiningPopOptions"
      />
    </div>
    <div class="pop">
      <cs-custom-pop :options="simplePopOptions" />
    </div>
    <!-- 纱线等级 -->
    <div class="pop">
      <cs-custom-pop :options="yarnGradePopOptions" />
    </div>
  </div>
</template>

<script>
import enableSwitch from '@/views/basic-data/components/enableSwitch'
import actualNumberTip from './components/actualNumber-tip'
import { dataComparision } from '@/views/basic-data/common/index'
import {
  sysDataGroupPage,
  sysDataGroupAdd,
  sysDataGroupModify,
  sysDataGroupDelete,
  sysDataGroupApprove,
  sysDataGroupEnabled,
  sysDataGroupCategory,
  sysDataGroupDetail,
  attributeCombiningPopOpData
} from './api/index.js'
export default {
  data() {
    // 查询
    const searchData = [
      {
        prop: 'name',
        itemType: 'input',
        label: '名称:',
        clearable: true,
        placeholder: '名称'
      },
      {
        prop: 'enabled',
        itemType: 'select',
        label: '启用/禁用:',
        clearable: true,
        dataSource: [{ value: '', label: '全部' }, { value: 'Y', label: '启用' }, { value: 'N', label: '禁用' }]
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          // this.searchFormDatas = params
          this.formDatas = params
          this.getListData(params)
        },
        resetHandle: params => {
          // this.searchFormDatas = {}
          this.formDatas = {}
        }
      }
    ]
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const checkFrequency = (rule, value, callback) => {
      if (value.length !== 1) {
        callback(new Error('简称必须为一个字母'))
      } else {
        callback()
      }
    }
    const checkYarnGrade = (rule, value, callback) => {
      if (value.length > 5) {
        callback(new Error('纱线等级至多五位数'))
      } else {
        callback()
      }
    }
    const checkAttributeCombining = (rule, value, callback) => {
      if (value.length !== 2) {
        callback(new Error('简称必须为两个字母'))
      } else {
        callback()
      }
    }
    const checkNum = (rule, value, callback) => {
      const reg = /^[1-9]\d*$/
      if (!value) {
        return callback(new Error('名称不能为空'))
      } else if (parseInt(value) === 0 || !reg.test(value)) {
        return callback(new Error('请填写正整数'))
      } else {
        callback()
      }
    }
    const checkNum1 = (rule, value, callback) => {
      const reg = /^[1-9]\d*$/
      if (value && (parseInt(value) === 0 || !reg.test(value))) {
        return callback(new Error('请填写正整数'))
      } else {
        callback()
      }
    }
    const ruleTrim = (data) => {
      data = data.replace(/[^a-zA-Z]/g, '')
      data = data.toUpperCase()
      data = data.replace('_', '')
      return data
    }
    const ruleTrimYarn = (data) => {
      data = data.replace(/[^a-zA-Z0-9]/g, '')
      data = data.toUpperCase()
      data = data.replace('_', '')
      return data
    }
    // 纱支弹窗
    const yarnConutContent = [
      {
        prop: 'code',
        itemType: 'input',
        label: '序号',
        disabled: true
      },
      {
        prop: 'nameNum',
        itemType: 'input',
        itemStyle: { width: '40%', display: 'inline-block' },
        labelWidth: '78px',
        label: '名称',
        clearable: true,
        rules: [commonBlurReg, { validator: checkNum, trigger: 'change' }],
        change: (value) => {
          this.nameChange(value)
        }
      },
      {
        prop: 'unit',
        itemType: 'select',
        itemStyle: { width: '30%', display: 'inline-block' },
        labelWidth: '10px',
        label: ' ',
        change: (value) => {
          this.unitChange(value)
        },
        dataSource: [
          {
            label: 'S',
            value: 'S'
          },
          {
            label: 'N',
            value: 'N'
          }
        ]
      },
      {
        prop: 'num',
        itemType: 'select',
        itemStyle: { width: '30%', display: 'inline-block' },
        labelWidth: '30px',
        label: '/',
        change: (value) => {
          this.numChange(value)
        },
        dataSource: [
          {
            label: '1',
            value: 1
          },
          {
            label: '2',
            value: 2
          },
          {
            label: '3',
            value: 3
          },
          {
            label: '4',
            value: 4
          },
          {
            label: '5',
            value: 5
          }
        ]
      },
      {
        prop: 'actualNumber',
        itemType: 'input',
        itemStyle: { width: '100%', display: 'inline-block', position: 'relative' },
        label: '实际纱支',
        placeholder: '自动计算',
        rules: [commonBlurReg],
        disabled: true
      },
      {
        components: {
          actualNumberTip
        },
        componentsOptions: {
          activeName: '纱支'
        }
      },
      {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        label: '备注',
        maxlength: 100,
        trim: (value) => {
          return value
        },
        rules: [{ min: 0, max: 100, message: '长度在0 到100 个字符', trigger: 'blur' }]
      }
    ]
    // 细度弹窗
    const yarnFinenessContent = [
      {
        prop: 'code',
        itemType: 'input',
        label: '序号',
        disabled: true
      },
      {
        prop: 'nameNum',
        itemType: 'input',
        itemStyle: { width: '40%', display: 'inline-block' },
        labelWidth: '78px',
        label: '名称',
        clearable: true,
        rules: [commonBlurReg, { validator: checkNum, trigger: 'change' }],
        change: (value) => {
          this.nameChange(value)
        }
      },
      {
        prop: 'secondNum',
        itemType: 'input',
        itemStyle: { width: '30%', display: 'inline-block' },
        labelWidth: '30px',
        label: 'D/',
        clearable: true,
        rules: [{ validator: checkNum1, trigger: 'change' }],
        change: (value) => {
          this.secondNumChange(value)
        }
      },
      {
        prop: 'secondSelectNum',
        itemType: 'select',
        itemStyle: { width: '30%', display: 'inline-block' },
        labelWidth: '30px',
        label: 'F/',
        clearable: true,
        change: (value) => {
          this.secondSelectNumChange(value)
        },
        dataSource: [
          {
            label: '1',
            value: 1
          },
          {
            label: '2',
            value: 2
          },
          {
            label: '3',
            value: 3
          },
          {
            label: '4',
            value: 4
          },
          {
            label: '5',
            value: 5
          }
        ]
      },
      {
        prop: 'actualNumber',
        itemType: 'input',
        itemStyle: { width: '100%', display: 'inline-block', position: 'relative' },
        label: '实际纱支',
        placeholder: '自动计算',
        rules: [commonBlurReg],
        disabled: true
      },
      {
        components: {
          actualNumberTip
        },
        componentsOptions: {
          activeName: '细度'
        }
      },
      {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        label: '备注',
        maxlength: 100,
        trim: (value) => {
          return value
        },
        rules: [{ min: 0, max: 100, message: '长度在0 到100 个字符', trigger: 'blur' }]
      }
    ]
    const content = [
      {
        prop: 'code',
        itemType: 'input',
        label: '序号',
        disabled: true
      },
      {
        prop: 'name',
        itemType: 'input',
        label: '中文名',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg, { min: 1, max: 20, message: '长度在1 到20 个字符', trigger: 'blur' }]
      },
      {
        prop: 'nameEn',
        itemType: 'input',
        label: '英文名',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg, { min: 1, max: 20, message: '长度在1 到20 个字符', trigger: 'blur' }]
      },
      {
        prop: 'abbr',
        itemType: 'input',
        label: '简称',
        clearable: true,
        placeholder: '请输入一位大写字母',
        maxlength: 1,
        trim: ruleTrim,
        rules: [commonBlurReg, { validator: checkFrequency, trigger: 'change' }]
      },
      {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        label: '备注',
        maxlength: 100,
        trim: (value) => {
          return value
        },
        rules: [{ min: 0, max: 100, message: '长度在0 到100 个字符', trigger: 'blur' }]
      }
    ]
    // 不带简称的弹窗
    const simpleContent = [
      {
        prop: 'code',
        itemType: 'input',
        label: '序号',
        disabled: true
      },
      {
        prop: 'name',
        itemType: 'input',
        label: '中文名',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg, { min: 1, max: 20, message: '长度在1 到20 个字符', trigger: 'blur' }]
      },
      {
        prop: 'nameEn',
        itemType: 'input',
        label: '英文名',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg, { min: 1, max: 20, message: '长度在1 到20 个字符', trigger: 'blur' }]
      },
      {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        label: '备注',
        maxlength: 100,
        trim: (value) => {
          return value
        },
        rules: [{ min: 0, max: 100, message: '长度在0 到100 个字符', trigger: 'blur' }]
      }
    ]
    // 带简称的弹窗
    const shortContent = [
      {
        prop: 'code',
        itemType: 'input',
        label: '序号',
        disabled: true
      },
      {
        prop: 'name',
        itemType: 'input',
        label: '中文名',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg, { min: 1, max: 20, message: '长度在1 到20 个字符', trigger: 'blur' }]
      },
      {
        prop: 'nameEn',
        itemType: 'input',
        label: '英文名',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg, { min: 1, max: 20, message: '长度在1 到20 个字符', trigger: 'blur' }]
      },
      {
        prop: 'abbr',
        itemType: 'input',
        label: '简称',
        clearable: true,
        placeholder: '请输入一位大写字母',
        maxlength: 1,
        trim: ruleTrim,
        rules: [commonBlurReg, { validator: checkFrequency, trigger: 'change' }]
      },
      {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        label: '备注',
        maxlength: 100,
        trim: (value) => {
          return value
        },
        rules: [{ min: 0, max: 100, message: '长度在0 到100 个字符', trigger: 'blur' }]
      }
    ]
    // 属性组合弹窗
    const attributeCombiningContent = [
      {
        prop: 'code',
        itemType: 'input',
        label: '序号',
        disabled: true
      },
      {
        prop: 'cottonCarding',
        itemType: 'select',
        filterable: true,
        label: '梳棉方法',
        placeholder: '请选择梳棉方法',
        rules: [{ required: true, message: '请选择梳棉方法', trigger: 'blur' }],
        dataSource: [],
        valueKey: 'uuid',
        visibleChange: (value) => {
          if (value) {
            this.getattributeCombiningPopOpData({ categoryId: 3 }, 1)
          }
        },
        change: (data) => {
          this.$refs.attributeCombiningPopOp.$refs.popComponents.$refs.customform.setDynamicValidateFormRuleForm(
            { cottonCardingUuid: data.uuid }
          )
          const dynamicValidateFormRuleForm = this.$refs.attributeCombiningPopOp.$refs.popComponents.$refs.customform.dynamicValidateFormRuleForm
          this.$refs.attributeCombiningPopOp.$refs.popComponents.$refs.customform.setDynamicValidateFormRuleForm(
            { name: `${data ? data.name + '/' : ''}${(dynamicValidateFormRuleForm && dynamicValidateFormRuleForm.spinning) ? dynamicValidateFormRuleForm.spinning.name + '/' : ''}${(dynamicValidateFormRuleForm && dynamicValidateFormRuleForm.yarnFabric) ? dynamicValidateFormRuleForm.yarnFabric.name : ''}` }
          )
        }
      },
      {
        prop: 'spinning',
        itemType: 'select',
        filterable: true,
        label: '纺纱方法',
        placeholder: '请选择纺纱方法',
        rules: [{ required: true, message: '请选择纺纱方法', trigger: 'blur' }],
        dataSource: [],
        valueKey: 'uuid',
        visibleChange: (value) => {
          if (value) {
            this.getattributeCombiningPopOpData({ categoryId: 2 }, 2)
          }
        },
        change: (data) => {
          this.$refs.attributeCombiningPopOp.$refs.popComponents.$refs.customform.setDynamicValidateFormRuleForm(
            { spinningUuid: data.uuid }
          )
          const dynamicValidateFormRuleForm = this.$refs.attributeCombiningPopOp.$refs.popComponents.$refs.customform.dynamicValidateFormRuleForm
          this.$refs.attributeCombiningPopOp.$refs.popComponents.$refs.customform.setDynamicValidateFormRuleForm(
            { name: `${(dynamicValidateFormRuleForm && dynamicValidateFormRuleForm.cottonCarding) ? dynamicValidateFormRuleForm.cottonCarding.name + '/' : ''}${data ? data.name + '/' : ''}${(dynamicValidateFormRuleForm && dynamicValidateFormRuleForm.yarnFabric) ? dynamicValidateFormRuleForm.yarnFabric.name : ''}` }
          )
        }
      },
      {
        prop: 'yarnFabric',
        itemType: 'select',
        filterable: true,
        label: '纱类',
        placeholder: '请选择纱类',
        rules: [{ required: true, message: '请选择纱类', trigger: 'blur' }],
        dataSource: [],
        valueKey: 'uuid',
        visibleChange: (value) => {
          if (value) {
            this.getattributeCombiningPopOpData({ categoryId: 1 }, 3)
          }
        },
        change: (data) => {
          this.$refs.attributeCombiningPopOp.$refs.popComponents.$refs.customform.setDynamicValidateFormRuleForm(
            { yarnFabricUuid: data.uuid }
          )
          const dynamicValidateFormRuleForm = this.$refs.attributeCombiningPopOp.$refs.popComponents.$refs.customform.dynamicValidateFormRuleForm
          this.$refs.attributeCombiningPopOp.$refs.popComponents.$refs.customform.setDynamicValidateFormRuleForm(
            { name: `${(dynamicValidateFormRuleForm && dynamicValidateFormRuleForm.cottonCarding) ? dynamicValidateFormRuleForm.cottonCarding.name + '/' : ''}${(dynamicValidateFormRuleForm && dynamicValidateFormRuleForm.spinning) ? dynamicValidateFormRuleForm.spinning.name + '/' : ''}${data ? data.name : ''}` }
          )
        }
      },
      {
        prop: 'name',
        itemType: 'input',
        label: '组合名称',
        disabled: true
      },
      {
        prop: 'abbr',
        itemType: 'input',
        label: '简称',
        clearable: true,
        placeholder: '请输入两位大写字母',
        maxlength: 2,
        trim: ruleTrim,
        rules: [commonBlurReg, { validator: checkAttributeCombining, trigger: 'change' }]
      },
      {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        label: '备注',
        maxlength: 100,
        trim: (value) => {
          return value
        },
        rules: [{ min: 0, max: 100, message: '长度在0 到100 个字符', trigger: 'blur' }]
      }
    ]
    // 纱线等级的弹窗
    const yarnGradeContent = [
      {
        prop: 'code',
        itemType: 'input',
        label: '序号',
        disabled: true
      },
      {
        prop: 'name',
        itemType: 'input',
        label: '纱线等级',
        clearable: true,
        placeholder: '请输入大写字母或者数字',
        maxlength: 5,
        trim: ruleTrimYarn,
        rules: [commonBlurReg, { validator: checkYarnGrade, trigger: 'change' }]
      },
      {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        label: '备注',
        maxlength: 100,
        trim: (value) => {
          return value
        },
        rules: [{ min: 0, max: 100, message: '长度在0 到100 个字符', trigger: 'blur' }]
      }
    ]
    // 带实际支数的列表
    const columns = [
      {
        prop: 'code',
        label: '序号',
        width: '70'
      },
      {
        prop: 'name',
        label: '名称',
        showOverflowTooltip: true
      },
      {
        prop: 'actualNumber',
        label: '实际支数',
        showOverflowTooltip: true
      },
      {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true
      },
      {
        prop: 'enabled',
        label: '启用/禁用',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'basic:yarnTypes:enabled',
          changeStatus: (scope) => {
            this.enableStatus({ id: scope.row.id }, scope)
          }
        }
      },
      {
        prop: 'status.describe',
        label: '状态',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.status.describe
        }
      }
    ]
    // 不带简称的列表
    const simpleColumns = [
      {
        prop: 'code',
        label: '序号',
        width: '70'
      },
      {
        prop: 'name',
        label: '中文名',
        showOverflowTooltip: true
      },
      {
        prop: 'nameEn',
        label: '英文名',
        showOverflowTooltip: true
      },
      {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true
      },
      {
        prop: 'enabled',
        label: '启用/禁用',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'basic:yarnTypes:enabled',
          changeStatus: (scope) => {
            this.enableStatus({ id: scope.row.id }, scope)
          }
        }
      },
      {
        prop: 'status.describe',
        label: '状态',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.status.describe
        }
      }
    ]
    // 带简称的列表
    const shortColumns = [
      {
        prop: 'code',
        label: '序号',
        width: '70'
      },
      {
        prop: 'name',
        label: '中文名',
        showOverflowTooltip: true
      },
      {
        prop: 'nameEn',
        label: '英文名',
        showOverflowTooltip: true
      },
      {
        prop: 'abbr',
        label: '简称'
      },
      {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true
      },
      {
        prop: 'enabled',
        label: '启用/禁用',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'basic:yarnTypes:enabled',
          changeStatus: (scope) => {
            this.enableStatus({ id: scope.row.id }, scope)
          }
        }
      },
      {
        prop: 'status.describe',
        label: '状态',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.status.describe
        }
      }
    ]
    // 属性组合列表
    const attributeCombiningColumns = [
      {
        prop: 'code',
        label: '序号',
        width: '70'
      },
      {
        prop: 'name',
        label: '组合名称'
      },
      {
        prop: 'abbr',
        label: '简称'
      },
      {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true
      },
      {
        prop: 'enabled',
        label: '启用/禁用',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'basic:yarnTypes:enabled',
          changeStatus: (scope) => {
            this.enableStatus({ id: scope.row.id }, scope)
          }
        }
      },
      {
        prop: 'status.describe',
        label: '状态',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.status.describe
        }
      }
    ]
    // 纱线等级列表
    const yarnGradeColumns = [
      {
        prop: 'code',
        label: '序号',
        width: '70'
      },
      {
        prop: 'name',
        label: '纱线等级'
      },
      {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true
      },
      {
        prop: 'enabled',
        label: '启用/禁用',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'basic:yarnTypes:enabled',
          changeStatus: (scope) => {
            this.enableStatus({ id: scope.row.id }, scope)
          }
        }
      },
      {
        prop: 'status.describe',
        label: '状态',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.status.describe
        }
      }
    ]
    let popOperatesDataSource = [
      {
        label: '审核',
        permitTag: ['basic:yarnTypes:approve'],
        isShow: (scope) => {
          return scope.row.status.code === 'B'
        },
        handle: scope => {
          this.$confirm('确认审核当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
            customClass: 'customClass'
          })
            .then(() => {
              this.approveGroup(scope.row.id)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消审核'
              })
            })
        }
      },
      {
        label: '编辑',
        permitTag: ['basic:yarnTypes:update'],
        isShow: true,
        handle: scope => {
          this.type = 'edit'
          if (this.activeName === '纱支') {
            if (scope.row.status.code === 'P') {
              this.$set(this.yarnConutContent[1], 'disabled', true)
              this.$set(this.yarnConutContent[2], 'disabled', true)
              this.$set(this.yarnConutContent[3], 'disabled', true)
            } else {
              this.$set(this.yarnConutContent[1], 'disabled', false)
              this.$set(this.yarnConutContent[2], 'disabled', false)
              this.$set(this.yarnConutContent[3], 'disabled', false)
            }
            this.setPopDialogHandle(`编辑${this.activeName}`, 'yarnCountPopOptions')
          } else if (this.activeName === '细度') {
            if (scope.row.status.code === 'P') {
              this.$set(this.yarnFinenessContent[1], 'disabled', true)
              this.$set(this.yarnFinenessContent[2], 'disabled', true)
              this.$set(this.yarnFinenessContent[3], 'disabled', true)
            } else {
              this.$set(this.yarnFinenessContent[1], 'disabled', false)
              this.$set(this.yarnFinenessContent[2], 'disabled', false)
              this.$set(this.yarnFinenessContent[3], 'disabled', false)
            }
            this.setPopDialogHandle(`编辑${this.activeName}`, 'yarnFinenessPopOptions')
          } else if (this.activeName === '纺纱方法' || this.activeName === '梳棉方法' || this.activeName === '捻向' || this.activeName === '特殊纱线') {
            if (scope.row.status.code === 'P') {
              this.$set(this.shortContent[1], 'disabled', true)
              this.$set(this.shortContent[2], 'disabled', true)
              this.$set(this.shortContent[3], 'disabled', true)
            } else {
              this.$set(this.shortContent[1], 'disabled', false)
              this.$set(this.shortContent[2], 'disabled', false)
              this.$set(this.shortContent[3], 'disabled', false)
            }
            this.setPopDialogHandle(`编辑${this.activeName}`, 'shortPopOptions')
          } else if (this.activeName === '属性组合') {
            if (scope.row.status.code === 'P') {
              this.$set(this.attributeCombiningContent[1], 'disabled', true)
              this.$set(this.attributeCombiningContent[2], 'disabled', true)
              this.$set(this.attributeCombiningContent[3], 'disabled', true)
              this.$set(this.attributeCombiningContent[5], 'disabled', true)
            } else {
              this.$set(this.attributeCombiningContent[1], 'disabled', false)
              this.$set(this.attributeCombiningContent[2], 'disabled', false)
              this.$set(this.attributeCombiningContent[3], 'disabled', false)
              this.$set(this.attributeCombiningContent[5], 'disabled', false)
            }
            this.setPopDialogHandle(`编辑${this.activeName}`, 'attributeCombiningPopOptions')
          } else if (this.activeName === '纱线等级') {
            if (scope.row.status.code === 'P') {
              this.$set(this.yarnGradeContent[1], 'disabled', true)
            } else {
              this.$set(this.yarnGradeContent[1], 'disabled', false)
            }
            this.setPopDialogHandle(`编辑${this.activeName}`, 'yarnGradePopOptions')
          } else {
            if (scope.row.status.code === 'P') {
              this.$set(this.simpleContent[1], 'disabled', true)
              this.$set(this.simpleContent[2], 'disabled', true)
            } else {
              this.$set(this.simpleContent[1], 'disabled', false)
              this.$set(this.simpleContent[2], 'disabled', false)
            }
            this.setPopDialogHandle(`编辑${this.activeName}`, 'simplePopOptions')
          }
          this.getGroupInfo({ id: scope.row.id }, scope.row.code)
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['basic:yarnTypes:destroy'],
        isShow: (scope) => {
          return scope.row.status.code === 'B'
        },
        handle: scope => {
          this.$confirm('确认删除当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
            customClass: 'customClass'
          })
            .then(() => {
              this.deleteGroup(scope.row.id)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        }
      }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '240',
      dataSource: popOperatesDataSource
    }
    // 纱支新增编辑
    const yarnCountPopOptions = {
      itemType: 'drawer',
      visible: false,
      titile: '新增',
      okText: '保存',
      ok: params => {
        this.addOrModifyGroup(params)
      },
      beforeClose: (form, formDatas) => {
        const params = formDatas()
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      cancel: (params) => {
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      formDatas: {},
      formOptions: {},
      content: yarnConutContent
    }
    // 细度新增编辑
    const yarnFinenessPopOptions = {
      itemType: 'drawer',
      visible: false,
      titile: '新增',
      okText: '保存',
      ok: params => {
        this.addOrModifyGroup(params)
      },
      beforeClose: (form, formDatas) => {
        const params = formDatas()
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      cancel: (params) => {
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      formDatas: {},
      formOptions: {},
      content: yarnFinenessContent
    }
    // const popOptions = {
    //   itemType: 'drawer',
    //   visible: false,
    //   titile: '新增',
    //   okText: '保存',
    //   ok: params => {
    //     this.addOrModifyGroup(params)
    //   },
    //   beforeClose: (form, formDatas) => {
    //     const params = formDatas()
    //     const flag = dataComparision(this.oldForm, params, this.type)
    //     this.CompaCallback(flag)
    //   },
    //   cancel: (params) => {
    //     const flag = dataComparision(this.oldForm, params, this.type)
    //     this.CompaCallback(flag)
    //   },
    //   formDatas: {},
    //   formOptions: {},
    //   content: content
    // }
    // 不带简称新增保存
    const simplePopOptions = {
      itemType: 'drawer',
      visible: false,
      titile: '新增',
      okText: '保存',
      ok: params => {
        this.addOrModifyGroup(params)
      },
      beforeClose: (form, formDatas) => {
        const params = formDatas()
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      cancel: (params) => {
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      formDatas: {},
      formOptions: {},
      content: simpleContent
    }
    // 带简称新增保存
    const shortPopOptions = {
      itemType: 'drawer',
      visible: false,
      titile: '新增',
      okText: '保存',
      ok: params => {
        this.addOrModifyGroup(params)
      },
      beforeClose: (form, formDatas) => {
        const params = formDatas()
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      cancel: (params) => {
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      formDatas: {},
      formOptions: {},
      content: shortContent
    }
    // 属性组合新增
    const attributeCombiningPopOptions = {
      itemType: 'drawer',
      visible: false,
      titile: '新增',
      okText: '保存',
      ok: params => {
        this.addOrModifyGroup(params)
      },
      beforeClose: (form, formDatas) => {
        const params = formDatas()
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      cancel: (params) => {
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      formDatas: {},
      formOptions: {},
      content: attributeCombiningContent
    }
    // 不带简称新增保存
    const yarnGradePopOptions = {
      itemType: 'drawer',
      visible: false,
      titile: '新增',
      okText: '保存',
      ok: params => {
        this.addOrModifyGroup(params)
      },
      beforeClose: (form, formDatas) => {
        const params = formDatas()
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      cancel: (params) => {
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      formDatas: {},
      formOptions: {},
      content: yarnGradeContent
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getListData({ pageSize: this.pagination.pageSize || 20, page: val })
      },
      sizeChange: val => {
        this.getListData({ page: this.pagination.page || 1, pageSize: val })
      }
    }
    return {
      name: '',
      nameNum: '',
      secondNum: '',
      secondSelectNum: null,
      nameValue: '',
      unit: 'S',
      num: 1,
      actualNumber: '',
      formOtions: {
        size: 'small',
        inline: true
      },
      formDatas: {
        name: '',
        enabled: ''
      },
      searchData,
      // searchFormDatas: {},
      columns,
      simpleColumns,
      shortColumns,
      attributeCombiningColumns,
      yarnGradeColumns,
      popOperates,
      yarnConutContent,
      yarnFinenessContent,
      content,
      yarnGradeContent,
      simpleContent,
      shortContent,
      attributeCombiningContent,
      pagination,
      yarnCountPopOptions,
      yarnFinenessPopOptions,
      // popOptions,
      simplePopOptions,
      shortPopOptions,
      attributeCombiningPopOptions,
      yarnGradePopOptions,
      dataSource: [],
      categoryId: '',
      activeName: '',
      activeIndex: 0,
      fatherActiveName: '',
      fatherActiveIndex: 0,
      sonTabOption: [],
      tabData: [],
      pamraskey: [],
      oldForm: {} // 旧详情数据
    }
  },
  created() {
    this.getTabData()
  },
  methods: {
    /**
     * @description 弹窗展开与关闭
     */
    setPopDialogHandle(val, type) {
      this.$set(this[type], 'visible', !this[type].visible)
      if (val) {
        this.$set(this[type], 'title', val)
      }
    },
    // 点击编辑时处理数据
    setFormDatas(params) {
      setTimeout(() => {
        if (this.activeName === '纱支') {
          this.$set(this.yarnCountPopOptions, 'formDatas', params)
        } else if (this.activeName === '细度') {
          this.$set(this.yarnFinenessPopOptions, 'formDatas', params)
        } else if (this.activeName === '纺纱方法' || this.activeName === '梳棉方法' || this.activeName === '捻向' || this.activeName === '特殊纱线') {
          this.$set(this.shortPopOptions, 'formDatas', params)
        } else if (this.activeName === '属性组合') {
          this.$set(this.attributeCombiningPopOptions, 'formDatas', params)
        } else if (this.activeName === '纱线等级') {
          this.$set(this.yarnGradePopOptions, 'formDatas', params)
        } else {
          this.$set(this.simplePopOptions, 'formDatas', params)
        }
      }, 0)
    },
    // 获取纱属性页签数据
    async getTabData(data = {}) {
      const res = await sysDataGroupCategory(data)
      this.tabData = res.data || []
      this.fatherActiveName = this.tabData[0].name || ''
      this.sonTabOption = this.tabData[0].children || []
      this.activeName = this.sonTabOption[0].name || ''
      this.categoryId = this.sonTabOption[0].id || ''
      this.getListData()
    },
    // 列表数据
    async getListData(data = {}) {
      const res = await sysDataGroupPage({ ...data, ...this.formDatas, categoryId: this.categoryId })
      res.data && res.data.list && res.data.list.map((item, index) => {
        item.code = res.data.total - ((res.data.page - 1) * res.data.pageSize + index)
      })
      const dataList = res.data ? res.data.list : []
      this.dataSource = dataList
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.page,
        pageSize: res.data.pageSize,
        page: res.data.page
      }
    },
    // 一级tab切换
    fatherHandleClick(e) {
      this.resetSearchData()
      if (this.tabData[e.index].name !== '特殊纱线') {
        this.fatherActiveIndex = e.index
        this.sonTabOption = this.tabData[e.index].children
        this.activeIndex = 0
        this.activeName = this.sonTabOption[this.activeIndex].name
        this.categoryId = this.sonTabOption[this.activeIndex].id
        this.getListData()
      } else {
        this.fatherActiveIndex = e.index
        this.sonTabOption = []
        this.activeIndex = this.tabData.length - 1
        this.activeName = '特殊纱线'
        this.categoryId = this.tabData[e.index].id
        this.getListData()
      }
      this.setPlaceholder(this.activeName)
    },
    // 二级tab切换
    sonHandleClick(e) {
      this.resetSearchData()
      this.activeIndex = e.index
      this.categoryId = this.sonTabOption[this.activeIndex].id
      this.getListData()
      this.setPlaceholder(this.activeName)
    },
    // 切换tab页签清空搜索栏内容
    resetSearchData() {
      // this.searchFormDatas = {}
      this.formDatas = {}
      this.$set(this.formDatas, 'name', '')
      this.$set(this.formDatas, 'enabled', '')
    },
    // 切换tab页签设置搜索栏的placeholder
    setPlaceholder(name) {
      if (name === '纱支' || name === '细度') {
        this.$set(this.searchData[0], 'placeholder', '名称')
      } else {
        this.$set(this.searchData[0], 'placeholder', '中文名/英文名')
      }
    },
    // 点击新增
    addClick() {
      this.resetData()
      this.type = 'add'
      const elArr = ['yarnCountPopOptions', 'yarnFinenessPopOptions', 'shortPopOptions', 'attributeCombiningPopOptions', 'simplePopOptions', 'yarnGradePopOptions']
      this.setDataStaus(elArr, 'formDatas', {})
      if (this.activeName === '纱支') {
        this.oldForm = this.yarnConutContent.formDatas || {}
        this.setPopDialogHandle(`新增${this.activeName}`, 'yarnCountPopOptions')
        this.$set(this.yarnConutContent[1], 'disabled', false)
        this.$set(this.yarnConutContent[2], 'disabled', false)
        this.$set(this.yarnConutContent[3], 'disabled', false)
        this.setFormDatas({ unit: 'S' })
        this.setFormDatas({ num: 1 })
      } else if (this.activeName === '细度') {
        this.oldForm = this.yarnFinenessContent.formDatas || {}
        this.setPopDialogHandle(`新增${this.activeName}`, 'yarnFinenessPopOptions')
        this.$set(this.yarnFinenessContent[1], 'disabled', false)
        this.$set(this.yarnFinenessContent[2], 'disabled', false)
        this.$set(this.yarnFinenessContent[3], 'disabled', false)
      } else if (this.activeName === '纺纱方法' || this.activeName === '梳棉方法' || this.activeName === '捻向' || this.activeName === '特殊纱线') {
        this.oldForm = this.shortContent.formDatas || {}
        this.setPopDialogHandle(`新增${this.activeName}`, 'shortPopOptions')
        this.$set(this.shortContent[1], 'disabled', false)
        this.$set(this.shortContent[2], 'disabled', false)
        this.$set(this.shortContent[3], 'disabled', false)
      } else if (this.activeName === '属性组合') {
        this.oldForm = this.attributeCombiningContent.formDatas || {}
        this.setPopDialogHandle(`新增${this.activeName}`, 'attributeCombiningPopOptions')
        this.$set(this.attributeCombiningContent[1], 'disabled', false)
        this.$set(this.attributeCombiningContent[2], 'disabled', false)
        this.$set(this.attributeCombiningContent[3], 'disabled', false)
        this.$set(this.attributeCombiningContent[5], 'disabled', false)
      } else if (this.activeName === '纱线等级') {
        this.oldForm = this.yarnGradeContent.formDatas || {}
        this.setPopDialogHandle(`新增${this.activeName}`, 'yarnGradePopOptions')
        this.$set(this.yarnGradeContent[1], 'disabled', false)
      } else {
        this.oldForm = this.simpleContent.formDatas || {}
        this.setPopDialogHandle(`新增${this.activeName}`, 'simplePopOptions')
        this.$set(this.simpleContent[1], 'disabled', false)
        this.$set(this.simpleContent[2], 'disabled', false)
      }
    },
    // 清数据
    resetData() {
      this.name = ''
      this.nameNum = ''
      this.secondNum = ''
      this.secondSelectNum = null
      this.nameValue = ''
      this.unit = 'S'
      this.num = 1
      this.actualNumber = ''
    },
    // 新增或编辑
    addOrModifyGroup(params) {
      if (this.type === 'add') {
        const obj = {}
        if (this.activeName === '纱支') {
          this.pamraskey = ['name', 'remark']
        } else if (this.activeName === '细度') {
          this.pamraskey = ['name', 'remark']
        } else if (this.activeName === '纺纱方法' || this.activeName === '梳棉方法' || this.activeName === '捻向' || this.activeName === '特殊纱线') {
          this.pamraskey = ['name', 'nameEn', 'abbr', 'remark']
        } else if (this.activeName === '属性组合') {
          this.pamraskey = ['name', 'cottonCardingUuid', 'spinningUuid', 'yarnFabricUuid', 'remark', 'abbr']
        } else if (this.activeName === '纱线等级') {
          this.pamraskey = ['name', 'remark']
        } else {
          this.pamraskey = ['name', 'nameEn', 'remark']
        }
        this.pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addGroup(obj)
      } else if (this.type === 'edit') {
        const obj = {}
        if (this.activeName === '纱支') {
          this.pamraskey = ['id', 'name', 'remark']
        } else if (this.activeName === '细度') {
          this.pamraskey = ['id', 'name', 'remark']
        } else if (this.activeName === '纺纱方法' || this.activeName === '梳棉方法' || this.activeName === '捻向' || this.activeName === '特殊纱线') {
          this.pamraskey = ['id', 'name', 'nameEn', 'abbr', 'remark']
        } else if (this.activeName === '属性组合') {
          this.pamraskey = ['id', 'yarnTypeId', 'name', 'cottonCardingUuid', 'spinningUuid', 'yarnFabricUuid', 'remark', 'abbr']
        } else if (this.activeName === '纱线等级') {
          this.pamraskey = ['id', 'name', 'remark']
        } else {
          this.pamraskey = ['id', 'name', 'nameEn', 'remark']
        }
        this.pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.editGroup(obj)
      }
    },
    // 新增保存
    async addGroup(data = {}) {
      const res = await sysDataGroupAdd({ ...data, categoryId: this.categoryId })
      if (res.code !== 200) {
        return false
      }
      const elArr = ['yarnCountPopOptions', 'yarnFinenessPopOptions', 'shortPopOptions', 'attributeCombiningPopOptions', 'simplePopOptions', 'yarnGradePopOptions']
      this.setDataStaus(elArr, 'visible', false)
      this.$message.success('添加成功')
      this.getListData()
    },
    // 编辑保存
    async editGroup(data = {}) {
      const res = await sysDataGroupModify({ ...data, categoryId: this.categoryId })
      if (res.code !== 200) {
        return false
      }
      const elArr = ['yarnCountPopOptions', 'yarnFinenessPopOptions', 'shortPopOptions', 'attributeCombiningPopOptions', 'simplePopOptions', 'yarnGradePopOptions']
      this.setDataStaus(elArr, 'visible', false)
      this.$message.success('修改成功')
      this.getListData({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 启用、禁用
    enableStatus(data = {}, scope) {
      sysDataGroupEnabled(data).then(res => {
        this.$message({
          message: res.message ? res.message : '更新状态成功',
          type: 'success'
        })
      }).catch(() => {
        scope.row.enabled.code = scope.row.enabled.code === 'Y' ? 'N' : 'Y'
      })
    },
    // 删除
    async deleteGroup(id) {
      const res = await sysDataGroupDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功')
      this.getListData({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 审核
    async approveGroup(id) {
      const res = await sysDataGroupApprove({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message.success('审核成功')
      this.getListData({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 详情
    async getGroupInfo(data = {}, code) {
      const res = await sysDataGroupDetail(data)
      if (res.code !== 200) {
        return false
      }
      const dataList = res.data || {}
      // this.oldForm = { ...dataList, code: code }
      if (this.activeName === '纱支') {
        if (dataList.name) {
          this.nameNum = parseInt(dataList.name.match(/\d+/)[0])
          this.unit = dataList.name.match(/[a-z]/ig)[0]
          this.num = parseInt(dataList.name.split('/')[1])
        }
        this.oldForm = {
          ...dataList,
          code: code,
          nameNum: this.nameNum,
          unit: this.unit || '',
          num: this.num
        }
        this.setFormDatas({
          ...dataList,
          code: code,
          nameNum: this.nameNum,
          unit: this.unit || '',
          num: this.num
        })
      } else if (this.activeName === '细度') {
        if (dataList.name) {
          const arr = dataList.name.split('/')
          const length = arr.length
          if (length && length === 1) {
            this.nameNum = arr[0].substr(0, arr[0].length - 1)
            this.secondNum = ''
            this.secondSelectNum = null
          } else if (length && length === 2) {
            this.nameNum = arr[0].substr(0, arr[0].length - 1)
            if (arr[1].length > 1) {
              this.secondNum = arr[1].substr(0, arr[1].length - 1)
              this.secondSelectNum = null
            } else {
              this.secondNum = ''
              this.secondSelectNum = arr[1]
            }
          } else if (length && length === 3) {
            this.nameNum = arr[0].substr(0, arr[0].length - 1)
            this.secondNum = arr[1].substr(0, arr[1].length - 1)
            this.secondSelectNum = arr[2]
          } else {
            this.nameNum = ''
            this.secondNum = ''
            this.secondSelectNum = null
          }
        }
        this.oldForm = {
          ...dataList,
          code: code,
          nameNum: this.nameNum,
          secondNum: this.secondNum,
          secondSelectNum: this.secondSelectNum
        }
        this.setFormDatas({
          ...dataList,
          code: code,
          nameNum: this.nameNum,
          secondNum: this.secondNum,
          secondSelectNum: this.secondSelectNum
        })
      } else if (this.activeName === '属性组合') {
        this.getattributeCombiningPopOpData({ categoryId: 3 }, 1)
        this.getattributeCombiningPopOpData({ categoryId: 2 }, 2)
        this.getattributeCombiningPopOpData({ categoryId: 1 }, 3)
        this.oldForm = {
          ...dataList,
          code: code,
          yarnTypeId: dataList.yarnTypeId,
          spinningUuid: dataList.spinning && dataList.spinning.uuid ? dataList.spinning.uuid : 0,
          yarnFabricUuid: dataList.yarnFabric && dataList.yarnFabric.uuid ? dataList.yarnFabric.uuid : 0,
          cottonCardingUuid: dataList.cottonCarding && dataList.cottonCarding.uuid ? dataList.cottonCarding.uuid : 0
        }
        this.setFormDatas({
          ...dataList,
          code: code,
          yarnTypeId: dataList.yarnTypeId,
          spinningUuid: dataList.spinning && dataList.spinning.uuid ? dataList.spinning.uuid : 0,
          yarnFabricUuid: dataList.yarnFabric && dataList.yarnFabric.uuid ? dataList.yarnFabric.uuid : 0,
          cottonCardingUuid: dataList.cottonCarding && dataList.cottonCarding.uuid ? dataList.cottonCarding.uuid : 0
        })
      } else {
        this.oldForm = {
          ...dataList,
          code: code
        }
        this.setFormDatas({
          ...dataList,
          code: code
        })
      }
    },
    // 弹框取消数据比较回调
    CompaCallback(hadInput) {
      const elArr = ['yarnCountPopOptions', 'yarnFinenessPopOptions', 'shortPopOptions', 'attributeCombiningPopOptions', 'simplePopOptions', 'yarnGradePopOptions']
      if (hadInput) {
        this.$confirm('您已经输入内容，确认退出吗？', '提示', {
          type: 'warning',
          cancelButtonClass: 'btn-cancel'
        })
          .then(_ => {
            this.setDataStaus(elArr, 'visible', false)
          })
          .catch(_ => {
            if (this.activeName === '纱支') {
              this.$set(this.yarnCountPopOptions, 'visible', true)
            } else if (this.activeName === '细度') {
              this.$set(this.yarnFinenessPopOptions, 'visible', true)
            } else if (this.activeName === '纺纱方法' || this.activeName === '梳棉方法' || this.activeName === '捻向' || this.activeName === '特殊纱线') {
              this.$set(this.shortPopOptions, 'visible', true)
            } else if (this.activeName === '属性组合') {
              this.$set(this.attributeCombiningPopOptions, 'visible', true)
            } else if (this.activeName === '纱线等级') {
              this.$set(this.yarnGradePopOptions, 'visible', true)
            } else {
              this.$set(this.simplePopOptions, 'visible', true)
            }
          })
      } else {
        this.setDataStaus(elArr, 'visible', false)
      }
    },
    // 计算纱支实际支数
    setActualNum() {
      const reg = /^[1-9]\d*$/
      if (this.activeName === '纱支') {
        if (
          this.nameNum &&
          this.unit &&
          this.num &&
          parseInt(this.nameNum) !== 0 &&
          reg.test(this.nameNum)
        ) {
          this.nameValue = '' + this.nameNum + this.unit + '/' + this.num
          if (this.unit === 'S') {
            const number = parseInt(this.nameNum) / parseInt(this.num)
            this.actualNumber = Math.round(number * 100) / 100
          } else if (this.unit === 'N') {
            const number =
              (parseInt(this.nameNum) / parseInt(this.num)) *
              0.5831
            this.actualNumber = Math.round(number * 100) / 100
          }
          this.setFormDatas({ name: this.nameValue })
          this.setFormDatas({ actualNumber: this.actualNumber })
        } else {
          return false
        }
      } else if (this.activeName === '细度') {
        if (
          this.nameNum &&
          parseInt(this.nameNum) !== 0 &&
          reg.test(this.nameNum)
        ) {
          let flag = false
          if (
            this.secondNum &&
            parseInt(this.secondNum) !== 0 &&
            reg.test(this.secondNum)
          ) {
            flag = true
          }
          this.nameValue =
            '' +
            this.nameNum +
            'D' +
            (flag ? '/' : '') +
            (flag ? this.secondNum : '') +
            (flag ? 'F' : '') +
            (this.secondSelectNum ? '/' : '') +
            (this.secondSelectNum ? this.secondSelectNum : '')
          const num = this.secondSelectNum
            ? 5314.5 /
            parseInt(this.nameNum) /
            parseInt(this.secondSelectNum)
            : 5314.5 / parseInt(this.nameNum)
          this.actualNumber = Math.round(num * 100) / 100
          this.setFormDatas({ name: this.nameValue })
          this.setFormDatas({ actualNumber: this.actualNumber })
        } else {
          return false
        }
      }
    },
    // 名称修改
    nameChange(data) {
      this.nameNum = data
      this.setActualNum()
    },
    // 细度第二个框修改
    secondNumChange(data) {
      this.secondNum = data
      this.setActualNum()
    },
    // 单位S、N切换
    unitChange(data) {
      this.unit = data
      this.setActualNum()
    },
    // num数量切换
    numChange(data) {
      this.num = data
      this.setActualNum()
    },
    // 第二个数量切换
    secondSelectNumChange(data) {
      this.secondSelectNum = data
      this.setActualNum()
    },
    /**
     * @description 属性组合梳棉方法、纺纱方法、纱类下拉数据
     */
    async getattributeCombiningPopOpData(data, index) {
      const res = await attributeCombiningPopOpData({ enabled: 'Y', ...data })
      if (res.code !== 200) {
        return false
      }
      let dataSource = []
      if (res.data && res.data.length) {
        dataSource = res.data.map((item) => {
          item.label = item.name
          item.value = item
          return item
        })
      }
      this.$set(this.attributeCombiningContent[index], 'dataSource', dataSource)
    },
    /**
     * @description 通用设置
     */
    setDataStaus(dataSource = [], name, value) {
      dataSource.forEach(ele => {
        this.$set(this[ele], name, value)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.yarnAttribute {
  position: relative;
  padding: 20px;
  padding-bottom: 0;
  /deep/.el-tabs__nav-wrap {
    padding-left: 26px;
    background: #fff;
    &::after {
      height: 1px;
    }
  }
  /deep/ .el-tabs__header {
    margin-bottom: 1px;
  }
  /deep/ .el-tabs__item {
    height: 60px;
    line-height: 60px;
    padding: 0 26px;
  }
  .search{
    padding-left: 0;
  }
  .button {
    position: absolute;
    right: 40px;
    width: 68px;
    z-index: 8;
    top: 34px;
    button {
      width: 100%;
    }
  }
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
  /deep/.el-drawer__header {
    padding: 15px 20px;
    border: 1px solid #e9eff2;
    font-size: 18px;
    color: #151222;
  }
  /deep/.el-tabs__nav-next,
  /deep/.el-tabs__nav-prev {
    line-height: 60px;
  }
}
</style>

