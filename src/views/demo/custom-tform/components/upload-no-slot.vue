/**
 * @Description: DEMO
 * @author Roman
 * @date 2020/6/18
*/
<template>
  <el-button style="margin-left: 10px;" size="small" type="success" @click="submit">上传到服务器</el-button>
</template>

<script>
export default {
  components: {},
  props: {
    upload: {
      type: Object
    }
  },
  data() {
    return {}
  },
  mounted() {
  },
  methods: {
    submit() {
      this.$emit('submit')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
