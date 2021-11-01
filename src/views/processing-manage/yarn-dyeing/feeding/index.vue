<!--
 * @Author: xj
 * @Description:  送纱通知单
 * @Date: 2021-06-10 19:23:16
 * @LastEditors: anthony
 * @LastEditTime: 2021-06-28 10:13:57
 * @FilePath: e:\erpmu\erp2-processing-v2.0.0\src\views\processing-manage\yarn-dyeing\feeding\index.vue
-->

<template>
  <div id="WeavingDeliveryCopy" class="list">
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
          :columns="columns"
          :data-source="dataSource"
          :pagination="pagination"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { list } from './api/index'
export default {
  name: 'WeavingDeliveryCopy',
  data() {
    const itemStyle = {
      width: '33%'
    }
    const searchData = {
      _noticeNo: {
        prop: 'noticeNo',
        itemType: 'input',
        label: '通知单号',
        placeholder: '请输入通知单号',
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.noticeNo = ''
        },
        clearable: true,
        itemStyle
      },
      _sourceNo: {// pm
        prop: 'sourceNo',
        itemType: 'input',
        label: '送入单号',
        placeholder: '请输入送入单号',
        clear: (form, formDatas, setFormDatas, scope) => {
          this.searchFormDatas.sourceNo = ''
        },
        clearable: true,
        itemStyle
      },
      _dateRange: {
        prop: 'dateRange',
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
        submitHandle: params => {
          const newData = JSON.parse(JSON.stringify(params))
          if (params.dateRange) {
            newData.createdTimeStart = params.dateRange[0]
            newData.createdTimeEnd = params.dateRange[1]
          } else {
            newData.createdTimeStart = null
            newData.createdTimeEnd = null
          }
          this.searchFormDatas = newData
          this.pagination.pageNum = 1
          this.pagination.pageSize = 20
          this.list(newData)
        },
        resetHandle: () => {
          this.searchFormDatas = {}
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
        formater: scope => scope.row.index || '-'
      },
      _noticeNo: {
        prop: 'noticeNo',
        label: '通知单号',
        showOverflowTooltip: true,
        formater: scope => scope.row.noticeNo || '-',
        handle: (scope) => {
          this.$router.push({
            path: '/processing/yarn-dyeing/feeding/detail',
            query: { id: scope.row.noticeNo || 9527 }
          })
        },
        style: {
          color: 'rgb(24, 144, 255)',
          cursor: 'pointer'
        }
      },
      _sourceNo: { // pm
        prop: 'sourceNo',
        label: '送入单号',
        showOverflowTooltip: true,
        formater: scope => scope.row.sourceNo || '-'
      },
      _allotOutAddr: {
        prop: 'allotOutAddr',
        label: '原纱地址',
        isShow: true,
        showOverflowTooltip: true,
        formater: scope => scope.row.allotOutAddr || '-'
      },
      _sourceNoAddr: {
        prop: 'sourceNoAddr',
        label: '送入地址',
        isShow: true,
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.sourceNoAddr || '-'
        }
      },
      _sendNum: {
        prop: 'sendNum',
        label: '送纱数量(KG)',
        isShow: true,
        align: 'right',
        showOverflowTooltip: true,
        formater: scope => scope.row.sendNum || '-'
      },
      _createdTime: {
        prop: 'createdTime',
        label: '创建日期',
        isShow: true,
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.createdTime ? this.$filters.parseTime(scope.row.createdTime + '', '{y}-{m}-{d}') : '-'
        }
      }
    }
    const pagination = {
      currentChange: (val) => {
        this.pagination.pageNum = val
        this.list()
      },
      sizeChange: (val) => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        this.list()
      }
    }
    return {
      searchData,
      searchFormDatas: {},
      formOptions,
      dataSource: [],
      columns,
      pagination
    }
  },
  created() {
    this.list({}, true)
  },
  methods: {
    // 获取列表数据
    async list(data = {}, fresh,) {
      const obj = { status: '' }
      const res = await list({ ...data, ...obj, ...this.searchFormDatas,
        pageSize: this.pagination.pageSize || 20,
        pageNum: this.pagination.pageNum || 1 })
      if (res.data && res.data.list) {
        res.data.list && res.data.list.map((item, index) => {
          item.index = (res.data.pageNum - 1) * res.data.pageSize + index + 1
        })
      }
      const listData = res.data.list || []
      this.dataSource = listData
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total || 0,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize
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
