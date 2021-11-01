<!--
 * @Descripttion: 生产状态操作
 * @version:
 * @Author: shujing
 * @Date: 2020-09-25 14:03:54
 * @LastEditors: shujing
 * @LastEditTime: 2020-10-15 17:25:19
-->
<template>
  <div class="departmentTableHandle">
    <span
      v-if="scope.row.status.code !== 'P'"
      class="hangle"
      @click="componentsOptions.examDepartment(scope)"
    >审核<el-divider
      direction="vertical"
    /></span>
    <span
      class="hangle"
      @click="componentsOptions.editDepartment(scope)"
    >编辑<el-divider
      v-if="scope.row.status.code !== 'P' || scope.row.seq!==1 || scope.row.seq!==scope.row.total"
      direction="vertical"
    /></span>
    <span
      v-if="scope.row.status.code !== 'P'"
      class="hangle"
      @click="componentsOptions.deleteDepartment(scope)"
    >删除<el-divider
      v-if="scope.row.status.code !== 'P'"
      direction="vertical"
    /></span>
    <span v-if="scope.row.seq!==1" class="hangle" @click="componentsOptions.sortupDepartment(scope)">上移<el-divider v-if="scope.row.seq!==scope.row.total" direction="vertical" /></span>
    <span v-if="scope.row.seq!==scope.row.total" class="hangle" @click="componentsOptions.sortdownDepartment(scope)">下移</span>
  </div>
</template>

<script>
export default {
  name: 'CustomAction',
  props: {
    scope: {
      type: Object
    },
    total: {
      type: Number
    },
    componentsOptions: {
      type: Object
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {
    // console.log('111', this.scope)
  },
  methods: {
    handle() {
    }
  }
}
</script>

<style lang="scss" scoped>
.hangle {
  color: #1890ff;
  cursor: pointer;
}
</style>
