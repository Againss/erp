<!--
 * @Descripttion:
 * @Author: shujing
 * @Date: 2020-11-20 15:03:10
 * @LastEditors: admin
 * @LastEditTime: 2021-04-16 14:04:10
-->
<template>
  <div class="uploadBox">
    <div class="lableText">{{ componentsOptions.label }}</div>
    <div class="upload-left-box">
      <div v-for="(item,index) in propValue" :key="index" class="uploadFlow" @click="downLoadFile(item)">
        <div class="text-style" :title="item.name"> <i style="color: #BBC2D0;margin-right: 5px;font-size: 13px;" class="el-icon-paperclip" />{{ item.name }}</div>
        <!-- <div class="line-jump-text">下载</div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { downFile } from '../api/index.js'
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
    propValue() {
      if (this.formDatas.attachmentList && Array.isArray(this.formDatas.attachmentList)) {
        return this.formDatas.attachmentList
      }
      return []
    }
  },
  methods: {
    // 文件下载
    async downLoadFile(item) {
      const link = item.viewUrl || ''
      const accept = '.pdf,.PDF,.png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.bmp,.BMP'
      const fileName = link && link.split('.')
      const fileType = fileName && fileName[fileName.length - 1]
      const regexp = fileType && new RegExp(fileType)
      const isXls = regexp.test(accept)
      if (isXls) {
        window.open(link)
      } else {
        const res = await downFile({ url: item.id })
        this.$utils.downloadStream(res)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.uploadBox{
  width: 100%;
  display: flex;
  align-items: baseline;
  .lableText{
    width: 120px;
    font-size: 14px;
    color: #3C4043;
    margin-top: 20px;
    line-height: 30px;
    text-align: right;
  }
  .upload-left-box{
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font-size: 14px;
    color: #1890ff;
    margin-left: 10px;
    cursor: pointer;
    .uploadFlow{
      width: 200px;
      margin-right: 3%;
      display: flex;
    }
  }
  .line-jump-text{
    flex-shrink: 0;
    width: 40px;
    margin-left: 5px;
  }
  .text-style{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-bottom: 10px;
    font-size: 16px;
  }

}
</style>
