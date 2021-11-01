<template>
  <div class="downloadTemplate">
    <div class="" @click.stop="download">
      <div class="process-download">
        <img src="@/assets/images/process-down.png">
        <div>下载模板</div>
      </div>
    </div>
  </div>
</template>

<script>

import * as api from '../api/index'
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
      const res = await api.mouldDown({ type: this.componentsOptions.orderType })
      this.$utils.downloadStream(res)
    }
  }
}
</script>

<style lang="scss" scoped>
.downloadTemplate {
  display: inline-block;
    .process-download {
    //   cursor: pointer;
      text-align: center;
      width: 300px;
      height: 146px;
      border: 1px dashed #c5d6f6;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      img {
        width: 44px;
        height: 44px;
        display: inline-block;
        margin: 0 auto;
      }
    }
}
</style>
