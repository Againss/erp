import * as api from '../api/index'
export const SpecificGravity = {
  mounted() {
    this.getSpecificGravityList()
  },
  methods: {
    /* 列表 */
    async getSpecificGravityList(params = {}) {
      this.loading = true
      const res = await api.getSpecificGravityData(params)
      if (this.$pub.responseValidate(res)) {
        this.loading = false
        const data = res.data; const list = []
        data.list.forEach(item => {
          list.push({
            assessDimension: item.assessDimension,
            status: item.status,
            edit: false,
            id: item.id,
            specifics: item.specifics
          })
        })
        this.$set(this.searchData[0], 'dataSource', list)
        this.specificsList = list
        this.rowCopy = { ...list }
        this.pagination = {
          ...this.pagination,
          dataTotal: data.total,
          ...params,
          currentPage: data.pageNum,
          pageSize: data.pageSize
        }
      }
    },
    async getSpecificGravityDetailsById({ ids }) {
      if (!ids) return false
      const res = await api.getSpecificGravityDetailsByIdData(ids)
      if (this.$pub.responseValidate(res)) {
        this.$set(this.dialogSpecificGravityVisable, 'formDatas', res.data)
        this.$set(this.dialogSpecificGravityVisable, 'title', '修改')
        this.$set(this.dialogSpecificGravityVisable, 'visible', true)
      }
    },
    showSpecificGravityDialog(params) {
      this.$set(this.dialogSpecificGravityVisable, 'formDatas', params.row)
      this.$set(this.dialogSpecificGravityVisable, 'visible', true)
    },
    refactorSpecificsList() {
      const dataList = []; let sumNun = 0
      if (this.specificsList.length > 0) {
        this.specificsList.map(item => {
          dataList.push({ id: item.id, specifics: item.specifics })
          sumNun += Number(item.specifics)
        })
      }
      return { sumNun, dataList }
    },
    /* 保存 */
    async updateSpecificGravity() {
      const { dataList, sumNun } = this.refactorSpecificsList()
      if (sumNun !== 100) {
        this.$message({
          message: '考核比重之和必须等于100！',
          type: 'error'
        })
        return false
      }
      const res = await api.updateSpecificGravityData({ dataList })
      if (this.$pub.responseValidate(res)) {
        // const { beforeCode, afterCode } = this.compareData(this.rowCopy, { dataList }, 'id')
        // const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
        this.fetchLog(this.getLogMessages('UPDATE', '/srm/assessSpecific/modifyBatch'), { dataList }, JSON.stringify({ beforeText: `在'供应商采购管理-考核比重,将`, afterText: '修改为', beforeCode: this.rowCopy, afterCode: dataList }))
        const callback = this.getSpecificGravityList
        const options = {
          type: 'update',
          message: '保存成功！',
          api: '',
          callback,
          callbackParams: {
            pageNum: this.pagination.currentPage,
            pageSize: this.pagination.pageSize
          },
          logParams: {},
          dialog: this.dialogSpecificGravityVisable
        }
        this.$pub.handleSuccessfully(options)
      }
    },
    /* 禁用 */
    async disableSpecificGravity(params = {}) {
      const res = await api.disableSpecificGravityData(params)
      if (this.$pub.responseValidate(res)) {
        this.fetchLog(this.getLogMessages('UPDATE', '/srm/assessSpecific/operate'), params, JSON.stringify({ beforeText: `在'供应商采购管理-考核比重'${params.status ? '启用' : '禁用'}一条数据`, beforeCode: params }))
        const callback = this.getSpecificGravityList
        const message = (params.status === 1) ? '已启用！' : '已禁用！'
        const options = {
          type: 'disable',
          message,
          api: '/srm/assessSpecific/operate',
          callback,
          callbackParams: {
            pageNum: this.pagination.currentPage,
            pageSize: this.pagination.pageSize
          },
          logParams: {}
        }
        this.$pub.handleSuccessfully(options)
      }
    },
    setinlineFormDatas(params) {
      this.$set(this.formDatas, params.key, params.value)
    }
  }
}
