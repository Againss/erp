import * as api from '../api/index'
export const BrandBusiness = {
  methods: {
    // 获取联系人详情并显示
    async getBrandBusinessInfoDisplay(data = {}) {
      const res = await api.brandInfo(data)
      // console.log('详情', res, this.areaList)
      // this.customerId = res.data.customerId
      //   const gender = res.data.gender && res.data.gender === 'M' ? '男' : '女'
      const createdTime = res.data.createdTime && this.$filters.parseTime(res.data.createdTime + '', '{y}-{m}-{d} {h}: {i}: {s}')
      const updatedTime = res.data.updatedTime && this.$filters.parseTime(res.data.updatedTime + '', '{y}-{m}-{d} {h}: {i}: {s}')
      const provinceArray = this.areaList.filter(item => item.id === res.data.provinceId * 1)
      const provinceId = provinceArray.length !== 0 ? provinceArray[0].name : ''
      const cityArray = this.areaList.filter(item => item.id === res.data.cityId * 1)
      const cityId = cityArray.length !== 0 ? cityArray[0].name : ''
      const areaArray = this.areaList.filter(item => item.id === res.data.areaId * 1)
      const areaId = areaArray.length !== 0 ? areaArray[0].name : ''
      this.detailsFormDatas = { ...res.data, createdTime, updatedTime, provinceId, cityId, areaId }
      //   this.setFormDatas(this.contactsPopOptions, res.data)
    },

    // 点击更改所有人
    async okClick(params) {
      // console.log(params)
      const res = await api.brandModifyFollower({ ...params, id: this.routeId })
      if (res.code !== 200) {
        return false
      }
      this.$message.success('更改所有人成功')
      // this.$emit('visibleClick', false)
      this.$set(this.OwnerPopOptions, 'visible', false)
      // console.log(this.visible)
      this.getBrandBusinessInfoDisplay({ id: this.routeId })
    },

    // 获取品牌商分页列表
    async getBrandBusinessCustomerPage(data = {}) {
      const res = await api.customerBrandCustomerPage({ ...this.searchFormDatas, ...this.formDatas, ...data })
      console.log('品牌商详情客户分页', res)
      const userList = res.data.list || []
      this.brandBusinessCustomerDataSource = userList
      this.brandBusinessCustomerTotal = res.data.total
      this.relevantCustomerOptions && this.$set(this.relevantCustomerOptions, 'dataSource', userList)
    //   this.pagination = {
    //     ...this.pagination,
    //     dataTotal: res.data ? res.data.total : 0,
    //     ...data,
    //     currentPage: res.data.pageNum,
    //     pageSize: res.data.pageSize
    //   }
    },

    // 品牌商关联客户
    async brandLinkCustomer(data = {}) {
      const res = await api.customerBrandLink(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('关联客户成功')
      this.getBrandBusinessCustomerPage()
      this.closePopDialogHandle(this.customerPopOptions)
    },

    // 品牌商取消关联客户
    async brandUnlinkCustomer(data = {}) {
      const res = await api.customerBrandUnlink(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('取消关联客户成功')
      this.getBrandBusinessCustomerPage()
    }
  }
}
