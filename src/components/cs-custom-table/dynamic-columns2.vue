/**
 * @Description:
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <div>
    <template v-for="(column,index) in columns">
      <dynamic-columns v-if="column.child" :key="index" :columns="column.child" :set-form-datas="setFormDatas" :form-datas="formDatas" />
      <el-table-column
        v-else
        :key="index"
        :prop="column.prop"
        :label="column.label"
        :align="column.align||'center'"
        :width="column.width"
        :fixed="column.fixed"
        :filters="column.filters"
        :sortable="column.sortable"
        :sort-by="column.sortBy"
        :sort-orders="column.sortOrders"
        :sort-change="column.sortChange"
        :filter-method="column.filterHandler"
      >
        <template slot-scope="scope">
          <template v-if="column.components">
            <component :is="component" v-for="(component, key) in column.components" :key="key" :scope="scope" :value="getValue(scope)" :column="column" :edit-type="editType" :set-form-datas="setFormDatas" :form-datas="formDatas" />
          </template>
          <template v-else>
            <default-column :scope="scope" :value="getValue(scope)" :column="column" :edit-type="editType" :set-form-datas="setFormDatas" :form-datas="formDatas" />
          </template>
        </template>
      </el-table-column>
    </template>
  </div>
</template>

<script>
import defaultColumn from './columns/default-column'

export default {
  name: 'DynamicColumns',
  components: {
    defaultColumn
  },
  inheritAttrs: false,
  props: {
    columns: {
      type: Array
    },
    editType: {
      type: String,
      default: 'inline'
    },
    setFormDatas: {
      type: Function
    },
    formDatas: {
      type: Object
    }
  },
  data() {
    return {
    }
  },
  mounted() {

  },
  methods: {
    getValue(scope) {
      return this.formDatas[scope.$index] ? this.formDatas[scope.$index][scope.column.property] : undefined
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
