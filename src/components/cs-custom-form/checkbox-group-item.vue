/**
 * @Description:单选框单元格
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <el-checkbox-group
    :value="value"
    :style="options.style"
    :class="options.className"
    :size="options.size"
    :disabled="options.disabled"
    :text-color="options.textColor"
    :min="options.min"
    :max="options.max"
    :fill="options.fill"
    @input="checkboxGroupChange"
  >
    <el-checkbox
      v-for="(item,index) in options.dataSource"
      :key="index"
      :style="options.style"
      :label="item.value"
      :border="item.border"
      :size="item.size"
      :disabled="item.disabled"
      :true-label="item.trueLabel"
      :false-label="item.falseLabel"
      :checked="item.checked"
      :indeterminate="item.indeterminate"
    >{{ item.label }}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
export default {
  name: 'CheckboxGroupItem',
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
      type: Array,
      default: () => []
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
    checkboxGroupChange(value) {
      this.change(value)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
