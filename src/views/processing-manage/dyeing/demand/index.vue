<!--
 * @Author: hzq
 * @Description: 染整需求列表分录
 * @Date: 2021-06-1 14:59:56
 * @LastEditors: anthony
 * @LastEditTime: 2021-07-19 14:21:29
 * @FilePath: e:\erpmu\erp2-processing-v2.0.0\src\views\processing-manage\dyeing\demand\index.vue
-->
<template>
  <div id="DyeingDemand" class="list processing-detail">
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
            <span slot="label" :name="index">{{ `${i.label} (${i.count})` }}</span>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="main">
        <transitionWarp
          class-name="dyeing-demand-transition"
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
                v-if="indexRow.uuid&&showMore"
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
                  :height="!showMore ? null : 'calc((100vh - 330px}))'"
                  :table-footer="tableFooter"
                  :highlight-current-row="true"
                  :table-scrollx="true"
                  :row-style="{ cursor: 'pointer' }"
                  :columns="columns"
                  :data-source="dataSource"
                  :pagination="pagination"
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
                <div class="title"> {{ `染整生产排厂 (单号：${IndexCode})` }}  </div>
                <div v-if="getorder" class="button spe">
                  <buttonBar :config="barConfig" :wipe-class="true" />
                </div>
              </div>
              <!-- 染整需求详情列表 -->
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
              <!-- 底部按钮 -->
              <div v-if="isEdit" :class="{ 'fixed-footer': !sidebar }" class="status-button-group">
                <status-button
                  :clothing-form="freshData"
                  :get-detail-data="getDetailData"
                  :set-active-name="activeName"
                  :is-edit="isEdit"
                  :index-row="indexRow"
                  :old-supplier="oldSupplier"
                  :cheched-array="chechedArray"
                  :data="orderIndexData"
                  :index-code="IndexCode"
                  @okCallback="okCallback"
                  @cancelClick="cancelClick"
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
        :index-row="indexRow"
        :old-supplier="oldSupplier"
        :cheched-array="chechedArray"
        :data="orderIndexData"
        :index-code="IndexCode"
        @okCallback="okCallback"
        @cancelClick="cancelClick"
      />
    </div>
  </div>
</template>

<script>
import transitionWarp from '@/components/transition-wrap/index.vue'
import { list, planList, count, getWaitInfo, getPlanInfo } from './api/index'
import detailsCom from './detail/details-com'
import tableSummation from '@/components/table-summation/index.vue'
import buttonBar from '@/components/button-bar/index.vue'
import statusButton from './detail/status-button'
import { setOrderFun } from '../public/mou'
export default {
  components: { buttonBar, detailsCom, statusButton, transitionWarp },
  mixins: [setOrderFun],
  data() {
    // 表单搜索form表单
    const itemStyle = { 'box-sizing': 'border-box',
      'margin-right': '0px',
      'padding-right': '30px',
      'width': '29%' }
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
        submitHandle: params => {
          const newData = JSON.parse(JSON.stringify(params))
          this.searchFormDatas = newData
          this.showMore = false
          this.list(newData)
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    }
    // 表格表头配置信息/以下几个都是table的配置信息
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
        minWidth: 120,
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
          return scope.row.customerName || '-'
        }
      },
      _planQty: {
        prop: 'planQty',
        label: '排产数量(KG)',
        align: 'right',
        minWidth: 140,
        isShow: (scope) => {
          return this.activeName === 'A'
        },
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.planQty || '-'
        }
      },
      _arrangeQty: {
        prop: 'arrangeQty',
        label: '已排厂量(KG)',
        align: 'right',
        minWidth: 140,
        isShow: (scope) => {
          return this.activeName === 'A'
        },
        showOverflowTooltip: true,
        formater: scope => scope.row.arrangeQty || '-'
      },
      _notQty: {
        prop: 'notQty',
        label: '未排厂量(KG)',
        align: 'right',
        minWidth: 140,
        isShow: (scope) => {
          return this.activeName === 'A'
        },
        showOverflowTooltip: true,
        formater: scope => Number(scope.row.planQty - scope.row.arrangeQty) || '-'
      },
      _supplierName: {
        prop: 'supplierName',
        label: '染厂',
        minWidth: 160,
        isShow: (scope) => {
          return this.activeName === 'O'
        },
        showOverflowTooltip: true,
        formater: scope => scope.row.supplierName || '-'
      },
      _salesTeamName: {
        prop: 'salesTeamName',
        label: '销售组织',
        minWidth: 160,
        showOverflowTooltip: true,
        // isShow: (scope) => {
        //   return this.activeName === 'A' || this.activeName === 'N'
        // },
        formater: scope => scope.row.salesTeamName || '-'
      },
      _createdTime: {
        prop: 'createdTime',
        label: '创建时间',
        minWidth: 140,
        isShow: (scope) => {
          return this.activeName === 'A'
        },
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.createdTime ? this.$filters.parseTime(scope.row.createdTime + '', '{y}-{m}-{d} {h}:{i}') : '-'
        }
      }
    }
    // 页签配置
    const tabs = {
      _total: { label: '全部', value: 'A', count: 0 },
      _wait: { label: '待排厂', value: 'N', count: 0 },
      _plant: { label: '已排厂', value: 'O', count: 0 }
    }
    // 列表分页配置
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
    const tableFooter = {
      leftClass: 'weaving-order-pagination',
      span: undefined,
      component: tableSummation,
      componentOptions: {
        config: {
          _num: {
            title: '数量:',
            num: 0
          }
        }
      }
    }
    // 按钮模块配置
    const barConfig = {
      // _edit: {
      //   text: '编辑',
      //   isShow: () => { return this.activeName === 'N' && !this.isEdit && this.$permission(['pd:pdDyeDemand:submit']) },
      //   submit: () => { this.isEdit = true }
      // },
      _allot: {
        text: '变更排厂',
        isShow: () => { return this.activeName === 'O' && this.isActive === true && !this.isEdit && this.$permission(['pd:pdDyeDemand:modify']) },
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
      showMore: false,
      pagination,
      oldSupplier: {},
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
      activeName: 'N',
      tabs,
      isActive: false,
      indexRow: {},
      freshData: {},
      selectDataArr: [],
      IndexCode: '',
      totalNum: [],
      chechedArray: [], // 用户选择的数据
      totalPlanqty: 0 // 待排厂分录印花布总数量
    }
  },
  computed: {
    // 详情列表是否变更状态切换
    sidebar() {
      return this.$store.state.app.sidebar.opened
    },
    // 判断是否有返回的订单数据
    getorder() {
      return this.orderIndexData && Object.keys(this.orderIndexData).length
    }
  },
  watch: {
    showMore(val) {
      if (val) {
        this.tableFooter.span = 24
        this.pagination.layout = 'prev, pager, next'
        // this.pagination.layout = 'total, prev, pager, next,sizes, jumper'// ?
      } else {
        this.tableFooter.span = undefined
        this.pagination.layout = 'total, prev, pager, next,sizes, jumper'
      }
      this.pagination.small = val
    }
  },
  created() {
    this.list({}, false)
  },
  methods: {
    // tab页签切换
    async handleClick() {
      this.showMore = false
      await this.list({}, false)
    },
    // 同步客样分析编号模块数据
    syncMoudleDataHandle(key, data) {
      this.$nextTick(() => {
        if (key === 'productData') {
          this.freshData = { ...this.freshData, ...data }
        } else if (key === 'materialData') {
          this.freshData = { ...this.freshData, demandDetailSubmitRequests: data }
        }
      })
    },
    // 选中列表数据
    setParentDataHandle(key, data) {
      this[key] = data
    },
    // 左侧列表单元点击
    rowClickIndex(row) {
      // 获取详情
      if (this.activeName !== 'A') {
        this.getDetailData(row.uuid)
        this.showMore = true
        this.indexRow = row
      }
    },
    // 待排厂点击获取详情
    async getDetailData(uuid) {
      let res = null
      this.isEdit = false
      this.IndexCode = ''
      this.totalPlanqty = 0
      if (this.activeName === 'N') {
        // 待排厂
        res = await getWaitInfo({ 'uuid': uuid })
        this.isEdit = true
      } else if (this.activeName === 'O') {
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
      if (this.activeName === 'O') {
        const com = dataTim
        com.demandDetailSubmitRequests = dataTim.orderDetailInfoResponses || []
        delete com.orderDetailInfoResponses
        com.orderDetailInfoResponses = res.data && res.data.pdDyeOrderDetailInfoRespList
        this.IndexCode = res.data && res.data.taskNo
        com.uuid = res.data && res.data.uuid // 自增ID
        this.orderData = com
        com.orderDetailInfoResponses.forEach((val, index) => {
          val.firstNum = val.planQty
        })
      } else {
        this.IndexCode = res.data && res.data.taskNo
        this.totalPlanqty = res.data && res.data.planQty
        this.orderData.uuid = res.data && res.data.uuid
        delete this.orderData.pdDyeOrderDetailInfoRespList
        this.orderData.orderDetailInfoResponses = res.data && res.data.pdDyeDemandDetailInfoRespList
      }
      this.orderIndexData = this.$utils.deepClone(this.orderData) // 接口请求慢 赋值不正确
    },
    clearType() {
      this.isEdit = false
      this.orderIndexData = {}
      this.freshData = {}
      this.orderData = {}
      this.IndexCode = ''
      this.chechedArray = []
    },
    // 获取列表数据
    async list(data = {}, fresh,) {
      this.clearType()
      let res = null
      let listData = []
      let obj = { status: '' }
      if (this.activeName === 'N' || fresh) {
        obj = { status: 'N' }
        res = await list({ ...data, ...obj, ...this.searchFormDatas })
      } else if (this.activeName === 'O') {
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
      const resCount = await count(dataObj)
      if (resCount.code === 200) {
        for (var i in resCount.data) {
          this.tabs[`_${i}`]
            ? (this.tabs[`_${i}`].count = resCount.data[i])
            : ''
        }
        this.tableFooter.componentOptions.config._num.num = resCount.data.amount || 0
      } else {
        this.$message({
          message: resCount.message,
          type: 'error'
        })
      }
      if (fresh) {
        this.activeName = 'N'
      }
    },
    // 选择的数据
    selectData(data) {
      this.selectDataArr = data
    },
    // closeBtn() {
    //   this.isEdit = false
    // },
    // editBtn() {
    //   this.isEdit = true
    // },
    // changeBtn() {
    //   this.isEdit = true
    // },
    // 提交回调
    okCallback(val) {
      if (val.type === '1') {
        // 待排厂
        this.$message({
          message: '排厂成功!',
          type: 'success'
        })
        this.activeName = 'O'
        this.showMore = false
        this.list({}, false)
      } else if (val.type === '2') {
        this.$message({
          message: '更新排厂成功!',
          type: 'success'
        })
        // this.getDetailData(this.uuidClose)
        this.list({}, false)
        this.showMore = false
      } else {
        this.$message({
          message: '更新排厂成功,调拨单已取消!',
          type: 'success'
        })
        this.list({}, false)
        this.showMore = false
        console.log('1111111111111')
      }
    },
    // 取消回调
    cancelClick() {
      this.getDetailData(this.indexRow.uuid)
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/base.scss";
  #DyeingDemand {
    // .inputWidth {
    //   width: 80% !important;
    // }
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
    .dyeing-demand-transition.transition-wrap {
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
#DyeingDemand {
  padding-bottom: 70px;
  position: relative;
  height: 100%;
  .main {
    .leftBox {
      position: relative;
    }
    .rightBox {
      border-left: 1px solid #e9eff2;
      .title {
        background: #fff;;
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
  // /deep/.custom-form .el-form.el-form--inline {
  //   padding-top: 15px;
  // }
  // /deep/.el-table--mini .el-table__row {
  //   height: 50px;
  //   line-height: 50px;
  // }
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
