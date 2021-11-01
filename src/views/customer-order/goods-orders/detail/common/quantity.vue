<!--
 * @Author: xj
 * @Description: 数量交期弹窗
 * @Date: 2021-06-26 09:35:01
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-27 15:43:28
 * @FilePath: d:\erp\src\views\customer-order\goods-orders\detail\common\quantity.vue
-->
<template>
  <!-- 数量交期弹窗 -->
  <div class="pop">
    <cs-custom-pop ref="quantityDeliveryPop" :options="quantityDeliveryPopOptions" />
  </div>
</template>

<script>
import { inputFilter } from '@/views/customer-order/public/api/inputFilter'
export default {
  components: {},
  props: {
    isEdit: {
      type: Boolean
    },
    plateIndexFrom: {
      type: Object
    },
    taxRate: { // 税率
      type: [Number, String]
    },
    suggestWidth: { // 成品幅宽
      type: [Number, String]
    },
    suggestWidthUnit: {// 成品幅宽单位
      type: [Number, String]
    },
    weightBefore: {// 克重
      type: [Number, String]
    },
    popDataFun: {
      type: Function
    },
    unit: {
      type: Object
    },
    priceTax: {// 单价(含税)
      type: [Number, String]
    },
    price: {// 单价(不含税)
      type: [Number, String]
    },
    pratesFromData: {
      type: Object
    },
    rules: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    // 公用验证正则
    // const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 最大99.99正则
    const ismax999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,7})|(0{1}))(\.\d{1,2})?$/, message: '0~99999999.99', trigger: ['blur'] })
    // 当前时间之前的时间不能选择
    const pickerOptionsBefore = {
      disabledDate(time) {
        return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
      }
    }
    // 交期数量弹窗内容
    const quantityDeliveryContent = {
      _seq: {
        prop: 'seq',
        label: '序号',
        itemType: 'input',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        disabled: true,
        clearable: true
      },
      _quantity: {
        prop: 'quantity',
        label: '数量',
        append: '',
        trim: (val) => { return inputFilter(val) },
        itemType: 'input',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        clearable: true,
        rules: [commonBlurReg, ismax999Reg],
        change: (value) => {
          this.quantityDeliveryChange(value)
        },
        formater: (scope) => {
          return this.$utils.priceFormat(scope.row.quantity)
        }
      },
      _auxiliaryQuantity: {
        prop: 'auxiliaryQuantity',
        label: '辅助数量',
        itemType: 'input',
        append: 'KG',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        disabled: true,
        clearable: true
      },
      _amountTax: {
        prop: 'amountTax',
        label: '合计金额(含税)',
        itemType: 'input',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        disabled: true,
        clearable: true
      },
      _amount: {
        prop: 'amount',
        label: '合计金额(不含税)',
        itemType: 'input',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        disabled: true,
        clearable: true
      },
      _delivery: {
        prop: 'delivery',
        label: '交期',
        itemType: 'date',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        clearable: true,
        pickerOptions: pickerOptionsBefore,
        rules: [{ required: true, message: '日期不能为空', trigger: ['change'] }]
      }
    }
    const quantityAdd = (params, form) => {
      this.$refs.quantityDeliveryPop.$refs.popComponents.form.validate(async valid => {
        if (valid) {
          this.AddFromData(params, 2)
          this.$message({ type: 'success', message: '添加成功，请继续添加' })
          this.$nextTick(() => {
            this.popForm.resetFields()
            this.$set(this.quantityDeliveryPopOptions, 'formDatas', {})
          })
        }
      })
    }
    // 交期数量弹窗配置
    const quantityDeliveryPopOptions = {
      itemType: 'dialog',
      visible: false,
      width: '700px',
      title: '新增交期数量',
      className: 'quantity-delivery',
      okText: '确定',
      ok: params => {
        this.AddFromData(params, 1)
        this.popHandle('', 'quantityDelivery')
      },
      saveAndaddText: '继续添加',
      saveAndadd: quantityAdd,
      cancel: params => {
        this.popHandle('', 'quantityDelivery')
      },
      formDatas: {},
      formOptions: {
        getForm: (form) => {
          this.popForm = form
        }
      },
      content: quantityDeliveryContent
    }

    return {
      quantityAdd,
      quantityDeliveryContent,
      quantityDeliveryPopOptions
    }
  },
  watch: {
    pratesFromData: {
      handler(val, oldVal) {
        this.IndexFrom(val)
      },
      deep: true,
      immediate: true
    },
    plateIndexFrom: {
      handler(val, oldVal) {
        this.IndexFrom(val)
      },
      deep: true,
      immediate: true
    },
    unit: {
      handler(val, oldVal) {
        val && this.$set(this.quantityDeliveryPopOptions.content._quantity, 'append', val ? val.label : '')
      },
      deep: true,
      immediate: true
    },
    weightBefore: {
      handler(val, oldVal) {},
      deep: true,
      immediate: true
    },
    suggestWidthUnit: {
      handler(val, oldVal) {},
      deep: true,
      immediate: true
    },
    suggestWidth: {
      handler(val, oldVal) {},
      deep: true,
      immediate: true
    },
    priceTax: {
      handler(val, oldVal) {},
      deep: true,
      immediate: true
    },
    price: {
      handler(val, oldVal) {},
      deep: true,
      immediate: true
    },
    rules: {
      handler(v) {
        this.encryptFn(this.quantityDeliveryPopOptions.content, v, 'edit')
      },
      deep: true
    }
  },
  mounted() {
  },
  methods: {
    // 交期数量 根据填写的数量计算辅助数量 金额

    quantityDeliveryChange(data) {
      let amountTax = 0
      let amount = 0
      const Tim = {
        quantity: data,
        unit: this.unit,
        weightBefore: this.weightBefore,
        suggestWidthUnit: this.suggestWidthUnit,
        suggestWidth: this.suggestWidth
      }
      const auxiliaryQuantity = this.$utils.auxiliaryQuantityExpressionData(Tim)
      this.$set(this.quantityDeliveryPopOptions.formDatas, 'quantity', data)
      this.$set(this.quantityDeliveryPopOptions.formDatas, 'auxiliaryQuantity', this.$utils.getFloat(auxiliaryQuantity, 2))
      if (this.priceTax) {
        amountTax = data * this.priceTax
        this.$set(this.quantityDeliveryPopOptions.formDatas, 'amountTax', this.$utils.getFloat(amountTax, 2))
      }
      if (this.price) {
        amount = data * this.price
        this.$set(this.quantityDeliveryPopOptions.formDatas, 'amount', this.$utils.getFloat(amount, 2))
      }
    },
    // 编辑数据设置
    IndexFrom(data) {
      this.$nextTick(() => { this.$set(this.quantityDeliveryPopOptions, 'formDatas', data) })
    },
    AddFromData(params) {
      if (this.quantityDeliveryPopOptions.title === '新增交期数量') {
        const obj = { ...params, IndexEdt: 'add' }
        this.popDataFun('quantity', obj)
      } else {
        const obj = { ...params, IndexEdt: 'edt' }
        this.popDataFun('quantity', obj)
      }
    },
    // 数量交期弹窗显隐
    popHandle(val, type) {
      this.$set(this[`${type}PopOptions`], 'visible', !this[`${type}PopOptions`].visible)
      if (val) {
        this.$set(this[`${type}PopOptions`], 'title', val)
        if (val === '编辑交期数量') {
          this.encryptFn(this.quantityDeliveryContent, this.rules, 'edit')
          this.$set(this.quantityDeliveryPopOptions, 'saveAndadd', null)
        }
      } else {
        this.encryptFn(this.quantityDeliveryContent, this.rules, 'add')
      }
      if (this[`${type}PopOptions`].visible) {
        this.encryptFn(this[`${type}Content`], this.rules, val && val.startsWith('新增') && 'add' || 'edit')
      }
      this.$set(this[`${type}PopOptions`], 'content', this[`${type}Content`])
      this.$set(this[`${type}PopOptions`], 'formDatas', {})
    },
    inputTypeChange() {
      if (this.isEdit) {
        return 'input'
      }
      return 'itemview'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
