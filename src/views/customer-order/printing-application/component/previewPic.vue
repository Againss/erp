<!--
 * @Date: 2020-12-19
 * @Author: ll
 * @LastEditTime: 2020-12-19
 * @Descripttion: hover图片右侧预览
-->
<template>
  <el-popover placement="right" width="225" trigger="hover">
    <div class="color-div" :style="getStyle">
      <img :src="scope.row.printColorDesign" width="100%" height="100%" alt="">
    </div>
    <div slot="reference" class="color-show" :style="getStyle">
      <img :src="scope.row.printColorDesign" width="100%" height="100%" alt="">
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
      if (this.scope.row.printColorDesign) {
        str = `display:block`
      }
      return str
    }
  }

}
</script>

<style lang="scss" scoped>
.color-div {
  width: 185px;
  height: 185px;
}
.color-show {
  width: 34px;
  height: 34px;
}
</style>
