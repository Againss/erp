<!--
 * @Descripttion:
 * @Author: ll
 * @Date: 2020-01-13
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-06-01 19:24:47
-->
<template>
  <div v-highlight>
    <el-tooltip :key="scope.row.id" placement="top" effect="dark">
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
