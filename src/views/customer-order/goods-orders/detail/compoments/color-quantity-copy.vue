<!--
 * @Author: xj
 * @Description: 颜色&数量&交期
 * @Date: 2021-06-25 18:30:33
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-16 20:08:43
 * @FilePath: d:\erp\src\views\customer-order\goods-orders\detail\compoments\color-quantity-copy.vue
-->
<template>
  <div class="color Goodscolor-copyIndex">
    <!-- 表头文字 -->
    <div class="color-header color-header-colors">
      <div class="left">
        <span class="title">颜色&数量&交期</span>
        <div class="date-title color-header-dates">
          <span
            style="display: inline-block"
            class="data-font item-title"
          >单位：</span>
          <el-select
            v-model="colorQuantityDeliverySummary.unit"
            :disabled="!isEdit"
            value-key="value"
            placeholder="请选择"
            @change="unitChange"
          >
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
          <span class="data-font">
            总数量：
            <span class="data-font color-summary">
              {{ this.$utils.priceFormat(this.$utils.getFloat(colorQuantityDeliverySummary.totalQuantity, 2 ) ) || '' }}
            </span>
            {{ colorQuantityDeliverySummary.totalQuantity ? colorQuantityDeliverySummary.unit.label : '' }}
          </span>
        </div>
        <div class="date-title">
          <span class="data-font total">
            总金额(含税)：
            <span class="data-font color-summary">
              {{ colorQuantityDeliverySummary.totalAmount? currencyCode +this.$utils.priceFormat(this.$utils.getFloat(colorQuantityDeliverySummary.totalAmount,2)): '' }}
            </span>
          </span>
        </div>
        <el-button
          v-if="isEdit&&getShowAddBtn"
          type="primary"
          size="mini"
          @click="addAllInfo"
        ><span style="font-size: 14px;">新增</span></el-button>
      </div>
    </div>
    <!-- 表格数据 -->
    <div class="page-table page-tableyu" style="padding: 0 20px">
      <cs-custom-table
        ref="allColumnslData"
        :header-cell-style="headerCellStyle"
        :columns="allColumns"
        :header-cell-class-name="isSing"
        :data-source="colorQuantityDeliverySummary.colorInfo"
        :operates="allOperates"
        :pagination="pagination"
        edit-type="pop"
      />
    </div>
    <!-- 颜色、数量、交期弹窗-->
    <all-pop-options
      ref="AllPopOptionsDeom"

      :deli-fresh-data="deliFreshData"
      :currency-seq="currencySeq"
      :is-edit="isEdit"
      :tax-rate="taxRate"
      :rulea="rule"
      :unit-options="unitOptions"
      :currency-code="currencyCode"
      :grey-cloth-codes="greyClothCode"
      :suggest-width-unit="suggestWidthUnit"
      :suggest-width="suggestWidth"
      :weight-before="weightBefore"
      :row-index="rowIndex"
      :fabric-types="fabricType"
      :exchange-rate-arraya="exchangeRateArrays"
      :unit="colorQuantityDeliverySummary.unit"
      @allPopFrom="allPopFrom"
    />
  </div>
</template>
<script>
import preview from '@/views/customer-order/public/components/preview'
import shearingShow from '@/views/customer-order/public/components/shearingShow'
import picPreview from '@/views/customer-order/public/components/picPreview'
import AllPopOptions from '../common/all-pop-options.vue'
import { PublicCustomer } from '@/views/customer-order/public/index'
import { detailFun } from '@/views/customer-order/goods-orders/detail/api/detailFun'
import { setOrderFun } from '@/views/customer-order/public/api/mou'
export default {
  name: 'ColorQuantityDeliver',
  components: {
    AllPopOptions
  },
  mixins: [PublicCustomer, detailFun, setOrderFun],
  props: {
    currencyCode: {
      type: String
    },
    greyClothCode: {
      type: String
    },
    addColorQuantityDelivery: {
      type: Object
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
    isEdit: {
      type: Boolean
    },
    currencySeq: {
      type: Number
    },
    deliFreshData: {
      type: Object
    },
    rowIndex: {
      type: Number
    },
    data: {
      type: Object
    },
    syncMoudleDataHandle: {
      type: Function
    },
    setParentDataHandle: {
      type: Function
    },
    rule: {
      type: Object,
      default: () => ({})
    },
    currencycodeData: {
      type: Object
    },
    exchangeRateArrays: { // 报价单税率
      type: [Array]
    },
    showAddBtn: {
      type: Boolean,
      default: false
    },
    fabricType: { // 色布还是花布
      type: String
    }
  },

  data() {
    // table表头颜色
    const headerCellStyle = {
      'background': '#F5F7FA'
    }
    // 颜色数量交期
    const allColumns = {
      _code: {
        prop: 'code',
        label: '颜色序号',
        minWidth: '100px',
        formater: (scope) => {
          return `<p>${this.currencySeq + '-' + (scope.row.seq || 1)}</p>`
        }
      },
      _customerOrderCode: {
        prop: 'customerOrderCode',
        label: '客户单号',
        minWidth: '120px',
        showOverflowTooltip: true
      },
      _BodyColorMatching: {
        prop: 'BodyColorMatching',
        label: '所属衫身-配色要求',
        minWidth: '150px',
        formater: (scope) => {
          return this.setlabel(scope.row.shirtBody) + '-' + this.setlabel(scope.row.colorMatching)
        },
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
        minWidth: '120px',
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
        minWidth: '120px',
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
        isShow: (scope) => {
          return this.getShow(this.FormDatasInfo, '条纹间距')
        },
        componentsOptions: {
          propName: 'stripeSpacing'
        },
        formater: (scope) => {
          let stripeSpacing = ''
          const arr = []
          scope.row.stripeSpacing && scope.row.stripeSpacing.length && scope.row.stripeSpacing.forEach(item => {
            arr.push(item.colorName + item.fabricColorNo + item.height + 'cm')
          })
          stripeSpacing = arr.join(',')
          return stripeSpacing || ''
        },
        style: {
          color: 'rgb(24, 144, 255)',
          cursor: 'pointer'
        }
      },
      _colorNo: {
        prop: 'colorNo',
        label: '智布色号',
        minWidth: '120px',
        isShow: (scope) => {
          return this.getShow(this.FormDatasInfo, '颜色信息')
        },
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.setColotNo(scope.row)
        }
      },
      _flowerNo: {
        prop: 'flowerNo',
        label: '智布花号',
        minWidth: '120px',
        components: {
          picPreview
        },
        isShow: (scope) => {
          return this.getShow(this.FormDatasInfo, '颜色信息')
        },
        handle: scope => { },
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
      _quotationNo: {
        prop: 'quotationNo',
        label: '报价单号',
        minWidth: '120px',
        showOverflowTooltip: true
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
      _deliveryTolerance: {
        prop: 'deliveryTolerance',
        label: '走货公差',
        minWidth: '120px',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.setlabel(scope.row.deliveryTolerance)
        }
      },
      _seq: {
        prop: 'seq',
        label: '交期序号',
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
        minWidth: '120px',
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div>'
          if (scope.row.quantityDelivery && scope.row.quantityDelivery.length) {
            scope.row.quantityDelivery.forEach(v => {
              html += `<p>${v.quantity || '-'}</p>`
            })
            html += '</div>'
          }
          return html
        }
      },
      _auxiliaryQuantity: {
        prop: 'auxiliaryQuantity',
        label: '辅助数量(KG)',
        minWidth: '120px',
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div>'
          if (scope.row.quantityDelivery && scope.row.quantityDelivery.length) {
            scope.row.quantityDelivery.forEach(v => {
              let tempField = ''
              if ((v.auxiliaryQuantity + '').indexOf('***') !== -1) {
                tempField = v.auxiliaryQuantity
              } else {
                tempField = this.$utils.priceFormat(this.$utils.getFloat(v.auxiliaryQuantity, 2)) ? this.$utils.priceFormat(this.$utils.getFloat(v.auxiliaryQuantity, 2)) : ''
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
        label: '合计金额(含税)',
        minWidth: '140px',
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div>'
          if (scope.row.quantityDelivery && scope.row.quantityDelivery.length) {
            scope.row.quantityDelivery.forEach(v => {
              html += `<p>${this.encryptedFieldFormater(v.amountTax, this.currencyCode)}</p>`
            })
            html += '</div>'
          }
          return html
        }
      },
      _amount: {
        prop: 'amount',
        label: '合计金额(不含税)',
        minWidth: '140px',
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div>'
          if (scope.row.quantityDelivery && scope.row.quantityDelivery.length) {
            scope.row.quantityDelivery.forEach(v => {
              html += `<p>${this.encryptedFieldFormater(v.amount, this.currencyCode)}</p>`
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
        formater: () => {
          return '未安排'
        }
      }
    }
    const allOperatesData = [
      {
        label: '编辑',
        isShow: true,
        handle: async(scope) => {
          if (this.isShowoperate()) {
            this.editAll = scope.row
            this.editAll.index = scope.$index
            if (this.editAll.maxQuantitySeq) {
              this.maxQuantitySeq = this.editAll.maxQuantitySeq
            }
            this.editAll.garmentPart = this.getGarmentPart() // 成衣
            this.editAll.fabricType = this.fabricType// SKU 带出来的是1色号还是2花号
            this.editAll.colorInfoType = this.setInfoValue(this.editAll.colorInfoType) // label: '颜色信息',
            this.editAll.flowerInfoType = this.setInfoValue(this.editAll.flowerInfoType) // label: '印花信息',
            this.editAll.supplier = this.setInfoValue(this.editAll.supplier) // label: '供应商',
            this.editAll.refQuotedPrice = this.editAll.refQuotedPrice ? this.editAll.refQuotedPrice + '' : ''
            const obj = { istype: 'edit' }
            this.$refs.AllPopOptionsDeom.addAllInfoCopy({ ...obj, ...this.editAll })
          }
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
            this.colorQuantityDeliverySummary.colorInfo.splice(scope.$index, 1)
            this.resetSeqCode(this.colorQuantityDeliverySummary.colorInfo)
            // 计算总数量和总金额(含税)
            let totalQuantity = 0
            let totalAmount = 0
            this.colorQuantityDeliverySummary.colorInfo.length && this.colorQuantityDeliverySummary.colorInfo.forEach(item => {
              if (item.quantityDelivery && item.quantityDelivery.length) {
                item.quantityDelivery.forEach(items => {
                  totalAmount = Number(totalAmount) + Number(items.amountTax) // 总金额(含税)
                  totalQuantity = Number(totalQuantity) + Number(items.auxiliaryQuantity) // 总数量
                })
              }
            })
            this.colorQuantityDeliverySummary.totalQuantity = this.$utils.getFloat(totalQuantity, 2)
            this.colorQuantityDeliverySummary.totalAmount = this.$utils.getFloat(totalAmount, 2)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      }
    ]
    // 颜色数量交期操作栏
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
    // 需要显示小红星的字段
    const LittleRedStar = [
      'code', 'customerClothNumber', 'customerColor', 'customerColorEn',
      'shearingRequirements', 'priceTax', 'price', 'quantity', 'auxiliaryQuantity'
    ]
    return {
      headerCellStyle,
      isClear: true,
      LittleRedStar,
      unitOptions: [], // 表头单位数据集合
      allColumns, // 颜色数量交期 列表字段
      allOperatesData,
      allOperates, // 颜色数量交期 操作栏
      pagination,
      colorQuantityDeliverySummary: {
        totalAmount: 0,
        totalQuantity: 0,
        maxColorSeq: '',
        unit: {},
        colorInfo: []
      },
      editAll: {}, // 编辑某条数量交期数据
      maxColorSeq: 0,
      maxQuantitySeq: 0// 颜色交期分录序号
    }
  },
  computed: {
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
    getShowAddBtn() {
      return this.showAddBtn
    }
  },
  watch: {
    isEdit: {
      handler(val, oldVal) {
        this.changeStatus(val)
      },
      deep: true,
      immediate: true
    },
    data: {
      handler(val, oldVal) {
        // if (val && Object.keys(val).length) {
        if (val && Object.keys(val).length && !val.setDefaultColorInfo) {
          val.colorInfo = val.colorInfo ? val.colorInfo : []
          if (this.isClear) {
            val.totalAmount = 0
            val.colorInfo && val.colorInfo.length && val.colorInfo.forEach(item => {
              item.priceTax = ''
              item.price = ''
              item.quantityDelivery && item.quantityDelivery.length && item.quantityDelivery.forEach(items => {
                items.amount = ''
                items.amountTax = ''
              })
            })
          }
          this.colorQuantityDeliverySummary = this.$utils.deepClone(val)
          if (val.maxColorSeq) {
            this.maxColorSeq = val.maxColorSeq
          }
        } else {
          this.maxColorSeq = 0
          this.colorQuantityDeliverySummary = {
            totalAmount: 0,
            totalQuantity: 0,
            maxColorSeq: '',
            unit: this.unitOptions[0],
            // colorInfo: [],
            colorInfo: val.setDefaultColorInfo ? [this.getDefaultColorInfo()] : []
          }
        }
      },
      deep: true,
      immediate: true
    },
    deliFreshData: {
      handler(val, oldVal) {
        console.log('odeliFreshData', val)
      },
      deep: true,
      immediate: true
    },
    'colorQuantityDeliverySummary': {
      handler(val) {
        console.log('pcolorQuantityDeliverySummary', val)
        this.syncMoudleDataHandle('colorQuantityDeliveryData', val)
      },
      deep: true,
      immediate: true
    },
    taxRate: {
      handler(val, oldValue) {
        if (oldValue && oldValue !== '' && this.isEdit) {
          this.isClear = true
          this.colorQuantityDeliverySummary.totalAmount = 0
          this.colorQuantityDeliverySummary.colorInfo && this.colorQuantityDeliverySummary.colorInfo.length && this.colorQuantityDeliverySummary.colorInfo.forEach(item => {
            item.priceTax = ''
            item.price = ''
            item.quantityDelivery.length && item.quantityDelivery.forEach(items => {
              items.amount = ''
              items.amountTax = ''
            })
          })
        }
      },
      deep: true,
      immediate: true
    },
    weightBefore: {
      handler(val, oldValue) {
        if (oldValue && oldValue !== '') {
          this.calculateAuxiliaryQuantity(val, 'weightBefore')
        }
      },
      deep: true,
      immediate: true
    },
    suggestWidth: {// 成品幅宽
      handler(val, oldValue) {
        if (oldValue && oldValue !== '') {
          this.calculateAuxiliaryQuantity(val, 'suggestWidth')
        }
      },
      deep: true,
      immediate: true
    },
    suggestWidthUnit: {
      handler(val, oldValue) {
        if (oldValue && oldValue !== '') {
          this.calculateAuxiliaryQuantity(val, 'suggestWidthUnit')
        }
      },
      deep: true,
      immediate: true
    },
    currencyCode: { // 主表币别变化 需要清空报价单号和参考报价
      handler(v) {
      },
      deep: true,
      immediate: true
    },
    currencycodeData: {
      handler(v) {},
      deep: true,
      immediate: true
    },
    exchangeRateArrays: {
      handler(v) {},
      deep: true,
      immediate: true
    },
    greyClothCode: {
      handler(val, oldValue) {
        console.log('greyClothCode2', val, oldValue)
        console.log('greyClothCode3', this.addColorQuantityDelivery)
        if (val !== oldValue) {
          if (this.colorQuantityDeliverySummary.colorInfo && this.colorQuantityDeliverySummary.colorInfo.length) {
            this.colorQuantityDeliverySummary.colorInfo && this.colorQuantityDeliverySummary.colorInfo.length && this.colorQuantityDeliverySummary.colorInfo.forEach(item => {
              item.greyClothCode = ''
              item.stripeSpacing = null
              item.fabricColorNo = ''
              item.fabricFlowerNo = ''
            })
          } else {
            this.colorQuantityDeliverySummary.colorInfo.push(this.getDefaultColorInfo())
          }
        }
      }
    },
    fabricType: {
      handler(v) {},
      deep: true,
      immediate: true
    },
    rule: {
      handler(v) {},
      deep: true
    }
  },
  mounted() {
    this.getUnitsSelect()
  },
  methods: {
    isSing(scope) {
      if (this.LittleRedStar.includes(scope.column.property) && this.isEdit) {
        return 'isSing'
      }
    },
    // 全局开关按钮
    changeStatus(val) {
      this.isClear = false
      this.isEdit = val
      this.$set(this.allOperates, 'isShow', val)
    },
    // 侧边栏保存接口
    allPopFrom(data) {
      if (data.Texttype === '新增颜色&数量&交期') {
        delete data.Texttype
        this.colorQuantityDeliverySummary.colorInfo.push(data)
        this.resetSeqCode(this.colorQuantityDeliverySummary.colorInfo)
      } else {
        delete data.Texttype
        this.colorQuantityDeliverySummary.colorInfo.splice(this.editAll.index, 1, data)
      }
      // 计算总数量和总金额(含税)
      let totalQuantity = 0
      let totalAmount = 0
      this.colorQuantityDeliverySummary.colorInfo.length && this.colorQuantityDeliverySummary.colorInfo.forEach(item => {
        if (item.quantityDelivery && item.quantityDelivery.length) {
          item.quantityDelivery.forEach(items => {
            totalAmount = Number(totalAmount) + Number(items.amountTax) // 总金额(含税)
            totalQuantity = Number(totalQuantity) + Number(items.auxiliaryQuantity) // 总数量
          })
        }
      })
      this.colorQuantityDeliverySummary.totalQuantity = this.$utils.getFloat(totalQuantity, 2)
      this.colorQuantityDeliverySummary.totalAmount = this.$utils.getFloat(totalAmount, 2)
    },
    // 单位编辑计算
    unitChange(val) {
      this.$set(this.allColumns._quantity, 'label', `数量(${val.label})`)
      this.colorQuantityDeliverySummary.unit = val
      this.colorQuantityDeliverySummary.totalQuantity = 0
      const dataNum = this.colorQuantityDeliverySummary.colorInfo
      dataNum && dataNum.length && dataNum.forEach(item => {
        const comData = item.quantityDelivery
        comData && comData.length && comData.forEach(items => {
          const Tim = {
            quantity: items.quantity,
            unit: val,
            weightBefore: this.weightBefore,
            suggestWidthUnit: this.suggestWidthUnit,
            suggestWidth: this.suggestWidth
          }
          this.colorQuantityDeliverySummary.totalQuantity += this.$utils.auxiliaryQuantityExpressionData(Tim)
        })
      })
    },
    // 新增颜色数量交期
    addAllInfo() {
      if (this.isShowoperate()) {
        const obj = { garmentPart: this.getGarmentPart(), type: '' }// 成衣
        this.$refs.AllPopOptionsDeom.addAllInfoCopy(obj)
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
    // 单位下拉
    getUnitsSelect() {
      this.getUnits().then(res => {
        this.unitOptions = this.getUnitsSel(res || [])
        if ((!this.colorQuantityDeliverySummary || !this.colorQuantityDeliverySummary.unit || !this.colorQuantityDeliverySummary.unit.value) && this.unitOptions && this.unitOptions.length) {
          this.colorQuantityDeliverySummary.unit = this.unitOptions[0]
          this.$set(this.allColumns._quantity, 'label', `数量(${this.unitOptions[0].label})`)
        }
      })
    },
    // 幅宽、幅宽单位、洗前克重变化计算辅助数量
    calculateAuxiliaryQuantity(val, type) {
      // const suggestFabric = ''
      let weightBefore = ''
      let suggestWidth = ''
      let suggestWidthUnit = ''
      suggestWidth = type === 'suggestWidth' ? val : this.suggestWidth ? this.suggestWidth : ''
      suggestWidthUnit = type === 'suggestWidthUnit' ? val : this.suggestWidthUnit ? this.suggestWidthUnit : ''
      weightBefore = type === 'weightBefore' ? val : this.weightBefore ? this.weightBefore : ''
      this.colorQuantityDeliverySummary.totalQuantity = 0
      const unit = this.colorQuantityDeliverySummary.unit
      const dataNum = this.colorQuantityDeliverySummary.colorInfo
      dataNum && dataNum.length && dataNum.forEach(item => {
        const comData = item.quantityDelivery
        comData && comData.length && comData.forEach(items => {
          const Tim = {
            quantity: items.quantity,
            unit: unit,
            weightBefore: weightBefore,
            suggestWidthUnit: suggestWidthUnit,
            suggestWidth: suggestWidth
          }
          this.colorQuantityDeliverySummary.totalQuantity += this.$utils.auxiliaryQuantityExpressionData(Tim)
        })
      })
    },
    // 新增和编辑前提操作
    isShowoperate() {
      const deli = this.deliFreshData
      const color = this.colorQuantityDeliverySummary
      const cloth = deli.detail[this.rowIndex - 1].cloth
      let show = true
      const pu = []
      if (!this.setlabel(deli.currency)) {
        pu.push('请先选择币别')
      } else if (!this.setlabel(deli.brand)) {
        pu.push('请先选择品牌商')
      } else if (!this.setlabel(cloth)) {
        pu.push('请先选择布类')
      } else if (!color.unit || !color.unit.value) {
        pu.push('请先选择单位')
      } else if (!this.exchangeRateArrays.length || !this.exchangeRateArrays[0].label) {
        pu.push('当前币别没有汇率,请先配置汇率')
      }
      if (pu.length) {
        this.$message({ type: 'error', message: pu[0] })
        show = false
      }
      return show
    },
    // 是否为下栏
    getGarmentPart() {
      const vom = this.$utils.deepClone(this.deliFreshData || {})
      const garmentPart = vom.detail[this.rowIndex - 1].garmentPart ? vom.detail[this.rowIndex - 1].garmentPart.label === '下栏' : false
      return garmentPart
    },
    setColotNo(data) {
      if (this.setlabel(data.colorInfoType) === '智布色号') {
        return data.colorNo ? '智布色号 - ' + data.colorNo : ''
      } else if (this.setlabel(data.colorInfoType) === '色板申请') {
        console.log('data.colorNo', data.colorNo, data.colorNo ? '色板申请 - ' + data.colorNo : '')
        return data.colorNo ? '色板申请 - ' + data.colorNo : ''
      } else if (this.setlabel(data.colorInfoType) === 'TBA') {
        return data.colorLevel ? 'TBA - ' + data.colorLevel.label : ''
      } else if (this.setlabel(data.colorInfoType) === '指定花灰') {
        return data.supplier ? ('指定花灰 - ' + data.supplier ? data.supplier.label : '' + data.colorNo) : ''
      }
    },
    getDefaultColorInfo() {
      return {
        seq: 1,
        greyClothCode: this.addColorQuantityDelivery && this.addColorQuantityDelivery.colorFabricCode ? this.addColorQuantityDelivery.colorFabricCode : '',
        stripeSpacing: this.addColorQuantityDelivery && this.addColorQuantityDelivery.spacing ? this.addColorQuantityDelivery.spacing : null,
        fabricColorNo: this.addColorQuantityDelivery && this.addColorQuantityDelivery.colorCode ? this.addColorQuantityDelivery.colorCode : '',
        fabricFlowerNo: this.addColorQuantityDelivery && this.addColorQuantityDelivery.flowerCode ? this.addColorQuantityDelivery.flowerCode : ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.Goodscolor-copyIndex{
  background: #ffffff;
  .color-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 15px 20px;
    span {
      font-size: 16px;
    }
    .el-button {
      span {
        font-size: 14px;
        font-weight: normal;
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
          color: #ff4444;
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
  .page-tableyu {
    /deep/tbody .el-table__row td {
      padding: 0 !important;
    }
  }
  @media screen and (max-width: 1500px) { //小屏单位下拉
    .color-header-colors {
      .color-header-dates{
        .el-select{
          width: 80px;
        }
      }
      .right{
        .total{margin: 0 40px;}
        // /deep/.el-button--mini{margin-right: 40px;}
      }
    }
  }

}
</style>

<style lang="scss">
.Goodscolor-copyIndex {
.cursorHandel {
  input {
    cursor: pointer;
  }
}
.printColorDesign {
  width: 36px;
  height: 36px;
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

  .page-tableyu table th.isSing div:before {
    content: '*';
    color: red;
  }
}
</style>
