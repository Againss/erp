
<template>
  <div id="DyeRequisition" class="list DyeRequisition">
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOptions"
        :form-datas="searchFormDatas"
      />
    </div>
    <div class="bk" style="position: relative">
      <div v-if="activeName === 'W' && $permission(['pd:pdDyeAllotNotice:submit'])" class="button spe">
        <el-button
          size="small"
          type="primary"
          @click="saveBtn"
        >提交</el-button>
      </div>
      <div class="tabs">
        <el-tabs v-model="activeName" @tab-click="tabChange">
          <el-tab-pane v-for="(i, index) in tabs" :key="index" :name="i.value">
            <span slot="label"> {{ `${i.label} (${i.count})` }}</span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="main">
        <!-- 列表 -->
        <transitionWarp
          class-name="print-requisition-transition"
          height="256px"
          width="288px"
          :is-show="showMore"
          @isShow="
            (val) => {
              showMore = val;
            }
          "
        >
          <template v-slot:left>
            <div class="leftBox">
              <div v-if="uuid&&showMore" class="close-right" @click="showMore = !showMore">
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
                  :max-height="!showMore ? '100%' : ' calc((100vh - 350px}))'"
                  :height="!showMore ? null : 'calc((100vh - 330px}))'"
                  :table-footer="tableFooter"
                  :highlight-current-row="true"
                  :table-scrollx="true"
                  :row-style="{ cursor: 'pointer' }"
                  :columns="columns"
                  :data-source="dataSource"
                  :pagination="pagination"
                  @row-click="rowClick"
                  @selection-change="selectArr"
                />
              </div>
            </div>
          </template>
          <!-- 详情 -->
          <template v-slot:right>
            <div class="rightBox">
              <div class="clearfix" style="position: relative">
                <div class="title">坯布调拨通知单
                </div>
                <div class="button spe">
                  <buttonBar :config="barConfig" :wipe-class="true" />
                </div>
              </div>
              <cs-custom-form
                ref="changeForm"
                :data-source="detailData"
                :options="detailFormOptions"
                :form-datas="detailFormDatas"
              />
            </div>
          </template>
        </transitionWarp>
      </div>
    </div>
    <buttonBar
      v-show="detailData._detailBranch.componentsOptions.isEdit"
      :config="barConfigBottom"
    />
  </div>
</template>

<script>
import transitionWarp from '@/components/transition-wrap/index.vue'
import detailBranch from './components/detailBranch.vue'
import * as api from './api/index.js'
import { deepClone } from '@/utils'
import tableSummation from '@/components/table-summation/index.vue'
// import { inputFilter } from '@/views/processing-manage/public/index.js'
import buttonBar from '@/components/button-bar/index.vue'
import { setOrderFun } from '../public/mou'
export default {
  components: { buttonBar, transitionWarp },
  mixins: [setOrderFun],
  data() {
    const itemStyle = { width: '33%' }
    const searchData = {
      _noticeNo: {
        prop: 'noticeNo',
        itemType: 'input',
        label: '通知单号',
        placeholder: '请输入通知单号',
        clearable: true,
        itemStyle
      },
      _sourceNo: {
        prop: 'sourceNo',
        itemType: 'input',
        label: '调入单号',
        placeholder: '请输入调入单号',
        clearable: true,
        itemStyle
      },
      _allotOutAddr: {
        prop: 'allotOutAddr',
        itemType: 'input',
        label: '调出地址',
        placeholder: '请输入调出地址',
        clearable: true,
        itemStyle
      },
      _allotInAddr: {
        prop: 'allotInAddr',
        itemType: 'input',
        label: '调入地址',
        placeholder: '请输入调入地址',
        clearable: true,
        itemStyle
      },
      _pmUserName: {
        prop: 'pmUserName',
        itemType: 'input',
        label: '跟单人',
        placeholder: '请输入跟单人',
        clearable: true,
        itemStyle
      },
      _submitTime: {
        prop: 'submitTime',
        itemType: 'date',
        type: 'daterange',
        label: '创建日期',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59'],
        itemStyle
      },

      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          const p = deepClone(params)
          // 创建时间
          if (p.hasOwnProperty('submitTime') && p.submitTime) {
            p.createdStartTime = p.submitTime[0]
            p.createdEndTime = p.submitTime[1]
          }
          delete p.submitTime
          this.searchParams = p
          this.pagination.pageNum = 1
          this.pagination.pageSize = 20
          this.getList()
          this.uuid = undefined
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
        isShow: () => {
          return this.activeName === 'W'
        }
      },
      _index: {
        minWidth: '50',
        label: '序号',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _noticeNo: {
        prop: 'noticeNo',
        label: '通知单号',
        minWidth: 160,
        showOverflowTooltip: true
      },
      _orderNo: {
        prop: 'orderNo',
        label: '来源单号',
        minWidth: 160,
        isShow: (scope) => {
          return this.activeName === 'A'
        },
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _sourceNo: {
        prop: 'sourceNo',
        label: '调入单号',
        minWidth: 160,
        showOverflowTooltip: true
      },
      _allotOut: {
        prop: 'allotOut',
        label: '调出地址',
        minWidth: 160,
        showOverflowTooltip: true,
        handle: (scope) => {},
        formater: (scope) => {
          return scope.row.allotOut ? scope.row.allotOut.label : ''
        }
      },
      _source: {
        prop: 'source',
        label: '调入地址',
        minWidth: 160,
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.source ? scope.row.source.label : ''
        }
      },
      _qty: {
        prop: 'qty',
        label: '调拨数量(KG)',
        minWidth: 120,
        align: 'right',
        isShow: (scope) => {
          return this.activeName === 'A'
        },
        showOverflowTooltip: true
      },
      _createdTime: {
        prop: 'createdTime',
        label: '创建日期',
        isShow: (scope) => {
          return this.activeName === 'A'
        },
        minWidth: 120,
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.createdTime ? this.$filters.parseTime(scope.row.createdTime + '', '{y}-{m}-{d} {h}:{i}') : '-'
        }
      },
      _status: {
        prop: 'status',
        label: '状态',
        isShow: (scope) => {
          return this.activeName === 'A'
        },
        minWidth: 100,
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.getStatus(scope.row.status)
        }
      }
    }
    const tabs = {
      _all: { label: '全部', value: 'A', count: 0 },
      _W: { label: '待提交', value: 'W', count: 0 },
      _S: { label: '已提交', value: 'S', count: 0 },
      _R: { label: '已撤回', value: 'R', count: 0 },
      _C: { label: '已取消', value: 'C', count: 0 }
    }
    const detailStyle = {
      width: '32%',
      height: '32px',
      'line-height': '32px',
      'margin-bottom': '0'
    }
    const detailData = {
      _noticeNo: {
        prop: 'noticeNo',
        itemType: 'itemview',
        label: '调拨单号',
        itemStyle: detailStyle
      },
      _allotOutAddr: {
        prop: 'allotOutAddr',
        itemType: 'itemview',
        label: '调出地址',
        itemStyle: detailStyle,
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          return value ? value.label : ''
        }
      },
      _outUser: {
        prop: 'outUser',
        itemType: 'itemview',
        label: '联系人',
        itemStyle: detailStyle,
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          return value ? value.label : ''
        }
      },
      _outUserConnect: {
        prop: 'outUserConnect',
        itemType: 'itemview',
        label: '联系方式',
        itemStyle: detailStyle
      },
      _sourceNo: {
        prop: 'sourceNo',
        itemType: 'itemview',
        label: '调入生产单',
        itemStyle: detailStyle
      },
      _sourceAddr: {
        prop: 'sourceAddr',
        itemType: 'itemview',
        label: '调入地址',
        itemStyle: detailStyle,
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          return value ? value.label : ''
        }
      },
      _inUser: {
        prop: 'inUser',
        itemType: 'itemview',
        label: '联系人',
        itemStyle: detailStyle,
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          return value ? value.label : ''
        }
      },
      _inUserContact: {
        prop: 'inUserContact',
        itemType: 'itemview',
        label: '联系方式',
        itemStyle: detailStyle
      },
      _pmUserName: {
        prop: 'pmUser',
        itemType: 'itemview',
        label: '跟单人员',
        itemStyle: detailStyle,
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          return value ? value.label : ''
        }
      },
      _createdBy: {
        prop: 'createdBy',
        itemType: 'itemview',
        label: '创建人员',
        itemStyle: detailStyle
      },
      _createdTime: {
        prop: 'createdTime',
        itemType: 'itemview',
        label: '创建时间',
        itemStyle: detailStyle,
        renderContent: (val) => {
          return this.$filters.parseTime(val, '{y}-{m}-{d} {h}:{i}:{s}')
        }
      },
      _status: {
        prop: 'status',
        itemType: 'itemview',
        label: '状态',
        itemStyle: detailStyle,
        renderContent: (val) => {
          return this.getStatus(val)
        }
      },
      _detailBranch: {
        prop: 'detailBranch',
        components: { detailBranch },
        componentsOptions: {
          className: 'el-form-item el-form-item--medium',
          details: [],
          syncDataHandle: (result) => {
            this.updateForm = result
          },
          isEdit: false
        }
      }
    }
    const barConfig = {
      _change: {
        text: '变更',
        buttonClass: 'sub-main',
        isShow: () => {
          return (this.getStatusInfo === 'W' || this.getStatusInfo === 'R') && !this.detailData._detailBranch.componentsOptions.isEdit && this.$permission(['pd:pdDyeAllotNotice:submit'])
        },
        submit: () => {
          this.detailData._detailBranch.componentsOptions.isEdit = !this.detailData._detailBranch.componentsOptions.isEdit
        }
      },
      // _submit: {
      //   text: '提交',
      //   type: 'primay',
      //   isShow: () => {
      //     return this.activeName === 'W'
      //   },
      //   submit: () => {
      //     this.submitForm()
      //   }
      // },
      _back: {
        text: '撤回',
        buttonClass: 'sub-main',
        isShow: () => {
          return this.getStatusInfo === 'S' && !this.detailData._detailBranch.componentsOptions.isEdit && this.$permission(['pd:pdDyeAllotNotice:withdraw'])
        },
        submit: () => {
          this.back()
        }
      },
      _cancel: {
        text: '取消',
        buttonClass: 'sub-main',
        isShow: () => {
          return (this.getStatusInfo === 'S' || this.getStatusInfo === 'R') && !this.detailData._detailBranch.componentsOptions.isEdit && this.$permission(['pd:pdDyeAllotNotice:cancel'])
        },
        submit: () => {
          this.$confirm('确认 取消 该订单？', '提示', {
            type: 'warning',
            customClass: 'WeavingOrder'
          })
            .then(() => {
              this.cancel()
            })
            .catch(() => {})
        }
      }
    }
    const barConfigBottom = {
      _update: {
        text: '提交',
        type: 'primary',
        submit: () => {
          this.$refs.changeForm.validate()
        }
      },
      _exit: {
        text: '取消',
        submit: () => {
          this.detailData._detailBranch.componentsOptions.isEdit = false
        }
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
    const pagination = {
      small: false,
      layout: 'total, prev, pager, next,sizes, jumper',
      currentChange: (val) => {
        this.pagination.pageNum = val
        this.getList()
        this.uuid = undefined
      },
      sizeChange: (val) => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        this.getList()
        this.uuid = undefined
      }
    }
    return {
      tableFooter,
      id: undefined,
      pagination,
      uuid: undefined,
      updateForm: [],
      barConfigBottom,
      showMore: false,
      barConfig,
      columns,
      dataSource: [],
      searchData,
      formOptions: {
        size: 'small',
        layout: true,
        inline: true
      },
      searchFormDatas: {},
      searchParams: {},
      activeName: 'R',
      tabs,
      detailData,
      selectUuids: [],
      getStatusInfo: '',
      detailFormOptions: {
        inline: true,
        className: 'print-requisition-detail-form',
        syncDataHandle: (c) => {},
        validate: (prop, flag, errmsg) => {
          for (var i = 0; i < this.updateForm.length; i++) {
            const e = this.updateForm[i]
            for (var j = 0; j < e.length; j++) {
              if (!parseFloat(e[j].qty) || !e[j].planDelivery) {
                this.$message({
                  message: `请完善色纱编码 ${e[j].yarnCode} 的信息`,
                  type: 'warning'
                })
                return
              }
            }
          }
          this.allotSubmit()
        }
      },
      detailFormDatas: {}
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
    if (this.$route.query && this.$route.query.noticeNo) {
      this.activeName = 'A'
      this.searchFormDatas = { sourceNo: this.$route.query.noticeNo }
      this.searchParams = { sourceNo: this.$route.query.noticeNo }
      this.getList()
    } else {
      this.activeName = 'W'
    }
    this.getList()
    this.showMore = false
  },
  methods: {
    async getList() {
      this.showMore = false
      this.dataSource = []
      const res = await api.list({
        pageSize: this.pagination.pageSize || 20,
        pageNum: this.pagination.pageNum || 1,
        ...this.searchParams,
        status: this.activeName === 'A' ? '' : this.activeName
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
        const amountRes = await api.count({
          ...this.searchParams,
          status: this.activeName === 'A' ? '' : this.activeName
        })
        if (amountRes.code === 200) {
          for (var i in amountRes.data) {
            this.tabs[`_${i}`] ? (this.tabs[`_${i}`].count = amountRes.data[i]) : ''
          }
          this.tabs._all.count = amountRes.data.total || 0
          this.tableFooter.componentOptions.config._num.num = amountRes.data.amount || 0
        }
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
      if (this.$route.query && this.$route.query.sourceNo) {
        this.$router.replace({})
      }
    },
    async getInfo(params) {
      this.isEdit = false
      const res = await api.info({ uuid: this.uuid })
      // const res = await api.info({ uuid: '1077e35812b64772b3ca6824e77d72a0'})
      if (res.code === 200) {
        this.detailFormDatas = res.data || {}
        this.getStatusInfo = res.data.status
        const options = this.detailData._detailBranch.componentsOptions
        options.details = res.data.pdDyeAllotDetailInfoRespList || []
        // this.versionOptions =
        //   (res.data.versions &&
        //     res.data.versions.length &&
        //     res.data.versions.map((i) => ({
        //       label: `V${i}`,
        //       value: i
        //     }))) ||
        //   []
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    async back() {
      const obj = {}
      const arr = []
      arr.push(this.uuid)
      obj.uuidList = arr
      const res = await api.recall(obj)
      this.$message({
        message: res.code === 200 ? '撤回成功' : res.message,
        type: res.code === 200 ? 'success' : 'error'
      })
      if (res.code === 200) {
        this.activeName = 'R'
        this.tabChange()
        if (res.code === 200) {
          this.activeName = 'R'
          this.tabChange()
          this.$store.dispatch('app/fetchParamsLog', {
            opratorType: 'UPDATE',
            api: '/processingMgr/pdDyeAllotNotice/recall',
            description: {
              beforeText: `在'加工管理-染整-染整调拨通知单中修改通知单号 ${this.uuid} 的状态`,
              afterText: { status: 'R' },
              beforeCode: { status: 'S' }
            },
            appId: 'processingMgr'
          })
        }
      }
    },
    // 提交按钮
    async saveBtn() {
      if (this.selectUuids.length < 1) {
        this.$message({
          message: '请选择数据提交！',
          type: 'warning'
        })
        return
      }
      const obj = {}
      const arr = []
      this.selectUuids.forEach((val, index) => {
        arr.push(val.uuid)
      })
      obj.uuidList = arr
      const res = await api.submit(obj)
      if (res.code === 200) {
        this.activeName = 'S'
        this.tabChange()
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'UPDATE',
          api: '/processingMgr/pdDyeAllotNotice/submit',
          description: {
            beforeText: `在'加工管理-染整-染整调拨通知单中修改通知单号 ${this.uuid} 的状态`,
            afterText: { status: 'S' },
            beforeCode: { status: 'W' }
          },
          appId: 'processingMgr'
        })
      }
    },
    // async submitForm() {
    //   const obj = {}
    //   const arr = []
    //   arr.push(this.uuid)
    //   obj.uuidList = arr
    //   const res = await api.submit(obj)
    //   this.$message({
    //     message: res.code === 200 ? '提交成功' : res.message,
    //     type: res.code === 200 ? 'success' : 'error'
    //   })
    //   if (res.code === 200) {
    //     this.activeName = 'S'
    //     this.tabChange()
    //   }
    // },
    async cancel() {
      const obj = {}
      const arr = []
      arr.push(this.uuid)
      obj.uuidList = arr
      const res = await api.cancel(obj)
      this.$message({
        message: res.code === 200 ? '取消成功' : res.message,
        type: res.code === 200 ? 'success' : 'error'
      })
      if (res.code === 200) {
        this.activeName = 'C'
        this.tabChange()
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'UPDATE',
          api: '/processingMgr/pdDyeAllotNotice/cancel',
          description: {
            beforeText: `在'加工管理-染整-染整调拨通知单中修改通知单号 ${this.uuid} 的状态`,
            afterText: { status: 'C' },
            beforeCode: { status: 'R' }
          },
          appId: 'processingMgr'
        })
      }
    },
    async allotSubmit() {
      var arr = deepClone(this.updateForm)
      arr.forEach((val, index) => {
        val.qty = val.allotQty
      })
      console.log(arr, 'arrarrarr')
      // return
      const res = await api.allotConfirm({
        uuid: this.uuid,
        pdDyeAllotDetailUpdateSubsReqList: arr
      })
      this.$message({
        message: res.code === 200 ? '修改成功' : res.message,
        type: res.code === 200 ? 'success' : 'error'
      })
      if (res.code === 200) {
        this.activeName = 'S'
        this.tabChange()
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'UPDATE',
          api: '/processingMgr/pdDyeAllotNotice/submit',
          description: {
            beforeText: `在'加工管理-染整-染整调拨通知单中修改通知单号 ${this.uuid} 的状态`,
            afterText: { status: 'S' },
            beforeCode: { status: 'W' }
          },
          appId: 'processingMgr'
        })
        // this.getInfo({ uuid: this.uuid })
        // this.detailData._detailBranch.componentsOptions.isEdit = false
      }
    },
    selectArr(row) {
      this.selectUuids = row
    },
    tabChange() {
      this.showMore = false
      this.pagination.pageNum = 1
      this.getList()
      this.uuid = undefined
      this.detailData._detailBranch.componentsOptions.isEdit = false
    },
    rowClick(row) {
      this.uuid = row.uuid
      this.id = row.id
      this.showMore = true
      this.detailData._detailBranch.componentsOptions.isEdit = false
      this.getInfo({ uuid: row.uuid })
    }
  }
}
</script>

<style  lang="scss">
@import "@/styles/base.scss";
#DyeRequisition.DyeRequisition {
   .weaving-order-pagination {
    height: 40px;
    line-height: 40px;
    margin-top:20px;
    .TableSummation .total {
      margin: 0 0 0 10px;
    }
  }
   .el-pagination--small.pagination {
    margin-top: 0;
    text-align: left;
    margin-left: 5px;
  }
  .print-requisition-transition.transition-wrap {
    background-color: #eef5f9;
      .left-cont {
      background: #fff;
      .el-table {
        width: 100%;
        overflow: auto;
      }
    }
  }
  .print-requisition-detail-form {
    background: #fff;
    width: 100%;
    padding-top: 20px;
    > div:not(.DyeRequisition-DetailBranch) {
      // padding-left: 40px;
      // .el-form-item__content {
      //   line-height: 32px;
      // }
    }
    .el-form-item__content {
      color: #474747;
    }
    .el-form-item__label {
      color: #888e9e;
    }
    .el-form-item__label-wrap {
      margin-left: 0 !important;
      width: 100px;
      text-align: right;
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
#DyeRequisition.DyeRequisition {
  position: relative;
  height: 100%;
  // /deep/ .el-form-item__label-wrap {
  //   text-align: right;
  //   margin: 0!important;
  //   width: 120px;
  // }
  .main {
    .leftBox{position: relative;}
    .rightBox {
      border-left: 1px solid #e9eff2;
      .title {
        background: #fff;
        font-size: 18px;
        color: #15112b;
        height: 65px;
        line-height: 65px;
        padding-left: 20px;
        border-bottom: 1px solid #e9eff2;
      }
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
  /deep/.el-table__row {
    height: 50px;
  }
}
</style>

