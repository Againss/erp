<!--
 * @Description: 头像
 * @Autor: zhengjin
 * @Date: 2021-07-30 16:41:45
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-08-03 17:00:14
-->

<template>
  <div class="acvite">
    <i class="el-icon-plus avatar-uploader-icon" />
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {

    }
  },
  watch: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.acvite {
  width: 103px;
  height: 103px;
  display: flex;
  justify-items: center;
  align-items: center;
  ::v-deep
  .el-icon-plus {
    font-size: 50px;
    color: #999;
    margin-left: 26px;
  }
}
</style>
