<!--
 * @Author: Do not edit
 * @Date: 2020-12-03 09:13:35
 * @LastEditTime: 2019-10-15 15:00:45
 * @LastEditors: Aurnm
 **  移库管理打印页面
 -->
<template>
  <div class="move-print-out">
    <div class="move-print">
      <cs-print
        :print.sync="barPrint"
        :orientation="'l'"
        :interval="50"
        :format="'a4'"
      >
        <template v-slot:header>
          <div style="width: 297mm;height: 20px;" />
        </template>
        <div class="pring-details-content">
          <div class="pring-top">
            <div class="print-title">
              <h3>移库单</h3>
            </div>
            <table class="info-table">
              <tr>
                <td align="middle">
                  <span class="label fl">移库单号:</span>
                  <span class="label fl">{{ moveStockId }}</span>
                </td>
                <td>
                  <span class="label fl">移库件数:</span>
                  <span class="label fl">{{ printList.moveAmount }}</span>
                </td>
                <td>
                  <span class="label fl">创建人:</span>
                  <span class="label fl">{{ printList.createdByName }}</span>
                </td>
                <td>
                  <span class="label fl">创建时间:</span>
                  <span class="label fl">{{ $filters.parseTime(printList.createdTime || 0, "{y}-{m}-{d} {h}:{i}") }}</span>
                </td>
              </tr>
            </table>
          </div>
          <!-- 打印表格table -->
          <div id="print-detail-table">
            <!-- 列表  border="1"  cellspacing="0" cellpadding="0"-->
            <table cellspacing="0" cellpadding="0">
              <thead>
                <tr>
                  <th style="min-width: 90px;">
                    移出库位
                  </th>
                  <th style="min-width: 100px;">
                    移入库位
                  </th>
                  <th style="min-width: 110px;">
                    条码号
                  </th>
                  <th style="min-width: 120px;">
                    产品编号
                  </th>
                  <th style="min-width: 220px;">
                    产品属性
                  </th>
                  <th style="min-width: 110px;">
                    缸号
                  </th>
                  <th style="min-width: 100px;">
                    纱牌/纱批
                  </th>
                  <th style="min-width: 80px;">
                    重量(KG)
                  </th>
                  <th style="width:100px">
                    球数
                  </th>
                  <th style="width:100px">
                    销售组织
                  </th>
                </tr>
              </thead>
              <tbody>
                <!-- 列表 -->
                <template v-for="(item, index) in dataSource">
                  <tr :key="index" class="dataSource_color">
                    <!-- 移出库位 -->
                    <td>
                      <span>{{ item.moveOut }}</span>
                    </td>
                    <!-- 移入库位 -->
                    <td>
                      <span>{{ item.moveIn }}</span>
                    </td>
                    <!--条码号-->
                    <td>
                      <span>{{ item.serialNo }}</span>
                    </td>
                    <!--产品编号 -->
                    <td>
                      <span>{{ item.materiel }}</span>
                    </td>
                    <!-- 产品属性 -->
                    <td>
                      <span>{{ item.property }}</span>
                    </td>
                    <!-- 缸号 -->
                    <td>
                      <span>{{ item.dyelot }}</span>
                    </td>
                    <!-- 纱牌/纱批 -->
                    <td style="min-width: 100px;">
                      <span>{{ item.yarnCard }}</span>
                    </td>
                    <!-- 重量(KG) -->
                    <td>
                      <span>{{ item.weight }}</span>
                    </td>
                    <!-- 球数 -->
                    <td>
                      <span>{{ item.ballCount }}</span>
                    </td>
                    <!-- 销售组织 -->
                    <td style="min-width: 90px;">
                      <span>{{ item.sellerTeamName }}</span>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
        <template v-slot:footer>
          <div style="text-align: right;width:120px; height: 30px; padding: 10px;font-size: 12px" />
        </template>
      </cs-print>
      <div slot="foot" class="print-foot">
        <el-button type="primary" @click="barPrintHandle">打印</el-button>
        <el-button @click="backPage">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { copyDetail } from '../api/index.js'
export default {
  components: {},
  data() {
    return {
      dataSource: [],
      barPrint: false,
      moveStockId: '',
      printList: '',
      printData: ''
    }
  },
  created() {
    this.moveStockId = this.$route.query.moveStockId
    this.printMove({ moveStockId: this.$route.query.moveStockId })
  },
  mounted() {},
  methods: {
    // 打印
    barPrintHandle() {
      this.barPrint = true
    },
    async printMove(id) {
      const res = await copyDetail(id)
      if (res.code !== 200) {
        return false
      }
      this.printList = res.data
      const listData = res.data ? res.data.moveStockDetails : []
      this.dataSource = listData
    },
    // 返回
    backPage() {
      this.$router.push(`/wms/inventory-manage/move-store/index`)
    }
  }
}
</script>
<style lang="scss">
.move-print-out{
  width: 100%;
}
.move-print {
  position: relative;
  box-sizing: border-box;
  margin:20px;
  width: 297mm;
    .print-foot{
            width: 297mm;
            // margin-top: 6px;
            height: 42px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
}
.pring-details-content {
  position: relative;
        width: 297mm;
        // overflow: hidden;
        padding: 0px 20px 20px;
        background: #fff;
        .pring-top{
          box-sizing: border-box;

        .print-title{
          padding-top: 10px;
          text-align: center;
        }

        .info-table {
          width: 100%;
          margin-left: 60px;
          font-size: 14px;
          td {
            padding: 10px;
            position: relative;
            vertical-align: middle;
            /*     border: solid 1px #ddd; */
          }
          .cs-code {
            margin-left: 10px;
          }
          .label {
            margin-right: 20px;
            font-weight: 550;
            height: 50px;
            line-height: 50px;
            display: inline-block;
          }
        }

}
//内容页
// 详情表格部分
#print-detail-table {
  width: 100%;
  table-layout: fixed;
  // text-align: center;
  border: 1px solid #b3b2b2;
  border-bottom-width: 0;
}
#print-detail-table th {
  font-size: 12px;
  height: 30px;
  border-right: 1px solid #b3b2b2;
  border-bottom: 1px solid #b3b2b2;
  word-wrap: break-word;
}

#print-detail-table th:last-child {
  border-right: 0;
}

#print-detail-table tr {
  height: 25px;
}

#print-detail-table tr td {
  font-size: 12px;
  padding: 2px 5px;
  text-align: center;
  border-right: 1px solid #b3b2b2;
  border-bottom: 1px solid #b3b2b2;
  word-wrap: break-word;
  white-space:pre-wrap;
  color: #5f6165;
}

#print-detail-table tr td:last-child {
  border-right: 0;
}
}
</style>
