import * as api from '../api/index'
// import { winRateList } from '../../system-settings/winning-rate-of-business/api/index'
export const BusinessOpportunity = {
  created() {
    // this.getBusinessOpportunityStage()
  },
  methods: {

    // 获取商机详情并显示
    async getBusinessOpportunityInfoDisplay(data = {}) {
      const res = await api.businessOpportunityInfo(data)
      await this.getBusinessOpportunityStage()
      console.log('详情', res, this.businessOpportunityStage)
      const businessStage = this.businessOpportunityStage.filter(item => item.id === res.data.businessStageId)[0]
      const businessStageId = businessStage.businessStage
      const probability = businessStage.rate + '%'
      const salesAmount = res.data.salesAmount ? this.numRecursion(res.data.salesAmount / 10000) : ''
      const createdTime = res.data.createdTime && this.$filters.parseTime(res.data.createdTime + '', '{y}-{m}-{d} {h}: {i}: {s}')
      const updatedTime = res.data.updatedTime && this.$filters.parseTime(res.data.updatedTime + '', '{y}-{m}-{d} {h}: {i}: {s}')
      const endDate = res.data.endDate && this.$filters.parseTime(res.data.endDate + '', '{y}-{m}-{d}')
      this.businessFormDatas = { ...res.data, createdTime, updatedTime, businessStageId, probability, endDate, salesAmount }
      this.reverseDisplay(res.data.businessStageId)
      //   this.setFormDatas(this.popOptions, res.data)
    },

    // 点击更改所有人
    async okClick(params) {
      // console.log(params)
      const res = await api.businessOpportunityModifyFollower({ ...params, id: this.routeId })
      if (res.code !== 200) {
        return false
      }
      this.$message.success('更改所有人成功')
      this.closePopDialogHandle(this.OwnerPopOptions)
      // this.$emit('visibleClick', false)
      // this.visible = false
      // console.log(this.visible)
      this.getBusinessOpportunityInfoDisplay({ id: this.routeId })
    },

    // 根据id反显步骤条
    reverseDisplay(id) {
      // console.log(id, this.businessOpportunityStage)
      if (this.businessOpportunityStage.filter(item => item.id === id)[0].rate === '0') {
        this.businessStage = -1
        this.lostOrder = 0
      } else {
        this.businessStage = id - 1
        this.lostOrder = -1
      }
    },

    // 更改商机阶段
    async changeBusinessStage(data = {}) {
      const res = await api.businessOpportunityModifyStage({ ...data, id: this.routeId })
      if (res.code !== 200) {
        return false
      }
      this.$message.success('更改商机阶段成功')
      this.getBusinessOpportunityInfoDisplay({ id: this.routeId })
    }

  }
}
