/**
 * @Description: DEMO
 * @author Roman
 * @date 2020/6/18
*/
<template>
  <div class="upload-slot-trigger">
    <div style="display: flex; align-items: center; color: #0986FF;">
      <i class="el-icon-circle-plus-outline icon" /> 添加文件
    </div>
    <!-- <el-button slot="trigger" size="small" plain>选取文件</el-button> -->
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  },
  mounted() {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.upload-slot-trigger {
    div {
        .icon {
            font-size: 18px;
            margin: 0 10px;
            // margin: 5px 0;
        }
    }
}
</style>
<style lang="scss">
.upload-demo {
  // text-align: center;
}
</style>
