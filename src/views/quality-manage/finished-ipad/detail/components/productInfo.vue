<template>
  <div class="product-info" :class="isEdit?'':'product-info-disable'">
    <div class="data-info">
      <div class="title-max">基本信息</div>
      <cs-custom-form ref="basicData" :data-source="basicCommon" :options="formOptions" :form-datas="formDatas" />
    </div>
    <div class="data-info" style="margin-top: 15px;">
      <div class="title-max">产品信息</div>
      <cs-custom-form ref="basicData" :data-source="productCommon" :options="formOptions" :form-datas="formDatas" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object
    },
    isEdit: {
      type: Boolean
    }
  },
  data() {
    const itemStyle = { 'width': '30%' }
    const basicCommon = {
      _physicalId: {
        prop: 'physicalId',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '物测编号:'
      },
      _dyelotNo: {
        prop: 'dyelotNo',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '缸号:'
      },
      _produceOrderCode: {
        prop: 'produceOrderCode',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '生产订单:'
      },
      // _p4: {
      //   prop: 'p4',
      //   itemType: this.inputTypeChange,
      //   itemStyle,
      //   label: '生产类型:',
      //   renderContent: this.renderContent
      // },
      _currentProgress: {
        prop: 'currentProgress',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '当前进度:',
        renderContent: this.renderContent
      },
      _factoryName: {
        prop: 'factoryName',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '染印厂:',
        renderContent: this.renderContent
      },
      _customerName: {
        prop: 'customerName',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '客户:',
        renderContent: this.renderContent
      },
      _brandName: {
        prop: 'brandName',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '品牌商:',
        renderContent: this.renderContent
      },
      _customerServiceName: {
        prop: 'customerServiceName',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '客服:'
      },
      _billMan: {
        prop: 'billMan',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '跟单员:'
      },
      _clothingExportName: {
        prop: 'clothingExportName',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '成衣信息:',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const str = formDatas.clothingExportName + '-' + formDatas.clothingTypeName + '-' + formDatas.clothingStyleName
          return value ? `<div class="render-content" title='${str}' >${str}</div>` : ''
        }
      },
      _techRequire: {
        prop: 'techRequire',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '工艺要求:',
        renderContent: this.renderContent
      },
      _reportTypeName: {
        prop: 'reportTypeName',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '报告类型:',
        renderContent: this.renderContent
      },
      _careLabel: {
        prop: 'careLabel',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '洗唛:',
        renderContent: this.renderContent
      },
      _remarks: {
        prop: 'remarks',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '备注:',
        renderContent: this.renderContent
      }
    }
    const productCommon = {
      _productNo: {
        prop: 'productNo',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '产品编码:'
      },
      _fabricType: {
        prop: 'fabricType',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '布类:'
      },
      _yarnCountName: {
        prop: 'yarnCountName',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '纱名:',
        renderContent: this.renderContent
      },
      _ingredientsName: {
        prop: 'ingredientsName',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '成份比例:'
      },
      _productSize: {
        prop: 'productSize',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '成品规格:'
      },
      _customerColor: {
        prop: 'customerColor',
        itemType: this.inputTypeChange,
        itemStyle,
        label: '客户颜色:'
      }
    }
    return {
      itemStyle,
      basicCommon,
      productCommon,
      formOptions: {
        inline: true,
        labelWidth: '140px',
        popError: true,
        size: 'small',
        validate: (flag, res, err) => {
          // console.log(flag, res, err)
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
    inputTypeChange() {
      // return this.isEdit ? 'input' : 'itemview'
      return 'itemview'
    },
    selectTypeChange() {
      // return this.isEdit ? 'select' : 'itemview'
      return 'itemview'
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
        margin-bottom: 0px;
      }
      /deep/ .el-form-item__content{
        color: #474747;
      }
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
