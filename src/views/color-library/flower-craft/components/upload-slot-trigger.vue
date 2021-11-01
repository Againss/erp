<!--
 * @Descripttion:
 * @version:
 * @Author: shujing
 * @Date: 2020-11-17 10:53:03
 * @LastEditors: anthony
 * @LastEditTime: 2020-12-21 09:18:10
-->
<template>
  <!-- <el-button slot="trigger" size="small" type="primary">选取文件</el-button> -->
  <div>
    <i class="el-icon-upload" />
    <div slot="trigger" class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    <div slot="trigger" class="el-desText">仅支持.jpg,.jpeg,.png,.bmp格式文件</div>
    <div slot="trigger" class="el-desText">单个文件不超过10MB,总数不超过2个</div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  },
  mounted() {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.el-upload__text {
  font-size: 12px;
  color: #44494C;
  height: 28px;
  line-height: 28px;
}
.el-desText {
  font-size: 12px;
  color: #888E9E;
  height: 20px;
  line-height: 20px;
}
</style>
