import * as api from '../api/index'
export const CustomerLevel = {
  methods: {
    // 新建客户级别选项
    createCustomerLevel() {
      this.type = 'add'
      this.PopDialogHandle(this.popOptions, '新建客户级别选项')
    },

    // 获取客户级别选项分页列表
    async getCustomerLevelPage(data = {}) {
      const res = await api.customerLevelPage({ ...this.formDatas, ...this.searchFormDatas, ...data })
      console.log('客户级别选项', res)
      const userList = res.data.list || []
      this.dataSource = userList
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },

    // 添加或者编辑客户级别选项
    addOrEditCustomerLevel(data) {
      if (this.type === 'add') {
        this.addCustomerLevel(data)
      } else if (this.type === 'edit') {
        this.editCustomerLevel(data)
      }
    },

    // 添加客户级别选项
    async addCustomerLevel(data = {}) {
      const res = await api.customerLevelAdd(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.popOptions, 'visible', false)
      this.closePopDialogHandle(this.popOptions)
      this.$message.success('添加成功')
      this.getCustomerLevelPage()
    },

    // 编辑客户级别选项
    async editCustomerLevel(data = {}) {
      const res = await api.customerLevelModify(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.popOptions, 'visible', false)
      this.closePopDialogHandle(this.popOptions)
      this.$message.success('编辑成功')
      this.getCustomerLevelPage()
    },

    // 删除客户级别选项
    async deleteCustomerLevel(data = {}) {
      const res = await api.customerLevelDelete(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功')
      this.getCustomerLevelPage()
    },

    // 获取客户级别选项详情
    async getCustomerLevelInfo(data = {}) {
      const res = await api.customerLevelInfo(data)
      console.log('详情', res)
      this.$set(this.popOptions.content[0], 'dataSource', [{ label: res.data.userName, value: res.data.userId }])
      this.setFormDatas(this.popOptions, res.data)
    }
  },
  computed: {}
}
