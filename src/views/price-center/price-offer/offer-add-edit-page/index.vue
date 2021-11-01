<template>
  <div>
    <div v-show="!isPreView" class="offer-add-edit">
      <!-- 状态控制 -->
      <div class="offerStatus">
        <div class="offerStatusLine">
          <div class="status actived"><span class="step">1</span> 填写基本信息</div>
          <div class="dottedLine" :class="{actived:!stepFlag}" />
          <div class="status" :class="{actived:!stepFlag}"> <span class="step">2</span> 录入价格明细</div>
          <div class="dottedLine" />
          <div v-if="/crm/.test(branch)" class="status"><span class="step">3</span> 提交审批</div>
          <div v-if="/erp/.test(branch)" class="status"><span class="step">3</span> 保存</div>
        </div>
      </div>
      <div v-show="stepFlag" class="one-step">
        <div class="header">
          <span v-if="/crm/.test(branch)" class="text">{{ routeId ? routeName ? '新建' : '编辑' : '新建' }}</span>
          <span v-if="/erp/.test(branch)" class="text">{{ routeId ? '编辑' : '新建' }}</span>
          <el-button class="next-step" size="mini" @click="nextStep">下一步</el-button>
          <el-button size="mini" @click="cancel">取消</el-button>
        </div>
        <!-- 搜索表单 -->
        <div class="search">
          <cs-custom-form ref="detailsForm" :data-source="searchData" :options="formOtions" :form-datas="briefFormDatas" />
        </div>
        <div v-if="/crm/.test(branch)" class="tip">温馨提示：有效期选项为自然天，从“首次使用日期”开始计算</div>
      </div>
      <div v-show="!stepFlag" class="second-step">
        <div class="top" :class="{ 'hiddenSide':!sidebar}">
          <div class="header">
            <span class="text">录入价格明细</span>
            <el-button class="next-step" size="mini" @click="previousStep">上一步</el-button>
            <el-button class="next-step" size="mini" @click="preView">预览</el-button>
            <el-button v-permission="['crm:quotationSheet:draft', 'price:quotationSheet:draft']" class="next-step" size="mini" @click="saveDraft">保存为草稿</el-button>
            <el-button v-permission="['crm:quotationSheet:submit','price:quotationSheet:add']" class="submit" type="primary" size="mini" @click="submitApproval">{{ /crm/.test(branch) ? '提交审批' : '保存' }}</el-button>
            <el-button size="mini" @click="cancel">取消</el-button>
          </div>
          <el-scrollbar
            ref="scrollbar"
            :key="totalDataList.length"
            :view-style="{margin:'10px 20px'}"
          >
            <div class="tabs">
              <div v-for="(item, index) in totalDataList" :key="index" class="tabItem">
                <div class="tabItem-b">
                  <div class="btn" :class="{active:editableTabsValue === index}" @click="editableTabsValue = index">{{ /crm/.test(branch) ? getFabricName(item) : item.fabricName }}</div>
                  <i v-show="!item.flag" class="el-icon-circle-close tabClose" @click="closeTab(item, index)" />
                </div>
              </div>
              <div class="tabItem lastitem">
                <div class="tabItem-b">
                  <div class="btn el-icon-plus" @click="addTab" />
                </div>
              </div>
            </div>
          </el-scrollbar>
          <div class="anchorPoint">
            <a v-for="(item, index) in costGroup" :key="index" :name="'point' + index" href="javascript:void(0)" class="pointItem" :class="{'actived': anchorPointIndex === index}">
              <span class="con">
                <span class="con-text" @click="anchorPoint(index, `#point${index}`)">{{ item }}</span>&nbsp;
                <i v-if="index===0" class="red" :class="{green:getRequired1}">*</i>
                <i v-if="index===1" class="red" :class="{green:getRequired2}">*</i>
                <i v-if="index===2" class="red" :class="{green:getRequired3}">*</i>
                <i v-if="index===3" class="red" :class="{green:getRequired4}">*</i>
                <i v-if="index===5" class="red" :class="{green:getRequired5}">*</i>
                <i v-if="index===6" class="red" :class="{green:getRequired6}">*</i>
                <i v-if="index===8" class="red" :class="{green:getRequired7}">*</i>
                <i v-if="index!==4&&index!==8" class="el-icon-plus icon anchorPointAdd" @click="costGroupAdd(item)" />
                <el-popover
                  v-if="index===4"
                  placement="bottom-start"
                  width="200"
                  trigger="click"
                >
                  <div class="btn-group">
                    <el-button size="small" @click="productDyeingPop">
                      <i class="el-icon-plus icon" />染色工艺
                    </el-button>
                    <el-button size="small" @click="productPostIntegrationLossPop('add')">
                      <i class="el-icon-plus icon" />后整/后整损耗
                    </el-button>
                    <el-button size="small" @click="productFunctionLossPop('add')">
                      <i class="el-icon-plus icon" />功能/功能损耗
                    </el-button>
                    <el-button v-if="majorPrintingTechList.length === 0" size="small" @click="productMainPrintingPop('add')">
                      <i class="el-icon-plus icon" />主要印花工艺
                    </el-button>
                  </div>
                  <i slot="reference" class="el-icon-plus icon anchorPointAdd" />
                </el-popover>
              </span>
              <el-divider v-if="index !== costGroup.length-1" direction="vertical" />
            </a>
          </div>
        </div>
        <div class="content">
          <!-- 数量 -->
          <div v-show="anchorPointIndex===0" id="point0" class="point quantity">
            <div class="space-between">
              <div class="header-btn">
                <el-button v-if="quantityData.length === 0" size="small" @click="quantityPop">
                  <i class="el-icon-plus icon" />数量
                </el-button>
              </div>
              <div style="height:20px" />
            </div>
            <!-- table表格 -->
            <div v-if="quantityData && quantityData.length !== 0" class="page-table tables-item">
              <div class="subhead">数量</div>
              <cs-custom-table
                tooltip-effect="dark"
                :header-cell-style="headerRowStyle"
                :columns="quantityColumns"
                :data-source="quantityData"
                :operates="quantityPopOperates"
                edit-type="pop"
              />
            </div>
          </div>
          <!-- 纱成本 -->
          <div v-show="anchorPointIndex===1" id="point1" class="point yarn">
            <div class="space-between">
              <div class="header-btn">
                <el-button size="small" @click="yarnPop()">
                  <i class="el-icon-plus icon" />纱线
                </el-button>
              </div>
              <div>
                <span class="subtotal">成本小计: <span class="money">{{ '￥' + yarnCostSubtotal }}</span></span>
              </div>
            </div>
            <div v-show="getYarnList('S').length" class="tables-item">
              <div class="subhead">短纤</div>
              <div class="page-table" style="padding-bottom: 20px;">
                <cs-custom-table
                  tooltip-effect="dark"
                  :header-cell-style="headerRowStyle"
                  :columns="yarnSpunColumns"
                  :data-source="yarnListS"
                  :operates="removeOperates"
                  edit-type="pop"
                  :form-datas="{flag: ['yarnListS']}"
                />
              </div>
            </div>
            <div v-show="getYarnList('F').length" class="tables-item">
              <div class="subhead">长丝</div>
              <div class="page-table" style="padding-bottom: 20px;">
                <cs-custom-table
                  tooltip-effect="dark"
                  :header-cell-style="headerRowStyle"
                  :columns="yarnFilamentColumns"
                  :data-source="yarnListF"
                  :operates="removeOperates"
                  edit-type="pop"
                  :form-datas="{ flag: ['yarnListF']}"
                />
              </div>
            </div>
          </div>
          <!-- 原材料成本 -->
          <div v-show="anchorPointIndex===2" id="point2" class="point material">
            <div class="space-between">
              <div class="header-btn">
                <el-button v-if="wovenLossList.length === 0" size="small" @click="materialPop">
                  <i class="el-icon-plus icon" />织损耗
                </el-button>
              </div>
              <div>
                <span class="subtotal">成本小计: <span class="money">{{ '￥' + materialCostSubtotal }}</span></span>
              </div>
            </div>
            <!-- table表格 -->
            <div v-if="wovenLossList.length !== 0" class="page-table tables-item">
              <div class="subhead">织损耗</div>
              <cs-custom-table
                tooltip-effect="dark"
                :header-cell-style="headerRowStyle"
                :columns="materialBaseColumns"
                :data-source="wovenLossList"
                :operates="removeOperates"
                :form-datas="{index: [0], flag: ['wovenLossList']}"
                edit-type="pop"
              />
            </div>
          </div>
          <!-- 坯布成本 -->
          <div v-show="anchorPointIndex===3" id="point3" class="point cloth">
            <div class="space-between">
              <div class="header-btn">
                <el-button v-if="wovenTechList.length === 0" size="small" @click="clothPop">
                  <i class="el-icon-plus icon" />织工
                </el-button>
              </div>
              <div>
                <span class="subtotal">成本小计: <span class="money">{{ '￥' + fabricCostSubtotal }}</span></span>
              </div>
            </div>
            <!-- table表格 -->
            <div v-if="wovenTechList.length !== 0" class="page-table tables-item">
              <div class="subhead">织工</div>
              <cs-custom-table
                tooltip-effect="dark"
                :header-cell-style="headerRowStyle"
                :columns="clothBaseColumns"
                :data-source="wovenTechList"
                :operates="removeOperates"
                :form-datas="{index: [0], flag: ['wovenTechList']}"
                edit-type="pop"
              />
            </div>
          </div>
          <!-- 生产成本 -->
          <div v-show="anchorPointIndex===4" id="point4" class="point production">
            <div class="space-between">
              <div class="header-btn">
                <el-button size="small" @click="productDyeingPop">
                  <i class="el-icon-plus icon" />染色工艺
                </el-button>
                <el-button size="small" @click="productPostIntegrationLossPop('add')">
                  <i class="el-icon-plus icon" />后整/后整损耗
                </el-button>
                <el-button size="small" @click="productFunctionLossPop('add')">
                  <i class="el-icon-plus icon" />功能/功能损耗
                </el-button>
                <el-button v-if="majorPrintingTechList.length === 0" size="small" @click="productMainPrintingPop('add')">
                  <i class="el-icon-plus icon" />主要印花工艺
                </el-button>
              </div>
              <div>
                <span class="subtotal">成本小计: <span class="money">{{ '￥' + productCostSubtotal }}</span></span>
              </div>
            </div>
            <div v-if="dyeingTechList.length !== 0" class=" tables-item">
              <div class="subhead">染色
              </div>
              <div class="page-table">
                <cs-custom-table
                  tooltip-effect="dark"
                  :header-cell-style="headerRowStyle"
                  :columns="productDyeingViewColumns"
                  :data-source="dyeingTechList"
                  :operates="removeOperates"
                  edit-type="pop"
                  :form-datas="{ flag: ['dyeingTechList']}"
                />
              </div>
            </div>
            <div v-if="afterfinishLossList.length !== 0" class=" tables-item">
              <div class="subhead"> 后整 </div>
              <div class="page-table">
                <cs-custom-table
                  tooltip-effect="dark"
                  :header-cell-style="headerRowStyle"
                  :columns="productPostIntegrationLossBaseColumns"
                  :data-source="afterfinishLossList"
                  :operates="removeOperates"
                  edit-type="pop"
                  :form-datas="{flag: ['afterfinishLossList']}"
                />
              </div>
            </div>
            <div v-if="functionLossList.length !== 0">
              <div class=" tables-item">
                <div class="subhead">功能</div>
                <div class="page-table">
                  <cs-custom-table
                    tooltip-effect="dark"
                    :header-cell-style="headerRowStyle"
                    :columns="productFunctionLossBaseColumns"
                    :data-source="functionLossList"
                    :operates="removeOperates"
                    edit-type="pop"
                    :form-datas="{ flag: ['functionLossList']}"
                  />
                </div>
              </div>
            </div>
            <div v-if="majorPrintingTechList.length !== 0">
              <div class=" tables-item">
                <div class="subhead">主要印花</div>
                <div class="page-table">
                  <cs-custom-table
                    tooltip-effect="dark"
                    :header-cell-style="headerRowStyle"
                    :columns="otherProductMainPrintingViewColumns"
                    :data-source="majorPrintingTechList"
                    :operates="removeOperates"
                    edit-type="pop"
                    :form-datas="{ flag: ['majorPrintingTechList']}"
                  />
                </div>
                <div v-if="majorPrintingTechList && majorPrintingTechList.length !== 0">
                  <div>
                    <div class="tableContent">
                      <div class="button" @click="productSecondaryPrintingPop"><i class="el-icon-circle-plus-outline icon" />添加次要印花</div>
                    </div>
                    <div v-show="majorPrintingTechList && majorPrintingTechList.length&&majorPrintingTechList[0].minorPrintingTechList&&majorPrintingTechList[0].minorPrintingTechList.length">
                      <div class="subhead">次要印花</div>
                      <div class="page-table">
                        <cs-custom-table
                          tooltip-effect="dark"
                          :header-cell-style="headerRowStyle"
                          :columns="otherProductSecondaryPrintingBaseColumns"
                          :data-source="majorPrintingTechList[0].minorPrintingTechList"
                          :operates="removeOperates"
                          edit-type="pop"
                          :form-datas="{index: [0], flag: ['majorPrintingTechList', 'minorPrintingTechList']}"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <!-- 财务成本 -->
          <div v-show="anchorPointIndex===5" id="point5" class="point finance">
            <div class="space-between">
              <div class="header-btn">
                <el-button v-if="paymentMethodList.length === 0" size="small" @click="financePaymentPop">
                  <i class="el-icon-plus icon" />付款条件
                </el-button>
              </div>
              <div>
                <span class="subtotal">成本小计: <span class="money">{{ '￥' + financeCostSubtotal }}</span></span>
              </div>
            </div>
            <div v-if="paymentMethodList.length !== 0" class="page-table tables-item">
              <div class="subhead">付款条件</div>
              <cs-custom-table
                tooltip-effect="dark"
                :header-cell-style="headerRowStyle"
                :columns="financePaymentBaseColumns"
                :data-source="paymentMethodList"
                :operates="removeOperates"
                edit-type="pop"
                :form-datas="{index: [0], flag: ['paymentMethodList']}"
              />
            </div>
          </div>
          <!-- 运输成本 -->
          <div v-show="anchorPointIndex===6" id="point6" class="point transport">
            <div class="space-between">
              <div class="header-btn">
                <el-button v-if="!freightList || freightList.length === 0" size="small" @click="transportFreightPop('D')">
                  <i class="el-icon-plus icon" />运费
                </el-button>
              </div>
              <div>
                <span class="subtotal">成本小计: <span class="money">{{ '￥' + transportSubtotal }}</span></span>
              </div>
            </div>
            <div v-for="(item, index) in freightList" :key="index">
              <div class="page-table tables-item">
                <div class="subhead">运费</div>
                <cs-custom-table
                  tooltip-effect="dark"
                  :header-cell-style="headerRowStyle"
                  :columns="( item.priceClauseName === 'EXW') ? NexwColumn : item.freightType === 'D' ? NtransportFreightDomesticViewColumns : item.freightType === 'I' ? NtransportFreightInternationalViewColumns : transportNoFreighColumns"
                  :data-source="[item]"
                  :operates="removeOperates"
                  :edit-type="'inline'"
                  :form-datas="{index: [index], flag: ['freightList']}"
                />
              </div>
            </div>
          </div>
          <!-- 测试成本 -->
          <div v-show="anchorPointIndex===7" id="point7" class="point test">
            <div class="space-between">
              <div class="header-btn">
                <el-button size="small" @click="testTestPop">
                  <i class="el-icon-plus icon" />测试方式
                </el-button>
              </div>
              <div>
                <span class="subtotal">成本小计: <span class="money">{{ '￥' + testCostSubtotal }}</span></span>
              </div>
            </div>
            <div v-show="testCostList&&testCostList.length" class="tables-item">
              <div class="subhead">测试方式</div>
              <div class="page-table">
                <cs-custom-table
                  tooltip-effect="dark"
                  :header-cell-style="headerRowStyle"
                  :columns="testTestBaseColumns"
                  :data-source="testCostList"
                  :operates="removeOperates"
                  edit-type="inline"
                  :form-datas="{ flag: ['testCostList']}"
                />
              </div>
            </div>
          </div>
          <div v-show="anchorPointIndex===8" id="point8" class=" totalCost ">
            <div class="space-between">
              <div style="height:20px" />
            </div>
            <div class="tables-item">
              <!-- 成本合计 -->
              <div class="point totalCost">
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
                  <span class="total">销售价格(￥): <el-input v-model="sellingPrice" placeholder="请输入" maxlength="12" @change="sellingPriceChange($event,'salePrice')" @blur="priceBlur" /><i class="errorMessage">{{ priceErrorMessage }}</i></span>
                  <span class="profit">实际利润率<span class="money">{{ actualProfitRate + '%' }}</span></span>
                </div>
              </div>
              <!-- 退税价格/kg -->
              <div class=" sellingPrice">
                <div class="header">
                  <span class="title">退税价格/kg</span>
                  <span class="total">退税价格(￥): <span class="money">{{ taxRebateMark?( productCostSubtotal&&$utils.getFloat((productCostSubtotal-$utils.getFloat(productCostSubtotal/1.115,4)),4)||0.00):'0.00' }}</span></span>
                  <span class="taxRebateMark"><el-switch
                    v-model="taxRebateMark"
                    :active-value="1"
                    :inactive-value="0"
                    @change="sellingPriceChange($event,'taxRebateMark')"
                  /></span>
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
              <div class=" sellingPrice">
                <div class="notes">
                  <span class="title">备注说明</span>
                  <el-input
                    v-model="notes"
                    class="notes-text"
                    type="textarea"
                    :rows="2"
                    maxlength="1000"
                    placeholder="最多1000个字符，按需要填写，如无可不填"
                    @change="sellingPriceChange($event,'notes')"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 选择商机pop弹出层 -->
      <div class="pop">
        <cs-custom-pop :options="businessOpportunityPopOptions" />
      </div>

      <!-- 选择客户pop弹出层 -->
      <div class="pop">
        <cs-custom-pop :options="customerOpportunityPopOptions" />
      </div>

      <!-- 数量弹出框 -->
      <div class="pop">
        <cs-custom-pop :options="quantityPopOptions" />
      </div>
      <!-- 添加纱线弹出框 -->
      <div class="pop">
        <cs-custom-pop ref="yarn" :options="yarnPopOptions" />
      </div>
      <!-- 添加纱线证书弹出框 -->
      <div class="pop">
        <cs-custom-pop ref="yarnCert" :options="yarnCertificatePopOptions" />
      </div>
      <!-- 添加染纱弹出框 -->
      <div class="pop">
        <cs-custom-pop ref="dyeingYarn" :options="dyeingYarnPopOptions" />
      </div>
      <!-- 添加染纱损耗弹出框 -->
      <div class="pop">
        <cs-custom-pop ref="yarnDyeingLoss" :options="yarnDyeingLossPopOptions" />
      </div>

      <!-- 添加原材料成本织损耗弹出框 -->
      <div class="pop">
        <cs-custom-pop ref="material" :options="materialPopOptions" />
      </div>

      <!-- 添加坯布成本织工弹出框 -->
      <div class="pop">
        <cs-custom-pop ref="cloth" :options="clothPopOptions" />
      </div>

      <!-- 添加生产成本染色工艺弹出框 -->
      <div class="pop">
        <cs-custom-pop ref="dyeing" :options="productDyeingPopOptions" />
      </div>
      <!-- 添加生产成本染色工艺附加弹出框 -->
      <div class="pop">
        <cs-custom-pop ref="dyeingAddition" :options="productDyeingAdditionPopOptions" />
      </div>
      <!-- 添加生产成本染色工艺损耗弹出框 -->
      <div class="pop">
        <cs-custom-pop ref="dyeingLoss" :options="productDyeingLossPopOptions" />
      </div>
      <!-- 添加生产成本染色工艺后整损耗弹出框 -->
      <div class="pop">
        <cs-custom-pop ref="after" :options="productPostIntegrationLossPopOptions" />
      </div>
      <!-- 添加生产成本染色工艺功能弹出框 -->
      <div class="pop">
        <cs-custom-pop ref="function" :options="productFunctionLossPopOptions" />
      </div>
      <!-- 添加生产成本染色工艺主要印花弹出框 -->
      <div class="pop">
        <cs-custom-pop ref="mainPrinting" :options="productMainPrintingPopOptions" />
      </div>
      <!-- 添加生产成本染色工艺主要印花印花证书弹出框 -->
      <div class="pop">
        <cs-custom-pop ref="printingCert" :options="productPrintingCertificatePopOptions" />
      </div>
      <!-- 添加生产成本染色工艺次要印花弹出框 -->
      <div class="pop">
        <cs-custom-pop ref="secondaryPrinting" :options="productSecondaryPrintingPopOptions" />
      </div>
      <!-- 添加生产成本染色工艺印花闪粉弹出框 -->
      <div class="pop">
        <cs-custom-pop :options="productPrintingFlashPowderPopOptions" />
      </div>
      <!-- 添加生产成本染色工艺印花荧光弹出框 -->
      <div class="pop">
        <cs-custom-pop :options="productPrintingFluorescencePopOptions" />
      </div>
      <!-- 添加生产成本染色工艺印花凸浆弹出框 -->
      <div class="pop">
        <cs-custom-pop :options="productPrintingBumpPopOptions" />
      </div>
      <!-- 添加生产成本染色工艺印花夜光浆弹出框 -->
      <div class="pop">
        <cs-custom-pop :options="productPrintingNightGlowPulpPopOptions" />
      </div>
      <!-- 添加生产成本染色工艺印花损耗弹出框 -->
      <div class="pop">
        <cs-custom-pop ref="printingLoss" :options="productPrintingLossPopOptions" />
      </div>

      <!-- 添加财务成本付款条件弹出框 -->
      <div class="pop">
        <cs-custom-pop ref="finance" :options="financePaymentPopOptions" />
      </div>

      <!-- 添加运输成本添加运费弹出框 -->
      <div class="pop">
        <cs-custom-pop ref="freight" :options="transportFreightPopOptions" />
      </div>

      <!-- 添加测试成本测试方式弹出框 -->
      <div class="pop">
        <cs-custom-pop ref="test" :options="testTestPopOptions" />
      </div>

      <!-- 提交审批弹出框 -->
      <div class="pop">
        <cs-custom-pop :options="submitPopOptions" />
      </div>

      <!-- 新建客户品牌弹出框 -->
      <div class="pop">
        <cs-custom-pop :options="addPopOptions" />
      </div>
    </div>
    <pre-view v-if="isPreView" @setPreView="setPreView" />
  </div>
</template>

<script>
import { Offer } from '../components/index'
import preView from '../components/pre-view'
import { PublicCrm } from '../../public/index'
import year from '../../public/config/year.js'
import quarter from '../../public/config/quarter.js'
import radioButton from '../components/radio-button.vue'
import selectWithAdd from '../components/select-with-add'
import { quantity } from './mixins/quantity.js'
import { yarn } from './mixins/yarn.js'
import { material } from './mixins/material.js'
import { cloth } from './mixins/cloth.js'
import { production } from './mixins/production.js'
import { finance } from './mixins/finance.js'
import { transport } from './mixins/transport.js'
import { test } from './mixins/test.js'
import { getTotol } from './mixins/totol.js'

export default {
  components: { preView },
  mixins: [Offer, PublicCrm, quantity, yarn, material, cloth, production, finance, transport, test, getTotol],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })

    // 审批用户搜索
    const submitRemoteUser = value => {
      if (value === '') {
        this.$set(this.submitPopOptions.content[1], 'dataSource', [])
      } else {
        this.getData = this.$utils.debounce(this.remoteUserList, 300)
        this.getData({ realName: value, name: value }, 1, this.submitPopOptions)
      }
    }

    // 第一步的内容
    const searchData = [
      {
        prop: 'quotationName',
        itemType: 'input',
        maxlength: 25,
        itemStyle: { 'width': '45%', 'marginRight': '35px' },
        label: '报价名称',
        rules: [commonBlurReg],
        placeholder: '请输入(最多25个字)'
      },
      {
        isShow: () => {
          return /crm/.test(this.branch)
        },
        prop: 'businessOpportunityName',
        itemType: 'input',
        itemStyle: { 'width': '45%', 'marginRight': '35px' },
        label: '商机',
        readonly: true,
        focus: params => {
          this.PopDialogHandle(this.businessOpportunityPopOptions, '选择商机')
          this.remoteBusinessPage({}, 1, this.businessOpportunityPopOptions, this.businessOpportunityPagination)
        },
        placeholder: '查找商机'
      },
      {
        isShow: () => {
          return !/crm/.test(this.branch)
        },
        prop: 'sellerTeamName',
        itemType: 'input',
        itemStyle: { 'width': '45%', 'marginRight': '35px' },
        label: '销售部门',
        rules: [commonBlurReg],
        placeholder: '请输入(最多25个字)'
      },
      {
        isShow: () => {
          return /crm/.test(this.branch)
        },
        prop: 'sellerTeam',
        itemType: 'select',
        itemStyle: { 'width': '45%', 'marginRight': '35px' },
        label: '销售部门',
        valueType: 'object',
        valueKey: 'value',
        rules: [commonChangeReg],
        dataSource: []
      },
      {
        isShow: () => {
          return !/crm/.test(this.branch)
        },
        prop: 'sellerName',
        itemType: 'input',
        itemStyle: { 'width': '45%', 'marginRight': '35px' },
        label: '销售员',
        rules: [commonBlurReg],
        placeholder: '请输入(最多25个字)'
      },
      {
        isShow: () => {
          return /crm/.test(this.branch)
        },
        prop: 'seller',
        itemType: 'select',
        readonly: true,
        itemStyle: { 'width': '45%', 'marginRight': '35px' },
        label: '销售员',
        valueType: 'object',
        valueKey: 'value',
        rules: [commonChangeReg],
        placeholder: '请输入销售员',
        dataSource: []
      },
      {
        isShow: () => {
          return !/crm/.test(this.branch)
        },
        prop: 'customer',
        itemStyle: { 'width': '45%', 'marginRight': '35px' },
        label: '客户',
        rules: [commonBlurReg],
        components: { selectWithAdd },
        dataSource: [],
        componentsOptions: {
          change: (val) => {
            this.briefFormDatas = { ...this.$refs.detailsForm.dynamicValidateFormRuleForm, customer: val }
          },
          focus: async() => {
            const arr = await this.getCustomerList({ area: 'ABROAD' })
            this.searchData[6].dataSource = arr
          },
          add: () => {
            this.addPopOptions.content[0].label = '客户名称'
            this.PopDialogHandle(this.addPopOptions, '新建客户')
          }
        },
        placeholder: '请选择'
      },
      {
        isShow: () => {
          return /crm/.test(this.branch)
        },
        prop: 'customerName',
        itemType: 'input',
        itemStyle: { 'width': '45%', 'marginRight': '35px' },
        label: '客户',
        readonly: true,
        rules: [commonChangeReg],
        focus: params => {
          this.PopDialogHandle(this.customerOpportunityPopOptions, '选择客户')
          this.remoteCustomerPage({ area: 'DOMESTIC', search: '' }, 1, this.customerOpportunityPopOptions, this.customerOpportunityPagination)
        },
        placeholder: '查找客户'
      },
      {
        isShow: () => {
          return !/crm/.test(this.branch)
        },
        prop: 'brand',
        itemStyle: { 'width': '45%', 'marginRight': '35px' },
        label: '品牌',
        rules: [commonBlurReg],
        components: { selectWithAdd },
        dataSource: [],
        componentsOptions: {
          change: (val) => {
            this.briefFormDatas = { ...this.$refs.detailsForm.dynamicValidateFormRuleForm, brand: val }
          },
          focus: async() => {
            const arr = await this.getBrandList()
            this.searchData[8].dataSource = arr
          },
          add: () => {
            this.addPopOptions.content[0].label = '品牌名称'
            this.PopDialogHandle(this.addPopOptions, '新建品牌')
          }
        },
        placeholder: '请选择'
      },
      {
        isShow: () => {
          return /crm/.test(this.branch)
        },
        prop: 'brand',
        itemType: 'select',
        itemStyle: { 'width': '45%', 'marginRight': '35px' },
        label: '品牌',
        valueType: 'object',
        valueKey: 'value',
        dataSource: []
      },
      {
        prop: 'year',
        itemType: 'select',
        // labelWidth: '121px',
        itemStyle: { 'width': '45%', 'marginRight': '35px' },
        label: '销售年度',
        rules: [commonChangeReg],
        dataSource: year
      },
      {
        prop: 'quarter',
        itemType: 'select',
        itemStyle: { 'width': '45%', 'marginRight': '35px' },
        label: '销售季度',
        rules: [commonChangeReg],
        dataSource: quarter
      },
      {
        isShow: () => {
          return /crm/.test(this.branch)
        },
        prop: 'periodOfValidity',
        itemType: 'select',
        itemStyle: { 'width': '45%', 'marginRight': '35px' },
        label: '有效期',
        rules: [commonChangeReg],
        dataSource: [
          { label: '7天', value: 7 },
          { label: '15天', value: 15 },
          { label: '30天', value: 30 },
          { label: '45天', value: 45 },
          { label: '60天', value: 60 }
        ]
      },
      {
        isShow: () => {
          return !/crm/.test(this.branch)
        },
        prop: 'countryName',
        itemType: 'select',
        valueType: 'object',
        itemStyle: { 'width': '45%', 'marginRight': '35px' },
        label: '国家/地区',
        rules: [commonChangeReg],
        dataSource: [],
        change: value => {
          const briefData = this.$refs.detailsForm.dynamicValidateFormRuleForm
          if (value.label && value.value) {
            briefData.targetProfitRate = value.profitRate
            briefData.countryName = value.label
            this.briefFormDatas = briefData
            this.areaData = {
              countryName: value.label,
              targetProfitRate: value.profitRate,
              profitId: value.value
            }
            this.getCountryCodeByName({ name: value.label })
          }
        }
      },
      {
        isShow: () => {
          return !/crm/.test(this.branch)
        },
        prop: 'targetProfitRate',
        itemType: 'input',
        maxlength: 25,
        disabled: true,
        itemStyle: { 'width': '45%', 'marginRight': '35px' },
        label: '目标利润率',
        rules: [commonBlurReg],
        placeholder: '选择国家/地区自动获取'
      },
      {
        isShow: () => {
          return /crm/.test(this.branch)
        },
        prop: 'countryName',
        itemType: 'input',
        maxlength: 25,
        disabled: true,
        itemStyle: { 'width': '45%', 'marginRight': '35px' },
        label: '国家/地区',
        rules: [commonBlurReg],
        placeholder: '国家/地区'
      }
    ]

    // 商机dialog弹出框表格表头的配置信息
    const columnsInfos = [
      {
        prop: 'id',
        label: '选择',
        width: '50',
        components: {
          radioButton
        },
        componentsOptions: {
          id: 'id',
          changeMethods: (value, scope) => {
            this.columnsInfos[0].componentsOptions.scope = scope.row
          }
        }
      },
      {
        prop: 'name',
        label: '商机名称',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'customerName',
        label: '客户',
        minWidth: '60',
        showOverflowTooltip: true
      },
      {
        prop: 'salesAmount',
        label: '销售金额',
        style: { 'padding-right': '10px' },
        width: '130',
        align: 'right',
        formater: scope => {
          return scope.row[scope.column.property] && this.numRecursion(scope.row[scope.column.property] / 10000)
        }
      },
      {
        prop: 'endDate',
        label: '结束日期',
        width: '120',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d}') : ''
        }
      },
      {
        prop: 'createdTime',
        label: '创建日期',
        width: '160',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}') : ''
        }
      },
      {
        prop: 'follower',
        label: '所有人',
        showOverflowTooltip: true,
        minWidth: '70'
      }
    ]
    // 商机分页配置信息
    const businessOpportunityPagination = {
      // currentPage: 1,
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      // dataTotal: dataSource.length,
      currentChange: val => {
        //
        this.remoteBusinessPage({ pageSize: this.businessOpportunityPagination.pageSize || 5, pageNum: val }, 1, this.businessOpportunityPopOptions, this.businessOpportunityPagination)
      },
      sizeChange: val => {
        //
        this.$set(this.businessOpportunityPagination, 'currentPage', 1)
        this.remoteBusinessPage({ pageNum: 1, pageSize: val }, 1, this.businessOpportunityPopOptions, this.businessOpportunityPagination)
      }
    }
    // 选择商机弹出框
    const businessOpportunityPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1020px',
      ok: async(params) => {
        {
          const checkedInfo = this.columnsInfos[0].componentsOptions.radioData
          this.closePopDialogHandle(this.businessOpportunityPopOptions)
          if (checkedInfo) {
            this.firstSelect = 'business'
            this.searchData.splice(7, 1,
              {
                isShow: () => {
                  return /crm/.test(this.branch)
                },
                prop: 'customer',
                itemType: 'select',
                readonly: true,
                itemStyle: { 'width': '45%', 'marginRight': '35px' },
                label: '客户',
                valueType: 'object',
                valueKey: 'value',
                rules: [commonChangeReg],
                placeholder: '查找并选择商机后自动获取',
                dataSource: []
              },
            )
            // 先清空客户跟品牌
            this.$refs.detailsForm.setDynamicValidateFormRuleForm({ brand: { value: '', label: '' }, customer: { value: '', label: '' }, customerName: '' })
            // 带出客户
            this.searchData[7].dataSource = [{ label: checkedInfo.customerName, value: checkedInfo.customerId }]
            this.briefFormDatas = { ...this.$refs.detailsForm.dynamicValidateFormRuleForm, businessOpportunity: { label: checkedInfo.name, value: checkedInfo.id }, businessOpportunityName: checkedInfo.name, customer: { label: checkedInfo.customerName, value: checkedInfo.customerId }}
            // 客户带出品牌
            await this.getBrandBusiness({ customerId: checkedInfo.customerId })
            if (this.searchData[9].dataSource.length === 1) {
              const data = this.searchData[9].dataSource[0]
              this.briefFormDatas.brand = data
            }
            // 客户带出付款条件
            if (checkedInfo.paymentMethodId) {
              this.briefFormDatas.paymentMethod = {
                label: checkedInfo.paymentMethodName,
                value: checkedInfo.paymentMethodId
              }
              this.getPublicPaymant({ paymentMethod: { value: checkedInfo.paymentMethodId }})
            }
          }
        }
      },
      cancel: params => {
        this.closePopDialogHandle(this.businessOpportunityPopOptions)
        // this.$set(this.columnsInfos[0].componentsOptions, 'radio', null)
      },
      close: () => {
        this.$set(this.columnsInfos[0].componentsOptions, 'radio', null)
        this.$set(this.columnsInfos[0].componentsOptions, 'scope', [])
        this.$set(this.businessOpportunityPopOptions.formDatas, 'search', '')
      },
      formDatas: {},
      formOptions: {},
      content: [
        // {
        //   itemType: 'view',
        //   text: `温馨提示：只显示已完成状态的数据`,
        //   style
        // },
        {
          prop: 'search',
          itemType: 'input',
          label: ' ',
          change: this.$utils.debounce(value => {
            if (!value) {
              this.$set(this.businessOpportunityPopOptions.formDatas, 'search', '')
            }
            this.remoteBusinessPage({ keyword: value }, 1, this.businessOpportunityPopOptions, this.businessOpportunityPagination)
          }, 300),
          labelWidth: '600px',
          placeholder: '请输入商机或者客户名称'
        },
        {
          prop: 'table',
          headerCellStyle: { 'background-color': '#F5F7FA' },
          className: 'pop-table',
          itemType: 'table-form',
          label: '',
          labelWidth: '0',
          dataSource: [],
          // rules: [commonChangeReg],
          columns: columnsInfos,
          tooltipEffect: 'dark',
          pagination: businessOpportunityPagination
        }
      ]
    }
    // 查找客户弹出框start
    const customerOpportunityPagination = {
      pageSizes: [5],
      layout: 'total, prev, pager, next',
      currentChange: val => {
        this.remoteCustomerPage({ area: 'DOMESTIC', pageSize: this.customerOpportunityPagination.pageSize || 5, pageNum: val }, 1, this.customerOpportunityPopOptions, this.customerOpportunityPagination)
      },
      sizeChange: val => {
        this.customerOpportunityPagination.currentPage = 1
        this.remoteCustomerPage({ area: 'DOMESTIC', pageNum: 1, pageSize: val }, 1, this.customerOpportunityPopOptions, this.customerOpportunityPagination)
      }
    }
    const customerColumns = [
      {
        prop: 'customerId',
        label: '选择',
        width: '50',
        components: {
          radioButton
        },
        componentsOptions: {
          radio: 0,
          id: 'customerId',
          changeMethods: (value, scope) => {
            this.customerColumns[0].componentsOptions.scope = scope.row
          }
        }
      },
      {
        prop: 'name',
        label: '客户名称',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'shortName',
        label: '中文简称',
        showOverflowTooltip: true,
        minWidth: '100'
      },
      {
        prop: 'ename',
        label: '英文简称',
        showOverflowTooltip: true,
        minWidth: '100'
      },
      {
        prop: 'customerTypeName',
        label: '客户类型',
        showOverflowTooltip: true,
        minWidth: '80'
      },
      {
        prop: 'levelName',
        label: '客户级别',
        showOverflowTooltip: true,
        minWidth: '80'
      },
      {
        prop: 'createdTime',
        label: '创建日期',
        width: '160',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}:{s}') : ''
        }
      },
      {
        prop: 'follower',
        label: '所有人',
        showOverflowTooltip: true,
        minWidth: '70'
      }
    ]
    const customerOpportunityPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '1020px',
      ok: async(params) => {
        {
          const checkedInfo = this.customerColumns[0].componentsOptions.radioData
          this.closePopDialogHandle(this.customerOpportunityPopOptions)
          if (checkedInfo) {
            this.BusinessListPageNum = 1
            // 1.0.4客户字段可单独选择，如先选了客户，则商机字段从查找变为下拉，下拉的数据为当前客户关联的商机品牌字段取消必填
            // 此字段用来标识 新增的时候是先选商机 还是客户  已于产品沟通 一旦保存第一次 之后编辑不可更改
            this.firstSelect = 'customer'
            this.searchData.splice(1, 1,
              {
                isShow: () => {
                  return /crm/.test(this.branch)
                },
                prop: 'businessOpportunity',
                itemType: 'select',
                readonly: true,
                itemStyle: { 'width': '45%', 'marginRight': '35px' },
                label: '商机',
                valueType: 'object',
                valueKey: 'value',
                placeholder: '请选择商机',
                dataSource: []
              }
            )
            // 先清空 品牌跟商机
            this.$refs.detailsForm.setDynamicValidateFormRuleForm({ brand: { value: '', label: '' }, businessOpportunity: { value: '', label: '' }})
            // 根据客户查询商机
            this.getBusinessList({ customerId: checkedInfo.customerId })
            // 根据客户查询品牌
            await this.getBrandBusiness({ customerId: checkedInfo.customerId })
            this.briefFormDatas = { ...this.$refs.detailsForm.dynamicValidateFormRuleForm, customerName: checkedInfo.name, customer: { label: checkedInfo.name, value: checkedInfo.customerId }}
            // 当前客户如果只有一个关联品牌的话，则默认选中
            if (this.searchData[9].dataSource.length === 1) {
              const data = this.searchData[9].dataSource[0]
              this.briefFormDatas.brand = data
            }
            // 如果客户有付款条件 则带出付款条件 通过付款条件id 去查付款条件数据
            if (checkedInfo.paymentMethodId) {
              this.briefFormDatas.paymentMethod = {
                label: checkedInfo.paymentMethodName,
                value: checkedInfo.paymentMethodId
              }
              this.getPublicPaymant({ paymentMethod: { value: checkedInfo.paymentMethodId }})
            }
          }
        }
      },
      cancel: params => {
        this.closePopDialogHandle(this.customerOpportunityPopOptions)
      },
      close: () => {
        this.$set(this.customerColumns[0].componentsOptions, 'radio', null)
        this.$set(this.customerColumns[0].componentsOptions, 'scope', [])
        this.$set(this.customerOpportunityPopOptions.formDatas, 'search', '')
      },
      formDatas: { search: '' },
      formOptions: {},
      content: [
        {
          prop: 'search',
          itemType: 'input',
          label: ' ',
          change: this.$utils.debounce(value => {
            if (!value) {
              this.$set(this.customerOpportunityPopOptions.formDatas, 'search', '')
            }
            this.remoteCustomerPage({ keyword: value, area: 'DOMESTIC' }, 1, this.customerOpportunityPopOptions, this.customerOpportunityPagination)
          }, 300),
          labelWidth: '600px',
          placeholder: '请输入客户或中英文简称'
        },
        {
          prop: 'table',
          headerCellStyle: { 'background-color': '#F5F7FA' },
          className: 'pop-table',
          itemType: 'table-form',
          label: '',
          labelWidth: '0',
          dataSource: [],
          columns: customerColumns,
          tooltipEffect: 'dark',
          pagination: customerOpportunityPagination
        }
      ]
    }
    // 查找客户弹出框end

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
      formDatas: {
      },
      formOptions: {
      },
      content: [
        {
          prop: 'applicantName',
          itemType: 'input',
          label: '提交人',
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

    const addPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '品牌',
      ok: async(params) => {
        if (!params || !params.name) {
          this.$message('请填写名称')
          return
        }
        let res = null
        if (this.addPopOptions.content[0].label.includes('品牌')) {
          // 新建品牌
          res = await this.addBrand({ ...params, area: 'ABROAD' })
        } else {
          // 新建客户
          res = await this.addCustomer({ ...params, area: 'ABROAD' })
        }
        if (res && res.code !== 200) {
          return
        }
        this.$message({
          type: 'success',
          message: '添加成功'
        })
        this.closePopDialogHandle(this.addPopOptions)
      },
      cancel: params => {
        this.closePopDialogHandle(this.addPopOptions)
      },
      formDatas: {
      },
      formOptions: {
      },
      content: [
        {
          prop: 'name',
          itemType: 'input',
          maxlength: 50,
          trim: (value) => {
            return value.trim()
          },
          label: '品牌名称',
          placeholder: '请输入(最多50个字符)'
        },
        {
          itemType: 'view',
          text: '新建后，暂时不支持编辑，请核对清楚后再保存，名称不能重复',
          style: 'color:red;margin-left: 70px;font-size:12px'
        }
      ]
    }

    // 移除操作
    const removeOperates = {
      label: '操作',
      isResetOperateWidth: true,
      width: '100',
      fixed: 'right',
      dataSource: [
        {
          label: '移除',
          // permitTag: ['userCenter:sysDataMaskingRule:modify'],
          isShow: true,
          handle: (params, form, fromDatas, setFormDatas) => {
            this.$confirm(`你确认要移除该项吗？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.removeOperatesFun(fromDatas, params)
                // this.deleteModelDevelop({ id: params.row.id })
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消'
                })
              })
          }
        },
        {
          label: '更换',
          // permitTag: ['userCenter:sysDataMaskingRule:modify'],
          isShow: true,
          handle: (params, form, fromDatas, setFormDatas) => {
            this.isChangeProduct = true
            this.changeOperatesFun(params, fromDatas)
            if (!fromDatas.index) {
              this.rowIndex = params.$index
            } else {
              this.rowIndex = fromDatas.index[0]
            }
            this.rowData = params.row
            this.type = 'replace'
          }
        }
      ]
    }
    return {
      id: '',
      stepFlag: true,
      searchData,
      briefFormDatas: {
        periodOfValidity: 7// 1.0.4默认有效期七天
      },
      formOtions: { labelWidth: '120px', inline: true },
      costGroup: ['数量', '纱成本', '原材料成本', '坯布成本', '生产成本', '财务成本', '运输成本', '测试成本', '销售价格'],
      editableTabsValue: 0,
      areaData: {
        targetProfitRate: 0
      },
      areaList: [],
      headerRowStyle: { 'background-color': '#F5F7FA' },

      columnsInfos,
      businessOpportunityPagination,
      businessOpportunityPopOptions,

      sellingPrice: '',
      priceErrorMessage: '',

      // 审批弹出框
      submitPopOptions,

      // 移除操作
      removeOperates,

      // 准备一份总数据
      // totalDataList: [{ fabricName: '布类1', value: 0, flag: false }],
      totalDataList: [],

      dollarExchangeRate: 1,
      HongKongDollarExchangeRate: 1,

      quotationId: '',
      needUri: '',
      anchorPointIndex: 0,
      tabDataList: [],

      rowInfoMessages: {},
      countryCode: '',
      type: 'add', // 区分弹出框类型，是新增还是更换
      rowIndex: 0, // 更换时记录下标
      rowData: {}, // 更换次要印花时获取当前行的数据
      isChangeProduct: false, // 次要印花是否是更换
      customerOpportunityPopOptions,
      customerOpportunityPagination,
      customerColumns,
      isPreView: false, // 是否预览模式
      taxRebateMark: 0, // 是否退税
      notes: '',
      pricevalue: 'kg',
      PublicPaymant: [],
      addPopOptions,
      commonChangeReg
    }
  },
  computed: {
    routeId() {
      return this.$route.params.id
    },
    routeName() {
      return this.$route.params.name
    },
    sidebar() {
      return this.$store.state.app.sidebar.opened
    },
    userInfo() {
      return this.$store.state.user.userInfo
    },
    // 获取分支是crm或者erp
    branch() {
      return this.$utils.getEnvInfo().branch
    },

    // 成本合计
    totalCost() {
      return this.$utils.getFloat(this.productCostSubtotal * 1 + this.financeCostSubtotal * 1 + this.transportSubtotal * 1 + this.testCostSubtotal * 1, 4)
    },
    // 销售价格/码
    sellingPriceCode() {
      let codePrice = 0
      this.quantityData.length !== 0 ? codePrice = !isNaN(this.sellingPrice) ? this.sellingPrice * this.quantityData[0].clothWidth * this.quantityData[0].weightPerSquare * 0.00081925 / 16 / 2.2046 : 0 : codePrice = 0

      return codePrice.toFixed(4)
    },
    // 实际销售利润率
    actualProfitRate() {
      // const a = this.$utils.getFloat((this.$utils.getFloat((this.sellingPrice - this.totalCost),4) / this.sellingPrice), 4)
      // const a = (this.$utils.getFloat((this.sellingPrice - this.totalCost),4) / this.sellingPrice).toFixed(4)
      let price = this.sellingPrice
      // 是否退税
      if (this.taxRebateMark) {
        price = this.$utils.getFloat(price - 0 + (this.productCostSubtotal && this.$utils.getFloat((this.productCostSubtotal - this.$utils.getFloat(this.productCostSubtotal / 1.115, 4)), 4) || 0), 4)
      }
      return (this.sellingPrice ? this.$utils.getFloat((this.$utils.getFloat((this.$utils.getFloat((price - this.totalCost), 4) / this.sellingPrice), 4) * 100), 2) : '0.00')
    },
    getRequired1() {
      return this.quantityData && this.quantityData.length
    },
    getRequired2() {
      return this.yarnList && this.yarnList.length
    },
    getRequired3() {
      return this.wovenLossList && this.wovenLossList.length
    },
    getRequired4() {
      return this.wovenTechList && this.wovenTechList.length
    },
    getRequired5() {
      return this.paymentMethodList && this.paymentMethodList.length
    },
    getRequired6() {
      return this.freightList && this.freightList.length
    },
    getRequired7() {
      return this.sellingPrice && this.sellingPrice - 0
    }
  },
  watch: {
    // 监听路由是否带有id
    $route: {
      async handler(v) {
        const branch = this.branch
        if (v.params.id) {
          if (/crm/.test(branch)) {
            if (v.params.name) {
              this.$set(this.searchData[1], 'disabled', true)
              this.searchData.splice(7, 1,
                {
                  isShow: () => {
                    return /crm/.test(this.branch)
                  },
                  prop: 'customer',
                  itemType: 'select',
                  readonly: true,
                  itemStyle: { 'width': '45%', 'marginRight': '35px' },
                  label: '客户',
                  valueType: 'object',
                  valueKey: 'value',
                  rules: [this.commonChangeReg],
                  placeholder: '查找并选择商机后自动获取',
                  dataSource: []
                },
              )
              this.$set(this.briefFormDatas, 'businessOpportunityName', v.params.name)
              await this.getBusinessDetailById(v.params.id)
              await this.whetherSaler({ userId: this.userInfo.userId })
              this.getExchangeRateList()
              this.addDisplayInfo()
              // 如果只有一个品牌带出品牌 依赖此方法 getBusinessDetailById
              console.log(this.searchData[9].dataSource)
              if (this.searchData[9].dataSource.length === 1) {
                this.briefFormDatas.brand = this.searchData[9].dataSource[0]
              }
            } else {
              this.getQuotationSheetInfo({ quotationId: v.params.id })
            }
          } else {
            this.getQuotationSheetInfo({ quotationId: v.params.id, id: v.params.codeid })
            // 编辑时候为了展示客户跟品牌数据
            this.searchData[6].dataSource = await this.getCustomerList({ area: 'ABROAD' })
            this.searchData[8].dataSource = await this.getBrandList()
          }
          if (this.$route.query.stepFlag) {
            this.stepFlag = false
          }
          // if (this.$route.query.editableTabsValue) {
          //   this.editableTabsValue = this.$route.query.editableTabsValue
          // }
        } else {
          (/crm/.test(branch)) && await this.whetherSaler({ userId: this.userInfo.userId })
          this.getExchangeRateList()
          this.addDisplayInfo()
        }
      },
      deep: true,
      immediate: true
    },
    editableTabsValue(newVal, oldVal) {
      this.anchorPointIndex = 0
      // this.anchorPointIndex = 0
      if (this.totalDataList[newVal].weight) {
        const { weight, clothWidth, weightPerSquare, unit } = this.totalDataList[newVal]
        this.quantityData = [this.getQuantityWeight({ weight, clothWidth, weightPerSquare, unit })]
      } else {
        this.quantityData = []
      }
      window.scrollTo(0, 0)
      this.sellingPrice = this.totalDataList[newVal].salePrice || 0
      const newArray = ['yarnList', 'wovenLossList', 'wovenTechList', 'dyeingTechList', 'afterfinishLossList', 'functionLossList', 'majorPrintingTechList', 'paymentMethodList', 'freightList', 'testCostList']
      newArray.forEach(item => {
        this[item] = this.totalDataList[newVal][item] || []
      })
      this.yarnListS = this.getYarnList('S')
      this.yarnListF = this.getYarnList('F')
      this.taxRebateMark = this.totalDataList[newVal].taxRebateMark
      this.notes = this.totalDataList[newVal].notes
      this.areaList && this.areaList.map((item, index) => {
        if (this.areaData.countryName === item.countryName) {
          this.areaData.targetProfitRate = item.profitRate
          this.briefFormDatas.targetProfitRate = item.profitRate
          //
        }
      })
      if (this.totalDataList[newVal].freightList && this.totalDataList[newVal].freightList.length && this.totalDataList[newVal].freightList[0].affordExpense) {
        this.freightCoefficient = this.$utils.getFloat(this.totalDataList[newVal].freightList[0].affordExpense / (this.quantityData.length && this.quantityData[0].weight), 4)
      }
    }
  },
  created() {
    // 跟系统导航请求同一个接口 会有重复提交的问题导致导航数据渲染不出来
    setTimeout(() => {
      this.getSysAppSystemList()
    }, 1000)
  },
  mounted() {
    //
    if (!this.$route.params.id) {
      (/erp/.test(this.branch)) && this.whetherSaler()
    }
  },
  methods: {
    // 获取布类
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

    // tabs栏编辑事件
    editText(item, index) {
      this.$set(this.totalDataList, index, { ...this.totalDataList[index], flag: true })
      setTimeout(() => {
        this.$refs.input[index].focus()
      }, 0)
    },
    // blur存储事件
    saveText(item, index) {
      this.$set(this.totalDataList, index, { ...this.totalDataList[index], flag: false })
    },
    // 下一步事件
    nextStep() {
      this.$refs.detailsForm.form.validate((bool, object) => {
        if (bool) {
          this.stepFlag = false
          !this.totalDataList.length && (this.paymentMethodList = this.PublicPaymant)
          !this.totalDataList.length && !/crm/.test(this.branch) && (this.taxRebateMark = 1)
          !this.totalDataList.length && this.totalDataList.push({ fabricName: '布类1', flag: false, paymentMethodList: this.PublicPaymant, taxRebateMark: /crm/.test(this.branch) ? 0 : 1, notes: '' })
        }
      })
    },
    // 取消事件
    cancel() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
  .offer-add-edit {
    padding: 20px;

    .one-step,.second-step {
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
    }
    .one-step {
      margin-top: 40px;
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

    .second-step {
      .top {
        background-color: #fff;
        margin-bottom: 15px;
        position: fixed;
        top: 148px;
        width: calc(100% - 250px);
        transition: width 0.28s;
        z-index: 5;
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
          margin: 0 20px;
          font-size: 14px;
          .pointItem {
            cursor: pointer;
            color: #3C4043;
            line-height: 42px;
            height: 42px;
            display: inline-block;
            .con {
              display: inline-block;
              border-bottom: 2px solid transparent;
              transition: border-color .3s,background-color .3s,color .3s;
              .con-text {
                display: inline-block;
                line-height: 38px;
                height: 38px;
              }
            }
          }

          .actived {
            color: #0986ff;
            .con {
              border-color:#0986ff;
            }
          }
          .anchorPointAdd:hover {
            color: #0986ff;
          }
        }
      }
      .hiddenSide {
        width: calc(100% - 94px);
      }

      .content {
        margin-top: 200px;

        .header {
          display: flex;

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
          padding: 10px 40px 0px;

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
          border-bottom: #A5AEB7;
          font-size: 14px;
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
          .taxRebateMark {
            width: 200px;
            text-align: right;
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
          height: 52px;
          line-height: 52px;
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
    }
    .notes {
      display: flex;
      padding: 10px 20px;
      border-top: 1px solid #EEEFF0;
      .title {
        width: 70px;
        text-align: left;
      }
      .notes-text {
        flex: 1;
      }
    }
    .header-btn {
      padding: 10px 20px;
    }
    .space-between {
      background: #eef5f9;
      display: flex;
      justify-content: space-between;
      .subtotal {
        line-height: 53px;
        margin-right: 20px;
        color: #666;
        .money {
          color: #ff4444;
        }
      }
    }
    .tables-item {
     padding: 0 20px 10px;
     margin-bottom: 20px;
     background-color: #fff;
    }
  }
</style>
<style lang='scss'>
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
    padding: 0;
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
      margin: 0 10px;
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
  .red {
    color: #FF534F;
  }
  .green {
    color: #23c5cd;
  }

</style>
<style lang="scss">
  .country-name{
    .el-form-item {
      align-items: center;
      margin-bottom: 0;
    }
  }
</style>
