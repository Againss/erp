import * as api from '../api/index'
export const productionDemandList = {
  methods: {
    // 生产分页列表
    async produceRequirePage(data = {}) {
      const res = await api.produceRequirePage({ ...this.searchFormDatas, produceRequireStatus: this.activeName, ...data })
      const userList = res.data.list || []
      console.log('userList', userList)
      //   this.dataSource = userList
      userList.forEach(item => {
        item.expandFlag = false
        item.checked = false
        let index = 0
        item.apsProduceRequireProcessInfoRespList && item.apsProduceRequireProcessInfoRespList.forEach((datasItem, datasIndex) => {
          if (datasIndex === 0) {
            datasItem.index = index
          } else if (datasItem.process === item.apsProduceRequireProcessInfoRespList[datasIndex - 1].process) {
            datasItem.index = index
          } else {
            datasItem.index = ++index
          }
        })
        index = 0
      })
      this.$set(this.formDetailsOptions, 'dataSource', userList)
      this.formDetailsPagination = {
        ...this.formDetailsPagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.$set(this.formDetailsOptions, 'pagination', this.formDetailsPagination)
    },

    // 生产多条下发事件
    async produceRequireSend(data = {}) {
      await api.produceRequireSend(data)
      this.$message.success('生产下发成功')
      this.fetchLog(
        this.getLogMessages('UPDATE', '/aps/produceRequire/send', 'aps'),
        data,
        JSON.stringify({ beforeText: `在'计划管理-生产需求列表-生产'下发一条记录`, beforeCode: data })
      )
      this.produceRequirePage({ produceRequireStatus: '0' })
    },

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
      this.fetchLog(
        this.getLogMessages('UPDATE', '/aps/purchaseRequire/send', 'aps'),
        data,
        JSON.stringify({ beforeText: `在'计划管理-生产需求列表-采购'下发一条记录`, beforeCode: data })
      )
      this.purchaseRequirePage({ purchaseRequireStatus: '0' })
    }
  }
}
