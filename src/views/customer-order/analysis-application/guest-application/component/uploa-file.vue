<!--
 * @Descripttion:附件下载
 * @Author: shujing
 * @Date: 2020-11-20 15:03:10
 * @LastEditors: admin
 * @LastEditTime: 2021-01-11 14:48:24
-->
<template>
  <div class="upload-file">
    <div v-for="(item,index) in allfileNames" :key="index">
      <div v-if="item" style="margin: 15px 0;padding-left:14px;">
        <span><i class="el-icon-document" /></span>
        <span class="line-upload-text" @click="lineJumpClick(index)">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { downFile } from '../api/index'
export default {
  props: {
    // scope: {
    //     type: Object
    // },
    formDatas: {
      type: Object
    },
    componentsOptions: {
      type: Object
    }
  },
  computed: {
    allfileNames() {
      return (this.formDatas && this.formDatas[this.componentsOptions.prop]) || []
    },

    allfileLinks() {
      return (this.formDatas[this.componentsOptions.url] && this.formDatas[this.componentsOptions.url].split(',')) || []
    }
  },
  methods: {
    async lineJumpClick(index) {
      const link = this.allfileLinks[index]
      const res = await downFile({ url: link })
      this.$utils.downloadStream(res)
    }

  }
}
</script>
<style lang="scss">
.upload-file{
  .line-upload-text{
    // margin: 10px 0;
    font-size: 14px;
    cursor: pointer;
    // color: #1890ff,
  }
  .line-upload-text:hover{
    color: #1890ff,
  }
}
</style>
