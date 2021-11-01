<!--
 * @Descripttion: 选项配置
 * @Author: admin
 * @Date: 2021-05-28 18:05:46
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-06-22 10:41:35
-->
<template>
  <div v-highlight>
    <el-tooltip :key="scope.row.id" placement="top" effect="light">
      <div slot="content">
        <!-- 悬浮 -->
        <div
          v-html="getComponentsOptionsType && getComponentsOptionsType.replace(/;/g, '<br>')"
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
