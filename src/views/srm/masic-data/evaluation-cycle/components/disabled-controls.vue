<template>
  <div class="operate-wrap">
    <span class="btn-item" @click="disabledHandel()">{{
      status !== 1 ? '启用' : '禁用'
    }}</span>
  </div>
</template>
<script>
export default {
  name: 'DisabledControls',
  props: {
    scope: {
      type: Object
    },
    componentsOptions: {
      type: Object
    }
  },
  computed: {
    status() {
      return this.scope.row.status
    }
  },
  methods: {
    disabledHandel() {
      this.componentsOptions.callback(this.scope.row)
    }
  }
}
</script>
<style scoped>
.btn-item {
  display: inline-block;
  padding: 5px 8px;
  cursor: pointer;
  color: #1890ff;
}
</style>
