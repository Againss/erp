import * as api from '../api/index'
export const RelevantContacts = {
  methods: {
    // 获取商机-联系人分页列表
    async getOpinionPage(data = {}) {
      const res = await api.opinionPage({ ...data, businessOpportunityId: this.routeId })
      console.log('商机-联系人', res)
      const userList = res.data.list || []
      //   this.dataSource = userList
      this.opinionDataSource = userList
      this.opiniontTotal = res.data.total
      this.relevantContactsOptions && this.$set(this.relevantContactsOptions, 'dataSource', userList)
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },

    // 添加或者编辑商机-联系人
    addOrEditOpinion(data) {
      if (this.type === 'add') {
        this.addOpinion(data)
      } else if (this.type === 'edit') {
        this.editOpinion(data)
      }
    },

    // 添加商机-联系人
    async addOpinion(data = {}) {
      const res = await api.opinionAdd({ ...data, businessOpportunityId: this.routeId })
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.contractPopOptions, 'visible', false)
      this.closePopDialogHandle(this.contactsPopOptions)
      this.$message.success('添加成功')
      this.getOpinionPage()
    },

    // 编辑商机-联系人
    async editOpinion(data = {}, flag) {
      const res = await api.opinionModify({ ...data, businessOpportunityId: this.routeId })
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.contractPopOptions, 'visible', false)
      this.closePopDialogHandle(this.contactsPopOptions)
      this.$message.success('编辑成功')
      if (flag) {
        this.getOpinionInfoDisplay({ contractId: this.routeId })
      } else {
        this.getOpinionPage()
      }
    },

    // 删除商机-联系人
    async deleteOpinion(data = {}, flag) {
      const res = await api.opinionDelete(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功')
      if (flag) {
        this.$router.back()
      } else {
        this.getOpinionPage()
      }
    },

    // 获取商机-联系人详情
    async getOpinionInfo(data = {}) {
      const res = await api.opinionInfo(data)
      console.log('详情', res)
      // const contractDate = this.$filters.parseTime(res.data.contractDate + '', '{y}-{m}-{d} {h}:{i}:{s}')
      // const startTime = this.$filters.parseTime(res.data.startTime + '', '{y}-{m}-{d} {h}:{i}:{s}')
      // const endTime = this.$filters.parseTime(res.data.endTime + '', '{y}-{m}-{d} {h}:{i}:{s}')
      this.$set(this.contactsPopOptions.content[0], 'dataSource', [{ label: res.data.contactName, value: res.data.contactId }])
      this.setFormDatas(this.contactsPopOptions, { ...res.data })
    }

  }
}
