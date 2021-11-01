<template>
  <div>
    <div class="style" @click="handleClick()">查看详情</div>
  </div>
</template>

<script>
export default {
  props: {
    componentsOptions: {
      type: Object
    }
  },
  methods: {
    handleClick() {
      this.componentsOptions.click()
    }
  }
}
</script>

<style lang="scss" scoped>
  .style {
    line-height: 40px;
    color: #1890ff;
    cursor: pointer;
  }
</style>
