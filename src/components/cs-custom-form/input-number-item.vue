/**
 * @Description:数字输入框单元格
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <el-input-number
    :value="value"
    :class="options.className"
    :style="options.style"
    :suffix-icon="options.suffixIcon"
    :readonly="options.readonly"
    :disabled="options.disabled"
    :clearable="options.clearable"
    :placeholder="options.placeholder"
    :min="options.min"
    :max="options.max"
    :step="options.step"
    :step-strictly="options.stepStrictly"
    :precision="options.precision"
    @change="inputNumberChange"
  />
</template>

<script>
export default {
  name: 'InputNumberItem',
  components: {

  },
  inheritAttrs: false,
  props: {
    options: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    value: {
      type: Number
    },
    change: {
      type: Function
    }
  },
  data() {
    return {

    }
  },
  computed: {
    label() {
      return this.options.label
    },
    prop() {
      return this.options.prop
    },
    rules() {
      return this.options.rules
    }
  },
  watch: {
  },
  mounted() {

  },
  methods: {
    inputNumberChange(value) {
      this.change(value)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
