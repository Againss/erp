<template>
  <!-- <el-radio v-model="checked" @change="componentsOptions.changeMethods(scope)" /> -->
  <div class="radiobox" :class="checked ? 'active' : 'inactive'" @click="componentsOptions.changeMethods(scope)" />
  <!-- <el-checkbox v-model="checked" @change="componentsOptions.changeMethods(scope)" /> -->
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
        return this.scope.row.type === this.componentsOptions.value || (!this.scope.row.type && this.componentsOptions.value === 'N')
      },
      set: function(newValue) {
        console.log(newValue)
      }
    }
  },
  created() {
    // if (!this.scope.row.type) this.scope.row.type = 'N'
    // console.log('------------', this.scope)
  },
  methods: {
    // getScope() {
    //   console.log('scope', this.scope)
    // }
  }
}
</script>

<style lang="scss">
.radiobox {
  width: 15px;
  height: 15px;
  border-radius: 10px;
  cursor: pointer;
  &.active {
    border: 4px solid #409eff;
  }
  &.inactive {
    border: 1px solid #dcdfe6;
  }
}
</style>
