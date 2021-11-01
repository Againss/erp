<!--
 * @Descripttion:附件展示
 * @Author: ll
 * @LastEditors: ll
-->
<template>
  <div class="upload-file">
    <div class="upload-label">
      <span style="color: #ff4949;">*</span>
      <span>批量上传：</span>
    </div>
    <div class="upload-fileName">
      <div v-for="(item,index) in allfileNames" :key="index" class="upload-name">
        <div v-if="item" class="upload-content" style="margin: 10px 0;">
          <span><i style="color: #BBC2D0;" class="el-icon-document" /></span>
          <!-- <span><i style="color: #BBC2D0;" class="el-icon-paperclip" /></span> -->
          <span class="line-upload-text" :title="item">{{ item }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      return (this.formDatas[this.componentsOptions.prop] && this.formDatas[this.componentsOptions.prop].split(',') || [])
    }
  }
}
</script>
<style lang="scss">
.upload-file{
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  .upload-label {
    min-width: 82px;
    display: flex;
    margin-top: 10px;
    margin-left: 14px;
    span {
      font-size: 14px;
      color: #606266;
    }
  }
  .upload-fileName {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .upload-name {
      width: 20%;
      margin-right: 4%;
      display: flex;
      flex-direction: row;
      .upload-content {
        width: 100%;
        display: flex;
        span {
          display: flex;
        }
        .line-upload-text{
          display: inline-block;
          font-size: 14px;
          cursor: pointer;
          color:rgba(9,134,255,0.90);
          margin-left: 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
