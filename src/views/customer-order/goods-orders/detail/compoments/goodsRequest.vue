<template>
  <div class="goods-detail">
    <!-- 基本信息 -->
    <div class="table-item basic-data">
      <div class="header-top basic-top" style="justify-content: left;">
        <span>基本信息</span>
        <div v-if="orderData.versionInfo&&!isEdit" class="versionClass">
          <el-select v-model="versionInfoLength" filterable placeholder="请选择" @change="versionInfoChange">
            <el-option
              v-for="(item, index) in orderData.versionInfo"
              :key="index"
              :label="'v'+item.version"
              :value="item.version"
            />
          </el-select>
        </div>
      </div>
      <cs-custom-form ref="basicData" :class="getEditClass" :data-source="basicData" :options="formOptions" :form-datas="basicFormDatas" />
    </div>
    <div class="order-info">
      <div class="order-header">
        <span>订单信息</span>
      </div>
      <div class="order-content">
        <div class="info-left">
          <div v-if="isEdit" class="top">
            <el-button size="small" type="primary" @click="addOrder">新增</el-button>
          </div>
          <div class="bottom">
            <cs-custom-form
              ref="dataSourceMix"
              :data-source="dataSource"
              :form-datas="leftFormDatas"
            />
          </div>
        </div>
        <div class="info-right">
          <!-- 右侧头部 -->

          <!-- 参板信息 -->
          <div class="order-item">
            <div class="header-top">
              <span class="item-title">参板信息</span>
              <el-button v-if="isEdit" type="primary" size="mini" @click="addReferenceVersionInfo">新增</el-button>
            </div>
            <div class="page-table">
              <cs-custom-table
                tooltip-effect="dark"
                :header-cell-style="headerCellStyle"
                :columns="versionColumns"
                :data-source="versionData"
                :operates="versionOperates"
                :pagination="pagination"
                edit-type="pop"
              />
            </div>
          </div>
          <!-- 产品信息 -->
          <div class="order-item product-item">
            <div class="header-top">
              <span style="border-bottom: 1px solid #EEEFF0;padding-bottom: 18px;width: 100%">产品信息</span>
            </div>
            <cs-custom-form ref="productData" :class="getEditClass" :data-source="productData" :options="formOptions" :form-datas="formDatas" />
          </div>
          <!-- 原料信息 -->
          <div class="order-item">
            <div class="header-top">
              <span>原料信息</span>

            </div>
            <div class="material-datainfo">
              <cs-custom-form
                ref="materialData"
                :data-source="materialData"
              />

            </div>
          </div>
          <!-- 颜色数量交期 -->
          <div class="order-item">
            <div class="header-top">
              <div class="left">
                <span class="title">颜色&数量&交期</span>
                <div class="date-title">
                  <span style="display: inline-block;" class="data-font item-title">单位：</span>
                  <el-select v-model="unit" :disabled="!isEdit" value-key="value" clearable placeholder="请选择" @change="unitChange" @visible-change="visibleUnitsSelect">
                    <el-option
                      v-for="item in unitOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item"
                      :disabled="item.disabled"
                    />
                  </el-select>
                </div>
              </div>
              <div class="right">
                <div class="date-title">
                  <span class="data-font">总数量：{{ this.$utils.priceFormat(getTotalQuantity) || '' }} {{ getTotalQuantity ? unit.label : '' }}</span>
                </div>
                <div class="date-title">
                  <span class="data-font total">总金额(含税)：{{ currencyCode + this.$utils.priceFormat(getTotalAmount) || '' }}</span>
                </div>
                <el-button v-if="isEdit" type="primary" size="mini" @click="addAllInfo">新增</el-button>
              </div>
            </div>
            <div class="page-table color-table">
              <cs-custom-table
                ref="allColumnslData"
                tooltip-effect="dark"
                :header-cell-style="headerCellStyle"
                :columns="allColumns"
                :data-source="colorInfo"
                :operates="allOperates"
                :pagination="pagination"
                edit-type="pop"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 参板信息弹窗 -->
    <div class="pop">
      <cs-custom-pop ref="versionPop" :options="versionPopOptions" />
    </div>

    <!-- 颜色、数量、交期弹窗 -->
    <div class="pop allPop">
      <cs-custom-pop ref="allPop" :options="allPopOptions" />
    </div>
    <!-- 剪版要求弹窗 -->
    <div class="pop">
      <cs-custom-pop ref="naturalFiberPop" :options="shearingRequirementsPopOptions" />
    </div>
    <!-- 数量交期弹窗 -->
    <div class="pop">
      <cs-custom-pop ref="naturalFiberPop" :options="quantityDeliveryPopOptions" />
    </div>
    <!-- 坯布编码弹窗 -->
    <div class="cloth-pop">
      <!-- <cloth-pop :is-visible.sync="isshowCloth" @closepop="closepop" @clothsavePop="clothsavePop" /> -->
      <cloth-pop :title="clothTitle" :form-datas="clothformDatas" :search-data="clothSearch" :pagination="choosePagination" :columns="clothColumns" :is-visible.sync="isshowCloth" :table-data="colorFabricData" @closePop="closepop" @savePop="clothsavePop" />
    </div>
    <!-- 色布/印花布编码选择弹窗 -->
    <div class="pop">
      <color-pop :title="chooseTitle" :search-data="chooseSearch" :pagination="colorPagination" :columns="chooseColumns" :is-visible.sync="isShowchoose" :table-data="colorFabricData" @closePop="closeChoosePop" @savePop="colorSavePop" />
    </div>
    <!-- 智布花号选择弹窗 -->
    <div class="pop">
      <choose-pop :title="FlowerTitle" :search-data="FlowerSearch" :columns="FlowerColumns" :is-visible.sync="isshowFlower" :table-data="tableData" @closePop="closeFlowerPop" @savePop="saveFlowerPop" />
    </div>
  </div>
</template>

<script>
// import clothPop from './clothPop'
import clothPop from './choosePop'
import colorPop from './colorPop'
import choosePop from '@/views/customer-order/public/components/choosePop'
import techRquire from '../../../public/components/tech-require'
import { PublicCustomer } from '@/views/customer-order/public/index'
import { getUnitsSelect } from '@/views/customer-order/public/api/index'
import { queryFlowerNoPage, querycolorFabricPage } from '../../api/index'
import preview from '../../../public/components/preview'
import picPreview from '../../../public/components/picPreview'
import shearingShow from '../../../public/components/shearingShow'
// import greyClothImportVue from '@/views/product-center/product-management/grey-cloth/grey-cloth-import.vue'
export default {
  name: 'GoodsRequest',
  components: {
    clothPop,
    colorPop,
    choosePop
  },
  mixins: [PublicCustomer],
  props: {
    isEdit: {
      type: Boolean
    },
    orderData: {
      type: Object
    }
  },
  data() {
    // table表头颜色
    const headerCellStyle = {
      'background': '#F5F7FA'
    }
    // 产品信息标题样式
    const headerTitleLeftStyle = {
      'margin-right': '2%',
      'line-height': '20px'
    }
    const headerTitleRightStyle = {
      'margin-left': '2%'
    }
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // const commonChangeReg = this.$getRules({ trigger: ['change'] })
    // 最大99.99正则
    // const max99Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,1})|(0{1}))(\.\d{1,2})?$/, message: '0~99.99', trigger: ['blur'] })
    // 最大999.99正则
    const max999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,2})?$/, message: '0~999.99', trigger: ['blur'] })
    const max9999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,3})|(0{1}))(\.\d{1,2})?$/, message: '0~9999.99', trigger: ['blur'] })
    const ismax999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{1,2})?$/, message: '0~99999999.99', trigger: ['blur'] })
    const max999Regtype = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{1,4})?$/, message: '0~99999999.9999', trigger: ['blur'] })
    // 当前时间之前的时间不能选择
    const pickerOptionsBefore = {
      disabledDate(time) {
        return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
      }
    }
    const basicData = {
      _code: {
        prop: 'code',
        itemType: 'input',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '订单号:',
        placeholder: '自动生成',
        readonly: true,
        disabled: true,
        title: true
      },
      _orderType: {
        prop: 'orderType',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '订单类型:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        placeholder: '请选择',
        rules: [{ required: true, message: '订单类型不能为空', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '大货订单', fieldName: '订单类型' }, 'orderType')
          }
        },
        dataSource: []
      },
      _brand: {
        prop: 'brand',
        itemType: 'select',
        className: 'inputWidth commonRemoteSearch',
        placeholder: '输入文字模糊查询',
        filterable: true,
        itemStyle: { 'width': '25%' },
        label: '品牌商:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '品牌商不能为空', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getBrandSelect()
          }
        },
        dataSource: []
      },
      _customer: {
        prop: 'customer',
        itemType: 'select',
        className: 'inputWidth commonRemoteSearch',
        placeholder: '输入文字模糊查询',
        filterable: true,
        itemStyle: { 'width': '25%' },
        label: '客户:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '客户不能为空', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getCustomerSelect('customer')
          }
        },
        dataSource: []
      },
      _garmentFactory: {
        prop: 'garmentFactory',
        itemType: 'select',
        className: 'inputWidth commonRemoteSearch',
        placeholder: '输入文字模糊查询',
        filterable: true,
        itemStyle: { 'width': '25%' },
        label: '制衣厂:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getCustomerSelect('garmentFactory')
          }
        },
        dataSource: []
      },
      _salesTeam: {
        prop: 'salesTeam',
        itemType: 'select',
        className: 'inputWidth commonRemoteSearch',
        placeholder: '输入文字模糊查询',
        filterable: true,
        itemStyle: { 'width': '25%' },
        label: '销售团队:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '销售团队不能为空', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getSellTeamSelect()
          }
        },
        dataSource: []
      },
      _seller: {
        prop: 'seller',
        itemType: 'select',
        className: 'inputWidth commonRemoteSearch',
        placeholder: '输入文字模糊查询',
        filterable: true,
        itemStyle: { 'width': '25%' },
        label: '销售员:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '销售员队不能为空', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getSellerSelect()
          }
        },
        dataSource: []
      },

      _customerService: {
        prop: 'customerService',
        itemType: 'select',
        className: 'inputWidth commonRemoteSearch',
        placeholder: '输入文字模糊查询',
        filterable: true,
        itemStyle: { 'width': '25%' },
        label: '客服:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '客服不能为空', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getCustomerServiceSelect()
          }
        },
        dataSource: []
      },
      _sellYear: {
        prop: 'sellYear',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '销售年度:',
        placeholder: '请选择',
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '销售年度', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getYearSelect('sellYear')
          }
        },
        dataSource: []
      },
      _sellQuarter: {
        prop: 'sellQuarter',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '销售季度:',
        placeholder: '请选择',
        clearable: true,
        valueType: 'object',
        disabled: true,
        rules: [{ required: true, message: '销售季度', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '大货订单', fieldName: '销售季度' }, 'baseData')
          }
        },
        dataSource: []
      },
      _currency: {
        prop: 'currency',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '币别:',
        placeholder: '请选择',
        valueType: 'object',
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '币别不能为空', trigger: 'change' }],
        change: (value) => {
          if (!value) {
            this.currencyCode = ''
            return
          }
          this.currencyDatas.forEach(item => {
            if (item.value === value.value) {
              this.currencyCode = item.code
            }
          })
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getCurrencySelect()
          }
        },
        dataSource: []
      },
      _taxRate: {
        prop: 'taxRate',
        itemType: 'input',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '税率:',
        placeholder: '请输入',
        clearable: true,
        disabled: true,
        rules: [commonBlurReg, max9999Reg],
        change: (value) => {
          const dataList = JSON.parse(JSON.stringify(this.colorInfo))
          dataList.forEach(it => {
            // item.priceTax = item.price * (100 + value * 1) / 100
            // if (item.quantityDelivery && item.quantityDelivery.length) {
            //   item.quantityDelivery[0].amountTax = item.quantityDelivery[0].amount * (100 + value * 1) / 100
            // }
            it.priceTax = ''
            it.price = ''
            it.quantityDelivery && it.quantityDelivery.length && it.quantityDelivery.forEach((io) => {
              io.amount = ''
              io.amountTax = ''
            })
          })
          this.colorInfoTemp = dataList
          this.colorInfo = dataList
          // this.colorInfo = dataList // 传给后台的数据
          const orderData = JSON.parse(JSON.stringify(this.orderDataSource)) // 传给后台的
          if (orderData && orderData.length && orderData[this.rowIndex - 1].colorQuantityDeliverySummary) {
            orderData[this.rowIndex - 1].colorQuantityDeliverySummary.totalAmount = ''
            orderData[this.rowIndex - 1].colorQuantityDeliverySummary.totalQuantity = ''
            const orderdiv = orderData[this.rowIndex - 1].colorQuantityDeliverySummary.colorInfo
            orderdiv && orderdiv.forEach((it, im) => {
              it.priceTax = ''
              it.price = ''
              it.quantityDelivery && it.quantityDelivery.length && it.quantityDelivery.forEach((io) => {
                io.amount = ''
                io.amountTax = ''
              })
            })
          }
          this.orderDataSource = orderData
        }
      },
      _pricingTerm: {
        prop: 'pricingTerm',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '价格条款:',
        placeholder: '请选择',
        valueType: 'object',
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '价格条款不能为空', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getPricingTermSelect()
          }
        },
        dataSource: []
      },
      _paymentTerm: {
        prop: 'paymentTerm',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '付款条件:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '付款条件不能为空', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getPaymentTermSelect()
          }
        },
        dataSource: []
      }

    }

    const columns = {
      _seq: {
        prop: 'seq',
        label: '序号',
        width: '50'
      },
      _garmentPart: {
        prop: 'garmentPart',
        label: '成衣部位',
        labelClassName: 'lableStyle',
        className: 'noLableStyle',
        // itemType: 'table-form',
        editOptions: {
          labelWidth: '0',
          itemType: 'select',
          className: 'commonRemoteSearch',
          placeholder: '输入文字模糊查询',
          filterable: true,
          disabled: true,
          valueType: 'object',
          valueKey: 'value',
          clearable: true,
          visibleChange: (value) => {
            if (value) {
              this.getOptionConfigSelect({ pageName: '大货订单', fieldName: '成衣部位' }, 'garmentPart')
            }
          },
          focus: (e, scope) => {
            if (this.isEdit && this.rowIndex !== scope.$index + 1) {
              this.saveRowData()
            }
            if (this.rowIndex !== scope.$index + 1) {
              this.rowIndex = scope.$index + 1
              this.clearRowIndex()
              this.$set(this.dataSource[0], 'currentRowKey', this.rowIndex)
              this.setOrderDtail()
            }
          },
          dataSource: []
        }
      },

      _cloth: {
        prop: 'cloth',
        width: '0',
        label: '布类',
        formater: (scope) => {
          if (scope.row.cloth && scope.row.cloth.label) {
            return scope.row.cloth.label
          }
        },
        showOverflowTooltip: true
      }
    }
    const operates = {
      label: '操作',
      width: '50',
      // fixed: 'right',
      dataSource: [
        {
          label: '删除',
          isShow: true,
          style: { 'color': '#FE4949' },
          handle: (scope, form, formDatas, setFormDatas) => {
            event.stopPropagation()
            if (this.orderDataSource.length <= 1) {
              this.$message({ type: 'warning', message: '至少保留一条' })
              return
            } else {
              this.$confirm('确认删除该条订单信息数据？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'btn-cancel'
              })
                .then(() => {
                  this.orderDataSource.splice(scope.$index, 1)
                  // this.RawMaterialArray.splice(scope.$index, 1)// xj
                  if (this.status !== '2') {
                    this.orderDataSource.length && this.orderDataSource.forEach((item, index) => {
                      // newValue--
                      item.seq = index + 1
                      item.code = index + 1
                    })
                  }
                  this.rowIndex = this.orderDataSource.length
                  this.clearRowIndex()
                  this.$set(this.dataSource[0], 'currentRowKey', this.rowIndex)
                  this.setOrderDtail()
                  this.clearRowIndex()
                  this.setHomeList(this.rowIndex)
                })
                .catch(() => {
                  this.$message({ type: 'info', message: '已取消删除' })
                })
            }
          }
        }
      ]
    }
    const orderDataSource = [
      {
        seq: 1,
        code: 1,
        garmentPart: undefined,
        cloth: undefined,
        edit: true,
        sampleAnalysisResultId: '', // 客样分析编号
        ingredient: '', // 成份
        ratio: '', // 比例
        dryWay: '', // dryWay
        shrinkL: '', // 缩水(LxW)
        shrinkW: '', // 缩水(LxW)
        printCraft: '', // 印花工艺{JSON}
        dyeCraft: '', // 染整工艺{JSON}
        suggestWidth: '', // 成品幅宽
        suggestWidthUnit: '"', // 成品幅宽单位{固定选项："和CM}
        range: '', // 公差范围
        weightBefore: '', // 成品克重（洗前）
        weightBeforeUnit: '', // 成品克重单位（洗前）{固定值：GM²}
        weightBeforeRange: '', // 成品克重公差范围（洗前）
        weightAfter: '', // 成品克重（洗后）
        weightAfterUnit: '', // 成品克重单位（洗后）{固定值：GM²}
        weightAfterRange: '', // 成品克重公差范围（洗后）
        referenceVersionInfo: [],
        colorQuantityDeliverySummary: {
          maxColorSeq: '',
          unit: '', // 单位
          totalQuantity: '', // 总数量
          totalAmount: '', // 总金额
          colorInfo: []
        }
      }
    ]
    // 订单信息分录
    const dataSource = [
      {
        prop: 'tableForm',
        itemType: 'table-form',
        tooltipEffect: 'dark',
        dataSource: orderDataSource,
        className: 'leftTableForm',
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        size: 'mini',
        columns: columns,
        operates: operates,
        highlightCurrentRow: true,
        rowKey: 'code',
        currentRowKey: 0,
        rowClassName: 'heightRow',
        rowClick: (scope) => {
          this.newValue = 0
          this.newColorValue = 0
          this.newColorChildValue = 0
          if (this.isEdit) {
            this.saveRowData(this.rowIndex)
          }
          this.rowIndex = scope.code
          // this.orderIndex = scope.seq
          this.setOrderDtail()
          this.clearRowIndex()
          this.setHomeList(this.rowIndex)
        }
      }
    ]
    // 参板信息
    const versionColumns = {
      _referenceOrder: {
        prop: 'referenceOrder',
        label: '订单号',
        formater: (scope) => {
          if (scope.row.referenceOrder && scope.row.referenceOrder.label) {
            return scope.row.referenceOrder.label
          }
        }
      },
      _greyClothCode: {
        prop: 'greyClothCode',
        label: '色布/印花布编码',
        minWidth: '160',
        showOverflowTooltip: true
      },
      _referenceContent: {
        prop: 'referenceContent',
        label: '参考内容',
        showOverflowTooltip: true,
        formater: (scope) => {
          if (scope.row.referenceContent && scope.row.referenceContent.label) {
            return scope.row.referenceContent.label
          }
        }
      },
      _remark: {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true
      }
    }

    const versionOperatesData = [
      {
        label: '编辑',
        isShow: true,
        handle: scope => {
          this.isFirstSelect = false
          this.greyClothCode = scope.row.greyClothCode
          this.$set(this.versionContent._referenceOrder, 'dataSource', scope.row.referenceOrder && scope.row.referenceOrder.value ? [scope.row.referenceOrder] : '')
          this.$set(this.versionContent._referenceContent, 'dataSource', scope.row.referenceContent && scope.row.referenceContent.value ? [scope.row.referenceContent] : '')
          // 字段加密--弹框编辑
          this.encryptFn(this.versionContent, this.orderData['_rule'], 'edit')
          this.getcolorFabric()
          this.versionPopHandle('编辑参板信息')
          this.setFormDatas({ ...scope.row }, 'version')
        }
      },
      {
        label: '删除',
        isShow: (scope) => {
          return scope.$index > 0
        },
        style: { 'color': '#FE4949' },
        handle: scope => {
          this.$confirm('确认删除当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'customClass'
          }).then(() => {
            this.versionData.splice(scope.$index, 1)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      }
    ]
    const versionOperates = {
      label: '操作',
      width: '120',
      fixed: 'right',
      dataSource: versionOperatesData
    }
    const materialDatasource = [
      // {
      //   code: 1,
      //   type: '',
      //   element: '',
      //   elementRatio: '',
      //   yarnCategory: '',
      //   certificate: {
      //     value: '',
      //     label: ''
      //   },
      //   supplierYarnCode: '',
      //   edit: true
      // }
    ]
    // 产品信息
    const productData = {
      _ingredient: {
        prop: 'newingredient',
        itemType: 'itemview',
        // className: 'viewStyle',
        itemStyle: { 'width': '33%' },
        label: '成份/比例',
        // valueType: 'object',
        clearable: true,
        disabled: true,
        renderContent: (value) => {
          if (value) {
            return `<div title='${value}' class='yarn-style'>${value}</div>`
          } else {
            return ''
          }
        }
      },
      _dryWay: {
        prop: 'dryWay',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '33%' },
        label: '干燥888方式',
        valueType: 'object',
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '烘干',
            value: '烘干'
          },
          {
            label: '铺干',
            value: '铺干'
          },
          {
            label: '挂干',
            value: '挂干'
          }
        ]
      },
      _shrinkL: {
        prop: 'shrinkL',
        itemType: this.inputTypeChange,
        itemStyle: { 'width': '16%' },
        label: '缩水(LxW)',
        clearable: true,
        disabled: true
      },
      _shrinkX: {
        itemType: 'view',
        style: { display: 'inline-block', height: '32px', 'line-height': '32px', 'margin': '0 6px', color: '#666666' },
        text: 'X'
      },
      _shrinkW: {
        prop: 'shrinkW',
        itemType: this.inputTypeChange,
        itemStyle: { 'width': '8%' },
        label: '',
        labelWidth: '0',
        clearable: true,
        disabled: true

      },
      _dyeCraft: {
        prop: 'dyeCraft',
        itemType: 'itemview',
        // className: 'viewStyle',
        labelWidth: '77px',
        itemStyle: { 'width': '33%' },
        label: '染整工艺',
        // valueType: 'object',
        clearable: true,
        disabled: true,
        renderContent: (value) => {
          if (value && value.includes('[')) {
            const dataList = JSON.parse(value)
            // let dyeTech = ''
            const arr = []
            dataList && dataList.length && dataList.forEach(item => {
              arr.push(item.name)
            })
            const dyeTech = arr.join(',')
            value = dyeTech
            return `<div title='${value}' class='yarn-style'>${value}</div>`
          } else {
            return ''
          }
        }
      },
      _printCraft: {
        prop: 'printCraft',
        itemType: 'itemview',
        // className: 'viewStyle',
        itemStyle: { 'width': '33%' },
        label: '印花工艺',
        // valueType: 'object',
        clearable: true,
        disabled: true,
        renderContent: (value) => {
          if (value && value.includes('[')) {
            const dataList = JSON.parse(value)
            // let printTech = ''
            const arr = []
            dataList && dataList.length && dataList.forEach(item => {
              arr.push(item.label)
            })
            const printTech = arr.join(',')
            value = printTech
            return `<div title='${value}' class='yarn-style'>${value}</div>`
          } else {
            return ''
          }
        }
      },
      _suggestWidthView: {
        itemType: 'view',
        className: 'titleView',
        style: headerTitleLeftStyle,
        text: '成品幅宽'
      },
      _weightBeforeView: {
        itemType: 'view',
        className: 'titleView',
        style: headerTitleRightStyle,
        text: '成品克重（洗前）'
      },

      _suggestWidth: {
        prop: 'suggestWidth',
        itemType: 'itemview',
        className: 'hideInput',
        itemStyle: { 'width': '47%', 'margin-right': '1%' },
        label: '成品幅宽',
        clearable: true,
        disabled: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          if (value) {
            return `<div title='${value} ${formDatas.suggestWidthUnit}' class='yarn-style'>${value} ${formDatas.suggestWidthUnit}</div>`
          } else {
            return ''
          }
        }
      },
      _weightBefore: {
        prop: 'weightBefore',
        itemType: 'itemview',
        className: 'hideInput',
        itemStyle: { 'width': '32%', 'margin-left': '4%' },
        label: '克重',
        clearable: true,
        disabled: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          if (value) {
            return `<div title='${value} ${formDatas.weightBeforeUnit}' class='yarn-style'>${value} ${formDatas.weightBeforeUnit}</div>`
          } else {
            return ''
          }
        }
      },
      _range: {
        prop: 'range',
        itemType: 'select',
        itemStyle: { 'width': '48%' },
        label: '公差范围',
        valueType: 'object',
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '公差范围不能为空', trigger: 'change' }],
        visibleChange: value => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '大货订单', fieldName: '公差范围(幅宽)' }, 'range')
          }
        },
        dataSource: []
      },
      _weightBeforeRange: {
        prop: 'weightBeforeRange',
        itemType: 'select',
        itemStyle: { 'width': '32%', 'margin-left': '4%' },
        label: '公差范围',
        valueType: 'object',
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '公差范围不能为空', trigger: 'change' }],
        visibleChange: value => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '大货订单', fieldName: '公差范围(克重)' }, 'weightBeforeRange')
          }
        },
        dataSource: []
      },
      _weightAfterView: {
        itemType: 'view',
        className: 'titleView',
        style: headerTitleLeftStyle,
        text: '成品克重（洗后）'
      },
      _weightAfterView1: {
        itemType: 'view',
        style: { width: '48%' },
        text: ''
      },
      // _weightAfter: {
      //   prop: 'weightAfter',
      //   itemType: 'input',
      //   itemStyle: { 'width': '32%' },
      //   className: 'hideInput',
      //   label: '克重',
      //   clearable: true,
      //   disabled: true
      // },
      _weightAfter: {
        prop: 'weightAfter',
        itemType: 'input',
        itemStyle: { 'width': '32%' },
        label: '克重',
        rules: [max9999Reg],
        clearable: true,
        disabled: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          if (value) {
            return `<div title='${value} ${formDatas.weightAfterUnit}' class='yarn-style'>${value} ${formDatas.weightAfterUnit}</div>`
          } else {
            return ''
          }
        }
      },
      _weightAfterView2: {
        itemType: 'view',
        style: { width: '48%' },
        text: ''
      },
      _weightAfterRange: {
        prop: 'weightAfterRange',
        itemType: 'select',
        itemStyle: { 'width': '32%' },
        label: '公差范围',
        valueType: 'object',
        clearable: true,
        disabled: true,
        visibleChange: value => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '大货订单', fieldName: '公差范围(克重)' }, 'weightAfterRange')
          }
        },
        dataSource: []
      }
    }
    // 原料信息
    const materialColumns = {
      _code: {
        prop: 'code',
        label: '纱线编码',
        width: '180'
      },
      _yarn: {
        prop: 'yarn',
        label: '纱支/细度',
        width: '180',
        formater: (scope) => {
          if (scope.row.yarn && scope.row.yarn.label) {
            return scope.row.yarn.label
          } else if (scope.row.fineness && scope.row.fineness.label) {
            return scope.row.fineness.label
          } else {
            return ''
          }
        }
      },
      _element: {
        prop: 'element',
        label: '成份',
        width: '180',
        formater: (scope) => {
          return scope.row.element && scope.row.element.label ? scope.row.element.label : ''
        }
      },
      _elementRatio: {
        prop: 'elementRatio',
        label: '比例(%)',
        width: '180'
      },
      _yarnCategory: {
        prop: 'yarnCategory',
        label: '纱类/丝类',
        width: '180',
        formater: (scope) => {
          if (scope.row.yarnCategory && scope.row.yarnCategory.label) {
            return scope.row.yarnCategory.label
          } else if (scope.row.wireCategory && scope.row.wireCategory.label) {
            return scope.row.wireCategory.label
          } else {
            return ''
          }
        }
      },
      _certificate: {
        prop: 'certificate',
        label: '证书要求',
        formater: (scope) => {
          if (scope.row.certificate && scope.row.certificate.label) {
            return scope.row.certificate.label
          } else {
            return ''
          }
        },
        editOptions: {
          labelWidth: '0',
          itemType: 'select',
          valueType: 'object',
          valueKey: 'value',
          clearable: true,

          visibleChange: value => {
            if (value) {
              this.getOptionConfigSelect({ pageName: '大货订单', fieldName: '证书要求' }, 'combine')
            }
          },
          dataSource: []
        }
      },

      _supplierYarnCode: {
        prop: 'supplierYarnCode',
        label: '供应商纱线编码',
        minWidth: '80',
        editOptions: {
          itemType: 'input',
          labelWidth: '0',
          maxlength: 50
        }
      }
    }
    const spanMethod = ({ row, column, rowIndex, columnIndex }) => {
      // 第一列
      if ([0, 5, 6].includes(columnIndex) && this.rows.length) {
        const _row = this.rows[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    }

    const materialData = [
      {
        prop: 'tableForm',
        itemType: 'table-form',
        dataSource: materialDatasource,
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        className: 'noBottomBorder',
        spanMethod: spanMethod,
        // border: false,
        size: 'mini',
        columns: materialColumns,
        operates: null
      }
    ]

    // 颜色数量交期
    const allColumns = {
      _code: {
        prop: 'code',
        label: '序号',
        minWidth: '50',
        formater: (scope) => {
          return this.orderDataSource[this.rowIndex - 1].seq + '-' + scope.row.seq
        }
      },
      _customerOrderCode: {
        prop: 'customerOrderCode',
        label: '客户单号',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _styleNumber: {
        prop: 'styleNumber',
        label: '款号',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _customerClothNumber: {
        prop: 'customerClothNumber',
        label: '客户布号',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _greyClothCode: {
        prop: 'greyClothCode',
        label: '色布/印花布编码',
        labelClassName: 'greylableStyle',
        className: 'nogreyLableStyle',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _customerColor: {
        prop: 'customerColor',
        label: '客户颜色',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _customerColorEn: {
        prop: 'customerColorEn',
        label: '客户颜色(英文)',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _stripeSpacing: {
        prop: 'stripeSpacing',
        label: '条纹间距',
        minWidth: '120',
        showOverflowTooltip: true,
        components: {
          preview
        },
        componentsOptions: {
          propName: 'stripeSpacing'
        },
        formater: (scope) => {
          let stripeSpacing = ''
          const arr = []
          scope.row.stripeSpacing && scope.row.stripeSpacing.length && scope.row.stripeSpacing.forEach(item => {
            arr.push(item.colorName + item.height + 'cm')
          })
          stripeSpacing = arr.join(',')
          return stripeSpacing || ''
        },
        style: {
          color: 'rgb(24, 144, 255)',
          cursor: 'pointer'
        }
      },
      _fabricColorNo: {
        prop: 'fabricColorNo',
        label: '智布色号',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _fabricFlowerNo: {
        prop: 'fabricFlowerNo',
        label: '智布花号',
        minWidth: '120',
        components: {
          picPreview
        },
        showOverflowTooltip: true,
        style: {
          color: 'rgb(24, 144, 255)',
          cursor: 'pointer'
        }
      },
      _shearingRequirements: {
        prop: 'shearingRequirements',
        label: '剪板要求',
        minWidth: '160px',
        components: {
          shearingShow
        },
        componentsOptions: {
          type: 'shearingRequirements'
        },
        formater: (scope) => {
          let shearingRequirements = ''
          const arr = []
          scope.row.shearingRequirements && scope.row.shearingRequirements.length && scope.row.shearingRequirements.forEach(item => {
            arr.push(item.type.label + ':' + item.quantity + item.unit.label)
            // arr.push(item.quantity + item.unit.label)
          })
          shearingRequirements = arr.join(',')
          return shearingRequirements
        }
      },
      _priceTax: {
        prop: 'priceTax',
        label: '单价(含税)',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          // if (scope.row.quantityDelivery && scope.row.quantityDelivery.length) {
          return this.encryptedFieldFormater(scope.row.priceTax)
          // }
        }
      },
      _price: {
        prop: 'price',
        label: '单价(不含税)',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          // if (scope.row.quantityDelivery && scope.row.quantityDelivery.length) {
          return this.encryptedFieldFormater(scope.row.price)
          // }
        }
      },
      _seq: {
        prop: 'seq',
        label: '子序号',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div>'
          if (scope.row.quantityDelivery && scope.row.quantityDelivery.length) {
            scope.row.quantityDelivery.forEach(v => {
              html += `<p>${v.seq}</p>`
            })
            html += '</div>'
          }
          return html
        }
      },
      _quantity: {
        prop: 'quantity',
        label: '数量',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div>'
          if (scope.row.quantityDelivery && scope.row.quantityDelivery.length) {
            scope.row.quantityDelivery.forEach(v => {
              html += `<p>${v.quantity}</p>`
            })
            html += '</div>'
          }
          return html
        }
      },
      _auxiliaryQuantity: {
        prop: 'auxiliaryQuantity',
        label: '辅助数量',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div>'
          if (scope.row.quantityDelivery && scope.row.quantityDelivery.length) {
            scope.row.quantityDelivery.forEach(v => {
              let tempField = ''
              if ((v.auxiliaryQuantity + '').indexOf('***') !== -1) {
                tempField = v.auxiliaryQuantity
              } else {
                tempField = v.auxiliaryQuantity ? this.$utils.priceFormat(this.$utils.getFloat(v.auxiliaryQuantity, 2)) : ''
              }
              html += `<p>${tempField}</p>`
            })
            html += '</div>'
          }
          return html
        }
      },
      _amountTax: {
        prop: 'amountTax',
        label: '金额(含税)',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div>'
          if (scope.row.quantityDelivery && scope.row.quantityDelivery.length) {
            scope.row.quantityDelivery.forEach(v => {
              html += `<p>${this.encryptedFieldFormater(v.amountTax)}</p>`
            })
            html += '</div>'
          }
          return html
        }
      },
      _amount: {
        prop: 'amount',
        label: '金额(不含税)',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div>'
          if (scope.row.quantityDelivery && scope.row.quantityDelivery.length) {
            scope.row.quantityDelivery.forEach(v => {
              html += `<p>${this.encryptedFieldFormater(v.amount)}</p>`
            })
            html += '</div>'
          }
          return html
        }
      },
      _delivery: {
        prop: 'delivery',
        label: '交期',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div>'
          if (scope.row.quantityDelivery && scope.row.quantityDelivery.length) {
            scope.row.quantityDelivery.forEach(v => {
              html += `<p>${this.$filters.parseTime(v.delivery + '', '{y}-{m}-{d}')}</p>`
            })
            html += '</div>'
          }
          return html
        }
      },
      _theDelivery: {
        prop: 'delivery',
        label: '理论交期',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div>'
          if (scope.row.quantityDelivery && scope.row.quantityDelivery.length) {
            scope.row.quantityDelivery.forEach(v => {
              html += `<p>${this.$filters.parseTime(v.delivery + '', '{y}-{m}-{d}')}</p>`
            })
            html += '</div>'
          }
          return html
        }
      },
      _productionStatus: {
        prop: 'productionStatus',
        label: '生产状态',
        showOverflowTooltip: true,
        formater: scope => {
          return '未安排'
        }
      }
    }
    const allOperatesData = [
      {
        label: '编辑',
        isShow: true,
        handle: scope => {
          this.allPopHandle('编辑颜色&数量&交期')
          this.editAll = scope.row
          this.maxRow = this.scope
          this.editAll.index = scope.$index
          // if (scope.row.colorInfoId) {
          //   this.colorInfoTemp.forEach((item, index) => {
          //     if (parseInt(scope.row.colorInfoId) === parseInt(item.colorInfoId)) {
          //       this.editAll = { ...item, index: index }
          //     }
          //   })
          // } else if (scope.row.dataTim) {
          //   this.colorInfoTemp.forEach((item, index) => {
          //     if (scope.row.dataTim === item.dataTim) {
          //       this.editAll = { ...item, index: index }
          //     }
          //   })
          // } else {
          //   this.editAll = scope.row
          // }
          this.$set(this.allPopOptions, 'formDatas', { ...scope.row })
          // this.quantityDeliveryData = scope.row.quantityDelivery && scope.row.quantityDelivery.length ? JSON.parse(JSON.stringify(scope.row.quantityDelivery)) : []
          this.quantityDeliveryData = this.editAll.quantityDelivery && this.editAll.quantityDelivery.length ? JSON.parse(JSON.stringify(this.editAll.quantityDelivery)) : []
          this.shearingRequirementsData = scope.row.shearingRequirements && scope.row.shearingRequirements.length ? JSON.parse(JSON.stringify(scope.row.shearingRequirements)) : []
          this.stripeSpacingData = scope.row.stripeSpacing && scope.row.stripeSpacing.length ? JSON.parse(JSON.stringify(scope.row.stripeSpacing)) : []
          this.$set(this.allContent._shearingRequirementsTableForm, 'dataSource', this.shearingRequirementsData)
          this.$set(this.allContent._stripeSpacingTableForm, 'dataSource', this.stripeSpacingData)
          this.$set(this.allContent._quantityDeliveryTableForm, 'dataSource', this.quantityDeliveryData)

          this.$set(this.allContent._range, 'dataSource', scope.row.range && scope.row.range.value ? [scope.row.range] : '')
          // 字段加密内容
          this.encryptFn(this.allContent, this.orderData['_rule'], 'edit')
        }
      },
      {
        label: '删除',
        isShow: true,
        style: { 'color': '#FE4949' },
        handle: scope => {
          this.$confirm('确认删除该条颜色&数量&交期数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            cancelButtonClass: 'btn-cancel'
          }).then(() => {
            this.colorInfoTemp.splice(scope.$index, 1)
            this.colorInfo.splice(scope.$index, 1)
            let totalQuantity = 0
            let totalAmount = 0
            this.colorInfo.forEach((item, index) => {
              if (this.status !== '2') {
                item.seq = index + 1
                item.code = index + 1
              }
              item.quantityDelivery && item.quantityDelivery.length && item.quantityDelivery.forEach(items => {
                totalQuantity += items.auxiliaryQuantity
                totalAmount += items.amountTax
              })
              this.totalQuantity = this.$utils.getFloat(totalQuantity, 2)
              this.totalAmount = this.$utils.getFloat(totalAmount, 2)
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      }
    ]
    const allOperates = {
      label: '操作',
      width: '120',
      fixed: 'right',
      dataSource: allOperatesData
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getListData({ pageSize: this.pagination.pageSize || 20, page: val })
      },
      sizeChange: val => {
        this.getListData({ page: this.pagination.page || 1, pageSize: val })
      }
    }

    // 参板信息弹框内容
    const versionContent = {
      _greyClothCode: {
        prop: 'greyClothCode',
        itemType: 'input',
        label: '色布/印花布编码',
        placeholder: '点击选择色布/印花布编码',
        // rules: [commonBlurReg],
        rules: [{ required: true, message: '色布/印花布编码不能为空', trigger: 'change' }],
        // valueType: 'object',
        readonly: true,
        focus: (params) => {
          this.clothTitle = '选择色布/印花布编码'
          this.clothSearch = {
            _fabrication: {
              prop: 'fabrication',
              itemType: 'select',
              itemStyle: { width: '25%' },
              label: '布类',
              // valueType: 'object',
              clearable: true,
              filterable: true,
              className: 'commonRemoteSearch',
              placeholder: '输入文字模糊查询',
              visibleChange: (value, val) => {
                if (value) {
                  this.getClothSelect()
                }
              },
              dataSource: []
            },
            _ingredients: {
              prop: 'ingredients',
              itemType: 'select',
              itemStyle: { width: '25%' },
              label: '成份',
              valueType: 'object',
              clearable: true,
              filterable: true,
              className: 'commonRemoteSearch',
              placeholder: '输入文字模糊查询',
              visibleChange: (value, val) => {
                if (value) {
                  this.getCompositionSelect()
                }
              },
              dataSource: []
            },
            _yarnCountFineness: {
              prop: 'yarnCountFineness',
              itemType: 'select',
              valueType: 'object',
              itemStyle: { width: '25%' },
              label: '纱支/细度',
              clearable: true,
              filterable: true,
              className: 'commonRemoteSearch',
              placeholder: '输入文字模糊查询',
              visibleChange: (value, val) => {
                if (value) {
                  this.getYarnSelect('combine')
                }
              },
              dataSource: []
            },
            _yarnSilkType: {
              prop: 'yarnSilkType',
              itemType: 'select',
              itemStyle: { width: '25%' },
              label: '纱类/丝类',
              valueType: 'object',
              clearable: true,
              filterable: true,
              className: 'commonRemoteSearch',
              placeholder: '输入文字模糊查询',
              visibleChange: (value, val) => {
                if (value) {
                  this.getYarnTypeSelect('combine')
                }
              },
              dataSource: []
            },
            _fabricWidth: {
              prop: 'fabricWidth',
              itemType: 'input',
              itemStyle: { width: '25%' },
              clearable: true,
              label: '成品幅宽'
            },
            _fabricWeight: {
              prop: 'fabricWeight',
              itemType: 'input',
              itemStyle: { width: '25%' },
              clearable: true,
              label: '成品克重'
            },
            _dyeTech: {
              prop: 'dyeTech',
              itemType: 'select',
              itemStyle: { width: '25%' },
              style: { 'width': '82%' },
              clearable: true,
              label: '染整工艺',
              valueType: 'object',
              // disabled: true,
              title: true,
              components: { techRquire },
              componentsOptions: {
                checkValList: [],
                ok: (checkValList) => {
                  this.$set(this.clothSearch._dyeTech.componentsOptions, 'checkValList', checkValList)
                  this.clothformDatas = { dyeTech: checkValList }
                }
              }
            },
            _printTechId: {
              prop: 'printTech',
              itemType: 'select',
              itemStyle: { width: '25%' },
              label: '印花工艺',
              valueType: 'object',
              clearable: true,
              filterable: true,
              multiple: true,
              className: 'commonRemoteSearch',
              placeholder: '输入文字模糊查询',
              visibleChange: (value, val) => {
                if (value) {
                  this.getPrintCraftSelect('TechId')
                }
              },
              dataSource: []
            },
            _customerColorName: {
              prop: 'customerColorName',
              itemType: 'input',
              itemStyle: { width: '25%' },
              clearable: true,
              label: '客户颜色'
            },
            _operate: {
              itemType: 'operate',
              submitHandle: params => {
                if (!params.ingredients) {
                  params.ingredients = null
                }
                if (!params.yarnCountFineness) {
                  params.yarnCountFineness = null
                }
                if (!params.yarnSilkType) {
                  params.yarnSilkType = null
                }
                // if (params.printTech && params.printTech.value) {
                //   params.printTechId = params.printTech.value || ''
                // }
                params.printTechId = []
                params.printTech && params.printTech.forEach(Pitem => {
                  if (Pitem && Pitem.value) {
                    params.printTechId.push(Pitem.value)
                  }
                })
                const newParams = params
                newParams.dyeTech && newParams.dyeTech.forEach((item, index) => {
                  item.value = item.uuid
                  item.label = item.type
                })
                this.clothParams = params
                this.getcolorFabric(params)
              },
              submitText: '查询',
              resetHandle: () => {}
            }
          }
          this.clothColumns = {
            _colorFabricCode: {
              prop: 'colorFabricCode',
              label: '色布/印花布编码',
              minWidth: '180'
            },
            _fabrication: {
              prop: 'fabrication',
              label: '布类',
              width: '180',
              showOverflowTooltip: true
            },
            _ingredients: {
              prop: 'ingredients',
              label: '成份',
              width: '180',
              showOverflowTooltip: true
            },
            _yarnFineness: {
              prop: 'yarnFineness',
              label: '纱支/细度',
              width: '180',
              showOverflowTooltip: true
            },
            _yarnWireCategory: {
              prop: 'yarnWireCategory',
              label: '纱类/丝类',
              width: '180',
              showOverflowTooltip: true
            },
            _fabricWidth: {
              prop: 'fabricWidth',
              label: '成品幅宽',
              width: '180',
              showOverflowTooltip: true
            },
            _fabricWeight: {
              prop: 'fabricWeight',
              label: '成品克重（g/m²）',
              width: '180',
              showOverflowTooltip: true
            },
            _dyeTech: {
              prop: 'dyeTech',
              label: '染整工艺',
              width: '180',
              showOverflowTooltip: true,
              formater: (scope) => {
                if (scope.row.dyeTech) {
                  const dataList = JSON.parse(scope.row.dyeTech)
                  let dyeTech = ''
                  const arr = []
                  dataList && dataList.length && dataList.forEach(item => {
                    arr.push(item.name)
                  })
                  dyeTech = arr.join(',')
                  return dyeTech || ''
                }
              }
            },
            _printTech: {
              prop: 'printTech',
              label: '印花工艺',
              width: '180',
              showOverflowTooltip: true,
              formater: (scope) => {
                if (scope.row.printTech) {
                  const dataList = JSON.parse(scope.row.printTech)
                  let printTech = ''
                  const arr = []
                  dataList && dataList.length && dataList.forEach(item => {
                    arr.push(item.label)
                  })
                  printTech = arr.join(',')
                  return printTech || ''
                }
              }
            },
            _colorPreview: {
              prop: 'colorPreview',
              label: '颜色预览',
              width: '180',
              showOverflowTooltip: true,
              formater: (scope) => {
                if (scope.row.colorPreview) {
                  return `<div style="width: 100px; height: 30px;background-color: rgb(${scope.row.colorPreview})"></div>`
                } else {
                  return ''
                }
              }
            },
            _spacing: {
              prop: 'spacing',
              label: '条纹间距',
              width: '180',
              showOverflowTooltip: true,
              components: {
                preview
              },
              componentsOptions: {
                propName: 'spacing'
              },
              formater: (scope) => {
                let spacing = ''
                const arr = []
                scope.row.spacing && scope.row.spacing.length && scope.row.spacing.forEach(item => {
                  arr.push(item.colorName + item.height + 'cm')
                })
                spacing = arr.join(',')
                return spacing || ''
              },
              style: {
                color: 'rgb(24, 144, 255)',
                cursor: 'pointer'
              }
            },
            _printPic: {
              prop: 'printPic',
              label: '印花图案',
              width: '180',
              showOverflowTooltip: true,
              formater: (scope) => {
                return scope.row.printPic ? `<img class="printPic" src='${scope.row.printPic}' />` : ''
              }
            }
          }
          this.isshowCloth = true
          this.choosePagination = {
            currentChange: val => {
              this.getcolorFabric({ ...this.clothParams, pageSize: this.choosePagination.pageSize || 10, pageNum: val, pageSizes: [10, 20, 30, 40, 50, 100] })
            },
            sizeChange: val => {
              this.$set(this.choosePagination, 'currentPage', 1)
              this.getcolorFabric({ ...this.clothParams, pageNum: this.choosePagination.pageNum, pageSize: val, pageSizes: [10, 20, 30, 40, 50, 100] })
            }
          }
          this.getcolorFabric()
        }
      },
      _referenceOrder: {
        prop: 'referenceOrder',
        itemType: 'select',
        label: '订单号',
        className: 'commonRemoteSearch',
        placeholder: '输入文字模糊查询',
        clearable: true,
        filterable: true,
        valueType: 'object',
        rules: [commonChangeReg],
        visibleChange: (value, scope, form, formDatas, setFormDatas) => {
          if (value && formDatas.greyClothCode) {
            this.getOrderNoSelect()
          }
        },
        focus: (e, scope, form, formDatas, setFormDatas) => {
          if (!formDatas.greyClothCode) {
            this.$message({ type: 'warning', message: '请先选择色布/印花布编码' })
            return
          }
        },
        dataSource: []
      },
      _referenceContent: {
        prop: 'referenceContent',
        itemType: 'select',
        label: '参考内容',
        clearable: true,
        valueType: 'object',
        rules: [commonBlurReg],
        visibleChange: value => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '大货订单', fieldName: '参考内容' }, 'referenceContent')
          }
        },
        dataSource: [
          // {
          //   value: '参考内容',
          //   label: '1'
          // }
        ]
      },
      _remark: {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        label: '备注',
        clearable: true,
        maxlength: 50,
        trim: (value) => {
          return value
        }
      }
    }
    // 参板信息弹框配置
    const versionPopOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增参板信息',
      okText: '保存',
      ok: params => {
        if (this.versionPopOptions.title === '新增参板信息') {
          if (this.clothCodeData.colorFabricCode && this.clothCodeData) {
            const orderLeft = this.$refs.dataSourceMix.dynamicValidateFormRuleForm.tableForm
            // 订单信息布类
            this.$set(this.dataSource[0].dataSource[this.rowIndex - 1], 'cloth', this.clothCodeData.cloth || {})
            orderLeft[this.rowIndex - 1].cloth = this.clothCodeData.cloth || {}
            this.$set(this.dataSource[0].dataSource[this.rowIndex - 1], 'garmentPart', orderLeft && orderLeft[this.rowIndex - 1].garmentPart || {})
            // 产品信息
            this.$set(this.$refs.productData.formDatas, 'newingredient', this.clothCodeData.ingreradio)
            this.$set(this.$refs.productData.formDatas, 'ingredient', this.clothCodeData.ingredient)
            this.$set(this.$refs.productData.formDatas, 'ratio', this.clothCodeData.radio)
            this.$set(this.$refs.productData.formDatas, 'printCraft', this.clothCodeData.printTech)
            this.$set(this.$refs.productData.formDatas, 'dyeCraft', this.clothCodeData.dyeTech)
            if (this.clothCodeData.fabricWidth) {
              this.$set(this.$refs.productData.formDatas, 'suggestWidth', this.clothCodeData.fabricWidth)
            }
            if (this.clothCodeData.fabricWeight) {
              this.$set(this.$refs.productData.formDatas, 'weightBefore', this.clothCodeData.fabricWeight)
            }
            this.$set(this.$refs.productData.formDatas, 'suggestWidthUnit', this.clothCodeData.suggestWidthUnit || 'cm')
            this.$set(this.$refs.productData.formDatas, 'weightBeforeUnit', this.clothCodeData.weightBeforeUnit || 'g/m²')
            // 原料信息
            this.materialCopy = this.clothCodeData ? this.clothCodeData.materialInfo : []
            const materialArry = []
            this.clothCodeData.materialInfo && this.clothCodeData.materialInfo.forEach((mitem, mindex) => {
              if (mitem.naturalFiber && mitem.naturalFiber.length) {
                mitem.naturalFiber.forEach((nitem, nindex) => {
                  materialArry.push({

                    code: mitem.yarnCode,
                    yarn: nitem.yarn,
                    element: nitem.element,
                    elementRatio: nitem.elementRatio,
                    yarnCategory: nitem.yarnCategory,
                    edit: true
                  })
                })
              }
              if (mitem.chemicalFiber && mitem.chemicalFiber.length) {
                mitem.chemicalFiber.forEach((citem, cindex) => {
                  materialArry.push({

                    code: mitem.yarnCode,
                    yarn: citem.fineness,
                    element: citem.element,
                    yarnCategory: citem.wireCategory,
                    edit: true
                  })
                })
              }
            })
            this.clothCodeData.materialArry = materialArry
            this.materialDatasource = this.clothCodeData.materialArry
            this.dataPretreatment(this.materialDatasource, 'code', 'material')
            this.$set(this.materialData[0], 'dataSource', this.materialDatasource)
            if (this.isFirstSelect) {
              const obj = {}
              obj.greyClothCode = this.clothCodeData.colorFabricCode
              obj.stripeSpacing = this.clothCodeData.spacing
              obj.fabricColorNo = this.clothCodeData.colorCode
              obj.fabricFlowerNo = this.clothCodeData.flowerCode
              obj.seq = 1
              this.colorInfoTemp.push(obj)
            } else if (!this.isFirstSelect && this.greyClothCode !== params.greyClothCode) {
              this.colorInfoTemp && this.colorInfoTemp.forEach((colorItem) => {
                colorItem.greyClothCode = ''
                colorItem.stripeSpacing = []
                colorItem.fabricColorNo = ''
                colorItem.fabricFlowerNo = ''
                colorItem.seq = 1
              })
            }
            this.$set(this.$refs.allColumnslData, 'dataSource', this.colorInfoTemp)
            this.colorInfo = this.colorInfoTemp
          }
        } else {
          if (this.clothCodeData.colorFabricCode && this.clothCodeData && params.greyClothCode === this.clothCodeData.colorFabricCode) {
            const orderLeft = this.$refs.dataSourceMix.dynamicValidateFormRuleForm.tableForm
            // 订单信息布类
            this.$set(this.dataSource[0].dataSource[this.rowIndex - 1], 'cloth', this.clothCodeData.cloth || {})
            orderLeft[this.rowIndex - 1].cloth = this.clothCodeData.cloth || {}
            this.$set(this.dataSource[0].dataSource[this.rowIndex - 1], 'garmentPart', orderLeft && orderLeft[this.rowIndex - 1].garmentPart || {})
            this.$set(this.$refs.productData.formDatas, 'newingredient', this.clothCodeData.ingreradio)
            this.$set(this.$refs.productData.formDatas, 'ingredient', this.clothCodeData.ingredient)
            this.$set(this.$refs.productData.formDatas, 'ratio', this.clothCodeData.radio)
            this.$set(this.$refs.productData.formDatas, 'printCraft', this.clothCodeData.printTech)
            this.$set(this.$refs.productData.formDatas, 'dyeCraft', this.clothCodeData.dyeTech)
            if (this.clothCodeData.fabricWidth) {
              this.$set(this.$refs.productData.formDatas, 'suggestWidth', this.clothCodeData.fabricWidth)
            }
            if (this.clothCodeData.fabricWeight) {
              this.$set(this.$refs.productData.formDatas, 'weightBefore', this.clothCodeData.fabricWeight)
            }
            this.$set(this.$refs.productData.formDatas, 'suggestWidthUnit', this.clothCodeData.suggestWidthUnit || 'cm')
            this.$set(this.$refs.productData.formDatas, 'weightBeforeUnit', this.clothCodeData.weightBeforeUnit || 'g/m²')
            // 原料信息
            this.materialCopy = this.clothCodeData ? this.clothCodeData.materialInfo : []
            const materialArry = []
            this.clothCodeData.materialInfo && this.clothCodeData.materialInfo.forEach((mitem, mindex) => {
              if (mitem.naturalFiber && mitem.naturalFiber.length) {
                mitem.naturalFiber.forEach((nitem, nindex) => {
                  materialArry.push({

                    code: mitem.yarnCode,
                    yarn: nitem.yarn,
                    element: nitem.element,
                    elementRatio: nitem.elementRatio,
                    yarnCategory: nitem.yarnCategory,
                    edit: true
                  })
                })
              }
              if (mitem.chemicalFiber && mitem.chemicalFiber.length) {
                mitem.chemicalFiber.forEach((citem, cindex) => {
                  materialArry.push({

                    code: mitem.yarnCode,
                    yarn: citem.fineness,
                    element: citem.element,
                    yarnCategory: citem.wireCategory,
                    edit: true
                  })
                })
              }
            })
            this.clothCodeData.materialArry = materialArry
            this.materialDatasource = this.clothCodeData.materialArry
            this.dataPretreatment(this.materialDatasource, 'code', 'material')
            this.$set(this.materialData[0], 'dataSource', this.materialDatasource)
            if (this.isFirstSelect) {
              const obj = {}
              obj.greyClothCode = this.clothCodeData.colorFabricCode
              obj.stripeSpacing = this.clothCodeData.spacing
              obj.fabricColorNo = this.clothCodeData.colorCode
              obj.fabricFlowerNo = this.clothCodeData.flowerCode
              obj.seq = 1
              this.colorInfoTemp.push(obj)
            } else if (!this.isFirstSelect && this.greyClothCode !== params.greyClothCode) {
              this.colorInfoTemp && this.colorInfoTemp.forEach((colorItem) => {
                colorItem.greyClothCode = ''
                colorItem.stripeSpacing = []
                colorItem.fabricColorNo = ''
                colorItem.fabricFlowerNo = ''
                colorItem.seq = 1
              })
            }
            this.$set(this.$refs.allColumnslData, 'dataSource', this.colorInfoTemp)
            this.colorInfo = this.colorInfoTemp
          }
        }
        const data = {
          referenceOrder: params.referenceOrder || '',
          greyClothCode: params.greyClothCode || '',
          referenceContent: params.referenceContent || {},
          remark: params.remark || ''
        }
        if (this.versionPopOptions.title === '新增参板信息') {
          this.versionData = []
          this.versionData.push({ ...data, code: this.versionData.length + 1 })
        } else {
          this.versionData.splice(data.code - 1, 1, data)
        }
        this.calculateAuxiliaryQuantity()
        this.versionPopHandle()
      },
      cancel: params => {
        this.versionPopHandle()
      },
      formDatas: {},
      formOptions: {},
      content: versionContent
    }
    // 交期数量弹窗内容
    const quantityDeliveryContent = {
      _seq: {
        prop: 'seq',
        label: '序号',
        itemType: 'input',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        disabled: true,
        clearable: true
      },
      _quantity: {
        prop: 'quantity',
        label: '数量',
        itemType: 'input',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        rules: [commonChangeReg, ismax999Reg],
        clearable: true,
        blur: (scope) => {
          this.quantityDeliveryBlur(scope.target.value)
        },
        formater: (scope) => {
          return this.$utils.priceFormat(scope.row.quantity)
        }
      },
      _auxiliaryQuantity: {
        prop: 'auxiliaryQuantity',
        label: '辅助数量',
        itemType: 'input',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        clearable: true,
        disabled: true
      },
      _amountTax: {
        prop: 'amountTax',
        label: '金额(含税)',
        itemType: 'input',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        clearable: true,
        disabled: true
      },
      _amount: {
        prop: 'amount',
        label: '金额(不含税)',
        itemType: 'input',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        clearable: true,
        disabled: true
      },
      _delivery: {
        prop: 'delivery',
        label: '交期',
        itemType: 'date',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        clearable: true,
        pickerOptions: pickerOptionsBefore,
        rules: [{ required: true, message: '日期不能为空', trigger: ['change'] }]
      }
    }
    const quantityAdd = (params, form) => {
      if (!params.quantity) {
        // this.$message({
        //   message: '数量必填！',
        //   type: 'warning'
        // })
        return false
      } else if (!params.delivery) {
        // this.$message({
        //   message: '交期必填！',
        //   type: 'warning'
        // })
        return false
      } else {
        if (!this.quantityDeliveryData) {
          this.quantityDeliveryData = []
        }
        this.$set(this.quantityDeliveryPopOptions, 'formDatas', {})
        this.quantityDeliveryData.push({ ...params, seq: this.quantityDeliveryData.length + 1 })
        this.$set(this.allContent._quantityDeliveryTableForm, 'dataSource', this.quantityDeliveryData)
      }
    }
    // 交期数量弹窗配置
    const quantityDeliveryPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '新增交期数量',
      okText: '保存',
      className: 'quantity-delivery',
      ok: params => {
        if (!this.editAll.maxQuantitySeq) {
          this.editAll.maxQuantitySeq = 0
        }
        if (!this.quantityDeliveryData) {
          this.quantityDeliveryData = []
        }
        if (this.quantityDeliveryPopOptions.title === '新增交期数量') {
          // this.quantityDeliveryData.push({ ...params, seq: this.quantityDeliveryData.length + 1 })
          // this.$set(this.allContent._quantityDeliveryTableForm, 'dataSource', this.quantityDeliveryData)
          this.quantityDeliveryData.push({ ...params, code: this.quantityDeliveryData.length + 1, seq: this.status === '2' && this.editAll.orderId ? ++(this.editAll.maxQuantitySeq) * 1 : this.quantityDeliveryData.length + 1 })
          this.$set(this.allContent._quantityDeliveryTableForm, 'dataSource', this.quantityDeliveryData)
        } else {
          // this.quantityDeliveryData.splice(params.seq - 1, 1, params)
          this.quantityDeliveryData.splice(params.code - 1, 1, params)
          this.$set(this.allContent._quantityDeliveryTableForm, 'dataSource', this.quantityDeliveryData)
        }
        this.popHandle('', 'quantityDelivery')
      },
      saveAndaddText: '确定，继续添加',
      saveAndadd: quantityAdd,
      cancel: params => {
        this.popHandle('', 'quantityDelivery')
      },
      formDatas: {},
      formOptions: {},
      content: quantityDeliveryContent
    }
    // 交期数量data
    const quantityDeliveryData = []
    // 交期数量table操作
    const quantityDeliveryOperates = {
      label: '操作',
      width: '100',
      // fixed: 'right',
      dataSource: [
        {
          label: '编辑',
          isShow: true,
          handle: scope => {
            this.popHandle('编辑交期数量', 'quantityDelivery')
            this.encryptFn(this.quantityDeliveryContent, this.orderData['_rule'], 'edit')
            this.$set(this.quantityDeliveryPopOptions, 'saveAndadd', null)
            scope.row.amount = this.$utils.getFloat(scope.row.amount, 2) || ''
            scope.row.amountTax = this.$utils.getFloat(scope.row.amountTax, 2) || ''
            this.setFormDatas({ ...scope.row, seq: scope.$index + 1 }, 'quantityDelivery')
          }
        },
        {
          label: '删除',
          isShow: true,
          style: { 'color': '#FE4949' },
          handle: (scope) => {
            this.$confirm('确认删除该条交期数量数据？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              cancelButtonClass: 'btn-cancel'
            }).then(() => {
              this.quantityDeliveryData.splice(scope.$index, 1)
              this.quantityDeliveryData.forEach((item, index) => {
                item.seq = this.status === '2' && this.editAll.orderId ? item.seq : index + 1
              })
            }).catch(() => {
              this.$message({ type: 'info', message: '已取消删除' })
            })
          }
        }
      ]
    }
    // 交期数量table表头
    const quantityDeliveryColumns = {
      _seq: {
        prop: 'seq',
        width: '80',
        label: '序号'
      },
      _quantity: {
        prop: 'quantity',
        label: '数量',
        labelClassName: 'lableStyle',
        className: 'noLableStyle',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.$utils.priceFormat(scope.row.quantity)
        }
      },
      _auxiliaryQuantity: {
        prop: 'auxiliaryQuantity',
        label: '辅助数量',
        showOverflowTooltip: true,
        formater: (scope) => {
          let tempField
          if ((scope.row.auxiliaryQuantity + '').indexOf('***') !== -1) {
            tempField = scope.row.auxiliaryQuantity
          } else {
            tempField = scope.row.auxiliaryQuantity ? this.$utils.priceFormat(this.$utils.getFloat(scope.row.auxiliaryQuantity, 2)) : ''
          }
          return tempField
        }
      },
      _amountTax: {
        prop: 'amountTax',
        label: '金额(含税)',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.encryptedFieldFormater(scope.row.amountTax)
        }
      },
      _amount: {
        prop: 'amount',
        label: '金额(不含税)',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.encryptedFieldFormater(scope.row.amount)
        }
      },
      _delivery: {
        prop: 'delivery',
        label: '交期',
        labelClassName: 'lableStyle',
        className: 'noLableStyle',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.delivery ? this.$filters.parseTime(scope.row.delivery + '', '{y}-{m}-{d}') : ''
        }
      }
    }
    // 剪板要求table表头
    const shearingRequirementsColumns = {
      _code: {
        prop: 'code',
        width: '80',
        label: '序号',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _type: {
        prop: 'type',
        label: '类型',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.type.label
        }
      },
      _quantity: {
        prop: 'quantity',
        label: '数量',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.$utils.priceFormat(scope.row.quantity)
        }
      },
      _unit: {
        prop: 'unit',
        label: '单位',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.unit.label
        }
      }
    }
    // 剪版要求table数据
    const shearingRequirementsData = []
    // 剪版要求table操作
    const shearingRequirementsOperates = {
      label: '操作',
      width: '100',
      // fixed: 'right',
      dataSource: [
        {
          label: '编辑',
          isShow: true,
          handle: scope => {
            this.popHandle('编辑剪版要求', 'shearingRequirements')
            this.encryptFn(this.shearingRequirementsContent, this.orderData['_rule'], 'edit')
            this.$set(this.shearingRequirementsContent._type, 'dataSource', scope.row.type && scope.row.type.value ? [scope.row.type] : '')
            this.$set(this.shearingRequirementsContent._unit, 'dataSource', scope.row.unit && scope.row.unit.value ? [scope.row.unit] : '')
            this.$set(this.shearingRequirementsPopOptions, 'saveAndadd', null)
            this.setFormDatas({ ...scope.row, code: scope.$index + 1 }, 'shearingRequirements')
          }
        },
        {
          label: '删除',
          isShow: true,
          style: { 'color': '#FE4949' },
          handle: (scope) => {
            this.$confirm('确认删除当前数据吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              cancelButtonClass: 'btn-cancel'
            })
              .then(() => {
                this.shearingRequirementsData.splice(scope.$index, 1)
                this.shearingRequirementsData.forEach((item, index) => {
                  item.code = index + 1
                })
              })
              .catch(() => {
                this.$message({ type: 'info', message: '已取消删除' })
              })
          }
        }
      ]
    }
    // 剪版要求弹窗内容
    const shearingRequirementsContent = {
      _code: {
        prop: 'code',
        itemType: 'input',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        label: '序号',
        disabled: true,
        clearable: true
      },
      _type: {
        prop: 'type',
        itemType: 'select',
        itemStyle: { width: '48%', display: 'inline-block', 'font-size': '16px', 'margin-left': '2%' },
        label: '类型',
        clearable: true,
        valueType: 'object',
        rules: [commonChangeReg],
        visibleChange: value => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '大货订单', fieldName: '剪板要求类型' }, 'type')
          }
        },
        dataSource: []
      },
      _quantity: {
        prop: 'quantity',
        itemType: 'input',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        label: '数量',
        rules: [commonChangeReg, max999Reg],
        clearable: true
      },
      _unit: {
        prop: 'unit',
        itemType: 'select',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-left': '2%' },
        label: '单位',
        clearable: true,
        valueType: 'object',
        rules: [commonChangeReg],
        visibleChange: value => {
          if (value) {
            this.setUnitsSelect()
          }
        },
        dataSource: []
      }
    }
    const saveAndadd = (params, form) => {
      if (!params.type) {
        // this.$message({
        //   message: '类型必填！',
        //   type: 'warning'
        // })
        return false
      } else if (!params.quantity) {
        // this.$message({
        //   message: '数量必填！',
        //   type: 'warning'
        // })
        return false
      } else if (!params.unit) {
        // this.$message({
        //   message: '单位必填！',
        //   type: 'warning'
        // })
        return false
      } else {
        if (!this.shearingRequirementsData) {
          this.shearingRequirementsData = []
        }
        this.shearingRequirementsData.push({ ...params, code: this.shearingRequirementsData.length + 1 })
        this.$set(this.allContent._shearingRequirementsTableForm, 'dataSource', this.shearingRequirementsData)
        this.$set(this.shearingRequirementsPopOptions, 'formDatas', {})
      }
    }
    // 剪版要求弹窗配置
    const shearingRequirementsPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '新增剪板要求',
      okText: '确定',
      ok: params => {
        if (!this.shearingRequirementsData) {
          this.shearingRequirementsData = []
        }
        if (this.shearingRequirementsPopOptions.title === '新增剪板要求') {
          this.shearingRequirementsData.push({ ...params, code: this.shearingRequirementsData.length + 1 })
          this.$set(this.allContent._shearingRequirementsTableForm, 'dataSource', this.shearingRequirementsData)
        } else {
          this.shearingRequirementsData.splice(params.code - 1, 1, params)
          this.$set(this.allContent._shearingRequirementsTableForm, 'dataSource', this.shearingRequirementsData)
        }
        this.popHandle('', 'shearingRequirements')
      },
      saveAndaddText: '确定，继续添加',
      saveAndadd,
      cancel: params => {
        this.popHandle('', 'shearingRequirements')
      },
      formDatas: {},
      formOptions: {},
      content: shearingRequirementsContent
    }
    // 条纹间距table表头
    const stripeSpacingColumns = {
      _seq: {
        prop: 'seq',
        width: '120',
        label: '序号',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _height: {
        prop: 'height',
        label: '高度(cm)',
        width: '200'
      },
      _fabricColorNo: {
        prop: 'fabricColorNo',
        label: '智布色号',
        width: '200'
      },
      _colorValue: {
        prop: 'colorValue',
        label: '颜色预览',
        formater: (scope) => {
          if (scope.row.colorValue) {
            return `<div style="width: 100px; height: 30px;background-color: ${scope.row.colorValue}"></div>`
          } else {
            return ''
          }
        }
      }
    }
    // 条纹间距table数据
    const stripeSpacingData = []

    const lineStyle = {
      'width': '100%',
      'height': '1px',
      'color': '#ccc',
      'border-bottom': '1px #E9EFF2 solid',
      'margin-bottom': '20px'
    }
    // 颜色&数量&交期弹窗内容
    const allContent = {
      _greyClothCode: {
        prop: 'greyClothCode',
        itemType: 'input',
        itemStyle: { width: '32%', display: 'inline-block', 'margin-right': '68%', 'margin-bottom': '14px' },
        label: '色布/印花布编码',
        // rules: [commonBlurReg],
        rules: [{ required: true, message: '此项不能为空', trigger: 'change' }],
        placeholder: '点击选择色布/印花布编码',
        clearable: true,
        focus: (params) => {
          // debugger
          this.chooseTitle = '选择色布/印花布编码'
          this.chooseSearch = {
            _customerColorName: {
              prop: 'customerColorName',
              itemType: 'input',
              clearable: true,
              label: '客户颜色'
            },
            _operate: {
              itemType: 'operate',
              submitHandle: params => {
                this.chooseParams = params
                this.getcolorFabric(params)
              },
              submitText: '查询',
              resetHandle: () => {}
            }
          }
          this.chooseColumns = {
            _colorFabricCode: {
              prop: 'colorFabricCode',
              label: '色布/印花布编码',
              minWidth: '90'
            },
            _customerColorName: {
              prop: 'customerColorName',
              label: '客户颜色',
              width: '180',
              showOverflowTooltip: true
            },
            _colorPreview: {
              prop: 'colorPreview',
              label: '颜色预览',
              width: '180',
              showOverflowTooltip: true,
              formater: (scope) => {
                if (scope.row.colorPreview) {
                  return `<div style="width: 100px; height: 30px;background-color: rgb(${scope.row.colorPreview})"></div>`
                } else {
                  return ''
                }
              }
            },
            _space: {
              prop: 'space',
              label: '条纹间距',
              width: '180',
              showOverflowTooltip: true,
              components: {
                preview
              },
              componentsOptions: {
                propName: 'spacing'
              },
              formater: (scope) => {
                let spacing = ''
                const arr = []
                scope.row.spacing && scope.row.spacing.length && scope.row.spacing.forEach(item => {
                  arr.push(item.colorName + item.height + 'cm')
                })
                spacing = arr.join(',')
                return spacing || ''
              },
              style: {
                color: 'rgb(24, 144, 255)',
                cursor: 'pointer'
              }
            },
            _printPic: {
              prop: 'printPic',
              label: '印花图案',
              width: '400',
              showOverflowTooltip: true,
              formater: (scope) => {
                return scope.row.printPic ? `<img class="printPic" src='${scope.row.printPic}' />` : ''
              }
            }
          }
          this.isShowchoose = true
          this.colorPagination = {
            currentChange: val => {
              this.getcolorFabric({ ...this.chooseParams, pageSize: this.colorPagination.pageSize || 10, pageNum: val, pageSizes: [10, 20, 30, 40, 50, 100] })
            },
            sizeChange: val => {
              this.$set(this.colorPagination, 'currentPage', 1)
              this.getcolorFabric({ ...this.chooseParams, pageNum: this.colorPagination.pageNum, pageSize: val, pageSizes: [10, 20, 30, 40, 50, 100] })
            }
          }
          this.getcolorFabric()
        }
      },
      _view: {
        itemType: 'view',
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        text: '',
        style: lineStyle
      },
      _customerOrderCode: {
        prop: 'customerOrderCode',
        itemType: 'input',
        itemStyle: { width: '32%', display: 'inline-block' },
        label: '客户单号',
        maxlength: 50,
        clearable: true
      },
      _styleNumber: {
        prop: 'styleNumber',
        itemType: 'input',
        itemStyle: { width: '32%', display: 'inline-block', 'margin': '0 2%' },
        label: '款号',
        clearable: true,
        maxlength: 50
      },
      _customerClothNumber: {
        prop: 'customerClothNumber',
        itemType: 'input',
        itemStyle: { width: '32%', display: 'inline-block' },
        label: '客户布号',
        clearable: true,
        maxlength: 50
      },
      _customerColor: {
        prop: 'customerColor',
        itemType: 'input',
        itemStyle: { width: '32%', display: 'inline-block' },
        label: '客户颜色',
        clearable: true,
        maxlength: 50,
        rules: [commonBlurReg]
        // rules: [{ required: true, message: '此项不能为空', trigger: 'change' }],
      },
      _customerColorEn: {
        prop: 'customerColorEn',
        itemType: 'input',
        itemStyle: { width: '32%', display: 'inline-block', 'margin': '0 2%' },
        label: '客户颜色(英文)',
        maxlength: 50,
        clearable: true
      },
      _fabricColorNo: {
        prop: 'fabricColorNo',
        itemType: 'input',
        itemStyle: { width: '32%', display: 'inline-block' },
        disabled: true,
        label: '智布色号'
      },
      _fabricFlowerNo: {
        prop: 'fabricFlowerNo',
        itemType: 'input',
        itemStyle: { width: '32%', display: 'inline-block' },
        disabled: true,
        label: '智布花号'
      },
      _priceTax: {
        prop: 'priceTax',
        itemType: 'input',
        itemStyle: { width: '32%', display: 'inline-block', 'margin': '0 2%' },
        label: '单价(含税)',
        clearable: true,
        rules: [commonChangeReg, max999Regtype],
        blur: (scope) => {
          this.priceTaxBlur(+scope.target.value)
          // const basicInfo = this.$refs.basicData.dynamicValidateFormRuleForm
          // const taxRate = basicInfo.taxRate // 税率
          // const dataList = this.quantityDeliveryData && JSON.parse(JSON.stringify(this.quantityDeliveryData)) || []
          // dataList.forEach(item => {
          //   item.amountTax = item.quantity * scope.target.value
          //   item.amount = item.amountTax / (1 + taxRate / 100)
          // })
          // this.$set(this.allContent._quantityDeliveryTableForm, 'dataSource', dataList)
          // this.quantityDeliveryData = dataList
          // const colorBasic = this.$refs.allPop.$refs.popComponents.formDatas
          // this.$set(this.allPopOptions, 'formDatas', colorBasic)
        }
      },
      _price: {
        prop: 'price',
        itemType: 'input',
        itemStyle: { width: '32%', display: 'inline-block' },
        label: '单价(不含税)',
        clearable: true,
        rules: [max999Regtype],
        blur: (scope) => {
          this.priceBlur(+scope.target.value)
          // const basicInfo = this.$refs.basicData.dynamicValidateFormRuleForm
          // const taxRate = basicInfo.taxRate // 税率
          // const dataList = this.quantityDeliveryData && JSON.parse(JSON.stringify(this.quantityDeliveryData)) || []
          // dataList.forEach(item => {
          //   item.amount = item.quantity * scope.target.value
          //   item.amountTax = item.amount * (1 + taxRate / 100)
          // })
          // this.$set(this.allContent._quantityDeliveryTableForm, 'dataSource', dataList)
          // this.quantityDeliveryData = dataList
        }
      },
      _shearingRequirements: {
        itemType: 'view',
        text: '剪板要求',
        style: { width: '78%', 'padding': '16px 0', display: 'inline-block' }
      },
      _shearingRequirementsAdd: {
        itemType: 'itemview',
        label: '',
        itemStyle: { display: 'inline-block', 'margin-bottom': '0', 'margin-left': '14px' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<el-button size="mini" type="primary" class="addGoodsButton">新增</el-button>`
        },
        handle: () => {
          this.popHandle('新增剪板要求', 'shearingRequirements')
        }
      },
      _shearingRequirementsTableForm: {
        prop: 'shearingRequirements',
        itemType: 'table-form',
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        size: 'mini',
        columns: shearingRequirementsColumns,
        dataSource: shearingRequirementsData,
        operates: shearingRequirementsOperates
      },
      _stripeSpacing: {
        itemType: 'view',
        text: '条纹间距',
        style: { 'padding': '16px 0', 'font-size': '16px', display: 'inline-block', 'margin-bottom': '10px' }
      },
      _range: {
        prop: 'range',
        itemType: 'select',
        label: '公差范围',
        valueType: 'object',
        clearable: true,
        rules: [{ required: true, message: '公差范围不能为空', trigger: 'change' }],
        itemStyle: { width: '32%', display: 'inline-block', 'margin': '0 38% 0 32px' },
        visibleChange: value => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '大货订单', fieldName: '公差范围(条纹间距)' }, 'stripeSpacingRange')
          }
        },
        dataSource: [
          // {
          //   label: '公差范围',
          //   value: '1'
          // }
        ]
      },

      _stripeSpacingTableForm: {
        prop: 'stripeSpacing',
        itemType: 'table-form',
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        size: 'mini',
        columns: stripeSpacingColumns,
        dataSource: stripeSpacingData,
        operates: null
      },
      _quantityDelivery: {
        itemType: 'view',
        className: 'item-title',
        text: '数量交期',
        style: { width: '78%', 'padding': '16px 0', 'font-size': '16px', display: 'inline-block' }
      },
      _quantityDeliveryAdd: {
        itemType: 'itemview',
        label: '',
        itemStyle: { display: 'inline-block', 'margin-bottom': '0', 'margin-left': '14px' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<el-button size="mini" type="primary" class="addGoodsButton">新增</el-button>`
        },
        handle: () => {
          // 字段加密内容
          this.encryptFn(this.quantityDeliveryContent, this.orderData['_rule'], 'add')
          this.popHandle('新增交期数量', 'quantityDelivery')
        }
      },
      _quantityDeliveryTableForm: {
        prop: 'quantityDelivery',
        itemType: 'table-form',
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        size: 'mini',
        columns: quantityDeliveryColumns,
        dataSource: quantityDeliveryData,
        operates: quantityDeliveryOperates
      }
    }
    // 颜色&数量&交期弹窗操作配置
    const allPopOptions = {
      itemType: 'drawer',
      size: '1000px',
      visible: false,
      title: '新增颜色&数量&交期',
      okText: '保存',
      ok: params => {
        if (!this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary) {
          this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary = {}
        }
        if (!this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary || !this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.maxColorSeq) {
          this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.maxColorSeq = 0
        }
        if (!params.quantityDelivery || !params.quantityDelivery.length) {
          this.$message.error('数量交期必填！')
          return false
        }

        // 大货不需要二次校验，如果需要放开
        // if (this.colorInfoTemp.length !== 0 || this.colorInfoTemp.length !== 1) {
        //   for (let i = 0; i < this.colorInfoTemp.length; i++) {
        //     const item = this.colorInfoTemp[i]
        //     if (item.greyClothCode === params.customerClothNumber || item.customerClothNumber === params.customerClothNumber || item.customerColor === params.customerColor || item.customerColorEn === params.customerColorEn || item.customerOrderCode === params.customerOrderCode || item.fabricColorNo === params.fabricColorNo || item.fabricFlowerNo === params.fabricFlowerNo ||
        //       item.price === params.price || item.priceTax === params.priceTax || item.styleNumber === params.styleNumber) {
        //       return this.$message({ type: 'error', message: '不能添加相同的客户单号，款号，客户布号，色布/印花布编码，客户颜色，客户颜色(英文)，智布色号，智布花号，单击(含税)，单价(不含税)' })
        //     }
        //   }
        // }

        if (this.allPopOptions.title === '新增颜色&数量&交期') {
          const dataTim = new Date().getTime()
          params = { ...params, code: this.colorInfo.length + 1, dataTim: dataTim, seq: this.status === '2' ? ++this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.maxColorSeq : this.colorInfo.length + 1 }
          this.colorInfo.push(params)
          let arr = []
          if (params.quantityDelivery && params.quantityDelivery.length > 1) {
            params.quantityDelivery.forEach(item => {
              const data = {
                seq: this.status === '2' ? ++this.editAll.maxColorSeq : this.quantityDeliveryData.length + 1,
                greyClothCode: params.greyClothCode,
                customerOrderCode: params.customerOrderCode || '',
                styleNumber: params.styleNumber || '',
                customerClothNumber: params.customerClothNumber || '',
                customerColor: params.customerColor || '',
                customerColorEn: params.customerColorEn || '',
                fabricColorNo: params.fabricColorNo || '',
                fabricFlowerNo: params.fabricFlowerNo,
                priceTax: params.priceTax || '',
                price: params.price || '',
                range: params.range || '',
                shearingRequirements: params.shearingRequirements || [],
                stripeSpacing: params.stripeSpacing || [], // 条纹间距
                quantityDelivery: [item] || [],
                dataTim: dataTim
              }
              arr.push(data)
            })
            // arr = new Array(params.quantityDelivery.length).fill(params)
          } else {
            arr = [...new Array(1).fill(params)]
          }
          this.colorInfoTemp = [...this.colorInfoTemp, ...arr]
          // let totalQuantity = 0
          // let totalAmount = 0
          // this.colorInfoTemp.length && this.colorInfoTemp.forEach(item => {
          //   if (item.quantityDelivery && item.quantityDelivery.length) {
          //     totalQuantity += item.quantityDelivery[0].auxiliaryQuantity
          //     totalAmount += item.quantityDelivery[0].amountTax
          //   }
          // })
          // this.totalQuantity = this.$utils.priceFormat(this.$utils.getFloat(totalQuantity, 2))
          // this.totalAmount = this.$utils.priceFormat(this.$utils.getFloat(totalAmount, 2))
          // this.dataPretreatment(this.colorInfoTemp, 'dataTim', 'color')
          // this.dataPretreatment(this.colorInfoTemp)
        } else {
          this.summaryId = params.summaryId
          // 处理传给后端的数据
          // const dataTim = new Date().getTime()
          // const data = {
          //   greyClothCode: params.greyClothCode,
          //   customerOrderCode: params.customerOrderCode || '',
          //   styleNumber: params.styleNumber || '',
          //   customerClothNumber: params.customerClothNumber || '',
          //   customerColor: params.customerColor || '',
          //   customerColorEn: params.customerColorEn || '',
          //   fabricColorNo: params.fabricColorNo || '',
          //   fabricFlowerNo: params.fabricFlowerNo,
          //   priceTax: params.priceTax || '',
          //   price: params.price || '',
          //   range: params.range || '',
          //   shearingRequirements: params.shearingRequirements || [],
          //   stripeSpacing: params.stripeSpacing || [],
          //   quantityDelivery: params.quantityDelivery || [],
          //   code: params.code || '',
          //   colorInfoId: params.colorInfoId || '',
          //   orderDetailId: params.orderDetailId || '',
          //   orderId: params.orderId || '',
          //   summaryId: params.summaryId || '',
          //   dataTim: dataTim
          // }
          params.maxQuantitySeq = this.editAll.maxQuantitySeq
          this.colorInfo.splice(this.editAll.index, 1, params)
          // 处理页面上的数据
          this.colorInfoTemp = []
          this.colorInfo.forEach(item => {
            if (item.quantityDelivery && item.quantityDelivery.length > 1) {
              item.quantityDelivery.forEach(items => {
                const data = {
                  greyClothCode: params.greyClothCode,
                  customerOrderCode: item.customerOrderCode || '',
                  styleNumber: item.styleNumber || '',
                  customerClothNumber: item.customerClothNumber || '',
                  customerColor: item.customerColor || '',
                  customerColorEn: item.customerColorEn || '',
                  fabricColorNo: item.fabricColorNo || '',
                  fabricFlowerNo: item.fabricFlowerNo,
                  priceTax: item.priceTax || '',
                  price: item.price || '',
                  range: item.range || '',
                  shearingRequirements: item.shearingRequirements || [],
                  stripeSpacing: item.stripeSpacing || [],
                  quantityDelivery: [items] || [],
                  code: item.code || '',
                  dataTim: item.dataTim || ''
                }
                this.colorInfoTemp.push(data)
              })
            } else {
              this.colorInfoTemp = [...this.colorInfoTemp, ...new Array(1).fill({ ...item, dataTim: item.dataTim || '' })]
              // editArr = [ ...editArr, ...new Array(1).fill(item) ]
            }
          })
          this.dataPretreatment(this.colorInfoTemp, 'dataTim', 'color')
        }
        let totalQuantity = 0
        let totalAmount = 0
        this.colorInfoTemp.length && this.colorInfoTemp.forEach(item => {
          if (item.quantityDelivery && item.quantityDelivery.length) {
            totalQuantity += item.quantityDelivery[0].auxiliaryQuantity
            totalAmount += item.quantityDelivery[0].amountTax
          }
        })
        this.totalQuantity = this.$utils.getFloat(totalQuantity, 2)
        this.totalAmount = this.$utils.getFloat(totalAmount, 2)
        this.allPopHandle()
      },
      cancel: params => {
        this.allPopHandle()
      },
      formDatas: {},
      formOptions: {},
      content: allContent
    }
    // 全局数据初始化
    const InitialArray = {
      seq: 1, // 序号
      garmentPart: undefined, // 成衣部位
      cloth: {
        label: '',
        value: ''
      }, // 布类名称
      ingredient: '', // 成份
      ratio: '', // 比例
      dryWay: '', // dryWay
      shrinkL: '', // 缩水(LxW)
      shrinkW: '', // 缩水(LxW)
      printCraft: '', // 印花工艺{JSON}
      dyeCraft: '', // 染整工艺{JSON}
      suggestWidth: '', // 成品幅宽
      suggestWidthUnit: '', // 成品幅宽单位{固定选项："和CM}
      calculation: '', // 计量方式
      range: '', // 公差范围
      weightBefore: '', // 成品克重（洗前）
      weightBeforeUnit: '', // 成品克重单位（洗前）{固定值：GM²}
      weightBeforeRange: '', // 成品克重公差范围（洗前）
      weightAfter: '', // 成品克重（洗后）
      weightAfterUnit: '', // 成品克重单位（洗后）{固定值：GM²}
      weightAfterRange: '', // 成品克重公差范围（洗后）
      referenceVersionInfo: [// 参板信息 ,CoReferenceVersionInfoAddReq
        // {
        //   referenceOrder: '', // 参考的订单
        //   greyClothCode: '', // 坯布色布印花布编码
        //   referenceContent: '', // 参考内容
        //   remark: ''// remark
        // }
      ],
      colorQuantityDeliverySummary: { // 颜色数量交期汇总信息 ,CoColorQuantityDeliverySummaryAddReq
        unit: '', // 单位
        totalQuantity: '', // 总数量
        totalAmount: '', // 总金额
        colorInfo: [ // 颜色信息 ,CoColorInfoAddReq
          // {
          //   customerOrderCode: '',
          //   styleNumber: '',
          //   customerClothNumber: '',
          //   customerColor: '',
          //   customerColorEn: '',
          //   fabricColorNo: '',
          //   fabricFlowerNo: '',
          //   priceTax: '',
          //   price: '',
          //   range: '',
          //   shearingRequirements: [],
          //   stripeSpacing: [],
          //   quantityDelivery: []
          // }
        ]
      },
      materialInfo: []
    }
    return {
      status: '',
      maxValue: 0,
      newValue: 0,
      rowIndex: 1,
      newColorValue: 0,
      newColorChildValue: 0,
      basicData,
      basicFormDatas: {
        taxRate: '0' // 默认税率为0
      }, // 基本信息数据
      formOptions: {
        size: 'small',
        inline: true
      },
      formDatas: {},
      headerCellStyle,
      headerTitleLeftStyle,
      columns,
      operates,
      dataSource,
      orderDataSource,
      sampleAnalysisResultId: '',
      rules: {
        sampleAnalysisResultId: [
          { required: true, message: '请选择客样分析编号', trigger: 'change' }
        ]
      },
      versionColumns,
      versionOperatesData,
      versionOperates,
      versionData: [],
      materialColumns,

      materialDatasource,
      materialData,
      allColumns,
      allOperatesData,
      allOperates,
      allData: [],
      pagination,
      versionPopOptions,
      versionContent,
      allPopOptions,
      allContent,
      quantityDeliveryData,
      quantityDeliveryOperates,
      quantityDeliveryColumns,
      stripeSpacingData,
      stripeSpacingColumns,
      shearingRequirementsOperates,
      shearingRequirementsData,
      shearingRequirementsColumns,
      shearingRequirementsPopOptions,
      shearingRequirementsContent,
      quantityDeliveryPopOptions,
      quantityDeliveryContent,
      isshowCloth: false, // 是否显示坯布编码弹窗
      isShowchoose: false, // 是否选择色布/印花布编码弹窗
      productData,
      chooseTitle: '',
      chooseSearch: {},
      chooseColumns: {},
      // dataVal: '',
      unitOptions: [],
      FlowerTitle: '',
      FlowerSearch: {},
      FlowerColumns: {},
      isshowFlower: false,
      tableData: [],
      colorInfo: [],
      mergingRows: [],
      mergingPos: 0,
      colorInfoTemp: [],
      clothTitle: '',
      clothSearch: {},
      clothColumns: {},
      colorFabricData: [],
      clothCodeData: {}, // 选中坯布编码数据
      // orderIndex: 0, // 选中订单信息下标
      saveAndadd, // 剪板要求弹窗确定，继续添加按钮
      quantityAdd, // 数量交期弹窗确定，继续添加按钮
      unit: {
        label: '',
        value: ''
      },
      totalQuantity: 0,
      totalAmount: 0,
      leftFormDatas: {},
      choosePagination: {}, // 参板信息坯布编码列表分页
      rows: [],
      pos: 0,
      spanMethod,
      colorPagination: {}, // 数量交期坯布编码弹窗分页
      editAll: {}, // 编辑某条数量交期数据
      isFirstSelect: false, // 是否第一次选择参板信息坯布编码
      greyClothCode: '', // 参板信息编辑时备份一个坯布编码
      dyeCraftStr: '', // 产品信息染整工艺
      InitialArray,
      clothformDatas: {},
      materialCopy: [], // 从参板信息弹窗坯布编码那边选中原料信息备份
      summaryId: '', // 编辑颜色数量交期时拿到该条的summaryId
      currencyDatas: [],
      currencyCode: '',
      versionInfoLength: '',
      clothParams: {}, // 参板信息坯布编码分页备份查询数据
      chooseParams: {} // 颜色数量交期坯布编码分页备份查询数据

    }
  },
  computed: {

    getEditClass() {
      if (this.isEdit) {
        return 'editClass'
      } else {
        return 'detailClass'
      }
    },
    getTotalQuantity() {
      const totalNum = this.colorInfoTemp.reduce((total, item) => {
        const quantity = (item.quantityDelivery && item.quantityDelivery.length) ? item.quantityDelivery[0].quantity : 0
        // debugger
        total += quantity * 1
        return total
      }, 0)
      return totalNum
    },
    getTotalAmount() {
      const totalMoney = this.colorInfoTemp.reduce((total, item) => {
        const totalAmount = (item.quantityDelivery && item.quantityDelivery.length) ? item.quantityDelivery[0].amountTax : 0
        // debugger
        total += totalAmount * 1
        return total
      }, 0)
      return totalMoney
    }
  },
  watch: {
    isEdit: {
      handler(val, oldVal) {
        if (val) {
          this.editChange(true)
          this.editInputs(false)
        } else {
          this.changeOptionStatus()
          this.editInputs(true)
        }
      },
      deep: true,
      immediate: true
    },
    orderData: {
      async handler(val, oldVal) {
        if (val && Object.keys(val).length) {
          this.versionInfoLength = val.version || 0
          this.setDetailData(val)
          if (val.demandSource && val.demandCode) {
            this.orderDataDis()
          }
          if (this.$route.query.requireId) {
            const sup = ['brand', 'customer', 'seller', 'sellYear', 'sellQuarter', 'currency', 'pricingTerm', 'paymentTerm', 'salesTeam', 'orderType']
            sup.forEach(item => {
              // debugger
              const tempData = (this.orderData[item] && this.orderData[item].value) ? [this.orderData[item]] : []

              this.$set(this.basicData['_' + item], 'dataSource', tempData)
              // this.$set(this.basicData['_' + item], 'dataSource', [this.orderData[item].value ? this.orderData[item] : null])
            })
            this.basicFormDatas = val
          }
          // this.getCurrencySelect()
          this.currencyDatas.forEach(item => {
            if (item.value === val.currency.value) {
              this.currencyCode = item.code
            }
          })
          // this.setDetailData(val)
          this.setOrderDtail()
          this.setHomeList(this.rowIndex)
        }
      },
      deep: true
    },
    // 监听路由是否带有rowIndex
    $route: {
      async handler(v) {
        if (v.query.rowIndex) {
          this.rowIndex = v.query.rowIndex * 1
        }
      },
      deep: true,
      immediate: true
    },
    rowIndex: {
      handler(val, oldVal) {
        if (val) {
          this.setHomeList(val * 1)
        }
      },
      deep: true
      // immediate: true
    }
  },
  created() {
    this.getOptionConfigSelect({ pageName: '大货订单', fieldName: '成衣部位' }, 'garmentPart')
    this.getOptionConfigSelect({ pageName: '大货订单', fieldName: '证书要求' }, 'combine')
    this.getOptionConfigSelect({ pageName: '大货订单', fieldName: '剪板要求类型' }, 'type')
    this.setUnitsSelect()
    this.getCurrencySelect() // 币别
    // this.changeOptionStatus()
  },
  mounted() {
    this.changeOptionStatus()
  },
  methods: {
    inputTypeChange() {
      return this.isEdit ? 'input' : 'itemview'
    },
    selectTypeChange() {
      return this.isEdit ? 'select' : 'itemview'
    },
    // 判断一个字符串是否是json格式
    isJson(str) {
      if (typeof (str) === 'string') {
        try {
          const obj = JSON.parse(str)
          if (typeof (obj) === 'object' && obj) {
            return true
          } else {
            return false
          }
        } catch (e) {
          return false
        }
      }
    },
    // 保存拿到所有订单数据
    DataSummary() {
      const orderLeft = this.$refs.dataSourceMix.dynamicValidateFormRuleForm.tableForm // 订单左侧表格
      let productData = this.$refs.productData.dynamicValidateFormRuleForm // 产品信息数据
      // this.$set(this, 'orderDataSource', orderLeft)
      let suggestWidth = ''
      let weightBefore = ''
      suggestWidth = productData.suggestWidth ? productData.suggestWidth + '' : ''
      productData.suggestWidth = suggestWidth
      weightBefore = productData.weightBefore ? productData.weightBefore + '' : ''
      productData.weightBefore = weightBefore
      if (productData.dyeCraft && !productData.dyeCraft.includes('"')) {
        productData.dyeCraft = JSON.stringify(productData.dyeCraft)
      }
      if (productData.printCraft && !productData.printCraft.includes('"')) {
        productData.printCraft = JSON.stringify(productData.printCraft)
      }
      productData = {
        ingredient: productData.ingredient || '',
        ratio: productData.ratio || '',
        dryWay: productData.dryWay || '',
        shrinkL: productData.shrinkL || '',
        shrinkW: productData.shrinkW || '',
        printCraft: productData.printCraft || '',
        dyeCraft: productData.dyeCraft || '',
        // printCraft: productData.printCraft || '',
        // dyeCraft: productData.dyeCraft || '',
        suggestWidth: productData.suggestWidth || '',
        range: productData.range || '',
        weightBefore: productData.weightBefore || '',
        weightBeforeRange: productData.weightBeforeRange || '',
        weightAfter: productData.weightAfter || '',
        weightAfterRange: productData.weightAfterRange || '',
        weightBeforeUnit: 'g/m²',
        weightAfterUnit: 'g/m²',
        suggestWidthUnit: productData.suggestWidthUnit,
        orderDetailId: productData.orderDetailId || '',
        orderId: productData.orderId || ''
      }
      const materialData = this.$refs.materialData.dynamicValidateFormRuleForm.tableForm // 原料信息数据
      this.materialCopy && this.materialCopy.forEach((mitem, mindex) => {
        mitem.certificate = materialData[mindex] && materialData[mindex].certificate || {}
        mitem.supplierYarnCode = materialData[mindex] && materialData[mindex].supplierYarnCode || ''
      })
      const parmas = {
        ...orderLeft[this.rowIndex - 1],
        ...productData, // 产品信息
        materialInfo: this.materialCopy, // 原料信息
        referenceVersionInfo: this.versionData, //  参板信息数据
        colorQuantityDeliverySummary: { //  颜色数量交期汇总信息
          unit: {
            label: this.unit.label || '',
            value: '' + this.unit.value || ''
          },
          // summaryId: this.colorInfo && this.colorInfo.length && this.colorInfo[this.rowIndex - 1].summaryId ? this.colorInfo[this.rowIndex - 1].summaryId : '',
          // summaryId: this.detailParams && this.detailParams.detail && this.detailParams.detail.length && this.detailParams.detail[this.rowIndex - 1] && this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary ? this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary.summaryId : '',
          summaryId: this.orderDataSource.length && this.orderDataSource[this.rowIndex - 1] && this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary ? this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.summaryId : '',
          totalQuantity: this.getTotalQuantity || 0,
          totalAmount: this.getTotalAmount || 0,

          colorInfo: this.colorInfo.length ? this.colorInfo : []
        }
      }
      this.orderDataSource[this.rowIndex - 1] = { ...this.orderDataSource[this.rowIndex - 1], ...parmas }
      return this.orderDataSource
    },
    // 编辑时点击左侧切换保存此份数据
    saveRowData(index) {
      const orderLeft = this.$refs.dataSourceMix.dynamicValidateFormRuleForm.tableForm // 订单左侧表
      let productData = this.$refs.productData.dynamicValidateFormRuleForm // 产品信息数据
      const materialData = this.$refs.materialData.dynamicValidateFormRuleForm.tableForm || []
      this.materialCopy && this.materialCopy.forEach((mitem, mindex) => {
        if (materialData[mindex]) {
          mitem.certificate = materialData[mindex].certificate
          mitem.supplierYarnCode = materialData[mindex].supplierYarnCode
        }
      })
      // this.$set(this, 'orderDataSource', orderLeft)
      productData = {
        ingredient: productData.ingredient || '',
        ratio: productData.ratio || '',
        dryWay: productData.dryWay || '',
        shrinkL: productData.shrinkL || '',
        shrinkW: productData.shrinkW || '',
        printCraft: productData.printCraft || '',
        dyeCraft: productData.dyeCraft || '',
        // printCraft: productData.printCraft || '',
        // dyeCraft: productData.dyeCraft || '',
        suggestWidth: productData.suggestWidth || '',
        range: productData.range || '',
        weightBefore: productData.weightBefore || '',
        weightBeforeRange: productData.weightBeforeRange || '',
        weightAfter: productData.weightAfter || '',
        weightAfterRange: productData.weightAfterRange || '',
        weightBeforeUnit: 'g/m²',
        weightAfterUnit: 'g/m²',
        suggestWidthUnit: productData.suggestWidthUnit,
        orderDetailId: productData.orderDetailId || '',
        orderId: productData.orderId || ''
      }
      const parmas = {
        ...orderLeft[this.rowIndex - 1],
        ...productData,
        referenceVersionInfo: this.versionData, //  参板信息数据,
        colorQuantityDeliverySummary: { //  颜色数量交期汇总信息
          unit: {
            label: this.unit.label || '',
            value: '' + this.unit.value || ''
          },
          summaryId: this.colorInfo && this.colorInfo.length && this.colorInfo[0].summaryId ? this.colorInfo[0].summaryId : '',
          totalQuantity: this.getTotalQuantity || 0,
          totalAmount: this.getTotalAmount || 0,
          // colorInfo: this.colorInfo.length ? [this.colorInfo[this.rowIndex - 1]] : []
          colorInfo: this.colorInfo.length ? this.colorInfo : []
        },
        materialInfo: this.materialCopy.length ? this.materialCopy : []// 原料信息
      }
      this.orderDataSource[this.rowIndex - 1] = { ...this.orderDataSource[this.rowIndex - 1], ...parmas }
      // this.orderDataSource[this.rowIndex - 1].materialInfo = this.materialCopy || []// 原料信息
    },
    // 新增、编辑时设置分录页面数据
    setOrderDtail() {
      this.colorInfo = []
      this.colorInfoTemp = []
      this.$set(this.dataSource[0], 'dataSource', this.orderDataSource)
      this.versionData = this.orderDataSource[this.rowIndex - 1] ? this.orderDataSource[this.rowIndex - 1].referenceVersionInfo : []
      this.formDatas = {}
      // 设置当前条数据时 先把页面上的数据清一次 可能会把后端其他id等字段带出
      this.$set(this.$refs.productData, 'dynamicValidateFormRuleForm', {})
      if (!this.isEdit) {
        this.$set(this.productData._weightAfter, 'itemType', 'itemview')
      } else {
        this.$set(this.productData._weightAfter, 'itemType', 'input')
      }
      this.formDatas = JSON.parse(JSON.stringify(this.orderDataSource[this.rowIndex - 1]))
      this.formDatas.newingredient = (this.formDatas.ingredient && this.formDatas.ingredient.label ? this.formDatas.ingredient.label : '') + ' ' + (this.formDatas && this.formDatas.ratio ? this.formDatas.ratio : '')
      let suggestWidth = ''
      let weightBefore = ''
      let weightAfter = ''
      suggestWidth = this.formDatas.suggestWidth ? this.formDatas.suggestWidth + '' : ''
      this.formDatas.suggestWidth = suggestWidth
      weightBefore = this.formDatas.weightBefore ? this.formDatas.weightBefore + '' : ''
      this.formDatas.weightBefore = weightBefore
      weightAfter = this.formDatas.weightAfter ? this.formDatas.weightAfter + '' : ''
      this.formDatas.weightAfter = weightAfter
      this.materialDatasource = this.orderDataSource[this.rowIndex - 1] && this.orderDataSource[this.rowIndex - 1].materialInfo && this.orderDataSource[this.rowIndex - 1].materialInfo.length ? this.orderDataSource[this.rowIndex - 1].materialInfo : []
      // debugger
      this.$set(this.materialData[0], 'dataSource', [...this.materialDatasource])
      this.dataPretreatment(this.materialDatasource, 'code', 'material')
      if (this.orderDataSource[this.rowIndex - 1] && this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary && this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.colorInfo && this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.colorInfo.length) {
        this.colorInfo = this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.colorInfo
        this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.colorInfo.forEach((item, index) => {
          if (item.quantityDelivery && item.quantityDelivery.length) {
            item.quantityDelivery.forEach(items => {
              const listItem = {
                greyClothCode: item.greyClothCode || '',
                customerOrderCode: item.customerOrderCode || '',
                styleNumber: item.styleNumber || '',
                customerClothNumber: item.customerClothNumber || '',
                customerColor: item.customerColor || '',
                customerColorEn: item.customerColorEn || '',
                fabricColorNo: item.fabricColorNo || '',
                fabricFlowerNo: item.fabricFlowerNo || '',
                priceTax: item.priceTax || '',
                price: item.price || '',
                range: item.range || '',
                shearingRequirements: item.shearingRequirements || [],
                stripeSpacing: item.stripeSpacing || [],
                quantityDelivery: [items] || [],
                colorInfoId: item.colorInfoId
              }
              if (item.quantityDelivery.length > 1) {
                this.colorInfoTemp.push({ ...listItem, dataTim: new Date().getTime() + '' + index })
              } else {
                this.colorInfoTemp.push(listItem)
              }
            })
          } else {
            this.colorInfoTemp.push(item)
          }
        })
        this.dataPretreatment(this.colorInfoTemp, 'dataTim', 'color')
      } else {
        this.colorInfo = []
        this.colorInfoTemp = []
      }
      if (this.orderDataSource[this.rowIndex - 1] && this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary) {
        this.totalAmount = this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.totalAmount || ''
        this.totalQuantity = this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.totalQuantity || ''
        this.unit = this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.unit || {}
      }
      // this.orderDataSource && this.orderDataSource.forEach((oitem, oindex) => {
      //   oitem.cloth = oitem.cloth.label || ''
      // })
      // 清除产品部分的校验
      this.$nextTick(() => {
        this.$refs.productData.form.clearValidate()
      })
    },
    // 设置详情信息
    setDetailData(val) {
      // 字段加密处理
      this.$nextTick(() => {
        this.encryptFn(this.basicData, val['_rule'], this.isEdit ? 'edit' : 'info')
        this.encryptFn(this.productData, val['_rule'], this.isEdit ? 'edit' : 'info')
      })
      // this.$set(this.dataSource[0], 'dataSource', this.orderDataSource)
      // this.$set(this.$refs.dataSourceMix.dataSource, 'dataSource', this.orderDataSource)
      this.colorInfo = []
      this.colorInfoTemp = []
      this.detailParams = JSON.parse(JSON.stringify(val || 0))
      this.status = this.detailParams.status
      this.maxValue = this.detailParams.maxDetailSeq * 1
      if (this.detailParams && this.detailParams.detail && this.detailParams.detail.length) {
        this.orderDataSource = JSON.parse(JSON.stringify(this.detailParams.detail || []))
        this.orderDataSource.forEach(item => {
          item.edit = true
        })
        if (this.orderDataSource.length < this.rowIndex) {
          this.rowIndex = 1
        }
        this.basicFormDatas = this.detailParams
        const orderDataSource = this.detailParams.detail.map((item, index) => {
          return {
            code: index + 1,
            seq: item.seq,
            garmentPart: item.garmentPart ? { label: item.garmentPart.label, value: item.garmentPart.value } : '',
            cloth: item.cloth ? item.cloth : null,
            edit: true,
            materialInfo: item.materialInfo && item.materialInfo.length ? item.materialInfo : [] // xj
          }
        })
        this.$set(this.dataSource[0], 'dataSource', orderDataSource)
        this.$set(this.dataSource[0], 'currentRowKey', this.rowIndex)
        this.orderDataSource.forEach((item, index) => {
          item.code = index + 1
        })
        // this.$refs.dataSourceMix.dataSource[0].dataSource = orderDataSource
        this.formDatas = JSON.parse(JSON.stringify(this.detailParams.detail[this.rowIndex - 1]))
        this.formDatas.newingredient = (this.formDatas.ingredient && this.formDatas.ingredient.label ? this.formDatas.ingredient.label : '') + ' ' + (this.formDatas && this.formDatas.ratio ? this.formDatas.ratio : '')
        // let suggestWidth = ''
        // let weightBefore = ''
        // const weightAfter = ''
        // suggestWidth = this.formDatas.suggestWidth ? this.formDatas.suggestWidth + this.formDatas.suggestWidthUnit : ''
        // this.formDatas.suggestWidth = suggestWidth
        // weightBefore = this.formDatas.weightBefore ? this.formDatas.weightBefore + this.formDatas.weightBeforeUnit : ''
        // this.formDatas.weightBefore = weightBefore
        // this.formDatas.weightAfter = this.formDatas.weightAfter ? this.formDatas.weightAfter + this.formDatas.weightAfterUnit : ''
        // this.formDatas.weightAfter = weightAfter
        if (!this.isEdit) {
          this.$set(this.productData._weightAfter, 'itemType', 'itemview')
        } else {
          this.$set(this.productData._weightAfter, 'itemType', 'input')
        }
        this.versionData = this.detailParams.detail[this.rowIndex - 1].referenceVersionInfo
        // this.RawMaterialArray = this.getmaterialInfoIndex(this.detailParams.detail[0].materialInfo || [])
        // this.materialData = this.detailParams.detail[0].materialInfo || []
        this.setHomeList(this.rowIndex)
        this.totalAmount = this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary ? this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary.totalAmount : 0
        this.totalQuantity = this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary ? this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary.totalQuantity : 0

        this.unit = this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary ? this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary.unit : ''
        this.setUnitsSelect()
        // this.materialData = this.detailParams.detail[0].referenceVersionInfo
        this.colorInfo = this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary && this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary.colorInfo && this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary.colorInfo.length ? JSON.parse(JSON.stringify(this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary.colorInfo)) : []
        this.colorInfo.forEach((item, index) => {
          item.code = index + 1
          item.dataTim = new Date().getTime() + '' + index
        })
        this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary && this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary.colorInfo && this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary.colorInfo.length && this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary.colorInfo.forEach((item, index) => {
          if (item.quantityDelivery && item.quantityDelivery.length) {
            item.quantityDelivery && item.quantityDelivery.length && item.quantityDelivery.forEach(items => {
              const listItem = {
                code: index + 1,
                seq: items.seq || '',
                greyClothCode: item.greyClothCode || '',
                customerOrderCode: item.customerOrderCode || '',
                styleNumber: item.styleNumber || '',
                customerClothNumber: item.customerClothNumber || '',
                customerColor: item.customerColor || '',
                customerColorEn: item.customerColorEn || '',
                fabricColorNo: item.fabricColorNo || '',
                fabricFlowerNo: item.fabricFlowerNo || '',
                priceTax: item.priceTax || '',
                price: item.price || '',
                range: item.range || '',
                shearingRequirements: item.shearingRequirements || [],
                stripeSpacing: item.stripeSpacing || [],
                quantityDelivery: [items] || [],
                colorInfoId: item.colorInfoId
              }
              if (item.quantityDelivery.length > 1) {
                this.colorInfoTemp.push({ ...listItem, dataTim: new Date().getTime() + '' + index })
              } else {
                this.colorInfoTemp.push(listItem)
              }
            })
          } else {
            const listItem = {
              greyClothCode: item.greyClothCode || '',
              customerOrderCode: item.customerOrderCode || '',
              styleNumber: item.styleNumber || '',
              customerClothNumber: item.customerClothNumber || '',
              customerColor: item.customerColor || '',
              customerColorEn: item.customerColorEn || '',
              fabricColorNo: item.fabricColorNo || '',
              fabricFlowerNo: item.fabricFlowerNo || '',
              priceTax: item.priceTax || '',
              price: item.price || '',
              range: item.range || '',
              shearingRequirements: item.shearingRequirements || [],
              stripeSpacing: item.stripeSpacing || [],
              quantityDelivery: [],
              colorInfoId: item.colorInfoId
            }
            this.colorInfoTemp.push(listItem)
          }
        })
        this.dataPretreatment(this.colorInfoTemp, 'colorInfoId', 'color')
      }
    },
    setHomeList(data) { // 设置订单信息数据
      const num = data - 1 || 0
      let dataArray = []
      if (this.orderDataSource && this.orderDataSource.length && this.orderDataSource.length > num) {
        dataArray = JSON.parse(JSON.stringify(this.orderDataSource))
      }
      if (dataArray && dataArray.length) {
        const indexCom = dataArray[num]
        const ingredient = indexCom.ingredient && indexCom.ingredient.value ? [indexCom.ingredient] : []
        const range = indexCom.range && indexCom.range.value ? [indexCom.range] : []
        const weightBeforeRange = indexCom.weightBeforeRange && indexCom.weightBeforeRange.value ? [indexCom.weightBeforeRange] : []
        const weightAfterRange = indexCom.weightAfterRange && indexCom.weightAfterRange.value ? [indexCom.weightAfterRange] : []
        this.$set(this.productData._ingredient, 'dataSource', ingredient)
        this.$set(this.productData._range, 'dataSource', range)
        this.$set(this.productData._weightBeforeRange, 'dataSource', weightBeforeRange)
        this.$set(this.productData._weightAfterRange, 'dataSource', weightAfterRange)
        // 原料信息处理
        var spu = []
        if (indexCom && indexCom.materialInfo && indexCom.materialInfo.length) {
          this.materialCopy = indexCom.materialInfo
          indexCom.materialInfo && indexCom.materialInfo.forEach((item, index) => {
            if (item.type === '0') {
              item.naturalFiber && item.naturalFiber.forEach((im, ix) => {
                im.code = item.yarnCode
                im.certificate = item.certificate ? item.certificate : ''
                im.dataTim = item.dataTim
                im.materialInfoCopy = item.materialInfoCopy || 0
                im.chemicalFiber = item.chemicalFiber || []
                im.materialId = item.materialId
                im.orderDetailId = item.orderDetailId
                im.orderId = item.orderId
                im.supplierYarnCode = item.supplierYarnCode
                im.type = item.type
                spu.push(im)
              })
            } else if (item.type === '1') {
              item.chemicalFiber && item.chemicalFiber.forEach((im, ix) => {
                im.code = item.yarnCode
                im.type = item.type
                im.orderId = item.orderId
                im.materialInfoCopy = item.materialInfoCopy || 0
                im.dataTim = item.dataTim || 0
                im.materialId = item.materialId
                im.certificate = item.certificate ? item.certificate : ''
                im.supplierYarnCode = item.supplierYarnCode
                item.naturalFiber = []
                spu.push(im)
              })
            } else if (item.type === '2') {
              item
              var dataom = []; var dataoma2 = []
              item.naturalFiber && item.naturalFiber.length && item.naturalFiber.forEach((im, ix) => {
                im.code = item.yarnCode
                im.certificate = item.certificate ? item.certificate : ''
                im.chemicalFiber = item.chemicalFiber || []
                im.materialId = item.materialId
                im.dataTim = item.dataTim || 0
                im.materialInfoCopy = item.materialInfoCopy || 0
                im.orderDetailId = item.orderDetailId
                im.orderId = item.orderId
                im.supplierYarnCode = item.supplierYarnCode
                im.type = item.type
                dataom.push(im)
              })
              item.chemicalFiber && item.chemicalFiber.length && item.chemicalFiber.forEach((imc, ixc) => {
                imc.materialId = item.materialId
                imc.type = item.type
                imc.dataTim = item.dataTim || 0
                imc.materialInfoCopy = item.materialInfoCopy || 0
                imc.orderId = item.orderId
                imc.materialId = item.materialId
                imc.naturalFiber = []
                imc.supplierYarnCode = item.supplierYarnCode
                dataoma2.push(imc)
              })
              spu.push(...dataom, ...dataoma2)
            }
          })
        }

        this.materialDatasource = spu
        if (this.isEdit) {
          this.materialDatasource && this.materialDatasource.forEach((Titem, Tindex) => {
            Titem.edit = true
          })
        }
        this.$set(this.materialData[0], 'dataSource', this.materialDatasource)
        this.dataPretreatment(this.materialDatasource, 'code', 'material')
      } else {
        this.materialDatasource = []
      }
      this.$set(this.dataSource[0], 'currentRowKey', this.rowIndex)
    },
    // / 选项配置下拉
    getOptionConfigSelect(data, type) {
      this.getOptionConfig(data).then(res => {
        if (type === 'orderType') { // 订单类型
          this.$set(this.basicData._orderType, 'dataSource', res)
        } else if (type === 'garmentPart') { // 成衣部位
          this.$set(this.columns._garmentPart.editOptions, 'dataSource', res)
        } else if (type === 'referenceContent') { // 参考内容
          this.$set(this.versionContent._referenceContent, 'dataSource', res)
        } else if (type === 'range') { // 公差范围(幅宽)
          this.$set(this.productData._range, 'dataSource', res)
        } else if (type === 'weightBeforeRange') { // 公差范围(克重)
          this.$set(this.productData._weightBeforeRange, 'dataSource', res)
        } else if (type === 'weightAfterRange') { // 公差范围(克重)
          this.$set(this.productData._weightAfterRange, 'dataSource', res)
        } else if (type === 'naturalFiber') { // 证书要求
          this.$set(this.naturalFiberContent._certificate, 'dataSource', res)
        } else if (type === 'chemicalFiber') { // 证书要求
          this.$set(this.chemicalFiberContent._certificate, 'dataSource', res)
        } else if (type === 'combine') { // 证书要求
          this.$set(this.materialColumns._certificate.editOptions, 'dataSource', res)
        } else if (type === 'type') { // 剪版要求类型
          this.$set(this.shearingRequirementsContent._type, 'dataSource', res)
        } else if (type === 'stripeSpacingRange') { // 公差范围(条纹间距)
          this.$set(this.allContent._range, 'dataSource', res)
        } else if (type === 'baseData') {
          this.$set(this.basicData._sellQuarter, 'dataSource', res)
        } else if (type === 'chooseSearch') {
          this.$set(this.chooseSearch._sellQuarter, 'dataSource', res)
        } else if (type === 'allRange') {
          this.$set(this.productData._range, 'dataSource', res)
          this.$set(this.productData._weightBeforeRange, 'dataSource', res)
          this.$set(this.productData._weightAfterRange, 'dataSource', res)
        }
      })
    },
    // 品牌商下拉
    getBrandSelect() {
      this.getBrand().then(res => {
        this.$set(this.basicData._brand, 'dataSource', res)
      })
    },
    // 获取客户下拉
    getCustomerSelect(type) {
      this.getCustomer().then(res => {
        if (type === 'customer') {
          this.$set(this.basicData._customer, 'dataSource', res)
        } else if (type === 'garmentFactory') {
          this.$set(this.basicData._garmentFactory, 'dataSource', res)
        }
      })
    },
    // 获取销售团队下拉
    getSellTeamSelect() {
      this.getSellTeam({ functionTag: 'SAL' }).then(res => {
        this.$set(this.basicData._salesTeam, 'dataSource', res)
      })
    },
    // 获取销售员下拉
    getSellerSelect() {
      this.getSeller().then(res => {
        this.$set(this.basicData._seller, 'dataSource', res)
      })
    },
    // 获取客服下拉
    getCustomerServiceSelect() {
      this.getSeller({ functionTag: 'SAL' }).then(res => {
        this.$set(this.basicData._customerService, 'dataSource', res)
      })
    },
    // 获取年份下拉
    getYearSelect(type) {
      this.getYear().then(res => {
        if (type === 'sellYear') {
          this.$set(this.basicData._sellYear, 'dataSource', res)
        } else if (type === 'stripeSpacing' || type === 'allContent') {
          this.$set(this.chooseSearch._sellYear, 'dataSource', res)
        }
      })
    },
    // 获取币别下拉
    getCurrencySelect() {
      this.getCurrency().then(res => {
        this.currencyDatas = res
        this.$set(this.basicData._currency, 'dataSource', res)
      })
    },
    // 获取价格条款下拉
    getPricingTermSelect() {
      this.getPricingTerm().then(res => {
        this.$set(this.basicData._pricingTerm, 'dataSource', res)
      })
    },
    // 获取付款条件下拉
    getPaymentTermSelect() {
      this.getPaymentTerm().then(res => {
        this.$set(this.basicData._paymentTerm, 'dataSource', res)
      })
    },
    // 订单号下拉
    getOrderNoSelect() {
      this.$set(this.versionContent._referenceOrder, 'dataSource', [])
      const greyClothCode = this.versionPopOptions.formDatas && this.versionPopOptions.formDatas.greyClothCode
      this.getOrderNo({ greyClothCode: greyClothCode }).then(res => {
        this.$set(this.versionContent._referenceOrder, 'dataSource', res)
      })
    },

    // 设置弹框下拉数据
    async setUnitsSelect(data = {}) {
      const id = this.unit && this.unit.value || ''
      const type = id ? 'edit' : 'add'
      const datalList = await getUnitsSelect({}, { id, data: [], type })
      this.unitOptions = datalList
      if (!this.unit.value && this.unitOptions && this.unitOptions.length) {
        this.unit = this.unitOptions[0]
      }
      this.$set(this.shearingRequirementsContent._unit, 'dataSource', this.unitOptions)
    },
    visibleUnitsSelect(e) {
      if (e) {
        this.setUnitsSelect()
      }
    },

    // 印花工艺下拉
    getPrintCraftSelect(type) {
      if (type === 'Craft') {
        this.getPrintCraft().then(res => {
          this.$set(this.FlowerSearch._printCraft, 'dataSource', res)
        })
      } else if (type === 'TechId') {
        this.getPrintCraft().then(res => {
          this.$set(this.clothSearch._printTechId, 'dataSource', res)
        })
      }
    },
    // 获取布类下拉
    getClothSelect() {
      this.getCloth().then(res => {
        this.$set(this.clothSearch._fabrication, 'dataSource', res)
      })
    },
    // 成份下拉
    getCompositionSelect() {
      this.getComposition().then(res => {
        this.$set(this.clothSearch._ingredients, 'dataSource', res)
      })
    },
    // 纱支、细度下拉 type: yarn纱支 fineness细度 combine组合
    getYarnSelect(type) {
      const GenericType = { type, enabled: 'Y' }
      this.getYarn(GenericType).then(res => {
        this.$set(this.clothSearch._yarnCountFineness, 'dataSource', res)
      })
    },
    // 纱类、丝类下拉 type: yarn纱类 silk丝类 combine组合
    getYarnTypeSelect(type) {
      const GenericType = { type, enabled: 'Y' }
      this.getYarnType(GenericType).then(res => {
        this.$set(this.clothSearch._yarnSilkType, 'dataSource', res)
      })
    },

    // 不同状态下
    changeOptionStatus() {
      this.materialDatasource && this.materialDatasource.map((item, index) => {
        item.edit = this.isEdit
      })
      // if (!this.isEdit) {
      //   if (this.$route.path.includes('show')) {
      //     // this.isEdit = false
      //     // this.basicData = { ...this.baseData }
      //     for (const key in this.basicData) {
      //       this.basicData[key].disabled = true
      //     }
      //     for (const key in this.productData) {
      //       this.productData[key].disabled = true
      //     }
      //     if (this.$refs.dataSourceMix) {
      //       this.$set(this.$refs.dataSourceMix.dataSource[0], 'operates', null)
      //     }
      //     this.versionOperates = null
      //     this.allOperates = null
      //     this.$set(this.productData._weightAfter, 'append', '')
      //     // 字段加密--此处待定
      //     this.encryptFn(this.basicData, this.orderData['_rule'], this.isEdit ? 'edit' : 'info')
      //     this.encryptFn(this.productData, this.orderData['_rule'], this.isEdit ? 'edit' : 'info')
      //   } else {
      //     // this.isEdit = true
      //     // this.$set(this.productData._weightAfter, 'append', 'g/m²')
      //     this.editChange()
      //   }
      // } else {
      //   // this.basicData = { ...this.baseData }
      //   this.editChange()
      //   // this.isEdit = true
      // }
      if (this.isEdit) {
        this.editChange()
        // if (this.$refs.dataSourceMix) {
        //   this.$set(this.$refs.dataSourceMix.dataSource[0], 'operates', this.operates)
        // }
        this.$set(this.productData._weightAfter, 'itemType', 'input')
      } else {
        for (const key in this.basicData) {
          this.basicData[key].disabled = true
          this.basicData[key].placeholder = ''
        }
        for (const key in this.productData) {
          this.productData[key].disabled = true
          // this.basicData[key].placeholder = ''
        }
        if (this.$refs.dataSourceMix) {
          this.$set(this.$refs.dataSourceMix.dataSource[0], 'operates', null)
        }
        this.versionOperates = null
        this.allOperates = null
        this.$set(this.productData._weightAfter, 'append', '')
        // 字段加密--此处待定
        this.encryptFn(this.basicData, this.orderData['_rule'], this.isEdit ? 'edit' : 'info')
        this.encryptFn(this.productData, this.orderData['_rule'], this.isEdit ? 'edit' : 'info')
        this.$set(this.productData._weightAfter, 'itemType', 'itemview')
      }
    },
    // 编辑状态
    editChange() {
      if (this.orderData.demandSource && this.orderData.demandCode) { // 需求来源
        for (const key in this.basicData) {
          this.basicData[key].disabled = true
        }
        // if (this.orderData.isSettlement) {
        //   this.basicData._taxRate.disabled = false
        // }
        this.basicData._garmentFactory.disabled = false
        this.basicData._customerService.disabled = false
        this.basicData._taxRate.disabled = false
        // this.basicData._isSettlement.disabled = false
      } else {
        for (const key in this.basicData) {
          this.basicData[key].disabled = false
          const item = this.basicData[key]
          if (item.itemType === 'select' && item.filterable) {
            this.basicData[key].placeholder = '请输入文字模糊搜索'
          } else if (item.itemType === 'select' && !item.filterable) {
            this.basicData[key].placeholder = '请选择'
          } else if (item.itemType === 'input') {
            this.basicData[key].placeholder = '请输入'
          }
          if (item[key] === 'code') {
            this.basicData[key].placeholder = '自动生成'
          }
        }
      }
      for (const key in this.productData) {
        this.productData[key].disabled = false
        // const item = this.basicData[key]
        // if (item.itemType === 'select' && item.filterable) {
        //   this.productData[key].placeholder = '请输入文字模糊搜索'
        // } else if (item.itemType === 'select' && !item.filterable) {
        //   this.productData[key].placeholder = '请选择'
        // } else if (item.itemType === 'input') {
        //   this.productData[key].placeholder = '请输入'
        // }
      }
      if (this.$refs.dataSourceMix) {
        this.$set(this.$refs.dataSourceMix.dataSource[0], 'operates', this.operates)
      }
      this.versionOperates = {
        label: '操作',
        width: '120',
        fixed: 'right',
        dataSource: this.versionOperatesData
      }
      this.allOperates = {
        label: '操作',
        width: '120',
        fixed: 'right',
        dataSource: this.allOperatesData
      }
      this.productData._ingredient.disabled = true
      this.productData._dyeCraft.disabled = true
      this.productData._printCraft.disabled = true
      this.productData._suggestWidth.disabled = true
      this.productData._weightBefore.disabled = true
      this.materialDatasource && this.materialDatasource.forEach((item, index) => {
        item.edit = true
      })
      this.dataPretreatment(this.materialDatasource, 'code', 'material')
      // 字段加密
      this.encryptFn(this.basicData, this.orderData['_rule'], this.isEdit ? 'edit' : 'info')
      this.encryptFn(this.productData, this.orderData['_rule'], this.isEdit ? 'edit' : 'info')
      this.$set(this.productData._weightAfter, 'itemType', 'input')
      this.$set(this.productData._weightAfter, 'append', 'g/m²')
    },
    // 点击编辑时处理数据
    setFormDatas(params, type) {
      setTimeout(() => {
        if (type === 'version') { // 参板信息
          this.$set(this.versionPopOptions, 'formDatas', params)
        } else if (type === 'material') {
          this.$set(this.materialPopOptions, 'formDatas', params)
        } else if (type === 'all') {
          this.$set(this.allPopOptions, 'formDatas', params)
        } else if (type === 'naturalFiber') {
          this.$set(this.naturalFiberPopOptions, 'formDatas', params)
        } else if (type === 'chemicalFiber') {
          this.$set(this.chemicalFiberPopOptions, 'formDatas', params)
        } else if (type === 'shearingRequirements') {
          this.$set(this.shearingRequirementsPopOptions, 'formDatas', params)
        } else if (type === 'stripeSpacing') {
          this.$set(this.stripeSpacingPopOptions, 'formDatas', params)
        } else if (type === 'quantityDelivery') {
          this.$set(this.quantityDeliveryPopOptions, 'formDatas', params)
        }
      }, 0)
    },

    addOrder() {
      if (this.orderDataSource.length >= 100) {
        this.$message({ type: 'error', message: '最多可以增加到100行!' })
        return false
      }
      const data = {
        code: this.orderDataSource.length + 1,
        seq: this.status === '2' ? ++this.maxValue : this.orderDataSource.length + 1,
        garmentPart: undefined,
        cloth: {
          label: '',
          value: ''
        },
        edit: true
      }
      const orderLeft = this.$refs.dataSourceMix.dynamicValidateFormRuleForm.tableForm // 订单左侧表格
      let productData = this.$refs.productData.dynamicValidateFormRuleForm // 产品信息数据
      this.$set(this, 'orderDataSource', orderLeft)
      const materialData = this.$refs.materialData.dynamicValidateFormRuleForm.tableForm
      materialData && materialData.length && this.materialCopy && this.materialCopy.forEach((mitem, mindex) => {
        mitem.certificate = materialData[mindex].certificate ? materialData[mindex].certificate : ''
        mitem.supplierYarnCode = materialData[mindex].supplierYarnCode ? materialData[mindex].supplierYarnCode : ''
      })
      productData = {
        ingredient: productData.ingredient || '',
        ratio: productData.ratio || '',
        dryWay: productData.dryWay || '',
        shrinkL: productData.shrinkL || '',
        shrinkW: productData.shrinkW || '',
        printCraft: productData.printCraft || '',
        dyeCraft: productData.dyeCraft || '',
        suggestWidth: productData.suggestWidth || '',
        range: productData.range || '',
        weightBefore: productData.weightBefore || '',
        weightBeforeRange: productData.weightBeforeRange || '',
        weightAfter: productData.weightAfter || '',
        weightAfterRange: productData.weightAfterRange || '',
        weightBeforeUnit: 'g/m²',
        weightAfterUnit: 'g/m²',
        suggestWidthUnit: productData.suggestWidthUnit || '"',
        orderDetailId: productData.orderDetailId || '',
        orderId: productData.orderId || ''
      }
      this.InitialArray.colorQuantityDeliverySummary.unit = this.unitOptions[0]
      if (!this.$route.params.id) {
        const params = {
          ...orderLeft[this.rowIndex - 1],
          ...productData,
          referenceVersionInfo: this.versionData, //  参板信息数据
          colorQuantityDeliverySummary: { //  颜色数量交期汇总信息
            unit: this.unit,
            totalQuantity: this.totalQuantity,
            totalAmount: this.totalAmount,
            colorInfo: this.colorInfo.length ? this.colorInfo : []
          },
          materialInfo: this.materialCopy// 原料信息
        }
        this.orderDataSource.push(data)
        this.orderDataSource[this.rowIndex - 1] = { ...this.orderDataSource[this.rowIndex - 1], ...params }// 将页面上的数据复制给上一条
        this.orderDataSource[this.rowIndex] = { ...this.InitialArray, ...this.orderDataSource[this.rowIndex] }
        this.rowIndex = this.orderDataSource.length
        this.clearRowIndex()
        this.materialCopy = []
      } else {
        const params = {
          ...orderLeft[this.rowIndex - 1],
          ...productData,
          referenceVersionInfo: this.versionData, //  参板信息数据
          colorQuantityDeliverySummary: { //  颜色数量交期汇总信息
            summaryId: this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.summaryId,
            unit: this.unit,
            totalQuantity: this.totalQuantity,
            totalAmount: this.totalAmount,
            colorInfo: this.colorInfo.length ? this.colorInfo : []
          },
          // orderDetailId: '',
          materialInfo: this.materialCopy// 原料信息
        }
        this.orderDataSource.push(data)
        this.orderDataSource[this.rowIndex - 1] = { ...this.orderDataSource[this.rowIndex - 1], ...params }
        this.orderDataSource[this.orderDataSource.length - 1] = { ...this.InitialArray, ...this.orderDataSource[this.orderDataSource.length - 1] }
        this.rowIndex = this.orderDataSource.length
        this.clearRowIndex()
        this.materialCopy = []
      }
      console.log(this.orderDataSource)
      this.$set(this.dataSource[0], 'currentRowKey', this.rowIndex)
      this.setOrderDtail()
    },
    // 新增参板信息
    addReferenceVersionInfo() {
      if (this.versionData && this.versionData.length > 0) {
        this.$message({
          message: '参板只允许添加一条记录！',
          type: 'warning'
        })
        return false
      } else {
        this.isFirstSelect = true
        this.versionPopHandle('新增参板信息')
        // 新增的字段
        this.encryptFn(this.versionContent, this.orderData['_rule'], 'add')
        this.$set(this.versionPopOptions, 'content', this.versionContent)
        this.$set(this.versionPopOptions, 'formDatas', {})
      }
    },
    // 新增颜色&数量&交期
    addAllInfo() {
      this.editAll.maxQuantitySeq = 0
      this.editAll.orderId = ''
      this.$set(this.allContent._shearingRequirementsTableForm, 'dataSource', [])
      this.shearingRequirementsData = []
      this.$set(this.allContent._stripeSpacingTableForm, 'dataSource', [])
      this.stripeSpacingData = []
      this.$set(this.allContent._quantityDeliveryTableForm, 'dataSource', [])
      this.quantityDeliveryData = []
      // 字段加密
      this.$nextTick(() => {
        this.encryptFn(this.allContent, this.orderData['_rule'], 'add')
      })
      this.allPopHandle('新增颜色&数量&交期')
      this.$set(this.allPopOptions, 'content', this.allContent)
      this.$set(this.allPopOptions, 'formDatas', {})
    },
    // 参板信息弹窗显隐
    versionPopHandle(val) {
      this.$set(this.versionPopOptions, 'visible', !this.versionPopOptions.visible)
      if (val) {
        this.$set(this.versionPopOptions, 'title', val)
      }
    },
    // 颜色&数量&交期弹窗显隐
    allPopHandle(val) {
      this.$set(this.allPopOptions, 'visible', !this.allPopOptions.visible)
      if (val) {
        this.$set(this.allPopOptions, 'title', val)
      }
    },
    // 剪板要求、条纹间距、数量交期弹窗显隐
    popHandle(val, type) {
      if (val === '新增剪板要求') {
        this.$set(this.shearingRequirementsPopOptions, 'saveAndadd', this.saveAndadd)
      }
      if (val === '新增交期数量') {
        this.$set(this.quantityDeliveryPopOptions, 'saveAndadd', this.quantityAdd)
      }
      this.$set(this[`${type}PopOptions`], 'visible', !this[`${type}PopOptions`].visible)
      if (val) {
        this.$set(this[`${type}PopOptions`], 'title', val)
      }
      // 字段加密内容
      if (this[`${type}PopOptions`].visible) {
        this.encryptFn(this[`${type}Content`], this.orderData['_rule'], val && val.startsWith('新增') && 'add' || 'edit')
      }
      this.$set(this[`${type}PopOptions`], 'content', this[`${type}Content`])
      this.$set(this[`${type}PopOptions`], 'formDatas', {})
    },
    // 剪版要求弹窗显隐
    shearingRequirementsHandle(val) {
      this.$set(this.shearingRequirementsPopOptions, 'visible', !this.shearingRequirementsPopOptions.visible)
      if (val) {
        this.$set(this.shearingRequirementsPopOptions, 'title', val)
      }
    },
    // 保存坯布编码弹窗选中信息
    clothsavePop(params) {
      if (params && params.colorFabricCode) {
        this.$set(this.versionPopOptions.formDatas, 'referenceOrder', '')
        // 设置参板信息弹窗色布/印花布编码值
        this.$set(this.versionPopOptions.formDatas, 'greyClothCode', params.colorFabricCode)
        this.clothCodeData = params
        this.isshowCloth = false
      } else {
        this.$message({
          message: '请选择一条记录',
          type: 'warning'
        })
      }
    },
    // 关闭坯布编码弹窗
    closepop() {
      this.isshowCloth = false
    },
    // 保存数量交期色布/印花布编码弹窗选中信息
    colorSavePop(params) {
      // this.$set(this.allPopOptions.formDatas, 'greyClothCode', params.colorFabricCode)
      // this.$set(this.allPopOptions.formDatas, 'fabricColorNo', params.colorCode)
      // this.$set(this.allPopOptions.formDatas, 'fabricFlowerNo', params.flowerCode)
      if (params && params.colorFabricCode) {
        const newData = {
          greyClothCode: params.colorFabricCode,
          fabricColorNo: params.colorCode,
          fabricFlowerNo: params.flowerCode
        }
        this.$set(this.allPopOptions, 'formDatas', { ...this.allPopOptions.formDatas, ...newData })

        // 条纹间距数据
        params.spacing && params.spacing.forEach((item, index) => {
          item.seq = index + 1
        })
        this.$set(this.allContent._stripeSpacingTableForm, 'dataSource', params.spacing)
        this.isShowchoose = false
      } else {
        this.$message({
          message: '请选择一条记录',
          type: 'warning'
        })
      }
    },
    // 关闭色布/印花布编码弹窗
    closeChoosePop() {
      this.isShowchoose = false
    },
    // 智布花号列表
    async getFlowerNo(data = {}) {
      const res = await queryFlowerNoPage(data)
      if (this.$pub.responseValidate(res)) {
        this.tableData = res.data.list || []
      }
    },
    // 获取坯布编码列表数据
    async getcolorFabric(data = {}) {
      const res = await querycolorFabricPage(data)
      if (this.$pub.responseValidate(res)) {
        // let dyeTechname = ''
        // let printTechname = ''
        // const spacename = ''
        // const materialArry = []
        res.data && res.data.list.map((item, index) => {
          // dyeTechname = ''
          // printTechname = ''
          // spacename = ''
          item.fabrication = item.cloth.label // 布类
          item.ingredients = item.ingredient.label // 成份
          item.ingreradio = item.ingredient.label + ' ' + item.radio // 成份比例
          // item.dyeTech = JSON.parse(item.printTech)
          // item.dyeTech && item.dyeTech.forEach((dyeitem, dyeindex) => {
          //   if (dyeitem.name) {
          //     dyeTechname += dyeitem.name + ','
          //   }
          // })
          // item.dyeTech = dyeTechname.substring(0, dyeTechname.length - 1)

          // item.printTech = JSON.parse(item.printTech)
          // item.printTech && item.printTech.forEach((printitem, dyeindex) => {
          //   if (printitem.label) {
          //     printTechname += printitem.label + ','
          //   }
          // })
          // item.printTech = printTechname.substring(0, printTechname.length - 1)
          // if (item.spacing && item.spacing.length !== 0) {
          //   item.querycolorFabricPage && item.spacing.map((spaceitem, apaceindex) => {
          //     spacename += spaceitem.fabricColorNo + ' ' + spaceitem.height + 'cm' + ','
          //     return spacename
          //   })
          //   item.space = spacename.substring(0, spacename.length - 1)
          // } else {
          //   item.spacing = ''
          // }

          // item.materialInfo && item.materialInfo.forEach((mitem, mindex) => {
          //   if(mitem.naturalFiber && mitem.naturalFiber.length){

          //     mitem.naturalFiber.forEach((nitem, nindex) => {
          //       materialArry.push({

          //         code: mitem.yarnCode,
          //         yarn: nitem.yarn.label,
          //         element: nitem.element.label,
          //         elementRatio: nitem.elementRatio,
          //         yarnCategory: nitem.yarnCategory.label,
          //         edit: true
          //       })

          //     })
          //   }
          //   if(mitem.chemicalFiber && mitem.chemicalFiber.length){

          //     mitem.chemicalFiber.forEach((citem, cindex) => {
          //         materialArry.push({

          //           code: citem.yarnCode,
          //           yarn: citem.fineness.label,
          //           element: citem.element.label,
          //           yarnCategory: citem.wireCategory.label,
          //           edit: true
          //         })
          //     })
          //   }
          // })
          // item.materialArry = materialArry
        })
        this.colorFabricData = res.data.list || []
      }
      this.choosePagination = {
        ...this.choosePagination,
        dataTotal: res.data.total || 0,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize,
        pageSizes: [10, 20, 30, 40, 50, 100]
      }
      this.colorPagination = {
        ...this.colorPagination,
        dataTotal: res.data.total || 0,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize,
        pageSizes: [10, 20, 30, 40, 50, 100]
      }
    },
    // 关闭智布花号弹窗
    closeFlowerPop() {
      this.isshowFlower = false
    },
    // 保存智布花号
    saveFlowerPop(params) {
      this.$set(this.allPopOptions.formDatas, 'fabricFlowerNo', params)
      this.isshowFlower = false
    },
    // 产品信息
    setReferencePlate() {
      this.referencePlate = this.$refs.productData.dynamicValidateFormRuleForm
    },
    // 处理表格的合并的数据，找到要合并的数组
    // type: 原料 还是 交期做合并 prop: 根据哪个字段进行合并
    dataPretreatment(data, prop, type) {
      // 注意因为需要多次处理后台数据合并 所以合并前初始化这两个
      if (data && type === 'material') {
        this.rows = []
        this.pos = 0
        for (let i = 0; i < data.length; i++) {
          // data传入的表格数据源
          if (i === 0) {
            this.rows.push(1)
            this.pos = 0
          } else {
            if (data[i].hasOwnProperty(prop) && data[i][prop] && data[i - 1][prop]) {
              // 哪些数据是要合并的 合并的条件是什么
              if (data[i][prop] === data[i - 1][prop]) {
                this.rows[this.pos] += 1
                this.rows.push(0)
              } else {
                this.rows.push(1)
                this.pos = i
              }
            } else {
              this.rows.push(1)
              this.pos = i
            }
          }
        }
      } else if (data && type === 'color') {
        this.mergingRows = []
        this.mergingPos = 0
        for (let i = 0; i < data.length; i++) {
          // data传入的表格数据源
          if (i === 0) {
            this.mergingRows.push(1)
            this.mergingPos = 0
          } else {
            if (data[i].hasOwnProperty(prop) && data[i][prop] && data[i - 1][prop]) {
              // 哪些数据是要合并的 合并的条件是什么
              if (data[i][prop] === data[i - 1][prop]) {
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
      }
    },
    // spanMethod({ row, column, rowIndex, columnIndex }) {
    //   // 第一列
    //   if ([0].includes(columnIndex) && this.rows.length) {
    //     const _row = this.rows[rowIndex]
    //     const _col = _row > 0 ? 1 : 0
    //     return {
    //       rowspan: _row,
    //       colspan: _col
    //     }
    //   }
    // },
    // 颜色、数量、交期合并的方法
    spanAllMethod({ row, column, rowIndex, columnIndex }) {
      // 第一列
      if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 21].includes(columnIndex) && this.mergingRows.length) {
        const _row = this.mergingRows[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    setProDatBilIselect(object, num, type) { // 回显数据
      if (type === 'object') {
        this.$set(this.basicData[num], 'dataSource', object ? [object] : [])
      } else if (type === 'list') {
        this.$set(this.basicData[num], 'dataSource', object ? [object] : [])
      }
      //  else if (type === 'Array') {
      //    this.$set(this.basicData[num], 'dataSource', object || [])
      //  }
    },
    // 交期数量 根据填写的数量计算辅助数量 金额
    quantityDeliveryBlur(data) {
      const reg = /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{1,2})?$/
      if (!reg.test(data)) {
        return
      }
      const productInfo = this.$refs.productData.dynamicValidateFormRuleForm
      const colorBasic = this.$refs.allPop.$refs.popComponents.formDatas
      let suggestFabric = ''
      let weightBefore = ''
      let amountTax = ''
      let amount = ''
      let suggestWidth = ''
      suggestWidth = productInfo.suggestWidth ? productInfo.suggestWidth + '' : ''
      productInfo.suggestWidth = suggestWidth
      // if (productInfo.suggestWidth && productInfo.suggestWidth.includes('cm')) {
      //   productInfo.suggestWidth = parseFloat(productInfo.suggestWidth.substring(0, productInfo.suggestWidth.length - 2))
      // }
      weightBefore = productInfo.weightBefore ? productInfo.weightBefore + '' : ''
      productInfo.weightBefore = weightBefore
      // if (productInfo.weightBefore && productInfo.weightBefore.includes('g/m²')) {
      //   productInfo.weightBefore = parseFloat(productInfo.weightBefore.substring(0, productInfo.weightBefore.length - 4))
      // }
      if (productInfo.suggestWidth && productInfo.suggestWidthUnit && productInfo.weightBefore) {
        suggestFabric = productInfo.suggestWidthUnit && productInfo.suggestWidthUnit === '"' ? (productInfo.suggestWidth - 0 + 2) : (productInfo.suggestWidth / 2.54 + 2)
        weightBefore = productInfo.weightBefore
        let auxiliaryQuantity = 0
        switch (this.unit.label) {
          case '磅':
            auxiliaryQuantity = data / 2.2046
            break
          case '码':
            auxiliaryQuantity = data * suggestFabric * weightBefore * 0.00081925 / 16 / 2.2046
            break
          case '米':
            auxiliaryQuantity = data / 0.9144 * suggestFabric * weightBefore * 0.00081925 / 16 / 2.2046
            break
          default:
            auxiliaryQuantity = ''
            break
        }
        this.$set(this.quantityDeliveryPopOptions.formDatas, 'quantity', data)
        this.$set(this.quantityDeliveryPopOptions.formDatas, 'auxiliaryQuantity', auxiliaryQuantity === '' ? '' : this.$utils.getFloat(auxiliaryQuantity, 2))
      } else {
        this.$set(this.quantityDeliveryPopOptions.formDatas, 'auxiliaryQuantity', '')
        // this.$message({ type: 'error', message: '请先填写幅宽、克重' })
        // return
      }
      if (colorBasic && colorBasic.priceTax) {
        amountTax = data * colorBasic.priceTax
        this.$set(this.quantityDeliveryPopOptions.formDatas, 'amountTax', this.$utils.getFloat(amountTax, 2))
      }
      if (colorBasic && colorBasic.price) {
        amount = data * colorBasic.price
        this.$set(this.quantityDeliveryPopOptions.formDatas, 'amount', this.$utils.getFloat(amount, 2))
      }
      this.$set(this.quantityDeliveryPopOptions.formDatas, 'quantity', data)
    },

    // 颜色&数量&交期 单位与辅助数据计算
    // quantityUnitChange(unit) {
    //   const dataList = JSON.parse(JSON.stringify(this.colorInfo))
    //   const productInfo = this.$refs.productData.dynamicValidateFormRuleForm
    //   const suggestFabric = productInfo.suggestWidthUnit && productInfo.suggestWidthUnit === '"' ? (productInfo.suggestWidth - 0 + 2) : (productInfo.suggestWidth / 2.54 + 2)
    //   const weightBefore = productInfo.weightBefore
    //   dataList.forEach(it => {
    //     it.quantityDelivery && it.quantityDelivery.length && it.quantityDelivery.forEach((io) => {
    //       if (io.quantity) {
    //         if (unit === '磅') {
    //           io.auxiliaryQuantity = io.quantity / 2.2046
    //         } else if (unit === '码') {
    //           io.auxiliaryQuantity = io.quantity * suggestFabric * weightBefore * 0.00081925 / 16 / 2.2046
    //         } else if (unit === '米') {
    //           io.auxiliaryQuantity = io.quantity / 0.9144 * suggestFabric * weightBefore * 0.00081925 / 16 / 2.2046
    //         }
    //       }
    //       io.auxiliaryQuantity = io.auxiliaryQuantity ? this.$utils.getFloat(io.auxiliaryQuantity, 2) : ''
    //     })
    //   })
    //   this.colorInfoTemp = dataList
    //   this.colorInfo = dataList
    // },

    // 计算单价(含税)
    priceTaxBlur(data) {
      const reg = /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{1,4})?$/ // 2.3.0 注释
      if (!reg.test(data)) {
        // this.$set(this.allPopOptions.formDatas, 'price', '')
        return
      }
      const basicInfo = this.$refs.basicData.dynamicValidateFormRuleForm
      const colorBasic = this.$refs.allPop.$refs.popComponents.formDatas
      let price = 0
      if (data && basicInfo && basicInfo.taxRate) {
        price = data / (1 + (basicInfo.taxRate - 0) / 100)
        // this.$set(this.allPopOptions.formDatas, 'priceTax', data)
        // this.$set(this.allPopOptions.formDatas, 'price', this.$utils.getFloat(price, 4))
        this.allPopOptions.formDatas = { priceTax: data }
        this.allPopOptions.formDatas = { price: this.$utils.getFloat(price, 4) }
      } else if ((basicInfo && !basicInfo.taxRate) && colorBasic && colorBasic.price) {
        price = colorBasic.price
      }
      //  单价(含税)22222 单价(不含税) 改变 数量交期里面的分类数据 全部都要跟着改变 ==》不要可以删除
      const dan = data || 0
      if (this.quantityDeliveryData && this.quantityDeliveryData.length) {
        this.quantityDeliveryData.forEach((ix, im) => {
          ix.amountTax = dan * ix.quantity
          ix.amount = price * ix.quantity
        })
      }
    },
    // 计算单价(不含税)
    priceBlur(data) {
      const reg = /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{1,4})?$/ // 2.3.0 注释
      if (!reg.test(data)) {
        // this.$set(this.allPopOptions.formDatas, 'priceTax', '')
        return
      }
      const basicInfo = this.$refs.basicData.dynamicValidateFormRuleForm
      const colorBasic = this.$refs.allPop.$refs.popComponents.formDatas
      let priceTax = 0
      if (data && basicInfo && basicInfo.taxRate) {
        priceTax = data * (1 + (basicInfo.taxRate - 0) / 100)
        // this.$set(this.allPopOptions.formDatas, 'price', data)
        // this.$set(this.allPopOptions.formDatas, 'priceTax', this.$utils.getFloat(priceTax, 4))
        this.allPopOptions.formDatas = { price: data }
        this.allPopOptions.formDatas = { priceTax: this.$utils.getFloat(priceTax, 4) }
      } else if ((basicInfo && !basicInfo.taxRate) && colorBasic && colorBasic.priceTax) {
        priceTax = colorBasic.priceTax
      }
      const dan = data || 0
      if (this.quantityDeliveryData && this.quantityDeliveryData.length) {
        this.quantityDeliveryData.forEach((ix, im) => {
          ix.amount = dan * ix.quantity
          ix.amountTax = priceTax * ix.quantity
        })
      }
    },
    // 颜色&数量&交期单位
    unitChange(val) {
      this.unit = val
      this.totalQuantity = 0
      const productInfo = this.$refs.productData.dynamicValidateFormRuleForm
      let suggestFabric = ''
      let weightBefore = ''
      let suggestWidth = ''
      suggestWidth = productInfo.suggestWidth ? productInfo.suggestWidth + '' : ''
      productInfo.suggestWidth = suggestWidth
      weightBefore = productInfo.weightBefore ? productInfo.weightBefore + '' : ''
      productInfo.weightBefore = weightBefore
      if (productInfo.suggestWidth && productInfo.suggestWidthUnit) {
        suggestFabric = productInfo.suggestWidthUnit && productInfo.suggestWidthUnit === '"' ? (productInfo.suggestWidth - 0 + 2) : (productInfo.suggestWidth / 2.54 + 2)
      }
      this.colorInfoTemp && this.colorInfoTemp.length && this.colorInfoTemp.forEach(item => {
        item.quantityDelivery && item.quantityDelivery.length && item.quantityDelivery.forEach(items => {
          if (this.unit.label === '磅') {
            items.auxiliaryQuantity = items.quantity / 2.2046
          } else if (this.unit.label === '码' && suggestFabric) {
            items.auxiliaryQuantity = items.quantity * suggestFabric * weightBefore * 0.00081925 / 16 / 2.2046
          } else if (this.unit.label === '码' && !suggestFabric) {
            items.auxiliaryQuantity = ''
          } else if (this.unit.label === '米' && suggestFabric) {
            items.auxiliaryQuantity = items.quantity / 0.9144 * suggestFabric * weightBefore * 0.00081925 / 16 / 2.2046
          } else if (this.unit.label === '米' && !suggestFabric) {
            items.auxiliaryQuantity = ''
          } else {
            items.auxiliaryQuantity = ''
          }
          this.totalQuantity += items.auxiliaryQuantity
        })
      })
      this.colorInfo.forEach(item => {
        item.quantityDelivery && item.quantityDelivery.length && item.quantityDelivery.forEach(items => {
          if (this.unit.label === '磅') {
            items.auxiliaryQuantity = items.quantity / 2.2046
          } else if (this.unit.label === '码' && suggestFabric) {
            items.auxiliaryQuantity = items.quantity * suggestFabric * weightBefore * 0.00081925 / 16 / 2.2046
          } else if (this.unit.label === '码' && !suggestFabric) {
            items.auxiliaryQuantity = ''
          } else if (this.unit.label === '米' && suggestFabric) {
            items.auxiliaryQuantity = items.quantity / 0.9144 * suggestFabric * weightBefore * 0.00081925 / 16 / 2.2046
          } else if (this.unit.label === '米' && !suggestFabric) {
            items.auxiliaryQuantity = ''
          } else {
            items.auxiliaryQuantity = ''
          }
        })
      })
    },
    // 成衣部位的初始化
    editInputs(indexCom) {
      this.$set(this.columns._garmentPart.editOptions, 'disabled', indexCom)
      this.$set(this.columns._garmentPart.editOptions, 'readonly', indexCom)
    },
    versionInfoChange(val) {
      let arr = ''
      this.orderData.versionInfo.forEach((ix) => {
        if (ix.version === parseInt(val)) {
          arr = ix
        }
      })
      this.$emit('okversion', arr)
    },
    // 清空数据源
    SetIndexbaseFormDatas(type, num) {
      const basicInfo = this.$refs.basicData.dynamicValidateFormRuleForm
      this.$set(basicInfo, type, num)
      this.$nextTick(() => {
        this.$refs.basicData.form.clearValidate()
      })
    },
    // 设置 客样分析编号
    sampleAnalysisIdClick(val) {
      this.$nextTick(() => {
        if (this.orderData.demandSource && this.orderData.demandCode) { // 需求来源
          for (const key in this.basicData) {
            this.basicData[key].disabled = true
          }
          this.basicData._garmentFactory.disabled = false
          this.basicData._customerService.disabled = false
          this.basicData._taxRate.disabled = false
        }

        this.$refs.basicData.form.clearValidate()
      })
    },
    orderDataDis() {
      if (this.orderData.demandSource && this.orderData.demandCode) { // 需求来源
        for (const key in this.basicData) {
          this.basicData[key].disabled = true
        }
        this.basicData._garmentFactory.disabled = false
        this.basicData._customerService.disabled = false
        this.basicData._taxRate.disabled = false
      }
    },
    calculateAuxiliaryQuantity() {
      this.totalQuantity = 0
      const productInfo = this.$refs.productData.dynamicValidateFormRuleForm
      let suggestFabric = ''
      let weightBefore = ''
      let suggestWidth = ''
      let suggestWidthUnit = ''
      suggestWidth = productInfo.suggestWidth ? productInfo.suggestWidth : ''
      suggestWidthUnit = productInfo.suggestWidthUnit ? productInfo.suggestWidthUnit : ''
      weightBefore = productInfo.weightBefore ? productInfo.weightBefore : ''
      if (suggestWidth && suggestWidthUnit) {
        suggestFabric = suggestWidthUnit && suggestWidthUnit === '"' ? (suggestWidth - 0 + 2) : (suggestWidth / 2.54 + 2)
      } else {
        suggestFabric = ''
      }
      this.colorInfoTemp && this.colorInfoTemp.length && this.colorInfoTemp.forEach(item => {
        item.quantityDelivery && item.quantityDelivery.length && item.quantityDelivery.forEach(items => {
          if (this.unit.label === '磅') {
            items.auxiliaryQuantity = items.quantity / 2.2046
          } else if (this.unit.label === '码' && suggestFabric) {
            items.auxiliaryQuantity = items.quantity * suggestFabric * weightBefore * 0.00081925 / 16 / 2.2046
          } else if (this.unit.label === '码' && !suggestFabric) {
            items.auxiliaryQuantity = ''
          } else if (this.unit.label === '米' && suggestFabric) {
            items.auxiliaryQuantity = items.quantity / 0.9144 * suggestFabric * weightBefore * 0.00081925 / 16 / 2.2046
          } else if (this.unit.label === '米' && !suggestFabric) {
            items.auxiliaryQuantity = ''
          } else {
            items.auxiliaryQuantity = ''
          }
          this.totalQuantity += items.auxiliaryQuantity
        })
      })
      this.colorInfo.forEach(item => {
        item.quantityDelivery && item.quantityDelivery.length && item.quantityDelivery.forEach(items => {
          if (this.unit.label === '磅') {
            items.auxiliaryQuantity = items.quantity / 2.2046
          } else if (this.unit.label === '码' && suggestFabric) {
            items.auxiliaryQuantity = items.quantity * suggestFabric * weightBefore * 0.00081925 / 16 / 2.2046
          } else if (this.unit.label === '码' && !suggestFabric) {
            items.auxiliaryQuantity = ''
          } else if (this.unit.label === '米' && suggestFabric) {
            items.auxiliaryQuantity = items.quantity / 0.9144 * suggestFabric * weightBefore * 0.00081925 / 16 / 2.2046
          } else if (this.unit.label === '米' && !suggestFabric) {
            items.auxiliaryQuantity = ''
          } else {
            items.auxiliaryQuantity = ''
          }
        })
      })
    },

    // 加密字段formater处理
    encryptedFieldFormater(field) {
      let tempField
      if ((field + '').indexOf('***') !== -1) {
        tempField = this.currencyCode + field
      } else {
        tempField = field ? this.currencyCode + this.$utils.priceFormat(this.$utils.getFloat(field, 2)) : ''
      }
      return tempField
    },
    clearRowIndex() {
      if (this.$route.query && this.$route.query.rowIndex) {
        const com = this.$route.path
        this.$router.push({ path: com, query: {}})
      }
    }
  }
}
</script>

<style lang="scss">
  .goods-detail {
    .table-item {
      background: #ffffff;
      margin: 20px 20px 0;
      margin-bottom: 20px;
      .header-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 20px 20px 15px 20px;
        span {
          font-size: 16px;
          display: flex;
          // font-weight: 500;
        }
        .el-button {
          display: flex;
          span {
            font-size: 14px;
          }
        }
      }
      .basic-top {
        border-bottom: 1px solid #EEEFF0;
        margin-bottom: 20px;
      }
    }

    .el-input.is-disabled .el-input__inner {
      color: #666666;
    }
    .el-form--inline .el-form-item {
      margin-right: 0;
    }
    .pop .el-form--inline .el-form-item {
      margin-right: 30px;
    }
    .detailClass .el-input__inner {
      padding: 0;
      border: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      background: #fff;
      font-size: 14px;
    }
    .detailClass .el-form-item {
      margin-bottom: 14px;
    }
    .editClass .el-form-item {
      margin-bottom: 20px;
    }
    .detailClass .el-input__icon {
      display: none;
    }
    .editClass .hideInput .el-input__inner {
      padding: 0;
      border: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      background: #fff;
      font-size: 14px;
    }
    .editClass .hideInput .el-form-item {
      margin-bottom: 14px;
    }
    .editClass .hideInput .el-input__icon {
      display: none;
    }
    .basic-data .el-input.is-disabled .el-input__suffix {
      display: none;
    }
    .basic-data {
      margin-top: 0;
      padding-bottom: 20px;
    }
    .order-info {
      display: flex;
      flex-direction: column;
      margin: 0 20px;
      .order-header {
        background: #ffffff;
        padding: 20px;
        border-bottom: 1px solid #EEEFF0;
      }
      .order-content {
        display: flex;
        flex-direction: row;
        .info-left {
          width: 310px;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border-right: 1px solid #EEEFF0;
          .top {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            padding: 15px;
          }
          .bottom {
            padding-left: 10px;
            .custom-form {
              margin: 0;
            }
          }
        }
        .info-right {
          width: calc(100% - 310px);
          display: flex;
          flex: 1;
          flex-direction: column;
          .top {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            .left {
              display: flex;
              span {
                font-size: 15px;
                color: #151222;
              }
            }
            .right {
              display: flex;
              .el-form-item {
                margin-bottom: 0;
              }
            }
          }
          .order-item {
            background: #ffffff;
            .header-top {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              padding: 20px 20px 15px 20px;
              span {
                font-size: 16px;
                display: flex;
                // font-weight: 500;
              }
              .el-button {
                display: flex;
                span {
                  font-size: 14px;
                }
              }
              .left {
                display: flex;
                align-items: center;
                .title {
                  margin-right: 40px;
                }
                .date-title {
                  position: relative;
                  .item-title::before {
                    display: block;
                    content: '*';
                    position: absolute;
                    left: -8px;
                    color: #FF4444;
                  }
                }
              }
              .right {
                display: flex;
                align-items: center;
                .total {
                  margin: 0 80px;
                }
              }
            }
            .page-table {
              height: auto;
            }
            .product-item {
              .custom-form {
                margin: 0 20px;
              }
            }
            /deep/ .material-datainfo .cell{
               font-size: 14px;
            }

          }
          /deep/ .viewStyle .el-form-item__label{
            width: 77px !important;
          }
        }
      }
    }
    .addGoodsButton {
      display: block;
      width: 60px;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      border-radius: 3px;
      color: #FFFFFF;
      background: #1890ff;
      text-align: center;
      outline: none;
      margin: 0;
      cursor: pointer;
    }
    .titleView {
      width: 48%;
      font-size: 14px;
      font-weight: 600;
      display: inline-block;
      background: #F5F5F5;
      padding: 5px 0 5px 13px;
      margin-bottom: 20px;
      // position: relative;
    }
    // .titleView::before {
    //   display: block;
    //   content: '*';
    //   position: absolute;
    //   left: 15px;
    //   color: #FF4444;
    // }
    .lableStyle::before {
      content: "*";
      margin-right: 4px;
      color: red;
    }
    .noLableStyle::before{
      display: none;
    }
    .greylableStyle::before {
      content: "*";
      margin-right: 4px;
      color: red;
    }
    .nogreyLableStyle::before{
      display: none;
    }
    .item-title::before {
      content: "*";
      margin-right: 4px;
      color: red;
    }
    .date-title{
      display: inline-block;
      .el-input--medium .el-input__inner{
        height: 32px;
        line-height: 32px;
      }
    }
    .data-font{
      font-size: 14px !important;
      color: #606266;
    }
    .table .el-table .el-table__row.heightRow {
      cursor: pointer;
    }
    .table .el-table .el-table__row.current-row.heightRow {
      > td {
        color: #666;
        background-color: #d8eafd !important;
      }
    }
    .yarn-style{
     text-overflow: ellipsis;
     overflow: hidden;
    //  width: 100%;
     max-width: 300px;
     white-space: nowrap;
     color: #666666;
    }
  }
</style>
<style lang="scss">
.goods-detail{
  // .viewStyle .el-form-item__label{
  //   width: 77px !important;
  // }
  .table tr:nth-child(even){
      background-color: #fff !important;
      }
      .el-table .cell{
        font-size: 14px;
      }
  .material-datainfo{
      .table tr:nth-child(even){
      background-color: #fff !important;
      }
      .el-table .cell{
        font-size: 14px;
      }
  }
  .leftTableForm {
    .el-table--medium td {
      padding: 10px 0 0;
    }
    .el-table__body-wrapper .cell {
      padding: 12px 10px;
    }
    .el-table__header .ruleTip .cell::before {
      display: block;
      content: '*';
      position: absolute;
      left: 4px;
      color: #FE4949;
    }
  }
  .leftTableForm th.is-leaf {
    border-bottom: 1px solid #dfe6ec!important;
  }
  .printPic {
    width: 36px;
    height: 36px;
  }
  .material-datainfo .el-table--mini td {
    padding: 12px 0;
  }
  .page-table tbody .el-table__row td {
    border-bottom: 1px solid #dfe6ec;
  }
  // .noBottomBorder {
  //   tbody {
  //     .el-table__row:hover {
  //       background-color: rgba(0, 0, 0, 0) !important;
  //     }
  //     tr:hover>td {
  //       background-color:#fff !important;
  //     }

  //     .el-table__row {
  //       td {
  //         border-bottom: 0px solid #EEEFF0;
  //       }
  //     }
  //   }
  //   th.is-leaf {
  //     border-bottom: 0px solid #EEEFF0;
  //   }
  //   &::before {
  //     height: 0px;
  //   }
  //   .el-table__header-wrapper th, .el-table__body td {
  //     padding: 5px;
  //   }
  // }
}

</style>

<style lang="scss" scoped>
  /deep/ .quantity-delivery .el-form {
    display: flex;
    flex-wrap: wrap;
  }
  .versionClass{
    margin-left: 20px;
    width: 80px;
    display: flex;
  }
</style>
