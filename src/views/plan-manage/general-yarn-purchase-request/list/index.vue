<template>
  <div class="general-yarn-purchase-request-list">
    <!-- 抽纱列表搜索 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 列表 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :table-scrollx="true"
        :operates="operates"
        :data-source="dataSource"
        :pagination="pagination"
      />
    </div>
  </div>
</template>

<script>
import { purchaseGeneralYarnPage } from './api/index.js'
export default {
  data() {
    // 搜索时间配置
    const pickerOptions = {
      shortcuts: [
        {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }
      ]
      // disabledDate(time) {
      //   return time.getTime() > new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59).getTime() || time.getTime() < Date.now() - 3600 * 1000 * 24 * 91
      // }
    }
    const searchData = {
      '_applicationCode': {
        prop: 'applicationCode',
        itemType: 'input',
        label: '申请单号',
        itemStyle: { width: '25%' },
        placeholder: '请输入申请单号'
      },
      '_applicant': {
        prop: 'applicant',
        itemType: 'input',
        label: '申请人',
        itemStyle: { width: '25%' },
        placeholder: '请输入申请人'
      },
      // '_salesTeam': {
      //   prop: 'salesTeam',
      //   itemType: 'input',
      //   label: '销售团队',
      //   itemStyle: { width: '25%' },
      //   placeholder: '请输入'
      // },
      '_applicantDate': {
        itemType: 'date',
        type: 'daterange',
        prop: 'applicantDate',
        label: '申请日期',
        // style: { width: '300px' },
        itemStyle: { width: '25%' },
        pickerOptions: pickerOptions,
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59']
        // change: timeChange
      },
      '_yarnCode': {
        prop: 'yarnCode',
        itemType: 'input',
        label: '纱线编码',
        itemStyle: { width: '25%' },
        placeholder: '请输入纱线编码'
      },
      '_yarnName': {
        prop: 'yarnName',
        itemType: 'input',
        label: '纱名',
        itemStyle: { width: '25%' },
        placeholder: '请输入纱名'
      },
      '_yarnAttr': {
        prop: 'yarnAttr',
        itemType: 'input',
        itemStyle: { width: '25%' },
        label: '纱属性',
        placeholder: '请输入纱属性'
      },
      '_operate': {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          console.log('查询', params)
          let startTime = ''
          let endTime = ''
          if (params.applicantDate && params.applicantDate.length === 2) {
            startTime = params.applicantDate[0]
            endTime = params.applicantDate[1]
          }

          this.searchFormDatas = { ...params, startTime, endTime }
          this.purchaseGeneralYarnPage()
          // this.grayYarnPage()
          // this.grayYarnPageCount()
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    }
    // 表格表头配置
    const columns = {
      '_id': {
        prop: 'id',
        label: '序号',
        width: '60',
        formater: (scope) => {
          return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
        }
      },
      '_applicationCode': {
        prop: 'applicationCode',
        label: '申请单号',
        minWidth: '120',
        showOverflowTooltip: true
      },
      '_purchaseAmount': {
        prop: 'purchaseAmount',
        label: '采购数量(KG)',
        align: 'right',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => {
          return !isNaN(scope.row.purchaseAmount) ? (+scope.row.purchaseAmount).toFixed(2) : '-'
        }
      },
      '_purchaseDelivery': {
        prop: 'purchaseDelivery',
        label: '采购交期',
        minWidth: '110',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.purchaseDelivery ? this.$filters.parseTime(scope.row.purchaseDelivery, '{y}-{m}-{d}') : '-'
        }
      },
      '_applicationTime': {
        prop: 'applicationTime',
        label: '申请时间',
        minWidth: '110',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.applicationTime ? this.$filters.parseTime(scope.row.applicationTime, '{y}-{m}-{d} {h}:{i}') : '-'
        }
      },
      '_applicant': {
        prop: 'applicant',
        label: '申请人',
        minWidth: '120',
        showOverflowTooltip: true
      },
      '_status': {
        prop: 'status',
        label: '状态',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => {
          return '已下发采购'
        }
      }
    }
    let operatesList = [
      {
        label: '查看',
        isShow: () => {
          return true
        },
        permitTag: ['aps-center:purchaseGeneralYarn:info'],
        handle: scope => {
          this.$router.push({ name: 'general-yarn-purchase-request-detail', query: { id: scope.row.id }})
        }
      }
    ]
    operatesList = this.$filterPermission(operatesList)
    const operates = {
      label: '操作',
      width: '110',
      fixed: 'right',
      dataSource: operatesList
    }
    const pagination = {
      currentChange: val => {
        console.log('current', val)
        this.purchaseGeneralYarnPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        console.log('size', val)
        this.$set(this.pagination, 'currentPage', 1)
        this.purchaseGeneralYarnPage({ pageNum: 1, pageSize: val })
      }
    }
    return {
      searchData,
      formOtions: { inline: true, size: 'small', layout: true },
      formDatas: { applicantDate: [new Date().getTime() - 3600 * 1000 * 24 * 30, new Date().getTime()] },
      searchFormDatas: { startTime: new Date().getTime() - 3600 * 1000 * 24 * 30, endTime: new Date().getTime() },

      columns,
      operates,
      pagination,
      dataSource: []
    }
  },
  created() {
    this.purchaseGeneralYarnPage()
  },
  methods: {
    async purchaseGeneralYarnPage(data = {}) {
      const res = await purchaseGeneralYarnPage({ ...this.searchFormDatas, ...data })
      const userList = res.data.list || []
      console.log('userList', userList)
      this.dataSource = userList
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    }
  }
}
</script>

<style lang="scss">
  .general-yarn-purchase-request-list {
    padding: 20px;
  }
</style>

