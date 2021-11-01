<template>
  <div class="downloadTemplate">
    <el-button size="small" plain class="download" icon="el-icon-download download-icon" @click="download">下载模板</el-button>
  </div>
</template>

<script>

export default {
  data() {
    return {
      excelFlag: true
    }
  },
  methods: {
    download() {
      location.href = `${process.env.VUE_APP_BASE_API}/srm/supplierPerformance/download/excel/template`
    }
  }
}
</script>

<style lang="scss" scoped>
.downloadTemplate {
    margin-top: 18px;
    // margin-left: 66px;
    display: flex;
    justify-content: center;
    align-items: center;
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
