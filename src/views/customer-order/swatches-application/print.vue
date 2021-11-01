<!--
 * @Author: ll
 * @Date: 2021-01-12 11:09:38
 * @LastEditTime: 2021-01-12 11:17:14
 * @LastEditors: ll
 * @Description: 色板申请打印
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
          <!-- table表格 -->
          <div class="printing-center_table">
            <table class="y_table" cellspacing="0" cellpadding="0">
              <thead>
                <tr>
                  <td>
                    <span>产品信息</span>
                  </td>
                  <td colspan="4" style="text-align: center;">{{ listData.cloth + ' ' + listData.endProductWeight + ' ' + listData.yarnInfo }}</td>
                </tr>
                <tr class="whiteSpace">
                  <td style="min-width: 40px;">
                    <span>序号</span>
                  </td>
                  <td style="min-width: 40px;">
                    <span>对色标准</span>
                  </td>
                  <td style="min-width: 40px;">
                    <span>客户颜色</span>
                  </td>
                  <td style="min-width: 40px;">
                    <span>智布色号</span>
                  </td>
                  <td style="min-width: 80px;">
                    <span>备注</span>
                  </td>
                </tr>
              </thead>
              <tbody v-if="listData.cmColorInfo && listData.cmColorInfo.length">
                <!-- 列表 -->
                <template v-for="(item, index) in listData.cmColorInfo">
                  <tr :key="index" class="dataSource_color">
                    <!-- 序号 -->
                    <td style="width: 64px;">
                      <span>{{ index + 1 }}</span>
                    </td>
                    <!-- 对色标准 -->
                    <td contenteditable>
                      <span>{{ item.colorModelStandard.label || '' }}</span>
                    </td>
                    <!-- 客户颜色 -->
                    <td contenteditable>
                      <span>{{ item.customerColorName || '' }}</span>
                    </td>
                    <!-- 智布色号 -->
                    <td contenteditable>
                      <span>{{ item.fabricColorNo || '' }}</span>
                    </td>
                    <!-- 备注 -->
                    <td contenteditable>
                      <span>{{ item.remark }}</span>
                    </td>
                  </tr>
                </template>
                <!-- 打板信息 -->
                <tr class="print_table_Two">
                  <td rowspan="1" style="width: 64px;">
                    <span class="tableThs">打板信息</span>
                  </td>
                  <!-- 印花颜色名  cellspacing="0" cellpadding="0" -->
                  <td colspan="8" class="print_table_Two_tr">
                    <table class="y_table_link" cellspacing="0" cellpadding="0">
                      <thead />
                      <tbody>
                        <!-- 纱支 -->
                        <tr>
                          <td class="y_table_linktr">
                            <div class="tr_flexd" style="page-break-inside: avoid;">
                              <div class="te_leftr">灯源：</div>
                              <div class="te_right" style="margin-right: 20px;">lst对色光源：{{ listData.lstLightSource.label || '' }}</div>
                              <div class="te_right" style="margin-right: 20px;">2nd对色光源：{{ listData.twondLightSource.label || '' }}</div>
                              <div class="te_right" style="margin-right: 20px;">3nd对色光源：{{ listData.threerdLightSource.label || '' }}</div>
                            </div>
                          </td>
                        </tr>
                        <!-- 印花尺寸 -->
                        <tr>
                          <td class="y_table_linktr">
                            <div class="tr_flexd" style="page-break-inside: avoid;">
                              <div class="te_leftr">送客批色板要求：</div>
                              <div class="te_right" style="margin-right: 20px;">要求尺寸：{{ listData.size || '' }}</div>
                              <div class="te_right" style="margin-right: 20px;">份数：{{ listData.number || '' }}</div>
                            </div>
                          </td>
                        </tr>
                        <!-- 工艺要求 -->
                        <tr>
                          <td>
                            <div class="tr_flexd" style="page-break-inside: avoid;">
                              <div class="te_leftr" style="margin-right: 20px;">工艺要求：{{ listData.craftRequirement || '' }}</div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <!-- 注意事项 -->
                <tr class="print_table_remarks">
                  <td colspan="9" style="page-break-inside: avoid;">
                    <div class="remarks_c1 tableThs">注意事项：</div>
                    <div contenteditable class="remarks_c2">{{ listData.precautions }}</div>
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
import prinTop from './components/prinTop.vue'
import prinBottom from './components/prinBottom.vue'
import { pagePrint } from './api/index.js'
export default {
  components: {
    prinTop,
    prinBottom
  },
  data() {
    return {
      DataTotal: false,
      qrPrint: false,
      logo,
      listData: {
        test: '1',
        test1: '2'
      }
    }
  },
  created() {
    const sIndex = this.$route.hasOwnProperty('query') && this.$route.query.id
    if (sIndex) {
      this.getListData({ id: sIndex })
    }
  },
  methods: {
    // 获取列表数据
    async getListData(data = 0) {
      const res = await pagePrint(data)
      if (res.data === null || !Object.keys(res.data).length) {
        this.listData = {}
      } else {
        this.listData = res.data
        this.setPrintData(this.listData)
      }
    },
    setPrintData(data) {
      this.listData.cloth = data.cloth && data.cloth.label ? data.cloth.label : ''
      this.listData.endProductWeight = data.endProductWeight ? data.endProductWeight + 'g/㎡' : ''
      if (data.cmYarnUsed && data.cmYarnUsed.length) {
        const yarnUsedArr = []
        data.cmYarnUsed.forEach(item => {
          item.info = (item.yarn && item.yarn.label ? item.yarn.label : '') + ' ' + (item.element && item.element.label ? item.element.label : '') + ' ' + (item.spinningMethod && item.spinningMethod.label ? item.spinningMethod.label : '') + ' ' + item.elementScale + ' ' + item.yarnScale + '%'
          // item.info = item.yarn.label + ' ' + item.element.label + ' ' + item.spinningMethod.label + ' ' + item.elementScale + ' ' + item.yarnScale + '%'
          yarnUsedArr.push(item.info)
        })
        this.listData.yarnInfo = yarnUsedArr.join('+')
      } else {
        this.listData.yarnInfo = ''
      }
      if (data.craftRequirementList && data.craftRequirementList.length) {
        const arr = []
        data.craftRequirementList.forEach(item => {
          arr.push(item.name)
          this.listData.craftRequirement = arr.join('、')
        })
      }
      if (data.checkRequirementList && data.checkRequirementList.length) {
        const sizeArr = []
        const numArr = []
        data.checkRequirementList.forEach(item => {
          sizeArr.push(item.size)
          numArr.push(item.number)
        })
        this.listData.size = sizeArr.join(' ')
        this.listData.number = numArr.join(' ')
      }
    },
    qrPrintHandle() {
      this.qrPrint = true
    },
    pintBack() {
      window.close()
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
