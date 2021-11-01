<template>
  <div class="color">
    <div class="color-header color-header-colors">
      <div class="left">
        <span class="title">颜色&数量&交期</span>
      </div>
      <div class="right">
        <div class="date-title">
          <span class="data-font">单位：<span style="color: #474747;font-size: 14px;">{{ colorQuantityDeliverySummary.unit?colorQuantityDeliverySummary.unit.label:'' }}</span></span>
        </div>
        <div class="date-title">
          <span class="data-font total">总数量：<span style="color: #FF9214;font-size: 14px;">{{ this.$utils.priceFormat(this.$utils.getFloat(colorQuantityDeliverySummary.totalQuantity, 2)) || '' }} </span><span style="color: #474747;font-size: 14px;">{{ colorQuantityDeliverySummary.totalQuantity ? colorQuantityDeliverySummary.unit&&colorQuantityDeliverySummary.unit.label : '' }}</span></span>
        </div>
        <div class="date-title">
          <span class="data-font" style="margin-right:10px">总金额(含税)：<span style="color: #FF9214;font-size: 14px;">{{ currencyCode + this.$utils.priceFormat(this.$utils.getFloat(colorQuantityDeliverySummary.totalAmount, 2)) || '' }}</span></span>
        </div>
        <el-button v-if="isEdit&&getShowAddBtn" type="primary" plain size="mini" @click="addAllInfo">新增</el-button>
      </div>
    </div>
    <div class="page-table" style="padding: 0 20px;">
      <cs-custom-table
        ref="allColumnslData"
        tooltip-effect="light"
        :header-cell-style="headerCellStyle"
        :columns="allColumns"
        :header-cell-class-name="isSing"
        :data-source="colorQuantityDeliverySummary.reissueColorInfo"
        :operates="allOperates"
        :pagination="pagination"
        edit-type="pop"
      />
    </div>
    <!-- 颜色、数量、交期弹窗 -->
    <div class="pop allPop">
      <cs-custom-pop ref="allPop" :options="allPopOptions" />
    </div>
    <!-- 颜色交期新增 -->
    <div class="pop dialog">
      <cs-custom-pop :options="colorQuantityAddPopOptions" />
    </div>
    <!-- 数量交期弹窗 -->
    <div class="pop">
      <cs-custom-pop ref="quantityDeliveryPop" :options="quantityDeliveryPopOptions" />
    </div>
  </div>
</template>
<script>
import checkboxButton from './checkbox-button'
import preview from '@/views/customer-order/public/components/preview'
// import picPreview from '@/views/customer-order/public/components/picPreview'
import { PublicCustomer } from '@/views/customer-order/public/index'
export default {
  name: 'ColorQuantityDeliver',
  components: {
    // choosePop
  },
  mixins: [PublicCustomer],
  props: {
    status: {
      type: String
    },
    greyClothCode: {
      type: String
    },
    addColorQuantityDelivery: {
      type: Object
    },
    taxRate: {
      type: [Number, String]
    },
    suggestWidth: {
      type: [Number, String]
    },
    suggestWidthUnit: {
      type: [Number, String]
    },
    weightBefore: {
      type: [Number, String]
    },
    currencyCode: {
      type: String
    },
    rowIndex: {
      type: Number
    },
    currencySeq: {
      type: Number
    },
    isEdit: {
      type: Boolean
    },
    data: {
      type: Object
    },
    orderData: {
      type: Object,
      default: () => ({ detail: [] })
    },
    rule: {
      type: Object,
      default: () => ({})
    },
    syncMoudleDataHandle: {
      type: Function
    },
    setParentDataHandle: {
      type: Function
    },
    showAddBtn: {
      type: Boolean,
      default: false
    },
    coOrderColorInfo: {
      type: Array
    }
  },
  data() {
    // table表头颜色
    const headerCellStyle = {
      'background': '#F5F7FA'
    }
    // 当前时间之前的时间不能选择
    const pickerOptionsBefore = {
      disabledDate(time) {
        return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
      }
    }
    const baseColumns = {
      _code: {
        prop: 'code',
        label: '颜色序号',
        minWidth: '100px',
        formater: (scope) => {
          return this.currencySeq + '-' + (scope.row.seq || 1)
        }
      },
      _shirtBody_colorMatching: {
        prop: 'shirtBody_colorMatching',
        label: '所属衫身-配色要求',
        minWidth: '150px',
        formater: (scope) => {
          return scope.row.shirtBody && scope.row.shirtBody.label && (scope.row.shirtBody.label + '-' + (scope.row.colorMatching && scope.row.colorMatching.label))
        },
        showOverflowTooltip: true
      },
      _customerClothNumber: {
        prop: 'customerClothNumber',
        label: '客户布号',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _customerOrderCode: {
        prop: 'customerOrderCode',
        label: '客户单号',
        minWidth: '120px',
        showOverflowTooltip: true
      },
      _styleNumber: {
        prop: 'styleNumber',
        label: '客户款号',
        minWidth: '120',
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
      // _greyClothCode: {
      //   prop: 'greyClothCode',
      //   label: '色布/印花布编码',
      //   labelClassName: 'greylableStyle',
      //   className: 'nogreyLableStyle',
      //   minWidth: '140',
      //   showOverflowTooltip: true
      // },
      _colorNo: {
        prop: 'colorNo',
        label: '智布色号',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.getShowValue('颜色信息', scope.row)
        }
      },
      _flowerNo: {
        prop: 'flowerNo',
        label: '智布花号',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.getShowValue('印花信息', scope.row)
        }
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
      _quotationNo: {
        prop: 'quotationNo',
        label: '报价单号',
        minWidth: '120px',
        showOverflowTooltip: true
      }
    }
    const popColumns = {
      ...baseColumns,
      _priceTax: {
        prop: 'priceTax',
        label: '单价(含税)',
        // headerClick: this.showPrice,
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          // if (scope.row.quantityDeliveryDetail && scope.row.quantityDeliveryDetail.length) {
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
          // if (scope.row.quantityDeliveryDetail && scope.row.quantityDeliveryDetail.length) {
          return this.encryptedFieldFormater(scope.row.price)
          // }
        }
      },
      _deliveryTolerance: {
        prop: 'deliveryTolerance',
        label: '走货公差',
        minWidth: '120px',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.deliveryTolerance && scope.row.deliveryTolerance.label || ''
        }
      }
    }
    // 颜色数量交期
    const allColumns = {
      ...baseColumns,
      _priceTax: {
        prop: 'priceTax',
        label: '单价(含税)',
        renderHeader: this.renderHeaderPrice,
        // headerClick: this.showPrice,
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          // if (scope.row.quantityDeliveryDetail && scope.row.quantityDeliveryDetail.length) {
          return this.encryptedFieldFormater(scope.row.priceTax)
          // }
        }
      },
      _price: {
        isShow: false,
        prop: 'price',
        label: '单价(不含税)',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          // if (scope.row.quantityDeliveryDetail && scope.row.quantityDeliveryDetail.length) {
          return this.encryptedFieldFormater(scope.row.price)
          // }
        }
      },
      _deliveryTolerance: {
        prop: 'deliveryTolerance',
        label: '走货公差',
        minWidth: '120px',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.deliveryTolerance && scope.row.deliveryTolerance.label || ''
        }
      },
      _seq: {
        prop: 'seq',
        label: '交期序号',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div>'
          if (scope.row.quantityDeliveryDetail && scope.row.quantityDeliveryDetail.length) {
            scope.row.quantityDeliveryDetail.forEach(v => {
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
        renderHeader: this.renderHeaderQuantity,
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div>'
          if (scope.row.quantityDeliveryDetail && scope.row.quantityDeliveryDetail.length) {
            scope.row.quantityDeliveryDetail.forEach(v => {
              html += `<p>${v.quantity || '-'}</p>`
            })
            html += '</div>'
          }
          return html
        }
      },
      _auxiliaryQuantity: {
        isShow: false,
        prop: 'auxiliaryQuantity',
        label: '辅助数量(KG)',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div>'
          if (scope.row.quantityDeliveryDetail && scope.row.quantityDeliveryDetail.length) {
            scope.row.quantityDeliveryDetail.forEach(v => {
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
        label: '合计金额(含税)',
        minWidth: '170',
        renderHeader: this.renderHeaderAmount,
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div>'
          if (scope.row.quantityDeliveryDetail && scope.row.quantityDeliveryDetail.length) {
            scope.row.quantityDeliveryDetail.forEach(v => {
              html += `<p>${this.encryptedFieldFormater(v.amountTax)}</p>`
            })
            html += '</div>'
          }
          return html
        }
      },
      _amount: {
        isShow: false,
        prop: 'amount',
        label: '合计金额(不含税)',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div>'
          if (scope.row.quantityDeliveryDetail && scope.row.quantityDeliveryDetail.length) {
            scope.row.quantityDeliveryDetail.forEach(v => {
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
          if (scope.row.quantityDeliveryDetail && scope.row.quantityDeliveryDetail.length) {
            scope.row.quantityDeliveryDetail.forEach(v => {
              html += `<p>${v.delivery ? this.$filters.parseTime(v.delivery + '', '{y}-{m}-{d}') : '-'}</p>`
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
          this.allPopHandle('编辑颜色&数量&交期')
          this.editAll = scope.row
          this.WeavingPattern = await this.getWeavingPattern(this.orderData.detail[this.rowIndex - 1].cloth.label,
            this.orderData.detail[this.rowIndex - 1].cloth.value) || {}
          this.editAll.index = scope.$index
          if (this.editAll.maxSeq && this.$route.params.id) {
            this.maxQuantitySeq = this.editAll.maxSeq
          }
          this.$set(this.allPopOptions, 'formDatas', { ...scope.row })
          this.quantityDeliveryData = this.editAll.quantityDeliveryDetail && this.editAll.quantityDeliveryDetail.length ? JSON.parse(JSON.stringify(this.editAll.quantityDeliveryDetail)) : []
          this.stripeSpacingData = scope.row.stripeSpacing && scope.row.stripeSpacing.length ? JSON.parse(JSON.stringify(scope.row.stripeSpacing)) : []
          this.$set(this.allContent._stripeSpacingTableForm, 'dataSource', this.stripeSpacingData)
          this.$set(this.allContent._quantityDeliveryTableForm, 'dataSource', this.quantityDeliveryData)

          this.$set(this.allContent._range, 'dataSource', scope.row.range && scope.row.range.value ? [scope.row.range] : '')
          // 字段加密内容
          this.encryptFn(this.allContent, this.rule, 'edit')
          this.$set(this.allPopOptions, 'saveAndadd', null)
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
            this.colorQuantityDeliverySummary.reissueColorInfo.splice(scope.$index, 1)
            let totalQuantity = 0
            let totalAmount = 0
            this.colorQuantityDeliverySummary.reissueColorInfo && this.colorQuantityDeliverySummary.reissueColorInfo.length && this.colorQuantityDeliverySummary.reissueColorInfo.forEach((item) => {
              item.quantityDeliveryDetail && item.quantityDeliveryDetail.length && item.quantityDeliveryDetail.forEach(items => {
                totalAmount = Number(totalAmount) + Number(items.amountTax) // 总金额(含税)
                totalQuantity = Number(totalQuantity) + Number(items.quantity) // 总数量
              })
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
    const allOperates = {
      label: '操作',
      width: '130',
      fixed: 'right',
      dataSource: allOperatesData
    }
    const validate = (rule, value, callback) => {
      const reg = /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,2})?$/
      if (!reg.test(value) || !(value - 0)) {
        callback(new Error('0~999.99'))
      } else {
        callback()
      }
    }
    // 交期数量弹窗内容
    const quantityDeliveryContent = {
      _seq: {
        prop: 'seq',
        label: '交期序号',
        itemType: 'input',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        disabled: true,
        clearable: true
      },
      _quantity: {
        prop: 'quantity',
        label: '数量',
        itemType: this.inputTypeChange,
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        rules: [{ validator: validate, trigger: 'blur' }, { required: true, message: '数量不能为空', trigger: ['change'] }],
        clearable: true,
        change: (value) => {
          this.quantityDeliveryChange(value)
        },
        formater: (scope) => {
          return this.$utils.priceFormat(scope.row.quantity)
        }
      },
      _auxiliaryQuantity: {
        prop: 'auxiliaryQuantity',
        label: '辅助数量',
        append: 'KG',
        itemType: this.inputTypeChange,
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        clearable: true,
        disabled: true
      },
      _amountTax: {
        prop: 'amountTax',
        label: '合计金额(含税)',
        itemType: this.inputTypeChange,
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        clearable: true,
        disabled: true
      },
      _amount: {
        prop: 'amount',
        label: '合计金额(不含税)',
        itemType: this.inputTypeChange,
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
      if (this.$refs.quantityDeliveryPop.$refs.popComponents.form) {
        this.$refs.quantityDeliveryPop.$refs.popComponents.form.validate((v) => {
          if (v) {
            if (!this.quantityDeliveryData) {
              this.quantityDeliveryData = []
            }
            this.$set(this.quantityDeliveryPopOptions, 'formDatas', {})
            this.quantityDeliveryData.push({ ...params })
            this.resetQuantitySeqCode(this.quantityDeliveryData)
            this.$set(this.allContent._quantityDeliveryTableForm, 'dataSource', this.quantityDeliveryData)
            this.$message({
              type: 'success',
              message: '添加成功，请继续添加'
            })
            this.$nextTick(() => {
              this.$refs.quantityDeliveryPop.$refs.popComponents.form.clearValidate()
            })
          }
        })
      }
    }
    // 交期数量弹窗配置
    const quantityDeliveryPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '新增交期数量',
      okText: '确定',
      width: '700px',
      className: 'quantity-delivery',
      ok: params => {
        // const reg = /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{1,2})?$/
        // if (!reg.test(params.quantity)) {
        //   this.$message({ type: 'warning', message: '数量请填写0~999.99' })
        //   return
        // }
        if (this.$refs.quantityDeliveryPop.$refs.popComponents.form) {
          this.$refs.quantityDeliveryPop.$refs.popComponents.form.validate((v) => {
            if (v) {
              if (this.quantityDeliveryPopOptions.title === '新增交期数量') {
                this.quantityDeliveryData.push(params)
                this.resetQuantitySeqCode(this.quantityDeliveryData)
                this.$set(this.allContent._quantityDeliveryTableForm, 'dataSource', this.quantityDeliveryData)
              } else {
                this.quantityDeliveryData.splice(params.code - 1, 1, params)
                this.resetQuantitySeqCode(this.quantityDeliveryData)
                this.$set(this.allContent._quantityDeliveryTableForm, 'dataSource', this.quantityDeliveryData)
              }
              this.popHandle('', 'quantityDelivery')
              this.$nextTick(() => {
                this.$refs.quantityDeliveryPop.$refs.popComponents.form.clearValidate()
              })
            }
          })
        }
      },
      saveAndaddText: '继续添加',
      saveAndadd: quantityAdd,
      cancel: params => {
        this.popHandle('', 'quantityDelivery')
      },
      formDatas: { quantity: '', delivery: '' },
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
            this.encryptFn(this.quantityDeliveryContent, this.rule, 'edit')
            this.$set(this.quantityDeliveryPopOptions, 'saveAndadd', null)
            scope.row.amount = this.$utils.getFloat(scope.row.amount, 2) || ''
            scope.row.amountTax = this.$utils.getFloat(scope.row.amountTax, 2) || ''
            this.setFormDatas({ ...scope.row, code: scope.$index + 1 }, 'quantityDeliveryDetail')
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
              this.resetQuantitySeqCode(this.quantityDeliveryData)
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
        label: '交期序号'
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
        label: '辅助数量(KG)',
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
        label: '合计金额(含税)',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.encryptedFieldFormater(scope.row.amountTax)
        }
      },
      _amount: {
        prop: 'amount',
        label: '合计金额(不含税)',
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
    // 条纹间距table表头
    const stripeSpacingColumns = {
      _seq: {
        prop: 'seq',
        width: '120',
        label: '条纹序号',
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
    const itemStyle = { width: '32%', 'margin-bottom': 0 }
    const titleStyle = { 'padding': '16px 0', 'font-size': '16px', 'display': 'block', 'margin-bottom': '10px', 'width': '100%', 'border-bottom': '1px solid #EEEFF0' }
    // 条纹间距table数据
    const stripeSpacingData = []
    // 颜色&数量&交期弹窗内容
    const allContent = {
      _customerInfo: {
        itemType: 'view',
        text: '客户信息',
        style: titleStyle
      },
      _customerClothNumber: {
        prop: 'customerClothNumber',
        itemType: 'itemview',
        itemStyle: itemStyle,
        label: '客户布号：',
        clearable: true,
        maxlength: 50
      },
      _customerOrderCode: {
        prop: 'customerOrderCode',
        itemType: 'itemview',
        itemStyle: itemStyle,
        label: '客户单号：',
        maxlength: 50,
        clearable: true
      },
      _styleNumber: {
        prop: 'styleNumber',
        itemType: 'itemview',
        itemStyle: itemStyle,
        label: '客户款号：',
        clearable: true,
        maxlength: 50
      },
      _customerColor: {
        prop: 'customerColor',
        itemType: 'itemview',
        itemStyle: itemStyle,
        label: '客户颜色：',
        clearable: true,
        maxlength: 50
      },
      _customerColorEn: {
        prop: 'customerColorEn',
        itemType: 'itemview',
        itemStyle: itemStyle,
        label: '客户颜色(英文)：',
        maxlength: 50,
        clearable: true
      },
      _shirtBody: {
        prop: 'shirtBody',
        itemType: 'itemview',
        minWidth: '80px',
        itemStyle: itemStyle,
        label: '所属衫身：',
        isShow: (scope) => {
          return this.getShow('所属衫身')
        },
        disabled: false,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<span title="${value ? value.label || '' : ''}">${value ? value.label || '' : ''}</span>`
        }
      },
      _colorMatching: {
        prop: 'colorMatching',
        itemType: 'itemview',
        minWidth: '80px',
        itemStyle: itemStyle,
        label: '配色要求:：',
        isShow: (scope) => {
          return this.getShow('配色要求')
        },
        disabled: false,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<span title="${value ? value.label || '' : ''}">${value ? value.label || '' : ''}</span>`
        }
      },
      _greyClothCode: {
        prop: 'greyClothCode',
        itemType: 'itemview',
        itemStyle: { 'width': '100%' },
        isShow: (scope) => {
          return this.getShow('色布/印花布编码')
        },
        label: '色布/印花布编码：'
      },
      _colorInfoType: {
        prop: 'colorInfoType',
        itemType: 'itemview',
        itemStyle: { 'width': '100%' },
        disabled: true,
        isShow: (scope) => {
          return this.getShow('颜色信息')
        },
        label: '颜色信息：',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return this.getShowValue('颜色信息')
        }
      },
      _flowerInfoType: {
        prop: 'flowerInfoType',
        itemType: 'itemview',
        itemStyle: { 'width': '100%' },
        disabled: true,
        isShow: (scope) => {
          return this.getShow('印花信息')
        },
        label: '印花信息：',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return this.getShowValue('印花信息')
        }
      },
      _stripeSpacing: {
        itemType: 'view',
        text: '条纹间距',
        isShow: (scope) => {
          return this.getShow('条纹间距')
        },
        style: { 'padding': '16px 0', 'font-size': '16px', display: 'inline-block', 'margin-bottom': '10px', 'width': '50%' }
      },
      _range: {
        prop: 'range',
        itemType: 'itemview',
        label: '条纹公差：',
        valueType: 'object',
        isShow: (scope) => {
          return this.getShow('条纹间距')
        },
        itemStyle: { width: '50%', display: 'inline-block', 'vertical-align': 'middle', 'margin-bottom': '10px' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<span title="${value ? value.label || '' : ''}">${value ? value.label || '' : ''}</span>`
        }
      },
      _stripeSpacingTableForm: {
        isShow: (scope) => {
          return this.getShow('条纹间距')
        },
        prop: 'stripeSpacing',
        itemType: 'table-form',
        itemStyle: { 'width': '100%' },
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        columns: stripeSpacingColumns,
        dataSource: stripeSpacingData,
        operates: null
      },
      _offerInfo: {
        itemType: 'view',
        text: '报价信息',
        style: titleStyle
      },
      _quotationNo: {
        prop: 'quotationNo',
        itemType: 'itemview',
        itemStyle: { width: '100%', 'margin-bottom': 0 },
        label: '报价单：',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<div style="display:flex"><div>${value || ''}</div>  <div style="color:#888E9E">（参考报价：${this.currencyCode || ''}${formDatas.refQuotedPrice || ''}/KG）</div></div>`
        }
      },
      _priceTax: {
        prop: 'priceTax',
        itemType: 'itemview',
        itemStyle: { width: '50%' },
        label: '单价(含税)：',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return this.encryptedFieldFormater(value) + '/KG'
        }
      },
      _price: {
        prop: 'price',
        itemType: 'itemview',
        itemStyle: { width: '50%' },
        label: '单价(不含税)：',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return this.encryptedFieldFormater(value) + '/KG'
        }
      },

      _quantityDelivery: {
        itemType: 'view',
        className: 'item-title',
        text: '数量交期',
        style: { 'padding': '16px 0', 'font-size': '16px' }
      },
      _deliveryTolerance: {
        prop: 'deliveryTolerance',
        itemType: 'itemview',
        label: '走货公差:',
        valueType: 'object',
        itemStyle: { 'margin-top': '8px', 'margin-bottom': 0, width: '86%' },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<span title="${value ? value.label || '' : ''}">${value ? value.label || '' : ''}</span>`
        }
      },
      _quantityDeliveryAdd: {
        itemType: 'itemview',
        label: '',
        itemStyle: { 'padding-top': '10px', 'margin-bottom': 0 },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return `<el-button size="mini" type="primary" plain class="addGoodsButton">新增</el-button>`
        },
        handle: () => {
          // 字段加密内容
          this.$set(this.quantityDeliveryContent._quantity, 'append', this.colorQuantityDeliverySummary.unit.label)
          this.encryptFn(this.quantityDeliveryContent, this.rule, 'add')
          this.popHandle('新增交期数量', 'quantityDelivery')
        }
      },
      _quantityDeliveryTableForm: {
        prop: 'quantityDeliveryDetail',
        itemType: 'table-form',
        itemStyle: { 'width': '100%' },
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        // size: 'mini',
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
      title: '编辑颜色&数量&交期',
      okText: '确定',
      ok: params => {
        const flag = this.save(params) // flag: true | false  true:表示验证不通过
        if (flag) return
        this.allPopHandle()
      },
      cancel: params => {
        this.allPopHandle()
      },
      formDatas: {},
      formOptions: { inline: true },
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
    const colorQuantityAddPopColumns = {
      _id: {
        prop: 'id',
        label: '选择',
        width: '50',
        components: {
          checkboxButton
        },
        componentsOptions: {
          // radio: 1,
          changeMethods: (scope) => {
            if (!this.colorQuantityAddPopOptions.formDatas.name) {
              this.colorQuantityAddPopOptions.formDatas.name = []
            }
            console.log(scope.row, 'scope.row')
            if (scope.row.checked) {
              this.colorQuantityAddPopOptions.formDatas.name.push(scope.row)
            } else {
              this.colorQuantityAddPopOptions.formDatas.name.forEach((item, index) => {
                if (item.coOrderColorInfoId === scope.row.coOrderColorInfoId) {
                  this.colorQuantityAddPopOptions.formDatas.name.splice(index, 1)
                }
              })
            }
            console.log(this.colorQuantityAddPopOptions.formDatas)
          }
        }
      },
      ...popColumns
    }
    const colorQuantityAddPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '选择补布颜色&数量&交期内容',
      width: '1240px',
      ok: params => {
        console.log(params)
        if (!params.name || !params.name.length) {
          this.$message({ type: 'warning', message: '请至少选择一条数据' })
          return
        }
        const arr = []
        params.name.forEach(item => {
          const data = this.colorQuantityDeliverySummary.reissueColorInfo.find(i => item.coOrderColorInfoId === i.coOrderColorInfoId)
          if (data) {
            arr.push(data)
          } else {
            arr.push(item)
          }
        })
        arr.sort(function(a, b) {
          return a.seq - b.seq
        })
        this.colorQuantityDeliverySummary.reissueColorInfo = arr
        this.$set(this.colorQuantityAddPopOptions, 'visible', false)
      },
      cancel: params => {
        this.$set(this.colorQuantityAddPopOptions, 'visible', false)
      },
      close: () => {
        // this.$set(this.productPostIntegrationLossColumns[0].componentsOptions, 'radio', null)
        // this.$set(this.productPostIntegrationLossPopOptions.formDatas, 'radio', null)
      },
      formDatas: {
        name: []
      },
      formOptions: {
      },
      content: {
        _tableForm: {
          prop: 'tableForm',
          headerCellStyle: { 'background-color': '#F5F7FA' },
          className: 'pop-table',
          itemType: 'table-form',
          label: '',
          labelWidth: '0',
          itemStyle: { width: '100%', 'marginRight': 0 },
          dataSource: [],
          tooltipEffect: 'dark',
          columns: colorQuantityAddPopColumns
        }
      }
    }
    return {
      loading: false,
      headerCellStyle,
      totalQuantity: null,
      totalAmount: null,
      allColumns,
      colorQuantityAddPopOptions,
      allOperatesData,
      allOperates,
      allContent,
      allPopOptions,
      stripeSpacingColumns,
      stripeSpacingData,
      quantityDeliveryColumns,
      quantityDeliveryData,
      quantityDeliveryOperates,
      quantityDeliveryContent,
      quantityDeliveryPopOptions,
      pagination,
      reissueColorInfo: [],
      chooseTitle: '', // 选择弹窗标题
      chooseType: '', // 选择弹窗类型 1:智布色号 2:智布花号 3:条纹间距智布色号
      choosePagination: {}, // 色号、花号的弹窗页码
      tableData: [],
      unit: {
        label: '',
        value: ''
      },
      unitOptions: [],
      editAll: {}, // 编辑某条数量交期数据
      colorQuantityDeliverySummary: {
        totalAmount: 0,
        totalQuantity: 0,
        maxColorSeq: '',
        unit: {},
        reissueColorInfo: []
      },
      maxColorSeq: 0,
      maxQuantitySeq: 0,
      isClear: true,
      colorFabricData: [],
      quantityAdd, // 数量交期弹窗确定，继续添加按钮
      colorPagination: {} // 数量交期坯布编码弹窗分页
    }
  },
  computed: {
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
    'colorQuantityDeliverySummary': {
      handler(val) {
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
          this.colorQuantityDeliverySummary.reissueColorInfo && this.colorQuantityDeliverySummary.reissueColorInfo.length && this.colorQuantityDeliverySummary.reissueColorInfo.forEach(item => {
            item.priceTax = ''
            item.price = ''
            item.quantityDeliveryDetail.length && item.quantityDeliveryDetail.forEach(items => {
              items.amount = ''
              items.amountTax = ''
            })
          })
        }
      },
      deep: true,
      immediate: true
    },
    // suggestWidth: {
    //   handler(val, oldValue) {
    //     if (oldValue && oldValue !== '') {
    //       this.calculateAuxiliaryQuantity(val, 'suggestWidth')
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // },
    // suggestWidthUnit: {
    //   handler(val, oldValue) {
    //     if (oldValue && oldValue !== '') {
    //       this.calculateAuxiliaryQuantity(val, 'suggestWidthUnit')
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // },
    // weightBefore: {
    //   handler(val, oldValue) {
    //     if (oldValue && oldValue !== '') {
    //       this.calculateAuxiliaryQuantity(val, 'weightBefore')
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // },
    rule: {
      handler(v) {
        if (v && Object.keys(v).length) {
          this.encryptFn(this.allPopOptions.content, v, 'edit')
          this.encryptFn(this.quantityDeliveryPopOptions.content, v, 'edit')
        }
      },
      deep: true
    },
    coOrderColorInfo: function(v) {
      if (v.length) {
        const data = this.$utils.deepClone(v)
        this.colorQuantityAddPopOptions.content._tableForm.dataSource = data || []
      }
    },
    data: {
      handler(val, oldVal) {
        if (val && Object.keys(val).length) {
          val.reissueColorInfo = val.reissueColorInfo ? val.reissueColorInfo : []
          if (this.isClear) {
            val.totalAmount = 0
            val.reissueColorInfo && val.reissueColorInfo.length && val.reissueColorInfo.forEach(item => {
              item.priceTax = ''
              item.price = ''
              item.quantityDeliveryDetail && item.quantityDeliveryDetail.length && item.quantityDeliveryDetail.forEach(items => {
                items.amount = ''
                items.amountTax = ''
              })
            })
          }
          this.colorQuantityDeliverySummary = this.$utils.deepClone(val)
          if (val.maxColorSeq) {
            // this.maxColorSeq = val.maxColorSeq && val.maxColorSeq.includes('-') ? val.maxColorSeq.split('-')[1] : 0
            this.maxColorSeq = val.maxColorSeq
          }
        } else {
          this.maxColorSeq = 0
          this.colorQuantityDeliverySummary = {
            totalAmount: 0,
            totalQuantity: 0,
            maxColorSeq: '',
            unit: {},
            reissueColorInfo: []
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    isSing(scope) {
      if (['quantity', 'delivery'].includes(scope.column.property) && this.isEdit) {
        return 'isSing'
      }
    },
    // 字段是否展示
    getShow(type) {
      if (type === '色布/印花布编码') {
        return !!this.editAll.greyClothCode
      }
      if (type === '配色要求') {
        // 该字段只有在，当前产品列表中，同时存在款号相同的衫身和下栏两种成衣部位，且当前产品序号所对应的产品成衣部位为下栏时，才显示
        return (this.orderData.detail[this.rowIndex - 1].garmentPart.label === '下栏') && this.editAll.colorMatching && this.editAll.colorMatching.label
      }
      if (type === '所属衫身') {
        // 该字段只有在，当前产品列表中，同时存在款号相同的衫身和下栏两种成衣部位，且当前产品序号所对应的产品成衣部位为下栏时，才显示
        return (this.orderData.detail[this.rowIndex - 1].garmentPart.label === '下栏') && this.editAll.shirtBody && this.editAll.shirtBody.label
      }
      if (type === '条纹间距') {
        return this.WeavingPattern && this.WeavingPattern.name.includes('间')
      }
      if (type === '颜色信息') {
        // 织造花型 不包含 提花 且 不包含 间 时，才显示
        return this.WeavingPattern && (!this.WeavingPattern.name.includes('提花') && !this.WeavingPattern.name.includes('间'))
      }
      if (type === '印花信息') {
        // 织造花型 不包含 提花 且 不包含 间 时，且印花工艺不为空时 才显示
        return this.WeavingPattern && (!this.WeavingPattern.name.includes('提花') && !this.WeavingPattern.name.includes('间') && this.orderData.detail[this.rowIndex - 1].printCraft)
      }
    },
    // 显示处理
    getShowValue(type, data) {
      const datas = data || this.editAll
      if (type === '颜色信息') {
        if (datas.colorInfoType) {
          if (datas.colorInfoType.label === '智布色号' || datas.colorInfoType.label === '色板申请') {
            return (datas.colorInfoType.label || '') + '-' + datas.colorNo
          }
          if (datas.colorInfoType.label === 'TBA') {
            return (datas.colorInfoType.label || '') + '-' + (datas.supplier && datas.supplier.label || '') + '-' + datas.colorNo
          }
          if (datas.colorInfoType.label === '指定花灰') {
            return (datas.colorInfoType.label || '') + '-' + (datas.colorLevel && datas.colorLevel.label || '')
          }
        } else {
          return ''
        }
      }
      if (type === '印花信息') {
        if (datas.flowerInfoType && datas.flowerInfoType.label && datas.flowerNo) {
          return (datas.flowerInfoType.label || '') + '-' + datas.flowerNo
        } else {
          return ''
        }
      }
    },
    save(params = {}) {
      if (!params.quantityDeliveryDetail || !params.quantityDeliveryDetail.length) {
        this.$message.error('数量交期必填！')
        return true
      }
      this.colorQuantityDeliverySummary.reissueColorInfo.splice(this.editAll.index, 1, params)
      // 计算总数量和总金额(含税)
      let totalQuantity = 0
      let totalAmount = 0
      this.colorQuantityDeliverySummary.reissueColorInfo && this.colorQuantityDeliverySummary.reissueColorInfo.length && this.colorQuantityDeliverySummary.reissueColorInfo.forEach(item => {
        if (item.quantityDeliveryDetail && item.quantityDeliveryDetail.length) {
          item.quantityDeliveryDetail.forEach(items => {
            totalAmount = Number(totalAmount) + Number(items.amountTax) // 总金额(含税)
            totalQuantity = Number(totalQuantity) + Number(items.quantity) // 总数量
          })
        }
      })
      this.colorQuantityDeliverySummary.totalQuantity = this.$utils.getFloat(totalQuantity, 2)
      this.colorQuantityDeliverySummary.totalAmount = this.$utils.getFloat(totalAmount, 2)
    },
    changeStatus(val) {
      this.isClear = false
      this.isEdit = val
      if (val) {
        this.allOperates = {
          label: '操作',
          width: '120',
          fixed: 'right',
          isShow: true,
          dataSource: this.allOperatesData
        }
      } else {
        this.allOperates = {
          label: '操作',
          width: '120',
          fixed: 'right',
          isShow: false,
          dataSource: this.allOperatesData
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
        } else if (type === 'quantityDeliveryDetail') {
          this.$set(this.quantityDeliveryPopOptions, 'formDatas', params)
        }
      }, 0)
    },
    // 渲染价格头
    renderHeaderPrice(h, { column, $index }) {
      return h('div', {
        attrs: {
          class: 'cell'
        },
        domProps: {
          innerHTML: column.label + ` <i class="${this.allColumns._price.isShow ? 'el-icon-arrow-left' : 'el-icon-arrow-right'} icon"></i>`
        },
        on: {
          'click': (event) => {
            this.allColumns._price.isShow = !this.allColumns._price.isShow
          }
        }
      })
    },
    // 渲染金额
    renderHeaderAmount(h, { column, $index }) {
      return h('div', {
        attrs: {
          class: 'cell'
        },
        domProps: {
          innerHTML: column.label + ` <i class="${this.allColumns._amount.isShow ? 'el-icon-arrow-left' : 'el-icon-arrow-right'} icon"></i>`
        },
        on: {
          'click': (event) => {
            this.allColumns._amount.isShow = !this.allColumns._amount.isShow
          }
        }
      })
    },
    // 渲染数量
    renderHeaderQuantity(h, { column, $index }) {
      return h('span', {
        domProps: {
          innerHTML: column.label + ` <i class="${this.allColumns._auxiliaryQuantity.isShow ? 'el-icon-arrow-left' : 'el-icon-arrow-right'} icon"></i>`
        },
        on: {
          'click': (event) => {
            this.allColumns._auxiliaryQuantity.isShow = !this.allColumns._auxiliaryQuantity.isShow
          }
        }
      })
    },
    // 交期数量 根据填写的数量计算辅助数量 金额
    quantityDeliveryChange(qua) {
      const data = qua
      const reg = /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{1,2})?$/
      if (!reg.test(data)) {
        return
      }
      const colorBasic = this.$refs.allPop.$refs.popComponents.formDatas
      let amountTax = 0
      let amount = 0
      const Tim = {
        quantity: data,
        unit: this.colorQuantityDeliverySummary.unit,
        weightBefore: this.weightBefore,
        suggestWidthUnit: this.suggestWidthUnit,
        suggestWidth: this.suggestWidth
      }
      const auxiliaryQuantity = this.$utils.auxiliaryQuantityExpressionData(Tim)
      console.log(auxiliaryQuantity, 'auxiliaryQuantity', Tim, data)
      this.$set(this.quantityDeliveryPopOptions.formDatas, 'quantity', data)
      this.$set(this.quantityDeliveryPopOptions.formDatas, 'auxiliaryQuantity', this.$utils.getFloat(auxiliaryQuantity, 2))
      if (colorBasic.priceTax) {
        amountTax = data * colorBasic.priceTax
        this.$set(this.quantityDeliveryPopOptions.formDatas, 'amountTax', this.$utils.getFloat(amountTax, 2))
      }
      if (colorBasic.price) {
        amount = data * colorBasic.price
        this.$set(this.quantityDeliveryPopOptions.formDatas, 'amount', this.$utils.getFloat(amount, 2))
      }
      // const reg = /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{1,2})?$/
      // if (!reg.test(data)) {
      //   return
      // }
      // const colorBasic = this.$refs.allPop.$refs.popComponents.formDatas
      // let suggestFabric = ''
      // let auxiliaryQuantity = 0
      // let amountTax = 0
      // let amount = 0
      // if (this.suggestWidth && this.suggestWidthUnit) {
      //   suggestFabric = this.suggestWidthUnit && this.suggestWidthUnit === '"' ? (this.suggestWidth - 0 + 2) : (this.suggestWidth / 2.54 + 2)
      // } else {
      //   suggestFabric = ''
      // }
      // if (this.colorQuantityDeliverySummary.unit.label === '磅') {
      //   auxiliaryQuantity = data / 2.2046
      // } else if (this.colorQuantityDeliverySummary.unit.label === '码' && suggestFabric) {
      //   auxiliaryQuantity = data * suggestFabric * this.weightBefore * 0.00081925 / 16 / 2.2046
      // } else if (this.colorQuantityDeliverySummary.unit.label === '码' && !suggestFabric) {
      //   auxiliaryQuantity = 0
      // } else if (this.colorQuantityDeliverySummary.unit.label === '米' && suggestFabric) {
      //   auxiliaryQuantity = data / 0.9144 * suggestFabric * this.weightBefore * 0.00081925 / 16 / 2.2046
      // } else if (this.colorQuantityDeliverySummary.unit.label === '米' && !suggestFabric) {
      //   auxiliaryQuantity = 0
      // } else if (this.colorQuantityDeliverySummary.unit.label === '千克') {
      //   auxiliaryQuantity = data
      // } else {
      //   auxiliaryQuantity = 0
      // }
      // this.$set(this.quantityDeliveryPopOptions.formDatas, 'quantity', data)
      // this.$set(this.quantityDeliveryPopOptions.formDatas, 'auxiliaryQuantity', this.$utils.getFloat(auxiliaryQuantity, 2))
      // if (colorBasic && colorBasic.priceTax) {
      //   amountTax = data * colorBasic.priceTax
      //   this.$set(this.quantityDeliveryPopOptions.formDatas, 'amountTax', this.$utils.getFloat(amountTax, 2))
      // }
      // if (colorBasic && colorBasic.price) {
      //   amount = data * colorBasic.price
      //   this.$set(this.quantityDeliveryPopOptions.formDatas, 'amount', this.$utils.getFloat(amount, 2))
      // }
    },
    // 加密字段formater处理
    encryptedFieldFormater(field) {
      let tempField
      if ((field + '').indexOf('***') !== -1) {
        tempField = this.currencyCode + field
      } else {
        tempField = (!isNaN(field)) ? (this.currencyCode + this.$utils.priceFormat(this.$utils.getFloat(field || 0, 2))) : ''
      }
      return tempField
    },
    // 新增颜色数量交期
    addAllInfo() {
      this.colorQuantityAddPopOptions.formDatas.name = [...this.colorQuantityDeliverySummary.reissueColorInfo]
      this.colorQuantityAddPopOptions.content._tableForm.dataSource.forEach(item => {
        item.checked = !!this.colorQuantityDeliverySummary.reissueColorInfo.find(i => i.coOrderColorInfoId === item.coOrderColorInfoId)
      })
      this.$set(this.colorQuantityAddPopOptions, 'visible', true)
    },
    // 剪板要求、条纹间距、数量交期弹窗显隐
    popHandle(val, type) {
      this.$set(this[`${type}PopOptions`], 'visible', !this[`${type}PopOptions`].visible)
      if (val) {
        this.$set(this[`${type}PopOptions`], 'title', val)
      }
      if (this[`${type}PopOptions`].visible) {
        this.encryptFn(this[`${type}Content`], this.rule, val && val.startsWith('新增') && 'add' || 'edit')
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
      // 动态添加校验 不要可以删除
      this.$set(this.allContent._range, 'rules', [])
      this.$set(this.allContent._range, 'dataSource', [])
    },
    // 处理数量交期中序号code、seq(内层)
    resetQuantitySeqCode(dataList) {
      let newNum = 0
      dataList.forEach((v, index) => {
        if (!v.id) {
          newNum += 1
          v.seq = this.maxQuantitySeq * 1 + newNum
          console.log(v.seq, '= this.maxQuantitySeq * 1 + newNum', this.maxQuantitySeq)
        }
        v.edit = this.isEdit
        v.code = index + 1
      })
    },
    // 返回整条数据 不要可以删除
    saveListRow(params) {
      this.rebclass = params.rgb ? params.rgb : ''
    },
    inputTypeChange() {
      if (this.isEdit) {
        return 'input'
      }
      return 'itemview'
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .icon {
    border: 1px solid #afafaf;
    border-radius: 50%;
    padding: 2px;
    font-size: 12px;
    margin-left: 5px;
    color: #7c7c7c;
  }
  /deep/.dialog {
    .custom-form {
      margin:0px;
    }
  }
.color {
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
        text-align: right;
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
  /deep/.addGoodsButton {
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
.color-header-dates{
  .el-input__inner{
    width: 100px;
  }
}
  .page-table{
    /deep/tbody .el-table__row .cell p {
      padding:  0 !important;
      margin: 2px!important;
    }
  }
  /deep/.page-table table th.isSing>div:before {
    content: '*';
    color: red;
  }
   /deep/.el-table--medium th {
       height: 40px;
       padding: 0;
    }
}
</style>
