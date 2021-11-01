<!--
 * @name: 剪样新增和查看公用的页面
 * @description: 剪样详情页
 * @author: panmr
 * @time: 2021-05-22 17:51:45
-->
<template>
  <div class="sampleYans-detail">
    <!-- 头部状态 -->
    <template>
      <!--      <promptText :order-data="orderData" />-->
      <status-bar :order-data="orderData.baseInfo" />
    </template>
    <div class="order-request">
      <order-index
        ref="OrderRequest"
        :sync-data-handle="syncDataHandle"
        :order-data="orderData"
        :is-edit="isEdit"
        :is-copy="isCopy"
      />
    </div>
    <!-- 底部按钮 -->
    <div :class="{ 'fixed-footer': !sidebar }" class="button-group">
      <!-- 草稿0 (编辑  提交  删除  返回)-->
      <div v-if="!isEdit && orderData.baseInfo && orderData.baseInfo.status === 0">
        <el-button
          v-permission="['customerOrder:cutSampleApply:modify']"
          type="primary"
          @click="setEdit"
        >编辑</el-button>
        <el-button
          v-permission="['customerOrder:cutSampleApply:submit']"
          @click="submitPrint"
        >提交</el-button>
        <el-button
          v-permission="['customerOrder:cutSampleApply:delete']"
          @click="deleteClick"
        >删除</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 已驳回2 (编辑  取消  返回)-->
      <div v-if="!isEdit && orderData.baseInfo && orderData.baseInfo.status === 2">
        <el-button
          v-permission="['customerOrder:cutSampleApply:modify']"
          type="primary"
          @click="setEdit"
        >编辑</el-button>
        <el-button
          v-permission="['customerOrder:cutSampleApply:submit']"
          @click="submitPrint"
        >提交</el-button>
        <el-button
          v-permission="['customerOrder:cutSampleApply:cancel']"
          @click="CallOff"
        >取消</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!--待审核1 (审核  撤回  返回)-->
      <div v-if="!isEdit && orderData.baseInfo && orderData.baseInfo.status === 1">
        <el-button
          v-permission="['customerOrder:cutSampleApply:audit']"
          type="primary"
          @click="ToExamine"
        >审核</el-button>
        <el-button
          v-permission="['customerOrder:cutSampleApply:withdraw']"
          @click="Withdraw"
        >撤回</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 进行中1 (完结 取消 返回)-->
      <div v-if="!isEdit && orderData.baseInfo && orderData.baseInfo.status === 3">
        <el-button
          v-permission="['customerOrder:cutSampleApply:finish']"
          @click="ClickFinish"
        >完结</el-button>
        <el-button
          v-permission="['customerOrder:cutSampleApply:cancel']"
          @click="setCallOff"
        >取消</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 已完结5 已取消4 (返回)-->
      <div v-if="!isEdit && orderData.baseInfo && (orderData.baseInfo.status === 5 || orderData.baseInfo.status === 4)">
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 新建 -->
      <div
        v-if="isEdit && !statusEdit && orderData.baseInfo && orderData.baseInfo.status !== 4"
        class="statusEdit2"
      >
        <el-button v-permission="['customerOrder:cutSampleApply:cancel']" @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="saveClick">保存</el-button>
      </div>
      <div
        v-if="isEdit && !statusEdit && orderData.baseInfo && orderData.baseInfo.status === 4"
        class="statusEdit2"
      >
        <el-button v-permission="['customerOrder:cutSampleApply:cancel']" @click="cancelClick">取消</el-button>
        <el-button v-if="isCopy" @click="saveClick">保存</el-button>
        <el-button
          v-if="!isCopy"
          v-permission="['customerOrder:cutSampleApply:submit']"
          type="primary"
          @click="submitPrint"
        >提交</el-button>
      </div>
      <!--待提交-已驳回 进行中-已审核-->
      <div v-if="isEdit && statusEdit" class="statusEdit">
        <el-button v-permission="['customerOrder:cutSampleApply:cancel']" @click="cancelClick">取消</el-button>
        <el-button v-permission="['customerOrder:cutSampleApply:submit']" type="primary" @click="Alteration">提交</el-button>
      </div>
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
import approve from '@/components/approve/index'
import upinformation from './compoments/pups'
import { PublicCustomer } from '@/views/customer-order/public/index'
import { isArray } from '@/utils/validate'
// import promptText from './compoments/prompt-text'
import statusBar from './compoments/status-bar'
import { setOrderFun } from '@/views/customer-order/board-application/api/com'
import {
  orderAdd, orderModify, getDetail, orderDelete, gueCopyInfo, orderSubmit, orderFinish,
  orderChange, orderRemoveHold, orderWithdrawt, orderCancel, orderHold } from './api/index'
export default {
  components: {
    orderIndex,
    approve,
    upinformation,
    statusBar
    // promptText
  },
  mixins: [logMethods, PublicCustomer, setOrderFun],
  data() {
    return {
      isEdit: true,
      orderData: {
        baseInfo: {
          thingType: '2', // 默认选中外部件
          tagLanguage: 1, // 默认选中中文
          payMethod: 1 // 付费方式默认是寄付
        },
        cutSampleRequirements: []
      },
      orderIndexData: {},
      isCopy: false,
      copyDetailData: {},
      allOrderIndexData: {}, // 订单要求页签的全量数据(包含了旧的质量要求和附加信息的数据)
      statusEdit: false, // 驳回编辑状态不同
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
      Picrelease: false
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar.opened
    },
    getStat() { // 外层表格的数据状态
      return this.orderData && this.orderData.baseInfo && this.orderData.baseInfo.status ? this.orderData.baseInfo.status : ''
    },
    getrule() { // 外层表格的数据权限
      return this.orderData ? (this.orderData._rule ? this.orderData._rule : '') : ''
    }
  },
  watch: {
    orderData: {
      handler(val, oldVal) { },
      deep: true
    }
  },
  created() {
    if (this.$route.params.uuid) {
      this.getDetailData(this.$route.params.uuid)
      if (this.$route.query.statusIndex) { this.setEdit() }// 变更
    }
    if (this.$route.params.uuid) {
      if (this.$route.path.includes('show')) {
        this.isEdit = false // 详情
      } else {
        this.isEdit = true // 编辑
      }
    } else {
      this.isEdit = true // 新建
    }
  },
  mounted() {
  },
  methods: {
    // 对象的纯文本展示
    setInfoValue(it) {
      if (it && it.value) {
        it.value = it.value !== null ? it.value : ''
      } else {
        it = ''
      }
      return it
    },
    syncDataHandle(key, data = {}) { // 保存组装数据
      this.allOrderIndexData = data
    },
    // 获取详情数据
    async getDetailData(uuid) {
      this.statusEdit = false
      this.isCopy = false
      const res = await getDetail({ uuid: uuid })
      if (res.code !== 200) { return false }
      this.infoDaTA(res.data)
    },
    // 详情数据 统一处理
    async infoDaTA(res) {
      this.orderData = this.$utils.deepClone(res) // 接口请求慢 赋值不正确
    },
    // 编辑
    setEdit() {
      this.isEdit = true
      const ruID = this.$route.params.uuid
      const orcom = this.orderData.baseInfo
      if ((ruID && (orcom && orcom.status === '2')) || (ruID && (this.$route.query.statusIndex === '2'))) {
        this.statusEdit = true
      }
    },
    SubmitForVerification() { // 提交验证
      const allOrder = this.allOrderIndexData.baseInfo // 寄件要求 对象
      const alInfo = this.allOrderIndexData.cutSampleRequirements // 剪样要求 数组
      let isrelease = true
      const pu = []
      if (allOrder.thingType === 2) { // 外部件
        if (!allOrder.expressCompany || !this.setInfoValue(allOrder.expressCompany)) {
          pu.push('快递公司不能为空')
        } else if (!allOrder.payMethod) {
          pu.push('付费方式不能为空')
        } else if (!allOrder.addressee) {
          pu.push('收件人不能为空')
        } else if (!allOrder.receiverTel) {
          pu.push('收件人电话不能为空')
        } else if (!allOrder.receiverCompany || !this.setInfoValue(allOrder.receiverCompany)) {
          pu.push('收件公司不能为空')
        } else if (!allOrder.tagLanguage) {
          pu.push('标签语言不能为空')
        } else if (!allOrder.deliveryTime) {
          pu.push('要求寄出时间不能为空')
        } else if (!alInfo || !alInfo.length) {
          pu.push('剪样要求不能为空')
        }
        if (pu.length) {
          this.$message({ type: 'error', message: pu[0] })
          isrelease = false
          return false
        }
      }
      if (allOrder.thingType === 1) { // 内部件
        if (!allOrder.receiver || !this.setInfoValue(allOrder.receiver)) {
          pu.push('接收人不能为空')
        } else if (!allOrder.deliveryTime) {
          pu.push('要求寄出时间不能为空')
        } else if (!alInfo || !alInfo.length) {
          pu.push('剪样要求不能为空')
        }
        if (pu.length) {
          this.$message({ type: 'error', message: pu[0] })
          isrelease = false
          return false
        }
      }
      return isrelease
    },
    // 提交校 验必填
    SubmitRequired() {
      if (!this.SubmitForVerification()) { return false }
      const basicParams = this.PickUpInformation(true)
      if (!this.Picrelease) {
        return false
      } else {
        return basicParams
      }
    },
    // 取消返回到列表页
    cancelClick() {
      const that = this
      that.isEdit = false
      if ((this.$route.params.uuid && this.$route.path.includes('edit')) || !this.$route.params.uuid) {
        that.GoBackOrder()
      }
      if ((this.$route.params.uuid && this.$route.path.includes('show')) || this.isCopy || this.$route.params.uuid) {
        this.getDetailData(this.$route.params.uuid)
      }
    },
    // 删除样板订单
    async deleteClick() {
      this.$confirm('确认删除该寄板单？', '提示', {
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
    // 删除样板订单
    async deletePrint() {
      const res = await orderDelete({ id: Number(this.orderData.baseInfo.id) })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.fetchLog(
        this.getLogMessages('DEL', '/customerOrder/spCutSampleApply/delete', 'customerOrder'),
        { id: this.orderData.baseInfo.id },
        JSON.stringify({
          beforeText: `在'客户订单-寄板单'删除一条记录`,
          beforeCode: { id: this.orderData.baseInfo.id }
        })
      )
      this.$router.push('/customer-order/board-application')
    },
    // 保存
    saveClick() {
      this.getOrderRequest()
    },
    PickUpInformation(clickType = false) { // 获取订单信息
      this.Picrelease = true
      // const pum = []
      const basicParams = this.$utils.deepClone(this.allOrderIndexData) || ''
      // // 附件信息和质量要求需要做特殊处理
      // basicParams = this.SpecialTreatment(basicParams)
      // if (this.isCopy) {
      //   delete basicParams.baseInfo.id
      //   delete basicParams.baseInfo.status
      //   delete basicParams.baseInfo.demandCode
      //   delete basicParams.baseInfo.demandSource
      //   delete basicParams.baseInfo.id
      // }
      // if (this.$route.params.uuid && !this.isCopy) {
      //   basicParams.baseInfo.id = this.orderData.baseInfo.id
      //   basicParams.baseInfo.code = this.orderData.baseInfo.code
      //   basicParams.baseInfo.version = this.orderData.baseInfo.version
      //   basicParams.baseInfo['_rule'] = this.orderData.baseInfo['_rule']
      // }
      // if (pum.length) { // 产品信息
      //   this.$message({ type: 'error', message: pum[0] })
      //   this.Picrelease = false
      // }
      return basicParams
    },
    // 提交样板订单
    async submitPrint() { // 基本信息
      if (this.getrule && Object.keys(this.getrule).length) {
        this.$message({ type: 'error', message: '字段加密不能提交' })
        return false
      }
      const basicParams = this.SubmitRequired()
      if (basicParams) {
        const res = await orderSubmit(basicParams)
        if (res.code !== 200) { return false }
        this.$message({ type: 'success', message: '提交成功!' })
        this.GoBackOrder()
      }
    },
    // 订单信息保存接口
    async getOrderRequest(clickType = false) {
      const basicParams = this.PickUpInformation(clickType)
      if (!this.Picrelease) { return false }
      if (this.$route.params.uuid && !this.isCopy) {
        const res = await orderModify(basicParams)
        if (res.code !== 200) { return false }
        this.$message({ type: 'success', message: '修改成功!' })
        const { beforeCode, afterCode } = this.compareData(this.copyDetailData, { ...basicParams, id: this.$route.params.uuid }, 'id')
        const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
        flag && this.fetchLog(
          this.getLogMessages('UPDATE', '/customerOrder/spCutSampleApply/modify', 'customerOrder'),
          { ...basicParams, id: this.$route.params.uuid },
          JSON.stringify({
            beforeText: `在'客户订单-寄板单'将${JSON.stringify({ 'id': this.$route.params.uuid })}`,
            afterText: '修改为',
            ...{ beforeCode, afterCode }
          })
        )
        this.isEdit = false
        await this.getDetailData(this.$route.params.uuid)
        this.$nextTick(() => {
          this.$route.params && this.$route.params.uuid && this.$router.push({ path: `/customer-order/board-application/detail/${this.$route.params.uuid}/show` })
        })
      } else {
        const res = await orderAdd(basicParams)
        if (res.code !== 200) { return false }
        this.$message({ type: 'success', message: '新增成功!' })
        this.fetchLog(
          this.getLogMessages('INSERT', '/customerOrder/spCutSampleApply/add', 'customerOrder'),
          { data: basicParams },
          JSON.stringify({ beforeText: `在'客户订单-寄板单'新增一条记录`, beforeCode: basicParams })
        )
        // this.getDetailData(res.data)
        this.$router.push({ path: `/customer-order/board-application/detail/${res.data}/show` })
      }
    },
    SpecialTreatment(data) {
      const dataTim = data.baseInfo
      if ((dataTim.demandSource && dataTim.demandCode) || dataTim.isFromCrm) { // 附件信息格式处理
        const som = dataTim.attachment
        dataTim.fileUrl = som && som.length ? JSON.stringify(som) : null
        dataTim.attachment = null
      } else {
        dataTim.attachment = this.setUploadData(dataTim, 'attachment')
        dataTim.fileUrl = null
      }
      return data
    },
    // 复制样板订单
    async copyPrint() {
      const res = await gueCopyInfo({ id: Number(this.orderData.baseInfo.id) })
      if (res.code !== 200) { return false }
      this.infoDaTA(res)
      this.isCopy = true
      this.orderData.baseInfo.demandSource = ''
      this.orderData.baseInfo.demandCode = ''
      this.orderData.baseInfo.code = ''
      this.isEdit = true
      this.orderIndexData = this.$utils.deepClone(this.orderData) // 接口请求慢 赋值不正确
    },
    // 订单审核
    async ToExamine() {
      this.config.workflowId = this.orderData.baseInfo.uuid // 订单uuid
      this.config.procInstId = this.orderData.baseInfo.procInstId || '' // 流程实例id
      this.config.visible = true
    },
    // 完结
    async ClickFinish() {
      const dataId = this.orderData.baseInfo
      const res = await orderFinish({ id: dataId.id })
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
      const dataId = this.orderData.baseInfo
      const res = await orderRemoveHold({ id: dataId.id })
      if (res.code !== 200) { return false }
      this.$message({ type: 'success', message: '解hold成功!' })
      this.isEdit = false
      this.GoBackOrder()
    },
    // 撤回
    async Withdraw() {
      const dataId = this.orderData.baseInfo.id
      const ruID = this.$route.params.uuid
      const res = await orderWithdrawt({ id: Number(dataId) })
      if (res.code !== 200) { return false }
      this.$message({ type: 'success', message: '撤回成功!' })
      this.isEdit = false
      this.getDetailData(ruID)
    },
    // 取消
    async CallOff() {
      const dataId = this.orderData.baseInfo
      const sm = this.setOrderStatus(dataId.status)
      let IndexOne = 2
      if (sm.text === '已驳回') { IndexOne = 2 } else if (sm.text === '进行中') { IndexOne = 3 }
      const res = await orderCancel({ id: dataId.id, 'type': IndexOne, 'cancelReason': this.cancelReason })
      if (res.code !== 200) { return false }
      this.$message({ type: 'success', message: '取消成功!' })
      this.isEdit = false
      this.GoBackOrder()
    },
    // 变更弹窗出现
    async Alteration() {
      const dataId = this.orderData.baseInfo
      if (dataId._rule && Object.keys(dataId._rule).length) {
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
          basicParams.baseInfo.changeReason = val.text.remark
          basicParams.baseInfo.newId = basicParams.baseInfo.id
          const res = await orderChange(basicParams)
          if (res.code !== 200) { return false }
          this.$message({ type: 'success', message: '变更成功!' })
          this.GoBackOrder()
        }
      } else if (val.title === '取消原因') {
        this.cancelReason = val.text.remark
        this.CallOff()
      } else if (val.title === 'Hold单原因') {
        const dataId = this.orderData.baseInfo
        const res = await orderHold({ id: dataId.id, 'holdReason': val.text.remark })
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
      this.$router.push('/customer-order/board-application')
    },
    // 文件字符串化
    setUploadData(data, im) {
      if (data) {
        if (data[im] && isArray(data[im])) {
          let attachStr = ''
          data[im].forEach((item) => {
            if (item.response && item.response.data) {
              attachStr = attachStr + item.response.data.id + ','
            } else if (item.id) {
              attachStr = attachStr + item.id + ','
            }
          })
          return attachStr.substring(0, attachStr.lastIndexOf(','))
        }
      } else { return '' }
    }
  }
}
</script>

<style lang="scss">
.sampleYans-detail {
  padding-bottom: 60px;
  margin-top: 20px;
  .inputWidth {
    width: 60% !important;
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
