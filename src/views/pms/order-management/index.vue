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
          v-if="
            $permission(['pms:purchaseOrder:add']) ||
              $permission(['pms:purchaseOrder:submit'])
          "
          size="small"
          type="primary"
          @click="submit"
        >新建采购订单</el-button>
      </div>
      <div class="tabs">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="(i, index) in tabs" :key="index">
            <span slot="label" :name="index">
              {{ `${i.label} (${i.count || 0})` }}</span>
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
      { label: '全部', value: 0, count: 0 },
      { label: '草稿', value: 1, count: 0 },
      { label: '审核中', value: 2, count: 0 },
      { label: '待上传合同', value: 3, count: 0 },
      { label: '待送货', value: 4, count: 0 },
      { label: '待收货', value: 5, count: 0 },
      { label: '已完成', value: 6, count: 0 },
      { label: '已取消', value: 7, count: 0 }
    ]
    const itemStyle = { width: '33%' }
    const searchData = {
      _purchaseOrderNumber: {
        prop: 'purchaseOrderNumber',
        itemType: 'input',
        label: '采购订单号',
        placeholder: '请输入采购订单号',
        clearable: true,
        itemStyle
      },
      _materiel: {
        prop: 'materiel',
        itemType: 'input',
        label: '纱线编码',
        placeholder: '请输入纱线编码',
        clearable: true,
        itemStyle
      },
      _supplier: {
        prop: 'supplier',
        itemType: 'select',
        filterable: true,
        label: '供应商',
        dataSource: [],
        clearable: true,
        placeholder: '请选择供应商',
        valueType: 'object',
        valueKey: 'id',
        props: {
          label: 'supplierName',
          value: 'id'
        },
        itemStyle
      },
      _delivery: {
        prop: 'delivery',
        itemType: 'date',
        type: 'daterange',
        label: '交期',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        itemStyle
      },
      _submitterName: {
        prop: 'submitterName',
        itemType: 'input',
        label: '下单人',
        placeholder: '请输入下发人',
        clearable: true,
        itemStyle
      },
      _submitDate: {
        prop: 'submitDate',
        itemType: 'date',
        type: 'daterange',
        label: '下单日期',
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
          var deliveryBeginDate = ''
          var deliveryEndDate = ''
          if (params.hasOwnProperty('delivery') && params.delivery) {
            deliveryBeginDate = params.delivery[0]
            deliveryEndDate = params.delivery[1]
          }

          var submitBeginDate = ''
          var submitEndDate = ''
          if (params.hasOwnProperty('submitDate') && params.submitDate) {
            submitBeginDate = params.submitDate[0]
            submitEndDate = params.submitDate[1]
          }

          var supplier = null
          if (params.hasOwnProperty('supplier') && params.supplier) {
            supplier = {
              label: params.supplier.supplierName,
              value: params.supplier.id
            }
          }
          this.searchParams = {
            ...params,
            deliveryBeginDate,
            deliveryEndDate,
            submitBeginDate,
            submitEndDate,
            supplier
          }
          // this.$set(this.searchParams, 'issueDate')
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
        minWidth: '50',
        label: '序号',
        formater: (scope) => {
          return (
            (this.pagination.currentPage - 1) * this.pagination.pageSize +
            (scope.$index + 1)
          )
        }
      },
      _purchaseOrderNumber: {
        prop: 'purchaseOrderNumber',
        label: '采购订单号',
        minWidth: '150',
        showOverflowTooltip: true,
        style: {
          color: '#0986FF',
          cursor: 'pointer'
        },
        handle: (scope) => {
          if (this.$permission(['pms:purchaseOrder:info'])) {
            this.$router.push({
              path: '/pms/order-management/detail',
              query: { id: scope.row.purchaseOrderNumber, timestamp: new Date().getTime() }
            })
          }
        }
      },
      _classification: {
        prop: 'classification',
        label: '采购类型',
        minWidth: '100',
        formater: () => {
          return '纱'
        }
      },
      _purchaseWeight: {
        prop: 'purchaseWeight',
        label: '采购重量(KG)',
        minWidth: '120',
        align: 'right',
        showOverflowTooltip: true
      },
      _rmbTotalPrice: {
        prop: 'rmbTotalPrice',
        label: '订单金额(元)',
        minWidth: '150',
        align: 'right',
        showOverflowTooltip: true
      },
      _supplier: {
        prop: 'supplier',
        label: '供应商',
        minWidth: '180',
        formater: (scope) => {
          return scope.row.supplier.label || ''
        },
        showOverflowTooltip: true
      },
      _submitterName: {
        prop: 'submitterName',
        label: '下单人',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _submitDate: {
        prop: 'submitDate',
        label: '下单日期',
        minWidth: '180',
        formater: (scope) => {
          const time = scope.row.submitDate
            ? parseTime(scope.row.submitDate)
            : ''
          return time
        }
      },
      _status: {
        prop: 'status',
        label: '状态',
        minWidth: '120',
        formater: (scope) => {
          // 草稿：1，审核中：2，待上传合同：
          const config = [
            '<span style="color:#888E9E ">草稿</span>',
            '<span style="color:#FF9214 ">新单审核中</span>',
            '<span style="color:#FF9214 ">待上传合同</span>',
            '<span style="color:#FF9214 ">待送货</span>',
            '<span style="color:#FF9214 ">待收货</span>',
            '<span style="color:#00BCC5 ">已完成</span>',
            '<span style="color:#888E9E ">已取消</span>',
            '<span style="color:#FF9214 ">变更审核中</span>'
          ]
          return config[scope.row.status - 1]
        },
        isShow: () => this.activeName === '0' || this.activeName === '2'
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
          label: '提交',
          isShow: (scope) => {
            return (
              scope.row.status === 1 &&
              this.$permission(['pms:purchaseOrder:submit'])
            )
          },
          // 和采购订单详情页的提交需求一致
          handle: (scope) => {
            this.$router.push({
              path: '/pms/order-management/detail',
              query: { id: scope.row.purchaseOrderNumber }
            })
          }
        },
        {
          label: '编辑',
          isShow: (scope) => {
            return (
              scope.row.status === 1 &&
              this.$permission(['pms:purchaseOrder:add'])
            )
          },
          handle: (scope) => {
            this.$router.push({
              path: '/pms/order-management/edit',
              query: { id: scope.row.purchaseOrderNumber }
            })
          }
        },
        {
          label: '查看',
          isShow: (params) => {
            return this.$permission(['pms:purchaseOrder:info'])
          },
          handle: (scope) => {
            this.$router.push({
              path: '/pms/order-management/detail',
              query: { id: scope.row.purchaseOrderNumber }
            })
          }
        },
        {
          label: '删除',
          style: { color: '#FE4949' },
          isShow: (scope) => {
            return (
              scope.row.status === 1 &&
              this.$permission(['pms:purchaseOrder:delete'])
            )
          },
          handle: (scope) => {
            this.$router.push({
              path: '/pms/order-management/detail',
              query: { id: scope.row.purchaseOrderNumber }
            })
          }
        },
        {
          label: '审核',
          isShow: (scope) => {
            return (
              (scope.row.status === 2 || scope.row.status === 8) &&
              this.$permission(['pms:purchaseOrder:audit'])
            )
          },
          // 跳转至对应的采购订单详情页，详情页的状态为查看，根据状态显示
          handle: (scope) => {
            this.$router.push({
              path: '/pms/order-management/detail',
              query: { id: scope.row.purchaseOrderNumber }
            })
          }
        },
        {
          label: '撤回',
          isShow: (scope) => {
            return (
              (scope.row.status === 2 || scope.row.status === 8) &&
              this.$permission(['pms:purchaseOrder:revoke'])
            )
          },
          // 跳转至对应的采购订单详情页，详情页的状态为查看，根据状态显示
          handle: (scope) => {
            this.$router.push({
              path: '/pms/order-management/detail',
              query: { id: scope.row.purchaseOrderNumber }
            })
          }
        },
        {
          label: '取消',
          isShow: (scope) => {
            return (
              (scope.row.status === 2 || scope.row.status === 3) &&
              this.$permission(['pms:purchaseOrder:cancel'])
            )
          },
          handle: (scope) => {
            this.$router.push({
              path: '/pms/order-management/detail',
              query: { id: scope.row.purchaseOrderNumber }
            })
          }
        },
        {
          label: '上传合同',
          // 1、上传合同，可上传的格式：PDF、JPG、PNG；如格式错误，则提示“仅支持上传格式为PDF、JPG、PNG的合同”；
          // 2、合同上传成功后，采购订单状态变更为待送货；
          isShow: (scope) => {
            return (
              scope.row.status === 3 &&
              this.$permission(['pms:purchaseOrder:upload'])
            )
          },
          handle: (scope) => {
            this.$router.push({
              path: '/pms/order-management/detail',
              query: { id: scope.row.purchaseOrderNumber }
            })
          }
        },
        {
          label: '下载合同',
          // 1、开始下载合同，下载的合同为PDF版本；
          // 2、下载的文件名为：合同编号+供应商名称+月日4位
          isShow: (scope) => {
            return false && this.$permission(['pms:purchaseOrder:download']) // 本次迭代不做
          },
          handle: (scope) => {
            this.$router.push({
              path: '/pms/order-management/detail',
              query: { id: scope.row.purchaseOrderNumber }
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
    this.getConstant()
  },
  // activated() {
  // this.init()
  // this.getConstant()
  // },
  methods: {
    handleClick(val) {
      this.pagination.pageSize = 20
      this.pagination.pageNum = 1
      this.init()
    },
    submit() {
      this.$router.push('/pms/order-management/new')
    },
    async getConstant() {
      const res = await apiPub.getSupplier({ supplierCategory: 0 })
      this.$set(this.searchData._supplier, 'dataSource', res.data)
    },
    // 获取列表操作
    async init(data = {}) {
      const statusList = this.activeName === '2' ? [2, 8] : this.activeName * 1 ? [this.activeName * 1] : undefined
      const res = await api.list(this.searchParams, {
        pageSize: this.pagination.pageSize || 20,
        pageNum: this.pagination.pageNum || 1,
        statusList
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
          message: resCount.message,
          type: 'error'
        })
      }
      // tab数量
      const resCount = await api.count(this.searchParams)
      if (resCount.code === 200) {
        const count = resCount.data || {}
        const arr = [
          'allCount',
          'draftCount',
          'underReviewCount',
          'uploadCount',
          'undeliveredCount',
          'unreceivedCount',
          'completeCount',
          'cancelCount'
        ]
        this.tabs.forEach((i, index) => {
          this.$set(i, 'count', count[arr[index]] || 0)
        })
      } else {
        this.$message({
          message: resCount.message,
          type: 'error'
        })
      }
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
  /deep/ .el-table th > .cell {
    > :first-child {
      display: none;
    }
  }
}
</style>
