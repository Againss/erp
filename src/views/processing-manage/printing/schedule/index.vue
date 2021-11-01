<template>
  <div id="print-schedule" class="list">
    <div class="search">
      <cs-custom-form
        :data-source="searchData"
        :options="formOptions"
        :form-datas="searchFormDatas"
      />
    </div>
    <div class="bk" style="position: relative">
      <div style="display: flex" class="button spe">
        <el-button v-if="$permission(['pd:printProductionSchedule:download'])" size="small" @click="out">导出</el-button>
        <importFile
          v-if="$permission(['pd:printProductionSchedule:upload'])"
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
                :order-id="printNo"
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
        custom-class="printing-bottom"
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
import detailBranch from '@/views/processing-manage/printing/schedule/components/detailBranch.vue'
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
      _printNo: {
        prop: 'printNo',
        itemType: 'input',
        label: '印花单号',
        placeholder: '请输入印花单号',
        clearable: true,
        itemStyle
      },
      _supplierName: {
        prop: 'supplierName',
        itemType: 'input',
        label: '印花厂',
        placeholder: '请输入印花厂',
        clearable: true,
        itemStyle
      },
      _skuId: {
        prop: 'skuId',
        itemType: 'input',
        label: '花布编码',
        placeholder: '请输入花布编码',
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
      _customerName: {
        prop: 'customerName',
        itemType: 'input',
        label: '客户',
        placeholder: '请输入客户',
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
      _printNo: {
        prop: 'printNo',
        label: '印花单号',
        minWidth: 160,
        showOverflowTooltip: true,
        formater: (scope) => {
          if (scope.row.overCheck) {
            return `<span style="color:#FF4444">${scope.row.printNo}</span>`
          }
          return scope.row.printNo
        }
      },
      _supplierName: {
        prop: 'supplierName',
        label: '印花厂',
        minWidth: 180,
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.supplierName
        }
      },
      _itemCode: {
        prop: 'itemCode',
        label: 'Item Code',
        width: '100',
        formater: (scope) => {
          return scope.row.itemCode
        }
      },
      _skuId: {
        prop: 'skuId',
        label: '花布编码',
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
        label: '客户花号',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _printDelivery: {
        prop: 'printDelivery',
        label: '印花交期',
        minWidth: 140,
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.printDelivery ? this.$filters.parseTime(scope.row.printDelivery + '', '{y}-{m}-{d}') : '-'
        }
      },
      _castVatPkg: {
        prop: 'castVatPkg',
        label: '投缸卷数',
        align: 'right',
        minWidth: 120,
        showOverflowTooltip: true
      },
      _castVatQty: {
        prop: 'castVatQty',
        label: '投缸数量(KG)',
        align: 'right',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _productPkg: {
        prop: 'productPkg',
        label: '成品卷数',
        align: 'right',
        minWidth: 120,
        showOverflowTooltip: true
      },
      _productQty: {
        prop: 'productQty',
        label: '成品数量(KG)',
        align: 'right',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _planQty: {
        prop: 'planQty',
        label: '排厂量(KG)',
        align: 'right',
        minWidth: 120,
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
        minWidth: 140,
        showOverflowTooltip: true
      },
      _process: {
        prop: 'process',
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
          action: '/processingMgr/printProductionSchedule/upload',
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
            // this.getDetail(this.id)
            this.getList()
            this.$store.dispatch('app/fetchParamsLog', {
              opratorType: 'IMPORT',
              api: '/processingMgr/printProductionSchedule/upload',
              description: {
                beforeText: `在'加工管理-印花-印花生产进度-导入文件`
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
      _PRODUCT_PKG: {
        title: '成品总卷数:',
        num: 0
      },
      _PRODUCT_QTY: {
        title: '成品总数量(KG):',
        num: 0
      },
      _CAST_VAT_PKG: {
        title: '色布总卷数:',
        num: 0
      },
      _CAST_VAT_QTY: {
        title: '色布总数量(KG):',
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
        _ALL: {
          label: '全部',
          count: 0,
          value: 'A'
        },
        _HANDING: {
          label: '进行中',
          count: 0,
          value: 'N'
        },
        _FINISH: {
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
      printNo: undefined,
      importFileConfig,
      visible: undefined,
      status: undefined,
      getDetailUuid: '',
      errMsg,
      getDay: 0,
      getProcess: ''
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
      this.status = undefined
      this.printNo = undefined
      this.pagination.pageNum = 1
      this.getList()
      this.showMore = false
    },
    rowClick(row) {
      if (this.$permission(['pd:printProductionSchedule:detail:list'])) {
        this.showMore = true
        this.columns._printNo.fixed = undefined
        this.id = row.uuid
        this.status = row.status
        this.printNo = row.printNo
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
      console.log(res, 'res')
      console.log(this.columns, 'columnscolumnscolumnscolumns')
      this.columns._printNo.fixed = 'left'
      if (res.code === 200) {
        this.dataSource = res.data && res.data.list || []
        this.pagination = {
          ...this.pagination,
          dataTotal: res.data && res.data.total || 0,
          currentPage: res.data && res.data.pageNum,
          pageNum: res.data && res.data.pageNum || 1,
          pageSize: res.data && res.data.pageSize || 20
        }
        const amountRes = await api.count({
          ...this.searchParams,
          status: this.activeName
        })
        if (amountRes.code === 200) {
          for (var i in amountRes.data) {
            this.tabs[`_${i}`] ? (this.tabs[`_${i}`].count = amountRes.data[i]) : ''
            this.tabs[`_${i}`] ? (this.tabs[`_${i}`].count = amountRes.data[i]) : ''
            this.sumConfig[`_${i}`]
              ? (this.sumConfig[`_${i}`].num = amountRes.data[i])
              : ''
            if (amountRes.data.distanceDeliveryDay || amountRes.data.rateLimit) {
              this.sumConfig[
                '_text'
              ].title = `<div><span  style="color:#FF4444">* 红色字体</span> 为距离交期剩余时间小于为【${amountRes.data.distanceDeliveryDay}】天，进度小于为【${amountRes.data.rateLimit}%】的进度记录。</div>`
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
        scheduleId: uuid
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
#print-schedule {
  .print-schedule-pagination {
    // height: 40px;
    // line-height: 40px;
    margin-top: 20px;
    .TableSummation .total {
      margin: 0 0 0 10px;
    }
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
      // background-color: #D8EAFD !important;
      height: 50px;
    }
  }
  .printing-bottom.TableSummation .total {
    margin: 0 0 0 20px;
    width: 100%;
  }
}
</style>
<style lang="scss" scoped>
.TableSummation {
  border-top: 1px solid #E9EFF2;
}
#print-schedule {
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
  /deep/.el-table__fixed {
    height: auto !important;
    bottom: 9px;
  }
  // /deep/.el-table__fixed {
  //   box-shadow:0 -5px 5px #ddd;
  // }
  // /deep/.el-table__body-wrapper.is-scrolling-left ~ .el-table__fixed {
  //   box-shadow:none
  // }
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
