<template>
  <div id="process-upload-trigger">
    <div>
      <img src="@/assets/images/process-upload.png" alt="" />
    </div>
    <div style="color: #44494c">请选择导入文件</div>
    <div style="color: #888e9e; margin-top: 5px">仅支持xls、xlsx格式文件</div>
  </div>
</template>
<script>
export default {
  name: "process-upload-trigger",
  data() {
    return {};
  },
};
</script>


<style scoped lang='scss'>
#process-upload-trigger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 300px;
  height: 146px;
  border: 1px dashed #c5d6f6;
  border-radius: 8px;
  font-size: 12px;
  img {
    width: 44px;
    height: 44px;
    display: inline-block;
  }
}
</style>