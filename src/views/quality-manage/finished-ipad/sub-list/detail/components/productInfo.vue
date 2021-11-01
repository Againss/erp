<template>
  <div class="product-info" :class="isEdit?'':'product-info-disable'">
    <div class="data-info" style="padding-bottom: 0;padding-top: 15px;padding-right: 10px;">
      <!-- <div class="title-max">基本信息</div> -->
      <cs-custom-form ref="basicData" :data-source="basicCommon" :options="formOptions" :form-datas="formDatas" />
    </div>
  </div>
</template>

<script>
import formCustom from './form-custom.vue'
export default {
  props: {
    data: {
      type: Object
    },
    isEdit: {
      type: Boolean
    },
    qualifiedData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const maxNumberReg = this.$getRules({
      type: 'number',
      pattern: /^[1-9]\d{0,2}?$/,
      message: '请输入1-999',
      trigger: ['blur']
    })
    const maxNumberReg1 = this.$getRules({
      type: 'number',
      pattern: /^[1-9]\d{0,3}(?:\.\d{0,2})?$/,
      message: '请输入1-9999.99',
      trigger: ['blur']
    })
    const maxNumberReg2 = this.$getRules({
      type: 'number',
      pattern: /^[1-9]\d{0,4}(?:\.\d{0,2})?$/,
      message: '请输入1-99999.99',
      trigger: ['blur']
    })

    const maxNumberReg3 = this.$getRules({
      type: 'number',
      pattern: /^(0|[1-9][0-9]?)(\.[0-9]{0,1}[1-9])?$/,
      message: '请输入0.01-99.99',
      trigger: ['blur']
    })
    const maxNumberReg4 = this.$getRules({
      type: 'number',
      pattern: /^[1-9]\d{0,2}(?:\.\d{0,2})?$/,
      message: '请输入1-999.99',
      trigger: ['blur']
    })

    const itemStyle = { 'width': 'calc(25% - 10px)' }
    const basicCommon = {
      _greigeNumber: {
        prop: 'greigeNumber',
        itemType: this.inputTypeChange,
        itemStyle,
        className: 'product-info-item',
        label: '匹号:',
        rules: [commonBlurReg],
        maxlength: 20,
        renderContent: this.renderContent
      },
      _realWidth: {
        prop: 'realWidth',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '实封:',
        // type: 'number',
        suffix: '"',
        rules: [commonBlurReg, maxNumberReg4],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const str = formDatas.realWidth ? formDatas.realWidth + (+this.data.realUnit === 1 ? '"' : 'CM') : ''
          // 0不合格 1合格
          if (this.qualifiedData.isRealWidth === 0) { // 不合格
            return `<div class="render-content">${str}<span style="color: #FF574F">(不合格)</span></div>`
          }
          if (this.qualifiedData.isRealWidth === 1) { // 合格
            return `<div class="render-content">${str}<span style="color: #00C4CD">(合格)</span></div>`
          }
          return str
        }
      },
      _realBorderWidth: {
        prop: 'realBorderWidth',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '边封:',
        suffix: '"',
        rules: [commonBlurReg, maxNumberReg4],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const str = formDatas.realBorderWidth ? formDatas.realBorderWidth + (+this.data.realUnit === 1 ? '"' : 'CM') : ''
          // 0不合格 1合格
          if (this.qualifiedData.isRealBorderWidth === 0) { // 不合格
            return `<div class="render-content">${str}<span style="color: #FF574F">(不合格)</span></div>`
          }
          if (this.qualifiedData.isRealBorderWidth === 1) { // 合格
            return `<div class="render-content">${str}<span style="color: #00C4CD">(合格)</span></div>`
          }
          return str
        }
      },
      _weight: {
        prop: 'weight',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '重量:',
        // type: 'number',
        suffix: 'kg',
        rules: [commonBlurReg, maxNumberReg2],
        renderContent: this.renderContent
      },
      _fabricWeight: {
        prop: 'fabricWeight',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '克重:',
        // type: 'number',
        suffix: 'g/m²',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const str = formDatas.fabricWeight ? formDatas.fabricWeight + 'g/㎡' : ''
          // 0不合格 1合格
          if (this.qualifiedData.isFabricWeight === 0) { // 不合格
            return `<div class="render-content">${str}<span style="color: #FF574F">(不合格)</span></div>`
          }
          if (this.qualifiedData.isFabricWeight === 1) { // 合格
            return `<div class="render-content">${str}<span style="color: #00C4CD">(合格)</span></div>`
          }
          return str
        },
        rules: [commonBlurReg, maxNumberReg1]
      },
      _returnFabricWeight: {
        prop: 'returnFabricWeight',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '回后克重:',
        // type: 'number',
        suffix: 'g/m²',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const str = formDatas.returnFabricWeight ? formDatas.returnFabricWeight + 'g/㎡' : ''
          // 0不合格 1合格
          if (this.qualifiedData.isReturnFabricWeight === 0) { // 不合格
            return `<div class="render-content">${str}<span style="color: #FF574F">(不合格)</span></div>`
          }
          if (this.qualifiedData.isReturnFabricWeight === 1) { // 合格
            return `<div class="render-content">${str}<span style="color: #00C4CD">(合格)</span></div>`
          }
          return str
        },
        rules: [commonBlurReg, maxNumberReg1]
      },
      _moistureTestArr: {
        prop: 'moistureTestArr',
        itemType: this.inputTypeChange,
        itemStyle: { 'width': 'calc(50% - 10px)' },
        label: '含潮测试:',
        // type: 'number',
        renderContent: this.renderContentMoistureTestArr,
        rules: [commonBlurReg],
        components: [formCustom],
        componentsOptions: {
          changeStatus: (e, scope, formDatas, setFormDatas) => {
            // formDatas.tableForm[scope.$index].brandName = e
          }
        }
      }
    }
    return {
      commonBlurReg,
      maxNumberReg,
      maxNumberReg3,
      itemStyle,
      basicCommon,
      formOptions: {
        inline: true,
        labelWidth: '100px',
        popError: true,
        size: 'small',
        validate: (flag, res, err) => {
          // console.log(flag, res, err)
        },
        syncDataHandle: (formDatas) => {
          this.changeVal(formDatas)
        }
      }
    }
  },
  computed: {
    formDatas() {
      return this.data
    }
  },
  methods: {
    renderContent(value, options, form, formDatas, setFormDatas, scope) {
      return value ? `<div class="render-content" title='${value}' >${value}</div>` : ''
    },
    renderContentMoistureTestArr(value, options, form, formDatas, setFormDatas, scope) {
      return (formDatas.moistureTest && formDatas.moistureTest !== ',,,') ? `<div class="render-content" title='${formDatas.moistureTest}' >${formDatas.moistureTest}</div>` : ''
    },
    inputTypeChange(data) {
      return this.isEdit ? 'input' : 'itemview'
    },
    selectTypeChange() {
      // return this.isEdit ? 'select' : 'itemview'
      return 'select'
    },
    changeVal(data) {
      data.moistureTest = data.moistureTestArr.join(',')
      this.$emit('change', data)
    }
  }
}
</script>

<style lang="scss" scoped>
  .product-info{
    .data-info{
      padding: 20px 0;
      padding-top: 0;
      background-color: #FFFFFF;
       /deep/ .el-form-item{
        margin-bottom: 18px;
      }
      /deep/ .el-form-item__content{
        color: #474747;
      }
    }
     .el-table{
      font-size: 16px !important;
    }
    .title-max{
      font-size: 16px;
      color: #151222;
      height: 57px;
      line-height: 57px;
      border-bottom: 1px solid #EEEFF0;
      padding: 0 20px;
      margin-bottom: 20px;
    }
    /deep/ .el-form-item__label{
       font-size: 16px;
    }
  }

  //查看状态
  .product-info-disable{
    .data-info{
      background-color: #FFFFFF;
       /deep/ .el-form-item__label{
         color: #888E9E;
      }
    }
  }

</style>
