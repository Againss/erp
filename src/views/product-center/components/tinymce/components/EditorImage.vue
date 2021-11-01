<!--
 * @Author: Sanmao
 * @Date: 2020-09-27 10:52:34
 * @LastEditors: Sanmao
 * @LastEditTime: 2020-10-29 16:50:54
 * @Descripttion: 富文本上传图片
-->
<template>
  <div class="upload-container">
    <cs-custom-form
      ref="searchForm"
      v-loading="isLoad"
      :data-source="uploadData"
      element-loading-text="图片上传中"
    />
    <uploadSlot v-if="false" />
  </div>
</template>

<script>
import uploadSlot from './upload-slot'

export default {
  name: 'EditorSlideUpload',
  components: {
    uploadSlot
  },
  props: {
    // 数据请求地址
    apiUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    const uploadData = [
      {
        prop: 'upload',
        itemType: 'upload',
        labelWidth: '30px',
        onSuccess: (res, file) => {
          // console.log(res, "res");
          // console.log(file, "file");
          this.$message.success('上传成功')
          this.isLoad = false
          const imgArr = []
          res.data && res.data.showUrl && imgArr.push(res.data.showUrl)
          this.$emit('successCBK', imgArr)
        },
        onError: (res, file) => {
          // console.log(res, file);
          this.isLoad = false
        },
        beforeUpload: (file) => {
          const fileType = file.type.split('/')[1]
          const regexp = new RegExp(fileType)
          const isImg = regexp.test(this.accept)
          const isLt1M = file.size / 1024 / 1024 < 5
          if (!isImg) {
            this.$message.error(
              '上传头像图片只能是 .jpg,.jpeg,.png,.bmp,.JPG,.JPEG,.PNG,.BMP 格式!'
            )
          }
          if (!isLt1M) {
            this.$message.error('上传头像图片大小不能超过 5MB!')
          }
          if (isImg && isLt1M) {
            this.isLoad = true
          }
          return isImg && isLt1M
        },
        action: this.apiUrl,
        accept: '.gif,.jpg,.jpeg,.png,.bmp,.GIF,.JPG,.JPEG,.PNG,.BMP',
        showFileList: false,
        timeout: 30000,
        content: [
          {
            slot: 'trigger',
            component: uploadSlot
          }
        ]
      }
    ]
    return {
      uploadData,
      accept: '.gif,.jpg,.jpeg,.png,.bmp,.GIF,.JPG,.JPEG,.PNG,.BMP',
      isLoad: false
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-container {
  /deep/.el-form-item {
    margin-bottom: 0;
  }
  /deep/.el-form-item .el-form-item__content {
    margin-left: 0 !important;
  }
}
</style>
