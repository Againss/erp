/**
 * @Description:下拉框单元格
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <el-cascader
    :value="selectedValue"
    :options="options.options"
    :props="options.props"
    :size="options.size"
    :placeholder="options.placeholder"
    :disabled="options.disabled"
    :clearable="options.clearable"
    :show-all-levels="options.showAllLevels"
    :collapse-tags="options.collapseTags"
    :separator="options.separator"
    :filterable="options.filterable"
    :filter-method="options.filterMethod"
    :debounce="options.debounce"
    :before-filter="options.beforeFilter"
    :popper-class="options.popperClass"
    @change="selectChange"
    @expandChange="expandChange"
    @blur="blur"
    @focus="focus"
    @visibleChange="visibleChange"
    @removeTag="removeTag"
  />
</template>

<script>

export default {
  name: 'CascaderItem',
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
    value: {
      type: [String, Number, Array]
    },
    change: {
      type: Function
    }
  },
  data() {
    return {
      selectedValue: '',
      defaultWidth: { width: '100%' }
    }
  },
  computed: {
    props() {
      return this.options.props || {}
    },
    getLabel() {
      return this.props.label || 'label'
    },
    getValue() {
      return this.props.value || 'value'
    }
  },
  watch: {
    value: {
      handler(v) {
        let newValue = v
        if (Object.prototype.toString.call(v) === '[object Array]') {
          newValue = v.filter(v => { if (v) { return true } })
        }
        this.selectedValue = newValue
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {

  },
  methods: {
    selectChange(value) {
      this.change(value)
    },
    expandChange(datas) {
      this.options.expandChange && this.options.expandChange(datas)
    },
    blur(event) {
      this.options.blur && this.options.blur(event)
    },
    focus(event) {
      this.options.focus && this.options.focus(event)
    },
    visibleChange(event) {
      this.options.visibleChange && this.options.visibleChange(event)
    },
    removeTag(event) {
      this.options.removeTag && this.options.removeTag(event)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
