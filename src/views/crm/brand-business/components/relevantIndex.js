import * as api from '../api/index'
export const BrandBusinessRelevant = {
  methods: {
    // 获取品牌商分页列表
    async getBrandBusinessPage(data = {}) {
      const res = await api.brandPage({ ...this.formDatas, ...this.searchFormDatas, ...data })
      console.log('品牌商分页', res)
      const userList = res.data.list || []
      this.brandBusinessDataSource = userList
      this.brandBusinessTotal = res.data.total
      this.relevantBrandOptions && this.$set(this.relevantBrandOptions, 'dataSource', userList)
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },

    // 添加或者编辑品牌商
    addOrEditBrandBusiness(data) {
      if (this.type === 'add') {
        this.addBrandBusiness(data)
      } else if (this.type === 'edit') {
        this.editBrandBusiness(data)
      }
    },

    // 添加品牌商
    async addBrandBusiness(data = {}) {
      const res = await api.brandAdd(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.brandBusinessPopOptions, 'visible', false)
      this.closePopDialogHandle(this.brandBusinessPopOptions)
      this.$message.success('添加成功')
      this.getBrandBusinessPage()
    },

    // 编辑品牌商
    async editBrandBusiness(data = {}, flag) {
      const res = await api.brandModify(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.brandBusinessPopOptions, 'visible', false)
      this.closePopDialogHandle(this.brandBusinessPopOptions)
      this.$message.success('编辑成功')
      if (flag) {
        // console.log(111)
        this.getBrandBusinessInfoDisplay({ id: this.routeId })
      } else {
        this.getBrandBusinessPage()
      }
    },

    // 删除品牌商
    async deleteBrandBusiness(data = {}, flag) {
      const res = await api.brandDelete(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功')
      if (flag) {
        this.$router.back()
      } else {
        this.getBrandBusinessPage()
      }
    },

    // 获取品牌商详情
    async getBrandBusinessInfo(data = {}) {
      const res = await api.brandInfo(data)
      console.log('详情', res)
      const provinceId = res.data.provinceId ? res.data.provinceId * 1 : null
      const cityId = res.data.cityId ? res.data.cityId * 1 : null
      const areaId = res.data.areaId ? res.data.areaId * 1 : null
      this.brandProvinceChange(provinceId)
      this.brandCityChange(cityId)
      //   this.$set(this.brandBusinessPopOptions.content[2], 'dataSource', [{ label: res.data.customerName, value: res.data.customerId }])
      this.setFormDatas(this.brandBusinessPopOptions, { ...res.data, provinceId, cityId, areaId })
    },

    // 远程搜索
    remoteSearch(value) {
      console.log(value)
      if (value === '') {
        this.$set(this.brandBusinessPopOptions.content[2], 'dataSource', [])
      } else {
        if (!this.getData) {
          this.getData = this.$utils.debounce(this.remoteCustomerPage, 300)
        }
        this.getData({ name: value, dataTag: 'ALL' }, 2, this.brandBusinessPopOptions)
      }
    },

    // 省change事件
    brandProvinceChange(value, form, formDatas, setFormDatas) {
      console.log(value)
      setFormDatas && setFormDatas({ cityId: '' })
      setFormDatas && setFormDatas({ areaId: '' })
      // console.log(this.popOptions.formDatas)
      if (value) {
        this.$set(this.brandBusinessPopOptions.content[2], 'dataSource', this.areaList.filter(item => item.parentId === value).map(item => {
          return {
            label: item.name,
            value: item.id
          }
        }))
      }
    },

    // 市change事件
    brandCityChange(value, form, formDatas, setFormDatas) {
      console.log(value)
      // this.$set(this.popOptions.formDatas, 'areaId', null)
      setFormDatas && setFormDatas({ areaId: '' })
      if (value) {
        this.$set(this.brandBusinessPopOptions.content[3], 'dataSource', this.areaList.filter(item => item.parentId === value).map(item => {
          return {
            label: item.name,
            value: item.id
          }
        }))
      }
    }

  }
}
