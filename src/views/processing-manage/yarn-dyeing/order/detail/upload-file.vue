<!--
 * @Descripttion:附件下载
 * @Author: xj
 * @Date: 2020-11-20 15:03:10
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-06-25 17:59:29
-->
<template>
  <div class="upload-file yarnDyeingFile">
    <div class="flex_come">
      <div class="flex_left">附件:</div>
      <div v-if="allfileNames && allfileNames.length" class="flex_right">
        <template v-if="getTypes(allfileNames)">
          <div v-for="(item, index) in allfileNames" :key="index">
            <div v-if="item" class="line-fix">
              <span
                style="margin-right: 4px"
              ><i
                class="el-icon-document"
              /></span>
              <span
                class="line-upload-text"
                :title="item.name || ''"
                @click="lineJumpClick(index)"
              >{{ item.name }}</span>
            </div>
          </div>
        </template>
      </div>
      <div v-else class="flex_right" style="line-height: 32px">-</div>
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
      return (
        (this.formDatas && this.formDatas[this.componentsOptions.prop]) || []
      )
    },
    allfileLinks() {
      return (
        (this.formDatas[this.componentsOptions.url] &&
          this.formDatas[this.componentsOptions.url]) ||
        []
      )
    }
  },
  methods: {
    async lineJumpClick(index) {
      // if (this.formDatas && this.formDatas.isEdit) { return false }
      const link = this.allfileLinks[index]
      const accept = '.pdf,.PDF,.png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.bmp,.BMP'
      if (!link.name) {
        return false
      }
      const fileName = link.name.split('.') || []
      const fileType = fileName[fileName.length - 1]
      const regexp = new RegExp(fileType)
      const isXls = regexp.test(accept)
      if (isXls) {
        const up = link ? link.url : ''
        up && window.open(up)
      } else {
        // 新格式附加和旧格式附加混传 需要判断
        let res = ''
        const dataURL = link.id || ''
        if (dataURL) {
          res = await downFile(dataURL)
        }
        res && this.$utils.downloadStream(res)
      }
    },
    getTypes(instence) {
      // 获取数据类型
      return Object.prototype.toString.call(instence).slice(8, -1) === 'Array'
    }
  }
}
</script>
<style lang="scss" >
.yarnDyeingFile {
  .el-icon-document:before {
    color: #bbc2d0;
  }
}
</style>

<style lang="scss" scoped>
.upload-file {
  .flex_come {
    display: flex;
    margin-bottom: 10px;
      line-height: 32px;
    .flex_left {
      line-height: 32px;
      width: 96px;
      text-align: right;
      padding-right: 20px;
      color: #888e9e;
      font-size: 14px;
    }
    .flex_right {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
    }
  }
  .line-upload-text {
    font-size:14px;
    color:#474747;
  }
  .line-upload-text:hover {
    color: #1890ff;
  }
  .line-fix {
    padding-right: 4px;
    margin-bottom: 4px;
    white-space: nowrap;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    line-height: 32px;
    margin-right: 30px;
  }
}
</style>
