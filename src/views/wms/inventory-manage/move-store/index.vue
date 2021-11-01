<!--
 * @Author: Do not edit
 * @Date: 2020-12-03 09:13:35
 * @LastEditTime: 2019-10-15 15:00:45
 * @LastEditors: Aurnm
 **  移库管理页面
 -->
<template>
  <div class="page-main move-page">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
        :form-datas="formDatas"
      />
    </div>
    <!-- 页签和按钮部分 -->
    <div class="page-content move-tab">
      <el-tabs v-model="activeName" @tab-click="activeClick">
        <el-tab-pane v-for="(i, index) in tabs" :key="index" :name="i.value">
          <span slot="label" :name="i.value">
            {{ `${i.label} (${i.num})` }}</span></el-tab-pane>
      </el-tabs>
      <div class="tab-btns">
        <el-button
          v-permission="['wms:inner:moveStock:add']"
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="addList"
        >新增移库单</el-button>
      </div>
    </div>

    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        ref="table"
        :table-scrollx="true"
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        :data-total="dataSource.length"
        edit-type="pop"
      />
    </div>
  </div>
</template>

<script>
import {
  movePage,
  moveAudit,
  moveDelete,
  batchGet,
  count
} from './api/index.js'
import { fetchLog } from '@/views/wms/public/fetchLog'
export default {
  name: 'MoveStore',
  components: {},
  mixins: [fetchLog],
  data() {
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'moveStockId',
        itemType: 'input',
        label: '移库单号',
        clearable: true,
        placeholder: '请输入单号'
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          this.getRulePage(params)
          this.searchFormDatas = params
        },
        resetHandle: (params) => {
          this.searchFormDatas = {}
        }
      }
    ]
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'index',
        label: '序号',
        minWidth: '50'
      },
      {
        prop: 'moveStockId',
        label: '移库单号',
        minWidth: '180',
        handle: (scope) => {
          this.$router.push({
            path: '/wms/inventory-manage/move-store/components/details/',
            query: {
              moveStockId: scope.row.moveStockId,
              status: scope.row.status
            }
          })
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'moveAmount',
        label: '移出数',
        minWidth: '100',
        align: 'right'
      },
      {
        prop: 'warehouseName',
        label: '仓库地址',
        minWidth: '180'
      },
      {
        prop: 'moveReason',
        label: '移库原因',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'createdByName',
        label: '创建人',
        minWidth: '100'
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
        prop: 'finishTime',
        label: '移库完成时间',
        minWidth: '150',
        formater: (scope) => {
          return scope.row.finishTime
            ? this.$filters.parseTime(
              scope.row.finishTime || 0,
              '{y}-{m}-{d} {h}:{i}'
            )
            : '--'
        }
      },
      {
        prop: 'status',
        label: '状态',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.getStatus(scope.row)
        },
        isShow: () => {
          return this.activeName === 'all'
        }
      }
    ]
    let popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: ['wms:inner:moveStock:modify'],
        isShow: (scope) => {
          return scope.row.status === 2
        },
        handle: (scope) => {
          // 跳转到新增--编辑的页面
          this.$router.push({
            path: '/wms/inventory-manage/move-store/components/create/',
            query: { moveStockId: scope.row.moveStockId, type: 'edit' }
          })
        }
      },
      {
        label: '审核',
        permitTag: ['wms:inner:moveStock:audit'],
        isShow: (scope) => {
          return scope.row.status === 2
        },
        handle: (scope) => {
          // 审核
          this.$confirm('确认审核当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'customClass'
          })
            .then(() => {
              this.approveData(scope.row.moveStockId)
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
        label: '打印',
        permitTag: ['wms:inner:moveStock:print'],
        isShow: (scope) => {
          return scope.row.status === 0
        },
        handle: (scope) => {
          // 跳转到打印页面
          this.$router.push({
            path: '/wms/inventory-manage/move-store/components/print',
            query: { moveStockId: scope.row.moveStockId, type: 'print' }
          })
        }
      },
      {
        label: '详情',
        permitTag: ['wms:inner:moveStock:info'],
        isShow: true,
        handle: (scope) => {
          // 跳转到详情页面
          this.$router.push({
            path: '/wms/inventory-manage/move-store/components/details/',
            query: {
              moveStockId: scope.row.moveStockId,
              status: scope.row.status
            }
          })
        }
      },
      {
        label: '完成移库',
        permitTag: ['wms:inner:moveStock:status:modify'],
        isShow: (scope) => {
          return scope.row.status === 0
        },
        handle: (scope) => {
          // 完成移库操作
          this.$confirm('确认移库当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'customClass'
          })
            .then(() => {
              this.getMove(scope.row.moveStockId)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消移库'
              })
            })
        }
      },
      {
        label: '删除',
        style: { color: '#FE4949' },
        permitTag: ['wms:inner:moveStock:delete'],
        isShow: (scope) => {
          return scope.row.status === 2
        },
        handle: (scope) => {
          this.$confirm('确认删除当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'customClass'
          })
            .then(() => {
              this.deleteData(scope.row.moveStockId)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        }
      }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '200',
      fixed: 'right',
      dataSource: popOperatesDataSource
    }
    // 分页配置信息
    const pagination = {
      currentChange: (val) => {
        this.getRulePage({
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.pagination.pageSize = val
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        this.getRulePage({ pageNum: this.pagination.pageNum, pageSize: val })
      }
    }
    const tabs = [
      { value: 'all', label: '全部', num: 0 },
      { value: '2', label: '待审核', num: 0 },
      { value: '0', label: '待移库', num: 0 },
      { value: '1', label: '已移库', num: 0 }
    ]
    return {
      tabs,
      activeName: 'all',
      formOtions: {
        // layout: true,
        size: 'small',
        inline: true
      },
      formDatas: {},
      searchData,
      columns,
      dataSource: [],
      pagination,
      popOperates
    }
  },
  watch: {},
  created() {
    this.getRulePage()
  },
  mounted() {},
  methods: {
    // 新增--跳转到别的页面
    addList() {
      // this.$router.push('/wms/inventory-manage/move-store/components/create')
      // 跳转到新增页面
      this.$router.push({
        path: '/wms/inventory-manage/move-store/components/create/',
        query: { type: 'create' }
      })
    },
    activeClick() {
      this.getRulePage()
    },
    // 列表查询
    async getRulePage(data = {}) {
      let obj
      if (this.activeName === 'all') {
        obj = {}
      } else {
        obj = { status: this.activeName - 0 }
      }
      const res = await movePage({ ...this.searchFormDatas, ...obj, ...data })
      this.dataSource =
        (res.data.list &&
          res.data.list.map((item, index) => {
            item.index = (res.data.pageNum - 1) * res.data.pageSize + index + 1
            return item
          })) ||
        []
      this.total = res.data.total || {}
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize,
        page: res.data.pageNum
      }

      const countRes = await count({ ...this.searchFormDatas, ...data })
      if (res.code === 200) {
        const arr = ['all', 'draft', 'pending', 'finish']
        this.tabs.forEach((i, index) => {
          i['num'] = countRes.data[arr[index]]
        })
      }
    },
    // 状态变颜色
    getStatus(data) {
      let str = ''
      switch (data.status) {
        case 0:
          str = '<span style="color:#FF9B02">待移库</span>'
          break
        case 1:
          str = '<span style="color:#00BCC5">已移库</span>'
          break
        case 2:
          str = '<span style="color:#FF9B02">待审核</span>'
          break
        default:
          break
      }
      return str
    },
    // 删除
    async deleteData(id) {
      const res = await moveDelete({ moveStockId: id })
      if (res.code !== 200) {
        return false
      }
      // 日志--删除
      this.fetchLog(
        this.getLogMessages('DEL', '/wms/moveStock/delete'),
        id,
        JSON.stringify({
          beforeText: `在'仓储管理-库内管理-移库管理', 删除一条记录`,
          beforeCode: { moveStockId: id }
        })
      )
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.getRulePage({
        pageNum: this.pagination.pageNum || 1,
        pageSize: this.pagination.pageSize || 20
      })
    },
    // 完成移库
    async getMove(moveStockId) {
      const res = await batchGet({ moveStockId: moveStockId })
      if (res.code !== 200) {
        return false
      }
      // 日志--完成移库
      this.fetchLog(
        this.getLogMessages('UPDATE', '/wms/moveStock//status/modify'),
        moveStockId,
        JSON.stringify({
          beforeText: `在'仓储管理-库内管理-移库管理', 完成移库一条记录`,
          afterCode: { moveStockId: moveStockId }
        })
      )
      this.$message({
        type: 'success',
        message: '移库成功!'
      })
      this.getRulePage({
        pageNum: this.pagination.pageNum || 1,
        pageSize: this.pagination.pageSize || 20
      })
    },
    // 审核
    async approveData(moveStockId) {
      const res = await moveAudit({ moveStockId: moveStockId })
      if (res.code !== 200) {
        return false
      }
      // 日志--审核
      this.fetchLog(
        this.getLogMessages('UPDATE', '/wms/moveStock/audit'),
        moveStockId,
        JSON.stringify({
          beforeText: `在'仓储管理-库内管理-移库管理', 审核一条记录`,
          beforeCode: { moveStockId: moveStockId }
        })
      )
      this.$message({
        type: 'success',
        message: '审核成功!'
      })
      this.getRulePage({
        pageNum: this.pagination.pageNum || 1,
        pageSize: this.pagination.pageSize || 20
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.move-page {
  .move-tab {
    /deep/ .el-tabs__header {
      margin: 1px;
    }
  }
}
</style>
