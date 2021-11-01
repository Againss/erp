<!--
 * @Author: pmr
 * @Description: 基础数据》复期设置
 * @Date: 2021-04-19
 * @LastEditors: pmr
 * @LastEditTime: 2021-04-19
-->
<template>
  <div class="standard-process-flow">
    <div class="process-top">
      <el-tabs v-model="activeName" class="commonTabs" @tab-click="handleClick">
        <el-tab-pane label="流程分类" name="1" />
        <el-tab-pane label="标准工序流程" name="2" />
      </el-tabs>
      <el-button v-permission="['userCenter:sysAppSystem:add']" class="process-button" size="small" type="primary" @click="doAdd">新增</el-button>
    </div>
    <!-- 搜索表单 -->
    <div v-if="activeName === '2'" class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table :columns="columns" :data-source="dataSource" :operates="popOperates" lazy :pagination="pagination" edit-type="pop" />
    </div>
    <!-- 导入pop弹出层 -->
    <details-pop ref="detailsPop" @add="addCallback" @modify="modifyCallback" />
  </div>
</template>
<script>
import { list, del, audited } from './api/index'
import logMethods from '@/views/product-center/mixin/log-methods'
import detailsPop from './details-pop'
import enableSwitch from '@/views/base-data/standard-process-flow/components/enableSwitch'
import label from './label'

export default {
  name: 'StrandardProgress',
  components: { detailsPop },
  mixins: [logMethods],
  data() {
    // 公共表头
    const commonColumns = {
      remark: { prop: 'remark', label: label.remark, minWidth: '200', showOverflowTooltip: true },
      createdBy: { prop: 'createdBy', label: label.createdBy, minWidth: '140', showOverflowTooltip: true },
      updatedTime: { prop: 'updatedTime', label: label.updatedTime, minWidth: '140', sortable: true, showOverflowTooltip: true },
      enableCode: { prop: 'enableCode', label: label.enableCode, minWidth: '80',
        components: { enableSwitch },
        componentsOptions: {
          permitTag: 'basic:fabrications:enabled',
          changeStatus: (scope) => {
            this.enableStatus({ id: scope.row.id }, scope)
          }
        }
      },
      statuDescrible: { prop: 'statuDescrible', label: label.statuDescrible, minWidth: '60', showOverflowTooltip: true,
        formater: scope => {
          const status = scope.row[scope.column.property] === '1' ? '未审核' : '已审核'
          return `<span style="color: ${status === '未审核' ? '#FF9B02' : '#00BCC5'};">${status}</span>`
        }
      }
    }
    const itemColumns = { // 流程分类表头
      code: { prop: 'code', label: label.code, minWidth: '60', showOverflowTooltip: true },
      categoryCode: { prop: 'categoryCode', label: label.categoryCode, minWidth: '80', showOverflowTooltip: true },
      categoryFlow: { prop: 'categoryFlow', label: label.categoryFlow, minWidth: '80', showOverflowTooltip: true },
      mode: { prop: 'mode', label: label.mode, minWidth: '70', showOverflowTooltip: true },
      ...commonColumns
    }
    const standardColumns = { // 标准工艺流程表头
      code: { prop: 'code', label: label.code, minWidth: '60', showOverflowTooltip: true },
      flowCode: { prop: 'flowCode', label: label.flowCode, minWidth: '80', showOverflowTooltip: true },
      processFlow: { prop: 'processFlow', label: label.processFlow, minWidth: '80', showOverflowTooltip: true },
      categoryFlow: { prop: 'categoryFlow', label: label.categoryFlow, minWidth: '70', showOverflowTooltip: true },
      ...commonColumns
    }
    // 操作栏 和权限配置
    let popOperatesDataSource = [
      { label: '修改', isShow: (params) => { return true }, handle: scope => this.$refs['detailsPop'].init(scope.row, this.activeName) },
      { label: '删除', style: { 'color': '#FE4949' }, isShow: true, handle: scope => { this.doDelete(scope.row) } },
      { label: '审核', isShow: () => true, handle: scope => { this.doAudited(scope) } }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    return {
      activeName: '1',
      formDatas: {},
      formOtions: { inline: true, size: 'small' },
      searchData: {
        flowCode: { prop: 'flowCode', itemType: 'input', label: `${label.flowCode}:`, placeholder: label.placeholder.flowCode },
        craftRequire: { prop: 'craftRequire', itemType: 'input', label: `${label.craftRequire}:`, placeholder: label.placeholder.craftRequire },
        processFlow: { prop: 'processFlow', itemType: 'input', label: `${label.processFlow}:`, placeholder: label.placeholder.processFlow },
        enableCode: { prop: 'enableCode', itemType: 'select', label: `${label.enableCode}:`, placeholder: label.placeholder.enableCode, dataSource: [{ value: 0, label: '全部' }, { value: 1, label: '启用' }, { value: 2, label: '禁用' }] },
        operate: { itemType: 'operate', submitText: '查询',
          submitHandle: params => {
            this.load(params)
            this.formDatas = params
          },
          resetHandle: () => {
            this.formDatas = {}
          }
        }
      },
      // 表格表头的配置信息
      columns: itemColumns,
      itemColumns,
      standardColumns,
      // 分页配置信息
      pagination: {
        currentChange: val => this.load({ pageSize: this.pagination.pageSize || 20, pageNum: val }),
        sizeChange: val => this.load({ pageNum: this.pagination.page || 1, pageSize: val })
      },
      popOperates: { label: '操作', width: '160', fixed: 'right', dataSource: popOperatesDataSource },
      dataSource: [] // 表格数据源
    }
  },
  created() {
    this.load()
  },
  methods: {
    // 新增
    doAdd() {
      this.$refs['detailsPop'].init({}, this.activeName)
    },
    // 新增后的回调
    addCallback(data = {}) {
      if (data.code === 200) {
        this.$message({ message: '新增成功', type: 'success' })
        this.load({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      }
    },
    // 更新后的回调
    modifyCallback(data = {}) {
      if (data.code === 200) {
        this.$message({ message: '修改成功', type: 'success' })
        this.load({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      }
    },
    doAudited(row = {}) {
      this.$confirm(' 审核后流程分类、染方式不允许修改，确定审核？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        this.audited(row)
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    /**
     * 审核
     * @param row
     * @returns {Promise<void>}
     */
    async audited(row = {}) {
      const { code = 0 } = await audited({ appSysId: row.id })
      if (code === 200) {
        this.fetchLog(this.getLog('DEL', '/userCenter/sysAppSystem/delete'), { appSysId: row.id }, JSON.stringify({ beforeText: `在'某系統-某頁面'删除一条记录`, beforeCode: { appSysId: row.id }}))
        this.$message.success('删除成功')
        this.list()
      }
    },
    // 删除
    async del(row = {}) {
      const { code = 0 } = await del({ appSysId: row.id })
      if (code === 200) {
        this.fetchLog(this.getLog('DEL', '/userCenter/sysAppSystem/delete'), { appSysId: row.id }, JSON.stringify({ beforeText: `在'某系統-某頁面'删除一条记录`, beforeCode: { appSysId: row.id }}))
        this.$message.success('删除成功')
        this.list()
      }
    },
    // 删除按钮事件
    doDelete(row) {
      this.$confirm(' 确认删除当前数据吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        this.del(row)
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    // tab栏切换
    handleClick(tab, event) {
      // console.log(tab, event)
      this.activeName = tab.name
      if (this.activeName === '1') {
        this.columns = this.itemColumns
      } else {
        this.columns = this.standardColumns
      }
    },
    // 获取列表数据
    async load(params = {}) {
      const { data = { list: [], total: 0, pageNum: 1, pageSize: 20 }, code = 0 } = await list(params)
      if (code === 200) {
        this.dataSource = data.list
        this.pagination = { ...this.pagination, dataTotal: data.total || 0, ...params, currentPage: data.pageNum, pageSize: params.pageSize, page: data.pageNum }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.standard-process-flow {
  padding: 20px;

  .process-top {
    display: flex;
    align-items: center;
    background-color: #fff;

    .process-button {
      margin-right: 20px;
    }
  }
}
</style>
<style lang="scss">
.standard-process-flow {
  .commonTabs {
    flex: 1;
    padding: 20px 20px 0;

    .el-tabs__item {
      line-height: 20px;
      font-size: 14px;
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
    .el-tabs__header {
      margin-bottom: 0;
    }
    // .el-tabs__content {
    //   margin: 0 -40px;
    // }
  }
}

.popOptionsClass {
  .el-textarea__inner{
    resize: none;
  }
}
</style>
