import * as api from '../api/index'
import { modelDevelopPage } from '../../model-develop/api/index'
export const SampleAnalysis = {
  methods: {

    // 获取联系人详情并显示
    async getSampleAnalysisInfoDisplay(data = {}) {
      const res = await api.sampleAnalysisInfo(data)
      //   console.log('详情', status)
      // this.customerId = res.data.customerId
      this.sampleAnalysisStaus = res.data.status
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
        case 'A':
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
      res.data.status === 'C' && this.getModelDevelopPage()
      console.log('this.searchData', this.searchData, this.onGoingStatus)
      const season = { 'Spr': '第一季度', 'Sum': '第二季度', 'Fall': '第三季度', 'Winter': '第四季度' }
      const analysisTargetObj = { 'O': '报价', 'D': '样板开发', 'S': '大货' }
      // const statusObj = { 'D': '草稿', 'S': '已提交', 'A': '分析中', 'C': '已完成', 'R': '已取消' }
      // const analysisStatus = statusObj[res.data.status]
      const analysisTarget = res.data.analysisTarget ? res.data.analysisTarget.split('|').map(item => analysisTargetObj[item]).join(' | ') : ''
      //   this.searchData = this.draftSearchData
      const quarter = res.data.quarter && season[res.data.quarter]
      const hasSample = res.data.hasSample ? '是' : '否'
      const createdTime = res.data.createdTime && this.$filters.parseTime(res.data.createdTime + '', '{y}-{m}-{d} {h}: {i}: {s}')
      const updatedTime = res.data.updatedTime && this.$filters.parseTime(res.data.updatedTime + '', '{y}-{m}-{d} {h}: {i}: {s}')
      const endTime = res.data.endTime && this.$filters.parseTime(res.data.endTime + '', '{y}-{m}-{d} {h}:{i}')
      const commitTime = res.data.commitTime && this.$filters.parseTime(res.data.commitTime + '', '{y}-{m}-{d} {h}: {i}: {s}')
      const cancelTime = res.data.cancelTime && this.$filters.parseTime(res.data.cancelTime + '', '{y}-{m}-{d} {h}: {i}: {s}')
      this.detailsFormDatas = { ...res.data, createdTime, updatedTime, quarter, analysisTarget, hasSample, endTime, commitTime, cancelTime }
      this.$set(this.baseSearchData[13].componentsOptions, 'url', res.data.filePath)
      // this.$set(this.baseSearchData[13].componentsOptions, 'url', res.data.filePath)
      //   this.setFormDatas(this.contactsPopOptions, res.data)
    },

    // 点击更改所有人
    async okClick(params) {
      // console.log(params)
      const res = await api.sampleAnalysisModifyFollower({ ...params, customerRequireId: this.routeId })
      if (res.code !== 200) {
        return false
      }
      this.$message.success('更改所有人成功')
      // this.$emit('visibleClick', false)
      this.$set(this.OwnerPopOptions, 'visible', false)
      // console.log(this.visible)
      this.getSampleAnalysisInfoDisplay({ customerRequireId: this.routeId })
    },

    // 状态变更
    async sampleAnalysisModifyStatus(data = {}, message) {
      const res = await api.sampleAnalysisModifyStatus(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success(message)
      this.getSampleAnalysisInfoDisplay({ customerRequireId: this.routeId })
      this.closePopDialogHandle(this.withdrawPopOptions)
    },

    // 获取样板开发page
    async getModelDevelopPage(data = {}) {
      const res = await modelDevelopPage({ sampleAnalysisId: this.routeId, dataTag: 'ALL', ...data })
      const userList = res.data.list || []
      this.modelDevelopDataSource = userList
      this.modelDevelopTotal = res.data.total
      this.relevantModelDevelopOptions && this.$set(this.relevantModelDevelopOptions, 'dataSource', userList)
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    }
  }
}
