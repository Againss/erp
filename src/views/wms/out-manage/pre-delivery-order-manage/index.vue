<template>
  <div class="PreDeliveryOrderManage srm-main">
    <div class="search islayoutForm">
      <cs-custom-form
        ref="searchForm"
        :form-datas="searchFormDatas"
        :data-source="searchData"
        :options="formOtions"
      />
    </div>
    <div class="button">
      <el-button
        v-permission="['wms:stockOut:reservation:confirm']"
        size="small"
        type="primary"
        @click="confirm"
      >确认出库</el-button>
    </div>
    <div class="page-table">
      <cs-custom-table
        :columns="columns"
        :table-scrollx="true"
        tooltip-effect="dark"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        :data-total="dataSource.length"
        edit-type="pop"
        :options="options"
        :highlight-current-row="true"
        :row-class-name="'heightRow'"
        @row-click="rowClick"
      />
    </div>
  </div>
</template>

<script>
import { preDeliveryOrder } from './components/index.js'
import { PRODUCT_TYPE, STOCK_TYPE } from '@/views/wms/public/constants.js'
import { PublicWms } from '@/views/wms/public/index'
import { fetchLog } from '@/views/wms/public/fetchLog.js'
import { deepClone } from '@/utils/index.js'
export default {
  name: 'PreDeliveryOrderManage',
  mixins: [preDeliveryOrder, PublicWms, fetchLog],
  data() {
    const itemStyle = { width: '33%' }
    const searchData = [
      {
        prop: 'billNo',
        itemType: 'input',
        label: '单号',
        itemStyle,
        placeholder: '请输入单号',
        clearable: true
      },
      {
        itemType: 'date',
        type: 'daterange',
        prop: 'time',
        label: '预计出库时间',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59'],
        itemStyle
      },
      {
        prop: 'productType',
        itemType: 'select',
        label: '货物类型',
        itemStyle,
        placeholder: '请选择',
        dataSource: PRODUCT_TYPE,
        clearable: true
      },
      {
        prop: 'shipperId',
        itemType: 'select',
        label: '货主',
        itemStyle,
        placeholder: '请选择',
        dataSource: [],
        clearable: true
      },
      {
        prop: 'warehouseCode',
        itemType: 'select',
        label: '出库仓库',
        itemStyle,
        placeholder: '请选择',
        dataSource: [],
        clearable: true
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          var el = deepClone(params)
          let sentOutPlanStart = ''
          let sentOutPlanEnd = ''
          if (el.hasOwnProperty('time') && el.time) {
            sentOutPlanStart = el.time[0]
            sentOutPlanEnd = el.time[1]
          }
          el.productType = el.productType ? el.productType : undefined
          this.confirmStatus = undefined
          this.searchParams = {
            ...el,
            sentOutPlanStart,
            sentOutPlanEnd
          }
          this.getPageList({
            ...el,
            sentOutPlanStart,
            sentOutPlanEnd
          })
        },
        resetHandle: () => {
          this.searchParams = {}
          this.searchFormDatas = {}
          this.confirmStatus = undefined
          this.getPageList()
        }
      }
    ]
    const columns = [
      {
        prop: 'outReservationNo',
        label: '预出库单号',
        width: 120,
        showOverflowTooltip: true,
        handle: (scope) => {
          this.$router.push({
            path:
              '/wms/out-manage/pre-delivery-order-manage/detail/' +
              scope.row.outReservationNo,
            query: { productType: scope.row.productType }
          })
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'outRelationNo',
        label: '关联单号',
        width: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'stockType',
        label: '出库类型',
        width: 100,
        showOverflowTooltip: true,
        formater: (scope) => {
          const index = STOCK_TYPE.findIndex(
            (n) => n.value === scope.row[scope.column.property]
          )
          return index !== -1 ? STOCK_TYPE[index].label : ''
        }
      },
      {
        prop: 'productType',
        label: '货物类型',
        width: 100,
        showOverflowTooltip: true,
        align: 'left',
        formater: (scope) => {
          const index = PRODUCT_TYPE.findIndex(
            (n) => n.value === scope.row[scope.column.property]
          )
          return index !== -1 ? PRODUCT_TYPE[index].label : ''
        }
      },
      {
        prop: 'stockOutPlan',
        label: '出库数',
        maxWidth: 100,
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.moneyFormat(scope.row[scope.column.property] + '')
        }
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        maxWidth: 100,
        showOverflowTooltip: true,
        align: 'center'
      },
      {
        prop: 'weightOutPlan',
        label: '出库重量(KG)',
        width: 120,
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.moneyFormat(scope.row[scope.column.property] + '')
        }
      },
      {
        prop: 'sentOutPlan',
        label: '预计出库时间',
        width: 160,
        align: 'left',
        showOverflowTooltip: true,
        formater: (scope) => {
          if (scope.row.sentOutPlan) {
            return this.$utils.parseTime(scope.row.sentOutPlan)
          }
        }
      },
      {
        prop: 'warehouseName',
        label: '出库仓库',
        width: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'shipperName',
        label: '货主',
        width: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'senderParty',
        label: '发货方',
        width: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'consigneeParty',
        label: '收货方',
        width: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'status',
        label: '拣货状态',
        width: 120,
        showOverflowTooltip: true,
        // 1:待拣货,2:已拣货
        formater: (scope) => {
          return scope.row[scope.column.property] === 1
            ? '<span style="color:#FF9B02">待拣货</span>'
            : scope.row[scope.column.property] === 2
              ? '<span style="color:#00BCC5">已拣货</span>'
              : ''
        }
      }
    ]
    const popOperates = {
      label: '操作',
      width: '80',
      fixed: 'right',
      dataSource: [
        {
          label: '详情',
          isShow: this.$permission(['wms:stockOut:reservation:info']),
          handle: (params) => {
            this.$router.push({
              path:
                '/wms/out-manage/pre-delivery-order-manage/detail/' +
                params.row.outReservationNo,
              query: { productType: params.row.productType }
            })
          }
        }
      ]
    }
    const pagination = {
      currentChange: (val) => {
        this.confirmStatus = undefined
        this.pagination.pageNum = val
        this.getPageList({
          ...this.searchParams,
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.confirmStatus = undefined
        this.getPageList({
          ...this.searchParams,
          pageNum: 1,
          pageSize: val,
          currentPage: 1
        })
      }
    }
    const options = {}
    return {
      searchData,
      columns,
      pagination,
      popOperates,
      formOtions: {
        size: 'small',
        layout: true,
        inline: true
      },
      dataSource: [],
      searchFormDatas: {},
      options,
      confirmId: '',
      confirmStatus: undefined,
      searchParams: {}
    }
  },
  created() {
    this.getPageList()
    const fn = (res) => {
      const index = this.searchData.findIndex(
        (i) => i.prop === 'warehouseCode'
      )
      if (index !== -1) {
        if (res && res.length) {
          res.unshift({ label: '全部', value: '' })
        }
        this.searchData[index].dataSource = res
      }
    }
    this.getWarehouseList(fn)
    this.getShipperList()
  },
  methods: {
    rowClick(row, column, event) {
      this.confirmId = row.outReservationNo
      this.confirmStatus = row.status
    }
  }
}
</script>

<style lang="scss" >
.PreDeliveryOrderManage {
  .table .el-table .el-table__row.current-row.heightRow {
    > td {
      color: #666;
      background-color: #d8eafd !important;
    }
  }
}
</style>
