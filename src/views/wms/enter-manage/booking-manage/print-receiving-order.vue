<template>
  <div class="print-main">
    <cs-print
      :print.sync="barPrint"
      :orientation="'p'"
      :interval="500"
      :format="'a4'"
    >
      <div class="pring-cont detail">
        <form-title
          :options="{
            title: '签收单',
            formStyle: {
              textAlign: 'center',
              display: 'block',
              lineHeight: '55px',
            },
          }"
        />
        <!-- 打印签收单 -->
        <cs-custom-form
          ref="searchForm"
          :form-datas="printSignOrderFormDatas"
          :data-source="printSignOrderDataSource"
          :options="formOtions"
        />
        <!-- 布列表 -->
        <cs-custom-table
          v-if="printSignOrderFormDatas.productType === 1"
          ref="bokingClothTable"
          tooltip-effect="dark"
          :columns="printOrderClothColumns"
          :autoresize="false"
          :data-source="dataSource"
          :pagination="pagination"
          :form-otions="formOtions"
        />
        <!-- 纱列表 -->
        <cs-custom-table
          v-if="printSignOrderFormDatas.productType === 2"
          ref="bokingGauzeTable"
          tooltip-effect="dark"
          :columns="printOrderGauzeColumns"
          :autoresize="false"
          :data-source="dataSource"
          :pagination="pagination"
          :form-otions="formOtions"
        />
        <div class="sign-bar-wrap">
          <div class="item">
            <span class="span">总计</span>
            <input
              type="text"
              :value="signEntity.numberInFact"
              readonly="readonly"
              style="width: 90px"
              class="input"
            >
            <span class="jian">件</span>`
          </div>
          <div class="item">
            <span class="span">收货人</span>
            <input
              type="text"
              style="width: 90px"
              readonly="readonly"
              class="input"
              :value="signEntity.consigneeName"
            >
          </div>
          <div class="item">
            <span class="span">签收确认人</span>
            <input
              type="text"
              style="width: 90px"
              readonly="readonly"
              class="input"
            >
          </div>
          <div class="item">
            <span class="span">签收时间</span>
            <input
              type="text"
              style="width: 130px"
              readonly="readonly"
              class="input"
              :value="this.$utils.parseTime(signEntity.sentInFact)"
            >
          </div>
        </div>
      </div>
    </cs-print>
    <div slot="footer" class="print-footer">
      <el-button type="primary" @click="barPrintHandle">打印</el-button>
      <el-button @click="comeBack()">返回</el-button>
    </div>
  </div>
</template>
<script>
import { PublicWms } from '@/views/wms/public/index'
import FormTitle from '@/views/wms/public/components/formTitle'
import * as api from './api/index.js'
import {
  BOOKING_TYPE_OF_GOODS
} from '@/views/wms/public/constants'
export default {
  components: {
    FormTitle
  },
  mixins: [PublicWms],
  data() {
    /* 打印收货单（布） */
    const printOrderClothColumns = [
      {
        prop: 'materiel',
        align: 'left',
        label: '产品编号',
        minWidth: 80
      },
      // {
      //   prop: 'sellerTeamName',
      //   align: 'left',
      //   label: '销售组织',
      //   minWidth: 80
      // },
      {
        prop: 'property',
        align: 'left',
        label: '产品属性',
        minWidth: 90
      },
      {
        prop: 'dyelot',
        align: 'left',
        label: '缸号',
        minWidth: 60
      },
      {
        prop: 'numberInPlan',
        align: 'right',
        label: '预计数量',
        minWidth: 80
      },
      {
        prop: 'numberInFact',
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

    /* 打印收货单（纱） */
    const printOrderGauzeColumns = [
      {
        prop: 'materiel',
        align: 'left',
        label: '产品编号',
        minWidth: 80
      },
      // {
      //   prop: 'sellerTeamName',
      //   align: 'left',
      //   label: '销售组织',
      //   minWidth: 120
      // },
      {
        prop: 'property',
        align: 'left',
        label: '产品属性',
        minWidth: 120
      },
      {
        prop: 'dyelot',
        align: 'left',
        label: '缸号',
        minWidth: 80
      },
      {
        prop: 'yarnCard',
        align: 'left',
        label: '纱牌/纱批',
        minWidth: 120
      },
      {
        prop: 'numberInPlan',
        align: 'right',
        label: '预计数量',
        minWidth: 80
      },
      {
        prop: 'numberInFact',
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
    const printOrdeItemStyle = {
      width: '31%',
      marginRight: '2%'
    }
    const printOrdeItemClassName = 'print-form-item'
    const printSignOrderDataSource = [
      {
        prop: 'deliveryNo',
        className: printOrdeItemClassName,
        disabled: true,
        itemStyle: printOrdeItemStyle,
        itemType: 'input',
        label: '关联单号'
      },
      {
        prop: 'productType',
        className: printOrdeItemClassName,
        disabled: true,
        itemStyle: printOrdeItemStyle,
        itemType: 'select',
        label: '货物类型',
        dataSource: BOOKING_TYPE_OF_GOODS
      },
      {
        prop: 'sentInPlan',
        className: printOrdeItemClassName,
        disabled: true,
        itemStyle: printOrdeItemStyle,
        itemType: 'input',
        label: '送仓时间'
      },
      {
        prop: 'warehouseName',
        className: printOrdeItemClassName,
        disabled: true,
        itemStyle: printOrdeItemStyle,
        itemType: 'input',
        label: '送货仓库'
      },
      {
        prop: 'numberInFact',
        className: printOrdeItemClassName,
        disabled: true,
        itemStyle: printOrdeItemStyle,
        itemType: 'input',
        label: '送货件数'
      },
      {
        prop: 'weightInFact',
        className: printOrdeItemClassName,
        disabled: true,
        itemStyle: printOrdeItemStyle,
        itemType: 'input',
        label: '送货重量（kg）'
      },
      {
        prop: 'deliveryman',
        className: printOrdeItemClassName,
        disabled: true,
        itemStyle: printOrdeItemStyle,
        itemType: 'input',
        label: '司机信息'
      },
      {
        prop: 'deliverymanPhone',
        className: printOrdeItemClassName,
        disabled: true,
        itemStyle: printOrdeItemStyle,
        itemType: 'input',
        label: '司机联系电话'
      }
      /*       {
              prop: 'tableForm',
              itemType: 'table-form',
              itemStyle: {
                width: '100%'
              },
              dataSource: [],
              columns: printOrderColumns
            } */
    ]
    /* 分页 */
    const pagination = {
      currentChange: (val) => {
      },
      sizeChange: (val) => {
      }
    }
    return ({
      barPrint: false,
      printOrderClothColumns,
      printOrderGauzeColumns,
      dataSource: [],
      pagination,
      formOtions: {
        inline: true,
        size: 'small'
      },
      printSignOrderFormDatas: {},
      printSignOrderDataSource,
      signEntity: {}
    })
  },
  created() {
    const reservationNo = this.$route.query['reservationNo']
    if (reservationNo) {
      this.getReservationInfo({
        reservationNo: reservationNo
      })
      this.getReservationProductList({
        reservationNo: reservationNo
      })
    }
  },
  methods: {
    barPrintHandle() {
      this.barPrint = true
    },
    /* 预约单管理-详情 */
    async getReservationInfo(params) {
      const res = await api.getReservationInfoData(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data
        this.printSignOrderFormDatas = {
          ...data,
          ...data.deliveryInfo,
          sentInPlan: this.$utils.parseTime(data.sentInPlan)
        }
        this.signEntity = {
          numberInFact: data.numberInFact,
          consigneeName: data.consignee.label,
          sentInFact: data.sentInFact,
          deliverymanPhone: data.deliveryInfo.deliverymanPhone
        }
        console.log('this.printSignOrderFormDatas', this.printSignOrderFormDatas)
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
    },
    comeBack() {
      this.$router.push('/wms/enter-manage/booking-manage')
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-form {
  width: 210mm;
  margin: 20px auto 0;
}
/deep/ .el-form-item--small.el-form-item {
  margin-bottom: 5px;
}
/deep/ .el-form-item__label-wrap {
  margin-left: 10px !important;
}
.print-main {
  margin-top: 20px;
}
.pring-cont,
.print-footer {
  width: 210mm;
  background-color: #fff;
  text-align: center;
}
.print-footer {
  padding: 20px;
}
.pring-cont {
  margin-top: 20px;
  height: 100%;
  padding: 10px;
  position: relative;
}
/deep/ .print-form-item input[disabled='disabled'] {
  color: #606266;
  background-color: #fff !important;
  border: none;
}
/deep/ .print-form-item .is-disabled .el-input__suffix {
  display: none;
}
.print-form-item .el-input.is-disabled .el-input__inner {
  background-color: #fff !important;
  border-color: #fff;
  color: #c0c4cc;
  cursor: default;
}
.sign-bar-wrap {
  position: relative;
  margin: 60px 0 30px;
  display: flex;
  justify-content: space-around;
}

.sign-bar-wrap .item {
  position: relative;
  display: table-cell;
  margin-right: 20px;
}
.sign-bar-wrap .item .span,
.input {
  display: inline-block;
}
.sign-bar-wrap .item .input {
  outline: none;
  width: 105px;
  margin-left: 10px;
  border-top: none 0;
  border-left: none 0;
  border-right: none 0;
  border-bottom: solid 1px #000;
}
.jian {
  position: absolute;
  right: 5px;
  top: 0px;
}
.sign-bar-wrap .item:last-child {
  margin-right: 0;
}
/deep/ .el-form-item__label-wrap .el-form-item__label,
/deep/ .print-form-item input[disabled='disabled'],
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
