<template>
  <div class="preparing-yarn-container">
    <!-- 搜索页面 -->
    <div class="search islayoutForm">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
      />
    </div>
    <!-- tab切换 -->
    <div class="list-tabs">
      <el-tabs v-model="activeIdx" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, i) in statusArr"
          :key="i"
          :label="`${item.label}`"
          :name="item.value"
        />
      </el-tabs>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        :data-total="dataSource.length"
        edit-type="pop"
      />
    </div>
  </div>
</template>

<script>
import { yarnPlanPage, yarnPlanOrderAlter } from './api/index.js'
export default {
  data() {
    const searchData = [
      {
        prop: 'code',
        itemType: 'input',
        label: '订单号:',
        itemStyle: { width: '25%' },
        placeholder: '请输入订单号',
        clearable: true
      },
      {
        prop: 'customerName',
        itemType: 'input',
        label: '客户:',
        itemStyle: { width: '25%' },
        placeholder: '请输入客户名称',
        clearable: true
      },

      {
        prop: 'sellerTeamName',
        itemType: 'input',
        label: '销售团队:',
        itemStyle: { width: '25%' },
        placeholder: '请输入销售团队',
        clearable: true
      },
      {
        prop: 'customerServiceName',
        itemType: 'input',
        label: '客服:',
        itemStyle: { width: '25%' },
        placeholder: '请输入客服名称',
        clearable: true
      },
      {
        itemStyle: { width: '25%' },
        itemType: 'date',
        prop: 'orderDate',
        label: '创建日期',
        placeholder: '请选择',
        type: 'daterange',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59'],
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间'
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          this.searchFormDatas = params
          this.formDatas = params
          if (this.formDatas.orderDate) {
            this.formDatas.createStartTime = this.formDatas.orderDate[0]
            this.formDatas.createEndTime = this.formDatas.orderDate[1]
          } else {
            this.formDatas.createStartTime = ''
            this.formDatas.createEndTime = ''
          }

          console.log(params)
          this.initData(this.formDatas)
        },
        resetHandle: () => {
          // console.log('重置')
          this.formDatas = {}
          // this.formDatas.sorts = [] // 自定义表格内排序
          // this.$refs.tableList.$refs.table.clearSort()
        }
      }
    ]
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'index',
        label: '序号',
        minWidth: '50',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      {
        prop: 'code',
        label: '订单号',
        minWidth: '160',
        showOverflowTooltip: true
      },

      {
        prop: 'customerName',
        label: '客户',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.customer.label
        }
      },
      {
        prop: 'salesTeamName',
        label: '销售团队',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.sellerTeam.label
        }
      },
      {
        prop: 'customerServiceName',
        label: '客服',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.customerService.label
        }
      },
      {
        prop: 'totalQuantity',
        label: '需求数量(KG)',
        minWidth: '120',
        // itemStyle: { 'padding-right': '20px;' },
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          if (!scope.row.totalQuantity && scope.row.totalQuantity !== 0) {
            return '-'
          } else {
            return !isNaN(scope.row.totalQuantity) ? Number(scope.row.totalQuantity).toFixed(2) : ''
          }
        }
      },
      {
        prop: 'orderTime',
        label: '创建时间',
        minWidth: '140',
        isShow: scope => {
          return this.activeIdx === '0'
        },
        formater: (scope) => {
          return scope.row.orderTime ? this.$filters.parseTime(scope.row.orderTime, '{y}-{m}-{d} {h}:{i}') : '-'
        }
      },

      {
        prop: 'purchaseQty',
        label: '采购数量(KG)',
        minWidth: '120',
        align: 'right',
        showOverflowTooltip: true,
        isShow: scope => {
          return this.activeIdx === '1'
        },
        formater: (scope) => {
          if (!scope.row.purchaseQty && scope.row.purchaseQty !== 0) {
            return '-'
          } else {
            return !isNaN(scope.row.purchaseQty) ? Number(scope.row.purchaseQty).toFixed(2) : ''
          }
        }
      },

      {
        prop: 'confirmTime',
        label: '审核时间',
        minWidth: '140',
        isShow: scope => {
          return this.activeIdx === '1'
        },
        formater: (scope) => {
          return scope.row.confirmTime ? this.$filters.parseTime(scope.row.confirmTime, '{y}-{m}-{d} {h}:{i}') : '-'
        }
      },

      {
        prop: 'confirmUser',
        label: '审核人',
        minWidth: '80',
        showOverflowTooltip: true,
        isShow: scope => {
          return this.activeIdx === '1'
        },
        formater: (scope) => {
          return scope.row.confirmUser.label
        }
      },
      {
        prop: 'status',
        label: '状态',
        minWidth: '100',
        formater: scope => {
          return scope.row.status === 0
            ? `<span style="color: #FF9214;">${'待确认'}</span>`
            : `<span style="color: #00BCC5;">${'已确认'}</span>`
        }
      }
    ]

    // const copyContent = [...commonContent]
    let popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: ['aps-center:yarnPlanOrder:edit'],
        isShow: scope => {
          return this.activeIdx === '0'
        },
        handle: scope => {
          // console.log(this)
          // debugger
          this.$router.push({ name: 'preparing-yarn-single-plans-detail', query: { id: scope.row.code + '-' + scope.row.version, type: 'edit' }})
        }
      },
      {
        label: '查看',
        permitTag: ['aps-center:yarnPlanOrder:info'],
        isShow: scope => {
          return this.activeIdx === '1'
        },
        handle: scope => {
          this.$router.push({ name: 'preparing-yarn-single-plans-detail', query: { id: scope.row.code + '-' + scope.row.version, type: 'detail' }})
        }
      },
      {
        label: '变更',
        permitTag: ['aps-center:yarnPlanOrder:alter'],
        isShow: scope => {
          return this.activeIdx === '1'
        },
        handle: scope => {
          this.isCheck(scope)
        }
      }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '150',
      fixed: 'right',
      dataSource: popOperatesDataSource
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        console.log(val)
        this.initData({
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: val => {
        console.log(val)
        this.initData({ pageNum: 1, pageSize: val })
      }
    }

    return {
      formOtions: {
        inline: true,
        size: 'small',
        layout: true
      },
      formDatas: {
      },
      searchData,
      columns,
      popOperates,
      pagination,
      dataSource: [],
      // 待确认 0：已确认
      status: {
        '0': {
          value: '0',
          label: '待确认',
          count: 0
        },
        '1': {
          value: '1',
          label: '已确认',
          color: '#00BCC5',
          count: 0
        }
      },
      activeIdx: '0'
    }
  },
  computed: {
    statusArr() {
      const res = []
      for (const key in this.status) {
        res.push(this.status[key])
      }
      return res.sort((a, b) => {
        return a.value - b.value
      })
    }
  },
  created() {
    this.initData()
  },
  methods: {
    // 标签切换
    handleClick(e) {
      // this.formDatas.status = e.name
      this.formDatas.pageSize = 20
      this.formDatas.pageNum = 1
      this.initData(this.formDatas)
    },
    // 列表查询
    async initData(data = {}) {
      data.pageNum = data.pageNum || 1
      data.status = parseInt(this.activeIdx)
      const res = await yarnPlanPage({ ...data })
      // res.data.list &&
      //   res.data.list.map((item, index) => {
      //     item.code = (res.data.pageNum - 1) * res.data.pageSize + index + 1
      //   })

      const listData = res.data.list ? res.data.list : []

      this.dataSource = listData || []

      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize,
        pageNum: res.data.pageNum
      }
    },

    // 检查是否能变更
    async isCheck(scope) {
      // this.$router.push({
      //   path: './detail',
      //   query: { id: scope.row.id, showType: 'edit' }
      // })
      const { code, version } = scope.row
      const res = await yarnPlanOrderAlter({ code, version })
      // const res = true
      if (res.data) {
        this.$router.push({ name: 'preparing-yarn-single-plans-detail', query: { id: scope.row.code + '-' + scope.row.version, type: 'edit' }})
      } else {
        this.$message.warning('已产生下游单据不可变更')
        // this.$message.error(res.message)
        return
      }
    },
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.preparing-yarn-container {
  position: relative;
  padding: 20px;
  padding-bottom: 0px;
  .list-tabs {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #d0d6da;
    padding-right: 20px;
    background: #fff;
    /deep/.el-tabs__nav .el-tabs__item {
      padding: 0 26px;
      height: 60px;
      line-height: 60px;
    }
  }
  /deep/ .el-tabs__header {
    margin: 0;
    .el-tabs__item {
      font-weight: 500;
    }
  }
  /deep/ .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: #d0d6da;
  }

  /deep/.el-table th.is-right {
    padding-right: 20px;
  }
  /deep/.el-table td.is-right .cell {
    padding-right: 30px;
  }
}
</style>
