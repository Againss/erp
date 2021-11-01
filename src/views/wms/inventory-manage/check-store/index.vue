<!--
 * @Author: Do not edit
 * @Date: 2020-12-03 09:13:35
 * @LastEditTime: 2019-10-15 15:00:45
 * @LastEditors: Aurnm
 **  盘点管理页面
 -->
<template>
  <div class="page-main check-store-page">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 页签和按钮部分 -->
    <div class="check-tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 盘点计划单表格 -->
        <el-tab-pane name="all">
          <span slot="label" class="label">盘点计划单</span>
          <div class="page-table">
            <cs-custom-table
              tooltip-effect="dark"
              :table-scrollx="true"
              :columns="columns"
              :data-source="dataSource"
              :pagination="pagination"
              :operates="popOperates"
            />
          </div>

        </el-tab-pane>
        <!-- 盘亏单 -->
        <el-tab-pane name="2">
          <span slot="label" class="label">盘亏单</span>
          <div class="page-table">
            <cs-custom-table
              tooltip-effect="dark"
              :columns="lossColumns"
              :table-scrollx="true"
              :data-source="dataSource"
              :pagination="pagination"
              :operates="popOperates"
            />
          </div>

        </el-tab-pane>
        <!-- 盘盈单 -->
        <el-tab-pane name="1">
          <span slot="label" class="label">盘盈单</span>
          <div class="page-table">
            <cs-custom-table
              tooltip-effect="dark"
              :columns="profitColumns"
              :table-scrollx="true"
              :data-source="dataSource"
              :pagination="pagination"
              :operates="popOperates"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="tab-btns">
        <el-button
          v-permission="['wms:inner:checkPlan:add']"
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="addList"
        >新建盘点计划单</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { checkPage, storeWarehouse, checkDelete, checkApprove } from './api/index.js'
import { fetchLog } from '@/views/wms/public/fetchLog'
export default {
  name: 'CheckStore',
  components: {},
  mixins: [fetchLog],
  data() {
    const itemStyle = { width: '33%' }
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'checkPlanId',
        itemType: 'input',
        label: '盘点计划单号',
        clearable: true,
        placeholder: '请输入单号',
        itemStyle
      },
      {
        prop: 'warehouseCode',
        itemType: 'select',
        clearable: true,
        label: '仓库',
        dataSource: [],
        visibleChange: (value) => {
          if (value) {
            this.warehouseOption()
          }
        },
        itemStyle
      },
      {
        itemType: 'date',
        type: 'daterange',
        prop: 'dateRange',
        label: '创建时间',
        itemStyle,
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd',
        valueFormat: 'timestamp',
        defaultTime: ['00:00:00', '23:59:59']
      },
      {
        prop: 'status',
        itemType: 'select',
        label: '状态',
        dataSource: [
          {
            label: '待审核',
            value: '0'
          },
          {
            label: '待盘点',
            value: '1'
          },
          {
            label: '已盘点',
            value: '2'
          },
          {
            label: '核账中',
            value: '4'
          },
          {
            label: '核账成功',
            value: '5'
          },
          {
            label: '核账失败',
            value: '6'
          }
        ],
        itemStyle
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          if (params.dateRange) {
            params.createdTime = params.dateRange[0]
            params.createdTimeEnd	 = params.dateRange[1]
          } else {
            params.createdTime = null
            params.createdTimeEnd	 = null
          }
          this.getRulePage(params)
          this.searchFormDatas = params
        },
        resetHandle: (params) => {
          this.searchFormDatas = {}
        }
      }
    ]
    // 盘点计划单表头的配置信息
    const columns = [
      {
        prop: 'checkPlanId',
        label: '盘点计划单号',
        minWidth: '150',
        handle: (scope) => {
          this.$router.push({
            path:
              '/wms/inventory-manage/check-store/components/details',
            query: { checkPlanId: scope.row.checkPlanId }
          })
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'warehouseName',
        label: '盘点仓库',
        minWidth: '150'
      },
      {
        prop: 'checkType',
        label: '盘点类型',
        minWidth: '100',
        formater: scope => {
          return scope.row[scope.column.property] === '1' ? '明盘' : scope.row[scope.column.property] === '2' ? '盲盘' : ''
        }
      },
      {
        prop: 'checkAmount',
        label: '实际总件数',
        minWidth: '100',
        align: 'right'
      },
      {
        prop: 'createdByName',
        label: '创建人',
        minWidth: '110'
      },
      {
        prop: 'createdTime',
        label: '创建时间',
        minWidth: '150',
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.createdTime || 0,
            '{y}-{m}-{d} {h}:{i}'
          )
        }
      },
      {
        prop: 'checkStartTime',
        label: '盘点开始时间',
        minWidth: '150',
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.checkStartTime || 0,
            '{y}-{m}-{d} {h}:{i}'
          )
        }
      },
      {
        prop: 'checkEndTime',
        label: '盘点结束时间',
        minWidth: '150',
        formater: (scope) => {
          return scope.row.checkEndTime ? this.$filters.parseTime(
            scope.row.checkEndTime || 0,
            '{y}-{m}-{d} {h}:{i}'
          ) : '--'
        }
      },
      {
        prop: 'status',
        label: '状态',
        minWidth: '110',
        showOverflowTooltip: true,
        formater: scope => {
          return this.getStatus(scope.row)
        }
      }
    ]
    // 盘亏单表头的配置信息
    const lossColumns = [
      {
        prop: 'checkPlanId',
        label: '盘亏单号',
        minWidth: '150',
        handle: (scope) => {
          // 进入盘亏单详情页面
          this.$router.push({
            path:
              '/wms/inventory-manage/check-store/components/lossDetails',
            query: { checkPlanId: scope.row.checkPlanId, checkResultType: 2 }
          })
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'outStockCode',
        label: '出库单号',
        minWidth: '150'
      },
      {
        prop: 'warehouseName',
        label: '盘点仓库',
        minWidth: '150'
      },
      {
        prop: 'checkAmount',
        label: '实际数量',
        minWidth: '100',
        align: 'right'
      },
      {
        prop: 'actualLossAmount',
        label: '盘亏数量',
        minWidth: '100',
        align: 'right'
      },
      {
        prop: 'createdByName',
        label: '创建人',
        minWidth: '110'
      },
      {
        prop: 'checkStartTime',
        label: '盘点开始时间',
        minWidth: '150',
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.checkStartTime || 0,
            '{y}-{m}-{d} {h}:{i}'
          )
        }
      },
      {
        prop: 'checkEndTime',
        label: '盘点结束时间',
        minWidth: '150',
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.checkEndTime || 0,
            '{y}-{m}-{d} {h}:{i}'
          )
        }
      },
      {
        prop: 'financeAuditName',
        label: '核账人',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'status',
        label: '状态',
        minWidth: '110',
        showOverflowTooltip: true,
        formater: scope => {
          return this.getStatus(scope.row)
        }
      }
    ]
    // 盘盈单表头的配置信息
    const profitColumns = [
      {
        prop: 'checkPlanId',
        label: '盘盈单号',
        minWidth: '150',
        handle: (scope) => {
          this.$router.push({
            path:
              '/wms/inventory-manage/check-store/components/profitDetails',
            query: { checkPlanId: scope.row.checkPlanId, checkResultType: 1 }
          })
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'inStockCode',
        label: '入库单号',
        minWidth: '150'
      },
      {
        prop: 'warehouseName',
        label: '盘点仓库',
        minWidth: '150'
      },
      {
        prop: 'checkAmount',
        label: '实际件数',
        minWidth: '100',
        align: 'right'
      },
      {
        prop: 'actualMoreAmount',
        label: '盘盈数量',
        minWidth: '100',
        align: 'right'
      },
      {
        prop: 'createdByName',
        label: '创建人',
        minWidth: '110',
        showOverflowTooltip: true
      },
      {
        prop: 'checkStartTime',
        label: '盘点开始时间',
        minWidth: '150',
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.checkStartTime || 0,
            '{y}-{m}-{d} {h}:{i}'
          )
        }
      },
      {
        prop: 'checkEndTime',
        label: '盘点结束时间',
        minWidth: '150',
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.checkEndTime || 0,
            '{y}-{m}-{d} {h}:{i}'
          )
        }
      },
      {
        prop: 'financeAuditName',
        label: '核账人',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'status',
        label: '状态',
        minWidth: '110',
        showOverflowTooltip: true,
        formater: scope => {
          return this.getStatus(scope.row)
        }
      }
    ]
    let popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: ['wms:inner:checkPlan:modify'],
        isShow: (scope) => {
          return scope.row.status === 0
        },
        handle: scope => {
          // 编辑跳转到新建盘点单页面
          this.$router.push({
            path:
            '/wms/inventory-manage/check-store/components/create/',
            query: { checkPlanId: scope.row.checkPlanId, type: 'edit' }
          })
        }
      },
      {
        label: '审核',
        permitTag: ['wms:inner:checkPlan:status:modify'],
        isShow: (scope) => {
          return scope.row.status === 0
        },
        handle: scope => {
          this.$confirm('确认审核当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'customClass'
          })
            .then(() => {
              this.approveData(scope.row.checkPlanId)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消审核'
              })
            })
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['wms:inner:checkPlan:delete'],
        isShow: (scope) => {
          return scope.row.status === 0
        },
        handle: scope => {
          this.$confirm('确认删除当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'customClass'
          })
            .then(() => {
              this.deleteData(scope.row.checkPlanId)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        }
      },
      {
        label: '打印',
        permitTag: ['wms:inner:checkPlan:print'],
        isShow: (scope) => {
          return scope.row.status === 1
        },
        handle: scope => {
          this.$router.push({
            path:
            '/wms/inventory-manage/check-store/components/print',
            query: { checkPlanId: scope.row.checkPlanId }
          })
        }
      },
      {
        label: '盘点确认',
        permitTag: ['wms:inner:checkPlan:confirm'],
        isShow: (scope) => {
          return scope.row.status === 1
        },
        handle: scope => {
          this.$router.push({
            path:
              '/wms/inventory-manage/check-store/components/makeCheck',
            query: { checkPlanId: scope.row.checkPlanId }
          })
        }
      },
      // {
      //   label: '财务核账',
      //   // permitTag: ['basic:countries:update'],
      //   isShow: (scope) => {
      //     if (this.activeName === '1' || this.activeName === '2') {
      //       return scope.row.status === 2
      //     }
      //   },
      //   handle: scope => {

      //   }
      // },
      {
        label: '复盘',
        permitTag: ['wms:inner:checkPlan:confirm'],
        isShow: (scope) => {
          return scope.row.status === 6
        },
        handle: scope => {

        }
      },
      {
        label: '详情',
        permitTag: ['wms:inner:checkPlan:info'],
        isShow: true,
        handle: scope => {
          // 跳转到盘点计划单
          if (this.activeName === 'all') {
            this.$router.push({
              path:
              '/wms/inventory-manage/check-store/components/details',
              query: { checkPlanId: scope.row.checkPlanId }
            })
          } else if (this.activeName === '1') {
            // 进入盘盈单详情页面
            this.$router.push({
              path:
              '/wms/inventory-manage/check-store/components/profitDetails',
              query: { checkPlanId: scope.row.checkPlanId, checkResultType: 1 }
            })
          } else if (this.activeName === '2') {
            // 进入盘亏单详情页面
            this.$router.push({
              path:
              '/wms/inventory-manage/check-store/components/lossDetails',
              query: { checkPlanId: scope.row.checkPlanId, checkResultType: 2 }
            })
          }
        }
      }]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '200',
      fixed: 'right',
      dataSource: popOperatesDataSource
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getRulePage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        this.getRulePage({ pageNum: this.pagination.pageNum, pageSize: val })
      }
    }
    return {
      activeName: 'all',
      highlight: true,
      formOtions: {
        layout: true,
        size: 'small',
        inline: true
      },
      formDatas: {
        status: ''
      },
      searchData,
      columns,
      dataSource: [],
      // 盘亏单列表信息
      lossColumns,
      // 盘盈单列表信息
      profitColumns,
      pagination,
      popOperates
    }
  },
  created() {
    this.getRulePage()
    this.warehouseOption()
  },
  mounted() {},
  methods: {
    // 新建--跳转到新建盘点单页面
    addList() {
      this.$router.push({
        path:
          '/wms/inventory-manage/check-store/components/create/',
        query: { type: 'create' }
      })
    },
    // 跳转到详情页面
    addLists() {
      this.$router.push('/wms/inventory-manage/check-store/components/details')
    },
    handleClick() {
      this.getRulePage()
    },
    // 仓库下拉数据
    async warehouseOption(data = {}) {
      const res = await storeWarehouse({ enable: 1 })
      if (res.code !== 200) {
        return false
      }
      const warehouseData = (res.data.list || []).map(item => {
        return { value: item.code, label: item.name }
      })
      this.searchData[1].dataSource = [...warehouseData]
    },
    // 列表查询
    async getRulePage(data = {}) {
      let obj
      if (this.activeName === 'all') {
        obj = {}
      } else {
        obj = { checkResultType: this.activeName - 0 }
      }
      const res = await checkPage({ ...this.searchFormDatas, ...obj, ...data })
      const listData = res.data ? res.data.list : []
      this.dataSource = listData
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: data.pageSize,
        pageNum: res.data.pageNum
      }
    },
    // 表格中状态变化
    getStatus(data) {
      if (data.status === 0) {
        return '<span style="color:#FF9214">待审核</span>'
      } else if (data.status === 1) {
        return '<span style="color:#FF9214">待盘点</span>'
      } else if (data.status === 2) {
        if (this.activeName === 'all') {
          return '<span style="color:#00BCC5">已盘点</span>'
        } else if (this.activeName === '1' || this.activeName === '2') {
          return '<span style="color:#FF9214">等待核账</span>'
        }
      } else if (data.status === 4) {
        return '<span style="color:#FF9214">核账中</span>'
      } else if (data.status === 5) {
        return '<span style="color:#00BCC5">核账成功</span>'
      } else if (data.status === 6) {
        return '<span style="color:#888E9E">核账失败</span>'
      }
    },
    // 审核
    async approveData(id) {
      const res = await checkApprove({ checkPlanId: id })
      if (res.code !== 200) {
        return false
      }
      // 日志--审核
      this.fetchLog(
        this.getLogMessages(
          'UPDATE',
          '/wms/checkPlan/status/modify'
        ),
        id,
        JSON.stringify({
          beforeText: `在'仓储管理-库内管理-盘点管理', 审核一条记录`, beforeCode: { checkPlanId: id }
        })
      )
      this.$message({
        type: 'success',
        message: '审核成功!'
      })
      this.getRulePage({ pageNum: this.pagination.pageNum || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 删除
    async deleteData(id) {
      const res = await checkDelete({ checkPlanId: id })
      if (res.code !== 200) {
        return false
      }
      // 日志--删除
      this.fetchLog(this.getLogMessages('DEL', '/wms/checkPlan/delete'), id, JSON.stringify({ beforeText: `在'仓储管理-库内管理-盘点管理', 删除一条记录`, beforeCode: { checkPlanId: id }}))
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.getRulePage({ pageNum: this.pagination.pageNum || 1, pageSize: this.pagination.pageSize || 20 })
    }
  }
}
</script>

<style lang='scss' scoped>
.check-store-page {
  /deep/.el-tabs__nav-wrap {
    padding-left: 20px;
    margin-left: 0;
    margin-right: 0;
  }
  .check-tabs {
    position: relative;
    background: #fff;
    /deep/.el-tabs__nav .el-tabs__item {
      height: 60px;
      line-height: 60px;
    }
    /deep/ .el-tabs__header {
      margin: 1px;
    }
  }
}
</style>
