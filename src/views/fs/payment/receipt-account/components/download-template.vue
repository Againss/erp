<template>
  <div class="downloadTemplate">
    <div>
      <i class="el-icon-document icon" />
    </div>
    <el-button size="small" plain class="download" @click="download">下载模板</el-button>
  </div>
</template>

<script>

import { paymentExportIn } from '../api/index.js'
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
      const res = await paymentExportIn()
      this.$utils.downloadStream(res)
    }

  }
}
</script>

<style lang="scss" scoped>
.downloadTemplate {
    text-align: center;

    div {

        .icon {
            font-size: 60px;
            margin: 20px 0;
        }
    }

    .download {
        margin-bottom: 20px;
    }
}
</style>
