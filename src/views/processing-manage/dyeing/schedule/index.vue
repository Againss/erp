<template>
  <div id="dye-schedule" class="list">
    <div class="search">
      <cs-custom-form
        :data-source="searchData"
        :options="formOptions"
        :form-datas="searchFormDatas"
      />
    </div>
    <div class="bk" style="position: relative">
      <div style="display: flex" class="button spe">
        <el-button v-if="$permission(['pd:pdDyeProductionSchedule:download'])" size="small" @click="out">导出</el-button>
        <importFile
          v-if="$permission(['pd:pdDyeProductionSchedule:upload'])"
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
                <div v-if="id && showMore" class="close-right" @click="showMore = !showMore">
                  <i
                    :class="{
                      'el-icon-arrow-right': showMore
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
                  <!-- :table-scrollx="true" -->
                  <cs-custom-table
                    :key="`${activeName}_${showMore}`"
                    :table-scrollx="true"
                    :height="!showMore ? null : 'calc((100vh - 330px}))'"
                    :highlight-current-row="true"
                    :row-style="{ cursor: 'pointer' }"
                    :columns="columns"
                    :row-class-name="currentRowClassName"
                    :data-source="dataSource"
                    :pagination="pagination"
                    @row-click="rowClick"
                  />
                </div>
              </div>
            </template>
            <template v-slot:right>
              <detailBranch
                :detail-data="tableData"
                :production-schedule-id="id"
                :data-status="status"
                :order-id="dyeNo"
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
        custom-class="dyeing-bottom"
      />
    </div>
  </div>
</template>

<script>
import transitionWarp from '@/components/transition-wrap/index.vue'
import tableSummation from '@/components/table-summation/index.vue'
import { deepClone } from '@/utils'
import * as api from './api/index.js'
import importFile from '@/views/processing-manage/public/components/importFile/index.vue'
import detailBranch from '@/views/processing-manage/dyeing/schedule/components/detailBranch.vue'
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
      _dyeNo: {
        prop: 'dyeNo',
        itemType: 'input',
        label: '染订单号',
        placeholder: '请输入染订单号',
        clearable: true,
        itemStyle
      },
      _supplierName: {
        prop: 'supplierName',
        itemType: 'input',
        label: '染厂',
        placeholder: '请输入染厂',
        clearable: true,
        itemStyle
      },
      _dyeSkuId: {
        prop: 'dyeSkuId',
        itemType: 'input',
        label: '色布编码',
        placeholder: '请输入色布编码',
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
        label: '染跟单',
        placeholder: '请输入染跟单',
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
      _customerColor: {
        prop: 'customerColor',
        itemType: 'input',
        label: '客户颜色',
        placeholder: '请输入客户颜色',
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
          // this.getCount()
          this.getList()
        },
        resetHandle: () => {
          this.searchFormDatas = {}
          this.searchParams = {}
        }
      }
    }
    const columns = {
      _dyeNo: {
        prop: 'dyeNo',
        label: '染订单号',
        minWidth: 160,
        fixed: 'left',
        showOverflowTooltip: true,
        formater: (scope) => {
          if (scope.row.warn) {
            return `<span style="color:#FF4444">${scope.row.dyeNo}</span>`
          }
          return scope.row.dyeNo
        }
      },
      _supplierName: {
        prop: 'supplierName',
        label: '染厂',
        minWidth: 140,
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.supplierName
        }
      },
      _index: {
        label: 'Item Code',
        prop: 'itemCode',
        width: '100',
        formater: (scope) => {
          return scope.row.itemCode
        }
      },
      _dyeSkuId: {
        prop: 'dyeSkuId',
        label: '色布编码',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _clothName: {
        prop: 'clothName',
        label: '布类',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _suggest: {
        prop: 'suggest',
        label: '成品规格',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _customerColor: {
        prop: 'customerColor',
        label: '客户颜色',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _factoryColorNo: {
        prop: 'factoryColorNo',
        label: '工厂色号',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _dyeDelivery: {
        prop: 'dyeDelivery',
        label: '染整交期',
        align: 'right',
        minWidth: 140,
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.dyeDelivery ? this.$filters.parseTime(scope.row.dyeDelivery + '', '{y}-{m}-{d}') : '-'
        }
      },
      _castVatPkg: {
        prop: 'castVatPkg',
        label: '投坯卷数',
        align: 'right',
        minWidth: 120,
        showOverflowTooltip: true
      },
      _castVatQty: {
        prop: 'castVatQty',
        label: '投坯数量(KG)',
        align: 'right',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _finishedPkg: {
        prop: 'finishedPkg',
        label: '成品卷数',
        align: 'right',
        minWidth: 120,
        showOverflowTooltip: true
      },
      _finishedQty: {
        prop: 'finishedQty',
        label: '成品数量(KG)',
        align: 'right',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _usablePkg: {
        prop: 'usablePkg',
        label: '可投卷数',
        align: 'right',
        minWidth: 100,
        showOverflowTooltip: true
      },
      _usableQty: {
        prop: 'usableQty',
        label: '可投数量(KG)',
        align: 'right',
        minWidth: 120,
        showOverflowTooltip: true
      },
      _planQty: {
        prop: 'planQty',
        label: '排厂量(KG)',
        align: 'right',
        minWidth: 120,
        showOverflowTooltip: true
      },
      _finishedSchedule: {
        prop: 'finishedSchedule',
        label: '完成进度',
        align: 'right',
        minWidth: 140,
        showOverflowTooltip: true
      }
    }
    const pagination = {
      small: false,
      layout: 'total, prev, pager, next,sizes, jumper',
      currentChange: (val) => {
        this.pagination.pageNum = val
        this.getList()
        // const com = { pageSize: this.pagination.pageSize || 20, pageNum: val }
      },
      sizeChange: (val) => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        this.getList()
        // const com = { pageNum: 1, pageSize: val }
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
          action: '/processingMgr/pdDyeProductionSchedule/upload',
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
            this.getList()
            // this.getDetail(this.id)
            this.$store.dispatch('app/fetchParamsLog', {
              opratorType: 'IMPORT',
              api: '/processingMgr/pdDyeProductionSchedule/upload',
              description: {
                beforeText: `在'加工管理-染整-染整生产进度-导入文件`
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
      _finishedPkg: {
        title: '成品总卷数:',
        num: 0
      },
      _finishedQty: {
        title: '成品总数量(KG):',
        num: 0
      },
      _castVatPkg: {
        title: '投缸卷数:',
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
      dyeNo: undefined,
      showMore: false,
      sumConfig,
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
      tableData: [],
      id: undefined,
      status: undefined,
      getDetailUuid: '',
      importFileConfig,
      errMsg
    }
  },
  watch: {
    showMore(val) {
      if (val) {
        this.pagination.layout = 'prev, pager, next'
      } else {
        this.pagination.layout = 'total, prev, pager, next,sizes, jumper'
        this.getList()
      }
      this.pagination.small = val
    }
  },
  created() {
    this.getList()
  },
  methods: {
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
    },
    tabChange() {
      this.id = undefined
      this.dyeNo = undefined
      this.status = undefined
      this.pagination.pageNum = 1
      this.getList()
      this.showMore = false
    },
    rowClick(row) {
      if (this.$permission(['pd:pdDyeProductionSchedule:detail:list'])) {
        this.showMore = true
        this.columns._dyeNo.fixed = undefined
        this.id = row.uuid
        this.status = row.status
        this.dyeNo = row.dyeNo
        this.getDetail(row.uuid)
      }
    },
    async getList() {
      this.showMore = false
      this.status = undefined
      const res = await api.list({
        pageSize: this.pagination.pageSize || 20,
        pageNum: this.pagination.pageNum || 1,
        ...this.searchParams,
        status: this.activeName
      })
      this.columns._dyeNo.fixed = 'left'
      if (res.code === 200) {
        this.dataSource = res.data && res.data.list || []
        this.pagination = {
          ...this.pagination,
          dataTotal: res.data && res.data.total || 0,
          currentPage: res.data && res.data.pageNum,
          pageNum: res.data && res.data.pageNum,
          pageSize: res.data && res.data.pageSize
        }
        const amountRes = await api.count({
          pageSize: this.pagination.pageSize || 20,
          pageNum: this.pagination.pageNum || 1,
          ...this.searchParams,
          status: this.activeName
        })
        if (amountRes.code === 200) {
          for (var i in amountRes.data) {
            this.tabs[`_${i}`] ? (this.tabs[`_${i}`].count = amountRes.data[i]) : ''
            this.sumConfig[`_${i}`]
              ? (this.sumConfig[`_${i}`].num = amountRes.data[i])
              : ''
            if (amountRes.data.distanceDeliveryDay || amountRes.data.rateLimit) {
              this.sumConfig[
                '_text'
              ].title = `<div><span style="color:#FF4444">* 红色字体</span> 为距离交期剩余时间小于为【${amountRes.data.distanceDeliveryDay}】天，进度小于为【${amountRes.data.rateLimit}%】的进度记录。</div>`
            } else {
              this.sumConfig['_text'] = {}
            }
          }
        }
      } else {
        this.errMsg(res)
      }
    },
    async getDetail(uuid) {
      this.getDetailUuid = uuid
      const res = await api.detailList({
        dyeProductionScheduleId: uuid
      })
      if (res.code === 200) {
        this.tableData = res.data || []
      } else {
        this.errMsg(res)
      }
    },
    // 高亮行样式事件
    currentRowClassName({ row, rowIndex }) {
      if (this.showMore && this.getDetailUuid === row.uuid) {
        return 'currentRowClassName'
      } else {
        return ''
      }
    }
  }
}
</script>

<style  lang="scss">
@import "@/styles/base.scss";
#dye-schedule {
  .dye-schedule-pagination {
    // height: 40px;
    // line-height: 40px;
    margin-top: 20px;
    .el-pagination--small.pagination {
      margin-top: 0;
      text-align: left;
      margin-left: 5px;
    }
  }
  .yarn-dyeing-schedule-transition.transition-wrap {
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
      // background-color: #eaf3ff !important;
      height: 50px;
    }
  }
  .dyeing-bottom.TableSummation .total {
    margin: 0 0 0 20px;
    width: 100%;
  }
}
</style>
<style lang="scss" scoped>
.TableSummation {
  border-top: 1px solid #E9EFF2;
}
#dye-schedule {
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
    position: fixed;
    bottom: 0;
    width: 100%;
    margin-left: -20px;
    height: 64px;
    line-height: 64px;
    background: #fff;
    z-index: 99;
  }
  // /deep/.el-table__fixed {
  //   box-shadow:0 -5px 5px #ddd;
  // }
  // /deep/.el-table__body-wrapper.is-scrolling-left ~ .el-table__fixed {
  //   box-shadow:none
  // }
  /deep/.el-table__fixed {
    height: auto !important;
    bottom: 9px;
  }
  /deep/.el-table__fixed::before, .el-table__fixed-right::before {
    height: 0;
  }
  /deep/.el-table__body tr.currentRowClassName td {
    background-color: transparent;
  }
  /deep/.el-table__body .currentRowClassName {
    background-color: #d8eafd;
  }
}
</style>
