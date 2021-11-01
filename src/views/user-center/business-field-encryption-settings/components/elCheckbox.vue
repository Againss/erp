<template>
  <el-checkbox v-model="checked" @change="componentsOptions.changeMethods(scope)" />
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
    }
  },
  computed: {
    // checked() {
    //   if (this.scope.row.status === '0') {
    //     return false
    //   }
    // }
    checked: {
      get: function() {
        return this.scope.row.status !== '0'
      },
      set: function(newValue) {
        console.log(newValue)
      }
    }
  },
  created() {
    // console.log('111', this.scope)
  },
  methods: {
    // getScope() {
    //   console.log('scope', this.scope)
    // }
  }
}
</script>

<style>

</style>
