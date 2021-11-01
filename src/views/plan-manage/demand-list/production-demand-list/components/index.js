import * as api from '../api/index'
export const ProductionDemandList = {
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
        item.apsProduceRequireProcessPageRespList && item.apsProduceRequireProcessPageRespList.forEach((datasItem, datasIndex) => {
          if (datasIndex === 0) {
            datasItem.index = index
          } else if (datasItem.process === item.apsProduceRequireProcessPageRespList[datasIndex - 1].process) {
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

      const logApi = `/aps/produceRequire/send`
      const opratorType = `UPDATE`
      const description = { beforeText: `在'计划管理-需求列表-生产需求列表'下发一条记录`, beforeCode: data }
      const appId = 'aps'
      this.$store.dispatch('app/fetchParamsLog', { data, opratorType, api: logApi, description, appId })
      this.produceRequirePage({ produceRequireStatus: '0' })
    },

    // 根据原料重量获取抽纱详情
    async getProduceRequireGray(data = {}) {
      const res = await api.produceRequireGray(data)
      const dataInfo = res.data || []
      console.log(dataInfo)
      this.$set(this.popOptions.content._tableForm, 'dataSource', dataInfo)
    }
  }
}
