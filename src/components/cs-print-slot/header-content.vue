<template>
  <div slot="header" class="print-header-content" style="width: 208mm">
    <img src="@/assets/images/logo.png" class="img-logo">
    <div class="wrap-title">
      <span class="title">佛山市智布互联纺织有限公司</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.print-header-content {
  display: flex;
  align-items: center;
  height: 55px;
  padding: 0 8mm;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 2mm;
  .img-logo {
    width: 26px;
    height: 26px;
  }
  .wrap-title {
    margin-left: 15px;
    flex: 1;
    .title {
      color: #151222;
      font-size: 14px;
      font-weight: 400;
    }
  }
}
</style>
