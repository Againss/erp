<!--
 * @Author: xj
 * @Description:
 * @Date: 2021-07-20 19:55:28
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-20 20:08:50
 * @FilePath: d:\sample\src\views\customer-order\plate-making\sample-collection\detail\orderIndex.vue
-->

<template>
  <div class="sample-collectionsOrder">
    <!-- 基本信息 -->
    <baseInfo ref="baseInfoData" :status="status" :is-edit="isEdit" :data="baseInfoData" :sync-moudle-data-handle="syncMoudleDataHandle" :set-parent-data-handle="setParentDataHandle" />
  </div>
</template>

<script>
import baseInfo from './base-info'
export default {
  components: {
    baseInfo // 基本信息
  },
  props: {
    isEdit: {
      type: Boolean
    },
    orderData: {
      type: Object
    },
    syncDataHandle: {
      type: Function
    },
    currentVersionChange: {
      type: Function
    }
  },
  data() {
    return {
      status: '0', // 订单状态
      baseInfoData: {} // 基础信息数据
    }
  },
  mounted() {
  },
  methods: {
    syncMoudleDataHandle(key, data) { // 同步右侧各个模块的全量表单数据
      console.log(key, data)
    },
    setParentDataHandle(key, data) { // 同步右侧各个模块的部分字段数据
      console.log(key, data)
    }

  }
}
</script>

<style lang="scss" scoped>

</style>
