<!--
 * @Date: 2021-06-30 11:20:46
 * @Author: Againss
 * @LastEditTime: 2021-07-02 20:07:35
 * @LastEditors: Againss
 * @Descripttion:弹窗复选框组件
-->

<template>
  <el-checkbox v-model="scope.row.checked" :label="scope.row.id" @change="componentsOptions.changeMethods(scope)">{{ }}</el-checkbox>
</template>

<script>
export default {
  props: {
    scope: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    componentsOptions: {
      type: Object
    }
  },
  data() {
    return {
    //   radio
    }
  },
  computed: {
    // radio() {
    //   return this.componentsOptions.radio
    // }
  },
  created() {

  },
  mounted() {
    console.log(this.scope)
  },
  methods: {
    changeMethods(value) {
      console.log(value)
    //   this.radio = value
    }
  }
}
</script>

<style>

</style>
