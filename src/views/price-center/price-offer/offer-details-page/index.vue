<template>
  <div>
    <div class="offer-details-page">
      <div v-show="activeName==='relevant'&&anchorPointShow" class="anchorPoint pos-s">
        <a v-for="(item, index) in costGroup" :key="index" :name="'point' + index" href="javascript:void(0)" class="pointItem" :class="{'actived': anchorPointIndex === index}" @click="anchorPoint(index, `#point${index}`)">{{ item }}<el-divider v-if="index !== costGroup.length-1" direction="vertical" /></a>
      </div>
      <div class="offerHeader">
        <span class="offerText">报价</span>
        <!-- <div v-show="activeName==='relevant'" class="details-button"><el-button size="mini" @click="preView">预览</el-button></div> -->
        <template v-if="!/crm/.test(branch)">
          <el-button v-if="$permission(['price:quotationSheet:modify'])" size="mini" @click="detailEdit">编辑</el-button>
          <el-button v-if="$permission(['price:quotationSheet:copy'])" size="mini" @click="copyAsDraft">复制</el-button>
          <el-button v-if="$permission(['price:quotationSheet:delete'])" size="mini" type="danger" plain style="margin-right: 20px;" @click="detailDelete">删除</el-button>
        </template>
        <template v-if="/crm/.test(branch)">
          <div v-if="approvalId === userInfo.userId" class="details-button">
            <el-button v-if="offerStatus === 'W' && $permission(['crm:sheetApprove:approve'])" size="mini" @click="agreeQuotation">同意</el-button>
            <el-button v-if="offerStatus === 'W' && $permission(['crm:sheetApprove:reject'])" size="mini" @click="refuseQuotation">拒绝</el-button>
          </div>
          <div v-else class="details-button">
            <el-button v-if="offerStatus === 'D' && $permission(['crm:quotationSheet:modify'])" size="mini" @click="detailEdit">编辑</el-button>
            <el-button v-if="offerStatus === 'D' && $permission(['crm:quotationSheet:delete'])" size="mini" type="danger" plain @click="detailDelete">删除</el-button>
            <el-button v-if="offerStatus === 'D' && $permission(['crm:quotationSheet:submit'])" size="mini" @click="submitForApproval">提交审批</el-button>
            <el-button v-if="offerStatus === 'W' && $permission(['crm:quotationSheet:withdraw:submit'])" size="mini" @click="withdrawalOfApproval">撤回审批</el-button>
            <el-button v-if="offerStatus === 'C' && $permission(['crm:quotationSheet:use'])" size="mini" @click="useQuotation">使用报价</el-button>
            <el-button v-if="offerStatus === 'U' && $permission(['crm:quotationSheet:accept'])" size="mini" @click="acceptQuotation">接受报价</el-button>
            <el-button v-if="offerStatus === 'U' && $permission(['crm:quotationSheet:veto'])" size="mini" @click="vetoQuotation">否决报价</el-button>
            <el-button v-if="offerStatus === 'A' && $permission(['crm:quotationSheet:withdraw:acceptance'])" size="mini" @click="withdrawalAcceptance">撤回接受</el-button>
            <el-button v-if="offerStatus === 'V' && $permission(['crm:quotationSheet:withdraw:veto'])" size="mini" @click="withdrawalTheVeto">撤回否决</el-button>
            <el-button v-if="offerStatus !== 'D' && offerStatus !== 'W' && $permission(['crm:quotationSheet:copy'])" size="mini" @click="copyAsDraft">复制为草稿</el-button>
            <el-button v-permission="['crm:quotationSheet:modify:follower']" size="mini" @click="changeOwnerClick">更改所有人</el-button>
            <div v-if="$permission(['crm:quotationSheet:billInfoExportPdf'])||$permission(['crm:quotationSheet:billInfoExportExcel'])">
              <el-dropdown v-if="activeName==='quote'&&quoteFormDatas.length>0" trigger="click" @command="handleCommand">
                <el-button size="mini" style="margin-left: 10px;">
                  下载<i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="$permission(['crm:quotationSheet:billInfoExportPdf'])" command="PDF">PDF</el-dropdown-item>
                  <el-dropdown-item v-if="$permission(['crm:quotationSheet:billInfoExportExcel'])" command="excel">excel</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <el-dialog
              title="下载列选择"
              :visible.sync="dialogVisible"
              width="30%"
            >
              <span>请选择下载后，是否显示以下列</span>
              <div style="margin: 10px 0;">
                <el-checkbox-group v-model="checkList">
                  <el-checkbox label="yarnName">纱名</el-checkbox>
                  <el-checkbox label="processRequirements">工艺要求</el-checkbox>
                </el-checkbox-group>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogSubmit">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </template>

      </div>
      <!-- 状态控制 -->
      <div v-if="/crm/.test(branch)" style="margin: 30px 0 0 0; position: relative;">
        <div v-if="offerStatus !== 'E'" class="offerStatusLine">
          <div class="status" :class="{actived:onGoingStatus > -1}">草稿</div>
          <div class="dottedLine" :class="{actived:onGoingStatus > 0}" />
          <div class="status" :class="{actived:onGoingStatus > 0}">审批中</div>
          <div v-if="offerStatus !== 'R'" class="dottedLine" :class="{actived:onGoingStatus > 1}" />
          <div v-if="offerStatus !== 'R'" class="status" :class="{actived:onGoingStatus > 1}">已同意</div>
          <div v-if="offerStatus !== 'R'" class="dottedLine" :class="{actived:onGoingStatus > 2}" />
          <div v-if="offerStatus !== 'R'" class="status" :class="{actived:onGoingStatus > 2}">使用中</div>
          <div v-if="offerStatus !== 'R' && offerStatus !== 'V'" class="dottedLine" :class="{actived:onGoingStatus > 3}" />
          <div v-if="offerStatus !== 'R' && offerStatus !== 'V'" class="status" :class="{actived:onGoingStatus > 3}">已接受</div>
          <div v-if="offerStatus === 'V'" class="dottedLine" :class="{actived:onGoingStatus > 3}" />
          <div v-if="offerStatus === 'V'" class="status" :class="{actived:onGoingStatus > 3}">已否决</div>
          <div v-if="offerStatus === 'R'" class="dottedLine" :class="{actived:onGoingStatus > 1}" />
          <div v-if="offerStatus === 'R'" class="status" :class="{actived:onGoingStatus > 1}">已拒绝</div>
        </div>
        <div v-else class="closeStatus">
          <div class="closeDottedLine" />
          <div class="offerClosed">已过期</div>
          <div class="closeDottedLine" />
        </div>
        <span v-if="offerStatus === 'U' || offerStatus === 'A' || offerStatus === 'V'" class="effectiveDate">报价有效期: <span style="color: #ff4444">剩余{{ effectiveDate }}天</span></span>
      </div>
      <el-tabs v-model="activeName" class="commonTabs">
        <el-tab-pane label="详细信息" name="detailed">
          <!-- 搜索表单 -->
          <div class="detailSearch" style="padding: 0 0 20px 0;">
            <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="detailsFormDatas" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="价格明细" name="relevant" style="padding-bottom: 20px;">
          <div class="offer-add-edit">
            <div class="top">
              <!-- <div class="tabs">
                <div v-for="(item, index) in fullDataList.fabricList" :key="index" class="tabItem">
                  <div class="btn" :class="{active:editableTabsValue === index}" @click="editableTabsValue = index">{{ /crm/.test(branch) ? getFabricName(item) : item.fabricName }}</div>
                </div>
              </div> -->
              <el-scrollbar
                ref="scrollbar"
                :key="fullDataList.fabricList&&fullDataList.fabricList.length"
                :view-style="{margin:'10px 0px'}"
              >
                <div class="tabs">
                  <div v-for="(item, index) in fullDataList.fabricList" :key="index" class="tabItem" :class="{'lastitem':fullDataList.fabricList&&index===fullDataList.fabricList.length-1}">
                    <div class="tabItem-b">
                      <div class="btn" :class="{active:editableTabsValue === index}" @click="editableTabsValue = index">{{ /crm/.test(branch) ? getFabricName(item) : item.fabricName }}</div>
                    </div>
                  </div>
                </div>
              </el-scrollbar>
              <div class="anchorPoint myanchorPoint">
                <a v-for="(item, index) in costGroup" :key="index" :name="'point' + index" href="javascript:void(0)" class="pointItem" :class="{'actived': anchorPointIndex === index}" @click="anchorPoint(index, `#point${index}`)">
                  <span class="con-text">{{ item }}</span>
                  <el-divider v-if="index !== costGroup.length-1" direction="vertical" /></a>
              </div>
              <div class="content">
                <!-- 数量 -->
                <div v-show="anchorPointIndex===0" id="point0" class="point quantity">
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
                <div v-show="anchorPointIndex===1" id="point1" class="point yarn">
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
                    <div class="page-table">
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
                <div v-show="anchorPointIndex===2" id="point2" class="point material">
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
                <div v-show="anchorPointIndex===3" id="point3" class="point cloth">
                  <div class="header">
                    <span class="title">坯布成本</span>
                    <span class="subtotal">成本小计: <span class="money">{{ '￥' + fabricCost }}</span></span>
                  </div>
                  <!-- table表格 -->
                  <div v-if="wovenTechList.length !== 0">
                    <div class="subhead">织工</div>
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
                <div v-show="anchorPointIndex===4" id="point4" class="point production">
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
                    <div>
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
                  <div v-if="majorPrintingTechList && majorPrintingTechList.length !== 0&&majorPrintingTechList[0].minorPrintingTechList&&majorPrintingTechList[0].minorPrintingTechList.length">
                    <div>
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
                <div v-show="anchorPointIndex===5" id="point5" class="point finance">
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
                <div v-show="anchorPointIndex===6" id="point6" class="point transport">
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
                <div v-show="anchorPointIndex===7" id="point7" class="point test">
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

                <div v-show="anchorPointIndex===8" id="point8" class="point">
                  <div class="header-btn" />
                  <!-- 成本合计 -->
                  <div class=" totalCost">
                    <div class="header country-name">
                      <span class="title" :class="/crm/.test(branch) ? '' : 'country-name'">成本合计/kg</span>
                      <span class="area" :style="/crm/.test(branch) ? '' : 'margin-right: 20px;'">国家/地区： {{ countryName }}</span>
                      <span class="total">成本合计(￥): <span class="money">{{ totalCost }}</span></span>
                      <span class="profit">目标利润率<span class="money">{{ (targetProfitRate ? (targetProfitRate * 1).toFixed(2): '0.00') + '%' }}</span></span>
                    </div>
                  </div>
                  <!-- 销售价格 -->
                  <div class=" sellingPrice">
                    <div class="header">
                      <span class="title">销售价格/kg</span>
                      <span class="total">销售价格(￥): <span class="money">{{ sellingPrice||'0.00' }}</span></span>
                      <span class="profit">实际利润率<span class="money">{{ actualProfitRate + '%' }}</span></span>
                    </div>
                  </div>
                  <!-- 退税价格/kg -->
                  <div class=" sellingPrice">
                    <div class="header">
                      <span class="title">退税价格/kg</span>
                      <span class="total">退税价格(￥): <span class="money">{{ taxRebateMark?( productionCost&&$utils.getFloat((productionCost-$utils.getFloat(productionCost/1.115,4)),4)||'0.00') :'0.00' }}</span></span>
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
                      <div v-if="pricevalue==='yd'" class="rmb">￥  {{ sellingPriceCode }}</div>
                      <div v-if="pricevalue==='yd'" class="dollar">＄  {{ (sellingPriceCode*dollarExchangeRate).toFixed(4) }}</div>
                      <div v-if="pricevalue==='yd'" class="HKdollar">HK＄  {{ (sellingPriceCode*HongKongDollarExchangeRate).toFixed(4) }}</div>
                      <div v-if="pricevalue==='lb'" class="rmb">￥  {{ !isNaN(sellingPrice) ? (sellingPrice/2.2046).toFixed(4) : '0.0000' }}</div>
                      <div v-if="pricevalue==='lb'" class="dollar">＄  {{ !isNaN(sellingPrice) ? (sellingPrice/2.2046*dollarExchangeRate).toFixed(4) : '0.0000' }}</div>
                      <div v-if="pricevalue==='lb'" class="HKdollar">HK＄  {{ !isNaN(sellingPrice) ? (sellingPrice/2.2046*HongKongDollarExchangeRate).toFixed(4) : '0.0000' }}</div>
                    </div>
                  </div>
                  <!-- 备注说明/ -->
                  <div class=" sellingPrice">
                    <div class="notes">
                      <span class="title">备注说明</span>
                      <el-input
                        :value="notes"
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
            </div>
          </div></el-tab-pane>
        <!-- 报价单 -->
        <el-tab-pane v-if="/crm/.test(branch) && offerStatus !== 'D'" label="报价单" name="quote">
          <div class="page-table" style="margin-top: 2px;">
            <cs-custom-table
              :span-method="objectSpanMethod"
              :columns="quoteColumns"
              :data-source="quoteFormDatas"
              :operates="popOperates"
              edit-type="pop"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- 导入更改所有人pop弹出层 -->
      <div class="pop">
        <cs-custom-pop :options="OwnerPopOptions" />
      </div>
      <!-- 拒绝弹出框 -->
      <div class="pop">
        <cs-custom-pop :options="refusePopOptions" />
      </div>

      <!-- 提交审批弹出框 -->
      <div class="pop">
        <cs-custom-pop :options="submitPopOptions" />
      </div>

      <!-- 编辑报价单弹框 -->
      <div class="pop">
        <cs-custom-pop :options="quotePopOptions" />
      </div>

      <div v-show="false" class="print-quote">
        <div id="csPrint">
          <print-item :quote-form-datas="quoteFormDatas" :check-list="checkList.join(',')" />
        </div>
      </div>
    </div>
    <!-- <pre-view v-if="isPreView" @setPreView="setPreView" /> -->
  </div>
</template>

<script>
import { OfferRelevant } from '../components/relevantIndex.js'
import { OfferDetails } from '../components/detailsIndex.js'
import { PublicCrm } from '../../public/index'
import lineJump from '../../public/components/line-jump.vue'
import { quote } from './mixins/quote.js'
import { viewColumns } from './mixins/column.js'
// import preView from '../components/pre-view'
import printItem from './print'
export default {
  components: { printItem },
  mixins: [OfferRelevant, OfferDetails, PublicCrm, quote, viewColumns],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })

    // 公用组件样式
    const style = {
      'width': '100%',
      'font-size': '16px',
      'font-weight': '400',
      'letter-spacing': '2px',
      'color': '#333',
      'border-bottom': '1px #EEEFF0 solid',
      'margin-top': '20px',
      'padding-bottom': '10px',
      'margin-bottom': '10px'
    }

    // 审批用户搜索
    const submitRemoteUser = value => {
      if (value === '') {
        this.$set(this.submitPopOptions.content[1], 'dataSource', [])
      } else {
        if (!this.getData) {
          this.getData = this.$utils.debounce(this.remoteUserList, 300)
        }
        this.getData({ realName: value, name: value }, 1, this.submitPopOptions)
      }
    }

    const baseSearchData = [
      {
        itemType: 'view',
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        text: '基本信息',
        style
      },
      {
        prop: 'quotationId',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '报价编号:',
        // disabled: true
        readonly: true
      },
      {
        isShow: () => {
          return /crm/.test(this.branch)
        },
        components: {
          lineJump
        },
        componentsOptions: {
          prop: 'businessOpportunityName',
          label: '商机:'
        }
      },
      {
        prop: 'quotationName',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '报价名称:',
        // disabled: true
        readonly: true
      },
      {
        isShow: () => {
          return /crm/.test(this.branch)
        },
        components: {
          lineJump
        },
        componentsOptions: {
          prop: 'customerName',
          label: '客户:'
        }
      },
      {
        isShow: () => {
          return !/crm/.test(this.branch)
        },
        prop: 'customerName',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '客户:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'sellerTeamName',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '销售部门:',
        readonly: true
      },
      {
        prop: 'sellerName',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '销售员:',
        // disabled: true
        readonly: true
      },
      {
        isShow: () => {
          return /crm/.test(this.branch)
        },
        components: {
          lineJump
        },
        componentsOptions: {
          prop: 'brandName',
          label: '品牌:'
        }
      },
      {
        isShow: () => {
          return !/crm/.test(this.branch)
        },
        prop: 'brandName',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '品牌:',
        readonly: true
      },

      {
        prop: 'year',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '销售年度:',
        readonly: true
      },
      {
        prop: 'quarter',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '销售季度:',
        readonly: true
      },
      {
        isShow: () => {
          return /crm/.test(this.branch)
        },
        prop: 'periodOfValidity',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '有效期:',
        readonly: true
      },
      {
        prop: 'fabricCount',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '布类数量:',
        readonly: true
      },
      {
        prop: 'countryName',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '国家/地区:',
        readonly: true
      },
      {
        prop: 'targetProfitRate',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '目标利润率:',
        readonly: true
      },
      {
        prop: 'overallProfitMargin',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '整体实际利润率:',
        readonly: true
      },
      {
        prop: 'totalWeight',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '数量合计(kg):',
        readonly: true
      }
    ]
    const systemSearchData = [
      {
        itemType: 'view',
        text: '系统信息',
        style
      },
      {
        isShow: () => {
          return /crm/.test(this.branch)
        },
        prop: 'follower',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '所有人:',
        readonly: true
      },
      {
        prop: 'createdBy',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '创建人:',
        readonly: true
      },
      {
        prop: 'createdTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '创建日期:',
        readonly: true
      },
      {
        prop: 'updatedBy',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '上次修改人:',
        readonly: true
      },
      {
        prop: 'updatedTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '上次修改日期:',
        readonly: true
      }
    ]

    // 草稿数据
    const draftData = [
      ...baseSearchData,
      ...systemSearchData
    ]
    // 审批数据
    const approvalData = [
      ...baseSearchData,
      {
        prop: 'submitTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '提交审批日期:',
        readonly: true
      },
      {
        prop: 'message',
        itemType: 'input',
        type: 'textarea',
        autosize: true,
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        label: '留言:',
        readonly: true
      },
      ...systemSearchData
    ]
    // 同意数据
    const agreeData = [
      ...baseSearchData,
      {
        prop: 'submitTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '提交审批日期:',
        readonly: true
      },
      {
        prop: 'approvalTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '审批同意日期:',
        readonly: true
      },
      {
        prop: 'message',
        itemType: 'input',
        type: 'textarea',
        autosize: true,
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        label: '留言:',
        readonly: true
      },
      ...systemSearchData
    ]
    // 使用数据
    const useData = [
      ...baseSearchData,
      {
        prop: 'submitTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '提交审批日期:',
        readonly: true
      },
      {
        prop: 'approvalTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '审批同意日期:',
        readonly: true
      },
      {
        isShow: () => {
          return /crm/.test(this.branch)
        },
        prop: 'firstUseTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '首次使用日期:',
        readonly: true
      },
      {
        isShow: () => {
          return /crm/.test(this.branch)
        },
        prop: 'expirationTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '报价过期日期:',
        readonly: true
      },
      {
        prop: 'message',
        itemType: 'input',
        type: 'textarea',
        autosize: true,
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        label: '留言:',
        readonly: true
      },
      ...systemSearchData
    ]
    // 接受数据
    const acceptData = [
      ...baseSearchData,
      {
        prop: 'submitTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '提交审批日期:',
        readonly: true
      },
      {
        prop: 'approvalTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '审批同意日期:',
        readonly: true
      },
      {
        isShow: () => {
          return /crm/.test(this.branch)
        },
        prop: 'firstUseTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '首次使用日期:',
        readonly: true
      },
      {
        isShow: () => {
          return /crm/.test(this.branch)
        },
        prop: 'expirationTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '报价过期日期:',
        readonly: true
      },
      {
        isShow: () => {
          return /crm/.test(this.branch)
        },
        prop: 'acceptTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '接受报价日期:',
        readonly: true
      },
      {
        prop: 'message',
        itemType: 'input',
        type: 'textarea',
        autosize: true,
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        label: '留言:',
        readonly: true
      },
      ...systemSearchData
    ]
    // 否决数据
    const vetoData = [
      ...baseSearchData,
      {
        prop: 'submitTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '提交审批日期:',
        readonly: true
      },
      {
        prop: 'approvalTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '审批同意日期:',
        readonly: true
      },
      {
        isShow: () => {
          return /crm/.test(this.branch)
        },
        prop: 'firstUseTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '首次使用日期:',
        readonly: true
      },
      {
        isShow: () => {
          return /crm/.test(this.branch)
        },
        prop: 'expirationTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '报价过期日期:',
        readonly: true
      },
      {
        isShow: () => {
          return /crm/.test(this.branch)
        },
        prop: 'vetoTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '否决报价日期:',
        readonly: true
      },
      {
        prop: 'message',
        itemType: 'input',
        type: 'textarea',
        autosize: true,
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        label: '留言:',
        readonly: true
      },
      ...systemSearchData
    ]
    // 拒绝数据
    const refuseData = [
      ...baseSearchData,
      {
        prop: 'submitTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '提交审批日期:',
        readonly: true
      },
      {
        prop: 'rejectionTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '审批拒绝日期:',
        readonly: true
      },
      {
        prop: 'message',
        itemType: 'input',
        type: 'textarea',
        autosize: true,
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        label: '留言:',
        readonly: true
      },
      {
        prop: 'rejectionReason',
        itemType: 'input',
        type: 'textarea',
        autosize: true,
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        label: '拒绝原因:',
        readonly: true
      },
      ...systemSearchData
    ]

    // 更改所有人pop弹出框配置信息
    const OwnerPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '更改所有人',
      // close: () => { this.$emit('visibleClick', false) },
      //   width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: this.okClick,
      cancel: params => {
        // this.PopDialogHandle()
        // this.$emit('visibleClick', false)
        this.$set(this.OwnerPopOptions, 'visible', false)
        //
      },
      formDatas: {
        // areaNum: 86
      },
      formOptions: {
        // inline: true
        // labelWidth: '111px'
      },
      content: [
        {
          prop: 'follower',
          itemType: 'select',
          filterable: true,
          className: 'commonRemoteSearch',
          remote: true,
          remoteMethod: this.remoteUserSearch,
          loading: false,
          rules: [commonBlurReg],
          // itemStyle: { 'width': '50%', 'marginRight': 0 },
          label: '用户',
          dataSource: [],
          placeholder: '请查找用户'
        }
      ]
    }

    // 拒绝pop弹出框配置信息
    const refusePopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '更改所有人',
      // close: () => { this.$emit('visibleClick', false) },
      //   width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        this.sheetApprove({ ...params, redirectUrl: `${this.needUri}/approval/my-submission`, quotationId: this.routeId, status: 'R' })
      },
      cancel: params => {
        // this.PopDialogHandle()
        // this.$emit('visibleClick', false)
        this.$set(this.refusePopOptions, 'visible', false)
        //
      },
      formDatas: {
        // areaNum: 86
      },
      formOptions: {
        // inline: true
        // labelWidth: '111px'
      },
      content: [
        {
          prop: 'rejectionReason',
          itemType: 'input',
          // itemStyle: { 'width': '100%', 'marginRight': 0 },
          maxlength: 1000,
          type: 'textarea',
          // trim: (value) => {
          //   return value
          // },
          autosize: { minRows: 2, maxRows: 4 },
          label: '拒绝原因',
          rules: [commonBlurReg],
          placeholder: '请输入拒绝原因'
        }
      ]
    }

    // 审批弹出框
    const submitPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      // width: '1240px',
      ok: params => {
        this.quotationSheetSubmit({ quotationId: this.quotationId, sheetApprove: { approverName: params.approver.realName || '', approver: params.approver.value, message: params.message, redirectUrl: `${this.needUri}/approval/submitted-to-me` }})
      },
      cancel: params => {
        this.closePopDialogHandle(this.submitPopOptions)
      },
      // close: () => {
      // },
      formDatas: {
        // tabs: '1'
      },
      formOptions: {
        // labelWidth: '120px',
        // inline: true
      },
      content: [
        {
          prop: 'applicantName',
          itemType: 'input',
          label: '申请人',
          rules: [commonBlurReg],
          readonly: true,
          dataSource: []
        },
        {
          prop: 'approver',
          itemType: 'select',
          label: '审批人',
          valueType: 'object',
          valueKey: 'value',
          className: 'commonRemoteSearch',
          filterable: true,
          remote: true,
          remoteMethod: submitRemoteUser,
          rules: [commonChangeReg],
          dataSource: [],
          change: (value, form, formDatas, setFormDatas) => {
            if (this.userInfo.userId === value.value) {
              this.$message.warning('审批人不能选择自己')
              setFormDatas({ approver: null })
            }
          },
          placeholder: '查找CRM用户'
        },
        {
          prop: 'message',
          itemType: 'input',
          type: 'textarea',
          maxlength: 1000,
          autosize: { minRows: 2, maxRows: 4 },
          label: '留言'
        }
      ]
    }

    return {
      formOtions: {
        inline: true
      },
      OwnerPopOptions,
      refusePopOptions,
      submitPopOptions,
      searchData: [],
      baseSearchData,
      draftData,
      approvalData,
      agreeData,
      useData,
      acceptData,
      vetoData,
      refuseData,
      detailsFormDatas: {},
      activeName: 'detailed',
      visible: false,
      modelDevelopTotal: 0,
      follower: null,
      //   closedState: -1,
      onGoingStatus: -1,
      offerStatus: '',
      headerRowStyle: { 'background-color': '#F5F7FA' },

      editableTabsValue: 0,

      areaData: {},

      quantityData: [],

      printjs: false,
      yarnList: [],

      wovenLossList: [],

      wovenTechList: [],

      dyeingTechList: [],
      afterfinishLossList: [],
      functionLossList: [],
      majorPrintingTechList: [],

      paymentMethodList: [],

      freightList: [],

      testCostList: [],

      fullDataList: {},
      needUri: '',
      effectiveDate: '',
      dollarExchangeRate: '',
      HongKongDollarExchangeRate: '',
      rowInfoMessages: {},
      countryCode: '',
      anchorPointIndex: 0,
      anchorPointShow: false,
      costGroup: ['数量', '纱成本', '原材料成本', '坯布成本', '生产成本', '财务成本', '运输成本', '测试成本', '销售价格'],
      // freightCoefficient: 0
      taxRebateMark: false,
      notes: '',
      isPreView: false,
      pricevalue: 'kg'
    }
  },
  computed: {
    routeId() {
      return this.$route.params.id
    },
    userInfo() {
      return this.$store.state.user.userInfo
    },
    approvalId() {
      // return (this.fullDataList.sheetApprove && this.fullDataList.sheetApprove.status === 'W') ? this.fullDataList.sheetApprove.approver : ''
      return this.fullDataList.sheetApprove ? this.fullDataList.sheetApprove.approver : ''
    },
    customerId() {
      return this.detailsFormDatas.customer ? this.detailsFormDatas.customer.value : ''
    },
    businessOpportunityId() {
      return this.detailsFormDatas.businessOpportunity ? this.detailsFormDatas.businessOpportunity.value : ''
    },
    brandId() {
      return this.detailsFormDatas.brand ? this.detailsFormDatas.brand.value : ''
    },
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
      return (this.fullDataList.fabricList && this.fullDataList.fabricList.length !== 0) ? this.fullDataList.fabricList[this.editableTabsValue].salePrice ? this.fullDataList.fabricList[this.editableTabsValue].salePrice.toFixed(4) : 0.00 : 0.00
    },
    yarnCost() {
      return (this.fullDataList.fabricList && this.fullDataList.fabricList.length !== 0) ? this.fullDataList.fabricList[this.editableTabsValue].yarnCost ? this.fullDataList.fabricList[this.editableTabsValue].yarnCost.toFixed(4) : 0.0000 : 0.0000
    },
    materialCost() {
      return (this.fullDataList.fabricList && this.fullDataList.fabricList.length !== 0) ? this.fullDataList.fabricList[this.editableTabsValue].materialCost ? this.fullDataList.fabricList[this.editableTabsValue].materialCost.toFixed(4) : 0.0000 : 0.0000
    },
    fabricCost() {
      return (this.fullDataList.fabricList && this.fullDataList.fabricList.length !== 0) ? this.fullDataList.fabricList[this.editableTabsValue].fabricCost ? this.fullDataList.fabricList[this.editableTabsValue].fabricCost.toFixed(4) : 0.0000 : 0.0000
    },
    productionCost() {
      return (this.fullDataList.fabricList && this.fullDataList.fabricList.length !== 0) ? this.fullDataList.fabricList[this.editableTabsValue].productionCost ? this.fullDataList.fabricList[this.editableTabsValue].productionCost.toFixed(4) : 0.0000 : 0.0000
    },
    financialCost() {
      return (this.fullDataList.fabricList && this.fullDataList.fabricList.length !== 0) ? this.fullDataList.fabricList[this.editableTabsValue].financialCost ? this.fullDataList.fabricList[this.editableTabsValue].financialCost.toFixed(4) : 0.0000 : 0.0000
    },
    freightCost() {
      return (this.fullDataList.fabricList && this.fullDataList.fabricList.length !== 0) ? this.fullDataList.fabricList[this.editableTabsValue].freightCost ? this.fullDataList.fabricList[this.editableTabsValue].freightCost.toFixed(4) : 0.0000 : 0.0000
    },
    testCost() {
      return (this.fullDataList.fabricList && this.fullDataList.fabricList.length !== 0) ? this.fullDataList.fabricList[this.editableTabsValue].testCost ? this.fullDataList.fabricList[this.editableTabsValue].testCost.toFixed(4) : 0.0000 : 0.0000
    },
    totalCost() {
      return (this.fullDataList.fabricList && this.fullDataList.fabricList.length !== 0) ? this.fullDataList.fabricList[this.editableTabsValue].totalCost ? this.fullDataList.fabricList[this.editableTabsValue].totalCost.toFixed(4) : 0.0000 : 0.0000
    },
    countryName() {
      return (this.fullDataList.fabricList && this.fullDataList.fabricList.length !== 0) ? this.fullDataList.fabricList[this.editableTabsValue].countryName : ''
    },
    targetProfitRate() {
      return (this.fullDataList.fabricList && this.fullDataList.fabricList.length !== 0) ? this.fullDataList.fabricList[this.editableTabsValue].targetProfitRate ? this.fullDataList.fabricList[this.editableTabsValue].targetProfitRate.toFixed(2) : 0.00 : 0.00
    },
    actualProfitRate() {
      let price = this.sellingPrice
      // 是否退税
      if (this.taxRebateMark) {
        const p = this.$utils.getFloat((this.productionCost - this.$utils.getFloat(this.productionCost / 1.115, 4)), 4)
        price = this.$utils.getFloat(price - 0 + p, 4)
      }

      return (this.sellingPrice ? this.$utils.getFloat((this.$utils.getFloat((this.$utils.getFloat((price - this.totalCost), 4) / this.sellingPrice), 4) * 100), 2) : '0.00')
    },

    // 闪粉数据
    flashPowderData() {
      const majorPrintingTechList = this.majorPrintingTechList
      return (majorPrintingTechList[0].printingAdditionalList && majorPrintingTechList[0].printingAdditionalList.length !== 0) ? majorPrintingTechList[0].printingAdditionalList.filter(item => item.printingAdditionalType === 'G') : []
    },
    // 荧光数据
    fluorescenceData() {
      const majorPrintingTechList = this.majorPrintingTechList
      return (majorPrintingTechList[0].printingAdditionalList && majorPrintingTechList[0].printingAdditionalList.length !== 0) ? majorPrintingTechList[0].printingAdditionalList.filter(item => item.printingAdditionalType === 'F') : []
    },
    // 凸浆数据
    bumpData() {
      const majorPrintingTechList = this.majorPrintingTechList
      return (majorPrintingTechList[0].printingAdditionalList && majorPrintingTechList[0].printingAdditionalList.length !== 0) ? majorPrintingTechList[0].printingAdditionalList.filter(item => item.printingAdditionalType === 'C') : []
    },
    // 夜光浆数据
    nightGlowPulpData() {
      const majorPrintingTechList = this.majorPrintingTechList
      return (majorPrintingTechList[0].printingAdditionalList && majorPrintingTechList[0].printingAdditionalList.length !== 0) ? majorPrintingTechList[0].printingAdditionalList.filter(item => item.printingAdditionalType === 'L') : []
    }
    // dollarExchangeRate() {
    //   return (this.fullDataList.fabricList && this.fullDataList.fabricList.length !== 0) ? this.fullDataList.fabricList[this.editableTabsValue].rmbToUsd : ''
    // },
    // HongKongDollarExchangeRate() {
    //   return (this.fullDataList.fabricList && this.fullDataList.fabricList.length !== 0) ? this.fullDataList.fabricList[this.editableTabsValue].rmbToHkd : ''
    // }
  },
  watch: {
    customerId(newVal, oldNew) {
      this.$set(this.baseSearchData[4].componentsOptions, 'url', `/customer/customer-details-page/${newVal}`)
    },
    businessOpportunityId(newVal, oldNew) {
      if (/crm/.test(this.branch)) {
        this.$set(this.baseSearchData[2].componentsOptions, 'url', `/business-opportunity/business-opportunity-details-page/${newVal}`)
      }
      // this.$set(this.baseSearchData[1].componentsOptions, 'url', `/business-opportunity/business-opportunity-details-page/${newVal}`)
    },
    brandId(newVal, oldNew) {
      if (/crm/.test(this.branch)) {
        this.$set(this.baseSearchData[8].componentsOptions, 'url', `/brand-business/brand-business-details-page/${newVal}`)
      }
      // this.$set(this.baseSearchData[6].componentsOptions, 'url', `/brand-business/brand-business-details-page/${newVal}`)
    },
    editableTabsValue(newVal, oldVal) {
      this.anchorPointIndex = 0
      if (this.fullDataList.fabricList[newVal].weight) {
        const { weight, clothWidth, weightPerSquare, unit } = this.fullDataList.fabricList[newVal]
        this.quantityData = [this.getQuantityWeight({ weight, clothWidth, weightPerSquare, unit })]
      } else {
        this.quantityData = []
      }
      this.$set(this.transportFreightInternationalViewColumns[7].componentsOptions, 'productCostSubtotal', this.fullDataList && this.fullDataList.fabricList && this.fullDataList.fabricList[newVal].productionCost)
      this.$set(this.transportFreightInternationalViewColumns[7].componentsOptions, 'targetProfitRate', this.fullDataList && this.fullDataList.fabricList && this.fullDataList.fabricList[newVal].targetProfitRate)
      this.$set(this.transportFreightInternationalViewColumns[7].componentsOptions, 'weight', this.fullDataList && this.fullDataList.fabricList && this.fullDataList.fabricList[newVal].weight)
      window.scrollTo(0, 0)
      const newArray = ['yarnList', 'wovenLossList', 'wovenTechList', 'dyeingTechList', 'afterfinishLossList', 'functionLossList', 'majorPrintingTechList', 'paymentMethodList', 'freightList', 'testCostList']
      newArray.forEach(item => {
        this[item] = this.fullDataList.fabricList[newVal][item] || []
      })
      this.taxRebateMark = this.fullDataList.fabricList[newVal].taxRebateMark
      this.notes = this.fullDataList.fabricList[newVal].notes
      if (this.fullDataList.fabricList && this.quantityData.length && this.fullDataList.fabricList[newVal].weightPerSquare < 150) {
        this.$set(this.otherProductMainPrintingViewColumns[3].componentsOptions, 'isFlag', true)
        this.$set(this.otherProductSecondaryPrintingBaseColumns[1].componentsOptions, 'isFlag', true)
      } else {
        this.$set(this.otherProductMainPrintingViewColumns[3].componentsOptions, 'isFlag', false)
        this.$set(this.otherProductSecondaryPrintingBaseColumns[1].componentsOptions, 'isFlag', false)
      }
      if (this.fullDataList.fabricList && this.fullDataList.fabricList[newVal].freightList && this.fullDataList.fabricList[newVal].freightList.length && this.fullDataList.fabricList[newVal].freightList[0].priceClauseName === 'CIF') {
        this.$set(this.transportFreightInternationalViewColumns[7].componentsOptions, 'isFlag', true)
      } else {
        this.$set(this.transportFreightInternationalViewColumns[7].componentsOptions, 'isFlag', false)
      }
      let productDyeingFlag = false
      if (this.fullDataList.fabricList && this.fullDataList.fabricList[newVal].majorPrintingTechList) {
        this.fullDataList.fabricList[newVal].majorPrintingTechList.map(item => {
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
      if (this.fullDataList.fabricList && this.fullDataList.fabricList[newVal].afterfinishLossList) {
        this.fullDataList.fabricList[newVal].afterfinishLossList.map(item => {
          if (item.afterfinishTechName && item.afterfinishTechName.includes('底磨毛') || item.afterfinishTechName.includes('面磨毛') || item.afterfinishTechName.includes('底刷毛') || item.afterfinishTechName.includes('面刷毛')) {
            clothBaseFlag = true
          }
        })
      }
      if (this.fullDataList.fabricList && this.fullDataList.fabricList[newVal].dyeingTechList) {
        this.fullDataList.fabricList[newVal].dyeingTechList.map(item => {
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

      if (this.fullDataList.fabricList[newVal].freightList && this.fullDataList.fabricList[newVal].freightList.length && this.fullDataList.fabricList[newVal].freightList[0].affordExpense) {
        this.freightCoefficient = this.$utils.getFloat(this.fullDataList.fabricList[newVal].freightList[0].affordExpense / (this.quantityData.length && this.quantityData[0].weight), 4)
      }
    }
  },
  created() {
    // 跟系统导航请求同一个接口 会有重复提交的问题导致导航数据渲染不出来
    setTimeout(() => {
      this.getSysAppSystemList()
    }, 1000)
    this.routeId && this.getOfferInfoDisplay({ quotationId: this.routeId })
    this.routeId && this.getQuotationSheetInfo({ quotationId: this.routeId, id: this.$route.params.codeid })
    // this.getfilePage()
  },
  methods: {
    // dataScroll: debounce(function() {
    //   const scroll = document.documentElement.scrollTop || document.body.scrollTop
    //   var sections = document.getElementsByClassName('point')
    //   for (var i = sections.length - 1; i >= 0; i--) {
    //     if (scroll >= sections[i].offsetTop - 269) {
    //       this.anchorPointIndex = i
    //       break
    //     }
    //   }
    //   if (document.getElementsByClassName('myanchorPoint')[0].offsetTop < scroll - 269) {
    //     this.anchorPointShow = true
    //   } else {
    //     this.anchorPointShow = false
    //   }
    // }, 100),
    // 锚点点击事件
    anchorPoint(index, id) {
      const anchor = this.$el.querySelector(id)
      window.scrollTo({ top: anchor.offsetTop - 269, behavior: 'smooth' })
      this.anchorPointIndex = index
    },
    // 获取布类
    getFabricName(item) {
      if (item.status === ' W' || item.status === ' C' || item.status === 'U' || item.status === ' A' || item.status === 'V' || item.status === 'R' || item.status === 'E') {
        var width = ''
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
    // 编辑
    detailEdit() {
      const branchFlag = /crm/.test(this.branch)
      this.$router.push(branchFlag ? `/offer/offer-add-edit-page/${this.routeId}` : `/price-offer/offer-add-edit-page/${this.routeId}/${this.$route.params.codeid}`)
    },

    // 删除
    detailDelete() {
      this.$confirm(' 你确认要删除该报价吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const data = { quotationId: this.routeId }
          if (!/crm/.test(this.branch)) {
            data.id = this.$route.params.codeid
          }
          this.deleteOffer(data, true)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    }

  }
}
</script>

<style lang='scss' scoped>
.offer-details-page {
    margin:20px;
    background-color: #fff;

    .offerHeader {
        height: 60px;
        border-bottom: 1px solid #E9EFF2;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .offerText {
      font-size: 18px;
      font-weight: 400;
      color: '#151222';
      flex:1;
      margin-left: 20px;
    }

    .details-button {
        display: flex;
        margin-right: 20px;
    }

  .offer-add-edit {
    // padding: 20px;

    // .one-step,.second-step {
      .header {
        display: flex;
        align-items: center;
        height: 65px;
        // padding: 0 20px;
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
    // }
    .one-step {
      background-color: #fff;
      // .header {
      // }

      .search {
        padding: 36px 120px 0px 60px;
        margin-bottom: 12px;

        .el-form.el-form--inline .el-form-item {
          margin-bottom: 24px;
        }
      }

      .tip {
        height: 60px;
        margin: 0 20px;
        line-height: 60px;
        font-size: 14px;
        color: #FF4444;
        border-top: 1px solid #E9EFF2;
      }
    }

    // .second-step {
      .top {
        background-color: #fff;
        // margin-bottom: 15px;
        .header {
          .submit {
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
          }
          .tabItem:hover .tabClose {
            display: block;
          }
        }
      }
      .content {

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

        .quantity, .yarn, .material, .cloth, .production, .finance, .transport, .test, .totalCost, .sellingPrice, .unitPrice {
          background-color: #fff;
          font-size: 14px;
          // margin-bottom: 15px;
        }
        .notes {
          display: flex;
          padding: 10px 0;
          border-top: 1px solid #EEEFF0;
          .title {
            text-align: left;
            width: 70px;
          }
          .notes-text {
            flex: 1;
          }
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
            // margin: 0 20px;
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
          margin-top: 20px;
          margin-bottom: 16px;
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
    // }
  }
  .anchorPoint {
    color: #3C4043;
    padding: 10px 0px;
    font-size: 14px;

      .pointItem {
        cursor: pointer;
        color: #3C4043;
        .con-text {
          display: inline-block;
          border-bottom: 2px solid transparent;
          transition: border-color .3s,background-color .3s,color .3s;
          line-height: 38px;
          height: 38px;
        }
      }

      .actived {
        color: #0986ff;
        .con-text {
            border-color:#0986ff;
          }
      }
      .el-divider {
        margin: 0 20px;
        background-color: #D0D6DA;
      }
    }
    .pos-s {
      width: 100%;
      padding: 15px 70px;
       position: fixed;
       top:88px;
       z-index:99;
       background: #fff;
       margin: 0;
    }
    /deep/.el-tabs__nav {
      z-index: 0;
    }
    /deep/.print-quote{
    .page-table tbody .el-table__row td{
      border-bottom-width: 1px !important;
    }
    .page-table .el-table__row td{
      padding: 5px 0;
    }
    .table tr:nth-child(even){
      background-color: #FFFFFF !important;
    }
    .el-table--border{
      font-size: 12px;
    }

  }
  .yarnType-class{
    margin: 5px 0;
    line-height: 16px;
  }
}
.taxRebateMark {
  text-align: right;
}
</style>

<style lang="scss">
.offer-details-page {
  .yarnType-class{
    margin: 0;
    width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .detailSearch {
    // padding: 10px;
    padding: 0 40px 20px;

    .el-textarea {
      vertical-align: middle;
    }

    .el-input__inner,.el-textarea__inner {
      border: 0;
      padding: 0 8px;
    }

    .el-form-item__label {
      color: #888E9E
    }

    .el-form-item {
      margin-bottom: 0px;
    }

    // .el-input__inner {
    //   padding: 0 8px;
    // }
  }
  .el-textarea__inner { //el_input中的隐藏属性
    resize: none;  //主要是这个样式
  }

  .commonTabs {
    padding: 20px 40px 0;

    .el-tabs__item {
      line-height: 20px;
      font-size: 14px;
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
    .el-tabs__header {
      margin-bottom: 0;
    }
    // .el-tabs__content {
    //   margin: 0 -40px;
    // }
  }

  .closedState {
    font-size: 14px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    .el-step__main {
      flex-grow: inherit;
    }
  }
  .el-step__main {
    .el-step__title {
      font-size: 14px;
    }
  }

  // 状态样式
  .offerStatusLine {
    display: flex;
    align-items: center;
    justify-content: center;
    .dottedLine {
      height: 1px;
      width: 161px;
      border-bottom: 1px dotted  #D3D3D3;
    }
    .dottedLine.actived {
      border-bottom-color: #3ED7D9;
    }
    .status {
      width: 62px;
      line-height: 62px;
      height: 62px;
      font-size: 14px;
      color: #BDBDBD;
      border-radius: 50%;
    //   cursor: pointer;
      background: #ECECEC;
      text-align: center;
    }
    .status.actived {
      background: #3ED7D9;
      color: #fff;
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

  .offer-add-edit {
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
      padding: 10px 0px;
      // padding: 0 20px;
      .table tr:nth-child(even) {
        background-color: #fff;
      }
      tbody .el-table__row td {
        border-bottom: 1px solid #EEEFF0;
      }

      .table thead {
        .is-right {
          padding-right: 10px;
        }
      }
    }
  }
  .effectiveDate {
    position: absolute;
    right: 40px;
    top: 84px;
    font-size: 14px;
    color: #666;
  }
}
</style>
