
<template>
  <div class="LibraryStatistics srm-main">
    <div class="search islayoutForm">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
        :form-datas="searchFormDatas"
      />
    </div>
    <div class="button clearfix">
      <el-button
        v-permission="['wms:report:stockIn:export']"
        size="small"
        type="primary"
        @click="exportSupplier"
      >导出</el-button>
    </div>
    <div class="srm-content">
      <!-- 列表 -->
      <!-- v-permission="['srm:supplier:list']" -->
      <div class="page-table">
        <cs-custom-table
          tooltip-effect="dark"
          :table-scrollx="true"
          :columns="columns"
          :data-source="list"
          :operates="popOperates"
          :pagination="pagination"
        />
        <summationRow :config="sumConfig" />
      </div>
    </div>
    <CsCustomPop ref="detail" :options="popOptions" class="detail" />
  </div>
</template>

<script>
import { LibraryStatistics } from './components/index.js'
import summationRow from '@/views/wms/public/components/summationRow.vue'
import {
  BOOKING_STORAGE_TYPE_LIST,
  BOOKING_TYPE_OF_GOODS
} from '@/views/wms/public/constants'
import { fetchLog } from '@/views/wms/public/fetchLog.js'
export default {
  name: 'LibraryStatistics',
  components: { summationRow },
  mixins: [LibraryStatistics, fetchLog],
  data() {
    const itemStyle = { width: '33%' }
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
        prop: 'stockType',
        itemType: 'select',
        label: '入库类型',
        dataSource: BOOKING_STORAGE_TYPE_LIST,
        clearable: true,
        itemStyle
      },
      {
        itemType: 'date',
        type: 'daterange',
        prop: 'time',
        label: '入库时间:',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59'],
        placeholder: '请选择入库时间',
        itemStyle
      },
      {
        prop: 'warehouseCode',
        itemType: 'select',
        label: '入库仓库',
        dataSource: [],
        clearable: true,
        itemStyle
      },
      {
        itemType: 'operate',
        submitHandle: (params) => {
          let stockInStart = ''
          let stockInEnd = ''
          if (params.hasOwnProperty('time') && params.time) {
            stockInStart = params.time[0] || ''
            stockInEnd = params.time[1] || ''
          }
          this.searchFormDatas = { ...params, stockInStart, stockInEnd }
          this.getList(this.searchFormDatas)
        },
        submitText: '搜索',
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    ]
    const columns = [
      {
        prop: '',
        label: '序号',
        width: 60,
        formater: (row) => {
          return (
            (this.pagination.currentPage - 1) * this.pagination.pageSize +
            (row.$index + 1)
          )
        }
      },
      {
        prop: 'formNo',
        label: '入库单号',
        minWidth: 160,
        showOverflowTooltip: true
      },
      {
        prop: 'deliveryNo',
        label: '关联单号',
        minWidth: 160,
        showOverflowTooltip: true
      },
      {
        prop: 'stockType',
        label: '入库类型',
        width: 120,
        formater: (scope) => {
          const index = BOOKING_STORAGE_TYPE_LIST.findIndex(
            (n) => n.value === scope.row[scope.column.property]
          )
          return index !== -1 ? BOOKING_STORAGE_TYPE_LIST[index].label : ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'productType',
        label: '货物类型',
        width: 80,
        align: 'center',
        showOverflowTooltip: true,
        formater: (scope) => {
          const index = BOOKING_TYPE_OF_GOODS.findIndex(
            (n) => n.value === scope.row[scope.column.property]
          )
          return index !== -1 ? BOOKING_TYPE_OF_GOODS[index].label : ''
        }
      },
      {
        prop: 'numberInFact',
        label: '入库数',
        width: 80,
        align: 'right',
        showOverflowTooltip: true
      },
      {
        prop: 'weightInFact',
        label: '入库重量(KG)',
        width: 140,
        align: 'right',
        showOverflowTooltip: true
      },
      {
        prop: 'custom-unit',
        label: '包装单位',
        maxWidth: 120,
        align: 'center',
        showOverflowTooltip: true,
        formater: (scope) => {
          // 布-卷，纱-件
          if (scope.row.productType === 1) {
            return '卷'
          } else if (scope.row.productType === 2) {
            return '件'
          }
        }
      },
      {
        prop: 'stockInFact',
        label: '入库时间',
        width: 180,
        formater: (scope) => {
          if (scope.row.stockInFact) {
            return this.$utils.parseTime(scope.row.stockInFact)
          }
        }
      },
      {
        prop: 'shipper',
        label: '货主',
        width: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'warehouseName',
        label: '入库仓库',
        width: 140,
        showOverflowTooltip: true
      }
    ]
    const pagination = {
      currentChange: (val) => {
        this.getList({
          ...this.searchFormDatas,
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        this.getList({
          ...this.searchFormDatas,
          pageNum: this.pagination.pageNum || 1,
          pageSize: val
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
          isShow: this.$permission(['wms:report:stockIn:detail']),
          handle: (params) => {
            const row = params.row
            this.otherRes = {
              warehouseName: row.warehouseName,
              deliveryNo: row.deliveryNo
            }
            const productType = row.productType
            const arr = this['detailColumns_' + productType]
            const result = [...this.detailColumns_base, ...arr]
            this.popOptions.content[0].columns = result
            this.getDetail({
              formNo: params.row.formNo,
              pageNum: 1,
              pageSize: 9999999
            })
          }
        }
      ]
    }
    const detailColumns_base = [
      {
        prop: 'warehouseName',
        label: '入库仓库',
        width: 160
      },
      {
        prop: 'formNo',
        label: '入库单号',
        width: 160
      },
      {
        prop: 'deliveryNo',
        label: '关联单号',
        width: 160
      },
      {
        prop: 'stockInFact',
        label: '入库时间',
        width: 160,
        formater: (scope) => {
          if (scope.row.stockInFact) {
            return this.$utils.parseTime(scope.row.stockInFact)
          }
        }
      },
      {
        prop: 'locationName',
        label: '上架库位',
        width: 160
      },
      {
        prop: 'batchNo',
        label: '批次号',
        width: 120
      },
      {
        prop: 'serialNo',
        label: '条码号',
        width: 160
      },
      {
        prop: 'materiel',
        label: '产品编号',
        width: 180
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        width: 160
      },
      {
        prop: 'yarnName',
        label: '纱名',
        showOverflowTooltip: true,
        width: 150
      },
      {
        prop: 'yarnProperty',
        label: '纱属性',
        showOverflowTooltip: true,
        width: 150
      }
    ]
    const detailColumns_1 = [
      {
        prop: 'productInfo',
        label: '产品信息',
        showOverflowTooltip: true,
        width: 150
      },
      {
        prop: 'machineNo',
        label: '机台号',
        width: 100
      },
      {
        prop: 'stitchNum',
        label: '针数',
        width: 100
      },
      {
        prop: 'inchNum',
        label: '寸数',
        width: 100
      },
      {
        prop: 'dyelot',
        label: '缸号',
        width: 140
      },
      // {
      //   prop: 'color',
      //   label: '成品颜色',
      //   showOverflowTooltip: true
      // },
      // {
      //   prop: 'printing',
      //   label: '印花花号',
      //   align: 'center',
      //   showOverflowTooltip: true
      // },
      {
        prop: 'weightAvg',
        label: '重量(KG)',
        width: 140,
        align: 'right'
      },
      {
        prop: 'shipper',
        label: '货主',
        width: 140
      }
    ]
    const detailColumns_2 = [
      {
        prop: 'yarnCard',
        label: '纱牌/纱批',
        showOverflowTooltip: true,
        width: 100
      },
      {
        prop: 'dyelot',
        label: '缸号',
        showOverflowTooltip: true,
        width: 140,
        align: 'center'
      },
      {
        prop: 'ballCountAvg',
        label: '球数',
        align: 'right',
        width: 140,
        showOverflowTooltip: true
      },
      {
        prop: 'weightAvg',
        label: '重量(KG)',
        width: 140,
        align: 'right',
        showOverflowTooltip: true
      },
      {
        prop: 'shipper',
        label: '货主',
        showOverflowTooltip: true,
        align: 'center',
        minWidth: 120
      }
    ]
    return {
      searchFormDatas: {},
      otherRes: {},
      detailColumns_base,
      detailColumns_1,
      detailColumns_2,
      searchData,
      popOperates,
      columns,
      pagination,
      formOtions: {
        layout: true,
        inline: true,
        size: 'small'
      },
      list: [],
      popOptions: {
        itemType: 'dialog',
        visible: false,
        title: '入库记录',
        width: '1300px',
        tooltipEffect: 'dark',
        cancel: () => {
          this.popOptions.visible = false
        },
        okHidden: true,
        cancelText: '关闭',
        className: 'detail',
        content: [
          {
            itemType: 'table',
            columns: [],
            dataSource: [],
            maxHeight: '360',
            tooltipEffect: 'dark',
            showOverflowTooltip: true
          }
        ]
      },
      sumConfig: [
        {
          title: '共',
          num: 0,
          unit: '单',
          style: 'margin-bottom:5px',
          br: true
        },
        {
          subTitle: '纱',
          unit: '/',
          subStyle: { diplay: 'inline-block', 'margin-right': '2px' },
          style: 'margin-right:0'
        },
        {
          title: '件数：',
          num: 0,
          unit: '件',
          style: 'margin-right:10px'
        },
        {
          title: '重量：',
          num: 0,
          unit: 'KG'
        },
        {
          subTitle: '布',
          unit: '/',
          subStyle: { diplay: 'inline-block', 'margin-right': '2px' },
          style: 'margin-right:0'
        },
        {
          title: '卷数：',
          num: 0,
          unit: '卷',
          style: 'margin-right:10px'
        },
        {
          title: '重量：',
          num: 0,
          unit: 'KG',
          style: 'margin-right:10px'
        }
      ]
    }
  },
  methods: {
    exportSupplier() {
      this.getExportFile(this.searchFormDatas)
    }
  }
}
</script>

<style lang="scss" >
.LibraryStatistics {
  .el-pagination.pagination {
    float: right;
  }
  .detail .el-dialog__body {
    padding: 15px 20px;
  }
  .detail .el-table th {
    background-color: #f5f7fa;
    padding: 0;
    .cell {
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>
