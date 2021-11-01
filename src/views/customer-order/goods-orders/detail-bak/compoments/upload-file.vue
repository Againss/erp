<!--
 * @Descripttion:大货附件下载
 * @Author: xj
 * @Date: 2020-11-20 15:03:10
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-05-28 14:25:15
-->
<template>
  <div class="upload-file">
    <div class="flex_come">
      <div class="flex_left">{{ allText }}</div>
      <div v-if="allfileNames&&allfileNames.length" class="flex_right">
        <template v-if="getTypes(allfileNames)">
          <div v-for="(item, index) in allfileNames" :key="index">
            <div v-if="item" style="padding-left: 14px;margin-bottom: 4px;">
              <span><i class="el-icon-document" /></span>
              <span
                class="line-upload-text"
                :title="item.name || ''"
                @click="lineJumpClick(index)"
              >{{ item.name }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { downFile, downFilelog } from '../../api/index'
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
    allText() {
      return this.componentsOptions.text || ''
    },
    allfileLinks() {
      return (this.formDatas[this.componentsOptions.url] && this.formDatas[this.componentsOptions.url]) || []
    }
  },
  methods: {
    async lineJumpClick(index) {
      if (this.formDatas && this.formDatas.isEdit) { return false }
      const link = this.allfileLinks[index]
      const accept = '.pdf,.PDF,.png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.bmp,.BMP'
      if (!link.name) { return false }
      const fileName = link.name.split('.') || []
      const fileType = fileName[fileName.length - 1]
      const regexp = new RegExp(fileType)
      const isXls = regexp.test(accept)
      if (isXls) {
        window.open(link.url)
      } else {
        let res = ''
        if (link.hasOwnProperty('comType')) {
          res = await downFilelog({ url: link.url })
        } else {
          res = await downFile(link.id)
        }
        this.$utils.downloadStream(res)
      }
    },
    getTypes(instence) { // 获取数据类型
      return Object.prototype.toString.call(instence).slice(8, -1) === 'Array'
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-file{
  width: 42%;
  min-height: 40px;
  max-height: 140px;
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
    max-width: 420px;
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
