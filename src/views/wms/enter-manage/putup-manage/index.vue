<template>
  <div class="page-main putUp">
    <!-- 搜索栏 -->
    <div class="search islayoutForm">
      <cs-custom-form
        ref="searchForm"
        :form-datas="searchFormDatas"
        :data-source="searchData"
        :options="formOtions"
      />
    </div>

    <!-- 列表 -->
    <div class="list-tab">
      <!-- 列表 -->
      <el-tabs v-model="active" @tab-click="tabClick">
        <el-tab-pane name="all">
          <span slot="label" class="label">
            {{ `全部 (${totalNum.all || 0})` }}
          </span>
        </el-tab-pane>
        <el-tab-pane name="waiting">
          <span slot="label" class="label">
            {{ `待上架 (${totalNum.toShelf || 0})` }}
          </span>
        </el-tab-pane>
        <el-tab-pane name="beenOn">
          <span slot="label" class="label">
            {{ `已上架 (${totalNum.onShelf || 0})` }}
          </span>
        </el-tab-pane>
      </el-tabs>

      <!-- 按钮 -->
      <div class="tab-btns">
        <el-button
          v-permission="['wms:stockIn:shelf:complete']"
          type="primary"
          size="small"
          @click="confirmForPutup()"
        >上架确认</el-button>
      </div>
    </div>

    <!-- 列表 -->
    <div v-if="dataSource" class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :table-scrollx="true"
        :columns="columns"
        :autoresize="false"
        :data-source="dataSource"
        :highlight-current-row="highlight"
        :pagination="pagination"
        :operates="popOperates"
        highlight-current-indexrow
        :form-otions="formOtions"
        @current-change="highlightCurrentRow"
      />
    </div>
    <!-- 上架确认 -->
    <cs-custom-pop :options="dialogPutUpConfirmVisable" />
  </div>
</template>
<script>
import { PublicWms } from '@/views/wms/public/index'
import { PutupManage } from './components/index'
import { getStockInShelfInfoData } from './api/index'
import { PRODUCT_TYPE } from '@/views/wms/public/constants.js'
export default {
  mixins: [PutupManage, PublicWms],
  data() {
    /* 公用验证正则 */
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    /* 搜索条件 */
    const searchData = [
      {
        prop: 'no',
        itemType: 'input',
        label: '单号',
        clearable: true,
        placeholder: '请输入单号'
      },
      {
        prop: 'productType',
        itemType: 'select',
        label: '货物类型',
        dataSource: PRODUCT_TYPE,
        placeholder: '请选择货物类型',
        clearable: true
      },
      {
        itemType: 'date',
        prop: 'searchTime',
        label: '上架生成时间',
        placeholder: '请选择',
        type: 'daterange',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        itemStyle: { width: '280px' },
        defaultTime: ['00:00:00', '23:59:59'],
        /* valueFormat: 'yyyy-MM-dd', */
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间'
      },
      {
        itemType: 'operate',
        submitHandle: (params) => {
          let createdTimeStart = ''
          let createdTimeEnd = ''
          if (params.hasOwnProperty('searchTime') && params.searchTime) {
            createdTimeStart = params.searchTime[0]
            createdTimeEnd = params.searchTime[1]
          }
          this.searchFormDatas = {
            ...params,
            createdTimeStart,
            createdTimeEnd
          }
          this.getPutupManageList({
            ...params,
            createdTimeStart,
            createdTimeEnd
          })
        },
        submitText: '查询',
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    ]

    /* 表头参数 */
    const columns = [
      /*       {
              prop: 'index',
              label: '序号',
              align: 'left',
              minWidth: 60,
              formater: (row, column) => {
                return this.$pub.getPageIndex({
                  pageSize: this.pagination.pageSize,
                  currentPage: this.pagination.currentPage,
                  index: row.$index
                })
              }
            }, */
      {
        prop: 'shelfNo',
        label: '上架单号',
        align: 'left',
        minWidth: 130,
        handle: (scope) => {
          const row = scope.row
          if (row.shelfNo) {
            this.$router.push({
              path: '/wms/enter-manage/putup-manage/details',
              query: { shelfNo: row.shelfNo, status: row.status }
            })
          }
        },
        formater: (scope) => {
          const shelfNo = scope.row.shelfNo
          if (shelfNo) {
            return `<span style = 'color:#0986FF;cursor: pointer;'>${shelfNo}</span> `
          }
        }
      },
      {
        prop: 'reservationNo',
        label: '预约单号',
        align: 'left',
        minWidth: 130,
        handle: (scope) => {
          const row = scope.row
          if (row.reservationNo) {
            this.$router.push({
              path: '/wms/enter-manage/booking-manage/booking-details',
              query: {
                reservationNo: row.reservationNo,
                type: 'details'
              }
            })
          }
        },
        formater: (scope) => {
          const reservationNo = scope.row.reservationNo
          if (reservationNo) {
            return `<span style = 'color:#0986FF;cursor: pointer;'>${reservationNo}</span> `
          }
        }
      },
      {
        prop: 'formNo',
        label: '关联入库单号',
        align: 'left',
        handle: (scope) => {
          const row = scope.row
          if (row.formNo) {
            this.$router.push({
              path: '/wms/enter-manage/incoming-manage/details',
              query: { formNo: row.formNo, type: 'details' }
            })
          }
        },
        formater: (scope) => {
          const formNo = scope.row.formNo
          if (formNo) {
            return `<span style = 'color:#0986FF;cursor: pointer;'>${formNo}</span> `
          }
        },
        minWidth: 130
      },
      {
        prop: 'productType',
        label: '货物类型',
        align: 'left',
        minWidth: 110,
        formater: (scope) => {
          const productType = scope.row.productType
          if (productType === 1) {
            return '布'
          } else if (productType === 2) {
            return '纱'
          } else {
            return '--'
          }
        }
      },
      {
        prop: 'stockIn',
        label: '入库数',
        align: 'right',
        minWidth: 110
      },
      {
        prop: 'upShelf',
        label: '上架数',
        align: 'right',
        minWidth: 110
      },
      {
        prop: 'createdTime',
        label: '上架生成时间',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 160,
        formater: (scope) => {
          const createdTime = scope.row.createdTime
          if (createdTime) {
            return this.$utils.parseTime(createdTime)
          } else {
            return '--'
          }
        }
      },
      {
        prop: 'finishTime',
        label: '上架完成时间',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 160,
        formater: (scope) => {
          const finishTime = scope.row.finishTime
          if (finishTime) {
            return this.$utils.parseTime(finishTime)
          } else {
            return '--'
          }
        }
      },
      {
        prop: 'status',
        label: '状态',
        align: 'left',
        minWidth: 110,
        formater: (scope) => {
          const status = scope.row.status
          if (status === 0) {
            return '<span style="color:#FF9B02">待上架</span>'
          } else if (status === 1) {
            return '<span style="color:#00BCC5">已上架</span>'
          } else {
            return '--'
          }
        },
        isShow: () => {
          return this.active === 'all'
        }
      },
      {
        prop: 'shelfManName',
        label: '上架员',
        align: 'left',
        minWidth: 110
      }
    ]

    /* 操作 */
    let popOperatesDataSource = [
      {
        label: '打印上架单',
        permitTag: ['wms:stockIn:shelf:printShelf'],
        isShow: (scope) => {
          if (scope.row.status === 0) {
            return true
          }
          return false
        },
        handle: (params) => {
          const shelfNo = params.row.shelfNo
          if (shelfNo) {
            this.$router.push({
              path: '/wms/enter-manage/putup-manage/print-putup-order',
              query: {
                shelfNo
              }
            })
          }
        }
      },
      {
        label: '详情',
        isShow: true,
        permitTag: ['wms:stockIn:shelf:info'],
        handle: (params) => {
          const shelfNo = params.row.shelfNo
          const status = params.row.status
          if (shelfNo) {
            this.$router.push({
              path: '/wms/enter-manage/putup-manage/details',
              query: { shelfNo, status }
            })
          }
        }
      }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      fixed: 'right',
      align: 'left',
      width: 160,
      dataSource: popOperatesDataSource
    }
    /* 分页 */
    const pagination = {
      currentChange: (val) => {
        if (this.active === 'all') {
          this.searchFormDatas.status = ''
        } else if (this.active === 'waiting') {
          this.searchFormDatas.status = 0
        } else if (this.active === 'beenOn') {
          this.searchFormDatas.status = 1
        }
        this.getPutupManageList({
          ...this.searchFormDatas,
          pageSize: this.pagination.pageSize,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        if (this.active === 'all') {
          this.searchFormDatas.status = ''
        } else if (this.active === 'waiting') {
          this.searchFormDatas.status = 0
        } else if (this.active === 'beenOn') {
          this.searchFormDatas.status = 1
        }
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        this.getPutupManageList({
          ...this.searchFormDatas,
          pageNum: this.pagination.currentPage,
          pageSize: val
        })
      }
    }
    /* 上架确认 */
    const dialogPutUpConfirmVisable = {
      itemType: 'dialog',
      visible: false,
      title: '上架确认',
      okText: '确定',
      formOptions: {
        labelPosition: 'top'
      },
      ok: (params) => {
        getStockInShelfInfoData(params).then((res) => {
          if (this.$pub.responseValidate(res)) {
            if (res.data.status === 1) {
              this.$message({
                message: '已上架，请勿重复上架！',
                type: 'error',
                duration: 3000
              })
              return false
            } else if (params.shelfNo && res.data.status === 0) {
              this.$router.push({
                path: '/wms/enter-manage/putup-manage/putup-confirm',
                query: {
                  shelfNo: params.shelfNo,
                  status: params.status
                }
              })
            }
          }
        })
      },
      cancel: (params) => {
        this.$set(this.dialogPutUpConfirmVisable, 'visible', false)
      },
      content: [
        {
          prop: 'shelfNo',
          type: 'input',
          itemType: 'input',
          label: '请输入上架单号',
          rules: commonBlurReg
        }
      ]
    }

    /* 列表 */
    return {
      active: 'all',
      searchFormDatas: {},
      searchData,
      columns,
      formOtions: {
        // layout: true,
        inline: true,
        size: 'small'
      },
      totalNum: {}, // 页签数量
      dataSource: [],
      pagination,
      popOperates,
      highlight: true,
      /* 上架单号 */
      shelfNo: '',
      /* 上架确认 */
      dialogPutUpConfirmVisable,
      /* 选择状态 */
      checkStatus: '',
      /* 选择上架单号 */
      checkShelfNo: ''
    }
  },
  created() {
    this.getPutupManageList()
  }
}
</script>
<style lang="scss" scoped>
.putUp {
  .list-tab {
    padding-bottom: 1px;
    background: #fff;
    position: relative;
    /deep/.el-tabs__nav .el-tabs__item {
      height: 60px;
      line-height: 60px;
    }
  }
  /deep/ .el-tabs__header {
    margin: 0;
    .el-tabs__item {
      font-weight: 400;
    }
  }
  /deep/ .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: #d0d6da;
  }
}
</style>
