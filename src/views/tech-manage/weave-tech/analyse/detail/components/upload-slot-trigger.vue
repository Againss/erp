<!--
 * @Descripttion: 附件上传
 * @Author: ll
 * @LastEditors: Please set LastEditors
-->
<template>
  <div class="analyse-upload">
    <i class="el-icon-upload" />
    <div slot="trigger" class="el-upload__text" style="font-size: 12px;">将文件拖到此处，或<em>点击上传</em></div>
    <div class="el-upload__tip" style="margin-top: -10px;color: #888E9E;">只能上传JPG/JPEG/PNG/BMP/PDF/EXCEL/WORD文件，且单个文件不超过10Mb</div>
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

<style lang="scss">
.analyse-upload {
  .el-icon-upload {
    margin: 0!important;
  }
}
</style>
