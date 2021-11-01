import * as api from '../api/index'
export const WinningRate = {
  methods: {
    // 新建仪表盘用户
    createWinningRate() {
      this.type = 'add'
      this.PopDialogHandle(this.popOptions, '新建仪表盘用户')
    },

    // 获取仪表盘用户分页列表
    async getWinningRatePage(data = {}) {
      const res = await api.winRatePage({ ...this.formDatas, ...this.searchFormDatas, ...data })
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
    addOrEditWinningRate(data) {
      if (this.type === 'add') {
        this.addWinningRate(data)
      } else if (this.type === 'edit') {
        this.editWinningRate(data)
      }
    },

    // 添加仪表盘用户
    async addWinningRate(data = {}) {
      const res = await api.winRateAdd(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.popOptions, 'visible', false)
      this.closePopDialogHandle(this.popOptions)
      this.$message.success('添加成功')
      this.getWinningRatePage()
    },

    // 编辑仪表盘用户
    async editWinningRate(data = {}) {
      const res = await api.winRateModify(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.popOptions, 'visible', false)
      this.closePopDialogHandle(this.popOptions)
      this.$message.success('编辑成功')
      this.getWinningRatePage()
    },

    // 删除仪表盘用户
    async deleteWinningRate(data = {}) {
      const res = await api.winRateDelete(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功')
      this.getWinningRatePage()
    },

    // 获取仪表盘用户详情
    async getWinningRateInfo(data = {}) {
      const res = await api.winRateInfo(data)
      console.log('详情', res)
      this.$set(this.popOptions.content[0], 'dataSource', [{ label: res.data.userName, value: res.data.userId }])
      this.setFormDatas(this.popOptions, res.data)
    }
  },
  computed: {}
}
