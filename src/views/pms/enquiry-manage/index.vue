<template>
  <div class="OrderManagement list">
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOptions"
        :form-datas="searchFormDatas"
      />
    </div>

    <div class="bk" style="position: relative">
      <div class="button spe">
        <el-button
          v-if="$permission(['pms:inquiry:add'])"
          size="small"
          type="primary"
          @click="submit"
        >新建询价单</el-button>
      </div>
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
import * as apiPub from '@/views/pms/public/api/index.js'
import { fetchLog } from '@/views/pms/public/fetchLog.js'
export default {
  name: 'OrderManagement',
  mixins: [fetchLog],
  data() {
    const tabs = [
      { label: '全部', value: '', count: 0 },
      { label: '待报价', value: 0, count: 0 },
      { label: '已报价', value: 1, count: 0 },
      { label: '已取消', value: 2, count: 0 }
    ]
    const searchData = {
      _inquiryNo: {
        prop: 'inquiryNo',
        itemType: 'input',
        label: '询价单号',
        placeholder: '请输入询价单号',
        clearable: true
      },
      _supplierId: {
        prop: 'supplierId',
        itemType: 'select',
        filterable: true,
        label: '供应商',
        dataSource: [],
        clearable: true,
        placeholder: '请选择供应商',
        valueKey: 'id',
        props: {
          label: 'supplierName',
          value: 'id'
        }
      },
      _inquireDate: {
        prop: 'inquireDate',
        itemType: 'date',
        type: 'daterange',
        label: '询价日期',
        itemStyle: {
          width: '300px'
        },
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
            inquireDateStart: params.inquireDate && params.inquireDate[0] || null,
            inquireDateEnd: params.inquireDate && params.inquireDate[1] || null,
            inquiryNo: params.inquiryNo,
            supplierId: params.supplierId
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
        minWidth: '150',
        showOverflowTooltip: true,
        style: {
          color: '#0986FF',
          cursor: 'pointer'
        },
        handle: (scope) => {
          if (this.$permission(['pms:inquiry:info'])) {
            this.$router.push({
              path: '/pms/enquiry-manage/detail',
              query: { id: scope.row.inquiryNo, timestamp: new Date().getTime() }
            })
          }
        }
      },
      _classification: {
        prop: 'classification',
        label: '类型',
        minWidth: '100',
        formater: scope => scope.row.classification && (scope.row.classification * 1 === 1 ? '纱' : scope.row.classification * 1 === 2 ? '布' : '') || ''
      },
      _weight: {
        prop: 'weight',
        label: '重量（KG）',
        minWidth: '100'
      },
      _expirationDate: {
        prop: 'expirationDate',
        label: '截止日期',
        minWidth: '120',
        formater: (scope) => scope.row.expirationDate ? parseTime(scope.row.expirationDate, '{y}-{m}-{d}') : ''
      },
      _suppliers: {
        prop: 'suppliers',
        label: '供应商',
        width: '180',
        popoverOptions: {
          formater: (scope) => {
            let html = `<div>`
            scope.row.suppliers.forEach(v => {
              html += `<p>${v.supplierName}</p>`
            })
            html += `</div>`
            return html
          }
        },
        formater: scope => {
          return `${scope.row.suppliers && (scope.row.suppliers.reduce((a, n) => {
            a += n.supplierName + ','
            return a
          }, '')).slice(0, -1) || ''}`
        }
      },
      _createdName: {
        prop: 'createdName',
        label: '询价人',
        minWidth: '100'
      },
      _createdTime: {
        prop: 'createdTime',
        label: '询价时间',
        minWidth: '180',
        // showOverflowTooltip: true,
        formater: (scope) => scope.row.createdTime ? parseTime(scope.row.createdTime) : ''
      },
      _completeName: {
        prop: 'completeName',
        label: '完成人',
        minWidth: '100',
        isShow: () => this.activeName * 1 === 0 || this.activeName * 1 === 2
      },
      _completeDate: {
        prop: 'completeDate',
        label: '完成时间',
        minWidth: '180',
        formater: (scope) => scope.row.completeDate ? parseTime(scope.row.completeDate) : '',
        isShow: () => this.activeName * 1 === 0 || this.activeName * 1 === 2
      },
      _status: {
        prop: 'status',
        label: '状态',
        minWidth: '120',
        isShow: () => this.activeName * 1 !== 3,
        formater: (scope) => {
          const str = (scope.row.supplierQuoted || 0) + '/' + (scope.row.supplierTotal || 0)
          const config = [
            `<span style="color:#FF9214 ">待报价(${str})</span>`,
            `<span style="color:#00BCC5 ">已报价(${str})</span>`,
            '<span style="color:#888E9E ">已取消</span>'
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
      width: '200',
      fixed: 'right',
      moreOptions: {
        maxLength: 4
      },
      dataSource: [
        {
          label: '编辑',
          isShow: (scope) => {
            return (
              scope.row.status === 0 && this.$permission(['pms:inquiry:modify'])
            )
          },
          handle: (scope) => {
            this.$router.push({
              path: '/pms/enquiry-manage/edit',
              query: { id: scope.row.inquiryNo }
            })
          }
        },
        {
          label: '查看',
          isShow: (params) => {
            return this.$permission(['pms:inquiry:info'])
          },
          handle: (scope) => {
            this.$router.push({
              path: '/pms/enquiry-manage/detail',
              query: { id: scope.row.inquiryNo }
            })
          }
        },
        {
          label: '填写报价',
          isShow: (scope) => {
            return (
              scope.row.status === 0 && this.$permission(['pms:inquiry:quote'])
            )
          },
          handle: (scope) => {
            this.$router.push({
              path: '/pms/enquiry-manage/detail',
              query: { id: scope.row.inquiryNo }
            })
          }
        },
        {
          label: '下单',
          isShow: scope => false,
          handle: (scope) => {
            this.$router.push({
              path: '/pms/order-management/new'
            })
          }
        }
      ]
    }
    return {
      popOperates,
      tabs,
      activeName: '1',
      searchData,
      formOptions: {
        size: 'small',
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
    this.getConstant()
  },
  // activated() {
  // this.init()
  // this.getConstant()
  // },
  methods: {
    handleClick(val, f) {
      this.pagination.pageSize = 20
      this.pagination.pageNum = 1
      this.init()
    },
    submit() {
      this.$router.push('/pms/enquiry-manage/new')
    },
    async getConstant() {
      const res = await apiPub.getSupplier({ supplierCategory: 0 })
      this.$set(this.searchData._supplierId, 'dataSource', res.data)
    },
    // 获取列表操作
    async init(data = {}) {
      const res = await api.list(this.searchParams, {
        pageSize: this.pagination.pageSize || 20,
        pageNum: this.pagination.pageNum || 1,
        ...{ status: this.activeName * 1 ? this.activeName - 1 : undefined }
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
        'all',
        'pending',
        'quoted',
        'cancelled'
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
.OrderManagement {
  .el-message-box__status {
    top: 0;
  }
}
</style>
<style lang="scss" scoped>
.OrderManagement {
  .button.spe {
    position: absolute;
    right: 20px;
    top: 14px;
    z-index: 3;
  }
}
</style>
