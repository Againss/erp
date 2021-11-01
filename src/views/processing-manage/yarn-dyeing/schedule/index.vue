<template>
  <div id="yarn-schedule" class="list">
    <div class="search">
      <cs-custom-form
        :data-source="searchData"
        :options="formOptions"
        :form-datas="searchFormDatas"
      />
    </div>
    <div class="bk" style="position: relative">
      <div style="display: flex" class="button spe">
        <el-button
          v-if="$permission(['pd:pdDyeingProductionSchedule:download'])"
          size="small"
          @click="out"
        >导出</el-button>
        <importFile
          v-if="$permission(['pd:pdDyeingProductionSchedule:upload'])"
          style="margin-left: 10px"
          :config="importFileConfig"
          :visible="visible"
        />
      </div>
      <div class="tabs">
        <el-tabs v-model="activeName" @tab-click="tabChange">
          <el-tab-pane v-for="(i, index) in tabs" :key="index" :name="i.value">
            <span slot="label"> {{ `${i.label} (${i.count})` }}</span>
          </el-tab-pane>
        </el-tabs>
        <div class="main">
          <transitionWarp
            height="330px"
            width="288px"
            class-name="yarn-dyeing-schedule-transition"
            :is-show="showMore"
            @isShow="
              (val) => {
                showMore = val;
              }
            "
          >
            <template v-slot:left>
              <div class="leftBox">
                <div
                  v-if="id && showMore"
                  class="close-right"
                  @click="showMore = !showMore"
                >
                  <i
                    :class="{
                      'el-icon-arrow-right': showMore,
                    }"
                  />
                </div>
                <!-- 列表 -->
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
                    :row-style="{ cursor: 'pointer' }"
                    :height="!showMore ? null : 'calc((100vh - 330px}))'"
                    :highlight-current-row="true"
                    :columns="columns"
                    :data-source="dataSource"
                    :pagination="pagination"
                    :row-class-name="currentRowClassName"
                    @row-click="rowClick"
                  />
                </div>
              </div>
            </template>
            <template v-slot:right>
              <detailBranch
                :detail-data="tableData"
                :production-schedule-id="id"
                :order-id="orderId"
                :status="status"
                @update="getDetail(id)"
              />
            </template>
          </transitionWarp>
        </div>
      </div>
    </div>
    <div class="bottom-content">
      <tableSummation
        :config="sumConfig"
        :sumtext-is-hidden="true"
        custom-class="yarn-dyeing-bottom"
      />
    </div>
  </div>
</template>

<script>
import * as api from './api/index.js'
import transitionWarp from '@/components/transition-wrap/index.vue'
import tableSummation from '@/components/table-summation/index.vue'
import { deepClone } from '@/utils'
import importFile from '@/views/processing-manage/public/components/importFile/index.vue'
import detailBranch from '@/views/processing-manage/yarn-dyeing/schedule/components/detailBranch.vue'
export default {
  components: { importFile, transitionWarp, detailBranch, tableSummation },
  data() {
    const errMsg = (res) => {
      this.$message({
        message: res.message,
        type: 'error'
      })
    }
    const itemStyle = { width: '33%' }
    const searchData = {
      _orderId: {
        prop: 'orderId',
        itemType: 'input',
        label: '染纱单号',
        placeholder: '请输入染纱单号',
        clearable: true,
        itemStyle
      },
      _batchNo: {
        prop: 'batchNo',
        itemType: 'input',
        label: '缸号',
        placeholder: '请输入缸号',
        clearable: true,
        itemStyle
      },
      _dyeingColor: {
        prop: 'dyeingColor',
        itemType: 'input',
        label: '染纱颜色',
        placeholder: '请输入染纱颜色',
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
      _pmUserName: {
        prop: 'pmUserName',
        itemType: 'input',
        label: '跟单员',
        placeholder: '请输入跟单员',
        clearable: true,
        itemStyle
      },
      _supplierName: {
        prop: 'supplierName',
        itemType: 'input',
        label: '染纱厂',
        placeholder: '请输入染纱厂',
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
      _yarnId: {
        prop: 'yarnId',
        itemType: 'input',
        label: '色纱编码',
        placeholder: '请输入色纱编码',
        clearable: true,
        itemStyle
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          const p = deepClone(params)
          this.searchParams = p
          this.pagination.pageNum = 1
          this.pagination.pageSize = 20
          this.id = undefined
          this.status = undefined
          this.orderId = undefined
          this.showMore = false
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
      _index: {
        label: '序号',
        fixed: 'left',
        width: 50,
        formater: (scope) => {
          if (scope.row.warn && this.redShow) {
            return `<span style="color:#FF4444">${
              (this.pagination.currentPage - 1) * this.pagination.pageSize +
              (scope.$index + 1)
            }</span>`
          }
          return (
            (this.pagination.currentPage - 1) * this.pagination.pageSize +
            (scope.$index + 1)
          )
        }
      },
      _orderId: {
        prop: 'orderId',
        label: '染纱单号',
        fixed: 'left',
        minWidth: 160,
        showOverflowTooltip: true,
        style: {
          color: 'rgb(24, 144, 255)',
          cursor: 'pointer'
        },
        formater: (scope) => {
          if (scope.row.warn && this.redShow) {
            return `<span style="color:#FF4444">${scope.row.orderId}</span>`
          }
          return scope.row.orderId
        },
        handle: (scope) => {
          // 点击可跳转至染纱订单详情页
          this.$router.push({
            path: '/processing/yarn-dyeing/order',
            query: { orderId: scope.row.orderId }
          })
        }
      },
      _supplierName: {
        prop: 'supplierName',
        label: '染纱厂',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _yarnId: {
        prop: 'yarnId',
        label: '色纱编码',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _yarnType: {
        prop: 'yarnType',
        label: '纱名',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _yarnAttributes: {
        prop: 'yarnAttributes',
        label: '纱属性',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _dyeingColor: {
        prop: 'dyeingColor',
        label: '染纱颜色',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _factoryNo: {
        prop: 'factoryNo',
        label: '工厂色号',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _colorRatio: {
        prop: 'colorRatio',
        label: '颜色占比',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _castVatPkg: {
        prop: 'castVatPkg',
        label: '投缸件数',
        align: 'right',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _castVatQty: {
        prop: 'castVatQty',
        label: '投缸数量(KG)',
        align: 'right',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _yarnPkg: {
        prop: 'yarnPkg',
        label: '色纱件数',
        align: 'right',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _yarnQty: {
        prop: 'yarnQty',
        label: '色纱数量(KG)',
        align: 'right',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _usablePkg: {
        prop: 'usablePkg',
        label: '可投件数',
        align: 'right',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _usableQty: {
        prop: 'usableQty',
        label: '可投数量(KG)',
        align: 'right',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _factoryNum: {
        prop: 'factoryNum',
        label: '排厂量(KG)',
        align: 'right',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _dyeingDelivery: {
        prop: 'dyeingDelivery',
        label: '染纱交期',
        minWidth: 140,
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.$utils.parseTime(scope.row.dyeingDelivery, '{y}-{m}-{d}')
        }
      },
      _finishRate: {
        prop: 'finishRate',
        label: '完成进度',
        minWidth: 140,
        align: 'right',
        showOverflowTooltip: true
      }
    }
    const pagination = {
      small: false,
      layout: 'total, prev, pager, next,sizes, jumper',
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
    const importFileConfig = {
      content: {
        _down: {
          downCallBack: () => {
            this.downTemplate()
          }
        },
        _upload: {
          action: '/processingMgr/pdDyeingProductionSchedule/upload',
          accept: '.xlsx,.xls,XLSX,.XLS',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          // autoUpload: false,
          onSuccess: (res) => {
            // this.visible = false
            this.$message({
              message: '上传成功',
              type: 'success'
            })
            if (this.showMore) {
              this.showMore = false
            }
            this.getList()
            this.getCount()
            this.$store.dispatch('app/fetchParamsLog', {
              opratorType: 'IMPORT',
              api: '/processingMgr/pdDyeingProductionSchedule/upload',
              description: {
                beforeText: `在'加工管理-染纱-染纱生产进度-批量导入文件`
                // beforeCode:{}
              },
              appId: 'processingMgr'
            })
          },
          onError: (res) => {},
          uploadChange: (file, fileList) => {}
        }
      }
    }
    const sumConfig = {
      _yarnPkg: {
        title: ' 色纱总件数:',
        num: 0
      },
      _yarnQty: {
        title: '色纱总数量(KG):',
        num: 0
      },
      _castVatPkg: {
        title: '投缸总件数:',
        num: 0
      },
      _castVatQty: {
        title: '投缸总数量(KG):',
        num: 0
      },
      _text: {
        textStyle: {
          'font-size': '12px',
          color: '#666666'
        },
        style: {
          position: 'fixed',
          right: 0
        },
        title: `<div><span  style="color:#FF4444">* 红色字体</span> 为距离交期剩余时间小于为【3】天，进度小于为【0%】的进度记录。</div>`
      }
    }
    return {
      visible: undefined,
      orderId: undefined,
      id: undefined,
      sumConfig,
      importFileConfig,
      showMore: false,
      searchParams: {},
      searchData,
      formOptions: {
        size: 'small',
        layout: true,
        inline: true
      },
      searchFormDatas: {},
      activeName: 'N',
      tabs: {
        _total: {
          label: '全部',
          count: 0,
          value: 'A'
        },
        _N: {
          label: '进行中',
          count: 0,
          value: 'N'
        },
        _Y: {
          label: '已完成',
          count: 0,
          value: 'Y'
        }
      },
      columns,
      dataSource: [],
      pagination,
      errMsg,
      tableData: [],
      status: undefined,
      redShow: false,
      tableKey: undefined
    }
  },
  watch: {
    showMore(val) {
      if (val) {
        this.pagination.layout = 'prev, pager, next'
        this.$set(this.columns._index, 'fixed', false)
        this.$set(this.columns._orderId, 'fixed', false)
      } else {
        this.$set(this.columns._index, 'fixed', 'left')
        this.$set(this.columns._orderId, 'fixed', 'left')
        this.pagination.layout = 'total, prev, pager, next,sizes, jumper'
        this.getCount()
        this.getList()
      }
      this.pagination.small = val
    }
  },
  created() {
    this.getCount()
    this.getList()
  },
  methods: {
    currentRowClassName({ row, rowIndex }) {
      if (this.showMore && this.id === row.productionScheduleId) {
        return 'currentRowClassName'
      } else {
        return ''
      }
    },
    async getCount() {
      this.redShow = false
      const res = await api.count({
        pageSize: this.pagination.pageSize || 20,
        pageNum: this.pagination.pageNum || 1,
        ...this.searchParams,
        status: this.activeName !== 'A' ? this.activeName : undefined
      })
      if (res.code === 200) {
        for (var i in res.data) {
          this.tabs[`_${i}`] ? (this.tabs[`_${i}`].count = res.data[i]) : ''
          this.sumConfig[`_${i}`]
            ? (this.sumConfig[`_${i}`].num = res.data[i])
            : ''
          if (res.data.distanceDeliveryDay || res.data.rateLimit) {
            this.redShow = true
            this.sumConfig[
              '_text'
            ].title = `<div><span  style="color:#FF4444">* 红色字体</span> 为距离交期剩余时间小于为【${res.data.distanceDeliveryDay}】天，进度小于为【${res.data.rateLimit}%】的进度记录。</div>`
          } else {
            this.sumConfig['_text'] = {}
          }
        }
      } else {
        this.errMsg(res)
      }
    },
    async getList() {
      const res = await api.list({
        pageSize: this.pagination.pageSize || 20,
        pageNum: this.pagination.pageNum || 1,
        ...this.searchParams,
        status: this.activeName !== 'A' ? this.activeName : undefined
      })
      if (res.code === 200) {
        this.dataSource = res.data && res.data.list ? res.data.list : []
        this.pagination = {
          ...this.pagination,
          dataTotal: res.data.total || 0,
          currentPage: res.data.pageNum,
          pageNum: res.data.pageNum,
          pageSize: res.data.pageSize
        }
      } else {
        this.errMsg(res)
      }
    },
    async downTemplate() {
      const res = await api.downloadTemplate({})
      this.$utils.downloadStream(res)
    },
    async out() {
      const res = await api.download({
        pageSize: this.pagination.pageSize || 20,
        pageNum: this.pagination.pageNum || 1,
        ...this.searchParams,
        status: this.activeName !== 'A' ? this.activeName : undefined
      })
      this.$utils.downloadStream(res)
      this.$store.dispatch('app/fetchParamsLog', {
        opratorType: 'EXPORT',
        api: '/processingMgr/pdDyeingProductionSchedule/download',
        description: {
          beforeText: `在'加工管理-染纱-染纱生产进度-导出记录`,
          beforeCode: this.searchParams
        },
        appId: 'processingMgr'
      })
    },
    tabChange() {
      this.id = undefined
      this.status = undefined
      this.orderId = undefined
      this.pagination.pageNum = 1
      this.getCount()
      this.getList()
      this.showMore = false
    },
    rowClick(row) {
      if (!this.$permission(['pd:pdDyeingProductionSchedule:detail:list'])) {
        return
      }
      this.showMore = true
      this.status = row.status
      this.orderId = row.orderId
      this.id = row.productionScheduleId
      this.getDetail(row.productionScheduleId)
    },
    async getDetail(productionScheduleId) {
      const res = await api.detailList({
        productionScheduleId: productionScheduleId
      })
      if (res.code === 200) {
        this.tableData = res.data || []
      } else {
        this.errMsg(res)
      }
    }
  }
}
</script>

<style  lang="scss">
@import "@/styles/base.scss";
#yarn-schedule {
  .yarn-dyeing-schedule-transition.transition-wrap {
    background-color: #eef5f9;
    .left-cont {
      background: #fff;
      border-right: 1px solid #eeeff0;
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
  }
  .yarn-dyeing-bottom.TableSummation {
    border-top: 1px solid #e9eff2;
    .total {
      margin: 0 0 0 20px;
      width: 100%;
    }
  }
}
</style>
<style lang="scss" scoped>
#yarn-schedule {
  padding-bottom: 70px;
  .button.spe {
    position: absolute;
    right: 20px;
    top: 14px;
    z-index: 3;
  }
  .main {
    .leftBox {
      position: relative;
    }
    .rightBox {
      padding-bottom: 70px;
      background: #eef5f9;
      border-left: none;
    }
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
  .bottom-content {
    z-index: 3;
    position: fixed;
    bottom: 0;
    width: 100%;
    margin-left: -20px;
    height: 64px;
    line-height: 64px;
    background: #fff;
  }
  /deep/.el-table__fixed-right {
    height: auto !important;
  }
  /deep/.el-table__fixed-right {
    bottom: 0;
  }
  /deep/.el-table__fixed {
    height: auto !important;
  }
  /deep/.el-table__fixed {
    bottom: 9px;
  }
  /deep/.el-table__body tr.currentRowClassName td {
    background-color: transparent;
  }
  /deep/.el-table__body .currentRowClassName {
    background-color: #d8eafd;
  }
}
</style>
