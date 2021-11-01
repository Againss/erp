<template>
  <div class="standard-process-flow">
    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="试纱项目" name="1" />
        <el-tab-pane label="试染颜色" name="2" />
      </el-tabs>
      <el-button v-permission="['baseData:qa:yarnTestConfig:add', 'baseData:qa:dyeColorTestConfig:add']" class="button" size="small" type="primary" @click="doAdd">新增</el-button>
    </div>
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table :columns="columns" :data-source="dataSource" :operates="popOperates" lazy table-scrollx :pagination="pagination" edit-type="pop" :header-cell-class-name="handleHeaderClass" @sort-change="changeSort" />
    </div>
    <!-- 导入pop弹出层 -->
    <details-pop ref="detailsPop" @add="doSave" @edit="doSave" />
  </div>
</template>
<script>
import { page as listYarnTest, del as delYarnTest, isEnable as isEnableYarnTest, audited as auditedYarnTest } from './api/index'
import { list as listDyeColor, del as delDyeColor, isEnable as isEnableDyeColor, audited as auditedDyeColor } from './api/dyeColor'
import logMethods from '@/views/product-center/mixin/log-methods'
import detailsPop from './details-pop'
import enableSwitch from './components/enableSwitch'
import label from './label'

export default {
  name: 'YarnTestingProject',
  components: { detailsPop },
  mixins: [logMethods],
  data() {
    // 公共表头
    const commonColumns = {
      orders: { prop: 'orders', label: label.orders, sortable: 'custom', width: '120', showOverflowTooltip: true },
      remarks: { prop: 'remarks', label: label.remarks, minWidth: '200', showOverflowTooltip: true },
      createdBy: { prop: 'updatedBy', label: label.updatedBy, width: '140', showOverflowTooltip: true },
      updatedTime: { prop: 'updatedTime', label: label.updatedTime, sortable: 'custom', width: '140', showOverflowTooltip: true, formater: (scope) => {
        return scope.row.updatedTime ? this.$filters.parseTime(scope.row.updatedTime, '{y}-{m}-{d} {h}:{i}') : '-'
      } },
      isEnabled: { prop: 'isEnabled', label: label.isEnabled, width: '100',
        components: { enableSwitch },
        componentsOptions: {
          permitTag: ['baseData:qa:yarnTestConfig:enabled', 'baseData:qa:dyeColorTestConfig:enabled'],
          changeStatus: (scope) => {
            this.enableStatus({ uuid: scope.row.uuid }, scope)
          }
        }
      },
      status: { prop: 'status', label: label.status, width: '80', showOverflowTooltip: true,
        formater: scope => {
          const status = scope.row[scope.column.property] === 'N' ? '未审核' : '已审核'
          return `<span style="color: ${status === '未审核' ? '#FF9B02' : '#00BCC5'};">${status}</span>`
        }
      }
    }
    const itemColumns = { // 试纱项目表头
      code: { prop: 'code', label: label.code, width: '80', showOverflowTooltip: true },
      name: { prop: 'name', label: label.name, width: '120', showOverflowTooltip: true },
      nameEn: { prop: 'nameEn', label: label.nameEn, width: '120', showOverflowTooltip: true },
      unit: { prop: 'unit', label: label.unit, width: '120', showOverflowTooltip: true, formater: scope => this.getLabelByKey(this.unitDataSource, scope.row.unit) || scope.row.unit },
      ...commonColumns
    }
    const standardColumns = { // 试染颜色表头
      code: { prop: 'code', label: label.code, width: '80', showOverflowTooltip: true },
      name: { prop: 'name', label: label.name, width: '120', showOverflowTooltip: true },
      nameEn: { prop: 'nameEn', label: label.nameEn, width: '120', showOverflowTooltip: true },
      ...commonColumns
    }
    // 操作栏 和权限配置
    let popOperatesDataSource = [
      { label: '编辑', permitTag: ['baseData:qa:yarnTestConfig:modify', 'baseData:qa:dyeColorTestConfig:modify'], isShow: (params) => { return true }, handle: scope => this.$nextTick(() => this.$refs['detailsPop'].init(scope.row, this.activeName)) },
      { label: '删除', permitTag: ['baseData:qa:yarnTestConfig:delete', 'baseData:qa:dyeColorTestConfig:delete'], style: { 'color': '#FE4949' }, isShow: scope => scope.row.status === 'N', handle: scope => { this.doDelete(scope.row) } },
      { label: '审核', permitTag: ['baseData:qa:yarnTestConfig:audited', 'baseData:qa:dyeColorTestConfig:audited'], isShow: scope => scope.row.status === 'N', handle: scope => this.doAudited(scope.row) }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    return {
      ordersList: [],
      activeName: '1',
      tabName: '1',
      formDatas: {
        asc: '',
        desc: '' // 1排序字段2时间，逗号分隔
      },
      formOtions: { inline: true, size: 'small' },
      searchData: {
        name: { prop: 'name', itemType: 'input', label: `名称:`, clearable: true, placeholder: label.placeholder.name },
        isEnabled: { prop: 'isEnabled', itemType: 'select', label: `${label.isEnabled}:`, clearable: true, placeholder: label.placeholder.isEnabled, dataSource: [{ value: 1, label: '启用' }, { value: 0, label: '禁用' }] },
        operate: { itemType: 'operate', submitText: '查询',
          submitHandle: params => {
            this.formDatas = Object.assign({ asc: '', desc: '' }, this.formDatas, params)
            this.load(this.formDatas)
          },
          resetHandle: () => {
            this.formDatas = { asc: '', desc: '' }
          }
        }
      },
      // 表格表头的配置信息
      columns: itemColumns,
      itemColumns,
      standardColumns,
      // 分页配置信息
      pagination: {
        page: 1,
        pageSize: 20,
        currentChange: val => this.load({ pageSize: this.pagination.pageSize || 20, pageNum: val }),
        sizeChange: val => this.load({ pageNum: this.pagination.page || 1, pageSize: val })
      },
      popOperates: { label: '操作', width: '160', fixed: 'right', dataSource: popOperatesDataSource },
      dataSource: [], // 表格数据源
      unitDataSource: label.dict.UNITS
    }
  },
  created() {
    this.load(this.formDatas)
  },
  methods: {
    /**
     * 通过key获取label名称
     * @param arr 列表数据源
     * @param key key值
     * @returns {*}
     */
    getLabelByKey(arr = [], key = '') {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].value === key) {
          return arr[i].label
        }
      }
    },
    handleOrderChange(orderColumn, orderState) {
      const result = this.ordersList.find(e => e.orderColumn === orderColumn)
      if (result) {
        // result.orderState = orderState
        const index = this.ordersList.findIndex(n => n.orderColumn === result.orderColumn)
        this.ordersList[index].orderState = orderState
      } else { // 第一次没有找到，push点击的字段和排序到orderList
        this.ordersList.push({
          orderColumn: orderColumn,
          orderState: orderState
        })
      }
      this.formDatas.asc = this.ordersList.filter(n => n.orderState === 'ascending').map(n => n.orderColumn === 'orders' ? '1' : '2').join() || '' // 升序
      this.formDatas.desc = this.ordersList.filter(n => n.orderState === 'descending').map(n => n.orderColumn === 'orders' ? '1' : '2').join() || '' // 降序
      // 调接口查询，在传参的时候把ordersList进行处理成后端想要的格式
      this.load(this.formDatas)
    },
    handleHeaderClass({ column }) {
      column.order = column.multiOrder
      console.log(column)
    },
    /**
     * 排序点击事件
     */
    changeSort({ column, prop, order }) {
      console.log('--changeSort--')
      console.log(column, prop, order)
      // 有些列不需要排序，提前返回
      if (column.sortable !== 'custom') {
        return
      }
      if (!column.multiOrder) {
        column.multiOrder = 'descending'
      } else if (column.multiOrder === 'descending') {
        column.multiOrder = 'ascending'
      } else {
        column.multiOrder = ''
      }
      this.handleOrderChange(column.property, column.multiOrder)
    },
    // 新增
    doAdd() {
      this.$nextTick(() => {
        this.$refs['detailsPop'].init({}, this.activeName)
      })
    },
    // 保存后的回调函数
    doSave(data = {}) {
      if (data.code === 200) {
        this.$message({ message: '操作成功', type: 'success' })
        this.load({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      }
    },
    // 审核
    auditedYarnTest(row) {
      this.$confirm(' 确认审核当前数据吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(async() => {
        const { code = 0 } = await auditedYarnTest({ uuid: row.uuid })
        if (code === 200) {
          this.fetchLog(this.getLog('DEL', '/baseData/qa/yarnTestConfig/audited'), { id: row.uuid }, JSON.stringify({ beforeText: `在'某系統-某頁面'删除一条记录`, beforeCode: { id: row.uuid }}))
          this.$message.success('审核成功')
          this.load({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
        }
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    // 审核
    auditedDyeColor(row) {
      this.$confirm(' 确认审核当前数据吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(async() => {
        const { code = 0 } = await auditedDyeColor({ uuid: row.uuid })
        if (code === 200) {
          this.fetchLog(this.getLog('DEL', '/baseData/qa/dyeColorTestConfig/audited'), { id: row.uuid }, JSON.stringify({ beforeText: `在'某系統-某頁面'删除一条记录`, beforeCode: { id: row.uuid }}))
          this.$message.success('审核成功')
          this.load({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
        }
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    // 审核
    doAudited(row) {
      if (this.activeName === '1') {
        this.auditedYarnTest(row) // 试纱项目
      } else {
        this.auditedDyeColor(row) // 试染颜色
      }
    },
    getLog(opratorType, api) {
      const { userInfo, topic } = this.$store.state.user
      const baseURL = this.$store.state.app.baseURL
      const logcommonMessages = {
        type: 'OP', // 日誌類型
        appId: 'baseData', // 系統id
        handleResult: 'SUCCESS',
        userId: userInfo.userId,
        realName: userInfo.realName,
        userName: userInfo.name,
        topic: topic,
        description: '',
        createTime: new Date().getTime()
      }
      return {
        ...logcommonMessages,
        opratorType: opratorType,
        api: baseURL + api
      }
    },
    // 删除
    async delYarnTest(row = {}) {
      const { code = 0 } = await delYarnTest({ uuid: row.uuid })
      if (code === 200) {
        this.fetchLog(this.getLog('DEL', '/baseData/qa/yarnTestConfig/delete'), { id: row.uuid }, JSON.stringify({ beforeText: `在'基础数据-质量基础资料-试纱项目'删除一条记录`, beforeCode: { id: row.uuid }}))
        this.$message.success('删除成功')
        this.load({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      }
    },
    // 删除
    async delDyeColor(row = {}) {
      const { code = 0 } = await delDyeColor({ uuid: row.uuid })
      if (code === 200) {
        this.fetchLog(this.getLog('DEL', '/baseData/qa/dyeColorTestConfig/delete'), { id: row.uuid }, JSON.stringify({ beforeText: `在'某系統-某頁面'删除一条记录`, beforeCode: { id: row.uuid }}))
        this.$message.success('删除成功')
        this.load({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      }
    },
    // 删除按钮事件
    doDelete(row) {
      this.$confirm(' 确认删除当前数据吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        if (this.activeName === '1') {
          this.delYarnTest(row) // 试纱项目
        } else {
          this.delDyeColor(row) // 试染颜色
        }
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    // tab栏切换
    handleClick(tab, event) {
      if (this.activeName === this.tabName) { // 点击的是当前高亮的tab项，不执行任何操作
        return
      }
      this.tabName = tab.name
      this.ordersList = []
      this.formDatas = {}
      if (this.activeName === '1') { // 试纱项目
        this.pagination = {
          page: 1,
          pageSize: 20,
          currentChange: val => this.load({ pageSize: this.pagination.pageSize || 20, pageNum: val }),
          sizeChange: val => this.load({ pageNum: this.pagination.page || 1, pageSize: val })
        }
        this.columns = this.itemColumns
        this.load({ pageNum: 1, pageSize: 20 })
      } else { // 试染颜色
        this.pagination = {} // 不显示分页
        this.columns = this.standardColumns
        this.load()
      }
    },
    // 页面启用禁用
    async isEnableYarnTest(data = {}, scope) {
      const { code = 0, message = '' } = await isEnableYarnTest(data).catch(() => { scope.row.isEnabled = !scope.row.isEnabled })
      if (code === 200) {
        this.$message({ message: '更新状态成功', type: 'success' })
        this.fetchLog(
          this.getLogMessages('UPDATE', '/baseData/qa/yarnTestConfig/enabled', 'baseData'),
          { id: scope.row.uuid },
          JSON.stringify({
            beforeText: `在"-基础数据-质量基础资料-试纱项目"${scope.row.status === 'Y' ? '启用' : '禁用'}一条记录`,
            beforeCode: { id: scope.row.uuid }
          })
        )
      } else {
        this.$message({ message: message || '更新状态失败', type: 'error' })
      }
    },
    // 页面启用禁用
    async isEnableDyeColor(data = {}, scope) {
      const { code = 0, message = '' } = await isEnableDyeColor(data).catch(() => { scope.row.isEnabled = !scope.row.isEnabled })
      if (code === 200) {
        this.$message({ message: '更新状态成功', type: 'success' })
        this.fetchLog(
          this.getLogMessages('UPDATE', '/baseData/qa/dyeColorTestConfig/enabled', 'baseData'),
          { id: scope.row.uuid },
          JSON.stringify({
            beforeText: `在"客户订单-基础数据-染纱损"${scope.row.status === 'Y' ? '启用' : '禁用'}一条记录`,
            beforeCode: { id: scope.row.uuid }
          })
        )
      } else {
        this.$message({ message: message || '更新状态失败', type: 'error' })
      }
    },
    // 页面启用禁用
    enableStatus(data = {}, scope) {
      if (this.activeName === '1') {
        this.isEnableYarnTest(data, scope) // 试纱项目
      } else {
        this.isEnableDyeColor(data, scope) // 试染颜色
      }
    },
    // 加载试纱项目列表
    async listYarnTest(params) {
      const { data = { list: [], total: 0, pageNum: 1, pageSize: 20 }} = await listYarnTest({ ...this.formDatas, ...params })
      this.dataSource = data.list && data.list.map((item, index) => ({ ...item, code: (data.pageNum - 1) * data.pageSize + index + 1 })) || []
      this.pagination = { ...this.pagination, dataTotal: data.total || 0, ...params, currentPage: data.pageNum, pageNum: data.pageNum, pageSize: data.pageSize }
    },
    // 加载试染颜色列表
    async listDyeColor(params) { // 无分页查询
      const { data = [] } = await listDyeColor({ ...this.formDatas, ...params })
      this.dataSource = data.length && data.map((item, index) => ({ ...item, code: index + 1 })) || []
      // this.pagination = { ...this.pagination, dataTotal: data.total || 0, ...params, currentPage: data.pageNum, pageNum: data.pageNum, pageSize: data.pageSize }
    },
    // 获取列表数据
    load(params = {}) {
      if (this.activeName === '1') {
        this.listYarnTest(params) // 加载试纱项目列表
      } else {
        this.listDyeColor(params) // 加载试染颜色列表
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.standard-process-flow {
  position: relative;
  padding: 20px;
  padding-bottom: 0px;
  /deep/.el-tabs__nav-wrap {
    padding-left: 26px;
    background: #fff;
    &::after {
      height: 1px;
    }
  }
  /deep/ .el-tabs__header {
    margin-bottom: 1px;
  }
  /deep/ .el-tabs__item {
    height: 60px;
    line-height: 60px;
    padding: 0 26px;
  }
  .search {
    background: #fff;
  }
  .button {
    position: absolute;
    right: 40px;
    width: 68px;
    z-index: 8;
    top: 34px;
    button {
      width: 100%;
    }
  }
}
</style>
