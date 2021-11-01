<template>
  <el-radio v-model="componentsOptions.radio" :label="scope.row.id||scope.row[componentsOptions.id]" @change="changeMethods">{{ }}</el-radio>
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
      console.log(value, this.scope)
      this.componentsOptions.radioData = this.scope.row
    //   this.radio = value
    }
  }
}
</script>

<style>

</style>
