<!--
 * @Author: anthony
 * @Description: 染纱需求
 * @Date: 2021-05-28 14:59:56
 * @LastEditors: anthony
 * @LastEditTime: 2021-07-19 14:22:58
 * @FilePath: e:\erpmu\erp2-processing-v2.0.0\src\views\processing-manage\yarn-dyeing\demand\index.vue
-->
<template>
  <div id="print-demand" class="list processing-detail">
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOptions" :form-datas="searchFormDatas" />
    </div>
    <div class="bk " style="position: relative">
      <div class="tabs">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="(i, index) in tabs" :key="index">
            <span slot="label" :name="index">{{ `${i.label} (${i.count})` }}</span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="main">
        <transitionWarp
          height="256px"
          width="288px"
          class-name="print-requisition-transition"
          :is-show="showMore"
          @isShow="
            (val) => {
              showMore = val;
            }
          "
        >
          <!-- 列表 -->
          <template v-slot:left>
            <div class=" leftBox">
              <div
                v-if="getUuid&&showMore"
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
                  'padding-left':'10px'
                }"
              >
                <cs-custom-table
                  :key="activeName"
                  :max-height="
                    !showMore
                      ? '100%'
                      : ' calc((100vh - 350px})) border-bottom: none'
                  "
                  :height="!showMore ? null : 'calc((100vh - 330px}))'"
                  :table-footer="tableFooter"
                  :row-style="{ cursor: 'pointer' }"
                  class="detail-table"
                  :columns="columns"
                  :table-scrollx="true"
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
              <div class="clearfix" style="position: relative">
                <div class="title"> {{ `印花生产排厂 (单号：${IndexCode})` }}  </div>
                <div v-if="getorder" class="button spe">
                  <buttonBar :config="barConfig" :wipe-class="true" />
                </div>
              </div>
              <div class="page-detail">
                <details-com
                  :active-index="activeName"
                  :data="orderIndexData"
                  :is-edit="isEdit"
                  :index-code="IndexCode"
                  :total-planqty="totalPlanqty"
                  :sync-moudle-data-handle="syncMoudleDataHandle"
                  :set-parent-data-handle="setParentDataHandle"
                  @selectArr="selectData($event)"
                />
              </div>
            </div>
          </template>
        </transitionWarp>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div v-if="isEdit" :class="{ 'fixed-footer': !sidebar }" class="status-button-group">
      <status-button
        :clothing-form="freshData"
        :get-detail-data="getDetailData"
        :set-active-name="activeName"
        :is-edit="isEdit"
        :index-code="IndexCode"
        :uuid-close="uuidClose"
        :old-supplier="oldSupplier"
        :cheched-array="chechedArray"
        :data="orderIndexData"
        @okCallback="okCallback"
        @cancelClick="cancelClick"
      />
    </div>
  </div>
</template>

<script>
import { list, planList, listCom, getWaitInfo, getPlanInfo } from './api/index'
import transitionWarp from '@/components/transition-wrap/index.vue'
import detailsCom from './detail/details-com'
import tableSummation from '@/components/table-summation/index.vue'
import buttonBar from '@/components/button-bar/index.vue'
import statusButton from './detail/status-button'
import { setOrderFun } from '../public/mou'
export default {
  components: { detailsCom, buttonBar, statusButton, transitionWarp },
  mixins: [setOrderFun],
  data() {
    const itemStyle = { 'box-sizing': 'border-box',
      'margin-right': '0px',
      'padding-right': '30px',
      'width': '29%' }
    const searchData = {
      _taskNo: {
        prop: 'taskNo',
        itemType: 'input',
        label: '任务单号',
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.taskNo = ''
        },
        clearable: true,
        placeholder: '请输入任务单号',
        itemStyle
      },
      _customerName: {
        prop: 'customerName',
        itemType: 'input',
        label: '客户',
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.customerName = ''
        },
        clearable: true,
        placeholder: '请输入客户',
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
        submitHandle: params => {
          const newData = JSON.parse(JSON.stringify(params))
          this.searchFormDatas = newData
          this.list(newData, false, this.activeName)
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    }
    // 表格表头配置信息/以下五个都是table的配置信息
    const columns = {
      _index: {
        prop: 'index',
        label: '序号',
        minWidth: '60',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _taskNo: {
        prop: 'taskNo',
        label: '任务单号',
        showOverflowTooltip: true,
        minWidth: 140,
        formater: scope => scope.row.taskNo || '-'
        // style: {
        //   color: 'rgb(24, 144, 255)',
        //   cursor: 'pointer'
        // }
      },
      _customerName: {
        prop: 'customerName',
        label: '客户',
        minWidth: 140,
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.customer ? scope.row.customer.label : ''
        }
      },
      _planQty: {
        prop: 'planQty',
        label: '排产数量(KG)',
        align: 'right',
        minWidth: 140,
        isShow: (scope) => {
          return this.activeName === '0'
        },
        showOverflowTooltip: true,
        formater: scope => scope.row.planQty || '-'
      },
      _arrangeQty: {
        prop: 'arrangeQty',
        label: '已排厂量(KG)',
        align: 'right',
        minWidth: 140,
        isShow: (scope) => {
          return this.activeName === '0'
        },
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.arrangeQty || '-'
        }
      },
      _notQty: { // 85ssss
        prop: 'notQty',
        label: '未排厂量(KG)',
        align: 'right',
        minWidth: 140,
        isShow: (scope) => {
          return this.activeName === '0'
        },
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.planQty - scope.row.arrangeQty || '-'
        }
      },
      _suppler: {
        prop: 'supplier',
        label: '印花厂',
        minWidth: 160,
        isShow: (scope) => {
          return this.activeName === '2'
        },
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.supplier ? scope.row.supplier.label : ''
        }
      },
      _salesTeam: {
        prop: 'salesTeam',
        label: '销售组织',
        minWidth: 160,
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.salesTeam ? scope.row.salesTeam.label : ''
        }
      },
      _createdTime: {
        prop: 'createdTime',
        label: '创建时间',
        minWidth: 140,
        isShow: (scope) => {
          return this.activeName === '0'
        },
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.createdTime ? this.$filters.parseTime(scope.row.createdTime + '', '{y}-{m}-{d}') : '-'
        }
      }
    }
    const tabs = [
      { label: '全部', value: 0, count: 0 },
      { label: '待排厂', value: 1, count: 0 },
      { label: '已排厂', value: 2, count: 0 }
    ]
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
              return this.totalNum.amount || '0'
            }
          }
        }
      }
    }
    const pagination = {
      small: false,
      layout: 'total, prev, pager, next,sizes, jumper',
      currentChange: val => {
        const com = { pageSize: this.pagination.pageSize || 20, pageNum: val }
        this.list(com, false)
      },
      sizeChange: val => {
        this.$set(this.pagination, 'currentPage', 1)
        const com = { pageNum: 1, pageSize: val }
        this.list(com, false)
      }
    }
    const barConfig = {
      // _edit: {
      //   text: '编辑',
      //   isShow: () => { return this.activeName === '1' && !this.isEdit && this.$permission(['pd:pdPrintDemand:submit']) },
      //   submit: () => { this.isEdit = true }
      // },
      _allot: {
        text: '变更排厂',
        isShow: () => { return this.activeName === '2' && this.isActive === true && !this.isEdit && this.$permission(['pd:pdPrintDemand:modify']) },
        submit: () => {
          if (this.orderIndexData.status === 'W' || this.orderIndexData.status === 'R') {
            this.isEdit = true
          } else {
            this.$message({ type: 'error', message: '不能变更当前排厂信息' })
            return false
          }
        }
      }
    }

    return {
      tableFooter,
      pagination,
      oldSupplier: {}, // 印花厂存值做比较
      showMore: false,
      columns,
      barConfig,
      dataSource: [],
      searchData,
      formOptions: {
        size: 'small',
        inline: true
      },
      status: '',
      isEdit: true,
      orderData: {},
      orderIndexData: {},
      searchFormDatas: {},
      searchParams: {},
      activeName: '1',
      getUuid: '',
      tabs,
      isActive: false,
      freshData: {},
      indexRow: {},
      showRightFlag: false,
      selectDataArr: [],
      totalNum: [],
      IndexCode: '',
      totalPlanqty: 0, // 待排厂分录印花布总数量
      uuidClose: '', // 详情uuid
      chechedArray: [] // 用户选择的数据
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar.opened
    },
    getorder() {
      return this.orderIndexData && Object.keys(this.orderIndexData).length
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
    this.list({}, false)
  },
  methods: {
    // tab页签切换
    handleClick() {
      this.showRightFlag = false
      this.list({}, false)
      this.showMore = false
    },
    syncMoudleDataHandle(key, data) { // 同步右侧各个模块的全量表单数据
      this.$nextTick(() => {
        if (key === 'productData') { // 同步客样分析编号模块数据
          this.freshData = { ...this.freshData, ...data }
        } else if (key === 'materialData') {
          this.freshData = { ...this.freshData, demandDetailSubmitRequests: data }
        }
      })
    },
    setParentDataHandle(key, data) {
      this[key] = data
    },
    // 点击行获取详情
    rowClickIndex(row) {
      // 在全部页签无法获取详情
      if (this.activeName === '0' || this.activeName === 0) {
        return
      }
      this.indexRow = row
      this.getUuid = row.uuid
      // 获取详情
      this.getDetailData(row.uuid)
    },
    async getDetailData(uuid, type) { // 获取详情数据
      let res = ''
      this.isEdit = false
      this.IndexCode = ''
      this.totalPlanqty = 0
      this.uuidClose = ''
      this.showMore = true
      if (this.activeName === '1') {
        // 待排厂
        res = await getWaitInfo({ 'uuid': uuid })
        if (type === 1) {
          this.isEdit = false
        } else {
          this.isEdit = true
        }
      } else if (this.activeName === '2') {
        // 已排厂
        res = await getPlanInfo({ 'uuid': uuid })
        this.oldSupplier = {}
        this.oldSupplier = res.data && res.data.supplier
        this.isActive = res.data.isActive
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
        this.IndexCode = res.data && res.data.taskNo
        this.uuidClose = res.data && res.data.uuid
        com.demandDetailSubmitRequests = dataTim.orderDetailInfoResponses || []
        delete com.orderDetailInfoResponses
        com.orderDetailInfoResponses = res.data && res.data.pdPrintOrderDetailInfoRespList
        // 已排厂分录的排厂量存值，用做比对
        com.orderDetailInfoResponses.forEach((val, index) => {
          val.firstNum = val.planQty
        })
        com.supplier = res.data && res.data.supplier // 印花厂
        com.pmUser = res.data && res.data.pmUser // 跟单人员
        com.printNo = res.data && res.data.printNo // 印花单号
        com.planTime = res.data && res.data.planTime // 排厂日期
        com.status = res.data && res.data.status // 状态
        com.taskNo = res.data && res.data.taskNo // 任务单号
        com.uuid = res.data && res.data.uuid
        // delete com.pdPrintOrderDetailInfoRespList
        this.orderData = com
      } else {
        this.IndexCode = res.data && res.data.taskNo
        this.totalPlanqty = res.data && res.data.planQty
        this.uuidClose = res.data && res.data.uuid
        delete this.orderData.pdPrintOrderDetailInfoRespList
        this.orderData.orderDetailInfoResponses = res.data && res.data.pdPrintDemandDetailInfoRespList
        // 待排厂印花交期默认等于计划交期
        this.orderData.orderDetailInfoResponses.forEach((val, index) => {
          val.printDelivery = val.planDelivery
        })
      }
      this.orderIndexData = this.$utils.deepClone(this.orderData) // 接口请求慢 赋值不正确
    },
    // 获取列表数据
    async list(data = {}, fresh, type) {
      this.showMore = false
      this.isEdit = false
      this.IndexCode = ''
      this.orderIndexData = {}
      this.freshData = {}
      this.orderData = {}
      this.getUuid = ''
      let res = null
      let listData = []
      let obj = { status: '' }
      if (this.activeName === '1') {
        obj = { status: 'N' }
        res = await list({ ...data, ...obj, ...this.searchFormDatas })
      } else if (this.activeName === '2') {
        obj = { status: 'Y' }
        res = await planList({ ...data, ...obj, ...this.searchFormDatas })
      } else {
        obj = { status: '' }
        res = await list({ ...data, ...obj, ...this.searchFormDatas })
      }
      if (res.data && res.data.list) {
        res.data && res.data.list.map((item, index) => {
          item.index = (res.data.pageNum - 1) * res.data.pageSize + index + 1
        })
      }
      listData = res.data.list || []
      this.dataSource = []
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
      // if (fresh) {
      //   this.activeName = '1'
      // }
      this.totalNum = amountRes && amountRes.data ? amountRes.data : {}
      this.tabs[0].count = this.totalNum.total || 0
      this.tabs[1].count = this.totalNum.wait || 0
      this.tabs[2].count = this.totalNum.plant || 0
    },
    // 收缩显示按钮
    changRightFlag(flag) {
      this.showRightFlag = flag
    },
    // 选择的数据
    selectData(data) {
      this.selectDataArr = data
    },
    closeBtn() {
      this.isEdit = false
    },
    editBtn() {
      this.isEdit = true
    },
    changeBtn() {
      this.isEdit = true
    },
    okCallback(val) {
      if (val.type === '1') {
        this.$message({
          message: '排厂成功',
          type: 'success'
        })
        console.log(val, 'val2222')
        this.activeName = '2'
        this.showMore = false
        this.list({}, false)
      } else if (val.type === '2') {
        this.$message({
          message: '更新排厂成功',
          type: 'success'
        })
        this.list({}, false)
        this.showMore = false
      } else {
        this.$message({
          message: '更新排厂成功,调拨单已取消!',
          type: 'success'
        })
        this.list({}, false)
        this.showMore = false
      }
    },
    cancelClick() { this.getDetailData(this.uuidClose) }
  }
}
</script>

<style  lang="scss">
  @import "@/styles/base.scss";
  .processing-detail.list{
    .weaving-order-pagination {
      height: 40px;
      line-height: 40px;
      margin-top:0px;
      .TableSummation .total {
        margin: 0 0 0 10px;
      }
    }
    .el-pagination--small.pagination {
      margin-top: 0;
      text-align: left;
      margin-left: 5px;
    }
    .print-requisition-transition{
      background-color: #eef5f9;
      .left-cont {
        background: #fff;
        .el-table {
          width: 100%;
          overflow: auto;
        }
      }
    }
  }
   #print-demand {
    .detail {
      .el-table td {
        border-bottom: 1px solid #dfe6ec;
        height: 50px;;
      }
      .el-table th.is-leaf {
        background: #f5f7fa;
        height: 44px;
      }
    }
  }
</style>
<style lang="scss" scoped>
#print-demand {
  padding-bottom: 70px;
  .button.spe {
    position: absolute;
    right: 20px;
    top: 16px;
    z-index: 3;
  }
  .page-detail{}
  .fixed-footer {
    width: calc(100% - 54px) !important;
  }
  .status-button-group {
    width: calc(100% - 210px);
    transition: width 0.28s;
    position: fixed;
    left:auto;
    display: block;
    text-align: center;
    bottom: 0px;
    padding: 10px 0px;
    background: #ffffff;
    border-top: 1px solid #ecf0f3;
    z-index: 999;
  }
  .main {
    .leftBox {
      border-right: 1px solid #e9eff2;
      position: relative;
    }
    .rightBox {
      background: #fff;
      // border-left: 1px solid #e9eff2;
      .title {
        background: #fff;
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
    }
    /deep/ .el-form-item__label-wrap {
        text-align: right;
        margin: 0!important;
        width: 120px;
      }
  }
  .button.spe {
    position: absolute;
    right: 20px;
    top: 14px;
    z-index: 3;
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
  /deep/ .el-form-item__label-wrap {
    text-align: right;
    // margin: 0!important;
    // width: 120px;
  }
  /deep/.search .el-form-item {
    margin-right: 0;
  }
}
</style>
