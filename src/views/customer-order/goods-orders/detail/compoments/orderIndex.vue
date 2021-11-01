/**
* @Description: 数据分发及融合
* @author Roman
* @date 2021-04-23 14:25:22
* @edit 2021-04-23 14:25:22
*/
<template>
  <div ref="orderDetailCom" class="order-detail">
    <!-- 基本信息 -->
    <baseInfo ref="baseInfoData" :rule="orderData._rule" :status="status" :is-edit="isEdit" :data="baseInfoData" :sync-moudle-data-handle="syncMoudleDataHandle" :set-parent-data-handle="setParentDataHandle" />

    <div class="order-info">
      <div class="order-header">
        <span>订单信息</span>
      </div>
      <div class="order-content">
        <div class="info-left">
          <div v-if="isEdit" class="top">
            <!--            <el-button size="small" type="primary" @click="addOrderHandle">新增</el-button>-->
            <el-button size="mini" type="primary" @click="showReferencePop"><span style="font-size: 14px;">新增</span></el-button>
          </div>
          <div class="bottom">
            <!--左侧分录模块-->
            <cs-custom-form
              ref="leftForm"
              :options="leftFormOptions"
              :data-source="dataSource"
              :reset-errors="isEdit"
            />
          </div>
        </div>
        <div class="info-right">
          <!-- 右侧头部 -->
          <!-- <customerSample :is-edit="isEdit" :row-index="rowIndex" :rule="orderData._rule" :status="status" :data="customerSampleData" :sync-moudle-data-handle="syncMoudleDataHandle" :set-parent-data-handle="setParentDataHandle" /> -->
          <!-- 参板信息 -->
          <reference ref="reference" :is-edit="isEdit" :row-index="rowIndex" :rule="orderData._rule" :status="status" :data="referenceData" :sync-moudle-data-handle="syncMoudleDataHandle" :set-parent-data-handle="setParentDataHandle" @addOrder="addOrderHandle" />
          <!-- 船唛信息 -->
          <shipping-mark :is-edit="isEdit" :data="shippingMarkData" :sync-moudle-data-handle="syncMoudleDataHandle" />
          <!-- 产品信息 -->
          <product ref="productData" :is-edit="isEdit" :row-index="rowIndex" :rule="orderData._rule" :status="status" :data="productData" :sync-moudle-data-handle="syncMoudleDataHandle" :set-parent-data-handle="setParentDataHandle" />
          <!-- 原料信息 -->
          <material :is-edit="isEdit" :row-index="rowIndex" :show-add-btn="showAddBtn" :rule="orderData._rule" :status="status" :data="materialData" :sync-moudle-data-handle="syncMoudleDataHandle" :set-parent-data-handle="setParentDataHandle" />
          <!-- 面料成份比例 -->
          <fabric-composition :is-edit="isEdit" :row-index="rowIndex" :material-data="materialData" :rule="orderData._rule" :status="status" :data="fabricElement" :sync-moudle-data-handle="syncMoudleDataHandle" :set-parent-data-handle="setParentDataHandle" />

          <!-- 颜色数量交期 -->
          <colorQuantityDelivery
            :row-index="rowIndex"
            :currencycode-data="currencyCodeData"
            :rule="orderData._rule"
            :currency-seq="currencySeq"
            :tax-rate="taxRate"
            :deli-fresh-data="freshDataCopy"
            :suggest-width-unit="suggestWidthUnit"
            :suggest-width="suggestWidth"
            :weight-before="weightBefore"
            :fabric-type="fabricTypes"
            :grey-cloth-code="greyClothCodes"
            :add-color-quantity-delivery="addColorQuantityDelivery"
            :currency-code="currencyCode"
            :status="status"
            :is-edit="isEdit"
            :data="colorQuantityDeliveryData"
            :order-data="orderData"
            :exchange-rate-arrays="exchangeRateArrays"
            :sync-moudle-data-handle="syncMoudleDataHandle"
            :show-add-btn="showAddBtn"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import customerSample from './customer-sample'
import fabricComposition from './fabric-composition'
import baseInfo from './base-info'
import reference from './reference'
import material from './material'
import product from './product'
import { PublicCustomer } from '@/views/customer-order/public/index'
// import colorQuantityDelivery from './color-quantity-delivery' // 老版本  代码v2.0.2
import { optionConfigSelect } from '@/views/customer-order/public/api'
import shippingMark from './shippingMark'
import colorQuantityDelivery from './color-quantity-copy.vue' // 新版本 代码写在v2.0.3
export default {
  name: 'OrderIndex',
  components: {
    // customerSample, // 客样分析
    baseInfo, // 基本信息
    reference, // 参板信息
    material, // 原料信息
    product, // 产品信息
    colorQuantityDelivery, // 颜色数量交期
    shippingMark, // 船唛信息
    fabricComposition// 面料成份比例
  },
  mixins: [PublicCustomer],
  props: {
    isEdit: {
      type: Boolean
    },
    orderData: {
      type: Object
    },
    syncDataHandle: {
      type: Function
    },
    currentVersionChange: {
      type: Function
    }
  },
  data() {
    const columns = {
      _seq: {
        prop: 'seq',
        label: '产品序号',
        width: '80'
      },
      _garmentPart: {
        prop: 'garmentPart',
        label: '成衣部位',
        className: 'ruleTip',
        itemType: 'table-form',
        size: 'small',
        editOptions: {
          size: 'small',
          labelWidth: '0',
          itemType: 'select',
          className: 'commonRemoteSearch',
          valueType: 'object',
          valueKey: 'value',
          placeholder: '输入文字模糊查询',
          clearable: true,
          filterable: true,
          rules: [
            {
              required: true,
              message: '成衣部位不能为空',
              trigger: ['change']
            }
          ],
          change: (value, form, formDatas, setFormDatas, scope) => {
            this.dataSource._tableForm.dataSource[scope.$index].garmentPart = value
            this.$nextTick(() => {
              this.dataSource._tableForm.currentRowKey = scope.$index + 1
            })
          },
          focus: (e, scope) => {
            this.setDetaiDatas(this.getLeftDataSource, scope.$index)
          },
          dataSource: []
        },
        formater: (scope) => {
          return scope.row.garmentPart ? scope.row.garmentPart.label : ''
        }
      },
      _cloth: {
        prop: 'cloth',
        label: '布类',
        size: 'small',
        className: 'ruleTip',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.cloth ? `<div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${scope.row.cloth.label || '-'}</div>` : ''
        }
      }
    }
    const operates = {
      label: '操作',
      width: '60',
      isShow: () => {
        return this.isEdit
      },
      // fixed: 'right',
      dataSource: [
        {
          label: '删除',
          isShow: true,
          style: { 'color': '#FE4949', display: 'block', padding: '5px' },
          handle: (scope, form, formDatas, setFormDatas) => {
            event.stopPropagation()
            if (this.getLeftDataSource && this.getLeftDataSource.length <= 1) {
              this.$message({ type: 'warning', message: '至少保留一条' })
            } else {
              this.$confirm('确认删除该条订单信息数据？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', cancelButtonClass: 'btn-cancel' })
                .then(() => {
                  if (this.$route.query.rowIndex) {
                    this.$router.push({ path: this.$route.path, query: { }})
                  }
                  const dataSource = this.getLeftDataSource.filter((v, index) => index !== scope.$index)
                  this.dataSource._tableForm.dataSource = dataSource
                  this.resetSeqCode(dataSource)
                  // console.log(dataSource)
                  // debugger
                  this.setDetaiDatas(dataSource, dataSource.length - 1)
                  this.$nextTick(() => {
                    this.$refs.leftForm.form.clearValidate()
                  })
                })
                .catch(() => {
                  this.$message({ type: 'info', message: '已取消删除' })
                })
            }
          }
        }
      ]
    }
    const dataSource = {
      _tableForm: {
        prop: 'tableForm',
        itemType: 'table-form',
        tooltipEffect: 'light',
        dataSource: [],
        className: 'leftTableForm goodsOrdersLeftTableForm',
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        // size: 'small',
        columns: columns,
        operates: operates,
        rowKey: 'code',
        currentRowKey: 0,
        highlightCurrentRow: true,
        rowClassName: 'heightRow',
        rowClick: (scope) => {
          this.setDetaiDatas(this.getLeftDataSource, scope.code - 1)
          this.ClothChange() // 布类下拉织造花型包含需要改变
        }
      }
    }
    return {
      freshData: {},
      rowIndex: 0,
      taxRate: '',
      currencyCode: '',
      suggestWidthUnit: '',
      suggestWidth: '',
      weightBefore: '',
      greyClothCodes: '',
      fabricTypes: '',
      addColorQuantityDelivery: {},
      maxDetailSeq: 0,
      currencySeq: 1,
      customerSampleData: {},
      dataSource, // 左侧配置,
      leftFormOptions: {
        popError: true,
        // 左侧表单数据修改同步
        syncDataHandle: (formDatas) => {

        }
      },
      status: '0', // 订单状态
      materialData: [], // 原料信息数据
      referenceData: [], // 参板信息数据
      fabricElement: [], // 面料成份比例
      colorQuantityDeliveryData: {}, // 颜色数量交期数据
      productData: {}, // 产品信息数据
      baseInfoData: {}, // 基础信息数据
      currencyCodeData: {}, // 下拉币别信息
      showAddBtn: false,
      exchangeRateArrays: [],
      freshDataCopy: {}
    }
  },
  computed: {
    getLeftDataSource() {
      return this.dataSource._tableForm.dataSource
    }
  },
  watch: {
    freshData: {
      handler(val, oldVal) {
        this.freshDataCopy = val
        this.syncDataHandle('orderIndexData', val)
      },
      deep: true,
      immediate: true
    },
    orderData: {
      handler(val, oldVal) {
        const index = this.$route.query.rowIndex ? this.$route.query.rowIndex * 1 - 1 : 0
        this.setOrderData(val, index)// 设置页面数据
      },
      deep: true,
      immediate: true
    },
    isEdit: {
      handler(val, oldVal) {
        if (val) {
          this.resetSeqCode(this.getLeftDataSource)
        }
      },
      deep: true,
      immediate: true
    },
    currencyCode: { // 主表币别变化 需要清空报价单号和参考报价
      handler(v) {
        console.log('pomnnnnn', v)
        v && this.deliFreshCode()
      },
      deep: true
    }
  },
  created() {
  },
  mounted() {
    this.init()// 初始化加载
  },
  methods: {
    init() {
      this.getGarmentPart()// 获取成衣部位下拉框列表
      // this.getCloth()// 获取布类下拉框列表
    },
    setOrderData(obj, index = 0) {
      // 设置订单要求页签下所有模块数据
      this.freshData = this.$utils.deepClone(obj)
      if (obj.detail) {
        this.resetSeqCode(obj.detail)
        this.status = obj.status
        if (obj.detail[index]) {
          this.suggestWidthUnit = obj.detail[index].suggestWidthUnit
          this.suggestWidth = obj.detail[index].suggestWidth
          this.weightBefore = obj.detail[index].weightBefore
        }

        this.dataSource._tableForm.dataSource = this.$utils.deepClone(obj.detail)
        this.baseInfoData = this.$utils.deepClone(obj)// 基础信息数据
        this.setDetaiDatas(obj.detail, index)// 右侧模块数据
        if (obj.maxDetailSeq) {
          this.maxDetailSeq = obj.maxDetailSeq
        }
        this.ClothChange()
      } else {
        this.addOrderHandle()
      }
    },
    setDetaiDatas(detailArr, index, empty = false, extraData = {}) {
      console.log(detailArr)
      console.log(index)

      // 设置右侧模块数据
      if (detailArr && detailArr.length > 0) {
        if (detailArr[0].referenceVersionInfo && detailArr[0].referenceVersionInfo[0] && detailArr[0].referenceVersionInfo[0].referenceOrder) {
          this.showAddBtn = !!detailArr[0].referenceVersionInfo[0].referenceOrder.label
        }
        this.currencySeq = detailArr[index].seq
        this.freshData = { ...this.freshData, detail: detailArr }
        this.rowIndex = index + 1
        this.dataSource._tableForm.currentRowKey = index + 1
        if (detailArr[index]) {
          const data = this.$utils.deepClone(detailArr[index])
          if (empty) { data.sampleAnalysisResultId = '' }
          this.customerSampleData = data
        }
        this.materialData = this.$utils.deepClone(detailArr[index].materialInfo || [])
        this.referenceData = this.$utils.deepClone(detailArr[index].referenceVersionInfo || [])
        this.fabricElement = this.$utils.deepClone(detailArr[index].fabricElement || [])
        this.colorQuantityDeliveryData = this.$utils.deepClone(detailArr[index].colorQuantityDeliverySummary || (extraData.setDefaultColorInfo ? { setDefaultColorInfo: true } : {}))
        this.shippingMarkData = this.$utils.deepClone({ clothNameZn: detailArr[index].clothNameZn, clothNameEn: detailArr[index].clothNameEn })
        if (detailArr[index]) {
          let data = this.$utils.deepClone(detailArr[index])
          if (empty) {
            data = {}
          }
          this.productData = data
        }
      }
      if (this.$route.query.rowIndex) {
        this.$router.push({ path: this.$route.path, query: { }})
      }
    },
    async getGarmentPart() { // 获取成衣部位下拉框列表
      const data = await optionConfigSelect({ pageName: '大货订单', fieldName: '成衣部位' })
      let list = data.data || []
      list = list.map(item => ({ value: '' + item.fieldValueId, label: item.fieldValue }))
      this.dataSource._tableForm.columns._garmentPart.editOptions.dataSource = list
    },
    syncMoudleDataHandle(key, data) { // 同步右侧各个模块的全量表单数据
      console.log(data, 'data')
      this.$nextTick(() => {
        const index = this.rowIndex - 1
        if (key === 'baseInfoData') { // 同步基本信息模块数据
          this.freshData = { ...this.freshData, ...data }
        }
        if (this.dataSource._tableForm.dataSource[index]) {
          if (key === 'productData') { // 同步产品信息模块数据
            if (this.dataSource._tableForm.dataSource) {
              for (const i in data) {
                this.dataSource._tableForm.dataSource[index][i] = data[i]
              }
            }
          }
          if (key === 'materialData') { // 同步原料信息模块数据
            this.dataSource._tableForm.dataSource[index].materialInfo = data
          }
          if (key === 'colorQuantityDeliveryData') { // 同步颜色数量交期数据
            this.dataSource._tableForm.dataSource[index].colorQuantityDeliverySummary = data
          }
          if (key === 'shippingMarkDom') { // 同步船唛信息模块数据
            this.dataSource._tableForm.dataSource[index].clothNameZn = data.clothNameZn || ''
            this.dataSource._tableForm.dataSource[index].clothNameEn = data.clothNameEn || ''
          }
          if (key === 'fabricElement') { // 同步面料成份比例
            this.dataSource._tableForm.dataSource[index].fabricElement = data
          }
          if (key === 'referenceData') { // 同步参板信息模块数据
            const { setDefaultColorInfo = false } = data
            delete data.setDefaultColorInfo

            const newData = this.$utils.deepClone(this.getLeftDataSource)
            this.resetSeqCode(newData)
            this.suggestWidthUnit = data.suggestWidthUnit
            this.suggestWidth = data.suggestWidth
            this.weightBefore = data.weightBefore
            // 换了色布印花布编码的时候 清空下 fabricElement
            if (data.referenceVersionInfo && data.referenceVersionInfo.length && newData[index].referenceVersionInfo && newData[index].referenceVersionInfo.length && (data.referenceVersionInfo[0].greyClothCode !== newData[index].referenceVersionInfo[0].greyClothCode)) {
              newData[index] = { ...newData[index], ...data, fabricElement: [] }
            } else {
              newData[index] = { ...newData[index], ...data }
            }
            this.dataSource._tableForm.dataSource = newData
            this.setDetaiDatas(newData, index, false, { setDefaultColorInfo })
            this.ClothChange()
          }
          this.freshData = { ...this.freshData, detail: this.dataSource._tableForm.dataSource }
        }
      })
    },
    setParentDataHandle(key, data) { // 同步右侧各个模块的部分字段数据
      if (key === 'currentVersion') {
        this.currentVersionChange(data)
      } else {
        console.log('sssssssommm', data)
        this[key] = data
      }
    },
    resetSeqCode(dataList) {
      let newNum = 0
      dataList.forEach((v, index) => {
        if (!v.orderId) {
          newNum += 1
          v.seq = this.maxDetailSeq + newNum
        }
        v.edit = this.isEdit
        v.code = index + 1
      })
    },
    // 显示参板信息侧边弹框
    showReferencePop() {
      if (this.getLeftDataSource.length >= 100) {
        this.$message({ type: 'error', message: '最多可以增加到100行!' })
        return false
      }
      this.$nextTick(() => {
        this.$refs['reference'].versionPopOptions.content['_greyClothCode'].focus('add') // 显示选择色布/印花编码弹框
      })
    },
    addOrderHandle() { // 增加分录事件
      if (this.getLeftDataSource.length >= 100) {
        this.$message({ type: 'error', message: '最多可以增加到100行!' })
        return false
      }
      if (this.dataSource._tableForm.dataSource.length === 1) {
        if (typeof this.dataSource._tableForm.dataSource[0].cloth === 'object') {
          if (this.dataSource._tableForm.dataSource[0].cloth && !this.dataSource._tableForm.dataSource[0].cloth.value) { // 首次新增的时候不存在布类,这里拿布类是否存在来判断，按理说拿参板信息下是否存在订单号来判断更加可靠
            return
          }
        } else if (!this.dataSource._tableForm.dataSource[0].cloth) {
          return
        }
      }
      const dataSource = this.$utils.deepClone(this.getLeftDataSource)
      dataSource.push({})
      this.resetSeqCode(dataSource)
      this.dataSource._tableForm.dataSource = dataSource
      this.setDetaiDatas(dataSource, dataSource.length - 1, true)
    },
    async ClothChange() { // 布类下拉织造花型包含需要改变
      const deom = this.dataSource._tableForm.dataSource[this.rowIndex - 1]
      const values = deom.cloth ? deom.cloth.value : ''
      const labels = deom.cloth ? deom.cloth.label : ''
      if (!labels || !values) {
        this.$set(this.freshDataCopy.detail[this.rowIndex - 1], 'WeavingPattern', { name: '' })
      } else {
        const WeavingPattern = await this.getWeavingPattern(labels, values) || {}
        this.$set(this.freshDataCopy.detail[this.rowIndex - 1], 'WeavingPattern', WeavingPattern)
      }
    },
    deliFreshCode() { // 主表币别变化 需要清空报价单号和参考报价
      const dom = this.dataSource._tableForm.dataSource
      dom.forEach((ix) => {
        const com = ix.colorQuantityDeliverySummary
        com && com.colorInfo && com.colorInfo.length && com.colorInfo.forEach((ic) => {
          ic.quotationNo = ''
          ic.refQuotedPrice = ''
        })
      })
    },
    selectTypeChange() {
      if (this.isEdit) {
        return 'select'
      }
      return 'itemview'
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
                font-weight: 400;
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
                      .defaultOperates{
                        padding: 0;
                        span{padding: 0!important;}
                      }
                    }
                }
            }
            .info-right {
                display: flex;
                flex: 1;
                width: calc(100% - 350px);
                // min-width: 880px;
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
                                margin: 0 50px;
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
        width: 28%;
        font-size: 14px;
        font-weight: 600;
        display: inline-block;
        background: #F5F5F5;
        padding: 5px 0 5px 13px;
        margin-bottom: 15px;
        margin-top: 15px;
        position: relative;
    }
    .titleView::before {
        display: block;
        content: '*';
        position: absolute;
        left:6px;
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
    .color-summary {
        color: #FF9214;
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
            // padding: 12px 10px;
            padding: 3px 10px;
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
      padding: 0;
      height: 44px;
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
<style lang="scss">
  .goodsOrdersLeftTableForm{
    .el-form-item--small.el-form-item {
      margin-bottom: 0 !important;
    }
  }
</style>
