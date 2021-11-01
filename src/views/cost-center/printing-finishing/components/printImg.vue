<!--
 * @Descripttion: 印花图案
 * @Author: admin
 * @Date: 2021-07-16 13:44:12
 * @LastEditors: admin
 * @LastEditTime: 2021-07-29 15:11:44
-->

<template>
  <el-popover popper-class="changeImg-sty" placement="right" width="220" trigger="hover">
    <el-form-item
      slot="reference"
      :label="options.label"
      :style="itemStyle"
    >
      <div class="color-show" :style="getStyle">
        <img :src="formDatas.colorPath" width="100%" height="100%" alt="">
      </div>
    </el-form-item>
    <div class="color-div" :style="getStyle">
      <img :src="formDatas.colorPath" width="100%" height="100%" alt="">
    </div>
  </el-popover>
</template>

<script>
export default {
  props: {
    formDatas: {
      type: Object
    },
    options: {
      type: Object
    }
  },
  computed: {
    getStyle() {
      let str = 'display:none'
      if (this.formDatas.colorPath) {
        str = `display:block`
      }
      return str
    },
    itemStyle() {
      return { 'box-sizing': 'border-box', 'margin-right': '0px', 'padding-right': '30px', ...this.options.itemStyle }
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
