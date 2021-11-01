<!--
 * @Author: xj
 * @Description: 参板信息数据
 * @Date: 2021-04-18 09:48:43
 * @LastEditors: Againss
 * @LastEditTime: 2021-07-12 14:24:13
-->
<template>
  <!-- 参板信息 -->
  <div class="order-item">
    <div class="header-top">
      <!-- <span :class="{ require: isEdit}">参板信息</span> -->
      <span>参板信息</span>
      <!--      <el-button v-if="isEdit" type="primary" size="mini" @click="addReferenceVersionInfo">新增</el-button>-->
    </div>
    <div class="page-table page-table-border" style="padding: 0 20px;">
      <cs-custom-table
        ref="versionData"
        tooltip-effect="light"
        :header-cell-style="headerCellStyle"
        :columns="versionColumns"
        :data-source="versionData"
        :pagination="pagination"
        edit-type="pop"
      />
      <div v-if="versionData&&versionData.length===0" style="border-bottom: 1px solid #eeeff0;margin: 10px;" />
    </div>
  </div>
</template>

<script>
import { PublicCustomer } from '@/views/customer-order/public/index'
export default {
  name: 'References',
  mixins: [PublicCustomer],
  props: {
    isEdit: {
      type: Boolean
    },
    data: {
      type: [Object, Array]
    },
    syncMoudleDataHandle: {
      type: Function
    },
    setParentDataHandle: {
      type: Function
    },
    rule: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    // table表头颜色
    const headerCellStyle = {
      'background': '#F5F7FA'
    }
    // 参板信息
    const versionColumns = {
      _referenceOrder: {
        prop: 'referenceOrder',
        label: '参考单号',
        formater: (scope) => {
          if (scope.row.referenceOrder && scope.row.referenceOrder.label) {
            return scope.row.referenceOrder.label
          }
        }
      },
      _greyClothCode: {
        prop: 'greyClothCode',
        label: '色布/印花布编码',
        minWidth: '160',
        showOverflowTooltip: true
      },
      _referenceContent: {
        prop: 'referenceContent',
        label: '参考内容',
        showOverflowTooltip: true,
        formater: (scope) => {
          if (scope.row.referenceContent && scope.row.referenceContent.label) {
            return scope.row.referenceContent.label
          }
        }
      },
      _remark: {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true
      }
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getListData({ pageSize: this.pagination.pageSize || 20, page: val })
      },
      sizeChange: val => {
        this.getListData({ page: this.pagination.page || 1, pageSize: val })
      }
    }
    return {
      loading: false,
      currentAction: '', // 标识 是从新增按钮 还是从编辑进入  add: 新增
      versionData: [],
      versionColumns,
      formDatas: {},
      formOptions: {
        size: 'small',
        inline: true
        // disabled: true
      },
      headerCellStyle,
      pagination
    }
  },
  watch: {
    data: {
      handler(v) {
        if (v) {
          this.versionData = []
          this.versionData = v
        }
      },
      deep: true,
      immediate: true
    },
    rule: {
      handler(v) {

      },
      deep: true
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.order-item {
  background: #ffffff;
  .header-top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 15px 20px;

    .require::before {
      content: '*';
      color: #ff4444;
    }
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
  .page-table-border{
    /deep/tbody .el-table__row td{
      border-bottom-width: 1px!important;
    }
  }

}
</style>

<style lang="scss">
.order-item {
  .printPic {
    width: 36px;
    height: 36px;
  }
}
.material-datainfo {
  .el-form-item--small.el-form-item{
    margin-bottom: 0 !important;
  }
}
</style>
