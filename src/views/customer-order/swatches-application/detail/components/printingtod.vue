<!--
 * @Author: xj
 * @Date: 2021-01-12 11:09:38
 * @LastEditTime: 2021-01-18 15:14:05
 * @LastEditors: OBKoro1
 * @Description: 色板申请表头
-->
<template>
  <!-- 头部状态 -->
  <div v-if="this.$route.params.id" class="status-info">
    <div class="info-code">申请单号：{{ detailObjs.id ? detailObjs.id : '-' }}</div>
    <div class="info-detail">
      <span>提交人：{{ detailObjs.submitName }}</span>
      <span>提交时间: {{ detailObjs.submitTime ? this.$filters.parseTime(detailObjs.submitTime) : '-' }}</span>
      <span :style="{ 'color': setStatusColor(detailObjs.status) }">{{ detailObjs.status | getState }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PrintingTod',
  filters: {
    getState(val) {
      switch (val) {
        case 0:
          return '草稿'
        case 1:
          return '进行中'
        case 2:
          return '已取消'
        case 3:
          return '已完成'
        // case 0:
        //   return '待分析'
        // case 1:
        //   return '分析中'
        // case 2:
        //   return '待审核'
        // case 3:
        //   return '已驳回'
        // case 4:
        //   return '已完成'
        // case 5:
        //   return '已取消'
        // case null:
        //   return '待分析'
        default:
          return ''
      }
    }
  },
  props: {
    detailObjs: {
      type: Object
    }
  },
  data() {
    return {}
  },
  methods: {
    setStatusColor(status) {
      let statusColor = ''
      switch (status) {
        case 0:
          statusColor = '#FF9214'
          break
        case 1:
          statusColor = '#FF9214'
          break
        case 2:
          statusColor = '#FF9214'
          break
        case 3:
          statusColor = '#888E9E'
          break
        case 4:
          statusColor = '#00BCC5'
          break
        case 5:
          statusColor = '#888E9E'
          break
        default:
          statusColor = ''
          break
      }
      return statusColor
    }
  }
}
</script>

<style lang="scss" scoped>
  .status-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 15px;
    padding: 0 20px;
    .info-code {
      font-size: 18px;
      color: #151222;
    }
    .copy-code {
      font-size: 12px;
      color: #777777;
    }
    .info-detail {
      font-size: 12px;
      color: #666666;
      span {
        margin-left: 5px;
      }
    }
  }
</style>
