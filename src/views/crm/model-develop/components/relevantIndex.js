import * as api from '../api/index'
import { sysUserInfo, customerBrandBrandPage } from '@/views/crm/public/api/index'
import { sampleAnalysisPage } from '../../customer-sample-analysis/api/index'
export const ModelDevelopRelevant = {
  methods: {
    // 获取样板开发分页列表
    async getModelDevelopPage(data = {}) {
      const res = await api.modelDevelopPage({ ...this.formDatas, ...this.searchFormDatas, ...data })
      console.log('样板开发', res)
      const userList = res.data.list || []
      this.modelDevelopDataSource = userList
      this.modelDevelopTotal = res.data.total
      this.relevantAnalysisOptions && this.$set(this.relevantAnalysisOptions, 'dataSource', userList)
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },

    // 添加或者编辑样板开发
    addOrEditModelDevelop(data) {
      if (this.type === 'add') {
        this.addModelDevelop(data)
      } else if (this.type === 'edit') {
        this.editModelDevelop(data)
      }
    },

    // 添加样板开发
    async addModelDevelop(data = {}) {
      const res = await api.modelDevelopAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.closePopDialogHandle(this.modelDevelopPopOptions)
      this.$message.success('添加成功')
      this.getModelDevelopPage()
    },

    // 编辑样板开发
    async editModelDevelop(data = {}, flag) {
      const res = await api.modelDevelopModify(data)
      if (res.code !== 200) {
        return false
      }
      this.closePopDialogHandle(this.modelDevelopPopOptions)
      this.$message.success('编辑成功')
      if (flag) {
        this.getModelDevelopInfoDisplay({ customerRequireId: this.routeId })
      } else {
        this.getModelDevelopPage()
      }
    },

    // 删除样板开发
    async deleteModelDevelop(data = {}, flag) {
      const res = await api.modelDevelopDelete(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功')
      if (flag) {
        this.$router.back()
      } else {
        this.getModelDevelopPage()
      }
    },

    // 获取样板开发详情
    async getModelDevelopInfo(data = {}) {
      const res = await api.modelDevelopInfo(data)
      console.log('详情', res)
      // const endTime = this.$filters.parseTime(res.data.endTime + '', '{y}-{m}-{d}')
      // const hasSample = res.data.hasSample + ''
      // const analysisTarget = res.data.analysisTarget.split('/')
      const brandId = {
        label: res.data.brandName,
        value: res.data.brandId
      }
      // const businessOpportunityId = {
      //   label: res.data.businessOpportunityName,
      //   value: res.data.businessOpportunityId
      // }
      const sellerTeamId = {
        label: res.data.sellerTeamName,
        value: res.data.sellerTeamId
      }
      const orderFilePath = res.data.orderFilePath ? [{ name: res.data.orderFileName, url: res.data.orderFilePath }] : null
      const styleFilePath = res.data.styleFilePath ? [{ name: res.data.styleFileName, url: res.data.styleFilePath }] : null
      const otherFilePath = res.data.otherFilePath ? [{ name: res.data.otherFileName, url: res.data.otherFilePath }] : null
      this.getBrandBusiness({ customerId: res.data.customerId })
      this.getOrgs({ userId: res.data.sellerId })
      const totalAmount = res.data.totalAmount && res.data.totalAmount / 10000
      // this.$set(this.modelDevelopPopOptions.content[0], 'dataSource', [{ label: res.data.businessOpportunityName, value: res.data.businessOpportunityId }])
      this.setFormDatas(this.modelDevelopPopOptions, { ...res.data, brandId, orderFilePath, styleFilePath, otherFilePath, sellerTeamId, totalAmount })
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
      this.$set(this.modelDevelopPopOptions.content[5], 'dataSource', dataList)
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
      this.$set(this.modelDevelopPopOptions.content[2], 'dataSource', dataList)
    },

    // 获取客样分析已完成列表
    async getSampleAnalysisPage(data = {}) {
      const res = await sampleAnalysisPage({ pageNum: 1, pageSize: 5, status: 'C', dataTag: 'ALL', keyword: this.sampleAnalysisPopOptions.formDatas.search, ...data })
      data.keyword && this.$set(this.sampleAnalysisPopOptions.formDatas, 'search', data.keyword)
      console.log('客样分析', res)
      const dataList = res.data.list || []
      this.sampleAnalysisList = dataList
      this.$set(this.sampleAnalysisPopOptions.content[2], 'dataSource', dataList)
      this.sampleAnalysisPagination = {
        ...this.sampleAnalysisPagination,
        dataTotal: res.data ? res.data.total : 0,
        // ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.$set(this.sampleAnalysisPopOptions.content[2], 'pagination', this.sampleAnalysisPagination)
    }
  }
}
