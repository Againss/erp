<template>
  <div :style="{ width: componentsOptions.itemWidth || '' }">
    <el-switch
      v-if="getStatus === '1' || getStatus === '0'"
      v-model="getStatus"
      active-color="#0986FF"
      active-value="1"
      :disabled="getDisabled"
      inactive-value="0"
      inactive-color="#D0D8E0"
      @change="changeHandel"
    />
  </div>
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
  methods: {
    changeHandel () {
      this.componentsOptions.changeHandel(this.scope)
    }
  },
  computed: {
    getDisabled(){
      if(this.componentsOptions.permission){
         return !this.$permission([this.componentsOptions.permission])
      }else{
        return false
      }
    },
    disabled () {
      const disabled = this.componentsOptions.disabled
      if (typeof disabled === 'function') {
        return disabled(this.scope)
      }
      return false
    },
    getStatus: {
      get () {
        const formatter = this.componentsOptions.formatter
        if (formatter && typeof formatter === 'function') {
          return formatter(this.scope)
        }
        return '0'
      },
      set (value) {
        this.status = value
      }
      /*  const status = this.scope.row.status;
       if (status === 1) {
         return true
       }
       return false */
    }
  }
}
</script>
