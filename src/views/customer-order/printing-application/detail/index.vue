<template>
  <div class="printing-detail">
    <!-- 头部状态 -->
    <div v-if="this.$route.params.id" class="status-info">
      <span class="detail-code">印花SO申请单号：{{ detailData.id || '' }}<span v-if="!detailData.id" class="copy-code">保存后自动生成</span></span>
      <div class="detail-info">
        <span v-if="detailData.status === 0">创建人：{{ detailData.createdName || '-' }}</span>
        <span v-if="detailData.status === 2">更新人：{{ detailData.updatedName || '-' }}</span>
        <span v-if="detailData.status === 1 || detailData.status === 3">提交人：{{ detailData.submitName || '-' }}</span>
        <span v-if="detailData.status === 0">创建时间：{{ detailData.createdTime ? this.$filters.parseTime(detailData.createdTime) : '-' }}</span>
        <span v-if="detailData.status === 2">更新时间：{{ detailData.updatedTime ? this.$filters.parseTime(detailData.updatedTime) : '-' }}</span>
        <span v-if="detailData.status === 1 || detailData.status === 3">提交时间：{{ detailData.submitTime ? this.$filters.parseTime(detailData.submitTime) : '-' }}</span>
        <span>状态：<span :style="{ 'color': setStatusColor(detailData.status) }">{{ detailData.status | getState }}</span></span>
      </div>
    </div>
    <!-- 基本信息 -->
    <div class="table-item basic-data">
      <div class="header-top basic-top">
        <span>基本信息</span>
      </div>
      <cs-custom-form ref="basicData" :class="getEditClass" :data-source="basicData" :options="formOptions" :form-datas="formDatas" />
    </div>
    <!-- 库存抽用 -->
    <div class="table-item">
      <div class="header-top">
        <span>库存抽用</span>
        <el-button v-if="isEdit" type="primary" size="mini" @click="addInventory">新增</el-button>
      </div>
      <div class="page-table">
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
        <el-button v-if="isEdit" type="primary" size="mini" @click="addColor">新增</el-button>
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
    <!-- 库存侧边抽屉 -->
    <div class="pop">
      <cs-custom-pop ref="inventoryPop" :options="inventoryPopOptions" />
    </div>
    <!-- 颜色侧边抽屉 -->
    <div class="pop">
      <cs-custom-pop ref="colorPop" :options="colorPopOptions" />
    </div>
    <!-- 底部按钮 -->
    <div :class="{ 'fixed-footer': !sidebar }" class="button-group">
      <div v-if="!isEdit && detailData.status === 0">
        <el-button type="primary" @click="copyPrint">复制</el-button>
        <el-button v-permission="['soPrint:printApply:modify']" type="primary" @click="setEdit">编辑</el-button>
        <el-button v-permission="['soPrint:printApply:submit']" type="primary" @click="submitPrint">提交</el-button>
        <el-button v-permission="['soPrint:printApply:delete']" @click="deleteClick">删除</el-button>
      </div>
      <div v-if="!isEdit && detailData.status === 1">
        <el-button type="primary" @click="copyPrint">复制</el-button>
        <el-button v-permission="['soPrint:printApply:print']" type="primary" @click="printPreview">打印预览</el-button>
        <el-button v-permission="['soPrint:printApply:finish']" @click="finishPrintClick">完结</el-button>
        <el-button v-permission="['soPrint:printApply:cancel']" @click="cancelPrintClick">取消生产</el-button>
      </div>
      <div v-if="!isEdit && (detailData.status === 2 || detailData.status === 3)">
        <el-button type="primary" @click="copyPrint">复制</el-button>
        <el-button v-permission="['soPrint:printApply:print']" type="primary" @click="printPreview">打印预览</el-button>
      </div>
      <div v-if="isEdit">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="saveClick">保存</el-button>
        <el-button v-permission="['soPrint:printApply:submit']" type="primary" @click="submitPrint">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import uploadFile from '../component/upload-file'
import previewPic from '../component/previewPic'
import moreShow from '../component/moreShow'
import { getDetail, printAdd, printModify, printFinish, printCancel, printSubmit, printDelete, getColorInfo, sellTeamselect, customerSelect, brandSelect, firstLightSelect, printCraftSelect, clothSelect, yarnSelect, compositionSelect, zhCompositionSelect } from './api/index.js'
import { isArray } from '@/utils/validate'
import logMethods from '@/views/product-center/mixin/log-methods'
export default {
  filters: {
    getState(val) {
      switch (val) {
        case 0:
          return '草稿'
        case 1:
          return '进行中'
        case 2:
          return '已取消'
        case 3:
          return '已完成'
        default:
          return ''
      }
    }
  },
  mixins: [logMethods],
  data() {
    const headerCellStyle = {
      'background': '#F5F7FA'
    }
    const checkNum = (rule, value, callback) => {
      const reg = /^[1-9]\d*$/
      if (!value) {
        return callback(new Error('该项不能为空'))
      } else if (parseInt(value) === 0 || !reg.test(value)) {
        return callback(new Error('两位数的正整数'))
      } else {
        callback()
      }
    }
    const checkOrderNo = (rule, value, callback) => {
      const reg = /^[0-9A-Z]+$/
      if (!value) {
        return callback(new Error('订单号不能为空'))
      } else if (!reg.test(value)) {
        return callback(new Error('只能输入数字和大写字母'))
      } else {
        callback()
      }
    }
    const checkProductCloth = (rule, value, callback) => {
      const reg = /^\d+\.?\d{0,2}$/
      if (!value) {
        return callback(new Error('成品幅宽不能为空'))
      } else if (value && (!reg.test(value))) {
        return callback(new Error('数字类型，输入时最大允许录入两位小数'))
      } else if (parseFloat(value) >= 1000 || parseFloat(value) <= 0) {
        return callback(new Error('请输入0~1000之间的数字'))
      } else {
        callback()
      }
    }
    const checkProductWeight = (rule, value, callback) => {
      const reg = /^\d+\.?\d{0,2}$/
      if (!value) {
        return callback(new Error('成品克重不能为空'))
      } else if (value && (!reg.test(value))) {
        return callback(new Error('数字类型，输入时最大允许录入两位小数'))
      } else if (parseFloat(value) >= 10000 || parseFloat(value) <= 0) {
        return callback(new Error('请输入0~10000之间的数字'))
      } else {
        callback()
      }
    }
    // 基础信息数据
    const baseData = [
      {
        prop: 'id',
        itemType: 'input',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: 'SO单号:',
        placeholder: '自动生成',
        readonly: true,
        disabled: true,
        title: true,
        dataSource: []
      },
      {
        prop: 'createdTime',
        itemType: 'input',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '日期:',
        placeholder: '自动生成',
        rules: [{ required: true, message: '', trigger: 'blur' }],
        showMessage: false,
        readonly: true,
        disabled: true,
        title: true,
        dataSource: []
      },
      {
        prop: 'delivery',
        itemType: 'date',
        type: 'datetime',
        className: 'inputWidth',
        style: { 'width': '60%' },
        itemStyle: { 'width': '25%' },
        label: '交期:',
        format: 'yyyy-MM-dd',
        placeholder: '请选择日期时间',
        rules: [{ required: true, message: '交期不能为空', trigger: 'change' }],
        clearable: true,
        disabled: true,
        title: true,
        valueFormat: 'yyyy-MM-dd'
      },
      {
        prop: 'org',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '销售团队:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        filterable: true,
        rules: [{ required: true, message: '销售团队不能为空', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getOrg()
          }
        },
        dataSource: []
      },
      {
        prop: 'customer',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '客户:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        filterable: true,
        rules: [{ required: true, message: '客户不能为空', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getCustomer()
          }
        },
        dataSource: []
      },
      {
        prop: 'brand',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '品牌商:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        filterable: true,
        rules: [{ required: true, message: '品牌商不能为空', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getBrand()
          }
        },
        dataSource: []
      },
      {
        prop: 'lstLightSource',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '1st对色光源:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        filterable: true,
        rules: [{ required: true, message: 'lst对色光源不能为空', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getFirstLight()
          }
        },
        dataSource: []
      },
      {
        prop: 'twondLightSource',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '2nd对色光源:',
        valueType: 'object',
        filterable: true,
        clearable: true,
        disabled: true,
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getFirstLight()
          }
        },
        dataSource: []
      },
      {
        prop: 'printSize',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '印花尺寸:',
        clearable: true,
        filterable: true,
        disabled: true,
        rules: [{ required: true, message: '印花尺寸不能为空', trigger: 'change' }],
        dataSource: [
          {
            label: '小网 28cm X 28cm',
            value: '小网 28cm X 28cm'
          },
          {
            label: '中网 68cm X 68cm',
            value: '中网 68cm X 68cm'
          },
          {
            label: '一个完整循环',
            value: '一个完整循环'
          }
        ]
      },
      {
        prop: 'printNum',
        itemType: 'input',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '印花份数:',
        clearable: true,
        disabled: true,
        maxlength: 2,
        rules: [
          { required: true, message: '印花份数不能为空', trigger: 'blur' },
          { validator: checkNum, trigger: 'blur' }
        ],
        dataSource: []
      },
      {
        prop: 'printScheme',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '出版格式:',
        // valueType: 'object',
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '出版格式不能为空', trigger: 'change' }],
        dataSource: [
          {
            label: '指定格式',
            value: 1
          },
          {
            label: '工厂格式',
            value: 2
          }
        ]
      },
      {
        prop: 'clothStyle',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '成衣款式:',
        // valueType: 'object',
        // valueKey: 'value',
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '成衣款式不能为空', trigger: 'change' }],
        dataSource: [
          {
            label: '男装',
            value: 1
          },
          {
            label: '女装',
            value: 2
          },
          {
            label: '童装',
            value: 3
          },
          {
            label: '婴幼儿装',
            value: 4
          }
        ]
      },
      {
        prop: 'printCrafts',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '印花工艺:',
        props: { label: 'label', value: 'uuid' },
        clearable: true,
        filterable: true,
        multiple: true,
        disabled: true,
        valueType: 'object',
        rules: [{ required: true, message: '印花工艺不能为空', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getPrintCraft()
          }
        },
        dataSource: []
      }
    ]
    const editUpLoadData = [
      {
        prop: 'precautions',
        itemType: 'input',
        type: 'textarea',
        maxlength: 500,
        itemStyle: { 'width': '68%' },
        label: '注意事项:',
        dataSource: []
      },
      {
        prop: 'batchUpload',
        itemType: 'upload',
        itemStyle: { 'margin-bottom': '10px', 'width': '100%' },
        label: '批量上传:',
        accept: '.jpg,.jpeg,.png,.bmp,.JPG,.JPEG,.PNG,.BMP',
        limit: 30,
        className: 'uploadFile',
        clearable: true,
        multiple: true,
        fileList: [],
        action: '/customerOrder/soPrint/batch/upload/3',
        onExceed: () => {
          this.$message.error('上传文件数量不超过30')
        },
        beforeUpload: (file) => {
          if (file.size / 1024 / 1024 > 30) {
            this.$message.error('上传文件大小不超过30M')
            return false
          }
        },
        beforeRemove: (file, fileList) => {
          const newFileList = this.fileList.filter((item, index) => {
            if (item.uid) {
              return file.uid !== item.uid
            } else {
              return file.url !== item.value
            }
          })
          this.fileList = newFileList
        },
        rules: [{ required: true, message: '请至少上传一个文件', trigger: 'change' }],
        onSuccess: (response, file, fileList) => {
          this.fileList = [...fileList]
          // this.setPrintColorDesign(this.fileList)
        },
        dataSource: []
      }
    ]
    const detailUploadData = [
      {
        prop: 'precautions',
        itemType: 'input',
        itemStyle: { 'width': '75%' },
        label: '注意事项:',
        clearable: true,
        disabled: true,
        title: true,
        dataSource: []
      },
      {
        prop: 'batchUpload',
        itemType: 'input',
        itemStyle: { 'width': '100%' },
        label: '批量上传:',
        disabled: true,
        components: {
          uploadFile
        },
        componentsOptions: {
          prop: 'batchUpload'
        }
      }
    ]
    const inventoryColumns = [
      {
        prop: 'code',
        label: '#',
        width: '70'
      },
      {
        prop: 'orderNo',
        label: '订单号',
        showOverflowTooltip: true
      },
      {
        prop: 'cloth',
        label: '布类',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.cloth ? scope.row.cloth.label : ''
        }
      },
      {
        prop: 'finishedProductClothName',
        label: '成品幅宽',
        showOverflowTooltip: true
      },
      {
        prop: 'finishedProductWeightName',
        label: '成品克重',
        showOverflowTooltip: true
      },
      {
        prop: 'yarns',
        label: '纱支',
        components: {
          moreShow
        },
        componentsOptions: {
          type: 'yarns'
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
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true
      }
    ]
    const inventoryOperatesData = [
      {
        label: '编辑',
        isShow: true,
        handle: scope => {
          this.optionStatus = 'edit'
          this.$set(this.inventoryContent[1], 'disabled', false)
          this.inventoryPopHandle('编辑库存抽用')
          this.setFormDatas({
            ...scope.row,
            cloth: scope.row.cloth,
            element: scope.row.element,
            finishedProductClothNum: parseFloat(scope.row.finishedProductClothName),
            unit: scope.row.finishedProductClothName.includes('cm') ? 'cm' : '"',
            finishedProductWeightNum: parseFloat(scope.row.finishedProductWeightName),
            yarns: scope.row.yarns
          }, 'inventory')
          this.colorData.forEach(item => {
            if (parseInt(scope.row.cloth.value) === parseInt(item.cloth.value)) {
              this.$set(this.inventoryContent[1], 'disabled', true)
            }
          })
        }
      },
      {
        label: '删除',
        isShow: true,
        style: { 'color': '#FE4949' },
        handle: scope => {
          this.deleteRowData(scope, 'inventory')
        }
      }
    ]
    const inventoryOperates = {
      label: '操作',
      width: '240',
      fixed: 'right',
      dataSource: inventoryOperatesData
    }
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const inventoryContent = [
      {
        prop: 'orderNo',
        itemType: 'input',
        label: '订单号',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg, { validator: checkOrderNo, trigger: 'blur' }]
      },
      {
        prop: 'cloth',
        itemType: 'select',
        label: '布类',
        clearable: true,
        filterable: true,
        valueType: 'object',
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
        prop: 'finishedProductClothNum',
        itemType: 'input',
        itemStyle: { width: '70%', display: 'inline-block' },
        label: '成品幅宽',
        clearable: true,
        rules: [commonBlurReg, { validator: checkProductCloth, trigger: 'blur' }]
      },
      {
        prop: 'unit',
        itemType: 'select',
        itemStyle: { width: '30%', display: 'inline-block' },
        labelWidth: '10px',
        label: ' ',
        change: (value) => {
          // console.log(value)
        },
        dataSource: [
          {
            label: 'cm',
            value: 'cm'
          },
          {
            label: '"',
            value: '"'
          }
        ]
      },
      {
        prop: 'finishedProductWeightNum',
        itemType: 'input',
        itemStyle: { width: '100%', display: 'inline-block' },
        label: '成品克重',
        clearable: true,
        rules: [commonBlurReg, { validator: checkProductWeight, trigger: 'blur' }]
      },
      {
        prop: 'yarns',
        itemType: 'select',
        label: '纱支',
        clearable: true,
        filterable: true,
        valueType: 'object',
        className: 'commonRemoteSearch',
        multiple: true,
        rules: [commonChangeReg],
        visibleChange: (value) => {
          if (value) {
            this.getYarn()
          }
        },
        dataSource: []
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
        visibleChange: (value) => {
          if (value) {
            this.getComposition()
          }
        },
        dataSource: []
      },
      {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        label: '备注',
        maxlength: 500,
        trim: (value) => {
          return value
        }
      }
    ]
    const inventoryPopOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增库存抽用',
      okText: '保存',
      ok: params => {
        const addData = {
          code: this.optionStatus === 'add' ? this.inventoryData.length + 1 : params.code,
          orderNo: params.orderNo,
          cloth: params.cloth,
          finishedProductClothName: params.finishedProductClothNum + params.unit,
          finishedProductWeightName: params.finishedProductWeightNum + 'g/㎡',
          yarns: params.yarns,
          element: params.element,
          remark: params.remark
        }
        let flag = false
        this.inventoryData.forEach(item => {
          if (parseInt(item.cloth.value) === addData.cloth.value) {
            flag = true
          }
        })
        if (flag && this.optionStatus === 'add') {
          this.$message.error('不能添加重复布类名称的数据')
          return
        }
        if (this.optionStatus === 'add') {
          this.inventoryData.push(addData)
        } else {
          this.inventoryData.splice(params.code - 1, 1, addData)
        }
        this.inventoryPopHandle()
      },
      cancel: params => {
        this.inventoryPopHandle()
      },
      formDatas: {},
      formOptions: {},
      content: inventoryContent
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
    const colorColumns = [
      {
        prop: 'code',
        label: '#',
        width: '70'
      },
      {
        prop: 'cloth',
        label: '布类',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.cloth ? scope.row.cloth.label : ''
        }
      },
      {
        prop: 'printColorName',
        label: '印花颜色名',
        showOverflowTooltip: true
      },
      {
        prop: 'printColorDesign',
        label: '印花图案',
        components: {
          previewPic
        },
        formater: (scope) => {
          return `<img class="printColorDesign" src='${scope.row.printColorDesign}' />`
        }
      },
      {
        prop: 'printBaseColor',
        label: '印花底色',
        showOverflowTooltip: true
      },
      {
        prop: 'fabricFlowerNo',
        label: '智布花号',
        showOverflowTooltip: true
      },
      {
        prop: 'printNestedColor',
        label: '印花套色'
      },
      {
        prop: 'printColorGroup',
        label: '印花图案分组',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.printColorGroup ? scope.row.printColorGroup.label : ''
        }
      }
    ]
    const colorOperatesData = [
      {
        label: '编辑',
        isShow: true,
        handle: scope => {
          this.optionStatus = 'edit'
          this.$set(this.colorContent[2], 'disabled', true)
          this.$set(this.colorContent[3], 'disabled', true)
          this.$set(this.colorContent[5], 'disabled', true)
          this.$set(this.colorContent[6], 'disabled', true)
          this.setColorClothOption()
          this.setPrintColorDesign()
          this.colorPopHandle('编辑颜色信息')
          this.setFormDatas({ ...scope.row }, 'color')
        }
      },
      {
        label: '复制',
        isShow: true,
        handle: scope => {
          this.copyRowData(scope, 'color')
        }
      },
      {
        label: '删除',
        isShow: true,
        style: { 'color': '#FE4949' },
        handle: scope => {
          this.deleteRowData(scope, 'color')
        }
      }
    ]
    // colorOperatesData = this.$filterPermission(colorOperatesData)
    const colorOperates = {
      label: '操作',
      width: '240',
      fixed: 'right',
      dataSource: colorOperatesData
    }
    const colorContent = [
      {
        prop: 'cloth',
        itemType: 'select',
        label: '布类',
        clearable: true,
        valueType: 'object',
        rules: [commonChangeReg],
        filterable: true,
        visibleChange: (value) => {
          if (value) {
            if (!this.colorClothData.length) {
              this.$message.error('请先新增一条库存抽用')
            }
          }
        },
        dataSource: []
      },
      {
        prop: 'printColorName',
        itemType: 'input',
        label: '印花颜色名',
        clearable: true,
        blur: (scope, form) => {
          this.getColorInfo({ printColorName: scope.target.value }, form)
        },
        maxlength: 100,
        rules: [commonBlurReg]
      },
      {
        prop: 'printColorDesign',
        itemType: 'select',
        label: '印花图案',
        filterable: true,
        clearable: true,
        rules: [commonChangeReg],
        renderOptions: (item) => {
          return `<span class="printColorDesignPic" style="display: flex"><img src =${item.value} style="width: 185px;height:185px"/></span>`
        },
        visibleChange: (value) => {
          if (value) {
            if (!this.printColorDesignData.length) {
              this.$message.error('请先批量上传图片')
            }
            this.printColorDesignData.forEach((item, index) => {
              (document.querySelectorAll('.printColorDesignPic'))[index].parentNode.parentNode.style.height = '195px'
            })
          }
        },
        dataSource: []
      },
      {
        prop: 'printBaseColor',
        itemType: 'input',
        label: '印花底色',
        clearable: true,
        maxlength: 50,
        rules: [commonBlurReg]
      },
      {
        prop: 'fabricFlowerNo',
        itemType: 'input',
        label: '智布花号',
        disabled: true
      },
      {
        prop: 'printNestedColor',
        itemType: 'input',
        label: '印花套色',
        clearable: true,
        maxlength: 2,
        rules: [commonBlurReg, { validator: checkNum, trigger: 'blur' }]
      },
      {
        prop: 'printColorGroup',
        itemType: 'select',
        label: '印花图案分组',
        clearable: true,
        valueType: 'object',
        filterable: true,
        rules: [commonChangeReg],
        visibleChange: (value) => {
          if (value) {
            this.getBigLetter()
          }
        },
        dataSource: []
      }
    ]
    const colorPopOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增颜色信息',
      okText: '保存',
      ok: params => {
        const addData = {
          code: this.optionStatus === 'add' ? this.colorData.length + 1 : params.code,
          cloth: params.cloth,
          printColorName: params.printColorName,
          printColorDesign: params.printColorDesign,
          printBaseColor: params.printBaseColor,
          fabricFlowerNo: params.fabricFlowerNo,
          printNestedColor: params.printNestedColor,
          printColorGroup: params.printColorGroup
        }
        if (this.optionStatus === 'add') {
          this.colorData.push(addData)
        } else {
          this.colorData.splice(params.code - 1, 1, addData)
        }
        this.colorPopHandle()
      },
      cancel: params => {
        this.colorPopHandle()
      },
      formDatas: {},
      formOptions: {},
      content: colorContent
    }
    return {
      isCopy: false,
      optionStatus: '',
      headerCellStyle,
      baseData,
      basicData: [],
      editUpLoadData,
      detailUploadData,
      inventoryColumns,
      inventoryData: [],
      inventoryOperatesData,
      inventoryOperates,
      inventoryPopOptions,
      inventoryContent,
      pagination,
      colorColumns,
      colorData: [],
      colorOperatesData,
      colorOperates,
      colorPopOptions,
      colorContent,
      formOptions: {
        size: 'small',
        inline: true
      },
      formDatas: {},
      isEdit: true,
      detailData: {},
      fileList: [], // 上传图片数组
      bigLetterarr: [], // 26个大写字母数组
      sellTeamData: [], // 销售团队下拉
      customerData: [], // 客户下拉
      brandData: [], // 品牌商下拉
      firstLightData: [], // 品牌商下拉
      printCraftData: [], // 印花工艺下拉
      clothData: [], // 库存布类下拉
      colorClothData: [], // 颜色布类下拉
      yarnData: [], // 库存纱支下拉
      compositionData: [], // 库存成份下拉
      bigLetterData: [], // 库存成份下拉
      printColorDesignData: [] // 印花图案下拉
    }
  },
  computed: {
    getEditClass() {
      if (this.isEdit) {
        return 'editClass'
      } else {
        return 'detailClass'
      }
    },
    sidebar() {
      return this.$store.state.app.sidebar.opened
    }
  },
  created() {
    this.initData()
    this.generateBig()
    this.getOrg()
    this.getCustomer()
    this.getBrand()
    this.getFirstLight()
    this.getPrintCraft()
    this.getCloth()
    this.getYarn()
    this.getComposition()
    this.getBigLetter()
    if (this.$route.params.id) {
      this.getDetailData(this.$route.params.id)
    }
    this.changeOptionStatus()
  },
  methods: {
    changeOptionStatus() {
      if (this.$route.params.id) {
        if (this.$route.path.includes('show')) {
          this.isEdit = false
          this.basicData = [...this.baseData, ...this.detailUploadData]
          this.basicData.forEach(item => {
            item.disabled = true
            // item.placeholder = ''
          })
          this.inventoryOperates = null
          this.colorOperates = null
        } else {
          this.isEdit = true
          this.basicData = [...this.baseData, ...this.editUpLoadData]
          this.basicData.forEach(item => {
            item.disabled = false
          })
          this.basicData[0].disabled = true
          this.basicData[1].disabled = true
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
          // this.setEdit()
        }
      } else {
        this.formDatas.printSize = '小网 28cm X 28cm'
        this.formDatas.printScheme = 1
        this.isEdit = true
        this.basicData = [...this.baseData, ...this.editUpLoadData]
        this.basicData.forEach(item => {
          item.disabled = false
        })
        this.basicData[0].disabled = true
        this.basicData[1].disabled = true
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
      }
    },
    initData() {
      this.detailData = {
        delivery: '', // 交期
        org: {}, // 销售团队
        customer: {}, // 销售团队
        brand: {}, // 客户
        lstLightSource: {}, // lst对色光源
        twondLightSource: {}, // 2nd对色光源
        printSize: '', // 印花尺寸
        printNum: '', // 印花份数
        printScheme: '', // 印花格式 1指定格式2工厂格式
        clothStyle: '', // 成衣款式 1男装2女装3童装4婴幼儿装
        printCrafts: '', // 印花工艺
        precautions: '', // 注意事项
        batchUpload: [], // 批量上传
        stockUsed: [], // 库存抽调信息
        colorInfo: [] // 颜色信息
      }
    },
    // 设置印花单状态颜色
    setStatusColor(status) {
      let statusColor = ''
      switch (status) {
        case 0:
          statusColor = '#FF9214'
          break
        case 1:
          statusColor = '#FF9214'
          break
        case 2:
          statusColor = '#888E9E'
          break
        case 3:
          statusColor = '#00BCC5'
          break
        default:
          statusColor = ''
          break
      }
      return statusColor
    },
    // 生成26个字母数组
    generateBig() {
      const str = []
      for (var i = 65; i < 91; i++) {
        str.push(String.fromCharCode(i))
      }
      this.bigLetterarr = str
    },
    // 处理新增时根据id，获取到下拉里面的name到table
    getOptionName(optionData, id, idKey) {
      let key = ''
      if (idKey) {
        key = idKey
      } else {
        key = 'id'
      }
      if (isArray(id)) {
        const nameArr = []
        optionData.forEach(item => {
          id.forEach(items => {
            if (parseInt(item[key]) === parseInt(items)) {
              nameArr.push(item.name)
            }
          })
        })
        return nameArr.join(',')
      } else {
        let name = ''
        optionData.forEach(item => {
          // if (parseInt(item[key]) === parseInt(id)) {
          //   name = item.name
          // }
          if ('' + item[key] === '' + id) {
            name = item.name
          }
        })
        return name
      }
    },
    // 点击编辑时处理数据
    setFormDatas(params, type) {
      setTimeout(() => {
        if (type === 'inventory') {
          this.$set(this.inventoryPopOptions, 'formDatas', params)
        } else if (type === 'color') {
          this.$set(this.colorPopOptions, 'formDatas', params)
        }
      }, 0)
    },
    // 销售团队下拉
    async getOrg() {
      const res = await sellTeamselect({ functionTag: 'SAL' })
      if (res.code !== 200) {
        return false
      }
      const sellTeamData = res.data || []
      this.sellTeamData = sellTeamData.length && sellTeamData.map((item, index) => {
        return {
          label: item.name,
          value: '' + item.orgId
        }
      })
      this.$set(this.basicData[3], 'dataSource', this.sellTeamData)
    },
    // 客户下拉
    async getCustomer() {
      const res = await customerSelect({})
      if (res.code !== 200) {
        return false
      }
      const customerData = res.data || []
      this.customerData = customerData.length && customerData.map((item, index) => {
        return {
          label: item.name,
          value: item.customerId
        }
      })
      this.$set(this.basicData[4], 'dataSource', this.customerData)
    },
    // 品牌商下拉
    async getBrand() {
      const res = await brandSelect({})
      if (res.code !== 200) {
        return false
      }
      const brandData = res.data || []
      this.brandData = brandData.length && brandData.map((item, index) => {
        return {
          label: item.name,
          value: '' + item.id
        }
      })
      this.$set(this.basicData[5], 'dataSource', this.brandData)
    },
    // lst对色光源下拉
    async getFirstLight() {
      const res = await firstLightSelect({ enabled: 'Y' })
      if (res.code !== 200) {
        return false
      }
      const firstLightData = res.data || []
      this.firstLightData = firstLightData.length && firstLightData.map((item, index) => {
        return {
          label: item.name,
          value: item.uuid
        }
      })
      this.$set(this.basicData[6], 'dataSource', this.firstLightData)
      this.$set(this.basicData[7], 'dataSource', this.firstLightData)
    },
    // 印花工艺下拉
    async getPrintCraft() {
      const res = await printCraftSelect({ classificationName: '印花工艺' })
      if (res.code !== 200) {
        return false
      }
      const printCraftData = res.data || []
      this.printCraftData = printCraftData.length && printCraftData.map((item, index) => {
        return {
          label: item.name,
          // value: item.uuid
          value: '' + item.id // 花号库要的是id
        }
      })
      this.$set(this.basicData[12], 'dataSource', this.printCraftData)
    },
    // 库存布类下拉
    async getCloth() {
      const res = await clothSelect({ enabled: 'Y' })
      if (res.code !== 200) {
        return false
      }
      const clothData = res.data || []
      this.clothData = clothData.length && clothData.map((item, index) => {
        return {
          label: item.name,
          value: item.uuid
        }
      })
      this.$set(this.inventoryContent[1], 'dataSource', this.clothData)
    },
    // 库存纱支下拉
    async getYarn() {
      const resYarnCount = await yarnSelect({ categoryId: '9' })
      if (resYarnCount.code !== 200) {
        return false
      }
      const yarnCount = resYarnCount.data || []
      yarnCount.length && yarnCount.forEach(item => {
        item.label = item.name
        item.value = item.uuid
      })
      const resFineness = await yarnSelect({ categoryId: '12' })
      if (resFineness.code !== 200) {
        return false
      }
      const fineness = resFineness.data || []
      fineness.length && fineness.forEach(item => {
        item.label = item.name
        item.value = item.uuid
      })
      this.yarnData = yarnCount.concat(fineness)
      this.$set(this.inventoryContent[5], 'dataSource', this.yarnData)
    },
    // 库存成份下拉
    async getComposition() {
      const resComposition = await compositionSelect()
      if (resComposition.code !== 200) {
        return false
      }
      const composition = resComposition.data || []
      const compositionList = composition.length && composition.map(item => {
        return {
          label: item.name,
          value: item.uuid,
          type: 0
        }
      })
      const resZhComposition = await zhCompositionSelect()
      if (resZhComposition.code !== 200) {
        return false
      }
      const zhComposition = resZhComposition.data || []
      const ZhcompositionList = zhComposition.length && zhComposition.map(item => {
        return {
          label: item.name,
          value: item.uuid,
          type: 1
        }
      })
      this.compositionData = compositionList.concat(ZhcompositionList)
      this.$set(this.inventoryContent[6], 'dataSource', this.compositionData)
    },
    // 26个字母下拉
    getBigLetter() {
      this.bigLetterData = this.bigLetterarr.map(item => {
        return {
          label: item,
          value: item
        }
      })
      this.$set(this.colorContent[6], 'dataSource', this.bigLetterData)
    },
    async getColorInfo(data, form) {
      const res = await getColorInfo(data)
      if (res.code !== 200) {
        return false
      }
      if (res && res.data) {
        this.$set(this.colorPopOptions.formDatas, 'printColorName', res.data.printColorName)
        this.$set(this.colorPopOptions.formDatas, 'printColorDesign', res.data.printColorDesign)
        this.$set(this.colorPopOptions.formDatas, 'printBaseColor', res.data.printBaseColor)
        this.$set(this.colorPopOptions.formDatas, 'fabricFlowerNo', res.data.fabricFlowerNo)
        this.$set(this.colorPopOptions.formDatas, 'printNestedColor', res.data.printNestedColor)
        this.$set(this.colorPopOptions.formDatas, 'printColorGroup', res.data.printColorGroup)
        this.$set(this.colorContent[2], 'disabled', true)
        this.$set(this.colorContent[3], 'disabled', true)
        this.$set(this.colorContent[5], 'disabled', true)
        this.$set(this.colorContent[6], 'disabled', true)
        form.clearValidate()
      } else {
        this.$set(this.colorPopOptions.formDatas, 'printColorName', data.printColorName)
        this.$set(this.colorPopOptions.formDatas, 'printColorDesign', '')
        this.$set(this.colorPopOptions.formDatas, 'printBaseColor', '')
        this.$set(this.colorPopOptions.formDatas, 'fabricFlowerNo', '')
        this.$set(this.colorPopOptions.formDatas, 'printNestedColor', '')
        this.$set(this.colorPopOptions.formDatas, 'printColorGroup', '')
        this.$set(this.colorContent[2], 'disabled', false)
        this.$set(this.colorContent[3], 'disabled', false)
        this.$set(this.colorContent[5], 'disabled', false)
        this.$set(this.colorContent[6], 'disabled', false)
      }
    },
    // 打印预览
    printPreview() {
      window.open(`/customer-order/analysis-application/printing-application/print?id=${this.$route.params.id}`)
    },
    // 获取详情数据
    async getDetailData(id) {
      const res = await getDetail({ id })
      this.detailData = Object.assign({}, res.data) || {}
      this.copyDetailData = JSON.parse(JSON.stringify(this.detailData))
      this.detailData.stockUsed && this.detailData.stockUsed.forEach((item, index) => {
        item.code = index + 1
      })
      this.detailData.colorInfo && this.detailData.colorInfo.forEach((item, index) => {
        item.code = index + 1
      })
      this.inventoryData = this.detailData.stockUsed || []
      this.colorData = this.detailData.colorInfo || []
      this.setDetailData(this.detailData)
    },
    setDetailData(data) {
      let fileArr = []
      let fileNameStr = ''
      if ((this.$route.params.id && this.$route.path.includes('show') && !this.isEdit) || (this.$route.params.id && this.$route.path.includes('edit') && !this.isEdit)) {
        fileNameStr = data.batchUploadName
      } else {
        const batchUpload = data.batchUpload && data.batchUpload.split(',')
        const batchUploadName = data.batchUploadName && data.batchUploadName.split(',')
        fileArr = batchUpload && batchUpload.length && batchUpload.map((item, index) => {
          return {
            name: batchUploadName[index],
            url: item
          }
        })
      }
      if (data.batchUpload && data.batchUploadName) {
        const batchUpload = data.batchUpload.split(',')
        const batchUploadName = data.batchUploadName.split(',')
        this.fileList = batchUpload.map((item, index) => {
          return {
            label: batchUploadName[index],
            value: item
          }
        })
      }
      const customer = data.customer
      const brand = data.brand
      const customerFlag = this.customerData.some(item => {
        return item.value === customer.value
      })
      if (!customerFlag) {
        this.customerData.push(customer)
      }
      const brandFlag = this.brandData.some(item => {
        return parseInt(item.value) === parseInt(brand.value)
      })
      if (!brandFlag) {
        this.brandData.push(brand)
      }
      const lstLightSource = data.lstLightSource
      const lstLightSourceFlag = this.firstLightData.some(item => {
        return item.value === lstLightSource.value
      })
      if (!lstLightSourceFlag) {
        this.firstLightData.push(lstLightSource)
      }
      const twondLightSource = data.twondLightSource
      const twondLightSourceFlag = this.firstLightData.some(item => {
        return item.value === twondLightSource.value
      })
      if (!twondLightSourceFlag) {
        this.firstLightData.push(twondLightSource)
      }
      this.formDatas = {
        id: data.id || '',
        createdTime: data.createdTime ? this.$filters.parseTime(data.createdTime) : '',
        delivery: data.delivery || '',
        org: data.org ? data.org : null,
        customer: data.customer ? data.customer : null,
        brand: data.brand ? data.brand : null,
        lstLightSource: data.lstLightSource ? data.lstLightSource : null,
        twondLightSource: data.twondLightSource ? data.twondLightSource : null,
        printSize: data.printSize || '',
        printNum: data.printNum || '',
        printScheme: data.printScheme || '',
        clothStyle: data.clothStyle || '',
        printCrafts: data.printCrafts || [],
        precautions: data.precautions || '',
        batchUpload: (this.$route.params.id && this.$route.path.includes('show') && !this.isEdit) || (this.$route.params.id && this.$route.path.includes('edit') && !this.isEdit) ? fileNameStr : fileArr,
        batchUploadName: data.batchUploadName
      }
      this.$nextTick(() => {
        this.$refs.basicData.form.clearValidate()
      })
    },
    setEdit() {
      this.isEdit = true
      if (this.$route.params.id && (this.$route.path.includes('show') || this.$route.path.includes('edit'))) {
        this.setDetailData(this.copyDetailData)
      }
      this.basicData = [...this.baseData, ...this.editUpLoadData]
      this.basicData.forEach(item => {
        item.disabled = false
      })
      this.basicData[0].disabled = true
      this.basicData[1].disabled = true
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
    },
    // 库存弹窗显隐
    inventoryPopHandle(val) {
      this.$set(this.inventoryPopOptions, 'visible', !this.inventoryPopOptions.visible)
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
    // 新增库存抽用
    addInventory() {
      // this.$nextTick(() => {
      //   this.$refs.inventoryPop.form.clearValidate()
      // })
      this.optionStatus = 'add'
      this.inventoryPopHandle('新增库存抽用')
      this.setFormDatas({ unit: 'cm' }, 'inventory')
      this.$set(this.inventoryPopOptions, 'content', this.inventoryContent)
      this.$set(this.inventoryPopOptions, 'formDatas', {})
      this.$set(this.inventoryContent[1], 'disabled', false)
    },
    // 新增颜色信息
    addColor() {
      this.optionStatus = 'add'
      this.colorPopHandle('新增颜色信息')
      this.$set(this.colorPopOptions, 'content', this.colorContent)
      this.$set(this.colorPopOptions, 'formDatas', {})
      this.$set(this.colorContent[2], 'disabled', false)
      this.$set(this.colorContent[3], 'disabled', false)
      this.$set(this.colorContent[5], 'disabled', false)
      this.$set(this.colorContent[6], 'disabled', false)
      this.setColorClothOption()
      this.setPrintColorDesign()
    },
    // 颜色布类下拉
    setColorClothOption() {
      if (this.inventoryData && this.inventoryData.length) {
        this.colorClothData = this.inventoryData.map(item => {
          return {
            label: item.cloth.label,
            value: item.cloth.value
          }
        })
        // 颜色布类下拉去重
        const obj = {}
        this.colorClothData = this.colorClothData.reduce((cur, next) => {
          obj[next.value] ? '' : obj[next.value] = true && cur.push(next)
          return cur
        }, [])
        this.$set(this.colorContent[0], 'dataSource', this.colorClothData)
      }
    },
    // 印花图案下拉
    setPrintColorDesign() {
      if (this.$route.params.id) {
        const uploadList = this.fileList.map(item => {
          return {
            label: item.name,
            value: item.response && item.response.data && item.response.data[0] || item.url || item.value
          }
        })
        this.printColorDesignData = uploadList
      } else {
        if (this.fileList && this.fileList.length) {
          this.printColorDesignData = this.fileList.map(item => {
            return {
              label: item.name,
              value: item.response.data[0]
            }
          })
        }
      }
      this.$set(this.colorContent[2], 'dataSource', this.printColorDesignData)
    },
    // 完结印花订单
    finishPrintClick() {
      this.$confirm('确认完结该印花SO申请单？', '提示', {
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
      const res = await printFinish({ id: this.detailData.id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '完结成功!'
      })
      this.getDetailData(this.detailData.id)
    },
    // 取消生产印花订单
    cancelPrintClick() {
      this.$confirm('确认取消生产该印花SO申请单？', '提示', {
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
      const res = await printCancel({ id: this.detailData.id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '取消成功!'
      })
      this.getDetailData(this.detailData.id)
    },
    // 新增保存印花订单
    async saveClick() {
      let params = {}
      const basicParams = this.$refs.basicData.dynamicValidateFormRuleForm || {}
      let batchUpload = []
      let batchUploadName = []
      if (!this.$route.params.id) {
        batchUpload = this.fileList && this.fileList.length && this.fileList.map(item => {
          return item.response.data[0]
        })
        batchUploadName = this.fileList && this.fileList.length && this.fileList.map(item => {
          return item.name
        })
      } else {
        batchUpload = this.fileList && this.fileList.length && this.fileList.map(item => {
          return item.response && item.response.data && item.response.data[0] || item.url || item.value
        })
        batchUploadName = this.fileList && this.fileList.length && this.fileList.map(item => {
          return item.name || item.label
        })
      }
      params = {
        ...basicParams,
        batchUpload: batchUpload ? batchUpload.join(',') : '',
        batchUploadName: batchUploadName ? batchUploadName.join(',') : '',
        stockUsed: this.inventoryData,
        colorInfo: this.colorData
      }
      if (this.isCopy) {
        params = { ...params, id: '' }
      }
      const reg = /^[1-9]\d*$/
      if (params.printNum && (parseInt(params.printNum) === 0 || !reg.test(params.printNum))) {
        return false
      }
      if (this.$route.params.id && !this.isCopy) {
        const res = await printModify({ ...params, id: this.$route.params.id })
        if (res.code !== 200) {
          return false
        }
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        const { beforeCode, afterCode } = this.compareData(this.copyDetailData, { ...params, id: this.$route.params.id }, 'id')
        const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
        flag && this.fetchLog(
          this.getLogMessages('UPDATE', '/customerOrder/soPrint/printApply/modify', 'customerOrder'),
          { ...params, id: this.$route.params.id },
          JSON.stringify({
            beforeText: `在'客户订单-印花SO申请'将${JSON.stringify({ 'id': this.$route.params.id })}`,
            afterText: '修改为',
            ...{ beforeCode, afterCode }
          })
        )
        this.isEdit = false
        this.setDetailData(params)
        this.basicData = [...this.baseData, ...this.detailUploadData]
        this.basicData.forEach(item => {
          item.disabled = true
        })
        this.inventoryOperates = null
        this.colorOperates = null
        this.getDetailData(this.$route.params.id)
      } else {
        const res = await printAdd(params)
        if (res.code !== 200) {
          return false
        }
        this.$message({
          type: 'success',
          message: '新增成功!'
        })
        this.fetchLog(
          this.getLogMessages('INSERT', '/customerOrder/soPrint/printApply/add', 'customerOrder'),
          params,
          JSON.stringify({
            beforeText: `在'客户订单-印花SO申请'新增一条记录`,
            beforeCode: params
          })
        )
        this.inventoryOperates = null
        this.colorOperates = null
        this.$router.push(`/customer-order/analysis-application/printing-application/detail/${res.data}/show`)
      }
    },
    // 提交印花订单
    async submitPrint() {
      const validateFieldArr = []
      this.$refs.basicData.form.validateField(['delivery', 'org', 'customer', 'brand', 'lstLightSource', 'printSize', 'printNum', 'printScheme', 'clothStyle', 'printCrafts', 'batchUpload'], async(validateField) => {
        if (validateField && validateField !== '') {
          validateFieldArr.push(validateField)
        }
      })
      if (validateFieldArr.length) {
        return false
      }
      let params = {}
      if (this.isEdit) {
        const basicParams = this.$refs.basicData.dynamicValidateFormRuleForm
        let batchUpload = []
        let batchUploadName = []
        batchUpload = basicParams.batchUpload && basicParams.batchUpload.length && basicParams.batchUpload.map(item => {
          return item.response && item.response.data && item.response.data[0] || item.url
        })
        batchUploadName = basicParams.batchUpload && basicParams.batchUpload.length && basicParams.batchUpload.map(item => {
          return item.name
        })
        params = {
          ...basicParams,
          batchUpload: batchUpload ? batchUpload.join(',') : '',
          batchUploadName: batchUploadName ? batchUploadName.join(',') : '',
          stockUsed: this.inventoryData || [],
          colorInfo: this.colorData || []
        }
        if (this.isCopy) {
          params = { ...params, id: '' }
        }
      } else {
        const stockUsed = this.copyDetailData.stockUsed || []
        const colorInfo = this.copyDetailData.colorInfo || []
        params = { ...this.copyDetailData, stockUsed: stockUsed, colorInfo: colorInfo }
      }
      if (!params.stockUsed.length) {
        this.$message({
          type: 'error',
          message: '请至少添加一条库存抽用'
        })
        return
      }
      if (!params.colorInfo.length) {
        this.$message({
          type: 'error',
          message: '请至少添加一条颜色信息'
        })
        return
      }
      console.log(this.isEdit)
      const res = await printSubmit({ ...params })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '提交成功!'
      })
      if (this.isEdit) {
        this.inventoryOperates = null
        this.colorOperates = null
        this.isEdit = false
        if (this.isCopy || !this.$route.params.id) {
          this.fetchLog(
            this.getLogMessages('UPDATE', '/customerOrder/soPrint/printApply/submit', 'customerOrder'),
            { id: res.data },
            JSON.stringify({
              beforeText: `在'客户订单-印花SO申请'提交一条记录`,
              beforeCode: { id: res.data }
            })
          )
          this.$router.push(`/customer-order/analysis-application/printing-application/detail/${res.data}/show`)
        } else {
          this.fetchLog(
            this.getLogMessages('UPDATE', '/customerOrder/soPrint/printApply/submit', 'customerOrder'),
            { id: res.data },
            JSON.stringify({
              beforeText: `在'客户订单-印花SO申请'提交一条记录`,
              beforeCode: { id: res.data }
            })
          )
          this.setDetailData(params)
          this.changeOptionStatus()
          this.getDetailData(this.$route.params.id)
        }
      } else {
        this.fetchLog(
          this.getLogMessages('UPDATE', '/customerOrder/soPrint/printApply/submit', 'customerOrder'),
          { id: this.$route.params.id },
          JSON.stringify({
            beforeText: `在'客户订单-印花SO申请'提交一条记录`,
            beforeCode: { id: this.$route.params.id }
          })
        )
        this.getDetailData(this.$route.params.id)
      }
    },
    // 复制印花订单
    copyPrint() {
      this.isCopy = true
      this.detailData.id = ''
      this.setEdit()
    },
    // 删除印花订单
    async deleteClick() {
      this.$confirm('确认删除该印花SO申请单？', '提示', {
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
    // 删除印花订单
    async deletePrint() {
      const res = await printDelete({ id: this.detailData.id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.fetchLog(
        this.getLogMessages('DEL', '/customerOrder/soPrint/printApply/delete', 'customerOrder'),
        { id: this.detailData.id },
        JSON.stringify({
          beforeText: `在'客户订单-印花SO申请'删除一条记录`,
          beforeCode: { id: this.detailData.id }
        })
      )
      this.$router.push('/customer-order/analysis-application/printing-application')
    },
    // 返回到列表页
    backClick() {
      this.$router.push('/customer-order/analysis-application/printing-application')
    },
    // 取消返回到列表页
    cancelClick() {
      this.isEdit = false
      if ((this.$route.params.id && this.$route.path.includes('edit')) || !this.$route.params.id) {
        this.$router.push('/customer-order/analysis-application/printing-application')
      }
      if ((this.$route.params.id && this.$route.path.includes('show')) || this.isCopy) {
        this.basicData = [...this.baseData, ...this.detailUploadData]
        this.setDetailData(this.copyDetailData)
        this.basicData.forEach(item => {
          item.disabled = true
          // item.placeholder = ''
        })
        this.inventoryOperates = null
        this.colorOperates = null
        this.$router.push(`/customer-order/analysis-application/printing-application/detail/${this.$route.params.id}/show`)
        this.inventoryOperates = null
        this.colorOperates = null
        this.getDetailData(this.$route.params.id)
      }
    },
    // 复制行数据
    copyRowData(scope, type) {
      if (type === 'inventory') {
        this.inventoryData = [...this.inventoryData, ...[{ ...scope.row, code: this.inventoryData.length + 1 }]]
      } else if (type === 'color') {
        this.colorData = [...this.colorData, ...[{ ...scope.row, code: this.colorData.length + 1 }]]
      }
    },
    // 删除行数据
    deleteRowData(scope, type) {
      if (type === 'inventory') {
        this.$confirm('确认删除该条库存抽用数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          cancelButtonClass: 'btn-cancel'
        })
          .then(() => {
            let flag = false
            this.colorData.forEach(item => {
              if (item.cloth.value === scope.row.cloth.value) {
                flag = true
              }
            })
            if (flag) {
              this.$message.error('已引用库存抽用中的布类不能删除')
              return
            }
            this.inventoryData.splice(scope.$index, 1)
            this.inventoryData.forEach((item, index) => {
              item.code = index + 1
            })
          })
          .catch(() => {
            this.$message({ type: 'info', message: '已取消删除' })
          })
      } else if (type === 'color') {
        this.$confirm('确认删除该条颜色信息数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          cancelButtonClass: 'btn-cancel'
        })
          .then(() => {
            this.colorData.splice(scope.$index, 1)
            this.colorData.forEach((item, index) => {
              item.code = index + 1
            })
          })
          .catch(() => {
            this.$message({ type: 'info', message: '已取消删除' })
          })
      }
    }
  }
}
</script>

<style lang="scss">
.printing-detail {
  padding-bottom: 60px;
  .custom-form {
    margin: 0 20px;
  }
  .el-input.is-disabled .el-input__inner {
    color: #666666;
  }
  .el-form--inline .el-form-item {
    margin-right: 0;
  }
  .detailClass .el-input__inner {
    padding: 0;
    border: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    background: #fff;
    font-size: 14px;
  }
  .detailClass .el-form-item {
    margin-bottom: 14px;
  }
  .editClass .el-form-item {
    margin-bottom: 20px;
  }
  .detailClass .el-input__icon {
    display: none;
  }
  .basic-data .el-input.is-disabled .el-input__suffix {
    display: none;
  }
  .basic-data {
    padding-bottom: 20px;
  }
  .status-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 20px 20px 0 20px;
    .detail-code {
      font-size: 18px;
      color: #151222;
    }
    .copy-code {
      font-size: 12px;
      color: #777777;
    }
    .detail-info {
      font-size: 12px;
      color: #666666;
      span {
        margin-left: 5px;
      }
    }
  }
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
        font-weight: 500;
      }
      .el-button {
        display: flex;
        span {
          font-size: 14px;
        }
      }
    }
    .basic-top {
      border-bottom: 1px solid #EEEFF0;
      margin-bottom: 20px;
    }
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
  .fixed-footer {
    width: calc(100% - 54px)!important;
  }
  .printColorDesign {
    width: 80px;
  }
  .uploadFile {
    min-width: 150px;
  }
  .inputWidth {
    width: 60%!important;
  }
  .table tr:nth-child(even) {
    background: #ffffff;
  }
  .el-upload-list {
    display: flex;
    flex-wrap: wrap;
    .el-upload-list__item {
      width: 20%;
      margin-right: 4%;
      margin-top: 10px;
      a i {
        color: #BBC2D0;
      }
    }
  }
  .el-form-item__label {
    min-width: 82px;
  }
  .page-table tbody .el-table__row td {
    border-bottom: 1px solid #dfe6ec;
  }
  .el-table th.is-leaf {
    border-bottom: 0;
  }
}
</style>
