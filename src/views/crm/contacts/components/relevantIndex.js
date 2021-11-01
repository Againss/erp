import * as api from '../api/index'
export const ContactsRelevant = {
  methods: {
    // 获取联系人分页列表
    async getContactsPage(data = {}) {
      const res = await api.contactPersonPage({ ...this.formDatas, ...this.searchFormDatas, ...data })
      console.log('联系人分页', res)
      const userList = res.data.list || []
      this.contactsDataSource = userList
      this.contactsTotal = res.data.total
      this.relevantContactsOptions && this.$set(this.relevantContactsOptions, 'dataSource', userList)
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },

    // 添加或者编辑联系人
    addOrEditContacts(data) {
      if (this.type === 'add') {
        this.addContacts(data)
      } else if (this.type === 'edit') {
        this.editContacts(data)
      }
    },

    // 添加联系人
    async addContacts(data = {}) {
      const res = await api.contactPersonAdd(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.contactsPopOptions, 'visible', false)
      this.closePopDialogHandle(this.contactsPopOptions)
      this.$message.success('添加成功')
      this.getContactsPage()
    },

    // 编辑联系人
    async editContacts(data = {}, flag) {
      const res = await api.contactPersonModify(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.contactsPopOptions, 'visible', false)
      this.closePopDialogHandle(this.contactsPopOptions)
      this.$message.success('编辑成功')
      if (flag) {
        this.getContactsInfoDisplay({ contactPersonId: this.routeId })
      } else {
        this.getContactsPage()
      }
    },

    // 删除联系人
    async deleteContacts(data = {}, flag) {
      const res = await api.contactPersonDelete(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功')
      if (flag) {
        this.$router.back()
      } else {
        this.getContactsPage()
      }
    },

    // 获取联系人详情
    async getContactsInfo(data = {}) {
      const res = await api.contactPersonInfo(data)
      console.log('详情', res)
      this.$set(this.contactsPopOptions.content[2], 'dataSource', [{ label: res.data.customerName, value: res.data.customerId }])
      this.setFormDatas(this.contactsPopOptions, res.data)
    },

    // 获取联系人详情并显示
    // async getContactsInfoDisplay(data = {}) {
    //   const res = await api.contactPersonInfo(data)
    //   //   console.log('详情', res)
    //   const gender = res.data.gender && res.data.gender === 'M' ? '男' : '女'
    //   const createdTime = res.data.createdTime && this.$filters.parseTime(res.data.createdTime + '', '{y}-{m}-{d} {h}: {i}: {s}')
    //   const updatedTime = res.data.updatedTime && this.$filters.parseTime(res.data.updatedTime + '', '{y}-{m}-{d} {h}: {i}: {s}')
    //   this.detailsFormDatas = { ...res.data, createdTime, updatedTime, gender }
    //   //   this.setFormDatas(this.contactsPopOptions, res.data)
    // },

    // 远程搜索
    remoteSearch(value) {
      console.log(value)
      if (value === '') {
        this.$set(this.contactsPopOptions.content[2], 'dataSource', [])
      } else {
        if (!this.getData) {
          this.getData = this.$utils.debounce(this.remoteCustomerPage, 300)
        }
        this.getData({ name: value, dataTag: 'ALL' }, 2, this.contactsPopOptions)
      }
    }

    // 点击更改所有人
    // async okClick(params) {
    //   // console.log(params)
    //   const res = await api.contactPersonModifyFollower({ ...params, id: this.routeId })
    //   if (res.code !== 200) {
    //     return false
    //   }
    //   this.$message.success('更改所有人成功')
    //   // this.$emit('visibleClick', false)
    //   this.visible = false
    //   // console.log(this.visible)
    //   this.getContactsInfoDisplay({ contactPersonId: this.routeId })
    // }
  }
}
