/**
 * @Description:展示单元格
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <div :style="options.style" :class="options.className" @click="handle">{{ options.text }}</div>
</template>

<script>
export default {
  name: 'ViewItem',
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
    form: {
      type: Object
    },
    setFormDatas: {
      type: Function
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
    handle() {
      this.options.handle && this.options.handle(this.form, this.formDatas, this.setFormDatas)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
