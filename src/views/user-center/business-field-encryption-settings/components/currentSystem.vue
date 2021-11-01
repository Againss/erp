<template>
  <div class="currentSystem">当前系统: <b>{{ componentsOptions.systemName }}</b></div>
</template>

<script>
export default {
  props: {
    componentsOptions: {
      type: Object
    }
  },
  created() {
    // console.log('scope', this.componentsOptions)
  }
}
</script>

<style lang="scss">
.currentSystem {
    position: absolute;
    top: 10px;
}
</style>
