<!--
 * @name: base-info
 * @description: base-info
 * @author: panmr
 * @time: 2021-06-23 14:33:26
-->
<template>
  <div class="base-info">
    <div class="base-info-header">
      <span>基本信息</span>
    </div>
    <div class="base-info-content">
      <cs-custom-form ref="basicData" :data-source="basicData" :options="formOptions" :form-datas="baseFormDatas" />
    </div>
  </div>
</template>

<script>
import LABEL from '../../label'

export default {
  name: 'BaseInfo',
  components: { },
  props: {
    data: {
      type: Object,
      default: () => ({
        qaFinishFabricDefectInformationList: [], // 成品验布疵点整缸信息
        qaFinishFabricRecordList: [], // 验布信息list
        qaGreigeInspectionInfoResponse: {} // 加工基础信息
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
      baseFormDatas: {},
      basicData: {
        _dyelotNo: { prop: 'dyelotNo', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `缸号:` },
        _productOrderNo: { prop: 'productOrderNo', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `生产单号:` },
        _factoryName: { prop: 'factoryName', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `印染厂:`,
          renderContent: (value, options, form, formDatas, setFormDatas, scope) => formDatas && formDatas.qaGreigeInspectionInfoResponse && formDatas.qaGreigeInspectionInfoResponse.factoryName || ''
        },
        _fabricType: { prop: 'fabricType', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `布类:`,
          renderContent: (value, options, form, formDatas) => formDatas && formDatas.qaGreigeInspectionInfoResponse && formDatas.qaGreigeInspectionInfoResponse.fabricType || ''
        },
        _customerColor: { prop: 'customerColor', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `客户颜色:`,
          renderContent: (value, options, form, formDatas) => formDatas && formDatas.qaGreigeInspectionInfoResponse && formDatas.qaGreigeInspectionInfoResponse.customerColor || ''
        },
        // 要求规格：幅宽单位公差-克重公差
        _expressCompany6: { prop: 'expressCompany', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `要求规格:`,
          renderContent: (value, options, form, formDatas) => {
            return `${formDatas && formDatas.qaGreigeInspectionInfoResponse && ((formDatas.qaGreigeInspectionInfoResponse.realWidth || '') + (LABEL.getLabelByKey(LABEL.dict.UNITS, formDatas.qaGreigeInspectionInfoResponse.unit) || '') + (' /±' + formDatas.qaGreigeInspectionInfoResponse.widthRangeName || '') + ' - ' + (formDatas.qaGreigeInspectionInfoResponse.realWeight || '') + 'g/㎡' + (' /±' + formDatas.qaGreigeInspectionInfoResponse.weightRangeName || ''))}`
          }
        },
        _standardMoisture: { prop: 'standardMoisture', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `标准含潮率:`,
          renderContent: (value, options, form, formDatas) => formDatas && formDatas.qaGreigeInspectionInfoResponse && formDatas.qaGreigeInspectionInfoResponse.standardMoisture || ''
        },
        _schedulingQty: { prop: 'dyelotNo', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `总匹/总重(投坯):`,
          renderContent: (value, options, form, formDatas) => `${formDatas && formDatas.qaGreigeInspectionInfoResponse && ((formDatas.qaGreigeInspectionInfoResponse.castVatVolumes || '') + '/' + (formDatas.qaGreigeInspectionInfoResponse.castVatQty || ''))}KG`
        },
        _finishVolumes: { prop: 'productOrderNo', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `总匹/总重(成品):`,
          renderContent: (value, options, form, formDatas,) => `${formDatas && formDatas.qaGreigeInspectionInfoResponse && ((formDatas.qaGreigeInspectionInfoResponse.finishVolumes || '') + '/' + (formDatas.qaGreigeInspectionInfoResponse.finishQty || ''))}KG`
        }
      }
    }
  },
  watch: {
    data: {
      handler(data) {
        this.$nextTick(() => {
          this.baseFormDatas = Object.assign({}, data)
        })
      },
      deep: true,
      immediate: true
    }
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
