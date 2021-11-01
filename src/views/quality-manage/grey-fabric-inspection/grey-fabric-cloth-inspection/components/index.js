
import * as api from '../api/index'
export const clothInspectionPage = {
  methods: {// 验布分页
    async qaGreyFabricTaskPage(data = {}) {
    // console.log({ ...this.searchFormDatas, ...data })
      const res = await api.qaGreyFabricTaskPage({ ...this.searchFormDatas, status: this.activeName, ...data })
      const dataList = res.data.list || []
      this.dataSource = dataList
      console.log('dataList', dataList)
      //   this.$set(this.formDetailsOptions, 'dataSource', dataList)
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      //   this.$set(this.formDetailsOptions, 'pagination', this.pagination)
    },

    // 获取列表数量
    async getListCount(data = {}) {
      const res = await api.greigeFabricTaskStatusCount({ ...this.searchFormDatas, ...data })
      const dataList = res.data || []
      this.statusArr.forEach(statusItem => {
        statusItem.count = 0
        dataList.forEach((item, index) => {
          if (+statusItem.value === +item.status) {
            statusItem.count = item.num
          }
        })
      })
      // dataList.forEach((item, index) => {
      //   this.statusArr.forEach(statusItem => {
      //     statusItem.count = 0
      //     if (+statusItem.value === +item.status) {
      //       statusItem.count = item.num
      //     }
      //   })
      // })
    }
  }
}
