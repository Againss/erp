<template>
  <div slot="footer" class="dialog-footer">
    <el-button @click="backToList">返回</el-button>
    <!--   <el-button type="primary">确 定</el-button> -->
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    backToList() {
      window.location.href = ''
    }
  }
}
</script>
