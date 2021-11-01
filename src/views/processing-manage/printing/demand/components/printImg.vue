<!--
 * @Date: 2020-11-03 15:34:30
 * @Author: Againss
 * @LastEditTime: 2021-07-19 17:34:15
 * @LastEditors: anthony
 * @Descripttion:
-->
<template>
  <el-popover popper-class="changeImg-sty" placement="right" width="220" trigger="hover">
    <div class="color-div" :style="getStyle">
      <img :src="scope.row.colorPath" width="100%" height="100%" alt="">
    </div>
    <div slot="reference" class="color-show" :style="getStyle">
      <img :src="scope.row.colorPath" width="100%" height="100%" alt="">
    </div>
  </el-popover>
</template>

<script>
export default {
  props: {
    scope: {
      type: Object
    }
  },
  computed: {
    getStyle() {
      let str = 'display:none'
      if (this.scope.row.colorPath) {
        str = `display:block`
      }
      return str
    }
  }

}
</script>
<style lang="scss">
.changeImg-sty {
  padding-left: 12px;
  padding-bottom: 6px;
}
</style>
<style lang="scss" scoped>
.color-div {
  width: 100%;
  height: 100%;
}
.color-show {
  width: 25px;
  height: 25px;
}
</style>
