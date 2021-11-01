<!--
 * @Date: 2020-11-03 15:34:30
 * @Author: Againss
 * @LastEditTime: 2021-04-23 11:11:34
 * @LastEditors: Againss
 * @Descripttion:
-->
<template>
  <el-popover placement="right" width="120" trigger="hover">
    <div class="color-div" :style="getStyle" />
    <div slot="reference" class="color-show" :style="getStyle" />
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
      if (this.scope.row.dataColor) {
        str = `background:rgb(${this.scope.row.dataColor.sr},${this.scope.row.dataColor.sg},${this.scope.row.dataColor.sb});display:block`
      }
      return str
    }
  }

}
</script>

<style lang="scss" scoped>
.color-div {
  width: 120px;
  height: 120px;
}
.color-show {
  width: 25px;
  height: 25px;
}
</style>
