/**
 * @Description: 基本信息
 * @author Roman
 * @date 2021-05-06 15:18:54
 * @edit 2021-05-06 15:18:54
*/
<template>
  <!-- 基本信息 -->
  <div class="table-item basic-data">
    <div class="header-top basic-top" style="justify-content: left;">
      <span>基本信息</span>
      <div v-if="versionInfoArray && versionInfoArray.length && !isEdit" class="versionClass">
        <el-select v-model="versionInfoLength" filterable placeholder="请选择" @change="versionInfoChange">
          <el-option
            v-for="(item, index) in versionInfoArray"
            :key="index"
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
    versionInfo: {
      type: Array
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
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const commonChangeReg = this.$getRules({})
    const max9999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,3})|(0{1}))(\.\d{1,2})?$/, message: '0~9999.99', trigger: ['blur'] })
    const baseData = {
      _code: {
        prop: 'code',
        itemType: this.inputTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '订单号:',
        placeholder: '自动生成',
        readonly: true,
        disabled: false,
        title: true
      },
      _brand: {
        prop: 'brand',
        itemType: this.selectTypeChange,
        className: 'commonRemoteSearch',
        itemStyle: { 'width': '25%' },
        style: { 'width': '60%' },
        placeholder: '输入文字模糊查询',
        label: '品牌商:',
        valueType: 'object',
        clearable: true,
        disabled: false,
        filterable: true,
        rules: [{ required: true, message: '品牌商不能为空', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
          // console.log(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getBrandSelect()
          }
        },
        dataSource: [],
        renderContent: this.renderContent
      },
      _customer: {
        prop: 'customer',
        itemType: this.selectTypeChange,
        className: 'commonRemoteSearch',
        itemStyle: { 'width': '25%' },
        style: { 'width': '60%' },
        placeholder: '输入文字模糊查询',
        label: '客户:',
        valueType: 'object',
        clearable: true,
        disabled: false,
        filterable: true,
        rules: [{ required: true, message: '客户不能为空', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getCustomerSelect('customer')
          }
        },
        dataSource: [],
        renderContent: this.renderContent
      },
      _salesTeam: {
        prop: 'salesTeam',
        itemType: this.selectTypeChange,
        className: 'commonRemoteSearch',
        itemStyle: { 'width': '25%' },
        style: { 'width': '60%' },
        placeholder: '输入文字模糊查询',
        label: '销售团队:',
        valueType: 'object',
        clearable: true,
        disabled: false,
        filterable: true,
        rules: [{ required: true, message: '销售团队不能为空', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getSellTeamSelect('salesTeam')
          }
        },
        dataSource: [],
        renderContent: this.renderContent
      },
      _seller: {
        prop: 'seller',
        itemType: this.selectTypeChange,
        className: 'commonRemoteSearch',
        itemStyle: { 'width': '25%' },
        style: { 'width': '60%' },
        placeholder: '输入文字模糊查询',
        label: '销售员:',
        valueType: 'object',
        clearable: true,
        disabled: false,
        filterable: true,
        rules: [{ required: true, message: '销售员不能为空', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getSellerSelect()
          }
        },
        dataSource: [],
        renderContent: this.renderContent
      },
      _customerService: {
        prop: 'customerService',
        itemType: this.selectTypeChange,
        className: 'commonRemoteSearch',
        itemStyle: { 'width': '25%' },
        style: { 'width': '60%' },
        placeholder: '输入文字模糊查询',
        label: '客服:',
        valueType: 'object',
        clearable: true,
        disabled: false,
        filterable: true,
        rules: [{ required: true, message: '客服不能为空', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getCustomerServiceSelect()
          }
        },
        dataSource: [],
        renderContent: this.renderContent
      },
      _sellYear: {
        prop: 'sellYear',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '销售年度:',
        rules: [commonChangeReg],
        clearable: true,
        disabled: false,
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getYearSelect('sellYear')
          }
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value
        }
      },
      _sellQuarter: {
        prop: 'sellQuarter',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '销售季度:',
        rules: [commonChangeReg],
        valueType: 'object',
        clearable: true,
        disabled: false,
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '备坯单', fieldName: '销售季度' }, 'baseData')
          }
        },
        dataSource: [],
        renderContent: this.renderContent
      },
      _currency: {
        prop: 'currency',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '币别:',
        valueType: 'object',
        clearable: true,
        disabled: false,
        rules: [{ required: true, message: '币别不能为空', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
          if (!value) {
            this.currencyCode = ''
            return
          }
          this.currencyDatas.forEach(item => {
            if (item.value === value.value) {
              // debugger
              this.currencyCode = item.code
            }
          })
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getCurrencySelect()
          }
        },
        dataSource: [],
        renderContent: this.renderContent
      },
      _taxRate: {
        prop: 'taxRate',
        itemType: this.inputTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '税率:',
        clearable: true,
        disabled: false,
        rules: [commonBlurReg, max9999Reg],
        change: (value) => {
          // const that = this
          // console.log('Ssssssss', value)
          // setTimeout(() => {
          //   that.SetAmount()
          // }, 60)
          this.taxRate = isNaN(value) ? 0 : value * 1
        }
      }
      // _isSettlement: {
      //   prop: 'isSettlement',
      //   itemType: this.selectTypeChange,
      //   className: 'inputWidth',
      //   itemStyle: { 'width': '25%' },
      //   label: '是否结算:',
      //   // clearable: true,
      //   disabled: false,
      //   rules: [{ required: true, message: '是否结算不能为空', trigger: 'change' }],
      //   change: (value) => {
      //     this.isSettlement(value)
      //     // this.SetAmount()// 改变税率  是否结算 需要清空值
      //   },
      //   visibleChange: (value) => {
      //   },
      //   dataSource: [
      //     {
      //       label: '是',
      //       value: 1
      //     },
      //     {
      //       label: '否',
      //       value: 0
      //     }
      //   ],
      //   renderContent: (value) => {
      //     return value === 1 ? '是' : '否'
      //   }
      // }
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
          // console.log(syncData)
          // const dataArray = ['code', 'orderType', 'brand', 'customer', 'garmentFactory', 'salesTeam', 'seller', 'customerService', 'sellYear', 'sellQuarter', 'isSettlement', 'currency', 'taxRate', 'pricingTerm', 'paymentTerm']
          // Object.keys(syncData).forEach(item => {
          //   if (!dataArray.includes(item)) {
          //     delete syncData[item]
          //   }
          // })
          // console.log(syncData)
          // dataArray.forEach(item => syncData)
          this.syncMoudleDataHandle('baseInfoData', syncData)
        }
      },
      baseFormDatas: {
        isSettlement: 0,
        taxRate: '0'
      },
      currencyDatas: [],
      currencyCode: '',
      currencyValue: '',
      taxRate: ''
    }
  },
  watch: {
    data: {
      handler(v) {
        // console.log(v, this.isEdit)

        if (v && Object.keys(v).length) {
          this.editChange(v)
          this.versionInfoLength = v.version || 0
          const sup = ['brand', 'customer', 'seller', 'sellYear', 'sellQuarter', 'salesTeam', 'customerService', 'currency']
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
          // }
          this.baseFormDatas = v
          this.$nextTick(() => {
            this.$refs.basicData.form.clearValidate()
          })
          this.currencyValue = v.currency.value
          // debugger
          // console.log(this.currencyDatas)
          // this.currencyDatas.length && await this.getCurrencySelect()
          this.currencyDatas.forEach(item => {
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
    versionInfo: {
      handler(v) {
        if (v) {
          this.versionInfoArray = v
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
        // console.log(v)
        this.setParentDataHandle('currencyCode', v)
      }
    },
    taxRate: {
      handler(v) {
        // console.log(v)
        this.setParentDataHandle('taxRate', v)
      }
    }
  },
  created() {
    this.getCurrencySelect()
  },
  methods: {
    versionInfoChange(val) {
      let orderId = ''
      this.versionInfoArray.forEach((ix) => {
        // console.log(ix)
        if (ix.version === val) {
          orderId = ix.orderId
        }
      })
      this.setParentDataHandle('currentVersion', orderId)
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
    renderContent(value, options, form, formDatas, setFormDatas, scope) {
      return value ? value.label : ''
    },
    // 是否切换内容
    isSettlement(value) {
      // this.basicData = {}
      if (value) {
        this.basicData = { ...this.baseData, ...this.addData }
      } else {
        this.taxRate = 0
        this.basicData = { ...this.baseData }
        this.baseFormDatas = { ...this.baseFormDatas, isSettlement: 0, currency: null, taxRate: 0, pricingTerm: null, paymentTerm: null }
      }
      // if (this.isEdit) {
      //   for (const key in this.basicData) {
      //     this.basicData[key].disabled = false
      //   }
      // } else {
      //   for (const key in this.basicData) {
      //     this.basicData[key].disabled = true
      //   }
      // }
    },

    // 选项配置下拉
    getOptionConfigSelect(data, type) {
      this.getOptionConfig(data).then(res => {
        if (type === 'garmentPart') { // 成衣部位
          this.$set(this.columns._garmentPart.editOptions, 'dataSource', res)
        } else if (type === 'referenceContent') { // 参考内容
          this.$set(this.versionContent._referenceContent, 'dataSource', res)
        } else if (type === 'range') { // 公差范围(幅宽)
          this.$set(this.productData._range, 'dataSource', res)
        } else if (type === 'weightBeforeRange') { // 公差范围(克重)
          this.$set(this.productData._weightBeforeRange, 'dataSource', res)
        } else if (type === 'weightAfterRange') { // 公差范围(克重)
          this.$set(this.productData._weightAfterRange, 'dataSource', res)
        } else if (type === 'naturalFiber') { // 证书要求
          this.$set(this.naturalFiberContent._certificate, 'dataSource', res)
        } else if (type === 'chemicalFiber') { // 证书要求
          this.$set(this.chemicalFiberContent._certificate, 'dataSource', res)
        } else if (type === 'combine') { // 证书要求
          this.$set(this.materialContent._certificateCombine, 'dataSource', res)
        } else if (type === 'type') { // 剪板要求类型
          this.$set(this.shearingRequirementsContent._type, 'dataSource', res)
        } else if (type === 'stripeSpacingRange') { // 公差范围(条纹间距)
          this.$set(this.allContent._range, 'dataSource', res)
        } else if (type === 'baseData') { // 销售季度
          this.$set(this.baseData._sellQuarter, 'dataSource', res)
        } else if (type === 'chooseSearch') {
          this.$set(this.chooseSearch._sellQuarter, 'dataSource', res)
        } else if (type === 'allRange') {
          this.$set(this.productData._range, 'dataSource', res)
          this.$set(this.productData._weightBeforeRange, 'dataSource', res)
          this.$set(this.productData._weightAfterRange, 'dataSource', res)
        }
      })
    },
    // 单位下拉
    getUnitsSelect() {
      this.getUnits().then(res => {
        this.unitOptions = res
        if (!this.unit.value && this.unitOptions && this.unitOptions.length) {
          this.unit = this.unitOptions[0]
        }
      })
    },
    // 客样分析编号下拉
    getSampleAnalysisNoSelect() {
      this.getSampleAnalysisNo({ status: '4' }).then(res => {
        this.sampleAnalysisResultOption = res
      })
    },
    // 品牌商下拉
    getBrandSelect() {
      this.getBrand().then(res => {
        this.$set(this.baseData._brand, 'dataSource', res)
      })
    },
    // 获取客户下拉
    getCustomerSelect(type) {
      this.getCustomer().then(res => {
        if (type === 'customer') {
          this.$set(this.baseData._customer, 'dataSource', res)
        } else if (type === 'garmentFactory') {
          // this.$set(this.baseData._garmentFactory, 'dataSource', res)
        } else if (type === 'stripeSpacing' || type === 'allContent') {
          this.$set(this.chooseSearch._customerId, 'dataSource', res)
        }
      })
    },
    // 获取销售团队下拉
    getSellTeamSelect(type) {
      this.getSellTeam({ functionTag: 'SAL' }).then(res => {
        if (type === 'salesTeam') {
          this.$set(this.baseData._salesTeam, 'dataSource', res)
        } else if (type === 'stripeSpacing' || type === 'allContent') {
          this.$set(this.chooseSearch._orgId, 'dataSource', res)
        }
      })
    },
    // 获取销售员下拉
    getSellerSelect() {
      this.getSeller().then(res => {
        this.$set(this.baseData._seller, 'dataSource', res)
      })
    },
    // 获取客服下拉
    getCustomerServiceSelect() {
      this.getSeller({ functionTag: 'SAL' }).then(res => {
        this.$set(this.baseData._customerService, 'dataSource', res)
      })
    },
    // 获取年份下拉
    getYearSelect(type) {
      this.getYear().then(res => {
        if (type === 'sellYear') {
          this.$set(this.baseData._sellYear, 'dataSource', res)
        } else if (type === 'stripeSpacing' || type === 'allContent') {
          this.$set(this.chooseSearch._sellYear, 'dataSource', res)
        }
      })
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
    // 获取价格条款下拉
    getPricingTermSelect() {
      this.getPricingTerm().then(res => {
        this.$set(this.baseData._pricingTerm, 'dataSource', res)
      })
    },
    // 获取付款条件下拉
    getPaymentTermSelect() {
      this.getPaymentTerm().then(res => {
        this.$set(this.baseData._paymentTerm, 'dataSource', res)
      })
    },

    // 编辑状态
    editChange(data) {
      if (data.demandSource && data.demandCode) { // 需求来源
        for (const key in this.baseData) {
          // const prop = key.replace('_', '')
          // if (typeof data[prop] === 'object') { // 是对象
          //   this.baseData[key].disabled = data[prop] && (data[key.replace('_', '')].value && data[prop].label) && true || false
          // } else {
          //   this.baseData[key].disabled = data[prop] && true || false
          // }
          this.baseData[key].disabled = true
        }
        // this.baseData._garmentFactory.disabled = false
        this.baseData._customerService.disabled = false
        this.baseData._taxRate.disabled = false
      } else {
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
}
</script>

<style lang="scss" scoped>
.versionClass{
  margin-left: 20px;
  width: 80px;
  display: flex;
}
</style>
