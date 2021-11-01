/** * @Description: 备坯单入口 * @author Roman * @date 2021-04-26 11:22:17 * @edit 2021-04-26 11:22:17 */
<template>
  <div class="detail" :class="getEditabled ? '' : 'rules-disable'">
    <template>
      <!--      <promptText :order-data="orderData" />-->
      <status-bar :order-data="orderData.baseInfo" />
    </template>
    <div class="tab-change">
      <el-tabs v-model="activeName">
        <el-tab-pane label=" 订单要求 " name="0" />
        <el-tab-pane label=" 附加信息 " name="2" />
      </el-tabs>
      <div class="requirement-info">
        <span style="margin-right: 26px">需求来源：{{ baseInfo.demandSource || '-' }}</span>
        <span>需求单号：{{ baseInfo.demandCode || '-' }}</span>
      </div>
    </div>
    <!-- 订单要求 -->
    <div v-show="activeName === '0'" class="order-request">
      <order-index
        ref="OrderRequest"
        :get-detail-data="getDetailData"
        :current-version-change="currentVersionChange"
        :order-data="orderIndexData"
        :sync-data-handle="syncDataHandle"
        :is-edit="getEditabled"
      />
    </div>
    <!-- 附加信息 -->
    <div v-show="activeName === '2'" class="order-request">
      <additiona ref="OrderInformation" :get-clothing-form="getClothingForm" :order-data="orderData" :is-edit="getEditabled" :sync-data-handle="syncDataHandle" />
    </div>
    <!-- 底部按钮 -->
    <div :class="{ 'fixed-footer': !sidebar }" class="status-button-group">
      <status-button
        :is-copy="isCopy"
        :get-detail-data="getDetailData"
        :set-active-name="setActiveName"
        :is-edit="getEditabled"
        :data="allOrderIndexData"
        :clothing-form="clothingForm"
      />
    </div>
  </div>
</template>

<script>
import additiona from './additionaInformation'
// import promptText from './prompt-text'
import statusBar from './status-bar'
import orderIndex from './orderIndex'
import statusButton from './status-button'
import { getDetail, getDetailCopy, fileListArray } from './api'
import { guestneedDetail } from '@/views/customer-order/sample-orders/detail/api'
import { PublicCustomer } from '@/views/customer-order/public'
export default {
  components: {
    additiona,
    statusBar,
    // promptText,
    orderIndex,
    statusButton
  },
  mixins: [PublicCustomer],
  props: {},
  data() {
    return {
      activeName: '0',
      status: '0',
      orderData: {
        baseInfo: {}
      },
      isEdit: true,
      statusEdit: false,
      orderIndexData: {},
      upconfig: {},
      extraInfo: {},
      isCopy: false,
      clothingForm: null,
      allOrderIndexData: {}
    }
  },
  computed: {
    getEditabled() {
      return this.isEdit && ['0', '2', '4'].includes(this.status)
    },
    baseInfo() {
      return this.orderData.baseInfo || {}
    },
    sidebar() {
      return this.$store.state.app.sidebar.opened
    }
  },
  watch: {
    $route: {
      handler(val, oldVal) {
        // console.log(val)
        const { params, query } = val
        if (params.id) {
          if (query.status) {
            this.isEdit = true
          } else {
            this.isEdit = false
          }
        } else {
          if (query.id) {
            this.isCopy = true
          } else {
            this.isCopy = false
          }
          this.isEdit = true
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    if (this.$route.params.id) {
      this.getDetailData(this.$route.params.id)
    }
    if (this.isCopy) {
      if (this.$route.query.id) {
        this.getDetailData(this.$route.query.id, this.isCopy)
      }
    }
  },
  mounted() {
    if (this.$route.query.requireId) {
      this.getAllQuarter()
      this.getOptionConfigSelect()
      // 从客户需求列表那边跳转过来，若不存在草稿新建部分数据从需求列表详情那边带过来
      this.needDetail({ id: this.$route.query.requireId })
    }
  },
  methods: {
    setlabel(data, type = 1) {
      return type === 1 ? (data ? data + '' : '') : data || ''
    },
    // 需求列表详情
    async needDetail(data = {}) {
      // let that = this
      const res = await guestneedDetail({ ...data })
      const needData = res.data || {}
      let orderTypelable = ''
      let orderTypevalue = ''
      if (needData && needData.developType) {
        // 订单类型:
        if (this.orderTypeArray && this.orderTypeArray.length) {
          orderTypelable = this.getDevelopType(needData.developType)
          this.orderTypeArray &&
            this.orderTypeArray.forEach(item => {
              if (orderTypelable === item.label) {
                orderTypevalue = item.value
              }
            })
        }
      }
      if (needData && needData.quarter) {
        this.allQuarter &&
          this.allQuarter.forEach(item => {
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
      // const obj = { 'Spr': '第一季度', 'Sum': '第二季度', 'Fall': '第三季度', 'Winter': '第四季度' } // CRM的字段
      // const obj1 = { 'Spring': 'Spring', 'Summer': 'Summer', 'Fall': 'Fall', 'Winter': 'Winter', 'middle': 'middle' } // ERP的字段
      const quarterMap = {
        // 字段映射，由于CRM与erp后端的字段不统一
        Spr: 'Spring',
        Sum: 'Summer',
        Fall: 'Fall',
        Winter: 'Winter',
        middle: 'middle'
      }
      console.log(this.allQuarter)
      const quarters = this.allQuarter.filter(n => n.label === quarterMap[needData.quarter])
      let sellQuarter = { value: '', label: '' }
      if (quarters.length === 1) {
        sellQuarter = quarters[0]
      } else {
        sellQuarter = { value: '', label: '' }
      }
      // const sellQuarter = { value: this.setlabel(needData.quarterid), label: this.setlabel(quarterMap[needData.quarter] || needData.quarter, 2) } // 销售季度
      const isSettlement = needData.settlement
      const demandSource = needData.requireFrom // 需求来源
      const demandCode = needData.customerRequireId // 需求单号
      const extraInfo = {
        customerOrderFile: [],
        clothingStyleFile: [],
        otherFile: []
      }
      // 客户订单
      if (needData.orderFilePath) {
        this.clothFlie(needData.orderFilePath.split(','))
      }
      // 成衣款式
      if (needData.styleFilePath) {
        this.StyleFlie(needData.styleFilePath.split(','))
      }
      // 其它
      if (needData.otherFilePath) {
        this.OtherFiles(needData.otherFilePath.split(','))
      }
      // if (needData.orderFilePath) {
      //   extraInfo.customerOrderFile = [
      //     {
      //       text: '客户订单',
      //       id: needData.id,
      //       comType: 'CRM',
      //       name: needData.orderFileName,
      //       url: needData.orderFilePath
      //     }
      //   ]
      // }
      // if (needData.otherFilePath) {
      //   extraInfo.otherFile = [
      //     {
      //       text: '其它',
      //       id: '',
      //       comType: 'CRM',
      //       name: needData.otherFileName,
      //       url: needData.otherFilePath
      //     }
      //   ]
      // }
      // if (needData.styleFilePath) {
      //   extraInfo.clothingStyleFile = [
      //     {
      //       text: '成衣款式',
      //       id: '',
      //       comType: 'CRM',
      //       name: needData.styleFileName,
      //       url: needData.styleFilePath
      //     }
      //   ]
      // }
      const currency = { value: this.setlabel(needData.currencyId), label: this.setlabel(needData.currencyName) }
      const pricingTerm = { value: this.setlabel(needData.priceTerm), label: this.setlabel(needData.priceTermName) }
      const paymentTerm = { value: this.setlabel(needData.payCondition), label: this.setlabel(needData.payConditionName) }
      this.orderData = {
        baseInfo: {
          brand,
          customer,
          seller,
          sellYear,
          sellQuarter,
          currency,
          demandCode,
          demandSource,
          salesTeam,
          orderType
        },
        isSettlement,
        pricingTerm,
        paymentTerm,
        demandCode,
        demandSource,
        salesTeam,
        orderType,
        extraInfo: extraInfo
      }
      if (!this.orderData.hasOwnProperty('detail')) {
        this.orderData.detail = []
      }
      this.orderIndexData = this.$utils.deepClone({ ...this.orderData })
    },
    getOptionConfigSelect() {
      this.getOptionConfig({ pageName: '备坯单', fieldName: '订单类型' }).then(res => {
        this.orderTypeArray = res || []
      })
    },
    getAllQuarter() {
      this.getOptionConfig({ pageName: '备坯单', fieldName: '销售季度' }).then(res => {
        this.allQuarter = res || []
      })
    },
    currentVersionChange(data) {
      this.getDetailData(data)
    },
    setActiveName(val) {
      this.activeName = val
    },
    getClothingForm(form) {
      this.clothingForm = form
    },
    syncDataHandle(key, data) {
      if (key === 'orderIndexData') {
        this.allOrderIndexData = { ...this.allOrderIndexData, ...data }
      } else if (key === 'additionalnformation') {
        this.extraInfo = { ...this.extraInfo, ...data }
        this.allOrderIndexData = { ...this.allOrderIndexData, extraInfo: this.extraInfo }
      }
      console.log('all', this.allOrderIndexData)
    },
    async clothFlie(ids) {
      const res = await fileListArray({ ids: ids })
      if (res.code !== 200) {
        return false
      }
      const resData = res.data
      let fileArr = []
      if (resData && resData.list.length) {
        fileArr = resData.list.map((item, index) => {
          return {
            text: '订单',
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
      const res = await fileListArray({ ids: ids })
      if (res.code !== 200) {
        return false
      }
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
      const res = await fileListArray({ ids: ids })
      if (res.code !== 200) {
        return false
      }
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
    formatData(data) {
      this.orderIndexData = this.$utils.deepClone(data)
      this.orderData = this.$utils.deepClone(data)
      // const extraInfo = data.extraInfo || {}
      const baseInfo = data.baseInfo || {}
      this.status = baseInfo.status
      // console.log(data)
      if ((baseInfo.demandSource && baseInfo.demandCode) || baseInfo.isFromCrm) {
        // extraInfo.customerOrderFile = extraInfo.customerOrderFileUrl && JSON.parse(extraInfo.customerOrderFileUrl) || null
        // extraInfo.clothingStyleFile = extraInfo.clothingStyleFileUrl && JSON.parse(extraInfo.clothingStyleFileUrl) || null
        // extraInfo.otherFile = extraInfo.otherFileUrl && JSON.parse(extraInfo.otherFileUrl) || null
        // this.orderIndexData = this.$utils.deepClone(data)
        // this.orderData = this.$utils.deepClone(data)
      } else {
        this.fileArrSplit()
      }
      this.fileArrSplit()
    },
    // 获取详情数据
    async getDetailData(id, isCopy) {
      if (id) {
        this.statusEdit = false
        let res = {}
        if (isCopy) {
          res = await getDetailCopy({ id: id })
        } else {
          res = await getDetail({ id: id })
        }
        if (res.code !== 200) {
          return false
        }
        // console.log(res)
        this.formatData(res.data)
      }
    }
  }
}
</script>

<style lang="scss">
.detail {
  padding-bottom: 60px;
  margin-top: 20px;
  position: relative;
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
    width: calc(100%);
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
  color: #474747;
  .el-form-item__label::before {
    content: '' !important;
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
    .color-header-colors {
      .color-header-dates .item-title::before {
        content: '' !important;
      }
    }
  }
  .leftTableForm {
    .el-table__header .ruleTip .cell::before {
      content: '';
    }
  }
  .el-form-item--small.el-form-item{
    margin-bottom: 0;
  }
  .el-form-item__label{
    color: #888E9E;
  }
}
.fixed-footer {
  width: calc(100% - 54px) !important;
}
.status-button-group {
  width: calc(100% - 210px);
  transition: width 0.28s;
  position: fixed;
  left: auto;
  display: block;
  text-align: center;
  bottom: 0px;
  padding: 10px 0px;
  background: #ffffff;
  border-top: 1px solid #ecf0f3;
  z-index: 999;
}
</style>
