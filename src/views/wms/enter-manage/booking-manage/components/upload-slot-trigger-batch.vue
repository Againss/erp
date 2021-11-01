<template>
  <div class="upload-slot-trigger-batch">
    <div class="">
      <div class="process-download">
        <img src="@/assets/images/process-upload.png">
        <div class="batch-div">请选择导入文件</div>
        <div class="batch-xls">仅支持xls、xlsx格式文件</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.upload-slot-trigger-batch {
  .process-download {
  text-align: center;
  width: 300px;
  height: 146px;
  border: 1px dashed #c5d6f6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  line-height: 15px;
  img {
    width: 44px;
    height: 44px;
    display: inline-block;
    margin: 0 auto;
    line-height: 1px;
  }
  div {
    font-size: 12px;
  }
  .batch-div {
    color: #474747;
  }
  .batch-xls {
    margin-top: 2px;
    color: #888e9e;
  }
}
}
</style>
