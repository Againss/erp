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

    // 获取分页count数量
    async grayYarnPageCount(data = {}) {
      console.log({ ...this.searchFormDatas, ...data })
      const res = await api.grayYarnPageCount({ ...this.searchFormDatas, ...data })
      const dataInfo = res.data || {}
      this.statusArr[0].count = dataInfo.unProcessedNum
      this.statusArr[1].count = dataInfo.processedNum
    },

    // 重新抽纱校验
    async whetherReDraw(data = {}) {
      const res = await api.grayYarnRedo(data)
      if (res.data) {
        // 可以重新抽纱, 跳转到详情页
        this.$router.push({ name: 'drawnwork-detail', query: { id: data.reduceId }})
      } else {
        this.$message.warning('已有下游单据不能重新抽纱')
      }
    }
  }
}
