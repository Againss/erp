<!--
 * @name: 标签打印
 * @description: 标签打印
 * @author: panmr
 * @time: 2021-05-29 13:43:02
-->
<template>
  <div class="CuttingClothPrint">
    <div style="width: 100mm;margin-top: 20px;font-size: 12px;margin-left: auto;margin-right: auto;box-sizing: border-box;">
      <cs-print
        :print.sync="qrPrint"
        :orientation="'p'"
        :interval="500"
        :format="'a6'"
      >
        <template class="cutting_wrap">
          <table v-for="(k, index) in labels" :key="index" style="margin-bottom: 10px; padding: 10px;margin-left: 0; margin-right: 0; text-align: center;background: #fff; width: 100mm;" cellspacing="0" cellpadding="0">
            <tbody v-if="k.tagLanguage === 1">
              <tr>
                <td colspan="7" style="border: 1px solid #d0d8e0;border-bottom: none;text-align: center; font-size: 14px;font-weight: bold;padding: 3px"><span>智布互联纺织有限公司</span></td>
              </tr>
              <tr>
                <th style="font-size: 11px;line-height: 20px;height: 20px;width: 28mm;text-align: left;padding-left: 5px; border: 1px solid #d0d8e0;border-bottom: none;">布类</th>
                <td style="font-size: 11px;text-align: left;padding-left: 5px;border: 1px solid #d0d8e0;border-bottom: none;border-left: none;">{{ k.clothName }}</td>
              </tr>
              <tr>
                <th style="font-size: 11px;line-height: 20px;height: 20px;width: 28mm;text-align: left;padding-left: 5px; border: 1px solid #d0d8e0;border-bottom: none;">用纱信息</th>
                <td style="font-size: 11px;text-align: left;padding-left: 5px;border: 1px solid #d0d8e0;border-bottom: none;border-left: none;">{{ k.yarnInfo }}</td>
              </tr>
              <tr>
                <th style="font-size: 11px;line-height: 20px;height: 20px;width: 28mm;text-align: left;padding-left: 5px; border: 1px solid #d0d8e0;border-bottom: none;">成份</th>
                <td style="font-size: 11px;text-align: left;padding-left: 5px;border: 1px solid #d0d8e0;border-bottom: none;border-left: none;">{{ k.elementName }}</td>
              </tr>
              <tr>
                <th style="font-size: 11px;line-height: 20px;height: 20px;width: 28mm;text-align: left;padding-left: 5px; border: 1px solid #d0d8e0;border-bottom: none;">来源单号</th>
                <td style="font-size: 11px;text-align: left;padding-left: 5px;border: 1px solid #d0d8e0;border-bottom: none;border-left: none;">{{ k.sourceNumber }}</td>
              </tr>
              <tr>
                <th style="font-size: 11px;line-height: 20px;height: 20px;width: 28mm;text-align: left;padding-left: 5px; border: 1px solid #d0d8e0;border-bottom: none;">缸号</th>
                <td style="font-size: 11px;text-align: left;padding-left: 5px;border: 1px solid #d0d8e0;border-bottom: none;border-left: none;">{{ k.cylinderNumber }}</td>
              </tr>
              <tr>
                <th style="font-size: 11px;line-height: 20px;height: 20px;width: 28mm;text-align: left;padding-left: 5px; border: 1px solid #d0d8e0;border-bottom: none;">颜色</th>
                <td style="font-size: 11px;text-align: left;padding-left: 5px;border: 1px solid #d0d8e0;border-bottom: none;border-left: none;">{{ k.customerColor }}</td>
              </tr>
              <tr>
                <th style="font-size: 11px;line-height: 20px;height: 20px;width: 28mm;text-align: left;padding-left: 5px; border: 1px solid #d0d8e0;border-bottom: none;">幅宽</th>
                <td style="font-size: 11px;text-align: left;padding-left: 5px;border: 1px solid #d0d8e0;border-bottom: none;border-left: none;">{{ k.suggestWidth + ' ' + k.suggestWidthUnit }}</td>
              </tr>
              <tr>
                <th style="font-size: 11px;line-height: 20px;height: 20px;width: 28mm;text-align: left;padding-left: 5px; border: 1px solid #d0d8e0;border-bottom: none;">克重</th>
                <td style="font-size: 11px;text-align: left;padding-left: 5px;border: 1px solid #d0d8e0;border-bottom: none;border-left: none;">{{ k.suggestWeight + ' ' + k.suggestWeightUnit }}</td>
              </tr>
              <tr>
                <th style="font-size: 11px;line-height: 20px;height: 20px;width: 28mm;text-align: left;padding-left: 5px; border: 1px solid #d0d8e0;">日期</th>
                <td style="font-size: 11px;text-align: left;padding-left: 5px;border: 1px solid #d0d8e0;border-left: none;">{{ parseTime(Date.now(), '{y}-{m}-{d}') }}</td>
              </tr>
              <tr>
                <td colspan="2" align="center" style="padding-top:5px">
                  <cs-barcode :options="{ value: k.receiveCode, height: 25 }" />
                </td>
              </tr>
            </tbody>
            <tbody v-if="k.tagLanguage === 2">
              <tr>
                <td colspan="7" style="border: 1px solid #d0d8e0;border-bottom: none;text-align: center; font-size: 14px;font-weight: bold;padding: 3px"><span>SMART FABRIC TECHNOLOGY SERVICE</span></td>
              </tr>
              <tr>
                <th style="font-size: 11px;line-height: 20px;height: 20px;width: 28mm;text-align: left;padding-left: 5px; border: 1px solid #d0d8e0;border-bottom: none;">Fabric</th>
                <td style="font-size: 11px;text-align: left;padding-left: 5px;border: 1px solid #d0d8e0;border-bottom: none;border-left: none;">{{ k.clothName }}</td>
              </tr>
              <tr>
                <th style="font-size: 11px;line-height: 20px;height: 20px;width: 28mm;text-align: left;padding-left: 5px; border: 1px solid #d0d8e0;border-bottom: none;">Yarn Info.</th>
                <td style="font-size: 11px;text-align: left;padding-left: 5px;border: 1px solid #d0d8e0;border-bottom: none;border-left: none;">{{ k.yarnInfo }}</td>
              </tr>
              <tr>
                <th style="font-size: 11px;line-height: 20px;height: 20px;width: 28mm;text-align: left;padding-left: 5px; border: 1px solid #d0d8e0;border-bottom: none;">Fab Content</th>
                <td style="font-size: 11px;text-align: left;padding-left: 5px;border: 1px solid #d0d8e0;border-bottom: none;border-left: none;">{{ k.elementName }}</td>
              </tr>
              <tr>
                <th style="font-size: 11px;line-height: 20px;height: 20px;width: 28mm;text-align: left;padding-left: 5px; border: 1px solid #d0d8e0;border-bottom: none;">Order No.</th>
                <td style="font-size: 11px;text-align: left;padding-left: 5px;border: 1px solid #d0d8e0;border-bottom: none;border-left: none;">{{ k.sourceNumber }}</td>
              </tr>
              <tr>
                <th style="font-size: 11px;line-height: 20px;height: 20px;width: 28mm;text-align: left;padding-left: 5px; border: 1px solid #d0d8e0;border-bottom: none;">Batch No.</th>
                <td style="font-size: 11px;text-align: left;padding-left: 5px;border: 1px solid #d0d8e0;border-bottom: none;border-left: none;">{{ k.cylinderNumber }}</td>
              </tr>
              <tr>
                <th style="font-size: 11px;line-height: 20px;height: 20px;width: 28mm;text-align: left;padding-left: 5px; border: 1px solid #d0d8e0;border-bottom: none;">Color</th>
                <td style="font-size: 11px;text-align: left;padding-left: 5px;border: 1px solid #d0d8e0;border-bottom: none;border-left: none;">{{ k.customerColor }}</td>
              </tr>
              <tr>
                <th style="font-size: 11px;line-height: 20px;height: 20px;width: 28mm;text-align: left;padding-left: 5px; border: 1px solid #d0d8e0;border-bottom: none;">Fabric Width</th>
                <td style="font-size: 11px;text-align: left;padding-left: 5px;border: 1px solid #d0d8e0;border-bottom: none;border-left: none;">{{ k.suggestWidth + ' ' + k.suggestWidthUnit }}</td>
              </tr>
              <tr>
                <th style="font-size: 11px;line-height: 20px;height: 20px;width: 28mm;text-align: left;padding-left: 5px; border: 1px solid #d0d8e0;border-bottom: none;">Fabric Weight</th>
                <td style="font-size: 11px;text-align: left;padding-left: 5px;border: 1px solid #d0d8e0;border-bottom: none;border-left: none;">{{ k.suggestWeight + ' ' + k.suggestWeightUnit }}</td>
              </tr>
              <tr>
                <th style="font-size: 11px;line-height: 20px;height: 20px;width: 28mm;text-align: left;padding-left: 5px; border: 1px solid #d0d8e0;">Date</th>
                <td style="font-size: 11px;text-align: left;padding-left: 5px;border: 1px solid #d0d8e0;border-left: none;">{{ parseTime(Date.now(), '{y}-{m}-{d}') }}</td>
              </tr>
              <tr>
                <td colspan="2" align="center" style="padding-top:5px">
                  <cs-barcode :options="{ value: k.receiveCode, height: 25 }" />
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </cs-print>
    </div>
    <div slot="footer" style="text-align: center; padding: 10px 20px;margin: 0 auto; width: 100mm;">
      <el-button type="primary" @click="qrPrintHandle">打印</el-button>
      <el-button @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
// import prinTop from './component/prinTop'
// import prinBottom from './component/prinBottom.vue'
// import { getDetail } from './api/index.js'
// import { isArray } from '@/utils/validate'
import { printLabel } from '../api/index'
import { parseTime } from '@/utils'
export default {
  components: {
    // prinTop,
    // prinBottom
  },
  data() {
    return {
      qrPrint: false,
      labels: []
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    if (this.$route.query.receiveCodes) {
      this.load(this.$route.query.receiveCodes)
    }
  },
  mounted() {},
  methods: {
    goBack() {
      this.$router.push({ path: '/customer-order/board-application-list' })
    },
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    },
    qrPrintHandle() {
      this.qrPrint = true
    },
    async load(receiveCodes) {
      const { code = 0, data = [] } = await printLabel({ receiveCodes: receiveCodes.split(',') })
      if (code === 200) {
        this.labels = data
      }
    },
    // 初始化 加载数据
    init(arr = []) {
      this.labels = arr
    }
  }
}
</script>

<style lang="scss" scoped>
.print-tableouts{
  box-sizing: border-box;
  margin:20px;
  //padding: 10mm;
  width: 400px;
  background: #fff;
  font-family: 'Arial';
  font-size: 11px;
}
.print-Oneindexs{// 头部
  width: 120mm;
  height: 80mm;
  //margin: 10px;
  font-family: 'Arial';
  font-size: 11px;
  .printing-tops{
    width: 100mm;
    padding: 10px;
    .printing_top_h4{
      font-family: SourceHanSansCN-Bold;
      font-size: 11px;
      color: #151222;
      letter-spacing: 0;
      text-align: right;
      width: 100%;
      text-align: center;
      //padding: 17px 0 17px 0;
      font-weight: bold;
    }
    .y_table{
      clear: both;
      //width: 100%;
      width: 100mm;
      border-right: 1px solid #D2D2D3;
      border-bottom: 1px solid #D2D2D3;
      td {
        font-weight: normal;
        //height: 10px;
        font-size: 11px;
        //padding: 3px;
        min-width: 50px;
      }
    }
    .printing_table1_h5{
      font-size: 16px;
      color: #151222;
      letter-spacing: 0;
      padding: 10px;
      border-left: 1px solid #D2D2D3;
      border-right: 1px solid #D2D2D3;
      box-sizing: border-box;
      margin-right: 1px;
      font-weight: bold;
    }
    .printing_table1{
      td {
        span{
          display: block;
          word-break: break-all;
        }
        .span_x1{
          min-width: 50px;
        }
        .span_x2{
          min-width: 121px;
        }
        .span_x3{
          padding: 0px 3px;
          min-width: 240px;
        }
      }
    }
    .printing_table2{
      td {
        span{
          display: block;
          word-break: break-all;
        }
        .span_xm1{
          min-width: 50px;
        }
        .span_xm2{
          min-width: 121px;
        }
        .span_xm3{
          min-width: 240px;
        }
      }
    }

    .printing_table3{
      .table3_tr{
        td{text-align: left;}
      }
      td{
        padding: 0 6px;
        span{
          line-height: 16px;
          padding: 3px 0;
          display: block;
        }
      }
    }
    .printing_table4{
      td{
        padding: 0 6px;
      }
    }
    .printing_table5{
      .title-info{
        display: flex;
        font-size: 12px;
        border: 1px solid #D2D2D3;
        font-weight: normal;
        height: 30px;
        line-height: 30px;
        margin-right: 1px;
        border-bottom: none;
        .title-info_pl{
          flex: 1;
          display: flex;
          .pl_one{
            width: 66px;
            border-left:1px solid #D2D2D3 ;
            border-right:1px solid #D2D2D3;
            padding: 0 8px;
            text-align: center;
          }
          .pl_one2{
            border-left:none;
            width: 42px;
            padding: 0 4px;
          }
          .pl_two{
            flex: 1;
            padding: 0 5px;
          }
        }
      }
    }
    .printing_table7,.printing_table6{
      font-size: 12px;
      .y_table{
        border-bottom:none;
        td{
          min-width: 20px;

          span{
            display: block;
            text-align: center;
            padding: 3px 0px;
            word-break: break-all;
          }
        }
        .line_45px{
          width: 37px;
          padding: 0 4px;
        }
      }
    }
    .printing_table8{
      .table7_h2{
        width: 85px;
        text-align: center;
        height: 150px;
      }
      td{
        padding: 6px;
        span{
          word-break: break-all;
          line-height: 18px;
          display: block;
        }
      }
      .table8_h4{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 255px;
        height: 255px;
        border: 1px dashed  #D2D2D3 ;
        margin: 0 auto;
        .table8_h5{
          font-family: SourceHanSansCN-Normal;
          font-size: 12px;
          color: #BBC2D0;
          letter-spacing: 0;
          text-align: center;
          line-height: 16px;
        }
      }
    }
  }
}
.print-foots{
  //background: #eef5f9;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.y_table>thead>tr>td,.y_table>tbody>tr>td{
  border-left: 1px solid #D2D2D3;
  border-top: 1px solid #D2D2D3;
}
.tle{
  display: block;
  text-align: justify;
  text-align-last: justify;
  padding: 3px 0px;
  width: 75px;
  margin: auto;
}
.tbk{
  display: block;
  text-align: center;
  text-align-last: center;
  padding-bottom: 3px;
  width: 50px;
  margin: auto;
}
.tle2{width: 60px;}
.te{display: block;text-align: center;}
.lineTd {
  position: relative;
  .lineTd_xian{
    position: absolute;
    width: 50px;
    height: 1px;
    background: #D2D2D3;
    -webkit-transform: rotate(45deg);
    transform: rotate(35deg);
    left: -4px;
    top: 14px;
  }
}
</style>
