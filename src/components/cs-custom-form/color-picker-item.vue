/**
 * @Description: 颜色选择器
 * @author Roman
 * @date 2021-04-06 09:50:22
 * @edit 2021-04-06 09:50:22
*/
<template>
  <el-color-picker
    :disabled="options.disabled"
    :size="options.size"
    :value="value"
    :class="options.className"
    :style="options.style"
    :show-alpha="options.showAlpha"
    :color-format="options.colorFormat"
    :popper-class="options.popperClass"
    :predefine="options.predefine"
    @change="pickerChange"
  />
</template>

<script>
export default {
  name: 'ColorPickerItem',
  components: {

  },
  inheritAttrs: false,
  props: {
    options: {
      type: Object
    },
    title: {
      type: String
    },
    formDatas: {
      type: [Object, Array]
    },
    form: {
      type: Object
    },
    setFormDatas: {
      type: Function
    },
    scope: {
      type: Object
    },
    value: {
      type: [String, Number, Array]
    },
    change: {
      type: Function
    }
  },
  data() {
    return {
      defaultWidth: { width: '100%' }
    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    pickerChange(value) {
      this.change(value)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
