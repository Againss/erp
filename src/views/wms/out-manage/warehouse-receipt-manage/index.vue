
<template>
  <div class="WarehouseReceiptManage srm-main">
    <div class="search islayoutForm">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :form-datas="searchFormDatas"
        :options="formOtions"
      />
    </div>
    <div class="srm-content">
      <!-- 列表 -->
      <div class="page-table">
        <cs-custom-table
          :show-overflow-tooltip="true"
          :table-scrollx="true"
          tooltip-effect="dark"
          :autoresize="false"
          :columns="columns"
          :data-source="dataSource"
          :pagination="pagination"
          :operates="popOperates"
          highlight-current-indexrow
        />
      </div>
    </div>
  </div>
</template>

<script>
import { warehouseReceipt } from './components/index.js'
import { PublicWms } from '@/views/wms/public/index'
import { PRODUCT_TYPE, STOCK_TYPE } from '@/views/wms/public/constants.js'
import { deepClone } from '@/utils/index.js'
export default {
  name: 'WarehouseReceiptManage',
  mixins: [warehouseReceipt, PublicWms],
  data() {
    const itemStyle = { width: '33%' }
    const searchData = [
      {
        prop: 'outNo',
        itemType: 'input',
        label: '出库单号',
        placeholder: '请输入出库单号',
        clearable: true,
        itemStyle
      },
      {
        itemType: 'date',
        type: 'daterange',
        prop: 'time',
        label: '实际出库时间',
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
        dataSource: PRODUCT_TYPE,
        placeholder: '请选择货物类型',
        clearable: true,
        itemStyle
      },
      {
        prop: 'shipperId',
        itemType: 'select',
        label: '货主',
        dataSource: [],
        placeholder: '请选择',
        clearable: true,
        itemStyle
      },
      {
        prop: 'warehouseCode',
        itemType: 'select',
        label: '出库仓库',
        dataSource: [],
        placeholder: '请选择',
        clearable: true,
        itemStyle
      },
      {
        itemType: 'operate',
        submitHandle: (params) => {
          const el = deepClone(params)
          let sentOutFactEnd = ''
          let sentOutFactStart = ''
          if (el.hasOwnProperty('time') && el.time) {
            sentOutFactStart = el.time[0]
            sentOutFactEnd = el.time[1]
          }
          el.productType = el.productType ? el.productType : undefined
          this.searchParams = {
            ...el,
            sentOutFactEnd,
            sentOutFactStart
          }
          this.getPageList({
            ...el,
            sentOutFactEnd,
            sentOutFactStart
          })
        },
        submitText: '查询',
        resetHandle: () => {
          this.searchParams = {}
          this.searchFormDatas = {}
          this.getPageList()
        }
      }
    ]
    const columns = [
      {
        prop: 'outNo',
        label: '出库单号',
        showOverflowTooltip: true,
        width: 160,
        handle: (scope) => {
          this.$router.push({
            path:
              '/wms/out-manage/warehouse-receipt-manage/detail/' +
              scope.row.outNo,
            query: { productType: scope.row.productType }
          })
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'stockType',
        label: '出库类型',
        maxWidth: '100',
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
        maxWidth: '100',
        align: 'left',
        showOverflowTooltip: true,
        formater: (scope) => {
          const index = PRODUCT_TYPE.findIndex(
            (n) => n.value === scope.row[scope.column.property]
          )
          return index !== -1 ? PRODUCT_TYPE[index].label : ''
        }
      },
      {
        prop: 'stockOutFact',
        label: '出库数',
        align: 'right',
        maxWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'center',
        width: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'weightOutFact',
        label: '出库重量(KG)',
        align: 'right',
        width: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'sentOutPlan',
        label: '预计出库时间',
        width: '200',
        showOverflowTooltip: true,
        formater: (scope) => {
          if (scope.row.sentOutPlan) {
            return this.$utils.parseTime(scope.row.sentOutPlan)
          }
        }
      },
      {
        prop: 'sentOutFact',
        label: '实际出库时间',
        width: '200',
        showOverflowTooltip: true,
        formater: (scope) => {
          if (scope.row.sentOutFact) {
            return this.$utils.parseTime(scope.row.sentOutFact)
          }
        }
      },
      {
        prop: 'warehouseName',
        label: '出库仓库',
        showOverflowTooltip: true
      },
      {
        prop: 'senderParty',
        label: '发货方',
        showOverflowTooltip: true
      },
      {
        prop: 'consigneeParty',
        label: '收货方',
        showOverflowTooltip: true
      }
    ]
    const pagination = {
      currentChange: (val) => {
        this.pagination.pageNum = val
        this.getPageList({
          ...this.searchParams,
          pageSize: this.pagination.pageSize || 20,
          pageNum: this.pagination.pageNum
        })
      },
      sizeChange: (val) => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.getPageList({
          ...this.searchParams,
          pageNum: this.pagination.pageNum,
          pageSize: this.pagination.pageSize,
          currentPage: 1
        })
      }
    }
    const popOperates = {
      label: '操作',
      align: 'left',
      fixed: 'right',
      width: '80',
      dataSource: [
        {
          label: '详情',
          isShow: this.$permission(['wms:stockOut:form:info']),
          handle: (params) => {
            this.$router.push({
              path:
                '/wms/out-manage/warehouse-receipt-manage/detail/' +
                params.row.outNo,
              query: { productType: params.row.productType }
            })
          }
        }
      ]
    }
    return {
      searchParams: {},
      searchFormDatas: {},
      searchData,
      popOperates,
      columns,
      pagination,
      formOtions: {
        layout: true,
        inline: true,
        size: 'small'
      },
      dataSource: []
    }
  },
  created() {
    this.getPageList()
    this.getShipperList()
    this.getWarehouseList()
  }
}
</script>
