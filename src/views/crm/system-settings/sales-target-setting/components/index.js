import * as api from '../api/index'
export const SaleTarget = {
  methods: {
    // 新建销售目标
    createSaleTarget() {
      this.type = 'add'
      this.PopDialogHandle(this.popOptions, '新建销售目标')
    },

    // 获取销售目标分页列表
    async getSaleTargetPage(data = {}) {
      const res = await api.salestargetPage({ ...this.formDatas, ...this.searchFormDatas, ...data })
      console.log('销售目标', res)
      const userList = res.data.list || []
      this.dataSource = userList
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },

    // 添加或者编辑销售目标
    addOrEditSaleTarget(data) {
      if (this.type === 'add') {
        this.addSaleTarget(data)
      } else if (this.type === 'edit') {
        this.editSaleTarget(data)
      }
    },

    // 添加销售目标
    async addSaleTarget(data = {}) {
      const res = await api.salestargetAdd(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.popOptions, 'visible', false)
      this.closePopDialogHandle(this.popOptions)
      this.$message.success('添加成功')
      this.getSaleTargetPage()
    },

    // 编辑销售目标
    async editSaleTarget(data = {}) {
      const res = await api.salestargetModify(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.popOptions, 'visible', false)
      this.closePopDialogHandle(this.popOptions)
      this.$message.success('编辑成功')
      this.getSaleTargetPage()
    },

    // 删除销售目标
    async deleteSaleTarget(data = {}) {
      const res = await api.salestargetDelete(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功')
      this.getSaleTargetPage()
    },

    // 获取销售目标详情
    async getSaleTargetInfo(data = {}) {
      const res = await api.salestargetInfo(data)
      console.log('详情', res)
      this.$set(this.popOptions.content[0], 'dataSource', [{ label: res.data.userName, value: res.data.userId }])
      const [january, february, march, april, may, june, july, august, september, october, november, december] = this.months.map(item => res.data[item] ? res.data[item] / 10000 : null)
      this.setFormDatas(this.popOptions, { ...res.data, january, february, march, april, may, june, july, august, september, october, november, december })
    }
  },
  computed: {}
}
