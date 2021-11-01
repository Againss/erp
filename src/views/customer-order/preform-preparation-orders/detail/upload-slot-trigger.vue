/**
 * @Description: 附件插槽
 * @author Roman
 * @date 2021-05-06 15:16:54
 * @edit 2021-05-06 15:16:54
*/
<template>
  <!-- <el-button slot="trigger" size="small" type="primary">选取文件</el-button> -->
  <div class="analyse-upload">
    <img class="upload-icon" src="@/assets/images/upload.png" alt="">
    <!-- <i class="el-icon-upload" /> -->
    <div slot="trigger" class="el-upload__text" style="font-size: 12px;">将文件拖到此处，或<em>点击上传</em></div>
    <!-- <div class="el-upload__tip" style="margin-top: 0px;color: #888E9E;line-height: 20px;">
      只能上传JPG/JPEG/PNG/BMP/PDF/EXCEL/WORD文件，且单个文件不超过10Mb
    </div> -->
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
  .upload-icon {
    width: 40px;
    height: 30px;
    margin-top: 16px;
  }
}
</style>
