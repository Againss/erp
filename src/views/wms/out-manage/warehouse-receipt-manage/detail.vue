<template>
  <div class="WarehouseReceiptManage page-main">
    <div class="form-main">
      <form-title :options="{ title: '基础信息' }" />
      <div class="form-box">
        <cs-custom-form
          :options="options"
          :data-source="dataSourceBaseInfo"
          :form-datas="formRes"
        />
      </div>
    </div>

    <div class="form-main">
      <form-title :options="{ title: '送货信息' }" />
      <div class="form-box">
        <cs-custom-form
          :options="options"
          :data-source="dataSourceDeliveryInfo"
          :form-datas="formRes"
        />
      </div>
    </div>
    <div class="form-main">
      <form-title :options="{ title: '出货明细', formStyle: 'border:none' }" />
      <div class="form-box spe detail">
        <cs-custom-table
          :columns="columns"
          :data-source="list"
          :operates="popOperates"
          :pagination="pagination"
          tooltip-effect="dark"
        />
        <summationRow :config="sumConfig" />
      </div>
    </div>
    <div class="form-main">
      <form-title :options="{ title: '备注' }" />
      <div
        class="form-box"
        style="
          padding-left: 30px;
          color: #666666;
          line-height: 20px;
          font-size: 14px;
        "
      >
        {{ formRes.demo || "暂无" }}
      </div>
    </div>
    <bottomBar :options="barOptions" style="padding-left: 10px" />
    <CsCustomPop :options="popOptions" class="detail" />
  </div>
</template>

<script>
import popoverColumn from '@/components/cs-custom-table/columns/popover-column'
import propertyCard from '@/components/property-card/index.vue'
import FormTitle from '@/views/wms/public/components/formTitle'
import { PublicWms } from '@/views/wms/public/index.js'
import summationRow from '@/views/wms/public/components/summationRow.vue'
import { warehouseReceipt } from './components/index.js'
import { detail_1, detail_2 } from '@/views/wms/out-manage/components/index.js'
import bottomBar from '@/views/wms/public/components/bottomBar.vue'
export default {
  name: 'WarehouseReceiptManage',
  components: { FormTitle, summationRow, bottomBar },
  mixins: [warehouseReceipt, PublicWms],
  data() {
    const options = {
      inline: true
    }
    const itemStyle = this.formItemStyle()
    const dataSourceBaseInfo = [
      {
        prop: 'outNo',
        itemType: 'input',
        label: '出库单号:',
        readonly: true,
        itemStyle: itemStyle
      },
      {
        prop: 'outRelationNo',
        itemType: 'input',
        label: '关联单号:',
        readonly: true,
        itemStyle: itemStyle
      },
      {
        prop: 'senderParty',
        itemType: 'input',
        label: '发货方:',
        readonly: true,
        itemStyle: itemStyle
      },
      {
        prop: 'productType',
        itemType: 'input',
        label: '货物类型:',
        readonly: true,
        itemStyle: itemStyle
      },
      {
        prop: 'stockType',
        itemType: 'input',
        label: '出库类型:',
        readonly: true,
        itemStyle: itemStyle
      },
      {
        prop: 'stockOutFact',
        itemType: 'input',
        label: '出库数:',
        readonly: true,
        itemStyle: itemStyle
      },
      {
        prop: 'sentOutFact',
        itemType: 'input',
        label: '出库时间:',
        readonly: true,
        itemStyle: itemStyle
      }
    ]
    const dataSourceDeliveryInfo = [
      {
        prop: 'warehouseName',
        itemType: 'input',
        label: '出库仓库:',
        readonly: true,
        itemStyle: itemStyle
      },
      {
        prop: 'consigneeParty',
        itemType: 'input',
        label: '收货方:',
        readonly: true,
        itemStyle: itemStyle
      },
      {
        prop: 'consigneeAddr',
        itemType: 'input',
        label: '收货地址:',
        readonly: true,
        itemStyle: itemStyle
      },
      {
        prop: 'consigneeName',
        itemType: 'input',
        label: '收货联系人:',
        readonly: true,
        itemStyle: itemStyle
      },
      {
        prop: 'deliveryman',
        itemType: 'input',
        label: '送货司机:',
        readonly: true,
        itemStyle: itemStyle
      },
      {
        prop: 'deliverymanPhone',
        itemType: 'input',
        label: '联系电话:',
        readonly: true,
        itemStyle: itemStyle
      },
      {
        prop: 'licenseNumber',
        itemType: 'input',
        label: '车牌号:',
        readonly: true,
        itemStyle: itemStyle
      }
    ]
    const columns_2 = [
      {
        prop: 'batchNo',
        label: '批次号',
        minWidth: 140,
        showOverflowTooltip: true
      },
      {
        prop: 'materiel',
        label: '产品编号',
        minWidth: 140,
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
        }
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        minWidth: 140,
        showOverflowTooltip: true
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
        width: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'dyelot',
        label: '缸号',
        width: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'stockOutFact',
        label: '实际出库数',
        width: 180,
        align: 'right',
        showOverflowTooltip: true
      },
      {
        prop: 'weightOutFact',
        label: '实际出库重量(KG)',
        width: 180,
        align: 'right',
        showOverflowTooltip: true
      },
      {
        prop: 'ballCountFact',
        label: '球数',
        width: 120,
        align: 'right',
        showOverflowTooltip: true
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'center',
        width: 120,
        showOverflowTooltip: true
      }
    ]
    const columns_1 = [
      {
        prop: 'batchNo',
        label: '批次号',
        minWidth: 140,
        showOverflowTooltip: true
      },
      {
        prop: 'materiel',
        label: '产品编号',
        minWidth: 140,
        components: {
          popoverColumn
        },
        componentsOptions: {
          customOptions: {
            style: {
              color: '#0986FF',
              cursor: 'pointer',
              marginTop: '5px'
            },
            placement: 'right',
            width: '500',
            content: propertyCard,
            trigger: 'click',
            mouseleave: true,
            show: (scope) => {
              return scope.row['materiel']
            }
          }
        }
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        minWidth: 140,
        showOverflowTooltip: true
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
        width: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'stockOutFact',
        label: '实际出库数',
        width: 180,
        align: 'right',
        showOverflowTooltip: true
      },
      {
        prop: 'weightOutFact',
        label: '实际出库重量(KG)',
        width: 180,
        align: 'right',
        showOverflowTooltip: true
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'center',
        width: 120,
        showOverflowTooltip: true
      }
    ]
    const popOperates = {
      label: '操作',
      width: '80',
      fixed: 'right',
      dataSource: [
        {
          label: '明细',
          isShow: true,
          handle: (scope) => {
            this.getGoodsDetail({ outNo: this.id, batchNo: scope.row.batchNo })
            this.popOptions.content[0].columns = this[
              'detail_' + this.productType
            ]
          }
        }
      ]
    }
    const pagination = {
      currentChange: (val) => {
        this.getDetailPage({
          ...{ outNo: this.id },
          ...{ pageSize: this.pagination.pageSize || 20, pageNum: val }
        })
      },
      sizeChange: (val) => {
        this.getDetailPage({
          ...{ outNo: this.id },
          ...{ pageNum: this.pagination.pageNum || 1, pageSize: val }
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
      formRes: {},
      options,
      dataSourceBaseInfo,
      dataSourceDeliveryInfo,
      columns_1,
      columns_2,
      popOperates,
      sumConfig: [
        {
          title: '实际出库数',
          num: 0
        },
        {
          title: '实际出库总重量',
          num: 0
        }
      ],
      list: [],
      pagination,
      detail_1,
      detail_2,
      popOptions: {
        itemType: 'dialog',
        visible: false,
        title: '出库明细',
        okHidden: true,
        cancelText: '关闭',
        cancel: () => {
          this.popOptions.visible = false
        },
        width: '1300px',
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
      barOptions
    }
  },
  computed: {
    productType() {
      return this.$route.query.productType
    },
    id() {
      return this.$route.params.id
    },
    columns() {
      return this['columns_' + this.productType]
    }
  },
  created() {
    this.getDetailBase({ outNo: this.id })
    this.getDetailPage({ outNo: this.id })
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

<style lang="scss" >
.WarehouseReceiptManage {
  .el-form-item {
    margin-bottom: 0;
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
  .form-box .custom-form .el-form .el-form-item__content {
    .el-input__inner {
      background-color: transparent;
      border: none;
    }
  }
  .form-box.spe {
    padding-top: 0;
    .el-table th {
      background-color: #f5f7fa;
    }
  }
  .pagination {
    float: right;
  }
}
</style>
