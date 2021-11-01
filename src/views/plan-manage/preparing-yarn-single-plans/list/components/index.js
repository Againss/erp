import * as api from '../api/index'
export const drawnworkList = {
  methods: {
    // 抽纱分页列表
    async grayYarnPage(data = {}) {
      const res = await api.grayYarnPage({ ...this.searchFormDatas, status: this.activeName, ...data })
      const userList = res.data.list || []
      console.log('userList', userList)
      this.dataSource = userList
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },

    async grayYarnPageCount(data = {}) {
      console.log({ ...this.searchFormDatas, ...data })
      const res = await api.grayYarnPageCount({ ...this.searchFormDatas, ...data })
      const dataInfo = res.data || {}
      this.statusArr[0].count = dataInfo.unProcessedNum
      this.statusArr[1].count = dataInfo.processedNum
    }
  }
}
