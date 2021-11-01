import * as api from '../api/index'
// import dynamicHeader from './dynamic-header.vue'
export const CalculateConstantSettings = {
  methods: {
    // 列表
    async apsConstantSetPage(data = {}) {
      const res = await api.apsConstantSetPage(data)
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

    // 修改
    async apsConstantSetModify(data = {}) {
      const res = await api.apsConstantSetModify(data)
      if (res.data) {
        this.$message.success('修改成功')
        this.popOptions.visible = false
        this.apsConstantSetPage()
      }
    },

    // 删除
    async apsConstantSetDelete(data = {}) {
      const res = await api.apsConstantSetDelete(data)
      if (res.data) {
        this.$message.success('修改成功')
        this.popOptions.visible = false
        this.apsConstantSetPage()
      }
    },

    // 获取详情
    async apsConstantSetInfo(data = {}) {
      const res = await api.apsConstantSetInfo(data)
      const dataInfo = res.data || {}
      const produceProcess = dataInfo.produceProcess ? dataInfo.produceProcess.split(',') : null
      this.$set(this.popOptions, 'formDatas', { ...dataInfo, produceProcess })
    }
  }
}
