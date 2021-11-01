<template>
  <el-row :gutter="20" class="upSupplier">
    <el-col :span="12">
      <el-upload
        :drag="componentsOptions.drag || true"
        :action="componentsOptions.action"
        :multiple="componentsOptions.multiple"
        :headers="componentsOptions.headers"
        :data="componentsOptions.data"
        :name="componentsOptions.name"
        :with-credentials="componentsOptions.withCredentials"
        :show-file-list="componentsOptions.showFileList"
        :accept="componentsOptions.accept"
        :on-preview="componentsOptions.onPreview"
        :on-remove="componentsOptions.onRemove"
        :on-success="componentsOptions.onSuccess"
        :on-error="componentsOptions.onError"
        :on-progress="componentsOptions.onProgress"
        :before-remove="componentsOptions.beforeRemove"
        :before-upload="componentsOptions.beforeUpload"
        :list-type="componentsOptions.listType"
        :auto-upload="componentsOptions.autoUpload"
        :http-request="componentsOptions.httpRequest || httpRequest"
        :disabled="componentsOptions.disabled"
        :limit="componentsOptions.limit"
        :on-exceed="componentsOptions.onExceed"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
          <div slot="tip" class="el-upload__tip">
            只能上传{{ componentsOptions.accept }}格式
          </div>
        </div>
      </el-upload>
    </el-col>
    <el-col :span="12">
      <div class="" @click.stop="bindDownload">
        <div class="process-download">
          <img src="@/assets/images/process-down.png">
          <div style="font-size: 12px;color: #474747;">下载模板</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import * as api from '../../api/index'
export default {
  props: {
    componentsOptions: {
      type: Object
    }
  },
  data() {
    return {}
  },
  methods: {
    async bindDownload() {
      const res = await api.fileDownload(this.componentsOptions.downApi)
      this.$utils.downloadStream(res)
    },
    httpRequest(options) {
      const formData = new FormData()
      const { data, filename, file, withCredentials, headers, onProgress, onSuccess, onError } = options
      if (data) {
        Object.keys(data).map(key => {
          formData.append(key, data[key])
        })
      }
      formData.append(filename, file)
      const config = {
        url: `${options.action}?${new Date().getTime()}`,
        method: 'post',
        data: formData,
        raw: data && data.raw,
        withCredentials,
        headers: headers,
        onUploadProgress: ({ total, loaded }) => {
          onProgress({ percent: Math.round(loaded / total * 100).toFixed(2) }, file)
        }
      }
      if (this.componentsOptions.timeout) {
        config.timeout = this.componentsOptions.timeout
      }
      this.$request(config).then(response => {
        onSuccess(response, file)
      }).catch(onError)
    }
  }
}
</script>

<style lang="scss" scoped>
.upSupplier{
  .el-icon-upload{
    font-size: 44px;
    margin: 35px 0px 0px;
  }
  /deep/ .el-upload-dragger{
    width: 300px;
    height: 146px;
  }
  .el-upload__text{
    font-size: 12px;
    color: #474747;
  }
  .el-upload__tip{
    font-size: 12px;
    color: #888e9e;
  }
  .process-download {
    cursor: pointer;
    text-align: center;
    width: 300px;
    height: 146px;
    border: 1px dashed #c5d6f6;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    img {
      width: 44px;
      height: 44px;
      display: inline-block;
      margin: 0 auto;
    }
  }
}
</style>
