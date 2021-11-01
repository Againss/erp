import * as api from '../api/index'
export const Contract = {
  methods: {
    // 获取合同详情并显示
    async getContractInfoDisplay(data = {}) {
      const res = await api.contractInfo(data)
      //   console.log('详情', res)
      const gender = res.data.gender && res.data.gender === 'M' ? '男' : '女'
      const createdTime = res.data.createdTime && this.$filters.parseTime(res.data.createdTime + '', '{y}-{m}-{d} {h}: {i}: {s}')
      const updatedTime = res.data.updatedTime && this.$filters.parseTime(res.data.updatedTime + '', '{y}-{m}-{d} {h}: {i}: {s}')
      const startTime = res.data.startTime && this.$filters.parseTime(res.data.startTime + '', '{y}-{m}-{d}')
      const endTime = res.data.endTime && this.$filters.parseTime(res.data.endTime + '', '{y}-{m}-{d}')
      const contractDate = res.data.contractDate && this.$filters.parseTime(res.data.contractDate + '', '{y}-{m}-{d}')
      const totalAmount = res.data.totalAmount ? this.numRecursion(res.data.totalAmount / 10000) : ''
      this.follower = res.data.follower
      this.contractFormDatas = { ...res.data, createdTime, updatedTime, gender, contractDate, startTime, endTime, totalAmount }
      //   this.setFormDatas(this.contractPopOptions, res.data)
    },

    // 获取合同详情
    async getContractInfo(data = {}) {
      const res = await api.contractInfo(data)
      console.log('详情', res)
      this.customerName = res.data.customerName
    },

    // 点击更改所有人
    async okClick(params) {
      // console.log(params)
      const res = await api.contractModifyFollower({ ...params, id: this.routeId })
      if (res.code !== 200) {
        return false
      }
      this.$message.success('更改所有人成功')
      // this.$emit('visibleClick', false)
      this.$set(this.OwnerPopOptions, 'visible', false)
      // console.log(this.visible)
      this.getContractInfoDisplay({ id: this.routeId })
    },

    // 点击更改附件所有人
    async okEnclosureClick(params) {
      console.log(params)
      const res = await api.fileModifyFollower({ ...params })
      if (res.code !== 200) {
        return false
      }
      this.$message.success('更改附件所有人成功')
      // this.$emit('visibleClick', false)
      this.$set(this.enclosureOwnerPopOptions, 'visible', false)
      // console.log(this.visible)
      this.getfilePage()
    },

    // 获取合同附件分页列表
    async getfilePage(data = {}) {
      const res = await api.filePage({ bizId: this.routeId, bizType: 'CONTRACT', dataTag: 'ALL', ...data })
      console.log('合同', res)
      const userList = res.data.list || []
      //   this.dataSource = userList
      this.fileDataSource = userList
      this.fileTotal = res.data.total
      this.relevantEnclosureOptions && this.$set(this.relevantEnclosureOptions, 'dataSource', userList)
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },

    // 预览合同附件
    async previewEnclosure(data = {}) {
      const res = await api.filePreview(data)
      console.log('下载', res)
      if (res.code !== 200) {
        return false
      }
      window.open(res.data.url)
    },

    // 下载合同附件
    async downloadEnclosure(data = {}) {
      console.log('daa', data)
      const res = await api.fileDownload(data)
      console.log('下载', res)
      // if (res.code !== 200) {
      //   return false
      // }
      this.$utils.downloadStream(res)
      // window.open(res.data.url)
    },

    // 删除合同附件
    async deleteEnclosure(data = {}) {
      const res = await api.fileDelete(data)
      console.log('删除', res)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功')
      this.getfilePage()
    },

    // 为pdf显示可以点击
    isNotPointer(scope) {
      if (scope.columnIndex === 1 && (scope.row.suffix === 'PDF' || scope.row.suffix === 'pdf')) {
        return {
          color: '#1890ff',
          cursor: 'pointer'
        }
      } else {
        return {
          cursor: 'auto',
          color: '#606266'
        }
      }
    }

    // 更改合同附件所有人
    // async enclosureChangeOwner(data = {}) {
    //   const res = await api.fileModifyFollower(data)
    //   console.log('更改所有人', res)
    //   if (res.code !== 200) {
    //     return false
    //   }
    //   this.$message.success('更改合同附件所有人成功')
    //   this.getfilePage({ bizId: this.routeId, bizType: 'CONTRACT' })
    // }

  }
}
