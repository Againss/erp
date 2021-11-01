/**
* @Description:table单元格
* @author Roman
* @date 2020/5/20
*/
<template>
  <el-row :class="options.tableStyle?options.tableStyle+' tableSelect':'tableSelect'">
    <el-col :span="options.span?options.span[0]:24">
      <el-row v-if="options.selectTitle"><div class="selectTitle">{{ options.selectTitle }}</div></el-row>
      <el-row>
        <el-input v-if="options.needSearch" v-model="inputValue" placeholder="搜索" style="max-width: 500px" />
      </el-row>
      <cs-custom-table
        ref="table"
        v-loading="options.loading"
        :columns="options.columns"
        :get-table="options.getTable"
        :border="options.border"
        :data-source="options.dataSource"
        :height="options.height"
        :row-class-name="options.rowClassName"
        :max-height="options.maxHeight"
        :empty-text="options.emptyText"
        :span-method="options.spanMethod"
        :header-cell-style="options.headerCellStyle"
        :header-cell-class-name="options.headerCellClassName"
        :header-row-style="options.headerRowStyle"
        :header-row-class-name="options.headerRowClassName"
        :cell-style="options.cellStyle"
        :cell-class-name="options.cellClassName"
        :row-style="options.rowStyle"
        :current-row-key="options.currentRowKey"
        :show-header="options.showHeader||true"
        :fit="options.fit||true"
        :size="options.size"
        :stripe="options.stripe"
        :show-summary="options.showSummary"
        :summary-method="options.summaryMethod"
        :sum-text="options.sumText"
        :expand-row-keys="options.expandRowKeys"
        :default-expand-all="options.defaultExpandAll"
        :row-key="options.rowKey"
        :highlight-current-row="options.highlightCurrentRow"
        :tree-props="options.treeProps"
        :pagination="pagination"
        :default-sort="options.defaultSort"
        :tooltip-effect="options.tooltipEffect"
        @selection-change="(selection)=>tableHandle('selectionChange',selection)"
        @select="(selection)=>tableHandle('select',selection)"
        @select-all="(selection)=>tableHandle('selectAll',selection)"
        @cell-mouse-leave="(row, column, cell, event)=>tableHandle('cellMouseLeave',row, column, cell, event)"
        @cell-mouse-enter="(row, column, cell, event)=>tableHandle('cellMouseEnter',row, column, cell, event)"
        @cell-click="(row, column, cell, event)=>tableHandle('cellClick',row, column, cell, event)"
        @cell-dblclick="(row, column, cell, event)=>tableHandle('cellDblclick',row, column, cell, event)"
        @row-click="(row, column, event)=>tableHandle('rowClick',row, column, event)"
        @row-contextmenu="(row, column, event)=>tableHandle('rowContextmenu',row, column, event)"
        @row-dblclick="(row, column, event)=>tableHandle('rowDblclick',row, column, event)"
        @header-click="(column, event)=>tableHandle('headerClick',column, event)"
        @header-contextmenu="(column, event)=>tableHandle('headerContextmenu',column, event)"
        @sort-change="({ column, prop, order })=>tableHandle('sortChange',{ column, prop, order })"
        @filter-change="(filters)=>tableHandle('filterChange',filters)"
        @current-change="(currentRow, oldCurrentRow)=>tableHandle('currentChange',currentRow, oldCurrentRow)"
        @header-dragend="(newWidth, oldWidth, column, event)=>tableHandle('headerDragend',newWidth, oldWidth, column, event)"
        @expand-change="(row, expanded)=>tableHandle('expandChange',row, expanded)"
      />
    </el-col>
    <el-col v-if="!options.selectedHidden" :span="options.span?options.span[0]:0" class="selected" style="padding-left: 20px">
      <el-row v-if="options.selectedTitle"><div class="selectedTitle">{{ options.selectedTitle }}</div></el-row>
      <el-row class="selectedRow">
        <el-col v-for="(item,index) in checkedNodes" :key="index">
          <el-tag class="selectedtag" :closable="!item.disabled" @close="closeHandle(item)">
            <span v-if="options.checkedTagsRenderContent" v-html="options.checkedTagsRenderContent(item)" />
            <span v-else :title="checkedTagsRenderContent(item)">{{ checkedTagsRenderContent(item) }}</span>
          </el-tag>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import CsCustomTable from '../cs-custom-table/table'
export default {
  name: 'TableItem',
  components: {
    CsCustomTable
  },
  inheritAttrs: false,
  props: {
    options: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    value: {
      type: [String]
    },
    change: {
      type: Function
    }
  },
  data() {
    return {
      checkedNodes: [],
      inputValue: '',
      table: null
    }
  },
  computed: {
    label() {
      let label = 'label'
      if (this.options.props) {
        label = this.options.props.label || 'label'
      }
      return label
    },
    pagination() {
      return this.options.pagination
    }
  },
  mounted() {
    this.table = this.$refs['table']
    this.options.getTable && this.options.getTable(this.table)
  },
  methods: {
    selectionChange(value) {
      this.options.selectionChange && this.options.selectionChange(value)
    },
    tableHandle(funKey, row, column, cell, event) {
      this.options[funKey] && this.options[funKey](row, column, cell, event)
    },
    checkedTagsRenderContent(item) {
      return item[this.label]
    },
    closeHandle(item) {
      // this.change(item)
    }
  }
}
</script>

<style lang="scss" scoped>
    .tableSelect .selectedtag{white-space:nowrap;text-overflow:ellipsis;overflow: hidden;}
    .tableSelect .selected{padding-left: 20px}
    .tableSelect .selectedRow{line-height: 22px}
    .tableSelect .selectedTitle{padding: 10px 0; font-weight: bold}
</style>
