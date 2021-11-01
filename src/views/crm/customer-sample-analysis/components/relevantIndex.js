import * as api from '../api/index'
import { sysUserInfo, customerBrandBrandPage } from '@/views/crm/public/api/index'
export const SampleAnalysisRelevant = {
  methods: {
    // 获取客样分析分页列表
    async getSampleAnalysisPage(data = {}) {
      const res = await api.sampleAnalysisPage({ ...this.formDatas, ...this.searchFormDatas, ...data })
      console.log('客样分析', res)
      const userList = res.data.list || []
      this.sampleAnalysisDataSource = userList
      this.sampleAnalysisTotal = res.data.total
      this.relevantAnalysisOptions && this.$set(this.relevantAnalysisOptions, 'dataSource', userList)
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },

    // 添加或者编辑客样分析
    addOrEditSampleAnalysis(data) {
      if (this.type === 'add') {
        this.addSampleAnalysis(data)
      } else if (this.type === 'edit') {
        this.editSampleAnalysis(data)
      }
    },

    // 添加客样分析
    async addSampleAnalysis(data = {}) {
      const res = await api.sampleAnalysisAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.closePopDialogHandle(this.sampleAnalysisPopOptions)
      this.$message.success('添加成功')
      this.getSampleAnalysisPage()
    },

    // 编辑客样分析
    async editSampleAnalysis(data = {}, flag) {
      const res = await api.sampleAnalysisModify(data)
      if (res.code !== 200) {
        return false
      }
      this.closePopDialogHandle(this.sampleAnalysisPopOptions)
      this.$message.success('编辑成功')
      if (flag) {
        this.getSampleAnalysisInfoDisplay({ customerRequireId: this.routeId })
      } else {
        this.getSampleAnalysisPage()
      }
    },

    // 删除客样分析
    async deleteSampleAnalysis(data = {}, flag) {
      const res = await api.sampleAnalysisDelete(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功')
      if (flag) {
        this.$router.back()
      } else {
        this.getSampleAnalysisPage()
      }
    },

    // 获取客样分析详情
    async getSampleAnalysisInfo(data = {}) {
      const res = await api.sampleAnalysisInfo(data)
      console.log('详情', res)
      const endTime = this.$filters.parseTime(res.data.endTime + '', '{y}-{m}-{d} {h}:{i}')
      const hasSample = res.data.hasSample + ''
      const analysisTarget = res.data.analysisTarget.split('|')
      const brandId = {
        label: res.data.brandName,
        value: res.data.brandId
      }
      const businessOpportunityId = {
        label: res.data.businessOpportunityName,
        value: res.data.businessOpportunityId
      }
      const sellerTeamId = {
        label: res.data.sellerTeamName,
        value: res.data.sellerTeamId
      }
      const filePath = res.data.filePath ? [{ name: res.data.fileName, url: res.data.filePath }] : null
      this.getBrandBusiness({ customerId: res.data.customerId })
      this.getOrgs({ userId: res.data.sellerId })
      this.$set(this.sampleAnalysisPopOptions.content[0], 'dataSource', [{ label: res.data.businessOpportunityName, value: res.data.businessOpportunityId }])
      this.setFormDatas(this.sampleAnalysisPopOptions, { ...res.data, endTime, hasSample, analysisTarget, brandId, filePath, businessOpportunityId, sellerTeamId })
    },

    // 根据客户查询品牌商
    async getBrandBusiness(data = {}) {
      const res = await customerBrandBrandPage({ dataTag: 'ALL', ...data })
      console.log('品牌商列表', res)
      const dataList = res.data.list ? res.data.list.map(item => {
        return {
          label: item.name,
          value: item.id
        }
      }) : []
      this.$set(this.sampleAnalysisPopOptions.content[4], 'dataSource', dataList)
    },

    // 点击编辑根据销售员查销售部门
    async getOrgs(data = {}) {
      const res = await sysUserInfo(data)
      console.log(res)
      const dataList = (res.data.orgs && res.data.orgs.length !== 0) ? res.data.orgs.filter(item => item.functionTag === 'SAL').map(item => {
        return {
          label: item.name,
          value: item.orgId
        }
      }) : []
      this.$set(this.sampleAnalysisPopOptions.content[2], 'dataSource', dataList)
    }

  }
}
