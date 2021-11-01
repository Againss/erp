<template>
  <div ref="orderDetailCom" class="order-detail">
    <!-- 基本信息 -->
    <div class="table-item basic-data">
      <div class="header-top basic-top" style="justify-content: left;">
        <span>基本信息</span>
        <div v-if="orderData.versionInfo&&!isEdit" class="versionClass">
          <el-select v-model="versionInfoLength" filterable placeholder="请选择" @change="versionInfoChange">
            <el-option
              v-for="item in orderData.versionInfo"
              :key="item.version"
              :label="'v'+item.version"
              :value="item.version"
            />
          </el-select>
        </div>
      </div>
      <cs-custom-form ref="basicData" :class="getEditClass" :data-source="basicData" :options="formOptions" :form-datas="baseFormDatas" />
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
          <div class="top">
            <div v-show="!isEdit||(orderData.demandSource && orderData.demandCode)" class="left">
              <span>客样分析编号: {{ getSampleAnalysisResultId() }}</span>
            </div>
            <div v-show="isEdit&&(!orderData.demandSource&&!orderData.demandCode)" class="right">
              <el-form ref="ruleForm" :model="ruleForm" :rules="rules" inline>
                <el-form-item label="客样分析编号" prop="sampleAnalysisResultId">
                  <el-select v-model="ruleForm.sampleAnalysisResultId" filterable clearable placeholder="请选择" @change="analysisIdChange">
                    <el-option
                      v-for="item in sampleAnalysisResultOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <!-- 参板信息 -->
          <div class="order-item">
            <div class="header-top">
              <span>参板信息</span>
              <el-button v-if="isEdit" type="primary" size="mini" @click="addReferenceVersionInfo">新增</el-button>
            </div>
            <div class="page-table">
              <cs-custom-table
                ref="versionData"
                tooltip-effect="light"
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
          <div class="order-item product-item" style="padding-bottom: 20px;">
            <div class="header-top">
              <span class="header-top-sapn" style="width: 100%;padding-bottom: 15px;border-bottom: 1px solid #efefef;">产品信息</span>
            </div>
            <cs-custom-form ref="productData" :class="getEditClass" :data-source="productData" :options="formOptions" :form-datas="formDatas" />
          </div>
          <!-- 原料信息 -->
          <div class="order-item">
            <div class="header-top">
              <span>原料信息</span>
              <el-button v-if="isEdit" type="primary" size="mini" @click="addMaterialInfo">新增</el-button>
            </div>
            <div class="page-table page-table-border">
              <cs-custom-table
                ref="materialData"
                tooltip-effect="light"
                :header-cell-style="headerCellStyle"
                :columns="materialColumns"
                :data-source="materialData"
                :operates="materialOperates"
                :pagination="pagination"
                :span-method="spanMethod"
                edit-type="pop"
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
                  <el-select v-model="unit" :disabled="!isEdit" value-key="value" placeholder="请选择" @change="unitChange">
                    <el-option
                      v-for="item in unitOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item"
                    />
                  </el-select>
                </div>
              </div>
              <div class="right">
                <div class="date-title">
                  <span class="data-font">总数量：{{ this.$utils.priceFormat(this.$utils.getFloat(totalQuantity, 2)) || '' }} {{ totalQuantity ? unit.label : '' }}</span>
                </div>
                <div class="date-title">
                  <span class="data-font total">总金额(含税)：{{ currencyCode + this.$utils.priceFormat(this.$utils.getFloat(totalAmount, 2)) || '' }}</span>
                </div>
                <el-button v-if="isEdit" type="primary" size="mini" @click="addAllInfo">新增</el-button>
              </div>
            </div>
            <div class="page-table">
              <cs-custom-table
                ref="allColumnslData"
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
    <!-- 原料信息弹窗 -->
    <div class="pop">
      <cs-custom-pop ref="materialPop" :options="materialPopOptions" />
    </div>
    <!-- 天然纤维弹窗 -->
    <div class="pop">
      <cs-custom-pop ref="naturalFiberPop" :options="naturalFiberPopOptions" />
    </div>
    <!-- 化学纤维弹窗 -->
    <div class="pop">
      <cs-custom-pop ref="chemicalFiberPop" :options="chemicalFiberPopOptions" />
    </div>
    <!-- 颜色、数量、交期弹窗 -->
    <div class="pop allPop">
      <cs-custom-pop ref="allPop" :options="allPopOptions" />
    </div>
    <!-- 剪版要求弹窗 -->
    <div class="pop">
      <cs-custom-pop ref="shearingRequirementsPop" :options="shearingRequirementsPopOptions" />
    </div>
    <!-- 条纹间距弹窗 -->
    <div class="pop">
      <cs-custom-pop ref="stripeSpacingPop" :options="stripeSpacingPopOptions" />
    </div>
    <!-- 数量交期弹窗 -->
    <div class="pop">
      <cs-custom-pop ref="quantityDeliveryPop" :options="quantityDeliveryPopOptions" />
    </div>
    <!-- 选择弹窗 -->
    <div class="pop">
      <choose-pop :title="chooseTitle" :search-data="chooseSearch" :pagination="choosePagination" :columns="chooseColumns" :is-visible.sync="isshowCloth" :table-data="tableData" @closePop="closePop" @savePop="savePop" @saveListRow="saveListRow" />
    </div>
  </div>
</template>

<script>
import choosePop from '../../../public/components/choosePop'
import proCustom from '../../../public/components/pro-ratio'
import techRquire from '../../../public/components/tech-require'
import preview from '../../../public/components/preview'
import picPreview from '../../../public/components/picPreview'
import shearingShow from '../../../public/components/shearingShow'
import { PublicCustomer } from '@/views/customer-order/public/index'
import popProportion from './pop-proportion'
import { queryColorNoPage, queryFlowerNoPage, techgetDetail } from '../api/index'
export default {
  name: 'OrderRequest',
  components: {
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
      'margin-right': '2%'
    }
    const headerTitleRightStyle = {
      'margin-left': '2%'
    }
    // 公用下拉验证
    // const commonSelect = (rule, value, callback) => {
    //   if (value) {
    //     if (!value.label || !value.value) {
    //       return callback(new Error('下拉选项必填'))
    //     }
    //   } else {
    //     callback()
    //   }
    // }
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 最大值99的校验
    const checkNum = (rule, value, callback) => {
      const reg = /^[1-9]\d*$/
      if (!value) {
        return callback(new Error('必填项不能为空'))
      } else if (value === 0 || !reg.test(value)) {
        return callback(new Error('请填写正整数'))
      } else if (value > 99) {
        return callback(new Error('最大值99'))
      } else {
        callback()
      }
    }
    // 最大99.99正则
    const max99Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,1})|(0{1}))(\.\d{1,2})?$/, message: '0~99.99', trigger: ['blur'] })
    // 最大999.99正则
    const max999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,2})?$/, message: '0~999.99', trigger: ['blur'] })
    const max9999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,3})|(0{1}))(\.\d{1,2})?$/, message: '0~9999.99', trigger: ['blur'] })
    const ismax999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,7})|(0{1}))(\.\d{1,2})?$/, message: '0~99999999.99', trigger: ['blur'] })
    const max999Regtype = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{1,4})?$/, message: '0~9999999999.9999', trigger: ['blur'] })

    // 当前时间之前的时间不能选择
    const pickerOptionsBefore = {
      disabledDate(time) {
        return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
      }
    }
    const baseData = {
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
        rules: [{ required: true, message: '订单类型不能为空', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '订单类型' }, 'orderType')
          }
        },
        dataSource: []
      },
      _brand: {
        prop: 'brand',
        itemType: 'select',
        className: 'commonRemoteSearch',
        itemStyle: { 'width': '25%' },
        style: { 'width': '60%' },
        placeholder: '输入文字模糊查询',
        label: '品牌商:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        filterable: true,
        rules: [{ required: true, message: '品牌商不能为空', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
          console.log(value)
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
        className: 'commonRemoteSearch',
        itemStyle: { 'width': '25%' },
        style: { 'width': '60%' },
        placeholder: '输入文字模糊查询',
        label: '客户:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        filterable: true,
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
        className: 'commonRemoteSearch',
        itemStyle: { 'width': '25%' },
        style: { 'width': '60%' },
        placeholder: '输入文字模糊查询',
        label: '制衣厂:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        filterable: true,
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
        className: 'commonRemoteSearch',
        itemStyle: { 'width': '25%' },
        style: { 'width': '60%' },
        placeholder: '输入文字模糊查询',
        label: '销售团队:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        filterable: true,
        rules: [{ required: true, message: '销售团队不能为空', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getSellTeamSelect('salesTeam')
          }
        },
        dataSource: []
      },
      _seller: {
        prop: 'seller',
        itemType: 'select',
        className: 'commonRemoteSearch',
        itemStyle: { 'width': '25%' },
        style: { 'width': '60%' },
        placeholder: '输入文字模糊查询',
        label: '销售员:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        filterable: true,
        rules: [{ required: true, message: '销售员不能为空', trigger: 'change' }],
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
        className: 'commonRemoteSearch',
        itemStyle: { 'width': '25%' },
        style: { 'width': '60%' },
        placeholder: '输入文字模糊查询',
        label: '客服:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        filterable: true,
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
        clearable: true,
        disabled: true,
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
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '销售季度' }, 'baseData')
          }
        },
        dataSource: []
      },
      _isSettlement: {
        prop: 'isSettlement',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '是否结算:',
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '是否结算不能为空', trigger: 'change' }],
        change: (value) => {
          this.isSettlement(value)
          this.SetAmount()// 改变税率  是否结算 需要清空值
        },
        visibleChange: (value) => {
        },
        dataSource: [
          {
            label: '是',
            value: 1
          },
          {
            label: '否',
            value: 0
          }
        ]
      }
    }
    const addData = {
      _currency: {
        prop: 'currency',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '币别:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '币别不能为空', trigger: 'change' }],
        change: (value) => {
          // this.knitDyeChange(value)
          if (!value) {
            this.currencyCode = ''
            return
          }
          this.currencyDatas.forEach(item => {
            if (item.value === value.value) {
              // debugger
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
        clearable: true,
        disabled: true,
        rules: [commonBlurReg, max9999Reg],
        change: (value) => {
          const that = this
          console.log('input taxRate', value)
          setTimeout(() => {
            that.SetAmount()
          }, 60)
        }
      },
      _pricingTerm: {
        prop: 'pricingTerm',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '价格条款:',
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
    // 产品信息
    const productData = {
      _dryWay: {
        prop: 'dryWay',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '33%' },
        label: '干燥方式',
        valueType: 'object',
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '干燥方式不能为空', trigger: 'change' }],
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
      _dyeCraft: {
        prop: 'dyeCraft',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '33%' },
        style: { 'width': '61%' },
        label: '染整工艺',
        valueType: 'object',
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '染整工艺不能为空', trigger: 'change' }],
        title: true,
        components: { techRquire },
        componentsOptions: {
          checkValList: [],
          ok: (checkValList) => {
            console.log(checkValList)
            this.$set(this.productData._dyeCraft.componentsOptions, 'checkValList', checkValList)
            this.formDatas = { dyeCraft: checkValList }
          }
        }
      },
      _shrinkL: {
        prop: 'shrinkL',
        itemType: 'input',
        itemStyle: { 'width': '16%' },
        label: '缩水(LxW)',
        disabled: true,
        rules: [commonBlurReg, { required: true, validator: checkNum, trigger: 'blur' }]
      },
      _shrinkX: {
        itemType: 'view',
        style: { display: 'inline-block', height: '32px', 'line-height': '32px', 'margin': '0 6px', color: '#666666' },
        text: 'X'
      },
      _shrinkW: {
        prop: 'shrinkW',
        itemType: 'input',
        itemStyle: { 'width': '8%' },
        label: '',
        labelWidth: '0',
        disabled: true,
        rules: [commonBlurReg, { required: true, validator: checkNum, trigger: 'blur' }]
      },
      _printCraft: {
        prop: 'printCraft',
        itemType: 'select',
        className: 'commonRemoteSearch',
        itemStyle: { 'width': '33%' },
        style: { 'width': '60%' },
        placeholder: '输入文字模糊查询',
        label: '印花工艺',
        valueType: 'object',
        clearable: true,
        disabled: true,
        multiple: true,
        filterable: true,
        // rules: [{ required: true, message: '印花工艺不能为空', trigger: 'change' }],
        visibleChange: (value, val) => {
          if (value) {
            // this.setReferencePlate()
            this.getPrintCraftSelect('product')
          }
        },
        dataSource: []
      },
      _ingredient: {
        prop: 'ingredient',
        itemType: 'select',
        itemStyle: { 'width': '18%' },
        label: '成份/比例',
        valueType: 'object',
        disabled: true,
        // readonly: true,
        filterable: true,
        clearable: true,
        remote: true,
        className: 'commonRemoteSearch',
        placeholder: '输入文字模糊查询',
        rules: [{ required: true, message: '成份/比例不能为空', trigger: 'change' }],
        dataSource: [],
        change: (value, form, formDatas, setFormDatas) => {
          if (formDatas.ingredient.names.split('/').length > 1) {
            setFormDatas({ ratio: '' })
          } else {
            setFormDatas({ ratio: '100' })
          }
        },
        visibleChange: (flag) => {
          if (flag) {
            this.getCompositionSelect('product')
          }
        }
      },
      _ratio: {
        components: {
          proCustom
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
        itemType: 'input',
        itemStyle: { 'width': '38%', 'margin-right': '1%' },
        label: '成品幅宽',
        rules: [commonBlurReg, max999Reg],
        clearable: true,
        disabled: true,
        blur: (event, form, formDatas, setFormDatas, scope) => {
          this.formDatas = { ...formDatas, suggestWidth: event.target.value }
          // this.suggestWidthChange(event.target.value)
          this.calculateAuxiliaryQuantity(event.target.value, 'suggestWidth')
        },
        clear: (form, formDatas, setFormDatas, scope) => {
          this.formDatas = { ...formDatas, suggestWidth: null }
          // this.suggestWidthChange('')
          this.calculateAuxiliaryQuantity('', 'suggestWidth')
        }
      },
      _suggestWidthUnit: {
        prop: 'suggestWidthUnit',
        itemType: 'select',
        itemStyle: { 'width': '9%' },
        label: '',
        labelWidth: '0',
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '"',
            value: '"'
          },
          {
            label: 'cm',
            value: 'cm'
          }
        ],
        change: (value, form, formDatas, setFormDatas) => {
          this.formDatas = { ...formDatas, suggestWidthUnit: value }
          // this.suggestWidthUnitChange(value)
          this.calculateAuxiliaryQuantity(value, 'suggestWidthUnit')
        }
      },
      _weightBefore: {
        prop: 'weightBefore',
        itemType: 'input',
        itemStyle: { 'width': '32%', 'margin-left': '4%' },
        label: '克重',
        rules: [commonBlurReg, max9999Reg],
        clearable: true,
        disabled: true,
        blur: (event, form, formDatas, setFormDatas, scope) => {
          this.formDatas = { ...formDatas, weightBefore: event.target.value }
          // this.weightBeforeChange(event.target.value)
          this.calculateAuxiliaryQuantity(event.target.value, 'weightBefore')
        },
        clear: (form, formDatas, setFormDatas, scope) => {
          this.formDatas = { ...formDatas, weightBefore: null }
          // this.weightBeforeChange('')
          this.calculateAuxiliaryQuantity('', 'weightBefore')
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
          this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '公差范围(幅宽)' }, 'range')
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
          this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '公差范围(克重)' }, 'weightBeforeRange')
        },
        dataSource: []
      },
      _weightAfterView: {
        itemType: 'view',
        className: 'titleView noBefore',
        style: headerTitleLeftStyle,
        text: '成品克重（洗后）'
      },
      _weightAfterView1: {
        itemType: 'view',
        style: { width: '48%' },
        text: ''
      },
      _weightAfter: {
        prop: 'weightAfter',
        itemType: 'input',
        itemStyle: { 'width': '32%' },
        label: '克重',
        clearable: true,
        disabled: true
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
          this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '公差范围(克重)' }, 'weightAfterRange')
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
        className: 'ruleTip',
        itemType: 'table-form',
        editOptions: {
          labelWidth: '0',
          itemType: 'select',
          className: 'commonRemoteSearch',
          valueType: 'object',
          valueKey: 'value',
          placeholder: '输入文字模糊查询',
          clearable: true,
          filterable: true,
          disabled: true,
          readonly: true,
          rules: [
            {
              required: true,
              message: '成衣部位不能为空',
              trigger: ['change']
            }
          ],
          visibleChange: (value) => {
            if (value) {
              this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '成衣部位' }, 'garmentPart')
            }
          },
          focus: (e, scope) => {
            if (this.isEdit && this.rowIndex !== scope.$index + 1) {
              this.saveRowData()
            }
            // this.rowIndex = scope.$index + 1
            // this.setOrderDtail()
            if (this.rowIndex !== scope.$index + 1) {
              this.rowIndex = scope.$index + 1
              this.clearRowIndex()
              // this.$set(this.dataSource[0], 'currentRowKey', this.rowIndex)
              this.setOrderDtail()
            }
          },
          dataSource: []
        }
      },
      _cloth: {
        prop: 'cloth',
        label: '布类',
        className: 'ruleTip',
        // showOverflowTooltip: true,
        editOptions: {
          labelWidth: '0',
          itemType: 'select',
          className: 'commonRemoteSearch',
          valueType: 'object',
          valueKey: 'value',
          placeholder: '输入文字模糊查询',
          clearable: true,
          filterable: true,
          disabled: true,
          readonly: true,
          rules: [
            {
              required: true,
              message: '布类不能为空',
              trigger: ['change']
            }
          ],
          visibleChange: (value) => {
            if (value) {
              this.getClothSelect()
            }
          },
          focus: (e, scope) => {
            if (this.isEdit && this.rowIndex !== scope.$index + 1) {
              this.saveRowData()
            }
            // this.rowIndex = scope.$index + 1
            // this.setOrderDtail()
            if (this.rowIndex !== scope.$index + 1) {
              this.rowIndex = scope.$index + 1
              // this.$set(this.dataSource[0], 'currentRowKey', this.rowIndex)
              this.setOrderDtail()
              this.clearRowIndex()
            }
          },
          dataSource: []
        }
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
            this.saveRowData()
            console.log(this.orderDataSource)
            if (this.orderDataSource.length <= 1) {
              this.$message({ type: 'warning', message: '至少保留一条' })
            } else {
              this.$confirm('确认删除该条订单信息数据？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'btn-cancel'
              })
                .then(() => {
                  this.orderDataSource.splice(scope.$index, 1)
                  this.RawMaterialArray.splice(scope.$index, 1)// xj
                  console.log(this.status)
                  if (this.status !== '2') {
                    this.orderDataSource.length && this.orderDataSource.forEach((item, index) => {
                      // newValue--
                      item.seq = index + 1
                      item.code = index + 1
                    })
                  }
                  console.log(this.orderDataSource)
                  this.rowIndex = this.orderDataSource.length
                  this.setOrderDtail()
                  this.clearRowIndex()
                  console.log(this.rowIndex)
                  this.$set(this.dataSource[0], 'currentRowKey', this.rowIndex)
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
        garmentPart: null,
        cloth: null,
        edit: true,
        sampleAnalysisResultId: '', // 客样分析编号
        ingredient: null, // 成份
        ratio: null, // 比例
        dryWay: null, // dryWay
        shrinkL: null, // 缩水(LxW)
        shrinkW: null, // 缩水(LxW)
        printCraft: null, // 印花工艺{JSON}
        dyeCraft: null, // 染整工艺{JSON}
        suggestWidth: null, // 成品幅宽
        suggestWidthUnit: '"', // 成品幅宽单位{固定选项："和CM}
        range: null, // 公差范围
        weightBefore: null, // 成品克重（洗前）
        weightBeforeUnit: null, // 成品克重单位（洗前）{固定值：GM²}
        weightBeforeRange: null, // 成品克重公差范围（洗前）
        weightAfter: null, // 成品克重（洗后）
        weightAfterUnit: null, // 成品克重单位（洗后）{固定值：GM²}
        weightAfterRange: null, // 成品克重公差范围（洗后）
        referenceVersionInfo: [],
        colorQuantityDeliverySummary: {
          maxColorSeq: null,
          unit: null, // 单位
          totalQuantity: null, // 总数量
          totalAmount: null, // 总金额
          colorInfo: []
        }
      }
    ]
    // 左侧订单form
    const dataSource = [
      {
        prop: 'tableForm',
        itemType: 'table-form',
        tooltipEffect: 'light',
        dataSource: orderDataSource,
        className: 'leftTableForm',
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        size: 'mini',
        columns: columns,
        operates: operates,
        rowKey: 'code',
        currentRowKey: 0,
        highlightCurrentRow: true,
        rowClassName: 'heightRow',
        rowClick: (scope) => {
          this.newValue = 0
          this.newColorValue = 0
          this.newColorChildValue = 0
          if (this.isEdit) {
            this.saveRowData()
          }
          this.rowIndex = scope.code
          this.setOrderDtail()
          this.clearRowIndex()
        }
      }
    ]
    // 参板信息
    const versionColumns = {
      _referenceOrder: {
        prop: 'referenceOrder',
        label: '订单号',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.referenceOrder && scope.row.referenceOrder.label ? scope.row.referenceOrder.label : ''
        }
      },
      _greyClothCode: {
        prop: 'greyClothCode',
        label: '坯布/色布/印花布编码',
        minWidth: '160',
        showOverflowTooltip: true
        // formater: (scope) => {
        //   return scope.row.greyClothCode && scope.row.greyClothCode.label ? scope.row.greyClothCode.label : ''
        // }
      },
      _referenceContent: {
        prop: 'referenceContent',
        label: '参考内容',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.referenceContent && scope.row.referenceContent.label ? scope.row.referenceContent.label : ''
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
          this.$set(this.versionContent._referenceOrder, 'dataSource', scope.row.referenceOrder && scope.row.referenceOrder.value ? [scope.row.referenceOrder] : '')
          this.$set(this.versionContent._greyClothCode, 'dataSource', scope.row.greyClothCode && scope.row.greyClothCode.value ? [scope.row.greyClothCode] : '')
          this.$set(this.versionContent._referenceContent, 'dataSource', scope.row.referenceContent && scope.row.referenceContent.value ? [scope.row.referenceContent] : '')
          this.encryptFn(this.versionContent, this.orderData['_rule'], 'edit')
          this.versionPopHandle('编辑参板信息')
          this.setFormDatas({ ...scope.row }, 'version')
        }
      },
      {
        label: '删除',
        isShow: true,
        style: { 'color': '#FE4949' },
        handle: scope => {
          this.$confirm('确认删除该条参板信息数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            cancelButtonClass: 'btn-cancel'
          })
            .then(() => {
              this.versionData.splice(scope.$index, 1)
            })
            .catch(() => {
              this.$message({ type: 'info', message: '已取消删除' })
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
    // 原料信息
    const materialColumns = {
      _type: {
        prop: 'type',
        label: '类型',
        isShow: false
      },
      _yarn: {
        prop: 'yarn',
        label: '纱支/细度',
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
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.element && scope.row.element.label ? scope.row.element.label : ''
        }
      },
      _elementRatio: {
        prop: 'elementRatio',
        label: '比例(%)',
        showOverflowTooltip: true
      },
      _yarnCategory: {
        prop: 'yarnCategory',
        label: '纱类/丝类',
        showOverflowTooltip: true,
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
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.certificate && scope.row.certificate.label ? scope.row.certificate.label : ''
        }
      },
      _supplierYarnCode: {
        prop: 'supplierYarnCode',
        label: '供应商纱线编码',
        showOverflowTooltip: true,
        maxlength: 50,
        formater: (scope) => {
          return scope.row.supplierYarnCode || ''
        }
      }
    }
    const materialOperatesData = [
      {
        label: '编辑',
        isShow: true,
        className: 'leftForm858',
        handle: scope => {
          this.tab = scope.row.type.toString()
          this.tabChange(this.tab)
          if (this.tab === '0') {
            console.log('opsssss')
            this.naturalFiberData = [scope.row]
            this.$set(this.materialContent._naturalFiberTableForm, 'dataSource', this.naturalFiberData)
            this.$set(this.naturalFiberContent._yarn, 'dataSource', [scope.row.yarn])// 纱支
            this.$set(this.naturalFiberContent._element, 'dataSource', [scope.row.element]) // 成份
            this.$set(this.naturalFiberContent._yarnCategory, 'dataSource', scope.row.yarnCategory ? [scope.row.yarnCategory] : [])// 纱类
            this.$set(this.naturalFiberContent._certificate, 'dataSource', scope.row.certificate ? [scope.row.certificate] : []) // 证书要求
            this.isTian = true
            this.encryptFn(this.naturalFiberContent, this.orderData['_rule'], 'edit')
            this.naturalFiberHandle('编辑天然纤维')
            this.setFormDatas({ ...scope.row }, 'naturalFiber')
          } else if (this.tab === '1') {
            this.chemicalFiberData = [scope.row]
            this.$set(this.materialContent._chemicalFiberTableForm, 'dataSource', this.chemicalFiberData)
            this.$set(this.chemicalFiberContent._fineness, 'dataSource', [scope.row.fineness])// 细度
            this.$set(this.chemicalFiberContent._element, 'dataSource', [scope.row.element])// 成份
            this.$set(this.chemicalFiberContent._wireCategory, 'dataSource', scope.row.wireCategory ? [scope.row.wireCategory] : [])// 丝类
            this.$set(this.chemicalFiberContent._certificate, 'dataSource', scope.row.certificate ? [scope.row.certificate] : []) // 证书要求
            this.isHuan = true
            this.chemicalFiberCombineData = this.editCombineData.chemicalFiber
            this.encryptFn(this.chemicalFiberContent, this.orderData['_rule'], 'edit')
            this.chemicalFiberHandle('编辑化学纤维')
            // debugger
            this.setFormDatas({ ...scope.row }, 'chemicalFiber')
          } else if (this.tab === '2') {
            const that = this
            that.materialHandle('编辑组合纱线')
            that.$set(that.materialContent._materialTabs, 'isShow', false)
            that.RawMaterialArray[this.rowIndex - 1].forEach((item, index) => {
              if (scope.row.materialInfoCopy === item.materialInfoCopy) {
                that.naturalFiberCombineData = JSON.parse(JSON.stringify(item.naturalFiber))
                that.chemicalFiberCombineData = JSON.parse(JSON.stringify(item.chemicalFiber))
              }
            })
            this.$set(this.materialContent._certificateCombine, 'dataSource', scope.row.certificate && scope.row.certificate.label ? [scope.row.certificate] : [])
            this.$set(this.materialPopOptions.formDatas, 'supplierYarnCodeCombine', scope.row.supplierYarnCode)
            this.$set(this.materialPopOptions.formDatas, 'certificateCombine', scope.row.certificate && scope.row.certificate.label ? scope.row.certificate : null)
            this.$set(this.materialContent._naturalCombineTableForm, 'dataSource', that.naturalFiberCombineData || [])
            this.$set(this.materialContent._chemicalCombineTableForm, 'dataSource', that.chemicalFiberCombineData || [])
            this.$set(this.materialPopOptions.formDatas, 'materialInfoCopy', scope.row.materialInfoCopy)
            this.$set(this.materialPopOptions.formDatas, 'materialId', scope.row.materialId || '')
            this.$set(this.materialPopOptions.formDatas, 'orderDetailId', scope.row.orderDetailId || '')
            this.$set(this.materialPopOptions.formDatas, 'orderId', scope.row.orderId || '')
            this.dataPretreatment(this.materialData, 'materialInfoCopy', 'material')
          }
        }
      },
      {
        label: '删除',
        // className: 'leftForm858',
        isShow: true,
        style: { 'color': '#FE4949', 'line-height': '24px' },
        handle: (scope) => {
          this.$confirm('确认删除该条原料信息数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            cancelButtonClass: 'btn-cancel'
          })
            .then(() => {
              this.DeleteRawMaterial(scope.row.materialInfoCopy)
            })
            .catch((err) => {
              console.log(err)
              this.$message({ type: 'info', message: '已取消删除' })
            })
        }
      }
    ]
    const materialOperates = {
      label: '操作',
      width: '120',
      fixed: 'right',
      dataSource: materialOperatesData
    }
    // 颜色数量交期
    const allColumns = {
      _code: {
        prop: 'code',
        label: '序号',
        formater: (scope) => {
          console.log(this.orderDataSource)
          return this.orderDataSource[this.rowIndex - 1].seq + '-' + scope.row.seq
        }
      },
      _customerOrderCode: {
        prop: 'customerOrderCode',
        label: '客户单号',
        showOverflowTooltip: true
      },
      _styleNumber: {
        prop: 'styleNumber',
        label: '款号',
        showOverflowTooltip: true
      },
      _customerClothNumber: {
        prop: 'customerClothNumber',
        label: '客户布号',
        showOverflowTooltip: true
      },
      _customerColor: {
        prop: 'customerColor',
        label: '客户颜色',
        showOverflowTooltip: true
      },
      _customerColorEn: {
        prop: 'customerColorEn',
        label: '客户颜色(英文)',
        minWidth: '120px',
        showOverflowTooltip: true
      },
      _stripeSpacing: {
        prop: 'stripeSpacing',
        label: '条纹间距',
        minWidth: '120px',
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
        minWidth: '120px',
        showOverflowTooltip: true
      },
      _fabricFlowerNo: {
        prop: 'fabricFlowerNo',
        label: '智布花号',
        minWidth: '120px',
        components: {
          picPreview
        },
        // formater: (scope) => {
        //   console.log("om",scope)
        // },
        handle: scope => {},
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
          })
          shearingRequirements = arr.join(',')
          return shearingRequirements
        }
      },
      _priceTax: {
        prop: 'priceTax',
        label: '单价(含税)',
        minWidth: '120px',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.currencyCode ? this.$utils.priceFormat(scope.row.priceTax) ? `${this.currencyCode}${this.$utils.priceFormat(scope.row.priceTax)}` : '' : this.$utils.priceFormat(scope.row.priceTax)
        }
      },
      _price: {
        prop: 'price',
        label: '单价(不含税)',
        minWidth: '120px',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.currencyCode ? this.$utils.priceFormat(scope.row.price) ? `${this.currencyCode}${this.$utils.priceFormat(scope.row.price)}` : '' : this.$utils.priceFormat(scope.row.price)
        }
      },
      _seq: {
        prop: 'seq',
        label: '子序号',
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
        minWidth: '120px',
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
        minWidth: '120px',
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
        showOverflowTooltip: true,
        minWidth: '120px',
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
          console.log(scope.row)
          this.allPopHandle('编辑颜色&数量&交期')
          this.editAll = scope.row
          this.maxRow = this.scope
          this.editAll.index = scope.$index
          // if (scope.row.colorInfoId) {
          //   this.colorInfo.forEach((item, index) => {
          //     if (parseInt(scope.row.colorInfoId) === parseInt(item.colorInfoId)) {
          //       this.editAll = { ...item, index: index }
          //     }
          //   })
          // } else if (scope.row.dataTim) {
          //   this.colorInfo.forEach((item, index) => {
          //     if (scope.row.dataTim === item.dataTim) {
          //       this.editAll = { ...item, index: index }
          //     }
          //   })
          // }
          this.$set(this.allPopOptions, 'formDatas', { ...scope.row })
          this.quantityDeliveryData = this.editAll.quantityDelivery && this.editAll.quantityDelivery.length ? JSON.parse(JSON.stringify(this.editAll.quantityDelivery)) : []
          this.shearingRequirementsData = scope.row.shearingRequirements && scope.row.shearingRequirements.length ? JSON.parse(JSON.stringify(scope.row.shearingRequirements)) : []
          this.stripeSpacingData = scope.row.stripeSpacing && scope.row.stripeSpacing.length ? JSON.parse(JSON.stringify(scope.row.stripeSpacing)) : []
          this.$set(this.allContent._shearingRequirementsTableForm, 'dataSource', this.shearingRequirementsData)
          this.$set(this.allContent._stripeSpacingTableForm, 'dataSource', this.stripeSpacingData)
          this.$set(this.allContent._quantityDeliveryTableForm, 'dataSource', this.quantityDeliveryData)
          this.encryptFn(this.allContent, this.orderData['_rule'], 'edit')
          if (this.stripeSpacingData && this.stripeSpacingData.length) { // 动态添加校验 不要可以删除  stripeSpacingPopOptions()
            this.$set(this.allContent._range, 'rules', [{ required: true, message: '公差范围不能为空', trigger: 'change' }])
            this.$set(this.allContent._range, 'dataSource', scope.row.range && scope.row.range.value ? [scope.row.range] : [])
          }
        }
      },
      {
        label: '删除',
        isShow: true,
        style: { 'color': '#FE4949' },
        handle: scope => {
          this.cancelAll = []
          console.log(scope.row)
          if (scope.row.colorInfoId) {
            this.colorInfo.forEach((item, index) => {
              if (parseInt(scope.row.colorInfoId) === parseInt(item.colorInfoId)) {
                this.cancelAll = { ...item, index: index }
              }
            })
          } else if (scope.row.dataTim) {
            this.colorInfo.forEach((item, index) => {
              if (scope.row.dataTim === item.dataTim) {
                this.cancelAll = { ...item, index: index }
              }
            })
          }
          console.log(this.cancelAll)
          this.$confirm('确认删除该条颜色&数量&交期数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            cancelButtonClass: 'btn-cancel'
          })
            .then(() => {
              // this.colorInfo.splice(this.cancelAll.index, 1)
              this.colorInfo.splice(scope.$index, 1)
              this.colorInfoTemp = []
              console.log(this.colorInfo)
              this.colorInfo.forEach((item, index) => {
                console.log(item)
                if (this.status !== '2') {
                  item.seq = index + 1
                  item.code = index + 1
                }
                if (item.quantityDelivery && item.quantityDelivery.length > 1) {
                  item.quantityDelivery.forEach(items => {
                    const data = {
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
                      code: item.code || '',
                      dataTim: item.dataTim || ''
                    }
                    console.log(data)
                    this.colorInfoTemp.push({ ...data, dataTim: new Date().getTime() + '' + index })
                  })
                } else {
                  this.colorInfoTemp = [...this.colorInfoTemp, ...new Array(1).fill({ ...item, dataTim: new Date().getTime() + '' + index })]
                  // editArr = [ ...editArr, ...new Array(1).fill(item) ]
                }
              })
              console.log(this.colorInfoTemp)
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
            })
            .catch(() => {
              this.$message({ type: 'info', message: '已取消删除' })
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
    // 参板信息弹框内容
    const versionContent = {
      _referenceOrder: {
        prop: 'referenceOrder',
        itemType: 'select',
        className: 'commonRemoteSearch',
        placeholder: '输入文字模糊查询',
        label: '订单号',
        valueType: 'object',
        clearable: true,
        filterable: true,
        rules: [commonChangeReg],
        change: (value, form, formDatas, setFormDatas) => {
          if (value && value.value) {
            setFormDatas({ greyClothCode: '' })
            this.getGreyClothCodesSelect({ orderId: value.value })
          }
        },
        visibleChange: value => {
          this.getOrderNoSelect()
        },
        dataSource: []
      },
      _greyClothCode: {
        prop: 'greyClothCode',
        itemType: 'select',
        label: '坯布/成品编码',
        clearable: true,
        // rules: [commonChangeReg],
        placeholder: '请先输入坯布/成品编码',
        visibleChange: value => {
          // console.log(value)
        },
        focus: (e, scope, form, formDatas, setFormDatas) => {
          if (!formDatas.referenceOrder) {
            this.$message({ type: 'warning', message: '请先选择订单号' })
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
        rules: [commonChangeReg],
        valueType: 'object',
        visibleChange: value => {
          this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '参考内容' }, 'referenceContent')
        },
        dataSource: []
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
        const data = {
          referenceOrder: params.referenceOrder || '',
          greyClothCode: params.greyClothCode || '',
          referenceContent: params.referenceContent || '',
          remark: params.remark || ''
        }
        if (this.versionPopOptions.title === '新增参板信息') {
          this.versionData.push({ ...data, code: this.versionData.length + 1 })
        } else {
          this.versionData.splice(data.code - 1, 1, data)
        }

        this.versionPopHandle()
      },
      cancel: params => {
        this.versionPopHandle()
      },
      formDatas: {},
      formOptions: {},
      content: versionContent
    }
    // 天然纤维table表头
    const naturalFiberColumns = {
      _yarn: {
        prop: 'yarn',
        label: '纱支',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarn && scope.row.yarn.label ? scope.row.yarn.label : ''
        }
      },
      _element: {
        prop: 'element',
        label: '成份',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.element && scope.row.element.label ? scope.row.element.label : ''
        }
      },
      _elementRatio: {
        prop: 'elementRatio',
        label: '比例',
        showOverflowTooltip: true
      },
      _yarnCategory: {
        prop: 'yarnCategory',
        label: '纱类',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnCategory && scope.row.yarnCategory.label ? scope.row.yarnCategory.label : ''
        }
      },
      _certificate: {
        prop: 'certificate',
        label: '证书要求',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.certificate && scope.row.certificate.label ? scope.row.certificate.label : ''
        }
      },
      _supplierYarnCode: {
        prop: 'supplierYarnCode',
        label: '供应商纱线编码',
        maxlength: 50,
        showOverflowTooltip: true
      }
    }
    const naturalFiberData = []
    const naturalFiberOperatesData = [
      {
        label: '编辑',
        isShow: true,
        handle: scope => {
          if (this.tab === '2') {
            this.$set(this.naturalFiberPopOptions.content._certificate, 'isShow', false)
            this.$set(this.naturalFiberPopOptions.content._supplierYarnCode, 'isShow', false)
            this.$set(this.naturalFiberPopOptions.content._elementRatio.componentsOptions, 'textType', '2')
          } else {
            this.$set(this.naturalFiberPopOptions.content._elementRatio.componentsOptions, 'textType', '0')
            // this.$set(this.naturalFiberContent._certificate, 'isShow', true)
            // this.$set(this.naturalFiberContent._supplierYarnCode, 'isShow', true)

            this.$set(this.naturalFiberPopOptions.content._certificate, 'isShow', true)
            this.$set(this.naturalFiberPopOptions.content._supplierYarnCode, 'isShow', true)
            this.$set(this.naturalFiberPopOptions.content._certificate, 'dataSource', scope.row.certificate ? [scope.row.certificate] : []) // 证书要求
          }

          this.$set(this.naturalFiberPopOptions.content._yarn, 'dataSource', [scope.row.yarn]) // 纱支
          this.$set(this.naturalFiberPopOptions.content._element, 'dataSource', [scope.row.element]) // 成份
          this.$set(this.naturalFiberPopOptions.content._yarnCategory, 'dataSource', scope.row.yarnCategory ? [scope.row.yarnCategory] : []) // 纱类
          this.encryptFn(this.naturalFiberContent, this.orderData['_rule'], 'edit')
          this.naturalFiberHandle('编辑天然纤维')
          this.isTian = false
          this.setFormDatas({ ...scope.row, indexCode: scope.$index }, 'naturalFiber')
        }
      },
      {
        label: '删除',
        isShow: true,
        style: { 'color': '#FE4949', 'line-height': '24px' },
        handle: scope => {
          this.$confirm('确认删除该条天然纤维数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            cancelButtonClass: 'btn-cancel'
          })
            .then(() => {
              if (this.tab === '2') {
                this.naturalFiberCombineData.splice(scope.$index, 1)
                this.naturalFiberCombineData.forEach((item, index) => {
                  item.code = index + 1
                })
              } else {
                this.naturalFiberData.splice(scope.$index, 1)
                this.naturalFiberData.forEach((item, index) => {
                  item.code = index + 1
                })
              }
            })
            .catch(() => {
              this.$message({ type: 'info', message: '已取消删除' })
            })
        }
      }
    ]
    const naturalFiberOperates = {
      label: '操作',
      width: '120',
      // fixed: 'right',
      // className: 'm9999',
      dataSource: naturalFiberOperatesData
    }
    // 化学纤维table表头
    const chemicalFiberColumns = {
      _fineness: {
        prop: 'fineness',
        label: '细度',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.fineness && scope.row.fineness.label ? scope.row.fineness.label : ''
        }
      },
      _element: {
        prop: 'element',
        label: '成份',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.element && scope.row.element.label ? scope.row.element.label : ''
        }
      },
      _wireCategory: {
        prop: 'wireCategory',
        label: '丝类',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.wireCategory && scope.row.wireCategory.label ? scope.row.wireCategory.label : ''
        }
      },
      _certificate: {
        prop: 'certificate',
        label: '证书要求',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.certificate && scope.row.certificate.label ? scope.row.certificate.label : ''
        }
      },
      _supplierYarnCode: {
        prop: 'supplierYarnCode',
        label: '供应商纱线编码',
        maxlength: 50,
        showOverflowTooltip: true
      }
    }
    const chemicalFiberData = []
    const chemicalFiberOperatesData = [
      {
        label: '编辑',
        isShow: true,
        handle: scope => {
          if (this.tab === '2') {
            // this.$set(this.chemicalFiberContent._certificate, 'isShow', false)
            // this.$set(this.chemicalFiberContent._supplierYarnCode, 'isShow', false)

            this.$set(this.chemicalFiberPopOptions.content._certificate, 'isShow', false)
            this.$set(this.chemicalFiberPopOptions.content._supplierYarnCode, 'isShow', false)
          } else {
            // this.$set(this.chemicalFiberContent._certificate, 'isShow', true)
            // this.$set(this.chemicalFiberContent._supplierYarnCode, 'isShow', true)

            this.$set(this.chemicalFiberPopOptions.content._certificate, 'isShow', true)
            this.$set(this.chemicalFiberPopOptions.content._supplierYarnCode, 'isShow', true)
            this.$set(this.chemicalFiberPopOptions.content._certificate, 'dataSource', scope.row.certificate ? [scope.row.certificate] : []) // 证书要求
          }
          this.$set(this.chemicalFiberPopOptions.content._fineness, 'dataSource', scope.row.fineness ? [scope.row.fineness] : [])// 细度
          this.$set(this.chemicalFiberPopOptions.content._element, 'dataSource', [scope.row.element])// 成份
          this.$set(this.chemicalFiberPopOptions.content._wireCategory, 'dataSource', scope.row.wireCategory ? [scope.row.wireCategory] : [])// 丝类
          this.encryptFn(this.chemicalFiberContent, this.orderData['_rule'], 'add')
          this.chemicalFiberHandle('编辑化学纤维')
          this.isHuan = false
          this.setFormDatas({ ...scope.row, indexCode: scope.$index }, 'chemicalFiber')
        }
      },
      {
        label: '删除',
        isShow: true,
        style: { 'color': '#FE4949' },
        handle: scope => {
          this.$confirm('确认删除该条化学纤维数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            cancelButtonClass: 'btn-cancel'
          })
            .then(() => {
              console.log(this.RawMaterialArray)
              if (this.tab === '2') {
                console.log('om', this.RawMaterialArray)
                this.chemicalFiberCombineData.splice(scope.$index, 1)
                this.chemicalFiberCombineData.forEach((item, index) => {
                  item.code = index + 1
                })
              } else {
                this.chemicalFiberData.splice(scope.$index, 1)
                this.chemicalFiberData.forEach((item, index) => {
                  item.code = index + 1
                })
              }
              console.log(this.RawMaterialArray)
            })
            .catch(() => {
              this.$message({ type: 'info', message: '已取消删除' })
            })
        }
      }
    ]
    const chemicalFiberOperates = {
      label: '操作',
      width: '120',
      // fixed: 'right',
      dataSource: chemicalFiberOperatesData
    }
    const naturalFiberCombineData = []
    const chemicalFiberCombineData = []
    // 原料要求弹窗内容
    const materialContent = {
      _materialTabs: {
        prop: 'materialTabs',
        itemType: 'tabs',
        label: '',
        itemStyle: { 'margin-bottom': '0' },
        labelWidth: '0',
        dataSource: [{
          label: '天然纤维',
          value: '0'
        }, {
          label: '化学纤维',
          value: '1'
        }, {
          label: '组合纱线',
          value: '2'
        }],
        change: (tab) => {
          console.log('on', tab)
          this.tabChange(tab)
        }
      },
      _naturalFibeAdd: { // 天然纤维 新增
        itemType: 'itemview',
        label: '',
        itemStyle: { width: '100%', display: 'flex', 'flex-direction': 'row-reverse', 'margin-bottom': '16px' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<el-button size="mini" type="primary" class="addButton">新增</el-button>`
        },
        handle: () => {
          this.addNaturalFiber()
        }
      },
      _naturalFiberTableForm: {// 天然纤维table表头
        prop: 'naturalFiberTableForm',
        itemType: 'table-form',
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        size: 'mini',
        columns: naturalFiberColumns, // 1509
        dataSource: naturalFiberData, // 1544
        operates: naturalFiberOperates // 1609
      },
      _chemicalFiberAdd: {
        itemType: 'itemview',
        label: '',
        isShow: false,
        itemStyle: { width: '100%', display: 'flex', 'flex-direction': 'row-reverse', 'margin-bottom': '16px' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<el-button size="mini" type="primary" class="addButton">新增</el-button>`
        },
        handle: () => {
          this.addChemicalFiber()
        }
      },
      _chemicalFiberTableForm: {
        prop: 'chemicalFiberTableForm',
        itemType: 'table-form',
        isShow: false,
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        size: 'mini',
        columns: chemicalFiberColumns,
        dataSource: chemicalFiberData,
        operates: chemicalFiberOperates
      },
      _certificateCombine: {
        prop: 'certificateCombine',
        itemType: 'select',
        itemStyle: { width: '33%', display: 'inline-block', 'margin-right': '20px', 'margin-bottom': '0' },
        label: '证书要求',
        labelWidth: '68px',
        isShow: false,
        clearable: true,
        valueType: 'object',
        // rules: [commonChangeReg],
        visibleChange: value => {
          this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '证书要求' }, 'combine')
        },
        dataSource: []
      },
      _supplierYarnCodeCombine: {
        prop: 'supplierYarnCodeCombine',
        itemType: 'input',
        itemStyle: { width: '33%', display: 'inline-block', 'margin-bottom': '0' },
        label: '供应商纱线编码',
        maxlength: 50,
        isShow: false,
        clearable: true
      },
      _naturalCombine: {
        itemType: 'view',
        text: '天然纤维',
        isShow: false,
        style: { width: '80%', 'padding': '16px 0', display: 'inline-block' }
      },
      _naturalCombineAdd: {
        itemType: 'itemview',
        label: '',
        isShow: false,
        itemStyle: { display: 'inline-block', 'margin-bottom': '16px', position: 'absolute', right: '0px', 'margin-top': '10px' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<el-button size="mini" type="primary" class="addButton">新增</el-button>`
        },
        handle: () => {
          this.addNaturalFiber()
        }
      },
      _naturalCombineTableForm: {
        prop: 'naturalCombineTableForm',
        itemType: 'table-form',
        isShow: false,
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        size: 'mini',
        columns: naturalFiberColumns,
        dataSource: naturalFiberCombineData,
        operates: naturalFiberOperates
      },
      _chemicalCombine: {
        itemType: 'view',
        text: '化学纤维',
        isShow: false,
        style: { width: '80%', 'padding': '16px 0', display: 'inline-block' }
      },
      _chemicalCombineAdd: {
        itemType: 'itemview',
        label: '',
        isShow: false,
        itemStyle: { display: 'inline-block', 'margin-bottom': '16px', position: 'absolute', right: '0px', 'margin-top': '10px' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<el-button size="mini" type="primary" class="addButton">新增</el-button>`
        },
        handle: () => {
          this.addChemicalFiber()
        }
      },
      _chemicalCombineTableForm: {
        prop: 'chemicalCombineTableForm',
        itemType: 'table-form',
        isShow: false,
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        size: 'mini',
        columns: chemicalFiberColumns,
        dataSource: chemicalFiberCombineData,
        operates: chemicalFiberOperates
      }
    }
    // 原料要求弹窗操作配置
    const materialPopOptions = {
      itemType: 'drawer',
      size: '850px',
      visible: false,
      title: '新增原料信息',
      okText: '保存',
      ok: params => {
        if (this.materialPopOptions.title === '新增原料信息') {
          if (this.tab === '0') {
            if (!this.naturalFiberData || !this.naturalFiberData.length) {
              this.$message({ type: 'error', message: '新增原料信息不能为空 ' })
              return false
            }
            this.$set(this.materialContent._naturalCombineTableForm, 'dataSource', this.naturalFiberCombineData)
            this.RawMaterialExtraction(this.naturalFiberData, [], 0)
            this.materialData = [...this.materialData, ...this.naturalFiberData]
            this.dataPretreatment(this.materialData, 'materialInfoCopy', 'material')
          } else if (this.tab === '1') {
            if (!this.chemicalFiberData || !this.chemicalFiberData.length) {
              this.$message({ type: 'error', message: '新增原料信息不能为空 ' })
              return false
            }
            this.RawMaterialExtraction([], this.chemicalFiberData, 1)
            this.materialData = [...this.materialData, ...this.chemicalFiberData]
            this.dataPretreatment(this.materialData, 'materialInfoCopy', 'material')
          } else if (this.tab === '2') {
            if ((!this.naturalFiberCombineData || !this.naturalFiberCombineData.length) && (!this.chemicalFiberCombineData || !this.chemicalFiberCombineData.length)) {
              this.$message({ type: 'error', message: '新增原料信息不能为空 ' })
              return false
            }
            this.$set(this.materialPopOptions.formDatas, 'supplierYarnCodeCombine', '')
            this.$set(this.materialPopOptions.formDatas, 'certificateCombine', '')
            this.naturalFiberCombineData.forEach((item) => {
              item.supplierYarnCode = params.supplierYarnCodeCombine || ''
              item.certificate = params.certificateCombine || ''
              // item.certificateCombine = params.certificateCombine || ''
              item.type = '2'
            })
            this.chemicalFiberCombineData.forEach((item) => {
              item.supplierYarnCode = params.supplierYarnCodeCombine || ''
              // item.certificateCombine = params.certificateCombine || ''
              item.certificate = params.certificateCombine || ''
              item.type = '2'
            })
            this.RawMaterialExtraction(this.naturalFiberCombineData, this.chemicalFiberCombineData, 2)
            this.materialData = [...this.materialData, ...this.naturalFiberCombineData, ...this.chemicalFiberCombineData]
            this.dataPretreatment(this.materialData, 'materialInfoCopy', 'material')
            this.naturaEven = ''
          }
        } else if (this.materialPopOptions.title === '编辑组合纱线') {
          let sm = ''
          if ((!params.naturalCombineTableForm || !params.naturalCombineTableForm.length) && (!params.chemicalCombineTableForm || !params.chemicalCombineTableForm.length)) {
            this.$message({ type: 'error', message: '新增原料信息不能为空 ' })
            return false
          }
          const paramsData = { certificate: params.certificate || params.certificateCombine || [], supplierYarnCode: params.supplierYarnCodeCombine || '',
            naturalFiber: params.naturalCombineTableForm, chemicalFiber: params.chemicalCombineTableForm,
            materialInfoCopy: params.materialInfoCopy, type: params.type || '2',
            materialId: params.materialId || '', orderDetailId: params.orderDetailId || '', orderId: params.orderId || ''
          }
          this.RawMaterialArray[this.rowIndex - 1].forEach((item, index) => {
            if (params.materialInfoCopy === item.materialInfoCopy) { sm = index }
          })
          this.RawMaterialArray[this.rowIndex - 1].splice(sm, 1, paramsData)
          this.ExternalRawMaterials(this.RawMaterialArray[this.rowIndex - 1], true)
        }
        // 处理新增里类型错误
        // this.$set(this.materialContent._naturalFiberTableForm, 'dataSource', [])
        // this.$set(this.materialContent._chemicalFiberTableForm, 'dataSource', [])
        // this.$set(this.materialContent._naturalCombineTableForm, 'dataSource', [])
        // this.$set(this.materialContent._chemicalCombineTableForm, 'dataSource', [])
        this.materialHandle()
      },
      cancel: params => {
        if (this.InformationDeletion) {
          this.RawMaterialArray[this.rowIndex - 1].splice(this.InformationDeletion.imIndex, 1, this.InformationDeletion)
          this.ExternalRawMaterials(this.RawMaterialArray[this.rowIndex - 1], true)
        }
        this.materialHandle()
      },
      formDatas: {},
      formOptions: {},
      content: materialContent
    }
    // 天然纤维弹窗内容
    const naturalFiberContent = {
      _yarn: {
        prop: 'yarn',
        itemType: 'select',
        className: 'commonRemoteSearch',
        placeholder: '输入文字模糊查询',
        itemStyle: { 'margin-right': '1px' },
        label: '纱支',
        clearable: true,
        filterable: true,
        valueType: 'object',
        rules: [commonChangeReg],
        visibleChange: value => {
          this.getYarnSelect('yarn')
        },
        dataSource: []
      },
      _element: {
        prop: 'element',
        className: 'commonRemoteSearch',
        itemType: 'select',
        itemStyle: { 'margin-right': '1px' },
        label: '成份',
        placeholder: '输入文字模糊查询',
        clearable: true,
        filterable: true,
        valueType: 'object',
        rules: [commonChangeReg],
        change: (value, form, formDatas, setFormDatas) => {
          if (value.names && value.names.split('/').length > 1) {
            setFormDatas({ elementRatio: '' })
          } else {
            setFormDatas({ elementRatio: '100' })
          }
        },
        visibleChange: (value) => {
          if (value) {
            this.getCompositionSelect('naturalFiber')
          }
        },
        dataSource: []
      },
      _elementRatio: {
        prop: 'elementRatio',
        itemType: 'input',
        itemStyle: { 'margin-right': '1px' },
        label: '比例',
        kmIndex: this.tab,
        rules: [commonBlurReg],
        components: {
          popProportion
        },
        componentsOptions: {
          prop: 'elementRatio',
          textType: this.tab
        },
        clearable: true
      },
      _yarnCategory: {
        prop: 'yarnCategory',
        className: 'commonRemoteSearch',
        itemType: 'select',
        itemStyle: { 'margin-right': '1px' },
        label: '纱类',
        placeholder: '输入文字模糊查询',
        clearable: true,
        filterable: true,
        valueType: 'object',
        // rules: [commonChangeReg],
        visibleChange: value => {
          this.getYarnTypeSelect('yarn')
        },
        dataSource: []
      },
      _certificate: {
        prop: 'certificate',
        itemType: 'select',
        itemStyle: { 'margin-right': '1px' },
        label: '证书要求',
        clearable: true,
        valueType: 'object',
        // rules: [commonChangeReg],
        visibleChange: value => {
          this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '证书要求' }, 'naturalFiber')
        },
        dataSource: []
      },
      _supplierYarnCode: {
        prop: 'supplierYarnCode',
        itemType: 'input',
        itemStyle: { 'margin-right': '1px' },
        label: '供应商纱线编码',
        maxlength: 50,
        clearable: true
      }
    }
    // 天然纤维弹窗操作配置
    const naturalFiberPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '新增天然纤维',
      // className: 'sssssss25',
      okText: '保存',
      ok: params => {
        if (this.naturalFiberPopOptions.title === '新增天然纤维') {
          if (this.tab === '2') {
            if (!this.naturalFiberCombineData) { this.naturalFiberCombineData = [] }
            this.naturalFiberCombineData.push({ ...params, code: this.naturalFiberCombineData.length + 1, type: '2' })
            if (this.naturalFiberCombineData && this.naturalFiberCombineData.length) {
              this.setnaturaEven()
              this.naturalFiberCombineData.forEach((items, index) => {
                items.materialInfoCopy = this.naturaEven
              })
            }
            this.$set(this.materialContent._naturalCombineTableForm, 'dataSource', this.naturalFiberCombineData)
          } else {
            this.naturalFiberData.push({ ...params, code: this.naturalFiberData.length + 1, type: '0' })
            if (this.naturalFiberData && this.naturalFiberData.length) {
              const dataTim = new Date().getTime()
              this.naturalFiberData.forEach((items, index) => {
                items.materialInfoCopy = (items.materialInfoCopy || (dataTim + index + ''))
              })
            }
            this.$set(this.materialContent._naturalFiberTableForm, 'dataSource', this.naturalFiberData)
          }
        } else if (this.naturalFiberPopOptions.title === '编辑天然纤维') {
          const paramsData = {
            materialId: params.materialId || '',
            orderDetailId: params.orderDetailId || '',
            type: params.type || 0,
            orderId: params.orderId || '',
            indexCode: params.indexCode || 0,
            materialInfoCopy: params.materialInfoCopy,
            certificate: params.certificate || '', // 证书要求ID
            supplierYarnCode: params.supplierYarnCode || '' // 供应商纱线编码
          }
          if (this.tab === '2') {
            paramsData.yarn = params.yarn || ''
            paramsData.elementRatio = params.elementRatio || ''
            paramsData.element = params.element || ''
            paramsData.yarnCategory = params.yarnCategory || ''
            this.naturalFiberCombineData.forEach((item, index) => { // 新增原料列表编辑
              if (params.indexCode === index) {
                this.naturalFiberCombineData.splice(index, 1, paramsData)
              }
            })
          } else {
            if (params.materialInfoCopy) {
              if (this.isTian) {
                paramsData.naturalFiber = [{ ...params }]
                paramsData.chemicalFiber = []
                this.RawMaterialArray[this.rowIndex - 1].forEach((item, index) => {
                  if (params.materialInfoCopy === item.materialInfoCopy) {
                    this.RawMaterialArray[this.rowIndex - 1].splice(index, 1, paramsData)
                  }
                })
                this.ExternalRawMaterials(this.RawMaterialArray[this.rowIndex - 1], false)
                this.isTian = false
              } else {
                paramsData.yarn = params.yarn || ''
                paramsData.elementRatio = params.elementRatio || ''
                paramsData.element = params.element || ''
                paramsData.yarnCategory = params.yarnCategory || ''
              }
              this.naturalFiberData.forEach((item, index) => { // 新增原料列表编辑
                if (params.materialInfoCopy === item.materialInfoCopy) {
                  this.naturalFiberData.splice(index, 1, paramsData)
                }
              })
            }
          }
        }
        this.naturalFiberHandle()
      },

      cancel: params => {
        this.naturalFiberHandle()
      },
      formDatas: {
        tab: this.tab
      },
      formOptions: {},
      content: naturalFiberContent
    }
    // 化学纤维弹窗内容
    const chemicalFiberContent = {
      _fineness: {
        prop: 'fineness',
        itemType: 'select',
        className: 'commonRemoteSearch',
        placeholder: '输入文字模糊查询',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        label: '细度',
        clearable: true,
        filterable: true,
        valueType: 'object',
        rules: [commonChangeReg],
        visibleChange: value => {
          this.getYarnSelect('fineness')
        },
        dataSource: []
      },
      _element: {
        prop: 'element',
        className: 'commonRemoteSearch',
        itemType: 'select',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-left': '2%' },
        label: '成份',
        placeholder: '输入文字模糊查询',
        clearable: true,
        filterable: true,
        valueType: 'object',
        rules: [commonChangeReg],
        visibleChange: (value) => {
          if (value) {
            this.getCompositionSelect('chemicalFiber')
          }
        },
        dataSource: []
      },
      _wireCategory: {
        prop: 'wireCategory',
        className: 'commonRemoteSearch',
        itemType: 'select',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        label: '丝类',
        placeholder: '输入文字模糊查询',
        clearable: true,
        filterable: true,
        valueType: 'object',
        visibleChange: value => {
          this.getYarnTypeSelect('silk')
        },
        dataSource: []
      },
      _certificate: {
        prop: 'certificate',
        itemType: 'select',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-left': '2%' },
        label: '证书要求',
        clearable: true,
        valueType: 'object',
        visibleChange: value => {
          this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '证书要求' }, 'chemicalFiber')
        },
        dataSource: []
      },
      _supplierYarnCode: {
        prop: 'supplierYarnCode',
        itemType: 'input',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        label: '供应商纱线编码',
        maxlength: 50,
        clearable: true
      }
    }
    // 化学纤维弹窗操作配置
    const chemicalFiberPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '新增化学纤维',
      okText: '保存',
      ok: params => {
        if (this.chemicalFiberPopOptions.title === '新增化学纤维') {
          if (this.tab === '2') {
            if (!this.chemicalFiberCombineData) { this.chemicalFiberCombineData = [] }
            this.chemicalFiberCombineData.push({ ...params, code: this.chemicalFiberCombineData.length + 1, type: '2' })
            if (this.chemicalFiberCombineData && this.chemicalFiberCombineData.length) {
              this.setnaturaEven()
              this.chemicalFiberCombineData.forEach((items, index) => {
                items.materialInfoCopy = this.naturaEven
              })
            }
            this.$set(this.materialContent._chemicalCombineTableForm, 'dataSource', this.chemicalFiberCombineData)
          } else {
            this.chemicalFiberData.push({ ...params, code: this.chemicalFiberData.length + 1, type: '1' })
            if (this.chemicalFiberData && this.chemicalFiberData.length) {
              const dataTim = new Date().getTime()
              this.chemicalFiberData.forEach((items, index) => {
                items.materialInfoCopy = (items.materialInfoCopy || (dataTim + index + ''))
              })
            }
            this.$set(this.materialContent._chemicalFiberTableForm, 'dataSource', this.chemicalFiberData)
          }
        } else if (this.chemicalFiberPopOptions.title === '编辑化学纤维') {
          const paramsData = {
            type: params.type || 0,
            materialId: params.materialId || '',
            orderDetailId: params.orderDetailId || '',
            orderId: params.orderId || '',
            indexCode: params.indexCode || 0,
            materialInfoCopy: params.materialInfoCopy,
            certificate: params.certificate || {}, // 证书要求ID
            supplierYarnCode: params.supplierYarnCode || {} // 供应商纱线编码
          }
          if (this.tab === '2') {
            paramsData.fineness = params.fineness || ''
            paramsData.element = params.element || ''
            paramsData.wireCategory = params.wireCategory || ''
            this.chemicalFiberCombineData.forEach((item, index) => { // 新增原料信息里面的tab列表
              if (params.indexCode === index) {
                this.chemicalFiberCombineData.splice(index, 1, paramsData)
              }
            })
          } else {
            if (params.materialInfoCopy) {
              if (this.isHuan) {
                paramsData.naturalFiber = []
                paramsData.chemicalFiber = [{ ...params }]
                this.RawMaterialArray[this.rowIndex - 1].forEach((item, index) => { // 改变后台数据
                  if (params.materialInfoCopy === item.materialInfoCopy) {
                    this.RawMaterialArray[this.rowIndex - 1].splice(index, 1, paramsData)
                  }
                })
                this.ExternalRawMaterials(this.RawMaterialArray[this.rowIndex - 1], false)
                this.isHuan = false
              } else {
                paramsData.fineness = params.fineness || ''
                paramsData.element = params.element || ''
                paramsData.wireCategory = params.wireCategory || ''
              }
              this.chemicalFiberData.forEach((item, index) => { // 新增原料信息里面的tab列表
                if (params.materialInfoCopy === item.materialInfoCopy) {
                  this.chemicalFiberData.splice(index, 1, paramsData)
                }
              })
            }
          }
        }
        this.chemicalFiberHandle()
      },
      cancel: params => {
        this.chemicalFiberHandle()
      },
      formDatas: {},
      formOptions: {},
      content: { ...chemicalFiberContent }
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
      width: '120',
      // fixed: 'right',
      dataSource: [
        {
          label: '编辑',
          isShow: true,
          handle: scope => {
            this.$set(this.shearingRequirementsContent._type, 'dataSource', scope.row.type && scope.row.type.value ? [scope.row.type] : '')
            this.$set(this.shearingRequirementsContent._unit, 'dataSource', scope.row.unit && scope.row.unit.value ? [scope.row.unit] : '')
            this.popHandle('编辑剪版要求', 'shearingRequirements')
            this.setFormDatas({ ...scope.row, code: scope.$index + 1 }, 'shearingRequirements')
          }
        },
        {
          label: '删除',
          isShow: true,
          style: { 'color': '#FE4949' },
          handle: (scope) => {
            this.$confirm('确认删除该条剪版要求数据？', '提示', {
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
        itemStyle: { width: '48%', display: 'inline-block', 'margin-left': '2%' },
        label: '类型',
        clearable: true,
        valueType: 'object',
        rules: [commonChangeReg],
        visibleChange: value => {
          this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '剪板要求类型' }, 'type')
        },
        dataSource: []
      },
      _quantity: {
        prop: 'quantity',
        itemType: 'input',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        label: '数量',
        placeholder: '请输入0~999.99',
        rules: [commonBlurReg, max999Reg],
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
          this.$set(this.shearingRequirementsContent._unit, 'dataSource', this.unitOptions)
        },
        dataSource: []
      }
    }
    // 剪版要求弹窗配置
    const shearingRequirementsPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '新增剪版要求',
      okText: '保存',
      ok: params => {
        if (this.shearingRequirementsPopOptions.title === '新增剪版要求') {
          this.shearingRequirementsData.push({ ...params, code: this.shearingRequirementsData.length + 1 })
          this.$set(this.allContent._shearingRequirementsTableForm, 'dataSource', this.shearingRequirementsData)
        } else {
          this.shearingRequirementsData.splice(params.code - 1, 1, params)
          this.$set(this.allContent._shearingRequirementsTableForm, 'dataSource', this.shearingRequirementsData)
        }
        this.popHandle('', 'shearingRequirements')
      },
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
        width: '80',
        label: '序号'
      },
      _colorName: {
        prop: 'colorName',
        label: '颜色名称',
        showOverflowTooltip: true
      },
      _height: {
        prop: 'height',
        label: '高度(cm)',
        showOverflowTooltip: true
      },
      _fabricColorNo: {
        prop: 'fabricColorNo',
        label: '智布色号',
        showOverflowTooltip: true
      },
      _colorValue: {
        prop: 'colorValue',
        label: '颜色预览',
        showOverflowTooltip: true,
        formater: scope => {
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
    // 条纹间距table操作
    const stripeSpacingOperates = {
      label: '操作',
      width: '120',
      // fixed: 'right',
      dataSource: [
        {
          label: '编辑',
          isShow: true,
          handle: scope => {
            this.popHandle('编辑条纹间距', 'stripeSpacing')
            if (scope.row.isOriginal) { // 弹窗带出颜色
              this.$set(this.stripeSpacingContent._colorValue, 'disabled', true)
              this.$set(this.stripeSpacingContent._colorValue, 'readonly', true)
            } else {
              this.$set(this.stripeSpacingContent._colorValue, 'disabled', false)
              this.$set(this.stripeSpacingContent._colorValue, 'readonly', false)
            }
            this.setFormDatas({ ...scope.row, seq: scope.$index + 1 }, 'stripeSpacing')
          }
        },
        {
          label: '删除',
          isShow: true,
          style: { 'color': '#FE4949' },
          handle: (scope) => {
            this.$confirm('确认删除该条条纹间距数据？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              cancelButtonClass: 'btn-cancel'
            })
              .then(() => {
                this.stripeSpacingData.splice(scope.$index, 1)
                this.stripeSpacingData.forEach((item, index) => {
                  item.seq = index + 1
                })
                if (!this.stripeSpacingData || !this.stripeSpacingData.length) { // 动态添加校验 不要删除  stripeSpacingPopOptions()
                  this.$set(this.allContent._range, 'rules', [])
                }
              })
              .catch(() => {
                this.$message({ type: 'info', message: '已取消删除' })
              })
          }
        }
      ]
    }
    const stripeSpacingContent = {
      _seq: {
        prop: 'seq',
        itemType: 'input',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        label: '序号',
        disabled: true,
        clearable: true
      },
      _colorName: {
        prop: 'colorName',
        itemType: 'input',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-left': '2%' },
        label: '颜色名称',
        maxlength: 50,
        clearable: true,
        rules: [commonBlurReg]
      },
      _height: {
        prop: 'height',
        itemType: 'input',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        label: '高度(cm)',
        clearable: true,
        rules: [commonBlurReg, max99Reg]
      },
      _fabricColorNo: {
        prop: 'fabricColorNo',
        itemType: 'input',
        className: 'cursorHandel',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-left': '2%' },
        label: '智布色号',
        placeholder: '点击选择智布色号',
        clearable: true,
        // readonly: true,
        clear: (form, formDatas, setFormDatas, scope) => {
          this.stripeSpacingPopOptions.formDatas = { fabricColorNo: '', colorValue: '', fabriNoTime: '' }
          this.$set(this.stripeSpacingContent._colorValue, 'disabled', false)
        },
        focus: (params) => {
          this.chooseType = '3'
          this.chooseTitle = '选择智布色号'
          this.chooseSearch = {
            _customerId: {
              prop: 'customerId',
              itemType: 'select',
              itemStyle: { width: '25%' },
              label: '客户',
              clearable: true,
              visibleChange: (value) => {
                if (value) {
                  this.getCustomerSelect('stripeSpacing')
                }
              }
            },
            _sellerTeamId: {
              prop: 'sellerTeamId',
              itemType: 'select',
              itemStyle: { width: '25%' },
              label: '销售团队',
              clearable: true,
              visibleChange: (value) => {
                if (value) {
                  this.getSellTeamSelect('stripeSpacing')
                }
              }
            },
            _sellYear: {
              prop: 'sellYear',
              itemType: 'select',
              itemStyle: { width: '25%' },
              label: '销售年度',
              clearable: true,
              visibleChange: (value) => {
                if (value) {
                  this.getYearSelect('stripeSpacing')
                }
              }
            },
            _sellQuarter: {
              prop: 'sellQuarter',
              itemType: 'select',
              itemStyle: { width: '25%' },
              label: '销售季度',
              clearable: true,
              visibleChange: (value) => {
                if (value) {
                  this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '销售季度' }, 'chooseSearch')
                }
              }
            },
            _code: {
              prop: 'code',
              itemType: 'select',
              itemStyle: { width: '25%' },
              label: '色板单号',
              clearable: true,
              visibleChange: (value) => {
                if (value) {
                  // console.log(value)
                }
              }
            },
            _fabricColorNo: {
              prop: 'fabricColorNo',
              itemType: 'input',
              itemStyle: { width: '25%' },
              clearable: true,
              label: '智布色号'
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
                this.searchFormDatas = params
                this.getFabricColorNo(params)
              },
              submitText: '查询',
              resetHandle: () => {
                this.searchFormDatas = {}
              }
            }
          }
          this.chooseColumns = {
            _customerName: {
              prop: 'customerName',
              label: '客户',
              minWidth: '180'
            },
            _sellerTeamName: {
              prop: 'sellerTeamName',
              label: '销售团队',
              width: '180',
              showOverflowTooltip: true
            },
            _fabricColorNo: {
              prop: 'fabricColorNo',
              label: '智布色号',
              width: '180',
              showOverflowTooltip: true
            },
            _customerColorName: {
              prop: 'customerColorName',
              label: '客户颜色',
              width: '180',
              showOverflowTooltip: true
            },
            _odDyeName: {
              prop: 'odDyeName',
              label: '单双染',
              width: '180',
              showOverflowTooltip: true
            },
            _clothName: {
              prop: 'clothName',
              label: '布类',
              width: '180',
              showOverflowTooltip: true
            },
            _endProductWeight: {
              prop: 'endProductWeight',
              label: '成品克重（g/m²）',
              width: '180',
              showOverflowTooltip: true
            },
            _lstLightSourceName: {
              prop: 'lstLightSourceName',
              label: '1st对色光源',
              width: '180',
              showOverflowTooltip: true
            },
            _twondLightSourceName: {
              prop: 'twondLightSourceName',
              label: '2nd对色光源',
              width: '180',
              showOverflowTooltip: true
            },
            _threerdLightSourceName: {
              prop: 'threerdLightSourceName',
              label: '3rd对色光源',
              width: '180',
              showOverflowTooltip: true
            },
            _yarnUsed: {
              prop: 'yarnUsed',
              label: '用纱信息',
              width: '180',
              showOverflowTooltip: true
            },
            _rgb: {
              prop: 'rgb',
              label: '颜色与预览',
              width: '180',
              showOverflowTooltip: true,
              formater: (scope) => {
                if (scope.row.rgb) {
                  return `<div style="width: 100px; height: 30px;background-color: rgb(${scope.row.rgb})"></div>`
                } else {
                  return ''
                }
              }
            }
          }
          this.isshowCloth = true
          this.choosePagination = {
            currentChange: val => {
              this.getFabricColorNo({ pageSize: this.choosePagination.pageSize || 10, pageNum: val, pageSizes: [10, 20, 30, 40, 50, 100] })
            },
            sizeChange: val => {
              this.$set(this.choosePagination, 'currentPage', 1)
              this.getFabricColorNo({ pageNum: this.choosePagination.pageNum, pageSize: val, pageSizes: [10, 20, 30, 40, 50, 100] })
            }
          }
          this.getFabricColorNo()
          event.target.blur()
        }
      },
      _colorValue: {
        prop: 'colorValue',
        itemType: 'color-picker',
        colorFormat: 'rgb',
        change: (scope) => {
          console.log(scope)
          if (scope) {
            this.$set(this.stripeSpacingContent._colorValue, 'rules', [{ required: true, message: ' ', trigger: 'change' }])
          } else {
            // this.$set(this.stripeSpacingContent._colorValue, 'rules', [commonChangeReg])
            this.$set(this.stripeSpacingContent._colorValue, 'rules', [{ required: true, message: '此项不能为空', trigger: 'change' }])
          }
        },
        rules: [commonChangeReg],
        // itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        label: '颜色预览'
      }
    }
    const stripeSpacingPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '新增条纹间距',
      okText: '保存',
      ok: params => {
        console.log('paramswswwwwww', params, this.stripeSpacingPopOptions)
        params.isOriginal = this.stripeSpacingPopOptions.formDatas.fabriNoTime ? '1' : ''
        delete params.fabriNoTime
        if (this.stripeSpacingPopOptions.title === '新增条纹间距') {
          this.stripeSpacingData.push({ ...params, seq: this.stripeSpacingData.length + 1 })
          this.stripeSpacingData.forEach((it, im) => {
            it.seq = im + 1
          })
          this.$set(this.allContent._stripeSpacingTableForm, 'dataSource', this.stripeSpacingData)
        } else {
          console.log(params)
          this.stripeSpacingData.splice(params.seq - 1, 1, params)
          this.$set(this.allContent._stripeSpacingTableForm, 'dataSource', this.stripeSpacingData)
        }
        if (this.stripeSpacingData && this.stripeSpacingData.length) { // 动态添加校验 不要可以删除  stripeSpacingPopOptions()
          this.$set(this.allContent._range, 'rules', [{ required: true, message: '公差范围不能为空', trigger: 'change' }])
        }
        this.popHandle('', 'stripeSpacing')
        this.$set(this.stripeSpacingPopOptions.formDatas, 'colorValue', '') // 清空存储颜色值
        this.$set(this.stripeSpacingPopOptions.formDatas, 'fabriNoTime', '') // 清空存储颜色值
        delete this.stripeSpacingPopOptions.formDatas.fabriNoTime
      },
      cancel: params => {
        this.popHandle('', 'stripeSpacing')
        this.$set(this.stripeSpacingPopOptions.formDatas, 'colorValue', '') // 清空存储颜色值
        this.$set(this.stripeSpacingPopOptions.formDatas, 'fabriNoTime', '') // 清空存储颜色值
        delete this.stripeSpacingPopOptions.formDatas.fabriNoTime
      },
      formDatas: {},
      formOptions: {},
      content: stripeSpacingContent
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
        clearable: true,
        rules: [commonBlurReg, ismax999Reg],
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
        disabled: true,
        clearable: true
      },
      _amountTax: {
        prop: 'amountTax',
        label: '金额(含税)',
        itemType: 'input',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        disabled: true,
        clearable: true
      },
      _amount: {
        prop: 'amount',
        label: '金额(不含税)',
        itemType: 'input',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        disabled: true,
        clearable: true
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
    // 交期数量弹窗配置
    const quantityDeliveryPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '新增交期数量',
      className: 'quantity-delivery',
      okText: '保存',
      ok: params => {
        console.log(params)
        console.log(this.editAll)

        if (!this.editAll.maxQuantitySeq) {
          this.editAll.maxQuantitySeq = 0
        }
        if (this.quantityDeliveryPopOptions.title === '新增交期数量') {
          // let seq = 0
          // if (this.editAll && this.editAll.quantityDelivery && this.status === '2') {
          //   seq = this.editAll.quantityDelivery[this.editAll.quantityDelivery.length - 1].seq * 1 + 1
          //   this.editAll.quantityDelivery[this.editAll.quantityDelivery.length - 1].seq = seq
          // } else {
          //   seq = this.quantityDeliveryData.length + 1
          // }
          // console.log(seq)
          this.quantityDeliveryData.push({ ...params, code: this.quantityDeliveryData.length + 1, seq: this.status === '2' && this.editAll.orderId ? ++(this.editAll.maxQuantitySeq) * 1 : this.quantityDeliveryData.length + 1 })
          console.log(this.quantityDeliveryData)
          this.$set(this.allContent._quantityDeliveryTableForm, 'dataSource', this.quantityDeliveryData)
        } else {
          console.log(params)
          this.quantityDeliveryData.splice(params.code - 1, 1, params)
          this.$set(this.allContent._quantityDeliveryTableForm, 'dataSource', this.quantityDeliveryData)
        }
        this.popHandle('', 'quantityDelivery')
      },
      cancel: params => {
        this.popHandle('', 'quantityDelivery')
      },
      formDatas: {},
      formOptions: {},
      content: quantityDeliveryContent
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
          // return this.encryptedFieldFormater(scope.row.quantity)
        }
      },
      _auxiliaryQuantity: {
        prop: 'auxiliaryQuantity',
        label: '辅助数量',
        showOverflowTooltip: true,
        formater: (scope) => {
          // return this.$utils.priceFormat(scope.row.auxiliaryQuantity)
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
          // return this.$utils.priceFormat(this.$utils.getFloat(scope.row.amountTax, 2))
          return this.encryptedFieldFormater(scope.row.amountTax)
        }
      },
      _amount: {
        prop: 'amount',
        label: '金额(不含税)',
        showOverflowTooltip: true,
        formater: (scope) => {
          // return this.$utils.priceFormat(this.$utils.getFloat(scope.row.amount, 2))
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
    // 交期数量data
    const quantityDeliveryData = []
    // 交期数量table操作
    const quantityDeliveryOperates = {
      label: '操作',
      width: '120',
      // fixed: 'right',
      dataSource: [
        {
          label: '编辑',
          isShow: true,
          handle: scope => {
            console.log(scope)
            this.popHandle('编辑交期数量', 'quantityDelivery')
            // this.setFormDatas({ ...scope.row, delivery: this.$filters.parseTime(scope.row.delivery) }, 'quantityDelivery')
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
            })
              .then(() => {
                // debugger
                // this.quantityDeliveryData.splice(scope.$index, 1)
                // this.quantityDeliveryData.forEach((item, index) => {
                //   item.seq = this.status === '2' && this.editAll.orderId ? item.seq : index + 1
                // })
              })
              .catch(() => {
                this.$message({ type: 'info', message: '已取消删除' })
              })
          }
        }
      ]
    }
    // 颜色&数量&交期弹窗内容
    const allContent = {
      _customerOrderCode: {
        prop: 'customerOrderCode',
        itemType: 'input',
        itemStyle: { width: '32%', display: 'inline-block', 'margin-bottom': '16px' },
        label: '客户单号',
        maxlength: 50,
        clearable: true
      },
      _styleNumber: {
        prop: 'styleNumber',
        itemType: 'input',
        itemStyle: { width: '32%', display: 'inline-block', 'margin': '0 2% 16px' },
        label: '款号',
        maxlength: 50,
        clearable: true
      },
      _customerClothNumber: {
        prop: 'customerClothNumber',
        itemType: 'input',
        itemStyle: { width: '32%', display: 'inline-block', 'margin-bottom': '16px' },
        label: '客户布号',
        maxlength: 50,
        clearable: true
      },
      _customerColor: {
        prop: 'customerColor',
        itemType: 'input',
        itemStyle: { width: '32%', display: 'inline-block', 'margin-bottom': '16px' },
        label: '客户颜色',
        maxlength: 50,
        clearable: true,
        rules: [commonBlurReg]
      },
      _customerColorEn: {
        prop: 'customerColorEn',
        itemType: 'input',
        itemStyle: { width: '32%', display: 'inline-block', 'margin': '0 2% 16px' },
        label: '客户颜色(英文)',
        maxlength: 50,
        clearable: true
      },
      _fabricColorNo: {
        prop: 'fabricColorNo',
        itemType: 'input',
        className: 'cursorHandel',
        itemStyle: { width: '32%', display: 'inline-block', 'margin-bottom': '16px' },
        label: '智布色号',
        placeholder: '点击选择智布色号',
        clearable: true,
        clear: (form, formDatas, setFormDatas, scope) => {
          this.$set(this.allPopOptions.formDatas, 'fabricColorNo', '')
        },
        // readonly: true,
        focus: (event, form, formDatas, setFormDatas, scope) => {
          if (this.stripeSpacingData.length) {
            this.$message({ type: 'warning', message: '已存在条纹间距，请勿选择智布色号' })
            return
          }
          this.chooseType = '1'
          this.chooseTitle = '选择智布色号'
          this.chooseSearch = {
            _customerId: {
              prop: 'customerId',
              itemType: 'select',
              itemStyle: { width: '25%' },
              label: '客户',
              clearable: true,
              visibleChange: (value) => {
                if (value) {
                  this.getCustomerSelect('allContent')
                }
              }
            },
            _sellerTeamId: {
              prop: 'sellerTeamId',
              itemType: 'select',
              itemStyle: { width: '25%' },
              label: '销售团队',
              clearable: true,
              visibleChange: (value) => {
                if (value) {
                  this.getSellTeamSelect('allContent')
                }
              }
            },
            _sellYear: {
              prop: 'sellYear',
              itemType: 'select',
              itemStyle: { width: '25%' },
              label: '销售年度',
              clearable: true,
              visibleChange: (value) => {
                if (value) {
                  this.getYearSelect('allContent')
                }
              }
            },
            _sellQuarter: {
              prop: 'sellQuarter',
              itemType: 'select',
              itemStyle: { width: '25%' },
              label: '销售季度',
              clearable: true,
              visibleChange: (value) => {
                if (value) {
                  this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '销售季度' }, 'chooseSearch')
                }
              }
            },
            _code: {
              prop: 'code',
              itemType: 'select',
              itemStyle: { width: '25%' },
              label: '色板单号',
              clearable: true,
              visibleChange: (value) => {
                if (value) {
                  this.getSwatchesNoSelect()
                }
              },
              dataSource: []
            },
            _fabricColorNo: {
              prop: 'fabricColorNo',
              itemType: 'input',
              itemStyle: { width: '25%' },
              clearable: true,
              label: '智布色号'
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
                this.searchFormDatas = params
                this.getFabricColorNo(params)
              },
              submitText: '查询',
              resetHandle: () => {
                this.searchFormDatas = {}
              }
            }
          }
          this.chooseColumns = {
            _customerName: {
              prop: 'customerName',
              label: '客户',
              minWidth: '180'
            },
            _sellerTeamName: {
              prop: 'sellerTeamName',
              label: '销售团队',
              width: '180',
              showOverflowTooltip: true
            },
            _fabricColorNo: {
              prop: 'fabricColorNo',
              label: '智布色号',
              width: '180',
              showOverflowTooltip: true
            },
            _customerColorName: {
              prop: 'customerColorName',
              label: '客户颜色',
              width: '180',
              showOverflowTooltip: true
            },
            _odDyeName: {
              prop: 'odDyeName',
              label: '单双染',
              width: '180',
              showOverflowTooltip: true
            },
            _clothName: {
              prop: 'clothName',
              label: '布类',
              width: '180',
              showOverflowTooltip: true
            },
            _endProductWeight: {
              prop: 'endProductWeight',
              label: '成品克重（g/m²）',
              width: '180',
              showOverflowTooltip: true
            },
            _lstLightSourceName: {
              prop: 'lstLightSourceName',
              label: '1st对色光源',
              width: '180',
              showOverflowTooltip: true
            },
            _twondLightSourceName: {
              prop: 'twondLightSourceName',
              label: '2nd对色光源',
              width: '180',
              showOverflowTooltip: true
            },
            _threerdLightSourceName: {
              prop: 'threerdLightSourceName',
              label: '3rd对色光源',
              width: '180',
              showOverflowTooltip: true
            },
            _yarnUsed: {
              prop: 'yarnUsed',
              label: '用纱信息',
              width: '180',
              showOverflowTooltip: true
            },
            _rgb: {
              prop: 'rgb',
              label: '颜色与预览',
              width: '180',
              showOverflowTooltip: true,
              formater: (scope) => {
                if (scope.row.rgb) {
                  return `<div style="width: 100px; height: 30px;background-color: rgb(${scope.row.rgb})"></div>`
                } else {
                  return ''
                }
              }
            }
          }
          this.isshowCloth = true
          this.choosePagination = {
            currentChange: val => {
              this.getFabricColorNo({ pageSize: this.choosePagination.pageSize || 10, pageNum: val, pageSizes: [10, 20, 30, 40, 50, 100] })
            },
            sizeChange: val => {
              this.$set(this.choosePagination, 'currentPage', 1)
              this.getFabricColorNo({ pageNum: this.choosePagination.pageNum, pageSize: val, pageSizes: [10, 20, 30, 40, 50, 100] })
            }
          }
          this.getFabricColorNo()
          event.target.blur()
        }
      },
      _fabricFlowerNo: {
        prop: 'fabricFlowerNo',
        itemType: 'input',
        className: 'cursorHandel',
        itemStyle: { width: '32%', display: 'inline-block', 'margin-bottom': '16px' },
        label: '智布花号',
        placeholder: '点击选择智布花号',
        clearable: true,
        // readonly: true,
        clear: (form, formDatas, setFormDatas, scope) => {
          this.$set(this.allPopOptions.formDatas, 'fabricFlowerNo', '')
        },
        focus: (event, form, formDatas, setFormDatas, scope) => {
          this.tableData = []
          this.chooseType = '2'
          this.chooseTitle = '选择智布花号'
          this.chooseSearch = {
            _customerId: {
              prop: 'customerId',
              itemType: 'select',
              itemStyle: { width: '25%' },
              label: '客户',
              clearable: true,
              visibleChange: (value) => {
                if (value) {
                  this.getCustomerSelect('allContent')
                }
              }
            },
            _orgId: {
              prop: 'orgId',
              itemType: 'select',
              itemStyle: { width: '25%' },
              label: '销售团队',
              clearable: true,
              visibleChange: (value) => {
                if (value) {
                  this.getSellTeamSelect('allContent')
                }
              }
            },
            _sellYear: {
              prop: 'sellYear',
              itemType: 'select',
              itemStyle: { width: '25%' },
              label: '销售年度',
              clearable: true,
              visibleChange: (value) => {
                if (value) {
                  this.getYearSelect('allContent')
                }
              }
            },
            _sellQuarter: {
              prop: 'sellQuarter',
              itemType: 'select',
              itemStyle: { width: '25%' },
              label: '销售季度',
              clearable: true,
              visibleChange: (value, val) => {
                if (value) {
                  this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '销售季度' }, 'chooseSearch')
                }
              }
            },
            _id: {
              prop: 'id',
              itemType: 'select',
              itemStyle: { width: '25%' },
              label: '印花SO单号',
              clearable: true,
              visibleChange: (value) => {
                if (value) {
                  this.getPrintApplyNoSelect()
                }
              }
            },
            _fabricFlowerNo: {
              prop: 'fabricFlowerNo',
              itemType: 'input',
              itemStyle: { width: '25%' },
              clearable: true,
              label: '智布花号'
            },
            _printColorGroupName: {
              prop: 'printColorGroupName',
              itemType: 'input',
              itemStyle: { width: '25%' },
              clearable: true,
              label: '印花颜色名'
            },
            _printCraft: {
              prop: 'printCraft',
              itemType: 'select',
              itemStyle: { width: '25%' },
              label: '印花工艺',
              clearable: true,
              visibleChange: (value) => {
                if (value) {
                  // this.setReferencePlate()
                  this.getPrintCraftSelect('chooseSearch')
                }
              }
            },
            _operate: {
              itemType: 'operate',
              submitHandle: params => {
                this.searchFormDatas = params
                this.getFlowerNo(params)
              },
              submitText: '查询',
              resetHandle: () => {
                this.searchFormDatas = {}
              }
            }
          }
          this.chooseColumns = {
            _customerName: {
              prop: 'customerName',
              label: '客户',
              minWidth: '180'
            },
            _orgName: {
              prop: 'orgName',
              label: '销售团队',
              width: '180',
              showOverflowTooltip: true
            },
            _fabricFlowerNo: {
              prop: 'fabricFlowerNo',
              label: '智布花号',
              width: '180',
              showOverflowTooltip: true
            },
            _clothName: {
              prop: 'clothName',
              label: '布类',
              width: '180',
              showOverflowTooltip: true
            },
            _composition: {
              prop: 'composition',
              label: '成份',
              width: '180',
              showOverflowTooltip: true
            },
            _printColorName: {
              prop: 'printColorName',
              label: '印花颜色名',
              width: '180',
              showOverflowTooltip: true
            },
            _printCraft: {
              prop: 'printCraft',
              label: '印花工艺',
              width: '180',
              showOverflowTooltip: true
            },
            _lstLightSourceName: {
              prop: 'lstLightSourceName',
              label: '1st对色光源',
              width: '180',
              showOverflowTooltip: true
            },
            _twondLightSourceName: {
              prop: 'twondLightSourceName',
              label: '2nd对色光源',
              width: '180',
              showOverflowTooltip: true
            },
            // _clothi: {
            //   prop: 'clothi',
            //   label: '3rd对色光源',
            //   width: '180',
            //   showOverflowTooltip: true
            // },
            _printColorDesign: {
              prop: 'printColorDesign',
              label: '印花图案',
              width: '180',
              showOverflowTooltip: true,
              formater: (scope) => {
                return scope.row.printColorDesign ? `<img class="printColorDesign" src='${scope.row.printColorDesign}' />` : ''
              }
            }
          }
          this.isshowCloth = true
          this.choosePagination = {
            currentChange: val => {
              this.getFlowerNo({ pageSize: this.choosePagination.pageSize || 10, pageNum: val, pageSizes: [10, 20, 30, 40, 50, 100] })
            },
            sizeChange: val => {
              this.$set(this.choosePagination, 'currentPage', 1)
              this.getFlowerNo({ pageNum: this.choosePagination.pageNum, pageSize: val, pageSizes: [10, 20, 30, 40, 50, 100] })
            }
          }
          this.getFlowerNo()
          event.target.blur()
        }
      },
      _priceTax: {
        prop: 'priceTax',
        itemType: 'input',
        itemStyle: { width: '32%', display: 'inline-block', 'margin': '0 2% 16px' },
        label: '单价(含税)',
        rules: [commonBlurReg, max999Regtype],
        clearable: true,
        blur: (scope) => {
          this.priceTaxBlur(scope.target.value)
        }
      },
      _price: {
        prop: 'price',
        itemType: 'input',
        itemStyle: { width: '32%', display: 'inline-block', 'margin-bottom': '16px' },
        label: '单价(不含税)',
        rules: [max999Regtype],
        clearable: true,
        blur: (scope) => {
          this.priceBlur(scope.target.value)
        }
      },
      _shearingRequirements: {
        itemType: 'view',
        text: '剪板要求',
        style: { width: '80%', 'padding': '16px 0', 'font-size': '16px', display: 'inline-block' }
      },
      _shearingRequirementsAdd: {
        itemType: 'itemview',
        label: '',
        itemStyle: { display: 'inline-block', 'margin-bottom': '16px', position: 'absolute', right: '0px', 'margin-top': '10px' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<el-button size="mini" type="primary" class="addButton">新增</el-button>`
        },
        handle: () => {
          this.popHandle('新增剪版要求', 'shearingRequirements')
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
        style: { 'padding': '16px 0', 'font-size': '16px', display: 'inline-block' }
      },
      _range: {
        prop: 'range',
        itemType: 'select',
        label: '公差范围',
        valueType: 'object',
        clearable: true,
        itemStyle: { width: '32%', display: 'inline-block', 'margin': '0 38% 16px 32px' },
        // rules: [{ required: true, message: '公差范围不能为空', trigger: 'change' }],
        visibleChange: (value) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '公差范围(条纹间距)' }, 'stripeSpacingRange')
          }
        },
        dataSource: [
          // {
          //   label: '1',
          //   value: '1'
          // }
        ]
      },
      _stripeSpacingAdd: {
        itemType: 'itemview',
        label: '',
        itemStyle: { display: 'inline-block', 'margin-bottom': '16px', position: 'absolute', right: '0px', 'margin-top': '10px' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<el-button size="mini" type="primary" class="addButton">新增</el-button>`
        },
        handle: () => {
          const colorBasic = this.$refs.allPop.$refs.popComponents.formDatas
          if (colorBasic && colorBasic.fabricColorNo) {
            this.$message({ type: 'warning', message: '已存在智布色号，不能新增条纹间距' })
            return
          } else {
            this.popHandle('新增条纹间距', 'stripeSpacing')
            this.$set(this.stripeSpacingContent._colorValue, 'disabled', false)
            this.$set(this.stripeSpacingContent._colorValue, 'readonly', false)
          }
        }
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
        operates: stripeSpacingOperates
      },
      _quantityDelivery: {
        itemType: 'view',
        text: '数量交期',
        style: { width: '80%', 'padding': '16px 0', 'font-size': '16px', display: 'inline-block' }
      },
      _quantityDeliveryAdd: {
        itemType: 'itemview',
        label: '',
        itemStyle: { display: 'inline-block', 'margin-bottom': '16px', position: 'absolute', right: '0px', 'margin-top': '10px' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<el-button size="mini" type="primary" class="addButton">新增</el-button>`
        },
        handle: () => {
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
        console.log(params)
        console.log(this.orderDataSource)
        if (!params.quantityDelivery.length) {
          this.$message({ type: 'error', message: '请至少添加一条数量交期' })
          return
        }
        // if (!this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary) {
        //   this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary = {}
        // }
        // // console.log(this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.maxColorSeq)
        // if (!this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary || !this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.maxColorSeq) {
        //   this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.maxColorSeq = 0
        // }
        if (this.allPopOptions.title === '新增颜色&数量&交期') {
          let flag = false
          for (const item of this.colorInfo) {
            // 如果两条记录完全一样
            const originItem = {
              customerClothNumber: item.customerClothNumber || '',
              customerColor: item.customerColor || '',
              customerColorEn: item.customerColorEn || '',
              customerOrderCode: item.customerOrderCode || '',
              fabricColorNo: item.fabricColorNo || '',
              fabricFlowerNo: item.fabricFlowerNo || '',
              price: item.price ? item.price + '' : '',
              priceTax: item.priceTax ? item.priceTax + '' : '',
              styleNumber: item.styleNumber || ''
            }
            // 清空多余字段
            const orig = originItem.stripeSpacing
            const origData = []
            if (orig && orig.length) {
              orig.forEach((im) => {
                const obj = {
                  colorName: im.colorName || '',
                  colorValue: im.colorValue || '',
                  fabricColorNo: im.fabricColorNo || '',
                  height: String(im.height) || ''
                  // isOriginal: im.isOriginal,
                  // seq: im.seq
                }
                origData.push(obj)
              })
              originItem.stripeSpacing = origData
            }
            console.log('originItem2', originItem)
            const paramsItem = {
              customerClothNumber: params.customerClothNumber || '',
              customerColor: params.customerColor || '',
              customerColorEn: params.customerColorEn || '',
              customerOrderCode: params.customerOrderCode || '',
              fabricColorNo: params.fabricColorNo || '',
              fabricFlowerNo: params.fabricFlowerNo || '',
              price: params.price ? params.price + '' : '',
              priceTax: params.priceTax ? params.priceTax + '' : '',
              styleNumber: params.styleNumber || ''
            }

            // 清空多余字段
            const origpara = paramsItem.stripeSpacing
            const origparaData = []
            if (origpara && origpara.length) {
              origpara.forEach((im) => {
                const obj = {
                  colorName: im.colorName || '',
                  colorValue: im.colorValue || '',
                  fabricColorNo: im.fabricColorNo || '',
                  height: String(im.height) || ''
                  // isOriginal: im.isOriginal,
                  // seq: im.seq
                }
                origparaData.push(obj)
              })
              paramsItem.stripeSpacing = origparaData
            }

            // 深度对比两个对象是否相等
            console.log('新增')
            console.log(originItem)
            console.log(paramsItem)
            console.log(JSON.stringify(originItem) === JSON.stringify(paramsItem))
            if (this.$utils.deepCompare(originItem, paramsItem)) {
              flag = true
            }
          }
          if (flag) {
            this.$message({ type: 'error', message: '不能添加相同的客户单号，款号，客户布号，客户颜色，客户颜色(英文)，智布色号，智布花号，单击(含税)，单价(不含税)，条纹间距' })
            return
          }
          const dataTim = new Date().getTime()
          params = { ...params, code: this.colorInfo.length + 1, dataTim: dataTim, seq: this.status === '2' ? ++this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.maxColorSeq : this.colorInfo.length + 1 }
          console.log(params)
          this.colorInfo.push(params)
          let arr = []
          if (params.quantityDelivery && params.quantityDelivery.length > 1) {
            params.quantityDelivery.forEach((item) => {
              const data = {
                seq: this.status === '2' ? ++this.editAll.maxColorSeq : this.quantityDeliveryData.length + 1,
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
                stripeSpacing: params.stripeSpacing || [],
                quantityDelivery: [item] || [],
                // code: this.rowIndex + '-' + (params.code * 1),
                code: params.code,
                dataTim: dataTim
              }
              arr.push(data)
            })
          } else {
            arr = [...new Array(1).fill(params)]
          }
          console.log(arr)
          this.colorInfoTemp = [...this.colorInfoTemp, ...arr]
          // 计算总数量和总金额(含税)
          let totalQuantity = 0
          let totalAmount = 0
          this.colorInfoTemp.length && this.colorInfoTemp.forEach(item => {
            if (item.quantityDelivery && item.quantityDelivery.length) {
              item.quantityDelivery.forEach(item2 => {
                totalAmount = Number(totalAmount) + Number(item2.amountTax) // 总金额(含税)
                totalQuantity = Number(totalQuantity) + Number(item2.quantity) // 总数量
              })
              // totalQuantity += item.quantityDelivery[0].auxiliaryQuantity
              // totalAmount += item.quantityDelivery[0].amountTax
            }
          })
          this.totalQuantity = totalQuantity
          this.totalAmount = totalAmount
          // this.dataPretreatment(this.colorInfoTemp, 'dataTim', 'color')
          console.log(this.colorInfoTemp)
          console.log(this.colorInfo)
          console.log(this.totalQuantity)
          console.log(this.totalAmount)
          // totalTax
        } else {
          console.log(params)
          console.log(this.colorInfo)
          console.log('index', this.editAll)
          let flag = false
          for (const item of this.colorInfo) {
            if (item.dataTim === params.dataTim) { // 循环到当前记录
              console.log('编辑-循环到当前记录')
            } else {
              console.log('编辑-循环不是当前记录')
              // 如果两条记录完全一样
              const originItem = {
                customerClothNumber: item.customerClothNumber || '',
                customerColor: item.customerColor || '',
                customerColorEn: item.customerColorEn || '',
                customerOrderCode: item.customerOrderCode || '',
                fabricColorNo: item.fabricColorNo || '',
                fabricFlowerNo: item.fabricFlowerNo || '',
                price: item.price ? item.price + '' : '',
                priceTax: item.priceTax ? item.priceTax + '' : '',
                styleNumber: item.styleNumber || ''
              }
              // 清空多余字段
              const orig = originItem.stripeSpacing
              const origData = []
              if (orig && orig.length) {
                orig.forEach((im) => {
                  const obj = {
                    colorName: im.colorName || '',
                    colorValue: im.colorValue || '',
                    fabricColorNo: im.fabricColorNo || '',
                    height: String(im.height) || ''
                    // isOriginal: im.isOriginal,
                    // seq: im.seq
                  }
                  origData.push(obj)
                })
                originItem.stripeSpacing = origData
              }
              console.log('originItem3', originItem)
              const paramsItem = {
                customerClothNumber: params.customerClothNumber || '',
                customerColor: params.customerColor || '',
                customerColorEn: params.customerColorEn || '',
                customerOrderCode: params.customerOrderCode || '',
                fabricColorNo: params.fabricColorNo || '',
                fabricFlowerNo: params.fabricFlowerNo || '',
                price: params.price ? params.price + '' : '',
                priceTax: params.priceTax ? params.priceTax + '' : '',
                styleNumber: params.styleNumber || ''
              }

              // 清空多余字段
              const origpara = paramsItem.stripeSpacing
              const origparaData = []
              if (origpara && origpara.length) {
                origpara.forEach((im) => {
                  const obj = {
                    colorName: im.colorName || '',
                    colorValue: im.colorValue || '',
                    fabricColorNo: im.fabricColorNo || '',
                    height: String(im.height) || ''
                    // isOriginal: im.isOriginal,
                    // seq: im.seq
                  }
                  origparaData.push(obj)
                })
                paramsItem.stripeSpacing = origparaData
              }

              // 深度对比两个对象是否相等
              console.log('编辑')
              console.log(originItem)
              console.log(paramsItem)
              console.log(JSON.stringify(originItem) === JSON.stringify(paramsItem))
              if (this.$utils.deepCompare(originItem, paramsItem)) {
                flag = true
              }
            }
          }
          if (flag) {
            this.$message({ type: 'error', message: '不能添加相同的客户单号，款号，客户布号，客户颜色，客户颜色(英文)，智布色号，智布花号，单击(含税)，单价(不含税)，条纹间距' })
            return
          }
          this.summaryId = params.summaryId
          // 处理传给后端的数据
          // const dataTim = new Date().getTime()
          // const data = {
          //   // code: this.rowIndex + '-' + (index * 1 + 1),
          //   seq: params.seq * 1,
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
          this.colorInfo.splice(this.editAll.index, 1, params)// 代码有问题，编辑后影响产品信息数据还原
          // 处理页面上的数据
          this.colorInfoTemp = []
          console.log(this.colorInfo)
          this.colorInfo.forEach(item => {
            if (item.quantityDelivery && item.quantityDelivery.length > 1) {
              item.quantityDelivery.forEach(items => {
                const data = {
                  // code: this.rowIndex + '-' + (index * 1 + 1),
                  seq: item.seq * 1,
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
                console.log(data)
                this.colorInfoTemp.push(data)
              })
            } else {
              this.colorInfoTemp = [...this.colorInfoTemp, ...new Array(1).fill({ ...item, dataTim: item.dataTim || '' })]
            }
          })
          // 计算总数量和总金额(含税)
          let totalQuantity = 0
          let totalAmount = 0
          this.colorInfoTemp.length && this.colorInfoTemp.forEach(item => {
            if (item.quantityDelivery && item.quantityDelivery.length) {
              item.quantityDelivery.forEach(item2 => {
                totalAmount = Number(totalAmount) + Number(item2.amountTax) // 总金额(含税)
                totalQuantity = Number(totalQuantity) + Number(item2.quantity) // 总数量
              })
              // totalQuantity += item.quantityDelivery[0].auxiliaryQuantity
              // totalAmount += item.quantityDelivery[0].amountTax
            }
          })
          this.totalQuantity = totalQuantity
          this.totalAmount = totalAmount
          console.log(this.totalQuantity)
          console.log(this.totalAmount)
          this.dataPretreatment(this.colorInfoTemp, 'dataTim', 'color')
        }

        this.allPopHandle()
      },
      cancel: params => {
        this.allPopHandle()
      },
      formDatas: {},
      formOptions: {},
      content: allContent
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
    // 全局数据初始化
    const InitialArray = {
      seq: 1, // 序号
      garmentPart: '', // 成衣部位
      cloth: '', // 布类名称
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
        maxColorSeq: '',
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
      materialInfo: [
        // { // 原料信息 ,CoMaterialInfoAddReq
        //   type: '0', // 类型{0=天然纤维,1=化学纤维,2=组合纱线}
        //   certificate: '', // 证书要求ID
        //   supplierYarnCode: '', // 供应商纱线编码
        //   naturalFiber: [// 天然纤维 ,CoNaturalFiberAddReq
        //     {
        //       yarn: '', // 纱支ID
        //       element: {// 成份
        //         value: '',
        //         label: '',
        //         type: '1'
        //       },
        //       elementRatio: '', // 比例
        //       yarnCategory: ''// 纱类
        //     }
        //   ],
        //   chemicalFiber: [ // 化学纤维 ,CoChemicalFiberAddReq
        //     {
        //       fineness: '', // 细度ID
        //       element: '', // 成份
        //       wireCategory: ''// 丝类
        //     }
        //   ]
        // }
      ]
    }
    return {
      status: '',
      maxValue: 0,
      newValue: 0,
      rowIndex: 1,
      newColorValue: 0,
      newColorChildValue: 0,
      baseData,
      addData,
      basicData: {},
      formOptions: {
        size: 'small',
        inline: true
        // disabled: true
      },
      baseFormDatas: {
        isSettlement: 0,
        taxRate: '0'
      },
      leftFormDatas: {},
      formDatas: {},
      headerCellStyle,
      headerTitleLeftStyle,
      headerTitleRightStyle,
      columns,
      operates,
      dataSource,
      orderDataSource,
      sampleAnalysisResultId: '', // 详情时回显的客样分析编号
      ruleForm: {
        sampleAnalysisResultId: ''
      },
      rules: {
        sampleAnalysisResultId: [
          { required: true, message: '请选择客样分析编号', trigger: 'change' }
        ]
      },
      versionColumns,
      versionOperatesData,
      versionOperates,
      versionData: [],
      productData,
      materialColumns,
      materialOperatesData,
      materialOperates,
      materialData: [],
      allColumns,
      allOperatesData,
      allOperates,
      colorQuantityDeliverySummary: {}, //  颜色数量交期汇总信息
      // colorInfo: [
      //   {
      //     customerOrderCode: '',
      //     styleNumber: '',
      //     customerClothNumber: '',
      //     customerColor: '',
      //     customerColorEn: '',
      //     fabricColorNo: '',
      //     fabricFlowerNo: '',
      //     priceTax: '',
      //     price: '',
      //     range: '',
      //     shearingRequirements: [],
      //     stripeSpacing: [],
      //     quantityDelivery: []
      //   }
      // ],
      colorInfo: [],
      colorInfoTemp: [],
      versionContent,
      versionPopOptions,
      materialContent,
      materialPopOptions,
      naturalFiberContent,
      naturalFiberPopOptions,
      chemicalFiberContent,
      chemicalFiberPopOptions,
      naturalFiberColumns,
      naturalFiberData,
      naturalFiberOperatesData,
      naturalFiberOperates,
      chemicalFiberColumns,
      chemicalFiberData,
      chemicalFiberOperatesData,
      chemicalFiberOperates,
      naturalFiberCombineData,
      chemicalFiberCombineData,
      allContent,
      allPopOptions,
      shearingRequirementsColumns,
      shearingRequirementsData,
      shearingRequirementsOperates,
      shearingRequirementsContent,
      shearingRequirementsPopOptions,
      stripeSpacingColumns,
      stripeSpacingData,
      stripeSpacingOperates,
      stripeSpacingContent,
      stripeSpacingPopOptions,
      quantityDeliveryContent,
      quantityDeliveryPopOptions,
      quantityDeliveryColumns,
      quantityDeliveryData,
      quantityDeliveryOperates,
      pagination,
      chooseTitle: '', // 选择弹窗标题
      chooseType: '', // 选择弹窗类型 1:智布色号 2:智布花号 3:条纹间距智布色号
      chooseSearch: {},
      chooseColumns: {},
      tableData: [],
      isshowCloth: false,
      tab: '0',
      unit: {
        label: '',
        value: ''
      },
      unitOptions: [
        {
          label: '"',
          value: '"'
        }
      ],
      // sampleAnalysisResultId: '',
      sampleAnalysisResultOption: [
        {
          label: '"',
          value: '"'
        }
      ],
      InitialArray,
      RawMaterialArray: [], // 保存原料信息的数组
      rows: [], // 交期合并储存数组
      pos: 0,
      mergingRows: [], // 交期合并储存数组
      mergingPos: 0,
      totalQuantity: 0,
      totalAmount: 0,
      detailParams: {},
      editCombineData: {}, // 编辑某条组合纤维数据
      editAll: {}, // 编辑某条数量交期数据
      cancelAll: {}, // 删除某条数量交期数据
      editChemistryData: {}, // 化学
      editnaturalData: {},
      isTian: false,
      isHuan: false,
      naturaEven: '',
      InformationDeletion: '', // 组合信息删除保留一下
      summaryId: '', // 编辑颜色数量交期时拿到该条的summaryId
      choosePagination: {}, // 色号、花号的弹窗页码
      rebclass: '', // 智布花号rgb
      versionInfoLength: '',
      currencyDatas: [],
      currencyCode: '' // 币别
    }
  },
  computed: {
    getEditClass() {
      if (this.isEdit) {
        return 'editClass'
      } else {
        return 'detailClass'
      }
    }
  },
  watch: {
    isEdit: {
      handler(val, oldVal) {
        console.log(val)
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
    // 监听路由是否带有rowIndex
    $route: {
      async handler(v) {
        console.log(v)
        if (v.query.rowIndex) {
          this.rowIndex = v.query.rowIndex * 1
        }
      },
      deep: true,
      immediate: true
    },
    orderData: {
      handler(v) {
        console.log(v)

        if (v && Object.keys(v).length) {
          this.versionInfoLength = v.version || 0
          this.setDetailData(v)
          if (v.demandSource && v.demandCode) {
            this.orderDataDis()
          }

          if (this.$route.query.requireId) {
            const sup = ['brand', 'customer', 'seller', 'sellYear', 'sellQuarter', 'salesTeam', 'orderType']
            const supTwo = ['currency', 'pricingTerm', 'paymentTerm']
            if (this.orderData.isSettlement) {
              const arrum = [...sup, ...supTwo]
              arrum.forEach(item => {
                this.$set(this.basicData['_' + item], 'dataSource', this.orderData[item] && this.orderData[item].value ? [this.orderData[item]] : null)
              })
            } else {
              const sup = ['brand', 'customer', 'seller', 'sellYear', 'sellQuarter', 'salesTeam', 'orderType']
              sup.forEach(item => {
                // debugger
                const tempData = (this.orderData[item] && this.orderData[item].value) ? [this.orderData[item]] : []
                // console.log(tempData)
                // console.log(this.orderData, this.orderData[item], this.basicData['_' + item], tempData)
                this.$set(this.basicData['_' + item], 'dataSource', tempData)
              })
            }
            this.baseFormDatas = v
            // this.$set(this.baseFormDatas, 'brand', {lable: "∑(っ°Д°;)っ", value: "573"})

            // console.log(this.baseFormDatas, this.basicData)
          }
          this.currencyDatas.forEach(item => {
            if (item.value === v.currency.value) {
              this.currencyCode = item.code
            }
          })
          this.setOrderDtail()
          this.setHomeList(this.rowIndex)
        }
      },
      deep: true
      // immediate: true
    },
    rowIndex: {
      handler(val, oldVal) {
        console.log(1)
        console.log(val)
        if (val) {
          this.setHomeList(val * 1)
        }
      },
      deep: true
      // immediate: true
    }
  },
  created() {
    // console.log(this.orderData,"orderData");
    this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '成衣部位' }, 'garmentPart')
    this.getClothSelect()
    this.getPrintCraftSelect('product')
    this.getUnitsSelect()
    this.getCurrencySelect() // 币别
    this.getSampleAnalysisNoSelect()
    // this.getBrandSelect()
  },
  mounted() {
    this.changeOptionStatus()
  },
  methods: {
    // 根据详情中返回的样板单号取客样分析编号回显
    getSampleAnalysisResultId() {
      let sampleAnalysisResultId = ''
      if (this.ruleForm.sampleAnalysisResultId) {
        const arr = this.sampleAnalysisResultOption.filter(item => {
          return this.ruleForm.sampleAnalysisResultId === item.value
        })
        if (arr.length) {
          sampleAnalysisResultId = arr[0].label
        } else {
          sampleAnalysisResultId = this.ruleForm.sampleAnalysisResultId
        }
      } else {
        sampleAnalysisResultId = ''
      }
      return sampleAnalysisResultId
    },
    // 保存拿到所有订单数据
    DataSummary() {
      const orderLeft = this.$refs.dataSourceMix.dynamicValidateFormRuleForm.tableForm // 订单左侧表
      let productData = this.$refs.productData.dynamicValidateFormRuleForm // 产品信息数据
      // this.$set(this, 'orderDataSource', orderLeft)
      console.log(orderLeft)
      console.log(productData)
      console.log(this.colorInfo)
      productData = {
        ingredient: productData.ingredient && productData.ingredient.value ? productData.ingredient : undefined,
        ratio: productData.ratio || '',
        dryWay: productData.dryWay || '',
        shrinkL: productData.shrinkL || '',
        shrinkW: productData.shrinkW || '',
        printCraft: productData.printCraft ? productData.printCraft === 'null' ? '' : JSON.stringify(productData.printCraft) : '' || '',
        dyeCraft: productData.dyeCraft ? JSON.stringify(productData.dyeCraft) : '',
        suggestWidth: productData.suggestWidth ? productData.suggestWidth === 'null' ? '' : productData.suggestWidth : '' || '',
        range: productData.range || '',
        weightBefore: productData.weightBefore ? productData.weightBefore === 'null' ? '' : productData.weightBefore : '' || '',
        weightBeforeRange: productData.weightBeforeRange || '',
        weightAfter: productData.weightAfter ? productData.weightAfter === 'null' ? '' : productData.weightAfter : '' || '',
        weightAfterRange: productData.weightAfterRange || '',
        weightBeforeUnit: 'g/m²',
        weightAfterUnit: 'g/m²',
        suggestWidthUnit: productData.suggestWidthUnit,
        orderDetailId: productData.orderDetailId || '',
        orderId: productData.orderId || ''
      }
      if (!productData.sampleAnalysisResultId) {
        delete productData.sampleAnalysisResultId
      }
      // productData = { ...productData, printCraft: productData.printCraft ? JSON.stringify(productData.printCraft) : '', dyeCraft: productData.dyeCraft ? JSON.stringify(productData.dyeCraft) : '', weightBeforeUnit: 'g/m²', weightAfterUnit: 'g/m²' }
      const parmas = {
        ...orderLeft[this.rowIndex - 1],
        ...productData,
        sampleAnalysisResultId: this.ruleForm.sampleAnalysisResultId,
        referenceVersionInfo: this.versionData, //  参板信息数据,
        colorQuantityDeliverySummary: { //  颜色数量交期汇总信息
          unit: {
            label: this.unit.label || '',
            value: '' + this.unit.value || ''
          },
          summaryId: this.detailParams.detail && this.detailParams.detail.length && this.detailParams.detail[this.rowIndex - 1] && this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary ? this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary.summaryId : '',
          totalQuantity: this.totalQuantity || 0,
          totalAmount: this.totalAmount || 0,
          // colorInfo: this.colorInfo.length ? [this.colorInfo[this.rowIndex - 1]] : []
          colorInfo: this.colorInfo.length ? this.colorInfo : []
        }
        // materialInfo: this.RawMaterialArray.length ? this.RawMaterialArray : []// 原料信息
      }
      this.orderDataSource[this.rowIndex - 1] = { ...this.orderDataSource[this.rowIndex - 1], ...parmas }
      this.orderDataSource[0].materialInfo = this.RawMaterialArray.length ? this.RawMaterialArray : []// 原料信息

      console.log('this.orderDataSource', this.orderDataSource)
      return this.orderDataSource
    },
    // 编辑时点击左侧切换保存此份数据
    saveRowData() {
      const orderLeft = this.$refs.dataSourceMix.dynamicValidateFormRuleForm.tableForm // 订单左侧表
      let productData = this.$refs.productData.dynamicValidateFormRuleForm // 产品信息数据
      // this.$set(this, 'orderDataSource', orderLeft)
      productData = {
        ingredient: productData.ingredient || '',
        ratio: productData.ratio || '',
        dryWay: productData.dryWay || '',
        shrinkL: productData.shrinkL || '',
        shrinkW: productData.shrinkW || '',
        printCraft: productData.printCraft ? JSON.stringify(productData.printCraft) : '',
        dyeCraft: productData.dyeCraft ? JSON.stringify(productData.dyeCraft) : '',
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
      if (!productData.sampleAnalysisResultId) {
        delete productData.sampleAnalysisResultId
      }

      const parmas = {
        ...orderLeft[this.rowIndex - 1],
        ...productData,
        sampleAnalysisResultId: this.ruleForm.sampleAnalysisResultId,
        referenceVersionInfo: this.versionData, //  参板信息数据,
        colorQuantityDeliverySummary: { //  颜色数量交期汇总信息
          unit: {
            label: this.unit.label || '',
            value: this.unit && this.unit.value ? ('' + this.unit.value) : ''
          },
          summaryId: this.colorInfo && this.colorInfo.length && this.colorInfo[0].summaryId ? this.colorInfo[0].summaryId : '',
          totalQuantity: this.totalQuantity || 0,
          totalAmount: this.totalAmount || 0,
          // colorInfo: this.colorInfo.length ? [this.colorInfo[this.rowIndex - 1]] : []
          colorInfo: this.colorInfo.length ? this.colorInfo : []
        }

        // materialInfo: this.RawMaterialArray.length ? this.RawMaterialArray : []// 原料信息
      }
      this.orderDataSource[this.rowIndex - 1] = { ...this.orderDataSource[this.rowIndex - 1], ...parmas }
      // this.orderDataSource[0].materialInfo = this.RawMaterialArray.length ? this.RawMaterialArray : []// 原料信息
      console.log(this.orderDataSource, this.rowIndex, 'qiehuan')
    },
    // 新增、编辑时设置分录页面数据
    setOrderDtail() {
      this.colorInfo = []
      this.colorInfoTemp = []
      this.$set(this.dataSource[0], 'dataSource', this.orderDataSource)
      // this.$set(this.$refs.dataSourceMix.dataSource, 'dataSource', this.orderDataSource)
      this.versionData = this.orderDataSource[this.rowIndex - 1] && this.orderDataSource[this.rowIndex - 1].referenceVersionInfo ? this.orderDataSource[this.rowIndex - 1].referenceVersionInfo : []
      this.formDatas = {}
      // 设置当前条数据时 先把页面上的数据清一次 可能会把后端其他id等字段带出
      this.$set(this.$refs.productData, 'dynamicValidateFormRuleForm', {})
      this.formDatas = { ...this.orderDataSource[this.rowIndex - 1], printCraft: this.orderDataSource[this.rowIndex - 1].printCraft ? JSON.parse(this.orderDataSource[this.rowIndex - 1].printCraft) : '', dyeCraft: this.orderDataSource[this.rowIndex - 1].dyeCraft ? JSON.parse(this.orderDataSource[this.rowIndex - 1].dyeCraft) : '' }
      this.$set(this.productData._dyeCraft.componentsOptions, 'checkValList', this.formDatas.dyeCraft || [])
      this.orderDataSource.forEach((itx, icx) => {
        console.log(itx)
        itx.code = icx + 1
        itx.materialInfo = this.RawMaterialArray[icx]
      })
      console.log(this.orderDataSource)
      if (this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary && this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.colorInfo && this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.colorInfo.length) {
        this.colorInfo = this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.colorInfo
        this.colorInfo.forEach((item, index) => {
          item.code = index + 1
        })
        this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.colorInfo.forEach((item, index) => {
          console.log(item)
          if (item.quantityDelivery && item.quantityDelivery.length) {
            item.quantityDelivery.forEach(items => {
              const listItem = {
                code: index + 1,
                // code: this.rowIndex + '-' + (index * 1 + 1),
                seq: items.seq || '',
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
                this.colorInfoTemp.push({ ...listItem, dataTim: '' + index })
              } else {
                this.colorInfoTemp.push(listItem)
              }
              // debugger
            })
          } else {
            this.colorInfoTemp.push(item)
          }
        })
        console.log(this.colorInfoTemp, '7777777777')
        this.dataPretreatment(this.colorInfoTemp, 'dataTim', 'color')
      } else {
        this.colorInfo = []
        this.colorInfoTemp = []
      }
      console.log(this.colorInfo)
      this.ruleForm.sampleAnalysisResultId = this.orderDataSource[this.rowIndex - 1] && this.orderDataSource[this.rowIndex - 1].sampleAnalysisResultId ? this.orderDataSource[this.rowIndex - 1].sampleAnalysisResultId : ''
      this.totalAmount = this.orderDataSource[this.rowIndex - 1] && this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary && this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.totalAmount ? this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.totalAmount : ''
      this.totalQuantity = this.orderDataSource[this.rowIndex - 1] && this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary && this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.totalQuantity ? this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.totalQuantity : ''
      this.unit = this.orderDataSource[this.rowIndex - 1] && this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary && this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.unit ? this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.unit : {}
      // 清除客样分析编号、产品部分的校验
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
        this.$refs.productData.form.clearValidate()
      })
    },
    // 详情页面设置第一条数据
    setDetailData(val) {
      // 字段加密处理
      this.$nextTick(() => {
        this.encryptFn(this.basicData, val['_rule'], this.isEdit ? 'edit' : 'info')
        this.encryptFn(this.productData, val['_rule'], this.isEdit ? 'edit' : 'info')
      })
      console.log(val)
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
        this.baseFormDatas = this.detailParams
        const orderDataSource = this.detailParams.detail.map((item, index) => {
          return {
            code: index + 1,
            seq: item.seq,
            garmentPart: item.garmentPart ? { label: item.garmentPart.label, value: item.garmentPart.value } : '',
            cloth: item.cloth ? { label: item.cloth.label, value: '' + item.cloth.value } : '',
            edit: true,
            materialInfo: item.materialInfo && item.materialInfo.length ? item.materialInfo : [] // xj
          }
        })
        this.$set(this.dataSource[0], 'dataSource', orderDataSource)
        this.$nextTick(() => {
          this.$set(this.dataSource[0], 'currentRowKey', this.rowIndex)
        })

        // this.$refs.dataSourceMix.dataSource[0].dataSource = orderDataSource
        if (this.detailParams.detail && this.detailParams.detail.length && this.detailParams.detail[this.rowIndex - 1].printCraft) {
          this.detailParams.detail[this.rowIndex - 1] = { ...this.detailParams.detail[this.rowIndex - 1], printCraft: JSON.parse(this.detailParams.detail[this.rowIndex - 1].printCraft) }
          // this.detailParams.detail[0].printCraft = JSON.parse(this.detailParams.detail[0].printCraft)
        } else {
          this.detailParams.detail[this.rowIndex - 1].printCraft = ''
        }
        if (this.detailParams.detail && this.detailParams.detail.length && this.detailParams.detail[this.rowIndex - 1].dyeCraft) {
          this.detailParams.detail[this.rowIndex - 1] = { ...this.detailParams.detail[this.rowIndex - 1], dyeCraft: JSON.parse(this.detailParams.detail[this.rowIndex - 1].dyeCraft) }
          this.$set(this.productData._dyeCraft.componentsOptions, 'checkValList', this.detailParams.detail[this.rowIndex - 1].dyeCraft)
        } else {
          this.detailParams.detail[this.rowIndex - 1].dyeCraft = ''
        }
        this.formDatas = {
          ingredient: this.detailParams.detail[this.rowIndex - 1].ingredient || '',
          ratio: this.detailParams.detail[this.rowIndex - 1].ratio || '',
          dryWay: this.detailParams.detail[this.rowIndex - 1].dryWay || '',
          shrinkL: this.detailParams.detail[this.rowIndex - 1].shrinkL || '',
          shrinkW: this.detailParams.detail[this.rowIndex - 1].shrinkW || '',
          printCraft: this.detailParams.detail[this.rowIndex - 1].printCraft || '',
          dyeCraft: this.detailParams.detail[this.rowIndex - 1].dyeCraft || '',
          suggestWidth: this.detailParams.detail[this.rowIndex - 1].suggestWidth || '',
          range: this.detailParams.detail[this.rowIndex - 1].range || '',
          weightBefore: this.detailParams.detail[this.rowIndex - 1].weightBefore || '',
          weightBeforeRange: this.detailParams.detail[this.rowIndex - 1].weightBeforeRange || '',
          weightAfter: this.detailParams.detail[this.rowIndex - 1].weightAfter || '',
          weightAfterRange: this.detailParams.detail[this.rowIndex - 1].weightAfterRange || '',
          weightBeforeUnit: this.detailParams.detail[this.rowIndex - 1].weightBeforeUnit || 'g/m²',
          weightAfterUnit: this.detailParams.detail[this.rowIndex - 1].weightAfterUnit || 'g/m²',
          suggestWidthUnit: this.detailParams.detail[this.rowIndex - 1].suggestWidthUnit,
          orderDetailId: this.detailParams.detail[this.rowIndex - 1].orderDetailId || '',
          orderId: this.detailParams.detail[this.rowIndex - 1].orderId || ''
        }
        this.versionData = this.detailParams.detail[this.rowIndex - 1] && this.detailParams.detail[this.rowIndex - 1].referenceVersionInfo ? this.detailParams.detail[this.rowIndex - 1].referenceVersionInfo : []
        this.setHomeList(this.rowIndex)
        this.ruleForm.sampleAnalysisResultId = this.detailParams.detail[this.rowIndex - 1].sampleAnalysisResultId || ''
        this.totalAmount = this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary && this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary.totalAmount ? this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary.totalAmount : ''
        this.totalQuantity = this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary && this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary.totalQuantity ? this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary.totalQuantity : ''
        this.unit = this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary && this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary.unit ? this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary.unit : null
        this.colorInfo = this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary && this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary.colorInfo && this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary.colorInfo.length ? JSON.parse(JSON.stringify(this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary.colorInfo)) : []
        this.colorInfo.forEach((item, index) => {
          item.code = index + 1
          item.dataTim = new Date().getTime() + '' + index
        })
        console.log(this.colorInfo)
        this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary && this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary.colorInfo && this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary.colorInfo.length && this.detailParams.detail[this.rowIndex - 1].colorQuantityDeliverySummary.colorInfo.forEach((item, index) => {
          item.code = index
          if (item.quantityDelivery && item.quantityDelivery.length) {
            item.quantityDelivery.forEach(items => {
              const listItem = {
                code: index + 1,
                seq: items.seq || '',
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
        console.log(this.orderDataSource)
        this.Multidimensional(this.orderDataSource)
        this.dataPretreatment(this.colorInfoTemp, 'colorInfoId', 'color')
      }
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
      if (productInfo.suggestWidth && productInfo.suggestWidthUnit) {
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
        this.$set(this.quantityDeliveryPopOptions.formDatas, 'auxiliaryQuantity', this.$utils.getFloat(auxiliaryQuantity, 2))
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
    priceTaxBlur(data) { // 单价(含税)
      const reg = /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{1,4})?$/ // 2.3.0 注释
      if (!reg.test(data)) {
        // this.$set(this.allPopOptions.formDatas, 'price', '')
        return
      }
      const basicInfo = this.$refs.basicData.dynamicValidateFormRuleForm
      const colorBasic = this.$refs.allPop.$refs.popComponents.formDatas
      console.log(basicInfo)
      let price = 0
      if (data && basicInfo && basicInfo.taxRate && basicInfo.isSettlement) {
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
    priceBlur(data) { // 单价(不含税)
      const reg = /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{1,4})?$/ // 2.3.0 注释
      if (!reg.test(data)) {
        // this.$set(this.allPopOptions.formDatas, 'priceTax', '')
        return
      }
      const basicInfo = this.$refs.basicData.dynamicValidateFormRuleForm
      const colorBasic = this.$refs.allPop.$refs.popComponents.formDatas
      console.log(basicInfo)
      let priceTax = 0
      if (data && basicInfo && basicInfo.taxRate && basicInfo.isSettlement) {
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
    // 选项配置下拉
    getOptionConfigSelect(data, type) {
      this.getOptionConfig(data).then(res => {
        if (type === 'orderType') { // 订单类型
          this.$set(this.baseData._orderType, 'dataSource', res)
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
          this.$set(this.materialContent._certificateCombine, 'dataSource', res)
        } else if (type === 'type') { // 剪板要求类型
          this.$set(this.shearingRequirementsContent._type, 'dataSource', res)
        } else if (type === 'stripeSpacingRange') { // 公差范围(条纹间距)
          this.$set(this.allContent._range, 'dataSource', res)
        } else if (type === 'baseData') { // 销售季度
          this.$set(this.baseData._sellQuarter, 'dataSource', res)
        } else if (type === 'chooseSearch') {
          this.$set(this.chooseSearch._sellQuarter, 'dataSource', res)
        } else if (type === 'allRange') {
          this.$set(this.productData._range, 'dataSource', res)
          this.$set(this.productData._weightBeforeRange, 'dataSource', res)
          this.$set(this.productData._weightAfterRange, 'dataSource', res)
        }
      })
    },
    // 单位下拉
    getUnitsSelect() {
      this.getUnits().then(res => {
        this.unitOptions = res
        if (!this.unit.value && this.unitOptions && this.unitOptions.length) {
          this.unit = this.unitOptions[0]
        }
      })
    },
    // 客样分析编号下拉
    getSampleAnalysisNoSelect() {
      this.getSampleAnalysisNo({ status: '4' }).then(res => {
        this.sampleAnalysisResultOption = res
      })
    },
    // 品牌商下拉
    getBrandSelect() {
      this.getBrand().then(res => {
        this.$set(this.baseData._brand, 'dataSource', res)
      })
    },
    // 获取客户下拉
    getCustomerSelect(type) {
      this.getCustomer().then(res => {
        if (type === 'customer') {
          this.$set(this.baseData._customer, 'dataSource', res)
        } else if (type === 'garmentFactory') {
          this.$set(this.baseData._garmentFactory, 'dataSource', res)
        } else if (type === 'stripeSpacing' || type === 'allContent') {
          this.$set(this.chooseSearch._customerId, 'dataSource', res)
        }
      })
    },
    // 获取销售团队下拉
    getSellTeamSelect(type) {
      this.getSellTeam({ functionTag: 'SAL' }).then(res => {
        if (type === 'salesTeam') {
          this.$set(this.baseData._salesTeam, 'dataSource', res)
        } else if (type === 'stripeSpacing' || type === 'allContent') {
          this.$set(this.chooseSearch._orgId, 'dataSource', res)
        }
      })
    },
    // 获取销售员下拉
    getSellerSelect() {
      this.getSeller().then(res => {
        this.$set(this.baseData._seller, 'dataSource', res)
      })
    },
    // 获取客服下拉
    getCustomerServiceSelect() {
      this.getSeller({ functionTag: 'SAL' }).then(res => {
        this.$set(this.baseData._customerService, 'dataSource', res)
      })
    },
    // 获取年份下拉
    getYearSelect(type) {
      this.getYear().then(res => {
        if (type === 'sellYear') {
          this.$set(this.baseData._sellYear, 'dataSource', res)
        } else if (type === 'stripeSpacing' || type === 'allContent') {
          this.$set(this.chooseSearch._sellYear, 'dataSource', res)
        }
      })
    },
    // 获取币别下拉
    getCurrencySelect() {
      this.getCurrency().then(res => {
        this.currencyDatas = res
        this.currencyDatas.forEach(item => {
          const currency = this.orderData.currency ? this.orderData.currency : {}
          if (item.value === currency.value) {
            this.currencyCode = item.code
          }
        })
        this.$set(this.addData._currency, 'dataSource', res)
      })
    },
    // 获取价格条款下拉
    getPricingTermSelect() {
      this.getPricingTerm().then(res => {
        this.$set(this.addData._pricingTerm, 'dataSource', res)
      })
    },
    // 获取付款条件下拉
    getPaymentTermSelect() {
      this.getPaymentTerm().then(res => {
        this.$set(this.addData._paymentTerm, 'dataSource', res)
      })
    },
    // 获取布类下拉
    getClothSelect() {
      this.getCloth().then(res => {
        this.$set(this.columns._cloth.editOptions, 'dataSource', res)
      })
    },
    // 订单号下拉
    getOrderNoSelect() {
      this.getOrderNo().then(res => {
        this.$set(this.versionContent._referenceOrder, 'dataSource', res)
      })
    },
    // 坯布编码下拉
    getGreyClothCodesSelect(data) {
      this.getGreyClothCodes(data).then(res => {
        this.$set(this.versionContent._greyClothCode, 'dataSource', res)
      })
    },
    // 色板单号下拉
    getSwatchesNoSelect() {
      this.getSwatchesNo().then(res => {
        this.$set(this.chooseSearch._code, 'dataSource', res)
      })
    },
    // 印花SO单号下拉
    getPrintApplyNoSelect() {
      this.getPrintApplyNo().then(res => {
        this.$set(this.chooseSearch._printApplyNo, 'dataSource', res)
      })
    },
    // 成份下拉
    getCompositionSelect(type) {
      if (type === 'product') {
        this.getComposition({ enabled: 'Y' }).then(res => {
          this.$set(this.productData._ingredient, 'dataSource', res)
        })
      } else if (type === 'naturalFiber') {
        this.getComposition({ enabled: 'Y' }).then(res => {
          this.$set(this.naturalFiberContent._element, 'dataSource', res)
        })
      } else if (type === 'chemicalFiber') {
        this.getComposition({ enabled: 'Y' }).then(res => {
          this.$set(this.chemicalFiberContent._element, 'dataSource', res)
        })
      }
    },
    // 印花工艺下拉
    getPrintCraftSelect(type) {
      this.getPrintCraft({ classificationName: '印花工艺' }).then(res => {
        if (type === 'product') {
          this.$set(this.productData._printCraft, 'dataSource', res)
        } else if (type === 'chooseSearch') {
          this.$set(this.chooseSearch._printCraft, 'dataSource', res)
        }
      })
    },
    // 纱支、细度下拉 type: yarn纱支 fineness细度 combine组合
    getYarnSelect(type) {
      const GenericType = { type, enabled: 'Y' }
      this.getYarn(GenericType).then(res => {
        if (GenericType.type === 'yarn') {
          this.$set(this.naturalFiberContent._yarn, 'dataSource', res)
        } else if (GenericType.type === 'fineness') {
          this.$set(this.chemicalFiberContent._fineness, 'dataSource', res)
        }
      })
    },
    // 纱类、丝类下拉 type: yarn纱类 silk丝类 combine组合
    getYarnTypeSelect(type) {
      const GenericType = { type, enabled: 'Y' }
      this.getYarnType(GenericType).then(res => {
        if (GenericType.type === 'yarn') {
          this.$set(this.naturalFiberContent._yarnCategory, 'dataSource', res)
        } else if (GenericType.type === 'silk') {
          this.$set(this.chemicalFiberContent._wireCategory, 'dataSource', res)
        }
      })
    },
    changeOptionStatus() {
      if (this.isEdit) {
        this.basicData = { ...this.baseData }
        this.editChange()
      } else {
        console.log(11111)
        this.basicData = { ...this.baseData }
        for (const key in this.basicData) {
          this.basicData[key].disabled = true
        }
        for (const key in this.productData) {
          this.productData[key].disabled = true
        }
        if (this.$refs.dataSourceMix) {
          this.$set(this.$refs.dataSourceMix.dataSource[0], 'operates', null)
        }
        // this.$set(this.$refs.dataSourceMix.dataSource, 'dataSource', this.orderDataSource)
        this.versionOperates = null
        this.materialOperates = null
        this.allOperates = null
        this.$set(this.productData._weightBefore, 'append', 'g/m²')
        this.$set(this.productData._weightAfter, 'append', 'g/m²')
        // this.setDetailData()
        this.encryptFn(this.basicData, this.orderData['_rule'], this.isEdit ? 'edit' : 'info')
        this.encryptFn(this.productData, this.orderData['_rule'], this.isEdit ? 'edit' : 'info')
      }
      if (this.isEdit && !this.$route.params.id) {
        this.$set(this.$refs.productData.formDatas, 'suggestWidthUnit', '"')
      }
    },
    // 编辑状态
    editChange() {
      if (this.orderData.demandSource && this.orderData.demandCode) { // 需求来源
        for (const key in this.basicData) {
          this.basicData[key].disabled = true
        }
        if (this.orderData.isSettlement) {
          this.basicData._taxRate.disabled = false
        }
        console.log('ssssss985', this.basicData)
        // this.$set(this.formOptions, 'disabled', true)
        this.basicData._garmentFactory.disabled = false
        this.basicData._customerService.disabled = false
        this.basicData._isSettlement.disabled = false
      } else {
        for (const key in this.basicData) {
          this.basicData[key].disabled = false
        }
        // this.$set(this.formOptions, 'disabled', false)
      }
      for (const key in this.productData) {
        this.productData[key].disabled = false
      }
      this.$set(this.formOptions, 'disabled', false)
      this.baseData._code.disabled = true
      if (this.$refs.dataSourceMix) {
        this.$set(this.$refs.dataSourceMix.dataSource[0], 'operates', this.operates)
      }
      this.versionOperates = {
        label: '操作',
        width: '120',
        fixed: 'right',
        dataSource: this.versionOperatesData
      }
      this.materialOperates = {
        label: '操作',
        width: '120',
        fixed: 'right',
        dataSource: this.materialOperatesData
      }
      this.allOperates = {
        label: '操作',
        width: '120',
        fixed: 'right',
        dataSource: this.allOperatesData
      }
      // this.$set(this.baseData._code, 'disabled', true)
      this.$set(this.productData._weightBefore, 'append', 'g/m²')
      this.$set(this.productData._weightAfter, 'append', 'g/m²')
      this.encryptFn(this.basicData, this.orderData['_rule'], this.isEdit ? 'edit' : 'info')
      this.encryptFn(this.productData, this.orderData['_rule'], this.isEdit ? 'edit' : 'info')
      if (!this.$route.params.id) {
        if (!this.RawMaterialArray.length) {
          this.RawMaterialArray.push([])
        }
      }
    },
    // 点击编辑时处理数据
    setFormDatas(params, type) {
      setTimeout(() => {
        if (type === 'version') {
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
    isSettlement(value) {
      // this.basicData = {}
      if (value) {
        this.basicData = { ...this.baseData, ...this.addData }
      } else {
        this.basicData = { ...this.baseData }
      }
      if (this.isEdit) {
        for (const key in this.basicData) {
          this.basicData[key].disabled = false
        }
      } else {
        for (const key in this.basicData) {
          this.basicData[key].disabled = true
        }
      }
    },
    addOrder() {
      // this.newValue = 0
      // this.newColorValue = 0
      // this.newColorChildValue = 0
      if (this.orderDataSource.length >= 100) {
        this.$message({ type: 'error', message: '最多可以增加到100行!' })
        return false
      }
      const data = {
        code: this.orderDataSource.length + 1,
        seq: this.status === '2' ? ++this.maxValue : this.orderDataSource.length + 1,
        garmentPart: undefined,
        cloth: undefined,
        edit: true
      }
      const orderLeft = this.$refs.dataSourceMix.dynamicValidateFormRuleForm.tableForm // 订单左侧表格
      let productData = this.$refs.productData.dynamicValidateFormRuleForm // 产品信息数据
      productData = {
        ingredient: productData.ingredient || '',
        ratio: productData.ratio || '',
        dryWay: productData.dryWay || '',
        shrinkL: productData.shrinkL || '',
        shrinkW: productData.shrinkW || '',
        printCraft: productData.printCraft ? JSON.stringify(productData.printCraft) : '',
        dyeCraft: productData.dyeCraft ? JSON.stringify(productData.dyeCraft) : '',
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
      console.log(this.InitialArray.colorQuantityDeliverySummary)
      console.log(this.orderDataSource)
      if (!this.$route.params.id) {
        const parmas = {
          ...orderLeft[this.rowIndex - 1],
          ...productData,
          sampleAnalysisResultId: this.ruleForm.sampleAnalysisResultId,
          referenceVersionInfo: this.versionData, //  参板信息数据
          colorQuantityDeliverySummary: { //  颜色数量交期汇总信息
            maxColorSeq: 0,
            unit: this.unit,
            totalQuantity: this.totalQuantity,
            totalAmount: this.totalAmount,
            // colorInfo: this.colorInfo.length ? [this.colorInfo[this.rowIndex - 1]] : []
            colorInfo: this.colorInfo.length ? this.colorInfo : []
          },
          // materialInfo: this.RawMaterialArray.length ? [this.RawMaterialArray[this.rowIndex - 1]] : []// 原料信息
          materialInfo: []// 原料信息
        }
        this.orderDataSource.push(data)
        this.RawMaterialArray.push([]) // xj
        this.orderDataSource[this.rowIndex - 1] = { ...this.orderDataSource[this.rowIndex - 1], ...parmas } // 将页面上的数据复制给上一条
        this.orderDataSource[this.rowIndex] = { ...this.InitialArray, ...this.orderDataSource[this.rowIndex] }
        this.rowIndex = this.orderDataSource.length
        this.clearRowIndex()
      } else {
        const parmas = {
          ...orderLeft[this.rowIndex - 1],
          ...productData,
          sampleAnalysisResultId: this.ruleForm.sampleAnalysisResultId,
          referenceVersionInfo: this.versionData, //  参板信息数据
          colorQuantityDeliverySummary: { //  颜色数量交期汇总信息
            summaryId: this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary ? this.orderDataSource[this.rowIndex - 1].colorQuantityDeliverySummary.summaryId : '',
            maxColorSeq: 0,
            unit: this.unit,
            totalQuantity: this.totalQuantity,
            totalAmount: this.totalAmount,
            colorInfo: this.colorInfo.length ? this.colorInfo : []
          },
          // materialInfo: this.RawMaterialArray.length ? [this.RawMaterialArray[0]] : []// 原料信息
          materialInfo: []
        }
        this.orderDataSource.push(data)
        console.log(parmas)
        // debugger
        this.RawMaterialArray.push([]) // xj
        this.orderDataSource[this.rowIndex - 1] = { ...this.orderDataSource[this.rowIndex - 1], ...parmas }
        this.orderDataSource[this.orderDataSource.length - 1] = { ...this.InitialArray, ...this.orderDataSource[this.orderDataSource.length - 1] }
        this.rowIndex = this.orderDataSource.length
        this.clearRowIndex()
      }
      console.log(this.orderDataSource, this.rowIndex)
      this.setOrderDtail()
    },
    // 参板信息弹窗显隐
    versionPopHandle(val) {
      this.$set(this.versionPopOptions, 'visible', !this.versionPopOptions.visible)
      if (val) {
        this.$set(this.versionPopOptions, 'title', val)
      }
    },
    // 原料信息弹窗显隐
    materialHandle(val) {
      // 处理新增里类型错误
      this.$set(this.materialContent._naturalFiberTableForm, 'dataSource', [])
      this.$set(this.materialContent._chemicalFiberTableForm, 'dataSource', [])
      this.$set(this.materialContent._naturalCombineTableForm, 'dataSource', [])
      this.$set(this.materialContent._chemicalCombineTableForm, 'dataSource', [])
      this.$set(this.materialPopOptions, 'visible', !this.materialPopOptions.visible)
      this.InformationDeletion = ''
      if (val) {
        this.$set(this.materialPopOptions, 'title', val)
      }
      this.naturaEven = ''

      this.$set(this.materialContent._certificateCombine, 'dataSource', [])
      this.$set(this.materialPopOptions.formDatas, 'supplierYarnCodeCombine', '')
      this.$set(this.materialPopOptions.formDatas, 'certificateCombine', null)
      // this.$set(this.materialContent._naturalCombineTableForm, 'dataSource', [])
      // this.$set(this.materialContent._chemicalCombineTableForm, 'dataSource', [])
      this.$set(this.materialPopOptions.formDatas, 'materialInfoCopy', '')
      this.$set(this.materialPopOptions.formDatas, 'materialId', '')
      this.$set(this.materialPopOptions.formDatas, 'orderDetailId', '')
      this.$set(this.materialPopOptions.formDatas, 'orderId', '')
    },
    // 天然纤维弹窗显隐
    naturalFiberHandle(val) {
      this.$set(this.naturalFiberPopOptions, 'visible', !this.naturalFiberPopOptions.visible)
      if (val) {
        this.$set(this.naturalFiberPopOptions, 'title', val)
      }
    },
    // 化学纤维弹窗显隐
    chemicalFiberHandle(val) {
      this.$set(this.chemicalFiberPopOptions, 'visible', !this.chemicalFiberPopOptions.visible)
      if (val) {
        this.$set(this.chemicalFiberPopOptions, 'title', val)
      }
    },
    // 剪板要求、条纹间距、数量交期弹窗显隐
    popHandle(val, type) {
      this.$set(this[`${type}PopOptions`], 'visible', !this[`${type}PopOptions`].visible)
      if (val) {
        this.$set(this[`${type}PopOptions`], 'title', val)
      }
      if (this[`${type}PopOptions`].visible) {
        this.encryptFn(this[`${type}Content`], this.orderData['_rule'], val && val.startsWith('新增') && 'add' || 'edit')
      }
      this.$set(this[`${type}PopOptions`], 'content', this[`${type}Content`])
      this.$set(this[`${type}PopOptions`], 'formDatas', {})
    },
    // 颜色&数量&交期弹窗显隐
    allPopHandle(val) {
      this.$set(this.allPopOptions, 'visible', !this.allPopOptions.visible)
      if (val) {
        this.$set(this.allPopOptions, 'title', val)
      }
      // 动态添加校验 不要可以删除  stripeSpacingPopOptions()
      this.$set(this.allContent._range, 'rules', [])
      this.$set(this.allContent._range, 'dataSource', [])
    },
    addReferenceVersionInfo() {
      this.versionPopHandle('新增参板信息')
      this.encryptFn(this.versionContent, this.orderData['_rule'], 'add')
      this.$set(this.versionPopOptions, 'content', this.versionContent)
      this.$set(this.versionPopOptions, 'formDatas', {})
    },
    tabChange(tab) {
      this.tab = tab
      if (tab === '0') {
        this.$set(this.naturalFiberPopOptions.content._certificate, 'isShow', true)
        this.$set(this.naturalFiberPopOptions.content._supplierYarnCode, 'isShow', true)
        this.$set(this.chemicalFiberPopOptions.content._certificate, 'isShow', true)
        this.$set(this.chemicalFiberPopOptions.content._supplierYarnCode, 'isShow', true)

        this.$set(this.materialPopOptions.content._naturalFibeAdd, 'isShow', true)
        this.$set(this.materialPopOptions.content._naturalFiberTableForm, 'isShow', true)
        this.$set(this.materialPopOptions.content._chemicalFiberAdd, 'isShow', false)
        this.$set(this.materialPopOptions.content._chemicalFiberTableForm, 'isShow', false)
        this.$set(this.materialPopOptions.content._naturalCombine, 'isShow', false)
        this.$set(this.materialPopOptions.content._naturalCombineAdd, 'isShow', false)
        this.$set(this.materialPopOptions.content._naturalCombineTableForm, 'isShow', false)
        this.$set(this.materialPopOptions.content._chemicalCombine, 'isShow', false)
        this.$set(this.materialPopOptions.content._chemicalCombineAdd, 'isShow', false)
        this.$set(this.materialPopOptions.content._chemicalCombineTableForm, 'isShow', false)
        this.$set(this.materialPopOptions.content._certificateCombine, 'isShow', false)
        this.$set(this.materialPopOptions.content._supplierYarnCodeCombine, 'isShow', false)
      } else if (tab === '1') {
        this.$set(this.naturalFiberPopOptions.content._certificate, 'isShow', true)
        this.$set(this.naturalFiberPopOptions.content._supplierYarnCode, 'isShow', true)
        this.$set(this.chemicalFiberPopOptions.content._certificate, 'isShow', true)
        this.$set(this.chemicalFiberPopOptions.content._supplierYarnCode, 'isShow', true)

        this.$set(this.materialPopOptions.content._naturalFibeAdd, 'isShow', false)
        this.$set(this.materialPopOptions.content._naturalFiberTableForm, 'isShow', false)
        this.$set(this.materialPopOptions.content._chemicalFiberAdd, 'isShow', true)
        this.$set(this.materialPopOptions.content._chemicalFiberTableForm, 'isShow', true)
        this.$set(this.materialPopOptions.content._naturalCombine, 'isShow', false)
        this.$set(this.materialPopOptions.content._naturalCombineAdd, 'isShow', false)
        this.$set(this.materialPopOptions.content._naturalCombineTableForm, 'isShow', false)
        this.$set(this.materialPopOptions.content._chemicalCombine, 'isShow', false)
        this.$set(this.materialPopOptions.content._chemicalCombineAdd, 'isShow', false)
        this.$set(this.materialPopOptions.content._chemicalCombineTableForm, 'isShow', false)
        this.$set(this.materialPopOptions.content._certificateCombine, 'isShow', false)
        this.$set(this.materialPopOptions.content._supplierYarnCodeCombine, 'isShow', false)
      } else if (tab === '2') {
        this.$set(this.naturalFiberPopOptions.content._certificate, 'isShow', false)
        this.$set(this.naturalFiberPopOptions.content._supplierYarnCode, 'isShow', false)
        this.$set(this.chemicalFiberPopOptions.content._certificate, 'isShow', false)
        this.$set(this.chemicalFiberPopOptions.content._supplierYarnCode, 'isShow', false)

        this.$set(this.materialPopOptions.content._naturalFibeAdd, 'isShow', false)
        this.$set(this.materialPopOptions.content._naturalFiberTableForm, 'isShow', false)
        this.$set(this.materialPopOptions.content._chemicalFiberAdd, 'isShow', false)
        this.$set(this.materialPopOptions.content._chemicalFiberTableForm, 'isShow', false)
        this.$set(this.materialPopOptions.content._naturalCombine, 'isShow', true)
        this.$set(this.materialPopOptions.content._naturalCombineAdd, 'isShow', true)
        this.$set(this.materialPopOptions.content._naturalCombineTableForm, 'isShow', true)
        this.$set(this.materialPopOptions.content._chemicalCombine, 'isShow', true)
        this.$set(this.materialPopOptions.content._chemicalCombineAdd, 'isShow', true)
        this.$set(this.materialPopOptions.content._chemicalCombineTableForm, 'isShow', true)
        this.$set(this.materialPopOptions.content._certificateCombine, 'isShow', true)
        this.$set(this.materialPopOptions.content._supplierYarnCodeCombine, 'isShow', true)
      }// 处理新增里类型错误
      // this.$set(this.materialContent._naturalFiberTableForm, 'dataSource', [])
      // this.$set(this.materialContent._chemicalFiberTableForm, 'dataSource', [])
      // this.$set(this.materialContent._naturalCombineTableForm, 'dataSource', [])
      // this.$set(this.materialContent._chemicalCombineTableForm, 'dataSource', [])
    },
    addMaterialInfo() {
      this.tab = '0'
      this.tabChange('0')
      this.$set(this.materialContent._materialTabs, 'isShow', true)
      this.$set(this.materialContent._naturalFiberTableForm, 'dataSource', [])
      this.$set(this.materialContent._chemicalFiberTableForm, 'dataSource', [])
      this.$set(this.materialContent._naturalCombineTableForm, 'dataSource', [])
      this.$set(this.materialContent._chemicalCombineTableForm, 'dataSource', [])
      this.naturalFiberData = []
      this.chemicalFiberData = []
      this.naturalFiberCombineData = []
      this.chemicalFiberCombineData = []
      this.materialHandle('新增原料信息')
      this.$set(this.materialPopOptions, 'content', this.materialContent)
      this.$set(this.materialPopOptions, 'formDatas', {})
      this.$set(this.materialPopOptions.formDatas, 'materialTabs', '0')
    },
    addAllInfo() {
      this.editAll.maxQuantitySeq = 0
      this.editAll.orderId = ''
      this.$set(this.allContent._shearingRequirementsTableForm, 'dataSource', [])
      this.shearingRequirementsData = []
      this.$set(this.allContent._stripeSpacingTableForm, 'dataSource', [])
      this.stripeSpacingData = []
      this.$set(this.allContent._quantityDeliveryTableForm, 'dataSource', [])
      this.quantityDeliveryData = []
      this.$nextTick(() => {
        this.encryptFn(this.allContent, this.orderData['_rule'], 'add')
      })
      this.allPopHandle('新增颜色&数量&交期')
      this.$set(this.allPopOptions, 'content', this.allContent)
      this.$set(this.allPopOptions, 'formDatas', {})
    },
    addNaturalFiber() { // addNaturalFiber
      if (this.tab === '2') {
        this.$set(this.naturalFiberContent._certificate, 'isShow', false)
        this.$set(this.naturalFiberContent._supplierYarnCode, 'isShow', false)
        this.$set(this.naturalFiberContent._elementRatio.componentsOptions, 'textType', '2')
      } else {
        this.$set(this.naturalFiberContent._certificate, 'isShow', true)
        this.$set(this.naturalFiberContent._supplierYarnCode, 'isShow', true)
        this.$set(this.naturalFiberContent._elementRatio.componentsOptions, 'textType', '0')
      }
      this.encryptFn(this.naturalFiberContent, this.orderData['_rule'], 'add')
      this.naturalFiberHandle('新增天然纤维')
      this.$set(this.naturalFiberPopOptions, 'content', this.naturalFiberContent)
      this.$set(this.naturalFiberPopOptions, 'formDatas', {})
    },
    addChemicalFiber() {
      if (this.tab === '2') {
        this.$set(this.chemicalFiberContent._certificate, 'isShow', false)
        this.$set(this.chemicalFiberContent._supplierYarnCode, 'isShow', false)
      } else {
        this.$set(this.chemicalFiberContent._certificate, 'isShow', true)
        this.$set(this.chemicalFiberContent._supplierYarnCode, 'isShow', true)
      }
      this.encryptFn(this.chemicalFiberContent, this.orderData['_rule'], 'add')
      this.chemicalFiberHandle('新增化学纤维')
      this.$set(this.chemicalFiberPopOptions, 'content', this.chemicalFiberContent)
      this.$set(this.chemicalFiberPopOptions, 'formDatas', {})
    },
    // 智布色号列表
    async getFabricColorNo(data = {}) {
      const res = await queryColorNoPage(data)
      if (this.$pub.responseValidate(res)) {
        this.tableData = res.data.list || []
      }
      this.choosePagination = {
        ...this.choosePagination,
        dataTotal: res.data.total || 0,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize,
        pageSizes: [10, 20, 30, 40, 50, 100]
      }
    },
    // 智布花号列表
    async getFlowerNo(data = {}) {
      const res = await queryFlowerNoPage(data)
      if (this.$pub.responseValidate(res)) {
        this.tableData = res.data.list || []
      }
      this.choosePagination = {
        ...this.choosePagination,
        dataTotal: res.data.total || 0,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize,
        pageSizes: [10, 20, 30, 40, 50, 100]
      }
    },
    calculateAuxiliaryQuantity(data, type) {
      this.totalQuantity = 0
      const productInfo = JSON.parse(JSON.stringify(this.$refs.productData.dynamicValidateFormRuleForm))
      let suggestFabric = ''
      let weightBefore = ''
      let suggestWidth = ''
      let suggestWidthUnit = ''
      suggestWidth = type === 'suggestWidth' ? data : productInfo.suggestWidth ? productInfo.suggestWidth : ''
      suggestWidthUnit = type === 'suggestWidthUnit' ? data : productInfo.suggestWidthUnit ? productInfo.suggestWidthUnit : ''
      weightBefore = type === 'weightBefore' ? data : productInfo.weightBefore ? productInfo.weightBefore : ''
      if (suggestWidth && suggestWidthUnit) {
        suggestFabric = suggestWidthUnit && suggestWidthUnit === '"' ? (suggestWidth - 0 + 2) : (suggestWidth / 2.54 + 2)
      } else {
        suggestFabric = ''
      }
      this.colorInfoTemp && this.colorInfoTemp.length && this.colorInfoTemp.forEach(item => {
        item.quantityDelivery && item.quantityDelivery.length && item.quantityDelivery.forEach(items => {
          if (this.unit.label === '磅') {
            items.auxiliaryQuantity = items.quantity / 2.2046
            console.log(items.auxiliaryQuantity)
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
          this.totalQuantity += this.$utils.getFloat(items.auxiliaryQuantity, 2)
        })
      })
      this.colorInfo.forEach(item => {
        item.quantityDelivery && item.quantityDelivery.length && item.quantityDelivery.forEach(items => {
          if (this.unit.label === '磅') {
            items.auxiliaryQuantity = items.quantity / 2.2046
            console.log(items.auxiliaryQuantity)
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
      console.log(this.totalQuantity)
    },
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
        })
        this.totalQuantity += this.$utils.getFloat(item.quantityDelivery[0].auxiliaryQuantity, 2)
      })
      this.colorInfo.forEach(item => {
        item.quantityDelivery && item.quantityDelivery.length && item.quantityDelivery.forEach(items => {
          if (this.unit.label === '磅') {
            items.auxiliaryQuantity = items.quantity / 2.2046
            console.log(items.auxiliaryQuantity)
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
    analysisIdChange(val) { // 客样分析编号
      // 可输入时校验长度不超过20 allow-create
      // if (val && val.length > 20) {
      //   this.$refs.ruleForm.fields[0].validateMessage = '最大长度20个字符'
      //   this.$refs.ruleForm.fields[0].validateDisabled = true
      //   this.$refs.ruleForm.fields[0].validateState = 'error'
      //   this.ruleForm.sampleAnalysisResultId = ''
      //   return
      // }
      console.log('sssss', val)
      if (val) {
        this.getDetailFun(val)
      } else {
        this.getDetailFun('1')
      }
      this.orderDataSource[this.rowIndex - 1].sampleAnalysisResultId = val
      const orderLeft = this.$refs.dataSourceMix.dynamicValidateFormRuleForm.tableForm // 订单左侧表
      orderLeft[this.rowIndex - 1].sampleAnalysisResultId = val
      this.ruleForm.sampleAnalysisResultId = val
    },
    async getDetailFun(id) {
      const detailObj = (await techgetDetail({ csSampleAnalysisApplayId: id })).data || {}
      console.log(detailObj)
      // const cloth
      const productInfo = {}// 产品信息
      if (detailObj.productInfo) { // 产品信息
        console.log(1)
        productInfo.ingredient = detailObj.materialRequirement.elementInfo || '' // 成份
        productInfo.ratio = detailObj.materialRequirement.elementRatio || '' // 比例
        productInfo.dryWay = detailObj.productInfo.dryWayInfo || '' // 干燥方式
        productInfo.shrinkL = detailObj.productInfo.shrinkL ? parseFloat(detailObj.productInfo.shrinkL) : '' // 缩水(LxW)
        productInfo.shrinkW = detailObj.productInfo.shrinkW ? parseFloat(detailObj.productInfo.shrinkW) : '' // shrinkW
        // 染整工艺 ===工艺要求
        if (detailObj.productInfo.craftRequire && detailObj.productInfo.craftRequire.includes('[')) {
          productInfo.dyeCraft = JSON.parse(detailObj.productInfo.craftRequire)
        } else {
          productInfo.dyeCraft = []
        }
        // 成品幅宽 ===成品布封(建议)
        productInfo.suggestWidth = detailObj.productInfo.suggestWidth ? parseFloat(detailObj.productInfo.suggestWidth) : ''
        productInfo.suggestWidthUnit = detailObj.productInfo.suggestWidthUnit
        // 成品克重（洗前)
        productInfo.weightBefore = detailObj.productInfo.suggestWeight ? parseFloat(detailObj.productInfo.suggestWeight) : ''
        // 成品克重（洗后)
        productInfo.weightAfter = detailObj.productInfo.measuredWeight ? parseFloat(detailObj.productInfo.measuredWeight) : ''
        console.log('pmc', detailObj.productInfo.clothsTypeInfo)
        // if (detailObj.productInfo.clothsTypeInfo && detailObj.productInfo.clothsTypeInfo.value) { // 布类
        //   console.log('pm', productInfo.clothsTypeInfo)
        //   this.$set(this.columns._cloth.editOptions.dataSource, 'dataSource', [detailObj.productInfo.clothsTypeInfo])
        //   this.$set(this.leftFormDatas, 'cloth', cloth)
        //   this.orderDataSource[this.rowIndex - 1].cloth = cloth
        // }
      } else {
        productInfo.ingredient = '' // 成份
        productInfo.ratio = '' // 比例
        productInfo.dryWay = '' // 干燥方式
        productInfo.shrinkL = '' // 缩水(LxW)
        productInfo.shrinkW = '' // shrinkW
        // 染整工艺 ===工艺要求
        productInfo.dyeCraft = []
        // 成品幅宽 ===成品布封(建议)
        productInfo.suggestWidth = ''
        productInfo.suggestWidthUnit = ''
        // 成品克重（洗前)
        productInfo.weightBefore = ''
        // 成品克重（洗后)
        productInfo.weightAfter = ''
      }
      this.formDatas = { ...this.formDatas, ...productInfo }
      this.$set(this.productData._ingredient, 'dataSource', this.formDatas.ingredient ? [this.formDatas.ingredient] : [])
      this.$set(this.productData._dyeCraft.componentsOptions, 'checkValList', this.formDatas.dyeCraft ? this.formDatas.dyeCraft : [])
      this.RawMaterialArray[this.rowIndex - 1] = []
      this.sampleAnalysis(detailObj)
    },
    sampleAnalysis(detailObj) { // 客样分析数据处理  // 原料信息
      // 天然 naturalFibers 纱支/细度
      const GlobalArray = []
      const naturalFibersIndex = detailObj.naturalFibers || [] // 天然
      const chemicalFibersIndex = detailObj.chemicalFibers || [] // 化学纤维
      const combinedData = detailObj.composeYarns || [] // 组合纱线
      GlobalArray.push(
        { type: '0', data: naturalFibersIndex || [] },
        { type: '1', data: chemicalFibersIndex || [] },
        { type: '2', data: combinedData || [] }
      )
      console.log('om', GlobalArray)
      GlobalArray.length && GlobalArray.forEach((itx, imx) => {
        if (itx.type === '0' && itx.data && itx.data.length) { // 天然
          this.naturalFiberFun(itx.data)
        }
        if (itx.type === '1' && itx.data && itx.data.length) { // 化学纤维
          this.chemicalFibersFun(itx.data)
        }
        if (itx.type === '2' && itx.data && itx.data.length) { // 组合纱线
          const dataTims = new Date().getTime()
          itx.data.forEach((item, index) => {
            const that = this
            if ((item.naturalFiberUpdateReqtList && item.naturalFiberUpdateReqtList.length) || (item.chemicalFiberUpdateReqtList && item.chemicalFiberUpdateReqtList.length)) {
              const opm = {
                type: '2',
                certificate: '',
                materialInfoCopy: dataTims * 3 + index + '',
                supplierYarnCode: '',
                chemicalFiber: that.chemicalFibersFun(item.chemicalFiberUpdateReqtList, 2) || [],
                naturalFiber: that.naturalFiberFun(item.naturalFiberUpdateReqtList, 1) || []
              }
              this.RawMaterialArray[this.rowIndex - 1].push(opm)
            }
          })
        }
      })
      this.ExternalRawMaterials(this.RawMaterialArray[this.rowIndex - 1], true)
    },
    naturalFiberFun(naturalFibersIndex, istype = 0) {
      const spu = []
      naturalFibersIndex.forEach((item, index) => {
        const obm = { naturalFiber: [] }
        const omg = {}
        obm.type = '0'
        obm.certificate = '' // 证书要求ID
        obm.supplierYarnCode = '' // 供应商纱线编码
        omg.yarn = item.yarnInfo || '' // 纱支ID
        omg.element = item.elementInfo || ''// 成份
        omg.element.names = '4'
        // omg.yanIndexType="4"
        // if(omg.element.label){
        //   omg.element.names=omg.element.names||""
        // }
        // omg.element=item.elementInfo?(item.elementInfo.names?item.elementInfo.label:""):""// 成份
        omg.elementRatio = item.elementRatio// 比例
        omg.yarnCategory = item.yarnCategoryInfo// 纱类
        obm.naturalFiber.push(omg)
        obm.chemicalFiber = []// 化学纤维
        if (istype) {
          spu.push(omg)
        } else {
          obm.materialInfoCopy = (new Date().getTime() + (index + 1) + '10')
          this.RawMaterialArray[this.rowIndex - 1].push(obm)
        }
      })
      return spu
    },
    chemicalFibersFun(chemicalFibersIndex, istype = 0) {
      const spu = []
      chemicalFibersIndex.forEach((item, index) => {
        const obm = { chemicalFiber: [] }
        const omg = {}
        obm.type = '1'
        obm.certificate = ''
        obm.supplierYarnCode = ''
        omg.fineness = item.finenessInfo || '' // 细度ID
        omg.element = item.elementInfo || ''// 成份
        omg.wireCategory = item.wireCategoryInfo // 丝类
        obm.chemicalFiber.push(omg)
        obm.naturalFiber = []

        if (istype) {
          spu.push(omg)
        } else {
          obm.materialInfoCopy = (new Date().getTime() * 2 + (index + 1) + '20')
          this.RawMaterialArray[this.rowIndex - 1].push(obm)
        }
        if (istype) { return spu }
      })
      return spu
    },
    // 关闭选择弹窗
    closePop() {
      this.isshowCloth = false
    },
    // 保存色号、花号pop弹窗
    savePop(params) {
      console.log(this.chooseType)
      console.log(params)
      console.log(this.allPopOptions.formDatas)
      if (this.chooseType === '1') {
        this.allPopOptions.formDatas = { fabricColorNo: params }
      } else if (this.chooseType === '2') {
        this.allPopOptions.formDatas = { fabricFlowerNo: params }
      } else if (this.chooseType === '3') {
        this.stripeSpacingPopOptions.formDatas = { fabricColorNo: params, fabriNoTime: this.rebclass || '', colorValue: this.rebclass ? 'rgb(' + this.rebclass + ')' : '' }
        // this.$set(this.stripeSpacingPopOptions.formDatas, 'fabricColorNo', params)
        // this.$set(this.stripeSpacingPopOptions.formDatas, 'fabriNoTime', this.rebclass || '')
        // this.$set(this.stripeSpacingPopOptions.formDatas, 'colorValue', this.rebclass ? 'rgb(' + this.rebclass + ')' : '')
        console.log('ssssssss', this.rebclass)
        // this.stripeSpacingPopOptions.formDatas = { fabricColorNo: params, fabriNoTime: this.rebclass || '', colorValue: this.rebclass ? 'rgb(' + this.rebclass + ')' : '' }
        if (this.rebclass) { // 不需要 可以删除
          this.$set(this.stripeSpacingContent._colorValue, 'disabled', true)
          this.$set(this.stripeSpacingContent._colorValue, 'readonly', true)
        } else {
          this.$set(this.stripeSpacingContent._colorValue, 'disabled', false)
          this.$set(this.stripeSpacingContent._colorValue, 'readonly', false)
        }
      }
      this.isshowCloth = false
      this.chooseType = ''
      this.rebclass = ''
    },
    // 返回整条数据 不要可以删除
    saveListRow(params) {
      this.rebclass = params.rgb ? params.rgb : ''
      console.log('不要可以删除', this.rebclass)
    },
    naturalOne(data1, istype = 0) {
      const comArray = data1 || []
      const spu = []
      if (comArray.length) {
        comArray.forEach((item, index) => {
          const obm = { naturalFiber: [] }
          const omg = {}
          obm.type = '0'
          // obm.dataTim = item.dataTim
          obm.certificate = item.certificate
          obm.materialInfoCopy = item.materialInfoCopy || ''
          obm.supplierYarnCode = item.supplierYarnCode || ''
          omg.yarn = item.yarn || ''
          omg.element = item.element || ''
          omg.elementRatio = item.elementRatio
          omg.yarnCategory = item.yarnCategory
          obm.naturalFiber.push(omg)
          obm.chemicalFiber = []
          if (istype) {
            spu.push(omg)
          } else {
            this.RawMaterialArray[this.rowIndex - 1].push(obm)
          }
        })
        if (istype) { return spu }
      }
    },
    chemiTwo(data2, istype = 0) {
      const comArray = data2 || []
      const spu = []
      if (comArray.length) {
        comArray.forEach((item, index) => {
          const obm = { chemicalFiber: [] }
          const omg = {}
          obm.type = '1'
          // obm.dataTim = item.dataTim
          obm.certificate = item.certificate || ''
          obm.materialInfoCopy = item.materialInfoCopy || ''
          obm.supplierYarnCode = item.supplierYarnCode || ''
          omg.fineness = item.fineness || ''
          omg.element = item.element || ''
          omg.wireCategory = item.wireCategory
          obm.chemicalFiber.push(omg)
          obm.naturalFiber = []
          if (istype) {
            spu.push(omg)
          } else {
            this.RawMaterialArray[this.rowIndex - 1].push(obm)
          }
        })
        if (istype) { return spu }
      }
    },

    // 原料信息提取
    RawMaterialExtraction(data1 = [], data2 = [], tim = 0) {
      if (tim === 0) { // 天然
        this.naturalOne(data1)
      } else if (tim === 1) {
        this.chemiTwo(data2)
      } else if (tim === 2) {
        if ((data1 && data1.length) || (data2 && data2.length)) {
          const that = this
          const cmCate = data1[0].certificate || data2[0].certificate || data1[0].certificateCombine || data2[0].certificateCombine
          const YarnCode = data1[0].supplierYarnCode || data2[0].supplierYarnCode
          const opm = {
            type: '2',
            certificate: cmCate,
            // dataTim: data1[0].dataTim,
            materialInfoCopy: data1[0].materialInfoCopy || data2[0].materialInfoCopy || '',
            supplierYarnCode: YarnCode,
            chemicalFiber: that.chemiTwo(data2, 2) || [],
            naturalFiber: that.naturalOne(data1, 1) || []
          }
          this.RawMaterialArray[this.rowIndex - 1].push(opm)
        }
      }
    },
    // 处理表格的合并的数据，找到要合并的数组
    // type: 原料 还是 交期做合并 prop: 根据哪个字段进行合并
    dataPretreatment(data, prop, type) {
      // 注意因为需要多次处理后台数据合并 所以合并前初始化这两个
      if (type === 'material') {
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
      } else if (type === 'color') {
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
    spanMethod({ row, column, rowIndex, columnIndex }) {
      // 第一列
      if ([4, 5, 6].includes(columnIndex) && this.rows.length) {
        const _row = this.rows[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // 颜色、数量、交期合并的方法
    spanAllMethod({ row, column, rowIndex, columnIndex }) {
      // 第一列
      if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 19].includes(columnIndex) && this.mergingRows.length) {
        const _row = this.mergingRows[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // 初始化数据
    // initForm() {
    //   this.formDatas = {
    //     orderType: '', // 订单类型
    //     brand: '', // 品牌商
    //     customer: '', // 客户
    //     garmentFactory: '', // 制衣厂
    //     salesTeam: '', // 销售团队
    //     seller: '', // 销售员
    //     customerService: '', // 客服
    //     sellQuarter: '', // 销售季度
    //     sellYear: '', // 销售年度
    //     isSettlement: 0, // 是否结算{0=是，1=否}
    //     currency: '', // 币别ID
    //     taxRate: '', // 税率
    //     pricingTerm: '', // 价格条款
    //     paymentTerm: '', // 付款条件ID
    //     craftRequirementList: '', // 工艺要求
    //     type: '1' // 单据类型{１样板订单２大货订单}
    //   }
    // },
    setProDatBilIselect(object, num, type, isSettlement) { // 回显数据
      if (type === 'object' && this.basicData[num]) {
        // debugger
        this.$set(this.basicData[num], 'dataSource', object ? [object] : [])
      }
      // this.setOrderDtail()
      // else if (type === 'list') {
      //   this.$set(this.baseData[num], 'dataSource', object ? [object] : [])
      // }
    },
    setHomeList(data) { // 设置订单信息数据
      const num = data - 1 || 0
      let dataArray = []
      if (this.orderDataSource && this.orderDataSource.length) {
        dataArray = JSON.parse(JSON.stringify(this.orderDataSource))
      }
      if (dataArray && dataArray.length && dataArray.length > num) {
        const indexCom = dataArray[num]
        // const seq = indexCom.garmentPart && indexCom.garmentPart.value ? [indexCom.garmentPart] : []
        // const cloth = indexCom.clotht && indexCom.clotht.value ? [indexCom.cloth] : []
        const ingredient = indexCom.ingredient && indexCom.ingredient.value ? [indexCom.ingredient] : []
        const range = indexCom.range && indexCom.range.value ? [indexCom.range] : []
        const weightBeforeRange = indexCom.weightBeforeRange && indexCom.weightBeforeRange.value ? [indexCom.weightBeforeRange] : []
        const weightAfterRange = indexCom.weightAfterRange && indexCom.weightAfterRange.value ? [indexCom.weightAfterRange] : []
        // this.$set(this.columns._garmentPart.editOptions.dataSource, 'dataSource', seq)
        // this.$set(this.columns._cloth.editOptions.dataSource, 'dataSource', cloth)
        this.$set(this.productData._ingredient, 'dataSource', ingredient)
        this.$set(this.productData._range, 'dataSource', range)
        this.$set(this.productData._weightBeforeRange, 'dataSource', weightBeforeRange)
        this.$set(this.productData._weightAfterRange, 'dataSource', weightAfterRange)
        // 原料信息处理
        var spu = []
        if (indexCom.materialInfo && indexCom.materialInfo.length) {
          indexCom.materialInfo.forEach((item, index) => {
            if (item.type === '0') {
              item.naturalFiber.forEach((im, ix) => {
                im.certificate = item.certificate
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
              item.chemicalFiber.forEach((im, ix) => {
                im.type = item.type
                im.orderId = item.orderId
                im.materialInfoCopy = item.materialInfoCopy || 0
                im.materialId = item.materialId
                im.certificate = item.certificate
                im.supplierYarnCode = item.supplierYarnCode
                item.naturalFiber = []
                spu.push(im)
              })
            } else if (item.type === '2') {
              var dataom = []; var dataoma2 = []
              item.naturalFiber && item.naturalFiber.length && item.naturalFiber.forEach((im, ix) => {
                im.certificate = item.certificate
                im.chemicalFiber = item.chemicalFiber || []
                im.materialId = item.materialId
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
                // imc.dataTim = item.dataTim || 0
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
        this.materialData = spu
        this.dataPretreatment(this.materialData, 'materialInfoCopy', 'material')
      } else {
        this.materialData = []
      }
      console.log('ssssssim', this.dataSource[0])
      this.$set(this.dataSource[0], 'currentRowKey', this.rowIndex)
    },
    // 原料信息的组合 dataArray this.detailParams.detail[0].materialInfo
    ExternalRawMaterials(indexCom, iscell = false) { // 原料信息的组合
      var spu = []
      if (indexCom && indexCom.length) {
        indexCom.forEach((item, index) => {
          if (item.type === '0') {
            item.naturalFiber.forEach((im, ix) => {
              im.certificate = item.certificate
              // im.dataTim = item.dataTim
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
            item.chemicalFiber.forEach((im, ix) => {
              im.type = item.type
              im.orderId = item.orderId
              im.materialInfoCopy = item.materialInfoCopy || 0
              // im.dataTim = item.dataTim || 0
              im.materialId = item.materialId
              im.certificate = item.certificate
              im.supplierYarnCode = item.supplierYarnCode
              item.naturalFiber = []
              spu.push(im)
            })
          } else if (item.type === '2') {
            var dataom = []; var dataoma2 = []
            item.naturalFiber && item.naturalFiber.length && item.naturalFiber.forEach((im, ix) => {
              // const dacom = new Date().getTime()
              im.certificate = item.certificate
              im.chemicalFiber = item.chemicalFiber || []
              im.materialId = item.materialId
              // im.dataTim = item.dataTim || 0
              im.materialInfoCopy = item.materialInfoCopy || 0
              im.orderDetailId = item.orderDetailId
              im.orderId = item.orderId
              im.supplierYarnCode = item.supplierYarnCode
              im.type = item.type
              dataom.push(im)
            })
            item.chemicalFiber && item.chemicalFiber.length && item.chemicalFiber.forEach((imc, ixc) => {
              // const dacom = new Date().getTime()
              imc.materialId = item.materialId
              imc.type = item.type
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
      this.materialData = spu
      if (iscell) {
        this.dataPretreatment(this.materialData, 'materialInfoCopy', 'material')
      }
    },
    // 原料信息列表的删除
    DeleteRawMaterial(indexId) {
      if (indexId) {
        this.RawMaterialArray[this.rowIndex - 1].forEach((item, index) => {
          if (indexId === item.materialInfoCopy) {
            this.RawMaterialArray[this.rowIndex - 1].splice(index, 1)
          }
        })
        this.ExternalRawMaterials(this.RawMaterialArray[this.rowIndex - 1], true)
      }
    },
    // 设置组合时间戳
    setnaturaEven() {
      if (!this.naturaEven) {
        const dataTim = new Date().getTime()
        this.naturaEven = (dataTim + '')
      }
    },
    // 成衣部位的初始化
    editInputs(indexCom) {
      this.$set(this.columns._cloth.editOptions, 'disabled', indexCom)
      this.$set(this.columns._cloth.editOptions, 'readonly', indexCom)
      this.$set(this.columns._garmentPart.editOptions, 'disabled', indexCom)
      this.$set(this.columns._garmentPart.editOptions, 'readonly', indexCom)
    },
    Multidimensional(data) { // xj
      this.RawMaterialArray = []
      data.forEach((item, im) => {
        item.materialInfo = item.materialInfo || []
        if (item.materialInfo.length) {
          item.materialInfo.forEach((ims, ixs) => {
            if (ims.type === '2') {
              ims.naturalFiber && ims.naturalFiber.length && ims.naturalFiber.forEach((im, ix) => {
                im.type = item.type
                im.materialInfoCopy = item.materialInfoCopy || 0
              })
              ims.chemicalFiber && ims.chemicalFiber.length && ims.chemicalFiber.forEach((imc, ixc) => {
                imc.type = item.type
                imc.materialInfoCopy = item.materialInfoCopy || 0
              })
            }
          })
          this.RawMaterialArray.push(item.materialInfo)
        } else {
          this.RawMaterialArray.push([])
        }
      })
    },
    setHomeListLength() { // 详情请求成功情况数据
      // this.rowIndex = 1
      this.RawMaterialArray = []
    },
    // 改变税率  是否结算 需要清空值
    SetAmount() {
      if (this.colorInfoTemp && this.colorInfoTemp.length) { // 页面展示
        // this.totalQuantity = '' // 总数量不需要清空
        this.totalAmount = ''
        const dataArray = JSON.parse(JSON.stringify(this.colorInfoTemp))
        dataArray.forEach((it) => {
          it.priceTax = ''
          it.price = ''
          it.quantityDelivery && it.quantityDelivery.length && it.quantityDelivery.forEach((io) => {
            io.amount = ''
            io.amountTax = ''
          })
        })
        this.colorInfoTemp = dataArray
        this.colorInfo = dataArray
      }
      const orderData = JSON.parse(JSON.stringify(this.orderDataSource)) // 传给后台的
      if (orderData && orderData.length && orderData[this.rowIndex - 1].colorQuantityDeliverySummary) {
        // orderData[this.rowIndex - 1].colorQuantityDeliverySummary.totalAmount = '' // 总数量不需要清空
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
      console.log('ssssss85', val)
      this.$nextTick(() => {
        if (this.orderData.demandSource && this.orderData.demandCode) { // 需求来源
          for (const key in this.basicData) {
            this.basicData[key].disabled = true
          }
          if (this.orderData.isSettlement) {
            this.basicData._taxRate.disabled = false
          }
          // this.$set(this.formOptions, 'disabled', true)
          this.basicData._garmentFactory.disabled = false
          this.basicData._customerService.disabled = false
          this.basicData._isSettlement.disabled = false
        }
        console.log('ssssss78', this.basicData)
        this.ruleForm.sampleAnalysisResultId = val.sampleAnalysisId

        this.analysisIdChange(val.sampleAnalysisApplyId)

        this.$refs.basicData.form.clearValidate()
      })
    },
    orderDataDis() {
      if (this.orderData.demandSource && this.orderData.demandCode) { // 需求来源
        for (const key in this.basicData) {
          this.basicData[key].disabled = true
        }
        if (this.orderData.isSettlement) {
          this.basicData._taxRate.disabled = false
        }
        // this.$set(this.formOptions, 'disabled', true)
        this.basicData._garmentFactory.disabled = false
        this.basicData._customerService.disabled = false
        this.basicData._isSettlement.disabled = false
      }
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
      if (this.$route.query.rowIndex) {
        delete this.$route.query.rowIndex
      }
    }
  }
}
</script>

<style lang="scss">
.order-detail {
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
  .basic-data .el-input.is-disabled .el-input__suffix {
    display: none;
  }
  .basic-data {
    margin-top: 0;
    padding-bottom: 20px;
    .custom-form {
      margin: 0 20px;
    }
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
        width: 350px;
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
        display: flex;
        flex: 1;
        width: calc(100% - 350px);
        min-width: 880px;
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
            border-bottom-width: 1px;
          }
        }
        .product-item {
          .custom-form {
            margin: 0 20px;
          }
        }
      }
    }
  }
  .addButton {
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
    position: relative;
  }
  .titleView::before {
    display: block;
    content: '*';
    position: absolute;
    left: 6px;
    color: #FF4444;
  }
  .lableStyle::before {
    content: "*";
    margin-right: 4px;
    color: #FF4444;
  }
  .noLableStyle::before{
    display: none;
  }
  .noBefore::before {
    display: none;
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
  .table tr:nth-child(even) {
    background: #ffffff;
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
  .detailClass {
    .el-input-group__append {
      background: #ffffff;
      border: 0;
    }
  }
  .cursorHandel {
    input {
      cursor: pointer;
    }
  }
  .printColorDesign {
    width: 36px;
    height: 36px;
  }
}

  .page-table-border{
      tbody {
        color: #666;
      /deep/  .el-table__row td {
          border-bottom-width: 1px;

        }
    }
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
