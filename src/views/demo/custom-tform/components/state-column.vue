/**
 * @Description:自定义状态单元格
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <div v-if="editabled">
    <el-form-item :rules="rules" :prop="prop">
      <el-select :value="value" placeholder="请选择" @change="selectChange">
        <el-option
          v-for="item in column.editOptions.dataSource"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
  </div>
  <div v-else>
    <span v-if="scope.row[scope.column.property]==='2'" class="success">成功</span>
    <span v-else class="danger">失败</span>
  </div>
</template>

<script>
export default {
  name: 'StateColumn',
  inheritAttrs: false,
  props: {
    scope: {
      type: Object
    },
    componentsOptions: {
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
    selectChange(value) {
      const obj = { ...this.formDatas[this.scope.$index], [this.scope.column.property]: value }
      this.setFormDatas({ [this.scope.$index]: obj })
    }
  }
}
</script>

<style lang="scss" scoped>
.success{
    border: 1px solid #2ac06d;
    padding: 2px 5px;
    color: #2ac06d;
    border-radius: 5px;
}
.danger{
    border: 1px solid #ff0000;
    padding: 2px 5px;
    color: #ff0000;
    border-radius: 5px;
}
</style>
