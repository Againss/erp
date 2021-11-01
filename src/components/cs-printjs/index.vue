/**
* @Description: 公共打印组件
* @author Roman
* @date 2020/9/15
 调用示例:
***
printJS({
printable: 'test',//dom的id
type: 'html'
})
printJS({
printable: `<h1>Print.js Raw HTML Print Test</h1>
<p class="blueText">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
<p>sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`,
type: 'raw-html',
style: '.blueText {color:blue;}'
})
其他调用请参考printjs.html
***
*/
<template>
  <div style="position: relative">
    <div ref="content">
      <slot />
    </div>
  </div>
</template>

<script>
import printJS from 'print-js'

export default {
  name: 'CsPrintjs',
  inheritAttrs: false,
  props: {
    options: {
      type: Object
    },
    print: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data() {
    return {

    }
  },

  computed: {
  },
  watch: {
    print: {
      handler(newData, oldData) {
        if (newData) {
          this.$emit('update:print', false)
          if (this.options && Object.keys(this.options).length) {
            printJS(this.options)
          } else {
            printJS({ printable: this.$refs.content, type: 'html' })
          }
        }
      }
    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>
