<!--
 * @Author: xj
 * @Description: 颜色、数量、交期弹窗
 * @Date: 2021-06-25 20:00:49
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-27 17:47:52
 * @FilePath: d:\erp\src\views\customer-order\goods-orders\detail\common\all-pop-options.vue
-->
<template>
  <div class="pop allPop GoodsRedStarColor">
    <cs-custom-pop
      ref="allPop"
      :options="allPopOptions"
      class="LittleRedStarColor_allpop"
    />
    <!--剪板要求弹窗-->
    <plate-cutting
      ref="shearingRequirementsPop"
      :plate-data="allFromData"
      :rules="rulea"
      :pop-data-fun="popDataFun"
      :plate-index-from="plateIndexFrom"
      :unit-options="unitOptions"
      :prates-from-data="deliFreshData"
    />
    <!--条纹间距弹窗-->
    <stripe
      ref="stripeSpacingPop"
      :pop-data-fun="popDataFun"
      :rules="rulea"
      :plate-index-from="plateIndexFrom"
      :prates-from-data="deliFreshData"
    />
    <!--数量交期弹窗-->
    <quantity
      ref="quantityDeliveryPop"
      :suggest-width-unit="suggestWidthUnit"
      :suggest-width="suggestWidth"
      :price-tax="getpriceTax"
      :price="getprice"
      :rules="rulea"
      :weight-before="weightBefore"
      :pop-data-fun="popDataFun"
      :plate-index-from="plateIndexFrom"
      :prates-from-data="deliFreshData"
      :unit="unit"
    />
    <choose-pop
      :title="chooseTitle"
      :search-data="chooseSearch"
      :pagination="choosePagination"
      :columns="chooseColumns"
      :is-visible.sync="isshowCloth"
      type-vs="2"
      :table-data="tableData"
      @closePop="closePop"
      @savePop="savePop"
    />
    <!-- 报价单 -->
    <codePop
      ref="codePop"
      :pop-get-data="popGetData"
      @okHandleClick="OkClick"
    />
  </div>
</template>

<script>
import { PublicCustomer } from '@/views/customer-order/public/index'
import { detailFun } from '@/views/customer-order/goods-orders/detail/api/detailFun'
import PlateCutting from '../common/plate-cutting.vue'
import stripe from '../common/stripe.vue'
import { setOrderFun } from '@/views/customer-order/public/api/mou'
import quantity from '../common/quantity.vue'
import choosePop from '@/views/customer-order/public/components/choosePop'
import codePop from '@/views/customer-order/public/components/codePop.vue'
import { inputFilter } from '@/views/customer-order/public/api/inputFilter'
export default {
  components: {
    PlateCutting,
    stripe,
    quantity,
    choosePop,
    codePop
  },
  mixins: [PublicCustomer, detailFun, setOrderFun],
  props: {
    currencySeq: {// 外层最大下标
      type: Number
    },
    isEdit: {
      type: Boolean
    },
    taxRate: { // 税率
      type: [Number, String]
    },
    suggestWidth: { // 成品幅宽
      type: [Number, String]
    },
    suggestWidthUnit: {// 成品幅宽单位
      type: [Number, String]
    },
    weightBefore: {// 克重
      type: [Number, String]
    },
    unitOptions: { // 单位
      type: [Array]
    },
    currencyCode: {
      type: String
    },
    unit: {
      type: Object
    },
    data: {
      type: Object
    },
    rulea: {
      type: Object,
      default: () => ({})
    },
    rowIndex: {
      type: Number
    },
    deliFreshData: {
      type: Object
    },
    orderData: {
      type: Object,
      default: () => ({ detail: [] })
    },
    exchangeRateArraya: {
      type: [Array]
    }
  },
  data() {
    const lineStyle = {
      'width': '100%',
      'height': '1px',
      'color': '#ccc',
      'margin-bottom': '20px'
    }
    const lineStyle52PX = {
      'width': '100%',
      'height': '58px',
      'line-height': '58px',
      'color': '#151130',
      'border-bottom': '1px #E9EFF2 solid',
      'margin-bottom': '20px'
    }

    // 公用验证正则
    // const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 单价(不含税)
    var BlurFactoryNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('必填项不能为空'))
      } else if (this.visibleFromData.refQuotedPrice && this.visibleFromData.refQuotedPrice * 1 > Number(value)) {
        return callback(new Error('填入的值，不能小于参考价格'))
      } else if (Number(this.visibleFromData.priceTax || 0) < Number(this.visibleFromData.price || 0)) {
        return callback(new Error('单价含税应该大于单价不含税'))
      } else {
        callback()
      }
    }
    var UnitPriceLessThan = (rule, value, callback) => {
      if (Number(this.visibleFromData.priceTax || 0) < Number(this.visibleFromData.price || 0)) {
        return callback(new Error('单价含税应该大于单价不含税'))
      } else {
        callback()
      }
    }
    const priceReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,7})|(0{1}))(\.\d{1,4})?$/, message: '0~99999999.9999', trigger: ['blur'] })
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
      dataSource: [
        {
          label: '编辑',
          isShow: true,
          handle: scope => {
            this.plateIndexFrom = {}
            this.$refs.shearingRequirementsPop.popHandle('编辑剪版要求', 'shearingRequirements')
            this.$nextTick(() => { this.plateIndexFrom = { ...scope.row, code: scope.$index + 1 } })
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
    // 条纹间距table表头
    const stripeSpacingColumns = {
      _seq: {
        prop: 'seq',
        width: '80',
        label: '条纹序号',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _height: {
        prop: 'height',
        label: '高度(cm)',
        labelClassName: 'lableStyle',
        className: 'noLableStyle',
        showOverflowTooltip: true
      },
      _colorNo: {
        prop: 'colorNo',
        label: '色号',
        labelClassName: 'lableStyle',
        className: 'noLableStyle',
        showOverflowTooltip: true,
        formater: (scope) => {
          let tm = ''
          const com = scope.row.colorName ? scope.row.colorName : ''
          const com2 = scope.row.fabricColorNo ? scope.row.fabricColorNo : ''
          if (com && com2) { tm = '-' }
          return com + tm + com2
        }
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
      dataSource: [
        {
          label: '编辑',
          isShow: true,
          handle: scope => {
            this.$refs.stripeSpacingPop.popHandle('编辑条纹间距', 'stripeSpacing')
            this.$nextTick(() => { this.plateIndexFrom = { ...scope.row, seq: scope.$index + 1 } })
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
              })
              .catch(() => {
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
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.$utils.priceFormat(scope.row.quantity) || '-'
        }
      },
      _auxiliaryQuantity: {
        prop: 'auxiliaryQuantity',
        label: '辅助数量',
        showOverflowTooltip: true,
        formater: (scope) => {
          console.log(this.$utils.getFloat(scope.row.auxiliaryQuantity, 2))
          let tempField
          if ((scope.row.auxiliaryQuantity + '').indexOf('***') !== -1) {
            tempField = scope.row.auxiliaryQuantity
          } else {
            tempField = this.$utils.priceFormat(this.$utils.getFloat(scope.row.auxiliaryQuantity, 2)) ? this.$utils.priceFormat(this.$utils.getFloat(scope.row.auxiliaryQuantity, 2)) : ''
          }
          return tempField
        }
      },
      _amountTax: {
        prop: 'amountTax',
        label: '合计金额(含税)',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.encryptedFieldFormater(scope.row.amountTax, this.currencyCode)
        }
      },
      _amount: {
        prop: 'amount',
        label: '合计金额(不含税)',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.encryptedFieldFormater(scope.row.amount, this.currencyCode)
        }
      },
      _delivery: {
        prop: 'delivery',
        label: '交期',
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
      dataSource: [
        {
          label: '编辑',
          isShow: true,
          handle: scope => {
            this.$refs.quantityDeliveryPop.popHandle('编辑交期数量', 'quantityDelivery')
            this.$nextTick(() => { this.plateIndexFrom = { ...scope.row, code: scope.$index + 1 } })
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
                this.quantityDeliveryData.splice(scope.$index, 1)
                this.resetQuantitySeqCode(this.quantityDeliveryData)
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
      _CustomerInformation: {
        itemType: 'view',
        text: '客户信息 ',
        style: lineStyle52PX,
        itemStyle: { 'width': '100%', 'marginRight': 0 }
      },
      _customerOrderCode: {
        prop: 'customerOrderCode',
        itemType: this.inputTypeChange,
        minWidth: '80px',
        itemStyle: { width: '32%', display: 'inline-block', 'margin-bottom': '16px' },
        label: '客户单号',
        maxlength: 50,
        clearable: true
      },
      _styleNumber: {
        prop: 'styleNumber',
        minWidth: '80px',
        itemType: this.inputTypeChange,
        itemStyle: { width: '32%', display: 'inline-block', 'margin': '0 2% 16px' },
        label: '款号',
        blur: (scope, form, formDatas, setDatas) => {
          console.log('omnbformDatas', formDatas)
          this.SearchModelNumber(formDatas)
        },
        maxlength: 50,
        clearable: true
      },
      _customerClothNumber: {
        prop: 'customerClothNumber',
        minWidth: '80px',
        itemType: this.inputTypeChange,
        itemStyle: { width: '32%', display: 'inline-block', 'margin-bottom': '16px' },
        label: '客户布号',
        maxlength: 50,
        clearable: true
      },
      _customerColor: {
        prop: 'customerColor',
        itemType: 'input',
        minWidth: '80px',
        itemStyle: { width: '32%', display: 'inline-block', 'margin-bottom': '16px' },
        label: '客户颜色',
        maxlength: 50,
        clearable: true,
        rules: [commonBlurReg]
      },
      _customerColorEn: {
        prop: 'customerColorEn',
        itemType: 'input',
        minWidth: '80px',
        itemStyle: { width: '32%', display: 'inline-block', 'margin': '0 2% 16px' },
        label: '客户颜色(英文)',
        maxlength: 50,
        clearable: true
      },
      _shirtBody: {
        prop: 'shirtBody',
        itemType: 'select',
        minWidth: '80px',
        valueType: 'object',
        filterable: true,
        itemStyle: { width: '32%', display: 'inline-block' },
        label: '所属衫身',
        isShow: (scope) => {
          return this.visibleFromData.styleNumber && this.TextColor.length && this.setgarmentPart
        },
        disabled: false,
        rules: [{ required: true, message: '所属衫身不能为空', trigger: 'change' }],
        change: (value) => { },
        visibleChange: (value) => { },
        dataSource: []
      },
      _colorMatching: {
        prop: 'colorMatching',
        itemType: 'select',
        minWidth: '80px',
        itemStyle: { width: '32%', display: 'inline-block' },
        label: '配色要求',
        filterable: true,
        valueType: 'object',
        isShow: (scope) => {
          return this.visibleFromData.styleNumber && this.TextColor.length && this.setgarmentPart
        },
        disabled: false,
        rules: [{ required: true, message: '配色要求不能为空', trigger: 'change' }],
        visibleChange: (value) => {
          if (value) {
            this.getOptionConfigSelect({ fieldName: '配色要求' }, 'colorMatching')
          }
        },
        dataSource: []
      },
      _quotationView: {
        itemType: 'view',
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        text: '',
        style: lineStyle
      },
      _productInformation: {
        itemType: 'view',
        text: '产品信息',
        style: { width: '80%', 'padding': '16px 0', 'font-size': '16px', display: 'inline-block' }
      },
      _shearingRequirementsAdd567: {
        itemType: 'itemview',
        label: '',
        itemStyle: { display: 'inline-block', 'margin-bottom': '0', 'margin-left': '14px' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<el-button size="mini" type="primary" class="addGoodsButton">引用SKU</el-button>`
        },
        handle: () => { this.getSKUOne({ printTechId: this.getPrintTechId() }) }
      },
      _shearingRequirementsOne: {
        itemType: 'view',
        text: '',
        style: { width: '100%', 'font-size': '16px', 'border-bottom': '1px #E9EFF2 solid' }
      },
      _greyClothCode: {
        prop: 'greyClothCode',
        itemType: 'input',
        itemStyle: { width: '32%', display: 'inline-block', 'margin-right': '68%', 'margin-bottom': '0px', 'margin-top': '14px' },
        label: '色/花布SKU',
        isShow: (scope) => {
          return this.allPopOptions.formDatas.greyClothCode
        },
        rules: [{ required: true, message: '此项不能为空', trigger: 'change' }],
        placeholder: '点击选择色/花布SKU',
        clear: (form, formDatas, setFormDatas, scope) => {
          this.allPopOptions.formDatas = {
            ...formDatas,
            colorInfoType: null, //   label: '颜色信息',
            colorNo: '', // 智布色号
            fabricType: '2', // 色花布类型：1-色布；2-花布
            flowerInfoType: null, //  label: '印花信息',
            greyClothCode: '', // sku
            flowerNo: ''
          }
          // 色号花号 不可以编辑
          this.$set(this.allPopOptions.content._colorInfoType, 'disabled', false)
          this.$set(this.allPopOptions.content._flowerInfoType, 'disabled', false)
          this.$set(this.allPopOptions.content._colorNo, 'disabled', false)
          this.$set(this.allPopOptions.content._flowerNo, 'disabled', false)
          this.ClearRules(false) // 有了sku,不确定带出来色号和花号  去掉必填
          this.setFabricTypeClick(this.allPopOptions.formDatas)
        },
        clearable: true
      },
      _productInformationTwo: {
        itemType: 'view',
        text: ' ',
        style: lineStyle,
        itemStyle: { 'width': '100%', 'marginRight': 0 }
      },
      _colorInfoType: {
        prop: 'colorInfoType',
        itemType: 'select',
        minWidth: '80px',
        valueType: 'object',
        itemStyle: { width: '32%', display: 'inline-block', 'margin-bottom': '0' },
        label: '颜色信息',
        isShow: (scope) => {
          return this.getShow(this.FormDatasInfo, '颜色信息')
        },
        disabled: false,
        rules: [{ required: true, message: '颜色信息不能为空', trigger: 'change' }],
        change: (scope, form, formDatas, setFormDatas) => {
          this.setChangeText(scope.label || '', formDatas)
          this.allPopOptions.formDatas = {
            ...formDatas,
            colorNo: '',
            colorLevel: null,
            supplier: null,
            colorNo2: ''
          }
          console.log('this.allPopOptions.formDatas', scope, form, formDatas, setFormDatas)
        },
        visibleChange: (value) => {
          if (value) {
            this.getOptionConfigSelect({ fieldName: '颜色信息类型' }, 'colorInfoType')
          }
        },
        dataSource: []
      },
      _stripeSpacing52: { // 空白格 新增为空时显示
        itemType: 'view',
        prop: 'stripeSpacing52',
        isShow: (scope, form, formDatas, setFormDatas) => {
          return !this.allPopOptions.formDatas.colorInfoType || !this.allPopOptions.formDatas.colorInfoType.label
        },
        text: '',
        style: { width: '52%', 'font-size': '16px', display: 'inline-block', 'margin-bottom': '0' }
      },
      _colorNo: {
        prop: 'colorNo',
        itemType: 'input',
        minWidth: '88',
        isShow: (scope, form, formDatas, setFormDatas) => {
          return this.allPopOptions.formDatas.colorInfoType && ['智布色号', '色板申请'].includes(this.allPopOptions.formDatas.colorInfoType.label) && this.getShow(this.FormDatasInfo, '颜色信息')
        },
        className: 'cursorHandel',
        itemStyle: { width: '32%', display: 'inline-block', 'margin-left': '-90px', 'margin-bottom': '0' },
        label: '',
        placeholder: '点击选择智布色号',
        clearable: true,
        rules: [commonBlurReg],
        // readonly: true,
        clear: (scope, form, formDatas, setFormDatas) => {
          this.allPopOptions.formDatas = { ...this.allPopOptions.formDatas, ...formDatas }
        },
        focus: (event, params) => {
          if (this.colorInfoTypeLabel === '智布色号') {
            this.searchFormDatas = {}
            this.getFabricColorNoCom('1')
            event.target.blur()
          } else if (this.colorInfoTypeLabel === '色板申请') {
            this.searchFormDatas = {}
            this.getLDFromData()
            event.target.blur()
          }
        }
      },
      _colorLevel: {
        prop: 'colorLevel',
        itemType: 'select',
        minWidth: '120',
        itemStyle: { width: '32%', display: 'inline-block', 'margin-left': '-90px', 'margin-bottom': '0' },
        label: '',
        placeholder: '请选择TBA',
        isShow: (scope, form, formDatas, setFormDatas) => {
          return this.allPopOptions.formDatas.colorInfoType && ['TBA'].includes(this.allPopOptions.formDatas.colorInfoType.label) && this.getShow(this.FormDatasInfo, '颜色信息')
        },
        filterable: true,
        clearable: true,
        valueType: 'object',
        visibleChange: value => {
          this.getColorGradeIndex()
        },
        dataSource: []
      },
      _supplier: {
        prop: 'supplier',
        itemType: 'select',
        itemStyle: { width: '32%', display: 'inline-block', 'margin-left': '-90px', 'margin-bottom': '0' },
        label: '',
        minWidth: '120',
        placeholder: '请选择供应商',
        isShow: (scope, form, formDatas, setFormDatas) => {
          return this.allPopOptions.formDatas.colorInfoType && ['指定花灰'].includes(this.allPopOptions.formDatas.colorInfoType.label) && this.getShow(this.FormDatasInfo, '颜色信息')
        },
        filterable: true,
        clearable: true,
        valueType: 'object',
        visibleChange: value => {
          this.getsupplierList({ 'supplierTyope': '1', 'supplierCategory': '0', 'statusList': ['2', '3', '4', '5'] })
        },
        dataSource: []
      },
      _colorNo2: {
        prop: 'colorNo2',
        itemType: 'input',
        minWidth: '120',
        itemStyle: { width: '32%', display: 'inline-block', 'margin-left': '-90px', 'margin-bottom': '0' },
        label: '',
        isShow: (scope, form, formDatas, setFormDatas) => {
          return this.allPopOptions.formDatas.colorInfoType && ['指定花灰'].includes(this.allPopOptions.formDatas.colorInfoType.label) && this.getShow(this.FormDatasInfo, '颜色信息')
        },
        placeholder: '工厂色号',
        maxlength: 50,
        clearable: true
      },
      _stripeSpacing41: { // 空白格
        itemType: 'view',
        prop: 'stripeSpacing41',
        isShow: (scope, form, formDatas, setFormDatas) => {
          return this.allPopOptions.formDatas.colorInfoType && !['指定花灰'].includes(this.allPopOptions.formDatas.colorInfoType.label) && this.getShow(this.FormDatasInfo, '颜色信息')
        },
        text: '',
        style: { width: '32%', 'font-size': '16px', display: 'inline-block', 'margin-bottom': '0' }
      },
      _flowerInfoType: {
        prop: 'flowerInfoType',
        itemType: 'select',
        minWidth: '80px',
        valueType: 'object',
        itemStyle: { width: '32%', display: 'inline-block', 'margin-top': '16px' },
        label: '印花信息',
        disabled: false,
        isShow: (scope) => { // this.isShowIsPrintCraft(this.getIsPrintCraft, this.rowIndex - 1)
          return this.getShow(this.FormDatasInfo, '颜色信息') && this.getIsPrintCraft && this.isShowFabricType
        },
        rules: [{ required: true, message: '此项不能为空', trigger: 'change' }],
        change: (scope, form, formDatas, setFormDatas) => {
          this.allPopOptions.content._flowerNo.placeholder = (scope.label === '智布花号' ? '点击选择智布花号' : '点击选择印花申请')
          this.allPopOptions.formDatas = { ...formDatas, flowerNo: '' }
        },
        visibleChange: (value) => {
          if (value) {
            this.getOptionConfigSelect({ fieldName: '印花信息类型' }, 'flowerInfoType')
          }
        },
        dataSource: []
      },
      _flowerNo: {
        prop: 'flowerNo',
        itemType: 'input',
        className: 'cursorHandel',
        itemStyle: { width: '32%', display: 'inline-block', 'margin-top': '16px', 'margin-left': '-90px' },
        label: '',
        minWidth: '120',
        placeholder: '点击选择智布花号',
        clearable: true,
        isShow: (scope) => {
          return this.allPopOptions.formDatas.flowerInfoType && this.getShow(this.FormDatasInfo, '颜色信息') && this.getIsPrintCraft && this.isShowFabricType
        },
        // readonly: true,
        clear: (scope, form, formDatas, setFormDatas) => {
          this.$set(this.allPopOptions.formDatas, 'flowerNo', '')
        },
        focus: (event, form, formDatas, setFormDatas, scope) => {
          if (this.flowerInfoTypeLabel === '智布花号') {
            this.getFlowerNoCom()
            event.target.blur()
          } else if (this.flowerInfoTypeLabel === '印花申请') {
            this.getPrintingSo()
            event.target.blur()
          }
        }
      },
      _HorizontalLine: { // 空白格
        itemType: 'view',
        prop: 'HorizontalLine',
        isShow: (scope) => {
          return this.getShow(this.FormDatasInfo, '颜色信息') && this.getIsPrintCraft && this.isShowFabricType
        },
        text: '',
        minWidth: '0',
        style: { width: '32%', 'font-size': '16px', display: 'inline-block' }
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
          this.$refs.shearingRequirementsPop.popHandle('新增剪版要求', 'shearingRequirements')
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
        isShow: (scope) => {
          return this.getShow(this.FormDatasInfo, '条纹间距')
        },
        style: { 'padding': '16px 0', 'font-size': '16px', display: 'inline-block' }
      },
      _range: {
        prop: 'range',
        itemType: 'select',
        label: '条纹公差',
        isShow: (scope) => {
          return this.getShow(this.FormDatasInfo, '条纹间距')
        },
        valueType: 'object',
        filterable: true,
        // rules: [commonBlurReg],
        clearable: true,
        itemStyle: { width: '32%', display: 'inline-block', 'margin': '0 38% 16px 32px' },
        visibleChange: (value) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '公差(对色)' }, 'range')
          }
        },
        dataSource: []
      },
      _stripeSpacingAdd: {
        itemType: 'itemview',
        label: '',
        isShow: (scope) => {
          return !this.visibleFromData.greyClothCode && this.getShow(this.FormDatasInfo, '条纹间距')
        },
        itemStyle: { display: 'inline-block', 'margin-bottom': '16px', position: 'absolute', right: '0px', 'margin-top': '10px' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<el-button size="mini" type="primary" class="addButton">新增</el-button>`
        },
        handle: () => {
          this.$refs.stripeSpacingPop.popHandle('新增条纹间距', 'stripeSpacing')
        }
      },
      _stripeSpacingTableForm: {
        isShow: (scope) => {
          return this.getShow(this.FormDatasInfo, '条纹间距')
        },
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
      _quotationInformation: {
        itemType: 'view',
        text: '报价信息',
        style: { width: '100%', 'padding': '16px 0', 'font-size': '16px', 'border-bottom': '1px solid #e6ebf5', 'margin-bottom': '20px' }
      },
      _quotationNo: {
        prop: 'quotationNo',
        itemType: 'input',
        minWidth: '80px',
        itemStyle: { width: '32%', display: 'inline-block', 'margin-bottom': '16px' },
        label: '报价单',
        rules: [{ required: true, message: '报价单不能为空', trigger: 'blur' }],
        maxlength: 50,
        clearable: true,
        clear: (form, formDatas, setFormDatas, scope) => {
          this.allPopOptions.formDatas = {
            ...formDatas,
            'quotationNo': '',
            'refQuotedPrice': '',
            'priceTax': '',
            'price': ''
          }
          this.$nextTick(() => { this.popForm.clearValidate() })
        },
        focus: (event, form, formDatas, setFormDatas, scope) => {
          if (this.popGetData && Object.keys(this.popGetData).length) {
            this.$refs.codePop.popHandle()
            event.target.blur()
          }
        }
      },
      _refQuotedPrice: {
        prop: 'refQuotedPrice',
        itemType: 'itemview',
        minWidth: '80px',
        title: true,
        itemClassName: 'refQuotedPrice_move',
        itemStyle: { display: 'inline-block' },
        label: '',
        renderContent: (value) => {
          return value ? `(参考报价${this.currencyCode + '' + value + '/KG' || ''})` : ''
        }
      },
      _priceTax: {
        prop: 'priceTax',
        itemType: 'input',
        minWidth: '80px',
        prepend: '',
        itemStyle: { width: '32%', display: 'inline-block', 'margin-bottom': '16px', 'margin-right': '50px' },
        label: '单价(含税)',
        change: (value) => {
          this.priceTaxChange(value)
        },
        clearable: true,
        trim: (val) => { return inputFilter(val, 4) },
        rules: [{ required: true, validator: BlurFactoryNum, trigger: 'blur' }, priceReg],
        formater: (scope) => {
          return this.currencyCode ? this.$utils.priceFormat(scope.row.priceTax) ? `${this.currencyCode}${this.$utils.priceFormat(scope.row.priceTax)}` : '' : this.$utils.priceFormat(scope.row.priceTax)
        }
      },
      _price: {
        prop: 'price',
        itemType: 'input',
        change: (value) => {
          this.priceChange(value)
        },
        prepend: '',
        itemStyle: { width: '32%', display: 'inline-block', 'margin-bottom': '16px' },
        label: '单价(不含税)',
        trim: (val) => { return inputFilter(val, 4) },
        maxlength: 50,
        clearable: true,
        rules: [priceReg, { validator: UnitPriceLessThan, trigger: 'blur' }],
        formater: (scope) => {
          return this.currencyCode ? this.$utils.priceFormat(scope.row.price) ? `${this.currencyCode}${this.$utils.priceFormat(scope.row.price)}` : '' : this.$utils.priceFormat(scope.row.price)
        }
      },
      _quotationLine: { // 空白格
        itemType: 'view',
        text: '',
        style: { width: '100%', 'font-size': '16px', display: 'inline-block', 'border-top': '1px solid #E9EFF2', 'margin-bottom': '10px' }
      },
      _quantityDelivery: {
        itemType: 'view',
        text: '数量交期',
        style: { 'padding': '16px 0', 'font-size': '16px', display: 'inline-block' }
      },
      _deliveryTolerance: {
        prop: 'deliveryTolerance',
        itemType: 'select',
        label: '走货公差:',
        valueType: 'object',
        rules: [commonBlurReg],
        clearable: true,
        filterable: true,
        itemStyle: { width: '32%', display: 'inline-block', 'margin': '0 38% 16px 32px' },
        visibleChange: (value) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '走货公差' }, 'deliveryTolerance')
          }
        },
        dataSource: []
      },
      _quantityDeliveryAdd: {
        itemType: 'itemview',
        label: '',
        itemStyle: { display: 'inline-block', 'margin-bottom': '16px', position: 'absolute', right: '0px', 'margin-top': '10px' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<el-button size="mini" type="primary" class="addButton">新增</el-button>`
        },
        handle: () => {
          this.$refs.quantityDeliveryPop.popHandle('新增交期数量', 'quantityDelivery')
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
    // 需要显示小红星的字段
    const LittleRedStar = [
      'customerColor', 'styleNumber', 'customerallContentTop',
      'customerBuo'
    ]
    const quantityAdd = (params, form) => {
      if (!this.sidebarOk(params)) { return false }
      this.$refs.allPop.$refs.popComponents.form.validate(async valid => {
        if (valid) {
          this.save(params) // flag: true | false  false:表示验证不通过
          this.allPopOptions.formDatas = {}
          const dataFrom = this.allPopOptions.content
          this.shearingRequirementsData = []
          this.$set(dataFrom._shearingRequirementsTableForm, 'dataSource', [])
          this.stripeSpacingData = []
          this.$set(dataFrom._stripeSpacingTableForm, 'dataSource', [])
          this.quantityDeliveryData = []
          this.$set(dataFrom._quantityDeliveryTableForm, 'dataSource', [])
          // 清空数据
          this.$nextTick(() => {
            this.allPopOptions.formDatas = { 'colorInfoType': null, 'flowerInfoType': null }
          })
          this.visibleFromData = {}
          this.$message({ type: 'success', message: '添加成功，请继续添加' })
          this.$refs.allPop.$refs.popComponents.form.clearValidate()
        }
      })
    }

    // 颜色&数量&交期弹窗操作配置
    const allPopOptions = {
      itemType: 'drawer',
      size: '1000px',
      visible: false,
      title: '新增颜色&数量&交期',
      okText: '确定',
      ok: params => {
        const flag = this.save(params) // flag: true | false  true:表示验证不通过
        if (!flag) return
        this.allPopHandle()
        console.log('pmccc', params)
      },
      saveAndaddText: '继续添加',
      saveAndadd: quantityAdd,
      cancel: params => {
        this.allPopHandle()
      },
      formDatas: {},
      formOptions: {
        getForm: (form) => {
          this.popForm = form
        },
        syncDataHandle: (fos) => {
          this.visibleFromData = fos
          console.log('formDatasformDatas', fos)
        }
      },
      content: allContent
    }
    return {
      LittleRedStar,
      allContent,
      allPopOptions,
      // 条纹间距
      stripeSpacingColumns,
      stripeSpacingData,
      stripeSpacingOperates,
      // 剪板要求
      shearingRequirementsColumns,
      shearingRequirementsData,
      shearingRequirementsOperates,
      // 交期数量
      quantityDeliveryColumns,
      quantityDeliveryData,
      quantityDeliveryOperates,

      // 弹窗配置项
      chooseTitle: '', // 选择弹窗标题
      chooseType: '', // 选择弹窗类型 1:智布色号 2:智布花号 3:条纹间距智布色号 4LD申请 5印花SO
      chooseSearch: {}, // 搜索条件
      chooseColumns: {},
      tableData: [],
      isshowCloth: false,
      choosePagination: {}, // 色号、花号的弹窗页码
      allFromData: {}, // 侧边数据分发
      maxQuantitySeq: 0, // 数量交期中的最大值
      plateIndexFrom: {}, // 编辑的时候剪版要求数据

      TextColor: [], // 相同款号的下拉数据
      visibleFromData: {}, // 侧边栏数据

      colorInfoTypeArray: [], // 颜色信息
      flowerInfoTypeArray: [], // 印花信息
      isShowFabricType: true // 印花工艺是否显示判断值
    }
  },
  computed: {
    setgarmentPart() {
      return this.allPopOptions.formDatas && this.allPopOptions.formDatas.garmentPart || ''
    },
    getIsPrintCraft() { // 印花工艺
      let com = ''
      if (this.deliFreshData && this.deliFreshData.detail && this.deliFreshData.detail.length) {
        const tu = this.deliFreshData.detail[this.rowIndex - 1].printCraft || ''
        com = tu && tu.length ? tu : ''
      }
      return com
    },
    getpriceTax() { // 单价(含税)
      return this.visibleFromData && this.visibleFromData.priceTax || 0
    },
    getprice() { // 单价(不含税)
      return this.visibleFromData && this.visibleFromData.price || 0
    },
    colorInfoTypeLabel() { // 颜色信息下拉文字
      return this.allPopOptions.formDatas.colorInfoType && this.allPopOptions.formDatas.colorInfoType.label || ''
    },
    flowerInfoTypeLabel() { // 印花信息下拉文字
      return this.allPopOptions.formDatas.flowerInfoType && this.allPopOptions.formDatas.flowerInfoType.label || ''
    },
    FormDatasInfo() { // 是否包含提花和间
      let com = ''
      if (this.deliFreshData && this.deliFreshData.detail && this.deliFreshData.detail.length) {
        const doem = this.deliFreshData.detail[this.rowIndex - 1] || ''
        if (doem.hasOwnProperty('WeavingPattern')) {
          com = doem.WeavingPattern.name || ''
        }
      }
      return com
    },
    popGetData() {
      const obj = {}
      const com = this.deliFreshData.detail
      const Fromdata = com && com.length && com[this.rowIndex - 1]
      obj.brandId = this.deliFreshData.brand ? this.deliFreshData.brand.value : ''
      obj.fabricName = Fromdata && Fromdata.cloth ? Fromdata.cloth.label : ''
      obj.status = ['A']
      return obj
    }
  },
  watch: {
    'visibleFromData.greyClothCode': {
      handler(val, oldVal) {
        const com = this.allPopOptions.content._stripeSpacingTableForm.operates
        this.$set(com, 'isShow', !val)
      },
      deep: true,
      immediate: true
    },
    'allPopOptions.visible': {
      handler(val, oldVal) {
        if (!val) {
          this.$set(this.allPopOptions, 'formDatas', {})
          this.visibleFromData = {}
        }
      },
      deep: true,
      immediate: true
    },
    isEdit: {
      handler(val, oldVal) {
        this.changeStatus(val)
      },
      deep: true,
      immediate: true
    },
    deliFreshData: {
      handler(val, oldVal) {

      },
      deep: true,
      immediate: true
    },
    data: {},
    allPopOptions: {
      handler(val, oldVal) {

      },
      deep: true,
      immediate: true
    },
    greyClothCode: {
      handler(val, oldValue) {
        console.log('greyClothCode', val, oldValue)
      },
      deep: true,
      immediate: true
    },
    exchangeRateArraya: {
      handler(v) { },
      deep: true,
      immediate: true
    },
    unitSize: {
      handler(v) { },
      deep: true,
      immediate: true
    },
    rulea: {
      handler(v) {
        if (v && Object.keys(v).length) {
          this.encryptFn(this.allPopOptions.content, v, 'edit')
        }
      },
      deep: true
    }
  },
  created() {
    this.getOptionConfigSelect({ fieldName: '颜色信息类型' }, 'colorInfoType')
    this.getOptionConfigSelect({ fieldName: '印花信息类型' }, 'flowerInfoType')
  },
  mounted() {},
  methods: {
    // 添加或保存颜色交期数据
    save(param = {}) {
      const params = this.$utils.deepClone(param)
      if (!this.sidebarOk(params)) { return false } else {
        const HtmlData = this.$utils.deepClone(this.deliFreshData.detail[this.rowIndex - 1] || [])
        const com = HtmlData.colorQuantityDeliverySummary && HtmlData.colorQuantityDeliverySummary.colorInfo || []
        if (this.allPopOptions.title === '新增颜色&数量&交期') {
          const isFrom = this.isShowFrom(com, params) // 当行所有分录
          if (params.colorInfoType && params.colorInfoType.label === '指定花灰') {
            params.colorNo = params.colorNo2
          }
          isFrom && this.$emit('allPopFrom', { ...params, Texttype: '新增颜色&数量&交期' })
        } else { // 编辑判断添加数据 是否重复
          const HtmlData = this.$utils.deepClone(this.deliFreshData.detail[this.rowIndex - 1] || [])
          const com = HtmlData.colorQuantityDeliverySummary && HtmlData.colorQuantityDeliverySummary.colorInfo || []
          const dataSource = com.filter((v, index) => index !== params.index)
          const isFrom = this.isShowFrom(dataSource, params) // 当行所有分录
          if (params.colorInfoType && params.colorInfoType.label === '指定花灰') {
            params.colorNo = params.colorNo2
          }
          console.log('omnparams.', params)
          isFrom && this.$emit('allPopFrom', { ...params, Texttype: '编辑颜色&数量&交期' })
        }
        return true
      }
    },
    setFabricTypeClick(data) { // 判断印花是否隐藏
      this.isShowFabricType = this.setFabricType(data)
    },
    // 颜色&数量&交期弹窗显隐
    addAllInfoCopy(data) {
      this.addAllInfoData()
      // 色号
      const colorInfo = this.colorInfoTypeArray.filter((v1, index) => v1.label === '智布色号')
      // 花号
      const flowerInfo = this.flowerInfoTypeArray.filter((v2, index) => v2.label === '智布花号')

      const title = data.istype === 'edit' ? '编辑颜色&数量&交期' : '新增颜色&数量&交期'
      this.allPopHandle(title)
      this.$set(this.allPopOptions, 'content', this.allContent)
      if (data.istype === 'edit') {
        console.log('ssssomn', data)
        data.colorMatching = data.colorMatching && data.colorMatching.label ? data.colorMatching : ''
        data.shirtBody = data.shirtBody && data.shirtBody.label ? data.shirtBody : ''
        this.$set(this.allPopOptions, 'formDatas', { ...data })
        // 数量
        this.quantityDeliveryData = data.quantityDelivery && data.quantityDelivery.length ? JSON.parse(JSON.stringify(data.quantityDelivery)) : []
        // 条纹
        this.shearingRequirementsData = data.shearingRequirements && data.shearingRequirements.length ? JSON.parse(JSON.stringify(data.shearingRequirements)) : []
        // 间距
        this.stripeSpacingData = data.stripeSpacing && data.stripeSpacing.length ? JSON.parse(JSON.stringify(data.stripeSpacing)) : []

        this.$set(this.allContent._shearingRequirementsTableForm, 'dataSource', this.shearingRequirementsData)
        this.$set(this.allContent._stripeSpacingTableForm, 'dataSource', this.stripeSpacingData)
        this.$set(this.allContent._quantityDeliveryTableForm, 'dataSource', this.quantityDeliveryData)

        // 走货公差
        const dely = this.allPopOptions.formDatas
        this.$set(this.allContent._deliveryTolerance, 'dataSource', this.setArrayInfo(dely.deliveryTolerance))

        if (dely.colorInfoType && dely.colorInfoType.label === '指定花灰') {
          this.$set(this.allContent._supplier, 'dataSource', this.setArrayInfo(dely.supplier)) // 供应商
          dely.colorNo2 = dely.colorNo
        } else if (dely.colorInfoType && dely.colorInfoType.label === 'TAB') {
          this.$set(this.allContent._colorLevel, 'dataSource', this.setArrayInfo(dely.colorLevel)) // 色级
        }

        // 颜色信息
        this.$set(this.allContent._colorInfoType, 'dataSource', dely.colorInfoType ? this.setArrayInfo(dely.colorInfoType) : this.colorInfoTypeArray)
        // 印花信息
        this.$set(this.allContent._flowerInfoType, 'dataSource', dely.flowerInfoType ? this.setArrayInfo(dely.flowerInfoType) : this.flowerInfoTypeArray)

        if (dely.styleNumber) {
          // 配色要求
          this.$set(this.allContent._colorMatching, 'dataSource', this.setArrayInfo(dely.colorMatching))
          // 所属衫身
          this.$set(this.allContent._shirtBody, 'dataSource', this.setArrayInfo(dely.shirtBody))
        }

        if (this.stripeSpacingData && this.stripeSpacingData.length) { // 动态添加校验 不要可以删除  stripeSpacingPopOptions()
          this.$set(this.allContent._range, 'rules', [{ required: true, message: '条纹公差不能为空', trigger: 'change' }])
          this.$set(this.allContent._range, 'dataSource', this.setArrayInfo(dely.range))
        }
        // 如果有色/花布SKU   色号花号 不可以编辑
        //  智布色号 ：1    colorNo 有值
        if (dely.greyClothCode && dely.colorNo) {
          const com = this.$utils.deepClone(this.deliFreshData.detail[this.rowIndex - 1])
          console.log('omnb', com)
          this.$set(this.allPopOptions.content._colorInfoType, 'disabled', true)
          this.$set(this.allPopOptions.content._colorNo, 'disabled', true)
          this.$set(this.allPopOptions.content._flowerInfoType, 'disabled', true)
          this.$set(this.allPopOptions.content._flowerNo, 'disabled', true)
          this.ClearRules(true)
          this.$set(this.allContent._colorInfoType, 'dataSource', colorInfo)
          this.$set(this.allContent._flowerInfoType, 'dataSource', flowerInfo)
          this.allPopOptions.formDatas = { ...this.allPopOptions.formDatas, 'colorInfoType': colorInfo[0], 'flowerInfoType': flowerInfo[0] }
        } else if (dely.greyClothCode && !dely.colorNo) { // 有sku 没有色号
          this.$set(this.allPopOptions.content._colorInfoType, 'disabled', true)
          this.$set(this.allPopOptions.content._colorNo, 'disabled', false)
          this.$set(this.allContent._colorInfoType, 'dataSource', colorInfo)
          this.$set(this.allContent._flowerInfoType, 'dataSource', flowerInfo)
          this.allPopOptions.formDatas = {
            ...this.allPopOptions.formDatas,
            'colorInfoType': colorInfo[0],
            'flowerInfoType': flowerInfo[0]
          }
        } else {
          this.$set(this.allPopOptions.content._colorInfoType, 'disabled', false)
          this.$set(this.allPopOptions.content._colorNo, 'disabled', false)
          this.$set(this.allPopOptions.content._flowerInfoType, 'disabled', false)
          this.$set(this.allPopOptions.content._flowerNo, 'disabled', false)
          this.allPopOptions.formDatas = {
            ...this.allPopOptions.formDatas,
            'colorInfoType': dely.colorInfoType && dely.colorInfoType.label ? dely.colorInfoType : null,
            'flowerInfoType': dely.flowerInfoType && dely.flowerInfoType.label ? dely.flowerInfoType : null
          }
        }
        this.setFabricTypeClick(this.allPopOptions.formDatas)

        // 字段加密内容
        this.encryptFn(this.allContent, this.rulea, 'edit')
        this.$set(this.allPopOptions, 'saveAndadd', null)
        // 一进入页面自动搜索
        this.SearchModelNumber(this.allPopOptions.formDatas)
      } else {
        this.$set(this.allContent._range, 'rules', [])
        this.$nextTick(() => {
          this.encryptFn(this.allContent, this.rulea, 'add')
          this.allPopOptions.formDatas = {
            ...this.allPopOptions.formDatas, ...data,
            'colorInfoType': null, 'flowerInfoType': null
          }
          this.allFromData = this.$utils.deepClone(this.allPopOptions.formDatas)
          this.$set(this.allPopOptions.content._colorInfoType, 'disabled', false)
          this.$set(this.allPopOptions.content._colorNo, 'disabled', false)
          this.$set(this.allPopOptions.content._flowerInfoType, 'disabled', false)
          this.$set(this.allPopOptions.content._flowerNo, 'disabled', false)
        })
      }
      this.$nextTick(() => { this.popForm.clearValidate() })
      this.$set(this.allPopOptions.content._priceTax, 'prepend', this.currencyCode)
      this.$set(this.allPopOptions.content._price, 'prepend', this.currencyCode)
      this.$set(this.allPopOptions.content._quantityDeliveryTableForm.columns._quantity, 'label', `数量(${this.unit ? this.unit.label : ''})`)
    },
    // 设置3个组件数据
    addAllInfoData() {
      // 剪版要求
      this.shearingRequirementsData = []
      this.$set(this.allContent._shearingRequirementsTableForm, 'dataSource', [])
      //  条纹间距
      this.stripeSpacingData = []
      this.$set(this.allContent._stripeSpacingTableForm, 'dataSource', [])
      // 交期数量
      this.quantityDeliveryData = []
      this.$set(this.allContent._quantityDeliveryTableForm, 'dataSource', [])
    },
    allPopHandle(val) {
      this.$set(this.allPopOptions, 'visible', !this.allPopOptions.visible)
      if (val) {
        this.$set(this.allPopOptions, 'title', val)
      }
    },
    isSing(scope) {
      if (this.LittleRedStar.includes(scope.column.property) && this.isEdit) {
        return 'isSing'
      }
    },
    changeStatus(val) { },
    popDataFun(key, data) { // 同步右侧各个模块的全量表单数据
      if (key === 'plateCutting') { // 剪板要求
        if (data.IndexEdt === 'add') {
          this.shearingRequirementsData.push({ ...data, code: this.shearingRequirementsData.length + 1 })
          this.$set(this.allContent._shearingRequirementsTableForm, 'dataSource', this.shearingRequirementsData)
        } else {
          this.shearingRequirementsData.splice(data.code - 1, 1, data)
          this.$set(this.allContent._shearingRequirementsTableForm, 'dataSource', this.shearingRequirementsData)
        }
      } else if (key === 'stripe') { // 条纹间距
        if (data.IndexEdt === 'add') {
          this.stripeSpacingData.push({ ...data, seq: this.stripeSpacingData.length + 1 })
          this.stripeSpacingData.forEach((it, im) => { it.seq = im + 1 })
          this.$set(this.allContent._stripeSpacingTableForm, 'dataSource', this.stripeSpacingData)
        } else {
          this.stripeSpacingData.splice(data.seq - 1, 1, data)
          this.$set(this.allContent._stripeSpacingTableForm, 'dataSource', this.stripeSpacingData)
        }
        if (this.stripeSpacingData && this.stripeSpacingData.length) { // 动态添加校验
          this.$set(this.allContent._range, 'rules', [{ required: true, message: '条纹间距不能为空', trigger: 'change' }])
          this.$set(this.allContent._range, 'dataSource', this.setArrayInfo(this.visibleFromData.range))
        }
      } else if (key === 'quantity') { // 交期数量
        if (data.IndexEdt === 'add') {
          this.quantityDeliveryData.push(data)
          this.resetQuantitySeqCode(this.quantityDeliveryData)
          this.$set(this.allContent._quantityDeliveryTableForm, 'dataSource', this.quantityDeliveryData)
        } else {
          this.quantityDeliveryData.splice(data.code - 1, 1, data)
          this.resetQuantitySeqCode(this.quantityDeliveryData)
          this.$set(this.allContent._quantityDeliveryTableForm, 'dataSource', this.quantityDeliveryData)
        }
      }
    },
    // 选项配置下拉
    getOptionConfigSelect(data, type) {
      this.getOptionConfig(data).then(res => {
        if (type === 'range') { // 公差
          res.unshift({ value: '', label: '' })
          this.$set(this.allContent._range, 'dataSource', res)
        } else if (type === 'deliveryTolerance') { // 走货公差
          res.unshift({ value: '', label: '' })
          this.$set(this.allContent._deliveryTolerance, 'dataSource', res)
        } else if (type === 'chooseSearch') { // 销售季度
          this.$set(this.chooseSearch._sellQuarterly, 'dataSource', res)
        } else if (type === 'flowerInfoType') { // 印花信息
          this.flowerInfoTypeArray = res
          this.$set(this.allContent._flowerInfoType, 'dataSource', res)
        } else if (type === 'colorInfoType') { // 颜色信息
          this.colorInfoTypeArray = res
          this.$set(this.allContent._colorInfoType, 'dataSource', res)
        } else if (type === 'colorMatching') { // 配色要求
          this.$set(this.allContent._colorMatching, 'dataSource', res)
        }
      })
    },
    // 客户
    getCustomerSelect(type) {
      this.getCustomer().then(res => {
        if (type === 'stripeSpacing' || type === 'allContent') {
          this.$set(this.chooseSearch._customerId, 'dataSource', res)
        }
      })
    },
    // 获取销售团队下拉
    getSellTeamSelect(type) {
      this.getSellTeam({ functionTag: 'SAL' }).then(res => {
        if (type === 'allContent') {
          this.$set(this.chooseSearch._orgId, 'dataSource', res)
        } else if (type === 'sellerTeamId') {
          this.$set(this.chooseSearch._sellerTeamId, 'dataSource', res)
        }
      })
    },
    // 色板单号下拉
    getSwatchesNoSelect() {
      this.getSwatchesNo().then(res => {
        this.$set(this.chooseSearch._id, 'dataSource', res)
      })
    },
    // 印花SO单号下拉
    getPrintApplyNoSelect() {
      this.getPrintApplyNo().then(res => {
        this.$set(this.chooseSearch._id, 'dataSource', res)
      })
    },
    // 品牌商下拉
    getBrandSelect() {
      this.getBrand().then(res => {
        this.$set(this.chooseSearch._brandId, 'dataSource', res)
      })
    },
    // 获取年份下拉
    getYearSelect(type) {
      this.getYear().then(res => {
        if (type === 'stripeSpacing' || type === 'allContent') {
          this.$set(this.chooseSearch._sellYear, 'dataSource', res)
        }
      })
    },
    // 印花工艺下拉
    getPrintCraftSelect(type) {
      this.getPrintCraft({ classificationName: '印花工艺' }).then(res => {
        if (type === 'chooseSearch') {
          this.$set(this.chooseSearch._printCraftId, 'dataSource', res)
        }
      })
    },
    // 获取色级列表
    getColorGradeIndex() {
      this.colorGradeIndexData().then(res => {
        this.$set(this.allPopOptions.content._colorLevel, 'dataSource', res)
      })
    },

    // 处理数量交期中序号code、seq(内层)
    resetQuantitySeqCode(dataList) {
      let newNum = 0
      dataList.forEach((v, index) => {
        if (!v.orderId) {
          newNum += 1
          v.seq = this.maxQuantitySeq * 1 + newNum
        }
        v.edit = this.isEdit
        v.code = index + 1
      })
    },
    // 搜索款号相同的分录
    SearchModelNumber(formDatas, Type) {
      if (this.setgarmentPart) {
        const com = this.$utils.deepClone(formDatas)
        const dataArray = this.styleNumberseSearch(com)
        this.$set(this.allPopOptions.content._shirtBody, 'dataSource', dataArray)
        this.allPopOptions.formDatas = { ...formDatas, 'shirtBody': dataArray[0] }
      }
    },
    // 款号搜索  缺少颜色序号字段
    styleNumberseSearch(data) {
      const Text = data.styleNumber
      const rowIndex = this.rowIndex - 1
      this.TextColor = []
      const HtmlData = this.$utils.deepClone(this.deliFreshData.detail || [])
      const dataSource = HtmlData.filter((v, index) => index !== rowIndex && v.garmentPart && v.garmentPart.label === '衫身')
      dataSource.forEach((it, index) => {
        const com = it.colorQuantityDeliverySummary && it.colorQuantityDeliverySummary.colorInfo || []
        Text && com.forEach((ic, ix) => {
          if (ic.styleNumber === Text) {
            this.TextColor.push({
              label: ic.seq + '-' + this.currencySeq + '-' + ic.customerColor,
              value: ic.seq + '-' + this.currencySeq + '-' + ic.customerColor
            })
          }
        })
      })
      return this.TextColor
    },
    // 确定按钮

    // 关闭选择弹窗
    closePop() {
      console.log('omnokmmm')
      this.isshowCloth = false
    },
    // 保存色号、花号pop弹窗  选择弹窗类型 1:智布色号 2:智布花号 3:条纹间距智布色号 4LD申请 5印花SO
    savePop(params) {
      console.log('som保存色号、花号pop弹窗2222', params)
      if (['1'].includes(this.chooseType)) { // 智布色号
        this.allPopOptions.formDatas = { ...this.visibleFromData, 'colorNo': params.fabricColorNo || '', fabricColorNoid: params.id }
      } else if (['5'].includes(this.chooseType)) { // 智布花号
        this.allPopOptions.formDatas = { ...this.visibleFromData, 'flowerNo': params.fabricFlowerNo || '', fabricFlowerNoid: params.id }
      } else if (['4'].includes(this.chooseType)) { // LED
        this.allPopOptions.formDatas = { ...this.visibleFromData, 'colorNo': params.id || '', fabricColorNoid: params.id }
      } else if (['2'].includes(this.chooseType)) { // 印花so
        this.allPopOptions.formDatas = { ...this.visibleFromData, 'flowerNo': params.fabricFlowerNo || '', fabricColorNoid: params.id }
      } else if (['8'].includes(this.chooseType)) { // 大货sku
        console.log('som保存色号、花号pop弹窗3333', params)
        if (params && params.colorFabricCode) {
          // 色号
          const colorInfo = this.colorInfoTypeArray.filter((v1, index) => v1.label === '智布色号')
          // 花号
          const flowerInfo = this.flowerInfoTypeArray.filter((v2, index) => v2.label === '智布花号')

          const newData = {
            colorInfoType: colorInfo[0], //   label: '颜色信息',
            colorNo: params.colorCode, // 智布色号
            flowerInfoType: flowerInfo[0], //  label: '印花信息',
            fabricType: params.fabricType, // 色花布类型：1-色布；2-花布
            greyClothCode: params.colorFabricCode, // sku
            flowerNo: params.flowerCode // 智布花号
          }
          // 色号花号 不可以编辑
          this.$set(this.allPopOptions.content._colorInfoType, 'disabled', true)
          this.$set(this.allPopOptions.content._colorInfoType, 'dataSource', [newData.colorInfoType])

          // 色布为空，可以编辑
          this.$set(this.allPopOptions.content._colorNo, 'disabled', !!params.colorCode)
          this.$set(this.allPopOptions.content._flowerInfoType, 'disabled', true)
          this.$set(this.allPopOptions.content._flowerNo, 'disabled', true)

          this.$set(this.allPopOptions, 'formDatas', { ...this.visibleFromData, ...newData })
          // 条纹间距数据
          params.spacing && params.spacing.forEach((item, index) => {
            item.seq = index + 1
            item.colorName = params.customerColorName
            item.colorNo = params.colorFabricCode + '-' + params.customerColorName
            item.colorValue = params.rgb ? 'rgb(' + params.rgb + ')' : ''
          })
          this.$set(this.allPopOptions.content._stripeSpacingTableForm, 'dataSource', params.spacing)
          this.isShowchoose = false
        }
        this.setFabricTypeClick(this.allPopOptions.formDatas)
        this.ClearRules(true) // 有了sku,不确定带出来色号和花号  去掉必填
      }
      this.$refs.allPop.$refs.popComponents.form.clearValidate()
      this.isshowCloth = false
      this.chooseType = ''
    },

    inputTypeChange() {
      if (this.isEdit) {
        return 'input'
      }
      return 'itemview'
    },
    setChangeText(data, formDatas) { // 设置不同的显示框
      if (data === '智布色号') { // 智布色号
        this.allPopOptions.content._colorNo.placeholder = '点击选择智布色号'
      } else if (data === '色板申请') {
        this.allPopOptions.content._colorNo.placeholder = '点击选择色板申请'
      }
      this.allPopOptions.formDatas = { ...formDatas, 'colorInfoType': data, colorNo: '' }
    },
    // 单价(含税)改变计算辅助数量
    priceTaxChange(data) {
      const reg = /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{1,4})?$/
      if (!reg.test(data)) {
        return
      }
      const colorBasic = this.visibleFromData
      let price = 0
      if (data && this.taxRate) {
        price = data / (1 + (this.taxRate - 0) / 100)
        price = this.$utils.getFloat(price, 4)
        this.allPopOptions.formDatas = { ...colorBasic, priceTax: data }
        this.allPopOptions.formDatas = { ...colorBasic, price: price }
      } else if (!this.taxRate && colorBasic && colorBasic.price) {
        price = this.$utils.getFloat(colorBasic.price, 4)
      }
      if (this.quantityDeliveryData && this.quantityDeliveryData.length) {
        this.quantityDeliveryData.forEach((item) => {
          item.amountTax = data * item.quantity
          item.amount = price * item.quantity
        })
      }
    },

    // 单价(不含税)改变计算辅助数量
    priceChange(data) {
      const reg = /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{1,4})?$/ // 2.3.0 注释
      if (!reg.test(data)) {
        return
      }
      const colorBasic = this.visibleFromData
      let priceTax = 0
      if (data && this.taxRate) {
        priceTax = data * (1 + (this.taxRate - 0) / 100)
        priceTax = this.$utils.getFloat(priceTax, 4)
        this.allPopOptions.formDatas = { ...this.visibleFromData, price: data }
        this.allPopOptions.formDatas = { ...this.visibleFromData, priceTax: priceTax }
      } else if (!this.taxRate && colorBasic && colorBasic.priceTax) {
        priceTax = this.$utils.getFloat(colorBasic.priceTax, 4)
      }
      if (this.quantityDeliveryData && this.quantityDeliveryData.length) {
        this.quantityDeliveryData.forEach((item) => {
          item.amount = data * item.quantity
          item.amountTax = priceTax * item.quantity
        })
      }
    },

    // 处理颜色数量交期中序号code、seq(外层)
    resetSeqCode(dataList) {
      let newNum = 0
      dataList.forEach((v, index) => {
        if (!v.orderId) {
          newNum += 1
          v.seq = this.maxColorSeq * 1 + newNum
        }
        v.edit = this.isEdit
        v.code = index + 1
      })
    },
    // 报价单号
    OkClick(val) {
      this.allPopOptions.formDatas = { ...this.allPopOptions.formDatas, quotationNo: val.quotationId, refQuotedPrice: this.$utils.getFloat(val.salePrice * this.exchangeRateArraya[0].label, 2) + '' }
      console.log('报价单号', val)
      this.$nextTick(() => { this.popForm.clearValidate() })
    },
    // 供应商
    getsupplierList(data) {
      const com = this.allPopOptions.content
      this.supplierListMethod(data).then(res => {
        this.$set(com._supplier, 'dataSource', res)
      })
    },

    ClearRules(type = false) { // 有了sku,不确定带出来色号和花号  去掉必填
      const commonBlurReg2 = this.$getRules({ trigger: ['blur'] })
      this.$set(this.allPopOptions.content._colorNo, 'rules', type ? [] : commonBlurReg2)
      this.$set(this.allPopOptions.content._flowerNo, 'rules', type ? [] : commonBlurReg2)
    },
    // 颜色信息==>单双染下拉
    singleDoubleDyeDataUp() {
      this.singleDoubleDyeData().then(res => {
        this.$set(this.chooseSearch._odDyeId, 'dataSource', res)
      })
    },
    getPrintTechId() {
      const printTechId = []
      const dyeCraftList = this.getIsPrintCraft ? JSON.parse(this.getIsPrintCraft) : []
      dyeCraftList && dyeCraftList.forEach(Pitem => {
        if (Pitem && Pitem.value) {
          printTechId.push(Pitem.value)
        }
      })
      return printTechId
    }
  }
}
</script>

<style lang="scss">
.GoodsRedStarColor {
  table th.isSing div:before {
    content: '*';
    color: red;
  }
  .refQuotedPrice_move {
    margin-bottom: 0;
    margin-top: 10p;
    width: 64%;

    margin-left: 10px;
    height: 36px;
    display: inline-block;
    position: relative;
    top: 13px;
    text-align: left;
    font-size: 14px;
    color: #888e9e;
    font-weight: 400;
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
  .LittleRedStarColor_allpop {
    .el-table__body-wrapper {
      .el-table__row td {
        height: 50px !important;
        font-size:14px;
        .defaultOperates{
          padding:0!important ;
        }
      }
    }
    .el-table__header-wrapper{
      tr th{
        font-size:14px !important;
        height: 44px;
        color: #151222;
        font-weight: 400;
      }
    }
    .el-table__empty-text{
      font-size: 14px;
    }
  }
  .el-drawer.customDrawerclass .el-drawer__header {
    margin-bottom: 0px!important;
  }
}
</style>

<style lang="scss" scoped>
.analyse-upload {
  .el-icon-upload {
    margin: 0 !important;
  }
}
</style>
