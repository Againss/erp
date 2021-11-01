<template>
  <div class="color">
    <div class="color-header color-header-colors">
      <div class="left">
        <span class="title">颜色&数量&交期</span>
        <div class="date-title color-header-dates">
          <span style="display: inline-block;" class="data-font item-title">单位：</span>
          <template v-if="isEdit">
            <el-select v-model="colorQuantityDeliverySummary.unit" value-key="value" placeholder="请选择" @change="unitChange">
              <el-option
                v-for="item in unitOptions"
                :key="item.value"
                :label="item.label"
                :value="item"
              />
            </el-select>
          </template>
          <template v-else>
            <span style="font-size: 14px;color: #474747;">{{ colorQuantityDeliverySummary.unit?colorQuantityDeliverySummary.unit.label:'' }}</span>
          </template>

        </div>
      </div>
      <div class="right">
        <div class="date-title">
          <span class="data-font">总数量：<span style="color: #474747;font-size: 14px;">{{ this.$utils.priceFormat(this.$utils.getFloat(colorQuantityDeliverySummary.totalQuantity, 2)) || '' }} {{ colorQuantityDeliverySummary.totalQuantity ? unit.label : '' }}</span></span>
        </div>
        <div class="date-title">
          <span class="data-font total">总金额(含税)：<span style="color: #474747;font-size: 14px;">{{ currencyCode + this.$utils.priceFormat(this.$utils.getFloat(colorQuantityDeliverySummary.totalAmount, 2)) || '' }}</span></span>
        </div>
        <el-button v-if="isEdit&&getShowAddBtn" type="primary" size="mini" @click="addAllInfo">新增</el-button>
      </div>
    </div>
    <div class="page-table page-tableyu" style="padding: 0 20px;">
      <cs-custom-table
        ref="allColumnslData"
        tooltip-effect="light"
        :header-cell-style="headerCellStyle"
        :columns="allColumns"
        :data-source="colorQuantityDeliverySummary.colorInfo"
        :operates="allOperates"
        :pagination="pagination"
        edit-type="pop"
      />
    </div>
    <!-- 颜色、数量、交期弹窗 -->
    <div class="pop allPop">
      <cs-custom-pop ref="allPop" :options="allPopOptions" />
    </div>
    <!-- 剪版要求弹窗 -->
    <div class="pop">
      <cs-custom-pop ref="shearingRequirementsPop" :options="shearingRequirementsPopOptions" />
    </div>
    <!-- 数量交期弹窗 -->
    <div class="pop">
      <cs-custom-pop ref="quantityDeliveryPop" :options="quantityDeliveryPopOptions" />
    </div>
    <!-- 色布/印花布编码选择弹窗 -->
    <div class="pop">
      <color-pop
        :loading="loading"
        :title="chooseTitle"
        :search-data="chooseSearch"
        :pagination="colorPagination"
        :columns="chooseColumns"
        :is-visible.sync="isShowchoose"
        :table-data="colorFabricData"
        @closePop="closeChoosePop"
        @savePop="colorSavePop"
      />
    </div>
  </div>
</template>
<script>
import colorPop from './colorPop'
// import choosePop from '@/views/customer-order/public/components/choosePop'
import preview from '@/views/customer-order/public/components/preview'
import picPreview from '@/views/customer-order/public/components/picPreview'
import shearingShow from '@/views/customer-order/public/components/shearingShow'
import { PublicCustomer } from '@/views/customer-order/public/index'
import { querycolorFabricPage, queryFlowerNoPage } from '../api/index'
export default {
  name: 'ColorQuantityDeliver',
  components: {
    colorPop
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
    }
  },
  data() {
    // table表头颜色
    const headerCellStyle = {
      'background': '#F5F7FA'
    }
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 最大999.99正则
    const max999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,2})?$/, message: '0~999.99', trigger: ['blur'] })
    const priceReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,4})?$/, message: '0~999.9999', trigger: ['blur'] })
    // const max999Regtype = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{1,4})?$/, message: '0~9999999999.9999', trigger: ['blur'] })
    // const ismax999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,7})|(0{1}))(\.\d{1,2})?$/, message: '0~99999999.99', trigger: ['blur'] })
    // 当前时间之前的时间不能选择
    const pickerOptionsBefore = {
      disabledDate(time) {
        return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
      }
    }
    // 颜色数量交期弹框确定，继续添加按钮
    const colorQuantityDeliveryAdd = (params, form) => {
      const flag = this.save(params) // flag: true | false  true:表示验证不通过
      if (flag) return
      this.shearingRequirementsData = []
      this.$set(this.allContent._shearingRequirementsTableForm, 'dataSource', [])
      this.stripeSpacingData = []
      this.$set(this.allContent._stripeSpacingTableForm, 'dataSource', [])
      this.quantityDeliveryData = []
      this.$set(this.allContent._quantityDeliveryTableForm, 'dataSource', [])
      this.$set(this.allPopOptions, 'formDatas', {}) // 清空数据
    }
    // 颜色数量交期
    const allColumns = {
      _code: {
        prop: 'code',
        label: '序号',
        minWidth: '50',
        formater: (scope) => {
          return this.currencySeq + '-' + scope.row.seq
        }
      },
      // _code: {
      //   prop: 'code',
      //   label: '序号',
      //   minWidth: '50',
      //   formater: (scope) => {
      //     return scope.row.seq
      //   }
      // },
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
        formater: () => {
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
          this.editAll.index = scope.$index
          if (this.editAll.maxQuantitySeq) {
            this.maxQuantitySeq = this.editAll.maxQuantitySeq
          }
          this.$set(this.allPopOptions, 'formDatas', { ...scope.row })
          this.quantityDeliveryData = this.editAll.quantityDelivery && this.editAll.quantityDelivery.length ? JSON.parse(JSON.stringify(this.editAll.quantityDelivery)) : []
          this.shearingRequirementsData = scope.row.shearingRequirements && scope.row.shearingRequirements.length ? JSON.parse(JSON.stringify(scope.row.shearingRequirements)) : []
          this.stripeSpacingData = scope.row.stripeSpacing && scope.row.stripeSpacing.length ? JSON.parse(JSON.stringify(scope.row.stripeSpacing)) : []
          this.$set(this.allContent._shearingRequirementsTableForm, 'dataSource', this.shearingRequirementsData)
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
            this.colorQuantityDeliverySummary.colorInfo.splice(scope.$index, 1)
            this.resetSeqCode(this.colorQuantityDeliverySummary.colorInfo)
            let totalQuantity = 0
            let totalAmount = 0
            this.colorQuantityDeliverySummary.colorInfo && this.colorQuantityDeliverySummary.colorInfo.length && this.colorQuantityDeliverySummary.colorInfo.forEach((item) => {
              item.quantityDelivery && item.quantityDelivery.length && item.quantityDelivery.forEach(items => {
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
        itemType: this.inputTypeChange,
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        // rules: [commonChangeReg, ismax999Reg],
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
        label: '金额(含税)',
        itemType: this.inputTypeChange,
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        clearable: true,
        disabled: true
      },
      _amount: {
        prop: 'amount',
        label: '金额(不含税)',
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
        pickerOptions: pickerOptionsBefore
        // rules: [{ required: true, message: '日期不能为空', trigger: ['change'] }]
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
        this.$message({
          type: 'success',
          message: '添加成功，请继续添加'
        })
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
        if (!params.quantity) {
          this.$message({ message: '数量不能为空', type: 'warning' })
          return
        }
        // const ismax999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,7})|(0{1}))(\.\d{1,2})?$/, message: '0~99999999.99', trigger: ['blur'] })
        // const ismax999Reg = /^(([1-9]{1}\d{0,7})|(0{1}))(\.\d{1,2})?$/
        // if (!ismax999Reg.test(params.quantity)) {
        //   this.$message({ message: '请输入数字', type: 'warning' })
        //   return
        // }
        if (!params.delivery) {
          this.$message({ message: '交期不能为空', type: 'warning' })
          return
        }
        if (this.quantityDeliveryPopOptions.title === '新增交期数量') {
          this.quantityDeliveryData.push(params)
          this.resetQuantitySeqCode(this.quantityDeliveryData)
          this.$set(this.allContent._quantityDeliveryTableForm, 'dataSource', this.quantityDeliveryData)
        } else {
          this.quantityDeliveryData.splice(params.code - 1, 1, params)
          // this.resetQuantitySeqCode(this.quantityDeliveryData)
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
            this.encryptFn(this.quantityDeliveryContent, this.rule, 'edit')
            this.$set(this.quantityDeliveryPopOptions, 'saveAndadd', null)
            scope.row.amount = this.$utils.getFloat(scope.row.amount, 2) || ''
            scope.row.amountTax = this.$utils.getFloat(scope.row.amountTax, 2) || ''
            this.setFormDatas({ ...scope.row, code: scope.$index + 1 }, 'quantityDelivery')
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
            this.encryptFn(this.shearingRequirementsContent, this.rule, 'edit')
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
        visibleChange: () => {
          this.$set(this.shearingRequirementsContent._unit, 'dataSource', this.unitOptions)
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
        this.$message({
          type: 'success',
          message: '添加成功，请继续添加'
        })
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
              style: { 'margin': '0 0 0 15px' },
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
        itemType: this.inputTypeChange,
        itemStyle: { width: '32%', display: 'inline-block' },
        label: '客户单号',
        maxlength: 50,
        clearable: true
      },
      _styleNumber: {
        prop: 'styleNumber',
        itemType: this.inputTypeChange,
        itemStyle: { width: '32%', display: 'inline-block', 'margin': '0 2%' },
        label: '款号',
        clearable: true,
        maxlength: 50
      },
      _customerClothNumber: {
        prop: 'customerClothNumber',
        itemType: this.inputTypeChange,
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
        itemType: this.inputTypeChange,
        itemStyle: { width: '32%', display: 'inline-block', 'margin': '0 2%' },
        label: '单价(含税)',
        rules: [commonChangeReg, priceReg],
        clearable: true,
        change: (value) => {
          this.priceTaxChange(value)
        }
      },
      _price: {
        prop: 'price',
        itemType: this.inputTypeChange,
        itemStyle: { width: '32%', display: 'inline-block' },
        label: '单价(不含税)',
        rules: [priceReg],
        clearable: true,
        change: (value) => {
          this.priceChange(value)
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
        // size: 'mini',
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
        // size: 'mini',
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
          this.$set(this.quantityDeliveryContent._quantity, 'append', this.colorQuantityDeliverySummary.unit.label)
          this.encryptFn(this.quantityDeliveryContent, this.rule, 'add')
          this.popHandle('新增交期数量', 'quantityDelivery')
        }
      },
      _quantityDeliveryTableForm: {
        prop: 'quantityDelivery',
        itemType: 'table-form',
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
      title: '新增颜色&数量&交期',
      okText: '保存',
      saveAndaddText: '确定，继续添加',
      saveAndadd: colorQuantityDeliveryAdd,
      ok: params => {
        const flag = this.save(params) // flag: true | false  true:表示验证不通过
        if (flag) return
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
    return {
      loading: false,
      headerCellStyle,
      totalQuantity: null,
      totalAmount: null,
      allColumns,
      allOperatesData,
      allOperates,
      allContent,
      allPopOptions,
      shearingRequirementsColumns,
      shearingRequirementsData,
      shearingRequirementsOperates,
      shearingRequirementsContent,
      shearingRequirementsPopOptions,
      stripeSpacingColumns,
      stripeSpacingData,
      quantityDeliveryColumns,
      quantityDeliveryData,
      quantityDeliveryOperates,
      quantityDeliveryContent,
      quantityDeliveryPopOptions,
      pagination,
      colorInfo: [],
      chooseTitle: '', // 选择弹窗标题
      chooseType: '', // 选择弹窗类型 1:智布色号 2:智布花号 3:条纹间距智布色号
      chooseSearch: {},
      chooseColumns: {},
      choosePagination: {}, // 色号、花号的弹窗页码
      tableData: [],
      isShowchoose: false,
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
        colorInfo: []
      },
      maxColorSeq: 0,
      maxQuantitySeq: 0,
      isClear: true,
      colorFabricData: [],
      colorQuantityDeliveryAdd, // 颜色数量交期弹框确定，继续添加按钮
      saveAndadd, // 剪板要求弹窗确定，继续添加按钮
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
    data: {
      handler(val, oldVal) {
        console.log(val, '213123123')
        if (val && Object.keys(val).length) {
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
            // this.maxColorSeq = val.maxColorSeq && val.maxColorSeq.includes('-') ? val.maxColorSeq.split('-')[1] : 0
            this.maxColorSeq = val.maxColorSeq
          }
          console.log(this.maxColorSeq, '2222222')
        } else {
          this.maxColorSeq = 0
          this.colorQuantityDeliverySummary = {
            totalAmount: 0,
            totalQuantity: 0,
            maxColorSeq: '',
            unit: this.unitOptions[0],
            colorInfo: []
          }
        }
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
    suggestWidth: {
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
    weightBefore: {
      handler(val, oldValue) {
        if (oldValue && oldValue !== '') {
          this.calculateAuxiliaryQuantity(val, 'weightBefore')
        }
      },
      deep: true,
      immediate: true
    },
    greyClothCode: {
      handler(val, oldValue) {
        console.log(val)
        console.log(oldValue)
        console.log(this.addColorQuantityDelivery, '7777777777')
        if (val !== oldValue) {
          if (this.colorQuantityDeliverySummary.colorInfo && this.colorQuantityDeliverySummary.colorInfo.length) {
            this.colorQuantityDeliverySummary.colorInfo && this.colorQuantityDeliverySummary.colorInfo.length && this.colorQuantityDeliverySummary.colorInfo.forEach(item => {
              item.greyClothCode = ''
              item.stripeSpacing = null
              item.fabricColorNo = ''
              item.fabricFlowerNo = ''
              // item.quantityDelivery && item.quantityDelivery.length && item.quantityDelivery.forEach(items => {
              //   items.greyClothCode = ''
              //   items.stripeSpacing = ''
              //   items.fabricColorNo = ''
              //   items.fabricFlowerNo = ''
              // })
            })
          } else {
            const params = {
              seq: 1,
              greyClothCode: this.addColorQuantityDelivery && this.addColorQuantityDelivery.colorFabricCode ? this.addColorQuantityDelivery.colorFabricCode : '',
              stripeSpacing: this.addColorQuantityDelivery && this.addColorQuantityDelivery.spacing ? this.addColorQuantityDelivery.spacing : null,
              fabricColorNo: this.addColorQuantityDelivery && this.addColorQuantityDelivery.colorCode ? this.addColorQuantityDelivery.colorCode : '',
              fabricFlowerNo: this.addColorQuantityDelivery && this.addColorQuantityDelivery.flowerCode ? this.addColorQuantityDelivery.flowerCode : ''
            }
            this.colorQuantityDeliverySummary.colorInfo.push(params)
          }
        }
      }
    },
    rule: {
      handler(v) {
        if (v && Object.keys(v).length) {
          this.encryptFn(this.allPopOptions.content, v, 'edit')
          this.encryptFn(this.quantityDeliveryPopOptions.content, v, 'edit')
        }
      },
      deep: true
    }
  },
  mounted() {
    this.getUnitsSelect()
  },
  methods: {
    save(params = {}) {
      if (!params.quantityDelivery || !params.quantityDelivery.length) {
        this.$message.error('数量交期必填！')
        return true
      }
      if (this.allPopOptions.title === '新增颜色&数量&交期') {
        this.colorQuantityDeliverySummary.colorInfo.push(params)
        this.resetSeqCode(this.colorQuantityDeliverySummary.colorInfo)
        console.log(this.colorQuantityDeliverySummary)
      } else {
        this.colorQuantityDeliverySummary.colorInfo.splice(this.editAll.index, 1, params)
        // this.resetSeqCode(this.colorQuantityDeliverySummary.colorInfo)
        console.log(this.colorQuantityDeliverySummary)
      }
      // 计算总数量和总金额(含税)
      let totalQuantity = 0
      let totalAmount = 0
      this.colorQuantityDeliverySummary.colorInfo && this.colorQuantityDeliverySummary.colorInfo.length && this.colorQuantityDeliverySummary.colorInfo.forEach(item => {
        if (item.quantityDelivery && item.quantityDelivery.length) {
          item.quantityDelivery.forEach(items => {
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
        } else if (type === 'shearingRequirements') {
          this.$set(this.shearingRequirementsPopOptions, 'formDatas', params)
        } else if (type === 'quantityDelivery') {
          this.$set(this.quantityDeliveryPopOptions, 'formDatas', params)
        }
      }, 0)
    },
    // 幅宽、幅宽单位、洗前克重变化计算辅助数量
    calculateAuxiliaryQuantity(val, type) {
      let suggestFabric = ''
      let weightBefore = ''
      let suggestWidth = ''
      let suggestWidthUnit = ''
      suggestWidth = type === 'suggestWidth' ? val : this.suggestWidth ? this.suggestWidth : ''
      suggestWidthUnit = type === 'suggestWidthUnit' ? val : this.suggestWidthUnit ? this.suggestWidthUnit : ''
      weightBefore = type === 'weightBefore' ? val : this.weightBefore ? this.weightBefore : ''
      this.colorQuantityDeliverySummary.totalQuantity = 0
      if (suggestWidth && suggestWidthUnit) {
        suggestFabric = suggestWidthUnit && suggestWidthUnit === '"' ? (suggestWidth - 0 + 2) : (suggestWidth / 2.54 + 2)
      } else {
        suggestFabric = ''
      }
      this.colorQuantityDeliverySummary.colorInfo && this.colorQuantityDeliverySummary.colorInfo.length && this.colorQuantityDeliverySummary.colorInfo.forEach(item => {
        item.quantityDelivery && item.quantityDelivery.length && item.quantityDelivery.forEach(items => {
          if (this.colorQuantityDeliverySummary.unit.label === '磅') {
            items.auxiliaryQuantity = items.quantity / 2.2046
          } else if (this.colorQuantityDeliverySummary.unit.label === '码' && suggestFabric) {
            items.auxiliaryQuantity = items.quantity * suggestFabric * weightBefore * 0.00081925 / 16 / 2.2046
          } else if (this.colorQuantityDeliverySummary.unit.label === '码' && !suggestFabric) {
            items.auxiliaryQuantity = ''
          } else if (this.colorQuantityDeliverySummary.unit.label === '米' && suggestFabric) {
            items.auxiliaryQuantity = items.quantity / 0.9144 * suggestFabric * weightBefore * 0.00081925 / 16 / 2.2046
          } else if (this.colorQuantityDeliverySummary.unit.label === '米' && !suggestFabric) {
            items.auxiliaryQuantity = ''
          } else {
            items.auxiliaryQuantity = ''
          }
          this.colorQuantityDeliverySummary.totalQuantity += this.$utils.getFloat(items.auxiliaryQuantity, 2)
        })
      })
    },
    // 单价(含税)改变计算辅助数量
    priceTaxChange(data) {
      const reg = /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{1,4})?$/
      if (!reg.test(data)) {
        return
      }
      const colorBasic = this.$refs.allPop.$refs.popComponents.formDatas
      let price = 0
      if (data && this.taxRate) {
        price = data / (1 + (this.taxRate - 0) / 100)
        price = this.$utils.getFloat(price, 4)
        // this.$set(this.allPopOptions.formDatas, 'priceTax', data)
        // this.$set(this.allPopOptions.formDatas, 'price', this.$utils.getFloat(price, 4))
        this.allPopOptions.formDatas = { priceTax: data }
        this.allPopOptions.formDatas = { price: price }
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
      const colorBasic = this.$refs.allPop.$refs.popComponents.formDatas
      let priceTax = 0
      if (data && this.taxRate) {
        priceTax = data * (1 + (this.taxRate - 0) / 100)
        priceTax = this.$utils.getFloat(priceTax, 4)
        // this.$set(this.allPopOptions.formDatas, 'price', data)
        // this.$set(this.allPopOptions.formDatas, 'priceTax', this.$utils.getFloat(priceTax, 4))
        this.allPopOptions.formDatas = { price: data }
        this.allPopOptions.formDatas = { priceTax: priceTax }
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
    // 交期数量 根据填写的数量计算辅助数量 金额
    quantityDeliveryChange(data) {
      const reg = /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{1,2})?$/
      if (!reg.test(data)) {
        return
      }
      console.log(this.suggestWidth)
      console.log(this.suggestWidthUnit)
      console.log(this.weightBefore)
      const colorBasic = this.$refs.allPop.$refs.popComponents.formDatas
      let suggestFabric = ''
      let auxiliaryQuantity = 0
      let amountTax = 0
      let amount = 0
      if (this.suggestWidth && this.suggestWidthUnit) {
        suggestFabric = this.suggestWidthUnit && this.suggestWidthUnit === '"' ? (this.suggestWidth - 0 + 2) : (this.suggestWidth / 2.54 + 2)
      } else {
        suggestFabric = ''
      }
      if (this.colorQuantityDeliverySummary.unit.label === '磅') {
        auxiliaryQuantity = data / 2.2046
      } else if (this.colorQuantityDeliverySummary.unit.label === '码' && suggestFabric) {
        auxiliaryQuantity = data * suggestFabric * this.weightBefore * 0.00081925 / 16 / 2.2046
      } else if (this.colorQuantityDeliverySummary.unit.label === '码' && !suggestFabric) {
        auxiliaryQuantity = 0
      } else if (this.colorQuantityDeliverySummary.unit.label === '米' && suggestFabric) {
        auxiliaryQuantity = data / 0.9144 * suggestFabric * this.weightBefore * 0.00081925 / 16 / 2.2046
      } else if (this.colorQuantityDeliverySummary.unit.label === '米' && !suggestFabric) {
        auxiliaryQuantity = 0
      } else if (this.colorQuantityDeliverySummary.unit.label === '千克') {
        auxiliaryQuantity = data
      } else {
        auxiliaryQuantity = 0
      }
      this.$set(this.quantityDeliveryPopOptions.formDatas, 'quantity', data)
      this.$set(this.quantityDeliveryPopOptions.formDatas, 'auxiliaryQuantity', this.$utils.getFloat(auxiliaryQuantity, 2))
      if (colorBasic && colorBasic.priceTax) {
        amountTax = data * colorBasic.priceTax
        this.$set(this.quantityDeliveryPopOptions.formDatas, 'amountTax', this.$utils.getFloat(amountTax, 2))
      }
      if (colorBasic && colorBasic.price) {
        amount = data * colorBasic.price
        this.$set(this.quantityDeliveryPopOptions.formDatas, 'amount', this.$utils.getFloat(amount, 2))
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
    // 新增颜色数量交期
    addAllInfo() {
      this.$set(this.quantityDeliveryColumns._quantity, 'label', `数量(${this.colorQuantityDeliverySummary.unit.label})`)
      this.shearingRequirementsData = []
      this.$set(this.allContent._shearingRequirementsTableForm, 'dataSource', [])
      this.stripeSpacingData = []
      this.$set(this.allContent._stripeSpacingTableForm, 'dataSource', [])
      this.quantityDeliveryData = []
      this.$set(this.allContent._quantityDeliveryTableForm, 'dataSource', [])
      this.$nextTick(() => {
        this.encryptFn(this.allContent, this.rule, 'add')
      })
      this.allPopHandle('新增颜色&数量&交期')
      this.$set(this.allPopOptions, 'content', this.allContent)
      this.$set(this.allPopOptions, 'formDatas', {})
      this.$set(this.allPopOptions, 'saveAndadd', this.colorQuantityDeliveryAdd)
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
    unitChange(val) {
      this.colorQuantityDeliverySummary.unit = val
      this.$set(this.allColumns._quantity, 'label', `数量(${val.label})`)
      let suggestFabric = ''
      this.colorQuantityDeliverySummary.totalQuantity = 0
      if (this.suggestWidth && this.suggestWidthUnit) {
        suggestFabric = this.suggestWidthUnit && this.suggestWidthUnit === '"' ? (this.suggestWidth - 0 + 2) : (this.suggestWidth / 2.54 + 2)
      } else {
        suggestFabric = ''
      }
      this.colorQuantityDeliverySummary.colorInfo && this.colorQuantityDeliverySummary.colorInfo.length && this.colorQuantityDeliverySummary.colorInfo.forEach(item => {
        item.quantityDelivery && item.quantityDelivery.length && item.quantityDelivery.forEach(items => {
          if (this.colorQuantityDeliverySummary.unit.label === '磅') {
            items.auxiliaryQuantity = items.quantity / 2.2046
          } else if (this.colorQuantityDeliverySummary.unit.label === '码' && suggestFabric) {
            items.auxiliaryQuantity = items.quantity * suggestFabric * this.weightBefore * 0.00081925 / 16 / 2.2046
          } else if (this.colorQuantityDeliverySummary.unit.label === '码' && !suggestFabric) {
            items.auxiliaryQuantity = ''
          } else if (this.colorQuantityDeliverySummary.unit.label === '米' && suggestFabric) {
            items.auxiliaryQuantity = items.quantity / 0.9144 * suggestFabric * this.weightBefore * 0.00081925 / 16 / 2.2046
          } else if (this.colorQuantityDeliverySummary.unit.label === '米' && !suggestFabric) {
            items.auxiliaryQuantity = ''
          } else if (this.colorQuantityDeliverySummary.unit.label === '千克') {
            items.auxiliaryQuantity = items.quantity
          } else {
            items.auxiliaryQuantity = ''
          }
          this.colorQuantityDeliverySummary.totalQuantity += this.$utils.getFloat(items.auxiliaryQuantity, 2)
        })
      })
    },
    // 获取坯布编码列表数据
    async getcolorFabric(data = {}) {
      this.loading = true
      const res = await querycolorFabricPage({ ...data, printCraft: this.orderData.detail && this.orderData.detail[this.rowIndex] && this.orderData.detail[this.rowIndex].printCraft || null })
      if (this.$pub.responseValidate(res)) {
        res.data && res.data.list.map(item => {
          item.fabrication = item.cloth.label // 布类
          item.ingredients = item.ingredient.label // 成份
          item.ingreradio = item.ingredient.label + ' ' + item.radio // 成份比例
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
      this.loading = false
    },
    // 处理颜色数量交期中序号code、seq(外层)
    resetSeqCode(dataList) {
      let newNum = 0
      dataList.forEach((v, index) => {
        if (!v.orderId) {
          newNum += 1
          v.seq = this.maxColorSeq * 1 + newNum
          // v.seq = this.currencySeq + '-' + (this.maxColorSeq * 1 + newNum)
        }
        v.edit = this.isEdit
        v.code = index + 1
      })
    },
    // 处理数量交期中序号code、seq(内层)
    resetQuantitySeqCode(dataList) {
      let newNum = 0
      dataList.forEach((v, index) => {
        if (!v.quantityDeliveryId) {
          newNum += 1
          v.seq = this.maxQuantitySeq * 1 + newNum
        }
        v.edit = this.isEdit
        v.code = index + 1
      })
    },
    // 关闭选择弹窗
    closeChoosePop() {
      this.isShowchoose = false
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
    // 返回整条数据 不要可以删除
    saveListRow(params) {
      this.rebclass = params.rgb ? params.rgb : ''
    },
    // 单位下拉
    getUnitsSelect() {
      this.getUnits().then(res => {
        this.unitOptions = res
        if ((!this.colorQuantityDeliverySummary || !this.colorQuantityDeliverySummary.unit || !this.colorQuantityDeliverySummary.unit.value) && this.unitOptions && this.unitOptions.length) {
          this.colorQuantityDeliverySummary.unit = this.unitOptions[0]
          this.$set(this.allColumns._quantity, 'label', `数量(${this.unitOptions[0].label})`)
        }
      })
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
  .page-tableyu{
    /deep/tbody .el-table__row td{
      padding: 0 !important;
    }
  }
}
</style>

<style lang="scss">
.color {
  .cursorHandel {
    input {
      cursor: pointer;
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
  .printPic {
    width: 36px;
    height: 36px;
  }
}
.color-header-dates{
  .el-input__inner{
    width: 100px;
  }
}
</style>
