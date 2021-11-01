<!--
 * @Descripttion:
 * @Author: ll
 * @Date: 2020-01-13
 * @LastEditors: admin
 * @LastEditTime: 2021-04-12 13:45:04
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
      let shearingRequirements = ''
      const arr = []
      if (this.componentsOptions && this.scope.row[this.componentsOptions.type] && this.scope.row[this.componentsOptions.type].length) {
        this.scope.row[this.componentsOptions.type].forEach(item => {
          arr.push(item.type.label + ':' + item.quantity + item.unit.label)
        })
        shearingRequirements = arr.join(',')
      }
      return shearingRequirements || ''
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
