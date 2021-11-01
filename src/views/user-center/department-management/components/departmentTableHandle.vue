<template>
  <div class="departmentTableHandle">
    <span class="hangle" @click="componentsOptions.editDepartment(scope)">编辑<el-divider v-if="scope.row.orgType!==1" direction="vertical" /></span>
    <span v-if="scope.row.orgType!==1" class="hangle" @click="componentsOptions.deleteDepartment(scope)">删除</span>
  </div>
</template>

<script>
export default {
  name: 'DepartmentTablehandle',
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
