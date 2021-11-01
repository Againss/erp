<!--
 * @Author: xj
 * @Description: 印 花 SO 申 请 单打印界面
 * @Date: 2020-12-11 10:07:06
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-22 14:58:58
-->
<template>
  <div class="print-tableout">
    <cs-print :print.sync="qrPrint" :interval="50" :format="'a4'">
      <template v-slot:header>
        <div style="width: 210mm;height: 20px;" />
      </template>
      <div class="print-Oneindex">
        <div class="printing-top">
          <div class="printing-img" />
          <div class="printing-top-text">
            <div class="Toph1">佛山市智布互联纺织有限公司</div>
            <div class="Toph2">Foshan Smart Fabric Textile Co., Ltd</div>
          </div>
        </div>
        <div class="printing-center">
          <template v-if="listData&&Object.keys(listData).length ">
            <prin-top :data-array="listData" />
          </template>
          <!-- 表格组件 -->
          <div class="printing-center_table" style="">
            <!-- 列表  border="1"  cellspacing="0" cellpadding="0"-->
            <table class="y_table" cellspacing="0" cellpadding="0">
              <thead>
                <tr class="whiteSpace">
                  <td class="y_tab120" style="min-width: 68px;">
                    <span>序号</span>
                  </td>
                  <td style="min-width: 70px;">
                    <span>印花颜色名</span>
                  </td>
                  <td style="min-width: 70px;">
                    <span>印花底色</span>
                  </td>
                  <td style="min-width: 70px;">
                    <span>布类</span>
                  </td>
                  <td style="min-width: 60px;">
                    <span>纱支</span>
                  </td>
                  <td style="min-width: 70px;">
                    <span>成品克重</span>
                  </td>
                  <td style="min-width: 60px;">
                    <span>成份</span>
                  </td>
                  <td style="min-width: 70px;">
                    <span>智布花号</span>
                  </td>
                  <td style="width:70px">
                    <span>印花图案</span>
                  </td>
                </tr>
              </thead>
              <tbody>
                <!-- 列表 -->
                <template v-for="(item, index) in dataSource">
                  <tr :key="index" class=" dataSource_color">
                    <!-- 序号 -->
                    <td style="width: 64px;">
                      <span>{{ index + 1 }}</span>
                    </td>
                    <!-- 印花颜色名 -->
                    <td>
                      <span>{{ item.printColorName }}</span>
                    </td>
                    <!-- 印花底色 -->
                    <td>
                      <span>{{ item.printBaseColor }}</span>
                    </td>
                    <!--布类-->
                    <td>
                      <span>{{ item.clothName }}</span>
                    </td>
                    <!--纱支 -->
                    <td>
                      <span>{{ item.yarn }}</span>
                    </td>
                    <!-- 成品克重 -->
                    <td>
                      <span>{{ item.finishedProductWeightName }}</span>
                    </td>
                    <!-- 成份 -->
                    <td>
                      <span>{{ item.composition }}</span>
                    </td>
                    <!-- 智布花号 -->
                    <td style="min-width: 70px;">
                      <span>{{ item.fabricFlowerNo }}</span>
                    </td>
                    <!-- 印花图案 -->
                    <td style="width:70px">
                      <div v-if="item.printColorDesign&&item.printColorDesign!==null" style="text-align: center;">
                        <img :src="getImgs(item.printColorDesign)" class="sidebar-logo" alt="图片损坏">
                      </div>
                    </td>
                  </tr>
                </template>
                <!-- 打板信息 -->
                <tr class="print_table_Two" style="">
                  <!-- 序号 -->
                  <td rowspan="1" style="width: 64px; ">
                    <span class="tableThs">打板信息</span>
                  </td>
                  <!-- 印花颜色名  cellspacing="0" cellpadding="0" -->
                  <td colspan="8" class="print_table_Two_tr" style="">
                    <table class="y_table_link" cellspacing="0" cellpadding="0">
                      <thead />
                      <tbody>
                        <tr> <!--纱支 -->
                          <td class="y_table_linktr">
                            <div class="tr_flexd" style="page-break-inside: avoid;">
                              <div class="te_leftr" style="margin-right: 20px;">1st对色光源：{{ listData.lstLightSourceName }}</div>
                              <div class="te_right">2nd对色光源：{{ listData.twondLightSourceName }}</div>
                            </div>
                          </td>
                        </tr>
                        <tr> <!--印花尺寸-->
                          <td class="y_table_linktr">
                            <div class="tr_flexd" style="page-break-inside: avoid;">
                              <div class="te_leftr">印花尺寸：</div>
                              <div class="te_right">{{ listData.printSize }}</div>
                            </div>

                          </td>
                        </tr>
                        <tr><!--出版格式 -->
                          <td>
                            <div class="tr_flexd" style="page-break-inside: avoid;">
                              <div class="te_leftr">出版格式：</div>
                              <div class="te_right">{{ listData.printScheme===1?"指定格式":"工厂格式" }}</div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <!-- 印花底色 -->
                </tr>
                <!-- 注意事项： -->
                <tr class="print_table_remarks">
                  <td colspan="9" style="page-break-inside: avoid;">
                    <div class="remarks_c1 tableThs">注意事项：</div>
                    <div class="remarks_c2">{{ listData.precautions }}</div>
                  </td>
                </tr>
              </tbody>

            </table>
          </div>
        </div>
        <div>
          <template v-if="listData&&Object.keys(listData).length ">
            <prin-bottom :data-bott="listData" />
          </template>
        </div>
      </div>
    </cs-print>
    <div style="width: 100%;height: 15px;" />
    <div class="print-foot">
      <el-button @click="qrPrintHandle">打印</el-button>
      <el-button @click="pintBack">关闭</el-button>
    </div>
  </div>
</template>
<script>
import logo from '@/assets/images/logo.png'
import { sysCancelPrint } from './api/index.js'
import prinTop from './component/prinTop.vue'
import prinBottom from './component/prinBottom.vue'
export default {
  components: {
    prinTop,
    prinBottom
  },
  data() {
    return {
      dataSource: [],
      DataTotal: false,
      qrPrint: false,
      logo,
      listData: {}
    }
  },
  created() {
    const sIndex = this.$route.hasOwnProperty('query') && this.$route.query.id
    if (sIndex) {
      this.getListData({ id: sIndex })
    }
  },
  mounted() {},
  methods: {
    // 获取列表数据
    async getListData(data = 0) {
      const res = await sysCancelPrint(data)
      if (res.data === null || !Object.keys(res.data).length) {
        this.listData = {}
        this.dataSource = []
      } else {
        this.listData = res.data
        this.dataSource = res.data.info || []
      }
    },
    qrPrintHandle() {
      this.qrPrint = true
    },
    pintBack() {
      const sIndex = this.$route.hasOwnProperty('query') && this.$route.query.id
      if (sIndex) {
        this.$router.push(`/customer-order/analysis-application/printing-application/detail/${sIndex}/show`)
      }
    },
    // 印花版本
    getImgs(data) {
      const url = 'https://oss-exhibition.sfabric.com/'
      return data ? url + data : ''
    }
  }
}
</script>
<style lang="scss">
  .print-tableout{
    box-sizing: border-box;
    margin:20px;
    width: 210mm;
      background: #fff;
  }
  .print-Oneindex{// 头部
      // background: #fff;
      padding-top: 5px;
      .printing-top{
        width: 210mm;
        position: relative;
        border-bottom: 1px solid #BAC4CC;
        margin-top: 2px;
        .printing-img{
          background: url("../../../assets/images/logo.png") no-repeat center center;
          background-size: contain;
          width: 33px;
          height: 31px;
          vertical-align: middle;
          position: absolute;
          left: 21px;
          top: 5px;
        }
        .printing-top-text{
          font-size: 18px;
          text-align: left;
          line-height: 20px;
          margin-left: 69px;
          .Toph1{
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #151222;
          }
          .Toph2{
            font-family: PingFangSC-Regular;
            font-size: 10px;
            margin-bottom: 8px;
            color: #828282;
          }
        }
      }
      //内容页
      .printing-center{
        width: 210mm;
        padding: 0 10px;
        .y_table {
          width: 100% !important;
          margin: 2px 0 6px 0;
          clear: both;
          width: 100%;
          border-right: 1px solid #D2D2D3;
          border-bottom: 1px solid #D2D2D3;
          td {
            font-weight: normal;
            height: 30px;
            font-size: 12px;
            .sidebar-logo{
              width: 40px;
              margin: auto;
              display: block;
              font-size: 0;
            }
          }
          span {
            display: block;
            padding: 2px 3px;
            word-wrap: break-word;
            word-break: normal;
            max-width: 200px;
          }
          .print_table_Two{
            .print_table_Two_tr{
              div{
                min-height: 22px;
                line-height: 22px;
              }
              .tr_flexd{
                display: flex;
                color: #4D4D4D;
                padding: 8px 0;
                font-family: PingFangSC-Medium;
                .te_leftr{
                  width: auto;
                  margin-left: 10px;
                }
                .te_right{
                  max-width: 550px;
                  overflow: hidden;
                }
              }
            }
          }
          .print_table_remarks{
              .remarks_c1{
                height: 24px;
                line-height: 24px;
                padding: 0 10px 10px 10px;
              }
              .remarks_c2{
                line-height: 20px;
                color: #4D4D4D;;
                font-family: PingFangSC-Medium;
                padding: 0 10px 10px 10px;
              }
          }
        }
      }
  }
  .print-foot{
    background: #eef5f9;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .whiteSpace span,.tableThs{
    color: #151222;
    font-family: PingFangSC-Medium;
  }
  .dataSource_color span,.tabletds{
    color: #4D4D4D;;
    font-family: PingFangSC-Medium;
  }
  .page-break { page-break-inside: avoid; page-break-before: always; }
  .y_table>thead>tr>td,.y_table>tbody>tr>td{
    // border: 1px solid #D2D2D3;
    border-left: 1px solid #D2D2D3;
    border-top: 1px solid #D2D2D3;
  }
  .y_table,.y_table_link{
    // border-collapse: collapse;
  }
  .y_table_link{
    width: 100%;
     tr{
       td,th{
         border:none;
       }
       .y_table_linktr{
         border-bottom: 1px solid #D2D2D3;
       }
     }
  }
</style>
