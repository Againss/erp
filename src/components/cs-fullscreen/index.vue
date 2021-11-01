/**
* @Description: 指定元素全屏
* @author Roman
* @date 2021-02-25 09:27:11
* @edit 2021-02-25 09:27:11
*/
<template>
  <span @click="fullScreen">
    <slot />
  </span>
</template>

<script>

export default {
  name: 'CsFullscreen',
  components: {

  },
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    isFull: {
      type: Boolean
    }
  },
  data() {
    return {
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    fullScreen() {
      const el = this.options.element
      el && this.$utils.fullScreen(el)
    },
    init() {
      document.addEventListener('fullscreenchange', this.change)
      document.addEventListener('webkitfullscreenchange', this.change)
      document.addEventListener('mozfullscreenchange', this.change)
      document.addEventListener('MSFullscreenChange', this.change)
    },
    change() {
      if (document.fullscreenElement) {
        this.$emit('update:isFull', true)
      } else {
        this.$emit('update:isFull', false)
      }
    },
    destroy() {
      document.removeEventListener('fullscreenchange', this.change)
      document.removeEventListener('webkitfullscreenchange', this.change)
      document.removeEventListener('mozfullscreenchange', this.change)
      document.removeEventListener('MSFullscreenChange', this.change)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
