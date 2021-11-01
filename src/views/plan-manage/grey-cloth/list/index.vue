<template>
  <div class="grey-cloth-container">
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
          :label="`${item.label}(${item.count})`"
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
import { grayclothPage, grayclothCount, grayclothCheck } from './api/index.js'
export default {
  data() {
    const searchData = [
      {
        prop: 'orderNo',
        itemType: 'input',
        label: '订单号:',
        itemStyle: { width: '25%' },
        placeholder: '请输入订单号',
        clearable: true
      },
      {
        prop: 'greyClothCode',
        itemType: 'input',
        label: '坯布编码:',
        placeholder: '请输入坯布编码',
        itemStyle: { width: '25%' },
        clearable: true
      },
      {
        prop: 'clothType',
        itemType: 'input',
        label: '布类:',
        placeholder: '请输入布类',
        itemStyle: { width: '25%' },
        clearable: true
      },
      {
        prop: 'salesTeamName',
        itemType: 'input',
        label: '销售团队:',
        itemStyle: { width: '25%' },
        placeholder: '请输入销售团队',
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
        itemStyle: { width: '25%' },
        itemType: 'date',
        prop: 'orderDate',
        label: '订单交期',
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
            this.formDatas.orderStartDelivery = this.formDatas.orderDate[0]
            this.formDatas.orderEndDelivery = this.formDatas.orderDate[1]
          } else {
            this.formDatas.orderStartDelivery = ''
            this.formDatas.orderEndDelivery = ''
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
        prop: 'code',
        label: '序号',
        minWidth: '50'
      },
      {
        prop: 'orderNo',
        label: '订单号',
        minWidth: '160',
        showOverflowTooltip: true
      },
      {
        prop: 'greyClothCode',
        label: '坯布编码',
        minWidth: '160',
        showOverflowTooltip: true
      },

      {
        prop: 'clothType',
        label: '布类',
        minWidth: '100',
        showOverflowTooltip: true
      },

      {
        prop: 'customerName',
        label: '客户',
        minWidth: '80',
        showOverflowTooltip: true
      },

      {
        prop: 'orderNum',
        label: '订单数量(KG)',
        minWidth: '120',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          if (!scope.row.orderNum && scope.row.orderNum !== 0) {
            return '-'
          } else {
            return !isNaN(scope.row.orderNum) ? Number(scope.row.orderNum).toFixed(2) : ''
          }
        }
      },

      {
        prop: 'greyClothNum',
        label: '坯布数量(KG)',
        minWidth: '120',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          if (!scope.row.greyClothNum && scope.row.greyClothNum !== 0) {
            return '-'
          } else {
            return !isNaN(scope.row.greyClothNum) ? Number(scope.row.greyClothNum).toFixed(2) : ''
          }
        }
      },

      {
        prop: 'delivery',
        label: '订单交期',
        minWidth: '100',
        formater: scope => {
          return this.$filters.parseTime(scope.row.delivery || 0, '{y}-{m}-{d}')
        }
      },

      {
        prop: 'salesTeamName',
        label: '销售团队',
        minWidth: '100',
        showOverflowTooltip: true
      },
      {
        prop: 'updatedBy',
        label: '处理人',
        minWidth: '80',
        showOverflowTooltip: true,
        isShow: scope => {
          return this.activeIdx === '1'
        }
      },
      {
        prop: 'updatedTime',
        label: '处理时间',
        minWidth: '100',
        isShow: scope => {
          return this.activeIdx === '1'
        },
        formater: scope => {
          return this.$filters.parseTime(
            scope.row.updatedTime || 0,
            '{y}-{m}-{d}'
          )
        }
      }
    ]

    // const copyContent = [...commonContent]
    let popOperatesDataSource = [
      {
        label: '抽坯布',
        permitTag: ['aps:grayclothreduce:save'],
        isShow: scope => {
          return scope.row.deductionStatus === '0'
        },
        handle: scope => {
          this.$router.push({
            path: './detail',
            query: { id: scope.row.id, showType: 'edit' }
          })
        }
      },
      {
        label: '查看',
        permitTag: ['aps:grayclothreduce:info'],
        isShow: scope => {
          return scope.row.deductionStatus === '1'
        },
        handle: scope => {
          this.$router.push({
            path: './detail',
            query: { id: scope.row.id, showType: 'preview' }
          })
        }
      },
      {
        label: '重新抽坯',
        permitTag: ['aps:grayclothreduce:redo'],
        isShow: scope => {
          return scope.row.deductionStatus === '1'
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
        this.initData({
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: val => {
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
        enabled: ''
      },
      searchData,
      columns,
      popOperates,
      pagination,
      dataSource: [],
      // 待抽坯 0：已抽坯
      status: {
        '0': {
          value: '0',
          label: '待抽坯',
          count: 0
        },
        '1': {
          value: '1',
          label: '已抽坯',
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
      data.deductionStatus = this.activeIdx
      const res = await grayclothPage({ ...this.searchFormDatas, ...data })
      res.data.list &&
        res.data.list.map((item, index) => {
          item.code = (res.data.pageNum - 1) * res.data.pageSize + index + 1
        })

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
      this.getPageCount(data)
    },
    // 分页查询数量统计
    async getPageCount(data = {}) {
      data.pageSize = 20
      data.pageNum = 1
      const res = await grayclothCount({
        // ...this.searchFormDatas,
        ...data
      })
      const countInfo = res.data || {}
      this.status[0].count = countInfo['unNum'] || 0
      this.status[1].count = countInfo['completeNum'] || 0
    },
    // 检查是否能编辑、重新抽坯
    async isCheck(scope) {
      console.log(scope)
      const res = await grayclothCheck({ id: scope.row.id })
      if (res.data) {
        this.$router.push({
          path: './detail',
          query: { id: scope.row.id, showType: 'edit' }
        })
      } else {
        this.$message.warning('已有下游单据不可重新抽坯')
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
.grey-cloth-container {
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
}
</style>
