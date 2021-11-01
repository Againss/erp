import * as api from '../api/index'
import { salesOrderPage } from '../../sales-order/api/index'
export const Customer = {
  methods: {
    // 获取客户详情并显示
    async getCustomerInfoDisplay(data = {}) {
      const res = await api.customerInfo(data)
      //   console.log('详情', res)
      // const gender = res.data.gender && res.data.gender === 'M' ? '男' : '女'
      const createdTime = res.data.createdTime && this.$filters.parseTime(res.data.createdTime + '', '{y}-{m}-{d} {h}: {i}: {s}')
      const updatedTime = res.data.updatedTime && this.$filters.parseTime(res.data.updatedTime + '', '{y}-{m}-{d} {h}: {i}: {s}')
      this.follower = res.data.follower
      const provinceArray = this.areaList.filter(item => item.id === res.data.provinceId * 1)
      const provinceId = provinceArray.length !== 0 ? provinceArray[0].name : ''
      const cityArray = this.areaList.filter(item => item.id === res.data.cityId * 1)
      const cityId = cityArray.length !== 0 ? cityArray[0].name : ''
      const areaArray = this.areaList.filter(item => item.id === res.data.areaId * 1)
      const areaId = areaArray.length !== 0 ? areaArray[0].name : ''
      // console.log(this.areaList, provinceId, cityId, areaId)
      this.customerFormDatas = { ...res.data, createdTime, updatedTime, provinceId, cityId, areaId }
      //   this.setFormDatas(this.customerPopOptions, res.data)
    },

    // 获取客户详情
    // async getCustomerInfo(data = {}) {
    //   const res = await api.customerInfo(data)
    //   console.log('详情', res)
    //   const provinceId = res.data.provinceId ? res.data.provinceId * 1 : null
    //   const cityId = res.data.cityId ? res.data.cityId * 1 : null
    //   const areaId = res.data.areaId ? res.data.areaId * 1 : null
    //   this.customerProvinceChange(provinceId)
    //   this.customerCityChange(cityId)
    //   // this.customerName = res.data.customerName
    //   this.setFormDatas(this.customerPopOptions, { ...res.data, provinceId, cityId, areaId })
    // },

    // 点击更改所有人
    async okClick(params) {
      // console.log(params)
      const res = await api.customerModifyFollower({ ...params, customerId: this.routeId })
      if (res.code !== 200) {
        return false
      }
      this.$message.success('更改所有人成功')
      // this.$emit('visibleClick', false)
      this.$set(this.OwnerPopOptions, 'visible', false)
      // console.log(this.visible)
      this.getCustomerInfoDisplay({ customerId: this.routeId })
    },

    // 获取销售订单申请page
    async getSalesOrderPage(data = {}) {
      const res = await salesOrderPage({ customerId: this.routeId, dataTag: 'ALL', ...data })
      const userList = res.data.list || []
      this.salesOrderDataSource = userList
      this.salesOrderTotal = res.data.total
      this.relevantSalesOrderOptions && this.$set(this.relevantSalesOrderOptions, 'dataSource', userList)
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
