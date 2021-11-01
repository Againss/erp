<template>
  <div
    v-if="postCodeData.length"
    id="printMain"
    class="print-main splitPrint"
  >
    <form-title
      :options="{
        title: '打印贴码',
        formStyle: {
          textAlign: 'center',
          display: 'block',
          lineHeight: '55px',
          backgroundColor: '#ffffff',
        },
      }"
    />
    <cs-print
      :print.sync="barPrint"
      :orientation="'p'"
      :interval="500"
      :format="'a6'"
    >
      <!-- 布贴码 -->
      <template v-if="productType == 1">
        <table
          v-for="(item, index) in postCodeData"
          :key="item + index"
          class="pring-post-code-table"
        >
          <tbody>
            <tr>
              <th>
                <!--    <span class="number">{{ ++index }}</span> -->
              </th>
              <td>{{ name }}</td>
            </tr>
            <tr>
              <th>产品属性</th>
              <td>{{ item.property }}</td>
            </tr>
            <tr>
              <th>缸号</th>
              <td>{{ item.dyelot }}</td>
            </tr>
            <tr>
              <th>成品颜色</th>
              <td>{{ item.color }}</td>
            </tr>
            <tr>
              <th>印花颜色</th>
              <td>{{ item.printing }}</td>
            </tr>
            <tr>
              <th>拣货时间</th>
              <td>{{ formatTime(item.pickCompleteTime) }}</td>
            </tr>
            <tr>
              <th>重量(KG)</th>
              <td>{{ item.weightOutFact }}</td>
            </tr>
            <tr>
              <td colspan="2" align="center">
                <cs-barcode
                  :options="{
                    value: item.serialSubNo,
                    height: 50,
                    width: 1.2,
                    textMargin: 5,
                  }"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <!-- 纱贴码 -->
      <template v-else-if="productType == 2">
        <table
          v-for="(item, index) in postCodeData"
          :key="item + index"
          class="pring-post-code-table"
        >
          <tbody>
            <tr>
              <th>
                <span class="number">{{ ++index }}</span>
              </th>
              <td>{{ name }}</td>
            </tr>
            <tr>
              <th>纱牌/纱批</th>
              <td>{{ item.yarnCard }}</td>
            </tr>
            <tr>
              <th>纱别属性</th>
              <td>{{ item.property }}</td>
            </tr>
            <tr>
              <th>缸号</th>
              <td>{{ item.dyelot }}</td>
            </tr>
            <tr>
              <th>拣货时间</th>
              <td>{{ formatTime(item.pickCompleteTime) }}</td>
            </tr>
            <tr>
              <th>重量(KG)</th>
              <td>{{ item.weightOutFact }}KG</td>
            </tr>
            <tr>
              <th>球数</th>
              <td>{{ item.ballCountFact }}</td>
            </tr>
            <tr>
              <td colspan="2" align="center">
                <cs-barcode
                  :options="{
                    value: item.serialSubNo,
                    height: 50,
                    width: 1.2,
                    textMargin: 5,
                  }"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </cs-print>
    <div slot="footer" class="footer">
      <el-button type="primary" @click="barPrintHandle">打印</el-button>
      <el-button @click="backPage">返回</el-button>
    </div>
  </div>
</template>
<script>
import { PublicWms } from '@/views/wms/public/index'
import FormTitle from '@/views/wms/public/components/formTitle'
import { picking } from './index.js'
export default {
  name: 'PrintPostCode',
  components: {
    FormTitle
  },
  mixins: [PublicWms, picking],
  data() {
    return {
      barPrint: false,
      serviceLoading: false,
      postCodeData: [],
      reservationNo: ''
    }
  },
  computed: {
    name() {
      return this.$route.query.name
    }
  },
  created() {
    const fn = (data) => {
      console.log(data.list, 'data')
      this.postCodeData = data.list || []
    }
    this.getSplitDetail({ outPickSubNo: this.id }, fn)
  },
  methods: {
    formatTime(time) {
      return this.$utils.parseTime(time)
    },
    barPrintHandle() {
      this.barPrint = true
    }
  }
}
</script>
<style type="text/css" scoped>
.print-main,
.footer,
.pring-post-code-table {
  width: 80mm;
  margin-left: 0;
  margin-right: 0;
}
.print-main {
  margin-left: 0;
  margin-right: 0;
  margin-top: 20px;
  font-size: 12px;
}
.print-main .number {
  font-weight: 600;
  font-size: 15px;
}
.pring-post-code-table {
  margin-bottom: 10px;
  padding: 10px;
  margin-left: 0;
  margin-right: 0;
  text-align: center;
}
.print-main .footer,
.print-main .pring-post-code-table {
  background-color: #ffffff;
}
.print-main .pring-post-code-table th {
  font-weight: 500;
}
.pring-post-code-table td,
.pring-post-code-table th {
  padding: 8px;
  font-size: 12px;
  line-height: 20px;
  font-weight: 500;
}
.pring-post-code-table th {
  width: 20mm;
  text-align: right;
}
.pring-post-code-table td {
  text-align: left;
}

.print-main .footer {
  text-align: center;
  padding: 10px 20px;
}
</style>
