/**
 * @Description: 数量交期组件
 * @author Roman
 * @date 2021-05-06 15:17:14
 * @edit 2021-05-06 15:17:14
*/
<template>
  <!-- 数量交期 -->
  <div class="order-items">
    <div class="header-top">
      <span style="border-bottom: 1px solid #EEEFF0;display: block;padding: 15px 0;width: 100%;font-weight: 400;">数量&交期</span>
    </div>
    <div class="info">
      <cs-custom-form ref="quantityDelivery" :data-source="formDtaSource" :options="formOptions" :form-datas="formDatas" />
    </div>
    <div class="table page-table-border">
      <div class="right">
        <el-button v-if="isEdit&&getShowAddBtn" type="primary" size="mini" @click="add">新增</el-button>
      </div>
      <cs-custom-table
        ref="allColumnslData"
        tooltip-effect="light"
        :header-cell-style="headerCellStyle"
        :header-cell-class-name="isSing"
        :columns="tableColumns"
        :data-source="tableDataSource"
        :operates="tableOperates"
        edit-type="pop"
      />
      <cs-custom-pop :options="quantityDeliveryPopOptions" />
    </div>
  </div>
</template>

<script>

// import preview from '@/views/customer-order/public/components/preview'
import { queryUnit } from './api'
import { PublicCustomer } from '@/views/customer-order/public/index'

export default {
  name: 'QuantityDeliver',
  components: {
    // choosePop
  },
  mixins: [PublicCustomer],
  props: {
    status: {
      type: String
    },
    greyClothCode: {
      type: String
    },
    addColorQuantityDelivery: {
      type: Object
    },
    taxRate: {
      type: [Number, String]
    },
    suggestWidth: {
      type: [Number, String]
    },
    suggestWidthUnit: {
      type: [Number, String]
    },
    weightBefore: {
      type: [Number, String]
    },
    currencyCode: {
      type: String
    },
    rowIndex: {
      type: Number
    },
    currencySeq: {
      type: Number
    },
    isEdit: {
      type: Boolean
    },
    data: {
      type: Object
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
    },
    getShowAddBtn: {
      type: Boolean
    }
  },
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    // const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const priceReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,4})?$/, message: '0~999.9999', trigger: ['blur'] })
    const ismax999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,7})|(0{1}))(\.\d{1,2})?$/, message: '0~99999999.99', trigger: ['blur'] })

    const headerCellStyle = {
      'background': '#F5F7FA'
    }

    // 当前时间之前的时间不能选择
    const pickerOptionsBefore = {
      disabledDate(time) {
        return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
      }
    }

    const formDtaSource = {
      _customerOrderCode: {
        prop: 'customerOrderCode',
        itemType: this.inputTypeChange,
        style: { width: '60%' },
        itemStyle: { width: '33%' },
        label: '客户单号',
        title: true,
        maxlength: 50,
        clearable: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value
        }
      },
      _styleNumber: {
        prop: 'styleNumber',
        itemType: this.inputTypeChange,
        style: { width: '60%' },
        itemStyle: { width: '33%' },
        label: '款号',
        title: true,
        clearable: true,
        maxlength: 50,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value
        }
      },
      _customerClothNumber: {
        prop: 'customerClothNumber',
        itemType: this.inputTypeChange,
        style: { width: '60%' },
        itemStyle: { width: '33%' },
        label: '客户布号',
        clearable: true,
        maxlength: 50,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value
        }
      },
      _unit: {
        prop: 'unit',
        itemType: this.selectTypeChange,
        itemStyle: { 'width': '33%' },
        style: { 'width': '60%' },
        placeholder: '输入文字模糊查询',
        label: '单位',
        valueType: 'object',
        clearable: true,
        filterable: true,
        change: (value) => {
          this.unitChange(value)
        },
        rules: [commonChangeReg],
        visibleChange: (value, val) => {
          // this.setReferencePlate()
          // this.queryUnitSelect()
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? value.label : ''
        },
        dataSource: []
      },
      _priceTax: {
        prop: 'priceTax',
        itemType: this.inputTypeChange,
        style: { width: '60%' },
        itemStyle: { width: '33%' },
        label: '单价(含税)',
        rules: [commonChangeReg, priceReg],
        clearable: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return this.currencyCode ? this.$utils.priceFormat(value) ? `${this.currencyCode}${this.$utils.priceFormat(value)}` : '' : this.$utils.priceFormat(value)
        },
        change: (value) => {
          this.priceTaxChange(value)
        }
      },
      _price: {
        prop: 'price',
        itemType: this.inputTypeChange,
        style: { width: '60%' },
        itemStyle: { width: '33%' },
        label: '单价(不含税)',
        // rules: [priceReg],
        clearable: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return this.currencyCode ? this.$utils.priceFormat(value) ? `${this.currencyCode}${this.$utils.priceFormat(value)}` : '' : this.$utils.priceFormat(value)
        },
        change: (value) => {
          this.priceChange(value)
        }
      },
      _estimateOrderDate: {
        prop: 'estimateOrderDate',
        label: '预计下单日期',
        itemType: this.dateTypeChange,
        style: { width: '60%' },
        itemStyle: { width: '33%' },
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        clearable: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? this.$utils.parseTime(value, '{y}-{m}-{d}') : ''
        },
        pickerOptions: pickerOptionsBefore,
        rules: [{ required: true, message: '日期不能为空', trigger: ['change'] }]
      },
      _totalQuantity: {
        prop: 'totalQuantity',
        label: '数量合计',
        itemType: 'itemview',
        style: { width: '60%' },
        itemStyle: { width: '33%' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value
        }
      },
      _totalAuxiliaryQuantity: {
        prop: 'totalAuxiliaryQuantity',
        itemType: 'itemview',
        style: { width: '60%' },
        itemStyle: { width: '33%' },
        label: '辅助数量合计(KG)',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value
        }
      }
    }
    const tableColumns = {
      _code: {
        prop: 'code',
        label: '序号',
        minWidth: '50',
        formater: (scope) => {
          return this.currencySeq + '-' + scope.row.seq
        }
      },
      _estimateOutDate: {
        prop: 'estimateOutDate',
        label: '预计出货日期',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.$utils.parseTime(scope.row.estimateOutDate, '{y}-{m}-{d}')
        }
      },
      _estimateOutQuantity: {
        prop: 'estimateOutQuantity',
        label: '预计出货数量',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.estimateOutQuantity
        }
      },
      _auxiliaryQuantity: {
        prop: 'auxiliaryQuantity',
        label: '辅助数量(KG)',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.auxiliaryQuantity
        }
      },
      _produceStatus: {
        prop: 'produceStatus',
        label: '生产状态',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return '生产状态'
        }
      }
    }

    const tableOperates = {
      label: '操作',
      width: '120',
      isShow: false,
      dataSource: [{
        label: '编辑',
        isShow: true,
        handle: scope => {
          this.popHandle('edit')
          // console.log(scope.row)
          const com = { ...scope.row, inx: scope.$index }
          this.quantityDeliveryPopOptions.formDatas = com
          this.quantityDeliveryPopOptions.saveAndadd = null
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        isShow: true,
        handle: scope => {
          this.$confirm('确认删除该条数量&交期数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            cancelButtonClass: 'btn-cancel'
          }).then(() => {
            this.tableDataSource.splice(scope.$index, 1)
            this.resetSeqCode(this.tableDataSource)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      }
      ]
    }

    // 交期数量弹窗内容
    const quantityDeliveryContent = {
      _delivery: {
        prop: 'estimateOutDate',
        label: '预计出货日期',
        itemType: 'date',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        clearable: true,
        pickerOptions: pickerOptionsBefore,
        rules: [{ required: true, message: '日期不能为空', trigger: ['change'] }]
      },
      _quantity: {
        prop: 'estimateOutQuantity',
        label: '预计出货数量',
        itemType: 'input',
        rules: [commonChangeReg, ismax999Reg],
        clearable: true,
        change: (data, form, formDatas, setFormDatas) => {
          this.quantityDeliveryChange(data, form, formDatas, setFormDatas)
        },
        formater: (scope) => {
          return this.$utils.priceFormat(scope.row.quantity)
        }
      },
      _auxiliaryQuantity: {
        prop: 'auxiliaryQuantity',
        label: '辅助数量',
        itemType: 'itemview',
        clearable: true,
        rules: [commonChangeReg],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value
        }
      }
    }
    // 交期数量弹窗配置
    const quantityDeliveryPopOptions = {
      itemType: 'drawer',
      visible: false,
      title: '数量&数量',
      okText: '保存',
      ok: params => {
        const flag = this.validateDate(params)
        if (!flag) {
          return false
        }
        console.log(params)
        if (this.quantityDeliveryPopOptions.title === '新增数量&数量') {
          this.tableDataSource.push({ ...params, produceStatus: 0 })
          this.resetSeqCode(this.tableDataSource)
        } else {
          this.tableDataSource.splice(params.code - 1, 1, { ...params, produceStatus: 0 })
          this.resetSeqCode(this.tableDataSource)
        }
        console.log(this.tableDataSource)
        this.popHandle()
      },
      saveAndaddText: '确定，继续添加',
      saveAndadd: this.quantityAdd,
      cancel: params => {
        this.popHandle()
      },
      formDatas: {},
      formOptions: {
        getForm: (form) => { this.form = form }
      },
      content: quantityDeliveryContent
    }
    return {
      quantityDelivery: {},
      popFormDatas: {},
      maxSeq: 0,
      form: null,
      quantityDeliveryPopOptions,
      formDtaSource,
      headerCellStyle,
      tableDataSource: [],
      tableColumns,
      tableOperates,
      originTableOperates: tableOperates,
      formDatas: {},
      formOptions: {
        size: 'small',
        labelWidth: '135px',
        inline: true,
        syncDataHandle: (syncData) => {
          // console.log(syncData)
          this.quantityDelivery = { ...this.quantityDelivery, ...syncData }
          // this.syncMoudleDataHandle('productData', syncData)
        }
      }
    }
  },
  watch: {
    isEdit: {
      handler(val, oldValue) {
        // console.log(val)
        if (val) {
          this.$set(this.tableOperates, 'isShow', true)
        } else {
          this.$set(this.tableOperates, 'isShow', false)
        }
      },
      deep: true,
      immediate: true
    },
    taxRate: {
      handler(val, oldValue) {
        if (val !== oldValue && oldValue !== '' && this.isEdit) {
          this.formDatas = { priceTax: '', price: '' }
        }
      },
      deep: true,
      immediate: true
    },
    data: {
      handler(val, oldVal) {
        console.log(val)
        const defaultData = {
          customerOrderCode: '',
          styleNumber: '',
          customerClothNumber: '',
          totalAmount: 0,
          totalQuantity: 0,
          maxDetailSeq: 0,
          orderDetailId: '',
          priceTax: '',
          price: '',
          quantityDeliveryId: '',
          estimateOrderDate: '',
          totalAuxiliaryQuantity: '',
          unit: '',
          quantityDeliveryDetail: []
        }
        const data = val && Object.keys(val).length ? this.$utils.deepClone(val) : defaultData
        data.quantityDeliveryDetail = data.quantityDeliveryDetail ? data.quantityDeliveryDetail : []
        this.maxSeq = data.maxDetailSeq ? data.maxDetailSeq : 0
        const formDatas = this.$utils.deepClone(data)
        delete formDatas.quantityDeliveryDetail
        this.formDatas = formDatas
        this.tableDataSource = data.quantityDeliveryDetail
        this.quantityDelivery = data
      },
      deep: true,
      immediate: true
    },
    tableDataSource: {
      handler(val, oldValue) {
        let totalQuantity = 0
        let totalAuxiliaryQuantity = 0
        val.forEach(v => {
          totalQuantity += v.estimateOutQuantity * 1
          totalAuxiliaryQuantity += v.auxiliaryQuantity * 1
        })
        totalQuantity = this.$utils.getFloat(totalQuantity, 2)
        totalAuxiliaryQuantity = this.$utils.getFloat(totalAuxiliaryQuantity, 2)
        this.$nextTick(() => {
          this.formDatas = { totalQuantity, totalAuxiliaryQuantity }
          this.$nextTick(() => {
            this.$refs.quantityDelivery.form.clearValidate()
          })
          console.log(val)
          this.quantityDelivery = { ...this.quantityDelivery, quantityDeliveryDetail: val }
        })
      },
      deep: true,
      immediate: true
    },
    quantityDelivery: {
      handler(val, oldValue) {
        this.syncMoudleDataHandle('quantityDelivery', val)
      },
      deep: true,
      immediate: true
    },
    rule: {
      handler(v) {
        if (v && Object.keys(v).length) {
          this.encryptFn(this.formDtaSource, v, 'edit')
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.queryUnitSelect()
  },
  methods: {
    isSing(scope) {
      if (['estimateOutDate', 'estimateOutQuantity'].includes(scope.column.property) && this.isEdit) {
        return 'isSing'
      }
    },
    inputTypeChange() {
      if (this.isEdit) {
        return 'input'
      }
      return 'itemview'
    },
    dateTypeChange() {
      if (this.isEdit) {
        return 'date'
      }
      return 'itemview'
    },
    selectTypeChange() {
      if (this.isEdit) {
        return 'select'
      }
      return 'itemview'
    },
    // 处理数量交期中序号code、seq(内层)
    resetSeqCode(dataList) {
      let newNum = 0
      dataList.forEach((v, index) => {
        if (!v.orderId) {
          newNum += 1
          v.seq = this.maxSeq * 1 + newNum
        }
        v.edit = this.isEdit
        v.code = index + 1
      })
    },
    // 单价(含税)改变计算辅助数量
    priceTaxChange(val) {
      const reg = /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{1,4})?$/
      if (!reg.test(val)) {
        return
      }
      let price = 0
      price = val / (1 + (this.taxRate - 0) / 100)
      price = this.$utils.getFloat(price, 4)
      this.formDatas = { price: price }
    },
    // 单价(不含税)改变计算辅助数量
    priceChange(val) {
      // console.log(123)
      const reg = /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{1,4})?$/ // 2.3.0 注释
      if (!reg.test(val)) {
        return
      }
      let priceTax = 0
      priceTax = val * (1 + (this.taxRate - 0) / 100)
      priceTax = this.$utils.getFloat(priceTax, 4)
      this.formDatas = { priceTax: priceTax }
    },
    async queryUnitSelect() {
      const data = await queryUnit()
      const list = (data.data.filter(item => item.enabled === 'Y') || []).map(v => {
        return {
          label: v.name,
          value: v.uuid
        }
      })
      this.formDtaSource._unit.dataSource = list
      if (!this.quantityDelivery.unit) {
        this.quantityDelivery.unit = list[0]
        this.formDatas = { unit: list[0] }
      }
    },
    add() {
      this.quantityDeliveryPopOptions.saveAndadd = this.quantityAdd
      this.popHandle('add')
    },
    auxiliaryQuantityExpression(quantity, unit) {
      let suggestFabric = ''
      let auxiliaryQuantity = 0
      if (this.suggestWidth && this.suggestWidthUnit) {
        suggestFabric = this.suggestWidthUnit && this.suggestWidthUnit === '"' ? (this.suggestWidth - 0 + 2) : (this.suggestWidth / 2.54 + 2)
      } else {
        suggestFabric = ''
      }
      // console.log(this.quantityDelivery)
      if (unit === '磅') {
        auxiliaryQuantity = quantity * 1 / 2.2046
      } else if (unit === '码' && suggestFabric) {
        auxiliaryQuantity = quantity * 1 * suggestFabric * this.weightBefore * 0.00081925 / 16 / 2.2046
      } else if (unit === '码' && !suggestFabric) {
        auxiliaryQuantity = 0
      } else if (unit === '米' && suggestFabric) {
        auxiliaryQuantity = quantity * 1 / 0.9144 * suggestFabric * this.weightBefore * 0.00081925 / 16 / 2.2046
      } else if (unit === '米' && !suggestFabric) {
        auxiliaryQuantity = 0
      } else if (unit === '千克') {
        auxiliaryQuantity = quantity
      } else {
        auxiliaryQuantity = 0
      }
      return this.$utils.getFloat(auxiliaryQuantity, 2)
    },
    unitChange(val) {
      if (val) {
        // console.log(val)
        // console.log(this.quantityDelivery)
        const data = this.$utils.deepClone(this.tableDataSource)
        const unit = val.label
        data.forEach(v => {
          console.log(v.estimateOutQuantity, unit)
          console.log(this.auxiliaryQuantityExpression(v.estimateOutQuantity, unit))
          v.auxiliaryQuantity = this.auxiliaryQuantityExpression(v.estimateOutQuantity, unit)
        })
        this.tableDataSource = data
      }
    },
    quantityDeliveryChange(data, form, formDatas, setFormDatas) {
      const reg = /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{1,2})?$/
      if (!reg.test(data)) {
        return
      }
      console.log(this.suggestWidth)
      console.log(this.suggestWidthUnit)
      console.log(this.weightBefore)
      const unit = this.quantityDelivery.unit.label
      const auxiliaryQuantity = this.auxiliaryQuantityExpression(data, unit)
      console.log(this.quantityDelivery)
      console.log(auxiliaryQuantity)
      setFormDatas({ auxiliaryQuantity })
    },
    popHandle(type) {
      let title = '新增数量&数量'
      if (type === 'edit') {
        title = '编辑数量&数量'
      }
      this.encryptFn(this.quantityDeliveryPopOptions.content, this.rule, type)
      this.quantityDeliveryPopOptions.visible = !this.quantityDeliveryPopOptions.visible
      this.quantityDeliveryPopOptions.title = title
    },
    quantityAdd(params, form) {
      this.form.validate((valid) => {
        if (valid) {
          const flag = this.validateDate(params)
          if (!flag) {
            return false
          }
          this.tableDataSource.push({ ...params, produceStatus: 0 })
          this.resetSeqCode(this.tableDataSource)
          this.$message({
            type: 'success',
            message: '添加成功，请继续添加'
          })
          this.form.resetFields()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    validateDate(params) {
      let flag = true
      const date = this.$utils.parseTime(params.estimateOutDate, '{y}-{m}-{d}')
      if (this.quantityDeliveryPopOptions.title === '新增数量&数量') {
        this.tableDataSource.forEach(v => {
          if (this.$utils.parseTime(v.estimateOutDate, '{y}-{m}-{d}') === date) {
            flag = false
          }
        })
      } else {
        this.tableDataSource.forEach((v, index) => {
          if (params.hasOwnProperty('inx') && params.inx !== index && this.$utils.parseTime(v.estimateOutDate, '{y}-{m}-{d}') === date) {
            flag = false
          }
        })
      }
      if (!flag) {
        this.$message({
          type: 'error',
          message: '存在相同预计出货日期'
        })
      }
      return flag
    }
  }
}
</script>

<style lang="scss" scoped>
    .order-items {
        background: #ffffff;
        .table{
            padding: 0px 10px 10px;
        }
        .header-top {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px 15px 20px;
            span {
                font-size: 16px;
                display: flex;
                color: #151222;
            }
            .el-button {
                display: flex;
                span {
                    font-size: 14px;
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

        }
        .page-table {
            height: auto;
            border-bottom-width: 1px;
        }
        .right {
            text-align: right;
            padding: 10px;
            margin-right: 20px;
        }
        .borbottom {
            border-bottom: 1px solid #dfe6ec;
        }
        .page-table-border {
            /deep/tbody .el-table__row td {
                height: 50px;
            }
        }
    }

</style>
<style lang="scss">
    table th.isSing div:before {
        content: '*';
        color: red;
    }
</style>
