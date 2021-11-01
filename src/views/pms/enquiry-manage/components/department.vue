<template>
  <div class="employeeDepartment">
    <div v-if="scope.row.suppliers && scope.row.suppliers.length <= 1" class="employeeDepartmentDiv">
      <span v-for="(item, index) in scope.row.suppliers" :key="index" style="margin-right:6px">{{ item.supplierName }}</span>
    </div>
    <el-tooltip v-else placement="top" effect="dark">
      <div slot="content" class="departmentTooltip customScrollbar">
        <div v-for="(item, index) in scope.row.suppliers" :key="index" class="tooltipItem">{{ item.supplierName }}</div>
      </div>
      <span>
        <span class="backgroundcolor">{{ scope.row.suppliers&&scope.row.suppliers[0].supplierName ? scope.row.suppliers[0].supplierName + '...' : '' }}</span>
      </span>
    </el-tooltip>

  </div>
</template>

<script>
export default {
  name: 'StateColumn',
  props: {
    scope: {
      type: Object
    },
    componentsOptions: {
      type: Object
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.employeeDepartment {
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;

    .employeeDepartmentDiv {
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
    }

    .backgroundcolor {
      // color: #909399;
      padding: 1px;
      border-radius: 4px;
    }
}
.departmentTooltip {
    max-height: 100px;
    overflow-y: auto;
    min-width: 100px;
    max-width: 300px;
    .tooltipItem {
      line-height: 26px;
    }
  }
</style>
<style lang="scss">
</style>
