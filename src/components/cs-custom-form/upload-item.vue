/**
 * @Description:输入框单元格
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <div>
    <el-upload
      ref="upload"
      :class="options.className||'upload-demo'"
      :style="options.style"
      :action="options.action||''"
      :headers="options.headers"
      :on-change="options.uploadChange||uploadChange"
      :multiple="multiple"
      :data="options.data"
      :name="options.name"
      :with-credentials="options.withCredentials"
      :show-file-list="options.showFileList"
      :drag="options.drag"
      :accept="options.accept"
      :on-preview="options.onPreview"
      :on-remove="options.onRemove"
      :on-success="options.onSuccess"
      :on-error="options.onError"
      :on-progress="options.onProgress"
      :before-remove="options.beforeRemove"
      :before-upload="beforeUpload"
      :list-type="options.listType"
      :auto-upload="options.autoUpload"
      :file-list="fileList"
      :http-request="options.httpRequest||httpRequest"
      :disabled="options.disabled"
      :limit="options.limit"
      :on-exceed="options.onExceed"
    >
      <template v-if="options.content">
        <component :is="item.component" v-for="(item,index) in options.content" :slot="item.slot" :key="index" @submit="submit" @clearFiles="clearFiles" @abort="abort" />
      </template>
      <template v-else>
        <el-button size="small" type="primary">{{ options.customText?options.customText:'点击上传' }}</el-button>
      </template>
    </el-upload>
    <cs-custom-pop :options="popOptions" />
  </div>
</template>

<script>
import csCropper from '@/components/cs-cropper'

export default {
  name: 'UploadItem',
  components: {
    csCropper
  },
  inheritAttrs: false,
  props: {
    options: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    value: {
      type: [String, Array]
    },
    change: {
      type: Function
    }
  },
  data() {
    const popOptions = {
      itemType: 'dialog',
      visible: false,
      width: '680px',
      title: '图片裁剪',
      className: 'cropperClass',
      // okHidden: true,
      okText: '确认',
      cancelText: '取消',
      // cancelHidden: true,
      ok: async(params) => {
        const getCropFile = await this.getCropFile()
        const fileList = [...this.fileList, getCropFile]
        const { data = {}, name = 'file', headers = {}, onProgress = () => {}, onSuccess = () => {}, onError = () => {}, withCredentials = false, action } = this.options
        const options = {
          filename: name,
          file: getCropFile.raw,
          raw: getCropFile,
          data,
          headers,
          onProgress,
          onSuccess,
          onError,
          withCredentials,
          action
        }
        await this.httpRequest(options)
        this.change(fileList)
        this.PopDialogHandle()
      },
      cancel: params => {
        this.PopDialogHandle()
      },
      component: csCropper,
      cropperOptions: { img: '', raw: null, style: { height: '300px' }, getCropFile: (getCropFile) => { this.getCropFile = getCropFile } }
    }

    return {
      cropper: null,
      fileList: [],
      popOptions,
      multiple: false,
      getCropFile: null
    }
  },
  computed: {},
  watch: {
    value: {
      handler(v) {
        if (v) {
          const newValue = v.filter(v => { if (v) { return true } })
          this.fileList = newValue
        }
      },
      immediate: true,
      deep: true
    },
    'options': {
      handler(v) {
        let multiple = true
        if (v.popOptions) {
          delete v.popOptions.visible
          multiple = false
          this.popOptions = { ...this.popOptions, ...v.popOptions }
        }
        v.popOptions

        if (v.multiple && multiple) {
          this.multiple = true
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {

  },
  methods: {
    PopDialogHandle() {
      this.popOptions.visible = !this.popOptions.visible
    },
    submit() {
      this.$refs.upload.submit()
    },
    abort(file) {
      this.$refs.upload.abort(file)
    },
    clearFiles() {
      this.$refs.upload.clearFiles()
    },
    uploadChange(file, fileList) {
      this.change(fileList)
    },
    beforeUpload(file) {
      const sign = this.options.beforeUpload(file)
      const isCropper = this.options.popOptions
      const isImg = /^image/.test(file.type)
      if (sign && isCropper && isImg) {
        this.cropperHandle(file)
        return false
      //   return Promise.reject('reject')
      }
      return sign
    },
    cropperHandle(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = (typeof e.target.result) === 'object' ? window.URL.createObjectURL(new Blob([e.target.result])) : e.target.result
        this.popOptions.visible = true
        this.popOptions.cropperOptions.img = data
        this.popOptions.cropperOptions.raw = file
      }
      reader.readAsArrayBuffer(file)
    },
    httpRequest(options) {
      const formData = new FormData()
      const { data, filename, file, withCredentials, headers, onProgress, onSuccess, onError, raw } = options
      if (data) {
        Object.keys(data).map(key => {
          formData.append(key, data[key])
        })
      }
      formData.append(filename, file, file.name)
      const unique = this.$utils.createUniqueString()
      const config = {
        url: `${options.action}?${unique}`,
        method: 'post',
        data: formData,
        raw: data && data.raw,
        withCredentials,
        headers,
        onUploadProgress: ({ total, loaded }) => {
          onProgress({ percent: Math.round(loaded / total * 100).toFixed(2) }, file)
        }
      }
      if (this.options.timeout) {
        config.timeout = this.options.timeout
      }
      this.$request(config).then(response => {
        const _file = raw || file
        onSuccess(response, _file)
      }).catch(onError)
    }
  }
}
</script>

<style lang="scss">
.cropperClass .el-dialog__body{padding-right:20px;}
</style>
