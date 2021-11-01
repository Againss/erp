/**
 * @Description:单选框单元格
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <el-radio-group :value="value" :size="options.size" :text-color="options.textColor" :disabled="options.disabled" :fill="options.fill" @input="radioChange">
    <el-radio-button
      v-for="(item,index) in options.dataSource"
      :key="index"
      :label="item.value"
      :disabled="item.disabled"
      :border="item.border"
      :size="item.size"
    >{{ item.label }}</el-radio-button>
  </el-radio-group>
</template>

<script>
export default {
  name: 'RadioButtonGroupItem',
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
      type: [String, Number]
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
    radioChange(value) {
      this.change(value)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
