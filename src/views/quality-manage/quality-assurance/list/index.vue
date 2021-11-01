<template>
  <div class="guest-sample-list knitting-list">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- tab切换 -->
    <div class="list-tabs">
      <el-tabs
        v-model="activeIdx"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="(item, i) in statusArr"
          :key="i"
          :label="`${item.label}(${item.count})`"
          :name="item.value"
        />
      </el-tabs>
      <el-button v-if="$permission(['qa:qaYarnInspectionTesting:add'])" type="primary" size="small" style="margin-left: auto;" @click="handleAdd">新增</el-button>
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
    // 查询
    const searchData = [
      {
        prop: 'yarnUuid',
        itemType: 'input',
        label: '试纱编号',
        clearable: true,
        placeholder: '请输入内容'
      },

      {
        prop: 'yarnName',
        itemType: 'input',
        label: '纱名',
        clearable: true,
        placeholder: '请输入内容'

      },
      // {
      //   prop: 'salesTeamName',
      //   itemType: 'input',
      //   label: '纺纱方法',
      //   clearable: true,
      //   placeholder: '请输入内容'
      // },
      {
        prop: 'yarnBatch',
        itemType: 'input',
        label: '纱牌/纱批',
        clearable: true,
        placeholder: '请输入内容'
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          this.formDatas = params
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
        // prop: 'salesTeamName',
        prop: 'yarnUuid',
        label: '试纱编号',
        minWidth: '140',
        showOverflowTooltip: true,
        permitTag: ['techManage:tmKnitTech:page'],
        handle: (scope) => {
          this.$router.push(`./detail?id=${scope.row.yarnUuid}&show=detail`)
          localStorage.setItem('orderInfo', JSON.stringify(scope.row))
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'yarnCountName',
        label: '纱名',
        showOverflowTooltip: true,
        minWidth: '300',
        formater: (scope) => {
          return scope.row.inspection ? scope.row.inspection.yarnCountName + ' ' +
          scope.row.inspection.ingredientsName +
          scope.row.inspection.proportion + ' ' +
          scope.row.inspection.yarnTypeName + ' ' +
          scope.row.inspection.cardingMethodName + ' ' +
          scope.row.inspection.spinningMethodName : ''
        }
      },
      {
        prop: 'yarnBatch',
        label: '纱牌/纱批',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => scope.row.inspection.yarnBatch
      },
      // {
      //   prop: 'spinningMethodName',
      //   label: '纺纱方法',
      //   minWidth: '120',
      //   showOverflowTooltip: true,
      //   formater: scope => scope.row.inspection.spinningMethodName
      // },
      // {
      //   prop: 'cardingMethodName',
      //   label: '梳棉方法',
      //   showOverflowTooltip: true,
      //   minWidth: '120',
      //   formater: scope => scope.row.inspection.cardingMethodName
      // },

      {
        prop: 'productStatusName',
        label: '供应商',
        showOverflowTooltip: true,
        minWidth: '120',
        formater: scope => scope.row.inspection.supplierName
      },
      {
        prop: 'skuId',
        label: '产品编号',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => scope.row.inspection.skuId
      },
      {
        prop: 'productStatusName',
        label: '生产状态',
        width: '120'
        // fixed: 'right'
        // style: { cursor: 'pointer' },
        // formater: (scope) => {
        //   return this.getStatus(scope.row)
        // }
      },
      {
        prop: 'createdByName',
        label: '申请人',
        showOverflowTooltip: true,
        minWidth: '120'
      },
      {
        prop: 'createdTime',
        label: '申请时间',
        sortable: 'custom',
        showOverflowTooltip: true,
        width: '140',
        formater: (scope) => {
          return scope.row.createdTime ? this.$filters.parseTime(
            scope.row.createdTime,
            '{y}-{m}-{d} {h}:{i}'
          ) : ''
        }
      },
      {
        prop: 'processedByName',
        label: '处理人',
        showOverflowTooltip: true,
        minWidth: '120'
      },
      {
        prop: 'processedTime',
        label: '处理时间',
        sortable: 'custom',
        showOverflowTooltip: true,
        width: '140',
        formater: (scope) => {
          return scope.row.processedTime ? this.$filters.parseTime(
            scope.row.processedTime,
            '{y}-{m}-{d} {h}:{i}'
          ) : ''
        }
      },
      {
        prop: 'reviewUserName',
        label: '审核人',
        showOverflowTooltip: true,
        minWidth: '120'
      },
      {
        prop: 'reviewTime',
        label: '审核时间',
        sortable: 'custom',
        showOverflowTooltip: true,
        width: '140',
        formater: (scope) => {
          return scope.row.reviewTime ? this.$filters.parseTime(
            scope.row.reviewTime,
            '{y}-{m}-{d} {h}:{i}'
          ) : ''
        }
      },
      {
        prop: 'status',
        label: '状态',
        width: '100',
        fixed: 'right',
        // style: { cursor: 'pointer' },
        formater: (scope) => {
          return this.getStatus(scope.row.status + '')
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
        inline: true
      },
      searchFormDatas: {},
      formDatas: {
        status: ''
      },
      activeIdx: '-1',
      totalNum: {},
      totalNumAll: 0,
      columns,
      allColumns: [],
      dataSource: [],
      pagination,
      userData: [],
      // 状态 0：待提交，1：待处理，2：处理中，3：已处理
      status: {
        '-1': {
          value: '-1',
          label: '全部',
          count: 0
        },
        '0': {
          value: '0',
          label: '待提交',
          color: '#00BCC5',
          count: 0
        },
        '1': {
          value: '1',
          label: '进行中',
          color: '#FF9B02',
          count: 0
        },
        '2': {
          value: '2',
          label: '待审核',
          color: 'blue',
          count: 0
        },
        '3': {
          value: '3',
          label: '已处理',
          color: 'yellow',
          count: 0
        }
      }
    }
  },
  computed: {
    statusArr() {
      const res = []
      for (const key in this.status) {
        res.push(this.status[key])
      }
      return res.sort((a, b) => { return a.value - b.value })
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
    // 点击新增
    handleAdd() {
      this.$router.push(`./detail?show=edit`)
    },
    // 处理状态数据
    getStatus(data) {
      let status = ''

      switch (data) {
        case '0':
          status = `<span style="color:#00BCC5">待提交</span>`
          break
        case '1':
          status = `<span style="color:#FF9B02">进行中</span>`
          break
        case '2':
          status = `<span style="color:#00BCC5">待审核</span>`
          break
        case '3':
          status = `<span style="color:#FF9B02">已处理</span>`
          break
        default:
          status = ''
          break
      }
      return status
    },

    // 排序点击事件
    changeSort(e) {
      delete this.formDatas.createdTime
      delete this.formDatas.applyTimeOrder
      delete this.formDatas.processedTimeOrder
      // 申请时间
      if (e.prop === 'createdTime') {
        if (e.order === 'ascending') {
          this.formDatas.applyTimeOrder = 0
        } else {
          this.formDatas.applyTimeOrder = 1
        }
      } else if (e.prop === 'processedTime') {
        // 处理时间
        if (e.order === 'ascending') {
          this.formDatas.processedTimeOrder = 0
        } else {
          this.formDatas.processedTimeOrder = 1
        }
      } else if (e.prop === 'reviewTime') {
        if (e.order === 'ascending') {
          this.formDatas.reviewTimeOrder = 0
        } else {
          this.formDatas.reviewTimeOrder = 1
        }
      }
      this.getPageList()
    },
    handleClick(e) {
      this.formDatas.status = e.name
      this.formDatas.pageSize = 20
      this.formDatas.pageNum = 1
      this.getPageList()
    },
    async getPageCount(data = {}) {
      // 分页查询数量统计
      const res = await pageCount({
        yarnName: this.formDatas.yarnName,
        yarnBatch: this.formDatas.yarnBatch,
        yarnUuid: this.formDatas.yarnUuid,
        pageSize: this.pagination.pageSize || 20,
        pageNum: this.pagination.page || 1
        // ...data
      })
      const countList = res.data || []
      let sum = 0
      countList.forEach(item => {
        sum += item.num
        this.status[item.status].count = item.num
      })
      this.status['-1'].count = sum
    },
    // 列表数据
    async getPageList(data = {}) {
      if (this.formDatas.status === '-1') {
        this.formDatas.status = ''
      }
      let res = await pageList({ ...this.formDatas, ...this.searchFormDatas })
      res = res.data || {}
      res.list && res.list.map((item, index) => { item.code = (res.pageNum - 1) * res.pageSize + index + 1 })
      this.dataSource = res.list || []
      this.pagination = {
        ...this.pagination,
        dataTotal: res.total,
        ...data,
        currentPage: res.pageNum,
        pageSize: res.pageSize,
        page: res.pageNum
      }
      this.getPageCount()
      // this.getPageCount({ ...this.formDatas, ...this.searchFormDatas })
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
      // padding-left: 0px;
    }
  }
  .list-tabs{
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
