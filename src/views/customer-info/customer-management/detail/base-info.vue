<!--
 * @Author: xj
 * @Description:
 * @Date: 2021-07-20 19:55:28
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-20 20:05:16
 * @FilePath: d:\sample\src\views\customer-order\plate-making\sample-collection\detail\base-info.vue
-->

<template>
  <div class="sample-BaseInfo">
    <cs-custom-form ref="basicData" :data-source="baseData" :options="formOptions" :form-datas="baseFormDatas" />
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    const baseData = {}
    // const baseData = {
    //   _code: {
    //     prop: 'code',
    //     itemType: this.inputTypeChange,
    //     className: 'inputWidth',
    //     itemStyle: { 'width': '25%' },
    //     label: '订单号:',
    //     placeholder: '自动生成',
    //     readonly: true,
    //     disabled: false,
    //     title: true
    //   },
    //   _brand: {
    //     prop: 'brand',
    //     itemType: this.selectTypeChange,
    //     className: 'commonRemoteSearch',
    //     itemStyle: { 'width': '25%' },
    //     style: { 'width': '60%' },
    //     placeholder: '输入文字模糊查询',
    //     label: '品牌商:',
    //     valueType: 'object',
    //     clearable: true,
    //     disabled: false,
    //     filterable: true,
    //     rules: [{ required: true, message: '品牌商不能为空', trigger: 'change' }],
    //     change: (value) => {
    //       // this.knitDyeChange(value)
    //       // console.log(value)
    //     },
    //     visibleChange: (value, val) => {
    //       if (value) {
    //         this.getBrandSelect()
    //       }
    //     },
    //     dataSource: [],
    //     renderContent: this.renderContent
    //   },
    //   _customer: {
    //     prop: 'customer',
    //     itemType: this.selectTypeChange,
    //     className: 'commonRemoteSearch',
    //     itemStyle: { 'width': '25%' },
    //     style: { 'width': '60%' },
    //     placeholder: '输入文字模糊查询',
    //     label: '客户:',
    //     valueType: 'object',
    //     clearable: true,
    //     disabled: false,
    //     filterable: true,
    //     rules: [{ required: true, message: '客户不能为空', trigger: 'change' }],
    //     change: (value) => {
    //       // this.knitDyeChange(value)
    //     },
    //     visibleChange: (value, val) => {
    //       if (value) {
    //         this.getCustomerSelect('customer')
    //       }
    //     },
    //     dataSource: [],
    //     renderContent: this.renderContent
    //   },
    //   _salesTeam: {
    //     prop: 'salesTeam',
    //     itemType: this.selectTypeChange,
    //     className: 'commonRemoteSearch',
    //     itemStyle: { 'width': '25%' },
    //     style: { 'width': '60%' },
    //     placeholder: '输入文字模糊查询',
    //     label: '销售团队:',
    //     valueType: 'object',
    //     clearable: true,
    //     disabled: false,
    //     filterable: true,
    //     rules: [{ required: true, message: '销售团队不能为空', trigger: 'change' }],
    //     change: (value) => {
    //       // this.knitDyeChange(value)
    //     },
    //     visibleChange: (value, val) => {
    //       if (value) {
    //         this.getSellTeamSelect('salesTeam')
    //       }
    //     },
    //     dataSource: [],
    //     renderContent: this.renderContent
    //   },
    //   _seller: {
    //     prop: 'seller',
    //     itemType: this.selectTypeChange,
    //     className: 'commonRemoteSearch',
    //     itemStyle: { 'width': '25%' },
    //     style: { 'width': '60%' },
    //     placeholder: '输入文字模糊查询',
    //     label: '销售员:',
    //     valueType: 'object',
    //     clearable: true,
    //     disabled: false,
    //     filterable: true,
    //     rules: [{ required: true, message: '销售员不能为空', trigger: 'change' }],
    //     change: (value) => {
    //       // this.knitDyeChange(value)
    //     },
    //     visibleChange: (value, val) => {
    //       if (value) {
    //         this.getSellerSelect()
    //       }
    //     },
    //     dataSource: [],
    //     renderContent: this.renderContent
    //   },
    //   _customerService: {
    //     prop: 'customerService',
    //     itemType: this.selectTypeChange,
    //     className: 'commonRemoteSearch',
    //     itemStyle: { 'width': '25%' },
    //     style: { 'width': '60%' },
    //     placeholder: '输入文字模糊查询',
    //     label: '客服:',
    //     valueType: 'object',
    //     clearable: true,
    //     disabled: false,
    //     filterable: true,
    //     rules: [{ required: true, message: '客服不能为空', trigger: 'change' }],
    //     change: (value) => {
    //       // this.knitDyeChange(value)
    //     },
    //     visibleChange: (value, val) => {
    //       if (value) {
    //         this.getCustomerServiceSelect()
    //       }
    //     },
    //     dataSource: [],
    //     renderContent: this.renderContent
    //   },
    //   _sellYear: {
    //     prop: 'sellYear',
    //     itemType: this.selectTypeChange,
    //     className: 'inputWidth',
    //     itemStyle: { 'width': '25%' },
    //     label: '销售年度:',
    //     rules: [commonChangeReg],
    //     clearable: true,
    //     disabled: false,
    //     change: (value) => {
    //       // this.knitDyeChange(value)
    //     },
    //     visibleChange: (value, val) => {
    //       if (value) {
    //         this.getYearSelect('sellYear')
    //       }
    //     },
    //     dataSource: [],
    //     renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
    //       return value
    //     }
    //   },
    //   _sellQuarter: {
    //     prop: 'sellQuarter',
    //     itemType: this.selectTypeChange,
    //     className: 'inputWidth',
    //     itemStyle: { 'width': '25%' },
    //     label: '销售季度:',
    //     rules: [commonChangeReg],
    //     valueType: 'object',
    //     clearable: true,
    //     disabled: false,
    //     change: (value) => {
    //       // this.knitDyeChange(value)
    //     },
    //     visibleChange: (value, val) => {
    //       if (value) {
    //         this.getOptionConfigSelect({ pageName: '备坯单', fieldName: '销售季度' }, 'baseData')
    //       }
    //     },
    //     dataSource: [],
    //     renderContent: this.renderContent
    //   },
    //   _currency: {
    //     prop: 'currency',
    //     itemType: this.selectTypeChange,
    //     className: 'inputWidth',
    //     itemStyle: { 'width': '25%' },
    //     label: '币别:',
    //     valueType: 'object',
    //     clearable: true,
    //     disabled: false,
    //     rules: [{ required: true, message: '币别不能为空', trigger: 'change' }],
    //     change: (value) => {
    //       // this.knitDyeChange(value)
    //       if (!value) {
    //         this.currencyCode = ''
    //         return
    //       }
    //       this.currencyDatas.forEach(item => {
    //         if (item.value === value.value) {
    //           // debugger
    //           this.currencyCode = item.code
    //         }
    //       })
    //     },
    //     visibleChange: (value, val) => {
    //       if (value) {
    //         this.getCurrencySelect()
    //       }
    //     },
    //     dataSource: [],
    //     renderContent: this.renderContent
    //   },
    //   _taxRate: {
    //     prop: 'taxRate',
    //     itemType: this.inputTypeChange,
    //     className: 'inputWidth',
    //     itemStyle: { 'width': '25%' },
    //     label: '税率:',
    //     clearable: true,
    //     disabled: false,
    //     rules: [commonBlurReg, max9999Reg],
    //     change: (value) => {

    //       this.taxRate = isNaN(value) ? 0 : value * 1
    //     }
    //   }

    // }
    return {
      baseData,
      formOptions: {},
      baseFormDatas: {
        isSettlement: 0,
        taxRate: '0'
      }

    }
  },
  computed: {
    // getversionInfo() {

    // },
    // getEdit() {
    //   return this.isEdit && this.hasDetail
    // }
  },
  mounted() {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>

</style>
