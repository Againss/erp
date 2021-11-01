import * as api from '../api/index'
import { customerLevelList } from '../../system-settings/customer-level-options/api/index.js'
import { customerTypeList } from '../../system-settings/customer-type-options/api/index.js'
export const CustomerRelevant = {
  methods: {
    // 获取客户分页列表
    async getCustomerPage(data = {}) {
      const res = await api.customerPage({ ...this.formDatas, ...this.searchFormDatas, ...data })
      console.log('客户', res)
      // await Promise.all([this.getCustomerLeveList(), this.getCustomerTypeList()])
      const userList = res.data.list || []
      //   this.dataSource = userList
      this.customerDataSource = userList
      this.customerTotal = res.data.total
      this.relevantCustomerOptions && this.$set(this.relevantCustomerOptions, 'dataSource', userList)
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },

    // 添加或者编辑客户
    addOrEditCustomer(data) {
      if (this.type === 'add') {
        this.addCustomer(data)
      } else if (this.type === 'edit') {
        this.editCustomer(data)
      }
    },

    // 添加客户
    async addCustomer(data = {}) {
      const res = await api.customerAdd(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.customerPopOptions, 'visible', false)
      this.closePopDialogHandle(this.customerPopOptions)
      this.$message.success('添加成功')
      this.getCustomerPage()
    },

    // 编辑客户
    async editCustomer(data = {}, flag) {
      const res = await api.customerModify(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.customerPopOptions, 'visible', false)
      this.closePopDialogHandle(this.customerPopOptions)
      this.$message.success('编辑成功')
      if (flag) {
        this.getCustomerInfoDisplay({ customerId: this.routeId })
      } else {
        this.getCustomerPage()
      }
    },

    // 删除客户
    async deleteCustomer(data = {}, flag) {
      const res = await api.customerDelete(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功')
      if (flag) {
        this.$router.back()
      } else {
        this.getCustomerPage()
      }
    },

    // 获取客户详情
    async getCustomerInfo(data = {}) {
      const res = await api.customerInfo(data)
      console.log('详情', res)
      const customerDate = this.$filters.parseTime(res.data.customerDate + '', '{y}-{m}-{d} {h}:{i}:{s}')
      const level = res.data.level * 1
      const provinceId = res.data.provinceId ? res.data.provinceId * 1 : null
      const cityId = res.data.cityId ? res.data.cityId * 1 : null
      const areaId = res.data.areaId ? res.data.areaId * 1 : null
      this.customerProvinceChange(provinceId)
      this.customerCityChange(cityId)
      // this.customerName = res.data.customerName
      this.setFormDatas(this.customerPopOptions, { ...res.data, customerDate, level, provinceId, cityId, areaId })
      // const startTime = this.$filters.parseTime(res.data.startTime + '', '{y}-{m}-{d} {h}:{i}:{s}')
      // const endTime = this.$filters.parseTime(res.data.endTime + '', '{y}-{m}-{d} {h}:{i}:{s}')
      // this.setFormDatas(this.customerPopOptions, { ...res.data, customerDate, level })
    },

    // 获取全部客户级别
    async getCustomerLeveList(data = {}) {
      const res = await customerLevelList(data)
      console.log('级别', res)
      this.customerleveList = res.data
      const leve = res.data ? res.data.map(item => {
        return {
          value: item.id,
          label: item.name
        }
      }) : []
      this.searchData && this.$set(this.searchData[2], 'dataSource', [{ value: null, label: '全部商机阶段' }, ...leve])
      this.$set(this.customerPopOptions.content[3], 'dataSource', leve)
    },

    // 获取全部客户类型
    async getCustomerTypeList(data = {}) {
      const res = await customerTypeList(data)
      console.log('类型', res)
      this.customerTypeList = res.data
      const type = res.data ? res.data.map(item => {
        return {
          value: item.id,
          label: item.name
        }
      }) : []
      // this.searchData && this.$set(this.searchData[2], 'dataSource', [{ value: null, label: '全部商机阶段' }, ...type])
      this.$set(this.customerPopOptions.content[2], 'dataSource', type)
    },

    // 省change事件
    customerProvinceChange(value, form, formDatas, setFormDatas) {
      console.log(value)
      setFormDatas && setFormDatas({ cityId: '' })
      setFormDatas && setFormDatas({ areaId: '' })
      // console.log(this.popOptions.formDatas)
      if (value) {
        this.$set(this.customerPopOptions.content[6], 'dataSource', this.areaList.filter(item => item.parentId === value).map(item => {
          return {
            label: item.name,
            value: item.id
          }
        }))
      }
    },

    // 市change事件
    customerCityChange(value, form, formDatas, setFormDatas) {
      console.log(value)
      // this.$set(this.popOptions.formDatas, 'areaId', null)
      setFormDatas && setFormDatas({ areaId: '' })
      if (value) {
        this.$set(this.customerPopOptions.content[7], 'dataSource', this.areaList.filter(item => item.parentId === value).map(item => {
          return {
            label: item.name,
            value: item.id
          }
        }))
      }
    }

  }
}
