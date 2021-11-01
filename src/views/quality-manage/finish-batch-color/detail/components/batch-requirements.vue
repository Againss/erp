<!--
 * @name: base-info
 * @description: base-info
 * @author: panmr
 * @time: 2021-06-23 14:33:26
-->
<template>
  <div class="base-info">
    <!--  批色要求  -->
    <div class="base-info-header">
      <span>批色要求</span>
    </div>
    <div class="base-info-content">
      <cs-custom-form ref="basicData" :data-source="batchRequirements" :options="formOptions" :form-datas="qaCustomerOrderInfoResponse" />
    </div>
  </div>
</template>

<script>

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
      qaCustomerOrderInfoResponse: {},
      batchRequirements: { // 批色要求
        _headCylinder: { prop: 'headCylinder', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `衫身头缸:` },
        _bottomCulinder: { prop: 'bottomCulinder', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `下栏头缸:` },
        _cylinderDifference: { prop: 'cylinderDifference', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `缸差:` },
        _pitch: { prop: 'pitch', itemType: 'itemview', itemStyle: { 'width': '30%' }, label: `匹差:` }
      }
    }
  },
  watch: {
    data: {
      handler(data) {
        this.$nextTick(() => {
          this.qaCustomerOrderInfoResponse = Object.assign({}, { ...data.qaCustomerOrderInfoResponse })
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
