/**
 * @Description: DEMO
 * @author Roman
 * @date 2020/6/18
*/
<template>
  <span class="upload-slot-trigger">
    <span style="display: flex; align-items: center; color: #0986FF;">点击上传</span>
    <!-- <el-button slot="trigger" size="small" plain>选取文件</el-button> -->
  </span>
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
