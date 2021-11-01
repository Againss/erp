<!--
 * @Descripttion:
 * @Author: ll
 * @Date: 2021-03-10
 * @LastEditors: admin
 * @LastEditTime: 2021-03-25 15:17:05
 * isVisible - 传入的控制弹框显隐
 * title - 传入的弹框标题
 * searchData - 传入的搜索项
 * columns - 传入的table表头
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :show="isVisible"
    width="1235px"
    @close="$emit('update:isVisible', false)"
  >
    <!-- 搜索表单 -->
    <div class="search chooseSearch">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <div class="chooseTable">
      <cs-custom-table
        ref="inlineTable"
        :columns="columns"
        :header-cell-style="headerCellStyle"
        :highlight-current-row="true"
        :row-class-name="'heightRow'"
        :data-source="tableData"
        :pagination="pagination"
        edit-type="inline"
        @selection-change="selectionChange"
        @row-click="rowClick"
      />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="saveClick">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'ChoosePop',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array
    },
    title: {
      type: String
    },
    searchData: {
      type: Object
    },
    columns: {
      type: Object
    },
    pagination: {
      type: Object
    }
  },
  data() {
    const headerCellStyle = {
      'background': '#f5f7fa'
    }
    return {
      formOtions: {
        // layout: true,
        size: 'small',
        inline: true
      },
      formDatas: {},
      headerCellStyle,
      visible: this.isVisible,
      chooseData: {}
    }
  },
  watch: {
    isVisible() {
      this.visible = this.isVisible
    }
  },
  methods: {
    selectionChange(val) {
      console.log(val)
    },
    saveClick() {
      this.$emit('savePop', this.chooseData)
      this.chooseData = {}
    },
    rowClick(row) {
      console.log(row)
      if (row) {
        this.chooseData = row
      }
    },
    close() {
      this.$emit('closePop')
    }
  }
}
</script>
<style lang='scss' scope>
.el-dialog__footer{
  text-align: center;
}
// /deep/.search .el-form-item{
//   margin-right: 30px !important;
// }
.chooseSearch {
  padding: 0;

}
.chooseTable {
  .table .el-table .el-table__row .heightRow {
    cursor: pointer;
  }
  // .table .el-table .el-table__row.current-row .heightRow {
  //   > td {
  //     color: #666;
  //     background-color: #d8eafd !important;
  //   }
  // }
}
</style>
<style lang='scss'>
.chooseTable {
  .table .el-table .el-table__row.heightRow {
    cursor: pointer;
  }
  .table tr:nth-child(even){
    background-color: #fff;
  }
  .table .el-table .el-table__row.current-row.heightRow {
    > td {
      color: #666;
      background-color: #d8eafd !important;
    }
  }
}
</style>
