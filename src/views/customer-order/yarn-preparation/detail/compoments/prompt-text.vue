<!--
 * @Author: xj
 * @Description: 详情提示文字
 * @Date: 2021-04-20 16:25:36
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-04-29 20:01:47
 * @FilePath: e:\erpmu\erp2-tech-manage-v2.0.4\src\views\customer-order\yarn-preparation\detail\compoments\prompt-text.vue
-->
<template>
  <div class="status-info">
    <span style="font-size: 18px;">订单号：{{ orderInfo.code || '' }}</span>
    <div class="detail-info">
      <span>创建人 / 时间：{{ orderInfo.createdBy || '' }} / {{ orderInfo.createdTime ? this.$filters.parseTime(orderInfo.createdTime) : '-' }}</span>
      <template v-if="orderInfo.updatedBy&&orderInfo.updatedTime">
        <span>修改人 / 时间：{{ orderInfo.updatedBy ? orderInfo.updatedBy : '-' }} / {{ orderInfo.updatedTime ? this.$filters.parseTime(orderInfo.updatedTime) : '-' }}</span>
      </template>
      <template v-if="orderInfo.status==='4'">
        <span>驳回人 / 时间：{{ orderInfo.rejectBy ? orderInfo.rejectBy : '-' }} / {{ orderInfo.rejectTime ? this.$filters.parseTime(orderInfo.rejectTime) : '-' }}</span>
      </template>
      <template v-if="orderInfo.status==='7'">
        <span>审核人 / 时间：{{ orderInfo.approveBy ? orderInfo.approveBy : '-' }} / {{ orderInfo.approveTime ? this.$filters.parseTime(orderInfo.approveTime) : '-' }}</span>
        <span>取消人 / 时间：{{ orderInfo.cancelledBy ? orderInfo.cancelledBy : '-' }} / {{ orderInfo.cancelledTime ? this.$filters.parseTime(orderInfo.cancelledTime) : '-' }}</span>
      </template>
      <template v-if="orderInfo.status==='2'||orderInfo.status==='13'">
        <span>审核人 / 时间：{{ orderInfo.approveBy ? orderInfo.approveBy : '-' }} / {{ orderInfo.approveTime ? this.$filters.parseTime(orderInfo.approveTime) : '-' }}</span>
      </template>
      <template v-if="orderInfo.status==='13'">
        <span>完成人 / 时间：{{ orderInfo.finishedBy ? orderInfo.finishedBy : '-' }} / {{ orderInfo.finishedTime ? this.$filters.parseTime(orderInfo.finishedTime) : '-' }}</span>
      </template>
      <template v-if="orderInfo.status==='10'||orderInfo.status==='12'">
        <span>Hold单人 / 时间：{{ orderInfo.holdBy ? orderInfo.holdBy : '-' }} / {{ orderInfo.holdTime ? this.$filters.parseTime(orderInfo.holdTime) : '-' }}</span>
      </template>
      <span :style="{ 'color': setOrderStatus(orderInfo.status).statusColor}"> 状态：{{ setOrderStatus(orderInfo.status).text }}</span>
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
    orderInfo() {
      return this.orderData && this.orderData.baseInfo || {}
    }
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
