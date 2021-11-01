<!--
 * @Author: xj
 * @Description: 染纱订单
 * @Date: 2021-05-28 14:59:56
 * @LastEditors: lsl
 * @LastEditTime: 2021-07-17 09:26:02
 * @FilePath: e:\erpmu\erp2-processing-v2.0.0\src\views\processing-manage\yarn-dyeing-V1\order\index.vue
-->

<template>
  <div class="list WeavingOrder_order_index">
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOptions"
        :form-datas="searchFormDatas"
      />
    </div>
    <div class="bk" style="position: relative">
      <div class="tabs">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="(i, index) in tabs" :key="index" :name="i.value">
            <span slot="label">{{
              `${i.label} (${i.count})`
            }}</span>
          </el-tab-pane>
        </el-tabs>
        <div class="main">
          <transitionWarp
            class-name="yarn-dyeing-order-transition"
            height="256px"
            width="288px"
            :is-show="showMore"
            @isShow="
              (val) => {
                showMore = val;
              }
            "
          >
            <!-- 列表 -->
            <template v-slot:left>
              <div class="leftBox">
                <div
                  v-if="getTaskNo && showMore"
                  class="close-right"
                  @click="showMore = !showMore"
                >
                  <i :class="{ 'el-icon-arrow-right': showMore }" />
                </div>
                <div
                  class="detail"
                  :class="{ 'page-table': !showMore }"
                  :style="{
                    height: !showMore ? '100%' : 'calc((100vh - 256px}))',
                    'padding-left': '10px',
                  }"
                >
                  <cs-custom-table
                    :key="activeName"
                    :max-height="!showMore ? '100%' : ' calc((100vh - 350px}))'"
                    :table-footer="tableFooter"
                    :highlight-current-row="true"
                    :table-scrollx="true"
                    :row-style="{ cursor: 'pointer' }"
                    :columns="columns"
                    :data-source="dataSource"
                    :pagination="pagination"
                    edit-type="pop"
                    @row-click="rowClickIndex"
                  />
                </div>
              </div>
            </template>
            <!-- 详情 -->
            <template v-slot:right>
              <div class="rightBox">
                <!-- 按钮组件 -->
                <div
                  class="clearfix"
                  style="position: relative; background: #fff"
                >
                  <div class="title">
                    染纱订单详情
                    <el-select
                      v-if="!isEdit"
                      v-model="orderIndexData.version"
                      placeholder="请选择"
                      @change="changeVersion"
                    >
                      <el-option
                        v-for="item in versionOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                  <div v-if="getTaskNo && !GlobalSwitch" class="button spe">
                    <buttonBar :config="barConfig" :wipe-class="true" />
                  </div>
                </div>
                <!-- 下拉信息 -->
                <div class="page-detail">
                  <details-com
                    :active-index="activeName"
                    :data="orderIndexData"
                    :is-edit="isEdit"
                    :index-code="IndexCode"
                    :sync-moudle-data-handle="syncMoudleDataHandle"
                    :set-parent-data-handle="setParentDataHandle"
                  />
                </div>
                <details-pup
                  ref="codePop"
                  :row-data="indexRow"
                  :sync-moudle-data-handle="syncMoudleDataHandle"
                  @AllocationClcik="AllocationClcik"
                />
              </div>
            </template>
          </transitionWarp>
        </div>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div
      v-if="isEdit"
      :class="{ 'fixed-footer': !sidebar }"
      class="status-button-group"
    >

      <!-- :data="allOrderIndexData" -->
      <!-- <status-button
        :clothing-form="freshData"
        :get-detail-data="getDetailData"
        :set-active-name="activeName"
        :is-edit="isEdit"
        :status="getOrdestatus"
        :index-code="IndexCode"
        @okCallback="okCallback"
        @JumpSubmitted="JumpSubmitted"
      /> -->
      <el-button
        v-if="submit_isShow"
        type="primary"
        @click="orderDataSubmit"
      >提交</el-button>
      <el-button v-if="submit_isShow" @click="getDetailData()">取消</el-button>
    </div>
  </div>
</template>

<script>
import { list, orderStatusNum, fileListArray, orderInfo, orderSubmit, orderWithdrawt, orderCancel, orderFinish, TransferNotice } from './api/index'
import buttonBar from '@/components/button-bar/index.vue'
import detailsCom from './detail/details-com'
import detailsPup from './detail/details-pup'
import transitionWarp from '@/components/transition-wrap/index.vue'
import tableSummation from '@/components/table-summation/index.vue'
import { setOrderFun } from '../public/mou'
// import statusButton from './detail/status-button'
export default {
  components: {
    buttonBar,
    detailsCom,
    detailsPup,
    // statusButton,
    transitionWarp
  },
  mixins: [setOrderFun],
  data() {
    const searchData = {
      _orderId: {
        prop: 'orderId',
        itemType: 'input',
        placeholder: '请输入染纱订单号',
        itemStyle: { width: '25%' },
        label: '染纱单号',
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.orderId = ''
        },
        clearable: true
      },
      _customerName: {
        prop: 'customerName',
        itemType: 'input',
        label: '客户',
        placeholder: '请输入客户',
        itemStyle: { width: '25%' },
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.customerName = ''
        },
        clearable: true
      },
      _supplierName: {
        prop: 'supplierName',
        itemType: 'input',
        label: '染纱厂',
        placeholder: '请输入染纱厂',
        itemStyle: { width: '23%' },
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.supplierName = ''
        },
        clearable: true
      },
      _dyeingDelivery: {
        prop: 'dyeingDelivery',
        itemType: 'date',
        type: 'daterange',
        label: '染纱交期',
        placeholder: '请输入染纱交期',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59'],
        itemStyle: { width: '25%' }
      },
      _pmUserName: {
        prop: 'pmUserName',
        itemType: 'input',
        itemStyle: { width: '25%' },
        label: '跟单人',
        placeholder: '请输入跟单人',
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.pmUserName = ''
        },
        clearable: true
      },
      _salesTeamName: {
        prop: 'salesTeamName',
        itemType: 'input',
        placeholder: '请输入销售组织',
        itemStyle: { width: '25%' },
        label: '销售组织',
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.salesTeamName = ''
        },
        clearable: true
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          const newData = JSON.parse(JSON.stringify(params))
          if (params.dyeingDelivery) {
            newData.dyeingDeliveryStart = params.dyeingDelivery[0]
            newData.dyeingDeliveryEnd = params.dyeingDelivery[1]
          } else {
            newData.dyeingDeliveryStart = null
            newData.dyeingDeliveryEnd = null
          }
          this.searchFormDatas = newData
          this.showMore = false
          this.list(newData)
        },
        resetHandle: () => {
          this.showMore = false
          this.searchFormDatas = {}
        }
      }
    }
    // 表格表头配置信息/以下五个都是table的配置信息
    const columns = {
      _index: {
        prop: 'index',
        minWidth: '50',
        label: '序号'
      },
      _taskNo: {
        prop: 'taskNo',
        label: '任务单号',
        minWidth: '150',
        isShow: (scope) => {
          return this.activeName === '2'
        },
        showOverflowTooltip: true,
        formater: (scope) => scope.row.taskNo || '-'
      },
      _orderId: {
        prop: 'orderId',
        minWidth: '150',
        label: '染纱单号',
        showOverflowTooltip: true,
        formater: (scope) => scope.row.orderId || '-'
      },
      _customerName: {
        prop: 'customerName',
        label: '客户',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => scope.row.customerName || '-'
      },
      _factoryNum: {
        prop: 'factoryNum',
        label: '染纱数量(KG)',
        minWidth: 120,
        align: 'right',
        isShow: (scope) => {
          return this.activeName === '0'
        },
        showOverflowTooltip: true,
        formater: (scope) => this.DigitalVerification(scope.row.factoryNum)
      },
      _yarnNum: {
        prop: 'yarnNum',
        label: '坯纱数量(KG)',
        align: 'right',
        minWidth: 120,
        isShow: (scope) => {
          return this.activeName === '0'
        },
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.DigitalVerification(scope.row.yarnNum)
        }
      },
      _supplierName: {
        prop: 'supplierName',
        label: '染纱厂',
        minWidth: '150',
        isShow: true,
        showOverflowTooltip: true,
        formater: (scope) => scope.row.supplierName || '-'
      },
      _salesTeamName: {
        prop: 'salesTeamName',
        label: '销售组织',
        minWidth: '150',
        isShow: true,
        showOverflowTooltip: true,
        formater: (scope) => scope.row.salesTeamName || '-'
      },
      _createdTime: {
        prop: 'createdTime',
        label: '创建日期',
        minWidth: '150',
        isShow: (scope) => {
          return this.activeName === '0'
        },
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.createdTime
            ? this.$filters.parseTime(scope.row.createdTime + '', '{y}-{m}-{d}')
            : '-'
        }
      },
      _status: {
        prop: 'status',
        label: '状态',
        minWidth: '100',
        isShow: (scope) => {
          return this.activeName === '0'
        },
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.getStatus(scope.row.status)
        }
      }
    }
    // WAIT("W", "待提交"),
    // SUBMIT("S", "已提交"),
    // RECALL("R", "撤回"),
    // CANCEL("C", "取消"),
    // FINISH("F", "完工"),
    const tabs = [
      { label: '全部', value: '0', status: undefined, count: 0 },
      { label: '待提交', value: '1', status: 'W', count: 0 },
      { label: '已提交', value: '2', status: 'S', count: 0 },
      { label: '已回撤', value: '3', status: 'R', count: 0 },
      { label: '已完工', value: '4', status: 'F', count: 0 },
      { label: '已取消', value: '5', status: 'C', count: 0 }
    ]
    const pagination = {
      small: false,
      layout: 'total, prev, pager, next,sizes, jumper',
      currentChange: (val) => {
        const com = { pageSize: this.pagination.pageSize || 20, pageNum: val }
        this.list(com, false)
      },
      sizeChange: (val) => {
        this.$set(this.pagination, 'currentPage', 1)
        const com = { pageNum: 1, pageSize: val }
        this.list(com, false)
      }
    }
    const tableFooter = {
      leftClass: 'weaving-order-pagination',
      span: undefined,
      component: tableSummation,
      componentOptions: {
        config: {
          m1: {
            title: '数量(KG)：',
            num: 0,
            formater: (val) => {
              return this.totalNum && Object.keys(this.totalNum).length
                ? this.totalNum.amount
                : '0'
            }
          }
        }
      }
    }
    const barConfig = {
      _orderChange: {
        text: '变更',
        isShow: () => {
          return (
            this.getOrdestatus === 'W' &&
            this.aut &&
            this.$permission(['pd:pdDyeingOrder:modify'])
          )
        },
        type: '',
        submit: () => {
          this.isEdit = true
          this.isSubmit = true
          this.GlobalSwitch = true
        }
      },
      _Submit: {
        text: '提交',
        buttonClass: 'sub-main',
        isShow: () => {
          return (
            this.getOrdestatus === 'W' &&
            !this.isSubmit &&
            this.aut &&
            this.$permission(['pd:pdDyeingOrder:submit'])
          )
        },
        type: '',
        submit: () => {
          this.SubmitClick()
        }
      },
      _Allocation: {
        text: '原料调配',
        buttonClass: 'sub-main',
        isShow: () => {
          return (
            this.getOrdestatus === 'S' &&
            this.aut &&
            this.$permission(['pd:pdDyeingOrder:material:detail:submit'])
          )
        },
        type: '',
        submit: () => {
          this.addAllInfo()
        }
      },
      _withdraw: {
        text: '撤回',
        buttonClass: 'sub-main',
        isShow: () => {
          return (
            this.getOrdestatus === 'S' &&
            this.aut &&
            this.$permission(['pd:pdDyeingOrder:withdraw'])
          )
        },
        type: '',
        submit: () => {
          this.indexRow.orderId &&
            this.withdrawClick({ orderId: this.indexRow.orderId })
        }
      },
      _cancel: {
        text: '取消',
        buttonClass: 'sub-main',
        isShow: () => {
          return (
            ['S', 'R'].includes(this.getOrdestatus) &&
            this.aut &&
            this.$permission(['pd:pdDyeingOrder:cancel'])
          )
        },
        type: '',
        submit: () => {
          this.$confirm('确认取消该条染纱订单信息？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'WeavingOrder_order_index'
          })
            .then(() => {
              this.indexRow.orderId &&
                this.cancelClick({ orderId: this.indexRow.orderId })
            })
            .catch(() => {
              this.$message({ type: 'info', message: '已取消' })
            })
        }
      },
      _orderFinish: {
        text: '完工',
        buttonClass: 'sub-main',
        isShow: () => {
          return (
            this.getOrdestatus === 'S' &&
            this.aut &&
            this.$permission(['pd:pdDyeingOrder:finish'])
          )
        },
        type: '',
        submit: () => {
          this.$confirm('确认完工该条染纱订单信息？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'WeavingOrder_order_index'
          })
            .then(() => {
              this.indexRow.orderId &&
                this.orderFinish({ orderId: this.orderIndexData.orderId })
            })
            .catch(() => {
              this.$message({ type: 'info', message: '已取消完结' })
            })
        }
      },
      _print: {
        text: '打印预览',
        buttonClass: 'sub-main',
        isShow: () => {
          // 已提交、已完工状态的染纱订单详情显示打印预览按钮
          return (
            (this.getOrdestatus === 'S' || this.getOrdestatus === 'F') &&
            this.aut
          )
        },
        submit: () => { this.$router.push('/processing/yarn-dyeing/order/print/' + this.indexRow.orderId) }
      }
    }
    return {
      tableFooter,
      showMore: false,
      versionOptions: [],
      barConfig,
      columns,
      pagination,
      dataSource: [{ mbe1: 1 }],
      searchData,
      orderIndexData: {},
      // allOrderIndexData: {},
      formOptions: {
        size: 'small',
        layout: true,
        inline: true
      },
      isEdit: true,
      isSubmit: false, // 提交按钮
      searchFormDatas: {},
      searchParams: {},
      activeName: '1',
      tabs,
      IndexCode: '',
      totalNum: {},
      orderData: {},
      indexRow: {},
      freshData: {},
      detailFormDatas: {},
      GlobalSwitch: false
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar.opened
    },
    getOrdestatus() {
      return (this.orderIndexData && this.orderIndexData.status) || ''
    },
    getTaskNo() {
      return (this.indexRow && this.indexRow.orderId) || ''
    },
    aut() {
      if (
        this.versionOptions &&
        this.versionOptions.length &&
        this.versionOptions[this.versionOptions.length - 1].value
      ) {
        return (
          this.detailFormDatas.version ===
          this.versionOptions[this.versionOptions.length - 1].value
        )
      }
      return false
    },
    // cancel_isShow() { // 取消
    //   return this.isEdit && ['W'].includes(this.getOrdestatus)
    // },
    // 取消与提交同状态显示
    submit_isShow() {
      // WAIT("W", "待提交"),
      // SUBMIT("S", "已提交"),
      // RECALL("R", "撤回"),
      // CANCEL("C", "取消"),
      // FINISH("F", "完工"),
      return this.isEdit && ['W'].includes(this.getOrdestatus)
    }
  },
  watch: {
    showMore(val) {
      if (val) {
        this.tableFooter.span = 24
        this.pagination.layout = 'prev, pager, next'
      } else {
        this.tableFooter.span = undefined
        this.pagination.layout = 'total, prev, pager, next,sizes, jumper'
      }
      this.pagination.small = val
    },
    columns: {
      handler(val, oldVal) {},
      deep: true,
      immediate: true
    }
  },
  created() {
    if (this.$route.query && this.$route.query.orderId) {
      this.activeName = '0'
      this.searchFormDatas = { orderId: this.$route.query.orderId }
      this.searchParams = { orderId: this.$route.query.orderId }
      this.list({ orderId: this.$route.query.orderId })
    } else {
      this.activeName = '1'
      this.list()
    }
  },
  methods: {
    changeVersion(val) {
      this.getDetailData({ orderId: this.indexRow.orderId, version: val })
    },
    // tab页签切换
    handleClick() {
      this.showMore = false
      this.list()
    },
    clearType() {
      this.isEdit = false
      this.isSubmit = false
      this.orderIndexData = {}
      this.freshData = {}
      this.orderData = {}
      this.IndexCode = ''
      this.GlobalSwitch = false
      this.detailFormDatas = {}
    },
    // 获取列表数据
    async list(data = {}) {
      this.clearType()
      // 修改 获取状态方式
      const { status } = this.tabs.find(t => t.value === this.activeName) || {}
      const res = await list({ ...data, status: status, ...this.searchFormDatas })
      if (res.data && res.data.list) {
        res.data.list &&
          res.data.list.map((item, index) => {
            item.index = (res.data.pageNum - 1) * res.data.pageSize + index + 1
          })
      }
      const listData = res.data.list || []
      this.dataSource = listData
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total || 0,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      const dataObj = { ...data, status: status, ...this.searchFormDatas }
      const amountRes = await orderStatusNum(dataObj)
      this.totalNum = amountRes && amountRes.data ? amountRes.data : {}
      const comIndex = this.totalNum
      // 修改 tab栏 cont赋值
      this.tabs.forEach(item => {
        //  status为undefined 取所有值
        if (!item.status) {
          item.count = comIndex.total
        } else {
          item.count = comIndex[item.status]
        }
      })
      // 如果 query中有参数时
      if (this.$route.query && this.$route.query.orderId) {
        this.getDetailData(data)
        this.showMore = true
        this.$router.replace({})
      }
    },
    syncMoudleDataHandle(key, data) {
      // 同步右侧各个模块的全量表单数据
      this.$nextTick(() => {
        if (key === 'productData') {
          // 同步客样分析编号模块数据
          this.freshData = { ...this.freshData, ...data }
        } else if (key === 'materialData') {
          if (
            this.freshData &&
            this.freshData.details &&
            this.freshData.details.length
          ) {
            this.freshData = { ...this.freshData, details: data }
            // 最终版本
            // const { idindex, tableForm } = data
            // this.freshData.details[idindex].orderDetails=tableForm
          }
        }
      })
    },
    setParentDataHandle() {},
    async SubmitClick() {
      // 提交
      const YUN = this.$utils.deepClone(this.orderIndexData)
      YUN.attachmentPath = this.setUploadFile(YUN.attachmentPath)
      const res = await orderSubmit(YUN)
      if (res.code !== 200) {
        return false
      }
      this.showMore = false
      this.activeName = '2'
      this.list()
    },
    async withdrawClick(parem = {}) {
      // 撤回
      const res = await orderWithdrawt(parem)
      if (res.code !== 200) {
        return false
      }
      this.showMore = false
      this.activeName = '3'
      this.list()
    },
    async cancelClick(parem = {}) {
      // 取消
      const res = await orderCancel(parem)
      if (res.code !== 200) {
        return false
      }
      this.showMore = false
      this.activeName = this.indexRow.status === 'S' ? '5' : '2'
      this.list()
    },
    async orderFinish(parem = {}) {
      // 完结
      const res = await orderFinish(parem)
      if (res.code !== 200) {
        return false
      }
      this.showMore = false
      this.activeName = '4'
      this.list()
    },
    addAllInfo() {
      this.$refs.codePop.popHandle()
    },
    rowClickIndex(row) {
      this.showMore = true
      this.indexRow = row
      this.getDetailData()
    },
    okCallback() {
      this.handleClick()
    },
    async AllocationClcik(parem) {
      // 原料调拨确定
      const res = await TransferNotice(parem)
      this.showMore = false
      if (res.code !== 200) {
        return false
      }
      this.list()
    },
    async getDetailData(data = {}) {
      // 获取详情数据
      this.clearType()
      let obj = {}
      if (Object.keys(data).length) {
        obj = data
      } else {
        obj = { orderId: this.indexRow.orderId }
      }
      console.log(obj, this.indexRow.orderId, 'this.indexRow.orderId')
      const res = await orderInfo(obj)
      if (res.code !== 200) {
        return false
      }
      this.detailFormDatas = res.data || {}
      const versions = res.data.versions || []
      this.versionOptions =
        (versions.length &&
          versions.map((i) => ({ label: `V${i}`, value: i }))) ||
        []
      this.infoDaTA(res)
    },
    async infoDaTA(res) {
      // 详情数据 统一处理
      const dataTim = Object.assign({}, res.data) || {}
      this.IndexCode = dataTim.orderId
      this.fileArrSplit(dataTim.attachmentPath)
      this.orderData = dataTim
      this.orderIndexData = this.$utils.deepClone(this.orderData) // 接口请求慢 赋值不正确
      this.freshData = this.$utils.deepClone(this.orderData)
    },
    // 附件上传切割
    fileArrSplit(Tim) {
      const StyleFile = Tim && Tim.split(',')
      StyleFile && this.clothFlie(StyleFile)
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
            id: item.id,
            name: item.originalName,
            url: item.viewUrl || item.url || ''
          }
        })
      }
      this.orderData.attachmentPath = fileArr
      this.orderIndexData = this.$utils.deepClone(this.orderData) // 接口请求慢 赋值不正确
    },
    JumpSubmitted() {
      this.showMore = false
      this.activeName = '2'
      this.list()
    },
    // 提交
    async orderDataSubmit() {
      console.log(this.getOrdestatus)
      if (['N', 'W'].includes(this.getOrdestatus)) {
        this.SubmitRequired()
      } else {
        console.log('woY')
      }
    },
    async SubmitRequired() {
      const { beforeCode, afterCode } = this.$utils.compareData(this.freshData, {}, 'id')
      const parem = this.$utils.deepClone(this.freshData)
      // 文件字符串化
      parem.attachmentPath = this.setUploadFile(parem.attachmentPath)
      const res = await orderSubmit(parem)
      if (res.code !== 200) { return false }
      this.JumpSubmitted()
      // 修改参数
      const description = {
        beforeText: `在'加工管理-染纱订单'将${JSON.stringify({ 'id': parem.orderId })}`,
        afterText: '修改为',
        ...{ beforeCode, afterCode }
      }
      const pcdata = this.freshData
      this.$store.dispatch('app/fetchParamsLog', { pcdata, opratorType: `UPDATE`, api: '/processingMgr/pdDyeingOrder/submit', description, appId: 'process' })
    }
  }
}
</script>

<style  lang="scss">
@import "@/styles/base.scss";
.WeavingOrder_order_index {
  .el-message-box__status {
    top: 0;
  }
  .yarn-dyeing-order-transition.transition-wrap {
    background-color: #eef5f9;
    .left-cont {
      background: #fff;
      .el-table {
        width: 100%;
        overflow: auto;
      }
    }
  }
  .weaving-order-pagination {
    height: 40px;
    line-height: 40px;
    margin-top: 20px;
    .TableSummation .total {
      margin: 0 0 0 10px;
    }
  }
  .el-pagination--small.pagination {
    margin-top: 0;
    text-align: left;
    margin-left: 5px;
  }
  .detail {
    .el-table th.is-leaf,
    .el-table td {
      border-bottom: 1px solid #dfe6ec;
      height: 50px;
    }
    .el-table th.is-leaf {
      background: #f5f7fa;
      height: 44px;
    }
  }
  .detail-branch-detail-form {
    background: #fff;
    // height: 62px;
    line-height: 62px;
    padding: 0 20px;
    margin-top: 0;
    .el-form-item__label {
      color: #888e9e;
      line-height: 28px;
    }
    .el-form-item__content {
      line-height: 28px;
      color: #474747;
    }
  }
  .right-cont {
    border-left: none !important;
  }
}
</style>
<style lang="scss" scoped>
.WeavingOrder_order_index {
  .main {
    .leftBox {
      position: relative;
    }
    .rightBox {
      padding-bottom: 70px;
      background: #eef5f9;
      border-left: 1px solid #e9eff2;
      .title {
        font-size: 18px;
        color: #15112b;
        height: 65px;
        float: left;
        line-height: 65px;
        padding-left: 20px;
        .el-select {
          margin-left: 10px;
          width: 100px;
          /deep/.el-input--medium .el-input__inner {
            height: 32px;
            line-height: 32px;
          }
        }
      }
    }
  }
  .button.spe {
    position: absolute;
    right: 20px;
    top: 16px;
    z-index: 3;
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
  .close-right {
    position: absolute;
    right: 8px;
    top: 10px;
    width: 22px;
    height: 22px;
    z-index: 2;
    background: #fff;
    border-radius: 50px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    color: #7c7c7c;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid #afafaf;
    :hover {
      color: #1890ff;
    }
  }
  /deep/ .el-table::before {
    height: 0 !important;
  }
}
</style>
