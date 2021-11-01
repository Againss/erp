<!--
 * @Date: 2020-11-03 15:34:30
 * @Author: Againss
 * @LastEditTime: 2021-04-22 16:19:50
 * @LastEditors: Againss
 * @Descripttion:
-->
<template>
  <el-popover placement="right" width="120" trigger="hover">
    <div class="color-div" :style="getStyle">
      <img :src="scope.row.printingPattern" width="100%" height="100%" alt="">
    </div>
    <div slot="reference" class="color-show" :style="getStyle">
      <img :src="scope.row.printingPattern" width="100%" height="100%" alt="">
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
      if (this.scope.row.printingPattern) {
        str = `display:block`
      }
      return str
    }
  }

}
</script>

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
