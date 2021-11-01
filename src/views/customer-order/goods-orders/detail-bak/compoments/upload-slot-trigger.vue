<!--
 * @Author: 大货附件上传
 * @Description:
 * @Date: 2021-03-13 09:12:33
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-04-14 15:50:25
 * @FilePath: e:\erpmu\erp2-tech-manage-v2.0.3\src\views\customer-order\goods-orders\detail\compoments\upload-slot-trigger.vue
-->
<template>
  <!-- <el-button slot="trigger" size="small" type="primary">选取文件</el-button> -->
  <div class="analyse-upload">
    <i class="el-icon-upload" />
    <div slot="trigger" class="el-upload__text" style="font-size: 12px;">将文件拖到此处，或<em>点击上传</em></div>
    <div class="el-upload__tip" style="margin-top: 0px;color: #888E9E;line-height: 20px;">
      只能上传JPG/JPEG/PNG/BMP/PDF/EXCEL/WORD文件，且单个文件不超过10Mb
    </div>
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
.analyse-upload {
  .el-icon-upload {
    margin: 0!important;
  }
}
</style>
