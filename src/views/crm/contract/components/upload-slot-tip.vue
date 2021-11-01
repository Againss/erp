/**
 * @Description: DEMO
 * @author Roman
 * @date 2020/6/18
*/
<template>
  <div slot="tip" class="el-upload__tip">只能上传 pdf/word/excel/ppt文件，且不超过 10M，每次最多上传1个文件</div>
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
.el-upload__tip {
  margin: 0 0 0 10px;
}
</style>
