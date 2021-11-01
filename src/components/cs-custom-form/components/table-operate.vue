/**
* @Description:表格组件操作列
* @author Roman
* @date 2020/5/20
*/
<template>
  <el-checkbox :value="value" @change="change" />
</template>

<script>
export default {
  name: 'TableOperate',
  inheritAttrs: false,
  props: {
    dataSource: {
      type: Array
    },
    scope: {
      type: Object
    },
    componentsOptions: {
      type: Object
    },
    form: {
      type: Object
    },
    editType: {
      type: String
    },
    formDatas: {
      type: Object
    },
    setFormDatas: {
      type: Function
    }
  },
  data() {
    return {
      value: false
    }
  },
  computed: {
    // checked(){
    //   return this.scope.row.checked
    // }
  },
  watch: {
    componentsOptions: {
      handler(v) {
        let isflag = false
        const key = this.componentsOptions.id
        for (let i = 0; i < v.value.length; i++) {
          const id = Object.prototype.toString.call(v.value[i]) === '[object Object]' ? v.value[i][key] : v.value[i]
          if (id === this.scope.row[key]) {
            isflag = true
            break
          }
        }
        this.value = isflag
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {

  },
  methods: {
    change(item) {
      // console.log(item, this.scope, this.componentsOptions, this.setFormDatas, this.formDatas, this.editType)
      this.componentsOptions.handle && this.componentsOptions.handle(item, this.scope)
    }
  }
}
</script>

<style lang="scss" scoped>
    span{
        color: rgb(24, 144, 255);
        cursor: pointer;
    }

</style>
