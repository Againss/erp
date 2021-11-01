<!--
 * @Author: Sanmao
 * @Date: 2020-10-10 15:23:20
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-07-15 16:32:53
 * @Descripttion: dialog 搜索和table组件
-->
<template>
  <el-dialog
    v-el-drag-dialog
    class="dialog"
    :title="options.title"
    :visible.sync="options.visible"
    :close-on-click-modal="options.closeOnClickModal || false"
    :width="options.width || '1000px'"
    @closed="closed"
  >
    <el-menu
      v-if="options.tab"
      v-model="activeName"
      mode="horizontal"
      class="dialogmenu"
      :class="{ 'disable' : options.loading }"
      :default-active="activeName"
      active-text-color="#0986FF"
      @select="handleClick"
    >
      <el-menu-item
        v-for="item in options.tab"
        :key="item.name"
        :index="item.name"
      >{{ item.name }}
      </el-menu-item>
    </el-menu>
    <cs-custom-form
      v-if="options.searchData && options.searchData.length"
      ref="searchForm"
      :form-datas="options.searchFormDatas"
      :data-source="options.searchData"
      :options="formOtions"
    />
    <cs-custom-table
      ref="customTable"
      :class="[options.tableSelection ? 'selection-table' : 'custom-table']"
      size="mini"
      :border="options.border ? true : false"
      tooltip-effect="dark"
      :loading="options.loading"
      :columns="options.columns"
      :data-source="options.dataSource"
      :span-method="options.spanMethod"
      :pagination="options.pagination"
      :data-total="options.dataSource.length"
      :max-height="options.maxHeight || '350px'"
      :height="options.Height || '400px'"
      :selection="selection"
      :row-key="options.rowKey"
      :header-cell-style="{ background: '#F5F7FA!important' }"
      :expand-row-keys="options.expandRowKeys"
      @select="selectAction"
      @row-click="rowAction"
      @selection-change="handleSelectionChange"
    />
    <!-- highlight-current-row
      :row-key="options.rowKey"
      :header-cell-style="{ background: '#F5F7FA!important' }"
      :expand-row-keys="options.expandRowKeys"
      @current-change="handleCurrentChange" -->
    <!-- @row-click="rowAction"
    @select="selectAction"
    :selection="selection"
    @selection-change="handleSelectionChange" -->
    <!-- @current-change="handleCurrentChange" -->
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="closed">{{
        options.cancelText
      }}</el-button>
      <el-button size="small" type="primary" @click="sureHandler">{{
        options.okText
      }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import elDragDialog from '@/directive/el-drag-dialog'
export default {
  name: 'DialogComponent',
  directives: { elDragDialog },
  props: {
    options: {
      type: Object
    },
    formOtions: {
      type: Object,
      default: function() {
        return {
          layout: true,
          inline: true
        }
      }
    }
  },
  data() {
    return {
      currentRow: null,
      activeName: this.options.activeTab,
      selection: {
        selection: true,
        selectionLabel: '全部'
      }
    }
  },
  watch: {
    'options.visible': {
      handler(n, o) {
        if (n) {
          this.currentRow = null
        }
      },
      deep: true
    }
  },
  methods: {
    /**
     * @description 关闭
     */
    closed() {
      this.options.closed && this.options.closed(false)
    },
    /**
     * @description 确定选择
     */
    sureHandler() {
      this.options.ok && this.options.ok(this.currentRow)
    },
    handleClick(val) {
      this.currentRow = null
      this.activeName = val
      this.options.tabHandleClick(this.activeName)
    },
    /**
     * @description 单选表格
     */
    handleCurrentChange(row, oldRow) {
      console.log(row, oldRow, '----------------88888888888888888')
      this.currentRow = row
    },
    /**
     * @description 全选表格
     */
    handleSelectionChange(cols) {
      if (this.options.tableSelection) {
        this.currentRow = cols
      }
    },
    /**
     * @desc 选择一条数据
     */
    selectAction(multipleSelection) {
      if (!this.options.tableSelection) {
        const currentRowData = JSON.parse(JSON.stringify(multipleSelection))
        if (multipleSelection && multipleSelection.length > 0) {
          this.$refs.customTable.$refs.table.clearSelection()
          this.$refs.customTable.$refs.table.toggleRowSelection(
            multipleSelection.pop()
          )
        }
        this.currentRow = currentRowData[currentRowData.length - 1]
      }
    },
    rowAction(row) {
      if (!this.options.tableSelection) {
        this.$refs.customTable.$refs.table.clearSelection()
        this.$refs.customTable.$refs.table.toggleRowSelection(
          row
        )
        this.currentRow = row
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog {
  /deep/ .el-table--mini {
    font-size: 14px;
  }
  /deep/ .el-dialog {
    margin-top: 10vh !important;
  }
  .dialog-footer {
    text-align: center;
  }
  /deep/ .el-dialog__header {
    padding: 15px;
  }
  /deep/.el-dialog__body {
    padding: 10px 20px 0;
  }
  .custom-table /deep/ thead .el-table-column--selection .cell {
    display: none;
  }
}
.dialog {
  .dialogmenu {
    margin-bottom: 10px;
  }
  .disable {
    pointer-events: none;
  }
  /deep/.el-menu-item {
    height: 40px;
    line-height: 40px;
  }
  /deep/.el-menu-item.is-active {
    background-color: #fff !important;
    border-right: 0;
  }
}
</style>
