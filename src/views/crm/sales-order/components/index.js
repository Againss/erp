import * as api from '../api/index'
// import status from '@/views/crm/public/config/status.js'
export const SalesOrder = {
  methods: {

    // 获取销售订单详情并显示
    async getSalesOrderInfoDisplay(data = {}) {
      const res = await api.salesOrderInfo(data)
      //   console.log('详情', status)
      // this.customerId = res.data.customerId
      this.salesOrderStaus = res.data.status
      switch (res.data.status) {
        case 'D':
          console.log(111)
          this.onGoingStatus = 0
          this.searchData = this.draftSearchData
          break
        case 'S':
          this.onGoingStatus = 1
          this.searchData = this.submittedSearchData
          break
        case 'P':
          this.onGoingStatus = 2
          this.searchData = this.analysisSearchData
          break
        case 'C':
          this.onGoingStatus = 3
          this.searchData = this.doneSearchData
          break
        case 'R':
          this.onGoingStatus = -1
          this.searchData = this.cancelledSearchData
          break

        default:
          break
      }

      console.log('this.searchData', this.searchData, this.onGoingStatus)
      const season = { 'Spr': '第一季度', 'Sum': '第二季度', 'Fall': '第三季度', 'Winter': '第四季度' }
      const type = { 'B': '大货', 'S': '销售版', 'T': '测试样', 'F': '快反单', 'A': '备成品' }
      const orderType = type[res.data.orderType]
      // const analysisTargetObj = { 'O': '报价', 'D': '销售订单', 'S': '大货' }
      // const statusObj = { 'D': '草稿', 'S': '已提交', 'A': '分析中', 'C': '已完成', 'R': '已取消' }
      // const analysisStatus = statusObj[res.data.status]
      // const analysisTarget = res.data.analysisTarget ? res.data.analysisTarget.split('/').map(item => analysisTargetObj[item]).join(' / ') : ''
      //   this.searchData = this.draftSearchData
      const quarter = res.data.quarter && season[res.data.quarter]
      const taxType = res.data.taxType === 'I' ? '价内税' : '价外税'
      // const hasSample = res.data.hasSample ? '是' : '否'
      const totalAmount = res.data.totalAmount ? this.numRecursion(res.data.totalAmount / 10000) : ''
      const createdTime = res.data.createdTime && this.$filters.parseTime(res.data.createdTime + '', '{y}-{m}-{d} {h}: {i}: {s}')
      const updatedTime = res.data.updatedTime && this.$filters.parseTime(res.data.updatedTime + '', '{y}-{m}-{d} {h}: {i}: {s}')
      // const endTime = res.data.endTime && this.$filters.parseTime(res.data.endTime + '', '{y}-{m}-{d}')
      const commitTime = res.data.commitTime && this.$filters.parseTime(res.data.commitTime + '', '{y}-{m}-{d} {h}: {i}: {s}')
      const cancelTime = res.data.cancelTime && this.$filters.parseTime(res.data.cancelTime + '', '{y}-{m}-{d} {h}: {i}: {s}')
      this.detailsFormDatas = { ...res.data, createdTime, updatedTime, quarter, commitTime, cancelTime, totalAmount, orderType, taxType }
      this.$set(this.baseSearchData[13].componentsOptions, 'url', res.data.orderFilePath)
      this.$set(this.baseSearchData[14].componentsOptions, 'url', res.data.styleFilePath)
      this.$set(this.baseSearchData[15].componentsOptions, 'url', res.data.otherFilePath)
      //   this.setFormDatas(this.contactsPopOptions, res.data)
    },

    // 点击更改所有人
    async okClick(params) {
      // console.log(params)
      const res = await api.salesOrderModifyFollower({ ...params, customerRequireId: this.routeId })
      if (res.code !== 200) {
        return false
      }
      this.$message.success('更改所有人成功')
      // this.$emit('visibleClick', false)
      this.$set(this.OwnerPopOptions, 'visible', false)
      // console.log(this.visible)
      this.getSalesOrderInfoDisplay({ customerRequireId: this.routeId })
    },

    // 状态变更
    async salesOrderModifyStatus(data = {}, message) {
      const res = await api.salesOrderModifyStatus(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success(message)
      this.getSalesOrderInfoDisplay({ customerRequireId: this.routeId })
      this.closePopDialogHandle(this.withdrawPopOptions)
    }
  }
}
