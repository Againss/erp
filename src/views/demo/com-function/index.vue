/**
 * @Description: 权限过滤公共方法
 * @author Roman
 * @date 2020/6/18
*/
<template>
  <div style="padding: 20px">
    <div style="background: #fff;padding: 10px">
      <div class="table">
        <div class="custom-demo-title">filterRouters(origin, asyncList):</div>
        <cs-custom-table
          :columns="columnsInfos"
          :data-source="filterRoutersConfig"
        />
      </div>
      <div class="table">
        <div class="custom-demo-title">bySort(list, key):</div>
        <cs-custom-table
          :columns="columnsInfos"
          :data-source="bySortConfig"
        />
      </div>

      <div>此方法有疑问请钉钉咨询:Roman</div>    </div>
  </div>
</template>

<script>

import columnsInfos from './config/columns'
import filterRoutersConfig from './config/filterRouters-config'
import bySortConfig from './config/bySort-config'
export default {
  components: {},
  data() {
    return {
      msg: 'table',
      columnsInfos,
      filterRoutersConfig,
      bySortConfig
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
    .table{ padding-bottom: 10px}
    .custom-demo-title{ font-size: 16px; padding: 10px; font-weight: bold; padding: 10px}
</style>
