<!--
 * @Author: 马贝儿
 * @Description: 原纱调拨通知单重构
-->
<template>
  <div id="WeavingOrder_requisitionx" class="list">
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
          <el-tab-pane v-for="(i, index) in tabs" :key="index">
            <span slot="label" :name="index">{{
              `${i.label} (${i.count})`
            }}</span>
          </el-tab-pane>
        </el-tabs>
        <div class="main">
          <transitionWarp
            height="256px"
            width="288px"
            class-name="yarn-dyeing-requisition-transition"
            :is-show="showMore"
            @isShow="
              (val) => {
                showMore = val;
              }
            "
          >
            <!-- 列表   -->
            <template v-slot:left>
              <div class="leftBox">
                <div
                  v-if="getTaskNo"
                  class="close-right"
                  @click="showMore = !showMore"
                >
                  <i
                    :class="{
                      'el-icon-arrow-right': showMore,
                    }"
                  />
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
                    :height="!showMore ? null : 'calc((100vh - 330px}))'"
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
                <!-- 按钮组件 !isEdit-->
                <div
                  class="clearfix"
                  style="position: relative; background: #fff"
                >
                  <div class="title">
                    原纱调拨通知单
                    <el-select
                      v-if="false"
                      v-model="orderIndexData.version"
                      placeholder="请选择"
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
                    :is-edit="isEdit"
                    :data="orderIndexData"
                    :sync-moudle-data-handle="syncMoudleDataHandle"
                  />
                </div>
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
      <status-button
        :clothing-form="freshData"
        :get-detail-data="getDetailData"
        :set-active-name="activeName"
        :is-edit="isEdit"
        :status="getOrdestatus"
        :data="allOrderIndexData"
        :index-code="IndexCode"
        @okCallback="okCallback"
        @JumpSubmitted="JumpSubmitted"
      />
    </div>
  </div>
</template>

<script>
import {
  list,
  orderStatusNum,
  orderInfo,
  orderSubmit,
  orderWithdrawt,
  orderCancel
} from './api/index'
import buttonBar from '@/components/button-bar/index.vue'
import detailsCom from './detail/details-com'
import transitionWarp from '@/components/transition-wrap/index.vue'
import tableSummation from '@/components/table-summation/index.vue'
import statusButton from './detail/status-button'
import { setOrderFun } from '../public/mou'
export default {
  name: 'WeavingOrder',
  components: { buttonBar, detailsCom, statusButton, transitionWarp },
  mixins: [setOrderFun],
  data() {
    const searchData = {
      _noticeNo: {
        prop: 'noticeNo',
        itemType: 'input',
        itemStyle: { width: '25%' },
        label: '通知单号',
        placeholder: '请输入通知单号',
        clearable: true
      },
      _sourceNo: {
        prop: 'sourceNo',
        itemType: 'input',
        itemStyle: { width: '25%' },
        label: '调入单号',
        placeholder: '请输入调入单号',
        clearable: true
      },
      _allotOutAddr: {
        prop: 'allotOutAddr',
        itemType: 'input',
        itemStyle: { width: '25%' },
        label: '调出地址',
        placeholder: '请输入调出地址',
        clearable: true
      },
      _sourceNoAddr: {
        prop: 'sourceNoAddr',
        itemType: 'input',
        itemStyle: { width: '25%' },
        label: '调入地址',
        placeholder: '请输入调入地址',
        clearable: true
      },
      _createdTime: {
        prop: 'createdTime',
        itemType: 'date',
        type: 'daterange',
        label: '创建时间',
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
        clearable: true
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          const newData = JSON.parse(JSON.stringify(params))
          if (params.createdTime) {
            newData.createdTimeStart = params.createdTime[0]
            newData.createdTimeEnd = params.createdTime[1]
          } else {
            newData.createdTimeStart = null
            newData.createdTimeEnd = null
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
      _noticeNo: {
        prop: 'noticeNo',
        label: '通知单号',
        minWidth: '150',
        showOverflowTooltip: true
      },
      _sourceNo: {
        prop: 'sourceNo',
        label: '调入单号',
        minWidth: '150',
        isShow: true,
        showOverflowTooltip: true
      },
      _allotOutAddr: {
        prop: 'allotOutAddr',
        label: '调出地址',
        isShow: true,
        minWidth: '150',
        showOverflowTooltip: true
      },
      _sourceNoAddr: {
        prop: 'sourceNoAddr',
        label: '调入地址',
        isShow: true,
        minWidth: '150',
        showOverflowTooltip: true
      },
      _applyCode: {
        // pm
        prop: 'applyCode',
        label: '调拨数量(KG)',
        align: 'right',
        minWidth: '150',
        isShow: (scope) => {
          return this.activeName === '0'
        },
        showOverflowTooltip: true
      },
      _createdTime: {
        prop: 'createdTime',
        label: '创建时间',
        minWidth: '160',
        isShow: (scope) => {
          return this.activeName === '0'
        },
        showOverflowTooltip: true
      },
      _status: {
        prop: 'status',
        minWidth: '100',
        label: '状态',
        isShow: (scope) => {
          return this.activeName === '0'
        },
        showOverflowTooltip: true
      }
    }
    const tabs = {
      _total: { label: '全部', value: 0, count: 0 },
      _W: { label: '待提交', value: 1, count: 0 },
      _S: { label: '已提交', value: 2, count: 0 },
      _R: { label: '已回撤', value: 3, count: 0 },
      _C: { label: '已取消', value: 4, count: 0 }
    }
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
          _m1: {
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
        // buttonClass: 'sub-main',
        isShow: () => {
          return (
            ['W', 'R'].includes(this.getOrdestatus) &&
            this.$permission(['pd:pdDyeingAllotNotify:modify'])
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
            this.$permission(['pd:pdDyeingAllotNotify:submit'])
          )
        },
        type: '',
        submit: () => {
          this.SubmitClick(this.orderIndexData)
        }
      },
      _withdraw: {
        text: '撤回',
        buttonClass: 'sub-main',
        isShow: () => {
          return (
            this.getOrdestatus === 'S' &&
            this.$permission(['pd:pdDyeingAllotNotify:withdraw'])
          )
        },
        type: '',
        submit: () => {
          this.withdrawClick({ noticeNo: this.orderIndexData.noticeNo })
        }
      },
      _cancel: {
        text: '取消',
        buttonClass: 'sub-main',
        isShow: () => {
          return (
            ['S', 'R'].includes(this.getOrdestatus) &&
            !this.isSubmit &&
            this.$permission(['pd:pdDyeingAllotNotify:cancel'])
          )
        },
        type: '',
        submit: () => {
          this.$confirm('确认取消该条原纱调拨通知单订单信息？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            cancelButtonClass: 'btn-cancel'
          })
            .then(() => {
              this.cancelClick({ noticeNo: this.orderIndexData.noticeNo })
            })
            .catch(() => {
              this.$message({ type: 'info', message: '已取消' })
            })
        }
      }
    }
    return {
      showMore: false,
      barConfig,
      tableFooter,
      versionOptions: [],
      columns,
      isSubmit: false, // 提交按钮
      pagination,
      dataSource: [],
      searchData,
      formOptions: {
        size: 'small',
        layout: true,
        inline: true
      },
      orderData: {},
      isEdit: true,
      orderIndexData: {},
      allOrderIndexData: {},
      searchFormDatas: {},
      searchParams: {},
      activeName: '1',
      tabs,
      freshData: {},
      indexRow: {},
      IndexCode: '',
      totalNum: {}
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
      return (this.indexRow && this.indexRow.noticeNo) || ''
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
    }
  },
  created() {
    if (this.$route.query && this.$route.query.noticeNo) {
      this.activeName = '0'
      this.searchFormDatas = { sourceNo: this.$route.query.noticeNo }
      this.list({})
    } else {
      this.list({}, true)
    }
  },
  methods: {
    // tab页签切换
    handleClick(tabsObj) {
      this.showMore = false
      this.list({}, false)
    },
    clearType() {
      this.isEdit = false
      this.isSubmit = false
      this.orderIndexData = {}
      this.freshData = {}
      this.orderData = {}
      this.IndexCode = ''
      this.GlobalSwitch = false
    },
    getStatusType(fresh) {
      let obj = { status: '' }
      if (this.activeName === '1' || fresh) {
        obj = { status: 'W' }
      } else if (this.activeName === '2') {
        obj = { status: 'S' }
      } else if (this.activeName === '3') {
        obj = { status: 'R' }
      } else if (this.activeName === '4') {
        obj = { status: 'C' }
      } else {
        obj = { status: '' }
      }
      return obj
    },
    // 获取列表数据
    async list(data = {}, fresh) {
      this.clearType()
      const obj = this.getStatusType()
      const res = await list({ ...data, ...obj, ...this.searchFormDatas })
      if (res.data && res.data.list) {
        res.data.list &&
          res.data.list.map((item, index) => {
            item.index = (res.data.pageNum - 1) * res.data.pageSize + index + 1
          })
      }
      this.dataSource = res.data.list || []
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total || 0,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      const dataObj = { ...data, ...obj, ...this.searchFormDatas }
      const amountRes = await orderStatusNum(dataObj)
      if (fresh) {
        this.activeName = '1'
      }
      this.totalNum = amountRes && amountRes.data ? amountRes.data : {}
      for (var i in amountRes.data) {
        this.tabs[`_${i}`]
          ? (this.tabs[`_${i}`].count = amountRes.data[i])
          : ''
      }
      if (this.$route.query && this.$route.query.noticeNo) {
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
          }
        }
      })
    },
    async getDetailData(id) {
      // 获取详情数据
      this.clearType()
      const res = await orderInfo({ noticeNo: this.indexRow.noticeNo })
      if (res.code !== 200) {
        return false
      }
      // const versions = res.data.versions || []
      // this.versionOptions = (versions.length && versions.map((i) => ({ label: `V${i}`, value: i }))) || []
      this.infoDaTA(res)
    },
    async infoDaTA(res) {
      // 详情数据 统一处理
      const dataTim = Object.assign({}, res.data) || {}
      this.IndexCode = dataTim.noticeNo
      this.orderData = dataTim
      this.orderIndexData = this.$utils.deepClone(this.orderData) // 接口请求慢 赋值不正确
      this.freshData = this.orderIndexData
    },
    rowClickIndex(row) {
      this.showMore = true
      this.indexRow = row
      this.getDetailData()
    },
    okCallback() {
      this.list({}, true)
    },
    async SubmitClick(parem = {}) {
      // 提交接口
      const res = await orderSubmit(parem)
      if (res.code !== 200) {
        return false
      }
      this.showMore = false
      this.activeName = '2'
      this.list({}, false)
    },
    async withdrawClick(parem = {}) {
      // 撤回
      const res = await orderWithdrawt(parem)
      if (res.code !== 200) {
        return false
      }
      this.showMore = false
      this.activeName = '3'
      this.list({}, false)
    },
    async cancelClick(parem = {}) {
      // 取消
      const res = await orderCancel(parem)
      if (res.code !== 200) {
        return false
      }
      this.showMore = false
      this.activeName = this.orderIndexData.status === 'S' ? '4' : '2'
      this.list({}, false)
    },
    JumpSubmitted() {
      this.showMore = false
      this.activeName = '2'
      this.list({}, false)
    }
  }
}
</script>

<style  lang="scss">
@import "@/styles/base.scss";
#WeavingOrder_requisitionx {
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
  .yarn-dyeing-requisition-transition.transition-wrap {
    background-color: #eef5f9;
    .left-cont {
      background: #fff;
      .el-table {
        width: 100%;
        overflow: auto;
      }
    }
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
    .el-table__body tr.current-row > td {
      // background-color: #EAF3FF !important;
      // height: 44px;
    }
  }
}
</style>
<style lang="scss" scoped>
#WeavingOrder_requisitionx {
  .main {
    .leftBox {
      position: relative;
    }
    .rightBox {
      padding-bottom: 70px;
      background: #eef5f9;
      border-left: none;
      .title {
        float: left;
        font-size: 18px;
        color: #15112b;
        height: 65px;
        line-height: 65px;
        padding-left: 20px;
        .el-select {
          margin-left: 10px;
          width: 100px;
        }
      }
      .button_title {
        float: right;
        line-height: 60px;
        margin-right: 20px;
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
}
</style>
