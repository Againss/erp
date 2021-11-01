<template>
  <div class="PreDeliveryOrderManageDetail page-main">
    <div class="form-main">
      <form-title :options="{ title: '基础信息' }" />
      <div class="form-box">
        <cs-custom-form
          :options="options"
          :data-source="dataSourceBaseInfo"
          :form-datas="formDatasBaseInfo"
        />
      </div>
    </div>
    <div class="form-main">
      <form-title :options="{ title: '送货信息' }" />
      <div class="form-box">
        <cs-custom-form
          :options="options"
          :data-source="dataSourceDeliveryInfo"
          :form-datas="formDatasBaseInfo"
        />
      </div>
    </div>
    <div class="form-main">
      <form-title
        :options="{ title: '预出货明细', formStyle: 'border:none' }"
      />
      <div class="form-box spe detail">
        <cs-custom-table
          tooltip-effect="light"
          :columns="columns"
          :data-source="dataList"
          :options="popOperates"
          :pagination="pagination"
        />
        <summationRow :config="sumConfig" style="padding-left:10px" />
      </div>
    </div>
    <div class="form-main">
      <form-title :options="{ title: '备注' }" />
      <div class="form-box" style="padding-left: 30px;color:#666666;line-height:20px;font-size:14px">
        {{ formDatasBaseInfo.demo }}
      </div>
    </div>
    <bottomBar :options="barOptions" />
  </div>
</template>

<script>
import popoverColumn from '@/components/cs-custom-table/columns/popover-column'
import propertyCard from '@/components/property-card/index.vue'
import FormTitle from '@/views/wms/public/components/formTitle'
import { PublicWms } from '@/views/wms/public/index.js'
import { preDeliveryOrder } from "./components/index.js"; // eslint-disable-line
import summationRow from '@/views/wms/public/components/summationRow.vue'
import bottomBar from '@/views/wms/public/components/bottomBar.vue'
export default {
  name: 'PreDeliveryOrderManageDetail',
  components: { FormTitle, summationRow, bottomBar },
  mixins: [preDeliveryOrder, PublicWms],
  data() {
    const options = {
      inline: true
    }
    const itemStyle = this.formItemStyle()
    const dataSourceBaseInfo = [
      {
        prop: 'outReservationNo',
        itemType: 'input',
        label: '预出库单号:',
        itemStyle,
        readonly: true
      },
      {
        prop: 'outRelationNo',
        itemType: 'input',
        label: '关联单号:',
        itemStyle,
        readonly: true
      },
      {
        prop: 'senderParty',
        itemType: 'input',
        label: '送货方:',
        itemStyle,
        readonly: true
      },
      {
        prop: 'productType',
        itemType: 'input',
        label: '货物类型:',
        itemStyle,
        readonly: true
      },
      {
        prop: 'stockType',
        itemType: 'input',
        label: '出库类型:',
        itemStyle,
        readonly: true
      },
      {
        prop: 'stockOutPlan',
        itemType: 'input',
        label: '出库件数:',
        itemStyle,
        readonly: true
      }
    ]
    const dataSourceDeliveryInfo = [
      {
        prop: 'warehouseName',
        itemType: 'input',
        label: '出库仓库:',
        itemStyle,
        readonly: true
      },
      {
        prop: 'consigneeParty',
        itemType: 'input',
        label: '收货方:',
        itemStyle,
        readonly: true
      },
      {
        prop: 'consigneeAddr',
        itemType: 'input',
        label: '收货地址:',
        itemStyle,
        readonly: true
      },
      {
        prop: 'consigneeName',
        itemType: 'input',
        label: '收获联系人:',
        itemStyle,
        readonly: true
      },
      {
        prop: 'deliveryman',
        itemType: 'input',
        label: '送货司机:',
        itemStyle,
        readonly: true
      },
      {
        prop: 'deliverymanPhone',
        itemType: 'input',
        label: '联系电话:',
        itemStyle,
        readonly: true
      },
      {
        prop: 'licenseNumber',
        itemType: 'input',
        label: '车牌号:',
        itemStyle,
        readonly: true
      }
    ]
    // 布列表
    const columns_1 = [
      {
        prop: 'materiel',
        label: '产品编号',
        minWidth: 160,
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
        showOverflowTooltip: true,
        minWidth: 160
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
        prop: 'dyelot',
        label: '缸号',
        showOverflowTooltip: true,
        minWidth: 120
      },
      // {
      //   prop: 'printing',
      //   label: '印花花号',
      //   showOverflowTooltip: true,
      //   width: 120
      // },
      // {
      //   prop: 'color',
      //   label: '成品颜色',
      //   showOverflowTooltip: true,
      //   width: 120
      // },
      {
        prop: 'stockOutPlan',
        label: '预计出库数',
        width: 120,
        align: 'right',
        showOverflowTooltip: true
      },
      {
        prop: 'weightOutPlan',
        label: '预计出库重量(KG)',
        width: 160,
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.moneyFormat(scope.row[scope.column.property] + '')
        }
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'center',
        showOverflowTooltip: true,
        width: 120
      }
    ]
    // 纱列表
    const columns_2 = [
      {
        prop: 'materiel',
        label: '产品编号',
        minWidth: 160,
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
        showOverflowTooltip: true,
        minWidth: 160
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
        showOverflowTooltip: true,
        width: 120
      },
      {
        prop: 'dyelot',
        label: '缸号',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'stockOutPlan',
        label: '预计出库数',
        showOverflowTooltip: true,
        width: 120
      },
      {
        prop: 'weightOutPlan',
        label: '预计出库重量(KG)',
        width: 160,
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.moneyFormat(scope.row[scope.column.property] + '')
        }
      },
      {
        prop: 'ballCountPlan',
        label: '球数',
        showOverflowTooltip: true,
        width: 120
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        showOverflowTooltip: true,
        width: 120
      }
    ]
    const popOperates = {}
    const pagination = {
      currentChange: (val) => {
        this.getDetailPage({
          ...{ outReservationNo: this.$route.params.id },
          ...{ pageSize: this.pagination.pageSize || 20, pageNum: val }
        })
      },
      sizeChange: (val) => {
        this.getDetailPage({
          ...{ outReservationNo: this.$route.params.id },
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
      options,
      dataSourceBaseInfo,
      dataSourceDeliveryInfo,
      columns_1,
      columns_2,
      popOperates,
      dataList: [],
      formDatasBaseInfo: {},
      pagination,
      sumConfig: [
        {
          title: '预计出库数（件）',
          num: 0
        },
        {
          title: ' 预计出库总重量（KG）',
          num: 0
        }
      ],
      barOptions
    }
  },
  computed: {
    productType() {
      //  1--布 2--纱
      return this.$route.query.productType
    },
    columns() {
      return this['columns_' + this.productType]
    }
  },
  created() {
    this.getDetailBase({ outReservationNo: this.$route.params.id })
    this.getDetailPage({
      ...{ outReservationNo: this.$route.params.id },
      ...this.pagination
    })
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
.PreDeliveryOrderManageDetail {
  .el-form-item{
   margin-bottom:0
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

<style lang="scss" scoped>
.PreDeliveryOrderManageDetail {
  .total {
    color: #666666;
    margin: 24px 0 12px;
    .tip {
      color: #ff9b02;
      font-size: 16px;
    }
  }
}
</style>
