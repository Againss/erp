<!--
 * @Date: 2021-05-25 16:52:34
 * @Author: Againss
 * @LastEditTime: 2021-06-03 14:24:28
 * @LastEditors: Againss
 * @Descripttion:预览页面
-->
<template>
  <div class="offer-add-edit-pre">
    <div class="heard-fixed">
      <div :style="{width:scrollwidth+'px',background:'#fff'}">
        <el-scrollbar
          ref="scrollbar"
          :key="totalDataList.length"
          :view-style="{margin:'20px 20px 10px'}"
        >
          <div class="tabs">
            <div v-for="(item, index) in totalDataList" :key="index" class="tabItem" :class="{'lastitem':index===totalDataList.length-1}">
              <div class="tabItem-b">
                <div class="btn" :class="{active:editableTabsValue === index}" @click="editableTabsValue = index">{{ /crm/.test(branch) ? getFabricName(item) : item.fabricName }}</div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div class="anchorPoint myanchorPoint">
        <a v-for="(item, index) in costGroup" :key="index" :name="'point' + index" href="javascript:void(0)" class="pointItem" :class="{'actived': anchorPointIndex === index}" @click="anchorPoint(index, `#point${index}`)">
          <span class="con-text">{{ item }}</span>
          <el-divider v-if="index !== costGroup.length-1" direction="vertical" />
        </a>
      </div>
    </div>
    <div class="content">
      <!-- 数量 -->
      <div id="point0" class="point-anch quantity">
        <div class="header">
          <span clang="title">数量</span>
        </div>
        <!-- table表格 -->
        <div v-if="quantityData.length !== 0" class="page-table">
          <cs-custom-table
            tooltip-effect="dark"
            :header-cell-style="headerRowStyle"
            :columns="quantityColumns"
            :data-source="quantityData"
            edit-type="pop"
          />
        </div>
      </div>
      <!-- 纱成本 -->
      <div id="point1" class="point-anch yarn">
        <div class="header-btn" />
        <div class="header">
          <span class="title">纱成本</span>
          <span class="subtotal">成本小计: <span class="money">{{ '￥' + yarnCost }}</span></span>
        </div>
        <div v-show="getYarnList('S').length">
          <div class="subhead">短纤</div>
          <div class="page-table">
            <cs-custom-table
              tooltip-effect="dark"
              :header-cell-style="headerRowStyle"
              :columns="yarnSpunColumns"
              :data-source="getYarnList('S')"
              edit-type="pop"
            />
          </div>
        </div>
        <div v-show="getYarnList('F').length">
          <div class="subhead">长丝</div>
          <div class="page-table" style="padding-bottom: 20px;">
            <cs-custom-table
              tooltip-effect="dark"
              :header-cell-style="headerRowStyle"
              :columns="yarnFilamentColumns"
              :data-source="getYarnList('F')"
              edit-type="pop"
            />
          </div>
        </div>
      </div>
      <!-- 原材料成本 -->
      <div id="point2" class="point-anch material">
        <div class="header-btn" />
        <div class="header">
          <span class="title">原材料成本</span>
          <span class="subtotal">成本小计: <span class="money">{{ '￥' + materialCost }}</span></span>
        </div>
        <!-- table表格 -->
        <div v-if="wovenLossList.length !== 0">
          <div class="subhead">织损耗</div>
          <div class="page-table">
            <cs-custom-table
              tooltip-effect="dark"
              :header-cell-style="headerRowStyle"
              :columns="materialBaseColumns"
              :data-source="wovenLossList"
              edit-type="pop"
            />
          </div>
        </div>
      </div>
      <!-- 坯布成本 -->
      <div id="point3" class="point-anch cloth">
        <div class="header-btn" />
        <div class="header">
          <span class="title">坯布成本</span>
          <span class="subtotal">成本小计: <span class="money">{{ '￥' + fabricCost }}</span></span>
        </div>
        <div v-if="wovenTechList.length !== 0">
          <div class="subhead">织工</div>
          <!-- table表格 -->
          <div class="page-table">
            <cs-custom-table
              tooltip-effect="dark"
              :header-cell-style="headerRowStyle"
              :columns="clothBaseColumns"
              :data-source="wovenTechList"
              edit-type="pop"
            />
          </div>
        </div>
      </div>
      <!-- 生产成本 -->
      <div id="point4" class="point-anch production">
        <div class="header-btn" />
        <div class="header">
          <span class="title">生产成本</span>
          <span class="subtotal">成本小计: <span class="money">{{ '￥' + productionCost }}</span></span>
        </div>
        <div v-if="dyeingTechList.length !== 0">
          <div class="subhead">染色
          </div>
          <div class="page-table">
            <cs-custom-table
              tooltip-effect="dark"
              :header-cell-style="headerRowStyle"
              :columns="productDyeingViewColumns"
              :data-source="dyeingTechList"
              edit-type="pop"
            />
          </div>
        </div>
        <div v-if="afterfinishLossList.length !== 0">
          <div class="subhead"> 后整 </div>
          <div class="page-table">
            <cs-custom-table
              tooltip-effect="dark"
              :header-cell-style="headerRowStyle"
              :columns="productPostIntegrationLossBaseColumns"
              :data-source="afterfinishLossList"
              edit-type="pop"
            />
          </div>
        </div>
        <div v-if="functionLossList.length !== 0">
          <div style="margin: 0 20px">
            <div class="subhead">功能</div>
            <div class="page-table">
              <cs-custom-table
                tooltip-effect="dark"
                :header-cell-style="headerRowStyle"
                :columns="productFunctionLossBaseColumns"
                :data-source="functionLossList"
                edit-type="pop"
              />
            </div>
          </div>
        </div>
        <div v-if="majorPrintingTechList.length !== 0">
          <div>
            <div class="subhead">主要印花</div>
            <div class="page-table">
              <cs-custom-table
                tooltip-effect="dark"
                :header-cell-style="headerRowStyle"
                :columns="otherProductMainPrintingViewColumns"
                :data-source="majorPrintingTechList"
                edit-type="pop"
              />
            </div>
          </div>
        </div>
        <div v-if="majorPrintingTechList && majorPrintingTechList.length !== 0">
          <div class="">
            <div class="subhead">次要印花</div>
            <div class="page-table">
              <cs-custom-table
                tooltip-effect="dark"
                :header-cell-style="headerRowStyle"
                :columns="otherProductSecondaryPrintingBaseColumns"
                :data-source="majorPrintingTechList[0].minorPrintingTechList"
                edit-type="pop"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 财务成本 -->
      <div id="point5" class="point-anch finance">
        <div class="header-btn" />
        <div class="header">
          <span class="title">财务成本</span>
          <span class="subtotal">成本小计: <span class="money">{{ '￥' + financialCost }}</span></span>
        </div>
        <div v-if="paymentMethodList.length !== 0">
          <div class="subhead">付款条件</div>
          <div class="page-table">
            <cs-custom-table
              tooltip-effect="dark"
              :header-cell-style="headerRowStyle"
              :columns="financePaymentBaseColumns"
              :data-source="paymentMethodList"
              edit-type="pop"
            />
          </div>
        </div>
      </div>
      <!-- 运输成本 -->
      <div id="point6" class="point-anch transport">
        <div class="header-btn" />
        <div class="header">
          <span class="title">运输成本</span>
          <span class="subtotal">成本小计: <span class="money">{{ '￥' + freightCost }}</span></span>
        </div>
        <div v-if="freightList.length">
          <div class="subhead">运费</div>
          <div class="page-table">
            <cs-custom-table
              tooltip-effect="dark"
              :header-cell-style="headerRowStyle"
              :columns="( freightList[0].priceClauseName === 'EXW') ? NexwColumn :freightList[0].freightType === 'D' ? transportFreightDomesticViewColumns : freightList[0].freightType === 'I' ? transportFreightInternationalViewColumns : transportNoFreighColumns"
              :data-source="freightList"
              edit-type="pop"
            />
          </div>
        </div>
      </div>
      <!-- 测试成本 -->
      <div id="point7" class="point-anch test">
        <div class="header-btn" />
        <div class="header">
          <span class="title">测试成本</span>
          <span class="subtotal">成本小计: <span class="money">{{ '￥' + testCost }}</span></span>
        </div>
        <div v-if="testCostList.length">
          <div class="subhead">测试方式</div>
          <div class="page-table">
            <cs-custom-table
              tooltip-effect="dark"
              :header-cell-style="headerRowStyle"
              :columns="testTestBaseColumns"
              :data-source="testCostList"
              edit-type="pop"
            />
          </div>
        </div>
      </div>

      <div id="point8" class="point-anch">
        <div class="header-btn" />
        <!-- 成本合计 -->
        <div class="totalCost">
          <div class="header country-name">
            <span class="title" :class="/crm/.test(branch) ? '' : 'country-name'">成本合计/kg</span>
            <span class="area" :style="/crm/.test(branch) ? '' : 'margin-right: 20px;'">国家/地区： {{ areaData.countryName }}</span>
            <span class="total">成本合计(￥): <span class="money">{{ totalCost }}</span></span>
            <span class="profit">目标利润率<span class="money">{{ (areaData.targetProfitRate ? (areaData.targetProfitRate * 1).toFixed(2): '0.00') + '%' }}</span></span>
          </div>
        </div>
        <!-- 销售价格 -->
        <div class=" sellingPrice">
          <div class="header">
            <span class="title">销售价格/kg</span>
            <span class="total">销售价格(￥): <span class="money">{{ sellingPrice||'0.00 ' }}</span></span>
            <span class="profit">实际利润率<span class="money">{{ actualProfitRate + '%' }}</span></span>
          </div>
        </div>
        <!-- 退税价格/kg -->
        <div class=" sellingPrice">
          <div class="header">
            <span class="title">退税价格/kg</span>
            <span class="total">退税价格(￥): <span class="money">{{ taxRebateMark?( productionCost&&$utils.getFloat((productionCost-$utils.getFloat(productionCost/1.115,4)),4)||0.00 ):'0.00' }}</span></span>
            <span class="taxRebateMark profit">{{ taxRebateMark?'退税已启用':'退税未启用' }}</span>
          </div>
        </div>
        <!-- 总计单价 -->
        <div class="unitPrice">
          <div class="price-kg">
            <div class="price">销售价格/
              <el-select v-model="pricevalue" style="width:70px" placeholder="请选择">
                <el-option key="kg" label="kg" value="kg" />
                <el-option key="lb" label="lb" value="lb" />
                <el-option key="yd" label="yd" value="yd" />
              </el-select>
            </div>
            <div v-if="pricevalue==='kg'" class="rmb">￥  {{ !isNaN(sellingPrice) ? (sellingPrice * 1).toFixed(4) : '0.0000' }}</div>
            <div v-if="pricevalue==='kg'" class="dollar">＄  {{ !isNaN(sellingPrice) ? (sellingPrice * dollarExchangeRate).toFixed(4) : '0.0000' }}</div>
            <div v-if="pricevalue==='kg'" class="HKdollar">HK＄  {{ !isNaN(sellingPrice) ? (sellingPrice * HongKongDollarExchangeRate).toFixed(4) : '0.0000' }}</div>
            <div v-if="pricevalue==='lb'" class="rmb">￥  {{ !isNaN(sellingPrice) ? (sellingPrice/2.2046).toFixed(4) : '0.0000' }}</div>
            <div v-if="pricevalue==='lb'" class="dollar">＄  {{ !isNaN(sellingPrice) ? (sellingPrice/2.2046*dollarExchangeRate).toFixed(4) : '0.0000' }}</div>
            <div v-if="pricevalue==='lb'" class="HKdollar">HK＄  {{ !isNaN(sellingPrice) ? (sellingPrice/2.2046*HongKongDollarExchangeRate).toFixed(4) : '0.0000' }}</div>
            <div v-if="pricevalue==='yd'" class="rmb">￥  {{ sellingPriceCode }}</div>
            <div v-if="pricevalue==='yd'" class="dollar">＄  {{ (sellingPriceCode*dollarExchangeRate).toFixed(4) }}</div>
            <div v-if="pricevalue==='yd'" class="HKdollar">HK＄  {{ (sellingPriceCode*HongKongDollarExchangeRate).toFixed(4) }}</div>
          </div>
        </div>
        <!-- 备注说明 -->
        <div class="sellingPrice">
          <div class="notes">
            <span class="title">备注说明</span>
            <el-input
              :value="notes"
              :readonly="true"
              disabled
              class="notes-text"
              type="textarea"
              :rows="2"
              maxlength="1000"
              placeholder="最多1000个字符，按需要填写，如无可不填"
            />
          </div>
        </div>
      </div>

    </div>
    <div class="pre-btn">
      当前为预览模式，点击<span class="blue" @click="preOut">退出</span>
    </div>
  </div>
</template>

<script>
import { viewColumns } from '../offer-details-page/mixins/column'
import { PublicCrm } from '../../public/index'
import { debounce } from '@/utils'

export default {
  name: 'PreView',
  mixins: [viewColumns, PublicCrm],
  data() {
    return {
      totalDataList: [],
      editableTabsValue: -1,
      anchorPointIndex: 0,
      headerRowStyle: { 'background-color': '#F5F7FA' },
      quantityData: [],
      costGroup: ['数量', '纱成本', '原材料成本', '坯布成本', '生产成本', '财务成本', '运输成本', '测试成本', '销售价格'],
      yarnList: [],
      dollarExchangeRate: 0,
      HongKongDollarExchangeRate: 0,
      wovenLossList: [],

      wovenTechList: [],

      dyeingTechList: [],
      afterfinishLossList: [],
      functionLossList: [],
      majorPrintingTechList: [],

      paymentMethodList: [],

      freightList: [],

      testCostList: [],
      areaData: {},
      notes: '',
      taxRebateMark: 0,
      pricevalue: 'kg',
      scrollwidth: 1200
    }
  },
  computed: {
    // 获取分支是crm或者erp
    branch() {
      return this.$utils.getEnvInfo().branch
    },
    // 销售价格/码
    sellingPriceCode() {
      let codePrice = 0
      this.quantityData.length !== 0 ? codePrice = !isNaN(this.sellingPrice) ? this.sellingPrice * this.quantityData[0].clothWidth * this.quantityData[0].weightPerSquare * 0.00081925 / 16 / 2.2046 : 0 : codePrice = 0
      return codePrice.toFixed(4)
    },
    sellingPrice() {
      return (this.totalDataList && this.totalDataList.length !== 0) ? this.totalDataList[this.editableTabsValue].salePrice ? this.totalDataList[this.editableTabsValue].salePrice : 0.00 : 0.00
    },
    yarnCost() {
      return (this.totalDataList && this.totalDataList.length !== 0) ? this.totalDataList[this.editableTabsValue].yarnCost ? this.totalDataList[this.editableTabsValue].yarnCost : 0.0000 : 0.0000
    },
    materialCost() {
      return (this.totalDataList && this.totalDataList.length !== 0) ? this.totalDataList[this.editableTabsValue].materialCost ? this.totalDataList[this.editableTabsValue].materialCost : 0.0000 : 0.0000
    },
    fabricCost() {
      return (this.totalDataList && this.totalDataList.length !== 0) ? this.totalDataList[this.editableTabsValue].fabricCost ? this.totalDataList[this.editableTabsValue].fabricCost : 0.0000 : 0.0000
    },
    productionCost() {
      return (this.totalDataList && this.totalDataList.length !== 0) ? this.totalDataList[this.editableTabsValue].productionCost ? this.totalDataList[this.editableTabsValue].productionCost : 0.0000 : 0.0000
    },
    financialCost() {
      return (this.totalDataList && this.totalDataList.length !== 0) ? this.totalDataList[this.editableTabsValue].financialCost ? this.totalDataList[this.editableTabsValue].financialCost : 0.0000 : 0.0000
    },
    freightCost() {
      return (this.totalDataList && this.totalDataList.length !== 0) ? this.totalDataList[this.editableTabsValue].freightCost ? this.totalDataList[this.editableTabsValue].freightCost : 0.0000 : 0.0000
    },
    testCost() {
      return (this.totalDataList && this.totalDataList.length !== 0) ? this.totalDataList[this.editableTabsValue].testCost ? this.totalDataList[this.editableTabsValue].testCost : 0.0000 : 0.0000
    },
    totalCost() {
      return (this.totalDataList && this.totalDataList.length !== 0) ? this.totalDataList[this.editableTabsValue].totalCost ? this.totalDataList[this.editableTabsValue].totalCost : 0.0000 : 0.0000
    },
    // 实际销售利润率
    actualProfitRate() {
      let price = this.sellingPrice
      // 是否退税
      if (this.taxRebateMark) {
        const p = this.$utils.getFloat((this.productionCost - this.$utils.getFloat(this.productionCost / 1.115, 4)), 4)
        price = this.$utils.getFloat(price - 0 + p, 4)
      }
      return (this.sellingPrice ? this.$utils.getFloat((this.$utils.getFloat((this.$utils.getFloat((price - this.totalCost), 4) / this.sellingPrice), 4) * 100), 2) : '0.00')
    }
  },
  watch: {
    editableTabsValue(newVal, oldVal) {
      if (this.totalDataList[newVal].weight) {
        const { weight, clothWidth, weightPerSquare, unit } = this.totalDataList[newVal]
        this.quantityData = [this.getQuantityWeight({ weight, clothWidth, weightPerSquare, unit })]
      } else {
        this.quantityData = []
      }
      const newArray = ['yarnList', 'wovenLossList', 'wovenTechList', 'dyeingTechList', 'afterfinishLossList', 'functionLossList', 'majorPrintingTechList', 'paymentMethodList', 'freightList', 'testCostList']
      newArray.forEach(item => {
        this[item] = this.totalDataList[newVal][item] || []
      })
      window.scrollTo(0, 0)
      this.yarnListS = this.getYarnList('S')
      this.yarnListF = this.getYarnList('F')
      this.taxRebateMark = this.totalDataList[newVal].taxRebateMark
      this.notes = this.totalDataList[newVal].notes
      if (this.totalDataList[newVal].freightList && this.totalDataList[newVal].freightList.length && this.totalDataList[newVal].freightList[0].affordExpense) {
        this.freightCoefficient = this.$utils.getFloat(this.totalDataList[newVal].freightList[0].affordExpense / (this.quantityData.length && this.quantityData[0].weight), 4)
      }

      this.$set(this.transportFreightInternationalViewColumns[7].componentsOptions, 'productCostSubtotal', this.totalDataList[newVal].productionCost)
      this.$set(this.transportFreightInternationalViewColumns[7].componentsOptions, 'targetProfitRate', this.areaData.targetProfitRate)
      this.$set(this.transportFreightInternationalViewColumns[7].componentsOptions, 'weight', this.quantityData.weight)

      if (this.quantityData && this.quantityData.length && this.quantityData[0].weightPerSquare < 150) {
        this.$set(this.otherProductMainPrintingViewColumns[3].componentsOptions, 'isFlag', true)
        this.$set(this.otherProductSecondaryPrintingBaseColumns[1].componentsOptions, 'isFlag', true)
      } else {
        this.$set(this.otherProductMainPrintingViewColumns[3].componentsOptions, 'isFlag', false)
        this.$set(this.otherProductSecondaryPrintingBaseColumns[1].componentsOptions, 'isFlag', false)
      }
      if (this.totalDataList[newVal] && this.totalDataList[newVal].freightList && this.totalDataList[newVal].freightList.length && this.totalDataList[newVal].freightList[0].priceClauseName === 'CIF') {
        this.$set(this.transportFreightInternationalViewColumns[7].componentsOptions, 'isFlag', true)
      } else {
        this.$set(this.transportFreightInternationalViewColumns[7].componentsOptions, 'isFlag', false)
      }
      let productDyeingFlag = false
      if (this.totalDataList[newVal] && this.totalDataList[newVal].majorPrintingTechList) {
        this.totalDataList[newVal].majorPrintingTechList.map(item => {
          if (item.printingName === '拔印印花') {
            productDyeingFlag = true
          }
          item.minorPrintingTechList && item.minorPrintingTechList.map(mitem => {
            if (mitem.printingName === '拔印印花') {
              productDyeingFlag = true
            }
          })
        })
      }
      if (productDyeingFlag) {
        this.$set(this.productDyeingViewColumns[4].componentsOptions, 'isFlag', true)
      } else {
        this.$set(this.productDyeingViewColumns[4].componentsOptions, 'isFlag', false)
      }
      let clothBaseFlag = false
      if (this.totalDataList[newVal] && this.totalDataList[newVal].afterfinishLossList) {
        this.totalDataList[newVal].afterfinishLossList.map(item => {
          if (item.afterfinishTechName && item.afterfinishTechName.includes('底磨毛') || item.afterfinishTechName.includes('面磨毛') || item.afterfinishTechName.includes('底刷毛') || item.afterfinishTechName.includes('面刷毛')) {
            clothBaseFlag = true
          }
        })
      }
      if (this.totalDataList[newVal] && this.totalDataList[newVal].dyeingTechList) {
        this.totalDataList[newVal].dyeingTechList.map(item => {
          if (item.singleDoubleDyeingName === '单染') {
            clothBaseFlag = true
          }
        })
      }
      if (clothBaseFlag) {
        this.$set(this.clothBaseColumns[2].componentsOptions, 'isFlag', true)
      } else {
        this.$set(this.clothBaseColumns[2].componentsOptions, 'isFlag', false)
      }
    }
  },
  mounted() {
    const dataList = JSON.parse(window.localStorage.getItem('dataList'))
    this.totalDataList = dataList.totalDataList
    this.areaData = dataList.areaData
    this.dollarExchangeRate = dataList.dollarExchangeRate
    this.HongKongDollarExchangeRate = dataList.HongKongDollarExchangeRate
    this.editableTabsValue = 0
    window.addEventListener('scroll', this.dataScroll)
    if (document.getElementsByClassName('offer-add-edit-pre')) {
      this.scrollwidth = document.getElementsByClassName('offer-add-edit-pre')[0].offsetWidth || 1200
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.dataScroll)
  },
  methods: {
    dataScroll: debounce(function() {
      const scroll = document.documentElement.scrollTop || document.body.scrollTop
      var sections = document.getElementsByClassName('point-anch')
      for (var i = sections.length - 1; i >= 0; i--) {
        console.log(scroll, sections[i].offsetTop, sections[i].offsetTop - 200)
        if (scroll >= sections[i].offsetTop - 200) {
          this.anchorPointIndex = i
          break
        }
        console.log(this.anchorPointIndex)
      }
    }, 100),
    // 锚点点击事件
    anchorPoint(index, id) {
      const anchor = this.$el.querySelector(id)
      window.scrollTo({ top: anchor.offsetTop - 200, behavior: 'smooth' })
      this.anchorPointIndex = index
    },
    getFabricName(item) {
      if (item.status === ' W' || item.status === ' C' || item.status === 'U' || item.status === ' A' || item.status === 'V' || item.status === 'R' || item.status === 'E') {
        let width = ''
        let weight = ''
        if (item.clothWidth) {
          width = item.clothWidth + 'in'
        }
        if (item.weightPerSquare) {
          weight = item.weightPerSquare + 'g/m²'
        }
        return item.fabricName + ' ' + width + ' ' + weight
      } else {
        return item.fabricName
      }
    },
    getYarnList(type) {
      return this.yarnList && this.yarnList.filter(item => item.yarnType === type) || []
    },
    // 1.0.4根据数量单位 换算
    getQuantityWeight(data) {
      const obj = { ...data }
      // 这里后端存的数量 weight字段 是跟随单位的  弹窗里面的数据数量字段weight是跟随单位的 这里为了让其他用到数量计算的地方不动  所以将后端存的跟随单位的weight字段 换成kg的weight
      // 如果存了单位就是新数据  没有存单位的旧数据按照 kg算  以前是kg
      switch (data.unit) {
        case 'lb':
          obj.lbweight = data.weight
          obj.weight = this.$utils.getFloat(data.weight / 2.2046, 4)
          obj.ydweight = this.$utils.getFloat(this.$utils.getFloat(data.weight / data.clothWidth / data.weightPerSquare / 0.00081925, 4) * 16, 4)
          break
        case 'yd':
          obj.ydweight = data.weight
          obj.weight = this.$utils.getFloat(this.$utils.getFloat(this.$utils.getFloat(this.$utils.getFloat(data.weight * data.clothWidth * data.weightPerSquare, 4) * 0.00081925, 4) / 16, 4) / 2.2046, 4)
          obj.lbweight = this.$utils.getFloat(this.$utils.getFloat(this.$utils.getFloat(data.weight * data.clothWidth * data.weightPerSquare, 4) * 0.00081925, 4) / 16, 4)
          break
        default:
          obj.weight = data.weight
          obj.ydweight = this.$utils.getFloat(this.$utils.getFloat(data.weight / data.clothWidth / data.weightPerSquare / 0.00081925, 4) * 16 * 2.2046, 4)
          obj.lbweight = this.$utils.getFloat(data.weight * 2.2046, 4)
          break
      }
      return obj
    },
    // 退出预览模式
    preOut() {
      window.localStorage.removeItem('dataList')
      this.$emit('setPreView', false)
    }
  }

}
</script>

<style lang="scss" scoped>
  .offer-add-edit-pre {
    padding: 0px!important;
    padding-bottom: 60px!important;
    background: #eef5f9;
    .heard-fixed {
      width: 100%;
      position: fixed;
      height: 100px;
      z-index: 3;
      top: 79px;
      background: #eef5f9;
    }
      .header {
        display: flex;
        align-items: center;
        height: 65px;
        padding: 0 20px;
        border-bottom: 1px solid #E9EFF2;

        .text {
          flex: 1;
          font-size: 18px;
          color: #151226;
        }

        .next-step {
          border-color: #0986FF;
          color: #0986FF;
          margin-right: 8px;
        }
      }
        .tabs {
          display: flex;
          font-size: 14px;
          .tabItem {
            border-bottom: 1px solid #D0D6DA;
            .tabItem-b {
              position: relative;
              margin-right: 15px;
            }
            .tabClose {
              color: #BBC2D0;
              display: none;
              position: absolute;
              right: -8px;
              top: -8px;
              font-size: 18px;
              cursor: pointer;
              background-color: #fff;
              border-radius: 50%;
              overflow: hidden;
            }
            .btn {
              position: relative;
              bottom: -1px;
              padding: 9px 15px;
              border-radius: 3px;
              display: inline-block;
              line-height: 1;
              white-space: nowrap;
              cursor: pointer;
              background: #fff;
              border: 1px solid #dcdfe6;
              color: #606266;
              -webkit-appearance: none;
              text-align: center;
              box-sizing: border-box;
              outline: none;
              margin: 0;
              transition: .1s;
              font-weight: 500;
            }
          }
          .tabItem-b .active {
              color: #0986FF;
              border-bottom: 1px solid #fff;
          }
          .lastitem {
            flex: 1;
            .tabItem-b {
              width: 34px;
            }
          }
          .tabItem:hover .tabClose {
            display: block;
          }
        }
        .anchorPoint {
          color: #3C4043;
          padding: 0 20px;
          font-size: 14px;
          background: #fff;
          .pointItem {
            cursor: pointer;
            color: #3C4043;
            .con-text {
              display: inline-block;
              border-bottom: 2px solid transparent;
              transition: border-color .3s,background-color .3s,color .3s;
              line-height: 34px;
              height: 34px;
            }
          }

          .actived {
            color: #0986ff;
            .con-text {
                border-color:#0986ff;
              }
          }
          .anchorPointAdd:hover {
            color: #0986ff;
          }
        }
      .hiddenSide {
        width: calc(100% - 94px);
      }

      .content {
        margin:  20px;
        margin-top: 100px;
        .header {
          display: flex;
          height: 62px;
          line-height: 62px;

          .title {
            flex: 1;
            color: #151222;
          }
          .subtotal {
            color: #666;
            .money {
              color: #ff4444;
            }
          }
        }

        .tableContent {
          padding: 0px 40px 20px;

          .button {
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px dashed rgba(187,194,208,0.60);
            border-radius: 6px;
            border-radius: 6px;
            margin-top: 20px;
            margin-bottom: 0;
            color: #0986FF;
            font-size: 14px;
            cursor: pointer;

            .icon {
              font-size: 16px;
              margin-right: 10px;
            }
          }
        }

        .quantity, .yarn, .material, .cloth, .production, .finance, .transport, .test, .totalCost, .sellingPrice, .unitPrice {
          background-color: #fff;
          border-bottom: #A5AEB7;
          font-size: 14px;
        }
        .notes {
          display: flex;
          padding: 10px 20px;
          border-top: 1px solid #EEEFF0;
          .title {
              text-align: left;
              width: 70px;
            }
            .notes-text {
              flex: 1;
            }
          }
        /deep/ .transport .el-form-item {
          margin-bottom: 0;
        }
        .totalCost, .sellingPrice {
          .total {
            position: relative;
            margin-left: 64px;
            color: #888E9E;
            width: 280px;
            .money {
              padding-left: 10px;
              color: #ff4444;
            }
            .errorMessage {
              position: absolute;
              top: 48px;
              left: 110px;
              color: #ff4949;
              font-size: 12px;
              font-style: normal;
              line-height: 1.15;
            }
          }
          .profit {
            color: #888E9E;
            width: 200px;
            .money {
              float: right;
              color: #ff4444;
            }
          }
          .el-input {
            margin-left: 10px;
            width: 57%;

          }
        }

        .unitPrice {
          .price-kg, .price-p, .price-c {
            display: flex;
            align-items: center;
            margin: 0 20px;
            height: 62px;
            .price {
              flex: 1;
            }
            .rmb, .dollar, .HKdollar {
              color: #ff4444;
              min-width: 140px;
              text-align: right;
            }
            .HKdollar {
              margin-left: 10px;
            }
          }
          .price-c {
            border-bottom-width: 0;
          }
        }

        .subhead {
          display: flex;
          justify-content: space-between;
          height: 32px;
          line-height: 32px;
          padding: 0 20px;
        }

        .production {
          .addition {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .addition-item {
            width: 24%;
          }
        }
      }
    .header-btn {
      width: 100%;
      background: #eef5f9;
      padding: 10px 20px;
    }
  }
  .pre-btn {
      background: rgba(0,0,0,0.30);
      width: 100%;
      position: fixed;
      bottom: 0;
      line-height: 40px;
      font-size: 14px;
      color: #FFFFFF;
      text-align: center;
      .blue {
        color: #2662FC;
        cursor: pointer;
      }
    }
    .taxRebateMark {
      text-align: right;
    }
</style>
<style lang='scss'>
.offer-add-edit-pre {
  .el-divider {
    margin: 0 20px;
    background-color: #D0D6DA;
  }
  .sellingPrice {
    .el-input--medium .el-input__inner {
      height: 28px;
    }
  }
  .el-tabs__nav-wrap::after {
    height: 1px;
  }
  .page-table {
    padding: 10px 20px!important;
    tr:nth-child(even) {
      background-color: #fff;
    }
    tr {
      line-height: 0;
    }
    tbody .el-table__row td {
      border-bottom: 1px solid #EEEFF0;
    }

    thead {
      .is-right {
        padding-right: 10px;
      }
    }
  }

  .pop-table {
    // padding: 0 20px;
    tr:nth-child(even) {
      background-color: #fff;
    }
    tr {
      line-height: 0;
    }
    tbody .el-table__row td {
      border-bottom: 1px solid #EEEFF0;
    }

    thead {
      .is-right {
        padding-right: 10px;
      }
      th {
        padding: 10px 0;
      }
    }
  }

  .displayNone {
    display: none;
  }

  .el-tabs__header {
    margin: 0;
  }
  // 状态样式
  .offerStatus {
    position: fixed;
    width: 90%;
    top: 89px;
    padding: 20px 0;
    box-sizing: border-box;
    background: #eef5f9;
    z-index: 9;
  }
  .offerStatusLine {
    display: flex;
    align-items: center;
    justify-content: center;
    .dottedLine {
      height: 1px;
      width: 161px;
      border-bottom: 1px dotted  #B9B9B9;
    }
    .dottedLine.actived {
      border-bottom-color:#0986FF;
    }
    .status {
      font-size: 14px;
      color: #888E9E;
      text-align: center;
      .step {
        display: inline-block;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        background: #D6DCE8;
        color: #AAB3CB;
        line-height: 20px;
        text-align: center;
      }
    }
    .status.actived {
      .step {
        background: #0986FF;
        color: #fff;
      }
      color: #0986FF;
    }
    .close {
      color: #A5AEB7;
      font-size: 16px;
      margin: 0 12px 0 15px;
    }
    .closeTxt {
      cursor: pointer;
      font-size: 14px;
      color: #44494C;
    }
  }
  .closeStatus {
    display: flex;
    align-items: center;
    justify-content: center;
    .closeDottedLine {
      height: 1px;
      width: 380px;
      border-bottom: 1px dotted #B9B9B9;
    }
    .offerClosed {
      font-size: 14px;
      color: #BBC2D0;
      margin: 0 15px;
    }
  }
}
.btn-group {
    display: flex;
    flex-direction: column;
    .el-button {
      margin: 5px;
    }
  }

</style>
