<!--
 * @Descripttion:样板附件下载
 * @Author: xj
 * @Date: 2020-11-20 15:03:10
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-05-28 14:29:28
-->
<template>
  <div class="upload-file">
    <div class="flex_come">
      <div class="flex_left">{{ allText }}</div>
      <div v-if="allfileNames&&allfileNames.length" class="flex_right">
        <template v-if="getTypes(allfileNames)">
          <div v-for="(item, index) in allfileNames" :key="index">
            <div v-if="item" style="padding-left: 14px;margin-bottom: 4px; white-space: nowrap;">
              <span v-if="item.name"><i style="color: #888E9E;" class="el-icon-document" /></span>
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
import { downFile, downFilelog } from '../api/index'
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
        let up = ''
        if (link.hasOwnProperty('url')) {
          up = link.url
        } else {
          const dataURL = link.response
          up = dataURL && dataURL.data ? dataURL.data.viewUrl : ''
        }
        up && window.open(up)
      } else { // 新格式附加和旧格式附加混传 需要判断
        let res = ''
        const dataURL = link.response || ''
        if (link.hasOwnProperty('comType')) {
          if (link.hasOwnProperty('url') && link.comType === 'CRM') {
            res = await downFilelog({ url: link.url })
          } else {
            let sp = ''
            if (link.comType === 'order') {
              sp = link.id
            } else {
              sp = dataURL && dataURL.data && dataURL.data.id ? dataURL.data.id : ''
            }
            res = await downFile(sp)
          }
        } else if (dataURL) {
          const sp = dataURL && dataURL.data && dataURL.data.id ? dataURL.data.id : ''
          res = await downFile(sp)
        }
        res && this.$utils.downloadStream(res)
      }
    },
    getTypes(instence) { // 获取数据类型
      return Object.prototype.toString.call(instence).slice(8, -1) === 'Array'
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-file {
  width: 42%;
  min-height: 40px;
  max-height: 140px;
  .flex_come {
    display: flex;
    margin-bottom: 10px;
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
