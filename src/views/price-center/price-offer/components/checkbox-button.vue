<template>
  <el-checkbox v-model="scope.row.checked" :label="scope.row.id" @change="componentsOptions.changeMethods(scope, formDatas)">{{ }}</el-checkbox>
  <!-- <el-radio v-model="componentsOptions.radio" :label="scope.row.customerRequireId" @change="componentsOptions.changeMethods">{{ }}</el-radio> -->
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
