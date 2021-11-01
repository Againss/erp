/**
 * @Description: 二维码组件
 * @author Roman
 * @date 2020/8/21
*/
<template>
  <div />
</template>
<script>
import QRCode from './qrcode'

export default {
  name: 'CsQrcode',
  props: {
    options: {
      type: Object
    }
  },
  data() {
    return {
      qrcode: null
    }
  },
  computed: {
    width() {
      return this.options.width || 200
    },
    height() {
      return this.options.height || 200
    },
    value() {
      return this.options.value
    }
  },
  watch: {
    value: {
      handler(val, oldVal) {
        this.$nextTick(() => {
          this.qrcode.makeCode(val)
        })
      },
      deep: true,
      immediate: true

    }

  },
  mounted() {
    this.qrcode = new QRCode(this.$el, {
      width: this.width,
      height: this.height
    })
  },
  render: function(h) {
    return h()
  }
}
</script>
