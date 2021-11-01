<!--
 * @name: base-info
 * @description: base-info
 * @author: panmr
 * @time: 2021-06-23 14:33:26
-->
<template>
  <div class="base-info">
    <!--  基础信息  -->
    <div class="base-info-header">
      <span>基础信息</span>
    </div>
    <div class="base-info-content">
      <cs-custom-form ref="ViewBatchColors" :data-source="ViewBatchColors" :options="formOptions" :form-datas="data" />
    </div>
  </div>
</template>

<script>

import LABEL from '../../label'

export default {
  components: { },
  props: {
    data: {
      type: Object,
      default: () => ({
        informations: [], // 批色信息list
        qaGreigeInspectionInfoResponse: {}, // 加工基础信息
        qaCustomerOrderInfoResponse: {} // 客户订单基本信息
      })
    }
  },
  data() {
    return {
      formOptions: {
        size: 'small',
        hideRequiredAsterisk: false,
        labelWidth: '120px',
        inline: true,
        syncDataHandle: (syncData) => {}
      },
      ViewBatchColors: { // 查看批色
        _dyelotNo: { prop: 'dyelotNo', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `缸号:`,
          renderContent: (value, options, form, formDatas) => formDatas && formDatas.qaGreigeInspectionInfoResponse && formDatas.qaGreigeInspectionInfoResponse.dyelotNo || ''
        },
        _produceOrderCode: { prop: 'produceOrderCode', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `生产订单:`,
          renderContent: (value, options, form, formDatas) => formDatas && formDatas.qaGreigeInspectionInfoResponse && formDatas.qaGreigeInspectionInfoResponse.produceOrderCode || ''
        },
        _isHeadBatch: { prop: 'isHeadBatch', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `是否头缸:`,
          renderContent: (value, options, form, formDatas) => formDatas && formDatas.qaGreigeInspectionInfoResponse && LABEL.getLabelByKey(LABEL.dict.IS_HEAD_BATCH, formDatas.qaGreigeInspectionInfoResponse.isHeadBatch)
        },
        _eproductNo: { prop: 'productNo', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `产品编码:`,
          renderContent: (value, options, form, formDatas) => formDatas && formDatas.qaGreigeInspectionInfoResponse && formDatas.qaGreigeInspectionInfoResponse.productNo || ''
        },
        _fabricType: { prop: 'fabricType', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `布类:`,
          renderContent: (value, options, form, formDatas) => formDatas && formDatas.qaGreigeInspectionInfoResponse && formDatas.qaGreigeInspectionInfoResponse.fabricType || ''
        },
        _productSize: { prop: 'productSize', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `成品规格:`,
          renderContent: (value, options, form, formDatas) => {
            return `${formDatas && formDatas.qaGreigeInspectionInfoResponse && ((formDatas.qaGreigeInspectionInfoResponse.realWidth || '') + (LABEL.getLabelByKey(LABEL.dict.UNITS, formDatas.qaGreigeInspectionInfoResponse.unit) || '') + '-' + (formDatas.qaGreigeInspectionInfoResponse.realWeight || '') + 'g/㎡')}`
          }
        },
        _customerColor: { prop: 'customerColor', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `客户颜色:`,
          renderContent: (value, options, form, formDatas) => formDatas && formDatas.qaGreigeInspectionInfoResponse && formDatas.qaGreigeInspectionInfoResponse.customerColor || ''
        },
        _factoryName: { prop: 'factoryName', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `染印厂:`,
          renderContent: (value, options, form, formDatas) => formDatas && formDatas.qaGreigeInspectionInfoResponse && formDatas.qaGreigeInspectionInfoResponse.factoryName || ''
        },
        _customerName: { prop: 'customerName', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `客户:`,
          renderContent: (value, options, form, formDatas) => formDatas && formDatas.qaGreigeInspectionInfoResponse && formDatas.qaGreigeInspectionInfoResponse.customerName || ''
        },
        _brandName: { prop: 'brandName', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `品牌商:`,
          renderContent: (value, options, form, formDatas) => formDatas && formDatas.qaCustomerOrderInfoResponse && formDatas.qaCustomerOrderInfoResponse.brandName || ''
        },
        _currentProgress: { prop: 'currentProgress', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `当前进度:`,
          renderContent: (value, options, form, formDatas) => formDatas && formDatas.qaGreigeInspectionInfoResponse && formDatas.qaGreigeInspectionInfoResponse.currentProgress || ''
        },
        _schedulingVolumes: { prop: 'schedulingVolumes', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `投坯卷数:`,
          renderContent: (value, options, form, formDatas) => formDatas && formDatas.qaGreigeInspectionInfoResponse && formDatas.qaGreigeInspectionInfoResponse.schedulingVolumes
        },
        _schedulingQty: { prop: 'schedulingQty', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `投坯数量:`,
          renderContent: (value, options, form, formDatas) => formDatas && formDatas.qaGreigeInspectionInfoResponse && formDatas.qaGreigeInspectionInfoResponse.schedulingQty
        }
      }
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    // 初始化
    init() {}
  }
}
</script>
<style lang="scss" scoped>
.base-info {
  background: #ffffff;
  margin-bottom: 15px;
  .base-info-header {
    padding: 20px;
    border-bottom: 1px solid #EEEFF0;
  }
  .base-info-content {
    padding: 15px;
    /deep/ .el-form-item{
      margin-bottom: 0px;
    }
    /deep/ .el-form-item__content{
      color: #474747;
    }
    /deep/ .el-form-item__label{
      color: #888E9E;
    }
  }
}
</style>
