<template>
  <div class="CuttingCloth list">
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOptions"
        :form-datas="searchFormDatas"
      />
    </div>
    <div class="bk" style="position: relative">
      <div class="tabs">
        <el-tabs v-model="activeName" @tab-click="getList">
          <el-tab-pane v-for="(i, key) in tabs" :key="key">
            <span slot="label" :name="i.key">
              {{ `${i.name} (${i.num})` }}</span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 列表 -->
      <div class="page-table">
        <cs-custom-table
          :key="activeName"
          :table-scrollx="true"
          :columns="columns"
          :data-source="dataSource"
          :pagination="pagination"
          :operates="popOperates"
          edit-type="pop"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import * as api from './api/index.js'
export default {
  name: 'CuttingCloth',
  data() {
    const itemStyle = { width: '33%' }
    const searchData = {
      _cutClothNo: {
        prop: 'cutClothNo',
        itemType: 'input',
        label: '剪布单号',
        placeholder: '请输入剪布单号',
        clearable: true,
        itemStyle
      },
      _cutApplyNo: {
        prop: 'cutApplyNo',
        itemType: 'input',
        label: '剪版申请单号',
        placeholder: '请输入剪版申请单号',
        clearable: true,
        itemStyle
      },
      _applyUser: {
        prop: 'applyUser',
        itemType: 'input',
        label: '申请人',
        placeholder: '请输入申请人',
        clearable: true,
        itemStyle
      },
      _createdTime: {
        prop: 'createdTime',
        itemType: 'date',
        type: 'daterange',
        label: '生成时间',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59'],
        itemStyle
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          var createdTimeBegin = ''
          var createdTimeEnd = ''
          if (params.hasOwnProperty('createdTime') && params.createdTime) {
            createdTimeBegin = params.createdTime[0]
            createdTimeEnd = params.createdTime[1]
          }
          this.searchParams = {
            ...params,
            createdTimeBegin,
            createdTimeEnd
          }
          this.pagination.pageNum = 1
          this.pagination.pageSize = 20
          this.getList()
        },
        resetHandle: () => {
          this.searchFormDatas = {}
          this.searchParams = {}
        }
      }
    }
    const columns = {
      _index: {
        label: '序号',
        prop: 'index',
        minWidth: '50',
        formater: (scope) => {
          return (
            (this.pagination.currentPage - 1) * this.pagination.pageSize +
            (scope.$index + 1)
          )
        }
      },
      _cutClothNo: {
        prop: 'cutClothNo',
        label: '剪布单号',
        minWidth: '160',
        showOverflowTooltip: true,
        style: {
          color: '#0986FF',
          cursor: 'pointer'
        },
        handle: (scope) => {
          this.$router.push({
            path: '/wms/inventory-manage/cutting-cloth/detail',
            query: {
              cutClothNo: scope.row.cutClothNo,
              timestamp: new Date().getTime()
            }
          })
        }
      },
      _cutApplyNo: {
        prop: 'cutApplyNo',
        label: '剪版申请单号',
        minWidth: '160',
        showOverflowTooltip: true
      },
      _weightTotal: {
        prop: 'weightTotal',
        align: 'right',
        label: '重量（KG）',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _applyUser: {
        prop: 'applyUser',
        label: '申请人',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _createdTime: {
        prop: 'createdTime',
        label: '生成时间',
        minWidth: '160',
        formater: (scope) => {
          const time = scope.row.createdTime
            ? parseTime(scope.row.createdTime)
            : ''
          return time
        }
      },
      _outOfTime: {
        prop: 'outOfTime',
        label: '要求送出时间',
        minWidth: '160',
        formater: (scope) => {
          const time = scope.row.outOfTime
            ? parseTime(scope.row.outOfTime)
            : ''
          return time
        }
      },
      _finishTime: {
        prop: 'finishTime',
        label: '完成时间',
        minWidth: '160',
        isShow: () => {
          return this.activeName === '0' || this.activeName === '3' || this.activeName === '4'
        },
        formater: (scope) => {
          const time = scope.row.finishTime
            ? parseTime(scope.row.finishTime)
            : ''
          return time
        }
      },
      _status: {
        prop: 'status',
        label: '状态',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.getStatus(scope.row)
        },
        isShow: () => {
          return this.activeName === '0'
        }
      }
    }
    const pagination = {
      currentChange: (val) => {
        this.pagination.pageNum = val
        this.getList()
      },
      sizeChange: (val) => {
        this.pagination.pageSize = val
        this.pagination.currentPage = val
        this.pagination.pageNum = 1
        this.getList()
      }
    }
    const tabs = {
      _all: {
        name: '全部',
        key: '0',
        num: 0
      },
      _waitNo: {
        name: '待剪布',
        key: '1',
        num: 0
      },
      _cuttingNo: {
        name: '剪布中',
        key: '2',
        num: 0
      },
      _finishedNo: {
        name: '已剪布',
        key: '3',
        num: 0
      },
      _cancelNo: {
        name: '已取消',
        key: '4',
        num: 0
      }
    }
    const popOperates = {
      label: '操作',
      width: '80',
      fixed: 'right',
      dataSource: [
        {
          label: '详情',
          isShow: (params) => {
            return this.$permission(['wms:inner:cutCloth:info'])
          },
          handle: (scope) => {
            this.$router.push({
              path: '/wms/inventory-manage/cutting-cloth/detail',
              query: {
                cutClothNo: scope.row.cutClothNo,
                timestamp: new Date().getTime()
              }
            })
          }
        }
      ]
    }
    return {
      searchParams: {},
      popOperates,
      searchData,
      formOptions: {
        size: 'small',
        layout: true,
        inline: true
      },
      searchFormDatas: {},
      activeName: '1',
      columns,
      dataSource: [],
      pagination,
      tabs
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 状态变颜色
    getStatus(data) {
      let str = ''
      switch (data.status) {
        case 0:
          str = '<span style="color:#FF9B02">待剪布</span>'
          break
        case 1:
          str = '<span style="color:#FF9B02">剪布中</span>'
          break
        case 2:
          str = '<span style="color:#00BCC5">已剪布</span>'
          break
        case 3:
          str = '<span style="color:#888E9E">已取消</span>'
          break
        default:
          break
      }
      return str
    },
    async getList() {
      const res = await api.list({
        ...this.searchParams,
        pageNum: this.pagination.pageNum || 1,
        pageSize: this.pagination.pageSize || 20,
        status: this.activeName !== '0' ? this.activeName - 1 : undefined
      })
      if (this.$pub.responseValidate(res)) {
        const data = res.data || {}
        this.dataSource = data.list || []
        this.pagination = {
          ...this.pagination,
          dataTotal: data.total || 0,
          currentPage: data.pageNum || 1,
          pageSize: data.pageSize || 20
        }
      }
      const countRes = await api.count({
        ...this.searchParams
      })
      if (countRes.code === 200) {
        for (var i in countRes.data) {
          if (countRes.data !== null) {
            this.tabs[`_${i}`].num = countRes.data[i]
          }
        }
      }
    }
  }
}
</script>

<style  lang="scss">
@import "@/styles/base.scss";
.CuttingCloth {
  .el-tabs__nav-wrap{
    margin-bottom: 0;
  }
}
</style>
