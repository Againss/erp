<!--
 * @Descripttion:
 * @Author: ll
 * @Date: 2021-03-10
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-05 14:44:05
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
    top="5vh"
    @close="$emit('update:isVisible', false)"
  >
    <!-- 搜索表单 -->
    <div class="search chooseSearch">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <div class="popTable">
      <cs-custom-table
        ref="inlineTable"
        :loading="loading"
        :columns="columns"
        :header-cell-style="headerCellStyle"
        :data-source="tableData"
        edit-type="inline"
        :highlight-current-row="true"
        :row-class-name="'heightRow'"
        :pagination="pagination"
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
  name: 'ClothPop',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    loading: {
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
    pagination: {
      type: Object
    },
    columns: {
      type: Object
    },
    typeVs:{
      type:String
    },
    formDatas: {
      type: Object
    }
  },
  data() {
    const headerCellStyle = {
      'background': '#f5f7fa'
    }
    return {
      formOtions: {
        layout: true,
        size: 'small',
        inline: true
      },
      // formDatas: {},
      headerCellStyle,
      visible: this.isVisible,
      chooseNo: '',
      ListRow: ''
    }
  },
  watch: {
    isVisible() {
      this.visible = this.isVisible;
      if( this.$refs.searchForm&&this.$refs.searchForm.dynamicValidateFormRuleForm){  
        this.$refs.searchForm.dynamicValidateFormRuleForm={}
      }
      this.searchFormDatas = {}
    }
  },
  methods: {
    selectionChange(val) {
      console.log(val)
    },
    saveClick() {
      if(!this.ListRow){
        this.$message({ message: '请选择一条记录', type: 'warning'})
        return
      }
      if(this.typeVs){
        this.$emit('savePop',this.ListRow)
      }else{
        this.$emit('saveListRow',this.ListRow)
        this.$emit('savePop', this.chooseNo)
      }
      this.chooseNo = ''
      this.ListRow = ''
    },
    rowClick(row) {
      if (row && row.fabricColorNo) {
        this.chooseNo = row.fabricColorNo
      }
      if (row && row.fabricFlowerNo) {
        this.chooseNo = row.fabricFlowerNo
      }
      if (row && row.colorFabricCode) {
        this.chooseNo = row.colorFabricCode
      }
      if (row && row.code) {
        this.chooseNo = row.code
      }
      this.ListRow = row
      console.log('sssssssom', row)
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
.chooseSearch {
  padding: 0;
}
.popTable {
  .table .el-table .el-table__row.heightRow {
    cursor: pointer;
  }
  .table .el-table .el-table__row.current-row.heightRow {
    > td {
      color: #666;
      background-color: #d8eafd !important;
    }
  }
}
</style>
<style lang='scss'>
.popTable {
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
