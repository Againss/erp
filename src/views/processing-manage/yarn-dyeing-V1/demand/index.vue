<!--
 * @Author: 马贝儿
 * @Description: 染纱需求代码重构
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
          <el-tab-pane v-for="(i, index) in tabs" :key="index" :name="i.value">
            <span slot="label">{{ `${i.label} (${i.count})` }}</span>
          </el-tab-pane>
        </el-tabs>
        <div class="main">
          <transitionWarp
            class-name="yarn-dyeing-demand-transition"
            height="330px"
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
                    height: !showMore ? '100%' : 'calc((100vh - 330px}))',
                    'padding-left': '10px',
                  }"
                >
                  <cs-custom-table
                    :key="`${activeName}_${showMore}`"
                    :columns="columns"
                    :height="!showMore ? null : 'calc((100vh - 330px}))'"
                    :row-style="{ cursor: 'pointer' }"
                    :table-scrollx="true"
                    :table-footer="tableFooter"
                    :highlight-current-row="true"
                    :data-source="dataSource"
                    :pagination="pagination"
                    :row-class-name="currentRowClassName"
                    @row-click="rowClick"
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
                    {{ `染纱生产排厂 (单号：${taskNo})` }}
                  </div>
                  <div class="button spe">
                    <buttonBar :config="barConfig" :wipe-class="true" />
                  </div>
                </div>
                <div class="page-detail">
                  <detailBranch
                    :id="detailId"
                    :task-no="taskNo"
                    :active-name="activeName"
                    :is-edit="isEdit"
                    @form="resultHandle"
                  />
                </div>
              </div>
            </template>
          </transitionWarp>
        </div>
      </div>
    </div>
    <buttonBar v-show="isEdit" :config="barConfigBottom" />
  </div>
</template>

<script>
import { list, listCom, ListDischarged } from './api/index'
import * as api from './api/index'
import transitionWarp from '@/components/transition-wrap/index.vue'
import tableSummation from '@/components/table-summation/index.vue'
import { setOrderFun } from '../public/mou'
import buttonBar from '@/components/button-bar/index.vue'
import detailBranch from './components/detailBranch.vue'
export default {
  components: { detailBranch, buttonBar, transitionWarp },
  mixins: [setOrderFun], // xj
  data() {
    const itemStyle = { width: '33%' }
    const searchData = {
      _taskNo: {
        prop: 'taskNo',
        itemType: 'input',
        label: '任务单号',
        placeholder: '请输入任务单号',
        clearable: true,
        itemStyle
      },
      _customerName: {
        prop: 'customerName',
        itemType: 'input',
        label: '客户',
        placeholder: '请输入客户',
        clearable: true,
        itemStyle
      },
      _salesTeamName: {
        prop: 'salesTeamName',
        itemType: 'input',
        label: '销售组织',
        placeholder: '请输入销售组织',
        clearable: true,
        itemStyle
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          this.showMore = false
          const newData = JSON.parse(JSON.stringify(params))
          this.pagination.pageNum = 1
          this.pagination.pageSize = 20
          this.searchParams = newData
          this.list()
        },
        resetHandle: () => {
          this.showMore = false
          this.searchFormDatas = {}
          this.searchParams = {}
        }
      }
    }
    const columns = {
      _index: {
        prop: 'index',
        minWidth: '50',
        label: '序号'
      },
      _taskNo: {
        prop: 'taskNo',
        label: '任务单号',
        minWidth: 110,
        showOverflowTooltip: true,
        formater: (scope) => scope.row.taskNo
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
        formater: (scope) => scope.row.customerName
      },
      _planQty: {
        prop: 'planQty',
        label: '排产数量(KG)',
        align: 'right',
        minWidth: 140,
        isShow: (scope) => {
          return this.activeName === ''
        },
        showOverflowTooltip: true
      },
      _arrangeQty: {
        prop: 'arrangeQty',
        label: '已排厂量(KG)',
        align: 'right',
        minWidth: 140,
        isShow: (scope) => {
          return this.activeName === ''
        },
        showOverflowTooltip: true
      },
      _notQty: {
        prop: 'notQty',
        label: '未排厂量(KG)',
        align: 'right',
        minWidth: 140,
        isShow: (scope) => {
          return this.activeName === ''
        },
        showOverflowTooltip: true
      },
      _supplierName: {
        prop: 'supplierName',
        label: '染纱厂',
        minWidth: 160,
        isShow: (scope) => {
          return this.activeName === 'Y'
        },
        showOverflowTooltip: true
      },
      _salesTeamName: {
        prop: 'salesTeamName',
        label: '销售组织',
        minWidth: 160,
        showOverflowTooltip: true
      },
      _createdTime: {
        prop: 'createdTime',
        label: '创建时间',
        minWidth: 160,
        isShow: (scope) => {
          return this.activeName === ''
        },
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.createdTime
            ? this.$filters.parseTime(scope.row.createdTime + '', '{y}-{m}-{d}')
            : '-'
        }
      }
    }
    const tabs = {
      _total: {
        label: '全部',
        value: '',
        count: 0
      },
      _wait: {
        label: '待排厂',
        value: 'N',
        count: 0
      },
      _plant: {
        label: '已排厂',
        value: 'Y',
        count: 0
      }
    }
    const pagination = {
      small: false,
      layout: 'total, prev, pager, next,sizes, jumper',
      currentChange: (val) => {
        // const com = { pageSize: this.pagination.pageSize || 20
        // this.list(com, false)
        this.list()
      },
      sizeChange: (val) => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        // this.list(com, false)
        this.list()
      }
    }
    const barConfig = {
      _allot: {
        text: '变更排厂',
        // buttonClass: 'sub-main',
        isShow: () => {
          return (
            (this.status === 'W' || this.status === 'R') &&
            this.activeName === 'Y' &&
            this.$permission(['pd:pdDyeingDemand:modify'])
          )
        },
        submit: () => {
          this.isEdit = true
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

    const barConfigBottom = {
      _update: {
        text: '提交',
        type: 'primary',
        isShow: () => {
          return this.isEdit
        },
        submit: () => {
          this.submitForm()
        }
      },
      _exit: {
        text: '取消',
        submit: () => {
          this.isEdit = false
        },
        isShow: () => {
          return this.isEdit && this.activeName === 'Y'
        }
      }
    }
    return {
      barConfigBottom,
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
      isEdit: false,
      orderData: {},
      orderIndexData: {},
      searchFormDatas: {},
      activeName: 'N',
      tabs,
      freshData: {},
      allOrderIndexData: {},
      indexRow: {},
      IndexCode: '',
      totalNum: {},
      GlobalSwitch: false,
      // indexArray: []
      // 优化
      detailId: undefined,
      status: undefined,
      taskNo: undefined,
      id: undefined,
      result: {},
      confirm: false,
      searchParams: {}
    }
  },
  computed: {
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
    this.list()
  },
  methods: {
    currentRowClassName({ row, rowIndex }) {
      var id
      if (this.activeName === 'N') {
        id = row.taskNo
      } else {
        id = row.orderId
      }
      if (this.showMore && this.detailId === id) {
        return 'currentRowClassName'
      } else {
        return ''
      }
    },
    isShowTask() {
      this.showMore = !this.showMore
      if (!this.showMore) {
        this.clearType()
      }
    },
    // tab页签切换
    handleClick() {
      this.isEdit = false
      this.showMore = false
      this.list()
    },
    rowClick(row) {
      if (this.activeName !== '0') {
        this.indexRow = row
        this.showMore = true
        this.status = row.status
        // this.getDetailData()
        this.id = row.id
        this.taskNo = row.taskNo
        this.detailId = this.activeName === 'N' ? row.taskNo : row.orderId
        this.isEdit = this.activeName === 'N'
      }
    },
    clearType(setval) {
      if (this.activeName === 'N') {
        this.isEdit = setval !== undefined ? !setval : this.showMore
      } else {
        this.isEdit = false
      }
      this.orderIndexData = {}
      this.freshData = {}
      this.orderData = {}
      this.IndexCode = ''
      // this.GlobalSwitch = false
      // this.indexArray = []
    },
    // 获取列表数据
    async list() {
      this.clearType()
      var res
      if (this.activeName === 'Y') {
        res = await ListDischarged({
          pageSize: this.pagination.pageSize || 20,
          pageNum: this.pagination.pageNum || 1,
          ...this.searchParams,
          status: this.activeName
        })
      } else {
        res = await list({
          pageSize: this.pagination.pageSize || 20,
          pageNum: this.pagination.pageNum || 1,
          ...this.searchParams,
          status: this.activeName
        })
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

      const amountRes = await listCom({
        pageSize: this.pagination.pageSize || 20,
        pageNum: this.pagination.pageNum || 1,
        ...this.searchParams,
        status: this.activeName
      })
      this.totalNum = amountRes && amountRes.data ? amountRes.data : {}
      for (var i in amountRes.data) {
        this.tabs[`_${i}`]
          ? (this.tabs[`_${i}`].count = amountRes.data[i])
          : ''
      }
      this.tableFooter.componentOptions.config._num.num =
        (this.totalNum &&
          Object.keys(this.totalNum).length &&
          this.totalNum.amount) ||
        0
    },
    resultHandle(f) {
      this.result = this.$utils.deepClone(f)
    },
    async submitForm() {
      // 校验
      if (!this.result.supplier || !this.result.supplier.value) {
        this.$message({ type: 'error', message: '染纱厂不能为空' })
        return
      } else if (!this.result.pmUser || !this.result.pmUser.value) {
        this.$message({ type: 'error', message: '跟单人员不能为空' })
        return
      } else if (!this.result.selection || !this.result.selection.length) {
        this.$message({ type: 'error', message: '请先选择一条分录' })
        return
      } else {
        var newArr = []
        this.result.selection.forEach((item) => {
          var i = this.result.demandDetailSubmitRequests.tableForm.findIndex(
            (e) => e.id === item.id
          )
          newArr.push(this.result.demandDetailSubmitRequests.tableForm[i])
        })
        console.log(newArr, 'newArr')

        for (var o = 0; o < newArr.length; o++) {
          const im = newArr[o]
          const fa = im.factoryNum
          const no = im.notQty
          const faCopy = im.factoryNumCopy
          const imc =
            this.$utils.getFloat(faCopy, 2) * 1 +
            this.$utils.getFloat(no, 2) * 1
          if (!im.dyeingDelivery) {
            this.$message({ type: 'error', message: '染纱交期不能为空' })
            return
          } else if (!fa) {
            this.$message({ type: 'error', message: '排厂量不能为空' })
            return
          } else if (Number(fa) > Number(imc)) {
            this.$message({ type: 'error', message: '排厂量不能大于未排总量' })
            return
          }
        }
      }
      if (this.activeName === 'N') {
        // 待排
        const res = await api.WaitingPlantSubmit({
          supplier: this.result.supplier,
          pmUser: this.result.pmUser,
          demandDetailSubmitRequests: newArr,
          taskNo: this.taskNo
        })
        this.$message({
          type: res.code === 200 ? 'success' : 'error',
          message: res.code === 200 ? '排厂成功' : res.message
        })
      } else {
        const res = await api.Modifycharged({
          supplier: this.result.supplier,
          pmUser: this.result.pmUser,
          demandDetailSubmitRequests: newArr,
          taskNo: this.taskNo,
          confirm: this.confirm
        })
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '变更排厂成功'
          })
          this.lIst()
          return
        } else if (res.code === 10000301) {
          //  (10000301, "变更后排厂量小于已调拨量"),
          this.$confirm(
            '变更后的排厂量所需原料小于已调拨的原料总量，请确认？',
            '提示',
            {
              type: 'warning',
              confirmButtonText: '修改调拨单',
              customClass: 'WeavingOrder_pups__btns',
              cancelButtonText: '重新调拨'
            }
          )
            .then(() => {
              this.$router.push({
                path: `/processing/yarn-dyeing/requisition`,
                query: { noticeNo: this.data.orderId }
              })
            }) // 将跳转到原料调拨通知单页面  test
            .catch(() => {
              this.confirm = true
              this.submitForm()
              this.$message({ type: 'info', message: '已重新调拨' })
            }) // 重新调拨
        } else if (res.code === 10000302) {
          // (10000302, "更换工厂"),
          this.$confirm(
            '是否确认变更加工厂，确认后，原有的原料调拨通知将被取消，请确认？',
            '提示',
            {
              type: 'warning',
              confirmButtonText: '确认',
              cancelButtonText: '取消'
            }
          )
            .then(() => {
              this.confirm = true
              // this.HopRouting('3')
              this.lIst()
              return
            })
            .catch(() => {
              this.confirm = false
              this.$message({ type: 'info', message: '已取消' })
            })
        }
      }
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
  }
}
</style>
<style lang="scss" scoped>
#WeavingOrder_cx {
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
  /deep/.el-table__body tr.currentRowClassName td {
    background-color: transparent;
  }
  /deep/.el-table__body .currentRowClassName {
    background-color: #d8eafd;
  }
}
</style>
