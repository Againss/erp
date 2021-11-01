<!--
 * @Author: xj
 * @Description: 客样分析打印界面
 * @Date: 2020-12-30 09:40:26
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-01-12 17:36:05
-->
<template>
  <div class="print-tableouts">
    <cs-print :print.sync="qrPrint" :interval="50" :format="'a4'">
      <!-- 页头 -->
      <template v-slot:header>
        <div style="width: 210mm;padding: 20px 17px 18px 17px;">
          <template>
            <prin-top :data-array="detailObj" />
          </template>
        </div>
      </template>
      <!-- 内容 -->
      <div class="print-Oneindexs">
        <div class="printing-tops">
          <div class="printing_top_h4">客样分析工艺单</div>
          <!-- 客来板编号 01 -->
          <div class="printing_table1">
            <table class="y_table" cellspacing="0" cellpadding="0">
              <thead />
              <tbody>
                <tr class="">
                  <td><span class="tle tle2">客来板编号</span></td>
                  <td colspan="3">
                    <span class="span_x2">{{ ExtractField(1,"sampleAnalysisApply","sampleId") }}</span>
                  </td>
                  <td><span class="tle tle2">品牌商</span></td>
                  <td colspan="3">
                    <span class="span_x2">{{ ExtractField(2,"sampleAnalysisApply","brand") }}</span>
                  </td>
                </tr>
                <tr class="">
                  <td><span class="tle">销售员</span></td>
                  <td><span class="span_x1">{{ ExtractField(2,"sampleAnalysisApply","seller") }}</span></td>
                  <td><span class="tle">销售团队</span></td>
                  <td><span class="span_x1">{{ ExtractField(2,"sampleAnalysisApply","sellerTeam") }}</span></td>
                  <td><span class="tle">销售年度</span></td>
                  <td><span class="span_x1">{{ ExtractField(1,"sampleAnalysisApply","year") }}</span></td>
                  <td><span class="tle">销售季度</span></td>
                  <td><span class="span_x1">{{ ExtractField(1,"sampleAnalysisApply","quarter") }}</span></td>
                </tr>
                <tr class="">
                  <td><span class="tle">客服</span></td>
                  <td><span class="span_x1">{{ ExtractField(2,"sampleAnalysisApply","customerService") }}</span></td>
                  <td><span class="tle" style="width: 60px;">是否有客样</span></td>
                  <td><span class="span_x1">{{ detailObj.sampleAnalysisApply&&detailObj.sampleAnalysisApply.isExistSample=== 0 ? '否' : '是' }}</span></td>
                  <td><span class="tle">分析目标</span></td>
                  <td colspan="3"><span class="span_x2">{{ analysisTargetKM(detailObj.sampleAnalysisApply) }}</span></td>
                </tr>
                <tr class="">
                  <td><span class="tle">客户要求</span></td>
                  <td colspan="7"><span class="span_x3">{{ ExtractField(1,"sampleAnalysisApply","requirement") }}</span></td>
                </tr>
              </tbody>
            </table>
            <div class="printing_table1_h5">产品信息</div>
          </div>
          <!--产品信息 02-->
          <div class="printing_table2">
            <table class="y_table" cellspacing="0" cellpadding="0">
              <thead />
              <tbody>
                <tr class="">
                  <td><span class="tle">布类</span></td>
                  <td colspan="3"><span class="span_xm2"> {{ ExtractField(2,"productInfo","clothsTypeInfo") }}</span> </td>
                  <td><span class="tle">面料大类</span></td>
                  <td><span class="span_xm1"> {{ ExtractField(2,"productInfo","fabricCategoryInfo") }}</span></td>
                  <td><span class="tle">成份比例</span></td>
                  <td><span class="span_xm1"> {{ getCompositionRatio() }}</span></td>
                </tr>
                <tr class="">
                  <td><span class="tle">干燥方式</span></td>
                  <td><span class="span_xm1"> {{ ExtractField(2,"productInfo","dryWayInfo") }}</span></td>
                  <td><span class="tle">毛圈</span></td>
                  <td><span class="span_xm1"> {{ ExtractField(2,"productInfo","terryInfo") }}</span></td>
                  <td><span class="tle">毛羽</span></td>
                  <td><span class="span_xm1"> {{ ExtractField(2,"productInfo","hairinessInfo") }}</span></td>
                  <td>
                    <div>
                      <span class="tle">缩水</span><span class="tbk">(LxW)</span>
                    </div>
                  </td>
                  <td><span class="span_xm1"> {{ ExtractField(1,"productInfo","shrinkL") }} {{ 'X'+ ExtractField(1,"productInfo","shrinkW") }}  </span></td>
                </tr>
                <tr class="">
                  <td>
                    <div>
                      <span class="tle">成品布封</span>
                      <span class="tbk">(建议)</span>
                    </div>
                  </td>
                  <td><span class="span_xm1">
                    {{ ExtractField(1,"productInfo","suggestWidth")?ExtractField(1,"productInfo","suggestWidth"):"" }}
                    {{ ExtractField(1,"productInfo","suggestWidthUnit")?ExtractField(1,"productInfo","suggestWidthUnit"):"" }}
                  </span></td>
                  <td>
                    <div>
                      <span class="tle">成品克重</span>
                      <span class="tbk">(建议)</span>
                    </div>
                  </td>
                  <td><span class="span_xm1"> {{ ExtractField(1,"productInfo","suggestWeight")?ExtractField(1,"productInfo","suggestWeight")+" g/m²":"" }}</span></td>
                  <td>
                    <div>
                      <span class="tle">成品克重</span>
                      <span class="tbk">(实测)</span>
                    </div>
                  </td>
                  <td><span class="span_xm1"> {{ ExtractField(1,"productInfo","measuredWeight")?ExtractField(1,"productInfo","measuredWeight")+" g/m²":"" }}</span></td>
                  <td><span class="tle">客样原板</span></td>
                  <td><span class="span_xm1"> {{ getguestSample(detailObj.guestSample) }}</span></td>
                </tr>
                <tr class="">
                  <td><span class="tle">扭度</span></td>
                  <td><span class="span_xm1"> {{ ExtractField(1,"productInfo","twist") }}</span></td>
                  <td><span class="tle">斜度</span></td>
                  <td><span class="span_xm1"> {{ ExtractField(1,"productInfo","slope") }}</span></td>
                  <td><span class="tle">工艺要求</span></td>
                  <td colspan="3" style="max-width: 220px;"><span>
                    {{ getcheckValList() }}
                  </span></td>
                </tr>
                <tr class="">
                  <td><span class="tle">工序流程</span></td>
                  <td colspan="7"><span class="span_xm3"> {{ ExtractField(2,"productInfo","processFlowInfo") }}</span></td>
                </tr>
              </tbody>
            </table>
            <div class="printing_table1_h5">原料信息</div>
          </div>
          <!-- 原料信息 03 -->
          <div class="printing_table3">
            <table class="y_table" cellspacing="0" cellpadding="0">
              <thead>
                <tr>
                  <td style="min-width: 68px;width:18%">
                    <span>纱线种类</span>
                  </td>
                  <td class="" style="min-width: 68px;width:26%">
                    <span>纱线描述</span>
                  </td>
                  <td class="" style="min-width: 68px;width:8%">
                    <span>纱线等级</span>
                  </td>
                  <td class="" style="min-width: 58px;width:8%">
                    <span>纱比%</span>
                  </td>
                  <td class="" style="min-width: 68px;width:40%">
                    <span>成品/上机纱长</span>
                  </td>
                </tr>
              </thead>
              <tbody>
                <!-- 原料要求-天然纤维 -->
                <template v-if="detailObj.naturalFibers&&detailObj.naturalFibers.length">
                  <tr v-for="(item1, iex1) in detailObj.naturalFibers" :key="'天然'+iex1" class="table3_tr">
                    <!-- 纱线种类 -->
                    <td class="" style="min-width: 68px;">
                      <span>天然纤维</span>
                    </td>
                    <!-- 纱线描述 -->
                    <td class="" style="min-width: 68px;">
                      <span>{{ naturalOne(item1) }}</span>
                    </td>
                    <!-- 纱线等级 -->
                    <td class="" style="min-width: 68px;">
                      <span>{{ item1.yarnLevel }}</span>
                    </td>
                    <!-- 纱比% -->
                    <td style="min-width: 68px;">
                      <span>{{ item1.yarnRato?item1.yarnRato+"%":"" }}</span>
                    </td>
                    <!-- 成品纱长/上机纱长-->
                    <td class="" style="min-width: 120px;">
                      <span>{{ getMachineYarn(item1.type,item1.yarnLength) }}</span>
                    </td>
                  </tr>
                </template>
                <!-- 原料要求-化学纤维 -->
                <template v-if="detailObj.chemicalFibers&&detailObj.chemicalFibers.length">
                  <tr v-for="(item2, iex2) in detailObj.chemicalFibers" :key="'化学'+iex2" class="table3_tr">
                    <!-- 纱线种类 -->
                    <td class="" style="min-width: 68px;">
                      <span>化学纤维</span>
                    </td>
                    <!-- 纱线描述 -->
                    <td class="" style="min-width: 68px;">
                      <span>{{ chemicalFibersTwo(item2) }}</span>
                    </td>
                    <!-- 纱线等级 -->
                    <td class="" style="min-width: 68px;">
                      <span>{{ item2.yarnLevel }}</span>
                    </td>
                    <!-- 纱比% -->
                    <td style="min-width: 68px;">
                      <span>{{ item2.yarnRato?item2.yarnRato+"%":"" }}</span>
                    </td>
                    <!-- 成品纱长 -->
                    <td class="" style="min-width: 68px;">
                      <span>{{ getMachineYarn(item2.type,item2.yarnLength) }}</span>
                    </td>
                  </tr>
                </template>
                <!-- 原料要求-组合纱线  -->
                <template v-if="detailObj.dtatTom&&detailObj.dtatTom.length">
                  <tr v-for="(item3, iex3) in detailObj.dtatTom" :key="'组合'+iex3" class="table3_tr">
                    <!-- 纱线种类 -->
                    <td v-if="getrowspan(iex3)" class="" style="min-width: 68px;" :rowspan="getrowspan(iex3)">
                      <span>{{ TopOne(item3) }}</span>
                    </td>
                    <!-- 纱线描述 -->
                    <td class="" style="min-width: 68px;">
                      <span v-if="item3.sumType===1">{{ naturalFU(item3) }}</span>
                      <span v-if="item3.sumType===2">{{ chemicalFibersTwoFU(item3) }}</span>
                    </td>
                    <!-- 纱线等级 -->
                    <td class="" style="min-width: 68px;">
                      <span>{{ item3.yarnLevel }}</span>
                    </td>
                    <!-- 纱比% -->
                    <td v-if="getrowspan(iex3)" style="min-width: 68px;" :rowspan="getrowspan(iex3)">
                      <span>{{ item3.yarnRato?item3.yarnRato+"%":"" }}</span>
                    </td>
                    <!-- 成品纱长 -->
                    <td class="" style="min-width: 68px;">
                      <span v-if="item3.sumType===1">{{ getMachineYarn(item3.naturalFibers_type,item3.naturalFibers_yarnLength) }}</span>
                      <span v-if="item3.sumType===2">{{ getMachineYarn(item3.chemicalFibers_type,item3.chemicalFibers_yarnLength) }}</span>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
            <div class="printing_table1_h5">用料实测</div>
          </div>
          <!-- 用料实测 04 -->
          <div class="printing_table4">
            <table class="y_table" cellspacing="0" cellpadding="0">
              <thead>
                <tr>
                  <td style="min-width: 68px;width:17%">
                    <span>纱支/细度</span>
                  </td>
                  <td class="" style="min-width: 68px;width:17%">
                    <span>成份</span>
                  </td>
                  <td class="" style="min-width: 68px;width:12%">
                    <span>实测纱比%</span>
                  </td>
                  <!-- <td class="" style="min-width: 68px;width:12%">
                    <span>理论纱比</span>
                  </td> -->
                  <td class="" style="min-width: 68px;width:15%">
                    <span>条纹间距</span>
                  </td>
                  <td class="" style="min-width: 68px;width:27%">
                    <span>颜色</span>
                  </td>
                </tr>
              </thead>
              <tbody>
                <template v-if="detailObj.materialMeasurements&&detailObj.materialMeasurements.length">
                  <!-- 纱支/细度 -->
                  <tr v-for="(item, ie2x) in detailObj.materialMeasurements" :key="ie2x" class="table3_tr">
                    <td class="" style="min-width: 68px;">
                      <span>{{ item.yarn?item.yarn:"" }}</span>
                    </td>
                    <!-- 成份 -->
                    <td class="" style="min-width: 68px;">
                      <span>{{ item.element? jsoncode(item.element)?jsoncode(item.element).label:'':"" }}</span>
                    </td>
                    <!-- 实测纱比% -->
                    <td class="" style="min-width: 68px;">
                      <span>{{ item.materiaYarnRate?item.materiaYarnRate:"" }}</span>
                    </td>
                    <!-- 理论纱比 -->
                    <!-- <td class="" style="min-width: 68px;">
                      <span>{{ item.theoryYarnRate?item.theoryYarnRate:"" }}</span>
                    </td> -->
                    <!-- 条纹间距 -->
                    <td class="" style="min-width: 68px;">
                      <span>{{ item.stripeSpacing?item.stripeSpacing:"" }}</span>
                    </td>
                    <!-- 颜色 -->
                    <td class="" style="min-width: 68px;width:47%">
                      <span>{{ item.color?item.color:"" }}</span>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          <!-- 上机工艺 05 -->
          <div class="printing_table5">
            <div class="printing_table1_h5">上机工艺</div>
            <div class="title-info">
              <div class="title-info_pl">
                <div class="pl_one pl_one2">针数:</div>
                <div class="pl_two">{{ ExtractField(1,"machineTechnology","stitchNum")?ExtractField(1,"machineTechnology","stitchNum")+'G':"" }}</div>
              </div>
              <div class="title-info_pl">
                <div class="pl_one">寸数：</div>
                <div class="pl_two">{{ ExtractField(1,"machineTechnology","inch")?ExtractField(1,"machineTechnology","inch")+'"':"" }}</div>
              </div>
              <div class="title-info_pl">
                <div class="pl_one">总针数:</div>
                <div class="pl_two">{{ ExtractField(1,"machineTechnology","totalStitchNum")?ExtractField(1,"machineTechnology","totalStitchNum")+'N':"" }}</div>
              </div>
              <div class="title-info_pl">
                <div class="pl_one">CPI:</div>
                <div class="pl_two">{{ ExtractField(1,"machineTechnology","cpi") }}  </div>
              </div>
              <div class="title-info_pl">
                <div class="pl_one">WPI:</div>
                <div class="pl_two">{{ ExtractField(1,"machineTechnology","wpi") }}  </div>
              </div>
            </div>
          </div>
          <!-- 上针下针 -->
          <div class="printing_table6">
            <table class="y_table" cellspacing="0" cellpadding="0">
              <thead>
                <tr>
                  <td class="lineTd line_45px">
                    <div class="lineTd_xian" />
                  </td>
                  <td v-for="(item5, index5) in 30" :key="index5" width="21px"><span>{{ index5 + 1 }}</span> </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="lineTd line_45px">
                    <span class="te">上针</span>
                  </td>
                  <template v-if="stitchMap.length">
                    <td v-for="(item6, index6) in stitchMap[0].slice(0,30)" :key="'上针'+index6" width="21px"><span v-if="stitchMap[0].length<31">{{ item6 }}</span></td>
                  </template>
                </tr>
                <tr>
                  <td><span class="te">下针</span></td>
                  <template v-if="stitchMap.length">
                    <td v-for="(item7, index7) in stitchMap[1].slice(0,30)" :key="'下针'+index7" width="21px"><span v-if="stitchMap[1].length<31">{{ item7 }}</span></td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 上盘下盘 排纱 循环次数-->
          <div v-if="Object.keys(triangleMap).length" class="printing_table7">
            <table class="y_table" cellspacing="0" cellpadding="0">
              <thead>
                <tr>
                  <td class="lineTd line_45px">
                    <div class="lineTd_xian" />
                  </td>
                  <td v-for="(item, index) in 30" :key="index" width="21px"><span>{{ index + 1 }}</span> </td>
                </tr>
              </thead>
              <tbody>
                <!-- 上盘 -->
                <tr v-for="(itemp, inTop) in triangleMap.plateTop" :key="'上盘'+inTop">
                  <td v-if="!inTop" class="lineTd line_45px" rowspan="2">
                    <span class="te">上盘</span>
                  </td>
                  <td v-for="(itemps, inTops) in itemp.slice(0,30)" :key="inTops" width="21px">
                    <span v-if="itemp.length<31">{{ itemps }}</span>
                  </td>
                </tr>
                <!-- 下盘 -->
                <tr v-for="(itemBot, indexBot) in triangleMap.plateBottom" :key="'下盘'+indexBot">
                  <td v-if="!indexBot" rowspan="4"><span class="te">下盘</span></td>
                  <td v-for="(itemBots, indexBots) in itemBot.slice(0,30)" :key="indexBots" width="21px">
                    <span v-if="itemBot.length<31">{{ itemBots }}</span>
                  </td>
                </tr>
                <!-- 排纱 -->
                <tr v-for="(itemRow, indexRow) in triangleMap.yarnRow" :key="'排纱'+indexRow">
                  <td><span class="te">排纱</span></td>
                  <td v-for="(itemRows, indexRows) in itemRow.slice(0,30)" :key="indexRows" width="21px">
                    <span v-if="itemRow.length<31">{{ itemRows }}</span>
                  </td>
                </tr>
                <!-- 循环 -->
                <tr v-if="triangleMap.cyclesDetails&&triangleMap.cyclesDetails.length">
                  <td><span class="te">循环<br>次数</span></td>
                  <template v-for="(itemes, ines) in triangleMap.cyclesDetails[0].slice(0,30)">
                    <td v-if="tdShow(ines)" :key="'循环'+ines" :colspan="getColspan(ines)" width="21px"><span v-if="triangleMap.cyclesDetails[0].length<31">{{ itemes.value }}</span></td>
                  </template>
                </tr>
              </tbody>
            </table>

          </div>
          <!-- 备注 评审意见-->
          <div class="printing_table8">
            <table class="y_table" cellspacing="0" cellpadding="0">
              <thead />
              <tbody>
                <tr>
                  <td class="table7_h2" style="width: 10%;"><span>备注</span></td>
                  <td colspan="1" style="width: 36%;"><span>{{ detailObj.remark }}</span></td>
                  <td colspan="6" style="width: 53%;" rowspan="2">
                    <div class="table8_h4">
                      <div class="table8_h5">布板粘胶处<br>（贴样）</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class=" table7_h2 table8_h2"><span class="te">评审意见</span></td>
                  <td colspan="1">
                    <span>{{ detailObj.reviewOpinion }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- 页尾 -->
      <template v-slot:footer>
        <div style="width: 201mm;min-height: 30px; padding: 17px 0;">
          <template v-if="Object.keys(detailObj).length">
            <prin-bottom :data-bott="detailObj" />
          </template>
        </div>
      </template>
    </cs-print>
    <div style="width: 100%;height: 15px;" />
    <div class="print-foots">
      <el-button @click="qrPrintHandle">打印</el-button>
      <el-button @click="pintBack">关闭</el-button>
    </div>
  </div>
</template>

<script>
import prinTop from './components/prinTop'
import prinBottom from './components/prinBottom.vue'
import { getDetail } from './api/index.js'
import { isArray } from '@/utils/validate'
export default {
  components: {
    prinTop,
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
        cycles: new Array(1).fill(new Array(30).fill(''))// 循环次数
      },
      // isstitchMap:[],
      // istriangleMap,
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
    if (this.$route.query.id) {
      this.getDetailFun(this.$route.query.id)
    }
  },
  mounted() {},
  methods: {
    qrPrintHandle() {
      this.qrPrint = true
    },
    pintBack() {
      if (this.$route.query.id) {
        this.$router.push(`./detail/${this.$route.query.id}`)
      }
    },
    // 获取分析单详情
    async getDetailFun(id) {
      const sm = (await getDetail({ csSampleAnalysisApplayId: id })).data || {}
      // 上针下针  上盘下盘 排纱 循环次数
      if (sm && sm.machineTechnology && sm.machineTechnology.stitchMap) { // 排针图
        const stitchMap = JSON.parse(sm.machineTechnology.stitchMap)
        if (isArray(stitchMap) && stitchMap.length) {
          this.stitchMap = stitchMap
        } else {
          this.stitchMap = [[...this.pinTopList], [...this.pinBottomList]]
        }
      } else {
        this.stitchMap = [[...this.pinTopList], [...this.pinBottomList]]
      }
      // 详情排三角图数据处理
      let triangleMaps = {}
      if (sm.machineTechnology && sm.machineTechnology.triangleMap) {
        triangleMaps = JSON.parse(sm.machineTechnology.triangleMap) || {}
      } else {
        triangleMaps = {
          ...this.triangleMap,
          cycles: new Array(1).fill(new Array(30).fill('')),
          cyclesDetails: new Array(1).fill(new Array(30).fill(''))
        }
      }
      this.triangleMap = triangleMaps
      sm.dtatTom = this.initDayData(sm.composeYarns) // 合并单元格
      sm.dtatTom.length && this.dataPretreatment(sm.dtatTom)
      this.detailObj = sm
    },
    // 申请信息
    analysisTargetKM(data) { // 分析目标
      if (data) {
        const v = data
        let muDi = ''
        if (v.analysisTarget) {
          v.analysisTarget.split('|').forEach(ele => {
            muDi += ele === 'O' ? '报价、' : (ele === 'D' ? '样板、' : (ele === 'S' ? '大货、' : ''))
          })
        }
        return muDi ? muDi.slice(0, -1) : muDi
      }
    },
    // 产品信息
    // 数据类型type 1 {} 2 "string"
    // 数据源 data
    // 提取的字段 name
    ExtractField(type = 1, data = {}, name) { // 提取字段
      if (!Object.keys(this.detailObj).length) { return }
      if (type === 1) {
        return this.detailObj[data] && this.detailObj[data][name] ? this.detailObj[data][name] : ''
      } else if (type === 2) {
        return this.detailObj[data] && this.detailObj[data][name] ? this.detailObj[data][name].label : ''
      }
    },
    // 处理表格的合并的数据，找到要合并的数组
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
          if (datas[i].id && datas[i - 1].id) {
            // 哪些数据是要合并的 合并的条件是什么
            if (datas[i].id === datas[i - 1].id) {
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
    // 表头文字组合 组合纱线内的组合字段：纱线类型+组合方式+包覆方式+捻向+纱比（%），中间用空格隔开
    TopOne(item) {
      const that = this
      const yarnType = that.ticone(item, item.yarnTypeInfo, 'label') // 纱线类型
      const composeWay = that.ticone(item, item.composeWayInfo, 'label')// 组合方式
      const coatedWay = that.ticone(item, item.coatedWayInfo, 'label')// 包覆方式
      const twistDirection = that.ticone(item, item.wistDirectionInfo, 'label') // 捻向
      return yarnType + composeWay + coatedWay + twistDirection
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
    naturalFU(item) { // 组合 天然纤维 纱线描述
      const that = this
      const yarn = that.ticone(item, item.naturalFibers_yarnInfo, 'label') // 纱支
      const num = item.naturalFibers_num ? (item.naturalFibers_num === 1 ? ' ' : 'x' + item.naturalFibers_num + ' ') : ''// 股数
      const element = that.ticone(item, item.naturalFibers_elementInfo, 'label')// 成份
      const elementRatio = item.naturalFibers_elementRatio && Number(item.naturalFibers_elementRatio) === 100 ? item.naturalFibers_elementRatio + ' ' : item.naturalFibers_elementRatio + ' / ' // 成分比例
      const yarnCategory = that.ticone(item, item.naturalFibers_yarnCategoryInfo, 'label') // 纱类
      const method = that.ticone(item, item.naturalFibers_methodInfo, 'label') // 梳棉方法
      const spinningMethod = that.ticone(item, item.naturalFibers_spinningMethodInfo, 'label') // 纺纱方法
      const twistDirection = that.ticone(item, item.naturalFibers_twistDirectionInfo, 'label') // 捻向
      const yarnRato = item.naturalFibers_yarnRato && item.naturalFibers_yarnRato > 0 ? item.naturalFibers_yarnRato + '%' : '' // 纱比
      // console.log(yarn + num + element + elementRatio + yarnCategory + method + spinningMethod + twistDirection + yarnRato)
      return yarn + num + element + elementRatio + yarnCategory + method + spinningMethod + twistDirection + yarnRato
    },
    // 化学纤维：细度+【x】+组合方式+成份+丝类+品名+网络度+光泽度，
    // 如果组合方式是1，则不用加【x】+组合方式，值为空的字段不做拼接
    chemicalFibersTwo(item) {
      const that = this
      const fineness = that.ticone(item, item.finenessInfo, 'label') // 细度
      const composeWay = item.composeWay ? (Number(item.composeWay) === 1 ? '' : 'x' + item.composeWay) + ' ' : ''// 条数

      const element = that.ticone(item, item.elementInfo, 'label') // 成份
      const wireCategory = that.ticone(item, item.wireCategoryInfo, 'label') // 丝类
      const brand = that.ticone(item, item.brandInfo, 'label') // 品名
      const gridDegree = that.ticone(item, item.gridDegreeInfo, 'label') // 网络度
      const lightDegree = that.ticone(item, item.lightDegreeInfo, 'label') // 光泽度
      // console.log(fineness + composeWay + element + wireCategory + brand + gridDegree + lightDegree)
      return fineness + composeWay + element + wireCategory + brand + gridDegree + lightDegree
    },
    chemicalFibersTwoFU(item) { // 组合 化学纤维
      // debugger
      const that = this
      const fineness = that.ticone(item, item.chemicalFibers_finenessInfo, 'label') // 细度
      const som = item.chemicalFibers_composeWay ? (Number(item.chemicalFibers_composeWay) === 1 ? '' : 'x' + item.chemicalFibers_composeWay) + ' ' : ''
      const element = that.ticone(item, item.chemicalFibers_elementInfo, 'label') // 成份
      const wireCategory = that.ticone(item, item.chemicalFibers_wireCategoryInfo, 'label') // 丝类
      const brand = that.ticone(item, item.chemicalFibers_brandInfo, 'label') // 品名
      const gridDegree = that.ticone(item, item.chemicalFibers_gridDegreeInfo, 'label') // 网络度
      const lightDegree = that.ticone(item, item.chemicalFibers_lightDegreeInfo, 'label') // 光泽度
      const yarnRato = item.chemicalFibers_yarnRato && item.chemicalFibers_yarnRato > 0 ? item.chemicalFibers_yarnRato + '%' : '' // 纱比
      // console.log(fineness + som + element + wireCategory + brand + gridDegree + lightDegree + yarnRato)
      return fineness + som + element + wireCategory + brand + gridDegree + lightDegree + yarnRato
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
        datas.forEach(item => {
          var dataom = []; var dataoma2 = []
          item.naturalFiberUpdateReqtList && item.naturalFiberUpdateReqtList.length && item.naturalFiberUpdateReqtList.forEach((ita, ixa) => {
            const tempObjs = {
              id: item.id, // 主键
              yarnTypeInfo: item.yarnTypeInfo, // 纱线类型
              composeWayInfo: item.composeWayInfo, // 组合方式
              coatedWayInfo: item.coatedWayInfo, // 包覆方式
              wistDirectionInfo: item.twistDirectionInfo, // 捻向
              yarnRato: item.yarnRato, // 纱比
              sumType: 1,
              yarnLevel: ita.yarnLevel, // 纱等级
              pdfYarnLength: ita.pdfYarnLength, // 成品纱长和上机纱长，pdf展示的拼接字符串
              naturalFibers_id: ita.id, // 组合-自然纤维 主键
              naturalFibers_yarnInfo: ita.yarnInfo, // 纱支
              naturalFibers_num: ita.num || '', // 股数
              naturalFibers_elementInfo: ita.elementInfo, // 成分
              naturalFibers_elementRatio: ita.elementRatio, // 成分比例
              naturalFibers_methodInfo: ita.methodInfo, // 梳棉方法
              naturalFibers_spinningMethodInfo: ita.spinningMethodInfo, // 纺纱方法
              naturalFibers_twistDirectionInfo: ita.twistDirectionInfo, // 捻向
              naturalFibers_yarnCategoryInfo: ita.yarnCategoryInfo, // 纱类
              naturalFibers_yarnLevel: ita.yarnLevel, // 纱线等级 A, B, C, D, E
              naturalFibers_yarnLength: ita.yarnLength, // 成品纱长和上机纱长，json
              naturalFibers_yarnRato: ita.yarnRato, // 纱比
              naturalFibers_type: ita.type, // 类型： 0 普通布种 ； 1 特殊布种
              naturalFibers_materialRequirementId: ita.materialRequirementId// 组合-自然纤维 主键
            }
            dataom.push(tempObjs)
          })
          item.chemicalFiberUpdateReqtList && item.chemicalFiberUpdateReqtList.length && item.chemicalFiberUpdateReqtList.forEach((itc, ixc) => {
            const tempObj = {
              id: item.id, // 主键
              yarnTypeInfo: item.yarnTypeInfo, // 纱线类型
              composeWayInfo: item.composeWayInfo, // 组合方式
              coatedWayInfo: item.coatedWayInfo, // 包覆方式
              wistDirectionInfo: item.twistDirectionInfo, // 捻向
              yarnRato: item.yarnRato, // 纱比
              sumType: 2,
              yarnLevel: itc.yarnLevel, // 纱等级
              pdfYarnLength: itc.pdfYarnLength, // 成品纱长和上机纱长，pdf展示的拼接字符串
              chemicalFibers_id: itc.id, // 组合-化学纤维 主键
              chemicalFibers_finenessInfo: itc.finenessInfo, // 细度
              chemicalFibers_elementInfo: itc.elementInfo, // 成分
              chemicalFibers_brandInfo: itc.brandInfo, // 品牌
              chemicalFibers_wireCategoryInfo: itc.wireCategoryInfo, // 丝类
              chemicalFibers_gridDegreeInfo: itc.gridDegreeInfo, // 网络度
              chemicalFibers_lightDegreeInfo: itc.lightDegreeInfo, // 光泽度
              chemicalFibers_composeWay: itc.composeWay, // 组合方式
              chemicalFibers_yarnLevel: itc.yarnLevel, // 纱等级
              chemicalFibers_yarnLength: itc.yarnLength, // 成品纱长和上机纱长，json
              chemicalFibers_yarnRato: itc.yarnRato, // 纱比
              chemicalFibers_type: itc.type// 类型： 0 普通布种 ； 1 特殊布种
            }
            dataoma2.push(tempObj)
          })
          comArray.push(...dataom, ...dataoma2)
        })
      }
      return comArray
    },
    getColspan(index) {
      if (this.cyclesDetails[index]) {
        const colSpanNum = this.cyclesDetails[index].s1 - this.cyclesDetails[index].s0 + 1
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
      if ((dataArray - 1) !== Im) { sm = ' /' }
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
        obj.tableForm && obj.tableForm.forEach((ele, im) => {
          str1 += (ele.description || '') + ' ' + obj.number + obj.unit + '=' + ele.yarnLength + 'CM ' + that.getClickIndex(obj.tableForm.length, im)
          str2 += (ele.description || '') + ' ' + obj.number + obj.unit + '=' + ele.machineYarnLength + 'CM ' + that.getClickIndex(obj.tableForm.length, im)
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
        const craftRequire = JSON.parse(this.detailObj.productInfo.craftRequire)
        this.codesd = craftRequire
        return craftRequire && craftRequire.reduce((str, item) => {
          if (str) {
          // 普通已经拼好
            str += ',' + (item && (item.parent && item.type !== 1 ? (item.parent.name + ' / ' + item.name) : item.name))
          } else {
            str = (item && (item.parent && item.type !== 1 ? (item.parent.name + ' / ' + item.name) : item.name))
          }
          return str
        }, '')
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
    getCompositionRatio() { // 成份比较拼接
      const dataTm = this.detailObj.materialRequirement
      let su = ''
      if (dataTm) {
        const sm = dataTm.elementRatio ? dataTm.elementRatio : ''
        const sm2 = this.ExtractField(2, 'materialRequirement', 'elementInfo') || ''
        console.log('pl', sm, sm2)
        su = sm2 + ' ' + sm
      }
      return su
    }
  }
}
</script>

<style lang="scss" scoped>
  .print-tableouts{
    box-sizing: border-box;
    margin:20px;
    width: 210mm;
    background: #fff;
  }
  .print-Oneindexs{// 头部
    width: 210mm;
    .printing-tops{
      width: 210mm;
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
        border-right: 1px solid #D2D2D3;
        border-bottom: 1px solid #D2D2D3;
        td {
          font-weight: normal;
          height: 30px;
          font-size: 12px;
          padding: 3px;
          min-width: 50px;
          border-left: 1px solid #D2D2D3;
          border-top: 1px solid #D2D2D3;
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
    background: #eef5f9;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .y_table>thead>tr>td,.y_table>tbody>tr>td{
    // border-left: 1px solid #D2D2D3;
    // border-top: 1px solid #D2D2D3;
  }
  .tle{
    display: block;
    text-align: justify;
    text-align-last: justify;
    padding: 3px 0px;
    width: 50px;
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
