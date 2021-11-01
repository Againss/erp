import * as api from '../api/index'
import { winRateList } from '../../system-settings/winning-rate-of-business/api/index'
export const BusinessOpportunityRelevant = {
  methods: {
    // 获取商机分页列表
    async getBusinessOpportunityPage(data = {}) {
    //   console.log(this.searchFormDatas, this.formDatas)
      const res = await api.businessOpportunityPage({ ...this.formDatas, ...this.searchFormDatas, ...data })
      console.log('商机分页', res)
      this.businessOpportunityStage.length === 0 && await this.getBusinessOpportunityStage()
      const userList = res.data.list || []
      this.businessDataSource = userList
      this.businessTotal = res.data.total
      this.relevantBusinessOptions && this.$set(this.relevantBusinessOptions, 'dataSource', userList)
      //   console.log(this.businessDataSource)
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },

    // 联系人相关获取商机分页列表
    async getBusinessOpportunityAbout(data = {}) {
      //   console.log(this.searchFormDatas, this.formDatas)
      const res = await api.businessOpportunityAbout({ ...this.searchFormDatas, ...this.formDatas, ...data })
      console.log('商机分页', res)
      this.businessOpportunityStage.length === 0 && await this.getBusinessOpportunityStage()
      const userList = res.data.list || []
      this.businessDataSource = userList
      this.businessTotal = res.data.total
      this.relevantBusinessOptions && this.$set(this.relevantBusinessOptions, 'dataSource', userList)
      //   console.log(this.businessDataSource)
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },

    // 添加或者编辑商机
    addOrEditBusinessOpportunity(data) {
      if (this.type === 'add') {
        this.addBusinessOpportunity(data)
      } else if (this.type === 'edit') {
        this.editBusinessOpportunity(data)
      }
    },

    // 添加商机
    async addBusinessOpportunity(data = {}) {
      const res = await api.businessOpportunityAdd(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.businessPopOptions, 'visible', false)
      this.closePopDialogHandle(this.businessPopOptions)
      this.$message.success('添加成功')
      this.getBusinessOpportunityPage()
    },

    // 编辑商机
    async editBusinessOpportunity(data = {}, flag) {
      const res = await api.businessOpportunityModify(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.businessPopOptions, 'visible', false)
      this.closePopDialogHandle(this.businessPopOptions)
      this.$message.success('编辑成功')
      if (flag) {
        this.getBusinessOpportunityInfoDisplay({ id: this.routeId })
      } else {
        this.getBusinessOpportunityPage()
      }
    },

    // 删除商机
    async deleteBusinessOpportunity(data = {}, flag) {
      const res = await api.businessOpportunityDelete(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功')
      if (flag) {
        this.$router.back()
      } else {
        this.getBusinessOpportunityPage()
      }
    },

    // 获取商机详情
    async getBusinessOpportunityInfo(data = {}) {
      const res = await api.businessOpportunityInfo(data)
      console.log('详情', res)
      const endDate = res.data.endDate ? this.$filters.parseTime(res.data.endDate + '', '{y}-{m}-{d}') : null
      this.$set(this.businessPopOptions.content[1], 'dataSource', [{ label: res.data.customerName, value: res.data.customerId }])
      const salesAmount = res.data.salesAmount && res.data.salesAmount / 10000
      this.setFormDatas(this.businessPopOptions, { ...res.data, endDate, salesAmount })
      this.stageChange(res.data.businessStageId)
    },

    // 获取商机阶段
    async getBusinessOpportunityStage(data = {}) {
      const res = await winRateList(data)
      console.log('商机阶段', res)
      this.businessOpportunityStage = res.data
      const stage = res.data.map(item => {
        return {
          value: item.id,
          label: item.businessStage
        }
      })
      this.searchData && this.$set(this.searchData[2], 'dataSource', [{ value: null, label: '全部商机阶段' }, ...stage])
      this.$set(this.businessPopOptions.content[4], 'dataSource', stage)
    },
    // 商机阶段切换事件
    stageChange(value) {
      console.log(value)
      this.$set(this.businessPopOptions, 'formDatas', {})
      this.$set(this.businessPopOptions.formDatas, 'probability', this.businessOpportunityStage.filter(item => item.id === value)[0].rate + '%')
    },

    // 远程搜索
    remoteSearch(value) {
      console.log(value)
      if (value === '') {
        this.$set(this.businessPopOptions.content[1], 'dataSource', [])
      } else {
        if (!this.getData) {
          this.getData = this.$utils.debounce(this.remoteCustomerPage, 300)
        }
        this.getData({ name: value, dataTag: 'ALL' }, 1, this.businessPopOptions)
      }
    }

  }
}
