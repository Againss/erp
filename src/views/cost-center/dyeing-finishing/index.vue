<!--
 * @Descripttion: 染整报价列表
 * @Author: admin
 * @Date: 2021-06-10 15:23:17
 * @LastEditors: admin
 * @LastEditTime: 2021-07-29 14:48:37
-->
<template>
  <div class="dyeing-finishing list">
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
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="(i, index) in tabs" :key="index">
            <span slot="label" :name="index">
              {{ `${i.label} (${i.count})` }}</span>
          </el-tab-pane>
        </el-tabs>
        <!-- 列表 -->
        <div class="page-table">
          <cs-custom-table
            :key="activeName"
            :columns="columns"
            :table-scrollx="true"
            :data-source="dataSource"
            :pagination="pagination"
            edit-type="pop"
            :operates="popOperates"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import * as api from './api/index'
import { fetchLog } from '@/views/pms/public/fetchLog.js'
export default {
  name: 'DyeingFinishing',
  mixins: [fetchLog],
  data() {
    const tabs = [
      { label: '全部', value: '', count: 0 },
      { label: '待询价', value: 1, count: 0 },
      { label: '待报价', value: 2, count: 0 },
      { label: '待智布确认', value: 3, count: 0 },
      { label: '待工厂确认', value: 4, count: 0 },
      { label: '审批中', value: 5, count: 0 },
      { label: '已完成', value: 6, count: 0 }
    ]
    const itemStyle = { width: '33%' }
    const searchData = {
      _inquiryNo: {
        prop: 'inquiryNo',
        itemType: 'input',
        label: '询价单号',
        placeholder: '请输入询价单号',
        clearable: true,
        // minWidth: '33%'
        itemStyle
      },
      _dyeNo: {
        prop: 'dyeNo',
        itemType: 'input',
        label: '染订单号',
        placeholder: '请输入染订单号',
        clearable: true,
        // minWidth: '33%'
        itemStyle
      },
      _supplierName: {
        prop: 'supplierName',
        itemType: 'input',
        label: '供应商',
        placeholder: '请输入供应商',
        clearable: true,
        // minWidth: '33%'
        itemStyle
      },
      _inquiryTime: {
        prop: 'inquiryTime',
        itemType: 'date',
        type: 'daterange',
        label: '询价日期',
        itemStyle,
        // itemStyle: {
        //   width: '33%'
        // },
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59']
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          this.searchParams = {
            inquiryStartTime: params.inquiryTime && params.inquiryTime[0] || null,
            inquiryEndTime: params.inquiryTime && params.inquiryTime[1] || null,
            inquiryNo: params.inquiryNo || '',
            dyeNo: params.dyeNo || '',
            supplierName: params.supplierName || ''
          }
          this.searchFormDatas = params
          this.pagination.pageNum = 1
          this.pagination.pageSize = 20
          this.init()
        },
        resetHandle: () => {
          this.searchFormDatas = {}
          this.searchParams = {}
        }
      }
    }
    const searchFormDatas = {}
    const columns = {
      _index: {
        maxWidth: '50',
        label: '序号',
        formater: (scope) => {
          return (
            (this.pagination.currentPage - 1) * this.pagination.pageSize +
            (scope.$index + 1)
          )
        },
        showOverflowTooltip: true
      },
      _inquiryNo: {
        prop: 'inquiryNo',
        label: '询价单号',
        minWidth: '160'
      },
      _dyeNo: {
        prop: 'dyeNo',
        label: '染订单号',
        minWidth: '160'
      },
      _weight: {
        prop: 'weight',
        label: '重量（KG）',
        minWidth: '100',
        align: 'right'
      },
      _deadline: {
        prop: 'deadline',
        label: '报价截止日期',
        minWidth: '120',
        formater: (scope) => scope.row.deadline ? parseTime(scope.row.deadline, '{y}-{m}-{d}') : ''
      },
      _supplierName: {
        prop: 'supplierName',
        label: '供应商',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _inquiryBy: {
        prop: 'inquiryBy',
        label: '询价人',
        minWidth: '100'
      },
      _inquiryTime: {
        prop: 'inquiryTime',
        label: '询价时间',
        minWidth: '180',
        // showOverflowTooltip: true,
        formater: (scope) => scope.row.inquiryTime ? parseTime(scope.row.inquiryTime) : ''
      },
      _status: {
        prop: 'status',
        label: '状态',
        minWidth: '120',
        isShow: () => this.activeName * 1 === 0,
        formater: (scope) => {
          const config = [
            '',
            `<span style="color:#FF9214 ">待询价</span>`,
            `<span style="color:#FF9214 ">待报价</span>`,
            '<span style="color:#FF9214 ">待智布确认</span>',
            '<span style="color:#FF9214 ">待工厂确认</span>',
            '<span style="color:#FF9214 ">审批中</span>',
            '<span style="color:#00BCC5 ">已完成</span>'
          ]
          return config[scope.row.status]
        }
      }
    }
    const pagination = {
      currentChange: (val) => {
        this.pagination.pageNum = val
        this.init()
      },
      sizeChange: (val) => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        this.init()
      }
    }
    const popOperates = {
      label: '操作',
      width: '120',
      fixed: 'right',
      moreOptions: {
        maxLength: 4
      },
      dataSource: [
        {
          label: '查看',
          isShow: (params) => {
            // 待询价状态不可以查看
            return params.row.status !== 1 && this.$permission(['costCenter:dye:info'])
          },
          handle: (scope) => {
            this.$router.push({
              path: '/cost-center/dyeing-finishing/detail',
              query: { id: scope.row.inquiryNo }
            })
          }
        },
        {
          label: '确认',
          isShow: (params) => {
            // 只有待智布确认状态有确认按钮
            return params.row.status === 3 && !params.row.rejected && this.$permission(['costCenter:dye:confirm'])
          },
          handle: async(scope) => {
            this.$router.push({
              path: '/cost-center/dyeing-finishing/detail',
              query: { id: scope.row.inquiryNo }
            })
          }
        },
        {
          label: '撤回',
          isShow: (params) => {
            // 只有审批中可撤回
            return params.row.status === 5 && this.$permission(['costCenter:dye:withdraw'])
          },
          handle: async(scope) => {
            this.$router.push({
              path: '/cost-center/dyeing-finishing/detail',
              query: { id: scope.row.inquiryNo }
            })
          }
        }
      ]
    }
    return {
      popOperates,
      tabs,
      activeName: '2',
      searchData,
      formOptions: {
        size: 'small',
        layout: true,
        inline: true
      },
      searchFormDatas,
      dataSource: [],
      columns,
      pagination,
      choseResult: [],
      searchParams: {}
    }
  },
  created() {
    this.init()
  },

  methods: {
    handleClick(val, f) {
      this.pagination.pageSize = 20
      this.pagination.pageNum = 1
      this.init()
    },

    // 获取列表操作
    async init(data = {}) {
      const res = await api.list(this.searchParams, {
        pageSize: this.pagination.pageSize || 20,
        pageNum: this.pagination.pageNum || 1,
        ...{ status: this.activeName * 1 ? this.activeName * 1 : undefined }
      })
      this.dataSource = res.data.list || []
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total || 0,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      // tab数量
      const resCount = await api.count(this.searchParams)
      const count = resCount.data || {}
      const arr = [
        'total',
        'r',
        's',
        'c',
        'f',
        'w',
        't'
      ]
      this.tabs.forEach((i, index) => {
        this.$set(i, 'count', count[arr[index]] || 0)
      })
    }
  }
}
</script>

<style lang="scss" >
@import "@/styles/base.scss";
.dyeing-finishing {
  .el-form-item__label-wrap{
    margin-left: 0 !important;
  }
  .el-message-box__status {
    top: 0;
  }
  // .table tr:nth-child(even) {
  //   background: #fff;
  // }
  // .page-table tbody .el-table__row td {
  //   /* border-bottom-width: 0; */
  //   border-bottom: 1px solid #EEEFF0
  // }
}
</style>
<style lang="scss" scoped>

.dyeing-finishing {
  .button.spe {
    position: absolute;
    right: 20px;
    top: 14px;
    z-index: 3;
  }
}
</style>

