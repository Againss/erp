<template>
  <div class="page-main incomingDetail">
    <!-- 入库信息 -->
    <div class="form-main">
      <form-title :options="{ title: '入库信息' }" />
      <div class="form-box">
        <cs-custom-form
          ref="incomingInfo"
          :form-datas="incomingInfoFormDatas"
          :data-source="incomingInfoData"
          :options="formOtions"
        />
      </div>
    </div>
    <!-- 送货信息 -->
    <div class="form-main">
      <form-title :options="{ title: '送货信息' }" />
      <div class="form-box">
        <cs-custom-form
          ref="deliverInformation"
          :form-datas="deliverInfoFormDatas"
          :data-source="deliverInfoDataSource"
          :options="formOtions"
        />
      </div>
    </div>
    <!-- 货物明细明细列表 -->
    <div class="form-main">
      <form-title :options="{ title: '货物明细' }" />
      <div class="form-box spe detail">
        <!-- 货物明细布列表 -->
        <cs-custom-table
          v-if="incomingInfoFormDatas.productType === 1"
          tooltip-effect="dark"
          :columns="clothColumns"
          :operates="popOperates"
          :autoresize="false"
          :data-source="clothDetailDataSource"
          :pagination="pagination"
          highlight-current-indexrow
          :form-otions="formOtions"
        />
        <!-- 货物明细纱列表 -->
        <cs-custom-table
          v-if="incomingInfoFormDatas.productType === 2"
          tooltip-effect="dark"
          :columns="gauzeColumns"
          :operates="popOperates"
          :autoresize="false"
          :data-source="gauzeDetailDataSource"
          :pagination="pagination"
          highlight-current-indexrow
          :form-otions="formOtions"
        />
      </div>
    </div>

    <!-- 备注说明 -->
    <div class="form-main m-b60">
      <div class="form-box">
        <cs-custom-form
          ref="remarkForm"
          class="clearfix"
          :form-datas="remarkFormDatas"
          :data-source="remarkDataSource"
          :options="remarkFormOtions"
        />
      </div>
    </div>
    <!-- 按钮 -->
    <bottomBar :options="barOptions" />

    <!-- 弹出框明細列表 -->
    <el-dialog
      title="入库明细"
      :visible.sync="dialogDetailsPopUpBoxList"
      width="1500px"
    >
      <div class="form-box spe detail" style="padding:0 20px">
        <!-- 入库明细列表（布） -->
        <cs-custom-table
          v-if="incomingInfoFormDatas.productType === 1"
          tooltip-effect="dark"
          :columns="dialogClothDetailsColumns"
          :autoresize="false"
          max-height="500"
          :static-page="true"
          :data-source="dialogDetailsDataSource"
          highlight-current-indexrow
          :form-otions="formOtions"
        />
        <!-- 入库明细列表（纱） -->
        <cs-custom-table
          v-if="incomingInfoFormDatas.productType === 2"
          tooltip-effect="dark"
          :columns="dialogGauzeDetailsColumns"
          :autoresize="false"
          :static-page="true"
          max-height="500"
          :data-source="dialogDetailsDataSource"
          highlight-current-indexrow
          :form-otions="formOtions"
        />
      </div>
      <div class="btn-box">
        <el-button
          type="primary"
          @click="dialogDetailsPopUpBoxList = false"
        >关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { PublicWms } from '@/views/wms/public/index'
import { IncomingManage } from './components/index'
import FormTitle from '@/views/wms/public/components/formTitle'
import {
  BOOKING_STORAGE_TYPE_LIST,
  BOOKING_TYPE_OF_GOODS
} from '@/views/wms/public/constants'
import popoverColumn from '@/components/cs-custom-table/columns/popover-column'
import propertyCard from '@/components/property-card/index.vue'
import bottomBar from '@/views/wms/public/components/bottomBar.vue'
export default {
  components: {
    FormTitle,
    bottomBar
  },
  mixins: [PublicWms, IncomingManage],
  data() {
    const itemStyle = this.formItemStyle()

    /* 入库信息 */
    const incomingInfoData = [
      {
        prop: 'reservationNo',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '预约单号'
      },
      {
        prop: 'deliveryNo',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '关联单号'
      },
      {
        prop: 'stockType',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'select',
        label: '入库类型',
        dataSource: BOOKING_STORAGE_TYPE_LIST
      },
      {
        prop: 'productType',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'select',
        label: '货物类型',
        dataSource: BOOKING_TYPE_OF_GOODS
      },
      {
        prop: 'numberInPlan',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '预约入库件数'
      },
      {
        prop: 'numberInFact',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '实际入库件数'
      },
      {
        prop: 'weightInPlan',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '预约入库重量（KG）'
      },
      {
        prop: 'weightInFact',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '实际入库重量（KG）'
      },
      {
        prop: 'stockInPlan',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '预约入库时间'
      },
      {
        prop: 'stockInFact',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '实际入库时间'
      },
      {
        prop: 'warehouseName',
        itemStyle: itemStyle,
        disabled: true,
        itemType: 'input',
        label: '预约入库仓库'
      }
    ]

    /* 货物明细列表（布类） */
    const clothColumns = [
      {
        prop: 'batchNo',
        label: '批次号',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 150
      },
      {
        prop: 'materiel',
        label: '产品编号',
        align: 'left',
        components: {
          popoverColumn
        },
        componentsOptions: {
          customOptions: {
            placement: 'right',
            style: {
              color: '#0986FF',
              cursor: 'pointer',
              marginTop: '5px'
            },
            width: '500',
            content: propertyCard,
            trigger: 'click',
            mouseleave: true,
            show: (scope) => {
              return scope.row['materiel']
            }
          }
        },
        minWidth: 180
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 140
      },
      {
        prop: 'materielType',
        label: '物料类型',
        showOverflowTooltip: true,
        width: 120,
        formater: scope => {
          return this.getStatus(scope.row.materielType)
        }
      },
      {
        prop: 'yarnName',
        label: '纱名',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'yarnProperty',
        label: '纱属性',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'productInfo',
        label: '产品信息',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'machineNo',
        label: '机台号',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'stitchNum',
        label: '针数',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'inchNum',
        label: '寸数',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'dyelot',
        label: '缸号',
        align: 'left',
        minWidth: 120
      },
      {
        prop: 'numberInPlan',
        label: '预计入库数',
        align: 'right',
        minWidth: 120
      },
      {
        prop: 'numberInFact',
        label: '实际入库数',
        align: 'right',
        minWidth: 120
      },
      {
        prop: 'weightInPlan',
        label: '预计入库重量(KG)',
        align: 'right',
        minWidth: 160
      },
      {
        prop: 'weightInFact',
        label: '实际入库重量(KG)',
        align: 'right',
        minWidth: 160
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'left',
        minWidth: 120
      }
    ]

    /* 分页 */
    const pagination = {
      currentChange: (val) => {
        this.getStockInFormProductList({
          pageSize: this.pagination.pageSize,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getStockInFormProductList({
          pageNum: this.pagination.currentPage,
          pageSize: val
        })
      }
    }

    /* 操作 */
    const popOperates = {
      label: '操作',
      fixed: 'right',
      align: 'left',
      width: 50,
      dataSource: [
        {
          label: '明细',
          isShow: (scope) => {
            if (this.incomingInfoFormDatas.status === 1) {
              return true
            }
            return false
          },
          /*    permitTag: [''], */
          handle: (params) => {
            const row = params.row
            if (row) {
              this.getProductDetailList({
                formNo: row.formNo,
                status: '',
                formProductId: row.id
              })
            }
          }
        }
      ]
    }

    /* 货物明细列表（纱类） */
    const gauzeColumns = [
      {
        prop: 'batchNo',
        label: '批次号',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 150
      },
      {
        prop: 'materiel',
        label: '产品编号',
        align: 'left',
        components: {
          popoverColumn
        },
        componentsOptions: {
          customOptions: {
            placement: 'right',
            style: {
              color: '#0986FF',
              cursor: 'pointer',
              marginTop: '5px'
            },
            width: '500',
            content: propertyCard,
            trigger: 'click',
            mouseleave: true,
            show: (scope) => {
              return scope.row['materiel']
            }
          }
        },
        minWidth: 180
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 140
      },
      {
        prop: 'materielType',
        label: '物料类型',
        showOverflowTooltip: true,
        width: 120,
        formater: scope => {
          return this.getStatus(scope.row.materielType)
        }
      },
      {
        prop: 'yarnName',
        label: '纱名',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'yarnProperty',
        label: '纱属性',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'yarnCard',
        label: '纱牌/批号',
        align: 'left',
        minWidth: 120
      },
      {
        prop: 'dyelot',
        label: '缸号',
        align: 'left',
        minWidth: 120
      },
      {
        prop: 'numberInPlan',
        label: '预计入库数',
        align: 'right',
        minWidth: 120
      },
      {
        prop: 'weightInPlan',
        label: '实际入库重量(KG)',
        align: 'right',
        minWidth: 160
      },
      {
        prop: 'numberInFact',
        label: '实际入库数',
        align: 'right',
        minWidth: 120
      },
      {
        prop: 'weightInFact',
        label: '实际入库重量(KG)',
        align: 'right',
        minWidth: 160
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'left',
        minWidth: 120
      }
    ]

    /* 送货信息 */
    const deliverInfoDataSource = [
      {
        prop: 'shipperModel',
        disabled: true,
        itemStyle: itemStyle,
        itemType: 'input',
        label: '货主'
      },
      {
        prop: 'fabricStore',
        disabled: true,
        itemStyle: itemStyle,
        itemType: 'input',
        label: '布行'
      },
      {
        prop: 'deliveryman',
        disabled: true,
        itemStyle: itemStyle,
        itemType: 'input',
        label: '司机姓名'
      },
      {
        prop: 'deliverymanPhone',
        disabled: true,
        itemStyle: itemStyle,
        itemType: 'input',
        label: '联系电话'
      },
      {
        prop: 'supplierModel',
        disabled: true,
        itemStyle: itemStyle,
        itemType: 'input',
        label: '供应商'
      },
      {
        prop: 'licenseNumber',
        disabled: true,
        itemStyle: itemStyle,
        itemType: 'input',
        label: '车牌号'
      }
    ]

    /* 备注说明 */
    const remarkDataSource = [
      {
        prop: 'remark',
        type: 'textarea',
        disabled: true,
        rows: 8,
        height: '120px',
        itemStyle: {
          width: '100%'
        },
        itemType: 'input',
        label: '备注说明'
      }
    ]

    /* 明细列表（布） */
    const dialogClothDetailsColumns = [
      {
        prop: 'formNo',
        label: '入库单号',
        align: 'left',
        minWidth: 130
      },
      {
        prop: 'stockInFact',
        label: '入库时间',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 140,
        formater: (scope) => {
          const stockInFact = scope.row.stockInFact
          if (stockInFact) {
            return this.$utils.parseTime(stockInFact)
          }
        }
      },
      {
        prop: 'locationCode',
        label: '库位号',
        align: 'left',
        minWidth: 120
      },
      {
        prop: 'batchNo',
        label: '批次号',
        align: 'left',
        minWidth: 120
      },
      {
        prop: 'serialNo',
        label: '条码号',
        align: 'left',
        minWidth: 140
      },
      {
        prop: 'materiel',
        label: '产品编号',
        align: 'left',
        minWidth: 180
      },
      {
        prop: 'materielType',
        label: '物料类型',
        showOverflowTooltip: true,
        width: 120,
        formater: scope => {
          return this.getStatus(scope.row.materielType)
        }
      },
      {
        prop: 'yarnName',
        label: '纱名',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'yarnProperty',
        label: '纱属性',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'productInfo',
        label: '产品信息',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'machineNo',
        label: '机台号',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'stitchNum',
        label: '针数',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'inchNum',
        label: '寸数',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'dyelot',
        label: '缸号',
        align: 'left',
        minWidth: 120
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        align: 'left',
        minWidth: 140
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
          }
        }
      },
      {
        prop: 'weightAvg',
        label: '实际入库重量(KG)',
        align: 'right',
        minWidth: 160
      }
    ]

    /* 明细列表（纱） */
    const dialogGauzeDetailsColumns = [
      {
        prop: 'formNo',
        label: '入库单号',
        align: 'left',
        minWidth: 140
      },
      {
        prop: 'stockInFact',
        label: '入库时间',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 160,
        formater: (scope) => {
          const stockInFact = scope.row.stockInFact
          if (stockInFact) {
            return this.$utils.parseTime(stockInFact)
          }
        }
      },
      {
        prop: 'locationCode',
        label: '库位号',
        align: 'left',
        minWidth: 140
      },
      {
        prop: 'batchNo',
        label: '批次号',
        align: 'left',
        minWidth: 140
      },
      {
        prop: 'serialNo',
        label: '条码号',
        align: 'left',
        minWidth: 150
      },
      {
        prop: 'materiel',
        label: '产品编号',
        align: 'left',
        minWidth: 180
      },
      {
        prop: 'materielType',
        label: '物料类型',
        showOverflowTooltip: true,
        width: 120,
        formater: scope => {
          return this.getStatus(scope.row.materielType)
        }
      },
      {
        prop: 'yarnName',
        label: '纱名',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'yarnProperty',
        label: '纱属性',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'yarnCard',
        label: '纱牌/纱批',
        align: 'left',
        minWidth: 120
      },
      {
        prop: 'dyelot',
        label: '缸号',
        align: 'left',
        minWidth: 120
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        showOverflowTooltip: true,
        align: 'left',
        minWidth: 160
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
          }
        }
      },
      {
        prop: 'weightAvg',
        label: '实际入库重量(KG)',
        align: 'right',
        minWidth: 160
      },
      {
        prop: 'ballCountAvg',
        label: '球数',
        align: 'right',
        minWidth: 120
      }
    ]

    /* 明细列表分页 */
    const dialogDetailsPagination = {
      currentChange: (val) => {
        this.getProductDetailList({
          pageSize: this.dialogDetailsPagination.pageSize,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getProductDetailList({
          pageNum: this.dialogDetailsPagination.currentPage,
          pageSize: val
        })
      }
    }
    const barOptions = {
      submitHidden: true,
      cancelText: '返回',
      cancelSubmit: () => {
        this.$router.go(-1)
      }
    }

    return {
      formNo: '',
      formOtions: {
        inline: true,
        size: 'small'
      },
      /* 送货信息 */
      deliverInfoFormDatas: {},
      deliverInfoDataSource,
      /* 货物明细（布类）*/
      clothColumns,
      clothDetailDataSource: [],
      pagination,
      popOperates,
      /* 货物明细（纱类）*/
      gauzeColumns,
      gauzeDetailDataSource: [],
      /* 预约信息 */
      incomingInfoFormDatas: {},
      incomingInfoData,
      /* 备注说明*/
      remarkFormDatas: {},
      remarkDataSource,
      remarkFormOtions: {
        inline: false,
        size: 'small',
        labelPosition: 'top'
      },
      /* 明细列表 */
      dialogDetailsPopUpBoxList: false,
      dialogDetailsDataSource: [],
      dialogDetailsPagination,
      dialogGauzeDetailsColumns,
      dialogClothDetailsColumns,
      barOptions
    }
  },
  created() {
    this.formNo = this.$route.query['formNo']
    if (this.formNo) {
      /* 详情信息 */
      this.getStockInFormInfo({ formNo: this.formNo })
      /* 货物明细列表 */
      this.getStockInFormProductList({ formNo: this.formNo })
    }
  },
  methods: {
    // 货物类型
    getStatus(data) {
      let str = ''
      switch (data) {
        case '0101':
          str = '天然纤维'
          break
        case '0102':
          str = '化学纤维'
          break
        case '0103':
          str = '组合纱线'
          break
        case '0201':
          str = '坯布'
          break
        case '0202':
          str = '色布'
          break
        case '0203':
          str = '组合布'
          break
        case '0204':
          str = '花布'
          break
        default:
          break
      }
      return str
    }
  }
}
</script>

<style lang="scss">
.incomingDetail {
  .form-box.spe {
    padding-top: 0;
    .el-table th {
      background-color: #f5f7fa
    }
  }
  .el-dialog__body {
    padding: 10px 0;
  }
}
</style>

<style lang="scss" scoped>
.btn-box {
  text-align: center;
  padding: 20px 0 10px;
}
</style>
