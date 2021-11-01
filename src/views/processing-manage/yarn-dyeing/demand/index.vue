<!--
 * @Author: xj
 * @Description: 染纱需求
 * @Date: 2021-05-28 14:59:56
 * @LastEditors: anthony
 * @LastEditTime: 2021-07-19 14:30:27
 * @FilePath: e:\erpmu\erp2-processing-v2.0.0\src\views\processing-manage\yarn-dyeing\demand\index.vue
-->
<template>
  <div id="WeavingOrder_cx" class="list processing-detail">
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
            class-name="yarn-dyeing-demand-transition"
            height="256px"
            width="288px"
            :is-show="showMore"
          >
            <!-- 列表   -->
            <template v-slot:left>
              <div class="leftBox">
                <div
                  v-if="getTaskNo && showMore"
                  class="close-right"
                  @click="isShowTask"
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
                    ref="filterTable"
                    :key="activeName"
                    :columns="columns"
                    :max-height="
                      !showMore
                        ? '100%'
                        : ' calc((100vh - 350px})) border-bottom: none'
                    "
                    :height="!showMore ? null : 'calc((100vh - 330px}))'"
                    :row-style="{ cursor: 'pointer' }"
                    :table-scrollx="true"
                    :table-footer="tableFooter"
                    :highlight-current-row="true"
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
                <div class="clearfix" style="position: relative">
                  <div class="title">
                    {{ `染纱生产排厂 (单号：${IndexCode})` }}
                  </div>
                  <div v-if="getorder && !GlobalSwitch" class="button spe">
                    <buttonBar :config="barConfig" :wipe-class="true" />
                  </div>
                </div>
                <!-- 下拉信息 -->
                <div class="page-detail">
                  <details-com
                    :key="activeName"
                    :active-index="activeName"
                    :data="orderIndexData"
                    :is-edit="isEdit"
                    :task-no="getTaskNo"
                    :sync-moudle-data-handle="syncMoudleDataHandle"
                  />
                </div>
              </div>
            </template>
          </transitionWarp>
        </div>
      </div>
    </div>
    <!-- 底部按钮       :index-array="indexArray"-->
    <div
      v-if="isEdit"
      :class="{ 'fixed-footer': !sidebar }"
      class="status-button-group"
    >
      <status-button
        :key="activeName"
        :clothing-form="freshData"
        :get-detail-data="getDetailData"
        :set-active-name="activeName"
        :is-edit="isEdit"
        :data="orderIndexData"
        :index-code="indexRow"
        @okCallback="okCallback"
        @cancelClick="cancelClick"
      />
    </div>
  </div>
</template>

<script>
import {
  list,
  listCom,
  WaitingPlant,
  ListDischarged,
  orderInfo
} from './api/index'
import detailsCom from './detail/details-com'
import transitionWarp from '@/components/transition-wrap/index.vue'
import tableSummation from '@/components/table-summation/index.vue'
import { setOrderFun } from '../public/mou'
import buttonBar from '@/components/button-bar/index.vue'
import statusButton from './detail/status-button'
export default {
  components: { detailsCom, statusButton, buttonBar, transitionWarp },
  mixins: [setOrderFun], // xj
  data() {
    const itemStyle = { width: '33%' }
    const searchData = {
      _taskNo: {
        prop: 'taskNo',
        itemType: 'input',
        label: '任务单号',
        placeholder: '请输入任务单号',
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.taskNo = ''
        },
        clearable: true,
        itemStyle
      },
      _customerName: {
        prop: 'customerName',
        itemType: 'input',
        label: '客户',
        placeholder: '请输入客户',
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.customerName = ''
        },
        clearable: true,
        itemStyle
      },
      _salesTeamName: {
        prop: 'salesTeamName',
        itemType: 'input',
        label: '销售组织',
        placeholder: '请输入销售组织',
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.salesTeamName = ''
        },
        clearable: true,
        itemStyle
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          this.showMore = false
          const newData = JSON.parse(JSON.stringify(params))
          this.searchFormDatas = newData
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
        minWidth: '110',
        showOverflowTooltip: true,
        formater: (scope) => scope.row.taskNo || '-'
        // style: {
        //   color: 'rgb(24, 144, 255)',
        //   cursor: 'pointer'
        // }
      },
      _customerName: {
        prop: 'customerName',
        label: '客户',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => scope.row.customerName || '-'
      },
      _planQty: {
        prop: 'planQty',
        label: '排产数量(KG)',
        align: 'right',
        minWidth: '140',
        isShow: (scope) => {
          return this.activeName === '0'
        },
        showOverflowTooltip: true,
        formater: (scope) => this.DigitalVerification(scope.row.planQty)
      },
      _arrangeQty: {
        prop: 'arrangeQty',
        label: '已排厂量(KG)',
        align: 'right',
        minWidth: '140',
        isShow: (scope) => {
          return this.activeName === '0'
        },
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.DigitalVerification(scope.row.arrangeQty)
        }
      },
      _notQty: {
        prop: 'notQty',
        label: '未排厂量(KG)',
        align: 'right',
        minWidth: '140',
        isShow: (scope) => {
          return this.activeName === '0'
        },
        showOverflowTooltip: true,
        formater: (scope) => this.DigitalVerification(scope.row.notQty)
      },
      _supplierName: {
        prop: 'supplierName',
        label: '染纱厂',
        minWidth: '160',
        isShow: (scope) => {
          return this.activeName === '2'
        },
        showOverflowTooltip: true,
        formater: (scope) => scope.row.supplierName || '-'
      },
      _salesTeamName: {
        prop: 'salesTeamName',
        label: '销售组织',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: (scope) => scope.row.salesTeamName || '-'
      },
      _createdTime: {
        prop: 'createdTime',
        label: '创建时间',
        minWidth: '160',
        isShow: (scope) => {
          return this.activeName === '0'
        },
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.createdTime
            ? this.$filters.parseTime(scope.row.createdTime + '', '{y}-{m}-{d}')
            : '-'
        }
      }
    }
    const tabs = [
      { label: '全部', value: 0, count: 0 },
      { label: '待排厂', value: 1, count: 0 },
      { label: '已排厂', value: 2, count: 0 }
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
    const barConfig = {
      _edit: {
        text: '编辑',
        // buttonClass: 'sub-main',
        isShow: () => {
          return (
            this.activeName === '1' &&
            this.$permission(['pd:pdDyeingDemand:submit']) &&
            !this.isEdit
          )
        },
        submit: () => {
          this.isEdit = true
          this.GlobalSwitch = true
        }
      },
      _allot: {
        text: '变更排厂',
        // buttonClass: 'sub-main',
        isShow: () => {
          const com = this.setOrderStatus(this.orderIndexData.status).text
          return (
            ['待提交', '已回撤'].includes(com) &&
            this.activeName === '2' &&
            this.$permission(['pd:pdDyeingDemand:modify'])
          )
        },
        submit: () => {
          this.isEdit = true
          this.GlobalSwitch = true
        }
      }
    }
    const tableFooter = {
      leftClass: 'weaving-order-pagination_yarn',
      span: undefined,
      component: tableSummation,
      componentOptions: {
        config: {
          _num: {
            title: '数量(KG)：',
            num: 0,
            // tipStyle: 'color:#0986FF',
            formater: (val) => {
              return this.totalNum && Object.keys(this.totalNum).length
                ? this.totalNum.amount
                : '0'
            }
          }
        }
      }
    }
    return {
      tableFooter,
      showMore: false,
      pagination,
      columns,
      barConfig,
      dataSource: [],
      searchData,
      formOptions: {
        size: 'small',
        layout: true,
        inline: true
      },
      status: '',
      isEdit: false,
      orderData: {},
      orderIndexData: {},
      searchFormDatas: {},
      searchParams: {},
      activeName: '1',
      tabs,
      freshData: {},
      allOrderIndexData: {},
      indexRow: {},
      IndexCode: '',
      totalNum: {},
      GlobalSwitch: false
      // indexArray: []
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar.opened
    },
    getorder() {
      return this.orderIndexData && Object.keys(this.orderIndexData).length
    },
    getTaskNo() {
      return (this.indexRow && this.indexRow.taskNo) || ''
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
      this.pagination.amount = val
    }
  },
  created() {
    this.list({}, true)
  },
  methods: {
    isShowTask() {
      this.showMore = !this.showMore
      if (!this.showMore) {
        console.log(this.showMore, 'isHSfsdfs')
        this.clearType()
      }
    },
    // tab页签切换
    handleClick() {
      this.showMore = false
      this.list({}, false)
    },
    syncMoudleDataHandle(key, data) {
      // 同步右侧各个模块的全量表单数据
      this.$nextTick(() => {
        if (key === 'productData') {
          // 同步客样分析编号模块数据
          this.freshData = { ...this.freshData, ...data }
        } else if (key === 'materialData') {
          this.freshData = {
            ...this.freshData,
            demandDetailSubmitRequests: data
          }
        }
      })
    },
    rowClickIndex(row) {
      if (this.activeName !== '0') {
        this.indexRow = row
        this.showMore = true
        this.getDetailData()
      }
    },
    async getDetailData(setval) {
      // 获取详情数据
      let res = ''
      this.clearType(setval)
      this.IndexCode = this.indexRow.taskNo
      if (this.activeName === '2') {
        res = await orderInfo({ orderId: this.indexRow.orderId })
      } else {
        res = await WaitingPlant({ taskNo: this.IndexCode })
      }
      if (this.$pub.responseValidate(res)) {
        this.infoDaTA(res)
      }
    },
    // 详情数据 统一处理
    async infoDaTA(res) {
      const dataTim = Object.assign({}, res.data) || {}
      if (this.activeName === '2') {
        const com = dataTim
        com.demandDetailSubmitRequests = dataTim.orderDetails || []
        delete com.orderDetails
        this.orderData = com
      } else {
        this.orderData.taskNo = this.indexRow.taskNo
        this.orderData.demandDetailSubmitRequests = res.data
      }
      this.orderIndexData = this.$utils.deepClone(this.orderData) // 接口请求慢 赋值不正确
    },
    clearType(setval) {
      if (this.activeName === '1') {
        this.isEdit = setval !== undefined ? !setval : this.showMore
      } else {
        this.isEdit = false
      }
      this.orderIndexData = {}
      this.freshData = {}
      this.orderData = {}
      this.IndexCode = ''
      this.GlobalSwitch = false
      // this.indexArray = []
    },
    // 获取列表数据
    async list(data = {}, fresh) {
      this.clearType()
      let obj = { status: '' }
      if (this.activeName === '1' || fresh) {
        obj = { status: 'N' }
      } else if (this.activeName === '2') {
        obj = { status: 'Y' }
      } else {
        obj = { status: '' }
      }
      let res = ''
      if (this.activeName === '2') {
        res = await ListDischarged({ ...data, ...this.searchFormDatas })
      } else {
        res = await list({ ...data, ...obj, ...this.searchFormDatas })
      }
      if (res.data && res.data.list) {
        res.data.list &&
          res.data.list.map((item, index) => {
            item.index = (res.data.pageNum - 1) * res.data.pageSize + index + 1
          })
      }
      const listData = (res.data && res.data.list) || []
      this.dataSource = listData
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total || 0,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      const dataObj = { ...data, ...obj, ...this.searchFormDatas }
      const amountRes = await listCom(dataObj)
      if (fresh) {
        this.activeName = '1'
      }
      this.totalNum = amountRes && amountRes.data ? amountRes.data : {}
      this.tabs[0].count =
        (this.totalNum &&
          Object.keys(this.totalNum).length &&
          this.totalNum.total) ||
        0
      this.tabs[1].count =
        (this.totalNum &&
          Object.keys(this.totalNum).length &&
          this.totalNum.wait) ||
        0
      this.tabs[2].count =
        (this.totalNum &&
          Object.keys(this.totalNum).length &&
          this.totalNum.plant) ||
        0
      this.tableFooter.componentOptions.config._num.num =
        (this.totalNum &&
          Object.keys(this.totalNum).length &&
          this.totalNum.amount) ||
        0
    },
    okCallback(val) {
      if (val.type === '1') {
        this.activeName = '2'
        this.showMore = false
        this.list({}, false)
      } else {
        this.showMore = false
        this.getDetailData(this.indexRow)
      }
    },
    cancelClick(setval) {
      this.getDetailData(this.indexRow, setval)
    }
  }
}
</script>

<style  lang="scss">
@import "@/styles/base.scss";
#WeavingOrder_cx {
  .el-message-box__status {
    top: 0;
  }
  .yarn-dyeing-demand-transition.transition-wrap {
    background-color: #eef5f9;
    .left-cont {
      background: #fff;
      .el-table {
        width: 100%;
        overflow: auto;
      }
    }
  }
  .el-pagination--small.pagination {
    margin-top: 0;
    text-align: left;
    margin-left: 5px;
  }
  .weaving-order-pagination_yarn {
    height: 40px;
    line-height: 40px;
    margin-top: 20px;
    .TableSummation .total {
      margin: 0 0 0 10px;
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
      // background-color: #eaf3ff !important;
    }
  }
}
</style>
<style lang="scss" scoped>
#WeavingOrder_cx {
  // margin-left: 0  !important;
  // padding-bottom: 60px;
  .main {
    .leftBox {
      position: relative;
    }
    .rightBox {
      padding-bottom: 70px;
      .title {
        width: 100%;
        background: #fff;
        float: left;
        font-size: 18px;
        color: #15112b;
        height: 65px;
        line-height: 65px;
        padding-left: 20px;
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
