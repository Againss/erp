<template>
  <el-row style="width: 50%; margin-right: 0px;">
    <el-col>
      <el-form-item :prop="componentsOptions.prop" :label="componentsOptions.label">
          <div style="display: flex;">
            <div class="lineJumpOneLine"><span class="lineJumpText" @click="lineJumpClick" :title="propValue">{{propValue}}</span></div>
            <span v-if="propValue" class="lineJumpText" @click="lineJumpClick"> <i class="el-icon-download"></i> 下载</span>
          </div>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script>
import { attachmentDownload } from '@/views/crm/public/api/index.js'
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
        },
    },
    methods: {
        async lineJumpClick() {
            // console.log(this.componentsOptions)
            const res = await attachmentDownload({bizType:this.componentsOptions.bizType, url: this.componentsOptions.url})
            console.log(res)
            this.$utils.downloadStream(res)
            // this.$router.push(this.componentsOptions.url)
        }
    },
}
</script>

<style lang='scss'>
.lineJumpOneLine {
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    max-width: 200px;
}
.lineJumpText {
    padding-left: 8px;
    cursor: pointer;
    color: #1890ff;
    // max-width: 300px;
}
</style>