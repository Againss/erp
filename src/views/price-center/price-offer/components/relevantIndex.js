/*
 * @Descripttion:
 * @Author: admin
 * @Date: 2021-04-23 14:45:36
 * @LastEditors: Againss
 * @LastEditTime: 2021-05-18 10:46:55
 */
import * as api from '../api/index'
import { countriesIndex } from '../../public/api/index'
export const OfferRelevant = {
  methods: {
    // 获取报价分页列表
    async getOfferPage(data = {}) {
      const res = await api.quotationSheetBriefPage({ ...this.formDatas, ...this.searchFormDatas, ...data })
      console.log('报价', res)
      const userList = res.data.list || []
      //   this.dataSource = userList
      this.offerDataSource = userList
      this.offerTotal = res.data.total
      this.relevantOfferOptions && this.$set(this.relevantOfferOptions, 'dataSource', userList)
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total || 0,
        // ...data,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },

    // 删除报价
    async deleteOffer(data = {}, flag) {
      const res = await api.quotationSheetDelete(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功')
      const branchFlag = /crm/.test(this.branch)
      this.fetchLog(this.getLogMessages('DEL', `/${branchFlag ? 'crm' : 'priceCenter'}/quotationSheet/delete`), { quotationId: data.quotationId }, JSON.stringify({ beforeText: `在${branchFlag ? '销售管理系统-报价' : '价格中心-销售报价'}删除一条报价`, beforeCode: { quotationId: data.quotationId }}))
      if (flag) {
        this.$router.back()
      } else {
        this.getOfferPage()
      }
    },

    // 检查当前用户是否设置区域与销售
    async whetherSaler(data = {}) {
      const branchFlag = /crm/.test(this.branch)
      if (branchFlag) {
        const res = await api.crmRegionSalesRelate(data)
        console.log('区域与销售', res)
        if (res.data) {
          const { countryName, profitRate: targetProfitRate, abbr } = res.data
          this.areaData = { countryName, targetProfitRate }
          console.log(this.areaData)
          this.countryCode = abbr
          this.$confirm('您确定要将该报价复制为草稿吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.quotationSheetCopy({ quotationId: this.routeId, countryName, targetProfitRate, countryCode: this.countryCode })
          }).catch(() => {
          // console.log(this.fullDataList)
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        } else {
          this.$message.error('请到销售与区域设置当前用户的区域与销售')
        }
      } else {
        this.$confirm('您确定要将该报价复制为草稿吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.quotationSheetCopy({
            quotationId: this.routeId,
            id: this.$route.params.codeid,
            profitId: this.fullDataList.profitId,
            countryName: this.fullDataList.countryName,
            targetProfitRate: this.fullDataList.targetProfitRate,
            sellerName: this.fullDataList.sellerName,
            countryCode: this.fullDataList.countryCode
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },

    // 根据区域名字查countryCode
    async getCountryCodeByName(data = {}) {
      const res = await countriesIndex(data)
      if (res.code !== 200) {
        return false
      }
      const dataList = res.data ? res.data.list : []
      dataList.forEach(item => {
        if (data.name === item.name) {
          this.countryCode = item.abbr || ''
        }
      })
    }

  }
}
