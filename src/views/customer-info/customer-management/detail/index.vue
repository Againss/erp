<!--
 * @Author: xj
 * @Description: 收样详情
 * @Date: 2021-07-20 19:22:49
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-20 20:06:03
 * @FilePath: d:\sample\src\views\customer-order\plate-making\sample-collection\detail\index.vue
-->
<template>
  <div class="sample-collections">
    <div class="tab-change">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label=" 制版信息 " name="1" />
        <el-tab-pane label=" 接收记录 " name="2" />
        <el-tab-pane label=" 制版要求 " name="3" />
      </el-tabs>
    </div>
    <div v-show="activeName === '0'" class="order-request">
      <order-index
        ref="OrderRequest"
        :sync-data-handle="syncDataHandle"
        :order-data="orderIndexData"
        :is-edit="getEditabled"
      />
    </div>

    <div v-show="activeName === '3'" class="order-request">
      <plate-making
        ref="PlateMaking"
        :sync-data-handle="syncDataHandle"
        :order-data="orderIndexData"
      />
    </div>

  </div>
</template>

<script>
import orderIndex from './orderIndex'
import PlateMaking from './plate-making/index'

export default {
  components: {
    orderIndex,
    PlateMaking
  },
  data() {
    return {
      orderData: {
        baseInfo: {}
      },
      activeName: '3',
      status: '0',
      orderIndexData: {},
      isCopy: false
    }
  },
  computed: {
    getEditabled() {
      return this.isEdit && ['0', '2', '4'].includes(this.status)
    }
  },
  watch: {
    $route: {
      handler(val, oldVal) {
        const { params, query } = val
        if (params.id) {
          if (query.status) {
            this.isEdit = true
          } else {
            this.isEdit = false
          }
        } else {
          if (query.id) {
            this.isCopy = true
          } else {
            this.isCopy = false
          }
          this.isEdit = true
        }
      },
      deep: true,
      immediate: true
    }

  },
  mounted() {

  },
  methods: {
    syncDataHandle(key, data) {
      console.log('KEY', key, data)
    },
    handleClick() {}
  }
}
</script>

<style lang="scss" scoped>
.sample-collections{
    .tab-change {
    display: flex;
    background: #ffffff;
    align-items: center;
    border-bottom: 1px solid #eeeff0;
   /deep/ .el-tabs {
        margin-left: 26px;
        .el-tabs__header {
        margin: 0;
        }
        .el-tabs__nav-wrap::after {
            height: 0;
        }
        .el-tabs__item {
            padding: 10px 20px;
            height: auto;
        }
    }

  }
}

</style>

