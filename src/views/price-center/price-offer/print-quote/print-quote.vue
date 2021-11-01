<template>
  <div class="offer-add-edit print-quote">
    <div class="one-step">
      <div class="header">
        <span class="text">报价单详情</span>
        <el-button class="next-step" size="mini" @click="qrPrintHandle">生成PDF</el-button>
      </div>
      <div class="page-table">
        <cs-print
          :print.sync="qrPrint"
          :orientation="'l'"
          :interval="50"
          :format="'a3'"
        >
          <div style="padding: 20px; padding-right: 80px;">
            <cs-custom-table
              border
              :cell-style="{background:'#fff'}"
              :span-method="objectSpanMethod"
              :columns="quoteColumns"
              :data-source="quoteFormDatas"
              edit-type="pop"
            />
          </div>

        </cs-print>
      </div>
    </div>
  </div>
</template>

<script>
import { quote } from './quote.js'
export default {
  mixins: [quote],
  data() {
    return {
      qrPrint: false
    }
  }

}
</script>
<style lang="scss">
  .print-quote{
    .page-table tbody .el-table__row td{
      border-bottom-width: 1px !important;
    }
    .page-table .el-table__row td{
      padding: 5px 0;
    }
    .table tr:nth-child(even){
      background-color: #FFFFFF !important;
    }
    .el-table--border{
      font-size: 12px;
    }

  }
.yarnType-class{
   margin: 5px 0;
   line-height: 16px;
 }
</style>
 <style lang="scss" scoped>
.offer-add-edit {
    padding: 20px;
    .one-step,.second-step {
      .header {
        display: flex;
        align-items: center;
        height: 65px;
        padding: 0 20px;
        border-bottom: 1px solid #E9EFF2;
        .text {
          flex: 1;
          font-size: 18px;
          color: #151226;
        }
        .next-step {
          border-color: #0986FF;
          color: #0986FF;
          margin-right: 8px;
        }
      }
    }
    .one-step {
      background-color: #fff;
      .search {
        padding: 36px 120px 0px 60px;
        margin-bottom: 12px;
        .el-form.el-form--inline .el-form-item {
          margin-bottom: 24px;
        }
      }
    }
  }
</style>
