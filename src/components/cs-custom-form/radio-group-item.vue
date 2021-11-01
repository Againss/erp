/**
 * @Description:单选框单元格
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <el-radio-group :value="value" :size="options.size" :text-color="options.textColor" :fill="options.fill" :disabled="options.disabled" @input="radioChange">
    <el-radio
      v-for="(item,index) in options.dataSource"
      :key="index"
      :label="item.value"
      :disabled="item.disabled"
      :border="item.border"
      :size="item.size"
      :style="options.style"
    >{{ item.label }}</el-radio>
  </el-radio-group>
</template>

<script>
export default {
  name: 'RadioGroupItem',
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
      type: [String, Number, Boolean]
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
