/**
 * @Description:切换单元格
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <el-switch
    :value="value"
    :class="options.className"
    :width="options.width"
    :style="options.style"
    :active-icon-class="options.activeIconClass"
    :inactive-icon-class="options.inactiveIconClass"
    :active-text="options.activeText"
    :inactive-text="options.inactiveText"
    :active-value="options.activeValue"
    :inactive-value="options.inactiveValue"
    :active-color="options.activeColor"
    :inactive-color="options.inactiveColor"
    :validate-event="options.validateEvent"
    @change="switchChange"
  />
</template>

<script>
export default {
  name: 'SwitchItem',
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
      type: [Boolean, String, Number]
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
    switchChange(value) {
      this.change(value)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
