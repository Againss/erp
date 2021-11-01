<!--
 * @Author: Do not edit
 * @Date: 2020-12-03 09:13:35
 * @LastEditTime: 2019-10-15 15:00:45
 * @LastEditors: Aurnm
 **  盘点管理打印页面
 -->
<template>
  <div class="check-print-au">
    <div class="check-print">
      <cs-print
        :print.sync="barPrint"
        :orientation="'l'"
        :interval="50"
        :format="'a4'"
      >
        <template v-slot:header>
          <div style="width: 297mm;height: 20px;" />
        </template>
        <div class="pring-content-check">
          <div class="print-title">
            <h3>盘点计划单</h3>
          </div>
          <table class="info-table">
            <tr>
              <td align="middle">
                <span class="label fl">盘点计划单号:</span>
                <span class="label fl">{{ checkPlanId }}</span>
              </td>
              <td><span class="label">盘点仓库:</span>{{ printList.warehouseName }}</td>
              <td>
                <span class="label">盘点开始时间:</span>
                <span class="label">{{ $filters.parseTime(printList.checkStartTime || 0, "{y}-{m}-{d} {h}:{i}") }}</span>
              </td>
            </tr>
            <tr>
              <td align="middle">
                <span class="label fl">创建人:</span>
                <span class="label fl">{{ printList.createdByName }}</span>
              </td>
              <td>
                <span class="label">创建时间:</span>
                <span class="label">{{ $filters.parseTime(printList.createdTime || 0, "{y}-{m}-{d} {h}:{i}") }}</span>
              </td>
            </tr>
          </table>
          <!-- 打印表格部分 -->
          <div id="print-check-table">
            <!-- 列表  border="1"  cellspacing="0" cellpadding="0"-->
            <table cellspacing="0" cellpadding="0">
              <thead>
                <tr>
                  <th style="min-width: 100px;">
                    库位
                  </th>
                  <th style="min-width: 150px;">
                    产品编号
                  </th>
                  <th style="min-width: 150px;">
                    货物类型
                  </th>
                  <th style="min-width: 200px;">
                    产品属性
                  </th>
                  <th v-if="printList.checkType === '1'" style="min-width: 150px;">
                    库位数
                  </th>
                  <th style="width:200px">
                    盘点数
                  </th>
                  <th style="width:200px">
                    包装单位
                  </th>
                  <th style="min-width:100px">
                    盘点人
                  </th>
                </tr>
              </thead>
              <tbody>
                <!-- 列表 -->
                <template v-for="(item, index) in dataSource">
                  <tr :key="index" class=" dataSource_color">
                    <!-- 库位 -->
                    <td>
                      <span>{{ item.locationCode }}</span>
                    </td>
                    <!-- 产品编号 -->
                    <td>
                      <span>{{ item.materiel }}</span>
                    </td>
                    <!--货物类型-->
                    <td>
                      <span>{{ item.materielInfo? getType(item.materielInfo) : '--' }}</span>
                    </td>
                    <!--产品属性 -->
                    <td id="info-text">
                      <span>{{ item.materielInfo? item.materielInfo.property : '--' }}</span>
                    </td>
                    <!-- 库位数 -->
                    <td v-if="printList.checkType === '1'">
                      <span>{{ item.stock }}</span>
                    </td>
                    <!-- 盘点件数 -->
                    <td>
                      <span>{{ item.checkAmount }}</span>
                    </td>
                    <!-- 包装单位 -->
                    <td>
                      <span>{{ item.materielInfo? getUnit(item.materielInfo) : '--' }}</span>
                    </td>
                    <!-- 盘点人 -->
                    <td style="min-width: 100px;">
                      <span>{{ item.checkUserName }}</span>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
        <template v-slot:footer>
          <div style="text-align: right;width:120px; height: 20px; padding: 10px;font-size: 12px" />
        </template>
      </cs-print>
      <div slot="foot" class="print-foot-page">
        <el-button type="primary" @click="barPrintHandle">打印</el-button>
        <el-button @click="backPage">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { checkDetail, makeDetail } from '../api/index.js'
export default {
  components: {},
  data() {
    return {
      dataSource: [],
      barPrint: false,
      formOtions: {
        inline: true,
        size: 'small'
      },
      checkPlanId: '',
      printList: ''
    }
  },
  created() {
    this.checkPlanId = this.$route.query.checkPlanId
    this.getList({ checkPlanId: this.$route.query.checkPlanId, checkResultType: this.$route.query.checkResultType })
    this.downList({ checkPlanId: this.$route.query.checkPlanId, checkResultType: this.$route.query.checkResultType })
  },
  mounted() {},
  methods: {
    // 打印
    barPrintHandle() {
      this.barPrint = true
    },
    // 包装单位
    getUnit(data) {
      let str = ''
      switch (data.materielType) {
        case '0101':
          str = '件'
          break
        case '0102':
          str = '件'
          break
        case '0103':
          str = '件'
          break
        case '0201':
          str = '卷'
          break
        case '0202':
          str = '卷'
          break
        case '0203':
          str = '卷'
          break
        default:
          break
      }
      return str
    },
    // 货物类型
    getType(data) {
      let str = ''
      switch (data.materielType) {
        case '0101':
          str = '纱'
          break
        case '0102':
          str = '纱'
          break
        case '0103':
          str = '纱'
          break
        case '0201':
          str = '布'
          break
        case '0202':
          str = '布'
          break
        case '0203':
          str = '布'
          break
        default:
          break
      }
      return str
    },
    // 点击编辑获取详情
    async getList(data) {
      const res = await checkDetail(data)
      if (!res || res.code !== 200) {
        return false
      }
      this.printList = res.data || {}
    },
    async downList(data) {
      const res = await makeDetail({ ...data })
      if (res.code !== 200) {
        return false
      }
      const copyPrint = res.data.list || []
      this.dataSource = copyPrint
    },
    // 返回
    backPage() {
      this.$router.push('/wms/inventory-manage/check-store/index')
    }
  }
}
</script>
<style lang="scss">
.check-print-au{
  width: 100%;
}
.check-print {
  position: relative;
  box-sizing: border-box;
      margin:20px;
        .print-foot-page {
            width: 297mm;
            margin-top: 6px;
            height: 42px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
}
.pring-content-check {
  position: relative;
  width: 297mm;
  padding: 0px 20px 20px;
        box-sizing: border-box;
        // height: 210mm;
        background: #fff;

        .print-title{
          padding-top: 10px;
            text-align: center;
        }

        .info-table {
  width: 100%;
  margin-left: 60px;
  font-size: 14px;
  td {
    position: relative;
    vertical-align: middle;
  }
  .cs-code {
    margin-left: 10px;
  }
  .label {
    margin-right: 20px;
    height: 30px;
    line-height: 30px;
    display: inline-block;
  }
}
// 详情表格部分
#print-check-table {
  width: 100%;
  table-layout: fixed;
  // text-align: center;
  border: 1px solid #b3b2b2;
  border-bottom-width: 0;
  margin-top: 10px;
}
#print-check-table th {
  font-size: 12px;
  height: 30px;
  border-right: 1px solid #b3b2b2;
  border-bottom: 1px solid #b3b2b2;
  word-wrap: break-word;
}

#print-check-table th:last-child {
  border-right: 0;
}

#print-check-table tr {
  height: 25px;
}

#print-check-table tr td {
  font-size: 12px;
  padding: 2px 5px;
  border-right: 1px solid #b3b2b2;
  border-bottom: 1px solid #b3b2b2;
  word-wrap: break-word;
  text-align: center;
  white-space:pre-wrap;
  color: #5f6165;
}

#print-check-table tr td:last-child {
  border-right: 0;
}
// #print-check-table tr #info-text{
//   text-align: left;
// }
}
</style>
