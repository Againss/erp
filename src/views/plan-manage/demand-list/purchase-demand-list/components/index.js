import * as api from '../api/index'
export const PurchaseDemandList = {
  methods: {

    // 采购分页列表
    async purchaseRequirePage(data = {}) {
      const res = await api.purchaseRequirePage({ ...this.searchFormDatas, purchaseRequireStatus: this.activeName, ...data })
      const userList = res.data.list || []
      console.log('userList', userList)
      this.dataSource = userList
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },

    // 采购多条下发事件
    async purchaseRequireSend(data = {}) {
      const res = await api.purchaseRequireSend(data)
      const ids = res.data || []
      this.rowStyleIds = ids
      ids.length ? this.$message.error('采购分录未下发成功') : this.$message.success('采购下发成功')

      const logApi = `/aps/purchaseRequire/send`
      const opratorType = `UPDATE`
      const description = { beforeText: `在'计划管理-需求列表-采购需求列表'下发一条记录`, beforeCode: data }
      const appId = 'aps'
      this.$store.dispatch('app/fetchParamsLog', { data, opratorType, api: logApi, description, appId })
      //   this.fetchLog(
      //     this.getLogMessages('UPDATE', '/aps/purchaseRequire/send', 'aps'),
      //     data,
      //     JSON.stringify({ beforeText: `在'计划管理-生产需求列表-采购'下发一条记录`, beforeCode: data })
      //   )
      this.purchaseRequirePage({ purchaseRequireStatus: '0' })
    }
  }
}
