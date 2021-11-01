import * as api from '../api/index'
import { sysUserInfo, customerBrandBrandPage, paymentTerms, priceTerms } from '@/views/crm/public/api/index'
import { modelDevelopPage } from '../../model-develop/api/index'
export const SalesOrderRelevant = {
  methods: {
    // 获取销售订单分页列表
    async getSalesOrderPage(data = {}) {
      const res = await api.salesOrderPage({ ...this.formDatas, ...this.searchFormDatas, ...data })
      console.log('销售订单', res)
      const userList = res.data.list || []
      this.salesOrderDataSource = userList
      this.salesOrderTotal = res.data.total
      this.relevantAnalysisOptions && this.$set(this.relevantAnalysisOptions, 'dataSource', userList)
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },

    // 添加或者编辑销售订单
    addOrEditSalesOrder(data) {
      if (this.type === 'add') {
        this.addSalesOrder(data)
      } else if (this.type === 'edit') {
        this.editSalesOrder(data)
      }
    },

    // 添加销售订单
    async addSalesOrder(data = {}) {
      const res = await api.salesOrderAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.closePopDialogHandle(this.salesOrderPopOptions)
      this.$message.success('添加成功')
      this.getSalesOrderPage()
    },

    // 编辑销售订单
    async editSalesOrder(data = {}, flag) {
      const res = await api.salesOrderModify(data)
      if (res.code !== 200) {
        return false
      }
      this.closePopDialogHandle(this.salesOrderPopOptions)
      this.$message.success('编辑成功')
      if (flag) {
        this.getSalesOrderInfoDisplay({ customerRequireId: this.routeId })
      } else {
        this.getSalesOrderPage()
      }
    },

    // 删除销售订单
    async deleteSalesOrder(data = {}, flag) {
      const res = await api.salesOrderDelete(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功')
      if (flag) {
        this.$router.back()
      } else {
        this.getSalesOrderPage()
      }
    },

    // 获取销售订单详情
    async getSalesOrderInfo(data = {}) {
      const res = await api.salesOrderInfo(data)
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
      const payCondition = {
        label: res.data.payConditionName,
        value: res.data.payCondition * 1
      }
      const priceTerm = {
        label: res.data.priceTermName,
        value: res.data.priceTerm * 1
      }
      const orderFilePath = res.data.orderFilePath ? [{ name: res.data.orderFileName, url: res.data.orderFilePath }] : null
      const styleFilePath = res.data.styleFilePath ? [{ name: res.data.styleFileName, url: res.data.styleFilePath }] : null
      const otherFilePath = res.data.otherFilePath ? [{ name: res.data.otherFileName, url: res.data.otherFilePath }] : null
      this.getBrandBusiness({ customerId: res.data.customerId })
      this.getOrgs({ userId: res.data.sellerId })
      const totalAmount = res.data.totalAmount && res.data.totalAmount / 10000
      // this.$set(this.salesOrderPopOptions.content[0], 'dataSource', [{ label: res.data.businessOpportunityName, value: res.data.businessOpportunityId }])
      this.setFormDatas(this.salesOrderPopOptions, { ...res.data, brandId, orderFilePath, styleFilePath, otherFilePath, sellerTeamId, totalAmount, payCondition, priceTerm })
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
      this.$set(this.salesOrderPopOptions.content[5], 'dataSource', dataList)
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
      this.$set(this.salesOrderPopOptions.content[2], 'dataSource', dataList)
    },

    // 获取样板开发已完成列表
    async getModelDevelopPage(data = {}) {
      const res = await modelDevelopPage({ pageNum: 1, pageSize: 5, status: 'C', dataTag: 'ALL', keyword: this.modelDevelopPopOptions.formDatas.search, ...data })
      data.keyword && this.$set(this.modelDevelopPopOptions.formDatas, 'search', data.keyword)
      console.log('样板开发', res)
      const dataList = res.data.list || []
      this.modelDevelopList = dataList
      this.$set(this.modelDevelopPopOptions.content[2], 'dataSource', dataList)
      this.modelDevelopPagination = {
        ...this.modelDevelopPagination,
        dataTotal: res.data ? res.data.total : 0,
        // ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
      this.$set(this.modelDevelopPopOptions.content[2], 'pagination', this.modelDevelopPagination)
    },

    // 获取付款条件列表
    async getPaymentTermsList(data = {}) {
      const res = await paymentTerms(data)
      console.log('付款条件列表', res)
      const dataList = res.data ? res.data.map(item => {
        return {
          label: item.name,
          value: item.id
        }
      }) : []
      this.$set(this.salesOrderPopOptions.content[9], 'dataSource', dataList)
    },

    // 获取付款条款列表
    async getPriceTermsList(data = {}) {
      const res = await priceTerms(data)
      console.log('付款条款列表', res)
      const dataList = res.data ? res.data.map(item => {
        return {
          label: item.name,
          value: item.id
        }
      }) : []
      this.$set(this.salesOrderPopOptions.content[10], 'dataSource', dataList)
    }
  }
}
