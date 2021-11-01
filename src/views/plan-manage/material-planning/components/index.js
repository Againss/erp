import * as api from '../api/index'
export const MaterialPlanning = {
  methods: {
    // 物料计划表格分页列表
    async materielPlanPage(data = {}) {
      // console.log({ ...this.searchFormDatas, ...data })
      const res = await api.materielPlanPage({ ...this.searchFormDatas, planStatus: this.activeName, ...data })
      const userList = res.data.list || []
      console.log('userList', userList)
      // this.dataSource = userList
      userList.forEach(item => {
        item.expandFlag = false
        let index = 0
        // item.datas ? item.datas = item.datas.reverse() : ''
        // if (item.datas) {
        //   let num = 0 // 合并的num数量
        //   item.datas.forEach((datasItem, datasIndex) => {
        //     if (datasIndex !== 0) {
        //       if (datasItem.process === item.datas[datasIndex - 1].process) {
        //         num += 1
        //         this.sortByArray(item.datas, [datasIndex - num, datasIndex])
        //       } else {
        //         num = 0
        //       }
        //     }
        //   })
        //   item.datas.reverse()
        // }
        console.log(item.datas)
        // 添加工序前面的序号
        item.datas && item.datas.forEach((datasItem, datasIndex) => {
          if (datasIndex === 0) {
            datasItem.index = index
          } else if (datasItem.process === item.datas[datasIndex - 1].process) {
            datasItem.index = index
          } else {
            datasItem.index = ++index
          }
        })
        index = 0
      })
      // userList.forEach(item => { item.expandFlag = false })
      this.$set(this.formDetailsOptions, 'dataSource', userList)
      this.formDetailsPagination = {
        ...this.formDetailsPagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.$set(this.formDetailsOptions, 'pagination', this.formDetailsPagination)
    },

    // 物料计划单条确认事件
    async confirmQuantity(data = {}) {
      await api.materielPlanConfirm(data)
      this.$message.success('确认成功')
      this.fetchLog(
        this.getLogMessages('UPDATE', '/aps/materielPlan/confirm', 'aps'),
        data,
        JSON.stringify({ beforeText: `在'计划管理-物料计划'确认一条记录`, beforeCode: data })
      )
      this.materielPlanPage({ planStatus: '0' })
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
