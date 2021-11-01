<template>
  <div class="status-info">
    <span style="font-size: 18px;">产品批号：{{ data.colorTaskNo || '' }}</span>
    <div class="detail-info" style="margin-left: auto;">
      <span>创建人：{{ data.qaGreigeInspectionInfoResponse && data.qaGreigeInspectionInfoResponse.createdByName }}</span>
      <span>{{ data.qaGreigeInspectionInfoResponse && data.qaGreigeInspectionInfoResponse.createdTime ? $filters.parseTime(data.qaGreigeInspectionInfoResponse.createdTime, '{y}-{m}-{d} {h}:{i}') : '' }}</span>
      <span style="margin-left: 10px;">批色员：{{ data.batchColorUser }}</span>
      <span>{{ data.dealTime ? $filters.parseTime(data.dealTime, '{y}-{m}-{d} {h}:{i}') : '' }}</span>
      <span style="margin-left: 10px;">审核人：{{ data.reviewUserName }}</span>
      <span>{{ data.reviewTime ? $filters.parseTime(data.reviewTime, '{y}-{m}-{d} {h}:{i}') : '' }}</span>
      <span :style="{color: LABEL.getColorByKey(LABEL.dict.STATUS, data.status) || '#00BCC5'}">{{ LABEL.getLabelByKey(LABEL.dict.STATUS, data.status) || '' }}</span>
    </div>
  </div>
</template>

<script>
import LABEL from '../../label'

export default {
  props: {
    data: {
      type: Object,
      default: () => ({
        reviewUserName: '',
        informations: [], // 批色信息list
        qaGreigeInspectionInfoResponse: {
          createdByName: ''
        }, // 加工基础信息
        qaCustomerOrderInfoResponse: {} // 客户订单基本信息
      })
    }
  },
  data() {
    return {
      LABEL
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.status-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  //padding: 0 20px;
  margin-bottom: 15px;
  .detail-code {
    font-size: 18px;
    color: #151222;
  }
  .copy-code {
    font-size: 12px;
    color: #777777;
  }
  .detail-info {
    font-size: 12px;
    color: #666666;
    span {
      margin-right: 10px;
    }
  }
}
</style>
