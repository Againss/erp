import * as api from '../api/index'
export const Competitor = {
  methods: {
    // 新建竞争对手
    createCompetitor() {
      this.type = 'add'
      this.PopDialogHandle(this.popOptions, '新建竞争对手')
    },

    // 获取竞争对手分页列表
    async getCompetitorPage(data = {}) {
      const res = await api.competitorPage({ ...this.formDatas, ...this.searchFormDatas, ...data })
      console.log('竞争对手', res)
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

    // 添加或者编辑竞争对手
    addOrEditCompetitor(data) {
      if (this.type === 'add') {
        this.addCompetitor(data)
      } else if (this.type === 'edit') {
        this.editCompetitor(data)
      }
    },

    // 添加竞争对手
    async addCompetitor(data = {}) {
      const res = await api.competitorAdd(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.popOptions, 'visible', false)
      this.closePopDialogHandle(this.popOptions)
      this.$message.success('添加成功')
      this.getCompetitorPage()
    },

    // 编辑竞争对手
    async editCompetitor(data = {}, flag) {
      const res = await api.competitorModify(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.popOptions, 'visible', false)
      this.closePopDialogHandle(this.popOptions)
      this.$message.success('编辑成功')
      if (flag) {
        // this.formDatas = data
        this.getCompetitorInfoDisplay({ id: this.routeId })
      } else {
        this.getCompetitorPage()
      }
    },

    // 删除竞争对手
    async deleteCompetitor(data = {}, flag) {
      const res = await api.competitorDelete(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功')
      if (flag) {
        this.$router.back()
      } else {
        this.getCompetitorPage()
      }
    },

    // 获取竞争对手详情
    async getCompetitorInfo(data = {}) {
      const res = await api.competitorInfo(data)
      console.log('详情', res)
      const provinceId = res.data.provinceId ? res.data.provinceId * 1 : null
      const cityId = res.data.cityId ? res.data.cityId * 1 : null
      const areaId = res.data.areaId ? res.data.areaId * 1 : null
      this.provinceChange(provinceId)
      this.cityChange(cityId)
      const lastYearsSales = res.data.lastYearsSales && res.data.lastYearsSales / 10000
      this.setFormDatas(this.popOptions, { ...res.data, provinceId, cityId, areaId, lastYearsSales })
    },

    // 获取竞争对手详情并显示
    async getCompetitorInfoDisplay(data = {}) {
      const res = await api.competitorInfo(data)
      //   console.log('详情', res)
      const createdTime = res.data.createdTime && this.$filters.parseTime(res.data.createdTime + '', '{y}-{m}-{d} {h}: {i}: {s}')
      const updatedTime = res.data.updatedTime && this.$filters.parseTime(res.data.updatedTime + '', '{y}-{m}-{d} {h}: {i}: {s}')
      const provinceArray = this.areaList.filter(item => item.id === res.data.provinceId * 1)
      const provinceId = provinceArray.length !== 0 ? provinceArray[0].name : ''
      const cityArray = this.areaList.filter(item => item.id === res.data.cityId * 1)
      const cityId = cityArray.length !== 0 ? cityArray[0].name : ''
      const areaArray = this.areaList.filter(item => item.id === res.data.areaId * 1)
      const areaId = areaArray.length !== 0 ? areaArray[0].name : ''
      // console.log(this.areaList, provinceArray, cityArray, areaArray)
      // console.log(this.getAreaSearchInfo({ id: res.data.provinceId }))
      // let provinceId, cityId, areaId
      // await Promise.all([
      //   this.getAreaSearchInfo({ id: res.data.provinceId }).then(res => {
      //     console.log(res)
      //     provinceId = res.data.name
      //   }),
      //   this.getAreaSearchInfo({ id: res.data.cityId }).then(res => {
      //     cityId = res.data.name
      //   }),
      //   this.getAreaSearchInfo({ id: res.data.areaId }).then(res => {
      //     areaId = res.data.name
      //   })
      // ])
      this.formDatas = { ...res.data, createdTime, updatedTime, provinceId, cityId, areaId }
      // console.log(this.formDatas)
    //   this.setFormDatas(this.popOptions, res.data)
    },

    // 点击更改所有人
    async okClick(params) {
      // console.log(params)
      const res = await api.competitorModifyFollower({ ...params, id: this.routeId })
      if (res.code !== 200) {
        return false
      }
      this.$message.success('更改所有人成功')
      this.$set(this.OwnerPopOptions, 'visible', false)
      // this.$emit('visibleClick', false)
      // this.visible = false
      // console.log(this.visible)
      this.getCompetitorInfoDisplay({ id: this.routeId })
    }
  },
  computed: {}
}
