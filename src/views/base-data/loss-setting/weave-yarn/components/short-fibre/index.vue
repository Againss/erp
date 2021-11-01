<template>
  <div class="short-fibre">
    <!-- 新增菜单按钮 -->
    <!--    <div class="button button-short">-->
    <!--      <el-button v-permission="['soPrint:printProcessConf:add']" icon="el-icon-plus" size="small" type="primary" @click="doAdd">新增</el-button>-->
    <!--    </div>-->
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table :columns="columns" :data-source="dataSource" :operates="popOperates" lazy edit-type="pop" table-scrollx />
    </div>
    <!-- 导入pop弹出层 -->
    <details-pop ref="detailsPop" @add="addCallback" @modify="modifyCallback" />
  </div>
</template>
<script>
import { list, del, isEnable } from './api/index.js'
import logMethods from '@/views/product-center/mixin/log-methods'
import enableSwitch from '../enableSwitch'
import detailsPop from './details-pop'
import label from './label'

export default {
  name: 'ShortFibre',
  components: { detailsPop },
  mixins: [logMethods],
  data() {
    // 操作栏 和权限配置
    let popOperatesDataSource = [
      { label: '编辑', permitTag: ['baseData:lossSetting:baseWeaveYarn:modify', 'baseData:lossSetting:baseWeaveYarn:modify'], isShow: true, handle: scope => this.$nextTick(() => this.$refs['detailsPop'].init(scope.row)) },
      { label: '删除', style: { 'color': '#FE4949' }, permitTag: ['baseData:lossSetting:baseWeaveYarn:delete', 'baseData:lossSetting:baseWeaveYarn:delete'], isShow: true, handle: scope => this.doDelete(scope.row) }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    return {
      type: '0',
      isPreciseFlow: '0',
      // 表格表头的配置信息
      columns: [
        { prop: 'code', label: label.code, minWidth: '80', showOverflowTooltip: true },
        { prop: 'elementInfo', label: label.elementInfo, minWidth: '120', showOverflowTooltip: true, formater: scope => scope.row.elementInfo ? scope.row.elementInfo.label : '-' },
        { prop: 'weightRange', label: label.weightRange + '(kg)', minWidth: '150', showOverflowTooltip: true, align: 'right', formater: scope => `${scope.row.weightIni}〜${scope.row.weightEnd}` },
        { prop: 'wastage', label: label.wastage, minWidth: '100', showOverflowTooltip: true, align: 'right', formater: scope => this.$filters.numberToPercentage(scope.row.wastage) + '%' },
        { prop: 'status', label: label.status, minWidth: '80', showOverflowTooltip: true,
          components: { enableSwitch },
          componentsOptions: {
            permitTag: ['baseData:lossSetting:baseWeaveYarn:status', 'baseData:lossSetting:baseWeaveYarn:status'],
            changeStatus: (scope) => {
              this.enableStatus({ id: scope.row.id, status: scope.row.status }, scope)
            }
          }
        }
      ],
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
    // this.load()
  },
  methods: {
    // 新增
    doAdd() {
      this.$nextTick(() => {
        this.$refs['detailsPop'].init({ type: this.type, isPreciseFlow: this.isPreciseFlow })
      })
    },
    // 新增后回调
    addCallback(data = {}) {
      if (data.code === 200) {
        this.$message({ message: '新增成功', type: 'success' })
        this.load({ type: this.type, isPreciseFlow: this.isPreciseFlow, pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      }
    },
    // 修改后回调
    modifyCallback(data = {}) {
      if (data.code === 200) {
        this.$message({ message: '修改成功', type: 'success' })
        this.load({ type: this.type, isPreciseFlow: this.isPreciseFlow, pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      }
    },
    // 页面启用禁用
    async enableStatus(data = {}, scope) {
      const { code } = await isEnable(data).catch(() => { scope.row.status = scope.row.status === 'Y' ? 'N' : 'Y' })
      if (code === 200) {
        this.$message({ message: '更新状态成功', type: 'success' })
        this.fetchLog(
          this.getLogMessages('UPDATE', '/baseData/lossSetting/baseWeaveYarn/status', 'baseData'),
          { id: scope.row.id },
          JSON.stringify({
            beforeText: `在"基础数据-损耗设置-织损"${scope.row.enable.code === 'Y' ? '启用' : '禁用'}一条记录`,
            beforeCode: { id: scope.row.id }
          })
        )
      } else {
        this.$message({ message: '更新状态失败', type: 'error' })
      }
    },
    // 获取列表数据
    async load(params = {}) {
      this.type = params.type
      this.isPreciseFlow = params.type === '1' ? '0' : params.isPreciseFlow
      const { data = [], code = 0, total = 0, pageNum = 1, pageSize = 20 } = await list(params)
      if (code === 200) {
        this.dataSource = data.map((item, index) => ({ code: ((pageNum - 1) * pageSize + index + 1), ...item }))
        this.pagination = { ...this.pagination, dataTotal: total, ...params, currentPage: pageNum, pageSize: params.pageSize, page: pageNum }
      }
    },
    init(params = {}) {
      this.load(params)
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
    doDelete(row) {
      this.$confirm(' 确认删除当前数据吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(async() => {
        const { code = 0 } = await del({ id: row.id })
        if (code !== 200) {
          return false
        }
        this.$message({ type: 'success', message: '删除成功!' })
        this.fetchLog(
          this.getLog('DEL', '/baseData/lossSetting/baseWeaveYarn/delete', 'baseData'),
          { id: row.id },
          JSON.stringify({
            beforeText: `在'基础数据-损耗设置-织损'删除一条记录`,
            beforeCode: { id: row.id }
          })
        )
        this.load({ type: this.type, isPreciseFlow: this.isPreciseFlow, pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    }
  }
}
</script>

<style lang="scss">
.short-fibre {
  // padding: 20px;
  padding-bottom: 0px;
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
}
</style>
