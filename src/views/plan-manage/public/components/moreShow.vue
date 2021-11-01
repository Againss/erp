<!--
 * @Descripttion:
 * @Author: ll
 * @Date: 2020-01-13
 * @LastEditors: ll
 * @LastEditTime: 2020-01-19
-->
<template>
  <div v-highlight>
    <el-tooltip :key="scope.row.id" placement="top" effect="light">
      <div slot="content">
        <!-- 悬浮 -->
        <div
          v-html="getComponentsOptionsType && getComponentsOptionsType.replace(/,/g, '<br>')"
        />
      </div>
      <!-- 显示 -->
      <div
        class="oneRow"
        v-html="getComponentsOptionsType"
      />
    </el-tooltip>
  </div>
</template>
<script>
export default {
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
  computed: {
    getComponentsOptionsType() {
      return this.scope.row[this.componentsOptions.type] || ''
    }
  }
}
</script>
<style lang="scss">
.oneRow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
