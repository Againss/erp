/**
 * @Description: 公共打印组件
 * @author Roman
 * @date 2020/9/15
*/
<template>
  <div>
    <p style="text-align: center">{{ componentsOptions.text }}</p>
  </div>
</template>

<script>

export default {
  name: 'CsPrint',
  components: {

  },
  inheritAttrs: false,
  props: {
    componentsOptions: {
      type: Object,
      required: true
    }
  },
  data() {
    return {

    }
  },

  computed: {
  },
  watch: {

  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>
