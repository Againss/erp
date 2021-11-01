<template>
  <div :style="componentsOptions.style">{{ componentsOptions.text }}</div>
</template>

<script>
export default {
  props: {
    componentsOptions: {
      type: Object
    }
  },
  mounted() {
    console.log('111', this.componentsOptions)
  }
}
</script>

<style lang="scss" scoped>
</style>
