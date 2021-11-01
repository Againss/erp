import * as api from '../api/index'
export const RelevantCompetitor = {
  methods: {
    // 获取竞争对手分页列表
    async getCompetitorPage(data = {}) {
      const res = await api.businessOpportunityCompetitorPage({ ...data, businessOpportunityId: this.routeId })
      console.log('竞争对手', res)
      const userList = res.data.list || []
      //   this.dataSource = userList
      this.competitorDataSource = userList
      this.competitorTotal = res.data.total
      this.relevantCompetitorOptions && this.$set(this.relevantCompetitorOptions, 'dataSource', userList)
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },

    // 关联竞争对手
    async relationCompetitor(data = {}) {
      const res = await api.businessOpportunityCompetitorLink(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('关联竞争对手成功')
      this.closePopDialogHandle(this.competitorPopOptions)
      this.getCompetitorPage()
    },

    // 取消关联竞争对手
    async disassociateCompetitor(data = {}) {
      const res = await api.businessOpportunityCompetitorUnlink(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('取消关联竞争对手成功')
      this.getCompetitorPage()
    }

  }
}
