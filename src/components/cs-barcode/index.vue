/**
 * @Description: 二维码组件
 * @author Roman
 * @date 2020/8/21
*/
<template>
  <svg />
</template>
<script>
import JsBarcode from 'jsbarcode'

export default {
  name: 'CsBarcode',
  props: {
    options: {
      type: Object,
      default: () => { return {} }
    }
  },
  data() {
    return {
      defaultOptions: {
        // text: "显示文案",
        format: 'CODE128', // 选择要使用的条形码类型
        width: 1.3, // 设置条之间的宽度
        height: 38, // 高度
        displayValue: true, // 是否在条形码下方显示文字
        // text:"456",//覆盖显示的文本
        fontOptions: 'bold', // 使文字加粗体或变斜体
        font: 'OCR-B', // 设置文本的字体
        // textAlign:"left",//设置文本的水平对齐方式
        // textPosition:"top",//设置文本的垂直位置
        textMargin: 2, // 设置条形码和文本之间的间距
        fontSize: 13, // 设置文本的大小
        // background:"#eee",//设置条形码的背景
        // lineColor:"#2196f3",//设置条和文本的颜色。
        margin: 0// 设置条形码周围的空白边距
      }
    }
  },
  computed: {
    value() {
      return this.options.value
    }
  },
  watch: {
    value: {
      handler(val, oldVal) {
        this.$nextTick(() => {
          const options = { ...this.defaultOptions, ...this.options }
          JsBarcode(this.$el, val, options)
        })
      },
      deep: true,
      immediate: true
    }

  },
  mounted() {

  },
  render: function(h) {
    return h()
  }
}
</script>
