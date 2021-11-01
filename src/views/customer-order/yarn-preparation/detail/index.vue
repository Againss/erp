
<!--
 * @Author: xj
 * @Description: 备纱单新增
 * @Date: 2021-04-26 09:06:20
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-06-24 18:54:48
 * @FilePath: d:\ysxg\src\views\customer-order\yarn-preparation\detail\index.vue
-->
<template>
  <div class="sampleYans-detail" :class="isEdit ? '' : 'rules-disable'">
    <!-- 头部状态 -->
    <template v-if="this.$route.params.id">
      <!--      <promptText :order-data="orderData" />-->
      <status-bar :order-data="orderData.baseInfo" />
    </template>
    <div class="tab-change">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label=" 订单要求 " name="0" />
      </el-tabs>
      <div class="requirement-info">
        <span style="margin-right: 26px">需求来源：{{ orderData.baseInfo&&orderData.baseInfo.demandSource || '-' }}</span>
        <span>需求单号：{{ orderData.baseInfo&&orderData.baseInfo.demandCode || '-' }}</span>
      </div>
    </div>
    <div v-show="activeName === '0'" class="order-request">
      <order-index
        ref="OrderRequest"
        :current-version-change="currentVersionChange"
        :sync-data-handle="syncDataHandle"
        :order-data="orderIndexData"
        :is-edit="isEdit"
        :is-copy="isCopy"
      />
    </div>
    <!-- 底部按钮 -->
    <div :class="{ 'fixed-footer': !sidebar }" class="button-group">
      <!-- 草稿 -->
      <div v-if="!isEdit && getStat === '0'">
        <el-button
          v-permission="['customerOrder:yarnOrder:modify']"
          type="primary"
          @click="setEdit"
        >编辑</el-button>
        <el-button
          v-permission="['customerOrder:yarnOrder:submit']"
          @click="submitPrint"
        >提交</el-button>
        <el-button
          v-permission="['customerOrder:yarnOrder:copy']"
          @click="copyPrint"
        >复制</el-button>
        <el-button
          v-permission="['customerOrder:yarnOrder:delete']"
          @click="deleteClick"
        >删除</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 已驳回 -->
      <div v-if="!isEdit && getStat === '4'">
        <el-button
          v-permission="['customerOrder:yarnOrder:modify']"
          type="primary"
          @click="setEdit"
        >编辑</el-button>
        <el-button
          v-permission="['customerOrder:yarnOrder:copy']"
          @click="copyPrint"
        >复制</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!--待审核-->
      <div v-if="!isEdit && getStat === '1'">
        <el-button
          v-permission="['customerOrder:yarnOrder:audit']"
          type="primary"
          @click="ToExamine"
        >审核</el-button>
        <el-button
          v-permission="['customerOrder:yarnOrder:withdraw']"
          @click="Withdraw"
        >撤回</el-button>
        <el-button
          v-permission="['customerOrder:yarnOrder:copy']"
          @click="copyPrint"
        >复制</el-button>
        <el-button
          v-permission="['customerOrder:yarnOrder:cancel']"
          @click="CallOff"
        >取消</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 进行中-Hold单待审 -->
      <div v-if="!isEdit && getStat === '10'">
        <el-button
          v-permission="['customerOrder:yarnOrder:audit']"
          type="primary"
          @click="ToExamine"
        >审核</el-button>
        <el-button
          v-permission="['customerOrder:yarnOrder:copy']"
          @click="copyPrint"
        >复制</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 进行中-取消待审 -->
      <div v-if="!isEdit && getStat === '5'">
        <el-button
          v-permission="['customerOrder:yarnOrder:audit']"
          type="primary"
          @click="ToExamine"
        >审核</el-button>
        <el-button
          v-permission="['customerOrder:yarnOrder:copy']"
          @click="copyPrint"
        >复制</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 进行中-变更待审-->
      <div v-if="!isEdit && getStat === '8'">
        <el-button
          v-permission="['customerOrder:yarnOrder:audit']"
          type="primary"
          @click="ToExamine"
        >审核</el-button>
        <el-button
          v-permission="['customerOrder:yarnOrder:copy']"
          @click="copyPrint"
        >复制</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 进行中-已审核-->
      <div v-if="!isEdit && getStat === '2'">
        <el-button
          v-permission="['customerOrder:yarnOrder:change']"
          type="primary"
          @click="setEdit"
        >变更</el-button>
        <el-button
          v-permission="['customerOrder:yarnOrder:finish']"
          @click="ClickFinish"
        >完结</el-button>
        <el-button
          v-permission="['customerOrder:yarnOrder:copy']"
          @click="copyPrint"
        >复制</el-button>
        <el-button
          v-permission="['customerOrder:yarnOrder:hold']"
          @click="ClickHold"
        >Hold单</el-button>
        <el-button
          v-permission="['customerOrder:yarnOrder:cancel']"
          @click="setCallOff"
        >取消</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 进行中-Hold单"-->
      <div v-if="!isEdit && getStat === '12'">
        <el-button
          v-permission="['customerOrder:yarnOrder:removeHold']"
          type="primary"
          @click="solveHold"
        >解Hold</el-button>
        <el-button
          v-permission="['customerOrder:yarnOrder:copy']"
          @click="copyPrint"
        >复制</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 进行中-会签 -->
      <div v-if="!isEdit &&(getStat === '11' || getStat === '9' || getStat === '6')">
        <el-button
          v-permission="['customerOrder:yarnOrder:copy']"
          type="primary"
          @click="copyPrint"
        >复制</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 已完结 已取消-->
      <div v-if="!isEdit && (getStat === '7' || getStat === '13')">
        <el-button
          v-permission="['customerOrder:yarnOrder:copy']"
          type="primary"
          @click="copyPrint"
        >复制</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 新建 -->
      <div
        v-if="isEdit && !statusEdit && getStat !== '4'"
        class="statusEdit2"
      >
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="saveClick">保存</el-button>
      </div>
      <div
        v-if="isEdit && !statusEdit && getStat === '4'"
        class="statusEdit2"
      >
        <el-button @click="cancelClick">取消</el-button>
        <el-button v-if="isCopy" @click="saveClick">保存</el-button>
        <el-button
          v-if="!isCopy"
          type="primary"
          @click="submitPrint"
        >提交</el-button>
      </div>
      <!--待提交-已驳回 进行中-已审核-->
      <div v-if="isEdit && statusEdit" class="statusEdit">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="Alteration">提交</el-button>
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
import { setOrderFun } from '@/views/customer-order/public/api/mou'
import {
  orderAdd, orderModify, getDetail, orderDelete, fileListArray, gueCopyInfo, orderSubmit, orderFinish,
  orderChange, orderRemoveHold, orderWithdrawt, orderCancel, orderHold, guestneedDetail } from './api/index'
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
      activeName: '0',
      isEdit: true,
      orderData: {},
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
      currentVersion: '',
      Picrelease: false,
      baseInfoData: {}, // 备纱单主表信息
      materialInfoArray: []// 原料信息
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
    currentVersion: {
      handler(val) { // 掉版本变更接口
        val && this.getDetailData(val)
      }
    },
    orderData: {
      handler(val, oldVal) { },
      deep: true
    }
  },
  created() {
    if (this.$route.params.id) {
      this.getDetailData(this.$route.params.id)
      if (this.$route.query.statusIndex) { this.setEdit() }// 变更
    }
    if (this.$route.params.id) {
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
    if (this.$route.query.requireId) {
      // 从客户需求列表那边跳转过来，若不存在草稿新建部分数据从需求列表详情那边带过来
      this.needDetail({ id: this.$route.query.requireId })
    }
  },
  methods: {
    // 需求列表详情
    async needDetail(data = {}) {
      // 从列表里季度取对象
      this.getOptionConfig({ pageName: '备纱单', fieldName: '销售季度' }).then(async qres => {
        const res = await guestneedDetail({ ...data })
        const needData = res.data || {}
        const quarterMap = {
          // 字段映射，由于CRM与erp后端的字段不统一
          Spr: 'Spring',
          Sum: 'Summer',
          Fall: 'Fall',
          Winter: 'Winter',
          middle: 'middle'
        }
        if (qres && qres.length) {
          for (let i = 0; i < qres.length; i++) {
            if (qres[i].label === needData.quarter) {
              needData.quarter = qres[i]
            }
          }
        }
        if (needData.quarter && needData.quarter.label) {
          console.log(needData.quarter)
        } else {
          const quarters = qres.filter(n => n.label === quarterMap[needData.quarter])
          needData.quarter = quarters[0] || ''
        }

        const brand = { value: this.setlabel(needData.brandId), label: this.setlabel(needData.brandName, 2) }
        const customer = { value: this.setlabel(needData.customerId), label: this.setlabel(needData.customerName, 2) }
        const seller = { value: this.setlabel(needData.sellerId, 2), label: this.setlabel(needData.sellerName, 2) }
        const sellerTeam = { value: this.setlabel(needData.sellerTeamId), label: this.setlabel(needData.sellerTeamName, 2) }
        const year = needData.year
        const quarter = needData.quarter || '' // 销售季度
        const isSettlement = needData.settlement
        const demandSource = needData.requireFrom // 需求来源
        const demandCode = needData.customerRequireId// 需求单号
        const currency = { value: this.setlabel(needData.currencyId), label: this.setlabel(needData.currency) }
        const pricingTerm = { value: this.setlabel(needData.priceTerm), label: this.setlabel(needData.priceTermName) }
        const paymentTerm = { value: this.setlabel(needData.payCondition), label: this.setlabel(needData.payConditionName) }
        this.orderData = {
          baseInfo: {
            brand, customer, seller, year, quarter, isSettlement,
            currency, pricingTerm, paymentTerm, demandCode, demandSource, sellerTeam
          }
        }
        if (needData.filePath) {
          needData.filePath = needData.filePath.split(',')
          this.clothFlie(needData.filePath)
        }
        this.orderIndexData = this.$utils.deepClone(this.orderData)
      })
    },
    setlabel(data, type = 1) {
      return type === 1 ? (data ? data + '' : '') : (data || '')
    },
    currentVersionChange(currentVersion) {
      this.currentVersion = currentVersion
    },
    syncDataHandle(key, data) { // 保存组装数据
      if (key === 'orderIndexData') {
        // console.log('保存组装数据', data)
        this.allOrderIndexData = data
      }
    },
    handleClick() { },
    // 获取详情数据
    async getDetailData(id) {
      this.statusEdit = false
      this.isCopy = false
      await this.getOptionConfig({ pageName: '备纱单', fieldName: '销售季度' }).then(async qres => {
        const res = await getDetail({ 'id': id })
        if (qres && qres.length && res.data && res.data.baseInfo && res.data.baseInfo.quarter) {
          for (let i = 0; i < qres.length; i++) {
            if (qres[i].label === res.data.baseInfo.quarter.label) {
              res.data.baseInfo.quarter = qres[i]
            }
          }
          const quarterMap = {
            // 字段映射，由于CRM与erp后端的字段不统一
            Spr: 'Spring',
            Sum: 'Summer',
            Fall: 'Fall',
            Winter: 'Winter',
            middle: 'middle'
          }
          if (res.data.baseInfo.quarter && res.data.baseInfo.quarter.label) {
            console.log(res.data.baseInfo.quarter)
          } else {
            const quarters = qres.filter(n => n.label === quarterMap[res.data.baseInfo.quarter])
            res.data.baseInfo.quarter = quarters[0] || ''
          }
        }

        if (res.code !== 200) { return false }
        this.infoDaTA(res)
      })
    },
    // 详情数据 统一处理
    async infoDaTA(res) {
      const dataTim = Object.assign({}, res.data) || {}
      this.copyDetailData = JSON.parse(JSON.stringify(dataTim))
      dataTim.baseInfo.brand = this.setValue('brand', dataTim) // 品牌商
      dataTim.baseInfo.customer = this.setValue('customer', dataTim) // 客户
      dataTim.baseInfo.sellerTeam = this.setValue('sellerTeam', dataTim)// 销售团队
      dataTim.baseInfo.seller = this.setValue('seller', dataTim) // 销售员
      dataTim.baseInfo.customerService = this.setValue('customerService', dataTim) // 客服
      dataTim.materialInfo = dataTim.materialInfo || []
      this.orderData = dataTim
      await this.setDetailData(dataTim)
      this.orderIndexData = this.$utils.deepClone(this.orderData) // 接口请求慢 赋值不正确
    },
    setValue(typeIndex, datas) {
      const data = JSON.parse(JSON.stringify(datas))
      const dataTim = data.baseInfo
      if (dataTim[typeIndex] && dataTim[typeIndex].value) {
        dataTim[typeIndex].value = dataTim[typeIndex].value !== null ? dataTim[typeIndex].value : ''
      } else {
        dataTim[typeIndex] = ''
      }
      return dataTim[typeIndex]
    },
    setDetailData(dataTim) {
      const data = this.$utils.deepClone(dataTim)
      const com = data.baseInfo
      if ((com.demandSource && com.demandCode) || com.isFromCrm) {
        if (com.fileUrl && JSON.parse(com.fileUrl) && isArray(JSON.parse(com.fileUrl))) {
          com.attachment = JSON.parse(com.fileUrl)
        } else {
          com.attachment = null
        }
        this.orderData = data
      } else {
        this.fileArrSplit()
      }
    },
    // 客户订单
    async clothFlie(ids) {
      const res = await fileListArray({ 'ids': ids })
      if (res.code !== 200) { return false }
      const resData = res.data
      let fileArr = []
      if (resData && resData.list.length) {
        fileArr = resData.list.map((item) => {
          return {
            text: '附件',
            id: item.id,
            comType: 'order',
            name: item.originalName,
            url: item.viewUrl || item.url || ''
          }
        })
      }
      const om = JSON.parse(JSON.stringify(this.orderData))
      om.baseInfo.attachment = fileArr
      this.orderData = om
      this.orderIndexData = this.$utils.deepClone(this.orderData)
    },
    // 附件上传切割
    fileArrSplit() {
      if (this.orderData.baseInfo && this.orderData.baseInfo.attachment) {
        const StyleFile = this.orderData.baseInfo.attachment && this.orderData.baseInfo.attachment.split(',')
        if (StyleFile) { this.clothFlie(StyleFile) }
      }
    },
    // 编辑
    setEdit() {
      this.isEdit = true
      const ruID = this.$route.params.id
      const orcom = this.orderData.baseInfo
      if ((ruID && (orcom && orcom.status === '2')) || (ruID && (this.$route.query.statusIndex === '2'))) {
        this.statusEdit = true
      }
    },
    SubmitForVerification() { // 提交验证
      const allOrder = this.allOrderIndexData.baseInfo
      const alInfo = this.allOrderIndexData.materialInfo
      let isrelease = true
      const pu = []
      if (!allOrder.customer || !this.setInfoValue(allOrder.customer)) {
        pu.push('客户不能为空')
      } else if (!allOrder.sellerTeam || !this.setInfoValue(allOrder.sellerTeam)) {
        pu.push('销售团队不能为空')
      } else if (!allOrder.seller || !this.setInfoValue(allOrder.seller)) {
        pu.push('销售员不能为空')
      } else if (!allOrder.customerService || !this.setInfoValue(allOrder.customerService)) {
        pu.push('客服不能为空')
      } else if (!allOrder.year || allOrder.year === null) {
        pu.push('销售年度不能为空')
      } else if (!allOrder.quarter || !this.setInfoValue(allOrder.quarter)) {
        pu.push('销售季度不能为空')
      } else if (!alInfo || !alInfo.length) {
        pu.push('原料信息不能为空')
      }
      if (pu.length) {
        this.$message({ type: 'error', message: pu[0] })
        isrelease = false
        return false
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
      if ((this.$route.params.id && this.$route.path.includes('edit')) || !this.$route.params.id) {
        that.GoBackOrder()
      }
      if ((this.$route.params.id && this.$route.path.includes('show')) || this.isCopy || this.$route.params.id) {
        this.getDetailData(this.$route.params.id)
      }
    },
    // 删除样板订单
    async deleteClick() {
      this.$confirm('确认删除该备纱订单？', '提示', {
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
      const res = await orderDelete({ id: this.orderData.baseInfo.orderId })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.fetchLog(
        this.getLogMessages('DEL', '/customerOrder/coYarnOrder/delete', 'customerOrder'),
        { id: this.orderData.baseInfo.orderId },
        JSON.stringify({
          beforeText: `在'客户订单-备纱单'删除一条记录`,
          beforeCode: { id: this.orderData.baseInfo.orderId }
        })
      )
      this.$router.push('/customer-order/yarn-preparation')
    },
    // 保存
    saveClick() {
      this.getOrderRequest()
    },
    PickUpInformation(clickType = false) { // 获取订单信息
      this.Picrelease = true
      const pum = []
      let basicParams = this.$utils.deepClone(this.allOrderIndexData) || ''
      // 附件信息和质量要求需要做特殊处理
      basicParams = this.SpecialTreatment(basicParams)
      if (this.isCopy) {
        delete basicParams.baseInfo.orderId
        delete basicParams.baseInfo.status
        delete basicParams.baseInfo.demandCode
        delete basicParams.baseInfo.demandSource
        delete basicParams.baseInfo.id
      }
      if (this.$route.params.id && !this.isCopy) {
        basicParams.baseInfo.id = this.orderData.baseInfo.id
        basicParams.baseInfo.code = this.orderData.baseInfo.code
        basicParams.baseInfo.version = this.orderData.baseInfo.version
        basicParams.baseInfo['_rule'] = this.orderData.baseInfo['_rule']
      }
      if (pum.length) { // 产品信息
        this.$message({ type: 'error', message: pum[0] })
        this.Picrelease = false
      }
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
      if (this.$route.params.id && !this.isCopy) {
        const res = await orderModify(basicParams)
        if (res.code !== 200) { return false }
        this.$message({ type: 'success', message: '修改成功!' })
        const { beforeCode, afterCode } = this.compareData(this.copyDetailData, { ...basicParams, id: this.$route.params.id }, 'id')
        const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
        flag && this.fetchLog(
          this.getLogMessages('UPDATE', '/customerOrder/coYarnOrder/modify', 'customerOrder'),
          { ...basicParams, id: this.$route.params.id },
          JSON.stringify({
            beforeText: `在'客户订单-备纱单'将${JSON.stringify({ 'id': this.$route.params.id })}`,
            afterText: '修改为',
            ...{ beforeCode, afterCode }
          })
        )
        this.isEdit = false
        await this.getDetailData(this.$route.params.id)
        this.$nextTick(() => {
          console.log('99')
          this.$route.params && this.$route.params.id && this.$router.push({ path: `/customer-order/yarn-preparation/detail/${this.$route.params.id}/show` })
        })
      } else {
        if (basicParams && basicParams.baseInfo.demandSource && basicParams.baseInfo.demandCode) {
          basicParams.baseInfo.isFromCrm = '1'
        }
        const res = await orderAdd(basicParams)
        if (res.code !== 200) { return false }
        this.$message({ type: 'success', message: '新增成功!' })
        this.fetchLog(
          this.getLogMessages('INSERT', '/customerOrder/coYarnOrder/add', 'customerOrder'),
          { data: basicParams },
          JSON.stringify({ beforeText: `在'客户订单-备纱单'新增一条记录`, beforeCode: basicParams })
        )
        this.$nextTick(() => {
          this.$router.push({ path: `/customer-order/yarn-preparation/detail/${res.data}/show` })
        })
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
      const res = await gueCopyInfo({ 'id': this.orderData.baseInfo.orderId })
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
      this.config.workflowId = this.orderData.baseInfo.orderId // 订单id
      this.config.procInstId = this.orderData.baseInfo.procInstId || '' // 流程实例id
      this.config.visible = true
    },
    // 完结
    async ClickFinish() {
      const dataId = this.orderData.baseInfo
      const res = await orderFinish({ 'orderId': dataId.orderId })
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
      const res = await orderRemoveHold({ 'orderId': dataId.orderId })
      if (res.code !== 200) { return false }
      this.$message({ type: 'success', message: '解hold成功!' })
      this.isEdit = false
      this.GoBackOrder()
    },
    // 撤回
    async Withdraw() {
      const dataId = this.orderData.baseInfo.orderId
      const ruID = this.$route.params.id
      const res = await orderWithdrawt({ 'orderId': dataId })
      if (res.code !== 200) { return false }
      this.$message({ type: 'success', message: '撤回成功!' })
      this.isEdit = false
      this.getDetailData(ruID)
    },
    // 取消
    async CallOff() {
      const dataId = this.orderData.baseInfo
      const sm = this.setOrderStatus(dataId.status)
      let IndexOne = 0
      if (sm.text === '待审核') { IndexOne = 0 } else if (sm.text === '已审核') { IndexOne = 1 }
      const res = await orderCancel({ 'orderId': dataId.orderId, 'type': IndexOne, 'cancelReason': this.cancelReason })
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
          basicParams.baseInfo.newId = basicParams.baseInfo.orderId
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
        const res = await orderHold({ 'orderId': dataId.orderId, 'holdReason': val.text.remark })
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
      this.$router.push('/customer-order/yarn-preparation')
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
.rules-disable{
  .el-form-item.el-form-item--small{
    margin-bottom: 0 !important;
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
