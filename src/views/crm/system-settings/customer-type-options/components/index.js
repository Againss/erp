import * as api from '../api/index'
export const CustomerType = {
  methods: {
    // 新建客户类型选项
    createCustomerType() {
      this.type = 'add'
      this.PopDialogHandle(this.popOptions, '新建客户类型选项')
    },

    // 获取客户类型选项分页列表
    async getCustomerTypePage(data = {}) {
      const res = await api.customerTypePage({ ...this.formDatas, ...this.searchFormDatas, ...data })
      console.log('客户类型选项', res)
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

    // 添加或者编辑客户类型选项
    addOrEditCustomerType(data) {
      if (this.type === 'add') {
        this.addCustomerType(data)
      } else if (this.type === 'edit') {
        this.editCustomerType(data)
      }
    },

    // 添加客户类型选项
    async addCustomerType(data = {}) {
      const res = await api.customerTypeAdd(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.popOptions, 'visible', false)
      this.closePopDialogHandle(this.popOptions)
      this.$message.success('添加成功')
      this.getCustomerTypePage()
    },

    // 编辑客户类型选项
    async editCustomerType(data = {}) {
      const res = await api.customerTypeModify(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.popOptions, 'visible', false)
      this.closePopDialogHandle(this.popOptions)
      this.$message.success('编辑成功')
      this.getCustomerTypePage()
    },

    // 删除客户类型选项
    async deleteCustomerType(data = {}) {
      const res = await api.customerTypeDelete(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功')
      this.getCustomerTypePage()
    },

    // 获取客户类型选项详情
    async getCustomerTypeInfo(data = {}) {
      const res = await api.customerTypeInfo(data)
      console.log('详情', res)
      this.$set(this.popOptions.content[0], 'dataSource', [{ label: res.data.userName, value: res.data.userId }])
      this.setFormDatas(this.popOptions, res.data)
    }
  },
  computed: {}
}
