<template>
  <div class="attach">
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table :columns="columns" :data-source="dataSource" :operates="popOperates" lazy edit-type="pop" table-scrollx />
    </div>
    <!-- 导入pop弹出层 -->
    <details-pop ref="detailsPop" @modify="modifyCallback" />
  </div>
</template>
<script>
import { list, isEnable, del } from './api/index.js'
import logMethods from '@/views/product-center/mixin/log-methods'
import detailsPop from './details-pop'
import label from './label'
import enableSwitch from '../components/enableSwitch'

export default {
  name: 'PrintAttach',
  components: { detailsPop },
  mixins: [logMethods],
  data() {
    // 操作栏 和权限配置
    let popOperatesDataSource = [
      { label: '编辑', permitTag: ['baseData:lossSetting:basePrintAttach:modify'], isShow: true, handle: scope => this.$nextTick(() => this.$refs['detailsPop'].init(scope.row)) },
      { label: '删除', permitTag: ['baseData:lossSetting:basePrintAttach:delete'], style: { 'color': '#FE4949' }, isShow: true, handle: scope => this.doDelete(scope.row) }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    return {
      // 表格表头的配置信息
      columns: [
        // { prop: 'code', label: label.code, minWidth: '50', showOverflowTooltip: true },
        { prop: 'weight', label: label.weight, minWidth: '120', showOverflowTooltip: true },
        { prop: 'wastage', label: label.wastage, minWidth: '120', showOverflowTooltip: true, align: 'right', formater: scope => this.$filters.numberToPercentage(scope.row.wastage) + '%' },
        { prop: 'status', label: label.status, minWidth: '120', showOverflowTooltip: true,
          components: { enableSwitch },
          componentsOptions: {
            permitTag: 'baseData:lossSetting:basePrintAttach:status',
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
  methods: {
    // 修改后的回调函数
    modifyCallback(data = {}) {
      if (data.code === 200) {
        this.$message({ message: '修改成功', type: 'success' })
        this.load({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      }
    },
    // 页面启用禁用
    async enableStatus(data = {}, scope) {
      const { code = 0, message = '' } = await isEnable(data).catch(() => { scope.row.status = scope.row.status === 'Y' ? 'N' : 'Y' })
      if (code === 200) {
        this.$message({ message: '更新状态成功', type: 'success' })
        this.fetchLog(
          this.getLogMessages('UPDATE', '/baseData/lossSetting/basePrintAttach/status', 'baseData'),
          { id: scope.row.id },
          JSON.stringify({
            beforeText: `在基础数据-损耗设置-印损-附加整理"${scope.row.status === 'Y' ? '启用' : '禁用'}一条记录`,
            beforeCode: { id: scope.row.id }
          })
        )
      } else {
        this.$message({ message: message || '更新状态失败', type: 'error' })
      }
    },
    // 获取列表数据
    async load(params = {}) {
      const { data = [], code = 0, total = 0, pageNum = 1, pageSize = 20 } = await list(params)
      if (code === 200) {
        this.dataSource = data.map((item, index) => ({ code: ((pageNum - 1) * pageSize + index + 1), weight: '>200', ...item }))
        this.pagination = { ...this.pagination, dataTotal: total, ...params, currentPage: pageNum, pageSize: pageSize, page: pageNum }
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
    async del(row = {}) {
      const { code = 0 } = await del({ id: row.id })
      if (code === 200) {
        this.fetchLog(this.getLog('DEL', '/baseData/lossSetting/basePrintAttach/delete'), { id: row.id }, JSON.stringify({ beforeText: `在'基础数据-损耗设置-印损-附加整理'删除一条记录`, beforeCode: { id: row.id }}))
        this.$message.success('删除成功')
        this.load({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      }
    },
    // 删除
    async doDelete(row) {
      this.$confirm(' 确认删除当前数据吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        this.del(row)
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    }
  }
}
</script>

<style lang="scss">
.attach {
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
}
</style>
