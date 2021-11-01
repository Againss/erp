<!--
 * @Descripttion: 大货订单详情
 * @Author: admin
 * @Date: 2021-03-04 14:01:19
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-04-16 14:41:08
-->
<template>
  <div class="goods-detail" :class="isEdit ? '' : 'rules-disable'">
    <!-- 头部状态 -->
    <div v-if="this.$route.params.id" class="status-info">
      <span style="font-size: 18px;color: #151222;">订单号：{{ orderData.code || '' }}</span>
      <div class="detail-info">
        <span>创建人 / 创建时间：{{ orderData.createdBy || '' }} / {{ orderData.createdTime ? this.$filters.parseTime(orderData.createdTime) : '-' }}</span>
        <template v-if="orderData.updatedBy&&orderData.updatedTime">
          <span>修改人 / 修改时间：{{ orderData.updatedBy ? orderData.updatedBy : '-' }} / {{ orderData.updatedTime ? this.$filters.parseTime(orderData.updatedTime) : '-' }}</span>
        </template>
        <template v-if="orderData.status==='4'">
          <span>驳回人 / 驳回时间：{{ orderData.rejectBy ? orderData.rejectBy : '-' }} / {{ orderData.rejectTime ? this.$filters.parseTime(orderData.rejectTime) : '-' }}</span>
        </template>
        <template v-if="orderData.status==='5'||orderData.status==='7'">
          <span>取消人 / 取消时间：{{ orderData.cancelledBy ? orderData.cancelledBy : '-' }} / {{ orderData.cancelledTime ? this.$filters.parseTime(orderData.cancelledTime) : '-' }}</span>
        </template>
        <template v-if="orderData.status==='2'||orderData.status==='13'">
          <span>审核人 / 审核时间：{{ orderData.approveBy ? orderData.approveBy : '-' }} / {{ orderData.approveTime ? this.$filters.parseTime(orderData.approveTime) : '-' }}</span>
        </template>
        <template v-if="orderData.status==='13'">
          <span>完成人 / 时间：{{ orderData.finishedBy ? orderData.finishedBy : '-' }} / {{ orderData.finishedTime ? this.$filters.parseTime(orderData.finishedTime) : '-' }}</span>
        </template>
        <template v-if="orderData.status==='10'||orderData.status==='12'">
          <span>Hold单人 / Hold单时间：{{ orderData.holdBy ? orderData.holdBy : '-' }} / {{ orderData.holdTime ? this.$filters.parseTime(orderData.holdTime) : '-' }}</span>
        </template>
        <span :style="{ 'color': setStatusColor(orderData.status) }"> 状态：{{ orderData.status | getState }}</span>
      </div>
    </div>
    <div class="tab-change">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label=" 订单要求 " name="0" />
        <el-tab-pane label=" 质量要求 " name="1" />
        <el-tab-pane label=" 附加信息 " name="2" />
        <!-- <el-tab-pane label=" 更改记录 " name="3" /> -->
      </el-tabs>
      <div class="requirement-info">
        <span>需求来源：{{ orderData.demandSource||'-' }}</span>
        <span>需求单号：{{ orderData.demandCode||'-' }}</span>
      </div>
    </div>
    <div v-show="activeName==='0'" class="goods-request">
      <goods-request ref="GoodsRequest" :order-data="orderData" :is-edit="isEdit" @okversion="okversionClick" />
    </div>
    <!-- 质量要求 -->
    <div v-show="activeName==='1'" class="order-request">
      <orderquality ref="OrderQuality" :order-data="orderData" :is-edit="isEdit" />
    </div>
    <!-- 附加信息 -->
    <div v-show="activeName==='2'" class="order-request">
      <additiona ref="OrderInformation" :order-data="orderData" :is-edit="isEdit" />
    </div>
    <!-- 底部按钮 -->
    <div :class="{ 'fixed-footer': !sidebar }" class="button-group">
      <!-- 草稿 -->
      <div v-show="!isEdit && orderData.status === '0'">
        <el-button
          v-permission="['customerOrder:saleOrder:modify']"
          type="primary"
          @click="setEdit"
        >编辑</el-button>
        <el-button
          v-permission="['customerOrder:saleOrder:submit']"
          @click="submitPrint"
        >提交</el-button>
        <el-button v-permission="['customerOrder:saleOrder:copy']" @click="copyPrint">复制</el-button>
        <el-button
          v-permission="['customerOrder:saleOrder:delete']"
          @click="deleteClick"
        >删除</el-button>
        <!-- <el-button
          v-permission="['customerOrder:colorModel:colorModelApply:print']"
          type="primary"
          @click="printPreview"
        >打印预览</el-button> -->
        <el-button
          @click="GoBackOrder"
        >返回</el-button>
      </div>
      <!-- 已驳回 -->
      <div v-show="!isEdit && orderData.status === '4'">
        <el-button
          v-permission="['customerOrder:saleOrder:modify']"
          type="primary"
          @click="setEdit"
        >编辑</el-button>
        <el-button
          v-permission="['customerOrder:saleOrder:submit']"
          @click="submitPrint"
        >提交</el-button>
        <el-button v-permission="['customerOrder:saleOrder:copy']" @click="copyPrint">复制</el-button>
        <el-button
          @click="GoBackOrder"
        >返回</el-button>
      </div>
      <!--待审核-->
      <div v-show="!isEdit && (orderData.status === '1')">
        <el-button v-permission="['customerOrder:saleOrder:audit']" type="primary" @click="ToExamine">审核</el-button>
        <el-button v-permission="['customerOrder:saleOrder:withdraw']" @click="Withdraw">撤回</el-button>
        <el-button v-permission="['customerOrder:saleOrder:copy']" @click="copyPrint">复制</el-button>
        <el-button v-permission="['customerOrder:saleOrder:cancel']" @click="CallOff">取消</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 进行中-Hold单待审 -->
      <div v-show="!isEdit && (orderData.status === '10')">
        <el-button v-permission="['customerOrder:saleOrder:audit']" type="primary" @click="ToExamine">审核</el-button>
        <el-button v-permission="['customerOrder:saleOrder:copy']" @click="copyPrint">复制</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 进行中-取消待审 -->
      <div v-show="!isEdit && (orderData.status === '5')">
        <el-button v-permission="['customerOrder:saleOrder:audit']" type="primary" @click="ToExamine">审核</el-button>
        <el-button v-permission="['customerOrder:saleOrder:copy']" @click="copyPrint">复制</el-button>
        <el-button
          @click="GoBackOrder"
        >返回</el-button>
      </div>
      <!-- 进行中-变更待审 -->
      <div v-show="!isEdit && (orderData.status === '8')">
        <el-button v-permission="['customerOrder:saleOrder:audit']" type="primary" @click="ToExamine">审核</el-button>
        <el-button v-permission="['customerOrder:saleOrder:copy']" @click="copyPrint">复制</el-button>
        <el-button
          @click="GoBackOrder"
        >返回</el-button>
      </div>
      <!-- 进行中-已审核 -->
      <div v-show="!isEdit && (orderData.status === '2')">
        <el-button v-permission="['customerOrder:saleOrder:change']" type="primary" @click="setEdit">变更</el-button>
        <el-button v-permission="['customerOrder:saleOrder:finish']" @click="ClickFinish">完结</el-button>
        <el-button v-permission="['customerOrder:saleOrder:copy']" @click="copyPrint">复制</el-button>
        <el-button v-permission="['customerOrder:saleOrder:hold']" @click="ClickHold">Hold单</el-button>
        <el-button v-permission="['customerOrder:saleOrder:cancel']" @click="setCallOff">取消</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 进行中-Hold单 -->
      <div v-show="!isEdit && (orderData.status === '12')">
        <el-button v-permission="['customerOrder:saleOrder:removeHold']" type="primary" @click="solveHold">解Hold</el-button>
        <el-button v-permission="['customerOrder:saleOrder:copy']" @click="copyPrint">复制</el-button>
        <el-button
          @click="GoBackOrder"
        >返回</el-button>

      </div>
      <!-- 进行中-会签 -->
      <div v-show="!isEdit && (orderData.status === '11'|| orderData.status === '9'||orderData.status === '6')">
        <!-- <el-button type="primary" @click="jointlySign">完成会签</el-button> -->
        <el-button v-permission="['customerOrder:saleOrder:copy']" type="primary" @click="copyPrint">复制</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 已完结 已取消-->
      <div v-show="!isEdit && (orderData.status === '7'|| orderData.status === '13')">
        <el-button v-permission="['customerOrder:saleOrder:copy']" type="primary" @click="copyPrint">复制</el-button>
        <el-button @click="GoBackOrder">返回</el-button>
      </div>
      <!-- 新建 -->
      <div v-show="isEdit && !statusEdit&&orderData.status!=='4'">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="saveClick">保存</el-button>
      </div>
      <div v-show="isEdit && !statusEdit&&orderData.status==='4'" class="statusEdit2">
        <el-button @click="cancelClick">取消</el-button>
        <el-button v-show="isCopy" @click="saveClick">保存</el-button>
        <el-button v-show="!isCopy" type="primary" @click="submitPrint">提交</el-button>
      </div>
      <!--待提交-已驳回 进行中-已审核 -->
      <div v-show="isEdit && statusEdit" class="statusEdit">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="Alteration">提交</el-button>
      </div>
    </div>
    <approve v-if="config.visible" :config="config" @close="config.visible=false" />
    <upinformation
      v-if="upconfig.visible"
      :upconfig="upconfig"
      @close="upconfig.visible=false"
      @okCallback="okCallback"
      @Cancelcallback="CancelText"
    />

  </div>
</template>

<script>
import goodsRequest from './compoments/goodsRequest'
import orderquality from './compoments/qualityRequirement'
import additiona from './compoments/additionaInformation'
import logMethods from '@/views/product-center/mixin/log-methods'
import { guestneedDetail, getDetail, fileListArray, gueCopyInfo } from '../api/index.js'
import { orderDelete, orderAdd, orderModify, orderSubmit, orderWithdrawt, orderCancel, orderFinish, orderHold, orderRemoveHold, orderChange } from '@/views/customer-order/sample-orders/detail/api/index'
import approve from '@/components/approve/index'
import upinformation from './compoments/pups'
import { PublicCustomer } from '@/views/customer-order/public/index'
export default {
  filters: {
    getState(val) {
      switch (val) {
        case '0':
          return '草稿'
        case '1':
          return '新单待审'
        case '2':
          return '已审核'
        case '3':
          return '已废弃'
        case '4':
          return '已驳回'
        case '5':
          return '取消审核中'
        case '6':
          return '取消会签中'
        case '7':
          return '已取消'
        case '8':
          return '变更审核中'
        case '9':
          return '变更会签中'
        case '10':
          return 'Hold单审核中'
        case '11':
          return 'Hold单会签中'
        case '12':
          return 'Hold单'
        case '13':
          return '已完成'
        case null:
          return '草稿'
        default:
          return ''
      }
    }
  },
  components: {
    goodsRequest,
    orderquality,
    additiona,
    approve,
    upinformation
  },
  mixins: [logMethods, PublicCustomer],
  data() {
    return {
      allQuarter: [],
      activeName: '0',
      isEdit: true,
      orderData: {},
      isCopy: false,
      copyDetailData: {},
      dataExamine: [ // 列表状态值
        { id: '0', text: '草稿' },
        { id: '1', text: '新单待审' },
        { id: '2', text: '已审核' },
        { id: '3', text: '已废弃' },
        { id: '4', text: '已驳回' },
        { id: '5', text: '取消审核中' },
        { id: '6', text: '取消会签中' },
        { id: '7', text: '已取消' },
        { id: '8', text: '变更审核中' },
        { id: '9', text: '变更会签中' },
        { id: '10', text: 'Hold单审核中' },
        { id: '11', text: 'Hold单会签中' },
        { id: '12', text: 'Hold单' },
        { id: '13', text: '已完成' }
      ],
      ToExamineArray: [
        { id: '0', text: '新单待审' },
        { id: '1', text: '变更待审' },
        { id: '2', text: '取消待审' },
        { id: '3', text: 'Hold单审核中' }
      ],
      statusEdit: false, // 驳回编辑状态不同
      config: { // 审核流程
        visible: false,
        workflowId: '',
        procinstid: '',
        pass: (res) => {
          this.isEdit = false
          this.GoBackOrder()
          console.log('pass', res)
        },
        refuse: (res) => {
          this.GoBackOrder()
          console.log('refuse', res)
        },
        back: (res) => {
          // this.$message({ type: 'success', message: '回退回调!' })
          // this.isEdit = false
          this.GoBackOrder()
          console.log('回退回调')
        }
      },
      upconfig: {
        visible: false,
        workflowId: '',
        // start: (res) => {
        //   console.log('pass', res)
        // },
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
      cancelReason: '', // 已审核取消
      Picrelease: false,
      orderTypeArray: []
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar.opened
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
        this.isEdit = false
      } else {
        this.isEdit = true
      }
    } else {
      this.isEdit = true
    }
  },
  mounted() {
    if (this.$route.query.requireId) {
      // 从客户需求列表那边跳转过来，若不存在草稿新建部分数据从需求列表详情那边带过来
      this.needDetail({ id: this.$route.query.requireId })
    }
  },
  methods: {
    setStatusColor(status) {
      let statusColor = ''
      switch (status) {
        case '0':
          statusColor = '#FF9214'
          break
        case '1':
          statusColor = '#FF9214'
          break
        case '2':
          statusColor = '#00BCC5'
          break
        case '3':
          statusColor = '#FF4444'
          break
        case '4':
          statusColor = '#FF4444'
          break
        case '5':
          statusColor = '#888E9E'
          break
        case '6':
          statusColor = '#888E9E'
          break
        case '7':
          statusColor = '#888E9E'
          break
        case '8':
          statusColor = '#FF9214'
          break
        case '9':
          statusColor = '#FF9214'
          break
        case '10':
          statusColor = '#FF9214'
          break
        case '11':
          statusColor = '#FF9214'
          break
        case '12':
          statusColor = '#FF9214'
          break
        case '13':
          statusColor = '#00BCC5'
          break
        default:
          statusColor = ''
          break
      }
      return statusColor
    },
    // 弹框回调
    CancelText(e) {
      if (e.type === '0') {
        this.upconfig.visible = false
      }
    },
    handleClick() {},
    // 获取详情数据
    async getDetailData(id) {
      this.statusEdit = false
      this.isCopy = false
      const res = await getDetail({ 'orderId': id })
      if (res.code !== 200) { return false }
      this.infoDaTA(res)
      // this.orderData = Object.assign({}, res.data) || {}
      // this.copyDetailData = JSON.parse(JSON.stringify(this.orderData))
      // // console.log(this.orderData, 'orderData')
      // const dataTim = this.orderData
      // dataTim.orderType = this.setValue('orderType')// 订单类型
      // dataTim.brand = this.setValue('brand') // 品牌商
      // // console.log('ops', dataTim.brand)
      // dataTim.customer = dataTim.customer && dataTim.customer.value ? dataTim.customer : '' // 客户
      // dataTim.garmentFactory = dataTim.garmentFactory && dataTim.garmentFactory.value ? dataTim.garmentFactory : ''// 制衣厂
      // dataTim.salesTeam = this.setValue('salesTeam')// 销售团队
      // dataTim.seller = this.setValue('seller') // 销售员
      // dataTim.customerService = this.setValue('customerService') // 客服
      // dataTim.sellYear = dataTim.sellYear || '' // 销售年度
      // dataTim.sellQuarter = this.setValue('sellQuarter')// 销售季度
      // dataTim.currency = dataTim.currency && dataTim.currency.value ? dataTim.currency : '' // 币别ID
      // dataTim.taxRate = dataTim.taxRate || '' // 税率
      // dataTim.pricingTerm = dataTim.pricingTerm && dataTim.pricingTerm.value ? dataTim.pricingTerm : '' // 价格条款
      // dataTim.paymentTerm = dataTim.paymentTerm && dataTim.paymentTerm.value ? dataTim.paymentTerm : '' // 付款条件ID
      // // dataTim.craftRequirementList = dataTim.craftRequirementList || ''// 工艺要求
      // this.orderData.detail = this.orderData.detail || []
      // this.setDetailData(this.orderData)
      // console.log(this.orderData, 'orderData')
    },
    // 详情数据 统一处理
    infoDaTA(res) {
      this.$refs.OrderRequest && this.$refs.OrderRequest.setHomeListLength()
      this.orderData = Object.assign({}, res.data) || {}
      this.copyDetailData = JSON.parse(JSON.stringify(this.orderData))
      const dataTim = this.orderData
      // dataTim.demandSource  =8888888// 订单类型
      dataTim.orderType = this.setValue('orderType')// 订单类型
      dataTim.brand = this.setValue('brand') // 品牌商
      dataTim.customer = this.setValue('customer') // 客户
      dataTim.garmentFactory = this.setValue('garmentFactory')// 制衣厂
      dataTim.salesTeam = this.setValue('salesTeam')// 销售团队
      dataTim.seller = this.setValue('seller') // 销售员
      dataTim.customerService = this.setValue('customerService') // 客服
      dataTim.sellYear = dataTim.sellYear || '' // 销售年度
      dataTim.sellQuarter = this.setValue('sellQuarter')// 销售季度
      dataTim.isSettlement = dataTim.isSettlement || 0 // 是否结算{0=是，1=否}
      dataTim.currency = this.setValue('currency') // 币别ID
      dataTim.taxRate = dataTim.taxRate ? String(dataTim.taxRate) : '0' // 税率
      dataTim.pricingTerm = this.setValue('pricingTerm') // 价格条款
      dataTim.paymentTerm = this.setValue('paymentTerm') // 付款条件ID
      this.orderData.detail = this.orderData.detail || []
      this.setDetailData(this.orderData)
    },
    setValue(typeIndex) {
      const dataTim = this.orderData
      if (dataTim[typeIndex] && dataTim[typeIndex].value) {
        dataTim[typeIndex].value = dataTim[typeIndex].value !== null ? dataTim[typeIndex].value : ''
      } else {
        dataTim[typeIndex] = ''
      }
      return dataTim[typeIndex]
    },
    setDetailData(data) {
      if ((this.orderData.demandSource && this.orderData.demandCode) || this.orderData.isFromCrm) {
        const dataArray = JSON.parse(JSON.stringify(this.orderData))
        const om = dataArray.extraInfo
        om.customerOrderFile = om.customerOrderFileUrl && JSON.parse(om.customerOrderFileUrl) || null
        om.clothingStyleFile = om.clothingStyleFileUrl && JSON.parse(om.clothingStyleFileUrl) || null
        om.otherFile = om.otherFileUrl && JSON.parse(om.otherFileUrl) || null
        this.orderData = dataArray
      } else {
        this.fileArrSplit()
      }
      const Orderem = this.$refs.GoodsRequest // 订单要求
      const OrderQualityIndex = this.$refs.OrderQuality // 质量要求
      const OrderInformationIndex = this.$refs.OrderInformation // 附加信息
      if (Orderem) {
        const sup = ['orderType', 'brand', 'customer', 'garmentFactory', 'salesTeam', 'seller', 'customerService', 'sellQuarter', 'currency', 'pricingTerm', 'paymentTerm']
        // const supTwo = ['currency', 'pricingTerm', 'paymentTerm']
        // const dataTim = this.orderData
        // if (dataTim.isSettlement) {
        //   sup = sup.concat(supTwo)
        // }
        sup.forEach((item) => { Orderem.setProDatBilIselect(this.orderData[item], `_${item}`, 'object') })
      }
      this.$nextTick(() => {
        Orderem.$refs.basicData.form.clearValidate()
        Orderem.$refs.productData.form.clearValidate()
        OrderQualityIndex.$refs.basicDataOne.form.clearValidate()
        OrderQualityIndex.$refs.batchColor.form.clearValidate()
        OrderQualityIndex.$refs.Inspection.form.clearValidate()
        OrderInformationIndex.$refs.shipment.form.clearValidate()
        OrderInformationIndex.$refs.readyToWear.form.clearValidate()
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
            name: item.originalName,
            url: item.viewUrl || item.url || ''
          }
        })
      }
      this.orderData.extraInfo.customerOrderFile = fileArr || []
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
            name: item.originalName,
            url: item.viewUrl || item.url || ''
          }
        })
      }
      this.orderData.extraInfo.clothingStyleFile = fileArr || []
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
      if (this.orderData.extraInfo.customerOrderFile) {
        const StyleFile = this.orderData.extraInfo.customerOrderFile && this.orderData.extraInfo.customerOrderFile.split(',')
        if (StyleFile) {
          this.clothFlie(StyleFile)
        }
      }
      // 成衣款式
      if (this.orderData.extraInfo.clothingStyleFile) {
        const StyleFile = this.orderData.extraInfo.clothingStyleFile && this.orderData.extraInfo.clothingStyleFile.split(',')
        if (StyleFile) {
          this.StyleFlie(StyleFile)
        }
      }
      // 其他
      if (this.orderData.extraInfo.otherFile) {
        const StyleFile = this.orderData.extraInfo.otherFile && this.orderData.extraInfo.otherFile.split(',')
        if (StyleFile) {
          this.OtherFiles(StyleFile)
        }
      }
    },
    // 编辑
    setEdit() {
      this.isEdit = true
      const ruID = this.$route.params.id
      if ((ruID && this.orderData.status === '2') || (ruID && this.$route.query.statusIndex === '2')) {
        this.statusEdit = true
      }
    },
    SubmitForVerification() { // 提交验证
      const validateFieldArr = []
      const validateFieldArr2 = []
      const isone = ['orderType', 'brand', 'customer', 'salesTeam', 'seller', 'customerService', 'sellYear', 'sellQuarter', 'currency', 'taxRate', 'pricingTerm', 'paymentTerm']
      let isrelease = true
      let isactiveName = true
      this.$refs.GoodsRequest.$refs.basicData.form.validateField(isone, async(validateField) => {
        if (validateField && validateField !== '') {
          if (isactiveName) {
            this.activeName = '0'
            isactiveName = false
          }
          validateFieldArr.push(validateField)
        }
      })
      // 产品信息
      this.$refs.GoodsRequest.$refs.productData.form.validateField(['weightBeforeRange', 'range'], async(validateField2) => {
        if (validateField2 && validateField2 !== '') {
          if (isactiveName) {
            this.activeName = '0'
            isactiveName = false
          }
          validateFieldArr2.push(validateField2)
        }
      })
      // 对色标准
      this.$refs.OrderQuality.$refs.basicDataOne.form.validateField(['colorMatching', 'lstLightSource'], async(validateField3) => {
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
      this.$refs.OrderQuality.$refs.Inspection.form.validateField(['chabStandard', 'scoreStandard', 'checkClothLanguage', 'checkClothMethod', 'isGuestsCheck', 'isProvideReport'], async(validateField5) => {
        if (validateField5 && validateField5 !== '') {
          if (isactiveName) {
            this.activeName = '1'
            isactiveName = false
          }
          validateFieldArr2.push(validateField5)
        }
      })
      // 出货要求
      this.$refs.OrderInformation.$refs.shipment.form.validateField(['exportAgent', 'departurePort', 'transportMode', 'netOrGrossWeight', 'plasticBagType', 'plasticBagThickness', 'stickersQuantity', 'stickersPosition', 'isDirectFlight', 'deliveryTolerance'], async(validateField6) => {
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
      const enclosureFile = this.$refs.OrderInformation.DataSummary()
      console.log('ssssss', enclosureFile)
      if (enclosureFile.hasOwnProperty('crmType')) {
        console.log('ssssss2222', enclosureFile)
        if (!enclosureFile.customerOrderFileUrl) {
          if (isactiveName) {
            this.activeName = '2'
            isactiveName = false
            this.$message({ type: 'error', message: '客户订单附件不能为空' })
          }
          isrelease = false
          return false
        }
      } else {
        console.log('ssssss2222', enclosureFile)
        if (!enclosureFile.customerOrderFile) {
          if (isactiveName) {
            this.activeName = '2'
            isactiveName = false
            this.$message({ type: 'error', message: '客户订单附件不能为空' })
          }
          isrelease = false
          return false
        }
      }
      if (validateFieldArr.length || validateFieldArr2.length) {
        isrelease = false
        return false
      }
      return isrelease
    },
    // 提交校 验必填
    SubmitRequired() { // 测试先 注释全部必填校验
      if (!this.SubmitForVerification()) { return false }
      const basicParams = this.PickUpInformation(true)
      // console.log('opm', basicParams)
      const basicArray = basicParams.detail
      const isArr = []
      console.log(basicArray, '646')
      basicArray && basicArray.length && basicArray.forEach((itc, ixc) => {
        if (!itc.garmentPart || (itc.garmentPart.value === null || itc.garmentPart.value === 'null' || itc.garmentPart.label === null || itc.garmentPart.label === '')) {
          isArr.push('成衣部位不能为空')
        }
        if (!itc.referenceVersionInfo || !itc.referenceVersionInfo.length) {
          isArr.push('参板信息不能为空')
        }
        if (!itc.range || (itc.range.value === null || itc.range.label === null || itc.range.label === '')) {
          isArr.push('成品幅宽公差范围不能为空')
        }
        if (!itc.weightBeforeRange || (itc.weightBeforeRange.value === null || itc.weightBeforeRange.label === null || itc.weightBeforeRange.label === '')) {
          isArr.push('成品克重（洗前）公差范围不能为空')
        }
        // console.log('op', itc.colorQuantityDeliverySummary)
        if (!itc.colorQuantityDeliverySummary || !itc.colorQuantityDeliverySummary.colorInfo || !itc.colorQuantityDeliverySummary.colorInfo.length) {
          isArr.push('颜色数量交期汇总信息不能为空')
        }
        if (!itc.colorQuantityDeliverySummary || !itc.colorQuantityDeliverySummary.unit || !itc.colorQuantityDeliverySummary.unit.value || itc.colorQuantityDeliverySummary.unit.value === 'undefined') {
          // console.log('12121')
          isArr.push('单位不能为空')
        }
        if (itc.colorQuantityDeliverySummary && itc.colorQuantityDeliverySummary.colorInfo && itc.colorQuantityDeliverySummary.colorInfo.length) {
          itc.colorQuantityDeliverySummary.colorInfo && itc.colorQuantityDeliverySummary.colorInfo.forEach(coItem => {
            if (!coItem.customerColor) {
              isArr.push('客户颜色不能为空')
            }
            if (!coItem.priceTax) {
              isArr.push('单价(含税)不能为空')
            }
            if (!coItem.greyClothCode) {
              isArr.push('坯布/色布/印花布编码不能为空')
            }
            if (coItem.quantityDelivery && coItem.quantityDelivery.length) {
              coItem.quantityDelivery && coItem.quantityDelivery.forEach(qitem => {
                if (!qitem.quantity) {
                  isArr.push('数量不能为空')
                }
                if (!qitem.delivery) {
                  isArr.push('交期不能为空')
                }
              })
            }
            // if(!coItem.priceTax){
            //   isArr.push('单价(含税)不能为空')
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
      console.log(' basicParams', basicParams)
      if (basicParams) {
        const res = await orderSubmit(basicParams)
        if (res.code !== 200) { return false }
        this.$message({ type: 'success', message: '提交成功!' })
        this.GoBackOrder()
      }
    },
    // 复制大货订单
    async copyPrint() {
      // let sm=this.orderData.demandSource && this.orderData.demandCode?"1":"0"
      const res = await gueCopyInfo({ 'orderId': this.orderData.orderId })
      if (res.code !== 200) { return false }
      this.infoDaTA(res)
      this.isCopy = true
      this.isEdit = true
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
    // 订单审核
    async ToExamine() {
      this.config.workflowId = this.orderData.orderId // 订单id
      this.config.procInstId = this.orderData.procInstId || '' // 流程实例id
      this.config.visible = true
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
      // const params = {}
      this.getGoodsRequest()
    },
    // 获取大货订单信息
    PickUpInformation(clickType = false) { // 获取订单信息
      this.Picrelease = true
      const pum = []
      // const max999Reg = /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,2})?$/
      const max9999Reg = /^(([1-9]{1}\d{0,3})|(0{1}))(\.\d{1,2})?$/
      const dataCom = this.$refs.GoodsRequest
      const OrderQuality = this.$refs.OrderQuality
      const OrderInformation = this.$refs.OrderInformation
      const basicParams = dataCom.$refs.basicData.dynamicValidateFormRuleForm || {}// 基本信息
      const basicQuality = OrderQuality.DataSummary() // 获取质量要求信息
      const basicInformation = OrderInformation.DataSummary() // 附加信息
      basicParams.qcInspection = basicQuality.data.qcInspection
      basicParams.batchColorRequirements = basicQuality.data.batchColorRequirements
      basicParams.colorStandard = basicQuality.data.colorStandard
      basicParams.extraInfo = basicInformation
      // console.log('dataCom:',dataCom)
      // console.log('basicParams:', basicParams)
      basicParams.type = 2
      const orderParams = dataCom.DataSummary()
      console.log('orderParams:', orderParams)
      // if (basicParams.hasOwnProperty('taxRate')) { // '税率
      //   if (!max9999Reg.test(basicParams.taxRate)) {
      //     pum.push('税率输入0~9999.99!')
      //   }
      // }
      orderParams.forEach((ix, it) => {
        // if (ix.suggestWidth && !max999Reg.test(ix.suggestWidth)) {
        //   pum.push('成品幅宽请输入0~999.99!')
        // }
        // if (ix.weightBefore && !max9999Reg.test(ix.weightBefore)) {
        //   pum.push('成品克重（洗前）克重请输入0~9999.99!')
        // }
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
      })
      basicParams.detail = orderParams
      if (this.isCopy) {
        delete basicParams.orderId
        delete basicParams.status
        delete basicParams.demandCode
        delete basicParams.demandSource
        delete basicParams.batchColorRequirements.batchColorId
        delete basicParams.colorStandard.colorStandardId
        delete basicParams.qcInspection.qcInspectionId
        delete basicParams.extraInfo.extraId
        // // 加密字段需要删除
        // if (this.orderData._rule && Object.keys(this.orderData._rule).length) {
        //   this.orderDataRule(this.orderData._rule)
        // }
        // delete basicParams._rule
      }
      if (this.$route.params.id && !this.isCopy) {
        basicParams.orderId = this.orderData.orderId
        basicParams.code = this.orderData.code
        basicParams.version = this.orderData.version
        // 字段加密的内容
        basicParams['_rule'] = this.orderData['_rule']
      }
      if (pum.length) { // 产品信息
        this.$message({ type: 'error', message: pum[0] })
        this.Picrelease = false
      } else if (basicQuality.isshow) { // 3中对色光源不能一样
        this.$message({ type: 'error', message: '3种对色光源不能相同!' })
        this.Picrelease = false
      } else if (basicInformation.isshow) { // 出发港口和目的港口不可完全相同
        this.$message({ type: 'error', message: '出发港口和目的港口不可完全相同!' })
        this.Picrelease = false
      }
      // console.log('orderParams858:', orderParams)
      return basicParams
    },
    async getGoodsRequest(clickType = false) {
      const basicParams = this.PickUpInformation(clickType)
      console.log('保存', basicParams)
      // const basicParams = {}
      // console.log(basicParams)
      if (!this.Picrelease) { return false }
      // basicParams && basicParams.detail && basicParams.detail.forEach((item, index) => {
      //   item.suggestWidth = item.suggestWidth + ''
      //   item.weightBefore = item.weightBefore + ''
      //   item.weightAfter = item.weightAfter + ''
      //   if (item.suggestWidth && item.suggestWidth.includes('cm')) {
      //     item.suggestWidth = item.suggestWidth && item.suggestWidth.substring(0, item.suggestWidth.length - 2)
      //   } else if (item.weightBefore && item.weightBefore.includes('g/m²')) {
      //     item.weightBefore = item.weightBefore && item.weightBefore.substring(0, item.weightBefore.length - 4)
      //   } else if (item.weightAfter && item.weightAfter.includes('g/m²')) {
      //     item.weightAfter = item.weightAfter && item.weightAfter.substring(0, item.weightAfter.length - 4)
      //   }
      // })
      if (this.$route.params.id && !this.isCopy) {
        // console.log('po', basicParams)
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
        const GoodsRequest = this.$refs.GoodsRequest
        this.$router.push({ path: `/customer-order/goods-orders/detail/${res.data}/show`, query: { rowIndex: GoodsRequest.rowIndex }})
      }
      // const dataCom = this.$refs.GoodsRequest
      // const orderParams = dataCom.DataSummary()
      // console.log('orderParams:',orderParams)
      // const basicParams = dataCom.$refs.basicData.dynamicValidateFormRuleForm || {}// 基本信息
      // basicParams.type = 2
      // console.log(basicParams, '254')
    },
    // 打印预览
    printPreview() {
      // window.open(`/customer-order/analysis-application/printing-application/print?id=${this.$route.params.id}`)
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

      // const dataId = this.orderData
      // const res = await orderHold({ 'orderId': dataId.orderId, 'holdReason': '' })
      // if (res.code !== 200) { return false }
      // this.$message({ type: 'success', message: 'Hold单成功!' })
      // this.isEdit = false
      // this.GoBackOrder()
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
    // 会签
    // async jointlySign() {
    //   const dataId = this.orderData
    //   console.log(dataId, 'dataId')
    //   const sm = this.SetDataExamine(dataId.status)
    //   var newAr = this.ToExamineArray.filter((element) => { return element.text === sm })
    //   const res = await orderCountersign({ 'orderId': dataId.orderId, type: newAr[0].id })
    //   if (res.code !== 200) { return false }
    //   this.$message({ type: 'success', message: '会签成功!' })
    //   this.isEdit = false
    //   this.GoBackOrder()
    // },
    // 撤回
    Withdraw() {
      this.$confirm('确定撤回吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'customClass'
      }).then(async() => {
        const dataId = this.orderData.orderId
        const ruID = this.$route.params.id
        const res = await orderWithdrawt({ 'orderId': dataId })
        if (res.code !== 200) { return false }
        this.$message({ type: 'success', message: '撤回成功!' })
        this.isEdit = false
        this.getDetailData(ruID)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 取消
    async CallOff() {
      const dataId = this.orderData
      const sm = this.SetDataExamine(dataId.status)
      let IndexOne = 0
      // 新单待审 待审核
      if (sm === '新单待审') { IndexOne = 0 } else if (sm === '已审核') { IndexOne = 1 }
      const res = await orderCancel({ 'orderId': dataId.orderId, 'type': IndexOne, 'cancelReason': this.cancelReason })
      if (res.code !== 200) { return false }
      this.$message({ type: 'success', message: '取消成功!' })
      this.isEdit = false
      this.GoBackOrder()
    },
    // 待审核-取消待审
    setCallOff() {
      this.upconfig.title = '取消原因'
      this.upconfig.visible = true
      console.log('xiaojia', this.upconfig)
    },
    // 变更弹窗出现
    async Alteration() {
      if (this.orderData._rule && Object.keys(this.orderData._rule).length) {
        this.$message({ type: 'error', message: '字段加密不能提交' })
        return false
      }
      this.upconfig.title = '变更内容及原因'
      this.upconfig.visible = true
      console.log('xiaojia', this.upconfig)
    },
    SetDataExamine(type) { // 获取状态id
      var newArr = this.dataExamine.filter((element) => {
        return element.id === type
      })
      console.log('ommm', newArr)
      return newArr[0].text
    },

    async okCallback(val) { // 变更提交
      if (val.title === '变更内容及原因') {
        const basicParams = this.SubmitRequired()
        console.log('basicParams', basicParams)
        if (basicParams) {
          basicParams.changeReason = val.text.remark
          console.log('basicParams', basicParams)
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
    // 返回上一页
    GoBackOrder() {
      this.$router.push('/customer-order/goods-orders')
    },
    // 需求列表详情
    async needDetail(data = {}) {
      const Orderem = this.$refs.GoodsRequest // 订单要求
      // let that = this
      const res = await guestneedDetail({ ...data })
      const needData = res.data || {}
      console.log('allQuarter', this.allQuarter)
      console.log('allQuarterneedData', needData)
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

      console.log(this.allQuarter)
      if (needData && needData.quarter) {
        this.allQuarter && this.allQuarter.forEach(item => {
          if (needData.quarter === item.label) {
            needData.quarterid = item.value
          }
        })
      } else {
        needData.quarterid = ''
      }
      // console.log(needData.quarterid,needData.quarter);
      let brand = { value: needData.brandId + '', label: needData.brandName }
      let customer = { value: needData.customerId + '', label: needData.customerName }
      let seller = { value: needData.sellerId, label: needData.sellerName }
      const salesTeam = { value: needData.sellerTeamId + '', label: needData.sellerTeamName }
      const sellYear = needData.year
      let orderType = null
      if (orderTypevalue && orderTypelable) {
        orderType = { value: orderTypevalue + '', label: orderTypelable }
      }
      let sellQuarter = { value: needData.quarterid + '', label: needData.quarter } // 销售季度
      const demandSource = needData.requireFrom // 需求来源
      const demandCode = needData.customerRequireId// 需求单号
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

      // const isSettlement = needData.settlement
      let currency = { value: needData.currencyId + '', label: needData.currency }
      let pricingTerm = { value: needData.priceTerm + '', label: needData.priceTermName }
      let paymentTerm = { value: needData.payCondition + '', label: needData.payConditionName }
      if (brand.value === 'undefined') {
        brand = ''
      }
      if (customer.value === 'undefined') {
        customer = ''
      }
      if (seller.value === 'undefined') {
        seller = ''
      }
      if (sellQuarter.value === 'undefined') {
        sellQuarter = ''
      }
      if (currency.value === 'undefined') {
        currency = ''
      }
      if (pricingTerm.value === 'undefined') {
        pricingTerm = ''
      }
      if (paymentTerm.value === 'undefined') {
        paymentTerm = ''
      }
      const pu = { brand, customer, seller, sellYear, sellQuarter, currency, pricingTerm, paymentTerm, demandCode, demandSource, orderType }
      console.log('ssss', pu)

      this.orderData = { brand, customer, seller, sellYear, sellQuarter, currency, pricingTerm, paymentTerm, demandCode, demandSource, salesTeam, orderType }
      this.orderData.extraInfo = extraInfo
      // 客样分析编号
      this.$nextTick(() => {
        Orderem.sampleAnalysisIdClick()
      })
      // console.log(this.orderData)
      // this.orderData.pricingTerm = {value:needData.customer, lable: needData.customerName}
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
    okversionClick(val) { // 版本变更
      if (val.orderId) {
        this.getDetailData(val.orderId)
      }
    },
    getOptionConfigSelect() {
      this.getOptionConfig({ pageName: '大货订单', fieldName: '订单类型' }).then(res => {
        this.orderTypeArray = res || []
        console.log('ommmm', this.orderTypeArray)
      })
    }
    // orderDataRule(data) {
    //   const dataArray = JSON.parse(JSON.stringify(this.orderData))
    //   const Orderem = this.$refs.GoodsRequest
    //   for (const key in data) {
    //     const sm = key && key.split('.') || []
    //     if (sm && sm.length === 2) { // 表头
    //       Orderem.SetIndexbaseFormDatas(sm[0], '')
    //       delete dataArray[sm[0]]
    //     } else if (sm && sm[0] === 'detail') { // 订单信息 分类
    //       console.log('sss9999999', key)
    //     }
    //   }
    //   delete dataArray._rule
    //   this.orderData = dataArray
    //   console.log('xiao', dataArray)
    // }
  }
}
</script>

<style lang="scss">
.goods-detail {
  padding-bottom: 60px;
  // margin-top: 20px;
  .custom-form {
    margin: 0 20px;
  }
  .inputWidth {
    width: 60%!important;
  }
  .status-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 20px;
    margin-bottom: 16px;
    margin-top: 20px;
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
    border-bottom: 1px solid #D0D6DA;
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
        color: #888E9E;
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
          content: ''!important;
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
  }
  .leftTableForm {
    .el-table__header .lableStyle::before {
      content: ''!important;
    }
  }
  .color-table {
    .greylableStyle::before {
      content: ''!important;
    }
  }
  .item-title::before {
    content: ''!important;
  }
}
</style>
