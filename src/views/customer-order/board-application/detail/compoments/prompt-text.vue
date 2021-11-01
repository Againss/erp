<!--
 * @Author: xj
 * @Description: 状态integer（0=草稿，1=待审核，2=已驳回，3=进行中，4=已取消，5=已完结）
 * @Date: 2021-04-20 16:25:36
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-04-29 20:01:47
 * @FilePath: e:\erpmu\erp2-tech-manage-v2.0.4\src\views\customer-order\yarn-preparation\detail\compoments\prompt-text.vue
-->
<template>
  <div class="status-info">
    <span style="font-size: 18px;">申请单号：{{ orderInfo.code || '' }}</span>
    <div class="detail-info">
      <span>创建人 / 时间：{{ orderInfo.createdBy || '' }} / {{ orderInfo.createdTime ? this.$filters.parseTime(orderInfo.createdTime) : '-' }}</span>
      <template v-if="orderInfo.updatedBy&&orderInfo.updatedTime">
        <span>修改人 / 时间：{{ orderInfo.updatedBy ? orderInfo.updatedBy : '-' }} / {{ orderInfo.updatedTime ? this.$filters.parseTime(orderInfo.updatedTime) : '-' }}</span>
      </template>
      <!-- （草稿 已驳回 进行中）显示一样的-->
      <template v-if="orderInfo.status === 2">
        <span>驳回人 / 时间：{{ orderInfo.rejectBy ? orderInfo.rejectBy : '-' }} / {{ orderInfo.rejectTime ? this.$filters.parseTime(orderInfo.rejectTime) : '-' }}</span>
      </template>
      <!--   已取消   -->
      <template v-if="orderInfo.status=== 4">
        <span>取消人 / 时间：{{ orderInfo.cancelledBy ? orderInfo.cancelledBy : '-' }} / {{ orderInfo.cancelledTime ? this.$filters.parseTime(orderInfo.cancelledTime) : '-' }}</span>
      </template>
      <!--   已完结   -->
      <template v-if="orderInfo.status=== 5">
        <span>完结人 / 时间：{{ orderInfo.finishedBy ? orderInfo.finishedBy : '-' }} / {{ orderInfo.finishedTime ? this.$filters.parseTime(orderInfo.finishedTime) : '-' }}</span>
      </template>
      <span :style="{ 'color': setOrderStatus(orderInfo.status).statusColor}"> 状态：{{ setOrderStatus(orderInfo.status).text }}</span>
    </div>
  </div>
</template>

<script>
import { setOrderFun } from '@/views/customer-order/board-application/api/com'
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
