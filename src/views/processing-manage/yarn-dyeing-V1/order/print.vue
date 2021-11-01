
<template>
  <div class="yarn-dyeing-print-tableouts">
    <cs-print :print.sync="qrPrint" :interval="50" :format="'a4'">
      <div
        slot="header"
        class="print-top-box yarn-dyeing-print"
        style="width: 208mm"
      >
        <img src="@/assets/images/logo.png" class="img-logo">
        <div class="wrap-title">
          <span class="title1">佛山市智布互联纺织有限公司</span>
        </div>
      </div>
      <div style="width: 208mm">
        <div>
          <div class="print-Oneindexs yarn-dyeing-print">
            <div class="title3">染纱加工单</div>
            <div class="printing-tops clearfix">
              <div class="print-head">
                <ul class="head-ul">
                  <li>
                    染纱订单号：<span>{{ detailObj.orderId }}</span>
                  </li>
                  <li>
                    染纱厂：<span>{{
                      detailObj.supplier ? detailObj.supplier.label : ""
                    }}</span>
                  </li>
                  <li>
                    染纱厂联系方式：<span>{{
                      detailObj.supplierUserContact
                    }}</span>
                  </li>
                  <li>
                    销售组织：<span>{{
                      detailObj.salesTeam ? detailObj.salesTeam.label : ""
                    }}</span>
                  </li>
                  <li>
                    坯纱数量：<span>{{ detailObj.yarnNum }}(KG)</span>
                  </li>
                  <li>
                    色纱数量：<span>{{ detailObj.factoryNum }}(KG)</span>
                  </li>
                  <li>
                    发单日期：<span>{{
                      $filters.parseTime(detailObj.submitTime)
                    }}</span>
                  </li>
                  <div class="clear" />
                </ul>
              </div>
              <table
                class="y_table"
                cellspacing="0"
                cellpadding="0"
                style="border-bottom: none; width: 100%"
              >
                <thead>
                  <tr>
                    <td style="width: 40px">
                      <span>序号</span>
                    </td>
                    <!-- <td class="" style="min-width: 70px">
                    <span>产品信息</span>
                  </td> -->
                    <td class="" style="min-width: 65px">
                      <span>色纱编码</span>
                    </td>
                    <td class="" style="min-width: 60px">
                      <span>纱名</span>
                    </td>
                    <td class="" style="min-width: 65px">
                      <span>纱属性</span>
                    </td>
                    <td class="" style="min-width: 65px">
                      <span>染纱颜色</span>
                    </td>
                    <td class="" style="min-width: 65px">
                      <span>工厂色号</span>
                    </td>
                    <td class="" style="min-width: 70px">
                      <span>颜色占比</span>
                    </td>
                    <td class="" style="min-width: 60px">
                      <span>坯纱数量(KG)</span>
                    </td>
                    <td class="" style="min-width: 60px">
                      <span>色纱数量(KG)</span>
                    </td>
                    <td class="" style="min-width: 50px">
                      <span>染纱损</span>
                    </td>
                    <td class="" style="min-width: 65px">
                      <span>染纱交期</span>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item1, iex1) in detailObj.orderDetails"
                    :key="iex1"
                    class="table3_tr"
                  >
                    <!-- 序号 -->
                    <td style="width: 40px">
                      <span>{{ iex1 + 1 }}</span>
                    </td>
                    <!--产品信息 -->
                    <!-- <td class="" style="min-width: 70px">
                    <div>{{ `${item1.clothName}` }}</div>
                    <div>{{ `${item1.suggest}` }}</div>
                  </td> -->
                    <!-- 色纱编码 -->
                    <td class="" style="min-width: 65px">
                      <span>{{ item1.yarnId }}</span>
                    </td>
                    <!-- 纱名 -->
                    <td class="" style="min-width: 60px">
                      <span>{{ item1.yarnType }}</span>
                    </td>
                    <!-- 纱属性 -->
                    <td class="" style="min-width: 65px">
                      <span>{{ item1.yarnAttributes }}</span>
                    </td>
                    <!-- 染纱颜色 -->
                    <td class="" style="min-width: 65px">
                      <span>{{ item1.dyeingColor }}</span>
                    </td>
                    <!-- 工厂色号 -->
                    <td class="" style="min-width: 65px">
                      <span>{{ item1.factoryNo }}</span>
                    </td>
                    <!-- 颜色占比 -->
                    <td class="" style="min-width: 70px">
                      <span>{{ item1.colorRatio }}</span>
                    </td>
                    <!-- 坯纱数量 -->
                    <td class="" style="min-width: 60px" align="right">
                      <span>{{ item1.yarnNum }}</span>
                    </td>
                    <!-- 色纱数量 -->
                    <td class="" style="min-width: 60px" align="right">
                      <span>{{ item1.factoryNum }}</span>
                    </td>
                    <!-- 染纱损 -->
                    <td class="" style="min-width: 50px" align="right">
                      <span>{{ item1.dyeingLoss }}</span>
                    </td>
                    <!-- 染纱交期 -->
                    <td class="" style="min-width: 65px">
                      <span>{{
                        $filters.parseTime(item1.dyeingDelivery, "{y}-{m}-{d}")
                      }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table class="y_table" cellspacing="0" cellpadding="0">
                <tbody>
                  <tr>
                    <td style="min-width: 50px">
                      <span style="color: #151222">注意事项</span>
                    </td>
                    <td style="width: 100%; padding: 10px">
                      <div style="line-height: 18px" v-html="note" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="print-bottom">
                <ul>
                  <li>
                    <span style="color: #151222">跟单人：</span>
                    <span style="color: #474747">{{
                      detailObj.pmUser && detailObj.pmUser.label
                        ? detailObj.pmUser.label
                        : "-"
                    }}</span>
                  </li>
                  <li>
                    <span style="color: #151222">审核人：</span>
                    <span style="color: #474747">{{
                      detailObj.submitUserName
                    }}</span>
                  </li>
                  <li>
                    <span style="color: #151222">染纱厂签收：</span>
                    <span />
                  </li>
                  <div class="clear" />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        slot="footer"
        class="print-footer yarn-dyeing-print"
        style="width: 208mm"
      >
        <div style="padding-left: 17px">
          公司地址：塱宝西路26号 同向新力国际企业园 4座北门6层
        </div>
        <div>公司电话：(+86)755-2660 0227</div>
        <div>公司网址：www.sfabric.com</div>
      </div>
    </cs-print>
    <!-- <div style="width: 100%; height: 15px" /> -->
    <div class="print-foots yarn-dyeing-print">
      <el-button @click="qrPrintHandle">打印</el-button>
      <el-button @click="pintBack">关闭</el-button>
    </div>
  </div>
</template>

<script>
import { print } from './api/index.js'
export default {
  components: {},
  data() {
    return {
      qrPrint: false,
      detailObj: {}
    }
  },
  computed: {
    note() {
      if (this.detailObj && this.detailObj.note) {
        return this.detailObj.note.indexOf('\n') !== -1
          ? this.detailObj.note.replace(/\n/g, '<br>')
          : this.detailObj.note
      } else {
        return '-'
      }
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    qrPrintHandle() {
      this.qrPrint = true
    },
    pintBack() {
      this.$router.push(`/processing/yarn-dyeing/order`)
    },
    async getDetail(id) {
      this.detailObj =
        (await print({ orderId: this.$route.params.id })).data || {}
    }
  }
}
</script>

<style lang="scss" >
.yarn-dyeing-print-tableouts {
  box-sizing: border-box;
  margin: 20px;
  width: 210mm;
  background: #fff;
}
.print-top-box.yarn-dyeing-print {
  display: flex;
  align-items: center;
  height: 55px;
  padding: 0 8mm;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 2mm;
  .img-logo {
    width: 26px;
    height: 26px;
  }
  .wrap-title {
    margin-left: 15px;
    flex: 1;
    .title1 {
      color: #151222;
      font-size: 14px;
      font-weight: 400;
    }
  }
}
.print-Oneindexs.yarn-dyeing-print {
  box-sizing: border-box;
  padding: 0 17px;
  .title3 {
    text-align: center;
    color: #151222;
    font-size: 24px;
    font-weight: 600;
    padding: 20px 0 15px;
  }
  // 头部
  .printing-tops {
    .y_table {
      border-right: 1px solid #d2d2d3;
      border-bottom: 1px solid #d2d2d3;
      thead td {
        color: #151222;
      }
      td {
        color: #474747;
        font-weight: normal;
        height: 32px;
        font-size: 12px;
        padding: 3px;
        min-width: 50px;
        border-left: 1px solid #d2d2d3;
        border-top: 1px solid #d2d2d3;
        * {
          display: inline-block;
          width: 100%;
          word-break: break-all;
        }
      }
    }
  }
  // 打印头部样式
  ul,
  ol {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  li,
  span {
    font-weight: 400;
    font-size: 12px;
  }
  .print-head .head-ul li {
    width: 33%;
    float: left;
    padding: 10px 0;
    color: #151222;
    span {
      color: #474747;
    }
  }
  .print-bottom {
    padding: 20px 0;
    padding-top: 60px;
    li {
      width: 33%;
      float: left;
    }
  }
}
.print-footer.yarn-dyeing-print {
  border-top: 1px solid #f0f0f0;
  height: 56px;
  line-height: 56px;
  font-size: 12px;
  color: #474747;
  padding: 0;
  margin: 0;
  text-align: left;
  > div {
    display: inline-block;
    margin-right: 16px;
  }
}
.print-foots.yarn-dyeing-print {
  background: #eef5f9;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
