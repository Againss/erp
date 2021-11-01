<!--
 * @Author: xj
 * @Description: 详情提示文字
 * @Date: 2021-04-20 16:25:36
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-04-22 09:41:42
 * @FilePath: e:\erpmu\erp2-sf-2.0.3\src\views\customer-order\goods-orders\detail\compoments\prompt-text.vue
-->
<template>
  <div class="status-info">
    <span style="font-size: 18px;">订单号：{{ orderData.code || '' }}</span>
    <div class="detail-info">
      <span>创建人 / 时间：{{ orderData.createdBy || '' }} / {{ orderData.createdTime ? this.$filters.parseTime(orderData.createdTime) : '-' }}</span>
      <template v-if="orderData.updatedBy&&orderData.updatedTime">
        <span>修改人 / 时间：{{ orderData.updatedBy ? orderData.updatedBy : '-' }} / {{ orderData.updatedTime ? this.$filters.parseTime(orderData.updatedTime) : '-' }}</span>
      </template>
      <template v-if="orderData.status==='4'">
        <span>驳回人 / 时间：{{ orderData.rejectBy ? orderData.rejectBy : '-' }} / {{ orderData.rejectTime ? this.$filters.parseTime(orderData.rejectTime) : '-' }}</span>
      </template>
      <template v-if="orderData.status==='7'">
        <span>审核人 / 时间：{{ orderData.approveBy ? orderData.approveBy : '-' }} / {{ orderData.approveTime ? this.$filters.parseTime(orderData.approveTime) : '-' }}</span>
        <span>取消人 / 时间：{{ orderData.cancelledBy ? orderData.cancelledBy : '-' }} / {{ orderData.cancelledTime ? this.$filters.parseTime(orderData.cancelledTime) : '-' }}</span>
      </template>
      <template v-if="orderData.status==='2'||orderData.status==='13'">
        <span>审核人 / 时间：{{ orderData.approveBy ? orderData.approveBy : '-' }} / {{ orderData.approveTime ? this.$filters.parseTime(orderData.approveTime) : '-' }}</span>
      </template>
      <template v-if="orderData.status==='13'">
        <span>完成人 / 时间：{{ orderData.finishedBy ? orderData.finishedBy : '-' }} / {{ orderData.finishedTime ? this.$filters.parseTime(orderData.finishedTime) : '-' }}</span>
      </template>
      <template v-if="orderData.status==='10'||orderData.status==='12'">
        <span>Hold单人 / 时间：{{ orderData.holdBy ? orderData.holdBy : '-' }} / {{ orderData.holdTime ? this.$filters.parseTime(orderData.holdTime) : '-' }}</span>
      </template>
      <span :style="{ 'color': setOrderStatus(orderData.status).statusColor}"> 状态：{{ setOrderStatus(orderData.status).text }}</span>
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
