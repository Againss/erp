<!--
 * @Descripttion:
 * @version:
 * @Author: shujing
 * @Date: 2020-11-17 10:53:03
 * @LastEditors: admin
 * @LastEditTime: 2021-01-06 13:46:13
-->
<template>
  <!-- <el-button slot="trigger" size="small" type="primary">选取文件</el-button> -->
  <div>
    <i class="el-icon-upload" />
    <div slot="trigger" class="el-upload__text" style="font-size: 12px;">将文件拖到此处，或<em>点击上传</em></div>
    <div class="el-upload__tip" style="margin-top: 0px;color: #888E9E;">只能上传JPG/JPEG/PNG/BMP/PDF/EXCEL/WORD文件，且单个文件不超过10Mb</div>
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
</style>
