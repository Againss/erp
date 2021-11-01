<!--
 * @Description: 备注信息
 * @Autor: zhengjin
 * @Date: 2021-08-03 15:11:38
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-08-06 17:49:55
-->

<template>
  <div class="acvite">
    <i class="el-icon-upload" />
    <div class="el-upload__text" style="color: #44494C">请选择导入图片</div>
    <div class="el-upload__text">仅支持JPG/PNG文件</div>
    <div class="el-upload__text">大小不超过1M,建议尺寸为204x204</div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {

    }
  },
  watch: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.acvite {
  width: 100%;
  height: 100%;
  display: flex;
  // justify-items: center;
  // align-items: center;
  flex-direction: column;
  padding-top: 70px;
  ::v-deep
  .el-icon-upload {
    font-size: 60px;
    color: #0986FF;
    opacity: .7;
  }
  .el-upload__text {
    font-size: 12px;
    color: #888E9E;
    height: 20px;
    line-height: 20px;
  }
}
</style>
