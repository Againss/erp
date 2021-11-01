/**
 * @Description: DEMO
 * @author Roman
 * @date 2020/6/18
*/
<template>
  <div class="upload-slot-trigger">
    <div>
      <i class="el-icon-document-checked icon" />
    </div>
    <el-button slot="trigger" size="small" plain>选取文件</el-button>
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
            font-size: 60px;
            margin: 20px 0;
        }
    }
}
</style>
<style lang="scss">
.upload-demo {
  text-align: center;
}
</style>
