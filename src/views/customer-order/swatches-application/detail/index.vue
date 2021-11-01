<!--
 * @Author: xj
 * @Description: 色板申请详情单/create
 * @Date: 2021-01-12 13:38:05
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-01-21 15:04:23
-->

<template>
  <div class="guest-sample">
    <!-- 头部状态 -->
    <printingtod :detail-objs="detailObj" />
    <!-- 基本信息 -->
    <print-info
      ref="printinfo"
      :detail-data="detailObj"
      :is-edits="isEdit"
      :setedittypes="setedittype"
    />
    <!-- 送客批色板要求: -->
    <div class="table-item">
      <div class="header-top">
        <span>送客批色板要求</span>
        <el-button
          v-if="isEdit"
          type="primary"
          size="mini"
          @click="addCheckRequ"
        >新增</el-button>
      </div>
      <div class="page-table detail">
        <cs-custom-table
          tooltip-effect="dark"
          :header-cell-style="headerCellStyle"
          :columns="checkRequColumns"
          :data-source="checkRequData"
          :operates="checkRequOperates"
          :pagination="pagination"
          edit-type="pop"
        />
      </div>
    </div>

    <!-- 用纱信息 -->
    <div class="table-item">
      <div class="header-top">
        <span>用纱信息</span>
        <el-button
          v-if="isEdit"
          type="primary"
          size="mini"
          @click="addInventory"
        >新增</el-button>
      </div>
      <div class="page-table detail">
        <cs-custom-table
          tooltip-effect="dark"
          :header-cell-style="headerCellStyle"
          :columns="inventoryColumns"
          :data-source="inventoryData"
          :operates="inventoryOperates"
          :pagination="pagination"
          edit-type="pop"
        />
      </div>
    </div>
    <!-- 颜色信息 -->
    <div class="table-item">
      <div class="header-top">
        <span>颜色信息</span>
        <el-button
          v-if="isEdit"
          type="primary"
          size="mini"
          @click="addColor"
        >新增</el-button>
      </div>
      <div class="page-table">
        <cs-custom-table
          tooltip-effect="dark"
          :header-cell-style="headerCellStyle"
          :columns="colorColumns"
          :data-source="colorData"
          :operates="colorOperates"
          :pagination="pagination"
          edit-type="pop"
        />
      </div>
    </div>
    <!-- 用纱侧边抽屉 -->
    <div class="pop">
      <cs-custom-pop ref="inventoryPop" :options="inventoryPopOptions" />
    </div>
    <!-- 颜色侧边抽屉 -->
    <div class="pop">
      <cs-custom-pop ref="colorPop" :options="colorPopOptions" />
    </div>
    <!--送客批色板要求侧边抽屉-->
    <div class="pop">
      <cs-custom-pop ref="checkRequPop" :options="checkRequPopOptions" />
    </div>
    <!-- 底部按钮 -->
    <div :class="{ 'fixed-footer': !sidebar }" class="button-group">
      <div v-if="!isEdit && detailObj.status === 0">
        <el-button
          v-permission="['customerOrder:colorModel:colorModelApply:modify']"
          type="primary"
          @click="setEdit"
        >编辑</el-button>
        <el-button
          v-permission="['customerOrder:colorModel:colorModelApply:delete']"
          @click="deleteClick"
        >删除</el-button>
        <el-button
          v-permission="['customerOrder:colorModel:colorModelApply:submit']"
          type="primary"
          @click="submitPrint"
        >提交</el-button>
        <el-button @click="copyPrint">复制</el-button>
      </div>
      <div v-if="!isEdit && detailObj.status === 1">
        <el-button type="primary" @click="copyPrint">复制</el-button>
        <el-button
          v-permission="['customerOrder:colorModel:colorModelApply:print']"
          type="primary"
          @click="printPreview"
        >打印预览</el-button>
        <el-button
          v-permission="['customerOrder:colorModel:colorModelApply:finish']"
          @click="finishPrintClick"
        >完结</el-button>
        <el-button
          v-permission="['customerOrder:colorModel:colorModelApply:cancel']"
          @click="cancelPrintClick"
        >取消生产</el-button>
      </div>
      <div v-if="!isEdit && (detailObj.status === 2 || detailObj.status === 3)">
        <el-button type="primary" @click="copyPrint">复制</el-button>
        <el-button
          v-permission="['customerOrder:colorModel:colorModelApply:print']"
          type="primary"
          @click="printPreview"
        >打印预览</el-button>
      </div>
      <div v-if="isEdit">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="saveClick">保存</el-button>
        <el-button
          v-permission="['customerOrder:colorModel:colorModelApply:submit']"
          type="primary"
          @click="submitPrint"
        >提交</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import printingtod from './components/printingtod'
import printInfo from './components/print-info'
import proCustom from './components/pro-ratio'
import { isArray } from '@/utils/validate'
import { PublicCustomer } from '@/views/customer-order/public/index'
import logMethods from '@/views/product-center/mixin/log-methods'
//
import {
  getAdd,
  getDetail,
  yarnSelect,
  getDelete,
  getModify,
  getFinish,
  getCancel,
  getSubmit,
  compositionSelect,
  zhCompositionSelect,
  clothSelect,
  singleDoubleDye,
  clothStandardConf
} from './api/index'
export default {
  name: 'PrintDetail',
  components: {
    printingtod,
    printInfo
  },
  mixins: [PublicCustomer, logMethods],
  data() { // 表格背景颜色
    const headerCellStyle = { background: '#F5F7FA' }
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 纱比
    const checkValues = (rule, value, callback) => {
      const reg = /^\d+\.?\d{0,2}$/
      if (value && !reg.test(value)) {
        return callback(new Error('数字类型，输入时最大允许录入两位小数'))
      } else if (parseInt(value) > 100) {
        return callback(new Error('最大值不能超过100'))
      } else if (!(value > 0)) {
        return callback(new Error('纱比请输入大于0的有效数值'))
      } else {
        callback()
      }
    }
    // 送客批色板要求的的分数验证
    const checkNum = (rule, value, callback) => {
      const reg = /^[1-9]\d*$/
      if (!value) {
        return callback(new Error('该项不能为空'))
      } else if (parseInt(value) === 0 || !reg.test(value)) {
        return callback(new Error('请输入有效的正整数'))
      } else if (parseInt(value) > 99) {
        return callback(new Error('请输入0~99之间的数字'))
      } else {
        callback()
      }
    }
    // 送客批色板要求表格
    const checkRequColumns = [
      {
        prop: 'index',
        label: '序号',
        width: '90',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      {
        prop: 'size',
        label: '要求尺寸',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.size ? scope.row.size : ''
        }
      },
      {
        prop: 'number',
        label: '份数',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.number ? scope.row.number : ''
        }
      }
    ]
    // 送客批色板要操作栏 checkRequOperates
    const naturalPopOperates = [
      {
        label: '编辑',
        isShow: true,
        handle: (scope) => {
          this.optionStatus = 'edit'
          this.CheckRequPopHandle('编辑送客批色板要求')
          this.setFormDatas(
            {
              ...scope.row,
              orderNo: scope.row.orderNo || 1, // 序号
              size: scope.row.size,
              number: scope.row.number
            }, 'CheckRequ')
        }
      },
      {
        label: '删除',
        isShow: true,
        style: { 'color': '#FE4949' },
        handle: (scope) => {
          this.deleteRowData(scope, 'CheckRequ')
        }
      }
    ]
    // 送客批色板要操作栏集合
    const checkRequOperates = {
      label: '操作',
      width: '240',
      fixed: 'right',
      dataSource: naturalPopOperates
    }
    // 送客批色板侧边抽屉 栏目
    const checkRequContent = [
      {
        prop: 'size',
        itemType: 'select',
        label: '要求尺寸',
        clearable: true,
        filterable: true,
        showOverflowTooltip: true,
        rules: [commonChangeReg, { required: true, message: '要求尺寸不能为空', trigger: ['change'] }],
        dataSource: [
          {
            value: '2"*2"',
            label: '2"*2"'
          },
          {
            value: '2.5"*2.5"',
            label: '2.5"*2.5"'
          },
          {
            value: '3"*3"',
            label: '3"*3"'
          },
          {
            value: '4"*4"',
            label: '4"*4"'
          },
          {
            value: '5"*5"',
            label: '5"*5"'
          },
          {
            value: '4cm*4cm',
            label: '4cm*4cm'
          },
          {
            value: '5cm*5cm',
            label: '5cm*5cm'
          },
          {
            value: '10cm*10cm',
            label: '10cm*10cm'
          }
        ]
      },
      {
        prop: 'number',
        itemType: 'input',
        maxlength: 100,
        label: '份数',
        rules: [{ required: true, message: '份数不能为空', trigger: ['change'] }, { validator: checkNum, trigger: 'blur' }]
      }
    ]

    // 送客批色板侧边抽屉集合
    const checkRequPopOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增用纱信息',
      okText: '保存',
      ok: (params) => {
        const addData = {
          orderNo: this.optionStatus === 'add' ? this.checkRequData.length + 1 : params.orderNo, // 序号
          size: params.size,
          number: params.number
        }
        if (this.optionStatus === 'add') {
          this.checkRequData.push(addData)
        } else {
          this.checkRequData.splice(params.orderNo - 1, 1, addData)
        }
        this.CheckRequPopHandle()
      },
      cancel: (params) => {
        this.CheckRequPopHandle()
      },
      formDatas: {},
      formOptions: {},
      content: checkRequContent
    }
    // 用纱信息 表格
    const inventoryColumns = [
      {
        prop: 'orderNo',
        label: '序号',
        width: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'yarn',
        label: '纱支',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarn ? scope.row.yarn.label : ''
        }
      },
      {
        prop: 'element',
        label: '成份',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.element ? scope.row.element.label : ''
        }
      },
      {
        prop: 'elementScale',
        label: '成份比例',
        showOverflowTooltip: true
      },
      {
        prop: 'spinningMethod',
        label: '纺纱方法',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.spinningMethod ? scope.row.spinningMethod.label : ''
        }
      },
      {
        prop: 'yarnScale',
        label: '纱比',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnScale
            ? scope.row.yarnScale + '%'
            : ''
        }
      }
    ]
    // 用纱信息操作栏
    const inventoryOperatesData = [
      {
        label: '编辑',
        isShow: true,
        handle: (scope) => {
          this.$set(this.inventoryContent[2], 'dataSource', [])
          if (parseInt(scope.row.elementType) === 1) {
            this.$set(this.inventoryContent[2], 'dataSource', this.getCompOneArray)
          } else if (parseInt(scope.row.elementType) === 2) {
            this.$set(this.inventoryContent[2], 'dataSource', this.getCompTwoArray)
          }
          this.optionStatus = 'edit'
          this.inventoryPopHandle('编辑用纱信息')
          this.setFormDatas(
            {
              ...scope.row,
              orderNo: scope.row.orderNo || 1, // 序号
              yarn: scope.row.yarn, // 纱支
              element: scope.row.element, // 成份
              elementScale: scope.row.elementScale, // 成份比例
              elementScaleList: scope.row.elementScaleList || [],
              spinningMethod: scope.row.spinningMethod, // 纺纱方法
              yarnScale: scope.row.yarnScale, // 纱比
              elementType: scope.row.elementType || 1 // 单选框
            },
            'inventory'
          )
        }
      },
      {
        label: '删除',
        isShow: true,
        style: { color: '#FE4949' },
        handle: (scope) => {
          this.deleteRowData(scope, 'inventory')
        }
      }
    ]
    // 用纱信息操作栏集合
    const inventoryOperates = {
      label: '操作',
      width: '240',
      fixed: 'right',
      dataSource: inventoryOperatesData
    }
    // 用纱信息侧边抽屉
    const inventoryContent = [
      {
        prop: 'yarn',
        itemType: 'select',
        label: '纱支',
        clearable: true,
        filterable: true,
        valueType: 'object',
        valueKey: 'value',
        itemStyle: { marginBottom: '12px' },
        className: 'commonRemoteSearch',
        rules: [commonChangeReg],
        visibleChange: (value) => {
          if (value) {
            this.getYarn()
          }
        },
        dataSource: []
      },
      {
        itemType: 'radio-group',
        prop: 'elementType',
        label: '',

        labelWidth: '80px',
        itemStyle: { marginBottom: '12px' },
        className: 'radioGroup',
        change: (value) => {
          const data = {
            ...this.$refs.inventoryPop.$refs.popComponents.$refs.customform
              .dynamicValidateFormRuleForm
          }
          data.element = '' // 成份
          data.elementScale = '' // 成份比例
          this.$set(this.inventoryPopOptions, 'formDatas', data)
          this.$set(this.inventoryContent[2], 'dataSource', [])
        },
        rules: [{ required: true, message: '请选择', trigger: ['change'] }],
        dataSource: [
          {
            value: '1',
            label: '单一成份'
          },
          {
            value: '2',
            label: '组合成份'
          }
        ]
      },
      {
        prop: 'element',
        itemType: 'select',
        label: '成份',
        clearable: true,
        filterable: true,
        valueType: 'object',
        className: 'commonRemoteSearch',
        rules: [commonChangeReg],
        change: (value, form, formDatas, setFormDatas, scope) => {
          if (!value || !value.label) {
            const data = {
              ...this.$refs.inventoryPop.$refs.popComponents.$refs.customform
                .dynamicValidateFormRuleForm
            }
            data.elementScale = ''
            data.elementScaleList = []
            this.$set(this.inventoryPopOptions, 'formDatas', data)
          } else if (value.ingredients && value.ingredients.length > 1) {
            setFormDatas({ elementScale: '', isEdit: true })
          } else {
            setFormDatas({ elementScale: '100', isEdit: true })
          }
        },
        visibleChange: (value) => {
          if (value) {
            this.getComposition(value)
          }
        },
        dataSource: []
      },
      {
        prop: 'elementScale',
        itemType: 'input',
        label: '成份比例',
        clearable: true,
        filterable: true,
        className: 'commonRemoteSearch',
        rules: [commonChangeReg],
        components: { proCustom }
      },
      {
        prop: 'spinningMethod',
        itemType: 'select',
        label: '纺纱方法:',
        clearable: true,
        filterable: true,
        valueType: 'object',
        valueKey: 'value',
        className: 'commonRemoteSearch',
        rules: [commonChangeReg],
        visibleChange: (value) => {
          if (value) {
            this.getCloth()
          }
        },
        dataSource: []
      },
      {
        prop: 'yarnScale',
        itemType: 'input',
        itemStyle: { width: '100%', display: 'inline-block' },
        label: '纱比',
        clearable: true,
        rules: [commonBlurReg, { validator: checkValues, trigger: 'blur' }]
      }
    ]
    // 用纱信息侧边抽屉集合
    const inventoryPopOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增用纱信息',
      okText: '保存',
      ok: (params) => {
        const that = this
        const addData = {
          orderNo:
            this.optionStatus === 'add'
              ? this.inventoryData.length + 1
              : params.orderNo, // 序号
          yarn: params.yarn, // 纱支
          element: params.element, // 成份
          elementScale: params.elementScale, // 成份比例
          elementScaleList: that.translationClick(params.element.ingredients || []),
          spinningMethod: params.spinningMethod, // 纺纱方法
          yarnScale: params.yarnScale, // 纱比
          elementType: params.elementType || 1 // 单选框成份类型 1单一2组合
        }
        // 单一和组合
        if (Number(addData.elementType) === 1) {
          addData.ingredientRatio = 100
        } else {
          const sm = addData.elementScale.split('/')
          addData.elementScaleList.length &&
            addData.elementScaleList.forEach((item, im) => {
              item.ingredientRatio = sm[im]
            })
        }
        if (this.optionStatus === 'add') {
          this.inventoryData.push(addData)
        } else {
          this.inventoryData.splice(params.orderNo - 1, 1, addData)
        }
        this.inventoryPopHandle()
      },
      cancel: (params) => {
        this.inventoryPopHandle()
      },
      formDatas: {},
      formOptions: {},
      content: inventoryContent
    }
    // 颜色表格
    const colorColumns = [
      {
        prop: 'orderNo',
        label: '#',
        width: '80'
      },
      {
        prop: 'customerColorName',
        label: '客户颜色',
        showOverflowTooltip: true
      },
      {
        prop: 'customerColorEname',
        label: '客户颜色(英文)',
        showOverflowTooltip: true
      },
      {
        prop: 'colorModelStandard',
        label: '对色标准',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.colorModelStandard
            ? scope.row.colorModelStandard.label
            : ''
        }
      },
      {
        prop: 'odDye',
        label: '单双染',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.odDye ? scope.row.odDye.label : ''
        }
      }
    ]
    // 颜色表格操作栏
    const colorOperatesData = [
      {
        label: '编辑',
        isShow: true,
        handle: (scope) => {
          // 防止用户删除 对色标准 单双染
          this.PreventUsers(scope)
          this.optionStatus = 'edit'
          this.colorPopHandle('编辑颜色信息')
          this.setFormDatas({ ...scope.row }, 'color')
        }
      },
      {
        label: '删除',
        isShow: true,
        style: { color: '#FE4949' },
        handle: (scope) => {
          this.deleteRowData(scope, 'color')
        }
      }
    ]
    // 颜色表格操作栏集合
    const colorOperates = {
      label: '操作',
      width: '240',
      fixed: 'right',
      dataSource: colorOperatesData
    }
    // 颜色信息侧边抽屉
    const colorContent = [
      {
        prop: 'customerColorName',
        itemType: 'input',
        label: '客户颜色',
        clearable: true,
        maxlength: 100,
        rules: [
          commonBlurReg,
          { required: true, message: '客户颜色不能为空', trigger: ['blur'] }
        ]
      },
      {
        prop: 'customerColorEname',
        itemType: 'input',
        maxlength: 100,
        label: '客户颜色(英文)'
      },
      {
        prop: 'colorModelStandard',
        itemType: 'select',
        label: '对色标准',
        clearable: true,
        filterable: true,
        valueType: 'object',
        valueKey: 'value',
        className: 'commonRemoteSearch',
        rules: [{ required: true, message: '对色标准不能为空', trigger: 'change' }],
        visibleChange: (value) => {
          if (value) {
            this.getYarnOne()
          }
        },
        dataSource: []
      },
      {
        prop: 'odDye',
        itemType: 'select',
        label: '单双染',
        clearable: true,
        filterable: true,
        valueType: 'object',
        valueKey: 'value',
        className: 'commonRemoteSearch',
        rules: [{ required: true, message: '单双染不能为空', trigger: 'change' }],
        visibleChange: (value) => {
          if (value) {
            this.getYarnTwo()
          }
        },
        dataSource: []
      }
    ]
    // 颜色信息侧边抽屉集合
    const colorPopOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增颜色信息',
      okText: '保存',
      ok: (params) => {
        const addData = {
          orderNo:
            this.optionStatus === 'add'
              ? this.colorData.length + 1
              : params.orderNo,
          customerColorName: params.customerColorName, // 客户颜色
          customerColorEname: params.customerColorEname, // 客户颜色(英文)
          colorModelStandard: params.colorModelStandard, // 对色标准
          odDye: params.odDye // 单双染
        }
        if (this.optionStatus === 'add') {
          this.colorData.push(addData)
        } else {
          this.colorData.splice(params.orderNo - 1, 1, addData)
        }
        this.colorPopHandle()
      },
      cancel: (params) => {
        this.colorPopHandle()
      },
      formDatas: {},
      formOptions: {},
      content: colorContent
    }
    //  用纱信息 分页配置信息
    const pagination = {
      currentChange: (val) => {
        this.getListData({
          pageSize: this.pagination.pageSize || 20,
          page: val
        })
      },
      sizeChange: (val) => {
        this.getListData({ page: this.pagination.page || 1, pageSize: val })
      }
    }
    return {
      isCopy: false,
      isEdit: true,
      detailObj: {}, // 全局数据源
      headerCellStyle, // 表格颜色
      inventoryColumns, // 用纱信息数据表格字段
      inventoryData: [], // 用纱信息循环数据
      inventoryOperates, // 用纱信息操作栏
      inventoryContent, // 用纱侧边抽屉列表
      inventoryOperatesData,
      inventoryPopOptions, // 用纱侧边抽屉 保存按钮
      pagination, // 分页信息
      optionStatus: '', // 新增状态
      compositionData: [], // 库存成份下拉
      clothData: [], // 纺纱方法下拉
      colorColumns, // 颜色信息表格
      colorPopOptions, // 颜色信息侧边抽屉列表
      colorOperatesData, // 颜色表格 操作栏
      colorOperates, // 颜色表格 操作栏集合
      colorData: [], // 颜色信息表格数据
      colorContent, // 颜色信息侧边抽屉列表
      copyDetailData: {}, // 拷贝数据
      checkRequColumns, // 送客批色板要求表格
      checkRequData: [], // 送客批色板要求数据源
      naturalPopOperates,
      checkRequContent,
      checkRequOperates, // 送客批色板要求操作栏集合
      checkRequPopOptions, // 送客批色板要求 保存按钮
      setedittype: '',
      getCompOneArray: [], // 单一组合成份
      getCompTwoArray: [], // 组合成份
      odDyeList: [], // 单双染
      colorModelStandardList: [], // 对色标准
      saveClickType: true, // 保存可以提交按钮
      submitPrintType: true // 是否可以提交交按钮
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar.opened
    }
  },
  created() {
    this.getYarn() // 用纱信息纱支下拉
    this.getComposition() // 用纱信息成份下拉
    this.getCompOne() // 单一
    this.getCompOTwo()// 组合
    this.getCloth() // 用纱信息纺纱方法下拉
    this.getYarnTwo() // 颜色信息==>单双染下拉
    this.getYarnOne() // 对色标准
    // 表头数据回显有问题 尝试修复
    if (this.$route.params.id) {
      this.getDetailData(this.$route.params.id)
    }
    if (this.$route.params.id) {
      if (this.$route.path.includes('show')) {
        this.isEdit = false
        this.inventoryOperates = null
        this.colorOperates = null
        this.checkRequOperates = null
      } else {
        this.isEdit = true
        this.inventoryOperates = {
          label: '操作',
          width: '240',
          fixed: 'right',
          dataSource: this.inventoryOperatesData
        }
        this.colorOperates = {
          label: '操作',
          width: '240',
          fixed: 'right',
          dataSource: this.colorOperatesData
        }

        // 送客批色板要操作栏集合
        this.checkRequOperates = {
          label: '操作',
          width: '240',
          fixed: 'right',
          dataSource: this.naturalPopOperates
        }
      }
    } else {
      this.isEdit = true
      this.inventoryOperates = {
        label: '操作',
        width: '240',
        fixed: 'right',
        dataSource: this.inventoryOperatesData
      }
      this.colorOperates = {
        label: '操作',
        width: '240',
        fixed: 'right',
        dataSource: this.colorOperatesData
      }
      // 送客批色板要操作栏集合
      this.checkRequOperates = {
        label: '操作',
        width: '240',
        fixed: 'right',
        dataSource: this.naturalPopOperates
      }
    }
  },
  mounted() { },
  methods: {
    // 成分比例推送 id换成uuid
    translationClick(data) {
      if (data && data.length > 1) {
        data.forEach((item, ik) => {
          if (item.uuid) { // 后台不返回UUID，前端不改变纱支
            item.id = item.uuid || 0
          }
        })
      }
      return data
    },
    // 新增送客批色板要求
    addCheckRequ() {
      this.optionStatus = 'add'
      this.CheckRequPopHandle('新增送客批色板要求')
      this.$set(this.checkRequPopOptions, 'content', this.checkRequContent)
      this.$set(this.checkRequPopOptions, 'formDatas', {})
    },
    // 送客批色板要求弹窗显隐
    CheckRequPopHandle(val) {
      this.$set(this.checkRequPopOptions, 'visible', !this.checkRequPopOptions.visible)
      if (val) { this.$set(this.checkRequPopOptions, 'title', val) }
    },
    // 新增用纱信息
    addInventory() {
      this.optionStatus = 'add'
      this.inventoryPopHandle('新增用纱信息')
      this.setFormDatas({ elementType: '1', isEdit: this.isEdit }, 'inventory')
      this.$set(this.inventoryPopOptions, 'content', this.inventoryContent)
    },
    // 用纱信息弹窗显隐
    inventoryPopHandle(val) {
      this.$set(
        this.inventoryPopOptions,
        'visible',
        !this.inventoryPopOptions.visible
      )
      if (val) {
        this.$set(this.inventoryPopOptions, 'title', val)
      }
    },
    // 颜色弹窗显隐
    colorPopHandle(val) {
      this.$set(this.colorPopOptions, 'visible', !this.colorPopOptions.visible)
      if (val) {
        this.$set(this.colorPopOptions, 'title', val)
      }
    },
    // 点击编辑时处理数据
    setFormDatas(params, type) {
      setTimeout(() => {
        if (type === 'inventory') {
          this.$set(this.inventoryPopOptions, 'formDatas', params)
        } else if (type === 'color') {
          this.$set(this.colorPopOptions, 'formDatas', params)
        } else if (type === 'CheckRequ') {
          this.$set(this.checkRequPopOptions, 'formDatas', params)
        }
      }, 0)
    },
    // 用纱信息信息分页
    getListData() {
      console.log('Ssss用纱信息信息分页')
    },
    // 库存纱支下拉
    async getYarn() {
      const resYarnCount = await yarnSelect({ categoryId: '9' })
      if (resYarnCount.code !== 200) {
        return false
      }
      const yarnCount = resYarnCount.data || []
      yarnCount.length &&
        yarnCount.forEach((item) => {
          item.label = item.name
          item.value = item.uuid
        })
      this.$set(this.inventoryContent[0], 'dataSource', yarnCount)
    },
    // 颜色信息==>对色标准下拉
    async getYarnOne() {
      const resYarnCount = await clothStandardConf({ isEnable: 'Y' })
      if (resYarnCount.code !== 200) {
        return false
      }
      const yarnCount = resYarnCount.data || []
      yarnCount.length && yarnCount.forEach((item) => {
        item.label = item.name
        item.value = item.id
      })
      this.colorModelStandardList = yarnCount
      this.$set(this.colorContent[2], 'dataSource', yarnCount)
    },
    // 颜色信息==>单双染下拉
    async getYarnTwo() {
      const resYarnCount = await singleDoubleDye({})
      if (resYarnCount.code !== 200) {
        return false
      }
      const yarnCount = resYarnCount.data || []
      yarnCount.length &&
        yarnCount.forEach((item) => {
          item.label = item.name
          item.value = item.uuid
        })
      this.odDyeList = yarnCount
      this.$set(this.colorContent[3], 'dataSource', yarnCount)
    },
    // 单一请求
    async getCompOne() {
      const resComposition = await compositionSelect()
      if (resComposition.code !== 200) {
        return false
      }
      const composition = resComposition.data || []
      const compositionList =
        composition.length &&
        composition.map((item) => {
          const pm = []
          const sm = {
            id: item.uuid,
            ingredientRatio: '100',
            name: item.name,
            uuid: item.uuid
          }
          pm.push(sm)
          return {
            label: item.name,
            value: item.uuid,
            ingredients: pm
          }
        })
      this.getCompOneArray = compositionList
      this.$set(this.inventoryContent[2], 'dataSource', compositionList)
    },

    // 组合请求
    async getCompOTwo() {
      const resZhComposition = await zhCompositionSelect()
      if (resZhComposition.code !== 200) {
        return false
      }
      const zhComposition = resZhComposition.data || []
      const ZhcompositionList =
        zhComposition.length &&
        zhComposition.map((item) => {
          return {
            label: item.name,
            value: item.uuid,
            ingredients: item.ingredients || [],
            uuid: item.uuid
          }
        })
      this.getCompTwoArray = ZhcompositionList
      this.$set(this.inventoryContent[2], 'dataSource', ZhcompositionList)
    },

    // 库存成份下拉
    async getComposition(datas = '') {
      if (datas) {
        const sdata = this.$refs.inventoryPop
        const singlebox =
          (sdata &&
            sdata.$refs.popComponents.$refs.customform.dynamicValidateFormRuleForm.elementType) || 1
        if (Number(singlebox) === 1) {
          // 单一
          this.getCompOne()
        } else {
          this.getCompOTwo()
        }
      }
    },

    // 纺纱方法下拉
    async getCloth() {
      const res = await clothSelect({ enabled: 'Y', categoryId: 2 })
      if (res.code !== 200) {
        return false
      }
      this.clothData = res.data || []
      this.clothData.forEach((item, index) => {
        item.label = item.name
        item.value = item.uuid
      })
      this.$set(this.inventoryContent[4], 'dataSource', this.clothData)
    },
    // 新增颜色信息
    addColor() {
      this.optionStatus = 'add'
      this.colorPopHandle('新增颜色信息')
      this.$set(this.colorPopOptions, 'content', this.colorContent)
      this.$set(this.colorPopOptions, 'formDatas', {})
    },
    // 删除行数据
    deleteRowData(scope, type) {
      if (type === 'inventory') {
        this.$confirm('确认删除该条用纱信息？', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          cancelButtonClass: 'btn-cancel'
        })
          .then(() => {
            this.inventoryData.splice(scope.$index, 1)
            this.inventoryData.forEach((item, index) => {
              item.orderNo = index + 1
            })
          })
          .catch(() => {
            this.$message({ type: 'info', message: '已取消删除' })
          })
      } else if (type === 'color') {
        this.$confirm('确认删除该条颜色信息？', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          cancelButtonClass: 'btn-cancel'
        })
          .then(() => {
            this.colorData.splice(scope.$index, 1)
            this.colorData.forEach((item, index) => {
              item.orderNo = index + 1
            })
          })
          .catch(() => {
            this.$message({ type: 'info', message: '已取消删除' })
          })
      } else if (type === 'CheckRequ') {
        this.$confirm('确认删除该条送客批色板要求？', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          cancelButtonClass: 'btn-cancel'
        })
          .then(() => {
            this.checkRequData.splice(scope.$index, 1)
            this.checkRequData.forEach((item, index) => {
              item.orderNo = index + 1
            })
          })
          .catch(() => {
            this.$message({ type: 'info', message: '已取消删除' })
          })
      }
    },
    // 下拉字符串转数字
    getVluae(data) {
      if (data.value) {
        data.value = parseInt(data.value)
      }
      return data
    },
    // 获取详情数据
    async getDetailData(id) {
      const res = await getDetail({ id })
      this.detailObj = Object.assign({}, res.data) || {}
      this.detailObj.seller = this.getVluae(this.detailObj.seller) // 销售员
      this.detailObj.sellerTeam = this.getVluae(this.detailObj.sellerTeam) // 销售团队
      this.detailObj.customer = this.detailObj.customer // 客户
      this.detailObj.delivery = this.detailObj.delivery ? this.$filters.parseTime(this.detailObj.delivery) : '' // 交  期
      this.detailObj.cloth = this.detailObj.cloth // 布类
      this.detailObj.colorModelType = this.detailObj.colorModelType // 色板类型
      this.detailObj.endProductWeight = this.detailObj.endProductWeight // 成品克重
      this.detailObj.garmentPart = this.detailObj.garmentPart // 成衣部位
      this.detailObj.lstLightSource = this.detailObj.lstLightSource // lst对色光源
      this.detailObj.twondLightSource = this.detailObj.twondLightSource // 2nd对色光源
      this.detailObj.threerdLightSource = this.detailObj.threerdLightSource // 3rn对色光源
      this.detailObj.sellYear = this.detailObj.sellYear // 销售年度
      this.detailObj.sellQuarterly = this.detailObj.sellQuarterly // 销售季度
      if (this.detailObj.craftRequirementList && this.detailObj.craftRequirementList.length) {
        this.detailObj.craftRequirementList && this.detailObj.craftRequirementList.forEach((item, ix) => {
          if ( // 工艺要求
            item.type !== null &&
            item.type !== '' &&
            item.type !== undefined
          ) {
            item.type = parseInt(item.type)
          }
          if (
            item.parentUuid !== null &&
            item.parentUuid !== '' &&
            item.parentUuid !== undefined
          ) {
            item.parentUuid = parseInt(item.parentUuid)
          }
        })
      } else {
        this.detailObj.craftRequirementList = []
      }
      this.detailObj.attachmentList = this.detailObj.attachmentList || [] // 上传附件
      this.copyDetailData = JSON.parse(JSON.stringify(this.detailObj))
      const that = this
      this.detailObj.cmYarnUsed &&
        this.detailObj.cmYarnUsed.forEach((item, index) => {
          item.orderNo = index + 1 // 用纱信息
          item.yarn = that.setValue(item.yarn) // 纱支item.yarn// 纱支
          item.elementScaleList = item.elementScaleList || [] // elementScaleList
          item.element.ingredients = item.elementScaleList || []
        })
      this.detailObj.cmColorInfo &&
        this.detailObj.cmColorInfo.forEach((it, inx) => {
          it.orderNo = inx + 1 // 颜色信息
          it.colorModelStandard = that.getVluae(it.colorModelStandard)
        })

      this.detailObj.checkRequirementList &&
        this.detailObj.checkRequirementList.forEach((im, imx) => {
          im.orderNo = imx + 1 // checkRequirementList
        })

      this.inventoryData = this.detailObj.cmYarnUsed || []
      this.colorData = this.detailObj.cmColorInfo || []
      this.checkRequData = this.detailObj.checkRequirementList || []
      if (this.$refs.printinfo) {
        this.$refs.printinfo.setProDatBilIselect(this.detailObj.seller, 1, 'object') // 销售员
        this.$refs.printinfo.setProDatBilIselect(this.detailObj.sellerTeam, 2, 'object') // 销售团队
        this.$refs.printinfo.setProDatBilIselect(this.detailObj.customer, 3, 'object') // 客户
        this.$refs.printinfo.setProDatBilIselect(this.detailObj.colorModelType, 5, 'object') // 色板类型
        this.$refs.printinfo.setProDatBilIselect(this.detailObj.cloth, 6, 'object') // 布类
        this.$refs.printinfo.setProDatBilIselect(this.detailObj.lstLightSource, 9, 'object') // lst对色光源
        this.$refs.printinfo.setProDatBilIselect(this.detailObj.twondLightSource, 10, 'object') // 2nd对色光源
        this.$refs.printinfo.setProDatBilIselect(this.detailObj.threerdLightSource, 11, 'object') // 3rn对色光源
        this.$refs.printinfo.setProDatBilIselect(this.detailObj.attachmentList, 16, 'object') // 上传附件
        this.$refs.printinfo.setProDatBilIselect(this.detailObj.precautions, 17, 'object') // 注意事项

        this.$refs.printinfo.setformIndex(this.detailObj)
      }
    },
    // 复制色板申请详情单
    copyPrint() {
      this.isCopy = true
      this.detailObj.id = ''
      this.setEdit()
    },
    // 编辑
    setEdit() {
      this.isEdit = true
      this.setedittype = 'edit'
      this.inventoryOperates = {
        label: '操作',
        width: '240',
        fixed: 'right',
        dataSource: this.inventoryOperatesData
      }
      this.colorOperates = {
        label: '操作',
        width: '240',
        fixed: 'right',
        dataSource: this.colorOperatesData
      }
      // 送客批色板要操作栏集合
      this.checkRequOperates = {
        label: '操作',
        width: '240',
        fixed: 'right',
        dataSource: this.naturalPopOperates
      }
    },
    // 弹窗提取
    getmessgae(me = '', types = 'error') {
      this.$message({
        message: me,
        type: types
      })
    },
    // 保存验证表单验证 基本信息
    swatchesFun() {
      const validateFieldArr = []
      const _this = this
      const regNum = /^[1-9]\d*$/
      const checkRequiremen = []
      const Numcode = 1000
      this.submitPrintType = true
      const TopTextData = this.$refs.printinfo.$refs.basicData || {}
      const TopFrom = TopTextData.dynamicValidateFormRuleForm || {}
      TopTextData.form.validateField(
        [
          'seller',
          'sellerTeam',
          'customer',
          'delivery',
          'colorModelType',
          'cloth',
          'lstLightSource',
          'craftRequirementList'
        ],
        async(validateField) => {
          if (validateField && validateField !== '') {
            validateFieldArr.push(validateField)
          }
        }
      )
      if (validateFieldArr.length) {
        this.submitPrintType = false
        return
      }
      // 工艺要求
      if (
        (this.submitPrintType && !TopFrom.craftRequirementList) ||
        !TopFrom.craftRequirementList.length
      ) {
        this.submitPrintType = false
        _this.getmessgae('请填写工艺要求')
        return
      }
      // 送客批色板要求
      if (
        (this.submitPrintType && !this.checkRequData) ||
        !this.checkRequData.length
      ) {
        this.submitPrintType = false
        _this.getmessgae('请填写送客批色板要求')
        return
      }
      if (this.submitPrintType) {
        this.checkRequData.forEach((item, it) => {
          if (!item.size) {
            checkRequiremen.push(1)
          } else if (
            !item.number ||
            (item.number && !regNum.test(item.number)) ||
            (item.number && item.number > 99)
          ) {
            checkRequiremen.push(2)
          }
        })
        if (checkRequiremen.length) {
          if (checkRequiremen[0] === 1) {
            this.submitPrintType = false
            _this.getmessgae('请填写要求尺寸')
            return
          } else if (checkRequiremen[0] === 2) {
            this.submitPrintType = false
            _this.getmessgae('请填写份数范围是0-99正整数')
            return
          }
        }
      }
      // 用纱信息纱比
      if (this.submitPrintType && !this.inventoryData.length) {
        this.submitPrintType = false
        _this.getmessgae('请填写用纱信息纱比')
        return
      }
      if (this.submitPrintType) {
        var sp =
          this.inventoryData.length &&
          this.inventoryData.reduce((sum, cru) => {
            return sum + (cru.yarnScale || 0) * Numcode
          }, 0) -
          100 * Numcode !==
          0
        if (sp) {
          this.submitPrintType = false
          _this.getmessgae('用纱比例不等于100！请重新输入.')
          return
        }
      }
      // 颜色信息
      if (this.submitPrintType && !this.colorData.length) {
        this.submitPrintType = false
        _this.getmessgae('请填写颜色信息')
        return
      }
      return this.submitPrintType
    },
    // 用户行为记录 id
    UserBehaviorRecord(obj) {
      if (this.isCopy || !this.$route.params.id) {
        this.fetchLog(
          this.getLogMessages('INSERT', '/customerOrder/colorModel/colorModelApply/submit', 'customerOrder'),
          { data: obj },
          JSON.stringify({
            beforeText: `在'客户订单-色板申请'新增一条记录`,
            beforeCode: obj
          })
        )
      } else {
        const { beforeCode, afterCode } = this.compareData(this.copyDetailData, obj, 'id')
        const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
        flag && this.fetchLog(
          this.getLogMessages('UPDATE', '/customerOrder/colorModel/colorModelApply/submit', 'customerOrder'),
          { data: obj },
          JSON.stringify({
            beforeText: `在'客户订单-色板申请'修改一条记录`,
            afterText: '修改为',
            ...{ beforeCode, afterCode }
          })
        )
      }
    },

    // 提交色板申请详情单 草稿编辑提交
    async submitPrint() {
      this.swatchesFun()
      if (!this.submitPrintType) {
        return false
      } else {
        const obj = this.setDetailData()
        if (this.saveClickType) { // 提交时要过滤无效数据
          const res = await getSubmit(obj)
          this.$message({ type: 'success', message: '提交成功!' })
          this.UserBehaviorRecord(obj)
          // || this.isEdit
          if (
            this.isCopy ||
            this.$route.path.includes('edit') ||
            !this.$route.params.id
          ) {
            this.inventoryOperates = null
            this.colorOperates = null
            this.checkRequOperates = null
            this.$router.push(
              `/customer-order/analysis-application/swatches-application/detail/${res.data}/show`
            )
            this.isEdit = false
          } else {
            this.getDetailData(this.$route.params.id)
            this.isEdit = false
          }
        }
      }
    },
    // 修改提交
    async modifyPrint(data) {
      const res = await getModify(data)
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '修改成功!'
      })
      const { beforeCode, afterCode } = this.compareData(this.copyDetailData, data, 'id')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      flag && this.fetchLog(
        this.getLogMessages('UPDATE', '/customerOrder/colorModel/colorModelApply/modify', 'customerOrder'),
        { data: data },
        JSON.stringify({
          beforeText: `在'客户订单-色板申请'修改一条记录`,
          afterText: '修改为',
          ...{ beforeCode, afterCode }
        })
      )
      this.isEdit = false
      this.setedittype = 'cancel'
      this.inventoryOperates = null
      this.colorOperates = null
      this.checkRequOperates = null
      this.getDetailData(data.id)
    },

    // 删除色板申请弹窗
    async deleteClick() {
      this.$confirm('确认删除该色板申请单？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        cancelButtonClass: 'btn-cancel'
      })
        .then(() => {
          this.deletePrint()
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消删除' })
        })
    },
    // 删除色板申请单
    async deletePrint() {
      const res = await getDelete({ id: this.detailObj.id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.fetchLog(
        this.getLogMessages('DEL', '/customerOrder/colorModel/colorModelApply/delete', 'customerOrder'),
        { id: this.detailObj.id },
        JSON.stringify({
          beforeText: `在'客户订单-色板申请'删除一条记录`,
          beforeCode: { id: this.detailObj.id }
        })
      )
      this.$router.push('/customer-order/analysis-application/swatches-application')
    },
    // 取消生产印花订单
    cancelPrintClick() {
      this.$confirm('确认取消色板申请单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        cancelButtonClass: 'btn-cancel'
      })
        .then(() => {
          this.cancelPrint()
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消操作' })
        })
    },
    // 取消生产印花订单
    async cancelPrint() {
      const res = await getCancel({ id: this.detailObj.id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '取消成功!'
      })
      this.getDetailData(this.detailObj.id)
    },

    // 完结色板申请单弹窗
    finishPrintClick() {
      this.$confirm('确认完结色板申请单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        cancelButtonClass: 'btn-cancel'
      })
        .then(() => {
          this.finishPrint()
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消完结' })
        })
    },
    // 完结印花订单
    async finishPrint() {
      const res = await getFinish({ id: this.detailObj.id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '完结成功!'
      })
      this.getDetailData(this.detailObj.id)
    },
    // 取消返回到列表页
    cancelClick() {
      this.isEdit = false
      if (
        (this.$route.params.id && this.$route.path.includes('edit')) ||
        !this.$route.params.id
      ) {
        this.$router.push('/customer-order/analysis-application/swatches-application')
      }
      if (
        (this.$route.params.id && this.$route.path.includes('show')) ||
        this.isCopy
      ) {
        this.setedittype = 'cancel'
        this.inventoryOperates = null
        this.colorOperates = null
        this.checkRequOperates = null
        this.$router.push(
          `/customer-order/analysis-application/swatches-application/detail/${this.$route.params.id}/show`
        )
        this.getDetailData(this.$route.params.id)
      }
    },
    // 新增保存印花订单
    async saveClick() {
      const obj = this.setDetailData()
      if (this.saveClickType) {
        this.WorkOvertime(obj)
      }
    },
    splitClick(data) {
      let yu = []
      if (data) {
        yu = data.split('/') || []
      }
      return yu
    },
    // 处理详情数据
    setDetailData(type) {
      this.saveClickType = true
      const TopTextCopy =
        this.$refs.printinfo.$refs.basicData.dynamicValidateFormRuleForm || {} // 基本信息
      const obj = JSON.parse(JSON.stringify(TopTextCopy))
      const colorDataCopy = this.inventoryData || {} // 用纱信息
      const YanText = JSON.parse(JSON.stringify(colorDataCopy))
      const colorCopy = this.colorData || {} // 颜色信息
      const colorText = JSON.parse(JSON.stringify(colorCopy))
      if (isArray(obj.attachmentList)) {
        // 上传附件处理
        let attachStr = ''
        let sm = 0
        obj.attachmentList && obj.attachmentList.forEach((item, index) => {
          sm += item.size - 0
          if (item.url) {
            attachStr = attachStr + item.url + ','
          } else if (item.response && item.response.data) {
            item.url = item.response.data
            attachStr = attachStr + item.response.data + ','
          }
        })
        if (sm / 1024 / 1024 > 50) {
          this.saveClickType = false
          this.getmessgae('附件总大小不超过50M')
          return false
        }
      } else {
        obj.attachmentList = []
      }
      // 成品克重:
      const regNum = /^\d+\.?\d{0,1}$/
      obj.endProductWeight = obj.endProductWeight && obj.endProductWeight.includes('g/㎡') ? obj.endProductWeight.replace(/ g\/㎡/g, '') : obj.endProductWeight
      if (!obj.endProductWeight) {
        console.log('沒有不驗證')
      } else if (obj.endProductWeight && (!regNum.test(obj.endProductWeight))) {
        this.saveClickType = false
        this.getmessgae('成品克重:数字类型，输入时最大允许录入一位小数')
        return
      } else if (parseFloat(obj.endProductWeight) >= 1000 || parseFloat(obj.endProductWeight) <= 0) {
        this.saveClickType = false
        this.getmessgae('成品克重:请输入0~1000之间的数字')
        return
      }
      // 用纱信息处理
      obj.seller = this.setValue(obj.seller) // 销售员
      obj.sellerTeam = this.setValue(obj.sellerTeam) // 销售团队
      obj.customer = this.setValue(obj.customer) // 客户
      obj.colorModelType = this.setValue(obj.colorModelType) // 色板类型
      obj.cloth = this.setValue(obj.cloth) // 布类
      obj.garmentPart = this.setValue(obj.garmentPart) // 成衣部位
      obj.lstLightSource = this.setValue(obj.lstLightSource) // lst对色光源
      obj.twondLightSource = this.setValue(obj.twondLightSource) // 2st对色光源
      obj.threerdLightSource = this.setValue(obj.threerdLightSource) // 3st对色光源
      obj.threerdLightSource = this.setValue(obj.threerdLightSource) // 3st对色光源
      if (!obj.craftRequirementList || !obj.craftRequirementList.length) { // craftRequirementList
        obj.craftRequirementList = []
      } else if (obj.craftRequirementList.length) { // 工艺要求不能为0
        obj.craftRequirementList.forEach((st, kl) => {
          if (st.parentUuid === null) { st.parentUuid = 0 }
        })
      }
      obj.checkRequirementList = this.checkRequData || [] // 送客批色板要求
      const that = this // 用纱信息 里面的成分处理需要转数组
      YanText.length && YanText.forEach((im, ic) => {
        im.yarnli = that.splitClick(im.elementScale) // 切割纱比
        im.yarn = that.setValue(im.yarn) // 纱支
        im.spinningMethod = that.setValue(im.spinningMethod) // 纺纱方法
      })
      obj.cmYarnUsed = YanText
      // 颜色信息处理
      colorText.colorModelStandard = this.setValue(colorText.colorModelStandard) // 对色标准
      obj.cmColorInfo = colorText
      // 分样提交 复制的是清空智布色号
      if (this.isCopy) {
        obj.id = ''
        obj.cmColorInfo && obj.cmColorInfo.length && obj.cmColorInfo.forEach((im, ic) => {
          im.fabricColorNo = ''
        })
      }
      return obj
    },
    // 分样提交
    async WorkOvertime(obj) {
      const IndexId = this.$route.params && this.$route.params.id || 0
      if (IndexId && !this.isCopy) { // x修改成功
        this.modifyPrint(obj)
      } else { // 新增成功
        const res = await getAdd(obj)
        if (res.code !== 200) {
          return false
        }
        this.$message({ type: 'success', message: '新增成功!' })
        this.fetchLog(
          this.getLogMessages('INSERT', '/customerOrder/colorModel/colorModelApply/add', 'customerOrder'),
          { data: obj },
          JSON.stringify({
            beforeText: `在'客户订单-色板申请'新增一条记录`,
            beforeCode: obj
          })
        )
        this.inventoryOperates = null // 用纱
        this.colorOperates = null // 颜色
        this.checkRequOperates = null
        this.$router.push(
          `/customer-order/analysis-application/swatches-application/detail/${res.data.id}/show`
        )
        // if (!this.isCopy || IndexId) {
        //   this.getDetailData(this.$route.params.id)
        // }
      }
    },
    // 防止用户删除 对色标准 单双染
    PreventUsers(scope) {
      if (scope.row.colorModelStandard.value) {
        const colorModelStandardId = scope.row.colorModelStandard.value
        const colorModelStandard = colorModelStandardId && this.colorModelStandardList.some(item => {
          return item.value === colorModelStandardId
        })
        if (!colorModelStandard) {
          this.colorModelStandardList.push(scope.row.colorModelStandard)
          this.$set(this.colorContent[3], 'dataSource', this.colorModelStandardList)
        }
      }
      // 单双染
      if (scope.row.odDye.value) {
        const odDyeId = scope.row.odDye.value
        const odDyeFlag = odDyeId && this.odDyeList.some(item => {
          return item.value === odDyeId
        })
        if (!odDyeFlag) {
          this.odDyeList.push(scope.row.odDye)
          this.$set(this.colorContent[3], 'dataSource', this.odDyeList)
        }
      }
    },

    // 打印预览
    printPreview() {
      window.open(
        `/customer-order/analysis-application/swatches-application/print?id=${this.$route.params.id}`
      )
    },
    // 纯数据展示
    setValue(it, type = {}) {
      let sk = { value: '', label: '' }
      if (it) {
        sk = it
      }
      return sk
    }
  }
}
</script>

<style lang="scss" scoped>
.guest-sample {
  padding-bottom: 60px;
  margin-top: 20px;
  .table-item {
    background: #ffffff;
    margin: 20px 20px 0;
    margin-bottom: 20px;
    .header-top {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 20px 20px 15px 20px;
      span {
        font-size: 16px;
        display: flex;
        font-weight: 400;
      }
      .el-button {
        display: flex;
        span {
          font-size: 14px;
        }
      }
    }
    .basic-top {
      border-bottom: 1px solid #eeeff0;
      margin-bottom: 20px;
    }
    /deep/ .table tr:nth-child(even) {
      background: #ffffff;
    }
  }
  //底部导航栏
  .custom-form {
    margin: 0 20px;
  }
  .fixed-footer {
    width: calc(100% - 54px) !important;
  }
  .button-group {
    width: calc(100% - 210px);
    transition: width 0.28s;
    position: fixed;
    text-align: center;
    bottom: 0;
    padding: 10px;
    background: #ffffff;
    border-top: 1px solid #ecf0f3;
    z-index: 999;
  }
}
</style>
