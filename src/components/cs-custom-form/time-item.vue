/**
 * @Description:时间单元格
 * @author Roman
 * @date 2020/5/20
*/
<template>

  <el-time-select
    :style="options.style||'width:100%'"
    :class="options.className"
    :value="value"
    :placeholder="options.placeholder"
    :editable="options.editable||false"
    :disabled="options.disabled"
    :value-format="options.valueFormat"
    :type="options.type"
    :clearable="options.clearable"
    :size="options.size"
    :start-placeholder="options.startPlaceholder"
    :end-placeholder="options.endPlaceholder"
    :align="options.align"
    :is-range="options.isRange"
    :arrow-control="options.arrowControl"
    :popper-class="options.popperClass"
    :range-separator="options.rangeSeparator"
    :prefix-icon="options.prefixIcon"
    :clear-icon="options.clearIcon"
    :default-value="options.defaultValue"
    :readonly="options.readonly"
    :picker-options="options.pickerOptions"
    @input="dateChange"
  />

</template>

<script>

export default {
  name: 'DateItem',
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
      type: [String, Array]
    },
    change: {
      type: Function
    }
  },
  data() {
    return {

    }
  },
  watch: {

  },
  mounted() {

  },
  methods: {

    dateChange(value) {
      this.change(value)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
