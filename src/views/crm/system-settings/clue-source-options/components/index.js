import * as api from '../api/index'
export const ClueSource = {
  methods: {
    // 新建线索来源
    createClueSource() {
      this.type = 'add'
      this.PopDialogHandle(this.popOptions, '新建线索来源选项')
    },

    // 获取线索来源分页列表
    async getClueSourcePage(data = {}) {
      const res = await api.cluesFromPage({ ...this.formDatas, ...this.searchFormDatas, ...data })
      console.log('线索来源', res)
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

    // 添加或者编辑线索来源
    addOrEditClueSource(data) {
      if (this.type === 'add') {
        this.addClueSource(data)
      } else if (this.type === 'edit') {
        this.editClueSource(data)
      }
    },

    // 添加线索来源
    async addClueSource(data = {}) {
      const res = await api.cluesFromAdd(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.popOptions, 'visible', false)
      this.closePopDialogHandle(this.popOptions)
      this.$message.success('添加成功')
      this.getClueSourcePage()
    },

    // 编辑线索来源
    async editClueSource(data = {}) {
      const res = await api.cluesFromModify(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.popOptions, 'visible', false)
      this.closePopDialogHandle(this.popOptions)
      this.$message.success('编辑成功')
      this.getClueSourcePage()
    },

    // 删除线索来源
    async deleteClueSource(data = {}) {
      const res = await api.cluesFromDelete(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功')
      this.getClueSourcePage()
    },

    // 获取线索来源详情
    async getClueSourceInfo(data = {}) {
      const res = await api.cluesFromInfo(data)
      console.log('详情', res)
      this.$set(this.popOptions.content[0], 'dataSource', [{ label: res.data.userName, value: res.data.userId }])
      this.setFormDatas(this.popOptions, res.data)
    }
  },
  computed: {}
}
