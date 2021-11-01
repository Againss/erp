<template>
  <div class="page-main">
    <!-- 搜索栏 -->
    <div class="search islayoutForm">
      <cs-custom-form
        ref="searchForm"
        :form-datas="searchFormDatas"
        :data-source="searchData"
        :options="formOtions"
      />
    </div>

    <!-- 按钮 -->
    <!--   <div class="button">
      <el-button v-permission="" type="primary" size="small"
        >上架确认</el-button
      >
    </div> -->

    <!-- 列表 -->
    <div class="page-content">
      <!-- 列表 -->
      <!--      <el-tabs v-model="active" @tab-click="tabClick">
        <el-tab-pane name="all">
          <span slot="label" class="label" tabindex="0">全部</span>
        </el-tab-pane>
        <el-tab-pane name="waiting">
          <span slot="label" class="label" tabindex="1">待入库</span>
        </el-tab-pane>
        <el-tab-pane name="beenOn">
          <span slot="label" class="label" tabindex="2">已入库</span>
        </el-tab-pane>
      </el-tabs> -->
      <div v-if="dataSource" class="page-table">
        <cs-custom-table
          tooltip-effect="dark"
          :table-scrollx="true"
          :columns="columns"
          :autoresize="false"
          :data-source="dataSource"
          :pagination="pagination"
          :operates="popOperates"
          highlight-current-indexrow
          :form-otions="formOtions"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { PublicWms } from '@/views/wms/public/index'
import { IncomingManage } from './components/index'
import {
  BOOKING_STORAGE_TYPE_LIST,
  BOOKING_TYPE_OF_GOODS
} from '@/views/wms/public/constants'
export default {
  mixins: [IncomingManage, PublicWms],
  data() {
    // 样式
    const itemStyle = { width: '33%' }
    /* 搜索条件 */
    const searchData = [
      {
        prop: 'no',
        itemType: 'input',
        label: '单号',
        clearable: true,
        placeholder: '请输入单号',
        itemStyle
      },
      {
        prop: 'stockType',
        itemType: 'select',
        label: '入库类型',
        clearable: true,
        dataSource: BOOKING_STORAGE_TYPE_LIST,
        itemStyle
      },
      {
        itemType: 'date',
        prop: 'formTime',
        label: '实际入库时间',
        placeholder: '请选择',
        type: 'daterange',
        format: 'yyyy-MM-dd',
        /*    valueFormat: 'yyyy-MM-dd', */
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59'],
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        itemStyle
      },
      {
        prop: 'productType',
        itemType: 'select',
        label: '货物类型',
        clearable: true,
        dataSource: BOOKING_TYPE_OF_GOODS,
        itemStyle
      },
      {
        prop: 'warehouseCode',
        itemType: 'select',
        label: '入库仓库',
        filterable: true,
        clearable: true,
        itemStyle
      },
      {
        itemType: 'operate',
        submitHandle: (params) => {
          let stockInStart = ''; let stockInEnd = ''
          if (params.hasOwnProperty('formTime') && params.formTime) {
            stockInStart = params.formTime[0]
            stockInEnd = params.formTime[1]
          }
          this.searchFormDatas = {
            ...params,
            stockInStart,
            stockInEnd
          }
          this.getStockInFormList({
            ...params,
            stockInStart,
            stockInEnd
          })
        },
        submitText: '查询',
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }]

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
        prop: 'formNo',
        label: '入库单号',
        align: 'left',
        minWidth: 130,
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
            return (
              `<span style = 'color:#0986FF;cursor: pointer;'>${formNo}</span> `
            )
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
        prop: 'deliveryNo',
        label: '关联单号',
        align: 'left',
        minWidth: 130
      },
      {
        prop: 'stockType',
        label: '入库类型',
        align: 'left',
        minWidth: 100,
        formater: (scope) => {
          const stockType = scope.row.stockType.toString()
          if (stockType === '1') {
            return '采购入库'
          } else if (stockType === '2') {
            return '生产入库'
          } else if (stockType === '3') {
            return '调拨入库'
          } else if (stockType === '4') {
            return '退货入库'
          } else if (stockType === '5') {
            return '盘盈入库'
          } else if (stockType === '6') {
            return '其他入库'
          }
        }
      },
      {
        prop: 'productType',
        label: '货物类型',
        align: 'left',
        minWidth: 100,
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
        label: '预约入库数',
        align: 'right',
        minWidth: 100
      },
      {
        prop: 'numberInFact',
        label: '实际入库数',
        align: 'right',
        minWidth: 100
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'left',
        minWidth: 100,
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
        prop: 'weightInPlan',
        label: '预约入库重量（KG）',
        align: 'right',
        minWidth: 155
      },
      {
        prop: 'weightInFact',
        label: '实际入库重量（KG）',
        align: 'right',
        minWidth: 155
      },
      {
        prop: 'stockInPlan',
        label: '预约入库时间',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 155,
        formater: (scope) => {
          if (scope.row.stockInPlan) {
            return this.$utils.parseTime(scope.row.stockInPlan)
          }
        }
      },
      {
        prop: 'stockInFact',
        label: '实际入库时间',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 155,
        formater: (scope) => {
          if (scope.row.stockInFact) {
            return this.$utils.parseTime(scope.row.stockInFact)
          }
        }
      },
      {
        prop: 'shipper',
        label: '货主',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 150
      },
      {
        prop: 'warehouseName',
        label: '入库仓库',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 100
      },
      {
        prop: 'shelfStatus',
        label: '上架状态',
        align: 'left',
        minWidth: 100,
        formater: (scope) => {
          if (scope.row.shelfStatus === 0) {
            return '<span style="color:#FF9B02">待上架</span>'
          } else if (scope.row.shelfStatus === 1) {
            return '<span style="color:#00BCC5">已上架</span>'
          }
        }
      }
    ]

    /* 操作 */
    let popOperatesDataSource = [
      {
        label: '详情',
        isShow: true,
        permitTag: ['wms:stockIn:form:info'],
        handle: (params) => {
          this.$router.push({
            path: '/wms/enter-manage/incoming-manage/details',
            query: { formNo: params.row.formNo, type: 'details' }
          })
        }
      }
    ]

    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      fixed: 'right',
      align: 'left',
      width: 50,
      dataSource: popOperatesDataSource
    }
    /* 分页 */
    const pagination = {
      currentChange: (val) => {
        this.getStockInFormList({
          ...this.searchFormDatas,
          pageSize: this.pagination.pageSize,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        this.getStockInFormList({
          ...this.searchFormDatas,
          pageNum: this.pagination.currentPage,
          pageSize: val
        })
      }
    }

    /* 列表 */
    return ({
      active: 'all',
      searchFormDatas: {},
      searchData,
      columns,
      formOtions: {
        layout: true,
        inline: true,
        size: 'small'
      },
      dataSource: [],
      pagination,
      popOperates
    })
  },
  created() {
    this.getStockInFormList()
    this.getLocationWarehouseList({
      enable: 1,
      name: ''
    }).then(list => {
      if (list.length > 0) {
        this.$set(this.searchData[4], 'dataSource', list)
      }
    })
  }
}
</script>
<style lang="scss" scoped>
</style>
