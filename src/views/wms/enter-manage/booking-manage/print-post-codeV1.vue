<template>
  <div
    v-if="postCodeData.length > 0"
    id="printMain"
    style="width: 80mm; margin-top: 20px; font-size: 12px; margin: 0 auto"
  >
    <!-- class="print-main" -->
    <div
      style="
        width: 80mm;
        line-height: 58px;
        height: 58px;
        background: #fff;
        padding: 0 22px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #eeeff0;
        background: #fff;
      "
    >
      <span
        style="display: inline-block; font-size: 16px; color: #151222"
      >打印贴码</span>
      <!-- class="label" -->
    </div>
    <cs-print
      :print.sync="barPrint"
      :orientation="'p'"
      :interval="500"
      :format="'a6'"
    >
      <!-- 布贴码 -->
      <template v-if="productType === '1'">
        <table
          v-for="(item, index) in postCodeData"
          :key="item + index"
          style="
            margin-bottom: 10px;
            padding: 10px;
            margin-left: 0;
            margin-right: 0;
            text-align: center;
            font-weight: 500;
            background: #fff;
            width: 80mm;
          "
        >
          <!-- class="pring-post-code-table" -->
          <tbody>
            <tr>
              <th
                style="
                  padding: 8px;
                  font-size: 12px;
                  line-height: 20px;
                  width: 20mm;
                "
              >
                货主
              </th>
              <td style="padding: 8px; font-size: 12px; line-height: 20px">
                {{ item.shipper }}
              </td>
            </tr>
            <tr>
              <th
                style="
                  padding: 8px;
                  font-size: 12px;
                  line-height: 20px;
                  width: 20mm;
                "
              >
                产品属性
              </th>
              <td style="padding: 8px; font-size: 12px; line-height: 20px">
                {{ item.property }}
              </td>
            </tr>
            <tr>
              <th
                style="
                  padding: 8px;
                  font-size: 12px;
                  line-height: 20px;
                  width: 20mm;
                "
              >
                缸号
              </th>
              <td style="padding: 8px; font-size: 12px; line-height: 20px">
                {{ item.dyelot }}
              </td>
            </tr>
            <tr>
              <th
                style="
                  padding: 8px;
                  font-size: 12px;
                  line-height: 20px;
                  width: 20mm;
                "
              >
                成品颜色
              </th>
              <td style="padding: 8px; font-size: 12px; line-height: 20px">
                {{ item.color }}
              </td>
            </tr>
            <tr>
              <th>印花颜色</th>
              <td>{{ item.printing }}</td>
            </tr>
            <tr>
              <th>收货时间</th>
              <td>{{ formatTime(item.sentInFact) }}</td>
            </tr>
            <tr>
              <th>重量(KG)</th>
              <td>{{ item.weightAvg }}</td>
            </tr>
            <tr>
              <td colspan="2" align="center">
                <cs-barcode
                  :options="{
                    value: item.serialNo,
                    height: 50,
                    width: 1.5,
                    textMargin: 5,
                  }"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <!-- 纱贴码 -->
      <template v-else-if="productType === '2'">
        <table
          v-for="(item, index) in postCodeData"
          :key="item + index"
          style="
            margin-bottom: 10px;
            padding: 10px;
            margin-left: 0;
            margin-right: 0;
            text-align: center;
            font-weight: 500;
            background: #fff;
            width: 80mm;
          "
        >
          <!-- class="pring-post-code-table" -->
          <tbody>
            <tr>
              <th
                style="
                  padding: 8px;
                  font-size: 12px;
                  line-height: 20px;
                  width: 20mm;
                  text-align: right;
                "
              >
                货主
              </th>
              <td
                style="
                  padding: 8px;
                  font-size: 12px;
                  line-height: 20px;
                  text-align: left;
                "
              >
                {{ item.shipper }}
              </td>
            </tr>
            <tr>
              <th
                style="
                  padding: 8px;
                  font-size: 12px;
                  line-height: 20px;
                  width: 20mm;
                  text-align: right;
                "
              >
                纱牌/纱批
              </th>
              <td
                style="
                  padding: 8px;
                  font-size: 12px;
                  line-height: 20px;
                  text-align: left;
                "
              >
                {{ item.yarnCard }}
              </td>
            </tr>
            <tr>
              <th
                style="
                  padding: 8px;
                  font-size: 12px;
                  line-height: 20px;
                  text-align: right;
                  width: 20mm;
                "
              >
                产品属性
              </th>
              <td
                style="
                  padding: 8px;
                  font-size: 12px;
                  line-height: 20px;
                  text-align: left;
                "
              >
                {{ item.property }}
              </td>
            </tr>
            <tr>
              <th
                style="
                  padding: 8px;
                  font-size: 12px;
                  line-height: 20px;
                  width: 20mm;
                  text-align: right;
                "
              >
                缸号
              </th>
              <td
                style="
                  padding: 8px;
                  font-size: 12px;
                  line-height: 20px;
                  text-align: left;
                "
              >
                {{ item.dyelot }}
              </td>
            </tr>
            <tr>
              <th
                style="
                  padding: 8px;
                  font-size: 12px;
                  line-height: 20px;
                  text-align: right;
                  width: 20mm;
                "
              >
                收货时间
              </th>
              <td
                style="
                  padding: 8px;
                  font-size: 12px;
                  line-height: 20px;
                  text-align: left;
                "
              >
                {{ formatTime(item.sentInFact) }}
              </td>
            </tr>
            <tr>
              <th
                style="
                  padding: 8px;
                  font-size: 12px;
                  line-height: 20px;
                  text-align: right;
                  width: 20mm;
                "
              >
                重量(KG)
              </th>
              <td
                style="
                  padding: 8px;
                  font-size: 12px;
                  line-height: 20px;
                  text-align: left;
                "
              >
                {{ item.weightAvg }}KG
              </td>
            </tr>
            <tr>
              <th
                style="
                  padding: 8px;
                  font-size: 12px;
                  line-height: 20px;
                  text-align: right;
                  width: 20mm;
                "
              >
                球数
              </th>
              <td
                style="
                  padding: 8px;
                  font-size: 12px;
                  line-height: 20px;
                  text-align: left;
                "
              >
                {{ item.ballCountAvg }}
              </td>
            </tr>
            <tr>
              <td
                colspan="2"
                align="center"
                style="
                  padding: 8px;
                  font-size: 12px;
                  line-height: 20px;
                  text-align: left;
                "
              >
                <cs-barcode
                  :options="{
                    value: item.serialNo,
                    height: 50,
                    width: 1.5,
                    textMargin: 5,
                  }"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </cs-print>
    <div
      slot="footer"
      style="
        text-align: center;
        padding: 10px 20px;
        margin: 0 auto;
        width: 80mm;
      "
    >
      <!-- class="footer" -->
      <el-button type="primary" @click="barPrintHandle">打印</el-button>
      <el-button @click="comeBack()">返回</el-button>
    </div>
  </div>
</template>
<script>
import { PublicWms } from '@/views/wms/public/index'
import * as api from './api/index.js'
export default {
  name: 'PrintPostCode',
  components: {},
  mixins: [PublicWms],
  data() {
    return {
      barPrint: false,
      serviceLoading: false,
      postCodeData: [],
      reservationNo: '',
      productType: ''
    }
  },
  created() {
    this.reservationNo = this.$route.query['reservationNo']
    this.productType = this.$route.query['productType'].toString()
    this.reservationNo &&
      this.getProductDetailList({ reservationNo: this.reservationNo })
  },
  methods: {
    formatTime(time) {
      return this.$utils.parseTime(time)
    },
    barPrintHandle() {
      this.barPrint = true
    },
    async getProductDetailList(params = {}) {
      this.serviceLoading = this.$loading({
        lock: true,
        target: 'printMain',
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const res = await api.getProductDetailListData(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data.list
        if (data && data.length > 0) {
          this.postCodeData = data
          this.$nextTick(() => {
            this.serviceLoading.close()
          })
        }
      }
    },
    comeBack() {
      this.$router.push('/wms/enter-manage/booking-manage')
    }
  }
}
</script>
