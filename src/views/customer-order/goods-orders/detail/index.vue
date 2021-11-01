<template>
  <div class="sample-detail" :class="isEdit ? '' : 'rules-disable'">
    <!-- 头部状态 -->
    <template v-if="this.$route.params.id&&!isCopy">
      <!--      <promptText :order-data="orderData" />-->
      <status-bar :order-data="orderData" />
    </template>
    <div class="tab-change">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label=" 订单要求 " name="0" />
        <el-tab-pane label=" 附加信息 " name="2" />
        <el-tab-pane label=" 质量要求 " name="1" />
        <el-tab-pane label=" 库存抽用 " name="3" />
        <!-- <el-tab-pane label=" 更改记录 " name="3" /> -->
      </el-tabs>
      <div class="requirement-info">
        <span
          style="margin-right: 26px"
        >需求来源：{{ orderData.demandSource || '-' }}</span>
        <span>需求单号：{{ orderData.demandCode || '-' }}</span>
      </div>
    </div>
    <div v-show="activeName === '0'" class="order-request">
      <order-index
        ref="OrderRequest"
        :current-version-change="currentVersionChange"
        :sync-data-handle="syncDataHandle"
        :order-data="orderIndexData"
        :is-edit="isEdit"
      />
    </div>
    <!-- 质量要求 -->
    <div v-show="activeName === '1'" class="order-request">
      <orderquality
        ref="OrderQuality"
        :brand="brand"
        :clothing-type="clothingType"
        :sync-data-handle="syncDataHandle"
        :set-parent-data-handle="setParentDataHandle"
        :order-data="orderData"
        :is-edit="isEdit"
      />
    </div>
    <!-- 附加信息 -->
    <div v-show="activeName === '2'" class="order-request">
      <additiona
        ref="OrderInformation"
        :market-type="marketType"
        :sync-data-handle="syncDataHandle"
        :order-data="orderData"
        :is-edit="isEdit"
      />
    </div>
    <!-- 库存抽用 -->
    <div v-show="activeName === '3'" class="order-request">
      <stockPumping
        ref="OrderStock"
        :sync-data-handle="syncDataHandle"
        :order-data="orderData"
        :is-edit="isEdit"
      />
    </div>
    <!-- 底部按钮 -->
    <div :class="{ 'fixed-footer': !sidebar }" class="button-group">
      <!-- 草稿 -->
      <div v-if="!isEdit && orderData.status === '0'">
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:modify']"
          type="primary"
          @click="setEdit"
        >编辑</el-button>
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:submit']"
          @click="submitPrint"
        >提交</el-button>
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:copy']"
          @click="copyPrint"
        >复制</el-button>
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:delete']"
          @click="deleteClick"
        >删除</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 已驳回 -->
      <div v-if="!isEdit && orderData.status === '4'">
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:modify']"
          type="primary"
          @click="setEdit"
        >编辑</el-button>
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:copy']"
          @click="copyPrint"
        >复制</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!--待审核-->
      <div v-if="!isEdit && orderData.status === '1'">
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:audit']"
          type="primary"
          @click="ToExamine"
        >审核</el-button>
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:withdraw']"
          @click="Withdraw"
        >撤回</el-button>
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:copy']"
          @click="copyPrint"
        >复制</el-button>
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:cancel']"
          @click="CallOff"
        >取消</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 进行中-Hold单待审 -->
      <div v-if="!isEdit && orderData.status === '10'">
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:audit']"
          type="primary"
          @click="ToExamine"
        >审核</el-button>
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:copy']"
          @click="copyPrint"
        >复制</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 进行中-取消待审 -->
      <div v-if="!isEdit && orderData.status === '5'">
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:audit']"
          type="primary"
          @click="ToExamine"
        >审核</el-button>
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:copy']"
          @click="copyPrint"
        >复制</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 进行中-变更待审-->
      <div v-if="!isEdit && orderData.status === '8'">
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:audit']"
          type="primary"
          @click="ToExamine"
        >审核</el-button>
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:copy']"
          @click="copyPrint"
        >复制</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 进行中-已审核-->
      <div v-if="!isEdit && orderData.status === '2'">
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:change']"
          type="primary"
          @click="setEdit"
        >变更</el-button>
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:finish']"
          @click="ClickFinish"
        >完结</el-button>
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:copy']"
          @click="copyPrint"
        >复制</el-button>
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:hold']"
          @click="ClickHold"
        >Hold单</el-button>
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:cancel']"
          @click="setCallOff"
        >取消</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 进行中-Hold单"-->
      <div v-if="!isEdit && orderData.status === '12'">
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:removeHold']"
          type="primary"
          @click="solveHold"
        >解Hold</el-button>
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:copy']"
          @click="copyPrint"
        >复制</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 进行中-会签 -->
      <div
        v-if="
          !isEdit &&
            (orderData.status === '11' ||
            orderData.status === '9' ||
            orderData.status === '6')
        "
      >
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:copy']"
          type="primary"
          @click="copyPrint"
        >复制</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 已完结 已取消-->
      <div
        v-if="
          !isEdit && (orderData.status === '7' || orderData.status === '13')
        "
      >
        <el-button
          v-permission="['customerOrder:modelDevelopOrder:copy']"
          type="primary"
          @click="copyPrint"
        >复制</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 新建 -->
      <div
        v-if="isEdit && !statusEdit && orderData.status !== '4'"
        class="statusEdit2"
      >
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="saveClick">保存</el-button>
      </div>
      <div
        v-if="isEdit && !statusEdit && orderData.status === '4'"
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
import orderquality from './compoments/qualityRequirement'
import additiona from './compoments/additionaInformation'
import stockPumping from './compoments/stockPumpingInfo'
import logMethods from '@/views/product-center/mixin/log-methods'
import {
  orderAdd, getDetail, fileListArray, orderModify, orderDelete, orderChange, orderHold,
  orderWithdrawt, orderCancel, orderFinish, orderRemoveHold, orderSubmit, guestneedDetail, gueCopyInfo
} from './api/index'
import approve from '@/components/approve/index'
import upinformation from './compoments/pups'
import { PublicCustomer } from '@/views/customer-order/public/index'
import { isArray } from '@/utils/validate'
// import promptText from './compoments/prompt-text'
import statusBar from './compoments/status-bar'
import { setOrderFun } from '@/views/customer-order/public/api/mou'
export default {
  components: {
    orderIndex,
    orderquality,
    additiona,
    stockPumping,
    approve,
    upinformation,
    statusBar
    // promptText
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
      isCopy: false,
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
      garmentFactoryList: [], // 制衣厂数据
      quality: {}, // 质量要求和
      stockPumpingInfo: {}, // 库存抽用页签数据
      marketType: {}, // 市场类型
      brand: {}, // 品牌
      clothingType: {} // 成衣类型
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar.opened
    }
  },
  watch: {
    currentVersion: {
      handler(val) { // 掉版本变更接口
        val && this.getDetailData(val)
      }
    }
  },
  created() {
    if (this.$route.params.id) {
      this.getDetailData(this.$route.params.id)
      if (this.$route.query.statusIndex) { // 变更
        this.setEdit()
      }
    }
    if (this.$route.query.requireId) {
      // 从客户需求列表那边跳转过来，若不存在草稿新建部分数据从需求列表详情那边带过来
      this.getAllQuarter()
      this.getOptionConfigSelect()
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
    currentVersionChange(currentVersion) {
      this.currentVersion = currentVersion
    },
    syncDataHandle(key, data) {
      if (key === 'orderIndexData') {
        this.marketType = data.marketType || {}
        this.brand = data.brand || ''
        this.allOrderIndexData = data
      } else if (key === 'additionalnformation') {
        this.extraInfo = { ...this.extraInfo, ...data }
        this.clothingType = this.extraInfo.clothingType || ''
      } else if (key === 'garmentFactory') {
        console.log(data)
        this.garmentFactoryList = data // 制衣厂
      } else if (key === 'qualityRequirement_baseData') { // 对色
        this.quality.colorStandard = data
      } else if (key === 'qualityRequirement_batchColor') { // 批色要求
        this.quality.batchColorRequirements = data
      } else if (key === 'qualityRequirement_Inspection') { // QC验货
        this.quality.qcInspection = data
      } else if (key === 'qualityRequirement_testItems') { // 测试要求
        this.quality.qaTestItems = data
      } else if (key === 'stockPumping') { // 库存抽用
        this.stockPumpingInfo = data
      }
      // console.log("pm2", this.allOrderIndexData)
    },
    setParentDataHandle(key, data) {
      if (key === 'testRemark') {
        this.quality.qcInspection = { ...this.quality.qcInspection, ...data }
      }
    },
    handleClick() { },
    // 获取详情数据
    async getDetailData(id) {
      this.statusEdit = false
      this.isCopy = false
      const res = await getDetail({ 'orderId': id })
      if (res.code !== 200) { return false }
      this.infoDaTA(res)
    },
    // 详情数据 统一处理
    infoDaTA(res) {
      const dataTim = Object.assign({}, res.data) || {}
      this.orderData = dataTim
      this.copyDetailData = JSON.parse(JSON.stringify(this.orderData))
      dataTim.orderType = this.setValue('orderType')// 订单类型
      dataTim.brand = this.setValue('brand') // 品牌商
      this.brand = this.setValue('brand') // 品牌商
      dataTim.customer = this.setValue('customer') // 客户
      dataTim.garmentFactory = this.setValue('garmentFactory')// 制衣厂
      dataTim.salesTeam = this.setValue('salesTeam')// 销售团队
      dataTim.seller = this.setValue('seller') // 销售员
      dataTim.customerService = this.setValue('customerService') // 客服
      dataTim.marketType = this.setValue('marketType') // 市场类型
      dataTim.sellYear = dataTim.sellYear || '' // 销售年度
      dataTim.sellQuarter = this.setValue('sellQuarter')// 销售季度
      dataTim.isSettlement = dataTim.isSettlement || 0 // 是否结算{0=是，1=否}
      dataTim.currency = this.setValue('currency') // 币别ID
      dataTim.taxRate = dataTim.taxRate ? String(dataTim.taxRate) : '0' // 税率
      dataTim.pricingTerm = this.setValue('pricingTerm') // 价格条款
      dataTim.paymentTerm = this.setValue('paymentTerm') // 付款条件ID
      this.extraInfo = this.$utils.deepClone(dataTim.extraInfo)
      this.clothingType = this.extraInfo && this.extraInfo.clothingType && this.extraInfo.clothingType.value ? this.extraInfo.clothingType : null
      this.garmentFactoryList = dataTim.garmentFactoryList ? this.$utils.deepClone(dataTim.garmentFactoryList) : [] // 制衣厂
      this.setDetailData(dataTim)
      this.orderIndexData = this.$utils.deepClone(this.orderData)
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
    setDetailData(dataTim) {
      if ((dataTim.demandSource && dataTim.demandCode) || dataTim.isFromCrm) {
        const om = dataTim.extraInfo
        om.customerOrderFile = om.customerOrderFileUrl && JSON.parse(om.customerOrderFileUrl) || null
        om.clothingStyleFile = om.clothingStyleFileUrl && JSON.parse(om.clothingStyleFileUrl) || null
        om.otherFile = om.otherFileUrl && JSON.parse(om.otherFileUrl) || null
        this.orderData = dataTim
      } else {
        this.fileArrSplit()
      }
      const OrderQualityIndex = this.$refs.OrderQuality // 质量要求
      const OrderInformationIndex = this.$refs.OrderInformation // 附加信息
      this.$nextTick(() => {
        OrderQualityIndex && OrderQualityIndex.$refs.basicData.form.clearValidate()
        OrderQualityIndex && OrderQualityIndex.$refs.batchColor.form.clearValidate()
        OrderQualityIndex && OrderQualityIndex.$refs.Inspection.form.clearValidate()
        OrderInformationIndex && OrderInformationIndex.$refs.shipment.form.clearValidate()
        OrderInformationIndex && OrderInformationIndex.$refs.readyToWear.form.clearValidate()
      })
    },
    // 客户订单
    async clothFlie(ids) {
      const res = await fileListArray({ 'ids': ids })
      if (res.code !== 200) { return false }
      const resData = res.data
      let fileArr = []
      if (resData && resData.list.length) {
        fileArr = resData.list.map((item, index) => {
          return {
            text: '客户订单',
            id: item.id,
            comType: 'order',
            name: item.originalName,
            url: item.viewUrl || item.url || ''
          }
        })
      }
      this.orderData.extraInfo.customerOrderFile = fileArr
    },
    // 成衣款式
    async StyleFlie(ids) {
      const res = await fileListArray({ 'ids': ids })
      if (res.code !== 200) { return false }
      const resData = res.data
      let fileArr = []
      if (resData && resData.list.length) {
        fileArr = resData.list.map((item, index) => {
          return {
            text: '成衣款式',
            id: item.id,
            comType: 'order',
            name: item.originalName,
            url: item.viewUrl || item.url || ''
          }
        })
      }
      this.orderData.extraInfo.clothingStyleFile = fileArr
    },
    // 其他
    async OtherFiles(ids) {
      const res = await fileListArray({ 'ids': ids })
      if (res.code !== 200) { return false }
      const resData = res.data
      let fileArr = []
      if (resData && resData.list.length) {
        fileArr = resData.list.map((item, index) => {
          return {
            text: '其他',
            id: item.id,
            comType: 'order',
            name: item.originalName,
            url: item.viewUrl || item.url || ''
          }
        })
      }
      this.orderData.extraInfo.otherFile = fileArr || []
    },
    // 附件上传切割
    fileArrSplit() {
      // 客户订单
      if (this.orderData.extraInfo && this.orderData.extraInfo.customerOrderFile) {
        const StyleFile = this.orderData.extraInfo.customerOrderFile && this.orderData.extraInfo.customerOrderFile.split(',')
        if (StyleFile) {
          this.clothFlie(StyleFile)
        }
      } else {
        this.orderData.extraInfo.customerOrderFile = []
      }
      // 成衣款式
      if (this.orderData.extraInfo && this.orderData.extraInfo.clothingStyleFile) {
        const StyleFile = this.orderData.extraInfo.clothingStyleFile && this.orderData.extraInfo.clothingStyleFile.split(',')
        if (StyleFile) {
          this.StyleFlie(StyleFile)
        }
      } else {
        this.orderData.extraInfo.clothingStyleFile = []
      }
      // 其他
      if (this.orderData.extraInfo.otherFile) {
        const StyleFile = this.orderData.extraInfo.otherFile && this.orderData.extraInfo.otherFile.split(',')
        if (StyleFile) {
          this.OtherFiles(StyleFile)
        }
      } else {
        this.orderData.extraInfo.otherFile = []
      }
    },
    // 编辑
    setEdit() {
      this.isEdit = true
      const ruID = this.$route.params.id
      if ((ruID && (this.orderData.status === '2')) || (ruID && (this.$route.query.statusIndex === '2'))) {
        this.statusEdit = true
      }
    },
    SubmitForVerification() { // 提交验证
      const allOrder = this.GlobalSynchronization()
      const validateFieldArr2 = []
      let isrelease = true
      const pu = []
      // let isqaTestItems = false
      let isactiveName = true
      if (!allOrder.orderType || !this.setFromValue(allOrder.orderType)) {
        pu.push('订单类型不能为空')
      } else if (!allOrder.brand || !this.setFromValue(allOrder.brand)) {
        pu.push('品牌商不能为空')
      } else if (!allOrder.customer || !this.setFromValue(allOrder.customer)) {
        pu.push('客户不能为空')
      } else if (!allOrder.salesTeam || !this.setFromValue(allOrder.salesTeam)) {
        pu.push('销售团队不能为空')
      } else if (!allOrder.seller || !this.setFromValue(allOrder.seller)) {
        pu.push('销售员不能为空')
      } else if (!allOrder.customerService || !this.setFromValue(allOrder.customerService)) {
        pu.push('客服不能为空')
      } else if (!allOrder.sellYear) {
        pu.push('销售年度不能为空')
      } else if (!allOrder.marketType || !this.setFromValue(allOrder.marketType)) {
        pu.push('市场类型不能为空')
      } else if (!allOrder.sellQuarter || !this.setFromValue(allOrder.sellQuarter)) {
        pu.push('销售季度不能为空')
      } else if (!allOrder.currency || !this.setFromValue(allOrder.currency)) {
        pu.push('币别不能为空')
      } else if (!allOrder.hasOwnProperty('taxRate') || allOrder.taxRate === '' || allOrder.taxRate === null) {
        pu.push('税率不能为空')
      } else if (!allOrder.pricingTerm || !this.setFromValue(allOrder.pricingTerm)) {
        pu.push('价格条款不能为空')
      } else if (!allOrder.paymentTerm || !this.setFromValue(allOrder.paymentTerm)) {
        pu.push('付款条件不能为空')
      } else if (!allOrder.qaTestItems || !allOrder.qaTestItems.length) {
        pu.push('测试要求不能为空')
      } else if (allOrder.qaTestItems && allOrder.qaTestItems.length) {
        allOrder.qaTestItems.forEach((itc, ixc) => {
          if (!itc.testRequirements) { pu.push('测试要求不能为空') }
        })
      } else if (!allOrder.stockPumpingInfo || !allOrder.stockPumpingInfo.length) {
        pu.push('库存抽用不能为空')
      } else if (allOrder.stockPumpingInfo && allOrder.stockPumpingInfo.length) { // 库存抽用
        allOrder.stockPumpingInfo.forEach((itc, ixc) => {
          if (!itc.billNo) { pu.push('库存抽用单据-编号不能为空') }
          if (!itc.pumpingTypeInfo || !itc.pumpingTypeInfo.label) { pu.push('库存抽用抽用类型不能为空') }
        })
      }
      // 对色标准
      this.$refs.OrderQuality.$refs.basicData.form.validateField(['colorMatching', 'lstLightSource'], async(validateField3) => {
        if (validateField3 && validateField3 !== '') {
          if (isactiveName) {
            this.activeName = '1'
            isactiveName = false
          }
          validateFieldArr2.push(validateField3)
        }
      })
      // 批色要求
      this.$refs.OrderQuality.$refs.batchColor.form.validateField(['headCylinder', 'cylinderDifference'], async(validateField4) => {
        if (validateField4 && validateField4 !== '') {
          if (isactiveName) {
            this.activeName = '1'
            isactiveName = false
          }
          validateFieldArr2.push(validateField4)
        }
      })
      // QC验货
      this.$refs.OrderQuality.$refs.Inspection.form.validateField(['chabStandard', 'scoreStandard', 'checkClothLanguage', 'checkClothMethod', 'isGuestsCheck', 'isProvideReport', 'checkClothReportJson', 'assignInstitution'], async(validateField5) => {
        if (validateField5 && validateField5 !== '') {
          if (isactiveName) {
            this.activeName = '1'
            isactiveName = false
          }
          validateFieldArr2.push(validateField5)
        }
      })
      // 出货要求
      this.$refs.OrderInformation.$refs.shipment.form.validateField(['exportAgent', 'departurePort', 'transportMode', 'netOrGrossWeight', 'plasticBagType', 'plasticBagThickness', 'stickersQuantity', 'stickersPosition', 'isDirectFlight'], async(validateField6) => {
        if (validateField6 && validateField6 !== '') {
          if (isactiveName) {
            this.activeName = '2'
            isactiveName = false
          }
          validateFieldArr2.push(validateField6)
        }
      })
      // 成衣信息
      this.$refs.OrderInformation.$refs.readyToWear.form.validateField(['clothingType', 'clothingStyle', 'isClothingWashWater', 'clothingExport'], async(validateField7) => {
        if (validateField7 && validateField7 !== '') {
          if (isactiveName) {
            this.activeName = '2'
            isactiveName = false
          }
          validateFieldArr2.push(validateField7)
        }
      })

      // 测试要求
      // this.$refs.OrderQuality.$refs.testRequirements.form.validateField(['code'], async(validateField8) => {
      //   if (validateField8 && validateField8 !== '') {
      //     if (isactiveName) {
      //       this.activeName = '2'
      //       isactiveName = false
      //     }
      //     validateFieldArr2.push(validateField8)
      //   }
      // })

      const comFile = allOrder.extraInfo.customerOrderFileUrl
      if (allOrder.extraInfo && comFile) {
        if (comFile.hasOwnProperty('crmType')) {
          if (!comFile.customerOrderFileUrl) {
            if (isactiveName) {
              this.activeName = '2'
              isactiveName = false
              this.$message({ type: 'error', message: '客户订单附件不能为空' })
            }
            isrelease = false
          }
        }
      } else {
        if (!allOrder.extraInfo.customerOrderFile) {
          if (isactiveName) {
            this.activeName = '2'
            isactiveName = false
            this.$message({ type: 'error', message: '客户订单附件不能为空' })
          }
          isrelease = false
        }
      }

      if (pu.length) {
        this.$message({ type: 'error', message: pu[0] })
        isrelease = false
        return false
      } else if (validateFieldArr2.length) {
        isrelease = false
        return false
      }
      return isrelease
    },
    // 提交校 验必填
    SubmitRequired() { // 测试先 注释全部必填校验
      if (!this.SubmitForVerification()) { return false }
      const basicParams = this.PickUpInformation(true)
      const basicArray = basicParams.detail || []
      const isArr = []
      let isByshow = [] // 所有衫身集合
      let extColumn = false
      if (!basicArray.length) { isArr.push('分录不能为空') }
      basicArray && basicArray.length && basicArray.forEach((itc, ixc) => {
        if (!itc.garmentPart || (itc.garmentPart.value === null || itc.garmentPart.label === null || itc.garmentPart.label === '')) {
          isArr.push('成衣部位不能为空')
        }
        if (!itc.referenceVersionInfo || !itc.referenceVersionInfo.length) {
          isArr.push('参板信息不能为空')
        }
        if (itc.referenceVersionInfo) {
          itc.referenceVersionInfo.forEach((its, ims) => {
            if (!its.greyClothCode) {
              isArr.push('参板信息色布/印花布编码不能为空')
            } if (!its.referenceOrder || (its.referenceOrder.value === null || its.referenceOrder.label === null || its.referenceOrder.label === '')) {
              isArr.push('参板信息订单号不能为空')
            } if (!its.referenceContent || (its.referenceContent.value === null || its.referenceContent.label === null || its.referenceContent.label === '')) {
              isArr.push('参板信息参考内容不能为空')
            }
          })
        }
        if (!itc.fabricElement || !itc.fabricElement.length) {
          isArr.push(`产品序号${itc.seq}的面料成分/比例不能为空`)
        } if (itc.fabricElement && itc.fabricElement.length && (itc.fabricElement.find(item => !(item.ratio - 0)) || itc.fabricElement.reduce((sum, cru) => {
          sum -= cru.ratio
          return sum
        }, 100))) {
          isArr.push(`产品序号${itc.seq}的面料成分/比例-客户比例不能为空且比例之和需为100`)
        }
        if (!itc.range || (itc.range.value === null || itc.range.label === null || itc.range.label === '')) {
          isArr.push('成品幅宽公差范围不能为空')
        } if (!itc.weightBeforeRange || (itc.weightBeforeRange.value === null || itc.weightBeforeRange.label === null || itc.weightBeforeRange.label === '')) {
          isArr.push('成品克重（洗前）公差范围不能为空')
        } if (!itc.colorQuantityDeliverySummary || !itc.colorQuantityDeliverySummary.colorInfo || !itc.colorQuantityDeliverySummary.colorInfo.length) {
          isArr.push('颜色数量交期汇总信息不能为空')
        } if (itc.colorQuantityDeliverySummary) {
          if (!itc.colorQuantityDeliverySummary.unit || !itc.colorQuantityDeliverySummary.unit.value ||
            !itc.colorQuantityDeliverySummary.unit.label ||
            itc.colorQuantityDeliverySummary.unit.value === 'undefined') {
            isArr.push('单位不能为空')
          }
        }
        if (itc.maxVal && !this.weightAfterFormDatas(itc)) {
          isArr.push('克重(洗后)填写不正确')
        }
        if (!this.setlabel(itc.weightAcceptanceCriteria)) {
          isArr.push('克重验收标准填写不正确')
        }
        if (itc.garmentPart.label === '下栏') {
          if (!isByshow.length) {
            isByshow = basicParams.detail.filter((v, index) => v.garmentPart.label === '衫身')
          }
          if (!extColumn) {
            extColumn = this.NextColumnVerification(isByshow, itc)
            extColumn && isArr.push(`第${ixc + 1}分录款号相同，需要填写配色要求`)
          }
        }
        if (itc.colorQuantityDeliverySummary && itc.colorQuantityDeliverySummary.colorInfo && itc.colorQuantityDeliverySummary.colorInfo.length) {
          itc.colorQuantityDeliverySummary.colorInfo && itc.colorQuantityDeliverySummary.colorInfo.forEach(coItem => {
            // if (itc.garmentPart.value === '下栏' && (!this.setlabel(coItem.shirtBody) && this.setlabel(coItem.colorMatching))) {
            //   isArr.push('所属衫身-对色关系不能为空')
            // }
            if (!coItem.quotationNo) {
              isArr.push('报价单号不能为空')
            }
            if (!coItem.refQuotedPrice) {
              isArr.push('参考报价不能为空')
            }
            if (!coItem.deliveryTolerance) {
              isArr.push('走货公差不能为空')
            }
            if (!coItem.customerColor) {
              isArr.push('客户颜色不能为空')
            } if (!coItem.priceTax) {
              isArr.push('单价(含税)不能为空')
            } if (coItem.quantityDelivery && coItem.quantityDelivery.length) {
              coItem.quantityDelivery && coItem.quantityDelivery.forEach(qitem => {
                if (!qitem.quantity) {
                  isArr.push('数量不能为空')
                }
                if (!qitem.delivery) {
                  isArr.push('交期不能为空')
                }
              })
            }
            // if (coItem.stripeSpacing && coItem.stripeSpacing.length) {
            //   if (!coItem.range || (coItem.range.value === null || coItem.range.label === null || coItem.range.label === '')) {
            //     isArr.push('颜色数量交期公差范围不能为空')
            //   }
            // }
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
    // 提交大货订单
    async submitPrint() { // 基本信息
      if (this.orderData._rule && Object.keys(this.orderData._rule).length) {
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
    // 复制大货订单
    async copyPrint() {
      this.isCopy = true
      this.isEdit = true
      const res = await gueCopyInfo({ 'orderId': this.orderData.orderId })
      if (res.code !== 200) { return false }
      this.infoDaTA(res)
      this.orderData.demandSource = ''
      this.orderData.demandCode = ''
      this.orderData.code = ''
    },
    // 删除大货订单
    async deleteClick() {
      this.$confirm('确认删除该大货订单？', '提示', {
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
    // 删除大货订单
    async deletePrint() {
      const res = await orderDelete({ orderId: this.orderData.orderId })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.fetchLog(
        this.getLogMessages('DEL', '/customerOrder/coOrder/delete', 'customerOrder'),
        { orderId: this.orderData.orderId },
        JSON.stringify({
          beforeText: `在'客户订单-大货订单'删除一条记录`,
          beforeCode: { orderId: this.orderData.orderId }
        })
      )
      this.$router.push('/customer-order/goods-orders')
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
    // 保存
    saveClick() {
      this.getOrderRequest()
    },
    // 全局同步
    GlobalSynchronization() {
      let basicParams = this.$utils.deepClone(this.allOrderIndexData) || ''
      basicParams.extraInfo = this.$utils.deepClone(this.extraInfo)
      basicParams.garmentFactoryList = this.$utils.deepClone(this.garmentFactoryList)
      basicParams.colorStandard = this.$utils.deepClone(this.quality.colorStandard)
      basicParams.batchColorRequirements = this.$utils.deepClone(this.quality.batchColorRequirements)
      basicParams.qcInspection = this.$utils.deepClone(this.quality.qcInspection)
      basicParams.qaTestItems = this.$utils.deepClone(this.quality.qaTestItems)
      basicParams.stockPumpingInfo = this.$utils.deepClone(this.stockPumpingInfo)
      // 附件信息和质量要求需要做特殊处理
      basicParams = this.SpecialTreatment(basicParams)
      basicParams.type = 2
      return basicParams
    },
    PickUpInformation(clickType = false) { // 获取订单信息
      this.Picrelease = true
      const pum = []
      const max9999Reg = /^(([1-9]{1}\d{0,3})|(0{1}))(\.\d{1,2})?$/
      const basicParams = this.GlobalSynchronization()
      if (basicParams.hasOwnProperty('taxRate')) { // '税率
        if (!max9999Reg.test(basicParams.taxRate)) {
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
        if (ix.maxVal && !this.weightAfterFormDatas(ix)) {
          pum.push('克重(洗后)填写不正确')
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
        delete basicParams.batchColorRequirements.batchColorId
        delete basicParams.colorStandard.colorStandardId
        delete basicParams.qcInspection.qcInspectionId
        delete basicParams.extraInfo.extraId
      }
      if (this.$route.params.id && !this.isCopy) {
        basicParams.orderId = this.orderData.orderId
        basicParams.code = this.orderData.code
        basicParams.version = this.orderData.version
        basicParams['_rule'] = this.orderData['_rule']
      }
      if (pum.length) { // 产品信息
        this.$message({ type: 'error', message: pum[0] })
        this.Picrelease = false
      } else if (basicParams.duiColor) { // 3中对色光源不能一样
        this.$message({ type: 'error', message: '3种对色光源不能相同!' })
        this.Picrelease = false
      } else if (basicParams.basicInformation) { // 出发港口和目的港口不可完全相同
        this.$message({ type: 'error', message: '出发港口和目的港口不可完全相同!' })
        this.Picrelease = false
      }
      return basicParams
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
          this.getLogMessages('UPDATE', '/customerOrder/coOrder/modify', 'customerOrder'),
          { ...basicParams, id: this.$route.params.id },
          JSON.stringify({
            beforeText: `在'客户订单-大货订单'将${JSON.stringify({ 'id': this.$route.params.id })}`,
            afterText: '修改为',
            ...{ beforeCode, afterCode }
          })
        )
        this.isEdit = false
        this.getDetailData(this.$route.params.id)
        this.$nextTick(() => {
          this.$route.params && this.$route.params.id && this.$router.push({ path: `/customer-order/goods-orders/detail/${this.$route.params.id}/show` })
        })
      } else {
        if (basicParams.demandSource && basicParams.demandCode) {
          basicParams.isFromCrm = '1'
        }
        const res = await orderAdd(basicParams)
        if (res.code !== 200) { return false }
        this.$message({ type: 'success', message: '新增成功!' })
        this.fetchLog(
          this.getLogMessages('INSERT', '/customerOrder/coOrder/add', 'customerOrder'),
          { data: basicParams },
          JSON.stringify({ beforeText: `在'客户订单-大货订单'新增一条记录`, beforeCode: basicParams })
        )
        this.$router.push({ path: `/customer-order/goods-orders/detail/${res.data}/show` })
      }
    },
    // 订单审核
    async ToExamine() {
      this.config.workflowId = this.orderData.orderId // 订单id
      this.config.procInstId = this.orderData.procInstId || '' // 流程实例id
      this.config.visible = true
    },
    // 完结
    async ClickFinish() {
      const dataId = this.orderData
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
      const dataId = this.orderData
      const res = await orderRemoveHold({ 'orderId': dataId.orderId })
      if (res.code !== 200) { return false }
      this.$message({ type: 'success', message: '解hold成功!' })
      this.isEdit = false
      this.GoBackOrder()
    },
    // 撤回
    async Withdraw() {
      const dataId = this.orderData.orderId
      const ruID = this.$route.params.id
      const res = await orderWithdrawt({ 'orderId': dataId })
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
      const res = await orderCancel({ 'orderId': dataId.orderId, 'type': IndexOne, 'cancelReason': this.cancelReason })
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
          console.log('变更内容及原因', basicParams)
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
      this.$router.push('/customer-order/goods-orders')
    },
    // 需求列表详情
    async needDetail(data = {}) {
      // let that = this
      const res = await guestneedDetail({ ...data })
      const needData = res.data || {}
      let orderTypelable = ''
      let orderTypevalue = ''
      if (needData && needData.orderType) { // 订单类型:
        if (this.orderTypeArray && this.orderTypeArray.length) {
          orderTypelable = this.getOrder(needData.orderType)
          this.orderTypeArray && this.orderTypeArray.forEach(item => {
            if (orderTypelable === item.label) {
              orderTypevalue = item.value
            }
          })
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
      if (needData.quarter && needData.quarter.label) {
        console.log(needData.quarter)
      } else {
        const quarters = this.allQuarter.filter(n => n.label === quarterMap[needData.quarter])
        if (quarters && quarters.length > 0) {
          needData.quarter = quarters[0].label || ''
        }
      }
      if (needData && needData.quarter) {
        this.allQuarter && this.allQuarter.forEach(item => {
          if (needData.quarter === item.label) {
            needData.quarterid = item.value
          }
        })
      } else {
        needData.quarterid = ''
      }

      const brand = { value: this.setlabel(needData.brandId), label: this.setlabel(needData.brandName, 2) }
      const customer = { value: this.setlabel(needData.customerId), label: this.setlabel(needData.customerName, 2) }
      const seller = { value: this.setlabel(needData.sellerId, 2), label: this.setlabel(needData.sellerName, 2) }
      const salesTeam = { value: this.setlabel(needData.sellerTeamId), label: this.setlabel(needData.sellerTeamName, 2) }
      const sellYear = needData.year
      let orderType = null
      if (orderTypevalue && orderTypelable) {
        orderType = { value: this.setlabel(orderTypevalue), label: this.setlabel(orderTypelable, 2) }
      }
      const sellQuarter = { value: this.setlabel(needData.quarterid), label: this.setlabel(needData.quarter, 2) } // 销售季度
      const isSettlement = needData.settlement
      const demandSource = needData.requireFrom // 需求来源
      const demandCode = needData.customerRequireId// 需求单号
      // const sampleAnalysisId = needData.techAnalysisId
      // const sampleAnalysisApplyId = needData.sampleAnalysisApplyId || ''
      const extraInfo = {
        customerOrderFile: [],
        clothingStyleFile: [],
        otherFile: []
      }
      if (needData.orderFilePath) {
        extraInfo.customerOrderFile = [
          {
            text: '客户订单',
            id: needData.id,
            comType: 'CRM',
            name: needData.orderFileName,
            url: needData.orderFilePath
          }
        ]
      }
      if (needData.otherFilePath) {
        extraInfo.otherFile = [
          {
            text: '成衣款式',
            id: '',
            comType: 'CRM',
            name: needData.otherFileName,
            url: needData.otherFilePath
          }
        ]
      }
      if (needData.styleFilePath) {
        extraInfo.clothingStyleFile = [
          {
            text: '其它',
            id: '',
            comType: 'CRM',
            name: needData.styleFileName,
            url: needData.styleFilePath
          }
        ]
      }
      const currency = { value: this.setlabel(needData.currencyId), label: this.setlabel(needData.currency) }
      const pricingTerm = { value: this.setlabel(needData.priceTerm), label: this.setlabel(needData.priceTermName) }
      const paymentTerm = { value: this.setlabel(needData.payCondition), label: this.setlabel(needData.payConditionName) }
      this.orderData = {
        brand, customer, seller, sellYear, sellQuarter, isSettlement,
        currency, pricingTerm, paymentTerm, demandCode, demandSource, salesTeam, orderType, extraInfo: extraInfo
      }
      if (!this.orderData.hasOwnProperty('detail')) { this.orderData.detail = [] }
      // this.orderData.detail.push(
      //   {
      //     sampleAnalysisId: sampleAnalysisId, // 客样分析编号
      //     sampleAnalysisApplyId: sampleAnalysisApplyId
      //   }
      // )
      this.orderIndexData = this.$utils.deepClone({ ...this.orderData })
    },
    getAllQuarter() {
      this.getOptionConfig({ pageName: '大货订单', fieldName: '销售季度' }).then(res => {
        this.allQuarter = res || []
      })
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
    getOptionConfigSelect() {
      this.getOptionConfig({ pageName: '大货订单', fieldName: '订单类型' }).then(res => {
        this.orderTypeArray = res || []
      })
    },
    // 处理销售订单类型
    getOrder(data) {
      let str = ''
      switch (data) {
        case 'B':
          str = '大货'
          break
        case 'S':
          str = '销售版'
          break
        case 'T':
          str = '测试样'
          break
        case 'F':
          str = '快反单'
          break
        case 'A':
          str = '备成品'
          break
        default:
          break
      }
      return str
    },
    // 获取样板开发详情
    getDevelopType(data) {
      const list = [
        { label: '品质办', value: 'Q' },
        { label: 'Fit Sample', value: 'F' },
        { label: 'AD Sample', value: 'A' },
        { label: '试纱办', value: 'G' },
        { label: '试规格办', value: 'S' },
        { label: 'LA Sample', value: 'L' }
      ]
      const index = list.findIndex(n => n.value === data)
      return index !== -1 ? list[index].label : data
    },
    //
    SpecialTreatment(dataTim) {
      let isdeparturePort = false // 出发港口和目的港口 附加信息
      const extraInfo = dataTim.extraInfo
      const departurePort = extraInfo.departurePort && extraInfo.departurePort.value ? extraInfo.departurePort.value : ''
      const destinationPort = extraInfo.destinationPort && extraInfo.destinationPort.value ? extraInfo.destinationPort.value : ''
      if ((departurePort && destinationPort) && departurePort === destinationPort) {
        isdeparturePort = true
      }
      if ((dataTim.demandSource && dataTim.demandCode) || dataTim.isFromCrm) { // 附件信息格式处理
        const som = extraInfo.customerOrderFile
        const clo = extraInfo.clothingStyleFile
        const oth = extraInfo.otherFile
        extraInfo.customerOrderFileUrl = som && som.length ? JSON.stringify(som) : null
        extraInfo.clothingStyleFileUrl = clo && clo.length ? JSON.stringify(clo) : null
        extraInfo.otherFileUrl = oth && oth.length ? JSON.stringify(oth) : null
        extraInfo.customerOrderFile = null
        extraInfo.clothingStyleFile = null
        extraInfo.otherFile = null
      } else {
        extraInfo.customerOrderFile = this.setUploadData(extraInfo, 'customerOrderFile')
        extraInfo.clothingStyleFile = this.setUploadData(extraInfo, 'clothingStyleFile')
        extraInfo.otherFile = this.setUploadData(extraInfo, 'otherFile')
        extraInfo.customerOrderFileUrl = null
        extraInfo.clothingStyleFileUrl = null
        extraInfo.otherFileUrl = null
      }
      dataTim.basicInformation = isdeparturePort
      dataTim.duiColor = this.LightColor(dataTim.colorStandard)
      return dataTim
    },
    LightColor(base) { // 3个对色光源不能相同
      const arrIndex = []
      let isType = true
      let arr2 = []
      arrIndex[0] = base.lstLightSource && base.lstLightSource.label ? base.lstLightSource.label : ''
      arrIndex[1] = base.twondLightSource && base.twondLightSource.label ? base.twondLightSource.label : ''
      arrIndex[2] = base.threerdLightSource && base.threerdLightSource.label ? base.threerdLightSource.label : ''
      var newArr = arrIndex.filter(item => item)
      if (newArr.length <= 1) {
        isType = false
      } else if (newArr.length > 1) {
        arr2 = newArr.filter((x, index, self) => self.indexOf(x) === index)
        if (arr2.length !== newArr.length) { isType = true } else { isType = false }
      }
      return isType
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
