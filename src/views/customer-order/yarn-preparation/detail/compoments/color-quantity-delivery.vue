<!--
 * @Author: xj
 * @Description: 颜色数量交期
 * @Date: 2021-04-26 20:22:34
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-15 17:20:15
 * @FilePath: d:\yangban\src\views\customer-order\yarn-preparation\detail\compoments\color-quantity-delivery.vue
-->
<template>
  <div class="yarnPreparation-color">
    <div class="color-header color-header-colors">
      <div class="left">
        <span>订单信息</span>
      </div>
      <div class="right">
        <div class="date-title">
          <span class="data-font total">总数量(KG)：{{ $utils.priceFormat($utils.getFloat(comTotal, 2)) }}</span>
        </div>
        <el-button
          v-if="isEdit"
          type="primary"
          size="mini"
          @click="addAllInfo"
        >新增</el-button>
      </div>
    </div>

    <div class="page-tables page-table-border">
      <cs-custom-table
        ref="allColumnslData"
        :header-cell-style="headerCellStyle"
        :columns="allColumns"
        :data-source="materialData"
        :operates="allOperates"
        :pagination="pagination"
        edit-type="pop"
      />
    </div>
    <!-- 原料信息弹窗 -->
    <div class="pop allPop">
      <cs-custom-pop ref="allPops" :options="allPopOptions" />
    </div>
    <!-- 预计使用日期要求弹窗 -->
    <div class="pop">
      <cs-custom-pop ref="UsePlan" :options="UsePlan" />
    </div>
    <!-- 纱线编码弹窗 -->
    <codePop
      ref="codePop"
      :tab="tab"
      :set-parent-data-handle="setParentHandle"
    />
  </div>
</template>

<script>
import { PublicCustomer } from '@/views/customer-order/public/index'
import { setOrderFun } from '@/views/customer-order/public/api/mou'
import codePop from '../compoments/codePop'
export default {
  name: 'YansQuantityDeliver',
  components: {
    codePop
  },
  mixins: [PublicCustomer, setOrderFun],
  props: {
    status: {
      type: String
    },
    rowIndex: {
      type: Number
    },
    isEdit: {
      type: Boolean
    },
    data: {
      type: Array
    },
    maxMater: {
      type: String
    },
    rule: {
      type: Object,
      default: () => ({})
    },
    syncMoudleDataHandle: {
      type: Function
    },
    setParentDataHandle: {
      type: Function
    }
  },
  data() {
    // table表头颜色
    const headerCellStyle = {
      'background': '#F5F7FA'
    }
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['change'] })
    // 当前时间之前的时间不能选择
    const pickerOptionsBefore = {
      disabledDate(time) {
        return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
      }
    }
    // 最大999.99正则
    const ismax999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,7})|(0{1}))(\.\d{1,2})?$/, message: '0~99999999.99', trigger: ['blur'] })
    // 新增原料信息
    const allColumns = {
      _code: {
        prop: 'code',
        label: '序号',
        formater: (scope) => {
          return scope.row.seq
        }
      },
      _yarnCode: {
        prop: 'yarnCode',
        label: '纱线编码',
        minWidth: '120px',
        showOverflowTooltip: true
      },
      _type: {
        prop: 'type',
        label: '纤维类型',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.getnaturalFiber(scope.row.type)
        }
      },
      _yarnName: {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '200px',
        showOverflowTooltip: true
      },
      _yarnProperty: {
        prop: 'yarnProperty',
        label: '纱属性',
        minWidth: '240px',
        showOverflowTooltip: true
      },
      _certificate: {
        prop: 'certificate',
        label: '证书要求',
        minWidth: '160px',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.certificate ? scope.row.certificate.label : ''
        }
      },
      _supplier: {
        prop: 'supplier',
        label: '供应商',
        minWidth: '140px',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.supplier ? scope.row.supplier.label : ''
        }
      },
      _supplierYarnCode: {
        prop: 'supplierYarnCode',
        label: '供应商纱线编码',
        minWidth: '140px',
        showOverflowTooltip: true
      },
      _yarnTotal: {
        prop: 'yarnTotal',
        label: '数量',
        minWidth: '120px',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnTotal ? this.$utils.priceFormat(this.$utils.getFloat(scope.row.yarnTotal, 2)) : ''
        }
      },
      _seqIndex: {
        prop: 'seqIndex',
        label: '子序号',
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div>'
          const com = scope.row.yarnMaterialInfoPlanList
          if (com && com.length) {
            com.forEach(v => {
              html += `<p class="lihe-23px">${scope.row.seq + '-' + v.seq}</p>`
            })
            html += '</div>'
          }
          return html
        }
      },
      _estimateUseTime: {
        prop: 'estimateUseTime',
        label: '预计使用交期',
        showOverflowTooltip: true,
        minWidth: '140px',
        formater: (scope) => {
          let html = '<div>'
          const com = scope.row.yarnMaterialInfoPlanList
          if (com && com.length) {
            com.forEach(v => {
              html += `<p  class="lihe-23px">${v.estimateUseTime ? this.$filters.parseTime(v.estimateUseTime + '', '{y}-{m}-{d}') : '-'}</p>`
            })
            html += '</div>'
          }
          return html
        }
      },
      _estimateUserAmount: {
        prop: 'estimateUserAmount',
        label: '预计使用量',
        minWidth: '120px',
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div>'
          const com = scope.row.yarnMaterialInfoPlanList
          if (com && com.length) {
            com.forEach(v => {
              html += `<p class="lihe-23px">${
                v.estimateUserAmount ? this.$utils.priceFormat(this.$utils.getFloat(v.estimateUserAmount, 2)) : ''}</p>`
            })
            html += '</div>'
          }
          return html
        }
      },
      _productionStatus: {
        prop: 'productionStatus',
        label: '生产状态',
        showOverflowTooltip: true,
        formater: (scope) => {
          return '未安排'
        }
      }
    }

    const allOperatesData = [
      {
        label: '编辑',
        isShow: true,
        handle: scope => {
          this.$set(this.allPopOptions, 'saveAndadd', null)
          this.allPopHandle('编辑原料信息')
          if (scope.row.maxMaterialInfoPlanSeq) {
            const sm = scope.row.maxMaterialInfoPlanSeq.split('-')
            if (sm.length > 1) {
              this.maxMaterialInfoPlanSeq = sm[1]
            } else {
              this.maxMaterialInfoPlanSeq = scope.row.maxMaterialInfoPlanSeq
            }
          }
          const om = this.allPopOptions.content
          this.$set(om._type, 'isShow', false)
          this.$set(om._yarnMaterialInfoPlanList, 'dataSource', scope.row.yarnMaterialInfoPlanList || [])// 预计使用量List
          this.$set(om._supplier, 'dataSource', scope.row.supplier && scope.row.supplier.value ? [scope.row.supplier] : [])// 供应商
          this.$set(om._certificate, 'dataSource', scope.row.certificate && scope.row.certificate.value ? [scope.row.certificate] : [])// 证书要求
          this.setFormDatas({ ...scope.row, index: scope.$index }, 'allOper')
        }
      },
      {
        label: '删除',
        isShow: true,
        style: { 'color': '#FE4949' },
        handle: scope => {
          this.$confirm('确认删除该条原料信息？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            cancelButtonClass: 'btn-cancel'
          })
            .then(() => {
              this.materialData.splice(scope.$index, 1)
              this.resetSeqCode(this.materialData)
              this.setYarnTotal()
            })
            .catch(() => {
              this.$message({ type: 'info', message: '已取消删除' })
            })
        }
      }
    ]
    const allOperates = {
      label: '操作',
      width: '120',
      fixed: 'right',
      dataSource: allOperatesData
    }
    // 预计使用日期  侧边栏表格list
    const naturalFiberColumns = {
      _seq: {
        prop: 'seq',
        label: '序号',
        showOverflowTooltip: true
      },
      _estimateUseTime: {
        prop: 'estimateUseTime',
        label: '交期',
        labelClassName: 'lableStyle',
        className: 'noLableStyle',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.estimateUseTime ? this.$filters.parseTime(scope.row.estimateUseTime + '', '{y}-{m}-{d}') : ''
        }
      },
      _estimateUserAmount: {
        prop: 'estimateUserAmount',
        labelClassName: 'lableStyle',
        className: 'noLableStyle',
        label: '预计使用量(KG)',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.$utils.priceFormat(scope.row.estimateUserAmount)
        }
      }
    }
    const naturalFiberOperatesData = [
      {
        label: '编辑',
        isShow: true,
        handle: scope => {
          this.$set(this.UsePlan, 'saveAndadd', null)
          this.naturalFiberHandle('编辑使用计划')
          this.setFormDatas({ ...scope.row }, 'shiYong')
        }
      },
      {
        label: '删除',
        isShow: true,
        style: { 'color': '#FE4949', 'line-height': '24px' },
        handle: (scope, form, formDatas, setFormDatas) => {
          this.$confirm('确认删除该条使用计划？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            cancelButtonClass: 'btn-cancel'
          })
            .then(() => {
              const newData = this.$utils.deepClone(formDatas)
              newData.yarnMaterialInfoPlanList.splice(scope.$index, 1)
              this.resetQuantitySeqCode(newData.yarnMaterialInfoPlanList)
              this.allPopOptions.content._yarnMaterialInfoPlanList.dataSource = newData.yarnMaterialInfoPlanList
            })
            .catch(() => {
              this.$message({ type: 'info', message: '已取消删除' })
            })
        }
      }
    ]
    const naturalFiberOperates = {
      label: '操作',
      width: '120',
      dataSource: naturalFiberOperatesData
    }
    const allContent = {
      _type: {
        prop: 'type',
        itemType: 'tabs',
        label: '',
        itemStyle: { 'margin-bottom': '10px' },
        labelWidth: '0',
        dataSource: [{
          label: '天然纤维',
          value: '0'
        }, {
          label: '化学纤维',
          value: '1'
        }, {
          label: '组合纱线',
          value: '2'
        }],
        change: (tab) => {
          this.tabChange(tab)
        }
      },
      _yarnCode: {
        prop: 'yarnCode',
        itemType: 'input',
        itemStyle: { width: '45%', 'margin-right': '2%' },
        className: 'cursorHandel',
        showOverflowTooltip: true,
        label: '纱线编码',
        width: '140px',
        placeholder: '点击选择纱线编码',
        clearable: true,
        clear: (form, formDatas, setFormDatas, scope) => {
          this.$nextTick(() => {
            this.allPopOptions.formDatas = {}
          })
        },
        rules: [commonBlurReg],
        focus: (event, form, formDatas, setFormDatas, scope) => {
          event.target.blur()
          this.$refs.codePop.popHandle()
        }
      },
      _yarnName: {
        prop: 'yarnName',
        itemType: 'input',
        disabled: true,
        readonly: true,
        title: true,
        showOverflowTooltip: true,
        itemStyle: { width: '45%', display: 'inline-block', 'margin-right': '2%' },
        label: '纱名',
        style: {
          color: 'rgb(24, 144, 255)',
          cursor: 'pointer'
        }
      },
      _yarnProperty: {
        prop: 'yarnProperty',
        itemType: 'input',
        itemStyle: { width: '45%', display: 'inline-block', 'margin-right': '2%' },
        label: '纱属性',
        disabled: true,
        readonly: true,
        title: true,
        clearable: true
      },
      _certificate: {
        prop: 'certificate',
        itemType: 'select',
        itemStyle: { width: '45%', display: 'inline-block', 'margin-right': '20px', 'margin-bottom': '20px' },
        label: '证书要求',
        clearable: true,
        filterable: true,
        valueType: 'object',
        visibleChange: value => {
          this.getOptionConfigSelect({ pageName: '备纱单', fieldName: '证书要求' }, 'naturalFiber')
        },
        dataSource: [],
        formater: (scope) => {
          return this.$utils.priceFormat(scope.row.certificate)
        }

      },
      _supplier: {
        prop: 'supplier',
        itemType: 'select',
        itemStyle: { width: '45%', display: 'inline-block', 'margin-right': '20px', 'margin-bottom': '20px' },
        label: '供应商',
        filterable: true,
        clearable: true,
        valueType: 'object',
        visibleChange: value => {
          this.getsupplierList({ supplierType: '1', supplierCategory: '0' })
        },
        dataSource: [],
        formater: (scope) => {
          return this.$utils.priceFormat(scope.row.supplier)
        }
      },
      _supplierYarnCode: {
        prop: 'supplierYarnCode',
        itemType: 'input',
        itemStyle: { width: '45%', display: 'inline-block', 'margin-bottom': '20px', 'margin-right': '2%' },
        label: '供应商纱线编码',
        maxlength: 50,
        clearable: true
      },
      _yarnTotal: {
        prop: 'yarnTotal',
        itemType: 'input',
        itemStyle: { width: '45%', display: 'inline-block', 'margin-bottom': '20px', 'margin-right': '2%' },
        label: '数量汇总(KG)',
        formater: (scope) => {
          this.$nextTick(() => {
            return this.$utils.priceFormat(scope.row.yarnTotal)
          })
        },
        // renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
        //   return value
        // },
        disabled: true,
        readonly: true
      },
      _naturalFibeAdd: { // 预计使用日期 新增
        itemType: 'itemview',
        label: '',
        itemStyle: { width: '100%', display: 'flex', 'flex-direction': 'row-reverse', 'margin-bottom': '16px' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<el-button size="mini" type="primary" class="addButton">新增</el-button>`
        },
        handle: () => {
          this.addNaturalFiber()
        }
      },
      _yarnMaterialInfoPlanList: {// 预计使用日期 yarnMaterialInfoPlanList
        prop: 'yarnMaterialInfoPlanList',
        itemType: 'table-form',
        className: 'yarnMaterialInfoleft1',
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        size: 'mini',
        columns: { ...naturalFiberColumns }, // 1509
        dataSource: [], // 1544
        operates: naturalFiberOperates // 1609
      }
    }
    // 新增原料信息操作栏
    const allPopOptions = {
      itemType: 'drawer',
      size: '1000px',
      visible: false,
      title: '新增颜色&数量&交期',
      okText: '保存',
      saveAndaddText: '确定，继续添加',
      saveAndadd: this.saveAndaddNaturalFiber,
      ok: params => {
        const com = this.allPopOptions.content
        const comLenght = com._yarnMaterialInfoPlanList.dataSource
        if (!comLenght || !comLenght.length) {
          this.$message({
            message: '使用计划分录不能为空！',
            type: 'error'
          })
          return false
        } else if (params.supplierYarnCode && ((!params.supplier || !params.supplier.value))) {
          this.$message({
            message: '供应商不能为空！',
            type: 'error'
          })
          return false
        }
        params.type = this.tab // 类型
        console.log('--------------')
        console.log(params)
        console.log(this.materialData)
        if (this.allPopOptions.title === '新增原料信息') {
          const yarnCodes = this.materialData.filter(n => n.yarnCode === params.yarnCode)
          if (yarnCodes.length) {
            this.$message({ message: '纱线已添加,请勿重复添加！', type: 'error' })
            return
          }
          this.materialData.push(params)
        } else {
          const yarnCodes = this.materialData.filter(n => n.code !== params.code && n.yarnCode === params.yarnCode)
          if (yarnCodes.length) {
            this.$message({ message: '纱线已添加,请勿重复添加！', type: 'error' })
            return
          }
          this.materialData.splice(params.index, 1, params)
        }
        this.resetSeqCode(this.materialData)
        this.allPopHandle()
      },
      cancel: params => {
        this.allPopHandle()
      },
      formDatas: {},
      formOptions: {
        getForm: (form) => {
          this.popForm = form
        }
      },
      content: allContent
    }
    // 预计使用日期弹窗内容
    const UsePlanContent = {
      _estimateUseTime: {
        prop: 'estimateUseTime',
        label: '预计使用日期',
        itemType: 'date',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        clearable: true,
        pickerOptions: pickerOptionsBefore,
        rules: [{ required: true, message: '日期不能为空', trigger: ['change'] }]
      },
      _estimateUserAmount: {
        prop: 'estimateUserAmount',
        itemType: 'input',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        label: '预计使用量',
        rules: [commonBlurReg, ismax999Reg],
        clearable: true
      }
    }
    const saveAndadd = (params, form) => {
      this.saveAndaddFun(params)
    }
    const saveAndaddNaturalFiber = (params, form) => {
      const com = this.allPopOptions.content
      const comLenght = com._yarnMaterialInfoPlanList.dataSource
      if (!comLenght || !comLenght.length) {
        return this.$message.error('使用计划分录不能为空')
      } else if (params.supplierYarnCode && ((!params.supplier || !params.supplier.value))) {
        return this.$message.error('供应商不能为空')
      }
      let validError = false
      form.validate(async valid => {
        validError = valid
      })
      if (!validError) {
        return
      }
      params.type = this.tab // 类型
      if (this.allPopOptions.title === '新增原料信息') {
        const yarnCodes = this.materialData.filter(n => n.yarnCode === params.yarnCode)
        if (yarnCodes.length) {
          this.$message({ message: '纱线已添加,请勿重复添加！', type: 'error' })
          return
        }
        this.materialData.push(params)
      } else {
        const yarnCodes = this.materialData.filter(n => n.code !== params.code && n.yarnCode === params.yarnCode)
        if (yarnCodes.length) {
          this.$message({ message: '纱线已添加,请勿重复添加！', type: 'error' })
          return
        }
        this.materialData.splice(params.index, 1, params)
      }
      this.resetSeqCode(this.materialData)
      // 清空数据
      this.$nextTick(() => {
        this.popForm.resetFields()
        this.allPopOptions.formDatas = {}
        this.allPopOptions.content['_yarnMaterialInfoPlanList'].dataSource = []
      })
    }
    // 使用计划弹窗配置
    const UsePlan = {
      itemType: 'dialog',
      width: '600px',
      visible: false,
      title: '新增使用计划',
      okText: '确定',
      ok: params => {
        if (this.UsePlan.title === '新增使用计划') {
          this.saveAndaddFun(params, '2')
        } else {
          if (this.saveAndaddYan(params)) {
            const com = this.allPopOptions.content._yarnMaterialInfoPlanList.dataSource
            com.splice(params.seq - 1, 1, params)
            this.numberForEach()
            this.resetQuantitySeqCode(com)
            this.naturalFiberHandle()
          }
        }
      },
      saveAndaddText: '确定，继续添加',
      saveAndadd,
      cancel: params => {
        this.naturalFiberHandle()
      },
      formDatas: {},
      formOptions: {
        getForm: (form) => {
          this.UsePlanForm = form
        }
      },
      content: UsePlanContent
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
      saveAndaddNaturalFiber,
      headerCellStyle,
      allColumns,
      allPopOptions,
      allOperatesData,
      materialData: [], // 原料信息list data
      allOperates, // 新增原料信息操作栏
      allContent,
      pagination,
      naturalFiberOperates,
      UsePlan, // 使用计划弹窗配置
      UsePlanContent,
      tab: '0',
      UsePlanForm: null,
      maxMaterialInfoSeq: '0', // 外层传入的子序号
      maxMaterialInfoPlanSeq: 0, // 原料使用计划分录最大序号
      comTotal: 0,
      materialInfoPageObj: {} // 弹窗存储数据
    }
  },
  computed: {
    getTableFormSource() { // 生产日期表格数据
      return this.allOperates.content._yarnMaterialInfoPlanList.dataSource
    }
  },
  watch: {
    isEdit: {
      handler(val, oldVal) {
        this.changeStatus(val)
      },
      deep: true,
      immediate: true
    },
    data: { // xj
      handler(val, oldVal) {
        if (val && val.length) {
          this.materialData = this.$utils.deepClone(val)
          if (val[0].maxMaterialInfoPlanSeq) {
            const sm = val[0].maxMaterialInfoPlanSeq.split('-')
            this.maxMaterialInfoPlanSeq = sm[0]
          }
          this.materialData.forEach((it) => {
            const daom = it.yarnMaterialInfoPlanList
            daom && daom.length && daom.forEach((im) => {
              const p = im.seq && im.seq.split('-') || []
              if (p.length > 1) {
                im.seq = p[1] || ''
              }
            })
          })
        } else {
          this.maxMaterialInfoPlanSeq = 0
          this.materialData = []
        }
      },
      deep: true,
      immediate: true
    },
    maxMater: {// 外层序号
      handler(val, oldVal) {
        const newData = JSON.parse(JSON.stringify(val))
        this.maxMaterialInfoSeq = newData
      },
      deep: true,
      immediate: true
    },
    materialData: {// xj
      handler(val) {
        console.log('Sssssonm', val)
        this.$nextTick(() => {
          this.setYarnTotal()
          this.syncMoudleDataHandle('colormaterialData', val)
        })
      },
      deep: true,
      immediate: true
    },
    comTotal: {// xjw
      handler(val) {
        this.setParentDataHandle('totalQuantity', val)
      },
      deep: true
    },
    rule: {
      handler(v) {
      },
      immediate: true
    }
  },
  mounted() {

  },
  methods: {
    changeStatus(val) {
      this.$set(this.allOperates, 'isShow', val)
    },
    // 新增颜色数量交期
    addAllInfo() {
      this.$set(this.allPopOptions, 'saveAndadd', this.saveAndaddNaturalFiber)
      this.allPopHandle('新增原料信息')
      this.maxMaterialInfoPlanSeq = '0'
      this.$set(this.allPopOptions.content._type, 'isShow', true)
      const com = this.allPopOptions.content
      this.$set(com._yarnMaterialInfoPlanList, 'dataSource', [])
      this.$nextTick(() => {
        this.setYarnTotal()
        this.allPopOptions.formDatas = { type: this.tab }
      })
    },
    // 原料信息弹窗显隐
    allPopHandle(val) {
      this.$set(this.allPopOptions, 'visible', !this.allPopOptions.visible)
      this.$nextTick(() => {
        this.allPopOptions.formDatas = {}
      })
      if (val) {
        this.$set(this.allPopOptions, 'title', val)
      }
    },
    // 使用计划显隐
    naturalFiberHandle(val) {
      this.$set(this.UsePlan, 'visible', !this.UsePlan.visible)
      if (val) {
        this.$set(this.UsePlan, 'title', val)
      }
    },
    addNaturalFiber() {
      this.naturalFiberHandle('新增使用计划')
      this.$set(this.UsePlan, 'formDatas', {})
    },
    tabChange(tab) {
      this.tab = tab
      if (this.allPopOptions.title === '新增原料信息') {
        this.allPopOptions.formDatas = {}
        this.$nextTick(() => {
          this.allPopOptions.formDatas = { type: tab }
          this.allPopOptions.content._yarnMaterialInfoPlanList.dataSource = []
          this.popForm.clearValidate()
        })
      }
    },
    setParentHandle(key, data) { // 同步右侧各个模块的部分字段数据
      const com = this.allPopOptions.formDatas
      this.materialInfoPageObj = this.$utils.deepClone(data)
      if (key === 'materialInfoPage') {
        this.$set(com, 'yarnCode', data.yarnCode || '')
        this.$set(com, 'yarnName', data.yarnName || '')
        this.$set(com, 'yarnProperty', data.yarnProperty || '')
        this.$set(com, 'yarnProperty', data.yarnProperty || '')
        this.setFormDatas({ ...this.materialInfoPageObj }, 'allOper')
      }
    },
    // 供应商
    getsupplierList(data) {
      const com = this.allPopOptions.content
      this.supplierListMethod(data).then(res => {
        this.$set(com._supplier, 'dataSource', res)
      })
    },
    // 选项配置下拉
    getOptionConfigSelect(data, type) {
      const com = this.allPopOptions.content
      this.getOptionConfig(data).then(res => {
        if (type === 'naturalFiber') { // 证书要求
          this.$set(com._certificate, 'dataSource', res)
        }
      })
    },

    saveAndaddYan(params) { // 新增交期数量的保存验证、
      let isYan = true
      const ismax999Reg = /^(([1-9]{1}\d{0,7})|(0{1}))(\.\d{1,2})?$/
      if (!params.estimateUseTime) {
        this.$message({
          message: '预计使用日期不能为空！',
          type: 'error'
        })
        isYan = false
      } else if (!params.estimateUserAmount) {
        this.$message({
          message: '预计使用量不能为空！',
          type: 'error'
        })
        isYan = false
      } else if (params.estimateUserAmount && !ismax999Reg.test(params.estimateUserAmount)) {
        this.$message({
          message: '预计使用量0-99999999.99！',
          type: 'error'
        })
        isYan = false
      }
      return isYan
    },
    // 添加的函数
    saveAndaddFun(params, type = 0) {
      if (this.saveAndaddYan(params)) {
        this.$set(this.UsePlan, 'formDatas', {})
        const com = this.allPopOptions.content._yarnMaterialInfoPlanList.dataSource || []
        com.push({ ...params, seq: com.length + 1 })
        this.$message({
          type: 'success',
          message: '添加成功，请继续添加'
        })
        this.numberForEach()
        this.$nextTick(() => {
          this.UsePlanForm.clearValidate()
        })
        this.resetQuantitySeqCode(com)
        type && this.naturalFiberHandle()
      }
    },
    // 循环计算数量汇总(KG)
    numberForEach() {
      const com = this.allPopOptions.content._yarnMaterialInfoPlanList.dataSource || []
      // let numDatas =
      let num = 0
      com && com.length && com.forEach(v => {
        num += Number(v.estimateUserAmount)
      })
      this.allPopOptions.formDatas = { yarnTotal: num + '' || '' }
    },
    // 点击编辑时处理数据
    setFormDatas(params, type) {
      setTimeout(() => {
        if (type === 'shiYong') {
          this.$set(this.UsePlan, 'formDatas', params)
        } else if (type === 'allOper') {
          this.$set(this.allPopOptions, 'formDatas', params)
        }
      }, 0)
    },
    // 处理颜色数量交期中序号code、seq(外层) xj
    resetSeqCode(dataList) {
      let newNum = 0
      dataList.forEach((v, index) => {
        if (!v.orderId) {
          newNum += 1
          v.seq = this.maxMaterialInfoSeq * 1 + newNum
        }
        v.code = index + 1
      })
    },
    // 处理数量交期中序号code、seq(内层)
    resetQuantitySeqCode(dataList) {
      let newNum = 0
      dataList.forEach((v, index) => {
        if (!v.id) {
          newNum += 1
          v.seq = this.maxMaterialInfoPlanSeq * 1 + newNum
        }
        v.edit = this.isEdit
        v.code = index + 1
      })
    },
    setYarnTotal() { // 设置原料信息的总数量
      const num = this.$utils.deepClone(this.materialData || [])
      let Total = 0
      if (num && num.length) {
        num.forEach(it => { Total = Number(Total) + Number(it.yarnTotal) })
      }
      this.comTotal = Total + ''
      return Total || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.yarnPreparation-color {
  width: 100%;
  background: #ffffff;
  .color-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 15px 20px;
    span {
      font-size: 16px;
    }
    .el-button {
      span {
        font-size: 14px;
        font-weight: normal;
      }
    }
    .left {
      display: flex;
      align-items: center;
      .title {
        margin-right: 40px;
      }
      .date-title {
        position: relative;
        .item-title::before {
          display: block;
          content: '*';
          position: absolute;
          left: -8px;
          color: #ff4444;
        }
      }
    }
    .right {
      display: flex;
      align-items: center;
      .total {
        margin: 0 20px;
      }
    }
  }
    .page-table-border{
      padding: 0 10px;
    /deep/tbody .el-table__row td{
      border-bottom-width: 1px!important;
      // padding: 0 !important;
    }
  }
}
</style>

<style lang="scss">
.yarnPreparation-color {
  .cursorHandel {
    input {
      cursor: pointer;
    }
  }
  .printColorDesign {
    width: 36px;
    height: 36px;
  }
  .lihe-23px{
    line-height: 23px;
    margin: 3px 0;
  }
  .yarnMaterialInfoleft1{
    .el-table__header-wrapper .has-gutter th{
      height: 44px;
      font-size: 14px;
    }
  }
}
</style>
