/**
* @Description:自定义弹框入口
* @author Roman
* @date 2020/5/20
*/
<template>
  <el-dialog
    v-el-drag-dialog="options.drag"
    :title="options.title"
    :class="options.className"
    :visible.sync="options.visible"
    :width="options.width||'780px'"
    :modal="options.modal"
    :fullscreen="options.fullscreen"
    :modal-append-to-body="options.modalAppendToBody"
    :append-to-body="options.appendToBody"
    :lock-scroll="options.lockScroll"
    :custom-class="options.customClass?options.customClass+' customDialogclass':'customDialogclass'"
    :close-on-click-modal="options.closeOnClickModal||false"
    :close-on-press-escape="options.closeOnPressEscape"
    :show-close="options.showClose"
    :before-close="beforeClose"
    :center="options.center"
    :destroy-on-close="options.destroyOnClose"
    :top="options.top||'5vh'"
    @open="open"
    @opened="opened"
    @close="close"
    @closed="closed"
  >
    <div>
      <template v-if="options.component">
        <component :is="options.component" ref="popcomponent" :options="options" :pop-visible="options.visible" />
      </template>
      <template v-else>
        <component :is="options.headerComponent" ref="headerComponent" :options="options" :pop-visible="options.visible" />
        <cs-custom-form ref="popform" :data-source="popFormOptions.content" :form-datas="popFormOptions.formDatas" :options="popFormOptions.formOptions" :pop-visible="options.visible" />
        <component :is="options.centerComponent" ref="centerComponent" :options="options" :pop-visible="options.visible" />
        <cs-custom-table
          v-if="popTableOptions.dataSource"
          ref="poptable"
          v-loading="popTableOptions.loading"
          :columns="popTableOptions.columns"
          :border="popTableOptions.border"
          :data-source="popTableOptions.dataSource"
          :height="popTableOptions.height"
          :row-class-name="popTableOptions.rowClassName"
          :max-height="popTableOptions.maxHeight"
          :empty-text="popTableOptions.emptyText"
          :span-method="popTableOptions.spanMethod"
          :header-cell-style="popTableOptions.headerCellStyle"
          :header-cell-class-name="popTableOptions.headerCellClassName"
          :header-row-style="popTableOptions.headerRowStyle"
          :header-row-class-name="popTableOptions.headerRowClassName"
          :cell-style="popTableOptions.cellStyle"
          :cell-class-name="popTableOptions.cellClassName"
          :row-style="popTableOptions.rowStyle"
          :current-row-key="popTableOptions.currentRowKey"
          :show-header="popTableOptions.showHeader"
          :fit="popTableOptions.fit||true"
          :size="popTableOptions.size"
          :stripe="popTableOptions.stripe"
          :expand-row-keys="popTableOptions.expandRowKeys"
          :default-expand-all="popTableOptions.defaultExpandAll"
          :row-key="popTableOptions.rowKey"
          :highlight-current-row="popTableOptions.highlightCurrentRow"
          :tree-props="popTableOptions.treeProps"
          :default-sort="popTableOptions.defaultSort"
          :operates="popTableOptions.operates"
          :tooltip-effect="popTableOptions.tooltipEffect"
          :pagination="popTableOptions.pagination"
          :static-page="popTableOptions.staticPage"
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
        <component :is="options.footerComponent" ref="footerComponent" :options="options" :pop-visible="options.visible" />
      </template>
    </div>
    <template v-if="options.footer">
      <span slot="footer" class="dialog-footer">
        <component :is="options.footer" :options="options" :getform="getform" :getform-datas="getformDatas" :gettable="gettable" />
      </span>
    </template>
    <pop-footer v-else-if="isShow" slot="footer" :options="options" :getform="getform" :getform-datas="getformDatas" :gettable="gettable" />
  </el-dialog>
</template>

<script>
import PopFooter from './footer'
import csCustomForm from '../cs-custom-form/form'
import CsCustomTable from '../cs-custom-table/table'
export default {
  name: 'CsCustomPopsearch',
  components: {
    PopFooter,
    csCustomForm,
    CsCustomTable
  },
  inheritAttrs: false,
  props: {
    options: {
      type: Object
    }
  },
  data() {
    return {

    }
  },
  computed: {
    popFormOptions() {
      return this.options.popFormOptions || {}
    },
    popTableOptions() {
      return this.options.popTableOptions || {}
    },
    isShow() {
      if (Object.prototype.toString.call(this.options.showFooter) !== '[object Undefined]') {
        return this.options.showFooter
      }
      return true
    },
    form() {
      if (this.options.component) {
        return this.$refs.popcomponent
      }
      return this.$refs.popform.form
    },
    table() {
      if (this.options.component) {
        return this.$refs.popcomponent
      }
      return this.$refs.poptable.table
    },
    formDatas() {
      if (this.options.component) {
        return this.$refs.popcomponent
      }
      return this.$refs.popform.dynamicValidateFormRuleForm
    }
  },
  watch: {

  },
  mounted() {

  },
  methods: {
    tableHandle(funKey, row, column, cell, event) {
      this.popTableOptions[funKey] && this.popTableOptions[funKey](row, column, cell, event)
    },
    gettable() {
      return this.table
    },
    getform() {
      return this.form
    },
    getformDatas() {
      return this.formDatas
    },
    beforeClose(done) {
      if (this.options.beforeClose) {
        this.options.beforeClose(this.getform, this.getformDatas, this.gettable, done)
      } else {
        done()
      }
    },
    open() {
      this.$emit('open', this.getform, this.getformDatas, this.gettable)
    },
    opened() {
      this.$emit('opened', this.getform, this.getformDatas, this.gettable)
    },
    close() {
      this.form.resetFields && this.form.resetFields()
      document.querySelector('.customDialogclass .el-dialog__body').scrollTo && document.querySelector('.customDialogclass .el-dialog__body').scrollTo(0, 0)
      this.$emit('close', this.getform, this.getformDatas, this.gettable)
    },
    closed() {
      this.$emit('closed', this.getform, this.getformDatas, this.gettable)
    }
  }
}
</script>

<style lang="scss">
    .customDialogclass  .el-dialog__body{
        max-height: calc(90vh - 132px);
        overflow-y: auto;
    }
</style>

