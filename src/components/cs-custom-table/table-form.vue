/**
* @Description:自定义表格入口
* @author Roman
* @date 2020/5/20
* @edit 2020-12-23 11:11:25
*
* @param {Boolean} loading 加载中 true|false
* @param {Array} dataSource 后台返回数据源列表
* @param {Object} operates 操作方法类
* @param {Object} pagination 分页对象属性 参考elementUI官网pagination配置属性
* @param {String} editType inline行内编辑|pop弹窗编辑
*/
<template>
  <el-form-item
    :style="options.itemStyle"
    :rules="options.rules"
    prop="_privateTableForm"
    :label="options.label"
    :label-width="getLabelWidth"
    :required="options.required"
    :error="options.error"
    :show-message="options.showMessage"
    :inline-message="options.inlineMessage"
    :size="options.size"
  >
    <div class="table" @mouseenter="tableMouseenter" @mouseleave="tableMouseleave">
      <el-table
        ref="table"
        v-loading="options.loading"
        :border="options.border"
        :data="dataList"
        :class="options.className"
        :load="options.load||lazyLoad"
        :height="options.height"
        :row-class-name="options.rowClassName"
        :max-height="options.maxHeight"
        :empty-text="options.emptyText"
        :span-method="options.spanMethod"
        :indent="options.indent"
        :select-on-indeterminate="options.selectOnIndeterminate"
        :header-cell-style="options.headerCellStyle"
        :header-cell-class-name="options.headerCellClassName"
        :header-row-style="options.headerRowStyle"
        :header-row-class-name="options.headerRowClassName"
        :cell-style="options.cellStyle"
        :lazy="options.lazy"
        :cell-class-name="options.cellClassName"
        :row-style="options.rowStyle"
        :current-row-key="options.currentRowKey"
        :show-header="getShowHeader"
        :fit="getFit"
        :size="options.size"
        :show-summary="options.showSummary"
        :summary-method="options.summaryMethod"
        :stripe="options.stripe"
        :expand-row-keys="options.expandRowKeys"
        :default-expand-all="options.defaultExpandAll"
        :row-key="options.rowKey"
        :highlight-current-row="options.highlightCurrentRow"
        :tree-props="options.treeProps"
        :sum-text="options.sumText"
        :default-sort="options.defaultSort"
        :tooltip-effect="options.tooltipEffect"
        @selection-change="selectionChange"
        @select="(selection, row)=>tableHandle('select',selection, row)"
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
      >
        <el-table-column
          v-if="options.selection&&isShow(options.selection)"
          type="selection"
          :align="options.selection.center||'left'"
        />
        <el-table-column
          v-if="options.index&&isShow(options.index)"
          type="index"
          :index="options.index.indexMethod"
          :align="options.index.center||'left'"
        />

        <!--        <dynamic-columns :columns="columns" :edit-type="editType" :set-form-datas="setDynamicValidateFormRuleForm" :form-datas="dynamicValidateFormRuleForm" />-->
        <template v-for="(column, i,index2) in options.columns">
          <dynamic-columns v-if="column.child" :key="i" :column="column" :edit-type="editType" :set-form-datas="setFormDatas" :form-datas="formDatas" />
          <el-table-column
            v-else-if="column.type==='selection'&&isShow(column)"
            :key="column.prop+i+index2"
            :width="column.width"
            :prop="column.prop"
            :label="column.label"
            :align="column.align||'left'"
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
          />
          <el-table-column
            v-else-if="isShow(column)"
            :key="getKey(column,i,index2)"
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
              <component :is="column.header" :components-options="column.headerOptions" :form="form" :scope="scope" :column="column" :edit-type="editType" :form-datas="formDatas" :set-form-datas="setFormDatas" />
            </template>
            <template slot-scope="scope">
              <template v-if="column.components&&Object.keys(column.components).length">
                <component
                  :is="component"
                  v-for="(component, key) in column.components"
                  :key="key"
                  :item-type="itemType"
                  :item-prop="itemProp"
                  :components-options="column.componentsOptions"
                  :scope="scope"
                  :item-props="itemProps"
                  :value="getValue(scope)"
                  :column="column"
                  :edit-type="editType"
                  :form="form"
                  :set-form-datas="setFormDatas"
                  :form-datas="formDatas"
                  :errors="errors"
                />
              </template>
              <template v-else>
                <default-column
                  :key="getKey(column,i,index2)"
                  :scope="scope"
                  :errors="errors"
                  :item-type="itemType"
                  :form="form"
                  :item-props="itemProps"
                  :item-prop="itemProp"
                  :value="getValue(scope)"
                  :column="column"
                  :edit-type="editType"
                  :set-form-datas="setFormDatas"
                  :form-datas="formDatas"
                />
              </template>
            </template>
          </el-table-column>
        </template>

        <el-table-column
          v-if="options.operates&&isShow(options.operates)"
          :label="options.operates.label"
          :align="options.operates.align||'left'"
          :width="options.operates.width"
          :fixed="options.operates.fixed"
          :filters="options.operates.filters"
          :sortable="options.operates.sortable"
          :sort-by="options.operates.sortBy"
          :sort-orders="options.operates.sortOrders"
          :sort-change="options.operates.sortChange"
          :filter-method="options.operates.filterHandler"
          :type="options.operates.type"
          :formatter="options.operates.formatter"
          :resizable="options.operates.resizable"
          :index="options.operates.index"
          :column-key="options.operates.columnKey"
          :header-align="options.operates.headerAlign"
          :class-name="options.operates.className"
          :label-class-name="getOperateslabelClassName"
          :min-width="options.operates.minWidth"
          :filter-multiple="options.operates.filterMultiple"
          :filter-placement="options.operates.filterPlacement"
          :reserve-selection="options.operates.reserveSelection"
          :render-header="options.operates.renderHeader"
          :filtered-value="options.operates.filteredValue"
          :selectable="options.operates.selectable"
          :show-overflow-tooltip="options.operates.showOverflowTooltip"
        >
          <template v-if="options.operates.header" :slot="options.operates.header?'header':''" slot-scope="scope">
            <component :is="options.operates.header" :components-options="options.operates.headerOptions" :form="form" :scope="scope" :edit-type="editType" :form-datas="formDatas" :set-form-datas="setFormDatas" />
          </template>
          <template slot-scope="scope">

            <template v-if="options.operates.components&&Object.keys(options.operates.components).length">
              <component :is="component" v-for="(component, key) in options.operates.components" :key="key" :components-options="options.operates.componentsOptions" :dialog="options.dialog" :form="form" :scope="scope" :edit-type="editType" :form-datas="formDatas" :set-form-datas="setFormDatas" />
            </template>

            <template v-else>
              <defaultOperates :data-source="options.operates.dataSource" :dialog="options.dialog" :form="form" :scope="scope" :edit-type="editType" :form-datas="formDatas" :set-form-datas="setFormDatas" />
            </template>
          </template>
        </el-table-column>
      </el-table>
      <cs-custom-pagination v-if="options.pagination" :options="options.pagination" />
    </div>
  </el-form-item>
</template>

<script>
import defaultColumn from './columns/default-column'
import defaultOperates from './columns/default-operates'
import dynamicColumns from './dynamic-columns'
import csCustomPagination from '../cs-custom-pagination/pagination'
import MD5 from 'crypto-js/md5'
import Sortable from 'sortablejs'

export default {
  name: 'CsCustomTable',
  components: {
    defaultColumn,
    defaultOperates,
    dynamicColumns,
    csCustomPagination
  },
  inheritAttrs: false,
  props: {
    options: {
      type: Object
    },
    itemType: {
      type: String
    },
    itemProp: {
      type: String
    },
    itemProps: {
      type: Object
    },
    setFormDatas: {
      type: Function
    },
    form: {
      type: Object
    },
    change: {
      type: Function
    },
    formDatas: {
      type: Object
    },
    errors: {
      type: Object
    },
    value: {
      type: [String, Number, Array]
    }
  },
  data() {
    return {
      multipleSelection: [],
      dynamicValidateFormRuleForm: [],
      orginDatas: [],
      dataList: [],
      table: null
    }
  },
  computed: {
    getOperateslabelClassName() {
      const operates = this.options.operates || {}
      return operates.labelClassName ? 'ignore-drag ' + operates.labelClassName : 'ignore-drag'
    },
    getSyncFormDatasToDataSource() {
      return Object.prototype.toString.call(this.options.syncFormDatasToDataSource) !== '[object Undefined]' ? this.options.syncFormDatasToDataSource : true
    },
    getFit() {
      return Object.prototype.toString.call(this.options.fit) !== '[object Undefined]' ? this.options.fit : true
    },
    getShowHeader() {
      return Object.prototype.toString.call(this.options.showHeader) !== '[object Undefined]' ? this.options.showHeader : true
    },
    getLabelWidth() {
      if (this.options.label) {
        return this.options.labelWidth
      } else {
        return '0px'
      }
    },
    editType() {
      return this.options.editType || 'inline'
    }
  },
  watch: {
    value: {
      handler(val, oldVal) {
        if (val) {
          this.setDynamicValidateFormRuleForm(val)
          if (this.getSyncFormDatasToDataSource) {
            this.dataList = val
            const selection = this.$utils.deepClone(this.multipleSelection)
            if (selection.length && this.options.rowKey) {
              this.$nextTick(() => {
                selection.forEach(r => {
                  const row = this.dataList.filter(v => { return v[this.options.rowKey] === r[this.options.rowKey] })
                  row.length && this.$refs.table.toggleRowSelection(row[0], true)
                })
              })
            }
          }
        }
      },
      deep: true
      // immediate: true
    },
    'options.dataSource': {
      handler(val, oldVal) {
        if (this.lazy && !this.load) {
          const data = this.$utils.deepClone(val)
          this.orginDatas = this.$utils.deepClone(val)
          this.treeHasChildren(data)
          data.sort((a, b) => b.sort - a.sort)
          this.dataList = data
          this.$nextTick(() => {
            const keys = Object.keys(this.$refs.table.store.states.lazyTreeNodeMap)
            const obj = {}
            this.findRowKeyData(this.$utils.deepClone(val), keys, obj)
            this.lazyTreeNodeMapSort(obj)
            this.$refs.table.store.states.lazyTreeNodeMap = obj
          })
        } else {
          this.dataList = val
          this.setDynamicValidateFormRuleForm(val)
          this.setFormDatas({ [this.itemProp]: val })
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.table = this.$refs['table']
    this.options.getTable && this.options.getTable(this.table)
    if (this.options.rowDrag || this.options.colDrag) {
      document.body.addEventListener('drop', this.originEvent)
      this.$nextTick(() => {
        this.setSort()
      })
    }
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
    setSort() {
      if (this.options.rowDrag) {
        const isSwap = this.options.rowDrag.swap
        const rowwrap = this.$refs.table.$el.querySelector('.el-table__body-wrapper > table > tbody')
        this.sortable = Sortable.create(rowwrap, {
          swap: isSwap,
          swapClass: 'sortable-swap-highlight',
          animation: 150,
          ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
          sort: true,
          setData: (dataTransfer) => {
            dataTransfer.setData('Text', '123')
            this.options.rowDrag.setData && this.options.rowDrag.setData(dataTransfer)
          },
          onEnd: evt => {
            const { newIndex, oldIndex } = evt
            const list = [...this.value]
            if (isSwap) {
              list[oldIndex] = list.splice(newIndex, 1, list[oldIndex])[0]
              this.options.rowDrag.onEnd && this.options.rowDrag.onEnd(evt, list)
            } else {
              const current = list.splice(oldIndex, 1)[0]
              list.splice(newIndex, 0, current)
              this.options.rowDrag.onEnd && this.options.rowDrag.onEnd(evt, list)
            }
          }
        })
      }
      if (this.options.colDrag) {
        const isSwap = this.options.colDrag.swap
        const colwarp = this.$refs.table.$el.querySelector('.el-table__header-wrapper tr')
        this.sortable = Sortable.create(colwarp, {
          swap: isSwap,
          swapClass: 'sortable-swap-highlight',
          animation: 150,
          filter: '.ignore-drag,.el-table-column--selection',
          preventOnFilter: true,
          onEnd: evt => {
            const { newIndex, oldIndex } = evt
            if (Object.prototype.toString.call(this.options.columns) === '[object Object]') {
              const list = Object.values(this.options.columns)
              if (isSwap) {
                list[oldIndex] = list.splice(newIndex, 1, list[oldIndex])[0]
              } else {
                const current = list.splice(oldIndex, 1)[0]
                list.splice(newIndex, 0, current)
              }
              const newColmns = {}
              list.forEach((v, i) => {
                newColmns['_' + v.prop] = v
              })
              this.options.colDrag.onEnd && this.options.colDrag.onEnd(evt, newColmns)
            } else {
              const list = [...this.options.columns]
              if (isSwap) {
                list[oldIndex] = list.splice(newIndex, 1, list[oldIndex])[0]
              } else {
                const current = list.splice(oldIndex, 1)[0]
                list.splice(newIndex, 0, current)
              }
              this.options.colDrag.onEnd && this.options.colDrag.onEnd(evt, list)
            }
          },
          onMove: function(evt, originalEvent) {
            if (evt.related.classList.contains('ignore-drag') || evt.related.classList.contains('el-table-column--selection')) {
              return false
            }
          }
        })
      }
    },
    getKey(item, i, index2) {
      return item.editOptions ? MD5(item.prop + JSON.stringify(item.editOptions.rules)).toString() + i + index2 : item.prop + i + index2
    },
    treeHasChildren(arr) {
      const child = this.children
      const hasChildren = this.hasChildren
      arr.forEach(item => {
        if (item[child]) {
          item[hasChildren] = true
          delete item[child]
        } else {
          item[hasChildren] = false
        }
      })
    },
    findRowKeyData(origin, ids, obj) {
      origin.forEach(v => {
        const key = v[this.rowKey] + ''
        const child = this.children
        if (ids.includes(key)) {
          if (v[child]) {
            const data = this.$utils.deepClone(v[child])
            this.treeHasChildren(data)
            obj[key] = data
          }
        }
        if (v[child]) {
          this.findRowKeyData(v[child], ids, obj)
        }
      })
    },
    lazyLoad(tree, treeNode, resolve) {
      const arr = []
      const rowKey = this.rowKey
      const newDatas = this.$utils.deepClone(this.orginDatas)
      this.filterChild(newDatas, tree[rowKey], arr)
      arr.sort((a, b) => b.sort - a.sort)
      this.lazyTreeNodeMapSort()
      resolve(arr)
    },
    lazyTreeNodeMapSort(nodes) {
      for (const i in nodes) {
        nodes[i].sort((a, b) => b.sort - a.sort)
      }
    },
    filterChild(list, id, arr = []) {
      const rowKey = this.rowKey
      const child = this.children
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        if (item[rowKey] === id) {
          this.treeHasChildren(item[child])
          arr.push(...item[child])
          break
        } else if (item[child]) {
          this.filterChild(item[child], id, arr)
        }
      }
    },
    getValue(scope) {
      return this.dynamicValidateFormRuleForm[scope.$index] ? this.dynamicValidateFormRuleForm[scope.$index][scope.column.property] : undefined
    },
    setDynamicValidateFormRuleForm(params) {
      this.dynamicValidateFormRuleForm = params
    },
    selectionChange(selection) {
      this.multipleSelection = selection
      this.options['selectionChange'] && this.options['selectionChange'](Array.from(selection))
    },
    tableMouseenter(event) {
      const table = event.target
      table.classList.add('scrollbarStyle')
    },
    tableMouseleave(event) {
      const table = event.target
      table.classList.remove('scrollbarStyle')
    },
    tableHandle(funKey, row, column, cell, event) {
      this.options[funKey] && this.options[funKey](row, column, cell, event)
    }

  }
}
</script>

<style lang="scss" scoped>
    .jump {
        text-decoration: none;
        color: dodgerblue;
    }
</style>
<style>
    table tr.sortable-swap-highlight{background: #D8EAFD!important;}
</style>
