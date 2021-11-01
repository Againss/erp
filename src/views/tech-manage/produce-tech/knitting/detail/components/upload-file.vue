<!--
 * @Descripttion:附件下载
 * @Author: ll
 * @LastEditors: Please set LastEditors
-->
<template>
  <div class="upload-file">
    <div v-for="(item,index) in allfileNames" :key="index" class="file-item">
      <div v-if="item" class="file-box" style="margin: 10px 0;">
        <span><i class="el-icon-document" /></span>
        <span :title="item" class="line-upload-text" @click="lineJumpClick(index)">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { downLoadFile } from '../api/index'
export default {
  props: {
    formDatas: {
      type: Object
    },
    componentsOptions: {
      type: Object
    }
  },
  computed: {
    allfileNames() {
      return (this.formDatas[this.componentsOptions.prop] || [])
    },
    allfileLinks() {
      return (this.formDatas[this.componentsOptions.url]) || []
    }
  },
  methods: {
    async lineJumpClick(index) {
      const link = this.allfileLinks[index].url
      const res = await downLoadFile({ url: link })
      this.$utils.downloadStream(res)
    }
  }
}
</script>
<style lang="scss">
.upload-file{
  width: 40%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  .file-item {
    display: flex;
    width: 50%;
    height: 36px;
    line-height: 36px;
    padding-right: 20px;
    .file-box {
      width: 100%;
      display: flex;
      align-items: center;
      .el-icon-document {
        display: flex;
        color: #BBC2D0;
      }
      .line-upload-text{
        display: inline-block;
        font-size: 14px;
        color: rgba(9,134,255,0.9);
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-left: 8px;
      }
    }
  }
  .line-upload-text:hover{
    color: #1890ff,
  }
}
</style>
