<!--
 * @Author: lsl
 * @Description: 染整加工单
 * @Date: 2021-07-07 09:40:26
 * @LastEditors: lsl
 * @LastEditTime: 2021-07-15 14:25:26
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
          <div class="title3">染整加工单</div>
          <div class="printing-tops">
            <div class="print-head">
              <ul class="head-ul">
                <li>染订单号：{{ detailObj.dyeNo }}</li>
                <li>染厂：{{ detailObj.supplierName }}</li>
                <li>染厂联系方式：{{ detailObj.supplierUserContact }}</li>
                <li>销售组织：{{ detailObj.salesTeamName }}</li>
                <li>发单日期：{{ $utils.parseTime(detailObj.submitTime || 0,'{y}-{m}-{d}') }}</li>
                <li>坯布总数：<span v-if="detailObj.knitQtySum">{{ detailObj.knitQtySum }} KG</span></li>
                <li>成品总数： <span v-if="detailObj.finishedQtySum"> {{ detailObj.finishedQtySum }} KG</span> </li>
                <div class="clear" />
              </ul>
            </div>
            <!-- 原料信息 03 -->
            <div class="print-table-div">
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
                        <span>色布编码</span>
                      </td>
                      <td class="" style="min-width: 40px; width: 90px;">
                        <span>产品信息</span>
                      </td>
                      <td class="" style="min-width: 61px; width: 61px;">
                        <span>工厂色号</span>
                      </td>
                      <td class="" style="min-width: 61px;">
                        <span>Lab Dip批核情况</span>
                      </td>
                      <td class="" style="min-width: 61px;">
                        <span>工艺要求</span>
                      </td>
                      <td class="" style="min-width: 65px;">
                        <span>投坯数(KG)</span>
                      </td>
                      <td class="" style="min-width: 40px;width: 40px;">
                        <span>染损</span>
                      </td>
                      <td class="" style="min-width: 70px;">
                        <span>成品数量(KG)</span>
                      </td>
                      <td class="" style="min-width: 70px;">
                        <span>染整交期</span>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- 原料要求-天然纤维 -->
                    <template>
                      <tr v-for="(item1, iex1) in detailObj.pdDyeOrderPrintDetailRespList" :key="iex1" class="table3_tr">
                        <!-- 序号 -->
                        <td style="min-width: 38px;">
                          <span>{{ iex1 + 1 }}</span>
                        </td>
                        <!-- Item Code -->
                        <td class="" style="min-width: 60px;">
                          <span>{{ item1.itemCode }}</span>
                        </td>
                        <!-- 色布编码 -->
                        <td class="" style="min-width: 61px;">
                          <span>{{ item1.skuId }}</span>
                        </td>
                        <!-- 产品信息 -->
                        <td class="" style="min-width: 40px; width: 68px;">
                          <span>{{ item1.clothName }}</span>
                          <span>{{ item1.suggest }}</span>
                        </td>
                        <!-- 工厂色号 -->
                        <td class="" style="min-width: 61px; width: 61px;">
                          <span>{{ item1.factoryColorNo }}</span>
                        </td>
                        <!-- Lab Dip批核情况 -->
                        <td class="" style="min-width: 61px;">
                          <span>{{ item1.labDip }}</span>
                        </td>
                        <!-- 工艺要求 -->
                        <td class="" style="min-width: 61px;">
                          <span>{{ item1.tech }}</span>
                        </td>
                        <!-- 投坯数(KG) -->
                        <td class="" style="min-width: 65px;">
                          <span>{{ item1.knitQty }}</span>
                        </td>
                        <!-- 染损 -->
                        <td class="" style="min-width: 40px; width: 40px;">
                          <span>{{ item1.dyeLoss }}</span>
                        </td>
                        <!-- 成品数量(KG) -->
                        <td class="" style="min-width: 70px;">
                          <span>{{ item1.planQty }}</span>
                        </td>
                        <!-- 染整交期 -->
                        <td class="" style="min-width: 70px;">
                          <span>{{ item1.dyeDelivery ? $filters.parseTime(item1.dyeDelivery, '{y}-{m}-{d}') : '-' }}</span>
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
                      <span>{{ detailObj.deliveryTolerance }}</span>
                    </li>
                    <li>
                      <span class="span-left">克重公差</span>
                      <span>{{ detailObj.weightBeforeRange }}</span>
                    </li>
                    <li>
                      <span class="span-left">封度公差</span>
                      <span>{{ detailObj.range }}</span>
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
                      <span>{{ detailObj.colorMatching }}</span>
                    </li>
                    <li>
                      <span class="span-left">对色资料</span>
                      <span>{{ detailObj.colorData }}</span>
                    </li>
                    <li>
                      <span class="span-left">公差</span>
                      <span>{{ detailObj.tolerance }}</span>
                    </li>
                    <li>
                      <span class="span-left">1st对色光源</span>
                      <span>{{ detailObj.lstLightSource }}</span>
                    </li>
                    <li>
                      <span class="span-left">2nd对色光源</span>
                      <span>{{ detailObj.twondLightSource }}</span>
                    </li>
                    <li>
                      <span class="span-left">3rd对色光源</span>
                      <span>{{ detailObj.threerdLightSource }}</span>
                    </li>
                    <div class="clear" />
                  </ul>
                </div>
                <div class="clear" />
              </div>
              <!-- 出货要求 -->
              <div class="div-message">
                <span class="left-title fl ">出货要求</span>
                <div class="right-message fl product-div">
                  <ul>
                    <li>
                      <span class="span-left">胶袋类型</span>
                      <span>{{ detailObj.plasticBagType }}</span>
                    </li>
                    <li>
                      <span class="span-left">胶袋厚度</span>
                      <span>{{ detailObj.plasticBagThickness }}</span>
                    </li>
                    <li>
                      <span class="span-left">贴纸数量</span>
                      <span>{{ detailObj.stickerQty }}</span>
                    </li>
                    <li>
                      <span class="span-left">贴纸位置</span>
                      <span>{{ detailObj.stickerAddress }}</span>
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
                  <table class="y_table" cellspacing="0" cellpadding="0">
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
                        <tr class="">
                          <!-- colspan="3" -->
                          <td><span class="tle">幅宽</span></td>
                          <td><span> {{ '' }}</span> </td>
                          <td><span class="tle">洗前</span></td>
                          <td><span class="tle">{{ }}</span></td>
                          <td><span> {{ }}</span></td>
                        </tr>
                        <tr class="">
                          <td rowspan="2"><span class="tle">克重</span></td>
                          <td rowspan="2"><span> {{ '' }}</span> </td>
                          <td><span class="tle">原样</span></td>
                          <td><span class="tle">{{ }}</span></td>
                          <td><span> {{ }}</span></td>
                        </tr>
                        <tr class="">
                          <!-- <td rowspan="2"><span class="tle">克重</span></td>
                        <td rowspan="2"><span > {{ '' }}</span> </td> -->
                          <td><span class="tle">洗后</span></td>
                          <td><span class="tle">{{ }}</span></td>
                          <td><span> {{ }}</span></td>
                        </tr>
                        <tr class="">
                          <td><span class="tle">拉伸测试</span></td>
                          <td><span> {{ '' }}</span> </td>
                          <td><span class="tle">伸长率( % )</span></td>
                          <td><span class="tle">{{ }}</span></td>
                          <td><span> {{ }}</span></td>
                        </tr>
                        <tr class="">
                          <td rowspan="2"><span class="tle">缩水</span></td>
                          <td rowspan="2"><span> {{ '' }}</span> </td>
                          <td><span class="tle">直向</span></td>
                          <td><span class="tle">{{ }}</span></td>
                          <td><span> {{ }}</span></td>
                        </tr>
                        <tr class="">
                          <!-- <td rowspan="2"><span class="tle">克重</span></td>
                        <td rowspan="2"><span > {{ '' }}</span> </td> -->
                          <td><span class="tle">横向</span></td>
                          <td><span class="tle">{{ }}</span></td>
                          <td><span> {{ }}</span></td>
                        </tr>
                        <tr class="">
                          <td rowspan="2"><span class="tle">扭度</span></td>
                          <td rowspan="2"><span> {{ '' }}</span> </td>
                          <td><span class="tle">洗前</span></td>
                          <td><span class="tle">{{ }}</span></td>
                          <td><span> {{ }}</span></td>
                        </tr>
                        <tr class="">
                          <!-- <td rowspan="2"><span class="tle">克重</span></td>
                        <td rowspan="2"><span > {{ '' }}</span> </td> -->
                          <td><span class="tle">洗后</span></td>
                          <td><span class="tle">{{ }}</span></td>
                          <td><span> {{ }}</span></td>
                        </tr>
                        <tr class="">
                          <td><span class="tle">纬斜 &amp; 弓纬</span></td>
                          <td><span> {{ '' }}</span> </td>
                          <td><span class="tle">洗前</span></td>
                          <td><span class="tle">{{ }}</span></td>
                          <td><span> {{ }}</span></td>
                        </tr>
                        <tr class="">
                          <td><span class="tle">横条间距</span></td>
                          <td><span> {{ '' }}</span> </td>
                          <td><span class="tle">洗前</span></td>
                          <td><span class="tle">{{ }}</span></td>
                          <td><span> {{ }}</span></td>
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
                  <span>{{ detailObj.pmUserName }}</span>
                </li>
                <li>
                  <span>审核人：</span>
                  <span>{{ detailObj.submitUserName }}</span>
                </li>
                <li>
                  <span>染厂签收：</span>
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
    <div class="print-foots">
      <el-button @click="qrPrintHandle">打印</el-button>
      <el-button @click="pintBack">关闭</el-button>
    </div>
  </div>
</template>

<script>
import { getprintDetail } from './api/index.js'
export default {
  components: {
  },
  data() {
    return {
      qrPrint: false,
      detailObj: {},
      tabcome: [],
      testArr: [],
      mergingRows: [],
      mergingPos: 0,
      pinTopList: new Array(30).fill(''), // 上针
      pinBottomList: new Array(30).fill(''), // 下针
      stitchMap: [],
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
    this.stitchMap.push(this.pinTopList, this.pinBottomList)
    if (this.$route.query.uuid) {
      this.getDetailFun(this.$route.query.uuid)
    }
  },
  mounted() {},
  methods: {
    qrPrintHandle() {
      this.qrPrint = true
    },
    pintBack() {
      this.$router.push(`/processing/dyeing/order`)
    },
    // 获取分析单详情
    async getDetailFun(uuid) {
      const sm = (await getprintDetail({ uuid })).data || {}
      this.detailObj = sm
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
.title3 {
    text-align: center;
    color: #151222;
    font-size: 24px;
    font-weight: 600;
    padding: 20px 0 15px;
  }
.printing-print {
  position: relative;
  background-color: #fff;
  margin: 20px;
  padding: 20px;
  padding-bottom: 0;
  margin-bottom: 0;
  .img-logo {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 39px;
    height: 39px;
  }
  .wrap-title {
    display: flex;
    flex-direction: column;
    text-align: center;
    .title1 {
      color: #151222;
      font-size: 21px;
      font-weight: bold;
      margin-bottom: 7px;
    }
    .title2 {
      color: #474747;
      font-size: 12px;
      line-height: 20px;
    }
    .title3 {
      color: #151222;
      font-size: 16px;
      font-weight: bold;
      margin: 20px 0 15px;
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
        td {
          font-weight: normal;
          height: 30px;
          line-height: 100%;
          font-size: 12px;
          padding: 3px;
          min-width: 50px;
          border-left: 1px solid #D2D2D3;
          border-bottom: 1px solid #D2D2D3;
          text-align: center;
        }
      }
      .printing_table3{
        text-align: center;
        .table3_tr{
          td{text-align: center;}
        }
        td{
          padding: 2px;
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
      font-size: 14px;
      color: #151222;
      padding-left: 10px;
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
        display: flex;
        span {
          flex: 1;
          display: inline-block;
          height: 100%;
          text-align: center;
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
