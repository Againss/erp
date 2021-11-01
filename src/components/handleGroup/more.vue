<template>
  <span class="handleAndMore">
    <el-tooltip placement="bottom" effect="light" popper-class="handleTooltip">
      <div slot="content" class="handleContent">
        <div
          v-for="(item, index) in handleDatas"
          :key="index"
          :style="item.style"
          class="handle"
          @click="item.method(scope)"
        >
          {{
            typeof item.moreHandleTag == 'function'
              ? item.moreHandleTag(scope)
              : item.moreHandleTag
          }}
        </div>
      </div>
      <span
        class="moreHandle"
        @click="handle"
      >更多<i class="el-icon-arrow-down" style="margin-left: 6px;" /></span>
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
      if (componentsOptions.isFilter && typeof componentsOptions.isFilter === 'function') {
        return componentsOptions.isFilter(this.scope, componentsOptions.moreHandle)
      } else {
        return componentsOptions.moreHandle
      }
      // return componentsOptions.moreHandle
      // const dataSource = this.componentsOptions.moreHandle.filter(item => {
      //   if (item.isShow) {
      //     if (typeof item.isShow === 'function') {
      //       return item.isShow(this.scope, this.form, this.formDatas, this.setFormDatas)
      //     } else {
      //       return item.isShow
      //     }
      //   }
      //   return false
      // })
      // return dataSource
    }
  },
  mounted() {
  },
  methods: {
    handle() {
    }
  }
}
</script>

<style lang='scss' scoped>
.handleContent {
  font-size: 14px;
  text-align: center;
  color: #0f89f3;
  cursor: pointer;

  .handle {
    cursor: pointer;
    height: 34px;
    line-height: 34px;
    padding: 0 20px;
    // margin-bottom: 10px;
  }

  .handle:hover {
    background-color: #f5f7fa;
  }

  > *:last-child {
    margin-bottom: 0px;
  }
}
</style>
<style lang="scss">
  .moreHandle {
    cursor: pointer; color: #1890ff
  }
  .handleTooltip {
    padding: 6px 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

</style>
