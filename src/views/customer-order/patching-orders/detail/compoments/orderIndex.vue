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
            <el-button size="small" type="primary" @click="addOrderHandle">新增</el-button>
          </div>
          <div class="bottom">
            <!--左侧分录模块 :reset-errors="isEdit"-->
            <cs-custom-form
              ref="leftForm"
              :options="leftFormOptions"
              :data-source="dataSource"
            />
          </div>
        </div>
        <div class="info-right">
          <!-- 右侧头部 -->
          <!-- <customerSample :is-edit="isEdit" :row-index="rowIndex" :rule="orderData._rule" :status="status" :data="customerSampleData" :sync-moudle-data-handle="syncMoudleDataHandle" :set-parent-data-handle="setParentDataHandle" /> -->
          <!-- 参板信息 -->
          <reference ref="reference" :is-edit="isEdit" :row-index="rowIndex" :rule="orderData._rule" :status="status" :data="referenceData" :set-parent-data-handle="setParentDataHandle" />
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
            :rule="orderData._rule"
            :currency-seq="currencySeq"
            :tax-rate="taxRate"
            :suggest-width-unit="suggestWidthUnit"
            :suggest-width="suggestWidth"
            :weight-before="weightBefore"
            :grey-cloth-code="greyClothCode"
            :co-order-color-info="coOrderColorInfo"
            :add-color-quantity-delivery="addColorQuantityDelivery"
            :currency-code="currencyCode"
            :status="status"
            :is-edit="isEdit"
            :data="colorQuantityDeliveryData"
            :order-data="freshData"
            :sync-moudle-data-handle="syncMoudleDataHandle"
            :show-add-btn="showAddBtn"
          />
        </div>
      </div>
    </div>
    <div class="pop dialog">
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
// import customerSample from './customer-sample'
import baseInfo from './base-info'
import reference from './reference'
import material from './material'
import product from './product'
import checkboxButton from './checkbox-button'
import shippingMark from './shippingMark'
import fabricComposition from './fabric-composition'
import colorQuantityDelivery from './color-quantity-delivery'
// import { optionConfigSelect } from '@/views/customer-order/public/api'

export default {
  name: 'OrderIndex',
  components: {
    // customerSample, // 客样分析
    baseInfo, // 基本信息
    reference, // 参板信息
    material, // 原料信息
    product, // 产品信息
    colorQuantityDelivery, // 颜色数量交期,
    fabricComposition, // 面料成份
    shippingMark// 船唛信息
  },
  props: {
    isEdit: {
      type: Boolean
    },
    orderData: {
      type: Object
    },
    coOrderDetails: {
      type: [Object, Array]
    },
    syncDataHandle: {
      type: Function
    },
    setChildHandle: {
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
        size: 'small',
        // className: 'ruleTip',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.garmentPart ? scope.row.garmentPart.label : ''
        }
      },
      _cloth: {
        prop: 'cloth',
        label: '布类',
        size: 'small',
        // className: 'ruleTip',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.cloth ? `<div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${scope.row.cloth.label || '-'}</div>` : ''
        }
      }
    }
    // 新增弹窗
    const popColumns = {
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
            if (!this.popOptions.formDatas.name) {
              this.popOptions.formDatas.name = []
            }
            if (scope.row.checked) {
              this.popOptions.formDatas.name.push(scope.row)
            } else {
              this.popOptions.formDatas.name.forEach((item, index) => {
                if (item.coOrderDetailId === scope.row.coOrderDetailId) {
                  this.popOptions.formDatas.name.splice(index, 1)
                }
              })
            }
          }
        }
      },
      ...columns
    }
    const popOptions = {
      itemType: 'dialog',
      visible: false,
      title: '选择补布内容',
      width: '1240px',
      ok: params => {
        if (!params.name || !params.name.length) {
          this.$message({ type: 'warning', message: '请至少选择一条数据' })
          return
        }
        const arr = []
        params.name.forEach(item => {
          const data = this.freshData.detail && this.freshData.detail.find(i => item.coOrderDetailId === i.coOrderDetailId)
          if (data) {
            arr.push(data)
          } else {
            arr.push(item)
          }
        })
        arr.sort(function(a, b) {
          return a.seq - b.seq
        })
        this.freshData.detail = arr
        this.dataSource._tableForm.dataSource = arr
        this.setDetaiDatas(arr, arr.length - 1)
        this.$set(this.popOptions, 'visible', false)
        this.dataSource._tableForm.dataSource.forEach((item, index) => { item.code = index + 1 })
      },
      cancel: params => {
        this.$set(this.popOptions, 'visible', false)
      },
      close: () => {
        // this.$set(this.productPostIntegrationLossColumns[0].componentsOptions, 'radio', null)
        // this.$set(this.productPostIntegrationLossPopOptions.formDatas, 'radio', null)
      },
      formDatas: {
        name: []
      },
      formOptions: {
        labelWidth: '100px',
        inline: true
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
          columns: popColumns
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
            this.$confirm('确认删除该条订单信息数据？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', cancelButtonClass: 'btn-cancel' })
              .then(() => {
                const dataSource = this.getLeftDataSource.filter((v, index) => index !== scope.$index)
                this.dataSource._tableForm.dataSource = dataSource || []
                this.dataSource._tableForm.dataSource.forEach((item, index) => { item.code = index + 1 })
                this.setDetaiDatas(dataSource, dataSource.length - 1)
              })
              .catch(() => {
                this.$message({ type: 'info', message: '已取消删除' })
              })
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
        highlightCurrentRow: true,
        rowClassName: 'heightRow',
        rowClick: (scope) => {
          const index = this.dataSource._tableForm.dataSource.findIndex(item => {
            return item.coOrderDetailId === scope.coOrderDetailId
          })
          this.setDetaiDatas(this.getLeftDataSource, index)
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
      greyClothCode: '',
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
      fabricElement: [], // 面临成份比例
      colorQuantityDeliveryData: {}, // 颜色数量交期数据
      productData: {}, // 产品信息数据
      shippingMarkData: {}, // 船唛信息
      baseInfoData: {}, // 基础信息数据
      showAddBtn: false,
      popOptions
    }
  },
  computed: {
    getLeftDataSource() {
      return this.dataSource._tableForm.dataSource
    },
    coOrderColorInfo() {
      const data = this.popOptions.content._tableForm.dataSource.find(item => { return item.coOrderDetailId === this.productData.coOrderDetailId })
      data && data.quantityDelivery && data.quantityDelivery.reissueColorInfo && data.quantityDelivery.reissueColorInfo.forEach(item => {
        item.checked = this.colorQuantityDeliveryData.reissueColorInfo && !!this.colorQuantityDeliveryData.reissueColorInfo.find(ite => ite.coOrderColorInfoId === item.coOrderColorInfoId)
      })
      return data && data.quantityDelivery && data.quantityDelivery.reissueColorInfo || []
    }
  },
  watch: {
    freshData: {
      handler(val, oldVal) {
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
    coOrderDetails: {
      handler(val) {
        this.popOptions.content._tableForm.dataSource = val && this.$utils.deepClone(val) || []
      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  mounted() {
    // this.init()// 初始化加载
  },
  methods: {
    init() {
      // this.getGarmentPart()// 获取成衣部位下拉框列表
      // this.getCloth()// 获取布类下拉框列表
    },
    setOrderData(obj, index = 0) {
      // 设置订单要求页签下所有模块数据
      this.freshData = this.$utils.deepClone(obj)
      this.baseInfoData = this.$utils.deepClone(obj)// 基础信息数据
      if (obj.detail && obj.detail.length) {
        this.status = obj.status
        if (obj.detail[index]) {
          this.suggestWidthUnit = obj.detail[index].suggestWidthUnit
          this.suggestWidth = obj.detail[index].suggestWidth
          this.weightBefore = obj.detail[index].weightBefore
        }

        this.dataSource._tableForm.dataSource = this.$utils.deepClone(obj.detail)
        this.dataSource._tableForm.dataSource.forEach((item, index) => { item.code = index + 1 })
        this.setDetaiDatas(obj.detail, index)// 右侧模块数据
        if (obj.maxDetailSeq) {
          this.maxDetailSeq = obj.maxDetailSeq
        }
      } else {
        this.dataSource._tableForm.dataSource = []
        this.setDetaiDatas([], 0)
      }
    },
    setDetaiDatas(detailArr, index, empty = false) {
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
        this.fabricElement = this.$utils.deepClone(detailArr[index].fabricElement || [])
        this.referenceData = this.$utils.deepClone(detailArr[index].referenceVersionInfo || [])
        this.colorQuantityDeliveryData = this.$utils.deepClone(detailArr[index].quantityDelivery || {})
        this.shippingMarkData = { clothNameZn: detailArr[index].clothNameZn || '', clothNameEn: detailArr[index].clothNameEn || '' }
        if (detailArr[index]) {
          let data = this.$utils.deepClone(detailArr[index])
          if (empty) {
            data = {}
          }
          this.productData = data
        }
      } else {
        this.showAddBtn = false
        this.currencySeq = 0
        this.freshData = { ...this.freshData, detail: [] }
        this.rowIndex = 0
        this.dataSource._tableForm.currentRowKey = 0
        this.materialData = []
        this.fabricElement = []
        this.referenceData = []
        this.colorQuantityDeliveryData = {}
        this.shippingMarkData = { clothNameZn: '', clothNameEn: '' }
        this.productData = {}
      }
    },
    // async getGarmentPart() { // 获取成衣部位下拉框列表
    //   const data = await optionConfigSelect({ pageName: '大货订单', fieldName: '成衣部位' })
    //   let list = data.data || []
    //   list = list.map(item => ({ value: '' + item.fieldValueId, label: item.fieldValue }))
    //   this.dataSource._tableForm.columns._garmentPart.editOptions.dataSource = list
    // },
    syncMoudleDataHandle(key, data) { // 同步右侧各个模块的全量表单数据
      console.log('responsibiltyDepartment')
      this.$nextTick(() => {
        const index = this.rowIndex - 1
        if (key === 'baseInfoData') { // 同步基本信息模块数据
          console.log(data, 'baseInfoData')
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
          if (key === 'fabricElement') { // 同步面料成份比例
            this.dataSource._tableForm.dataSource[index].fabricElement = data
          }
          if (key === 'colorQuantityDeliveryData') { // 同步颜色数量交期数据
            this.dataSource._tableForm.dataSource[index].quantityDelivery = data
          }
          if (key === 'referenceData') { // 同步参板信息模块数据
            const newData = this.$utils.deepClone(this.getLeftDataSource)
            this.suggestWidthUnit = data.suggestWidthUnit
            this.suggestWidth = data.suggestWidth
            this.weightBefore = data.weightBefore
            newData[index] = { ...newData[index], ...data }
            this.dataSource._tableForm.dataSource = newData
            this.setDetaiDatas(newData, index)
          }
          this.freshData = { ...this.freshData, detail: this.dataSource._tableForm.dataSource }
        }
      })
    },
    setParentDataHandle(key, data) { // 同步右侧各个模块的部分字段数据
      if (key === 'currentVersion') {
        this.currentVersionChange(data)
      } else if (key === 'sourceCode') {
        this.setChildHandle(data)
      } else {
        this[key] = data
      }
    },
    addOrderHandle() { // 增加分录事件
      this.popOptions.formDatas.name = [...this.dataSource._tableForm.dataSource]
      this.popOptions.content._tableForm.dataSource.forEach(item => {
        item.checked = !!this.dataSource._tableForm.dataSource.find(i => i.coOrderDetailId === item.coOrderDetailId)
      })
      this.$set(this.popOptions, 'visible', true)
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
                    }
                }
            }
            .info-right {
                display: flex;
                flex: 1;
                width: calc(100% - 350px);
                min-width: 800px;
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
    .table .el-table .el-table__row.heightRow {
        cursor: pointer;
    }
    .table .el-table .el-table__row.current-row.heightRow {
        > td {
            color: #666;
            background-color: #EAF3FF !important;
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
 /deep/.dialog {
    .custom-form {
      margin:0px;
    }
  }
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
