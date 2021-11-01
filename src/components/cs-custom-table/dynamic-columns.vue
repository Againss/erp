/**
* @Description:动态单元格入口
* @author Roman
* @date 2020/5/20
*
* @param {Function} setFormDatas 设置表单数据
* @param {Object} formDatas 表单数据
*/
<template>
  <el-table-column
    v-if="isShow(column)"
    :prop="column.prop"
    :label="column.label"
    :align="column.align||'left'"
    :width="column.width"
    :fixed="column.fixed"
    :filters="column.filters"
    :sortable="column.sortable"
    :sort-by="column.sortBy"
    :sort-orders="column.sortOrders"
    :sort-change="column.sortChange"
    :filter-method="column.filterHandler"
    :type="column.type"
    :formatter="column.formatter"
    :resizable="column.resizable"
    :index="column.index"
    :column-key="column.columnKey"
    :header-align="column.headerAlign"
    :class-name="column.className"
    :label-class-name="column.labelClassName"
    :min-width="column.minWidth"
    :filter-multiple="column.filterMultiple"
    :filter-placement="column.filterPlacement"
    :reserve-selection="column.reserveSelection"
    :render-header="column.renderHeader"
    :filtered-value="column.filteredValue"
    :selectable="column.selectable"
    :show-overflow-tooltip="column.showOverflowTooltip"
  >
    <template v-if="column.header" :slot="column.header?'header':''" slot-scope="scope">
      <component :is="column.header" :components-options="column.headerOptions" :scope="scope" :column="column" :edit-type="editType" :form-datas="formDatas" :set-form-datas="setFormDatas" />
    </template>
    <template v-for="(item,i) in column.child">
      <dynamic-columns v-if="item.child&&isShow(item)" :key="i" :edit-type="editType" :column="item" :set-form-datas="setFormDatas" :form-datas="formDatas" />
      <el-table-column
        v-else-if="isShow(item)"
        :key="item.prop+i"
        :prop="item.prop"
        :label="item.label"
        :align="item.align||'left'"
        :width="item.width"
        :fixed="item.fixed"
        :filters="item.filters"
        :sortable="item.sortable"
        :sort-by="item.sortBy"
        :sort-orders="item.sortOrders"
        :sort-change="item.sortChange"
        :filter-method="item.filterHandler"
        :type="item.type"
        :formatter="item.formatter"
        :resizable="item.resizable"
        :index="item.index"
        :column-key="item.columnKey"
        :header-align="item.headerAlign"
        :class-name="item.className"
        :label-class-name="item.labelClassName"
        :min-width="item.minWidth"
        :filter-multiple="item.filterMultiple"
        :filter-placement="item.filterPlacement"
        :reserve-selection="item.reserveSelection"
        :render-header="item.renderHeader"
        :filtered-value="item.filteredValue"
        :selectable="item.selectable"
        :show-overflow-tooltip="item.showOverflowTooltip"
      >
        <template v-if="item.header" :slot="item.header?'header':''" slot-scope="scope">
          <component :is="item.header" :components-options="item.headerOptions" :scope="scope" :column="item" :edit-type="editType" :form-datas="formDatas" :set-form-datas="setFormDatas" />
        </template>
        <template slot-scope="scope">
          <template v-if="item.components">
            <component :is="component" v-for="(component, key) in item.components" :key="key" :components-options="item.componentsOptions" :scope="scope" :value="getValue(scope)" :column="item" :edit-type="editType" :set-form-datas="setFormDatas" :form-datas="formDatas" />
          </template>
          <template v-else>
            <default-column :scope="scope" :value="getValue(scope)" :column="item" :edit-type="editType" :set-form-datas="setFormDatas" :form-datas="formDatas" />
          </template>
        </template>
      </el-table-column>
    </template>

  </el-table-column>
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
    column: {
      type: Object
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
    isShow(item) {
      if (Object.prototype.toString.call(item.isShow) !== '[object Undefined]') {
        if (Object.prototype.toString.call(item.isShow) === '[object Function]') {
          return item.isShow(item)
        } else {
          return item.isShow
        }
      }
      return true
    },
    getValue(scope) {
      return this.formDatas[scope.$index] ? this.formDatas[scope.$index][scope.column.property] : undefined
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
