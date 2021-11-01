
<!--
 * @name: 状态栏
 * @description: 状态栏
 * @author: panmr
 * @time: 2021-06-10 13:40:30
-->
<template>
  <div class="status-info">
    <span style="font-size: 18px;">订单号：{{ orderData.code || '' }}</span>
    <div class="detail-info">
      <span>创建人：{{ orderData.createdBy || '' }}</span>
      <span>创建时间：{{ orderData.createdTime ? this.$filters.parseTime(orderData.createdTime) : '-' }}</span>
      <span :style="{ 'color': setOrderStatus(orderData.status).statusColor}"> 状态：{{ setOrderStatus(orderData.status).text }}</span>
      <el-popover v-if="orderData.procInstId" width="450" trigger="click" @show="show">
        <div style="padding-top: 20px">
          <approveContent :form-datas="formDatas" />
        </div>
        <el-link slot="reference" :underline="false" type="primary" style="font-weight: 400;">详情</el-link>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { setOrderFun } from '@/views/customer-order/public/api/mou'
import approveContent from '@/components/approve/components/approveContent.vue'
import * as api from '@/components/approve/api/index.js'
export default {
  name: 'StatusBar',
  components: { approveContent },
  mixins: [setOrderFun],
  props: {
    orderData: {
      type: Object
    }
  },
  data() {
    return {
      formDatas: {
        _approve: []
      }
    }
  },
  mounted() {
  },
  methods: {
    // 显示时触发
    show() {
      this.load()
    },
    // 加载数据
    async load() {
      if (this.orderData.procInstId) {
        const { code = 0, data = [] } = await api.getWorkflowInfo({ procInstId: this.orderData.procInstId })
        if (code === 200) {
          this.formDatas._approve = data
        } else {
          this.formDatas._approve = []
          this.$message({ message: '获取数据失败', type: 'warning' })
        }
      }
    }
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
