/**
 * @Description:自定义数字输入框单元格
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <el-form-item :rules="rules" :prop="prop" :label="label">
    <el-input-number
      :value="value"
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
      @change="change"
    />
  </el-form-item>
</template>

<script>
export default {
  name: 'InputNumberItem',
  components: {

  },
  props: {
    options: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    setFormDatas: {
      type: Function
    },
    value: {
      type: Number
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
    change(value) {
      this.setFormDatas({ [this.prop]: value })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
