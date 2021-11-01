<!--
 * @name: 悬浮弹框组件
 * @description: 悬浮弹框组件
 * @author: panmr
 * @time: 2021-05-14 17:37:35
-->
<template>
  <div v-highlight>
    <el-tooltip :key="scope.row.id" placement="top">
      <!-- 悬浮 -->
      <div slot="content">
        <div v-for="(item, key) in scope.row.apsLossDetailYarnInfoRespList" :key="key">
          <div v-for="(n, index) in (item[componentsOptions.type] ? item[componentsOptions.type].split('|') : [])" v-show="item[componentsOptions.type] && item[componentsOptions.type].includes('|')" :key="index">
            <p style="font-size: 9px;margin: 0">{{ n + (index !== item[componentsOptions.type].split('|').length - 1 ? ' |' : '') }}</p>
          </div>
          <div v-show="item[componentsOptions.type] && !item[componentsOptions.type].includes('|')">
            <p>{{ item[componentsOptions.type] || '&nbsp;' }}</p>
          </div>
        </div>
      </div>
      <!-- 显示 -->
      <div class="oneRow">
        <div v-for="(item, key) in scope.row.apsLossDetailYarnInfoRespList" :key="key">
          <!--          <div v-for="(n, index) in (item[componentsOptions.type] ? item[componentsOptions.type].split('|') : [])" v-show="item[componentsOptions.type] && item[componentsOptions.type].includes('|')" :key="index">-->
          <!--            <p style="color:red;font-size: 9px;margin: 0">{{ n + (index !== item[componentsOptions.type].split('|').length - 1 ? ' |' : '') }}</p>-->
          <!--          </div>-->
          <!--          <div v-show="item[componentsOptions.type] && !item[componentsOptions.type].includes('|')">-->
          <!--            <p>{{ item[componentsOptions.type] }}</p>-->
          <!--          </div>-->
          <div style="height: 42px;line-height: 42px">
            <div class="text-overflow">{{ item[componentsOptions.type] || '&nbsp;' }}</div>
            <div style="border-bottom: 1px solid #dfe6ec" />
          </div>
        </div>
      </div>
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
      return this.scope.row.apsLossDetailYarnInfoRespList
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
.text-overflow {
  width:230px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>
