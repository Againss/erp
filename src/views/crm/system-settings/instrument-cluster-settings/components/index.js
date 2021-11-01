import * as api from '../api/index'
export const Instrument = {
  methods: {
    // 新建仪表盘用户
    createInstrument() {
      this.type = 'add'
      this.PopDialogHandle(this.popOptions, '新建仪表盘用户')
    },

    // 获取仪表盘用户分页列表
    async getInstrumentPage(data = {}) {
      const res = await api.dashboardPage({ ...this.formDatas, ...this.searchFormDatas, ...data })
      console.log('仪表盘用户', res)
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

    // 添加或者编辑仪表盘用户
    addOrEditInstrument(data) {
      if (this.type === 'add') {
        this.addInstrument(data)
      } else if (this.type === 'edit') {
        this.editInstrument(data)
      }
    },

    // 添加仪表盘用户
    async addInstrument(data = {}) {
      const res = await api.dashboardAdd(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.popOptions, 'visible', false)
      this.closePopDialogHandle(this.popOptions)
      this.$message.success('添加成功')
      this.getInstrumentPage()
    },

    // 编辑仪表盘用户
    async editInstrument(data = {}) {
      const res = await api.dashboardModify(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.popOptions, 'visible', false)
      this.closePopDialogHandle(this.popOptions)
      this.$message.success('编辑成功')
      this.getInstrumentPage()
    },

    // 删除仪表盘用户
    async deleteInstrument(data = {}) {
      const res = await api.dashboardDelete(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功')
      this.getInstrumentPage()
    },

    // 获取仪表盘用户详情
    async getInstrumentInfo(data = {}) {
      const res = await api.dashboardInfo(data)
      console.log('详情', res)
      this.$set(this.popOptions.content[0], 'dataSource', [{ label: res.data.userName, value: res.data.userId }])
      this.setFormDatas(this.popOptions, res.data)
    }
  },
  computed: {}
}
