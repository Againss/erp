<!--
 * @Descripttion:附件下载
 * @Author: xj
 * @Date: 2020-11-20 15:03:10
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-01-20 16:53:56
-->
<template>
  <div class="upload-file">
    <div class="flex_come">
      <div class="flex_left">附件上传：</div>
      <div class="flex_right">
        <div v-for="(item, index) in allfileNames" :key="index">
          <div v-if="item" style="padding-left: 14px">
            <span><i class="el-icon-document" /></span>
            <span
              class="line-upload-text"
              :title="item.name || ''"
              @click="lineJumpClick(index)"
            >{{ item.name }}</span>
          </div>
        </div>
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
      return (this.formDatas[this.componentsOptions.url] && this.formDatas[this.componentsOptions.url]) || []
    }
  },
  methods: {
    async lineJumpClick(index) {
      const link = this.allfileLinks[index]
      const res = await downFile({ url: link.url })
      this.$utils.downloadStream(res)
    }

  }
}
</script>
<style lang="scss" scoped>
.upload-file {
  width: 42%;
  .flex_come {
    display: flex;
    .flex_left {
      width: 80px;
      margin-left: 20px;
      color: #606266;
      font-size: 14px;
    }
    .flex_right {
      flex: 1;
    }
  }
  .line-upload-text {
    // margin: 10px 0;
    font-size: 14px;
    color: #606266;
    cursor: pointer;
    width: 100%;
    overflow: hidden;
    max-width: 500px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: text-top;
  }
  .line-upload-text:hover {
    color: #1890ff;
  }
}
</style>
