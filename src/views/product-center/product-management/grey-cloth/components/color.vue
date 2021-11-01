<!--
 * @Description: 提花号图片展示
 * @Autor: zhengjin
 * @Date: 2021-07-02 17:09:08
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-07-02 18:02:59
-->
<template>
  <el-popover placement="top-start" width="200" trigger="click">
    <div class="color-div" :style="getStyle">
      <img :src="scope.row.showUrl" width="100%" height="100%" alt="">
    </div>
    <div slot="reference" class="color-show" :style="getStyle">
      <span>{{ scope.row.jacquardCode }}</span>
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
      if (this.scope.row.showUrl) {
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
  width: 100%;
  // height: 25px;
  span {
    display: inline-block;
    width: 100%;
    color: #1890ff;
    cursor: pointer;
  }
}
</style>
