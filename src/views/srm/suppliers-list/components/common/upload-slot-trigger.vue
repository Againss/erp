<template>
  <div class="upload-slot-trigger">
    <el-button slot="trigger" class="upload" size="small" icon="el-icon-upload2 upload-icon" plain>选取文件</el-button>
  </div>
</template>

<style lang="scss" scoped>
.upload-slot-trigger {
  .upload {
    border-color: #1682e6;
    color: #1682e6;
    display: flex;
    align-items: center;
  }
}
</style>
<style lang="scss">
.upload-demo {
  margin-left: 66px;
  margin-top: 18px;
}
.upload-icon {
  font-size: 18px;
  line-height: 0;
}
</style>
