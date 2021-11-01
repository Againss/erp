/**
 * @Description:时间单元格
 * @author Roman
 * @date 2020/5/20
*/
<template>

  <el-date-picker
    :style="options.style||{width:'100%'}"
    :value="value"
    :placeholder="options.placeholder"
    :format="options.format||'yyyy-MM-dd'"
    :editable="options.editable||false"
    :value-format="options.valueFormat||'yyyy-MM-dd'"
    :disabled="options.disabled"
    :type="options.type"
    :clearable="options.clearable"
    :size="options.size"
    :start-placeholder="options.startPlaceholder"
    :end-placeholder="options.endPlaceholder"
    :align="options.align"
    :popper-class="options.popperClass"
    :range-separator="options.rangeSeparator"
    :default-time="options.defaultTime"
    :unlink-panels="options.unlinkPanels"
    :prefix-icon="options.prefixIcon"
    :clear-icon="options.clearIcon"
    :validate-event="options.validateEvent"
    :default-value="options.defaultValue"
    :readonly="options.readonly"
    :picker-options="options.pickerOptions"
    @input="dateChange"
    @focus="focus"
    @blur="blur"
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
      type: [Object, Array]
    },
    value: {
      type: [String, Array, Number]
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
    },
    focus(dateObj) {
      this.options.focus && this.options.focus(dateObj)
    },
    blur(dateObj) {
      this.options.blur && this.options.blur(dateObj)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
