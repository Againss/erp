<template>
  <div class="general-yarn-purchase-request-details">
    <!-- 抽纱列表搜索 -->
    <div class="form-title">申请单信息</div>
    <div class="search applicationFormInformation">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <div class="table-title">明细:</div>
    <!-- 列表 -->
    <div class="pop-table details-table">
      <cs-custom-table
        :header-cell-style="headerCellStyle"
        tooltip-effect="dark"
        :columns="columns"
        :table-scrollx="true"
        :data-source="dataSource"
      />
    </div>
  </div>
</template>

<script>
import { purchaseGeneralYarnInfo } from './api/index.js'
export default {
  data() {
    const searchData = {
      // '_orderNo': {
      //   prop: 'orderNo',
      //   itemType: 'itemview',
      //   label: '申请单信息',
      //   itemStyle: { width: '100%' },
      //   placeholder: '请输入',
      //   renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
      //     return '申请单信息:'
      //   }
      // },
      '_applicationCode': {
        prop: 'applicationCode',
        itemType: 'itemview',
        label: '申请单号:',
        itemStyle: { width: '25%' },
        placeholder: '请输入'
      },
      '_applicationTime': {
        prop: 'applicationTime',
        itemType: 'itemview',
        label: '申请时间:',
        itemStyle: { width: '25%' },
        placeholder: '请输入',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? this.$filters.parseTime(value, '{y}-{m}-{d} {h}:{i}') : '-'
        }
      },
      '_applicant': {
        prop: 'applicant',
        itemType: 'itemview',
        label: '申请人:',
        itemStyle: { width: '25%' },
        placeholder: '请输入'
      },
      '_purchaseAmount': {
        prop: 'purchaseAmount',
        itemType: 'itemview',
        label: '采购总数量(KG):',
        itemStyle: { width: '25%' },
        placeholder: '请输入',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? value + 'kg' : '-'
        }
      },
      '_status': {
        prop: 'status',
        itemType: 'itemview',
        label: '状态:',
        itemStyle: { width: '25%' },
        placeholder: '请输入',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return '已下发采购'
        }
      },
      '_purchaseDelivery': {
        prop: 'purchaseDelivery',
        itemType: 'itemview',
        label: '采购交期:',
        itemStyle: { width: '25%' },
        placeholder: '请输入',
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? this.$filters.parseTime(value, '{y}-{m}-{d}') : '-'
        }
      }
    }

    const columns = {
      '_id': {
        prop: 'id',
        label: '序号',
        width: '60',
        formater: (scope) => {
          // return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
          return scope.$index + 1
        }
      },
      '_yarnCode': {
        prop: 'yarnCode',
        label: '纱线编码',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_yarnName': {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '120',
        showOverflowTooltip: true
      },
      '_yarnAttributes': {
        prop: 'yarnAttributes',
        label: '纱属性',
        minWidth: '100',
        showOverflowTooltip: true
      },
      '_purchaseAmount': {
        prop: 'purchaseAmount',
        label: '采购数量(KG)',
        align: 'right',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.purchaseAmount ? (+scope.row.purchaseAmount).toFixed(2) : '-'
        }
      }
    }
    return {
      searchData,
      formOtions: { inline: true, size: 'small' },
      formDatas: {},

      headerCellStyle: { 'background-color': '#F5F7FA', 'padding': '10px 0' },
      columns,
      dataSource: []
    }
  },
  computed: {
    detailsId() {
      return this.$route.query.id
    }
  },
  created() {
    this.purchaseGeneralYarnInfo()
  },
  methods: {
    async purchaseGeneralYarnInfo(data = {}) {
      const res = await purchaseGeneralYarnInfo({ id: this.detailsId, ...data })
      const dataList = res.data || {}
      this.formDatas = dataList
      this.dataSource = dataList.detailList || []
    }
  }
}
</script>

<style lang="scss">
  .general-yarn-purchase-request-details {
    padding: 20px;

    .form-title, .table-title {
      font-size: 16px;
      padding: 20px 20px 15px;
      background-color: #fff;
    }
    .form-title {
      border-bottom: 1px solid #EEEFF0;
    }

    .applicationFormInformation {
      .custom-form .el-form .el-form-item {
        margin-bottom: 8px;
      margin-right: 0;
      }
      .el-form-item__content {
        color: #474747;
      }
      .el-form-item__label-wrap label {
        color: #888E9E;
      }
    }

    .details-table {
      padding: 0 10px 10px;
    }
  }
</style>
