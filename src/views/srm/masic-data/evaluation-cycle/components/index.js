import * as api from '../api/index'
export const EvaluationCycle = {
  created() {
    this.getEvaluationCycleList()
  },
  methods: {
    /* 列表 */
    async getEvaluationCycleList(params = {}) {
      this.loading = true
      const res = await api.getEvaluationCycleData(params)
      if (this.$pub.responseValidate(res)) {
        this.loading = false
        const data = res.data
        this.dataSource = data.list || []
        this.pagination = {
          ...this.pagination,
          dataTotal: data.total,
          ...params,
          currentPage: data.pageNum,
          pageSize: data.pageSize
        }
      }
    },
    /* 禁用 */
    async disableEvaluationCycle(params = {}) {
      const status = params.status ^ 1
      this.$set(params, 'status', status)
      const res = await api.disableTypeSupplierData(params)
      if (this.$pub.responseValidate(res)) {
        this.fetchLog(this.getLogMessages('UPDATE', '/srm/supplierType/operate'), params, JSON.stringify({ beforeText: `在'供应商采购管理-考核周期'${status ? '启用' : '禁用'}一条数据`, beforeCode: params }))
        const message = (status === 1) ? '已启用！' : '已禁用！'
        const callback = this.getEvaluationCycleList
        const options = {
          type: 'disable',
          message,
          api: '/srm/assessmentPeriod/operate',
          callback,
          callbackParams: {
            pageNum: this.pagination.currentPage,
            pageSize: this.pagination.pageSize
          },
          logParams: {}
        }
        this.$pub.handleSuccessfully(options)
      }
    }
  }
}
