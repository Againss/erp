/**
* @Description:自定义表格入口
* @author Roman
* @date 2020/5/20
*
* @param {Boolean} loading 加载中 true|false
* @param {Array} dataSource 后台返回数据源列表
* @param {Object} operates 操作方法类
* @param {Object} pagination 分页对象属性 参考elementUI官网pagination配置属性
* @param {String} editType inline行内编辑|pop弹窗编辑
*/
<template>
  <div class="table" @mouseenter="tableMouseenter" @mouseleave="tableMouseleave">
    <el-form ref="dynamicValidateForm" :model="dynamicValidateFormRuleForm">
      <el-table
        ref="table"
        v-table-scrollx="tableScrollx"
        v-loading="loading"
        v-table-scrolly="scrollLoad"
        :class="className"
        :border="border"
        :data="dataList"
        :load="load||lazyLoad"
        :height="height"
        :row-class-name="rowClassName"
        :max-height="getMaxHeight"
        :empty-text="emptyText"
        :span-method="spanMethod"
        :indent="indent"
        :select-on-indeterminate="selectOnIndeterminate"
        :header-cell-style="headerCellStyle"
        :header-cell-class-name="headerCellClassName"
        :header-row-style="headerRowStyle"
        :header-row-class-name="headerRowClassName"
        :cell-style="cellStyle"
        :lazy="lazy"
        :cell-class-name="cellClassName"
        :row-style="rowStyle"
        :current-row-key="currentRowKey"
        :show-header="showHeader"
        :fit="fit"
        :size="size"
        :show-summary="showSummary"
        :summary-method="summaryMethod"
        :stripe="stripe"
        :expand-row-keys="expandRowKeys"
        :default-expand-all="defaultExpandAll"
        :row-key="rowKey"
        :highlight-current-row="highlightCurrentRow"
        :tree-props="treeProps"
        :sum-text="sumText"
        :default-sort="defaultSort"
        :tooltip-effect="tooltipEffect"
        @selection-change="selectionChange"
        @select="select"
        @select-all="selectAll"
        @cell-mouse-leave="cellMouseLeave"
        @cell-mouse-enter="cellMouseEnter"
        @cell-click="cellClick"
        @cell-dblclick="cellDblclick"
        @row-click="rowClick"
        @row-contextmenu="rowContextmenu"
        @row-dblclick="rowDblclick"
        @header-click="headerClick"
        @header-contextmenu="headerContextmenu"
        @sort-change="sortChange"
        @filter-change="filterChange"
        @current-change="currentChange"
        @header-dragend="headerDragend"
        @expand-change="expandChange"
      >
        <el-table-column
          v-if="selection&&isShow(selection)"
          type="selection"
          :align="selection.center||'left'"
        />
        <el-table-column
          v-if="index&&isShow(index)"
          type="index"
          :index="index.indexMethod"
          :align="index.center||'left'"
        />

        <!--        <dynamic-columns :columns="columns" :edit-type="editType" :set-form-datas="setDynamicValidateFormRuleForm" :form-datas="dynamicValidateFormRuleForm" />-->
        <template v-for="(column, i,index2) in columns">
          <dynamic-columns v-if="column.child" :key="i" :column="column" :edit-type="editType" :set-form-datas="setDynamicValidateFormRuleForm" :form-datas="dynamicValidateFormRuleForm" />
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
            :key="column.prop+i+index2"
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
              <component :is="column.header" :components-options="column.headerOptions" :form="form" :scope="scope" :column="column" :edit-type="editType" :form-datas="dynamicValidateFormRuleForm" :set-form-datas="setDynamicValidateFormRuleForm" />
            </template>
            <template slot-scope="scope">
              <template v-if="column.components&&Object.keys(column.components).length">
                <component :is="component" v-for="(component, key) in column.components" :key="key+i" :components-options="column.componentsOptions" :scope="scope" :value="getValue(scope)" :column="column" :edit-type="editType" :set-form-datas="setDynamicValidateFormRuleForm" :form-datas="dynamicValidateFormRuleForm" />
              </template>
              <template v-else>
                <default-column :key="column.prop+i+index2" :scope="scope" :value="getValue(scope)" :column="column" :edit-type="editType" :set-form-datas="setDynamicValidateFormRuleForm" :form-datas="dynamicValidateFormRuleForm" />
              </template>
            </template>
          </el-table-column>
        </template>

        <el-table-column
          v-if="operates&&isShow(operates)"
          :label="operates.label"
          :align="operates.align||'left'"
          :width="getOperateWidth"
          :fixed="operates.fixed"
          :filters="operates.filters"
          :sortable="operates.sortable"
          :sort-by="operates.sortBy"
          :sort-orders="operates.sortOrders"
          :sort-change="operates.sortChange"
          :filter-method="operates.filterHandler"
          :type="operates.type"
          :formatter="operates.formatter"
          :resizable="operates.resizable"
          :index="operates.index"
          :column-key="operates.columnKey"
          :header-align="operates.headerAlign"
          :class-name="operates.className"
          :label-class-name="getOperateslabelClassName"
          :min-width="operates.minWidth"
          :filter-multiple="operates.filterMultiple"
          :filter-placement="operates.filterPlacement"
          :reserve-selection="operates.reserveSelection"
          :render-header="operates.renderHeader"
          :filtered-value="operates.filteredValue"
          :selectable="operates.selectable"
          :show-overflow-tooltip="operates.showOverflowTooltip"
        >
          <template v-if="operates.header" :slot="operates.header?'header':''" slot-scope="scope">
            <component :is="operates.header" :components-options="operates.headerOptions" :form="form" :scope="scope" :edit-type="editType" :form-datas="dynamicValidateFormRuleForm" :set-form-datas="setDynamicValidateFormRuleForm" />
          </template>
          <template slot-scope="scope">

            <template v-if="operates.components&&Object.keys(operates.components).length">
              <component :is="component" v-for="(component, key) in operates.components" :key="key" :components-options="operates.componentsOptions" :dialog="dialog" :form="form" :scope="scope" :edit-type="editType" :form-datas="dynamicValidateFormRuleForm" :set-form-datas="setDynamicValidateFormRuleForm" />
            </template>

            <template v-else>
              <defaultOperates :options="operates.moreOptions" :data-source="operates.dataSource" :dialog="dialog" :form="form" :scope="scope" :edit-type="editType" :form-datas="dynamicValidateFormRuleForm" :set-form-datas="setDynamicValidateFormRuleForm" />
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <el-row>
      <el-col :span="getTableFooterSpan[0]">
        <div v-if="tableFooter&&tableFooter.component" :class="getTableFooterLeftClass">
          <component :is="tableFooter.component" ref="tableFooterComponent" :options="tableFooter.componentOptions" />
        </div>
      </el-col>
      <el-col :span="getTableFooterSpan[1]"><cs-custom-pagination v-if="getCurrentPagination" :options="getCurrentPagination" /></el-col>
    </el-row>
    <div v-if="tableMenuVisible" ref="table_menu" :style="{left:tableMenuLeft+'px',top:tableMenuTop+'px'}" class="table_menu">
      <p class="table_menu_item" @click="tableMenuClick" />
    </div>
  </div>
</template>

<script>
import defaultColumn from './columns/default-column'
import defaultOperates from './columns/default-operates'
import dynamicColumns from './dynamic-columns'
import csCustomPagination from '../cs-custom-pagination/pagination'
import { addListener, removeListener } from 'resize-detector'
import Sortable from 'sortablejs'
// import { _debounce } from '@/utils'

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
    className: {
      type: String
    },
    tableScrollx: {
      type: Boolean,
      default: false
    },
    scrollLoad: {
      type: Function
    },
    tableFooter: {
      type: Object,
      default: () => ({})
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    expandRowKeys: {
      type: Array
    },
    autoresize: {
      type: Boolean
    },
    lazy: {
      type: Boolean
    },
    load: {
      type: Function
    },
    tooltipEffect: {
      type: String
    },
    indent: {
      type: Number
    },
    selectOnIndeterminate: {
      type: Boolean
    },
    sumText: {
      type: String
    },
    showSummary: {
      type: Boolean
    },
    summaryMethod: {
      type: Function
    },
    dialog: {
      type: Object
    },
    editType: {
      type: String,
      default: 'pop'
    },
    columns: {
      type: [Array, Object],
      default: () => []
    },
    formDatas: {
      type: Object
    },
    border: {
      type: Boolean,
      default: false
    },
    height: {
      type: [String, Number]
    },
    maxHeight: {
      type: [String]
    },
    spanMethod: {
      type: Function
    },
    defaultExpandAll: {
      type: Boolean
    },
    highlightCurrentRow: {
      type: Boolean
    },
    rowKey: {
      type: [String, Function]
    },
    treeProps: {
      type: Object
    },
    defaultSort: {
      type: Object
    },
    rowClassName: {
      type: [Function, String]
    },
    emptyText: {
      type: String
    },
    headerRowStyle: {
      type: [Object, Function]
    },
    stripe: {
      type: Boolean
    },
    currentRowKey: {
      type: [String, Number]
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    fit: {
      type: Boolean,
      default: true
    },
    size: {
      type: String
    },
    headerRowClassName: {
      type: [Function, String]
    },
    cellStyle: {
      type: [Object, Function]
    },
    cellClassName: {
      type: [Function, String]
    },
    rowStyle: {
      type: [Object, Function]
    },
    headerCellStyle: {
      type: [Object, Function]
    },
    headerCellClassName: {
      type: [Function, String]
    },
    loading: {
      type: Boolean,
      default: false
    },
    staticPage: {
      type: Boolean,
      default: false
    },
    operates: {
      type: [Object],
      default: () => {}
    },
    pagination: {
      type: Object,
      default: null
    },
    selection: { type: Object },
    index: { type: Object },
    getTable: {
      type: Function
    },
    getForm: {
      type: Function
    },
    rowDrag: {
      type: [Object]
    },
    colDrag: {
      type: [Object]
    }
  },
  data() {
    const currentChange = this.paginationCurrentChange
    const sizeChange = this.paginationSizeChange
    const defaultPagination = {
      pageSize: 5,
      pageNum: 1,
      currentPage: 1,
      pageSizes: [5, 10, 20, 50, 100],
      currentChange,
      sizeChange
    }
    const operateWidth = this.operates ? this.operates.width : 0
    return {
      tableMenuVisible: false,
      tableMenuTop: 0,
      tableMenuLeft: 0,
      multipleSelection: [],
      dynamicValidateFormRuleForm: {},
      form: null,
      operateWidth,
      table: null,
      orginDatas: [],
      dataList: [],
      getPagination: null,
      defaultPagination,
      tableMaxHeight: undefined
    }
  },
  computed: {
    getTableFooterLeftClass() {
      return this.tableFooter.leftClass ? 'tableFooterLeftClass ' + this.tableFooter.leftClass : 'tableFooterLeftClass'
    },
    getTableFooterSpan() {
      let span = [8, 16]
      if (this.tableFooter.span) {
        span = this.tableFooter.span
      }
      if (!this.tableFooter.component) {
        span = [0, 24]
      }
      return span
    },
    isResetOperateWidth() {
      return Object.prototype.toString.call(this.operates.isResetOperateWidth) !== '[object Undefined]' ? this.operates.getOperateWidth : true
    },
    getOperateWidth: {
      get: function() {
        return this.operateWidth
      },
      set: function(newValue) {
        this.operateWidth = newValue
      }
    },
    getOperateslabelClassName() {
      const operates = this.operates || {}
      return operates.labelClassName ? 'ignore-drag operatesDefaultClass ' + operates.labelClassName : 'ignore-drag operatesDefaultClass'
    },
    getCurrentPagination: {
      get: function() {
        return this.getPagination
      },
      set: function(newValue) {
        this.getPagination = newValue
      }
    },
    getFit() {
      return Object.prototype.toString.call(this.fit) !== '[object Undefined]' ? this.fit : true
    },
    getShowHeader() {
      return Object.prototype.toString.call(this.showHeader) !== '[object Undefined]' ? this.showHeader : true
    },
    getTreeProps() {
      return this.treeProps || {}
    },
    children() {
      return this.getTreeProps.children || 'children'
    },
    hasChildren() {
      return this.getTreeProps.hasChildren || 'hasChildren'
    },
    getMaxHeight: {
      get: function() {
        return this.tableMaxHeight || this.maxHeight
      },
      set: function(newValue) {
        this.tableMaxHeight = newValue
      }
    }
  },
  watch: {
    formDatas: {
      handler(val, oldVal) {
        this.setDynamicValidateFormRuleForm(val)
      },
      deep: true,
      immediate: true
    },
    pagination: {
      handler(val, oldVal) {
        if (val) {
          this.getPagination = val
        }
      },
      deep: true,
      immediate: true
    },
    dataSource: {
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
          if (this.staticPage) {
            this.orginDatas = this.$utils.deepClone(val)
            const len = this.orginDatas.length
            const propPagination = this.getPagination || {}
            const pageSizes = propPagination.pageSizes
            const pageSize = propPagination.pageSize
            const pagination = {
              ...this.defaultPagination,
              dataTotal: len
            }
            if (pageSizes) {
              pagination.pageSizes = pageSizes
            }
            if (pageSize) {
              pagination.pageSize = pageSize
            }
            const data = this.$utils.deepClone(val)
            this.getCurrentPagination = pagination
            this.dataList = data.splice(0, pagination.pageSize)
          } else {
            this.dataList = val
          }
        }
        if (val && val.length) {
          this.$nextTick(
            this.getMinOperateWidth
          )
        }
      },
      deep: true,
      immediate: true
    },
    tableMenuVisible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeTableMenu)
      } else {
        document.body.removeEventListener('click', this.closeTableMenu)
      }
    }
  },
  mounted() {
    this.form = this.$refs['dynamicValidateForm']
    this.table = this.$refs['table']
    this.getTable && this.getTable(this.table)
    this.getForm && this.getForm(this.form)
    if (this.autoresize) {
      this.__resizeHandler = this.resizeHandler
      // addListener(this.$el, this.__resizeHandler)
      // document.body.style.overflowY = 'hidden'
      document.body.classList.add('tb_resize')
      addListener(document.querySelector('.app-main'), this.__resizeHandler)
    }
    if (this.rowDrag || this.colDrag) {
      document.body.addEventListener('drop', this.originEvent)
      this.$nextTick(() => {
        this.setSort()
      })
    }
  },
  activated() {
    this.$forceUpdate()
    this.getMinOperateWidth()
  },
  beforeDestroy() {
    if (this.autoresize) {
      document.body.classList.remove('tb_resize')
      removeListener(document.querySelector('.app-main'), this.__resizeHandler)
      document.body.removeEventListener('drop', this.originEvent)
    }
  },
  methods: {
    tableMenuClick(event) {
      // console.log(123)
    },
    openTableMenu(e) {
      const menuMinWidth = 120
      const offsetWidth = this.$el.offsetWidth
      const maxLeft = offsetWidth - menuMinWidth
      const left = e.clientX - this.$el.getBoundingClientRect().left + 10

      if (left > maxLeft) {
        this.tableMenuLeft = maxLeft
      } else {
        this.tableMenuLeft = left
      }
      this.tableMenuTop = e.clientY - this.$el.getBoundingClientRect().top
      this.tableMenuVisible = true
    },
    closeTableMenu() {
      this.tableMenuVisible = false
    },
    // @_debounce(20)
    getMinOperateWidth() {
      const arr = []
      this.$refs.table.$el.querySelectorAll('.defaultOperates').forEach(v => {
        let num = 0
        v.querySelectorAll('.itemStyle').forEach(o => {
          num += o.offsetWidth
        })
        arr.push(num)
      })

      if (arr.length && this.isResetOperateWidth) {
        let num = Math.max(...arr)
        num = num < 28 ? 28 : num
        num += 38
        this.getOperateWidth = num
      }
    },
    setSort() {
      if (this.rowDrag) {
        const isSwap = this.rowDrag.swap
        const rowwrap = this.$refs.table.$el.querySelector('.el-table__body-wrapper > table > tbody')
        this.sortable = Sortable.create(rowwrap, {
          swap: isSwap,
          swapClass: 'sortable-swap-highlight',
          animation: 150,
          ghostClass: 'sortable-ghost',
          setData: (dataTransfer) => {
            // dataTransfer.setData('Text', '')
            this.rowDrag.setData && this.rowDrag.setData(dataTransfer)
          },
          onEnd: evt => {
            const { newIndex, oldIndex } = evt
            const list = [...this.dataSource]
            if (isSwap) {
              list[oldIndex] = list.splice(newIndex, 1, list[oldIndex])[0]
            } else {
              const current = list.splice(oldIndex, 1)[0]
              list.splice(newIndex, 0, current)
            }
            this.rowDrag.onEnd && this.rowDrag.onEnd(evt, list)
          }
        })
      }
      if (this.colDrag) {
        const isSwap = this.colDrag.swap
        const colwarp = this.$refs.table.$el.querySelector('.el-table__header-wrapper tr')
        this.sortable = Sortable.create(colwarp, {
          swap: isSwap,
          swapClass: 'sortable-swap-highlight',
          animation: 150,
          filter: '.ignore-drag,.el-table-column--selection',
          preventOnFilter: true,
          onEnd: evt => {
            const { newIndex, oldIndex } = evt
            if (Object.prototype.toString.call(this.columns) === '[object Object]') {
              const list = Object.values(this.columns)
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
              this.colDrag.onEnd && this.colDrag.onEnd(evt, newColmns)
            } else {
              const list = [...this.columns]
              if (isSwap) {
                list[oldIndex] = list.splice(newIndex, 1, list[oldIndex])[0]
              } else {
                const current = list.splice(oldIndex, 1)[0]
                list.splice(newIndex, 0, current)
              }
              this.colDrag.onEnd && this.colDrag.onEnd(evt, list)
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
    paginationSizeChange(val) {
      const pagination = { ...this.getCurrentPagination }
      pagination.pageSize = val
      pagination.currentPage = 1
      this.getCurrentPagination = pagination
      const data = this.orginDatas.slice(0, val)
      this.dataList = data
    },
    paginationCurrentChange(val) {
      const data = this.orginDatas.slice((val - 1) * this.getCurrentPagination.pageSize, val * this.getCurrentPagination.pageSize)
      this.dataList = data
    },
    resizeHandler() {
      if (this.autoresize) {
        let subHeight = 20
        if (this.pagination) {
          const { pageSize = 20, dataTotal } = this.pagination
          if (dataTotal > pageSize) { subHeight = 72 }
        }
        const height = this.getMaxHeightHandle() - subHeight
        if (this.getMaxHeight !== height) {
          this.getMaxHeight = height
        }
      }
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
    getMaxHeightHandle() {
      const clientHeight = document.body.clientHeight
      const top = this.offsetTop(this.$el)
      return clientHeight - top
    },
    offsetTop(element) {
      let elTop = element.offsetTop
      let parent = element.offsetParent
      while (parent !== null) {
        elTop += parent.offsetTop
        parent = parent.offsetParent
      }
      return elTop
    },
    selectionChange(selection) {
      this.multipleSelection = selection
      this.$emit('selection-change', Array.from(selection))
    },
    select(selection) {
      this.$emit('select', selection)
    },
    selectAll(selection) {
      this.$emit('select-all', selection)
    },
    getParent(ele, parentClassName) {
      let targetParent = ele.parentNode
      while (!targetParent.classList.contains(parentClassName)) {
        targetParent = targetParent.parentNode
      }
      return targetParent
    },
    tableMouseenter(event) {
      const table = event.target
      table.classList.add('scrollbarStyle')
    },
    tableMouseleave(event) {
      const table = event.target
      table.classList.remove('scrollbarStyle')
    },
    cellMouseEnter(row, column, cell, event) {
      this.$emit('cell-mouseEnter', row, column, cell, event)
    },
    cellMouseLeave(row, column, cell, event) {
      this.$emit('cell-mouseLeave', row, column, cell, event)
    },
    cellClick(row, column, cell, event) {
      this.$emit('cell-click', row, column, cell, event)
    },
    cellDblclick(row, column, cell, event) {
      this.$emit('cell-dblclick', row, column, cell, event)
    },
    rowClick(row, column, event) {
      this.$emit('row-click', row, column, event)
    },
    rowContextmenu(row, column, event) {
      this.$emit('row-contextmenu', row, column, event)
    },
    rowDblclick(row, column, event) {
      this.$emit('row-dblclick', row, column, event)
    },
    headerClick(column, event) {
      this.$emit('header-click', column, event)
    },
    headerContextmenu(column, event) {
      // this.openTableMenu(event)
      this.$emit('header-contextmenu', column, event)
      event.preventDefault()
    },
    sortChange({ column, prop, order }) {
      this.$emit('sort-change', { column, prop, order })
    },
    filterChange(filters) {
      this.$emit('filter-change', filters)
    },
    currentChange(currentRow, oldCurrentRow) {
      this.$emit('current-change', currentRow, oldCurrentRow)
    },
    headerDragend(newWidth, oldWidth, column, event) {
      this.$emit('header-dragend', newWidth, oldWidth, column, event)
    },
    expandChange(row, expanded) {
      this.$emit('expand-change', row, expanded)
    },
    getValue(scope) {
      return this.dynamicValidateFormRuleForm[scope.$index] ? this.dynamicValidateFormRuleForm[scope.$index][scope.column.property] : undefined
    },
    setDynamicValidateFormRuleForm(params) {
      this.dynamicValidateFormRuleForm = { ...this.dynamicValidateFormRuleForm, ...params }
    },
    originEvent(event) {
      event.preventDefault()
      event.stopPropagation()
    }
  }
}
</script>

<style lang="scss" scoped>
    .tableFooterLeftClass{margin-top: 20px;}
    .jump {
        text-decoration: none;
        color: dodgerblue;
    }
/*    .el-table.hide-scrollBar{
        scrollbar-width: none;
        -ms-overflow-style: none;
        padding-bottom: 8px;
    }
    .el-table.hide-scrollBar ::-webkit-scrollbar {
        display: none;
    }*/
</style>
<style lang="scss">
    .el-table th > .cell.ignore-drag.operatesDefaultClass{padding: 0px 16px}
    table tr.sortable-swap-highlight{background: #D8EAFD!important;}
    div.el-table > .el-table__body-wrapper {
        scrollbar-color: rgba(144,147,153,0) rgba(144,147,153,0);
        scrollbar-width: thin;
        &::-webkit-scrollbar {
            width: 8px;
            height: 8px;
            background: rgba(144,147,153,0);
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0);
            background: rgba(144,147,153,0);
            transition:.3s background
        }
        &::-webkit-scrollbar-thumb:hover {background: rgba(144,147,153,0);}
        &::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0);
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0);
            background: rgba(144,147,153,0);
            border-radius: 10px;
        }
    }

    .table_menu {
        z-index: 999;
        line-height: 35px;
        width: 120px;
        margin: 0px;
        border-radius: 5px;
        position: absolute;
        font-size: 14px;
        text-align: left;
        padding: 0px 10px;
        box-sizing: border-box;
        border: 1px solid #dfe6ec;
        background: #ffffff;
    }

    .table_menu_item {
        margin: 0;
        cursor: default;
        color: rgb(24, 144, 255);
    }
    .table_menu_item:hover{
        color: rgba(24, 144, 255,0.7);
    }
</style>
