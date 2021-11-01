<template>
  <div id="WeavingDelivery" class="list">
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOptions"
        :form-datas="searchFormDatas"
      />
    </div>
    <div class="bk">
      <!-- 列表 -->
      <div class="page-table">
        <cs-custom-table
          :table-scrollx="true"
          :columns="columns"
          :data-source="dataSource"
          :pagination="pagination"
        />
      </div>
    </div>
  </div>
</template>
<script>
import * as api from '@/views/processing-manage/weaving/delivery/api/index.js'
import { deepClone } from '@/utils'
import { parseTime } from '@/utils'
export default {
  name: 'WeavingDelivery',
  data() {
    const itemStyle = {
      width: '33%'
    }
    const searchData = {
      _allotNotifyNo: {
        prop: 'allotNotifyNo',
        itemType: 'input',
        label: '通知单号',
        placeholder: '请输入通知单号',
        clearable: true,
        itemStyle
      },
      _sendNo: {
        prop: 'sendNo',
        itemType: 'input',
        label: '送入单号',
        placeholder: '请输入送入单号',
        clearable: true,
        itemStyle
      },
      _createdTime: {
        prop: 'createdTime',
        itemType: 'date',
        type: 'daterange',
        label: '创建日期',
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
          const p = deepClone(params)
          if (p.hasOwnProperty('createdTime') && p.createdTime) {
            p.createdTimeStart = p.createdTime[0]
            p.createdTimeEnd = p.createdTime[1]
          }
          delete p.createdTime

          this.searchParams = p
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
    const formOptions = {
      size: 'small',
      layout: true,
      inline: true
    }
    const columns = {
      _index: {
        type: 'index',
        label: '序号',
        formater: (scope) => {
          return (
            (this.pagination.currentPage - 1) * this.pagination.pageSize +
            (scope.$index + 1)
          )
        }
      },
      _sendId: {
        prop: 'sendId',
        label: '通知单号',
        minWidth: '160',
        showOverflowTooltip: true,
        style: {
          color: 'rgb(24, 144, 255)',
          cursor: 'pointer',
          'white-space': 'nowrap'
        },
        handle: (scope) => {
          this.$router.push({
            path: '/processing/weaving/delivery-requisition/detail',
            query: { id: scope.row.id, uuid: scope.row.uuid }
          })
        }
      },
      _sourceNo: {
        prop: 'sourceNo',
        label: '送入单号',
        minWidth: '140',
        showOverflowTooltip: true
      },
      _allotOutAddr: {
        prop: 'allotOutAddr',
        label: '原纱地址',
        showOverflowTooltip: true,
        minWidth: '100'
      },
      _allotInAddr: {
        prop: 'allotInAddr',
        label: '送入地址',
        showOverflowTooltip: true,
        minWidth: '100'
      },
      _sendNum: {
        prop: 'sendNum',
        label: '送纱数量(KG)',
        minWidth: '100',
        showOverflowTooltip: true,
        align: 'right'
      },
      _createdTime: {
        prop: 'createdTime',
        label: '创建日期',
        minWidth: '100',
        formater: (scope) => {
          return parseTime(scope.row.createdTime, '{y}-{m}-{d}')
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
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        this.getList()
      }
    }
    return {
      searchParams: {},
      searchData,
      searchFormDatas: {},
      formOptions,
      dataSource: [],
      columns,
      pagination
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const res = await api.list({
        pageSize: this.pagination.pageSize || 20,
        pageNum: this.pagination.pageNum || 1,
        ...this.searchParams
      })
      if (res.code === 200) {
        this.dataSource = res.data.list || []
        this.pagination = {
          ...this.pagination,
          dataTotal: res.data.total || 0,
          currentPage: res.data.pageNum,
          pageNum: res.data.pageNum,
          pageSize: res.data.pageSize
        }
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    }
  }
}
</script>

<style lang="scss" >
@import "@/styles/base.scss";
#WeavingDelivery {
}
</style>
