<!--
 * @Author: xj
 * @Description: 客样分析打印界面
 * @Date: 2020-12-30 09:40:26
 * @LastEditors: anthony
 * @LastEditTime: 2021-07-19 14:11:39
-->
<template>
  <div class="print-tableouts">
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
        <!-- 内容 -->
        <div class="print-Oneindexs">
          <div class="title3">印花加工单</div>
          <div class="printing-tops">
            <div class="print-head">
              <ul class="head-ul">
                <li>生产单号：{{ detailObj.printNo }}</li>
                <li>印花厂：{{ ExtractField(1, "supplier") }}</li>
                <li>印花厂联系方式：{{ detailObj.supplierUserContact }}</li>
                <li>销售组织：{{ ExtractField(1, "salesTeam") }}</li>
                <li>发单日期：{{ ExtractField(2, "optionUserTime") }}</li>
                <li>底布总数：{{ detailObj.dyeQty }}</li>
                <li>成品总数：{{ detailObj.planQty }}</li>
                <div class="clear" />
              </ul>
            </div>
            <div class="print-table-div">
              <!-- 原料信息 03 -->
              <div class="printing_table3">
                <table class="y_table" cellspacing="0" cellpadding="0">
                  <thead>
                    <tr>
                      <td style="min-width: 38px;">
                        <span>序号</span>
                      </td>
                      <td class="" style="min-width: 60px;">
                        <span>Item Code</span>
                      </td>
                      <td class="" style="min-width: 61px;">
                        <span>花布编码</span>
                      </td>
                      <td class="" style="min-width: 40px; width: 40px;">
                        <span>布类</span>
                      </td>
                      <td class="" style="min-width: 61px; width: 61px;">
                        <span>底布颜色</span>
                      </td>
                      <td class="" style="min-width: 61px; width: 61px;">
                        <span>客户花号</span>
                      </td>
                      <td class="" style="min-width: 61px;">
                        <span>印花工艺</span>
                      </td>
                      <td class="" style="min-width: 65px;">
                        <span>幅宽-克重</span>
                      </td>
                      <td class="" style="min-width: 40px;width: 40px;">
                        <span>印损</span>
                      </td>
                      <td class="" style="min-width: 70px;">
                        <span>底布数量(KG)</span>
                      </td>
                      <td class="" style="min-width: 70px;">
                        <span>成品数量(KG)</span>
                      </td>
                      <td class="" style="min-width: 70px; width: 70px;">
                        <span>印花交期</span>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- 原料要求-天然纤维 -->
                    <template>
                      <tr v-for="(item1, iex1) in detailObj.pdPrintOrderDetailRespList" :key="iex1" class="table3_tr">
                        <!-- 序号 -->
                        <td style="min-width: 38px;">
                          <span>{{ iex1 + 1 }}</span>
                        </td>
                        <!-- Item Code -->
                        <td class="" style="min-width: 60px;">
                          <span>{{ item1.id }}</span>
                        </td>
                        <!-- 花布编码 -->
                        <td class="" style="min-width: 61px;">
                          <span>{{ item1.skuId }}</span>
                        </td>
                        <!-- 布类 -->
                        <td class="" style="min-width: 40px; width: 40px;">
                          <span>{{ item1.cloth.label }}</span>
                        </td>
                        <!-- 底布颜色 -->
                        <td class="" style="min-width: 61px; width: 61px;">
                          <span>{{ item1.customerClothNumber }}</span>
                        </td>
                        <!-- 客户花号 -->
                        <td class="" style="min-width: 61px; width: 61px;">
                          <span>{{ item1.customerColor }}</span>
                        </td>
                        <!-- 印花工艺 -->
                        <td class="" style="min-width: 61px;">
                          <span>{{ item1.tech }}</span>
                        </td>
                        <!-- 幅宽-克重 -->
                        <td class="" style="min-width: 65px;">
                          <span>{{ item1.width }} - {{ item1.weightName }}</span>
                        </td>
                        <!-- 印损 -->
                        <td class="" style="min-width: 40px; width: 40px;">
                          <span>{{ item1.printLoss }}</span>
                        </td>
                        <!-- 底布数量 -->
                        <td class="" style="min-width: 70px;">
                          <span>{{ item1.dyeQty }}</span>
                        </td>
                        <!-- 成品数量 -->
                        <td class="" style="min-width: 70px;">
                          <span>{{ item1.planQty }}</span>
                        </td>
                        <!-- 印花交期 -->
                        <td class="" style="min-width: 70px; width: 70px;">
                          <span>{{ item1.printDelivery ? $filters.parseTime(item1.printDelivery, '{y}-{m}-{d}') : '-' }}</span>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
              <!-- 公差信息 -->
              <div class="div-message" style="display: none">
                <span class="left-title fl">公差信息</span>
                <div class="right-message fl">
                  <ul>
                    <li>
                      <span class="span-left">走货公差</span>
                      <span>0%/3%</span>
                    </li>
                    <li>
                      <span class="span-left">克重公差</span>
                      <span>-5%/+5%</span>
                    </li>
                    <li>
                      <span class="span-left">封度公差</span>
                      <span>-1%/+1%</span>
                    </li>
                    <div class="clear" />
                  </ul>
                </div>
                <div class="clear" />
              </div>
              <!-- 对色标准 -->
              <div class="div-message">
                <span class="left-title fl">对色标准</span>
                <div class="right-message fl">
                  <ul>
                    <li>
                      <span class="span-left">对色方式</span>
                      <span>{{ detailObj.colorStandard ? detailObj.colorStandard.colorMatchingName : '-' }}</span>
                    </li>
                    <li>
                      <span class="span-left">对色资料</span>
                      <span>{{ detailObj.colorStandard ? detailObj.colorStandard.colorData : '-' }}</span>
                    </li>
                    <li>
                      <span class="span-left">公差</span>
                      <span>{{ detailObj.colorStandard ? detailObj.colorStandard.toleranceName : '-' }}</span>
                    </li>
                    <li class="mt-5">
                      <span class="span-left">1st对色光源</span>
                      <span>{{ detailObj.colorStandard ? detailObj.colorStandard.lstLightSourceName : '-' }}</span>
                    </li>
                    <li class="mt-5">
                      <span class="span-left">2nd对色光源</span>
                      <span>{{ detailObj.colorStandard ? detailObj.colorStandard.twondLightSourceName : '-' }}</span>
                    </li>
                    <li class="mt-5">
                      <span class="span-left">3rd对色光源</span>
                      <span>{{ detailObj.colorStandard ? detailObj.colorStandard.threerdLightSourceName : '-' }}</span>
                    </li>
                    <div class="clear" />
                  </ul>
                </div>
                <div class="clear" />
              </div>
              <!-- 出货要求 -->
              <div class="div-message">
                <span class="left-title fl">出货要求</span>
                <div class="right-message fl product-div">
                  <ul>
                    <li>
                      <span class="span-left">胶袋类型</span>
                      <span>{{ detailObj.extraInfo ? detailObj.extraInfo.plasticBagTypeName : '-' }}</span>
                    </li>
                    <li>
                      <span class="span-left">胶袋厚度</span>
                      <span>{{ detailObj.extraInfo ? detailObj.extraInfo.plasticBagThicknessName : '-' }}</span>
                    </li>
                    <li>
                      <span class="span-left">贴纸数量</span>
                      <span>{{ detailObj.extraInfo ? detailObj.extraInfo.stickersQuantity : '-' }}</span>
                    </li>
                    <li class="mt-5">
                      <span class="span-left">贴纸位置</span>
                      <span>{{ detailObj.extraInfo ? detailObj.extraInfo.stickersPosition : '-' }}</span>
                    </li>
                    <div class="clear" />
                  </ul>
                </div>
                <div class="clear" />
              </div>
              <!-- 物测要求 -->
              <div class="div-message">
                <span class="left-title fl">物测要求</span>
                <div class="right-message fl">
                  <table class="y_table y-table-sty" cellspacing="0" cellpadding="0">
                    <thead>
                      <tr>
                        <td style="min-width: 68px;width:20%">
                          <span class="required_item">一级项目</span>
                        </td>
                        <td class="" style="min-width: 68px;width:20%">
                          <span>测试方法</span>
                        </td>
                        <td class="" style="min-width: 68px;width:20%">
                          <span>二级项目</span>
                        </td>
                        <td class="" style="min-width: 58px;width:20%">
                          <span class="required_item">要求</span>
                        </td>
                        <td class="" style="min-width: 68px;width:20%">
                          <span>备注</span>
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      <!-- 物测要求 -->
                      <template>
                        <tr v-for="(val, index) in testArr" :key="index" class="">
                          <td v-if="getrowspan(index)" :rowspan="getrowspan(index)"><span class="tle">{{ val.parentName }}</span></td>
                          <td v-if="getrowspan(index)" :rowspan="getrowspan(index)"><span> {{ val.testMethod }}</span> </td>
                          <td><span class="tle">{{ val.itemName }}</span></td>
                          <td><span class="tle">{{ val.testRequirements }}</span></td>
                          <td><span> {{ val.remark }}</span></td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
                <div class="clear" />
              </div>
            </div>
            <div class="print-bottom">
              <ul>
                <li>
                  <span>跟单人：</span>
                  <span>{{ ExtractField(1, "pmUser") }}</span>
                </li>
                <li>
                  <span>审核人：</span>
                  <span>{{ ExtractField(1, "option") }}</span>
                </li>
                <li>
                  <span>印花厂签收：</span>
                  <span />
                </li>
                <div class="clear" />
              </ul>
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
    <div style="width: 100%;height: 15px;" />
    <div class="print-foots">
      <el-button @click="qrPrintHandle">打印</el-button>
      <el-button @click="pintBack">关闭</el-button>
    </div>
  </div>
</template>

<script>
// import { deepClone } from '@/utils/index.js'
import { getprintDetail } from './api/index.js'
export default {
  components: {
  },
  data() {
    return {
      qrPrint: false,
      detailObj: {},
      testArr: [],
      mergingRows: [],
      mergingPos: 0,
      allSelectCyclesIndex: [],
      codesd: ''
    }
  },
  computed: {
    tdShow() { // 循环次数td
      return function(index) {
        if (this.allSelectCyclesIndex.includes(index)) {
          return false
        } else {
          return true
        }
      }
    }
  },
  watch: {

  },
  created() {
    if (this.$route.query.uuid) {
      this.getDetailFun(this.$route.query.uuid, this.$route.query.version, this.$route.query.printNo)
    }
  },
  mounted() {},
  methods: {
    qrPrintHandle() {
      this.qrPrint = true
    },
    pintBack() {
      this.$router.push(`/processing/printing/order`)
    },
    // 获取分析单详情
    async getDetailFun(id, version, printNo) {
      const sm = (await getprintDetail({ uuid: id, version: version, printNo: printNo })).data || {}
      this.detailObj = sm
      // this.testArr = deepClone(sm.coQaTestItems) || []
      this.setTable()
    },
    setTable() {
      this.testArr = [
        { 'itemId': 75,
          'orderId': '',
          'itemName': '洗前',
          'testMethod': 'fk',
          'grade': 1,
          'parentId': 73,
          'parentName': '幅宽',
          'testRequirements': 'test1',
          'remark': 'abab',
          'sort': 1,
          'secondSort': 1,
          'edit': true
        },
        {
          'itemId': 77,
          'orderId': '',
          'itemName': '原样',
          'testMethod': '',
          'grade': 1,
          'parentId': 73,
          'parentName': '幅宽',
          'testRequirements': 'test3',
          'remark': '- -!',
          'sort': 1,
          'secondSort': 3,
          'edit': true
        },
        {
          'itemId': 79,
          'orderId': '',
          'itemName': '洗前',
          'testMethod': 'kz',
          'grade': 1,
          'parentId': 78,
          'parentName': '克重',
          'testRequirements': 'test4',
          'remark': '^^',
          'sort': 2,
          'secondSort': 1,
          'edit': true
        },
        {
          'itemId': 80,
          'orderId': '',
          'itemName': '洗后',
          'testMethod': 'aa',
          'grade': 1,
          'parentId': 78,
          'parentName': '克重',
          'testRequirements': 'test5',
          'remark': 'XD',
          'sort': 2,
          'secondSort': 2,
          'edit': true
        },
        {
          'itemId': 81,
          'orderId': '',
          'itemName': '测试',
          'testMethod': 'bb',
          'grade': 1,
          'parentId': 78,
          'parentName': '克重',
          'testRequirements': 'test5',
          'remark': 'XD',
          'sort': 2,
          'secondSort': 2,
          'edit': true
        },
        {
          'itemId': 37,
          'orderId': '',
          'itemName': '问',
          'testMethod': 'vv',
          'grade': 1,
          'parentId': 34,
          'parentName': '测试一级',
          'testRequirements': '1',
          'remark': '1',
          'sort': 304.5,
          'secondSort': 3,
          'edit': true
        },
        {
          'itemId': 85,
          'orderId': '',
          'itemName': '洗后',
          'testMethod': 'aa',
          'grade': 1,
          'parentId': 21,
          'parentName': '克重',
          'testRequirements': 'test5',
          'remark': 'XD',
          'sort': 2,
          'secondSort': 2,
          'edit': true
        },
        {
          'itemId': 86,
          'orderId': '',
          'itemName': '测试',
          'testMethod': 'bb',
          'grade': 1,
          'parentId': 21,
          'parentName': '克重',
          'testRequirements': 'test5',
          'remark': 'XD',
          'sort': 2,
          'secondSort': 2,
          'edit': true
        }
      ]
      // 注意因为需要多次处理后台数据合并 所以合并前初始化这两个
      this.mergingRows = []
      this.mergingPos = 0
      for (let i = 0; i < this.testArr.length; i++) {
        // data传入的表格数据源
        if (i === 0) {
          this.mergingRows.push(1)
          this.mergingPos = 0
        } else {
          if (this.testArr[i].parentId && this.testArr[i - 1].parentId) {
            // 哪些数据是要合并的 合并的条件是什么
            if (this.testArr[i].parentId === this.testArr[i - 1].parentId) {
              this.mergingRows[this.mergingPos] += 1
              this.mergingRows.push(0)
            } else {
              this.mergingRows.push(1)
              this.mergingPos = i
            }
          } else {
            this.mergingRows.push(1)
            this.mergingPos = i
          }
        }
      }
    },
    getrowspan(index) {
      const sm = this.mergingRows[index]
      return sm || 0
    },
    /**
     * data 数据源
     * vas 父级元素
     * items 子级元素
     */
    ticone(data, vas, items) {
      if (vas) {
        return vas[items] ? vas[items] + ' ' : ''
      }
    },
    // 天然纤维 纱线描述
    // 1. 天然纤维：纱支+【x】+股数+成份+比例（用/隔开）+纱类+梳棉方法+纺纱方法+捻向，
    // 如果股数是1，则不用加【x】+股数,  如果比例是100，则不需要/隔开，值为空的字段不做拼接，各字段中间用一个空格隔开
    naturalOne(item) {
      const that = this
      const yarn = that.ticone(item, item.yarnInfo, 'label') // 纱支
      const num = item.num ? (item.num === 1 ? ' ' : 'x' + item.num + ' ') : ''// 股数
      const element = that.ticone(item, item.elementInfo, 'label')// 成份
      const elementRatio = item.elementRatio && Number(item.elementRatio) === 100 ? item.elementRatio + ' ' : item.elementRatio // 成分比例
      const yarnCategory = that.ticone(item, item.yarnCategoryInfo, 'label') // 纱类
      const method = that.ticone(item, item.methodInfo, 'label') // 梳棉方法
      const spinningMethod = that.ticone(item, item.spinningMethodInfo, 'label') // 纺纱方法
      const twistDirection = that.ticone(item, item.twistDirectionInfo, 'label') // 捻向
      return yarn + num + element + elementRatio + yarnCategory + method + spinningMethod + twistDirection
    },
    // 产品信息
    // 数据类型type 1 {} 2 "string"
    // 数据源 data
    // 提取的字段 name
    ExtractField(type, name) { // 提取字段
      if (type === 1) {
        return this.detailObj[name] ? this.detailObj[name].label : ''
      } else if (type === 2) {
        console.log(this.detailObj[name], 'this.detailObj[name]---')
        return this.detailObj[name] ? this.$filters.parseTime(this.detailObj[name] + '', '{y}-{m}-{d} {h}:{i}') : ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.print-top-box {
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
  .print-tableouts{
    box-sizing: border-box;
    margin:20px;
    width: 210mm;
    background: #fff;
  }
  .print-Oneindexs{// 头部
    width: 208mm;
    box-sizing: border-box;
    .title3 {
      text-align: center;
      color: #151222;
      font-size: 24px;
      font-weight: 600;
      padding: 20px 0 15px;
    }
    .printing-tops{
      width: 208mm;
       padding: 0 17px;
      .printing_top_h4{
        font-family: SourceHanSansCN-Bold;
        font-size: 16px;
        color: #151222;
        letter-spacing: 0;
        text-align: right;
        width: 100%;
        text-align: center;
        padding: 0px 0 17px 0;
        font-weight: bold;
      }
      .y_table{
        clear: both;
        width: 100%;
        // border-bottom: 1px solid #D2D2D3;
        td {
          font-weight: normal;
          height: 30px;
          font-size: 12px;
          color: #151222;
          padding: 3px;
          min-width: 50px;
          border-left: 1px solid #D2D2D3;
          border-bottom: 1px solid #D2D2D3;
        }
      }
      .y-table-sty td {
        text-align: center;
      }
      .printing_table3{
        .table3_tr{
          td{text-align: left;}
        }
        td{
          padding: 0 2px;
          word-break: break-all;
          span{
            line-height: 16px;
            padding: 3px 0;
            display: block;
          }
        }
      }
    }
  }
  .print-foots{
    background: #eef5f9;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  // 打印头部样式
  ul, ol {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  li, span{
    font-weight: 400;
    font-size: 12px;
    color: #151222;
  }
  .print-head .head-ul li {
    display: inline-block;
    width: 33%;
    float: left;
    padding: 10px 0;
  }
  .div-message {
    .left-title {
      display: block;
      width: 100%;
      height: 32px;
      line-height: 32px;
      text-align: left;
      padding-left: 10px;
      font-size: 14px;
      color: #151222;
      border-bottom: 1px solid #D0D8E0;
      border-left: 1px solid #D0D8E0;
      font-weight: 600;
    }
    .right-message {
      width: 100%;
      li{
        display: inline-block;
        width: 33.3%;
        float: left;
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #D0D8E0;
        border-left: 1px solid #D0D8E0;
        span {
          display: inline-block;
          height: 100%;
          text-align: center;
          width: 49%;
        }
        .span-left {
          border-right: 1px solid #D0D8E0;
        }
      }
    }
    .product-div {
      li {
        width: 25%;
      }
    }

  }
  .clear {
    clear: both;
  }
  .print-bottom {
    margin-top: 60px;
    li{
      display: inline-block;
      width: 33%;
      float: left;
    }
  }
  // .mt-5 {
  //   margin-top: 5px;
  // }
  .print-footer.yarn-dyeing-print {
    border-top: 1px solid #f0f0f0;
    height: 56px;
    line-height: 56px;
    font-size: 12px;
    color: #474747;
    padding: 0;
    margin: 0;
    text-align: left;
    margin-top: 10px;
    > div {
      display: inline-block;
      margin-right: 16px;
    }
  }
  .print-table-div {
    border-right: 1px solid #D0D8E0;
    border-top: 1px solid #D0D8E0;
  }
</style>
