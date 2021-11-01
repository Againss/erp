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
      v-if="scope.row.status.code !== 'P'"
      direction="vertical"
    /></span>
    <span
      v-if="scope.row.status.code !== 'P'"
      class="hangle"
      @click="componentsOptions.deleteDepartment(scope)"
    >删除</span>
  </div>
</template>

<script>
export default {
  name: 'CustomAction',
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
  },
  computed: {},
  watch: {},
  mounted() {
    // console.log('111', this.scope)
  },
  methods: {
    handle() {}
  }
}
</script>

<style lang="scss" scoped>
.hangle {
  color: #1890ff;
  cursor: pointer;
}
</style>
