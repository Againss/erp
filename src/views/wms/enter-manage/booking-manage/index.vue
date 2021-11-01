<template>
  <div class="page-main bookManage">
    <!-- 搜索栏 -->
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :form-datas="searchFormDatas"
        :data-source="searchData"
        :options="formOtions"
      />
    </div>

    <div class="page-content">
      <!-- 按钮 -->
      <div class="tab-btns">
        <el-button
          v-permission="['wms:stockIn:reservation:complete']"
          type="primary"
          size="small"
          @click="startReceving()"
        >开始收货</el-button>
        <el-dropdown>
          <el-button size="small" type="primary">
            新建入库单
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-permission="['wms:stockIn:reservation:other:submit']" @click.native="otherPutStorage()">其他入库</el-dropdown-item>
            <el-dropdown-item v-permission="['wms:stockIn:reservation:production:submit']" @click.native="productStorage()">生产入库</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- 列表 -->
      <div class="list-tab">
        <el-tabs v-model="active" @tab-click="tabClick">
          <el-tab-pane name="all">
            <span slot="label" class="label" tabindex="">
              {{ `全部 (${totalNum.all || 0})` }}
            </span>
          </el-tab-pane>
          <el-tab-pane name="toAudit">
            <span slot="label" class="label" tabindex="0">
              {{ `待审核 (${totalNum.pending || 0})` }}
            </span>
          </el-tab-pane>
          <el-tab-pane name="waitReceiving">
            <span slot="label" class="label" tabindex="1">
              {{ `待收货 (${totalNum.receiving || 0})` }}
            </span>
          </el-tab-pane>
          <el-tab-pane name="signed">
            <span slot="label" class="label" tabindex="4">
              {{ `已签收 (${totalNum.signed || 0})` }}
            </span>
          </el-tab-pane>
          <el-tab-pane name="received">
            <span slot="label" class="label" tabindex="2">
              {{ `已收货 (${totalNum.haveReceived || 0})` }}
            </span>
          </el-tab-pane>
          <el-tab-pane name="rejected">
            <span slot="label" class="label" tabindex="3">
              {{ `已拒收 (${totalNum.rejected || 0})` }}
            </span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-if="dataSource" class="page-table">
        <cs-custom-table
          ref="bokingTable"
          :table-scrollx="true"
          tooltip-effect="dark"
          :columns="columns"
          :autoresize="false"
          :data-source="dataSource"
          :highlight-current-row="highlight"
          :pagination="pagination"
          :operates="popOperates"
          :form-otions="formOtions"
          @current-change="highlightCurrentRow"
        />
      </div>
    </div>

    <!-- 审核弹框 -->
    <cs-custom-pop :options="dialogCheckBookingManageVisable" />
    <!-- 开始收货的弹框 -->
    <cs-custom-pop :options="dialogStartReceivingVisable" />
  </div>
</template>
<script>
import { PublicWms } from '@/views/wms/public/index'
import { fetchLog } from '@/views/wms/public/fetchLog'
import { BookingManage } from './components/index'
import {
  BOOKING_STORAGE_TYPE_LIST,
  BOOKING_TYPE_OF_GOODS
} from '@/views/wms/public/constants'
export default {
  mixins: [BookingManage, PublicWms, fetchLog],
  data() {
    /* 公用验证正则 */
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 样式
    const itemStyle = { width: '33%' }
    /* 搜索条件 */
    const searchData = [
      {
        prop: 'no',
        itemType: 'input',
        label: '单号',
        placeholder: '请输入单号',
        clearable: true,
        itemStyle
      },
      {
        itemType: 'date',
        prop: 'formTime',
        label: '预约送仓时间',
        placeholder: '请选择',
        type: 'daterange',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59'],
        /*         valueFormat: 'yyyy-MM-dd', */
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        itemStyle
      },
      {
        prop: 'stockType',
        itemType: 'select',
        label: '入库类型',
        clearable: true,
        itemStyle,
        dataSource: BOOKING_STORAGE_TYPE_LIST
      },
      {
        prop: 'productType',
        itemType: 'select',
        label: '货物类型',
        clearable: true,
        itemStyle,
        dataSource: BOOKING_TYPE_OF_GOODS
      },
      /*   {
          prop: 'status',
          itemStyle,
          itemType: 'select',
          label: '状态',

          dataSource: [
            {
              label: '待审核',
              value: '0'
            },
            {
              label: '待收货',
              value: '1'
            },
            {
              label: '已收货',
              value: '2'
            },
            {
              label: '已拒收',
              value: '3'
            }
          ]
        }, */
      {
        itemType: 'operate',
        submitHandle: (params) => {
          let sentTimeStart = ''
          let sentTimeEnd = ''
          if (params.hasOwnProperty('formTime') && params.formTime) {
            sentTimeStart = params.formTime[0]
            sentTimeEnd = params.formTime[1]
          }
          this.searchFormDatas = {
            ...params,
            status: '',
            sentTimeStart,
            sentTimeEnd
          }
          this.getBookingManageList({
            ...params,
            status: this.status,
            sentTimeStart,
            sentTimeEnd
          })
        },
        submitText: '查询',
        resetHandle: () => {
          this.searchFormDatas = {}
          this.getBookingManageList()
        }
      }
    ]

    /* 表头参数 */
    const columns = [
      /*  {
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
        prop: 'deliveryNo',
        label: '关联单号',
        align: 'left',
        minWidth: 130
      },
      {
        prop: 'sentInPlan',
        label: '预约送仓时间',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 130,
        formater: (scope) => {
          if (scope.row.sentInPlan) {
            return this.$utils.parseTime(scope.row.sentInPlan, '{y}-{m}-{d}')
          }
        }
      },
      {
        prop: 'stockType',
        label: '入库类型',
        align: 'left',
        minWidth: 110,
        formater: (scope) => {
          const stockType = scope.row.stockType
          if (stockType === 1) {
            return '采购入库'
          } else if (stockType === 2) {
            return '生产入库'
          } else if (stockType === 2) {
            return '生产入库'
          } else if (stockType === 3) {
            return '调拨入库'
          } else if (stockType === 4) {
            return '退货入库'
          } else if (stockType === 5) {
            return '盘盈入库'
          } else if (stockType === 6) {
            return '其他入库'
          }
        }
      },
      {
        prop: 'productType',
        label: '货物类型',
        align: 'left',
        minWidth: 110,
        formater: (scope) => {
          const productType = scope.row.productType.toString()
          if (productType === '1') {
            return '布'
          } else if (productType === '2') {
            return '纱'
          }
        }
      },
      {
        prop: 'numberInPlan',
        label: '预约入库数量',
        align: 'right',
        minWidth: 140
      },
      {
        prop: 'weightInPlan',
        label: '预约入库重量(KG)',
        align: 'right',
        minWidth: 140
      },
      {
        prop: 'productType',
        label: '包装单位',
        align: 'left',
        minWidth: 110,
        formater: (scope) => {
          const productType = scope.row.productType.toString()
          if (productType === '1') {
            return '卷'
          } else if (productType === '2') {
            return '件'
          }
        }
      },
      {
        prop: 'warehouseName',
        label: '预约入库仓库',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 130
      },
      {
        prop: 'deliveryman',
        label: '送货司机信息',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 130,
        formater: (scope) => {
          // return `${deliveryman}<br>` + `${scope.row.deliveryInfo.deliverymanPhone}<br>`
          const deliveryman = scope.row.deliveryInfo.deliveryman
          if (deliveryman) {
            return deliveryman
          }
        }
      },
      {
        prop: 'status',
        label: '状态',
        align: 'left',
        minWidth: 110,
        formater: (scope) => {
          const status = scope.row.status.toString()
          if (status === '0') {
            return '<span style="color:#FF9B02">待审核</span>'
          } else if (status === '1') {
            return '<span style="color:#FF9B02">待收货</span>'
          } else if (status === '2') {
            return '<span style="color:#00BCC5">已收货</span>'
          } else if (status === '3') {
            return '<span style="color:#888E9E">已拒收</span>'
          } else if (status === '4') {
            return '<span style="color:#888E9E">已签收</span>'
          }
        },
        isShow: () => {
          return this.active === 'all'
        }
      },
      {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 160
      }
    ]

    /*  const moreHandle = [
       {
         moreHandleTag: '打印收货单',
         permitTag: '',
         isShow: (scope) => {
           return true
         },
         method: (scope) => {
           this.$router.push({
             path: '/wms/enter-manage/booking-manage/print-receiving-order'
           })
         }
       },
       {
         moreHandleTag: '打印贴码',
         isShow: true,
         method: (scope) => {
           // this.$set(this.dialogPrintPostCode, 'visible', true)
           this.$router.push({
             path: '/wms/enter-manage/booking-manage/print-post-code'
           })
         }
       },
       {
         moreHandleTag: '打印签收单',
         isShow: (scope) => {
           if (scope.row.status.toString() === '2') {
             return true
           }
           return false
         },
         method: (scope) => {
           this.$router.push({
             path: '/wms/enter-manage/booking-manage/print-sign-order'
           })
         }
       }
     ] */

    const newDataSource = [
      {
        label: '审核',
        permitTag: '',
        isShow: (scope) => {
          if (
            scope.row.status.toString() === '0' &&
            this.$permission(['wms:stockIn:reservation:audit'])
          ) {
            return true
          }
          return false
        },
        handle: (scope) => {
          if (scope.row.reservationNo) {
            this.$set(this.dialogCheckBookingManageVisable, 'formDatas', {
              reservationNo: scope.row.reservationNo
            })
            this.$set(this.dialogCheckBookingManageVisable, 'visible', true)
          }
        }
      },
      {
        label: '详情',
        permitTag: '',
        isShow: this.$permission(['wms:stockIn:reservation:info']),
        handle: (scope) => {
          if (scope.row.reservationNo) {
            this.$router.push({
              path: '/wms/enter-manage/booking-manage/booking-details',
              query: {
                type: 'details',
                reservationNo: scope.row.reservationNo,
                status: scope.row.status
              }
            })
          }
        }
      },
      {
        label: '打印收货单',
        permitTag: '',
        isShow: (scope) => {
          if (
            scope.row.status.toString() === '1' &&
            this.$permission(['wms:stockIn:reservation:printReceiptForm'])
          ) {
            return true
          }
          return false
        },
        handle: (scope) => {
          if (scope.row.reservationNo) {
            this.$router.push({
              path: '/wms/enter-manage/booking-manage/print-sign-order',
              query: { reservationNo: scope.row.reservationNo }
            })
          }
        }
      },
      {
        label: '打印贴码',
        isShow: (scope) => {
          if (
            scope.row.status.toString() === '2' &&
            this.$permission(['wms:stockIn:reservation:printSerial'])
          ) {
            return true
          }
          return false
        },
        handle: (scope) => {
          // this.$set(this.dialogPrintPostCode, 'visible', true)
          if (scope.row.reservationNo) {
            this.$router.push({
              path: '/wms/enter-manage/booking-manage/print-post-code',
              query: {
                reservationNo: scope.row.reservationNo,
                productType: scope.row.productType
              }
            })
          }
        }
      },
      {
        label: '打印签收单',
        isShow: (scope) => {
          if (
            scope.row.status.toString() === '2' &&
            this.$permission(['wms:stockIn:reservation:printSignForm'])
          ) {
            return true
          }
          return false
        },
        handle: (scope) => {
          if (scope.row.reservationNo) {
            this.$router.push({
              path: '/wms/enter-manage/booking-manage/print-receiving-order',
              query: { reservationNo: scope.row.reservationNo }
            })
          }
        }
      },
      {
        label: '通过',
        permitTag: '',
        isShow: (scope) => {
          if (
            scope.row.status.toString() === '4' &&
            this.$permission(['wms:stockIn:reservation:audit:signed'])
          ) {
            return true
          }
          return false
        },
        handle: (scope) => {
          const obj = {
            reservationNo: scope.row.reservationNo,
            status: 'P'
          }
          this.signPass(obj)
        }
      },
      {
        label: '不通过',
        permitTag: '',
        isShow: (scope) => {
          if (
            scope.row.status.toString() === '4' &&
            this.$permission(['wms:stockIn:reservation:audit:signed'])
          ) {
            return true
          }
          return false
        },
        handle: (scope) => {
          const obj = {
            reservationNo: scope.row.reservationNo,
            status: 'R'
          }
          this.signPass(obj)
        }
      }
    ]

    /* 分页 */
    const pagination = {
      // layout: 'prev, pager, next, jumper, ->, total,slot',
      currentChange: (val) => {
        console.log('currentChange', val, this.searchFormDatas.status, this.actice)
        if (this.active === 'all') {
          this.searchFormDatas.status = ''
        } else if (this.active === 'toAudit') {
          this.searchFormDatas.status = 0
        } else if (this.active === 'waitReceiving') {
          this.searchFormDatas.status = 1
        } else if (this.active === 'received') {
          this.searchFormDatas.status = 2
        } else if (this.active === 'rejected') {
          this.searchFormDatas.status = 3
        } else if (this.active === 'signed') {
          this.searchFormDatas.status = 4
        }
        this.getBookingManageList({
          ...this.searchFormDatas,
          pageSize: this.pagination.pageSize,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        console.log('sizeChange', val)
        if (this.active === 'all') {
          this.searchFormDatas.status = ''
        } else if (this.active === 'toAudit') {
          this.searchFormDatas.status = 0
        } else if (this.active === 'waitReceiving') {
          this.searchFormDatas.status = 1
        } else if (this.active === 'received') {
          this.searchFormDatas.status = 2
        } else if (this.active === 'rejected') {
          this.searchFormDatas.status = 3
        } else if (this.active === 'signed') {
          this.searchFormDatas.status = 4
        }
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        this.getBookingManageList({
          ...this.searchFormDatas,
          pageNum: this.pagination.pageNum,
          pageSize: val
        })
      }
    }

    /* 操作 */
    const popOperates = {
      label: '操作',
      align: 'left',
      fixed: 'right',
      width: 220,
      dataSource: newDataSource
      /*       components: {
              handle
            },
            componentsOptions: {
              moreHandle,
              dataSource: newDataSource
            } */
    }
    const statusItem = {
      prop: 'status',
      itemType: 'select',
      label: '审核',
      value: '2',
      rules: [{ ...commonBlurReg, message: '请选择审核意见！' }],
      dataSource: [
        {
          value: '1',
          label: '同意'
        },
        {
          value: '3',
          label: '拒绝'
        }
      ],
      change: (value) => {
        // 1-审核通过，3-拒收
        if (value === '3') {
          this.$set(
            this.dialogCheckBookingManageVisable,
            'content',
            rejectionReasonArr
          )
        } else {
          this.$set(this.dialogCheckBookingManageVisable, 'content', statusArr)
        }
      },
      placeholder: '请选择'
    }

    const rejectionReasonItem = {
      prop: 'rejectReason',
      type: 'textarea',
      rows: 6,
      itemType: 'input',
      label: '原因'
    }
    const statusArr = [statusItem]
    const rejectionReasonArr = [statusItem, rejectionReasonItem]

    /* 审核弹框 */
    const dialogCheckBookingManageVisable = {
      itemType: 'dialog',
      visible: false,
      title: '预约入库审核',
      okText: '确定',
      close: (params) => {
        this.$set(this.dialogCheckBookingManageVisable, 'content', statusArr)
      },
      ok: (params) => {
        if (params.reservationNo) {
          this.getReservationAudit({
            reservationNo: params.reservationNo,
            status: params.status,
            rejectReason: params.rejectReason
          })
        }
      },
      cancel: (params) => {
        this.$set(this.dialogCheckBookingManageVisable, 'visible', false)
        this.$set(this.dialogCheckBookingManageVisable, 'content', statusArr)
      },
      content: statusArr
    }

    /* 开始收货 */
    const dialogStartReceivingVisable = {
      itemType: 'dialog',
      visible: false,
      title: '开始收货',
      okText: '确定',
      formOptions: {
        labelPosition: 'top'
      },
      ok: (params) => {
        this.valitateStatus(params).then((status) => {
          if (status === true) {
            if (this.checkDereservationNo) {
              this.$router.push({
                path: '/wms/enter-manage/booking-manage/booking-details',
                query: {
                  reservationNo: this.checkDereservationNo,
                  type: 'start',
                  status: this.checkStatus
                }
              })
            } else if (params.reservationNo) {
              this.$router.push({
                path: '/wms/enter-manage/booking-manage/booking-details',
                query: {
                  reservationNo: params.reservationNo,
                  type: 'start',
                  status: this.checkStatus
                }
              })
            }
          }
        })
      },
      cancel: (params) => {
        this.$set(this.dialogStartReceivingVisable, 'visible', false)
      },
      content: [
        {
          prop: 'reservationNo',
          type: 'input',
          itemType: 'input',
          label: '请输入预约单号',
          rules: [{ ...commonBlurReg, message: '关联单号不能为空！' }]
        }
      ]
    }

    return {
      active: 'all',
      highlight: true,
      searchFormDatas: {},
      searchData,
      columns,
      formOtions: {
        layout: true,
        inline: true,
        size: 'small'
      },
      totalNum: {}, // 页签数量
      dataSource: [],
      checkDereservationNo: '',
      checkStatus: '',
      pagination,
      popOperates,
      dialogCheckBookingManageVisable,
      dialogStartReceivingVisable,
      status: undefined
    }
  }
}
</script>

<style lang='scss' scoped>
.bookManage {
  /deep/.el-tabs__header{
    margin-bottom: 0.5px;
    }
  .list-tab {
  background: #fff;
  /deep/.el-tabs__nav .el-tabs__item {
    height: 60px;
    line-height: 60px;
  }

  }
  /deep/.el-tabs__nav-wrap {
    padding-left: 20px;
    margin-left: 0;
    margin-right: 0;
  }
}
</style>
