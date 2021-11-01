<template>
  <!-- 基本信息 -->
  <div class="table-item basic-data">
    <div class="header-top basic-top" style="justify-content: left;">
      <span>基本信息</span>
      <div v-if="versionInfoArray && versionInfoArray.length && !isEdit" class="versionClass">
        <el-select v-model="versionInfoLength" filterable placeholder="请选择" @change="versionInfoChange">
          <el-option
            v-for="item in versionInfoArray"
            :key="item.version"
            :label="'v'+item.version"
            :value="item.version"
          />
        </el-select>
      </div>

    </div>
    <cs-custom-form ref="basicData" :data-source="baseData" :options="formOptions" :form-datas="baseFormDatas" />
  </div>
</template>
<script>
import { PublicCustomer } from '@/views/customer-order/public/index'
import responsibleDepartment from './responsible-department'

import { optionConfig } from '../../api/index'
import { getCoOrderList } from '../api/index'
export default {
  name: 'BaseInfo',
  mixins: [PublicCustomer],
  props: {
    isEdit: {
      type: Boolean
    },
    rule: {
      type: Object
    },
    data: {
      type: Object
    },
    syncMoudleDataHandle: {
      type: Function
    },
    setParentDataHandle: {
      type: Function
    }
  },
  data() {
    // 公用验证正则
    // const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // const commonChangeReg = this.$getRules({})
    // const max9999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,3})|(0{1}))(\.\d{1,2})?$/, message: '0~9999.99', trigger: ['blur'] })
    const itemStyle = { 'width': '25%', 'margin-bottom': 0 }
    const itemStyle1 = { 'width': '25%' }
    const baseData = {
      // _code: {
      //   prop: 'code',
      //   itemType: this.inputTypeChange,
      //   className: 'inputWidth',
      //   itemStyle: { 'width': '30%' },
      //   label: '补布单号:',
      //   placeholder: '自动生成',
      //   readonly: true,
      //   disabled: false,
      //   title: true
      // },
      _sourceCode: {
        prop: 'sourceCode',
        itemType: this.selectTypeChangeCode,
        className: 'inputWidth',
        itemStyle: itemStyle1,
        label: '来源单号:',
        valueType: 'object',
        clearable: true,
        disabled: false,
        filterable: true,
        rules: [{ required: true, message: '来源单号不能为空', trigger: 'change' }],
        change: (value) => {
          this.setParentDataHandle('sourceCode', value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.visibleChange('_sourceCode')
          }
        },
        dataSource: [],
        renderContent: this.renderContent
      },
      _view: {
        prop: 'itemview',
        itemType: 'itemview',
        itemStyle: { width: '75%' },
        text: '  '
      },
      _reissueReason: {
        prop: 'reissueReason',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        label: '补布原因:',
        rules: [{ required: true, message: '补布原因不能为空', trigger: 'change' }],
        valueType: 'object',
        itemStyle: itemStyle1,
        valueKey: 'value',
        filterable: true,
        clearable: true,
        change: (value) => {
          this.setParentDataHandle('reissueReason', value || {})
        },
        visibleChange: (value, val) => {
          if (value) {
            this.visibleChange('_reissueReason')
          }
        },
        dataSource: [],
        renderContent: this.renderContent
      },
      _responsibiltyDepartment: {
        prop: 'responsibiltyDepartment',
        className: 'inputWidth',
        rules: [{ required: true, message: '责任部门不能为空', trigger: 'change' }],
        components: { responsibleDepartment },
        componentsOptions: {
          syncMoudleDataHandle: this.syncMoudleDataHandle,
          setParentDataHandle: this.setParentDataHandle
        },
        label: '责任部门:',
        itemT: this.inputTypeChange,
        itemStyle: itemStyle1

      },
      _reissueDescription: {
        prop: 'reissueDescription',
        itemType: this.inputTypeChange,
        className: 'inputWidth',
        type: 'textarea',
        label: '补布说明:',
        style: {
          width: '80%'
        },
        itemStyle: { width: '50%' },
        maxlength: 500,
        rows: '1',
        clearable: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<span title="${value || ''}">${value || ''}</span>`
        }
      },
      _orderType: {
        prop: 'orderType',
        itemType: 'itemview',
        className: 'inputWidth rules-disable',
        itemStyle,
        label: '订单类型:',
        valueType: 'object',
        clearable: true,
        disabled: false,
        // rules: [{ required: true, message: '订单类型不能为空', trigger: 'change' }],
        dataSource: [],
        renderContent: this.renderContent
      },
      _brand: {
        prop: 'brand',
        itemType: 'itemview',
        className: 'commonRemoteSearch',
        itemStyle,
        style: { 'width': '80%' },
        placeholder: '输入文字模糊查询',
        label: '品牌商:',
        valueType: 'object',
        clearable: true,
        disabled: false,
        filterable: true,
        // rules: [{ required: true, message: '品牌商不能为空', trigger: 'change' }],
        dataSource: [],
        renderContent: this.renderContent
      },
      _customer: {
        prop: 'customer',
        itemType: 'itemview',
        className: 'commonRemoteSearch',
        itemStyle,
        style: { 'width': '80%' },
        placeholder: '输入文字模糊查询',
        label: '客户:',
        valueType: 'object',
        clearable: true,
        disabled: false,
        filterable: true,
        // rules: [{ required: true, message: '客户不能为空', trigger: 'change' }],
        dataSource: [],
        renderContent: this.renderContent
      },
      _salesTeam: {
        prop: 'salesTeam',
        itemType: 'itemview',
        className: 'commonRemoteSearch',
        itemStyle: { width: '20%', 'margin-bottom': 0 },
        style: { 'width': '80%' },
        placeholder: '输入文字模糊查询',
        label: '销售团队:',
        valueType: 'object',
        clearable: true,
        disabled: false,
        filterable: true,
        // rules: [{ required: true, message: '销售团队不能为空', trigger: 'change' }],
        dataSource: [],
        renderContent: this.renderContent
      },
      _open: {
        prop: 'open',
        itemType: 'view',
        itemStyle: { width: '5%', 'margin-bottom': 0 },
        style: { 'font-size': '14px', 'line-height': '32px', color: '#888E9E', cursor: 'pointer' },
        text: '展开',
        className: 'el-icon-arrow-down',
        handle: (form, formDatas, setFormDatas) => {
          if (this.baseData._open.text === '展开') {
            this.baseData._open.text = '收起'
            this.baseData._open.className = 'el-icon-arrow-up'
            this.open = true
          } else {
            this.baseData._open.text = '展开'
            this.baseData._open.className = 'el-icon-arrow-down'
            this.open = false
          }
        }
      },
      _seller: {
        isShow: this.getShow,
        prop: 'seller',
        itemType: 'itemview',
        className: 'commonRemoteSearch',
        itemStyle,
        style: { 'width': '80%' },
        placeholder: '输入文字模糊查询',
        label: '销售员:',
        valueType: 'object',
        clearable: true,
        disabled: false,
        filterable: true,
        // rules: [{ required: true, message: '销售员不能为空', trigger: 'change' }],
        dataSource: [],
        renderContent: this.renderContent
      },
      _customerService: {
        isShow: this.getShow,
        prop: 'customerService',
        itemType: 'itemview',
        className: 'commonRemoteSearch',
        itemStyle,
        style: { 'width': '80%' },
        placeholder: '输入文字模糊查询',
        label: '客服:',
        valueType: 'object',
        clearable: true,
        disabled: false,
        filterable: true,
        // rules: [{ required: true, message: '客服不能为空', trigger: 'change' }],
        dataSource: [],
        renderContent: this.renderContent
      },
      _marketType: {
        isShow: this.getShow,
        prop: 'marketType',
        itemType: 'itemview',
        className: 'inputWidth',
        itemStyle,
        style: { 'width': '80%' },
        label: '市场类型:',
        valueType: 'object',
        clearable: true,
        disabled: false,
        // rules: [{ required: true, message: '市场类型不能为空', trigger: 'change' }],
        dataSource: [],
        renderContent: this.renderContent
      },
      _sellYear: {
        isShow: this.getShow,
        prop: 'sellYear',
        itemType: 'itemview',
        className: 'inputWidth',
        itemStyle,
        label: '销售年度:',
        // rules: [commonChangeReg],
        clearable: true,
        disabled: false,
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          console.log(value)
          return value
        }
      },
      _sellQuarter: {
        isShow: this.getShow,
        prop: 'sellQuarter',
        itemType: 'itemview',
        className: 'inputWidth',
        itemStyle,
        label: '销售季度:',
        // rules: [commonChangeReg],
        valueType: 'object',
        clearable: true,
        disabled: false,
        dataSource: [],
        renderContent: this.renderContent
      },
      _currency: {
        isShow: this.getShow,
        prop: 'currency',
        itemType: 'itemview',
        className: 'inputWidth',
        itemStyle,
        label: '币别:',
        valueType: 'object',
        clearable: true,
        disabled: false,
        // rules: [{ required: true, message: '币别不能为空', trigger: 'change' }],
        dataSource: [],
        renderContent: this.renderContent
      },
      _taxRate: {
        isShow: this.getShow,
        prop: 'taxRate',
        itemType: 'itemview',
        className: 'inputWidth',
        itemStyle,
        label: '税率:',
        clearable: true,
        disabled: false,
        // rules: [commonBlurReg, max9999Reg],
        change: (value) => {
          this.taxRate = isNaN(value) ? '' : value * 1
        }
      },
      _pricingTerm: {
        isShow: this.getShow,
        prop: 'pricingTerm',
        itemType: 'itemview',
        className: 'inputWidth',
        itemStyle,
        label: '价格条款:',
        valueType: 'object',
        clearable: true,
        disabled: false,
        // rules: [{ required: true, message: '价格条款不能为空', trigger: 'change' }],
        dataSource: [],
        renderContent: this.renderContent
      },
      _paymentTerm: {
        isShow: this.getShow,
        prop: 'paymentTerm',
        itemType: 'itemview',
        className: 'inputWidth',
        itemStyle,
        label: '付款条件:',
        valueType: 'object',
        clearable: true,
        disabled: false,
        // rules: [{ required: true, message: '付款条件不能为空', trigger: 'change' }],
        dataSource: [],
        renderContent: this.renderContent
      }
    }
    return {
      // data: [],
      versionInfoLength: 0,
      versionInfoArray: [],

      baseData,
      // basicData: baseData,
      formOptions: {
        size: 'small',
        hideRequiredAsterisk: false,
        labelWidth: '90px',
        inline: true,
        syncDataHandle: (syncData) => {
          const dataArray = ['code', 'sourceCode', 'reissueReason', 'responsibiltyDepartment', 'reissueDescription', 'orderType', 'brand', 'customer', 'salesTeam', 'seller', 'marketType', 'customerService', 'sellYear', 'sellQuarter', 'isSettlement', 'currency', 'taxRate', 'pricingTerm', 'paymentTerm']
          Object.keys(syncData).forEach(item => {
            if (!dataArray.includes(item)) {
              delete syncData[item]
            }
          })
          this.syncMoudleDataHandle('baseInfoData', syncData)
        }
      },
      baseFormDatas: {
        open: '展开',
        responsibiltyDepartment: []
      },
      currencyDatas: [],
      currencyCode: '',
      currencyValue: '',
      taxRate: '',
      open: false
    }
  },
  watch: {
    data: {
      handler(v) {
        if (v && Object.keys(v).length) {
          // this.editChange(v)
          this.versionInfoLength = v.version || 0
          if (v.versionInfo && v.versionInfo.length) {
            this.versionInfoArray = v.versionInfo
          }
          const sup = ['brand', 'sourceCode', 'reissueReason', 'customer', 'seller', 'sellYear', 'sellQuarter', 'salesTeam', 'orderType', 'customerService', 'marketType', 'currency', 'pricingTerm', 'paymentTerm']
          // const supTwo = []
          // if (v.isSettlement === 1) {
          // this.basicData = { ...this.baseData, ...this.addData }
          // const arrum = [...sup, ...supTwo]
          sup.forEach(item => {
            this.$set(this.baseData['_' + item], 'dataSource', v[item] && v[item].value ? [v[item]] : null)
          })
          // } else {
          //   this.basicData = this.baseData
          //   sup.forEach(item => {
          //     const tempData = (v[item] && v[item].value) ? [v[item]] : []
          //     this.$set(this.basicData['_' + item], 'dataSource', tempData)
          //   })
          // }
          // if (this.rule && Object.keys(this.rule).length) {
          //   this.encryptFn(this.basicData, this.rule, 'edit')
          console.log(123444)
          // }
          this.baseFormDatas = { ...v, open: '展开' }
          this.$nextTick(() => {
            this.$refs.basicData.form.clearValidate()
          })
          this.currencyValue = v.currency && v.currency.value
          // this.currencyDatas.length && await this.getCurrencySelect()
          this.currencyDatas && this.currencyDatas.forEach(item => {
            if (item.value === v.currency.value) {
              this.currencyCode = item.code
            }
          })
          this.taxRate = v.taxRate * 1
        }
      },
      deep: true,
      immediate: true
    },
    isEdit: {
      handler(v) {
        this.formOptions.hideRequiredAsterisk = !v
      },
      deep: true,
      immediate: true
    },
    rule: {
      handler(v) {
        if (v && Object.keys(v).length) {
          this.encryptFn(this.baseData, v, 'edit')
        }
      },
      immediate: true
    },
    currencyCode: {
      handler(v) {
        console.log(v)
        this.setParentDataHandle('currencyCode', v)
      }
    },
    taxRate: {
      handler(v) {
        console.log(v)
        this.setParentDataHandle('taxRate', v)
      }
    }
  },
  created() {
    this.getCurrencySelect()
  },
  methods: {
    getShow() {
      return this.open
    },
    // 获取币别下拉
    getCurrencySelect() {
      this.getCurrency().then(res => {
        this.currencyDatas = res
        res.forEach(item => {
          if (item.value === this.currencyValue) {
            this.currencyCode = item.code
          }
        })
        this.$set(this.baseData._currency, 'dataSource', res)
      })
    },
    versionInfoChange(val) {
      let orderId = ''
      this.versionInfoArray.forEach((ix) => {
        if (ix.version === parseInt(val)) {
          orderId = ix.id
        }
      })
      this.setParentDataHandle('currentVersion', orderId)
      // this.$emit('okversion', arr)
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
    selectTypeChangeCode() {
      if (!this.$route.params.id) {
        return 'select'
      }
      return 'itemview'
    },
    selectTypeChange() {
      if (this.isEdit) {
        return 'select'
      }
      return 'itemview'
    },
    renderContent(value, options, form, formDatas, setFormDatas, scope) {
      return `<span title="${value ? value.label : ''}">${value ? value.label : ''}</span>`
    },

    // 选项配置下拉
    // 状态下拉
    visibleChange(type) {
      if (type === '_sourceCode') {
        this.getCoOrderList('_sourceCode')
      }
      if (type === '_reissueReason') {
        this.optionConfig('_reissueReason', '补布原因')
      }
    },
    async  getCoOrderList(abbr) {
      const res = await getCoOrderList()
      let data = []
      if (this.$pub.responseValidate(res)) {
        console.log(res)
        const list = res.data
        if (list && list.length > 0) {
          data = list.map(item => ({ value: item.orderId, label: item.code }))
        }
      }
      this.$set(this.baseData[abbr], 'dataSource', data)
    },
    // 选择配置下拉
    async optionConfig(abbr, type) {
      const res = await optionConfig({ fieldName: type })
      let data = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          data = list.map(item => ({ value: item.fieldValueId, label: item.fieldValue }))
        }
      }
      this.$set(this.baseData[abbr], 'dataSource', data)
    },

    // 编辑状态
    editChange(data) {
      for (const key in this.baseData) {
        this.baseData[key].disabled = false
        const item = this.baseData[key]
        if (item.itemType === 'select' && item.filterable) {
          this.baseData[key].placeholder = '请输入文字模糊搜索'
        } else if (item.itemType === 'select' && !item.filterable) {
          this.baseData[key].placeholder = '请选择'
        } else if (item.itemType === 'input') {
          this.baseData[key].placeholder = '请输入'
        }
        if (item[key] === 'code') {
          this.baseData[key].placeholder = '自动生成'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.versionClass{
  margin-left: 20px;
  width: 80px;
  display: flex;
}
</style>
