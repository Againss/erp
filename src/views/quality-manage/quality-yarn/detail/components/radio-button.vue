<template>
  <el-radio v-model="componentsOptions.radio" :label="componentsOptions.id ? scope.row[componentsOptions.id] : scope.row.id" @change="changeMethods">{{ }}</el-radio>
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

    }
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
