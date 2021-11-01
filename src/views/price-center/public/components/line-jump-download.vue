<template>
  <el-row style="width: 50%; margin-right: 0px;">
    <el-col>
      <el-form-item :prop="componentsOptions.prop" :label="componentsOptions.label">
        <div style="display: flex;">
          <div class="lineJumpOneLine"><span class="lineJumpText" :title="propValue" @click="lineJumpClick">{{ propValue }}</span></div>
          <span v-if="propValue" class="lineJumpText" style="padding-left: 30px;" @click="lineJumpClick"> <svg-icon class="screenfull-svg" icon-class="download" /> 下载</span>
        </div>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script>
import { attachmentDownload } from '@/views/price-center/public/api/index.js'
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
    propValue() {
      // console.log(this.formDatas, this.componentsOptions)
      return this.formDatas[this.componentsOptions.prop]
    }
  },
  methods: {
    async lineJumpClick() {
      // console.log(this.componentsOptions)
      const res = await attachmentDownload({ bizType: this.componentsOptions.bizType, url: this.componentsOptions.url })
      console.log(res)
      if (res.status !== 200) {
        return false
      }
      this.$message.success('附件下载成功')
      this.$utils.downloadStream(res)
      // this.$router.push(this.componentsOptions.url)
    }
  }
}
</script>

<style lang='scss'>
.lineJumpOneLine {
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    max-width: 180px;
}
.lineJumpText {
    padding-left: 8px;
    cursor: pointer;
    color: #1890ff;
}
</style>
