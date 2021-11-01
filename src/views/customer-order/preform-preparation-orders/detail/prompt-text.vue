/**
 * @Description: 订单提示文字
 * @author Roman
 * @date 2021-05-06 15:17:30
 * @edit 2021-05-06 15:17:30
*/
<template>
  <div class="status-info">
    <span style="font-size: 18px;">订单号：{{ baseInfo.code || '' }}</span>
    <div class="detail-info">
      <span>创建人 / 时间：{{ baseInfo.createdBy || '' }} / {{ baseInfo.createdTime ? this.$filters.parseTime(baseInfo.createdTime) : '-' }}</span>
      <template v-if="baseInfo.updatedBy&&baseInfo.updatedTime">
        <span>修改人 / 时间：{{ baseInfo.updatedBy ? baseInfo.updatedBy : '-' }} / {{ baseInfo.updatedTime ? this.$filters.parseTime(baseInfo.updatedTime) : '-' }}</span>
      </template>
      <template v-if="baseInfo.status==='4'">
        <span>驳回人 / 时间：{{ baseInfo.rejectBy ? baseInfo.rejectBy : '-' }} / {{ baseInfo.rejectTime ? this.$filters.parseTime(baseInfo.rejectTime) : '-' }}</span>
      </template>
      <template v-if="baseInfo.status==='7'">
        <span>审核人 / 时间：{{ baseInfo.approveBy ? baseInfo.approveBy : '-' }} / {{ baseInfo.approveTime ? this.$filters.parseTime(baseInfo.approveTime) : '-' }}</span>
        <span>取消人 / 时间：{{ baseInfo.cancelledBy ? baseInfo.cancelledBy : '-' }} / {{ baseInfo.cancelledTime ? this.$filters.parseTime(baseInfo.cancelledTime) : '-' }}</span>
      </template>
      <template v-if="baseInfo.status==='2'||baseInfo.status==='13'">
        <span>审核人 / 时间：{{ baseInfo.approveBy ? baseInfo.approveBy : '-' }} / {{ baseInfo.approveTime ? this.$filters.parseTime(baseInfo.approveTime) : '-' }}</span>
      </template>
      <template v-if="baseInfo.status==='13'">
        <span>完成人 / 时间：{{ baseInfo.finishedBy ? baseInfo.finishedBy : '-' }} / {{ baseInfo.finishedTime ? this.$filters.parseTime(baseInfo.finishedTime) : '-' }}</span>
      </template>
      <template v-if="baseInfo.status==='10'||baseInfo.status==='12'">
        <span>Hold单人 / 时间：{{ baseInfo.holdBy ? baseInfo.holdBy : '-' }} / {{ baseInfo.holdTime ? this.$filters.parseTime(baseInfo.holdTime) : '-' }}</span>
      </template>
      <span :style="{ 'color': setOrderStatus(baseInfo.status).statusColor}"> 状态：{{ setOrderStatus(baseInfo.status).text }}</span>
    </div>
  </div>
</template>

<script>
import { setOrderFun } from '@/views/customer-order/public/api/mou'
export default {
  name: 'PromptText',
  components: {},
  mixins: [setOrderFun],
  props: {
    orderData: {
      type: Object
    }
  },
  data() {
    return {}
  },
  computed: {
    baseInfo() {
      return this.orderData.baseInfo || {}
    }
  },
  mounted() {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
  .status-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 20px;
    margin-bottom: 16px;
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
