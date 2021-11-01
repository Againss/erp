<template>
  <div class="PickingManage srm-main">
    <div class="search islayoutForm">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
        :form-datas="searchFormDatas"
      />
    </div>

    <!-- 表格 -->
    <div class="page-table">
      <div class="button spe">
        <el-button
          v-permission="['wms:stockOut:pick:confirm']"
          size="small"
          type="primary"
          @click="pickingConfirm"
        >拣货确认</el-button>
      </div>
      <div class="list-tab">
        <el-tabs v-model="active" @tab-click="handClick">
          <el-tab-pane v-for="(i, index) in tabs" :key="index" :name="i.value">
            <span slot="label" :name="i.value">
              {{ `${i.label} (${i.num})` }}</span></el-tab-pane>
        </el-tabs>
      </div>

      <cs-custom-table
        :columns="columns"
        :table-scrollx="true"
        tooltip-effect="dark"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        :data-total="dataSource.length"
        edit-type="pop"
        :highlight-current-row="true"
        :row-class-name="'heightRow'"
        @row-click="rowClick"
      />
    </div>
  </div>
</template>

<script>
import { picking } from './components/index.js'
import { PublicWms } from '@/views/wms/public/index'
import { PRODUCT_TYPE } from '@/views/wms/public/constants.js'
import { deepClone } from '@/utils/index.js'
export default {
  name: 'PickingManage',
  mixins: [picking, PublicWms],
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
        prop: 'shipperId',
        itemType: 'select',
        label: '货主',
        itemStyle,
        placeholder: '请选择',
        dataSource: [],
        clearable: true
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
        itemType: 'date',
        type: 'daterange',
        prop: 'time',
        label: '拣货完成时间',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59'],
        itemStyle
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          this.confirmStatus = undefined
          var el = deepClone(params)
          let pickCompleteTimeStart = ''
          let pickCompleteTimeEnd = ''
          if (el.hasOwnProperty('time') && el.time) {
            pickCompleteTimeStart = el.time[0]
            pickCompleteTimeEnd = el.time[1]
          }
          el.productType = el.productType ? el.productType : undefined
          this.searchParams = {
            ...el,
            pickCompleteTimeStart,
            pickCompleteTimeEnd
          }
          this.searchParams.status =
            this.active && this.active !== '0' ? this.active : ''
          this.active && this.active !== '0' ? (el.status = this.active) : ''
          this.getPageList({
            ...el,
            pickCompleteTimeStart,
            pickCompleteTimeEnd
          })
        },
        resetHandle: () => {
          this.searchParams = {
            status: this.active
          }
          this.searchFormDatas = {}
          this.confirmStatus = undefined
          this.getPageList({ status: this.active })
        }
      }
    ]
    const columns = [
      {
        prop: 'outPickNo',
        label: '拣货单号',
        showOverflowTooltip: true,
        width: 180,
        handle: (params) => {
          this.$router.push({
            path:
              '/wms/out-manage/picking-manage/detail/' +
              params.row.outPickSubNo,
            query: {
              status: params.row.status,
              productType: params.row.productType
            }
          })
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'outReservationNo',
        label: '预出库单号',
        width: '160',
        handle: (params) => {
          this.$router.push({
            path:
              '/wms/out-manage/pre-delivery-order-manage/detail/' +
              params.row.outReservationNo,
            query: { productType: params.row.productType }
          })
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'shipperName',
        label: '货主',
        width: '140'
      },
      {
        prop: 'productType',
        label: '货物类型',
        width: '120',
        formater: (scope) => {
          const index = PRODUCT_TYPE.findIndex(
            (n) => n.value === scope.row[scope.column.property]
          )
          return index !== -1 ? PRODUCT_TYPE[index].label : ''
        }
      },
      {
        prop: 'stockOutFact',
        label: '拣货数',
        width: '100',
        align: 'right'
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        width: '120',
        align: 'center'
      },
      {
        prop: 'pickCreateTime',
        label: '拣货生成时间',
        width: '200',
        formater: (scope) => {
          if (scope.row.pickCreateTime) {
            return this.$utils.parseTime(scope.row.pickCreateTime)
          }
        }
      },
      {
        prop: 'pickCompleteTime',
        label: '拣货完成时间',
        width: '200',
        formater: (scope) => {
          if (scope.row.pickCompleteTime) {
            return this.$utils.parseTime(scope.row.pickCompleteTime)
          }
        }
      },
      {
        prop: 'status',
        label: '状态',
        width: '120',
        isShow: () => {
          return this.active === '0'
        },
        formater: (scope) => {
          // 0:已出库,1:待拣货,2:已拣货
          // return OUT_STATUS[scope.row[scope.column.property]]
          return scope.row[scope.column.property] === 0
            ? '<span style="color:#888E9E">已出库</span>'
            : scope.row[scope.column.property] === 1
              ? '<span style="color:#FF9B02">待拣货</span>'
              : '<span style="color:#00BCC5">已拣货</span>'
        }
      },
      {
        prop: 'pickerName',
        label: '拣货员',
        minWidth: '120'
      }
    ]
    const popOperates = {
      label: '操作',
      width: '160',
      fixed: 'right',
      dataSource: [
        {
          label: '打印拣货单',
          isShow: (params) => {
            return (
              params.row.status === 1 &&
              this.$permission(['wms:stockOut:pick:printPickForm'])
            )
          },
          handle: (params) => {
            this.$router.push({
              path:
                '/wms/out-manage/picking-manage/print/' +
                params.row.outPickSubNo,
              query: {
                status: params.row.status,
                productType: params.row.productType
              }
            })
          }
        },
        {
          label: '详情',
          isShow: this.$permission(['wms:stockOut:pick:info']),
          handle: (params) => {
            this.$router.push({
              path:
                '/wms/out-manage/picking-manage/detail/' +
                params.row.outPickSubNo,
              query: {
                status: params.row.status,
                productType: params.row.productType
              }
            })
          }
        }
      ]
    }
    const pagination = {
      currentChange: (val) => {
        this.confirmStatus = undefined
        this.searchParams.status =
          this.active && this.active !== '0' ? this.active : ''
        this.getPageList({
          ...this.searchParams,
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.searchParams.status =
          this.active && this.active !== '0' ? this.active : ''
        this.confirmStatus = undefined
        this.getPageList({
          ...this.searchParams,
          pageNum: 1,
          currentPage: 1,
          pageSize: val
        })
      }
    }
    const tabs = [
      { value: '0', label: '全部', num: 0 },
      { value: '1', label: '待拣货', num: 0 },
      { value: '2', label: '已拣货', num: 0 }
    ]
    return {
      tabs,
      active: '0',
      searchFormDatas: {},
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
      confirmStatus: undefined,
      confirmProductType: undefined,
      searchParams: {}
    }
  },
  computed: {},
  created() {
    this.getPageList()
    this.getShipperList()
  },
  methods: {
    pickingConfirm() {
      if (this.confirmStatus === 1) {
        this.$router.push({
          path: '/wms/out-manage/picking-manage/confirm/' + this.confirmId,
          query: { productType: this.confirmProductType }
        })
      } else if (this.confirmStatus === undefined) {
        this.$confirm('请选择拣货单号', {
          type: 'warning',
          cancelButtonClass: 'btn-cancel',
          showCancelButton: false
        })
      } else {
        this.$confirm('已完成拣货，请勿重复拣货', {
          type: 'warning',
          cancelButtonClass: 'btn-cancel',
          showCancelButton: false
        })
      }
    },
    handClick() {
      this.searchParams.status =
        this.active && this.active !== '0' ? this.active : ''
      this.confirmStatus = undefined
      this.getPageList(this.searchParams)
    },
    rowClick(row, column, event) {
      this.confirmId = row.outPickSubNo
      this.confirmStatus = row.status
      this.confirmProductType = row.productType
    }
  }
}
</script>

<style lang="scss" >
.PickingManage {
  .table .el-table .el-table__row.current-row.heightRow {
    > td {
      color: #666;
      background-color: #d8eafd !important;
    }
  }
  .page-main .el-tabs__nav-wrap,
  .srm-main .el-tabs__nav-wrap {
    margin: 0;
    // border: 1px solid red;
  }
}
</style>
<style lang="scss" scoped>
.PickingManage {
  .button.spe {
    position: absolute;
    right: 20px;
    top: 14px;
    z-index: 3;
  }
  .list-tab {
    padding-bottom: 1px;
  }
  /deep/ .el-tabs__header {
    margin: 0;
    .el-tabs__item {
      font-weight: 400;
      height: 60px;
      line-height: 60px;
    }
  }
  /deep/ .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: #d0d6da;
  }
}
</style>
