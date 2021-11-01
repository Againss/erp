<template>
  <span>
    <el-tooltip
      v-if="
        componentsOptions.moreHandle && componentsOptions.moreHandle.length > 0
      "
      placement="bottom"
      effect="light"
      popper-class="tooltip"
    >
      <div slot="content" class="handleContent">
        <div
          v-for="(item, index) in handleDatas"
          :key="index"
          class="handle"
          :style="item.style"
          @click="item.method(scope)"
        >
          {{ item.moreHandleTag }}
          <!--  {{
            typeof item.moreHandleTag == 'function'
              ? item.moreHandleTag(scope)
              : item.moreHandleTag
          }} -->
        </div>
      </div>
      <span
        class="moreHandle"
        style="cursor: pointer; color: #1890ff"
      >更多</span>
    </el-tooltip>
  </span>
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
  computed: {
    handleDatas() {
      const componentsOptions = this.componentsOptions
      /*   if (componentsOptions.isFilter && typeof componentsOptions.isFilter === 'function') {
          return componentsOptions.isFilter(this.scope, componentsOptions.moreHandle)
        } */

      return componentsOptions.moreHandle.filter(item => {
        if (item.isShow && typeof (item.isShow) === 'function') {
          return item.isShow(this.scope)
        }
        return item.isShow
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.handleContent {
  text-align: center;
  color: #1890ff;
  cursor: pointer;

  .handle {
    cursor: pointer;
    margin-bottom: 10px;
  }

  .handle:hover {
    background-color: #eee;
  }

  > *:last-child {
    margin-bottom: 0px;
  }
}
</style>
