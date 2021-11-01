<template>
  <div class="PickingDetail page-main">
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
      <form-title
        :options="{
          title: '拣货明细',
          formStyle: status == 2 && productType == 2 ? '' : 'border:none',
        }"
      />

      <div class="form-box spe">
        <div
          v-if="
            status == 2 && productType == 2 && active == 2 && dataSource.length
          "
          class="print"
        >
          <el-button
            size="small"
            type="primary"
            @click="print"
          >批量打印</el-button>
        </div>
        <el-tabs
          v-if="status == 2 && productType == 2"
          v-model="active"
          class="PickingDetailTab"
          @tab-click="handleClick"
        >
          <el-tab-pane label="拣货明细" name="1" />
          <el-tab-pane label="拆件明细" name="2" />
        </el-tabs>
        <div class="detail">
          <cs-custom-table
            :columns="columns"
            :data-source="dataSource"
            :pagination="active == 2 ? null : pagination"
            tooltip-effect="dark"
            :operates="
              status + '' === '1' ? null : active === '2' ? null : popOperates
            "
          />
        </div>
        <summationRow
          v-if="active !== '2'"
          :config="sumConfig"
          style="padding-left: 10px"
        />
      </div>
    </div>

    <bottomBar :config="barOptions" />
    <CsCustomPop :options="popOptions" class="detail" />
  </div>
</template>

<script>
import popoverColumn from '@/components/cs-custom-table/columns/popover-column'
import propertyCard from '@/components/property-card/index.vue'
import FormTitle from '@/views/wms/public/components/formTitle'
import { PublicWms } from '@/views/wms/public/index.js'
import { picking } from './components/index.js'
import summationRow from '@/views/wms/public/components/summationRow.vue'
import { PRODUCT_TYPE } from '@/views/wms/public/constants.js'
import { detail_1, detail_2 } from '@/views/wms/out-manage/components/index.js'
import bottomBar from '@/views/wms/public/components/bottomBar.vue'
export default {
  name: 'PickingDetail',
  components: { FormTitle, summationRow, bottomBar },
  mixins: [picking, PublicWms],
  data() {
    const itemStyle = this.formItemStyle()
    const dataSourceBaseInfo_1 = [
      {
        prop: 'outPickNo',
        itemType: 'input',
        label: '拣货单号:',
        itemStyle: itemStyle,
        readonly: true
      },
      {
        prop: 'outReservationNo',
        itemType: 'input',
        label: '关联预出库单号:',
        itemStyle: itemStyle,
        readonly: true
      },
      {
        prop: 'shipperName',
        itemType: 'input',
        label: '货主:',
        itemStyle: itemStyle,
        readonly: true
      },
      {
        prop: 'productType',
        itemType: 'input',
        label: '货物类型:',
        itemStyle: itemStyle,
        readonly: true
      },
      {
        prop: 'stockOutPlan',
        itemType: 'input',
        label: '出库件数:',
        itemStyle: itemStyle,
        readonly: true
      },
      {
        prop: 'pickCreateTime',
        itemType: 'input',
        label: '拣货生成时间:',
        itemStyle: itemStyle,
        readonly: true
      }
    ]
    const dataSourceBaseInfo_2 = [
      {
        prop: 'outPickNo',
        itemType: 'input',
        label: '拣货单号:',
        itemStyle: itemStyle,
        readonly: true
      },
      {
        prop: 'outReservationNo',
        itemType: 'input',
        label: '关联预出库单号:',
        itemStyle: itemStyle,
        readonly: true
      },
      {
        prop: 'shipperName',
        itemType: 'input',
        label: '货主:',
        itemStyle: itemStyle,
        readonly: true
      },
      {
        prop: 'productType',
        itemType: 'input',
        label: '货物类型:',
        itemStyle: itemStyle,
        readonly: true
      },
      {
        prop: 'stockOutPlan',
        itemType: 'input',
        label: '出库件数:',
        itemStyle: itemStyle,
        readonly: true
      },
      {
        prop: 'stockOutFact',
        itemType: 'input',
        label: '拣货数:',
        itemStyle: itemStyle,
        readonly: true
      },
      {
        prop: 'pickCompleteTime',
        itemType: 'input',
        label: '拣货完成时间:',
        itemStyle: itemStyle,
        readonly: true
      },
      {
        prop: 'pickerName',
        itemType: 'input',
        label: '拣货员:',
        itemStyle: itemStyle,
        readonly: true
      }
    ]
    // 布列表--待拣货状态
    const columns_1_1 = [
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
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        showOverflowTooltip: true,
        minWidth: 140
      },
      {
        prop: 'stockOutPlan',
        label: '待拣货数',
        align: 'right',
        minWidth: 140,
        showOverflowTooltip: true
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'center',
        minWidth: 120,
        showOverflowTooltip: true
      }
    ]
    // 纱列表--待拣货状态
    const columns_1_2 = [
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
        prop: 'dyelot',
        label: '缸号',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'yarnCard',
        label: '纱牌/纱批',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        minWidth: 160,
        showOverflowTooltip: true
      },
      {
        prop: 'stockOutPlan',
        label: '待拣货数',
        align: 'right',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'ballCountPlan',
        label: '球数',
        align: 'right',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        align: 'center',
        maxWidth: 120,
        showOverflowTooltip: true
      }
    ]
    // 布列表--待拣货状态
    const columns_2_1 = [
      {
        prop: 'locationName',
        label: '拣货库位',
        minWidth: 160,
        showOverflowTooltip: true
      },
      {
        prop: 'stockOutFact',
        label: '拣货数',
        align: 'right',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        showOverflowTooltip: true,
        minWidth: 120
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
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'weightOutFact',
        label: '重量',
        showOverflowTooltip: true,
        minWidth: 120
      }
    ]
    // 纱分类
    const columns_2_2 = [
      {
        prop: 'locationName',
        label: '拣货库位',
        minWidth: 160,
        showOverflowTooltip: true
      },
      {
        prop: 'stockOutFact',
        label: '拣货数',
        align: 'right',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        showOverflowTooltip: true,
        minWidth: 120
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
        prop: 'dyelot',
        label: '缸号',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'yarnCard',
        label: '纱牌/批号',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'ballCountFact',
        label: '球数',
        align: 'right',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        align: 'center',
        minWidth: 160,
        showOverflowTooltip: true
      },
      {
        prop: 'weightOutFact',
        label: '重量',
        width: 120,
        showOverflowTooltip: true
      }
    ]
    const options = { inline: true }
    const pagination = {
      currentChange: (val) => {
        this.getDetailPage(
          {
            ...{ outPickSubNo: this.$route.params.id },
            ...{ pageSize: this.pagination.pageSize || 20, pageNum: val }
          },
          this.resCallBack
        )
      },
      sizeChange: (val) => {
        this.getDetailPage(
          {
            ...{ outPickSubNo: this.$route.params.id },
            ...{ pageNum: this.pagination.pageNum || 1, pageSize: val }
          },
          this.resCallBack
        )
      }
    }
    const columns_2_2_split = [
      {
        prop: 'locationName',
        label: '库位号',
        showOverflowTooltip: true,
        minWidth: 160
      },
      {
        prop: 'materiel',
        label: '产品编码',
        showOverflowTooltip: true,
        minWidth: 180
      },
      {
        prop: 'serialSubNo',
        label: '条码号',
        showOverflowTooltip: true,
        minWidth: 160
      },
      {
        prop: 'packingUnit',
        label: '包装单位',
        minWidth: 120,
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
        label: '纱牌/批号',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'dyelot',
        label: '缸号',
        align: 'left',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        minWidth: 160,
        showOverflowTooltip: true
      },
      {
        prop: 'ballCountFact',
        label: '球数',
        width: 120,
        showOverflowTooltip: true
      },
      {
        prop: 'weightOutFact',
        label: '重量',
        width: 120,
        showOverflowTooltip: true
      }
    ]
    const barOptions = {
      _cancel: {
        type: '',
        submit: () => {
          this.$router.go(-1)
        },
        text: '返回'
      },
      _print: {
        type: '',
        isHidden: () => {
          return !(
            this.status + '' === '1' &&
            this.$permission(['wms:stockOut:pick:printPickForm'])
          )
        },
        submit: () => {
          this.$router.push({
            path: '/wms/out-manage/picking-manage/print/' + this.id,
            query: {
              status: this.status,
              productType: this.productType
            }
          })
        },
        text: '打印拣货单'
      },
      _confirm: {
        type: 'primary',
        isHidden: () => {
          return !(
            this.status + '' === '1' &&
            this.$permission(['wms:stockOut:pick:confirm'])
          )
        },
        submit: () => {
          this.$router.push({
            path: '/wms/out-manage/picking-manage/confirm/' + this.id,
            query: { productType: this.productType }
          })
        },
        text: '拣货确认'
      }
    }

    return {
      popOperates: {
        label: '操作',
        width: '80',
        fixed: 'right',
        dataSource: [
          {
            label: '明细',
            isShow: true,
            handle: (params) => {
              //  materiel,outPickSubNo,locationCode,sellerTeamId,dyelot,yarnCard
              const parameter = {
                materiel: params.row.materiel,
                outPickSubNo: this.id,
                locationCode: params.row.locationCode,
                sellerTeamId: params.row.sellerTeamId,
                dyelot: params.row.dyelot,
                yarnCard: params.row.yarnCard
              }
              this.getGoodsDetail(parameter)
              this.popOptions.content[0].columns = this[
                'detail_' + this.productType
              ]
            }
          }
        ]
      },
      pagination,
      dataSourceBaseInfo_1,
      dataSourceBaseInfo_2,
      columns_1_1,
      columns_1_2,
      columns_2_1,
      columns_2_2,
      detail_1,
      detail_2,
      options,
      formDatasBaseInfo: {},
      dataSource: [],
      sumConfig_2: [
        {
          title: '拣货件数',
          num: 0
        }
      ],
      sumConfig_1: [
        {
          title: '待拣货件数:',
          num: 0
        }
      ],
      popOptions: {
        itemType: 'dialog',
        visible: false,
        title: '拣货明细',
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
      active: '1',
      columns_2_2_split,
      barOptions
    }
  },
  computed: {
    dataSourceBaseInfo() {
      return this['dataSourceBaseInfo_' + this.status]
    },
    columns() {
      const status = this.status + ''
      if (status === '1' || (status === '2' && this.active === '1')) {
        return this['columns_' + this.status + '_' + this.productType]
      } else {
        return this.columns_2_2_split
      }
    },
    sumConfig() {
      return this['sumConfig_' + this.status]
    }
  },
  created() {
    const fn = (res) => {
      const productType = res.data.productType
      const index = PRODUCT_TYPE.findIndex((n) => n.value === productType)
      index !== -1 ? (res.data.productType = PRODUCT_TYPE[index].label) : ''
      this['sumConfig_' + this.status][0].num = res.data.stockOutFact || 0
      res.data.pickCreateTime = res.data.pickCreateTime
        ? this.$utils.parseTime(res.data.pickCreateTime)
        : ''
      res.data.pickCompleteTime = res.data.pickCompleteTime
        ? this.$utils.parseTime(res.data.pickCompleteTime)
        : ''
      res.data.shipperName = res.data.shipper.label || ''
      res.data.pickerName = res.data.picker.label || ''
      this.formDatasBaseInfo = res.data || {}
      if (this.status + '' === '1') {
        this.sumConfig_1[0].num = this.formDatasBaseInfo.stockOutPlan
      } else if (this.status + '' === '2') {
        this.sumConfig_2[0].num = this.formDatasBaseInfo.stockOutFact
      }
    }
    this.getDetailBase({ outPickSubNo: this.id }, fn)

    const callback = (res, params) => {
      const data = res.data || {}
      this.dataSource = data.list || []
      this.pagination = {
        ...this.pagination,
        dataTotal: data.total || 0,
        ...params,
        currentPage: data.pageNum || 1,
        pageSize: data.pageSize || 20
      }
    }
    this.getDetailPage({ outPickSubNo: this.id }, callback)
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
    },
    resCallBack(res, params) {
      const data = res.data || {}
      this.dataSource = data.list || []
      this.pagination = {
        ...this.pagination,
        dataTotal: data.total || 0,
        ...params,
        currentPage: data.pageNum || 1,
        pageSize: data.pageSize || 20
      }
    },
    handleClick() {
      if (this.active === '2') {
        this.getSplitDetail({ outPickSubNo: this.id })
      } else {
        this.getDetailPage(
          {
            ...{ outPickSubNo: this.$route.params.id },
            ...{ pageNum: 1, pageSize: 20 }
          },
          this.resCallBack
        )
      }
    },
    print() {
      const path = this.$route.path + '/splitPrint'
      this.$router.push({
        path: path,
        query: {
          name: this.formDatasBaseInfo.shipperName,
          productType: this.productType
        }
      })
    }
  }
}
</script>

<style lang="scss" >
.PickingDetail {
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
  .PickingDetailTab {
    .el-tabs__header {
      margin: 0;
    }
  }
}
</style>

<style lang="scss" scoped>
.PickingDetail {
  .print {
    position: absolute;
    right: 20px;
    top: 14px;
    z-index: 3;
  }
  .form-box.spe {
    position: relative;
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
