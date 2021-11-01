/**
 * @Description: 按钮状态扭转
 * @author Roman
 * @date 2021-04-26 11:22:17
 * @edit 2021-04-26 11:22:17
*/
<template>
  <div>
    <el-button v-if="modify_isShow" type="primary" @click="setEdit">编辑</el-button>
    <el-button v-if="submit_isShow" :type="getSubmitPrimary" @click="orderDataSubmit">提交</el-button>
    <el-button v-if="audit_isShow" type="primary" @click="ToExamine">审核</el-button>
    <el-button v-if="withdraw_isShow" @click="orderDataWithdraw">撤回</el-button>
    <el-button v-if="change_isShow" type="primary" @click="setEdit">变更</el-button>
    <el-button v-if="finish_isShow" @click="ClickFinish">完结</el-button>
    <el-button v-if="removeHold_isShow" type="primary" @click="solveHold">解Hold</el-button>
    <el-button v-if="copy_isShow" :type="getCopyPrimary" @click="copyPrint">复制</el-button>
    <el-button v-if="hold_isShow" @click="ClickHold">Hold单</el-button>
    <el-button v-if="delete_isShow" @click="deleteClick">删除</el-button>
    <el-button v-if="save_isShow" type="primary" @click="orderDataAdd">保存</el-button>
    <el-button v-if="cancel_isShow" @click="cancelClick">取消</el-button>
    <el-button v-if="back_isShow" @click="GoBackOrder">返回</el-button>
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
import { fetchOrderDataAdd, fetchOrderDataSubmit, fetchOrderDataChange, fetchOrderDataDelete, fetchOrderDataWithdraw, fetchOrderDataCancel, fetchOrderDataFinish, fetchOrderDataHold, fetchOrderDataRemoveHold, fetchOrderDataModify } from './api'

import approve from '@/components/approve/index'
import { isArray } from '@/utils/validate'
import upinformation from './pups'
import { setOrderFun } from '@/views/customer-order/public/api/mou'
export default {
  components: {
    approve,
    upinformation
  },
  mixins: [setOrderFun],
  props: {
    data: {
      type: Object
    },
    isEdit: {
      type: Boolean
    },
    clothingForm: {
      type: Object
    },
    setActiveName: {
      type: Function
    },
    getDetailData: {
      type: Function
    },
    isCopy: {
      type: Boolean
    }
  },
  data() {
    return {
      orderData: {},
      statusEdit: false,
      orderIndexData: {},
      cancelReason: '',
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
      Picrelease: false,
      config: { // 审核流程
        visible: false,
        workflowId: '',
        procinstid: '',
        pass: (res) => {
          this.GoBackOrder()
        },
        refuse: (res) => {
          this.GoBackOrder()
        },
        back: (res) => {
          this.GoBackOrder()
        }
      }
    }
  },
  computed: {
    getSubmitPrimary() {
      return ['2'].includes(this.status) ? 'primary' : ''
    },
    getCopyPrimary() {
      return ['7', '13'].includes(this.status) ? 'primary' : ''
    },
    status() {
      return this.baseInfo.status || '0'
    },
    baseInfo() {
      return this.orderData.baseInfo || {}
    },
    modify_isShow() { // 编辑
      return !this.isEdit && ['0', '4'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:modify'])
    },
    submit_isShow() { // 提交
      if (this.isEdit) {
        return ['2', '4'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:submit'])
      } else {
        return ['0'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:submit'])
      }
    },
    audit_isShow() { // 审核
      return !this.isEdit && ['1', '10', '5', '8'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:audit'])
    },
    withdraw_isShow() { // 撤回
      return !this.isEdit && ['1'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:withdraw'])
    },
    change_isShow() { // 变更
      return !this.isEdit && ['2'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:change'])
    },
    finish_isShow() { // 完结
      return !this.isEdit && ['2'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:finish'])
    },
    hold_isShow() { // Hold单
      return !this.isEdit && ['2'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:hold'])
    },
    removeHold_isShow() { // 解Hold
      return !this.isEdit && ['12'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:removeHold'])
    },
    copy_isShow() { // 复制
      return !this.isEdit && !['3'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:copy'])
    },
    delete_isShow() { // 删除
      return !this.isEdit && ['0'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:delete'])
    },
    cancel_isShow() { // 取消
      return this.isEdit || ['1', '2'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:cancel'])
    },
    save_isShow() { // 保存
      return this.isEdit && !['2', '4'].includes(this.status) && this.$filterPermission(['customerOrder:greyOrder:modify', 'customerOrder:greyOrder:add'])
    },
    back_isShow() { // 返回
      return !this.isEdit && !['3'].includes(this.status)
    }
  },
  watch: {
    data: {
      handler(val, oldVal) {
        console.log(val)
        this.orderDataCompare = this.$utils.deepClone(val)
        this.orderData = this.$utils.deepClone(val)
      },
      deep: true,
      immediate: true
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {
    // 解holdHold单
    async solveHold() {
      const res = await fetchOrderDataRemoveHold({ 'orderId': this.baseInfo.orderId })
      if (res.code !== 200) { return false }
      this.$message({ type: 'success', message: '解hold成功!' })
      this.GoBackOrder()
    },
    // 待审核-取消待审
    setCallOff() {
      this.upconfig.title = '取消原因'
      this.upconfig.visible = true
    },
    // Hold单
    async ClickHold() {
      this.upconfig.title = 'Hold单原因'
      this.upconfig.visible = true
    },
    // 完结
    async ClickFinish() {
      const res = await fetchOrderDataFinish({ 'orderId': this.baseInfo.orderId })
      if (res.code !== 200) { return false }
      this.$message({ type: 'success', message: '完结成功!' })
      this.GoBackOrder()
    },
    GoBackOrder() {
      this.$router.push({ path: `/customer-order/preform-preparation-orders` })
    },
    cancelClick() {
      if (['0', '2', '4', '7'].includes(this.status) && this.isEdit) {
        this.getDetailData(this.$route.params.id)
        this.$router.back()
      } else if (['2'].includes(this.status) && !this.isEdit) {
        this.setCallOff()
      } else {
        this.CallOff()
      }
    },
    setEdit() {
      this.$router.push({ path: `/customer-order/preform-preparation-orders/${this.$route.params.id}`, query: { status: 1 }})
    },
    // 删除订单
    async deletePrint() {
      const params = { orderId: this.baseInfo.orderId }
      const res = await fetchOrderDataDelete(params)
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      const api = `/customerOrder/coGreyOrder/delete`
      const opratorType = `DEL`
      const description = { beforeText: `在'客户订单-备坯单'删除一条记录`, beforeCode: params }
      const appId = 'customerOrder'
      this.$store.dispatch('app/fetchParamsLog', { params, opratorType, api, description, appId })
      this.$router.push('/customer-order/preform-preparation-orders')
    },
    async deleteClick() {
      this.$confirm('确认删除该订单？', '提示', {
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
    // 复制
    async copyPrint() {
      this.$router.push({ path: `/customer-order/preform-preparation-orders/create`, query: { id: this.$route.params.id }})
    },
    // 保存
    async orderDataAdd() {
      const params = this.PickUpInformation()
      if (!this.Picrelease) { return false }
      const { beforeCode, afterCode } = this.$utils.compareData(this.orderDataCompare, params, 'id')
      let description = {}
      let opratorType = ``
      let api = ``
      if (this.$route.params.id) {
        const { detail = [] } = params
        detail.forEach(item => {
          item.orderId = item.orderId ? item.orderId : this.$route.params.id
        })

        const res = await fetchOrderDataModify(params)
        if (res.code !== 200) { return false }
        this.$message({ type: 'success', message: '修改成功!' })
        await this.getDetailData(this.$route.params.id)
        description = {
          beforeText: `在'客户订单-备坯单'将${JSON.stringify({ 'id': this.$route.params.id })}`,
          afterText: '修改为',
          ...{ beforeCode, afterCode }
        }
        opratorType = `UPDATE`
        api = `/customerOrder/coGreyOrder/modify`
        this.$router.push({ path: `/customer-order/preform-preparation-orders/${this.$route.params.id}`, query: {}})
      } else {
        const res = await fetchOrderDataAdd(params)
        if (res.code !== 200) { return false }
        description = {
          beforeText: `在'客户订单-备坯单'新增一条记录`,
          beforeCode: params
        }
        opratorType = `INSERT`
        api = `/customerOrder/coGreyOrder/add`
        this.$message({ type: 'success', message: '新增成功!' })
        this.$router.push({ path: `/customer-order/preform-preparation-orders/${res.data}` })
      }
      this.$store.dispatch('app/fetchParamsLog', { params, opratorType, api, description, appId: 'customerOrder' })
    },
    // 文件字符串化
    setUploadData(data, im) {
      if (data) {
        if (data[im] && isArray(data[im])) {
          let attachStr = ''
          data[im].forEach((item, index) => {
            if (item.response && item.response.data) {
              attachStr = attachStr + item.response.data.id + ','
            } else if (item.id) {
              attachStr = attachStr + item.id + ','
            }
          })
          return attachStr.substring(0, attachStr.lastIndexOf(','))
        }
      } else { return '' }
    },
    SpecialTreatment(dataTim) {
      const extraInfo = dataTim.extraInfo
      // if ((dataTim.demandSource && dataTim.demandCode) || dataTim.isFromCrm) { // 附件信息格式处理
      //   const som = extraInfo.customerOrderFile
      //   const clo = extraInfo.clothingStyleFile
      //   const oth = extraInfo.otherFile
      //   extraInfo.customerOrderFileUrl = som && som.length ? JSON.stringify(som) : null
      //   extraInfo.clothingStyleFileUrl = clo && clo.length ? JSON.stringify(clo) : null
      //   extraInfo.otherFileUrl = oth && oth.length ? JSON.stringify(oth) : null
      //   extraInfo.customerOrderFile = null
      //   extraInfo.clothingStyleFile = null
      //   extraInfo.otherFile = null
      // } else {
      //   extraInfo.customerOrderFile = this.setUploadData(extraInfo, 'customerOrderFile')
      //   extraInfo.clothingStyleFile = this.setUploadData(extraInfo, 'clothingStyleFile')
      //   extraInfo.otherFile = this.setUploadData(extraInfo, 'otherFile')
      //   extraInfo.customerOrderFileUrl = null
      //   extraInfo.clothingStyleFileUrl = null
      //   extraInfo.otherFileUrl = null
      // }
      extraInfo.customerOrderFile = this.setUploadData(extraInfo, 'customerOrderFile')
      extraInfo.clothingStyleFile = this.setUploadData(extraInfo, 'clothingStyleFile')
      extraInfo.otherFile = this.setUploadData(extraInfo, 'otherFile')
      extraInfo.customerOrderFileUrl = null
      extraInfo.clothingStyleFileUrl = null
      extraInfo.otherFileUrl = null
      return dataTim
    },
    GlobalSynchronization() {
      let basicParams = this.$utils.deepClone(this.orderData) || ''
      // 附件信息需要做特殊处理
      basicParams = this.SpecialTreatment(basicParams)
      return basicParams
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
    SubmitForVerification() { // 提交验证
      const allOrder = this.GlobalSynchronization()
      console.log(allOrder)
      const baseInfo = allOrder.baseInfo || {}
      const validateFieldArr2 = []
      let isrelease = true
      const pu = []
      let isactiveName = true
      if (!baseInfo.brand || !this.setFromValue(baseInfo.brand)) {
        pu.push('品牌商不能为空')
      } else if (!baseInfo.customer || !this.setFromValue(baseInfo.customer)) {
        pu.push('客户不能为空')
      } else if (!baseInfo.salesTeam || !this.setFromValue(baseInfo.salesTeam)) {
        pu.push('销售团队不能为空')
      } else if (!baseInfo.seller || !this.setFromValue(baseInfo.seller)) {
        pu.push('销售员不能为空')
      } else if (!baseInfo.customerService || !this.setFromValue(baseInfo.customerService)) {
        pu.push('客服不能为空')
      } else if (!baseInfo.sellYear) {
        pu.push('销售年度不能为空')
      } else if (!baseInfo.sellQuarter || !this.setFromValue(baseInfo.sellQuarter)) {
        pu.push('销售季度不能为空')
      } else if (!baseInfo.currency || !this.setFromValue(baseInfo.currency)) {
        pu.push('币别不能为空')
      } else if (!baseInfo.hasOwnProperty('taxRate') || baseInfo.taxRate === '' || baseInfo.taxRate === null) {
        pu.push('税率不能为空')
      }

      if (pu.length) {
        this.$message({ type: 'error', message: pu[0] })
        isrelease = false
        return false
      }
      // 成衣信息
      this.clothingForm.validateField(['clothingType', 'clothingStyle', 'isClothingWashWater', 'clothingExport'], async(validateField7) => {
        if (validateField7 && validateField7 !== '') {
          if (isactiveName) {
            this.setActiveName('2')
            isactiveName = false
          }
          validateFieldArr2.push(validateField7)
        }
      })
      const comFile = allOrder.extraInfo.customerOrderFileUrl
      if (allOrder.extraInfo && comFile) {
        if (comFile.hasOwnProperty('crmType')) {
          if (!comFile.customerOrderFileUrl) {
            if (isactiveName) {
              this.setActiveName('2')
              isactiveName = false
              this.$message({ type: 'error', message: '客户订单附件不能为空' })
            }
            isrelease = false
          }
        }
      } else {
        if (!allOrder.extraInfo.customerOrderFile) {
          if (isactiveName) {
            this.setActiveName('2')
            isactiveName = false
            this.$message({ type: 'error', message: '客户订单附件不能为空' })
          }
          isrelease = false
        }
      }
      if (validateFieldArr2.length) {
        isrelease = false
        return false
      }
      return isrelease
    },
    // 最大值99的校验
    checkNumFun(value) {
      const reg = /^[1-9]\d*$/
      if (value === 0 || !reg.test(value)) {
        return '缩水请填写正整数'
      } else if (value > 99) {
        return '缩水最大值99'
      } else {
        return ''
      }
    },
    PickUpInformation(clickType = false) { // 获取订单信息
      this.Picrelease = true
      const pum = []
      const max9999Reg = /^(([1-9]{1}\d{0,3})|(0{1}))(\.\d{1,2})?$/
      const basicParams = this.GlobalSynchronization()
      if (basicParams.baseInfo && basicParams.baseInfo.hasOwnProperty('taxRate')) { // '税率
        if (!max9999Reg.test(basicParams.baseInfo.taxRate)) {
          pum.push('税率输入0~9999.99!')
        }
      }
      // 处理原料信息
      basicParams.detail && basicParams.detail.forEach((ix) => {
        if (ix.weightAfter && !max9999Reg.test(ix.weightAfter)) {
          pum.push('成品克重（洗后）克重请输入0~9999.99!')
          this.Picrelease = false
          return
        }
        if (ix.shrinkL) { // 缩水
          const mess = this.checkNumFun(ix.shrinkL)
          mess && pum.push(mess)
        }
        if (ix.shrinkW) {
          const mess = this.checkNumFun(ix.shrinkW)
          mess && pum.push(mess)
        }
        if (ix.ratio) { // 比例
          const mess = this.ratioFun(ix.ratio)
          mess && pum.push(mess)
        }
        if (ix.fabricElement && ix.fabricElement.length && (ix.fabricElement.find(item => !(item.ratio - 0)) || ix.fabricElement.reduce((sum, cru) => {
          sum -= cru.ratio
          return sum
        }, 100))) {
          pum.push(`产品序号${ix.seq}的面料成分/比例-客户比例不能为空且比例之和需为100`)
        }
      })
      if (this.isCopy) {
        delete basicParams.orderId
        delete basicParams.status
        delete basicParams.demandCode
        delete basicParams.demandSource
        delete basicParams.extraInfo.extraId
      }
      if (pum.length) { // 产品信息
        this.$message({ type: 'error', message: pum[0] })
        this.Picrelease = false
      }
      return basicParams
    },
    SubmitRequired() { // 测试先 注释全部必填校验
      if (!this.SubmitForVerification()) { return false }
      const basicParams = this.PickUpInformation(true)
      const basicArray = basicParams.detail || []
      const isArr = []
      if (!basicArray.length) { isArr.push('分录不能为空') }
      basicArray && basicArray.length && basicArray.forEach((itc, ixc) => {
        if (!itc.fabricElement || !itc.fabricElement.length) {
          isArr.push(`产品序号${itc.seq}的面料成分/比例不能为空`)
        } if (itc.fabricElement && itc.fabricElement.length && (itc.fabricElement.find(item => !(item.ratio - 0)) || itc.fabricElement.reduce((sum, cru) => {
          sum -= cru.ratio
          return sum
        }, 100))) {
          isArr.push(`产品序号${itc.seq}的面料成分/比例-客户比例不能为空且比例之和需为100`)
        }
        if (!itc.weightAcceptanceCriteria || !itc.weightAcceptanceCriteria.label) {
          isArr.push('克重验收标准填写不正确')
        }
        if (!itc.quantityDelivery || !itc.quantityDelivery.quantityDeliveryDetail || !itc.quantityDelivery.quantityDeliveryDetail.length) {
          isArr.push('数量交期汇总信息不能为空')
        } if (itc.quantityDelivery) {
          if (!itc.quantityDelivery.unit || !itc.quantityDelivery.unit.value ||
            !itc.quantityDelivery.unit.label ||
            itc.quantityDelivery.unit.value === 'undefined') {
            isArr.push('单位不能为空')
          }
          if (!itc.quantityDelivery.priceTax) {
            isArr.push('单价(含税)不能为空')
          }
          if (!itc.quantityDelivery.estimateOrderDate) {
            isArr.push('预计下单日期不能为空')
          }
        } if (itc.quantityDelivery && itc.quantityDelivery.quantityDeliveryDetail && itc.quantityDelivery.quantityDeliveryDetail.length) {
          itc.quantityDelivery.quantityDeliveryDetail && itc.quantityDelivery.quantityDeliveryDetail.forEach(coItem => {
            if (!coItem.estimateOutDate) {
              isArr.push('预计出货时间不能为空')
            } if (!coItem.estimateOutQuantity) {
              isArr.push('预计出货量不能为空')
            }
          })
        }
      })
      if (isArr.length) {
        this.$message({ type: 'error', message: isArr[0] })
        return false
      } else if (!this.Picrelease) {
        return false
      } else {
        return basicParams
      }
    },
    // 提交
    async orderDataSubmit() {
      if (this.orderData._rule && Object.keys(this.orderData._rule).length) {
        this.$message({ type: 'error', message: '字段加密不能提交' })
        return false
      }
      if (['2'].includes(this.status)) {
        this.Alteration()
      } else {
        const basicParams = this.SubmitRequired()
        console.log(basicParams)
        if (basicParams) {
          const res = await fetchOrderDataSubmit(basicParams)
          if (res.code !== 200) { return false }
          this.$message({ type: 'success', message: '提交成功!' })
          this.getDetailData(this.$route.params.id)
          this.GoBackOrder()
        }
      }
    },
    async orderDataWithdraw() {
      const dataId = this.orderData.baseInfo.orderId
      const ruID = this.$route.params.id
      const res = await fetchOrderDataWithdraw({ 'orderId': dataId })
      if (res.code !== 200) { return false }
      this.$message({ type: 'success', message: '撤回成功!' })
      this.getDetailData(ruID)
      console.log(res)
    },
    async ToExamine() {
      this.config.workflowId = this.baseInfo.orderId // 订单id
      this.config.procInstId = this.baseInfo.procInstId || '' // 流程实例id
      this.config.visible = true
    },
    async CallOff() {
      const sm = this.setOrderStatus(this.status)
      let IndexOne = 0
      if (sm.text === '待审核') { IndexOne = 0 } else if (sm.text === '已审核') { IndexOne = 1 }
      const res = await fetchOrderDataCancel({ 'orderId': this.baseInfo.orderId, 'type': IndexOne, 'cancelReason': this.cancelReason })
      if (res.code !== 200) { return false }
      this.$message({ type: 'success', message: '取消成功!' })
      this.$router.push('/customer-order/preform-preparation-orders')
    },
    // 变更弹窗出现
    async Alteration() {
      this.upconfig.title = '变更内容及原因'
      this.upconfig.visible = true
    },
    async okCallback(val) { // 变更提交
      if (val.title === '变更内容及原因') {
        const basicParams = this.SubmitRequired()
        if (basicParams) {
          basicParams.changeReason = val.text.remark
          console.log(val.text.remark)
          const res = await fetchOrderDataChange(basicParams)
          if (res.code !== 200) { return false }
          this.$message({ type: 'success', message: '变更成功!' })
          this.GoBackOrder()
        }
      } else if (val.title === '取消原因') {
        this.cancelReason = val.text.remark
        this.CallOff()
      } else if (val.title === 'Hold单原因') {
        const res = await fetchOrderDataHold({ 'orderId': this.baseInfo.orderId, 'holdReason': val.text.remark })
        if (res.code !== 200) { return false }
        this.$message({ type: 'success', message: 'Hold单成功!' })
        this.GoBackOrder()
      }
    },
    CancelText(val) { // 取消确定
      this.upconfig.visible = false
    }
  }
}

</script>

<style lang="scss">

</style>

