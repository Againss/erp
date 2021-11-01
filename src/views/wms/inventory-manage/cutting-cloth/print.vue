<template>
  <div class="CuttingClothPrint">
    <div
      style="
        width: 100mm;
        margin-top: 20px;
        font-size: 12px;
        margin-left: 0;
        margin-right: 0;
        box-sizing: border-box;
      "
    >
      <cs-print
        :print.sync="print"
        :orientation="'p'"
        :interval="500"
        :format="'a6'"
      >
        <template class="cutting_wrap">
          <table
            v-for="(k, index) in list"
            :key="index"
            style="
            margin-bottom: 10px;
            padding: 10px;
            margin-left: 0;
            margin-right: 0;
            text-align: center;
            background: #fff;
            width: 100mm;
          "
            cellspacing="0"
            cellpadding="0"
          >
            <tbody>
              <tr>
                <th
                  style="
                  font-size: 12px;
                  line-height: 20px;
                  height: 20px;
                  width: 28mm;
                  text-align: left;
                  padding-left: 5px;
                  border: 1px solid #d0d8e0;
                  border-bottom: none;
                "
                >订单号</th>
                <td
                  style="
              text-align: left;
              padding-left: 5px;
              border: 1px solid #d0d8e0;
              border-bottom: none;
              border-left: none;"
                >{{ k.cutOrderNo }}</td>
              </tr>
              <tr>
                <th
                  style="
                  padding: 5px;
                  font-size: 12px;
                  line-height: 15px;
                  width: 28mm;
                  text-align: left;
                  border: 1px solid #d0d8e0;
                "
                >产品属性</th>
                <td
                  style="height: 60px;
              text-align: left;
              padding-left: 5px;
              border: 1px solid #d0d8e0;
              border-left: none;"
                >
                  {{ k.productAttributes }}
                </td>
              </tr>
              <tr>
                <th
                  style="
                  padding: 5px;
                  font-size: 12px;
                  line-height: 15px;
                  width: 28mm;
                  text-align: left;
                  border: 1px solid #d0d8e0;
                  border-top: none;
                "
                >剪版数量/ 单位</th>
                <td
                  style="
              text-align: left;
              padding-left: 5px;
              border: 1px solid #d0d8e0;
              border-top: none;
              border-left: none;"
                >{{ `${k.numberOfCut}/${k.numberOfCutUnit}` }}</td>
              </tr>
              <tr>
                <th
                  style="
                  padding: 5px;
                  font-size: 12px;
                  line-height: 15px;
                  width: 28mm;
                  text-align: left;
                  border: 1px solid #d0d8e0;
                  border-top: none;
                "
                >重量 (KG)</th>
                <td
                  style="
              text-align: left;
              padding-left: 5px;
              border: 1px solid #d0d8e0;
              border-top: none;
              border-left: none;"
                >{{ k.weight }}</td>
              </tr>
              <tr>
                <th
                  style="
                  padding: 5px;
                  font-size: 12px;
                  line-height: 15px;
                  width: 28mm;
                  text-align: left;
                  border: 1px solid #d0d8e0;
                  border-top: none;
                "
                >条码号</th>
                <td
                  style="
              text-align: left;
              padding-left: 5px;
              border: 1px solid #d0d8e0;
              border-top: none;
              border-left: none;"
                >{{ k.barCode }}</td>
              </tr>
              <tr>
                <th
                  style="
                  padding: 5px;
                  font-size: 12px;
                  line-height: 15px;
                  width: 28mm;
                  text-align: left;
                  border: 1px solid #d0d8e0;
                  border-top: none;
                "
                >库位号</th>
                <td
                  style="
              text-align: left;
              padding-left: 5px;
              border: 1px solid #d0d8e0;
              border-top: none;
              border-left: none;"
                >{{ k.locationCode }}</td>
              </tr>
              <tr>
                <th
                  style="
                  padding: 5px;
                  font-size: 12px;
                  line-height: 15px;
                  width: 28mm;
                  text-align: left;
                  border-bottom: 1px solid #d0d8e0;
                  border-right: 1px solid #d0d8e0;
                  border-left: 1px solid #d0d8e0;
                  border-top: none;
                "
                >剪布要求</th>
                <td
                  style="
              height: 240px;
              text-align: left;
              padding-left: 5px;
              font-size: 13px;
              border-bottom: 1px solid #d0d8e0;
              border-right: 1px solid #d0d8e0;
              border-top: none;
              border-left: none;"
                >{{ k.remark }}</td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  align="center"
                >
                  <cs-barcode
                    :options="{
                      value: k.printLabelNo,
                      height: 50,
                      width: 1.8,
                      textMargin: 2,
                      margin: 8,
                      fontSize: 20
                    }"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </cs-print>
    </div>
    <div
      slot="footer"
      style="
        text-align: center;
        padding: 10px 20px;
        margin: 0 auto;
        width: 100mm;
      "
    >
      <el-button type="primary" @click="print = true">打印</el-button>
      <el-button @click="comeBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import * as api from './api/index.js'
export default {
  name: 'CuttingClothPrint',
  data() {
    return {
      print: false,
      list: []
    }
  },
  computed: {
    cutClothNo() {
      return this.$route.query.cutClothNo
    }
  },
  created() {
    this.getPage()
  },
  methods: {
    async getPage() {
      const list = await api.infoList({ cutClothNo: this.cutClothNo })
      if (list.code === 200) {
        this.list = list.data || []
      }
    },
    // 返回到详情页面
    comeBack() {
      this.$router.push({
        path: '/wms/inventory-manage/cutting-cloth/detail',
        query: {
          cutClothNo: this.cutClothNo,
          status: 0,
          timestamp: new Date().getTime()
        }
      })
    }
  }
}
</script>

<style scoped lang='scss'>

</style>
