/**
 * @Description:自定义鼠标经过提示框单元格
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <div v-if="editabled">
    <el-form-item :rules="rules" :prop="prop">
      <el-input :value="value" @input="inputChange" />
    </el-form-item>
  </div>
  <div v-else>
    <el-popover
      placement="top"
      width="200"
      trigger="hover"
    >
      <div>{{ scope.row[scope.column.property] }}</div>
      <span slot="reference" style=" white-space: nowrap;text-overflow:ellipsis;">{{ scope.row[scope.column.property] }}</span>
    </el-popover>
  </div>

</template>

<script>
export default {
  name: 'PopoverColumn',
  inheritAttrs: false,
  props: {
    scope: {
      type: Object
    },
    editType: {
      type: String
    },
    column: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    setFormDatas: {
      type: Function
    },
    value: {
      type: String
    }
  },
  data() {
    return {

    }
  },
  computed: {
    editabled() {
      return this.scope.row.edit && this.editType === 'inline'
    },
    rules() {
      return this.column.editOptions.rules
    },
    prop() {
      return [this.scope.$index] + '.' + [this.scope.column.property]
    }
  },
  watch: {

  },
  mounted() {

  },
  methods: {
    inputChange(value) {
      const obj = { ...this.formDatas[this.scope.$index], [this.scope.column.property]: value }
      this.setFormDatas({ [this.scope.$index]: obj })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
