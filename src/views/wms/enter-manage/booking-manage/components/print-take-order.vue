
<template>
  <div class="detail">
    <table class="take-order-main">
      <tr>
        <td class="bar-code">
          <cs-barcode
            :options="{ value: reservationNo, height: 40, width: 0.8 }"
          />
        </td>
        <td>
          <cs-custom-form
            ref="searchForm"
            :form-datas="takeOrderFormDatas"
            :data-source="takeOrderDataSource"
            :options="formOtions"
          />
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <!-- 布列表 -->
          <cs-custom-table
            v-if="takeOrderFormDatas.productType === 1"
            ref="takeOrderTable"
            tooltip-effect="dark"
            :columns="takeOrderClothColumns"
            :autoresize="false"
            :data-source="dataSource"
            :form-otions="formOtions"
          />
          <!-- 纱列表 -->
          <cs-custom-table
            v-if="takeOrderFormDatas.productType === 2"
            ref="takeOrderTable"
            tooltip-effect="dark"
            :columns="takeOrderGauzeColumns"
            :autoresize="false"
            :data-source="dataSource"
            :form-otions="formOtions"
          />
        </td>
      </tr>
    </table>
    <div class="sign-bar-wrap">
      <div class="item">
        <span class="span">总计</span>
        <input type="text" readonly="readonly" class="input">
        <span class="jian">件</span>
      </div>
      <div class="item">
        <span class="span">收货人</span>
        <input type="text" readonly="readonly" class="input">
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '../api/index.js'
import {
  BOOKING_TYPE_OF_GOODS
} from '@/views/wms/public/constants'
export default {
  data() {
    /* 收货单布列表 */
    const takeOrderClothColumns = [
      {
        prop: 'materiel',
        align: 'left',
        label: '产品编号',
        minWidth: 80
      },
      {
        prop: 'sellerTeamName',
        align: 'left',
        label: '销售组织',
        minWidth: 100
      },
      {
        prop: 'property',
        align: 'left',
        label: '产品属性',
        minWidth: 100
      },
      {
        prop: 'dyelot',
        align: 'left',
        label: '缸号',
        minWidth: 80
      },
      {
        prop: 'color',
        align: 'left',
        label: '成品颜色',
        minWidth: 80
      },
      {
        prop: 'printing',
        align: 'left',
        label: '印花花号',
        minWidth: 100
      },
      {
        prop: 'numberInPlan',
        align: 'right',
        label: '预计数量',
        minWidth: 80
      },
      {
        prop: 'numberInFact1',
        align: 'right',
        label: '实际数量',
        minWidth: 80
      },
      {
        prop: 'packingUnit',
        align: 'left',
        label: '包装单位',
        minWidth: 80
      }
    ]

    /* 收货单纱列表 */
    const takeOrderGauzeColumns = [
      {
        prop: 'materiel',
        align: 'left',
        label: '产品编号',
        minWidth: 80
      },
      {
        prop: 'sellerTeamName',
        align: 'left',
        label: '销售组织',
        minWidth: 100
      },
      {
        prop: 'property',
        align: 'left',
        label: '产品属性',
        minWidth: 100
      },
      {
        prop: 'yarnCard',
        align: 'left',
        label: '纱牌纱批',
        minWidth: 100
      },
      {
        prop: 'dyelot',
        align: 'left',
        label: '缸号',
        minWidth: 80
      },
      {
        prop: 'numberInPlan',
        align: 'right',
        label: '预计数量',
        minWidth: 80
      },
      {
        prop: 'numberInFact1',
        align: 'right',
        label: '实际数量',
        minWidth: 80
      },
      {
        prop: 'packingUnit',
        align: 'left',
        label: '包装单位',
        minWidth: 80
      }
    ]

    const takeOrderItemClass = 'take-order-class'
    const printOrdeItemStyle = {
      display: 'inline-block',
      width: '46%',
      marginRight: '10px'
    }
    const takeOrderDataSource = [
      {
        prop: 'deliveryNo',
        className: takeOrderItemClass,
        disabled: true,
        itemStyle: printOrdeItemStyle,
        itemType: 'input',
        label: '关联单号'
      },
      {
        prop: 'productType',
        className: takeOrderItemClass,
        disabled: true,
        itemStyle: printOrdeItemStyle,
        itemType: 'select',
        label: '货物类型',
        dataSource: BOOKING_TYPE_OF_GOODS
      },
      {
        prop: 'warehouseName',
        className: takeOrderItemClass,
        disabled: true,
        itemStyle: printOrdeItemStyle,
        itemType: 'input',
        label: '送货仓库'
      },
      {
        prop: 'numberInFact',
        className: takeOrderItemClass,
        disabled: true,
        itemStyle: printOrdeItemStyle,
        itemType: 'input',
        label: '送货件数'
      },
      {
        prop: 'weightInFact',
        className: takeOrderItemClass,
        disabled: true,
        itemStyle: printOrdeItemStyle,
        itemType: 'input',
        label: '送货重量(KG)'
      },
      {
        prop: 'sentInPlan',
        className: takeOrderItemClass,
        disabled: true,
        itemStyle: printOrdeItemStyle,
        itemType: 'input',
        label: '送仓时间'
      },
      {
        prop: 'deliveryman',
        className: takeOrderItemClass,
        disabled: true,
        itemStyle: printOrdeItemStyle,
        itemType: 'input',
        label: '司机信息'
      },
      {
        prop: 'deliverymanPhone',
        className: takeOrderItemClass,
        disabled: true,
        itemStyle: printOrdeItemStyle,
        itemType: 'input',
        label: '联系电话'
      }
    ]
    return {
      takeOrderClothColumns,
      takeOrderGauzeColumns,
      dataSource: [],
      takeOrderFormDatas: {},
      takeOrderDataSource,
      reservationNo: '',
      formOtions: {
        inline: true,
        size: 'small'
      },
      signEntity: {}
    }
  },
  created() {
    this.reservationNo = this.$route.query['reservationNo']
    this.getReservationInfo({
      reservationNo: this.reservationNo
    })
    this.getReservationProductList({
      reservationNo: this.reservationNo
    })
  },
  methods: {
    /* 预约单管理-详情 */
    async getReservationInfo(params) {
      const res = await api.getReservationInfoData(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data
        this.takeOrderFormDatas = {
          ...data,
          ...data.deliveryInfo,
          sentInPlan: this.$utils.parseTime(data.sentInPlan)
        }
        this.signEntity = {
          numberInFact: data.numberInFact,
          consigneeName: data.consignee.label,
          sentInFact: data.sentInFact
        }
      }
    },
    /* 预约单管理-详情-货物明细*/
    async getReservationProductList(params = {}) {
      const res = await api.getReservationProductData(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data
        this.dataSource = data.list
        this.pagination = {
          ...this.pagination,
          dataTotal: data.total,
          ...params,
          currentPage: data.pageNum,
          pageSize: data.pageSize
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .take-order-main .el-form-item--small.el-form-item {
  margin-bottom: 0;
  align-items: center;
}
/deep/ .take-order-main .el-form-item--small {
  .el-form-item__content {
    line-height: 20px;
  }
}
/deep/ .take-order-main .el-form-item__label-wrap {
  margin-left: 10px !important;
}
.take-order-main .bar-code {
  width: 100px;
  vertical-align: middle;
}

/deep/ .take-order-main .take-order-class input {
  border: none;
}
/deep/ .take-order-class .el-input.is-disabled .el-input__inner {
  background-color: #fff !important;
  border-color: #fff;
  color: #606266;
  cursor: default;
}
/deep/ .take-order-class .el-input__suffix {
  display: none;
}
/deep/ .take-order-class input[disabled='disabled'] {
  background-color: #fff !important;
  border-color: #fff;
  color: #606266;
  cursor: default;
}
/deep/ .el-form-item__label-wrap .el-form-item__label {
  width: 100px !important;
  text-align: right;
}
.sign-bar-wrap {
  margin: 60px 5px 30px;
  display: flex;
  justify-content: flex-start !important;
}
.sign-bar-wrap .item {
  display: table-cell;
  position: relative;
  margin-right: 36px;
  font-size: 14px;
}
.sign-bar-wrap .span,
.sign-bar-wrap .input {
  display: inline-block;
}
.sign-bar-wrap .input {
  outline: none;
  width: 88px;
  margin-left: 10px;
  border-top: none 0;
  border-left: none 0;
  border-right: none 0;
  border-bottom: solid 1px #000;
}
.sign-bar-wrap.jian {
  position: absolute;
  right: 5px;
  top: 0px;
}
.item:last-child {
  margin-right: 0;
}
/deep/ .el-form-item__label-wrap .el-form-item__label,
/deep/ .take-order-class input[disabled='disabled'],
/deep/ .sign-bar-wrap .item,
/deep/ .el-table th,
/deep/ .el-table td {
  font-size: 12px;
}
/deep/ .el-table th,
/deep/ .el-table td {
  padding: 5px 0;
}
/deep/ .el-table .cell {
  line-height: 18px;
}
</style>
<style type="text/css">
.el-form-item__content::before,
.el-form-item__content::after {
  display: block !important;
  content: normal !important;
}
</style>
