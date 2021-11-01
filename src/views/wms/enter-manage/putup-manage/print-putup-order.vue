<template>
  <div v-loading.fullscreen.lock="fullscreenLoading" class="print-main printPutupOrder">
    <template v-if="productDetailsListDataSource.length > 0">
      <cs-print
        :print.sync="barPrint"
        :orientation="'p'"
        :interval="500"
        :format="'a4'"
      >
        <template v-slot:header>
          <div style="width: 297mm; height: 20px" />
        </template>
        <div class="pring-cont">
          <form-title
            :options="{
              title: '上架单',
              formStyle: {
                textAlign: 'center',
                display: 'block',
                lineHeight: '55px'
              }
            }"
          />
          <table class="info-table">
            <tr>
              <th style="width: 80px">上架单条码</th>
              <td style="width: 100px">
                <cs-barcode
                  :options="{
                    value: putStorageInfoFormDatas.shelfNo,
                    height: 40,
                    width: 1.2,
                    fontSize: 12,
                  }"
                  class="cs-code"
                />
              </td>
              <th style="width: 80px">上架件数</th>
              <td>
                {{ putStorageInfoFormDatas.upShelf }}
              </td>
              <th style="width: 100px">上架生成时间</th>
              <td>
                {{ this.$utils.parseTime(putStorageInfoFormDatas.createdTime) }}
              </td>
            </tr>
          </table>
          <div class="detail">
            <!-- 布类列表 -->
            <cs-custom-table
              v-if="putStorageInfoFormDatas.productType === 1"
              ref="putUpTable"
              class="put-up-table"
              tooltip-effect="dark"
              :columns="columnsCloth"
              :autoresize="false"
              :data-source="productDetailsListDataSource"
              :form-otions="formOtions"
            />
            <!-- 纱类列表 -->
            <cs-custom-table
              v-if="putStorageInfoFormDatas.productType === 2"
              ref="putUpTable"
              class="put-up-table"
              tooltip-effect="dark"
              :columns="columnsGauze"
              :autoresize="false"
              :data-source="productDetailsListDataSource"
              :form-otions="formOtions"
            />
          </div>
        </div>
        <template v-slot:footer>
          <div
            style="
              text-align: right;
              width: 120px;
              height: 30px;
              padding: 10px;
              font-size: 14px;
            "
          />
        </template>
      </cs-print>
      <div slot="footer" class="print-footer">
        <el-button type="primary" @click="barPrintHandle">打印</el-button>
        <el-button @click="comeBack()">返回</el-button>
      </div>
    </template>
  </div>
</template>
<script>
import { PublicWms } from '@/views/wms/public/index'
import FormTitle from '@/views/wms/public/components/formTitle'
import { PutupManage } from './components/index'
export default {
  components: { FormTitle },
  mixins: [PublicWms, PutupManage],
  data() {
    /* 布列表 */
    const columnsCloth = [
      {
        prop: 'serialNo',
        align: 'left',
        label: '条码号',
        minWidth: 110
      },
      {
        prop: 'materiel',
        align: 'left',
        label: '产品编号',
        minWidth: 110
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
        align: 'left',
        label: '缸号',
        minWidth: 120
      },
      {
        prop: '',
        align: 'left',
        label: '库位号',
        minWidth: 60
      }
    ]

    /* 纱列表 */
    const columnsGauze = [
      {
        prop: 'serialNo',
        align: 'left',
        label: '条码号',
        minWidth: 110
      },
      {
        prop: 'materiel',
        align: 'left',
        label: '产品编号',
        minWidth: 110
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
        align: 'left',
        label: '缸号',
        minWidth: 120
      },
      {
        prop: 'yarnCard',
        align: 'left',
        label: '纱牌/纱批',
        minWidth: 100
      },
      {
        prop: '',
        align: 'left',
        label: '库位号',
        minWidth: 60
      }
    ]

    return {
      shelfNo: '',
      barPrint: false,
      columnsCloth,
      columnsGauze,
      fullscreenLoading: false,
      productDetailsListDataSource: [],
      putStorageInfoFormDatas: {},
      formOtions: {
        inline: true,
        size: 'small'
      }
    }
  },
  created() {
    this.shelfNo = this.$route.query['shelfNo']
    /* 详情信息 */
    if (this.shelfNo) {
      this.getStockInShelfInfo({ shelfNo: this.shelfNo })
      this.getProductDetailsList({ shelfNo: this.shelfNo })
    }
  },
  methods: {
    barPrintHandle() {
      this.barPrint = true
    },
    comeBack() {
      this.$router.push('/wms/enter-manage/putup-manage')
    }
  }
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
}
.print-main {
  width: 210mm;
  margin: 20px auto 0;
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
.printPutupOrder .print-footer {
  background-color:transparent
}
.pring-cont {
  margin-top: 20px;
  padding: 10px;
  position: relative;
  overflow-y: visible !important;
  height: auto !important;
}
/deep/ .print-form-item input {
  border: none;
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
  margin-right: 36px;
  font-size: 14px;
}
.sign-bar-wrap .item .span,
.input {
  display: inline-block;
}
.sign-bar-wrap .item .input {
  outline: none;
  width: 88px;
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
</style>
<style lang="scss" scoped>
/deep/ .el-form-item__label-wrap .el-form-item__label,
/deep/ .take-order-class input[disabled='disabled'],
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
