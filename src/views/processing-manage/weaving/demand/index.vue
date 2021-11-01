<template>
  <div id="WeavingDemand" class="list WeavingDemand">
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOptions"
        :form-datas="searchFormDatas"
      />
    </div>
    <!-- <el-button @click="$router.push({path:'/processing/weaving/requisition',query:{noticeNo:'test noticeNo'}})">click</el-button> -->
    <div class="bk" style="position: relative">
      <div v-if="isShowAuth" class="button spe">
        <el-button size="small" type="primary" @click="factoryPlan">{{
          activeName === "N" ? "排厂" : "变更排厂"
        }}</el-button>
      </div>
      <div class="tabs">
        <el-tabs
          v-model="activeName"
          @tab-click="
            getCount();
            getList();
          "
        >
          <el-tab-pane v-for="(i, index) in tabs" :key="index" :name="i.value">
            <span slot="label"> {{ `${i.label} (${i.count})` }}</span>
          </el-tab-pane>
        </el-tabs>
        <div class="main">
          <!-- 列表 -->
          <div class="page-table leftBox">
            <cs-custom-table
              :table-footer="tableFooter"
              :columns="columns"
              :table-scrollx="true"
              :data-source="dataSource"
              :pagination="pagination"
              @selection-change="selectionChange"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 排厂弹框 -->
    <cs-custom-pop v-if="popOptions.visible" ref="pop" :options="popOptions" />
    <!-- 工艺 -->
    <cs-custom-pop
      v-if="technologyOptions.visible"
      ref="pop"
      :options="technologyOptions"
    />
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import * as api from './api/index'
import PlanFactory from './components/plan-factory.vue'
import technology from './components/technology.vue'
import tableSummation from '@/components/table-summation/index.vue'
import { getStatus } from '@/views/processing-manage/public/index.js'
export default {
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
      _knitDelivery: {
        prop: 'knitDelivery',
        itemType: 'date',
        type: 'daterange',
        label: '织计划交期',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59'],
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
      _plan: {
        prop: 'plan',
        itemType: 'date',
        type: 'daterange',
        label: '排厂日期',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59'],
        itemStyle
      },
      _clothName: {
        prop: 'clothName',
        itemType: 'input',
        label: '布类',
        placeholder: '请输入布类',
        clearable: true,
        itemStyle
      },
      _gauge: {
        prop: 'gauge',
        itemType: 'input',
        label: '针寸数',
        placeholder: '请输入针数',
        clearable: true,
        itemStyle: {
          width: '19%',
          'padding-right': '10px'
        }
      },
      _diameter: {
        prop: 'diameter',
        itemType: 'input',
        placeholder: '请输入寸数',
        clearable: true,
        itemStyle: {
          width: '14%'
        }
      },
      rnDelivery: {
        prop: 'planYarnDelivery',
        itemType: 'date',
        type: 'daterange',
        label: '计划到纱期',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59'],
        itemStyle
      },
      _widthName: {
        prop: 'widthName',
        itemType: 'input',
        label: '布封',
        placeholder: '请输入布封',
        clearable: true,
        itemStyle
      },
      _weightName: {
        prop: 'weightName',
        itemType: 'input',
        label: '克重',
        placeholder: '请输入克重',
        clearable: true,
        itemStyle
      },

      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          const p = deepClone(params)
          // 织计划交期
          if (p.hasOwnProperty('knitDelivery') && p.knitDelivery) {
            p.knitDeliveryStart = p.knitDelivery[0]
            p.knitDeliveryEnd = p.knitDelivery[1]
          }
          // 排厂日期
          if (p.hasOwnProperty('plan') && p.plan) {
            p.planStart = p.plan[0]
            p.planEnd = p.plan[1]
          }
          // 计划到纱期
          if (p.hasOwnProperty('planYarnDelivery') && p.planYarnDelivery) {
            p.planYarnDeliveryStart = p.planYarnDelivery[0]
            p.planYarnDeliveryEnd = p.planYarnDelivery[1]
          }
          delete p.knitDelivery
          delete p.plan
          delete p.planYarnDelivery

          this.searchParams = p
          this.pagination.pageNum = 1
          this.pagination.pageSize = 20
          this.getCount()
          this.getList()
        },
        resetHandle: () => {
          this.searchFormDatas = {}
          this.searchParams = {}
        }
      }
    }
    const columns = {
      _selection: {
        minWidth: '50',
        type: 'selection',
        fixed: 'left',
        isShow: () => {
          return this.activeName !== 'A'
        }
      },
      // A全部 N待排厂O已排厂
      _index: {
        minWidth: '50',
        label: '序号',
        fixed: 'left',
        formater: (scope) => {
          return (
            (this.pagination.currentPage - 1) * this.pagination.pageSize +
            (scope.$index + 1)
          )
        }
      },
      _taskNo: {
        prop: 'taskNo',
        label: '任务单号',
        minWidth: '140',
        showOverflowTooltip: true,
        isShow: () => {
          return this.activeName !== 'O'
        }
      },
      _knitOrderNo: {
        prop: 'knitOrderNo',
        label: '织订单号',
        minWidth: 180,
        showOverflowTooltip: true,
        style: {
          color: 'rgb(24, 144, 255)',
          cursor: 'pointer'
        },
        isShow: () => {
          return this.activeName === 'O'
        },
        handle: (scope) => {
          if (scope.row.knitOrderNo) {
            this.$router.push({
              name: 'WeavingOrder',
              params: { knitOrderNo: scope.row.knitOrderNo, orderStatus: scope.row.orderStatus }
            })
          }
        }
      },
      _supplerName: {
        prop: 'supplerName',
        label: '织厂',
        minWidth: '160',
        showOverflowTooltip: true,
        isShow: () => {
          return this.activeName === 'O'
        }
      },
      _customerName: {
        prop: 'customerName',
        label: '客户',
        minWidth: '160',
        showOverflowTooltip: true
      },
      _skuId: {
        prop: 'skuId',
        label: '坯布编码',
        minWidth: '160',
        showOverflowTooltip: true
      },
      _clothType: {
        prop: 'clothType',
        label: '布类',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _custom: {
        prop: 'widthName',
        label: '成品规格',
        minWidth: '160',
        showOverflowTooltip: true,
        //  成品规格=布封+克重
        formater: (scope) => {
          return `${scope.row.widthName}-${scope.row.weightName}`
        }
      },
      _yarnName: {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _yarnAttr: {
        prop: 'yarnAttr',
        label: '纱属性',
        minWidth: '160',
        showOverflowTooltip: true
      },
      _customerColor: {
        prop: 'customerColor',
        label: '客户颜色',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _diameter: {
        prop: 'diameter',
        label: '针寸数',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return `${scope.row.gauge}-${scope.row.diameter}`
        }
      },
      _procedureId: {
        prop: 'procedureId',
        label: '工艺',
        minWidth: '140',
        showOverflowTooltip: true,
        handle: (scope) => {
          this.technologyOptions.componentsOptions.id = scope.row.procedureId
          this.technologyOptions.visible = true
        },
        style: {
          color: 'rgb(24, 144, 255)',
          cursor: 'pointer'
        }
      },
      _planQty: {
        prop: 'planQty',
        label: '坯布需求(KG)',
        minWidth: '160',
        align: 'right',
        showOverflowTooltip: true
      },
      _planDelivery: {
        prop: 'planDelivery',
        label: '坯布计划交期',
        width: '140',
        showOverflowTooltip: true
      },
      _planYarnDelivery: {
        prop: 'planYarnDelivery',
        label: '计划到纱期',
        width: '140',
        showOverflowTooltip: true,
        isShow: () => {
          return this.activeName === 'N'
        }
      },
      _knitDelivery: {
        prop: 'knitDelivery',
        label: '坯布交期',
        width: '140',
        showOverflowTooltip: true,
        isShow: () => {
          return this.activeName === 'O'
        }
      },
      _qty: {
        prop: 'qty',
        label: '排厂量(KG)',
        minWidth: '120',
        align: 'right',
        showOverflowTooltip: true,
        isShow: () => {
          return this.activeName === 'O'
        }
      },
      _planMachine: {
        prop: 'planMachine',
        label: '计划开台数',
        minWidth: '120',
        showOverflowTooltip: true,
        isShow: () => {
          return this.activeName === 'O'
        }
      },

      _arrangeFactoryQty: {
        prop: 'arrangeFactoryQty',
        label: '已排总量(KG)',
        minWidth: '140',
        align: 'right',
        showOverflowTooltip: true
      },
      _leaveFactoryQty: {
        prop: 'leaveFactoryQty',
        label: '未排总量(KG)',
        minWidth: '140',
        align: 'right',
        showOverflowTooltip: true
      },
      _createdTime: {
        prop: 'createdTime',
        label: '创建日期',
        minWidth: '160',
        showOverflowTooltip: true,
        isShow: () => {
          return this.activeName === 'A'
        }
      },
      _orderStatus: {
        fixed: 'right',
        prop: 'orderStatus',
        label: '织订单状态',
        minWidth: '120',
        showOverflowTooltip: true,
        isShow: () => {
          return this.activeName === 'O'
        },
        formater: (scope) => {
          return getStatus(scope.row.orderStatus)
        }
      }
    }
    const tabs = {
      // A全部 N待排厂O已排厂
      _all: { label: '全部', value: 'A', count: 0 },
      _wait: { label: '待排厂', value: 'N', count: 0 },
      _plant: { label: '已排厂', value: 'O', count: 0 }
    }
    const technologyOptions = {
      itemType: 'dialog',
      visible: false,
      title: '工艺',
      width: '1300px',
      okHidden: true,
      cancelHidden: true,
      close: () => {
        this.$set(this.technologyOptions, 'visible', false)
      },
      components: { technology },
      componentsOptions: {
        id: ''
      }
    }
    const popOptions = {
      className: 'weaving-demand-dialog',
      itemType: 'dialog',
      visible: false,
      title: '织布生产排厂',
      width: '1380px',
      okText: '确认',
      cancelText: '取消',
      ok: (params) => {
        this.addFactory(params)
      },
      cancel: (params) => {
        this.$set(this.popOptions, 'visible', false)
      },
      component: PlanFactory,
      searchParams: {}
    }
    const pagination = {
      currentChange: (val) => {
        this.pagination.pageNum = val
        this.getCount()
        this.getList()
      },
      sizeChange: (val) => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        this.getCount()
        this.getList()
      }
    }
    const tableFooter = {
      leftClass: 'weaving-demand-pagination',
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
    return {
      tableFooter,
      technologyOptions,
      pagination,
      columns,
      dataSource: [],
      searchData,
      formOptions: {
        size: 'small',
        layout: true,
        inline: true,
        validate: (prop, flag, errmsg) => {
          // console.log(prop, flag, errmsg, 'll')
        }
      },
      searchFormDatas: {},
      searchParams: {},
      activeName: 'N',
      tabs,
      popOptions,
      selectResult: [],
      result: null
    }
  },
  computed: {
    isShowAuth() {
      if (this.activeName === 'A') {
        return false
      } else {
        if (this.activeName === 'N') {
          return this.$permission(['pd:pdKnitDemand:submit'])
        } else {
          return this.$permission(['pd:pdKnitDemand:modify'])
        }
      }
    }
  },
  created() {
    this.getCount()
    this.getList()
  },
  mounted() {},
  methods: {
    async addFactory(form, callback) {
      if (!form.result.details || !form.result.details.length) {
        this.$message({
          message: '请选择至少一条数据',
          type: 'warning'
        })
        return
      }
      if (this.activeName === 'N') {
        const res = await api.planFactory(form.result)
        if (res.code === 200) {
          this.popOptions.visible = false
          this.pageNum = 1
          this.$message({
            message: '排厂成功',
            type: 'success'
          })
          this.getCount()
          this.getList()
          this.$store.dispatch('app/fetchParamsLog', {
            opratorType: 'INSERT',
            api: '/processingMgr/knitDemand/planFactory',
            description: {
              beforeText: `在'加工管理-织布-织布需求-待排厂中'新增一条排厂信息`,
              beforeCode: form.result
            },
            appId: 'processingMgr'
          })
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      } else {
        // 对比是否更换工厂
        if (form.supplerO.value + '' !== form.result.suppler.value + '') {
          this.$confirm(
            '更换工厂将取消下游该需求对应的所有调拨通知单',
            '提示',
            {
              type: 'warning'
            }
          )
            .then(() => {
              this.freshPlan(form)
            })
            .catch(() => {
              // 重新调拨
              return
            })
        } else {
          this.freshPlan(form)
        }
        //  PD_KNIT_FACTORY_ORDER_STATUS_CHECK_ERROR(10000201,"订单状态异常"),
        // PD_KNIT_FACTORY_GT_QTY_CHECK_ERROR(10000202,"加工需求排厂，排厂数量超出未排数量"),
        // PD_KNIT_STOCK_PICK_CHECK_ERROR(10000211,"变更后的排厂量所需原料小于已调拨的原料总量"),
      }
    },
    async freshPlan(form) {
      const fetchLogFun = () => {
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'UPDATE',
          api: '/processingMgr/knitDemand/editFactoryConfirm',
          description: {
            beforeText: `在'加工管理-织布-织布需求-排厂中'变更
            任务单号:${this.selectResult[0].taskNo},
            SKU: ${this.selectResult[0].skuId}  的排厂信息`,
            beforeCode: form.result
          },
          appId: 'processingMgr'
        })
      }
      const msg = (res) => {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
      // this.result = deepClone(form.result)
      this.result = form.result
      const res0 = await api.editFactoryConfirm(form.result)
      const res = res0.data
      if (res.code === 200) {
        this.popOptions.visible = false
        this.pageNum = 1
        this.getCount()
        this.getList()
        fetchLogFun()
        return
      } else if (res.code === 10000211) {
        this.$confirm(
          '变更后的排厂量所需原料小于已调拨的原料总量，请确认：',
          '提示',
          {
            type: 'warning',
            cancelButtonClass: 'WeavingDemand',
            confirmButtonClass: 'WeavingDemand',
            confirmButtonText: '修改调拨单',
            cancelButtonText: '重新调拨',
            distinguishCancelAndClose: true,
            center: true
          }
        )
          .then(() => {
            // 将跳转到原料调拨通知单页面  test
            this.$router.push({
              path: '/processing/weaving/requisition',
              query: { sourceNo: this.selectResult[0].knitOrderNo }
            })
          })
          .catch((action) => {
            // 重新调拨
            if (action === 'cancel') {
              var a = {
                result: {
                  ...this.result,
                  stockReverse: true
                }
              }
              this.freshPlan(a)
            }
          })
      } else {
        msg(res)
      }
    },
    factoryPlan() {
      // n-待;o-已排
      if (this.activeName === 'N') {
        if (!this.selectResult.length) {
          this.$message({
            message: '请先选择至少一条加工需求',
            type: 'warning'
          })
          return
        }
      } else {
        if (!this.selectResult.length) {
          this.$message({
            message: '请先选择至少一条数据',
            type: 'warning'
          })
          return
        } else {
          for (var i = 0; i < this.selectResult.length; i++) {
            // 已排厂记录对应的织订单状态为“待提交”或“已回撤”
            // WAIT("W", "待提交"),SUBMIT("S", "已提交"),RECALL("R", "撤回"),CANCEL("C", "取消"),FINISH("F", "完工"),
            if (
              this.selectResult[i].orderStatus !== 'W' &&
              this.selectResult[i].orderStatus !== 'R'
            ) {
              this.$message({
                message: '不能变更当前排厂信息',
                type: 'warning'
              })
              return
            }
            if (
              !this.selectResult.every(
                (k) => k.knitOrderNo === this.selectResult[0].knitOrderNo
              )
            ) {
              this.$message({
                message: '不能同时变更多个加工单，请只保留一个加工单进行变更',
                type: 'warning'
              })
              return
            }
          }
        }
      }
      this.popOptions.title =
        this.activeName === 'N' ? '织布生产排厂' : '选择织布需求'
      this.popOptions.visible = true
      this.popOptions.selectResult = this.selectResult
      this.popOptions.searchParams = {
        ...{
          taskNoPlan: this.selectResult[0].taskNo,
          skuPlan: this.selectResult[0].skuId
        },
        ...{ status: this.activeName }
      }
    },
    selectionChange(val) {
      this.selectResult = val
    },
    async getList() {
      const res = await api.list({
        pageSize: this.pagination.pageSize || 20,
        pageNum: this.pagination.pageNum || 1,
        ...this.searchParams,
        status: this.activeName
      })
      if (res.code === 200) {
        this.dataSource = res.data.list || []
        this.pagination = {
          ...this.pagination,
          dataTotal: res.data.total || 0,
          currentPage: res.data.pageNum,
          pageNum: res.data.pageNum,
          pageSize: res.data.pageSize
        }
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    async getCount() {
      const resCount = await api.count({
        pageSize: this.pagination.pageSize || 20,
        pageNum: this.pagination.pageNum || 1,
        ...this.searchParams,
        status: this.activeName
      })
      if (resCount.code === 200) {
        for (var i in resCount.data) {
          this.tabs[`_${i}`]
            ? (this.tabs[`_${i}`].count = resCount.data[i])
            : ''
        }
        this.tableFooter.componentOptions.config._num.num =
          resCount.data.total || 0
      } else {
        this.$message({
          message: resCount.message,
          type: 'error'
        })
      }
    }
  }
}
</script>

<style  lang="scss">
@import "@/styles/base.scss";
#WeavingDemand {
  .weaving-demand-pagination {
    line-height: 60px;
    margin:0;
    .TableSummation .total {
      margin: 0 0 0 10px;
    }
  }
}
.el-message-box .el-message-box__btns {
  .WeavingDemand {
    width: auto;
  }
}
</style>
<style lang="scss" scoped>
#WeavingDemand {
  .button.spe {
    position: absolute;
    right: 20px;
    top: 14px;
    z-index: 3;
  }
}
</style>
