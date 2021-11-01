<template>
  <!-- <el-checkbox v-model="checked" @change="componentsOptions.changeMethods(scope)" /> -->
  <el-radio v-model="componentsOptions.radio" :label="componentsOptions.id ? scope.row[componentsOptions.id] : scope.row.id" @change="changeMethods">{{ }}</el-radio>
  <!-- <el-checkbox v-model="scope.row.encryption" /> -->
</template>

<script>
export default {
  props: {
    scope: {
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
      return this.componentsOptions.changeMethods && this.componentsOptions.changeMethods(value, this.scope)
    }
  }
}
</script>

<style>

</style>
