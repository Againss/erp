<!--
 * @Date: 2021-06-28 11:37:30
 * @Author: Againss
 * @LastEditTime: 2021-07-14 16:13:16
 * @LastEditors: Againss
 * @Descripttion:补布单详情
-->

<template>
  <div class="sample-detail" :class="isEdit ? '' : 'rules-disable'">
    <!-- 头部状态 -->
    <template v-if="this.$route.params.id">
      <status-bar :order-data="orderData" />
    </template>
    <div class="tab-change">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label=" 订单要求 " name="0" />
      </el-tabs>
    </div>
    <div v-show="activeName === '0'" class="order-request">
      <order-index
        ref="OrderRequest"
        :current-version-change="currentVersionChange"
        :sync-data-handle="syncDataHandle"
        :order-data="orderIndexData"
        :is-edit="isEdit"
        :co-order-details="coOrderDetails"
        :set-child-handle="setChildHandle"
      />
    </div>
    <!-- 底部按钮 -->
    <div :class="{ 'fixed-footer': !sidebar }" class="button-group">
      <el-button v-if="modify_isShow" type="primary" @click="setEdit">编辑</el-button>
      <el-button v-if="submit_isShow" :type="getSubmitPrimary" @click="submitPrint">提交</el-button>
      <el-button v-if="audit_isShow" type="primary" @click="ToExamine">审核</el-button>
      <el-button v-if="withdraw_isShow" @click="Withdraw">撤回</el-button>
      <el-button v-if="change_isShow" type="primary" @click="setEdit">变更</el-button>
      <el-button v-if="finish_isShow" @click="ClickFinish">完结</el-button>
      <el-button v-if="removeHold_isShow" type="primary" @click="solveHold">解Hold</el-button>
      <!-- <el-button v-if="copy_isShow" :type="getCopyPrimary" @click="copyPrint">复制</el-button> -->
      <el-button v-if="hold_isShow" @click="ClickHold">Hold单</el-button>
      <el-button v-if="delete_isShow" @click="deleteClick">删除</el-button>
      <el-button v-if="save_isShow" type="primary" @click="orderDataAdd">保存</el-button>
      <el-button v-if="cancel_isShow" @click="cancelClick">取消</el-button>
      <el-button v-if="back_isShow" @click="GoBackOrder">返回</el-button>
    </div>
    <approve
      v-if="config.visible"
      :config="config"
      @close="config.visible = false"
    />
    <upinformation
      v-if="upconfig.visible"
      :upconfig="upconfig"
      @close="upconfig.visible = false"
      @okCallback="okCallback"
      @Cancelcallback="CancelText"
    />
  </div>
</template>

<script>
import orderIndex from './compoments/orderIndex'
import logMethods from '@/views/product-center/mixin/log-methods'
import {
  orderAdd, getDetail, orderModify, orderDelete, orderChange, orderHold,
  orderWithdrawt, orderCancel, orderFinish, orderRemoveHold, orderSubmit, getGoodsDetail
} from './api/index'
import approve from '@/components/approve/index'
import upinformation from './compoments/pups'
import { PublicCustomer } from '@/views/customer-order/public/index'
import statusBar from './compoments/status-bar'
import { setOrderFun } from '@/views/customer-order/public/api/mou'
export default {
  components: {
    orderIndex,
    approve,
    upinformation,
    statusBar
  },
  mixins: [logMethods, PublicCustomer, setOrderFun],
  data() {
    return {
      allQuarter: [],
      activeName: '0',
      isEdit: true,
      orderData: {},
      orderApiData: {},
      orderIndexData: {},
      coOrderDetails: null,
      copyDetailData: {},
      statusEdit: false, // 驳回编辑状态不同
      config: { // 审核流程
        visible: false,
        workflowId: '',
        procinstid: '',
        pass: (res) => {
          // this.isEdit = false
          this.GoBackOrder()
        },
        refuse: (res) => {
          this.GoBackOrder()
        },
        back: (res) => {
          this.GoBackOrder()
        }
      },
      upconfig: {
        visible: false,
        workflowId: '',
        pass: (res) => {
          console.log('pass', res)
        },
        refuse: (res) => {
          console.log('refuse', res)
        },
        back: (res) => {
          console.log('回退回调')
        }
      },
      currentVersion: '',
      defaulttext: '',
      cancelReason: '', // 已审核取消
      Picrelease: false,
      orderTypeArray: [],
      allOrderIndexData: {}, // 订单要求页签的全量数据(包含了旧的质量要求和附加信息的数据)
      extraInfo: {}, // 附加信息页签的全量数据
      quality: {} // 质量要求和
    }
  },
  computed: {
    getSubmitPrimary() {
      return ['2'].includes(this.status) ? 'primary' : ''
    },
    getCopyPrimary() {
      return ['7', '13'].includes(this.status) ? 'primary' : ''
    },
    sidebar() {
      return this.$store.state.app.sidebar.opened
    },
    status() {
      return this.orderData.status || '0'
    },
    modify_isShow() { // 编辑
      return !this.isEdit && ['0', '4'].includes(this.status) && this.filterPermission(['customerOrder:reissueOrder:modify'])
    },
    submit_isShow() { // 提交
      if (this.isEdit) {
        return ['2', '4'].includes(this.status) && this.filterPermission(['customerOrder:reissueOrder:submit'])
      } else {
        return ['0'].includes(this.status) && this.filterPermission(['customerOrder:reissueOrder:submit'])
      }
    },
    audit_isShow() { // 审核
      return !this.isEdit && ['1', '10', '5', '8'].includes(this.status) && this.filterPermission(['customerOrder:reissueOrder:audit'])
    },
    withdraw_isShow() { // 撤回
      return !this.isEdit && ['1'].includes(this.status) && this.filterPermission(['customerOrder:reissueOrder:withdraw'])
    },
    change_isShow() { // 变更
      return !this.isEdit && ['2'].includes(this.status) && this.filterPermission(['customerOrder:reissueOrder:change'])
    },
    finish_isShow() { // 完结
      return !this.isEdit && ['2'].includes(this.status) && this.filterPermission(['customerOrder:reissueOrder:finish'])
    },
    hold_isShow() { // Hold单
      return !this.isEdit && ['2'].includes(this.status) && this.filterPermission(['customerOrder:reissueOrder:hold'])
    },
    removeHold_isShow() { // 解Hold
      return !this.isEdit && ['12'].includes(this.status) && this.filterPermission(['customerOrder:reissueOrder:removeHold'])
    },
    // copy_isShow() { // 复制
    //   return !this.isEdit && !['3'].includes(this.status) && this.$filterPermission(['customerOrder:reissueOrder:copy'])
    // },
    delete_isShow() { // 删除
      return !this.isEdit && ['0'].includes(this.status) && this.filterPermission(['customerOrder:reissueOrder:delete'])
    },
    cancel_isShow() { // 取消
      return this.isEdit || ['1', '2'].includes(this.status) && this.filterPermission(['customerOrder:reissueOrder:cancel'])
    },
    save_isShow() { // 保存
      return this.isEdit && !['2', '4'].includes(this.status) && this.filterPermission(['customerOrder:reissueOrder:modify', 'customerOrder:reissueOrder:add'])
    },
    back_isShow() { // 返回
      return !this.isEdit && !['3'].includes(this.status)
    }
  },
  watch: {
    currentVersion: {
      handler(val) { // 掉版本变更接口
        val && this.getDetailData(val)
      }
    }
  },
  async created() {
    if (this.$route.params.id) {
      await this.getDetailData(this.$route.params.id)
      if (this.$route.query.statusIndex) { // 变更
        this.setEdit()
      }
    }
    if (this.$route.params.id) {
      if (this.$route.path.includes('show')) {
        this.isEdit = false // 详情
      } else {
        this.setEdit()
      }
    } else {
      this.isEdit = true // 新建
    }
  },
  mounted() {
  },
  methods: {
    async setChildHandle(value) {
      // 供子组件调用
      if (value && value.value) {
        const res = await getGoodsDetail({ 'orderId': value.value })
        if (res.code !== 200) { return false }
        this.orderData = res.data
      } else {
        this.orderData = {}
      }
      this.orderIndexData = this.getBasicInfo()
      this.coOrderDetails = this.orderIndexData.detailData
      this.orderIndexData.detail = []
      this.orderData.status = 0
      delete this.orderData.version
    },
    currentVersionChange(currentVersion) {
      this.currentVersion = currentVersion
    },
    syncDataHandle(key, data) {
      if (key === 'orderIndexData') {
        this.allOrderIndexData = data
      }
    },
    handleClick() { },
    // 获取详情数据
    async getDetailData(id) {
      this.statusEdit = false
      const res = await getDetail({ 'id': id })
      if (res.code !== 200) { return false }
      this.infoDaTA(res)
    },
    // 详情数据 统一处理
    async infoDaTA(res) {
      const dataTim = Object.assign({}, res.data) || {}
      this.orderData = dataTim
      this.copyDetailData = JSON.parse(JSON.stringify(this.orderData))
      dataTim.orderType = this.setValue('orderType')// 订单类型
      dataTim.brand = this.setValue('brand') // 品牌商
      dataTim.customer = this.setValue('customer') // 客户
      dataTim.garmentFactory = this.setValue('garmentFactory')// 制衣厂
      dataTim.salesTeam = this.setValue('salesTeam')// 销售团队
      dataTim.seller = this.setValue('seller') // 销售员
      dataTim.marketType = this.setValue('marketType') // 市场类型
      dataTim.customerService = this.setValue('customerService') // 客服
      dataTim.sellYear = this.orderData.sellYear || '' // 销售年度
      dataTim.sellQuarter = this.setValue('sellQuarter')// 销售季度
      dataTim.isSettlement = this.orderData.isSettlement || 0 // 是否结算{0=是，1=否}
      dataTim.currency = this.setValue('currency') // 币别ID
      dataTim.taxRate = this.orderData.taxRate ? String(this.orderData.taxRate) : '' // 税率
      dataTim.pricingTerm = this.setValue('pricingTerm') // 价格条款
      dataTim.paymentTerm = this.setValue('paymentTerm') // 付款条件ID
      this.orderIndexData = this.$utils.deepClone(this.orderData)
    },
    getBasicInfo() {
      const dataTim = {}
      dataTim.orderType = this.setValue('orderType')// 订单类型
      dataTim.brand = this.setValue('brand') // 品牌商
      dataTim.customer = this.setValue('customer') // 客户
      dataTim.garmentFactory = this.setValue('garmentFactory')// 制衣厂
      dataTim.salesTeam = this.setValue('salesTeam')// 销售团队
      dataTim.seller = this.setValue('seller') // 销售员
      dataTim.marketType = this.setValue('marketType') // 市场类型
      dataTim.customerService = this.setValue('customerService') // 客服
      dataTim.sellYear = this.orderData.sellYear || '' // 销售年度
      dataTim.sellQuarter = this.setValue('sellQuarter')// 销售季度
      dataTim.isSettlement = this.orderData.isSettlement || 0 // 是否结算{0=是，1=否}
      dataTim.currency = this.setValue('currency') // 币别ID
      dataTim.taxRate = this.orderData.taxRate ? String(this.orderData.taxRate) : '' // 税率
      dataTim.pricingTerm = this.setValue('pricingTerm') // 价格条款
      dataTim.paymentTerm = this.setValue('paymentTerm') // 付款条件ID
      const detail = this.orderData.detail && this.orderData.detail.map(item => {
        item.checked = false
        item.coOrderDetailId = item.orderDetailId
        item.quantityDelivery = {
          coOrderSummaryId: item.colorQuantityDeliverySummary.summaryId,
          unit: item.colorQuantityDeliverySummary.unit,
          reissueColorInfo: item.colorQuantityDeliverySummary.colorInfo.map(itemb => {
            itemb.checked = false
            itemb.coOrderColorInfoId = itemb.colorInfoId
            // 数量交期 默认为空
            itemb.quantityDeliveryDetail = []
            delete itemb.colorInfoId
            delete itemb.quantityDelivery
            return itemb
          })
        }
        delete item.orderDetailId
        delete item.colorQuantityDeliverySummary
        return item
      }) || []
      dataTim.detailData = this.$utils.deepClone(detail) || []
      return dataTim
    },
    setValue(typeIndex) {
      const dataTim = { ...this.orderData }
      if (dataTim[typeIndex] && dataTim[typeIndex].value) {
        dataTim[typeIndex].value = dataTim[typeIndex].value !== null ? dataTim[typeIndex].value : ''
      } else {
        dataTim[typeIndex] = ''
      }
      return dataTim[typeIndex]
    },
    // 编辑
    async setEdit() {
      this.isEdit = true
      const ruID = this.$route.params.id
      if ((ruID && (this.orderData.status === '2')) || (ruID && (this.$route.query.statusIndex === '2'))) {
        this.statusEdit = true
      }
      const res = await getGoodsDetail({ 'orderId': this.orderData.sourceCode.value })
      if (res.code !== 200) { return false }
      const detail = res.data.detail && res.data.detail.map(item => {
        item.checked = false
        item.coOrderDetailId = item.orderDetailId
        item.quantityDelivery = {
          coOrderSummaryId: item.colorQuantityDeliverySummary.summaryId,
          unit: item.colorQuantityDeliverySummary.unit,
          reissueColorInfo: item.colorQuantityDeliverySummary.colorInfo.map(itemb => {
            itemb.checked = false
            itemb.coOrderColorInfoId = itemb.colorInfoId
            // 数量交期 默认为空
            itemb.quantityDeliveryDetail = []
            delete itemb.colorInfoId
            delete itemb.quantityDelivery
            return itemb
          })
        }
        delete item.orderDetailId
        delete item.colorQuantityDeliverySummary
        return item
      }) || []
      this.coOrderDetails = this.$utils.deepClone(detail) || null
    },
    SubmitForVerification() { // 提交验证
      const allOrder = this.GlobalSynchronization()
      const validateFieldArr2 = []
      let isrelease = true
      const pu = []
      if (!allOrder.sourceCode || !this.setFromValue(allOrder.sourceCode)) {
        pu.push('来源单号不能为空')
      } else if (!allOrder.reissueReason || !this.setFromValue(allOrder.reissueReason)) {
        pu.push('补布原因不能为空')
      } else if (!allOrder.responsibiltyDepartment || !allOrder.responsibiltyDepartment.length) {
        pu.push('责任部门不能为空')
      } else if (!allOrder.detail || !allOrder.detail.length) {
        pu.push('订单信息不能为空')
      }
      if (pu.length) {
        this.$message({ type: 'error', message: pu.join(',') })
        isrelease = false
        return false
      } else if (validateFieldArr2.length) {
        isrelease = false
        return false
      }
      return isrelease
    },
    // 提交校 验必填
    SubmitRequired() {
      if (!this.SubmitForVerification()) { return false }
      const basicParams = this.PickUpInformation(true)
      const basicArray = basicParams.detail || []
      const isArr = []
      if (!basicArray.length) { isArr.push('订单信息：分录不能为空') }
      basicArray && basicArray.length && basicArray.forEach((itc) => {
        if (itc.quantityDelivery && itc.quantityDelivery.reissueColorInfo && itc.quantityDelivery.reissueColorInfo.length) {
          itc.quantityDelivery.reissueColorInfo && itc.quantityDelivery.reissueColorInfo.forEach((coItem) => {
            if (coItem.quantityDeliveryDetail && coItem.quantityDeliveryDetail.length) {
              coItem.quantityDeliveryDetail && coItem.quantityDeliveryDetail.forEach(qitem => {
                if (!qitem.quantity) {
                  isArr.push(`订单信息：颜色序号${itc.seq}-${coItem.seq}中交期序号${qitem.seq}的数量不能为空`)
                }
                if (!qitem.delivery) {
                  isArr.push(`订单信息：颜色序号${itc.seq}-${coItem.seq}中交期序号${qitem.seq}的交期不能为空`)
                }
              })
            } else {
              isArr.push(`订单信息：颜色序号${itc.seq}-${coItem.seq}的数量交期不能为空`)
            }
          })
        } else {
          isArr.push(`订单信息：颜色&数量&交期不能为空`)
        }
      })
      if (isArr.length) {
        this.$message({ type: 'error', message: isArr.join(',') })
        return false
      } else if (!this.Picrelease) {
        return false
      } else {
        return basicParams
      }
    },
    // 提交补布单
    async submitPrint() { // 基本信息
      if (this.orderData._rule && Object.keys(this.orderData._rule).length) {
        this.$message({ type: 'error', message: '字段加密不能提交' })
        return false
      }
      if (['2'].includes(this.status)) {
        const basicParams = this.SubmitRequired()
        if (basicParams) {
          this.Alteration()
        }
      } else {
        const basicParams = this.SubmitRequired()
        if (basicParams) {
          const res = await orderSubmit(basicParams)
          if (res.code !== 200) { return false }
          this.$message({ type: 'success', message: '提交成功!' })
          this.GoBackOrder()
        }
      }
    },
    // 删除补布单
    async deleteClick() {
      this.$confirm('确认删除该补布单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        cancelButtonClass: 'btn-cancel'
      })
        .then(() => {
          this.deletePrint()
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消删除' })
        })
    },
    // 删除补布单
    async deletePrint() {
      const res = await orderDelete({ id: this.orderData.id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.fetchLog(
        this.getLogMessages('DEL', '/customerOrder/reissueOrder/delete', 'customerOrder'),
        { id: this.orderData.id },
        JSON.stringify({
          beforeText: `在'客户订单-补布单'删除一条记录`,
          beforeCode: { id: this.orderData.id }
        })
      )
      this.$router.push('/customer-order/patching-orders')
    },
    // 取消返回到列表页
    cancelClick() {
      if (['0', '2', '4', '7'].includes(this.status) && this.isEdit) {
        if (this.$route.params.id) {
          this.getDetailData(this.$route.params.id)
          this.isEdit = false
        } else {
          this.$router.back()
        }
      } else if (['2'].includes(this.status) && !this.isEdit) {
        this.upconfig.title = '取消原因'
        this.upconfig.visible = true
      } else {
        this.CallOff()
      }
    },
    // 全局同步
    GlobalSynchronization() {
      const data = {
        sourceCode: this.allOrderIndexData.sourceCode,
        currency: this.allOrderIndexData.currency,
        reissueReason: this.allOrderIndexData.reissueReason || null,
        reissueDescription: this.allOrderIndexData.reissueDescription || '',
        responsibiltyDepartment: this.allOrderIndexData.responsibiltyDepartment || [],
        detail: this.allOrderIndexData.detail && this.allOrderIndexData.detail.map(item => {
          return {
            seq: item.seq,
            id: item.id || 0,
            coOrderDetailId: item.coOrderDetailId,
            quantityDelivery: item.quantityDelivery ? {
              id: item.quantityDelivery.id || 0,
              coOrderSummaryId: item.quantityDelivery.coOrderSummaryId,
              unit: item.quantityDelivery.unit,
              totalQuantity: item.quantityDelivery.totalQuantity,
              totalAmount: item.quantityDelivery.totalAmount,
              reissueColorInfo: item.quantityDelivery.reissueColorInfo && item.quantityDelivery.reissueColorInfo.length && item.quantityDelivery.reissueColorInfo.map(i => {
                return {
                  seq: i.seq,
                  id: i.id || 0,
                  coOrderColorInfoId: i.coOrderColorInfoId,
                  quantityDeliveryDetail: i.quantityDeliveryDetail && i.quantityDeliveryDetail.length && i.quantityDeliveryDetail.map(itema => {
                    return {
                      id: itema.id || 0,
                      quantity: itema.quantity,
                      auxiliaryQuantity: itema.auxiliaryQuantity,
                      amountTax: itema.amountTax,
                      amount: itema.amount,
                      seq: itema.seq,
                      delivery: itema.delivery
                    }
                  }) || []
                }
              }) || []
            } : null
          }
        }) || []
      }
      const basicParams = this.$utils.deepClone(data) || ''
      // // 附件信息和质量要求需要做特殊处理
      // // basicParams = this.SpecialTreatment(basicParams)
      // basicParams.type = 2
      return basicParams
    },
    PickUpInformation(clickType = false) { // 获取订单信息
      this.Picrelease = true
      const pum = []
      const basicParams = this.GlobalSynchronization()
      // 处理原料信息
      if (this.$route.params.id) {
        basicParams.id = this.allOrderIndexData.id
        basicParams.code = this.orderData.code
        basicParams.version = this.orderData.version
        basicParams['_rule'] = this.orderData['_rule']
      }
      if (pum.length) { // 产品信息
        this.$message({ type: 'error', message: pum[0] })
        this.Picrelease = false
      }
      return basicParams
    },
    // 订单信息保存接口
    async orderDataAdd() {
      const basicParams = this.PickUpInformation()
      if (!basicParams.sourceCode || !this.setFromValue(basicParams.sourceCode)) {
        this.$message({ type: 'warning', message: '来源单号不能为空!' })
        return
      }
      if (this.$route.params.id) {
        const res = await orderModify(basicParams)
        if (res.code !== 200) { return false }
        this.$message({ type: 'success', message: '修改成功!' })
        const { beforeCode, afterCode } = this.compareData(this.copyDetailData, { ...basicParams, id: this.$route.params.id }, 'id')
        const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
        flag && this.fetchLog(
          this.getLogMessages('UPDATE', '/customerOrder/reissueOrder/modify', 'customerOrder'),
          { ...basicParams, id: this.$route.params.id },
          JSON.stringify({
            beforeText: `在'客户订单-补布单'将${JSON.stringify({ 'id': this.$route.params.id })}`,
            afterText: '修改为',
            ...{ beforeCode, afterCode }
          })
        )
        if (this.$route.path.includes('show')) {
          this.isEdit = false
          this.getDetailData(this.$route.params.id)
        } else {
          this.$router.push({ path: `/customer-order/patching-orders/detail/${this.$route.params.id}/show` })
        }
        // this.isEdit = false
        // this.getDetailData(this.$route.params.id)
        // this.$nextTick(() => {
        //   this.$route.params && this.$route.params.id && this.$router.push({ path: `/customer-order/patching-orders/detail/${this.$route.params.id}/show` })
        // })
      } else {
        const res = await orderAdd(basicParams)
        if (res.code !== 200) { return false }
        this.$message({ type: 'success', message: '新增成功!' })
        this.fetchLog(
          this.getLogMessages('INSERT', '/customerOrder/reissueOrder/add', 'customerOrder'),
          { data: basicParams },
          JSON.stringify({ beforeText: `在'客户订单-补布单'新增一条记录`, beforeCode: basicParams })
        )
        this.$router.push({ path: `/customer-order/patching-orders/detail/${res.data}/show` })
      }
    },
    // 订单审核
    async ToExamine() {
      this.config.workflowId = this.orderData.id // 订单id
      this.config.procInstId = this.orderData.procInstId || '' // 流程实例id
      this.config.visible = true
    },
    // 完结
    async ClickFinish() {
      const dataId = this.orderData
      const res = await orderFinish({ 'id': dataId.id })
      if (res.code !== 200) { return false }
      this.$message({ type: 'success', message: '完结成功!' })
      this.isEdit = false
      this.GoBackOrder()
    },
    // Hold单
    async ClickHold() {
      this.upconfig.title = 'Hold单原因'
      this.upconfig.visible = true
    },
    // 解holdHold单
    async solveHold() {
      const dataId = this.orderData
      const res = await orderRemoveHold({ 'id': dataId.id })
      if (res.code !== 200) { return false }
      this.$message({ type: 'success', message: '解hold成功!' })
      this.isEdit = false
      this.GoBackOrder()
    },
    // 撤回
    async Withdraw() {
      const dataId = this.orderData.id
      const ruID = this.$route.params.id
      const res = await orderWithdrawt({ 'id': dataId })
      if (res.code !== 200) { return false }
      this.$message({ type: 'success', message: '撤回成功!' })
      this.isEdit = false
      this.getDetailData(ruID)
    },
    // 取消
    async CallOff() {
      const dataId = this.orderData
      const sm = this.setOrderStatus(dataId.status)
      let IndexOne = 0
      if (sm.text === '待审核') { IndexOne = 0 } else if (sm.text === '已审核') { IndexOne = 1 }
      const res = await orderCancel({ 'id': dataId.id, 'type': IndexOne, 'cancelReason': this.cancelReason })
      if (res.code !== 200) { return false }
      this.$message({ type: 'success', message: '取消成功!' })
      this.isEdit = false
      this.GoBackOrder()
    },
    // 变更弹窗出现
    async Alteration() {
      if (this.orderData._rule && Object.keys(this.orderData._rule).length) {
        this.$message({ type: 'error', message: '字段加密不能提交' })
        return false
      }
      this.upconfig.title = '变更内容及原因'
      this.upconfig.visible = true
    },
    async okCallback(val) { // 变更提交
      if (val.title === '变更内容及原因') {
        const basicParams = this.SubmitRequired()
        if (basicParams) {
          basicParams.changeReason = val.text.remark
          const res = await orderChange(basicParams)
          if (res.code !== 200) { return false }
          this.$message({ type: 'success', message: '变更成功!' })
          this.GoBackOrder()
        }
      } else if (val.title === '取消原因') {
        this.cancelReason = val.text.remark
        this.CallOff()
      } else if (val.title === 'Hold单原因') {
        const dataId = this.orderData
        const res = await orderHold({ 'id': dataId.id, 'holdReason': val.text.remark })
        if (res.code !== 200) { return false }
        this.$message({ type: 'success', message: 'Hold单成功!' })
        this.isEdit = false
        this.GoBackOrder()
      }
    },
    CancelText(val) { // 取消确定
      this.upconfig.visible = false
    },
    // 待审核-取消待审
    setCallOff() {
      this.upconfig.title = '取消原因'
      this.upconfig.visible = true
    },
    // 返回上一页
    GoBackOrder() {
      this.$router.push('/customer-order/patching-orders')
    },
    setlabel(data, type = 1) {
      return type === 1 ? (data ? data + '' : '') : (data || '')
    },
    // 纯数据展示
    setFromValue(it) {
      if (it && it.value) {
        it.value = it.value !== null ? it.value : ''
      } else {
        it = ''
      }
      return it
    },
    filterPermission(data) {
      return this.$filterPermission([{ permitTag: data }]).length
    }
  }
}
</script>

<style lang="scss">
.sample-detail {
  padding-bottom: 60px;
  margin-top: 20px;
  .inputWidth {
    width: 80% !important;
  }
  .status-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 20px;
    margin-bottom: 16px;
    .detail-code {
      font-size: 18px;
      color: #151222;
    }
    .copy-code {
      font-size: 12px;
      color: #777777;
    }
    .detail-info {
      font-size: 12px;
      color: #666666;
      span {
        margin-right: 10px;
        font-size: 14px;
        font-weight: 400;
      }
    }
  }
  .tab-change {
    display: flex;
    margin: 0 20px;
    background: #ffffff;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eeeff0;
    .el-tabs {
      margin-left: 26px;
    }
    .el-tabs__header {
      margin: 0;
    }
    .el-tabs__nav-wrap::after {
      height: 0;
    }
    .el-tabs__item {
      padding: 10px 20px;
      height: auto;
    }
    .requirement-info {
      margin-right: 26px;
      span {
        font-size: 14px;
        color: #888e9e;
      }
    }
  }
  //底部导航栏
  .custom-form {
    margin: 0 20px;
  }
  .fixed-footer {
    width: calc(100% - 54px) !important;
  }
  .button-group {
    width: calc(100% - 210px);
    transition: width 0.28s;
    position: fixed;
    text-align: center;
    bottom: 0;
    padding: 10px;
    background: #ffffff;
    border-top: 1px solid #ecf0f3;
    z-index: 999;
  }
}
</style>

<style lang="scss">
.rules-disable {
  .basic-data {
    .detailClass {
      .is-required .el-form-item__label::before {
        content: '';
      }
    }
  }
  .order-info {
    .detailClass {
      .is-required .el-form-item__label::before {
        content: '';
      }
    }
    .titleView::before {
      content: '';
    }
    .order-item {
      .date-title {
        .item-title::before {
          content: '' !important;
        }
        .el-input {
          input {
            border: 0;
            background: #ffffff;
          }
          .el-input__suffix {
            i::before {
              content: '';
            }
          }
        }
      }
    }
    .color-header-colors{
      .color-header-dates .item-title::before{
        content: '' !important;
      }
    }
  }
  .leftTableForm {
    .el-table__header .ruleTip .cell::before {
      content: '';
    }
  }
  .el-form-item{
    margin-bottom: 0 !important;
  }
  .el-form-item__label{
    color: #888E9E;
  }
  .el-form-item__content{
    color: #474747;
  }
}
</style>
