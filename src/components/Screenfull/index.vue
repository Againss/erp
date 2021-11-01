<template>
  <div>
    <svg-icon class="screenfull-svg" :icon-class="isFullscreen?'exit-fullscreen-z':'fullscreen-z'" @click="click" />
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'Screenfull',
  data() {
    return {
      isFullscreen: false
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on('change', this.change)
      }
    },
    destroy() {
      if (screenfull.enabled) {
        screenfull.off('change', this.change)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.right-menu-item {
  .screenfull-svg {
    display: inline-block;
    cursor: pointer;
    fill: #5a5e66;
    line-height: 1;
    width: 28px;
    height: 28px;
    vertical-align: -0.45em;
  }
}

</style>
