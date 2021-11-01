<!--
 * @Description: 浮动文字
 * @Autor: zhengjin
 * @Date: 2021-08-04 14:47:33
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-08-06 16:43:20
-->

<template>
  <el-tooltip class="item" :content="value" placement="top-start">
    <span>{{ !value ? '-' : value }}</span>
  </el-tooltip>
</template>

<script>
export default {
  props: {
    options: {
      type: Object
    },
    value: {
      type: String
    },
    formDatas: {
      type: [Object, Array]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
