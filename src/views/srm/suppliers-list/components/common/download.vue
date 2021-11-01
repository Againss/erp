<template>
  <div class="downloadTemplate">
    <el-button size="small" plain class="download" icon="el-icon-download download-icon" @click="download">下载模板</el-button>
  </div>
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
    return {
      excelFlag: true
    }
  },
  methods: {
    async download() {
      // 1采购类设备 2针织 3染整 4印花 5染纱
      const arr = [
        '/supplierDeviceInfo/supplierMerge/excel/template/download',
        '/supplierDeviceInfo/knitting/excel/template/download',
        '/supplierDeviceInfo/dyeingAndFinishingPlant/excel/template/download',
        '/supplierDeviceInfo/printing/excel/template/download'
      ]
      // this.componentsOptions.downType
      const res = await api.fileDownload('/srm' + arr[this.componentsOptions.downType - 1 || 0])
      this.$utils.downloadStream(res)
    }
  }
}
</script>

<style lang="scss" scoped>
.downloadTemplate {
    margin-top: 18px;
    margin-left: 66px;
    .download {
      border-color: #1682e6;
      color: #1682e6;
      margin-bottom: 40px;
      display: flex;
      align-items: center;
    }
}
</style>
<style>
  .download-icon {
      font-size: 18px;
      line-height: 0;
  }
</style>
