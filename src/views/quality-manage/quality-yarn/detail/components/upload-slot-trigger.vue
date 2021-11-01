/**
 * @Description: DEMO
 * @author Roman
 * @date 2020/6/18
*/
<template>
  <span class="upload-slot-trigger">
    <!-- <span style="display: flex; align-items: center; color: #0986FF;">点击上传</span> -->
    <!-- <el-button slot="trigger" type="primary" size="small" plain>点击上传</el-button> -->
    <el-button type="primary" size="small">点击上传</el-button>
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
  methods: {

  }
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
