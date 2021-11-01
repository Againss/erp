<template>
  <div class="upload-wrap">
    <template v-if="componentsOptions.type === 'start'">
      <div :style="componentsOptions.style">
        <label class="lable">附件上传</label>
        <el-upload
          name="file"
          class="upload-file"
          drag
          :action="actionUrl"
          :file-list="componentsOptions.filelist"
          :before-upload="componentsOptions.beforeUpload"
          :on-success="componentsOptions.success"
          :headers="headers"
          :show-file-list="false"
        >
          <div class="icon-wrap">
            <i class="el-icon-upload" />
          </div>
          <div class="el-upload__text">
            <p class="p1">将文件拖到此处，或点击<em>上传附件</em></p>
            <p class="p2">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</p>
          </div>
          <!--           <div class="el-upload__tip" slot="tip">
            只能上传jpg/png文件，且不超过500kb
          </div> -->
        </el-upload>
      </div>
    </template>
    <div
      v-if="componentsOptions.filelist && componentsOptions.filelist.length > 0"
      class="file-list"
      :style="componentsOptions.style"
    >
      <label
        v-if="
          componentsOptions.filelist && componentsOptions.type === 'details'
        "
        class="lable"
      >附件上传</label>
      <a
        v-for="(item, index) in componentsOptions.filelist"
        :key="item.url + index"
        target="_blank"
        @click.stop="downloadFils({ url: item.url })"
      >
        {{ item.name }}
        <i
          v-if="componentsOptions.type === 'start'"
          class="del-btn el-icon-close"
          @click.stop="componentsOptions.remove(item)"
        />
      </a>
    </div>
  </div>
</template>
<script>
import {
  getToken,
  getStorageToken
} from '@/utils/auth'
import { wmsFileDownload } from '../api/index'
export default {
  name: 'CustomUpload',
  props: {
    componentsOptions: {
      type: Object
    }
  },
  data() {
    return {
      actionUrl: '',
      headers: {},
      filelist: []
    }
  },
  mounted() {
    const hasToken = getToken()
    const baseUrl = this.$store.state.app.baseURL
    const action = this.componentsOptions.action
    if (baseUrl && action) {
      this.actionUrl = baseUrl + action + '?r=' + Math.random()
    }
    if (hasToken) {
      this.headers = {
        'ContentType': 'multipart/form-data',
        'spathv': getStorageToken('serveChange') || '',
        'Authorization': `Bearer ${getStorageToken()}`
      }
    }
  },
  methods: {
    downloadFils(params = {}) {
      wmsFileDownload(params).then(res => {
        this.$utils.downloadStream(res)
      })
    }
  }
}
</script>
<style  lang='scss' scoped>
.file-list {
  overflow: hidden;
  width: 400px;
  float: right;
  padding: 5px 0;
  a {
    display: inline-block;
    position: relative;
    font-size: 12px;
    i.del-btn {
      font-size: 14px;
      color: #484848;
      opacity: 0.6;
      position: absolute;
      right: 2px;
      top: 2px;
    }
    i.del-btn:hover {
      opacity: 1;
    }
  }
}
.lable {
  float: none;
  display: inline-block;
  text-align: left;
  text-align: right;
  vertical-align: middle;
  font-size: 14px;
  color: #606266;
  line-height: 32px;
  padding: 0 12px 10px 0;
  font-weight: 400;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
a {
  width: 400px;
  color: blue;
  text-decoration: underline;
  margin: 0;
  height: 20px;
  line-height: 20px;
  white-space: nowrap;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
}
/deep/.el-form-item__content{
  /deep/.upload-demo{
    margin-left: 0;
    margin-top: 0;
  }
}
.upload-demo,
.upload-file {
  .el-upload {
    display: block !important;
  }
  .el-upload-dragger {
    height: 185px;
  }
}
.upload-wrap {
  /deep/ .el-upload-dragger,
  .el-upload {
    width: 400px;
  }
}
/deep/ .el-upload-dragger {
  border: 1px dashed #c5d6f6;
}
/deep/.el-upload-dragger {
  .icon-wrap {
    position: relative;
    display: inline-block;
    margin: 20px auto 10px auto;
    width: 67px;
    height: 67px;
    line-height: 67px;
    border-radius: 50%;
    background: #f1f1f1;

    i.el-icon-upload {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 auto;
      transform: translate(-50%, -50%);
      color: #0986ff;
      display: inline-block;
      font-size: 38px;
    }
  }
  .el-upload__text {
    p {
      margin: 0;
      padding: 5px 0;
      font-size: 12px;
      text-align: center;
    }
    .p1 {
      color: #44494c;
    }
    .p2 {
      color: #888e9e;
    }
  }
}
</style>
