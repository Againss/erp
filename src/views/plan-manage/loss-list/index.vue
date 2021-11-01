<!--
 * @name: 损耗列表
 * @description: 损耗列表
 * @author: panmr
 * @time: 2021-04-27 10:36:28
-->
<template>
  <div class="lossList">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <div class="tab-group">
      <el-tabs v-model="activeName" class="commonTabs" @tab-click="handleClick">
        <el-tab-pane :label="`待处理(${totalNum.unSolved || 0})`" name="0" />
        <el-tab-pane :label="`全部(${totalNum.all || 0})`" name="-1" />
      </el-tabs>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table :columns="columns" :data-source="dataSource" :operates="popOperates" lazy table-scrollx :pagination="pagination" edit-type="pop" />
    </div>
  </div>
</template>
<script>
import { page, count } from './api/index'
import logMethods from '@/views/product-center/mixin/log-methods'
import label from './label'

export default {
  name: 'LossList',
  components: {},
  mixins: [logMethods],
  data() {
    // 操作栏 和权限配置
    let popOperatesDataSource = [
      { label: '查看', permitTag: ['aps-center:loss:info'], isShow: true, handle: scope => this.$router.push({ path: `/plan-manage/loss-list/detail/${scope.row.id}/show` }) }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    return {
      formDatas: {},
      formOtions: { inline: true, size: 'small' },
      searchData: {
        orderNo: { prop: 'orderNo', itemType: 'input', label: `${label.orderNo}:`, placeholder: label.placeholder.orderNo, clearable: true },
        customerName: { prop: 'customerName', itemType: 'input', label: `${label.customerName}:`, placeholder: label.placeholder.customerName, clearable: true },
        timeRange: { prop: 'timeRange', itemType: 'date', type: 'daterange', startPlaceholder: '开始日期', endPlaceholder: '结束日期', format: 'yyyy-MM-dd',
          valueFormat: 'timestamp', defaultTime: ['00:00:00', '23:59:59'], label: `${label.timeRange}:`, placeholder: label.placeholder.timeRange },
        operate: { itemType: 'operate', submitText: '查询',
          submitHandle: params => {
            if (params.timeRange) {
              params.startTime = params.timeRange[0]
              params.endTime = params.timeRange[1]
            } else {
              params.startTime = null
              params.endTime = null
            }
            this.formDatas = params
            this.load(this.formDatas)
          },
          resetHandle: () => {
            this.formDatas = {}
          }
        }
      },
      // 表格表头的配置信息
      columns: [
        { prop: 'code', label: label.code, minWidth: '50', showOverflowTooltip: true },
        { prop: 'orderNo', label: label.orderNo, minWidth: '120', showOverflowTooltip: true,
          handle: (scope) => {
            this.$router.push(`/plan-manage/loss-list/detail/${scope.row.id}/show`)
          },
          style: {
            color: 'rgb(9, 134, 255)',
            cursor: 'pointer'
          }
        },
        { prop: 'orderTime', label: label.timeRange, minWidth: '130', showOverflowTooltip: true, formater: (scope) => {
          return scope.row.orderTime ? this.$filters.parseTime(scope.row.orderTime, '{y}-{m}-{d} {h}:{i}') : '-'
        } },
        { prop: 'customerName', label: label.customerName, minWidth: '150', showOverflowTooltip: true },
        { prop: 'orderNum', label: label.orderNum, minWidth: '100', showOverflowTooltip: true, align: 'right' },
        { prop: 'greyClothNum', label: label.greyClothNum, minWidth: '100', showOverflowTooltip: true, align: 'right' },
        { prop: 'orderStatus', label: label.orderStatus, minWidth: '80', showOverflowTooltip: true,
          formater: scope => {
            const status = scope.row[scope.column.property] === '0' ? '待处理' : '已审核'
            return `<span style="color: ${status === '待处理' ? '#FF9B02' : '#00BCC5'};">${status}</span>`
          }
        }
      ],
      // 分页配置信息
      pagination: {
        currentChange: val => this.load({ pageSize: this.pagination.pageSize || 20, pageNum: val }),
        sizeChange: val => this.load({ pageNum: this.pagination.page || 1, pageSize: val })
      },
      popOperates: { label: '操作', width: '100', fixed: 'right', dataSource: popOperatesDataSource },
      dataSource: [], // 表格数据源
      activeName: '0', // string 订单状态 0 待处理 1已审核 -1全部
      tabName: '0',
      totalNum: {
        unSolved: 0,
        all: 0
      }
    }
  },
  created() {
    this.load()
  },
  methods: {
    handleClick(tab) {
      if (this.activeName === this.tabName) { // 点击的是当前高亮的tab项，不执行任何操作
        return
      }
      this.tabName = tab.name
      this.load({ pageNum: 1, pageSize: 20 })
    },
    async loadCount(params) {
      const res = await count(params)
      if (res.code === 200) {
        this.totalNum = res.data
      } else {
        this.totalNum = { unSolved: 0, all: 0 }
      }
    },
    async loadPage(params) {
      const res = await page(params)
      if (res.code === 200) {
        this.dataSource = res.data.list && res.data.list.map((item, index) => ({ code: (res.data.pageNum - 1) * res.data.pageSize + index + 1, ...item })) || []
        this.pagination = { ...this.pagination, dataTotal: res.data.total, currentPage: res.data.pageNum, pageSize: res.data.pageSize }
      } else {
        this.dataSource = []
        this.pagination = { ...this.pagination, dataTotal: 0, ...params, currentPage: params.pageNum }
      }
    },
    // 获取列表数据
    async load(params = {}) {
      this.loadCount({ ...this.formDatas, orderStatus: this.activeName === '-1' ? '' : this.activeName, ...params })
      this.loadPage({ ...this.formDatas, orderStatus: this.activeName === '-1' ? '' : this.activeName, ...params })
      // 并发请求
      // Promise.all([page({ ...this.formDatas, orderStatus: this.activeName === '-1' ? '' : this.activeName, ...params }), count({ ...this.formDatas, orderStatus: this.activeName === '-1' ? '' : this.activeName, ...params })]).then((res = []) => {
      //   const [first = { code: 0, data: { list: [], pageNum: 1, pageSize: 20, total: 0 }}, second = { code: 0, data: { all: 0, unSolved: 0 }}] = res
      //   if (second.code === 200) {
      //     this.totalNum = second.data
      //   } else {
      //     this.totalNum = { unSolved: 0, all: 0 }
      //   }
      //   if (first.code === 200) {
      //     this.dataSource = first.data.list && first.data.list.map((item, index) => ({ code: (first.data.pageNum - 1) * first.data.pageSize + index + 1, ...item })) || []
      //     this.pagination = { ...this.pagination, dataTotal: first.data.total, currentPage: first.data.pageNum, pageSize: first.data.pageSize }
      //   } else {
      //     this.dataSource = []
      //     this.pagination = { ...this.pagination, dataTotal: 0, ...params, currentPage: params.pageNum }
      //   }
      // })

      // 并发请求
      // Promise.allSettled([page({ ...this.formDatas, orderStatus: this.activeName === '-1' ? '' : this.activeName, ...params }), count({ ...this.formDatas, orderStatus: this.activeName === '-1' ? '' : this.activeName, ...params })]).then((res = []) => {
      //   const [first = { status: 'fulfilled', value: { code: 0, data: { list: [], pageNum: 1, pageSize: 20, total: 0 }}}, second = { value: { code: 0, data: { all: 0, unSolved: 0 }}}] = res
      //   if (second.value && second.value.code === 200) {
      //     this.totalNum = second.value.data
      //   } else {
      //     this.totalNum = { unSolved: 0, all: 0 }
      //   }
      //   if (first.value && first.value.code === 200) {
      //     this.dataSource = first.value.data.list && first.value.data.list.map((item, index) => ({ code: (first.value.data.pageNum - 1) * first.value.data.pageSize + index + 1, ...item })) || []
      //     this.pagination = { ...this.pagination, dataTotal: first.value.data.total, currentPage: first.value.data.pageNum, pageSize: first.value.data.pageSize }
      //   } else {
      //     this.dataSource = []
      //     this.pagination = { ...this.pagination, dataTotal: 0, ...params, currentPage: params.pageNum }
      //   }
      // })
    }
  }
}
</script>

<style lang="scss">
.lossList {
  padding: 20px;
  padding-bottom: 0px;
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
  .commonTabs {
    background-color: #fff;
    padding: 5px 0 0;

    .el-tabs__nav-scroll {
      padding: 0 20px;
    }
    .el-tabs__item {
      line-height: 36px;
      font-size: 14px;
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
    .el-tabs__header {
      margin-bottom: 0;
    }
  }
  .tab-group {
    position: relative;
    padding-bottom: 1px;
    background: #fff;
    height: 58px;
    line-height: 58px;
    .right-button {
      position: absolute;
      right: 20px;
      top: 6px;
    }
  }
}
</style>
