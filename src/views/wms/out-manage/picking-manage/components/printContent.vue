
<template>
  <div>
    <table class="info-table PrintContent">
      <tr>
        <th style="width: 80px">拣货单条码</th>
        <td style="width: 100px">
          <cs-barcode
            :options="{ value: id, height: 40, width: 1.2, fontSize: 12 }"
            class="cs-code"
          />
        </td>
        <th class="label">拣货件数</th>
        <td>
          {{ num }}
        </td>
        <th class="label">拣货生成时间</th>
        <td>
          {{ takeOrderFormDatas.pickCreateTime }}
        </td>
      </tr>
    </table>
    <div class="detail">
      <cs-custom-table
        ref="takeOrderTable"
        class="put-up-table"
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :form-otions="formOtions"
      />
    </div>
  </div>
</template>

<script>
import { picking } from './index.js'
export default {
  name: 'PrintContent',
  mixins: [picking],
  data() {
    const columns_base = [
      {
        prop: '1',
        label: '条码号'
      },
      {
        prop: '2',
        label: '库位号'
      },
      {
        prop: 'materiel',
        label: '产品编号'
      },
      {
        prop: 'property',
        label: '产品属性'
      },
      {
        prop: 'dyelot',
        label: '缸号'
      }
    ]
    const columns_1 = [
      {
        prop: 'printing',
        label: '印花花号'
      },
      {
        prop: 'color',
        label: '成品颜色',
        minWidth: 80
      }
    ]
    const columns_2 = [
      {
        prop: 'yarnCard',
        label: '纱牌/纱批'
      },
      {
        prop: 'color',
        label: '染纱颜色'
      }
    ]
    return {
      columns_base,
      columns_1,
      columns_2,
      dataSource: [],
      takeOrderFormDatas: {},
      formOtions: {
        inline: true,
        size: 'small'
      }
    }
  },
  computed: {
    columns() {
      return [...this.columns_base, ...this['columns_' + this.productType]]
    },
    num() {
      return this.dataSource.length || 0
    }
  },
  created() {
    const fn = (res) => {
      res.data.pickCreateTime = res.data.pickCreateTime
        ? this.$utils.parseTime(res.data.pickCreateTime)
        : ''
      this.takeOrderFormDatas = res.data || {}
    }
    this.getDetailBase({ outPickSubNo: this.id }, fn)
    this.printInfo({ outPickSubNo: this.id, pageSize: 100000000, pageNum: 1 })
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.info-table {
  width: 100%;
  padding: 5px 0;
  /*  border-collapse: collapse; */
  td {
    text-align: left;
    color: #000;
  }
  td,
  th {
    font-size: 14px;
    vertical-align: middle;
    padding: 5px;
  }
  .cs-code {
    margin-left: 10px;
  }
  th {
    text-align: right;
    font-weight: 500;
  }
}
.put-up-table {
  height: auto;
  padding-right: 10px;
}
</style>
<style lang="scss" scoped>
/deep/ .el-form-item__label-wrap .el-form-item__label,
/deep/ .take-order-class input[disabled="disabled"],
/deep/ .sign-bar-wrap .item,
/deep/ .info-table th,
/deep/ .info-table td,
/deep/ .el-table--medium th,
/deep/ .el-table--medium td {
  font-size: 12px;
}
/deep/ .el-table--medium th,
/deep/ .el-table--medium td {
  padding: 5px 0;
}
/deep/ .el-table .cell {
  line-height: 18px;
}
</style>
