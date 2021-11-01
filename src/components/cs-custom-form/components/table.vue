/**
 * @Description:表格组件
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <el-row :class="tableOptions.tableStyle?tableOptions.tableStyle+' tableSelect':'tableSelect'">
    <el-col :span="tableOptions.span?tableOptions.span[0]:12">
      <el-row v-if="tableOptions.selectTitle"><div class="selectTitle">{{ tableOptions.selectTitle }}</div></el-row>
      <el-row>
        <el-input v-if="tableOptions.needSearch" v-model="inputValue" placeholder="搜索" size="small" style="max-width: 500px; margin-bottom: 10px;" @input="inputChange" />
      </el-row>
      <cs-custom-table
        ref="table"
        v-loading="tableOptions.loading"
        :columns="tableOptions.columns"
        :get-table="tableOptions.getTable"
        :border="tableOptions.border"
        :data-source="tableOptions.dataSource"
        :height="tableOptions.height"
        :row-class-name="tableOptions.rowClassName"
        :max-height="tableOptions.maxHeight"
        :empty-text="tableOptions.emptyText"
        :span-method="tableOptions.spanMethod"
        :header-cell-style="tableOptions.headerCellStyle"
        :header-cell-class-name="tableOptions.headerCellClassName"
        :header-row-style="tableOptions.headerRowStyle"
        :header-row-class-name="tableOptions.headerRowClassName"
        :cell-style="tableOptions.cellStyle"
        :cell-class-name="tableOptions.cellClassName"
        :row-style="tableOptions.rowStyle"
        :current-row-key="tableOptions.currentRowKey"
        :show-header="tableOptions.showHeader||true"
        :fit="tableOptions.fit||true"
        :size="tableOptions.size"
        :stripe="tableOptions.stripe"
        :expand-row-keys="tableOptions.expandRowKeys"
        :default-expand-all="tableOptions.defaultExpandAll"
        :row-key="tableOptions.rowKey"
        :highlight-current-row="tableOptions.highlightCurrentRow"
        :tree-props="tableOptions.treeProps"
        :default-sort="tableOptions.defaultSort"
        :operates="operates"
        :tooltip-effect="tableOptions.tooltipEffect"
        :pagination="pagination"
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
    <el-col v-if="!tableOptions.selectedHidden" :span="tableOptions.span?tableOptions.span[1]:12" class="selected" style="padding-left: 20px">
      <el-row class="selectedRow">
        <el-col class="selectedTitleRow">
          <div v-if="tableOptions.selectedTitle" class="selectedTitle">{{ tableOptions.selectedTitle }}</div>
          <el-button v-if="tableOptions.clearHandler" class="selectedbtn" size="mini" @click="tableOptions.clearHandler">清空</el-button>
        </el-col>
      </el-row>
      <el-row class="selectedRow">
        <el-col v-for="(item,index) in checkedNodes" :key="index" style="position: relative">
          <el-tag class="selectedtag" :closable="!item.disabled" @close="closeHandle(item)">
            <span v-if="tableOptions.checkedTagsRenderContent" v-html="tableOptions.checkedTagsRenderContent(item)" />
            <span v-else :title="checkedTagsRenderContent(item)">{{ checkedTagsRenderContent(item) }}</span>
          </el-tag>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import CsCustomTable from '../../cs-custom-table/table'
export default {
  name: 'TableItemC',
  components: {
    CsCustomTable
  },
  inheritAttrs: false,
  props: {
    operates: {
      type: Object
    },
    options: {
      type: Object,
      default: () => { return {} }
    },
    formDatas: {
      type: Object
    },
    value: {
      type: [Array]
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
      if (this.tableOptions.props) {
        label = this.tableOptions.props.label || 'label'
      }
      return label
    },
    rowKey() {
      return this.tableOptions.rowKey || 'id'
    },
    searchOptions() {
      return this.options.searchOptions || {}
    },
    tableOptions() {
      return this.options.tableOptions || {}
    },
    type() {
      return this.searchOptions.type || {}
    },
    pagination() {
      return this.options.pagination
    }
  },
  watch: {
    value: {
      handler(v) {
        let newValue = v
        if (Object.prototype.toString.call(v) === '[object Array]') {
          newValue = v.filter(v => { if (v) { return true } })
        }
        if (v.length === 1 && Object.prototype.toString.call(v[0]) === '[object Undefined]') {
          this.inputValue = undefined
        }
        this.checkedNodes = newValue
        const labels = []
        const selectedType = this.tableOptions.selectedType || 'object'
        newValue.forEach(v => {
          if (selectedType === 'object') {
            const label = this.label
            labels.push(v[label])
          } else {
            labels.push(v)
          }
        })
        let checkedLabels = ''
        if (this.tableOptions.viewContent) {
          checkedLabels = labels
        } else {
          checkedLabels = this.type === 'textarea' ? labels.join('\n') : labels.join(',')
        }
        this.$emit('setCheckedLabels', checkedLabels)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.table = this.$refs['table']
    this.tableOptions.getTable && this.tableOptions.getTable(this.table)
  },
  methods: {
    inputChange(value) {
      this.searchOptions.inputChange && this.searchOptions.inputChange(value)
    },
    selectionChange(value) {
      this.tableOptions.selectionChange && this.tableOptions.selectionChange(value)
    },
    tableHandle(funKey, row, column, cell, event) {
      this.tableOptions[funKey] && this.tableOptions[funKey](row, column, cell, event)
    },
    checkedTagsRenderContent(item) {
      if (Object.prototype.toString.call(item) === '[object Object]') {
        return item[this.label]
      }
      return item
    },
    closeHandle(item) {
      const val = this.value.filter(v => v[this.rowKey] !== item[this.rowKey])
      this.change(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.tableSelect .selectedtag{white-space:nowrap;text-overflow:ellipsis;overflow: hidden; width: 100%; position: relative}
.tableSelect .selected{padding-left: 20px}
.tableSelect .selectedRow{line-height: 22px;position: relative;margin-bottom: 5px;}
.tableSelect /deep/  .el-tag__close.el-icon-close{position:absolute;right:10px;top:15%}
.tableSelect .selectTitle,.tableSelect .selectedTitle{line-height: 28px;}
.selectedTitleRow {display: flex; justify-content: space-between;}
.selectedbtn { align-self: center;}
</style>
