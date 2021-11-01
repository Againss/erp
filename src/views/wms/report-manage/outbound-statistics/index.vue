
<template>
  <div class="outboundStatistics srm-main">
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
        v-permission="['wms:report:stockOut:export']"
        size="small"
        type="primary"
        @click="exportSupplier"
      >导出</el-button>
    </div>
    <div class="srm-content">
      <!-- 列表 -->
      <div class="page-table">
        <cs-custom-table
          tooltip-effect="dark"
          :table-scrollx="true"
          :columns="columns"
          :data-source="list"
          :pagination="pagination"
          :operates="popOperates"
        />
        <summationRow :config="sumConfig" />
      </div>
    </div>
    <CsCustomPop ref="detail" :options="popOptions" class="detail" />
  </div>
</template>

<script>
import { OutboundStatistics } from './components/index.js'
import { STOCK_TYPE, PRODUCT_TYPE } from '@/views/wms/public/constants.js'
import summationRow from '@/views/wms/public/components/summationRow.vue'
import { fetchLog } from '@/views/wms/public/fetchLog.js'
export default {
  name: 'OutboundStatistics',
  components: { summationRow },
  mixins: [OutboundStatistics, fetchLog],
  data() {
    const itemStyle = { width: '33%' }
    const searchData = [
      {
        prop: 'billNo',
        itemType: 'input',
        label: '单号',
        placeholder: '请输入单号',
        clearable: true,
        itemStyle
      },
      {
        prop: 'stockType',
        itemType: 'select',
        label: '出库类型',
        dataSource: STOCK_TYPE,
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
        placeholder: '请选择实际出库时间',
        itemStyle
      },
      {
        prop: 'warehouseCode',
        itemType: 'select',
        label: '出库仓库',
        dataSource: [],
        clearable: true,
        itemStyle
      },
      {
        itemType: 'operate',
        submitHandle: (params) => {
          let sentOutFactStart = ''
          let sentOutFactEnd = ''
          if (params.hasOwnProperty('time') && params.time) {
            sentOutFactStart = params.time[0]
            sentOutFactEnd = params.time[1]
          }
          this.searchFormDatas = {
            ...params,
            sentOutFactStart,
            sentOutFactEnd
          }
          this.getPageList({
            ...params,
            sentOutFactStart,
            sentOutFactEnd
          })
        },
        submitText: '搜索',
        resetHandle: () => {
          this.searchFormDatas = {}
          this.getPageList()
        }
      }
    ]
    const columns = [
      {
        prop: '',
        label: '序号',
        width: '60',
        formater: (row) => {
          return (
            (this.pagination.currentPage - 1) * this.pagination.pageSize +
            (row.$index + 1)
          )
        }
      },
      {
        prop: 'outNo',
        label: '出库单号',
        minWidth: 160,
        showOverflowTooltip: true
      },
      {
        prop: 'outRelationNo',
        label: '关联单号',
        minWidth: 160,
        showOverflowTooltip: true
      },
      {
        prop: 'stockType',
        label: '出库类型',
        width: 120,
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
        width: 80,
        align: 'center',
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
        width: 80,
        align: 'right',
        showOverflowTooltip: true
      },
      {
        prop: 'weightOutFact',
        label: '出库重量(KG)',
        width: 140,
        align: 'right',
        showOverflowTooltip: true
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        maxWidth: 120,
        align: 'center',
        showOverflowTooltip: true
      },
      {
        prop: 'sentOutFact',
        label: '出库时间',
        width: 180,
        showOverflowTooltip: true,
        formater: (scope) => {
          if (scope.row.sentOutFact) {
            return this.$utils.parseTime(scope.row.sentOutFact)
          }
        }
      },
      {
        prop: 'shipperName',
        label: '货主',
        width: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'warehouseName',
        label: '出库仓库',
        width: 140,
        showOverflowTooltip: true
      }
    ]
    const pagination = {
      currentChange: (val) => {
        this.getPageList({
          ...this.searchFormDatas,
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        this.getPageList({
          ...this.searchFormDatas,
          pageNum: this.pagination.pageNum || 1,
          pageSize: val
        })
      }
    }
    const detailColumns_base = [
      {
        prop: 'warehouseName',
        label: '出库仓库',
        width: 160
      },
      {
        prop: 'outNo',
        label: '出库单号',
        width: 160
      },
      {
        prop: 'outRelationNo',
        label: '关联单号',
        width: 160
      },
      {
        prop: 'sentOutFact',
        label: '出库时间',
        width: 160,
        formater: (scope) => {
          if (scope.row.sentOutFact) {
            return this.$utils.parseTime(scope.row.sentOutFact)
          }
        },
        showOverflowTooltip: true
      },
      {
        prop: 'locationName',
        label: '拣货库位',
        width: 160
      },
      {
        prop: 'batchNo',
        label: '批次号',
        showOverflowTooltip: true,
        width: 120
      },
      {
        prop: 'serialSubNo',
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
        width: 150
      },
      {
        prop: 'yarnProperty',
        label: '纱属性',
        width: 150
      }
    ]
    const detailColumns_1 = [
      {
        prop: 'productInfo',
        label: '产品信息',
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
      //   width: 140
      // },
      // {
      //   prop: 'printing',
      //   label: '印花花号',
      //   width: 140
      // },
      {
        prop: 'weightOutFact',
        label: '重量(KG)',
        align: 'right',
        width: 140,
        style: {
          'padding-right': '20px'
        }
      }
    ]
    const detailColumns_2 = [
      {
        prop: 'yarnCard',
        label: '纱牌/纱批',
        width: 140
      },
      // {
      //   prop: 'color',
      //   label: '染纱颜色',
      //   width: 140
      // },
      {
        prop: 'dyelot',
        label: '缸号',
        width: 140
      },
      {
        prop: 'ballCountFact',
        label: '球数',
        align: 'right',
        width: 140
      },
      {
        prop: 'weightOutFact',
        label: '重量(KG)',
        align: 'right',
        width: 140
      }
    ]
    return {
      otherRes: {},
      searchData,
      popOperates: {
        label: '操作',
        align: 'left',
        fixed: 'right',
        width: '80',
        dataSource: [
          {
            label: '详情',
            isShow: this.$permission(['wms:report:stockOut:detail']),
            handle: (params) => {
              const row = params.row
              this.otherRes = {
                warehouseName: row.warehouseName,
                outNo: row.outNo,
                outRelationNo: row.outRelationNo,
                sentOutFact: row.sentOutFact
              }
              const productType = row.productType
              const arr = this['detailColumns_' + productType]
              const result = [...this.detailColumns_base, ...arr]
              this.popOptions.content[0].columns = result
              this.getDetail({ outNo: params.row.outNo })
            }
          }
        ]
      },
      columns,
      pagination,
      formOtions: {
        layout: true,
        inline: true,
        size: 'small'
      },
      list: [],
      detailColumns_base,
      detailColumns_1,
      detailColumns_2,
      popOptions: {
        itemType: 'dialog',
        visible: false,
        title: '出库记录',
        width: '1300px',
        className: 'detail',
        cancel: () => {
          this.popOptions.visible = false
        },
        okHidden: true,
        cancelText: '关闭',
        content: [
          {
            itemType: 'table',
            columns: [],
            dataSource: [],
            maxHeight: '360',
            tooltipEffect: 'light'
          }
        ]
      },
      searchFormDatas: {},
      // 纱     件数  XX件     重量 布     卷数  XX卷     重量
      sumConfig: [
        {
          title: '共',
          num: 0,
          unit: '单 ',
          style: 'margin-bottom:5px;',
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
.outboundStatistics {
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
