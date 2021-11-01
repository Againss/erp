<!--
 * @Author: xj
 * @Description: 备纱数据分发及融合
 * @Date: 2021-04-26 16:34:20
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-05-18 16:12:01
 * @FilePath: e:\erpmu\erp2-tech-manage-v2.0.4\src\views\customer-order\yarn-preparation\detail\compoments\orderIndex.vue
-->
<template>
  <div ref="orderDetailCom" class="yarnPreparation-detail">
    <!-- 基本信息-->
    <baseInfo
      ref="baseInfoData"
      :rule="getrule"
      :status="status"
      :is-edit="isEdit"
      :is-copy="isCopy"
      :v-info="getvInfo"
      :data="baseInfoData"
      :total-quantity="totalQuantity"
      :sync-moudle-data-handle="syncMoudleDataHandle"
      :set-parent-data-handle="setParentDataHandle"
    />
    <div class="order-info">
      <div class="order-content">
        <!-- 颜色数量交期 :rule="getrule"-->
        <colorQuantityDelivery
          :status="status"
          :is-edit="isEdit"
          :max-mater="getmaxMater"
          :data="colorData"
          :sync-moudle-data-handle="syncMoudleDataHandle"
          :set-parent-data-handle="setParentDataHandle"
        />
      </div>
    </div>
  </div>
</template>

<script>
import baseInfo from './base-info'
import colorQuantityDelivery from './color-quantity-delivery'
export default {
  name: 'OrderIndex',
  components: {
    baseInfo, // 基本信息
    colorQuantityDelivery// 颜色数量交期
  },
  props: {
    isEdit: {
      type: Boolean
    },
    orderData: {
      type: Object
    },
    syncDataHandle: {
      type: Function
    },
    currentVersionChange: {
      type: Function
    },
    isCopy: {
      type: Boolean
    }
  },
  data() {
    return {
      freshData: {},
      rowIndex: 0,
      maxDetailSeq: 0,
      baseInfoData: {}, // 基础信息数据
      colorData: [], // 颜色数量交期数据
      status: '0', // 订单状态
      totalQuantity: 0
    }
  },
  computed: {
    getmaxMater() { // 外层表格的数据
      const op = this.orderData.baseInfo ? (this.orderData.baseInfo.maxMaterialInfoSeq ? this.orderData.baseInfo.maxMaterialInfoSeq : '0') : '0'
      return op
    },
    getrule() { // 基本信息的数字加密
      const op = this.orderData ? (this.orderData._rule ? this.orderData._rule : {}) : {}
      return op
    },
    getvInfo() { // 版本号
      return this.orderData.versionInfo ? this.orderData.versionInfo : []
    }

  },
  watch: {
    freshData: {
      handler(val, oldVal) {
        this.syncDataHandle('orderIndexData', val)
      },
      deep: true,
      immediate: true
    },
    orderData: {
      handler(val, oldVal) {
        const index = this.$route.query.rowIndex ? this.$route.query.rowIndex * 1 - 1 : 0
        this.setOrderData(val, index)// 设置页面数据
      },
      deep: true,
      immediate: true
    },
    isEdit: {
      handler(val, oldVal) {
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    setOrderData(obj, index = 0) { // 设置订单要求页签下所有模块数据
      this.freshData = this.$utils.deepClone(obj)
      if (obj.hasOwnProperty('baseInfo')) {
        this.baseInfoData = this.$utils.deepClone(obj.baseInfo)// 基础信息数
      }
      if (obj.materialInfo && obj.materialInfo.length) {
        // this.resetSeqCode(obj.materialInfo)
        this.status = obj.baseInfo.status
        this.colorData = this.$utils.deepClone(obj.materialInfo)
        if (obj.materialInfo[0].maxDetailSeq) {
          this.maxDetailSeq = obj.materialInfo[0].maxDetailSeq
        }
      }
    },
    setParentDataHandle(key, data) { // 同步右侧各个模块的部分字段数据
      this[key] = data
      if (key === 'currentVersion') {
        this.currentVersionChange(data)
      }
    },
    syncMoudleDataHandle(key, data) {
      this.$nextTick(() => {
        const com = this.$utils.deepClone(this.freshData)
        if (key === 'baseInfoData') { // 同步基本信息模块数据
          const pm = { ...com.baseInfo, ...data.baseInfo }
          this.freshData = { ...this.freshData, baseInfo: pm }
        } else if (key === 'colormaterialData') {
          com.materialInfo = data
          this.freshData = com
        }
      })
    },
    resetSeqCode(dataList) {
      let newNum = 0
      dataList.forEach((v, index) => {
        if (!v.orderId) {
          newNum += 1
          v.seq = this.maxDetailSeq + newNum
        }
        v.edit = this.isEdit
        v.code = index + 1
      })
    }
  }
}
</script>
<style lang="scss">
.yarnPreparation-detail {
  .table-item {
    background: #ffffff;
    margin: 20px 20px 0;
    margin-bottom: 20px;
    .header-top {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 20px 20px 15px 20px;
      span {
        font-size: 16px;
        display: flex;
        // font-weight: 500;
      }
      .el-button {
        display: flex;
        span {
          font-size: 14px;
        }
      }
    }
    .basic-top {
      border-bottom: 1px solid #eeeff0;
      margin-bottom: 20px;
    }
  }
  .el-input.is-disabled .el-input__inner {
    color: #666666;
  }
  .el-form--inline .el-form-item {
    margin-right: 0;
  }
  .detailClass .el-input__inner {
    padding: 0;
    border: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    background: #fff;
    font-size: 14px;
  }
  .detailClass .el-form-item {
    margin-bottom: 14px;
  }
  .editClass .el-form-item {
    margin-bottom: 20px;
  }
  .detailClass .el-input__icon {
    display: none;
  }
  .basic-data .el-input.is-disabled .el-input__suffix {
    display: none;
  }
  .basic-data {
    margin-top: 0;
    padding-bottom: 20px;
    .custom-form {
      margin: 0 20px;
    }
  }
  .order-info {
    display: flex;
    flex-direction: column;
    margin: 0 20px;
    .order-header {
      background: #ffffff;
      padding: 20px;
      border-bottom: 1px solid #eeeff0;
    }
    .order-content {
      display: flex;
      flex-direction: row;
      .info-left {
        width: 350px;
        display: flex;
        flex-direction: column;
        background: #ffffff;
        border-right: 1px solid #eeeff0;
        .top {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          padding: 15px;
        }
        .bottom {
          padding-left: 10px;
          .custom-form {
            margin: 0;
          }
        }
      }
      .info-right {
        display: flex;
        flex: 1;
        width: calc(100% - 350px);
        min-width: 880px;
        flex-direction: column;
        .top {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          .left {
            display: flex;
            span {
              font-size: 15px;
              color: #151222;
            }
          }
          .right {
            display: flex;
            .el-form-item {
              margin-bottom: 0;
            }
          }
        }
        .order-item {
          background: #ffffff;
          .header-top {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 20px 20px 15px 20px;
            span {
              font-size: 16px;
              display: flex;
              // font-weight: 500;
            }
            .el-button {
              display: flex;
              span {
                font-size: 14px;
              }
            }
            .left {
              display: flex;
              align-items: center;
              .title {
                margin-right: 40px;
              }
              .date-title {
                position: relative;
                .item-title::before {
                  display: block;
                  content: '*';
                  position: absolute;
                  left: -8px;
                  color: #ff4444;
                }
              }
            }
            .right {
              display: flex;
              align-items: center;
              .total {
                margin: 0 80px;
              }
            }
          }
          .page-table {
            height: auto;
            border-bottom-width: 1px;
          }
        }
        .product-item {
          .custom-form {
            margin: 0 20px;
          }
        }
      }
    }
  }
  .addButton {
    display: block;
    width: 60px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    border-radius: 3px;
    color: #ffffff;
    background: #1890ff;
    text-align: center;
    outline: none;
    margin: 0;
    cursor: pointer;
  }
  .titleView {
    width: 48%;
    font-size: 14px;
    font-weight: 600;
    display: inline-block;
    background: #f5f5f5;
    padding: 5px 0 5px 27px;
    margin-bottom: 20px;
    position: relative;
  }
  .titleView::before {
    display: block;
    content: '*';
    position: absolute;
    left: 15px;
    color: #ff4444;
  }
  .lableStyle::before {
    content: '*';
    margin-right: 4px;
    color: #ff4444;
  }
  .noLableStyle::before {
    display: none;
  }
  .noBefore::before {
    display: none;
  }
  .date-title {
    display: inline-block;
    .el-input--medium .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
  }
  .data-font {
    font-size: 14px !important;
    color: #606266;
  }
  .table .el-table .el-table__row.heightRow {
    cursor: pointer;
  }
  .table .el-table .el-table__row.current-row.heightRow {
    > td {
      color: #666;
      background-color: #d8eafd !important;
    }
  }
  .table tr:nth-child(even) {
    background: #ffffff;
  }
  .leftTableForm {
    .el-table--medium td {
      padding: 10px 0 0;
    }
    .el-table__body-wrapper .cell {
      padding: 12px 10px;
    }
    .el-table__header .ruleTip .cell::before {
      display: block;
      content: '*';
      position: absolute;
      left: 4px;
      color: #fe4949;
    }
  }
  .leftTableForm th.is-leaf {
    border-bottom: 1px solid #dfe6ec !important;
  }
  .detailClass {
    .el-input-group__append {
      background: #ffffff;
      border: 0;
    }
  }
  .cursorHandel {
    input {
      cursor: pointer;
    }
  }
  .printColorDesign {
    width: 36px;
    height: 36px;
  }
}

.page-table-border {
  tbody {
    color: #666;
    /deep/ .el-table__row td {
      border-bottom-width: 1px;
    }
  }
}
</style>

<style lang="scss" scoped>
/deep/ .quantity-delivery .el-form {
  display: flex;
  flex-wrap: wrap;
}
.versionClass {
  margin-left: 20px;
  width: 80px;
  display: flex;
}
</style>
