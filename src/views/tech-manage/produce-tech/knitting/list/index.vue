<template>
  <div class="guest-sample-list knitting-list">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- tab切换 -->
    <div class="list-tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane name="1">
          <span slot="label" tabindex="1" class="labelIndex">{{ `全部(${totalNum.all || 0})` }}</span>
        </el-tab-pane>
        <el-tab-pane name="2">
          <span slot="label" tabindex="2" class="labelIndex">{{ `织造待处理(${totalNum.knitPending || 0})` }}</span>
        </el-tab-pane>
        <el-tab-pane name="3">
          <span slot="label" tabindex="3" class="labelIndex">{{ `织造待审核(${totalNum.knitWaitAudit || 0})` }}</span>
        </el-tab-pane>
        <el-tab-pane name="4">
          <span slot="label" tabindex="4" class="labelIndex">{{ `染整待处理(${totalNum.dyePending || 0})` }}</span>
        </el-tab-pane>
        <el-tab-pane name="5">
          <span slot="label" tabindex="5" class="labelIndex">{{ `染整待审核(${totalNum.dyeWaitAudit || 0})` }}</span>
        </el-tab-pane>
        <el-tab-pane name="6">
          <span slot="label" tabindex="6" class="labelIndex">{{ `已审核(${totalNum.audited || 0})` }}</span>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 列表 -->
    <div class="page-table">
      <cs-custom-table
        ref="tableList"
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        edit-type="pop"
        @sort-change="changeSort"
      />
    </div>
  </div>
</template>

<script>
import { pageList, pageCount } from './api/index.js'
export default {
  data() {
    const pickerOptions = {
      shortcuts: [
        {
          text: '今天',
          onClick(picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
            const start = new Date(new Date(new Date().toLocaleDateString()).getTime())
            start.setTime(start.getTime())
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '昨天',
          onClick(picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
            const start = new Date(new Date(new Date().toLocaleDateString()).getTime())
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '7天内',
          onClick(picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
            const start = new Date(new Date(new Date().toLocaleDateString()).getTime())
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '14天内',
          onClick(picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
            const start = new Date(new Date(new Date().toLocaleDateString()).getTime())
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 13)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '30天内',
          onClick(picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
            const start = new Date(new Date(new Date().toLocaleDateString()).getTime())
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '60天内',
          onClick(picker) {
            const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
            const start = new Date(new Date(new Date().toLocaleDateString()).getTime())
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 60)
            picker.$emit('pick', [start, end])
          }
        }
      ],
      disabledDate(time) {
        return time.getTime() > new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59).getTime() || time.getTime() < Date.now() - 3600 * 1000 * 24 * 91
      }
    }
    // 查询
    const searchData = [
      {
        prop: 'orderNo',
        itemType: 'input',
        label: '订单号',
        itemStyle: { width: '30%' },
        clearable: true,
        placeholder: '请输入内容'
      },

      {
        prop: 'orderType',
        itemType: 'select',
        label: '订单类型',
        itemStyle: { width: '30%' },
        dataSource: [
          {
            value: 'B',
            label: '大货'
          },
          {
            value: 'S',
            label: '样板'
          },
          {
            value: 'R',
            label: '备坯'
          },
          {
            value: 'C',
            label: '补布'
          }
        ]
      },

      {
        itemStyle: { width: '30%' },
        itemType: 'date',
        prop: 'approveTimeStart',
        label: '审单时间',
        placeholder: '请选择',
        type: 'daterange',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        pickerOptions: pickerOptions,
        defaultTime: ['00:00:00', '23:59:59'],
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间'
      },
      {
        prop: 'salesTeamName',
        itemType: 'input',
        label: '销售团队',
        itemStyle: { width: '30%' },
        clearable: true,
        placeholder: '请输入内容'
      },
      {
        prop: 'customerServiceName',
        itemType: 'input',
        label: '客服',
        itemStyle: { width: '30%' },
        clearable: true,
        placeholder: '请输入内容'
      },
      // {
      //   prop: 'techerName',
      //   itemType: 'input',
      //   label: '工艺员',
      //   itemStyle: { width: '25%' },
      //   clearable: true,
      //   placeholder: '请输入内容'
      // },
      // {
      //   itemStyle: { width: '25%' },
      //   itemType: 'date',
      //   prop: 'updatedTimeStart',
      //   label: '操作时间',
      //   placeholder: '请选择',
      //   type: 'daterange',
      //   format: 'yyyy-MM-dd',
      //   valueFormat: 'timestamp',
      //   pickerOptions: pickerOptions,
      //   defaultTime: ['00:00:00', '23:59:59'],
      //   startPlaceholder: '开始时间',
      //   endPlaceholder: '结束时间'
      // },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          this.formDatas = params
          this.formDatas.status = this.activeName
          const approveTimeStart = params.approveTimeStart && params.approveTimeStart[0] ? this.$filters.parseTime(params.approveTimeStart[0], '{y}-{m}-{d} {h}:{i}:{s}') : ''
          const approveTimeEnd = params.approveTimeStart && params.approveTimeStart[1] ? this.$filters.parseTime(params.approveTimeStart[1], '{y}-{m}-{d} {h}:{i}:{s}') : ''
          const updatedTimeStart = params.updatedTimeStart && params.updatedTimeStart[0] ? this.$filters.parseTime(params.updatedTimeStart[0], '{y}-{m}-{d} {h}:{i}:{s}') : ''
          const updatedTimeEnd = params.updatedTimeStart && params.updatedTimeStart[1] ? this.$filters.parseTime(params.updatedTimeStart[1], '{y}-{m}-{d} {h}:{i}:{s}') : ''
          this.searchFormDatas = { approveTimeStart, approveTimeEnd, updatedTimeStart, updatedTimeEnd }
          this.getPageList()
        },
        resetHandle: () => {
          this.searchFormDatas = {}
          this.formDatas = {}
          this.formDatas.sorts = []// 自定义表格内排序
          this.formDatas.status = this.activeName// 自定义表格内排序
          this.$refs.tableList.$refs.table.clearSort()
        }
      }
    ]
    const columns = [
      {
        prop: 'code',
        label: '序号',
        minWidth: '50'
      },
      {
        prop: 'orderNo',
        label: '订单号',
        minWidth: '140',
        showOverflowTooltip: true,
        permitTag: ['techManage:tmKnitTech:page'],
        handle: (scope) => {
          this.$router.push(`./detail/${scope.row.uuid}`)
          localStorage.setItem('orderInfo', JSON.stringify(scope.row))
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'orderType',
        label: '订单类型',
        showOverflowTooltip: true,
        minWidth: '80',
        formater: (scope) => {
          const type = {
            'B': '大货',
            'S': '样板',
            'R': '备坯',
            'C': '补布'
          }
          return type[scope.row.orderType]
        }
      },
      {
        prop: 'salesTeamName',
        label: '销售团队',
        minWidth: '100',
        showOverflowTooltip: true
      },
      {
        prop: 'customerServiceName',
        label: '客服',
        showOverflowTooltip: true,
        minWidth: '100'
      },
      {
        prop: 'approveTime',
        label: '审单时间',
        minWidth: '120',
        sortable: 'custom',
        formater: (scope) => {
          return scope.row.approveTime ? this.$filters.parseTime(
            scope.row.approveTime,
            '{y}-{m}-{d} {h}:{i}'
          ) : ''
        }
      },
      // {
      //   prop: 'techerName',
      //   label: '工艺员',
      //   showOverflowTooltip: true,
      //   minWidth: '120'
      // },
      // {
      //   prop: 'updatedTime',
      //   label: '操作时间',
      //   minWidth: '120',
      //   sortable: 'custom',
      //   formater: (scope) => {
      //     return scope.row.updatedTime ? this.$filters.parseTime(
      //       scope.row.updatedTime,
      //       '{y}-{m}-{d} {h}:{i}'
      //     ) : ''
      //   }
      // },
      {
        prop: 'status',
        label: '织造工艺',
        width: '120',
        fixed: 'right',
        // style: { cursor: 'pointer' },
        formater: (scope) => {
          return this.getStatus(scope.row.status)
        }

      },
      {
        prop: 'dyeStatus',
        label: '染整工艺',
        width: '120',
        fixed: 'right',
        formater: (scope) => {
          if (scope.row.orderType && scope.row.orderType === 'R') {
            return '-'
          }
          return this.getStatus(scope.row.dyeStatus)
        }

      }
    ]

    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.formDatas.pageSize = this.pagination.pageSize || 20
        this.formDatas.pageNum = val
        this.getPageList()
      },
      sizeChange: val => {
        this.formDatas.pageSize = val
        this.formDatas.pageNum = this.pagination.pageNum || 1
        this.getPageList()
      }
    }

    return {
      columnId: '',
      optionStatus: '',
      searchData,
      formOtions: {
        size: 'small',
        layout: true,
        inline: true,
        labelWidth: '100px'
      },
      searchFormDatas: {},
      formDatas: {
        status: '2',
        sorts: ['-approveTime']// 自定义表格内排序
      },
      activeName: '2',
      totalNum: {},
      columns,
      allColumns: [],
      dataSource: [],
      pagination,
      userData: []

    }
  },
  created() {
    this.getPageList()
  },
  methods: {
    // 点击整行查看详情页列表
    // rowclick(scope) {
    //   this.$router.push(`./detail/${scope.id}`)
    //   localStorage.setItem('orderInfo', JSON.stringify(scope))
    // },
    // 处理状态数据
    getStatus(data) {
      let status = ''
      switch (data) {
        case 'W':
          status = `<span style="color:#FF9214">待处理</span>`
          break
        case 'P':
          status = `<span style="color:#FF9214">待提交</span>`
          break
        case 'A':
          status = `<span style="color:#FF9214">待审核</span>`
          break
        case 'Y':
          status = `<span style="color:#00BCC5">已审核</span>`
          break
        case 'B':
          status = `<span style="color:#888E9E">已驳回</span>`
          break
        default:
          status = ''
          break
      }
      return status
    },

    // 排序点击事件
    changeSort(e) {
      this.formDatas.sorts = []
      if (e.prop === 'approveTime') {
        if (e.order === 'ascending') {
          this.formDatas.sorts.push('approveTime')
        } else if (e.order === 'descending') {
          this.formDatas.sorts.push('-approveTime')
        } else {
          this.formDatas.sorts = []
        }
      } else {
        if (e.order === 'ascending') {
          this.formDatas.sorts.push('updatedTime')
        } else if (e.order === 'descending') {
          this.formDatas.sorts.push('-updatedTime')
        } else {
          this.formDatas.sorts = []
        }
      }
      this.getPageList()
    },
    handleClick(e) {
      this.formDatas.sorts = ['-approveTime']
      this.formDatas.status = e.name
      this.activeName = e.name
      this.formDatas.pageSize = 20
      this.formDatas.pageNum = 1
      this.getPageList()
    },
    async getPageCount(data = {}) {
      // 针织工艺分页查询数量统计
      const count = await pageCount({
        pageSize: this.pagination.pageSize || 20,
        pageNum: this.pagination.page || 1,
        ...data
      })
      this.totalNum = count.data
    },
    // 列表数据
    async getPageList(data = {}) {
      const res = await pageList({ ...this.formDatas, ...this.searchFormDatas })
      res.data.list && res.data.list.map((item, index) => { item.code = (res.data.pageNum - 1) * res.data.pageSize + index + 1 })
      const listData = res.data ? res.data.list : []
      this.dataSource = listData || []
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize,
        page: res.data.pageNum
      }
      this.getPageCount({ ...this.formDatas, ...this.searchFormDatas })
    }

  }
}
</script>

<style lang='scss' scoped>
// .guest-sample {
//   padding: 20px;
//   padding-bottom: 0;
// }
  .guest-sample-list{
    padding: 20px;
    .search{
      padding-left: 0px;
    }
  }
  .list-tabs{
    padding-bottom: 1px;
    background: #fff;
    /deep/.el-tabs__nav .el-tabs__item {
      padding: 0 26px;
      height: 60px;
      line-height: 60px;
    }
    .labelIndex{
      padding: 0 10px;
      border: 0 none;
      outline: none;
    }
  }
  /deep/ .el-tabs__header {
  margin: 0;
  .el-tabs__item {
    font-weight: 400;
  }
}
/deep/ .el-tabs__nav-wrap::after {
  height: 1px;
  background-color: #d0d6da;
}
.standce{
  margin-right: 8.33% !important;
}
// /deep/ .page-table .el-table__row td{
//   padding: 8px 0;
// }

</style>
<style lang="scss">
.knitting-list /deep/ .el-picker-panel__shortcut{
    line-height: 40px;
  }
</style>
