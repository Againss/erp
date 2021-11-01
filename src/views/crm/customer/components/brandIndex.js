// import * as api from '../api/index'
import { customerBrandBrandPage, customerBrandLink, customerBrandUnlink } from '../../brand-business/api/index'
export const RelevantBrand = {
  methods: {
    // 获取品牌商分页列表
    async getBrandPage(data = {}) {
      const res = await customerBrandBrandPage({ ...data, dataTag: 'ALL', customerId: this.routeId })
      console.log('品牌商', res)
      const userList = res.data.list || []
      //   this.dataSource = userList
      this.brandDataSource = userList
      this.brandTotal = res.data.total
      this.relevantBrandOptions && this.$set(this.relevantBrandOptions, 'dataSource', userList)
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },

    // 关联品牌商
    async relationBrand(data = {}) {
      const res = await customerBrandLink(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('关联品牌商成功')
      this.closePopDialogHandle(this.brandPopOptions)
      this.getBrandPage()
    },

    // 取消关联品牌商
    async disassociateBrand(data = {}) {
      const res = await customerBrandUnlink(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('取消关联品牌商成功')
      this.getBrandPage()
    }

  }
}

