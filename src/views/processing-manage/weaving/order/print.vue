<!--
* @Author: lsl
 * @Description: 织布通知单
 * @Date: 2021-07-05 14:20:27
 * @updateTime：2021-7-15 13:38
-->

<template>
  <div class="print-tableouts">
    <cs-print
      :print.sync="qrPrint"
      :interval="50"
      :format="'a4'"
      :img-engine="'canvas'"
    >
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
      <!-- 内容 -->
      <div class="print-Oneindexs">
        <div class="title3">织布通知单</div>
        <div class="printing-tops">
          <!-- <div class="title3">织布通知单</div> -->

          <div class="print-head">
            <ul class="head-ul">
              <li>
                织订单号：<span>{{ detailObj.knitOrderNo }}</span>
              </li>
              <li>
                织厂：<span>{{ detailObj.supplerName }}</span>
              </li>
              <li>
                织厂联系方式：<span>{{ detailObj.supplerContact }}</span>
              </li>
              <li>
                销售组织：<span>{{ detailObj.salesTeamName }}</span>
              </li>
              <li>
                纱线总量：<span
                  v-if="detailObj.yarnQty"
                >{{ detailObj.yarnQty }} KG</span>
              </li>
              <li>
                坯布总量：<span
                  v-if="detailObj.qty"
                >{{ detailObj.qty }} KG</span>
              </li>
              <li>
                下单日期：<span>{{
                  $utils.parseTime(detailObj.submitTime, "{y}-{m}-{d}")
                }}</span>
              </li>
              <div class="clear" />
            </ul>

          </div>
          <div class="printing_table1">
            <!-- 产品分录明细  -->
            <div class="printing_table4">
              <table class="y_table" cellspacing="0" cellpadding="0">
                <thead>
                  <tr>
                    <td style="min-width: 20px;width:10%">
                      <span>序号</span>
                    </td>
                    <td class="" style="min-width: 68px;width:17%">
                      <span>坯布编码</span>
                    </td>
                    <td class="" style="min-width: 90px;width:12%">
                      <span>产品信息</span>
                    </td>
                    <td class="" style="min-width: 68px;width:15%">
                      <span>织单交期</span>
                    </td>
                    <td class="" style="min-width: 68px;width:27%">
                      <span>纱名</span>
                    </td>
                    <td class="" style="min-width: 50px;width:27%">
                      <span>纱属性</span>
                    </td>
                    <td class="" style="min-width: 40px;width:27%">
                      <span>色纱颜色</span>
                    </td>
                    <td class="" style="min-width: 40px;width:27%">
                      <span>织损</span>
                    </td>
                    <td class="" style="min-width: 50px;width:27%">
                      <span>纱需求量KG</span>
                    </td>
                    <td class="" style="min-width: 68px;width:27%">
                      <span>计划到纱期</span>
                    </td>
                    <td class="" style="min-width: 40px;width:27%">
                      <span>颜色分类</span>
                    </td>
                    <td class="" style="min-width: 68px;width:27%">
                      <span>工艺要求</span>
                    </td>
                    <td class="" style="min-width: 50px;width:27%">
                      <span>坯布数量KG</span>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <template
                    v-if="
                      detailObj.productDetails &&
                        detailObj.productDetails.length
                    "
                  >
                    <tr
                      v-for="(item, ie2x) in detailObj.productDetails"
                      :key="ie2x"
                      class="table3_tr"
                    >
                      <!-- 序号 -->
                      <td
                        v-if="getrowspan(ie2x)"
                        class=""
                        :rowspan="getrowspan(ie2x)"
                        style="min-width: 20px;"
                      >
                        {{ item.index }}
                      </td>
                      <!-- 坯布编码 -->
                      <td
                        v-if="getrowspan(ie2x)"
                        :rowspan="getrowspan(ie2x)"
                        class=""
                        style="min-width: 68px;"
                      >
                        <span>{{ item.skuId ? item.skuId : "" }}</span>
                      </td>
                      <!-- 产品信息-->
                      <td
                        v-if="getrowspan(ie2x)"
                        class=""
                        :rowspan="getrowspan(ie2x)"
                        style="min-width: 68px;"
                      >
                        <span>{{ item.clothType ? item.clothType : "" }}</span>
                        <span>{{ item.widthName }}- {{ item.weightName }}</span>
                      </td>
                      <!-- 织单交期 -->
                      <td
                        v-if="getrowspan(ie2x)"
                        class=""
                        :rowspan="getrowspan(ie2x)"
                        style="min-width: 68px;"
                      >
                        <span>{{
                          item.knitDelivery ? item.knitDelivery : ""
                        }}</span>
                      </td>
                      <!-- 纱名 -->
                      <td class="" style="min-width: 68px;width:47%">
                        <span>{{ item.yarnName ? item.yarnName : "" }}</span>
                      </td>
                      <!-- 纱属性 -->
                      <td class="" style="min-width: 50px;width:47%">
                        <span>{{ item.yarnAttr ? item.yarnAttr : "" }}</span>
                      </td>
                      <!-- 纱染颜色 -->
                      <td class="" style="min-width: 40px;width:47%">
                        <span>{{ item.yarnColor ? item.yarnColor : "" }}</span>
                      </td>
                      <!-- 织损 -->
                      <td class="" style="min-width: 45px;width:47%">
                        <span>{{
                          item.knitWastage ? item.knitWastage + "%" : ""
                        }}</span>
                      </td>
                      <!-- 纱需求量 -->
                      <td class="" style="min-width: 50px;width:47%">
                        <span>{{
                          item.yarnNeedQty ? item.yarnNeedQty : ""
                        }}</span>
                      </td>
                      <!-- 计划到纱期 -->
                      <td class="" style="min-width: 68px;width:47%">
                        <span>{{
                          item.yarnDelivery ? item.yarnDelivery : ""
                        }}</span>
                      </td>
                      <!-- 颜色分类 -->
                      <td
                        v-if="getrowspan(ie2x)"
                        class=""
                        :rowspan="getrowspan(ie2x)"
                        style="min-width: 40px;width:47%"
                      >
                        <span>{{ item.colorType ? item.colorType : "" }}</span>
                      </td>
                      <!-- 工艺 -->
                      <td
                        v-if="getrowspan(ie2x)"
                        class=""
                        :rowspan="getrowspan(ie2x)"
                        style="min-width: 68px;width:47%"
                      >
                        <span>{{
                          item.dyeProcedure ? item.dyeProcedure : ""
                        }}</span>
                      </td>
                      <!-- 坯布数量 -->
                      <td
                        v-if="getrowspan(ie2x)"
                        class=""
                        :rowspan="getrowspan(ie2x)"
                        style="min-width: 50px;width:47%"
                      >
                        <span>{{ item.qty ? item.qty : "" }}</span>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 上机工艺 05 -->
          <div class="printing_table5">
            <div class="printing_table1_h5">上机工艺</div>
            <div class="print-head">
              <ul class="head-ul2">
                <li>
                  <span> 针寸数</span><span>{{ '' }}</span>
                </li>
                <li>
                  <span>总针数</span> <span>{{ '' }}</span>
                </li>
                <li>
                  <span>类型</span> <span>{{ '' }}</span>
                </li>
                <li>
                  <span>打包方式</span><span>{{ '' }}</span>
                </li>
                <li>
                  <span> 织机种类</span><span>{{ '' }}</span>
                </li>
                <li>
                  <span>织机转向</span><span>{{ '' }}</span>
                </li>
                <li>
                  <span>开机模数</span><span>{{ '' }}</span>
                </li>
                <li>
                  <span /><span />
                </li>
              </ul>
            </div>
          </div>
          <div class="tips">排针图（代表符号：0 1 2 3 4）</div>

          <!-- 上针下针 -->
          <div class="printing_table6">
            <table class="y_table" cellspacing="0" cellpadding="0">
              <thead>
                <tr>
                  <td class="lineTd line_45px">
                    <div class="lineTd_xian" />
                  </td>
                  <td v-for="(item5, index5) in 30" :key="index5" width="21px">
                    <span>{{ index5 + 1 }}</span>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="lineTd line_45px">
                    <span class="te">上针</span>
                  </td>
                  <template v-if="stitchMap.length">
                    <td
                      v-for="(item6, index6) in stitchMap[0].slice(0, 30)"
                      :key="'上针' + index6"
                      width="21px"
                    >
                      <span v-if="stitchMap[0].length < 31">{{ item6 }}</span>
                    </td>
                  </template>
                </tr>
                <tr>
                  <td><span class="te">下针</span></td>
                  <template v-if="stitchMap.length">
                    <td
                      v-for="(item7, index7) in stitchMap[1].slice(0, 30)"
                      :key="'下针' + index7"
                      width="21px"
                    >
                      <span v-if="stitchMap[1].length < 31">{{ item7 }}</span>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="tips">
            排三角图（代表符号：1=[—]、2=[∩]、3=[∪]、4=[∧]、5=[∨] ）
          </div>
          <!-- 上盘下盘 排纱 循环次数-->
          <div v-if="Object.keys(triangleMap).length" class="printing_table7">
            <table class="y_table" cellspacing="0" cellpadding="0">
              <thead>
                <tr>
                  <td class="lineTd line_45px">
                    <div class="lineTd_xian" />
                  </td>
                  <td v-for="(item, index) in 30" :key="index" width="21px">
                    <span>{{ index + 1 }}</span>
                  </td>
                </tr>
              </thead>
              <tbody>
                <!-- 上盘 -->
                <tr
                  v-for="(itemp, inTop) in triangleMap.plateTop"
                  :key="'上盘' + inTop"
                >
                  <td v-if="!inTop" class="lineTd line_45px" rowspan="2">
                    <span class="te">上盘</span>
                  </td>
                  <td
                    v-for="(itemps, inTops) in itemp.slice(0, 30)"
                    :key="inTops"
                    width="21px"
                  >
                    <span v-if="itemp.length < 31">{{ itemps }}</span>
                  </td>
                </tr>
                <!-- 下盘 -->
                <tr
                  v-for="(itemBot, indexBot) in triangleMap.plateBottom"
                  :key="'下盘' + indexBot"
                >
                  <td v-if="!indexBot" rowspan="4">
                    <span class="te">下盘</span>
                  </td>
                  <td
                    v-for="(itemBots, indexBots) in itemBot.slice(0, 30)"
                    :key="indexBots"
                    width="21px"
                  >
                    <span v-if="itemBot.length < 31">{{ itemBots }}</span>
                  </td>
                </tr>
                <!-- 排纱 -->
                <tr
                  v-for="(itemRow, indexRow) in triangleMap.yarnRow"
                  :key="'排纱' + indexRow"
                >
                  <td><span class="te">排纱</span></td>
                  <td
                    v-for="(itemRows, indexRows) in itemRow.slice(0, 30)"
                    :key="indexRows"
                    width="21px"
                  >
                    <span v-if="itemRow.length < 31">{{ itemRows }}</span>
                  </td>
                </tr>
                <!-- 循环 -->
                <tr
                  v-if="
                    triangleMap.cyclesDetails &&
                      triangleMap.cyclesDetails.length
                  "
                >
                  <td>
                    <span class="te">循环<br>次数</span>
                  </td>
                  <template
                    v-for="(itemes, ines) in triangleMap.cyclesDetails[0].slice(
                      0,
                      30
                    )"
                  >
                    <td
                      v-if="tdShow(ines)"
                      :key="'循环' + ines"
                      :colspan="getColspan(ines)"
                      width="21px"
                    >
                      <span v-if="triangleMap.cyclesDetails[0].length < 31">{{
                        itemes.value
                      }}</span>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            v-if="Object.keys(detailObj).length"
            style="width: 201mm;min-height: 30px; padding: 17px 0;margin-top:60px"
          >
            <prin-bottom :data-bott="detailObj" />
          </div>
        </div>
      </div>
      <!-- 页尾 -->
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
    <!-- <div style="width: 100%;height: 15px;" /> -->
    <div class="print-foots">
      <el-button @click="qrPrintHandle">打印</el-button>
      <el-button @click="pintBack">关闭</el-button>
    </div>
  </div>
</template>

<script>
import prinBottom from './components/prinBottom.vue'
import { getPrintDetail } from './api/index.js'

export default {
  components: {
    prinBottom
  },
  data() {
    return {
      qrPrint: false,
      detailObj: {},
      tabcome: [],
      mergingRows: [],
      mergingPos: 0,
      pinTopList: new Array(30).fill(''), // 上针
      pinBottomList: new Array(30).fill(''), // 下针
      stitchMap: [],
      triangleMap: {
        plateTop: new Array(2).fill(new Array(30).fill('')), // 上盘
        plateBottom: new Array(4).fill(new Array(30).fill('')), // 下盘
        yarnRow: new Array(1).fill(new Array(30).fill('')), // 排纱
        cycles: new Array(1).fill(new Array(30).fill('')) // 循环次数
      },
      // isstitchMap:[],
      // istriangleMap,
      allSelectCyclesIndex: [],
      codesd: ''
    }
  },
  computed: {
    tdShow() {
      // 循环次数td
      return function(index) {
        if (this.allSelectCyclesIndex.includes(index)) {
          return false
        } else {
          return true
        }
      }
    },
    cyclesDetails() {
      return this.triangleMap.cyclesDetails[0]
    }
  },
  watch: {
    triangleMap: {
      deep: true,
      handler(val) {
        if (val.cyclesDetails && val.cyclesDetails.length) {
          this.allSelectCyclesIndex = this.allSelectCyclesIndexHandle()
        } else {
          const len = val.cycles[0].length
          val.cyclesDetails = new Array(1).fill(new Array(len).fill(''))
        }
      }
    }
  },
  created() {
    this.stitchMap.push(this.pinTopList, this.pinBottomList)
    if (this.$route.params.id) {
      this.getPrintDetail(this.$route.params.id)
    }
  },
  mounted() {},
  methods: {
    qrPrintHandle() {
      this.qrPrint = true
    },
    pintBack() {
      this.$router.push({ name: 'WeavingOrder' })
    },
    async getPrintDetail(uuid) {
      const res = await getPrintDetail({ uuid })
      if (res.code === 200) {
        this.detailObj = res.data || {}
        const productDetails = this.initDayData(this.detailObj.productDetails) // 合并单元格
        productDetails.length && this.dataPretreatment(productDetails)
        this.detailObj.productDetails = productDetails
      }
    },
    // 获取分析单详情
    // async getDetailFun(id) {
    //   const sm = (await getDetail({ csSampleAnalysisApplayId: id })).data || {}
    //   // 上针下针  上盘下盘 排纱 循环次数
    //   if (sm && sm.machineTechnology && sm.machineTechnology.stitchMap) { // 排针图
    //     const stitchMap = JSON.parse(sm.machineTechnology.stitchMap)
    //     if (isArray(stitchMap) && stitchMap.length) {
    //       this.stitchMap = stitchMap
    //     } else {
    //       this.stitchMap = [[...this.pinTopList], [...this.pinBottomList]]
    //     }
    //   } else {
    //     this.stitchMap = [[...this.pinTopList], [...this.pinBottomList]]
    //   }
    //   // 详情排三角图数据处理
    //   let triangleMaps = {}
    //   if (sm.machineTechnology && sm.machineTechnology.triangleMap) {
    //     triangleMaps = JSON.parse(sm.machineTechnology.triangleMap) || {}
    //   } else {
    //     triangleMaps = {
    //       ...this.triangleMap,
    //       cycles: new Array(1).fill(new Array(30).fill('')),
    //       cyclesDetails: new Array(1).fill(new Array(30).fill(''))
    //     }
    //   }
    //   this.triangleMap = triangleMaps
    //   // sm.dtatTom = this.initDayData(sm.composeYarns) // 合并单元格
    //   // sm.dtatTom.length && this.dataPretreatment(sm.dtatTom)
    //   // this.detailObj = sm
    // },
    // 申请信息
    analysisTargetKM(data) {
      // 分析目标
      if (data) {
        const v = data
        let muDi = ''
        if (v.analysisTarget) {
          v.analysisTarget.split('|').forEach(ele => {
            muDi +=
              ele === 'O'
                ? '报价、'
                : ele === 'D'
                  ? '样板、'
                  : ele === 'S'
                    ? '大货、'
                    : ''
          })
        }
        return muDi ? muDi.slice(0, -1) : muDi
      }
    },
    // 产品信息
    // 数据类型type 1 {} 2 "string"
    // 数据源 data
    // 提取的字段 name
    ExtractField(type = 1, data = {}, name) {
      // 提取字段
      if (!Object.keys(this.detailObj).length) {
        return
      }
      if (type === 1) {
        return this.detailObj[data] && this.detailObj[data][name]
          ? this.detailObj[data][name]
          : ''
      } else if (type === 2) {
        return this.detailObj[data] && this.detailObj[data][name]
          ? this.detailObj[data][name].label
          : ''
      }
    },
    // 处理表格的合并的数据,找到要合并的数组
    dataPretreatment(data) {
      const datas = JSON.parse(JSON.stringify(data))
      // 注意因为需要多次处理后台数据合并 所以合并前初始化这两个
      this.mergingRows = []
      this.mergingPos = 0
      for (let i = 0; i < datas.length; i++) {
        // data传入的表格数据源
        if (i === 0) {
          this.mergingRows.push(1)
          this.mergingPos = 0
        } else {
          if (datas[i].uuid && datas[i - 1].uuid) {
            // 哪些数据是要合并的 合并的条件是什么
            if (datas[i].uuid === datas[i - 1].uuid) {
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
    // 表头文字组合 组合纱线内的组合字段：纱线类型+组合方式+包覆方式+捻向+纱比（%）,中间用空格隔开
    TopOne(item) {
      const that = this
      const yarnType = that.ticone(item, item.yarnTypeInfo, 'label') // 纱线类型
      const composeWay = that.ticone(item, item.composeWayInfo, 'label') // 组合方式
      const coatedWay = that.ticone(item, item.coatedWayInfo, 'label') // 包覆方式
      const twistDirection = that.ticone(item, item.wistDirectionInfo, 'label') // 捻向
      return yarnType + composeWay + coatedWay + twistDirection
    },
    // 天然纤维 纱线描述
    // 1. 天然纤维：纱支+【x】+股数+成份+比例（用/隔开）+纱类+梳棉方法+纺纱方法+捻向,
    // 如果股数是1,则不用加【x】+股数,  如果比例是100,则不需要/隔开,值为空的字段不做拼接,各字段中间用一个空格隔开
    naturalOne(item) {
      const that = this
      const yarn = that.ticone(item, item.yarnInfo, 'label') // 纱支
      const num = item.num ? (item.num === 1 ? ' ' : 'x' + item.num + ' ') : '' // 股数
      const element = that.ticone(item, item.elementInfo, 'label') // 成份
      const elementRatio =
        item.elementRatio && Number(item.elementRatio) === 100
          ? item.elementRatio + ' '
          : item.elementRatio // 成分比例
      const yarnCategory = that.ticone(item, item.yarnCategoryInfo, 'label') // 纱类
      const method = that.ticone(item, item.methodInfo, 'label') // 梳棉方法
      const spinningMethod = that.ticone(
        item,
        item.spinningMethodInfo,
        'label'
      ) // 纺纱方法
      const twistDirection = that.ticone(
        item,
        item.twistDirectionInfo,
        'label'
      ) // 捻向
      return (
        yarn +
        num +
        element +
        elementRatio +
        yarnCategory +
        method +
        spinningMethod +
        twistDirection
      )
    },
    naturalFU(item) {
      // 组合 天然纤维 纱线描述
      const that = this
      const yarn = that.ticone(item, item.naturalFibers_yarnInfo, 'label') // 纱支
      const num = item.naturalFibers_num
        ? item.naturalFibers_num === 1
          ? ' '
          : 'x' + item.naturalFibers_num + ' '
        : '' // 股数
      const element = that.ticone(
        item,
        item.naturalFibers_elementInfo,
        'label'
      ) // 成份
      const elementRatio =
        item.naturalFibers_elementRatio &&
        Number(item.naturalFibers_elementRatio) === 100
          ? item.naturalFibers_elementRatio + ' '
          : item.naturalFibers_elementRatio + ' / ' // 成分比例
      const yarnCategory = that.ticone(
        item,
        item.naturalFibers_yarnCategoryInfo,
        'label'
      ) // 纱类
      const method = that.ticone(item, item.naturalFibers_methodInfo, 'label') // 梳棉方法
      const spinningMethod = that.ticone(
        item,
        item.naturalFibers_spinningMethodInfo,
        'label'
      ) // 纺纱方法
      const twistDirection = that.ticone(
        item,
        item.naturalFibers_twistDirectionInfo,
        'label'
      ) // 捻向
      const yarnRato =
        item.naturalFibers_yarnRato && item.naturalFibers_yarnRato > 0
          ? item.naturalFibers_yarnRato + '%'
          : '' // 纱比
      // console.log(yarn + num + element + elementRatio + yarnCategory + method + spinningMethod + twistDirection + yarnRato)
      return (
        yarn +
        num +
        element +
        elementRatio +
        yarnCategory +
        method +
        spinningMethod +
        twistDirection +
        yarnRato
      )
    },
    // 化学纤维：细度+【x】+组合方式+成份+丝类+品名+网络度+光泽度,
    // 如果组合方式是1,则不用加【x】+组合方式,值为空的字段不做拼接
    chemicalFibersTwo(item) {
      const that = this
      const fineness = that.ticone(item, item.finenessInfo, 'label') // 细度
      const composeWay = item.composeWay
        ? (Number(item.composeWay) === 1 ? '' : 'x' + item.composeWay) + ' '
        : '' // 条数

      const element = that.ticone(item, item.elementInfo, 'label') // 成份
      const wireCategory = that.ticone(item, item.wireCategoryInfo, 'label') // 丝类
      const brand = that.ticone(item, item.brandInfo, 'label') // 品名
      const gridDegree = that.ticone(item, item.gridDegreeInfo, 'label') // 网络度
      const lightDegree = that.ticone(item, item.lightDegreeInfo, 'label') // 光泽度
      // console.log(fineness + composeWay + element + wireCategory + brand + gridDegree + lightDegree)
      return (
        fineness +
        composeWay +
        element +
        wireCategory +
        brand +
        gridDegree +
        lightDegree
      )
    },
    chemicalFibersTwoFU(item) {
      // 组合 化学纤维
      // debugger
      const that = this
      const fineness = that.ticone(
        item,
        item.chemicalFibers_finenessInfo,
        'label'
      ) // 细度
      const som = item.chemicalFibers_composeWay
        ? (Number(item.chemicalFibers_composeWay) === 1
          ? ''
          : 'x' + item.chemicalFibers_composeWay) + ' '
        : ''
      const element = that.ticone(
        item,
        item.chemicalFibers_elementInfo,
        'label'
      ) // 成份
      const wireCategory = that.ticone(
        item,
        item.chemicalFibers_wireCategoryInfo,
        'label'
      ) // 丝类
      const brand = that.ticone(item, item.chemicalFibers_brandInfo, 'label') // 品名
      const gridDegree = that.ticone(
        item,
        item.chemicalFibers_gridDegreeInfo,
        'label'
      ) // 网络度
      const lightDegree = that.ticone(
        item,
        item.chemicalFibers_lightDegreeInfo,
        'label'
      ) // 光泽度
      const yarnRato =
        item.chemicalFibers_yarnRato && item.chemicalFibers_yarnRato > 0
          ? item.chemicalFibers_yarnRato + '%'
          : '' // 纱比
      // console.log(fineness + som + element + wireCategory + brand + gridDegree + lightDegree + yarnRato)
      return (
        fineness +
        som +
        element +
        wireCategory +
        brand +
        gridDegree +
        lightDegree +
        yarnRato
      )
    },
    // 解析成品纱长
    jsoncode(item) {
      if (item) {
        return JSON.parse(item)
      }
    },
    // 请求数据拆分
    initDayData(datas) {
      const comArray = [] // 数组依次显示的id
      if (datas && datas.length > 0) {
        datas.forEach((item, index) => {
          item.details &&
            item.details.length &&
            item.details.forEach((ita, ixa) => {
              const tempObjs = {
                index: index + 1,
                uuid: item.uuid,
                skuId: item.skuId, // 产品编码
                clothId: item.clothId, // 布类ID
                clothType: item.clothType, // 布类
                widthName: item.widthName, // 布封
                weightName: item.weightName, // 克重
                planDelivery: item.planDelivery
                  ? this.$utils.parseTime(item.planDelivery, '{y}-{m}-{d}')
                  : '', // 织计划交期
                knitDelivery: item.knitDelivery
                  ? this.$utils.parseTime(item.knitDelivery, '{y}-{m}-{d}')
                  : '', // 织单交期
                pdfYarnLength: item.pdfYarnLength, // 成品纱长和上机纱长,pdf展示的拼接字符串
                qty: item.qty, // 坯布数量
                procedureId: item.procedureId, // 工艺id
                colorType: item.colorType, // 颜色分类
                dyeProcedure: item.dyeProcedure, // 工艺
                id: ita.id, // 主键
                // uuid: ita.uuid, // uuid
                yarnId: ita.yarnId, // 纱别ID
                yarnName: ita.yarnName, // 纱别
                yarnAttr: ita.yarnAttr, // 纱属性
                factoryColorCode: ita.tfactoryColorCode, // 工厂色号
                knitWastage: ita.knitWastage, // 织损
                yarnNeedQty: ita.yarnNeedQty, // 纱需求量
                yarnCode: ita.yarnCode, // 纱编码
                yarnBatchNumber: ita.yarnBatchNumber, // 纱牌纱批
                yarnColor: ita.yarnColor, // 染纱颜色
                colorPercent: ita.colorPercent, // 颜色占比
                yarnDelivery: ita.yarnDelivery
                  ? this.$utils.parseTime(ita.yarnDelivery, '{y}-{m}-{d}')
                  : '' // 计划到纱期
              }
              comArray.push(tempObjs)
            })

          // comArray.push(...dataom, ...dataoma2)
        })
      }
      console.log(comArray, 'comArray')
      return comArray
    },
    getColspan(index) {
      if (this.cyclesDetails[index]) {
        const colSpanNum =
          this.cyclesDetails[index].s1 - this.cyclesDetails[index].s0 + 1
        return colSpanNum
      }
    },
    allSelectCyclesIndexHandle() {
      var arr = []
      this.cyclesDetails.forEach((n, index) => {
        if (n) {
          for (var i = n.s0; i < n.s1; i++) {
            arr.push(i)
          }
        }
      })
      return Array.from(new Set(arr))
    },
    getClickIndex(dataArray, Im) {
      let sm = ''
      if (dataArray - 1 !== Im) {
        sm = ' /'
      }
      return sm
    },
    // 成品/上机纱长处理
    getMachineYarn(data1, data2) {
      // if (data1 === '0') {
      //   const obj = JSON.parse(data2)
      //   let str1 = ''
      //   let str2 = ''
      //   const that = this
      //   obj.tableForm && obj.tableForm.forEach((ele, im) => {
      //     str1 += (ele.description || '') + ' ' + obj.number + obj.unit + '=' + ele.yarnLength + 'CM ' + that.getClickIndex(obj.tableForm.length, im)
      //     str2 += (ele.description || '') + ' ' + obj.number + obj.unit + '=' + ele.machineYarnLength + 'CM ' + that.getClickIndex(obj.tableForm.length, im)
      //   })
      //   return '成品:' + str1 + ' , ' + '  ' + '  上机:' + str2
      // }
      // return data2 || ''

      if (data2.substr(0, 1) === '{') {
        const obj = JSON.parse(data2)
        let str1 = ''
        let str2 = ''
        const that = this
        obj.tableForm &&
          obj.tableForm.forEach((ele, im) => {
            str1 +=
              (ele.description || '') +
              ' ' +
              obj.number +
              obj.unit +
              '=' +
              ele.yarnLength +
              'CM ' +
              that.getClickIndex(obj.tableForm.length, im)
            str2 +=
              (ele.description || '') +
              ' ' +
              obj.number +
              obj.unit +
              '=' +
              ele.machineYarnLength +
              'CM ' +
              that.getClickIndex(obj.tableForm.length, im)
          })
        return '成品:' + str1 + ' , ' + '  ' + '  上机:' + str2
      } else {
        return data2
      }
    },
    // 工艺要求
    getcheckValList(data) {
      const dataTm = this.detailObj.productInfo
      if (dataTm && dataTm.craftRequire) {
        const craftRequire = JSON.parse(
          this.detailObj.productInfo.craftRequire
        )
        this.codesd = craftRequire
        return (
          craftRequire &&
          craftRequire.reduce((str, item) => {
            if (str) {
              // 普通已经拼好
              str +=
                ',' +
                (item &&
                  (item.parent && item.type !== 1
                    ? item.parent.name + ' / ' + item.name
                    : item.name))
            } else {
              str =
                item &&
                (item.parent && item.type !== 1
                  ? item.parent.name + ' / ' + item.name
                  : item.name)
            }
            return str
          }, '')
        )
      }
    },
    // BLA空白BWA洗前AWA洗后
    getguestSample(data) {
      if (data === 'BLA') {
        return ''
      } else if (data === 'BWA') {
        return '洗前'
      } else if (data === 'AWA') {
        return '洗后'
      }
    },
    getCompositionRatio() {
      // 成份比较拼接
      const dataTm = this.detailObj.materialRequirement
      let su = ''
      if (dataTm) {
        const sm = dataTm.elementRatio ? dataTm.elementRatio : ''
        const sm2 =
          this.ExtractField(2, 'materialRequirement', 'elementInfo') || ''
        console.log('pl', sm, sm2)
        su = sm2 + ' ' + sm
      }
      return su
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
.print-tableouts {
  box-sizing: border-box;
  margin: 20px;
  width: 210mm;
  background: #fff;
}
.print-Oneindexs {
  // 头部
  width: 208mm;
  .printing-tops {
    width: 208mm;
    padding: 0 17px;
    .y_table {
      clear: both;
      width: 100%;
      border-right: 1px solid #d2d2d3;
      border-bottom: 1px solid #d2d2d3;
      td {
        font-weight: normal;
        height: 30px;
        font-size: 12px;
        padding: 3px;
        min-width: 50px;
        border-left: 1px solid #d2d2d3;
        border-top: 1px solid #d2d2d3;
      }
    }
    .printing_table1_h5 {
      font-size: 14px;
      color: #151222;
      letter-spacing: 0;
      height: 32px;
      line-height: 32px;
      text-align: left;
      padding-left: 10px;
      box-sizing: border-box;
      font-weight: 600;
      border-left: 1px solid #d2d2d3;
      border-right: 1px solid #d2d2d3;
    }
    .tips {
      font-size: 12px;
      color: #151222;
      padding-left: 10px;
      height: 32px;
      line-height: 32px;
      border-left: 1px solid #d2d2d3;
      border-right: 1px solid #d2d2d3;
    }
    .printing_table1 {
      td {
        span {
          display: block;
          word-break: break-all;
        }
        .span_x1 {
          min-width: 50px;
        }
        .span_x2 {
          min-width: 121px;
        }
        .span_x3 {
          min-width: 240px;
        }
      }
    }

    .printing_table4 {
      td {
        text-align: center;
        padding: 2px;
      }
    }
    .printing_table5 {
      .title-info {
        display: flex;
        font-size: 12px;
        border: 1px solid #d2d2d3;
        font-weight: normal;
        height: 30px;
        line-height: 30px;
        margin-right: 1px;
        border-bottom: none;
        .title-info_pl {
          flex: 1;
          display: flex;
          .pl_one {
            width: 66px;
            border-left: 1px solid #d2d2d3;
            border-right: 1px solid #d2d2d3;
            padding: 0 8px;
            text-align: center;
          }
          .pl_one2 {
            border-left: none;
            width: 42px;
            padding: 0 4px;
          }
          .pl_two {
            flex: 1;
            padding: 0 5px;
          }
        }
      }

       .head-ul2{
         display: flex;
         flex-wrap: wrap;
         align-items: center;
        //  justify-content: center;
        border-top: 1px solid #d2d2d3;
        border-left: 1px solid #d2d2d3;
         li {
            width: 25%;
            height: 32px;
            color: #151222;
            display: flex;
            align-content: center;
            line-height: 100%;
            span {
              width: 50%;
              color: #474747;
              display: inline-block;
              line-height: 32px;
              text-align: center;
              border-right: 1px solid #d2d2d3;
              border-bottom: 1px solid #d2d2d3;
            }
         }
       }

    }
    .printing_table7,
    .printing_table6 {
      font-size: 12px;
      .y_table {
        // border-bottom:none;
        td {
          min-width: 20px;

          span {
            display: block;
            text-align: center;
            padding: 3px 0px;
            word-break: break-all;
          }
        }
        .line_45px {
          width: 37px;
          padding: 0 4px;
        }
      }
    }
    .printing_table7 {
      .y_table {
        border-bottom: 1px solid #d2d2d3;
      }
    }
  }
}
.print-foots {
  background: #eef5f9;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.lineTd {
  position: relative;
  .lineTd_xian {
    position: absolute;
    width: 50px;
    height: 1px;
    background: #d2d2d3;
    -webkit-transform: rotate(45deg);
    transform: rotate(35deg);
    left: -4px;
    top: 14px;
  }
}
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
.clear {
  clear: both;
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
.wrap-print.yarn-dyeing-print {
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
    // .title3 {
    //   color: #151222;
    //   font-size: 16px;
    //   font-weight: bold;
    //   margin: 20px 0 15px;
    // }
  }
}
</style>
