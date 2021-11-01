import * as api from '../api/index'
// import dynamicHeader from './dynamic-header.vue'
export const OperationDictionaryTable = {
  methods: {
    async apsProcessDicPage(data = {}) {
      const res = await api.apsProcessDicPage({ type: this.activeName, ...data })
      const dataList = res.data.list || []
      this.dataSource = dataList
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total || 0,
        // ...data,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },

    addHandle() {
      this.type = 'add'
      //   this.$set(this.popOptions.formDatas, 'produceProcess', [])
      //   this.popOptions.formDatas = { produceProcess: [] }
      this.popOptions.visible = true
      this.popOptions.title = '新增工序字典表'
    },

    // 添加或者编辑工序
    apsProcessDicAddOrEdit(data) {
      if (this.type === 'add') {
        this.apsProcessDicAdd(data)
      } else if (this.type === 'edit') {
        this.apsProcessDicModify(data)
      }
    },

    // 新增
    async apsProcessDicAdd(data = {}) {
      const res = await api.apsProcessDicAdd({ type: this.activeName, ...data })
      if (res.data) {
        this.$message.success('保存成功')
        this.popOptions.visible = false
        this.apsProcessDicPage()
      }
    },

    // 修改
    async apsProcessDicModify(data = {}) {
      const res = await api.apsProcessDicModify(data)
      if (res.data) {
        this.$message.success('修改成功')
        this.popOptions.visible = false
        this.apsProcessDicPage()
      }
    },

    // 删除
    async apsProcessDicDelete(data = {}) {
      const res = await api.apsProcessDicDelete(data)
      if (res.data) {
        this.$message.success('删除成功成功')
        this.popOptions.visible = false
        this.apsProcessDicPage()
      }
    },

    // 获取详情
    async apsProcessDicInfo(data = {}) {
      const res = await api.apsProcessDicInfo(data)
      const dataInfo = res.data || {}
      const produceProcess = dataInfo.produceProcess ? dataInfo.produceProcess.split(',') : null
      this.$set(this.popOptions, 'formDatas', { ...dataInfo, produceProcess })
    },

    // 状态修改
    async apsProcessDicUpdateStatus(data = {}) {
      const { status } = data
      const res = await api.apsProcessDicUpdateStatus(data)
      if (res.data) {
        this.$message.success(`${status === 1 ? '启用' : '禁用'}成功`)
      }
    }

  }
}
