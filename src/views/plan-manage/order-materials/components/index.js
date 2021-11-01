import * as api from '../api/index'
export const OrderMaterials = {
  methods: {
    // 物料计划表格分页列表
    async orderMaterielPage(data = {}) {
      // console.log({ ...this.searchFormDatas, ...data })
      const res = await api.orderMaterielPage({ ...this.searchFormDatas, ...data })
      const userList = res.data.list || []
      console.log('userList', userList)
      // this.dataSource = userList
      userList.forEach(item => {
        item.expandFlag = false
        let index = 0
        console.log(item.details)
        // 添加工序前面的序号
        item.details && item.details.forEach((datasItem, datasIndex) => {
          if (datasIndex === 0) {
            datasItem.index = index
          } else if (datasItem.process === item.details[datasIndex - 1].process) {
            datasItem.index = index
          } else {
            datasItem.index = ++index
          }
        })
        index = 0
      })
      // userList.forEach(item => { item.expandFlag = false })
      this.$set(this.formDetailsOptions, 'dataSource', userList)
      // 分页处理
      this.formDetailsPagination = {
        ...this.formDetailsPagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.$set(this.formDetailsOptions, 'pagination', this.formDetailsPagination)
    },

    // 合并单元格倒序序 以至于后面再次倒序为正序
    sortByArray(data, array) {
      for (let i = array[1]; i > array[0]; i--) {
        const tempItem = data[i]
        data[i] = data[i - 1]
        data[i - 1] = tempItem
      }
    }
  }
}
